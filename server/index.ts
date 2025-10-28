import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
// Enable gzip compression for all responses
app.use(compression());
// Increase JSON body limit to 50MB to support database imports
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // Add cache-control middleware for production static assets
    app.use((req, res, next) => {
      const requestPath = req.path;
      
      // Cache hashed assets (Vite hash format: name-hash.ext like home-BPDd6tVQ.js) for 1 year
      if (requestPath.match(/-[A-Za-z0-9_-]{8,}\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|webp|ico)$/i)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
      // Don't cache HTML files - always check for updates
      else if (requestPath.endsWith('.html') || requestPath === '/' || !requestPath.includes('.')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
      // Default cache for other static assets without content hash (1 day)
      else if (requestPath.match(/\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|webp|ico)$/i)) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
      
      next();
    });
    
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
