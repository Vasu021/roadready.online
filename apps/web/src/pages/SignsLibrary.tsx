import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import SignCard from "../components/SignCard";
import SignDetailModal from "../components/SignDetailModal";
import { EmptyState } from "../components/ui";
import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  SIGN_CATEGORY_ORDER,
  getSignsForCountry,
} from "../components/signs";
import type { SignCategory } from "../components/signs";
import { useUserStore } from "../store/userStore";

type Filter = SignCategory | "all";

export default function SignsLibrary() {
  const selectedCountry = useUserStore((s) => s.selectedCountry);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const allSigns = useMemo(
    () => getSignsForCountry(selectedCountry?.code ?? "DE"),
    [selectedCountry?.code],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allSigns.filter((s) => {
      if (filter !== "all" && s.category !== filter) return false;
      if (!q) return true;
      return (
        s.nameDE.toLowerCase().includes(q) ||
        s.nameEN.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.explanation.toLowerCase().includes(q) ||
        (s.legalBasis ?? "").toLowerCase().includes(q)
      );
    });
  }, [allSigns, filter, query]);

  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["all", allSigns.length]]);
    for (const s of allSigns) {
      map.set(s.category, (map.get(s.category) ?? 0) + 1);
    }
    return map;
  }, [allSigns]);

  if (!selectedCountry) return <Navigate to="/" replace />;

  // No catalogue for this country yet — a filter reset would not help.
  if (allSigns.length === 0) {
    return (
      <AppShell maxWidth="max-w-3xl">
        <EmptyState
          icon="🪧"
          title={`No sign catalogue for ${selectedCountry.name} yet`}
          body="The full German catalogue is available today. Other countries are being drawn and written — switch country from the header to browse it."
          action={
            <Link
              to="/dashboard"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              Back to dashboard
            </Link>
          }
        />
      </AppShell>
    );
  }

  const tabs: Filter[] = [
    "all",
    ...SIGN_CATEGORY_ORDER.filter((c) => (counts.get(c) ?? 0) > 0),
  ];

  const toolbar = (
    <div>
      <label className="relative block">
        <span className="sr-only">Search signs</span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500"
        >
          ⌕
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, meaning or Zeichen number…"
          className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
        />
      </label>

      <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => {
          const active = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              aria-pressed={active}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "border border-white/10 bg-white/5 text-gray-300 hover:border-white/25 hover:text-white"
              }`}
            >
              {tab === "all" ? "All" : CATEGORY_LABELS[tab]}
              <span className={active ? "text-blue-100/80" : "text-gray-500"}>
                {counts.get(tab) ?? 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <AppShell maxWidth="max-w-6xl" toolbar={toolbar}>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {selectedCountry.flagEmoji} German Traffic Signs
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
          Every sign, light signal, road marking and supplementary plate you
          need for the theory test — including the combinations you actually
          meet on a German road. Tap any card for the full meaning.
        </p>
      </header>

      {filter !== "all" && (
        <p className="mb-5 max-w-2xl border-l-2 border-blue-500/40 pl-4 text-sm leading-relaxed text-gray-400">
          {CATEGORY_DESCRIPTIONS[filter]}
        </p>
      )}

      {visible.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No signs match that search"
          body="Try a different word, or clear the filters to browse the whole catalogue."
          action={
            <button
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <>
          <p className="mb-3 text-xs text-gray-500">
            {visible.length} {visible.length === 1 ? "sign" : "signs"}
            {filter === "all" && query === "" && " in the full catalogue"}
          </p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {visible.map((sign, i) => (
              <li key={sign.id}>
                <SignCard sign={sign} onClick={() => setOpenIndex(i)} />
              </li>
            ))}
          </ul>
        </>
      )}

      {openIndex !== null && visible[openIndex] && (
        <SignDetailModal
          sign={visible[openIndex]}
          onClose={() => setOpenIndex(null)}
          onPrev={openIndex > 0 ? () => setOpenIndex(openIndex - 1) : undefined}
          onNext={
            openIndex < visible.length - 1
              ? () => setOpenIndex(openIndex + 1)
              : undefined
          }
        />
      )}
    </AppShell>
  );
}
