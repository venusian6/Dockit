import jwt from "jsonwebtoken";

import "dotenv/config";

export function createToken(user) {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}
