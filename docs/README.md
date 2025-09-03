# KPS Interiéry - Dokumentace

## Přehled projektu
Kompletní dokumentace pro webovou prezentaci KPS Interiéry - specializované firmy na zakázkový nábytek na míru.

---

## 📋 Index dokumentace

### 🏗️ Technická dokumentace

#### **[Technický stack](./techstack.md)**
- Qwik framework + Vite
- TypeScript konfigurace  
- CSS architektura s brand systémem
- Build a deployment pipeline

#### **[Setup a instalace](./setup.md)**
- Požadavky na vývojové prostředí
- Instalační kroky pro development
- Konfigurace IDE a nástrojů

#### **[Struktura webu](./kps_website_structure.md)**
- Architektura komponent a stránek
- Návrhové vzory a best practices
- Organizace souborové struktury

---

### 🎨 Design a UX dokumentace

#### **[Optimalizace obrázků](./IMAGE_OPTIMIZATION.md)**
- ResponsiveImage komponenta
- Automatické generování WebP
- Performance optimalizace
- Lazy loading a kritické obrázky

#### **[Gallery systém](./gallery-json-specification.md)**
- Struktura gallery.json souborů
- AI instrukce pro generování obsahu
- PhotoSwipe integrace
- Pravidla pro metadata a SEO

---

### ⚖️ Compliance a bezpečnost

#### **[Cookie Bar - GDPR](./cookie-bar.md)**
- GDPR compliant cookie management
- Google Analytics 4 integrace
- Granulární souhlas uživatelů
- Dokumentace pro audit a compliance

#### **[Kontaktní formulář](./CONTACT_FORM_SETUP.md)**
- Zabezpečený formulář s validací
- Email integrace a spam ochrana
- GDPR compliant data processing

---

### 📝 Pracovní poznámky

#### **[Vývojové poznámky](./poznamky.md)**
- Aktuální TODO items
- Známé problémy a jejich řešení
- Změny v průběhu vývoje

---

## 🚀 Quick Start pro vývojáře

1. **Klonování a setup**:
   ```bash
   git clone <repository>
   cd kps-interier/app
   npm install
   npm run dev
   ```

2. **Klíčové dokumenty pro start**:
   - [Setup guide](./setup.md) - základní instalace
   - [Tech stack](./techstack.md) - použité technologie
   - [Web structure](./kps_website_structure.md) - architektura

3. **Pro práci s obsahem**:
   - [Gallery specification](./gallery-json-specification.md) - přidávání galerií
   - [Image optimization](./IMAGE_OPTIMIZATION.md) - optimalizace obrázků

---

## 🤖 Claude 4 Integration

### Automatické načítání kontextu
Tato dokumentace je strukturována pro automatické načítání Claude 4:

- **Hierarchická organizace**: Od obecného k specifickému
- **Konkrétní názvy souborů**: Bez mezer, s jasným účelem
- **Cross-reference system**: Propojené odkazy mezi dokumenty
- **Metadata tagging**: Kategorizace pro rychlé vyhledávání

### Indexovací klíčová slova
- `#qwik-framework` `#typescript` `#css-architecture`
- `#responsive-images` `#photoswipe` `#gallery-system`
- `#gdpr-compliance` `#cookie-management` `#analytics`
- `#contact-forms` `#email-integration` `#security`
- `#ai-content-generation` `#metadata-management`

### Vyhledávací syntaxe pro Claude
```
// Pro technickou dokumentaci
docs:technical OR file:techstack.md OR file:setup.md

// Pro design a UX
docs:design OR image-optimization OR gallery-system

// Pro compliance
docs:gdpr OR cookie-bar OR contact-form

// Pro AI asistenci
docs:ai-instructions OR gallery-json-specification
```

---

## 📊 Statistiky dokumentace

| Kategorie | Soubory | Aktualizace |
|-----------|---------|-------------|
| **Technická** | 3 | 2024-08 |
| **Design/UX** | 2 | 2025-01 |
| **Compliance** | 2 | 2025-01 |
| **Poznámky** | 1 | 2024-08 |
| **Celkem** | **8** | **Aktivní** |

---

## 🔄 Údržba dokumentace

### Pravidla aktualizace
1. **Při každé změně kódu** - aktualizuj související dokumenty
2. **Při nových features** - vytvoř nebo rozšiř dokumentaci
3. **Při refaktoringu** - zkontroluj všechny odkazy
4. **Měsíčně** - review a cleanup zastaralých informací

### Template pro nové dokumenty
```markdown
# [Název dokumentu]

## Účel
Co tento dokument řeší a proč existuje.

## Obsah
Strukturovaný obsah s příklady.

## Související dokumenty
- [Odkaz na související soubor](./soubor.md)

## Changelog
- YYYY-MM-DD: Popis změny
```

---

**Poslední aktualizace**: 2025-01-15  
**Verze dokumentace**: 2.0  
**Autor**: KPS Interiéry Development Team  
**Claude 4 Ready**: ✅