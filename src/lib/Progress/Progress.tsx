import { useId } from 'react';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import { cx, isPresent, toSafeId } from '../internal/cx';

export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressVariant = 'primary' | 'success' | 'warning' | 'danger';

export interface ProgressProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Current value from 0 to `max`. Leave it out (or pass `null`) while the amount of work is unknown. */
  value?: number | null;
  /** Value that means 100%. Anything that is not a positive number falls back to 100. */
  max?: number;
  /** Visible label above the bar. It also names the progressbar — without it, pass `aria-label`. */
  label?: ReactNode;
  /** Show the percentage at the end of the header (determinate only). */
  showValue?: boolean;
  /** Bar height 8 / 14 / 22px. */
  size?: ProgressSize;
  /** Meaning of the bar. `primary` for work in flight, the status variants for quotas and results. */
  variant?: ProgressVariant;
}

export function Progress({
  value,
  max,
  label,
  showValue = false,
  size = 'md',
  variant = 'primary',
  id: idProp,
  className,
  'aria-labelledby': labelledBy,
  'aria-valuetext': valueText,
  ...rest
}: ProgressProps) {
  const autoId = useId();
  const labelId = `${idProp ?? `nbc-${toSafeId(autoId)}`}-label`;

  const safeMax = typeof max === 'number' && Number.isFinite(max) && max > 0 ? max : 100;
  const determinate = typeof value === 'number' && !Number.isNaN(value);
  const clamped = determinate ? Math.min(Math.max(value, 0), safeMax) : 0;
  const percent = Math.round((clamped / safeMax) * 100);

  const hasLabel = isPresent(label);
  const hasValue = showValue && determinate;

  return (
    <div
      {...rest}
      id={idProp}
      role="progressbar"
      className={cx(
        'nbc-progress',
        `nbc-progress--${size}`,
        `nbc-progress--${variant}`,
        !determinate && 'nbc-progress--indeterminate',
        className,
      )}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={determinate ? clamped : undefined}
      aria-valuetext={determinate ? (valueText ?? `${percent}%`) : undefined}
      aria-labelledby={hasLabel ? labelId : labelledBy}
    >
      {(hasLabel || hasValue) && (
        <div className="nbc-progress__header">
          {hasLabel && (
            <span id={labelId} className="nbc-progress__label">
              {label}
            </span>
          )}
          {hasValue && <span className="nbc-progress__value">{percent}%</span>}
        </div>
      )}
      <div className="nbc-progress__track">
        <div
          className="nbc-progress__bar"
          style={determinate ? ({ '--nbc-progress-value': `${percent}%` } as CSSProperties) : undefined}
        />
      </div>
    </div>
  );
}
