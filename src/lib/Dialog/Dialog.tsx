import { createContext, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ComponentProps, MouseEvent, SyntheticEvent } from 'react';
import { cx, toSafeId } from '../internal/cx';
import { XIcon } from '../internal/icons';
import { composeRefs } from '../internal/mergeProps';

export type DialogSize = 'sm' | 'md' | 'lg';

export interface DialogProps extends Omit<ComponentProps<'dialog'>, 'open'> {
  /** Whether the dialog is shown. Controlled: the dialog never closes itself. */
  open: boolean;
  /** Called with `false` when the user asks to close (Esc, backdrop, close button, form method="dialog"). */
  onOpenChange: (open: boolean) => void;
  /** Maximum inline size: sm 400px, md 560px, lg 760px. */
  size?: DialogSize;
  /** Close when the backdrop is clicked. */
  closeOnBackdrop?: boolean;
  /** Hide the corner close button. Provide another way to close. */
  hideClose?: boolean;
  /** Accessible name of the corner close button. */
  closeLabel?: string;
}

interface DialogContextValue {
  titleId: string;
  descriptionId: string;
  setHasTitle: (present: boolean) => void;
  setHasDescription: (present: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function DialogRoot({
  open,
  onOpenChange,
  size = 'md',
  closeOnBackdrop = true,
  hideClose = false,
  closeLabel = 'Close',
  className,
  children,
  ref,
  onCancel,
  onClose,
  onClick,
  ...rest
}: DialogProps) {
  const innerRef = useRef<HTMLDialogElement>(null);
  const baseId = toSafeId(useId());
  const [hasTitle, setHasTitle] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);

  useEffect(() => {
    const dialog = innerRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  const context = useMemo<DialogContextValue>(
    () => ({
      titleId: `${baseId}-title`,
      descriptionId: `${baseId}-description`,
      setHasTitle,
      setHasDescription,
    }),
    [baseId],
  );

  function handleCancel(event: SyntheticEvent<HTMLDialogElement, Event>) {
    onCancel?.(event);
    event.preventDefault();
    onOpenChange(false);
  }

  function handleClose(event: SyntheticEvent<HTMLDialogElement, Event>) {
    onClose?.(event);
    // When we closed it because `open` became false, the prop is already false.
    if (open) onOpenChange(false);
  }

  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    onClick?.(event);
    if (closeOnBackdrop && event.target === event.currentTarget) onOpenChange(false);
  }

  return (
    <DialogContext.Provider value={context}>
      <dialog
        {...rest}
        ref={composeRefs(innerRef, ref)}
        className={cx('nbc-dialog', `nbc-dialog--${size}`, className)}
        aria-labelledby={hasTitle ? context.titleId : rest['aria-labelledby']}
        aria-describedby={hasDescription ? context.descriptionId : rest['aria-describedby']}
        onCancel={handleCancel}
        onClose={handleClose}
        onClick={handleClick}
      >
        <div className="nbc-dialog__panel">
          {hideClose ? null : (
            <button type="button" className="nbc-dialog__close" aria-label={closeLabel} onClick={() => onOpenChange(false)}>
              <XIcon />
            </button>
          )}
          {children}
        </div>
      </dialog>
    </DialogContext.Provider>
  );
}

function DialogHeader({ className, ...rest }: ComponentProps<'div'>) {
  return <div {...rest} className={cx('nbc-dialog__header', className)} />;
}

function DialogTitle({ className, id, ...rest }: ComponentProps<'h2'>) {
  const context = useContext(DialogContext);
  const setHasTitle = context?.setHasTitle;
  useLayoutEffect(() => {
    setHasTitle?.(true);
    return () => setHasTitle?.(false);
  }, [setHasTitle]);
  return <h2 {...rest} id={context?.titleId ?? id} className={cx('nbc-dialog__title', className)} />;
}

function DialogDescription({ className, id, ...rest }: ComponentProps<'p'>) {
  const context = useContext(DialogContext);
  const setHasDescription = context?.setHasDescription;
  useLayoutEffect(() => {
    setHasDescription?.(true);
    return () => setHasDescription?.(false);
  }, [setHasDescription]);
  return <p {...rest} id={context?.descriptionId ?? id} className={cx('nbc-dialog__description', className)} />;
}

function DialogContent({ className, ...rest }: ComponentProps<'div'>) {
  return <div {...rest} className={cx('nbc-dialog__content', className)} />;
}

function DialogFooter({ className, ...rest }: ComponentProps<'div'>) {
  return <div {...rest} className={cx('nbc-dialog__footer', className)} />;
}

/** A modal dialog on the native `<dialog>` element. Compose with Dialog.Header, Dialog.Title, Dialog.Description, Dialog.Content and Dialog.Footer. */
export const Dialog = Object.assign(DialogRoot, {
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Content: DialogContent,
  Footer: DialogFooter,
});
