import React from 'react';

export default function ServiceCard({ service, onBook, onViewDetails }) {
  return (
    <div className="service-card">
      <div className="service-card-top">
        <div className="service-icon-box">{service.icon || '🔧'}</div>
        <div className="service-rating">
          ★ {service.rating} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.75rem' }}>({service.reviewsCount || 50})</span>
        </div>
      </div>

      <div className="service-card-body">
        <span className="service-category-tag">{service.category}</span>
        <h3 
          className="service-title" 
          style={{ cursor: onViewDetails ? 'pointer' : 'default' }}
          onClick={() => onViewDetails && onViewDetails(service)}
        >
          {service.name}
        </h3>
        <p className="service-desc">{service.description}</p>

        {service.features && (
          <ul className="service-features-list">
            {service.features.map((feat, idx) => (
              <li key={idx}>{feat}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="service-card-footer">
        <div className="service-price-block">
          <span className="service-price-label">Starting at</span>
          <span className="service-price-amount">₹{service.price}</span>
          <span className="service-price-duration">{service.duration}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {onViewDetails && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onViewDetails(service)}
            >
              Details
            </button>
          )}
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => onBook(service)}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
