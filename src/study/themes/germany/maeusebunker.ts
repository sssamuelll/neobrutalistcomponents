import { defineTheme, hardShadow } from '../../define';
import { concrete } from '../../families';

export default defineTheme({
  id: 'maeusebunker',
  scene: 'germany',
  nativeScheme: 'dark',
  name: { es: 'Mäusebunker', en: 'Mäusebunker' },
  tagline: { es: 'Paneles de hormigón, aire azul claro.', en: 'Concrete panels, light-blue air.' },
  reference: {
    title: {
      es: 'Mäusebunker (antiguos laboratorios centrales de animales de la Universidad Libre de Berlín)',
      en: 'Mäusebunker (former Central Animal Laboratories of the Free University of Berlin)',
    },
    original: { text: 'Zentrale Tierlaboratorien der Freien Universität Berlin', lang: 'de' },
    authors: ['Gerd Hänska', 'Magdalena Hänska', 'Kurt Schmersow'],
    date: [1971, 1982],
    place: { es: 'Lichterfelde, Berlín, Alemania', en: 'Lichterfelde, Berlin, Germany' },
    kind: 'architecture',
    sources: [
      { title: 'Bestand', url: 'https://www.modellverfahren-maeusebunker.de/bestand', publisher: 'Modellverfahren Mäusebunker (Landesdenkmalamt Berlin)', accessed: '2026-10-05' },
      {
        title: 'Neu unter Denkmalschutz: „Mäusebunker“ im Rahmen des Modellverfahrens Mäusebunker unter Schutz gestellt',
        url: 'https://www.berlin.de/landesdenkmalamt/aktivitaeten/kurzmeldungen/2023/maeusebunker-unter-denkmalschutz-1328090.php',
        publisher: 'Landesdenkmalamt Berlin',
        year: 2023,
        accessed: '2026-10-05',
      },
      { title: 'Brutalist Mäusebunker building saved from demolition in Berlin', url: 'https://www.dezeen.com/2023/07/18/brutalist-mausebunker-saved-berlin/', publisher: 'Dezeen', year: 2023, accessed: '2026-10-05' },
    ],
    image: {
      file: 'maeusebunker.avif',
      width: 1600,
      height: 1470,
      alt: {
        es: 'La fachada de hormigón del Mäusebunker, con hileras de tubos de ventilación azul claro y ventanas triangulares.',
        en: 'The Mäusebunker’s concrete façade, with rows of light-blue ventilation pipes and triangular windows.',
      },
      author: 'Gunnar Klack',
      license: 'CC-BY-SA-4.0',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:2019-06-16-Zentrale-Tierlaboratorien-Forschungseinrichtung-f-experimentelle-Medizin-Maeusebunker-Krahmerstr-Berlin-Lichterfelde_03.jpg',
    },
  },
  ficha: {
    documented: {
      es: 'Gerd y Magdalena Hänska proyectaron el edificio para criar animales de laboratorio para la Universidad Libre de Berlín; la obra empezó en 1971 y se inauguró en febrero de 1982 [1][2]. Su fachada es de paneles prefabricados de hormigón de una planta de alto, unos con buhardillas triangulares y otros con salidas para tubos de ventilación [1]. Los tubos están pintados de azul claro para señalar la toma de aire fresco; el sitio del proyecto rechaza la lectura popular de un acorazado con cañones [1]. Desde 2023 es monumento protegido [2][3].',
      en: 'Gerd and Magdalena Hänska designed the building to breed laboratory animals for the Free University of Berlin; construction began in 1971 and it opened in February 1982 [1][2]. Its façade is made of storey-high precast concrete panels, some with triangular dormer windows, others with outlets for ventilation pipes [1]. The pipes are painted light blue to mark the fresh-air intake; the project site rejects the popular reading of a battleship with cannons [1]. It has been a listed monument since 2023 [2][3].',
    },
    reading: {
      es: 'El tema está vaciado en ese hormigón: textura de encofrado detrás de la página y de cada losa, bordes de tinta de 3 px y una sombra desplazada de 6 px para la masa del edificio. Las acciones principales toman el azul claro de los tubos, y el acento ocre alude al código de colores del interior que describe el sitio del proyecto [1]. Es oscuro por defecto, leído aquí como el edificio de noche, y sus etiquetas van en una grotesca condensada, en mayúsculas y espaciada como la rotulación técnica: una interpretación.',
      en: 'The theme is cast in that concrete: board-marked texture behind the page and every slab, 3 px ink edges and a heavy 6 px offset shadow for the building’s mass. Primary actions take the pipes’ light blue, and the ochre accent nods to the interior colour code the project site describes [1]. It is dark by default, read here as the building at night, and its labels use a condensed grotesque, uppercase and spaced like technical lettering — an interpretation.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'El azul claro de los tubos y el código de colores interior están documentados con palabras en el sitio del proyecto; los valores hexadecimales son la lectura del tema a partir de fotografías.',
        en: 'The pipes’ light blue and the interior colour code are documented in words by the project site; the hex values are the theme’s reading of photographs.',
      },
    },
  },
  fonts: { sans: 'barlow', display: 'barlow-condensed', mono: 'dm-mono' },
  colors: {
    bg: ['#cfccc5', '#1c1d1e'],
    fg: ['#141516', '#e9e7e2'],
    fgMuted: ['#4b4a47', '#a7a39b'],
    surface: ['#e4e1db', '#27282a'],
    surfaceAlt: ['#d7d4ce', '#323335'],
    border: ['#141516', '#e9e7e2'],
    primary: '#8cc3ea',
    primaryFg: 'auto',
    accent: ['#6e570e', '#d8c06a'],
    accentFg: 'auto',
    info: ['#1a5f9e', '#3d8fd6'],
    infoFg: 'auto',
    success: ['#2d6b3c', '#5fb67a'],
    successFg: 'auto',
    warning: '#e8b545',
    warningFg: 'auto',
    danger: ['#a3271d', '#f07a6a'],
    dangerFg: 'auto',
    focus: ['#1a5f9e', '#8cc3ea'],
  },
  type: {
    weightBody: 400,
    weightLabel: 600,
    weightDisplay: 800,
    labelTransform: 'uppercase',
    labelSpacing: '0.06em',
    displayTransform: 'uppercase',
    displaySpacing: '0.01em',
  },
  shape: { borderWidth: 3, radius: 0, radiusControl: 0, radiusButton: 0, radiusSmall: 0 },
  elevation: hardShadow(6),
  families: [concrete({ grain: 0.07, formwork: 0.05, board: 22 })],
});
