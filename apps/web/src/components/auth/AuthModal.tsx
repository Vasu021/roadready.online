import { useEffect, useState } from "react";
import { api, errorMessage, setStoredToken } from "../../utils/api";
import { useUserStore } from "../../store/userStore";
import { Spinner } from "../layout";
import { t } from "../../i18n";

const MIN_PASSWORD_LENGTH = 8;

export default function AuthModal() {
  const setShowAuthModal = useUserStore((s) => s.setShowAuthModal);
  const setUser = useUserStore((s) => s.setUser);
  const setSelectedCountry = useUserStore((s) => s.setSelectedCountry);
  const authModalMode = useUserStore((s) => s.authModalMode);

  const [mode, setMode] = useState(authModalMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const close = () => setShowAuthModal(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function switchMode(next: "login" | "register") {
    setMode(next);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fn = mode === "login" ? api.auth.login : api.auth.register;
      const { token, user } = await fn({
        email,
        password,
        ...(mode === "register" && name ? { name } : {}),
      });
      setStoredToken(token);
      setUser(user);
      // A returning user keeps whichever country their account is set to.
      if (user.selectedCountryCode) {
        const countries = await api.countries.list();
        const match = countries.find(
          (c) => c.code === user.selectedCountryCode,
        );
        if (match) setSelectedCountry(match);
      }
      close();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-5 backdrop-blur-sm"
      onClick={close}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={mode === "login" ? t("Sign in") : t("Create account")}
        className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">
              {mode === "login" ? t("Welcome back") : t("Create your account")}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {mode === "login"
                ? t("Pick up where you left off.")
                : t("Free to start — no card needed.")}
            </p>
          </div>
          <button
            onClick={close}
            aria-label={t("Close")}
            className="-mr-1 -mt-1 rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <Field label={t("Name")} hint={t("optional")}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("How should we greet you?")}
                className={inputClass}
              />
            </Field>
          )}

          <Field label={t("Email")}>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </Field>

          <Field label={t("Password")}>
            <input
              type="password"
              required
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                mode === "register"
                  ? t("At least {n} characters", { n: MIN_PASSWORD_LENGTH })
                  : "••••••••"
              }
              className={inputClass}
            />
          </Field>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
          >
            {loading && <Spinner size="sm" />}
            {mode === "login" ? t("Sign in") : t("Create account")}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          {mode === "login" ? (
            <>
              {t("No account yet?")}{" "}
              <button
                onClick={() => switchMode("register")}
                className="font-medium text-blue-400 hover:underline"
              >
                {t("Sign up")}
              </button>
            </>
          ) : (
            <>
              {t("Already registered?")}{" "}
              <button
                onClick={() => switchMode("login")}
                className="font-medium text-blue-400 hover:underline"
              >
                {t("Sign in")}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-1.5 text-xs font-medium text-slate-400">
        {label}
        {hint && <span className="text-slate-600">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
