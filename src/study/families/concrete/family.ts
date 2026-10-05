import { defineFamily } from '../types';
import { lightDark, withAlpha } from '../../color';
import type { ColorToken } from '../../types';
import css from './family.css?raw';

export const concrete = defineFamily({
  name: 'concrete',
  description: {
    es: 'Hormigón visto: las marcas horizontales del encofrado de tablas y un moteado fino, detrás de la página y de cada losa.',
    en: 'Exposed concrete: the horizontal marks of board formwork and a fine speckle, behind the page and every slab.',
  },
  touches: ['nbc-root', 'nbc-card', 'nbc-dialog', 'nbc-table', 'nbc-alert'],
  params: {
    grain: {
      type: 'number', default: 0.06, min: 0, max: 0.12,
      description: { es: 'Opacidad del moteado (0 lo quita).', en: 'Speckle opacity (0 removes it).' },
    },
    formwork: {
      type: 'number', default: 0.05, min: 0, max: 0.12,
      description: { es: 'Opacidad de las marcas de tabla (0 las quita).', en: 'Board-mark opacity (0 removes them).' },
    },
    board: {
      type: 'length', default: 18, min: 8, max: 64,
      description: { es: 'Ancho de cada tabla del encofrado, en px.', en: 'Width of each formwork board, in px.' },
    },
    ink: {
      type: 'token', default: 'fg',
      description: { es: 'Token de color de marcas y moteado.', en: 'Color token of the marks and speckle.' },
    },
  },
  css,
  texture: (values, ctx) => {
    const ink = values.ink as ColorToken;
    const tint = (alpha: number) => lightDark(withAlpha(ctx.color(ink, 'light'), alpha), withAlpha(ctx.color(ink, 'dark'), alpha));
    const grain = Number(values.grain);
    const formwork = Number(values.formwork);
    const layers: string[] = [];
    if (formwork > 0) layers.push(`repeating-linear-gradient(0deg, ${tint(formwork)} 0 1px, transparent 1px ${values.board}px)`);
    if (grain > 0) {
      layers.push(`radial-gradient(${tint(grain)} 0.6px, transparent 1px) 0 0 / 7px 7px`);
      layers.push(`radial-gradient(${tint(grain)} 0.5px, transparent 0.9px) 3px 4px / 11px 13px`);
    }
    return layers;
  },
});
