import { Button, Card, Checkbox, Input, Select } from 'neobrutalistcomponents';
import { ArrowRight } from 'lucide-react';

/** A compact, real composition rendered inside each theme band. */
export function ThemeSampler() {
  return (
    <div className="site-sampler">
      <Card variant="elevated" className="site-sampler__card">
        <Card.Header>
          <Card.Title>Ship acme-web</Card.Title>
          <Card.Description>Production, us-east. Last deploy 2 hours ago.</Card.Description>
        </Card.Header>
        <Card.Content className="site-sampler__form">
          <Input label="Commit" defaultValue="a41f9c2" description="Short SHA or branch name." />
          <Select label="Region" defaultValue="use1">
            <option value="use1">us-east-1</option>
            <option value="euw1">eu-west-1</option>
            <option value="aps1">ap-south-1</option>
          </Select>
          <Checkbox label="Run smoke tests after deploy" defaultChecked />
        </Card.Content>
        <Card.Footer>
          <Button variant="ghost">Cancel</Button>
          <Button rightIcon={<ArrowRight />}>Deploy</Button>
        </Card.Footer>
      </Card>
      <div className="site-sampler__buttons">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    </div>
  );
}
