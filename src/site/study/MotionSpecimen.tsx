import { useState } from 'react';
import { Button, Dialog, Progress, Switch, Tooltip } from 'neobrutalistcomponents';
import { useT } from '../i18n';

/** The components a motion file can animate, so a visitor can set each motion off. Rendered inside the theme. */
export function MotionSpecimen() {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <div className="site-themepage__motion">
      <p className="site-p site-themepage__lettering">{t('motionTry')}</p>
      <div className="site-themepage__motion-row">
        <Tooltip content={t('motionHint')}>
          <Button variant="primary">{t('motionPress')}</Button>
        </Tooltip>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          {t('motionOpen')}
        </Button>
        <Switch label={t('motionSwitch')} />
      </div>
      <Progress label={t('motionLoading')} />
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Header>
          <Dialog.Title>{t('motionDialogTitle')}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Content>
          <p>{t('motionDialogBody')}</p>
        </Dialog.Content>
        <Dialog.Footer>
          <Button onClick={() => setOpen(false)}>{t('motionClose')}</Button>
        </Dialog.Footer>
      </Dialog>
    </div>
  );
}
