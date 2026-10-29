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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";

export async function clientFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const isAbsolute = /^https?:\/\//i.test(path);

  if (!isAbsolute && !API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL in environment");
  }

  const url = isAbsolute ? path : `${API_BASE_URL}/${path.replace(/^\//, "")}`;

  const headers = new Headers(init.headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const response = await fetch(url, {
    ...init,
    headers,
    credentials: init.credentials,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
