import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import type { GalleryData } from '../lib/gallery';

interface PhotoSwipeGalleryProps {
  gallery: GalleryData;
  onOpen?: () => void;
  onClose?: () => void;
}

export const PhotoSwipeGallery = component$<PhotoSwipeGalleryProps>(({ gallery, onOpen, onClose }) => {
  const pswpRef = useSignal<HTMLDivElement>();
  const isOpen = useSignal(false);

  const openGallery = $((startIndex: number = 0) => {
    if (typeof window !== 'undefined' && pswpRef.value) {
      import('photoswipe').then(({ default: PhotoSwipe }) => {
        const items = gallery.images.map(img => ({
          src: `./images/galleries/${gallery.id}/${img.src}`,
          width: img.width,
          height: img.height,
          alt: img.alt,
          caption: img.caption
        }));

        const pswp = new PhotoSwipe({
          gallery: pswpRef.value!,
          children: 'a',
          pswpModule: PhotoSwipe,
          showHideAnimationType: 'zoom',
          bgOpacity: 0.9,
          spacing: 0.1,
          allowPanToNext: true,
          loop: true,
          pinchToClose: true,
          closeOnVerticalDrag: true,
          showAnimationDuration: 300,
          hideAnimationDuration: 300,
        });

        pswp.on('afterInit', () => {
          isOpen.value = true;
          onOpen?.();
        });

        pswp.on('destroy', () => {
          isOpen.value = false;
          onClose?.();
        });

        pswp.loadAndOpen(startIndex);
      });
    }
  });

  useVisibleTask$(() => {
    // Preload PhotoSwipe styles
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.css';
      document.head.appendChild(link);
    }
  });

  return (
    <div 
      ref={pswpRef}
      class="pswp-gallery hidden"
      data-pswp-uid={gallery.id}
    >
      {gallery.images.map((image, index) => (
        <a
          key={index}
          href={`./images/galleries/${gallery.id}/${image.src}`}
          data-pswp-width={image.width}
          data-pswp-height={image.height}
          target="_blank"
          rel="noreferrer"
          onClick$={(event) => {
            event.preventDefault();
            openGallery(index);
          }}
        >
          <img 
            src={`./images/galleries/${gallery.id}/${image.src}`}
            alt={image.alt}
            loading="lazy"
            class="hidden"
          />
        </a>
      ))}
      
      <button 
        type="button"
        onClick$={() => openGallery(0)}
        class="gallery-trigger opacity-0 pointer-events-none absolute"
        aria-label={`Otevřít galerii ${gallery.title}`}
      >
        Open Gallery
      </button>
    </div>
  );
});