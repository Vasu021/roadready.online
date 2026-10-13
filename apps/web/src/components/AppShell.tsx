import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { useT } from "../i18n";
import type { TranslationKey } from "../i18n";
import { PageBackdrop } from "./ui";
import SettingsMenu from "./SettingsMenu";
import { LogoMark } from "./brand/Logo";

const NAV: { to: string; labelKey: TranslationKey; icon: string }[] = [
  { to: "/dashboard", labelKey: "nav.dashboard", icon: "◆" },
  { to: "/learn", labelKey: "nav.learn", icon: "▤" },
  { to: "/signs", labelKey: "nav.signs", icon: "⚠" },
  { to: "/practice", labelKey: "nav.practice", icon: "✎" },
  { to: "/scenarios", labelKey: "nav.scenarios", icon: "⌖" },
  { to: "/final-test", labelKey: "nav.finalTest", icon: "★" },
];

/** Wordmark used in the header and on the landing page. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <LogoMark size={28} />
      {!compact && (
        <span className="text-lg font-bold tracking-tight text-ink">
          Road<span className="text-accent">Ready</span>
        </span>
      )}
    </span>
  );
}

/**
 * Shared page frame: sticky header with navigation, the page body, and a
 * footer. Pages supply only their own content.
 */
export default function AppShell({
  children,
  maxWidth = "max-w-5xl",
  showNav = true,
  toolbar,
}: {
  children: ReactNode;
  maxWidth?: string;
  showNav?: boolean;
  /** Page controls pinned under the nav, inside the sticky header. */
  toolbar?: ReactNode;
}) {
  const { pathname } = useLocation();
  const t = useT();
  const user = useUserStore((s) => s.user);
  const selectedCountry = useUserStore((s) => s.selectedCountry);
  const setSelectedCountry = useUserStore((s) => s.setSelectedCountry);
  const logout = useUserStore((s) => s.logout);

  return (
    <div className="relative min-h-full bg-ground text-ink">
      <PageBackdrop />

      <header className="sticky top-0 z-30 border-b border-line bg-ground/80 backdrop-blur-xl">
        <div
          className={`mx-auto flex ${maxWidth} items-center justify-between gap-4 px-5 py-3.5 sm:px-8`}
        >
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="shrink-0">
              <Logo />
            </Link>
            {selectedCountry && (
              <button
                onClick={() => setSelectedCountry(null)}
                title={t("nav.changeCountry")}
                className="hidden items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1 text-xs font-medium text-muted transition hover:border-line-strong hover:text-ink sm:flex"
              >
                <span>{selectedCountry.flagEmoji}</span>
                <span>{selectedCountry.name}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {user && (
              <span className="hidden max-w-[10rem] truncate text-xs text-faint xl:block">
                {user.email}
              </span>
            )}
            <SettingsMenu />
            <button
              onClick={logout}
              className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:border-line-strong hover:bg-surface hover:text-ink"
            >
              {t("nav.signOut")}
            </button>
          </div>
        </div>

        {showNav && (
          <nav className={`mx-auto ${maxWidth} px-5 sm:px-8`}>
            <ul className="-mb-px flex gap-1 overflow-x-auto pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {NAV.map((item) => {
                const active =
                  pathname === item.to || pathname.startsWith(`${item.to}/`);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition ${
                        active
                          ? "border-accent text-ink"
                          : "border-transparent text-muted hover:border-line-strong hover:text-muted"
                      }`}
                    >
                      <span className="text-[11px] opacity-70">
                        {item.icon}
                      </span>
                      {t(item.labelKey)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {toolbar && (
          <div
            className={`mx-auto ${maxWidth} border-t border-line px-5 py-3 sm:px-8`}
          >
            {toolbar}
          </div>
        )}
      </header>

      <main
        className={`relative mx-auto ${maxWidth} px-5 py-8 sm:px-8 sm:py-10`}
      >
        {children}
      </main>

      <footer className="relative border-t border-line px-5 py-6 text-center text-xs text-faint sm:px-8">
        {t("app.name")} — {t("app.disclaimer")}
      </footer>
    </div>
  );
}
