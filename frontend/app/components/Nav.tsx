"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border"
          : ""
      }`}
    >
      <nav className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#" className="font-heading font-medium">
          Bigyan Luitel
        </a>

        <div className="hidden md:flex items-center gap-6 font-body text-sm">
          <a href="#projects" className="hover:text-accent transition-colors">
            Projects
          </a>
          <a href="#contact" className="hover:text-accent transition-colors">
            Contact
          </a>
        </div>

        <ThemeToggle />
      </nav>
    </header>
  );
}
