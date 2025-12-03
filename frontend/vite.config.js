// frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite config for GitHub Pages deployment.
 *
 * - When GH_PAGES env var is "true" (set in the GitHub Actions workflow),
 *   the build `base` becomes "/Data_Encryption_File_Security_Tool/" so
 *   assets are referenced correctly on GitHub Pages.
 *
 * - Locally (dev) the base remains "/" so `vite dev` works normally.
 */
const repoName = "Data_Encryption_File_Security_Tool";
const isGhPages = String(process.env.GH_PAGES).toLowerCase() === "true";

export default defineConfig({
  plugins: [react()],
  base: isGhPages ? `/${repoName}/` : "/",
  // optional: you can tune build output if needed
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  },
});
