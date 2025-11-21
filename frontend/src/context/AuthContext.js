import { createContext, useMemo, useState } from "react";
import { AUTH_STORAGE_KEY } from "../constants";

const defaultContext = {
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
};

const readStoredSession = () => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const AuthContext = createContext(defaultContext);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStoredSession());

  const login = ({ token, user }) => {
    if (!token) {
      throw new Error("Token JWT manquant");
    }
    const payload = { token, profile: user || null };
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
    setSession(payload);
  };

  const logout = () => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setSession(null);
  };

  const value = useMemo(
    () => ({
      user: session,
      isAuthenticated: Boolean(session?.token),
      login,
      logout,
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
