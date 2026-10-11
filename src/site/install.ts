import { PACKAGE } from '../docs/guide';

/** The shell command that installs the library. */
export const INSTALL_COMMAND = `npm install ${PACKAGE}`;

/** A theme's import lines and provider, as the theme page and the home show them. */
export const installCode = (id: string, fonts: boolean) => `import { NeoProvider } from 'neobrutalistcomponents';
import 'neobrutalistcomponents/styles.css';
import 'neobrutalistcomponents/themes/${id}.css';
import 'neobrutalistcomponents/themes/${id}.fonts.css'; // ${fonts ? 'optional: loads the theme’s fonts' : 'system fonts: nothing to load'}

export function App() {
  return <NeoProvider theme="${id}">{/* your app */}</NeoProvider>;
}`;
