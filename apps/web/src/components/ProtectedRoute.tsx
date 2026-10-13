import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getStoredToken } from "../utils/api";
import { isTokenValid } from "../utils/jwt";
import { verifySession } from "../utils/session";
import { useUserStore } from "../store/userStore";

type Gate = "checking" | "allowed" | "denied";

/**
 * Keeps signed-out visitors off the course pages.
 *
 * This is a convenience, not the security boundary — every endpoint behind
 * `/api` enforces the same thing server-side. It still refuses to decide on
 * the token's own claims alone: those can be hand-written into localStorage,
 * so the session is confirmed with the API before the page renders.
 */
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const setShowAuthModal = useUserStore((s) => s.setShowAuthModal);
  const logout = useUserStore((s) => s.logout);

  // An absent or expired token is settled without a round trip.
  const hasToken = isTokenValid(getStoredToken());
  const [gate, setGate] = useState<Gate>(hasToken ? "checking" : "denied");

  useEffect(() => {
    if (!hasToken) {
      setGate("denied");
      return;
    }

    let cancelled = false;
    setGate("checking");
    verifySession().then((result) => {
      if (!cancelled) setGate(result);
    });

    return () => {
      cancelled = true;
    };
  }, [hasToken]);

  useEffect(() => {
    if (gate !== "denied") return;
    // A token that the API rejected is worse than none: drop it so the header
    // cannot keep showing an identity the server does not recognise.
    if (getStoredToken()) logout();
    setShowAuthModal(true, "login");
  }, [gate, logout, setShowAuthModal]);

  if (gate === "checking") {
    return (
      <div className="flex h-screen items-center justify-center bg-ground">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" />
      </div>
    );
  }

  if (gate === "denied") return <Navigate to="/" replace />;

  return <>{children}</>;
}
