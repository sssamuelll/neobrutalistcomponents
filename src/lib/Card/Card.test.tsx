import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Card } from './Card';

describe('Card', () => {
  it('renders children inside the root', () => {
    render(<Card>hello</Card>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it.each(['default', 'elevated', 'interactive'] as const)(
    'applies variant class %s',
    (variant) => {
      const { container } = render(<Card variant={variant}>x</Card>);
      expect(container.firstChild).toHaveClass(`nbc-card--${variant}`);
    },
  );

  it('defaults to variant=default', () => {
    const { container } = render(<Card>x</Card>);
    expect(container.firstChild).toHaveClass('nbc-card--default');
  });

  it('composes sub-components with correct semantics', () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Title</Card.Title>
          <Card.Description>Desc</Card.Description>
        </Card.Header>
        <Card.Content>Body</Card.Content>
        <Card.Footer>Foot</Card.Footer>
      </Card>,
    );
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Title');
    expect(screen.getByText('Desc')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Foot')).toBeInTheDocument();
  });

  it('forwards arbitrary props to the root element', () => {
    const { container } = render(<Card data-testid="c">x</Card>);
    expect(container.firstChild).toHaveAttribute('data-testid', 'c');
  });

  it('merges consumer className with internal classes', () => {
    const { container } = render(<Card className="mine">x</Card>);
    expect(container.firstChild).toHaveClass('mine');
    expect((container.firstChild as HTMLElement).className).toMatch(/nbc-card/);
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Card>
        <Card.Header>
          <Card.Title>Heading</Card.Title>
          <Card.Description>Subtitle</Card.Description>
        </Card.Header>
        <Card.Content>Body copy.</Card.Content>
        <Card.Footer>Footer</Card.Footer>
      </Card>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
