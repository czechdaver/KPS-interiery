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
  'kitchen-modern-island',
  'kitchen-white-attic',
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
      materials: ['Material 1', 'Material 2'],
      location: 'Praha',
      date: '2024-01',
      imageCount: 5,
      coverImages: ['cover.jpg']
    };
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
    'kitchen-modern-island': 'Moderní kuchyň s ostrůvkem',
    'kitchen-white-attic': 'Bílá kuchyň v podkroví',
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
    ostatni: galleries.filter(g => !['Kuchyně', 'Koupelny'].includes(g.category))
  };
}