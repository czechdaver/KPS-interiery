import { component$, useStylesScoped$, useTask$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import { loadAllGalleries, type GalleryData, getImagePath, getLightboxImageUrl } from '../lib/gallery';
import { ResponsiveImage } from "./ResponsiveImage";
import { PhImages } from "~/components/icons";

const styles = `
  .portfolio-section {
    background: linear-gradient(135deg, var(--light-gray) 0%, var(--white) 100%);
  }
  
  .portfolio-header {
    text-align: center;
    max-width: 600px;
    margin: 0 auto 2.5rem;
  }
  
  .portfolio-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-auto-rows: 200px;
    gap: 1rem;
    margin-bottom: 3rem;
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
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
    color: var(--white);
  }
  
  /* Mosaic layout patterns - max 3 pictures per row */
  .portfolio-item.mosaic-large {
    grid-column: span 3;
    grid-row: span 2;
  }

  .portfolio-item.mosaic-wide {
    grid-column: span 2;
    grid-row: span 1;
  }

  .portfolio-item.mosaic-tall {
    grid-column: span 1;
    grid-row: span 2;
  }

  .portfolio-item.mosaic-small {
    grid-column: span 1;
    grid-row: span 1;
  }

  .portfolio-item.mosaic-medium {
    grid-column: span 2;
    grid-row: span 2;
  }
  
  .portfolio-item:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.41);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.60);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
    color: var(--white);
  }
  
  .portfolio-image-container {
    position: relative;
    width: 100%;
    height: 100%;
    /* Remove problematic min-height that was affecting small/wide tiles */
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
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 1rem;
  }

  .portfolio-item:hover .portfolio-overlay {
    opacity: 1;
  }
  
  .portfolio-content {
    text-align: center;
    color: var(--white);
    transform: translateY(20px);
    transition: var(--transition);
    width: 100%;
    max-width: 100%;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 1rem; /* Control spacing between elements */
    margin: 0 !important;
    padding: 0 !important;
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
    margin: 0 !important; /* No margins - using flexbox gap */
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    color: white;
  }
  
  .portfolio-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 !important; /* No margins - using flexbox gap */
    line-height: 1.3;
    color: white;
    /* Limit to 2 lines with ellipsis truncation */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: calc(1.3em * 2); /* 2 lines based on line-height */
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
    margin: 0 !important; /* Reset all button margins */
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
  
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  /* Tablet screens (769px to 1024px) */
  @media (min-width: 769px) and (max-width: 1024px) {
    .portfolio-grid {
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: 180px;
    }
    
    .portfolio-overlay {
      padding: 0.8rem !important;
    }
    
    .portfolio-content {
      gap: 0.8rem !important; /* Smaller gap for medium screens */
    }
    
    .portfolio-category {
      font-size: 0.8rem;
      padding: 0.4rem 0.8rem;
    }
    
    .portfolio-title {
      font-size: 1.2rem;
      line-height: 1.2;
      max-height: calc(1.2em * 2); /* Update max-height for smaller font */
    }
    
    .portfolio-view-btn {
      padding: 0.6rem 1.2rem;
      font-size: 0.9rem;
      gap: 0.4rem;
    }
    
    .portfolio-view-btn svg {
      width: 20px;
      height: 20px;
    }

    /* Disharmonic rearrangement - create asymmetrical, gap-free layout */
    /* Using !important to override original mosaic classes */
    
    /* First item: Small square (top-left) */
    .portfolio-item:nth-child(1) {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }
    
    /* Second item: Wide rectangle (top-center+right) */
    .portfolio-item:nth-child(2) {
      grid-column: span 2 !important;
      grid-row: span 1 !important;
    }
    
    /* Third item: Tall rectangle (left side, rows 2-3) */
    .portfolio-item:nth-child(3) {
      grid-column: span 1 !important;
      grid-row: span 2 !important;
    }
    
    /* Fourth item: Small square (middle-right, row 2) */
    .portfolio-item:nth-child(4) {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }
    
    /* Fifth item: Small square (far-right, row 2) */
    .portfolio-item:nth-child(5) {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }
    
    /* Sixth item: Wide rectangle (center+right, row 3) */
    .portfolio-item:nth-child(6) {
      grid-column: span 2 !important;
      grid-row: span 1 !important;
    }
    
    /* Seventh item: Large square (left+center, rows 4-5) */
    .portfolio-item:nth-child(7) {
      grid-column: span 2 !important;
      grid-row: span 2 !important;
    }
    
    /* Eighth item: Tall rectangle (right side, rows 4-5) */
    .portfolio-item:nth-child(8) {
      grid-column: span 1 !important;
      grid-row: span 2 !important;
    }
    
    /* Ninth item: Small square (left, row 6) */
    .portfolio-item:nth-child(9) {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }
    
    /* Tenth item: Wide rectangle (center+right, row 6) */
    .portfolio-item:nth-child(10) {
      grid-column: span 2 !important;
      grid-row: span 1 !important;
    }
  }

  @media (max-width: 768px) {
    .portfolio-grid {
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: 160px;
      gap: 0.75rem;
    }

    /* Mobile layout - gap-free pattern with one big square */
    
    /* Row 1-2: Big square (2×2) - focal point */
    .portfolio-item:nth-child(1) {
      grid-column: span 2 !important;
      grid-row: span 2 !important;
    }
    
    /* Row 3: Two small squares side by side */
    .portfolio-item:nth-child(2) {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }
    
    .portfolio-item:nth-child(3) {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }
    
    /* Row 4-5: Tall rectangle + two small squares */
    .portfolio-item:nth-child(4) {
      grid-column: span 1 !important;
      grid-row: span 2 !important;
    }
    
    .portfolio-item:nth-child(5) {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }
    
    .portfolio-item:nth-child(6) {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }
    
    /* Row 6-7: Two small squares + tall rectangle */
    .portfolio-item:nth-child(7) {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }
    
    .portfolio-item:nth-child(8) {
      grid-column: span 1 !important;
      grid-row: span 2 !important;
    }
    
    .portfolio-item:nth-child(9) {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }
    
    /* Row 8: Two small squares */
    .portfolio-item:nth-child(10) {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }

    /* Responsive overlay content for mobile screens */
    .portfolio-overlay {
      padding: 0.6rem !important;
    }
    
    .portfolio-content {
      gap: 0.6rem !important; /* Smaller gap for mobile screens */
    }
    
    .portfolio-category {
      font-size: 0.7rem;
      padding: 0.3rem 0.6rem;
    }
    
    .portfolio-title {
      font-size: 1rem;
      line-height: 1.1;
      max-height: calc(1.1em * 2); /* Update max-height for mobile font */
    }
    
    .portfolio-view-btn {
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
      gap: 0.3rem;
    }
    
    .portfolio-view-btn svg {
      width: 18px;
      height: 18px;
    }
    
    /* Make overlay slightly more visible on mobile for better UX */
    .portfolio-item:hover .portfolio-overlay {
      opacity: 0.95;
    }
    
    /* Reduce hover transform on mobile for better touch experience */
    .portfolio-item:hover {
      transform: translateY(-4px);
    }

    .portfolio-image-container {
      min-height: 100%;
    }
  }
`;

export const PortfolioSection = component$(() => {
  useStylesScoped$(styles);
  const galleries = useSignal<GalleryData[]>([]);
  const isLoading = useSignal(true);
  const hasError = useSignal(false);
  const errorMessage = useSignal('');

  // Utility function for shuffling arrays randomly
  const shuffleArray = (array: any[]): any[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Featured gallery IDs that should be shown in portfolio section
  const FEATURED_GALLERY_IDS = [
    'kuchyn-cerna',
    'kuchyn-bila-ostruvek',
    'kuchyn-retro-bila',
    'kuchyn-bilo-hneda-l-varianta1', // Bílo-hnědá kuchyň do L - varianta 1
    'kuchyn-bila-u-tvar', // Bílá kuchyň do U
    'loznice-bilo-hneda', // Bílo-hnědá ložnice
    'loznice-hneda-zkosene', // Hnědá ložnice se zkosenou střechou
    'koupelna-cerna', // Černá koupelna
    'koupelna-2', // Moderní koupelna 2
    'obyvak' // Obývací pokoj
  ] as const;

  // Optimized mosaic layout patterns - filling all spaces in 6-column grid
  const MOSAIC_PATTERNS = [
    { size: 'large', gridClass: 'mosaic-large' }, // 3x2 (covers half row) - positions 1-3, rows 1-2
    { size: 'tall', gridClass: 'mosaic-tall' }, // 1x2 - position 4, rows 1-2
    { size: 'wide', gridClass: 'mosaic-wide' }, // 2x1 - positions 5-6, row 1
    { size: 'wide', gridClass: 'mosaic-wide' }, // 2x1 - positions 5-6, row 2
    { size: 'wide', gridClass: 'mosaic-wide' }, // 2x1 - positions 1-2, row 3 (bottom left expanded)
    { size: 'small', gridClass: 'mosaic-small' }, // 1x1 - position 3, row 3
    { size: 'medium', gridClass: 'mosaic-medium' }, // 2x2 - positions 4-5, rows 3-4
    { size: 'tall', gridClass: 'mosaic-tall' }, // 1x2 - position 6, rows 3-4
    { size: 'wide', gridClass: 'mosaic-wide' }, // 2x1 - positions 1-2, row 4
    { size: 'small', gridClass: 'mosaic-small' }, // 1x1 - position 3, row 4
  ];

  // Load galleries on both server and client
  useTask$(async () => {
    try {
      const loadedGalleries = await loadAllGalleries();

      if (loadedGalleries.length === 0) {
        hasError.value = true;
        errorMessage.value = 'Nepodařilo se načíst galerie. Zkuste to prosím později.';
        return;
      }

      galleries.value = loadedGalleries;
    } catch (error) {
      console.error('Failed to load galleries (SSR):', error);
      hasError.value = true;
      errorMessage.value = 'Chyba při načítání galerií. Zkuste obnovit stránku.';
    } finally {
      isLoading.value = false;
    }
  });

  // Ensure galleries load on client-side hydration
  useVisibleTask$(async () => {
    // If galleries are already loaded, don't reload
    if (galleries.value.length > 0) {
      return;
    }

    try {
      isLoading.value = true;
      hasError.value = false;
      const loadedGalleries = await loadAllGalleries();

      if (loadedGalleries.length === 0) {
        hasError.value = true;
        errorMessage.value = 'Nepodařilo se načíst galerie. Zkuste to prosím později.';
        return;
      }

      galleries.value = loadedGalleries;
    } catch (error) {
      console.error('Failed to load galleries (client):', error);
      hasError.value = true;
      errorMessage.value = 'Chyba při načítání galerií. Zkuste obnovit stránku.';
    } finally {
      isLoading.value = false;
    }
  });

  const openLightbox = $((gallery: GalleryData) => {
    if (typeof window !== 'undefined') {
      import('photoswipe')
        .then(({ default: PhotoSwipe }) => {
          if (!gallery.images || gallery.images.length === 0) {
            console.warn(`No images found for gallery ${gallery.id}`);
            return;
          }

          const items = gallery.images.map(img => ({
            src: getLightboxImageUrl(gallery.id, img.src, img.width, img.height),
            width: img.width || 1200,
            height: img.height || 800,
            alt: img.alt || gallery.title,
            caption: img.caption || img.alt
          }));

          const pswp = new PhotoSwipe({
            dataSource: items,
            showHideAnimationType: 'zoom',
            bgOpacity: 0.9,
            spacing: 0.1,
            allowPanToNext: true,
            loop: true,
            pinchToClose: true,
            closeOnVerticalDrag: true,
            index: 0,
            clickToCloseNonZoomable: true
          });
          
          pswp.init();
        })
        .catch(error => {
          console.error('Failed to load PhotoSwipe:', error);
          // Fallback: just log the error, user can still see the thumbnail
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
    <section class="portfolio-section section" id="realizace">
      <div class="container">
        <div class="portfolio-header">
          <h2 class="section-title">Nejnovější realizace</h2>
          <p class="section-description">
            Podívejte se na naše nejlepší projekty, které jsme realizovali pro spokojené zákazníky
          </p>
        </div>
        
        {isLoading.value ? (
          <div class="portfolio-loading" role="status" aria-live="polite">
            <p>Načítání galerií...</p>
          </div>
        ) : hasError.value ? (
          <div class="portfolio-loading" role="alert" aria-live="assertive">
            <p>{errorMessage.value}</p>
            <button 
              class="btn btn-primary"
              onClick$={() => window.location.reload()}
              style="margin-top: 1rem;"
            >
              Obnovit stránku
            </button>
          </div>
        ) : (
          <div class="portfolio-grid">
            {(() => {
              // Filter featured galleries and shuffle them randomly
              const featuredGalleries = shuffleArray(
                galleries.value.filter(gallery =>
                  FEATURED_GALLERY_IDS.includes(gallery.id as any)
                )
              );

              // Apply mosaic layout patterns
              return featuredGalleries
                .slice(0, 10) // Show all 10 items to fill the optimized mosaic pattern
                .map((gallery, index) => {
                  const mosaicPattern = MOSAIC_PATTERNS[index % MOSAIC_PATTERNS.length];
                  const coverImageData = gallery.images.find(img =>
                    img.src === gallery.coverImage ||
                    img.src === (gallery.coverImages && gallery.coverImages[0])
                  ) || gallery.images[0];
                  return (
                    <article
                      key={gallery.id}
                      class={`portfolio-item ${mosaicPattern.gridClass}`}
                      role="article"
                      aria-label={`Portfolio položka: ${gallery.title}`}
                    >
                  <div class="portfolio-image-container">
                    <ResponsiveImage
                      src={getImagePath(gallery.id, gallery.coverImage || 'placeholder.jpg')}
                      alt={`${gallery.title} - náhledový obrázek`}
                      class="portfolio-image"
                      responsive={true}
                      loading="eager"
                      priority={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      width={coverImageData?.width}
                      height={coverImageData?.height}
                    />
                    <div class="portfolio-overlay" role="presentation">
                      <div class="portfolio-content">
                        <span
                          class="portfolio-category"
                          aria-label={`Kategorie: ${gallery.category}`}
                        >
                          {gallery.category}
                        </span>
                        <h3 class="portfolio-title">{gallery.title}</h3>
                        <button
                          class="portfolio-view-btn"
                          onClick$={() => openLightbox(gallery)}
                          aria-label={`Zobrazit galerii ${gallery.title} (${gallery.images?.length || 0} fotografií)`}
                          type="button"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                          </svg>
                          Zobrazit galerii
                          {gallery.images?.length > 0 && (
                            <span class="visually-hidden">
                              ({gallery.images.length} fotografií)
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
                  );
                });
            })()}
          </div>
        )}
        
        
        <div class="portfolio-cta">
          <a href="#galerie" class="btn btn-accent">
            <PhImages size={24} />
            Zobrazit celou galerii
          </a>
        </div>
      </div>
      
    </section>
  );
});