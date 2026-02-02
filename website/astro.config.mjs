import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://github.github.io",
  base: "/",
  output: "static",
  integrations: [sitemap()],
  build: {
    assets: "assets",
  },
  trailingSlash: "always",
  vite: {
    build: {
      sourcemap: true,
    },
    css: {
      devSourcemap: true,
    },
  },
});
