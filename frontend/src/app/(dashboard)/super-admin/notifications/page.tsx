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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F2F2]">Notifications</h1>
          <p className="text-sm text-[#71717A] mt-1">Send and manage platform notifications</p>
        </div>
        <button onClick={() => setModal(true)} className="px-4 py-2 bg-[#22C55E] text-[#052E16] text-sm font-bold rounded-lg hover:bg-[#16A34A] transition">
          + Send Notification
        </button>
      </div>

      <div className="relative max-w-sm">
        <input type="text" placeholder="Search notifications..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111010] border border-[#1C1917] rounded-lg px-4 py-2 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]" />
      </div>

      <div className="rounded-xl border border-[#1C1917] bg-[#111010] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1C1917] text-[#71717A] text-xs">
              <th className="px-5 py-3 text-left font-medium uppercase">Title</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Type</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Status</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Date</th>
              <th className="px-5 py-3 text-right font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1917]">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-[#1C1917] rounded animate-pulse" /></td>)}</tr>
              ))
            ) : notifications.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-16 text-center text-[#71717A]">No notifications found.</td></tr>
            ) : (
              notifications.map((n) => (
                <tr key={n.id} className="hover:bg-[#1C1917]/20">
                  <td className="px-5 py-4">
                    <p className="font-medium text-[#F2F2F2]">{n.title}</p>
                    <p className="text-xs text-[#71717A] truncate max-w-xs">{n.message}</p>
                  </td>
                  <td className="px-5 py-4 text-[#A1A1AA]">{n.type}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${n.isRead ? "bg-[#71717A]/10 text-[#71717A]" : "bg-[#3B82F6]/10 text-[#3B82F6]"}`}>
                      {n.isRead ? "Read" : "Unread"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#71717A]">{new Date(n.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-right space-x-2">
                    {!n.isRead && (
                      <button onClick={() => handleMarkRead(n.id)} className="px-3 py-1 text-xs border border-[#27272A] text-[#A1A1AA] rounded-lg hover:text-[#3B82F6]">Mark Read</button>
                    )}
                    <button onClick={() => handleDelete(n.id)} className="px-3 py-1 text-xs border border-[#27272A] text-[#A1A1AA] rounded-lg hover:text-[#EF4444]">Delete</button>
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
              <h3 className="font-bold text-[#F2F2F2]">Send Notification</h3>
              <button onClick={() => setModal(false)} className="text-[#71717A]">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Title *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Message *</label>
                <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3}
                  className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
                  <option value="INFO">INFO</option>
                  <option value="WARNING">WARNING</option>
                  <option value="SUCCESS">SUCCESS</option>
                  <option value="ERROR">ERROR</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">User ID (optional, blank = broadcast)</label>
                <input value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm text-[#71717A]">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#22C55E] text-[#052E16] text-sm font-bold rounded-lg disabled:opacity-50">
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
