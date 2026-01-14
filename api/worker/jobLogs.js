import { db } from "../shared/db.js";

export async function addJobLog(jobId, message) {
  await db.query(
    `
    INSERT INTO job_logs (job_id, message)
    VALUES ($1, $2)
    `,
    [jobId, message]
  );
}
