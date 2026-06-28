"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createBranch,
  getAllBranches,
  createBranchAdmin,
  getAllBranchAdmins,
  getAllTeachers,
  getAllStudents,
  getAllBatches,
  CreateBranchPayload
} from "@/app/modules/super-admin/services/super-admin.service";
import { Sidebar } from "@/app/modules/super-admin/components/Sidebar";
import { Header } from "@/app/modules/super-admin/components/Header";
import { OverviewDashboard } from "@/app/modules/super-admin/components/OverviewDashboard";
import { BranchesManagement } from "@/app/modules/super-admin/components/BranchesManagement";
import { CreateBranchModal } from "@/app/modules/super-admin/components/CreateBranchModal";
import { CreateBranchAdminModal } from "@/app/modules/super-admin/components/CreateBranchAdminModal";
import { PlaceholderView } from "@/app/modules/super-admin/components/PlaceholderView";

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Loaded Data
  const [branches, setBranches] = useState<any[]>([]);
  const [branchAdmins, setBranchAdmins] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals & Forms State
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [branchForm, setBranchForm] = useState<CreateBranchPayload>({ name: "", location: "", phone: "", email: "" });
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

    loadAllData();
  }, [router]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [branchesRes, adminsRes, teachersRes, studentsRes, batchesRes] = await Promise.all([
        getAllBranches().catch(() => ({ data: [] })),
        getAllBranchAdmins().catch(() => ({ data: [] })),
        getAllTeachers().catch(() => ({ data: [] })),
        getAllStudents().catch(() => ({ data: [] })),
        getAllBatches().catch(() => ({ data: [] }))
      ]);

      setBranches(branchesRes.data || []);
      setBranchAdmins(adminsRes.data || []);
      setTeachers(teachersRes.data || []);
      setStudents(studentsRes.data || []);
      setBatches(batchesRes.data || []);
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

  return (
    <div className="flex min-h-screen bg-[#0D0B0A] text-[#F2F2F2] font-sans antialiased selection:bg-[#22C55E]/30 selection:text-[#22C55E]">
      
      {/* Sidebar Component */}
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setErrorMsg={setErrorMsg}
        setSuccessMsg={setSuccessMsg}
        handleLogout={handleLogout}
      />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Component */}
        <Header
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
        />

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
                <OverviewDashboard
                  students={students}
                  teachers={teachers}
                  branches={branches}
                  batches={batches}
                />
              )}

              {/* TAB 2: BRANCHES & ADMINS MANAGEMENT */}
              {activeTab === "branches" && (
                <BranchesManagement
                  branches={branches}
                  branchAdmins={branchAdmins}
                  setShowBranchModal={setShowBranchModal}
                  setShowAdminModal={setShowAdminModal}
                />
              )}

              {/* TABS 3 - 9: PLACEHOLDER VIEWS */}
              {activeTab !== "dashboard" && activeTab !== "branches" && (
                <PlaceholderView
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      {showBranchModal && (
        <CreateBranchModal
          branchForm={branchForm}
          setBranchForm={setBranchForm}
          handleCreateBranch={handleCreateBranch}
          setShowBranchModal={setShowBranchModal}
          actionLoading={actionLoading}
        />
      )}

      {showAdminModal && (
        <CreateBranchAdminModal
          adminForm={adminForm}
          setAdminForm={setAdminForm}
          handleCreateBranchAdmin={handleCreateBranchAdmin}
          setShowAdminModal={setShowAdminModal}
          actionLoading={actionLoading}
          teachers={teachers}
          branches={branches}
        />
      )}
    </div>
  );
}
