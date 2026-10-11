import { useSitePrefsContext } from '../prefsContext';
import { ENTRIES } from '../study/data';
import { ComponentWall } from '../home/ComponentWall';
import { Monument } from '../home/Monument';
import { WorkCard } from '../home/WorkCard';

/** The home page: the monument, then (in later tasks) the wall of components, the work's card and take-it. */
export function StudyHome() {
  const { prefs } = useSitePrefsContext();
  const entry = ENTRIES.get(prefs.theme) ?? ENTRIES.get('classic')!;
  return (
    <div className="monument-home">
      <Monument entry={entry} />
      <ComponentWall key={entry.id} entry={entry} />
      <WorkCard key={entry.id} entry={entry} />
    </div>
  );
}
