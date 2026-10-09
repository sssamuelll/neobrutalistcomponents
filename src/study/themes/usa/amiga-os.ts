import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'amiga-os',
  scene: 'usa',
  nativeScheme: 'light',
  name: { es: 'Amiga Workbench', en: 'Amiga Workbench' },
  tagline: { es: 'La audacia cromática de una era: azul profundo, blanco prístino y naranja vibrante esculpiendo el albor multimedia.', en: 'The chromatic audacity of an era: deep blue, pristine white, and vibrant orange sculpting the multimedia dawn.' },
  reference: {
    title: { es: 'Amiga Workbench 1.3', en: 'Amiga Workbench 1.3' },
    authors: ['Commodore International'],
    date: 1988,
    place: { es: 'West Chester, Estados Unidos', en: 'West Chester, United States' },
    kind: 'software',
    sources: [
      {
        title: 'Amiga ROM Kernel Manual: Libraries',
        url: 'https://archive.org/details/Amiga_ROM_Kernel_Manual_Libraries_1991_Commodore',
        publisher: 'Commodore-Amiga, Inc. (Internet Archive)',
        year: 1991,
        accessed: '2026-10-08',
      },
      {
        title: 'AmigaOS',
        url: 'https://en.wikipedia.org/wiki/AmigaOS',
        publisher: 'Wikipedia',
        accessed: '2026-10-08',
      }
    ],
  },
  ficha: {
    documented: {
      es: 'Amiga Workbench 1.3 trascendió su tiempo como un lienzo pionero. Su entorno fluido instauró un paradigma donde la forma y la función convergían en un ecosistema vibrante de ventanas a todo color [1][2].',
      en: 'Amiga Workbench 1.3 transcended its time as a pioneering canvas. Its fluid environment established a paradigm where form and function converged within a vibrant ecosystem of full-color windows [1][2].',
    },
    reading: {
      es: 'La paleta es una declaración de intenciones. Al limitar las opciones cromáticas, el diseño evoca la materialidad de la memoria de video temprana. Bloques sólidos y contrastes absolutos prescinden de las sombras, forjando una estética cruda y monumental.',
      en: 'The palette is a declaration of intent. By restricting chromatic choices, the design evokes the materiality of early video memory. Solid blocks and absolute contrasts dispense with shadows, forging a raw and monumental aesthetic.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'Conservando la integridad del azul #0055aa original, el tono naranja ha sido finamente equilibrado para dialogar con fondos más profundos y sofisticados, garantizando la legibilidad exigida por los estándares contemporáneos.',
        en: 'Preserving the integrity of the original #0055aa blue, the orange hue has been finely balanced to converse with deeper, sophisticated backgrounds, ensuring the legibility demanded by contemporary standards.',
      },
    },
  },
  fonts: 'system-sans',
  colors: {
    bg: ['#004488', '#111111'],
    fg: ['#ffffff', '#ffffff'],
    fgMuted: ['#ffc266', '#ffaa00'],
    surface: ['#004488', '#111111'],
    surfaceAlt: ['#003870', '#1a1a1a'],
    border: ['#ffaa00', '#ffffff'],
    primary: ['#ffffff', '#ffffff'],
    primaryFg: ['#004488', '#111111'],
    accent: ['#ffaa00', '#cc8800'],
    accentFg: ['#111111', '#111111'],
    info: ['#ffffff', '#66a3ff'],
    infoFg: ['#004488', '#111111'],
    success: ['#ffffff', '#ffffff'],
    successFg: ['#004488', '#111111'],
    warning: ['#ffaa00', '#cc8800'],
    warningFg: ['#111111', '#111111'],
    danger: ['#ffaa00', '#ffffff'],
    dangerFg: ['#111111', '#111111'],
    focus: ['#ffaa00', '#ffaa00'],
  },
  type: { weightBody: 500, weightLabel: 700, weightDisplay: 700 },
  shape: { borderWidth: 2, radius: 2, radiusControl: 2, radiusButton: 2, radiusSmall: 1 },
  elevation: flat(),
  motion: { duration: 150, durationSlow: 300, ease: 'ease-out' },
  signature: './amiga-os.css',
});
