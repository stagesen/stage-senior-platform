// Simple development server wrapper that uses dynamic import
// to avoid CommonJS issues with top-level await in vite.config.ts

async function startDevServer() {
  try {
    // Use dynamic import to load the TypeScript server file
    await import('tsx/cli').then(tsx => {
      // Execute the server/index.ts file
      require('child_process').spawn('npx', ['tsx', 'server/index.ts'], {
        stdio: 'inherit',
        shell: true
      });
    });
  } catch (error) {
    console.error('Failed to start dev server:', error);
    
    // Fallback to api-server if main server fails
    console.log('\nFalling back to API server...');
    require('child_process').spawn('npx', ['tsx', 'server/api-server.ts'], {
      stdio: 'inherit',
      shell: true
    });
  }
}

startDevServer();