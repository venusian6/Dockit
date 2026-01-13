import express from "express";
import { authGuard } from "./api/authGuard.js";

import authRoutes from "./api/authRoutes.js";
import sshKeyRoutes from "./api/sshKeyRoutes.js";
import serverRoutes from "./api/serverRoutes.js";
import jobRoutes from "./api/jobRoutes.js";

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/ssh-keys", sshKeyRoutes);
app.use("/servers", serverRoutes);
app.use("/jobs", jobRoutes);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/me", authGuard, (req, res) => {
  res.json({ user: req.user });
});

app.listen(3000, () => {
  console.log("API running on port 3000");
});
