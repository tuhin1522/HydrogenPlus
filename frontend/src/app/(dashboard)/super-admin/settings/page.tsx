"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAllSettings,
  upsertSetting,
  deleteSetting,
} from "@/app/modules/super-admin/services/super-admin.service";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ key: "", value: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllSettings();
      setSettings(res?.data || []);
    } catch {
      showToast("Failed to load settings", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openEdit = (setting?: any) => {
    setForm(setting ? { key: setting.key, value: setting.value, description: setting.description || "" } : { key: "", value: "", description: "" });
    setModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await upsertSetting(form);
      showToast("Setting saved!");
      setModal(false);
      load();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to save", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Delete setting "${key}"?`)) return;
    try {
      await deleteSetting(key);
      showToast("Setting deleted.");
      load();
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg border text-sm font-medium shadow-lg ${toast.type === "success" ? "bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]" : "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F2F2]">System Settings</h1>
          <p className="text-sm text-[#71717A] mt-1">Configure platform-wide settings</p>
        </div>
        <button onClick={() => openEdit()} className="px-4 py-2 bg-[#22C55E] text-[#052E16] text-sm font-bold rounded-lg hover:bg-[#16A34A] transition">
          + Add Setting
        </button>
      </div>

      <div className="rounded-xl border border-[#1C1917] bg-[#111010] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1C1917] text-[#71717A] text-xs">
              <th className="px-5 py-3 text-left font-medium uppercase">Key</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Value</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Description</th>
              <th className="px-5 py-3 text-right font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1917]">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 4 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-[#1C1917] rounded animate-pulse" /></td>)}</tr>
              ))
            ) : settings.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-16 text-center text-[#71717A]">No settings configured yet.</td></tr>
            ) : (
              settings.map((s) => (
                <tr key={s.id} className="hover:bg-[#1C1917]/20">
                  <td className="px-5 py-4 font-mono text-[#22C55E]">{s.key}</td>
                  <td className="px-5 py-4 text-[#F2F2F2] max-w-xs truncate">{s.value}</td>
                  <td className="px-5 py-4 text-[#71717A]">{s.description || "—"}</td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button onClick={() => openEdit(s)} className="px-3 py-1 text-xs border border-[#27272A] text-[#A1A1AA] rounded-lg hover:text-[#22C55E]">Edit</button>
                    <button onClick={() => handleDelete(s.key)} className="px-3 py-1 text-xs border border-[#27272A] text-[#A1A1AA] rounded-lg hover:text-[#EF4444]">Delete</button>
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
              <h3 className="font-bold text-[#F2F2F2]">Save Setting</h3>
              <button onClick={() => setModal(false)} className="text-[#71717A]">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Key *</label>
                <input required value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })}
                  className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] font-mono outline-none focus:border-[#22C55E]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Value *</label>
                <input required value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })}
                  className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Description</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm text-[#71717A]">Cancel</button>
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
