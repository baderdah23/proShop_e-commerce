"use client";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
  const data = useContext(AuthContext);
  return data;
}
