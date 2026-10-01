import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import { cx } from '../internal/cx';
import { FieldShell } from '../internal/Field';
import type { FieldSize } from '../internal/Field';
import { useField } from '../internal/useField';

export type TextareaSize = FieldSize;

export interface TextareaProps extends ComponentProps<'textarea'> {
  /** Font size and padding: sm / md / lg. The height follows `rows` and the content. */
  size?: TextareaSize;
  /** Visible label, associated with the textarea. */
  label?: ReactNode;
  /** Help text under the textarea, linked with `aria-describedby`. */
  description?: ReactNode;
  /** Invalid state. A message replaces the description; `true` keeps it. */
  error?: ReactNode | boolean;
  /** Grow with the content (CSS `field-sizing`); `rows` stays the minimum height. */
  autoResize?: boolean;
}

/** Multi-line text field with label, description and error built in. */
export function Textarea({
  size = 'md',
  label,
  description,
  error,
  autoResize = true,
  rows = 3,
  id,
  className,
  style,
  disabled,
  required,
  'aria-describedby': describedBy,
  ...rest
}: TextareaProps) {
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
      <textarea
        {...rest}
        id={field.id}
        rows={rows}
        className={cx(
          'nbc-textarea',
          `nbc-textarea--${size}`,
          autoResize && 'nbc-textarea--auto',
          field.invalid && 'nbc-textarea--invalid',
          disabled && 'nbc-textarea--disabled',
        )}
        style={{ '--nbc-textarea-rows': rows, ...style } as CSSProperties}
        disabled={disabled}
        required={required}
        aria-invalid={field.invalid || undefined}
        aria-describedby={cx(field.messageId, describedBy) || undefined}
      />
    </FieldShell>
  );
}
