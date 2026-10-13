import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { PageBackdrop } from "./ui";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: "◆" },
  { to: "/signs", label: "Signs", icon: "⚠" },
  { to: "/practice", label: "Practice", icon: "✎" },
  { to: "/scenarios", label: "Situations", icon: "⌖" },
  { to: "/final-test", label: "Final Test", icon: "★" },
];

/** Wordmark used in the header and on the landing page. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-[13px] font-black text-white shadow-lg shadow-blue-600/20">
        R
      </span>
      {!compact && (
        <span className="text-lg font-bold tracking-tight text-white">
          Road<span className="text-blue-400">Ready</span>
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
  const user = useUserStore((s) => s.user);
  const selectedCountry = useUserStore((s) => s.selectedCountry);
  const setSelectedCountry = useUserStore((s) => s.setSelectedCountry);
  const logout = useUserStore((s) => s.logout);

  return (
    <div className="relative min-h-full bg-gray-950 text-white">
      <PageBackdrop />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
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
                title="Change country"
                className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-gray-300 transition hover:border-white/20 hover:text-white sm:flex"
              >
                <span>{selectedCountry.flagEmoji}</span>
                <span>{selectedCountry.name}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden max-w-[12rem] truncate text-xs text-gray-500 lg:block">
                {user.email}
              </span>
            )}
            <button
              onClick={logout}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
            >
              Sign out
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
                          ? "border-blue-500 text-white"
                          : "border-transparent text-gray-400 hover:border-white/20 hover:text-gray-200"
                      }`}
                    >
                      <span className="text-[11px] opacity-70">
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {toolbar && (
          <div
            className={`mx-auto ${maxWidth} border-t border-white/10 px-5 py-3 sm:px-8`}
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

      <footer className="relative border-t border-white/10 px-5 py-6 text-center text-xs text-gray-600 sm:px-8">
        RoadReady — theory practice for German roads. Content follows the StVO;
        it is study material, not legal advice.
      </footer>
    </div>
  );
}
