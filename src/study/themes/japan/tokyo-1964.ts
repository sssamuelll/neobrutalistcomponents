import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'tokyo-1964',
  scene: 'japan',
  nativeScheme: 'light',
  name: { es: 'Tokio 1964', en: 'Tokyo 1964' },
  tagline: { es: 'Un disco rojo, cinco aros dorados, un nombre y un año.', en: 'A red disc, five gold rings, a name and a year.' },
  reference: {
    title: { es: 'Cartel de los Juegos Olímpicos de Tokio 1964', en: 'Poster for the Tokyo 1964 Olympic Games' },
    authors: ['Yusaku Kamekura'],
    date: 1961,
    place: { es: 'Tokio, Japón', en: 'Tokyo, Japan' },
    kind: 'graphic',
    sources: [
      { title: 'Poster for Tokyo Olympic Games 1964', url: 'https://walkerart.org/collections/artworks/poster-for-tokyo-olympic-games-1964', publisher: 'Walker Art Center', accessed: '2026-10-10' },
      {
        title: 'Celebrating the legacy of Kamekura Yusaku’s iconic Tokyo 1964 Olympics identity',
        url: 'https://www.itsnicethat.com/features/kamekura-yusaku-tokyo-1964-olympics-identity-graphic-design-040821',
        publisher: 'It’s Nice That',
        year: 2021,
        accessed: '2026-10-10',
      },
      { title: '’64 Tokyo Olympics First Poster and Logo', url: 'https://ndc.co.jp/en/projects/olympic-games-tokyo-1964-logomark', publisher: 'Nippon Design Center', accessed: '2026-10-10' },
      { title: 'Tokyo 1964 posters', url: 'https://fontsinuse.com/uses/53197/tokyo-1964-posters', publisher: 'Fonts In Use', accessed: '2026-10-10' },
    ],
  },
  ficha: {
    documented: {
      es: 'Yusaku Kamekura hizo este cartel en 1961 para los Juegos Olímpicos de Tokio de 1964, y el Walker Art Center lo cataloga como una litografía offset sobre papel [1]. Casi toda la hoja la ocupa un disco rojo sobre blanco; debajo quedan los cinco aros y «TOKYO 1964», aros y letras en dorado, las letras de palo seco y gruesas [2]. Nippon Design Center presenta ese conjunto como el primer cartel y el logotipo de los Juegos [3]. Fue el primero de los cuatro carteles que Kamekura hizo para los Juegos, y los otros tres fueron los primeros carteles olímpicos con fotografía [2].',
      en: 'Yusaku Kamekura made this poster in 1961 for the 1964 Tokyo Olympic Games, and the Walker Art Center catalogues it as an offset lithograph on paper [1]. Most of the sheet is a red disc on white; below it sit the five rings and “TOKYO 1964”, rings and letters alike in gold, the letters a thick sans-serif [2]. Nippon Design Center presents that ensemble as the Games’ first poster and their logo [3]. It was the first of the four posters Kamekura made for the Games, and the other three were the first Olympic posters to use photography [2].',
    },
    reading: {
      es: 'El tema toma los tres colores del cartel: el blanco del fondo, el rojo del disco en las acciones principales y el dorado de los aros en el acento. Los títulos van en mayúsculas estrechas y gruesas, como la inscripción. Esquinas rectas, sin sombras; nada se mueve, es un cartel impreso.',
      en: 'The theme takes the poster’s three colours: the white of the ground, the disc’s red on primary actions and the gold of the rings on the accent. Titles are set in narrow, heavy capitals, like the inscription. Square corners, no shadows; nothing moves, it is a printed poster.',
    },
    palette: {
      origin: 'documented',
      note: {
        es: 'El rojo del disco, el blanco del fondo y el dorado de los aros y las letras están documentados con palabras [2]; ninguna fuente que consultamos da sus valores, que son una lectura del tema.',
        en: 'The disc’s red, the white ground and the gold of the rings and letters are documented in words [2]; no source we consulted gives their values, which are the theme’s reading.',
      },
    },
    lettering: {
      original: { name: 'Schmalfette Grotesk', designer: 'Walter Haettenschweiler', kind: 'outline' },
      documented: {
        es: 'Según Fonts In Use, los tres carteles que describe como un tríptico, este entre ellos, usaron la Schmalfette Grotesk de Walter Haettenschweiler [4]; It’s Nice That describe la inscripción de este como una palo seco dorada y gruesa [2].',
        en: 'According to Fonts In Use, the three posters it describes as a triptych, this one among them, used Walter Haettenschweiler’s Schmalfette Grotesk [4]; It’s Nice That describes this one’s inscription as a heavy gold sans-serif [2].',
      },
      substitute: {
        es: 'El tema usa Anton para los títulos y Noto Sans para el texto. Anton es una grotesca libre, estrecha y gruesa, que busca la compresión y el peso de la inscripción; difiere en el dibujo de cada letra. Anton tiene un solo peso, y los títulos no se engrosan.',
        en: 'The theme uses Anton for titles and Noto Sans for text. Anton is a free grotesque, narrow and heavy, that aims for the inscription’s compression and weight; it differs in the drawing of each letter. Anton has a single weight, and titles are not thickened.',
      },
    },
  },
  fonts: { sans: 'noto-sans', display: 'anton' },
  colors: {
    bg: ['#fbfaf7', '#121212'],
    fg: ['#141414', '#f6f3ec'],
    fgMuted: ['#55524b', '#bdb8ad'],
    surface: ['#ffffff', '#1c1c1c'],
    surfaceAlt: ['#f3ecdc', '#2a2418'],
    border: ['#141414', '#f6f3ec'],
    primary: ['#c8102e', '#ff4a5f'],
    primaryFg: 'auto',
    accent: ['#b08d3a', '#d9b45a'],
    accentFg: 'auto',
    info: ['#1f4f8f', '#8fb3e8'],
    infoFg: 'auto',
    success: ['#2f6b3a', '#7cc98a'],
    successFg: 'auto',
    warning: ['#d9a400', '#f2c14e'],
    warningFg: 'auto',
    danger: ['#7d0a18', '#ffa38a'],
    dangerFg: 'auto',
    focus: ['#1f4f8f', '#8fb3e8'],
  },
  type: { weightBody: 400, weightLabel: 600, weightDisplay: 400, displayTransform: 'uppercase', displaySpacing: '0.01em' },
  shape: { borderWidth: 2, radius: 0, radiusControl: 0, radiusButton: 0, radiusSmall: 0 },
  elevation: flat(),
  motion: { duration: 0, durationSlow: 0, ease: 'linear' },
});
