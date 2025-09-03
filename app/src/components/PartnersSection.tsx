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
    padding: 2rem 0;
    margin: 0 -2rem 4rem -2rem;
  }
  
  .partners-carousel::before,
  .partners-carousel::after {
    content: '';
    position: absolute;
    top: 0;
    width: 120px;
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
    animation: scroll 60s linear infinite;
    width: calc(200px * 54); /* 27 partners * 2 sets * 200px width */
  }
  
  .partner-item {
    flex: 0 0 200px;
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 1rem;
    padding: 1rem 0;
  }
  
  .partner-logo {
    background: rgba(255, 255, 255, 0.8);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: var(--radius-md);
    padding: 1.5rem 2rem;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 140px;
    min-height: 80px;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
  
  .partner-logo img {
    max-width: 100%;
    max-height: 50px;
    width: auto;
    height: auto;
    object-fit: contain;
    aspect-ratio: 16/9;
    filter: grayscale(100%) contrast(1.2) brightness(0.8);
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  
  .partner-item:hover .partner-logo {
    background: rgba(255, 255, 255, 0.95);
    border-color: var(--gold);
    transform: translateY(-6px) scale(1.05);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(20px);
  }
  
  .partner-item:hover .partner-logo img {
    filter: grayscale(0%) contrast(1) brightness(1);
    transform: scale(1.1);
  }
  
  .partners-description {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }
  
  .partners-text h3 {
    font-size: 1.8rem;
    font-weight: 700;
    color: rgb(200, 139, 78);
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
      transform: translateX(calc(-200px * 27 - 2rem * 27)); /* Move by width of 27 partners */
    }
  }
  
  @media (max-width: 768px) {
    .partners-carousel::before,
    .partners-carousel::after {
      width: 80px;
    }
    
    .partner-item {
      flex: 0 0 150px;
      margin: 0 0.5rem;
    }
    
    .partners-track {
      width: calc(150px * 54 + 1rem * 54);
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
        transform: translateX(calc(-150px * 27 - 1rem * 27));
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
    { name: "Blum", logo: "blum.svg" },
    { name: "Egger", logo: "egger.svg" },
    { name: "Kronospan", logo: "kronospan.svg" },
    { name: "Fundermax", logo: "Fundermax.svg" },
    { name: "Hettich", logo: "Hettich.svg" },
    { name: "Franke", logo: "franke.svg" },
    { name: "Blanco", logo: "blanco.svg" },
    { name: "Häfele", logo: "Hafele.svg" },
    { name: "Kaindl", logo: "Kaindl.svg" },
    { name: "Kessebohmer", logo: "Kesseboehmer.svg" },
    { name: "Kooplast", logo: "Kooplast.svg" },
    { name: "Sapeli", logo: "Sapeli.svg" },
    { name: "Cobra", logo: "cobra.svg" },
    { name: "Demos", logo: "demos.svg" },
    { name: "Doornite", logo: "doornite.svg" },
    { name: "JAF", logo: "jaf.svg" },
    { name: "Kerrock", logo: "kerrock.svg" },
    { name: "Kili", logo: "kili.svg" },
    { name: "Lamelio", logo: "lamelio.svg" },
    { name: "Mivokor", logo: "mivokor.svg" },
    { name: "MT", logo: "MT.svg" },
    { name: "Rostex", logo: "rostex.svg" },
    { name: "Salu", logo: "salu.svg" },
    { name: "Schock", logo: "schock.svg" },
    { name: "Trachea", logo: "trachea.svg" },
    { name: "Wireli", logo: "wireli.svg" },
    { name: "Zlomek", logo: "Zlomek.svg" }
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
                  <img 
                    src={`${import.meta.env.BASE_URL}images/partners/${partner.logo}`}
                    alt={`${partner.name} logo`}
                    loading="lazy"
                    width="120"
                    height="60"
                  />
                </div>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {partners.map((partner, index) => (
              <div key={`${partner.name}-2-${index}`} class="partner-item">
                <div class="partner-logo">
                  <img 
                    src={`${import.meta.env.BASE_URL}images/partners/${partner.logo}`}
                    alt={`${partner.name} logo`}
                    loading="lazy"
                    width="120"
                    height="60"
                  />
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