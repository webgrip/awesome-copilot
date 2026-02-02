import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// Support dynamic base path for PR previews via ASTRO_BASE env var
const base = process.env.ASTRO_BASE || "/";

// https://astro.build/config
export default defineConfig({
  site: "https://github.github.io",
  base: base,
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
