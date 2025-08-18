import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  // When building on GitHub Pages via Actions, set GITHUB_PAGES=true
  // Optionally pass PAGES_BASE_PATH to control the base path (defaults to repo name in the workflow)
  const isGitHubPages = process.env.GITHUB_PAGES === "true";
  const basePath = isGitHubPages
    ? `/${process.env.PAGES_BASE_PATH || ""}/`
    : "/";

  return {
    base: basePath,
    build: {
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: isDev,
      minify: !isDev,
      cssMinify: !isDev,
      terserOptions: isDev ? { compress: false, mangle: false } : undefined,
    },
    define: { "process.env.NODE_ENV": JSON.stringify(mode) },
    esbuild: { jsx: "automatic", jsxImportSource: "react" },
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          { src: "./assets/*", dest: "assets" },
          {
            src: "./public/assets/{*,}",
            dest: path.join("dist", "public/assets"),
          },
          { src: "./assets/*", dest: path.join("dist", "assets") },
        ],
        silent: true,
      }),
      tsconfigPaths(),
    ],
    resolve: {},
  };
});
