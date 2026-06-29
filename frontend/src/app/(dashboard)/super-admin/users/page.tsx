"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { swalConfirm, swalError, swalSuccess } from "@/app/lib/swal";
import {
  getAllUsers,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
} from "@/app/modules/super-admin/services/super-admin.service";

const ROLES = ["STUDENT", "TEACHER", "BRANCH_ADMIN"] as const;

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<any>({});
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
      const params: Record<string, string> = { search, limit: "100" };
      if (roleFilter) params.role = roleFilter;
      const res = await getAllUsers(params);
      setUsers(res?.data || []);
    } catch {
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const openCreate = () => {
    setForm({ name: "", email: "", phone: "", password: "", role: "STUDENT" });
    setEditingId(null);
    setModal("create");
  };

  const openEdit = (user: any) => {
    setForm({ name: user.name, email: user.email, phone: user.phone, role: user.role, isActive: user.isActive });
    setEditingId(user.id);
    setModal("edit");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modal === "edit" && editingId) {
        await updateUser(editingId, { name: form.name, email: form.email, phone: form.phone, role: form.role, isActive: form.isActive });
        await swalSuccess({ title: "User updated", text: "The user account was updated successfully." });
        showToast("User updated!");
      } else {
        await createUser(form);
        await swalSuccess({ title: "User created", text: "The user account was created successfully." });
        showToast("User created!");
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

  const toggleStatus = async (user: any) => {
    const confirmed = await swalConfirm({ title: `${user.isActive ? "Deactivate" : "Activate"} this user?`, text: `This will change the account status for ${user.name || "this user"}.` });
    if (!confirmed) return;
    try {
      await updateUserStatus(user.id, !user.isActive);
      await swalSuccess({ title: "Status updated", text: `User ${user.isActive ? "deactivated" : "activated"}.` });
      showToast(`User ${user.isActive ? "deactivated" : "activated"}.`);
      load();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to update status";
      await swalError({ title: "Status update failed", text: message });
      showToast(message, "error");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await swalConfirm({ title: "Delete this user permanently?", text: "This action cannot be undone." });
    if (!confirmed) return;
    try {
      await deleteUser(id);
      await swalSuccess({ title: "User deleted", text: "The user account was removed successfully." });
      showToast("User deleted.");
      load();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to delete";
      await swalError({ title: "Delete failed", text: message });
      showToast(message, "error");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F2F2]">User Management</h1>
          <p className="text-sm text-[#71717A] mt-1">Manage platform user accounts and roles</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-[#22C55E] text-[#052E16] text-sm font-bold rounded-lg hover:bg-[#16A34A] transition">
          + Create User
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative max-w-sm flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-[#71717A] text-sm">🔍</span>
          <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111010] border border-[#1C1917] rounded-lg pl-9 pr-4 py-2 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-[#111010] border border-[#1C1917] rounded-lg px-3 py-2 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
          <option value="">All Roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="rounded-xl border border-[#1C1917] bg-[#111010] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1C1917] text-[#71717A] text-xs">
              <th className="px-5 py-3 text-left font-medium uppercase">User</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Role</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Status</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Joined</th>
              <th className="px-5 py-3 text-right font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1917]">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-[#1C1917] rounded animate-pulse" /></td>)}</tr>
              ))
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-16 text-center text-[#71717A]">No users found.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-[#1C1917]/20">
                  <td className="px-5 py-4">
                    <p className="font-medium text-[#F2F2F2]">{u.name || "—"}</p>
                    <p className="text-xs text-[#71717A]">{u.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-[#27272A] text-[#A1A1AA]">{u.role}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.isActive ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#EF4444]/10 text-[#EF4444]"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#71717A]">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-right space-x-2">
                    {u.role !== "SUPER_ADMIN" && (
                      <>
                        <button onClick={() => openEdit(u)} className="px-3 py-1 text-xs border border-[#27272A] text-[#A1A1AA] rounded-lg hover:text-[#22C55E]">Edit</button>
                        <button onClick={() => toggleStatus(u)} className="px-3 py-1 text-xs border border-[#27272A] text-[#A1A1AA] rounded-lg hover:text-[#F59E0B]">
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="px-3 py-1 text-xs border border-[#27272A] text-[#A1A1AA] rounded-lg hover:text-[#EF4444]">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111010] border border-[#1C1917] w-full max-w-md rounded-2xl shadow-2xl">
            <div className="px-6 py-4 border-b border-[#1C1917] flex justify-between items-center">
              <h3 className="font-bold text-[#F2F2F2]">{modal === "edit" ? "Edit User" : "Create User"}</h3>
              <button onClick={() => setModal(null)} className="text-[#71717A]">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { label: "Name", key: "name", required: true },
                { label: "Email", key: "email", type: "email", required: true },
                { label: "Phone", key: "phone", required: true },
                ...(modal === "create" ? [{ label: "Password", key: "password", type: "password", required: true }] : []),
              ].map(({ label, key, type, required }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">{label} *</label>
                  <input required={required} type={type || "text"} value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Role *</label>
                <select required value={form.role || "STUDENT"} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {modal === "edit" && (
                <label className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                  Active account
                </label>
              )}
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm text-[#71717A]">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#22C55E] text-[#052E16] text-sm font-bold rounded-lg disabled:opacity-50">
                  {submitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
