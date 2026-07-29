# syntax=docker/dockerfile:1

# Build from repo root:
#   docker build -f apps/server/Dockerfile -t veershree-api .
#
# Render restarts this service automatically if the container/process exits.
# Compose uses `restart: unless-stopped` for the same behavior locally.

FROM node:20-bookworm-slim AS base
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

FROM base AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/server/package.json ./apps/server/
COPY packages/api/package.json ./packages/api/
COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/
COPY packages/config/package.json ./packages/config/
# Skip lifecycle scripts until the full source (Prisma schema) is present.
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .
# prisma.config.ts loads apps/server/.env; dummy URL is enough for generate.
ENV DATABASE_URL="mongodb://localhost:27017/veershree-portfolio"
RUN pnpm --filter @Veershree-portfolio/db db:generate
RUN pnpm --filter server build
# Portable production package with runtime node_modules (workspace packages are already bundled).
RUN pnpm --filter server deploy --prod --legacy /deploy \
  && rm -rf /deploy/dist \
  && cp -R /app/apps/server/dist /deploy/dist

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nestjs

COPY --from=build --chown=nestjs:nodejs /deploy ./

USER nestjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/rest/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/index.mjs"]
