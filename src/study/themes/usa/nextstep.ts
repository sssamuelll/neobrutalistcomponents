import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'nextstep',
  scene: 'usa',
  nativeScheme: 'light',
  name: { es: 'NeXTSTEP', en: 'NeXTSTEP' },
  tagline: { es: 'Cuatro grises, biseles y una barra de título negra.', en: 'Four greys, bevels and a black title bar.' },
  reference: {
    title: { es: 'NeXTSTEP', en: 'NeXTSTEP' },
    authors: ['NeXT Computer', 'Keith Ohlfs'],
    date: 1989,
    place: { es: 'California, Estados Unidos', en: 'California, United States' },
    kind: 'software',
    sources: [
      { title: 'NeXTSTEP User Interface Guidelines, Release 3', url: 'https://www.mirrorservice.org/sites/www.bitsavers.org/pdf/next/Release_3_Nov93/NeXTSTEP_User_Interface_Guidelines_Release_3_Nov93.pdf', publisher: 'NeXT Computer', year: 1993, accessed: '2026-10-09' },
      { title: 'Keith Ohlfs Interview', url: 'https://simson.net/ref/NeXT/keith_ohlfs_article.htm', publisher: 'NeXTWORLD', year: 1992, accessed: '2026-10-09' },
      { title: 'Byte article, page 5', url: 'https://simson.net/ref/next2/byte_article_page_5.htm', publisher: 'BYTE', accessed: '2026-10-09' },
      { title: 'NeXT Computer fonts', url: 'https://worldwideweb.cern.ch/typography/', publisher: 'CERN', accessed: '2026-10-09' },
      { title: 'NeXTSTEP', url: 'https://en.wikipedia.org/wiki/NeXTSTEP', publisher: 'Wikipedia', accessed: '2026-10-09' },
      { title: 'prebuild(1) — NEXTSTEP 3.2', url: 'https://typewritten.org/Manual/NeXT/NEXTSTEP/3.2/man1/prebuild.html', publisher: 'NeXT (via typewritten.org)', accessed: '2026-10-10' },
    ],
  },
  ficha: {
    documented: {
      es: 'NeXTSTEP salió en 1989 [5], y las guías de interfaz de NeXT piden un aspecto simple que use el sombreado para dar efecto tridimensional y una gama de negro, blanco y gris [1]. La pantalla original medía 1120 × 832 puntos con solo 2 bits por punto, es decir, cuatro niveles de gris [3]. La ventana activa se marcaba con la barra de título en negro, el espacio de trabajo de fondo era gris oscuro y los botones se hundían al pulsarlos [1]. Keith Ohlfs dibujó los controles tridimensionales y los iconos, y la tipografía base era Helvetica, con Courier y una monoespaciada llamada Ohlfs [2][4].',
      en: 'NeXTSTEP shipped in 1989 [5], and NeXT’s interface guidelines ask for a simple look that uses shading for a three-dimensional effect and a scheme of black, white and grey [1]. The original screen was 1120 × 832 dots at only 2 bits a dot, which is four levels of grey [3]. The key window was marked by a black title bar, the workspace behind was dark grey, and buttons sank when pressed [1]. Keith Ohlfs drew the three-dimensional controls and the icons, and the base typeface was Helvetica, with Courier and a monospaced face called Ohlfs [2][4].',
    },
    reading: {
      es: 'El tema trabaja con cuatro grises, como la pantalla de 2 bits, y dibuja los biseles con un borde claro arriba y a la izquierda y uno oscuro abajo y a la derecha, que se invierten al pulsar. Lo principal va en negro, como la barra de título de la ventana activa. El texto va en Arimo, cerca de la Helvetica de NeXT. NeXTSTEP encogía la ventana al miniaturizarla [1]; ningún componente de la librería tiene esa forma, así que el tema no se mueve.',
      en: 'The theme works with four greys, like the 2-bit screen, and draws bevels with a light edge at the top and left and a dark one at the bottom and right, swapped while pressed. The primary colour is black, like the title bar of the key window. Text is set in Arimo, close to NeXT’s Helvetica. NeXTSTEP shrank a window when it was miniaturized [1]; no component of the library has that form, so the theme stands still.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'Las guías nombran negro, blanco y dos grises, pero no dan valores; los grises del tema son una lectura.',
        en: 'The guidelines name black, white and two greys but give no values; the theme’s greys are a reading.',
      },
    },
    lettering: {
      original: { name: 'Helvetica', kind: 'outline' },
      documented: {
        es: 'NeXTSTEP tenía tres fuentes principales: Helvetica, Courier y una monoespaciada llamada Ohlfs [4]. En NeXTSTEP 3.2 (1992), algunas fuentes traían además mapas de bits de pantalla para tamaños concretos [6], y la pantalla mostraba solo cuatro niveles de gris [3].',
        en: 'NeXTSTEP had three main fonts: Helvetica, Courier and a monospaced face called Ohlfs [4]. In NeXTSTEP 3.2 (1992), some fonts also came with screen bitmaps for particular sizes [6], and the display showed only four levels of grey [3].',
      },
      substitute: {
        es: 'El tema usa Arimo, una grotesca libre, para el texto y los títulos. En sus proporciones vemos las de Helvetica; difiere en letras como la R, la G y la t.',
        en: 'The theme uses Arimo, a free grotesque, for text and titles. In its proportions we see Helvetica’s; it differs in letters such as R, G and t.',
      },
    },
  },
  fonts: { sans: 'arimo' },
  colors: {
    bg: ['#bfbfbf', '#1a1a1a'],
    fg: ['#111111', '#ffffff'],
    fgMuted: ['#444444', '#b3b3b3'],
    surface: ['#bfbfbf', '#222222'],
    surfaceAlt: ['#dddddd', '#2e2e2e'],
    border: ['#111111', '#888888'],
    primary: ['#111111', '#ffffff'],
    primaryFg: ['#ffffff', '#111111'],
    accent: ['#111111', '#ffffff'],
    accentFg: ['#ffffff', '#111111'],
    info: ['#111111', '#ffffff'],
    infoFg: ['#ffffff', '#111111'],
    success: ['#111111', '#ffffff'],
    successFg: ['#ffffff', '#111111'],
    warning: ['#111111', '#ffffff'],
    warningFg: ['#ffffff', '#111111'],
    danger: ['#111111', '#ffffff'],
    dangerFg: ['#ffffff', '#111111'],
    focus: ['#111111', '#ffffff'],
  },
  type: { weightBody: 400, weightLabel: 700, weightDisplay: 700 },
  shape: { borderWidth: 1, radius: 2, radiusControl: 2, radiusButton: 2, radiusSmall: 1 },
  elevation: flat(),
  motion: { duration: 0, durationSlow: 0, ease: 'linear' },
  signature: './nextstep.css',
});
