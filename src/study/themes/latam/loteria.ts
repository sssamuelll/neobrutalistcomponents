import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'loteria',
  scene: 'latam',
  nativeScheme: 'light',
  name: { es: 'Lotería', en: 'Lotería' },
  tagline: { es: 'Cincuenta y cuatro cartas, cada una con su número y su nombre.', en: 'Fifty-four cards, each with its number and its name.' },
  reference: {
    title: { es: 'Lotería mexicana (baraja de Don Clemente)', en: 'Mexican lotería (the Don Clemente deck)' },
    authors: ['Clemente Jacques'],
    date: 1887,
    place: { es: 'México', en: 'Mexico' },
    kind: 'graphic',
    sources: [
      {
        title: 'La Lotería Mexicana / The Mexican Lotería Historical Marker',
        url: 'https://www.hmdb.org/m.asp?m=177212',
        publisher: 'The Historical Marker Database (marker by the Mexican Embassy in the United States and the Mexican Cultural Institute)',
        accessed: '2026-10-10',
      },
      { title: 'Clemente Jacques, el creador de la lotería mexicana', url: 'https://gecentenarios.com/clemente-jacques-el-creador-de-la-loteria-mexicana/', publisher: 'Grupo Editorial Centenarios', accessed: '2026-10-10' },
      { title: 'Sobre nosotros', url: 'https://www.clementejacques.com.mx/sobre-nosotros/', publisher: 'Clemente Jacques', accessed: '2026-10-10' },
    ],
  },
  ficha: {
    documented: {
      es: 'La baraja tradicional de la lotería mexicana tiene 54 cartas, y cada una lleva una imagen, un número y un nombre propios [1][2]. Una placa histórica la atribuye a Don Clemente Jacques, en México, en 1887 [1]; la empresa que lleva su nombre cuenta que Jacques importaba y vendía el juego antes de fundar su fábrica [3]. Se juega de forma parecida al bingo, y a quien canta las cartas se le llama el gritón [1].',
      en: 'Fifty-four cards make up the traditional Mexican lotería deck, and on every one an image comes with a number and a name [1][2]. A historical marker credits it to Don Clemente Jacques, in Mexico, in 1887 [1]; the company that bears his name says Jacques imported and sold the game before he founded his factory [3]. It plays much like bingo, and whoever calls out the cards is known as the gritón [1].',
    },
    reading: {
      es: 'El tema arma la interfaz como una carta: un marco negro fino, fondos planos de colores claros y el nombre en mayúsculas al pie. El crema del papel es el fondo, el azul claro de muchas cartas va en las superficies alternas y el amarillo, en el acento. Nada se mueve: es una baraja impresa.',
      en: 'The theme sets the interface up as a card: a thin black frame, flat pale backgrounds and the name in capitals at the foot. The paper’s cream is the background, the pale blue of many cards goes on alternate surfaces and the yellow on the accent. Nothing moves: it is a printed deck.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'Ninguna fuente que consultamos da los colores de la baraja; los tonos son una lectura de cartas impresas actuales.',
        en: 'No source we consulted gives the deck’s colours; the tones are a reading of present-day printed cards.',
      },
    },
    lettering: {
      original: { name: { es: 'Los nombres de las cartas', en: 'The card names' }, kind: 'lettered' },
      documented: {
        es: 'Cada carta lleva su nombre escrito, junto a la imagen y al número [1][2]. Ninguna fuente que consultamos dice quién rotuló los nombres ni con qué letra.',
        en: 'Each card carries its name in writing, beside the image and the number [1][2]. No source we consulted says who lettered the names or in what letters.',
      },
      substitute: {
        es: 'El tema usa Libre Franklin en negrita y en mayúsculas para los títulos, y Noto Sans para el texto. En las cartas impresas de hoy vemos los nombres en mayúsculas negras de palo seco, y Libre Franklin busca esa voz sin pretender que sea la letra original, que no está documentada.',
        en: 'The theme uses bold Libre Franklin in capitals for titles, and Noto Sans for text. On present-day printed cards we see the names in black sans-serif capitals, and Libre Franklin aims for that voice without claiming to be the original letters, which are undocumented.',
      },
    },
  },
  fonts: { sans: 'noto-sans', display: 'libre-franklin' },
  colors: {
    bg: ['#f7f0dc', '#1b1a17'],
    fg: ['#141414', '#f5efe0'],
    fgMuted: ['#4d4a42', '#bdb6a6'],
    surface: ['#fffaf0', '#24221e'],
    surfaceAlt: ['#cdeaf4', '#1d3540'],
    border: ['#141414', '#f5efe0'],
    primary: ['#1f6f9c', '#8fd3ec'],
    primaryFg: 'auto',
    accent: ['#f2d43b', '#f2d43b'],
    accentFg: 'auto',
    info: ['#1f6f9c', '#8fd3ec'],
    infoFg: 'auto',
    success: ['#28702f', '#7cc98a'],
    successFg: 'auto',
    warning: ['#f2d43b', '#f2d43b'],
    warningFg: 'auto',
    danger: ['#b3202e', '#ff8a8f'],
    dangerFg: 'auto',
    focus: ['#1f6f9c', '#f2d43b'],
  },
  type: { weightBody: 400, weightLabel: 600, weightDisplay: 700, displayTransform: 'uppercase', displaySpacing: '0.02em' },
  shape: { borderWidth: 2, radius: 4, radiusControl: 4, radiusButton: 4, radiusSmall: 2 },
  elevation: flat(),
  motion: { duration: 0, durationSlow: 0, ease: 'linear' },
});
