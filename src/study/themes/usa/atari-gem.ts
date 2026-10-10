import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'atari-gem',
  scene: 'usa',
  nativeScheme: 'light',
  name: { es: 'GEM del Atari ST', en: 'Atari ST GEM' },
  tagline: { es: 'Blanco y negro a 640 × 400, y una caja que crece al abrirse.', en: 'Black and white at 640 × 400, and a box that grows as it opens.' },
  reference: {
    title: { es: 'El escritorio GEM del Atari ST (TOS 1.0)', en: 'The GEM desktop on the Atari ST (TOS 1.0)' },
    authors: ['Digital Research'],
    date: 1985,
    place: { es: 'Estados Unidos', en: 'United States' },
    kind: 'software',
    sources: [
      { title: 'Atari TOS 1.0', url: 'https://toastytech.com/guis/tos.html', publisher: 'Toasty Tech GUI Gallery', accessed: '2026-10-10' },
      {
        title: 'GEM Programmer’s Guide, Volume 1: VDI',
        url: 'https://ftp.mirrorservice.org/sites/www.bitsavers.org/pdf/digitalResearch/gem/Programmers_Toolkit/5047-2023-101_GEM_Programmers_Guide_Volume_1_VDI_Apr85.pdf',
        publisher: 'Digital Research (bitsavers)',
        year: 1985,
        accessed: '2026-10-10',
      },
      {
        title: 'GEM Programmer’s Guide, Volume 2: AES',
        url: 'https://mirrorservice.org/sites/www.bitsavers.org/pdf/atari/ST/Atari_ST_GEM_Programming_1986/GEM_0464.pdf',
        publisher: 'Digital Research (bitsavers)',
        year: 1985,
        accessed: '2026-10-10',
      },
      { title: 'ST Font Loader', url: 'https://www.atarimagazines.com/v4n9/stfontloader.php', publisher: 'Antic', year: 1986, accessed: '2026-10-10' },
    ],
    image: {
      file: 'atari-gem.avif',
      width: 640,
      height: 399,
      alt: {
        es: 'Captura de TOS 1.00 en modo monocromo: la barra de menús Desk, File, View y Options, iconos de disquetes, disco duro, cartucho y papelera, y el diálogo «SET PREFERENCES» con los botones Yes y High marcados en negro.',
        en: 'A screenshot of TOS 1.00 in monochrome mode: the Desk, File, View and Options menu bar, icons for floppy disks, a hard disk, a cartridge and the trash, and the “SET PREFERENCES” dialog with the Yes and High buttons selected in black.',
      },
      author: 'MJaap',
      license: 'CC-BY-SA-4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:TOS_1.00.png',
    },
  },
  ficha: {
    documented: {
      es: 'El Atari ST empezó a fabricarse en 1985, y su sistema tiene dos partes: TOS, que la galería Toasty Tech describe como una especie de CP/M adaptado que proporcionó Digital Research, y GEM, la interfaz gráfica que corre encima; las dos van enteras en la ROM [1]. Con un monitor monocromo especial, GEM trabaja en alta resolución, 640 × 400 en dos colores; las resoluciones baja y media son 320 × 200 con 16 colores y 640 × 200 con cuatro [1]. Para las pantallas monocromas, la guía de programación de GEM fija el blanco en el índice 0 y el negro en el 1 [2].',
      en: 'The Atari ST went into production in 1985, and its system has two parts: TOS, which the Toasty Tech gallery describes as a kind of customised CP/M supplied by Digital Research, and GEM, the graphical interface that runs on top; both sit entirely in ROM [1]. With a special monochrome monitor, GEM runs in high resolution, 640 × 400 in two colours; low and medium resolution are 320 × 200 with 16 colours and 640 × 200 with four [1]. For monochrome screens, GEM’s programming guide puts white at index 0 and black at index 1 [2].',
    },
    reading: {
      es: 'El tema toma la alta resolución monocroma: fondo blanco, letras y bordes negros, y la opción elegida en negro con letras blancas, como los botones marcados del diálogo de la captura, una imagen de TOS 1.00 en modo monocromo hecha en 2021. El gris del tema hace las veces de la trama de puntos del escritorio, y los colores de los estados son del tema.',
      en: 'The theme takes the monochrome high resolution: a white ground, black letters and borders, and the chosen option in black with white letters, like the selected buttons in the screenshot’s dialog, an image of TOS 1.00 in monochrome mode made in 2021. The theme’s grey stands in for the desktop’s dot pattern, and the state colours are the theme’s.',
    },
    palette: {
      origin: 'documented',
      note: {
        es: 'El blanco y el negro de las pantallas monocromas están en la guía de VDI [2]; el gris y los colores de los estados son del tema.',
        en: 'The white and black of monochrome screens are in the VDI guide [2]; the grey and the state colours are the theme’s.',
      },
    },
    lettering: {
      original: { name: { es: 'Las letras del sistema del ST', en: 'The ST’s system fonts' }, kind: 'bitmap' },
      documented: {
        es: 'Al encenderse, el ST carga tres juegos de caracteres del sistema, iguales salvo por el tamaño de la celda: 8 × 16 puntos para la alta resolución, 8 × 8 para la media y la baja, y 6 × 6 para las etiquetas de los iconos [4]. Ninguna fuente que consultamos dice quién los dibujó.',
        en: 'At power-up the ST loads three system character sets, identical except for the size of the cell: 8 × 16 dots for high resolution, 8 × 8 for medium and low, and 6 × 6 for icon labels [4]. No source we consulted says who drew them.',
      },
      substitute: {
        es: 'El tema usa VT323, una letra libre de terminal, de ancho fijo y hecha de píxeles, para todo el texto, con las ligaduras apagadas. En la captura vemos una letra de ancho fijo, trazo grueso y esquinas cuadradas, que VT323 sigue de cerca; difiere en el dibujo de letras como la f y la r. Tiene un solo peso, y nada se engrosa.',
        en: 'The theme uses VT323, a free terminal face, fixed-width and built from pixels, for all text, with ligatures off. In the screenshot we see a fixed-width face with a heavy stroke and square corners, which VT323 follows closely; it differs in the drawing of letters such as f and r. It has a single weight, and nothing is thickened.',
      },
    },
    motion: {
      documented: {
        es: 'Al abrir un icono en el escritorio GEM, una caja se ensancha hasta su tamaño, obra de la rutina GRAF_GROWBOX; al cerrar una ventana, GRAF_SHRINKBOX dibuja la contraria [3]. Para los diálogos, FORM_DIAL puede dibujar con FMD_GROW una caja que crece de pequeña a grande y, al salir, con FMD_SHRINK una que se encoge; las dos llamadas son opcionales [3]. Ninguna fuente que consultamos da la duración.',
        en: 'Opening an icon on the GEM desktop makes a box widen out to size, the work of the GRAF_GROWBOX routine; closing a window, GRAF_SHRINKBOX draws the reverse [3]. For dialogs, FORM_DIAL can draw with FMD_GROW a box that grows from small to large and, on exit, with FMD_SHRINK one that shrinks; both calls are optional [3]. No source we consulted gives the duration.',
      },
      reading: {
        es: 'El tema lo lleva a la apertura de un diálogo: el cuadro crece desde pequeño en ocho saltos, en 200 ms. GEM dibujaba primero un contorno vacío que crecía y después el diálogo; el tema hace crecer el diálogo mismo. La duración es del tema, y lo demás cambia al instante.',
        en: 'The theme carries it to a dialog opening: the box grows from small in eight steps, over 200 ms. GEM first drew an empty outline that grew and then the dialog; the theme grows the dialog itself. The duration is the theme’s, and everything else changes at once.',
      },
    },
  },
  fonts: { sans: 'vt323' },
  colors: {
    bg: ['#ffffff', '#000000'],
    fg: ['#000000', '#ffffff'],
    fgMuted: ['#3a3a3a', '#c8c8c8'],
    surface: ['#ffffff', '#0e0e0e'],
    surfaceAlt: ['#d4d4d4', '#2a2a2a'],
    border: ['#000000', '#ffffff'],
    primary: ['#000000', '#ffffff'],
    primaryFg: 'auto',
    accent: ['#5a5a5a', '#a8a8a8'],
    accentFg: 'auto',
    info: ['#1f3f8f', '#8fb3e8'],
    infoFg: 'auto',
    success: ['#1e6b2e', '#7cc98a'],
    successFg: 'auto',
    warning: ['#d9a400', '#f2c14e'],
    warningFg: 'auto',
    danger: ['#a00000', '#ff7a6e'],
    dangerFg: 'auto',
    focus: ['#1f3f8f', '#f2c14e'],
  },
  type: { weightBody: 400, weightLabel: 400, weightDisplay: 400, displaySpacing: '0em', kerning: 'none', featureSettings: '"liga" 0' },
  shape: { borderWidth: 2, radius: 0, radiusControl: 0, radiusButton: 0, radiusSmall: 0 },
  elevation: flat(),
  motion: { duration: 0, durationSlow: 0, ease: 'linear' },
  motionFile: './atari-gem.motion.css',
});
