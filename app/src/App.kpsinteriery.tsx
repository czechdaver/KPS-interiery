import React from "react";
import { Navigation } from "./components/Navigation";
import { HeroSection } from "./components/HeroSection";
import { ValuesSection } from "./components/ValuesSection";
import { ServicesSection } from "./components/ServicesSection";
import { PortfolioSection } from "./components/PortfolioSection";
import { PartnersSection } from "./components/PartnersSection";
import { InstagramSection } from "./components/InstagramSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="kps-interiery-landing">
      <Navigation />
      <HeroSection />
      <ValuesSection />
      <ServicesSection />
      <PortfolioSection />
      <PartnersSection />
      <InstagramSection />
      <ContactSection />
      <Footer />
      
      <style>{`
        .kps-interiery-landing {
          min-height: 100vh;
        }
        
        /* Smooth scroll offset for fixed navigation */
        html {
          scroll-padding-top: 80px;
        }
        
        /* Loading animation */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .kps-interiery-landing > * {
          animation: fadeIn 0.6s ease-out;
        }
        
        /* Scroll behavior improvements */
        @media (prefers-reduced-motion: no-preference) {
          html {
            scroll-behavior: smooth;
          }
        }
        
        /* Focus styles for accessibility */
        *:focus {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }
        
        /* Print styles */
        @media print {
          .navigation,
          .instagram-section,
          .contact-form-container {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}