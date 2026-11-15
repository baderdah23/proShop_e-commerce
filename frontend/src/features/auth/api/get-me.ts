"use client";

import { clientFetch } from "@/lib/api/client";
import type { MeResponse, User } from "../types/auth.types";

export async function getMe(): Promise<User | null> {
  try {
    const res = await clientFetch<MeResponse>("auth/me", {
      method: "GET",
      credentials: "include",
    });
    return res.user ?? null;
  } catch {
    console.log("user not found!");
    return null;
  }
}
