const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

async function build() {
  try {
    // Create dist directory if it doesn't exist
    const distPath = path.resolve(__dirname, 'dist/public');
    if (!fs.existsSync(distPath)) {
      fs.mkdirSync(distPath, { recursive: true });
    }

    // Build the React app
    await esbuild.build({
      entryPoints: ['client/src/main.tsx'],
      bundle: true,
      minify: true,
      sourcemap: true,
      outfile: 'dist/public/bundle.js',
      loader: {
        '.tsx': 'tsx',
        '.ts': 'ts',
        '.jsx': 'jsx',
        '.js': 'js',
        '.css': 'css',
        '.png': 'dataurl',
        '.svg': 'dataurl',
        '.webp': 'dataurl',
      },
      define: {
        'process.env.NODE_ENV': '"production"',
        'import.meta.env.DEV': 'false',
        'import.meta.env.PROD': 'true',
      },
      jsx: 'automatic',
      alias: {
        '@': path.resolve(__dirname, 'client/src'),
        '@shared': path.resolve(__dirname, 'shared'),
        '@assets': path.resolve(__dirname, 'attached_assets'),
      },
      external: [],
      platform: 'browser',
      target: 'es2020',
    });

    // Copy CSS files
    const cssSource = path.resolve(__dirname, 'client/src/index.css');
    const cssDest = path.resolve(__dirname, 'dist/public/index.css');
    if (fs.existsSync(cssSource)) {
      fs.copyFileSync(cssSource, cssDest);
    }

    // Create index.html
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Stage Senior</title>
    <link rel="stylesheet" href="/index.css">
  </head>
  <body>
    <div id="root"></div>
    <script src="/bundle.js"></script>
  </body>
</html>`;

    fs.writeFileSync(path.join(distPath, 'index.html'), htmlContent);
    
    console.log('Build completed successfully!');
    console.log('Output directory:', distPath);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();