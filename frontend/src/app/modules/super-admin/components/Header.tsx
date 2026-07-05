import React from "react";

interface HeaderProps {
  activeTab: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  user?: { name?: string; email?: string; role?: string };
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  searchQuery,
  setSearchQuery,
  showNotifications,
  setShowNotifications,
  user,
}) => {
  return (
    <header className="h-16 border-b border-[#27272A] bg-[#0D0B0A]/85 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-10">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[#A1A1AA]">Dashboard</span>
        <span className="text-[#27272A]">/</span>
        <span className="font-semibold text-[#FAFAFA] capitalize">{activeTab}</span>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative w-64">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sm text-[#A1A1AA]">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1C1917] border border-[#27272A] rounded-lg py-1.5 pl-9 pr-4 text-xs text-[#F2F2F2] placeholder-[#A1A1AA] outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-lg border border-[#27272A] hover:bg-[#1C1917] transition text-sm relative"
          >
            🔔
            <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-[#EF4444] ring-2 ring-[#0D0B0A]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#171717] border border-[#27272A] rounded-xl shadow-2xl p-4 z-50">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-3">Recent System Alerts</h4>
              <div className="space-y-3">
                <div className="flex gap-2 text-xs border-b border-[#27272A] pb-2">
                  <span className="text-[#22C55E]">●</span>
                  <div>
                    <p className="font-medium text-[#F2F2F2]">Branch Dhaka central created</p>
                    <p className="text-[10px] text-[#A1A1AA] mt-0.5">2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="text-[#EF4444]">●</span>
                  <div>
                    <p className="font-medium text-[#F2F2F2]">Teacher request pending approval</p>
                    <p className="text-[10px] text-[#A1A1AA] mt-0.5">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-2 border border-[#27272A] px-3 py-1 rounded-full bg-[#1C1917]">
          <div className="h-5 w-5 rounded-full bg-[#22C55E] flex items-center justify-center font-bold text-[#052E16] text-[10px]">
            {user?.name ? user.name.split(" ").map(n=>n[0]).slice(0,2).join("") : "SA"}
          </div>
          <span className="text-xs font-semibold text-[#F2F2F2]">{(user?.role === "BRANCH_ADMIN" && "Branch Admin") || (user?.role === "TEACHER" && "Teacher") || (user?.role === "STUDENT" && "Student") || (user?.role === "SUPER_ADMIN" && "Super Admin") || "Super Admin"}</span>
        </div>
      </div>
    </header>
  );
};
