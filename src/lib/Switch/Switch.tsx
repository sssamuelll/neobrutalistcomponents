import type { ComponentProps, ReactNode } from 'react';
import { cx, isPresent } from '../internal/cx';
import { useField } from '../internal/useField';

export type SwitchSize = 'sm' | 'md';

export interface SwitchProps extends Omit<ComponentProps<'input'>, 'type' | 'size' | 'role'> {
  /** Track size: 36x20px (`sm`) or 46x26px (`md`). */
  size?: SwitchSize;
  /** Visible label, associated with the switch. */
  label?: ReactNode;
  /** Help text under the label, linked with `aria-describedby`. */
  description?: ReactNode;
}

/** An on/off setting that applies immediately: a native checkbox with the switch role, drawn as a track and thumb. */
export function Switch({
  size = 'md',
  label,
  description,
  id,
  className,
  disabled,
  'aria-describedby': describedBy,
  ...rest
}: SwitchProps) {
  const field = useField(id, { description });
  const hasText = isPresent(label) || isPresent(field.message);

  return (
    <div className={cx('nbc-switch', `nbc-switch--${size}`, disabled && 'nbc-switch--disabled', className)}>
      <span className="nbc-switch__track">
        <input
          {...rest}
          id={field.id}
          type="checkbox"
          role="switch"
          className="nbc-switch__control"
          disabled={disabled}
          aria-describedby={cx(field.messageId, describedBy) || undefined}
        />
        <span className="nbc-switch__thumb" />
      </span>
      {hasText && (
        <div className="nbc-switch__text">
          {isPresent(label) && (
            <label className="nbc-switch__label" htmlFor={field.id}>
              {label}
            </label>
          )}
          {isPresent(field.message) && (
            <p id={field.messageId} className="nbc-switch__description">
              {field.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
