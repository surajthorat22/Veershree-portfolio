import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "../../..");
const generatedDir = join(repoRoot, "packages/db/prisma/generated");
const distDir = join(here, "../dist");

mkdirSync(distDir, { recursive: true });

if (!existsSync(generatedDir)) {
  console.warn(`[copy-prisma-engine] Missing ${generatedDir}; run prisma generate first.`);
  process.exit(0);
}

const engines = readdirSync(generatedDir).filter((name) => name.includes("libquery_engine") || name.endsWith(".so.node") || name.endsWith(".dll.node") || name.endsWith(".dylib.node"));

if (engines.length === 0) {
  console.warn("[copy-prisma-engine] No Prisma engine binaries found.");
  process.exit(0);
}

for (const engine of engines) {
  copyFileSync(join(generatedDir, engine), join(distDir, engine));
  console.log(`[copy-prisma-engine] Copied ${engine} -> dist/`);
}
