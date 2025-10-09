# Instagram Section Integration Analysis

## Executive Summary

This document provides a comprehensive analysis of implementing real Instagram data in the InstagramSection component. As of 2025, Instagram's API landscape has significantly changed with the deprecation of the Basic Display API, requiring careful consideration of integration approaches for a static site architecture.

**Quick Recommendation**: For a Qwik SSG (Static Site Generation) project with minimal backend infrastructure, **Option D (Build-time fetch with Graph API)** or **Option A (Third-party widget)** are the best choices, depending on budget and control requirements.

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Instagram API Landscape 2025](#instagram-api-landscape-2025)
3. [Implementation Options](#implementation-options)
4. [Detailed Implementation Plans](#detailed-implementation-plans)
5. [Comparison Matrix](#comparison-matrix)
6. [Final Recommendation](#final-recommendation)

---

## Current State Analysis

### Existing Component: `InstagramSection.tsx`

**Location**: `/app/src/components/InstagramSection.tsx`

**Current Features**:
- ✅ Modern glassmorphism design with gradient background
- ✅ Responsive grid layout (auto-fit, minmax 280px)
- ✅ Hover effects with image zoom and overlay
- ✅ Like count display with heart icon
- ✅ Caption text display
- ✅ Instagram profile CTA button
- ✅ Mobile-responsive (2 columns on tablet, 1 column on mobile)

**Current Data Source**:
```typescript
const instagramPosts = [
  {
    id: 1,
    image: "images/galleries/.../image.avif",
    alt: "Description",
    likes: 142,
    caption: "Caption text #hashtags"
  },
  // ... 6 placeholder posts using local gallery images
];
```

**What's Missing**:
- ❌ Real Instagram data from @kpsinteriery account
- ❌ Automatic updates when new posts are published
- ❌ Real like counts and engagement metrics
- ❌ Links to actual Instagram posts
- ❌ Post timestamps
- ❌ Video support (currently image-only)

---

## Instagram API Landscape 2025

### Critical Update: Basic Display API Deprecated

**⚠️ IMPORTANT**: The Instagram Basic Display API was **officially deprecated on December 4, 2024** and is no longer available for new integrations.

### Current API Options

#### 1. Instagram Graph API (Official)

**Requirements**:
- ✅ Instagram Business or Creator account
- ✅ Facebook Page linked to Instagram account
- ✅ Facebook Developer App
- ✅ Access tokens (short-lived 1hr or long-lived 60 days)

**Available Endpoints**:
```
GET /me/media
GET /{media-id}
GET /{media-id}/children (for carousels)
```

**Data Available**:
- Media ID, type (IMAGE, VIDEO, CAROUSEL_ALBUM)
- Media URL, permalink
- Caption, timestamp
- Like count, comments count (requires additional permissions)
- Thumbnail URL (for videos)

**Limitations**:
- ❌ Personal accounts NOT supported
- ❌ Requires token refresh every 60 days
- ❌ Rate limits: 200 calls per hour per user
- ❌ Requires app review for advanced permissions

#### 2. Third-Party Widget Services

**Popular Options**:

| Service | Free Plan | Paid Plans | Features |
|---------|-----------|------------|----------|
| **SociableKIT** | 5 widgets, higher views | From $5/mo | Best free plan |
| **Elfsight** | 1 widget, 200 views/mo | From $6/mo | Easy integration |
| **EmbedSocial** | Limited | From $29/mo | Advanced features |
| **Taggbox** | Limited | Custom pricing | Enterprise-grade |

**How They Work**:
1. You connect your Instagram account to their service
2. They handle all API complexity, token refresh, caching
3. You embed a JavaScript widget on your site
4. Widget auto-updates with new posts

**Pros**:
- ✅ No API knowledge required
- ✅ Automatic token management
- ✅ Built-in caching and optimization
- ✅ Customizable design

**Cons**:
- ❌ Monthly subscription costs
- ❌ External dependency
- ❌ Limited customization (depends on service)
- ❌ Privacy concerns (third-party scripts)

---

## Implementation Options

### Option A: Third-Party Embed Widget (Easiest)

**Best For**: Minimal technical overhead, quick implementation, automatic updates

**How It Works**:
1. Sign up for a widget service (e.g., SociableKIT, Elfsight)
2. Connect your Instagram account through their dashboard
3. Customize the widget appearance
4. Get embed code (JavaScript snippet)
5. Replace current InstagramSection with embed code

**Architecture**:
```
User Browser → Widget Script → Service API → Instagram Graph API
                      ↓
              Cache & Auto-refresh
```

**Cost**: $0-6/month (free plans available)

**Maintenance**: Minimal - service handles everything

---

### Option B: Instagram Graph API + Serverless Function (Most Control)

**Best For**: Full control, no third-party dependencies, custom features

**How It Works**:
1. Set up Instagram Business account + Facebook Page
2. Create Facebook Developer App
3. Implement serverless function (Cloudflare Worker or Vercel Function)
4. Function fetches from Graph API, caches results
5. Frontend calls serverless function endpoint
6. Automatic token refresh via scheduled function

**Architecture**:
```
User Browser → Qwik Frontend → Serverless Function → Instagram Graph API
                                      ↓
                              KV Storage (cache + tokens)
                                      ↓
                            Scheduled Worker (token refresh)
```

**Cost**:
- Cloudflare Workers: Free tier (100k requests/day)
- Vercel Functions: Free tier (100k invocations/month)

**Maintenance**: Medium - handle token refresh, error handling

---

### Option C: Static JSON Cache + Manual Updates (Low-Tech)

**Best For**: Infrequent updates, no automation needed, zero cost

**How It Works**:
1. Manually export Instagram posts as JSON
2. Store in `/public/data/instagram-feed.json`
3. Component loads from static JSON file
4. Update JSON file when you want to change posts (monthly/quarterly)

**Architecture**:
```
Manual Export → instagram-feed.json → Qwik Component
```

**Cost**: $0

**Maintenance**: High - manual updates required

---

### Option D: Instagram Graph API + Build-Time Fetch (SSG Approach) ⭐ RECOMMENDED

**Best For**: Static sites, automatic updates, no runtime API calls

**How It Works**:
1. Fetch Instagram data during build process
2. Cache results as static JSON
3. Rebuild site periodically (e.g., GitHub Actions cron)
4. No client-side API calls, purely static

**Architecture**:
```
GitHub Actions (daily cron)
    ↓
Fetch from Instagram Graph API
    ↓
Generate static JSON
    ↓
Qwik Build (SSG)
    ↓
Deploy static site
```

**Cost**: $0 (using GitHub Actions free tier)

**Maintenance**: Low - automated with scheduled builds

---

## Detailed Implementation Plans

### Implementation Plan: Option D (Build-Time Fetch) ⭐ RECOMMENDED

This is the best approach for a Qwik SSG site with static hosting.

#### Step 1: Set Up Instagram Business Account

**Prerequisites**:
1. Convert Instagram account to Business or Creator account
   - Go to Instagram Settings → Account → Switch to Professional Account
2. Create a Facebook Page (if you don't have one)
   - Go to facebook.com/pages/create
3. Link Instagram to Facebook Page
   - Settings → Linked Accounts → Facebook → Connect

#### Step 2: Create Facebook Developer App

1. Go to https://developers.facebook.com/apps/
2. Click "Create App"
3. Select "Consumer" type
4. Fill in app details:
   - App Name: "KPS Interiery Website"
   - App Contact Email: your email
5. Add "Instagram Graph API" product
6. Complete app setup

#### Step 3: Generate Access Tokens

**Get Short-Lived Token**:
1. Go to Graph API Explorer: https://developers.facebook.com/tools/explorer/
2. Select your app
3. Add permissions: `instagram_basic`, `pages_show_list`, `pages_read_engagement`
4. Click "Generate Access Token"
5. Copy the token (valid for 1 hour)

**Exchange for Long-Lived Token** (60 days):
```bash
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={short-lived-token}"
```

**Get Instagram Business Account ID**:
```bash
curl -X GET "https://graph.facebook.com/v18.0/me/accounts?access_token={long-lived-token}"
```

Find your page ID, then:
```bash
curl -X GET "https://graph.facebook.com/v18.0/{page-id}?fields=instagram_business_account&access_token={long-lived-token}"
```

#### Step 4: Create Instagram API Service

**File**: `/app/src/lib/instagram-api.ts`

```typescript
/**
 * Instagram Graph API Service
 * Fetches posts from Instagram Business account
 */

export interface InstagramPost {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  caption: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
  thumbnail_url?: string; // For videos
}

interface InstagramAPIResponse {
  data: InstagramPost[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

/**
 * Fetch Instagram posts from Graph API
 */
export async function fetchInstagramPosts(
  accessToken: string,
  igUserId: string,
  limit: number = 6
): Promise<InstagramPost[]> {
  const fields = [
    'id',
    'media_type',
    'media_url',
    'permalink',
    'caption',
    'timestamp',
    'like_count',
    'comments_count',
    'thumbnail_url'
  ].join(',');

  const url = `https://graph.instagram.com/v18.0/${igUserId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
    }

    const data: InstagramAPIResponse = await response.json();

    // Filter out videos if needed (optional)
    // return data.data.filter(post => post.media_type !== 'VIDEO');

    return data.data;
  } catch (error) {
    console.error('Failed to fetch Instagram posts:', error);
    throw error;
  }
}

/**
 * Transform Instagram API data to component format
 */
export function transformInstagramData(posts: InstagramPost[]) {
  return posts.map((post, index) => ({
    id: index + 1,
    instagramId: post.id,
    image: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
    permalink: post.permalink,
    alt: post.caption ? post.caption.substring(0, 100) : 'Instagram post',
    likes: post.like_count || 0,
    caption: post.caption || '',
    timestamp: post.timestamp,
    mediaType: post.media_type
  }));
}
```

#### Step 5: Create Build-Time Fetch Script

**File**: `/app/scripts/fetch-instagram.ts`

```typescript
#!/usr/bin/env node
/**
 * Fetch Instagram posts at build time
 * Run this as part of the build process
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration from environment variables
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || '';
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID || '';
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'data', 'instagram-feed.json');

interface InstagramPost {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  caption: string;
  timestamp: string;
  like_count?: number;
  thumbnail_url?: string;
}

async function fetchInstagramPosts(): Promise<InstagramPost[]> {
  if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_USER_ID) {
    console.warn('⚠️  Instagram credentials not found in environment variables');
    console.warn('   Set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID');
    return [];
  }

  const fields = [
    'id',
    'media_type',
    'media_url',
    'permalink',
    'caption',
    'timestamp',
    'like_count',
    'thumbnail_url'
  ].join(',');

  const url = `https://graph.instagram.com/v18.0/${INSTAGRAM_USER_ID}/media?fields=${fields}&limit=6&access_token=${INSTAGRAM_ACCESS_TOKEN}`;

  console.log('📸 Fetching Instagram posts...');

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Instagram API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log(`✅ Fetched ${data.data.length} posts from Instagram`);

    return data.data;
  } catch (error) {
    console.error('❌ Failed to fetch Instagram posts:', error);
    throw error;
  }
}

async function main() {
  try {
    // Ensure output directory exists
    await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });

    // Fetch posts from Instagram
    const posts = await fetchInstagramPosts();

    if (posts.length === 0) {
      console.warn('⚠️  No posts fetched, keeping existing data if available');
      return;
    }

    // Transform data for component
    const transformedPosts = posts.map((post, index) => ({
      id: index + 1,
      instagramId: post.id,
      image: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
      permalink: post.permalink,
      alt: post.caption ? post.caption.substring(0, 100) : 'Instagram post',
      likes: post.like_count || 0,
      caption: post.caption || '',
      timestamp: post.timestamp,
      mediaType: post.media_type
    }));

    // Write to file
    await fs.writeFile(
      OUTPUT_FILE,
      JSON.stringify({
        posts: transformedPosts,
        lastUpdated: new Date().toISOString()
      }, null, 2)
    );

    console.log(`✅ Instagram feed saved to ${OUTPUT_FILE}`);
    console.log(`   Last updated: ${new Date().toISOString()}`);
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();
```

#### Step 6: Update InstagramSection Component

**File**: `/app/src/components/InstagramSection.tsx`

```typescript
import { component$, useStylesScoped$, useSignal, useTask$ } from "@builder.io/qwik";
import { PhHeart, PhInstagramLogo } from "~/components/icons";

const styles = `
  /* ... existing styles ... */

  .instagram-post-link {
    text-decoration: none;
    color: inherit;
    display: block;
  }
`;

interface InstagramFeedData {
  posts: Array<{
    id: number;
    instagramId: string;
    image: string;
    permalink: string;
    alt: string;
    likes: number;
    caption: string;
    timestamp: string;
    mediaType: string;
  }>;
  lastUpdated: string;
}

export const InstagramSection = component$(() => {
  useStylesScoped$(styles);

  const instagramPosts = useSignal<InstagramFeedData['posts']>([]);
  const isLoading = useSignal(true);
  const hasError = useSignal(false);

  useTask$(async () => {
    try {
      // Fetch from static JSON file generated at build time
      const baseUrl = import.meta.env.BASE_URL || '/';
      const response = await fetch(`${baseUrl}data/instagram-feed.json`);

      if (!response.ok) {
        throw new Error('Failed to load Instagram feed');
      }

      const data: InstagramFeedData = await response.json();
      instagramPosts.value = data.posts;
      isLoading.value = false;
    } catch (error) {
      console.error('Failed to load Instagram posts:', error);
      hasError.value = true;
      isLoading.value = false;

      // Fallback to placeholder data
      instagramPosts.value = [
        {
          id: 1,
          instagramId: 'placeholder',
          image: (import.meta.env.BASE_URL || "/") + "images/galleries/kuchyn-retro-bila/kuchyne_0094-web-400w.avif",
          permalink: "https://instagram.com/kpsinteriery",
          alt: "Modern retro kitchen realization",
          likes: 142,
          caption: "Nová kuchyň pro spokojené zákazníky ✨ #kpsinteriery #kuchynenámíru",
          timestamp: new Date().toISOString(),
          mediaType: 'IMAGE'
        }
        // ... add more fallback posts
      ];
    }
  });

  return (
    <section class="instagram-section section">
      <div class="container">
        <div class="instagram-header">
          <h2 class="section-title-bright">Sledujte nás na Instagramu</h2>
          <p class="section-description">
            Nejnovější realizace a zákulisí naší práce najdete na našem Instagram profilu
          </p>
        </div>

        {isLoading.value ? (
          <div style="text-align: center; padding: 4rem 0; color: rgba(255,255,255,0.8);">
            Načítání Instagram příspěvků...
          </div>
        ) : (
          <div class="instagram-grid">
            {instagramPosts.value.map((post) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                class="instagram-post instagram-post-link"
              >
                <div class="instagram-image-container">
                  <img
                    src={post.image}
                    alt={post.alt}
                    class="instagram-image"
                    width="300"
                    height="300"
                    loading="lazy"
                  />
                  <div class="instagram-overlay">
                    <div class="instagram-stats">
                      <div class="instagram-likes">
                        <PhHeart size={24} class="icon-duotone-reverse" />
                        {post.likes}
                      </div>
                      <div class="instagram-icon">
                        <PhInstagramLogo size={32} class="icon-duotone" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="instagram-caption">
                  <p>{post.caption}</p>
                </div>
              </a>
            ))}
          </div>
        )}

        <div class="instagram-cta">
          <a
            href="https://instagram.com/kpsinteriery"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-accent"
          >
            <PhInstagramLogo size={24} style="margin-right: 0.5rem;" />
            Sledovat na Instagramu
          </a>
        </div>
      </div>
    </section>
  );
});
```

#### Step 7: Update Build Configuration

**File**: `/app/package.json`

Add new script:
```json
{
  "scripts": {
    "instagram:fetch": "tsx scripts/fetch-instagram.ts",
    "prebuild": "npm run instagram:fetch",
    "build": "qwik build",
    "build:static": "qwik build && vite build -c adapters/static/vite.config.ts"
  }
}
```

Install dependencies:
```bash
npm install --save-dev tsx
```

#### Step 8: Set Up Environment Variables

**File**: `.env.local` (DO NOT commit this)

```bash
# Instagram Graph API Credentials
INSTAGRAM_ACCESS_TOKEN=your_long_lived_access_token_here
INSTAGRAM_USER_ID=your_instagram_business_account_id_here
```

**File**: `.env.example` (commit this)

```bash
# Instagram Graph API Credentials
# Get access token from: https://developers.facebook.com/tools/explorer/
# Get user ID by following steps in INSTAGRAM_INTEGRATION_ANALYSIS.md
INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_USER_ID=
```

#### Step 9: Create GitHub Actions Workflow (Optional but Recommended)

**File**: `.github/workflows/rebuild-instagram.yml`

```yaml
name: Rebuild Instagram Feed

on:
  schedule:
    # Run daily at 6 AM UTC (adjust as needed)
    - cron: '0 6 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  rebuild:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci
        working-directory: ./app

      - name: Fetch Instagram posts
        env:
          INSTAGRAM_ACCESS_TOKEN: ${{ secrets.INSTAGRAM_ACCESS_TOKEN }}
          INSTAGRAM_USER_ID: ${{ secrets.INSTAGRAM_USER_ID }}
        run: npm run instagram:fetch
        working-directory: ./app

      - name: Build site
        run: npm run build:static
        working-directory: ./app

      - name: Deploy to hosting
        # Add your deployment step here (e.g., Vercel, Netlify, GitHub Pages)
        run: echo "Add deployment command"
```

**Set GitHub Secrets**:
1. Go to repository Settings → Secrets and variables → Actions
2. Add secrets:
   - `INSTAGRAM_ACCESS_TOKEN`
   - `INSTAGRAM_USER_ID`

#### Step 10: Token Refresh Strategy

Long-lived tokens expire after 60 days. You have two options:

**Option A: Manual Refresh (Simple)**
1. Set a calendar reminder for 55 days
2. Regenerate token using Graph API Explorer
3. Update GitHub secrets

**Option B: Automated Refresh (Advanced)**

Create a separate serverless function that runs monthly:

**File**: `/app/scripts/refresh-instagram-token.ts`

```typescript
/**
 * Refresh Instagram access token
 * Long-lived tokens expire after 60 days
 * Run this monthly to keep token fresh
 */

const APP_ID = process.env.FACEBOOK_APP_ID || '';
const APP_SECRET = process.env.FACEBOOK_APP_SECRET || '';
const CURRENT_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || '';

async function refreshAccessToken() {
  const url = `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${CURRENT_TOKEN}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.access_token) {
    console.log('✅ New access token generated');
    console.log('   Token:', data.access_token);
    console.log('   Expires in:', data.expires_in, 'seconds');
    console.log('\n⚠️  Update this token in your GitHub secrets!');
  } else {
    console.error('❌ Failed to refresh token:', data);
  }
}

refreshAccessToken();
```

---

### Implementation Plan: Option A (Third-Party Widget)

This is the easiest option if you prefer minimal setup and don't mind a monthly cost.

#### Step 1: Choose a Widget Service

**Recommended: SociableKIT** (best free plan)
- 5 widgets free
- Higher view limits
- Clean, customizable design

**Alternative: Elfsight**
- 1 widget, 200 views/month free
- Very easy setup
- $6/month for more features

#### Step 2: Set Up Account

1. Go to https://www.sociablekit.com/ (or chosen service)
2. Sign up for free account
3. Connect your Instagram account
4. Select posts to display (latest, specific hashtag, etc.)
5. Customize design to match your site

#### Step 3: Get Embed Code

1. In dashboard, configure widget settings:
   - Layout: Grid
   - Number of posts: 6
   - Show captions: Yes
   - Show likes: Yes
2. Click "Get Embed Code"
3. Copy the JavaScript snippet

#### Step 4: Update InstagramSection Component

Replace entire component with widget:

```typescript
import { component$, useStylesScoped$ } from "@builder.io/qwik";

const styles = `
  .instagram-section {
    background: linear-gradient(135deg, var(--primary) 0%, var(--dark-gray) 100%);
    color: var(--white);
    border-top: 1px solid rgba(200, 139, 78, 0.2);
    border-bottom: 1px solid rgba(200, 139, 78, 0.2);
  }

  .instagram-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .instagram-widget-container {
    max-width: 1200px;
    margin: 0 auto;
  }
`;

export const InstagramSection = component$(() => {
  useStylesScoped$(styles);

  return (
    <section class="instagram-section section">
      <div class="container">
        <div class="instagram-header">
          <h2 class="section-title-bright">Sledujte nás na Instagramu</h2>
          <p class="section-description">
            Nejnovější realizace a zákulisí naší práce najdete na našem Instagram profilu
          </p>
        </div>

        <div class="instagram-widget-container">
          {/* Replace this with your widget embed code */}
          <div
            dangerouslySetInnerHTML={`
              <!-- SociableKIT Instagram Widget Code -->
              <div class='sk-instagram-feed' data-embed-id='your-widget-id'></div>
              <script src='https://widgets.sociablekit.com/instagram-feed/widget.js' async defer></script>
            `}
          />
        </div>
      </div>
    </section>
  );
});
```

#### Step 5: Style Customization (Optional)

Add custom CSS to match your design:

```css
/* Override widget styles to match your brand */
.sk-instagram-feed {
  --sk-card-bg: rgba(255, 255, 255, 0.8) !important;
  --sk-card-border: rgba(200, 139, 78, 0.2) !important;
  --sk-text-color: var(--dark-gray) !important;
}

.sk-instagram-feed .sk-instagram-post {
  border-radius: var(--radius-lg) !important;
  backdrop-filter: blur(10px);
}
```

---

## Comparison Matrix

| Feature | Option A<br>(Widget) | Option B<br>(Serverless) | Option C<br>(Manual) | Option D<br>(Build-time) ⭐ |
|---------|---------------------|--------------------------|---------------------|---------------------------|
| **Setup Complexity** | ⭐⭐⭐⭐⭐ Very Easy | ⭐⭐ Complex | ⭐⭐⭐⭐ Easy | ⭐⭐⭐ Medium |
| **Cost** | $0-6/month | $0 | $0 | $0 |
| **Maintenance** | ⭐⭐⭐⭐⭐ Minimal | ⭐⭐⭐ Medium | ⭐ High (manual) | ⭐⭐⭐⭐ Low (automated) |
| **Auto Updates** | ✅ Real-time | ✅ Near real-time | ❌ Manual only | ✅ On build (daily) |
| **Performance** | ⭐⭐⭐ Good (3rd party JS) | ⭐⭐⭐⭐ Great (cached) | ⭐⭐⭐⭐⭐ Perfect (static) | ⭐⭐⭐⭐⭐ Perfect (static) |
| **Customization** | ⭐⭐⭐ Limited | ⭐⭐⭐⭐⭐ Full control | ⭐⭐⭐⭐⭐ Full control | ⭐⭐⭐⭐⭐ Full control |
| **Privacy** | ⭐⭐⭐ 3rd party scripts | ⭐⭐⭐⭐ Your infrastructure | ⭐⭐⭐⭐⭐ No tracking | ⭐⭐⭐⭐⭐ No tracking |
| **Backend Required** | ❌ No | ✅ Yes (serverless) | ❌ No | ❌ No (build-time only) |
| **Token Management** | ⭐⭐⭐⭐⭐ Automatic | ⭐⭐⭐ Need to handle | N/A | ⭐⭐⭐ Need to handle |
| **Business Account** | ❌ Not required | ✅ Required | ❌ Not required | ✅ Required |
| **Best For** | Quick setup, minimal tech | Full control, real-time | Rare updates | Static sites, automation |

---

## Final Recommendation

### Primary Recommendation: **Option D (Build-Time Fetch)** ⭐

**Why this is best for KPS Interiéry**:

✅ **Perfect for Static Sites**: Qwik SSG architecture aligns perfectly with build-time data fetching

✅ **Zero Runtime Cost**: No serverless functions, no API calls at runtime = blazing fast

✅ **Automatic Updates**: GitHub Actions cron job rebuilds daily with fresh Instagram data

✅ **Full Control**: Custom design, no third-party dependencies, no tracking scripts

✅ **SEO Optimized**: Instagram data is part of static HTML, fully indexable

✅ **Privacy-Friendly**: No third-party scripts loading on user browsers

✅ **Free**: GitHub Actions free tier includes 2,000 minutes/month (way more than needed)

**Trade-offs**:
- Requires Instagram Business account (easy to convert)
- Token refresh needed every 60 days (can be automated)
- Updates limited to rebuild frequency (daily is more than enough for most businesses)

### Alternative: **Option A (Third-Party Widget)**

**Choose this if**:
- You want to launch ASAP (setup in 30 minutes)
- You don't want to manage API tokens
- Budget allows $6/month ($72/year)
- You prefer managed solution over DIY

**Best service**: SociableKIT (better free plan than Elfsight)

---

## Migration Steps (Option D)

### Phase 1: Setup (Week 1)
1. Convert Instagram to Business account
2. Create Facebook Page and link accounts
3. Set up Facebook Developer App
4. Generate access tokens
5. Add environment variables

### Phase 2: Development (Week 1)
1. Create `instagram-api.ts` service
2. Create `fetch-instagram.ts` build script
3. Update `InstagramSection.tsx` component
4. Test locally with real data

### Phase 3: Automation (Week 2)
1. Create GitHub Actions workflow
2. Add secrets to repository
3. Test automated rebuild
4. Monitor first few runs

### Phase 4: Maintenance
1. Set calendar reminder for 55 days (token refresh)
2. Monitor daily builds
3. Update token when needed

---

## Security Considerations

### Access Token Security

**DO**:
- ✅ Store tokens in environment variables
- ✅ Use GitHub Secrets for CI/CD
- ✅ Never commit tokens to git
- ✅ Rotate tokens every 60 days (or less)
- ✅ Use long-lived tokens (not short-lived)

**DON'T**:
- ❌ Hardcode tokens in source code
- ❌ Commit `.env` files
- ❌ Share tokens in chat/email
- ❌ Use tokens in client-side code

### Rate Limiting

Instagram Graph API limits:
- 200 calls per hour per user
- Build-time fetch uses ~1 call per build
- Daily rebuilds = ~30 calls per month
- Well within limits ✅

---

## Troubleshooting

### Common Issues

#### Issue: "Invalid OAuth access token"

**Solution**:
- Token may have expired (60-day limit)
- Generate new long-lived token
- Update environment variables

#### Issue: "User does not have permission"

**Solution**:
- Ensure Instagram account is Business or Creator
- Check Facebook Page is linked
- Verify app has `instagram_basic` permission

#### Issue: "Cannot read property 'data' of undefined"

**Solution**:
- Check API response structure
- Verify Instagram User ID is correct
- Check network connectivity during build

#### Issue: GitHub Actions failing

**Solution**:
- Verify secrets are set correctly
- Check Node version compatibility
- Review build logs for specific errors

---

## Future Enhancements

### Potential Features
1. **Video Support**: Display video thumbnails with play icon
2. **Carousel Support**: Show multiple images from carousel posts
3. **Comments Display**: Fetch and show recent comments
4. **Story Highlights**: Fetch and display story highlights
5. **Analytics Dashboard**: Track engagement metrics over time
6. **Hashtag Filtering**: Filter posts by specific hashtags
7. **Manual Curation**: Allow selecting which posts to display

### Advanced Options
1. **Incremental Static Regeneration (ISR)**: If moving to Vercel, use ISR for automatic rebuilds
2. **Edge Function Caching**: Implement smart caching with stale-while-revalidate
3. **Multi-Account Support**: Aggregate posts from multiple Instagram accounts

---

## Resources

### Official Documentation
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api/)
- [Access Tokens Guide](https://developers.facebook.com/docs/instagram-basic-display-api/overview#instagram-user-access-tokens)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)

### Third-Party Services
- [SociableKIT](https://www.sociablekit.com/)
- [Elfsight](https://elfsight.com/instagram-feed-instashow/)
- [EmbedSocial](https://embedsocial.com/)

### Community Resources
- [Instagram API Reddit](https://www.reddit.com/r/InstagramAPI/)
- [Stack Overflow - Instagram Tag](https://stackoverflow.com/questions/tagged/instagram-api)

---

## Cost Breakdown

### Option D (Build-time Fetch) - RECOMMENDED
- Instagram Business Account: **$0**
- Facebook Developer App: **$0**
- GitHub Actions (2,000 min/month free): **$0**
- Total: **$0/month** ✅

### Option A (Third-Party Widget)
- SociableKIT Free: **$0** (limited features)
- SociableKIT Pro: **$5/month**
- Elfsight Basic: **$6/month**
- Total: **$0-6/month**

### Option B (Serverless Function)
- Cloudflare Workers (100k req/day): **$0**
- Vercel Functions (100k calls/month): **$0**
- Total: **$0/month** (unless exceeding free tier)

---

## Conclusion

For the KPS Interiéry website, **Option D (Build-Time Fetch with Instagram Graph API)** is the optimal solution. It provides:

- **Zero cost** with GitHub Actions free tier
- **Perfect performance** with static site generation
- **Full control** over design and data
- **Privacy-friendly** with no third-party scripts
- **Automatic updates** via scheduled builds

The initial setup requires some technical work (1-2 weeks), but once configured, the system runs autonomously with minimal maintenance (just token refresh every 60 days).

If speed-to-market is critical and budget allows, **Option A (Third-Party Widget)** offers the fastest implementation path (30 minutes) at a reasonable cost ($6/month = $72/year).

---

**Document Version**: 1.0
**Last Updated**: October 2025
**Author**: KPS Interiéry Development Team
**Next Review**: Token expiration check (60 days from setup)
