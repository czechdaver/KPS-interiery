/**
 * PhotoSwipe 5 – líně načtený (JS + CSS se stáhnou až při prvním otevření).
 * Zdroj slidů je pole z JSON v galerii; náhled pro "zoom" animaci se hledá v právě viditelném pohledu.
 */
import type PhotoSwipe from 'photoswipe';
import type { SlideData } from 'photoswipe';

export interface Slide extends SlideData {
  src: string;
  srcset: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

type PhotoSwipeCtor = typeof import('photoswipe').default;

let loader: Promise<PhotoSwipeCtor> | null = null;
let current: PhotoSwipe | null = null;

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Načte PhotoSwipe + jeho základní styly (KPS přestylování je v lightbox.css, bundlované staticky) (jen jednou). Lze volat i jako "warm-up" při najetí myší. */
export function preloadLightbox() {
  loader ??= Promise.all([import('photoswipe'), import('photoswipe/style.css').catch(() => null)])
    .then(([m]) => m.default)
    .catch((err) => {
      loader = null; // další pokus při příštím kliknutí
      throw err;
    });
  return loader;
}

const ICON = (path: string) =>
  `<svg aria-hidden="true" class="pswp__icn" viewBox="0 0 32 32" width="32" height="32"><path d="${path}" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export async function openLightbox(slides: Slide[], index: number, root: ParentNode) {
  const PS = await preloadLightbox();
  current?.destroy();

  const pswp = new PS({
    dataSource: slides.map((s) => ({ ...s, thumbCropped: true })),
    index,
    bgOpacity: 0.96,
    spacing: 0.08,
    loop: true,
    showHideAnimationType: reduceMotion() ? 'none' : 'zoom',
    mainClass: 'pswp--kps',
    padding: { top: 72, bottom: 88, left: 0, right: 0 },
    paddingFn: (viewport) =>
      viewport.x >= 1024 ? { top: 80, bottom: 104, left: 96, right: 96 } : { top: 64, bottom: 96, left: 0, right: 0 },
    imageClickAction: 'zoom-or-close',
    tapAction: 'toggle-controls',
    closeTitle: 'Zavřít (Esc)',
    zoomTitle: 'Přiblížit (Z)',
    arrowPrevTitle: 'Předchozí (šipka vlevo)',
    arrowNextTitle: 'Další (šipka vpravo)',
    errorMsg: 'Fotografii se nepodařilo načíst.',
    indexIndicatorSep: ' / ',
    arrowPrevSVG: ICON('M19 8 11 16l8 8'),
    arrowNextSVG: ICON('m13 8 8 8-8 8'),
    closeSVG: ICON('M10 10l12 12M22 10 10 22'),
    zoomSVG: ICON('M14.5 9.5v10M9.5 14.5h10M21 21l5 5M14.5 23a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z'),
  });

  // náhled ve viditelném pohledu galerie (nebo hero) → zoom animace z/do místa kliknutí
  pswp.addFilter('thumbEl', (_thumb, _data, i) => {
    const sel = `[data-pswp-index="${i}"]`;
    const el =
      root.querySelector<HTMLElement>(`[data-gallery-view]:not([hidden]) ${sel} img`) ??
      root.querySelector<HTMLElement>(`[data-pswp-hero]${sel} img`);
    if (!el) return undefined as unknown as HTMLElement;
    const r = el.getBoundingClientRect();
    const visible = r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
    return (visible ? el : undefined) as HTMLElement;
  });
  pswp.addFilter('placeholderSrc', (src, content) => {
    const img = root.querySelector<HTMLImageElement>(`[data-pswp-index="${content.index}"] img`);
    return img?.complete && img.currentSrc ? img.currentSrc : src;
  });

  pswp.on('uiRegister', () => {
    pswp.ui?.registerElement({
      name: 'kps-caption',
      order: 9,
      isButton: false,
      appendTo: 'root',
      html: '',
      onInit: (el, ps) => {
        el.setAttribute('aria-live', 'polite');
        const update = () => {
          const d = ps.currSlide?.data as Slide | undefined;
          const text = d?.caption || d?.alt || '';
          el.innerHTML = '';
          if (!text) return;
          const num = document.createElement('span');
          num.className = 'pswp__kps-num';
          num.textContent = `${String(ps.currIndex + 1).padStart(2, '0')}`;
          const t = document.createElement('span');
          t.textContent = text;
          el.append(num, t);
        };
        ps.on('change', update);
        update();
      },
    });
  });

  pswp.on('destroy', () => {
    if (current === pswp) current = null;
  });

  current = pswp;
  pswp.init();
}

export function destroyLightbox() {
  current?.destroy();
  current = null;
}
