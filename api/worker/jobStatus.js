import { db } from "../shared/db.js";

export async function markJobRunning(jobId) {
  await db.query(
    `UPDATE jobs
    
    
    SET status = "running", started_at = NOW()
    WHERE id=$1`,
    [jobId]
  );
}

export async function markJobSuccess(jobId) {
  await db.query(
    `
    UPDATE jobs
    SET status = 'success', finished_at = NOW()
    WHERE id = $1
    `,
    [jobId]
  );
}

export async function markJobFailed(jobId, error) {
  await db.query(
    `
    UPDATE jobs
    SET status = 'failed',
        error_message = $2,
        finished_at = NOW()
    WHERE id = $1
    `,
    [jobId, error]
  );
}
