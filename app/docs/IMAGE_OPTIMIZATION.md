# 📸 Image Optimization Guide for KPS Interiéry

## Overview

This project uses an advanced image optimization system that automatically generates multiple formats (AVIF, WebP, JPEG) and sizes (400px, 800px, 1200px, 1600px) from your source images. This ensures optimal loading performance across all devices and browsers.

## 🚀 Quick Start

### 1. Adding New Gallery Images

1. Place high-quality source images in the gallery directory:
   ```
   public/images/galleries/your-gallery-name/
   ```

2. Supported source formats:
   - `.jpg`, `.jpeg` - Standard photography format
   - `.png` - For images with transparency
   - `.tiff`, `.tif` - High-quality format
   - `.raw` - Professional photography format

### 2. Processing Images

Run the image processor to generate optimized versions:

```bash
npm run images:process
```

This will automatically create:
- **AVIF versions** (best compression, modern browsers)
- **WebP versions** (excellent compression, wide support)
- **JPEG versions** (universal compatibility)
- **Multiple sizes** for responsive loading

### 3. Cleaning Generated Images

To remove all processed images and start fresh:

```bash
npm run images:clean
```

## 🎯 How It Works

### Automatic Format Generation

The system automatically generates optimized images in multiple formats:

```
source-image.jpg
├── source-image-400w.avif    (400px wide, AVIF format)
├── source-image-400w.webp    (400px wide, WebP format)  
├── source-image-400w.jpg     (400px wide, JPEG format)
├── source-image-800w.avif    (800px wide, AVIF format)
├── source-image-800w.webp    (800px wide, WebP format)
├── source-image-800w.jpg     (800px wide, JPEG format)
└── ... (continues for 1200px and 1600px)
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
├── kitchen-modern-island/
│   ├── cover.jpg                 # Source image
│   ├── cover-400w.avif          # Generated
│   ├── cover-400w.webp          # Generated
│   ├── cover-400w.jpg           # Generated
│   ├── cover-800w.avif          # Generated
│   └── ... (more sizes)
├── bathroom-modern/
│   └── ... (same structure)
└── office-furniture/
    └── ... (same structure)
```

## 🎨 Best Practices

### Source Images
- **Use high-quality sources**: Start with the best quality possible
- **Consistent aspect ratios**: Maintain visual consistency
- **Proper naming**: Use descriptive, SEO-friendly names
- **Size appropriately**: Don't go larger than 2400px width

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
1. Check if source images exist
2. Run `npm run images:process`
3. Verify file permissions
4. Check browser console for errors

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

This system ensures your gallery images load fast while looking great across all devices and browsers! 🎉