import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AuthModal from "./components/AuthModal";
import ProtectedRoute from "./components/ProtectedRoute";
import { getStoredToken, setUnauthorizedHandler } from "./utils/api";
import { isExpired, parseJwt } from "./utils/jwt";
import { useUserStore } from "./store/userStore";
import { I18nProvider } from "./i18n";
import { ThemeProvider } from "./theme";

// Route-level code splitting keeps the landing page small.
const Learn = lazy(() => import("./pages/Learn"));
const ModuleView = lazy(() => import("./pages/ModuleView"));
const ModuleQuiz = lazy(() => import("./pages/ModuleQuiz"));
const SignsLibrary = lazy(() => import("./pages/SignsLibrary"));
const PracticeTests = lazy(() => import("./pages/PracticeTests"));
const TopicQuiz = lazy(() => import("./pages/TopicQuiz"));
const ScenarioPractice = lazy(() => import("./pages/ScenarioPractice"));
const FinalTest = lazy(() => import("./pages/FinalTest"));

function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center bg-ground">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" />
    </div>
  );
}

export default function App() {
  const setUser = useUserStore((s) => s.setUser);
  const showAuthModal = useUserStore((s) => s.showAuthModal);

  // Restore the session from the stored token, unless it has expired.
  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    const payload = parseJwt(token);
    if (payload?.sub && payload.email && !isExpired(payload)) {
      setUser({ id: payload.sub, email: payload.email });
    }
  }, [setUser]);

  // If the API ever rejects the token, sign out rather than leaving the UI in
  // a half-authenticated state.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      const { user, logout, setShowAuthModal } = useUserStore.getState();
      if (!user) return;
      logout();
      setShowAuthModal(true, "login");
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const protect = (element: React.ReactNode) => (
    <ProtectedRoute>{element}</ProtectedRoute>
  );

  return (
    <ThemeProvider>
      <I18nProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={protect(<Dashboard />)} />
              <Route path="/learn" element={protect(<Learn />)} />
              <Route path="/learn/:slug" element={protect(<ModuleView />)} />
              <Route
                path="/learn/:slug/quiz"
                element={protect(<ModuleQuiz />)}
              />
              <Route path="/signs" element={protect(<SignsLibrary />)} />
              <Route path="/practice" element={protect(<PracticeTests />)} />
              <Route path="/practice/:slug" element={protect(<TopicQuiz />)} />
              <Route
                path="/scenarios"
                element={protect(<ScenarioPractice />)}
              />
              <Route path="/final-test" element={protect(<FinalTest />)} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
          {showAuthModal && <AuthModal />}
        </BrowserRouter>
      </I18nProvider>
    </ThemeProvider>
  );
}
