import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'pop-art',
  scene: 'usa',
  nativeScheme: 'light',
  name: { es: 'Pop Art', en: 'Pop Art' },
  tagline: { es: 'La ironía de la producción masiva: semitonos estridentes y el triunfo del consumismo cromático.', en: 'The irony of mass production: strident halftones and the triumph of chromatic consumerism.' },
  reference: {
    title: { es: 'Pop Art', en: 'Pop Art' },
    authors: ['Andy Warhol', 'Roy Lichtenstein', 'Richard Hamilton'],
    date: [1950, 1970],
    place: { es: 'Nueva York, Estados Unidos / Londres, Reino Unido', en: 'New York, United States / London, United Kingdom' },
    kind: 'graphic',
    sources: [
      {
        title: 'Pop Art: A Critical History',
        url: 'https://archive.org/details/popartcriticalhi0000unse',
        publisher: 'University of California Press (Internet Archive)',
        year: 1997,
        accessed: '2026-10-08',
      },
      {
        title: 'Pop art',
        url: 'https://en.wikipedia.org/wiki/Pop_art',
        publisher: 'Wikipedia',
        accessed: '2026-10-08',
      }
    ],
  },
  ficha: {
    documented: {
      es: 'Surgido como una deconstrucción subversiva de la alta cultura, el Pop Art elevó lo banal al estatus de icono. Figuras como Warhol y Lichtenstein se apropiaron de la imaginería comercial y las técnicas industriales, saturando sus lienzos con cuatricromía CMYK, gruesos contornos de tinta y la persistente trama de los puntos Ben-Day, disolviendo así la frontera entre el arte sacro y el consumo de masas [1][2].',
      en: 'Emerging as a subversive deconstruction of high culture, Pop Art elevated the banal to iconic status. Figures like Warhol and Lichtenstein appropriated commercial imagery and industrial techniques, saturating their canvases with CMYK process colors, heavy ink outlines, and the relentless mechanical screen of Ben-Day dots, thereby dissolving the boundary between sacred art and mass consumption [1][2].',
    },
    reading: {
      es: 'Un asalto sensorial que abraza la estética del cómic impreso. Los componentes se delimitan con contornos de un negro denso y audaz que exageran el volumen bidimensional, apoyándose sobre campos saturados de cian, magenta y amarillo, emulando la imperfección mecánica de la prensa rotativa.',
      en: 'A sensory assault that embraces the aesthetic of the printed comic. Components are delineated with dense, audacious black outlines that exaggerate two-dimensional volume, resting upon saturated fields of cyan, magenta, and yellow, emulating the mechanical imperfection of the rotary press.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'La cuatricromía industrial (Cian, Magenta, Amarillo, Negro) calibrada para irradiar una vibración casi sintética en pantallas.',
        en: 'Industrial four-color process (Cyan, Magenta, Yellow, Key) calibrated to radiate an almost synthetic vibration on screens.',
      },
    },
  },
  fonts: 'system-sans',
  colors: {
    bg: ['#faef32', '#1a0b1c'],
    fg: ['#0d0d0d', '#f2f2f2'],
    fgMuted: ['#383838', '#cfcfcf'],
    surface: ['#fcfcfc', '#141414'],
    surfaceAlt: ['#e3e3e3', '#2b2b2b'],
    border: ['#0a0a0a', '#f5f5f5'],
    primary: ['#12aeb5', '#2bd9e0'],
    primaryFg: ['#0d0d0d', '#0d0d0d'],
    accent: ['#d11f7e', '#eb429c'],
    accentFg: ['#ffffff', '#0a0a0a'],
    info: ['#12aeb5', '#2bd9e0'],
    infoFg: ['#0d0d0d', '#0d0d0d'],
    success: ['#35b54a', '#4bdb63'],
    successFg: ['#0a0a0a', '#0d0d0d'],
    warning: ['#eab510', '#fce230'],
    warningFg: ['#0a0a0a', '#0a0a0a'],
    danger: ['#d62424', '#f04343'],
    dangerFg: ['#ffffff', '#0a0a0a'],
    focus: ['#0a0a0a', '#2bd9e0'],
  },
  type: { weightBody: 600, weightLabel: 800, weightDisplay: 900 },
  shape: { borderWidth: 4, radius: 0, radiusControl: 0, radiusButton: 0, radiusSmall: 0 },
  elevation: flat(),
  motion: { duration: 100, durationSlow: 200, ease: 'linear' },
  signature: './pop-art.css',
});
