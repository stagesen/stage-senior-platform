import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import path from "path";
import fs from "fs";

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
  
  // Error handling middleware for API routes
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    if (_req.path.startsWith('/api')) {
      res.status(status).json({ message });
      console.error(err);
    } else {
      _next(err);
    }
  });
  
  // Serve static assets
  const assetsPath = path.resolve(__dirname, '..', 'attached_assets');
  app.use('/attached_assets', express.static(assetsPath));
  
  // In development, use a simple approach to serve the React app
  // Create a development HTML file that loads React modules directly
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'Not found' });
    }
    
    // Serve the main HTML file with module loading
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Stage Senior</title>
    <script type="module">
      // Development mode - load React and the app directly
      import React from 'https://esm.sh/react@18.3.1';
      import ReactDOM from 'https://esm.sh/react-dom@18.3.1/client';
      
      // For development, we'll need to set up a simple loader
      window.addEventListener('DOMContentLoaded', () => {
        const root = document.getElementById('root');
        if (root) {
          root.innerHTML = '<div style="padding: 20px; font-family: sans-serif;"><h1>Frontend Setup Required</h1><p>The frontend needs to be built first. The API is running at <a href="/api/communities">/api/communities</a></p><p>Available API endpoints:</p><ul><li>/api/communities</li><li>/api/posts</li><li>/api/events</li><li>/api/galleries</li><li>/api/team-members</li><li>/api/testimonials</li><li>/api/floor-plans</li><li>/api/faqs</li></ul></div>';
        }
      });
    </script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
  });
  
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    console.log(`Development server running on port ${port}`);
    console.log(`Visit http://localhost:${port} to see the app`);
    console.log(`API endpoints available at http://localhost:${port}/api/*`);
  });
})();