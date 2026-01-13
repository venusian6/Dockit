import express from "express";
import bcrypt from "bcrypt";
import { db } from "../shared/db.js";
import { createToken } from "./auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  //basic validation

  if (!email || !password) {
    res.status(400).json({ error: "Email and password req" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    // insert user

    const result = await db.query(
      `INSERT INTO users (email,password_hash) Values ($1,$2) RETRUNING id, email`,
      [email, passwordHash]
    );

    const user = result.rows[0];

    // create Token

    const token = createToken(user);

    // return response

    res.json({ user, token });
  } catch (error) {
    if (error.code === "23505") {
      //unique violation
      return res.status(400).json({ error: "Email already exists" });
    }
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password req" });
  }

  try {
    // get user

    const result = await db.query(
      `SELECT id,email,password_hash
        FROM users
        WHERE email=$1`,
      [email]
    );

    if (result.rowCount.length === 0) {
      res.status(401).json({ error: "Invalid Credentials" });
    }
    const user = result.rows[0];

    // compare password

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      res.status(401).json({ error: "Invalid pass" });
    }

    // create token

    const token = createToken(user);
    res.json({
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (error) {}
});

export default router;
