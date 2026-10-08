import { Alert, Badge, Button, Card, Checkbox, Input, Switch, Tabs } from 'neobrutalistcomponents';
import { useT } from '../i18n';

export function GalleryPiece() {
  const t = useT();
  return (
    <Card className="gallery-piece" aria-label={t('pieceWindow')}>
      <Card.Header>
        <Card.Title as="h3">{t('pieceWindow')}</Card.Title>
      </Card.Header>
      <Card.Content>
        <Tabs defaultValue="profile">
          <Tabs.List aria-label={t('pieceTabs')}>
            <Tabs.Tab value="profile">{t('pieceProfile')}</Tabs.Tab>
            <Tabs.Tab value="alerts">
              {t('pieceAlerts')} <Badge variant="danger" size="sm" style={{ marginLeft: 8 }}>3</Badge>
            </Tabs.Tab>
          </Tabs.List>
          
          <Tabs.Panel value="profile" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingTop: '1.5rem' }}>
            <Input label={t('pieceName')} defaultValue="Arturo" />
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Switch label={t('pieceOffline')} />
              <Switch label={t('pieceRemember')} defaultChecked />
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Checkbox label={t('pieceSync')} defaultChecked />
            </div>
          </Tabs.Panel>
          
          <Tabs.Panel value="alerts" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1.5rem' }}>
             <Alert variant="success" title={t('pieceSaved')} action={<Button size="sm" variant="ghost">{t('pieceNew')}</Button>}>
               {t('pieceSavedBody')}
             </Alert>
             <Alert variant="info" title="System update">
               Ready to install.
             </Alert>
          </Tabs.Panel>
        </Tabs>
      </Card.Content>
      <Card.Footer style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <Button variant="ghost">{t('pieceCancel')}</Button>
        <Button variant="primary">{t('pieceSave')}</Button>
      </Card.Footer>
    </Card>
  );
}
