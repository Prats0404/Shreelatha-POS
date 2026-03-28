import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className={`fixed-nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-content">
          <h1 className="logo">Shree Latha<span> Bar</span></h1>
          <div className="nav-links">
            <a href="#menu">Menu</a>
            <a href="#about">About</a>
            <Link to="/owner" className="owner-link btn-secondary">Owner Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero animate-fade-in">
        <div className="hero-content">
          <h2 className="hero-title">Experience Premium Taste</h2>
          <p className="hero-subtitle">Elevate your evenings with our meticulously crafted cocktails and gourmet bites in a luxurious ambiance.</p>
          <a href="#menu" className="btn-primary" style={{ display: 'inline-block', marginTop: '2rem' }}>
            Explore Our Menu
          </a>
        </div>
        <div className="hero-overlay"></div>
      </header>

      {/* Menu Preview Section */}
      <section id="menu" className="menu-preview">
        <h3 className="section-title text-center">Signature Offerings</h3>
        <div className="menu-grid">
          {[
            { name: "Golden Oasis", desc: "A tropical blend of aged rum, passion fruit, and edible gold.", price: "₹850" },
            { name: "Midnight Espresso", desc: "Dark roasted espresso, premium vodka, a hint of vanilla.", price: "₹650" },
            { name: "Spicy Margarita", desc: "Tequila, fresh jalapeños, lime, with a chili-salt rim.", price: "₹700" },
            { name: "Truffle Fries", desc: "Crispy fries tossed in white truffle oil and parmesan.", price: "₹450" }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel menu-card animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="menu-card-header">
                <h4>{item.name}</h4>
                <span className="menu-price">{item.price}</span>
              </div>
              <p className="menu-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Shree Latha Bar. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
