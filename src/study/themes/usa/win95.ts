import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'win95',
  scene: 'usa',
  nativeScheme: 'light',
  name: { es: 'Windows 95', en: 'Windows 95' },
  tagline: { es: 'Gris, biseles 3D y una luz que viene de arriba a la izquierda.', en: 'Gray, 3D bevels and a light from the top left.' },
  reference: {
    title: { es: 'Windows 95 (interfaz gráfica de usuario)', en: 'Windows 95 (graphical user interface)' },
    authors: ['Microsoft'],
    date: 1995,
    place: { es: 'Redmond, Estados Unidos', en: 'Redmond, United States' },
    kind: 'software',
    sources: [
      {
        title: 'The Windows Interface Guidelines for Software Design',
        url: 'https://archive.org/details/windowsinterface00micr',
        publisher: 'Microsoft Press (Internet Archive)',
        year: 1995,
        accessed: '2026-10-08',
      },
      {
        title: 'GetSysColor function (winuser.h)',
        url: 'https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getsyscolor',
        publisher: 'Microsoft Learn',
        accessed: '2026-10-08',
      },
      { title: 'Using MS Shell Dlg and MS Shell Dlg 2', url: 'https://learn.microsoft.com/en-us/windows/win32/intl/using-ms-shell-dlg-and-ms-shell-dlg-2', publisher: 'Microsoft Learn', accessed: '2026-10-10' },
      { title: 'Microsoft Sans Serif font family', url: 'https://learn.microsoft.com/en-us/typography/font-list/microsoft-sans-serif', publisher: 'Microsoft Learn', accessed: '2026-10-10' },
      { title: 'Registry Riddles and Remedies', url: 'https://kaisernet.org/library/1996/0796/07fa3001.htm', publisher: 'kaisernet.org library', year: 1996, accessed: '2026-10-10' },
      { title: 'DrawAnimatedRects function (winuser.h)', url: 'https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-drawanimatedrects', publisher: 'Microsoft Learn', accessed: '2026-10-10' },
    ],
  },
  ficha: {
    documented: {
      es: 'Microsoft publicó en un libro las normas de interfaz para las aplicaciones de Windows 95 y Windows NT [1]. La API de Windows define colores de sistema propios para los elementos tridimensionales: una cara, que también es el fondo de los cuadros de diálogo, dos tonos claros para los bordes que miran a la fuente de luz y dos tonos oscuros, sombra y sombra oscura, para los que miran en sentido contrario [2].',
      en: 'Microsoft published the interface standards for Windows 95 and Windows NT applications as a book [1]. The Windows API defines system colours of its own for three-dimensional elements: a face, which is also the background of dialog boxes, two light tones for edges facing the light source, and two dark tones, shadow and dark shadow, for edges facing away from it [2].',
    },
    reading: {
      es: 'El tema dibuja cada control con esos cuatro tonos de borde: claros arriba y a la izquierda, oscuros abajo y a la derecha, y los invierte al pulsar para que el botón parezca hundirse. Es la primera sala de la galería que no es neobrutalista: el relieve sustituye a la sombra dura, pero la geometría de los controles no cambia.',
      en: 'The theme draws every control with those four edge tones: light at the top and left, dark at the bottom and right, swapped while pressed so the button seems to sink. It is the gallery’s first room that is not neobrutalist: relief replaces the hard shadow, but the controls’ geometry does not change.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'Las fuentes documentan los papeles de cada color, no sus valores. El gris #c0c0c0 y el azul marino #000080 son la lectura del tema; el rojo y el gris de texto se oscurecieron para cumplir los contrastes de WCAG.',
        en: 'The sources document each colour’s role, not its value. The #c0c0c0 gray and #000080 navy are the theme’s reading; the red and the muted text were darkened to meet WCAG contrast.',
      },
    },
    lettering: {
      original: { name: 'MS Sans Serif', kind: 'bitmap' },
      documented: {
        es: 'En Windows 95, la fuente lógica de los cuadros de diálogo, MS Shell Dlg, se resolvía casi siempre en MS Sans Serif, en la versión de cada página de códigos [3]. MS Sans era la fuente de mapa de bits que traían las primeras versiones de Windows; su sucesora de contorno, Microsoft Sans Serif, se dibujó con sus mismas medidas [4].',
        en: 'In Windows 95 the dialog boxes’ logical font, MS Shell Dlg, nearly always resolved to MS Sans Serif, in the version for each code page [3]. MS Sans was the bitmap font that came with the first versions of Windows; its outline successor, Microsoft Sans Serif, was drawn to its same metrics [4].',
      },
      substitute: {
        es: 'El tema usa DotGothic16, una gótica libre de contorno dibujada sobre una retícula de puntos. En esa retícula vemos el mapa de bits de MS Sans; difiere en que todas sus letras latinas tienen el mismo ancho, y en que no son las de Microsoft.',
        en: 'The theme uses DotGothic16, a free outline gothic drawn on a grid of dots. In that grid we see MS Sans’s bitmap; it differs in that all its Latin letters share one width, and they are not Microsoft’s.',
      },
    },
    motion: {
      documented: {
        es: 'Windows 95 animaba las ventanas al minimizarlas y al maximizarlas, de modo que parecían encogerse y estallar, y un valor del registro, MinAnimate, apagaba el efecto [5]. La función DrawAnimatedRects de la API de Windows anima la barra de título entre dos rectángulos, con un efecto que su documentación compara con minimizar o maximizar [6].',
        en: 'Windows 95 animated windows as they were minimized and maximized, so that they seemed to collapse and burst open, and a registry value, MinAnimate, turned the effect off [5]. The Windows API function DrawAnimatedRects animates the title bar between two rectangles, an effect its documentation likens to minimizing or maximizing [6].',
      },
      reading: {
        es: 'El tema lo lleva a la apertura de un diálogo: primero sube una franja del alto de una barra de título, a saltos, y después se despliega el cuadro entero. Los 240 ms son del tema; ninguna fuente que pudimos verificar da la duración. Los botones se hunden al instante, sin transición.',
        en: 'The theme carries it to a dialog opening: first a strip the height of a title bar rises in steps, then the whole box unfolds. The 240 ms are the theme’s; no source we could verify gives the duration. Buttons sink at once, with no transition.',
      },
    },
  },
  fonts: { sans: 'dotgothic16' },
  colors: {
    bg: ['#c0c0c0', '#000000'],
    fg: ['#000000', '#ffffff'],
    fgMuted: ['#444444', '#aaaaaa'],
    surface: ['#c0c0c0', '#222222'],
    surfaceAlt: ['#ffffff', '#111111'],
    border: ['#000000', '#eeeeee'],
    primary: ['#000080', '#000080'],
    primaryFg: ['#ffffff', '#ffffff'],
    accent: ['#000080', '#000080'],
    accentFg: ['#ffffff', '#ffffff'],
    info: ['#000080', '#8ab4f8'],
    infoFg: ['#ffffff', '#000000'],
    success: ['#006600', '#6dd58c'],
    successFg: ['#ffffff', '#000000'],
    warning: '#ffff00',
    warningFg: '#000000',
    danger: ['#8b0000', '#ff8080'],
    dangerFg: ['#ffffff', '#000000'],
    focus: ['#000000', '#ffffff'],
  },
  type: { weightBody: 400, weightLabel: 400, weightDisplay: 400, displaySpacing: '0em', kerning: 'none' },
  shape: { borderWidth: 1, radius: 0, radiusControl: 0, radiusButton: 0, radiusSmall: 0 },
  elevation: flat(),
  motion: { duration: 0, durationSlow: 0, ease: 'linear' },
  signature: './win95.css',
  motionFile: './win95.motion.css',
});
