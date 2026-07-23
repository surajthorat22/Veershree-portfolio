import { Injectable, UnauthorizedException } from "@nestjs/common";
import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { Inject } from "@nestjs/common";

import { AuthService } from "../modules/auth/auth.service";

function extractBearerToken(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const m = value.match(/^Bearer\s+(.+)$/i);
  return m?.[1]?.trim() ? m[1].trim() : null;
}

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(@Inject(AuthService) private readonly auth: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{
      headers?: Record<string, unknown>;
      adminUser?: { id: string; username: string };
    }>();

    const authHeader = req?.headers?.authorization;
    const bearer = extractBearerToken(authHeader);
    const token = bearer ?? (typeof req?.headers?.["x-admin-token"] === "string" ? String(req.headers["x-admin-token"]).trim() : "");

    if (!token) throw new UnauthorizedException("Admin authentication required");

    const user = this.auth.verifyToken(token);
    req.adminUser = user;
    return true;
  }
}
