import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react() , tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4001", //Express Backend
        changeOrigin: true, //Needed for virtual hosted sites
        secure: false, // Set to true for HTTPS
      },
    },
  },
});
