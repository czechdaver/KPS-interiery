export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
}

export interface GalleryData {
  id: string;
  title: string;
  category: string;
  description: string;
  coverImage: string;
  images: GalleryImage[];
  features: string[];
  materials: string[];
  // New fields for galleries page
  location: string;
  date: string;
  imageCount: number;
  coverImages: string[]; // Array of images for gallery preview
}

// Gallery slugs that correspond to folder names
export const GALLERY_SLUGS = [
  'kuchyn-bila-podkrovi',
  'kuchyn-bila-ostruvek',
  'kuchyn-cerna',
  'kuchyn-seda',
  'kuchyn-bila-u-tvar',
  'kuchyn-bilo-hneda-beton',
  'kuchyn-bilo-hneda-l-varianta1',
  'kuchyn-bilo-hneda-u-alternativa',
  'kuchyn-hneda-l',
  'kuchyn-mala-panel',
  'kuchyn-retro-bila'
] as const;

export type GallerySlug = typeof GALLERY_SLUGS[number];

/**
 * Validate gallery data structure
 */
function validateGalleryData(data: any): data is GalleryData {
  if (!data || typeof data !== 'object') return false;
  
  const requiredFields = ['id', 'title', 'category', 'description', 'coverImage', 'images'];
  for (const field of requiredFields) {
    if (!(field in data)) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }
  
  // Validate images array
  if (!Array.isArray(data.images) || data.images.length === 0) {
    console.error('Images must be a non-empty array');
    return false;
  }
  
  // Validate each image object
  for (const image of data.images) {
    if (!image.src || !image.alt || typeof image.width !== 'number' || typeof image.height !== 'number') {
      console.error('Invalid image structure:', image);
      return false;
    }
  }
  
  return true;
}

/**
 * Load gallery data from JSON file with enhanced error handling and validation
 */
export async function loadGalleryData(slug: GallerySlug): Promise<GalleryData | null> {
  // Validate slug parameter
  if (!slug || !GALLERY_SLUGS.includes(slug)) {
    console.error(`Invalid gallery slug provided: ${slug}`);
    return null;
  }

  // Load gallery data from JSON files on both server and client
  // This ensures consistent data loading across SSR and CSR
  
  try {
    // Handle URL construction for both server and client environments
    const baseUrl = typeof window === 'undefined' 
      ? 'http://localhost:5173/' // Server-side: use localhost for dev
      : window.location.origin + (import.meta.env.BASE_URL || '/');
      
    const galleryUrl = `${baseUrl}images/galleries/${slug}/gallery.json`;
    console.log(`Loading gallery from: ${galleryUrl}`);
    
    const response = await fetch(galleryUrl, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Gallery data not found for ${slug} (404)`);
      } else {
        console.warn(`Failed to load gallery data for ${slug}: HTTP ${response.status}`);
      }
      return null;
    }
    
    const data = await response.json();
    
    // Validate the loaded data structure
    if (!validateGalleryData(data)) {
      console.error(`Invalid gallery data structure for ${slug}`);
      return null;
    }
    
    return data as GalleryData;
  } catch (error) {
    console.error(`Error loading gallery data for ${slug}:`, error);
    return null;
  }
}

function getDefaultTitle(slug: string): string {
  const titles: Record<string, string> = {
    'kitchen-white-attic': 'Bílá kuchyň v podkroví',
    'kuchyn-bila-ostruvek': 'Bílá kuchyň s ostrůvkem',
    'kuchyn-cerna': 'Černá kuchyň',
    'kuchyn-seda': 'Šedá kuchyň',
    'kuchyn-bila-u-tvar': 'Bílá kuchyň ve tvaru U',
    'kuchyn-bilo-hneda-beton': 'Bílo-hnědá kuchyň s betonovým designem',
    'kuchyn-bilo-hneda-l-varianta1': 'Bílo-hnědá kuchyň ve tvaru L - varianta 1',
    'kuchyn-bilo-hneda-u-alternativa': 'Bílo-hnědá kuchyň ve tvaru U - alternativní návrh',
    'kuchyn-hneda-l': 'Hnědá kuchyň do L',
    'kuchyn-mala-panel': 'Malá panelová kuchyň',
    'kuchyn-retro-bila': 'Retro bílá kuchyň'
  };
  return titles[slug] || slug;
}

function getDefaultCategory(slug: string): string {
  if (slug.includes('kitchen') || slug.includes('kuchyn')) return 'Kuchyně';
  if (slug.includes('wardrobe') || slug.includes('skrin')) return 'Skříně';
  if (slug.includes('bathroom') || slug.includes('koupeln')) return 'Koupelny';
  if (slug.includes('office') || slug.includes('kancelář')) return 'Kanceláře';
  return 'Ostatní';
}

/**
 * Validate that all gallery directories exist and slugs are correct
 */
export function validateGalleryConfiguration(): string[] {
  const errors: string[] = [];
  
  // Check for old naming patterns that should have been updated
  const outdatedPatterns = ['skrine-', 'wardrobe-', 'closet-'];
  GALLERY_SLUGS.forEach(slug => {
    outdatedPatterns.forEach(pattern => {
      if (slug.includes(pattern)) {
        errors.push(`Gallery slug '${slug}' contains outdated pattern '${pattern}' - should use 'kuchyn-' for kitchens`);
      }
    });
  });
  
  return errors;
}

/**
 * Load all gallery data with enhanced error handling and timeout logic
 */
export async function loadAllGalleries(): Promise<GalleryData[]> {
  // Validate configuration first
  const validationErrors = validateGalleryConfiguration();
  if (validationErrors.length > 0) {
    console.warn('Gallery configuration issues:', validationErrors);
  }
  
  // Load galleries with timeout and retry logic
  const galleries = await Promise.allSettled(
    GALLERY_SLUGS.map(slug => 
      Promise.race([
        loadGalleryData(slug),
        new Promise<null>((_, reject) => 
          setTimeout(() => reject(new Error(`Timeout loading ${slug}`)), 10000)
        )
      ]).catch(error => {
        console.error(`Failed to load gallery ${slug}:`, error);
        return null;
      })
    )
  );
  
  const loadedGalleries = galleries
    .filter((result): result is PromiseFulfilledResult<GalleryData> => 
      result.status === 'fulfilled' && result.value !== null
    )
    .map(result => result.value)
    .filter((gallery): gallery is GalleryData => gallery !== null);
    
  // Log detailed results
  const failedGalleries = galleries
    .map((result, index) => ({ result, slug: GALLERY_SLUGS[index] }))
    .filter(({ result }) => result.status === 'rejected' || (result.status === 'fulfilled' && result.value === null))
    .map(({ slug, result }) => ({ 
      slug, 
      reason: result.status === 'rejected' ? result.reason?.message : 'No data returned' 
    }));
    
  if (failedGalleries.length > 0) {
    console.error(`Failed to load ${failedGalleries.length} galleries:`, failedGalleries);
  }
  
  console.log(`Successfully loaded ${loadedGalleries.length} out of ${GALLERY_SLUGS.length} galleries`);
  
  // Sort galleries by date (newest first) for consistent display
  return loadedGalleries.sort((a, b) => {
    const dateA = new Date(a.date || '1970-01-01');
    const dateB = new Date(b.date || '1970-01-01');
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Get full image path for gallery with fallback handling
 */
export function getImagePath(galleryId: string, imageSrc: string): string {
  if (!galleryId || !imageSrc) {
    console.warn('Invalid gallery ID or image source provided', { galleryId, imageSrc });
    const baseUrl = typeof window === 'undefined' 
      ? '/images/placeholder.jpg' 
      : (window.location.origin + (import.meta.env.BASE_URL || '/') + 'images/placeholder.jpg');
    return baseUrl;
  }
  
  // Validate gallery ID exists in our known slugs
  if (!GALLERY_SLUGS.includes(galleryId as GallerySlug)) {
    console.warn(`Unknown gallery ID: ${galleryId}`);
    const baseUrl = typeof window === 'undefined' 
      ? '/images/placeholder.jpg' 
      : (window.location.origin + (import.meta.env.BASE_URL || '/') + 'images/placeholder.jpg');
    return baseUrl;
  }
  
  // Handle URL construction for both server and client environments
  const baseUrl = typeof window === 'undefined' 
    ? '/images/galleries/' 
    : (window.location.origin + (import.meta.env.BASE_URL || '/') + 'images/galleries/');
  
  return `${baseUrl}${galleryId}/${imageSrc}`;
}

/**
 * Create a preload link element for critical images
 */
export function preloadImage(src: string): void {
  if (typeof window !== 'undefined' && src) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  }
}

/**
 * Map gallery data for galleries page display
 */
export function mapGalleryForDisplay(gallery: GalleryData) {
  return {
    id: gallery.id,
    title: gallery.title,
    description: gallery.description,
    location: gallery.location,
    date: gallery.date,
    imageCount: gallery.imageCount,
    coverImages: gallery.coverImages.map(img => getImagePath(gallery.id, img))
  };
}

/**
 * Get galleries grouped by category
 */
export function getGalleriesByCategory(galleries: GalleryData[]) {
  return {
    kuchyne: galleries.filter(g => g.category === 'Kuchyně'),
    koupelny: galleries.filter(g => g.category === 'Koupelny'), 
    skrine: galleries.filter(g => g.category === 'Skříně'),
    ostatni: galleries.filter(g => !['Kuchyně', 'Koupelny', 'Skříně'].includes(g.category))
  };
}

// Galleries with full optimization (AVIF, WebP, JPEG in multiple sizes)
const OPTIMIZED_GALLERIES = [
  'kuchyn-bila-podkrovi',
  'kuchyn-bila-ostruvek',
  'kuchyn-cerna',
  'kuchyn-seda',
  'kuchyn-bila-u-tvar',
  'kuchyn-bilo-hneda-beton',
  'kuchyn-bilo-hneda-l-varianta1',
  'kuchyn-bilo-hneda-u-alternativa',
  'kuchyn-hneda-l',
  'kuchyn-mala-panel',
  'kuchyn-retro-bila'
] as const;

/**
 * Generate optimized image sources for responsive images and lightbox
 */
export function generateOptimizedImageSources(galleryId: string, imageSrc: string) {
  const baseUrl = typeof window === 'undefined' 
    ? '/images/galleries/' 
    : (window.location.origin + (import.meta.env.BASE_URL || '/') + 'images/galleries/');
  const baseDir = `${baseUrl}${galleryId}`;
  
  // Check if this gallery has full range of optimized sizes
  const isFullRange = OPTIMIZED_GALLERIES.includes(galleryId as any);
  
  if (!isFullRange) {
    // For galleries without full optimization, use original
    return {
      fallback: `${baseDir}/${imageSrc}`
    };
  }
  
  // For optimized galleries, extract base name but keep underscores
  // (e.g., "kuchyne_0031-web.jpg" -> "kuchyne_0031-web")
  const fileName = imageSrc.split('/').pop() || imageSrc;
  const baseName = fileName.replace(/\.[^/.]+$/, '');
  
  // Generate all size variants for full-range galleries
  const sizes = ['400w', '800w', '1200w', '1600w'];
  
  const avifSrcSet = sizes
    .map(size => `${baseDir}/${baseName}-${size}.avif ${size}`)
    .join(', ');
  
  const webpSrcSet = sizes
    .map(size => `${baseDir}/${baseName}-${size}.webp ${size}`)
    .join(', ');
  
  const jpegSrcSet = sizes
    .map(size => `${baseDir}/${baseName}-${size}.jpeg ${size}`)
    .join(', ');
  
  return {
    avif: avifSrcSet,
    webp: webpSrcSet,
    jpeg: jpegSrcSet,
    fallback: `${baseDir}/${fileName}`
  };
}

/**
 * Get best quality image for lightbox
 */
export function getLightboxImageUrl(galleryId: string, imageSrc: string) {
  const baseUrl = typeof window === 'undefined' 
    ? '/images/galleries/' 
    : (window.location.origin + (import.meta.env.BASE_URL || '/') + 'images/galleries/');
  const baseDir = `${baseUrl}${galleryId}`;
  
  // Check if this gallery has full range of optimized sizes
  const isFullRange = OPTIMIZED_GALLERIES.includes(galleryId as any);
  
  if (!isFullRange) {
    return `${baseDir}/${imageSrc}`;
  }
  
  // For optimized galleries, extract base name but keep underscores
  // (e.g., "kuchyne_0031-web.jpg" -> "kuchyne_0031-web")
  const fileName = imageSrc.split('/').pop() || imageSrc;
  const baseName = fileName.replace(/\.[^/.]+$/, '');
  
  // Use highest quality WebP for lightbox (best balance of quality and compatibility)
  return `${baseDir}/${baseName}-1600w.webp`;
}