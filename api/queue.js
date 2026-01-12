import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export async function enqueueJob(jobId) {
  await redis.lpush("deploy:queue", jobId);
}
