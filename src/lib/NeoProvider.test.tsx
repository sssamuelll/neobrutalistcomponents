import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NeoProvider, useTheme } from './NeoProvider';

function ThemeReader() {
  const theme = useTheme();
  return <span data-testid="theme">{theme ?? 'undefined'}</span>;
}

describe('NeoProvider', () => {
  it('sets data-theme on the rendered element', () => {
    const { container } = render(<NeoProvider theme="classic">x</NeoProvider>);
    expect(container.firstChild).toHaveAttribute('data-theme', 'classic');
  });

  it('exposes theme via useTheme()', () => {
    render(
      <NeoProvider theme="tech">
        <ThemeReader />
      </NeoProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('tech');
  });

  it('useTheme() returns undefined outside any provider', () => {
    render(<ThemeReader />);
    expect(screen.getByTestId('theme')).toHaveTextContent('undefined');
  });

  it('supports nested providers — inner wins', () => {
    render(
      <NeoProvider theme="classic">
        <NeoProvider theme="y2k">
          <ThemeReader />
        </NeoProvider>
      </NeoProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('y2k');
  });

  it('renders a custom element via `as` prop', () => {
    const { container } = render(
      <NeoProvider theme="classic" as="section">x</NeoProvider>,
    );
    expect((container.firstChild as HTMLElement).tagName).toBe('SECTION');
  });

  it('forwards className to the rendered element', () => {
    const { container } = render(
      <NeoProvider theme="classic" className="mine">x</NeoProvider>,
    );
    expect(container.firstChild).toHaveClass('mine');
  });
});
