# Gallery System Maintenance Guide

## 🚨 UPDATED: Current Gallery System Status (2024-12)

**The gallery system has been FULLY RESTORED and OPTIMIZED. This documentation reflects the current working state.**

### Current System Architecture:
- **Gallery Categories**: 5 main categories (Kuchyně, Ložnice, Koupelny, Skříně, Ostatní projekty)
- **SEO-Optimized URLs**: `/galerie` → `/galerie/[slug]` structure
- **Image Format**: `-web-` naming convention for AVIF optimization
- **UI**: Single "Detail galerie" button per gallery card with PhImages icon

## 🚨 Critical Checklist for Gallery Changes

**ALWAYS follow this checklist when adding, renaming, or modifying galleries:**

### 1. Directory and File Operations
- [ ] **Directory names** must match `GALLERY_SLUGS` in `app/src/lib/gallery.ts`
- [ ] **Image filenames** must follow `-web-` naming convention (e.g., `filename-web-1600w.avif`)
- [ ] **JSON files** must be named `gallery.json` in each gallery directory
- [ ] **CRITICAL**: NEVER remove `-web-` from image paths - this is required for AVIF optimization

### 2. Code Updates Required After Gallery Changes

#### A. Update `app/src/lib/gallery.ts`
- [ ] Update `GALLERY_SLUGS` array with new/changed directory names
- [ ] Update `getDefaultTitle()` function with new slugs and titles  
- [ ] Update both `fullRangeGalleries` arrays (in `generateOptimizedImageSources()` and `getLightboxImageUrl()`)
- [ ] Run validation: Check console for warnings from `validateGalleryConfiguration()`

#### B. Update JSON Files
- [ ] Ensure all `gallery.json` files have correct `id` field matching directory name
- [ ] Ensure all `gallery.json` files have correct `category: "Kuchyně"` for kitchens
- [ ] Update image `src` fields to match renamed image files
- [ ] Update `coverImage` and `coverImages` arrays with correct filenames

#### C. Test Gallery Loading
- [ ] Check browser console for gallery loading errors
- [ ] Verify all galleries appear on galleries page
- [ ] Test lightbox functionality for each gallery
- [ ] Verify responsive images are loading correctly

### 3. Naming Conventions

#### Directory Names (MUST match exactly)
- ✅ `kuchyn-*` for Czech kitchen galleries
- ✅ `kitchen-*` for English kitchen galleries  
- ❌ `skrine-*` (old pattern - never use)
- ❌ `wardrobe-*` (wrong - all galleries are kitchens)

#### Image Files
- ✅ `kuchyne_XXXX-web.jpg` for main images
- ✅ `kuchyne_XXXX-original-resource.jpg` for originals
- ✅ `kuchyne_XXXX-web-1200w.avif` for optimized variants

### 4. Common Issues and Solutions

#### Problem: Only first 4 galleries load
**Cause:** `GALLERY_SLUGS` array contains non-existent directory names
**Solution:** 
1. Check `app/src/lib/gallery.ts` line 26-39
2. Ensure all slugs match actual directory names
3. Update `fullRangeGalleries` arrays on lines 173+ and 231+

#### Problem: Images not loading in gallery
**Cause:** Image filenames in JSON don't match actual files
**Solution:**
1. Check `gallery.json` `images[].src` values
2. Ensure filenames match pattern `kuchyne_XXXX-web.jpg`
3. Update `coverImage` and `coverImages` arrays

#### Problem: Gallery appears in wrong category
**Cause:** Incorrect `category` field in `gallery.json`
**Solution:**
1. Set `category: "Kuchyně"` for all kitchen galleries
2. Check `getGalleriesByCategory()` function filters

### 5. Development Workflow

#### When Adding New Gallery:
1. Create directory with correct name pattern
2. Add directory name to `GALLERY_SLUGS` array
3. Add title mapping to `getDefaultTitle()` function
4. Add to both `fullRangeGalleries` arrays
5. Create `gallery.json` with correct structure
6. Test loading and display

#### When Renaming Gallery:
1. Rename directory
2. Rename all image files
3. Update `GALLERY_SLUGS` array
4. Update `getDefaultTitle()` mapping
5. Update both `fullRangeGalleries` arrays
6. Update `gallery.json` with new `id` and image filenames
7. Test all functionality

### 6. Validation Tools

#### Built-in Validation
- `validateGalleryConfiguration()` function automatically checks for common issues
- Browser console warnings for configuration problems
- Error logging for failed gallery loads

#### Manual Checks
```bash
# Check directory names match GALLERY_SLUGS
ls app/public/images/galleries/

# Check for old naming patterns
find . -name "*skrine*" -type d

# Verify JSON files exist
find app/public/images/galleries -name "gallery.json" | wc -l
# Should return 12 (total number of galleries)
```

### 7. Performance Considerations

- All galleries should be included in `fullRangeGalleries` arrays for optimal image loading
- Use `loading="lazy"` for gallery preview images
- Lightbox uses highest quality WebP images (1600w variant)
- Responsive images automatically select best format (AVIF → WebP → JPEG)

## 🚨 Recent Changes and UI Updates (December 2024)

### Gallery Button Changes
**IMPORTANT**: The gallery UI has been updated to simplify the user experience:

#### OLD UI (Before December 2024):
- Two buttons per gallery: "Zobrazit galerii" + "Detail galerie"
- "Zobrazit galerii" opened lightbox directly from gallery page
- "Detail galerie" navigated to individual gallery detail page

#### NEW UI (Current - December 2024):
- **Single button per gallery**: "Detail galerie" only
- Uses `view-gallery-btn` CSS class (golden/brown theme color)
- Uses `PhImages` icon (matches landing page "Zobrazit celou galerii" button)
- Simplified workflow: Gallery page → Detail page → Lightbox

### Technical Implementation
- **File Modified**: `/src/components/GalleriesPage.tsx`
- **Button Class**: `view-gallery-btn` (uses `var(--secondary)` color)
- **Icon**: `PhImages` size 18px
- **Navigation**: Direct link to `/galerie/[slug]` pages

### Why This Change?
1. **Simplified UX**: One clear action per gallery
2. **SEO Benefits**: Drives traffic to individual gallery pages
3. **Consistent Design**: Matches landing page button style
4. **Better Analytics**: Track which galleries get the most detail views

### Code Changes Made:
```typescript
// OLD CODE (removed):
<button class="view-gallery-btn" onClick$={() => openLightbox(gallery)}>
  <PhEye size={18} />
  Zobrazit galerii
</button>
<a href={`/galerie/${gallery.id}`} class="detail-gallery-btn">
  <PhMagicWand size={18} />
  Detail galerie
</a>

// NEW CODE (current):
<a href={`/galerie/${gallery.id}`} class="view-gallery-btn">
  <PhImages size={18} />
  Detail galerie
</a>
```

### Critical Warning for Future Development
**NEVER REVERT TO DOUBLE BUTTONS WITHOUT USER APPROVAL**
- The double-button system caused user confusion
- Single button approach improves conversion to detail pages
- Any UI changes should be discussed with stakeholders first

## Emergency Recovery

If galleries stop working:
1. Check browser console for specific errors
2. Verify directory names match `GALLERY_SLUGS` exactly
3. Ensure `gallery.json` files have correct structure
4. Check that image files exist and match JSON references
5. Run validation function and fix reported issues

## Testing Checklist

Before deploying gallery changes:
- [ ] All galleries visible on galleries page
- [ ] No console errors during gallery loading
- [ ] Lightbox opens and displays all images
- [ ] Responsive images load correctly on different screen sizes
- [ ] Gallery categories display correctly
- [ ] Image optimization working (check Network tab)

## 🔧 Common Issues & Critical Fixes

### Issue 1: "Massive Gallery Outage" - Image 404 Errors

**Symptoms:**
- Images showing 404 errors with malformed filenames like `filename-1600w-web-1200w.avif`
- Gallery cards showing broken images
- Lightbox not loading images

**Root Cause:**
Double-processing of already-optimized image paths in ResponsiveImage component

**Critical Fix Applied:**
```typescript
// In ResponsiveImage.tsx - getOptimizedImageUrl function
export function getOptimizedImageUrl(src: string, options = {}) {
  if (src.includes('/images/galleries/')) {
    // CRITICAL: Check if already processed to prevent double-processing
    const alreadyProcessed = /-web-\d+w\.avif$/.test(src);
    if (alreadyProcessed) {
      return src; // Return as-is if already processed
    }
    // Process normally only if not already processed...
  }
}
```

**Prevention:**
- NEVER remove `-web-` from working image paths
- Always check for existing optimization before applying new optimization
- Test image loading after any path changes

### Issue 2: Missing Gallery Detail Pages

**Symptoms:**
- Gallery cards display correctly but missing "Detail galerie" buttons
- Some gallery categories don't have detail page access

**Root Cause:**
UI buttons were removed from certain gallery sections during development

**Fix Applied:**
Added consistent button structure to ALL gallery sections:
```typescript
<div class="gallery-actions">
  <a href={`/galerie/${gallery.id}`} class="view-gallery-btn">
    <PhImages size={18} />
    Detail galerie
  </a>
</div>
```

### Issue 3: Double-Width Concatenation Error

**Historical Issue - FIXED:**
Original misdiagnosis led to incorrect removal of `-web-` format from working paths.

**Lesson Learned:**
- Always investigate actual file structure before making path changes
- The `-web-` format IS CORRECT and required for AVIF optimization
- Test all changes thoroughly before assuming path format issues

### Issue 4: ResponsiveImage Double-Processing

**Technical Details:**
The ResponsiveImage component was applying optimization to already-optimized paths, creating malformed URLs.

**Solution:**
Added regex detection to prevent re-processing: `/-web-\d+w\.avif$/`

**Files Fixed:**
1. `/src/components/ResponsiveImage.tsx` - Added already-processed detection
2. `/src/lib/gallery.ts` - Fixed double-processing in generateOptimizedImageSources
3. `/src/components/GalleriesPage.tsx` - Added missing Detail buttons