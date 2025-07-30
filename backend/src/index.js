import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB, sequelize } from "./db.js";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await connectDB();
    await sequelize.sync(); // dev only
    app.listen(PORT, () => {
      console.log(`?? API running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

start();
