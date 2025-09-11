import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createDOM } from '@builder.io/qwik/testing';
import { ResponsiveImage, getOptimizedImageUrl, preloadImage } from '../../app/src/components/ResponsiveImage';

// Mock the gallery module
vi.mock('../../app/src/lib/gallery', () => ({
  generateOptimizedImageSources: vi.fn((galleryId: string, imageName: string) => {
    if (galleryId === 'kuchyn-bila-ostruvek') {
      return {
        avif: 'test-image-400w.avif 400w, test-image-800w.avif 800w',
        webp: 'test-image-400w.webp 400w, test-image-800w.webp 800w',
        jpeg: 'test-image-400w.jpeg 400w, test-image-800w.jpeg 800w',
        fallback: 'test-image.jpg'
      };
    }
    return { fallback: `/images/galleries/${galleryId}/${imageName}` };
  })
}));

describe('ResponsiveImage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render picture element with multiple sources for optimized galleries', async () => {
      const { render } = await createDOM();
      
      await render(
        <ResponsiveImage 
          src="/images/galleries/kuchyn-bila-ostruvek/test-image.jpg"
          alt="Test kitchen image"
          width={800}
          height={600}
          priority={false}
        />
      );

      const picture = document.querySelector('picture');
      expect(picture).toBeTruthy();

      const sources = document.querySelectorAll('source');
      expect(sources).toHaveLength(3);

      // Check AVIF source
      const avifSource = sources[0];
      expect(avifSource.getAttribute('type')).toBe('image/avif');
      expect(avifSource.getAttribute('srcset')).toContain('test-image-400w.avif');

      // Check WebP source
      const webpSource = sources[1];
      expect(webpSource.getAttribute('type')).toBe('image/webp');
      expect(webpSource.getAttribute('srcset')).toContain('test-image-400w.webp');

      // Check JPEG source
      const jpegSource = sources[2];
      expect(jpegSource.getAttribute('type')).toBe('image/jpeg');
      expect(jpegSource.getAttribute('srcset')).toContain('test-image-400w.jpeg');

      // Check img fallback
      const img = document.querySelector('img');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('src')).toBe('test-image.jpg');
      expect(img?.getAttribute('alt')).toBe('Test kitchen image');
      expect(img?.getAttribute('width')).toBe('800');
      expect(img?.getAttribute('height')).toBe('600');
    });

    it('should render simple img element for non-optimized galleries', async () => {
      const { render } = await createDOM();
      
      await render(
        <ResponsiveImage 
          src="/images/galleries/unknown-gallery/image.jpg"
          alt="Test image"
          class="test-class"
        />
      );

      const img = document.querySelector('img');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('src')).toBe('/images/galleries/unknown-gallery/image.jpg');
      expect(img?.getAttribute('alt')).toBe('Test image');
      expect(img?.getAttribute('class')).toBe('test-class');

      const picture = document.querySelector('picture');
      expect(picture).toBeFalsy();
    });

    it('should handle priority images correctly', async () => {
      const { render } = await createDOM();
      
      await render(
        <ResponsiveImage 
          src="/images/galleries/kuchyn-bila-ostruvek/hero.jpg"
          alt="Hero image"
          priority={true}
        />
      );

      const img = document.querySelector('img');
      expect(img?.getAttribute('loading')).toBe('eager');
      expect(img?.getAttribute('decoding')).toBe('sync');
      expect(img?.getAttribute('fetchpriority')).toBe('high');
    });

    it('should handle lazy loading for non-priority images', async () => {
      const { render } = await createDOM();
      
      await render(
        <ResponsiveImage 
          src="/images/galleries/kuchyn-bila-ostruvek/gallery.jpg"
          alt="Gallery image"
          priority={false}
        />
      );

      const img = document.querySelector('img');
      expect(img?.getAttribute('loading')).toBe('lazy');
      expect(img?.getAttribute('decoding')).toBe('async');
      expect(img?.getAttribute('fetchpriority')).toBe('auto');
    });

    it('should apply custom sizes attribute', async () => {
      const { render } = await createDOM();
      const customSizes = "(max-width: 600px) 100vw, 50vw";
      
      await render(
        <ResponsiveImage 
          src="/images/galleries/kuchyn-bila-ostruvek/image.jpg"
          alt="Test image"
          sizes={customSizes}
        />
      );

      const sources = document.querySelectorAll('source');
      sources.forEach(source => {
        expect(source.getAttribute('sizes')).toBe(customSizes);
      });
    });
  });

  describe('getOptimizedImageUrl utility', () => {
    it('should return optimized URL for gallery images', () => {
      const src = '/images/galleries/kuchyn-bila-ostruvek/image.jpg';
      const optimized = getOptimizedImageUrl(src, {
        width: 800,
        format: 'webp',
        quality: 85
      });

      expect(optimized).toContain('format=webp');
      expect(optimized).toContain('w=800');
      expect(optimized).toContain('quality=85');
    });

    it('should return original URL for non-gallery images', () => {
      const src = '/static/logo.png';
      const optimized = getOptimizedImageUrl(src);

      expect(optimized).toBe(src);
    });

    it('should handle height parameter', () => {
      const src = '/images/galleries/test/image.jpg';
      const optimized = getOptimizedImageUrl(src, {
        width: 800,
        height: 600,
        format: 'avif'
      });

      expect(optimized).toContain('h=600');
      expect(optimized).toContain('format=avif');
    });

    it('should use default values', () => {
      const src = '/images/galleries/test/image.jpg';
      const optimized = getOptimizedImageUrl(src);

      expect(optimized).toContain('format=webp');
      expect(optimized).toContain('w=800');
      expect(optimized).toContain('quality=85');
    });
  });

  describe('preloadImage utility', () => {
    beforeEach(() => {
      // Clear any existing link elements
      document.head.innerHTML = '';
    });

    it('should preload priority images', () => {
      const src = '/images/galleries/test/hero.jpg';
      preloadImage(src, true);

      const preloadLink = document.querySelector('link[rel="preload"]');
      expect(preloadLink).toBeTruthy();
      expect(preloadLink?.getAttribute('as')).toBe('image');
      expect(preloadLink?.getAttribute('href')).toContain(src);
    });

    it('should not preload non-priority images', () => {
      const src = '/images/galleries/test/image.jpg';
      preloadImage(src, false);

      const preloadLink = document.querySelector('link[rel="preload"]');
      expect(preloadLink).toBeFalsy();
    });

    it('should handle server-side rendering gracefully', () => {
      // Mock document as undefined (SSR environment)
      const originalDocument = global.document;
      delete (global as any).document;

      expect(() => {
        preloadImage('/test/image.jpg', true);
      }).not.toThrow();

      // Restore document
      global.document = originalDocument;
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle malformed src paths gracefully', async () => {
      const { render } = await createDOM();
      
      await render(
        <ResponsiveImage 
          src="invalid-path"
          alt="Invalid image"
        />
      );

      const img = document.querySelector('img');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('src')).toBe('invalid-path');
    });

    it('should handle empty alt text', async () => {
      const { render } = await createDOM();
      
      await render(
        <ResponsiveImage 
          src="/test/image.jpg"
          alt=""
        />
      );

      const img = document.querySelector('img');
      expect(img?.getAttribute('alt')).toBe('');
    });

    it('should handle missing width/height', async () => {
      const { render } = await createDOM();
      
      await render(
        <ResponsiveImage 
          src="/test/image.jpg"
          alt="Test"
        />
      );

      const img = document.querySelector('img');
      expect(img?.getAttribute('width')).toBe('800'); // default
      expect(img?.getAttribute('height')).toBe('600'); // default
    });

    it('should handle zero dimensions', async () => {
      const { render } = await createDOM();
      
      await render(
        <ResponsiveImage 
          src="/test/image.jpg"
          alt="Test"
          width={0}
          height={0}
        />
      );

      const img = document.querySelector('img');
      expect(img?.getAttribute('width')).toBe('0');
      expect(img?.getAttribute('height')).toBe('0');
    });
  });

  describe('Accessibility', () => {
    it('should provide proper alt text for screen readers', async () => {
      const { render } = await createDOM();
      
      await render(
        <ResponsiveImage 
          src="/test/image.jpg"
          alt="Modern white kitchen with island and pendant lighting"
        />
      );

      const img = document.querySelector('img');
      expect(img?.getAttribute('alt')).toBe('Modern white kitchen with island and pendant lighting');
    });

    it('should handle decorative images with empty alt', async () => {
      const { render } = await createDOM();
      
      await render(
        <ResponsiveImage 
          src="/test/decorative.jpg"
          alt=""
        />
      );

      const img = document.querySelector('img');
      expect(img?.getAttribute('alt')).toBe('');
    });
  });

  describe('Performance', () => {
    it('should set appropriate loading strategy for above-fold images', async () => {
      const { render } = await createDOM();
      
      await render(
        <ResponsiveImage 
          src="/test/hero.jpg"
          alt="Hero"
          priority={true}
          loading="eager"
        />
      );

      const img = document.querySelector('img');
      expect(img?.getAttribute('loading')).toBe('eager');
      expect(img?.getAttribute('fetchpriority')).toBe('high');
    });

    it('should set appropriate loading strategy for below-fold images', async () => {
      const { render } = await createDOM();
      
      await render(
        <ResponsiveImage 
          src="/test/gallery.jpg"
          alt="Gallery"
          loading="lazy"
        />
      );

      const img = document.querySelector('img');
      expect(img?.getAttribute('loading')).toBe('lazy');
      expect(img?.getAttribute('fetchpriority')).toBe('auto');
    });
  });
});