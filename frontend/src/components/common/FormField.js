import React from 'react';
import './FormField.css';

export default function FormField({ label, error, required, children }) {
  return (
    <div className="form-field">
      {label && (
        <label className="form-field__label">
          {label} {required && <span className="form-field__req">*</span>}
        </label>
      )}
      {children}
      {error && <p className="form-field__error">{error}</p>}
    </div>
  );
}

export function Input({ ...props }) {
  return <input className="form-control" {...props} />;
}

export function Select({ children, ...props }) {
  return <select className="form-control" {...props}>{children}</select>;
}
