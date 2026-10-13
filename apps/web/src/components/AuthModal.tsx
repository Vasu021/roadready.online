import { useState } from "react";
import { api, setStoredToken } from "../utils/api";
import { useUserStore } from "../store/userStore";

type Mode = "login" | "signup";

export default function AuthModal() {
  const setShowAuthModal = useUserStore((s) => s.setShowAuthModal);
  const setUser = useUserStore((s) => s.setUser);
  const authModalMode = useUserStore((s) => s.authModalMode);
  // Initialise the tab from the store so "Get Started" opens register, "Sign In" opens login
  const [mode, setMode] = useState<Mode>(
    authModalMode === "register" ? "signup" : "login",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const fn = mode === "login" ? api.auth.login : api.auth.register;
      const { token, user } = await fn({ email, password });
      setStoredToken(token);
      setUser({ id: user.id, email: user.email });
      setShowAuthModal(false);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={() => setShowAuthModal(false)}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-line bg-ground p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink">
              {mode === "login" ? "Sign In" : "Create Account"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {mode === "login"
                ? "Track your progress across sessions."
                : "Save your results and track improvement."}
            </p>
          </div>
          <button
            onClick={() => setShowAuthModal(false)}
            className="text-faint transition hover:text-muted"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder-gray-600 focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                mode === "signup" ? "At least 8 characters" : "••••••••"
              }
              className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder-gray-600 focus:border-accent focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-wrong">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-ink transition hover:bg-accent/85 disabled:opacity-60"
          >
            {loading ? "..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Mode toggle */}
        <p className="mt-5 text-center text-sm text-faint">
          {mode === "login" ? (
            <>
              No account?{" "}
              <button
                onClick={() => switchMode("signup")}
                className="text-accent hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have one?{" "}
              <button
                onClick={() => switchMode("login")}
                className="text-accent hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
