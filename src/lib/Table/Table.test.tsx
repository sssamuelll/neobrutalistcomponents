import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import { axe } from '../../test-utils';
import { Table } from './Table';

function Invoices(props: Parameters<typeof Table>[0]) {
  return (
    <Table {...props}>
      <Table.Caption>Invoices for September</Table.Caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Invoice</Table.HeaderCell>
          <Table.HeaderCell>Customer</Table.HeaderCell>
          <Table.HeaderCell align="end">Amount</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>INV-1041</Table.Cell>
          <Table.Cell>Northwind Traders</Table.Cell>
          <Table.Cell numeric>$1,280.00</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>INV-1042</Table.Cell>
          <Table.Cell>Globex</Table.Cell>
          <Table.Cell numeric>$642.50</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Foot>
        <Table.Row>
          <Table.Cell colSpan={2}>Total</Table.Cell>
          <Table.Cell numeric>$1,922.50</Table.Cell>
        </Table.Row>
      </Table.Foot>
    </Table>
  );
}

describe('Table', () => {
  it('renders native table semantics: rowgroups, rows, column headers and cells', () => {
    render(<Invoices />);
    const table = screen.getByRole('table', { name: 'Invoices for September' });
    expect(table.tagName).toBe('TABLE');
    expect(within(table).getAllByRole('rowgroup')).toHaveLength(3);
    expect(within(table).getAllByRole('row')).toHaveLength(4);
    expect(within(table).getAllByRole('columnheader').map((h) => h.textContent)).toEqual([
      'Invoice',
      'Customer',
      'Amount',
    ]);
    expect(within(table).getAllByRole('cell')).toHaveLength(8);
  });

  it('renders a caption element that names the table', () => {
    render(<Invoices />);
    const caption = screen.getByText('Invoices for September');
    expect(caption.tagName).toBe('CAPTION');
    expect(caption).toHaveClass('nbc-table__caption');
  });

  it('gives each part its BEM class', () => {
    render(<Invoices />);
    const table = screen.getByRole('table');
    const [head, body, foot] = within(table).getAllByRole('rowgroup');
    expect(head.tagName).toBe('THEAD');
    expect(head).toHaveClass('nbc-table__head');
    expect(body.tagName).toBe('TBODY');
    expect(body).toHaveClass('nbc-table__body');
    expect(foot.tagName).toBe('TFOOT');
    expect(foot).toHaveClass('nbc-table__foot');
    for (const row of within(table).getAllByRole('row')) expect(row).toHaveClass('nbc-table__row');
    for (const h of within(table).getAllByRole('columnheader')) {
      expect(h.tagName).toBe('TH');
      expect(h).toHaveClass('nbc-table__header-cell');
    }
    for (const c of within(table).getAllByRole('cell')) {
      expect(c.tagName).toBe('TD');
      expect(c).toHaveClass('nbc-table__cell');
    }
  });

  describe('wrapper and table element', () => {
    it('renders a scroll wrapper div around the table with comfortable density by default', () => {
      const { container } = render(<Invoices />);
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper.tagName).toBe('DIV');
      expect(wrapper).toHaveClass('nbc-table', 'nbc-table--comfortable');
      expect(wrapper).not.toHaveClass('nbc-table--compact');
      expect(wrapper).not.toHaveClass('nbc-table--striped');
      expect(wrapper.firstElementChild).toBe(screen.getByRole('table'));
      expect(screen.getByRole('table')).toHaveClass('nbc-table__table');
    });

    it('applies density and striped modifiers on the wrapper', () => {
      const { container } = render(<Invoices density="compact" striped />);
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper).toHaveClass('nbc-table--compact', 'nbc-table--striped');
      expect(wrapper).not.toHaveClass('nbc-table--comfortable');
    });

    it('puts className on the wrapper and the rest props on the table', () => {
      const { container } = render(<Invoices className="mine" data-testid="t" aria-describedby="note" />);
      const wrapper = container.firstElementChild as HTMLElement;
      const table = screen.getByRole('table');
      expect(wrapper).toHaveClass('mine', 'nbc-table');
      expect(table).not.toHaveClass('mine');
      expect(table).toHaveAttribute('data-testid', 't');
      expect(table).toHaveAttribute('aria-describedby', 'note');
      expect(wrapper).not.toHaveAttribute('data-testid');
    });

    it('forwards the ref to the <table>', () => {
      const ref = createRef<HTMLTableElement>();
      render(<Invoices ref={ref} />);
      expect(ref.current).toBe(screen.getByRole('table'));
      expect(ref.current?.tagName).toBe('TABLE');
    });
  });

  describe('Table.HeaderCell', () => {
    it('defaults scope to col', () => {
      render(
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Plan</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
        </Table>,
      );
      expect(screen.getByRole('columnheader', { name: 'Plan' })).toHaveAttribute('scope', 'col');
    });

    it('lets the scope be overridden: scope="row" makes a row header', () => {
      render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.HeaderCell scope="row">Starter</Table.HeaderCell>
              <Table.Cell>$9</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );
      const rowHeader = screen.getByRole('rowheader', { name: 'Starter' });
      expect(rowHeader).toHaveAttribute('scope', 'row');
      expect(screen.queryByRole('columnheader')).not.toBeInTheDocument();
    });

    it.each(['start', 'center', 'end'] as const)('applies align %s', (align) => {
      render(
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell align={align}>Amount</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
        </Table>,
      );
      expect(screen.getByRole('columnheader')).toHaveClass(`nbc-table__header-cell--${align}`);
    });

    it('adds no alignment modifier by default and forwards className, ref and props', () => {
      const ref = createRef<HTMLTableCellElement>();
      render(
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell ref={ref} className="mine" colSpan={2} abbr="Amt">
                Amount
              </Table.HeaderCell>
            </Table.Row>
          </Table.Head>
        </Table>,
      );
      const th = screen.getByRole('columnheader');
      expect(th.className).not.toMatch(/--(start|center|end)/);
      expect(th).toHaveClass('mine', 'nbc-table__header-cell');
      expect(th).toHaveAttribute('colspan', '2');
      expect(th).toHaveAttribute('abbr', 'Amt');
      expect(ref.current).toBe(th);
    });
  });

  describe('Table.Cell', () => {
    function renderCell(props: Parameters<typeof Table.Cell>[0]) {
      render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell {...props}>$9.00</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );
      return screen.getByRole('cell');
    }

    it('plain cells carry no alignment or numeric modifier', () => {
      const cell = renderCell({});
      expect(cell).toHaveClass('nbc-table__cell');
      expect(cell.className).not.toMatch(/--(start|center|end|numeric)/);
    });

    it('numeric cells get the numeric class and end alignment by default', () => {
      const cell = renderCell({ numeric: true });
      expect(cell).toHaveClass('nbc-table__cell--numeric', 'nbc-table__cell--end');
    });

    it.each(['start', 'center', 'end'] as const)('applies align %s', (align) => {
      const cell = renderCell({ align });
      expect(cell).toHaveClass(`nbc-table__cell--${align}`);
      expect(cell).not.toHaveClass('nbc-table__cell--numeric');
    });

    it('an explicit align wins over the numeric default', () => {
      const cell = renderCell({ numeric: true, align: 'center' });
      expect(cell).toHaveClass('nbc-table__cell--numeric', 'nbc-table__cell--center');
      expect(cell).not.toHaveClass('nbc-table__cell--end');
    });

    it('forwards className, ref and native props (colSpan)', () => {
      const ref = createRef<HTMLTableCellElement>();
      render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell ref={ref} className="mine" colSpan={3} data-testid="empty">
                Nothing here yet.
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );
      const cell = screen.getByTestId('empty');
      expect(cell).toHaveClass('mine', 'nbc-table__cell');
      expect(cell).toHaveAttribute('colspan', '3');
      expect(ref.current).toBe(cell);
    });
  });

  it('forwards className, ref and props on the plain subcomponents', () => {
    const caption = createRef<HTMLTableCaptionElement>();
    const head = createRef<HTMLTableSectionElement>();
    const body = createRef<HTMLTableSectionElement>();
    const foot = createRef<HTMLTableSectionElement>();
    const row = createRef<HTMLTableRowElement>();
    render(
      <Table>
        <Table.Caption ref={caption} className="c1">
          Caption
        </Table.Caption>
        <Table.Head ref={head} className="h1" data-x="head">
          <Table.Row ref={row} className="r1" aria-rowindex={1}>
            <Table.HeaderCell>H</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body ref={body} className="b1" data-x="body">
          <Table.Row>
            <Table.Cell>B</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Foot ref={foot} className="f1" data-x="foot">
          <Table.Row>
            <Table.Cell>F</Table.Cell>
          </Table.Row>
        </Table.Foot>
      </Table>,
    );
    expect(caption.current).toHaveClass('c1', 'nbc-table__caption');
    expect(head.current).toHaveClass('h1', 'nbc-table__head');
    expect(head.current).toHaveAttribute('data-x', 'head');
    expect(body.current).toHaveClass('b1', 'nbc-table__body');
    expect(body.current).toHaveAttribute('data-x', 'body');
    expect(foot.current).toHaveClass('f1', 'nbc-table__foot');
    expect(foot.current).toHaveAttribute('data-x', 'foot');
    expect(row.current).toHaveClass('r1', 'nbc-table__row');
    expect(row.current).toHaveAttribute('aria-rowindex', '1');
  });

  it('supports an empty-state row that spans every column', () => {
    render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell colSpan={2}>No invites yet.</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(screen.getByRole('cell', { name: 'No invites yet.' })).toHaveAttribute('colspan', '2');
  });

  it('has no axe violations (caption, head, body, foot, row headers)', async () => {
    const { container } = render(
      <div>
        <Invoices striped />
        <Table density="compact">
          <Table.Caption>Plans</Table.Caption>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Plan</Table.HeaderCell>
              <Table.HeaderCell align="end">Seats</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.HeaderCell scope="row">Starter</Table.HeaderCell>
              <Table.Cell numeric>5</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
