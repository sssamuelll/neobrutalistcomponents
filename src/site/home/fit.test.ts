import { describe, expect, it } from 'vitest';
import { TITLE_LINES, fitSizes } from './fit';

describe('fitSizes', () => {
  it('sizes each fitted line to fill the width, from its width at 100 px', () => {
    expect(fitSizes([500, 250], [true, true], 1000)).toEqual([200, 400]);
  });

  it('gives a connector line the smallest fitted size', () => {
    expect(fitSizes([400, 100, 500], [true, false, true], 1000)).toEqual([250, 200, 200]);
  });

  it('rounds down to a tenth of a pixel, so a line never overflows', () => {
    expect(fitSizes([300], [true], 1000)).toEqual([333.3]);
  });

  it('leaves unmeasured lines at 0, for CSS to size', () => {
    expect(fitSizes([0, 0], [true, true], 1000)).toEqual([0, 0]);
  });
});

describe('TITLE_LINES', () => {
  it('reads the gallery’s name in both layouts and languages', () => {
    for (const lang of ['es', 'en'] as const) {
      expect(TITLE_LINES[lang].wide.map((line) => line.text).join(' ')).toBe(TITLE_LINES[lang].phone.map((line) => line.text).join(' '));
    }
    expect(TITLE_LINES.es.wide.map((line) => line.text)).toEqual(['Galería de las', 'Interfaces']);
    expect(TITLE_LINES.en.phone.map((line) => line.fit)).toEqual([true, false, true]);
  });
});
