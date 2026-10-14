# KPS Interiéry — web v2 (Astro)

Statický web kuchyňského studia KPS Interiéry postavený na **Astro 7** s obsahem v Content Collections a editací přes **Sveltia CMS** (`/admin`).

```bash
cd app
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check + build do app/dist
```

- Obsah: `app/src/content/` (realizace = složka s `index.json` + fotky, služby = markdown, `settings/site.json` = kontakty a globální nastavení)
- Design brief a architektura: [`docs/REDESIGN.md`](docs/REDESIGN.md)
- Nová realizace: vytvoř složku v `app/src/content/projects/<slug>/`, vlož fotky (JPG ~2560 px) a `index.json` – nebo použij `/admin`. Optimalizace (AVIF/WebP, srcset) proběhne automaticky při buildu.
