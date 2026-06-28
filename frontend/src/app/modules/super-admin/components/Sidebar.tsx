import React from "react";

interface SidebarProps {
  user: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setErrorMsg: (msg: string) => void;
  setSuccessMsg: (msg: string) => void;
  handleLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeTab,
  setActiveTab,
  setErrorMsg,
  setSuccessMsg,
  handleLogout,
}) => {
  // Sidebar Menu Items
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "branches", label: "Branches & Admins", icon: "🏢" },
    { id: "students", label: "Students", icon: "🎓" },
    { id: "teachers", label: "Teachers", icon: "👩‍🏫" },
    { id: "courses", label: "Courses", icon: "📚" },
    { id: "exams", label: "Exams", icon: "📝" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <aside className="w-64 border-r border-[#27272A] bg-[#0D0B0A] flex flex-col justify-between shrink-0">
      <div>
        {/* Sidebar Header */}
        <div className="h-16 px-6 border-b border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#22C55E] flex items-center justify-center font-bold text-[#052E16] text-sm">
              EP
            </div>
            <span className="font-semibold text-lg tracking-tight">Hydrogen Plus</span>
          </div>
          <span className="text-[10px] bg-[#27272A] px-2 py-0.5 rounded-full text-[#A1A1AA] border border-[#27272A]">v1.0</span>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition duration-150 ${
                activeTab === item.id
                  ? "bg-[#27272A] text-[#FAFAFA] border border-[#27272A]"
                  : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#1C1917]"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Card & Logout */}
      <div className="p-4 border-t border-[#27272A] bg-[#1C1917]/20">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#FAFAFA] truncate">{user.name}</p>
            <p className="text-xs text-[#A1A1AA] truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg border border-[#27272A] hover:bg-[#EF4444]/15 hover:border-[#EF4444]/40 hover:text-[#EF4444] transition duration-150"
            title="Sign out"
          >
            🚪
          </button>
        </div>
      </div>
    </aside>
  );
};
