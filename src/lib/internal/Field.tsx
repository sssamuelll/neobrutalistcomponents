import type { ReactNode } from 'react';
import { cx, isPresent } from './cx';

/** The label / description / error trio shared by every form control. */
export interface FieldOwnProps {
  /** Visible label, associated with the control. */
  label?: ReactNode;
  /** Help text under the control, linked via `aria-describedby`. */
  description?: ReactNode;
  /**
   * Marks the control invalid (`aria-invalid`). A message replaces the
   * description; `true` marks it invalid and keeps the description.
   */
  error?: ReactNode | boolean;
}

export type FieldSize = 'sm' | 'md' | 'lg';

export interface FieldShellProps {
  id: string;
  label?: ReactNode;
  required?: boolean;
  message?: ReactNode;
  messageId?: string;
  isError: boolean;
  invalid: boolean;
  disabled?: boolean;
  size: FieldSize;
  className?: string;
  children: ReactNode;
}

/** Wrapper rendering label → control → message with the shared `nbc-field` hooks. */
export function FieldShell({
  id,
  label,
  required,
  message,
  messageId,
  isError,
  invalid,
  disabled,
  size,
  className,
  children,
}: FieldShellProps) {
  return (
    <div
      className={cx(
        'nbc-field',
        `nbc-field--${size}`,
        invalid && 'nbc-field--invalid',
        disabled && 'nbc-field--disabled',
        className,
      )}
    >
      {isPresent(label) && (
        <label className="nbc-field__label" htmlFor={id}>
          {label}
          {required && (
            <span className="nbc-field__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {isPresent(message) && (
        <p id={messageId} className={cx('nbc-field__message', isError && 'nbc-field__message--error')}>
          {message}
        </p>
      )}
    </div>
  );
}
