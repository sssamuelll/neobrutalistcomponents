import { useState } from 'react';
import { Alert, Badge, Button, Card, Checkbox, Dialog, Input, Kbd, Progress, Radio, RadioGroup, Select, Switch, Table, Tabs, Textarea, Tooltip } from 'neobrutalistcomponents';
import type { CatalogEntry } from '../../study/catalog';
import { CodeBlock } from '../docs/CodeBlock';
import { KIND_TEXT, SCENE_TEXT, fill, useLang, useT } from '../i18n';
import { installCode } from '../install';
import { toHash } from '../router';
import { CATALOG } from '../study/data';
import { years } from '../study/format';
import { OPEN_THEME_SCENES, isPlaced } from '../study/rooms';
import { copyProps } from './copyLabels';
import { roomRows } from './works';

/** Links from a block to the pages of the components it shows. */
function Links({ components }: { components: readonly [name: string, slug: string][] }) {
  const lang = useLang();
  return (
    <Card.Content className="wall__links">
      {components.map(([name, slug]) => (
        <a key={slug} href={toHash(lang, `/components/${slug}`)}>
          {name}
          <span aria-hidden="true"> →</span>
        </a>
      ))}
    </Card.Content>
  );
}

function HangBlock({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <Card as="article" className="wall__block wall__block--hang">
      <Card.Header>
        <Card.Title as="h3">{t('wallHangTitle')}</Card.Title>
        <Card.Description>{t('wallHangBody')}</Card.Description>
      </Card.Header>
      <Card.Footer className="wall__actions">
        <Button variant="ghost">{t('wallNotNow')}</Button>
        <Button onClick={() => setOpen(true)}>{t('wallHang')}</Button>
      </Card.Footer>
      <Links components={[['Card', 'card'], ['Button', 'button'], ['Dialog', 'dialog']]} />
      <Dialog open={open} onOpenChange={setOpen} closeLabel={t('motionClose')}>
        <Dialog.Header>
          <Dialog.Title>{fill(t('wallDialogTitle'), { name: entry.name[lang] })}</Dialog.Title>
          <Dialog.Description>{t('wallDialogBody')}</Dialog.Description>
        </Dialog.Header>
        <Dialog.Content>
          <CodeBlock code={installCode(entry.id, entry.fonts.length > 0)} {...copyProps(t, 'TSX')} />
        </Dialog.Content>
        <Dialog.Footer>
          <Button onClick={() => setOpen(false)}>{t('wallDone')}</Button>
        </Dialog.Footer>
      </Dialog>
    </Card>
  );
}

function RoomBlock({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  const t = useT();
  const caption = entry.predatesStudy ? t('wallRoomsCaption') : fill(t('wallRoomCaption'), { room: SCENE_TEXT[entry.scene].name[lang] });
  return (
    <Card as="article" className="wall__block wall__block--room">
      <Card.Header>
        <Card.Title as="h3">{caption}</Card.Title>
      </Card.Header>
      <Card.Content>
        <Table density="compact">
          <Table.Caption className="site-visually-hidden">{caption}</Table.Caption>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>{t('colWork')}</Table.HeaderCell>
              <Table.HeaderCell className="wall__room-col">{t('colRoom')}</Table.HeaderCell>
              <Table.HeaderCell align="end">{t('colYear')}</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {roomRows(entry, CATALOG).map(({ entry: work, current }) => (
              <Table.Row key={work.id}>
                <Table.Cell>
                  <a href={toHash(lang, `/theme/${work.id}`)}>{work.name[lang]}</a>
                  {current ? (
                    <>
                      {' '}
                      <Badge size="sm" variant="primary">
                        {t('wallHere')}
                      </Badge>
                    </>
                  ) : null}
                </Table.Cell>
                <Table.Cell className="wall__room-col">{SCENE_TEXT[work.scene].name[lang]}</Table.Cell>
                <Table.Cell numeric>{years(work.reference.date)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card.Content>
      <Links components={[['Table', 'table'], ['Badge', 'badge']]} />
    </Card>
  );
}

function SettingsBlock({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  const t = useT();
  return (
    <Card as="article" className="wall__block wall__block--settings">
      <Card.Header>
        <Card.Title as="h3">{t('wallSettings')}</Card.Title>
      </Card.Header>
      <Card.Content>
        <Tabs defaultValue="room">
          <Tabs.List aria-label={t('wallTabs')}>
            <Tabs.Tab value="room">{t('colRoom')}</Tabs.Tab>
            <Tabs.Tab value="visit">{t('wallTabVisit')}</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="room" className="wall__panel">
            <Select label={t('colRoom')} defaultValue={isPlaced(entry.scene) ? entry.scene : OPEN_THEME_SCENES[0]}>
              {OPEN_THEME_SCENES.map((scene) => (
                <option key={scene} value={scene}>
                  {SCENE_TEXT[scene].name[lang]}
                </option>
              ))}
            </Select>
            <Switch label={t('wallGuided')} defaultChecked />
            <Checkbox label={t('wallShowSources')} defaultChecked />
          </Tabs.Panel>
          <Tabs.Panel value="visit" className="wall__panel">
            <RadioGroup label={t('wallPace')} defaultValue="normal">
              <Radio value="slow" label={t('wallPaceSlow')} />
              <Radio value="normal" label={t('wallPaceNormal')} />
              <Radio value="fast" label={t('wallPaceFast')} />
            </RadioGroup>
          </Tabs.Panel>
        </Tabs>
      </Card.Content>
      <Links components={[['Tabs', 'tabs'], ['Select', 'select'], ['Switch', 'switch'], ['Checkbox', 'checkbox'], ['RadioGroup', 'radio-group']]} />
    </Card>
  );
}

function StatusBlock({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  const t = useT();
  return (
    <Card as="article" className="wall__block wall__block--status">
      <Card.Header>
        <Card.Title as="h3">{t('wallStatus')}</Card.Title>
      </Card.Header>
      <Card.Content className="wall__stack">
        <Progress label={t('wallRestoration')} value={72} showValue />
        <Alert variant="info" title={t('wallAlertTitle')}>
          {t('wallAlertBody')}
        </Alert>
        <p className="wall__badges">
          {entry.predatesStudy ? null : <Badge variant="neutral">{years(entry.reference.date)}</Badge>}
          <Badge variant="accent">{SCENE_TEXT[entry.scene].name[lang]}</Badge>
          <Badge variant="info">{KIND_TEXT[entry.reference.kind][lang]}</Badge>
        </p>
      </Card.Content>
      <Links components={[['Progress', 'progress'], ['Alert', 'alert']]} />
    </Card>
  );
}

function GuestbookBlock() {
  const t = useT();
  return (
    <Card as="article" className="wall__block wall__block--guestbook">
      <Card.Header>
        <Card.Title as="h3">{t('wallGuestbook')}</Card.Title>
      </Card.Header>
      <Card.Content className="wall__stack">
        <Input label={t('wallName')} />
        <Textarea label={t('wallNote')} />
        <p className="wall__search">
          <Tooltip content={t('wallSearchHint')}>
            <Button variant="secondary">{t('search')}</Button>
          </Tooltip>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </p>
      </Card.Content>
      <Links components={[['Input', 'input'], ['Textarea', 'textarea'], ['Tooltip', 'tooltip'], ['Kbd', 'kbd']]} />
    </Card>
  );
}

/** Every component of the library, working, in the active theme, saying something about the gallery. */
export function ComponentWall({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  const t = useT();
  const heading = fill(t(entry.predatesStudy ? 'wallHouse' : 'wallWork'), { name: entry.name[lang] });
  return (
    <section className="wall" aria-labelledby="wall-title">
      <h2 className="site-h2 wall__title" id="wall-title">
        {heading}
      </h2>
      <div className="wall__grid">
        <HangBlock entry={entry} />
        <RoomBlock entry={entry} />
        <SettingsBlock entry={entry} />
        <StatusBlock entry={entry} />
        <GuestbookBlock />
      </div>
    </section>
  );
}
