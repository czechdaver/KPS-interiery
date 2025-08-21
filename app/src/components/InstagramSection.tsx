import { component$, useStylesScoped$ } from "@builder.io/qwik";

const styles = `
  .instagram-section {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
    color: var(--white);
  }
  
  .instagram-header {
    text-align: center;
    margin-bottom: 4rem;
  }
  
  .instagram-header .section-title {
    color: var(--white);
  }
  
  .instagram-header .section-description {
    color: rgba(255, 255, 255, 0.9);
  }
  
  .instagram-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
  }
  
  .instagram-post {
    background: rgba(255, 255, 255, 0.20);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: var(--transition);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.39);
  }
  
  .instagram-post:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
    background: rgba(255, 255, 255, 0.30);
  }
  
  .instagram-image-container {
    position: relative;
    width: 100%;
    height: 280px;
    overflow: hidden;
  }
  
  .instagram-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: var(--transition);
  }
  
  .instagram-post:hover .instagram-image {
    transform: scale(1.05);
  }
  
  .instagram-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: var(--transition);
  }
  
  .instagram-post:hover .instagram-overlay {
    opacity: 1;
  }
  
  .instagram-stats {
    display: flex;
    align-items: center;
    gap: 2rem;
    color: var(--white);
  }
  
  .instagram-likes {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
  }
  
  .instagram-icon {
    opacity: 0.8;
    transition: var(--transition);
  }
  
  .instagram-post:hover .instagram-icon {
    opacity: 1;
    transform: scale(1.1);
  }
  
  .instagram-caption {
    padding: 1.5rem;
  }
  
  .instagram-caption p {
    font-size: 0.95rem;
    line-height: 1.5;
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .instagram-cta {
    text-align: center;
  }
  
  .instagram-cta .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  @media (max-width: 768px) {
    .instagram-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    
    .instagram-image-container {
      height: 200px;
    }
    
    .instagram-caption {
      padding: 1rem;
    }
    
    .instagram-caption p {
      font-size: 0.85rem;
    }
  }
  
  @media (max-width: 480px) {
    .instagram-grid {
      grid-template-columns: 1fr;
    }
    
    .instagram-image-container {
      height: 250px;
    }
  }
`;

export const InstagramSection = component$(() => {
  useStylesScoped$(styles);
  // Mock Instagram posts data
  const instagramPosts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1742192757416-27d69a5d5029?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxraXRjaGVuJTIwY2FiaW5ldHMlMjBtb2Rlcm4lMjBpbnRlcmlvciUyMGx1eHVyeSUyMGFwcGxpYW5jZXN8ZW58MHwwfHx8MTc1NTMzNTQyOXww&ixlib=rb-4.1.0&q=85",
      alt: "Modern kitchen realization - Shishu Yadava on Unsplash",
      likes: 142,
      caption: "Nová kuchyň pro spokojené zákazníky ✨ #kpsinteriery #kuchynenámíru"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1722942116307-52f7afb38e7f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHx3YXJkcm9iZSUyMGNsb3NldCUyMGJlZHJvb20lMjBzbGlkaW5nJTIwZG9vcnN8ZW58MHwxfHx8MTc1NTMzNTQyOXww&ixlib=rb-4.1.0&q=85",
      alt: "Wardrobe installation - Lisa Anna on Unsplash",
      likes: 89,
      caption: "Vestavěná skříň s posuvnými dveřmi 🚪 #vestaveneskrene #nabytek"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1633681140152-3b8726450518?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw2fHxiYXRocm9vbSUyMHZhbml0eSUyMG1pcnJvciUyMG1vZGVybiUyMGRlc2lnbnxlbnwwfDB8fHwxNzU1MzM1NDI5fDA&ixlib=rb-4.1.0&q=85",
      alt: "Bathroom furniture - Benyamin Bohlouli on Unsplash",
      likes: 156,
      caption: "Koupelnový nábytek na míru 🛁 #koupelna #design #kvalita"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1745970347652-8f22f5d7d3ba?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw2fHxvZmZpY2UlMjBkZXNrJTIwd29ya3NwYWNlJTIwcHJvZmVzc2lvbmFsfGVufDB8MHx8fDE3NTUzMzU0Mjl8MA&ixlib=rb-4.1.0&q=85",
      alt: "Office furniture - Deliberate Directions on Unsplash",
      likes: 73,
      caption: "Kancelářský nábytek pro moderní workspace 💼 #kancelar #office"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1742280879518-ada47b660ccd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxraXRjaGVuJTIwY2FiaW5ldHMlMjBtb2Rlcm4lMjBpbnRlcmlvciUyMGx1eHVyeSUyMGFwcGxpYW5jZXN8ZW58MHwwfHx8MTc1NTMzNTQyOXww&ixlib=rb-4.1.0&q=85",
      alt: "Luxury kitchen - Shishu Yadava on Unsplash",
      likes: 198,
      caption: "Luxusní kuchyň s mramorovými detaily 🏆 #luxus #mramor #kuchyne"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1595515769499-0f61fc8db2e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw3fHxiYXRocm9vbSUyMHZhbml0eSUyMG1pcnJvciUyMG1vZGVybiUyMGRlc2lnbnxlbnwwfDB8fHwxNzU1MzM1NDI5fDA&ixlib=rb-4.1.0&q=85",
      alt: "Modern bathroom - Sanibell BV on Unsplash",
      likes: 124,
      caption: "Moderní koupelna s dřevěnými prvky 🌿 #drevo #priroda #koupelna"
    }
  ];

  return (
    <section class="instagram-section section">
      <div class="container">
        <div class="instagram-header">
          <h2 class="section-title">Sledujte nás na Instagramu</h2>
          <p class="section-description">
            Nejnovější realizace a zákulisí naší práce najdete na našem Instagram profilu
          </p>
        </div>
        
        <div class="instagram-grid">
          {instagramPosts.map((post) => (
            <div key={post.id} class="instagram-post">
              <div class="instagram-image-container">
                <img 
                  src={post.image}
                  alt={post.alt}
                  class="instagram-image"
                  width="300"
                  height="300"
                />
                <div class="instagram-overlay">
                  <div class="instagram-stats">
                    <div class="instagram-likes">
                      <i class="ph-duotone ph-heart icon-duotone-reverse" style="font-size: 24px;"></i>
                      {post.likes}
                    </div>
                    <div class="instagram-icon">
                      <i class="ph-duotone ph-instagram-logo icon-duotone" style="font-size: 32px;"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="instagram-caption">
                <p>{post.caption}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div class="instagram-cta">
          <a 
            href="https://instagram.com/kpsinteriery" 
            target="_blank" 
            rel="noopener noreferrer"
            class="btn btn-accent"
          >
            <i class="ph-duotone ph-instagram-logo" style="font-size: 24px; margin-right: 0.5rem;"></i>
            Sledovat na Instagramu
          </a>
        </div>
      </div>
      
    </section>
  );
});