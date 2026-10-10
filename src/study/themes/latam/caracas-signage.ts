import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'caracas-signage',
  scene: 'latam',
  nativeScheme: 'light',
  name: { es: 'Señalética de Caracas', en: 'Caracas signage' },
  tagline: { es: 'Una M roja en Helvetica, y cada línea con su color.', en: 'A red M in Helvetica, and every line in its colour.' },
  reference: {
    title: { es: 'Señalética e identidad gráfica del metro de Caracas', en: 'Signage and graphic identity of the Caracas metro' },
    original: { text: 'Metro de Caracas', lang: 'es' },
    authors: ['Max Pedemonte', 'BMPT'],
    date: 1983,
    place: { es: 'Caracas, Venezuela', en: 'Caracas, Venezuela' },
    kind: 'signage',
    sources: [
      { title: 'La época en la que el Metro fue “la gran solución para Caracas”', url: 'https://eldiario.com/2021/01/02/epoca-metro-gran-solucion-caracas/', publisher: 'El Diario', accessed: '2026-10-10' },
      {
        title: 'Del plano al diagrama',
        url: 'https://web.archive.org/web/20240907062711/https://guiaccs.com/planos/diagramas-y-abstracciones-el-metro-de-caracas/',
        publisher: 'Caracas del valle al mar, guía de arquitectura y paisaje (Internet Archive)',
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
      es: 'El metro de Caracas abrió el 2 de enero de 1983, con un primer tramo de Propatria a La Hoyada [1]. El estudio BMPT hizo el concepto gráfico inicial, y Max Pedemonte dirigió desde la División de Arquitectura de la empresa la señalización, el equipamiento y la integración de obras de artistas como Soto, Cruz-Diez y Gego [2]. El logotipo es una M roja en Helvetica que hace con la M de metro lo que el metro de Londres había hecho con su U; cada uno de los cuatro tramos del sistema tenía su color, naranja, amarillo, azul y verde, y esos colores corrían también en una franja horizontal sobre los vagones [2].',
      en: 'The Caracas metro opened on 2 January 1983, its first stretch running from Propatria to La Hoyada [1]. The studio BMPT made the first graphic concept, and Max Pedemonte, from the company’s Architecture Division, directed the signage, the fittings and the integration of works by artists such as Soto, Cruz-Diez and Gego [2]. The logo is a red M in Helvetica that does with the M of metro what the London Underground had done with its U; each of the system’s four sections had its colour, orange, yellow, blue and green, and those colours also ran as a horizontal stripe along the cars [2].',
    },
    reading: {
      es: 'El tema toma un letrero de entrada de hoy, el de Propatria, fotografiado en 2025: una banda negra con la M roja y el nombre en blanco. Ninguna fuente que consultamos fecha ese letrero ni dice quién lo diseñó. El negro va en los bordes y en el texto, el rojo de la M en las acciones principales y el azul de los azulejos en el acento. Esquinas rectas, sin sombras, como un cartel atornillado al muro; nada se mueve.',
      en: 'The theme takes a present-day entrance sign, Propatria’s, photographed in 2025: a black band with the red M and the name in white. No source we consulted dates that sign or says who designed it. Black goes on the borders and the text, the M’s red on primary actions and the tiles’ blue on the accent. Square corners, no shadows, like a sign bolted to the wall; nothing moves.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'El rojo del logotipo y los colores de los cuatro tramos están documentados con palabras [2]. Los valores parten de la fotografía de Propatria, de 2025, con el negro de la banda y el azul de los azulejos, y son más saturados que lo que muestra la foto.',
        en: 'The logo’s red and the four sections’ colours are documented in words [2]. The values start from the 2025 photograph of Propatria, with the band’s black and the tiles’ blue, and are more saturated than the photo shows.',
      },
    },
    lettering: {
      original: { name: { es: 'Helvetica, en la M del logotipo', en: 'Helvetica, in the logo’s M' }, designer: 'Max Miedinger, Eduard Hoffmann', kind: 'outline' },
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
    focus: ['#2f4fa3', '#8aa4e8'],
  },
  type: { weightBody: 400, weightLabel: 700, weightDisplay: 700, displaySpacing: '-0.01em' },
  shape: { borderWidth: 2, radius: 0, radiusControl: 0, radiusButton: 0, radiusSmall: 0 },
  elevation: flat(),
  motion: { duration: 0, durationSlow: 0, ease: 'linear' },
});
