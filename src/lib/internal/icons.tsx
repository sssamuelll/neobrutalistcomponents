import type { SVGProps } from 'react';

/** Internal glyphs. Square caps, 2.5 stroke, 1em box, hidden from AT. */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.5,
  strokeLinecap: 'square',
  strokeLinejoin: 'miter',
  'aria-hidden': true,
  focusable: false,
} as const;

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12.5l5 5L19.5 7" />
    </svg>
  );
}

export function DashIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 12h12" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.5" />
    </svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l3 3 5-6" />
    </svg>
  );
}

export function AlertTriangleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5L2.5 20.5h19L12 3.5z" />
      <path d="M12 10v4.5M12 17.5v.5" />
    </svg>
  );
}

export function AlertOctagonIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 2.5h8L21.5 8v8L16 21.5H8L2.5 16V8z" />
      <path d="M12 7.5v6M12 16.5v.5" />
    </svg>
  );
}
