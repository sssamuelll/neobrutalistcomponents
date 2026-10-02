import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../../test-utils';
import { Dialog } from './Dialog';

function setup(props: Partial<React.ComponentProps<typeof Dialog>> = {}) {
  const onOpenChange = vi.fn();
  const utils = render(
    <Dialog open onOpenChange={onOpenChange} data-testid="dlg" {...props}>
      <Dialog.Header>
        <Dialog.Title>Delete project</Dialog.Title>
        <Dialog.Description>This cannot be undone.</Dialog.Description>
      </Dialog.Header>
      <Dialog.Content>Body</Dialog.Content>
      <Dialog.Footer>
        <button type="button">Cancel</button>
      </Dialog.Footer>
    </Dialog>,
  );
  const dialog = screen.getByTestId('dlg') as HTMLDialogElement;
  return { ...utils, dialog, onOpenChange };
}

describe('Dialog', () => {
  it('is closed by default when open is false', () => {
    const { dialog } = setup({ open: false });
    expect(dialog.open).toBe(false);
  });

  it('opens modally and is named by its title', () => {
    const { dialog } = setup();
    expect(dialog.open).toBe(true);
    expect(screen.getByRole('dialog', { name: 'Delete project' })).toBe(dialog);
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.');
  });

  it('closes when the prop turns false without calling onOpenChange', () => {
    const { dialog, rerender, onOpenChange } = setup();
    rerender(
      <Dialog open={false} onOpenChange={onOpenChange} data-testid="dlg">
        <Dialog.Title>Delete project</Dialog.Title>
      </Dialog>,
    );
    expect(dialog.open).toBe(false);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('Esc (cancel) asks to close and prevents the native close', () => {
    const onCancel = vi.fn();
    const { dialog, onOpenChange } = setup({ onCancel });
    const event = new Event('cancel', { cancelable: true });
    fireEvent(dialog, event);
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(event.defaultPrevented).toBe(true);
    expect(dialog.open).toBe(true);
  });

  it('a native close while open asks to close once', () => {
    const { dialog, onOpenChange } = setup();
    dialog.close();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('backdrop click closes unless closeOnBackdrop is false; panel clicks never do', async () => {
    const first = setup();
    fireEvent.pointerDown(first.dialog);
    fireEvent.click(first.dialog);
    expect(first.onOpenChange).toHaveBeenCalledWith(false);
    await userEvent.click(screen.getByText('Body'));
    expect(first.onOpenChange).toHaveBeenCalledTimes(1);
    first.unmount();

    const second = setup({ closeOnBackdrop: false });
    fireEvent.pointerDown(second.dialog);
    fireEvent.click(second.dialog);
    expect(second.onOpenChange).not.toHaveBeenCalled();
  });

  it('a drag that starts inside the panel and ends on the backdrop does not close', () => {
    const { dialog, onOpenChange } = setup();
    fireEvent.pointerDown(screen.getByText('Body'));
    fireEvent.click(dialog);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('reopens when the browser closes it but the parent keeps open=true', () => {
    const { dialog, onOpenChange } = setup();
    act(() => dialog.close());
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(dialog.open).toBe(true);
  });

  it('renders a close button named by closeLabel', async () => {
    const { onOpenChange } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('supports a custom closeLabel and hideClose', () => {
    const { unmount } = setup({ closeLabel: 'Dismiss' });
    expect(screen.getByRole('button', { name: 'Dismiss' })).toHaveAttribute('type', 'button');
    unmount();
    setup({ hideClose: true });
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
  });

  it('omits aria-labelledby and aria-describedby without title or description', () => {
    render(
      <Dialog open onOpenChange={() => {}} data-testid="bare" aria-label="Bare">
        <Dialog.Content>Only content</Dialog.Content>
      </Dialog>,
    );
    const dialog = screen.getByTestId('bare');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
    expect(dialog).not.toHaveAttribute('aria-describedby');
  });

  it('points aria attributes at the title and description ids', () => {
    const { dialog } = setup();
    const title = screen.getByText('Delete project');
    const description = screen.getByText('This cannot be undone.');
    expect(dialog).toHaveAttribute('aria-labelledby', title.id);
    expect(dialog).toHaveAttribute('aria-describedby', description.id);
  });

  it('applies size class, className, ref and rest props', () => {
    const ref = createRef<HTMLDialogElement>();
    const { dialog } = setup({ size: 'lg', className: 'mine', ref, id: 'x' });
    expect(dialog).toHaveClass('nbc-dialog', 'nbc-dialog--lg', 'mine');
    expect(dialog.id).toBe('x');
    expect(ref.current).toBe(dialog);
  });

  it('defaults to the md size', () => {
    const { dialog } = setup();
    expect(dialog).toHaveClass('nbc-dialog--md');
  });

  it('has no axe violations while open', async () => {
    setup();
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
