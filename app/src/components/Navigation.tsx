import { component$, useSignal, useStylesScoped$, useOnWindow, $ } from "@builder.io/qwik";

export const Navigation = component$(() => {
  const isMenuOpen = useSignal(false);
  const isScrolled = useSignal(false);

  useOnWindow('scroll', $(() => {
    isScrolled.value = window.scrollY > 50;
  }));
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
        
        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
        }
        
        .nav-logo a {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          line-height: 1;
        }
        
        .logo-text {
          font-size: 2rem;
          font-weight: 900;
          color: var(--primary);
          letter-spacing: -1px;
        }
        
        .logo-subtitle {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--accent);
          margin-top: -4px;
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
        
        .nav-toggle {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }
        
        .nav-toggle-line {
          width: 24px;
          height: 2px;
          background: var(--primary);
          transition: var(--transition);
        }
        
        @media (max-width: 768px) {
          .nav-toggle {
            display: flex;
          }
          
          .nav-menu {
            position: fixed;
            top: 100%;
            left: 0;
            width: 100%;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.39);
            flex-direction: column;
            padding: 2rem;
            gap: 1.5rem;
            box-shadow: var(--shadow-lg);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: var(--transition);
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
    <nav class={`navigation ${isScrolled.value ? 'navigation-scrolled' : ''}`}>
      <div class="container">
        <div class="nav-content">
          <div class="nav-logo">
            <a href="#home">
              <span class="logo-text">KPS</span>
              <span class="logo-subtitle">Interiéry</span>
            </a>
          </div>
          
          <div class={`nav-menu ${isMenuOpen.value ? 'nav-menu-open' : ''}`}>
            <a href="#home" class="nav-link">Úvod</a>
            <a href="#services" class="nav-link">Služby</a>
            <a href="#portfolio" class="nav-link">Realizace</a>
            <a href="#contact" class="nav-link">Kontakt</a>
            <a href="#contact" class="btn btn-glass nav-cta">Poptávka</a>
          </div>
          
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
      
      
    </nav>
  );
});