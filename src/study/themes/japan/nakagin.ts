import { defineTheme, hardShadow } from '../../define';
import { grid } from '../../families';

export default defineTheme({
  id: 'nakagin',
  scene: 'japan',
  nativeScheme: 'light',
  name: { es: 'Nakagin', en: 'Nakagin' },
  tagline: { es: 'La utopía efímera del metabolismo: células estandarizadas en un organismo arquitectónico perpetuo.', en: 'The ephemeral utopia of metabolism: standardized cells within a perpetual architectural organism.' },
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
      es: 'Erguida en Ginza por Kisho Kurokawa (1970-1972), esta estructura fue el manifiesto construido del Metabolismo, una visión arquitectónica donde el edificio crece y se adapta como un ente biológico [1][2]. Sus 140 cápsulas habitables, suspendidas asimétricamente de dos núcleos maestros, encapsularon la promesa del crecimiento orgánico urbano. Aunque finalmente sucumbió a la demolición en 2022, su silueta con ese singular ojo de buey redondo permanece como una reliquia melancólica del futuro pasado [1][2][3].',
      en: 'Erected in Ginza by Kisho Kurokawa (1970–1972), this structure was the built manifesto of Metabolism, an architectural vision where the building grows and adapts like a biological entity [1][2]. Its 140 habitable capsules, suspended asymmetrically from two master cores, encapsulated the promise of organic urban growth. Although it ultimately succumbed to demolition in 2022, its silhouette with that singular round porthole remains a melancholic relic of a past future [1][2][3].',
    },
    reading: {
      es: 'Una transcripción de la modulación celular en el paisaje digital. El sistema emplea tarjetas como unidades habitacionales autónomas, rigurosamente dispuestas sobre una retícula visible. El gris lavado del hormigón patinado domina el lienzo, con acentos sombríos que evocan la profundidad del vidrio ahumado de las cápsulas en un entorno sereno y analítico.',
      en: 'A transcription of cellular modulation into the digital landscape. The system employs cards as autonomous living units, rigorously arranged upon a visible grid. The washed grey of weathered concrete dominates the canvas, with somber accents evoking the depth of the capsules\' smoked glass in a serene, analytical environment.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'Monocromía brutalista: el gris crudo del hormigón a la intemperie dialoga con el cerúleo apagado y profundos tonos de asfalto.',
        en: 'Brutalist monochrome: the raw grey of weathered concrete converses with muted cerulean and deep asphalt tones.',
      },
    },
  },
  fonts: { sans: 'zen-kaku-gothic-new', display: 'dela-gothic-one', mono: 'm-plus-1-code' },
  colors: {
    bg: ['#dedcd7', '#151618'],
    fg: ['#1c1d1f', '#e6e5e1'],
    fgMuted: ['#46494f', '#a1a4a8'],
    surface: ['#f0efe9', '#1d1e21'],
    surfaceAlt: ['#e6e4de', '#27292c'],
    border: ['#212326', '#dbdad5'],
    primary: ['#283b4a', '#a5bccf'],
    primaryFg: ['#ffffff', '#0f1418'],
    accent: ['#306575', '#7cb1c2'],
    accentFg: ['#ffffff', '#0a1317'],
    info: ['#306575', '#7cb1c2'],
    infoFg: ['#ffffff', '#0a1317'],
    success: ['#387343', '#7bc288'],
    successFg: ['#ffffff', '#0a150e'],
    warning: ['#ba8818', '#e8b846'],
    warningFg: ['#17191c', '#1a1202'],
    danger: ['#a62720', '#f58076'],
    dangerFg: ['#ffffff', '#1f0402'],
    focus: ['#306575', '#7cb1c2'],
  },
  type: { weightBody: 400, weightLabel: 600, weightDisplay: 400, labelSpacing: '0.02em', displaySpacing: '0em' },
  shape: { borderWidth: 2, radius: 0, radiusControl: 0, radiusButton: 999, radiusSmall: 0 },
  elevation: hardShadow(5),
  families: [grid({ cell: 32, strength: 0.07 })],
});
