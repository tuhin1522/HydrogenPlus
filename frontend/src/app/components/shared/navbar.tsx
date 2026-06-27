"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NavItem = {
  label: string;
  href?: string;
  items?: string[];
};

const desktopMenu: NavItem[] = [
  { label: "Home", href: "#home" },
  {
    label: "Courses",
    items: ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"],
  },
  { label: "Branches", href: "#branches" },
  {
    label: "Features",
    items: [
      "Student Management",
      "Teacher Management",
      "Online Exams",
      "Routine Management",
      "Analytics",
      "Payments",
    ],
  },
  { label: "Exams", href: "#exams" },
  { label: "Pricing", href: "#pricing" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial theme
    if (typeof document !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hover = "hover:bg-secondary";
  const muted = "text-muted-foreground";

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl text-foreground transition-all duration-300 ${
        scrolled ? "shadow-md" : "shadow-none"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary">
            <span className="text-sm font-semibold text-primary-foreground">EP</span>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Hydrogen Plus
            </p>
            <p className={`text-sm ${muted}`}>Multi-branch Coaching platform</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary navigation">
          {desktopMenu.map((item) => (
            <div key={item.label} className="group relative">
              {item.items ? (
                <>
                  <button
                    type="button"
                    className={`rounded-full px-3 py-2 text-sm font-medium transition ${hover}`}
                  >
                    {item.label}
                  </button>
                  <div className="pointer-events-none absolute left-1/2 top-full mt-3 w-64 -translate-x-1/2 rounded-2xl border border-border bg-card p-3 opacity-0 shadow-2xl transition group-hover:pointer-events-auto group-hover:opacity-100">
                    <div className="grid gap-2">
                      {item.items.map((entry) => (
                        <Link
                          key={entry}
                          href="#"
                          className={`rounded-xl px-3 py-2 text-sm transition ${hover}`}
                        >
                          {entry}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={item.href ?? "#"}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition ${hover}`}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <button
            type="button"
            aria-label="Search"
            className={`rounded-full p-2.5 transition ${hover}`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="6" />
              <path d="m20 20-4.2-4.2" />
            </svg>
          </button>
          
          <button
            type="button"
            onClick={toggleTheme}
            className={`rounded-full border border-border p-2.5 px-3 py-2 text-sm font-medium transition ${hover}`}
            aria-label="Toggle theme"
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          <Link
            href="/login"
            className={`rounded-full border border-border px-4 py-2 text-sm font-semibold transition ${hover}`}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-full px-4 py-2 text-sm font-semibold transition bg-primary text-primary-foreground hover:opacity-90"
          >
            Register
          </Link>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className={`rounded-full border border-border p-2.5 transition ${hover}`}
            aria-label="Toggle theme"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className={`rounded-full border border-border p-2.5 transition ${hover}`}
            aria-label="Open navigation menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[60] transition ${mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <aside
          className={`absolute right-0 top-0 flex h-full w-4/5 max-w-sm flex-col border-l border-border bg-card p-5 transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-foreground">Navigation</p>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className={`rounded-full p-2 transition ${hover}`}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <ul className="mt-6 space-y-2">
            {desktopMenu.map((item) => (
              <li key={item.label}>
                {item.items ? (
                  <div>
                    <p className={`px-3 py-2 text-sm font-semibold uppercase tracking-[0.2em] ${muted}`}>
                      {item.label}
                    </p>
                    <div className="mt-2 grid gap-1">
                      {item.items.map((entry) => (
                        <Link
                          key={entry}
                          href="#"
                          onClick={() => setMobileOpen(false)}
                          className={`rounded-xl px-3 py-2 text-sm transition ${hover}`}
                        >
                          {entry}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href ?? "#"}
                    onClick={() => setMobileOpen(false)}
                    className={`flex rounded-xl px-3 py-2 text-sm font-medium transition ${hover}`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-auto rounded-2xl border border-border bg-secondary p-4">
            <p className="text-sm font-semibold text-foreground">Join the learning journey</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/login" className="rounded-full px-3 py-2 text-sm font-semibold bg-background text-foreground hover:bg-muted">
                Login
              </Link>
              <Link href="/signup" className="rounded-full px-3 py-2 text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90">
                Register
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </header>
  );
}
