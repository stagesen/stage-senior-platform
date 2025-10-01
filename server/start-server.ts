// Set environment to production to skip Vite development features
process.env.NODE_ENV = 'production';
// Unset REPL_ID to skip problematic Replit Vite plugins
delete process.env.REPL_ID;

// Now import and run the main server
import('./index');