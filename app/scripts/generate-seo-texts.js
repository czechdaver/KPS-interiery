/**
 * Generate SEO texts for all gallery.json files
 * Reads existing gallery data and adds contextual, keyword-rich SEO descriptions
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GALLERIES_DIR = join(__dirname, '../public/images/galleries');

// SEO text templates by category
const seoTemplates = {
  'Kuchyně': (data) => {
    const style = data.title.toLowerCase().includes('bílá') ? 'bílé' :
                  data.title.toLowerCase().includes('černá') ? 'černé' :
                  data.title.toLowerCase().includes('šedá') ? 'šedé' :
                  data.title.toLowerCase().includes('hnědá') ? 'hnědé' : 'moderní';

    const shape = data.title.toLowerCase().includes('ostrůvek') ? 'kuchyňským ostrůvkem' :
                  data.title.toLowerCase().includes('u tvar') || data.title.toLowerCase().includes('u-tvar') ? 'tvarem do U' :
                  data.title.toLowerCase().includes('l') ? 'tvarem do L' : 'optimálním uspořádáním';

    const materials = data.materials.join(', ').toLowerCase();
    const features = data.features.slice(0, 4).join(', ').toLowerCase();

    return `Tato ${style} kuchyně na míru s ${shape} byla zrealizována v lokalitě ${data.location} a představuje dokonalý příklad funkčního a moderního řešení kuchyňského prostoru. Projekt vyniká precizním zpracováním a promyšleným designem, který kombinuje estetiku s maximální praktičností. Kuchyně využívá kvalitní materiály včetně ${materials}, které zajišťují dlouhou životnost a odolnost proti každodennímu používání. Mezi klíčové vlastnosti patří ${features}. Vestavěné spotřebiče jsou dokonale integrovány pro jednotný vzhled, rozsáhlé úložné prostory poskytují místo pro všechny kuchyňské potřeby. Kvalitní kování zajišťuje tichý a plynulý chod všech mechanismů i po letech používání. Moderní LED osvětlení vytváří příjemnou atmosféru a perfektně osvětluje pracovní plochy. Celková realizace odpovídá nejvyšším standardům truhlářského řemesla ve Zlínském kraji a představuje investici do kvalitního nábytku, který vydrží desetiletí.`;
  },

  'Ložnice': (data) => {
    const materials = data.materials.join(', ').toLowerCase();
    const features = data.features.slice(0, 3).join(', ').toLowerCase();

    return `Kompletní ložnicový nábytek na míru realizovaný v ${data.location} představuje harmonické řešení pro odpočinkový prostor s důrazem na komfort a praktičnost. Projekt zahrnuje ${features} a další prvky navržené přesně podle rozměrů místnosti. Používáme kvalitní materiály ${materials}, které vytváří útulnou atmosféru a zároveň zajišťují dlouhou životnost nábytku. Vestavěné skříně maximálně využívají dostupný prostor a nabízejí promyšlené vnitřní uspořádání s policemi, zásuvkami a tyčemi na věšení. ${data.title.toLowerCase().includes('zkosené') ? 'Speciální pozornost byla věnována řešení atypického podkrovního prostoru se zkoseným stropem, kde každý centimetr využíváme efektivně.' : 'Každý detail je pečlivě promyšlen pro vytvoření harmonického celku.'} Ložnicový nábytek je precizně vyroben s důrazem na kvalitní zpracování hran, spojů a povrchů. Celková realizace vytváří klidný a relaxační prostor ideální pro odpočinek a regeneraci.`;
  },

  'Koupelny': (data) => {
    const materials = data.materials.join(', ').toLowerCase();

    return `Koupelnový nábytek na míru realizovaný v ${data.location} kombinuje moderní design s maximální odolností vůči vlhkosti a vodě. Projekt využívá speciální materiály určené pro vlhké prostředí včetně ${materials}, které zajišťují dlouhodobou funkčnost i v náročných podmínkách koupelny. Nábytek zahrnuje umyvadlové skříňky s praktickým úložným prostorem, vysoké skříně pro ručníky a kosmetiku, police a další prvky přizpůsobené konkrétním rozměrům koupelny. Všechny hrany a spoje jsou pečlivě utěsněny proti vniknutí vlhkosti. Používáme kvalitní kování odolné korozi a vodě. Moderní řešení zahrnuje možnost integrace osvětlení, zrcadel a dalších funkcí pro maximální komfort při každodenní hygieně. Elegantní povrchová úprava je snadno udržovatelná a odolná vůči čistícím prostředkům. Celková realizace představuje praktické a stylové řešení koupelnového prostoru, které vydrží i intenzivní používání.`;
  },

  'Skříně': (data) => {
    const type = data.title.toLowerCase().includes('posuvn') ? 'posuvnými dveřmi' : 'otevíracími dveřmi';
    const materials = data.materials.join(', ').toLowerCase();

    return `Vestavěná skříň na míru s ${type} realizovaná v ${data.location} představuje ideální řešení pro maximální využití úložného prostoru. Projekt je navržen přesně podle rozměrů místnosti a požadavků na vnitřní uspořádání. Používáme kvalitní materiály ${materials}, které zajišťují pevnost konstrukce a dlouhou životnost. Vnitřní uspořádání zahrnuje optimální kombinaci polic různých výšek, tyčí na věšení oblečení, výsuvných zásuvek a košů pro dokonalou organizaci šatníku. ${type === 'posuvnými dveřmi' ? 'Posuvné dveře šetří místo v místnosti a nabízejí plynulý a tichý chod i po letech používání.' : 'Otevírací dveře s kvalitním kováním zajišťují snadný přístup k celému obsahu skříně.'} Každý detail je precizně vyroben s důrazem na kvalitní zpracování, stabilitu a funkčnost. Skříň dokonale využívá prostor od podlahy ke stropu, včetně atypických koutů a výklenků. Celková realizace kombinuje praktičnost s elegantním designem, který se harmonicky začleňuje do interiéru.`;
  },

  'Ostatní': (data) => {
    let specificText = '';
    const title = data.title.toLowerCase();

    if (title.includes('chodba')) {
      specificText = 'Nábytek do chodby včetně botníku, věšákové stěny a úložných skříní vytváří funkční vstupní prostor s dostatkem místa pro oblečení, obuv a doplňky.';
    } else if (title.includes('schody')) {
      specificText = 'Realizace dřevěných schodů s důrazem na bezpečnost, stabilitu a estetické provedení. Každý stupeň je precizně vyroben a ošetřen pro dlouhou životnost.';
    } else if (title.includes('obývak') || title.includes('obývací')) {
      specificText = 'Obývací stěna a nábytek do obýváku navržený na míru pro optimální využití prostoru, ukládání elektroniky, knih a dekorací.';
    } else if (title.includes('live edge') || title.includes('masiv')) {
      specificText = 'Unikátní nábytek z masivního dřeva s přirozenou hranou (live edge), který zachovává původní charakter dřeva a vytváří jedinečné kousky. Každý kus je originál s vlastním vzorem letokruhů.';
    } else {
      specificText = 'Atypický nábytek na míru navržený přesně podle požadavků zákazníka a specifik prostoru.';
    }

    const materials = data.materials.join(', ').toLowerCase();

    return `Zakázkový nábytek na míru realizovaný v ${data.location} představuje individuální řešení odpovídající specifickým požadavkům projektu. ${specificText} Používáme kvalitní materiály včetně ${materials}, které zajišťují dlouhou životnost a odolnost. Každý projekt řešíme individuálně s důrazem na precizní truhlářské zpracování, kvalitní povrchovou úpravu a funkčnost. Realizace odráží naše dlouholeté zkušenosti s výrobou nábytku na míru ve Zlínském kraji. Celkový design je harmonicky sladěn s interiérem a životním stylem zákazníka. Věnujeme maximální pozornost detailům, kvalitě spojů, hran a povrchových úprav pro vytvoření nábytku, který vydrží generace.`;
  }
};

function generateSEOText(galleryData) {
  const template = seoTemplates[galleryData.category];
  if (!template) {
    console.warn(`No template for category: ${galleryData.category}`);
    return null;
  }
  return template(galleryData);
}

function processGalleries() {
  console.log('🔍 Processing galleries...\n');

  const galleries = readdirSync(GALLERIES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  let updated = 0;
  let skipped = 0;

  for (const gallerySlug of galleries) {
    const jsonPath = join(GALLERIES_DIR, gallerySlug, 'gallery.json');

    try {
      const data = JSON.parse(readFileSync(jsonPath, 'utf-8'));

      // Skip if already has seoText
      if (data.seoText) {
        console.log(`⏭️  Skipped ${gallerySlug} (already has seoText)`);
        skipped++;
        continue;
      }

      // Generate SEO text
      const seoText = generateSEOText(data);
      if (!seoText) {
        console.log(`⚠️  Warning: Could not generate SEO text for ${gallerySlug}`);
        continue;
      }

      // Add seoText to data
      data.seoText = seoText;

      // Write back to file
      writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`✅ Updated ${gallerySlug}`);
      updated++;

    } catch (error) {
      console.error(`❌ Error processing ${gallerySlug}:`, error.message);
    }
  }

  console.log(`\n✨ Complete! Updated: ${updated}, Skipped: ${skipped}, Total: ${galleries.length}`);
}

processGalleries();
