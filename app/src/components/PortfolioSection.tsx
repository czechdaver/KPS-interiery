import { component$, useStylesScoped$, useTask$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import { loadAllGalleries, type GalleryData, getImagePath, getLightboxImageUrl } from '../lib/gallery';
import { ResponsiveImage } from "./ResponsiveImage";

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
    background: rgba(255, 255, 255, 0.20);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.20);
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
    background: rgba(255, 255, 255, 0.41);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.60);
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
      rgba(50, 38, 36, 0.7) 0%,
      rgba(200, 139, 78, 0.6) 100%
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
    background: rgba(255, 255, 255, 0.50);
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
  
  .portfolio-cta .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .portfolio-loading {
    text-align: center;
    padding: 4rem 0;
    color: var(--gray);
    font-size: 1.1rem;
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
  const galleries = useSignal<GalleryData[]>([]);
  const isLoading = useSignal(true);

  useTask$(async () => {
    try {
      const loadedGalleries = await loadAllGalleries();
      galleries.value = loadedGalleries;
    } catch (error) {
      console.error('Failed to load galleries:', error);
    } finally {
      isLoading.value = false;
    }
  });

  const openLightbox = $((gallery: GalleryData) => {
    if (typeof window !== 'undefined') {
      import('photoswipe').then(({ default: PhotoSwipe }) => {
        const items = gallery.images.map(img => {
          // Use optimized images for lightbox
          return {
            src: getLightboxImageUrl(gallery.id, img.src),
            width: img.width,
            height: img.height,
            alt: img.alt,
            caption: img.caption
          };
        });

        const pswp = new PhotoSwipe({
          dataSource: items,
          showHideAnimationType: 'zoom',
          bgOpacity: 0.9,
          spacing: 0.1,
          allowPanToNext: true,
          loop: true,
          pinchToClose: true,
          closeOnVerticalDrag: true,
          index: 0
        });
        
        pswp.init();
      });
    }
  });

  useVisibleTask$(() => {
    if (typeof window !== 'undefined') {
      const existingLink = document.querySelector('link[href*="photoswipe.css"]');
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.css';
        document.head.appendChild(link);
      }
    }
  });

  return (
    <section class="portfolio-section section" id="portfolio">
      <div class="container">
        <div class="portfolio-header">
          <h2 class="section-title">Nejnovější realizace</h2>
          <p class="section-description">
            Podívejte se na naše nejlepší projekty, které jsme realizovali pro spokojené zákazníky
          </p>
        </div>
        
        {isLoading.value ? (
          <div class="portfolio-loading">
            <p>Načítání galerií...</p>
          </div>
        ) : (
          <div class="portfolio-grid">
            {galleries.value.map((gallery) => 
              gallery.images.slice(0, 6).map((image, imageIndex) => (
                <div 
                  key={`${gallery.id}-${imageIndex}`} 
                  class={`portfolio-item ${imageIndex === 0 ? 'featured' : ''} ${imageIndex === 3 ? 'wide' : ''}`}
                >
                  <div class="portfolio-image-container">
                    <ResponsiveImage 
                      src={getImagePath(gallery.id, image.src)}
                      alt={image.alt}
                      class="portfolio-image"
                      width={400}
                      height={300}
                      loading={imageIndex < 2 ? 'eager' : 'lazy'}
                      priority={imageIndex === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div class="portfolio-overlay">
                      <div class="portfolio-content">
                        <span class="portfolio-category">{gallery.category}</span>
                        <h3 class="portfolio-title">{gallery.title}</h3>
                        <button 
                          class="portfolio-view-btn"
                          onClick$={() => openLightbox(gallery)}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                          </svg>
                          Zobrazit galerii
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ).flat()}
          </div>
        )}
        
        
        <div class="portfolio-cta">
          <a href="#galleries" class="btn btn-accent">
            <i class="ph-duotone ph-images" style="font-size: 24px;"></i>
            Zobrazit celou galerii
          </a>
        </div>
      </div>
      
    </section>
  );
});