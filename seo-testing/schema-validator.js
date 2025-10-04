#!/usr/bin/env node
/**
 * Schema Markup Validator for KPS Interiéry
 * Validates structured data (JSON-LD, Microdata, RDFa) for SEO
 */

import { JSDOM } from 'jsdom';
import fs from 'fs/promises';
import { performance } from 'perf_hooks';

class SchemaValidator {
  constructor() {
    this.results = {
      schemas: [],
      errors: [],
      warnings: [],
      recommendations: []
    };

    // Expected schema types for a furniture/interior design business
    this.expectedSchemas = [
      'Organization',
      'LocalBusiness',
      'Product',
      'Service',
      'WebSite',
      'WebPage',
      'BreadcrumbList'
    ];

    this.requiredProperties = {
      'Organization': ['name', 'url', 'logo'],
      'LocalBusiness': ['name', 'address', 'telephone', 'openingHours'],
      'Product': ['name', 'description', 'brand'],
      'Service': ['name', 'description', 'provider'],
      'WebSite': ['name', 'url'],
      'WebPage': ['name', 'description', 'url'],
      'BreadcrumbList': ['itemListElement']
    };
  }

  /**
   * Extract and validate all schema markup from HTML
   */
  async validateHTML(html, url = 'unknown') {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const pageResults = {
      url,
      schemas: [],
      issues: [],
      score: 0,
      coverage: {}
    };

    // Extract JSON-LD schemas
    const jsonLdSchemas = this.extractJsonLd(document);
    pageResults.schemas.push(...jsonLdSchemas);

    // Extract Microdata schemas
    const microdataSchemas = this.extractMicrodata(document);
    pageResults.schemas.push(...microdataSchemas);

    // Extract RDFa schemas
    const rdfaSchemas = this.extractRdfa(document);
    pageResults.schemas.push(...rdfaSchemas);

    // Validate each schema
    pageResults.schemas.forEach(schema => {
      this.validateSchema(schema, pageResults);
    });

    // Check coverage
    this.checkSchemaCoverage(pageResults);

    // Calculate score
    pageResults.score = this.calculateSchemaScore(pageResults);

    return pageResults;
  }

  extractJsonLd(document) {
    const schemas = [];
    const jsonLdElements = document.querySelectorAll('script[type="application/ld+json"]');

    jsonLdElements.forEach((element, index) => {
      try {
        const content = element.textContent.trim();
        if (content) {
          const data = JSON.parse(content);
          schemas.push({
            type: 'JSON-LD',
            index,
            data: Array.isArray(data) ? data : [data],
            raw: content
          });
        }
      } catch (error) {
        schemas.push({
          type: 'JSON-LD',
          index,
          error: `Invalid JSON: ${error.message}`,
          raw: element.textContent
        });
      }
    });

    return schemas;
  }

  extractMicrodata(document) {
    const schemas = [];
    const microdataElements = document.querySelectorAll('[itemscope]');

    microdataElements.forEach((element, index) => {
      const itemType = element.getAttribute('itemtype');
      if (itemType) {
        const data = this.extractMicrodataProperties(element);
        schemas.push({
          type: 'Microdata',
          index,
          itemType,
          data,
          element: element.outerHTML.substring(0, 200) + '...'
        });
      }
    });

    return schemas;
  }

  extractMicrodataProperties(element) {
    const properties = {};
    const propElements = element.querySelectorAll('[itemprop]');

    propElements.forEach(propElement => {
      const propName = propElement.getAttribute('itemprop');
      let propValue;

      if (propElement.tagName === 'META') {
        propValue = propElement.getAttribute('content');
      } else if (propElement.tagName === 'A' || propElement.tagName === 'LINK') {
        propValue = propElement.getAttribute('href');
      } else if (propElement.tagName === 'IMG') {
        propValue = propElement.getAttribute('src');
      } else {
        propValue = propElement.textContent.trim();
      }

      if (propName && propValue) {
        if (properties[propName]) {
          if (Array.isArray(properties[propName])) {
            properties[propName].push(propValue);
          } else {
            properties[propName] = [properties[propName], propValue];
          }
        } else {
          properties[propName] = propValue;
        }
      }
    });

    return properties;
  }

  extractRdfa(document) {
    const schemas = [];
    const rdfaElements = document.querySelectorAll('[typeof]');

    rdfaElements.forEach((element, index) => {
      const typeOf = element.getAttribute('typeof');
      if (typeOf) {
        const data = this.extractRdfaProperties(element);
        schemas.push({
          type: 'RDFa',
          index,
          typeof: typeOf,
          data,
          element: element.outerHTML.substring(0, 200) + '...'
        });
      }
    });

    return schemas;
  }

  extractRdfaProperties(element) {
    const properties = {};
    const propElements = element.querySelectorAll('[property]');

    propElements.forEach(propElement => {
      const propName = propElement.getAttribute('property');
      const propValue = propElement.getAttribute('content') || propElement.textContent.trim();

      if (propName && propValue) {
        properties[propName] = propValue;
      }
    });

    return properties;
  }

  validateSchema(schema, pageResults) {
    if (schema.error) {
      pageResults.issues.push({
        type: 'error',
        schema: schema.type,
        message: schema.error,
        severity: 'high'
      });
      return;
    }

    if (schema.type === 'JSON-LD') {
      schema.data.forEach(item => {
        this.validateJsonLdItem(item, pageResults);
      });
    } else if (schema.type === 'Microdata') {
      this.validateMicrodataItem(schema, pageResults);
    } else if (schema.type === 'RDFa') {
      this.validateRdfaItem(schema, pageResults);
    }
  }

  validateJsonLdItem(item, pageResults) {
    const schemaType = item['@type'];
    if (!schemaType) {
      pageResults.issues.push({
        type: 'error',
        schema: 'JSON-LD',
        message: 'Missing @type property',
        severity: 'high'
      });
      return;
    }

    // Validate required properties
    const requiredProps = this.requiredProperties[schemaType] || [];
    requiredProps.forEach(prop => {
      if (!item[prop]) {
        pageResults.issues.push({
          type: 'warning',
          schema: 'JSON-LD',
          schemaType,
          property: prop,
          message: `Missing required property: ${prop}`,
          severity: 'medium'
        });
      }
    });

    // Validate specific schema types
    this.validateSpecificSchema(schemaType, item, pageResults);
  }

  validateMicrodataItem(schema, pageResults) {
    const schemaType = schema.itemType.split('/').pop();

    const requiredProps = this.requiredProperties[schemaType] || [];
    requiredProps.forEach(prop => {
      if (!schema.data[prop]) {
        pageResults.issues.push({
          type: 'warning',
          schema: 'Microdata',
          schemaType,
          property: prop,
          message: `Missing required property: ${prop}`,
          severity: 'medium'
        });
      }
    });
  }

  validateRdfaItem(schema, pageResults) {
    const schemaType = schema.typeof;

    const requiredProps = this.requiredProperties[schemaType] || [];
    requiredProps.forEach(prop => {
      if (!schema.data[prop]) {
        pageResults.issues.push({
          type: 'warning',
          schema: 'RDFa',
          schemaType,
          property: prop,
          message: `Missing required property: ${prop}`,
          severity: 'medium'
        });
      }
    });
  }

  validateSpecificSchema(schemaType, data, pageResults) {
    switch (schemaType) {
      case 'Organization':
      case 'LocalBusiness':
        this.validateBusinessSchema(data, pageResults);
        break;
      case 'Product':
        this.validateProductSchema(data, pageResults);
        break;
      case 'WebSite':
        this.validateWebSiteSchema(data, pageResults);
        break;
      case 'BreadcrumbList':
        this.validateBreadcrumbSchema(data, pageResults);
        break;
    }
  }

  validateBusinessSchema(data, pageResults) {
    // Check for contact information
    if (!data.telephone && !data.email) {
      pageResults.issues.push({
        type: 'recommendation',
        schema: 'Business',
        message: 'Add contact information (telephone or email)',
        severity: 'low'
      });
    }

    // Check for address
    if (!data.address) {
      pageResults.issues.push({
        type: 'warning',
        schema: 'Business',
        message: 'Missing address information',
        severity: 'medium'
      });
    } else if (typeof data.address === 'object') {
      const requiredAddressProps = ['streetAddress', 'addressLocality', 'postalCode', 'addressCountry'];
      requiredAddressProps.forEach(prop => {
        if (!data.address[prop]) {
          pageResults.issues.push({
            type: 'warning',
            schema: 'Address',
            property: prop,
            message: `Missing address property: ${prop}`,
            severity: 'medium'
          });
        }
      });
    }

    // Check for opening hours
    if (!data.openingHours) {
      pageResults.issues.push({
        type: 'recommendation',
        schema: 'Business',
        message: 'Add opening hours for better local SEO',
        severity: 'low'
      });
    }
  }

  validateProductSchema(data, pageResults) {
    // Check for price information
    if (!data.offers && !data.price) {
      pageResults.issues.push({
        type: 'recommendation',
        schema: 'Product',
        message: 'Add price or offers information',
        severity: 'low'
      });
    }

    // Check for images
    if (!data.image) {
      pageResults.issues.push({
        type: 'warning',
        schema: 'Product',
        message: 'Missing product image',
        severity: 'medium'
      });
    }

    // Check for availability
    if (data.offers && !data.offers.availability) {
      pageResults.issues.push({
        type: 'recommendation',
        schema: 'Product',
        message: 'Add availability information to offers',
        severity: 'low'
      });
    }
  }

  validateWebSiteSchema(data, pageResults) {
    // Check for search action
    if (!data.potentialAction) {
      pageResults.issues.push({
        type: 'recommendation',
        schema: 'WebSite',
        message: 'Add search action for enhanced search results',
        severity: 'low'
      });
    }
  }

  validateBreadcrumbSchema(data, pageResults) {
    if (!Array.isArray(data.itemListElement)) {
      pageResults.issues.push({
        type: 'error',
        schema: 'BreadcrumbList',
        message: 'itemListElement must be an array',
        severity: 'high'
      });
      return;
    }

    data.itemListElement.forEach((item, index) => {
      if (!item.name || !item.item) {
        pageResults.issues.push({
          type: 'warning',
          schema: 'BreadcrumbList',
          message: `Breadcrumb item ${index + 1} missing name or item`,
          severity: 'medium'
        });
      }
    });
  }

  checkSchemaCoverage(pageResults) {
    const foundSchemas = new Set();

    pageResults.schemas.forEach(schema => {
      if (schema.type === 'JSON-LD' && schema.data) {
        schema.data.forEach(item => {
          if (item['@type']) {
            foundSchemas.add(item['@type']);
          }
        });
      } else if (schema.itemType) {
        foundSchemas.add(schema.itemType.split('/').pop());
      } else if (schema.typeof) {
        foundSchemas.add(schema.typeof);
      }
    });

    pageResults.coverage = {
      found: Array.from(foundSchemas),
      missing: this.expectedSchemas.filter(schema => !foundSchemas.has(schema)),
      total: this.expectedSchemas.length,
      percentage: Math.round((foundSchemas.size / this.expectedSchemas.length) * 100)
    };

    // Add recommendations for missing schemas
    pageResults.coverage.missing.forEach(schema => {
      const priority = ['Organization', 'LocalBusiness', 'WebSite'].includes(schema) ? 'high' : 'medium';
      pageResults.issues.push({
        type: 'recommendation',
        schema: 'Coverage',
        message: `Consider adding ${schema} schema markup`,
        severity: priority === 'high' ? 'medium' : 'low'
      });
    });
  }

  calculateSchemaScore(pageResults) {
    let score = 100;

    // Penalize for issues
    pageResults.issues.forEach(issue => {
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

    // Bonus for good coverage
    const coverageBonus = Math.min(20, pageResults.coverage.percentage / 5);
    score += coverageBonus;

    return Math.max(0, Math.min(100, score));
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
    const allSchemas = results.flatMap(r => r.schemas || []);
    const allIssues = results.flatMap(r => r.issues || []);

    return {
      summary: {
        timestamp: new Date().toISOString(),
        totalPages: results.length,
        totalSchemas: allSchemas.length,
        averageScore: results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length,
        schemaTypes: [...new Set(allSchemas.map(s => s.data?.[0]?.['@type'] || s.itemType || s.typeof))],
        commonIssues: this.getCommonIssues(allIssues)
      },
      pages: results,
      recommendations: this.generateSchemaRecommendations(results)
    };
  }

  getCommonIssues(issues) {
    const issueMap = {};
    issues.forEach(issue => {
      const key = `${issue.schema}:${issue.message}`;
      issueMap[key] = (issueMap[key] || 0) + 1;
    });

    return Object.entries(issueMap)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([message, count]) => ({ message, count }));
  }

  generateSchemaRecommendations(results) {
    const recommendations = [];

    // Check if Organization schema is missing
    const hasOrganization = results.some(r =>
      r.schemas?.some(s =>
        s.data?.some(item => item['@type'] === 'Organization') ||
        s.itemType?.includes('Organization')
      )
    );

    if (!hasOrganization) {
      recommendations.push({
        priority: 'high',
        type: 'Organization',
        message: 'Add Organization schema to establish business entity',
        impact: 'Helps search engines understand business structure'
      });
    }

    // Check for LocalBusiness schema
    const hasLocalBusiness = results.some(r =>
      r.schemas?.some(s =>
        s.data?.some(item => item['@type'] === 'LocalBusiness') ||
        s.itemType?.includes('LocalBusiness')
      )
    );

    if (!hasLocalBusiness) {
      recommendations.push({
        priority: 'high',
        type: 'LocalBusiness',
        message: 'Add LocalBusiness schema for better local SEO',
        impact: 'Improves visibility in local search results'
      });
    }

    return recommendations;
  }
}

// CLI interface
async function main() {
  const validator = new SchemaValidator();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node schema-validator.js <url|file> [output-file]');
    console.log('Examples:');
    console.log('  node schema-validator.js https://kps-interiery.cz');
    console.log('  node schema-validator.js ./dist/index.html');
    console.log('  node schema-validator.js https://kps-interiery.cz schema-report.json');
    process.exit(1);
  }

  const input = args[0];
  const outputFile = args[1];
  const startTime = performance.now();

  console.log('🔍 Starting schema markup validation...');

  let result;
  if (input.startsWith('http')) {
    result = await validator.validateURL(input);
  } else {
    result = await validator.validateFile(input);
  }

  const report = validator.generateReport([result]);
  const endTime = performance.now();

  console.log('\n📊 Schema Markup Validation Report');
  console.log('===================================');
  console.log(`✅ Score: ${result.score}/100`);
  console.log(`⏱️  Duration: ${Math.round(endTime - startTime)}ms`);
  console.log(`📄 URL/File: ${result.url}`);

  if (result.error) {
    console.log(`❌ Error: ${result.error}`);
  } else {
    console.log(`\n📋 Schemas Found: ${result.schemas?.length || 0}`);
    console.log(`📊 Coverage: ${result.coverage?.percentage || 0}% (${result.coverage?.found?.length || 0}/${result.coverage?.total || 0})`);
    console.log(`⚠️  Issues: ${result.issues?.length || 0}`);

    if (result.schemas && result.schemas.length > 0) {
      console.log('\n🏷️  Schema Types Found:');
      result.schemas.forEach(schema => {
        if (schema.type === 'JSON-LD' && schema.data) {
          schema.data.forEach(item => {
            if (item['@type']) {
              console.log(`  • ${item['@type']} (JSON-LD)`);
            }
          });
        } else if (schema.itemType) {
          console.log(`  • ${schema.itemType.split('/').pop()} (Microdata)`);
        } else if (schema.typeof) {
          console.log(`  • ${schema.typeof} (RDFa)`);
        }
      });
    }

    if (result.issues && result.issues.length > 0) {
      console.log('\n🚨 Issues Found:');
      result.issues.forEach(issue => {
        const icon = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : '💡';
        console.log(`${icon} ${issue.schema}: ${issue.message}`);
      });
    }

    if (result.coverage?.missing?.length > 0) {
      console.log('\n💡 Missing Schema Types:');
      result.coverage.missing.forEach(schema => {
        console.log(`  • ${schema}`);
      });
    }
  }

  if (outputFile) {
    await fs.writeFile(outputFile, JSON.stringify(report, null, 2));
    console.log(`\n💾 Report saved to: ${outputFile}`);
  }

  process.exit(result.score >= 70 ? 0 : 1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { SchemaValidator };