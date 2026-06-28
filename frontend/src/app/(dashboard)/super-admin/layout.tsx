"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

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

interface SuperAdminUser {
  name?: string;
  email?: string;
  role?: string;
}

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const normalizedPath = (pathname || "").split("?")[0].split("#")[0];
  const activeSection = normalizedPath.replace(/^\/super-admin\/?/, "").split("/")[0] || "overview";
  const [user] = useState<SuperAdminUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const userData = window.localStorage.getItem("user");
    const token = window.localStorage.getItem("token");

    if (!token || !userData) {
      return null;
    }

    try {
      const parsed = JSON.parse(userData) as SuperAdminUser;
      return parsed.role === "SUPER_ADMIN" ? parsed : null;
    } catch {
      return null;
    }
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

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

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0D0B0A]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22C55E] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0D0B0A] text-[#F2F2F2] font-sans antialiased overflow-hidden">
      {/* ====== SIDEBAR ====== */}
      <aside
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } transition-all duration-300 border-r border-[#1C1917] bg-[#080706] flex flex-col shrink-0`}
      >
        {/* Logo */}
        <div className="h-16 px-4 border-b border-[#1C1917] flex items-center justify-between shrink-0">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-[#22C55E] flex items-center justify-center font-bold text-[#052E16] text-sm shrink-0">
                H+
              </div>
              <div>
                <p className="font-bold text-sm text-[#FAFAFA] leading-tight">Hydrogen Plus</p>
                <p className="text-[10px] text-[#A1A1AA]">Super Admin</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-[#1C1917] text-[#A1A1AA] hover:text-[#F2F2F2] transition ml-auto"
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
                    ? "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20"
                    : "text-[#71717A] hover:bg-[#1C1917] hover:text-[#F2F2F2]"
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
        <div className="p-3 border-t border-[#1C1917] shrink-0">
          <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"}`}>
            <div className="h-8 w-8 rounded-full bg-[#22C55E] flex items-center justify-center text-[#052E16] font-bold text-xs shrink-0">
              {user.name?.charAt(0)?.toUpperCase() || "S"}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#F2F2F2] truncate">{user.name}</p>
                <p className="text-[10px] text-[#71717A] truncate">{user.email}</p>
              </div>
            )}
            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 rounded-lg hover:bg-[#EF4444]/10 hover:text-[#EF4444] text-[#71717A] transition shrink-0"
              >
                🚪
              </button>
            )}
          </div>
          {sidebarCollapsed && (
            <button
              onClick={handleLogout}
              className="mt-2 w-full p-1.5 rounded-lg hover:bg-[#EF4444]/10 hover:text-[#EF4444] text-[#71717A] transition flex justify-center"
            >
              🚪
            </button>
          )}
        </div>
      </aside>

      {/* ====== MAIN CONTENT ====== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-[#1C1917] bg-[#080706]/80 backdrop-blur-sm px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-sm text-[#71717A]">
            <span>Super Admin</span>
            <span>/</span>
            <span className="text-[#F2F2F2] font-medium capitalize">
              {MENU_ITEMS.find((m) => activeSection === m.id)?.label || "Dashboard"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 rounded-full bg-[#22C55E]/10 text-[#22C55E] text-xs border border-[#22C55E]/20 font-medium">
              Super Admin
            </span>
            <div className="h-7 w-7 rounded-full bg-[#22C55E] flex items-center justify-center text-[#052E16] font-bold text-xs">
              {user.name?.charAt(0)?.toUpperCase() || "S"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#0D0B0A]">
          {children}
        </main>
      </div>
    </div>
  );
}
