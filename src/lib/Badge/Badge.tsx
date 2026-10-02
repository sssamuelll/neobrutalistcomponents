import type { ComponentProps } from 'react';
import { cx } from '../internal/cx';

export type BadgeVariant = 'neutral' | 'primary' | 'accent' | 'info' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends ComponentProps<'span'> {
  /** Meaning of the sticker. `neutral` for plain labels, the status variants for state. */
  variant?: BadgeVariant;
  /** Block size 20 / 24px. Use `sm` inside dense rows and next to body text. */
  size?: BadgeSize;
}

export function Badge({ variant = 'neutral', size = 'md', className, ...rest }: BadgeProps) {
  return <span {...rest} className={cx('nbc-badge', `nbc-badge--${variant}`, `nbc-badge--${size}`, className)} />;
}
