import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { env, getCorsOrigins, getUploadDir } from "@Veershree-portfolio/env/server";

import { AppModule } from "./app.module";

function assertProductionSecrets() {
  if (env.NODE_ENV !== "production") return;

  const insecureSecrets = [
    env.JWT_SECRET === "dev-jwt-secret-change-in-production",
    env.ADMIN_SEED_PASSWORD === "Veershree@123",
    env.JWT_SECRET.length < 32,
  ];

  if (insecureSecrets.some(Boolean)) {
    throw new Error(
      "Refusing to start: set strong JWT_SECRET (32+ chars) and ADMIN_SEED_PASSWORD in production."
    );
  }
}

async function bootstrap() {
  assertProductionSecrets();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });

  const uploadDir = getUploadDir();
  app.setGlobalPrefix("rest");
  app.useStaticAssets(uploadDir, { prefix: "/rest/uploads/" });

  const corsOrigin = getCorsOrigins();
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  const port = env.PORT;
  await app.listen(port, "0.0.0.0");
  console.log(`Server is running on http://0.0.0.0:${port}`);
}

bootstrap().catch((err) => {
  console.error("Fatal bootstrap error:", err);
  process.exit(1);
});
