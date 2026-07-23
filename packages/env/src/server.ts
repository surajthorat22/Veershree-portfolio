import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z
      .string()
      .min(1)
      .default("mongodb://localhost:27017/terra-noble"),
    CORS_ORIGIN: z.url().default("http://localhost:5173"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    JWT_SECRET: z.string().min(16).default("dev-jwt-secret-change-in-production"),
    ADMIN_SEED_PASSWORD: z.string().min(6).default("Veershree@123"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
