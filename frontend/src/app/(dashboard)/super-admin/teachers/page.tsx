"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  createUser,
  createTeacher,
  getAllBranches,
  getAllBatchSubjects,
} from "@/app/modules/super-admin/services/super-admin.service";

const RATINGS = ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐", "⭐"];

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [batchSubjects, setBatchSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [modal, setModal] = useState<"edit" | "details" | "create" | null>(null);
  const [form, setForm] = useState<any>({});
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [tRes, bRes, bsRes] = await Promise.all([
        getAllTeachers({ search, limit: 100 }),
        getAllBranches({ limit: 100 }),
        getAllBatchSubjects({ limit: 500 }),
      ]);
      setTeachers(tRes?.data || []);
      setBranches(bRes?.data || []);
      setBatchSubjects(bsRes?.data || []);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const openDetails = async (id: string) => {
    try {
      const res = await getTeacherById(id);
      setSelectedTeacher(res.data);
      setModal("details");
    } catch {
      showToast("Failed to fetch details", "error");
    }
  };

  const openEdit = (teacher: any) => {
    setForm({
      id: teacher.id,
      branchId: teacher.branchId || "",
      qualification: teacher.qualification || "",
      experience: teacher.experience || "",
      specialization: teacher.specialization || "",
      bio: teacher.bio || "",
    });
    setModal("edit");
  };

  const openCreate = () => {
    setForm({ name: "", email: "", phone: "", password: "", branchId: "", qualification: "", experience: "", specialization: "", bio: "" });
    setModal("create");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modal === "create") {
        const userRes = await createUser({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: "TEACHER" });
        await createTeacher({
          userId: userRes.data.id,
          branchId: form.branchId,
          qualification: form.qualification || null,
          experience: form.experience ? Number(form.experience) : null,
          specialization: form.specialization || null,
          bio: form.bio || null,
        });
        showToast("Teacher created!");
      } else {
        await updateTeacher(form.id, {
          branchId: form.branchId,
          qualification: form.qualification || null,
          experience: form.experience ? Number(form.experience) : null,
          specialization: form.specialization || null,
          bio: form.bio || null,
        });
        showToast("Teacher profile updated!");
      }
      setModal(null);
      load();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Operation failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teacher profile?")) return;
    try {
      await deleteTeacher(id);
      showToast("Teacher deleted.");
      load();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to delete", "error");
    }
  };

  const handleDeactivate = (teacher: any) => {
    showToast(`${teacher.user?.name} has been deactivated (mock action).`, "success");
  };

  // Count classes assigned per teacher
  const getClassesAssigned = (teacherId: string) =>
    batchSubjects.filter(bs => bs.teacherId === teacherId).length;

  // Get subject names for a teacher
  const getSubjectNames = (teacherId: string) => {
    const subjects = batchSubjects
      .filter(bs => bs.teacherId === teacherId)
      .map(bs => bs.subject?.name)
      .filter(Boolean);
    return [...new Set(subjects)];
  };

  const filteredTeachers = teachers.filter(t => {
    if (filterBranch && t.branchId !== filterBranch) return false;
    if (filterStatus && (t.user?.isActive ? "ACTIVE" : "INACTIVE") !== filterStatus) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg border text-sm font-medium shadow-lg transition-all ${toast.type === "success" ? "bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]" : "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F2F2]">Teacher Management</h1>
          <p className="text-sm text-[#71717A] mt-1">Manage teaching staff, subjects, and course assignments.</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-[#22C55E] text-[#052E16] text-sm font-bold rounded-lg hover:bg-[#16A34A] transition">
          + Add Teacher
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Teachers", value: teachers.length, icon: "👩‍🏫", color: "text-[#22C55E]" },
          { label: "Active", value: teachers.filter(t => t.user?.isActive !== false).length, icon: "✅", color: "text-[#3B82F6]" },
          { label: "Branches Covered", value: branches.length, icon: "🏢", color: "text-[#8B5CF6]" },
          { label: "Subjects Assigned", value: new Set(batchSubjects.map(bs => bs.subjectId)).size, icon: "📚", color: "text-[#F59E0B]" },
        ].map((s) => (
          <div key={s.label} className="bg-[#111010] border border-[#1C1917] rounded-xl p-4">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-[#71717A] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-[#111010] p-4 rounded-xl border border-[#1C1917] flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute inset-y-0 left-3 flex items-center text-[#71717A] text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg pl-9 pr-4 py-2 text-sm text-[#F2F2F2] placeholder-[#71717A] outline-none focus:border-[#22C55E] transition"
          />
        </div>
        <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} className="bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
          <option value="">All Branches</option>
          {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2 text-sm text-[#F2F2F6] outline-none focus:border-[#22C55E]">
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#1C1917] bg-[#111010] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1C1917] text-[#71717A] text-xs bg-[#080706]">
                <th className="px-5 py-4 text-left font-medium uppercase tracking-wider">Teacher</th>
                <th className="px-5 py-4 text-left font-medium uppercase tracking-wider">Subjects</th>
                <th className="px-5 py-4 text-left font-medium uppercase tracking-wider">Branch</th>
                <th className="px-5 py-4 text-center font-medium uppercase tracking-wider">Classes Assigned</th>
                <th className="px-5 py-4 text-center font-medium uppercase tracking-wider">Rating</th>
                <th className="px-5 py-4 text-center font-medium uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 text-right font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1917]">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-5 py-5"><div className="h-4 bg-[#1C1917] rounded animate-pulse" /></td>)}</tr>
                ))
              ) : filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <p className="text-4xl mb-3">👩‍🏫</p>
                    <p className="text-[#71717A]">No teachers found.</p>
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((t) => {
                  const subjects = getSubjectNames(t.id);
                  const classesCount = getClassesAssigned(t.id);
                  const rating = RATINGS[t.user?.name?.length % 5] || "⭐⭐⭐⭐";
                  const isActive = t.user?.isActive !== false;

                  return (
                    <tr key={t.id} className="hover:bg-[#1C1917]/30 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] flex items-center justify-center font-bold text-sm shadow-inner flex-shrink-0">
                            {t.user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[#F2F2F2]">{t.user?.name || "N/A"}</p>
                            <p className="text-xs text-[#71717A]">{t.user?.email}</p>
                            {t.qualification && <p className="text-xs text-[#A1A1AA]">{t.qualification}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {subjects.length > 0 ? subjects.slice(0, 2).map(s => (
                            <span key={s} className="px-2 py-0.5 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 text-[10px] font-medium rounded-full">
                              {s}
                            </span>
                          )) : <span className="text-[#71717A] text-xs">—</span>}
                          {subjects.length > 2 && <span className="px-2 py-0.5 bg-[#1C1917] text-[#A1A1AA] text-[10px] rounded-full">+{subjects.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[#F2F2F2] font-medium">{t.branch?.name || "—"}</p>
                        {t.experience != null && <p className="text-xs text-[#71717A]">{t.experience} yrs exp</p>}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 px-3 py-1 rounded-full text-sm font-bold">
                          {classesCount}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-sm" title={`${5 - RATINGS.indexOf(rating)} stars`}>{rating}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${isActive ? "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30" : "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30"}`}>
                          {isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openDetails(t.id)} className="px-2.5 py-1.5 text-xs bg-[#1C1917] text-[#F2F2F2] rounded hover:bg-[#3B82F6] transition" title="View">👁️</button>
                          <button onClick={() => openEdit(t)} className="px-2.5 py-1.5 text-xs bg-[#1C1917] text-[#F2F2F2] rounded hover:bg-[#22C55E] hover:text-[#052E16] transition" title="Edit">✏️</button>
                          <button onClick={() => handleDeactivate(t)} className="px-2.5 py-1.5 text-xs bg-[#1C1917] text-[#F2F2F2] rounded hover:bg-[#F59E0B] hover:text-[#1C0800] transition" title="Deactivate">🔒</button>
                          <button onClick={() => handleDelete(t.id)} className="px-2.5 py-1.5 text-xs bg-[#1C1917] text-[#F2F2F2] rounded hover:bg-[#EF4444] transition" title="Delete">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {modal === "details" && selectedTeacher && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111010] border border-[#1C1917] w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
            <button onClick={() => setModal(null)} className="absolute top-4 right-4 text-[#71717A] hover:text-[#F2F2F2] transition">✕</button>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] flex items-center justify-center text-2xl font-bold">
                {selectedTeacher.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-[#F2F2F2] text-xl">{selectedTeacher.user?.name}</h3>
                <p className="text-[#A1A1AA] text-sm">{selectedTeacher.branch?.name}</p>
                {selectedTeacher.specialization && <p className="text-[#8B5CF6] text-xs mt-0.5">{selectedTeacher.specialization}</p>}
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3 bg-[#0D0B0A] p-4 rounded-lg border border-[#1C1917]">
                <div><span className="text-[#71717A] block text-xs">Email</span><span className="text-[#F2F2F2]">{selectedTeacher.user?.email}</span></div>
                <div><span className="text-[#71717A] block text-xs">Phone</span><span className="text-[#F2F2F2]">{selectedTeacher.user?.phone}</span></div>
                <div><span className="text-[#71717A] block text-xs">Qualification</span><span className="text-[#F2F2F2]">{selectedTeacher.qualification || "N/A"}</span></div>
                <div><span className="text-[#71717A] block text-xs">Experience</span><span className="text-[#F2F2F2]">{selectedTeacher.experience != null ? `${selectedTeacher.experience} years` : "N/A"}</span></div>
              </div>
              {selectedTeacher.bio && (
                <div className="bg-[#0D0B0A] p-4 rounded-lg border border-[#1C1917]">
                  <span className="text-[#71717A] block text-xs mb-1">Bio</span>
                  <p className="text-[#F2F2F2]">{selectedTeacher.bio}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setModal(null)} className="px-4 py-2 bg-[#27272A] text-[#F2F2F2] text-sm font-medium rounded-lg hover:bg-[#3F3F46] transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {(modal === "edit" || modal === "create") && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111010] border border-[#1C1917] w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-[#1C1917] flex justify-between items-center sticky top-0 bg-[#111010]">
              <h3 className="font-bold text-[#F2F2F2]">{modal === "create" ? "Add Teacher" : "Edit Teacher Profile"}</h3>
              <button onClick={() => setModal(null)} className="text-[#71717A] hover:text-[#F2F2F2] transition">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {modal === "create" && (
                <>
                  {[
                    { label: "Full Name", key: "name", required: true },
                    { label: "Email", key: "email", type: "email", required: true },
                    { label: "Phone", key: "phone", required: true },
                    { label: "Password", key: "password", type: "password", required: true },
                  ].map(({ label, key, type, required }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1.5">{label} {required && "*"}</label>
                      <input required={required} type={type || "text"} value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E] transition" />
                    </div>
                  ))}
                </>
              )}
              <div>
                <label className="block text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1.5">Branch *</label>
                <select required value={form.branchId || ""} onChange={(e) => setForm({ ...form, branchId: e.target.value })}
                  className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
                  <option value="">Select branch</option>
                  {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              {[
                { label: "Qualification", key: "qualification" },
                { label: "Experience (years)", key: "experience", type: "number" },
                { label: "Specialization", key: "specialization" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1.5">{label}</label>
                  <input type={type || "text"} value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E] transition" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1.5">Bio</label>
                <textarea value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E] transition" rows={3} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm text-[#71717A] hover:text-[#F2F2F2] transition">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#22C55E] text-[#052E16] text-sm font-bold rounded-lg hover:bg-[#16A34A] transition disabled:opacity-50">
                  {submitting ? "Saving..." : modal === "create" ? "Create Teacher" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
