import { getErrorMessage } from "@/utils/api-error";
import { adminHeaders, apiClient } from "@/utils/ts-rest";

export async function fetchProjects() {
  const response = await apiClient.listProjects({});
  if (response.status !== 200) throw new Error(getErrorMessage(response.body));
  return response.body;
}

export async function fetchDashboard() {
  const response = await apiClient.getDashboard({ extraHeaders: adminHeaders() });
  if (response.status !== 200) throw new Error(getErrorMessage(response.body));
  return response.body;
}

export async function fetchAnalytics() {
  const response = await apiClient.getAnalytics({ extraHeaders: adminHeaders() });
  if (response.status !== 200) throw new Error(getErrorMessage(response.body));
  return response.body;
}

export async function fetchLeads() {
  const response = await apiClient.listLeads({ extraHeaders: adminHeaders() });
  if (response.status !== 200) throw new Error(getErrorMessage(response.body));
  return response.body;
}
