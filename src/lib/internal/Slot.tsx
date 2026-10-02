import { Children, cloneElement, isValidElement } from 'react';
import type { ReactNode } from 'react';
import { mergeProps } from './mergeProps';

export interface SlotProps {
  children?: ReactNode;
  [prop: string]: unknown;
}

/**
 * Renders its single child element with the slot's props merged in
 * (see `mergeProps`). Powers `asChild`.
 */
export function Slot({ children, ...slotProps }: SlotProps) {
  const child = Children.only(children);
  if (!isValidElement<Record<string, unknown>>(child)) return null;
  return cloneElement(child, mergeProps(slotProps, child.props));
}
