import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages Project-Page: https://jaegerjoschi.github.io/weingut-ehrlich/
  // Bei eigener Domain (CNAME) stattdessen base: "/".
  base: "/weingut-ehrlich/",
  plugins: [react()],
  server: {
    host: true,
  },
});
