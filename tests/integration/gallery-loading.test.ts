import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadAllGalleries, loadGalleryData, type GalleryData } from '../../app/src/lib/gallery';

describe('Gallery Loading Integration Tests', () => {
  const mockGalleryData: GalleryData = {
    id: 'kuchyn-bila-ostruvek',
    title: 'Bílá kuchyň s ostrůvkem',
    category: 'Kuchyně',
    description: 'Moderní bílá kuchyň s centrálním ostrůvkem pro společné vaření',
    coverImage: 'kuchyne_main-web.jpg',
    images: [
      {
        src: 'kuchyne_001-web.jpg',
        alt: 'Celkový pohled na bílou kuchyň',
        width: 1920,
        height: 1280,
        caption: 'Moderní bílá kuchyň s ostrůvkem'
      },
      {
        src: 'kuchyne_002-web.jpg',
        alt: 'Detail kuchyňského ostrůvku',
        width: 1920,
        height: 1280,
        caption: 'Funkční ostrůvek s barem'
      }
    ],
    features: ['Moderní design', 'Vysoká kvalita', 'Ergonomické řešení'],
    materials: ['Lakované MDF', 'Křemenný kompozit', 'Nerezová ocel'],
    location: 'Praha 6',
    date: '2024-01',
    imageCount: 12,
    coverImages: ['kuchyne_main-web.jpg', 'kuchyne_001-web.jpg', 'kuchyne_002-web.jpg']
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Gallery Data Loading Flow', () => {
    it('should load gallery with all required fields', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGalleryData)
      });

      const gallery = await loadGalleryData('kuchyn-bila-ostruvek');

      expect(gallery).toBeDefined();
      expect(gallery?.id).toBe('kuchyn-bila-ostruvek');
      expect(gallery?.title).toBe('Bílá kuchyň s ostrůvkem');
      expect(gallery?.category).toBe('Kuchyně');
      expect(gallery?.images).toHaveLength(2);
      expect(gallery?.features).toContain('Moderní design');
      expect(gallery?.materials).toContain('Lakované MDF');
      expect(gallery?.imageCount).toBe(12);
    });

    it('should handle partial gallery loading failures gracefully', async () => {
      // Mock mixed success/failure responses
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockGalleryData)
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            ...mockGalleryData,
            id: 'kuchyn-cerna',
            title: 'Černá kuchyň'
          })
        });

      const galleries = await loadAllGalleries();

      expect(galleries).toHaveLength(2);
      expect(galleries[0].id).toBe('kuchyn-bila-ostruvek');
      expect(galleries[1].id).toBe('kuchyn-cerna');
    });

    it('should validate image data structure', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGalleryData)
      });

      const gallery = await loadGalleryData('kuchyn-bila-ostruvek');

      gallery?.images.forEach(image => {
        expect(image).toHaveProperty('src');
        expect(image).toHaveProperty('alt');
        expect(image).toHaveProperty('width');
        expect(image).toHaveProperty('height');
        expect(image).toHaveProperty('caption');
        expect(typeof image.src).toBe('string');
        expect(typeof image.alt).toBe('string');
        expect(typeof image.width).toBe('number');
        expect(typeof image.height).toBe('number');
        expect(image.width).toBeGreaterThan(0);
        expect(image.height).toBeGreaterThan(0);
      });
    });
  });

  describe('Error Recovery and Resilience', () => {
    it('should recover from temporary network failures', async () => {
      let callCount = 0;
      (global.fetch as any).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.reject(new Error('Network timeout'));
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockGalleryData)
        });
      });

      // First call fails, but we can still get data on retry
      const firstAttempt = await loadGalleryData('kuchyn-bila-ostruvek');
      expect(firstAttempt).toBeNull();

      const secondAttempt = await loadGalleryData('kuchyn-bila-ostruvek');
      expect(secondAttempt).toBeDefined();
      expect(secondAttempt?.id).toBe('kuchyn-bila-ostruvek');
    });

    it('should handle malformed JSON gracefully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON'))
      });

      const gallery = await loadGalleryData('kuchyn-bila-ostruvek');

      expect(gallery).toBeNull();
    });

    it('should handle missing required fields', async () => {
      const incompleteData = {
        id: 'incomplete-gallery',
        // Missing required fields like title, category, etc.
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(incompleteData)
      });

      const gallery = await loadGalleryData('incomplete-gallery');

      // Should still return the data even if incomplete
      expect(gallery).toBeDefined();
      expect(gallery?.id).toBe('incomplete-gallery');
    });
  });

  describe('Performance and Caching', () => {
    it('should handle concurrent gallery loading requests', async () => {
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockGalleryData)
      });
      global.fetch = fetchSpy;

      // Load the same gallery multiple times concurrently
      const promises = Array.from({ length: 5 }, () => 
        loadGalleryData('kuchyn-bila-ostruvek')
      );

      const results = await Promise.all(promises);

      // All should succeed
      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result?.id).toBe('kuchyn-bila-ostruvek');
      });

      // Should have made 5 fetch calls (no caching in this implementation)
      expect(fetchSpy).toHaveBeenCalledTimes(5);
    });

    it('should handle large gallery datasets efficiently', async () => {
      const largeGallery = {
        ...mockGalleryData,
        images: Array.from({ length: 100 }, (_, i) => ({
          src: `image_${i + 1:03d}-web.jpg`,
          alt: `Gallery image ${i + 1}`,
          width: 1920,
          height: 1280,
          caption: `Image ${i + 1} caption`
        })),
        imageCount: 100
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(largeGallery)
      });

      const startTime = performance.now();
      const gallery = await loadGalleryData('large-gallery');
      const endTime = performance.now();

      expect(gallery).toBeDefined();
      expect(gallery?.images).toHaveLength(100);
      
      // Should process large dataset reasonably quickly (< 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  describe('Data Integrity and Validation', () => {
    it('should maintain data consistency across multiple loads', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockGalleryData)
      });

      const firstLoad = await loadGalleryData('kuchyn-bila-ostruvek');
      const secondLoad = await loadGalleryData('kuchyn-bila-ostruvek');

      expect(firstLoad).toEqual(secondLoad);
      expect(JSON.stringify(firstLoad)).toBe(JSON.stringify(secondLoad));
    });

    it('should handle unicode and special characters correctly', async () => {
      const unicodeData = {
        ...mockGalleryData,
        title: 'Kuchyň s českými znaky: řžýáíéúů',
        description: 'Popis s emoji 🏠 a speciálními znaky: ČĘŻŹĆŃółąęś',
        features: ['Řešení pro úložné prostory', 'Výška přizpůsobená uživateli']
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(unicodeData)
      });

      const gallery = await loadGalleryData('unicode-gallery');

      expect(gallery?.title).toBe('Kuchyň s českými znaky: řžýáíéúů');
      expect(gallery?.description).toContain('🏠');
      expect(gallery?.features?.[0]).toBe('Řešení pro úložné prostory');
    });

    it('should validate image dimensions are reasonable', async () => {
      const invalidImageData = {
        ...mockGalleryData,
        images: [
          {
            src: 'valid-image.jpg',
            alt: 'Valid image',
            width: 1920,
            height: 1280,
            caption: 'Normal image'
          },
          {
            src: 'suspicious-image.jpg',
            alt: 'Suspicious image',
            width: 0, // Invalid dimension
            height: -100, // Invalid dimension
            caption: 'Invalid image'
          }
        ]
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidImageData)
      });

      const gallery = await loadGalleryData('invalid-images');

      // Should still load but we can validate dimensions
      expect(gallery?.images).toHaveLength(2);
      
      const validImage = gallery?.images[0];
      expect(validImage?.width).toBeGreaterThan(0);
      expect(validImage?.height).toBeGreaterThan(0);
      
      const invalidImage = gallery?.images[1];
      expect(invalidImage?.width).toBe(0);
      expect(invalidImage?.height).toBe(-100);
    });
  });

  describe('Memory Management', () => {
    it('should not leak memory with repeated gallery loads', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockGalleryData)
      });

      const initialMemory = process.memoryUsage().heapUsed;

      // Load galleries repeatedly
      for (let i = 0; i < 50; i++) {
        await loadGalleryData('kuchyn-bila-ostruvek');
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (< 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });

  describe('Server-Side Rendering Compatibility', () => {
    it('should work in server environment without window', async () => {
      const originalWindow = global.window;
      delete (global as any).window;

      // Should return mock data for kitchen-white-attic
      const gallery = await loadGalleryData('kitchen-white-attic');
      
      expect(gallery).toBeDefined();
      expect(gallery?.id).toBe('kitchen-white-attic');
      expect(gallery?.title).toBe('Bílá kuchyň v podkroví');

      // Should return null for other galleries in SSR
      const otherGallery = await loadGalleryData('kuchyn-bila-ostruvek');
      expect(otherGallery).toBeNull();

      global.window = originalWindow;
    });
  });
});