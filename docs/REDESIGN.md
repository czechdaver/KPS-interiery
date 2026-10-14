# KPS Interiéry v2 — redesign brief (zdroj pravdy pro všechny workery)

## Stack
- **Astro 7** (statický výstup, GitHub Pages, doména kps-interiery.cz, base `/`), TypeScript strict, `app/`.
- **Obsah = Astro Content Collections** (`app/src/content.config.ts`) — Astro slouží jako obsahová vrstva (git-based "headless" model).
  Editace přes **Sveltia CMS** na `/admin` (git-based, zapisuje přímo do repa → rebuild přes GitHub Actions).
- **Tailwind CSS v4** přes `@tailwindcss/vite`, tokeny v `app/src/styles/global.css` (`@theme`). Žádné raw hex v komponentách – používej tokeny (`bg-mocha-900`, `text-caramel`, `text-caramel-ink`, `bg-cream`…).
- **Obrázky**: VŽDY `<Picture>`/`<Image>` z `astro:assets` se zdrojem z kolekce (ImageMetadata). Formáty `['avif','webp']`, správné `widths` + `sizes`. Nad zlomem `loading="eager" fetchpriority="high"`, jinak lazy. Nikdy obrázky do `public/`.
- Ikony: `astro-icon` + Phosphor (`<Icon name="ph:arrow-right-light" />`), žádné emoji.
- Motion: CSS + `data-reveal` atribut (viz `src/lib/motion.ts`, volitelně `style="--reveal-i:N"` pro stagger), Lenis smooth scroll, View Transitions (`<ClientRouter />` už je v BaseLayout). GSAP je k dispozici pro náročnější scroll scény (ScrollTrigger), ale **vždy** respektuj `prefers-reduced-motion` a skripty registruj na `astro:page-load` (ne DOMContentLoaded) a uklízej na `astro:before-swap`.
- Lightbox: **PhotoSwipe 5** (`photoswipe`), lazy import jen při otevření.

## Design směr — "Warm Editorial"
Prémiové kuchyňské studio, ne šablona. Inspirace: Bulthaup, Vipp, Reform, Norm Architects — klid, velká fotografie, editorialní typografie, hmatové materiály.
- **Barvy KPS**: mocha (#322624 logo, #2A1A17 tmavé plochy), caramel #C88B4E jako jediný akcent (CTA, linky, detaily), krém #F5ECE6 / #FBF7F4 jako pozadí. Střídej světlé krémové a tmavé mocha sekce pro rytmus. Caramel na světlém pozadí pro text jen jako `caramel-ink`.
- **Typografie**: nadpisy *Fraunces* (serif, `font-display`, váha 300–400, velké velikosti, možnost *italic* pro zvýraznění slova), text *Manrope*. Utility: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-lead`, `.eyebrow`.
- **Layout**: `.container-x` (max 1440, fluid gutter), `.section-y` (velkorysé vertikální mezery). Asymetrické gridy, překryvy fotek a textu, velké číslování (01/02/03), tenké linky (`border-linen` / `border-white/10`).
- **Detaily**: radius jemný (8–16 px) nebo žádný u velkých fotek; jemná zrnitost/šum je OK; hover na fotkách = pomalý zoom (scale 1.04, 1.2 s ease-out-expo); kurzorové "Zobrazit" štítky na desktopu jsou bonus.
- **Logo** se nemění: `/branding/kps-logo.svg` (tmavé), `kps-logo-inverse.svg` (světlé), `kps-compact-logo*.svg`, `fav.svg`.
- Jazyk webu: **čeština**. Nevymýšlej fakta (počty let, recenze, ocenění) – používej data z kolekcí / `settings`.

## Přístupnost a kvalita (povinné)
Kontrast ≥ 4.5:1, viditelný focus, alt texty z dat, sémantické nadpisy (1× h1 na stránku), ovládání klávesnicí (menu, filtry, lightbox), touch cíle ≥ 44 px, žádný horizontální scroll na 375 px, reduced-motion = finální stav bez animace, CLS < 0.1 (rozměry obrázků).

## Informační architektura
| URL | Obsah |
|---|---|
| `/` | Hero (fullscreen, fotky z `settings.heroProjects`), manifest/hodnoty K·P·S, vybrané realizace, služby, proces spolupráce, partneři, CTA kontakt |
| `/realizace/` | Index galerií: filtr kategorií (bez reloadu, s URL `?kategorie=`), "featured" velké karty + grid |
| `/realizace/[slug]/` | Detail projektu: hero, meta (lokalita, datum, kategorie), specializovaná galerie, features/materiály, seoText, další projekty, CTA |
| `/realizace/kategorie/[kategorie]/` | Statická landing stránka kategorie (SEO) |
| `/sluzby/` | Služby z kolekce `services` + materiály/partneři |
| `/o-nas/` | Příběh, hodnoty K·P·S, proces spolupráce, oblast působení |
| `/kontakt/` | Kontakty, poptávkový formulář (Web3Forms, klíč v settings), mapa (odkaz/embed lazy), otevírací doba |
| `/404` | Vlastní 404 |
| `/admin/` | Sveltia CMS |

## Sdílené API (neměnit bez dohody)
- `src/lib/site.ts`: `getSettings()`, `getProjects()`, `CATEGORIES`, `categorySlug()`, `formatMonth()`, `NAV`, `telHref()`.
- `src/layouts/BaseLayout.astro` props: `title, description, image?, noindex?, schema?, headerOverlay?`.
- Kolekce: `projects` (id = název složky), `services`, `partners`, `settings` (entry `site`).

## Pravidla pro paralelní workery
- Pracuj jen ve svých souborech (viz zadání). Sdílené soubory (`global.css`, `site.ts`, `content.config.ts`, `BaseLayout.astro`) měň jen pokud je to nutné a minimálně – přidávej, nemaž.
- Ověření: `cd app && npx astro check` a `npx astro build --outDir /tmp/kps-<tvé-jméno>` (vlastní outDir, ať se nebijete). Nespouštěj dev server na portu 4321 (použij `--port` 43xx dle zadání), na konci ho ukonči.
- Necommituj — commit dělá orchestrátor.
