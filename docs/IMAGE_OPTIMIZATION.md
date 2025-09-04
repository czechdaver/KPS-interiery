# 📸 Image Optimization Guide for KPS Interiéry

## Overview

This project uses a structured image optimization system for gallery management. Source images are stored as `*-original-resource.jpg` files and converted into multiple optimized formats and sizes for web use. **IMPORTANT: Never use original resource files directly in the website - always use converted variants.**

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
- **Web-optimized versions** (400w, 800w, 1200w, 1600w)
- **AVIF versions** (best compression, modern browsers)
- **WebP versions** (excellent compression, wide support)  
- **JPEG versions** (universal compatibility)
- **Fallback version** (`image-optimized.jpg`)

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
├── kuchyne_0031-web-400w.webp     ← 400px WebP variant
├── kuchyne_0031-web-400w.jpeg     ← 400px JPEG variant
├── kuchyne_0031-web-800w.avif     ← 800px AVIF variant
├── kuchyne_0031-web-800w.webp     ← 800px WebP variant
├── kuchyne_0031-web-800w.jpeg     ← 800px JPEG variant
├── kuchyne_0031-web-1200w.avif    ← 1200px AVIF variant
├── kuchyne_0031-web-1200w.webp    ← 1200px WebP variant
├── kuchyne_0031-web-1200w.jpeg    ← 1200px JPEG variant
├── kuchyne_0031-web-1600w.avif    ← 1600px AVIF variant
├── kuchyne_0031-web-1600w.webp    ← 1600px WebP variant
├── kuchyne_0031-web-1600w.jpeg    ← 1600px JPEG variant
└── kuchyne_0031-web.jpg           ← Fallback optimized version
```

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
- **Serves AVIF** to browsers that support it (best compression)
- **Falls back to WebP** for older browsers
- **Uses JPEG** as final fallback
- **Loads appropriate size** based on screen size
- **Lazy loads** images below the fold
- **Prioritizes** above-the-fold images

## 🔧 Technical Implementation

### Vite Plugin Configuration

```javascript
// vite.config.ts
imagetools({
  defaultDirectives: (url) => {
    if (url.pathname.includes('/images/galleries/')) {
      return new URLSearchParams({
        format: 'avif;webp;jpg',
        as: 'picture',
        w: '400;800;1200;1600',
        quality: '85'
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

## 📊 Performance Benefits

### File Size Reduction
- **AVIF**: Up to 50% smaller than JPEG
- **WebP**: Up to 30% smaller than JPEG
- **Responsive sizing**: Only load what you need

### Loading Performance
- **Modern format support**: Better compression
- **Lazy loading**: Faster initial page load
- **Progressive loading**: Images appear as they're ready
- **Priority loading**: Critical images load first

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
│   ├── kuchyne_0031-web.jpg                   # Optimized fallback
│   ├── kuchyne_0031-web-400w.avif            # Generated variants
│   ├── kuchyne_0031-web-400w.webp            # Generated variants
│   ├── kuchyne_0031-web-400w.jpeg            # Generated variants
│   ├── kuchyne_0031-web-800w.avif            # Generated variants
│   ├── kuchyne_0031-web-800w.webp            # Generated variants
│   ├── kuchyne_0031-web-800w.jpeg            # Generated variants
│   ├── kuchyne_0031-web-1200w.avif           # Generated variants
│   ├── kuchyne_0031-web-1200w.webp           # Generated variants
│   ├── kuchyne_0031-web-1200w.jpeg           # Generated variants
│   ├── kuchyne_0031-web-1600w.avif           # Generated variants
│   ├── kuchyne_0031-web-1600w.webp           # Generated variants
│   ├── kuchyne_0031-web-1600w.jpeg           # Generated variants
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
| Web Fallback | `name-web.jpg` | Referenced in gallery.json |
| Responsive Variants | `name-web-400w.{avif,webp,jpeg}` | Auto-generated by system |
| Lightbox Images | `name-web-1600w.webp` | Auto-used by getLightboxImageUrl() |

### ⚠️ Critical Rules

1. **NEVER** use `*-original-resource.jpg` files directly in:
   - gallery.json files
   - React components
   - ResponsiveImage components
   - Any web-facing code

2. **ALWAYS** use `*-web.jpg` files in:
   - gallery.json `src` and `coverImage` fields
   - Manual image references

3. **System handles** responsive variants automatically:
   - generateOptimizedImageSources() creates srcsets
   - getLightboxImageUrl() selects best quality for lightbox

This system ensures your gallery images load fast while looking great across all devices and browsers! 🎉