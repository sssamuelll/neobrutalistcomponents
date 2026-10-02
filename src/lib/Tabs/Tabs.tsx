import { createContext, use, useId, useState } from 'react';
import type { ComponentProps, KeyboardEvent } from 'react';
import { cx, toSafeId } from '../internal/cx';
import { useControllableState } from '../internal/useControllableState';

export interface TabsProps extends Omit<ComponentProps<'div'>, 'onChange' | 'defaultValue'> {
  /** Value of the selected tab (controlled). */
  value?: string;
  /** Value of the initially selected tab (uncontrolled). Defaults to the first enabled tab. */
  defaultValue?: string;
  /** Called with the new value when the user selects a tab. */
  onValueChange?: (value: string) => void;
}

export interface TabsTabProps extends Omit<ComponentProps<'button'>, 'value'> {
  /** Unique value that pairs this tab with its Tabs.Panel. */
  value: string;
}

export interface TabsPanelProps extends ComponentProps<'div'> {
  /** Value of the Tabs.Tab that controls this panel. */
  value: string;
}

interface TabsContextValue {
  base: string;
  selected: string;
  select: (value: string) => void;
  adopt: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(part: string): TabsContextValue {
  const ctx = use(TabsContext);
  if (!ctx) throw new Error(`Tabs.${part} must be rendered inside <Tabs>.`);
  return ctx;
}

const tabId = (base: string, value: string) => `nbc-tabs-${base}-tab-${toSafeId(value)}`;
const panelId = (base: string, value: string) => `nbc-tabs-${base}-panel-${toSafeId(value)}`;

function TabsRoot({ value, defaultValue, onValueChange, className, ...rest }: TabsProps) {
  const base = toSafeId(useId());
  const [current, select] = useControllableState<string>(value, defaultValue ?? '', onValueChange);
  // First enabled tab, adopted from the DOM when nothing was selected up front.
  const [adopted, adopt] = useState('');
  const selected = current || adopted;
  return (
    <TabsContext value={{ base, selected, select, adopt }}>
      <div {...rest} className={cx('nbc-tabs', className)} />
    </TabsContext>
  );
}

function TabsList({ className, onKeyDown, ref, ...rest }: ComponentProps<'div'>) {
  const { selected, select, adopt } = useTabs('List');

  function enabledTabs(list: HTMLElement) {
    return Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])'));
  }

  function handleRef(el: HTMLDivElement | null) {
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
    if (el && !selected) {
      const first = enabledTabs(el)[0]?.dataset.value;
      if (first) adopt(first);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const tabs = enabledTabs(event.currentTarget);
    if (tabs.length === 0) return;
    const index = tabs.indexOf(document.activeElement as HTMLElement);
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft';
    let next: HTMLElement | undefined;
    if (event.key === forward) next = tabs[(index + 1) % tabs.length];
    else if (event.key === backward) next = tabs[(index - 1 + tabs.length) % tabs.length];
    else if (event.key === 'Home') next = tabs[0];
    else if (event.key === 'End') next = tabs[tabs.length - 1];
    else return;
    event.preventDefault();
    next.focus();
    if (next.dataset.value !== undefined) select(next.dataset.value);
  }

  return (
    <div
      aria-orientation="horizontal"
      {...rest}
      ref={handleRef}
      role="tablist"
      className={cx('nbc-tabs__list', className)}
      onKeyDown={handleKeyDown}
    />
  );
}

function TabsTab({ value, className, onClick, ...rest }: TabsTabProps) {
  const { base, selected, select } = useTabs('Tab');
  const active = selected === value;
  return (
    <button
      type="button"
      {...rest}
      role="tab"
      id={tabId(base, value)}
      aria-selected={active}
      aria-controls={panelId(base, value)}
      tabIndex={active ? 0 : -1}
      data-value={value}
      data-state={active ? 'active' : 'inactive'}
      className={cx('nbc-tabs__tab', active && 'nbc-tabs__tab--active', className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) select(value);
      }}
    />
  );
}

function TabsPanel({ value, className, ...rest }: TabsPanelProps) {
  const { base, selected } = useTabs('Panel');
  const active = selected === value;
  return (
    <div
      tabIndex={0}
      {...rest}
      role="tabpanel"
      id={panelId(base, value)}
      aria-labelledby={tabId(base, value)}
      hidden={!active}
      data-state={active ? 'active' : 'inactive'}
      className={cx('nbc-tabs__panel', className)}
    />
  );
}

/** Switch between views that share one place on the page. Compose with Tabs.List, Tabs.Tab and Tabs.Panel. */
export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
});
