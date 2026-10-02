import { Input } from 'neobrutalistcomponents';
import { AtSign, Lock, Search } from 'lucide-react';

export default function WithIcons() {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <Input label="Search" type="search" placeholder="Find a repository" leftIcon={<Search />} />
      <Input label="Handle" placeholder="samuel" leftIcon={<AtSign />} />
      <Input label="Password" type="password" defaultValue="hunter2hunter2" rightIcon={<Lock />} />
    </div>
  );
}
