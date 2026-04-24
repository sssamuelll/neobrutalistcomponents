import { useState } from 'react';
import { Button, Card, Input, NeoProvider } from '../../lib';
import type { NeoTheme } from '../../lib';
import { Icon } from './Icon';

export function HeroTile({ themeId }: { themeId: NeoTheme }) {
  const [email, setEmail] = useState('');
  return (
    <NeoProvider theme={themeId} className="hero-tile" data-theme-wrap={themeId}>
      <div className="hero-tile__bg" />
      <div className="hero-tile__inner">
        <Card variant="elevated">
          <Card.Header>
            <Card.Title>Ship the brief</Card.Title>
            <Card.Description>Four flavors. One switch.</Card.Description>
          </Card.Header>
          <Card.Content>
            <Input
              size="md"
              label="Work email"
              helperText="We'll send the invite within 60 seconds."
              leftIcon={<Icon.Mail />}
              placeholder="ada@lovelace.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Card.Content>
          <Card.Footer>
            <Button variant="ghost" size="md">
              Cancel
            </Button>
            <Button variant="primary" size="md" rightIcon={<Icon.Arrow />}>
              Get started
            </Button>
          </Card.Footer>
        </Card>
      </div>
    </NeoProvider>
  );
}
