import { Tabs } from 'neobrutalistcomponents';

export default function Basic() {
  return (
    <Tabs defaultValue="overview">
      <Tabs.List aria-label="Project sections">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="deployments">Deployments</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Atlas API is healthy. Last deploy finished 12 minutes ago on main.</Tabs.Panel>
      <Tabs.Panel value="deployments">3 deployments this week. The most recent one took 1m 42s.</Tabs.Panel>
      <Tabs.Panel value="settings">Rename the project, rotate its API key or transfer ownership.</Tabs.Panel>
    </Tabs>
  );
}
