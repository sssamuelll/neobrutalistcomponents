import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import './Input.css';

export type InputVariant = 'default' | 'error';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  label?: ReactNode;
  helperText?: ReactNode;
  errorMessage?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({
  variant = 'default',
  size = 'md',
  label,
  helperText,
  errorMessage,
  leftIcon,
  rightIcon,
  id: idProp,
  className,
  ...rest
}: InputProps) {
  const autoId = useId();
  const id = idProp ?? `nbc-input-${autoId}`;
  const isError = variant === 'error';

  const descText: ReactNode = isError ? errorMessage : helperText;
  const descId = descText != null && descText !== '' ? `${id}-desc` : undefined;

  const wrapClasses = [
    'nbc-input-wrap',
    `nbc-input-wrap--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapClasses}>
      {label != null && (
        <label className="nbc-input__label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className={`nbc-input__field nbc-input__field--${variant}`}>
        {leftIcon && (
          <span className="nbc-input__icon" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          className="nbc-input"
          aria-invalid={isError || undefined}
          aria-describedby={descId}
          {...rest}
        />
        {rightIcon && (
          <span className="nbc-input__icon" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>
      {descText != null && descText !== '' && (
        <span
          id={descId}
          className={`nbc-input__desc nbc-input__desc--${isError ? 'error' : 'helper'}`}
        >
          {descText}
        </span>
      )}
    </div>
  );
}
