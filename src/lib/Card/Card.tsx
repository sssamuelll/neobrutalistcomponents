import type { ComponentProps, ElementType, Ref } from 'react';
import { cx } from '../internal/cx';

export type CardVariant = 'default' | 'elevated' | 'interactive';

export interface CardProps extends Omit<ComponentProps<'div'>, 'ref'> {
  /** `elevated` lifts the slab; `interactive` makes the whole card follow its title link. */
  variant?: CardVariant;
  /** Element to render. Use `li` inside lists, `article` for standalone items. */
  as?: 'div' | 'article' | 'section' | 'li';
  ref?: Ref<HTMLElement>;
}

function CardRoot({ variant = 'default', as = 'div', className, ...rest }: CardProps) {
  const Tag = as as ElementType;
  return <Tag {...rest} className={cx('nbc-card', `nbc-card--${variant}`, className)} />;
}

function CardHeader({ className, ...rest }: ComponentProps<'div'>) {
  return <div {...rest} className={cx('nbc-card__header', className)} />;
}

export interface CardTitleProps extends Omit<ComponentProps<'h3'>, 'ref'> {
  /** Heading level. Defaults to `h3`; pick the level that fits the page outline. */
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  ref?: Ref<HTMLHeadingElement>;
}

function CardTitle({ as = 'h3', className, ...rest }: CardTitleProps) {
  const Tag = as as ElementType;
  return <Tag {...rest} className={cx('nbc-card__title', className)} />;
}

function CardDescription({ className, ...rest }: ComponentProps<'p'>) {
  return <p {...rest} className={cx('nbc-card__description', className)} />;
}

function CardContent({ className, ...rest }: ComponentProps<'div'>) {
  return <div {...rest} className={cx('nbc-card__content', className)} />;
}

function CardFooter({ className, ...rest }: ComponentProps<'div'>) {
  return <div {...rest} className={cx('nbc-card__footer', className)} />;
}

/** A bordered slab that groups related content. Compose with Card.Header, Card.Title, Card.Description, Card.Content and Card.Footer. */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});
