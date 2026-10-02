import { useLayoutEffect, useMemo, useRef } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { cx, isPresent } from '../internal/cx';
import { CheckIcon, DashIcon } from '../internal/icons';
import { composeRefs } from '../internal/mergeProps';
import { useField } from '../internal/useField';

export type CheckboxSize = 'sm' | 'md';

export interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type' | 'size'> {
  /** Box size: 18px (`sm`) or 22px (`md`). */
  size?: CheckboxSize;
  /** Visible label, associated with the checkbox. */
  label?: ReactNode;
  /** Help text under the label, linked with `aria-describedby`. */
  description?: ReactNode;
  /** Invalid state. A message replaces the description; `true` keeps it. */
  error?: ReactNode | boolean;
  /** Mixed state for a parent of partially selected children. Set it from state — a click clears the DOM flag. */
  indeterminate?: boolean;
}

/** A native checkbox drawn as a brutalist box, with label, description and error built in. */
export function Checkbox({
  size = 'md',
  label,
  description,
  error,
  indeterminate,
  id,
  className,
  disabled,
  required,
  ref,
  'aria-describedby': describedBy,
  ...rest
}: CheckboxProps) {
  const field = useField(id, { description, error });
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Stable unless the consumer's ref changes, so toggling `indeterminate` never churns it.
  const composedRef = useMemo(() => composeRefs(inputRef, ref), [ref]);

  // `indeterminate` is a DOM property, not an attribute. Re-applied after every
  // render so the prop stays the source of truth even after a native click cleared it.
  useLayoutEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = Boolean(indeterminate);
  });

  const hasText = isPresent(label) || isPresent(field.message);

  return (
    <div
      className={cx(
        'nbc-checkbox',
        `nbc-checkbox--${size}`,
        field.invalid && 'nbc-checkbox--invalid',
        disabled && 'nbc-checkbox--disabled',
        className,
      )}
    >
      <span className="nbc-checkbox__box">
        <input
          {...rest}
          ref={composedRef}
          id={field.id}
          type="checkbox"
          className="nbc-checkbox__control"
          disabled={disabled}
          required={required}
          aria-invalid={field.invalid || undefined}
          aria-describedby={cx(field.messageId, describedBy) || undefined}
        />
        <CheckIcon className="nbc-checkbox__check" />
        <DashIcon className="nbc-checkbox__dash" />
      </span>
      {hasText && (
        <div className="nbc-checkbox__text">
          {isPresent(label) && (
            <label className="nbc-checkbox__label" htmlFor={field.id}>
              {label}
              {required && (
                <span className="nbc-checkbox__required" aria-hidden="true">
                  *
                </span>
              )}
            </label>
          )}
          {isPresent(field.message) && (
            <p
              id={field.messageId}
              className={cx('nbc-checkbox__message', field.isError && 'nbc-checkbox__message--error')}
            >
              {field.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
