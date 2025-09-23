import { component$, useSignal, useStylesScoped$, useStore, $ } from "@builder.io/qwik";

export const Navigation = component$(() => {
  const isMenuOpen = useSignal(false);
  const scrollState = useStore({
    isScrolled: false
  });
  useStylesScoped$(`
        .navigation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background: var(--white);
          backdrop-filter: none;
          border-bottom: 1px solid transparent;
          box-shadow: none;
          z-index: 1000;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .navigation-scrolled {
          background: rgba(255, 255, 255, 0.47);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.39);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .navigation-menu-open {
          background: var(--white) !important;
          backdrop-filter: none !important;
          border-bottom: 1px solid transparent !important;
          box-shadow: none !important;
        }
        
        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
        }
        
        .nav-logo a {
          display: flex;
          align-items: center;
          text-decoration: none;
          line-height: 1;
        }
        
        .nav-logo img {
          height: 40px;
          width: auto;
          transition: var(--transition);
        }
        
        .nav-logo img:hover {
          opacity: 0.8;
        }
        
        .nav-right {
          display: flex;
          align-items: center;
          position: relative;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        
        .nav-link {
          text-decoration: none;
          color: var(--primary);
          font-weight: 600;
          font-size: 1rem;
          transition: var(--transition);
          position: relative;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--accent);
          transition: var(--transition);
        }
        
        .nav-link:hover {
          color: var(--accent);
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        .nav-cta {
          margin-left: 1rem;
          padding: 0.75rem 1.5rem;
          font-size: 0.95rem;
        }

        .nav-cta-mobile {
          display: none;
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
          margin-right: 1rem;
        }

        .nav-toggle {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        .nav-mobile-controls {
          visibility: hidden;
          opacity: 0;
          pointer-events: none;
        }
        
        .nav-toggle-line {
          width: 24px;
          height: 2px;
          background: var(--primary);
          transition: var(--transition);
        }
        
        /* Tablet screens (769px to 1024px) - Keep desktop layout but ensure proper spacing */
        @media (min-width: 769px) and (max-width: 1024px) {
          .nav-menu {
            gap: 1.5rem;
          }

          .nav-link {
            font-size: 0.95rem;
          }

          .nav-cta {
            margin-left: 0.75rem;
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
          }
        }

        /* Mobile screens (≤768px) */
        @media (max-width: 768px) {
          .nav-mobile-controls {
            visibility: visible;
            opacity: 1;
            pointer-events: auto;
          }

          .nav-toggle {
            display: flex;
          }

          .nav-cta {
            display: none;
          }

          .nav-cta-mobile {
            display: inline-flex;
          }

          .nav-menu {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            width: 100vw;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            border: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 2rem;
            gap: 1.5rem;
            box-shadow: var(--shadow-lg);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease-in-out;
            z-index: 9999;
            max-height: calc(100vh - 80px);
            overflow-y: auto;
          }

          .nav-menu-open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }

          .nav-link {
            font-size: 1.1rem;
            padding: 0.5rem 0;
          }

          .nav-cta {
            margin-left: 0;
            width: 100%;
            text-align: center;
          }

          .nav-menu-open ~ .nav-toggle .nav-toggle-line:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
          }

          .nav-menu-open ~ .nav-toggle .nav-toggle-line:nth-child(2) {
            opacity: 0;
          }

          .nav-menu-open ~ .nav-toggle .nav-toggle-line:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
          }
        }
      `);

  return (
    <nav
      class={`navigation ${scrollState.isScrolled ? 'navigation-scrolled' : ''} ${isMenuOpen.value ? 'navigation-menu-open' : ''}`}
      window:onScroll$={$(() => {
        scrollState.isScrolled = window.scrollY > 50;
      })}
    >
      <div class="container">
        <div class="nav-content">
          <div class="nav-logo">
            <a href="#home">
              <img src={`${import.meta.env.BASE_URL}branding/kps-compact-logo.svg`} alt="KPS Interiéry" width="120" height="40" />
            </a>
          </div>

          <div class="nav-right">
            <div class={`nav-menu ${isMenuOpen.value ? 'nav-menu-open' : ''}`}>
              <a href="#home" class="nav-link">Úvod</a>
              <a href="#services" class="nav-link">Služby</a>
              <a href="#portfolio" class="nav-link">Realizace</a>
              <a href="#galerie" class="nav-link">Galerie</a>
              <a href="#contact" class="nav-link">Kontakt</a>
              <a href="#contact" class="btn btn-accent nav-cta">Poptávka</a>
            </div>

            <div class="nav-mobile-controls" style="display: flex; align-items: center;">
              <a href="#contact" class="btn btn-accent nav-cta-mobile">Poptávka</a>
              <button
                class="nav-toggle"
                onClick$={() => { isMenuOpen.value = !isMenuOpen.value; }}
                aria-label="Toggle menu"
              >
                <span class="nav-toggle-line"></span>
                <span class="nav-toggle-line"></span>
                <span class="nav-toggle-line"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      
    </nav>
  );
});