import { useEffect, useState } from 'react';
import { Button, Progress } from 'neobrutalistcomponents';

export default function Live() {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const running = started && value < 100;

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setValue((v) => Math.min(100, v + 4)), 120);
    return () => clearInterval(timer);
  }, [running]);

  function start() {
    setValue(0);
    setStarted(true);
  }

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
      <Progress
        label={value >= 100 ? 'Invoices exported' : 'Exporting invoices'}
        value={value}
        variant={value >= 100 ? 'success' : 'primary'}
        showValue
        size="lg"
      />
      <div>
        <Button onClick={start} disabled={running}>
          {value >= 100 ? 'Export again' : running ? 'Exporting…' : 'Export invoices'}
        </Button>
      </div>
    </div>
  );
}
