# Gallery System Maintenance Guide

## 🚨 Critical Checklist for Gallery Changes

**ALWAYS follow this checklist when adding, renaming, or modifying galleries:**

### 1. Directory and File Operations
- [ ] **Directory names** must match `GALLERY_SLUGS` in `app/src/lib/gallery.ts`
- [ ] **Image filenames** must follow `kuchyne_XXXX-web.jpg` pattern for kitchens
- [ ] **JSON files** must be named `gallery.json` in each gallery directory

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