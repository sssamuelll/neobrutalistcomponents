import type { UIKey } from '../i18n';

/** A CodeBlock's label and its copy button's names, in the page's language. */
export const copyProps = (t: (key: UIKey) => string, label: string) => ({
  label,
  copyLabel: `${t('copyCode')} ${label}`,
  copiedLabel: t('copied'),
  selectLabel: t('selectAndCopy'),
});
