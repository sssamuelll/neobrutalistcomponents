import { Badge } from 'neobrutalistcomponents';
import { AlertTriangle, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function WithIcons() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
      <Badge variant="neutral">
        <Clock aria-hidden="true" />
        Queued
      </Badge>
      <Badge variant="success">
        <CheckCircle2 aria-hidden="true" />
        Deployed
      </Badge>
      <Badge variant="warning">
        <AlertTriangle aria-hidden="true" />
        Slow build
      </Badge>
      <Badge variant="danger">
        <XCircle aria-hidden="true" />
        Build failed
      </Badge>
    </div>
  );
}
