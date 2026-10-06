"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { User } from "@/shared/types";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  signupUser,
  updateUserProfile,
} from "../api/auth-api";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (
    fullName: string,
    email: string,
    phone: string,
    password: string,
  ) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: Pick<User, "full_name" | "email" | "phone">) => Promise<User>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getCurrentUser().then((currentUser) => {
      if (isMounted) {
        setUser(currentUser);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const authenticatedUser = await loginUser(email, password);
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const signup = useCallback(
    async (
      fullName: string,
      email: string,
      phone: string,
      password: string,
    ) => {
      const authenticatedUser = await signupUser(
        fullName,
        email,
        phone,
        password,
      );
      setUser(authenticatedUser);
      return authenticatedUser;
    },
    [],
  );

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data: Pick<User, "full_name" | "email" | "phone">) => {
    const updatedUser = await updateUserProfile(data);
    setUser(updatedUser);
    return updatedUser;
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, signup, logout, updateProfile }),
    [user, isLoading, login, signup, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
