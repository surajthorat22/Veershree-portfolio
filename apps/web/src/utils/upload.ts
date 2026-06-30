import { env } from "@Veershree-portfolio/env/web";

import { getErrorMessage } from "@/utils/api-error";
import { adminHeaders } from "@/utils/ts-rest";

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const response = await fetch(`${env.VITE_SERVER_URL}/rest/uploads/image`, {
    method: "POST",
    headers: adminHeaders(),
    body: form,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(getErrorMessage(body ?? { message: "Image upload failed" }));
  }

  const data = (await response.json()) as { url: string };
  return data.url.startsWith("http") ? data.url : `${env.VITE_SERVER_URL}${data.url}`;
}
