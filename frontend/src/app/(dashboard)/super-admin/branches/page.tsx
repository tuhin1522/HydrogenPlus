"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  CreateBranchPayload,
} from "@/app/modules/super-admin/services/super-admin.service";

const EMPTY_FORM: CreateBranchPayload = {
  name: "",
  managerName: "",
  address: "",
  phone: "",
  email: "",
  status: "ACTIVE",
};

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<CreateBranchPayload>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllBranches({ search, limit: 100 });
      setBranches(res?.data || []);
    } catch {
      showToast("Failed to load branches", "error");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setModal("create");
  };

  const openEdit = (branch: any) => {
    setForm({
      name: branch.name,
      managerName: branch.managerName,
      address: branch.address,
      phone: branch.phone,
      email: branch.email || "",
      status: branch.status,
    });
    setEditingId(branch.id);
    setModal("edit");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modal === "edit" && editingId) {
        await updateBranch(editingId, form);
        showToast("Branch updated successfully!");
      } else {
        await createBranch(form);
        showToast("Branch created successfully!");
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
    if (!confirm("Are you sure you want to delete this branch? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteBranch(id);
      showToast("Branch deleted.");
      load();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to delete", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg border text-sm font-medium shadow-lg ${
            toast.type === "success"
              ? "bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]"
              : "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F2F2]">Branch Management</h1>
          <p className="text-sm text-[#71717A] mt-1">Manage all coaching center branches</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-[#22C55E] text-[#052E16] text-sm font-bold rounded-lg hover:bg-[#16A34A] transition"
        >
          + Create Branch
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <span className="absolute inset-y-0 left-3 flex items-center text-[#71717A] text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search branches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111010] border border-[#1C1917] rounded-lg pl-9 pr-4 py-2 text-sm text-[#F2F2F2] placeholder-[#71717A] outline-none focus:border-[#22C55E] transition"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#1C1917] bg-[#111010] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1C1917] text-[#71717A] text-xs">
              <th className="px-5 py-3 text-left font-medium uppercase tracking-wider">Branch Name</th>
              <th className="px-5 py-3 text-left font-medium uppercase tracking-wider">Manager</th>
              <th className="px-5 py-3 text-left font-medium uppercase tracking-wider">Address</th>
              <th className="px-5 py-3 text-left font-medium uppercase tracking-wider">Phone</th>
              <th className="px-5 py-3 text-left font-medium uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-right font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1917]">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-[#1C1917] rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : branches.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <p className="text-4xl mb-3">🏢</p>
                  <p className="text-[#71717A]">No branches found. Create your first branch.</p>
                </td>
              </tr>
            ) : (
              branches.map((b) => (
                <tr key={b.id} className="hover:bg-[#1C1917]/20 transition-colors">
                  <td className="px-5 py-4 font-medium text-[#F2F2F2]">{b.name}</td>
                  <td className="px-5 py-4 text-[#A1A1AA]">{b.managerName}</td>
                  <td className="px-5 py-4 text-[#A1A1AA] max-w-[200px] truncate">{b.address}</td>
                  <td className="px-5 py-4 text-[#A1A1AA]">{b.phone}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        b.status === "ACTIVE"
                          ? "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20"
                          : "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(b)}
                        className="px-3 py-1 text-xs border border-[#27272A] text-[#A1A1AA] rounded-lg hover:border-[#22C55E]/40 hover:text-[#22C55E] transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        disabled={deletingId === b.id}
                        className="px-3 py-1 text-xs border border-[#27272A] text-[#A1A1AA] rounded-lg hover:border-[#EF4444]/40 hover:text-[#EF4444] transition disabled:opacity-50"
                      >
                        {deletingId === b.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111010] border border-[#1C1917] w-full max-w-lg rounded-2xl shadow-2xl">
            <div className="px-6 py-4 border-b border-[#1C1917] flex justify-between items-center">
              <h3 className="font-bold text-[#F2F2F2]">
                {modal === "edit" ? "Edit Branch" : "Create New Branch"}
              </h3>
              <button onClick={() => setModal(null)} className="text-[#71717A] hover:text-[#F2F2F2] transition">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { label: "Branch Name *", key: "name", placeholder: "e.g. Dhaka Central", required: true },
                { label: "Manager Name *", key: "managerName", placeholder: "Manager's full name", required: true },
                { label: "Address *", key: "address", placeholder: "Full address", required: true },
                { label: "Phone *", key: "phone", placeholder: "e.g. 01700000000", required: true },
                { label: "Email", key: "email", placeholder: "branch@example.com" },
              ].map(({ label, key, placeholder, required }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1.5">
                    {label}
                  </label>
                  <input
                    required={required}
                    type={key === "email" ? "email" : "text"}
                    value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] placeholder-[#71717A] outline-none focus:border-[#22C55E] transition"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E] transition"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm text-[#71717A] hover:text-[#F2F2F2] transition">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#22C55E] text-[#052E16] text-sm font-bold rounded-lg hover:bg-[#16A34A] transition disabled:opacity-50"
                >
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
