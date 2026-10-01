import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../../test-utils';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('associates the label with the textarea', () => {
    render(<Textarea label="Release notes" id="t1" />);
    const field = screen.getByLabelText('Release notes');
    expect(field).toHaveAttribute('id', 't1');
    expect(field.tagName).toBe('TEXTAREA');
  });

  it('generates an id when none is given', () => {
    render(<Textarea label="Summary" />);
    expect(screen.getByLabelText('Summary').id).toMatch(/^nbc-/);
  });

  it('links the description with aria-describedby', () => {
    render(<Textarea label="Notes" description="Shown on the changelog." />);
    const field = screen.getByLabelText('Notes');
    const id = field.getAttribute('aria-describedby');
    expect(document.getElementById(id!)).toHaveTextContent('Shown on the changelog.');
    expect(field).not.toHaveAttribute('aria-invalid');
  });

  it('error message: aria-invalid, replaces the description, linked, invalid class', () => {
    render(<Textarea label="Notes" description="Shown on the changelog." error="Keep it under 280 characters." />);
    const field = screen.getByLabelText('Notes');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByText('Shown on the changelog.')).not.toBeInTheDocument();
    expect(document.getElementById(field.getAttribute('aria-describedby')!)).toHaveTextContent(
      'Keep it under 280 characters.',
    );
    expect(field).toHaveClass('nbc-textarea--invalid');
  });

  it('error={true}: aria-invalid and the description stays', () => {
    render(<Textarea label="Notes" description="Shown on the changelog." error />);
    const field = screen.getByLabelText('Notes');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveClass('nbc-textarea--invalid');
    expect(screen.getByText('Shown on the changelog.')).toBeInTheDocument();
  });

  it('omits aria-describedby without description or error message', () => {
    render(<Textarea label="Notes" />);
    expect(screen.getByLabelText('Notes')).not.toHaveAttribute('aria-describedby');
  });

  it('keeps the consumer aria-describedby next to the message id', () => {
    render(
      <>
        <p id="extra">Counts toward your plan.</p>
        <Textarea label="Notes" description="Shown on the changelog." aria-describedby="extra" />
      </>,
    );
    const ids = screen.getByLabelText('Notes').getAttribute('aria-describedby')!.split(' ');
    expect(ids).toHaveLength(2);
    expect(ids).toContain('extra');
    expect(document.getElementById(ids[0])).toHaveTextContent('Shown on the changelog.');
  });

  it('keeps the consumer aria-describedby when there is no message', () => {
    render(
      <>
        <p id="extra">Counts toward your plan.</p>
        <Textarea label="Notes" aria-describedby="extra" />
      </>,
    );
    expect(screen.getByLabelText('Notes')).toHaveAttribute('aria-describedby', 'extra');
  });

  it('required: native attribute plus a hidden visual marker', () => {
    render(<Textarea label="Notes" required />);
    expect(screen.getByRole('textbox', { name: 'Notes' })).toBeRequired();
    expect(document.querySelector('.nbc-field__required')).toHaveAttribute('aria-hidden', 'true');
  });

  it('rows defaults to 3 as attribute and style variable', () => {
    render(<Textarea label="Notes" />);
    const field = screen.getByLabelText('Notes');
    expect(field).toHaveAttribute('rows', '3');
    expect(field.style.getPropertyValue('--nbc-textarea-rows')).toBe('3');
  });

  it('custom rows are reflected as attribute and style variable', () => {
    render(<Textarea label="Notes" rows={6} />);
    const field = screen.getByLabelText('Notes');
    expect(field).toHaveAttribute('rows', '6');
    expect(field.style.getPropertyValue('--nbc-textarea-rows')).toBe('6');
  });

  it('merges consumer style; the consumer wins on conflicts', () => {
    render(
      <Textarea
        label="Notes"
        rows={4}
        style={{ color: 'rgb(1, 2, 3)', ['--nbc-textarea-rows' as string]: 9 }}
      />,
    );
    const field = screen.getByLabelText('Notes');
    expect(field.style.color).toBe('rgb(1, 2, 3)');
    expect(field.style.getPropertyValue('--nbc-textarea-rows')).toBe('9');
    expect(field).toHaveAttribute('rows', '4');
  });

  it('autoResize is on by default', () => {
    render(<Textarea label="Notes" />);
    expect(screen.getByLabelText('Notes')).toHaveClass('nbc-textarea--auto');
  });

  it('autoResize={false} removes the auto class', () => {
    render(<Textarea label="Notes" autoResize={false} />);
    expect(screen.getByLabelText('Notes')).not.toHaveClass('nbc-textarea--auto');
  });

  it('does not leak autoResize to the DOM', () => {
    render(<Textarea label="Notes" autoResize={false} />);
    expect(screen.getByLabelText('Notes')).not.toHaveAttribute('autoresize');
    expect(screen.getByLabelText('Notes')).not.toHaveAttribute('autoResize');
  });

  it.each(['sm', 'md', 'lg'] as const)('applies size %s to the textarea and the field', (size) => {
    const { container } = render(<Textarea label="X" size={size} />);
    expect(screen.getByLabelText('X')).toHaveClass('nbc-textarea', `nbc-textarea--${size}`);
    expect(container.firstElementChild).toHaveClass(`nbc-field--${size}`);
  });

  it('defaults to size md', () => {
    const { container } = render(<Textarea label="X" />);
    expect(screen.getByLabelText('X')).toHaveClass('nbc-textarea--md');
    expect(container.firstElementChild).toHaveClass('nbc-field--md');
  });

  it('disabled marks the textarea and the field', () => {
    const { container } = render(<Textarea label="X" disabled />);
    expect(screen.getByLabelText('X')).toBeDisabled();
    expect(screen.getByLabelText('X')).toHaveClass('nbc-textarea--disabled');
    expect(container.firstElementChild).toHaveClass('nbc-field--disabled');
  });

  it('className goes on the wrapper, ref and DOM props on the textarea', () => {
    const ref = createRef<HTMLTextAreaElement>();
    const { container } = render(
      <Textarea label="X" className="mine" ref={ref} placeholder="What changed?" maxLength={280} name="notes" />,
    );
    expect(container.firstElementChild).toHaveClass('nbc-field', 'mine');
    expect(screen.getByLabelText('X')).not.toHaveClass('mine');
    expect(ref.current).toBe(screen.getByLabelText('X'));
    expect(ref.current).toHaveAttribute('placeholder', 'What changed?');
    expect(ref.current).toHaveAttribute('maxlength', '280');
    expect(ref.current).toHaveAttribute('name', 'notes');
  });

  it('is typeable, including line breaks', async () => {
    render(<Textarea label="X" />);
    const field = screen.getByLabelText('X');
    await userEvent.type(field, 'line one{Enter}line two');
    expect(field).toHaveValue('line one\nline two');
  });

  it('works controlled', async () => {
    function Controlled() {
      return <Textarea label="X" value="fixed" onChange={() => {}} />;
    }
    render(<Controlled />);
    await userEvent.type(screen.getByLabelText('X'), 'abc');
    expect(screen.getByLabelText('X')).toHaveValue('fixed');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <Textarea label="Release notes" description="Shown on the changelog." />
        <Textarea label="Summary" error="Keep it under 280 characters." required />
        <Textarea label="Locked" disabled autoResize={false} rows={2} />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
