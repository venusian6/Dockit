// import crypto from "crypto";

// const algorithm = "aws-256-cbc";

// const secret = process.env.MASTER_KEY;

// // convert secret to fixed -length key

// const key = crypto.createHash("sha256").update(secret).digest();

// export function decrypt(encryptedText) {
//   const parts = encryptedText.split(":");

//   const iv = Buffer.from(parts[0], "hex");
//   const encrypted = Buffer.from(parts[1], "hex");

//   const decipher = crypto.createDecipheriv(algorithm, key, iv);
//   let decypted = decipher.update(encrypted);
//   decypted = Buffer.concat([decypted, decipher.final()]);
//   return decrypted.toString();
// }
