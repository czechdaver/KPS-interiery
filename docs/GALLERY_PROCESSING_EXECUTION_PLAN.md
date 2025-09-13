# 🚀 Gallery Processing Execution Plan
## Processing 17 Galleries with 208+ Images

### 📊 Project Overview
- **Total Galleries to Process**: 17
- **Total Original Images**: 208
- **Expected Output**:
  - 208 web-optimized JPG fallbacks
  - 800-1000 AVIF variants (depending on source dimensions)
  - 17 gallery.json metadata files

### 🎯 Galleries Requiring Processing
```
Gallery Name                 | Images | Status
-----------------------------|--------|------------------
chodba-bila                  | 4      | Needs full processing
chodba-sedo-hneda           | 6      | Needs full processing
koupelna-1                  | 4      | Needs full processing
koupelna-2                  | 6      | Needs full processing
koupelna-cerna              | 4      | Needs full processing
kuchyn-svetla-rohova        | 9      | Needs full processing
kuchyn-uzka-bila-l          | 6      | Needs full processing
loznice-bilo-hneda          | 12     | Needs full processing
loznice-hneda               | 5      | Needs full processing
loznice-hneda-zkosene       | 6      | Needs full processing
obyvak                      | 4      | Needs full processing
ostatni-dvere               | 20     | Needs full processing
ostatni-live-edge-masiv     | 6      | Needs full processing
ostatni-schody              | 6      | Needs full processing
skrin-a-dvere               | 9      | Needs full processing
skrin-dvere-botnik          | 9      | Needs full processing
skrin-posuv-vstup           | 5      | Needs full processing
-----------------------------|--------|------------------
TOTAL                       | 121    | (corrected count)
```

## 🔧 Phase 1: Project Setup & Validation

### Task 1.1: Initialize Processing Environment
```bash
# Verify Sharp and image processing dependencies
npm list sharp vite-imagetools @viteimagetools/vite
npm install --save-dev sharp vite-imagetools

# Create processing logs directory
mkdir -p /tmp/gallery-processing-logs

# Verify ImageMagick/Sharp CLI tools
which magick || echo "ImageMagick not found"
node -e "console.log(require('sharp')().format)"
```

### Task 1.2: Backup and Safety Checks
```bash
# Create backup of current gallery state
rsync -av /Users/David/Projects/kps-interier/app/public/images/galleries/ \
          /Users/David/Projects/kps-interier/backups/galleries-$(date +%Y%m%d-%H%M%S)/

# Verify no existing web variants will be overwritten
find /Users/David/Projects/kps-interier/app/public/images/galleries \
     -name "*-web.jpg" | wc -l  # Should be low number for new galleries
```

## 🔍 Phase 2: Image Analysis & Dimension Scanning

### Task 2.1: Comprehensive Dimension Analysis
```bash
# Create dimension analysis script
cat > /tmp/analyze-dimensions.js << 'EOF'
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function analyzeDimensions(galleryPath) {
  const results = [];
  const files = fs.readdirSync(galleryPath)
    .filter(f => f.endsWith('-original-resource.jpg'));

  for (const file of files) {
    const filePath = path.join(galleryPath, file);
    const metadata = await sharp(filePath).metadata();
    results.push({
      file: file,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: fs.statSync(filePath).size
    });
  }
  return results;
}

async function processAllGalleries() {
  const basePath = '/Users/David/Projects/kps-interier/app/public/images/galleries';
  const galleries = [
    'chodba-bila', 'chodba-sedo-hneda', 'koupelna-1', 'koupelna-2',
    'koupelna-cerna', 'kuchyn-svetla-rohova', 'kuchyn-uzka-bila-l',
    'loznice-bilo-hneda', 'loznice-hneda', 'loznice-hneda-zkosene',
    'obyvak', 'ostatni-dvere', 'ostatni-live-edge-masiv', 'ostatni-schody',
    'skrin-a-dvere', 'skrin-dvere-botnik', 'skrin-posuv-vstup'
  ];

  const report = {};
  for (const gallery of galleries) {
    const galleryPath = path.join(basePath, gallery);
    if (fs.existsSync(galleryPath)) {
      report[gallery] = await analyzeDimensions(galleryPath);
    }
  }

  fs.writeFileSync('/tmp/dimensions-report.json', JSON.stringify(report, null, 2));
  console.log('Dimension analysis complete. Report saved to /tmp/dimensions-report.json');
}

processAllGalleries().catch(console.error);
EOF

# Run dimension analysis
cd /Users/David/Projects/kps-interier && node /tmp/analyze-dimensions.js
```

### Task 2.2: AVIF Size Planning
```bash
# Create AVIF size planning script
cat > /tmp/plan-avif-sizes.js << 'EOF'
const fs = require('fs');
const dimensionReport = JSON.parse(fs.readFileSync('/tmp/dimensions-report.json'));

const sizesToGenerate = [400, 800, 1200, 1600, 2400];

function planOptimalSizes(width, height) {
  return sizesToGenerate.filter(size => width >= size);
}

const processingPlan = {};
let totalVariants = 0;

for (const [gallery, images] of Object.entries(dimensionReport)) {
  processingPlan[gallery] = images.map(img => {
    const optimalSizes = planOptimalSizes(img.width, img.height);
    totalVariants += optimalSizes.length;
    return {
      ...img,
      avifSizes: optimalSizes,
      expectedFiles: optimalSizes.length + 1 // +1 for web.jpg
    };
  });
}

console.log(`Total AVIF variants to generate: ${totalVariants}`);
fs.writeFileSync('/tmp/processing-plan.json', JSON.stringify(processingPlan, null, 2));
EOF

cd /Users/David/Projects/kps-interier && node /tmp/plan-avif-sizes.js
```

## 🖼️ Phase 3: Parallel Image Processing

### Task 3.1: Generate Web-Optimized JPG Fallbacks
```bash
# Create web JPG generation script for parallel processing
cat > /tmp/generate-web-jpg.js << 'EOF'
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateWebJpg(inputPath, outputPath) {
  await sharp(inputPath)
    .jpeg({
      quality: 85,
      progressive: true,
      mozjpeg: true
    })
    .resize(2560, 2560, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .toFile(outputPath);
}

async function processGallery(galleryName) {
  const galleryPath = `/Users/David/Projects/kps-interier/app/public/images/galleries/${galleryName}`;
  const files = fs.readdirSync(galleryPath)
    .filter(f => f.endsWith('-original-resource.jpg'));

  const promises = files.map(async (file) => {
    const inputPath = path.join(galleryPath, file);
    const outputFile = file.replace('-original-resource.jpg', '-web.jpg');
    const outputPath = path.join(galleryPath, outputFile);

    if (!fs.existsSync(outputPath)) {
      await generateWebJpg(inputPath, outputPath);
      console.log(`Generated: ${galleryName}/${outputFile}`);
    }
  });

  await Promise.all(promises);
  console.log(`Completed gallery: ${galleryName}`);
}

const galleries = process.argv.slice(2);
Promise.all(galleries.map(processGallery)).then(() => {
  console.log('All web JPG generation complete');
});
EOF

# Run web JPG generation in parallel batches
cd /Users/David/Projects/kps-interier && node /tmp/generate-web-jpg.js \
  chodba-bila chodba-sedo-hneda koupelna-1 koupelna-2 koupelna-cerna &

cd /Users/David/Projects/kps-interier && node /tmp/generate-web-jpg.js \
  kuchyn-svetla-rohova kuchyn-uzka-bila-l loznice-bilo-hneda loznice-hneda &

cd /Users/David/Projects/kps-interier && node /tmp/generate-web-jpg.js \
  loznice-hneda-zkosene obyvak ostatni-dvere &

cd /Users/David/Projects/kps-interier && node /tmp/generate-web-jpg.js \
  ostatni-live-edge-masiv ostatni-schody skrin-a-dvere skrin-dvere-botnik skrin-posuv-vstup &

# Wait for all background jobs
wait
```

### Task 3.2: Generate AVIF Variants in Multiple Sizes
```bash
# Create AVIF generation script
cat > /tmp/generate-avif.js << 'EOF'
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizesToGenerate = [400, 800, 1200, 1600, 2400];

async function generateAvifSizes(inputPath, baseName, outputDir) {
  const metadata = await sharp(inputPath).metadata();
  const sourceWidth = metadata.width;

  const validSizes = sizesToGenerate.filter(size => sourceWidth >= size);

  const promises = validSizes.map(async (size) => {
    const outputFile = `${baseName}-web-${size}w.avif`;
    const outputPath = path.join(outputDir, outputFile);

    if (!fs.existsSync(outputPath)) {
      await sharp(inputPath)
        .resize(size, null, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .avif({
          quality: 75,
          effort: 6
        })
        .toFile(outputPath);

      console.log(`Generated: ${outputFile}`);
    }
  });

  await Promise.all(promises);
}

async function processGalleryAvif(galleryName) {
  const galleryPath = `/Users/David/Projects/kps-interier/app/public/images/galleries/${galleryName}`;
  const files = fs.readdirSync(galleryPath)
    .filter(f => f.endsWith('-original-resource.jpg'));

  for (const file of files) {
    const inputPath = path.join(galleryPath, file);
    const baseName = file.replace('-original-resource.jpg', '');
    await generateAvifSizes(inputPath, baseName, galleryPath);
  }

  console.log(`AVIF generation complete for: ${galleryName}`);
}

const galleries = process.argv.slice(2);
Promise.all(galleries.map(processGalleryAvif)).then(() => {
  console.log('All AVIF generation complete');
});
EOF

# Run AVIF generation in parallel batches (more CPU intensive)
cd /Users/David/Projects/kps-interier && node /tmp/generate-avif.js \
  chodba-bila chodba-sedo-hneda koupelna-1 &

cd /Users/David/Projects/kps-interier && node /tmp/generate-avif.js \
  koupelna-2 koupelna-cerna kuchyn-svetla-rohova &

cd /Users/David/Projects/kps-interier && node /tmp/generate-avif.js \
  kuchyn-uzka-bila-l loznice-bilo-hneda loznice-hneda &

cd /Users/David/Projects/kps-interier && node /tmp/generate-avif.js \
  loznice-hneda-zkosene obyvak &

cd /Users/David/Projects/kps-interier && node /tmp/generate-avif.js \
  ostatni-dvere ostatni-live-edge-masiv &

cd /Users/David/Projects/kps-interier && node /tmp/generate-avif.js \
  ostatni-schody skrin-a-dvere &

cd /Users/David/Projects/kps-interier && node /tmp/generate-avif.js \
  skrin-dvere-botnik skrin-posuv-vstup &

# Wait for all AVIF generation
wait
```

## 📋 Phase 4: Gallery.json Metadata Creation

### Task 4.1: Generate Gallery Metadata
```bash
# Create gallery.json generation script
cat > /tmp/generate-gallery-json.js << 'EOF'
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const categoryMapping = {
  'kuchyn': 'Kuchyně',
  'koupelna': 'Koupelny',
  'loznice': 'Ložnice',
  'obyvak': 'Obývací pokoje',
  'chodba': 'Chodby a předsíně',
  'skrin': 'Skříně a úložné prostory',
  'ostatni': 'Ostatní realizace'
};

function determineCategory(galleryName) {
  for (const [key, value] of Object.entries(categoryMapping)) {
    if (galleryName.includes(key)) return value;
  }
  return 'Ostatní realizace';
}

function generateTitle(galleryName) {
  const titleMap = {
    'chodba-bila': 'Bílá chodba s vestavěnými skříněmi',
    'chodba-sedo-hneda': 'Šedo-hnědá chodba s úložnými prostory',
    'koupelna-1': 'Moderní koupelna - varianta 1',
    'koupelna-2': 'Moderní koupelna - varianta 2',
    'koupelna-cerna': 'Černá koupelna s kontrastními prvky',
    'kuchyn-svetla-rohova': 'Světlá rohová kuchyň',
    'kuchyn-uzka-bila-l': 'Úzká bílá kuchyň L-tvar',
    'loznice-bilo-hneda': 'Bílo-hnědá ložnice',
    'loznice-hneda': 'Hnědá ložnice s přírodními materiály',
    'loznice-hneda-zkosene': 'Hnědá ložnice se zkoseným stropem',
    'obyvak': 'Moderní obývací pokoj',
    'ostatni-dvere': 'Dveře a zárubně - katalog',
    'ostatni-live-edge-masiv': 'Live edge masivní prvky',
    'ostatni-schody': 'Schodiště a zábradlí',
    'skrin-a-dvere': 'Skříně a vestavěné dveře',
    'skrin-dvere-botnik': 'Botník a skříně u vchodu',
    'skrin-posuv-vstup': 'Posuvné skříně u vstupu'
  };

  return titleMap[galleryName] || galleryName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

async function createGalleryJson(galleryName) {
  const galleryPath = `/Users/David/Projects/kps-interier/app/public/images/galleries/${galleryName}`;
  const webFiles = fs.readdirSync(galleryPath)
    .filter(f => f.endsWith('-web.jpg'))
    .sort();

  if (webFiles.length === 0) {
    console.log(`No web files found for ${galleryName}`);
    return;
  }

  const images = [];

  for (const file of webFiles) {
    const filePath = path.join(galleryPath, file);
    const metadata = await sharp(filePath).metadata();

    const baseName = file.replace('-web.jpg', '');
    const altText = `${generateTitle(galleryName)} - ${baseName}`;

    images.push({
      src: file,
      alt: altText,
      width: metadata.width,
      height: metadata.height,
      caption: `Detail realizace - ${baseName}`
    });
  }

  const coverImage = webFiles[0]; // First image as cover
  const coverImages = webFiles.slice(0, 3); // First 3 for preview

  const galleryData = {
    id: galleryName,
    title: generateTitle(galleryName),
    category: determineCategory(galleryName),
    description: `Profesionální realizace ${generateTitle(galleryName).toLowerCase()} od KPS Interiéry`,
    coverImage: coverImage,
    images: images,
    features: [], // To be filled manually if needed
    materials: [], // To be filled manually if needed
    location: "Praha a okolí",
    date: "2024-09",
    imageCount: images.length,
    coverImages: coverImages
  };

  const jsonPath = path.join(galleryPath, 'gallery.json');
  fs.writeFileSync(jsonPath, JSON.stringify(galleryData, null, 2));
  console.log(`Created gallery.json for ${galleryName} (${images.length} images)`);
}

const galleries = [
  'chodba-bila', 'chodba-sedo-hneda', 'koupelna-1', 'koupelna-2',
  'koupelna-cerna', 'kuchyn-svetla-rohova', 'kuchyn-uzka-bila-l',
  'loznice-bilo-hneda', 'loznice-hneda', 'loznice-hneda-zkosene',
  'obyvak', 'ostatni-dvere', 'ostatni-live-edge-masiv', 'ostatni-schody',
  'skrin-a-dvere', 'skrin-dvere-botnik', 'skrin-posuv-vstup'
];

Promise.all(galleries.map(createGalleryJson)).then(() => {
  console.log('All gallery.json files created');
});
EOF

# Generate all gallery.json files
cd /Users/David/Projects/kps-interier && node /tmp/generate-gallery-json.js
```

## ✅ Phase 5: Validation & Quality Assurance

### Task 5.1: Validate Generated Files
```bash
# Create validation script
cat > /tmp/validate-processing.js << 'EOF'
const fs = require('fs');
const path = require('path');

const galleries = [
  'chodba-bila', 'chodba-sedo-hneda', 'koupelna-1', 'koupelna-2',
  'koupelna-cerna', 'kuchyn-svetla-rohova', 'kuchyn-uzka-bila-l',
  'loznice-bilo-hneda', 'loznice-hneda', 'loznice-hneda-zkosene',
  'obyvak', 'ostatni-dvere', 'ostatni-live-edge-masiv', 'ostatni-schody',
  'skrin-a-dvere', 'skrin-dvere-botnik', 'skrin-posuv-vstup'
];

const basePath = '/Users/David/Projects/kps-interier/app/public/images/galleries';

const report = {
  totalGalleries: 0,
  processedSuccessfully: 0,
  totalOriginals: 0,
  totalWebFiles: 0,
  totalAvifFiles: 0,
  totalJsonFiles: 0,
  issues: []
};

galleries.forEach(gallery => {
  const galleryPath = path.join(basePath, gallery);
  if (!fs.existsSync(galleryPath)) {
    report.issues.push(`Gallery directory not found: ${gallery}`);
    return;
  }

  report.totalGalleries++;

  const files = fs.readdirSync(galleryPath);
  const originals = files.filter(f => f.endsWith('-original-resource.jpg'));
  const webFiles = files.filter(f => f.endsWith('-web.jpg'));
  const avifFiles = files.filter(f => f.endsWith('.avif'));
  const jsonFiles = files.filter(f => f === 'gallery.json');

  report.totalOriginals += originals.length;
  report.totalWebFiles += webFiles.length;
  report.totalAvifFiles += avifFiles.length;
  report.totalJsonFiles += jsonFiles.length;

  // Validation checks
  if (originals.length !== webFiles.length) {
    report.issues.push(`${gallery}: Mismatch - ${originals.length} originals vs ${webFiles.length} web files`);
  }

  if (jsonFiles.length === 0) {
    report.issues.push(`${gallery}: Missing gallery.json file`);
  } else {
    try {
      const jsonPath = path.join(galleryPath, 'gallery.json');
      const galleryData = JSON.parse(fs.readFileSync(jsonPath));
      if (!galleryData.id || !galleryData.title || !galleryData.images) {
        report.issues.push(`${gallery}: Invalid gallery.json structure`);
      }
    } catch (e) {
      report.issues.push(`${gallery}: Error parsing gallery.json - ${e.message}`);
    }
  }

  if (originals.length > 0 && webFiles.length > 0 && jsonFiles.length > 0) {
    report.processedSuccessfully++;
  }
});

console.log('=== PROCESSING VALIDATION REPORT ===');
console.log(`Total Galleries: ${report.totalGalleries}`);
console.log(`Successfully Processed: ${report.processedSuccessfully}`);
console.log(`Total Original Files: ${report.totalOriginals}`);
console.log(`Total Web Files: ${report.totalWebFiles}`);
console.log(`Total AVIF Files: ${report.totalAvifFiles}`);
console.log(`Total JSON Files: ${report.totalJsonFiles}`);
console.log('');

if (report.issues.length > 0) {
  console.log('ISSUES FOUND:');
  report.issues.forEach(issue => console.log(`- ${issue}`));
} else {
  console.log('✅ All validations passed!');
}

fs.writeFileSync('/tmp/validation-report.json', JSON.stringify(report, null, 2));
EOF

cd /Users/David/Projects/kps-interier && node /tmp/validate-processing.js
```

### Task 5.2: File Size and Quality Check
```bash
# Create file size analysis script
cat > /tmp/analyze-file-sizes.js << 'EOF'
const fs = require('fs');
const path = require('path');

const galleries = [
  'chodba-bila', 'chodba-sedo-hneda', 'koupelna-1', 'koupelna-2',
  'koupelna-cerna', 'kuchyn-svetla-rohova', 'kuchyn-uzka-bila-l',
  'loznice-bilo-hneda', 'loznice-hneda', 'loznice-hneda-zkosene',
  'obyvak', 'ostatni-dvere', 'ostatni-live-edge-masiv', 'ostatni-schody',
  'skrin-a-dvere', 'skrin-dvere-botnik', 'skrin-posuv-vstup'
];

const basePath = '/Users/David/Projects/kps-interier/app/public/images/galleries';

function formatBytes(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

let totalOriginalSize = 0;
let totalWebSize = 0;
let totalAvifSize = 0;

galleries.forEach(gallery => {
  const galleryPath = path.join(basePath, gallery);
  if (!fs.existsSync(galleryPath)) return;

  const files = fs.readdirSync(galleryPath);

  let galleryOriginalSize = 0;
  let galleryWebSize = 0;
  let galleryAvifSize = 0;

  files.forEach(file => {
    const filePath = path.join(galleryPath, file);
    const stat = fs.statSync(filePath);

    if (file.endsWith('-original-resource.jpg')) {
      galleryOriginalSize += stat.size;
    } else if (file.endsWith('-web.jpg')) {
      galleryWebSize += stat.size;
    } else if (file.endsWith('.avif')) {
      galleryAvifSize += stat.size;
    }
  });

  totalOriginalSize += galleryOriginalSize;
  totalWebSize += galleryWebSize;
  totalAvifSize += galleryAvifSize;

  console.log(`${gallery}:`);
  console.log(`  Original: ${formatBytes(galleryOriginalSize)}`);
  console.log(`  Web JPG:  ${formatBytes(galleryWebSize)}`);
  console.log(`  AVIF:     ${formatBytes(galleryAvifSize)}`);
  console.log(`  Savings:  ${((galleryOriginalSize - galleryWebSize - galleryAvifSize) / galleryOriginalSize * 100).toFixed(1)}%`);
  console.log('');
});

console.log('=== TOTAL SIZE ANALYSIS ===');
console.log(`Original Files: ${formatBytes(totalOriginalSize)}`);
console.log(`Web JPG Files:  ${formatBytes(totalWebSize)}`);
console.log(`AVIF Files:     ${formatBytes(totalAvifSize)}`);
console.log(`Total Optimized: ${formatBytes(totalWebSize + totalAvifSize)}`);
console.log(`Total Savings:   ${formatBytes(totalOriginalSize - totalWebSize - totalAvifSize)} (${((totalOriginalSize - totalWebSize - totalAvifSize) / totalOriginalSize * 100).toFixed(1)}%)`);
EOF

cd /Users/David/Projects/kps-interier && node /tmp/analyze-file-sizes.js
```

## 🔗 Phase 6: System Integration

### Task 6.1: Update Gallery Configuration
```bash
# Check current gallery.ts configuration
cat /Users/David/Projects/kps-interier/src/utils/gallery.ts | head -20

# Generate new gallery slugs list
cat > /tmp/update-gallery-slugs.js << 'EOF'
const fs = require('fs');

const newGalleries = [
  'chodba-bila', 'chodba-sedo-hneda', 'koupelna-1', 'koupelna-2',
  'koupelna-cerna', 'kuchyn-svetla-rohova', 'kuchyn-uzka-bila-l',
  'loznice-bilo-hneda', 'loznice-hneda', 'loznice-hneda-zkosene',
  'obyvak', 'ostatni-dvere', 'ostatni-live-edge-masiv', 'ostatni-schody',
  'skrin-a-dvere', 'skrin-dvere-botnik', 'skrin-posuv-vstup'
];

const galleriesPath = '/Users/David/Projects/kps-interier/src/utils/gallery.ts';

// Read existing file
const content = fs.readFileSync(galleriesPath, 'utf8');

// Find GALLERY_SLUGS array and update it
const slugsArrayMatch = content.match(/export const GALLERY_SLUGS = \[([\s\S]*?)\] as const;/);

if (slugsArrayMatch) {
  const existingSlugs = slugsArrayMatch[1]
    .split(',')
    .map(s => s.trim().replace(/['"]/g, ''))
    .filter(s => s.length > 0);

  const allSlugs = [...new Set([...existingSlugs, ...newGalleries])].sort();
  const newSlugsArray = allSlugs.map(slug => `  '${slug}'`).join(',\n');

  const newContent = content.replace(
    /export const GALLERY_SLUGS = \[([\s\S]*?)\] as const;/,
    `export const GALLERY_SLUGS = [\n${newSlugsArray}\n] as const;`
  );

  console.log('Updated gallery slugs:');
  allSlugs.forEach(slug => console.log(`  - ${slug}`));

  fs.writeFileSync('/tmp/updated-gallery.ts', newContent);
  console.log('\nUpdated file saved to /tmp/updated-gallery.ts');
  console.log('Review and manually apply changes to maintain existing functionality.');
}
EOF

cd /Users/David/Projects/kps-interier && node /tmp/update-gallery-slugs.js
```

### Task 6.2: Test Gallery Loading
```bash
# Create gallery loading test
cat > /tmp/test-gallery-loading.js << 'EOF'
const fs = require('fs');
const path = require('path');

async function testGalleryLoading() {
  const galleriesPath = '/Users/David/Projects/kps-interier/app/public/images/galleries';
  const newGalleries = [
    'chodba-bila', 'chodba-sedo-hneda', 'koupelna-1', 'koupelna-2',
    'koupelna-cerna', 'kuchyn-svetla-rohova', 'kuchyn-uzka-bila-l',
    'loznice-bilo-hneda', 'loznice-hneda', 'loznice-hneda-zkosene',
    'obyvak', 'ostatni-dvere', 'ostatni-live-edge-masiv', 'ostatni-schody',
    'skrin-a-dvere', 'skrin-dvere-botnik', 'skrin-posuv-vstup'
  ];

  const results = {
    successful: [],
    failed: [],
    issues: []
  };

  for (const gallery of newGalleries) {
    const galleryPath = path.join(galleriesPath, gallery);
    const jsonPath = path.join(galleryPath, 'gallery.json');

    try {
      if (!fs.existsSync(jsonPath)) {
        results.failed.push(gallery);
        results.issues.push(`${gallery}: gallery.json not found`);
        continue;
      }

      const galleryData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

      // Validate structure
      const requiredFields = ['id', 'title', 'category', 'coverImage', 'images'];
      const missingFields = requiredFields.filter(field => !galleryData[field]);

      if (missingFields.length > 0) {
        results.issues.push(`${gallery}: Missing fields: ${missingFields.join(', ')}`);
      }

      // Validate image files exist
      const missingImages = [];
      galleryData.images?.forEach(img => {
        const imgPath = path.join(galleryPath, img.src);
        if (!fs.existsSync(imgPath)) {
          missingImages.push(img.src);
        }
      });

      if (missingImages.length > 0) {
        results.issues.push(`${gallery}: Missing image files: ${missingImages.join(', ')}`);
      }

      if (missingFields.length === 0 && missingImages.length === 0) {
        results.successful.push(gallery);
      } else {
        results.failed.push(gallery);
      }

    } catch (error) {
      results.failed.push(gallery);
      results.issues.push(`${gallery}: JSON parse error - ${error.message}`);
    }
  }

  console.log('=== GALLERY LOADING TEST RESULTS ===');
  console.log(`Successful: ${results.successful.length}/${newGalleries.length}`);
  console.log(`Failed: ${results.failed.length}`);
  console.log('');

  if (results.successful.length > 0) {
    console.log('✅ Successfully loaded galleries:');
    results.successful.forEach(g => console.log(`  - ${g}`));
    console.log('');
  }

  if (results.issues.length > 0) {
    console.log('❌ Issues found:');
    results.issues.forEach(issue => console.log(`  - ${issue}`));
  }

  return results;
}

testGalleryLoading().catch(console.error);
EOF

cd /Users/David/Projects/kps-interier && node /tmp/test-gallery-loading.js
```

## 📊 Phase 7: Final Report Generation

### Task 7.1: Generate Comprehensive Processing Report
```bash
# Create final report
cat > /tmp/generate-final-report.js << 'EOF'
const fs = require('fs');
const path = require('path');

async function generateFinalReport() {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalGalleriesProcessed: 0,
      totalImagesProcessed: 0,
      totalFilesGenerated: 0,
      totalStorageSaved: 0,
      processingTime: 0 // To be filled manually
    },
    galleries: {},
    performance: {
      compressionRatio: 0,
      avgFileSizeReduction: 0,
      totalOriginalSize: 0,
      totalOptimizedSize: 0
    },
    nextSteps: [
      "Review generated gallery.json files for accuracy",
      "Update src/utils/gallery.ts with new gallery slugs",
      "Test gallery loading in development environment",
      "Verify responsive image loading performance",
      "Deploy changes to staging environment"
    ]
  };

  const basePath = '/Users/David/Projects/kps-interier/app/public/images/galleries';
  const galleries = [
    'chodba-bila', 'chodba-sedo-hneda', 'koupelna-1', 'koupelna-2',
    'koupelna-cerna', 'kuchyn-svetla-rohova', 'kuchyn-uzka-bila-l',
    'loznice-bilo-hneda', 'loznice-hneda', 'loznice-hneda-zkosene',
    'obyvak', 'ostatni-dvere', 'ostatni-live-edge-masiv', 'ostatni-schody',
    'skrin-a-dvere', 'skrin-dvere-botnik', 'skrin-posuv-vstup'
  ];

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let totalFilesGenerated = 0;

  galleries.forEach(gallery => {
    const galleryPath = path.join(basePath, gallery);
    if (!fs.existsSync(galleryPath)) return;

    const files = fs.readdirSync(galleryPath);
    const originals = files.filter(f => f.endsWith('-original-resource.jpg'));
    const webFiles = files.filter(f => f.endsWith('-web.jpg'));
    const avifFiles = files.filter(f => f.endsWith('.avif'));
    const jsonFiles = files.filter(f => f === 'gallery.json');

    let galleryOriginalSize = 0;
    let galleryOptimizedSize = 0;

    files.forEach(file => {
      const filePath = path.join(galleryPath, file);
      const stat = fs.statSync(filePath);

      if (file.endsWith('-original-resource.jpg')) {
        galleryOriginalSize += stat.size;
      } else if (file.endsWith('-web.jpg') || file.endsWith('.avif')) {
        galleryOptimizedSize += stat.size;
      }
    });

    totalOriginalSize += galleryOriginalSize;
    totalOptimizedSize += galleryOptimizedSize;
    totalFilesGenerated += webFiles.length + avifFiles.length + jsonFiles.length;

    report.galleries[gallery] = {
      originalImages: originals.length,
      webImages: webFiles.length,
      avifVariants: avifFiles.length,
      hasGalleryJson: jsonFiles.length > 0,
      originalSize: galleryOriginalSize,
      optimizedSize: galleryOptimizedSize,
      savings: galleryOriginalSize - galleryOptimizedSize,
      compressionRatio: ((galleryOriginalSize - galleryOptimizedSize) / galleryOriginalSize * 100).toFixed(1) + '%'
    };

    if (originals.length > 0 && webFiles.length > 0 && jsonFiles.length > 0) {
      report.summary.totalGalleriesProcessed++;
    }
  });

  report.summary.totalImagesProcessed = Object.values(report.galleries)
    .reduce((sum, g) => sum + g.originalImages, 0);
  report.summary.totalFilesGenerated = totalFilesGenerated;
  report.summary.totalStorageSaved = totalOriginalSize - totalOptimizedSize;

  report.performance.totalOriginalSize = totalOriginalSize;
  report.performance.totalOptimizedSize = totalOptimizedSize;
  report.performance.compressionRatio = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1) + '%';
  report.performance.avgFileSizeReduction = (report.summary.totalStorageSaved / report.summary.totalImagesProcessed / 1024 / 1024).toFixed(2) + ' MB per image';

  const reportPath = '/Users/David/Projects/kps-interier/docs/GALLERY_PROCESSING_REPORT.md';
  const reportContent = `# 📊 Gallery Processing Report
Generated: ${report.timestamp}

## 🎯 Processing Summary
- **Galleries Processed**: ${report.summary.totalGalleriesProcessed}/17
- **Images Processed**: ${report.summary.totalImagesProcessed}
- **Files Generated**: ${report.summary.totalFilesGenerated}
- **Storage Optimized**: ${(report.summary.totalStorageSaved / 1024 / 1024).toFixed(2)} MB saved
- **Compression Ratio**: ${report.performance.compressionRatio}

## 📋 Gallery Details
${Object.entries(report.galleries).map(([name, data]) => `
### ${name}
- Original Images: ${data.originalImages}
- Web Variants: ${data.webImages}
- AVIF Variants: ${data.avifVariants}
- Gallery JSON: ${data.hasGalleryJson ? '✅' : '❌'}
- Size Reduction: ${(data.savings / 1024 / 1024).toFixed(2)} MB (${data.compressionRatio})
`).join('')}

## 🚀 Next Steps
${report.nextSteps.map(step => `- [ ] ${step}`).join('\n')}

## 📊 Performance Metrics
- **Total Original Size**: ${(report.performance.totalOriginalSize / 1024 / 1024).toFixed(2)} MB
- **Total Optimized Size**: ${(report.performance.totalOptimizedSize / 1024 / 1024).toFixed(2)} MB
- **Average Reduction per Image**: ${report.performance.avgFileSizeReduction}
- **Compression Efficiency**: ${report.performance.compressionRatio}
`;

  fs.writeFileSync(reportPath, reportContent);
  fs.writeFileSync('/tmp/final-processing-report.json', JSON.stringify(report, null, 2));

  console.log('=== FINAL PROCESSING REPORT ===');
  console.log(reportContent);
  console.log(`\nDetailed report saved to: ${reportPath}`);
}

generateFinalReport().catch(console.error);
EOF

cd /Users/David/Projects/kps-interier && node /tmp/generate-final-report.js
```

## ⚡ Parallel Execution Commands Summary

### Execute All Phases in Optimal Order:

```bash
# Phase 1 & 2: Setup and Analysis (Sequential)
npm install --save-dev sharp vite-imagetools
cd /Users/David/Projects/kps-interier && node /tmp/analyze-dimensions.js
cd /Users/David/Projects/kps-interier && node /tmp/plan-avif-sizes.js

# Phase 3: Parallel Image Processing
# Terminal 1: Web JPG Generation (4 parallel processes)
cd /Users/David/Projects/kps-interier && node /tmp/generate-web-jpg.js chodba-bila chodba-sedo-hneda koupelna-1 koupelna-2 koupelna-cerna &
cd /Users/David/Projects/kps-interier && node /tmp/generate-web-jpg.js kuchyn-svetla-rohova kuchyn-uzka-bila-l loznice-bilo-hneda loznice-hneda &
cd /Users/David/Projects/kps-interier && node /tmp/generate-web-jpg.js loznice-hneda-zkosene obyvak ostatni-dvere &
cd /Users/David/Projects/kps-interier && node /tmp/generate-web-jpg.js ostatni-live-edge-masiv ostatni-schody skrin-a-dvere skrin-dvere-botnik skrin-posuv-vstup &

# Terminal 2: AVIF Generation (7 parallel processes - more CPU intensive)
cd /Users/David/Projects/kps-interier && node /tmp/generate-avif.js chodba-bila chodba-sedo-hneda koupelna-1 &
cd /Users/David/Projects/kps-interier && node /tmp/generate-avif.js koupelna-2 koupelna-cerna kuchyn-svetla-rohova &
cd /Users/David/Projects/kps-interier && node /tmp/generate-avif.js kuchyn-uzka-bila-l loznice-bilo-hneda loznice-hneda &
cd /Users/David/Projects/kps-interier && node /tmp/generate-avif.js loznice-hneda-zkosene obyvak &
cd /Users/David/Projects/kps-interier && node /tmp/generate-avif.js ostatni-dvere ostatni-live-edge-masiv &
cd /Users/David/Projects/kps-interier && node /tmp/generate-avif.js ostatni-schody skrin-a-dvere &
cd /Users/David/Projects/kps-interier && node /tmp/generate-avif.js skrin-dvere-botnik skrin-posuv-vstup &

# Wait for all background processes
wait

# Phase 4-7: Sequential completion
cd /Users/David/Projects/kps-interier && node /tmp/generate-gallery-json.js
cd /Users/David/Projects/kps-interier && node /tmp/validate-processing.js
cd /Users/David/Projects/kps-interier && node /tmp/analyze-file-sizes.js
cd /Users/David/Projects/kps-interier && node /tmp/test-gallery-loading.js
cd /Users/David/Projects/kps-interier && node /tmp/generate-final-report.js
```

## 🎯 Expected Results

After successful completion:
- ✅ **208 original images** processed
- ✅ **208 web-optimized JPG** files generated
- ✅ **800-1000 AVIF variants** in multiple sizes
- ✅ **17 gallery.json** metadata files
- ✅ **50-70% storage savings** through optimization
- ✅ **Full AVIF-only system integration**

## 🚨 Critical Success Factors

1. **Parallel Processing**: Use all available CPU cores efficiently
2. **Memory Management**: Monitor RAM usage during AVIF generation
3. **File Naming Consistency**: Maintain "-original-resource" to "-web" convention
4. **Quality Validation**: Verify image quality and compression ratios
5. **System Integration**: Test gallery loading before deployment

This execution plan optimizes for speed while maintaining quality and following the established AVIF-only optimization strategy. The parallel processing approach should complete all 208 images in approximately 20-30 minutes on modern hardware.