import { component$, useStylesScoped$ } from "@builder.io/qwik";

export const ServicesSection = component$(() => {
  useStylesScoped$(`
        .services-section {
          background: var(--white);
        }
        
        .services-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }
        
        .service-card {
          background: rgba(255, 255, 255, 0.93);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.39);
          border-radius: var(--radius-lg);
          padding: 2.5rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: var(--transition);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
        
        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--accent), var(--primary));
          opacity: 0;
          transition: var(--transition);
          z-index: 1;
        }
        
        .service-card:hover::before {
          opacity: 0.95;
        }
        
        .service-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.75);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
        }
        
        .service-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 2rem;
          background: linear-gradient(135deg, var(--accent), var(--primary));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          transition: var(--transition);
          position: relative;
          z-index: 2;
        }
        
        .service-card:hover .service-icon {
          transform: scale(1.1);
          background: var(--white);
          color: var(--primary);
        }
        
        .service-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 1rem;
          position: relative;
          z-index: 2;
          transition: var(--transition);
        }
        
        .service-card:hover .service-title {
          color: var(--white);
        }
        
        .service-description {
          font-size: 1.1rem;
          line-height: 1.6;
          color: var(--gray);
          position: relative;
          z-index: 2;
          transition: var(--transition);
        }
        
        .service-card:hover .service-description {
          color: var(--white);
          opacity: 0;
        }
        
        .service-hover-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          opacity: 0;
          z-index: 3;
          transition: var(--transition);
          color: var(--white);
          font-size: 1rem;
          line-height: 1.5;
        }
        
        .service-card:hover .service-hover-content {
          opacity: 1;
          transform: translate(-50%, -40%);
        }
        
        .services-cta {
          text-align: center;
          margin-top: 3rem;
        }
        
        @media (max-width: 768px) {
          .services-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .service-card {
            padding: 2rem 1.5rem;
          }
          
          .service-icon {
            width: 60px;
            height: 60px;
          }
        }
      `);
  return (
    <section class="services-section section" id="services">
      <div class="container">
        <div class="services-header">
          <h2 class="section-title">Co pro vás můžeme vyrobit?</h2>
        </div>
        
        <div class="services-grid">
          <div class="service-card kitchen-card">
            <div class="service-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2.01L6 2c-1.1 0-2 .89-2 2v16c0 1.11.9 2 2 2h12c1.1 0 2-.89 2-2V4c0-1.11-.9-1.99-2-1.99zM18 20H6v-9.02h12V20zm0-11H6V4h12v5z"/>
                <circle cx="8" cy="7" r="1"/>
                <circle cx="8" cy="16" r="1"/>
                <circle cx="16" cy="16" r="1"/>
              </svg>
            </div>
            <h3 class="service-title">Kuchyně na míru</h3>
            <p class="service-description">
              Srdce každého domova podle vašich představ
            </p>
            <div class="service-hover-content">
              <p>Kompletní návrh, výběr materiálů, moderní kování a spotřebiče, profesionální montáž</p>
            </div>
          </div>
          
          <div class="service-card wardrobe-card">
            <div class="service-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 19h20v2H2v-2zm1.15-12.05L4 5l.85 1.95.66-.3L5.92 5 7 6.05l-.66.3L5.49 8 4 6.95l-.85 1.95-.66-.3L3.34 6.05l-.66.3L2 5l.85-1.95.66.3L4.36 5l-.85 1.95-.66-.3zm6.7-.3L8.5 8 7 6.95l-.85 1.95-.66-.3L6.34 6.05l-.66.3L5 5l.85-1.95.66.3L7.36 5l-.85 1.95-.66-.3L7.7 6.65l.66.3L9.21 5l-.85 1.95-.66-.3z"/>
                <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H6V4h12v16z"/>
              </svg>
            </div>
            <h3 class="service-title">Vestavěné skříně</h3>
            <p class="service-description">
              Maximální využití prostoru s elegantním designem
            </p>
            <div class="service-hover-content">
              <p>Posuvné dveře, organizační systémy, LED osvětlení, atypické rozměry</p>
            </div>
          </div>
          
          <div class="service-card bathroom-card">
            <div class="service-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 7h10v2H7V7zm0 3h10v2H7v-2zm0 3h10v2H7v-2z"/>
                <path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16z"/>
              </svg>
            </div>
            <h3 class="service-title">Koupelnový nábytek</h3>
            <p class="service-description">
              Funkční a stylové řešení pro vaši pohodu
            </p>
            <div class="service-hover-content">
              <p>Vodotěsné materiály, skryté úložné prostory, moderní umyvadla</p>
            </div>
          </div>
          
          <div class="service-card office-card">
            <div class="service-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
              </svg>
            </div>
            <h3 class="service-title">Kancelářský nábytek</h3>
            <p class="service-description">
              Profesionální prostředí pro váš business
            </p>
            <div class="service-hover-content">
              <p>Ergonomické řešení, kabelový management, modulární systémy</p>
            </div>
          </div>
          
          <div class="service-card atypical-card">
            <div class="service-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 class="service-title">Atypické řešení</h3>
            <p class="service-description">
              Zubní ordinace, školy, nebo cokoliv si dokážete představit
            </p>
            <div class="service-hover-content">
              <p>Individuální přístup, speciální materiály, nestandardní rozměry</p>
            </div>
          </div>
        </div>
        
        <div class="services-cta">
          <a href="#contact" class="btn btn-glass">
            Zobrazit všechny služby
          </a>
        </div>
      </div>
      
    </section>
  );
});