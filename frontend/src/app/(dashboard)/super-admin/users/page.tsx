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

type UserRecord = {
  id: string;
  name?: string | null;
  email?: string;
  phone?: string | null;
  role: string;
  isActive?: boolean;
  createdAt: string;
};

type UserFormState = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
  [key: string]: string | boolean | undefined;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<UserFormState>({});
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

  const openEdit = (user: UserRecord) => {
    setForm({ name: user.name ?? "", email: user.email ?? "", phone: user.phone ?? "", role: user.role, isActive: user.isActive });
    setEditingId(user.id);
    setModal("edit");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: form.name ?? "",
        email: form.email ?? "",
        phone: form.phone ?? "",
        password: form.password ?? "",
        role: (form.role ?? "STUDENT") as "STUDENT" | "TEACHER" | "BRANCH_ADMIN",
        isActive: form.isActive,
      };

      if (modal === "edit" && editingId) {
        await updateUser(editingId, payload);
        await swalSuccess({ title: "User updated", text: "The user account was updated successfully." });
        showToast("User updated!");
      } else {
        await createUser(payload);
        await swalSuccess({ title: "User created", text: "The user account was created successfully." });
        showToast("User created!");
      }
      setModal(null);
      load();
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && err.response.data && typeof err.response.data === "object" && "message" in err.response.data && typeof err.response.data.message === "string"
        ? err.response.data.message
        : "Operation failed";
      await swalError({ title: "Operation failed", text: message });
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (user: UserRecord) => {
    const confirmed = await swalConfirm({ title: `${user.isActive ? "Deactivate" : "Activate"} this user?`, text: `This will change the account status for ${user.name || "this user"}.` });
    if (!confirmed) return;
    try {
      await updateUserStatus(user.id, !user.isActive);
      await swalSuccess({ title: "Status updated", text: `User ${user.isActive ? "deactivated" : "activated"}.` });
      showToast(`User ${user.isActive ? "deactivated" : "activated"}.`);
      load();
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && err.response.data && typeof err.response.data === "object" && "message" in err.response.data && typeof err.response.data.message === "string"
        ? err.response.data.message
        : "Failed to update status";
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
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && err.response.data && typeof err.response.data === "object" && "message" in err.response.data && typeof err.response.data.message === "string"
        ? err.response.data.message
        : "Failed to delete";
      await swalError({ title: "Delete failed", text: message });
      showToast(message, "error");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage platform user accounts and roles</p>
        </div>
        <button onClick={openCreate} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90">
          + Create User
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative max-w-sm flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">🔍</span>
          <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card pl-9 pr-4 py-2 text-sm text-foreground outline-none transition focus:border-primary" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary">
          <option value="">All Roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="px-5 py-3 text-left font-medium uppercase">User</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Role</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Status</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Joined</th>
              <th className="px-5 py-3 text-right font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 animate-pulse rounded bg-muted/30" /></td>)}</tr>
              ))
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-16 text-center text-muted-foreground">No users found.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/20">
                  <td className="px-5 py-4">
                    <p className="font-medium text-foreground">{u.name || "—"}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-foreground">{u.role}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.isActive ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="space-x-2 px-5 py-4 text-right">
                    {u.role !== "SUPER_ADMIN" && (
                      <>
                        <button onClick={() => openEdit(u)} className="rounded-lg border border-border px-3 py-1 text-xs text-muted-foreground transition hover:text-primary">Edit</button>
                        <button onClick={() => toggleStatus(u)} className="rounded-lg border border-border px-3 py-1 text-xs text-muted-foreground transition hover:text-amber-500">
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="rounded-lg border border-border px-3 py-1 text-xs text-muted-foreground transition hover:text-destructive">Delete</button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="font-bold text-foreground">{modal === "edit" ? "Edit User" : "Create User"}</h3>
              <button onClick={() => setModal(null)} className="text-muted-foreground">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {[
                { label: "Name", key: "name", required: true },
                { label: "Email", key: "email", type: "email", required: true },
                { label: "Phone", key: "phone", required: true },
                ...(modal === "create" ? [{ label: "Password", key: "password", type: "password", required: true }] : []),
              ].map(({ label, key, type, required }) => (
                <div key={key}>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label} *</label>
                  <input
                    required={required}
                    type={type || "text"}
                    value={typeof form[key] === "string" ? form[key] : ""}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
                  />
                </div>
              ))}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Role *</label>
                <select required value={form.role || "STUDENT"} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary">
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {modal === "edit" && (
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                  Active account
                </label>
              )}
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm text-muted-foreground">Cancel</button>
                <button type="submit" disabled={submitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50">
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
