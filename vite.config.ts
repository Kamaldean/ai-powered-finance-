import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // Ensures correct asset loading
  server: {
    host: "localhost", // Ensures Vite binds to localhost
    port: 5173, // Default Vite port (change if needed)
  },
});
