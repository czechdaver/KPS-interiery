# Setup a vývoj

## Předpoklady
- macOS
- Homebrew
- Bun (`brew install oven-sh/bun/bun`)

## Inicializace projektu (provedeno)
- Scaffold: `bunx create-qwik@latest empty app -i`
- Instalace: Tailwind v4 + PostCSS, Tailwind Variants, SASS, Biome, Stylelint.

## Vývoj
1. Spusťte dev server:
   ```sh
   cd app
   bun run dev
   ```
2. Otevřete: http://localhost:5173/

## Skripty (v `app/package.json`)
- `dev` — Dev server (SSR)
- `build` — Build
- `preview` — Náhled buildu
- `typecheck` — TypeScript bez emitu
- `format` — Biome format
- `lint:biome` — Biome lint
- `lint:css` — Stylelint pro CSS/SCSS

## Tailwind v4
- Vstupní CSS: `src/styles/tailwind.css` s `@import url("tailwindcss");`
- PostCSS: `postcss.config.mjs` s `@tailwindcss/postcss`, `postcss-preset-env`, `autoprefixer`

<!-- Blog byl odstraněn z projektu i dokumentace -->
