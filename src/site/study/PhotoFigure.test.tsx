import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LangContext } from '../i18n';
import { PhotoFigure } from './PhotoFigure';

const image = {
  file: 'nakagin.avif',
  width: 1200,
  height: 800,
  alt: { es: 'Las cápsulas de la torre.', en: 'The tower’s capsules.' },
  author: 'Dllu',
  license: 'CC-BY-SA-4.0',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:Nakagin.jpg',
} as const;

describe('PhotoFigure', () => {
  it('shows the photograph with its author, licence and Commons page', () => {
    render(
      <LangContext value="es">
        <PhotoFigure image={image} className="x" />
      </LangContext>,
    );
    expect(screen.getByRole('img', { name: 'Las cápsulas de la torre.' })).toBeInTheDocument();
    expect(screen.getByText(/Foto: Dllu/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'CC BY-SA 4.0' })).toHaveAttribute('href', 'https://creativecommons.org/licenses/by-sa/4.0/');
    expect(screen.getByRole('link', { name: 'Wikimedia Commons' })).toHaveAttribute('href', image.sourceUrl);
  });

  it('renders nothing when the file is not in the build', () => {
    const { container } = render(
      <LangContext value="es">
        <PhotoFigure image={{ ...image, file: 'missing.avif' }} />
      </LangContext>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
