import type { ReactNode } from "react";

/** Every sign component in this folder accepts exactly these props. */
export interface SignProps {
  /** Rendered edge length in px. */
  size?: number;
  className?: string;
}

/**
 * Official German traffic-sign colours (RAL-derived, as used by the StVO
 * catalogue). Keep every sign on this palette so the library reads as one set.
 */
export const SIGN_COLORS = {
  red: "#E2000F",
  blue: "#0055A4",
  autobahnBlue: "#003F88",
  yellow: "#F5C800",
  white: "#FFFFFF",
  black: "#1A1A1A",
  grey: "#7A7A7A",
  lightGrey: "#D5D5D5",
  green: "#009B3A",
  signalRed: "#E2000F",
  signalYellow: "#F2B600",
  signalGreen: "#00A651",
  asphalt: "#4A4A4A",
} as const;

const DEFAULT_SIZE = 80;

/** Shared SVG root: square viewBox, decorative by default. */
export function SignSvg({
  size = DEFAULT_SIZE,
  className,
  children,
  viewBox = "0 0 100 100",
}: SignProps & { children: ReactNode; viewBox?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** Upward triangle, red border, white field — Gefahrzeichen (danger). */
export function DangerShell({
  size,
  className,
  children,
}: SignProps & { children?: ReactNode }) {
  return (
    <SignSvg size={size} className={className}>
      <path
        d="M50 7 L96 88 H4 Z"
        fill={SIGN_COLORS.white}
        stroke={SIGN_COLORS.red}
        strokeWidth={9}
        strokeLinejoin="round"
      />
      <g>{children}</g>
    </SignSvg>
  );
}

/** Downward triangle, red border, white field — Vorfahrt gewähren (yield). */
export function YieldShell({
  size,
  className,
  children,
}: SignProps & { children?: ReactNode }) {
  return (
    <SignSvg size={size} className={className}>
      <path
        d="M4 12 H96 L50 93 Z"
        fill={SIGN_COLORS.white}
        stroke={SIGN_COLORS.red}
        strokeWidth={9}
        strokeLinejoin="round"
      />
      <g>{children}</g>
    </SignSvg>
  );
}

/** Round sign, red ring, white field — Verbotszeichen (prohibition). */
export function ProhibitionShell({
  size,
  className,
  children,
}: SignProps & { children?: ReactNode }) {
  return (
    <SignSvg size={size} className={className}>
      <circle cx={50} cy={50} r={45} fill={SIGN_COLORS.white} />
      <circle
        cx={50}
        cy={50}
        r={40}
        fill="none"
        stroke={SIGN_COLORS.red}
        strokeWidth={10}
      />
      <g>{children}</g>
    </SignSvg>
  );
}

/** Solid blue circle — Vorschriftzeichen (mandatory). */
export function MandatoryShell({
  size,
  className,
  children,
}: SignProps & { children?: ReactNode }) {
  return (
    <SignSvg size={size} className={className}>
      <circle cx={50} cy={50} r={45} fill={SIGN_COLORS.blue} />
      <g>{children}</g>
    </SignSvg>
  );
}

/** Yellow diamond — Vorfahrtstraße (priority road). */
export function DiamondShell({
  size,
  className,
  children,
}: SignProps & { children?: ReactNode }) {
  return (
    <SignSvg size={size} className={className}>
      <path d="M50 3 L97 50 L50 97 L3 50 Z" fill={SIGN_COLORS.white} />
      <path d="M50 14 L86 50 L50 86 L14 50 Z" fill={SIGN_COLORS.yellow} />
      <g>{children}</g>
    </SignSvg>
  );
}

/** Blue rectangle — Richtzeichen (information). */
export function InfoShell({
  size,
  className,
  children,
  fill = SIGN_COLORS.blue,
  rx = 6,
}: SignProps & { children?: ReactNode; fill?: string; rx?: number }) {
  return (
    <SignSvg size={size} className={className}>
      <rect x={6} y={14} width={88} height={72} rx={rx} fill={fill} />
      <g>{children}</g>
    </SignSvg>
  );
}

/** White square with a thin border — used by the narrow-passage priority signs. */
export function WhiteSquareShell({
  size,
  className,
  children,
}: SignProps & { children?: ReactNode }) {
  return (
    <SignSvg size={size} className={className}>
      <rect
        x={8}
        y={8}
        width={84}
        height={84}
        rx={5}
        fill={SIGN_COLORS.white}
        stroke={SIGN_COLORS.black}
        strokeWidth={3}
      />
      <g>{children}</g>
    </SignSvg>
  );
}

/** White rectangle with a black border — Zusatzzeichen (supplementary plate). */
export function PlateShell({
  size,
  className,
  children,
}: SignProps & { children?: ReactNode }) {
  return (
    <SignSvg size={size} className={className}>
      <rect
        x={5}
        y={28}
        width={90}
        height={44}
        rx={3}
        fill={SIGN_COLORS.white}
        stroke={SIGN_COLORS.black}
        strokeWidth={4}
      />
      <g>{children}</g>
    </SignSvg>
  );
}

/** The red diagonal slash used by "end of restriction" signs. */
export function EndSlash({ count = 1 }: { count?: number }) {
  if (count === 1) {
    return (
      <line
        x1={22}
        y1={78}
        x2={78}
        y2={22}
        stroke={SIGN_COLORS.red}
        strokeWidth={9}
        strokeLinecap="round"
      />
    );
  }
  return (
    <g>
      {[-10, 0, 10].map((o) => (
        <line
          key={o}
          x1={20 + o}
          y1={80}
          x2={80 + o}
          y2={20}
          stroke={SIGN_COLORS.grey}
          strokeWidth={5}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

/** Reusable glyphs shared by several signs. */
export const Glyphs = {
  /** Side view of a car, centred on (cx, cy). */
  car: (cx: number, cy: number, s: number, fill: string) => (
    <g transform={`translate(${cx} ${cy}) scale(${s})`} fill={fill}>
      <path d="M-20 4 L-17 -4 Q-15 -8 -10 -8 H8 Q13 -8 16 -4 L20 4 Q21 6 19 8 H-19 Q-21 6 -20 4 Z" />
      <circle cx={-12} cy={9} r={3.5} />
      <circle cx={12} cy={9} r={3.5} />
    </g>
  ),
  /** Side view of a lorry (tractor + box body). */
  truck: (cx: number, cy: number, s: number, fill: string) => (
    <g transform={`translate(${cx} ${cy}) scale(${s})`} fill={fill}>
      <rect x={-22} y={-10} width={24} height={16} rx={1.5} />
      <path d="M4 -4 H14 L20 2 V6 H4 Z" />
      <circle cx={-14} cy={8} r={3.6} />
      <circle cx={13} cy={8} r={3.6} />
    </g>
  ),
  /** Bicycle seen from the side. */
  bicycle: (cx: number, cy: number, s: number, stroke: string) => (
    <g
      transform={`translate(${cx} ${cy}) scale(${s})`}
      stroke={stroke}
      strokeWidth={2.6}
      fill="none"
      strokeLinecap="round"
    >
      <circle cx={-12} cy={6} r={7.5} />
      <circle cx={12} cy={6} r={7.5} />
      <path d="M-12 6 L-2 -6 H8 L12 6 M-2 -6 L4 6 H-12 M8 -6 H14" />
    </g>
  ),
  /** Walking pedestrian. */
  pedestrian: (cx: number, cy: number, s: number, fill: string) => (
    <g transform={`translate(${cx} ${cy}) scale(${s})`} fill={fill}>
      <circle cx={0} cy={-15} r={4.4} />
      <path d="M-1.5 -10 Q-7 -8 -8 -1 L-5 0 L-3.5 -5 V3 L-8 15 H-4 L0 5 L4 15 H8 L4 2 V-4 L7 0 L9 -2 Q7 -9 1.5 -10 Z" />
    </g>
  ),
  /** Motorcycle seen from the side. */
  motorcycle: (cx: number, cy: number, s: number, fill: string) => (
    <g transform={`translate(${cx} ${cy}) scale(${s})`} fill={fill}>
      <circle cx={-13} cy={7} r={6} />
      <circle cx={13} cy={7} r={6} />
      <path
        d="M-13 7 L-4 -2 H4 L10 2 L13 7 M-4 -2 L-2 -8 H4 M8 -8 H14 L16 -5"
        stroke={fill}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      <rect x={-6} y={-4} width={14} height={4} rx={1.5} />
    </g>
  ),
};
