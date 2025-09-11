import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  generateOptimizedImageSources, 
  getLightboxImageUrl, 
  getImagePath 
} from '../../app/src/lib/gallery';
import { getOptimizedImageUrl, preloadImage } from '../../app/src/components/ResponsiveImage';

describe('Image Loading Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('BASE_URL', '/test/');
    
    // Mock performance API
    global.performance = {
      ...global.performance,
      now: vi.fn(() => Date.now()),
      mark: vi.fn(),
      measure: vi.fn(),
      getEntriesByType: vi.fn(() => [])
    };
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  describe('Image URL Generation Performance', () => {
    it('should generate optimized sources quickly for multiple images', () => {
      const testImages = Array.from({ length: 100 }, (_, i) => ({
        galleryId: 'kuchyn-bila-ostruvek',
        imageName: `kuchyne_${i.toString().padStart(3, '0')}-web.jpg`
      }));

      const startTime = performance.now();
      
      const results = testImages.map(({ galleryId, imageName }) => 
        generateOptimizedImageSources(galleryId, imageName)
      );

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(results).toHaveLength(100);
      expect(duration).toBeLessThan(50); // Should complete in under 50ms

      // Verify all results have the expected structure
      results.forEach(result => {
        expect(result).toHaveProperty('avif');
        expect(result).toHaveProperty('webp');
        expect(result).toHaveProperty('jpeg');
        expect(result).toHaveProperty('fallback');
      });
    });

    it('should handle concurrent image URL generation efficiently', async () => {
      const promises = Array.from({ length: 20 }, (_, i) => 
        Promise.resolve(generateOptimizedImageSources(
          'kuchyn-bila-ostruvek', 
          `image_${i}-web.jpg`
        ))
      );

      const startTime = performance.now();
      const results = await Promise.all(promises);
      const endTime = performance.now();

      expect(results).toHaveLength(20);
      expect(endTime - startTime).toBeLessThan(25); // Should be very fast since no async operations

      results.forEach(result => {
        expect(result).toHaveProperty('avif');
        expect(result.avif).toMatch(/\d+w/); // Should contain width descriptors
      });
    });

    it('should optimize lightbox URL generation for large galleries', () => {
      const galleryImages = Array.from({ length: 50 }, (_, i) => 
        `gallery_image_${i + 1:03d}-web.jpg`
      );

      const startTime = performance.now();
      
      const lightboxUrls = galleryImages.map(imageName => 
        getLightboxImageUrl('kuchyn-bila-ostruvek', imageName)
      );

      const endTime = performance.now();

      expect(lightboxUrls).toHaveLength(50);
      expect(endTime - startTime).toBeLessThan(30); // Should be very fast

      lightboxUrls.forEach(url => {
        expect(url).toContain('-1600w.webp'); // Should use high-quality variant
        expect(url).toMatch(/^\/test\/images\/galleries\/kuchyn-bila-ostruvek\//);
      });
    });
  });

  describe('Memory Efficiency', () => {
    it('should not consume excessive memory when generating many image URLs', () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Generate URLs for a large number of images
      for (let i = 0; i < 1000; i++) {
        generateOptimizedImageSources('kuchyn-bila-ostruvek', `image_${i}-web.jpg`);
        getImagePath('kuchyn-bila-ostruvek', `image_${i}-web.jpg`);
        getLightboxImageUrl('kuchyn-bila-ostruvek', `image_${i}-web.jpg`);
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Should not increase memory significantly (< 1MB)
      expect(memoryIncrease).toBeLessThan(1024 * 1024);
    });

    it('should handle garbage collection well with repeated operations', () => {
      const iterations = 100;
      const memorySnapshots: number[] = [];

      for (let i = 0; i < iterations; i++) {
        // Generate and discard image sources
        const sources = generateOptimizedImageSources(
          `gallery-${i}`, 
          `image-${i}-web.jpg`
        );
        
        // Force some string operations to test GC
        const urls = [sources.avif, sources.webp, sources.jpeg].join('|');
        const processed = urls.split('|').map(url => url.toUpperCase());
        
        if (i % 20 === 0) {
          memorySnapshots.push(process.memoryUsage().heapUsed);
        }
      }

      // Memory usage should not grow unbounded
      const memoryGrowth = memorySnapshots[memorySnapshots.length - 1] - memorySnapshots[0];
      expect(memoryGrowth).toBeLessThan(5 * 1024 * 1024); // < 5MB growth
    });
  });

  describe('Caching and Optimization', () => {
    it('should demonstrate string reuse for common paths', () => {
      const commonGalleryId = 'kuchyn-bila-ostruvek';
      const baseUrl = '/test/images/galleries/';

      const startTime = performance.now();

      // Generate many URLs with the same base path
      const urls = Array.from({ length: 100 }, (_, i) => 
        getImagePath(commonGalleryId, `image_${i}-web.jpg`)
      );

      const endTime = performance.now();

      expect(urls).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(20);

      // All URLs should start with the same base
      urls.forEach(url => {
        expect(url).toStartWith(`${baseUrl}${commonGalleryId}/`);
      });
    });

    it('should handle URL parameter generation efficiently', () => {
      const testCases = Array.from({ length: 50 }, (_, i) => ({
        src: `/test/galleries/gallery-${i}/image.jpg`,
        width: 400 + (i * 20),
        height: 300 + (i * 15),
        format: ['webp', 'avif', 'jpg'][i % 3],
        quality: 70 + (i % 30)
      }));

      const startTime = performance.now();

      const optimizedUrls = testCases.map(testCase => 
        getOptimizedImageUrl(testCase.src, {
          width: testCase.width,
          height: testCase.height,
          format: testCase.format as any,
          quality: testCase.quality
        })
      );

      const endTime = performance.now();

      expect(optimizedUrls).toHaveLength(50);
      expect(endTime - startTime).toBeLessThan(30);

      // Verify URL parameters are correctly formatted
      optimizedUrls.forEach((url, index) => {
        if (testCases[index].src.includes('/galleries/')) {
          expect(url).toContain(`w=${testCases[index].width}`);
          expect(url).toContain(`quality=${testCases[index].quality}`);
          expect(url).toContain(`format=${testCases[index].format}`);
        }
      });
    });
  });

  describe('Real-world Performance Scenarios', () => {
    it('should handle gallery page loading simulation', () => {
      // Simulate loading a gallery page with multiple galleries
      const galleries = [
        'kuchyn-bila-ostruvek',
        'kuchyn-cerna', 
        'kuchyn-seda',
        'kuchyn-bila-u-tvar'
      ];

      const imagesPerGallery = 15;

      const startTime = performance.now();

      const allImageSources = galleries.flatMap(galleryId => 
        Array.from({ length: imagesPerGallery }, (_, i) => {
          const imageName = `image_${i + 1:03d}-web.jpg`;
          return {
            galleryId,
            imageName,
            sources: generateOptimizedImageSources(galleryId, imageName),
            lightboxUrl: getLightboxImageUrl(galleryId, imageName)
          };
        })
      );

      const endTime = performance.now();

      expect(allImageSources).toHaveLength(galleries.length * imagesPerGallery);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms

      // Verify structure of generated data
      allImageSources.forEach(item => {
        expect(item.sources).toHaveProperty('avif');
        expect(item.sources).toHaveProperty('webp');
        expect(item.sources).toHaveProperty('jpeg');
        expect(item.lightboxUrl).toContain('-1600w.webp');
      });
    });

    it('should simulate PhotoSwipe lightbox initialization performance', () => {
      const galleryImages = Array.from({ length: 30 }, (_, i) => ({
        src: `kuchyne_${i + 1:03d}-web.jpg`,
        width: 1920,
        height: 1280,
        alt: `Kitchen image ${i + 1}`,
        caption: `Beautiful kitchen design ${i + 1}`
      }));

      const galleryId = 'kuchyn-bila-ostruvek';

      const startTime = performance.now();

      // Simulate PhotoSwipe data preparation
      const lightboxItems = galleryImages.map(img => ({
        src: getLightboxImageUrl(galleryId, img.src),
        width: img.width,
        height: img.height,
        alt: img.alt,
        caption: img.caption
      }));

      const endTime = performance.now();

      expect(lightboxItems).toHaveLength(30);
      expect(endTime - startTime).toBeLessThan(25);

      // Verify all items have required PhotoSwipe properties
      lightboxItems.forEach(item => {
        expect(item).toHaveProperty('src');
        expect(item).toHaveProperty('width');
        expect(item).toHaveProperty('height');
        expect(item.src).toContain('-1600w.webp');
        expect(item.width).toBeGreaterThan(0);
        expect(item.height).toBeGreaterThan(0);
      });
    });

    it('should handle responsive image source generation for different viewport sizes', () => {
      const viewportSizes = [
        { width: 320, descriptor: '(max-width: 480px) 100vw' },
        { width: 768, descriptor: '(max-width: 768px) 50vw' },
        { width: 1024, descriptor: '(max-width: 1024px) 33vw' },
        { width: 1440, descriptor: '25vw' }
      ];

      const testImages = Array.from({ length: 20 }, (_, i) => 
        `responsive_image_${i + 1}-web.jpg`
      );

      const startTime = performance.now();

      const responsiveData = testImages.flatMap(imageName => 
        viewportSizes.map(viewport => ({
          imageName,
          viewport: viewport.width,
          sources: generateOptimizedImageSources('kuchyn-bila-ostruvek', imageName)
        }))
      );

      const endTime = performance.now();

      expect(responsiveData).toHaveLength(testImages.length * viewportSizes.length);
      expect(endTime - startTime).toBeLessThan(80);

      // Verify all combinations were processed
      const uniqueImages = new Set(responsiveData.map(item => item.imageName));
      const uniqueViewports = new Set(responsiveData.map(item => item.viewport));

      expect(uniqueImages.size).toBe(testImages.length);
      expect(uniqueViewports.size).toBe(viewportSizes.length);
    });
  });

  describe('Resource Loading Optimization', () => {
    it('should optimize preload link generation', () => {
      // Clear any existing preload links
      document.head.innerHTML = '';

      const criticalImages = [
        '/images/galleries/kuchyn-bila-ostruvek/hero-image.jpg',
        '/images/galleries/kuchyn-cerna/main-view.jpg',
        '/images/galleries/kuchyn-seda/overview.jpg'
      ];

      const startTime = performance.now();

      criticalImages.forEach(src => preloadImage(src, true));

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(10);

      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      expect(preloadLinks).toHaveLength(criticalImages.length);

      preloadLinks.forEach((link, index) => {
        expect(link.getAttribute('as')).toBe('image');
        expect(link.getAttribute('href')).toContain('format=webp');
        expect(link.getAttribute('href')).toContain('w=800');
      });
    });

    it('should handle batch image URL generation efficiently', () => {
      const batchSize = 100;
      const batches = 5;

      const startTime = performance.now();

      for (let batch = 0; batch < batches; batch++) {
        const batchResults = [];
        
        for (let i = 0; i < batchSize; i++) {
          const imageIndex = batch * batchSize + i;
          const result = generateOptimizedImageSources(
            'kuchyn-bila-ostruvek',
            `batch_image_${imageIndex:04d}-web.jpg`
          );
          batchResults.push(result);
        }

        expect(batchResults).toHaveLength(batchSize);
      }

      const endTime = performance.now();
      const totalImages = batchSize * batches;

      expect(endTime - startTime).toBeLessThan(200); // 500 images in under 200ms
      
      // Performance should be roughly linear
      const timePerImage = (endTime - startTime) / totalImages;
      expect(timePerImage).toBeLessThan(0.5); // Less than 0.5ms per image
    });
  });
});