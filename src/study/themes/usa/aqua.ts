import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'aqua',
  scene: 'usa',
  nativeScheme: 'light',
  name: { es: 'Mac OS X Aqua', en: 'Mac OS X Aqua' },
  tagline: { es: 'Botones de gel, rayas finas y un solo botón azul.', en: 'Gel buttons, fine stripes and one blue button.' },
  reference: {
    title: { es: 'Mac OS X (interfaz Aqua)', en: 'Mac OS X (Aqua interface)' },
    authors: ['Apple Computer'],
    date: 2000,
    place: { es: 'Cupertino, Estados Unidos', en: 'Cupertino, United States' },
    kind: 'software',
    sources: [
      { title: 'Aqua Human Interface Guidelines', url: 'https://daringfireball.net/misc/2026/07/2002%20Aqua%20Human%20Interface%20Guidelines.pdf', publisher: 'Apple Computer', year: 2002, accessed: '2026-10-09' },
      { title: 'Apple Unveils Mac OS X', url: 'https://www.apple.com/newsroom/2000/01/05Apple-Unveils-Mac-OS-X/', publisher: 'Apple', year: 2000, accessed: '2026-10-09' },
      { title: 'Aqua (user interface)', url: 'https://en.wikipedia.org/wiki/Aqua_(user_interface)', publisher: 'Wikipedia', accessed: '2026-10-09' },
      { title: 'Aqua', url: 'https://www.salon.com/2000/01/26/aqua/', publisher: 'Salon', year: 2000, accessed: '2026-10-09' },
      { title: 'Oral History of Bas Ording', url: 'https://www.computerhistory.org/collections/catalog/102738558', publisher: 'Computer History Museum', year: 2017, accessed: '2026-10-09' },
      { title: 'A brief history of Mac system fonts', url: 'https://eclecticlight.co/2024/06/25/a-brief-history-of-mac-system-fonts/', publisher: 'The Eclectic Light Company', year: 2024, accessed: '2026-10-10' },
      { title: 'Lucida Facts', url: 'https://web.archive.org/web/20140815105659/http://lucidafonts.com/pages/facts', publisher: 'Bigelow & Holmes (Internet Archive)', accessed: '2026-10-10' },
    ],
  },
  ficha: {
    documented: {
      es: 'Apple presentó Aqua el 5 de enero de 2000 como un aspecto translúcido y luminoso, con botones, barras de desplazamiento y ventanas semitransparentes [2]. Se inspiraba en el agua, con azul, blanco y gris, controles brillantes como de gel y sombras proyectadas, y las primeras versiones tenían fondos de rayas finas [3]. En las guías de Apple solo el botón por defecto lleva color y late, los demás se dibujan transparentes, y el texto del sistema va en Lucida Grande de 13 puntos [1]. Los botones de la ventana tenían colores de semáforo [4], y Bas Ording trabajó en sus animaciones e interacciones [5].',
      en: 'Apple presented Aqua on 5 January 2000 as a translucent, luminous look, with semi-transparent buttons, scroll bars and windows [2]. It drew on water, in blue, white and grey, with glossy gel-like controls and drop shadows, and early versions had finely striped backgrounds [3]. In Apple’s guidelines only the default button carries colour and pulses, the rest are drawn clear, and system text is set in 13-point Lucida Grande [1]. The window buttons were coloured like traffic lights [4], and Bas Ording worked on its animations and interactions [5].',
    },
    reading: {
      es: 'El tema da a los botones un brillo de gel, un degradado que se corta a la mitad, y pone rayas horizontales finas en el fondo. Como en las guías, el azul se reserva para la acción principal. Las esquinas son redondas y los bordes de 1 px; el texto va en Open Sans, en lugar de Lucida Grande.',
      en: 'The theme gives buttons a gel shine, a gradient that breaks at the middle, and lays fine horizontal stripes over the background. As in the guidelines, blue is kept for the main action. Corners are round and borders 1 px; text is set in Open Sans, in place of Lucida Grande.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'Las guías nombran las apariencias Aqua, en azul, y Grafito, pero no dan valores; los tonos son una lectura.',
        en: 'The guidelines name the Aqua appearance, in blue, and Graphite, but give no values; the tones are a reading.',
      },
    },
    lettering: {
      original: { name: 'Lucida Grande', designer: 'Charles Bigelow, Kris Holmes', kind: 'outline' },
      documented: {
        es: 'En las guías de Aqua, el texto del sistema va en Lucida Grande regular de 13 puntos, y el texto pequeño, en Lucida Grande regular de 11 [1]. Lucida Grande es de Charles Bigelow y Kris Holmes [6], y Apple solo publicó con Mac OS X, desde 2000, sus versiones regular y negrita [7].',
        en: 'In the Aqua guidelines, system text is set in 13-point Lucida Grande Regular, and small text in 11-point Lucida Grande Regular [1]. Lucida Grande is by Charles Bigelow and Kris Holmes [6], and Apple released only its regular and bold with Mac OS X, from 2000 [7].',
      },
      substitute: {
        es: 'El tema usa Open Sans, una sans humanista libre, para el texto y los títulos. En sus formas abiertas y su ojo grande vemos los de Lucida Grande, aunque Open Sans es más regular y no copia las letras de Bigelow y Holmes.',
        en: 'The theme uses Open Sans, a free humanist sans, for text and titles. In its open forms and large x-height we see Lucida Grande’s, though Open Sans is more regular and does not copy Bigelow and Holmes’s letters.',
      },
    },
    motion: {
      documented: {
        es: 'En las guías de Aqua, el botón por defecto de un diálogo tiene color y late, y las hojas aparecen con una animación que parece salir de la barra de título de la ventana [1].',
        en: 'In the Aqua guidelines, a dialog’s default button has colour and pulses, and sheets appear with an animation that seems to come out of the window’s title bar [1].',
      },
      reading: {
        es: 'El tema hace latir la luz del gel del botón principal cuatro veces, en unos cinco segundos, y se detiene: un latido sin fin necesitaría un control para pararlo. Los diálogos bajan desde el borde superior, como una hoja que sale de la barra de título. Ninguna fuente que pudimos verificar da el ritmo del latido ni la duración de la hoja; son del tema.',
        en: 'The theme makes the light of the primary button’s gel pulse four times, over about five seconds, and stops: an endless pulse would need a control to halt it. Dialogs come down from the top edge, like a sheet out of the title bar. No source we could verify gives the pulse’s rhythm or the sheet’s duration; they are the theme’s.',
      },
    },
  },
  fonts: { sans: 'open-sans' },
  colors: {
    bg: ['#f4f5f6', '#161719'],
    fg: ['#1a1c20', '#e6e8eb'],
    fgMuted: ['#5c6068', '#9aa0a8'],
    surface: ['#ffffff', '#202225'],
    surfaceAlt: ['#eceff1', '#2a2d32'],
    border: ['#7a808a', '#666b73'],
    primary: ['#2862a9', '#6b9eeb'],
    primaryFg: ['#ffffff', '#0d131a'],
    accent: ['#2862a9', '#6b9eeb'],
    accentFg: ['#ffffff', '#0d131a'],
    info: ['#2862a9', '#6b9eeb'],
    infoFg: ['#ffffff', '#0d131a'],
    success: ['#2b763e', '#5cbd70'],
    successFg: ['#ffffff', '#0d1510'],
    warning: ['#e6a800', '#eebf42'],
    warningFg: ['#1a1c20', '#1a1400'],
    danger: ['#ba3636', '#eb6b6b'],
    dangerFg: ['#ffffff', '#1a0505'],
    focus: ['#2862a9', '#8cb5f2'],
  },
  type: { weightBody: 400, weightLabel: 600, weightDisplay: 600 },
  shape: { borderWidth: 1, radius: 8, radiusControl: 16, radiusButton: 20, radiusSmall: 4 },
  elevation: flat(),
  motion: { duration: 0, durationSlow: 0, ease: 'linear' },
  signature: './aqua.css',
  motionFile: './aqua.motion.css',
});
