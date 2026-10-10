import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'create-two-three-many-vietnams',
  scene: 'latam',
  nativeScheme: 'light',
  name: { es: 'Muchos Vietnam', en: 'Many Vietnams' },
  tagline: { es: 'Fotos repetidas en rojo, un titular negro y una línea escrita a mano.', en: 'Photographs repeated in red, a black headline and a handwritten line.' },
  reference: {
    title: { es: 'Crear dos, tres… muchos Vietnam (cartel de la OSPAAAL)', en: 'Create two, three… many Vietnams (OSPAAAL poster)' },
    authors: ['Alfredo Rostgaard'],
    date: 1967,
    place: { es: 'Cuba', en: 'Cuba' },
    kind: 'graphic',
    sources: [
      {
        title: 'Create, two, three...many Vietnams',
        url: 'https://collections.vam.ac.uk/item/O1663897/create-two-threemany-vietnams-poster-alfredo-rostgaard/',
        publisher: 'Victoria and Albert Museum',
        accessed: '2026-10-10',
      },
      { title: 'Revolutionary design: OSPAAAL and the art of the poster', url: 'https://www.vam.ac.uk/articles/revolutionary-design-ospaaal-and-the-art-of-the-poster', publisher: 'Victoria and Albert Museum', accessed: '2026-10-10' },
      { title: 'Solidarity and design: an introduction to OSPAAAL', url: 'https://www.vam.ac.uk/articles/solidarity-and-design-an-introduction-to-ospaaal', publisher: 'Victoria and Albert Museum', accessed: '2026-10-10' },
    ],
  },
  ficha: {
    documented: {
      es: 'Alfredo Rostgaard hizo este cartel para la OSPAAAL en 1967, en solidaridad con Vietnam. Es una litografía impresa en rojo donde fotos de Che Guevara fumando se repiten por todo el pliego, y su título cita un artículo de Guevara que la revista Tricontinental publicó en abril de 1967 [1]. Como primer director creativo de la OSPAAAL, Rostgaard armaba montajes que repetían dos o tres fotografías, y el V&A pone este cartel como ejemplo [2]. La mayoría de los carteles de la organización se imprimían en offset [3].',
      en: 'Alfredo Rostgaard made this poster for OSPAAAL in 1967, in solidarity with Vietnam. It is a lithograph printed in red, where pictures of Che Guevara smoking recur across the sheet, and its title quotes an article by Guevara that Tricontinental magazine ran in April 1967 [1]. As OSPAAAL’s first creative director, Rostgaard built montages that repeated two or three photographs, and the V&A gives this poster as an example [2]. Most of the organisation’s posters were printed in offset [3].',
    },
    reading: {
      es: 'El tema toma las tres franjas del cartel: arriba el crema del papel con el titular, en medio el rojo de las fotos, abajo el negro. El rojo va en las acciones principales y el negro en los bordes y en el texto. Esquinas rectas y sin sombras, como un pliego impreso; nada se mueve.',
      en: 'The theme takes the poster’s three bands: the paper’s cream with the headline on top, the red of the photographs in the middle, black below. Red goes on primary actions and black on the borders and the text. Square corners and no shadows, like a printed sheet; nothing moves.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'El V&A describe el cartel en rojo [1] y cuenta que, como escaseaba la tinta, los carteles de la organización solían arreglarse con dos o tres colores [2]; los valores son una lectura de la imagen del museo.',
        en: 'The V&A describes the poster as red [1] and says that ink was scarce, so the organisation’s posters often made do with two or three colours [2]; the values are a reading of the museum’s image.',
      },
    },
    lettering: {
      original: { name: { es: 'Rótulos del cartel, en inglés y español', en: 'The poster’s lettering, in English and Spanish' }, kind: 'lettered' },
      documented: {
        es: 'El V&A registra el cartel como rotulado en inglés y en español [1], y explica que los carteles de la OSPAAAL solían llevar sus textos en cuatro de las lenguas oficiales de la ONU [3]. Ninguna fuente que consultamos dice si las letras se dibujaron o se compusieron.',
        en: 'The V&A records the poster as lettered in English and Spanish [1], and explains that OSPAAAL posters usually carried their texts in four of the UN’s official languages [3]. No source we consulted says whether the letters were drawn or set.',
      },
      substitute: {
        es: 'El tema usa Barlow Condensed para los títulos y Barlow para el texto. En la imagen del museo vemos el titular en inglés en mayúsculas de grotesca estrecha y negra, y Barlow Condensed busca ese peso sin copiar sus letras; la línea en español, escrita a mano, no tiene equivalente en el tema.',
        en: 'The theme uses Barlow Condensed for titles and Barlow for text. In the museum’s image we see the English headline in narrow, heavy grotesque capitals, and Barlow Condensed aims for that weight without copying its letters; the Spanish line, written by hand, has no counterpart in the theme.',
      },
    },
  },
  fonts: { sans: 'barlow', display: 'barlow-condensed' },
  colors: {
    bg: ['#f3ead8', '#1a1414'],
    fg: ['#141414', '#f5ece0'],
    fgMuted: ['#4f4a40', '#c4b8a8'],
    surface: ['#fbf6ea', '#231b1b'],
    surfaceAlt: ['#f0d4dc', '#3a1d26'],
    border: ['#141414', '#f5ece0'],
    primary: ['#a5154a', '#ff5c8a'],
    primaryFg: 'auto',
    accent: ['#141414', '#f5ece0'],
    accentFg: 'auto',
    info: ['#1f3f6b', '#8fb3e8'],
    infoFg: 'auto',
    success: ['#2f6b3a', '#7cc98a'],
    successFg: 'auto',
    warning: ['#e0a400', '#f2c14e'],
    warningFg: 'auto',
    danger: ['#8c0d1d', '#ff7a6e'],
    dangerFg: 'auto',
    focus: ['#a5154a', '#ff5c8a'],
  },
  type: { weightBody: 400, weightLabel: 600, weightDisplay: 800, displayTransform: 'uppercase', displaySpacing: '0em' },
  shape: { borderWidth: 2, radius: 0, radiusControl: 0, radiusButton: 0, radiusSmall: 0 },
  elevation: flat(),
  motion: { duration: 0, durationSlow: 0, ease: 'linear' },
});
