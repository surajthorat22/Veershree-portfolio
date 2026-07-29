import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/index.ts",
  format: "esm",
  outDir: "./dist",
  clean: true,
  // Bundle workspace packages so the production image only needs dist/ + engines.
  deps: {
    alwaysBundle: [/@Veershree-portfolio\/.*/],
  },
});
