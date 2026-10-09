import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'material-design',
  scene: 'usa',
  nativeScheme: 'light',
  name: { es: 'Material Design', en: 'Material Design' },
  tagline: { es: 'La coreografía de la materia: elevación, luz y geometría cuántica.', en: 'The choreography of matter: elevation, light, and quantum geometry.' },
  reference: {
    title: { es: 'Material Design', en: 'Material Design' },
    authors: ['Google'],
    date: 2014,
    place: { es: 'Mountain View, Estados Unidos', en: 'Mountain View, United States' },
    kind: 'graphic',
    sources: [
      {
        title: 'Material Design guidelines (archive)',
        url: 'https://archive.org/details/material-design-guidelines',
        publisher: 'Google (Internet Archive)',
        year: 2014,
        accessed: '2026-10-08',
      },
      {
        title: 'Material Design',
        url: 'https://en.wikipedia.org/wiki/Material_Design',
        publisher: 'Wikipedia',
        accessed: '2026-10-08',
      }
    ],
  },
  ficha: {
    documented: {
      es: 'Material Design conceptualizó la interfaz como un espacio físico regido por leyes físicas imaginarias. La superficie se transformó en "papel mágico", interactuando dinámicamente con la luz y la sombra para establecer una jerarquía arquitectónica profunda y racional [1][2].',
      en: 'Material Design conceptualized the interface as a physical space governed by imaginary physical laws. The surface was transformed into "magic paper," interacting dynamically with light and shadow to establish a profound and rational architectural hierarchy [1][2].',
    },
    reading: {
      es: 'Este estudio refina el concepto espacial, utilizando elevaciones delicadas para separar planos y una paleta matizada que suaviza el impacto del Indigo y el Pink clásicos, otorgando una serenidad escultural a los componentes.',
      en: 'This study refines the spatial concept, using delicate elevations to separate planes and a nuanced palette that softens the impact of the classic Indigo and Pink, granting a sculptural serenity to the components.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'Tonos índigo profundos y corales sofisticados reemplazan la estridencia original, anclados por grises pizarrosos que aportan gravedad y balance.',
        en: 'Deep indigo tones and sophisticated corals replace the original stridency, anchored by slate grays that provide gravity and balance.',
      },
    },
  },
  fonts: 'system-sans',
  colors: {
    bg: ['#f6f7f9', '#131314'],
    fg: ['#1a1a1c', '#e8e8ea'],
    fgMuted: ['#63646b', '#9da0a8'],
    surface: ['#ffffff', '#1d1e21'],
    surfaceAlt: ['#f0f1f4', '#282a2e'],
    border: ['#7c808a', '#686b73'],
    primary: ['#46539e', '#8391db'],
    primaryFg: ['#ffffff', '#101321'],
    accent: ['#a83262', '#e0749d'],
    accentFg: ['#ffffff', '#260513'],
    info: ['#1978ad', '#62b1e0'],
    infoFg: ['#ffffff', '#051926'],
    success: ['#33783c', '#7ac283'],
    successFg: ['#ffffff', '#0a1c0d'],
    warning: ['#c46a16', '#e69a50'],
    warningFg: ['#17191c', '#2b1402'],
    danger: ['#b33232', '#e67777'],
    dangerFg: ['#ffffff', '#260404'],
    focus: ['#46539e', '#9ba6e6'],
  },
  type: { weightBody: 400, weightLabel: 500, weightDisplay: 400 },
  shape: { borderWidth: 1, radius: 6, radiusControl: 6, radiusButton: 6, radiusSmall: 4 },
  elevation: flat(),
  motion: { duration: 300, durationSlow: 500, ease: 'cubic-bezier(0.2, 0.0, 0, 1)' },
  signature: './material-design.css',
});
