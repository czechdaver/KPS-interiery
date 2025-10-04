#!/usr/bin/env node
/**
 * SEO Meta Tags Validator for KPS Interiéry
 * Validates completeness and quality of meta tags across the site
 */

import { JSDOM } from 'jsdom';
import fs from 'fs/promises';
import path from 'path';
import { performance } from 'perf_hooks';

class MetaValidator {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      errors: [],
      warnings: [],
      recommendations: []
    };

    this.requiredMetaTags = [
      'title',
      'description',
      'viewport',
      'robots',
      'og:title',
      'og:description',
      'og:type',
      'og:locale'
    ];

    this.optionalMetaTags = [
      'keywords',
      'author',
      'og:image',
      'og:url',
      'og:site_name',
      'twitter:card',
      'twitter:title',
      'twitter:description',
      'twitter:image',
      'canonical'
    ];

    this.metaLimits = {
      title: { min: 30, max: 60 },
      description: { min: 120, max: 160 },
      'og:title': { min: 30, max: 60 },
      'og:description': { min: 120, max: 160 },
      keywords: { max: 255 }
    };
  }

  /**
   * Validate HTML content for meta tags
   */
  async validateHTML(html, url = 'unknown') {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const pageResults = {
      url,
      title: null,
      metaTags: {},
      linkTags: {},
      issues: [],
      score: 0
    };

    // Extract title
    const titleElement = document.querySelector('title');
    if (titleElement) {
      pageResults.title = titleElement.textContent.trim();
    }

    // Extract meta tags
    const metaTags = document.querySelectorAll('meta');
    metaTags.forEach(meta => {
      const name = meta.getAttribute('name') || meta.getAttribute('property');
      const content = meta.getAttribute('content');
      if (name && content) {
        pageResults.metaTags[name] = content;
      }
    });

    // Extract link tags
    const linkTags = document.querySelectorAll('link');
    linkTags.forEach(link => {
      const rel = link.getAttribute('rel');
      const href = link.getAttribute('href');
      if (rel && href) {
        pageResults.linkTags[rel] = href;
      }
    });

    // Validate required meta tags
    this.validateRequiredTags(pageResults);

    // Validate meta tag quality
    this.validateMetaQuality(pageResults);

    // Check for duplicates
    this.validateDuplicates(pageResults);

    // Calculate score
    pageResults.score = this.calculateScore(pageResults);

    return pageResults;
  }

  validateRequiredTags(pageResults) {
    this.requiredMetaTags.forEach(tag => {
      let found = false;
      let content = '';

      if (tag === 'title') {
        found = !!pageResults.title;
        content = pageResults.title || '';
      } else if (tag === 'canonical') {
        found = !!pageResults.linkTags.canonical;
        content = pageResults.linkTags.canonical || '';
      } else {
        found = !!pageResults.metaTags[tag];
        content = pageResults.metaTags[tag] || '';
      }

      if (!found) {
        pageResults.issues.push({
          type: 'error',
          tag,
          message: `Missing required ${tag} tag`,
          severity: 'high'
        });
        this.results.failed++;
      } else if (!content.trim()) {
        pageResults.issues.push({
          type: 'error',
          tag,
          message: `Empty ${tag} tag`,
          severity: 'high'
        });
        this.results.failed++;
      } else {
        this.results.passed++;
      }
    });
  }

  validateMetaQuality(pageResults) {
    // Validate title
    if (pageResults.title) {
      this.validateLength('title', pageResults.title, pageResults);

      // Check for brand name
      if (!pageResults.title.includes('KPS Interiéry')) {
        pageResults.issues.push({
          type: 'warning',
          tag: 'title',
          message: 'Title should include brand name "KPS Interiéry"',
          severity: 'medium'
        });
      }
    }

    // Validate description
    if (pageResults.metaTags.description) {
      this.validateLength('description', pageResults.metaTags.description, pageResults);

      // Check for call-to-action
      const cta_keywords = ['volejte', 'kontaktujte', 'objednejte', 'navštivte'];
      const hasCallToAction = cta_keywords.some(keyword =>
        pageResults.metaTags.description.toLowerCase().includes(keyword)
      );

      if (!hasCallToAction) {
        pageResults.issues.push({
          type: 'recommendation',
          tag: 'description',
          message: 'Consider adding a call-to-action in meta description',
          severity: 'low'
        });
      }
    }

    // Validate Open Graph
    if (pageResults.metaTags['og:title']) {
      this.validateLength('og:title', pageResults.metaTags['og:title'], pageResults);
    }

    if (pageResults.metaTags['og:description']) {
      this.validateLength('og:description', pageResults.metaTags['og:description'], pageResults);
    }

    // Check for Open Graph image
    if (!pageResults.metaTags['og:image']) {
      pageResults.issues.push({
        type: 'warning',
        tag: 'og:image',
        message: 'Missing Open Graph image for better social media sharing',
        severity: 'medium'
      });
    }

    // Validate robots tag
    if (pageResults.metaTags.robots) {
      const robotsContent = pageResults.metaTags.robots.toLowerCase();
      if (robotsContent.includes('noindex') || robotsContent.includes('nofollow')) {
        pageResults.issues.push({
          type: 'warning',
          tag: 'robots',
          message: 'Page has restrictive robots directives',
          severity: 'high'
        });
      }
    }
  }

  validateLength(tag, content, pageResults) {
    const limits = this.metaLimits[tag];
    if (!limits) return;

    const length = content.length;

    if (limits.min && length < limits.min) {
      pageResults.issues.push({
        type: 'warning',
        tag,
        message: `${tag} too short (${length} chars, recommended ${limits.min}-${limits.max})`,
        severity: 'medium'
      });
    }

    if (limits.max && length > limits.max) {
      pageResults.issues.push({
        type: 'warning',
        tag,
        message: `${tag} too long (${length} chars, recommended ${limits.min || 0}-${limits.max})`,
        severity: 'medium'
      });
    }
  }

  validateDuplicates(pageResults) {
    const seenTags = new Set();
    const duplicates = [];

    Object.keys(pageResults.metaTags).forEach(tag => {
      if (seenTags.has(tag)) {
        duplicates.push(tag);
      }
      seenTags.add(tag);
    });

    if (duplicates.length > 0) {
      pageResults.issues.push({
        type: 'error',
        tag: 'duplicate',
        message: `Duplicate meta tags found: ${duplicates.join(', ')}`,
        severity: 'high'
      });
    }
  }

  calculateScore(pageResults) {
    let score = 100;

    pageResults.issues.forEach(issue => {
      switch (issue.severity) {
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    return Math.max(0, score);
  }

  async validateURL(url) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      return await this.validateHTML(html, url);
    } catch (error) {
      return {
        url,
        error: error.message,
        score: 0
      };
    }
  }

  async validateFile(filePath) {
    try {
      const html = await fs.readFile(filePath, 'utf-8');
      return await this.validateHTML(html, filePath);
    } catch (error) {
      return {
        url: filePath,
        error: error.message,
        score: 0
      };
    }
  }

  generateReport(results) {
    const report = {
      summary: {
        timestamp: new Date().toISOString(),
        totalPages: results.length,
        averageScore: results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length,
        passed: results.filter(r => r.score >= 80).length,
        failed: results.filter(r => r.score < 60).length,
        warnings: results.filter(r => r.score >= 60 && r.score < 80).length
      },
      pages: results,
      recommendations: this.generateRecommendations(results)
    };

    return report;
  }

  generateRecommendations(results) {
    const recommendations = [];
    const allIssues = results.flatMap(r => r.issues || []);

    // Group issues by type
    const issuesByType = {};
    allIssues.forEach(issue => {
      if (!issuesByType[issue.tag]) {
        issuesByType[issue.tag] = [];
      }
      issuesByType[issue.tag].push(issue);
    });

    // Generate recommendations based on common issues
    Object.entries(issuesByType).forEach(([tag, issues]) => {
      if (issues.length > 1) {
        recommendations.push({
          priority: 'high',
          tag,
          message: `Fix ${tag} issues across ${issues.length} pages`,
          count: issues.length
        });
      }
    });

    // General recommendations
    if (results.some(r => !r.metaTags || !r.metaTags['og:image'])) {
      recommendations.push({
        priority: 'medium',
        tag: 'og:image',
        message: 'Add Open Graph images for better social media sharing',
        count: results.filter(r => !r.metaTags || !r.metaTags['og:image']).length
      });
    }

    return recommendations;
  }
}

// CLI interface
async function main() {
  const validator = new MetaValidator();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node meta-validator.js <url|file> [output-file]');
    console.log('Examples:');
    console.log('  node meta-validator.js https://kps-interiery.cz');
    console.log('  node meta-validator.js ./dist/index.html');
    console.log('  node meta-validator.js https://kps-interiery.cz report.json');
    process.exit(1);
  }

  const input = args[0];
  const outputFile = args[1];
  const startTime = performance.now();

  console.log('🔍 Starting SEO meta validation...');

  let result;
  if (input.startsWith('http')) {
    result = await validator.validateURL(input);
  } else {
    result = await validator.validateFile(input);
  }

  const report = validator.generateReport([result]);
  const endTime = performance.now();

  console.log('\n📊 SEO Meta Validation Report');
  console.log('================================');
  console.log(`✅ Score: ${result.score}/100`);
  console.log(`⏱️  Duration: ${Math.round(endTime - startTime)}ms`);
  console.log(`📄 URL/File: ${result.url}`);

  if (result.error) {
    console.log(`❌ Error: ${result.error}`);
  } else {
    console.log(`\n📋 Issues Found: ${result.issues?.length || 0}`);

    if (result.issues && result.issues.length > 0) {
      result.issues.forEach(issue => {
        const icon = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : '💡';
        console.log(`${icon} ${issue.tag}: ${issue.message}`);
      });
    }

    console.log('\n🎯 Meta Tags Found:');
    if (result.title) {
      console.log(`  Title: "${result.title}" (${result.title.length} chars)`);
    }
    if (result.metaTags) {
      Object.entries(result.metaTags).forEach(([name, content]) => {
        console.log(`  ${name}: "${content}" (${content.length} chars)`);
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

export { MetaValidator };