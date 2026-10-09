import { defineTheme, flat } from '../../define';
import { grid } from '../../families';

export default defineTheme({
  id: 'bauhaus-dessau',
  scene: 'germany',
  nativeScheme: 'light',
  name: { es: 'Bauhaus Dessau', en: 'Bauhaus Dessau' },
  tagline: { es: 'Vidrio en retícula, rojo donde se abre.', en: 'Glass in a grid, red where it opens.' },
  reference: {
    title: { es: 'Edificio de la Bauhaus en Dessau', en: 'Bauhaus Building, Dessau' },
    original: { text: 'Bauhausgebäude Dessau', lang: 'de' },
    authors: ['Walter Gropius'],
    date: [1925, 1926],
    place: { es: 'Dessau, Alemania', en: 'Dessau, Germany' },
    kind: 'architecture',
    sources: [
      {
        title: 'Bauhaus Building',
        url: 'https://bauhaus-dessau.de/en/venues/bauhaus-building/',
        publisher: 'Stiftung Bauhaus Dessau',
        accessed: '2026-10-09',
      },
      {
        title: 'Colour Plan of the Bauhaus, Dessau',
        url: 'https://bauhauskooperation.de/en/knowledge/the-bauhaus/works/mural-painting/colour-plan-of-the-bauhaus-dessau',
        publisher: 'Bauhaus Kooperation Berlin Dessau Weimar',
        accessed: '2026-10-09',
      },
      {
        title: 'Walter Gropius, Dessau Bauhaus, view from the southwest, built 1926',
        url: 'https://germanhistorydocs.org/en/weimar-germany-1918-1933/walter-gropius-dessau-bauhaus-view-from-the-southwest-built-1926',
        publisher: 'German History in Documents and Images',
        accessed: '2026-10-09',
      },
      { title: 'Bauhaus Dessau', url: 'https://en.wikipedia.org/wiki/Bauhaus_Dessau', publisher: 'Wikipedia', accessed: '2026-10-09' },
      { title: 'Dessau 1989/90', url: 'https://www.daidalos.org/en/articles/dessau-en/', publisher: 'Daidalos', year: 2025, accessed: '2026-10-09' },
      { title: 'Vertikaler Schriftzug am Bauhaus Dessau wird restauriert', url: 'https://www.monopol-magazin.de/vertikaler-schriftzug-am-bauhaus-dessau-wird-restauriert', publisher: 'Monopol (dpa)', year: 2021, accessed: '2026-10-09' },
      { title: 'Dessau: Bauhaus-Schriftzug ist zurück', url: 'https://www.radiosaw.de/artikel/dessau-bauhaus-schriftzug-ist-zurueck', publisher: 'radio SAW', year: 2024, accessed: '2026-10-09' },
    ],
    image: {
      file: 'bauhaus-dessau.avif',
      width: 1600,
      height: 878,
      alt: {
        es: 'La pared cortina del ala de talleres: una retícula de vidrio y marcos oscuros sobre una franja blanca y la planta baja.',
        en: 'The workshop wing’s curtain wall: a grid of glass and dark frames above a white band and the ground floor.',
      },
      author: 'Gunnar Klack',
      license: 'CC-BY-SA-4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:2020-09-18-Dessau-Bauhaus-Fassade.jpg',
    },
  },
  ficha: {
    documented: {
      es: 'La oficina de Walter Gropius proyectó el edificio, que se construyó entre 1925 y 1926 y se inauguró en diciembre de 1926 [1]. El ala de talleres da a la calle con una pared cortina de vidrio en marco de acero que recorre sus tres pisos sin cortes, porque los pilares quedan detrás [1][4]; junto a ella va el rótulo BAUHAUS [3]. El plan de color exterior de Hinnerk Scheper, de 1926, marcaba en rojo puertas, ventanas y balcones, y unía las partes con una franja gris [2]. La pared de vidrio se perdió casi entera en 1945 y se reconstruyó en aluminio en 1976 [1].',
      en: 'Walter Gropius’s office planned the building, built from 1925 to 1926 and opened in December 1926 [1]. The workshop wing faces the street with a glass curtain wall in a steel frame that runs unbroken across its three floors, because the columns stand behind it [1][4]; the BAUHAUS lettering sits beside it [3]. Hinnerk Scheper’s exterior colour plan of 1926 marked doors, windows and balconies in red, and tied the parts together with a grey band [2]. The glass wall was largely lost in 1945 and rebuilt in aluminium in 1976 [1].',
    },
    reading: {
      es: 'El tema lee la pared cortina como una retícula de 24 px sobre cada superficie, y lo deja todo plano, sin sombra, como el revoque. De Scheper toma la regla del rojo: aquí marca lo que se puede pulsar, igual que en la fachada marcaba lo que se abre. El gris de la franja va en los acentos y el oscuro de los marcos en los bordes. El texto va en Jost, una sans geométrica; el tema no intenta copiar el rótulo.',
      en: 'The theme reads the curtain wall as a 24 px grid on every surface, and keeps everything flat, without shadow, like the render. From Scheper it takes the rule of red: here it marks what can be pressed, as on the façade it marked what opens. The grey of the band goes to the accents and the dark of the frames to the borders. Text is set in Jost, a geometric sans; the theme does not try to copy the sign.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'El plan de Scheper nombra el rojo de las aberturas y la franja gris, pero ninguna fuente da sus valores; los tonos son una lectura.',
        en: 'Scheper’s plan names the red of the openings and the grey band, but no source gives their values; the tones are a reading.',
      },
    },
    lettering: {
      original: { name: 'BAUHAUS', designer: 'Herbert Bayer', kind: 'lettered' },
      documented: {
        es: 'Las letras verticales BAUHAUS del edificio las diseñó Herbert Bayer, en mayúsculas de su alfabeto Universal, pariente de la grotesca; con ellas rompió la costumbre de la escuela de usar solo minúsculas [5][6]. Van sujetas a varillas finas, de modo que parecen flotar delante del muro [5]. El original se perdió: Daidalos dice que se retiró en 1933 [5] y una portavoz de la fundación, que desapareció en la Segunda Guerra Mundial [6]. Las actuales son una réplica colocada hacia 1976 [6]; se descolgaron en 2021 y volvieron a su sitio el 16 de mayo de 2024 [7].',
        en: 'Herbert Bayer designed the building’s vertical BAUHAUS letters, in capitals of his Universal alphabet, a relative of the grotesque; with them he broke the school’s habit of using only lower case [5][6]. They are fixed on thin rods, so they seem to hover in front of the wall [5]. The original was lost: Daidalos says it was removed in 1933 [5], and a foundation spokeswoman, that it disappeared in the Second World War [6]. The present letters are a replica put up around 1976 [6]; they were taken down in 2021 and returned on 16 May 2024 [7].',
      },
      substitute: {
        es: 'El tema usa Jost, una sans geométrica libre, para el texto y los títulos, y pone los títulos en mayúsculas, como el letrero. En sus capitales de círculo y recta vemos la construcción de la Universal, aunque Jost no copia las letras de Bayer.',
        en: 'The theme uses Jost, a free geometric sans, for text and titles, and sets titles in capitals, like the sign. In its capitals of circle and straight line we see the construction of the Universal, though Jost does not copy Bayer’s letters.',
      },
    },
  },
  fonts: { sans: 'jost' },
  colors: {
    bg: ['#f8f6f3', '#161616'],
    fg: ['#141414', '#e6e3dd'],
    fgMuted: ['#666666', '#a3a3a3'],
    surface: ['#fcfdfd', '#1f1f1f'],
    surfaceAlt: ['#edeae1', '#2c2c2c'],
    border: ['#1c1c1c', '#e0ddcd'],
    primary: ['#b3261e', '#e5574f'],
    primaryFg: ['#fcfdfd', '#0d0d0d'],
    accent: ['#5f5f5a', '#a8a8a2'],
    accentFg: ['#fcfdfd', '#0d0d0d'],
    info: ['#1a4b82', '#4b8ad6'],
    infoFg: ['#fcfdfd', '#0d0d0d'],
    success: ['#1c1c1c', '#e6e3dd'],
    successFg: ['#f8f6f3', '#141414'],
    warning: ['#d19b00', '#f2c638'],
    warningFg: ['#141414', '#141414'],
    danger: ['#ba1c20', '#f47a7c'],
    dangerFg: ['#fcfdfd', '#0d0d0d'],
    focus: ['#b3261e', '#f47a7c'],
  },
  type: { weightBody: 500, weightLabel: 700, weightDisplay: 900, displayTransform: 'uppercase', displaySpacing: '0.02em' },
  shape: { borderWidth: 2, radius: 0, radiusControl: 0, radiusButton: 0, radiusSmall: 0 },
  elevation: flat(),
  motion: { duration: 0, durationSlow: 0, ease: 'linear' },
  families: [grid({ cell: 24, strength: 0.07 })],
});
