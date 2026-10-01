import { Input } from 'neobrutalistcomponents';

export default function Basic() {
  return (
    <div style={{ maxWidth: 360 }}>
      <Input label="Work email" type="email" placeholder="ada@studio.dev" description="We send the invite here." required />
    </div>
  );
}
