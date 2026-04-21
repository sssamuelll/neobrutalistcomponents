import type { HTMLAttributes } from 'react';
import './Card.css';

export type CardVariant = 'default' | 'elevated' | 'interactive';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

function CardRoot({
  variant = 'default',
  className,
  children,
  ...rest
}: CardProps) {
  const classes = ['nbc-card', `nbc-card--${variant}`, className]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

function CardHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={['nbc-card__header', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
}

function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={['nbc-card__title', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
}

function CardDescription({
  className,
  ...rest
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={['nbc-card__description', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
}

function CardContent({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={['nbc-card__content', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
}

function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={['nbc-card__footer', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
}

type CardComponent = typeof CardRoot & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
};

export const Card = CardRoot as CardComponent;
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;
