import { db } from "../shared/db";

export async function loadJobDeployData(jobId) {
  const result = await db.query(
    `
        SELECT
        j.id AS job_id,
        s.id AS server_id
        s.host, s.ssh_user
        k.encrypted_private_key
        FROM job j
        JOIN servers s ON j.server_id = s.id
        JOIN ssh_keys k ON s.ssh_key_id=k.id
        WHERE j.id =$1

        `,
    [jobId]
  );
  if (result.rows.length === 0) {
    throw new Error("Invalid job");
  }

  return result.rows[0];
}
