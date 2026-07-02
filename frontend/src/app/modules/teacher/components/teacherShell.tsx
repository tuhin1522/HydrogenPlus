"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import Swal from "sweetalert2";

type TeacherUser = {
  name?: string;
  email?: string;
  role?: string;
};

const navItems = [
  { label: "Dashboard", href: "/teacher", icon: "◉" },
  { label: "My Profile", href: "/teacher/profile", icon: "👤" },
  { label: "My Subjects", href: "/teacher/subjects", icon: "📘" },
  { label: "My Batches", href: "/teacher/batches", icon: "🏫" },
  { label: "Students", href: "/teacher/students", icon: "🎓" },
  { label: "Courses", href: "/teacher/courses", icon: "📚" },
  { label: "Course Content", href: "/teacher/course-content", icon: "🗂️" },
  { label: "Routine", href: "/teacher/routine", icon: "🗓️" },
  { label: "Exams", href: "/teacher/exams", icon: "📝" },
  { label: "Assignments", href: "/teacher/assignments", icon: "✅" },
  { label: "Attendance", href: "/teacher/attendance", icon: "📊" },
  { label: "Announcements", href: "/teacher/announcements", icon: "📣" },
  { label: "Notifications", href: "/teacher/notifications", icon: "🔔" },
  { label: "Settings", href: "/teacher/settings", icon: "⚙️" },
];

export function TeacherShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<TeacherUser | null>(null);

  useEffect(() => {
    setMounted(true);
    const token = window.localStorage.getItem("token");
    const rawUser = window.localStorage.getItem("user");

    if (!token || !rawUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(rawUser) as TeacherUser;
      if (parsedUser.role !== "TEACHER") {
        router.push(parsedUser.role === "STUDENT" ? "/student" : "/login");
        return;
      }
      setUser(parsedUser);
    } catch {
      router.push("/login");
    }
  }, [router]);

  const title = useMemo(() => {
    const match = navItems.find((item) => item.href === pathname);
    return match?.label ?? "Dashboard";
  }, [pathname]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Sign out?",
      text: "You will be redirected to the login page.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, sign out",
      cancelButtonText: "Stay here",
    });

    if (result.isConfirmed) {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
      toast.success("Signed out successfully");
      router.push("/login");
    }
  };

  if (!mounted || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground lg:flex-row">
      <aside className="hidden w-72 shrink-0 border-r border-border bg-card/90 p-4 lg:flex lg:flex-col">
        <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/70 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary font-semibold text-primary-foreground">
            H+
          </div>
          <div>
            <p className="font-semibold text-foreground">Hydrogen Plus</p>
            <p className="text-sm text-muted-foreground">Teacher workspace</p>
          </div>
        </div>

        <nav className="mt-6 flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/teacher" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 rounded-2xl border border-border/70 bg-background/70 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {user.name?.charAt(0)?.toUpperCase() ?? "T"}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full rounded-xl border border-border/70 px-3 py-2 text-sm font-medium text-foreground transition hover:bg-secondary"
          >
            {theme === "dark" ? "☀️ Light mode" : "🌙 Dark mode"}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-xl bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/20"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-xl border border-border/70 p-2 text-muted-foreground lg:hidden"
                onClick={() => setSidebarOpen((value) => !value)}
              >
                ☰
              </button>
              <div>
                <p className="text-sm text-muted-foreground">Teacher dashboard</p>
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-full border border-border/70 p-2 text-sm text-muted-foreground transition hover:bg-secondary"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
              <button
                type="button"
                className="rounded-full border border-border/70 p-2 text-sm text-muted-foreground transition hover:bg-secondary"
                onClick={() => toast.success("You have 3 new alerts")}
              >
                🔔
              </button>
            </div>
          </div>
        </header>

        {sidebarOpen ? (
          <div className="border-b border-border/70 bg-card/90 p-3 lg:hidden">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/teacher" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="min-h-screen bg-background">{children}</div>
      </div>
    </div>
  );
}
