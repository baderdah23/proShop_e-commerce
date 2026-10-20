import "server-only";

type ApiErrorBody = {
  message?: string;
};

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json();

    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as ApiErrorBody).message === "string"
    ) {
      return (data as ApiErrorBody).message!;
    }
  } catch {
    // The response body wasn't valid JSON.
  }

  return `Request failed: ${response.status} ${response.statusText}`;
}

export async function serverFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const baseUrl = process.env.BACKEND_URL;

  if (!baseUrl) {
    throw new Error("BACKEND_URL is not configured");
  }

  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const normalizedPath = path.replace(/^\/+/, "");
  const url = `${normalizedBase}/${normalizedPath}`;

  const headers = new Headers(init.headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const response = await fetch(url, {
    ...init,
    headers,
    cache: init.cache ?? "no-store",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
