import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getStoredToken } from "../utils/api";
import { useUserStore } from "../store/userStore";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const setShowAuthModal = useUserStore((s) => s.setShowAuthModal);
  const hasToken = Boolean(getStoredToken());

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
