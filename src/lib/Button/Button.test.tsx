import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../../test-utils';
import { Button } from './Button';

describe('Button', () => {
  it('renders children as the accessible name', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('defaults to variant=primary, size=md and type=button', () => {
    render(<Button>X</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('nbc-button', 'nbc-button--primary', 'nbc-button--md');
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('does not submit an enclosing form unless type="submit"', async () => {
    const onSubmit = vi.fn((e: { preventDefault: () => void }) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button>Plain</Button>
        <Button type="submit">Send</Button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Plain' }));
    expect(onSubmit).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it.each(['primary', 'secondary', 'danger', 'ghost'] as const)('applies variant %s', (variant) => {
    render(<Button variant={variant}>X</Button>);
    expect(screen.getByRole('button')).toHaveClass(`nbc-button--${variant}`);
  });

  it.each(['sm', 'md', 'lg'] as const)('applies size %s', (size) => {
    render(<Button size={size}>X</Button>);
    expect(screen.getByRole('button')).toHaveClass(`nbc-button--${size}`);
  });

  it('loading: aria-busy, disabled, spinner replaces icons, label kept', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick} leftIcon={<span data-testid="l" />}>
        Saving
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Saving' });
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass('nbc-button--loading');
    expect(btn.querySelector('.nbc-button__spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('l')).not.toBeInTheDocument();
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('disabled: no click', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        X
      </Button>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders both icons hidden from assistive tech', () => {
    render(
      <Button leftIcon={<span data-testid="l" />} rightIcon={<span data-testid="r" />}>
        X
      </Button>,
    );
    expect(screen.getByTestId('l').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('r').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('becomes icon-only (square) with no children and one icon', () => {
    render(<Button aria-label="Search" leftIcon={<span />} />);
    const btn = screen.getByRole('button', { name: 'Search' });
    expect(btn).toHaveClass('nbc-button--icon-only');
    expect(btn.querySelector('.nbc-button__label')).toBeNull();
  });

  it('is not icon-only when it has a label', () => {
    render(<Button leftIcon={<span />}>Search</Button>);
    expect(screen.getByRole('button')).not.toHaveClass('nbc-button--icon-only');
  });

  it('fullWidth adds the modifier', () => {
    render(<Button fullWidth>X</Button>);
    expect(screen.getByRole('button')).toHaveClass('nbc-button--full-width');
  });

  it('forwards ref, className and DOM props', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} className="mine" data-testid="b" aria-describedby="hint">
        X
      </Button>,
    );
    const btn = screen.getByTestId('b');
    expect(ref.current).toBe(btn);
    expect(btn).toHaveClass('mine', 'nbc-button');
    expect(btn).toHaveAttribute('aria-describedby', 'hint');
  });

  describe('asChild', () => {
    it('renders the child element with button classes and structure', () => {
      render(
        <Button asChild variant="secondary" rightIcon={<span data-testid="r" />}>
          <a href="/pricing" className="mine">
            Pricing
          </a>
        </Button>,
      );
      const link = screen.getByRole('link', { name: 'Pricing' });
      expect(link).toHaveAttribute('href', '/pricing');
      expect(link).toHaveClass('nbc-button', 'nbc-button--secondary', 'nbc-button--md', 'mine');
      expect(link).not.toHaveAttribute('type');
      expect(link.querySelector('.nbc-button__label')).toHaveTextContent('Pricing');
      expect(screen.getByTestId('r')).toBeInTheDocument();
    });

    it('uses aria-disabled instead of disabled and blocks clicks', async () => {
      const onClick = vi.fn();
      render(
        <Button asChild disabled onClick={onClick}>
          <a href="/x">Go</a>
        </Button>,
      );
      const link = screen.getByRole('link', { name: 'Go' });
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).not.toHaveAttribute('disabled');
      await userEvent.click(link);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  it('asChild + disabled does not run the child’s own onClick', async () => {
    const track = vi.fn();
    render(
      <Button asChild disabled>
        <a href="/x" onClick={track}>
          Go
        </a>
      </Button>,
    );
    await userEvent.click(screen.getByRole('link', { name: 'Go' }));
    expect(track).not.toHaveBeenCalled();
  });

  it('has no axe violations (text, icon-only, link)', async () => {
    const { container } = render(
      <div>
        <Button>Save</Button>
        <Button aria-label="Close" leftIcon={<svg aria-hidden />} />
        <Button asChild>
          <a href="/x">Docs</a>
        </Button>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
