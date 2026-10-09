import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'xerox-star',
  scene: 'usa',
  nativeScheme: 'light',
  name: { es: 'Xerox Star', en: 'Xerox Star' },
  tagline: { es: 'La génesis de la interacción digital: elegancia dicotómica en un prístino blanco y negro.', en: 'The genesis of digital interaction: dichotomous elegance in pristine black and white.' },
  reference: {
    title: { es: 'Xerox Star (8010 Information System)', en: 'Xerox Star (8010 Information System)' },
    authors: ['Xerox PARC', 'Xerox Systems Development Department'],
    date: 1981,
    place: { es: 'Palo Alto, Estados Unidos', en: 'Palo Alto, United States' },
    kind: 'software',
    sources: [
      {
        title: 'Designing the Star User Interface',
        url: 'https://archive.org/details/byte-magazine-1982-04',
        publisher: 'BYTE Magazine (Internet Archive)',
        year: 1982,
        accessed: '2026-10-08',
      },
      {
        title: 'Xerox Star',
        url: 'https://en.wikipedia.org/wiki/Xerox_Star',
        publisher: 'Wikipedia',
        accessed: '2026-10-08',
      }
    ],
  },
  ficha: {
    documented: {
      es: 'Gestada en los laboratorios de Xerox PARC, esta interfaz monumental introdujo al mundo el paradigma WIMP. Su arquitectura monocromática sentó los cimientos ontológicos de la computación personal moderna [1][2].',
      en: 'Conceived in the laboratories of Xerox PARC, this monumental interface introduced the WIMP paradigm to the world. Its monochromatic architecture laid the ontological foundations of modern personal computing [1][2].',
    },
    reading: {
      es: 'Un homenaje a la pureza del tubo de rayos catódicos. La ausencia total de grises impone una geometría estricta y de alto contraste, revelando la estructura ósea de la interfaz gráfica sin artificios cromáticos.',
      en: 'An homage to the purity of the cathode-ray tube. The total absence of grays imposes a strict, high-contrast geometry, revealing the bone structure of the graphical interface without chromatic artifice.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'En reverencia a la pureza visual de la pantalla de un bit, la paleta prescinde de tonos intermedios reales. Se emplean negros intensos y blancos absolutos para evocar la claridad del diseño original con una presencia museística.',
        en: 'In reverence to the visual purity of the one-bit display, the palette dispenses with actual midtones. Intense blacks and absolute whites are employed to evoke the clarity of the original design with museum-like presence.',
      },
    },
  },
  fonts: 'system-serif',
  colors: {
    bg: ['#ffffff', '#111111'],
    fg: ['#111111', '#ffffff'],
    fgMuted: ['#111111', '#ffffff'],
    surface: ['#ffffff', '#111111'],
    surfaceAlt: ['#ffffff', '#111111'],
    border: ['#111111', '#ffffff'],
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
  shape: { borderWidth: 2, radius: 2, radiusControl: 2, radiusButton: 2, radiusSmall: 1 },
  elevation: flat(),
  motion: { duration: 150, durationSlow: 300, ease: 'ease-out' },
  signature: './xerox-star.css',
});
