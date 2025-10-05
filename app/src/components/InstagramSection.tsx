import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { PhHeart, PhInstagramLogo } from "~/components/icons";

const styles = `
  .instagram-section {
    background: linear-gradient(135deg, var(--primary) 0%, var(--dark-gray) 100%);
    color: var(--white);
    border-top: 1px solid rgba(200, 139, 78, 0.2);
    border-bottom: 1px solid rgba(200, 139, 78, 0.2);
  }
  
  .instagram-header {
    text-align: center;
    margin-bottom: 4rem;
  }
  
  .instagram-header .section-title {
    /* Uses global gradient from .section-title */
  }
  
  .instagram-header .section-description {
    color: rgba(255, 255, 255, 0.8);
  }
  
  .instagram-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
  }
  
  .instagram-post {
    background: rgba(255, 255, 255, 0.8);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: var(--transition);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(200, 139, 78, 0.2);
  }
  
  .instagram-post:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(200, 139, 78, 0.4);
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
    color: var(--dark-gray);
  }
  
  .instagram-cta {
    text-align: center;
  }

  .instagram-cta .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.5rem;
    width: auto;
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
      image: (import.meta.env.BASE_URL || "/") + "images/galleries/kuchyn-retro-bila/kuchyne_0094-web-400w.avif",
      alt: "Modern retro kitchen realization",
      likes: 142,
      caption: "Nová kuchyň pro spokojené zákazníky ✨ #kpsinteriery #kuchynenámíru"
    },
    {
      id: 2,
      image: (import.meta.env.BASE_URL || "/") + "images/galleries/kuchyn-bila-u-tvar/skrine-0205-web-400w.avif",
      alt: "Wardrobe installation",
      likes: 89,
      caption: "Vestavěná skříň s posuvnými dveřmi 🚪 #vestaveneskrene #nabytek"
    },
    {
      id: 3,
      image: (import.meta.env.BASE_URL || "/") + "images/galleries/kuchyn-retro-bila/kuchyne_0081-web-400w.avif",
      alt: "Bathroom furniture",
      likes: 156,
      caption: "Koupelnový nábytek na míru 🛁 #koupelna #design #kvalita"
    },
    {
      id: 4,
      image: (import.meta.env.BASE_URL || "/") + "images/galleries/kuchyn-retro-bila/kuchyne_0066-web-400w.avif",
      alt: "Office furniture",
      likes: 73,
      caption: "Kancelářský nábytek pro moderní workspace 💼 #kancelar #office"
    },
    {
      id: 5,
      image: (import.meta.env.BASE_URL || "/") + "images/galleries/kuchyn-retro-bila/kuchyne_0105-web-400w.avif",
      alt: "Luxury kitchen",
      likes: 198,
      caption: "Luxusní kuchyň s mramorovými detaily 🏆 #luxus #mramor #kuchyne"
    },
    {
      id: 6,
      image: (import.meta.env.BASE_URL || "/") + "images/galleries/kuchyn-bila-podkrovi/kuchyne_0031-web-400w.avif",
      alt: "Modern bathroom",
      likes: 124,
      caption: "Moderní koupelna s dřevěnými prvky 🌿 #drevo #priroda #koupelna"
    }
  ];

  return (
    <section class="instagram-section section">
      <div class="container">
        <div class="instagram-header">
          <h2 class="section-title-bright">Sledujte nás na Instagramu</h2>
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
                      <PhHeart size={24} class="icon-duotone-reverse" />
                      {post.likes}
                    </div>
                    <div class="instagram-icon">
                      <PhInstagramLogo size={32} class="icon-duotone" />
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
            <PhInstagramLogo size={24} style="margin-right: 0.5rem;" />
            Sledovat na Instagramu
          </a>
        </div>
      </div>
      
    </section>
  );
});