import express from "express";
import bcrypt from "bcrypt";
import { db } from "../shared/db.js";
import { createToken } from "./auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // 1. basic validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    // 2. hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. insert user
    const result = await db.query(
      `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email
      `,
      [email, passwordHash]
    );

    const user = result.rows[0];

    // 4. create token
    const token = createToken(user);

    // 5. return response
    res.json({ user, token });
  } catch (err) {
    if (err.code === "23505") {
      // unique violation
      return res.status(400).json({ error: "Email already exists" });
    }

    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    // 1. get user
    const result = await db.query(
      `
      SELECT id, email, password_hash
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    // 2. compare password
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3. create token
    const token = createToken(user);

    res.json({
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
