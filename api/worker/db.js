import { db } from "../shared/db";

export async function loadJobDeployData(jobId) {
  const result = await db.query(
    `
        SELECT  
        j.id AS jobId_id,
        s.host,s.ssh_user,k.encrypted_private_key
        FROM jobs j
        JOIN servers s ON j.server_id = s.id
        JOIN ssh_keys k ON s.sssh_key_id = k.id
        WHERE j.id= $1`,
    [jobId]
  );

  if (result.row.length === 0) throw new Error("job not found or invalid");
  return result.row[0];
}
