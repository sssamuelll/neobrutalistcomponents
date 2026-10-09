import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'aqua',
  scene: 'usa',
  nativeScheme: 'light',
  name: { es: 'Mac OS X Aqua', en: 'Mac OS X Aqua' },
  tagline: { es: 'La fluidez del cristal líquido: una sinfonía de translucidez, profundidad y tacto digital.', en: 'The fluidity of liquid crystal: a symphony of translucency, depth, and digital tactility.' },
  reference: {
    title: { es: 'Mac OS X (interfaz Aqua)', en: 'Mac OS X (Aqua interface)' },
    authors: ['Apple Computer'],
    date: 2000,
    place: { es: 'Cupertino, Estados Unidos', en: 'Cupertino, United States' },
    kind: 'software',
    sources: [
      {
        title: 'Apple Human Interface Guidelines',
        url: 'https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/OSXHIGuidelines/',
        publisher: 'Apple Computer',
        year: 2000,
        accessed: '2026-10-08',
      },
      {
        title: 'Aqua (user interface)',
        url: 'https://en.wikipedia.org/wiki/Aqua_(user_interface)',
        publisher: 'Wikipedia',
        accessed: '2026-10-08',
      }
    ],
  },
  ficha: {
    documented: {
      es: 'Revelada en el alba del milenio, la interfaz Aqua representó una ruptura poética con el paradigma bidimensional. A través de transparencias intrincadas, sombras hiperrealistas y una materialidad acuática, transformó la pantalla en un espacio tridimensional de pura seducción táctil [1][2].',
      en: 'Unveiled at the dawn of the millennium, the Aqua interface represented a poetic rupture from the two-dimensional paradigm. Through intricate transparencies, hyper-realistic shadows, and an aquatic materiality, it transformed the screen into a three-dimensional space of pure tactile seduction [1][2].',
    },
    reading: {
      es: 'Este estudio captura la esencia de la estética gelatinosa, refinando los gradientes cerúleos y los bordes esculpidos. Las sombras profundas anclan la interfaz, mientras que los fondos evocan la melancolía de las texturas primigenias.',
      en: 'This study captures the essence of the gelatinous aesthetic, refining the cerulean gradients and sculpted edges. Deep shadows anchor the interface, while the backgrounds evoke the melancholy of primordial textures.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'Una orquestación de azul marino luminoso y grises platino etéreos, diseñados para evocar la claridad del cristal y la quietud del agua.',
        en: 'An orchestration of luminous marine blue and ethereal platinum grays, designed to evoke the clarity of glass and the stillness of water.',
      },
    },
  },
  fonts: 'system-sans',
  colors: {
    bg: ['#f4f5f6', '#161719'],
    fg: ['#1a1c20', '#e6e8eb'],
    fgMuted: ['#5c6068', '#9aa0a8'],
    surface: ['#ffffff', '#202225'],
    surfaceAlt: ['#eceff1', '#2a2d32'],
    border: ['#7a808a', '#666b73'],
    primary: ['#2862a9', '#6b9eeb'],
    primaryFg: ['#ffffff', '#0d131a'],
    accent: ['#2862a9', '#6b9eeb'],
    accentFg: ['#ffffff', '#0d131a'],
    info: ['#2862a9', '#6b9eeb'],
    infoFg: ['#ffffff', '#0d131a'],
    success: ['#2b763e', '#5cbd70'],
    successFg: ['#ffffff', '#0d1510'],
    warning: ['#e6a800', '#eebf42'],
    warningFg: ['#1a1c20', '#1a1400'],
    danger: ['#ba3636', '#eb6b6b'],
    dangerFg: ['#ffffff', '#1a0505'],
    focus: ['#2862a9', '#8cb5f2'],
  },
  type: { weightBody: 400, weightLabel: 600, weightDisplay: 600 },
  shape: { borderWidth: 1, radius: 8, radiusControl: 16, radiusButton: 20, radiusSmall: 4 },
  elevation: flat(),
  motion: { duration: 300, durationSlow: 500, ease: 'cubic-bezier(0.25, 1, 0.5, 1)' },
  signature: './aqua.css',
});
