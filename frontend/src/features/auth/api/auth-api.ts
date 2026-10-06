import type { User } from "@/shared/types";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}

function getAuthErrorMessage(payload: AuthResponse): string {
  if (typeof payload.message === "string") return payload.message;
  return "تعذر إكمال العملية.";
}

async function authRequest(
  endpoint: string,
  options?: RequestInit,
): Promise<AuthResponse> {
  const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  const payload = (await response.json()) as AuthResponse;
  if (!response.ok || !payload.success) {
    throw new Error(getAuthErrorMessage(payload));
  }

  return payload;
}

/**
 * Restores the current user from the backend's httpOnly session cookie.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await authRequest("/auth/me");
    return response.user || null;
  } catch {
    return null;
  }
}

/**
 * Authenticates a user and returns the user attached to the new session.
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<User> {
  const response = await authRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!response.user) {
    throw new Error("لم يتم إرجاع بيانات المستخدم.");
  }

  return response.user;
}

/**
 * Creates a user account and returns the user attached to the new session.
 */
export async function signupUser(
  fullName: string,
  email: string,
  phone: string,
  password: string,
): Promise<User> {
  const response = await authRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      full_name: fullName,
      email,
      phone,
      password,
    }),
  });

  if (!response.user) {
    throw new Error("لم يتم إرجاع بيانات المستخدم.");
  }

  return response.user;
}

/**
 * Invalidates the current backend session.
 */
export async function logoutUser(): Promise<void> {
  await authRequest("/auth/logout", { method: "POST" });
}

export async function updateUserProfile(data: Pick<User, "full_name" | "email" | "phone">): Promise<User> {
  const response = await authRequest("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!response.user) throw new Error("لم يتم إرجاع بيانات المستخدم.");
  return response.user;
}

export async function requestPasswordReset(email: string): Promise<void> {
  await authRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(
  email: string,
  resetCode: string,
  password: string,
): Promise<void> {
  await authRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, resetCode, password }),
  });
}
