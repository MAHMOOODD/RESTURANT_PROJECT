"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  const toggleTheme = () => {
    const nextDark = !isDark;

    document.documentElement.classList.toggle("dark", nextDark);

    localStorage.setItem("theme", nextDark ? "dark" : "light");

    setIsDark(nextDark);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="p-2 rounded-xl border border-border bg-card text-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-500" />
      )}
    </button>
  );
}
