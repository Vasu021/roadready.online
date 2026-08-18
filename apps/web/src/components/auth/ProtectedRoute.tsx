import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { LoadingPanel } from "../layout";
import { t } from "../../i18n";

/**
 * Gates a route on a verified session.
 *
 * It waits for the boot-time token check rather than reading localStorage
 * directly — otherwise a stale or tampered token would let the page render
 * before the API rejects it, and a valid one would flash a redirect on reload.
 */
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUserStore((s) => s.user);
  const isBootstrapping = useUserStore((s) => s.isBootstrapping);
  const setShowAuthModal = useUserStore((s) => s.setShowAuthModal);

  const denied = !isBootstrapping && !user;

  useEffect(() => {
    if (denied) setShowAuthModal(true, "login");
  }, [denied, setShowAuthModal]);

  if (isBootstrapping) {
    return (
      <div className="min-h-full bg-slate-950">
        <LoadingPanel label={t("Checking your session…")} />
      </div>
    );
  }

  if (denied) return <Navigate to="/" replace />;

  return <>{children}</>;
}
