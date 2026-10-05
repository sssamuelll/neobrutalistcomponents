import type { Source } from '../../study/types';

/** Numbered sources; the numbers are the [n] markers in the text above. */
export function SourceList({ sources }: { sources: readonly Source[] }) {
  return (
    <ol className="study-sources">
      {sources.map((source) => (
        <li key={source.url}>
          <a href={source.url} target="_blank" rel="noreferrer">
            {source.title}
          </a>
          {source.publisher ? `, ${source.publisher}` : ''}
          {source.year ? ` (${source.year})` : ''}
        </li>
      ))}
    </ol>
  );
}
