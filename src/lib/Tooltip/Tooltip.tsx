import { cloneElement, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactElement, ReactNode } from 'react';
import { cx, toSafeId } from '../internal/cx';
import { mergeProps } from '../internal/mergeProps';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** What the tooltip says. Keep it to a short label or hint. */
  content: ReactNode;
  /** The single focusable element the tooltip describes. */
  children: ReactElement;
  /** Which side of the trigger the bubble prefers; it flips when there is no room. */
  side?: TooltipSide;
  /** Milliseconds the pointer must rest on the trigger before the tooltip shows. */
  delay?: number;
  /** Never show the tooltip. */
  disabled?: boolean;
  /** Extra class on the tooltip bubble. */
  className?: string;
}

const GAP = 8;
const MARGIN = 8;

function supportsAnchors(): boolean {
  return typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('anchor-name: --a');
}

function placeFallback(trigger: HTMLElement, tip: HTMLElement, side: TooltipSide) {
  const a = trigger.getBoundingClientRect();
  const t = tip.getBoundingClientRect();
  let top = a.top - t.height - GAP;
  let left = a.left + (a.width - t.width) / 2;
  if (side === 'bottom') top = a.bottom + GAP;
  if (side === 'left' || side === 'right') {
    top = a.top + (a.height - t.height) / 2;
    left = side === 'left' ? a.left - t.width - GAP : a.right + GAP;
  }
  const maxLeft = Math.max(MARGIN, window.innerWidth - t.width - MARGIN);
  const maxTop = Math.max(MARGIN, window.innerHeight - t.height - MARGIN);
  tip.style.top = `${Math.min(Math.max(top, MARGIN), maxTop)}px`;
  tip.style.left = `${Math.min(Math.max(left, MARGIN), maxLeft)}px`;
}

export function Tooltip({ content, children, side = 'top', delay = 400, disabled = false, className }: TooltipProps) {
  const id = `nbc-tooltip-${toSafeId(useId())}`;
  const anchorName = `--nbc-anchor-${toSafeId(useId())}`;
  const [open, setOpen] = useState(false);
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const visible = open && !disabled;

  const clearTimer = () => {
    clearTimeout(timer.current);
    timer.current = undefined;
  };

  useEffect(() => clearTimer, []);

  useLayoutEffect(() => {
    const tip = tipRef.current;
    if (!tip) return;
    try {
      if (visible) {
        tip.showPopover?.();
        if (trigger && !supportsAnchors()) placeFallback(trigger, tip, side);
      } else {
        tip.hidePopover?.();
      }
    } catch {
      // InvalidStateError: already in the requested state — safe to ignore.
    }
  }, [visible, side, trigger]);

  const child = children as ReactElement<Record<string, unknown>>;
  const childProps = child.props;

  if (disabled) return child;

  const hide = () => {
    clearTimer();
    setOpen(false);
  };

  const isMouse = (event: PointerEvent) => !event.pointerType || event.pointerType === 'mouse';

  const slotProps = {
    'aria-describedby': cx(childProps['aria-describedby'] as string | undefined, id),
    onPointerEnter: (event: PointerEvent) => {
      if (!isMouse(event)) return;
      clearTimer();
      timer.current = setTimeout(() => setOpen(true), delay);
    },
    onPointerLeave: hide,
    onFocus: () => {
      clearTimer();
      setOpen(true);
    },
    onBlur: hide,
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === 'Escape') hide();
    },
    ref: setTrigger,
    className: 'nbc-tooltip-anchor',
    style: { '--nbc-anchor-name': anchorName } as CSSProperties,
  };
  // The handlers read `timer` only when they run (events), never during render.
  // eslint-disable-next-line react-hooks/refs
  const merged = mergeProps(slotProps, childProps);
  // The describedby must keep both ids even when the child sets its own.
  merged['aria-describedby'] = slotProps['aria-describedby'];

  return (
    <>
      {/* eslint-disable-next-line react-hooks/refs -- same handlers as above */}
      {cloneElement(child, merged)}
      <div
        ref={tipRef}
        id={id}
        role="tooltip"
        popover="manual"
        data-state={visible ? 'open' : 'closed'}
        className={cx('nbc-tooltip', `nbc-tooltip--${side}`, className)}
        style={{ '--nbc-anchor-name': anchorName } as CSSProperties}
      >
        {content}
      </div>
    </>
  );
}
