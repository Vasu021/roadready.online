import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { t } from "../../i18n";

export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const px = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-9 w-9" }[size];
  return (
    <div
      role="status"
      aria-label={t("Loading")}
      className={`${px} animate-spin rounded-full border-2 border-slate-500 border-t-transparent`}
    />
  );
}

export function LoadingPanel({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
      <Spinner size="lg" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}

export function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-900/60 bg-red-950/40 px-5 py-4 text-sm text-red-200"
    >
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg border border-red-800 px-3 py-1.5 font-medium transition hover:bg-red-900/40"
        >
          {t("Try again")}
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-900/40 px-8 py-14 text-center">
      <div className="mb-4 text-4xl" aria-hidden="true">
        {icon}
      </div>
      <h3 className="mb-1.5 text-base font-semibold text-white">{title}</h3>
      <p className="max-w-sm text-sm text-slate-400">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function AppHeader({ children }: { children?: ReactNode }) {
  const user = useUserStore((s) => s.user);
  const selectedCountry = useUserStore((s) => s.selectedCountry);
  const logout = useUserStore((s) => s.logout);
  const setShowAuthModal = useUserStore((s) => s.setShowAuthModal);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="text-lg" aria-hidden="true">
            🚦
          </span>
          <span className="text-base font-bold tracking-tight text-white">
            RoadReady
          </span>
          {selectedCountry && (
            <span className="hidden text-sm text-slate-400 sm:inline">
              {selectedCountry.flagEmoji} {selectedCountry.name}
            </span>
          )}
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-3">
          {children}
          {user ? (
            <>
              <HeaderLink to="/dashboard">{t("Progress")}</HeaderLink>
              <HeaderLink to="/review">{t("Review")}</HeaderLink>
              <button
                onClick={logout}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:border-slate-600 hover:bg-slate-800"
              >
                {t("Sign out")}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowAuthModal(true, "login")}
                className="rounded-lg px-3 py-1.5 text-sm text-slate-300 transition hover:text-white"
              >
                {t("Sign in")}
              </button>
              <button
                onClick={() => setShowAuthModal(true, "register")}
                className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                {t("Get started")}
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function HeaderLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="hidden rounded-lg px-3 py-1.5 text-sm text-slate-400 transition hover:text-white sm:block"
    >
      {children}
    </Link>
  );
}

export function PageShell({
  children,
  header = true,
  width = "default",
}: {
  children: ReactNode;
  header?: boolean;
  width?: "default" | "wide";
}) {
  return (
    <div className="min-h-full bg-slate-950 text-white">
      {header && <AppHeader />}
      <main
        className={`mx-auto w-full px-5 py-8 sm:px-8 sm:py-12 ${
          width === "wide" ? "max-w-5xl" : "max-w-3xl"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
