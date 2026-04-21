import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Input } from './Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="type here" />);
    expect(screen.getByPlaceholderText('type here')).toBeInTheDocument();
  });

  it('renders a label and associates it via htmlFor', () => {
    render(<Input label="Email" id="e1" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('id', 'e1');
  });

  it('auto-generates an id when none is provided', () => {
    render(<Input label="Username" />);
    const input = screen.getByLabelText('Username');
    expect(input.id).toBeTruthy();
  });

  it('renders helperText when variant=default', () => {
    render(<Input label="X" helperText="we never share" />);
    expect(screen.getByText('we never share')).toBeInTheDocument();
  });

  it('sets aria-invalid when variant=error', () => {
    render(<Input label="X" variant="error" />);
    expect(screen.getByLabelText('X')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders errorMessage and hides helperText when variant=error', () => {
    render(
      <Input
        label="X"
        variant="error"
        helperText="neutral hint"
        errorMessage="bad input"
      />,
    );
    expect(screen.getByText('bad input')).toBeInTheDocument();
    expect(screen.queryByText('neutral hint')).not.toBeInTheDocument();
  });

  it('ignores errorMessage when variant=default', () => {
    render(
      <Input
        label="X"
        helperText="neutral hint"
        errorMessage="should not show"
      />,
    );
    expect(screen.queryByText('should not show')).not.toBeInTheDocument();
    expect(screen.getByText('neutral hint')).toBeInTheDocument();
  });

  it.each(['sm', 'md', 'lg'] as const)(
    'applies size class for %s on the wrapper',
    (size) => {
      const { container } = render(<Input label="X" size={size} />);
      expect(container.firstChild).toHaveClass(`nbc-input-wrap--${size}`);
    },
  );

  it('renders left and right icons', () => {
    render(
      <Input
        label="X"
        leftIcon={<span data-testid="l" />}
        rightIcon={<span data-testid="r" />}
      />,
    );
    expect(screen.getByTestId('l')).toBeInTheDocument();
    expect(screen.getByTestId('r')).toBeInTheDocument();
  });

  it('links aria-describedby to the helperText element when present', () => {
    render(<Input label="X" helperText="hint" />);
    const input = screen.getByLabelText('X');
    const descId = input.getAttribute('aria-describedby');
    expect(descId).toBeTruthy();
    expect(document.getElementById(descId!)).toHaveTextContent('hint');
  });

  it('links aria-describedby to the errorMessage element when variant=error', () => {
    render(<Input label="X" variant="error" errorMessage="bad" />);
    const input = screen.getByLabelText('X');
    const descId = input.getAttribute('aria-describedby');
    expect(descId).toBeTruthy();
    expect(document.getElementById(descId!)).toHaveTextContent('bad');
  });

  it('omits aria-describedby when no helper/error text is present', () => {
    render(<Input label="X" />);
    expect(screen.getByLabelText('X')).not.toHaveAttribute('aria-describedby');
  });

  it('forwards arbitrary input props', () => {
    render(
      <Input label="X" type="email" data-testid="em" placeholder="you@" />,
    );
    const input = screen.getByTestId('em');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'you@');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Input label="Email" helperText="we never share" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
