import type { ComponentProps, ReactNode } from 'react';
import { cx, isPresent } from '../internal/cx';
import { FieldShell } from '../internal/Field';
import type { FieldSize } from '../internal/Field';
import { useField } from '../internal/useField';
import { ChevronDownIcon } from '../internal/icons';

export type SelectSize = FieldSize;

export interface SelectProps extends Omit<ComponentProps<'select'>, 'size' | 'multiple'> {
  /** Height 32 / 40 / 48px — the same scale as Button and Input. */
  size?: SelectSize;
  /** Visible label, associated with the select. */
  label?: ReactNode;
  /** Help text under the select, linked with `aria-describedby`. */
  description?: ReactNode;
  /** Invalid state. A message replaces the description; `true` keeps it. */
  error?: ReactNode | boolean;
  /** Text of a first, disabled, empty option shown until the user picks a value. */
  placeholder?: string;
}

/**
 * Native `<select>` with label, description and error built in. Options are
 * plain `<option>` / `<optgroup>` children. Where `appearance: base-select`
 * is supported the open list is themed too; everywhere else the native
 * picker is used.
 */
export function Select({
  size = 'md',
  label,
  description,
  error,
  placeholder,
  id,
  className,
  disabled,
  required,
  value,
  defaultValue,
  children,
  'aria-describedby': describedBy,
  ...rest
}: SelectProps) {
  const field = useField(id, { description, error });
  const hasPlaceholder = isPresent(placeholder);
  // Without a value of its own, the placeholder option is what the select shows first.
  const initialValue = hasPlaceholder && value === undefined && defaultValue === undefined ? '' : defaultValue;
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
          'nbc-select',
          `nbc-select--${size}`,
          field.invalid && 'nbc-select--invalid',
          disabled && 'nbc-select--disabled',
        )}
      >
        <select
          {...rest}
          id={field.id}
          className="nbc-select__control"
          disabled={disabled}
          required={required}
          value={value}
          defaultValue={initialValue}
          aria-invalid={field.invalid || undefined}
          aria-describedby={cx(field.messageId, describedBy) || undefined}
        >
          {hasPlaceholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <ChevronDownIcon className="nbc-select__chevron" />
      </div>
    </FieldShell>
  );
}
