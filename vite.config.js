import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build:
    mode === "lib"
      ? {
          lib: {
            entry: "./src/index.js",
            formats: ["es"],
            fileName: () => "index.js",
          },
          rollupOptions: {
            external: ["react", "react-dom"],
          },
        }
      : undefined,
}));
