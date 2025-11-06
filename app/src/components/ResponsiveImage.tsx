import { component$ } from "@builder.io/qwik";
import { generateOptimizedImageSources } from "../lib/gallery";

export interface ResponsiveImageProps {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  class?: string;
  loading?: "lazy" | "eager";
  sizes?: string;
  priority?: boolean;
  responsive?: boolean; // When true, don't set fixed width/height attributes
}

export const ResponsiveImage = component$<ResponsiveImageProps>(({
  src,
  alt,
  title,
  width,
  height,
  class: className = "",
  loading = "lazy",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  responsive = false
}) => {
  // Extract gallery info from src path
  const getGalleryInfo = (srcPath: string) => {
    const match = srcPath.match(/\/images\/galleries\/([^/]+)\/(.+)$/);
    if (match) {
      return {
        galleryId: match[1],
        imageName: match[2]
      };
    }
    return null;
  };

  const galleryInfo = getGalleryInfo(src);
  const sources = galleryInfo
    ? generateOptimizedImageSources(galleryInfo.galleryId, galleryInfo.imageName, width, height)
    : { fallback: src };

  // For internal gallery images with AVIF optimization
  if (sources.avif) {
    return (
      <picture>
        <source 
          srcset={sources.avif} 
          sizes={sizes} 
          type="image/avif"
        />
        <img
          src={sources.fallback}
          alt={alt}
          {...(title ? { title } : {})}
          {...(!responsive && width !== undefined ? { width } : !responsive ? { width: 800 } : {})}
          {...(!responsive && height !== undefined ? { height } : !responsive ? { height: 600 } : {})}
          class={className}
          loading={priority ? "eager" : loading}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          style={responsive ? { width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' } : undefined}
        />
      </picture>
    );
  }

  // Fallback for external images or simple cases
  return (
    <img
      src={sources.fallback}
      alt={alt}
      {...(title ? { title } : {})}
      {...(!responsive && width !== undefined ? { width } : !responsive ? { width: 800 } : {})}
      {...(!responsive && height !== undefined ? { height } : !responsive ? { height: 600 } : {})}
      class={className}
      loading={priority ? "eager" : loading}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      style={responsive ? { width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' } : undefined}
    />
  );
});

// Utility function for generating image URLs with AVIF optimization
export function getOptimizedImageUrl(
  src: string,
  options: {
    width?: number;
    height?: number;
    format?: 'avif' | 'jpg';
    quality?: number;
  } = {}
) {
  const { width = 800, format = 'avif' } = options;

  if (src.includes('/images/galleries/')) {
    // Check if the path is already processed (contains -web-{width}w pattern)
    const alreadyProcessed = /-web-\d+w\.avif$/.test(src);
    if (alreadyProcessed) {
      return src; // Return as-is if already processed
    }

    // For gallery images, use the optimal AVIF version
    const pathParts = src.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const baseName = fileName.replace(/\.[^/.]+$/, '').replace('-web', '');
    const galleryPath = pathParts.slice(0, -1).join('/');

    if (format === 'avif') {
      // Use correct format with "-web-" to match actual files
      return `${galleryPath}/${baseName}-web-${width}w.avif`;
    }
  }

  return src;
}

// Hook for preloading critical images with AVIF
export function preloadImage(src: string, priority: boolean = false) {
  if (typeof document !== 'undefined' && priority) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = getOptimizedImageUrl(src, { width: 800, format: 'avif' });
    document.head.appendChild(link);
  }
}