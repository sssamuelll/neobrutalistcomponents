import { Select } from 'neobrutalistcomponents';

export default function Basic() {
  return (
    <div style={{ maxWidth: 360 }}>
      <Select
        label="Region"
        placeholder="Choose a region"
        description="Where your project's data is stored. You can move it later."
        required
      >
        <option value="fra1">Frankfurt (eu-central)</option>
        <option value="iad1">Washington, D.C. (us-east)</option>
        <option value="sin1">Singapore (ap-southeast)</option>
        <option value="syd1">Sydney (ap-southeast-2)</option>
      </Select>
    </div>
  );
}
