
import { defineConfig } from 'vite';
import path from "path";
// @ts-ignore
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    tailwindcss()
  ],
  resolve: {
    alias: {
      "$": path.resolve(__dirname, "src")
    }
  }
});
