import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1).optional(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  CLOUDINARY_URL: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

export const env = envSchema.parse(process.env);

export function warnIfCriticalEnvMissing() {
  if (env.NODE_ENV !== "production") return;
  if (!env.NEXTAUTH_SECRET) {
    console.warn("[env] NEXTAUTH_SECRET missing in production");
  }
  if (!env.DATABASE_URL) {
    console.warn("[env] DATABASE_URL missing in production");
  }
}

