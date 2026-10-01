import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { NeoProvider, useTheme } from './NeoProvider';

function Probe() {
  const ctx = useTheme();
  return <span data-testid="probe">{ctx ? `${ctx.theme}:${ctx.mode ?? 'native'}` : 'none'}</span>;
}

describe('NeoProvider', () => {
  it('renders a div with data-theme and the nbc-root class', () => {
    const { container } = render(<NeoProvider theme="classic">x</NeoProvider>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveAttribute('data-theme', 'classic');
    expect(root).toHaveClass('nbc-root');
  });

  it('omits data-mode when mode is not set (theme renders in its native scheme)', () => {
    const { container } = render(<NeoProvider theme="tech">x</NeoProvider>);
    expect(container.firstElementChild).not.toHaveAttribute('data-mode');
  });

  it.each(['light', 'dark', 'system'] as const)('sets data-mode="%s"', (mode) => {
    const { container } = render(
      <NeoProvider theme="swiss" mode={mode}>
        x
      </NeoProvider>,
    );
    expect(container.firstElementChild).toHaveAttribute('data-mode', mode);
  });

  it('exposes { theme, mode } through useTheme()', () => {
    render(
      <NeoProvider theme="y2k" mode="dark">
        <Probe />
      </NeoProvider>,
    );
    expect(screen.getByTestId('probe')).toHaveTextContent('y2k:dark');
  });

  it('returns undefined from useTheme() outside a provider', () => {
    render(<Probe />);
    expect(screen.getByTestId('probe')).toHaveTextContent('none');
  });

  it('nested provider without mode reports its own theme and native scheme', () => {
    const { container } = render(
      <NeoProvider theme="classic" mode="dark">
        <NeoProvider theme="tech">
          <Probe />
        </NeoProvider>
      </NeoProvider>,
    );
    expect(screen.getByTestId('probe')).toHaveTextContent('tech:native');
    const inner = container.querySelector('[data-theme="tech"]');
    expect(inner).not.toHaveAttribute('data-mode');
  });

  it('accepts custom theme names', () => {
    const { container } = render(<NeoProvider theme="my-brand">x</NeoProvider>);
    expect(container.firstElementChild).toHaveAttribute('data-theme', 'my-brand');
  });

  it('renders the element given by `as`', () => {
    const { container } = render(
      <NeoProvider theme="riso" as="main">
        x
      </NeoProvider>,
    );
    expect(container.firstElementChild?.tagName).toBe('MAIN');
  });

  it('merges className, forwards ref and arbitrary props', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <NeoProvider theme="classic" className="app" ref={ref} id="shell" aria-label="App">
        x
      </NeoProvider>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('nbc-root', 'app');
    expect(root).toHaveAttribute('id', 'shell');
    expect(root).toHaveAttribute('aria-label', 'App');
    expect(ref.current).toBe(root);
  });
});
