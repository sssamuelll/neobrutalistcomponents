import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'super-mario-bros',
  scene: 'japan',
  nativeScheme: 'light',
  name: { es: 'Super Mario Bros.', en: 'Super Mario Bros.' },
  tagline: { es: 'Un cielo azul donde antes había negro, y cuatro colores por objeto.', en: 'A blue sky where there had been black, and four colours to an object.' },
  reference: {
    title: { es: 'Super Mario Bros. (Famicom)', en: 'Super Mario Bros. (Famicom)' },
    original: { text: 'スーパーマリオブラザーズ', lang: 'ja' },
    authors: ['Shigeru Miyamoto'],
    date: 1985,
    place: { es: 'Japón', en: 'Japan' },
    kind: 'software',
    sources: [
      { title: 'Super Mario Bros.', url: 'https://www.worldvideogamehalloffame.org/games/super-mario-bros', publisher: 'The Strong National Museum of Play', accessed: '2026-10-10' },
      { title: 'Iwata Asks — Volume 5: Original Super Mario Developers', url: 'https://iwataasks.nintendo.com/interviews/wii/mario25th/4/3', publisher: 'Nintendo', accessed: '2026-10-10' },
      { title: 'PPU palettes', url: 'https://www.nesdev.org/wiki/PPU_palettes', publisher: 'NESdev Wiki', accessed: '2026-10-10' },
      { title: 'menu of super mario bros.', url: 'https://nesdev.nes.science/f21/t18405.xhtml', publisher: 'NESdev BBS', accessed: '2026-10-10' },
    ],
  },
  ficha: {
    documented: {
      es: 'Super Mario Bros. salió en 1985 para la Famicom; el museo The Strong se lo atribuye al diseñador Shigeru Miyamoto, con Nintendo como editora [1]. En la serie Iwata Asks, Toshihiko Nakago cuenta que sintió que el juego era algo extraordinario cuando hicieron el fondo, y Satoru Iwata lo precisa: cuando pasó del negro a un cielo azul [2]. En la misma charla, Miyamoto muestra una hoja de planificación firmada en febrero de 1985 con una paleta en una esquina, e Iwata recuerda que cada objeto solo podía usar cuatro colores, de modo que los arbustos y las nubes salían de las mismas piezas [2]. La consola toma esos colores de entre 64 salidas [3].',
      en: 'Super Mario Bros. came out in 1985 for the Famicom; The Strong museum credits it to the designer Shigeru Miyamoto, with Nintendo as publisher [1]. In the Iwata Asks series, Toshihiko Nakago says he felt the game had become something extraordinary when they did the background, and Satoru Iwata pins it down: when it went from black to a blue sky [2]. In the same talk Miyamoto produces a planning sheet signed in February 1985 with a palette in one corner, and Iwata recalls that each object could use only four colours, so the bushes and the clouds came from the same pieces [2]. The console draws those colours from 64 outputs [3].',
    },
    reading: {
      es: 'El tema toma el cielo del juego: en el esquema claro, el fondo es azul, el rojo ladrillo va en las acciones principales y un dorado de moneda en el acento; el esquema oscuro vuelve al negro de antes del cielo. Los títulos van en mayúsculas de píxeles. Nada se mueve: las fuentes que consultamos no describen cómo se movían sus pantallas de texto.',
      en: 'The theme takes the game’s sky: in the light scheme the ground is blue, brick red goes on primary actions and a coin gold on the accent; the dark scheme returns to the black from before the sky. Titles are set in pixel capitals. Nothing moves: the sources we consulted do not describe how its text screens moved.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'El cielo azul y el límite de cuatro colores por objeto están documentados [2], igual que las 64 salidas de la consola [3]; los tonos son una lectura del tema.',
        en: 'The blue sky and the limit of four colours to an object are documented [2], as are the console’s 64 outputs [3]; the tones are the theme’s reading.',
      },
    },
    lettering: {
      original: { name: { es: 'Las letras de baldosas del juego', en: 'The game’s tile lettering' }, year: 1985, kind: 'bitmap' },
      documented: {
        es: 'Un análisis publicado en el foro de NESdev identifica las baldosas gráficas con las que se arma el título «SUPER MARIO BROS» en la pantalla de inicio [4]. Ninguna fuente que consultamos nombra la letra del juego ni dice quién la dibujó.',
        en: 'An analysis posted on the NESdev forum identifies the graphic tiles that build the title “SUPER MARIO BROS” on the start screen [4]. No source we consulted names the game’s lettering or says who drew it.',
      },
      substitute: {
        es: 'El tema usa Press Start 2P, una letra libre de píxeles en mayúsculas gruesas, para los títulos, y DotGothic16, también de puntos, para el texto y para el nombre japonés. Ninguna de las dos copia las letras del juego, que no están documentadas; Press Start 2P tiene un solo peso y los títulos no se engrosan.',
        en: 'The theme uses Press Start 2P, a free pixel face with heavy capitals, for titles, and DotGothic16, also made of dots, for text and for the Japanese name. Neither copies the game’s letters, which are undocumented; Press Start 2P has a single weight, and titles are not thickened.',
      },
    },
  },
  fonts: { sans: 'dotgothic16', display: 'press-start-2p' },
  colors: {
    bg: ['#5c94fc', '#000000'],
    fg: ['#000000', '#fcfcfc'],
    fgMuted: ['#10204a', '#bcbcbc'],
    surface: ['#fcfcfc', '#101010'],
    surfaceAlt: ['#fcd8a8', '#1c2440'],
    border: ['#000000', '#fcfcfc'],
    primary: ['#c84c0c', '#e45c10'],
    primaryFg: 'auto',
    accent: ['#fca044', '#fca044'],
    accentFg: 'auto',
    info: ['#0058f8', '#3cbcfc'],
    infoFg: 'auto',
    success: ['#00a800', '#58d854'],
    successFg: 'auto',
    warning: ['#f8b800', '#f8b800'],
    warningFg: 'auto',
    danger: ['#a80020', '#f85898'],
    dangerFg: 'auto',
    focus: ['#000000', '#fca044'],
  },
  type: { weightBody: 400, weightLabel: 400, weightDisplay: 400, displayTransform: 'uppercase', displaySpacing: '0em', kerning: 'none' },
  shape: { borderWidth: 2, radius: 0, radiusControl: 0, radiusButton: 0, radiusSmall: 0 },
  elevation: flat(),
  motion: { duration: 0, durationSlow: 0, ease: 'linear' },
});
