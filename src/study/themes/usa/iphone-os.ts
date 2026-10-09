import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'iphone-os',
  scene: 'usa',
  nativeScheme: 'light',
  name: { es: 'iPhone OS 1', en: 'iPhone OS 1' },
  tagline: { es: 'Una pantalla de 3,5 pulgadas para el dedo, en Helvetica.', en: 'A 3.5-inch screen for a finger, set in Helvetica.' },
  reference: {
    title: { es: 'iPhone OS 1 (interfaz del iPhone original)', en: 'iPhone OS 1 (the original iPhone’s interface)' },
    authors: ['Apple Inc.'],
    date: 2007,
    place: { es: 'Cupertino, Estados Unidos', en: 'Cupertino, United States' },
    kind: 'software',
    sources: [
      { title: 'Apple Reinvents the Phone with iPhone', url: 'https://www.apple.com/newsroom/2007/01/09Apple-Reinvents-the-Phone-with-iPhone/', publisher: 'Apple', year: 2007, accessed: '2026-10-09' },
      { title: 'iPhone OS 1', url: 'https://en.wikipedia.org/wiki/IPhone_OS_1', publisher: 'Wikipedia', accessed: '2026-10-09' },
      { title: 'Who designed the iPhone font?', url: 'https://everymac.com/systems/apple/iphone/iphone-faq/iphone-who-designed-iphone-font-used-iphone-ringtones.html', publisher: 'EveryMac', accessed: '2026-10-09' },
      { title: 'Oral History of Bas Ording', url: 'https://www.computerhistory.org/collections/catalog/102738558', publisher: 'Computer History Museum', year: 2017, accessed: '2026-10-09' },
      { title: 'Imran Chaudhri', url: 'https://en.wikipedia.org/wiki/Imran_Chaudhri', publisher: 'Wikipedia', accessed: '2026-10-09' },
      { title: 'Helvetica', url: 'https://www.fonts.com/font/linotype/helvetica', publisher: 'Fonts.com (Monotype)', accessed: '2026-10-10' },
      { title: 'Macworld 2007', url: 'https://www.allaboutstevejobs.com/videos/keynotes/macworld_2007', publisher: 'allaboutstevejobs.com (keynote transcript)', year: 2007, accessed: '2026-10-10' },
      { title: 'setOn(_:animated:)', url: 'https://developer.apple.com/tutorials/data/documentation/uikit/uiswitch/seton(_:animated:).json', publisher: 'Apple Developer Documentation (UIKit)', accessed: '2026-10-10' },
    ],
  },
  ficha: {
    documented: {
      es: 'Apple anunció el iPhone en enero de 2007 con una interfaz nueva sobre una pantalla multitáctil de 3,5 pulgadas, que se usaba con el dedo y sin lápiz [1]. Salió el 29 de junio de 2007 con una pantalla de inicio de iconos en retícula y un dock abajo [2], y su fuente de sistema era Helvetica [3]. La interfaz nació de los prototipos multitáctiles de Bas Ording, que había empezado en Apple con las animaciones de Aqua [4], e Imran Chaudhri, del equipo original, cocreó la pantalla de inicio en retícula [5].',
      en: 'Apple announced the iPhone in January 2007 with a new interface on a 3.5-inch multi-touch screen, used with a finger and no stylus [1]. It shipped on 29 June 2007 with a home screen of icons on a grid and a dock along the bottom [2], and its system font was Helvetica [3]. The interface grew out of Bas Ording’s multi-touch prototypes, after he had started at Apple on Aqua’s animations [4], and Imran Chaudhri, from the original team, co-created the grid home screen [5].',
    },
    reading: {
      es: 'Las fuentes no describen el acabado visual del sistema, así que esta parte es lectura de principio a fin. El tema redondea mucho las esquinas, a la medida del dedo, y da a los botones un brillo de vidrio que se corta a la mitad, el que se ve en las capturas de la época. El fondo lleva rayas verticales muy finas, y el texto va en Arimo, cerca de Helvetica.',
      en: 'Our sources do not describe the system’s visual finish, so this part is a reading from start to end. The theme rounds corners generously, sized for a finger, and gives buttons a glass shine that breaks at the middle, as seen in screenshots of the time. The background carries very fine vertical stripes, and text is set in Arimo, close to Helvetica.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'Ninguna fuente da los colores del sistema; el azul y los grises son una lectura de capturas.',
        en: 'No source gives the system’s colours; the blue and the greys are read from screenshots.',
      },
    },
    lettering: {
      original: { name: 'Helvetica', designer: 'Max Miedinger, Eduard Hoffmann', kind: 'outline' },
      documented: {
        es: 'La fuente del sistema del primer iPhone era Helvetica [3], la tipografía que la fundición suiza Haas desarrolló bajo la dirección de Max Miedinger y Eduard Hoffmann [6].',
        en: 'The first iPhone’s system font was Helvetica [3], the typeface the Swiss Haas foundry developed under the direction of Max Miedinger and Eduard Hoffmann [6].',
      },
      substitute: {
        es: 'El tema usa Arimo, una grotesca libre, para el texto y los títulos. En sus proporciones vemos las de Helvetica; difiere en letras como la R, la G y la t.',
        en: 'The theme uses Arimo, a free grotesque, for text and titles. In its proportions we see Helvetica’s; it differs in letters such as R, G and t.',
      },
    },
    motion: {
      documented: {
        es: 'En la presentación de enero de 2007, Steve Jobs desbloqueó el teléfono deslizando el dedo por la pantalla, y mostró que las listas rebotaban un poco al pasarse del borde [7]. En UIKit, la interfaz de programación que Apple abrió después, el interruptor cambia de posición con una animación opcional [8].',
        en: 'At the January 2007 presentation, Steve Jobs unlocked the phone by sliding a finger across the screen, and showed lists bouncing a little past their edge [7]. In UIKit, the programming interface Apple opened later, the switch changes position with an optional animation [8].',
      },
      reading: {
        es: 'El tema anima el interruptor: la bola se desliza al cambiar de estado, en 200 ms que son del tema. El desbloqueo y el rebote no tienen equivalente en la librería, y los demás controles responden al instante.',
        en: 'The theme animates the switch: the knob slides as it changes state, in 200 ms that are the theme’s. The unlock and the bounce have no counterpart in the library, and the other controls respond at once.',
      },
    },
  },
  fonts: { sans: 'arimo' },
  colors: {
    bg: ['#eef0f3', '#111214'],
    fg: ['#131518', '#e6e9ed'],
    fgMuted: ['#585e66', '#9aa1ab'],
    surface: ['#ffffff', '#1b1d21'],
    surfaceAlt: ['#e3e6eb', '#25282d'],
    border: ['#767e88', '#686e78'],
    primary: ['#185cb5', '#5b95e6'],
    primaryFg: ['#ffffff', '#09111c'],
    accent: ['#185cb5', '#5b95e6'],
    accentFg: ['#ffffff', '#09111c'],
    info: ['#185cb5', '#5b95e6'],
    infoFg: ['#ffffff', '#09111c'],
    success: ['#23823d', '#55ba6f'],
    successFg: ['#ffffff', '#0a1a0f'],
    warning: ['#d6a000', '#e6b935'],
    warningFg: ['#131518', '#1c1500'],
    danger: ['#bd2f2f', '#e65e5e'],
    dangerFg: ['#ffffff', '#1c0303'],
    focus: ['#185cb5', '#7cb1f5'],
  },
  type: { weightBody: 400, weightLabel: 600, weightDisplay: 700 },
  shape: { borderWidth: 1, radius: 16, radiusControl: 10, radiusButton: 10, radiusSmall: 6 },
  elevation: flat(),
  motion: { duration: 0, durationSlow: 0, ease: 'linear' },
  signature: './iphone-os.css',
  motionFile: './iphone-os.motion.css',
});
