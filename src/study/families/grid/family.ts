import { defineFamily } from '../types';
import { lightDark, withAlpha } from '../../color';
import type { ColorToken } from '../../types';
import css from './family.css?raw';

export const grid = defineFamily({
  name: 'grid',
  description: {
    es: 'Una retícula modular dibujada sobre cada losa: la medida del sistema, a la vista.',
    en: 'A modular grid drawn on every slab: the measure of the system, made visible.',
  },
  touches: ['nbc-card', 'nbc-dialog', 'nbc-table', 'nbc-alert'],
  params: {
    cell: {
      type: 'length', default: 24, min: 8, max: 96,
      description: { es: 'Tamaño del módulo, en px.', en: 'Module size, in px.' },
    },
    strength: {
      type: 'number', default: 0.08, min: 0, max: 0.12,
      description: { es: 'Opacidad de las líneas.', en: 'Line opacity.' },
    },
    line: {
      type: 'token', default: 'border',
      description: { es: 'Token de color de las líneas.', en: 'Color token of the lines.' },
    },
  },
  css,
  texture: (values, ctx) => {
    const line = values.line as ColorToken;
    const alpha = Number(values.strength);
    const c = lightDark(withAlpha(ctx.color(line, 'light'), alpha), withAlpha(ctx.color(line, 'dark'), alpha));
    const size = `${values.cell}px ${values.cell}px`;
    return [
      `linear-gradient(to right, ${c} 1px, transparent 1px) 0 0 / ${size}`,
      `linear-gradient(to bottom, ${c} 1px, transparent 1px) 0 0 / ${size}`,
    ];
  },
});
