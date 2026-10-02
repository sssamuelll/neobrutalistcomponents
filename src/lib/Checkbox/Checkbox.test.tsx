import { describe, it, expect, vi } from 'vitest';
import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../../test-utils';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders a native checkbox named by its label', () => {
    render(<Checkbox label="Email me when a deploy fails" />);
    const box = screen.getByRole('checkbox', { name: 'Email me when a deploy fails' });
    expect(box.tagName).toBe('INPUT');
    expect(box).toHaveAttribute('type', 'checkbox');
    expect(box).not.toBeChecked();
  });

  it('generates an id when none is given and keeps a given one', () => {
    const { rerender } = render(<Checkbox label="Auto" />);
    expect(screen.getByLabelText('Auto').id).toMatch(/^nbc-/);
    rerender(<Checkbox label="Auto" id="c1" />);
    expect(screen.getByLabelText('Auto')).toHaveAttribute('id', 'c1');
  });

  it('toggles by clicking the label', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Subscribe" />);
    const box = screen.getByLabelText('Subscribe');
    await user.click(screen.getByText('Subscribe'));
    expect(box).toBeChecked();
    await user.click(screen.getByText('Subscribe'));
    expect(box).not.toBeChecked();
  });

  it('toggles by clicking the control directly and by keyboard', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Subscribe" />);
    const box = screen.getByLabelText('Subscribe');
    await user.click(box);
    expect(box).toBeChecked();
    box.focus();
    await user.keyboard(' ');
    expect(box).not.toBeChecked();
  });

  it('works controlled: checked + onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<Checkbox label="Notify" checked={false} onChange={onChange} />);
    await user.click(screen.getByLabelText('Notify'));
    expect(onChange).toHaveBeenCalledTimes(1);
    // The parent did not accept the change: still unchecked.
    expect(screen.getByLabelText('Notify')).not.toBeChecked();
    rerender(<Checkbox label="Notify" checked onChange={onChange} />);
    expect(screen.getByLabelText('Notify')).toBeChecked();
  });

  it('supports defaultChecked', () => {
    render(<Checkbox label="Notify" defaultChecked />);
    expect(screen.getByLabelText('Notify')).toBeChecked();
  });

  describe('indeterminate', () => {
    it('sets the DOM property and exposes the mixed state', () => {
      render(<Checkbox label="All channels" indeterminate />);
      const box = screen.getByLabelText('All channels') as HTMLInputElement;
      expect(box.indeterminate).toBe(true);
      expect(box).toBePartiallyChecked();
    });

    it('updates when the prop changes', () => {
      const { rerender } = render(<Checkbox label="All" />);
      const box = screen.getByLabelText('All') as HTMLInputElement;
      expect(box.indeterminate).toBe(false);
      rerender(<Checkbox label="All" indeterminate />);
      expect(box.indeterminate).toBe(true);
      rerender(<Checkbox label="All" indeterminate={false} />);
      expect(box.indeterminate).toBe(false);
    });

    it('drives a select-all over a controlled group', async () => {
      const user = userEvent.setup();
      function Group() {
        const [on, setOn] = useState({ a: true, b: false });
        const all = on.a && on.b;
        const some = on.a || on.b;
        return (
          <div>
            <Checkbox
              label="All"
              checked={all}
              indeterminate={some && !all}
              onChange={(e) => setOn({ a: e.target.checked, b: e.target.checked })}
            />
            <Checkbox label="A" checked={on.a} onChange={(e) => setOn({ ...on, a: e.target.checked })} />
            <Checkbox label="B" checked={on.b} onChange={(e) => setOn({ ...on, b: e.target.checked })} />
          </div>
        );
      }
      render(<Group />);
      const all = screen.getByLabelText('All') as HTMLInputElement;
      expect(all.indeterminate).toBe(true);
      await user.click(screen.getByLabelText('B'));
      expect(all.indeterminate).toBe(false);
      expect(all).toBeChecked();
      await user.click(all);
      expect(screen.getByLabelText('A')).not.toBeChecked();
      expect(screen.getByLabelText('B')).not.toBeChecked();
      expect(all.indeterminate).toBe(false);
    });
  });

  it('links the description with aria-describedby', () => {
    render(<Checkbox label="Terms" description="You can withdraw consent at any time." />);
    const box = screen.getByLabelText('Terms');
    const message = document.getElementById(box.getAttribute('aria-describedby')!);
    expect(message).toHaveTextContent('You can withdraw consent at any time.');
    expect(message).toHaveClass('nbc-checkbox__message');
    expect(message).not.toHaveClass('nbc-checkbox__message--error');
    expect(box).not.toHaveAttribute('aria-invalid');
  });

  it('omits aria-describedby without a message', () => {
    render(<Checkbox label="Terms" />);
    expect(screen.getByLabelText('Terms')).not.toHaveAttribute('aria-describedby');
  });

  it('merges a consumer aria-describedby with the message id', () => {
    render(
      <>
        <p id="extra">Billing changes apply next cycle.</p>
        <Checkbox label="Terms" description="Read the terms." aria-describedby="extra" />
      </>,
    );
    const ids = screen.getByLabelText('Terms').getAttribute('aria-describedby')!.split(' ');
    expect(ids).toHaveLength(2);
    expect(ids).toContain('extra');
    expect(document.getElementById(ids.find((i) => i !== 'extra')!)).toHaveTextContent('Read the terms.');
  });

  it('keeps a consumer aria-describedby alone when there is no message', () => {
    render(
      <>
        <p id="extra">Extra.</p>
        <Checkbox label="Terms" aria-describedby="extra" />
      </>,
    );
    expect(screen.getByLabelText('Terms')).toHaveAttribute('aria-describedby', 'extra');
  });

  it('error message: aria-invalid, replaces the description, marks the root', () => {
    const { container } = render(
      <Checkbox label="Terms" description="Read them first." error="Accept the terms to continue." />,
    );
    const box = screen.getByLabelText('Terms');
    expect(box).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByText('Read them first.')).not.toBeInTheDocument();
    const message = document.getElementById(box.getAttribute('aria-describedby')!);
    expect(message).toHaveTextContent('Accept the terms to continue.');
    expect(message).toHaveClass('nbc-checkbox__message--error');
    expect(container.firstElementChild).toHaveClass('nbc-checkbox--invalid');
  });

  it('error={true}: aria-invalid and the description stays', () => {
    const { container } = render(<Checkbox label="Terms" description="Read them first." error />);
    expect(screen.getByLabelText('Terms')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Read them first.')).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass('nbc-checkbox--invalid');
  });

  it('required: native attribute plus an aria-hidden marker', () => {
    const { container } = render(<Checkbox label="Terms" required />);
    expect(screen.getByRole('checkbox', { name: 'Terms' })).toBeRequired();
    const marker = container.querySelector('.nbc-checkbox__required');
    expect(marker).toHaveAttribute('aria-hidden', 'true');
    expect(marker).toHaveTextContent('*');
  });

  it('no marker when not required', () => {
    const { container } = render(<Checkbox label="Terms" />);
    expect(container.querySelector('.nbc-checkbox__required')).not.toBeInTheDocument();
  });

  it('disabled: native, marks the root, cannot be toggled', async () => {
    const user = userEvent.setup();
    const { container } = render(<Checkbox label="Locked" disabled />);
    const box = screen.getByLabelText('Locked');
    expect(box).toBeDisabled();
    expect(container.firstElementChild).toHaveClass('nbc-checkbox--disabled');
    await user.click(box);
    expect(box).not.toBeChecked();
  });

  it.each(['sm', 'md'] as const)('applies size %s', (size) => {
    const { container } = render(<Checkbox label="X" size={size} />);
    expect(container.firstElementChild).toHaveClass('nbc-checkbox', `nbc-checkbox--${size}`);
  });

  it('defaults to size md', () => {
    const { container } = render(<Checkbox label="X" />);
    expect(container.firstElementChild).toHaveClass('nbc-checkbox--md');
  });

  it('has the documented DOM structure', () => {
    const { container } = render(<Checkbox label="X" description="Y" />);
    const root = container.firstElementChild!;
    const box = root.querySelector(':scope > .nbc-checkbox__box')!;
    expect(box.querySelector(':scope > input.nbc-checkbox__control')).toBeInTheDocument();
    expect(box.querySelector('svg.nbc-checkbox__check')).toHaveAttribute('aria-hidden', 'true');
    expect(box.querySelector('svg.nbc-checkbox__dash')).toHaveAttribute('aria-hidden', 'true');
    const text = root.querySelector(':scope > .nbc-checkbox__text')!;
    expect(text.querySelector('label.nbc-checkbox__label')).toBeInTheDocument();
    expect(text.querySelector('p.nbc-checkbox__message')).toBeInTheDocument();
  });

  it('omits the text block when there is neither label nor message', () => {
    const { container } = render(<Checkbox aria-label="Select row 3" />);
    expect(container.querySelector('.nbc-checkbox__text')).not.toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Select row 3' })).toBeInTheDocument();
  });

  it('renders the text block for a message without a label', () => {
    const { container } = render(<Checkbox aria-label="Row" description="Selected rows are archived." />);
    expect(container.querySelector('.nbc-checkbox__label')).not.toBeInTheDocument();
    expect(screen.getByText('Selected rows are archived.')).toBeInTheDocument();
  });

  it('className goes on the root; ref and DOM props on the input', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<Checkbox label="X" className="mine" ref={ref} name="alerts" value="deploy" />);
    expect(container.firstElementChild).toHaveClass('nbc-checkbox', 'mine');
    expect(ref.current).toBe(screen.getByLabelText('X'));
    expect(ref.current).toHaveAttribute('name', 'alerts');
    expect(ref.current).toHaveAttribute('value', 'deploy');
    expect(ref.current).toHaveClass('nbc-checkbox__control');
  });

  it('the ref still works together with indeterminate (object ref)', () => {
    const ref = createRef<HTMLInputElement>();
    const { rerender } = render(<Checkbox label="X" ref={ref} indeterminate />);
    expect(ref.current).toBe(screen.getByLabelText('X'));
    expect(ref.current!.indeterminate).toBe(true);
    rerender(<Checkbox label="X" ref={ref} indeterminate={false} />);
    expect(ref.current).toBe(screen.getByLabelText('X'));
    expect(ref.current!.indeterminate).toBe(false);
  });

  it('a callback ref receives the node and is not churned by indeterminate changes', () => {
    const ref = vi.fn();
    const { rerender } = render(<Checkbox label="X" ref={ref} />);
    const node = screen.getByLabelText('X');
    expect(ref).toHaveBeenCalledWith(node);
    const calls = ref.mock.calls.length;
    rerender(<Checkbox label="X" ref={ref} indeterminate />);
    rerender(<Checkbox label="X" ref={ref} indeterminate={false} />);
    expect(ref).toHaveBeenCalledTimes(calls);
    expect((node as HTMLInputElement).indeterminate).toBe(false);
  });

  it('forwards event handlers and data attributes to the input', async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    render(<Checkbox label="X" onFocus={onFocus} data-testid="cb" />);
    await user.tab();
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('cb')).toBe(screen.getByLabelText('X'));
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <Checkbox label="Email me when a deploy fails" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Mixed" indeterminate />
        <Checkbox label="Terms" description="You can withdraw consent at any time." required />
        <Checkbox label="Accept" error="Accept the terms to continue." />
        <Checkbox label="Small" size="sm" disabled />
        <Checkbox aria-label="Select row" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
