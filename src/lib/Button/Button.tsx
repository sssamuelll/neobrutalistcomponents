import React from 'react';
import './module.button.css'; // We'll create this next for neobrutalist styles

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}


export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  return (
    <button className={`neo-button neo-button-${variant}`} {...props}>
      {children}
    </button>
  );
};