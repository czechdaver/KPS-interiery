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

## ⚠️ Statická architektura

**Web je plně statický (GitHub Pages) = ŽÁDNÝ backend není možný!**

### Co NEFUNGUJE:
- ❌ Backend API routes
- ❌ Server-side environment variables
- ❌ Databáze
- ❌ Server-side služby (Resend, SendGrid, atd.)
- ❌ Node.js knihovny na serveru

### Co FUNGUJE:
- ✅ Static HTML/CSS/JS
- ✅ Client-side JavaScript
- ✅ Externí API volání (fetch)
- ✅ routeLoader$ (pre-renderuje se při buildu)

## Kontaktní formulář

**Technologie**: Web3Forms (externí API)
**Implementace**: Client-side (fetch API)
**Spam ochrana**: hCaptcha (automatická integrace)

### Závislosti:
- **Web3Forms Client Script**: `https://web3forms.com/client/script.js`
  - Načítá se v `app/src/root.tsx`
  - Automaticky integruje hCaptcha widget
  - Validuje captcha před odesláním
- **Access Key**: `720d65a7-bfb4-4a2c-9059-8c7182decfdd`
- **Příjemce**: `info@kps-interiery.cz`

### Soubory:
- `app/src/components/ContactSection.tsx` — Kontaktní formulář komponenta
- `app/src/root.tsx` — Web3Forms script tag (řádek 65)
- `form-info.md` — Podrobná dokumentace implementace

