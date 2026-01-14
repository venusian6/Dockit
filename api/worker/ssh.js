import { exec } from "child_process";

export function runSSHCommand({ host, ssh_user, keyPath, command, onLog }) {
  return new Promise((resolve, reject) => {
    const sshCmd =
      `ssh -i ${keyPath} ` +
      `-o StrictHostKeyChecking=no ` +
      `${ssh_user}@${host} ` +
      `"${command}"`;

    const child = exec(sshCmd);

    child.stdout.on("data", (data) => {
      onLog?.(data.toString());
    });

    child.stderr.on("data", (data) => {
      onLog?.(data.toString());
    });

    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`SSH exited with code ${code}`));
    });
  });
}
