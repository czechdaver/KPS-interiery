import { component$, useVisibleTask$ } from '@builder.io/qwik';

export const FontLoader = component$(() => {
  useVisibleTask$(() => {
    // Load fonts asynchronously to prevent render blocking
    const loadFont = (href: string) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'all';
      document.head.appendChild(link);
    };

    // Load fonts with a slight delay to not block initial render
    setTimeout(() => {
      loadFont('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700&display=swap');
      loadFont('https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
    }, 100);
  });

  return null;
});