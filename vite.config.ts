import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

/**
 * Vite build config for a Manifest V3 Chrome Extension.
 *
 * Outputs:
 *  - dist/sidepanel/index.html  — the side panel React app
 *  - dist/background/serviceWorker.js — the MV3 service worker (ES module)
 *  - dist/manifest.json + dist/icons/ — copied from /public
 */
export default defineConfig({
  plugins: [react()],

  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    minify: true,

    rollupOptions: {
      input: {
        // Side panel entry (React app)
        sidepanel: resolve(__dirname, "src/sidepanel/index.html"),
        // Background service worker
        serviceWorker: resolve(__dirname, "src/background/serviceWorker.ts"),
      },
      output: {
        // Put the service worker at a predictable path
        entryFileNames: (chunk) => {
          if (chunk.name === "serviceWorker") {
            return "background/serviceWorker.js";
          }
          return "assets/[name]-[hash].js";
        },
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },

  // Resolve aliases
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
