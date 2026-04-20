// src/lib/Input/Input.tsx
import React, { InputHTMLAttributes } from 'react';
import './module.input.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  label?: string;
}

export const Input: React.FC<InputProps> = ({ error = false, label, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
      {label && (
        <label htmlFor={props.id} style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
          {label}
        </label>
      )}
      <input
        className={`neo-input ${error ? 'error' : ''}`}
        aria-invalid={error}
        {...props}
      />
      {error && (
        <span role="alert" style={{ color: '#ff0000', marginTop: '0.25rem', fontSize: '0.875rem' }}>
          Campo inválido
        </span>
      )}
    </div>
  );
};
