import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from '../../test-utils';
import { Badge } from './Badge';
import type { BadgeVariant } from './Badge';

const VARIANTS: BadgeVariant[] = ['neutral', 'primary', 'accent', 'info', 'success', 'warning', 'danger'];

describe('Badge', () => {
  it('renders its children in a span with the base and default classes', () => {
    render(<Badge>Draft</Badge>);
    const badge = screen.getByText('Draft');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).toHaveClass('nbc-badge', 'nbc-badge--neutral', 'nbc-badge--md');
  });

  it.each(VARIANTS)('applies variant %s', (variant) => {
    render(<Badge variant={variant}>X</Badge>);
    expect(screen.getByText('X')).toHaveClass(`nbc-badge--${variant}`);
  });

  it.each(['sm', 'md'] as const)('applies size %s', (size) => {
    render(<Badge size={size}>X</Badge>);
    expect(screen.getByText('X')).toHaveClass(`nbc-badge--${size}`);
  });

  it('adds only the requested variant and size modifiers', () => {
    render(
      <Badge variant="success" size="sm">
        Synced
      </Badge>,
    );
    const badge = screen.getByText('Synced');
    expect(badge).not.toHaveClass('nbc-badge--neutral');
    expect(badge).not.toHaveClass('nbc-badge--md');
  });

  it('renders icons and text together', () => {
    render(
      <Badge variant="danger">
        <svg data-testid="icon" aria-hidden="true" />
        Failed
      </Badge>,
    );
    const badge = screen.getByText('Failed');
    expect(badge).toContainElement(screen.getByTestId('icon'));
  });

  it('forwards ref, className and DOM props', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Badge ref={ref} className="mine" data-testid="b" title="Deploy state" role="status">
        Live
      </Badge>,
    );
    const badge = screen.getByTestId('b');
    expect(ref.current).toBe(badge);
    expect(badge).toHaveClass('mine', 'nbc-badge');
    expect(badge).toHaveAttribute('title', 'Deploy state');
    expect(screen.getByRole('status')).toBe(badge);
  });

  it('has no axe violations (every variant and size)', async () => {
    const { container } = render(
      <div>
        {VARIANTS.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
        <Badge size="sm">Small</Badge>
        <Badge variant="danger">
          <svg aria-hidden="true" />
          Failed
        </Badge>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
