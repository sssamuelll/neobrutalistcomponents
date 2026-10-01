import { Button, Input, Select } from 'neobrutalistcomponents';

export default function WithInput() {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 560 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', gap: 12 }}>
          <div style={{ flex: '1 1 200px' }}>
            <Input size={size} label="Teammate email" type="email" placeholder="ada@studio.dev" />
          </div>
          <div style={{ flex: '0 1 140px' }}>
            <Select size={size} label="Role" defaultValue="editor">
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </Select>
          </div>
          <Button size={size}>Send invite</Button>
        </div>
      ))}
    </div>
  );
}
