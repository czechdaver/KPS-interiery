# Setup a vývoj

## Předpoklady
- macOS
- Node.js 20+
- npm (primárně pro CI i lokálně)
- (Volitelně) Bun — můžete použít lokálně dle preferencí

## Inicializace projektu (provedeno)
- Scaffold: `create-qwik` (projekt ve složce `app/`)
- Přidáno: Tailwind v4 + PostCSS, Tailwind Variants, SASS, Biome, Stylelint.

## Vývoj
1. Spusťte dev server:
   ```sh
   cd app
   npm install
   npm run dev
   ```
2. Otevřete: http://localhost:5173/

## Skripty (v `app/package.json`)
- `dev` — Dev server (SSR)
- `build` — Qwik build (generuje plan)
- `build:static` — Statický build pro GitHub Pages (Qwik build + Vite static adapter)
- `preview` — Náhled produkčního buildu
- `typecheck` — TypeScript bez emitu
- `format` — Biome format
- `lint:biome` — Biome lint
- `lint:css` — Stylelint pro CSS/SCSS

## Build & Deploy (GitHub Pages)

- Spusťte statický build:
  ```sh
  cd app
  npm run build:static
  # výstup v app/dist (obsahuje index.html)
  ```
- Nasazení probíhá automaticky přes GitHub Actions (`.github/workflows/deploy.yml`).
- Vite `base` se nastavuje dynamicky proměnnou `PAGES_BASE_PATH` (user/org stránka => `/`, projektová stránka => `/<repo>/`).

## Tailwind v4
- Vstupní CSS: `src/styles/tailwind.css` s `@import url("tailwindcss");`
- PostCSS: `postcss.config.mjs` s `@tailwindcss/postcss`, `postcss-preset-env`, `autoprefixer`

## Další konfigurace
- Vite config: `app/vite.config.ts`
- Static adapter config: `app/adapters/static/vite.config.ts`

<!-- Blog byl odstraněn z projektu i dokumentace -->
