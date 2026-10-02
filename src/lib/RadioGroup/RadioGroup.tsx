import { createContext, useContext, useId, useMemo } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { cx, isPresent, toSafeId } from '../internal/cx';
import { useControllableState } from '../internal/useControllableState';
import { useField } from '../internal/useField';

export type RadioGroupSize = 'sm' | 'md';
export type RadioGroupOrientation = 'vertical' | 'horizontal';

export interface RadioGroupProps extends Omit<ComponentProps<'fieldset'>, 'onChange' | 'defaultValue'> {
  /** Visible group name, rendered as the fieldset `<legend>`. */
  label?: ReactNode;
  /** Help text under the options, linked to the group with `aria-describedby`. */
  description?: ReactNode;
  /** Invalid state. A message replaces the description; `true` keeps it. */
  error?: ReactNode | boolean;
  /** Form field name shared by every Radio. Generated when omitted. */
  name?: string;
  /** Selected value (controlled). Use `''` for "nothing selected". */
  value?: string;
  /** Initially selected value (uncontrolled). */
  defaultValue?: string;
  /** Called with the new value when the user picks another option. */
  onValueChange?: (value: string) => void;
  /** Stack the options (`vertical`) or lay them out in a wrapping row (`horizontal`). */
  orientation?: RadioGroupOrientation;
  /** Dot size: 18px (`sm`) or 22px (`md`). */
  size?: RadioGroupSize;
  /** Requires a selection: native `required` on every radio plus `aria-required` on the group. */
  required?: boolean;
}

export interface RadioProps
  extends Omit<ComponentProps<'input'>, 'type' | 'size' | 'name' | 'checked' | 'defaultChecked' | 'value'> {
  /** The value this option stands for. Reported by the group and submitted with the form. */
  value: string;
  /** Visible label, associated with the radio. */
  label?: ReactNode;
  /** Help text under the label, linked with `aria-describedby`. */
  description?: ReactNode;
}

interface RadioGroupContextValue {
  name: string;
  value: string;
  setValue: (value: string) => void;
  disabled: boolean;
  required: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/** Pick exactly one option from a small visible set: a fieldset of native radios drawn as brutalist dots. */
export function RadioGroup({
  label,
  description,
  error,
  name,
  value,
  defaultValue,
  onValueChange,
  orientation = 'vertical',
  size = 'md',
  required = false,
  id,
  className,
  disabled = false,
  children,
  'aria-describedby': describedBy,
  ...rest
}: RadioGroupProps) {
  const field = useField(id, { description, error });
  const generatedName = `nbc-${toSafeId(useId())}`;
  const groupName = name ?? generatedName;
  const [current, setValue] = useControllableState(value, defaultValue ?? '', onValueChange);

  const context = useMemo<RadioGroupContextValue>(
    () => ({ name: groupName, value: current, setValue, disabled, required }),
    [groupName, current, setValue, disabled, required],
  );

  return (
    <fieldset
      {...rest}
      id={field.id}
      role="radiogroup"
      disabled={disabled}
      className={cx(
        'nbc-radio-group',
        `nbc-radio-group--${orientation}`,
        `nbc-radio-group--${size}`,
        field.invalid && 'nbc-radio-group--invalid',
        className,
      )}
      aria-required={required || undefined}
      aria-invalid={field.invalid || undefined}
      aria-describedby={cx(field.messageId, describedBy) || undefined}
    >
      {isPresent(label) && (
        <legend className="nbc-radio-group__label">
          {label}
          {required && (
            <span className="nbc-radio-group__required" aria-hidden="true">
              *
            </span>
          )}
        </legend>
      )}
      <RadioGroupContext value={context}>
        <div className="nbc-radio-group__items">{children}</div>
      </RadioGroupContext>
      {isPresent(field.message) && (
        <p
          id={field.messageId}
          className={cx('nbc-radio-group__message', field.isError && 'nbc-radio-group__message--error')}
        >
          {field.message}
        </p>
      )}
    </fieldset>
  );
}

/** One option of a RadioGroup: a native radio drawn as a dot, with label and description. */
export function Radio({
  value,
  label,
  description,
  id,
  className,
  disabled,
  required,
  onChange,
  'aria-describedby': describedBy,
  ...rest
}: RadioProps) {
  const group = useContext(RadioGroupContext);
  const autoId = useId();
  if (!group) throw new Error('Radio must be used inside RadioGroup');

  const inputId = id ?? `nbc-${toSafeId(autoId)}`;
  const descriptionId = isPresent(description) ? `${inputId}-description` : undefined;
  const isDisabled = disabled || group.disabled;
  const hasText = isPresent(label) || isPresent(description);

  return (
    <div className={cx('nbc-radio', isDisabled && 'nbc-radio--disabled', className)}>
      <span className="nbc-radio__box">
        <input
          {...rest}
          id={inputId}
          type="radio"
          name={group.name}
          value={value}
          checked={group.value === value}
          disabled={disabled}
          required={required || group.required || undefined}
          className="nbc-radio__control"
          aria-describedby={cx(descriptionId, describedBy) || undefined}
          onChange={(event) => {
            group.setValue(value);
            onChange?.(event);
          }}
        />
        <span className="nbc-radio__dot" aria-hidden="true" />
      </span>
      {hasText && (
        <div className="nbc-radio__text">
          {isPresent(label) && (
            <label className="nbc-radio__label" htmlFor={inputId}>
              {label}
            </label>
          )}
          {descriptionId && (
            <p id={descriptionId} className="nbc-radio__description">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
