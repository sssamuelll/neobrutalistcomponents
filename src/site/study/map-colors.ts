/**
 * The world map's plate. It follows the page's light or dark scheme through
 * light-dark(), never the theme's palette: room hues on a theme's own
 * background would vanish on some themes (Whaam!'s yellow, Amiga's blue).
 * map-colors.test.ts holds these values to the contrast rules.
 */
import type { CSSProperties } from 'react';
import { lightDark } from '../../study/color';
import { THEME_SCENES } from '../../study/types';
import type { ThemeScene } from '../../study/types';

export interface Plate {
  readonly plate: string;
  readonly land: string;
  readonly ink: string;
  readonly muted: string;
  readonly graticule: string;
}

export const PLATE: Readonly<Record<'light' | 'dark', Plate>> = {
  light: { plate: '#f2efe6', land: '#cdc7b9', ink: '#1b1b1b', muted: '#6b665c', graticule: '#00000014' },
  dark: { plate: '#121212', land: '#3a3a3a', ink: '#ece6d6', muted: '#8a857a', graticule: '#ffffff10' },
};

export const ROOM_HUES: Readonly<Record<ThemeScene, readonly [light: string, dark: string]>> = {
  japan: ['#b0413e', '#f08a84'],
  germany: ['#3d5a8a', '#8fb0e6'],
  usa: ['#a8742a', '#e0b066'],
  latam: ['#3f7a5a', '#7cc49b'],
  italy: ['#9a4a5a', '#e38fa0'],
};

/** The plate's custom properties, for the figure's style attribute. */
export function plateStyle(): CSSProperties {
  const vars: Record<string, string> = {};
  for (const key of ['plate', 'land', 'ink', 'muted', 'graticule'] as const) vars[`--map-${key}`] = lightDark(PLATE.light[key], PLATE.dark[key]);
  for (const scene of THEME_SCENES) vars[`--map-room-${scene}`] = lightDark(...ROOM_HUES[scene]);
  return vars as CSSProperties;
}
