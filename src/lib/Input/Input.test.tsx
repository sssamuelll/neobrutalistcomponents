import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../../test-utils';
import { Input } from './Input';

describe('Input', () => {
  it('associates the label with the input', () => {
    render(<Input label="Email" id="e1" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'e1');
  });

  it('generates an id when none is given', () => {
    render(<Input label="Username" />);
    expect(screen.getByLabelText('Username').id).toMatch(/^nbc-/);
  });

  it('links the description with aria-describedby', () => {
    render(<Input label="Email" description="We never share it." />);
    const input = screen.getByLabelText('Email');
    const id = input.getAttribute('aria-describedby');
    expect(document.getElementById(id!)).toHaveTextContent('We never share it.');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('error message: aria-invalid, replaces the description, linked', () => {
    render(<Input label="Slug" description="Lowercase only." error="Use kebab-case." />);
    const input = screen.getByLabelText('Slug');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByText('Lowercase only.')).not.toBeInTheDocument();
    expect(document.getElementById(input.getAttribute('aria-describedby')!)).toHaveTextContent('Use kebab-case.');
    expect(input.closest('.nbc-input')).toHaveClass('nbc-input--invalid');
  });

  it('error={true}: aria-invalid and the description stays', () => {
    render(<Input label="Slug" description="Lowercase only." error />);
    expect(screen.getByLabelText('Slug')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Lowercase only.')).toBeInTheDocument();
  });

  it('omits aria-describedby without description or error message', () => {
    render(<Input label="Name" />);
    expect(screen.getByLabelText('Name')).not.toHaveAttribute('aria-describedby');
  });

  it('required: native attribute plus a hidden visual marker', () => {
    render(<Input label="Name" required />);
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toBeRequired();
    expect(document.querySelector('.nbc-field__required')).toHaveAttribute('aria-hidden', 'true');
  });

  it.each(['sm', 'md', 'lg'] as const)('applies size %s to the box and the field', (size) => {
    const { container } = render(<Input label="X" size={size} />);
    expect(container.querySelector('.nbc-input')).toHaveClass(`nbc-input--${size}`);
    expect(container.firstElementChild).toHaveClass(`nbc-field--${size}`);
  });

  it('disabled marks the box', () => {
    const { container } = render(<Input label="X" disabled />);
    expect(screen.getByLabelText('X')).toBeDisabled();
    expect(container.querySelector('.nbc-input')).toHaveClass('nbc-input--disabled');
  });

  it('renders icons hidden from assistive tech', () => {
    render(<Input label="X" leftIcon={<span data-testid="l" />} rightIcon={<span data-testid="r" />} />);
    expect(screen.getByTestId('l').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('r').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('className goes on the wrapper, ref and DOM props on the input', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<Input label="X" className="mine" ref={ref} type="email" placeholder="you@" />);
    expect(container.firstElementChild).toHaveClass('nbc-field', 'mine');
    expect(ref.current).toBe(screen.getByLabelText('X'));
    expect(ref.current).toHaveAttribute('type', 'email');
    expect(ref.current).toHaveAttribute('placeholder', 'you@');
    expect(ref.current).toHaveClass('nbc-input__control');
  });

  it('is typeable', async () => {
    render(<Input label="X" />);
    await userEvent.type(screen.getByLabelText('X'), 'hello');
    expect(screen.getByLabelText('X')).toHaveValue('hello');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <Input label="Email" description="We never share it." />
        <Input label="Slug" error="Use kebab-case." required />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
