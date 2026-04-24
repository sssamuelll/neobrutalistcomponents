/* Minimal inline SVGs used by the site showcase. Not part of the library. */
type Props = { size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.5,
  strokeLinecap: 'square' as const,
  strokeLinejoin: 'miter' as const,
  'aria-hidden': true,
});

export const Icon = {
  Mail: ({ size = 16 }: Props) => (
    <svg {...base(size)}>
      <rect x="3" y="5" width="18" height="14" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  Lock: ({ size = 16 }: Props) => (
    <svg {...base(size)}>
      <rect x="5" y="11" width="14" height="10" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  ),
  Eye: ({ size = 16 }: Props) => (
    <svg {...base(size)}>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Hash: ({ size = 16 }: Props) => (
    <svg {...base(size)}>
      <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" />
    </svg>
  ),
  Search: ({ size = 16 }: Props) => (
    <svg {...base(size)}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  ),
  Plus: ({ size = 16 }: Props) => (
    <svg {...base(size)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Arrow: ({ size = 16 }: Props) => (
    <svg {...base(size)}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  ),
};
