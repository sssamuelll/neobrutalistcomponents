import { Table } from 'neobrutalistcomponents';

const projects = [
  { name: 'Acme relaunch', seats: 12, storage: '48.2 GB', cost: '$216.00' },
  { name: 'Atlas API v2', seats: 8, storage: '131.7 GB', cost: '$184.00' },
  { name: 'Mobile checkout', seats: 5, storage: '9.4 GB', cost: '$90.00' },
];

export default function Totals() {
  return (
    <Table>
      <Table.Caption>Workspace usage for October 2026.</Table.Caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Project</Table.HeaderCell>
          <Table.HeaderCell align="end">Seats</Table.HeaderCell>
          <Table.HeaderCell align="end">Storage</Table.HeaderCell>
          <Table.HeaderCell align="end">Cost</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {projects.map((project) => (
          <Table.Row key={project.name}>
            <Table.HeaderCell scope="row">{project.name}</Table.HeaderCell>
            <Table.Cell numeric>{project.seats}</Table.Cell>
            <Table.Cell numeric>{project.storage}</Table.Cell>
            <Table.Cell numeric>{project.cost}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Foot>
        <Table.Row>
          <Table.HeaderCell scope="row">Total</Table.HeaderCell>
          <Table.Cell numeric>25</Table.Cell>
          <Table.Cell numeric>189.3 GB</Table.Cell>
          <Table.Cell numeric>$490.00</Table.Cell>
        </Table.Row>
      </Table.Foot>
    </Table>
  );
}
