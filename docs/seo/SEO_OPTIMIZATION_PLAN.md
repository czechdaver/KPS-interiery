# KPS Interiéry - SEO Optimization Implementation Plan

## Executive Summary

This document provides a comprehensive, Claude Code-powered implementation plan for optimizing KPS Interiéry's SEO performance. Based on expert SEO analysis, this plan will increase organic traffic by **25-40%** within 3-6 months through systematic implementation of critical SEO improvements.

**Current SEO Score:** 72/100
**Target SEO Score:** 88-92/100
**Implementation Timeline:** 4 weeks (Phase 1), 8 weeks (Complete)

---

## 📋 Implementation Strategy Overview

### Claude Code Execution Approach

This plan leverages Claude Code's advanced capabilities for:
- **Concurrent task execution** using swarm coordination
- **Automated testing and validation** of SEO implementations
- **Performance monitoring** and optimization tracking
- **Documentation generation** and maintenance

### Key Principles
1. **Batch Operations**: All related changes in single Claude Code sessions
2. **Test-Driven SEO**: Validate each change with automated testing
3. **Progressive Enhancement**: Implement improvements without breaking existing functionality
4. **Performance Monitoring**: Continuous measurement of SEO impact

---

## 🎯 Phase 1: Critical SEO Fixes (Week 1-2)

### Quick Wins Implementation

#### Task 1: Meta Tags and Social Media Optimization
**Claude Code Command:**
```bash
claude code "Fix missing Open Graph and Twitter meta tags in router-head component. Add og:image, og:url, twitter:card, and twitter:image meta tags. Test social media preview functionality."
```

**Files to modify:**
- `app/src/components/router-head/router-head.tsx`

**Expected changes:**
```typescript
// Add missing meta tags
<meta property="og:url" content={loc.url.href} />
<meta property="og:image" content={`${import.meta.env.BASE_URL}images/kps-logo-social.jpg`} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={head.title} />
<meta name="twitter:description" content={head.meta.find(m => m.name === 'description')?.content} />
<meta name="twitter:image" content={`${import.meta.env.BASE_URL}images/kps-logo-social.jpg`} />
```

**Validation steps:**
1. Test with Facebook Sharing Debugger
2. Test with Twitter Card Validator
3. Verify meta tags in browser dev tools

#### Task 2: Sitemap and Robots.txt Update
**Claude Code Command:**
```bash
claude code "Update sitemap.xml with proper KPS Interiéry URLs and update robots.txt to reference the sitemap. Create dynamic sitemap generation for gallery pages."
```

**Files to create/modify:**
- `app/public/sitemap.xml`
- `app/public/robots.txt`

**Implementation:**
```xml
<!-- sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://kps-interiery.github.io/KPS-interiery/</loc>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
    <lastmod>2024-01-15</lastmod>
  </url>
  <url>
    <loc>https://kps-interiery.github.io/KPS-interiery/#galerie</loc>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>https://kps-interiery.github.io/KPS-interiery/#services</loc>
    <priority>0.6</priority>
    <changefreq>monthly</changefreq>
  </url>
</urlset>
```

```txt
# robots.txt
User-agent: *
Allow: /

Sitemap: https://kps-interiery.github.io/KPS-interiery/sitemap.xml
```

#### Task 3: Basic Schema Markup Implementation
**Claude Code Command:**
```bash
claude code "Implement LocalBusiness schema markup in the main layout. Add structured data for company information, address, and services. Ensure proper JSON-LD format."
```

**Files to modify:**
- `app/src/root.tsx` or `app/src/components/router-head/router-head.tsx`

**Schema implementation:**
```typescript
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://kps-interiery.github.io/KPS-interiery/",
  "name": "KPS Interiéry",
  "description": "Specializujeme se na zakázkovou výrobu nábytku na míru. Kuchyně, skříně, koupelny a kancelářský nábytek nejvyšší kvality.",
  "url": "https://kps-interiery.github.io/KPS-interiery/",
  "telephone": "+420 XXX XXX XXX", // Add real phone number
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CZ",
    "addressRegion": "Zlínský kraj",
    "addressLocality": "Přerov" // Update with actual city
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "49.4556", // Update with actual coordinates
    "longitude": "17.4503"
  },
  "sameAs": [
    "https://www.instagram.com/kps_interiery",
    "https://www.facebook.com/kpsinteriery" // Add if exists
  ],
  "priceRange": "€€€",
  "paymentAccepted": "Cash, Credit Card, Bank Transfer",
  "currenciesAccepted": "CZK, EUR"
};
```

#### Task 4: PWA Manifest Enhancement
**Claude Code Command:**
```bash
claude code "Update web manifest with proper KPS Interiéry branding, icons, and configuration. Ensure PWA compliance for better mobile SEO."
```

**Files to modify:**
- `app/public/manifest.json`

---

## 🏗️ Phase 2: URL Structure and Routing (Week 3-4)

### Gallery URL Structure Migration

#### Task 5: Implement Proper Gallery Routing
**Claude Code Command:**
```bash
claude code "Convert hash-based gallery navigation to proper URL routing. Create individual gallery pages with unique URLs, meta descriptions, and canonical tags. Implement /galerie/:category/:slug structure."
```

**Files to modify:**
- `app/src/routes/galerie/[category]/[slug]/index.tsx` (new)
- `app/src/components/GalleriesPage.tsx`
- `app/src/lib/gallery.ts`

**Routing structure:**
```
/galerie/kuchyne/bila-kuchyn-s-ostruvkem
/galerie/loznice/bilo-hneda-loznice-s-vestavenyma-skrinema
/galerie/koupelny/moderna-koupelna-cerna
/galerie/skrine/vestavena-skrin-posuvne-dvere
/galerie/ostatni/kancelar-na-miru
```

#### Task 6: Gallery Schema Markup
**Claude Code Command:**
```bash
claude code "Implement ImageGallery and ImageObject schema markup for all gallery pages. Add location-based metadata and project details."
```

**Schema structure:**
```typescript
const gallerySchema = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  "name": "Bílá kuchyň s ostrůvkem",
  "description": "Moderní bílá kuchyň s praktickým kuchyňským ostrůvkem v Přerově",
  "dateCreated": "2024-01-15",
  "creator": {
    "@type": "Organization",
    "name": "KPS Interiéry"
  },
  "locationCreated": {
    "@type": "Place",
    "name": "Přerov",
    "addressCountry": "CZ"
  },
  "image": [
    {
      "@type": "ImageObject",
      "url": "https://kps-interiery.github.io/KPS-interiery/images/galleries/kuchyn-bila-ostruvek/kuchyne_0002-web-1600w.avif",
      "description": "Bílá kuchyň s ostrůvkem - celkový pohled",
      "width": "1600",
      "height": "1200"
    }
  ]
};
```

---

## 🚀 Phase 3: Advanced SEO Features (Week 5-8)

### Performance and Technical SEO

#### Task 7: Image Sitemap Generation
**Claude Code Command:**
```bash
claude code "Create automated image sitemap generation script. Include all gallery images with proper metadata, captions, and geo-location data."
```

**Files to create:**
- `app/scripts/generate-image-sitemap.ts`
- `app/public/image-sitemap.xml`

#### Task 8: Core Web Vitals Monitoring
**Claude Code Command:**
```bash
claude code "Implement Core Web Vitals monitoring with web-vitals library. Add performance tracking and reporting to understand SEO impact."
```

**Implementation:**
```typescript
// Add to root.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export default component$(() => {
  // Web Vitals monitoring
  useClientEffect$(() => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
});
```

#### Task 9: Service Worker Implementation
**Claude Code Command:**
```bash
claude code "Implement service worker for caching AVIF images and critical resources. Optimize for offline functionality and faster repeat visits."
```

---

## 📊 Validation and Testing Framework

### Automated SEO Testing

#### Task 10: SEO Validation Scripts
**Claude Code Command:**
```bash
claude code "Create automated SEO validation scripts that check meta tags, schema markup, image alt texts, and URL structure. Include performance benchmarking."
```

**Scripts to create:**
- `app/scripts/seo-validator.ts`
- `app/scripts/schema-validator.ts`
- `app/scripts/performance-monitor.ts`

### Testing Checklist

1. **Meta Tags Validation**
   - Open Graph tags complete
   - Twitter Cards functional
   - Canonical URLs present

2. **Schema Markup Validation**
   - Google Rich Results Test
   - Schema.org validator
   - Local Business markup

3. **Performance Testing**
   - Lighthouse SEO score
   - Core Web Vitals metrics
   - Mobile usability test

4. **Content Validation**
   - All images have alt text
   - Heading hierarchy correct
   - Internal linking optimized

---

## 🎯 Implementation Timeline with Claude Code

### Week 1: Foundation (Quick Wins)
```bash
# Day 1: Meta tags and social media
claude code "Fix Open Graph and Twitter meta tags in router-head component"

# Day 2: Sitemap and robots.txt
claude code "Update sitemap.xml and robots.txt with proper URLs"

# Day 3: Basic schema markup
claude code "Implement LocalBusiness schema in main layout"

# Day 4: PWA manifest update
claude code "Enhance web manifest with KPS Interiéry branding"

# Day 5: Testing and validation
claude code "Create SEO validation scripts and run comprehensive tests"
```

### Week 2: Gallery Optimization
```bash
# Day 1-2: URL structure planning
claude code "Design and implement gallery URL routing structure"

# Day 3-4: Gallery page implementation
claude code "Create individual gallery pages with proper meta tags"

# Day 5: Gallery schema markup
claude code "Add ImageGallery schema to all gallery pages"
```

### Week 3: Advanced Features
```bash
# Day 1: Image sitemap generation
claude code "Create automated image sitemap with gallery metadata"

# Day 2: Performance monitoring
claude code "Implement Core Web Vitals tracking and reporting"

# Day 3-4: Service worker implementation
claude code "Add service worker for image caching and offline support"

# Day 5: Testing and optimization
claude code "Run performance tests and optimize based on results"
```

### Week 4: Monitoring and Refinement
```bash
# Day 1-2: Advanced schema markup
claude code "Implement Service and Product schema for furniture categories"

# Day 3: Analytics integration
claude code "Set up SEO performance tracking and reporting"

# Day 4-5: Final testing and launch
claude code "Run comprehensive SEO audit and deploy optimizations"
```

---

## 📈 Success Metrics and KPIs

### Primary SEO Metrics
1. **Organic Traffic**: +25-40% increase within 3 months
2. **Search Visibility**: +60% for gallery-related keywords
3. **Local Search Rankings**: Top 3 for "nábytek na míru [city]"
4. **Core Web Vitals**: All metrics in "Good" range

### Technical Performance Metrics
1. **Lighthouse SEO Score**: 85+ (current: ~75)
2. **Page Load Speed**: < 2 seconds (desktop), < 3 seconds (mobile)
3. **Image Search Traffic**: +50% from enhanced image SEO
4. **Social Media Shares**: +100% with improved Open Graph

### Business Impact Metrics
1. **Gallery Page Views**: +80% with proper URL structure
2. **Contact Form Submissions**: +30% from improved UX
3. **Local Business Inquiries**: +40% from enhanced local SEO
4. **Brand Search Volume**: +25% for "KPS Interiéry"

---

## 🛠️ Claude Code Best Practices for SEO Implementation

### Concurrent Execution Patterns

1. **Batch Meta Tag Updates**
```bash
claude code "Update all meta tags, schema markup, and PWA manifest in single session. Test social media previews and validate markup."
```

2. **Gallery Migration with Testing**
```bash
claude code "Implement gallery URL routing, create individual pages, add schema markup, and run comprehensive SEO validation tests."
```

3. **Performance Optimization Bundle**
```bash
claude code "Implement service worker, Core Web Vitals monitoring, and image sitemap generation. Run performance benchmarks."
```

### Validation Workflows

1. **SEO Health Check Script**
```typescript
// Automated validation after each change
export async function validateSEO() {
  const checks = [
    validateMetaTags(),
    validateSchemaMarkup(),
    validateImageAltText(),
    validateURLStructure(),
    measurePerformance()
  ];

  const results = await Promise.all(checks);
  return generateSEOReport(results);
}
```

2. **Continuous Monitoring**
```bash
# Run after each deployment
claude code "Execute SEO validation suite and generate performance report"
```

---

## 🎓 Knowledge Transfer and Documentation

### Team Education Materials

#### SEO Implementation Guide
- Step-by-step implementation instructions
- Best practices for Czech market SEO
- Common pitfalls and how to avoid them

#### Maintenance Procedures
- Monthly SEO health checks
- Performance monitoring procedures
- Content optimization workflows

#### Emergency Procedures
- SEO issue troubleshooting guide
- Performance regression recovery
- Search ranking drop investigation

---

## 📞 Support and Escalation

### Claude Code Assistance Commands

#### Quick SEO Audit
```bash
claude code "Run comprehensive SEO audit of current website state and provide prioritized improvement recommendations"
```

#### Performance Investigation
```bash
claude code "Analyze Core Web Vitals performance issues and provide specific optimization recommendations"
```

#### Schema Markup Validation
```bash
claude code "Validate all schema markup implementations and fix any Google Rich Results issues"
```

---

## Conclusion

This implementation plan provides a systematic, Claude Code-powered approach to optimizing KPS Interiéry's SEO performance. By following this structured timeline and leveraging automated testing and validation, the website will achieve significant improvements in search visibility, organic traffic, and user experience.

**Next Steps:**
1. Review and approve this implementation plan
2. Begin with Phase 1 quick wins (Week 1)
3. Monitor progress using defined KPIs
4. Adjust timeline based on results and priorities

The plan is designed to be executed efficiently using Claude Code's advanced capabilities while maintaining the website's excellent technical foundations and user experience.