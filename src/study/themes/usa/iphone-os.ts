import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'iphone-os',
  scene: 'usa',
  nativeScheme: 'light',
  name: { es: 'iPhone OS 1', en: 'iPhone OS 1' },
  tagline: { es: 'El ilusionismo táctil: cristales virtuales, texturas materiales y la aurora de la era móvil.', en: 'Tactile illusionism: virtual glass, material textures, and the dawn of the mobile era.' },
  reference: {
    title: { es: 'iPhone OS 1', en: 'iPhone OS 1' },
    authors: ['Apple Inc.'],
    date: 2007,
    place: { es: 'Cupertino, Estados Unidos', en: 'Cupertino, United States' },
    kind: 'software',
    sources: [
      {
        title: 'iPhone Human Interface Guidelines for Web Applications',
        url: 'https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/Introduction/Introduction.html',
        publisher: 'Apple Inc.',
        year: 2007,
        accessed: '2026-10-08',
      },
      {
        title: 'iPhone OS 1',
        url: 'https://en.wikipedia.org/wiki/IPhone_OS_1',
        publisher: 'Wikipedia',
        accessed: '2026-10-08',
      }
    ],
  },
  ficha: {
    documented: {
      es: 'El advenimiento del iPhone inauguró una poética del hiperrealismo en la interfaz, donde el cristal pulido, los destellos de luz artificial y las sombras densas creaban un trampantojo digital. Fue un puente cognitivo hacia una nueva forma de interactuar con lo inmaterial [1][2].',
      en: 'The advent of the iPhone inaugurated a poetics of hyperrealism in the interface, where polished glass, artificial light flares, and dense shadows created a digital trompe l\'œil. It was a cognitive bridge to a new way of interacting with the immaterial [1][2].',
    },
    reading: {
      es: 'Esta reinterpretación sublima el efecto de botón de cristal, empleando curvas generosas y reflejos atenuados. Los tonos zafiro y las superficies aterciopeladas evocan la nostalgia de la primera era dorada del diseño móvil.',
      en: 'This reinterpretation sublimates the glass button effect, employing generous curves and attenuated reflections. Sapphire tones and velvety surfaces evoke the nostalgia of the first golden age of mobile design.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'Un diálogo entre tonos zafiro nocturno y pizarras texturizadas, elevando la paleta original a un espectro de elegancia contemporánea.',
        en: 'A dialogue between nocturnal sapphire tones and textured slates, elevating the original palette to a spectrum of contemporary elegance.',
      },
    },
  },
  fonts: 'system-sans',
  colors: {
    bg: ['#eef0f3', '#111214'],
    fg: ['#131518', '#e6e9ed'],
    fgMuted: ['#585e66', '#9aa1ab'],
    surface: ['#ffffff', '#1b1d21'],
    surfaceAlt: ['#e3e6eb', '#25282d'],
    border: ['#767e88', '#686e78'],
    primary: ['#185cb5', '#5b95e6'],
    primaryFg: ['#ffffff', '#09111c'],
    accent: ['#185cb5', '#5b95e6'],
    accentFg: ['#ffffff', '#09111c'],
    info: ['#185cb5', '#5b95e6'],
    infoFg: ['#ffffff', '#09111c'],
    success: ['#23823d', '#55ba6f'],
    successFg: ['#ffffff', '#0a1a0f'],
    warning: ['#d6a000', '#e6b935'],
    warningFg: ['#131518', '#1c1500'],
    danger: ['#bd2f2f', '#e65e5e'],
    dangerFg: ['#ffffff', '#1c0303'],
    focus: ['#185cb5', '#7cb1f5'],
  },
  type: { weightBody: 400, weightLabel: 600, weightDisplay: 700 },
  shape: { borderWidth: 1, radius: 16, radiusControl: 10, radiusButton: 10, radiusSmall: 6 },
  elevation: flat(),
  motion: { duration: 250, durationSlow: 450, ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
  signature: './iphone-os.css',
});
