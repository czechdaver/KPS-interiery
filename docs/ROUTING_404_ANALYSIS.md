# 404 Routing Issues Analysis Report

**Date:** 2025-10-04
**Analyzed by:** Research Agent
**Working Directory:** /Users/David/Projects/kps-interier

---

## Executive Summary

The project has a **critical routing mismatch** between the sitemap.xml URLs and the actual route structure. The sitemap was created with a different routing pattern than what was actually implemented in the Qwik application.

### Primary Issue
**Sitemap expects category-based routing** (e.g., `/galerie/kuchyne/kuchyn-bila-ostruvek`) but the **actual routes use direct slug routing** (e.g., `/galerie/kuchyn-bila-ostruvek`).

---

## Current Route Structure (ACTUAL)

### Existing Routes in `/app/src/routes/`:
```
/                           → index.tsx (Home page)
/galerie                    → galerie/index.tsx (Gallery listing page)
/galerie/[slug]             → galerie/[slug]/index.tsx (Individual gallery detail)
/api/contact                → api/contact/index.ts (Contact form API)
```

### How It Works:
- **Main gallery page:** `/galerie` → Shows all galleries categorized by type
- **Individual gallery:** `/galerie/{gallery-id}` → Shows single gallery detail
  - Examples: `/galerie/kuchyn-bila-ostruvek`, `/galerie/loznice-hneda`

---

## Sitemap URLs (EXPECTED but WRONG)

The sitemap.xml contains **incorrect URL patterns** that don't match actual routes:

### ❌ WRONG - Category-based URLs in Sitemap:
```xml
<!-- Main gallery page - CORRECT -->
<loc>https://kps-interiery.github.io/KPS-interiery/galerie</loc>

<!-- Category pages - DO NOT EXIST -->
<loc>https://kps-interiery.github.io/KPS-interiery/galerie/kuchyne</loc>
<loc>https://kps-interiery.github.io/KPS-interiery/galerie/loznice</loc>
<loc>https://kps-interiery.github.io/KPS-interiery/galerie/koupelny</loc>
<loc>https://kps-interiery.github.io/KPS-interiery/galerie/skrine</loc>
<loc>https://kps-interiery.github.io/KPS-interiery/galerie/ostatni</loc>

<!-- Individual galleries - WRONG STRUCTURE -->
<loc>https://kps-interiery.github.io/KPS-interiery/galerie/kuchyne/kuchyn-bila-ostruvek</loc>
<loc>https://kps-interiery.github.io/KPS-interiery/galerie/loznice/loznice-hneda</loc>
<!-- etc... -->
```

### ✅ CORRECT - What URLs Should Be:
```xml
<!-- Individual galleries - FLAT STRUCTURE -->
<loc>https://kps-interiery.github.io/KPS-interiery/galerie/kuchyn-bila-ostruvek</loc>
<loc>https://kps-interiery.github.io/KPS-interiery/galerie/loznice-hneda</loc>
<loc>https://kps-interiery.github.io/KPS-interiery/galerie/koupelna-1</loc>
<!-- etc... -->
```

---

## Navigation Links (CORRECT)

The Navigation component is **correctly configured** for the actual route structure:

### Main Navigation:
- `/galerie` → Main gallery page ✅
- `/galerie#kuchyne` → Scroll to kitchen section ✅
- `/galerie#loznice` → Scroll to bedroom section ✅
- `/galerie#koupelny` → Scroll to bathroom section ✅
- `/galerie#skrine` → Scroll to wardrobe section ✅
- `/galerie#ostatni` → Scroll to other section ✅

### Gallery Cards:
- Links to `/galerie/{slug}` format ✅
- Example: `/galerie/kuchyn-bila-ostruvek` ✅

---

## Component Analysis

### 1. GalleriesPage Component (`app/src/components/GalleriesPage.tsx`)
**Status: ✅ CORRECT**

- Uses hash-based navigation for categories (`#kuchyne`, `#loznice`, etc.)
- Links to individual galleries use correct format: `/galerie/{gallery.id}`
- Implements proper scroll-to-section behavior
- No category-based routing expected

### 2. Gallery Detail Page (`app/src/routes/galerie/[slug]/index.tsx`)
**Status: ✅ CORRECT**

- Accepts slug parameter from URL
- Loads gallery data based on slug
- Breadcrumbs link correctly:
  - Home → `/`
  - Galerie → `/galerie`
  - Current gallery → displayed as text

### 3. Navigation Component (`app/src/components/Navigation.tsx`)
**Status: ✅ CORRECT**

- All links use correct format
- Hash navigation for sections works properly
- Mobile and desktop menus aligned

### 4. GalleryCategoryPage Component (`app/src/components/GalleryCategoryPage.tsx`)
**Status: ⚠️ EXISTS BUT UNUSED**

- This component exists but is **not connected to any route**
- Appears to be created for category-based routing that was never implemented
- Could be removed or properly integrated

---

## Gallery Data Structure

### Available Gallery Slugs (from `gallery.ts`):
```typescript
// Kitchen galleries
'kuchyn-bila-ostruvek', 'kuchyn-cerna', 'kuchyn-bila-u-tvar',
'kuchyn-bila-podkrovi', 'kuchyn-seda', 'kuchyn-bilo-hneda-beton',
'kuchyn-bilo-hneda-l-varianta1', 'kuchyn-bilo-hneda-u-alternativa',
'kuchyn-hneda-l', 'kuchyn-mala-panel', 'kuchyn-retro-bila',
'kuchyn-svetla-rohova', 'kuchyn-uzka-bila-l',

// Bedroom galleries
'loznice-bilo-hneda', 'loznice-hneda', 'loznice-hneda-zkosene',

// Bathroom galleries
'koupelna-1', 'koupelna-2', 'koupelna-cerna',

// Wardrobe galleries
'skrin-a-dvere', 'skrin-dvere-botnik', 'skrin-posuv-vstup',

// Other galleries
'chodba-bila', 'chodba-sedo-hneda', 'obyvak',
'ostatni-dvere', 'ostatni-live-edge-masiv', 'ostatni-schody'
```

---

## Root Cause Analysis

### What Happened:
1. ✅ Routes were implemented with **flat structure** (`/galerie/[slug]`)
2. ✅ Navigation was built to match this structure
3. ✅ GalleriesPage component uses **hash-based category sections**
4. ❌ Sitemap.xml was created with **nested category URLs** that don't exist
5. ⚠️ GalleryCategoryPage component was created but never connected to routes

### Why This Happened:
The commit message `bcff0b3` mentions:
> "Implement dynamic gallery routing with category pages"

But the **category page routes were never actually created** in `/app/src/routes/`. Only the GalleryCategoryPage **component** was created, not the **routes**.

---

## 404 Errors - Specific List

### Category Pages (DO NOT EXIST):
- ❌ `/galerie/kuchyne` → 404
- ❌ `/galerie/loznice` → 404
- ❌ `/galerie/koupelny` → 404
- ❌ `/galerie/skrine` → 404
- ❌ `/galerie/ostatni` → 404

### Individual Gallery Pages with Category Prefix (DO NOT EXIST):
- ❌ `/galerie/kuchyne/kuchyn-bila-ostruvek` → 404
- ❌ `/galerie/kuchyne/kuchyn-cerna` → 404
- ❌ `/galerie/loznice/loznice-hneda` → 404
- ❌ `/galerie/koupelny/koupelna-1` → 404
- ❌ `/galerie/skrine/skrin-a-dvere` → 404
- ❌ `/galerie/ostatni/chodba-bila` → 404
- *(All 30+ gallery URLs in sitemap follow this broken pattern)*

### What Actually Works:
- ✅ `/galerie` → Main gallery page
- ✅ `/galerie/kuchyn-bila-ostruvek` → Individual gallery
- ✅ `/galerie/loznice-hneda` → Individual gallery
- *(All direct slug URLs work correctly)*

---

## Recommendations for Fixes

### Option 1: Fix Sitemap (Recommended - Simplest)
**Update sitemap.xml to match actual routes**

**Pros:**
- No code changes needed
- Preserves current working structure
- Fast to implement
- SEO-friendly flat URL structure

**Changes Required:**
1. Remove category page URLs (`/galerie/kuchyne`, etc.)
2. Change all gallery URLs from `/galerie/{category}/{slug}` to `/galerie/{slug}`
3. Keep hash links in internal navigation for category sections

**Implementation:**
```xml
<!-- REMOVE these category URLs -->
<url><loc>.../galerie/kuchyne</loc></url>
<url><loc>.../galerie/loznice</loc></url>
<!-- etc -->

<!-- CHANGE from nested to flat -->
<!-- OLD: -->
<url><loc>.../galerie/kuchyne/kuchyn-bila-ostruvek</loc></url>

<!-- NEW: -->
<url><loc>.../galerie/kuchyn-bila-ostruvek</loc></url>
```

---

### Option 2: Implement Category Routes (More Work)
**Create actual category page routes**

**Pros:**
- Better SEO with category pages
- More organized URL structure
- Matches sitemap expectations

**Cons:**
- Requires route creation
- More complex routing logic
- Need to update all internal links
- GalleryCategoryPage component already exists but needs integration

**Changes Required:**
1. Create `/app/src/routes/galerie/[category]/index.tsx`
2. Create `/app/src/routes/galerie/[category]/[slug]/index.tsx`
3. Update all Link components throughout app
4. Update Navigation component logic
5. Update breadcrumb logic
6. Integrate existing GalleryCategoryPage component

**Route Structure:**
```
/app/src/routes/
  ├── galerie/
  │   ├── index.tsx                    # All galleries
  │   ├── [category]/
  │   │   ├── index.tsx               # Category page (kuchyne, loznice, etc)
  │   │   └── [slug]/
  │   │       └── index.tsx           # Individual gallery
```

---

### Option 3: Hybrid Approach
**Implement category pages but keep flat gallery URLs**

**Structure:**
```
✅ /galerie                             # Main gallery page
✅ /galerie/kuchyne                     # Kitchen category page
✅ /galerie/kuchyn-bila-ostruvek       # Flat gallery URL (redirect to category if needed)
```

---

## GitHub Actions & CI/CD Considerations

### Current Build Status:
- ✅ TypeScript builds successfully (recent fix in commit `f2095e6`)
- ⚠️ Sitemap contains invalid URLs (won't cause build failure but will cause 404s)

### Testing Recommendations:
1. Add route validation tests to check all sitemap URLs
2. Implement automated link checking in CI/CD
3. Add Playwright tests for gallery navigation
4. Verify all breadcrumb links work correctly

---

## Immediate Action Plan

### Quick Fix (1-2 hours):
1. ✅ **Update sitemap.xml** to use flat structure
2. ✅ **Remove category page URLs** from sitemap
3. ✅ **Test all gallery links** work correctly
4. ✅ **Verify internal navigation** (already correct)

### Long-term (If category pages desired):
1. ⚠️ Decide if category pages add value
2. ⚠️ Create proper route structure
3. ⚠️ Update all components and links
4. ⚠️ Add comprehensive tests

---

## Files to Update

### Critical (for Quick Fix):
1. ✏️ `/app/public/sitemap.xml` → Update all URLs to flat structure

### Optional (for Category Route Implementation):
1. Create `/app/src/routes/galerie/[category]/index.tsx`
2. Create `/app/src/routes/galerie/[category]/[slug]/index.tsx`
3. Update `/app/src/components/Navigation.tsx`
4. Update `/app/src/components/GalleriesPage.tsx`
5. Integrate `/app/src/components/GalleryCategoryPage.tsx`

---

## Summary

### The Problem:
- Sitemap expects nested category URLs that don't exist
- Actual routes use flat slug-based structure
- This creates 30+ 404 errors for gallery pages

### The Solution:
- **Recommended:** Update sitemap.xml to match actual flat route structure
- **Alternative:** Implement category routes (more work, questionable SEO benefit)

### Current Status:
- ✅ Application routes work correctly
- ✅ Navigation works correctly
- ✅ Gallery functionality works correctly
- ❌ Sitemap contains broken URLs
- ❌ Search engines will encounter 404s from sitemap

---

## Next Steps

1. **Decide:** Fix sitemap OR implement category routes
2. **Implement:** Make necessary changes
3. **Test:** Verify all URLs work
4. **Deploy:** Update production sitemap
5. **Monitor:** Check for 404 errors in analytics

**Recommended Decision:** Fix sitemap (Option 1) - it's faster, cleaner, and the current structure works well.
