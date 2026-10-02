import { Children, cloneElement, isValidElement } from 'react';
import type { ComponentProps, MouseEvent, ReactElement, ReactNode } from 'react';
import { cx, isPresent } from '../internal/cx';
import { Slot } from '../internal/Slot';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ComponentProps<'button'> {
  /** Visual weight. One `primary` per view region. */
  variant?: ButtonVariant;
  /** Height 32 / 40 / 48px — the same scale as every form control. */
  size?: ButtonSize;
  /** Shows a spinner, sets `aria-busy` and disables the button. */
  loading?: boolean;
  /** Stretch to the container's width. */
  fullWidth?: boolean;
  /** Icon before the label (hidden from assistive tech). */
  leftIcon?: ReactNode;
  /** Icon after the label (hidden from assistive tech). */
  rightIcon?: ReactNode;
  /** Render the single child element (e.g. a link) with button styles instead of a `<button>`. */
  asChild?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  asChild = false,
  disabled,
  type,
  className,
  children,
  onClick,
  ...rest
}: ButtonProps) {
  const child = asChild ? Children.only(children) : null;
  const label: ReactNode = asChild
    ? isValidElement<{ children?: ReactNode }>(child)
      ? child.props.children
      : null
    : children;
  const hasLabel = isPresent(label);
  const iconOnly = !hasLabel && isPresent(leftIcon) !== isPresent(rightIcon);

  const classes = cx(
    'nbc-button',
    `nbc-button--${variant}`,
    `nbc-button--${size}`,
    fullWidth && 'nbc-button--full-width',
    loading && 'nbc-button--loading',
    iconOnly && 'nbc-button--icon-only',
    className,
  );

  const body = (
    <>
      {loading && <span className="nbc-button__spinner" aria-hidden="true" />}
      {!loading && isPresent(leftIcon) && (
        <span className="nbc-button__icon" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {hasLabel && <span className="nbc-button__label">{label}</span>}
      {!loading && isPresent(rightIcon) && (
        <span className="nbc-button__icon" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </>
  );

  if (asChild) {
    if (!isValidElement(child)) return null;
    const inactive = Boolean(disabled || loading);
    return (
      <Slot
        {...rest}
        className={classes}
        aria-disabled={inactive || undefined}
        aria-busy={loading || undefined}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          if (inactive) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
      >
        {/* While inactive the child's own click/aux-click handlers must not run. */}
        {cloneElement(
          child as ReactElement<Record<string, unknown>>,
          inactive ? { onClick: undefined, onAuxClick: (e: MouseEvent) => e.preventDefault() } : undefined,
          body,
        )}
      </Slot>
    );
  }

  return (
    <button
      {...rest}
      type={type ?? 'button'}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={onClick}
    >
      {body}
    </button>
  );
}
