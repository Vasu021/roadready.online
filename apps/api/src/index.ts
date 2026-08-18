import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth";
import countryRoutes from "./routes/countries";
import topicRoutes from "./routes/topics";
import quizRoutes from "./routes/quizzes";
import questionRoutes from "./routes/questions";
import progressRoutes from "./routes/progress";
import { errorHandler } from "./lib/http";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/progress", progressRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Must be registered last — Express selects error middleware by arity.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
