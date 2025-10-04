#!/usr/bin/env node
/**
 * Sitemap Structure Checker for KPS Interiéry
 * Validates XML sitemap structure, URLs, and SEO compliance
 */

import { JSDOM } from 'jsdom';
import fs from 'fs/promises';
import { performance } from 'perf_hooks';

class SitemapChecker {
  constructor() {
    this.results = {
      urls: [],
      errors: [],
      warnings: [],
      stats: {
        totalUrls: 0,
        validUrls: 0,
        invalidUrls: 0,
        redirectUrls: 0,
        errorUrls: 0,
        duplicateUrls: 0
      }
    };

    this.sitemapLimits = {
      maxUrls: 50000,
      maxFileSize: 50 * 1024 * 1024, // 50MB
      maxNestedSitemaps: 1000
    };

    this.allowedFrequencies = [
      'always', 'hourly', 'daily', 'weekly',
      'monthly', 'yearly', 'never'
    ];

    this.requiredPages = [
      '/',
      '/galerie',
      '/kontakt',
      '/o-nas'
    ];
  }

  /**
   * Validate XML sitemap structure and content
   */
  async validateSitemap(content, sitemapUrl = 'sitemap.xml') {
    const results = {
      url: sitemapUrl,
      type: null,
      urls: [],
      sitemaps: [],
      issues: [],
      stats: {
        totalEntries: 0,
        validUrls: 0,
        invalidUrls: 0,
        lastModified: null,
        avgPriority: 0
      },
      score: 0
    };

    try {
      // Parse XML
      const dom = new JSDOM(content, { contentType: 'text/xml' });
      const document = dom.window.document;

      // Check for parser errors
      const parserError = document.querySelector('parsererror');
      if (parserError) {
        results.issues.push({
          type: 'error',
          message: 'XML parsing error: Invalid XML structure',
          severity: 'high'
        });
        return results;
      }

      // Determine sitemap type
      const sitemapElement = document.querySelector('urlset');
      const indexElement = document.querySelector('sitemapindex');

      if (sitemapElement) {
        results.type = 'urlset';
        await this.validateUrlset(sitemapElement, results);
      } else if (indexElement) {
        results.type = 'index';
        await this.validateSitemapIndex(indexElement, results);
      } else {
        results.issues.push({
          type: 'error',
          message: 'Invalid sitemap: No urlset or sitemapindex element found',
          severity: 'high'
        });
        return results;
      }

      // Validate XML namespace
      this.validateNamespace(document, results);

      // Check file size constraints
      this.validateFileSize(content, results);

      // Calculate score
      results.score = this.calculateSitemapScore(results);

    } catch (error) {
      results.issues.push({
        type: 'error',
        message: `Failed to parse sitemap: ${error.message}`,
        severity: 'high'
      });
    }

    return results;
  }

  async validateUrlset(urlset, results) {
    const urls = urlset.querySelectorAll('url');
    results.stats.totalEntries = urls.length;

    if (urls.length === 0) {
      results.issues.push({
        type: 'warning',
        message: 'Sitemap contains no URLs',
        severity: 'medium'
      });
      return;
    }

    if (urls.length > this.sitemapLimits.maxUrls) {
      results.issues.push({
        type: 'error',
        message: `Too many URLs: ${urls.length} (max: ${this.sitemapLimits.maxUrls})`,
        severity: 'high'
      });
    }

    const seenUrls = new Set();
    let totalPriority = 0;
    let priorityCount = 0;

    for (const url of urls) {
      const urlData = await this.validateUrlElement(url, seenUrls, results);
      if (urlData) {
        results.urls.push(urlData);
        if (urlData.priority !== null) {
          totalPriority += urlData.priority;
          priorityCount++;
        }
      }
    }

    results.stats.avgPriority = priorityCount > 0 ? totalPriority / priorityCount : 0;
    this.checkRequiredPages(results);
  }

  async validateSitemapIndex(sitemapIndex, results) {
    const sitemaps = sitemapIndex.querySelectorAll('sitemap');
    results.stats.totalEntries = sitemaps.length;

    if (sitemaps.length === 0) {
      results.issues.push({
        type: 'warning',
        message: 'Sitemap index contains no sitemaps',
        severity: 'medium'
      });
      return;
    }

    if (sitemaps.length > this.sitemapLimits.maxNestedSitemaps) {
      results.issues.push({
        type: 'error',
        message: `Too many nested sitemaps: ${sitemaps.length} (max: ${this.sitemapLimits.maxNestedSitemaps})`,
        severity: 'high'
      });
    }

    for (const sitemap of sitemaps) {
      const sitemapData = await this.validateSitemapElement(sitemap, results);
      if (sitemapData) {
        results.sitemaps.push(sitemapData);
      }
    }
  }

  async validateUrlElement(urlElement, seenUrls, results) {
    const locElement = urlElement.querySelector('loc');
    if (!locElement) {
      results.issues.push({
        type: 'error',
        message: 'URL element missing required <loc> tag',
        severity: 'high'
      });
      return null;
    }

    const url = locElement.textContent.trim();
    if (!url) {
      results.issues.push({
        type: 'error',
        message: 'Empty URL in <loc> tag',
        severity: 'high'
      });
      return null;
    }

    // Check for duplicates
    if (seenUrls.has(url)) {
      results.issues.push({
        type: 'warning',
        message: `Duplicate URL: ${url}`,
        severity: 'medium'
      });
      results.stats.duplicateUrls++;
    }
    seenUrls.add(url);

    const urlData = {
      loc: url,
      lastmod: null,
      changefreq: null,
      priority: null,
      status: 'unknown',
      issues: []
    };

    // Validate URL format
    try {
      new URL(url);
      urlData.status = 'valid';
      results.stats.validUrls++;
    } catch (error) {
      urlData.status = 'invalid';
      urlData.issues.push('Invalid URL format');
      results.stats.invalidUrls++;
      results.issues.push({
        type: 'error',
        message: `Invalid URL format: ${url}`,
        severity: 'high'
      });
    }

    // Validate lastmod
    const lastmodElement = urlElement.querySelector('lastmod');
    if (lastmodElement) {
      const lastmod = lastmodElement.textContent.trim();
      if (lastmod) {
        if (this.isValidDateFormat(lastmod)) {
          urlData.lastmod = lastmod;
        } else {
          urlData.issues.push('Invalid lastmod date format');
          results.issues.push({
            type: 'warning',
            message: `Invalid lastmod format for ${url}: ${lastmod}`,
            severity: 'medium'
          });
        }
      }
    }

    // Validate changefreq
    const changefreqElement = urlElement.querySelector('changefreq');
    if (changefreqElement) {
      const changefreq = changefreqElement.textContent.trim();
      if (changefreq) {
        if (this.allowedFrequencies.includes(changefreq)) {
          urlData.changefreq = changefreq;
        } else {
          urlData.issues.push('Invalid changefreq value');
          results.issues.push({
            type: 'warning',
            message: `Invalid changefreq for ${url}: ${changefreq}`,
            severity: 'medium'
          });
        }
      }
    }

    // Validate priority
    const priorityElement = urlElement.querySelector('priority');
    if (priorityElement) {
      const priority = priorityElement.textContent.trim();
      if (priority) {
        const priorityValue = parseFloat(priority);
        if (priorityValue >= 0.0 && priorityValue <= 1.0) {
          urlData.priority = priorityValue;
        } else {
          urlData.issues.push('Priority out of range (0.0-1.0)');
          results.issues.push({
            type: 'warning',
            message: `Invalid priority for ${url}: ${priority} (must be 0.0-1.0)`,
            severity: 'medium'
          });
        }
      }
    }

    return urlData;
  }

  async validateSitemapElement(sitemapElement, results) {
    const locElement = sitemapElement.querySelector('loc');
    if (!locElement) {
      results.issues.push({
        type: 'error',
        message: 'Sitemap element missing required <loc> tag',
        severity: 'high'
      });
      return null;
    }

    const url = locElement.textContent.trim();
    if (!url) {
      results.issues.push({
        type: 'error',
        message: 'Empty sitemap URL in <loc> tag',
        severity: 'high'
      });
      return null;
    }

    const sitemapData = {
      loc: url,
      lastmod: null,
      status: 'unknown'
    };

    // Validate URL format
    try {
      new URL(url);
      sitemapData.status = 'valid';
    } catch (error) {
      sitemapData.status = 'invalid';
      results.issues.push({
        type: 'error',
        message: `Invalid sitemap URL format: ${url}`,
        severity: 'high'
      });
    }

    // Validate lastmod
    const lastmodElement = sitemapElement.querySelector('lastmod');
    if (lastmodElement) {
      const lastmod = lastmodElement.textContent.trim();
      if (lastmod) {
        if (this.isValidDateFormat(lastmod)) {
          sitemapData.lastmod = lastmod;
        } else {
          results.issues.push({
            type: 'warning',
            message: `Invalid lastmod format for sitemap ${url}: ${lastmod}`,
            severity: 'medium'
          });
        }
      }
    }

    return sitemapData;
  }

  validateNamespace(document, results) {
    const rootElement = document.documentElement;
    if (!rootElement) return;

    const expectedNamespace = 'http://www.sitemaps.org/schemas/sitemap/0.9';
    const actualNamespace = rootElement.getAttribute('xmlns');

    if (!actualNamespace) {
      results.issues.push({
        type: 'warning',
        message: 'Missing XML namespace declaration',
        severity: 'medium'
      });
    } else if (actualNamespace !== expectedNamespace) {
      results.issues.push({
        type: 'warning',
        message: `Incorrect namespace: ${actualNamespace} (expected: ${expectedNamespace})`,
        severity: 'medium'
      });
    }
  }

  validateFileSize(content, results) {
    const sizeBytes = Buffer.byteLength(content, 'utf8');

    if (sizeBytes > this.sitemapLimits.maxFileSize) {
      results.issues.push({
        type: 'error',
        message: `Sitemap too large: ${Math.round(sizeBytes / 1024 / 1024)}MB (max: ${this.sitemapLimits.maxFileSize / 1024 / 1024}MB)`,
        severity: 'high'
      });
    }

    results.stats.fileSize = sizeBytes;
  }

  checkRequiredPages(results) {
    const foundUrls = new Set(results.urls.map(url => {
      try {
        return new URL(url.loc).pathname;
      } catch {
        return url.loc;
      }
    }));

    this.requiredPages.forEach(requiredPage => {
      if (!foundUrls.has(requiredPage)) {
        results.issues.push({
          type: 'recommendation',
          message: `Consider including important page: ${requiredPage}`,
          severity: 'low'
        });
      }
    });
  }

  isValidDateFormat(dateString) {
    // Support W3C Datetime formats: YYYY-MM-DD, YYYY-MM-DDTHH:MM:SS, etc.
    const patterns = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, // YYYY-MM-DDTHH:MM:SS
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/, // with timezone
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/ // with Z timezone
    ];

    return patterns.some(pattern => pattern.test(dateString)) && !isNaN(Date.parse(dateString));
  }

  calculateSitemapScore(results) {
    let score = 100;

    // Penalize for errors and warnings
    results.issues.forEach(issue => {
      switch (issue.severity) {
        case 'high':
          score -= 25;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    // Bonus for good practices
    if (results.type === 'urlset') {
      // Bonus for having lastmod dates
      const urlsWithLastmod = results.urls.filter(url => url.lastmod).length;
      if (urlsWithLastmod > 0) {
        score += Math.min(10, (urlsWithLastmod / results.urls.length) * 10);
      }

      // Bonus for using priorities effectively
      const urlsWithPriority = results.urls.filter(url => url.priority !== null).length;
      if (urlsWithPriority > 0) {
        score += Math.min(5, (urlsWithPriority / results.urls.length) * 5);
      }

      // Bonus for reasonable number of URLs
      if (results.urls.length >= 5 && results.urls.length <= 1000) {
        score += 5;
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  async validateFromURL(sitemapUrl) {
    try {
      const response = await fetch(sitemapUrl);

      if (!response.ok) {
        return {
          url: sitemapUrl,
          error: `HTTP ${response.status}: ${response.statusText}`,
          score: 0
        };
      }

      const content = await response.text();
      return await this.validateSitemap(content, sitemapUrl);
    } catch (error) {
      return {
        url: sitemapUrl,
        error: error.message,
        score: 0
      };
    }
  }

  async validateFromFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return await this.validateSitemap(content, filePath);
    } catch (error) {
      return {
        url: filePath,
        error: error.message,
        score: 0
      };
    }
  }

  generateReport(results) {
    const totalUrls = results.reduce((sum, r) => sum + (r.urls?.length || 0), 0);
    const totalIssues = results.reduce((sum, r) => sum + (r.issues?.length || 0), 0);

    return {
      summary: {
        timestamp: new Date().toISOString(),
        totalSitemaps: results.length,
        totalUrls,
        totalIssues,
        averageScore: results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length,
        sitemapTypes: results.map(r => r.type).filter(Boolean),
        validSitemaps: results.filter(r => r.score >= 80).length
      },
      sitemaps: results,
      recommendations: this.generateSitemapRecommendations(results)
    };
  }

  generateSitemapRecommendations(results) {
    const recommendations = [];

    // Check if robots.txt references sitemap
    recommendations.push({
      priority: 'high',
      message: 'Ensure robots.txt includes sitemap location',
      impact: 'Helps search engines discover sitemap automatically'
    });

    // Check for sitemap index if many URLs
    const totalUrls = results.reduce((sum, r) => sum + (r.urls?.length || 0), 0);
    if (totalUrls > 10000) {
      recommendations.push({
        priority: 'medium',
        message: 'Consider using sitemap index for better organization',
        impact: 'Improves sitemap performance and organization'
      });
    }

    // Check for lastmod usage
    const sitemapsWithoutLastmod = results.filter(r =>
      r.urls?.some(url => !url.lastmod)
    ).length;

    if (sitemapsWithoutLastmod > 0) {
      recommendations.push({
        priority: 'medium',
        message: 'Add lastmod dates to URLs for better crawling efficiency',
        impact: 'Helps search engines understand content freshness'
      });
    }

    // Check for priority usage
    const sitemapsWithoutPriority = results.filter(r =>
      r.urls?.some(url => url.priority === null)
    ).length;

    if (sitemapsWithoutPriority > 0) {
      recommendations.push({
        priority: 'low',
        message: 'Consider adding priority values to guide crawling',
        impact: 'Helps search engines understand page importance'
      });
    }

    return recommendations;
  }
}

// CLI interface
async function main() {
  const checker = new SitemapChecker();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node sitemap-checker.js <url|file> [output-file]');
    console.log('Examples:');
    console.log('  node sitemap-checker.js https://kps-interiery.cz/sitemap.xml');
    console.log('  node sitemap-checker.js ./public/sitemap.xml');
    console.log('  node sitemap-checker.js https://kps-interiery.cz/sitemap.xml sitemap-report.json');
    process.exit(1);
  }

  const input = args[0];
  const outputFile = args[1];
  const startTime = performance.now();

  console.log('🔍 Starting sitemap validation...');

  let result;
  if (input.startsWith('http')) {
    result = await checker.validateFromURL(input);
  } else {
    result = await checker.validateFromFile(input);
  }

  const report = checker.generateReport([result]);
  const endTime = performance.now();

  console.log('\n📊 Sitemap Validation Report');
  console.log('=============================');
  console.log(`✅ Score: ${result.score}/100`);
  console.log(`⏱️  Duration: ${Math.round(endTime - startTime)}ms`);
  console.log(`📄 Sitemap: ${result.url}`);

  if (result.error) {
    console.log(`❌ Error: ${result.error}`);
  } else {
    console.log(`📋 Type: ${result.type || 'unknown'}`);

    if (result.type === 'urlset') {
      console.log(`🔗 URLs: ${result.urls?.length || 0}`);
      console.log(`📊 Valid URLs: ${result.stats?.validUrls || 0}`);
      console.log(`⚠️  Invalid URLs: ${result.stats?.invalidUrls || 0}`);
      console.log(`🎯 Average Priority: ${(result.stats?.avgPriority || 0).toFixed(2)}`);
    } else if (result.type === 'index') {
      console.log(`📁 Nested Sitemaps: ${result.sitemaps?.length || 0}`);
    }

    console.log(`⚠️  Issues: ${result.issues?.length || 0}`);

    if (result.issues && result.issues.length > 0) {
      console.log('\n🚨 Issues Found:');
      result.issues.forEach(issue => {
        const icon = issue.severity === 'high' ? '❌' : issue.severity === 'medium' ? '⚠️' : '💡';
        console.log(`${icon} ${issue.message}`);
      });
    }

    if (result.urls && result.urls.length > 0) {
      console.log('\n🌐 Sample URLs:');
      result.urls.slice(0, 5).forEach(url => {
        const status = url.status === 'valid' ? '✅' : '❌';
        console.log(`  ${status} ${url.loc}`);
        if (url.issues.length > 0) {
          url.issues.forEach(issue => console.log(`     • ${issue}`));
        }
      });

      if (result.urls.length > 5) {
        console.log(`  ... and ${result.urls.length - 5} more URLs`);
      }
    }

    if (result.sitemaps && result.sitemaps.length > 0) {
      console.log('\n📁 Nested Sitemaps:');
      result.sitemaps.forEach(sitemap => {
        const status = sitemap.status === 'valid' ? '✅' : '❌';
        console.log(`  ${status} ${sitemap.loc}`);
      });
    }
  }

  if (outputFile) {
    await fs.writeFile(outputFile, JSON.stringify(report, null, 2));
    console.log(`\n💾 Report saved to: ${outputFile}`);
  }

  process.exit(result.score >= 80 ? 0 : 1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { SitemapChecker };