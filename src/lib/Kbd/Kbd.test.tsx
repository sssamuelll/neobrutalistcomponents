import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../test-utils';
import { Kbd } from './Kbd';

describe('Kbd', () => {
  it('renders a kbd element with base and default size classes', () => {
    render(<Kbd>K</Kbd>);
    const el = screen.getByText('K');
    expect(el.tagName).toBe('KBD');
    expect(el).toHaveClass('nbc-kbd', 'nbc-kbd--md');
  });

  it('applies the size modifier', () => {
    render(<Kbd size="sm">Esc</Kbd>);
    const el = screen.getByText('Esc');
    expect(el).toHaveClass('nbc-kbd--sm');
    expect(el).not.toHaveClass('nbc-kbd--md');
  });

  it('passes className, ref and native props through', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Kbd ref={ref} className="extra" data-testid="key" title="Command">
        ⌘
      </Kbd>,
    );
    const el = screen.getByTestId('key');
    expect(el).toHaveClass('nbc-kbd', 'extra');
    expect(el).toHaveAttribute('title', 'Command');
    expect(ref.current).toBe(el);
  });

  it('supports nested combos', () => {
    render(
      <kbd data-testid="combo">
        <Kbd>⌘</Kbd>+<Kbd>K</Kbd>
      </kbd>,
    );
    expect(screen.getByTestId('combo').querySelectorAll('kbd.nbc-kbd')).toHaveLength(2);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <p>
        Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search.
      </p>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
