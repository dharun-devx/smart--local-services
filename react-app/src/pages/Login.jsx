import React, { useState } from 'react';
import { api } from '../services/api';

export default function Login({ navigate, onLoginSuccess }) {
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleDemoFill = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    setRole(demoRole);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const user = await api.login(email, password, role);
      onLoginSuccess(user);
      navigate('profile');
    } catch (err) {
      setErrors({ form: err.message || 'Login failed. Please check credentials.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to manage your bookings and service history</p>
        </div>

        {/* Role Toggle */}
        <div className="role-tabs">
          <button 
            type="button" 
            className={`role-tab ${role === 'customer' ? 'active' : ''}`}
            onClick={() => setRole('customer')}
          >
            Customer
          </button>
          <button 
            type="button" 
            className={`role-tab ${role === 'provider' ? 'active' : ''}`}
            onClick={() => setRole('provider')}
          >
            Service Provider
          </button>
        </div>

        {errors.form && (
          <div style={{ padding: '0.75rem', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {errors.form}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-container">
              <span className="input-icon">✉️</span>
              <input 
                type="email" 
                className={`form-input ${errors.email ? 'is-invalid' : ''}`}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <div className="field-error visible">{errors.email}</div>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">
              <span>Password</span>
              <button 
                type="button" 
                className="forgot-link" 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => alert('Password reset instructions will be sent to your email.')}
              >
                Forgot?
              </button>
            </label>
            <div className="input-container">
              <span className="input-icon">🔒</span>
              <input 
                type="password" 
                className={`form-input ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors.password && <div className="field-error visible">{errors.password}</div>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span>Remember me</span>
            </label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="demo-box">
          <h4><span>💡</span> Quick Demo Credentials</h4>
          <div className="demo-credentials">
            <span>Customer: <code>alex@smartservices.com</code></span>
            <button 
              type="button" 
              className="demo-fill-btn"
              onClick={() => handleDemoFill('alex@smartservices.com', 'customer')}
            >
              Auto-fill
            </button>
          </div>
          <div className="demo-credentials">
            <span>Provider: <code>pro@smartservices.com</code></span>
            <button 
              type="button" 
              className="demo-fill-btn"
              onClick={() => handleDemoFill('pro@smartservices.com', 'provider')}
            >
              Auto-fill
            </button>
          </div>
        </div>

        <div className="auth-footer">
          Don't have an account yet?{' '}
          <button 
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => navigate('register')}
          >
            Create one here
          </button>
        </div>
      </div>
    </main>
  );
}
