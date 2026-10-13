/**
 * Driving situations have no photography yet, so the seeded `imagePrompt` is
 * rendered as a styled scene card: a stylised road plus the written situation.
 * When `imageUrl` is filled in later, it replaces the placeholder.
 */
export default function ScenarioIllustration({
  imagePrompt,
  imageUrl,
  name,
  compact = false,
}: {
  imagePrompt: string | null | undefined;
  imageUrl?: string | null;
  name?: string;
  compact?: boolean;
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name ?? "Driving situation"}
        className="w-full rounded-xl border border-line object-cover"
      />
    );
  }

  const text = imagePrompt ?? "";
  // The first two sentences describe the scene; the rest is detail.
  const sentences = text.split(/(?<=\.)\s+/);
  const lead = sentences.slice(0, 2).join(" ");
  const rest = sentences.slice(2).join(" ");

  return (
    <figure
      className={`relative overflow-hidden rounded-xl border border-line bg-gradient-to-b from-raised to-surface ${
        compact ? "p-4" : "p-5"
      }`}
    >
      {/* Stylised road, drawn rather than photographed */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 opacity-70"
      >
        <svg
          viewBox="0 0 400 100"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path d="M0 100 L150 20 H250 L400 100 Z" fill="#3B4252" />
          <path
            d="M200 24 L205 100 H195 Z"
            fill="#E8E8E8"
            opacity={0.5}
            strokeDasharray="6 10"
          />
          {[30, 48, 70, 100].map((y, i) => (
            <rect
              key={y}
              x={198 - i * 1.5}
              y={y}
              width={4 + i}
              height={6 + i * 2}
              fill="#F0F0F0"
              opacity={0.55}
            />
          ))}
        </svg>
      </div>

      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-raised px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-muted">
          🚗 Driving situation
        </span>
        {name && (
          <h3 className="mt-2.5 text-base font-semibold text-ink">{name}</h3>
        )}
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{lead}</p>
        {!compact && rest && (
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{rest}</p>
        )}
      </div>
    </figure>
  );
}
