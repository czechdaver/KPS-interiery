# KPS Interiéry — Qwik + Qwik City

This repository hosts the KPS Interiéry website built with Qwik + Qwik City and deployed to GitHub Pages. The web app lives under `app/` and is built as a fully static site using the Qwik City static adapter.

## Project Structure

- `app/` — Qwik app root
  - `src/` — components, routes, styles
  - `src/routes/` — file‑based routing (Qwik City)
  - `vite.config.ts` — Vite config with dynamic base for Pages
  - `adapters/static/vite.config.ts` — Qwik City static adapter config
  - `dist/` — build output
- `docs/` — product docs (tech stack, setup, content)

## Tech Stack

- Qwik + Qwik City (`@builder.io/qwik`, `@builder.io/qwik-city`)
- Vite 5
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- Tailwind Variants (`tailwind-variants`)
- PostCSS (`@tailwindcss/postcss`, `postcss-preset-env`, `autoprefixer`)
- TypeScript
- Biome (TS/JS formatter & linter)
- Stylelint (CSS/SCSS)
- SASS

See `docs/techstack.md` for details.

## Prerequisites

- Node.js 20+
- Package manager: npm (CI uses npm). You may also use Bun locally if preferred.

## Getting Started

1) Install dependencies

```sh
cd app
npm install
```

2) Start dev server

```sh
npm run dev
# open http://localhost:5173
```

## Build & Preview

- Build static site (required for GitHub Pages):

```sh
npm run build:static
# outputs to app/dist
```

- Preview production build locally:

```sh
npm run preview
```

## Deployment (GitHub Pages)

Deployments are automated via GitHub Actions (`.github/workflows/deploy.yml`). The workflow:

- Builds from `app/`
- Exports `PAGES_BASE_PATH` for correct Vite base:
  - User/org pages: base = `/`
  - Project pages: base = `/<repo-name>/`
- Runs `npm run build:static` (Qwik City static adapter) to generate `dist/index.html`
- Publishes `app/dist` to GitHub Pages and copies `404.html` for SPA routing fallback

## Troubleshooting CI

- Rollup native prebuilds on Linux CI can fail. The workflow sets:
  - `ROLLUP_SKIP_NODE_NATIVE=1`
  - `ROLLUP_DISABLE_NATIVE=1`
- It also performs a fresh install without reusing a lockfile cache.

If a build fails, check the latest GitHub Actions logs.

## Useful Scripts (in `app/package.json`)

- `dev` — start dev server (SSR)
- `build` — Qwik build (generates plan)
- `build:static` — Qwik build + static adapter build (Pages)
- `preview` — preview production build

## License

Private project. All rights reserved.
