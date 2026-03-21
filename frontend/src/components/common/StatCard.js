import React from 'react';
import './StatCard.css';

export default function StatCard({ title, value, icon, color, trend }) {
  return (
    <div className="stat-card fade-in" style={{ '--accent': color }}>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__body">
        <p className="stat-card__title">{title}</p>
        <p className="stat-card__value">{value ?? '—'}</p>
        {trend && <p className="stat-card__trend">{trend}</p>}
      </div>
    </div>
  );
}
