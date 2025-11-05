import { component$, useSignal, useVisibleTask$, useStylesScoped$, $ } from '@builder.io/qwik';
import type { GalleryData } from '../lib/gallery';
import { getLightboxImageUrl, getImagePath } from '../lib/gallery';
import { ResponsiveImage } from './ResponsiveImage';

interface PhotoSwipeGalleryProps {
  gallery: GalleryData;
  showTitle?: boolean;
}

const styles = `
  .gallery-container {
    width: 100%;
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-auto-rows: 200px;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .gallery-item {
    position: relative;
    background: var(--light-gray);
    border-radius: var(--radius-sm);
    overflow: hidden;
    cursor: pointer;
    transition: var(--transition);
    border: 1px solid rgba(200, 139, 78, 0.1);
  }

  .gallery-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    border-color: var(--secondary);
  }

  /* Exact same mosaic classes as landing page portfolio */
  .gallery-item.mosaic-large {
    grid-column: span 3;
    grid-row: span 2;
  }

  .gallery-item.mosaic-wide {
    grid-column: span 2;
    grid-row: span 1;
  }

  .gallery-item.mosaic-tall {
    grid-column: span 1;
    grid-row: span 2;
  }

  .gallery-item.mosaic-small {
    grid-column: span 1;
    grid-row: span 1;
  }

  .gallery-item.mosaic-medium {
    grid-column: span 2;
    grid-row: span 2;
  }

  .gallery-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: var(--transition);
  }

  .gallery-item:hover .gallery-image {
    transform: scale(1.05);
  }

  .gallery-overlay {
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
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: var(--transition);
    padding: 1rem;
  }

  .gallery-item:hover .gallery-overlay {
    opacity: 1;
  }

  .gallery-content {
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
    gap: 1rem;
    margin: 0 !important;
    padding: 0 !important;
  }

  .gallery-item:hover .gallery-content {
    transform: translateY(0);
  }

  .gallery-view-btn {
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
    margin: 0 !important;
  }

  .gallery-view-btn:hover {
    background: var(--accent);
    color: var(--white);
    transform: translateY(-2px);
  }

  /* Tablet screens (769px to 1024px) */
  @media (min-width: 769px) and (max-width: 1024px) {
    .gallery-grid {
      grid-template-columns: repeat(4, 1fr);
      grid-auto-rows: 160px;
      gap: 0.8rem;
    }

    .gallery-overlay {
      padding: 0.8rem !important;
    }

    .gallery-content {
      gap: 0.8rem !important;
    }

    .gallery-view-btn {
      padding: 0.6rem 1.2rem;
      font-size: 0.9rem;
      gap: 0.4rem;
    }

    .gallery-view-btn svg {
      width: 20px;
      height: 20px;
    }

    /* Perfect 8-item repeating pattern for tablet - zero gaps */
    .gallery-item:nth-child(8n+1) {
      grid-column: span 2 !important;
      grid-row: span 2 !important;
    }

    .gallery-item:nth-child(8n+2) {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }

    .gallery-item:nth-child(8n+3) {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }

    .gallery-item:nth-child(8n+4) {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }

    .gallery-item:nth-child(8n+5) {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }

    .gallery-item:nth-child(8n+6) {
      grid-column: span 2 !important;
      grid-row: span 1 !important;
    }

    .gallery-item:nth-child(8n+7) {
      grid-column: span 1 !important;
      grid-row: span 2 !important;
    }

    .gallery-item:nth-child(8n) {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }
  }

  @media (max-width: 768px) {
    .gallery-grid {
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: 140px;
      gap: 0.6rem;
    }

    .gallery-overlay {
      padding: 0.6rem !important;
    }

    .gallery-content {
      gap: 0.6rem !important;
    }

    .gallery-view-btn {
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
      gap: 0.3rem;
    }

    .gallery-view-btn svg {
      width: 18px;
      height: 18px;
    }

    .gallery-item:hover .gallery-overlay {
      opacity: 0.95;
    }

    .gallery-item:hover {
      transform: translateY(-2px);
    }

    /* Perfect 6-item repeating pattern for mobile - zero gaps */
    .gallery-item:nth-child(6n+1) {
      grid-column: span 2 !important;
      grid-row: span 2 !important;
    }

    .gallery-item:nth-child(6n+2) {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }

    .gallery-item:nth-child(6n+3) {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }

    .gallery-item:nth-child(6n+4) {
      grid-column: span 1 !important;
      grid-row: span 2 !important;
    }

    .gallery-item:nth-child(6n+5) {
      grid-column: span 2 !important;
      grid-row: span 1 !important;
    }

    .gallery-item:nth-child(6n) {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }
  }

  /* Extra small mobile screens (480px and below) */
  @media (max-width: 480px) {
    .gallery-grid {
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: 120px;
      gap: 0.5rem;
    }

    /* Simple 4-item repeating pattern for very small screens */
    .gallery-item:nth-child(4n+1) {
      grid-column: span 2 !important;
      grid-row: span 2 !important;
    }

    .gallery-item:nth-child(4n+2) {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }

    .gallery-item:nth-child(4n+3) {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }

    .gallery-item:nth-child(4n) {
      grid-column: span 2 !important;
      grid-row: span 1 !important;
    }

    .gallery-overlay {
      padding: 0.5rem !important;
    }

    .gallery-content {
      gap: 0.5rem !important;
    }

    .gallery-view-btn {
      padding: 0.4rem 0.8rem;
      font-size: 0.75rem;
    }

    .gallery-view-btn svg {
      width: 16px;
      height: 16px;
    }
  }
`;

// Define the same mosaic patterns as PortfolioSection for perfect gap-free layout
const MOSAIC_PATTERNS = [
  { size: 'large', gridClass: 'mosaic-large' }, // 3x2 (covers half row) - positions 1-3, rows 1-2
  { size: 'tall', gridClass: 'mosaic-tall' }, // 1x2 - position 4, rows 1-2
  { size: 'wide', gridClass: 'mosaic-wide' }, // 2x1 - positions 5-6, row 1
  { size: 'wide', gridClass: 'mosaic-wide' }, // 2x1 - positions 5-6, row 2
  { size: 'wide', gridClass: 'mosaic-wide' }, // 2x1 - positions 1-2, row 3
  { size: 'small', gridClass: 'mosaic-small' }, // 1x1 - position 3, row 3
  { size: 'medium', gridClass: 'mosaic-medium' }, // 2x2 - positions 4-5, rows 3-4
  { size: 'tall', gridClass: 'mosaic-tall' }, // 1x2 - position 6, rows 3-4
  { size: 'wide', gridClass: 'mosaic-wide' }, // 2x1 - positions 1-2, row 4
  { size: 'small', gridClass: 'mosaic-small' }, // 1x1 - position 3, row 4
];

export const PhotoSwipeGallery = component$<PhotoSwipeGalleryProps>((props) => {
  useStylesScoped$(styles);
  const pswpRef = useSignal<HTMLDivElement>();

  const openGallery = $((startIndex: number = 0) => {
    if (typeof window !== 'undefined') {
      import('photoswipe').then(({ default: PhotoSwipe }) => {
        const items = props.gallery.images.map(img => ({
          src: getLightboxImageUrl(props.gallery.id, img.src, img.width, img.height),
          width: img.width,
          height: img.height,
          alt: img.alt,
          caption: img.caption
        }));

        const pswp = new PhotoSwipe({
          dataSource: items,
          showHideAnimationType: 'zoom',
          bgOpacity: 0.95,
          spacing: 0.1,
          allowPanToNext: true,
          loop: true,
          pinchToClose: true,
          closeOnVerticalDrag: true,
          showAnimationDuration: 300,
          hideAnimationDuration: 300,
          index: startIndex
        });

        pswp.init();
      });
    }
  });

  useVisibleTask$(() => {
    // Preload PhotoSwipe styles with proper loading to prevent FOUC
    if (typeof window !== 'undefined') {
      const existingLink = document.querySelector('link[href*="photoswipe.css"]');
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.css';
        link.media = 'print';
        link.onload = () => {
          link.media = 'all';
        };
        document.head.appendChild(link);
      }
    }
  });

  return (
    <div class="gallery-container" ref={pswpRef}>
      {props.showTitle !== false && (
        <h2 style="font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 2rem; margin-bottom: 2rem; text-align: center; color: var(--primary);">
          {props.gallery.title}
        </h2>
      )}

      <div class="gallery-grid">
        {props.gallery.images.map((image, index) => {
          const mosaicPattern = MOSAIC_PATTERNS[index % MOSAIC_PATTERNS.length];
          return (
            <div
              key={index}
              class={`gallery-item ${mosaicPattern.gridClass}`}
              onClick$={() => openGallery(index)}
              role="button"
              tabIndex={0}
              aria-label={`Otevřít fotografii ${index + 1}: ${image.alt}`}
              onKeyDown$={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openGallery(index);
                }
              }}
            >
            <ResponsiveImage
              src={getImagePath(props.gallery.id, image.src)}
              alt={image.alt}
              class="gallery-image"
              loading={index < 8 ? "eager" : "lazy"}
              responsive={true}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
            />
            <div class="gallery-overlay" role="presentation">
              <div class="gallery-content">
                <button
                  class="gallery-view-btn"
                  type="button"
                  aria-label={`Otevřít fotografii ${index + 1}: ${image.alt}`}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                  Otevřít
                </button>
              </div>
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
});