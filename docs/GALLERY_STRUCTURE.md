# Gallery Structure Documentation

## Overview
The project contains kitchen galleries showcasing interior design work - all 11 galleries are kitchens:

### 1. Main Kitchen Galleries (Kuchyně) - 8 galleries
**Naming Pattern**: `kuchyn-*` (Czech) or `kitchen-*` (English)

#### Kitchen Gallery List:
1. `kitchen-white-attic` - Bílá kuchyň v podkroví (White kitchen in attic)
2. `kuchyn-bila-ostruvek` - Bílá kuchyň s ostrůvkem (White kitchen with island)
3. `kuchyn-bila-u-tvar` - Bílá kuchyň do U (White U-shaped kitchen)
4. `kuchyn-bilo-hneda-beton` - Bílo-hnědá kuchyň s betonem (White-brown kitchen with concrete)
5. `kuchyn-bilo-hneda-l-varianta1` - Bílo-hnědá kuchyň do L (White-brown L-shaped kitchen)
6. `kuchyn-bilo-hneda-u-alternativa` - Bílo-hnědá kuchyň do U alternativa (White-brown U-shaped kitchen alternative)
7. `kuchyn-cerna` - Černá kuchyň (Black kitchen)
8. `kuchyn-seda` - Šedá kuchyň (Grey kitchen)

### 2. Additional Kitchen Galleries - 3 galleries
**Naming Pattern**: `kuchyn-*` (Czech for kitchens)

#### Additional Kitchen Gallery List:
1. `kuchyn-hneda-l` - Hnědá kuchyň do L (Brown L-shaped kitchen)
2. `kuchyn-mala-panel` - Malá panelová kuchyň (Small panel kitchen)  
3. `kuchyn-retro-bila` - Retro bílá kuchyň (Retro white kitchen)

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