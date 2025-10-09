/**
 * Open Graph Image Utilities for Social Sharing
 *
 * Generates optimized OG image URLs from gallery cover images
 * with proper aspect ratio handling and fallback support.
 */

import { getCoverImagePath } from './gallery';

/**
 * Generate OG image URL from gallery cover image
 *
 * Strategy:
 * - Use 1600w AVIF (best quality, available for all galleries)
 * - Social platforms auto-crop to 1200x630
 * - Fallback to JPEG if AVIF not supported
 *
 * @param galleryId - Gallery slug/ID
 * @param coverImage - Cover image filename from gallery.json
 * @returns Absolute URL for OG image
 */
export function getOgImageUrl(galleryId: string, coverImage: string): string {
  // Validate inputs
  if (!galleryId || !coverImage) {
    console.warn('Invalid galleryId or coverImage for OG image', { galleryId, coverImage });
    return 'https://kps-interiery.cz/branding/kps-logo-social.jpg';
  }

  // Get the optimized cover image path (returns 1600w AVIF)
  const imagePath = getCoverImagePath(galleryId, coverImage);

  // Convert to absolute URL for social sharing
  const absoluteUrl = `https://kps-interiery.cz${imagePath}`;

  return absoluteUrl;
}

/**
 * Generate fallback JPEG URL for OG image
 *
 * Used when AVIF is not supported by the social platform
 *
 * @param galleryId - Gallery slug/ID
 * @param coverImage - Cover image filename from gallery.json
 * @returns Absolute URL for JPEG fallback
 */
export function getOgImageFallbackUrl(galleryId: string, coverImage: string): string {
  // Validate inputs
  if (!galleryId || !coverImage) {
    return 'https://kps-interiery.cz/branding/kps-logo-social.jpg';
  }

  // Extract base filename without extension
  const fileName = coverImage.split('/').pop() || coverImage;
  const baseName = fileName.replace(/\.[^/.]+$/, '').replace('-web', '');

  // Construct JPEG fallback path
  // Use original JPEG as fallback (always available)
  const jpegPath = `/images/galleries/${galleryId}/${baseName}-web.jpg`;

  return `https://kps-interiery.cz${jpegPath}`;
}

/**
 * Get OG image dimensions based on source image
 *
 * Returns dimensions that work best for social sharing
 * Note: Social platforms will crop to their preferred size (1200x630)
 *
 * @param imageWidth - Original image width
 * @param imageHeight - Original image height
 * @returns Object with width and height for OG tags
 */
export function getOgImageDimensions(imageWidth?: number, imageHeight?: number): { width: string; height: string } {
  // For 1600w images, calculate proportional height
  // Landscape images: 2560×1707 → 1600×1067
  // Portrait images: 1707×2560 → 1600×2400

  if (!imageWidth || !imageHeight) {
    // Default to landscape proportions
    return {
      width: '1600',
      height: '1067'
    };
  }

  const aspectRatio = imageWidth / imageHeight;
  const ogWidth = 1600;
  const ogHeight = Math.round(ogWidth / aspectRatio);

  return {
    width: ogWidth.toString(),
    height: ogHeight.toString()
  };
}

/**
 * Generate complete OG image meta tags data
 *
 * Returns all necessary meta tag properties for social sharing
 *
 * @param galleryId - Gallery slug/ID
 * @param coverImage - Cover image filename
 * @param title - Gallery title for alt text
 * @param imageWidth - Original image width (optional)
 * @param imageHeight - Original image height (optional)
 * @returns Array of meta tag objects
 */
export function generateOgImageMetaTags(
  galleryId: string,
  coverImage: string,
  title: string,
  imageWidth?: number,
  imageHeight?: number
) {
  const ogImageUrl = getOgImageUrl(galleryId, coverImage);
  const fallbackUrl = getOgImageFallbackUrl(galleryId, coverImage);
  const dimensions = getOgImageDimensions(imageWidth, imageHeight);

  return [
    {
      property: 'og:image',
      content: ogImageUrl
    },
    {
      property: 'og:image:secure_url',
      content: ogImageUrl
    },
    {
      property: 'og:image:type',
      content: 'image/avif'
    },
    {
      property: 'og:image:width',
      content: dimensions.width
    },
    {
      property: 'og:image:height',
      content: dimensions.height
    },
    {
      property: 'og:image:alt',
      content: title
    },
    // Add JPEG fallback as secondary image
    {
      property: 'og:image',
      content: fallbackUrl
    },
    {
      property: 'og:image:type',
      content: 'image/jpeg'
    }
  ];
}

/**
 * Get default logo OG image for non-gallery pages
 *
 * Used for home page, gallery index, and other pages
 *
 * @returns Object with OG image meta tag data
 */
export function getDefaultOgImage() {
  return {
    url: 'https://kps-interiery.cz/branding/kps-logo-social.jpg',
    type: 'image/jpeg',
    width: '1200',
    height: '630',
    alt: 'KPS Interiéry - Kvalitní nábytek na míru'
  };
}

/**
 * Validate OG image URL exists
 *
 * Useful for build-time validation
 *
 * @param url - Full URL to validate
 * @returns Promise<boolean> indicating if image exists
 */
export async function validateOgImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`Failed to validate OG image: ${url}`, error);
    return false;
  }
}
