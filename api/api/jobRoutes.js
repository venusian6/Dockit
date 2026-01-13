import express from "express";
import { authGuard } from "./authGuard.js";
import { db } from "../shared/db.js";
import { enqueueJob } from "./queue.js";

const router = express.Router();
router.post("/", authGuard, async (req, res) => {
  const { server_id } = req.body;
  const userId = req.user.userId;

  if (!server_id) {
    return res.status(400).json({ error: "server_id required" });
  }

  try {
    // 1️⃣ verify server belongs to user
    const serverCheck = await db.query(
      `
      SELECT id
      FROM servers
      WHERE id = $1 AND user_id = $2
      `,
      [server_id, userId]
    );

    if (serverCheck.rows.length === 0) {
      return res.status(403).json({ error: "Invalid server" });
    }

    // 2️⃣ create job
    const result = await db.query(
      `
      INSERT INTO jobs (user_id, server_id)
      VALUES ($1, $2)
      RETURNING id, status, created_at
      `,
      [userId, server_id]
    );

    const job = result.rows[0];

    // 3️⃣ enqueue job
    await enqueueJob(job.id);

    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create job" });
  }
});

router.get("/", authGuard, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await db.query(
      `
      SELECT id, server_id, status, created_at, finished_at
      FROM jobs
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});
export default router;
