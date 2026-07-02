"use client";

import { useState, useEffect, useCallback } from "react";
import branchAdminApi from "../api";

type Student = {
  id: string;
  studentId?: string;
  firstName?: string;
  lastName?: string;
  user?: { name?: string; email?: string };
  classLevel?: { name?: string };
  batch?: { name?: string };
  guardianName?: string;
  phone?: string;
  status?: string;
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-500/10 text-green-500",
  INACTIVE: "bg-yellow-500/10 text-yellow-500",
  SUSPENDED: "bg-red-500/10 text-red-500",
};

function getName(s: Student) {
  if (s.user?.name) return s.user.name;
  return [s.firstName, s.lastName].filter(Boolean).join(" ") || "—";
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Form state for admitting a student
  const [form, setForm] = useState({
    userId: "", firstName: "", lastName: "", classLevelId: "",
  });
  const [classLevels, setClassLevels] = useState<any[]>([]);

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await branchAdminApi.getAllStudents();
      setStudents(res.data?.students || res.data?.data || res.data || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load students.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
    branchAdminApi.getAllClassLevels().then((r) => {
      setClassLevels(r.data?.classLevels || r.data?.data || r.data || []);
    }).catch(() => {});
  }, [loadStudents]);

  const handleAdmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await branchAdminApi.createStudent(form);
      setAddModalOpen(false);
      setForm({ userId: "", firstName: "", lastName: "", classLevelId: "" });
      await loadStudents();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to admit student.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this student? This cannot be undone.")) return;
    try {
      await branchAdminApi.deleteStudent(id);
      await loadStudents();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to delete.");
    }
  };

  const handleExportCsv = () => {
    const rows = [
      ["Name", "Student ID", "Class", "Batch", "Guardian", "Phone", "Status"],
      ...students.map((s) => [
        getName(s),
        s.studentId || "—",
        s.classLevel?.name || "—",
        s.batch?.name || "—",
        s.guardianName || "—",
        s.phone || "—",
        s.status || "—",
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
  };

  const filtered = students.filter((s) => {
    const name = getName(s).toLowerCase();
    const id = (s.studentId || "").toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) || id.includes(search.toLowerCase());
    const matchStatus = statusFilter ? s.status === statusFilter : true;
    const matchClass = classFilter ? s.classLevel?.name === classFilter : true;
    return matchSearch && matchStatus && matchClass;
  });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const uniqueClasses = Array.from(new Set(students.map((s) => s.classLevel?.name).filter(Boolean)));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all enrolled students</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="border border-border px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary transition"
          >
            Export CSV
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition"
          >
            + Admit Student
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 min-w-[200px] bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        />
        <select
          value={classFilter}
          onChange={(e) => { setClassFilter(e.target.value); setPage(1); }}
          className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        >
          <option value="">All Classes</option>
          {uniqueClasses.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        >
          <option value="">All Status</option>
          <option>ACTIVE</option>
          <option>INACTIVE</option>
          <option>SUSPENDED</option>
        </select>
        <button onClick={loadStudents} className="px-3 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-secondary transition">↻ Refresh</button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[900px]">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">Photo</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Student ID</th>
                <th className="px-4 py-3 font-medium">Class</th>
                <th className="px-4 py-3 font-medium">Batch</th>
                <th className="px-4 py-3 font-medium">Guardian</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={9} className="px-4 py-3">
                      <div className="h-5 bg-muted rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-muted-foreground">
                    {search || statusFilter || classFilter ? "No students match your filters." : "No students found."}
                  </td>
                </tr>
              ) : (
                paginated.map((student) => {
                  const name = getName(student);
                  const status = student.status || "ACTIVE";
                  return (
                    <tr key={student.id} className="hover:bg-muted/30 transition">
                      <td className="px-4 py-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                          {name.charAt(0).toUpperCase()}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">{name}</td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{student.studentId || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{student.classLevel?.name || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{student.batch?.name || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{student.guardianName || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{student.phone || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status] || STATUS_COLORS.ACTIVE}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setSelectedStudent(student); setViewModalOpen(true); }}
                            className="px-2 py-1 text-xs rounded border border-border text-muted-foreground hover:text-primary hover:border-primary transition"
                          >
                            View
                          </button>
                          <button className="px-2 py-1 text-xs rounded border border-border text-muted-foreground hover:text-primary hover:border-primary transition">
                            Edit
                          </button>
                          <button className="px-2 py-1 text-xs rounded border border-border text-muted-foreground hover:text-yellow-500 hover:border-yellow-500 transition">
                            Promote
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="px-2 py-1 text-xs rounded border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length} students
          </span>
          <div className="flex gap-1">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border border-border rounded hover:bg-muted disabled:opacity-40 transition">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded border transition ${page === p ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>{p}</button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border border-border rounded hover:bg-muted disabled:opacity-40 transition">Next</button>
          </div>
        </div>
      </div>

      {/* Admit Student Modal */}
      {addModalOpen && (
        <Modal title="Admit New Student" onClose={() => setAddModalOpen(false)}>
          <form className="space-y-4" onSubmit={handleAdmit}>
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
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Class Level *</label>
              <select required value={form.classLevelId} onChange={(e) => setForm({ ...form, classLevelId: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                <option value="">Select class...</option>
                {classLevels.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setAddModalOpen(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50">
                {submitting ? "Admitting..." : "Admit Student"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Student Modal */}
      {viewModalOpen && selectedStudent && (
        <Modal title="Student Details" onClose={() => setViewModalOpen(false)}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                {getName(selectedStudent).charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">{getName(selectedStudent)}</h3>
                <p className="text-sm text-muted-foreground font-mono">{selectedStudent.studentId || "—"}</p>
                <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[selectedStudent.status || "ACTIVE"] || STATUS_COLORS.ACTIVE}`}>
                  {selectedStudent.status || "ACTIVE"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Class", selectedStudent.classLevel?.name],
                ["Batch", selectedStudent.batch?.name],
                ["Guardian", selectedStudent.guardianName],
                ["Phone", selectedStudent.phone],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">{label}</p>
                  <p className="text-foreground font-medium mt-0.5">{value || "—"}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => handleDelete(selectedStudent.id)}
                className="px-3 py-1.5 border border-destructive/30 rounded-lg text-sm text-destructive hover:border-destructive transition"
              >
                Delete
              </button>
              <button className="px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition">
                Edit Profile
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
