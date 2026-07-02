"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { swalConfirm, swalError, swalSuccess } from "@/app/lib/swal";
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
      await swalSuccess({ title: "Setting saved", text: "The configuration was saved successfully." });
      showToast("Setting saved!");
      setModal(false);
      load();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to save";
      await swalError({ title: "Save failed", text: message });
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (key: string) => {
    const confirmed = await swalConfirm({ title: `Delete setting "${key}"?`, text: "This action cannot be undone." });
    if (!confirmed) return;
    try {
      await deleteSetting(key);
      await swalSuccess({ title: "Setting deleted", text: "The setting was removed successfully." });
      showToast("Setting deleted.");
      load();
    } catch {
      await swalError({ title: "Delete failed", text: "Failed to delete this setting." });
      showToast("Failed to delete", "error");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Configure platform-wide settings</p>
        </div>
        <button onClick={() => openEdit()} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90">
          + Add Setting
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="px-5 py-3 text-left font-medium uppercase">Key</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Value</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Description</th>
              <th className="px-5 py-3 text-right font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 4 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 animate-pulse rounded bg-muted/40" /></td>)}</tr>
              ))
            ) : settings.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-16 text-center text-muted-foreground">No settings configured yet.</td></tr>
            ) : (
              settings.map((s) => (
                <tr key={s.id} className="hover:bg-muted/20">
                  <td className="px-5 py-4 font-mono text-emerald-600">{s.key}</td>
                  <td className="max-w-xs truncate px-5 py-4 text-foreground">{s.value}</td>
                  <td className="px-5 py-4 text-muted-foreground">{s.description || "—"}</td>
                  <td className="space-x-2 px-5 py-4 text-right">
                    <button onClick={() => openEdit(s)} className="rounded-lg border border-border px-3 py-1 text-xs text-muted-foreground transition hover:text-primary">Edit</button>
                    <button onClick={() => handleDelete(s.key)} className="rounded-lg border border-border px-3 py-1 text-xs text-muted-foreground transition hover:text-destructive">Delete</button>
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
              <h3 className="font-bold text-foreground">Save Setting</h3>
              <button onClick={() => setModal(false)} className="text-muted-foreground">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Key *</label>
                <input required value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary font-mono" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Value *</label>
                <input required value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm text-muted-foreground">Cancel</button>
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
