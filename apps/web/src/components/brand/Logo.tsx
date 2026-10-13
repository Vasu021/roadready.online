/**
 * The RoadReady mark: the yellow Vorfahrtstraße diamond — the one shape that is
 * unmistakably German road signage — with a route line running through it.
 *
 * Three other directions were drawn for comparison and are exported below, so
 * the choice can be revisited against the real pages rather than a description.
 */

export interface LogoProps {
  size?: number;
  className?: string;
}

const YELLOW = "#F5C800";
const INK = "#1A1A1A";
const WHITE = "#FFFFFF";

/** The chosen mark. Readable down to 16 px. */
export function LogoMark({ size = 28, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="RoadReady"
    >
      <path d="M32 2 L62 32 L32 62 L2 32 Z" fill={WHITE} />
      <path d="M32 8 L56 32 L32 56 L8 32 Z" fill={YELLOW} />
      {/* The route: a road running through the diamond, narrowing to a horizon. */}
      <path d="M25 50 L39 50 L35 26 L29 26 Z" fill={INK} />
      <path d="M31 46 h2 v-5 h-2 z M31.6 38 h1.2 v-4 h-1.2 z" fill={YELLOW} />
      <circle cx={32} cy={21} r={3.6} fill={INK} />
    </svg>
  );
}

/** Wordmark lockup used in the header and on the landing page. */
export function Logo({
  size = 28,
  compact = false,
}: LogoProps & { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <LogoMark size={size} />
      {!compact && (
        <span className="text-lg font-bold tracking-tight text-ink">
          Road<span className="text-accent">Ready</span>
        </span>
      )}
    </span>
  );
}

/** Monochrome variant for the chalk themes, where full colour fights the board. */
export function LogoMono({ size = 28, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="RoadReady"
    >
      <path
        d="M32 4 L60 32 L32 60 L4 32 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <path d="M25 48 L39 48 L35 26 L29 26 Z" fill="currentColor" />
      <circle cx={32} cy={19} r={3.4} fill="currentColor" />
    </svg>
  );
}

// ── Alternatives, kept for comparison ───────────────────────────────────────

/** Direction B: the R set inside a danger triangle. */
export function LogoTriangle({ size = 28, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M32 4 L61 56 H3 Z"
        fill={WHITE}
        stroke="#E2000F"
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <text
        x={32}
        y={48}
        textAnchor="middle"
        fontSize={28}
        fontWeight={800}
        fill={INK}
        fontFamily="system-ui, sans-serif"
      >
        R
      </text>
    </svg>
  );
}

/** Direction C: the road ahead, narrowing to a horizon. */
export function LogoRoad({ size = 28, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
    >
      <rect width={64} height={64} rx={14} fill="#0F172A" />
      <path d="M18 56 L46 56 L38 20 L26 20 Z" fill="#334155" />
      <path
        d="M31 50 h2 v-6 h-2 z M31.5 40 h1 v-5 h-1 z M31.8 31 h0.6 v-4 h-0.6 z"
        fill="#F8FAFC"
      />
      <circle cx={32} cy={16} r={4} fill="#3B82F6" />
    </svg>
  );
}

/** Direction D: a green light in a rounded housing. */
export function LogoGreenLight({ size = 28, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
    >
      <rect x={18} y={4} width={28} height={56} rx={10} fill="#111827" />
      <circle cx={32} cy={17} r={7} fill="#3F2020" />
      <circle cx={32} cy={32} r={7} fill="#3D3415" />
      <circle cx={32} cy={47} r={8} fill="#00A651" />
    </svg>
  );
}
