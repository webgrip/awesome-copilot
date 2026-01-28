import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://github.github.io',
  base: '/awesome-copilot/',
  output: 'static',
  integrations: [sitemap()],
  build: {
    assets: 'assets',
  },
  trailingSlash: 'always',
});
