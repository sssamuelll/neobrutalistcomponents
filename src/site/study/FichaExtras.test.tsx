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

describe('FichaExtras, retrofit additions', () => {
  it('says when no source documents lettering on the work', () => {
    renderExtras({ ...FIXTURE.ficha, lettering: { original: { kind: 'none' }, substitute: { es: 'El tema usa Barlow.', en: 'The theme uses Barlow.' } } });
    expect(screen.getByText('Ninguna fuente que consultamos documenta rotulación en la obra.')).toBeInTheDocument();
    expect(screen.queryByText(/La obra usaba/)).not.toBeInTheDocument();
  });

  it('shows the motion specimen with the motion section, and not without it', () => {
    const motion = { documented: { es: 'Se mueve [1].', en: 'It moves [1].' }, reading: { es: 'Lo imita.', en: 'It imitates that.' } };
    const { container, unmount } = renderExtras({ ...FIXTURE.ficha, motion }, 'en');
    expect(screen.getByRole('button', { name: 'Open dialog' })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Switch' })).toBeInTheDocument();
    expect(container.querySelector('.nbc-progress--indeterminate')).not.toBeNull();
    unmount();
    renderExtras(FIXTURE.ficha, 'en');
    expect(screen.queryByRole('button', { name: 'Open dialog' })).not.toBeInTheDocument();
  });
});

describe('FichaExtras prints the substitute as written', () => {
  it('with no label before it (the prose already says "the theme uses")', () => {
    renderExtras(FIXTURE.ficha);
    expect(screen.getByText('Barlow se le parece en la proporción.')).toBeInTheDocument();
  });
});

describe('the motion specimen speaks the page language (batch 1 review)', () => {
  it('labels the dialog close button in Spanish', () => {
    const motion = { documented: { es: 'Se mueve [1].', en: 'It moves [1].' }, reading: { es: 'Lo imita.', en: 'It imitates that.' } };
    renderExtras({ ...FIXTURE.ficha, motion });
    expect(screen.getAllByRole('button', { name: 'Cerrar', hidden: true })).toHaveLength(2);
  });
});
