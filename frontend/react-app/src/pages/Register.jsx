import React, { useState } from 'react';
import { api } from '../services/api';

export default function Register({ navigate, onRegisterSuccess }) {
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Full name is required.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Valid email address is required.';
    if (!phone.trim() || phone.length < 10) newErrors.phone = 'Valid 10-digit phone number is required.';
    if (!password || password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    if (!agreeTerms) newErrors.terms = 'You must agree to the Terms of Service.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const user = await api.register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
        password
      });
      onRegisterSuccess(user);
      navigate('profile');
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-header">
          <h2>Create Your Account</h2>
          <p>Sign up in under 60 seconds to book or provide services</p>
        </div>

        {/* Role Toggle */}
        <div className="role-tabs">
          <button 
            type="button" 
            className={`role-tab ${role === 'customer' ? 'active' : ''}`}
            onClick={() => setRole('customer')}
          >
            I Need Services (Customer)
          </button>
          <button 
            type="button" 
            className={`role-tab ${role === 'provider' ? 'active' : ''}`}
            onClick={() => setRole('provider')}
          >
            I Provide Services (Partner)
          </button>
        </div>

        {errors.form && (
          <div style={{ padding: '0.75rem', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {errors.form}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-container">
              <span className="input-icon">👤</span>
              <input 
                type="text" 
                className={`form-input ${errors.name ? 'is-invalid' : ''}`}
                placeholder="e.g. Priya Patel"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {errors.name && <div className="field-error visible">{errors.name}</div>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-container">
              <span className="input-icon">✉️</span>
              <input 
                type="email" 
                className={`form-input ${errors.email ? 'is-invalid' : ''}`}
                placeholder="priya@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <div className="field-error visible">{errors.email}</div>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div className="input-container">
              <span className="input-icon">📞</span>
              <input 
                type="tel" 
                className={`form-input ${errors.phone ? 'is-invalid' : ''}`}
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            {errors.phone && <div className="field-error visible">{errors.phone}</div>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-container">
              <span className="input-icon">🔒</span>
              <input 
                type="password" 
                className={`form-input ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors.password && <div className="field-error visible">{errors.password}</div>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-container">
              <span className="input-icon">🔒</span>
              <input 
                type="password" 
                className={`form-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {errors.confirmPassword && <div className="field-error visible">{errors.confirmPassword}</div>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>I agree to the Terms of Service & Privacy Policy</span>
            </label>
          </div>
          {errors.terms && <div className="field-error visible" style={{ display: 'block' }}>{errors.terms}</div>}

          <button 
            type="submit" 
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <button 
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => navigate('login')}
          >
            Sign in here
          </button>
        </div>
      </div>
    </main>
  );
}
