import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves project sites from /<repo-name>/
  base: command === "build" ? "/05-notehub/" : "/",
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
}));
