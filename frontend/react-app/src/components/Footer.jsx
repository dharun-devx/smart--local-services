import React from 'react';

export default function Footer({ navigate }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>🛠️ Smart Local Services</h3>
            <p>Your one-stop community platform for hiring trusted, vetted, and background-checked service experts in your neighborhood.</p>
            <p><strong>Support:</strong> +91 98765 43210<br /><strong>Email:</strong> help@smartlocalservices.com</p>
          </div>

          <div className="footer-col">
            <h4>Popular Services</h4>
            <ul>
              <li>
                <button 
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                  onClick={() => navigate('services', { category: 'plumbing' })}
                >
                  Plumbing Repair
                </button>
              </li>
              <li>
                <button 
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                  onClick={() => navigate('services', { category: 'electrical' })}
                >
                  Electrical Wiring
                </button>
              </li>
              <li>
                <button 
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                  onClick={() => navigate('services', { category: 'cleaning' })}
                >
                  Deep Cleaning
                </button>
              </li>
              <li>
                <button 
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                  onClick={() => navigate('services', { category: 'appliances' })}
                >
                  AC Servicing
                </button>
              </li>
              <li>
                <button 
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                  onClick={() => navigate('services', { category: 'painting' })}
                >
                  Home Painting
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Navigation</h4>
            <ul>
              <li>
                <button 
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                  onClick={() => navigate('home')}
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                  onClick={() => navigate('services')}
                >
                  Services Catalog
                </button>
              </li>
              <li>
                <button 
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                  onClick={() => navigate('booking')}
                >
                  Schedule Service
                </button>
              </li>
              <li>
                <button 
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                  onClick={() => navigate('my-bookings')}
                >
                  My Bookings
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Trust & Safety</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#94a3b8' }}>
              All our verified professionals undergo strict background verification and identity screening.
            </p>
            <span className="badge badge-success">100% Certified Experts</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Smart Local Services Platform. All rights reserved.</p>
          <p>Modern React On-Demand Services Application</p>
        </div>
      </div>
    </footer>
  );
}
