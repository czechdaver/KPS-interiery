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
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          cursor: pointer;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          min-height: 320px;
        }
        
        .service-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
          z-index: 1;
          transform: scale(1.05);
        }
        
        .service-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(44, 62, 80, 0.75) 0%, rgba(230, 126, 34, 0.75) 100%);
          opacity: 0;
          visibility: hidden;
          transition: all 0.8s cubic-bezier(0.15, 0.85, 0.15, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 3;
          padding: 2rem;
          text-align: center;
          transform: translateY(10px);
        }
        
        .service-card:hover .service-overlay {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        
        .service-card:hover .service-background {
          transform: scale(1.08);
        }
        
        .service-card:hover {
          transform: translateY(-12px);
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
        }
        
        .service-content {
          position: relative;
          z-index: 2;
          padding: 2.5rem 2rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%);
          transition: all 0.8s cubic-bezier(0.15, 0.85, 0.15, 1);
          opacity: 1;
          transform: translateY(0);
        }
        
        .service-icon {
          margin: 0 auto 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.8s cubic-bezier(0.15, 0.85, 0.15, 1);
          position: relative;
          z-index: 2;
        }
        
        .service-card:hover .service-content {
          opacity: 0;
          transform: translateY(-10px);
        }
        
        .service-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 1rem;
          position: relative;
          z-index: 2;
          transition: all 0.8s cubic-bezier(0.15, 0.85, 0.15, 1);
        }
        
        .service-overlay .service-title {
          color: var(--white);
          font-size: 1.6rem;
          margin-bottom: 1.5rem;
        }
        
        .service-description {
          font-size: 1.1rem;
          line-height: 1.6;
          color: var(--gray);
          position: relative;
          z-index: 2;
          transition: all 0.8s cubic-bezier(0.15, 0.85, 0.15, 1);
        }
        
        .service-overlay .service-description {
          color: var(--white);
          font-size: 1.1rem;
          line-height: 1.7;
          opacity: 0.95;
        }
        
        .service-overlay-icon {
          margin-bottom: 1.5rem;
          color: var(--white);
          opacity: 0.9;
          transition: all 0.8s cubic-bezier(0.15, 0.85, 0.15, 1);
          transform: translateY(5px);
        }
        
        .service-card:hover .service-overlay-icon {
          transform: translateY(0);
          opacity: 1;
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
            min-height: 280px;
          }
          
          .service-content {
            padding: 2rem 1.5rem;
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
            <img 
              src="https://images.unsplash.com/photo-1742192757416-27d69a5d5029?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxraXRjaGVuJTIwY2FiaW5ldHMlMjBtb2Rlcm4lMjBpbnRlcmlvciUyMGx1eHVyeSUyMGFwcGxpYW5jZXN8ZW58MHwwfHx8MTc1NTMzNTQyOXww&ixlib=rb-4.1.0&q=85"
              alt="Modern luxury kitchen"
              class="service-background"
              width="400"
              height="320"
            />
            <div class="service-content">
              <div class="service-icon">
                <i class="ph-duotone ph-cooking-pot icon-duotone-accent" style="font-size: 48px;"></i>
              </div>
              <h3 class="service-title">Kuchyně na míru</h3>
              <p class="service-description">
                Srdce každého domova podle vašich představ
              </p>
            </div>
            <div class="service-overlay">
              <div class="service-overlay-icon">
                <i class="ph-duotone ph-cooking-pot" style="font-size: 56px;"></i>
              </div>
              <h3 class="service-title">Kuchyně na míru</h3>
              <p class="service-description">
                Kompletní návrh, výběr materiálů, moderní kování a spotřebiče, profesionální montáž
              </p>
            </div>
          </div>
          
          <div class="service-card wardrobe-card">
            <img 
              src="https://images.unsplash.com/photo-1722942116307-52f7afb38e7f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHx3YXJkcm9iZSUyMGNsb3NldCUyMGJlZHJvb20lMjBzbGlkaW5nJTIwZG9vcnN8ZW58MHwxfHx8MTc1NTMzNTQyOXww&ixlib=rb-4.1.0&q=85"
              alt="Built-in wardrobe with sliding doors"
              class="service-background"
              width="400"
              height="320"
            />
            <div class="service-content">
              <div class="service-icon">
                <i class="ph-duotone ph-door-open icon-duotone-accent" style="font-size: 48px;"></i>
              </div>
              <h3 class="service-title">Vestavěné skříně</h3>
              <p class="service-description">
                Maximální využití prostoru s elegantním designem
              </p>
            </div>
            <div class="service-overlay">
              <div class="service-overlay-icon">
                <i class="ph-duotone ph-door-open" style="font-size: 56px;"></i>
              </div>
              <h3 class="service-title">Vestavěné skříně</h3>
              <p class="service-description">
                Posuvné dveře, organizační systémy, LED osvětlení, atypické rozměry
              </p>
            </div>
          </div>
          
          <div class="service-card bathroom-card">
            <img 
              src="https://images.unsplash.com/photo-1633681140152-3b8726450518?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw2fHxiYXRocm9vbSUyMHZhbml0eSUyMG1pcnJvciUyMG1vZGVybiUyMGRlc2lnbnxlbnwwfDB8fHwxNzU1MzM1NDI5fDA&ixlib=rb-4.1.0&q=85"
              alt="Modern bathroom vanity"
              class="service-background"
              width="400"
              height="320"
            />
            <div class="service-content">
              <div class="service-icon">
                <i class="ph-duotone ph-bathtub icon-duotone-accent" style="font-size: 48px;"></i>
              </div>
              <h3 class="service-title">Koupelnový nábytek</h3>
              <p class="service-description">
                Funkční a stylové řešení pro vaši pohodu
              </p>
            </div>
            <div class="service-overlay">
              <div class="service-overlay-icon">
                <i class="ph-duotone ph-bathtub" style="font-size: 56px;"></i>
              </div>
              <h3 class="service-title">Koupelnový nábytek</h3>
              <p class="service-description">
                Vodotěsné materiály, skryté úložné prostory, moderní umyvadla
              </p>
            </div>
          </div>
          
          <div class="service-card office-card">
            <img 
              src="https://images.unsplash.com/photo-1745970347652-8f22f5d7d3ba?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw2fHxvZmZpY2UlMjBkZXNrJTIwd29ya3NwYWNlJTIwcHJvZmVzc2lvbmFsfGVufDB8MHx8fDE3NTUzMzU0Mjl8MA&ixlib=rb-4.1.0&q=85"
              alt="Contemporary office workspace"
              class="service-background"
              width="400"
              height="320"
            />
            <div class="service-content">
              <div class="service-icon">
                <i class="ph-duotone ph-desk icon-duotone-accent" style="font-size: 48px;"></i>
              </div>
              <h3 class="service-title">Kancelářský nábytek</h3>
              <p class="service-description">
                Profesionální prostředí pro váš business
              </p>
            </div>
            <div class="service-overlay">
              <div class="service-overlay-icon">
                <i class="ph-duotone ph-desk" style="font-size: 56px;"></i>
              </div>
              <h3 class="service-title">Kancelářský nábytek</h3>
              <p class="service-description">
                Ergonomické řešení, kabelový management, modulární systémy
              </p>
            </div>
          </div>
          
          <div class="service-card atypical-card">
            <img 
              src="https://images.unsplash.com/photo-1631889993959-41b4e9c18b12?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw2fHx3b3Jrc2hvcCUyMGN1c3RvbSUyMGZ1cm5pdHVyZSUyMGNyYWZ0c21hbnxlbnwwfDB8fHwxNzU1MzM1NDI5fDA&ixlib=rb-4.1.0&q=85"
              alt="Custom furniture workshop"
              class="service-background"
              width="400"
              height="320"
            />
            <div class="service-content">
              <div class="service-icon">
                <i class="ph-duotone ph-magic-wand icon-duotone-accent" style="font-size: 48px;"></i>
              </div>
              <h3 class="service-title">Atypické řešení</h3>
              <p class="service-description">
                Zubní ordinace, školy, nebo cokoliv si dokážete představit
              </p>
            </div>
            <div class="service-overlay">
              <div class="service-overlay-icon">
                <i class="ph-duotone ph-magic-wand" style="font-size: 56px;"></i>
              </div>
              <h3 class="service-title">Atypické řešení</h3>
              <p class="service-description">
                Individuální přístup, speciální materiály, nestandardní rozměry
              </p>
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