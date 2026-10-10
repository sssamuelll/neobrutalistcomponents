/**
 * Every string of the site's chrome and study pages, in both languages. No
 * i18n library: plain records of { es, en }, checked by i18n.test.ts. Essays
 * and fichas carry their own bilingual text.
 */
import { createContext, use } from 'react';
import type { BorderFacet, CornerFacet, L10n, Lang, PaletteOrigin, ReferenceKind, Scene, ShadowKind } from '../study/types';

export const UI = {
  // Shell
  skip: { es: 'Saltar al contenido', en: 'Skip to content' },
  brandHome: { es: 'neobrutalistcomponents, inicio', en: 'neobrutalistcomponents home' },
  navPrimary: { es: 'Principal', en: 'Primary' },
  navStudy: { es: 'Galería', en: 'Gallery' },
  navScenes: { es: 'Salas', en: 'Rooms' },
  navAtlas: { es: 'Archivo', en: 'Archive' },
  navLibrary: { es: 'Librería', en: 'Library' },
  navComponents: { es: 'Componentes', en: 'Components' },
  /** Link text of the language switch: the other language's own name. */
  switchLanguage: { es: 'English', en: 'Español' },
  footerNav: { es: 'Pie de página', en: 'Footer' },
  footerNote: {
    es: 'Licencia MIT. Hecho con sus propios componentes: cambia el tema arriba y esta página cambia con él.',
    en: 'MIT licensed. Built with its own components — switch the theme above and this page changes with it.',
  },
  footerCredits: { es: 'Créditos', en: 'Credits' },
  docsInEnglish: {
    es: 'La documentación técnica de la librería está en inglés.',
    en: 'The technical documentation is in English.',
  },
  loading: { es: 'Cargando…', en: 'Loading…' },

  // Theme switcher
  themeGroup: { es: 'Tema', en: 'Theme' },
  colorScheme: { es: 'Esquema de color', en: 'Color scheme' },
  modeNative: { es: 'Por defecto del tema', en: 'Theme default' },
  modeLight: { es: 'Claro', en: 'Light' },
  modeDark: { es: 'Oscuro', en: 'Dark' },
  modeSystem: { es: 'Sistema', en: 'System' },
  moreThemes: { es: 'Más temas', en: 'More themes' },

  // Page titles
  titleStudy: { es: 'La Galería', en: 'The Gallery' },
  titleScenes: { es: 'Salas', en: 'Rooms' },
  titleAtlas: { es: 'Archivo', en: 'Archive' },
  titleOrigins: { es: 'Orígenes', en: 'Origins' },
  titleMethod: { es: 'Método', en: 'Method' },
  titleCredits: { es: 'Créditos', en: 'Credits' },
  titleLibrary: { es: 'Librería', en: 'Library' },
  titleComponents: { es: 'Componentes', en: 'Components' },
  titleBlocks: { es: 'Bloques', en: 'Blocks' },
  titleStart: { es: 'Primeros pasos', en: 'Get started' },
  titleAgents: { es: 'Para agentes', en: 'For agents' },
  titleNotFound: { es: 'No encontrado', en: 'Not found' },

  // Study home
  studyTitle: { es: 'La Galería de las Interfaces', en: 'The UI Gallery' },
  studyLead: {
    es: 'Un museo de la historia gráfica del software, con el neobrutalismo como sala principal. Cada obra es un tema vivo: los mismos componentes, pintados con el lenguaje de su época.',
    en: 'A museum of the graphic history of software, with neobrutalism as its main room. Every work is a living theme: the same components, painted in the language of their era.',
  },
  scenesHeading: { es: 'Salas', en: 'Rooms' },
  openAtlas: { es: 'Abrir el atlas', en: 'Open the atlas' },
  readMethod: { es: 'Cómo se hace un tema', en: 'How a theme is made' },
  mosaicLabel: { es: 'Los temas del estudio', en: 'The themes of the study' },
  loadError: {
    es: 'No se pudo cargar este contenido. Recarga la página para intentarlo de nuevo.',
    en: 'This content could not load. Reload the page to try again.',
  },
  useHeading: { es: 'Usarlos en tu app', en: 'Use them in your app' },
  useBody: {
    es: 'Un tema del estudio es un tema más de la librería: importa su hoja de estilos y pasa su id a NeoProvider. Instala la versión 1.3.0 o posterior para tener todos los temas del estudio.',
    en: 'A study theme is one more library theme: import its stylesheet and pass its id to NeoProvider. Install version 1.3.0 or later to have every study theme.',
  },

  // Gallery (home)
  galleryKicker: { es: 'Exposición permanente', en: 'Permanent exhibition' },
  galleryVisit: { es: 'Recorrer la colección', en: 'Walk the collection' },
  galleryWall: { es: 'El muro de la colección', en: 'The collection wall' },
  galleryGoTo: { es: 'Ir a la obra', en: 'Go to the work' },
  collectionHeading: { es: 'La colección', en: 'The collection' },
  collectionLead: {
    es: 'En orden cronológico. Todas las obras están hechas con los mismos componentes y la misma geometría; lo único que cambia es la época.',
    en: 'In chronological order. Every work is built from the same components and the same geometry; the only thing that changes is the era.',
  },
  chronology: { es: 'Cronología', en: 'Chronology' },
  workNo: { es: 'Obra', en: 'Work' },
  mediumLabel: { es: 'Técnica', en: 'Medium' },
  mediumValue: { es: 'Componentes React sobre propiedades de CSS', en: 'React components on CSS custom properties' },
  roomLabel: { es: 'Sala', en: 'Room' },
  fullRecord: { es: 'Ver la ficha completa', en: 'See the full record' },
  pieceLabel: { es: 'Pieza interactiva', en: 'Interactive piece' },
  mainRoom: { es: 'Sala principal: el neobrutalismo', en: 'Main room: neobrutalism' },

  // The interactive piece every work is painted on
  pieceWindow: { es: 'Ajustes de la cuenta', en: 'Account settings' },
  pieceTabs: { es: 'Secciones', en: 'Sections' },
  pieceProfile: { es: 'Perfil', en: 'Profile' },
  pieceAlerts: { es: 'Avisos', en: 'Alerts' },
  pieceName: { es: 'Nombre', en: 'Name' },
  pieceOffline: { es: 'Trabajar sin conexión', en: 'Work offline' },
  pieceRemember: { es: 'Recordar este equipo', en: 'Remember this computer' },
  pieceSync: { es: 'Sincronizando', en: 'Syncing' },
  pieceSaved: { es: 'Copia guardada', en: 'Backup saved' },
  pieceSavedBody: { es: 'Tus cambios están a salvo.', en: 'Your changes are safe.' },
  pieceNew: { es: 'Nuevo', en: 'New' },
  pieceCancel: { es: 'Cancelar', en: 'Cancel' },
  pieceSave: { es: 'Guardar', en: 'Save' },

  // Scenes and scene pages
  scenesLead: {
    es: 'Lecturas regionales de una misma idea, y el lugar donde empezó.',
    en: 'Regional readings of one idea, and the place where it began.',
  },
  mapCaption: { es: 'Proyección Equal Earth', en: 'Equal Earth projection' },
  mapLegend: { es: 'Las salas, con sus obras y sus años', en: 'The rooms, with their works and years' },
  colRoom: { es: 'Sala', en: 'Room' },
  colWorks: { es: 'Obras', en: 'Works' },
  colYears: { es: 'Años', en: 'Years' },
  noPlace: { es: 'sin lugar', en: 'no place' },
  timelineHeading: { es: 'Línea de tiempo', en: 'Timeline' },
  sceneThemes: { es: 'Temas de esta escena', en: 'Themes in this scene' },
  otherScenes: { es: 'Otras escenas', en: 'Other scenes' },
  originsThemes: { es: 'Temas que parten de aquí', en: 'Themes that start here' },

  // Atlas
  atlasLead: {
    es: 'Todos los temas, del estudio y de la librería. Cada tarjeta se pinta con los tokens de su propio tema.',
    en: 'Every theme, from the study and the library. Each card is painted with its own theme’s tokens.',
  },
  filters: { es: 'Filtros', en: 'Filters' },
  facetScene: { es: 'Escena', en: 'Scene' },
  facetDecade: { es: 'Década', en: 'Decade' },
  facetKind: { es: 'Obra', en: 'Kind of work' },
  facetScheme: { es: 'Esquema nativo', en: 'Native scheme' },
  facetBorder: { es: 'Borde', en: 'Border' },
  facetShadow: { es: 'Sombra', en: 'Shadow' },
  facetCorners: { es: 'Esquinas', en: 'Corners' },
  any: { es: 'Todas', en: 'Any' },
  search: { es: 'Buscar', en: 'Search' },
  searchPlaceholder: { es: 'Nombre, obra, autoría o lugar', en: 'Name, work, author or place' },
  noResults: { es: 'Ningún tema coincide con estos filtros.', en: 'No theme matches these filters.' },
  clearFilters: { es: 'Quitar filtros', en: 'Clear filters' },
  fromLibrary: { es: 'Librería', en: 'Library' },

  // Theme page
  refLabel: { es: 'Referencia', en: 'Reference' },
  byLabel: { es: 'Autoría', en: 'By' },
  whenWhere: { es: 'Fecha y lugar', en: 'When and where' },
  sceneLabel: { es: 'Escena', en: 'Scene' },
  typefacesLabel: { es: 'Tipografías', en: 'Typefaces' },
  schemeLabel: { es: 'Esquema nativo', en: 'Native scheme' },
  anonymous: { es: 'Anónimo / vernáculo', en: 'Anonymous / vernacular' },
  systemFonts: { es: 'Fuentes del sistema', en: 'System fonts' },
  documented: { es: 'Lo documentado', en: 'What is documented' },
  reading: { es: 'La lectura', en: 'The reading' },
  palette: { es: 'Paleta', en: 'Palette' },
  lettering: { es: 'Tipografía', en: 'Typography' },
  motion: { es: 'Movimiento', en: 'Motion' },
  letteringOriginal: { es: 'La obra usaba', en: 'The work used' },
  letteringNone: { es: 'Ninguna fuente que consultamos documenta rotulación en la obra.', en: 'None of the sources we consulted documents lettering on the work.' },
  motionTry: { es: 'Cada control dispara su movimiento.', en: 'Each control sets off its motion.' },
  motionPress: { es: 'Pulsar', en: 'Press' },
  motionHint: { es: 'Un aviso breve', en: 'A short hint' },
  motionOpen: { es: 'Abrir diálogo', en: 'Open dialog' },
  motionSwitch: { es: 'Interruptor', en: 'Switch' },
  motionLoading: { es: 'Indicador de carga, de muestra', en: 'Loading indicator, a sample' },
  motionDialogTitle: { es: 'Un diálogo', en: 'A dialog' },
  motionDialogBody: { es: 'Así se abre un diálogo en este tema.', en: 'This is how a dialog opens in this theme.' },
  motionClose: { es: 'Cerrar', en: 'Close' },
  sources: { es: 'Fuentes', en: 'Sources' },
  photoBy: { es: 'Foto:', en: 'Photo:' },
  via: { es: 'vía', en: 'via' },
  converted: { es: 'redimensionada y convertida a AVIF', en: 'resized and converted to AVIF' },
  noImage: { es: 'No hay una imagen libre de esta obra.', en: 'There is no free image of this work.' },
  seeArchive: { es: 'Ver la página archivada en la Wayback Machine', en: 'See the archived page in the Wayback Machine' },
  seeSource: { es: 'Ver la fuente principal', en: 'See the main source' },
  predatesStudy: {
    es: 'Este tema es anterior al estudio: su ficha nombra la referencia más cercana.',
    en: 'This theme predates the study: its ficha names its closest reference.',
  },
  specimenHeading: { es: 'El tema en uso', en: 'The theme at work' },
  tokensHeading: { es: 'Tokens y contraste', en: 'Tokens and contrast' },
  installHeading: { es: 'Instalar', en: 'Install' },
  installStudyNote: { es: 'Disponible en neobrutalistcomponents 1.3.0.', en: 'Available in neobrutalistcomponents 1.3.0.' },
  useAcrossSite: { es: 'Usar en todo el sitio', en: 'Use across the site' },
  inUse: { es: 'En uso en todo el sitio', en: 'In use across the site' },
  previousTheme: { es: 'Anterior', en: 'Previous' },
  nextTheme: { es: 'Siguiente', en: 'Next' },
  themeNav: { es: 'Temas de la escena', en: 'Themes in this scene' },
  loadingTheme: { es: 'Cargando el tema…', en: 'Loading the theme…' },
  themeLoadError: {
    es: 'No se pudo cargar este tema. Recarga la página para intentarlo de nuevo.',
    en: 'This theme could not load. Reload the page to try again.',
  },
  backToAtlas: { es: 'Volver al atlas', en: 'Back to the atlas' },

  // Token tables
  colToken: { es: 'Token', en: 'Token' },
  colSwatch: { es: 'Muestra', en: 'Swatch' },
  colValue: { es: 'Valor', en: 'Value' },
  colPair: { es: 'Par', en: 'Pair' },
  colRatio: { es: 'Ratio', en: 'Ratio' },
  colNeeds: { es: 'Mínimo', en: 'Needs' },

  // Method
  methodLead: {
    es: 'Cómo se hace un tema a partir de una obra, y las reglas que lo comprueban.',
    en: 'How a theme is made from a work, and the rules that check it.',
  },
  familiesHeading: { es: 'Familias de detalles', en: 'Detail families' },
  paramMeaning: { es: 'Qué hace', en: 'What it does' },
  paramToken: { es: 'un token de color', en: 'a colour token' },
  touchesLabel: { es: 'Toca', en: 'Touches' },
  paramName: { es: 'Parámetro', en: 'Parameter' },
  paramDefault: { es: 'Por defecto', en: 'Default' },
  paramRange: { es: 'Rango', en: 'Range' },
  contractHeading: { es: 'El contrato de contraste', en: 'The contrast contract' },
  contractLead: {
    es: 'Ningún tema se publica si uno de estos pares falla, en claro o en oscuro, texturas incluidas.',
    en: 'No theme ships if any of these pairs fails, in light or dark, textures included.',
  },

  // Credits
  creditsLead: {
    es: 'Cada fotografía conserva su propia licencia; el código y el resto del sitio son MIT.',
    en: 'Each photograph keeps its own licence; the code and the rest of the site are MIT.',
  },
  photographsHeading: { es: 'Fotografías', en: 'Photographs' },
  fontsHeading: { es: 'Tipografías', en: 'Typefaces' },
  colTheme: { es: 'Tema', en: 'Theme' },
  colAuthor: { es: 'Autoría', en: 'Author' },
  colLicense: { es: 'Licencia', en: 'Licence' },
  colSource: { es: 'Fuente', en: 'Source' },
  colFamily: { es: 'Familia', en: 'Family' },
  colUsedBy: { es: 'La usan', en: 'Used by' },
  fontsUnavailable: {
    es: 'No se pueden listar las tipografías: a una le falta la licencia.',
    en: 'The typefaces cannot be listed: one has no licence on record.',
  },

  // Not found
  notFoundTitle: { es: 'Nada en esta dirección', en: 'Nothing at this address' },
  notFoundBody: { es: 'Puede que la página haya cambiado de sitio.', en: 'The page may have moved.' },
  goStudy: { es: 'Ir al estudio', en: 'Go to the study' },
} as const satisfies Record<string, L10n>;

export type UIKey = keyof typeof UI;

export const SCENE_TEXT: Record<Scene, { readonly name: L10n; readonly summary: L10n }> = {
  japan: {
    name: { es: 'Japón', en: 'Japan' },
    summary: { es: 'Metabolismo, cápsulas y la densidad de la web japonesa.', en: 'Metabolism, capsules and the density of the Japanese web.' },
  },
  germany: {
    name: { es: 'Alemania', en: 'Germany' },
    summary: { es: 'Ulm, la rotulación DIN y el hormigón de Berlín Occidental.', en: 'Ulm, DIN lettering and West Berlin concrete.' },
  },
  usa: {
    name: { es: 'Estados Unidos', en: 'United States' },
    summary: {
      es: 'Páginas web llanas, Emigre, Ray Gun y el neobrutalismo de producto.',
      en: 'Plain web pages, Emigre, Ray Gun and product neobrutalism.',
    },
  },
  latam: {
    name: { es: 'Latinoamérica', en: 'Latin America' },
    summary: {
      es: 'Brutalismo paulista, poesía concreta, Cybersyn y carteles chicha.',
      en: 'Paulista brutalism, concrete poetry, Cybersyn and chicha posters.',
    },
  },
  italy: {
    name: { es: 'Italia', en: 'Italy' },
    summary: {
      es: 'La Torre Velasca, el Elea de Olivetti, Superstudio y Memphis.',
      en: 'The Torre Velasca, Olivetti’s Elea, Superstudio and Memphis.',
    },
  },
  origins: {
    name: { es: 'Orígenes', en: 'Origins' },
    summary: {
      es: 'Béton brut, el New Brutalism británico, el estilo suizo y la web brutalista.',
      en: 'Béton brut, British New Brutalism, the Swiss style and brutalist websites.',
    },
  },
};

export const KIND_TEXT: Record<ReferenceKind, L10n> = {
  architecture: { es: 'Arquitectura', en: 'Architecture' },
  graphic: { es: 'Gráfica', en: 'Graphic design' },
  type: { es: 'Tipografía', en: 'Typeface' },
  web: { es: 'Web', en: 'Website' },
  software: { es: 'Software', en: 'Software' },
  signage: { es: 'Señalética', en: 'Signage' },
  object: { es: 'Objeto', en: 'Object' },
};

export const SCHEME_TEXT: Record<'light' | 'dark', L10n> = {
  light: { es: 'claro', en: 'light' },
  dark: { es: 'oscuro', en: 'dark' },
};

export const BORDER_TEXT: Record<BorderFacet, L10n> = {
  hairline: { es: 'Fino', en: 'Hairline' },
  standard: { es: 'Medio', en: 'Standard' },
  heavy: { es: 'Grueso', en: 'Heavy' },
};

export const SHADOW_TEXT: Record<ShadowKind, L10n> = {
  none: { es: 'Sin sombra', en: 'None' },
  hard: { es: 'Dura', en: 'Hard' },
  double: { es: 'Doble', en: 'Double' },
  soft: { es: 'Suave', en: 'Soft' },
};

export const CORNER_TEXT: Record<CornerFacet, L10n> = {
  square: { es: 'Rectas', en: 'Square' },
  soft: { es: 'Suaves', en: 'Soft' },
  round: { es: 'Redondas', en: 'Round' },
};

export const PALETTE_TEXT: Record<PaletteOrigin, L10n> = {
  documented: { es: 'documentada', en: 'documented' },
  sampled: { es: 'muestreada', en: 'sampled' },
  interpreted: { es: 'interpretada', en: 'interpreted' },
};

/** The `why` of every CONTRAST_PAIRS entry, keyed `${fg} ${bg}`. */
export const PAIR_TEXT: Record<string, L10n> = {
  '--nbc-fg --nbc-bg': { es: 'texto sobre la página', en: 'body text on page' },
  '--nbc-fg --nbc-surface': { es: 'texto en tarjetas y campos', en: 'text on cards and fields' },
  '--nbc-fg --nbc-surface-alt': { es: 'texto en filas resaltadas y franjas', en: 'text on hover rows, stripes' },
  '--nbc-fg --nbc-surface-fill': { es: 'texto en superficies con relleno', en: 'text on filled surfaces' },
  '--nbc-fg-muted --nbc-surface': { es: 'descripciones y textos de ejemplo', en: 'descriptions and placeholders' },
  '--nbc-fg-muted --nbc-bg': { es: 'texto secundario de la página', en: 'secondary page text' },
  '--nbc-primary-fg --nbc-primary': { es: 'etiqueta del botón principal', en: 'primary button label' },
  '--nbc-primary-fg --nbc-primary-fill': { es: 'etiqueta del botón principal sobre relleno', en: 'primary button label on fill' },
  '--nbc-accent-fg --nbc-accent': { es: 'insignia de acento', en: 'accent badge label' },
  '--nbc-info-fg --nbc-info': { es: 'insignia informativa', en: 'info badge label' },
  '--nbc-success-fg --nbc-success': { es: 'insignia de éxito', en: 'success badge label' },
  '--nbc-warning-fg --nbc-warning': { es: 'insignia de aviso', en: 'warning badge label' },
  '--nbc-danger-fg --nbc-danger': { es: 'insignia de peligro', en: 'danger badge label' },
  '--nbc-danger-fg --nbc-danger-fill': { es: 'etiqueta del botón de peligro', en: 'danger button label' },
  '--nbc-danger --nbc-surface': { es: 'mensajes de error', en: 'error messages' },
  '--nbc-border-color --nbc-bg': { es: 'bordes de los controles', en: 'control boundaries' },
  '--nbc-focus --nbc-bg': { es: 'indicador de foco', en: 'focus indicator' },
};

export function themeCount(lang: Lang, n: number): string {
  if (lang === 'es') return n === 1 ? '1 tema' : `${n} temas`;
  return n === 1 ? '1 theme' : `${n} themes`;
}

export function workCount(lang: Lang, n: number): string {
  if (lang === 'es') return n === 1 ? '1 obra' : `${n} obras`;
  return n === 1 ? '1 work' : `${n} works`;
}

/** 1970 → 'Años 70' / '1970s'. Outside the 1900s the Spanish label keeps the full year: 2010 → 'Años 2010'. */
export function decadeLabel(lang: Lang, decade: number): string {
  if (lang === 'en') return `${decade}s`;
  return decade >= 1900 && decade < 2000 ? `Años ${String(decade).slice(2)}` : `Años ${decade}`;
}

export const LangContext = createContext<Lang>('en');

export function useLang(): Lang {
  return use(LangContext);
}

/** `t('navStudy')` in the current language. */
export function useT(): (key: UIKey) => string {
  const lang = useLang();
  return (key) => UI[key][lang];
}
