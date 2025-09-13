import { component$, useStylesScoped$, useSignal, useTask$, useVisibleTask$, $ } from "@builder.io/qwik";
import { loadAllGalleries, getGalleriesByCategory, mapGalleryForDisplay, getLightboxImageUrl } from "../lib/gallery";
import type { GalleryData } from "../lib/gallery";
import { ResponsiveImage } from "./ResponsiveImage";
import { Footer } from "./Footer";

const styles = `
  .galleries-page {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--white) 0%, var(--light-gray) 100%);
  }
  
  .galleries-hero {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
    color: var(--white);
    padding: 4rem 0 3rem;
    position: relative;
    overflow: hidden;
  }
  
  .galleries-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grid)" /></svg>');
    opacity: 0.3;
  }
  
  .galleries-hero-content {
    position: relative;
    z-index: 1;
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .galleries-title {
    font-family: "Montserrat", sans-serif;
    font-weight: 900;
    font-size: clamp(2.5rem, 5vw, 4rem);
    line-height: 1.1;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, var(--white) 0%, var(--secondary-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .galleries-subtitle {
    font-size: 1.3rem;
    opacity: 0.9;
    margin-bottom: 2rem;
    font-weight: 400;
  }
  
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.95rem;
  }
  
  .breadcrumb a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: var(--transition);
  }
  
  .breadcrumb a:hover {
    color: var(--secondary-light);
  }
  
  .breadcrumb-separator {
    color: rgba(255, 255, 255, 0.6);
  }
  
  .breadcrumb-current {
    color: var(--secondary-light);
    font-weight: 600;
  }
  
  .back-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--white);
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-sm);
    text-decoration: none;
    font-weight: 600;
    transition: var(--transition);
    margin-top: 1rem;
  }
  
  .back-button:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  .galleries-content {
    padding: 3rem 0;
    min-height: calc(100vh - 300px);
  }
  
  .gallery-section {
    margin-bottom: 5rem;
  }
  
  .gallery-section:last-child {
    margin-bottom: 0;
  }
  
  .gallery-section-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .gallery-section-title {
    font-family: "Montserrat", sans-serif;
    font-weight: 700;
    font-size: clamp(1.8rem, 3vw, 2.5rem);
    color: var(--primary);
    margin-bottom: 1rem;
    position: relative;
  }
  
  .gallery-section-title::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, var(--secondary), var(--secondary-light));
    border-radius: 2px;
  }
  
  .gallery-section-description {
    font-size: 1.1rem;
    color: var(--gray);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
  
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }
  
  .gallery-card {
    background: var(--white);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: var(--transition);
    border: 1px solid rgba(200, 139, 78, 0.1);
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .gallery-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
  
  .gallery-preview {
    position: relative;
    height: 240px;
    overflow: hidden;
    cursor: pointer;
    background: var(--light-gray);
  }
  
  .gallery-preview-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 2px;
    height: 100%;
  }
  
  .gallery-preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: var(--transition);
  }
  
  .gallery-preview-image:first-child {
    grid-row: 1 / -1;
  }
  
  .gallery-card:hover .gallery-preview-image {
    transform: scale(1.05);
  }
  
  .gallery-overlay {
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
  
  .gallery-card:hover .gallery-overlay {
    opacity: 1;
  }
  
  .gallery-count {
    background: var(--secondary);
    color: var(--white);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .gallery-info {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  
  .gallery-title {
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 1.3rem;
    color: var(--primary);
    margin-bottom: 0.5rem;
  }
  
  .gallery-description {
    color: var(--gray);
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 1rem;
  }
  
  .gallery-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
    color: var(--gray);
    margin-top: auto;
    margin-bottom: 1rem;
  }
  
  .gallery-date {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  
  .gallery-location {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  
  .view-gallery-btn {
    background: var(--secondary);
    color: var(--white);
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-sm);
    text-decoration: none;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: var(--transition);
    margin-top: 0;
    width: 100%;
    justify-content: center;
  }
  
  .view-gallery-btn:hover {
    background: var(--secondary-light);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(200, 139, 78, 0.3);
  }
  
  @media (max-width: 768px) {
    .galleries-hero {
      padding: 3rem 0 2rem;
    }
    
    .gallery-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .gallery-preview {
      height: 220px;
    }
    
    .galleries-content {
      padding: 3rem 0;
    }
    
    .gallery-section {
      margin-bottom: 3rem;
    }
  }
`;

export const GalleriesPage = component$(() => {
  useStylesScoped$(styles);
  
  const galleries = useSignal<GalleryData[]>([]);
  const isLoading = useSignal(true);

  // Load galleries on both server and client
  useTask$(async () => {
    try {
      console.log('Loading galleries for GalleriesPage (SSR)...');
      const loadedGalleries = await loadAllGalleries();
      galleries.value = loadedGalleries;
      console.log(`Loaded ${loadedGalleries.length} galleries for galleries page (SSR)`);
    } catch (error) {
      console.error('Failed to load galleries (SSR):', error);
    } finally {
      isLoading.value = false;
    }
  });

  // Ensure galleries load on client-side hydration
  useVisibleTask$(async () => {
    // If galleries are already loaded, don't reload
    if (galleries.value.length > 0) {
      console.log('Galleries already loaded, skipping client-side load');
      return;
    }

    try {
      isLoading.value = true;
      console.log('Loading galleries for GalleriesPage (client)...');
      const loadedGalleries = await loadAllGalleries();
      galleries.value = loadedGalleries;
      console.log(`Loaded ${loadedGalleries.length} galleries for galleries page (client)`);
    } catch (error) {
      console.error('Failed to load galleries (client):', error);
    } finally {
      isLoading.value = false;
    }
  }, { strategy: 'intersection-observer' });

  const openLightbox = $((gallery: GalleryData) => {
    if (typeof window !== 'undefined') {
      import('photoswipe').then(({ default: PhotoSwipe }) => {
        const items = gallery.images.map(img => {
          // Use optimized images for lightbox
          return {
            src: getLightboxImageUrl(gallery.id, img.src, img.width, img.height),
            width: img.width,
            height: img.height,
            alt: img.alt
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
    window.scrollTo(0, 0);
    
    // Preload PhotoSwipe styles
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

  // Get categorized galleries
  const categorizedGalleries = getGalleriesByCategory(galleries.value);
  
  // Map galleries for display
  const bathroomGalleries = categorizedGalleries.koupelny;
  const otherGalleries = categorizedGalleries.ostatni;

  if (isLoading.value) {
    return (
      <div class="galleries-page">
        <section class="galleries-hero">
          <div class="container">
            <div class="galleries-hero-content">
              <h1 class="galleries-title">Načítání galerií...</h1>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div class="galleries-page">
      <section class="galleries-hero">
        <div class="container">
          <div class="galleries-hero-content">
            <div class="breadcrumb">
              <a href={import.meta.env.BASE_URL || "/"} onClick$={(e) => {
                e.preventDefault();
                window.location.hash = '';
                // Trigger hash change event manually
                window.dispatchEvent(new HashChangeEvent('hashchange'));
              }}>Domů</a>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-current">Galerie</span>
            </div>
            
            <h1 class="galleries-title">Naše realizace</h1>
            <p class="galleries-subtitle">
              Prohlédněte si kompletní galerii našich nejlepších projektů
            </p>
            <a
              href={import.meta.env.BASE_URL || "/"}
              class="back-button"
              onClick$={(e) => {
                e.preventDefault();
                window.location.hash = '';
                // Trigger hash change event manually
                window.dispatchEvent(new HashChangeEvent('hashchange'));
              }}
            >
              <i class="ph-duotone ph-arrow-left" style="font-size: 18px;"></i>
              Zpět na úvod
            </a>
          </div>
        </div>
      </section>

      <section class="galleries-content">
        <div class="container">
          
          {/* Kuchyně Section */}
          <div class="gallery-section">
            <div class="gallery-section-header">
              <h2 class="gallery-section-title">Kuchyně</h2>
              <p class="gallery-section-description">
                Moderní a funkční kuchyně navržené podle vašich potřeb a stylu života
              </p>
            </div>
            
            <div class="gallery-grid">
              {categorizedGalleries.kuchyne.map((gallery) => {
                const displayGallery = mapGalleryForDisplay(gallery);
                const coverImage = displayGallery.coverImages[0]; // Use only the first image
                return (
                  <div key={gallery.id} class="gallery-card">
                    <div 
                      class="gallery-preview"
                      onClick$={() => openLightbox(gallery)}
                    >
                      <ResponsiveImage 
                        src={coverImage}
                        alt={`${displayGallery.title} - náhled`}
                        class="gallery-preview-image"
                        loading="lazy"
                        responsive={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div class="gallery-overlay">
                        <div class="gallery-count">
                          <i class="ph-duotone ph-images" style="font-size: 20px;"></i>
                          {displayGallery.imageCount} fotografií
                        </div>
                      </div>
                    </div>
                    
                    <div class="gallery-info">
                      <h3 class="gallery-title">{displayGallery.title}</h3>
                      <p class="gallery-description">{displayGallery.description}</p>
                      
                      <div class="gallery-meta">
                        <div class="gallery-date">
                          <i class="ph-duotone ph-calendar" style="font-size: 16px;"></i>
                          {displayGallery.date}
                        </div>
                        <div class="gallery-location">
                          <i class="ph-duotone ph-map-pin" style="font-size: 16px;"></i>
                          {displayGallery.location}
                        </div>
                      </div>
                      
                      <button 
                        class="view-gallery-btn"
                        onClick$={() => openLightbox(gallery)}
                        style="border: none; cursor: pointer;"
                      >
                        <i class="ph-duotone ph-eye" style="font-size: 18px;"></i>
                        Zobrazit galerii
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


          {/* Koupelny Section */}
          {bathroomGalleries.length > 0 && (
            <div class="gallery-section">
              <div class="gallery-section-header">
                <h2 class="gallery-section-title">Koupelny</h2>
                <p class="gallery-section-description">
                  Elegantní koupelnové prostory s důrazem na funkčnost a wellness
                </p>
              </div>
              
              <div class="gallery-grid">
                {bathroomGalleries.map((gallery) => {
                  const displayGallery = mapGalleryForDisplay(gallery);
                  const coverImage = displayGallery.coverImages[0]; // Use only the first image
                  return (
                    <div key={gallery.id} class="gallery-card">
                      <div 
                        class="gallery-preview"
                        onClick$={() => openLightbox(gallery)}
                      >
                        <ResponsiveImage 
                          src={coverImage}
                          alt={`${displayGallery.title} - náhled`}
                          class="gallery-preview-image"
                              loading="lazy"
                          responsive={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div class="gallery-overlay">
                          <div class="gallery-count">
                            <i class="ph-duotone ph-images" style="font-size: 20px;"></i>
                            {displayGallery.imageCount} fotografií
                          </div>
                        </div>
                      </div>
                      
                      <div class="gallery-info">
                        <h3 class="gallery-title">{displayGallery.title}</h3>
                        <p class="gallery-description">{displayGallery.description}</p>
                        
                        <div class="gallery-meta">
                          <div class="gallery-date">
                            <i class="ph-duotone ph-calendar" style="font-size: 16px;"></i>
                            {displayGallery.date}
                          </div>
                          <div class="gallery-location">
                            <i class="ph-duotone ph-map-pin" style="font-size: 16px;"></i>
                            {displayGallery.location}
                          </div>
                        </div>
                        
                        <button 
                          class="view-gallery-btn"
                          onClick$={() => openLightbox(gallery)}
                          style="border: none; cursor: pointer;"
                        >
                          <i class="ph-duotone ph-eye" style="font-size: 18px;"></i>
                          Zobrazit galerii
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ostatní Section */}
          {otherGalleries.length > 0 && (
            <div class="gallery-section">
              <div class="gallery-section-header">
                <h2 class="gallery-section-title">Ostatní projekty</h2>
                <p class="gallery-section-description">
                  Kancelářský nábytek, vestavěné skříně a další atypické realizace
                </p>
              </div>
              
              <div class="gallery-grid">
                {otherGalleries.map((gallery) => {
                  const displayGallery = mapGalleryForDisplay(gallery);
                  const coverImage = displayGallery.coverImages[0]; // Use only the first image
                  return (
                    <div key={gallery.id} class="gallery-card">
                      <div 
                        class="gallery-preview"
                        onClick$={() => openLightbox(gallery)}
                      >
                        <ResponsiveImage 
                          src={coverImage}
                          alt={`${displayGallery.title} - náhled`}
                          class="gallery-preview-image"
                              loading="lazy"
                          responsive={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div class="gallery-overlay">
                          <div class="gallery-count">
                            <i class="ph-duotone ph-images" style="font-size: 20px;"></i>
                            {displayGallery.imageCount} fotografií
                          </div>
                        </div>
                      </div>
                      
                      <div class="gallery-info">
                        <h3 class="gallery-title">{displayGallery.title}</h3>
                        <p class="gallery-description">{displayGallery.description}</p>
                        
                        <div class="gallery-meta">
                          <div class="gallery-date">
                            <i class="ph-duotone ph-calendar" style="font-size: 16px;"></i>
                            {displayGallery.date}
                          </div>
                          <div class="gallery-location">
                            <i class="ph-duotone ph-map-pin" style="font-size: 16px;"></i>
                            {displayGallery.location}
                          </div>
                        </div>
                        
                        <button 
                          class="view-gallery-btn"
                          onClick$={() => openLightbox(gallery)}
                          style="border: none; cursor: pointer;"
                        >
                          <i class="ph-duotone ph-eye" style="font-size: 18px;"></i>
                          Zobrazit galerii
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </section>
      <Footer />
    </div>
  );
});