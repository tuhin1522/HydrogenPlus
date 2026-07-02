"use client";

import { useState } from "react";

type Announcement = {
  id: string;
  title: string;
  body: string;
  target: "ENTIRE_BRANCH" | "BATCH";
  targetName?: string;
  createdAt: string;
  status: "PUBLISHED" | "DRAFT";
};

const MOCK: Announcement[] = [
  { id: "1", title: "New Schedule Released", body: "The updated weekly schedule for all batches has been uploaded. Students should check their batch timetable immediately.", target: "ENTIRE_BRANCH", createdAt: "2025-07-01", status: "PUBLISHED" },
  { id: "2", title: "Morning Batch A — Exam Postponed", body: "The mid-term exam for Morning Batch A has been postponed to August 15th due to unavoidable circumstances.", target: "BATCH", targetName: "Morning Batch A", createdAt: "2025-07-02", status: "PUBLISHED" },
  { id: "3", title: "Eid Holiday Notice", body: "The institute will remain closed from July 7–10 for the Eid-ul-Adha holidays.", target: "ENTIRE_BRANCH", createdAt: "2025-07-03", status: "DRAFT" },
];

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK);
  const [createModal, setCreateModal] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", target: "ENTIRE_BRANCH", targetName: "" });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: Announcement = {
      id: String(announcements.length + 1),
      title: form.title,
      body: form.body,
      target: form.target as "ENTIRE_BRANCH" | "BATCH",
      targetName: form.target === "BATCH" ? form.targetName : undefined,
      createdAt: new Date().toISOString().split("T")[0],
      status: "PUBLISHED",
    };
    setAnnouncements([newItem, ...announcements]);
    setForm({ title: "", body: "", target: "ENTIRE_BRANCH", targetName: "" });
    setCreateModal(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
          <p className="text-sm text-muted-foreground mt-1">Post announcements to your branch or specific batches</p>
        </div>
        <button
          onClick={() => setCreateModal(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition"
        >
          + New Announcement
        </button>
      </div>

      {/* Announcement Cards */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/20 transition">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-foreground">{ann.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ann.status === "PUBLISHED" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                    {ann.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{ann.body}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">{ann.createdAt}</p>
                <div className="mt-2 flex gap-2 justify-end">
                  <button className="text-xs text-primary hover:underline">Edit</button>
                  <button className="text-xs text-destructive hover:underline">Delete</button>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="px-2 py-0.5 rounded-full border border-border">
                {ann.target === "ENTIRE_BRANCH" ? "📢 Entire Branch" : `👥 ${ann.targetName}`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {createModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-card">
              <h2 className="text-lg font-bold text-foreground">Create Announcement</h2>
              <button onClick={() => setCreateModal(false)} className="text-muted-foreground hover:text-foreground text-xl">✕</button>
            </div>
            <form className="p-6 space-y-5" onSubmit={handleCreate}>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Title *</label>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  placeholder="Announcement title"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Target Audience *</label>
                <select
                  value={form.target}
                  onChange={(e) => setForm({ ...form, target: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value="ENTIRE_BRANCH">Entire Branch</option>
                  <option value="BATCH">Specific Batch</option>
                </select>
              </div>
              {form.target === "BATCH" && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Select Batch *</label>
                  <select
                    required
                    value={form.targetName}
                    onChange={(e) => setForm({ ...form, targetName: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  >
                    <option value="">Select...</option>
                    <option>Morning Batch A</option>
                    <option>Evening Batch B</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Message *</label>
                <textarea
                  required
                  rows={6}
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary resize-none"
                  placeholder="Write your announcement..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setCreateModal(false)} className="px-4 py-2 text-sm text-muted-foreground">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
