"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import { getMe } from "../api/get-me";
import type { User } from "../types/auth.types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  refetch: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    try {
      setIsLoading(true);
      const me = await getMe();
      setUser(me);
    } catch (err: unknown) {
      throw new Error(
        err instanceof Error ? err.message : "you are not Authenticated",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    setUser,
    refetch: load,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
