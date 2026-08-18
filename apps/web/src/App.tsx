import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import Dashboard from "./pages/Dashboard";
import Review from "./pages/Review";
import AuthModal from "./components/auth/AuthModal";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { api, clearStoredToken, getStoredToken } from "./utils/api";
import { useUserStore } from "./store/userStore";

/**
 * Restores the session on boot.
 *
 * The stored token is verified against the API rather than decoded locally, so
 * an expired or tampered token results in a clean logged-out state instead of a
 * UI that renders as signed in and then 401s on every request.
 */
function useRestoreSession() {
  const setUser = useUserStore((s) => s.setUser);
  const setBootstrapping = useUserStore((s) => s.setBootstrapping);
  const setSelectedCountry = useUserStore((s) => s.setSelectedCountry);

  useEffect(() => {
    let cancelled = false;

    if (!getStoredToken()) {
      setBootstrapping(false);
      return;
    }

    api.auth
      .me()
      .then(async (user) => {
        if (cancelled) return;
        setUser(user);

        // The account's country is the source of truth; the cached copy in
        // localStorage only exists to avoid a flash of the picker on reload.
        const cached = useUserStore.getState().selectedCountry;
        if (
          user.selectedCountryCode &&
          cached?.code !== user.selectedCountryCode
        ) {
          const countries = await api.countries.list();
          const match = countries.find(
            (c) => c.code === user.selectedCountryCode,
          );
          if (!cancelled) setSelectedCountry(match ?? null);
        } else if (!user.selectedCountryCode && cached) {
          setSelectedCountry(null);
        }
      })
      .catch(() => {
        if (cancelled) return;
        clearStoredToken();
        setUser(null);
      })
      .finally(() => {
        if (!cancelled) setBootstrapping(false);
      });

    return () => {
      cancelled = true;
    };
  }, [setUser, setBootstrapping, setSelectedCountry]);
}

export default function App() {
  const showAuthModal = useUserStore((s) => s.showAuthModal);
  useRestoreSession();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/quiz/:quizId"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results/:quizId"
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review"
          element={
            <ProtectedRoute>
              <Review />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showAuthModal && <AuthModal />}
    </BrowserRouter>
  );
}
