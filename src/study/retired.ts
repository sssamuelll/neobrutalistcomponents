/**
 * Study themes retired from the gallery, which keeps only graphical interfaces
 * (docs/superpowers/specs/2026-10-12-curaduria-interfaces-design.md). They ship
 * in the package, deprecated, until 2.0.0 deletes them together with this file.
 */
export const RETIRED_REASONS = {
  'not-an-interface': 'the gallery keeps only graphical interfaces, and this work is not one',
  'video-game': 'the gallery keeps only graphical interfaces, and video games are outside it',
} as const;
export type RetiredReason = keyof typeof RETIRED_REASONS;

export const RETIRED: Readonly<Record<string, RetiredReason>> = {
  'bauhaus-dessau': 'not-an-interface',
  maeusebunker: 'not-an-interface',
  nakagin: 'not-an-interface',
  'sesc-pompeia': 'not-an-interface',
  carlton: 'not-an-interface',
  'lettera-22': 'not-an-interface',
  'din-1451': 'not-an-interface',
  'munich-72': 'not-an-interface',
  'tokyo-1964': 'not-an-interface',
  'caracas-signage': 'not-an-interface',
  'create-two-three-many-vietnams': 'not-an-interface',
  loteria: 'not-an-interface',
  whaam: 'not-an-interface',
  'dragon-quest': 'video-game',
  'super-mario-bros': 'video-game',
};

export const isRetired = (id: string): boolean => Object.hasOwn(RETIRED, id);

/** The first words of a retired theme's stylesheet. */
export const retiredBanner = (id: string): string => `Deprecated in 1.4.0, removed in 2.0.0: ${RETIRED_REASONS[RETIRED[id]]}.`;
