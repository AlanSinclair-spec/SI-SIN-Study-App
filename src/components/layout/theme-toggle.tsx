"use client";

import { useTheme } from "@/contexts/theme-context";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const next = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
  };

  return (
    <button
      onClick={next}
      className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground"
      title={`Theme: ${theme}`}
    >
      {theme === "dark" && <Moon className="w-4 h-4" />}
      {theme === "light" && <Sun className="w-4 h-4" />}
      {theme === "system" && <Monitor className="w-4 h-4" />}
    </button>
  );
}
