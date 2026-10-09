import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'swiss-design',
  scene: 'germany',
  nativeScheme: 'light',
  name: { es: 'Swiss Design', en: 'Swiss Design' },
  tagline: { es: 'La objetividad de la retícula y la elocuencia silenciosa del espacio negativo.', en: 'The objectivity of the grid and the silent eloquence of negative space.' },
  reference: {
    title: { es: 'Estilo Tipográfico Internacional', en: 'International Typographic Style' },
    authors: ['Josef Müller-Brockmann', 'Armin Hofmann', 'Ernst Keller'],
    date: [1950, 1970],
    place: { es: 'Zúrich / Basilea, Suiza', en: 'Zurich / Basel, Switzerland' },
    kind: 'graphic',
    sources: [
      {
        title: 'Grid Systems in Graphic Design',
        url: 'https://archive.org/details/gridsystemsingra0000mull',
        publisher: 'Josef Müller-Brockmann (Internet Archive)',
        year: 1981,
        accessed: '2026-10-08',
      },
      {
        title: 'International Typographic Style',
        url: 'https://en.wikipedia.org/wiki/International_Typographic_Style',
        publisher: 'Wikipedia',
        accessed: '2026-10-08',
      }
    ],
  },
  ficha: {
    documented: {
      es: 'Articulado en la Suiza de posguerra, el Estilo Tipográfico Internacional redefinió la comunicación visual como una ciencia de extrema claridad. Rechazando la subjetividad en favor de un orden universal, se fundamentó en cuadrículas asimétricas matemáticamente precisas, la objetividad fotográfica sin adornos y la introducción monumental de tipos grotescos sin gracias, cristalizando finalmente en la omnipresencia de Helvetica [1][2].',
      en: 'Articulated in post-war Switzerland, the International Typographic Style redefined visual communication as a science of extreme clarity. Rejecting subjectivity in favor of universal order, it was grounded in mathematically precise asymmetrical grids, unadorned photographic objectivity, and the monumental introduction of grotesque sans-serif typefaces, ultimately crystallizing in the omnipresence of Helvetica [1][2].',
    },
    reading: {
      es: 'Una destilación de la interfaz hasta su núcleo estructural. Se despoja de toda superficialidad para exhibir el esqueleto subyacente del contenido. La paleta se somete a un ascetismo bicromático de blanco y negro, perforado únicamente por intervenciones calculadas de un rojo cadmio resonante que dictamina la atención del usuario.',
      en: 'A distillation of the interface to its structural core. It strips away all superficiality to exhibit the underlying skeleton of the content. The palette submits to a bichromatic asceticism of black and white, punctured only by calculated interventions of a resonant cadmium red that commands the user\'s attention.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'Ecos de Müller-Brockmann: un vacío compositivo prístino, modulado por negro ébano y el icónico rojo señalético.',
        en: 'Echoes of Müller-Brockmann: a pristine compositional void, modulated by ebony black and the iconic signal red.',
      },
    },
  },
  fonts: 'system-sans',
  colors: {
    bg: ['#faf9f7', '#121212'],
    fg: ['#151515', '#f5f5f5'],
    fgMuted: ['#6a6a6a', '#9e9e9e'],
    surface: ['#ffffff', '#1a1a1a'],
    surfaceAlt: ['#ebeae8', '#262626'],
    border: ['#1c1c1c', '#e6e6e6'],
    primary: ['#1a1a1a', '#f5f5f5'],
    primaryFg: ['#ffffff', '#121212'],
    accent: ['#bf1d1d', '#e64545'],
    accentFg: ['#ffffff', '#121212'],
    info: ['#1a1a1a', '#f5f5f5'],
    infoFg: ['#ffffff', '#121212'],
    success: ['#1a1a1a', '#f5f5f5'],
    successFg: ['#ffffff', '#121212'],
    warning: ['#1a1a1a', '#f5f5f5'],
    warningFg: ['#ffffff', '#121212'],
    danger: ['#bf1d1d', '#ff5c5c'],
    dangerFg: ['#ffffff', '#121212'],
    focus: ['#bf1d1d', '#ff5c5c'],
  },
  type: { weightBody: 400, weightLabel: 600, weightDisplay: 800 },
  shape: { borderWidth: 1, radius: 0, radiusControl: 0, radiusButton: 0, radiusSmall: 0 },
  elevation: flat(),
  motion: { duration: 150, durationSlow: 300, ease: 'ease-out' },
  signature: './swiss-design.css',
});
