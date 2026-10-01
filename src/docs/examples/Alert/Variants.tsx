import { Alert } from 'neobrutalistcomponents';

export default function Variants() {
  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 560 }}>
      <Alert variant="info" title="Billing updated">
        Your plan switches to annual billing on the next invoice, October 1.
      </Alert>
      <Alert variant="success" title="Deploy finished in 42s">
        web-app is live on production. 3 of 3 health checks passed.
      </Alert>
      <Alert variant="warning" title="Your trial ends in 3 days">
        Add a payment method to keep your projects and team seats.
      </Alert>
      <Alert variant="danger" title="Payment failed">
        Your card ending in 4242 was declined. Update it to avoid a service pause.
      </Alert>
    </div>
  );
}
