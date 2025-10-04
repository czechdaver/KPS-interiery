#!/usr/bin/env node
/**
 * Comprehensive SEO Audit Script for KPS Interiéry
 * Combines all validators for complete SEO analysis
 */

import { MetaValidator } from './meta-validator.js';
import { SchemaValidator } from './schema-validator.js';
import { SitemapChecker } from './sitemap-checker.js';
import { SocialPreviewTester } from './social-preview-tester.js';
import fs from 'fs/promises';
import { performance } from 'perf_hooks';

class SEOAudit {
  constructor(options = {}) {
    this.options = {
      includePerformance: true,
      includeAccessibility: true,
      includeSecurity: true,
      verbose: false,
      ...options
    };

    this.metaValidator = new MetaValidator();
    this.schemaValidator = new SchemaValidator();
    this.sitemapChecker = new SitemapChecker();
    this.socialTester = new SocialPreviewTester();

    this.results = {
      meta: null,
      schema: null,
      sitemap: null,
      social: null,
      performance: null,
      accessibility: null,
      security: null,
      overall: {
        score: 0,
        grade: 'F',
        issues: [],
        recommendations: []
      }
    };
  }

  /**
   * Run comprehensive SEO audit on a URL
   */
  async auditURL(url, options = {}) {
    console.log(`🔍 Starting comprehensive SEO audit for: ${url}`);
    const startTime = performance.now();

    const auditResults = {
      url,
      timestamp: new Date().toISOString(),
      meta: null,
      schema: null,
      sitemap: null,
      social: null,
      performance: null,
      accessibility: null,
      security: null,
      overall: {
        score: 0,
        grade: 'F',
        issues: [],
        recommendations: []
      }
    };

    try {
      // Fetch page content
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const html = await response.text();

      // Run all audits in parallel for performance
      console.log('📋 Running meta tags validation...');
      const metaPromise = this.metaValidator.validateHTML(html, url);

      console.log('🏷️  Running schema markup validation...');
      const schemaPromise = this.schemaValidator.validateHTML(html, url);

      console.log('📱 Running social media preview testing...');
      const socialPromise = this.socialTester.testHTML(html, url);

      // Wait for all validations to complete
      const [metaResult, schemaResult, socialResult] = await Promise.all([
        metaPromise,
        schemaPromise,
        socialPromise
      ]);

      auditResults.meta = metaResult;
      auditResults.schema = schemaResult;
      auditResults.social = socialResult;

      // Check for sitemap
      console.log('🗺️  Checking sitemap...');
      try {
        const sitemapUrl = new URL('/sitemap.xml', url).href;
        const sitemapResult = await this.sitemapChecker.validateFromURL(sitemapUrl);
        auditResults.sitemap = sitemapResult;
      } catch (error) {
        console.log('⚠️  Sitemap not found or invalid');
        auditResults.sitemap = {
          url: new URL('/sitemap.xml', url).href,
          error: 'Sitemap not found',
          score: 0
        };
      }

      // Additional checks if enabled
      if (this.options.includePerformance) {
        console.log('⚡ Running performance checks...');
        auditResults.performance = await this.checkPerformance(html, url);
      }

      if (this.options.includeAccessibility) {
        console.log('♿ Running accessibility checks...');
        auditResults.accessibility = await this.checkAccessibility(html, url);
      }

      if (this.options.includeSecurity) {
        console.log('🔒 Running security checks...');
        auditResults.security = await this.checkSecurity(html, url);
      }

      // Calculate overall score and recommendations
      auditResults.overall = this.calculateOverallScore(auditResults);

      const endTime = performance.now();
      console.log(`✅ Audit completed in ${Math.round(endTime - startTime)}ms`);

    } catch (error) {
      console.error(`❌ Audit failed: ${error.message}`);
      auditResults.error = error.message;
    }

    return auditResults;
  }

  /**
   * Run audit on local file
   */
  async auditFile(filePath) {
    console.log(`🔍 Starting comprehensive SEO audit for file: ${filePath}`);
    const startTime = performance.now();

    try {
      const html = await fs.readFile(filePath, 'utf-8');

      const auditResults = {
        url: filePath,
        timestamp: new Date().toISOString(),
        meta: await this.metaValidator.validateHTML(html, filePath),
        schema: await this.schemaValidator.validateHTML(html, filePath),
        social: await this.socialTester.testHTML(html, filePath),
        performance: this.options.includePerformance ? await this.checkPerformance(html, filePath) : null,
        accessibility: this.options.includeAccessibility ? await this.checkAccessibility(html, filePath) : null,
        security: this.options.includeSecurity ? await this.checkSecurity(html, filePath) : null,
        overall: null
      };

      auditResults.overall = this.calculateOverallScore(auditResults);

      const endTime = performance.now();
      console.log(`✅ Audit completed in ${Math.round(endTime - startTime)}ms`);

      return auditResults;
    } catch (error) {
      console.error(`❌ Audit failed: ${error.message}`);
      return {
        url: filePath,
        error: error.message,
        overall: { score: 0, grade: 'F' }
      };
    }
  }

  /**
   * Check performance-related SEO factors
   */
  async checkPerformance(html, url) {
    const issues = [];
    const score = { value: 100 };

    // Check for render-blocking resources
    const renderBlockingRegex = /<link[^>]+stylesheet[^>]*>(?![\s\S]*media\s*=\s*["'](?:print|speech)["'])/gi;
    const stylesheets = html.match(renderBlockingRegex) || [];

    if (stylesheets.length > 3) {
      issues.push({
        type: 'warning',
        category: 'performance',
        message: `${stylesheets.length} potentially render-blocking stylesheets found`,
        impact: 'May slow down page load',
        severity: 'medium'
      });
      score.value -= 10;
    }

    // Check for inline scripts
    const inlineScripts = html.match(/<script(?![^>]*src)[^>]*>[\s\S]*?<\/script>/gi) || [];
    if (inlineScripts.length > 5) {
      issues.push({
        type: 'warning',
        category: 'performance',
        message: `${inlineScripts.length} inline scripts found`,
        impact: 'May affect page load performance',
        severity: 'medium'
      });
      score.value -= 5;
    }

    // Check for image optimization
    const images = html.match(/<img[^>]+>/gi) || [];
    let unoptimizedImages = 0;

    images.forEach(img => {
      if (!img.includes('loading="lazy"') && !img.includes('loading=lazy')) {
        unoptimizedImages++;
      }
    });

    if (unoptimizedImages > 0) {
      issues.push({
        type: 'recommendation',
        category: 'performance',
        message: `${unoptimizedImages} images without lazy loading`,
        impact: 'Consider adding lazy loading for better performance',
        severity: 'low'
      });
      score.value -= 5;
    }

    // Check for CDN usage
    if (!html.includes('cdn.') && !html.includes('.cloudfront.') && !html.includes('.fastly.')) {
      issues.push({
        type: 'recommendation',
        category: 'performance',
        message: 'Consider using a CDN for static assets',
        impact: 'Can improve global loading times',
        severity: 'low'
      });
      score.value -= 5;
    }

    // Check for compression hints
    if (!html.includes('gzip') && !html.includes('brotli')) {
      issues.push({
        type: 'recommendation',
        category: 'performance',
        message: 'Consider enabling compression (gzip/brotli)',
        impact: 'Can reduce transfer size significantly',
        severity: 'medium'
      });
      score.value -= 10;
    }

    return {
      score: Math.max(0, score.value),
      issues,
      recommendations: [
        'Minimize render-blocking resources',
        'Optimize images with proper formats (WebP, AVIF)',
        'Use lazy loading for images',
        'Enable text compression',
        'Leverage browser caching'
      ]
    };
  }

  /**
   * Check accessibility-related SEO factors
   */
  async checkAccessibility(html, url) {
    const issues = [];
    const score = { value: 100 };

    // Check for missing alt attributes
    const imagesWithoutAlt = html.match(/<img(?![^>]*alt\s*=)[^>]*>/gi) || [];
    if (imagesWithoutAlt.length > 0) {
      issues.push({
        type: 'error',
        category: 'accessibility',
        message: `${imagesWithoutAlt.length} images missing alt attributes`,
        impact: 'Affects screen readers and SEO',
        severity: 'high'
      });
      score.value -= 15;
    }

    // Check for proper heading hierarchy
    const headings = html.match(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi) || [];
    const headingLevels = headings.map(h => parseInt(h.match(/h([1-6])/)[1]));

    if (!headingLevels.includes(1)) {
      issues.push({
        type: 'error',
        category: 'accessibility',
        message: 'Missing H1 heading',
        impact: 'Important for document structure and SEO',
        severity: 'high'
      });
      score.value -= 20;
    }

    // Check for color contrast (basic check)
    const lightBackgrounds = html.match(/background-color\s*:\s*#(?:fff|ffffff|f{3,6})/gi);
    const lightText = html.match(/color\s*:\s*#(?:fff|ffffff|f{3,6})/gi);

    if (lightBackgrounds && lightText) {
      issues.push({
        type: 'warning',
        category: 'accessibility',
        message: 'Potential color contrast issues detected',
        impact: 'May affect readability',
        severity: 'medium'
      });
      score.value -= 10;
    }

    // Check for form labels
    const inputs = html.match(/<input[^>]*>/gi) || [];
    const labels = html.match(/<label[^>]*>/gi) || [];

    if (inputs.length > labels.length) {
      issues.push({
        type: 'warning',
        category: 'accessibility',
        message: 'Some form inputs may lack proper labels',
        impact: 'Affects form accessibility',
        severity: 'medium'
      });
      score.value -= 10;
    }

    // Check for language declaration
    if (!html.includes('lang=') && !html.includes('<html lang')) {
      issues.push({
        type: 'warning',
        category: 'accessibility',
        message: 'Missing language declaration in HTML',
        impact: 'Affects screen readers and SEO',
        severity: 'medium'
      });
      score.value -= 10;
    }

    return {
      score: Math.max(0, score.value),
      issues,
      recommendations: [
        'Add alt attributes to all images',
        'Maintain proper heading hierarchy (H1-H6)',
        'Ensure sufficient color contrast (4.5:1 minimum)',
        'Associate form labels with inputs',
        'Add language declarations'
      ]
    };
  }

  /**
   * Check security-related SEO factors
   */
  async checkSecurity(html, url) {
    const issues = [];
    const score = { value: 100 };

    try {
      const urlObj = new URL(url);

      // Check for HTTPS
      if (urlObj.protocol !== 'https:') {
        issues.push({
          type: 'error',
          category: 'security',
          message: 'Site not using HTTPS',
          impact: 'Major SEO penalty and security risk',
          severity: 'high'
        });
        score.value -= 30;
      }

      // Check for mixed content
      const httpLinks = html.match(/(?:src|href)\s*=\s*["']http:\/\/[^"']+["']/gi) || [];
      if (httpLinks.length > 0 && urlObj.protocol === 'https:') {
        issues.push({
          type: 'warning',
          category: 'security',
          message: `${httpLinks.length} mixed content resources found`,
          impact: 'May cause security warnings',
          severity: 'medium'
        });
        score.value -= 15;
      }

      // Check for security headers (in meta tags)
      const hasCSP = html.includes('Content-Security-Policy');
      if (!hasCSP) {
        issues.push({
          type: 'recommendation',
          category: 'security',
          message: 'Consider adding Content Security Policy',
          impact: 'Improves security against XSS attacks',
          severity: 'low'
        });
        score.value -= 5;
      }

      // Check for external script domains
      const externalScripts = html.match(/<script[^>]+src\s*=\s*["'](?:https?:)?\/\/([^/"']+)[^"']*["']/gi) || [];
      const domains = new Set();

      externalScripts.forEach(script => {
        const match = script.match(/\/\/([^/"']+)/);
        if (match) domains.add(match[1]);
      });

      if (domains.size > 5) {
        issues.push({
          type: 'warning',
          category: 'security',
          message: `Loading scripts from ${domains.size} external domains`,
          impact: 'Increases security risk and potential privacy concerns',
          severity: 'medium'
        });
        score.value -= 10;
      }

      // Check for inline event handlers
      const inlineEvents = html.match(/on\w+\s*=\s*["'][^"']*["']/gi) || [];
      if (inlineEvents.length > 0) {
        issues.push({
          type: 'warning',
          category: 'security',
          message: `${inlineEvents.length} inline event handlers found`,
          impact: 'May pose XSS risks',
          severity: 'medium'
        });
        score.value -= 10;
      }

    } catch (error) {
      issues.push({
        type: 'error',
        category: 'security',
        message: `Security check failed: ${error.message}`,
        severity: 'high'
      });
    }

    return {
      score: Math.max(0, score.value),
      issues,
      recommendations: [
        'Always use HTTPS',
        'Implement Content Security Policy',
        'Avoid mixed content',
        'Minimize external script domains',
        'Use modern security headers'
      ]
    };
  }

  /**
   * Calculate overall SEO score and grade
   */
  calculateOverallScore(results) {
    const weights = {
      meta: 0.25,
      schema: 0.20,
      social: 0.15,
      sitemap: 0.15,
      performance: 0.10,
      accessibility: 0.10,
      security: 0.05
    };

    let totalScore = 0;
    let totalWeight = 0;
    const allIssues = [];
    const allRecommendations = [];

    // Calculate weighted score
    Object.keys(weights).forEach(category => {
      const result = results[category];
      if (result && result.score !== undefined) {
        totalScore += result.score * weights[category];
        totalWeight += weights[category];

        // Collect issues
        if (result.issues) {
          allIssues.push(...result.issues.map(issue => ({
            ...issue,
            category: category
          })));
        }

        // Collect recommendations
        if (result.recommendations) {
          allRecommendations.push(...result.recommendations.map(rec => ({
            category: category,
            message: typeof rec === 'string' ? rec : rec.message,
            priority: typeof rec === 'object' ? rec.priority : 'medium'
          })));
        }
      }
    });

    const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;

    let grade = 'F';
    if (finalScore >= 90) grade = 'A+';
    else if (finalScore >= 85) grade = 'A';
    else if (finalScore >= 80) grade = 'A-';
    else if (finalScore >= 75) grade = 'B+';
    else if (finalScore >= 70) grade = 'B';
    else if (finalScore >= 65) grade = 'B-';
    else if (finalScore >= 60) grade = 'C+';
    else if (finalScore >= 55) grade = 'C';
    else if (finalScore >= 50) grade = 'C-';
    else if (finalScore >= 40) grade = 'D';

    // Sort issues by severity
    allIssues.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
    });

    // Sort recommendations by priority
    allRecommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    });

    return {
      score: finalScore,
      grade,
      issues: allIssues,
      recommendations: allRecommendations.slice(0, 10), // Top 10 recommendations
      breakdown: Object.keys(weights).reduce((acc, category) => {
        const result = results[category];
        acc[category] = {
          score: result?.score || 0,
          weight: weights[category],
          contribution: result?.score ? (result.score * weights[category]) : 0
        };
        return acc;
      }, {})
    };
  }

  /**
   * Generate comprehensive audit report
   */
  generateReport(auditResults) {
    return {
      summary: {
        url: auditResults.url,
        timestamp: auditResults.timestamp,
        overall: auditResults.overall,
        duration: auditResults.duration,
        checkedComponents: Object.keys(auditResults).filter(key =>
          auditResults[key] && typeof auditResults[key] === 'object' && auditResults[key].score !== undefined
        )
      },
      details: {
        meta: auditResults.meta,
        schema: auditResults.schema,
        social: auditResults.social,
        sitemap: auditResults.sitemap,
        performance: auditResults.performance,
        accessibility: auditResults.accessibility,
        security: auditResults.security
      },
      actionItems: this.generateActionItems(auditResults),
      testingUrls: {
        googlePageSpeed: `https://pagespeed.web.dev/report?url=${encodeURIComponent(auditResults.url)}`,
        googleRichResults: `https://search.google.com/test/rich-results?url=${encodeURIComponent(auditResults.url)}`,
        facebookDebugger: `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(auditResults.url)}`,
        twitterValidator: `https://cards-dev.twitter.com/validator?url=${encodeURIComponent(auditResults.url)}`,
        linkedinInspector: `https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(auditResults.url)}`
      }
    };
  }

  generateActionItems(results) {
    const actionItems = [];

    // High priority fixes
    const highPriorityIssues = results.overall?.issues?.filter(issue => issue.severity === 'high') || [];
    if (highPriorityIssues.length > 0) {
      actionItems.push({
        priority: 'URGENT',
        title: 'Fix Critical SEO Issues',
        items: highPriorityIssues.map(issue => issue.message),
        impact: 'Major impact on SEO performance'
      });
    }

    // Medium priority improvements
    const mediumPriorityIssues = results.overall?.issues?.filter(issue => issue.severity === 'medium') || [];
    if (mediumPriorityIssues.length > 0) {
      actionItems.push({
        priority: 'HIGH',
        title: 'Address Important SEO Improvements',
        items: mediumPriorityIssues.slice(0, 5).map(issue => issue.message),
        impact: 'Moderate impact on SEO performance'
      });
    }

    // Schema markup improvements
    if (results.schema && results.schema.score < 80) {
      actionItems.push({
        priority: 'MEDIUM',
        title: 'Improve Structured Data',
        items: [
          'Add missing schema markup types',
          'Fix schema validation errors',
          'Include more detailed business information'
        ],
        impact: 'Better rich snippets in search results'
      });
    }

    // Social media optimization
    if (results.social && results.social.score < 75) {
      actionItems.push({
        priority: 'MEDIUM',
        title: 'Optimize Social Media Sharing',
        items: [
          'Add missing Open Graph images',
          'Optimize title and description lengths',
          'Add Twitter Card support'
        ],
        impact: 'Better social media engagement'
      });
    }

    return actionItems;
  }
}

// CLI interface
async function main() {
  const audit = new SEOAudit({
    includePerformance: true,
    includeAccessibility: true,
    includeSecurity: true,
    verbose: true
  });

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node seo-audit.js <url|file> [output-file] [--options]');
    console.log('');
    console.log('Examples:');
    console.log('  node seo-audit.js https://kps-interiery.cz');
    console.log('  node seo-audit.js ./dist/index.html');
    console.log('  node seo-audit.js https://kps-interiery.cz audit-report.json');
    console.log('  node seo-audit.js https://kps-interiery.cz --no-performance');
    console.log('');
    console.log('Options:');
    console.log('  --no-performance    Skip performance checks');
    console.log('  --no-accessibility  Skip accessibility checks');
    console.log('  --no-security      Skip security checks');
    console.log('  --verbose          Show detailed output');
    process.exit(1);
  }

  const input = args[0];
  const outputFile = args.find(arg => arg.endsWith('.json'));
  const options = {
    includePerformance: !args.includes('--no-performance'),
    includeAccessibility: !args.includes('--no-accessibility'),
    includeSecurity: !args.includes('--no-security'),
    verbose: args.includes('--verbose')
  };

  const auditInstance = new SEOAudit(options);
  const startTime = performance.now();

  let result;
  if (input.startsWith('http')) {
    result = await auditInstance.auditURL(input);
  } else {
    result = await auditInstance.auditFile(input);
  }

  const endTime = performance.now();
  const report = auditInstance.generateReport(result);

  // Display results
  console.log('\n' + '='.repeat(60));
  console.log('📊 COMPREHENSIVE SEO AUDIT REPORT');
  console.log('='.repeat(60));
  console.log(`🌐 URL/File: ${result.url}`);
  console.log(`⏱️  Duration: ${Math.round(endTime - startTime)}ms`);
  console.log(`📅 Date: ${new Date().toLocaleDateString()}`);

  if (result.error) {
    console.log(`❌ Error: ${result.error}`);
    process.exit(1);
  }

  console.log('\n🎯 OVERALL SCORE');
  console.log('================');
  const scoreColor = result.overall.score >= 80 ? '🟢' : result.overall.score >= 60 ? '🟡' : '🔴';
  console.log(`${scoreColor} Score: ${result.overall.score}/100 (Grade: ${result.overall.grade})`);

  console.log('\n📋 COMPONENT SCORES');
  console.log('==================');
  if (result.meta) console.log(`📝 Meta Tags: ${result.meta.score}/100`);
  if (result.schema) console.log(`🏷️  Schema Markup: ${result.schema.score}/100`);
  if (result.social) console.log(`📱 Social Media: ${result.social.score}/100`);
  if (result.sitemap) console.log(`🗺️  Sitemap: ${result.sitemap.score}/100`);
  if (result.performance) console.log(`⚡ Performance: ${result.performance.score}/100`);
  if (result.accessibility) console.log(`♿ Accessibility: ${result.accessibility.score}/100`);
  if (result.security) console.log(`🔒 Security: ${result.security.score}/100`);

  // Show critical issues
  const criticalIssues = result.overall.issues.filter(issue => issue.severity === 'high');
  if (criticalIssues.length > 0) {
    console.log('\n🚨 CRITICAL ISSUES (Fix Immediately)');
    console.log('====================================');
    criticalIssues.forEach((issue, index) => {
      console.log(`${index + 1}. ❌ ${issue.message}`);
      if (issue.impact) console.log(`   Impact: ${issue.impact}`);
    });
  }

  // Show top recommendations
  const topRecommendations = result.overall.recommendations.slice(0, 5);
  if (topRecommendations.length > 0) {
    console.log('\n💡 TOP RECOMMENDATIONS');
    console.log('======================');
    topRecommendations.forEach((rec, index) => {
      console.log(`${index + 1}. 💡 ${rec.message || rec}`);
    });
  }

  // Show testing URLs
  console.log('\n🔧 EXTERNAL VALIDATION TOOLS');
  console.log('============================');
  Object.entries(report.testingUrls).forEach(([tool, url]) => {
    const toolNames = {
      googlePageSpeed: 'Google PageSpeed Insights',
      googleRichResults: 'Google Rich Results Test',
      facebookDebugger: 'Facebook Sharing Debugger',
      twitterValidator: 'Twitter Card Validator',
      linkedinInspector: 'LinkedIn Post Inspector'
    };
    console.log(`📊 ${toolNames[tool]}: ${url}`);
  });

  // Save report if requested
  if (outputFile) {
    await fs.writeFile(outputFile, JSON.stringify(report, null, 2));
    console.log(`\n💾 Detailed report saved to: ${outputFile}`);
  }

  // Set exit code based on score
  const exitCode = result.overall.score >= 70 ? 0 : 1;
  console.log(`\n${exitCode === 0 ? '✅' : '❌'} Audit ${exitCode === 0 ? 'PASSED' : 'FAILED'} (Score: ${result.overall.score}/100)`);

  process.exit(exitCode);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { SEOAudit };