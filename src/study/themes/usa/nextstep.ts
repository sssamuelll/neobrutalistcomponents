import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'nextstep',
  scene: 'usa',
  nativeScheme: 'light',
  name: { es: 'NeXTSTEP', en: 'NeXTSTEP' },
  tagline: { es: 'El cincelado del futuro: elegancia fundacional tallada en una sinfonía de grises.', en: 'The chiseling of the future: foundational elegance carved in a symphony of grays.' },
  reference: {
    title: { es: 'NeXTSTEP', en: 'NeXTSTEP' },
    authors: ['NeXT Computer, Inc.'],
    date: 1989,
    place: { es: 'Redwood City, Estados Unidos', en: 'Redwood City, United States' },
    kind: 'software',
    sources: [
      {
        title: 'NeXTSTEP User Interface Guidelines',
        url: 'https://archive.org/details/nextstep-user-interface-guidelines',
        publisher: 'NeXT Computer, Inc. (Internet Archive)',
        year: 1992,
        accessed: '2026-10-08',
      },
      {
        title: 'NeXTSTEP',
        url: 'https://en.wikipedia.org/wiki/NeXTSTEP',
        publisher: 'Wikipedia',
        accessed: '2026-10-08',
      }
    ],
  },
  ficha: {
    documented: {
      es: 'Una obra maestra de diseño concebida como el futuro del trabajo profesional. Su estética de biseles prominentes no solo dictó el lenguaje visual de la década de 1990, sino que sirvió de entorno fundacional para la World Wide Web [1][2].',
      en: 'A design masterpiece conceived as the future of professional work. Its aesthetic of prominent bevels not only dictated the visual language of the 1990s but served as the foundational environment for the World Wide Web [1][2].',
    },
    reading: {
      es: 'Un ejercicio de rigor arquitectónico. Los contrastes de iluminación simulan un relieve pesado e institucional. La interfaz abandona la planitud para presentarse como una máquina sólida y finamente calibrada.',
      en: 'An exercise in architectural rigor. The lighting contrasts simulate a heavy, institutional relief. The interface abandons flatness to present itself as a solid, finely calibrated machine.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'Los grises neutros se despliegan para crear un contraste tridimensional majestuoso. Se ha sustituido el negro absoluto por un tono ónix profundo, enriqueciendo la percepción de sus famosos bordes cincelados.',
        en: 'Neutral grays unfold to create majestic three-dimensional contrast. Absolute black has been replaced with a deep onyx tone, enriching the perception of its famous chiseled edges.',
      },
    },
  },
  fonts: 'system-sans',
  colors: {
    bg: ['#bfbfbf', '#1a1a1a'],
    fg: ['#111111', '#ffffff'],
    fgMuted: ['#444444', '#b3b3b3'],
    surface: ['#bfbfbf', '#222222'],
    surfaceAlt: ['#dddddd', '#2e2e2e'],
    border: ['#111111', '#888888'],
    primary: ['#111111', '#ffffff'],
    primaryFg: ['#ffffff', '#111111'],
    accent: ['#111111', '#ffffff'],
    accentFg: ['#ffffff', '#111111'],
    info: ['#111111', '#ffffff'],
    infoFg: ['#ffffff', '#111111'],
    success: ['#111111', '#ffffff'],
    successFg: ['#ffffff', '#111111'],
    warning: ['#111111', '#ffffff'],
    warningFg: ['#ffffff', '#111111'],
    danger: ['#111111', '#ffffff'],
    dangerFg: ['#ffffff', '#111111'],
    focus: ['#111111', '#ffffff'],
  },
  type: { weightBody: 400, weightLabel: 700, weightDisplay: 700 },
  shape: { borderWidth: 1, radius: 2, radiusControl: 2, radiusButton: 2, radiusSmall: 1 },
  elevation: flat(),
  motion: { duration: 150, durationSlow: 300, ease: 'ease-out' },
  signature: './nextstep.css',
});
