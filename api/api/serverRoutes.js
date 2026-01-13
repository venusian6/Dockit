import express from "express";
import { db } from "../shared/db.js";
import { encrypt } from "../shared/crypto.js";
import { authGuard } from "./authGuard.js";

const router = express.Router();

router.post("/", authGuard, async (req, res) => {
  const { host, ssh_user, ssh_key_id } = req.body;
  const userId = req.user.userId; // 👈 from authGuard

  if (!host || !ssh_user || !ssh_key_id) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    // 1️⃣ verify SSH key belongs to this user
    const keyCheck = await db.query(
      `
      SELECT id
      FROM ssh_keys
      WHERE id = $1 AND user_id = $2
      `,
      [ssh_key_id, userId]
    );

    if (keyCheck.rows.length === 0) {
      return res.status(403).json({ error: "Invalid SSH key" });
    }

    // 2️⃣ insert server
    const result = await db.query(
      `
      INSERT INTO servers (user_id, host, ssh_user, ssh_key_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, host, ssh_user
      `,
      [userId, host, ssh_user, ssh_key_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add server" });
  }
});

router.get("/", authGuard, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await db.query(
      `
      SELECT id, host, ssh_user, created_at
      FROM servers
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch servers" });
  }
});

export default router;
