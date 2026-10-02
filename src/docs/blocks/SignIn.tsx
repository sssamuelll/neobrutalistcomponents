import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Card, Checkbox, Input } from 'neobrutalistcomponents';
import { ArrowRight, Lock, Mail } from 'lucide-react';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const emailError = submitted && !EMAIL.test(email) ? 'Enter an email address like ada@northwind.dev.' : undefined;
  const passwordError = submitted && password.length < 8 ? 'Passwords have at least 8 characters.' : undefined;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (!EMAIL.test(email) || password.length < 8) return;
    setSigningIn(true);
    setTimeout(() => setSigningIn(false), 1400);
  }

  return (
    <div style={{ display: 'grid', placeItems: 'center', padding: 'var(--nbc-space-2xl) 0' }}>
      <Card as="section" variant="elevated" aria-labelledby="sign-in-title" style={{ inlineSize: '100%', maxInlineSize: 420 }}>
        <Card.Header>
          <Card.Title as="h2" id="sign-in-title">
            Sign in to Northwind
          </Card.Title>
          <Card.Description>Use your work email. You stay signed in on this device for 30 days.</Card.Description>
        </Card.Header>
        <Card.Content>
          <form id="sign-in" noValidate onSubmit={onSubmit} style={{ display: 'grid', gap: 'var(--nbc-space-lg)' }}>
            <Input
              label="Work email"
              type="email"
              autoComplete="email"
              placeholder="ada@northwind.dev"
              leftIcon={<Mail />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              required
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              leftIcon={<Lock />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              required
            />
            <Checkbox label="Keep me signed in" defaultChecked />
          </form>
        </Card.Content>
        <Card.Footer>
          <Button asChild variant="ghost">
            <a href="#/blocks">Reset password</a>
          </Button>
          <Button type="submit" form="sign-in" loading={signingIn} rightIcon={<ArrowRight />}>
            Sign in
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
