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
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      const size = parseFloat(this.style?.fontSize) || 100;
      return { width: ((at100[this.textContent ?? ''] ?? 0) * size) / 100, height: 0 } as DOMRect;
    });
    vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(1000);
    render(<FitTitle lines={TITLE_LINES.es.phone} label="Galería de las Interfaces" />);
    const sizes = [...document.querySelectorAll<HTMLElement>('.fit-title__line')].map((line) => line.style.fontSize);
    expect(sizes).toEqual(['250px', '200px', '200px']);
  });

  it('corrects a line that grew more than its size (optical sizes), from its real width', () => {
    // Galería measures 400 px at 100 px, but 1040 px at 250 px: 4% wider than linear.
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (!this.classList?.contains('fit-title__line')) return { width: 0, height: 0 } as DOMRect;
      const size = parseFloat(this.style.fontSize);
      return { width: size === 100 ? 400 : size * 4.16, height: 0 } as DOMRect;
    });
    vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(1000);
    render(<FitTitle lines={[{ text: 'Galería', fit: true }]} label="Galería" />);
    expect(document.querySelector<HTMLElement>('.fit-title__line')!.style.fontSize).toBe('240.3px');
  });

  it('shrinks the whole title when it is taller than the room it is given, and says so', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this.classList?.contains('fit-title__line')) return { width: 4 * parseFloat(this.style.fontSize), height: 0 } as DOMRect;
      if (this.classList?.contains('fit-title')) {
        const total = [...this.querySelectorAll<HTMLElement>('.fit-title__line')].reduce((sum, line) => sum + parseFloat(line.style.fontSize), 0);
        return { width: 1000, height: total } as DOMRect;
      }
      return { width: 0, height: 0 } as DOMRect;
    });
    vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(1000);
    render(<FitTitle lines={[{ text: 'Galería', fit: true }]} label="Galería" maxHeight={() => 125} />);
    expect(document.querySelector<HTMLElement>('.fit-title__line')!.style.fontSize).toBe('125px');
    expect(document.querySelector('.fit-title')).toHaveAttribute('data-capped');
  });
});
