"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "codeleap_username";

type UserContextType = {
  username: string | null;
  setUsername: (name: string | null) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [username, setUsernameState] = useState<string | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setUsernameState(stored ? stored : null);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  const setUsername = useCallback((name: string | null) => {
    setUsernameState(name);
    if (name === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, name);
    }
  }, []);

  const logout = useCallback(() => {
    setUsernameState(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<UserContextType>(
    () => ({ username, setUsername, logout }),
    [username, setUsername, logout]
  );

  if (!hasHydrated) return null;

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
