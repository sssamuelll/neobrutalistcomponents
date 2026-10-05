import { NEO_THEMES, THEME_INFO } from 'neobrutalistcomponents';
import { COMPONENTS } from '../../docs/meta';
import { GLOBAL_RULES, THEME_GUIDE, pageUrl } from '../../docs/guide';
import { CodeBlock } from '../docs/CodeBlock';
import { TableScroll } from '../docs/TableScroll';

const SKILL_CODE = `# Claude Code (or any agent that reads skills)
mkdir -p ~/.claude/skills
cp -R node_modules/neobrutalistcomponents/skills/neobrutalist-ui ~/.claude/skills/`;

export function Agents() {
  const sample = [
    '# neobrutalistcomponents',
    '',
    '> Brutalist React components. Five themes, light and dark, one token contract.',
    '',
    '## Forms',
    '',
    ...COMPONENTS.filter((c) => c.group === 'Forms')
      .slice(0, 3)
      .map((c) => `- [${c.name}](${pageUrl(`/components/${c.slug}`)}): ${c.summary}`),
    '…',
  ].join('\n');

  return (
    <div className="site-page site-prose">
      <header className="site-page__head">
        <h1 className="site-h1">For agents</h1>
        <p className="site-lead">
          Determinism is the point: the same request should produce the same interface. The library is documented in a
          form models read well, generated from the same metadata this site renders — it cannot drift from the code.
        </p>
      </header>

      <section aria-labelledby="llms">
        <h2 className="site-h2" id="llms">
          llms.txt
        </h2>
        <p className="site-p">
          <a href="llms.txt">llms.txt</a> is the index; <a href="llms-full.txt">llms-full.txt</a> holds every component,
          prop, rule and example source in one file. Both also ship inside the npm package.
        </p>
        <CodeBlock code={sample} label="llms.txt" />
      </section>

      <section aria-labelledby="skill">
        <h2 className="site-h2" id="skill">
          The skill
        </h2>
        <p className="site-p">
          <code>skills/neobrutalist-ui/SKILL.md</code> teaches an agent when to reach for each component, how to pick a
          theme and the composition rules below. Copy it into your agent's skills folder.
        </p>
        <CodeBlock code={SKILL_CODE} label="Shell" />
      </section>

      <section aria-labelledby="rules">
        <h2 className="site-h2" id="rules">
          Composition rules
        </h2>
        <ul className="site-list">
          {GLOBAL_RULES.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="choose">
        <h2 className="site-h2" id="choose">
          Choosing a theme
        </h2>
        <TableScroll label={'Which theme fits which product'}>
          <table>
            <caption>Which theme fits which product</caption>
            <thead>
              <tr>
                <th scope="col">Theme</th>
                <th scope="col">Best for</th>
                <th scope="col">Avoid for</th>
              </tr>
            </thead>
            <tbody>
              {NEO_THEMES.map((id) => (
                <tr key={id}>
                  <th scope="row">{THEME_INFO[id].name}</th>
                  <td>{THEME_GUIDE[id].bestFor}</td>
                  <td>{THEME_GUIDE[id].avoid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableScroll>
      </section>
    </div>
  );
}
