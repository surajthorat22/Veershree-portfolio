import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z
      .string()
      .min(1)
      .default("mongodb://localhost:27017/veershree-portfolio"),
    CORS_ORIGIN: z.string().min(1).default("http://localhost:5173"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().int().positive().default(3000),
    JWT_SECRET: z.string().min(16).default("dev-jwt-secret-change-in-production"),
    ADMIN_SEED_PASSWORD: z.string().min(6).default("Veershree@123"),
    CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
    CLOUDINARY_API_KEY: z.string().min(1).optional(),
    CLOUDINARY_API_SECRET: z.string().min(1).optional(),
    CLOUDINARY_FOLDER: z.string().min(1).default("veershree"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export function getCorsOrigins(): string[] | true {
  const raw = env.CORS_ORIGIN.trim();
  if (raw === "*") return true;
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function hasCloudinaryConfig(): boolean {
  return Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
}
