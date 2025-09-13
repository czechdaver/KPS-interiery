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

## ⚠️ Důležité: Řešení problémů se spuštěním

### Problém: Server se nespustí nebo hlásí "connection refused"
**Příčina:** Konflikt mezi React a QwikCity entry points.

**Řešení:** 
```sh
# Zálohujte konfliktní soubory
mv index.html index.html.backup
mv main.tsx main.tsx.backup

# Spusťte server znovu
npm run dev
```

### Proč k tomu dochází:
- Projekt používá QwikCity SSR, ale obsahuje i React soubory (`index.html`, `main.tsx`)
- Tyto soubory konkurují s QwikCity entry points (`entry.ssr.tsx`, `entry.dev.tsx`)
- Vite je nakonfigurován pro QwikCity, ale React soubory mají přednost

### Ověření správného nastavení:
```sh
# Měly by existovat jen QwikCity entry points:
ls -la src/entry.*  # měly by být: entry.dev.tsx, entry.preview.tsx, entry.ssr.tsx

# Neměly by existovat v kořeni app/:
ls index.html main.tsx 2>/dev/null || echo "✅ Správně nastaveno"
```

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
