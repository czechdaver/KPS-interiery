# Tech Stack

- **Qwik** — Resumable framework s O(1) načítáním. Balíček: `@builder.io/qwik`.
- **Qwik City** — Full‑stack meta‑framework, file‑based routing. Balíček: `@builder.io/qwik-city`.
- **Vite** — Rychlý dev server a bundler. Konfigurace v `app/vite.config.ts`.
- **Bun** — Rychlé JS runtime + package manager. Používáme `bun`/`bunx`.
- **TailwindCSS v4 (alpha)** — Utility‑first CSS, integrace přes PostCSS plugin `@tailwindcss/postcss`.
- **Tailwind Variants** — API `tv()` pro varianty nad Tailwind třídami. Balíček: `tailwind-variants`.
- **PostCSS** — Transformace CSS, pluginy: `@tailwindcss/postcss`, `postcss-preset-env`, `autoprefixer`.
- **PostCSS Preset Env** — Moderní CSS featury a polyfilly.
- **Autoprefixer** — Automatické vendor prefixy.
- **Biome** — Formátovač a linter pro TS/JS. Konfig: `app/biome.json`.
- **Stylelint** — Linter pro CSS/SCSS. Konfig: `app/.stylelintrc.json`.
- **SASS** — Preprocesor pro SCSS (`sass`).
- **TypeScript** — Typový systém, `tsconfig.json` v `app/`.
 

## Umístění

- Aplikace: `app/`
- Routy: `app/src/routes/`
- Tailwind vstup: `app/src/styles/tailwind.css`
- SCSS příklad: `app/src/styles/example.scss`
- PostCSS config: `app/postcss.config.mjs`
- Biome config: `app/biome.json`
- Stylelint config: `app/.stylelintrc.json`
