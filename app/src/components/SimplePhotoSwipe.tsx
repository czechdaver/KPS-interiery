import { component$, useVisibleTask$, $ } from '@builder.io/qwik';
import type { GalleryData } from '../lib/gallery';

interface SimplePhotoSwipeProps {
  gallery: GalleryData;
  trigger?: string;
}

export const SimplePhotoSwipe = component$<SimplePhotoSwipeProps>(({ gallery }) => {
  
  const openLightbox = $(() => {
    if (typeof window !== 'undefined') {
      // Dynamically import PhotoSwipe
      import('photoswipe').then(({ default: PhotoSwipe }) => {
        const items = gallery.images.map(img => ({
          src: `./images/galleries/${gallery.id}/${img.src}`,
          width: img.width,
          height: img.height,
          alt: img.alt
        }));

        const options = {
          showHideAnimationType: 'zoom' as const,
          bgOpacity: 0.9,
          spacing: 0.1,
          allowPanToNext: true,
          loop: true,
          pinchToClose: true,
          closeOnVerticalDrag: true
        };

        const pswp = new PhotoSwipe(options);
        pswp.addFilter('placeholderSrc', () => {
          return `./images/galleries/${gallery.id}/${gallery.coverImage}`;
        });
        
        pswp.init();
        pswp.loadAndOpen(0, items);
      });
    }
  });

  useVisibleTask$(() => {
    // Preload PhotoSwipe CSS
    if (typeof window !== 'undefined') {
      const existingLink = document.querySelector('link[href*=\"photoswipe.css\"]');
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.css';
        document.head.appendChild(link);
      }
    }
  });

  return (
    <button
      type="button"
      onClick$={openLightbox}
      class="gallery-open-btn opacity-0 pointer-events-none absolute"
      aria-label={`Otevřít galerii ${gallery.title}`}
    >
      Open Gallery
    </button>
  );
});