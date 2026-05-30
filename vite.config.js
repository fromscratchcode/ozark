import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
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
