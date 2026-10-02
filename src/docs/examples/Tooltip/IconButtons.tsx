import { Button, Tooltip } from 'neobrutalistcomponents';
import { Archive, Link2, Trash2 } from 'lucide-react';

export default function IconButtons() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Tooltip content="Copy link">
        <Button variant="secondary" leftIcon={<Link2 />} aria-label="Copy link" />
      </Tooltip>
      <Tooltip content="Archive project">
        <Button variant="secondary" leftIcon={<Archive />} aria-label="Archive project" />
      </Tooltip>
      <Tooltip content="Delete project">
        <Button variant="danger" leftIcon={<Trash2 />} aria-label="Delete project" />
      </Tooltip>
    </div>
  );
}
