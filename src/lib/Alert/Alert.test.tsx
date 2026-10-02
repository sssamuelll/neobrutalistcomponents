import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../../test-utils';
import { Alert } from './Alert';

describe('Alert', () => {
  it('defaults to the info variant with a default icon hidden from assistive tech', () => {
    const { container } = render(<Alert>Your invoice was sent.</Alert>);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('nbc-alert', 'nbc-alert--info');
    const icon = root.querySelector('.nbc-alert__icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon?.querySelector('svg')).toBeInTheDocument();
  });

  it.each(['info', 'success', 'warning', 'danger'] as const)('applies variant %s with its own default icon', (variant) => {
    const { container } = render(<Alert variant={variant}>Message</Alert>);
    expect(container.firstElementChild).toHaveClass(`nbc-alert--${variant}`);
    expect(container.querySelector('.nbc-alert__icon svg')).toBeInTheDocument();
  });

  it('uses a different default glyph per variant', () => {
    const paths = (['info', 'success', 'warning', 'danger'] as const).map((variant) => {
      const { container, unmount } = render(<Alert variant={variant}>Message</Alert>);
      const markup = container.querySelector('.nbc-alert__icon svg')?.innerHTML;
      unmount();
      return markup;
    });
    expect(new Set(paths).size).toBe(4);
  });

  it('icon={false} removes the icon', () => {
    const { container } = render(<Alert icon={false}>Message</Alert>);
    expect(container.querySelector('.nbc-alert__icon')).toBeNull();
  });

  it('renders a custom icon in the icon slot', () => {
    const { container } = render(<Alert icon={<span data-testid="mine" />}>Message</Alert>);
    const slot = container.querySelector('.nbc-alert__icon');
    expect(slot).toHaveAttribute('aria-hidden', 'true');
    expect(slot).toContainElement(screen.getByTestId('mine'));
  });

  it('renders the title and the description (children)', () => {
    const { container } = render(<Alert title="Payment failed">Your card was declined.</Alert>);
    expect(container.querySelector('.nbc-alert__title')).toHaveTextContent('Payment failed');
    expect(container.querySelector('.nbc-alert__description')).toHaveTextContent('Your card was declined.');
  });

  it('omits the title and description elements when they are not given', () => {
    const { container, rerender } = render(<Alert>Only a description</Alert>);
    expect(container.querySelector('.nbc-alert__title')).toBeNull();
    rerender(<Alert title="Only a title" />);
    expect(container.querySelector('.nbc-alert__description')).toBeNull();
    expect(container.querySelector('.nbc-alert__title')).toBeInTheDocument();
  });

  it('renders the action next to the body', () => {
    const { container } = render(
      <Alert title="Trial ending" action={<button type="button">Upgrade</button>}>
        3 days left.
      </Alert>,
    );
    const action = container.querySelector('.nbc-alert__action');
    expect(action).toContainElement(screen.getByRole('button', { name: 'Upgrade' }));
  });

  it('has no dismiss button without onDismiss', () => {
    const { container } = render(<Alert>Message</Alert>);
    expect(container.querySelector('.nbc-alert__dismiss')).toBeNull();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('onDismiss renders a button named "Dismiss" that calls the handler', async () => {
    const onDismiss = vi.fn();
    render(<Alert onDismiss={onDismiss}>Message</Alert>);
    const button = screen.getByRole('button', { name: 'Dismiss' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('nbc-alert__dismiss');
    await userEvent.click(button);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('dismissLabel renames the dismiss button', () => {
    render(
      <Alert onDismiss={() => {}} dismissLabel="Cerrar aviso">
        Message
      </Alert>,
    );
    expect(screen.getByRole('button', { name: 'Cerrar aviso' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();
  });

  it('is not a live region by default', () => {
    const { container } = render(<Alert title="Saved">Done.</Alert>);
    expect(container.firstElementChild).not.toHaveAttribute('role');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('passes role="alert" and role="status" through', () => {
    const { rerender } = render(<Alert role="alert">Urgent</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Urgent');
    rerender(<Alert role="status">Polite</Alert>);
    expect(screen.getByRole('status')).toHaveTextContent('Polite');
  });

  it('forwards ref, className and DOM props to the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Alert ref={ref} className="mine" data-testid="a" id="deploy-alert">
        Message
      </Alert>,
    );
    const root = screen.getByTestId('a');
    expect(ref.current).toBe(root);
    expect(root).toHaveClass('mine', 'nbc-alert');
    expect(root).toHaveAttribute('id', 'deploy-alert');
  });

  it('has no axe violations (every variant with title, action and dismiss)', async () => {
    const { container } = render(
      <div>
        {(['info', 'success', 'warning', 'danger'] as const).map((variant) => (
          <Alert
            key={variant}
            variant={variant}
            title={`Title ${variant}`}
            action={<button type="button">Review</button>}
            onDismiss={() => {}}
          >
            Description for {variant}.
          </Alert>
        ))}
        <Alert role="alert" variant="danger" icon={false}>
          Payment failed.
        </Alert>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
