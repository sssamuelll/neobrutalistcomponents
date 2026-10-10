import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'dragon-quest',
  scene: 'japan',
  nativeScheme: 'dark',
  name: { es: 'Dragon Quest', en: 'Dragon Quest' },
  tagline: { es: 'Ventanas negras de marco blanco, y el texto que llega letra por letra.', en: 'Black windows with white frames, and text that arrives letter by letter.' },
  reference: {
    title: { es: 'Dragon Quest (Famicom)', en: 'Dragon Quest (Famicom)' },
    original: { text: 'ドラゴンクエスト', lang: 'ja' },
    authors: ['Yuji Horii', 'Koichi Nakamura', 'Akira Toriyama', 'Koichi Sugiyama'],
    date: 1986,
    place: { es: 'Japón', en: 'Japan' },
    kind: 'software',
    sources: [
      { title: 'Dragon Quest', url: 'https://www.museumofplay.org/games/dragon-quest/', publisher: 'The Strong National Museum of Play', accessed: '2026-10-10' },
      {
        title: '2026 World Video Game Hall of Fame Inductees Revealed',
        url: 'https://www.museumofplay.org/press-release/2026-world-video-game-hall-of-fame-inductees-revealed/',
        publisher: 'The Strong National Museum of Play',
        year: 2026,
        accessed: '2026-10-10',
      },
      {
        title: 'ドラクエで堀井雄二はいかに“編集”したか？――初代ドラクエの「1泊2日観光ツアー」革命',
        url: 'https://news.denfaminicogamer.jp/column03/game-gatari02/amp',
        publisher: '電ファミニコゲーマー',
        year: 2016,
        accessed: '2026-10-10',
      },
      {
        title: 'ファミコン版の「勇者」とは大違い!? 制約のあった“当時の『ドラクエ1』”から進化したアレコレ',
        url: 'https://www.gamespark.jp/article/2025/10/29/158907.html',
        publisher: 'Game*Spark',
        year: 2025,
        accessed: '2026-10-10',
      },
      {
        title: '【ウィンドウカラー】',
        url: 'https://wikiwiki.jp/dqdic3rd/%E3%80%90%E3%82%A6%E3%82%A3%E3%83%B3%E3%83%89%E3%82%A6%E3%82%AB%E3%83%A9%E3%83%BC%E3%80%91',
        publisher: 'ドラゴンクエスト大辞典を作ろうぜ！！第三版 Wiki',
        accessed: '2026-10-10',
      },
    ],
  },
  ficha: {
    documented: {
      es: 'Dragon Quest salió en 1986 para la Famicom; detrás estaban Yuji Horii, que escribió el guion, el dibujante de manga Akira Toriyama y el compositor Koichi Sugiyama [1]. El museo The Strong lo sumó en 2026 a su salón de la fama del videojuego, y le reconoce haber convertido los enrevesados juegos de rol de las computadoras occidentales en un juego de consola al alcance de cualquiera [2]. Como la Famicom no tenía teclado, las órdenes se eligen en ventanas que se abren al pulsar un botón, con los comandos dentro del marco [3]. The Strong atribuye a Horii ese sistema de menús en ventanas [1], y una columna de 2016 recoge que el manga Dragon Quest e no Michi se lo atribuye al programador Koichi Nakamura [3].',
      en: 'Dragon Quest came out in 1986 for the Famicom; behind it were Yuji Horii, who wrote the scenario, the manga artist Akira Toriyama and the composer Koichi Sugiyama [1]. The Strong museum added it to its video game hall of fame in 2026, crediting it with turning the knotty role-playing games of Western computers into a console game anyone could pick up [2]. With no keyboard on the Famicom, commands are picked from windows that open at a button press, with the commands inside the frame [3]. The Strong credits Horii with that system of windowed menus [1], while a 2016 column notes that the manga Dragon Quest e no Michi gives it to the programmer Koichi Nakamura [3].',
    },
    reading: {
      es: 'El tema arma cada superficie como una ventana de órdenes. En el esquema oscuro, que es el nativo, el fondo es negro y el marco y las letras, blancos; el esquema claro invierte esos dos colores. La acción principal es un bloque blanco con letras negras, una sola letra de puntos sirve para todo y los demás colores son del tema.',
      en: 'The theme sets every surface up as a command window. In the dark scheme, the native one, the ground is black and the frame and letters white; the light scheme swaps the two. The primary action is a white block with black letters, a single dot face serves for everything, and the other colours are the theme’s.',
    },
    palette: {
      origin: 'documented',
      note: {
        es: 'Una enciclopedia de aficionados de la serie explica que en Dragon Quest las ventanas suelen tener fondo negro, y que por eso el marco y las letras se dibujan en blanco [5]. Ninguna fuente que consultamos da los valores de esos colores; el resto de la paleta es del tema.',
        en: 'A fan encyclopedia of the series explains that Dragon Quest windows usually have a black ground, which is why the frame and the letters are drawn in white [5]. No source we consulted gives the values of those colours; the rest of the palette is the theme’s.',
      },
    },
    lettering: {
      original: { name: { es: 'La letra de puntos del juego', en: 'The game’s dot lettering' }, year: 1986, kind: 'bitmap' },
      documented: {
        es: 'El juego original solo podía mostrar 20 katakana [4]. La columna de 2016 da para la ventana un máximo de 18 × 3 caracteres a la vez, y, en una nota que toma de una enciclopedia de aficionados, cuenta que los dakuten iban en un hueco dejado sobre la línea, que la ヘ y la リ se tomaban de los hiragana y que la ト y la ド eran dos caracteres porque en la ventana de órdenes no cabía el dakuten encima de la letra [3]. Ninguna fuente que consultamos dice quién dibujó la letra.',
        en: 'The original game could display only 20 katakana [4]. The 2016 column gives the window a maximum of 18 × 3 characters at a time and, in a note it takes from a fan encyclopedia, says that the dakuten sat in a gap left above the line, that ヘ and リ were taken from the hiragana, and that ト and ド were two characters because the command window had no room for the dakuten above the letter [3]. No source we consulted says who drew the lettering.',
      },
      substitute: {
        es: 'El tema usa DotGothic16, una letra japonesa libre dibujada con puntos, con kana, kanji y alfabeto latino, para todo el texto. Comparte con la del juego el trazo de píxeles; difiere en el dibujo de sus letras y en que trae todos los katakana que al juego le faltaban.',
        en: 'The theme uses DotGothic16, a free Japanese face drawn in dots, with kana, kanji and the Latin alphabet, for all text. It shares the game’s pixel stroke; it differs in the drawing of its letters and in carrying every katakana the game lacked.',
      },
    },
    motion: {
      documented: {
        es: 'En los mensajes, el texto avanza carácter por carácter con un sonido, y un ▲ marca cada pausa [3]. La ventana de nivel aparece aparte del menú de órdenes, y sola, cuando el jugador deja los controles quietos un rato [3]. Ninguna fuente que consultamos da la velocidad del texto.',
        en: 'In messages the text advances character by character with a sound, and a ▲ marks each pause [3]. The level window appears apart from the command menu, and by itself, when the player leaves the controls alone for a while [3]. No source we consulted gives the speed of the text.',
      },
      reading: {
        es: 'El tema lo lleva a la apertura de un diálogo: el texto se descubre de izquierda a derecha, a saltos, en 900 ms. Es una aproximación, porque el juego escribía carácter por carácter en el orden de lectura y el tema descubre todas las líneas a la vez; la duración es del tema. Lo demás cambia al instante.',
        en: 'The theme carries it to a dialog opening: the text is uncovered from left to right, in steps, over 900 ms. It is an approximation, since the game wrote character by character in reading order while the theme uncovers every line at once; the duration is the theme’s. Everything else changes at once.',
      },
    },
  },
  fonts: { sans: 'dotgothic16' },
  colors: {
    bg: ['#fcfcfc', '#000000'],
    fg: ['#000000', '#fcfcfc'],
    fgMuted: ['#3c3c3c', '#bcbcbc'],
    surface: ['#ffffff', '#0c0c0c'],
    surfaceAlt: ['#e4e4e4', '#1c1c1c'],
    border: ['#000000', '#fcfcfc'],
    primary: ['#000000', '#fcfcfc'],
    primaryFg: 'auto',
    accent: ['#c84c0c', '#fc9838'],
    accentFg: 'auto',
    info: ['#0058f8', '#6888fc'],
    infoFg: 'auto',
    success: ['#007800', '#58d854'],
    successFg: 'auto',
    warning: ['#f8b800', '#f8b800'],
    warningFg: 'auto',
    danger: ['#a81000', '#f85838'],
    dangerFg: 'auto',
    focus: ['#0058f8', '#f8b800'],
  },
  type: { weightBody: 400, weightLabel: 400, weightDisplay: 400, displaySpacing: '0em', kerning: 'none' },
  shape: { borderWidth: 2, radius: 0, radiusControl: 0, radiusButton: 0, radiusSmall: 0 },
  elevation: flat(),
  motion: { duration: 0, durationSlow: 0, ease: 'linear' },
  motionFile: './dragon-quest.motion.css',
});
