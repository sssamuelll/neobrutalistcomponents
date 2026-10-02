import type { PropDoc } from '../../docs/types';

export function PropsTable({ props, caption }: { props: PropDoc[]; caption: string }) {
  if (props.length === 0) return null;
  return (
    <div className="site-props">
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name}>
              <th scope="row">
                <code>{p.name}</code>
                {p.required && <span className="site-props__required"> required</span>}
              </th>
              <td>
                <code>{p.type}</code>
              </td>
              <td>{p.default ? <code>{p.default}</code> : <span aria-label="none">—</span>}</td>
              <td>{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
