import { Injectable, UnauthorizedException } from "@nestjs/common";
import type { OnModuleInit } from "@nestjs/common";
import { Inject } from "@nestjs/common";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "@Veershree-portfolio/env/server";

import { PrismaService } from "../prisma/prisma.service";

const SEED_USERS = ["admin", "veershree1", "veershree2"] as const;

export type AuthUser = {
  id: string;
  username: string;
};

export type LoginResult = {
  token: string;
  user: AuthUser;
};

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const count = await this.prisma.client.adminUser.count();
    if (count > 0) return;

    const passwordHash = await bcrypt.hash(env.ADMIN_SEED_PASSWORD, 10);
    await this.prisma.client.adminUser.createMany({
      data: SEED_USERS.map((username) => ({ username, passwordHash })),
    });
    console.log(`Seeded admin users: ${SEED_USERS.join(", ")} (password: ${env.ADMIN_SEED_PASSWORD})`);
  }

  async login(username: string, password: string): Promise<LoginResult> {
    const user = await this.prisma.client.adminUser.findUnique({ where: { username } });
    if (!user) throw new UnauthorizedException("Invalid username or password");

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException("Invalid username or password");

    const token = jwt.sign({ sub: user.id, username: user.username }, env.JWT_SECRET, { expiresIn: "7d" });
    return { token, user: { id: user.id, username: user.username } };
  }

  verifyToken(token: string): AuthUser {
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string; username: string };
      return { id: payload.sub, username: payload.username };
    } catch {
      throw new UnauthorizedException("Invalid or expired session");
    }
  }
}
