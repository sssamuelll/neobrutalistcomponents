import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'memphis',
  scene: 'usa',
  nativeScheme: 'light',
  name: { es: 'Memphis Group', en: 'Memphis Group' },
  tagline: { es: 'La emancipación del dogma racionalista: un vocabulario lúdico de geometría excéntrica y cromatismo rebelde.', en: 'The emancipation from rationalist dogma: a playful vocabulary of eccentric geometry and rebellious chromatics.' },
  reference: {
    title: { es: 'Memphis Design', en: 'Memphis Design' },
    authors: ['Ettore Sottsass', 'Nathalie du Pasquier', 'Peter Shire'],
    date: [1981, 1988],
    place: { es: 'Milán, Italia / Popularizado globalmente', en: 'Milan, Italy / Popularized globally' },
    kind: 'object',
    sources: [
      {
        title: 'Memphis: Research, Experiences, Results, Failures and Successes of New Design',
        url: 'https://archive.org/details/memphis00sott',
        publisher: 'Rizzoli (Internet Archive)',
        year: 1984,
        accessed: '2026-10-08',
      },
      {
        title: 'Memphis Group',
        url: 'https://en.wikipedia.org/wiki/Memphis_Group',
        publisher: 'Wikipedia',
        accessed: '2026-10-08',
      }
    ],
  },
  ficha: {
    documented: {
      es: 'Irrumpiento en Milán en 1981, el Grupo Memphis fue el antídoto posmoderno contra la austeridad del buen diseño modernista. Sottsass y sus acólitos orquestaron un carnaval semiótico que fusionaba el Art Déco, el Pop y el kitsch de los años 50, empleando laminados plásticos, texturas de terrazo salvaje y una paleta discordante que redefinió el espíritu visual de una década [1][2].',
      en: 'Erupting in Milan in 1981, the Memphis Group was the postmodern antidote to the austerity of modernist good design. Sottsass and his acolytes orchestrated a semiotic carnival that fused Art Deco, Pop, and 1950s kitsch, deploying plastic laminates, wild terrazzo textures, and a discordant palette that redefined the visual zeitgeist of a decade [1][2].',
    },
    reading: {
      es: 'Una sintaxis de irreverencia calculada. Los elementos de la interfaz se comportan como artefactos escultóricos, flotando en espacios dominados por pasteles vibrantes y el inconfundible rastro del patrón "Bacterio". Los radios pronunciados y las interacciones táctiles exageradas remiten al encanto táctil de un mobiliario insubordinado.',
      en: 'A syntax of calculated irreverence. Interface elements behave as sculptural artifacts, floating in spaces dominated by vibrant pastels and the unmistakable trail of the "Bacterio" pattern. Pronounced radii and exaggerated tactile interactions recall the haptic charm of insubordinate furniture.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'Tonos pasteles neón —rosa flamenco destellante, menta eléctrica y amarillo cadmio— anclados por la gravedad gráfica de trazos oscuros.',
        en: 'Neon pastel hues—flashing flamingo pink, electric mint, and cadmium yellow—anchored by the graphic gravity of dark strokes.',
      },
    },
  },
  fonts: 'system-sans',
  colors: {
    bg: ['#fdf3e6', '#261b33'],
    fg: ['#121212', '#f2f2f2'],
    fgMuted: ['#595959', '#b8b8b8'],
    surface: ['#fcfcfc', '#171717'],
    surfaceAlt: ['#fae1e8', '#342642'],
    border: ['#141414', '#e8e8e8'],
    primary: ['#10a5cc', '#3acfed'],
    primaryFg: ['#0d0d0d', '#0a0a0a'],
    accent: ['#e33b76', '#f55d91'],
    accentFg: ['#0a0a0a', '#0a0a0a'],
    info: ['#10a5cc', '#3acfed'],
    infoFg: ['#0d0d0d', '#0a0a0a'],
    success: ['#17b567', '#3be38e'],
    successFg: ['#0a0a0a', '#0a0a0a'],
    warning: ['#e0c114', '#fce13f'],
    warningFg: ['#0d0d0d', '#0a0a0a'],
    danger: ['#cc1b53', '#e8467b'],
    dangerFg: ['#ffffff', '#0a0a0a'],
    focus: ['#e33b76', '#f55d91'],
  },
  type: { weightBody: 500, weightLabel: 700, weightDisplay: 900 },
  shape: { borderWidth: 3, radius: 16, radiusControl: 16, radiusButton: 999, radiusSmall: 8 },
  elevation: flat(),
  motion: { duration: 200, durationSlow: 400, ease: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
  signature: './memphis.css',
});
