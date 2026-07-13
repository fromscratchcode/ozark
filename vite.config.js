import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  optimizeDeps: {
    // memphis-js uses wasm-bindgen output that resolves memphis_bg.wasm
    // relative to import.meta.url. If Vite prebundles the dependency, that
    // lookup can point at the optimized chunk instead of the package asset.
    exclude: ["@fromscratchcode/memphis-js"],
  },
  build:
    mode === "lib"
      ? {
          lib: {
            entry: "./src/index.ts",
            formats: ["es"],
            // Write the built library bundle to dist/index.js.
            fileName: () => "index.js",
          },
          rollupOptions: {
            external: ["react", "react-dom"],
          },
        }
      : undefined,
}));
