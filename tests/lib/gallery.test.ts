import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  loadGalleryData,
  loadAllGalleries,
  getImagePath,
  generateOptimizedImageSources,
  getLightboxImageUrl,
  validateGalleryConfiguration,
  getGalleriesByCategory,
  mapGalleryForDisplay,
  type GalleryData,
  GALLERY_SLUGS
} from '../../app/src/lib/gallery';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Gallery Library', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('BASE_URL', '/test/');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('loadGalleryData', () => {
    it('should load gallery data successfully', async () => {
      const mockGalleryData: GalleryData = {
        id: 'kuchyn-bila-ostruvek',
        title: 'Bílá kuchyň s ostrůvkem',
        category: 'Kuchyně',
        description: 'Moderní bílá kuchyň s centrálním ostrůvkem',
        coverImage: 'cover.jpg',
        images: [
          {
            src: 'image1.jpg',
            alt: 'Test image',
            width: 1200,
            height: 800,
            caption: 'Test caption'
          }
        ],
        features: ['Moderní design', 'Vysoká kvalita'],
        materials: ['Lakované MDF', 'Granit'],
        location: 'Praha',
        date: '2024-01',
        imageCount: 5,
        coverImages: ['cover.jpg', 'image1.jpg']
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGalleryData)
      });

      const result = await loadGalleryData('kuchyn-bila-ostruvek');

      expect(result).toEqual(mockGalleryData);
      expect(mockFetch).toHaveBeenCalledWith('/test/images/galleries/kuchyn-bila-ostruvek/gallery.json');
    });

    it('should return null for failed fetch', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      const result = await loadGalleryData('non-existent-gallery');

      expect(result).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith('/test/images/galleries/non-existent-gallery/gallery.json');
    });

    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await loadGalleryData('kuchyn-bila-ostruvek');

      expect(result).toBeNull();
    });

    it('should return SSR mock data for kitchen-white-attic on server', async () => {
      // Simulate server environment
      const originalWindow = global.window;
      delete (global as any).window;

      const result = await loadGalleryData('kitchen-white-attic');

      expect(result).toBeDefined();
      expect(result?.id).toBe('kitchen-white-attic');
      expect(result?.title).toBe('Bílá kuchyň v podkroví');
      expect(result?.category).toBe('Kuchyně');

      // Restore window
      global.window = originalWindow;
    });
  });

  describe('loadAllGalleries', () => {
    it('should load all available galleries', async () => {
      const mockGallery: GalleryData = {
        id: 'kuchyn-bila-ostruvek',
        title: 'Test Gallery',
        category: 'Kuchyně',
        description: 'Test description',
        coverImage: 'cover.jpg',
        images: [],
        features: [],
        materials: [],
        location: 'Praha',
        date: '2024-01',
        imageCount: 1,
        coverImages: ['cover.jpg']
      };

      // Mock successful responses for some galleries
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockGallery) })
        .mockResolvedValueOnce({ ok: false, status: 404 })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ...mockGallery, id: 'kuchyn-cerna' }) });

      const result = await loadAllGalleries();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('kuchyn-bila-ostruvek');
      expect(result[1].id).toBe('kuchyn-cerna');
    });

    it('should handle all galleries failing to load', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 404 });

      const result = await loadAllGalleries();

      expect(result).toEqual([]);
    });
  });

  describe('getImagePath', () => {
    it('should construct correct image path', () => {
      vi.stubEnv('BASE_URL', '/app/');
      
      const path = getImagePath('kuchyn-bila-ostruvek', 'image1.jpg');
      
      expect(path).toBe('/app/images/galleries/kuchyn-bila-ostruvek/image1.jpg');
    });
  });

  describe('generateOptimizedImageSources', () => {
    it('should generate optimized sources for full-range galleries', () => {
      vi.stubEnv('BASE_URL', '/app/');
      
      const sources = generateOptimizedImageSources('kuchyn-bila-ostruvek', 'kuchyne_0031-web.jpg');

      expect(sources).toHaveProperty('avif');
      expect(sources).toHaveProperty('webp');
      expect(sources).toHaveProperty('jpeg');
      expect(sources.avif).toContain('400w');
      expect(sources.avif).toContain('1600w');
      expect(sources.webp).toContain('kuchyne_0031-web-800w.webp');
    });

    it('should return fallback for non-optimized galleries', () => {
      vi.stubEnv('BASE_URL', '/app/');
      
      const sources = generateOptimizedImageSources('unknown-gallery', 'image.jpg');

      expect(sources).toHaveProperty('fallback');
      expect(sources.fallback).toBe('/app/images/galleries/unknown-gallery/image.jpg');
      expect(sources).not.toHaveProperty('avif');
    });
  });

  describe('getLightboxImageUrl', () => {
    it('should return high-quality image for optimized galleries', () => {
      vi.stubEnv('BASE_URL', '/app/');
      
      const url = getLightboxImageUrl('kuchyn-bila-ostruvek', 'kuchyne_0031-web.jpg');

      expect(url).toBe('/app/images/galleries/kuchyn-bila-ostruvek/kuchyne_0031-web-1600w.webp');
    });

    it('should return original image for non-optimized galleries', () => {
      vi.stubEnv('BASE_URL', '/app/');
      
      const url = getLightboxImageUrl('unknown-gallery', 'image.jpg');

      expect(url).toBe('/app/images/galleries/unknown-gallery/image.jpg');
    });
  });

  describe('validateGalleryConfiguration', () => {
    it('should return empty array for valid configuration', () => {
      const errors = validateGalleryConfiguration();

      expect(errors).toEqual([]);
    });

    it('should detect outdated patterns', () => {
      // Mock GALLERY_SLUGS with outdated patterns
      const originalSlugs = GALLERY_SLUGS;
      (GALLERY_SLUGS as any).push('skrine-test', 'wardrobe-test');
      
      const errors = validateGalleryConfiguration();

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(error => error.includes('skrine-test'))).toBe(true);
      expect(errors.some(error => error.includes('wardrobe-test'))).toBe(true);
    });
  });

  describe('getGalleriesByCategory', () => {
    it('should group galleries by category correctly', () => {
      const galleries: GalleryData[] = [
        {
          id: 'kitchen-1',
          title: 'Kitchen',
          category: 'Kuchyně',
          description: '',
          coverImage: '',
          images: [],
          features: [],
          materials: [],
          location: '',
          date: '',
          imageCount: 0,
          coverImages: []
        },
        {
          id: 'bathroom-1',
          title: 'Bathroom',
          category: 'Koupelny',
          description: '',
          coverImage: '',
          images: [],
          features: [],
          materials: [],
          location: '',
          date: '',
          imageCount: 0,
          coverImages: []
        },
        {
          id: 'wardrobe-1',
          title: 'Wardrobe',
          category: 'Skříně',
          description: '',
          coverImage: '',
          images: [],
          features: [],
          materials: [],
          location: '',
          date: '',
          imageCount: 0,
          coverImages: []
        },
        {
          id: 'other-1',
          title: 'Other',
          category: 'Custom',
          description: '',
          coverImage: '',
          images: [],
          features: [],
          materials: [],
          location: '',
          date: '',
          imageCount: 0,
          coverImages: []
        }
      ];

      const grouped = getGalleriesByCategory(galleries);

      expect(grouped.kuchyne).toHaveLength(1);
      expect(grouped.koupelny).toHaveLength(1);
      expect(grouped.skrine).toHaveLength(1);
      expect(grouped.ostatni).toHaveLength(1);
      expect(grouped.kuchyne[0].id).toBe('kitchen-1');
    });
  });

  describe('mapGalleryForDisplay', () => {
    it('should map gallery data for display correctly', () => {
      vi.stubEnv('BASE_URL', '/app/');
      
      const gallery: GalleryData = {
        id: 'test-gallery',
        title: 'Test Gallery',
        category: 'Kuchyně',
        description: 'Test description',
        coverImage: 'cover.jpg',
        images: [],
        features: [],
        materials: [],
        location: 'Praha',
        date: '2024-01',
        imageCount: 5,
        coverImages: ['cover1.jpg', 'cover2.jpg']
      };

      const mapped = mapGalleryForDisplay(gallery);

      expect(mapped.id).toBe('test-gallery');
      expect(mapped.title).toBe('Test Gallery');
      expect(mapped.description).toBe('Test description');
      expect(mapped.location).toBe('Praha');
      expect(mapped.date).toBe('2024-01');
      expect(mapped.imageCount).toBe(5);
      expect(mapped.coverImages).toHaveLength(2);
      expect(mapped.coverImages[0]).toBe('/app/images/galleries/test-gallery/cover1.jpg');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty image sources gracefully', () => {
      const sources = generateOptimizedImageSources('gallery', '');
      expect(sources).toHaveProperty('fallback');
    });

    it('should handle malformed image paths', () => {
      const url = getLightboxImageUrl('gallery', '../../../malicious.jpg');
      expect(url).toContain('gallery');
    });

    it('should validate gallery slugs are within expected patterns', () => {
      GALLERY_SLUGS.forEach(slug => {
        expect(typeof slug).toBe('string');
        expect(slug.length).toBeGreaterThan(0);
        expect(slug).toMatch(/^[a-z0-9-]+$/);
      });
    });
  });
});