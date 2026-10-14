/**
 * Build-time data pro galerie: orientace, dominantní barva (placeholder) a full-size zdroje pro lightbox.
 * Běží jen na serveru (frontmatter .astro stránek).
 */
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import sharp from 'sharp';

export type Orientation = 'landscape' | 'portrait' | 'square';

export interface LightboxSlide {
  src: string;
  srcset: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

export interface GalleryImage {
  /** Pořadí v rámci projektu (0..n-1) = index slidu v lightboxu */
  index: number;
  src: ImageMetadata;
  alt: string;
  caption: string;
  /** Dominantní barva jako CSS barva (prázdné, pokud ji nejde spočítat) */
  color: string;
  orientation: Orientation;
  ratio: number;
  lightbox: LightboxSlide;
}

export const orientationOf = (w: number, h: number): Orientation => {
  const r = w / h;
  return r > 1.15 ? 'landscape' : r < 0.87 ? 'portrait' : 'square';
};

const colorCache = new Map<string, Promise<string>>();

/**
 * Průměrná barva fotky (sharp, zmenšení na 1×1 px) – slouží jako placeholder pozadí, než se načte obrázek.
 * Využívá privátní `fsPath` z ImageMetadata; pokud chybí, vrací ''.
 */
export function dominantColor(img: ImageMetadata): Promise<string> {
  const fsPath = (img as ImageMetadata & { fsPath?: string }).fsPath;
  if (!fsPath) return Promise.resolve('');
  let c = colorCache.get(fsPath);
  if (!c) {
    c = sharp(fsPath)
      .resize(1, 1, { fit: 'cover' })
      .removeAlpha()
      .raw()
      .toBuffer()
      .then((b) => `rgb(${b[0]} ${b[1]} ${b[2]})`)
      .catch(() => '');
    colorCache.set(fsPath, c);
  }
  return c;
}

/** Šířky pro lightbox: 960/1600/2560 (jen menší než originál) + originál. Nikdy neupscalujeme. */
const LIGHTBOX_WIDTHS = [960, 1600, 2560];

export async function lightboxSlide(src: ImageMetadata, alt: string, caption: string): Promise<LightboxSlide> {
  const widths = [...LIGHTBOX_WIDTHS.filter((w) => w < src.width), src.width];
  const img = await getImage({ src, widths, format: 'webp', quality: 85 });
  return { src: img.src, srcset: img.srcSet.attribute, width: src.width, height: src.height, alt, caption };
}

export async function buildGallery(images: { src: ImageMetadata; alt: string; caption?: string }[]): Promise<GalleryImage[]> {
  return Promise.all(
    images.map(async (im, index) => {
      const caption = im.caption ?? '';
      const [color, lightbox] = await Promise.all([dominantColor(im.src), lightboxSlide(im.src, im.alt, caption)]);
      return {
        index,
        src: im.src,
        alt: im.alt,
        caption,
        color,
        orientation: orientationOf(im.src.width, im.src.height),
        ratio: im.src.width / im.src.height,
        lightbox,
      };
    }),
  );
}

/** Pomocník pro inline style placeholderu. */
export const bgStyle = (color: string) => (color ? `background-color:${color}` : undefined);

/** Ponechá jen šířky ≤ originálu (a doplní originál, pokud je menší než největší požadovaná). */
export const fitWidths = (widths: number[], img: ImageMetadata) => {
  const ok = widths.filter((w) => w < img.width);
  return [...new Set([...ok, Math.min(img.width, Math.max(...widths))])];
};

export const pad2 = (n: number) => String(n).padStart(2, '0');
