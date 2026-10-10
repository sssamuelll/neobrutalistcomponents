import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'caracas-signage',
  scene: 'latam',
  nativeScheme: 'light',
  name: { es: 'Señalética de Caracas', en: 'Caracas signage' },
  tagline: { es: 'Una M roja sobre negro, y cada línea con su color.', en: 'A red M on black, and every line in its colour.' },
  reference: {
    title: { es: 'Señalética e identidad gráfica del metro de Caracas', en: 'Signage and graphic identity of the Caracas metro' },
    original: { text: 'Metro de Caracas', lang: 'es' },
    authors: ['Max Pedemonte', 'BMPT'],
    date: 1983,
    place: { es: 'Caracas, Venezuela', en: 'Caracas, Venezuela' },
    kind: 'signage',
    sources: [
      { title: 'Metro de Caracas', url: 'https://es.wikipedia.org/wiki/Metro_de_Caracas', publisher: 'Wikipedia', accessed: '2026-10-10' },
      {
        title: 'Diagramas y abstracciones: el Metro de Caracas',
        url: 'https://web.archive.org/web/20240907062711/https://guiaccs.com/planos/diagramas-y-abstracciones-el-metro-de-caracas/',
        publisher: 'Guía de Caracas (Internet Archive)',
        accessed: '2026-10-10',
      },
    ],
    image: {
      file: 'caracas-signage.avif',
      width: 462,
      height: 793,
      alt: {
        es: 'Entrada de la estación Propatria: una banda negra con una M roja a la izquierda y el nombre de la estación en letras blancas, bajo una fachada de azulejos azules.',
        en: 'The entrance to Propatria station: a black band with a red M on the left and the station’s name in white letters, under a façade of blue tiles.',
      },
      author: 'Venezuelametro',
      license: 'CC0-1.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Propatria_(metro_de_Caracas).png',
    },
  },
  ficha: {
    documented: {
      es: 'La Línea 1 del metro de Caracas abrió el 2 de enero de 1983, entre Propatria y La Hoyada [1]. El estudio BMPT hizo el concepto gráfico inicial, y la señalización, el equipamiento y la integración de obras de artistas como Soto, Cruz-Diez y Gego se hicieron bajo la dirección de Max Pedemonte, en la División de Arquitectura de la empresa [2]. El logotipo es una M roja que hace con la M de metro lo que el metro de Londres había hecho con su U, acompañada por los colores de las líneas; la Línea 1 es naranja [2].',
      en: 'Line 1 of the Caracas metro opened on 2 January 1983, between Propatria and La Hoyada [1]. The studio BMPT made the first graphic concept, and the signage, the fittings and the integration of works by artists such as Soto, Cruz-Diez and Gego were carried out under Max Pedemonte, in the company’s Architecture Division [2]. The logo is a red M that does with the M of metro what the London Underground had done with its U, joined by the lines’ colours; Line 1 is orange [2].',
    },
    reading: {
      es: 'El tema toma el letrero de la entrada: una banda negra con la M roja y el nombre en blanco. El negro va en los bordes y en el texto, el rojo de la M en las acciones principales y el azul de los azulejos de la fachada en el acento. Esquinas rectas, sin sombras, como un cartel atornillado al muro; nada se mueve.',
      en: 'The theme takes the sign over the entrance: a black band with the red M and the name in white. Black goes on the borders and the text, the M’s red on primary actions and the blue of the façade tiles on the accent. Square corners, no shadows, like a sign bolted to the wall; nothing moves.',
    },
    palette: {
      origin: 'sampled',
      note: {
        es: 'El rojo del logotipo y el naranja de la Línea 1 están documentados con palabras [2]; los valores salen de la fotografía de la entrada de Propatria, con el negro de la banda y el azul de los azulejos.',
        en: 'The logo’s red and Line 1’s orange are documented in words [2]; the values come from the photograph of the Propatria entrance, with the band’s black and the tiles’ blue.',
      },
    },
    lettering: {
      original: { name: 'Helvetica', designer: 'Max Miedinger, Eduard Hoffmann', kind: 'outline' },
      documented: {
        es: 'El logotipo del metro usa Helvetica para su M roja [2]. Ninguna fuente que consultamos dice en qué letra se compusieron los nombres de las estaciones.',
        en: 'The metro’s logo sets its red M in Helvetica [2]. No source we consulted says what letters the station names were set in.',
      },
      substitute: {
        es: 'El tema usa Arimo, una grotesca libre, para el texto y los títulos. En sus proporciones vemos las de Helvetica, y en el letrero de Propatria el nombre blanco nos parece de la misma familia; Arimo difiere en letras como la R, la G y la t.',
        en: 'The theme uses Arimo, a free grotesque, for text and titles. In its proportions we see Helvetica’s, and on the Propatria sign the white name looks to us of the same family; Arimo differs in letters such as R, G and t.',
      },
    },
  },
  fonts: { sans: 'arimo' },
  colors: {
    bg: ['#f4f4f2', '#111111'],
    fg: ['#111111', '#f2f2f2'],
    fgMuted: ['#555555', '#b0b0b0'],
    surface: ['#ffffff', '#1b1b1b'],
    surfaceAlt: ['#e3e8f4', '#1d2540'],
    border: ['#111111', '#f2f2f2'],
    primary: ['#c4371a', '#ff6a3d'],
    primaryFg: 'auto',
    accent: ['#2f4fa3', '#8aa4e8'],
    accentFg: 'auto',
    info: ['#2f4fa3', '#8aa4e8'],
    infoFg: 'auto',
    success: ['#2e7d32', '#6fcf73'],
    successFg: 'auto',
    warning: ['#f08a00', '#ffb24d'],
    warningFg: 'auto',
    danger: ['#a61b1b', '#ff7a6e'],
    dangerFg: 'auto',
    focus: ['#c4371a', '#ff6a3d'],
  },
  type: { weightBody: 400, weightLabel: 700, weightDisplay: 700, displaySpacing: '-0.01em' },
  shape: { borderWidth: 2, radius: 0, radiusControl: 0, radiusButton: 0, radiusSmall: 0 },
  elevation: flat(),
  motion: { duration: 0, durationSlow: 0, ease: 'linear' },
});
