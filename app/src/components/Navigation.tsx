import { component$, useSignal, useStylesScoped$, useStore, $ } from "@builder.io/qwik";
import { useNavigate, useLocation, Link } from "@builder.io/qwik-city";

export const Navigation = component$(() => {
  const isMenuOpen = useSignal(false);
  const isGalleryDropdownOpen = useSignal(false);
  const navigate = useNavigate();
  const location = useLocation();
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
          min-height: 70px;
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
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .nav-dropdown {
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

        .dropdown-arrow {
          transition: var(--transition);
          font-size: 0.75rem;
          transform: rotate(0deg);
        }

        .nav-dropdown:hover .dropdown-arrow,
        .nav-dropdown.dropdown-open .dropdown-arrow {
          transform: rotate(180deg);
        }

        .nav-dropdown.mobile-only:hover .dropdown-arrow {
          transform: none;
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 10px);
          left: 0;
          background: var(--white);
          border: 1px solid rgba(200, 139, 78, 0.1);
          border-radius: var(--radius-sm);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 220px;
          z-index: 1001;
        }

        .nav-dropdown:hover .dropdown-menu,
        .nav-dropdown.dropdown-open .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-item {
          display: block;
          padding: 0.75rem 1.25rem;
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          transition: var(--transition);
          border-bottom: 1px solid rgba(200, 139, 78, 0.05);
        }

        .dropdown-item:last-child {
          border-bottom: none;
        }

        .dropdown-item:hover {
          background: rgba(200, 139, 78, 0.05);
          color: var(--secondary);
          transform: translateX(4px);
        }

        .desktop-only {
          display: flex;
        }

        .mobile-only {
          display: none;
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
          .desktop-only {
            display: none;
          }

          .mobile-only {
            display: flex;
          }

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
            justify-content: flex-start;
            align-items: stretch;
            padding: 2rem;
            gap: 1rem;
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
            padding: 0.75rem 0;
            justify-content: center;
          }

          .nav-dropdown {
            width: 100%;
          }

          .mobile-dropdown {
            width: 100%;
            display: flex;
            flex-direction: column;
            background: rgba(200, 139, 78, 0.05);
            border-radius: var(--radius-sm);
            margin-top: 0.5rem;
            overflow: hidden;
          }

          .mobile-dropdown-header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem;
            color: var(--primary);
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            background: transparent;
            border: none;
            width: 100%;
            transition: var(--transition);
          }

          .mobile-dropdown-header:hover {
            background: rgba(200, 139, 78, 0.1);
            color: var(--secondary);
          }

          .mobile-dropdown-content {
            display: none;
            flex-direction: column;
            width: 100%;
            gap: 0.25rem;
            padding: 0 0.75rem 0.75rem;
          }

          .mobile-dropdown.open .mobile-dropdown-content {
            display: flex;
          }

          .mobile-only.mobile-dropdown.open .dropdown-arrow {
            transform: rotate(180deg);
          }

          .mobile-dropdown:not(.open) .dropdown-arrow {
            transform: rotate(0deg);
          }

          .mobile-dropdown-item {
            width: 100%;
            padding: 0.6rem 1rem;
            color: var(--primary);
            text-decoration: none;
            font-weight: 500;
            font-size: 1rem;
            background: var(--white);
            border-radius: var(--radius-xs);
            border: 1px solid rgba(200, 139, 78, 0.1);
            transition: var(--transition);
            display: block;
            text-align: center;
            box-sizing: border-box;
          }

          .mobile-dropdown-item:hover {
            background: var(--secondary);
            color: var(--white);
            border-color: var(--secondary);
          }

          .dropdown-menu {
            position: static;
            opacity: 1;
            visibility: visible;
            transform: none;
            background: transparent;
            border: none;
            box-shadow: none;
            min-width: auto;
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

        /* Add spacing utility for page content below fixed navigation */
        :global(.section-after-nav) {
          padding-top: 80px; /* Account for fixed navigation height */
        }

        @media (max-width: 768px) {
          :global(.section-after-nav) {
            padding-top: 70px; /* Slightly less on mobile */
          }
        }
      `);

  // Smooth scroll to section utility
  const scrollToSection = $((sectionId: string) => {
    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
      const target = document.querySelector(sectionId);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  });

  const handleNavigation = $((e: Event, href: string) => {
    e.preventDefault();
    isMenuOpen.value = false;

    if (href.startsWith('#')) {
      // Hash navigation - check if we're on home page
      if (location.url.pathname === '/' || location.url.pathname === import.meta.env.BASE_URL) {
        // Same page - smooth scroll to section
        scrollToSection(href);
      } else {
        // Different page - navigate to home with hash
        navigate('/' + href);
      }
    } else if (href.startsWith('/galerie#')) {
      // Gallery section links - handle specially to prevent page reload
      const [path, hash] = href.split('#');
      if (location.url.pathname === path) {
        // Same gallery page - just scroll to section
        scrollToSection('#' + hash);
      } else {
        // Navigate to gallery page first
        navigate(path);
        // Wait for navigation to complete before scrolling
        setTimeout(() => {
          scrollToSection('#' + hash);
        }, 200);
      }
    } else {
      // Regular page navigation
      navigate(href);
    }
  });

  const handleGalleryClick = $((e: Event) => {
    e.preventDefault();
    if (location.url.pathname === '/galerie' || location.url.pathname === '/galerie/') {
      // Already on gallery page, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to gallery page
      navigate('/galerie/');
    }
  });

  const toggleMobileGalleryDropdown = $((e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    isGalleryDropdownOpen.value = !isGalleryDropdownOpen.value;
  });

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
            <Link href="/">
              <img src={`${import.meta.env.BASE_URL}branding/kps-compact-logo.svg`} alt="KPS Interiéry" width="120" height="40" />
            </Link>
          </div>

          <div class="nav-right">
            <div class={`nav-menu ${isMenuOpen.value ? 'nav-menu-open' : ''}`}>
              <a href="#uvod" class="nav-link" onClick$={(e) => handleNavigation(e, '#uvod')}>Úvod</a>
              <a href="#sluzby" class="nav-link" onClick$={(e) => handleNavigation(e, '#sluzby')}>Služby</a>
              <a href="#realizace" class="nav-link" onClick$={(e) => handleNavigation(e, '#realizace')}>Realizace</a>

              {/* Desktop Gallery Dropdown */}
              <div class="nav-dropdown desktop-only">
                <a href="/galerie" class="nav-link" onClick$={handleGalleryClick}>
                  Galerie
                  <span class="dropdown-arrow">▼</span>
                </a>
                <div class="dropdown-menu">
                  <a href="/galerie/#kuchyne" class="dropdown-item" onClick$={(e) => handleNavigation(e, '/galerie/#kuchyne')}>
                    Kuchyně
                  </a>
                  <a href="/galerie/#loznice" class="dropdown-item" onClick$={(e) => handleNavigation(e, '/galerie/#loznice')}>
                    Ložnice
                  </a>
                  <a href="/galerie/#koupelny" class="dropdown-item" onClick$={(e) => handleNavigation(e, '/galerie/#koupelny')}>
                    Koupelny
                  </a>
                  <a href="/galerie/#skrine" class="dropdown-item" onClick$={(e) => handleNavigation(e, '/galerie/#skrine')}>
                    Skříně
                  </a>
                  <a href="/galerie/#ostatni" class="dropdown-item" onClick$={(e) => handleNavigation(e, '/galerie/#ostatni')}>
                    Ostatní
                  </a>
                </div>
              </div>

              {/* Mobile Gallery Dropdown */}
              <div class={`nav-dropdown mobile-only mobile-dropdown ${isGalleryDropdownOpen.value ? 'open' : ''}`}>
                <button class="mobile-dropdown-header" onClick$={toggleMobileGalleryDropdown}>
                  Galerie
                  <span class="dropdown-arrow">▼</span>
                </button>
                <div class="mobile-dropdown-content">
                  <a href="/galerie/" class="mobile-dropdown-item" onClick$={(e) => handleNavigation(e, '/galerie/')}>
                    Všechny galerie
                  </a>
                  <a href="/galerie/#kuchyne" class="mobile-dropdown-item" onClick$={(e) => handleNavigation(e, '/galerie/#kuchyne')}>
                    Kuchyně
                  </a>
                  <a href="/galerie/#loznice" class="mobile-dropdown-item" onClick$={(e) => handleNavigation(e, '/galerie/#loznice')}>
                    Ložnice
                  </a>
                  <a href="/galerie/#koupelny" class="mobile-dropdown-item" onClick$={(e) => handleNavigation(e, '/galerie/#koupelny')}>
                    Koupelny
                  </a>
                  <a href="/galerie/#skrine" class="mobile-dropdown-item" onClick$={(e) => handleNavigation(e, '/galerie/#skrine')}>
                    Skříně
                  </a>
                  <a href="/galerie/#ostatni" class="mobile-dropdown-item" onClick$={(e) => handleNavigation(e, '/galerie/#ostatni')}>
                    Ostatní
                  </a>
                </div>
              </div>

              <a href="#kontakt" class="nav-link" onClick$={(e) => handleNavigation(e, '#kontakt')}>Kontakt</a>
              <a href="#kontakt" class="btn btn-accent nav-cta" onClick$={(e) => handleNavigation(e, '#kontakt')}>Poptávka</a>
            </div>

            <div class="nav-mobile-controls" style="display: flex; align-items: center;">
              <a href="#kontakt" class="btn btn-accent nav-cta-mobile" onClick$={(e) => handleNavigation(e, '#kontakt')}>Poptávka</a>
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