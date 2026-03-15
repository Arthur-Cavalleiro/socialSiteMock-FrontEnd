"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  useMemo,
} from "react";

const STORAGE_KEY = "codeleap_theme";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return "light";
}

const themeStore = {
  theme: "light" as Theme,
  listeners: new Set<() => void>(),
  getSnapshot() {
    return this.theme;
  },
  getServerSnapshot() {
    return "light" as Theme;
  },
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  setTheme(value: Theme) {
    if (this.theme === value) return;
    this.theme = value;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, value);
      document.documentElement.classList.toggle("dark", value === "dark");
    }
    this.listeners.forEach((l) => l());
  },
  init() {
    if (typeof window === "undefined") return;
    this.theme = getStoredTheme();
  },
};

if (typeof window !== "undefined") {
  themeStore.init();
}

export function ThemeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const theme = useSyncExternalStore(
    (cb) => themeStore.subscribe(cb),
    () => themeStore.getSnapshot(),
    () => themeStore.getServerSnapshot()
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setTheme = useCallback((value: Theme) => {
    themeStore.setTheme(value);
  }, []);

  const toggleTheme = useCallback(() => {
    themeStore.setTheme(theme === "dark" ? "light" : "dark");
  }, [theme]);

  const value = useMemo<ThemeContextType>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
