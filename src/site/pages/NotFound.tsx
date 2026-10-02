import { Button } from 'neobrutalistcomponents';

export function NotFound() {
  return (
    <div className="site-page site-notfound">
      <h1 className="site-h1">Nothing at this address</h1>
      <p className="site-lead">The page may have moved when the docs were rebuilt for v1.</p>
      <Button asChild>
        <a href="#/components">Browse components</a>
      </Button>
    </div>
  );
}
