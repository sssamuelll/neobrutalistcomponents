import { describe, it, expect, vi, afterEach } from 'vitest';
import { createRef, useState } from 'react';
import type { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../../test-utils';
import { Radio, RadioGroup } from './RadioGroup';

function Plans(props: Partial<ComponentProps<typeof RadioGroup>>) {
  return (
    <RadioGroup label="Plan" {...props}>
      <Radio value="hobby" label="Hobby" />
      <Radio value="pro" label="Pro" />
      <Radio value="team" label="Team" />
    </RadioGroup>
  );
}

afterEach(() => vi.restoreAllMocks());

describe('RadioGroup', () => {
  it('renders the legend as the accessible name of the radiogroup', () => {
    render(<Plans />);
    const group = screen.getByRole('radiogroup', { name: 'Plan' });
    expect(group.tagName).toBe('FIELDSET');
    expect(group.querySelector('legend')).toHaveTextContent('Plan');
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('gives every radio one shared generated name', () => {
    render(<Plans />);
    const names = screen.getAllByRole('radio').map((radio) => radio.getAttribute('name'));
    expect(names[0]).toMatch(/^nbc-/);
    expect(new Set(names).size).toBe(1);
  });

  it('uses the name prop for every radio', () => {
    render(<Plans name="plan" />);
    for (const radio of screen.getAllByRole('radio')) expect(radio).toHaveAttribute('name', 'plan');
  });

  it('two groups never share a generated name', () => {
    render(
      <>
        <Plans />
        <RadioGroup label="Cycle">
          <Radio value="monthly" label="Monthly" />
        </RadioGroup>
      </>,
    );
    const [first, , , other] = screen.getAllByRole('radio');
    expect(first.getAttribute('name')).not.toBe(other.getAttribute('name'));
  });

  it('associates each label with its radio', () => {
    render(<Plans />);
    expect(screen.getByLabelText('Pro')).toBe(screen.getByRole('radio', { name: 'Pro' }));
    expect(screen.getByLabelText('Pro').id).toMatch(/^nbc-/);
  });

  describe('uncontrolled', () => {
    it('checks defaultValue; clicking another selects it and calls onValueChange', async () => {
      const onValueChange = vi.fn();
      render(<Plans defaultValue="pro" onValueChange={onValueChange} />);
      expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
      await userEvent.click(screen.getByRole('radio', { name: 'Team' }));
      expect(screen.getByRole('radio', { name: 'Team' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Pro' })).not.toBeChecked();
      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith('team');
    });

    it('starts with nothing selected when there is no defaultValue', () => {
      render(<Plans />);
      for (const radio of screen.getAllByRole('radio')) expect(radio).not.toBeChecked();
    });

    it('does not call onValueChange when the selected radio is clicked again', async () => {
      const onValueChange = vi.fn();
      render(<Plans defaultValue="pro" onValueChange={onValueChange} />);
      await userEvent.click(screen.getByRole('radio', { name: 'Pro' }));
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('clicking the label selects the radio', async () => {
      render(<Plans />);
      await userEvent.click(screen.getByText('Hobby'));
      expect(screen.getByRole('radio', { name: 'Hobby' })).toBeChecked();
    });

    it('arrow keys move the selection through the group', async () => {
      const onValueChange = vi.fn();
      render(<Plans defaultValue="hobby" onValueChange={onValueChange} />);
      await userEvent.tab();
      expect(screen.getByRole('radio', { name: 'Hobby' })).toHaveFocus();
      await userEvent.keyboard('{ArrowDown}');
      expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
      expect(onValueChange).toHaveBeenLastCalledWith('pro');
    });
  });

  describe('controlled', () => {
    it('value drives checked; a click reports the change but selection follows the prop', async () => {
      const onValueChange = vi.fn();
      render(<Plans value="hobby" onValueChange={onValueChange} />);
      expect(screen.getByRole('radio', { name: 'Hobby' })).toBeChecked();
      await userEvent.click(screen.getByRole('radio', { name: 'Team' }));
      expect(onValueChange).toHaveBeenCalledWith('team');
      expect(screen.getByRole('radio', { name: 'Hobby' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Team' })).not.toBeChecked();
    });

    it('follows the parent when it updates the value', async () => {
      function Controlled() {
        const [value, setValue] = useState('hobby');
        return (
          <>
            <Plans value={value} onValueChange={setValue} />
            <output>{value}</output>
          </>
        );
      }
      render(<Controlled />);
      await userEvent.click(screen.getByRole('radio', { name: 'Team' }));
      expect(screen.getByRole('radio', { name: 'Team' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Hobby' })).not.toBeChecked();
      expect(screen.getByRole('status')).toHaveTextContent('team');
    });

    it('an empty string is a controlled "nothing selected"', () => {
      render(<Plans value="" />);
      for (const radio of screen.getAllByRole('radio')) expect(radio).not.toBeChecked();
    });
  });

  describe('Radio', () => {
    it('links its description with aria-describedby', () => {
      render(
        <RadioGroup label="Plan">
          <Radio value="pro" label="Pro" description="Unlimited projects, $19 per month." />
          <Radio value="hobby" label="Hobby" />
        </RadioGroup>,
      );
      const pro = screen.getByRole('radio', { name: 'Pro' });
      const id = pro.getAttribute('aria-describedby');
      expect(document.getElementById(id!)).toHaveTextContent('Unlimited projects, $19 per month.');
      expect(screen.getByRole('radio', { name: 'Hobby' })).not.toHaveAttribute('aria-describedby');
    });

    it('keeps a consumer aria-describedby next to its own description', () => {
      render(
        <RadioGroup label="Plan">
          <Radio value="pro" label="Pro" description="Unlimited projects." aria-describedby="extra" />
        </RadioGroup>,
      );
      const ids = screen.getByRole('radio').getAttribute('aria-describedby')!.split(' ');
      expect(ids).toHaveLength(2);
      expect(ids[1]).toBe('extra');
      expect(document.getElementById(ids[0])).toHaveTextContent('Unlimited projects.');
    });

    it('calls its own onChange after the group state updated', async () => {
      const calls: string[] = [];
      render(
        <RadioGroup label="Plan" onValueChange={(v) => calls.push(`group:${v}`)}>
          <Radio value="pro" label="Pro" onChange={() => calls.push('radio')} />
        </RadioGroup>,
      );
      await userEvent.click(screen.getByRole('radio'));
      expect(calls).toEqual(['group:pro', 'radio']);
    });

    it('disabled radio is disabled, marked, and cannot be selected', async () => {
      const { container } = render(
        <RadioGroup label="Plan">
          <Radio value="hobby" label="Hobby" />
          <Radio value="team" label="Team" disabled />
        </RadioGroup>,
      );
      const team = screen.getByRole('radio', { name: 'Team' });
      expect(team).toBeDisabled();
      expect(screen.getByRole('radio', { name: 'Hobby' })).toBeEnabled();
      expect(container.querySelectorAll('.nbc-radio--disabled')).toHaveLength(1);
      await userEvent.click(team);
      expect(team).not.toBeChecked();
    });

    it('className goes on the wrapper; ref and DOM props go on the input', () => {
      const ref = createRef<HTMLInputElement>();
      render(
        <RadioGroup label="Plan">
          <Radio value="pro" label="Pro" className="mine" ref={ref} data-testid="pro-input" />
        </RadioGroup>,
      );
      const input = screen.getByRole('radio', { name: 'Pro' });
      expect(ref.current).toBe(input);
      expect(input).toHaveAttribute('data-testid', 'pro-input');
      expect(input).toHaveAttribute('value', 'pro');
      expect(input).toHaveClass('nbc-radio__control');
      expect(input.closest('.nbc-radio')).toHaveClass('mine');
    });

    it('throws a clear error outside a RadioGroup', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => render(<Radio value="pro" label="Pro" />)).toThrow('Radio must be used inside RadioGroup');
    });
  });

  describe('group state', () => {
    it('required: native attribute on every radio, aria-required and a hidden marker on the group', () => {
      render(<Plans required />);
      for (const radio of screen.getAllByRole('radio')) expect(radio).toBeRequired();
      const group = screen.getByRole('radiogroup', { name: 'Plan' });
      expect(group).toHaveAttribute('aria-required', 'true');
      const marker = group.querySelector('.nbc-radio-group__required');
      expect(marker).toHaveAttribute('aria-hidden', 'true');
      expect(marker).toHaveTextContent('*');
    });

    it('not required: no aria-required, no marker', () => {
      render(<Plans />);
      expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-required');
      expect(document.querySelector('.nbc-radio-group__required')).not.toBeInTheDocument();
    });

    it('disabled disables every radio through the fieldset', () => {
      const { container } = render(<Plans disabled defaultValue="pro" />);
      expect(screen.getByRole('radiogroup')).toBeDisabled();
      for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled();
      expect(container.querySelectorAll('.nbc-radio--disabled')).toHaveLength(3);
    });

    it('links the description with aria-describedby on the group', () => {
      render(<Plans description="You can switch any time." />);
      const group = screen.getByRole('radiogroup', { name: 'Plan' });
      expect(document.getElementById(group.getAttribute('aria-describedby')!)).toHaveTextContent(
        'You can switch any time.',
      );
      expect(group).not.toHaveAttribute('aria-invalid');
    });

    it('error message: aria-invalid, replaces the description, linked on the group', () => {
      const { container } = render(<Plans description="You can switch any time." error="Pick a plan to continue." />);
      const group = screen.getByRole('radiogroup', { name: 'Plan' });
      expect(group).toHaveAttribute('aria-invalid', 'true');
      expect(screen.queryByText('You can switch any time.')).not.toBeInTheDocument();
      const message = document.getElementById(group.getAttribute('aria-describedby')!)!;
      expect(message).toHaveTextContent('Pick a plan to continue.');
      expect(message).toHaveClass('nbc-radio-group__message', 'nbc-radio-group__message--error');
      expect(container.querySelector('.nbc-radio-group')).toHaveClass('nbc-radio-group--invalid');
    });

    it('error={true}: aria-invalid and the description stays', () => {
      render(<Plans description="You can switch any time." error />);
      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByText('You can switch any time.')).not.toHaveClass('nbc-radio-group__message--error');
    });

    it('keeps a consumer aria-describedby next to the message id', () => {
      render(<Plans description="Billed monthly." aria-describedby="extra" />);
      const ids = screen.getByRole('radiogroup').getAttribute('aria-describedby')!.split(' ');
      expect(ids).toHaveLength(2);
      expect(ids[1]).toBe('extra');
    });

    it('omits aria-describedby without a message', () => {
      render(<Plans />);
      expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('API surface', () => {
    it('applies orientation and size classes (defaults: vertical, md)', () => {
      const { container, rerender } = render(<Plans />);
      const group = container.querySelector('fieldset')!;
      expect(group).toHaveClass('nbc-radio-group', 'nbc-radio-group--vertical', 'nbc-radio-group--md');
      rerender(<Plans orientation="horizontal" size="sm" />);
      expect(group).toHaveClass('nbc-radio-group--horizontal', 'nbc-radio-group--sm');
      expect(group).not.toHaveClass('nbc-radio-group--vertical');
    });

    it('className, ref and DOM props go on the fieldset', () => {
      const ref = createRef<HTMLFieldSetElement>();
      render(<Plans className="mine" ref={ref} id="plan-picker" data-testid="picker" />);
      const group = screen.getByRole('radiogroup');
      expect(group).toHaveClass('nbc-radio-group', 'mine');
      expect(ref.current).toBe(group);
      expect(group).toHaveAttribute('id', 'plan-picker');
      expect(group).toHaveAttribute('data-testid', 'picker');
    });

    it('works without a visible label when an aria-label is given', () => {
      render(
        <RadioGroup aria-label="Billing cycle">
          <Radio value="monthly" label="Monthly" />
        </RadioGroup>,
      );
      expect(screen.getByRole('radiogroup', { name: 'Billing cycle' })).toBeInTheDocument();
      expect(document.querySelector('legend')).not.toBeInTheDocument();
    });

    it('submits the selected value with its form', async () => {
      render(
        <form aria-label="Checkout">
          <Plans name="plan" defaultValue="hobby" />
        </form>,
      );
      await userEvent.click(screen.getByRole('radio', { name: 'Team' }));
      const data = new FormData(screen.getByRole('form'));
      expect(data.get('plan')).toBe('team');
    });
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <RadioGroup label="Plan" description="Switch any time." defaultValue="pro" required>
          <Radio value="hobby" label="Hobby" description="One project, community support." />
          <Radio value="pro" label="Pro" description="Unlimited projects." />
          <Radio value="team" label="Team" disabled />
        </RadioGroup>
        <RadioGroup label="Billing cycle" orientation="horizontal" size="sm" error="Choose a billing cycle.">
          <Radio value="monthly" label="Monthly" />
          <Radio value="yearly" label="Yearly" />
        </RadioGroup>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
