import { Injectable, UnauthorizedException } from "@nestjs/common";
import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { env } from "@Veershree-portfolio/env/server";

function extractBearerToken(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const m = value.match(/^Bearer\s+(.+)$/i);
  return m?.[1]?.trim() ? m[1].trim() : null;
}

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Non-breaking dev default: if no token is configured, allow writes.
    // In production, a token should be configured to protect write endpoints.
    const configuredToken = env.ADMIN_TOKEN;
    if (!configuredToken) return true;

    const req = context.switchToHttp().getRequest<{ headers?: Record<string, unknown> }>();
    const authHeader = req?.headers?.authorization;
    const bearer = extractBearerToken(authHeader);
    const token = bearer ?? (typeof req?.headers?.["x-admin-token"] === "string" ? String(req.headers["x-admin-token"]).trim() : "");

    if (token && token === configuredToken) return true;
    throw new UnauthorizedException("Admin authentication required");
  }
}

