import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // CRITICAL: React must be in its own chunk that loads first
          // This prevents "Cannot read properties of undefined (reading 'forwardRef')" errors
          'vendor-react': [
            'react',
            'react-dom',
            'react/jsx-runtime'
          ],
          // Separate admin into its own chunk (large and rarely used)
          'admin': [
            './client/src/pages/admin.tsx'
          ],
          // Separate react-query and other heavy dependencies
          'vendor-query': [
            '@tanstack/react-query',
            '@tanstack/query-core'
          ],
          // Separate chart/map libraries (heavy)
          'vendor-maps': [
            'leaflet',
            'react-leaflet',
            '@react-leaflet/core'
          ],
          // Separate UI components library
          'vendor-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-accordion',
            '@radix-ui/react-toast'
          ]
        }
      }
    }
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
