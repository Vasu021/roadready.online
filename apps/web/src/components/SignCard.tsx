import type { SignMeta } from "./signs";
import { CATEGORY_LABELS } from "./signs";

/**
 * One sign in the library grid.
 *
 * Every card is the same size: the button fills its grid cell, the glyph sits
 * on a fixed-height stage, and names are clamped to two lines. Without that the
 * card grows to fit its longest label and the grid comes out ragged.
 */
export default function SignCard({
  sign,
  onClick,
}: {
  sign: SignMeta;
  onClick: () => void;
}) {
  const Sign = sign.component;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full w-full flex-col items-center gap-2.5 rounded-xl border border-line bg-surface p-3 text-center backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-xl hover:shadow-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
      aria-label={`${sign.nameDE} — ${sign.nameEN}`}
    >
      {/* A fixed stage so every glyph occupies the same box, whatever its shape. */}
      <span className="flex h-24 w-full items-center justify-center rounded-lg bg-raised transition duration-200 group-hover:scale-[1.03]">
        <Sign size={76} />
      </span>

      <span className="flex w-full flex-1 flex-col justify-start">
        <span className="line-clamp-2 min-h-[2.1rem] text-xs font-semibold leading-snug text-ink">
          {sign.nameDE}
        </span>
        <span className="mt-0.5 line-clamp-1 text-[11px] leading-snug text-muted">
          {sign.nameEN}
        </span>
      </span>

      <span className="text-[10px] uppercase tracking-wider text-faint">
        {CATEGORY_LABELS[sign.category]}
      </span>
    </button>
  );
}
