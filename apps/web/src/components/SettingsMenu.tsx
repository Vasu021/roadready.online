import { useEffect, useRef, useState } from "react";
import { LOCALES } from "@roadready/shared";
import type { Locale } from "@roadready/shared";
import { LOCALE_META, useI18n, useT } from "../i18n";
import { THEMES, THEME_META, useTheme } from "../theme";
import type { Theme } from "../theme";
import { api, getStoredToken } from "../utils/api";

/** Language and theme, in one popover in the header. */
export default function SettingsMenu() {
  const t = useT();
  const { locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /** Preferences follow the user across devices when they are signed in. */
  function persist(prefs: { locale?: Locale; theme?: Theme }) {
    if (!getStoredToken()) return;
    api.users.savePreferences(prefs).catch(() => {
      // A failed save only means the preference stays local.
    });
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-muted transition hover:border-line-strong hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
        title={`${t("settings.language")} · ${t("settings.theme")}`}
      >
        <span className="uppercase">{locale}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 10 6"
          className={`h-1.5 w-2.5 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M1 1l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-line bg-surface p-3 shadow-2xl backdrop-blur-xl">
          <section>
            <h3 className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-widest text-faint">
              {t("settings.language")}
            </h3>
            <ul className="max-h-56 space-y-0.5 overflow-y-auto">
              {LOCALES.map((code) => (
                <li key={code}>
                  <button
                    onClick={() => {
                      setLocale(code);
                      persist({ locale: code });
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-sm transition ${
                      locale === code
                        ? "bg-accent text-accent-ink"
                        : "text-muted hover:bg-raised hover:text-ink"
                    }`}
                  >
                    <span>{LOCALE_META[code].nativeName}</span>
                    <span className="text-[10px] uppercase opacity-60">
                      {code}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-3 border-t border-line pt-3">
            <h3 className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-widest text-faint">
              {t("settings.theme")}
            </h3>
            <ul className="grid grid-cols-2 gap-1.5">
              {THEMES.map((id) => {
                const meta = THEME_META[id];
                return (
                  <li key={id}>
                    <button
                      onClick={() => {
                        setTheme(id);
                        persist({ theme: id });
                      }}
                      className={`flex h-9 w-full items-center gap-2 rounded-lg border px-2 text-left text-xs transition ${
                        theme === id
                          ? "border-accent bg-accent/10 text-ink"
                          : "border-line text-muted hover:border-line-strong hover:text-ink"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-5 w-5 shrink-0 overflow-hidden rounded border border-line-strong"
                        style={{ background: meta.swatch[0] }}
                      >
                        <span
                          className="h-full w-1/2"
                          style={{ background: meta.swatch[1] }}
                        />
                      </span>
                      <span className="truncate">{t(meta.labelKey)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
