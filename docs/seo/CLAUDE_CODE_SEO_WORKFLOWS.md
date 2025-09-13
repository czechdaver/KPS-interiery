# Claude Code SEO Workflows for KPS Interiéry

## 🎯 Automated SEO Implementation Workflows

This document provides ready-to-execute Claude Code commands and workflows for implementing the complete SEO optimization plan for KPS Interiéry. Each workflow is designed for concurrent execution and includes validation steps.

---

## 🚀 Phase 1: Quick Wins Implementation

### Workflow 1: Critical Meta Tags and Social Media Optimization

#### Claude Code Command:
```bash
claude code "Fix critical SEO meta tags and social media optimization. Update router-head component with missing Open Graph tags (og:image, og:url), Twitter Cards (summary_large_image), and proper social media previews. Create social media preview image if missing. Test with Facebook Debugger and Twitter Card Validator. Ensure all meta tags are properly formatted and functional."
```

#### Expected Deliverables:
- Updated `app/src/components/router-head/router-head.tsx`
- Social media preview image (`app/public/images/kps-logo-social.jpg`)
- Meta tags validation report
- Social media preview testing results

#### Validation Steps:
1. Test Facebook sharing preview
2. Test Twitter card display
3. Verify meta tags in browser dev tools
4. Check Open Graph markup with validator

---

### Workflow 2: Sitemap and Robots.txt Optimization

#### Claude Code Command:
```bash
claude code "Update and fix sitemap.xml and robots.txt for proper SEO indexing. Create comprehensive sitemap with all current pages including gallery sections. Update robots.txt to reference sitemap location. Add proper priority settings, changefreq, and lastmod dates. Ensure proper XML formatting and validate sitemap structure."
```

#### Expected Deliverables:
- Updated `app/public/sitemap.xml` with proper URLs
- Fixed `app/public/robots.txt` with sitemap reference
- Sitemap validation report
- Google Search Console submission instructions

#### Implementation Details:
```xml
<!-- Sitemap Structure -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://kps-interiery.github.io/KPS-interiery/</loc>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>https://kps-interiery.github.io/KPS-interiery/#galerie</loc>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
  </url>
</urlset>
```

---

### Workflow 3: LocalBusiness Schema Markup Implementation

#### Claude Code Command:
```bash
claude code "Implement comprehensive LocalBusiness schema markup for KPS Interiéry. Add structured data in JSON-LD format including company information, address, contact details, services offered, and geographic location. Ensure proper schema.org compliance and test with Google Rich Results Test. Include opening hours, payment methods, and service areas."
```

#### Expected Deliverables:
- LocalBusiness schema in `app/src/root.tsx` or router-head
- Schema markup validation report
- Google Rich Results Test screenshots
- Service-specific schema extensions

#### Schema Implementation:
```typescript
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://kps-interiery.github.io/KPS-interiery/",
  "name": "KPS Interiéry",
  "description": "Specializujeme se na zakázkovou výrobu nábytku na míru",
  "url": "https://kps-interiery.github.io/KPS-interiery/",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CZ",
    "addressRegion": "Zlínský kraj"
  },
  "sameAs": ["https://www.instagram.com/kps_interiery"]
};
```

---

### Workflow 4: PWA Manifest Enhancement

#### Claude Code Command:
```bash
claude code "Enhance PWA web manifest with proper KPS Interiéry branding and configuration. Update manifest.json with company-specific information, icons, theme colors, and proper PWA settings. Ensure mobile SEO compliance and proper manifest validation. Add appropriate icons in multiple sizes if missing."
```

#### Expected Deliverables:
- Updated `app/public/manifest.json`
- Manifest validation report
- PWA compliance check
- Icon files if required

---

## 🏗️ Phase 2: Gallery URL Structure and Advanced SEO

### Workflow 5: Gallery URL Structure Migration

#### Claude Code Command:
```bash
claude code "Convert gallery hash-based navigation to proper SEO-friendly URL routing structure. Create individual gallery pages with unique URLs following the pattern /galerie/[category]/[slug]. Implement proper routing in Qwik City, add canonical URLs, individual meta descriptions for each gallery, and ensure backward compatibility. Create dynamic gallery page generation from existing JSON data."
```

#### Expected Deliverables:
- New routing structure: `/galerie/:category/:slug`
- Individual gallery page components
- Gallery metadata integration
- 301 redirects for backward compatibility
- Canonical URL implementation

#### URL Structure:
```
/galerie/kuchyne/bila-kuchyn-s-ostruvkem
/galerie/loznice/bilo-hneda-loznice-vestavene-skrine
/galerie/koupelny/moderna-koupelna-cerna
/galerie/skrine/vestavena-skrin-posuvne-dvere
/galerie/ostatni/kancelar-na-miru
```

---

### Workflow 6: Gallery Schema Markup Implementation

#### Claude Code Command:
```bash
claude code "Implement comprehensive ImageGallery and ImageObject schema markup for all gallery pages. Add structured data for each gallery including project details, location information, image metadata, and creator information. Ensure proper schema nesting and validation. Include geographic data where available and creation dates."
```

#### Expected Deliverables:
- ImageGallery schema for each gallery page
- ImageObject schema for individual images
- Geographic location markup
- Schema validation reports
- Rich snippets testing results

---

### Workflow 7: Image Sitemap Generation

#### Claude Code Command:
```bash
claude code "Create automated image sitemap generation system for all gallery images. Build script that processes all AVIF and JPEG images in gallery directories, extracts metadata from JSON files, and generates comprehensive image sitemap XML. Include image captions, geo-location data where available, and proper image URLs. Ensure sitemap is under 50MB limit and properly formatted."
```

#### Expected Deliverables:
- `app/scripts/generate-image-sitemap.ts`
- Generated `app/public/image-sitemap.xml`
- Automated generation process
- Image sitemap validation report
- Google Search Console submission guide

---

## 🚀 Phase 3: Performance and Advanced Features

### Workflow 8: Core Web Vitals Monitoring Implementation

#### Claude Code Command:
```bash
claude code "Implement Core Web Vitals monitoring using web-vitals library. Add performance tracking for LCP, FID, FCP, CLS, and TTFB metrics. Create dashboard for monitoring SEO-related performance metrics. Set up automated reporting and alerts for performance regressions. Include mobile-specific performance tracking."
```

#### Expected Deliverables:
- Web Vitals monitoring in `app/src/root.tsx`
- Performance dashboard component
- Automated reporting system
- Performance regression alerts
- Mobile performance tracking

#### Implementation:
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Add to root component
useClientEffect$(() => {
  getCLS((metric) => {
    console.log('CLS:', metric);
    // Send to analytics
  });

  getFID((metric) => {
    console.log('FID:', metric);
    // Send to analytics
  });
});
```

---

### Workflow 9: Service Worker for SEO Enhancement

#### Claude Code Command:
```bash
claude code "Implement service worker for enhanced SEO performance and offline functionality. Create caching strategies for AVIF images, critical CSS, and JavaScript bundles. Implement cache-first strategy for images and stale-while-revalidate for HTML. Ensure proper cache versioning and update mechanisms. Add offline page support."
```

#### Expected Deliverables:
- Service worker implementation
- Caching strategies for different asset types
- Offline functionality
- Cache versioning system
- Service worker registration

---

### Workflow 10: Advanced Schema Markup

#### Claude Code Command:
```bash
claude code "Implement advanced schema markup including Service, Product, FAQ, and Review schemas. Add structured data for furniture categories, customer testimonials, and frequently asked questions. Create breadcrumb schema for navigation and service-specific landing page schemas. Ensure all markup is properly nested and validated."
```

#### Expected Deliverables:
- Service schema for furniture categories
- Product schema for specific items
- FAQ schema implementation
- Review schema for testimonials
- Breadcrumb markup throughout site

---

## 🔍 Validation and Testing Workflows

### Workflow 11: Comprehensive SEO Validation

#### Claude Code Command:
```bash
claude code "Create comprehensive SEO validation and testing suite. Build automated scripts that check meta tags completeness, schema markup validity, image alt text coverage, URL structure compliance, and performance metrics. Include Lighthouse SEO scoring, accessibility checks, and mobile usability validation. Generate detailed SEO audit report."
```

#### Expected Deliverables:
- `app/scripts/seo-validator.ts`
- Automated testing suite
- SEO audit report generator
- Performance benchmarking tools
- Validation dashboard

#### Validation Checklist:
```typescript
const seoValidation = {
  metaTags: {
    title: true,
    description: true,
    openGraph: true,
    twitterCard: true,
    canonical: true
  },
  schemaMarkup: {
    localBusiness: true,
    imageGallery: true,
    breadcrumbs: true
  },
  performance: {
    coreWebVitals: true,
    imageOptimization: true,
    mobileUsability: true
  }
};
```

---

### Workflow 12: Performance Benchmarking and Optimization

#### Claude Code Command:
```bash
claude code "Set up automated performance benchmarking and optimization system. Create scripts that monitor Core Web Vitals, bundle sizes, image optimization ratios, and loading times. Implement continuous performance monitoring with alerts for regressions. Include competitive benchmarking and performance budget enforcement."
```

#### Expected Deliverables:
- Performance benchmarking scripts
- Continuous monitoring system
- Performance budget enforcement
- Competitive analysis tools
- Optimization recommendations engine

---

## 📊 Monitoring and Maintenance Workflows

### Workflow 13: SEO Health Monitoring

#### Claude Code Command:
```bash
claude code "Create ongoing SEO health monitoring system. Build dashboard that tracks search rankings, organic traffic patterns, Core Web Vitals scores, and technical SEO issues. Set up automated alerts for SEO problems like broken links, missing meta tags, or performance regressions. Include competitive monitoring and keyword tracking."
```

#### Expected Deliverables:
- SEO health dashboard
- Automated monitoring alerts
- Ranking tracking system
- Technical SEO issue detection
- Competitive analysis tools

---

### Workflow 14: Content Optimization Automation

#### Claude Code Command:
```bash
claude code "Implement automated content optimization workflows. Create systems that analyze content for SEO opportunities, suggest meta tag improvements, identify missing alt text, and optimize heading structures. Include keyword density analysis and content gap identification. Set up automated content quality scoring."
```

#### Expected Deliverables:
- Content analysis tools
- Automated optimization suggestions
- Quality scoring system
- Content gap analysis
- SEO opportunity identification

---

## 🎯 Emergency Response Workflows

### Workflow 15: SEO Issue Emergency Response

#### Claude Code Command:
```bash
claude code "Create emergency response system for critical SEO issues. Build rapid diagnostic tools that can quickly identify and fix common problems like broken sitemaps, missing meta tags, schema markup errors, or performance regressions. Include rollback procedures and emergency fix deployment."
```

#### Expected Deliverables:
- Emergency diagnostic tools
- Rapid fix deployment system
- Rollback procedures
- Issue escalation protocols
- Recovery verification tools

---

## 📈 Advanced Analytics and Reporting

### Workflow 16: Advanced SEO Analytics

#### Claude Code Command:
```bash
claude code "Implement advanced SEO analytics and reporting system. Create comprehensive dashboards that track organic traffic, keyword rankings, conversion rates, and technical performance metrics. Include custom goals tracking, attribution analysis, and ROI measurement for SEO efforts. Set up automated weekly and monthly reporting."
```

#### Expected Deliverables:
- Advanced analytics dashboard
- Custom goal tracking
- ROI measurement tools
- Automated reporting system
- Attribution analysis

---

## 🛠️ Execution Guidelines

### Concurrent Execution Pattern
```bash
# Execute related workflows in single sessions for maximum efficiency
claude code "Execute Workflows 1, 2, and 3 concurrently - implement critical meta tags, update sitemap/robots.txt, and add LocalBusiness schema markup. Run comprehensive validation tests after implementation."
```

### Progressive Implementation
1. **Week 1:** Workflows 1-4 (Foundation)
2. **Week 2:** Workflows 5-7 (Gallery Structure)
3. **Week 3:** Workflows 8-10 (Advanced Features)
4. **Week 4:** Workflows 11-16 (Validation & Monitoring)

### Quality Assurance
Each workflow includes:
- Pre-implementation validation
- Implementation steps
- Post-implementation testing
- Performance impact measurement
- Rollback procedures if needed

### Success Metrics
- Lighthouse SEO score improvement
- Core Web Vitals enhancement
- Search Console performance metrics
- Organic traffic growth tracking
- Technical SEO compliance scores

---

## 📞 Support Commands

### Quick Health Check
```bash
claude code "Run rapid SEO health check on KPS Interiéry website and identify any critical issues requiring immediate attention"
```

### Performance Diagnostics
```bash
claude code "Analyze current Core Web Vitals performance and provide specific optimization recommendations for SEO improvement"
```

### Schema Validation
```bash
claude code "Validate all schema markup implementations and fix any Google Rich Results Test failures"
```

### Competitive Analysis
```bash
claude code "Analyze competitor SEO strategies and identify new optimization opportunities for KPS Interiéry"
```

---

These workflows provide a comprehensive, executable plan for transforming KPS Interiéry's SEO performance using Claude Code's advanced capabilities. Each workflow is designed for efficiency, includes proper validation, and contributes to the overall goal of achieving 88-92/100 SEO score and 25-40% organic traffic growth.