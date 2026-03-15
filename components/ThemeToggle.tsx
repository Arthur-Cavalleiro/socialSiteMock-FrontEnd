"use client";

import { useTheme } from "@/context/ThemeContext";
import { Button } from "./Button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Activate light mode" : "Activate dark mode"}
    >
      {theme === "dark" ? "Light" : "Dark"}
    </Button>
  );
}
