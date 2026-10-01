import { Table } from 'neobrutalistcomponents';

const deploys = [
  { time: '14:32', commit: 'a4f9c21', author: 'Ada Okafor', duration: '1m 42s' },
  { time: '13:58', commit: '9be07d3', author: 'Grace Lindqvist', duration: '58s' },
  { time: '12:17', commit: '51c8e90', author: 'Linus Marchetti', duration: '2m 07s' },
  { time: '11:03', commit: 'e2d4a6f', author: 'Ada Okafor', duration: '1m 31s' },
  { time: '09:45', commit: '7730bb8', author: 'Margaret Ito', duration: '3m 12s' },
  { time: '09:12', commit: 'c1f5e47', author: 'Grace Lindqvist', duration: '1m 05s' },
];

export default function Compact() {
  return (
    <Table density="compact" striped>
      <Table.Caption>Last six deploys to production, newest first.</Table.Caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Time</Table.HeaderCell>
          <Table.HeaderCell>Commit</Table.HeaderCell>
          <Table.HeaderCell>Author</Table.HeaderCell>
          <Table.HeaderCell align="end">Duration</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {deploys.map((deploy) => (
          <Table.Row key={deploy.commit}>
            <Table.Cell numeric align="start">
              {deploy.time}
            </Table.Cell>
            <Table.Cell>
              <code>{deploy.commit}</code>
            </Table.Cell>
            <Table.Cell>{deploy.author}</Table.Cell>
            <Table.Cell numeric>{deploy.duration}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
