import { Progress } from 'neobrutalistcomponents';

export default function Determinate() {
  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 420 }}>
      <Progress label="Uploading q3-invoices.zip" value={42} showValue />
      <Progress label="Importing 3 of 4 customer files" value={3} max={4} showValue />
      <Progress aria-label="Disk space used" value={68} size="sm" />
    </div>
  );
}
