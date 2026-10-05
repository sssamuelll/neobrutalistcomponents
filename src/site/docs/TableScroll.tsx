import type { ReactNode } from 'react';

/**
 * Wraps a table that may scroll sideways on a phone. The region is focusable,
 * so a keyboard can scroll it (axe: scrollable-region-focusable), and named
 * after its table.
 */
export function TableScroll({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="site-props" role="region" aria-label={label} tabIndex={0}>
      {children}
    </div>
  );
}
