import { exec } from "child_process";
import { error } from "console";
import { stderr, stdout } from "process";
export function runSSHCommand({ host, ssh_user, keyPath, command }) {
  return new Promise((resolve, reject) => {
    const sshCommand = ` ssh -o StrictHostKeyChecking=no\
        -i ${keyPath}\
        ${ssh_user}@${host}\
        "${command}"`;

    exec(sshCommand, (error, stdout, stderr) => {
      if (error) return reject(stderr || error.message);
      resolve(stdout.trim());
    });
  });
}
