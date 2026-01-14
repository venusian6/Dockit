import { rejects } from "assert";
import { exec } from "child_process";
import { error } from "console";
import { resolve } from "path";
import { stderr, stdout } from "process";

export function runSSHCommand({ host, ssh_user, keyPath, command }) {
  return new Promise((resolve, reject) => {
    const sshCmd = `
        ssh -i ${keyPath} -o StrictHostKeyChecking=no ${ssh_user}@${host} "${command}"`;

    exec(sshCmd, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr || error.message);
      }
      resolve(stdout);
    });
  });
}
