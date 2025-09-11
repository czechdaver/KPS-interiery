import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Launch browser for global setup
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the application
    const baseURL = config.webServer?.url || 'http://localhost:5173';
    await page.goto(baseURL);

    // Wait for the application to load
    await page.waitForLoadState('networkidle');

    // Check if application is responsive
    const title = await page.title();
    if (!title) {
      throw new Error('Application failed to load properly');
    }

    console.log(`✅ Application loaded successfully: ${title}`);

    // Pre-warm the application by navigating to key pages
    const portfolioSection = page.locator('#portfolio');
    if (await portfolioSection.isVisible()) {
      console.log('✅ Portfolio section is accessible');
    }

    // Check if galleries load
    const portfolioItems = page.locator('.portfolio-item');
    const itemCount = await portfolioItems.count();
    console.log(`✅ Found ${itemCount} portfolio items`);

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;