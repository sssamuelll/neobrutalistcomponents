import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  const classes = [
    'nbc-button',
    `nbc-button--${variant}`,
    `nbc-button--${size}`,
    fullWidth && 'nbc-button--full-width',
    loading && 'nbc-button--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="nbc-button__spinner" aria-hidden="true" />}
      {!loading && leftIcon && (
        <span className="nbc-button__icon" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {children != null && <span className="nbc-button__label">{children}</span>}
      {!loading && rightIcon && (
        <span className="nbc-button__icon" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
}
