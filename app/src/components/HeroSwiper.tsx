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
      max-height: 100vh;
    }

    .hero-swiper {
      width: 100%;
      height: 100%;
      max-height: 100vh;
      --swiper-pagination-color: #C88B4E;
      --swiper-theme-color: #C88B4E;
      --swiper-pagination-bullet-opacity: 1;
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
      pointer-events: none;
    }
    
    /* Swiper pagination styles */
    .hero-swiper .swiper-pagination {
      position: absolute;
      bottom: 40px;
      left: 50% !important;
      transform: translateX(-50%) !important;
      z-index: 15;
      display: flex !important;
      gap: 12px;
      align-items: center;
      justify-content: center;
      width: auto !important;
      margin: 0 auto;
      pointer-events: auto;
    }

    .hero-swiper .swiper-pagination .swiper-pagination-bullet,
    .hero-swiper .swiper-pagination-bullet,
    .swiper.hero-swiper .swiper-pagination-bullet {
      --swiper-pagination-color: #C88B4E !important;
      --swiper-theme-color: #C88B4E !important;
      --swiper-pagination-bullet-opacity: 1 !important;
      width: 16px !important;
      height: 16px !important;
      background: rgba(255, 255, 255, 0.5) !important;
      border: 2px solid rgba(255, 255, 255, 0.8) !important;
      border-radius: 50% !important;
      opacity: 1 !important;
      transition: all 0.3s ease !important;
      cursor: pointer !important;
      flex-shrink: 0 !important;
      margin: 0 !important;
      outline: none !important;
      pointer-events: auto !important;
      box-shadow:
        0 0 8px rgba(200, 139, 78, 0.4) !important,
        0 0 16px rgba(200, 139, 78, 0.2) !important,
        inset 0 0 4px rgba(255, 255, 255, 0.3) !important;

      /* Button reset styles */
      padding: 0 !important;
      font: inherit !important;
      color: inherit !important;
      text-decoration: none !important;
      background-color: rgba(255, 255, 255, 0.5) !important;
      position: relative !important;
      display: inline-block !important;
    }

    .hero-swiper .swiper-pagination .swiper-pagination-bullet:hover,
    .hero-swiper .swiper-pagination-bullet:hover,
    .swiper.hero-swiper .swiper-pagination-bullet:hover {
      background: rgba(255, 255, 255, 0.7) !important;
      border-color: #C88B4E !important;
      transform: scale(1.1) !important;
      box-shadow:
        0 0 12px rgba(200, 139, 78, 0.6) !important,
        0 0 20px rgba(200, 139, 78, 0.3) !important,
        inset 0 0 6px rgba(255, 255, 255, 0.4) !important;
    }

    .hero-swiper .swiper-pagination .swiper-pagination-bullet.swiper-pagination-bullet-active,
    .hero-swiper .swiper-pagination .swiper-pagination-bullet-active,
    .hero-swiper .swiper-pagination-bullet.swiper-pagination-bullet-active,
    .hero-swiper .swiper-pagination-bullet-active,
    .swiper.hero-swiper .swiper-pagination-bullet.swiper-pagination-bullet-active,
    .swiper.hero-swiper .swiper-pagination-bullet-active {
      --swiper-pagination-color: #C88B4E !important;
      --swiper-theme-color: #C88B4E !important;
      background: #C88B4E !important;
      background-color: #C88B4E !important;
      border: 3px solid #ffffff !important;
      width: 40px !important;
      height: 16px !important;
      border-radius: 8px !important;
      transform: scale(1.15) !important;
      box-shadow:
        0 0 16px rgba(200, 139, 78, 0.8) !important,
        0 0 32px rgba(200, 139, 78, 0.4) !important,
        inset 0 0 8px rgba(255, 255, 255, 0.3) !important;
      opacity: 1 !important;
      outline: 2px solid rgba(255, 255, 255, 0.6) !important;
      outline-offset: 2px !important;
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
        width: 12px !important;
        height: 12px !important;
        transition: all 0.2s ease !important;
        border-width: 1px !important;
      }

      .hero-swiper .swiper-pagination-bullet.swiper-pagination-bullet-active,
      .hero-swiper .swiper-pagination-bullet-active {
        width: 32px !important;
        background: #C88B4E !important;
        border-color: #C88B4E !important;
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
        width: 10px !important;
        height: 10px !important;
      }

      .hero-swiper .swiper-pagination-bullet.swiper-pagination-bullet-active,
      .hero-swiper .swiper-pagination-bullet-active {
        width: 24px !important;
        background: #C88B4E !important;
        border-color: #C88B4E !important;
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
        width: 16px !important;
        height: 16px !important;
      }

      .hero-swiper .swiper-pagination-bullet.swiper-pagination-bullet-active,
      .hero-swiper .swiper-pagination-bullet-active {
        width: 40px !important;
        background: #C88B4E !important;
        border-color: #C88B4E !important;
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
        
        // Ensure container is ready
        const swiperContainer = document.querySelector('.hero-swiper') as HTMLElement;
        if (!swiperContainer) {
          console.error('Swiper container not found');
          return;
        }

        // Add custom CSS after Swiper CSS loads
        const customStyles = document.createElement('style');
        customStyles.innerHTML = `
          .hero-swiper .swiper-pagination-bullet {
            width: 16px !important;
            height: 16px !important;
            background: rgba(255, 255, 255, 0.5) !important;
            border: 2px solid rgba(255, 255, 255, 0.8) !important;
            border-radius: 50% !important;
            opacity: 1 !important;
            margin: 0 6px !important;
            box-shadow: 0 0 8px rgba(200, 139, 78, 0.4), 0 0 16px rgba(200, 139, 78, 0.2), inset 0 0 4px rgba(255, 255, 255, 0.3) !important;
            transition: all 0.3s ease !important;
          }
          .hero-swiper .swiper-pagination-bullet:hover {
            background: rgba(255, 255, 255, 0.7) !important;
            border-color: #C88B4E !important;
            transform: scale(1.1) !important;
            box-shadow: 0 0 12px rgba(200, 139, 78, 0.6), 0 0 20px rgba(200, 139, 78, 0.3), inset 0 0 6px rgba(255, 255, 255, 0.4) !important;
          }
          .hero-swiper .swiper-pagination-bullet-active {
            background: #C88B4E !important;
            border: 3px solid #ffffff !important;
            width: 40px !important;
            height: 16px !important;
            border-radius: 8px !important;
            transform: scale(1.15) !important;
            box-shadow: 0 0 16px rgba(200, 139, 78, 0.8), 0 0 32px rgba(200, 139, 78, 0.4), inset 0 0 8px rgba(255, 255, 255, 0.3) !important;
            outline: 2px solid rgba(255, 255, 255, 0.6) !important;
            outline-offset: 2px !important;
          }
        `;
        document.head.appendChild(customStyles);

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
            bulletActiveClass: 'swiper-pagination-bullet-active',
            bulletClass: 'swiper-pagination-bullet',
            renderBullet: function (index: number, className: string) {
              return '<button type="button" class="' + className + '" data-slide="' + index + '" aria-label="Go to slide ' + (index + 1) + '"></button>';
            }
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
            loadOnTransitionStart: true,
            checkInView: true,
            enabled: true
          },
          preloadImages: false,
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
            if (swiper && swiper.autoplay) {
              swiper.autoplay.stop();
            }
          } else {
            if (swiper && swiper.autoplay) {
              swiper.autoplay.start();
            }
          }
        });

        // Enhanced click handlers for pagination bullets
        const handlePaginationClick = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();

          const target = e.target as HTMLElement;
          console.log('Pagination click detected:', target);

          if (target.classList.contains('swiper-pagination-bullet')) {
            const slideIndex = parseInt(target.getAttribute('data-slide') || '0');
            console.log('Navigating to slide:', slideIndex);

            if (swiper && swiper.slideTo) {
              swiper.slideTo(slideIndex, 600);

              // Force visual update
              setTimeout(() => {
                swiper.update();
                swiper.updateProgress();
                swiper.updateSlidesClasses();
              }, 50);
            }
          }
        };

        // Wait for pagination to be rendered
        setTimeout(() => {
          const paginationEl = document.querySelector('.swiper-pagination');
          if (paginationEl) {
            paginationEl.addEventListener('click', handlePaginationClick, true);
            console.log('Pagination click handler attached');

            // Also add individual bullet listeners
            const bullets = document.querySelectorAll('.swiper-pagination-bullet');
            bullets.forEach((bullet, index) => {
              bullet.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Direct bullet click:', index);
                if (swiper && swiper.slideTo) {
                  swiper.slideTo(index, 600);
                }
              }, true);
            });
          }
        }, 500);

        // Pause autoplay when user interacts
        swiperContainer.addEventListener('mouseenter', () => {
          if (swiper && swiper.autoplay) {
            swiper.autoplay.stop();
          }
        });

        swiperContainer.addEventListener('mouseleave', () => {
          if (swiper && swiper.autoplay) {
            swiper.autoplay.start();
          }
        });

        return () => {
          window.removeEventListener('resize', handleResize);

          // Clean up pagination event listeners
          const paginationEl = document.querySelector('.swiper-pagination');
          if (paginationEl) {
            paginationEl.removeEventListener('click', handlePaginationClick, true);
          }

          // Clean up individual bullet listeners
          const bullets = document.querySelectorAll('.swiper-pagination-bullet');
          bullets.forEach((bullet) => {
            bullet.removeEventListener('click', handlePaginationClick, true);
          });

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
          {images.map((image, index) => {
            // First image should be LCP optimized - no lazy loading
            const isFirst = index === 0;
            
            return (
              <div key={index} class="swiper-slide hero-swiper-slide">
                <img
                  src={image.src}
                  alt={image.alt}
                  class={isFirst ? "hero-slide-image" : "hero-slide-image swiper-lazy"}
                  data-src={isFirst ? undefined : image.src}
                  width={image.width}
                  height={image.height}
                  loading={isFirst ? "eager" : "lazy"}
                  fetchPriority={isFirst ? "high" : "auto"}
                />
                {!isFirst && <div class="swiper-lazy-preloader"></div>}
              </div>
            );
          })}
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