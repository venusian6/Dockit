import express from "express";
import { db } from "../shared/db.js";
import { encrypt } from "../shared/crypto.js";
import { authGuard } from "./authGuard.js";

const router = express.Router();

// router.post("/", authGuard, async (req, res) => {
//   const { public_key, private_key } = req.body;
//   console.log("REQ BODY:", req.body);

//   const userId = req.user.userId;
//   if (!public_key || !private_key) {
//     return res.status(400).json({ error: "All fields required" });
//   }

//   try {
//     const encryptedPrivateKey = encrypt(private_key);
//     const result = await db.query(
//       `INSERT INTO ssh_keys (user_id,public_key,encrypted_private_key)
//         VALUES ($1,$2,$3)
//         RETURNING id, public_key`,
//       [userId, public_key, encryptedPrivateKey]
//     );
//     res.json({
//       id: result.rows[0].id,
//       public_key: result.rows[0].public_key,
//     });
//   } catch (error) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to save SSH key" });
//   }
// });
router.post("/", authGuard, async (req, res) => {
  const { public_key, private_key_b64 } = req.body;

  // Debug (temporary)
  console.log("SSH KEY BODY:", req.body);

  if (!public_key || !private_key_b64) {
    return res.status(400).json({ error: "All fields required" });
  }

  // decode base64
  const private_key = Buffer.from(private_key_b64, "base64").toString("utf8");

  const encryptedPrivateKey = encrypt(private_key);

  const result = await db.query(
    `
    INSERT INTO ssh_keys (user_id, public_key, encrypted_private_key)
    VALUES ($1, $2, $3)
    RETURNING id
    `,
    [req.user.userId, public_key.trim(), encryptedPrivateKey]
  );

  res.json({ id: result.rows[0].id });
});

router.get("/", authGuard, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await db.query(
      `
      SELECT id, public_key, created_at
      FROM ssh_keys
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch keys" });
  }
});

router.get("/", authGuard, async (req, res) => {
  const result = await db.query(
    `SELECT id, host, ssh_user FROM servers WHERE user_id = $1`,
    [req.user.userId]
  );
  res.json(result.rows);
});

export default router;
