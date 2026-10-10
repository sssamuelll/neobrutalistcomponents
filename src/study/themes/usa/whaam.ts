import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'whaam',
  scene: 'usa',
  nativeScheme: 'light',
  name: { es: 'Whaam!', en: 'Whaam!' },
  tagline: { es: 'Puntos Ben-Day, línea negra, color plano.', en: 'Ben-Day dots, black line, flat colour.' },
  reference: {
    title: { es: 'Whaam!', en: 'Whaam!' },
    authors: ['Roy Lichtenstein'],
    date: 1963,
    place: { es: 'Nueva York, Estados Unidos', en: 'New York, United States' },
    kind: 'graphic',
    sources: [
      {
        title: 'Wow!',
        url: 'https://www.tate.org.uk/tate-etc/issue-27-spring-2013/wow',
        publisher: 'Tate Etc.',
        year: 2013,
        accessed: '2026-10-09',
      },
      {
        title: 'Roy Lichtenstein, Whaam!, 1963',
        url: 'https://www.tate.org.uk/art/artworks/lichtenstein-whaam-t00897',
        publisher: 'Tate',
        accessed: '2026-10-09',
      },
      { title: 'Whaam!', url: 'https://en.wikipedia.org/wiki/Whaam!', publisher: 'Wikipedia', accessed: '2026-10-09' },
    ],
  },
  ficha: {
    documented: {
      es: 'Roy Lichtenstein pintó Whaam! en 1963 a partir de una viñeta de All-American Men of War n.º 89, un cómic de DC de 1962 dibujado por Russ Heath e Irv Novick [1]. Combinó campos de color plano con puntos Ben-Day, que aplicó con un cepillo y una plantilla metálica hecha a mano, y trazó los contornos con una línea negra firme [1]. Lo pintó en óleo y Magna sobre un dibujo a lápiz en la tela [1]. Es un díptico; se expuso en la galería de Leo Castelli en Nueva York en 1963 y la Tate lo compró en 1966 [2][3].',
      en: 'Roy Lichtenstein painted Whaam! in 1963 from a panel in All-American Men of War #89, a 1962 DC comic drawn by Russ Heath and Irv Novick [1]. He combined fields of flat colour with Ben-Day dots, applied with a scrub brush and a handmade metal screen, and drew the outlines in a hard black line [1]. He painted it in oil and Magna over a pencil drawing on the canvas [1]. It is a diptych; it was shown at Leo Castelli’s gallery in New York in 1963, and Tate bought it in 1966 [2][3].',
    },
    reading: {
      es: 'El tema monta la interfaz como una viñeta: bordes negros de 4 px, nada de sombras ni degradados, y una trama de puntos sobre el fondo. El amarillo del globo de texto es el fondo; un azul y un rojo de cómic impreso son el color principal y el acento. Las etiquetas van en mayúsculas, como el rótulo de la viñeta.',
      en: 'The theme sets the interface up as a comic panel: 4 px black borders, no shadows or gradients, and a dot screen over the background. The yellow of the speech balloon is the background; a printed-comic blue and red are the primary and the accent. Labels are set in capitals, like the panel’s lettering.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'Las fuentes describen campos de color plano y un globo amarillo, sin valores. Los tonos son una lectura; la obra sigue bajo derechos y la ficha enlaza la página de la Tate en lugar de una imagen.',
        en: 'The sources describe flat colour fields and a yellow balloon, with no values. The tones are a reading; the work is still under copyright, so the ficha links Tate’s page instead of an image.',
      },
    },
    lettering: {
      original: { name: { es: 'Rótulos de cómic repintados: el cartucho y WHAAM!', en: 'Repainted comic lettering: the caption and WHAAM!' }, designer: 'Roy Lichtenstein', year: 1963, kind: 'lettered' },
      documented: {
        es: 'El dibujo preparatorio muestra que Lichtenstein cambió el original, también su texto [1]. En el cuadro, la onomatopeya WHAAM! se funde con la imagen a lo largo de una línea en zigzag y suena como una voz de fuera de cuadro que contesta al globo amarillo [1].',
        en: 'The preparatory drawing shows that Lichtenstein changed the original, its text included [1]. In the painting, the onomatopoeia WHAAM! merges with the image along a zigzag line and sounds like a voice from outside the frame answering the yellow balloon [1].',
      },
      substitute: {
        es: 'El tema usa Bangers para los títulos y Comic Neue para el texto, dos fuentes libres de rotulación de cómic. En las mayúsculas apretadas de Bangers vemos las de la onomatopeya, y en Comic Neue, la letra de los cartuchos; ninguna copia las letras que pintó Lichtenstein.',
        en: 'The theme uses Bangers for titles and Comic Neue for text, two free comic-lettering faces. In Bangers’s tight capitals we see the onomatopoeia’s, and in Comic Neue, the hand of the captions; neither copies the letters Lichtenstein painted.',
      },
    },
  },
  fonts: { sans: 'comic-neue', display: 'bangers' },
  colors: {
    bg: ['#faef32', '#1a0b1c'],
    fg: ['#0d0d0d', '#f2f2f2'],
    fgMuted: ['#383838', '#cfcfcf'],
    surface: ['#fcfcfc', '#141414'],
    surfaceAlt: ['#e3e3e3', '#2b2b2b'],
    border: ['#0a0a0a', '#f5f5f5'],
    primary: ['#1b5fbf', '#6aa6f2'],
    primaryFg: ['#ffffff', '#0d0d0d'],
    accent: ['#d62424', '#f04343'],
    accentFg: ['#ffffff', '#0a0a0a'],
    info: ['#1b5fbf', '#6aa6f2'],
    infoFg: ['#ffffff', '#0d0d0d'],
    success: ['#35b54a', '#4bdb63'],
    successFg: ['#0a0a0a', '#0d0d0d'],
    warning: ['#eab510', '#fce230'],
    warningFg: ['#0a0a0a', '#0a0a0a'],
    danger: ['#b81c1c', '#f04343'],
    dangerFg: ['#ffffff', '#0a0a0a'],
    focus: ['#0a0a0a', '#6aa6f2'],
  },
  type: { weightBody: 400, weightLabel: 700, weightDisplay: 400, labelTransform: 'uppercase', displaySpacing: '0.01em' },
  shape: { borderWidth: 4, radius: 0, radiusControl: 0, radiusButton: 0, radiusSmall: 0 },
  elevation: flat(),
  motion: { duration: 0, durationSlow: 0, ease: 'linear' },
  signature: './whaam.css',
});
