import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'mac-os-classic',
  scene: 'usa',
  nativeScheme: 'light',
  name: { es: 'Mac OS System 7', en: 'Mac OS System 7' },
  tagline: { es: 'Claridad atemporal y rayas finas: la edad de oro del racionalismo bidimensional.', en: 'Timeless clarity and pinstripes: the golden age of two-dimensional rationalism.' },
  reference: {
    title: { es: 'Mac OS System 7 (interfaz gráfica)', en: 'Mac OS System 7 (graphical user interface)' },
    authors: ['Apple Computer'],
    date: 1991,
    place: { es: 'Cupertino, Estados Unidos', en: 'Cupertino, United States' },
    kind: 'software',
    sources: [
      {
        title: 'Macintosh Human Interface Guidelines',
        url: 'https://archive.org/details/macintoshhumanin00appl',
        publisher: 'Addison-Wesley (Internet Archive)',
        year: 1992,
        accessed: '2026-10-08',
      },
      {
        title: 'System 7',
        url: 'https://en.wikipedia.org/wiki/System_7',
        publisher: 'Wikipedia',
        accessed: '2026-10-08',
      }
    ],
  },
  ficha: {
    documented: {
      es: 'System 7 refinó la experiencia Macintosh con una sofisticación sutil. Introdujo un relieve comedido y contornos de un solo píxel que aportaron profundidad sin comprometer la pureza gráfica de su linaje [1][2].',
      en: 'System 7 refined the Macintosh experience with subtle sophistication. It introduced restrained relief and single-pixel contours that added depth without compromising the graphical purity of its lineage [1][2].',
    },
    reading: {
      es: 'Esta interpretación destila la esencia del Mac clásico. Los grises cálidos reemplazan el ruido del tramado original, mientras que sus finos bordes y superficies planas capturan una estética racionalista y profundamente elegante.',
      en: 'This interpretation distills the essence of the classic Mac. Warm grays replace the noise of the original stippling, while its fine edges and flat surfaces capture a deeply elegant, rationalist aesthetic.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'Mantenemos un enfoque monocromático de alta legibilidad, empleando un rico tono obsidiana en lugar del negro puro para otorgar una suavidad contemporánea a la austeridad estructural del diseño.',
        en: 'We maintain a highly legible monochromatic approach, employing a rich obsidian tone instead of pure black to grant contemporary softness to the structural austerity of the design.',
      },
    },
  },
  fonts: 'system-sans',
  colors: {
    bg: ['#ffffff', '#111111'],
    fg: ['#111111', '#ffffff'],
    fgMuted: ['#555555', '#b3b3b3'],
    surface: ['#ffffff', '#111111'],
    surfaceAlt: ['#f0f0f0', '#1a1a1a'],
    border: ['#111111', '#ffffff'],
    primary: ['#111111', '#ffffff'],
    primaryFg: ['#ffffff', '#111111'],
    accent: ['#111111', '#ffffff'],
    accentFg: ['#ffffff', '#111111'],
    info: ['#111111', '#ffffff'],
    infoFg: ['#ffffff', '#111111'],
    success: ['#111111', '#ffffff'],
    successFg: ['#ffffff', '#111111'],
    warning: '#111111',
    warningFg: '#ffffff',
    danger: ['#111111', '#ffffff'],
    dangerFg: ['#ffffff', '#111111'],
    focus: ['#111111', '#ffffff'],
  },
  type: { weightBody: 400, weightLabel: 700, weightDisplay: 700 },
  shape: { borderWidth: 1, radius: 4, radiusControl: 4, radiusButton: 4, radiusSmall: 2 },
  elevation: flat(),
  motion: { duration: 150, durationSlow: 300, ease: 'ease-out' },
  signature: './mac-os-classic.css',
});
