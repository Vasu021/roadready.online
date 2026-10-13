import type { SignMeta } from "./signs";
import { CATEGORY_LABELS } from "./signs";

/** One sign in the library grid. */
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
      className="group flex flex-col items-center gap-3 rounded-xl border border-line bg-surface px-3 py-5 text-center backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:bg-raised hover:shadow-xl hover:shadow-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
      aria-label={`${sign.nameDE} — ${sign.nameEN}`}
    >
      <span className="flex h-20 items-center justify-center transition duration-200 group-hover:scale-105">
        <Sign size={72} />
      </span>
      <span className="w-full">
        <span className="block truncate text-xs font-semibold text-ink">
          {sign.nameDE}
        </span>
        <span className="mt-0.5 block truncate text-[11px] text-muted">
          {sign.nameEN}
        </span>
      </span>
      <span className="text-[10px] uppercase tracking-wider text-faint">
        {CATEGORY_LABELS[sign.category]}
      </span>
    </button>
  );
}
