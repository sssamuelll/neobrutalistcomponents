import type { ComponentMeta } from '../types';

export const TableMeta: ComponentMeta = {
  name: 'Table',
  slug: 'table',
  group: 'Display',
  summary:
    'A styled data table with native table semantics: a scroll wrapper, two densities, optional stripes, and alignment helpers for numeric columns.',
  whenToUse: [
    'Compare many records across the same attributes: invoices, deploys, members, usage by project.',
    'Numbers that readers scan down a column: amounts, counts, durations (use numeric cells).',
    'Anything a user might sort, filter or paste into a spreadsheet.',
  ],
  whenNotToUse: [
    'Page layout — use CSS grid or flexbox; a table announces itself to screen readers as data.',
    'A handful of label/value pairs — use a description list or a Card.',
    'One row per object with rich content and actions — a list of Cards reads better on small screens.',
  ],
  extends: "ComponentProps<'table'>",
  props: [
    {
      name: 'density',
      type: "'compact' | 'comfortable'",
      default: "'comfortable'",
      description: 'Row block size: comfortable is 48px, compact is 36px.',
    },
    {
      name: 'striped',
      type: 'boolean',
      default: 'false',
      description: 'Tint every second body row. Helps the eye follow wide rows.',
    },
  ],
  subcomponents: [
    { name: 'Table.Caption', element: 'caption', description: 'Names the table. Rendered below the rows, as a muted note.' },
    { name: 'Table.Head', element: 'thead', description: 'Column headers. Holds one Table.Row of Table.HeaderCell.' },
    { name: 'Table.Body', element: 'tbody', description: 'The data rows. Rows highlight on hover; with striped, every second row is tinted.' },
    { name: 'Table.Foot', element: 'tfoot', description: 'Totals or summary rows, set off by a rule above.' },
    { name: 'Table.Row', element: 'tr', description: 'One row, in the head, body or foot.' },
    {
      name: 'Table.HeaderCell',
      element: 'th',
      description:
        'A header cell. scope defaults to col; use scope="row" for the first cell of a body row to make it a row header.',
      propsInterface: 'TableHeaderCellProps',
      props: [
        {
          name: 'align',
          type: "'start' | 'center' | 'end'",
          description: 'Text alignment. Match the alignment of the cells below, e.g. end over a numeric column.',
        },
      ],
    },
    {
      name: 'Table.Cell',
      element: 'td',
      description: 'A data cell. Pass colSpan for an empty-state or summary row that spans every column.',
      propsInterface: 'TableCellProps',
      props: [
        {
          name: 'align',
          type: "'start' | 'center' | 'end'",
          description: 'Text alignment. Overrides the end alignment that numeric implies.',
        },
        {
          name: 'numeric',
          type: 'boolean',
          default: 'false',
          description: 'Tabular numerals, aligned to the end. Use for amounts, counts and durations.',
        },
      ],
    },
  ],
  classes: [
    'nbc-table',
    'nbc-table--compact',
    'nbc-table--striped',
    'nbc-table__table',
    'nbc-table__caption',
    'nbc-table__head',
    'nbc-table__body',
    'nbc-table__foot',
    'nbc-table__row',
    'nbc-table__header-cell',
    'nbc-table__header-cell--start',
    'nbc-table__header-cell--center',
    'nbc-table__header-cell--end',
    'nbc-table__cell',
    'nbc-table__cell--numeric',
    'nbc-table__cell--start',
    'nbc-table__cell--center',
    'nbc-table__cell--end',
  ],
  accessibility: [
    'Renders a real <table> with <caption>, <thead>, <tbody> and <tfoot>, so screen readers announce the size, the headers and the position in the grid without any ARIA.',
    'Table.Caption is the table name. Always include one; it also tells sighted users what they are looking at.',
    'Table.HeaderCell sets scope="col" by default; give the first cell of each body row scope="row" so every value is announced with its row and column.',
    'Wide tables scroll horizontally inside the wrapper, which browsers make keyboard-focusable; the wrapper shows the focus ring.',
    'Do not remove native table semantics with display or role overrides, and do not use a table for layout.',
    'Hover and stripes are decoration only. In forced-colors mode rows are separated by lines and the hovered row is outlined.',
  ],
  rules: [
    'Every table has a caption and one header row of Table.HeaderCell.',
    'Align numbers to the end: Table.Cell numeric in the body, Table.HeaderCell align="end" in the header, so digits line up and the header sits over them.',
    'Keep one unit per column; put the unit in the header or the caption, not in every cell.',
    'Use compact for logs and dense admin lists, comfortable for tables people read (billing, plans).',
    'Use striped for wide tables with many columns; skip it when rows are short or already separated by badges.',
    'An empty table keeps its header and shows one row with a spanning cell: say what is missing and offer the next action.',
  ],
  examples: [
    { file: 'Invoices', title: 'Invoices', description: 'Row headers, status badges and a numeric amount column under a caption.' },
    { file: 'Compact', title: 'Compact and striped', description: 'A deploy log: tabular numerals, monospace commits, 36px rows.' },
    { file: 'Empty', title: 'Empty state', description: 'One spanning row that explains the gap and offers the next action.' },
    { file: 'Totals', title: 'Totals', description: 'A foot row sums the numeric columns; row headers name each project.' },
  ],
};
