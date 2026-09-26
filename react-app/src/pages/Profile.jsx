import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Profile({ navigate, user, onUpdateUser, onLogout }) {
  const currentUser = user || {
    name: 'Alex Johnson',
    email: 'alex@smartservices.com',
    phone: '+91 98765 43210',
    role: 'customer'
  };

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address || 'Flat 402, Green Valley Apartments, MG Road');
  const [savedMsg, setSavedMsg] = useState(false);
  const [bookingsCount, setBookingsCount] = useState(0);

  useEffect(() => {
    api.getBookings().then(data => setBookingsCount(data.length));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const updated = api.updateProfile({ name, phone, address });
    if (onUpdateUser) onUpdateUser(updated);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="profile-banner" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', padding: '3.5rem 0 3rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.25rem',
              fontWeight: 700,
              boxShadow: '0 4px 10px rgba(0,0,0,0.25)'
            }}>
              {currentUser.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>{currentUser.name}</h1>
              <div style={{ display: 'flex', gap: '1.5rem', color: '#94a3b8', fontSize: '0.95rem', flexWrap: 'wrap' }}>
                <span>✉️ {currentUser.email}</span>
                <span>📞 {currentUser.phone}</span>
                <span className="badge badge-success">
                  {currentUser.role.toUpperCase()} ACCOUNT
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Details & Form */}
      <main className="section-padding">
        <div className="container" style={{ maxWidth: '800px' }}>
          
          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{bookingsCount}</div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Bookings</span>
            </div>
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>100%</div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Reliability Score</span>
            </div>
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>Gold</div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Member Tier</span>
            </div>
          </div>

          <div className="card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem' }}>Personal & Delivery Information</h2>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => navigate('my-bookings')}
              >
                View Booking History →
              </button>
            </div>

            {savedMsg && (
              <div style={{ padding: '0.75rem', background: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontWeight: 600 }}>
                ✓ Profile changes saved successfully!
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  style={{ paddingLeft: '1rem' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Email Address (Read-only)</label>
                <input 
                  type="email" 
                  className="form-input"
                  style={{ paddingLeft: '1rem', background: 'var(--bg-subtle)' }}
                  value={currentUser.email}
                  disabled
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Contact Phone</label>
                <input 
                  type="tel" 
                  className="form-input"
                  style={{ paddingLeft: '1rem' }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label">Default Service Address</label>
                <textarea 
                  className="form-input"
                  style={{ padding: '0.75rem 1rem', minHeight: '80px', resize: 'vertical' }}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>

                <button 
                  type="button" 
                  className="btn btn-outline"
                  style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                  onClick={onLogout}
                >
                  Sign Out
                </button>
              </div>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
