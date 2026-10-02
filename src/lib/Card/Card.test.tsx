import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from '../../test-utils';
import { Card } from './Card';

describe('Card', () => {
  it('renders a div with the default variant', () => {
    const { container } = render(<Card>x</Card>);
    expect(container.firstElementChild?.tagName).toBe('DIV');
    expect(container.firstElementChild).toHaveClass('nbc-card', 'nbc-card--default');
  });

  it.each(['default', 'elevated', 'interactive'] as const)('applies variant %s', (variant) => {
    const { container } = render(<Card variant={variant}>x</Card>);
    expect(container.firstElementChild).toHaveClass(`nbc-card--${variant}`);
  });

  it.each(['article', 'section', 'li'] as const)('renders as <%s>', (as) => {
    const { container } = render(as === 'li' ? <ul><Card as="li">x</Card></ul> : <Card as={as}>x</Card>);
    expect(container.querySelector('.nbc-card')?.tagName).toBe(as.toUpperCase());
  });

  it('composes header, title (h3 by default), description, content, footer', () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Plan</Card.Title>
          <Card.Description>Monthly</Card.Description>
        </Card.Header>
        <Card.Content>Body</Card.Content>
        <Card.Footer>Foot</Card.Footer>
      </Card>,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Plan' })).toHaveClass('nbc-card__title');
    expect(screen.getByText('Monthly')).toHaveClass('nbc-card__description');
    expect(screen.getByText('Body')).toHaveClass('nbc-card__content');
    expect(screen.getByText('Foot')).toHaveClass('nbc-card__footer');
  });

  it('title level is configurable', () => {
    render(<Card.Title as="h2">Big</Card.Title>);
    expect(screen.getByRole('heading', { level: 2, name: 'Big' })).toBeInTheDocument();
  });

  it('forwards ref, className and props', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <Card ref={ref} className="mine" data-testid="c" aria-label="Plan">
        x
      </Card>,
    );
    expect(ref.current).toBe(container.firstElementChild);
    expect(container.firstElementChild).toHaveClass('mine', 'nbc-card');
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'Plan');
  });

  it('has no axe violations, including the interactive stretched-link pattern', async () => {
    const { container } = render(
      <div>
        <Card>
          <Card.Header>
            <Card.Title>Heading</Card.Title>
            <Card.Description>Subtitle</Card.Description>
          </Card.Header>
          <Card.Content>Body copy.</Card.Content>
        </Card>
        <Card variant="interactive" as="article">
          <Card.Header>
            <Card.Title>
              <a href="/projects/acme">Acme relaunch</a>
            </Card.Title>
          </Card.Header>
          <Card.Content>Due Friday.</Card.Content>
        </Card>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
