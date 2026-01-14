import { exec } from "child_process";

export function runSSHCommand({ host, ssh_user, keyPath, command }) {
  return new Promise((resolve, reject) => {
    const sshCmd =
      `ssh -i ${keyPath} ` +
      `-o StrictHostKeyChecking=no ` +
      `${ssh_user}@${host} ` +
      `"${command}"`;

    console.log("🧪 SSH CMD:", sshCmd);

    exec(sshCmd, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr || error.message);
      }
      resolve(stdout);
    });
  });
}
