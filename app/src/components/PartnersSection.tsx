import { component$, useStylesScoped$ } from "@builder.io/qwik";

const styles = `
  .partners-section {
    background: var(--white);
    overflow: hidden;
  }
  
  .partners-header {
    text-align: center;
    margin-bottom: 4rem;
  }
  
  .partners-carousel {
    margin-bottom: 4rem;
    overflow: hidden;
    position: relative;
  }
  
  .partners-carousel::before,
  .partners-carousel::after {
    content: '';
    position: absolute;
    top: 0;
    width: 100px;
    height: 100%;
    z-index: 2;
    pointer-events: none;
  }
  
  .partners-carousel::before {
    left: 0;
    background: linear-gradient(90deg, var(--white) 0%, transparent 100%);
  }
  
  .partners-carousel::after {
    right: 0;
    background: linear-gradient(270deg, var(--white) 0%, transparent 100%);
  }
  
  .partners-track {
    display: flex;
    animation: scroll 30s linear infinite;
    width: calc(200px * 16); /* 8 partners * 2 sets * 200px width */
  }
  
  .partner-item {
    flex: 0 0 200px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 1rem;
  }
  
  .partner-logo {
    background: var(--light-gray);
    border: 2px solid transparent;
    border-radius: var(--radius-sm);
    padding: 1.5rem 2rem;
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--primary);
    transition: var(--transition);
    text-align: center;
    min-width: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .partner-item:hover .partner-logo {
    background: var(--primary);
    color: var(--white);
    border-color: var(--accent);
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }
  
  .partners-description {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }
  
  .partners-text h3 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 1.5rem;
  }
  
  .partners-text p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: var(--gray);
  }
  
  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(-200px * 8 - 2rem * 8)); /* Move by width of 8 partners */
    }
  }
  
  @media (max-width: 768px) {
    .partners-carousel::before,
    .partners-carousel::after {
      width: 50px;
    }
    
    .partner-item {
      flex: 0 0 150px;
      margin: 0 0.5rem;
    }
    
    .partners-track {
      width: calc(150px * 16 + 1rem * 16);
    }
    
    .partner-logo {
      padding: 1rem 1.5rem;
      font-size: 1rem;
      min-width: 120px;
    }
    
    @keyframes scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(calc(-150px * 8 - 1rem * 8));
      }
    }
  }
  
  /* Pause animation on hover */
  .partners-carousel:hover .partners-track {
    animation-play-state: paused;
  }
`;

export const PartnersSection = component$(() => {
  useStylesScoped$(styles);
  const partners = [
    { name: "Blum", logo: "BLUM" },
    { name: "Egger", logo: "EGGER" },
    { name: "Kronospan", logo: "KRONOSPAN" },
    { name: "Fundermax", logo: "FUNDERMAX" },
    { name: "Hettich", logo: "HETTICH" },
    { name: "Franke", logo: "FRANKE" },
    { name: "Blanco", logo: "BLANCO" },
    { name: "Häfele", logo: "HÄFELE" }
  ];

  return (
    <section class="partners-section section">
      <div class="container">
        <div class="partners-header">
          <h2 class="section-title">Naši partneři</h2>
          <p class="section-description">
            Spolupracujeme s předními výrobci kvalitních materiálů a komponentů
          </p>
        </div>
        
        <div class="partners-carousel">
          <div class="partners-track">
            {/* First set */}
            {partners.map((partner, index) => (
              <div key={`${partner.name}-1-${index}`} class="partner-item">
                <div class="partner-logo">
                  {partner.logo}
                </div>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {partners.map((partner, index) => (
              <div key={`${partner.name}-2-${index}`} class="partner-item">
                <div class="partner-logo">
                  {partner.logo}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div class="partners-description">
          <div class="partners-text">
            <h3>Proč spolupracujeme s těmito značkami?</h3>
            <p>
              Vybíráme pouze ty nejlepší partnery, kteří sdílejí naše hodnoty kvality a inovace. 
              Každý z našich dodavatelů je lídrem ve svém oboru a garantuje špičkovou kvalitu 
              materiálů a komponentů pro váš nábytek.
            </p>
          </div>
        </div>
      </div>
      
    </section>
  );
});