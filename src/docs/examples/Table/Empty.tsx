import { Button, Table } from 'neobrutalistcomponents';

export default function Empty() {
  return (
    <Table>
      <Table.Caption>Pending invites for the Acme workspace.</Table.Caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Email</Table.HeaderCell>
          <Table.HeaderCell>Role</Table.HeaderCell>
          <Table.HeaderCell>Sent</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell colSpan={3} align="center">
            <div style={{ display: 'grid', justifyItems: 'center', gap: 12, padding: '24px 0' }}>
              <p style={{ margin: 0, maxWidth: '44ch' }}>
                No pending invites. Invite a teammate by email and they will appear here until they accept.
              </p>
              <Button size="sm">Invite teammate</Button>
            </div>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}
