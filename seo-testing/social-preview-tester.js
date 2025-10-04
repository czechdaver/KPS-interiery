#!/usr/bin/env node
/**
 * Social Media Preview Tester for KPS Interiéry
 * Tests and validates Open Graph and Twitter Card implementations
 */

import { JSDOM } from 'jsdom';
import fs from 'fs/promises';
import { performance } from 'perf_hooks';

class SocialPreviewTester {
  constructor() {
    this.results = {
      openGraph: {},
      twitterCard: {},
      facebook: {},
      linkedin: {},
      issues: [],
      score: 0
    };

    this.requiredOgTags = [
      'og:title',
      'og:description',
      'og:type',
      'og:url',
      'og:image'
    ];

    this.requiredTwitterTags = [
      'twitter:card',
      'twitter:title',
      'twitter:description'
    ];

    this.socialPlatforms = {
      facebook: {
        name: 'Facebook',
        imageMinWidth: 600,
        imageMinHeight: 315,
        imageOptimalRatio: 1.91, // 1200x630
        titleMaxLength: 100,
        descriptionMaxLength: 300,
        debugUrl: 'https://developers.facebook.com/tools/debug/'
      },
      twitter: {
        name: 'Twitter',
        imageMinWidth: 280,
        imageMinHeight: 150,
        imageOptimalRatio: 1.91, // 1200x630 for summary_large_image
        titleMaxLength: 70,
        descriptionMaxLength: 200,
        debugUrl: 'https://cards-dev.twitter.com/validator'
      },
      linkedin: {
        name: 'LinkedIn',
        imageMinWidth: 1200,
        imageMinHeight: 627,
        imageOptimalRatio: 1.91,
        titleMaxLength: 200,
        descriptionMaxLength: 300,
        debugUrl: 'https://www.linkedin.com/post-inspector/'
      }
    };
  }

  /**
   * Test social media preview for HTML content
   */
  async testHTML(html, url = 'unknown') {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const results = {
      url,
      openGraph: {},
      twitterCard: {},
      facebook: {},
      linkedin: {},
      issues: [],
      preview: {},
      score: 0
    };

    // Extract meta tags
    const metaTags = document.querySelectorAll('meta');
    const metaMap = {};

    metaTags.forEach(meta => {
      const property = meta.getAttribute('property') || meta.getAttribute('name');
      const content = meta.getAttribute('content');
      if (property && content) {
        metaMap[property] = content;
      }
    });

    // Test Open Graph
    this.testOpenGraph(metaMap, results);

    // Test Twitter Cards
    this.testTwitterCard(metaMap, results);

    // Generate preview data
    this.generatePreviewData(metaMap, results);

    // Validate for each platform
    this.validateForFacebook(results);
    this.validateForTwitter(results);
    this.validateForLinkedIn(results);

    // Calculate score
    results.score = this.calculateSocialScore(results);

    return results;
  }

  testOpenGraph(metaMap, results) {
    // Extract Open Graph data
    Object.keys(metaMap).forEach(key => {
      if (key.startsWith('og:')) {
        results.openGraph[key] = metaMap[key];
      }
    });

    // Check required OG tags
    this.requiredOgTags.forEach(tag => {
      if (!results.openGraph[tag]) {
        results.issues.push({
          type: 'error',
          platform: 'OpenGraph',
          tag,
          message: `Missing required Open Graph tag: ${tag}`,
          severity: 'high'
        });
      }
    });

    // Validate OG image
    if (results.openGraph['og:image']) {
      this.validateOgImage(results.openGraph['og:image'], results);
    }

    // Validate OG type
    if (results.openGraph['og:type']) {
      this.validateOgType(results.openGraph['og:type'], results);
    }

    // Validate OG URL
    if (results.openGraph['og:url']) {
      this.validateUrl(results.openGraph['og:url'], 'og:url', results);
    }
  }

  testTwitterCard(metaMap, results) {
    // Extract Twitter Card data
    Object.keys(metaMap).forEach(key => {
      if (key.startsWith('twitter:')) {
        results.twitterCard[key] = metaMap[key];
      }
    });

    // Check required Twitter tags
    this.requiredTwitterTags.forEach(tag => {
      if (!results.twitterCard[tag]) {
        results.issues.push({
          type: 'error',
          platform: 'Twitter',
          tag,
          message: `Missing required Twitter Card tag: ${tag}`,
          severity: 'high'
        });
      }
    });

    // Validate Twitter Card type
    if (results.twitterCard['twitter:card']) {
      this.validateTwitterCardType(results.twitterCard['twitter:card'], results);
    }

    // Check for image if using summary_large_image
    if (results.twitterCard['twitter:card'] === 'summary_large_image' && !results.twitterCard['twitter:image']) {
      results.issues.push({
        type: 'warning',
        platform: 'Twitter',
        tag: 'twitter:image',
        message: 'summary_large_image card type requires twitter:image',
        severity: 'medium'
      });
    }
  }

  generatePreviewData(metaMap, results) {
    // Generate preview data for each platform
    const title = metaMap['og:title'] || metaMap['twitter:title'] || '';
    const description = metaMap['og:description'] || metaMap['twitter:description'] || metaMap['description'] || '';
    const image = metaMap['og:image'] || metaMap['twitter:image'] || '';
    const url = metaMap['og:url'] || results.url;

    results.preview = {
      title,
      description,
      image,
      url,
      site_name: metaMap['og:site_name'] || 'KPS Interiéry',
      type: metaMap['og:type'] || 'website'
    };

    // Generate platform-specific previews
    this.generateFacebookPreview(results);
    this.generateTwitterPreview(results);
    this.generateLinkedInPreview(results);
  }

  generateFacebookPreview(results) {
    const preview = results.preview;

    results.facebook = {
      title: preview.title.substring(0, 100),
      description: preview.description.substring(0, 300),
      image: preview.image,
      url: preview.url,
      site_name: preview.site_name,
      type: preview.type,
      debugUrl: `${this.socialPlatforms.facebook.debugUrl}?q=${encodeURIComponent(preview.url)}`
    };
  }

  generateTwitterPreview(results) {
    const preview = results.preview;
    const cardType = results.twitterCard['twitter:card'] || 'summary';

    results.twitter = {
      card: cardType,
      title: preview.title.substring(0, 70),
      description: preview.description.substring(0, 200),
      image: results.twitterCard['twitter:image'] || preview.image,
      url: preview.url,
      site: results.twitterCard['twitter:site'] || '@kps_interiery',
      debugUrl: `${this.socialPlatforms.twitter.debugUrl}?url=${encodeURIComponent(preview.url)}`
    };
  }

  generateLinkedInPreview(results) {
    const preview = results.preview;

    results.linkedin = {
      title: preview.title.substring(0, 200),
      description: preview.description.substring(0, 300),
      image: preview.image,
      url: preview.url,
      debugUrl: `${this.socialPlatforms.linkedin.debugUrl}?url=${encodeURIComponent(preview.url)}`
    };
  }

  validateForFacebook(results) {
    const platform = this.socialPlatforms.facebook;
    const og = results.openGraph;

    // Title length
    if (og['og:title'] && og['og:title'].length > platform.titleMaxLength) {
      results.issues.push({
        type: 'warning',
        platform: 'Facebook',
        tag: 'og:title',
        message: `Title too long for Facebook: ${og['og:title'].length} chars (max: ${platform.titleMaxLength})`,
        severity: 'medium'
      });
    }

    // Description length
    if (og['og:description'] && og['og:description'].length > platform.descriptionMaxLength) {
      results.issues.push({
        type: 'warning',
        platform: 'Facebook',
        tag: 'og:description',
        message: `Description too long for Facebook: ${og['og:description'].length} chars (max: ${platform.descriptionMaxLength})`,
        severity: 'medium'
      });
    }

    // Image validation for Facebook
    if (og['og:image']) {
      this.validateImageForPlatform(og['og:image'], 'Facebook', platform, results);
    }

    // Check for og:image:alt
    if (og['og:image'] && !og['og:image:alt']) {
      results.issues.push({
        type: 'warning',
        platform: 'Facebook',
        tag: 'og:image:alt',
        message: 'Add og:image:alt for better accessibility',
        severity: 'low'
      });
    }
  }

  validateForTwitter(results) {
    const platform = this.socialPlatforms.twitter;
    const twitter = results.twitterCard;

    // Title length
    if (twitter['twitter:title'] && twitter['twitter:title'].length > platform.titleMaxLength) {
      results.issues.push({
        type: 'warning',
        platform: 'Twitter',
        tag: 'twitter:title',
        message: `Title too long for Twitter: ${twitter['twitter:title'].length} chars (max: ${platform.titleMaxLength})`,
        severity: 'medium'
      });
    }

    // Description length
    if (twitter['twitter:description'] && twitter['twitter:description'].length > platform.descriptionMaxLength) {
      results.issues.push({
        type: 'warning',
        platform: 'Twitter',
        tag: 'twitter:description',
        message: `Description too long for Twitter: ${twitter['twitter:description'].length} chars (max: ${platform.descriptionMaxLength})`,
        severity: 'medium'
      });
    }

    // Image validation for Twitter
    const image = twitter['twitter:image'] || results.openGraph['og:image'];
    if (image) {
      this.validateImageForPlatform(image, 'Twitter', platform, results);
    }
  }

  validateForLinkedIn(results) {
    const platform = this.socialPlatforms.linkedin;
    const og = results.openGraph;

    // LinkedIn uses Open Graph tags
    // Title length
    if (og['og:title'] && og['og:title'].length > platform.titleMaxLength) {
      results.issues.push({
        type: 'warning',
        platform: 'LinkedIn',
        tag: 'og:title',
        message: `Title too long for LinkedIn: ${og['og:title'].length} chars (max: ${platform.titleMaxLength})`,
        severity: 'medium'
      });
    }

    // Description length
    if (og['og:description'] && og['og:description'].length > platform.descriptionMaxLength) {
      results.issues.push({
        type: 'warning',
        platform: 'LinkedIn',
        tag: 'og:description',
        message: `Description too long for LinkedIn: ${og['og:description'].length} chars (max: ${platform.descriptionMaxLength})`,
        severity: 'medium'
      });
    }

    // Image validation for LinkedIn
    if (og['og:image']) {
      this.validateImageForPlatform(og['og:image'], 'LinkedIn', platform, results);
    }
  }

  validateImageForPlatform(imageUrl, platformName, platform, results) {
    // Basic URL validation
    try {
      new URL(imageUrl);
    } catch (error) {
      results.issues.push({
        type: 'error',
        platform: platformName,
        tag: 'image',
        message: `Invalid image URL: ${imageUrl}`,
        severity: 'high'
      });
      return;
    }

    // Check for HTTPS
    if (!imageUrl.startsWith('https://')) {
      results.issues.push({
        type: 'warning',
        platform: platformName,
        tag: 'image',
        message: `Use HTTPS for images: ${imageUrl}`,
        severity: 'medium'
      });
    }

    // Note: We can't actually check image dimensions without downloading
    // This would be done in a full implementation
    results.issues.push({
      type: 'recommendation',
      platform: platformName,
      tag: 'image',
      message: `Ensure image is at least ${platform.imageMinWidth}x${platform.imageMinHeight}px for optimal display`,
      severity: 'low'
    });
  }

  validateOgImage(imageUrl, results) {
    try {
      new URL(imageUrl);
    } catch (error) {
      results.issues.push({
        type: 'error',
        platform: 'OpenGraph',
        tag: 'og:image',
        message: `Invalid og:image URL: ${imageUrl}`,
        severity: 'high'
      });
    }
  }

  validateOgType(type, results) {
    const validTypes = [
      'website', 'article', 'book', 'profile', 'music.song',
      'music.album', 'music.playlist', 'music.radio_station',
      'video.movie', 'video.episode', 'video.tv_show', 'video.other'
    ];

    if (!validTypes.includes(type)) {
      results.issues.push({
        type: 'warning',
        platform: 'OpenGraph',
        tag: 'og:type',
        message: `Uncommon og:type: ${type}. Consider using standard types.`,
        severity: 'low'
      });
    }
  }

  validateTwitterCardType(cardType, results) {
    const validTypes = ['summary', 'summary_large_image', 'app', 'player'];

    if (!validTypes.includes(cardType)) {
      results.issues.push({
        type: 'error',
        platform: 'Twitter',
        tag: 'twitter:card',
        message: `Invalid twitter:card type: ${cardType}`,
        severity: 'high'
      });
    }
  }

  validateUrl(url, tag, results) {
    try {
      const urlObj = new URL(url);
      if (!urlObj.protocol.startsWith('http')) {
        results.issues.push({
          type: 'warning',
          platform: 'OpenGraph',
          tag,
          message: `URL should use HTTP/HTTPS protocol: ${url}`,
          severity: 'medium'
        });
      }
    } catch (error) {
      results.issues.push({
        type: 'error',
        platform: 'OpenGraph',
        tag,
        message: `Invalid URL format: ${url}`,
        severity: 'high'
      });
    }
  }

  calculateSocialScore(results) {
    let score = 100;

    // Penalize for issues
    results.issues.forEach(issue => {
      switch (issue.severity) {
        case 'high':
          score -= 20;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    // Bonus for complete implementations
    const hasRequiredOg = this.requiredOgTags.every(tag => results.openGraph[tag]);
    const hasRequiredTwitter = this.requiredTwitterTags.every(tag => results.twitterCard[tag]);

    if (hasRequiredOg) score += 10;
    if (hasRequiredTwitter) score += 10;

    // Bonus for optional tags
    if (results.openGraph['og:image:alt']) score += 5;
    if (results.twitterCard['twitter:site']) score += 5;
    if (results.openGraph['og:site_name']) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  async testURL(url) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      return await this.testHTML(html, url);
    } catch (error) {
      return {
        url,
        error: error.message,
        score: 0
      };
    }
  }

  async testFile(filePath) {
    try {
      const html = await fs.readFile(filePath, 'utf-8');
      return await this.testHTML(html, filePath);
    } catch (error) {
      return {
        url: filePath,
        error: error.message,
        score: 0
      };
    }
  }

  generateReport(results) {
    const allIssues = results.flatMap(r => r.issues || []);
    const platformIssues = {};

    allIssues.forEach(issue => {
      if (!platformIssues[issue.platform]) {
        platformIssues[issue.platform] = [];
      }
      platformIssues[issue.platform].push(issue);
    });

    return {
      summary: {
        timestamp: new Date().toISOString(),
        totalPages: results.length,
        averageScore: results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length,
        totalIssues: allIssues.length,
        platformIssues,
        passedPages: results.filter(r => r.score >= 80).length
      },
      pages: results,
      testingUrls: {
        facebook: 'https://developers.facebook.com/tools/debug/',
        twitter: 'https://cards-dev.twitter.com/validator',
        linkedin: 'https://www.linkedin.com/post-inspector/',
        opengraph: 'https://www.opengraph.xyz/'
      },
      recommendations: this.generateSocialRecommendations(results)
    };
  }

  generateSocialRecommendations(results) {
    const recommendations = [];

    // Check for missing images
    const pagesWithoutImages = results.filter(r =>
      !r.openGraph['og:image'] && !r.twitterCard['twitter:image']
    ).length;

    if (pagesWithoutImages > 0) {
      recommendations.push({
        priority: 'high',
        platform: 'All',
        message: `Add social media images to ${pagesWithoutImages} page(s)`,
        impact: 'Significantly improves click-through rates on social media'
      });
    }

    // Check for missing alt text
    const pagesWithoutAlt = results.filter(r =>
      r.openGraph['og:image'] && !r.openGraph['og:image:alt']
    ).length;

    if (pagesWithoutAlt > 0) {
      recommendations.push({
        priority: 'medium',
        platform: 'Facebook/LinkedIn',
        message: `Add og:image:alt to ${pagesWithoutAlt} page(s)`,
        impact: 'Improves accessibility and SEO'
      });
    }

    // General recommendations
    recommendations.push({
      priority: 'high',
      platform: 'All',
      message: 'Create branded social media images (1200x630px)',
      impact: 'Consistent brand presence across social platforms'
    });

    recommendations.push({
      priority: 'medium',
      platform: 'Twitter',
      message: 'Use summary_large_image card type for better engagement',
      impact: 'Larger images get more attention on Twitter'
    });

    return recommendations;
  }
}

// CLI interface
async function main() {
  const tester = new SocialPreviewTester();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node social-preview-tester.js <url|file> [output-file]');
    console.log('Examples:');
    console.log('  node social-preview-tester.js https://kps-interiery.cz');
    console.log('  node social-preview-tester.js ./dist/index.html');
    console.log('  node social-preview-tester.js https://kps-interiery.cz social-report.json');
    process.exit(1);
  }

  const input = args[0];
  const outputFile = args[1];
  const startTime = performance.now();

  console.log('🔍 Starting social media preview testing...');

  let result;
  if (input.startsWith('http')) {
    result = await tester.testURL(input);
  } else {
    result = await tester.testFile(input);
  }

  const report = tester.generateReport([result]);
  const endTime = performance.now();

  console.log('\n📊 Social Media Preview Test Report');
  console.log('====================================');
  console.log(`✅ Score: ${result.score}/100`);
  console.log(`⏱️  Duration: ${Math.round(endTime - startTime)}ms`);
  console.log(`📄 URL/File: ${result.url}`);

  if (result.error) {
    console.log(`❌ Error: ${result.error}`);
  } else {
    console.log('\n🎯 Open Graph Tags:');
    if (Object.keys(result.openGraph).length > 0) {
      Object.entries(result.openGraph).forEach(([key, value]) => {
        console.log(`  • ${key}: "${value}"`);
      });
    } else {
      console.log('  ❌ No Open Graph tags found');
    }

    console.log('\n🐦 Twitter Card Tags:');
    if (Object.keys(result.twitterCard).length > 0) {
      Object.entries(result.twitterCard).forEach(([key, value]) => {
        console.log(`  • ${key}: "${value}"`);
      });
    } else {
      console.log('  ❌ No Twitter Card tags found');
    }

    console.log('\n📱 Platform Previews:');
    console.log(`📘 Facebook: ${result.facebook?.title || 'No title'}`);
    console.log(`🐦 Twitter: ${result.twitter?.title || 'No title'} (${result.twitter?.card || 'no card'})`);
    console.log(`💼 LinkedIn: ${result.linkedin?.title || 'No title'}`);

    if (result.issues && result.issues.length > 0) {
      console.log('\n🚨 Issues Found:');
      result.issues.forEach(issue => {
        const icon = issue.severity === 'high' ? '❌' : issue.severity === 'medium' ? '⚠️' : '💡';
        console.log(`${icon} ${issue.platform}: ${issue.message}`);
      });
    }

    console.log('\n🔧 Testing URLs:');
    console.log(`📘 Facebook Debugger: ${result.facebook?.debugUrl || 'N/A'}`);
    console.log(`🐦 Twitter Validator: ${result.twitter?.debugUrl || 'N/A'}`);
    console.log(`💼 LinkedIn Inspector: ${result.linkedin?.debugUrl || 'N/A'}`);
  }

  if (outputFile) {
    await fs.writeFile(outputFile, JSON.stringify(report, null, 2));
    console.log(`\n💾 Report saved to: ${outputFile}`);
  }

  process.exit(result.score >= 75 ? 0 : 1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { SocialPreviewTester };