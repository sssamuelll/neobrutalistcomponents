import { describe, it, expect, vi } from 'vitest';
import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../../test-utils';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders a native checkbox with the switch role, named by its label', () => {
    render(<Switch label="Deploy previews for every pull request" />);
    const control = screen.getByRole('switch', { name: 'Deploy previews for every pull request' });
    expect(control.tagName).toBe('INPUT');
    expect(control).toHaveAttribute('type', 'checkbox');
    expect(control).toHaveAttribute('role', 'switch');
    expect(control).not.toBeChecked();
  });

  it('does not let a consumer override type or role', () => {
    // The props type forbids both; this guards the runtime for untyped callers.
    const loose: object = { type: 'radio', role: 'checkbox' };
    render(<Switch label="Locked" {...loose} />);
    const control = screen.getByLabelText('Locked');
    expect(control).toHaveAttribute('type', 'checkbox');
    expect(control).toHaveAttribute('role', 'switch');
  });

  it('generates an id when none is given and keeps a given one', () => {
    const { rerender } = render(<Switch label="Auto" />);
    expect(screen.getByLabelText('Auto').id).toMatch(/^nbc-/);
    rerender(<Switch label="Auto" id="s1" />);
    expect(screen.getByLabelText('Auto')).toHaveAttribute('id', 's1');
  });

  it('toggles by clicking the control, reflecting the state', async () => {
    const user = userEvent.setup();
    render(<Switch label="Autosave" />);
    const control = screen.getByRole('switch', { name: 'Autosave' });
    await user.click(control);
    expect(control).toBeChecked();
    await user.click(control);
    expect(control).not.toBeChecked();
  });

  it('toggles by clicking the label', async () => {
    const user = userEvent.setup();
    render(<Switch label="Autosave" />);
    const control = screen.getByRole('switch', { name: 'Autosave' });
    await user.click(screen.getByText('Autosave'));
    expect(control).toBeChecked();
    await user.click(screen.getByText('Autosave'));
    expect(control).not.toBeChecked();
  });

  it('toggles with the Space key', async () => {
    const user = userEvent.setup();
    render(<Switch label="Autosave" />);
    const control = screen.getByRole('switch', { name: 'Autosave' });
    await user.tab();
    expect(control).toHaveFocus();
    await user.keyboard(' ');
    expect(control).toBeChecked();
    await user.keyboard(' ');
    expect(control).not.toBeChecked();
  });

  it('works controlled: checked + onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<Switch label="Notify" checked={false} onChange={onChange} />);
    await user.click(screen.getByRole('switch', { name: 'Notify' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    // The parent did not accept the change: still off.
    expect(screen.getByRole('switch', { name: 'Notify' })).not.toBeChecked();
    rerender(<Switch label="Notify" checked onChange={onChange} />);
    expect(screen.getByRole('switch', { name: 'Notify' })).toBeChecked();
  });

  it('drives a controlled switch from parent state', async () => {
    const user = userEvent.setup();
    function Settings() {
      const [on, setOn] = useState(false);
      return (
        <div>
          <Switch label="Maintenance mode" checked={on} onChange={(e) => setOn(e.target.checked)} />
          <p>{on ? 'Visitors see the maintenance page.' : 'Site is live.'}</p>
        </div>
      );
    }
    render(<Settings />);
    expect(screen.getByText('Site is live.')).toBeInTheDocument();
    await user.click(screen.getByRole('switch', { name: 'Maintenance mode' }));
    expect(screen.getByRole('switch', { name: 'Maintenance mode' })).toBeChecked();
    expect(screen.getByText('Visitors see the maintenance page.')).toBeInTheDocument();
  });

  it('supports defaultChecked', () => {
    render(<Switch label="Notify" defaultChecked />);
    expect(screen.getByRole('switch', { name: 'Notify' })).toBeChecked();
  });

  it('links the description with aria-describedby', () => {
    render(<Switch label="Previews" description="Every pull request gets its own URL." />);
    const control = screen.getByRole('switch', { name: 'Previews' });
    const message = document.getElementById(control.getAttribute('aria-describedby')!);
    expect(message).toHaveTextContent('Every pull request gets its own URL.');
    expect(message).toHaveClass('nbc-switch__description');
    expect(control).toHaveAccessibleDescription('Every pull request gets its own URL.');
  });

  it('omits aria-describedby without a description', () => {
    render(<Switch label="Previews" />);
    expect(screen.getByRole('switch', { name: 'Previews' })).not.toHaveAttribute('aria-describedby');
  });

  it('merges a consumer aria-describedby with the description id', () => {
    render(
      <>
        <p id="extra">Billing changes apply next cycle.</p>
        <Switch label="Previews" description="Every pull request gets its own URL." aria-describedby="extra" />
      </>,
    );
    const ids = screen.getByRole('switch', { name: 'Previews' }).getAttribute('aria-describedby')!.split(' ');
    expect(ids).toHaveLength(2);
    expect(ids).toContain('extra');
    expect(document.getElementById(ids.find((i) => i !== 'extra')!)).toHaveTextContent(
      'Every pull request gets its own URL.',
    );
  });

  it('keeps a consumer aria-describedby alone when there is no description', () => {
    render(
      <>
        <p id="extra">Extra.</p>
        <Switch label="Previews" aria-describedby="extra" />
      </>,
    );
    expect(screen.getByRole('switch', { name: 'Previews' })).toHaveAttribute('aria-describedby', 'extra');
  });

  it('is never invalid: no aria-invalid and no error API', () => {
    render(<Switch label="Previews" description="Applies immediately." />);
    expect(screen.getByRole('switch', { name: 'Previews' })).not.toHaveAttribute('aria-invalid');
  });

  it('disabled: native, marks the root, cannot be toggled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<Switch label="Locked" disabled onChange={onChange} />);
    const control = screen.getByRole('switch', { name: 'Locked' });
    expect(control).toBeDisabled();
    expect(container.firstElementChild).toHaveClass('nbc-switch--disabled');
    await user.click(control);
    await user.click(screen.getByText('Locked'));
    expect(control).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not mark the root disabled when enabled', () => {
    const { container } = render(<Switch label="Open" />);
    expect(container.firstElementChild).not.toHaveClass('nbc-switch--disabled');
  });

  it.each(['sm', 'md'] as const)('applies size %s', (size) => {
    const { container } = render(<Switch label="X" size={size} />);
    expect(container.firstElementChild).toHaveClass('nbc-switch', `nbc-switch--${size}`);
  });

  it('defaults to size md', () => {
    const { container } = render(<Switch label="X" />);
    expect(container.firstElementChild).toHaveClass('nbc-switch--md');
  });

  it('has the documented DOM structure', () => {
    const { container } = render(<Switch label="X" description="Y" />);
    const root = container.firstElementChild!;
    const track = root.querySelector(':scope > .nbc-switch__track')!;
    expect(track.tagName).toBe('SPAN');
    expect(track.querySelector(':scope > input.nbc-switch__control')).toBeInTheDocument();
    expect(track.querySelector(':scope > span.nbc-switch__thumb')).toBeInTheDocument();
    const text = root.querySelector(':scope > .nbc-switch__text')!;
    expect(text.querySelector('label.nbc-switch__label')).toHaveAttribute('for', screen.getByRole('switch').id);
    expect(text.querySelector('p.nbc-switch__description')).toBeInTheDocument();
  });

  it('puts the input before the thumb so the thumb can follow :checked', () => {
    const { container } = render(<Switch label="X" />);
    const control = container.querySelector('.nbc-switch__control')!;
    expect(control.nextElementSibling).toHaveClass('nbc-switch__thumb');
  });

  it('omits the text block when there is neither label nor description', () => {
    const { container } = render(<Switch aria-label="Dark mode" />);
    expect(container.querySelector('.nbc-switch__text')).not.toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeInTheDocument();
  });

  it('renders the text block for a description without a label', () => {
    const { container } = render(<Switch aria-label="Webhooks" description="Send events to your endpoint." />);
    expect(container.querySelector('.nbc-switch__label')).not.toBeInTheDocument();
    expect(screen.getByText('Send events to your endpoint.')).toBeInTheDocument();
  });

  it('className goes on the root; ref and DOM props on the input', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<Switch label="X" className="mine" ref={ref} name="previews" value="on" />);
    expect(container.firstElementChild).toHaveClass('nbc-switch', 'mine');
    expect(ref.current).toBe(screen.getByRole('switch', { name: 'X' }));
    expect(ref.current).toHaveAttribute('name', 'previews');
    expect(ref.current).toHaveAttribute('value', 'on');
    expect(ref.current).toHaveClass('nbc-switch__control');
  });

  it('forwards event handlers and data attributes to the input', async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    render(<Switch label="X" onFocus={onFocus} data-testid="sw" />);
    await user.tab();
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('sw')).toBe(screen.getByRole('switch', { name: 'X' }));
  });

  it('submits with a form only while on', async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Settings">
        <Switch label="Previews" name="previews" />
      </form>,
    );
    const form = screen.getByRole('form', { name: 'Settings' }) as HTMLFormElement;
    expect(new FormData(form).get('previews')).toBeNull();
    await user.click(screen.getByRole('switch', { name: 'Previews' }));
    expect(new FormData(form).get('previews')).toBe('on');
  });

  it('has no axe violations (off and on)', async () => {
    const { container } = render(
      <div>
        <Switch label="Deploy previews for every pull request" />
        <Switch label="Checked" defaultChecked />
        <Switch label="Auto-renew" description="Renews on the 1st of each month." />
        <Switch label="Small" size="sm" description="Shown on every receipt." defaultChecked />
        <Switch label="Locked" disabled />
        <Switch aria-label="Dark mode" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
