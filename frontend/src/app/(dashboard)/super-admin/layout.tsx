"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
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
  { id: "notifications", label: "Notifications", icon: "🔔", path: "/super-admin/notifications" },
  { id: "users", label: "All Users", icon: "👥", path: "/super-admin/users" },
  { id: "audit-logs", label: "Audit Logs", icon: "📋", path: "/super-admin/audit-logs" },
  { id: "settings", label: "Settings", icon: "⚙️", path: "/super-admin/settings" },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const normalizedPath = (pathname || "").split("?")[0].split("#")[0];
  const activeSection = normalizedPath.replace(/^\/super-admin\/?/, "").split("/")[0] || "overview";
  const [user, setUser] = useState<SuperAdminUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }, [router]);

  if (!mounted || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground font-sans antialiased overflow-hidden">
      {/* ====== SIDEBAR ====== */}
      <aside
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } transition-all duration-300 border-r border-border bg-card flex flex-col shrink-0`}
      >
        {/* Logo */}
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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {MENU_ITEMS.map((item) => {
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
          })}
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-border shrink-0">
          <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"}`}>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs shrink-0">
              {user.name?.charAt(0)?.toUpperCase() || "S"}
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

      {/* ====== MAIN CONTENT ====== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Super Admin</span>
            <span>/</span>
            <span className="text-foreground font-medium capitalize">
              {MENU_ITEMS.find((m) => activeSection === m.id)?.label || "Dashboard"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs border border-primary/20 font-medium">
              Super Admin
            </span>
            <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
              {user.name?.charAt(0)?.toUpperCase() || "S"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
