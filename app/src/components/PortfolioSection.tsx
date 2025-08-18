import { component$, useStylesScoped$ } from "@builder.io/qwik";

const styles = `
  .portfolio-section {
    background: linear-gradient(135deg, var(--light-gray) 0%, var(--white) 100%);
  }
  
  .portfolio-header {
    text-align: center;
    max-width: 600px;
    margin: 0 auto 4rem;
  }
  
  .portfolio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
  }
  
  .portfolio-item {
    position: relative;
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: var(--transition);
    box-shadow: var(--shadow-sm);
    background: rgba(255, 255, 255, 0.13);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.13);
  }
  
  .portfolio-item.featured {
    grid-column: span 2;
    grid-row: span 2;
  }
  
  .portfolio-item.wide {
    grid-column: span 2;
  }
  
  .portfolio-item:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.27);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }
  
  .portfolio-image-container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 250px;
  }
  
  .portfolio-item.featured .portfolio-image-container {
    min-height: 400px;
  }
  
  .portfolio-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: var(--transition);
  }
  
  .portfolio-item:hover .portfolio-image {
    transform: scale(1.05);
  }
  
  .portfolio-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(44, 62, 80, 0.8) 0%,
      rgba(230, 126, 34, 0.8) 100%
    );
    opacity: 0;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .portfolio-item:hover .portfolio-overlay {
    opacity: 1;
  }
  
  .portfolio-content {
    text-align: center;
    color: var(--white);
    transform: translateY(20px);
    transition: var(--transition);
  }
  
  .portfolio-item:hover .portfolio-content {
    transform: translateY(0);
  }
  
  .portfolio-category {
    display: inline-block;
    background: rgba(255, 255, 255, 0.33);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 1rem;
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.4);
  }
  
  .portfolio-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.3;
  }
  
  .portfolio-view-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--white);
    color: var(--primary);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-sm);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
  }
  
  .portfolio-view-btn:hover {
    background: var(--accent);
    color: var(--white);
    transform: translateY(-2px);
  }
  
  .portfolio-cta {
    text-align: center;
  }
  
  @media (max-width: 1024px) {
    .portfolio-item.featured,
    .portfolio-item.wide {
      grid-column: span 1;
      grid-row: span 1;
    }
    
    .portfolio-item.featured .portfolio-image-container {
      min-height: 250px;
    }
  }
  
  @media (max-width: 768px) {
    .portfolio-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .portfolio-item {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }
    
    .portfolio-image-container {
      min-height: 200px;
    }
  }
`;

export const PortfolioSection = component$(() => {
  useStylesScoped$(styles);
  const portfolioItems = [
    {
      id: 1,
      title: "Moderní kuchyň s ostrůvkem",
      category: "Kuchyně",
      image: "https://images.unsplash.com/photo-1742192757416-27d69a5d5029?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxraXRjaGVuJTIwY2FiaW5ldHMlMjBtb2Rlcm4lMjBpbnRlcmlvciUyMGx1eHVyeSUyMGFwcGxpYW5jZXN8ZW58MHwwfHx8MTc1NTMzNTQyOXww&ixlib=rb-4.1.0&q=85",
      alt: "Modern luxury kitchen interior - Shishu Yadava on Unsplash"
    },
    {
      id: 2,
      title: "Vestavěná skříň s posuvnými dveřmi",
      category: "Skříně",
      image: "https://images.unsplash.com/photo-1722942116307-52f7afb38e7f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHx3YXJkcm9iZSUyMGNsb3NldCUyMGJlZHJvb20lMjBzbGlkaW5nJTIwZG9vcnN8ZW58MHwxfHx8MTc1NTMzNTQyOXww&ixlib=rb-4.1.0&q=85",
      alt: "Built-in wardrobe with sliding doors - Lisa Anna on Unsplash"
    },
    {
      id: 3,
      title: "Koupelnový nábytek s umyvadlem",
      category: "Koupelny",
      image: "https://images.unsplash.com/photo-1633681140152-3b8726450518?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw2fHxiYXRocm9vbSUyMHZhbml0eSUyMG1pcnJvciUyMG1vZGVybiUyMGRlc2lnbnxlbnwwfDB8fHwxNzU1MzM1NDI5fDA&ixlib=rb-4.1.0&q=85",
      alt: "Modern bathroom vanity with custom storage - Benyamin Bohlouli on Unsplash"
    },
    {
      id: 4,
      title: "Kancelářský nábytek na míru",
      category: "Kanceláře",
      image: "https://images.unsplash.com/photo-1745970347652-8f22f5d7d3ba?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw2fHxvZmZpY2UlMjBkZXNrJTIwd29ya3NwYWNlJTIwcHJvZmVzc2lvbmFsfGVufDB8MHx8fDE3NTUzMzU0Mjl8MA&ixlib=rb-4.1.0&q=85",
      alt: "Contemporary office space with custom desk - Deliberate Directions on Unsplash"
    },
    {
      id: 5,
      title: "Luxusní kuchyň s mramorovými akcenty",
      category: "Kuchyně",
      image: "https://images.unsplash.com/photo-1742280879518-ada47b660ccd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxraXRjaGVuJTIwY2FiaW5ldHMlMjBtb2Rlcm4lMjBpbnRlcmlvciUyMGx1eHVyeSUyMGFwcGxpYW5jZXN8ZW58MHwwfHx8MTc1NTMzNTQyOXww&ixlib=rb-4.1.0&q=85",
      alt: "Luxury kitchen with marble accents - Shishu Yadava on Unsplash"
    },
    {
      id: 6,
      title: "Moderní koupelna s dřevěnými prvky",
      category: "Koupelny",
      image: "https://images.unsplash.com/photo-1595515769499-0f61fc8db2e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw3fHxiYXRocm9vbSUyMHZhbml0eSUyMG1pcnJvciUyMG1vZGVybiUyMGRlc2lnbnxlbnwwfDB8fHwxNzU1MzM1NDI5fDA&ixlib=rb-4.1.0&q=85",
      alt: "Modern bathroom with wooden elements - Sanibell BV on Unsplash"
    }
  ];

  return (
    <section class="portfolio-section section" id="portfolio">
      <div class="container">
        <div class="portfolio-header">
          <h2 class="section-title">Nejnovější realizace</h2>
          <p class="section-description">
            Podívejte se na naše nejlepší projekty, které jsme realizovali pro spokojené zákazníky
          </p>
        </div>
        
        <div class="portfolio-grid">
          {portfolioItems.map((item, index) => (
            <div 
              key={item.id} 
              class={`portfolio-item ${index === 0 ? 'featured' : ''} ${index === 3 ? 'wide' : ''}`}
            >
              <div class="portfolio-image-container">
                <img 
                  src={item.image}
                  alt={item.alt}
                  class="portfolio-image"
                  width="400"
                  height="300"
                />
                <div class="portfolio-overlay">
                  <div class="portfolio-content">
                    <span class="portfolio-category">{item.category}</span>
                    <h3 class="portfolio-title">{item.title}</h3>
                    <button class="portfolio-view-btn">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                      Zobrazit detail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div class="portfolio-cta">
          <a href="#contact" class="btn btn-glass">
            Zobrazit celou galerii
          </a>
        </div>
      </div>
      
    </section>
  );
});