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

type BranchItem = {
  id: string;
  name: string;
  managerName: string;
  address: string;
  phone: string;
  email?: string | null;
  status?: "ACTIVE" | "INACTIVE";
};

type StudentItem = { id: string; batch?: { branchId?: string | null } };
type TeacherItem = { id: string; branchId?: string | null };
type BranchFormField = "name" | "managerName" | "address" | "phone" | "email";

const PERF_COLORS = ["text-[#22C55E]", "text-[#3B82F6]", "text-[#8B5CF6]", "text-[#F59E0B]", "text-[#EF4444]"];
const MOCK_REVENUES = [120000, 85000, 95000, 150000, 70000, 110000];
const MOCK_PERFS = [92, 78, 85, 95, 67, 88];

export default function BranchesPage() {
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
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
  const openEdit = (b: BranchItem) => {
    setForm({ name: b.name, managerName: b.managerName, address: b.address, phone: b.phone, email: b.email || "", status: b.status });
    setEditingId(b.id);
    setModal("edit");
  };

  const updateTextField = (key: BranchFormField, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Operation failed";
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete";
      await swalError({ title: "Delete failed", text: message });
      showToast(message, "error");
    } finally {
      setDeletingId(null);
    }
  };

  // Simple bar for comparison chart
  const maxStudents = Math.max(...branches.map((_, i) => MOCK_REVENUES[i % MOCK_REVENUES.length]), 1);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Branch Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Monitor, compare, and manage all coaching branches.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
            <button onClick={() => setViewMode("cards")} className={`rounded px-3 py-1.5 text-xs font-medium transition ${viewMode === "cards" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              🃏 Cards
            </button>
            <button onClick={() => setViewMode("table")} className={`rounded px-3 py-1.5 text-xs font-medium transition ${viewMode === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              📋 Table
            </button>
          </div>
          <button onClick={openCreate} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90">
            + Create Branch
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total Branches", value: branches.length, icon: "🏢", color: "text-emerald-600" },
          { label: "Active Branches", value: branches.filter(b => b.status === "ACTIVE").length, icon: "✅", color: "text-blue-600" },
          { label: "Total Students", value: students.length, icon: "🎓", color: "text-violet-600" },
          { label: "Total Teachers", value: teachers.length, icon: "👩‍🏫", color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Chart */}
      {branches.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-bold text-foreground">Branch Revenue Comparison</h2>
          <div className="space-y-3">
            {branches.slice(0, 6).map((b, i) => {
              const rev = MOCK_REVENUES[i % MOCK_REVENUES.length];
              const pct = Math.round((rev / maxStudents) * 100);
              const colors = ["bg-[#22C55E]", "bg-[#3B82F6]", "bg-[#8B5CF6]", "bg-[#F59E0B]", "bg-[#EF4444]", "bg-[#06B6D4]"];
              return (
                <div key={b.id} className="flex items-center gap-3">
                  <p className="w-28 flex-shrink-0 truncate text-xs text-muted-foreground">{b.name}</p>
                  <div className="h-6 flex-1 overflow-hidden rounded-lg bg-muted/40">
                    <div className={`flex h-full items-center justify-end rounded-lg pr-2 transition-all duration-700 ${colors[i % colors.length]}`} style={{ width: `${pct}%` }}>
                      <span className="text-[10px] font-bold text-white/80">৳{(rev / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                  <p className="w-16 flex-shrink-0 text-right font-mono text-xs text-emerald-600">৳{rev.toLocaleString()}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <span className="absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">🔍</span>
        <input type="text" placeholder="Search branches..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary" />
      </div>

      {/* ===== CARD VIEW ===== */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="h-5 w-3/4 rounded bg-muted/40" />
                <div className="h-4 w-1/2 rounded bg-muted/40" />
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(4)].map((_, j) => <div key={j} className="h-14 rounded-lg bg-muted/40" />)}
                </div>
              </div>
            ))
          ) : branches.length === 0 ? (
            <div className="col-span-3 flex flex-col items-center py-20">
              <p className="text-5xl mb-4">🏢</p>
              <p className="text-lg text-muted-foreground">No branches found.</p>
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
                <div key={b.id} className={`rounded-xl border ${cardBorders[i % cardBorders.length]} bg-card p-5 transition-all duration-300 hover:shadow-lg group`}>
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🏢</span>
                        <h3 className="text-base font-bold text-foreground">{b.name}</h3>
                      </div>
                      <p className="ml-7 mt-1 text-xs text-muted-foreground">{b.address}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider ${b.status === "ACTIVE" ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600" : "border border-destructive/30 bg-destructive/10 text-destructive"}`}>
                      {b.status}
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="rounded-lg border border-border bg-background p-3">
                      <p className="text-xl font-bold text-emerald-600">{studentCount}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">Students</p>
                    </div>
                    <div className="rounded-lg border border-border bg-background p-3">
                      <p className="text-xl font-bold text-blue-600">{teacherCount}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">Teachers</p>
                    </div>
                    <div className="rounded-lg border border-border bg-background p-3">
                      <p className="text-xl font-bold text-amber-600">৳{(revenue / 1000).toFixed(0)}k</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">Revenue</p>
                    </div>
                    <div className="rounded-lg border border-border bg-background p-3">
                      <p className={`text-xl font-bold ${colorClass}`}>{perf}%</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">Performance</p>
                    </div>
                  </div>

                  {/* Performance Bar */}
                  <div className="mb-4">
                    <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                      <span>Performance Score</span>
                      <span>{perf}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted/40">
                      <div className={`h-full rounded-full ${perf >= 85 ? "bg-emerald-600" : perf >= 70 ? "bg-amber-600" : "bg-destructive"}`} style={{ width: `${perf}%` }} />
                    </div>
                  </div>

                  {/* Manager */}
                  <div className="mb-4 text-xs text-muted-foreground">
                    👤 <span className="text-foreground">{b.managerName}</span> · 📞 {b.phone}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(b)} className="flex-1 rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-primary">
                      ✏️ Edit
                    </button>
                    <button className="flex-1 rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground transition hover:border-blue-500/40 hover:text-blue-600" onClick={() => showToast(`Managing staff for ${b.name}...`)}>
                      👥 Staff
                    </button>
                    <button className="flex-1 rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground transition hover:border-violet-500/40 hover:text-violet-600" onClick={() => showToast(`Analytics for ${b.name} coming soon!`)}>
                      📈 Analytics
                    </button>
                    <button onClick={() => handleDelete(b.id)} disabled={deletingId === b.id} className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition hover:border-destructive/40 hover:text-destructive disabled:opacity-50">
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
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-xs text-muted-foreground">
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
              <tbody className="divide-y divide-border">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 8 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 animate-pulse rounded bg-muted/40" /></td>)}</tr>
                  ))
                ) : branches.length === 0 ? (
                  <tr><td colSpan={8} className="px-5 py-16 text-center"><p className="text-muted-foreground">No branches found.</p></td></tr>
                ) : (
                  branches.map((b, i) => {
                    const perf = MOCK_PERFS[i % MOCK_PERFS.length];
                    const revenue = MOCK_REVENUES[i % MOCK_REVENUES.length];
                    return (
                      <tr key={b.id} className="group transition-colors hover:bg-muted/20">
                        <td className="px-5 py-4">
                          <p className="font-bold text-foreground">{b.name}</p>
                          <p className="max-w-[150px] truncate text-xs text-muted-foreground">{b.address}</p>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">{b.managerName}</td>
                        <td className="px-5 py-4 text-center font-bold text-emerald-600">{getStudentCount(b.id)}</td>
                        <td className="px-5 py-4 text-center font-bold text-blue-600">{getTeacherCount(b.id)}</td>
                        <td className="px-5 py-4 text-center font-mono text-amber-600">৳{(revenue / 1000).toFixed(0)}k</td>
                        <td className="px-5 py-4 text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <div className="h-1.5 w-20 rounded-full bg-muted/40">
                              <div className={`h-full rounded-full ${perf >= 85 ? "bg-emerald-600" : perf >= 70 ? "bg-amber-600" : "bg-destructive"}`} style={{ width: `${perf}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground">{perf}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider ${b.status === "ACTIVE" ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600" : "border border-destructive/30 bg-destructive/10 text-destructive"}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(b)} className="rounded bg-muted/40 px-2.5 py-1.5 text-xs text-foreground transition hover:bg-primary/10 hover:text-primary">✏️</button>
                            <button onClick={() => handleDelete(b.id)} disabled={deletingId === b.id} className="rounded bg-muted/40 px-2.5 py-1.5 text-xs text-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-50">🗑️</button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="font-bold text-foreground">{modal === "edit" ? "Edit Branch" : "Create New Branch"}</h3>
              <button onClick={() => setModal(null)} className="text-muted-foreground transition hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {[
                { label: "Branch Name *", key: "name", placeholder: "e.g. Dhaka Central", required: true },
                { label: "Manager Name *", key: "managerName", placeholder: "Manager's full name", required: true },
                { label: "Address *", key: "address", placeholder: "Full address", required: true },
                { label: "Phone *", key: "phone", placeholder: "e.g. 01700000000", required: true },
                { label: "Email", key: "email", placeholder: "branch@gmail.com" },
              ].map(({ label, key, placeholder, required }) => {
                const fieldKey = key as BranchFormField;
                return (
                  <div key={fieldKey}>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
                    <input required={required} type={fieldKey === "email" ? "email" : "text"} value={form[fieldKey]} onChange={(e) => updateTextField(fieldKey, e.target.value)}
                      placeholder={placeholder} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary" />
                  </div>
                );
              })}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as CreateBranchPayload["status"] })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary">
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground">Cancel</button>
                <button type="submit" disabled={submitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50">
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
