import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'din-1451',
  scene: 'germany',
  nativeScheme: 'light',
  name: { es: 'DIN 1451', en: 'DIN 1451' },
  tagline: { es: 'Letras normalizadas para carteles, matasellos y matrículas.', en: 'Standardised letters for signs, postmarks and number plates.' },
  reference: {
    title: { es: 'DIN 1451, la letra normalizada alemana', en: 'DIN 1451, the German standard lettering' },
    original: { text: 'DIN-Schrift', lang: 'de' },
    authors: ['Ludwig Goller'],
    date: [1931, 1936],
    place: { es: 'Alemania', en: 'Germany' },
    kind: 'type',
    sources: [
      { title: 'DIN 1451', url: 'https://fontsinuse.com/typefaces/1149/din-1451', publisher: 'Fonts In Use', accessed: '2026-10-10' },
      { title: 'DIN 1451:1931-08', url: 'https://www.dinmedia.de/en/standard/din-1451/75548366', publisher: 'DIN Media', accessed: '2026-10-10' },
      { title: 'DIN specifications', url: 'https://luc.devroye.org/fonts-56209.html', publisher: 'Luc Devroye', accessed: '2026-10-10' },
      { title: 'Autobahnschilder: Warum funktioniert blau so gut?', url: 'https://www.auto-motor-und-sport.de/verkehr/autobahnschilder-warum-funktioniert-blau-so-gut/', publisher: 'auto motor und sport', accessed: '2026-10-10' },
    ],
    image: {
      file: 'din-1451.avif',
      width: 1600,
      height: 766,
      alt: {
        es: 'Pórtico sobre la autopista A9, en Baviera, con dos carteles azules de letras blancas: «Naila/Selbitz 3500 m» y «Bayerisches Vogtland 1700 m».',
        en: 'A gantry over the A9 motorway in Bavaria with two blue signs in white letters: “Naila/Selbitz 3500 m” and “Bayerisches Vogtland 1700 m”.',
      },
      author: 'Tage Olsin',
      license: 'CC-BY-SA-2.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Autobahn_A9_Autobahndreieck_Bayerisches_Vogtland_1700_m_from_south.jpg',
    },
  },
  ficha: {
    documented: {
      es: 'El comité alemán de normas industriales fijó la DIN 1451 en 1931, bajo la supervisión de Ludwig Goller, y la confirmó en 1936 [1]; la edición de agosto de 1931 fue reemplazada por otras, entre ellas la de diciembre de 1936, y esa edición está hoy retirada [2]. Luc Devroye fecha la primera DIN 1451 en 1927: unas especificaciones construidas sobre una retícula que el ingeniero de Siemens Goller dirigió en 1926 y 1927, y que con los años dieron la Engschrift y la Mittelschrift de 1931 [3]. Donde más se vio fue en las señales de tráfico, en los matasellos y, hasta 1994, en las matrículas [1].',
      en: 'Ludwig Goller supervised the German industrial standards committee’s work on DIN 1451, which the committee laid down in 1931 and ratified in 1936 [1]; the August 1931 edition was replaced by others, the December 1936 one among them, and that edition is now withdrawn [2]. Luc Devroye dates the first DIN 1451 to 1927: grid-built specifications the Siemens engineer Goller led in 1926 and 1927, which over the years gave the Engschrift and the Mittelschrift of 1931 [3]. Where it showed most was on German road signs and postmarks, and on number plates until 1994 [1].',
    },
    reading: {
      es: 'El tema toma un cartel de autopista, fotografiado en 2005: el azul de tráfico en las acciones principales, el blanco de las letras y, en el esquema oscuro, el azul como fondo; el amarillo de las carreteras comunes va en el acento. Bordes firmes y esquinas apenas redondeadas, como las de los carteles de la foto. Una letra no se mueve.',
      en: 'The theme takes a motorway sign, photographed in 2005: traffic blue on primary actions, the white of the letters and, in the dark scheme, the blue as ground; the yellow of ordinary roads goes on the accent. Firm borders and barely rounded corners, like the signs in the photo. Lettering does not move.',
    },
    palette: {
      origin: 'documented',
      note: {
        es: 'En 1938 se dispuso que los carteles de las autopistas del Reich fueran azules, con letras blancas, y así se distinguían de los amarillos de las carreteras; en la República Federal, en los años setenta, el ultramar oscuro dio paso a un azul más claro, y desde entonces el color oficial es el RAL 5017 Verkehrsblau [4]. Los valores son una lectura del tema.',
        en: 'In 1938 it was decided that the Reich motorways’ signs would be blue, with white letters, which made them stand out from the yellow ones on ordinary roads; in the Federal Republic, in the 1970s, the deep ultramarine gave way to a lighter blue, and the official colour has since been RAL 5017 Verkehrsblau [4]. The values are the theme’s reading.',
      },
    },
    lettering: {
      original: { name: { es: 'DIN 1451 Mittelschrift y Engschrift', en: 'DIN 1451 Mittelschrift and Engschrift' }, designer: 'Ludwig Goller', year: 1931, kind: 'outline' },
      documented: {
        es: 'Fonts In Use describe la Mittelschrift, de ancho medio, y anota que la Engschrift, estrecha, parte del modelo de rotulación de los ferrocarriles prusianos; una revisión de 1980, dibujada por Adolf Gropp, abrió el 6 y el 9 y quitó la cola de la a [1]. La norma se hizo bajo la supervisión de Goller [1], pero ninguna fuente que consultamos dice quién dibujó las letras de 1931.',
        en: 'Fonts In Use describes the medium-width Mittelschrift and notes that the narrow Engschrift starts from the Prussian railways’ lettering model; a 1980 revision drawn by Adolf Gropp opened up the 6 and the 9 and took the tail off the a [1]. The standard was made under Goller’s supervision [1], but no source we consulted says who drew the 1931 letters.',
      },
      substitute: {
        es: 'El tema usa Barlow, una grotesca libre de esquinas apenas redondeadas, para el texto, y Barlow Condensed, su versión estrecha, para los títulos, como la Engschrift. En el cartel de la foto, de 2005, vemos la forma revisada después de 1980, con la a sin cola; Barlow sigue su trazo parejo y sus terminales rectas, y difiere en la a, que lleva cola como la de antes de la revisión, y en letras como la G y la t.',
        en: 'The theme uses Barlow, a free grotesque with barely rounded corners, for text, and its narrow cut, Barlow Condensed, for titles, as with the Engschrift. On the sign in the photo, from 2005, we see the form as revised after 1980, with a tailless a; Barlow follows its even strokes and straight terminals, and differs in the a, which keeps the tail it had before the revision, and in letters such as G and t.',
      },
    },
  },
  fonts: { sans: 'barlow', display: 'barlow-condensed' },
  colors: {
    bg: ['#f4f5f7', '#0b2f55'],
    fg: ['#111418', '#ffffff'],
    fgMuted: ['#4a5059', '#c7d5e6'],
    surface: ['#ffffff', '#0e3a66'],
    surfaceAlt: ['#dfe7f1', '#134a80'],
    border: ['#111418', '#ffffff'],
    primary: ['#0e518d', '#ffffff'],
    primaryFg: 'auto',
    accent: ['#f5c400', '#f5c400'],
    accentFg: 'auto',
    info: ['#0e518d', '#9cc3ee'],
    infoFg: 'auto',
    success: ['#2e7d32', '#7cc98a'],
    successFg: 'auto',
    warning: ['#f5c400', '#f5c400'],
    warningFg: 'auto',
    danger: ['#b3261e', '#ff8a80'],
    dangerFg: 'auto',
    focus: ['#0e518d', '#f5c400'],
  },
  type: { weightBody: 400, weightLabel: 600, weightDisplay: 600, displaySpacing: '0.01em' },
  shape: { borderWidth: 2, radius: 3, radiusControl: 3, radiusButton: 3, radiusSmall: 2 },
  elevation: flat(),
  motion: { duration: 0, durationSlow: 0, ease: 'linear' },
});
