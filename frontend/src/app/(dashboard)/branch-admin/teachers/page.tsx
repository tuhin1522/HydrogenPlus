"use client";

import { useState, useEffect, useCallback } from "react";
import branchAdminApi from "../api";

type Teacher = {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  user?: { name?: string; email?: string };
  batchSubjects?: { subject?: { name?: string }; batch?: { name?: string } }[];
};

function getName(t: Teacher) {
  if (t.user?.name) return t.user.name;
  return [t.firstName, t.lastName].filter(Boolean).join(" ") || "—";
}

const TABS = ["All Teachers", "Assign Subjects", "Performance"];

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("All Teachers");
  const [search, setSearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ userId: "", firstName: "", lastName: "", phone: "" });

  const loadTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await branchAdminApi.getAllTeachers();
      setTeachers(res.data?.teachers || res.data?.data || res.data || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load teachers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTeachers(); }, [loadTeachers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await branchAdminApi.createTeacher(form);
      setAddModalOpen(false);
      setForm({ userId: "", firstName: "", lastName: "", phone: "" });
      await loadTeachers();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to add teacher.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this teacher? This cannot be undone.")) return;
    try {
      await branchAdminApi.deleteTeacher(id);
      await loadTeachers();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to delete.");
    }
  };

  const filtered = teachers.filter((t) => {
    const name = getName(t).toLowerCase();
    const email = (t.user?.email || "").toLowerCase();
    return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
  });

  const getSubjects = (t: Teacher) => {
    const names = (t.batchSubjects || []).map((bs) => bs.subject?.name).filter(Boolean);
    return Array.from(new Set(names)) as string[];
  };

  const getBatches = (t: Teacher) => {
    const names = (t.batchSubjects || []).map((bs) => bs.batch?.name).filter(Boolean);
    return Array.from(new Set(names)) as string[];
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teachers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage teachers, subjects and performance</p>
        </div>
        <button onClick={() => setAddModalOpen(true)} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition">
          + Add Teacher
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition ${activeTab === tab ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {tab}
          </button>
        ))}
      </div>

      {error && <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm">{error}</div>}

      {activeTab === "All Teachers" && (
        <>
          <div className="bg-card border border-border rounded-xl p-4 flex gap-3">
            <input type="text" placeholder="Search teachers..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 max-w-sm bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
            <button onClick={loadTeachers} className="px-3 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-secondary transition">↻</button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((teacher) => {
                const name = getName(teacher);
                const subjects = getSubjects(teacher);
                const batches = getBatches(teacher);
                return (
                  <div key={teacher.id} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/40 transition">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{name}</h3>
                        <p className="text-xs text-muted-foreground truncate">{teacher.user?.email || teacher.phone || "—"}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      {subjects.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {subjects.map((s) => <span key={s} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{s}</span>)}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {batches.length > 0 ? `Batches: ${batches.join(", ")}` : "No batches assigned"}
                      </p>
                    </div>
                    <div className="mt-4 flex gap-2 pt-4 border-t border-border">
                      <button className="flex-1 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary transition">Profile</button>
                      <button onClick={() => handleDelete(teacher.id)} className="flex-1 py-1.5 text-xs border border-destructive/30 rounded-lg text-destructive/70 hover:text-destructive hover:border-destructive transition">Remove</button>
                    </div>
                  </div>
                );
              })}
              {!loading && filtered.length === 0 && (
                <div className="col-span-3 py-16 text-center text-muted-foreground">No teachers found.</div>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === "Assign Subjects" && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <p className="text-sm text-muted-foreground">Assign subjects and batches to teachers from this panel.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-muted-foreground uppercase">Select Teacher</label>
              <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                <option value="">Select teacher...</option>
                {teachers.map((t) => <option key={t.id} value={t.id}>{getName(t)}</option>)}
              </select>
              <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition">Save Assignment</button>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Current Assignments</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {teachers.flatMap((t) => getSubjects(t).map((sub) => (
                  <div key={`${t.id}-${sub}`} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">{getName(t)}</p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                  </div>
                )))}
                {teachers.every((t) => getSubjects(t).length === 0) && (
                  <p className="text-sm text-muted-foreground">No assignments yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Performance" && (
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />)
          ) : teachers.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">No teachers found.</p>
          ) : (
            teachers.map((teacher) => {
              const name = getName(teacher);
              const subjects = getSubjects(teacher);
              const batches = getBatches(teacher);
              return (
                <div key={teacher.id} className="bg-card border border-border rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{name}</p>
                      <p className="text-xs text-muted-foreground">{subjects.join(", ") || "No subjects assigned"}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-lg font-bold text-foreground">{batches.length}</p>
                      <p className="text-xs text-muted-foreground">Batches</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-lg font-bold text-foreground">{subjects.length}</p>
                      <p className="text-xs text-muted-foreground">Subjects</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Add Teacher Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-card">
              <h2 className="text-lg font-bold text-foreground">Add New Teacher</h2>
              <button onClick={() => setAddModalOpen(false)} className="text-muted-foreground hover:text-foreground text-xl">✕</button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleCreate}>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">User ID (existing account) *</label>
                <input required type="text" placeholder="User UUID" value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">First Name *</label>
                  <input required type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Last Name *</label>
                  <input required type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setAddModalOpen(false)} className="px-4 py-2 text-sm text-muted-foreground">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50">
                  {submitting ? "Adding..." : "Add Teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
