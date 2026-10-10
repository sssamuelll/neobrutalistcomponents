import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'win-xp',
  scene: 'usa',
  nativeScheme: 'light',
  name: { es: 'Windows XP', en: 'Windows XP' },
  tagline: { es: 'Barras de título azules redondeadas y un botón Inicio verde.', en: 'Rounded blue title bars and a green Start button.' },
  reference: {
    title: { es: 'Windows XP (estilo visual Luna)', en: 'Windows XP (Luna visual style)' },
    authors: ['Microsoft'],
    date: 2001,
    place: { es: 'Redmond, Estados Unidos', en: 'Redmond, United States' },
    kind: 'software',
    sources: [
      { title: 'Windows XP visual styles', url: 'https://en.wikipedia.org/wiki/Windows_XP_visual_styles', publisher: 'Wikipedia', accessed: '2026-10-09' },
      { title: 'Tahoma font family', url: 'https://learn.microsoft.com/en-us/typography/font-list/tahoma', publisher: 'Microsoft', accessed: '2026-10-09' },
      { title: 'Trebuchet MS font family', url: 'https://learn.microsoft.com/en-us/typography/font-list/trebuchet-ms', publisher: 'Microsoft', accessed: '2026-10-09' },
      { title: 'The look of Luna', url: 'https://devblogs.microsoft.com/oldnewthing/?p=39953', publisher: 'The Old New Thing (Microsoft)', year: 2004, accessed: '2026-10-09' },
      { title: 'Windows XP Visual Guidelines: Fonts', url: 'https://junglecat.narod.ru/winxp/fonts.htm', publisher: 'Microsoft (mirror)', accessed: '2026-10-10' },
      { title: 'SystemParametersInfoA function (winuser.h)', url: 'https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-systemparametersinfoa', publisher: 'Microsoft Learn', accessed: '2026-10-10' },
      { title: 'Libre Franklin (description)', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/librefranklin/DESCRIPTION.en_us.html', publisher: 'Google Fonts (Impallari Type)', accessed: '2026-10-10' },
    ],
  },
  ficha: {
    documented: {
      es: 'Luna, el aspecto por defecto de Windows XP, lo diseñó la agencia Frog Design por encargo de Microsoft, y salió en tres combinaciones de color: azul, verde oliva y plateado [1]. Las barras de título tienen las esquinas redondeadas y van en Trebuchet MS, el botón de cerrar es rojo y el de Inicio, verde; casi todo el resto del texto va en Tahoma [1][2][3]. Tahoma, de Matthew Carter, y Trebuchet MS, de Vincent Connare, se dibujaron para leerse bien en pantalla a tamaños pequeños [2][3]. Según Raymond Chen, de Microsoft, a Luna se llegó después de mucha investigación y varios intentos fallidos [4].',
      en: 'Luna, Windows XP’s default look, was designed by the agency Frog Design for Microsoft, and it shipped in three colour schemes: blue, olive green and silver [1]. Title bars have rounded corners and are set in Trebuchet MS, the close button is red and the Start button green; most other text is set in Tahoma [1][2][3]. Tahoma, by Matthew Carter, and Trebuchet MS, by Vincent Connare, were drawn to read well on screen at small sizes [2][3]. Raymond Chen, of Microsoft, writes that Luna came after a lot of research and several false starts [4].',
    },
    reading: {
      es: 'El tema toma la combinación azul: bordes y botones principales en azul, sobre el beige claro de los diálogos. Los botones llevan un degradado suave de arriba abajo, una lectura del plástico de Luna, y las esquinas se redondean un poco. El texto va en Noto Sans y los títulos en Libre Franklin; la tipografía se explica abajo.',
      en: 'The theme takes the blue scheme: borders and primary buttons in blue, over the pale beige of the dialogs. Buttons carry a soft top-to-bottom gradient, a reading of Luna’s plastic, and corners are slightly rounded. Text is set in Noto Sans and titles in Libre Franklin; the typography is explained below.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'Los nombres de las tres combinaciones están documentados, sus valores no. El azul y el beige del tema son una lectura de capturas.',
        en: 'The names of the three schemes are documented, their values are not. The theme’s blue and beige are read from screenshots.',
      },
    },
    lettering: {
      original: { name: 'Tahoma', designer: 'Matthew Carter', kind: 'outline' },
      documented: {
        es: 'Las pautas visuales de Windows XP fijan Tahoma como fuente por defecto del sistema, a 8, 9 u 11 puntos, reservan Trebuchet MS en negrita de 10 puntos para las barras de título de las ventanas y suman Franklin Gothic, solo por encima de 14 puntos y a menudo en los encabezados [5]. Tahoma es de Matthew Carter [2]; Trebuchet MS la diseñó Vincent Connare para Microsoft en 1996 [3].',
        en: 'The Windows XP visual guidelines set Tahoma as the system’s default font, at 8, 9 or 11 points, keep bold 10-point Trebuchet MS for window title bars, and add Franklin Gothic, only above 14 points and often for headers [5]. Tahoma is by Matthew Carter [2]; Vincent Connare designed Trebuchet MS for Microsoft in 1996 [3].',
      },
      substitute: {
        es: 'El tema usa Noto Sans para el texto y Libre Franklin para los títulos. En la altura de x y las formas abiertas de Noto Sans vemos las de Tahoma, aunque es algo más ancha; Libre Franklin, libre, es una interpretación del clásico de Morris Fuller Benton de 1912 [7], el mismo del que sale Franklin Gothic. La negrita de Trebuchet en las barras de título no tiene sitio propio en la librería.',
        en: 'The theme uses Noto Sans for text and Libre Franklin for titles. In Noto Sans’s x-height and open forms we see Tahoma’s, though it is somewhat wider; Libre Franklin, a free face, is an interpretation of Morris Fuller Benton’s 1912 classic [7], the same one Franklin Gothic comes from. Trebuchet’s bold on title bars has no place of its own in the library.',
      },
    },
    motion: {
      documented: {
        es: 'Windows XP podía mostrar los menús con un fundido o, si este se apagaba, deslizándolos, y animar la aparición de las ayudas emergentes [6].',
        en: 'Windows XP could bring menus in with a fade or, with the fade off, a slide, and animate tooltips as they appeared [6].',
      },
      reading: {
        es: 'El tema funde la ayuda emergente al aparecer; los 200 ms del fundido son del tema. Los menús no tienen equivalente, porque la librería no tiene menús, y los botones responden al instante.',
        en: 'The theme fades the tooltip in; the 200 ms of the fade are the theme’s. Menus have no counterpart, since the library has no menus, and buttons respond at once.',
      },
    },
  },
  fonts: { sans: 'noto-sans', display: 'libre-franklin' },
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
  motion: { duration: 0, durationSlow: 0, ease: 'linear' },
  signature: './win-xp.css',
  motionFile: './win-xp.motion.css',
});
