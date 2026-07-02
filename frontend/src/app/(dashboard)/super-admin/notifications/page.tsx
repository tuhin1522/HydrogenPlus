"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { swalConfirm, swalError, swalSuccess } from "@/app/lib/swal";
import {
  getAllNotifications,
  createNotification,
  markNotificationRead,
  deleteNotification,
} from "@/app/modules/super-admin/services/super-admin.service";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", type: "INFO", userId: "" });
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
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await getAllNotifications({ search, limit: 100 });
      setNotifications(res?.data || []);
    } catch (error: any) {
      if (error?.response?.status !== 401 && error?.response?.status !== 403) {
        showToast("Failed to load notifications", "error");
      }
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createNotification({
        title: form.title,
        message: form.message,
        type: form.type,
        ...(form.userId ? { userId: form.userId } : {}),
      });
      await swalSuccess({ title: "Notification sent", text: "The notification was created successfully." });
      showToast("Notification created!");
      setModal(false);
      setForm({ title: "", message: "", type: "INFO", userId: "" });
      load();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to create";
      await swalError({ title: "Notification failed", text: message });
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      load();
    } catch {
      await swalError({ title: "Could not update", text: "Failed to mark as read." });
      showToast("Failed to mark as read", "error");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await swalConfirm({ title: "Delete this notification?", text: "This action cannot be undone." });
    if (!confirmed) return;
    try {
      await deleteNotification(id);
      await swalSuccess({ title: "Notification deleted", text: "The notification was removed successfully." });
      showToast("Notification deleted.");
      load();
    } catch {
      await swalError({ title: "Delete failed", text: "Failed to delete this notification." });
      showToast("Failed to delete", "error");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">Send and manage platform notifications</p>
        </div>
        <button onClick={() => setModal(true)} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90">
          + Send Notification
        </button>
      </div>

      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Search notifications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground outline-none transition focus:border-primary"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="px-5 py-3 text-left font-medium uppercase">Title</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Type</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Status</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Date</th>
              <th className="px-5 py-3 text-right font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 animate-pulse rounded bg-muted/40" /></td>)}</tr>
              ))
            ) : notifications.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-16 text-center text-muted-foreground">No notifications found.</td></tr>
            ) : (
              notifications.map((n) => (
                <tr key={n.id} className="hover:bg-muted/20">
                  <td className="px-5 py-4">
                    <p className="font-medium text-foreground">{n.title}</p>
                    <p className="max-w-xs truncate text-xs text-muted-foreground">{n.message}</p>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{n.type}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${n.isRead ? "bg-muted/60 text-muted-foreground" : "bg-blue-500/10 text-blue-600"}`}>
                      {n.isRead ? "Read" : "Unread"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{new Date(n.createdAt).toLocaleDateString()}</td>
                  <td className="space-x-2 px-5 py-4 text-right">
                    {!n.isRead && (
                      <button onClick={() => handleMarkRead(n.id)} className="rounded-lg border border-border px-3 py-1 text-xs text-muted-foreground transition hover:text-primary">Mark Read</button>
                    )}
                    <button onClick={() => handleDelete(n.id)} className="rounded-lg border border-border px-3 py-1 text-xs text-muted-foreground transition hover:text-destructive">Delete</button>
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
              <h3 className="font-bold text-foreground">Send Notification</h3>
              <button onClick={() => setModal(false)} className="text-muted-foreground">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message *</label>
                <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary">
                  <option value="INFO">INFO</option>
                  <option value="WARNING">WARNING</option>
                  <option value="SUCCESS">SUCCESS</option>
                  <option value="ERROR">ERROR</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">User ID (optional, blank = broadcast)</label>
                <input value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm text-muted-foreground">Cancel</button>
                <button type="submit" disabled={submitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50">
                  {submitting ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
