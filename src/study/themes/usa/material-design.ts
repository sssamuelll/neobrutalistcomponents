import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'material-design',
  scene: 'usa',
  nativeScheme: 'light',
  name: { es: 'Material Design', en: 'Material Design' },
  tagline: { es: 'Papel y tinta, con la sombra como única señal de altura.', en: 'Paper and ink, with shadow as the only cue of height.' },
  reference: {
    title: { es: 'Material Design (versión 1)', en: 'Material Design (version 1)' },
    authors: ['Google'],
    date: 2014,
    place: { es: 'Mountain View, Estados Unidos', en: 'Mountain View, United States' },
    kind: 'software',
    sources: [
      { title: 'Material design: Introduction', url: 'https://m1.material.io/material-design/introduction.html', publisher: 'Google', accessed: '2026-10-09' },
      { title: 'Material design: Elevation and shadows', url: 'https://m1.material.io/material-design/elevation-shadows.html', publisher: 'Google', accessed: '2026-10-09' },
      { title: 'Material design: Color', url: 'https://m1.material.io/style/color.html', publisher: 'Google', accessed: '2026-10-09' },
      { title: 'Material design: Typography', url: 'https://m1.material.io/style/typography.html', publisher: 'Google', accessed: '2026-10-09' },
      { title: 'When Material Made Its Global Debut', url: 'https://design.google/library/material-design-launch-2014', publisher: 'Google Design', year: 2024, accessed: '2026-10-09' },
      { title: 'Roboto (METADATA.pb)', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/roboto/METADATA.pb', publisher: 'google/fonts', accessed: '2026-10-10' },
      { title: 'Buttons - Components - Material Design', url: 'https://m1.material.io/components/buttons.html', publisher: 'Google', year: 2014, accessed: '2026-10-10' },
      { title: 'Material motion - Motion - Material Design', url: 'https://m1.material.io/motion/material-motion.html', publisher: 'Google', year: 2014, accessed: '2026-10-10' },
      { title: 'Duration & easing - Motion - Material Design', url: 'https://m1.material.io/motion/duration-easing.html', publisher: 'Google', year: 2014, accessed: '2026-10-10' },
    ],
  },
  ficha: {
    documented: {
      es: 'Google presentó Material Design en 2014 como un material inspirado en el papel y la tinta, con luz realista para marcar costuras, separar el espacio y mostrar lo que se mueve [1][5]. La profundidad se mide como elevación en dp, y la sombra, la única señal de separación, crece y se suaviza con la altura: 2 dp para una tarjeta, 4 para la barra de la app, 24 para un diálogo [2]. El color parte de un tono 500 como principal y otros tonos como acento; la combinación de base es Indigo 500 (#3F51B5) con Pink A200 (#FF4081) [3]. La tipografía por defecto es Roboto, con Noto de respaldo [4].',
      en: 'Google presented Material Design in 2014 as a material inspired by paper and ink, with realistic light to show seams, divide space and mark what moves [1][5]. Depth is measured as elevation in dp, and shadow, the only cue of separation, grows larger and softer with height: 2 dp for a card, 4 for the app bar, 24 for a dialog [2]. Colour starts from a 500 shade as primary and other shades as accents; the baseline pairing is Indigo 500 (#3F51B5) with Pink A200 (#FF4081) [3]. The default typeface is Roboto, with Noto as fallback [4].',
    },
    reading: {
      es: 'El tema usa la pareja de base tal cual, índigo como principal y rosa como acento, con los tonos 300 y A100 en modo oscuro. Botones y tarjetas proyectan sombras suaves que crecen al pasar el puntero y al pulsar, como piezas que suben hacia el dedo. El texto va en Roboto, la tipografía del sistema.',
      en: 'The theme uses the baseline pair as is, indigo as primary and pink as accent, with the 300 and A100 shades in dark mode. Buttons and cards cast soft shadows that grow on hover and on press, like pieces rising toward the finger. Text is set in Roboto, the system’s own typeface.',
    },
    palette: {
      origin: 'documented',
      note: {
        es: 'Los valores salen de la página de color de Material Design 1: Indigo 500 y Pink A200 en modo claro, Indigo 300 y Pink A100 en modo oscuro.',
        en: 'The values come from the Material Design 1 colour page: Indigo 500 and Pink A200 in light mode, Indigo 300 and Pink A100 in dark mode.',
      },
    },
    lettering: {
      original: { name: 'Roboto', designer: 'Christian Robertson', year: 2011, kind: 'outline', free: true },
      documented: {
        es: 'Material Design toma Roboto y Noto como tipografías estándar de Android y Chrome; Roboto tiene seis pesos, y los botones van en Medium de 14 sp y en mayúsculas [4]. Roboto es de Christian Robertson, con ParaType y Font Bureau, y google/fonts la publica bajo la licencia OFL [6].',
        en: 'Material Design takes Roboto and Noto as the standard typefaces of Android and Chrome; Roboto has six weights, and buttons are set in 14 sp Medium, in capitals [4]. Roboto is by Christian Robertson, with ParaType and Font Bureau, and google/fonts publishes it under the OFL licence [6].',
      },
      substitute: {
        es: 'El tema carga Roboto tal cual, una fuente libre, en los pesos que usa, y pone los botones en mayúsculas, como pide el sistema.',
        en: 'The theme loads Roboto as is, a free font, in the weights it uses, and sets buttons in capitals, as the system asks.',
      },
    },
    motion: {
      documented: {
        es: 'Los botones de Material responden al toque con una reacción de tinta, y los elevados además suben [7]; la onda de tinta confirma el toque extendiéndose desde el punto donde cae el dedo [8]. Las transiciones usan una curva que acelera rápido y frena despacio, cubic-bezier(0.4, 0.0, 0.2, 1); en escritorio duran entre 150 y 200 ms, y lo que entra en pantalla lo hace en 225 ms [9].',
        en: 'Material buttons answer a touch with an ink reaction, and raised ones also rise [7]; the ink ripple confirms the touch by spreading from where the finger lands [8]. Transitions use a curve that speeds up quickly and slows down gently, cubic-bezier(0.4, 0.0, 0.2, 1); on desktop they last 150 to 200 ms, and what enters the screen does so in 225 ms [9].',
      },
      reading: {
        es: 'El tema dibuja la onda al pulsar un botón, pero desde el centro: sin código no sabe dónde cayó el dedo. El cambio de sombra al pulsar es instantáneo, porque el tema no anima sombras; los diálogos entran en 225 ms y las demás transiciones duran 200 ms, con la curva del sistema.',
        en: 'The theme draws the ripple when a button is pressed, but from its centre: without code it cannot know where the finger landed. The shadow change on press is instant, since the theme does not animate shadows; dialogs enter in 225 ms and other transitions last 200 ms, on the system’s curve.',
      },
    },
  },
  fonts: { sans: 'roboto' },
  colors: {
    bg: ['#f6f7f9', '#131314'],
    fg: ['#1a1a1c', '#e8e8ea'],
    fgMuted: ['#63646b', '#9da0a8'],
    surface: ['#ffffff', '#1d1e21'],
    surfaceAlt: ['#f0f1f4', '#282a2e'],
    border: ['#7c808a', '#686b73'],
    primary: ['#3f51b5', '#7986cb'],
    primaryFg: ['#ffffff', '#000000'],
    accent: ['#ff4081', '#ff80ab'],
    accentFg: ['#000000', '#000000'],
    info: ['#1978ad', '#62b1e0'],
    infoFg: ['#ffffff', '#051926'],
    success: ['#33783c', '#7ac283'],
    successFg: ['#ffffff', '#0a1c0d'],
    warning: ['#c46a16', '#e69a50'],
    warningFg: ['#17191c', '#2b1402'],
    danger: ['#b33232', '#e67777'],
    dangerFg: ['#ffffff', '#260404'],
    focus: ['#3f51b5', '#9ba6e6'],
  },
  type: { weightBody: 400, weightLabel: 500, weightDisplay: 400, labelTransform: 'uppercase' },
  shape: { borderWidth: 1, radius: 6, radiusControl: 6, radiusButton: 6, radiusSmall: 4 },
  elevation: flat(),
  motion: { duration: 200, durationSlow: 225, ease: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  signature: './material-design.css',
  motionFile: './material-design.motion.css',
});
