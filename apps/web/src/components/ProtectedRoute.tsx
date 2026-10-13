import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getStoredToken } from "../utils/api";
import { isTokenValid } from "../utils/jwt";
import { useUserStore } from "../store/userStore";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const setShowAuthModal = useUserStore((s) => s.setShowAuthModal);
  // An expired token is no better than no token at all.
  const hasToken = isTokenValid(getStoredToken());

  useEffect(() => {
    if (!hasToken) {
      setShowAuthModal(true, "login");
    }
  }, [hasToken, setShowAuthModal]);

  if (!hasToken) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
