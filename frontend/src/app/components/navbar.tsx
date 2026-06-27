"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ThemeMode = "dark" | "light";

type NavItem = {
  label: string;
  href?: string;
  items?: string[];
};

type NavbarProps = {
  theme: ThemeMode;
  toggleTheme: () => void;
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

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDark = theme === "dark";
  const shell = isDark
    ? "bg-[#081717]/80 text-[#F3F7F6] border-[#1D3E3E]"
    : "bg-white/80 text-[#081717] border-[#D7ECE4]";
  const hover = isDark ? "hover:bg-[#0D2A2B]" : "hover:bg-[#F4FFF8]";
  const muted = isDark ? "text-[#A9B7B4]" : "text-[#4B5A58]";
  const accent = "bg-gradient-to-r from-[#B7FF63] via-[#86F05C] to-[#0E8B6E]";

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${shell} ${
        scrolled ? "shadow-[0_12px_35px_rgba(0,0,0,0.2)]" : "shadow-none"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${accent}`}>
            <span className="text-sm font-semibold text-[#081717]">EP</span>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#86F05C]">
              EduBranch Pro
            </p>
            <p className={`text-sm ${muted}`}>Multi-branch EdTech platform</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {desktopMenu.map((item) => (
            <div key={item.label} className="group relative">
              {item.items ? (
                <>
                  <button
                    type="button"
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${hover}`}
                  >
                    {item.label}
                  </button>
                  <div className="pointer-events-none absolute left-1/2 top-full mt-3 w-64 -translate-x-1/2 rounded-2xl border border-[#1D3E3E] bg-[#0A2324]/95 p-3 opacity-0 shadow-2xl transition group-hover:pointer-events-auto group-hover:opacity-100">
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
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${hover}`}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
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
            className={`rounded-full border px-3 py-2 text-sm font-medium transition ${hover} ${isDark ? "border-[#1D3E3E]" : "border-[#D7ECE4]"}`}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          <Link
            href="/auth/login"
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${hover} ${isDark ? "border-[#1D3E3E]" : "border-[#D7ECE4]"}`}
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className={`rounded-full px-4 py-2 text-sm font-semibold text-[#081717] transition ${accent}`}
          >
            Register
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className={`rounded-full border p-2.5 transition ${hover} ${isDark ? "border-[#1D3E3E]" : "border-[#D7ECE4]"}`}
            aria-label="Toggle theme"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className={`rounded-full border p-2.5 transition ${hover} ${isDark ? "border-[#1D3E3E]" : "border-[#D7ECE4]"}`}
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
        <div className="absolute inset-0 bg-[#081717]/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <aside
          className={`absolute right-0 top-0 flex h-full w-4/5 max-w-sm flex-col border-l p-5 transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          } ${isDark ? "border-[#1D3E3E] bg-[#0A2324] text-[#F3F7F6]" : "border-[#D7ECE4] bg-white text-[#081717]"}`}
        >
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Navigation</p>
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

          <div className={`mt-auto rounded-2xl border p-4 ${isDark ? "border-[#1D3E3E] bg-[#0D2A2B]" : "border-[#D7ECE4] bg-[#F4FFF8]"}`}>
            <p className="text-sm font-semibold">Join the learning journey</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/auth/login" className={`rounded-full px-3 py-2 text-sm font-semibold ${isDark ? "bg-[#081717] text-[#F3F7F6]" : "bg-white text-[#081717]"}`}>
                Login
              </Link>
              <Link href="/auth/signup" className={`rounded-full px-3 py-2 text-sm font-semibold ${accent} text-[#081717]`}>
                Register
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </header>
  );
}
