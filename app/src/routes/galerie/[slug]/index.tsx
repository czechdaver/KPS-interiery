import { component$, useStylesScoped$, useVisibleTask$, useSignal } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead, Link } from '@builder.io/qwik-city';
import { loadGalleryData, getCoverImagePath } from '../../../lib/gallery';
import { PhotoSwipeGallery } from '../../../components/PhotoSwipeGallery';
import { Navigation } from '../../../components/Navigation';
import { Footer } from '../../../components/Footer';
import { ResponsiveImage } from '../../../components/ResponsiveImage';
import { PhArrowLeft, PhImages, PhCalendar, PhMapPin } from '~/components/icons';

const styles = `
  .gallery-page {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--white) 0%, var(--light-gray) 100%);
  }

  .gallery-hero {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
    color: var(--white);
    padding: 4rem 0 3rem;
    position: relative;
    overflow: hidden;
  }

  .gallery-hero-background {
    position: absolute;
    top: -20%;
    left: 0;
    width: 100%;
    height: 140%;
    z-index: 1;
    will-change: transform;
    transition: transform 0.1s ease-out;
  }

  .gallery-hero-background img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }

  .gallery-hero-image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(50, 38, 36, 0.7) 0%,
      rgba(35, 25, 23, 0.65) 50%,
      rgba(200, 139, 78, 0.45) 100%
    );
    z-index: 2;
  }

  .gallery-hero-content {
    position: relative;
    z-index: 3;
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

  /* Ensure breadcrumb Link components work correctly */
  .breadcrumb > a {
    color: rgba(255, 255, 255, 0.8) !important;
    text-decoration: none !important;
    transition: var(--transition) !important;
  }

  .breadcrumb > a:hover {
    color: var(--secondary-light) !important;
    text-decoration: none !important;
  }

  .breadcrumb-separator {
    color: rgba(255, 255, 255, 0.6);
  }

  .breadcrumb-current {
    color: var(--secondary-light);
    font-weight: 600;
  }

  .gallery-title {
    font-family: "Montserrat", sans-serif;
    font-weight: 800;
    font-size: clamp(1.8rem, 4vw, 3rem);
    line-height: 1.2;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, var(--white) 0%, var(--secondary-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .gallery-category {
    font-family: "Montserrat", sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--secondary-light);
    margin-bottom: 0.5rem;
    opacity: 1;
  }

  .gallery-description {
    font-size: 1.1rem;
    opacity: 0.9;
    margin-bottom: 1rem;
    max-width: 800px;
  }

  .gallery-meta {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
    font-size: 0.95rem;
  }

  .gallery-meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.9);
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

  /* Ensure Link back-button components work correctly with maximum specificity */
  a.back-button,
  a.back-button:link,
  a.back-button:visited {
    display: inline-flex !important;
    align-items: center !important;
    gap: 0.5rem !important;
    background: rgba(255, 255, 255, 0.15) !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    color: var(--white) !important;
    padding: 0.75rem 1.5rem !important;
    border-radius: var(--radius-sm) !important;
    text-decoration: none !important;
    font-weight: 600 !important;
    transition: var(--transition) !important;
    margin-top: 1rem !important;
    cursor: pointer !important;
  }

  a.back-button:hover,
  a.back-button:focus {
    background: rgba(255, 255, 255, 0.25) !important;
    color: var(--white) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
    text-decoration: none !important;
  }

  .gallery-content {
    padding: 3rem 0;
  }

  .gallery-info-section {
    background: var(--white);
    padding: 2rem;
    border-radius: var(--radius-lg);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 3rem;
  }

  .gallery-features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 0;
  }

  .features-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
  }

  .feature-chip {
    background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
    color: var(--white);
    padding: 0.4rem 0.8rem;
    border-radius: var(--radius-sm);
    font-size: 0.85rem;
    font-weight: 500;
    transition: var(--transition);
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  .feature-chip::before {
    content: '✓';
    font-weight: 600;
    font-size: 0.75rem;
  }

  .feature-chip:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
  }

  .materials-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .material-tag {
    background: var(--secondary);
    color: var(--white);
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
    font-weight: 500;
  }

  .section-title {
    font-family: "Montserrat", sans-serif;
    font-weight: 700;
    font-size: 1.5rem;
    color: var(--primary);
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    .gallery-meta {
      gap: 1rem;
    }

    .gallery-features {
      grid-template-columns: 1fr;
    }

    .gallery-content {
      padding: 2rem 0;
    }
  }
`;

// Route loader to get gallery data based on URL parameters
export const useGalleryData = routeLoader$(async ({ params, error }) => {
  const { slug } = params;

  if (!slug) {
    throw error(404, 'Gallery not found');
  }

  const galleryData = await loadGalleryData(slug as any);

  if (!galleryData) {
    throw error(404, 'Gallery not found');
  }

  return galleryData;
});

// Helper function to convert category name to URL slug
function getCategorySlug(category: string): string {
  const categoryMap: Record<string, string> = {
    'Kuchyně': 'kuchyne',
    'Ložnice': 'loznice',
    'Koupelny': 'koupelny',
    'Skříně': 'skrine',
    'Ostatní': 'ostatni'
  };
  return categoryMap[category] || 'ostatni';
}

// Helper function to convert category slug back to display name
function getCategoryName(categorySlug: string): string {
  const categoryMap: Record<string, string> = {
    'kuchyne': 'Kuchyně',
    'loznice': 'Ložnice',
    'koupelny': 'Koupelny',
    'skrine': 'Skříně',
    'ostatni': 'Ostatní'
  };
  return categoryMap[categorySlug] || 'Ostatní';
}

export default component$(() => {
  useStylesScoped$(styles);

  const galleryData = useGalleryData();
  const parallaxOffset = useSignal(0);

  useVisibleTask$(() => {
    window.scrollTo(0, 0);

    // Parallax effect with RAF for smooth movement
    let rafId: number;
    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        parallaxOffset.value = scrollY * 0.2;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  });

  if (!galleryData.value) {
    return (
      <div class="gallery-page">
        <Navigation />
        <section class="gallery-hero">
          <div class="container">
            <div class="gallery-hero-content">
              <h1 class="gallery-title">Galerie nenalezena</h1>
              <p class="gallery-description">
                Požadovaná galerie nebyla nalezena.
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const gallery = galleryData.value;

  // Get cover image data
  const coverImageData = gallery.images.find(img => img.src === gallery.coverImage) || gallery.images[0];
  const coverImagePath = getCoverImagePath(gallery.id, gallery.coverImage);

  return (
    <div class="gallery-page">
      <Navigation />
      <div class="section-after-nav">

      <section class="gallery-hero">
        {/* Background Image with Parallax */}
        <div
          class="gallery-hero-background"
          style={`transform: translateY(${parallaxOffset.value}px);`}
        >
          <ResponsiveImage
            src={coverImagePath}
            alt={coverImageData.alt || gallery.title}
            width={coverImageData.width}
            height={coverImageData.height}
            loading="eager"
            responsive={true}
          />
        </div>

        {/* Gradient Overlay */}
        <div class="gallery-hero-image-overlay"></div>

        <div class="container">
          <div class="gallery-hero-content">
            <nav class="breadcrumb">
              <Link href="/">Domů</Link>
              <span class="breadcrumb-separator">/</span>
              <Link href="/galerie">Galerie</Link>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-current">{gallery.title}</span>
            </nav>

            <div class="gallery-category">
              {gallery.category}
            </div>

            <h1 class="gallery-title">{gallery.title}</h1>
            <p class="gallery-description">{gallery.description}</p>

            <div class="gallery-meta">
              <div class="gallery-meta-item">
                <PhCalendar size={16} />
                {gallery.date}
              </div>
              <div class="gallery-meta-item">
                <PhMapPin size={16} />
                {gallery.location}
              </div>
              <div class="gallery-meta-item">
                <PhImages size={16} />
                {gallery.imageCount} fotografií
              </div>
            </div>

            <Link href="/galerie" class="back-button">
              <PhArrowLeft size={18} />
              Zpět na galerie
            </Link>
          </div>
        </div>
      </section>

      <section class="gallery-content">
        <div class="container">

          {/* Gallery Info Section */}
          <div class="gallery-info-section">
            <div class="gallery-features">
              <div>
                <h3 class="section-title">Vlastnosti projektu</h3>
                <div class="features-chips">
                  {gallery.features.map((feature, index) => (
                    <span key={index} class="feature-chip">{feature}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 class="section-title">Použité materiály</h3>
                <div class="materials-list">
                  {gallery.materials.map((material, index) => (
                    <span key={index} class="material-tag">{material}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          <PhotoSwipeGallery
            gallery={gallery}
            showTitle={false}
          />
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const gallery = resolveValue(useGalleryData);

  if (!gallery) {
    return {
      title: 'Galerie nenalezena - KPS Interiéry',
      meta: [
        {
          name: 'robots',
          content: 'noindex'
        }
      ]
    };
  }

  const canonicalUrl = `https://kps-interiery.github.io/KPS-interiery/galerie/${gallery.id}`;

  // Create structured description for SEO
  const seoDescription = `${gallery.description} Realizace KPS Interiéry v lokaci ${gallery.location}, ${gallery.date}. Prohlédněte si ${gallery.imageCount} fotografií z této realizace.`;

  // Keywords based on gallery data
  const keywords = [
    gallery.category.toLowerCase(),
    'nábytek na míru',
    'KPS Interiéry',
    gallery.location,
    ...gallery.features.slice(0, 3).map(f => f.toLowerCase()),
    ...gallery.materials.slice(0, 2).map(m => m.toLowerCase())
  ].join(', ');

  return {
    title: `${gallery.title} - ${gallery.category} - KPS Interiéry`,
    meta: [
      {
        name: 'description',
        content: seoDescription
      },
      {
        name: 'keywords',
        content: keywords
      },
      {
        name: 'author',
        content: 'KPS Interiéry'
      },
      {
        property: 'og:title',
        content: `${gallery.title} - KPS Interiéry`
      },
      {
        property: 'og:description',
        content: seoDescription
      },
      {
        property: 'og:type',
        content: 'article'
      },
      {
        property: 'og:url',
        content: canonicalUrl
      },
      {
        property: 'og:locale',
        content: 'cs_CZ'
      },
      {
        property: 'article:published_time',
        content: gallery.date
      },
      {
        property: 'article:author',
        content: 'KPS Interiéry'
      },
      {
        property: 'article:section',
        content: gallery.category
      },
      {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1'
      },
      {
        name: 'geo.region',
        content: 'CZ-72'
      },
      {
        name: 'geo.placename',
        content: gallery.location
      }
    ],
    links: [
      {
        rel: 'canonical',
        href: canonicalUrl
      },
      {
        rel: 'alternate',
        type: 'application/ld+json',
        href: `${canonicalUrl}/structured-data`
      }
    ]
  };
};