import { initClient, tsRestFetchApi } from "@ts-rest/core";
import { contract } from "@Veershree-portfolio/api/index";
import { env } from "@Veershree-portfolio/env/web";

import { getAuthToken } from "@/utils/auth";

export function adminHeaders(): Record<string, string> {
  const token = getAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export const apiClient = initClient(contract, {
  baseUrl: `${env.VITE_SERVER_URL}/rest`,
  baseHeaders: {},
  api: tsRestFetchApi,
});
