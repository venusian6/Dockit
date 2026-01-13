import express from "express";
import { authGuard } from "./api/authGuard.js";

import authRoute from "./api/authRoutes.js";
const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/me", authGuard, (req, res) => {
  res.json({ user: req.user });
});

app.listen(3000, () => {
  console.log("API running on port 3000");
});
