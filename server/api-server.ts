import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS for frontend development
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  next();
});

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });
  
  next();
});

(async () => {
  const server = await registerRoutes(app);
  
  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    res.status(status).json({ message });
    console.error(err);
  });
  
  // Serve a basic status page
  app.get("/", (_req, res) => {
    res.json({ 
      status: "API Server Running",
      message: "The API server is running. Frontend development requires fixing the Vite configuration.",
      endpoints: [
        "/api/communities",
        "/api/posts", 
        "/api/events",
        "/api/galleries",
        "/api/team-members",
        "/api/testimonials",
        "/api/floor-plans",
        "/api/faqs"
      ]
    });
  });
  
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    console.log(`API server running on port ${port}`);
    console.log(`Visit http://localhost:${port} to see available endpoints`);
  });
})();