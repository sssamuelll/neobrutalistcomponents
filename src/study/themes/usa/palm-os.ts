import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'palm-os',
  scene: 'usa',
  nativeScheme: 'light',
  name: { es: 'Palm OS', en: 'Palm OS' },
  tagline: { es: 'Ciento sesenta por ciento sesenta puntos, en una pantalla monocroma.', en: 'A hundred and sixty by a hundred and sixty dots, on a monochrome screen.' },
  reference: {
    title: { es: 'Palm OS en el Pilot 1000', en: 'Palm OS on the Pilot 1000' },
    authors: ['Palm Computing', 'Rob Haitani'],
    date: 1996,
    place: { es: 'Estados Unidos', en: 'United States' },
    kind: 'software',
    sources: [
      { title: 'The PalmPilot Story', url: 'https://computerhistory.org/events/palmpilot-story/', publisher: 'Computer History Museum', accessed: '2026-10-10' },
      { title: 'The Design of the Palm Pilot', url: 'https://hci.stanford.edu/seminar/abstracts/97-98/980417-haitani.html', publisher: 'Stanford Seminar on People, Computers, and Design', year: 1998, accessed: '2026-10-10' },
      { title: 'ZX Palm', url: 'https://damieng.com/typography/zx-origins/zx-palm/', publisher: 'DamienG', accessed: '2026-10-10' },
      { title: 'Palm OS Programmer’s Companion: User Interface', url: 'https://www.fuw.edu.pl/~michalj/palmos/UserInterface.html', publisher: 'Palm (mirror)', accessed: '2026-10-10' },
      { title: 'Zen of Palm', url: 'https://archive.org/download/zen-of-palm/zenofpalm.pdf', publisher: 'PalmSource (Internet Archive)', year: 2003, accessed: '2026-10-10' },
    ],
    image: {
      file: 'palm-os.avif',
      width: 933,
      height: 1280,
      alt: {
        es: 'Un Pilot de US Robotics con la pantalla gris verdosa encendida: el lanzador muestra iconos de aplicaciones, abajo la hora y la batería, y debajo el área de escritura de Graffiti.',
        en: 'A US Robotics Pilot with its greenish-grey screen on: the launcher shows application icons, the time and battery below them, and the Graffiti writing area underneath.',
      },
      author: '80sCompaqPC',
      license: 'CC-BY-SA-4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Pilot_1000.jpg',
    },
  },
  ficha: {
    documented: {
      es: 'Con el organizador Pilot y su sistema, Palm OS, la empresa Palm Computing puso en marcha la industria de las computadoras de mano [1]. El primer Pilot salió a la venta en marzo de 1996, con una pantalla monocroma de 160 × 160 puntos [3]. Rob Haitani, su primer gerente de producto, fue el diseñador principal de la interfaz del sistema y de sus aplicaciones, y sostenía que en una pantalla chica no se puede desperdiciar un solo punto [2]. La guía de diseño de Palm explica que estos aparatos se usan a ratos breves y seguidos, como quien mira un reloj y no como quien se sienta ante una computadora [5].',
      en: 'With the Pilot organiser and its system, Palm OS, the company Palm Computing got the handheld computer business going [1]. The first Pilot went on sale in March 1996, with a 160 × 160 monochrome screen [3]. Rob Haitani, its first product manager, was the lead designer of the system’s and its applications’ interface, and held that on a small screen not a single pixel can be wasted [2]. Palm’s design guide explains that these devices are used in short, repeated moments, the way one glances at a watch rather than sits down at a computer [5].',
    },
    reading: {
      es: 'El tema toma la pantalla: un fondo gris verdoso como el del cristal líquido de la fotografía, letras y bordes casi negros, y la acción principal en negro con letras claras. El texto va en una letra de píxeles pequeña y proporcional, y los títulos en otra, en negrita. La fotografía, de 2019, muestra un Pilot con el lanzador de aplicaciones abierto. Nada se mueve.',
      en: 'The theme takes the screen: a greenish-grey ground like the liquid crystal in the photograph, near-black letters and borders, and the primary action in black with light letters. Text is set in a small proportional pixel face, and titles in another, in bold. The photograph, from 2019, shows a Pilot with the application launcher open. Nothing moves.',
    },
    palette: {
      origin: 'sampled',
      note: {
        es: 'Antes de Palm OS 3.0, cada punto de la pantalla era encendido o apagado: un bit, en monocromo [4]. El fondo y las superficies salen de la fotografía del Pilot, donde la pantalla se ve gris verdosa; las letras se oscurecen para que se lean, y los demás colores, y todo el esquema oscuro, son del tema.',
        en: 'Before Palm OS 3.0, each dot on the screen was simply on or off: one bit, in monochrome [4]. The ground and surfaces come from the photograph of the Pilot, where the screen looks greenish grey; the letters are darkened so that they read, and the other colours, and the whole dark scheme, are the theme’s.',
      },
    },
    lettering: {
      original: { name: { es: 'Las letras del sistema: stdFont y boldFont', en: 'The system fonts: stdFont and boldFont' }, year: 1996, kind: 'bitmap' },
      documented: {
        es: 'La pantalla de 160 × 160 obligaba a una letra de mapa de bits pequeña, que aprovechaba el dibujo proporcional para meter más texto, y esa letra no cambió durante muchos años [3]. La guía de programación nombra las letras stdFont y boldFont, y cuenta que largeBoldFont llegó con Palm OS 3.0 [4]. Ninguna fuente que consultamos dice quién las dibujó.',
        en: 'The 160 × 160 screen called for a small bitmap face, which used proportional drawing to fit more text, and that face did not change for many years [3]. The programming guide names the stdFont and boldFont faces, and says largeBoldFont arrived with Palm OS 3.0 [4]. No source we consulted says who drew them.',
      },
      substitute: {
        es: 'El tema usa Tiny5, una letra libre de píxeles, pequeña y proporcional, para el texto, y Pixelify Sans en negrita para los títulos, con las ligaduras apagadas porque las de Pixelify dibujan la fi casi como una A. En la fotografía vemos una letra de píxeles pequeña y redondeada; ninguna de las dos copia sus formas.',
        en: 'The theme uses Tiny5, a small, free, proportional pixel face, for text, and bold Pixelify Sans for titles, with ligatures off because Pixelify’s draw fi almost like an A. In the photograph we see a small, rounded pixel face; neither copies its shapes.',
      },
    },
  },
  fonts: { sans: 'tiny5', display: 'pixelify-sans' },
  colors: {
    bg: ['#c0c5bf', '#1a1d19'],
    fg: ['#1f221e', '#d8ddd6'],
    fgMuted: ['#3f443d', '#a9b0a6'],
    surface: ['#d4d9d2', '#242822'],
    surfaceAlt: ['#e3ede2', '#30352e'],
    border: ['#1f221e', '#d8ddd6'],
    primary: ['#1f221e', '#d8ddd6'],
    primaryFg: 'auto',
    accent: ['#55574f', '#9c9d98'],
    accentFg: 'auto',
    info: ['#264b7a', '#9cb8e0'],
    infoFg: 'auto',
    success: ['#2c5e33', '#8fcf96'],
    successFg: 'auto',
    warning: ['#c9a227', '#e3c15a'],
    warningFg: 'auto',
    danger: ['#8a1f1f', '#ff8a80'],
    dangerFg: 'auto',
    focus: ['#264b7a', '#e3c15a'],
  },
  type: { weightBody: 400, weightLabel: 400, weightDisplay: 700, displaySpacing: '0em', kerning: 'none', featureSettings: '"liga" 0' },
  shape: { borderWidth: 2, radius: 4, radiusControl: 2, radiusButton: 4, radiusSmall: 2 },
  elevation: flat(),
  motion: { duration: 0, durationSlow: 0, ease: 'linear' },
});
