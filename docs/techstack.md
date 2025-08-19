# Tech Stack

- **Qwik** — Resumable framework s O(1) načítáním (`@builder.io/qwik`).
- **Qwik City** — File‑based routing a adaptery (`@builder.io/qwik-city`).
- **Qwik City Static Adapter** — Generuje plně statický web pro GitHub Pages (`app/adapters/static/vite.config.ts`).
- **Vite 5** — Dev server a bundler. Konfigurace v `app/vite.config.ts` (dynamický `base` přes `PAGES_BASE_PATH`).
- **TailwindCSS v4** — Utility‑first CSS přes PostCSS plugin `@tailwindcss/postcss`.
- **Tailwind Variants** — API `tv()` pro varianty (`tailwind-variants`).
- **PostCSS** — `@tailwindcss/postcss`, `postcss-preset-env`, `autoprefixer`.
- **TypeScript** — `tsconfig.json` v `app/`.
- **Biome** — Formátování a lint pro TS/JS (`app/biome.json`).
- **Stylelint** — Lint pro CSS/SCSS (`app/.stylelintrc.json`).
- **SASS** — Preprocesor pro SCSS (`sass`).
- **Package manager** — Primárně `npm` (CI). Lokálně lze volitelně používat Bun.
 

## Umístění

- Aplikace: `app/`
- Routy: `app/src/routes/`
- Tailwind vstup: `app/src/styles/tailwind.css`
- SCSS příklad: `app/src/styles/example.scss`
- PostCSS config: `app/postcss.config.mjs`
- Biome config: `app/biome.json`
- Stylelint config: `app/.stylelintrc.json`
- Vite config: `app/vite.config.ts`
- Static adapter config: `app/adapters/static/vite.config.ts`
- GitHub Actions workflow: `.github/workflows/deploy.yml`

## Build & Deploy

- Statický build (Pages): `npm run build:static` (spouští `qwik build` a poté Vite s static adapterem)
- Výstup: `app/dist/` (obsahuje `index.html` a `404.html` pro SPA fallback)
- Lokální náhled: `npm run preview`

## CI (GitHub Actions)

- Nasazuje `app/dist` na GitHub Pages.
- Nastavuje `PAGES_BASE_PATH` dle typu stránky (user/org vs. project page).
- Pro stabilitu Rollupu na Linux CI nastavuje:
  - `ROLLUP_SKIP_NODE_NATIVE=1`
  - `ROLLUP_DISABLE_NATIVE=1`
  
