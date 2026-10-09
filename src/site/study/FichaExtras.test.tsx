import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FIXTURE } from '../../study/__fixtures__/fixture';
import type { Ficha } from '../../study/types';
import { LangContext } from '../i18n';
import { FichaExtras } from './FichaExtras';

const renderExtras = (ficha: Ficha, lang: 'es' | 'en' = 'es') =>
  render(
    <LangContext value={lang}>
      <FichaExtras ficha={ficha} />
    </LangContext>,
  );

describe('FichaExtras', () => {
  it('shows the typography section with the original, what was documented and the substitute', () => {
    renderExtras(FIXTURE.ficha);
    expect(screen.getByRole('heading', { name: 'Tipografía' })).toBeInTheDocument();
    expect(screen.getByText(/Testschrift, Nobody, 1971/)).toBeInTheDocument();
    expect(screen.getByText('Rotulada en una grotesca [1].')).toBeInTheDocument();
    expect(screen.getByText(/Barlow se le parece/)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Movimiento' })).not.toBeInTheDocument();
  });

  it('shows the motion section when the ficha has one, in English too', () => {
    const ficha: Ficha = { ...FIXTURE.ficha, motion: { documented: { es: 'Se mueve [1].', en: 'It moves [1].' }, reading: { es: 'Lo imita.', en: 'It imitates that.' } } };
    renderExtras(ficha, 'en');
    expect(screen.getByRole('heading', { name: 'Typography' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Motion' })).toBeInTheDocument();
    expect(screen.getByText('It moves [1].')).toBeInTheDocument();
    expect(screen.getByText('It imitates that.')).toBeInTheDocument();
  });

  it('renders nothing for a ficha without either block', () => {
    const { container } = renderExtras({ ...FIXTURE.ficha, lettering: undefined });
    expect(container).toBeEmptyDOMElement();
  });
});
