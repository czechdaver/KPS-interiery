import { component$ } from "@builder.io/qwik";

export interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  class?: string;
  loading?: "lazy" | "eager";
  sizes?: string;
  priority?: boolean;
}

export const ResponsiveImage = component$<ResponsiveImageProps>(({
  src,
  alt,
  width = 800,
  height = 600,
  class: className = "",
  loading = "lazy",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false
}) => {
  // Generate different sized images for responsive loading
  const generateImageSources = (baseSrc: string) => {
    try {
      // For gallery images, we'll use imagetools query parameters
      if (baseSrc.includes('/images/galleries/')) {
        const avifSrcSet = [
          `${baseSrc}?format=avif&w=400&quality=85 400w`,
          `${baseSrc}?format=avif&w=800&quality=85 800w`, 
          `${baseSrc}?format=avif&w=1200&quality=85 1200w`,
          `${baseSrc}?format=avif&w=1600&quality=85 1600w`
        ].join(', ');
        
        const webpSrcSet = [
          `${baseSrc}?format=webp&w=400&quality=85 400w`,
          `${baseSrc}?format=webp&w=800&quality=85 800w`,
          `${baseSrc}?format=webp&w=1200&quality=85 1200w`, 
          `${baseSrc}?format=webp&w=1600&quality=85 1600w`
        ].join(', ');
        
        const jpegSrcSet = [
          `${baseSrc}?format=jpg&w=400&quality=85 400w`,
          `${baseSrc}?format=jpg&w=800&quality=85 800w`,
          `${baseSrc}?format=jpg&w=1200&quality=85 1200w`,
          `${baseSrc}?format=jpg&w=1600&quality=85 1600w`
        ].join(', ');
        
        return {
          avif: avifSrcSet,
          webp: webpSrcSet,
          jpeg: jpegSrcSet,
          fallback: `${baseSrc}?format=jpg&w=${width}&quality=85`
        };
      }
      
      // Fallback for external images (like Unsplash)
      return {
        fallback: baseSrc
      };
    } catch {
      return {
        fallback: baseSrc
      };
    }
  };

  const sources = generateImageSources(src);

  // For internal gallery images with multiple formats
  if (sources.avif && sources.webp && sources.jpeg) {
    return (
      <picture class={className}>
        <source 
          srcset={sources.avif} 
          sizes={sizes} 
          type="image/avif"
        />
        <source 
          srcset={sources.webp} 
          sizes={sizes} 
          type="image/webp" 
        />
        <source 
          srcset={sources.jpeg} 
          sizes={sizes} 
          type="image/jpeg"
        />
        <img
          src={sources.fallback}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : loading}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
        />
      </picture>
    );
  }

  // Fallback for external images or simple cases
  return (
    <img
      src={sources.fallback}
      alt={alt}
      width={width}
      height={height}
      class={className}
      loading={priority ? "eager" : loading}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );
});

// Utility function for generating image URLs with optimization
export function getOptimizedImageUrl(
  src: string, 
  options: {
    width?: number;
    height?: number;
    format?: 'avif' | 'webp' | 'jpg';
    quality?: number;
  } = {}
) {
  const { width = 800, format = 'webp', quality = 85 } = options;
  
  if (src.includes('/images/galleries/')) {
    const params = new URLSearchParams();
    params.set('format', format);
    params.set('w', width.toString());
    params.set('quality', quality.toString());
    if (options.height) params.set('h', options.height.toString());
    
    return `${src}?${params.toString()}`;
  }
  
  return src;
}

// Hook for preloading critical images
export function preloadImage(src: string, priority: boolean = false) {
  if (typeof document !== 'undefined' && priority) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = getOptimizedImageUrl(src, { width: 800, format: 'webp' });
    document.head.appendChild(link);
  }
}