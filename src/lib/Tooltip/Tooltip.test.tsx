import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { axe } from '../../test-utils';
import { Tooltip } from './Tooltip';

const getTip = () => screen.getByRole('tooltip', { hidden: true });

afterEach(() => {
  vi.useRealTimers();
});

describe('Tooltip', () => {
  it('renders a popover tooltip and describes the trigger with it', () => {
    render(
      <Tooltip content="Copy link">
        <button aria-describedby="own-hint">Copy</button>
      </Tooltip>,
    );
    const tip = getTip();
    expect(tip).toHaveTextContent('Copy link');
    expect(tip).toHaveAttribute('popover', 'manual');
    expect(tip.id).toMatch(/^nbc-tooltip-/);
    expect(tip).toHaveAttribute('data-state', 'closed');
    const describedBy = screen.getByRole('button').getAttribute('aria-describedby') ?? '';
    expect(describedBy.split(' ')).toEqual(['own-hint', tip.id]);
  });

  it('applies side and className to the bubble', () => {
    render(
      <Tooltip content="Hint" side="right" className="extra">
        <button>Go</button>
      </Tooltip>,
    );
    expect(getTip()).toHaveClass('nbc-tooltip', 'nbc-tooltip--right', 'extra');
  });

  it('opens on focus and closes on blur', () => {
    render(
      <Tooltip content="Archive">
        <button>A</button>
      </Tooltip>,
    );
    const button = screen.getByRole('button');
    act(() => button.focus());
    expect(getTip()).toHaveAttribute('data-state', 'open');
    act(() => button.blur());
    expect(getTip()).toHaveAttribute('data-state', 'closed');
  });

  it('opens on hover only after the delay and cancels on leave', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Delete" delay={300}>
        <button>D</button>
      </Tooltip>,
    );
    const button = screen.getByRole('button');
    fireEvent.pointerEnter(button);
    act(() => void vi.advanceTimersByTime(299));
    expect(getTip()).toHaveAttribute('data-state', 'closed');
    act(() => void vi.advanceTimersByTime(1));
    expect(getTip()).toHaveAttribute('data-state', 'open');
    fireEvent.pointerLeave(button);
    act(() => void vi.advanceTimersByTime(200));
    expect(getTip()).toHaveAttribute('data-state', 'closed');

    fireEvent.pointerEnter(button);
    act(() => void vi.advanceTimersByTime(100));
    fireEvent.pointerLeave(button);
    act(() => void vi.advanceTimersByTime(1000));
    expect(getTip()).toHaveAttribute('data-state', 'closed');
  });

  it('stays open while the pointer moves from the trigger onto the bubble (WCAG 1.4.13)', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Delete" delay={0}>
        <button>D</button>
      </Tooltip>,
    );
    const button = screen.getByRole('button');
    fireEvent.pointerEnter(button);
    act(() => void vi.advanceTimersByTime(0));
    fireEvent.pointerLeave(button);
    fireEvent.pointerEnter(getTip());
    act(() => void vi.advanceTimersByTime(500));
    expect(getTip()).toHaveAttribute('data-state', 'open');
    fireEvent.pointerLeave(getTip());
    act(() => void vi.advanceTimersByTime(200));
    expect(getTip()).toHaveAttribute('data-state', 'closed');
  });

  it('does not open on touch pointers', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Delete">
        <button>D</button>
      </Tooltip>,
    );
    fireEvent.pointerEnter(screen.getByRole('button'), { pointerType: 'touch' });
    act(() => void vi.advanceTimersByTime(2000));
    expect(getTip()).toHaveAttribute('data-state', 'closed');
  });

  it('closes on Escape', () => {
    render(
      <Tooltip content="Archive">
        <button>A</button>
      </Tooltip>,
    );
    const button = screen.getByRole('button');
    act(() => button.focus());
    fireEvent.keyDown(button, { key: 'Escape' });
    expect(getTip()).toHaveAttribute('data-state', 'closed');
  });

  it('never opens or describes the trigger when disabled', () => {
    render(
      <Tooltip content="Nope" disabled>
        <button>X</button>
      </Tooltip>,
    );
    const button = screen.getByRole('button');
    act(() => button.focus());
    expect(button).not.toHaveAttribute('aria-describedby');
    expect(screen.queryByRole('tooltip', { hidden: true })?.getAttribute('data-state') ?? 'closed').toBe('closed');
  });

  it('keeps the child handlers and ref working', () => {
    const onFocus = vi.fn();
    const onPointerEnter = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <Tooltip content="Hint">
        <button ref={ref} onFocus={onFocus} onPointerEnter={onPointerEnter}>
          B
        </button>
      </Tooltip>,
    );
    const button = screen.getByRole('button');
    act(() => button.focus());
    fireEvent.pointerEnter(button);
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onPointerEnter).toHaveBeenCalledTimes(1);
    expect(ref.current).toBe(button);
    expect(getTip()).toHaveAttribute('data-state', 'open');
  });

  it('puts a valid anchor name on the trigger and the bubble', () => {
    render(
      <Tooltip content="Hint">
        <button>B</button>
      </Tooltip>,
    );
    const name = screen.getByRole('button').style.getPropertyValue('--nbc-anchor-name');
    expect(name).toMatch(/^--[A-Za-z0-9_-]+$/);
    expect(getTip().style.getPropertyValue('--nbc-anchor-name')).toBe(name);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Tooltip content="Copy link">
        <button>Copy</button>
      </Tooltip>,
    );
    act(() => screen.getByRole('button').focus());
    expect(await axe(container)).toHaveNoViolations();
  });
});
