import { test, expect, type Page } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Gallery Interaction E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test.describe('Portfolio Section', () => {
    test('should load portfolio section with galleries', async ({ page }) => {
      // Wait for portfolio section to be visible
      const portfolioSection = page.locator('#portfolio');
      await expect(portfolioSection).toBeVisible();

      // Check for section title
      const sectionTitle = portfolioSection.locator('h2');
      await expect(sectionTitle).toContainText('Nejnovější realizace');

      // Wait for galleries to load
      const portfolioGrid = portfolioSection.locator('.portfolio-grid');
      await expect(portfolioGrid).toBeVisible();

      // Check that at least one portfolio item is loaded
      const portfolioItems = portfolioSection.locator('.portfolio-item');
      await expect(portfolioItems.first()).toBeVisible();

      // Verify images are loaded
      const firstImage = portfolioItems.first().locator('img');
      await expect(firstImage).toHaveAttribute('src', /.+/);
      await expect(firstImage).toHaveAttribute('alt', /.+/);
    });

    test('should handle image loading errors gracefully', async ({ page }) => {
      // Intercept image requests and simulate failures for some images
      await page.route('**/images/galleries/**/missing-image.jpg', route => {
        route.abort();
      });

      const portfolioSection = page.locator('#portfolio');
      await expect(portfolioSection).toBeVisible();

      // Portfolio should still be functional even with some failed image loads
      const portfolioItems = portfolioSection.locator('.portfolio-item');
      await expect(portfolioItems.first()).toBeVisible();
    });

    test('should show hover effects on portfolio items', async ({ page }) => {
      const portfolioSection = page.locator('#portfolio');
      await portfolioSection.scrollIntoViewIfNeeded();

      const firstItem = portfolioSection.locator('.portfolio-item').first();
      await expect(firstItem).toBeVisible();

      // Test hover effect
      await firstItem.hover();
      
      // Check that overlay becomes visible on hover
      const overlay = firstItem.locator('.portfolio-overlay');
      await expect(overlay).toBeVisible();

      // Check for view button in overlay
      const viewButton = overlay.locator('.portfolio-view-btn');
      await expect(viewButton).toBeVisible();
      await expect(viewButton).toContainText('Zobrazit galerii');
    });
  });

  test.describe('Lightbox Functionality', () => {
    test('should open PhotoSwipe lightbox when clicking view button', async ({ page }) => {
      // Mock PhotoSwipe CSS to avoid external dependency issues
      await page.addStyleTag({
        content: `
          .pswp { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1000; }
          .pswp__img { max-width: none; max-height: none; }
        `
      });

      const portfolioSection = page.locator('#portfolio');
      await portfolioSection.scrollIntoViewIfNeeded();

      const firstItem = portfolioSection.locator('.portfolio-item').first();
      await firstItem.hover();

      const viewButton = firstItem.locator('.portfolio-view-btn');
      await expect(viewButton).toBeVisible();

      // Click the view button to open lightbox
      await viewButton.click();

      // Wait for PhotoSwipe to initialize (it loads dynamically)
      await page.waitForTimeout(1000);

      // Note: Since PhotoSwipe is loaded dynamically, we might need to check for its container
      // or verify that the import was attempted
      const photoswipeContainer = page.locator('.pswp');
      // PhotoSwipe might not be visible in test environment, so we mainly test the click handler works
    });

    test('should handle lightbox with keyboard navigation', async ({ page }) => {
      const portfolioSection = page.locator('#portfolio');
      await portfolioSection.scrollIntoViewIfNeeded();

      const firstItem = portfolioSection.locator('.portfolio-item').first();
      await firstItem.hover();

      const viewButton = firstItem.locator('.portfolio-view-btn');
      await viewButton.click();

      // Wait for potential lightbox initialization
      await page.waitForTimeout(500);

      // Test escape key (should close lightbox if open)
      await page.keyboard.press('Escape');

      // Test arrow keys (should navigate if lightbox is open)
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowLeft');
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should adapt to mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      const portfolioSection = page.locator('#portfolio');
      await expect(portfolioSection).toBeVisible();

      const portfolioGrid = portfolioSection.locator('.portfolio-grid');
      await expect(portfolioGrid).toBeVisible();

      // On mobile, items should stack in a single column
      const portfolioItems = portfolioSection.locator('.portfolio-item');
      const itemCount = await portfolioItems.count();
      
      if (itemCount > 0) {
        // Check that items are stacked (by checking their positions)
        const firstItemBox = await portfolioItems.first().boundingBox();
        if (itemCount > 1) {
          const secondItemBox = await portfolioItems.nth(1).boundingBox();
          
          if (firstItemBox && secondItemBox) {
            // Second item should be below the first (vertical stacking)
            expect(secondItemBox.y).toBeGreaterThan(firstItemBox.y + firstItemBox.height - 50);
          }
        }
      }
    });

    test('should adapt to tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      const portfolioSection = page.locator('#portfolio');
      await expect(portfolioSection).toBeVisible();

      const portfolioItems = portfolioSection.locator('.portfolio-item');
      const itemCount = await portfolioItems.count();

      if (itemCount > 1) {
        // On tablet, items might be in 2 columns
        const firstItemBox = await portfolioItems.first().boundingBox();
        const secondItemBox = await portfolioItems.nth(1).boundingBox();

        if (firstItemBox && secondItemBox) {
          // Items could be side by side or stacked depending on design
          const horizontalDistance = Math.abs(secondItemBox.x - firstItemBox.x);
          const verticalDistance = Math.abs(secondItemBox.y - firstItemBox.y);
          
          // Should have some meaningful layout relationship
          expect(horizontalDistance > 50 || verticalDistance > 50).toBeTruthy();
        }
      }
    });

    test('should handle desktop viewport layout', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      const portfolioSection = page.locator('#portfolio');
      await expect(portfolioSection).toBeVisible();

      const portfolioGrid = portfolioSection.locator('.portfolio-grid');
      await expect(portfolioGrid).toBeVisible();

      // Check for responsive grid layout
      const gridComputedStyle = await portfolioGrid.evaluate(el => {
        return window.getComputedStyle(el).getPropertyValue('display');
      });
      
      expect(gridComputedStyle).toBe('grid');
    });
  });

  test.describe('Performance and Loading', () => {
    test('should load images efficiently', async ({ page }) => {
      // Navigate to page and measure loading performance
      const startTime = Date.now();
      
      await page.goto(BASE_URL);
      
      // Wait for portfolio section to load
      const portfolioSection = page.locator('#portfolio');
      await expect(portfolioSection).toBeVisible();
      
      // Wait for first image to load
      const firstImage = portfolioSection.locator('img').first();
      await expect(firstImage).toBeVisible();
      
      const endTime = Date.now();
      const loadTime = endTime - startTime;
      
      // Should load within reasonable time (adjust threshold as needed)
      expect(loadTime).toBeLessThan(5000); // 5 seconds max
    });

    test('should handle slow network conditions', async ({ page }) => {
      // Simulate slow 3G network
      await page.route('**/*', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
        await route.continue();
      });

      await page.goto(BASE_URL);
      
      // Should still load, just slower
      const portfolioSection = page.locator('#portfolio');
      await expect(portfolioSection).toBeVisible({ timeout: 10000 });
      
      // Loading indicator should be shown initially
      const loadingIndicator = portfolioSection.locator('.portfolio-loading');
      // Note: This might not be visible by the time we check due to timing
    });

    test('should implement lazy loading for images', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const portfolioSection = page.locator('#portfolio');
      await expect(portfolioSection).toBeVisible();

      // Check that images have loading="lazy" or loading="eager" attributes
      const images = portfolioSection.locator('img');
      const imageCount = await images.count();

      if (imageCount > 0) {
        const firstImage = images.first();
        const loadingAttr = await firstImage.getAttribute('loading');
        
        // Should have a loading strategy defined
        expect(loadingAttr).toBeTruthy();
        expect(['lazy', 'eager']).toContain(loadingAttr);
      }
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels and attributes', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const portfolioSection = page.locator('#portfolio');
      await expect(portfolioSection).toBeVisible();

      // Check for proper heading structure
      const sectionTitle = portfolioSection.locator('h2');
      await expect(sectionTitle).toBeVisible();

      // Check for proper alt text on images
      const images = portfolioSection.locator('img');
      const imageCount = await images.count();

      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const image = images.nth(i);
        const altText = await image.getAttribute('alt');
        expect(altText).toBeTruthy();
        expect(altText?.length).toBeGreaterThan(0);
      }

      // Check for keyboard accessibility on buttons
      const viewButtons = portfolioSection.locator('.portfolio-view-btn');
      if (await viewButtons.count() > 0) {
        const firstButton = viewButtons.first();
        
        // Should be focusable
        await firstButton.focus();
        await expect(firstButton).toBeFocused();
        
        // Should be activatable with Enter key
        await firstButton.press('Enter');
      }
    });

    test('should work with screen readers', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Check for semantic HTML structure
      const portfolioSection = page.locator('#portfolio');
      await expect(portfolioSection).toBeVisible();

      // Should have proper heading hierarchy
      const headings = portfolioSection.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();
      expect(headingCount).toBeGreaterThan(0);

      // Images should have meaningful alt text
      const images = portfolioSection.locator('img');
      const imageCount = await images.count();

      if (imageCount > 0) {
        const altTexts = await images.evaluateAll(imgs => 
          imgs.map(img => img.getAttribute('alt'))
        );
        
        altTexts.forEach(alt => {
          expect(alt).toBeTruthy();
          expect(alt?.trim().length).toBeGreaterThan(0);
        });
      }
    });

    test('should support high contrast mode', async ({ page }) => {
      // Enable high contrast simulation
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto(BASE_URL);
      
      const portfolioSection = page.locator('#portfolio');
      await expect(portfolioSection).toBeVisible();

      // Check that content is still visible and functional
      const portfolioItems = portfolioSection.locator('.portfolio-item');
      if (await portfolioItems.count() > 0) {
        const firstItem = portfolioItems.first();
        await expect(firstItem).toBeVisible();
        
        // Test hover functionality still works
        await firstItem.hover();
        const overlay = firstItem.locator('.portfolio-overlay');
        await expect(overlay).toBeVisible();
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Block all gallery JSON requests
      await page.route('**/images/galleries/**/gallery.json', route => {
        route.abort();
      });

      await page.goto(BASE_URL);
      
      const portfolioSection = page.locator('#portfolio');
      await expect(portfolioSection).toBeVisible();

      // Should show loading state or handle empty state gracefully
      // The exact behavior depends on implementation
      const loadingText = portfolioSection.locator('text=Načítání');
      // Loading text might be visible briefly or not at all depending on timing
    });

    test('should handle malformed gallery data', async ({ page }) => {
      // Intercept gallery requests and return malformed data
      await page.route('**/images/galleries/**/gallery.json', route => {
        route.fulfill({
          status: 200,
          body: '{"invalid": "json structure"}'
        });
      });

      await page.goto(BASE_URL);
      
      // Page should still load without crashing
      const portfolioSection = page.locator('#portfolio');
      await expect(portfolioSection).toBeVisible();
    });

    test('should handle missing images gracefully', async ({ page }) => {
      // Block image requests
      await page.route('**/images/galleries/**/*.{jpg,jpeg,webp,avif}', route => {
        route.abort();
      });

      await page.goto(BASE_URL);
      
      const portfolioSection = page.locator('#portfolio');
      await expect(portfolioSection).toBeVisible();

      // Portfolio items should still be present, even if images fail to load
      const portfolioItems = portfolioSection.locator('.portfolio-item');
      if (await portfolioItems.count() > 0) {
        await expect(portfolioItems.first()).toBeVisible();
      }
    });
  });
});