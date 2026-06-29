"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { swalConfirm, swalError, swalSuccess } from "@/app/lib/swal";
import {
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  getAllStudents,
  getAllTeachers,
  CreateBranchPayload,
} from "@/app/modules/super-admin/services/super-admin.service";

const EMPTY_FORM: CreateBranchPayload = { name: "", managerName: "", address: "", phone: "", email: "", status: "ACTIVE" };

const PERF_COLORS = ["text-[#22C55E]", "text-[#3B82F6]", "text-[#8B5CF6]", "text-[#F59E0B]", "text-[#EF4444]"];
const MOCK_REVENUES = [120000, 85000, 95000, 150000, 70000, 110000];
const MOCK_PERFS = [92, 78, 85, 95, 67, 88];

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<CreateBranchPayload>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    if (type === "error") {
      toast.error(msg);
    } else {
      toast.success(msg);
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [bRes, sRes, tRes] = await Promise.all([
        getAllBranches({ search, limit: 100 }),
        getAllStudents({ limit: 500 }),
        getAllTeachers({ limit: 500 }),
      ]);
      setBranches(bRes?.data || []);
      setStudents(sRes?.data || []);
      setTeachers(tRes?.data || []);
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

  const getStudentCount = (branchId: string) =>
    students.filter(s => s.batch?.branchId === branchId).length;
  const getTeacherCount = (branchId: string) =>
    teachers.filter(t => t.branchId === branchId).length;

  const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setModal("create"); };
  const openEdit = (b: any) => {
    setForm({ name: b.name, managerName: b.managerName, address: b.address, phone: b.phone, email: b.email || "", status: b.status });
    setEditingId(b.id);
    setModal("edit");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modal === "edit" && editingId) {
        await updateBranch(editingId, form);
        await swalSuccess({ title: "Branch updated", text: "The branch details were updated successfully." });
        showToast("Branch updated!");
      } else {
        await createBranch(form);
        await swalSuccess({ title: "Branch created", text: "The new branch was created successfully." });
        showToast("Branch created!");
      }
      setModal(null);
      load();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Operation failed";
      await swalError({ title: "Operation failed", text: message });
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await swalConfirm({ title: "Delete branch?", text: "This action cannot be undone." });
    if (!confirmed) return;
    setDeletingId(id);
    try {
      await deleteBranch(id);
      await swalSuccess({ title: "Branch deleted", text: "The branch was removed successfully." });
      showToast("Branch deleted.");
      load();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to delete";
      await swalError({ title: "Delete failed", text: message });
      showToast(message, "error");
    } finally {
      setDeletingId(null);
    }
  };

  // Simple bar for comparison chart
  const maxStudents = Math.max(...branches.map((_, i) => MOCK_REVENUES[i % MOCK_REVENUES.length]), 1);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F2F2]">Branch Management</h1>
          <p className="text-sm text-[#71717A] mt-1">Monitor, compare, and manage all coaching branches.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-[#111010] border border-[#1C1917] rounded-lg p-1 gap-1">
            <button onClick={() => setViewMode("cards")} className={`px-3 py-1.5 text-xs font-medium rounded transition ${viewMode === "cards" ? "bg-[#22C55E] text-[#052E16]" : "text-[#71717A] hover:text-[#F2F2F2]"}`}>
              🃏 Cards
            </button>
            <button onClick={() => setViewMode("table")} className={`px-3 py-1.5 text-xs font-medium rounded transition ${viewMode === "table" ? "bg-[#22C55E] text-[#052E16]" : "text-[#71717A] hover:text-[#F2F2F2]"}`}>
              📋 Table
            </button>
          </div>
          <button onClick={openCreate} className="px-4 py-2 bg-[#22C55E] text-[#052E16] text-sm font-bold rounded-lg hover:bg-[#16A34A] transition">
            + Create Branch
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Branches", value: branches.length, icon: "🏢", color: "text-[#22C55E]" },
          { label: "Active Branches", value: branches.filter(b => b.status === "ACTIVE").length, icon: "✅", color: "text-[#3B82F6]" },
          { label: "Total Students", value: students.length, icon: "🎓", color: "text-[#8B5CF6]" },
          { label: "Total Teachers", value: teachers.length, icon: "👩‍🏫", color: "text-[#F59E0B]" },
        ].map((s) => (
          <div key={s.label} className="bg-[#111010] border border-[#1C1917] rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-[#71717A]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Chart */}
      {branches.length > 0 && (
        <div className="bg-[#111010] border border-[#1C1917] rounded-xl p-5">
          <h2 className="text-sm font-bold text-[#F2F2F2] mb-4">Branch Revenue Comparison</h2>
          <div className="space-y-3">
            {branches.slice(0, 6).map((b, i) => {
              const rev = MOCK_REVENUES[i % MOCK_REVENUES.length];
              const pct = Math.round((rev / maxStudents) * 100);
              const colors = ["bg-[#22C55E]", "bg-[#3B82F6]", "bg-[#8B5CF6]", "bg-[#F59E0B]", "bg-[#EF4444]", "bg-[#06B6D4]"];
              return (
                <div key={b.id} className="flex items-center gap-3">
                  <p className="text-xs text-[#A1A1AA] w-28 truncate flex-shrink-0">{b.name}</p>
                  <div className="flex-1 h-6 bg-[#1C1917] rounded-lg overflow-hidden">
                    <div className={`h-full ${colors[i % colors.length]} rounded-lg transition-all duration-700 flex items-center justify-end pr-2`} style={{ width: `${pct}%` }}>
                      <span className="text-[10px] font-bold text-white/80">৳{(rev / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#22C55E] font-mono w-16 text-right flex-shrink-0">৳{rev.toLocaleString()}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <span className="absolute inset-y-0 left-3 flex items-center text-[#71717A] text-sm">🔍</span>
        <input type="text" placeholder="Search branches..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111010] border border-[#1C1917] rounded-lg pl-9 pr-4 py-2 text-sm text-[#F2F2F2] placeholder-[#71717A] outline-none focus:border-[#22C55E] transition" />
      </div>

      {/* ===== CARD VIEW ===== */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-[#111010] border border-[#1C1917] rounded-xl p-5 space-y-4 animate-pulse">
                <div className="h-5 bg-[#1C1917] rounded w-3/4" />
                <div className="h-4 bg-[#1C1917] rounded w-1/2" />
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(4)].map((_, j) => <div key={j} className="h-14 bg-[#1C1917] rounded-lg" />)}
                </div>
              </div>
            ))
          ) : branches.length === 0 ? (
            <div className="col-span-3 flex flex-col items-center py-20">
              <p className="text-5xl mb-4">🏢</p>
              <p className="text-[#71717A] text-lg">No branches found.</p>
            </div>
          ) : (
            branches.map((b, i) => {
              const studentCount = getStudentCount(b.id);
              const teacherCount = getTeacherCount(b.id);
              const perf = MOCK_PERFS[i % MOCK_PERFS.length];
              const revenue = MOCK_REVENUES[i % MOCK_REVENUES.length];
              const colorClass = PERF_COLORS[i % PERF_COLORS.length];
              const cardBorders = ["border-[#22C55E]/20", "border-[#3B82F6]/20", "border-[#8B5CF6]/20", "border-[#F59E0B]/20", "border-[#EF4444]/20"];
              
              return (
                <div key={b.id} className={`bg-[#111010] border ${cardBorders[i % cardBorders.length]} rounded-xl p-5 hover:shadow-lg hover:shadow-black/40 transition-all duration-300 group`}>
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🏢</span>
                        <h3 className="font-bold text-[#F2F2F2] text-base">{b.name}</h3>
                      </div>
                      <p className="text-xs text-[#71717A] mt-1 ml-7">{b.address}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${b.status === "ACTIVE" ? "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30" : "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30"}`}>
                      {b.status}
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#0D0B0A] rounded-lg p-3 border border-[#1C1917]">
                      <p className="text-xl font-bold text-[#22C55E]">{studentCount}</p>
                      <p className="text-[10px] text-[#71717A] mt-0.5">Students</p>
                    </div>
                    <div className="bg-[#0D0B0A] rounded-lg p-3 border border-[#1C1917]">
                      <p className="text-xl font-bold text-[#3B82F6]">{teacherCount}</p>
                      <p className="text-[10px] text-[#71717A] mt-0.5">Teachers</p>
                    </div>
                    <div className="bg-[#0D0B0A] rounded-lg p-3 border border-[#1C1917]">
                      <p className="text-xl font-bold text-[#F59E0B]">৳{(revenue / 1000).toFixed(0)}k</p>
                      <p className="text-[10px] text-[#71717A] mt-0.5">Revenue</p>
                    </div>
                    <div className="bg-[#0D0B0A] rounded-lg p-3 border border-[#1C1917]">
                      <p className={`text-xl font-bold ${colorClass}`}>{perf}%</p>
                      <p className="text-[10px] text-[#71717A] mt-0.5">Performance</p>
                    </div>
                  </div>

                  {/* Performance Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[10px] text-[#71717A] mb-1">
                      <span>Performance Score</span>
                      <span>{perf}%</span>
                    </div>
                    <div className="h-1.5 bg-[#1C1917] rounded-full">
                      <div className={`h-full rounded-full ${perf >= 85 ? "bg-[#22C55E]" : perf >= 70 ? "bg-[#F59E0B]" : "bg-[#EF4444]"}`} style={{ width: `${perf}%` }} />
                    </div>
                  </div>

                  {/* Manager */}
                  <div className="text-xs text-[#71717A] mb-4">
                    👤 <span className="text-[#A1A1AA]">{b.managerName}</span> · 📞 {b.phone}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(b)} className="flex-1 py-1.5 text-xs border border-[#27272A] text-[#A1A1AA] rounded-lg hover:border-[#22C55E]/40 hover:text-[#22C55E] transition">
                      ✏️ Edit
                    </button>
                    <button className="flex-1 py-1.5 text-xs border border-[#27272A] text-[#A1A1AA] rounded-lg hover:border-[#3B82F6]/40 hover:text-[#3B82F6] transition" onClick={() => showToast(`Managing staff for ${b.name}...`)}>
                      👥 Staff
                    </button>
                    <button className="flex-1 py-1.5 text-xs border border-[#27272A] text-[#A1A1AA] rounded-lg hover:border-[#8B5CF6]/40 hover:text-[#8B5CF6] transition" onClick={() => showToast(`Analytics for ${b.name} coming soon!`)}>
                      📈 Analytics
                    </button>
                    <button onClick={() => handleDelete(b.id)} disabled={deletingId === b.id} className="px-2.5 py-1.5 text-xs border border-[#27272A] text-[#A1A1AA] rounded-lg hover:border-[#EF4444]/40 hover:text-[#EF4444] transition disabled:opacity-50">
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ===== TABLE VIEW ===== */}
      {viewMode === "table" && (
        <div className="rounded-xl border border-[#1C1917] bg-[#111010] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1C1917] text-[#71717A] text-xs bg-[#080706]">
                  <th className="px-5 py-4 text-left font-medium uppercase tracking-wider">Branch</th>
                  <th className="px-5 py-4 text-left font-medium uppercase tracking-wider">Manager</th>
                  <th className="px-5 py-4 text-center font-medium uppercase tracking-wider">Students</th>
                  <th className="px-5 py-4 text-center font-medium uppercase tracking-wider">Teachers</th>
                  <th className="px-5 py-4 text-center font-medium uppercase tracking-wider">Revenue</th>
                  <th className="px-5 py-4 text-center font-medium uppercase tracking-wider">Performance</th>
                  <th className="px-5 py-4 text-center font-medium uppercase tracking-wider">Status</th>
                  <th className="px-5 py-4 text-right font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1917]">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 8 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-[#1C1917] rounded animate-pulse" /></td>)}</tr>
                  ))
                ) : branches.length === 0 ? (
                  <tr><td colSpan={8} className="px-5 py-16 text-center"><p className="text-[#71717A]">No branches found.</p></td></tr>
                ) : (
                  branches.map((b, i) => {
                    const perf = MOCK_PERFS[i % MOCK_PERFS.length];
                    const revenue = MOCK_REVENUES[i % MOCK_REVENUES.length];
                    return (
                      <tr key={b.id} className="hover:bg-[#1C1917]/20 transition-colors group">
                        <td className="px-5 py-4">
                          <p className="font-bold text-[#F2F2F2]">{b.name}</p>
                          <p className="text-xs text-[#71717A] truncate max-w-[150px]">{b.address}</p>
                        </td>
                        <td className="px-5 py-4 text-[#A1A1AA]">{b.managerName}</td>
                        <td className="px-5 py-4 text-center font-bold text-[#22C55E]">{getStudentCount(b.id)}</td>
                        <td className="px-5 py-4 text-center font-bold text-[#3B82F6]">{getTeacherCount(b.id)}</td>
                        <td className="px-5 py-4 text-center font-mono text-[#F59E0B]">৳{(revenue / 1000).toFixed(0)}k</td>
                        <td className="px-5 py-4 text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <div className="w-20 h-1.5 bg-[#1C1917] rounded-full">
                              <div className={`h-full rounded-full ${perf >= 85 ? "bg-[#22C55E]" : perf >= 70 ? "bg-[#F59E0B]" : "bg-[#EF4444]"}`} style={{ width: `${perf}%` }} />
                            </div>
                            <span className="text-xs text-[#A1A1AA]">{perf}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${b.status === "ACTIVE" ? "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30" : "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30"}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(b)} className="px-2.5 py-1.5 text-xs bg-[#1C1917] text-[#F2F2F2] rounded hover:bg-[#22C55E] hover:text-[#052E16] transition">✏️</button>
                            <button onClick={() => handleDelete(b.id)} disabled={deletingId === b.id} className="px-2.5 py-1.5 text-xs bg-[#1C1917] text-[#F2F2F2] rounded hover:bg-[#EF4444] transition disabled:opacity-50">🗑️</button>
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
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111010] border border-[#1C1917] w-full max-w-lg rounded-2xl shadow-2xl">
            <div className="px-6 py-4 border-b border-[#1C1917] flex justify-between items-center">
              <h3 className="font-bold text-[#F2F2F2]">{modal === "edit" ? "Edit Branch" : "Create New Branch"}</h3>
              <button onClick={() => setModal(null)} className="text-[#71717A] hover:text-[#F2F2F2] transition">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { label: "Branch Name *", key: "name", placeholder: "e.g. Dhaka Central", required: true },
                { label: "Manager Name *", key: "managerName", placeholder: "Manager's full name", required: true },
                { label: "Address *", key: "address", placeholder: "Full address", required: true },
                { label: "Phone *", key: "phone", placeholder: "e.g. 01700000000", required: true },
                { label: "Email", key: "email", placeholder: "branch@gmail.com" },
              ].map(({ label, key, placeholder, required }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1.5">{label}</label>
                  <input required={required} type={key === "email" ? "email" : "text"} value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder} className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] placeholder-[#71717A] outline-none focus:border-[#22C55E] transition" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1.5">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E] transition">
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm text-[#71717A] hover:text-[#F2F2F2] transition">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#22C55E] text-[#052E16] text-sm font-bold rounded-lg hover:bg-[#16A34A] transition disabled:opacity-50">
                  {submitting ? "Saving..." : modal === "edit" ? "Save Changes" : "Create Branch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
