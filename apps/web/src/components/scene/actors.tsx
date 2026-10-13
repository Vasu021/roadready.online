import type { ActorKind } from "@roadready/shared";
import { SURFACE } from "./geometry";

/** Body colours by tone; "you" always gets the blue so the learner is obvious. */
export const TONES = {
  neutral: { body: "#C8CCD2", glass: "#7E8894", trim: "#9AA1AA" },
  accent: { body: "#D8604A", glass: "#8E4034", trim: "#B04C3C" },
  warn: { body: "#E0B83C", glass: "#A08528", trim: "#C29E30" },
  danger: { body: "#D23A34", glass: "#8E2A26", trim: "#AE302B" },
  you: { body: "#3B82F6", glass: "#1D4FA8", trim: "#2563EB" },
} as const;

export type Tone = keyof typeof TONES;

/**
 * Top-down vehicles and people, drawn around their own centre so the renderer
 * can place and rotate them from a slot without extra maths.
 */
export function Actor({ kind, tone }: { kind: ActorKind; tone: Tone }) {
  const c = TONES[tone];

  switch (kind) {
    case "truck":
      return (
        <g>
          <rect x={-11} y={-26} width={22} height={34} rx={2} fill="#D7DAE0" />
          <rect x={-11} y={8} width={22} height={18} rx={3} fill={c.body} />
          <rect x={-8} y={11} width={16} height={7} rx={1.5} fill={c.glass} />
          <rect x={-12.5} y={-20} width={3} height={8} fill="#2A2E33" />
          <rect x={9.5} y={-20} width={3} height={8} fill="#2A2E33" />
        </g>
      );

    case "bus":
      return (
        <g>
          <rect x={-11} y={-28} width={22} height={56} rx={4} fill={c.body} />
          <rect x={-8} y={20} width={16} height={6} rx={1.5} fill={c.glass} />
          <rect x={-8} y={-26} width={16} height={5} rx={1.5} fill={c.glass} />
          <rect
            x={9}
            y={-14}
            width={2.5}
            height={24}
            fill={c.glass}
            opacity={0.8}
          />
        </g>
      );

    case "tram":
      return (
        <g>
          <rect x={-10} y={-34} width={20} height={68} rx={5} fill="#E8C44A" />
          <rect x={-7.5} y={26} width={15} height={6} rx={1.5} fill="#6B5A20" />
          <rect
            x={-7.5}
            y={-32}
            width={15}
            height={6}
            rx={1.5}
            fill="#6B5A20"
          />
          <rect x={-10} y={-4} width={20} height={2} fill="#B99B33" />
        </g>
      );

    case "motorcycle":
      return (
        <g>
          <rect x={-3} y={-9} width={6} height={18} rx={2.5} fill={c.body} />
          <circle cx={0} cy={-9} r={3} fill="#2A2E33" />
          <circle cx={0} cy={9} r={3} fill="#2A2E33" />
          <rect x={-5} y={-4} width={10} height={3} rx={1.5} fill={c.trim} />
        </g>
      );

    case "bicycle":
      return (
        <g>
          <circle
            cx={0}
            cy={-7}
            r={4}
            fill="none"
            stroke="#2A2E33"
            strokeWidth={1.4}
          />
          <circle
            cx={0}
            cy={7}
            r={4}
            fill="none"
            stroke="#2A2E33"
            strokeWidth={1.4}
          />
          <rect x={-1.5} y={-7} width={3} height={14} fill="#2A2E33" />
          <circle cx={0} cy={0} r={3.6} fill={c.body} />
        </g>
      );

    case "pedestrian":
      return (
        <g>
          <circle cx={0} cy={0} r={4.4} fill={c.body} />
          <circle cx={0} cy={0} r={2} fill={c.glass} />
        </g>
      );

    case "child":
      return (
        <g>
          <circle cx={0} cy={0} r={3.2} fill={c.body} />
          <circle cx={0} cy={0} r={1.4} fill={c.glass} />
        </g>
      );

    case "animal":
      return (
        <g fill="#8A6A44">
          <ellipse cx={0} cy={0} rx={5} ry={8} />
          <circle cx={0} cy={-8} r={3.2} />
        </g>
      );

    case "tractor":
      return (
        <g>
          <rect x={-9} y={-12} width={18} height={24} rx={3} fill="#4E8A42" />
          <circle cx={-10} cy={8} r={5} fill="#2A2E33" />
          <circle cx={10} cy={8} r={5} fill="#2A2E33" />
        </g>
      );

    case "emergency":
      return (
        <g>
          <rect x={-10} y={-18} width={20} height={36} rx={4} fill="#F0F2F5" />
          <rect x={-10} y={-4} width={20} height={8} fill="#D23A34" />
          <rect x={-7} y={11} width={14} height={5} rx={1.5} fill="#7E8894" />
          <rect x={-7} y={-17} width={14} height={5} rx={1.5} fill="#7E8894" />
          <rect x={-6} y={-10} width={12} height={3} rx={1.5} fill="#2F6BD8" />
        </g>
      );

    case "car":
    default:
      return (
        <g>
          <rect x={-9} y={-16} width={18} height={32} rx={5} fill={c.body} />
          <rect x={-7} y={8} width={14} height={6} rx={2} fill={c.glass} />
          <rect x={-7} y={-14} width={14} height={5} rx={2} fill={c.glass} />
          <rect x={-9.5} y={-5} width={2} height={10} rx={1} fill={c.trim} />
          <rect x={7.5} y={-5} width={2} height={10} rx={1} fill={c.trim} />
        </g>
      );
  }
}

/** A sign on a post, seen from above-ish so the face stays readable. */
export function SignPost({ children }: { children: React.ReactNode }) {
  return (
    <g>
      <rect x={-1.5} y={0} width={3} height={16} rx={1.5} fill={SURFACE.kerb} />
      <g transform="translate(-13 -26)">{children}</g>
    </g>
  );
}
