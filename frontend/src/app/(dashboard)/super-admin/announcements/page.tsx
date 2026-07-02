"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { swalConfirm, swalError, swalSuccess } from "@/app/lib/swal";
import {
  createNotification,
  deleteNotification,
  getAllNotifications,
  markNotificationRead,
} from "@/app/modules/super-admin/services/super-admin.service";

const ANNOUNCEMENT_TYPES = [
  { value: "ANNOUNCEMENT", label: "Announcement" },
  { value: "REMINDER", label: "Reminder" },
  { value: "MAINTENANCE", label: "Maintenance" },
] as const;

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "ANNOUNCEMENT" as (typeof ANNOUNCEMENT_TYPES)[number]["value"],
    audience: "All users",
  });

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
      const res = await getAllNotifications({ limit: 100 });
      const items = (res?.data || []).filter((item: any) => {
        const type = String(item.type || "").toUpperCase();
        return ["ANNOUNCEMENT", "REMINDER", "MAINTENANCE"].includes(type);
      });
      setAnnouncements(items);
    } catch {
      showToast("Failed to load announcements", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredAnnouncements = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return announcements;

    return announcements.filter((item) => {
      const haystack = `${item.title || ""} ${item.message || ""}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [announcements, search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createNotification({
        title: form.title,
        message: form.message,
        type: form.type,
      });

      await swalSuccess({ title: "Announcement posted", text: "The announcement is now visible to platform users." });
      showToast("Announcement posted");
      setModal(false);
      setForm({ title: "", message: "", type: "ANNOUNCEMENT", audience: "All users" });
      void load();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to post announcement";
      await swalError({ title: "Announcement failed", text: message });
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      void load();
    } catch {
      showToast("Failed to update announcement", "error");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await swalConfirm({ title: "Delete this announcement?", text: "This action cannot be undone." });
    if (!confirmed) return;

    try {
      await deleteNotification(id);
      await swalSuccess({ title: "Announcement deleted", text: "The announcement was removed successfully." });
      showToast("Announcement deleted");
      void load();
    } catch {
      showToast("Failed to delete announcement", "error");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
          <p className="mt-1 text-sm text-muted-foreground">Share updates, reminders, and maintenance notices across the platform.</p>
        </div>
        <button
          type="button"
          onClick={() => setModal(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          + New Announcement
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">🔍</span>
          <input
            type="text"
            placeholder="Search announcements"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground outline-none transition focus:border-primary"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-border bg-card p-5 animate-pulse">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
              <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
            </div>
          ))
        ) : filteredAnnouncements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            No announcements yet. Create the first one to keep your team informed.
          </div>
        ) : (
          filteredAnnouncements.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/30">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                      {item.type || "ANNOUNCEMENT"}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.audience || "All users"}</span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-foreground">{item.title}</h2>
                  <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{item.message}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>{new Date(item.createdAt || Date.now()).toLocaleString()}</p>
                  <div className="mt-3 flex gap-2">
                    {!item.isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(item.id)}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-secondary"
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="rounded-lg border border-destructive/20 px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {modal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="text-lg font-semibold text-foreground">Create announcement</h3>
              <button type="button" onClick={() => setModal(false)} className="text-sm text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((value) => ({ ...value, title: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
                  placeholder="Platform update"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((value) => ({ ...value, message: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
                  placeholder="Share the update with all staff and students"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((value) => ({ ...value, type: e.target.value as (typeof ANNOUNCEMENT_TYPES)[number]["value"] }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
                  >
                    {ANNOUNCEMENT_TYPES.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Audience</label>
                  <input
                    value={form.audience}
                    onChange={(e) => setForm((value) => ({ ...value, audience: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
                    placeholder="All users"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
                  {submitting ? "Posting..." : "Post announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
