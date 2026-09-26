import React, { useState } from 'react';

export default function Navbar({ activePage, navigate, user, onLogout }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleNav = (page, param) => {
    setIsMobileOpen(false);
    navigate(page, param);
  };

  return (
    <header className="site-header">
      <div className="container navbar">
        <a 
          href="#home" 
          className="nav-brand" 
          onClick={(e) => { e.preventDefault(); handleNav('home'); }}
        >
          <span className="brand-icon">🛠️</span>
          <span>Smart<span className="brand-accent">Services</span></span>
        </a>

        {/* Desktop Nav Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <button 
                className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
                onClick={() => handleNav('home')}
              >
                Home
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activePage === 'services' ? 'active' : ''}`}
                onClick={() => handleNav('services')}
              >
                All Services
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activePage === 'booking' ? 'active' : ''}`}
                onClick={() => handleNav('booking')}
              >
                Book Now
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activePage === 'my-bookings' ? 'active' : ''}`}
                onClick={() => handleNav('my-bookings')}
              >
                My Bookings
              </button>
            </li>
          </ul>
        </nav>

        {/* Auth Action Buttons */}
        <div className="nav-actions">
          {user ? (
            <div className="nav-user-info" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button 
                className="nav-user-avatar" 
                title={user.name}
                onClick={() => handleNav('profile')}
              >
                {user.name.charAt(0).toUpperCase()}
              </button>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => handleNav('profile')}
              >
                {user.name.split(' ')[0]}
              </button>
              <button 
                className="btn btn-outline btn-sm"
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => handleNav('login')}
              >
                Login
              </button>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => handleNav('register')}
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="nav-toggle" 
          aria-label="Toggle navigation"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <>
          <div className="mobile-backdrop open" onClick={() => setIsMobileOpen(false)}></div>
          <aside className="mobile-nav open">
            <div className="mobile-nav-header">
              <div className="nav-brand">
                <span className="brand-icon">🛠️</span>
                <span>SmartServices</span>
              </div>
              <button className="mobile-close-btn" onClick={() => setIsMobileOpen(false)}>&times;</button>
            </div>
            <ul className="nav-links">
              <li>
                <button 
                  className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
                  onClick={() => handleNav('home')}
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  className={`nav-link ${activePage === 'services' ? 'active' : ''}`}
                  onClick={() => handleNav('services')}
                >
                  All Services
                </button>
              </li>
              <li>
                <button 
                  className={`nav-link ${activePage === 'booking' ? 'active' : ''}`}
                  onClick={() => handleNav('booking')}
                >
                  Book Now
                </button>
              </li>
              <li>
                <button 
                  className={`nav-link ${activePage === 'my-bookings' ? 'active' : ''}`}
                  onClick={() => handleNav('my-bookings')}
                >
                  My Bookings
                </button>
              </li>
              <li>
                <button 
                  className={`nav-link ${activePage === 'profile' ? 'active' : ''}`}
                  onClick={() => handleNav('profile')}
                >
                  Account Profile
                </button>
              </li>
            </ul>
            <div className="nav-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
              {user ? (
                <button className="btn btn-outline" onClick={onLogout}>Logout ({user.name})</button>
              ) : (
                <>
                  <button className="btn btn-secondary" onClick={() => handleNav('login')}>Login</button>
                  <button className="btn btn-primary" onClick={() => handleNav('register')}>Sign Up</button>
                </>
              )}
            </div>
          </aside>
        </>
      )}
    </header>
  );
}
