import type { Lang } from '../../study/types';

export type TitleLayout = 'wide' | 'phone';

/** A line of the home's title. A fitted line fills the width; a connector («DE LAS») is set at the smallest fitted size. */
export interface TitleLine {
  readonly text: string;
  readonly fit: boolean;
}

export const TITLE_LINES: Record<Lang, Record<TitleLayout, readonly TitleLine[]>> = {
  es: {
    wide: [
      { text: 'Galería de las', fit: true },
      { text: 'Interfaces', fit: true },
    ],
    phone: [
      { text: 'Galería', fit: true },
      { text: 'de las', fit: false },
      { text: 'Interfaces', fit: true },
    ],
  },
  en: {
    wide: [
      { text: 'Gallery of', fit: true },
      { text: 'Interfaces', fit: true },
    ],
    phone: [
      { text: 'Gallery', fit: true },
      { text: 'of', fit: false },
      { text: 'Interfaces', fit: true },
    ],
  },
};

/** Scales every size down by one factor when the title is taller than `room`; never up, and not at all when the room is unknown. */
export function capSizes(sizes: readonly number[], height: number, room: number): number[] {
  if (!(height > room) || room <= 0) return [...sizes];
  const factor = room / height;
  return sizes.map((size) => Math.floor(size * factor * 10) / 10);
}

/** Font sizes in px from each line's width at 100 px: fitted lines fill `available`, connectors take the smallest fitted size. */
export function fitSizes(widthsAt100: readonly number[], fits: readonly boolean[], available: number): number[] {
  const fitted = widthsAt100.map((width) => (width > 0 ? Math.floor(((100 * available) / width) * 10) / 10 : 0));
  const sized = fitted.filter((size, i) => fits[i] && size > 0);
  const smallest = sized.length ? Math.min(...sized) : 0;
  return fitted.map((size, i) => (fits[i] ? size : smallest));
}
