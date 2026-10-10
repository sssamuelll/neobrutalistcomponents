import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'palm-os',
  scene: 'usa',
  nativeScheme: 'light',
  name: { es: 'Palm OS', en: 'Palm OS' },
  tagline: { es: 'Ciento sesenta por ciento sesenta puntos, en blanco y negro.', en: 'A hundred and sixty by a hundred and sixty dots, in black and white.' },
  reference: {
    title: { es: 'Palm OS en el Pilot 1000', en: 'Palm OS on the Pilot 1000' },
    authors: ['Palm Computing', 'Rob Haitani'],
    date: 1996,
    place: { es: 'Estados Unidos', en: 'United States' },
    kind: 'software',
    sources: [
      { title: 'The PalmPilot Story', url: 'https://computerhistory.org/events/palmpilot-story/', publisher: 'Computer History Museum', accessed: '2026-10-10' },
      { title: 'PalmPilot design process', url: 'https://hci.stanford.edu/seminar/abstracts/97-98/980417-haitani.html', publisher: 'Stanford HCI Seminar', year: 1998, accessed: '2026-10-10' },
      { title: 'ZX Palm', url: 'https://damieng.com/typography/zx-origins/zx-palm/', publisher: 'DamienG', accessed: '2026-10-10' },
      { title: 'Palm OS Programmer’s Companion: User Interface', url: 'https://www.fuw.edu.pl/~michalj/palmos/UserInterface.html', publisher: 'Palm (mirror)', accessed: '2026-10-10' },
      { title: 'Zen of Palm', url: 'https://archive.org/download/zen-of-palm/zenofpalm.pdf', publisher: 'PalmSource (Internet Archive)', accessed: '2026-10-10' },
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
      es: 'Palm Computing lanzó el organizador Pilot y el sistema Palm OS, con los que arrancó la industria de las computadoras de mano [1]. El primer Pilot salió a la venta en marzo de 1996, con una pantalla monocroma de 160 × 160 puntos [3]. Rob Haitani, su primer gerente de producto, fue el diseñador principal de la interfaz del sistema y de sus aplicaciones, y sostenía que en una pantalla chica no se puede desperdiciar un solo punto [2]. La guía de diseño de Palm explica que estos aparatos se usan a ratos breves y seguidos, como quien mira un reloj y no como quien se sienta ante una computadora [5].',
      en: 'Palm Computing launched the Pilot organiser and the Palm OS, which set off the handheld computer industry [1]. The first Pilot went on sale in March 1996, with a 160 × 160 monochrome screen [3]. Rob Haitani, its first product manager, was the lead designer of the system’s and its applications’ interface, and held that on a small screen not a single pixel can be wasted [2]. Palm’s design guide explains that these devices are used in short, repeated moments, the way one glances at a watch rather than sits down at a computer [5].',
    },
    reading: {
      es: 'El tema toma la pantalla: un fondo gris verdoso como el del cristal líquido de la fotografía, letras y bordes casi negros, y la acción principal en negro con letras claras. El texto va en una letra de píxeles proporcional, normal para el texto y negrita para las etiquetas, como stdFont y boldFont. La fotografía, de 2019, muestra un Pilot con el lanzador de aplicaciones abierto. Nada se mueve.',
      en: 'The theme takes the screen: a greenish-grey ground like the liquid crystal in the photograph, near-black letters and borders, and the primary action in black with light letters. Text is set in a proportional pixel face, regular for text and bold for labels, like stdFont and boldFont. The photograph, from 2019, shows a Pilot with the application launcher open. Nothing moves.',
    },
    palette: {
      origin: 'sampled',
      note: {
        es: 'Hasta la versión 3.0, el software de Palm OS solo manejaba gráficos monocromos de un bit por punto [4]. Los valores salen de la fotografía del Pilot, donde la pantalla se ve gris verdosa; las letras se oscurecen para que se lean.',
        en: 'Until version 3.0, the Palm OS software handled only one-bit-per-pixel monochrome graphics [4]. The values come from the photograph of the Pilot, where the screen looks greenish grey; the letters are darkened so that they read.',
      },
    },
    lettering: {
      original: { name: { es: 'Las letras del sistema: stdFont y boldFont', en: 'The system fonts: stdFont and boldFont' }, year: 1996, kind: 'bitmap' },
      documented: {
        es: 'La pantalla de 160 × 160 obligaba a una letra de mapa de bits pequeña, que aprovechaba el dibujo proporcional para meter más texto, y esa letra no cambió durante muchos años [3]. La guía de programación nombra las letras stdFont y boldFont, y cuenta que largeBoldFont llegó con Palm OS 3.0 [4]. Ninguna fuente que consultamos dice quién las dibujó.',
        en: 'The 160 × 160 screen called for a small bitmap face, which used proportional drawing to fit more text, and that face did not change for many years [3]. The programming guide names the stdFont and boldFont faces, and says largeBoldFont arrived with Palm OS 3.0 [4]. No source we consulted says who drew them.',
      },
      substitute: {
        es: 'El tema usa Pixelify Sans, una letra libre de píxeles y proporcional, en normal y en negrita, con las ligaduras apagadas porque las suyas dibujan la fi casi como una A. En la fotografía vemos una letra de píxeles pequeña y redondeada; Pixelify Sans no copia sus formas.',
        en: 'The theme uses Pixelify Sans, a free proportional pixel face, in regular and bold, with ligatures off because its own draw fi almost like an A. In the photograph we see a small, rounded pixel face; Pixelify Sans does not copy its shapes.',
      },
    },
  },
  fonts: { sans: 'pixelify-sans' },
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
  type: { weightBody: 400, weightLabel: 700, weightDisplay: 700, displaySpacing: '0em', kerning: 'none', featureSettings: '"liga" 0' },
  shape: { borderWidth: 2, radius: 4, radiusControl: 2, radiusButton: 4, radiusSmall: 2 },
  elevation: flat(),
  motion: { duration: 0, durationSlow: 0, ease: 'linear' },
});
