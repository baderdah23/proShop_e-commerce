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

export async function clientFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("clientFetch requires a same-origin path");
  }

  const headers = new Headers(init.headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const response = await fetch(path, {
    ...init,
    headers,
    credentials: init.credentials ?? "same-origin",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
