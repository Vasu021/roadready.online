import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import SignCard from "../components/SignCard";
import SpeakButton from "../components/SpeakButton";
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
import { useT } from "../i18n";

type Filter = SignCategory | "all";

export default function SignsLibrary() {
  const t = useT();
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
          title={t("signs.noResults")}
          body={t("dashboard.comingSoonBody")}
          action={
            <Link
              to="/dashboard"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-ink transition hover:bg-accent/85"
            >
              {t("action.backToDashboard")}
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
        <span className="sr-only">{t("signs.search")}</span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-faint"
        >
          ⌕
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("signs.search")}
          className="w-full rounded-lg border border-line bg-surface py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40"
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
                  ? "bg-accent text-ink"
                  : "border border-line bg-surface text-muted hover:border-line-strong hover:text-ink"
              }`}
            >
              {tab === "all" ? t("signs.all") : CATEGORY_LABELS[tab]}
              <span className={active ? "text-accent-ink/80" : "text-faint"}>
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
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {selectedCountry.flagEmoji} {t("signs.heading")}
          </h1>
          <SpeakButton text={[t("signs.heading"), t("signs.intro")]} />
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          {t("signs.intro")}
        </p>
      </header>

      {filter !== "all" && (
        <p className="mb-5 max-w-2xl border-l-2 border-accent/40 pl-4 text-sm leading-relaxed text-muted">
          {CATEGORY_DESCRIPTIONS[filter]}
        </p>
      )}

      {visible.length === 0 ? (
        <EmptyState
          icon="🔍"
          title={t("signs.noResults")}
          body={t("signs.noResultsBody")}
          action={
            <button
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-ink transition hover:bg-accent/85"
            >
              {t("action.clearFilters")}
            </button>
          }
        />
      ) : (
        <>
          <p className="mb-3 text-xs text-faint">
            {t("signs.count", { count: visible.length })}
          </p>
          <ul className="grid auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
