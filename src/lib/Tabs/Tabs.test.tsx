import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../test-utils';
import { Tabs } from './Tabs';

function Basic(props: Partial<React.ComponentProps<typeof Tabs>>) {
  return (
    <Tabs {...props}>
      <Tabs.List aria-label="Project">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="deploys">Deployments</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Overview body</Tabs.Panel>
      <Tabs.Panel value="deploys">Deploys body</Tabs.Panel>
      <Tabs.Panel value="settings">Settings body</Tabs.Panel>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('wires roles and aria', () => {
    render(<Basic defaultValue="overview" />);
    const list = screen.getByRole('tablist');
    expect(list).toHaveAttribute('aria-orientation', 'horizontal');
    const tab = screen.getByRole('tab', { name: 'Overview' });
    const panel = screen.getByRole('tabpanel');
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(tab).toHaveAttribute('type', 'button');
    expect(tab.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
    expect(panel).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'false');
  });

  it('selects on click, calls onValueChange, keeps inactive panels mounted but hidden', async () => {
    const onValueChange = vi.fn();
    render(<Basic defaultValue="overview" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Deployments' }));
    expect(onValueChange).toHaveBeenCalledWith('deploys');
    expect(screen.getByRole('tab', { name: 'Deployments' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Deploys body')).toBeVisible();
    expect(screen.getByText('Overview body')).not.toBeVisible();
    expect(screen.getByText('Settings body')).toBeInTheDocument();
  });

  it('moves focus and selection with arrows, wrapping', async () => {
    render(<Basic defaultValue="overview" />);
    screen.getByRole('tab', { name: 'Overview' }).focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
  });

  it('skips disabled tabs', async () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">A</Tabs.Tab>
          <Tabs.Tab value="b" disabled>B</Tabs.Tab>
          <Tabs.Tab value="c">C</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">a</Tabs.Panel>
        <Tabs.Panel value="b">b</Tabs.Panel>
        <Tabs.Panel value="c">c</Tabs.Panel>
      </Tabs>,
    );
    screen.getByRole('tab', { name: 'A' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'C' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'B' })).toBeDisabled();
  });

  it('is driven by value when controlled', async () => {
    const onValueChange = vi.fn();
    render(<Basic value="settings" onValueChange={onValueChange} />);
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(screen.getByRole('tab', { name: 'Overview' }));
    expect(onValueChange).toHaveBeenCalledWith('overview');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
  });

  it('works inside a stateful parent', async () => {
    function Host() {
      const [v, setV] = useState('overview');
      return <Basic value={v} onValueChange={setV} />;
    }
    render(<Host />);
    await userEvent.click(screen.getByRole('tab', { name: 'Settings' }));
    expect(screen.getByText('Settings body')).toBeVisible();
  });

  it('selects the first enabled tab after mount when no value is given', () => {
    render(
      <Tabs>
        <Tabs.List>
          <Tabs.Tab value="a" disabled>A</Tabs.Tab>
          <Tabs.Tab value="b">B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">a</Tabs.Panel>
        <Tabs.Panel value="b">b</Tabs.Panel>
      </Tabs>,
    );
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('b')).toBeVisible();
  });

  it('builds valid ids from arbitrary values', () => {
    render(
      <Tabs defaultValue="Billing & invoices">
        <Tabs.List>
          <Tabs.Tab value="Billing & invoices">Billing</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="Billing & invoices">Invoices</Tabs.Panel>
      </Tabs>,
    );
    const tab = screen.getByRole('tab');
    const panel = screen.getByRole('tabpanel');
    expect(tab.id).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(panel.id).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(tab.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
  });

  it('gives tabindex 0 only to the active tab', () => {
    render(<Basic defaultValue="deploys" />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((t) => t.tabIndex)).toEqual([-1, 0, -1]);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Basic defaultValue="overview" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
