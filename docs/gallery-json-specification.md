# Gallery JSON Specification - Dokumentace pro AI

## Přehled
Tento dokument definuje strukturu a pravidla pro vytváření `gallery.json` souborů pro galerie KPS Interiéry. Používej tuto specifikaci pro konzistentní tvorbu obsahů galerií.

## Struktura souboru

### Základní informace

```json
{
  "id": "unique-identifier",
  "title": "Název galerie",
  "category": "Kategorie", 
  "description": "Popis galerie",
  "coverImage": "nazev-souboru.jpg",
  "location": "Město",
  "date": "YYYY-MM",
  "imageCount": 15,
  // ... další vlastnosti
}
```

## Detailní specifikace polí

### 1. **id** (povinné)
- **Typ**: String
- **Formát**: kebab-case (malá písmena, pomlčky)
- **Délka**: 15-35 znaků
- **Příklad**: `"kitchen-luxury-marble"`, `"bathroom-vanity-modern"`
- **Pravidla**: 
  - Začíná kategorií (`kitchen-`, `bathroom-`, `wardrobe-`, `office-`)
  - Následuje popis stylu nebo charakteristiky
  - Musí být jedinečné v celém systému

### 2. **title** (povinné)
- **Typ**: String
- **Délka**: 25-45 znaků
- **Účel**: Zobrazuje se jako hlavní nadpis na kartách a v galerii
- **Příklady**: 
  - `"Luxusní kuchyň s mramorovými akcenty"`
  - `"Moderní koupelnový nábytek s umyvadlem"`
  - `"Skandinávská kuchyň s dřevěnými prvky"`
- **Pravidla**:
  - Začíná velkým písmenem
  - Obsahuje klíčové charakteristiky (styl + materiál/prvek)
  - Nekončí tečkou

### 3. **category** (povinné)
- **Typ**: String
- **Povolené hodnoty**:
  - `"Kuchyně"` - kuchyňské realizace
  - `"Koupelny"` - koupelnový nábytek
  - `"Skříně"` - vestavěné skříně, šatny
  - `"Kancelář"` - kancelářský nábytek
  - `"Ostatní"` - atypické realizace
- **Účel**: Kategorizace pro filtrování a organizaci

### 4. **description** (povinné)
- **Typ**: String
- **Délka**: 80-120 znaků
- **Účel**: Krátký popis zobrazovaný na kartách galerií
- **Příklady**:
  - `"Exkluzivní kuchyňská realizace s mramorovými pracovními deskami a luxusním vybavením."`
  - `"Moderní skandinávský design s kombinací bílých ploch a přírodního dubového dřeva."`
- **Pravidla**:
  - Jedna věta končící tečkou
  - Zdůrazňuje hlavní charakteristiky
  - Používá odborné, ale srozumitelné pojmy

### 5. **coverImage** (povinné)
- **Typ**: String
- **Formát**: Název souboru s příponou (.jpg, .jpeg, .png)
- **Účel**: Hlavní obrázek pro náhled galerie
- **Pravidla**:
  - Musí existovat ve složce galerie
  - Doporučená rozlišení: 1200x800px nebo vyšší
  - Měl by reprezentovat nejlepší/nejreprezentativnější pohled

### 6. **images** (povinné)
- **Typ**: Array objektů
- **Minimální počet**: 3 obrázky
- **Struktura každého obrázku**:

```json
{
  "src": "nazev-souboru.jpg",
  "alt": "Popisný text pro accessibility", 
  "width": 1200,
  "height": 800,
  "caption": "Popis pro zobrazení v galerii"
}
```

#### Pravidla pro obrázky:
- **src**: Přesný název souboru ve složce
- **alt**: 30-60 znaků, popisuje co je na obrázku
- **width/height**: Skutečné rozměry obrázku v pixelech
- **caption**: 40-70 znaků, popisný text pro uživatele

### 7. **features** (povinné)
- **Typ**: Array stringů
- **Počet**: 3-6 položek
- **Délka jednotlivých položek**: 15-35 znaků
- **Účel**: Klíčové vlastnosti a prvky realizace
- **Příklady**:
  - `"Centrální kuchyňský ostrůvek"`
  - `"Vestavěné spotřebiče"`
  - `"LED osvětlení"`
  - `"Soft-close zavírání"`
- **Pravidla**:
  - Technické a designové charakteristiky
  - Bez teček na konci
  - Konkrétní, měřitelné vlastnosti

### 8. **materials** (povinné)
- **Typ**: Array stringů
- **Počet**: 2-5 položek
- **Délka**: 10-25 znaků na položku
- **Účel**: Hlavní materiály použité v realizaci
- **Příklady**:
  - `"Mramor Carrara"`
  - `"Dýha ořech"`
  - `"Kompakt HPL"`
  - `"Kování Blum"`
- **Pravidla**:
  - Specifické názvy materiálů a značek
  - Preferuj známé značky (Blum, Egger, atd.)

### 9. **location** (povinné)
- **Typ**: String
- **Délka**: 4-15 znaků
- **Povolené hodnoty**: České města
- **Příklady**: `"Praha"`, `"Brno"`, `"Ostrava"`, `"Zlín"`, `"Olomouc"`
- **Účel**: Geografická lokalizace pro místní SEO

### 10. **date** (povinné)
- **Typ**: String
- **Formát**: `"YYYY-MM"`
- **Příklad**: `"2024-03"`, `"2023-11"`
- **Účel**: Chronologické řazení projektů

### 11. **imageCount** (povinné)
- **Typ**: Number
- **Rozsah**: 8-25
- **Účel**: Celkový počet fotografií v galerii (pro zobrazení statistik)
- **Pravidla**: Měl by odpovídat skutečnému počtu souborů ve složce

### 12. **coverImages** (povinné)
- **Typ**: Array stringů
- **Počet**: Přesně 3 položky
- **Účel**: Obrázky pro preview v galerii (hlavní + 2 detaily)
- **Pravidla**:
  - První je vždy coverImage
  - Další 2 jsou nejlepší detailní snímky
  - Všechny musí existovat v images array

## Pravidla pro výběr obrázků

### Cover Image Selection
1. **Nejvýstižnější pohled**: Celkový pohled, který nejlépe reprezentuje celou realizaci
2. **Kvalita**: Nejlepší osvětlení a kompozice
3. **Bez náhodných názvů**: Často má obecný název, ale obsahově je nejdůležitější

### Další obrázky
- **Detailní záběry**: Ukázky kvality zpracování, materiálů
- **Různé úhly**: Poskytují komplexní pohled na realizaci
- **Funkční prvky**: Spotřebiče, úchyty, osvětlení v akci

## Template pro novou galerii

```json
{
  "id": "",
  "title": "",
  "category": "",
  "description": "",
  "coverImage": "",
  "images": [
    {
      "src": "",
      "alt": "",
      "width": 0,
      "height": 0,
      "caption": ""
    }
  ],
  "features": [
    "",
    "",
    ""
  ],
  "materials": [
    "",
    ""
  ],
  "location": "",
  "date": "",
  "imageCount": 0,
  "coverImages": [
    "",
    "",
    ""
  ]
}
```

## Kontrolní seznam pro AI

### Před vytvořením:
- [ ] Prohlédni všechny fotografie ve složce
- [ ] Identifikuj nejreprezentativnější obrázek pro cover
- [ ] Urči kategorii na základě typu realizace
- [ ] Spočítej skutečný počet fotografií

### Při vytváření:
- [ ] Použij konzistentní naming convention pro ID
- [ ] Ověř délky textů podle specifikace
- [ ] Zkontroluj, že všechny referenced soubory existují
- [ ] Použij odbornou terminologii pro materials a features

### Po vytvoření:
- [ ] Validuj JSON syntax
- [ ] Zkontroluj, že coverImages obsahuje 3 existující soubory
- [ ] Ověř, že imageCount odpovídá skutečnosti
- [ ] Ujisti se, že description sedí k fotografiím

## Nejčastější chyby

1. **Nekonzistentní naming**: Míchaní různých stylů v ID
2. **Příliš dlouhé texty**: Překročení doporučených délek
3. **Neexistující soubory**: Reference na soubory, které nejsou ve složce
4. **Obecné popisy**: Nepřesné features a materials
5. **Špatná kategorie**: Nesprávné zařazení do kategorie

---

**Verze**: 1.0  
**Datum**: 2025-01-15  
**Použití**: Generování gallery.json souborů pomocí AI podle nahrátých fotografií