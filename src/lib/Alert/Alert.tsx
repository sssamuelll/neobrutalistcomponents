import type { ComponentProps, ReactNode } from 'react';
import { cx, isPresent } from '../internal/cx';
import { AlertOctagonIcon, AlertTriangleIcon, CheckCircleIcon, InfoIcon, XIcon } from '../internal/icons';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Meaning of the message. Sets the color, the default icon and the edge stripe. */
  variant?: AlertVariant;
  /** Short heading above the description. */
  title?: ReactNode;
  /** Replaces the default per-variant icon. `false` hides the icon. Always hidden from assistive tech. */
  icon?: ReactNode | false;
  /** Trailing action, usually a small `Button`. */
  action?: ReactNode;
  /** When set, renders a dismiss button that calls this. The alert does not hide itself. */
  onDismiss?: () => void;
  /** Accessible name of the dismiss button. */
  dismissLabel?: string;
}

const DEFAULT_ICONS: Record<AlertVariant, ReactNode> = {
  info: <InfoIcon />,
  success: <CheckCircleIcon />,
  warning: <AlertTriangleIcon />,
  danger: <AlertOctagonIcon />,
};

/**
 * An inline message about the state of the page or a task. Static by default;
 * pass `role="alert"` or `role="status"` when it is inserted dynamically.
 */
export function Alert({
  variant = 'info',
  title,
  icon,
  action,
  onDismiss,
  dismissLabel = 'Dismiss',
  className,
  children,
  ...rest
}: AlertProps) {
  const glyph = icon === undefined ? DEFAULT_ICONS[variant] : icon;

  return (
    <div {...rest} className={cx('nbc-alert', `nbc-alert--${variant}`, className)}>
      {icon !== false && (
        <span className="nbc-alert__icon" aria-hidden="true">
          {glyph}
        </span>
      )}
      <div className="nbc-alert__body">
        {isPresent(title) && <p className="nbc-alert__title">{title}</p>}
        {isPresent(children) && <div className="nbc-alert__description">{children}</div>}
      </div>
      {isPresent(action) && <div className="nbc-alert__action">{action}</div>}
      {onDismiss && (
        <button type="button" className="nbc-alert__dismiss" aria-label={dismissLabel} onClick={() => onDismiss()}>
          <XIcon />
        </button>
      )}
    </div>
  );
}
