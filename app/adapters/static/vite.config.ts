import { defineConfig, mergeConfig, type UserConfig } from 'vite';
import baseConfig from '../../vite.config';
import { staticAdapter } from '@builder.io/qwik-city/adapters/static/vite';

// Qwik City Static Adapter for GitHub Pages
// Generates a fully static site with prerendered HTML (including index.html)
export default defineConfig((): UserConfig => {
  // baseConfig is a factory; call it to get the actual config
  const base = (baseConfig as unknown as () => UserConfig)();
  return mergeConfig(base, {
    build: {
      outDir: 'dist',
      ssr: 'src/entry.ssr.tsx',
      rollupOptions: {
        input: [
          'src/entry.ssr.tsx',
          '@qwik-city-plan',
        ],
      },
    },
    plugins: [
      ...(base.plugins || []),
      staticAdapter({
        origin: '',
      }),
    ],
  });
});
