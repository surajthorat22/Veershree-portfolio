import { PrismaClient } from "../prisma/generated/client";
import { env } from "@Veershree-portfolio/env/server";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
  },
});

export default prisma;
