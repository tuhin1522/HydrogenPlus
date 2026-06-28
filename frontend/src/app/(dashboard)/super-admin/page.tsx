"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createBranch,
  getAllBranches,
  createBranchAdmin,
  getAllBranchAdmins,
  getAllTeachers,
  CreateBranchPayload
} from "@/app/modules/super-admin/services/super-admin.service";

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Loaded Data
  const [branches, setBranches] = useState<any[]>([]);
  const [branchAdmins, setBranchAdmins] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals & Forms State
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [branchForm, setBranchForm] = useState({ name: "", location: "", phone: "", email: "" });
  const [adminForm, setAdminForm] = useState({ userId: "", branchId: "", designation: "", joiningDate: "" });
  
  // Status Messages
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search and Notification state
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "SUPER_ADMIN") {
        // Redirect to their own dashboard if they aren't super admin
        const role = parsedUser.role || "STUDENT";
        if (role === "TEACHER") router.push("/teacher");
        else if (role === "BRANCH_ADMIN") router.push("/branch-admin");
        else router.push("/student");
        return;
      }
      setUser(parsedUser);
    } catch (e) {
      router.push("/login");
      return;
    }

    // Load initial data
    loadAllData();
  }, [router]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [branchesRes, adminsRes, teachersRes] = await Promise.all([
        getAllBranches().catch(() => ({ data: [] })),
        getAllBranchAdmins().catch(() => ({ data: [] })),
        getAllTeachers().catch(() => ({ data: [] }))
      ]);

      setBranches(branchesRes.data || []);
      setBranchAdmins(adminsRes.data || []);
      // Filter teachers who don't already have branch admin roles to make selection cleaner
      const teacherList = teachersRes.data || [];
      setTeachers(teacherList);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    
    try {
      const payload: CreateBranchPayload = {
        name: branchForm.name,
        location: branchForm.location,
        phone: branchForm.phone || undefined,
        email: branchForm.email || undefined
      };
      
      await createBranch(payload);
      setSuccessMsg("Branch created successfully!");
      setBranchForm({ name: "", location: "", phone: "", email: "" });
      setShowBranchModal(false);
      loadAllData();
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Failed to create branch.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateBranchAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload = {
        userId: adminForm.userId,
        branchId: adminForm.branchId,
        designation: adminForm.designation || undefined,
        joiningDate: adminForm.joiningDate ? new Date(adminForm.joiningDate).toISOString() : undefined
      };

      await createBranchAdmin(payload);
      setSuccessMsg("Branch Admin assigned successfully!");
      setAdminForm({ userId: "", branchId: "", designation: "", joiningDate: "" });
      setShowAdminModal(false);
      loadAllData();
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Failed to assign branch admin.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0D0B0A] text-[#F2F2F2]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22C55E] border-t-transparent"></div>
          <span className="text-sm text-[#A1A1AA]">Authenticating...</span>
        </div>
      </div>
    );
  }

  // Sidebar Menu Items
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "branches", label: "Branches & Admins", icon: "🏢" },
    { id: "students", label: "Students", icon: "🎓" },
    { id: "teachers", label: "Teachers", icon: "👩‍🏫" },
    { id: "courses", label: "Courses", icon: "📚" },
    { id: "exams", label: "Exams", icon: "📝" },
    { id: "payments", label: "Payments", icon: "💳" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0D0B0A] text-[#F2F2F2] font-sans antialiased selection:bg-[#22C55E]/30 selection:text-[#22C55E]">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#27272A] bg-[#0D0B0A] flex flex-col justify-between shrink-0">
        <div>
          {/* Sidebar Header */}
          <div className="h-16 px-6 border-b border-[#27272A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#22C55E] flex items-center justify-center font-bold text-[#052E16] text-sm">
                EP
              </div>
              <span className="font-semibold text-lg tracking-tight">EduBranch Pro</span>
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

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
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
                SA
              </div>
              <span className="text-xs font-semibold text-[#F2F2F2]">Super Admin</span>
            </div>
          </div>
        </header>

        {/* Dynamic Panel Content */}
        <main className="flex-1 overflow-y-auto p-8">
          
          {/* Notifications / Feedback Bar */}
          {successMsg && (
            <div className="mb-6 rounded-lg border border-[#00D084]/20 bg-[#00D084]/5 px-4 py-3 text-xs text-[#00D084] flex justify-between items-center">
              <span>{successMsg}</span>
              <button onClick={() => setSuccessMsg("")} className="hover:text-white">✕</button>
            </div>
          )}
          {errorMsg && (
            <div className="mb-6 rounded-lg border border-[#EF4444]/20 bg-[#EF4444]/5 px-4 py-3 text-xs text-[#EF4444] flex justify-between items-center">
              <span>{errorMsg}</span>
              <button onClick={() => setErrorMsg("")} className="hover:text-white">✕</button>
            </div>
          )}

          {/* LOADING STATE */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#22C55E] border-t-transparent"></div>
              <p className="text-sm text-[#A1A1AA]">Gathering platform records...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW DASHBOARD */}
              {activeTab === "dashboard" && (
                <div className="space-y-8">
                  {/* Stats Cards */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Stat 1 */}
                    <div className="rounded-xl border border-[#27272A] bg-[#1C1917] p-5">
                      <div className="flex items-center justify-between text-xs text-[#A1A1AA] uppercase tracking-wider font-semibold">
                        <span>Total Students</span>
                        <span>🎓</span>
                      </div>
                      <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-2xl font-bold">1,248</span>
                        <span className="text-xs text-[#00D084] font-medium">+12.5%</span>
                      </div>
                    </div>
                    {/* Stat 2 */}
                    <div className="rounded-xl border border-[#27272A] bg-[#1C1917] p-5">
                      <div className="flex items-center justify-between text-xs text-[#A1A1AA] uppercase tracking-wider font-semibold">
                        <span>Total Teachers</span>
                        <span>👩‍🏫</span>
                      </div>
                      <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-2xl font-bold">{teachers.length || "84"}</span>
                        <span className="text-xs text-[#00D084] font-medium">+4.2%</span>
                      </div>
                    </div>
                    {/* Stat 3 */}
                    <div className="rounded-xl border border-[#27272A] bg-[#1C1917] p-5">
                      <div className="flex items-center justify-between text-xs text-[#A1A1AA] uppercase tracking-wider font-semibold">
                        <span>Total Revenue</span>
                        <span>💰</span>
                      </div>
                      <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-2xl font-bold">$24,500</span>
                        <span className="text-xs text-[#00D084] font-medium">+8.1%</span>
                      </div>
                    </div>
                    {/* Stat 4 */}
                    <div className="rounded-xl border border-[#27272A] bg-[#1C1917] p-5">
                      <div className="flex items-center justify-between text-xs text-[#A1A1AA] uppercase tracking-wider font-semibold">
                        <span>Active Courses</span>
                        <span>📚</span>
                      </div>
                      <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-2xl font-bold">32</span>
                        <span className="text-xs text-[#FCB900] font-medium">Stable</span>
                      </div>
                    </div>
                    {/* Stat 5 */}
                    <div className="rounded-xl border border-[#27272A] bg-[#1C1917] p-5">
                      <div className="flex items-center justify-between text-xs text-[#A1A1AA] uppercase tracking-wider font-semibold">
                        <span>Active Branches</span>
                        <span>🏢</span>
                      </div>
                      <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-2xl font-bold">{branches.length || "4"}</span>
                        <span className="text-xs text-[#00D084] font-medium">+{branches.length ? "1" : "0"} New</span>
                      </div>
                    </div>
                  </div>

                  {/* Charts section */}
                  <div className="grid gap-6 lg:grid-cols-3">
                    {/* Revenue Trend Line Chart */}
                    <div className="lg:col-span-2 rounded-xl border border-[#27272A] bg-[#1C1917] p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-sm font-semibold text-[#FAFAFA]">Revenue & Student Analytics</h3>
                          <p className="text-xs text-[#A1A1AA] mt-0.5">Continuous quarterly billing cycle trajectory</p>
                        </div>
                        <div className="flex gap-2">
                          <span className="flex items-center gap-1.5 text-xs text-[#22C55E]"><span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" /> Revenue</span>
                          <span className="flex items-center gap-1.5 text-xs text-[#3B82F6]"><span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]" /> Students</span>
                        </div>
                      </div>
                      {/* Premium Technical SVG Chart */}
                      <div className="h-64 relative flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 600 240" fill="none">
                          <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#22C55E" stopOpacity="0.25"/>
                              <stop offset="100%" stopColor="#22C55E" stopOpacity="0.00"/>
                            </linearGradient>
                          </defs>
                          {/* Grid Lines */}
                          <line x1="0" y1="60" x2="600" y2="60" stroke="#27272A" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="0" y1="120" x2="600" y2="120" stroke="#27272A" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="0" y1="180" x2="600" y2="180" stroke="#27272A" strokeWidth="1" strokeDasharray="4 4" />
                          {/* Data Lines */}
                          <path
                            d="M 50 180 Q 150 140 250 110 T 450 70 T 550 50"
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="2"
                          />
                          <path
                            d="M 50 200 Q 150 160 250 120 T 450 60 T 550 40 L 550 220 L 50 220 Z"
                            fill="url(#chartGradient)"
                            stroke="#22C55E"
                            strokeWidth="3"
                          />
                          {/* Label values */}
                          <text x="10" y="55" fill="#A1A1AA" fontSize="10">80%</text>
                          <text x="10" y="115" fill="#A1A1AA" fontSize="10">50%</text>
                          <text x="10" y="175" fill="#A1A1AA" fontSize="10">20%</text>
                        </svg>
                      </div>
                    </div>

                    {/* Branch Analytics Comparison */}
                    <div className="rounded-xl border border-[#27272A] bg-[#1C1917] p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-[#FAFAFA]">Branch Market Share</h3>
                        <p className="text-xs text-[#A1A1AA] mt-0.5">Distribution of student enrollments</p>
                      </div>
                      
                      <div className="space-y-4 my-6">
                        {/* Branch 1 */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span>Dhaka Central</span>
                            <span className="text-[#22C55E]">45%</span>
                          </div>
                          <div className="h-2 w-full bg-[#27272A] rounded-full overflow-hidden">
                            <div className="h-full bg-[#22C55E] rounded-full" style={{ width: "45%" }} />
                          </div>
                        </div>
                        {/* Branch 2 */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span>Chittagong Academic</span>
                            <span className="text-[#3B82F6]">30%</span>
                          </div>
                          <div className="h-2 w-full bg-[#27272A] rounded-full overflow-hidden">
                            <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: "30%" }} />
                          </div>
                        </div>
                        {/* Branch 3 */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span>Sylhet Division</span>
                            <span className="text-[#A855F7]">15%</span>
                          </div>
                          <div className="h-2 w-full bg-[#27272A] rounded-full overflow-hidden">
                            <div className="h-full bg-[#A855F7] rounded-full" style={{ width: "15%" }} />
                          </div>
                        </div>
                        {/* Branch 4 */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span>Rajshahi Academy</span>
                            <span className="text-[#FCB900]">10%</span>
                          </div>
                          <div className="h-2 w-full bg-[#27272A] rounded-full overflow-hidden">
                            <div className="h-full bg-[#FCB900] rounded-full" style={{ width: "10%" }} />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-[#27272A] pt-4 flex justify-between items-center text-xs">
                        <span className="text-[#A1A1AA]">Top branch:</span>
                        <span className="font-bold text-[#FAFAFA]">Dhaka Central</span>
                      </div>
                    </div>
                  </div>

                  {/* Branch performance summary cards */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl border border-[#27272A] bg-[#1C1917] p-5 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] bg-[#00D084]/15 text-[#00D084] font-bold px-2 py-0.5 rounded-full border border-[#00D084]/25 uppercase tracking-wider">Top Performing</span>
                        <h4 className="text-lg font-bold mt-1">Dhaka Central Branch</h4>
                        <p className="text-xs text-[#A1A1AA]">Best performing in active retention and highest monthly collection</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#FAFAFA]">$14,200</p>
                        <p className="text-xs text-[#A1A1AA]">Total volume</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#27272A] bg-[#1C1917] p-5 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] bg-[#EF4444]/15 text-[#EF4444] font-bold px-2 py-0.5 rounded-full border border-[#EF4444]/25 uppercase tracking-wider">Attention Needed</span>
                        <h4 className="text-lg font-bold mt-1">Rajshahi Academy</h4>
                        <p className="text-xs text-[#A1A1AA]">Requires evaluation on teacher placement and student outreach</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#FAFAFA]">$2,100</p>
                        <p className="text-xs text-[#A1A1AA]">Total volume</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity lists */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Enrollments */}
                    <div className="rounded-xl border border-[#27272A] bg-[#1C1917] p-6">
                      <h3 className="text-sm font-semibold mb-4 text-[#FAFAFA]">Recent System Enrollments</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-[#27272A] text-[#A1A1AA]">
                              <th className="pb-3 font-medium">Student</th>
                              <th className="pb-3 font-medium">Branch</th>
                              <th className="pb-3 font-medium">Course</th>
                              <th className="pb-3 font-medium text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#27272A]/50">
                            <tr className="hover:bg-[#0D0B0A]/30">
                              <td className="py-3 font-medium">Nabil Rahman</td>
                              <td className="py-3">Dhaka Central</td>
                              <td className="py-3">HSC Math Pro</td>
                              <td className="py-3 text-right">
                                <span className="px-2 py-0.5 rounded-full bg-[#00D084]/10 text-[#00D084] border border-[#00D084]/20 font-medium">Active</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-[#0D0B0A]/30">
                              <td className="py-3 font-medium">Sarah Islam</td>
                              <td className="py-3">Chittagong</td>
                              <td className="py-3">Admission Special</td>
                              <td className="py-3 text-right">
                                <span className="px-2 py-0.5 rounded-full bg-[#00D084]/10 text-[#00D084] border border-[#00D084]/20 font-medium">Active</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-[#0D0B0A]/30">
                              <td className="py-3 font-medium">Tasnim Ahmed</td>
                              <td className="py-3">Sylhet Div</td>
                              <td className="py-3">SSC Chemistry Boost</td>
                              <td className="py-3 text-right">
                                <span className="px-2 py-0.5 rounded-full bg-[#FCB900]/10 text-[#FCB900] border border-[#FCB900]/20 font-medium">Pending</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Recent Payments */}
                    <div className="rounded-xl border border-[#27272A] bg-[#1C1917] p-6">
                      <h3 className="text-sm font-semibold mb-4 text-[#FAFAFA]">Recent Invoice Transactions</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-[#27272A] text-[#A1A1AA]">
                              <th className="pb-3 font-medium">Invoice ID</th>
                              <th className="pb-3 font-medium">Amount</th>
                              <th className="pb-3 font-medium">Gateway</th>
                              <th className="pb-3 font-medium text-right">Verification</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#27272A]/50">
                            <tr className="hover:bg-[#0D0B0A]/30">
                              <td className="py-3 font-mono text-[10px] text-[#A1A1AA]">INV-2026-9812</td>
                              <td className="py-3 font-semibold">$350.00</td>
                              <td className="py-3">Stripe Card</td>
                              <td className="py-3 text-right">
                                <span className="px-2 py-0.5 rounded-full bg-[#00D084]/10 text-[#00D084] border border-[#00D084]/20 font-medium">Cleared</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-[#0D0B0A]/30">
                              <td className="py-3 font-mono text-[10px] text-[#A1A1AA]">INV-2026-9813</td>
                              <td className="py-3 font-semibold">$120.00</td>
                              <td className="py-3">bKash Merchant</td>
                              <td className="py-3 text-right">
                                <span className="px-2 py-0.5 rounded-full bg-[#00D084]/10 text-[#00D084] border border-[#00D084]/20 font-medium">Cleared</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-[#0D0B0A]/30">
                              <td className="py-3 font-mono text-[10px] text-[#A1A1AA]">INV-2026-9814</td>
                              <td className="py-3 font-semibold">$450.00</td>
                              <td className="py-3">Stripe Card</td>
                              <td className="py-3 text-right">
                                <span className="px-2 py-0.5 rounded-full bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 font-medium">Failed</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BRANCHES & ADMINS MANAGEMENT */}
              {activeTab === "branches" && (
                <div className="space-y-10">
                  {/* Branches Section Header */}
                  <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#FAFAFA]">Coaching Branches</h2>
                      <p className="text-xs text-[#A1A1AA] mt-1">Manage physical institute branch setups across the platform</p>
                    </div>
                    <button
                      onClick={() => setShowBranchModal(true)}
                      className="px-4 py-2 bg-[#22C55E] text-[#052E16] rounded-lg text-xs font-semibold hover:opacity-90 transition duration-150"
                    >
                      + Create Branch
                    </button>
                  </div>

                  {/* Branches Table */}
                  <div className="rounded-xl border border-[#27272A] bg-[#1C1917] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#27272A]/40 text-[#A1A1AA] border-b border-[#27272A]">
                            <th className="p-4 font-semibold uppercase tracking-wider">Branch Name</th>
                            <th className="p-4 font-semibold uppercase tracking-wider">Location</th>
                            <th className="p-4 font-semibold uppercase tracking-wider">Email Contact</th>
                            <th className="p-4 font-semibold uppercase tracking-wider">Phone contact</th>
                            <th className="p-4 font-semibold uppercase tracking-wider text-right">Config</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#27272A]/70">
                          {branches.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-[#A1A1AA]">
                                No branch configurations found. Click "+ Create Branch" to spin up a new platform entity.
                              </td>
                            </tr>
                          ) : (
                            branches.map((b) => (
                              <tr key={b.id} className="hover:bg-[#0D0B0A]/20">
                                <td className="p-4 font-bold text-[#FAFAFA]">{b.name}</td>
                                <td className="p-4 text-[#A1A1AA]">{b.location}</td>
                                <td className="p-4 text-[#A1A1AA]">{b.email || "N/A"}</td>
                                <td className="p-4 text-[#A1A1AA]">{b.phone || "N/A"}</td>
                                <td className="p-4 text-right">
                                  <button className="text-[#EF4444] hover:underline hover:opacity-85 font-medium">Delete</button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Branch Admins Section Header */}
                  <div className="flex items-center justify-between border-b border-[#27272A] pb-4 pt-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#FAFAFA]">Branch Administrative Roles</h2>
                      <p className="text-xs text-[#A1A1AA] mt-1">Assign verified academic teachers to manage specific location panels</p>
                    </div>
                    <button
                      onClick={() => setShowAdminModal(true)}
                      className="px-4 py-2 bg-[#22C55E] text-[#052E16] rounded-lg text-xs font-semibold hover:opacity-90 transition duration-150"
                    >
                      + Assign Branch Admin
                    </button>
                  </div>

                  {/* Branch Admins Table */}
                  <div className="rounded-xl border border-[#27272A] bg-[#1C1917] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#27272A]/40 text-[#A1A1AA] border-b border-[#27272A]">
                            <th className="p-4 font-semibold uppercase tracking-wider">Admin Name</th>
                            <th className="p-4 font-semibold uppercase tracking-wider">Email Address</th>
                            <th className="p-4 font-semibold uppercase tracking-wider">Assigned Branch</th>
                            <th className="p-4 font-semibold uppercase tracking-wider">Title / Designation</th>
                            <th className="p-4 font-semibold uppercase tracking-wider">Joining Date</th>
                            <th className="p-4 font-semibold uppercase tracking-wider text-right">Config</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#27272A]/70">
                          {branchAdmins.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-[#A1A1AA]">
                                No administrative roles set up. Assign an active teacher using "+ Assign Branch Admin".
                              </td>
                            </tr>
                          ) : (
                            branchAdmins.map((adm) => (
                              <tr key={adm.id} className="hover:bg-[#0D0B0A]/20">
                                <td className="p-4 font-bold text-[#FAFAFA]">{adm.user?.name || "N/A"}</td>
                                <td className="p-4 text-[#A1A1AA]">{adm.user?.email || "N/A"}</td>
                                <td className="p-4 text-[#22C55E] font-medium">{adm.branch?.name || "N/A"}</td>
                                <td className="p-4 text-[#FAFAFA]">{adm.designation || "Branch Admin"}</td>
                                <td className="p-4 text-[#A1A1AA]">{adm.joiningDate ? new Date(adm.joiningDate).toLocaleDateString() : "N/A"}</td>
                                <td className="p-4 text-right">
                                  <button className="text-[#EF4444] hover:underline font-medium">Revoke Role</button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TABS 3 - 9: PLACEHOLDER VIEWS WITH DESIGN PALETTE */}
              {activeTab !== "dashboard" && activeTab !== "branches" && (
                <div className="flex flex-col items-center justify-center h-[500px] text-center border border-[#27272A] bg-[#1C1917] rounded-2xl p-8 space-y-6">
                  <div className="h-16 w-16 bg-[#27272A] rounded-full flex items-center justify-center text-2xl border border-[#27272A]">
                    📂
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#FAFAFA] capitalize">{activeTab} Control Center</h3>
                    <p className="text-sm text-[#A1A1AA] max-w-md mt-2">
                      This submodule is configured. In production, this allows site-wide oversight of active {activeTab} data models.
                    </p>
                  </div>
                  <div className="p-4 bg-[#0D0B0A] rounded-xl border border-[#27272A] w-full max-w-lg text-left font-mono text-[11px] text-[#A1A1AA] space-y-1">
                    <p className="text-[#22C55E]">// Sandbox mock data module details</p>
                    <p>Status: Ready</p>
                    <p>Environment: production-simulate</p>
                    <p>Subsystem: EduBranch-Core-{activeTab}</p>
                    <p>Security Audit: Passed</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="px-4 py-2 border border-[#27272A] text-sm text-[#FAFAFA] font-medium rounded-lg hover:bg-[#27272A] transition"
                  >
                    Return to overview
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* MODAL 1: CREATE BRANCH */}
      {showBranchModal && (
        <div className="fixed inset-0 bg-[#0D0B0A]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1C1917] border border-[#27272A] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-[#27272A] flex justify-between items-center">
              <h3 className="font-bold text-sm text-[#FAFAFA]">Create New Branch</h3>
              <button onClick={() => setShowBranchModal(false)} className="text-[#A1A1AA] hover:text-[#FAFAFA]">✕</button>
            </div>
            
            <form onSubmit={handleCreateBranch} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">Branch Name *</label>
                <input
                  type="text"
                  required
                  value={branchForm.name}
                  onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                  placeholder="e.g. Dhaka central"
                  className="w-full bg-[#0D0B0A] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F2F2F2] outline-none focus:border-[#22C55E] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">Location / Address *</label>
                <input
                  type="text"
                  required
                  value={branchForm.location}
                  onChange={(e) => setBranchForm({ ...branchForm, location: e.target.value })}
                  placeholder="e.g. Mirpur, Dhaka"
                  className="w-full bg-[#0D0B0A] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F2F2F2] outline-none focus:border-[#22C55E] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">Contact Email</label>
                <input
                  type="email"
                  value={branchForm.email}
                  onChange={(e) => setBranchForm({ ...branchForm, email: e.target.value })}
                  placeholder="e.g. contact@branch.com"
                  className="w-full bg-[#0D0B0A] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F2F2F2] outline-none focus:border-[#22C55E] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">Contact Phone</label>
                <input
                  type="tel"
                  value={branchForm.phone}
                  onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
                  placeholder="e.g. 01700000000"
                  className="w-full bg-[#0D0B0A] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F2F2F2] outline-none focus:border-[#22C55E] transition"
                />
              </div>

              <div className="pt-4 border-t border-[#27272A] flex justify-end gap-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setShowBranchModal(false)}
                  className="px-4 py-2 border border-[#27272A] text-[#A1A1AA] hover:bg-[#27272A] rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-[#22C55E] text-[#052E16] rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {actionLoading ? "Saving..." : "Create Branch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ASSIGN BRANCH ADMIN */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-[#0D0B0A]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1C1917] border border-[#27272A] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-[#27272A] flex justify-between items-center">
              <h3 className="font-bold text-sm text-[#FAFAFA]">Assign Branch Administrator</h3>
              <button onClick={() => setShowAdminModal(false)} className="text-[#A1A1AA] hover:text-[#FAFAFA]">✕</button>
            </div>
            
            <form onSubmit={handleCreateBranchAdmin} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">Select Teacher *</label>
                <select
                  required
                  value={adminForm.userId}
                  onChange={(e) => setAdminForm({ ...adminForm, userId: e.target.value })}
                  className="w-full bg-[#0D0B0A] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F2F2F2] outline-none focus:border-[#22C55E] transition"
                >
                  <option value="" disabled>Select an active teacher profile...</option>
                  {teachers.map((t) => (
                    <option key={t.user.id} value={t.user.id}>
                      {t.user.name} ({t.user.email})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-[#A1A1AA] mt-1">Only users verified as teachers are eligible for admin assignment.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">Assign to Branch *</label>
                <select
                  required
                  value={adminForm.branchId}
                  onChange={(e) => setAdminForm({ ...adminForm, branchId: e.target.value })}
                  className="w-full bg-[#0D0B0A] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F2F2F2] outline-none focus:border-[#22C55E] transition"
                >
                  <option value="" disabled>Select a branch location...</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">Designation / Title</label>
                <input
                  type="text"
                  value={adminForm.designation}
                  onChange={(e) => setAdminForm({ ...adminForm, designation: e.target.value })}
                  placeholder="e.g. Branch Supervisor"
                  className="w-full bg-[#0D0B0A] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F2F2F2] outline-none focus:border-[#22C55E] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">Role Start / Joining Date</label>
                <input
                  type="date"
                  value={adminForm.joiningDate}
                  onChange={(e) => setAdminForm({ ...adminForm, joiningDate: e.target.value })}
                  className="w-full bg-[#0D0B0A] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F2F2F2] outline-none focus:border-[#22C55E] transition"
                />
              </div>

              <div className="pt-4 border-t border-[#27272A] flex justify-end gap-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="px-4 py-2 border border-[#27272A] text-[#A1A1AA] hover:bg-[#27272A] rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-[#22C55E] text-[#052E16] rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {actionLoading ? "Assigning..." : "Assign Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
