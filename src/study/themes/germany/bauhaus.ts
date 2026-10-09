import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'bauhaus',
  scene: 'germany',
  nativeScheme: 'light',
  name: { es: 'Bauhaus', en: 'Bauhaus' },
  tagline: { es: 'La reducción de la forma a su esencia dialéctica: geometría absoluta y tensión cromática primaria.', en: 'The reduction of form to its dialectical essence: absolute geometry and primary chromatic tension.' },
  reference: {
    title: { es: 'Staatliches Bauhaus', en: 'Staatliches Bauhaus' },
    authors: ['Walter Gropius', 'Johannes Itten', 'Wassily Kandinsky'],
    date: [1919, 1933],
    place: { es: 'Weimar / Dessau / Berlín, Alemania', en: 'Weimar / Dessau / Berlin, Germany' },
    kind: 'graphic',
    sources: [
      {
        title: 'Bauhaus Manifesto and Program',
        url: 'https://archive.org/details/bauhaus-manifesto',
        publisher: 'Staatliches Bauhaus (Internet Archive)',
        year: 1919,
        accessed: '2026-10-08',
      },
      {
        title: 'Bauhaus',
        url: 'https://en.wikipedia.org/wiki/Bauhaus',
        publisher: 'Wikipedia',
        accessed: '2026-10-08',
      }
    ],
  },
  ficha: {
    documented: {
      es: 'Fundada en 1919 por Walter Gropius, la Staatliches Bauhaus desmanteló la jerarquía entre bellas artes y oficios para forjar una nueva ontología material. Su legado trasciende la mera estética: es una filosofía sistemática que articula el espacio mediante volúmenes platónicos, una paleta restringida a la triada primaria (rojo, amarillo, azul) y una austeridad estructural desprovista de concesiones ornamentales [1][2].',
      en: 'Founded in 1919 by Walter Gropius, the Staatliches Bauhaus dismantled the hierarchy between fine arts and crafts to forge a new material ontology. Its legacy transcends mere aesthetics: it is a systematic philosophy that articulates space through platonic volumes, a palette restricted to the primary triad (red, yellow, blue), and a structural austerity devoid of ornamental concessions [1][2].',
    },
    reading: {
      es: 'Este sistema transpone el rigor programático de la escuela al dominio digital: el plano interactivo se concibe como una cuadrícula de rectángulos precisos, carentes de radio, donde el contraste tipográfico agudo y la aplicación dogmática del pigmento primario rigen la jerarquía visual de cada estado.',
      en: 'This system transposes the school’s programmatic rigor into the digital domain: the interactive plane is conceived as a grid of precise, unyielding rectangles, where sharp typographic contrast and the dogmatic application of primary pigment govern the visual hierarchy of each state.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'Tonos constructivos: Carmín (Acento), Azul Cobalto (Primario) y Ocre Amarillo (Advertencia). El sustrato invoca el grano táctil de un papel crudo, anclado por la severidad del negro carbón.',
        en: 'Constructive tones: Carmine (Accent), Cobalt Blue (Primary), and Yellow Ochre (Warning). The substrate invokes the tactile grain of raw paper, anchored by the severity of charcoal black.',
      },
    },
  },
  fonts: 'system-sans',
  colors: {
    bg: ['#f8f6f3', '#161616'],
    fg: ['#141414', '#e6e3dd'],
    fgMuted: ['#666666', '#a3a3a3'],
    surface: ['#fcfdfd', '#1f1f1f'],
    surfaceAlt: ['#edeae1', '#2c2c2c'],
    border: ['#1c1c1c', '#e0ddcd'],
    primary: ['#1a4b82', '#4b8ad6'],
    primaryFg: ['#fcfdfd', '#0d0d0d'],
    accent: ['#ba1c20', '#de4c4f'],
    accentFg: ['#fcfdfd', '#0d0d0d'],
    info: ['#1a4b82', '#4b8ad6'],
    infoFg: ['#fcfdfd', '#0d0d0d'],
    success: ['#1c1c1c', '#e6e3dd'],
    successFg: ['#f8f6f3', '#141414'],
    warning: ['#d19b00', '#f2c638'],
    warningFg: ['#141414', '#141414'],
    danger: ['#ba1c20', '#ef5b5e'],
    dangerFg: ['#fcfdfd', '#0d0d0d'],
    focus: ['#ba1c20', '#ef5b5e'],
  },
  type: { weightBody: 500, weightLabel: 700, weightDisplay: 900 },
  shape: { borderWidth: 2, radius: 0, radiusControl: 0, radiusButton: 0, radiusSmall: 0 },
  elevation: flat(),
  motion: { duration: 0, durationSlow: 0, ease: 'linear' },
  signature: './bauhaus.css',
});
