import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import scenarioRoutes from "./routes/scenarios";
import topicTestRoutes from "./routes/topicTests";
import finalTestRoutes from "./routes/finalTest";
import moduleRoutes from "./routes/modules";
import countryRoutes from "./routes/countries";
import testSessionRoutes from "./routes/testSessions";
import userRoutes from "./routes/users";
import progressRoutes from "./routes/progress";
import authRoutes from "./routes/auth";
import userCountryAccessRoutes from "./routes/userCountryAccess";
import { requireAuth } from "./middleware/auth";
import { rateLimit } from "./middleware/rateLimit";
import { errorHandler, notFound } from "./middleware/errors";

const app = express();
const PORT = process.env.PORT ?? 3001;
const isProduction = process.env.NODE_ENV === "production";

// Behind a proxy (Railway, Fly, nginx) req.ip must come from X-Forwarded-For,
// otherwise every request looks like it comes from the proxy and the rate
// limiter would throttle all users together.
if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

app.disable("x-powered-by");
app.use(helmet());

/**
 * Allowed browser origins. Defaults to the local dev frontend; set
 * CORS_ORIGIN to a comma-separated list in production.
 */
const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Same-origin and non-browser clients (curl, health checks) send no Origin.
      // An unknown origin is refused by omitting the header rather than by
      // throwing — the browser blocks the response and the server logs stay clean.
      callback(null, !origin || allowedOrigins.includes(origin));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86_400,
  }),
);

// Requests carry small JSON bodies only — cap them well below the default.
app.use(express.json({ limit: "32kb" }));

// Credential endpoints get a tight window; everything else a generous one.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many attempts. Please wait a few minutes and try again.",
});
const apiLimiter = rateLimit({ windowMs: 60 * 1000, max: 300 });

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", apiLimiter);

// ── Public surface ───────────────────────────────────────────────────────────
// Deliberately only two things: the credential endpoints, and the country list
// and facts the signed-out landing page shows. Nothing else.
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/countries", countryRoutes);

// ── Everything else requires a verified session ──────────────────────────────
// Authentication is applied here, at the mount, rather than route by route.
// A new route added to any of these files is therefore protected by default:
// forgetting a `requireAuth` inside them cannot expose it. The course content
// is the product, so it is not readable without an account — the frontend's
// route guard is a convenience, never the boundary.
app.use("/api/scenarios", requireAuth, scenarioRoutes);
app.use("/api/modules", requireAuth, moduleRoutes);
app.use("/api/topic-tests", requireAuth, topicTestRoutes);
app.use("/api/final-test", requireAuth, finalTestRoutes);
app.use("/api/test-sessions", requireAuth, testSessionRoutes);
app.use("/api/users", requireAuth, userRoutes);
app.use("/api/progress", requireAuth, progressRoutes);
app.use("/api/user-country-access", requireAuth, userCountryAccessRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
  console.log(
    `  mode: ${isProduction ? "production" : "development"} · CORS: ${allowedOrigins.join(", ")}`,
  );
});
