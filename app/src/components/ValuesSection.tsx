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
        
        .section-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }
        
        .section-description {
          font-size: 1.2rem;
          line-height: 1.6;
          color: var(--gray);
        }
        
        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 4rem;
        }
        
        .value-card {
          background: var(--white);
          padding: 3rem 2rem;
          border-radius: var(--radius-lg);
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }
        
        .value-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, var(--accent), var(--primary));
        }
        
        .value-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
        }
        
        .quality-card:hover {
          background: linear-gradient(135deg, rgba(230, 126, 34, 0.05), var(--white));
        }
        
        .precision-card:hover {
          background: linear-gradient(135deg, rgba(44, 62, 80, 0.05), var(--white));
        }
        
        .satisfaction-card:hover {
          background: linear-gradient(135deg, rgba(212, 165, 116, 0.05), var(--white));
        }
        
        .value-icon {
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
        }
        
        .value-card:hover .value-icon {
          transform: scale(1.1) rotate(5deg);
        }
        
        .value-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 1rem;
          letter-spacing: 1px;
        }
        
        .value-description {
          font-size: 1.1rem;
          line-height: 1.6;
          color: var(--gray);
        }
        
        @media (max-width: 768px) {
          .values-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .value-card {
            padding: 2rem 1.5rem;
          }
          
          .value-icon {
            width: 60px;
            height: 60px;
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
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 class="value-title">KVALITA</h3>
            <p class="value-description">
              Používáme pouze prvotřídní materiály a nejmodernější technologie
            </p>
          </div>
          
          <div class="value-card precision-card">
            <div class="value-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 class="value-title">PRECIZNOST</h3>
            <p class="value-description">
              Každý detail dotahujeme k dokonalosti
            </p>
          </div>
          
          <div class="value-card satisfaction-card">
            <div class="value-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
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