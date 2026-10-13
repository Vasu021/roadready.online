import type { ReactNode } from "react";

/** Centred loading spinner. */
export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-blue-500" />
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  );
}

/** The standard surface used across the app. */
export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  return (
    <Tag
      className={`rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm ${className}`}
    >
      {children}
    </Tag>
  );
}

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "premium";

const TONES: Record<Tone, string> = {
  neutral: "bg-white/10 text-gray-300",
  success: "bg-green-500/20 text-green-400",
  warning: "bg-yellow-500/20 text-yellow-300",
  danger: "bg-red-500/20 text-red-400",
  info: "bg-blue-500/20 text-blue-300",
  premium: "bg-amber-400/20 text-amber-300",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  max,
  tone = "info",
  className = "",
}: {
  value: number;
  max: number;
  tone?: Tone;
  className?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const fill =
    tone === "success"
      ? "bg-green-500"
      : tone === "danger"
        ? "bg-red-500"
        : tone === "warning"
          ? "bg-yellow-500"
          : "bg-blue-500";

  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-white/10 ${className}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={`h-full rounded-full ${fill} transition-[width] duration-500 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/** Circular score indicator used on results screens. */
export function ScoreRing({
  value,
  max,
  size = 132,
  passed,
}: {
  value: number;
  max: number;
  size?: number;
  passed: boolean;
}) {
  const pct = max > 0 ? value / max : 0;
  const r = size / 2 - 9;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={9}
          className="text-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={9}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          className={`transition-[stroke-dashoffset] duration-1000 ease-out ${
            passed ? "text-green-500" : "text-red-500"
          }`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tabular-nums text-white">
          {Math.round(pct * 100)}%
        </span>
        <span className="text-xs text-gray-400">
          {value} / {max}
        </span>
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: string;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <Card className="flex flex-col items-center px-8 py-14 text-center">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-400">
        {body}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
}

/** Inline error strip for failed loads. */
export function ErrorNote({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4"
    >
      <p className="text-sm text-red-300">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg border border-red-400/40 px-3 py-1.5 text-xs font-medium text-red-200 transition hover:bg-red-500/20"
        >
          Try again
        </button>
      )}
    </div>
  );
}

/** Soft background glows shared by every page. */
export function PageBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute -bottom-52 -right-32 h-[30rem] w-[30rem] rounded-full bg-indigo-600/10 blur-3xl" />
    </div>
  );
}
