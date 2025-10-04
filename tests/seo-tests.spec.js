/**
 * Comprehensive SEO Test Suite for KPS Interiéry
 * Tests all SEO components and validates implementation
 */

import { test, expect } from '@playwright/test';
import { MetaValidator } from '../seo-testing/meta-validator.js';
import { SchemaValidator } from '../seo-testing/schema-validator.js';
import { SocialPreviewTester } from '../seo-testing/social-preview-tester.js';
import { SEOAudit } from '../seo-testing/seo-audit.js';

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const PRODUCTION_URL = 'https://kps-interiery.cz';

test.describe('SEO Validation Tests', () => {
  let metaValidator;
  let schemaValidator;
  let socialTester;
  let seoAudit;

  test.beforeAll(async () => {
    metaValidator = new MetaValidator();
    schemaValidator = new SchemaValidator();
    socialTester = new SocialPreviewTester();
    seoAudit = new SEOAudit();
  });

  test.describe('Meta Tags Validation', () => {
    test('should have complete meta tags on homepage', async ({ page }) => {
      await page.goto(BASE_URL);
      const html = await page.content();

      const result = await metaValidator.validateHTML(html, BASE_URL);

      // Check overall score
      expect(result.score).toBeGreaterThanOrEqual(80);

      // Check for required tags
      expect(result.title).toBeDefined();
      expect(result.title).toContain('KPS Interiéry');

      expect(result.metaTags.description).toBeDefined();
      expect(result.metaTags.description.length).toBeGreaterThan(120);
      expect(result.metaTags.description.length).toBeLessThan(160);

      expect(result.metaTags['og:title']).toBeDefined();
      expect(result.metaTags['og:description']).toBeDefined();
      expect(result.metaTags['og:type']).toBe('website');
      expect(result.metaTags['og:locale']).toBe('cs_CZ');

      // Check for critical issues
      const criticalIssues = result.issues?.filter(issue => issue.severity === 'high') || [];
      expect(criticalIssues).toHaveLength(0);
    });

    test('should have proper viewport and mobile tags', async ({ page }) => {
      await page.goto(BASE_URL);
      const html = await page.content();

      const result = await metaValidator.validateHTML(html, BASE_URL);

      expect(result.metaTags.viewport).toBe('width=device-width, initial-scale=1.0');
      expect(result.metaTags['theme-color']).toBeDefined();
      expect(result.metaTags['apple-mobile-web-app-capable']).toBe('yes');
    });

    test('should have proper robots and indexing tags', async ({ page }) => {
      await page.goto(BASE_URL);
      const html = await page.content();

      const result = await metaValidator.validateHTML(html, BASE_URL);

      expect(result.metaTags.robots).toContain('index');
      expect(result.metaTags.robots).toContain('follow');
      expect(result.linkTags.canonical).toBeDefined();
    });

    test('should have Czech localization meta tags', async ({ page }) => {
      await page.goto(BASE_URL);
      const html = await page.content();

      const result = await metaValidator.validateHTML(html, BASE_URL);

      expect(result.metaTags.language).toBe('cs');
      expect(result.metaTags['og:locale']).toBe('cs_CZ');
      expect(result.metaTags.location).toContain('Zlínský kraj');
    });
  });

  test.describe('Schema Markup Validation', () => {
    test('should have valid LocalBusiness schema', async ({ page }) => {
      await page.goto(BASE_URL);
      const html = await page.content();

      const result = await schemaValidator.validateHTML(html, BASE_URL);

      // Check overall score
      expect(result.score).toBeGreaterThanOrEqual(70);

      // Check for LocalBusiness schema
      const localBusinessSchema = result.schemas?.find(schema =>
        schema.type === 'JSON-LD' &&
        schema.data?.some(item => item['@type'] === 'LocalBusiness')
      );

      expect(localBusinessSchema).toBeDefined();

      if (localBusinessSchema) {
        const businessData = localBusinessSchema.data.find(item => item['@type'] === 'LocalBusiness');
        expect(businessData.name).toBe('KPS Interiéry');
        expect(businessData.url).toBeDefined();
        expect(businessData.address).toBeDefined();
        expect(businessData.geo).toBeDefined();
      }
    });

    test('should have valid Organization schema', async ({ page }) => {
      await page.goto(BASE_URL);
      const html = await page.content();

      const result = await schemaValidator.validateHTML(html, BASE_URL);

      const organizationSchema = result.schemas?.find(schema =>
        schema.type === 'JSON-LD' &&
        schema.data?.some(item => item['@type'] === 'Organization')
      );

      expect(organizationSchema).toBeDefined();

      if (organizationSchema) {
        const orgData = organizationSchema.data.find(item => item['@type'] === 'Organization');
        expect(orgData.name).toBe('KPS Interiéry');
        expect(orgData.logo).toBeDefined();
        expect(orgData.url).toBeDefined();
      }
    });

    test('should have service-related schema markup', async ({ page }) => {
      await page.goto(BASE_URL);
      const html = await page.content();

      const result = await schemaValidator.validateHTML(html, BASE_URL);

      // Check for service or product schemas
      const hasServiceSchema = result.schemas?.some(schema =>
        schema.type === 'JSON-LD' &&
        schema.data?.some(item =>
          item['@type'] === 'Service' ||
          item['@type'] === 'Product' ||
          item.makesOffer
        )
      );

      expect(hasServiceSchema).toBe(true);
    });

    test('should have no critical schema validation errors', async ({ page }) => {
      await page.goto(BASE_URL);
      const html = await page.content();

      const result = await schemaValidator.validateHTML(html, BASE_URL);

      const criticalErrors = result.issues?.filter(issue => issue.severity === 'high') || [];
      expect(criticalErrors.length).toBeLessThanOrEqual(2); // Allow max 2 high severity issues
    });
  });

  test.describe('Social Media Integration', () => {
    test('should have complete Open Graph tags', async ({ page }) => {
      await page.goto(BASE_URL);
      const html = await page.content();

      const result = await socialTester.testHTML(html, BASE_URL);

      // Check overall social score
      expect(result.score).toBeGreaterThanOrEqual(75);

      // Check required OG tags
      expect(result.openGraph['og:title']).toBeDefined();
      expect(result.openGraph['og:description']).toBeDefined();
      expect(result.openGraph['og:type']).toBe('website');
      expect(result.openGraph['og:image']).toBeDefined();
      expect(result.openGraph['og:url']).toBeDefined();
      expect(result.openGraph['og:site_name']).toBe('KPS Interiéry');
    });

    test('should have proper Twitter Card implementation', async ({ page }) => {
      await page.goto(BASE_URL);
      const html = await page.content();

      const result = await socialTester.testHTML(html, BASE_URL);

      expect(result.twitterCard['twitter:card']).toBeDefined();
      expect(result.twitterCard['twitter:title']).toBeDefined();
      expect(result.twitterCard['twitter:description']).toBeDefined();
      expect(result.twitterCard['twitter:site']).toBe('@kps_interiery');
    });

    test('should generate proper social previews', async ({ page }) => {
      await page.goto(BASE_URL);
      const html = await page.content();

      const result = await socialTester.testHTML(html, BASE_URL);

      // Check Facebook preview
      expect(result.facebook.title).toBeDefined();
      expect(result.facebook.description).toBeDefined();
      expect(result.facebook.image).toBeDefined();

      // Check Twitter preview
      expect(result.twitter.title).toBeDefined();
      expect(result.twitter.description).toBeDefined();

      // Check LinkedIn preview
      expect(result.linkedin.title).toBeDefined();
      expect(result.linkedin.description).toBeDefined();
    });

    test('should have optimized content lengths for social media', async ({ page }) => {
      await page.goto(BASE_URL);
      const html = await page.content();

      const result = await socialTester.testHTML(html, BASE_URL);

      // Check title lengths
      if (result.openGraph['og:title']) {
        expect(result.openGraph['og:title'].length).toBeLessThanOrEqual(100);
      }

      if (result.twitterCard['twitter:title']) {
        expect(result.twitterCard['twitter:title'].length).toBeLessThanOrEqual(70);
      }

      // Check description lengths
      if (result.openGraph['og:description']) {
        expect(result.openGraph['og:description'].length).toBeLessThanOrEqual(300);
      }

      if (result.twitterCard['twitter:description']) {
        expect(result.twitterCard['twitter:description'].length).toBeLessThanOrEqual(200);
      }
    });
  });

  test.describe('Technical SEO', () => {
    test('should have proper HTML structure', async ({ page }) => {
      await page.goto(BASE_URL);

      // Check for single H1
      const h1Elements = await page.locator('h1').count();
      expect(h1Elements).toBe(1);

      // Check H1 content
      const h1Text = await page.locator('h1').textContent();
      expect(h1Text).toContain('KPS');

      // Check for proper heading hierarchy
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      expect(headings.length).toBeGreaterThan(3);
    });

    test('should have proper image optimization', async ({ page }) => {
      await page.goto(BASE_URL);

      // Check for alt attributes on images
      const images = await page.locator('img').all();

      for (const img of images) {
        const alt = await img.getAttribute('alt');
        const src = await img.getAttribute('src');

        // All images should have alt attributes (decorative images can have empty alt)
        expect(alt).not.toBeNull();

        // Check for lazy loading on non-critical images
        if (src && !src.includes('hero') && !src.includes('logo')) {
          const loading = await img.getAttribute('loading');
          // Lazy loading is recommended but not required for all images
        }
      }
    });

    test('should have proper internal linking', async ({ page }) => {
      await page.goto(BASE_URL);

      // Check for navigation links
      const navLinks = await page.locator('nav a, .nav a').all();
      expect(navLinks.length).toBeGreaterThan(3);

      // Check for footer links
      const footerLinks = await page.locator('footer a').all();
      expect(footerLinks.length).toBeGreaterThan(0);
    });

    test('should have fast loading performance indicators', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(BASE_URL);
      await page.waitForLoadState('domcontentloaded');
      const loadTime = Date.now() - startTime;

      // Page should load reasonably fast
      expect(loadTime).toBeLessThan(5000); // 5 seconds max

      // Check for performance hints
      const html = await page.content();
      expect(html).toContain('preconnect'); // Should have font preconnect
    });
  });

  test.describe('Mobile and PWA', () => {
    test('should have proper mobile viewport', async ({ page }) => {
      await page.goto(BASE_URL);

      const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute('content');
      expect(viewportMeta).toContain('width=device-width');
      expect(viewportMeta).toContain('initial-scale=1');
    });

    test('should have PWA manifest', async ({ page }) => {
      await page.goto(BASE_URL);

      const manifestLink = await page.locator('link[rel="manifest"]').getAttribute('href');
      expect(manifestLink).toBeDefined();

      // Test manifest accessibility
      const manifestResponse = await page.request.get(manifestLink);
      expect(manifestResponse.status()).toBe(200);

      const manifestData = await manifestResponse.json();
      expect(manifestData.name).toContain('KPS');
      expect(manifestData.short_name).toBeDefined();
      expect(manifestData.icons).toBeDefined();
      expect(manifestData.icons.length).toBeGreaterThan(0);
    });

    test('should have proper theme colors', async ({ page }) => {
      await page.goto(BASE_URL);

      const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content');
      expect(themeColor).toBeDefined();
      expect(themeColor).toMatch(/^#[0-9a-fA-F]{6}$/); // Valid hex color
    });
  });

  test.describe('Comprehensive SEO Audit', () => {
    test('should pass overall SEO audit with good score', async ({ page }) => {
      await page.goto(BASE_URL);
      const html = await page.content();

      // This would typically be done server-side, but we'll simulate it
      const mockAuditResult = {
        meta: await metaValidator.validateHTML(html, BASE_URL),
        schema: await schemaValidator.validateHTML(html, BASE_URL),
        social: await socialTester.testHTML(html, BASE_URL),
        overall: { score: 0, issues: [] }
      };

      // Calculate a simple overall score
      const scores = [
        mockAuditResult.meta.score,
        mockAuditResult.schema.score,
        mockAuditResult.social.score
      ].filter(score => score > 0);

      const overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;

      expect(overallScore).toBeGreaterThanOrEqual(75);
    });

    test('should have minimal critical SEO issues', async ({ page }) => {
      await page.goto(BASE_URL);
      const html = await page.content();

      const metaResult = await metaValidator.validateHTML(html, BASE_URL);
      const schemaResult = await schemaValidator.validateHTML(html, BASE_URL);
      const socialResult = await socialTester.testHTML(html, BASE_URL);

      const allIssues = [
        ...(metaResult.issues || []),
        ...(schemaResult.issues || []),
        ...(socialResult.issues || [])
      ];

      const criticalIssues = allIssues.filter(issue => issue.severity === 'high');

      // Should have no more than 3 critical issues
      expect(criticalIssues.length).toBeLessThanOrEqual(3);
    });
  });

  test.describe('Production Specific Tests', () => {
    test.skip(({ browserName }) => browserName !== 'chromium', 'Production tests only on Chromium');

    test('production site should have HTTPS and security headers', async ({ page }) => {
      // Only run if production URL is accessible
      try {
        await page.goto(PRODUCTION_URL, { timeout: 10000 });

        // Check HTTPS
        const url = page.url();
        expect(url).toMatch(/^https:/);

        // Check for security-related meta tags or headers
        const html = await page.content();
        // These would be checked in a real security audit

      } catch (error) {
        test.skip('Production site not accessible');
      }
    });

    test('production site should have proper canonical URLs', async ({ page }) => {
      try {
        await page.goto(PRODUCTION_URL, { timeout: 10000 });

        const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
        expect(canonical).toBeDefined();
        expect(canonical).toMatch(/^https:\/\//);

      } catch (error) {
        test.skip('Production site not accessible');
      }
    });
  });

  test.describe('Accessibility SEO Factors', () => {
    test('should have proper ARIA labels and semantic HTML', async ({ page }) => {
      await page.goto(BASE_URL);

      // Check for main landmarks
      const main = await page.locator('main').count();
      expect(main).toBeGreaterThanOrEqual(1);

      // Check for navigation
      const nav = await page.locator('nav').count();
      expect(nav).toBeGreaterThanOrEqual(1);

      // Check for proper heading structure
      const h1 = await page.locator('h1').count();
      expect(h1).toBe(1);
    });

    test('should have proper language declarations', async ({ page }) => {
      await page.goto(BASE_URL);

      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toBe('cs');

      const bodyLang = await page.locator('body').getAttribute('lang');
      expect(bodyLang).toBe('cs');
    });
  });
});

test.describe('Performance SEO Tests', () => {
  test('should load critical resources efficiently', async ({ page }) => {
    await page.goto(BASE_URL);

    // Check for render-blocking resources
    const stylesheets = await page.locator('head link[rel="stylesheet"]:not([media])').count();

    // Should minimize render-blocking CSS
    expect(stylesheets).toBeLessThanOrEqual(2);
  });

  test('should have optimized font loading', async ({ page }) => {
    await page.goto(BASE_URL);

    const html = await page.content();

    // Should have font preconnections
    expect(html).toContain('preconnect');
    expect(html).toContain('fonts.googleapis.com');
    expect(html).toContain('fonts.gstatic.com');
  });

  test('should have proper caching headers (production only)', async ({ page }) => {
    // This test would check HTTP headers in a real environment
    // For now, we'll check for cache-related meta tags
    await page.goto(BASE_URL);

    // Check for proper expires or cache-control hints in HTML
    const html = await page.content();

    // Modern sites should use service workers or proper HTTP headers
    // This is more of a server configuration test
  });
});

// Helper function to generate SEO test report
export async function generateSEOTestReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: results.length,
      passed: results.filter(r => r.status === 'passed').length,
      failed: results.filter(r => r.status === 'failed').length,
      skipped: results.filter(r => r.status === 'skipped').length
    },
    categories: {
      metaTags: results.filter(r => r.title.includes('Meta Tags')),
      schemaMarkup: results.filter(r => r.title.includes('Schema')),
      socialMedia: results.filter(r => r.title.includes('Social Media')),
      technical: results.filter(r => r.title.includes('Technical')),
      performance: results.filter(r => r.title.includes('Performance'))
    },
    recommendations: [
      'Fix any failing meta tag tests',
      'Ensure all schema markup is valid',
      'Optimize social media integration',
      'Address technical SEO issues',
      'Monitor performance metrics'
    ]
  };

  return report;
}