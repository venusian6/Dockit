import "dotenv";
import os from "os";
import { getNextJob } from "./queue.js";
import { loadJobDeployData } from "./loadJobDeploy.js";
import { decrypt } from "../shared/crypto.js";
import { markJobRunning, markJobSuccess, markJobFailed } from "./jobStatus.js";
import { runSSHCommand } from "./ssh.js";
import { buildDeployCommand } from "./deploy.js";
import fs from "fs";

const workerId = os.hostname();

function writeKeyFile(jobId, privateKey) {
  const path = `/tmp/key_${jobId}`;
  fs.writeFileSync(path, privateKey, { mode: 0o600 });
  return path;
}

function cleanupKeyFile(path) {
  if (path) fs.unlinkSync(path);
}

async function processJob(jobId) {
  let keyPath;

  try {
    console.log("▶️ Running job:", jobId);

    await markJobRunning(jobId);

    const deployData = await loadJobDeployData(jobId);

    const privateKey = decrypt(deployData.encrypted_private_key);
    keyPath = writeKeyFile(jobId, privateKey);

    const command = buildDeployCommand();

    await runSSHCommand({
      host: deployData.host,
      ssh_user: deployData.ssh_user,
      keyPath,
      command,
    });

    await markJobSuccess(jobId);
    console.log("✅ Job success:", jobId);
  } catch (err) {
    await markJobFailed(jobId, err.toString());
    console.error("❌ Job failed:", jobId, err);
  } finally {
    cleanupKeyFile(keyPath);
  }
}

async function startWorker() {
  console.log("🚀 Worker started");

  while (true) {
    const jobId = await getNextJob();
    await processJob(jobId);
  }
}

startWorker();
