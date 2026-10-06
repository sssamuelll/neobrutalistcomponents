import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { Lang } from '../../study/types';
import { LangContext } from '../i18n';
import { Example } from './Example';
import { getBlock, getExample } from './registry';
import type { Source } from './registry';

const show = (lang: Lang, source: Source | undefined) => {
  if (!source) throw new Error('missing example');
  return render(
    <LangContext value={lang}>
      <Example title="Example" source={source} />
    </LangContext>,
  );
};

describe('Example', () => {
  it.each<Lang>(['es', 'en'])('links to the site’s pages in the reader’s language (%s)', (lang) => {
    const { unmount } = show(lang, getExample('Button', 'AsLink'));
    expect(screen.getByRole('link', { name: 'Read the setup guide' })).toHaveAttribute('href', `#/${lang}/start`);
    expect(screen.getByRole('link', { name: 'View on GitHub' })).toHaveAttribute('href', 'https://github.com/sssamuelll/neobrutalistcomponents');
    unmount();

    show(lang, getExample('Card', 'Variants'));
    expect(screen.getByRole('link', { name: 'Interactive' })).toHaveAttribute('href', `#/${lang}/components/card`);
  });

  it('localizes the links of blocks and of lists of links too', () => {
    const { unmount } = show('es', getBlock('SignIn'));
    expect(screen.getByRole('link', { name: 'Reset password' })).toHaveAttribute('href', '#/es/blocks');
    unmount();

    show('es', getExample('Card', 'Interactive'));
    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(['#/es/projects/acme-relaunch', '#/es/projects/atlas-api']);
  });

  it('keeps the code as it is meant to be pasted: without a language', async () => {
    const { container } = show('es', getExample('Button', 'AsLink'));
    await userEvent.click(screen.getByRole('button', { name: 'Show code' }));
    expect(container.querySelector('pre')?.textContent).toContain('<a href="#/start">Read the setup guide</a>');
  });
});
