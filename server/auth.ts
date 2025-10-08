// Authentication setup - referenced by javascript_auth_all_persistance integration
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import rateLimit from "express-rate-limit";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  // Handle edge cases
  if (!supplied || !stored) {
    return false;
  }
  
  const parts = stored.split(".");
  
  // Check if the stored password has the expected format (hash.salt)
  if (parts.length !== 2) {
    console.error("Invalid password format in database - expected 'hash.salt' format");
    return false;
  }
  
  const [hashed, salt] = parts;
  
  // Validate that hashed is a valid hex string
  if (!hashed || !/^[0-9a-f]+$/i.test(hashed)) {
    console.error("Invalid hash format in stored password");
    return false;
  }
  
  try {
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    
    // Additional check to ensure buffers are the same length before comparison
    if (hashedBuf.length !== suppliedBuf.length) {
      console.error(`Buffer length mismatch: stored=${hashedBuf.length}, supplied=${suppliedBuf.length}`);
      return false;
    }
    
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
}

export function setupAuth(app: Express) {
  // Trust proxy must be set before rate limiters
  app.set("trust proxy", 1);

  // Ensure SESSION_SECRET is set in production
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET environment variable is required in production");
  }

  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret || randomBytes(32).toString("hex"),
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  };

  // Rate limiter for authentication endpoints to prevent brute-force attacks
  const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Max 10 requests per window per IP
    standardHeaders: true,
    legacyHeaders: false,
    // Extract IP from forwarded headers or socket
    keyGenerator: (req) => {
      const forwarded = req.headers['x-forwarded-for'] as string;
      const ip = forwarded ? forwarded.split(',')[0].trim() : 
                req.socket.remoteAddress || 'unknown';
      return ip;
    },
    handler: (req, res) => {
      res.status(429).json({ message: "Too many requests, please try again later" });
    },
    skipSuccessfulRequests: false, // Count all attempts
  });
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", authRateLimiter, async (req, res, next) => {
    try {
      const { username, password, email } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      // Check if this is the first user (bootstrap scenario)
      const userCount = await storage.getUserCount();
      const isBootstrap = userCount === 0;

      // After bootstrap, only authenticated admins can create new users
      if (!isBootstrap && !req.isAuthenticated()) {
        return res.status(403).json({ 
          message: "Registration is restricted. Please contact an administrator." 
        });
      }

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Registration failed, please try again" });
      }

      const user = await storage.createUser({
        username,
        password: await hashPassword(password),
        email: email || null,
        role: "admin",
      });

      // Only auto-login during bootstrap
      if (isBootstrap) {
        req.login(user, (err) => {
          if (err) return next(err);
          const userWithoutPassword = { ...user, password: undefined };
          res.status(201).json(userWithoutPassword);
        });
      } else {
        const userWithoutPassword = { ...user, password: undefined };
        res.status(201).json(userWithoutPassword);
      }
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", authRateLimiter, (req, res, next) => {
    passport.authenticate("local", (err: any, user: SelectUser | false, info: any) => {
      if (err) {
        console.error("Login authentication error:", err);
        return res.status(500).json({ 
          message: "Authentication error occurred",
          error: process.env.NODE_ENV === "development" ? err.message : undefined
        });
      }
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      req.login(user, (err) => {
        if (err) {
          console.error("Login session error:", err);
          return res.status(500).json({ 
            message: "Session error occurred",
            error: process.env.NODE_ENV === "development" ? err.message : undefined
          });
        }
        const userWithoutPassword = { ...user, password: undefined };
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userWithoutPassword = { ...req.user, password: undefined };
    res.json(userWithoutPassword);
  });
}