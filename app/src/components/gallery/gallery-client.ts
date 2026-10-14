/**
 * Klientská logika detailu realizace: lightbox spouštěče, přepínač pohledů, filmový pás.
 * mountGallery na `astro:page-load`, unmountGallery na `astro:before-swap` (View Transitions).
 */
import { destroyLightbox, openLightbox, preloadLightbox, type Slide } from './lightbox';

let ctrl: AbortController | null = null;
const VIEW_KEY = 'kps-gallery-view';
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function unmountGallery() {
  ctrl?.abort();
  ctrl = null;
  destroyLightbox();
}

export function mountGallery() {
  unmountGallery();
  const gallery = document.querySelector<HTMLElement>('[data-gallery]');
  if (!gallery) return;
  ctrl = new AbortController();
  const { signal } = ctrl;

  let slides: Slide[] = [];
  try {
    slides = JSON.parse(gallery.querySelector('[data-gallery-slides]')?.textContent || '[]');
  } catch {
    slides = [];
  }
  if (!slides.length) return;

  // ── Lightbox: delegace kliků na celé stránce (galerie + hero)
  document.addEventListener(
    'click',
    (e) => {
      const t = (e.target as Element | null)?.closest<HTMLElement>('[data-pswp-index]');
      if (!t || e.defaultPrevented) return;
      const me = e as MouseEvent;
      if (me.button !== 0 || me.metaKey || me.ctrlKey || me.shiftKey || me.altKey) return; // nový panel = nativně
      e.preventDefault();
      const i = Number(t.dataset.pswpIndex);
      if (Number.isFinite(i)) openLightbox(slides, i, document);
    },
    { signal },
  );
  // warm-up: stáhni PhotoSwipe při prvním náznaku interakce
  const warm = () => preloadLightbox();
  gallery.addEventListener('pointerover', warm, { once: true, signal });
  document.querySelector('[data-pswp-hero]')?.addEventListener('pointerover', warm, { once: true, signal });

  // ── Přepínač pohledů
  const buttons = [...gallery.querySelectorAll<HTMLButtonElement>('[data-view-btn]')];
  const panels = [...gallery.querySelectorAll<HTMLElement>('[data-gallery-view]')];
  const setView = (id: string, animate: boolean) => {
    if (!panels.some((p) => p.dataset.galleryView === id)) return;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.viewBtn === id)));
    panels.forEach((p) => {
      const on = p.dataset.galleryView === id;
      p.hidden = !on;
      p.classList.remove('is-entering');
      if (on && animate && !reduceMotion()) {
        void p.offsetWidth;
        p.classList.add('is-entering');
      }
    });
    if (id === 'filmstrip') updateStrip();
    // reveal prvky v nově zobrazeném panelu
    gallery.querySelectorAll('[data-gallery-view]:not([hidden]) [data-reveal]').forEach((el) => el.classList.add('is-revealed'));
  };
  buttons.forEach((b) =>
    b.addEventListener(
      'click',
      () => {
        const id = b.dataset.viewBtn!;
        setView(id, true);
        try { localStorage.setItem(VIEW_KEY, id); } catch { /* bez úložiště */ }
      },
      { signal },
    ),
  );

  // ── Filmový pás
  const track = gallery.querySelector<HTMLElement>('[data-fs-track]');
  const prev = gallery.querySelector<HTMLButtonElement>('[data-fs-prev]');
  const next = gallery.querySelector<HTMLButtonElement>('[data-fs-next]');
  const progress = gallery.querySelector<HTMLElement>('[data-fs-progress]');
  const counter = gallery.querySelector<HTMLElement>('[data-fs-current]');
  const items = track ? [...track.querySelectorAll<HTMLElement>('.fs-item')] : [];

  function updateStrip() {
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    const x = track.scrollLeft;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.max(0.04, x / max) : 1})`;
    if (prev) prev.disabled = x <= 2;
    if (next) next.disabled = x >= max - 2;
    if (counter && items.length) {
      const pad = parseFloat(getComputedStyle(track).scrollPaddingInlineStart) || 0;
      const left = track.getBoundingClientRect().left + pad;
      let idx = 0;
      let best = Infinity;
      items.forEach((it, k) => {
        const dist = Math.abs(it.getBoundingClientRect().left - left);
        if (dist < best) { best = dist; idx = k; }
      });
      if (x >= max - 2) idx = items.length - 1;
      counter.textContent = String(idx + 1).padStart(2, '0');
    }
  }

  /** Posun na sousední fotku (dir ±1) */
  const step = (dir: 1 | -1) => {
    if (!track) return;
    const pad = parseFloat(getComputedStyle(track).scrollPaddingInlineStart) || 0;
    const base = track.getBoundingClientRect().left + pad;
    const offsets = items.map((it) => it.getBoundingClientRect().left - base);
    const target = dir > 0 ? offsets.find((o) => o > 4) : [...offsets].reverse().find((o) => o < -4);
    track.scrollBy({ left: target ?? dir * track.clientWidth * 0.8, behavior: reduceMotion() ? 'auto' : 'smooth' });
  };

  if (track) {
    prev?.addEventListener('click', () => step(-1), { signal });
    next?.addEventListener('click', () => step(1), { signal });
    track.addEventListener('scroll', () => requestAnimationFrame(updateStrip), { passive: true, signal });
    window.addEventListener('resize', updateStrip, { passive: true, signal });

    track.addEventListener(
      'keydown',
      (e) => {
        if (e.target !== track) return;
        if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
        else if (e.key === 'Home') { e.preventDefault(); track.scrollTo({ left: 0, behavior: reduceMotion() ? 'auto' : 'smooth' }); }
        else if (e.key === 'End') { e.preventDefault(); track.scrollTo({ left: track.scrollWidth, behavior: reduceMotion() ? 'auto' : 'smooth' }); }
      },
      { signal },
    );

    // kolečko myši: svislý pohyb posouvá pás, dokud je kam (pak scrolluje stránka)
    track.addEventListener(
      'wheel',
      (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.ctrlKey) return;
        const max = track.scrollWidth - track.clientWidth;
        const canScroll = (e.deltaY > 0 && track.scrollLeft < max - 1) || (e.deltaY < 0 && track.scrollLeft > 1);
        if (!canScroll) return;
        e.preventDefault();
        track.scrollLeft += e.deltaY;
      },
      { passive: false, signal },
    );

    // tažení myší (dotyk řeší nativní scroll)
    let startX = 0, startLeft = 0, dragging = false, moved = false;
    track.addEventListener(
      'pointerdown',
      (e) => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        dragging = true; moved = false;
        startX = e.clientX; startLeft = track.scrollLeft;
      },
      { signal },
    );
    window.addEventListener(
      'pointermove',
      (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        if (!moved && Math.abs(dx) > 6) { moved = true; track.classList.add('is-dragging'); }
        if (moved) track.scrollLeft = startLeft - dx;
      },
      { signal },
    );
    const end = () => {
      if (!dragging) return;
      dragging = false;
      if (moved) {
        // potlač klik, který následuje po tažení
        const swallow = (ev: Event) => { ev.preventDefault(); ev.stopPropagation(); };
        track.addEventListener('click', swallow, { capture: true, once: true });
        setTimeout(() => {
          track.removeEventListener('click', swallow, { capture: true });
          track.classList.remove('is-dragging');
        }, 60);
      }
    };
    window.addEventListener('pointerup', end, { signal });
    window.addEventListener('pointercancel', end, { signal });
  }

  let saved: string | null = null;
  try { saved = localStorage.getItem(VIEW_KEY); } catch { saved = null; }
  setView(saved ?? 'editorial', false);
}
