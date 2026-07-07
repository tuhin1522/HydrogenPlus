"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Header } from "@/app/modules/super-admin/components/Header";

const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", href: "/student", icon: "◉" },
  { id: "profile", label: "My Profile", href: "/student/profile", icon: "👤" },
  { id: "courses", label: "My Courses", href: "/student/courses", icon: "📚" },
  { id: "course-content", label: "Course Contents", href: "/student/course-content", icon: "🗂️" },
  { id: "routine", label: "Routine", href: "/student/routine", icon: "🗓️" },
  { id: "assignments", label: "Assignments", href: "/student/assignments", icon: "✅" },
  { id: "exams", label: "Exams", href: "/student/exams", icon: "📝" },
  { id: "results", label: "Results", href: "/student/results", icon: "📈" },
  { id: "leaderboard", label: "Leaderboard", href: "/student/leaderboard", icon: "🏆" },
  { id: "attendance", label: "Attendance", href: "/student/attendance", icon: "📊" },
  { id: "payments", label: "Payments", href: "/student/payments", icon: "💳" },
  { id: "announcements", label: "Announcements", href: "/student/announcements", icon: "📣" },
  { id: "notifications", label: "Notifications", href: "/student/notifications", icon: "🔔" },
  { id: "settings", label: "Settings", href: "/student/settings", icon: "⚙️" },
];

export function StudentShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const normalizedPath = (pathname || "").split("?")[0].split("#")[0];
  
  // Calculate active section from pathname
  let activeSection = "dashboard";
  if (normalizedPath === "/student") {
    activeSection = "dashboard";
  } else {
    activeSection = normalizedPath.replace(/^\/student\/?/, "").split("/")[0] || "dashboard";
  }

  const [user, setUser] = useState<any | null>(null);
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
      const parsed = JSON.parse(userData);
      if (parsed.role !== "STUDENT") {
        const roleMap: Record<string, string> = {
          SUPER_ADMIN: "/super-admin/overview",
          BRANCH_ADMIN: "/branch-admin",
          TEACHER: "/teacher",
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

  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

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
        className={`${sidebarCollapsed ? "w-16" : "w-64"} transition-all duration-300 border-r border-border bg-card flex flex-col shrink-0`}
      >
        <div className="h-16 px-4 border-b border-border flex items-center justify-between shrink-0">
          {!sidebarCollapsed && (
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm shrink-0">
                H+
              </div>
              <div>
                <p className="font-bold text-sm text-foreground leading-tight">Hydrogen Plus</p>
                <p className="text-[10px] text-muted-foreground">Student</p>
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

        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {MENU_ITEMS.map((item) => {
            const isActive = activeSection === item.id || (item.id === "dashboard" && normalizedPath === "/student");
            return (
              <Link
                key={item.id}
                href={item.href}
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

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          activeTab={MENU_ITEMS.find((m) => m.id === activeSection || (activeSection === "dashboard" && m.id === "dashboard"))?.label || "Dashboard"}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          user={user}
        />

        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  );
}
