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
  seoText?: string; // Optional SEO-optimized descriptive text for gallery detail page
}

// Gallery slugs that correspond to folder names
export const GALLERY_SLUGS = [
  // Featured kitchen galleries (moved to top)
  'kuchyn-bila-ostruvek',     // Bílá kuchyň s ostrůvkem
  'kuchyn-cerna',             // Černá kuchyň
  'kuchyn-bila-u-tvar',       // Bílá kuchyň do U

  // Remaining kitchen galleries
  'kuchyn-bila-podkrovi',
  'kuchyn-seda',
  'kuchyn-bilo-hneda-beton',
  'kuchyn-bilo-hneda-l-varianta1',
  'kuchyn-bilo-hneda-u-alternativa',
  'kuchyn-hneda-l',
  'kuchyn-mala-panel',
  'kuchyn-retro-bila',
  'kuchyn-svetla-rohova',
  'kuchyn-uzka-bila-l',

  // Bedroom galleries (Ložnice category)
  'loznice-bilo-hneda',
  'loznice-hneda',
  'loznice-hneda-zkosene',

  // Other galleries
  'chodba-bila',
  'chodba-sedo-hneda',
  'koupelna-1',
  'koupelna-2',
  'koupelna-cerna',
  'obyvak',
  'ostatni-dvere',
  'ostatni-live-edge-masiv',
  'ostatni-schody',
  'skrin-a-dvere',
  'skrin-dvere-botnik',
  'skrin-posuv-vstup'
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
    // During static generation, use the configured origin from staticAdapter
    const baseUrl = typeof window === 'undefined'
      ? 'https://kps-interiery.cz/' // Static generation: use production origin
      : window.location.origin + (import.meta.env.BASE_URL || '/');

    const galleryUrl = `${baseUrl}images/galleries/${slug}/gallery.json`;

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
  if (slug.includes('bedroom') || slug.includes('loznice')) return 'Ložnice';
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

  // Sort galleries by GALLERY_SLUGS order to preserve featured galleries first
  return loadedGalleries.sort((a, b) => {
    const indexA = GALLERY_SLUGS.indexOf(a.id as GallerySlug);
    const indexB = GALLERY_SLUGS.indexOf(b.id as GallerySlug);
    return indexA - indexB;
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
      : (import.meta.env.BASE_URL || '/') + 'images/placeholder.jpg';
    return baseUrl;
  }

  // Validate gallery ID exists in our known slugs
  if (!GALLERY_SLUGS.includes(galleryId as GallerySlug)) {
    console.warn(`Unknown gallery ID: ${galleryId}`);
    const baseUrl = typeof window === 'undefined'
      ? '/images/placeholder.jpg'
      : (import.meta.env.BASE_URL || '/') + 'images/placeholder.jpg';
    return baseUrl;
  }
  
  // Handle URL construction for both server and client environments
  const baseUrl = typeof window === 'undefined'
    ? '/images/galleries/'
    : (import.meta.env.BASE_URL || '/') + 'images/galleries/';

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
 * Get cover image path with intelligent fallback chain for maximum compatibility
 */
export function getCoverImagePath(galleryId: string, imageSrc: string): string {
  // Validate inputs
  if (!galleryId || !imageSrc) {
    console.warn('Invalid galleryId or imageSrc provided to getCoverImagePath', { galleryId, imageSrc });
    return getImagePath(galleryId, imageSrc);
  }

  const isOptimized = OPTIMIZED_GALLERIES.includes(galleryId as any);

  if (!isOptimized) {
    return getImagePath(galleryId, imageSrc);
  }

  // For optimized galleries, create intelligent fallback chain
  const baseUrl = typeof window === 'undefined'
    ? '/images/galleries/'
    : (import.meta.env.BASE_URL || '/') + 'images/galleries/';
  const baseDir = `${baseUrl}${galleryId}`;

  const fileName = imageSrc.split('/').pop() || imageSrc;
  const baseName = fileName.replace(/\.[^/.]+$/, '').replace('-web', '');

  // Intelligent fallback chain for cover images:
  // 1. Try 1600w AVIF (most compatible for both portrait/landscape)
  // 2. If that fails, the ResponsiveImage component will handle JPEG fallback
  return `${baseDir}/${baseName}-web-1600w.avif`;
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
    coverImages: gallery.coverImages.map(imgSrc => {
      // Find the image data to preserve dimensions
      const imageData = gallery.images.find(img => img.src === imgSrc) || gallery.images[0];
      return {
        src: getCoverImagePath(gallery.id, imgSrc),
        width: imageData?.width,
        height: imageData?.height,
        alt: imageData?.alt || gallery.title
      };
    })
  };
}

/**
 * Convert category name to URL slug
 */
export function getCategorySlug(category: string): string {
  const categoryMap: Record<string, string> = {
    'Kuchyně': 'kuchyne',
    'Ložnice': 'loznice',
    'Koupelny': 'koupelny',
    'Skříně': 'skrine',
    'Ostatní': 'ostatni'
  };
  return categoryMap[category] || 'ostatni';
}

/**
 * Convert category slug back to display name
 */
export function getCategoryName(categorySlug: string): string {
  const categoryMap: Record<string, string> = {
    'kuchyne': 'Kuchyně',
    'loznice': 'Ložnice',
    'koupelny': 'Koupelny',
    'skrine': 'Skříně',
    'ostatni': 'Ostatní'
  };
  return categoryMap[categorySlug] || 'Ostatní';
}

/**
 * Create SEO-friendly slug from gallery title
 */
export function createGallerySlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[áàâäãåā]/g, 'a')
    .replace(/[éèêëēė]/g, 'e')
    .replace(/[íìîïīį]/g, 'i')
    .replace(/[óòôöõøō]/g, 'o')
    .replace(/[úùûüūů]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/[ñń]/g, 'n')
    .replace(/[çć]/g, 'c')
    .replace(/[šś]/g, 's')
    .replace(/[žź]/g, 'z')
    .replace(/[ď]/g, 'd')
    .replace(/[ť]/g, 't')
    .replace(/[ř]/g, 'r')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate gallery URL from gallery data
 */
export function getGalleryUrl(gallery: GalleryData): string {
  return `/galerie/${gallery.id}`;
}

/**
 * Get all gallery URLs for sitemap generation
 */
export function getAllGalleryUrls(galleries: GalleryData[]): string[] {
  return galleries.map(gallery => {
    return `https://kps-interiery.cz/galerie/${gallery.id}`;
  });
}

/**
 * Get galleries grouped by category
 */
export function getGalleriesByCategory(galleries: GalleryData[]) {
  return {
    kuchyne: galleries.filter(g => g.category === 'Kuchyně'),
    loznice: galleries.filter(g => g.category === 'Ložnice'),
    koupelny: galleries.filter(g => g.category === 'Koupelny'),
    skrine: galleries.filter(g => g.category === 'Skříně'),
    ostatni: galleries.filter(g => !['Kuchyně', 'Ložnice', 'Koupelny', 'Skříně'].includes(g.category))
  };
}

// Galleries with full optimization (AVIF, WebP, JPEG in multiple sizes)
const OPTIMIZED_GALLERIES = [
  // Featured kitchen galleries
  'kuchyn-bila-ostruvek',
  'kuchyn-cerna',
  'kuchyn-bila-u-tvar',

  // Remaining kitchen galleries
  'kuchyn-bila-podkrovi',
  'kuchyn-seda',
  'kuchyn-bilo-hneda-beton',
  'kuchyn-bilo-hneda-l-varianta1',
  'kuchyn-bilo-hneda-u-alternativa',
  'kuchyn-hneda-l',
  'kuchyn-mala-panel',
  'kuchyn-retro-bila',
  'kuchyn-svetla-rohova',
  'kuchyn-uzka-bila-l',

  // Bedroom galleries (Ložnice category)
  'loznice-bilo-hneda',
  'loznice-hneda',
  'loznice-hneda-zkosene',

  // Other galleries
  'chodba-bila',
  'chodba-sedo-hneda',
  'koupelna-1',
  'koupelna-2',
  'koupelna-cerna',
  'obyvak',
  'ostatni-dvere',
  'ostatni-live-edge-masiv',
  'ostatni-schody',
  'skrin-a-dvere',
  'skrin-dvere-botnik',
  'skrin-posuv-vstup'
] as const;

/**
 * Generate AVIF-optimized image sources for responsive images with intelligent size selection
 */
export function generateOptimizedImageSources(galleryId: string, imageSrc: string, imageWidth?: number, imageHeight?: number) {
  // Validate inputs
  if (!galleryId || !imageSrc) {
    console.warn('Invalid galleryId or imageSrc provided to generateOptimizedImageSources', { galleryId, imageSrc });
    return { fallback: '/images/placeholder.jpg' };
  }

  const baseUrl = typeof window === 'undefined'
    ? '/images/galleries/'
    : (import.meta.env.BASE_URL || '/') + 'images/galleries/';
  const baseDir = `${baseUrl}${galleryId}`;

  // Check if this gallery has full range of optimized sizes
  const isFullRange = OPTIMIZED_GALLERIES.includes(galleryId as any);

  if (!isFullRange) {
    // For galleries without full optimization, use original
    return {
      fallback: `${baseDir}/${imageSrc}`
    };
  }

  // For optimized galleries, extract base name and clean it
  const fileName = imageSrc.split('/').pop() || imageSrc;
  // Clean the filename: remove extension, -web suffix, and any -XXXXw width suffixes
  const baseName = fileName
    .replace(/\.[^/.]+$/, '')  // Remove extension
    .replace(/-web-\d+w$/, '') // Remove -web-1600w pattern
    .replace(/-web$/, '')      // Remove trailing -web
    .replace(/-\d+w$/, '');    // Remove trailing -1600w pattern

  // Improved portrait/landscape detection with fallback logic
  // Default to landscape (safer assumption) if dimensions are missing
  let isLandscape = true;

  if (imageWidth && imageHeight) {
    isLandscape = imageWidth > imageHeight;
  }
  // Removed verbose logging for missing dimensions - this is expected behavior

  // Generate optimal AVIF sizes based on actual available files
  // Portrait images (1707px): 400w, 800w, 1200w, 1600w only
  // Landscape images (2560px): All sizes including 2400w
  const allSizes = ['400w', '800w', '1200w', '1600w', '2400w'];
  const availableSizes = isLandscape ? allSizes : allSizes.slice(0, 4); // Remove 2400w for portrait

  const avifSrcSet = availableSizes
    .map(size => `${baseDir}/${baseName}-web-${size}.avif ${size}`)
    .join(', ');

  return {
    avif: avifSrcSet,
    fallback: `${baseDir}/${fileName}` // JPEG fallback
  };
}

/**
 * Get best available AVIF image for lightbox with smart fallback chain
 */
export function getLightboxImageUrl(galleryId: string, imageSrc: string, imageWidth?: number, imageHeight?: number) {
  // Validate inputs
  if (!galleryId || !imageSrc) {
    console.warn('Invalid galleryId or imageSrc provided to getLightboxImageUrl', { galleryId, imageSrc });
    return '/images/placeholder.jpg';
  }

  const baseUrl = typeof window === 'undefined'
    ? '/images/galleries/'
    : (import.meta.env.BASE_URL || '/') + 'images/galleries/';
  const baseDir = `${baseUrl}${galleryId}`;

  // Check if this gallery has full range of optimized sizes
  const isFullRange = OPTIMIZED_GALLERIES.includes(galleryId as any);

  if (!isFullRange) {
    return `${baseDir}/${imageSrc}`;
  }

  // For optimized galleries, extract base name and clean it
  const fileName = imageSrc.split('/').pop() || imageSrc;
  // Clean the filename: remove extension, -web suffix, and any -XXXXw width suffixes
  const baseName = fileName
    .replace(/\.[^/.]+$/, '')  // Remove extension
    .replace(/-web-\d+w$/, '') // Remove -web-1600w pattern
    .replace(/-web$/, '')      // Remove trailing -web
    .replace(/-\d+w$/, '');    // Remove trailing -1600w pattern

  // Smart portrait/landscape detection with graceful defaults
  let isLandscape = true; // Default to landscape for safety

  if (imageWidth && imageHeight) {
    isLandscape = imageWidth > imageHeight;
  }
  // Removed verbose logging for missing dimensions - fallback behavior is intentional

  // Smart size selection for lightbox (highest quality available)
  if (isLandscape) {
    // Landscape images: use 2400w for maximum quality
    // ResponsiveImage component will handle fallback if 2400w doesn't exist
    return `${baseDir}/${baseName}-web-2400w.avif`;
  } else {
    // Portrait images: use 1600w (safe option, always available)
    return `${baseDir}/${baseName}-web-1600w.avif`;
  }
}