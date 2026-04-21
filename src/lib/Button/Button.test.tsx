import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument();
  });

  it('defaults to variant=primary and size=md', () => {
    render(<Button>X</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toMatch(/nbc-button--primary/);
    expect(btn.className).toMatch(/nbc-button--md/);
  });

  it.each(['primary', 'secondary', 'danger', 'ghost'] as const)(
    'applies variant class for %s',
    (variant) => {
      render(<Button variant={variant}>X</Button>);
      expect(screen.getByRole('button').className).toMatch(
        new RegExp(`nbc-button--${variant}`),
      );
    },
  );

  it.each(['sm', 'md', 'lg'] as const)('applies size class for %s', (size) => {
    render(<Button size={size}>X</Button>);
    expect(screen.getByRole('button').className).toMatch(
      new RegExp(`nbc-button--${size}`),
    );
  });

  it('sets aria-busy and disables when loading', () => {
    render(<Button loading>Go</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toBeDisabled();
  });

  it('disables when disabled prop is true', () => {
    render(<Button disabled>X</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>X</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not fire onClick when loading', async () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>X</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies full-width class when fullWidth=true', () => {
    render(<Button fullWidth>X</Button>);
    expect(screen.getByRole('button').className).toMatch(
      /nbc-button--full-width/,
    );
  });

  it('renders leftIcon and rightIcon when not loading', () => {
    render(
      <Button
        leftIcon={<span data-testid="l" />}
        rightIcon={<span data-testid="r" />}
      >
        X
      </Button>,
    );
    expect(screen.getByTestId('l')).toBeInTheDocument();
    expect(screen.getByTestId('r')).toBeInTheDocument();
  });

  it('suppresses icons while loading (spinner takes over)', () => {
    render(
      <Button loading leftIcon={<span data-testid="l" />}>
        X
      </Button>,
    );
    expect(screen.queryByTestId('l')).not.toBeInTheDocument();
  });

  it('forwards arbitrary DOM props', () => {
    render(
      <Button data-testid="btn" aria-label="save" type="submit">
        X
      </Button>,
    );
    const btn = screen.getByTestId('btn');
    expect(btn).toHaveAttribute('aria-label', 'save');
    expect(btn).toHaveAttribute('type', 'submit');
  });

  it('merges consumer className with internal classes', () => {
    render(<Button className="mine">X</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('mine');
    expect(btn.className).toMatch(/nbc-button/);
  });

  it('has no a11y violations in the default render', async () => {
    const { container } = render(<Button>Accessible</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
