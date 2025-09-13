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
          transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          cursor: pointer;
          padding: 3.5rem 2.5rem;
          text-align: center;
          min-height: 320px;
        }
        
        .service-glassmorphism {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 24px;
          z-index: 3;
          transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        .service-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
        }
        
        .service-background-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        .kitchen-card .service-background-overlay {
          background: linear-gradient(135deg, 
            rgba(200, 139, 78, 0.65) 0%, 
            rgba(212, 163, 115, 0.55) 50%, 
            rgba(141, 110, 99, 0.7) 100%);
        }
        
        .wardrobe-card .service-background-overlay {
          background: linear-gradient(135deg, 
            rgba(50, 38, 36, 0.65) 0%, 
            rgba(62, 47, 43, 0.55) 50%, 
            rgba(35, 25, 23, 0.7) 100%);
        }
        
        .bathroom-card .service-background-overlay {
          background: linear-gradient(135deg, 
            rgba(141, 110, 99, 0.65) 0%, 
            rgba(200, 139, 78, 0.55) 50%, 
            rgba(160, 129, 122, 0.7) 100%);
        }
        
        .office-card .service-background-overlay {
          background: linear-gradient(135deg, 
            rgba(50, 38, 36, 0.65) 0%, 
            rgba(141, 110, 99, 0.55) 50%, 
            rgba(112, 86, 81, 0.7) 100%);
        }
        
        .atypical-card .service-background-overlay {
          background: linear-gradient(135deg, 
            rgba(200, 139, 78, 0.65) 0%, 
            rgba(141, 110, 99, 0.55) 50%, 
            rgba(212, 163, 115, 0.7) 100%);
        }
        
        .service-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
        }
        
        .service-card:hover .service-glassmorphism {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(7.5px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        
        .service-card:hover .service-background-overlay {
          opacity: 0.2;
        }
        
        .service-content {
          position: relative;
          z-index: 4;
        }
        
        .service-icon {
          margin: 0 auto 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        .service-icon i {
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
          transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
          color: white;
          --ph-duotone-primary: white;
          --ph-duotone-secondary: rgba(255, 255, 255, 0.6);
        }
        
        .service-card:hover .service-icon {
          transform: scale(1.15) rotate(3deg);
        }
        
        .service-card:hover .service-icon i {
          filter: none;
          color: var(--secondary);
          --ph-duotone-primary: var(--secondary);
          --ph-duotone-secondary: var(--secondary-light);
        }
        
        .service-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--white);
          margin-bottom: 1.2rem;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .service-description {
          font-size: 1.1rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 400;
          transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        }
        
        .service-card:hover .service-title {
          color: var(--primary);
          text-shadow: none;
        }
        
        .service-card:hover .service-description {
          color: var(--gray);
          text-shadow: none;
        }
        
        
        @media (max-width: 768px) {
          .services-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .service-card {
            padding: 2.5rem 2rem;
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
              src={(import.meta.env.BASE_URL || "/") + "images/galleries/kuchyn-bilo-hneda-l-varianta1/skrine-0001-web-400w.avif"}
              alt="Modern retro kitchen design"
              class="service-background"
              width="400"
              height="320"
            />
            <div class="service-background-overlay"></div>
            <div class="service-glassmorphism"></div>
            <div class="service-content">
              <div class="service-icon">
                <i class="ph-duotone ph-cooking-pot icon-duotone-reverse" style="font-size: 48px;"></i>
              </div>
              <h3 class="service-title">Kuchyně na míru</h3>
              <p class="service-description">
                Srdce každého domova podle vašich představ
              </p>
            </div>
          </div>
          
          <div class="service-card wardrobe-card">
            <img
              src={(import.meta.env.BASE_URL || "/") + "images/galleries/skrin-dvere-botnik/skrine-0115-web-400w.avif"}
              alt="Built-in wardrobe with sliding doors"
              class="service-background"
              width="400"
              height="320"
            />
            <div class="service-background-overlay"></div>
            <div class="service-glassmorphism"></div>
            <div class="service-content">
              <div class="service-icon">
                <i class="ph-duotone ph-door-open icon-duotone-reverse" style="font-size: 48px;"></i>
              </div>
              <h3 class="service-title">Vestavěné skříně</h3>
              <p class="service-description">
                Maximální využití prostoru s elegantním designem
              </p>
            </div>
          </div>
          
          <div class="service-card bathroom-card">
            <img
              src={(import.meta.env.BASE_URL || "/") + "images/galleries/koupelna-1/koupelna-0018-web-400w.avif"}
              alt="Modern bathroom vanity"
              class="service-background"
              width="400"
              height="320"
            />
            <div class="service-background-overlay"></div>
            <div class="service-glassmorphism"></div>
            <div class="service-content">
              <div class="service-icon">
                <i class="ph-duotone ph-bathtub icon-duotone-reverse" style="font-size: 48px;"></i>
              </div>
              <h3 class="service-title">Koupelnový nábytek</h3>
              <p class="service-description">
                Funkční a stylové řešení pro vaši pohodu
              </p>
            </div>
          </div>
          
          <div class="service-card office-card">
            <img
              src={(import.meta.env.BASE_URL || "/") + "images/galleries/chodba-bila/chodba_0024-web-400w.avif"}
              alt="Modern office workspace"
              class="service-background"
              width="400"
              height="320"
            />
            <div class="service-background-overlay"></div>
            <div class="service-glassmorphism"></div>
            <div class="service-content">
              <div class="service-icon">
                <i class="ph-duotone ph-desk icon-duotone-reverse" style="font-size: 48px;"></i>
              </div>
              <h3 class="service-title">Kancelářský nábytek</h3>
              <p class="service-description">
                Profesionální prostředí pro váš business
              </p>
            </div>
          </div>
          
          <div class="service-card atypical-card">
            <img 
              src={(import.meta.env.BASE_URL || "/") + "images/galleries/kuchyn-retro-bila/kuchyne_0105-web-400w.avif"}
              alt="Modern kitchen with custom design"
              class="service-background"
              width="400"
              height="320"
            />
            <div class="service-background-overlay"></div>
            <div class="service-glassmorphism"></div>
            <div class="service-content">
              <div class="service-icon">
                <i class="ph-duotone ph-magic-wand icon-duotone-reverse" style="font-size: 48px;"></i>
              </div>
              <h3 class="service-title">Atypické řešení</h3>
              <p class="service-description">
                Zubní ordinace, školy, nebo cokoliv si dokážete představit
              </p>
            </div>
          </div>
        </div>
        
      </div>
      
    </section>
  );
});