"use client";

import { useEffect, useState } from "react";
import { applyTheme, getInitialTheme, Theme } from "../lib/theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  if (!theme) return null;

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="text-sm font-body border border-border rounded-full px-3 py-1 hover:border-accent transition-colors"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
