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
}

// Gallery slugs that correspond to folder names
export const GALLERY_SLUGS = [
  'kitchen-modern-island',
  'wardrobe-sliding-doors', 
  'bathroom-vanity-modern',
  'office-custom-furniture',
  'kitchen-luxury-marble',
  'bathroom-wooden-elements'
] as const;

export type GallerySlug = typeof GALLERY_SLUGS[number];

/**
 * Load gallery data from JSON file
 */
export async function loadGalleryData(slug: GallerySlug): Promise<GalleryData | null> {
  if (typeof window === 'undefined') {
    // Server-side: return mock data for SSR
    return {
      id: slug,
      title: getDefaultTitle(slug),
      category: getDefaultCategory(slug),
      description: `Mock description for ${slug}`,
      coverImage: 'cover.jpg',
      images: [
        {
          src: 'cover.jpg',
          alt: `${slug} cover`,
          width: 1200,
          height: 800,
          caption: 'Main view'
        }
      ],
      features: ['Feature 1', 'Feature 2'],
      materials: ['Material 1', 'Material 2']
    };
  }
  
  try {
    const response = await fetch(`./images/galleries/${slug}/gallery.json`);
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
    'kitchen-modern-island': 'Moderní kuchyň s ostrůvkem',
    'wardrobe-sliding-doors': 'Vestavěná skříň s posuvnými dveřmi',
    'bathroom-vanity-modern': 'Koupelnový nábytek s umyvadlem',
    'office-custom-furniture': 'Kancelářský nábytek na míru',
    'kitchen-luxury-marble': 'Luxusní kuchyň s mramorovými akcenty',
    'bathroom-wooden-elements': 'Moderní koupelna s dřevěnými prvky'
  };
  return titles[slug] || slug;
}

function getDefaultCategory(slug: string): string {
  if (slug.includes('kitchen')) return 'Kuchyně';
  if (slug.includes('wardrobe')) return 'Skříně';
  if (slug.includes('bathroom')) return 'Koupelny';
  if (slug.includes('office')) return 'Kanceláře';
  return 'Ostatní';
}

/**
 * Load all gallery data
 */
export async function loadAllGalleries(): Promise<GalleryData[]> {
  const galleries = await Promise.allSettled(
    GALLERY_SLUGS.map(slug => loadGalleryData(slug))
  );
  
  return galleries
    .filter((result): result is PromiseFulfilledResult<GalleryData> => 
      result.status === 'fulfilled' && result.value !== null
    )
    .map(result => result.value);
}

/**
 * Get full image path for gallery
 */
export function getImagePath(galleryId: string, imageSrc: string): string {
  return `./images/galleries/${galleryId}/${imageSrc}`;
}