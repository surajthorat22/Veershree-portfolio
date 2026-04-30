import type { Context } from "../context";

import { contract } from "../index";

export function createRouter(ctx: Context) {
  return {
    healthCheck: async () => {
      return {
        status: 200 as const,
        body: "OK" as const,
      };
    },
  };
}

export type AppRouter = ReturnType<typeof createRouter>;
