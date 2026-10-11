import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FitTitle } from './FitTitle';
import { TITLE_LINES } from './fit';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('FitTitle', () => {
  it('is one h1 named by its label; the letters are hidden from assistive technology', () => {
    render(<FitTitle lines={TITLE_LINES.es.wide} label="Galería de las Interfaces" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Galería de las Interfaces' })).toBeInTheDocument();
    expect(document.querySelectorAll('.fit-title__line')).toHaveLength(2);
    expect(document.querySelector('.fit-title__line')?.parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('sets each line’s size from its measured width, the connector at the smaller size', () => {
    const at100: Record<string, number> = { 'Galería': 400, 'de las': 100, Interfaces: 500 };
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      return { width: at100[this.textContent ?? ''] ?? 0 } as DOMRect;
    });
    vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(1000);
    render(<FitTitle lines={TITLE_LINES.es.phone} label="Galería de las Interfaces" />);
    const sizes = [...document.querySelectorAll<HTMLElement>('.fit-title__line')].map((line) => line.style.fontSize);
    expect(sizes).toEqual(['250px', '200px', '200px']);
  });
});
