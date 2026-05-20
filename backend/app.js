import express from "express";
import cors from "cors";
import jobRoutes from "./routes/jobRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({ error: err.message });
  });

app.use("/api", jobRoutes);

export default app;