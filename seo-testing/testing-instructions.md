# SEO Testing Instructions for KPS Interiéry

This document provides comprehensive instructions for testing SEO implementation using both automated tools and external validators.

## 🚀 Quick Start

### Running Automated Tests

1. **Install Dependencies**
   ```bash
   npm install jsdom
   ```

2. **Run Individual Tests**
   ```bash
   # Meta tags validation
   node seo-testing/meta-validator.js https://kps-interiery.cz

   # Schema markup validation
   node seo-testing/schema-validator.js https://kps-interiery.cz

   # Sitemap structure check
   node seo-testing/sitemap-checker.js https://kps-interiery.cz/sitemap.xml

   # Social media preview test
   node seo-testing/social-preview-tester.js https://kps-interiery.cz

   # Complete SEO audit
   node seo-testing/seo-audit.js https://kps-interiery.cz
   ```

3. **Save Reports**
   ```bash
   # Generate JSON reports
   node seo-testing/seo-audit.js https://kps-interiery.cz audit-report.json
   ```

## 📋 External Validator Testing

### Google Search Console & Testing Tools

#### 1. Google Rich Results Test
- **URL**: https://search.google.com/test/rich-results
- **Purpose**: Validate structured data markup
- **Instructions**:
  1. Enter your page URL
  2. Click "Test URL"
  3. Check for warnings or errors
  4. Verify preview appearance

#### 2. Google PageSpeed Insights
- **URL**: https://pagespeed.web.dev/
- **Purpose**: Performance and Core Web Vitals
- **Instructions**:
  1. Enter page URL
  2. Analyze both Mobile and Desktop
  3. Focus on SEO score section
  4. Check recommendations

#### 3. Google Mobile-Friendly Test
- **URL**: https://search.google.com/test/mobile-friendly
- **Purpose**: Mobile usability testing
- **Instructions**:
  1. Test main pages
  2. Verify mobile-friendly status
  3. Check for usability issues

### Facebook Sharing Debugger

#### Setup and Testing
- **URL**: https://developers.facebook.com/tools/debug/
- **Purpose**: Test Open Graph meta tags
- **Instructions**:
  1. Enter page URL
  2. Click "Debug"
  3. Check scraped information
  4. Verify image displays correctly
  5. Use "Scrape Again" if changes were made

#### Common Issues to Check:
- ✅ og:title is present and descriptive
- ✅ og:description is 120-160 characters
- ✅ og:image is at least 1200x630px
- ✅ og:image uses absolute URL with HTTPS
- ✅ og:type is appropriate (usually "website")
- ✅ og:url matches canonical URL

### Twitter Card Validator

#### Setup and Testing
- **URL**: https://cards-dev.twitter.com/validator
- **Purpose**: Test Twitter Card implementation
- **Instructions**:
  1. Enter page URL
  2. Click "Preview card"
  3. Verify card displays correctly
  4. Check for any validation warnings

#### Recommended Settings:
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@kps_interiery">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Page description">
<meta name="twitter:image" content="https://domain.com/image.jpg">
```

### LinkedIn Post Inspector

#### Testing Social Sharing
- **URL**: https://www.linkedin.com/post-inspector/
- **Purpose**: Test LinkedIn sharing appearance
- **Instructions**:
  1. Enter page URL
  2. Click "Inspect"
  3. Verify title, description, and image
  4. Check for any issues or warnings

#### Optimization Tips:
- Use Open Graph tags (LinkedIn uses OG tags)
- Ensure images are 1200x627px for best results
- Keep titles under 200 characters
- Keep descriptions under 300 characters

## 🔍 Manual SEO Checklist

### Technical SEO Verification

#### Meta Tags Checklist
- [ ] **Title Tag**: Present, unique, 30-60 characters
- [ ] **Meta Description**: Present, compelling, 120-160 characters
- [ ] **Canonical URL**: Correct and absolute
- [ ] **Viewport**: Mobile-friendly viewport tag
- [ ] **Robots**: Appropriate indexing directives
- [ ] **Language**: Proper hreflang and lang attributes

#### Schema Markup Verification
- [ ] **Organization Schema**: Complete business information
- [ ] **LocalBusiness Schema**: Address, hours, contact info
- [ ] **Service Schema**: Detailed service descriptions
- [ ] **WebSite Schema**: Site search functionality
- [ ] **BreadcrumbList**: Navigation structure
- [ ] **Product Schema**: For furniture items (if applicable)

#### Site Structure
- [ ] **Sitemap**: XML sitemap exists and is valid
- [ ] **Robots.txt**: Proper directives and sitemap reference
- [ ] **URL Structure**: Clean, descriptive URLs
- [ ] **Internal Linking**: Logical link structure
- [ ] **Navigation**: Clear hierarchy and breadcrumbs

### Content Quality Checks

#### Page Content Analysis
- [ ] **Heading Structure**: Proper H1-H6 hierarchy
- [ ] **Content Length**: Adequate content depth
- [ ] **Keyword Usage**: Natural keyword integration
- [ ] **Images**: Proper alt attributes and optimization
- [ ] **Loading Speed**: Fast page load times

#### Local SEO (for KPS Interiéry)
- [ ] **NAP Consistency**: Name, Address, Phone consistent
- [ ] **Local Keywords**: "Zlínský kraj", "Morava" integration
- [ ] **Google My Business**: Complete profile (external)
- [ ] **Local Structured Data**: Proper geo-tagging
- [ ] **Reviews Schema**: Customer review markup

## 📊 Monitoring and Reporting

### Regular Testing Schedule

#### Weekly Tests
- Run automated SEO audit
- Check Google Search Console for errors
- Monitor Core Web Vitals

#### Monthly Tests
- Full social media validation
- Comprehensive schema markup review
- Competitor SEO analysis

#### Quarterly Reviews
- Complete site audit
- External validator testing
- SEO strategy review

### Key Performance Indicators (KPIs)

#### SEO Scores to Track
- **Overall SEO Score**: Target 80+/100
- **Meta Tags Score**: Target 90+/100
- **Schema Markup Score**: Target 85+/100
- **Social Media Score**: Target 75+/100
- **Performance Score**: Target 80+/100

#### Search Console Metrics
- Click-through rates (CTR)
- Average position rankings
- Impression volumes
- Core Web Vitals scores

## 🛠️ Troubleshooting Common Issues

### Meta Tag Issues
**Problem**: Missing or duplicate meta descriptions
**Solution**:
```javascript
// Check with automated validator
node seo-testing/meta-validator.js https://domain.com

// Fix in router-head component
<meta name="description" content="Unique page description" />
```

### Schema Markup Issues
**Problem**: Invalid or missing structured data
**Solution**:
```javascript
// Validate schema
node seo-testing/schema-validator.js https://domain.com

// Use Google's Rich Results Test
// Add missing properties to schema components
```

### Social Media Issues
**Problem**: Images not displaying in social shares
**Solution**:
```javascript
// Test social previews
node seo-testing/social-preview-tester.js https://domain.com

// Ensure og:image uses absolute HTTPS URLs
// Verify image dimensions (1200x630px)
// Check Facebook Debugger for cache issues
```

### Sitemap Issues
**Problem**: Sitemap not found or invalid
**Solution**:
```javascript
// Validate sitemap structure
node seo-testing/sitemap-checker.js https://domain.com/sitemap.xml

// Generate sitemap if missing
// Update robots.txt with sitemap location
// Submit to Google Search Console
```

## 📈 Advanced Testing Techniques

### Automated Testing Integration

#### CI/CD Pipeline Integration
```yaml
# GitHub Actions example
- name: Run SEO Tests
  run: |
    node seo-testing/seo-audit.js https://staging.kps-interiery.cz
    # Fail build if score < 70
```

#### Local Development Testing
```bash
# Test local build
npm run build
node seo-testing/seo-audit.js ./dist/index.html

# Test specific components
npm run dev
node seo-testing/meta-validator.js http://localhost:5173
```

### Performance Testing
```bash
# Use with performance monitoring
node seo-testing/seo-audit.js https://domain.com --verbose

# Focus on specific aspects
node seo-testing/seo-audit.js https://domain.com --no-performance
```

## 📚 Resources and Documentation

### SEO Guidelines
- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Guide](https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started)

### Tools and Validators
- [Google Search Console](https://search.google.com/search-console)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### Czech SEO Resources
- [Seznam.cz for Business](https://business.seznam.cz/)
- [Czech Republic SEO Guidelines](https://podnikatel.cz/clanky/seo-tipy/)
- [Local Business Optimization](https://firmy.seznam.cz/)

---

**Next Steps:**
1. Run the complete SEO audit: `node seo-testing/seo-audit.js https://kps-interiery.cz`
2. Address critical issues identified in the report
3. Test changes using external validators
4. Set up regular monitoring schedule
5. Document improvements and track progress

For technical support or questions about these tools, refer to the generated reports and recommendations.