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
  'kitchen-white-attic',
  'kuchyn-bila-ostruvek',
  'kuchyn-cerna',
  'kuchyn-seda',
  'kuchyn-bila-podkrovi-alternativa',
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
 * Load gallery data from JSON file
 */
export async function loadGalleryData(slug: GallerySlug): Promise<GalleryData | null> {
  if (typeof window === 'undefined') {
    // Server-side: return mock data for SSR - only for kitchen-white-attic
    if (slug === 'kitchen-white-attic') {
      return {
        id: slug,
        title: getDefaultTitle(slug),
        category: getDefaultCategory(slug),
        description: 'Elegantní bílá kuchyně přizpůsobená podkrovním prostorům se šikmými střechami.',
        coverImage: 'kuchyne_0031-web.jpg',
        images: [
          {
            src: 'kuchyne_0031-web.jpg',
            alt: 'Bílá kuchyň v podkroví - celkový pohled',
            width: 2560,
            height: 1707,
            caption: 'Celkový pohled na bílou kuchyni v podkroví'
          }
        ],
        features: ['Přizpůsobení šikmým střechám', 'Maximální využití prostoru'],
        materials: ['Lamino bílá mat', 'Kompaktní deska'],
        location: 'Praha',
        date: '2024-02',
        imageCount: 11,
        coverImages: ['kuchyne_0031-web.jpg', 'kuchyne_0042-web.jpg', 'kuchyne_0046-web.jpg']
      };
    }
    return null;
  }
  
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}images/galleries/${slug}/gallery.json`);
    if (!response.ok) {
      console.warn(`Failed to load gallery data for ${slug}`);
      return null;
    }
    const data = await response.json();
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
    'kuchyn-bila-podkrovi-alternativa': 'Bílá kuchyň v podkroví - alternativní řešení',
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
 * Load all gallery data
 */
export async function loadAllGalleries(): Promise<GalleryData[]> {
  // Validate configuration first
  const validationErrors = validateGalleryConfiguration();
  if (validationErrors.length > 0) {
    console.warn('Gallery configuration issues:', validationErrors);
  }
  
  const galleries = await Promise.allSettled(
    GALLERY_SLUGS.map(slug => loadGalleryData(slug))
  );
  
  const loadedGalleries = galleries
    .filter((result): result is PromiseFulfilledResult<GalleryData> => 
      result.status === 'fulfilled' && result.value !== null
    )
    .map(result => result.value);
    
  // Log any failed galleries
  const failedGalleries = galleries
    .map((result, index) => ({ result, slug: GALLERY_SLUGS[index] }))
    .filter(({ result }) => result.status === 'rejected' || (result.status === 'fulfilled' && result.value === null))
    .map(({ slug }) => slug);
    
  if (failedGalleries.length > 0) {
    console.error(`Failed to load ${failedGalleries.length} galleries:`, failedGalleries);
  }
  
  console.log(`Successfully loaded ${loadedGalleries.length} out of ${GALLERY_SLUGS.length} galleries`);
  
  return loadedGalleries;
}

/**
 * Get full image path for gallery
 */
export function getImagePath(galleryId: string, imageSrc: string): string {
  return `${import.meta.env.BASE_URL}images/galleries/${galleryId}/${imageSrc}`;
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

/**
 * Generate optimized image sources for responsive images and lightbox
 */
export function generateOptimizedImageSources(galleryId: string, imageSrc: string) {
  const baseDir = `${import.meta.env.BASE_URL}images/galleries/${galleryId}`;
  
  // Check if this gallery has full range of optimized sizes
  const fullRangeGalleries = [
    'kitchen-white-attic',
    'kuchyn-bila-ostruvek',
    'kuchyn-cerna',
    'kuchyn-seda',
    'kuchyn-bila-podkrovi-alternativa',
    'kuchyn-bila-u-tvar',
    'kuchyn-bilo-hneda-beton',
    'kuchyn-bilo-hneda-l-varianta1',
    'kuchyn-bilo-hneda-u-alternativa',
    'kuchyn-hneda-l',
    'kuchyn-mala-panel',
    'kuchyn-retro-bila'
  ];
  
  const isFullRange = fullRangeGalleries.includes(galleryId);
  
  if (!isFullRange) {
    // For galleries without full optimization, use original
    return {
      fallback: `${baseDir}/${imageSrc}`
    };
  }
  
  // For optimized galleries, extract base name (e.g., "kuchyne_0031-web.jpg" -> "kuchyne_0031-web")
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
    fallback: `${baseDir}/${baseName}-optimized.jpg`
  };
}

/**
 * Get best quality image for lightbox
 */
export function getLightboxImageUrl(galleryId: string, imageSrc: string) {
  const baseDir = `${import.meta.env.BASE_URL}images/galleries/${galleryId}`;
  
  // Check if this gallery has full range of optimized sizes
  const fullRangeGalleries = [
    'kitchen-white-attic',
    'kuchyn-bila-ostruvek',
    'kuchyn-cerna',
    'kuchyn-seda',
    'kuchyn-bila-podkrovi-alternativa',
    'kuchyn-bila-u-tvar',
    'kuchyn-bilo-hneda-beton',
    'kuchyn-bilo-hneda-l-varianta1',
    'kuchyn-bilo-hneda-u-alternativa',
    'kuchyn-hneda-l',
    'kuchyn-mala-panel',
    'kuchyn-retro-bila'
  ];
  
  const isFullRange = fullRangeGalleries.includes(galleryId);
  
  if (!isFullRange) {
    return `${baseDir}/${imageSrc}`;
  }
  
  // For optimized galleries, extract base name (e.g., "kuchyne_0031-web.jpg" -> "kuchyne_0031-web")
  const fileName = imageSrc.split('/').pop() || imageSrc;
  const baseName = fileName.replace(/\.[^/.]+$/, '');
  
  // Use highest quality WebP for lightbox (best balance of quality and compatibility)
  return `${baseDir}/${baseName}-1600w.webp`;
}