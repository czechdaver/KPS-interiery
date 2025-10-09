# Cache Headers Configuration

## Summary
Lighthouse reports potential savings of **1,297 KiB** by implementing longer cache lifetimes for static assets.

**Current cache**: 10 minutes
**Recommended cache**: 1 year for versioned assets

---

## Why This Is Safe

All your static assets have **content hashes** in their filenames (e.g., `q-sjcd6Tx2.js`, `skrine-0201-web-2400w.avif`). When files change during deployment, they get new filenames, so:

✅ **Old cached files won't be used** (new URLs point to new files)
✅ **Long cache is standard best practice** for hashed assets
✅ **No risk of users seeing stale content**

---

## Recommended Cache Headers

### Static Assets (Images, JS, CSS, Fonts)
**Files**: `*.avif`, `*.jpg`, `*.svg`, `/build/*.js`, `*.css`

```
Cache-Control: public, max-age=31536000, immutable
```

**Translation**: Cache for 1 year, file never changes (immutable)

---

### HTML Pages
**Files**: `*.html`, `/`, `/galerie/*`

```
Cache-Control: public, max-age=3600, must-revalidate
```

**Translation**: Cache for 1 hour, revalidate with server

---

## Implementation by Hosting Provider

### **Cloudflare** (if using)
```
Page Rules → Create Page Rule:
  URL: *kps-interiery.cz/images/*
  Cache Level: Cache Everything
  Edge Cache TTL: 1 year
  Browser Cache TTL: 1 year

Page Rules → Create Page Rule:
  URL: *kps-interiery.cz/build/*
  Cache Level: Cache Everything
  Edge Cache TTL: 1 year
  Browser Cache TTL: 1 year
```

---

### **Apache** (.htaccess)
```apache
<IfModule mod_expires.c>
  ExpiresActive On

  # Images (AVIF, JPG, SVG)
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"

  # JavaScript
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/javascript "access plus 1 year"

  # CSS
  ExpiresByType text/css "access plus 1 year"

  # Fonts
  ExpiresByType font/woff2 "access plus 1 year"

  # HTML
  ExpiresByType text/html "access plus 1 hour"
</IfModule>

<IfModule mod_headers.c>
  # Add immutable flag for hashed assets
  <FilesMatch "\.(avif|jpg|jpeg|svg|js|css|woff2)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>

  # HTML revalidation
  <FilesMatch "\.html$">
    Header set Cache-Control "public, max-age=3600, must-revalidate"
  </FilesMatch>
</IfModule>
```

---

### **Nginx**
```nginx
location ~* \.(avif|jpg|jpeg|svg|js|css|woff2)$ {
  add_header Cache-Control "public, max-age=31536000, immutable";
  expires 1y;
}

location ~* \.html$ {
  add_header Cache-Control "public, max-age=3600, must-revalidate";
  expires 1h;
}

location /build/ {
  add_header Cache-Control "public, max-age=31536000, immutable";
  expires 1y;
}

location /images/ {
  add_header Cache-Control "public, max-age=31536000, immutable";
  expires 1y;
}
```

---

### **Vercel** (vercel.json)
```json
{
  "headers": [
    {
      "source": "/build/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, must-revalidate"
        }
      ]
    }
  ]
}
```

---

## Expected Impact

### Before
- **Browser cache**: 10 minutes
- **Repeat visits**: Redownload all assets every 10 minutes
- **Total transfer**: ~1,297 KiB per session

### After
- **Browser cache**: 1 year
- **Repeat visits**: Zero downloads (cached)
- **Total transfer**: 0 KiB on repeat visits
- **Lighthouse score**: +10-15 points

---

## Testing

### Verify Cache Headers
```bash
# Check image cache
curl -I https://kps-interiery.cz/images/galleries/kuchyn-bila-u-tvar/skrine-0201-web-2400w.avif

# Check JS cache
curl -I https://kps-interiery.cz/build/q-sjcd6Tx2.js

# Look for:
# Cache-Control: public, max-age=31536000, immutable
```

### Browser DevTools
1. Open DevTools → Network tab
2. Reload page
3. Check "Size" column for static assets
4. Should show: `(disk cache)` or `(memory cache)` on repeat visits

---

## Notes

- ⚠️ **Only applies to static assets with content hashes**
- ✅ **HTML pages should have shorter cache** (1 hour)
- ✅ **Third-party resources** (Google Fonts, hCaptcha) already have their own cache policies
- 💡 **Deploy this configuration** to production hosting provider
