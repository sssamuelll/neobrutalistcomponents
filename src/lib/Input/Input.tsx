import type { ComponentProps, ReactNode } from 'react';
import { cx, isPresent } from '../internal/cx';
import { FieldShell } from '../internal/Field';
import type { FieldSize } from '../internal/Field';
import { useField } from '../internal/useField';

export type InputSize = FieldSize;

export interface InputProps extends Omit<ComponentProps<'input'>, 'size'> {
  /** Height 32 / 40 / 48px — the same scale as Button. */
  size?: InputSize;
  /** Visible label, associated with the input. */
  label?: ReactNode;
  /** Help text under the input, linked with `aria-describedby`. */
  description?: ReactNode;
  /** Invalid state. A message replaces the description; `true` keeps it. */
  error?: ReactNode | boolean;
  /** Decorative icon at the start of the box (hidden from assistive tech). */
  leftIcon?: ReactNode;
  /** Decorative icon at the end of the box (hidden from assistive tech). */
  rightIcon?: ReactNode;
}

/** Single-line text field with label, description and error built in. */
export function Input({
  size = 'md',
  label,
  description,
  error,
  leftIcon,
  rightIcon,
  id,
  className,
  disabled,
  required,
  'aria-describedby': describedBy,
  ...rest
}: InputProps) {
  const field = useField(id, { description, error });
  return (
    <FieldShell
      id={field.id}
      label={label}
      required={required}
      message={field.message}
      messageId={field.messageId}
      isError={field.isError}
      invalid={field.invalid}
      disabled={disabled}
      size={size}
      className={className}
    >
      <div
        className={cx(
          'nbc-input',
          `nbc-input--${size}`,
          field.invalid && 'nbc-input--invalid',
          disabled && 'nbc-input--disabled',
        )}
      >
        {isPresent(leftIcon) && (
          <span className="nbc-input__icon" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <input
          {...rest}
          id={field.id}
          className="nbc-input__control"
          disabled={disabled}
          required={required}
          aria-invalid={field.invalid || undefined}
          aria-describedby={cx(field.messageId, describedBy) || undefined}
        />
        {isPresent(rightIcon) && (
          <span className="nbc-input__icon" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>
    </FieldShell>
  );
}
