import { describe, expect, it } from 'vitest';
import { contrastRatio } from '../../lib/themes/color';
import { THEME_SCENES } from '../../study/types';
import { PLATE, ROOM_HUES, plateStyle } from './map-colors';

describe('the map plate', () => {
  it.each(['light', 'dark'] as const)('%s: ink and muted text reach 4.5:1, every room hue 3:1', (scheme) => {
    const { plate, ink, muted } = PLATE[scheme];
    expect(contrastRatio(ink, plate)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(muted, plate)).toBeGreaterThanOrEqual(4.5);
    for (const scene of THEME_SCENES) {
      const hue = ROOM_HUES[scene][scheme === 'light' ? 0 : 1];
      expect(contrastRatio(hue, plate), `${scene} on the ${scheme} plate`).toBeGreaterThanOrEqual(3);
    }
  });

  it('writes one custom property per plate colour and per room, through light-dark()', () => {
    const style = plateStyle() as Record<string, string>;
    expect(style['--map-plate']).toBe('light-dark(#f2efe6, #121212)');
    expect(style['--map-room-japan']).toBe('light-dark(#b0413e, #f08a84)');
    expect(Object.keys(style).filter((key) => key.startsWith('--map-room-')).sort()).toEqual(THEME_SCENES.map((scene) => `--map-room-${scene}`).sort());
  });
});
