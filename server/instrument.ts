import * as Sentry from "@sentry/node";

// Initialize Sentry for error tracking and performance monitoring
// This must be imported before any other modules
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    
    // Include request headers and user IP (useful for debugging)
    sendDefaultPii: true,
  });
}

export { Sentry };
