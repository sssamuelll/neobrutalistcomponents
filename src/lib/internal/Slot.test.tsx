import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slot } from './Slot';
import { mergeProps, composeRefs } from './mergeProps';
import { cx, toSafeId } from './cx';

describe('cx', () => {
  it('joins truthy parts only', () => {
    expect(cx('a', false, null, undefined, 0, '', 'b')).toBe('a b');
  });
});

describe('toSafeId', () => {
  it('keeps [A-Za-z0-9_-] and replaces everything else', () => {
    expect(toSafeId('«r1»')).toBe('_r1_');
    expect(toSafeId(':r0:')).toBe('_r0_');
    expect(toSafeId('Billing & invoices')).toBe('Billing___invoices');
  });
});

describe('composeRefs', () => {
  it('assigns object refs and calls callback refs', () => {
    const obj = createRef<HTMLDivElement>();
    const fn = vi.fn();
    const node = document.createElement('div');
    composeRefs<HTMLDivElement>(obj, fn, undefined)(node);
    expect(obj.current).toBe(node);
    expect(fn).toHaveBeenCalledWith(node);
  });
});

describe('mergeProps', () => {
  it('joins classNames, child style wins, chains handlers child first', () => {
    const order: string[] = [];
    const merged = mergeProps(
      { className: 'slot', style: { color: 'red', margin: 1 }, onClick: () => order.push('slot'), title: 'slot' },
      { className: 'child', style: { color: 'blue' }, onClick: () => order.push('child'), title: 'child' },
    );
    expect(merged.className).toBe('slot child');
    expect(merged.style).toEqual({ color: 'blue', margin: 1 });
    expect(merged.title).toBe('child');
    (merged.onClick as () => void)();
    expect(order).toEqual(['child', 'slot']);
  });

  it('does not run the slot handler when the child prevented default', () => {
    const slot = vi.fn();
    const merged = mergeProps(
      { onClick: slot },
      { onClick: (e: { preventDefault: () => void }) => e.preventDefault() },
    );
    const event = { defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
    (merged.onClick as (e: typeof event) => void)(event);
    expect(slot).not.toHaveBeenCalled();
  });
});

describe('Slot', () => {
  it('renders the child element with merged props and composed refs', async () => {
    const slotClick = vi.fn();
    const childRef = createRef<HTMLAnchorElement>();
    const slotRef = createRef<HTMLElement>();
    render(
      <Slot className="nbc-x" onClick={slotClick} ref={slotRef}>
        <a href="/docs" className="mine" ref={childRef}>
          Docs
        </a>
      </Slot>,
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveClass('nbc-x', 'mine');
    expect(link).toHaveAttribute('href', '/docs');
    expect(childRef.current).toBe(link);
    expect(slotRef.current).toBe(link);
    await userEvent.click(link);
    expect(slotClick).toHaveBeenCalledTimes(1);
  });
});
