import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from '../../test-utils';
import { Progress } from './Progress';
import type { ProgressSize, ProgressVariant } from './Progress';

const VARIANTS: ProgressVariant[] = ['primary', 'success', 'warning', 'danger'];
const SIZES: ProgressSize[] = ['sm', 'md', 'lg'];

const bar = (container: HTMLElement) => container.querySelector<HTMLElement>('.nbc-progress__bar')!;
const barValue = (container: HTMLElement) => bar(container).style.getPropertyValue('--nbc-progress-value');

describe('Progress', () => {
  describe('determinate', () => {
    it('is a progressbar with min, max, now and a percent value text', () => {
      render(<Progress value={42} aria-label="Upload" />);
      const progress = screen.getByRole('progressbar', { name: 'Upload' });
      expect(progress).toHaveAttribute('aria-valuemin', '0');
      expect(progress).toHaveAttribute('aria-valuemax', '100');
      expect(progress).toHaveAttribute('aria-valuenow', '42');
      expect(progress).toHaveAttribute('aria-valuetext', '42%');
      expect(progress).not.toHaveClass('nbc-progress--indeterminate');
    });

    it('feeds the bar width through --nbc-progress-value', () => {
      const { container } = render(<Progress value={42} aria-label="Upload" />);
      expect(barValue(container)).toBe('42%');
    });

    it('clamps a value above max to max', () => {
      const { container } = render(<Progress value={140} aria-label="Quota" />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '100');
      expect(progress).toHaveAttribute('aria-valuetext', '100%');
      expect(barValue(container)).toBe('100%');
    });

    it('clamps a negative value to 0', () => {
      const { container } = render(<Progress value={-20} aria-label="Quota" />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '0');
      expect(progress).toHaveAttribute('aria-valuetext', '0%');
      expect(barValue(container)).toBe('0%');
    });

    it('renders an empty bar at value 0 (still determinate)', () => {
      render(<Progress value={0} aria-label="Queued" />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '0');
      expect(progress).not.toHaveClass('nbc-progress--indeterminate');
    });

    it('supports a custom max: 3 of 4 is 75%', () => {
      const { container } = render(<Progress value={3} max={4} aria-label="Files" />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuemax', '4');
      expect(progress).toHaveAttribute('aria-valuenow', '3');
      expect(progress).toHaveAttribute('aria-valuetext', '75%');
      expect(barValue(container)).toBe('75%');
    });

    it('rounds the percent to a whole number', () => {
      const { container, rerender } = render(<Progress value={1} max={3} aria-label="Steps" />);
      expect(barValue(container)).toBe('33%');
      rerender(<Progress value={2} max={3} aria-label="Steps" />);
      expect(barValue(container)).toBe('67%');
    });

    it.each([0, -5])('treats max=%s as 100', (max) => {
      const { container } = render(<Progress value={25} max={max} aria-label="Build" />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuemax', '100');
      expect(progress).toHaveAttribute('aria-valuetext', '25%');
      expect(barValue(container)).toBe('25%');
    });

    it('lets the consumer replace the value text with something more meaningful', () => {
      render(<Progress value={3} max={4} aria-label="Files" aria-valuetext="3 of 4 files uploaded" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '3 of 4 files uploaded');
    });
  });

  describe('indeterminate', () => {
    it.each([undefined, null])('is indeterminate when value is %s', (value) => {
      const { container } = render(<Progress value={value} aria-label="Provisioning" />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveClass('nbc-progress--indeterminate');
      expect(progress).not.toHaveAttribute('aria-valuenow');
      expect(progress).not.toHaveAttribute('aria-valuetext');
      expect(progress).toHaveAttribute('aria-valuemin', '0');
      expect(progress).toHaveAttribute('aria-valuemax', '100');
      expect(barValue(container)).toBe('');
    });

    it('never shows a percent, even with showValue', () => {
      render(<Progress label="Provisioning database" showValue />);
      expect(screen.queryByText(/%/)).not.toBeInTheDocument();
    });
  });

  describe('label and value', () => {
    it('names the progressbar from the visible label (aria-labelledby)', () => {
      render(<Progress value={42} label="Uploading" />);
      const progress = screen.getByRole('progressbar', { name: 'Uploading' });
      const label = screen.getByText('Uploading');
      expect(label).toHaveClass('nbc-progress__label');
      expect(progress).toHaveAttribute('aria-labelledby', label.id);
      expect(label.id).not.toBe('');
    });

    it('accepts rich content as the label', () => {
      render(
        <Progress
          value={10}
          label={
            <>
              Syncing <em>invoices</em>
            </>
          }
        />,
      );
      expect(screen.getByRole('progressbar', { name: 'Syncing invoices' })).toBeInTheDocument();
    });

    it('gives each progressbar its own label id', () => {
      render(
        <>
          <Progress value={10} label="Storage" />
          <Progress value={20} label="Seats" />
        </>,
      );
      const [storage, seats] = screen.getAllByRole('progressbar');
      expect(storage.getAttribute('aria-labelledby')).not.toBe(seats.getAttribute('aria-labelledby'));
      expect(storage).toHaveAccessibleName('Storage');
      expect(seats).toHaveAccessibleName('Seats');
    });

    it('derives the label id from a consumer id', () => {
      render(<Progress id="upload" value={10} label="Uploading" />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('id', 'upload');
      expect(progress.getAttribute('aria-labelledby')).toBe('upload-label');
      expect(screen.getByText('Uploading')).toHaveAttribute('id', 'upload-label');
    });

    it('shows the percent at the end of the header with showValue', () => {
      render(<Progress value={42} label="Uploading" showValue />);
      const value = screen.getByText('42%');
      expect(value).toHaveClass('nbc-progress__value');
      expect(value.closest('.nbc-progress__header')).not.toBeNull();
    });

    it('shows the value without a label too', () => {
      render(<Progress value={7} showValue aria-label="Disk" />);
      expect(screen.getByText('7%')).toBeInTheDocument();
      expect(screen.getByRole('progressbar', { name: 'Disk' })).toBeInTheDocument();
    });

    it('does not show the value by default', () => {
      render(<Progress value={42} label="Uploading" />);
      expect(screen.queryByText('42%')).not.toBeInTheDocument();
    });

    it('renders no header without a label or showValue', () => {
      const { container } = render(<Progress value={42} aria-label="Uploading" />);
      expect(container.querySelector('.nbc-progress__header')).toBeNull();
    });

    it('passes aria-label through when there is no label', () => {
      render(<Progress value={42} aria-label="Storage used" />);
      const progress = screen.getByRole('progressbar', { name: 'Storage used' });
      expect(progress).not.toHaveAttribute('aria-labelledby');
    });

    it('keeps a consumer aria-labelledby when there is no label', () => {
      render(
        <>
          <h2 id="heading">Storage</h2>
          <Progress value={42} aria-labelledby="heading" />
        </>,
      );
      expect(screen.getByRole('progressbar', { name: 'Storage' })).toBeInTheDocument();
    });
  });

  describe('size and variant', () => {
    it('defaults to size md and variant primary', () => {
      render(<Progress value={1} aria-label="X" />);
      expect(screen.getByRole('progressbar')).toHaveClass('nbc-progress', 'nbc-progress--md', 'nbc-progress--primary');
    });

    it.each(SIZES)('applies size %s', (size) => {
      render(<Progress value={1} size={size} aria-label="X" />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveClass(`nbc-progress--${size}`);
      for (const other of SIZES.filter((s) => s !== size)) {
        expect(progress).not.toHaveClass(`nbc-progress--${other}`);
      }
    });

    it.each(VARIANTS)('applies variant %s', (variant) => {
      render(<Progress value={1} variant={variant} aria-label="X" />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveClass(`nbc-progress--${variant}`);
      for (const other of VARIANTS.filter((v) => v !== variant)) {
        expect(progress).not.toHaveClass(`nbc-progress--${other}`);
      }
    });
  });

  describe('DOM', () => {
    it('has a track containing the bar', () => {
      const { container } = render(<Progress value={50} aria-label="X" />);
      const track = container.querySelector('.nbc-progress__track');
      expect(track).not.toBeNull();
      expect(track).toContainElement(bar(container));
    });

    it('forwards ref, className and DOM props to the root', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Progress ref={ref} className="mine" data-testid="p" title="Upload progress" value={5} aria-label="X" />,
      );
      const progress = screen.getByTestId('p');
      expect(ref.current).toBe(progress);
      expect(progress).toBe(screen.getByRole('progressbar'));
      expect(progress).toHaveClass('mine', 'nbc-progress');
      expect(progress).toHaveAttribute('title', 'Upload progress');
    });

    it('keeps the consumer style on the root', () => {
      render(<Progress value={5} aria-label="X" style={{ maxWidth: 320 }} />);
      expect(screen.getByRole('progressbar')).toHaveStyle({ maxWidth: '320px' });
    });
  });

  it('has no axe violations (determinate, indeterminate, every variant and size)', async () => {
    const { container } = render(
      <div>
        <Progress value={42} label="Uploading" showValue />
        <Progress label="Provisioning database" />
        <Progress value={10} aria-label="Quota" />
        {VARIANTS.map((variant) => (
          <Progress key={variant} variant={variant} value={50} label={`Variant ${variant}`} />
        ))}
        {SIZES.map((size) => (
          <Progress key={size} size={size} value={50} label={`Size ${size}`} showValue />
        ))}
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
