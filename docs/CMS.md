# Správa obsahu webu (Sveltia CMS)

Obsah webu kps-interiery.cz se upravuje v administraci na **https://kps-interiery.cz/admin/**. Každé uložení se zapíše do repozitáře na GitHubu (`czechdaver/KPS-interiery`, větev `main`) a web se automaticky sestaví a nasadí.

## 1. Přihlášení

1. Otevřete `https://kps-interiery.cz/admin/`.
2. Zvolte způsob přihlášení:
   - **Sign in with Token** (nejjednodušší, viz kapitola 6A) – vložíte osobní přístupový token z GitHubu. Token si prohlížeč zapamatuje, příště se nepřihlašujete znovu.
   - **Sign in with GitHub** – klasické přihlášení přes GitHub účet; funguje až po jednorázovém nastavení OAuth proxy (kapitola 6B).
3. Administrace je česky. V levém panelu jsou **Realizace**, **Služby** a **Nastavení webu**.

## 2. Přidání nové realizace

1. **Realizace → Nová realizace**.
2. Vyplňte:
   - **Název** (z něj vznikne adresa i složka, např. „Bílá kuchyň Zlín“ → `bila-kuchyn-zlin`),
   - **Kategorie** (Kuchyně, Skříně, Ložnice, Koupelny, Ostatní), **Lokalita**,
   - **Datum realizace** ve tvaru `RRRR-MM` (např. `2025-09`),
   - **Krátký popis**, volitelně Vlastnosti, Materiály a delší **SEO text**,
   - **Zvýrazněná** = zobrazí se jako velká karta / na úvodní straně; **Pořadí** – menší číslo je výše (výchozí 100).
3. **Titulní fotka**: klikněte na pole a nahrajte soubor z počítače.
4. **Fotogalerie**: „Přidat“ pro každou fotku → nahrát fotku → vyplnit **Alt text** (povinný) a případně popisek. Minimálně jedna fotka.
5. Vpravo nahoře **Uložit**. Hotovo – viz kapitola 5.

**Doporučení k fotkám**
- Formát **JPG**, delší strana cca **2560 px**, kvalita 80–85 %, ideálně do ~600 kB na fotku (web si sám vytvoří menší verze ve WebP/AVIF).
- Nenahrávejte desítky megabajtů velké originály z foťáku – zbytečně nafukují repozitář.
- **Alt text** stručně popisuje, co je na fotce („Bílá kuchyň s dřevěným ostrůvkem, pohled od vchodu“). Slouží nevidomým i vyhledávačům. Nepište „fotka…“.
- Fotky se ukládají do složky dané realizace vedle souboru `index.json`.

## 3. Úpravy služeb a kontaktů

- **Služby**: upravte název, krátký popis, ikonu (název z https://phosphoricons.com ve tvaru `ph:název-light`), pořadí, text a vybrané realizace.
- **Nastavení webu → Kontakty a obecné údaje**: telefon, e-mail, adresa, otevírací doba, sociální sítě, čísla na úvodní stránce, realizace v úvodním hero.
- **Nastavení webu → Partneři a dodavatelé**: přidání/odebrání loga (SVG nebo PNG).
- Pole „Web3Forms klíč“ neměňte, pokud nevíte proč – patří k poptávkovému formuláři.

## 4. Mazání a úpravy

Realizaci lze smazat v seznamu (ikona koše) – smaže se i její složka s fotkami z aktuální verze webu. Díky Gitu je ale **každá změna dohledatelná a vratná** (GitHub → historie commitů).

## 5. Co se stane po uložení

1. CMS vytvoří **commit** do větve `main` (v GitHubu vidíte např. „Update Realizace …“).
2. Spustí se **GitHub Actions** (workflow „Deploy to GitHub Pages“): instalace, kontrola, build webu.
3. Za zhruba **2–4 minuty** je změna na webu. Průběh vidíte v repozitáři na záložce **Actions**; zelená fajfka = nasazeno, červený křížek = chyba (web zůstává ve staré verzi, napište správci).
4. Chyba bývá nejčastěji špatný formát data (musí být `RRRR-MM`) nebo chybějící alt text – CMS na to upozorní už při ukládání.

## 6. Jednorázové nastavení přihlášení (provede správce)

### A) Osobní přístupový token (nejjednodušší, bez dalšího hostingu)

1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. *Repository access*: Only select repositories → `czechdaver/KPS-interiery`.
3. *Permissions → Repository permissions*: **Contents: Read and write** (Pull requests: Read and write je potřeba jen při použití Editorial Workflow, které zde není zapnuté). Metadata: Read (přidá se samo).
4. Nastavte expiraci (např. 1 rok) a token zkopírujte. V `/admin/` zvolte **Sign in with Token** a vložte ho.
5. Token je jako heslo: nesdílejte ho e-mailem ani v chatu. Každý editor by měl mít vlastní GitHub účet s přístupem do repozitáře (Settings → Collaborators) a vlastní token.

### B) OAuth přihlášení přes GitHub (tlačítko „Sign in with GitHub“)

Sveltia je statická aplikace, proto potřebuje malý „OAuth proxy“ server. Doporučený je **sveltia-cms-auth** na Cloudflare Workers (zdarma):

1. **GitHub OAuth App**: GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.
   - Homepage URL: `https://kps-interiery.cz`
   - Authorization callback URL: `https://<váš-worker>.workers.dev/callback`
   - Po vytvoření zapište **Client ID** a vygenerujte **Client secret**.
2. **Cloudflare Worker**: nasaďte repozitář https://github.com/sveltia/sveltia-cms-auth (tlačítko „Deploy to Cloudflare“, nebo `wrangler deploy`).
3. Ve Workeru (Settings → Variables and Secrets) nastavte:
   - `GITHUB_CLIENT_ID` = Client ID,
   - `GITHUB_CLIENT_SECRET` = Client secret (jako *Secret*),
   - `ALLOWED_DOMAINS` = `kps-interiery.cz` (omezí, odkud se lze přihlásit).
4. V `app/public/admin/config.yml` odkomentujte a doplňte v sekci `backend`:
   ```yaml
   base_url: https://<váš-worker>.workers.dev
   ```
   Změnu commitněte – po nasazení se na přihlašovací obrazovce objeví přihlášení přes GitHub.
5. Přihlásit se pak může každý, kdo má na GitHubu přístup k repozitáři (zapisovací práva).

### Ostatní poznámky
- Doména běží přes `app/public/CNAME` (kps-interiery.cz); v nastavení repozitáře **Settings → Pages** musí být *Source: GitHub Actions*.
- Verze CMS je zafixovaná v `app/public/admin/index.html` (`@sveltia/cms@0.237.0`). Aktualizace = změna čísla verze.
- Pokud by se u „Vybrané realizace“ (služby / hero) ukládaly hodnoty ve tvaru `nazev/index` místo `nazev`, dejte vědět správci – jde o nastavení `value_field` v `config.yml`.
- Lokální úpravy bez GitHubu: v prohlížeči Chromium otevřete `http://localhost:4321/admin/index.html` při běžícím `npm run dev` a v přihlášení zvolte „Work with Local Repository“.
