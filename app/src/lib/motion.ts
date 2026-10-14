/**
 * Lehký motion runtime: reveal-on-scroll přes IntersectionObserver + Lenis smooth scroll.
 * Volá se z BaseLayout. Respektuje prefers-reduced-motion. Kompatibilní s View Transitions (astro:page-load).
 */
import Lenis from 'lenis';

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis: Lenis | null = null;

function initReveal() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)');
  if (reduce() || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-revealed'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-revealed');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  els.forEach((el) => io.observe(el));
}

function initLenis() {
  if (reduce() || lenis) return;
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.9 });
  const raf = (t: number) => { lenis?.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  (window as any).__lenis = lenis;
}

export function initMotion() {
  document.documentElement.classList.add('js');
  initLenis();
  initReveal();
}
export const getLenis = () => lenis;
