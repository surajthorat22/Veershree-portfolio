import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "node:path";
import { env } from "@Veershree-portfolio/env/server";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });

  app.setGlobalPrefix("rest");
  app.useStaticAssets(join(process.cwd(), "uploads"), { prefix: "/rest/uploads/" });

  app.enableCors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  });

  await app.listen(3000);
  console.log("Server is running on http://localhost:3000");
}

bootstrap();
