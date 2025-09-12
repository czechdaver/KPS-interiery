# 📸 Image Optimization Guide for KPS Interiéry

## Overview

This project uses a streamlined AVIF-only image optimization system for gallery management. Source images are stored as `*-original-resource.jpg` files and converted into optimized AVIF format with multiple responsive sizes. **IMPORTANT: Never use original resource files directly in the website - always use converted variants.**

## ✨ AVIF-Only Optimization Strategy

We've simplified our image optimization to use **only AVIF format** for maximum compression and quality:
- **AVIF format only**: Best compression with excellent quality
- **Optimal resolution detection**: Only generates sizes appropriate for source image
- **JPEG fallback**: Single fallback file for legacy browser support
- **Simplified workflow**: No more multiple format variants to manage

## 🚀 Quick Start

### 1. Adding New Gallery Images

1. Place high-quality source images in the gallery directory with the naming convention:
   ```
   public/images/galleries/your-gallery-name/
   └── image-name-original-resource.jpg
   ```

2. Source file naming rules:
   - **MUST end with**: `-original-resource.jpg`
   - **Example**: `kuchyne_0031-original-resource.jpg`
   - **Purpose**: Source files for conversion only, never used directly on website

3. Supported source formats for original resources:
   - `.jpg`, `.jpeg` - Primary format for original resources
   - High-quality, uncompressed or minimally compressed images

### 2. Processing Images

Run the image processor to convert original resource files:

```bash
npm run images:process
```

**Conversion Process:**
- Scans for `*-original-resource.jpg` files
- Creates optimized variants in multiple formats and sizes
- **Never processes original resource files for web use**

Generated variants from `image-original-resource.jpg`:
- **AVIF versions**: Optimal sizes (400w, 800w, 1200w, 1600w, 2400w) based on source dimensions
- **JPEG fallback**: Single optimized fallback for legacy browser support
- **Smart sizing**: Only generates sizes that make sense for the source image dimensions

### 3. Cleaning Generated Images

To remove all processed variants and start fresh:

```bash
npm run images:clean
```

**Note**: This only removes generated variants, preserving original resource files.

## 🎯 How It Works

### File Naming Convention and Workflow

**Source Files (Never used directly):**
```
kuchyne_0031-original-resource.jpg  ← High-quality source
```

**Generated Variants (Used in website):**
```
kuchyne_0031-original-resource.jpg (SOURCE - never used on web)
├── kuchyne_0031-web-400w.avif     ← 400px AVIF variant
├── kuchyne_0031-web-800w.avif     ← 800px AVIF variant
├── kuchyne_0031-web-1200w.avif    ← 1200px AVIF variant
├── kuchyne_0031-web-1600w.avif    ← 1600px AVIF variant
├── kuchyne_0031-web-2400w.avif    ← 2400px AVIF variant (if source is large enough)
└── kuchyne_0031-web.jpg           ← JPEG fallback for legacy browsers
```

**Note**: Only AVIF sizes that make sense for the source image dimensions are generated. For example, a 1000px wide source won't generate 1200w, 1600w, or 2400w variants.

### Gallery JSON Configuration

In `gallery.json`, reference only the web variants:

```json
{
  "images": [
    {
      "src": "kuchyne_0031-web.jpg",
      "alt": "Kitchen description",
      "width": 2560,
      "height": 1707,
      "caption": "Caption text"
    }
  ],
  "coverImage": "kuchyne_0031-web.jpg"
}
```

### Smart Responsive Loading

The `ResponsiveImage` component automatically:
- **Serves AVIF** for maximum compression and quality (96%+ browser support)
- **Falls back to JPEG** for legacy browsers
- **Loads appropriate size** based on screen size with intelligent srcset generation
- **Uses highest quality** for lightbox (2400w AVIF when available)
- **Lazy loads** images below the fold
- **Prioritizes** above-the-fold images

## 🔧 Technical Implementation

### Vite Plugin Configuration

```javascript
// vite.config.ts - AVIF-only configuration
imagetools({
  defaultDirectives: (url) => {
    if (url.pathname.includes('/images/galleries/')) {
      return new URLSearchParams({
        format: 'avif', // Only AVIF format
        as: 'picture',
        w: '400;800;1200;1600;2400', // Smart sizing based on source
        quality: '75' // Optimized for AVIF
      });
    }
    return new URLSearchParams();
  }
})
```

### ResponsiveImage Component Usage

```tsx
<ResponsiveImage 
  src="/images/galleries/kitchen-modern/cover.jpg"
  alt="Modern kitchen with island"
  width={800}
  height={600}
  priority={true} // For above-the-fold images
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### 🎯 Responsive Sizing for Gallery Cards

**For gallery cards and containers with fixed dimensions**, use the `responsive` prop to ensure images properly fill their container:

```tsx
<ResponsiveImage 
  src={coverImage}
  alt={`${gallery.title} - náhled`}
  class="gallery-preview-image"
  responsive={true}  // 🚨 Critical for proper card sizing
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

**When `responsive={true}`:**
- Removes fixed width/height attributes from `<img>` elements
- Applies inline styles: `width: 100%; height: 100%; object-fit: cover; object-position: center`
- Ensures image fills container while maintaining aspect ratio
- Works with both AVIF `<picture>` elements and fallback `<img>` elements

**When to use `responsive={true}`:**
- Gallery card preview images (`.gallery-preview-image`)
- Portfolio section images
- Any image that should fill a container with fixed dimensions
- Images in CSS Grid or Flexbox layouts

**When to use `responsive={false}` (default):**
- Hero images with specific dimensions
- Content images with natural aspect ratios
- Images where you want to preserve exact pixel dimensions

## 📊 Performance Benefits

### File Size Reduction
- **AVIF**: Up to 50% smaller than JPEG with better quality
- **Smart sizing**: Only generates and loads appropriate resolutions
- **Optimal compression**: 75% quality setting for perfect balance

### Loading Performance
- **96%+ browser support**: AVIF works on all modern browsers
- **Simplified delivery**: No complex format negotiation needed
- **Lazy loading**: Faster initial page load
- **Progressive loading**: Images appear as they're ready
- **Priority loading**: Critical images load first
- **Optimal lightbox**: 2400w AVIF for maximum quality viewing

## 🛠️ Advanced Usage

### Manual Image Optimization

For specific optimization needs:

```javascript
import { getOptimizedImageUrl } from '../components/ResponsiveImage';

const optimizedUrl = getOptimizedImageUrl(
  '/images/galleries/kitchen/photo.jpg',
  {
    width: 1200,
    format: 'webp',
    quality: 90
  }
);
```

### Preloading Critical Images

```javascript
import { preloadImage } from '../components/ResponsiveImage';

// Preload hero image
preloadImage('/images/galleries/featured/hero.jpg', true);
```

## 📁 Directory Structure

```
public/images/galleries/
├── kitchen-white-attic/
│   ├── gallery.json                           # Gallery metadata
│   ├── kuchyne_0031-original-resource.jpg     # Source (never used on web)
│   ├── kuchyne_0031-web.jpg                   # JPEG fallback for legacy browsers
│   ├── kuchyne_0031-web-400w.avif            # Small screens
│   ├── kuchyne_0031-web-800w.avif            # Medium screens
│   ├── kuchyne_0031-web-1200w.avif           # Large screens
│   ├── kuchyne_0031-web-1600w.avif           # High-resolution displays
│   ├── kuchyne_0031-web-2400w.avif           # Lightbox/maximum quality
│   └── ... (more images following same pattern)
├── bathroom-modern/
│   └── ... (same structure)
└── office-furniture/
    └── ... (same structure)
```

## 🎨 Best Practices

### Source Images (Original Resources)
- **Always use `-original-resource.jpg` suffix**: Required for proper processing
- **Use high-quality sources**: Start with the best quality possible (minimal compression)
- **Consistent aspect ratios**: Maintain visual consistency across gallery
- **Proper naming**: `descriptive-name-original-resource.jpg`
- **Size appropriately**: Recommended 2400px+ width for best quality conversion
- **Never reference directly**: Original resources must never be used in gallery.json or components

### Web Variants
- **Always use `-web.jpg` variants**: Reference only converted files in gallery.json
- **Proper fallback**: Use optimized.jpg as fallback image
- **Responsive variants**: System automatically generates 400w, 800w, 1200w, 1600w sizes

### Performance
- **Set priority**: Mark above-the-fold images as priority
- **Use appropriate sizes**: Match sizes attribute to your layout
- **Consider aspect ratios**: Prevent layout shift
- **Test on slow connections**: Verify loading behavior

### SEO & Accessibility
- **Descriptive alt text**: Always provide meaningful descriptions
- **Structured naming**: Use consistent naming conventions
- **Image dimensions**: Always specify width and height

## 🔍 Troubleshooting

### 🚨 Images Not Filling Container Width (Gallery Cards)

**Problem:** Images in gallery cards appear cropped, too small, or don't fill the card container properly.

**Solution:** Use the `responsive={true}` prop for container-based images:

```tsx
// ❌ WRONG - Fixed dimensions won't fill container
<ResponsiveImage 
  src={coverImage}
  alt="Gallery preview"
  width={800}
  height={600}
/>

// ✅ CORRECT - Responsive fills container properly
<ResponsiveImage 
  src={coverImage}
  alt="Gallery preview"
  class="gallery-preview-image"
  responsive={true}  // 🚨 Critical fix
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

**Technical Details:**
- When `responsive={true}`, the component applies `width: 100%; height: 100%; object-fit: cover` inline styles
- Removes fixed width/height attributes that prevent proper container filling
- Works with both AVIF `<picture>` and fallback `<img>` elements
- Ensures image maintains aspect ratio while covering the entire container

**CSS Requirements:**
```css
.gallery-preview {
  position: relative;
  height: 240px; /* Fixed container height */
  overflow: hidden;
}

.gallery-preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
```

### Images Not Loading
1. Check if `-original-resource.jpg` source images exist
2. Run `npm run images:process` to generate web variants
3. Verify gallery.json references `-web.jpg` files (not original resources)
4. Verify file permissions
5. Check browser console for errors
6. Ensure no direct references to original resource files in code

### Build Errors
1. Ensure Sharp is properly installed
2. Check TypeScript configuration
3. Verify import paths
4. Run `npm install` to refresh dependencies

### Poor Performance
1. Check image sizes in dev tools
2. Verify responsive sizes attribute
3. Test on different devices
4. Monitor network requests

## 🚀 Deployment Considerations

### Build Process
- Images are processed during development
- Generated images are included in the build
- No server-side processing required

### CDN Integration
- All optimized images can be served via CDN
- Consider using a service like Cloudinary for dynamic optimization
- Ensure proper cache headers

### Monitoring
- Use Lighthouse to measure performance
- Monitor Core Web Vitals
- Track image loading metrics

## 📈 Measuring Success

### Key Metrics
- **Largest Contentful Paint (LCP)**: Should improve with optimized images
- **Cumulative Layout Shift (CLS)**: Proper dimensions prevent shift
- **Page Load Time**: Faster with smaller, optimized images

### Tools
- Chrome DevTools Network tab
- Google PageSpeed Insights
- WebPageTest
- Lighthouse performance audits

---

## 🖼️ Gallery System Integration

### Adding New Galleries

1. **Create gallery directory:**
   ```bash
   mkdir public/images/galleries/new-gallery-name
   ```

2. **Add original resource images:**
   ```bash
   # Place high-quality source images with proper naming
   new-gallery-name/
   ├── image1-original-resource.jpg
   ├── image2-original-resource.jpg
   └── image3-original-resource.jpg
   ```

3. **Process images:**
   ```bash
   npm run images:process
   ```

4. **Create gallery.json:**
   ```json
   {
     "id": "new-gallery-name",
     "title": "Gallery Title",
     "category": "Kuchyně",
     "description": "Gallery description",
     "coverImage": "image1-web.jpg",
     "images": [
       {
         "src": "image1-web.jpg",
         "alt": "Image description",
         "width": 2560,
         "height": 1707,
         "caption": "Image caption"
       }
     ],
     "features": ["Feature 1", "Feature 2"],
     "materials": ["Material 1", "Material 2"],
     "location": "Praha",
     "date": "2024-03",
     "imageCount": 3,
     "coverImages": ["image1-web.jpg", "image2-web.jpg", "image3-web.jpg"]
   }
   ```

5. **Update gallery.ts:**
   ```typescript
   // Add new gallery slug to GALLERY_SLUGS array
   export const GALLERY_SLUGS = [
     'kitchen-white-attic',
     'new-gallery-name'  // Add here
   ] as const;
   ```

### File Naming Rules Summary

| File Type | Naming Pattern | Usage |
|-----------|----------------|--------|
| Original Resource | `name-original-resource.jpg` | Source for conversion only |
| Web Fallback | `name-web.jpg` | Referenced in gallery.json, JPEG fallback |
| Responsive Variants | `name-web-400w.avif` to `name-web-2400w.avif` | Auto-generated AVIF sizes |
| Lightbox Images | `name-web-2400w.avif` | Highest quality for lightbox viewing |

### ⚠️ Critical Rules

1. **NEVER** use `*-original-resource.jpg` files directly in:
   - gallery.json files
   - React components
   - ResponsiveImage components
   - Any web-facing code

2. **ALWAYS** use `*-web.jpg` files in:
   - gallery.json `src` and `coverImage` fields
   - Manual image references

3. **System handles** AVIF variants automatically:
   - generateOptimizedImageSources() creates AVIF-only srcsets
   - getLightboxImageUrl() uses 2400w AVIF for maximum quality
   - Optimal resolution detection prevents unnecessary variants

## 🎯 AVIF-Only Benefits

This simplified approach provides:
- **Better Performance**: No format negotiation overhead
- **Smaller Files**: Up to 50% reduction vs JPEG with better quality
- **Simplified Workflow**: One format to manage instead of three
- **Future-Proof**: 96%+ browser support and growing
- **Optimal Quality**: 2400w AVIF for lightbox provides crisp viewing experience

This streamlined system ensures your gallery images load fast while looking amazing across all devices! 🎉