import { Injectable } from "@nestjs/common";
import type { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import prisma from "@Veershree-portfolio/db";

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // Prisma's generated client types live in the workspace package, and referring to them
  // here leaks non-portable internal types into the server build output.
  public readonly client: any = prisma as any;

  async onModuleInit() {
    // Avoid failing server boot when the database isn't running yet.
    // Prisma will connect on first query, and errors will surface per-request.
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}

