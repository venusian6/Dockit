import { write } from "fs";
import { loadJobDeployData } from "./db";
import { writeKeyFile } from "./keyfile";
import { decrypt } from "./crypto";
import { runSSHCommand } from "./ssh";

async function run() {
  const jobId = "J1"; //suppose

  const deployData = await loadJobDeployData(jobId);

  console.log("Deploy Data:");

  const privateKey = decrypt(deployData.encrypted_private_key);

  const keyPath = writeKeyFile(jobId, privateKey);

  const output = await runSSHCommand({
    host: deployData.host,
    ssh_user: deployData.ssh_user,
    keyPath,
    command: "whoami",
  });

  console.log("SSH key written at:", keyPath);
  console.log("SSH output:", output);

  console.log(deployData);
}

run();
