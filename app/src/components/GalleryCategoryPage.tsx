import { component$, useStylesScoped$, useVisibleTask$, $ } from "@builder.io/qwik";
import type { GalleryData } from "../lib/gallery";
import { mapGalleryForDisplay, getLightboxImageUrl } from "../lib/gallery";
import { ResponsiveImage } from "./ResponsiveImage";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { PhArrowLeft, PhImages, PhCalendar, PhMapPin, PhEye } from "~/components/icons";

const styles = `
  .category-page {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--white) 0%, var(--light-gray) 100%);
  }

  .category-hero {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
    color: var(--white);
    padding: 5rem 0 3rem;
    margin-top: 70px;
    position: relative;
    overflow: hidden;
  }

  .category-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grid)" /></svg>');
    opacity: 0.3;
  }

  .category-hero-content {
    position: relative;
    z-index: 1;
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.95rem;
  }

  .breadcrumb a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 0.25rem;
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

  .category-title {
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

  .category-subtitle {
    font-size: 1.3rem;
    opacity: 0.9;
    margin-bottom: 2rem;
    font-weight: 400;
  }

  .category-stats {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-sm);
    font-weight: 600;
    margin-bottom: 2rem;
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
  }

  .back-button:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  .category-content {
    padding: 3rem 0;
    min-height: calc(100vh - 300px);
  }

  .galleries-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    .galleries-grid {
      grid-template-columns: repeat(3, 1fr);
    }
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

  .gallery-preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: var(--transition);
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
    line-height: 1.3;
  }

  .gallery-title a {
    color: inherit;
    text-decoration: none;
    transition: var(--transition);
  }

  .gallery-title a:hover {
    color: var(--secondary);
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

  .empty-category {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--gray);
  }

  .empty-category h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    .category-hero {
      padding: 2rem 0;
    }

    .galleries-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .gallery-preview {
      height: 220px;
    }

    .category-content {
      padding: 2rem 0;
    }

    .breadcrumb {
      flex-wrap: wrap;
    }
  }
`;

interface GalleryCategoryPageProps {
  category: string;
  categoryName: string;
  description: string;
  galleries: GalleryData[];
}

export const GalleryCategoryPage = component$<GalleryCategoryPageProps>((props) => {
  useStylesScoped$(styles);

  const openLightbox = $((gallery: GalleryData) => {
    if (typeof window !== 'undefined') {
      import('photoswipe').then(({ default: PhotoSwipe }) => {
        const items = gallery.images.map(img => {
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

  return (
    <div class="category-page">
      <Navigation />
      <section class="category-hero">
        <div class="container">
          <div class="category-hero-content">
            <nav class="breadcrumb">
              <a href="/">
                🏠 Domů
              </a>
              <span class="breadcrumb-separator">/</span>
              <a href="/galerie">Galerie</a>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-current">{props.categoryName}</span>
            </nav>

            <h1 class="category-title">{props.categoryName}</h1>
            <p class="category-subtitle">{props.description}</p>

            <div class="category-stats">
              <PhImages size={18} />
              {props.galleries.length} {props.galleries.length === 1 ? 'realizace' :
               props.galleries.length < 5 ? 'realizace' : 'realizací'}
            </div>

            <a href="/galerie" class="back-button">
              <PhArrowLeft size={18} />
              Zpět na všechny galerie
            </a>
          </div>
        </div>
      </section>

      <section class="category-content">
        <div class="container">
          {props.galleries.length > 0 ? (
            <div class="galleries-grid">
              {props.galleries.map((gallery) => {
                const displayGallery = mapGalleryForDisplay(gallery);
                const coverImage = displayGallery.coverImages[0];
                const galleryUrl = `/galerie/${gallery.id}`;

                return (
                  <div key={gallery.id} class="gallery-card">
                    <div
                      class="gallery-preview"
                      onClick$={() => openLightbox(gallery)}
                    >
                      <ResponsiveImage
                        src={typeof coverImage === 'string' ? coverImage : coverImage.src}
                        alt={`${displayGallery.title} - náhled`}
                        class="gallery-preview-image"
                        loading="lazy"
                        responsive={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div class="gallery-overlay">
                        <div class="gallery-count">
                          <PhImages size={20} />
                          {displayGallery.imageCount} fotografií
                        </div>
                      </div>
                    </div>

                    <div class="gallery-info">
                      <h3 class="gallery-title">
                        <a href={galleryUrl}>{displayGallery.title}</a>
                      </h3>
                      <p class="gallery-description">{displayGallery.description}</p>

                      <div class="gallery-meta">
                        <div class="gallery-date">
                          <PhCalendar size={16} />
                          {displayGallery.date}
                        </div>
                        <div class="gallery-location">
                          <PhMapPin size={16} />
                          {displayGallery.location}
                        </div>
                      </div>

                      <a
                        href={galleryUrl}
                        class="view-gallery-btn"
                      >
                        <PhEye size={18} />
                        Zobrazit galerii
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div class="empty-category">
              <h3>Žádné galerie v této kategorii</h3>
              <p>V kategorii {props.categoryName} zatím nemáme žádné realizace.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
});