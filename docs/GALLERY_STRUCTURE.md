# Gallery Structure Documentation

## 🚨 UPDATED: Complete Gallery System Overview (December 2024)

**The gallery system now contains 32+ galleries across 5 main categories, not just kitchens.**

### 1. Kuchyně (Kitchens) - 13 galleries
**Category**: Main category showcasing custom kitchen designs

#### Kitchen Galleries:
1. `kuchyn-bila-ostruvek` - Bílá kuchyň s ostrůvkem
2. `kuchyn-cerna` - Černá kuchyň
3. `kuchyn-bila-u-tvar` - Bílá kuchyň do U
4. `kuchyn-bila-podkrovi` - Bílá kuchyň v podkroví
5. `kuchyn-seda` - Šedá kuchyň
6. `kuchyn-bilo-hneda-beton` - Bílo-hnědá kuchyň s betonovým designem
7. `kuchyn-bilo-hneda-l-varianta1` - Bílo-hnědá kuchyň do L
8. `kuchyn-bilo-hneda-u-alternativa` - Bílo-hnědá kuchyň do U - alternativní řešení
9. `kuchyn-hneda-l` - Hnědá kuchyň do L
10. `kuchyn-mala-panel` - Malá panelová kuchyň
11. `kuchyn-retro-bila` - Retro bílá kuchyň
12. `kuchyn-svetla-rohova` - Světlá rohová kuchyň
13. `kuchyn-uzka-bila-l` - Bílá kuchyň do L - úzký prostor

### 2. Ložnice (Bedrooms) - 3 galleries
**Category**: Custom bedroom furniture and storage solutions

#### Bedroom Galleries:
1. `loznice-bilo-hneda` - Bílo-hnědá ložnice
2. `loznice-hneda` - Hnědá ložnice
3. `loznice-hneda-zkosene` - Hnědá ložnice se zkosenou policí

### 3. Koupelny (Bathrooms) - 3 galleries
**Category**: Modern bathroom furniture and vanities

#### Bathroom Galleries:
1. `koupelna-1` - Moderní koupelna 1
2. `koupelna-2` - Moderní koupelna 2
3. `koupelna-cerna` - Černá koupelna

### 4. Skříně a vestavěný nábytek (Wardrobes & Built-ins) - 3 galleries
**Category**: Custom wardrobes and built-in storage solutions

#### Wardrobe Galleries:
1. `skrin-a-dvere` - Skříně a dveře
2. `skrin-dvere-botnik` - Skříně, dveře a botník
3. `skrin-posuv-vstup` - Posuvné skříně do vstupu

### 5. Ostatní projekty (Other Projects) - 10+ galleries
**Category**: Office furniture, hallways, living rooms, and specialty items

#### Other Project Galleries:
1. `chodba-bila` - Bílá chodba
2. `chodba-sedo-hneda` - Šedo-hnědá chodba
3. `obyvak` - Obývací pokoj
4. `ostatni-dvere` - Dveře a další prvky
5. `ostatni-live-edge-masiv` - Live Edge masiv
6. `ostatni-schody` - Schody
7. _...and additional specialty projects_

## SEO-Optimized URL Structure

The gallery system implements a hierarchical URL structure for optimal SEO:

### URL Pattern:
- **Main Gallery Page**: `/galerie` - Shows all galleries by category
- **Individual Gallery**: `/galerie/[slug]` - Detailed gallery view with lightbox
- **Category Anchors**: `/galerie#kuchyne` - Direct navigation to category sections

### Navigation Flow:
1. **Landing Page** → `Zobrazit celou galerii` button → `/galerie`
2. **Gallery Page** → Category sections (Kuchyně, Ložnice, etc.)
3. **Gallery Cards** → `Detail galerie` button → `/galerie/[slug]`
4. **Gallery Detail** → PhotoSwipe lightbox for full image viewing

### Benefits:
- **SEO**: Each gallery has dedicated URL for indexing
- **User Experience**: Clear navigation hierarchy
- **Analytics**: Track individual gallery performance
- **Social Sharing**: Direct links to specific galleries

## Gallery Structure
Each gallery contains:
- `gallery.json` - Metadata file with gallery information
- Original image files (`*-original-resource.jpg`)
- Optimized web images in multiple formats:
  - `*-web.jpg` (main optimized JPEG)
  - `*-web-1200w.avif`, `*-web-1600w.avif` (AVIF format)
  - `*-web-1200w.jpeg`, `*-web-1600w.jpeg` (JPEG responsive)
  - `*-web-1200w.webp`, `*-web-1600w.webp` (WebP format)

## File Naming Convention
- All kitchen images: `kuchyne_XXXX-web.jpg`
- Numbers (XXXX) correspond to original photo sequence numbers

## Gallery JSON Structure
Each `gallery.json` contains:
- `id` - Unique gallery identifier
- `title` - Display title (Czech)
- `category` - "Kuchyně" (Kitchens) for all galleries
- `description` - Detailed description
- `coverImage` - Main gallery image
- `images[]` - Array of all images with metadata
- `features[]` - Key features list
- `materials[]` - Materials used
- `location` - Project location
- `date` - Completion date
- `imageCount` - Total number of images
- `coverImages[]` - Multiple cover image options

## Important Notes

### Content Accuracy
- **All galleries are KITCHENS** - previous "skrine" naming was photographer error
- File naming now accurately describes content as kitchens
- All categories in JSON files correctly set to "Kuchyně"

### Mixed Language Usage
- Gallery directories use Czech naming
- Some galleries use English prefixes (`kitchen-*`)
- JSON content is primarily in Czech
- Consider standardizing to either Czech or English for consistency

### Optimization Status
- All galleries have been processed through image optimization pipeline
- Multiple format support (AVIF, WebP, JPEG) for modern browsers
- Responsive image sizes (1200w, 1600w)
- Original high-resolution files preserved

## Recommendations

### 1. Naming Standardization
Consider standardizing gallery directory names:
- Either all Czech: `kuchyn-*`
- Or all English: `kitchen-*`

### 2. Content Organization
Current structure is correct - no changes needed to content categorization.

### 3. Documentation Maintenance
Keep this documentation updated when:
- New galleries are added
- Categories change
- Naming conventions are standardized