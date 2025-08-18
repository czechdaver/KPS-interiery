import React from "react";
import { Navigation } from "./components/Navigation";
import { ServicesSection } from "./components/ServicesSection";
import { PortfolioSection } from "./components/PortfolioSection";

export default function GlassmorphismApp() {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative'
    }}>
      {/* Background pattern for better glassmorphism visibility */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
        `,
        zIndex: -1
      }} />
      
      <Navigation />
      
      {/* Hero section with glassmorphism demo */}
      <section style={{ 
        paddingTop: '120px', 
        paddingBottom: '60px',
        textAlign: 'center'
      }}>
        <div className="container">
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            padding: '3rem 2rem',
            marginBottom: '3rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: '900', 
              color: 'white',
              marginBottom: '1rem',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}>
              Glassmorphism Effects
            </h1>
            <p style={{ 
              fontSize: '1.2rem', 
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '2rem'
            }}>
              Enhanced navigation, buttons, and card hover effects with modern glassmorphism design
            </p>
            
            {/* Button showcase */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button className="btn btn-primary">Primary Button</button>
              <button className="btn btn-secondary">Secondary Glass</button>
              <button className="btn btn-glass">Glass Button</button>
              <button className="btn btn-accent">Accent Button</button>
            </div>
          </div>
          
          {/* Glass cards demo */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div className="card-glass" style={{ 
              padding: '2rem',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>Glass Card 1</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Hover to see enhanced glassmorphism effect
              </p>
            </div>
            
            <div className="card-glass" style={{ 
              padding: '2rem',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>Glass Card 2</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Beautiful blur and transparency effects
              </p>
            </div>
            
            <div className="card-glass" style={{ 
              padding: '2rem',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>Glass Card 3</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Modern design with depth and elegance
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <ServicesSection />
      <PortfolioSection />
      
      {/* Footer with glassmorphism */}
      <footer style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '2rem 0',
        textAlign: 'center',
        color: 'white'
      }}>
        <div className="container">
          <p>© 2024 KPS Interiéry - Enhanced with Glassmorphism Effects</p>
        </div>
      </footer>
    </div>
  );
}