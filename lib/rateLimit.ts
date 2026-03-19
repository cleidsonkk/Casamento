import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const memory = new Map<string, { count: number; resetAt: number }>();

function memoryLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = memory.get(key);
  if (!current || current.resetAt < now) {
    memory.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, reset: now + windowMs };
  }
  if (current.count >= limit) return { success: false, reset: current.resetAt };
  current.count += 1;
  memory.set(key, current);
  return { success: true, reset: current.resetAt };
}

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const ratelimit =
  redisUrl && redisToken
    ? new Ratelimit({
        redis: new Redis({ url: redisUrl, token: redisToken }),
        limiter: Ratelimit.fixedWindow(10, "1 m"),
      })
    : null;

export async function enforceRateLimit(key: string, limit = 10, windowMs = 60_000) {
  if (!ratelimit) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[rate-limit] Using in-memory fallback");
    }
    return memoryLimit(key, limit, windowMs);
  }
  try {
    const res = await ratelimit.limit(key);
    return { success: res.success, reset: res.reset };
  } catch (error) {
    console.error("[rate-limit] External limiter failed, using in-memory fallback", error);
    return memoryLimit(key, limit, windowMs);
  }
}
