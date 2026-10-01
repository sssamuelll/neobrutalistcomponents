import { Badge, Table } from 'neobrutalistcomponents';
import type { BadgeProps } from 'neobrutalistcomponents';

const invoices: Array<{ id: string; customer: string; status: string; variant: BadgeProps['variant']; amount: string }> = [
  { id: 'INV-2041', customer: 'Northwind Traders', status: 'Paid', variant: 'success', amount: '$4,280.00' },
  { id: 'INV-2042', customer: 'Globex Industries', status: 'Pending', variant: 'warning', amount: '$1,150.50' },
  { id: 'INV-2043', customer: 'Initech', status: 'Overdue', variant: 'danger', amount: '$9,600.00' },
  { id: 'INV-2044', customer: 'Umbrella Labs', status: 'Paid', variant: 'success', amount: '$720.00' },
  { id: 'INV-2045', customer: 'Hooli', status: 'Draft', variant: 'neutral', amount: '$12,400.00' },
];

export default function Invoices() {
  return (
    <Table>
      <Table.Caption>Invoices issued in September 2026, amounts in USD.</Table.Caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Invoice</Table.HeaderCell>
          <Table.HeaderCell>Customer</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell align="end">Amount</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {invoices.map((invoice) => (
          <Table.Row key={invoice.id}>
            <Table.HeaderCell scope="row">{invoice.id}</Table.HeaderCell>
            <Table.Cell>{invoice.customer}</Table.Cell>
            <Table.Cell>
              <Badge size="sm" variant={invoice.variant}>
                {invoice.status}
              </Badge>
            </Table.Cell>
            <Table.Cell numeric>{invoice.amount}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
