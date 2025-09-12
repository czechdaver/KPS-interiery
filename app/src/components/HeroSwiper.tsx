import { component$, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";

interface HeroSwiperProps {
  images: Array<{
    src: string;
    alt: string;
    width: number;
    height: number;
  }>;
}

export const HeroSwiper = component$<HeroSwiperProps>(({ images }) => {
  useStylesScoped$(`
    .hero-swiper-container {
      position: relative;
      width: 100%;
      height: 100%;
    }
    
    .hero-swiper {
      width: 100%;
      height: 100%;
    }
    
    .hero-swiper-slide {
      position: relative;
      width: 100%;
      height: 100%;
    }
    
    .hero-slide-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      will-change: opacity;
      transform: translateZ(0);
      backface-visibility: hidden;
      image-rendering: -webkit-optimize-contrast;
    }
    
    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        135deg,
        rgba(50, 38, 36, 0.5) 0%,
        rgba(35, 25, 23, 0.45) 50%,
        rgba(200, 139, 78, 0.25) 100%
      );
      z-index: 2;
    }
    
    /* Swiper pagination styles */
    .hero-swiper .swiper-pagination {
      position: absolute;
      bottom: 40px;
      left: 50% !important;
      transform: translateX(-50%) !important;
      z-index: 15;
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: center;
      width: auto !important;
      margin: 0 auto;
    }
    
    .hero-swiper .swiper-pagination-bullet {
      width: 14px;
      height: 14px;
      background: rgba(255, 255, 255, 0.4);
      border: 2px solid rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      opacity: 1;
      transition: all 0.3s ease;
      cursor: pointer;
      flex-shrink: 0;
    }
    
    .hero-swiper .swiper-pagination-bullet-active {
      background: var(--primary);
      border-color: var(--primary);
      width: 36px;
      border-radius: 7px;
      transform: scale(1.1);
      box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.4);
    }
    
    /* Swiper navigation styles - DISABLED */
    .hero-swiper .swiper-button-next,
    .hero-swiper .swiper-button-prev {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
    
    
    /* Loading animation */
    .swiper-lazy-preloader {
      width: 42px;
      height: 42px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -21px;
      margin-top: -21px;
      z-index: 1;
      animation: swiper-preloader-spin 1s infinite linear;
      box-sizing: border-box;
      border: 4px solid var(--secondary);
      border-radius: 50%;
      border-top-color: transparent;
    }
    
    @keyframes swiper-preloader-spin {
      100% {
        transform: rotate(360deg);
      }
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .hero-swiper .swiper-button-next,
      .hero-swiper .swiper-button-prev {
        width: 36px;
        height: 36px;
        opacity: 0.9;
      }
      
      .hero-swiper .swiper-button-next:after,
      .hero-swiper .swiper-button-prev:after {
        font-size: 16px;
      }
      
      .hero-swiper .swiper-button-next {
        right: 10px;
      }
      
      .hero-swiper .swiper-button-prev {
        left: 10px;
      }
      
      .hero-swiper .swiper-pagination {
        bottom: 30px;
        gap: 8px;
      }
      
      .hero-swiper .swiper-pagination-bullet {
        width: 10px;
        height: 10px;
        transition: all 0.2s ease;
        border-width: 1px;
      }
      
      .hero-swiper .swiper-pagination-bullet-active {
        width: 28px;
      }
    }
    
    @media (max-width: 480px) {
      .hero-swiper .swiper-button-next,
      .hero-swiper .swiper-button-prev {
        width: 32px;
        height: 32px;
      }
      
      .hero-swiper .swiper-button-next:after,
      .hero-swiper .swiper-button-prev:after {
        font-size: 14px;
      }
      
      .hero-swiper .swiper-pagination-bullet {
        width: 8px;
        height: 8px;
      }
      
      .hero-swiper .swiper-pagination-bullet-active {
        width: 20px;
      }
    }
    
    /* Touch-friendly swipe indicators */
    @media (hover: none) and (pointer: coarse) {
      .hero-swiper .swiper-button-next,
      .hero-swiper .swiper-button-prev {
        width: 48px;
        height: 48px;
      }
      
      .hero-swiper .swiper-pagination-bullet {
        width: 14px;
        height: 14px;
      }
      
      .hero-swiper .swiper-pagination-bullet-active {
        width: 36px;
      }
    }
  `);

  useVisibleTask$(async () => {
    // Dynamically import Swiper CSS and JS
    if (typeof window !== 'undefined') {
      try {
        // Import Swiper CSS
        const swiperCssLink = document.createElement('link');
        swiperCssLink.rel = 'stylesheet';
        swiperCssLink.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
        document.head.appendChild(swiperCssLink);

        // Import Swiper JS from CDN
        if (!(window as any).Swiper) {
          const swiperScript = document.createElement('script');
          swiperScript.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
          swiperScript.async = true;
          
          await new Promise((resolve, reject) => {
            swiperScript.onload = resolve;
            swiperScript.onerror = reject;
            document.head.appendChild(swiperScript);
          });
        }
        
        // Detect touch device for better mobile experience
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Initialize Swiper
        const swiper = new (window as any).Swiper('.hero-swiper', {
          effect: 'fade',
          fadeEffect: {
            crossFade: true
          },
          speed: isTouchDevice ? 600 : 800,
          loop: true,
          autoplay: {
            delay: 10000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: false,
            dynamicMainBullets: 3,
            bulletActiveClass: 'swiper-pagination-bullet-active'
          },
          navigation: false,
          keyboard: {
            enabled: true,
            onlyInViewport: false,
          },
          a11y: {
            enabled: true,
            prevSlideMessage: 'Předchozí snímek',
            nextSlideMessage: 'Další snímek',
            firstSlideMessage: 'První snímek',
            lastSlideMessage: 'Poslední snímek',
            paginationBulletMessage: 'Přejít na snímek {{index}}'
          },
          lazy: {
            loadPrevNext: true,
            loadPrevNextAmount: 2,
            preloadImages: false,
            loadOnTransitionStart: true
          },
          watchSlidesProgress: true,
          watchSlidesVisibility: true,
          threshold: 10,
          touchRatio: isTouchDevice ? 1 : 0.5,
          touchAngle: 45,
          longSwipes: true,
          longSwipesRatio: 0.5,
          shortSwipes: true,
          followFinger: true,
          allowTouchMove: true,
          resistance: true,
          resistanceRatio: 0.85,
          edgeSwipeThreshold: 20,
          preventInteractionOnTransition: false,
        });

        // Enhanced mobile touch support
        if (isTouchDevice) {
          const heroSection = document.querySelector('.hero-section') as HTMLElement;
          let touchStartY = 0;
          let touchStartX = 0;
          
          heroSection.addEventListener('touchstart', (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
          }, { passive: true });
          
          heroSection.addEventListener('touchmove', (e: TouchEvent) => {
            const touchY = e.touches[0].clientY;
            const touchX = e.touches[0].clientX;
            const deltaY = Math.abs(touchY - touchStartY);
            const deltaX = Math.abs(touchX - touchStartX);
            
            // Prevent vertical scroll when swiping horizontally
            if (deltaX > deltaY && deltaX > 10) {
              e.preventDefault();
            }
          }, { passive: false });
        }

        // Performance optimizations
        let resizeTimeout: NodeJS.Timeout;
        const handleResize = () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
            swiper.update();
            swiper.updateSize();
          }, 150);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Pause autoplay on visibility change
        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            swiper.autoplay.stop();
          } else {
            swiper.autoplay.start();
          }
        });

        // Pause autoplay when user interacts
        const swiperContainer = document.querySelector('.hero-swiper') as HTMLElement;
        swiperContainer.addEventListener('mouseenter', () => {
          swiper.autoplay.stop();
        });
        
        swiperContainer.addEventListener('mouseleave', () => {
          swiper.autoplay.start();
        });

        return () => {
          window.removeEventListener('resize', handleResize);
          if (swiper && swiper.destroy) {
            swiper.destroy(true, true);
          }
        };
      } catch (error) {
        console.error('Failed to initialize Swiper:', error);
      }
    }
  });

  return (
    <div class="hero-swiper-container">
      <div class="swiper hero-swiper">
        <div class="swiper-wrapper">
          {images.map((image, index) => (
            <div key={index} class="swiper-slide hero-swiper-slide">
              <img
                src={image.src}
                alt={image.alt}
                class="hero-slide-image swiper-lazy"
                data-src={image.src}
                width={image.width}
                height={image.height}
                loading="lazy"
              />
              <div class="swiper-lazy-preloader"></div>
            </div>
          ))}
        </div>
        
        {/* Navigation - DISABLED */}
        
        {/* Pagination */}
        <div class="swiper-pagination"></div>
      </div>
      
      {/* Gradient overlay */}
      <div class="hero-overlay"></div>
    </div>
  );
});