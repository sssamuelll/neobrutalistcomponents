/**
 * Fichas of the five core themes. These themes predate the study: each ficha
 * names the theme's closest documented reference and says so.
 */
import type { NeoBuiltinTheme } from '../lib/themes';
import type { CoreFicha } from './types';

export const CORE_FICHAS: Record<NeoBuiltinTheme, CoreFicha> = {
  classic: {
    scene: 'origins',
    tagline: { es: 'Esta decisión es definitiva.', en: 'This decision is final.' },
    reference: {
      title: { es: 'Unité d’habitation de Marsella', en: 'Unité d’habitation, Marseille' },
      original: { text: 'Unité d’habitation de Marseille (Cité radieuse)', lang: 'fr' },
      authors: ['Le Corbusier'],
      date: [1945, 1952],
      place: { es: 'Marsella, Francia', en: 'Marseille, France' },
      kind: 'architecture',
      sources: [
        {
          title: 'Le Corbusier, Unité d’habitation, Marseille, France, 1945-1952',
          url: 'https://www.fondationlecorbusier.fr/oeuvre-architecture/realisations-unite-dhabitation-marseille-france-1945-1952/',
          publisher: 'Fondation Le Corbusier',
          accessed: '2026-10-05',
        },
        {
          title: 'Du béton brut au brutalisme',
          url: 'https://passerelles.essentiels.bnf.fr/fr/article/471c3dd1-bbab-41dc-ad1f-3a6da99c1a65-beton-brut-brutalisme',
          publisher: 'Bibliothèque nationale de France (Passerelles)',
          accessed: '2026-10-05',
        },
        { title: 'Brutalism', url: 'https://www.tate.org.uk/art/art-terms/b/brutalism', publisher: 'Tate', accessed: '2026-10-05' },
      ],
    },
    ficha: {
      documented: {
        es: 'El bloque de viviendas de Le Corbusier en Marsella, encargado en 1945 e inaugurado en 1952, se levanta sobre pilotis y se hormigonó in situ [1]. En la entrega dijo que había llegado a admirar las huellas que el encofrado dejaba en el hormigón crudo: juntas de tabla, veta, nudos [2]. La palabra brutalismo nace de su expresión béton brut, hormigón crudo [2][3].',
        en: 'Le Corbusier’s housing block in Marseille, commissioned in 1945 and inaugurated in 1952, stands on pilotis and was cast in place in reinforced concrete [1]. At its handover he said he had come to admire the marks the formwork left on the raw concrete: board joints, wood grain, knots [2]. The word brutalism grew out of his term béton brut, raw concrete [2][3].',
      },
      reading: {
        es: 'Este tema es anterior al estudio; el béton brut es su referencia más cercana. La página es gris hormigón, cada superficie es una losa blanca con borde de tinta de 3 px y doble sombra, y el amarillo solar del color principal es del tema, no de Marsella.',
        en: 'This theme predates the study; béton brut is its closest reference. The page is concrete grey, every surface a white slab with a 3 px ink edge and a double shadow, and the sun-yellow primary is the theme’s own, not Marseille’s.',
      },
      palette: {
        origin: 'interpreted',
        note: {
          es: 'El gris hormigón, el blanco y la tinta son una lectura del hormigón crudo; el amarillo y el cobalto son del tema.',
          en: 'Concrete grey, white and ink are a reading of raw concrete; the yellow and cobalt accents are the theme’s own.',
        },
      },
    },
    facets: { border: 'standard', shadow: 'double', corners: 'square' },
    predatesStudy: true,
  },
  swiss: {
    scene: 'origins',
    tagline: { es: 'Precisión, no simpleza.', en: 'Precision, not plainness.' },
    reference: {
      title: { es: 'Neue Grafik (revista)', en: 'Neue Grafik (journal)' },
      original: { text: 'Neue Grafik / New Graphic Design / Graphisme actuel', lang: 'de' },
      authors: ['Josef Müller-Brockmann', 'Richard Paul Lohse', 'Hans Neuburg', 'Carlo Vivarelli'],
      date: [1958, 1965],
      place: { es: 'Suiza', en: 'Switzerland' },
      kind: 'graphic',
      sources: [
        {
          title: 'Neue Grafik/New Graphic Design/Graphisme Actuel 1958–1965',
          url: 'https://www.lars-mueller-publishers.com/neue-grafiknew-graphic-designgraphisme-actuel-1958-1965',
          publisher: 'Lars Müller Publishers',
          year: 2014,
          accessed: '2026-10-05',
        },
        { title: 'Neue Grafik', url: 'https://fontsinuse.com/uses/15395/neue-grafik', publisher: 'Fonts In Use', year: 2017, accessed: '2026-10-05' },
        { title: 'Neue Grafik', url: 'https://en.wikipedia.org/wiki/Neue_Grafik', publisher: 'Wikipedia', accessed: '2026-10-05' },
      ],
    },
    ficha: {
      documented: {
        es: 'Neue Grafik fue una revista trilingüe, en alemán, inglés y francés, editada por Josef Müller-Brockmann, Richard Paul Lohse, Hans Neuburg y Carlo Vivarelli; publicó 18 números entre 1958 y 1965 [1][3]. Lars Müller Publishers, que la reeditó en facsímil en 2014, la presenta como el vehículo con el que el diseño gráfico suizo expuso su programa [1]. La portada solo tipográfica de Vivarelli componía la cabecera y el número en Akzidenz-Grotesk Medium [2].',
        en: 'Neue Grafik was a trilingual journal, in German, English and French, edited by Josef Müller-Brockmann, Richard Paul Lohse, Hans Neuburg and Carlo Vivarelli; it ran to 18 issues between 1958 and 1965 [1][3]. Lars Müller Publishers, which reprinted it in facsimile in 2014, presents it as the vehicle through which Swiss graphic design set out its programme [1]. Vivarelli’s all-type cover set the masthead and issue number in Akzidenz-Grotesk Medium [2].',
      },
      reading: {
        es: 'Este tema es anterior al estudio; Neue Grafik es su referencia más cercana. Tipografía negra sobre blanco, una sola familia grotesca, filetes finos y una retícula estricta dejan que mande el contenido; el rojo oscuro es del tema, porque la revista era en blanco y negro [2].',
        en: 'This theme predates the study; Neue Grafik is its closest reference. Black type on white, one grotesque family, hairline rules and a strict grid let the content lead; the deep red accent is the theme’s own, as the journal was black and white [2].',
      },
      palette: {
        origin: 'interpreted',
        note: {
          es: 'El negro sobre blanco sigue a la revista; el rojo oscuro es del tema.',
          en: 'Black on white follows the journal; the deep red accent is the theme’s own.',
        },
      },
    },
    facets: { border: 'hairline', shadow: 'none', corners: 'square' },
    predatesStudy: true,
  },
  tech: {
    scene: 'usa',
    tagline: { es: 'Sofisticación de terminal.', en: 'Terminal sophistication.' },
    reference: {
      title: { es: 'Terminal de vídeo DEC VT100', en: 'DEC VT100 video terminal' },
      authors: ['Digital Equipment Corporation'],
      date: 1978,
      place: { es: 'Estados Unidos', en: 'United States' },
      kind: 'object',
      sources: [
        { title: 'VT100 terminal', url: 'https://www.computerhistory.org/collections/catalog/102647895', publisher: 'Computer History Museum', accessed: '2026-10-05' },
        { title: 'DEC VT100', url: 'https://www.york.ac.uk/computer-science/about/news/50-years/exhibition/dec-vt100/', publisher: 'University of York, Department of Computer Science', accessed: '2026-10-05' },
        { title: 'Digital VT100 User Guide: Installation, Interface Information and Specifications', url: 'https://vt100.net/docs/vt100-ug/chapter2.html', publisher: 'Digital Equipment Corporation (VT100.net)', accessed: '2026-10-05' },
        { title: 'Digital VT100 User Guide: Operator Information', url: 'https://vt100.net/docs/vt100-ug/chapter1.html', publisher: 'Digital Equipment Corporation (VT100.net)', accessed: '2026-10-05' },
        { title: 'Phosphors', url: 'https://www.rp-photonics.com/phosphors.html', publisher: 'RP Photonics Encyclopedia', accessed: '2026-10-05' },
        { title: 'Digital VT100 User Guide: Programmer Information', url: 'https://vt100.net/docs/vt100-ug/chapter3.html', publisher: 'Digital Equipment Corporation (VT100.net)', accessed: '2026-10-05' },
      ],
      image: {
        file: 'vt100.avif',
        width: 1600,
        height: 1420,
        alt: { es: 'Un terminal VT100, con texto blanco sobre la pantalla oscura.', en: 'A VT100 terminal, with white text on its dark screen.' },
        author: 'Jason Scott',
        license: 'CC-BY-2.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:DEC_VT100_terminal.jpg',
      },
    },
    ficha: {
      documented: {
        es: 'Digital Equipment Corporation presentó el VT100 en 1978 [1][2]. Su pantalla de 12 pulgadas usaba fósforo P4 y mostraba 24 líneas de 80 caracteres: caracteres claros sobre fondo oscuro, o al revés [3][4]. Fue uno de los primeros terminales compatibles con los códigos de escape ANSI, y DEC vendió más de seis millones de terminales de la serie VT, en buena parte gracias a él [2].',
        en: 'Digital Equipment Corporation introduced the VT100 in 1978 [1][2]. Its 12-inch screen used P4 phosphor and showed 24 lines of 80 characters, light characters on a dark background or the reverse [3][4]. It was one of the first terminals to support ANSI escape codes, and DEC sold more than six million VT-series terminals, largely thanks to it [2].',
      },
      reading: {
        es: 'Este tema es anterior al estudio; el VT100 es su referencia más cercana. La tipografía monoespaciada y la retícula fija vienen del terminal, igual que sus atributos de carácter: negrita, subrayado y vídeo inverso, que el tema conserva, y parpadeo, que descarta [6]. El verde fósforo no: el P4 es el fósforo blanco de la televisión en blanco y negro, así que el verde del tema es una interpretación [3][5].',
        en: 'This theme predates the study; the VT100 is its closest reference. Monospace type and a fixed grid come from the terminal, and so do its character attributes: bold, underline and reverse video, which the theme keeps, and blink, which it drops [6]. The phosphor green does not: P4 is the white phosphor of black-and-white television, so the theme’s green is an interpretation [3][5].',
      },
      palette: {
        origin: 'interpreted',
        note: {
          es: 'La pantalla del VT100 era blanca sobre negro; el verde fósforo y el magenta son del tema.',
          en: 'The VT100 screen was white on black; the phosphor green and the magenta are the theme’s own.',
        },
      },
    },
    facets: { border: 'hairline', shadow: 'hard', corners: 'soft' },
    predatesStudy: true,
  },
  y2k: {
    scene: 'japan',
    tagline: { es: 'Energía de carta holográfica.', en: 'Holographic trading-card energy.' },
    reference: {
      title: { es: 'Cartas holográficas del juego de cartas Pokémon', en: 'Holofoil cards of the Pokémon Trading Card Game' },
      original: { text: 'ポケットモンスターカードゲーム', lang: 'ja' },
      authors: ['Creatures Inc.', 'Media Factory'],
      date: 1996,
      place: { es: 'Japón', en: 'Japan' },
      kind: 'object',
      sources: [
        { title: 'History', url: 'https://corporate.pokemon.co.jp/en/aboutus/history/', publisher: 'The Pokémon Company', accessed: '2026-10-05' },
        {
          title: 'CGC Cards Certifies Several Cosmos Holo Test Print Pokémon Cards',
          url: 'https://www.cgcgrading.com/news/articles/cgc-cards-certifies-several-cosmos-holo-test-print-pok-mon-cards-28XHoZDfzI6Mfwm2GXrCQH/',
          publisher: 'CGC',
          year: 2023,
          accessed: '2026-10-05',
        },
      ],
    },
    ficha: {
      documented: {
        es: 'El juego de cartas Pokémon salió en Japón en octubre de 1996, desarrollado por Creatures Inc. [1]. Media Factory, su editorial japonesa, marcó las cartas más raras con un fondo holográfico; la primera serie japonesa usó un patrón de lámina conocido como Cosmos [2].',
        en: 'The Pokémon Trading Card Game launched in Japan in October 1996, developed by Creatures Inc. [1]. Media Factory, its Japanese publisher, marked the rarest cards with a holofoil background; the first Japanese set used a foil pattern known as Cosmos [2].',
      },
      reading: {
        es: 'Este tema es anterior al estudio y es el menos brutalista de los cinco; se queda por continuidad. Sus degradados holográficos, sus colores pastel de caramelo y su tipografía de píxel toman el brillo de las cartas raras y de las pantallas de finales de los noventa, sin perder los bordes duros del contrato.',
        en: 'This theme predates the study and is the least brutalist of the five; it stays for continuity. Its holographic gradients, pastel candy colours and pixel display type borrow the shimmer of rare cards and late-1990s screens, while keeping the contract’s hard edges.',
      },
      palette: {
        origin: 'interpreted',
        note: {
          es: 'Una lectura iridiscente de la lámina holográfica; ninguna fuente documenta sus colores.',
          en: 'An iridescent reading of holofoil; no source documents its colours.',
        },
      },
    },
    facets: { border: 'standard', shadow: 'double', corners: 'round' },
    predatesStudy: true,
  },
  riso: {
    scene: 'japan',
    tagline: { es: 'Dos tintas, un poco desplazadas.', en: 'Two inks, slightly off.' },
    reference: {
      title: { es: 'El risógrafo (RISOGRAPH)', en: 'The Risograph (RISOGRAPH)' },
      authors: ['Riso Kagaku Corporation', 'Noboru Hayama'],
      date: 1980,
      place: { es: 'Tokio, Japón', en: 'Tokyo, Japan' },
      kind: 'object',
      sources: [
        { title: 'RISO’s History 1975 - 1988', url: 'https://www.riso.co.jp/english/company/history/s50.html', publisher: 'RISO KAGAKU CORPORATION', accessed: '2026-10-05' },
        { title: 'RISO’s History', url: 'https://www.riso.co.jp/english/company/history/index.html', publisher: 'RISO KAGAKU CORPORATION', accessed: '2026-10-05' },
        { title: 'RISO Consumables: Digital Duplicator', url: 'https://www.riso.co.jp/english/product/digital_dup/consumables/index.html', publisher: 'RISO KAGAKU CORPORATION', accessed: '2026-10-05' },
        { title: 'Riso Printing', url: 'https://gradlab.mica.edu/RisoPrinting', publisher: 'MICA GradLab (Maryland Institute College of Art)', accessed: '2026-10-05' },
      ],
      image: {
        file: 'riso.avif',
        width: 1500,
        height: 1000,
        alt: {
          es: 'Una impresión en risografía a dos tintas, rosa rojizo y negro, sostenida ante la cámara.',
          en: 'A two-colour risograph print, pinkish red and black, held up to the camera.',
        },
        author: 'Mario Felipe',
        license: 'CC-BY-2.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Impress%C3%A3o_em_risografia_em_dua_cores,_2014.jpg',
      },
    },
    ficha: {
      documented: {
        es: 'Noboru Hayama fundó RISO en Tokio en 1946 como servicio de impresión con mimeógrafo [2]. La marca RISOGRAPH llegó en junio de 1980, y el RISOGRAPH 007, un duplicador totalmente automático, en 1984 [1]. RISO vende tintas vegetales en 21 colores estándar y 50 a medida [3]; son semitransparentes, así que los colores que se superponen se mezclan [4].',
        en: 'Noboru Hayama founded RISO in Tokyo in 1946 as a mimeograph printing service [2]. The RISOGRAPH brand followed in June 1980, and the fully automatic RISOGRAPH 007 duplicator in 1984 [1]. RISO sells vegetable-based inks in 21 standard and 50 custom colours [3]; they are semi-transparent, so overlapping colours mix [4].',
      },
      reading: {
        es: 'Este tema es anterior al estudio; el risógrafo es su referencia más cercana. Imprime en dos tintas planas ligeramente desregistradas, sobre papel cálido sin estucar y con grano. El rosa y el azul siguen las aproximaciones hexadecimales que los talleres publican para las tintas RISO [4].',
        en: 'This theme predates the study; the Risograph is its closest reference. It prints in two spot inks set slightly out of register, on warm uncoated paper with a grain. The pink and the blue follow the hex approximations print labs publish for RISO inks [4].',
      },
      palette: {
        origin: 'documented',
        note: {
          es: 'Fluorescent Pink #FF48B0 y Blue #0078BF son aproximaciones de taller de las tintas RISO, no valores que publique RISO.',
          en: 'Fluorescent Pink #FF48B0 and Blue #0078BF are print-lab approximations of RISO inks, not values RISO publishes.',
        },
      },
    },
    facets: { border: 'standard', shadow: 'double', corners: 'soft' },
    predatesStudy: true,
  },
};
