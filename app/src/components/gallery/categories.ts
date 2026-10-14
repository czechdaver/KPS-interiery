/** Texty pro kategorie realizací (landing stránky, CTA). Bez vymyšlených faktů. */
import type { CATEGORIES } from '../../lib/site';

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];

interface CategoryCopy {
  /** H1 – `accent` se vysází kurzívou */
  heading: string;
  accent: string;
  seoTitle: string;
  intro: string;
  /** Kratší text pod úvodem */
  body: string;
  cta: string;
  ctaLead: string;
}

export const CATEGORY_COPY: Record<CategorySlug, CategoryCopy> = {
  kuchyne: {
    heading: 'Kuchyně na míru',
    accent: 'na míru',
    seoTitle: 'Kuchyně na míru – realizace',
    intro: 'Kuchyň je místo, kde se doma potkává nejvíc života. Navrhujeme ji podle toho, jak skutečně vaříte, kolik potřebujete uložit a jak se v prostoru pohybujete.',
    body: 'Každá linka vzniká pro konkrétní místnost – od zaměření přes návrh až po montáž. Podívejte se, jak mohou vypadat velké kuchyně s ostrůvkem, úsporné linky do panelového bytu i řešení do podkroví.',
    cta: 'Chcete podobnou kuchyň?',
    ctaLead: 'Pošlete nám rozměry nebo pár fotek prostoru a domluvíme se na dalším postupu.',
  },
  skrine: {
    heading: 'Skříně a vestavby na míru',
    accent: 'na míru',
    seoTitle: 'Vestavěné skříně na míru – realizace',
    intro: 'Vestavěné skříně, šatny a botníky, které využijí prostor od podlahy až ke stropu – i v atypických výklencích a pod šikminou.',
    body: 'Vnitřní uspořádání řešíme podle toho, co v nich budete skutečně uchovávat. Vybrat si můžete z posuvných i otočných dvířek a široké nabídky dekorů.',
    cta: 'Chcete podobnou skříň?',
    ctaLead: 'Popište nám, kam by měla skříň přijít, a připravíme návrh na míru.',
  },
  loznice: {
    heading: 'Ložnice na míru',
    accent: 'na míru',
    seoTitle: 'Nábytek do ložnice na míru – realizace',
    intro: 'Klidná ložnice stojí na promyšleném úložném prostoru. Postele, skříně a noční stolky navrhujeme jako jeden celek, který ladí s místností.',
    body: 'Zkosené stropy, nízké parapety nebo nepravidelné stěny pro nás nejsou překážkou – nábytek na míru se jim přizpůsobí.',
    cta: 'Plánujete novou ložnici?',
    ctaLead: 'Rádi s vámi projdeme možnosti a připravíme řešení přesně pro váš prostor.',
  },
  koupelny: {
    heading: 'Koupelnový nábytek na míru',
    accent: 'na míru',
    seoTitle: 'Koupelnový nábytek na míru – realizace',
    intro: 'Koupelnový nábytek musí odolat vlhku a zároveň působit čistě a vzdušně. Skříňky pod umyvadlo, vysoké skříně i police navrhujeme přesně do daného prostoru.',
    body: 'Volíme materiály a kování vhodné do vlhkého prostředí, aby nábytek dlouho vypadal i fungoval jako nový.',
    cta: 'Chcete podobnou koupelnu?',
    ctaLead: 'Ozvěte se nám s rozměry koupelny a společně najdeme vhodné řešení.',
  },
  ostatni: {
    heading: 'Další nábytek na míru',
    accent: 'na míru',
    seoTitle: 'Nábytek na míru – další realizace',
    intro: 'Obývací stěny, předsíně, interiérové dveře, schodiště i kusy z masivu. Zakázková výroba nekončí u kuchyní a skříní.',
    body: 'Pokud máte nápad, který se nevejde do žádné škatulky, rádi ho s vámi probereme a navrhneme jeho provedení.',
    cta: 'Máte podobný nápad?',
    ctaLead: 'Napište nám, co si představujete – od skici po hotový kus nábytku.',
  },
};

export const copyFor = (slug: string): CategoryCopy => CATEGORY_COPY[(slug in CATEGORY_COPY ? slug : 'ostatni') as CategorySlug];

export { plural, realizaceLabel, fotoLabel } from './format';
