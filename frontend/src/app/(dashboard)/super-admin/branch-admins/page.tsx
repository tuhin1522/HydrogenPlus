"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { swalConfirm, swalError, swalSuccess } from "@/app/lib/swal";
import {
  getAllBranchAdmins,
  getAllBranches,
  getAllTeachers,
  createBranchAdmin,
  updateBranchAdmin,
  deleteBranchAdmin,
  CreateBranchAdminPayload,
} from "@/app/modules/super-admin/services/super-admin.service";

export default function BranchAdminsPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<CreateBranchAdminPayload>({ userId: "", branchId: "", designation: "", joiningDate: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
      const [adminsRes, branchRes, teacherRes] = await Promise.all([
        getAllBranchAdmins(),
        getAllBranches({ limit: 200 }),
        getAllTeachers({ limit: 200 }),
      ]);
      setAdmins(adminsRes?.data || []);
      setBranches(branchRes?.data || []);
      setTeachers(teacherRes?.data || []);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ userId: "", branchId: "", designation: "", joiningDate: "" });
    setEditingId(null);
    setModal("create");
  };

  const openEdit = (admin: any) => {
    setForm({
      userId: admin.userId,
      branchId: admin.branchId,
      designation: admin.designation || "",
      joiningDate: admin.joiningDate ? admin.joiningDate.split("T")[0] : "",
    });
    setEditingId(admin.id);
    setModal("edit");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        joiningDate: form.joiningDate ? new Date(form.joiningDate as string).toISOString() : undefined,
      };
      if (modal === "edit" && editingId) {
        await updateBranchAdmin(editingId, payload);
        await swalSuccess({ title: "Branch admin updated", text: "The branch admin details were updated successfully." });
        showToast("Branch admin updated!");
      } else {
        await createBranchAdmin(payload);
        await swalSuccess({ title: "Branch admin assigned", text: "The branch admin role was assigned successfully." });
        showToast("Branch admin assigned!");
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
    const confirmed = await swalConfirm({ title: "Remove this branch admin role?", text: "The user will revert to the teacher role." });
    if (!confirmed) return;
    try {
      await deleteBranchAdmin(id);
      await swalSuccess({ title: "Branch admin removed", text: "The role was removed successfully." });
      showToast("Branch admin removed.");
      load();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed";
      await swalError({ title: "Delete failed", text: message });
      showToast(message, "error");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Branch Admin Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Assign and manage branch administrators</p>
        </div>
        <button onClick={openCreate} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90">
          + Assign Branch Admin
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="px-5 py-3 text-left font-medium uppercase tracking-wider">Admin</th>
              <th className="px-5 py-3 text-left font-medium uppercase tracking-wider">Branch</th>
              <th className="px-5 py-3 text-left font-medium uppercase tracking-wider">Designation</th>
              <th className="px-5 py-3 text-left font-medium uppercase tracking-wider">Joined</th>
              <th className="px-5 py-3 text-right font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 5 }).map((_, j) => (<td key={j} className="px-5 py-4"><div className="h-4 animate-pulse rounded bg-muted/40" /></td>))}</tr>
              ))
            ) : admins.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-16 text-center"><p className="mb-3 text-4xl">👤</p><p className="text-muted-foreground">No branch admins assigned yet.</p></td></tr>
            ) : (
              admins.map((a) => (
                <tr key={a.id} className="transition-colors hover:bg-muted/20">
                  <td className="px-5 py-4">
                    <p className="font-medium text-foreground">{a.user?.name || "N/A"}</p>
                    <p className="text-xs text-muted-foreground">{a.user?.email}</p>
                  </td>
                  <td className="px-5 py-4 font-medium text-emerald-600">{a.branch?.name || "N/A"}</td>
                  <td className="px-5 py-4 text-muted-foreground">{a.designation || "Branch Admin"}</td>
                  <td className="px-5 py-4 text-muted-foreground">{a.joiningDate ? new Date(a.joiningDate).toLocaleDateString() : "N/A"}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(a)} className="rounded-lg border border-border px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-primary">Edit</button>
                      <button onClick={() => handleDelete(a.id)} className="rounded-lg border border-border px-3 py-1 text-xs text-muted-foreground transition hover:border-destructive/40 hover:text-destructive">Remove</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="font-bold text-foreground">{modal === "edit" ? "Edit Branch Admin" : "Assign Branch Admin"}</h3>
              <button onClick={() => setModal(null)} className="text-muted-foreground transition hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Teacher (User) *</label>
                <select required value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary">
                  <option value="">-- Select Teacher --</option>
                  {teachers.map((t) => (<option key={t.id} value={t.userId}>{t.user?.name} ({t.user?.email})</option>))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Branch *</label>
                <select required value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary">
                  <option value="">-- Select Branch --</option>
                  {branches.map((b) => (<option key={b.id} value={b.id}>{b.name} – {b.address}</option>))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Designation</label>
                <input type="text" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="e.g. Principal" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Joining Date</label>
                <input type="date" value={form.joiningDate as string} onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground">Cancel</button>
                <button type="submit" disabled={submitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50">
                  {submitting ? "Saving..." : modal === "edit" ? "Save Changes" : "Assign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
