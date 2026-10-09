import { defineTheme, hardShadow } from '../../define';
import { concrete } from '../../families';

export default defineTheme({
  id: 'maeusebunker',
  scene: 'germany',
  nativeScheme: 'dark',
  name: { es: 'Mäusebunker', en: 'Mäusebunker' },
  tagline: { es: 'Una monumentalidad acorazada: hormigón expuesto y la presencia imponente del brutalismo científico.', en: 'An armored monumentality: exposed concrete and the imposing presence of scientific brutalism.' },
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
      es: 'Proyectada por Gerd y Magdalena Hänska (1971-1982), esta cruda fortaleza de los antiguos laboratorios de animales de la Universidad Libre de Berlín es uno de los iconos más formidables del Brutalismo europeo [1]. Sus amenazantes volúmenes escalonados y buhardillas triangulares, flanqueados por tubos de ventilación azul pálido, le valieron el apodo del "acorazado" [1]. Hoy protegida como monumento, la estructura es un testimonio perdurable de la estética hiperfuncionalista e intimidante de la era de la Guerra Fría [2][3].',
      en: 'Designed by Gerd and Magdalena Hänska (1971–1982), this raw fortress of the former animal laboratories at the Free University of Berlin is one of the most formidable icons of European Brutalism [1]. Its looming staggered volumes and triangular dormers, flanked by pale blue ventilation pipes, earned it the moniker of the "battleship" [1]. Now protected as a listed monument, the structure stands as an enduring testament to the hyper-functionalist, intimidating aesthetic of the Cold War era [2][3].',
    },
    reading: {
      es: 'Un homenaje al peso tectónico del hormigón marcado por encofrado. La interfaz adquiere una densidad arquitectónica mediante sombras de contorno grueso y aristas pronunciadas. La paleta es oscura e industrial, perforada únicamente por destellos del icónico azul cerúleo de la ventilación del edificio, destilando una presencia misteriosa y monumental.',
      en: 'An homage to the tectonic weight of board-marked concrete. The interface acquires an architectural density through heavy offset shadows and sharp edges. The palette is dark and industrial, punctured only by flashes of the building\'s iconic cerulean ventilation blue, distilling a mysterious, monumental presence.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'Hormigón oxidado y penumbra, contrastado con el azul gélido de los ductos técnicos y tenues amarillos industriales.',
        en: 'Oxidized concrete and penumbra, contrasted against the glacial blue of technical ducts and faint industrial yellows.',
      },
    },
  },
  fonts: { sans: 'barlow', display: 'barlow-condensed', mono: 'dm-mono' },
  colors: {
    bg: ['#d1cec7', '#17181a'],
    fg: ['#151618', '#e3e1db'],
    fgMuted: ['#42413e', '#a19e96'],
    surface: ['#e3e1da', '#212224'],
    surfaceAlt: ['#d1cec7', '#2e2f31'],
    border: ['#1a1b1c', '#cfcdc7'],
    primary: ['#2d7ab3', '#6faddb'],
    primaryFg: ['#ffffff', '#081724'],
    accent: ['#786018', '#ccb05c'],
    accentFg: ['#ffffff', '#1c1503'],
    info: ['#20629e', '#599cd9'],
    infoFg: ['#ffffff', '#051321'],
    success: ['#286b3a', '#61b87a'],
    successFg: ['#ffffff', '#031408'],
    warning: ['#bd8c1b', '#e6b94e'],
    warningFg: ['#151618', '#1a1100'],
    danger: ['#a62116', '#f2786d'],
    dangerFg: ['#ffffff', '#240402'],
    focus: ['#1a4c7a', '#6faddb'],
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
  shape: { borderWidth: 2, radius: 0, radiusControl: 0, radiusButton: 0, radiusSmall: 0 },
  elevation: hardShadow(6),
  families: [concrete({ grain: 0.07, formwork: 0.05, board: 22 })],
});
