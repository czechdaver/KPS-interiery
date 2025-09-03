import { component$, useStylesScoped$ } from "@builder.io/qwik";

export const ValuesSection = component$(() => {
  useStylesScoped$(`
        .values-section {
          background: linear-gradient(135deg, var(--light-gray) 0%, var(--white) 100%);
        }
        
        .values-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 4rem;
        }
        
        
        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 4rem;
        }
        
        .value-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 3.5rem 2.5rem;
          border-radius: 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }
        
        .value-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, var(--secondary), var(--secondary-light));
          border-radius: 24px 24px 0 0;
        }
        
        .value-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(200, 139, 78, 0.4);
        }
        
        .quality-card:hover {
          background: linear-gradient(135deg, rgba(200, 139, 78, 0.12), rgba(255, 255, 255, 0.95));
        }
        
        .precision-card:hover {
          background: linear-gradient(135deg, rgba(50, 38, 36, 0.12), rgba(255, 255, 255, 0.95));
        }
        
        .satisfaction-card:hover {
          background: linear-gradient(135deg, rgba(141, 110, 99, 0.12), rgba(255, 255, 255, 0.95));
        }
        
        .value-icon {
          margin: 0 auto 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }
        
        .value-card:hover .value-icon {
          transform: scale(1.15) rotate(3deg);
        }
        
        .value-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 1.2rem;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        
        .value-description {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--gray);
          font-weight: 400;
        }
        
        @media (max-width: 768px) {
          .values-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .value-card {
            padding: 2.5rem 2rem;
          }
          
        }
      `);
  return (
    <section class="values-section section">
      <div class="container">
        <div class="values-header">
          <h2 class="section-title">Jsme tým profesionálů s vášní pro detail</h2>
          <p class="section-description">
            KPS Interiéry znamená více než jen výroba nábytku. Jsme partneři, kteří vás provedou 
            celým procesem od prvotního nápadu až po finální montáž. Naše zkratka KPS symbolizuje 
            tři pilíře naší práce:
          </p>
        </div>
        
        <div class="values-grid">
          <div class="value-card quality-card">
            <div class="value-icon">
              <i class="ph-duotone ph-medal icon-duotone-accent" style="font-size: 64px;"></i>
            </div>
            <h3 class="value-title">KVALITA</h3>
            <p class="value-description">
              Používáme pouze prvotřídní materiály a nejmodernější technologie
            </p>
          </div>
          
          <div class="value-card precision-card">
            <div class="value-icon">
              <i class="ph-duotone ph-crosshair icon-duotone-accent" style="font-size: 64px;"></i>
            </div>
            <h3 class="value-title">PRECIZNOST</h3>
            <p class="value-description">
              Každý detail dotahujeme k dokonalosti
            </p>
          </div>
          
          <div class="value-card satisfaction-card">
            <div class="value-icon">
              <i class="ph-duotone ph-heart icon-duotone-accent" style="font-size: 64px;"></i>
            </div>
            <h3 class="value-title">SPOKOJENOST</h3>
            <p class="value-description">
              Váš úsměv při předání je naší největší odměnou
            </p>
          </div>
        </div>
      </div>
      
    </section>
  );
});