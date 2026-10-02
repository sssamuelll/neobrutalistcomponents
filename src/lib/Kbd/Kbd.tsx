import type { ComponentProps } from 'react';
import { cx } from '../internal/cx';

export type KbdSize = 'sm' | 'md';

export interface KbdProps extends ComponentProps<'kbd'> {
  /** Key cap height 20 / 24px. */
  size?: KbdSize;
}

export function Kbd({ size = 'md', className, ...rest }: KbdProps) {
  return <kbd {...rest} className={cx('nbc-kbd', `nbc-kbd--${size}`, className)} />;
}
