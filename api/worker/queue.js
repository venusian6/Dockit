import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export async function getNextJob() {
  const result = await redis.brpop("deploy:queue", 0);
  return result[1]; //jobId
}
