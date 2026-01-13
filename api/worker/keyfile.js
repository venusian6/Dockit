import fs from "fs";

import path from "path";

export function writeKeyFile(jobId, privateKey) {
  const dir = "/tmp/dockit";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = path.join(dir, `${jobId}.pem`);

  fs.writeFileSync(filePath, privateKey, { mode: 0o600 });
  return filePath;
}
