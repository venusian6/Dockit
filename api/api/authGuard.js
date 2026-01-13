import jwt from "jsonwebtoken";

import "dotenv/config";

export function authGuard(req, res, next) {
  const header = req.header.authorization;
  if (!header || !header.startsWith("Bearer")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = header.split(" ")[1]; //not 0 because 0 is bearer string
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid Tokens" });
  }
}
