// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://kps-interiery.cz',
  trailingSlash: 'ignore',
  output: 'static',
  integrations: [sitemap({ filter: (page) => !page.includes('/admin') }), icon()],
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  vite: { plugins: [tailwindcss()] },
});
