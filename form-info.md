# ⚠️ DŮLEŽITÉ: Tento web je PLNĚ STATICKÝ (GitHub Pages)

**GitHub Pages = pouze statické HTML/CSS/JS = ŽÁDNÝ backend/server-side kód není možný!**

Kontaktní formulář funguje výhradně na **client-side** pomocí externího API **Web3Forms**.

---

# Kontaktní formulář - Web3Forms implementace

## ✅ Aktuální stav

Kontaktní formulář je **plně implementován a funkční** pomocí Web3Forms API:

- ✅ Client-side odesílání přes Web3Forms API
- ✅ hCaptcha spam ochrana (automatická integrace přes Web3Forms)
- ✅ Validace na straně klienta
- ✅ Profesionální HTML email šablona
- ✅ Automatické zpětné vazby uživateli

## 🏗️ Architektura (STATIC ONLY)

### ❌ Co NELZE použít na statickém webu:
- Backend API routes (Next.js API routes, Express endpoints, atd.)
- Server-side validace
- Environment variables na serveru
- Databáze
- Server-side email služby (Resend, SendGrid, atd.)
- Node.js knihovny na serveru

### ✅ Co funguje na statickém webu:
- Client-side JavaScript (fetch API)
- Externí API volání (Web3Forms, atd.)
- Client-side validace
- Static file hosting
- Client-side knihovny

## 🔧 Jak formulář funguje

### Frontend (ContactSection.tsx)

**Umístění**: `app/src/components/ContactSection.tsx`

- Plný formulář s validací polí
- **Povinná pole**: jméno, telefon, email, popis projektu, GDPR souhlas
- **Volitelná pole**: typ projektu, rozpočet, termín realizace
- Loading stavy a error handling
- Automatický reset po úspěšném odeslání

### Web3Forms API Integration

**Endpoint**: `POST https://api.web3forms.com/submit`

**Access Key**: `720d65a7-bfb4-4a2c-9059-8c7182decfdd`

**Příjemce**: `info@kps-interiery.cz`

**Form Data** odesílaná na Web3Forms:
```typescript
formData.append('access_key', '720d65a7-bfb4-4a2c-9059-8c7182decfdd');
formData.append('subject', `🛠️ Nová poptávka od ${formData.name} - KPS Interiéry`);
formData.append('from_name', formData.name);
formData.append('from_email', formData.email);
formData.append('reply_to', formData.email);
formData.append('to_email', 'info@kps-interiery.cz');
formData.append('message', messageContent);
```

### hCaptcha Spam Ochrana

**Implementace**: Automatická přes Web3Forms Client Script

**Script v root.tsx**:
```tsx
<script src="https://web3forms.com/client/script.js" async defer></script>
```

**HTML v ContactSection.tsx**:
```tsx
<div class="h-captcha" data-captcha="true"></div>
```

**Jak to funguje**:
1. Web3Forms script detekuje `data-captcha="true"`
2. Automaticky načte hCaptcha widget
3. Automaticky validuje captcha před odesláním
4. Automaticky přidá captcha token do FormData

**ŽÁDNÉ manuální handlery nejsou potřeba!**

## 🚀 Nastavení Web3Forms

### 1. Web3Forms účet

```
1. Jdi na https://web3forms.com
2. Zaregistruj se / Přihlaš se
3. Vytvoř nový Access Key
4. Zkopíruj klíč a použij v ContactSection.tsx
```

**Aktuální Access Key**: `720d65a7-bfb4-4a2c-9059-8c7182decfdd`

### 2. Konfigurace příjemce

Email příjemce je hardcoded v `ContactSection.tsx:596`:

```typescript
formDataToSend.append('to_email', 'info@kps-interiery.cz');
```

Pro změnu příjemce:
1. Otevři `app/src/components/ContactSection.tsx`
2. Najdi `formDataToSend.append('to_email', ...)`
3. Změň email adresu

### 3. Web3Forms Dashboard

V dashboard můžeš:
- Sledovat počet odeslaných formulářů
- Zobrazit submission historii
- Upravit nastavení (captcha, notifications, atd.)
- Stáhnout CSV export všech submissions

## 🧪 Testování

### Lokální testování

```bash
cd app
npm run dev
# open http://localhost:5173

# Vyplň a odešli formulář
# Email se pošle na info@kps-interiery.cz přes Web3Forms
```

### Testování v produkci

1. Deploy na GitHub Pages
2. Otevři https://kps-interiery.cz
3. Vyplň kontaktní formulář
4. Zkontroluj email na info@kps-interiery.cz
5. Zkontroluj Web3Forms dashboard pro submission log

### Testování hCaptcha

1. Otevři DevTools (F12)
2. Přejdi na kontaktní formulář
3. Ověř že hCaptcha widget je viditelný
4. Vyplň formulář a zkus odeslat bez vyřešení captcha
5. Mělo by se zobrazit: "Please solve the captcha"

## ⚠️ Řešení problémů

### Formulář se neodesílá

```
✓ Zkontroluj browser console (F12) pro chybové zprávy
✓ Ověř že všechna povinná pole jsou vyplněná
✓ Zkontroluj formát emailu a telefonu
✓ Ověř že GDPR checkbox je zaškrtnutý
✓ Ověř že hCaptcha je vyřešená
✓ Zkontroluj Web3Forms dashboard pro error logs
```

### hCaptcha widget se nezobrazuje

```
✓ Ověř že Web3Forms script je načtený v root.tsx
✓ Zkontroluj browser console pro chyby
✓ Ověř že div má atribut data-captcha="true"
✓ Zkontroluj network tab - měl by se načíst web3forms/client/script.js
✓ Vypni AdBlock (může blokovat captcha)
```

### Email nedorazí

```
✓ Zkontroluj spam složku
✓ Ověř access key v ContactSection.tsx
✓ Zkontroluj Web3Forms dashboard - submissions
✓ Ověř že to_email je správně nastavený
✓ Zkontroluj Web3Forms email quota (free tier limit)
```

### Build failuje

```
✓ Zkontroluj GitHub Actions logs
✓ Ověř že všechny importy jsou použité
✓ Spusť npm run build:static lokálně
✓ Zkontroluj TypeScript errory
```

## 💡 Volitelná vylepšení

### 1. Rate limiting

Web3Forms má built-in rate limiting, ale můžeš přidat i client-side:
- LocalStorage tracking počtu submissí
- Časový delay mezi odesláními

### 2. Auto-reply zákazníkovi

V Web3Forms dashboard můžeš nastavit:
- Automatickou odpověď zákazníkovi
- Custom email template
- Redirect po úspěšném odeslání

### 3. Více příjemců

```typescript
formDataToSend.append('to_email', 'info@kps-interiery.cz,admin@kps-interiery.cz');
```

### 4. Webhook notifications

Web3Forms podporuje webhooks:
- Slack notifications
- Discord notifications
- Custom webhook endpoints

### 5. Database logging

Pro backup můžeš přidat:
- Google Sheets integration (Web3Forms feature)
- Airtable integration
- Zapier automation

### 6. Custom success page

Redirect po úspěšném odeslání:
```typescript
if (result.success) {
  window.location.href = '/dekujeme';
}
```

## 📊 Monitoring

### Web3Forms Dashboard

- **Total Submissions**: Celkový počet odeslaných formulářů
- **Success Rate**: Procento úspěšně doručených emailů
- **Last 30 days**: Statistiky za posledních 30 dní
- **Submission Log**: Historie všech submissions s detaily

### Doporučené metriky

- Sleduj success rate (mělo být ~100%)
- Kontroluj spam submissions (mělo být 0 díky captcha)
- Sleduj bounce rate emailů
- Monitoruj quota usage (free tier má limit)

## 📝 Aktuální konfigurace

```javascript
// Access Key
const ACCESS_KEY = '720d65a7-bfb4-4a2c-9059-8c7182decfdd';

// Email příjemce
const TO_EMAIL = 'info@kps-interiery.cz';

// hCaptcha
const CAPTCHA_ENABLED = true; // automaticky přes Web3Forms

// Form validation
const REQUIRED_FIELDS = ['name', 'email', 'phone', 'description', 'gdprConsent'];
```

## 🔗 Užitečné odkazy

- **Web3Forms Dashboard**: https://web3forms.com/
- **Web3Forms Documentation**: https://docs.web3forms.com/
- **hCaptcha**: https://www.hcaptcha.com/
- **GitHub Pages**: https://pages.github.com/

---

**Poslední aktualizace**: 2025-10-06
**Stav**: ✅ Plně funkční - statická implementace přes Web3Forms
