import { defineTheme, hardShadow } from '../../define';
import { grid } from '../../families';

export default defineTheme({
  id: 'nakagin',
  scene: 'japan',
  nativeScheme: 'light',
  name: { es: 'Nakagin', en: 'Nakagin' },
  tagline: { es: 'Cápsulas apiladas, una ventana redonda.', en: 'Stacked capsules, one round window.' },
  reference: {
    title: { es: 'Torre de cápsulas Nakagin', en: 'Nakagin Capsule Tower' },
    original: { text: '中銀カプセルタワービル', lang: 'ja' },
    authors: ['Kisho Kurokawa'],
    date: [1970, 1972],
    place: { es: 'Ginza, Tokio, Japón', en: 'Ginza, Tokyo, Japan' },
    kind: 'architecture',
    sources: [
      { title: 'The Many Lives of the Nakagin Capsule Tower', url: 'https://www.moma.org/calendar/exhibitions/5830', publisher: 'The Museum of Modern Art', year: 2025, accessed: '2026-10-05' },
      { title: 'Demolition of iconic Nakagin Capsule Tower begins in Tokyo', url: 'https://www.dezeen.com/2022/04/12/nakagin-capsule-tower-demolition-begins-tokyo/', publisher: 'Dezeen', year: 2022, accessed: '2026-10-05' },
      { title: 'Nakagin Capsule Tower', url: 'https://en.wikipedia.org/wiki/Nakagin_Capsule_Tower', publisher: 'Wikipedia', accessed: '2026-10-05' },
    ],
    image: {
      file: 'nakagin.avif',
      width: 1600,
      height: 1158,
      alt: {
        es: 'Primer plano de las cápsulas grises apiladas de la torre, cada una con una ventana redonda.',
        en: 'Close-up of the tower’s stacked grey capsules, each with one round window.',
      },
      author: 'Dllu',
      license: 'CC-BY-SA-4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Capsules_of_the_Nakagin_Capsule_Tower_dllu.jpg',
    },
  },
  ficha: {
    documented: {
      es: 'La torre de Kisho Kurokawa en Ginza, construida entre 1970 y 1972, colgaba 140 cápsulas prefabricadas de dos núcleos de hormigón y acero [2][3]. Cada cápsula era una habitación de unos 2,5 × 4 metros con una sola ventana redonda en un extremo [2][3]. El MoMA la presenta como el ejemplo construido clave del Metabolismo, el movimiento japonés de los años sesenta de edificios pensados para transformarse con el tiempo [1]. Se demolió en 2022 porque su estructura se había deteriorado [2]; algunas cápsulas se restauraron y una forma hoy parte de la colección del MoMA [1].',
      en: 'Kisho Kurokawa’s tower in Ginza, built from 1970 to 1972, hung 140 prefabricated capsules on two concrete-and-steel cores [2][3]. Each capsule was a single room of about 2.5 × 4 metres with one round window at its end [2][3]. MoMA presents it as the key built example of Metabolism, the 1960s Japanese movement of buildings meant to change over time [1]. It was demolished in 2022 because its structure had decayed [2]; some capsules were restored, and one is now in MoMA’s collection [1].',
    },
    reading: {
      es: 'El tema lee la torre como un sistema de módulos idénticos: una retícula de 32 px dibujada sobre cada losa, tarjetas cuadradas apiladas con sombra dura y botones redondeados como la única ventana de la cápsula. La paleta es el gris pálido de las cápsulas sobre el hormigón de los núcleos, con el vidrio oscuro de la ventana como color principal. Una gótica japonesa para el texto y la pesada Dela Gothic One para los títulos dan el registro del Tokio de los setenta; ninguna de las dos está documentada en el edificio.',
      en: 'The theme reads the tower as a system of identical modules: a 32 px grid drawn on every slab, square cards stacked with a hard shadow, and buttons rounded like the capsule’s single window. The palette is the pale grey of the capsules on the concrete of the cores, with the window’s dark glass as the primary colour. A Japanese gothic for text and the heavy Dela Gothic One for titles set a 1970s Tokyo register; neither typeface is documented on the building.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'Leída en fotografías: cápsulas gris pálido, núcleos de hormigón, vidrio oscuro. Ninguna fuente documenta los colores.',
        en: 'Read from photographs: pale grey capsules, concrete cores, dark glass. No source documents the colours.',
      },
    },
  },
  fonts: { sans: 'zen-kaku-gothic-new', display: 'dela-gothic-one', mono: 'm-plus-1-code' },
  colors: {
    bg: ['#d9d8d3', '#16181b'],
    fg: ['#17191c', '#ecebe6'],
    fgMuted: ['#4a4d52', '#a9adb3'],
    surface: ['#f3f2ee', '#202327'],
    surfaceAlt: ['#e6e5e0', '#2b2f34'],
    border: ['#17191c', '#ecebe6'],
    primary: ['#20303b', '#c9d6df'],
    primaryFg: 'auto',
    accent: ['#2a6475', '#7fb8c9'],
    accentFg: 'auto',
    info: ['#2a6475', '#7fb8c9'],
    infoFg: 'auto',
    success: ['#2f6b3a', '#7cc48a'],
    successFg: 'auto',
    warning: ['#e0a526', '#e8b84a'],
    warningFg: 'auto',
    danger: ['#b3261e', '#ff8a7a'],
    dangerFg: 'auto',
    focus: ['#2a6475', '#7fb8c9'],
  },
  type: { weightBody: 400, weightLabel: 700, weightDisplay: 400, labelSpacing: '0.02em', displaySpacing: '0em' },
  shape: { borderWidth: 2, radius: 0, radiusControl: 0, radiusButton: 999, radiusSmall: 0 },
  elevation: hardShadow(5),
  families: [grid({ cell: 32, strength: 0.07 })],
});
