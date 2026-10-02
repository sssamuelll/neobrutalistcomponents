import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../../test-utils';
import { Select } from './Select';

const regions = [
  <option key="eu" value="eu">
    Frankfurt (EU)
  </option>,
  <option key="us" value="us">
    Virginia (US)
  </option>,
  <option key="ap" value="ap">
    Singapore (AP)
  </option>,
];

describe('Select', () => {
  it('renders the native options it is given', () => {
    render(<Select label="Region">{regions}</Select>);
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Frankfurt (EU)',
      'Virginia (US)',
      'Singapore (AP)',
    ]);
  });

  it('renders a native <select> with a combobox role and no multiple/size leak', () => {
    render(
      <Select label="Region" size="lg">
        {regions}
      </Select>,
    );
    const select = screen.getByRole('combobox', { name: 'Region' });
    expect(select.tagName).toBe('SELECT');
    expect(select).not.toHaveAttribute('multiple');
    expect(select).not.toHaveAttribute('size');
  });

  it('associates the label with the select', () => {
    render(
      <Select label="Region" id="r1">
        {regions}
      </Select>,
    );
    expect(screen.getByLabelText('Region')).toHaveAttribute('id', 'r1');
  });

  it('generates an id when none is given', () => {
    render(<Select label="Region">{regions}</Select>);
    expect(screen.getByLabelText('Region').id).toMatch(/^nbc-/);
  });

  it('calls onChange and updates the value when an option is picked', async () => {
    const onChange = vi.fn();
    render(
      <Select label="Region" defaultValue="eu" onChange={onChange}>
        {regions}
      </Select>,
    );
    const select = screen.getByLabelText('Region');
    expect(select).toHaveValue('eu');
    await userEvent.selectOptions(select, 'ap');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(select).toHaveValue('ap');
  });

  it('selects by visible option text too', async () => {
    render(<Select label="Region">{regions}</Select>);
    await userEvent.selectOptions(screen.getByLabelText('Region'), 'Virginia (US)');
    expect(screen.getByLabelText('Region')).toHaveValue('us');
  });

  it('follows a controlled value', () => {
    const { rerender } = render(
      <Select label="Region" value="us" onChange={() => {}}>
        {regions}
      </Select>,
    );
    expect(screen.getByLabelText('Region')).toHaveValue('us');
    rerender(
      <Select label="Region" value="ap" onChange={() => {}}>
        {regions}
      </Select>,
    );
    expect(screen.getByLabelText('Region')).toHaveValue('ap');
  });

  describe('placeholder', () => {
    it('renders a first option that is empty, disabled and initially selected', () => {
      render(
        <Select label="Region" placeholder="Choose a region">
          {regions}
        </Select>,
      );
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(4);
      expect(options[0]).toHaveTextContent('Choose a region');
      expect(options[0]).toHaveValue('');
      expect(options[0]).toBeDisabled();
      expect((options[0] as HTMLOptionElement).selected).toBe(true);
      expect(screen.getByLabelText('Region')).toHaveValue('');
    });

    it('is not selected when a defaultValue is given', () => {
      render(
        <Select label="Region" placeholder="Choose a region" defaultValue="us">
          {regions}
        </Select>,
      );
      const placeholder = screen.getByRole('option', { name: 'Choose a region' }) as HTMLOptionElement;
      expect(placeholder.selected).toBe(false);
      expect(screen.getByLabelText('Region')).toHaveValue('us');
    });

    it('is not selected when a controlled value is given', () => {
      render(
        <Select label="Region" placeholder="Choose a region" value="ap" onChange={() => {}}>
          {regions}
        </Select>,
      );
      expect((screen.getByRole('option', { name: 'Choose a region' }) as HTMLOptionElement).selected).toBe(false);
      expect(screen.getByLabelText('Region')).toHaveValue('ap');
    });

    it('cannot be picked back once a real option is chosen', async () => {
      render(
        <Select label="Region" placeholder="Choose a region">
          {regions}
        </Select>,
      );
      await userEvent.selectOptions(screen.getByLabelText('Region'), 'eu');
      expect(screen.getByLabelText('Region')).toHaveValue('eu');
      expect(screen.getByRole('option', { name: 'Choose a region' })).toBeDisabled();
    });

    it('keeps native required validation: unanswered until a real option is picked', async () => {
      render(
        <Select label="Region" placeholder="Choose a region" required>
          {regions}
        </Select>,
      );
      const select = screen.getByRole('combobox', { name: 'Region' }) as HTMLSelectElement;
      expect(select.validity.valueMissing).toBe(true);
      await userEvent.selectOptions(select, 'us');
      expect(select.validity.valueMissing).toBe(false);
    });

    it('is not forwarded to the DOM as an attribute', () => {
      render(
        <Select label="Region" placeholder="Choose a region">
          {regions}
        </Select>,
      );
      expect(screen.getByLabelText('Region')).not.toHaveAttribute('placeholder');
    });

    it('renders no extra option without a placeholder', () => {
      render(<Select label="Region">{regions}</Select>);
      expect(screen.getAllByRole('option')).toHaveLength(3);
    });
  });

  it('renders optgroups as labelled groups', () => {
    render(
      <Select label="Billing cycle">
        <optgroup label="Monthly">
          <option value="m-1">Pay monthly</option>
        </optgroup>
        <optgroup label="Annual">
          <option value="y-1">Pay yearly</option>
        </optgroup>
      </Select>,
    );
    expect(screen.getByRole('group', { name: 'Monthly' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Annual' })).toBeInTheDocument();
  });

  describe('Field API (parity with Input)', () => {
    it('links the description with aria-describedby', () => {
      render(
        <Select label="Region" description="Where your project runs.">
          {regions}
        </Select>,
      );
      const select = screen.getByLabelText('Region');
      const id = select.getAttribute('aria-describedby');
      expect(document.getElementById(id!)).toHaveTextContent('Where your project runs.');
      expect(select).not.toHaveAttribute('aria-invalid');
    });

    it('error message: aria-invalid, replaces the description, linked', () => {
      const { container } = render(
        <Select label="Region" description="Where your project runs." error="Pick a region to continue.">
          {regions}
        </Select>,
      );
      const select = screen.getByLabelText('Region');
      expect(select).toHaveAttribute('aria-invalid', 'true');
      expect(screen.queryByText('Where your project runs.')).not.toBeInTheDocument();
      expect(document.getElementById(select.getAttribute('aria-describedby')!)).toHaveTextContent(
        'Pick a region to continue.',
      );
      expect(container.querySelector('.nbc-select')).toHaveClass('nbc-select--invalid');
    });

    it('error={true}: aria-invalid and the description stays', () => {
      render(
        <Select label="Region" description="Where your project runs." error>
          {regions}
        </Select>,
      );
      expect(screen.getByLabelText('Region')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByText('Where your project runs.')).toBeInTheDocument();
    });

    it('omits aria-describedby without description or error message', () => {
      render(<Select label="Region">{regions}</Select>);
      expect(screen.getByLabelText('Region')).not.toHaveAttribute('aria-describedby');
    });

    it('keeps the consumer aria-describedby next to the message id', () => {
      render(
        <Select label="Region" description="Where your project runs." aria-describedby="extra-hint">
          {regions}
        </Select>,
      );
      const ids = screen.getByLabelText('Region').getAttribute('aria-describedby')!.split(' ');
      expect(ids).toContain('extra-hint');
      expect(ids).toHaveLength(2);
      expect(document.getElementById(ids.find((i) => i !== 'extra-hint')!)).toHaveTextContent(
        'Where your project runs.',
      );
    });

    it('keeps only the consumer aria-describedby when there is no message', () => {
      render(
        <Select label="Region" aria-describedby="extra-hint">
          {regions}
        </Select>,
      );
      expect(screen.getByLabelText('Region')).toHaveAttribute('aria-describedby', 'extra-hint');
    });

    it('required: native attribute plus a hidden visual marker', () => {
      render(
        <Select label="Region" required>
          {regions}
        </Select>,
      );
      expect(screen.getByRole('combobox', { name: 'Region' })).toBeRequired();
      expect(document.querySelector('.nbc-field__required')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it.each(['sm', 'md', 'lg'] as const)('applies size %s to the box and the field', (size) => {
    const { container } = render(
      <Select label="X" size={size}>
        {regions}
      </Select>,
    );
    expect(container.querySelector('.nbc-select')).toHaveClass(`nbc-select--${size}`);
    expect(container.firstElementChild).toHaveClass(`nbc-field--${size}`);
  });

  it('defaults to size md', () => {
    const { container } = render(<Select label="X">{regions}</Select>);
    expect(container.querySelector('.nbc-select')).toHaveClass('nbc-select--md');
  });

  it('disabled marks the box and the select', () => {
    const { container } = render(
      <Select label="X" disabled>
        {regions}
      </Select>,
    );
    expect(screen.getByLabelText('X')).toBeDisabled();
    expect(container.querySelector('.nbc-select')).toHaveClass('nbc-select--disabled');
    expect(container.firstElementChild).toHaveClass('nbc-field--disabled');
  });

  it('draws a decorative chevron after the select, hidden from assistive tech', () => {
    const { container } = render(<Select label="X">{regions}</Select>);
    const box = container.querySelector('.nbc-select')!;
    const chevron = box.querySelector('.nbc-select__chevron');
    expect(chevron).toHaveAttribute('aria-hidden', 'true');
    expect(box.lastElementChild).toBe(chevron);
    expect(box.firstElementChild).toBe(screen.getByLabelText('X'));
  });

  it('className goes on the wrapper, ref and DOM props on the select', () => {
    const ref = createRef<HTMLSelectElement>();
    const { container } = render(
      <Select label="X" className="mine" ref={ref} name="region" data-testid="sel">
        {regions}
      </Select>,
    );
    expect(container.firstElementChild).toHaveClass('nbc-field', 'mine');
    expect(ref.current).toBe(screen.getByLabelText('X'));
    expect(ref.current).toHaveAttribute('name', 'region');
    expect(ref.current).toHaveAttribute('data-testid', 'sel');
    expect(ref.current).toHaveClass('nbc-select__control');
  });

  it('submits its value with a form', async () => {
    const onSubmit = vi.fn((e: { preventDefault: () => void }) => e.preventDefault());
    render(
      <form onSubmit={onSubmit} aria-label="Deploy">
        <Select label="Region" name="region" placeholder="Choose a region">
          {regions}
        </Select>
        <button type="submit">Deploy</button>
      </form>,
    );
    await userEvent.selectOptions(screen.getByLabelText('Region'), 'ap');
    const form = screen.getByRole('form', { name: 'Deploy' }) as HTMLFormElement;
    expect(new FormData(form).get('region')).toBe('ap');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <Select label="Region" description="Where your project runs." placeholder="Choose a region">
          {regions}
        </Select>
        <Select label="Billing cycle" error="Pick a billing cycle." required>
          <optgroup label="Monthly">
            <option value="m-1">Pay monthly</option>
          </optgroup>
          <optgroup label="Annual">
            <option value="y-1">Pay yearly</option>
          </optgroup>
        </Select>
        <Select label="Plan" disabled defaultValue="pro">
          <option value="pro">Pro</option>
        </Select>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
