/** Klientský filtr kategorií na /realizace/. */
import { featuredSlot } from './slots';
import { realizaceLabel } from './format';

const PARAM = 'kategorie';
let ctrl: AbortController | null = null;
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type VT = { finished: Promise<void>; ready: Promise<void> };
type DocVT = Document & { startViewTransition?: (cb: () => void) => VT };

export function unmountFilter() {
  ctrl?.abort();
  ctrl = null;
}

export function mountFilter() {
  unmountFilter();
  const root = document.querySelector<HTMLElement>('[data-filter]');
  const scope = document.querySelector<HTMLElement>('[data-filter-scope]');
  if (!root || !scope) return;
  ctrl = new AbortController();
  const { signal } = ctrl;

  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-filter-btn]')];
  const items = [...scope.querySelectorAll<HTMLElement>('[data-filter-item]')];
  const sections = [...scope.querySelectorAll<HTMLElement>('[data-filter-section]')];
  const status = root.querySelector<HTMLElement>('[data-filter-status]');
  const valid = new Set(buttons.map((b) => b.dataset.filterBtn ?? ''));

  const apply = (slug: string) => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.filterBtn ?? '') === slug)));
    const shown: HTMLElement[] = [];
    items.forEach((it) => {
      const on = !slug || it.dataset.cat === slug;
      const wasHidden = it.hidden;
      it.hidden = !on;
      if (on) {
        shown.push(it);
        // karta mohla být skrytá dřív, než ji odhalil IntersectionObserver
        it.querySelector('[data-reveal]')?.classList.add('is-revealed');
        if (wasHidden) it.dataset.entering = '';
      }
    });
    // přepočet asymetrických slotů featured
    scope.querySelectorAll<HTMLElement>('[data-featured-list]').forEach((list) => {
      const vis = [...list.querySelectorAll<HTMLElement>('[data-filter-item]')].filter((li) => !li.hidden);
      vis.forEach((li, k) => (li.dataset.slot = featuredSlot(k, vis.length)));
    });
    sections.forEach((s) => (s.hidden = !s.querySelector('[data-filter-item]:not([hidden])')));
    if (status) {
      const name = buttons.find((b) => b.dataset.filterBtn === slug)?.dataset.filterName;
      status.textContent = `Zobrazeno ${realizaceLabel(shown.length)}${name ? ` v kategorii ${name}` : ''}.`;
    }
    return shown;
  };

  const run = (slug: string) => {
    const doc = document as DocVT;
    if (!doc.startViewTransition || reduceMotion()) {
      const shown = apply(slug);
      if (!reduceMotion()) fadeIn(shown);
      else shown.forEach((s) => delete s.dataset.entering);
      return;
    }
    // pojmenuj viditelné karty, ať se plynule přesunou na nové pozice
    const named = items.filter((it) => !it.hidden || !slug || it.dataset.cat === slug);
    named.forEach((it) => (it.style.viewTransitionName = `rz-${it.dataset.id}`));
    document.documentElement.classList.add('is-filtering');
    const t = doc.startViewTransition(() => {
      apply(slug).forEach((s) => delete s.dataset.entering);
    });
    t.finished.finally(() => {
      named.forEach((it) => (it.style.viewTransitionName = ''));
      document.documentElement.classList.remove('is-filtering');
    });
  };

  const fadeIn = (els: HTMLElement[]) => {
    els.filter((e) => 'entering' in e.dataset).forEach((e, k) => {
      delete e.dataset.entering;
      e.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], {
        duration: 600,
        delay: Math.min(k, 8) * 40,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'backwards',
      });
    });
  };

  buttons.forEach((b) =>
    b.addEventListener(
      'click',
      () => {
        const slug = b.dataset.filterBtn ?? '';
        if (b.getAttribute('aria-pressed') === 'true') return;
        run(slug);
        const url = new URL(location.href);
        if (slug) url.searchParams.set(PARAM, slug);
        else url.searchParams.delete(PARAM);
        history.replaceState(history.state, '', url);
      },
      { signal },
    ),
  );

  const initial = new URL(location.href).searchParams.get(PARAM) ?? '';
  if (initial && valid.has(initial)) {
    const shown = apply(initial);
    shown.forEach((s) => delete s.dataset.entering);
  }
}
