# Sitemap URL Fixes - Quick Reference

## Issue Summary
Sitemap uses nested category URLs (`/galerie/category/slug`) but actual routes use flat structure (`/galerie/slug`).

---

## URLs to REMOVE from Sitemap (Category Pages Don't Exist)

```xml
<!-- These category pages DO NOT EXIST - REMOVE THEM -->
<url><loc>https://kps-interiery.github.io/KPS-interiery/galerie/kuchyne</loc></url>
<url><loc>https://kps-interiery.github.io/KPS-interiery/galerie/loznice</loc></url>
<url><loc>https://kps-interiery.github.io/KPS-interiery/galerie/koupelny</loc></url>
<url><loc>https://kps-interiery.github.io/KPS-interiery/galerie/skrine</loc></url>
<url><loc>https://kps-interiery.github.io/KPS-interiery/galerie/ostatni</loc></url>
```

---

## URLs to FIX (Change from Nested to Flat)

### Kitchen Galleries (Kuchyně)
| ❌ WRONG (Current Sitemap) | ✅ CORRECT (Actual Route) |
|---------------------------|--------------------------|
| `/galerie/kuchyne/kuchyn-bila-ostruvek` | `/galerie/kuchyn-bila-ostruvek` |
| `/galerie/kuchyne/kuchyn-cerna` | `/galerie/kuchyn-cerna` |
| `/galerie/kuchyne/kuchyn-bila-u-tvar` | `/galerie/kuchyn-bila-u-tvar` |
| `/galerie/kuchyne/kuchyn-bila-podkrovi` | `/galerie/kuchyn-bila-podkrovi` |
| `/galerie/kuchyne/kuchyn-seda` | `/galerie/kuchyn-seda` |
| `/galerie/kuchyne/kuchyn-bilo-hneda-beton` | `/galerie/kuchyn-bilo-hneda-beton` |
| `/galerie/kuchyne/kuchyn-bilo-hneda-l-varianta1` | `/galerie/kuchyn-bilo-hneda-l-varianta1` |
| `/galerie/kuchyne/kuchyn-bilo-hneda-u-alternativa` | `/galerie/kuchyn-bilo-hneda-u-alternativa` |
| `/galerie/kuchyne/kuchyn-hneda-l` | `/galerie/kuchyn-hneda-l` |
| `/galerie/kuchyne/kuchyn-mala-panel` | `/galerie/kuchyn-mala-panel` |
| `/galerie/kuchyne/kuchyn-retro-bila` | `/galerie/kuchyn-retro-bila` |
| `/galerie/kuchyne/kuchyn-svetla-rohova` | `/galerie/kuchyn-svetla-rohova` |
| `/galerie/kuchyne/kuchyn-uzka-bila-l` | `/galerie/kuchyn-uzka-bila-l` |

### Bedroom Galleries (Ložnice)
| ❌ WRONG (Current Sitemap) | ✅ CORRECT (Actual Route) |
|---------------------------|--------------------------|
| `/galerie/loznice/loznice-bilo-hneda` | `/galerie/loznice-bilo-hneda` |
| `/galerie/loznice/loznice-hneda` | `/galerie/loznice-hneda` |
| `/galerie/loznice/loznice-hneda-zkosene` | `/galerie/loznice-hneda-zkosene` |

### Bathroom Galleries (Koupelny)
| ❌ WRONG (Current Sitemap) | ✅ CORRECT (Actual Route) |
|---------------------------|--------------------------|
| `/galerie/koupelny/koupelna-1` | `/galerie/koupelna-1` |
| `/galerie/koupelny/koupelna-2` | `/galerie/koupelna-2` |
| `/galerie/koupelny/koupelna-cerna` | `/galerie/koupelna-cerna` |

### Wardrobe Galleries (Skříně)
| ❌ WRONG (Current Sitemap) | ✅ CORRECT (Actual Route) |
|---------------------------|--------------------------|
| `/galerie/skrine/skrin-a-dvere` | `/galerie/skrin-a-dvere` |
| `/galerie/skrine/skrin-dvere-botnik` | `/galerie/skrin-dvere-botnik` |
| `/galerie/skrine/skrin-posuv-vstup` | `/galerie/skrin-posuv-vstup` |

### Other Galleries (Ostatní)
| ❌ WRONG (Current Sitemap) | ✅ CORRECT (Actual Route) |
|---------------------------|--------------------------|
| `/galerie/ostatni/chodba-bila` | `/galerie/chodba-bila` |
| `/galerie/ostatni/chodba-sedo-hneda` | `/galerie/chodba-sedo-hneda` |
| `/galerie/ostatni/obyvak` | `/galerie/obyvak` |
| `/galerie/ostatni/ostatni-dvere` | `/galerie/ostatni-dvere` |
| `/galerie/ostatni/ostatni-live-edge-masiv` | `/galerie/ostatni-live-edge-masiv` |
| `/galerie/ostatni/ostatni-schody` | `/galerie/ostatni-schody` |

---

## URLs to KEEP (Already Correct)

```xml
<!-- Main pages - KEEP THESE -->
<url><loc>https://kps-interiery.github.io/KPS-interiery/</loc></url>
<url><loc>https://kps-interiery.github.io/KPS-interiery/galerie</loc></url>

<!-- Legacy hash redirect - KEEP THIS -->
<url><loc>https://kps-interiery.github.io/KPS-interiery/#galerie</loc></url>
```

---

## Search & Replace Pattern

### For XML/Text Editor:
```regex
# Search for:
/galerie/(kuchyne|loznice|koupelny|skrine|ostatni)/

# Replace with:
/galerie/
```

### For Individual Sections:
```bash
# Kitchen galleries
sed -i '' 's|/galerie/kuchyne/|/galerie/|g' app/public/sitemap.xml

# Bedroom galleries
sed -i '' 's|/galerie/loznice/|/galerie/|g' app/public/sitemap.xml

# Bathroom galleries
sed -i '' 's|/galerie/koupelny/|/galerie/|g' app/public/sitemap.xml

# Wardrobe galleries
sed -i '' 's|/galerie/skrine/|/galerie/|g' app/public/sitemap.xml

# Other galleries
sed -i '' 's|/galerie/ostatni/|/galerie/|g' app/public/sitemap.xml
```

---

## Verification Commands

### After fixing, verify with:
```bash
# Check for any remaining nested URLs (should return nothing)
grep -o 'galerie/[^/]*/[^<]*' app/public/sitemap.xml

# List all gallery URLs in sitemap
grep -o 'galerie/[^<]*' app/public/sitemap.xml | sort | uniq

# Compare with actual gallery slugs in code
grep -A 1 "GALLERY_SLUGS" app/src/lib/gallery.ts
```

---

## Testing After Fix

1. ✅ Validate sitemap XML syntax: https://www.xml-sitemaps.com/validate-xml-sitemap.html
2. ✅ Test random gallery URLs from sitemap in browser
3. ✅ Check Google Search Console for crawl errors
4. ✅ Run local build: `npm run build`
5. ✅ Check 404 errors in browser console

---

## Impact

### Before Fix:
- ❌ 35+ broken URLs in sitemap
- ❌ Search engines finding 404 errors
- ❌ Poor SEO impact
- ❌ Broken external links if shared

### After Fix:
- ✅ All URLs valid
- ✅ Proper search engine indexing
- ✅ Better SEO ranking
- ✅ Shareable gallery links work

---

## Files Modified:
- `/app/public/sitemap.xml` (only this file needs changes)

## Files NOT Modified (already correct):
- ✅ `/app/src/routes/galerie/index.tsx`
- ✅ `/app/src/routes/galerie/[slug]/index.tsx`
- ✅ `/app/src/components/Navigation.tsx`
- ✅ `/app/src/components/GalleriesPage.tsx`
- ✅ `/app/src/lib/gallery.ts`
