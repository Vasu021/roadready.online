import { useMemo } from "react";
import type { SceneSpec, SceneAnnotation } from "@roadready/shared";
import { getSignById } from "../signs";
import { Road, Markings } from "./roads";
import { Actor, SignPost, TONES } from "./actors";
import type { Tone } from "./actors";
import { place, W, H, SURFACE } from "./geometry";

/** Weather and light are drawn as a single overlay on top of the scene. */
function Conditions({ kind }: { kind: SceneSpec["conditions"] }) {
  if (!kind || kind === "day") return null;

  if (kind === "fog") {
    return (
      <g>
        <rect x={0} y={0} width={W} height={H} fill="#D8DCE0" opacity={0.55} />
        <rect x={0} y={0} width={W} height={120} fill="#E6E9EC" opacity={0.5} />
      </g>
    );
  }
  if (kind === "night") {
    return (
      <rect x={0} y={0} width={W} height={H} fill="#0B1020" opacity={0.58} />
    );
  }
  if (kind === "dusk") {
    return (
      <rect x={0} y={0} width={W} height={H} fill="#2A1F3A" opacity={0.35} />
    );
  }
  if (kind === "rain") {
    return (
      <g>
        <rect x={0} y={0} width={W} height={H} fill="#28313D" opacity={0.3} />
        <g stroke="#CBD5E1" strokeWidth={1} opacity={0.5}>
          {Array.from({ length: 26 }, (_, i) => (
            <line
              key={i}
              x1={(i * 37) % W}
              y1={(i * 53) % H}
              x2={((i * 37) % W) - 5}
              y2={((i * 53) % H) + 11}
            />
          ))}
        </g>
      </g>
    );
  }
  // snow
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill="#F2F6FA" opacity={0.45} />
      <g fill="#FFFFFF" opacity={0.8}>
        {Array.from({ length: 30 }, (_, i) => (
          <circle key={i} cx={(i * 43) % W} cy={(i * 61) % H} r={1.6} />
        ))}
      </g>
    </g>
  );
}

function Annotation({
  annotation,
  road,
}: {
  annotation: SceneAnnotation;
  road: SceneSpec["road"];
}) {
  const ink = "#F8FAFC";
  const halo = "#0F172A";

  if (annotation.kind === "arrow" && annotation.from && annotation.to) {
    const a = place(road, annotation.from);
    const b = place(road, annotation.to);
    return (
      <g>
        <path
          d={`M${a.x} ${a.y - 22} Q${a.x} ${b.y + 18} ${b.x + 26} ${b.y}`}
          fill="none"
          stroke="#FACC15"
          strokeWidth={3}
          strokeDasharray="7 6"
          markerEnd="url(#scene-arrow)"
        />
      </g>
    );
  }

  const at = annotation.at ? place(road, annotation.at) : { x: 200, y: 150 };

  if (annotation.kind === "stop") {
    return (
      <g transform={`translate(${at.x} ${at.y - 30})`}>
        <rect x={-30} y={-11} width={60} height={22} rx={11} fill="#DC2626" />
        <text
          x={0}
          y={5}
          textAnchor="middle"
          fontSize={11}
          fontWeight={700}
          fill="#FFFFFF"
        >
          STOP
        </text>
      </g>
    );
  }

  if (annotation.kind === "gap") {
    return (
      <g>
        <rect
          x={186}
          y={20}
          width={28}
          height={H - 40}
          fill="#FACC15"
          opacity={0.25}
        />
        <text
          x={200}
          y={36}
          textAnchor="middle"
          fontSize={11}
          fontWeight={600}
          fill={ink}
          stroke={halo}
          strokeWidth={3}
          paintOrder="stroke"
        >
          {annotation.text ?? ""}
        </text>
      </g>
    );
  }

  // order, note and question all render as a small label pinned to a slot.
  const label = annotation.text ?? (annotation.kind === "question" ? "?" : "");
  const width = Math.max(26, label.length * 5.6 + 14);

  return (
    <g transform={`translate(${at.x} ${at.y - 30})`}>
      <rect
        x={-width / 2}
        y={-10}
        width={width}
        height={20}
        rx={10}
        fill="#0F172A"
        opacity={0.85}
      />
      <text
        x={0}
        y={4}
        textAnchor="middle"
        fontSize={10}
        fontWeight={600}
        fill={ink}
      >
        {label}
      </text>
    </g>
  );
}

export interface SceneRendererProps {
  scene: SceneSpec;
  /** Rendered width in px; the frame keeps its 4:3 ratio. */
  width?: number;
  className?: string;
}

/**
 * Draws a driving situation from its JSON description. Road surfaces and
 * vehicles use realistic colours rather than theme tokens, because a learner
 * should recognise the scene the way it looks on the road.
 */
export default function SceneRenderer({
  scene,
  width = 400,
  className,
}: SceneRendererProps) {
  const signs = useMemo(
    () =>
      (scene.signs ?? []).map((s) => ({
        ...s,
        meta: getSignById(s.id),
      })),
    [scene.signs],
  );

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={width}
      height={(width * H) / W}
      className={className}
      role="img"
      aria-label={scene.caption ?? "Driving situation"}
      style={{ maxWidth: "100%", height: "auto" }}
    >
      <defs>
        <marker
          id="scene-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10z" fill="#FACC15" />
        </marker>
        <clipPath id="scene-clip">
          <rect x={0} y={0} width={W} height={H} rx={10} />
        </clipPath>
      </defs>

      <g clipPath="url(#scene-clip)">
        <Road layout={scene.road} />
        {scene.markings && scene.markings.length > 0 && (
          <Markings kinds={scene.markings} />
        )}

        {/* Actors */}
        {(scene.actors ?? []).map((actor, i) => {
          const p = place(scene.road, actor.at);
          const rot =
            actor.heading === "south"
              ? 180
              : actor.heading === "east"
                ? 270
                : actor.heading === "west"
                  ? 90
                  : actor.heading === "north"
                    ? 0
                    : p.rot;
          const tone: Tone = actor.you
            ? "you"
            : ((actor.tone ?? "neutral") as Tone);

          return (
            <g key={`${actor.kind}-${actor.at}-${i}`}>
              <g transform={`translate(${p.x} ${p.y}) rotate(${rot})`}>
                <Actor kind={actor.kind} tone={tone} />
              </g>
              {actor.you && (
                <text
                  x={p.x}
                  y={p.y + 32}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={700}
                  fill={TONES.you.body}
                  stroke="#0F172A"
                  strokeWidth={3}
                  paintOrder="stroke"
                >
                  YOU
                </text>
              )}
            </g>
          );
        })}

        {/* Signs on posts */}
        {signs.map(({ id, at, meta }, i) => {
          if (!meta) return null;
          const p = place(scene.road, at);
          const SignGlyph = meta.component;
          return (
            <g key={`${id}-${i}`} transform={`translate(${p.x} ${p.y})`}>
              <SignPost>
                <SignGlyph size={26} />
              </SignPost>
            </g>
          );
        })}

        <Conditions kind={scene.conditions} />

        {(scene.annotations ?? []).map((a, i) => (
          <Annotation key={`${a.kind}-${i}`} annotation={a} road={scene.road} />
        ))}
      </g>

      <rect
        x={0.5}
        y={0.5}
        width={W - 1}
        height={H - 1}
        rx={10}
        fill="none"
        stroke={SURFACE.kerb}
        strokeWidth={1}
        opacity={0.35}
      />
    </svg>
  );
}

/** Narrow type guard for scene JSON coming back from the API. */
export function asScene(value: unknown): SceneSpec | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<SceneSpec>;
  return typeof candidate.road === "string" ? (candidate as SceneSpec) : null;
}
