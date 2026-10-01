import { Switch } from 'neobrutalistcomponents';

export default function Basic() {
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <Switch label="Deploy previews for every pull request" defaultChecked />
      <Switch label="Post build status to Slack" />
      <Switch label="Auto-promote green builds to production" disabled />
    </div>
  );
}
