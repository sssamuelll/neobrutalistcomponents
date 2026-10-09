import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'win-xp',
  scene: 'usa',
  nativeScheme: 'light',
  name: { es: 'Windows XP', en: 'Windows XP' },
  tagline: { es: 'Una oda al optimismo digital: superficies líquidas, tacto de cristal y exuberancia cromática.', en: 'An ode to digital optimism: liquid surfaces, glass-like touch, and chromatic exuberance.' },
  reference: {
    title: { es: 'Windows XP (interfaz gráfica de usuario)', en: 'Windows XP (graphical user interface)' },
    authors: ['Microsoft'],
    date: 2001,
    place: { es: 'Redmond, Estados Unidos', en: 'Redmond, United States' },
    kind: 'software',
    sources: [
      {
        title: 'Official Guidelines for User Interface Developers and Designers',
        url: 'https://archive.org/details/windows-xp-guidelines',
        publisher: 'Microsoft Press (Internet Archive)',
        year: 2001,
        accessed: '2026-10-08',
      },
      {
        title: 'Windows XP visual styles',
        url: 'https://en.wikipedia.org/wiki/Windows_XP_visual_styles',
        publisher: 'Wikipedia',
        accessed: '2026-10-08',
      }
    ],
  },
  ficha: {
    documented: {
      es: 'El estilo visual "Luna" rompió la hegemonía del gris corporativo. Abrazando la era del color verdadero, introdujo texturas plásticas, curvas generosas y una luminosidad que transformó el escritorio en un paisaje acogedor [1][2].',
      en: 'The "Luna" visual style broke the hegemony of corporate gray. Embracing the true-color era, it introduced plastic textures, generous curves, and a luminosity that transformed the desktop into a welcoming landscape [1][2].',
    },
    reading: {
      es: 'Este estudio captura la materialidad de la interfaz de principios del milenio. El azul intenso y el verde pradera interactúan sobre superficies envolventes, evocando una nostalgia táctil llena de energía y vitalidad.',
      en: 'This study captures the materiality of the early millennium interface. Intense blue and meadow green interact on enveloping surfaces, evoking a tactile nostalgia full of energy and vitality.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'Conservando la vitalidad icónica del azul "Luna" y el verde pradera, la paleta se ha armonizado para aportar sofisticación. Los tonos oscuros transicionan hacia un carbón profundo para un contraste más elegante.',
        en: 'Retaining the iconic vitality of "Luna" blue and meadow green, the palette has been harmonized to bring sophistication. Dark tones transition into a deep charcoal for a more elegant contrast.',
      },
    },
  },
  fonts: 'system-sans',
  colors: {
    bg: ['#ece9d8', '#1a1a1e'],
    fg: ['#111111', '#ffffff'],
    fgMuted: ['#4a4a4a', '#a1a1aa'],
    surface: ['#ffffff', '#222226'],
    surfaceAlt: ['#f4f3ee', '#2a2a30'],
    border: ['#003399', '#4d7bc9'],
    primary: ['#0055e5', '#3b82f6'],
    primaryFg: ['#ffffff', '#111111'],
    accent: ['#0055e5', '#3b82f6'],
    accentFg: ['#ffffff', '#111111'],
    info: ['#0055e5', '#3b82f6'],
    infoFg: ['#ffffff', '#111111'],
    success: ['#2e7d32', '#4ade80'],
    successFg: ['#ffffff', '#111111'],
    warning: ['#d97706', '#fbbf24'],
    warningFg: ['#111111', '#111111'],
    danger: ['#dc2626', '#f87171'],
    dangerFg: ['#ffffff', '#111111'],
    focus: ['#0055e5', '#3b82f6'],
  },
  type: { weightBody: 400, weightLabel: 600, weightDisplay: 700 },
  shape: { borderWidth: 1, radius: 6, radiusControl: 4, radiusButton: 4, radiusSmall: 2 },
  elevation: flat(),
  motion: { duration: 200, durationSlow: 400, ease: 'ease-out' },
  signature: './win-xp.css',
});
