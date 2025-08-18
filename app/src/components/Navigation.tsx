import React, { useState } from "react";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navigation">
      <div className="container">
        <div className="nav-content">
          <div className="nav-logo">
            <a href="#home">
              <span className="logo-text">KPS</span>
              <span className="logo-subtitle">Interiéry</span>
            </a>
          </div>
          
          <div className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
            <a href="#home" className="nav-link">Úvod</a>
            <a href="#services" className="nav-link">Služby</a>
            <a href="#portfolio" className="nav-link">Realizace</a>
            <a href="#contact" className="nav-link">Kontakt</a>
            <a href="#contact" className="btn btn-glass nav-cta">Poptávka</a>
          </div>
          
          <button 
            className="nav-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="nav-toggle-line"></span>
            <span className="nav-toggle-line"></span>
            <span className="nav-toggle-line"></span>
          </button>
        </div>
      </div>
      
      <style>{`
        .navigation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(25px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          transition: var(--transition);
        }
        
        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
        }
        
        .nav-logo a {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          line-height: 1;
        }
        
        .logo-text {
          font-size: 2rem;
          font-weight: 900;
          color: var(--primary);
          letter-spacing: -1px;
        }
        
        .logo-subtitle {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--accent);
          margin-top: -4px;
        }
        
        .nav-menu {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        
        .nav-link {
          text-decoration: none;
          color: var(--primary);
          font-weight: 600;
          font-size: 1rem;
          transition: var(--transition);
          position: relative;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--accent);
          transition: var(--transition);
        }
        
        .nav-link:hover {
          color: var(--accent);
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        .nav-cta {
          margin-left: 1rem;
          padding: 0.75rem 1.5rem;
          font-size: 0.95rem;
        }
        
        .nav-toggle {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }
        
        .nav-toggle-line {
          width: 24px;
          height: 2px;
          background: var(--primary);
          transition: var(--transition);
        }
        
        @media (max-width: 768px) {
          .nav-toggle {
            display: flex;
          }
          
          .nav-menu {
            position: fixed;
            top: 100%;
            left: 0;
            width: 100%;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            flex-direction: column;
            padding: 2rem;
            gap: 1.5rem;
            box-shadow: var(--shadow-lg);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: var(--transition);
          }
          
          .nav-menu-open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }
          
          .nav-link {
            font-size: 1.1rem;
            padding: 0.5rem 0;
          }
          
          .nav-cta {
            margin-left: 0;
            width: 100%;
            text-align: center;
          }
          
          .nav-menu-open ~ .nav-toggle .nav-toggle-line:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
          }
          
          .nav-menu-open ~ .nav-toggle .nav-toggle-line:nth-child(2) {
            opacity: 0;
          }
          
          .nav-menu-open ~ .nav-toggle .nav-toggle-line:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
          }
        }
      `}</style>
    </nav>
  );
};