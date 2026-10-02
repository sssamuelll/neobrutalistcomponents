import type { ComponentProps } from 'react';
import { cx } from '../internal/cx';

export type TableDensity = 'compact' | 'comfortable';
export type TableAlign = 'start' | 'center' | 'end';

export interface TableProps extends ComponentProps<'table'> {
  /** Row block size: `comfortable` is 48px, `compact` is 36px. */
  density?: TableDensity;
  /** Tint every second body row. Helps the eye follow wide rows. */
  striped?: boolean;
}

export interface TableHeaderCellProps extends Omit<ComponentProps<'th'>, 'align'> {
  /** Text alignment. Match the alignment of the cells below, e.g. `end` over a numeric column. */
  align?: TableAlign;
}

export interface TableCellProps extends Omit<ComponentProps<'td'>, 'align'> {
  /** Text alignment. Overrides the end alignment that `numeric` implies. */
  align?: TableAlign;
  /** Tabular numerals, aligned to the end. Use for amounts, counts and durations. */
  numeric?: boolean;
}

function TableRoot({ density = 'comfortable', striped = false, className, ...rest }: TableProps) {
  return (
    <div className={cx('nbc-table', `nbc-table--${density}`, striped && 'nbc-table--striped', className)}>
      <table {...rest} className="nbc-table__table" />
    </div>
  );
}

function TableCaption({ className, ...rest }: ComponentProps<'caption'>) {
  return <caption {...rest} className={cx('nbc-table__caption', className)} />;
}

function TableHead({ className, ...rest }: ComponentProps<'thead'>) {
  return <thead {...rest} className={cx('nbc-table__head', className)} />;
}

function TableBody({ className, ...rest }: ComponentProps<'tbody'>) {
  return <tbody {...rest} className={cx('nbc-table__body', className)} />;
}

function TableFoot({ className, ...rest }: ComponentProps<'tfoot'>) {
  return <tfoot {...rest} className={cx('nbc-table__foot', className)} />;
}

function TableRow({ className, ...rest }: ComponentProps<'tr'>) {
  return <tr {...rest} className={cx('nbc-table__row', className)} />;
}

function TableHeaderCell({ align, scope = 'col', className, ...rest }: TableHeaderCellProps) {
  return (
    <th
      {...rest}
      scope={scope}
      className={cx('nbc-table__header-cell', align && `nbc-table__header-cell--${align}`, className)}
    />
  );
}

function TableCell({ align, numeric = false, className, ...rest }: TableCellProps) {
  const resolved = align ?? (numeric ? 'end' : undefined);
  return (
    <td
      {...rest}
      className={cx(
        'nbc-table__cell',
        numeric && 'nbc-table__cell--numeric',
        resolved && `nbc-table__cell--${resolved}`,
        className,
      )}
    />
  );
}

/** A data table with a horizontal scroll wrapper. Compose with Table.Caption, Table.Head, Table.Body, Table.Foot, Table.Row, Table.HeaderCell and Table.Cell. */
export const Table = Object.assign(TableRoot, {
  Caption: TableCaption,
  Head: TableHead,
  Body: TableBody,
  Foot: TableFoot,
  Row: TableRow,
  HeaderCell: TableHeaderCell,
  Cell: TableCell,
});
