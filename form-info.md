# Kontaktní formulář - Implementace a nastavení

## ✅ Aktuální stav

Kontaktní formulář je **plně implementován a funkční**. Formulář pracuje ve dvou režimech:

- **Vývojový režim** (bez API klíče): Zprávy se logují do konzole
- **Produkční režim** (s API klíčem): Zprávy se odesílají skutečnými emaily přes Resend API

## 🔧 Jak formulář funguje

### Frontend (ContactSection.tsx)
- Kompletní formulář s validací
- Povinná pole: jméno, telefon, email, popis projektu, souhlas s GDPR
- Volitelná pole: typ projektu, rozpočet, termín realizace
- Validace na straně klienta
- Loading stavy a zpětná vazba uživateli
- Automatický reset po úspěšném odeslání

### Backend (src/routes/api/contact/index.ts)
- API endpoint: `POST /api/contact`
- Validace emailu a telefonu
- Sanitizace vstupů (ochrana proti XSS)
- Ověření souhlasu s GDPR
- Integrace s Resend API pro odesílání emailů
- Profesionální HTML šablona emailu
- Graceful fallback (logování do konzole bez API klíče)

### Email služba
- **Knihovna**: Resend API (v6.0.2)
- **Příjemce**: david@motalik.cz (hardcoded v `src/routes/api/contact/index.ts:242`)
- **Odesílatel**: `KPS Interiéry <noreply@kpsinteriery.cz>`
- **Reply-To**: Email zákazníka (umožňuje přímou odpověď)

## 🚀 Nastavení pro produkci

### 1. Založení účtu na Resend

```
1. Jdi na https://resend.com
2. Zaregistruj se / Přihlaš se
3. Přejdi do sekce "API Keys"
4. Vytvoř nový API klíč
5. Zkopíruj klíč (začíná na "re_")
```

### 2. Ověření domény v Resend

**DŮLEŽITÉ**: Bez ověření domény nebudou emaily fungovat!

```
1. V Resend dashboard jdi do "Domains"
2. Klikni "Add Domain"
3. Zadej: kpsinteriery.cz
4. Resend ti zobrazí DNS záznamy k přidání
```

### 3. Konfigurace DNS záznamů

Musíš přidat následující DNS záznamy na doméně `kpsinteriery.cz`:

#### SPF záznam (autentizace emailů)
```
Type: TXT
Name: @ (nebo kpsinteriery.cz)
Value: v=spf1 include:_spf.resend.com ~all
```

#### DKIM záznam (podpis emailů)
```
Type: TXT
Name: resend._domainkey
Value: [hodnota z Resend dashboard]
```

#### DMARC záznam (politika emailů)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@kpsinteriery.cz
```

**Čekací doba**: DNS propagace trvá 24-48 hodin

### 4. Přidání environment variables

#### Pro lokální vývoj:
Vytvoř soubor `app/.env.local`:
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

#### Pro produkci (Vercel/Netlify/GitHub Pages):
V nastavení deployment platformy přidej:
```
Key: RESEND_API_KEY
Value: re_xxxxxxxxxxxxxxxxxxxxx
```

**DŮLEŽITÉ**: Soubor `.env.local` je v `.gitignore` - nikdy ho necommituj!

## 🧪 Testování

### Testování ve vývoji (bez API klíče)
```bash
cd app
npm run dev

# Vyplň a odešli formulář
# Email se zobrazí v konzoli terminálu
```

### Testování s API klíčem
```bash
cd app
# Vytvoř .env.local s RESEND_API_KEY
npm run dev

# Vyplň a odešli formulář
# Skutečný email se odešle na david@motalik.cz
```

### Testování v produkci
1. Deploy aplikace s `RESEND_API_KEY`
2. Ověř že doména je verifikovaná v Resend
3. Odešli testovací formulář
4. Zkontroluj email na david@motalik.cz
5. Zkontroluj Resend dashboard pro statistiky doručení

## 🔍 Ověření nastavení

### Kontrola DNS záznamů
```bash
# SPF záznam
dig TXT kpsinteriery.cz

# DKIM záznam
dig TXT resend._domainkey.kpsinteriery.cz

# DMARC záznam
dig TXT _dmarc.kpsinteriery.cz
```

### Kontrola v Resend Dashboard
1. Přejdi do "Domains" sekce
2. Klikni na `kpsinteriery.cz`
3. Ověř že všechny záznamy jsou zelené (verified)
4. Status by měl být "Active"

## ⚠️ Řešení problémů

### Email se neodesílá
```
✓ Ověř že RESEND_API_KEY je správně nastavený
✓ Zkontroluj že doména je verifikovaná
✓ Zkontroluj DNS záznamy
✓ Počkej 24-48h na DNS propagaci
✓ Zkontroluj Resend dashboard pro chybové zprávy
✓ Zkontroluj spam složku
```

### Formulář hlásí chybu
```
✓ Zkontroluj konzoli browseru (F12)
✓ Zkontroluj server logs
✓ Ověř že všechna povinná pole jsou vyplněná
✓ Zkontroluj formát emailu a telefonu
✓ Ověř že checkbox GDPR souhlasu je zaškrtnutý
```

### Email dorazí do spamu
```
✓ Ověř že máš správně nastavené SPF, DKIM, DMARC
✓ Počkej na větší email reputation (pošli více emailů)
✓ Použij doménu s dobrým skóre (ne nový)
✓ Vyhni se spam klíčovým slovům v obsahu
```

## 💡 Volitelná vylepšení

### 1. Rate limiting (ochrana proti spamu)
Přidej omezení počtu requestů z jedné IP adresy.

### 2. Honeypot pole (anti-bot)
Přidej skryté pole, které vyplní jen boti.

### 3. reCAPTCHA
Přidej Google reCAPTCHA pro ochranu proti botům.

### 4. Auto-reply zákazníkovi
Pošli potvrzovací email zákazníkovi po odeslání formuláře.

### 5. Více příjemců
Upravit `src/routes/api/contact/index.ts:242` na:
```typescript
const recipients = ['david@motalik.cz', 'info@kpsinteriery.cz'];
await sendEmail(recipients, subject, htmlContent, sanitizedData);
```

### 6. Database logging
Ukládej všechny formuláře do databáze jako backup.

### 7. Email notifikace přes webhook
Přidej webhook pro okamžité notifikace (Slack, Discord, atd.).

## 📊 Monitoring

### Resend Dashboard
- **Emails sent**: Počet odeslaných emailů
- **Delivery rate**: Procento doručených emailů
- **Bounce rate**: Procento vrácených emailů
- **Spam complaints**: Stížnosti na spam

### Doporučené metriky
- Sleduj delivery rate (mělo by být >95%)
- Sleduj bounce rate (mělo by být <5%)
- Kontroluj spam complaints (mělo by být 0%)

## 📝 Aktuální konfigurace

```javascript
// Email příjemce (hardcoded)
const EMAIL_TO = 'david@motalik.cz';

// Email odesílatel
const EMAIL_FROM = 'KPS Interiéry <noreply@kpsinteriery.cz>';

// Doména pro verifikaci
const DOMAIN = 'kpsinteriery.cz';
```

## 🔗 Užitečné odkazy

- **Resend Dashboard**: https://resend.com/
- **Resend Dokumentace**: https://resend.com/docs
- **DNS Checker**: https://dnschecker.org/
- **Email Tester**: https://www.mail-tester.com/

---

**Poslední aktualizace**: 2025-10-03
**Stav**: ✅ Implementováno, čeká na produkční nastavení
