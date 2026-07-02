"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { SuperAdminUser } from "@/app/modules/super-admin/types";

const MENU_ITEMS = [
  { id: "overview", label: "Overview", icon: "📊", path: "/super-admin/overview" },
  { id: "branches", label: "Branches", icon: "🏢", path: "/super-admin/branches" },
  { id: "branch-admins", label: "Branch Admins", icon: "👤", path: "/super-admin/branch-admins" },
  { id: "students", label: "Students", icon: "🎓", path: "/super-admin/students" },
  { id: "teachers", label: "Teachers", icon: "👩‍🏫", path: "/super-admin/teachers" },
  { id: "academic", label: "Academic", icon: "📚", path: "/super-admin/academic" },
  { id: "routine", label: "Class Routine", icon: "🗓️", path: "/super-admin/routine" },
  { id: "exams", label: "Exams", icon: "📝", path: "/super-admin/exams" },
  { id: "courses", label: "Courses", icon: "🎯", path: "/super-admin/courses" },
  { id: "payments", label: "Payments", icon: "💳", path: "/super-admin/payments" },
  { id: "analytics", label: "Analytics", icon: "📈", path: "/super-admin/analytics" },
  { id: "profile", label: "Profile", icon: "👤", path: "/super-admin/profile" },
  { id: "announcements", label: "Announcements", icon: "📣", path: "/super-admin/announcements" },
  { id: "notifications", label: "Notifications", icon: "🔔", path: "/super-admin/notifications" },
  { id: "users", label: "All Users", icon: "👥", path: "/super-admin/users" },
  { id: "audit-logs", label: "Audit Logs", icon: "📋", path: "/super-admin/audit-logs" },
  { id: "settings", label: "Settings", icon: "⚙️", path: "/super-admin/settings" },
];

const QUICK_NOTIFICATIONS = [
  { title: "New announcement posted", detail: "A new platform notice is live for all branches." },
  { title: "Exam schedule updated", detail: "The midterm timetable was revised for this week." },
  { title: "Payment reminder", detail: "Two branches have pending fee collections." },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const normalizedPath = (pathname || "").split("?")[0].split("#")[0];
  const activeSection = normalizedPath.replace(/^\/super-admin\/?/, "").split("/")[0] || "overview";
  const [user, setUser] = useState<SuperAdminUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userData = window.localStorage.getItem("user");
    const token = window.localStorage.getItem("token");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    try {
      const parsed = JSON.parse(userData) as SuperAdminUser;
      if (parsed.role !== "SUPER_ADMIN") {
        const roleMap: Record<string, string> = {
          TEACHER: "/teacher",
          BRANCH_ADMIN: "/branch-admin",
          STUDENT: "/student",
        };
        router.push(roleMap[parsed.role || ""] || "/login");
      } else {
        setUser(parsed);
      }
    } catch {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    setShowNotifications(false);
    setShowProfileMenu(false);
  }, [pathname]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }, [router]);

  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    if (!searchQuery.trim()) return true;
    return item.label.toLowerCase().includes(searchQuery.trim().toLowerCase());
  });

  const userInitials = (user?.name || "Super Admin")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (!mounted || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground font-sans antialiased overflow-hidden">
      <aside
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } transition-all duration-300 border-r border-border bg-card flex flex-col shrink-0`}
      >
        <div className="h-16 px-4 border-b border-border flex items-center justify-between shrink-0">
          {!sidebarCollapsed && (
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm shrink-0">
                H+
              </div>
              <div>
                <p className="font-bold text-sm text-foreground leading-tight">Hydrogen Plus</p>
                <p className="text-[10px] text-muted-foreground">Super Admin</p>
              </div>
            </Link>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition ml-auto"
          >
            {sidebarCollapsed ? "→" : "←"}
          </button>
        </div>

        <div className="px-3 py-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground text-sm">🔎</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search modules"
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {filteredMenuItems.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
              No modules match your search.
            </div>
          ) : (
            filteredMenuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 group ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <span className="shrink-0 text-base">{item.icon}</span>
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })
          )}
        </nav>

        <div className="p-3 border-t border-border shrink-0">
          <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"}`}>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs shrink-0">
              {userInitials}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              </div>
            )}
            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition shrink-0"
              >
                🚪
              </button>
            )}
          </div>
          {sidebarCollapsed && (
            <button
              onClick={handleLogout}
              className="mt-2 w-full p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition flex justify-center"
            >
              🚪
            </button>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Super Admin</span>
            <span>/</span>
            <span className="text-foreground font-medium capitalize">
              {MENU_ITEMS.find((m) => activeSection === m.id)?.label || "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
              <span>🔎</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Quick search"
                className="w-32 bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>

            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full border border-border bg-background p-2 text-sm transition hover:bg-secondary"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications((value) => !value)}
                className="relative rounded-full border border-border bg-background p-2 text-sm transition hover:bg-secondary"
                aria-label="Notifications"
              >
                🔔
                <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
              </button>

              {showNotifications ? (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-border bg-card p-3 shadow-xl">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">Notifications</p>
                    <Link href="/super-admin/announcements" className="text-xs text-primary hover:underline">
                      View all
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {QUICK_NOTIFICATIONS.map((item) => (
                      <div key={item.title} className="rounded-lg border border-border/70 bg-background/70 p-2.5">
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu((value) => !value)}
                className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1.5 transition hover:bg-secondary"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {userInitials}
                </div>
                <span className="hidden text-sm font-medium text-foreground sm:block">{user.name}</span>
              </button>

              {showProfileMenu ? (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-border bg-card p-2 shadow-xl">
                  <Link href="/super-admin/profile" className="flex items-center rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-secondary">
                    👤 Profile
                  </Link>
                  <Link href="/super-admin/settings" className="flex items-center rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-secondary">
                    ⚙️ Settings
                  </Link>
                  <Link href="/super-admin/announcements" className="flex items-center rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-secondary">
                    📣 Announcements
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-destructive transition hover:bg-destructive/10"
                  >
                    🚪 Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
