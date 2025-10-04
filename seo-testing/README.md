# SEO Testing Suite for KPS Interiéry

A comprehensive SEO validation and testing suite specifically designed for KPS Interiéry's furniture business website. This suite provides automated tools to validate meta tags, schema markup, social media integration, and overall SEO performance.

## 🚀 Quick Start

### Prerequisites

```bash
npm install jsdom
```

### Run Complete SEO Audit

```bash
# Audit your website
node seo-testing/seo-audit.js https://kps-interiery.cz

# Save detailed report
node seo-testing/seo-audit.js https://kps-interiery.cz audit-report.json

# Test local development build
npm run build
node seo-testing/seo-audit.js ./app/dist/index.html
```

## 📋 Available Tools

### 1. Meta Tags Validator (`meta-validator.js`)
Validates HTML meta tags for completeness and SEO best practices.

```bash
# Basic validation
node seo-testing/meta-validator.js https://kps-interiery.cz

# Save report
node seo-testing/meta-validator.js https://kps-interiery.cz meta-report.json
```

**Checks:**
- ✅ Title tag (30-60 characters, includes brand)
- ✅ Meta description (120-160 characters, includes CTA)
- ✅ Open Graph tags (og:title, og:description, og:image, og:type)
- ✅ Viewport and mobile optimization
- ✅ Robots and indexing directives
- ✅ Czech localization (lang="cs", locale="cs_CZ")

### 2. Schema Markup Validator (`schema-validator.js`)
Validates structured data (JSON-LD, Microdata, RDFa) for rich snippets.

```bash
# Validate schema markup
node seo-testing/schema-validator.js https://kps-interiery.cz

# Save detailed schema report
node seo-testing/schema-validator.js https://kps-interiery.cz schema-report.json
```

**Validates:**
- ✅ LocalBusiness schema (address, hours, contact)
- ✅ Organization schema (logo, name, social profiles)
- ✅ Service schemas (furniture services)
- ✅ Product schemas (for furniture items)
- ✅ JSON-LD syntax and structure
- ✅ Required properties completeness

### 3. Sitemap Checker (`sitemap-checker.js`)
Validates XML sitemap structure and URL completeness.

```bash
# Check sitemap
node seo-testing/sitemap-checker.js https://kps-interiery.cz/sitemap.xml

# Validate local sitemap file
node seo-testing/sitemap-checker.js ./app/public/sitemap.xml
```

**Features:**
- ✅ XML syntax validation
- ✅ URL accessibility testing
- ✅ Lastmod and priority validation
- ✅ Duplicate URL detection
- ✅ Required page coverage check

### 4. Social Media Preview Tester (`social-preview-tester.js`)
Tests Open Graph and Twitter Card implementations.

```bash
# Test social media previews
node seo-testing/social-preview-tester.js https://kps-interiery.cz

# Generate social media report
node seo-testing/social-preview-tester.js https://kps-interiery.cz social-report.json
```

**Platform Support:**
- 📘 Facebook (Open Graph)
- 🐦 Twitter (Twitter Cards)
- 💼 LinkedIn (Open Graph)
- 🔗 General Open Graph validation

### 5. Performance Monitor (`performance-monitor.js`)
Continuous SEO performance monitoring with historical tracking.

```bash
# Monitor SEO performance
node seo-testing/performance-monitor.js monitor https://kps-interiery.cz

# Export historical data
node seo-testing/performance-monitor.js export csv seo-data.csv

# Generate trend report
node seo-testing/performance-monitor.js report 30
```

**Features:**
- 📊 Score trend analysis
- 🚨 Automated alerts
- 📈 Historical data storage
- 📋 Performance reports

### 6. Comprehensive SEO Audit (`seo-audit.js`)
Combines all validators for complete SEO analysis.

```bash
# Full SEO audit
node seo-testing/seo-audit.js https://kps-interiery.cz

# Include performance checks
node seo-testing/seo-audit.js https://kps-interiery.cz --verbose

# Skip certain checks
node seo-testing/seo-audit.js https://kps-interiery.cz --no-performance
```

**Comprehensive Checks:**
- 🏷️  Meta tags validation (25% weight)
- 📋 Schema markup validation (20% weight)
- 📱 Social media integration (15% weight)
- 🗺️  Sitemap structure (15% weight)
- ⚡ Performance factors (10% weight)
- ♿ Accessibility factors (10% weight)
- 🔒 Security factors (5% weight)

## 🧪 Test Suite

### Automated Testing with Playwright

```bash
# Run SEO tests
npm run test:seo

# Run all tests including SEO
npm run test:all
```

The test suite (`tests/seo-tests.spec.js`) includes:

- **Meta Tags Tests**: Validates all meta tag implementations
- **Schema Markup Tests**: Tests structured data validity
- **Social Media Tests**: Validates social sharing functionality
- **Technical SEO Tests**: HTML structure, performance, accessibility
- **Mobile/PWA Tests**: Mobile optimization and PWA features

## 📊 Scoring System

### Overall SEO Score Calculation

```
Overall Score = (Meta×0.25) + (Schema×0.20) + (Social×0.15) + (Sitemap×0.15) + (Performance×0.10) + (Accessibility×0.10) + (Security×0.05)
```

### Grading Scale
- **A+ (90-100)**: Excellent SEO implementation
- **A (85-89)**: Very good with minor improvements
- **B (70-84)**: Good but needs attention
- **C (50-69)**: Acceptable but requires work
- **D-F (<50)**: Needs significant improvement

### Score Targets
- 🎯 **Target Score**: 80+ (Grade B or higher)
- 🚨 **Critical Threshold**: 70 (Below this triggers alerts)
- ✅ **Excellent**: 90+ (A+ grade)

## 🔧 External Validation Tools

### Google Tools
- **Rich Results Test**: https://search.google.com/test/rich-results
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly

### Social Media Validators
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Inspector**: https://www.linkedin.com/post-inspector/

### Testing Workflow

1. **Development**: Use local validation during development
2. **Staging**: Run full audit on staging environment
3. **Production**: Monitor with performance monitoring
4. **External**: Validate with platform-specific tools

## 📈 Monitoring and Reporting

### Setting Up Monitoring

```bash
# Set up daily monitoring (add to cron/scheduler)
0 9 * * * /path/to/node seo-testing/performance-monitor.js monitor https://kps-interiery.cz

# Weekly reports
0 9 * * 1 /path/to/node seo-testing/performance-monitor.js report 7
```

### CI/CD Integration

```yaml
# Example GitHub Actions workflow
name: SEO Tests
on: [push, pull_request]
jobs:
  seo-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run SEO Audit
        run: |
          npm install jsdom
          node seo-testing/seo-audit.js https://staging.kps-interiery.cz
        env:
          MIN_SEO_SCORE: 75
```

## 🎯 KPS Interiéry Specific Optimizations

### Czech Market Focus
- ✅ Czech language meta tags (`lang="cs"`, `locale="cs_CZ"`)
- ✅ Local business schema with Zlínský kraj location
- ✅ Czech-specific keywords and content validation
- ✅ Seznam.cz and Czech search engine optimization

### Furniture Business SEO
- ✅ Product schema for furniture items
- ✅ Service schema for custom furniture services
- ✅ Local business optimization
- ✅ Gallery and portfolio optimization
- ✅ Customer review schema support

### Performance Optimizations
- ✅ Image optimization validation
- ✅ Font loading optimization
- ✅ Critical resource prioritization
- ✅ Mobile-first validation

## 📋 Common Issues and Solutions

### Meta Tags Issues

**Problem**: Missing or duplicate meta descriptions
```bash
# Diagnose
node seo-testing/meta-validator.js https://kps-interiery.cz

# Fix in components/router-head/router-head.tsx
<meta name="description" content="Unique page description" />
```

**Problem**: Title too long or missing brand
```javascript
// Fix in route files (e.g., src/routes/index.tsx)
export const head: DocumentHead = {
  title: "Service Name | KPS Interiéry - Brand Description",
  // Keep under 60 characters total
};
```

### Schema Issues

**Problem**: Missing required LocalBusiness properties
```javascript
// Add to LocalBusinessSchema component
"address": {
  "@type": "PostalAddress",
  "streetAddress": "Your street address",
  "addressLocality": "City",
  "addressRegion": "Zlínský kraj",
  "postalCode": "12345",
  "addressCountry": "CZ"
},
"telephone": "+420 XXX XXX XXX",
"openingHours": "Mo-Fr 08:00-17:00"
```

### Social Media Issues

**Problem**: Images not showing in social shares
```html
<!-- Ensure absolute URLs in meta tags -->
<meta property="og:image" content="https://kps-interiery.cz/images/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

## 📚 Advanced Usage

### Custom Validation Rules

```javascript
// Extend MetaValidator for custom business rules
class CustomMetaValidator extends MetaValidator {
  validateCustomRules(pageResults) {
    // Add furniture business specific validations
    if (!pageResults.title.includes('nábytek')) {
      pageResults.issues.push({
        type: 'recommendation',
        message: 'Consider including "nábytek" in title for Czech SEO'
      });
    }
  }
}
```

### Batch Testing Multiple Pages

```bash
# Create a URL list file
echo "https://kps-interiery.cz" > urls.txt
echo "https://kps-interiery.cz/galerie" >> urls.txt
echo "https://kps-interiery.cz/kontakt" >> urls.txt

# Test all URLs
while read url; do
  echo "Testing: $url"
  node seo-testing/seo-audit.js "$url" "report-$(basename $url).json"
done < urls.txt
```

### Integration with Google Analytics/Search Console

```javascript
// Example: Combine SEO scores with traffic data
const seoData = await audit.auditURL(url);
const analyticsData = await fetchAnalyticsData(url);

const correlation = {
  seoScore: seoData.overall.score,
  organicTraffic: analyticsData.sessions,
  avgPosition: analyticsData.avgPosition,
  ctr: analyticsData.ctr
};
```

## 🆘 Support and Troubleshooting

### Common Installation Issues

```bash
# If jsdom installation fails
npm install --save-dev jsdom

# For Node.js version compatibility
node --version  # Ensure Node.js 16+
```

### Debug Mode

```bash
# Run with detailed output
node seo-testing/seo-audit.js https://kps-interiery.cz --verbose

# Debug specific component
DEBUG=meta node seo-testing/meta-validator.js https://kps-interiery.cz
```

### Getting Help

1. Check the generated reports for specific recommendations
2. Review the testing instructions in `testing-instructions.md`
3. Use external validators to confirm issues
4. Check browser developer tools for client-side issues

## 📅 Maintenance Schedule

### Daily
- Monitor performance scores
- Check for critical alerts

### Weekly
- Run full SEO audit
- Review and fix high-priority issues
- Update meta descriptions for new content

### Monthly
- Analyze SEO trends
- Update schema markup
- Optimize social media integration
- Review and update external validator results

### Quarterly
- Complete SEO strategy review
- Update testing suite
- Benchmark against competitors
- Review and update keyword optimization

---

## 🎉 Success Metrics

Track these KPIs to measure SEO improvement:

- **SEO Score**: Maintain 80+ overall score
- **Search Visibility**: Monitor organic traffic growth
- **Rich Snippets**: Increase structured data coverage
- **Social Engagement**: Improve social media CTR
- **Page Speed**: Maintain fast loading times
- **Mobile Experience**: Optimize mobile SEO scores

Use this suite regularly to maintain and improve KPS Interiéry's search engine optimization and online visibility in the Czech market.