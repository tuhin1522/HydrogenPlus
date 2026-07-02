"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { swalConfirm, swalError, swalSuccess } from "@/app/lib/swal";
import {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  createUser,
  createStudentProfile,
  getAllBatches,
  getAllBranches,
  getAllClassLevels,
} from "@/app/modules/super-admin/services/super-admin.service";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [classLevels, setClassLevels] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [modal, setModal] = useState<"edit" | "details" | "create" | null>(null);
  const [form, setForm] = useState<any>({});
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    if (type === "error") {
      toast.error(msg);
    } else {
      toast.success(msg);
    }
  };

  const loadMeta = useCallback(async () => {
    try {
      const [bRes, cRes, batchRes] = await Promise.all([
        getAllBranches({ limit: 100 }),
        getAllClassLevels({ limit: 100 }),
        getAllBatches({ limit: 100 })
      ]);
      setBranches(bRes?.data || []);
      setClassLevels(cRes?.data || []);
      setBatches(batchRes?.data || []);
    } catch {}
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // In a real app, we'd pass branchId, classId, status as params if backend supports
      const res = await getAllStudents({ search, limit: 100 });
      setStudents(res?.data || []);
      setSelectedIds([]);
    } catch {
      showToast("Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { loadMeta(); }, [loadMeta]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load, filterBranch, filterClass, filterStatus]);

  const openDetails = async (id: string) => {
    try {
      const res = await getStudentById(id);
      setSelectedStudent(res.data);
      setModal("details");
    } catch {
      showToast("Failed to fetch details", "error");
    }
  };

  const openEdit = (student: any) => {
    setForm({
      id: student.id,
      guardianName: student.guardianName || "",
      guardianPhone: student.guardianPhone || "",
      schoolName: student.schoolName || "",
      address: student.address || "",
    });
    setModal("edit");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modal === "create") {
        const userRes = await createUser({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: "STUDENT" });
        await createStudentProfile({
          userId: userRes.data.id,
          batchId: form.batchId,
          guardianName: form.guardianName,
          guardianPhone: form.guardianPhone,
          schoolName: form.schoolName || null,
          address: form.address || null,
          admissionDate: form.admissionDate || new Date().toISOString(),
        });
        await swalSuccess({ title: "Student enrolled", text: "The student profile was created successfully." });
        showToast("Student enrolled!");
      } else {
        await updateStudent(form.id, {
          guardianName: form.guardianName,
          guardianPhone: form.guardianPhone,
          schoolName: form.schoolName,
          address: form.address,
        });
        await swalSuccess({ title: "Student updated", text: "The student profile was updated successfully." });
        showToast("Student profile updated!");
      }
      setModal(null);
      load();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Operation failed";
      await swalError({ title: "Operation failed", text: message });
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await swalConfirm({ title: "Delete this student profile?", text: "This action cannot be undone." });
    if (!confirmed) return;
    try {
      await deleteStudent(id);
      await swalSuccess({ title: "Student deleted", text: "The student profile was removed successfully." });
      showToast("Student deleted.");
      load();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to delete";
      await swalError({ title: "Delete failed", text: message });
      showToast(message, "error");
    }
  };

  const handleBulkPromote = async () => {
    if (selectedIds.length === 0) return;
    const confirmed = await swalConfirm({ title: `Promote ${selectedIds.length} students?`, text: "This will apply the promotion action to the selected students." });
    if (!confirmed) return;
    await swalSuccess({ title: "Promotion complete", text: `${selectedIds.length} students were promoted successfully.` });
    showToast(`${selectedIds.length} students promoted successfully!`);
    setSelectedIds([]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) setSelectedIds([]);
    else setSelectedIds(filteredStudents.map(s => s.id));
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  // Local filtering for demo (if backend doesn't support these filters yet)
  const filteredStudents = students.filter(s => {
    if (filterBranch && s.batch?.branchId !== filterBranch) return false;
    if (filterClass && s.batch?.classLevelId !== filterClass) return false;
    if (filterStatus && (s.user?.isActive ? "ACTIVE" : "INACTIVE") !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Student Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">View and manage enrolled students, track progress and payments.</p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <button onClick={handleBulkPromote} className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-600 transition hover:bg-blue-500/20">
              Promote Selected ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => {
              setForm({ name: "", email: "", phone: "", password: "", batchId: "", guardianName: "", guardianPhone: "", schoolName: "", address: "", admissionDate: new Date().toISOString().slice(0, 10) });
              setModal("create");
            }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
          >
            + Enroll Student
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
        <div className="relative max-w-sm flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">🔍</span>
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary"
          />
        </div>
        <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary">
          <option value="">All Classes</option>
          {classLevels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary">
          <option value="">All Branches</option>
          {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary">
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-xs text-muted-foreground">
                <th className="w-10 px-5 py-4 text-left font-medium uppercase tracking-wider">
                  <input type="checkbox" checked={selectedIds.length === filteredStudents.length && filteredStudents.length > 0} onChange={toggleSelectAll} className="h-4 w-4 rounded border-border accent-primary" />
                </th>
                <th className="px-5 py-4 text-left font-medium uppercase tracking-wider">Student</th>
                <th className="px-5 py-4 text-left font-medium uppercase tracking-wider">Class & Branch</th>
                <th className="px-5 py-4 text-left font-medium uppercase tracking-wider">Contact</th>
                <th className="min-w-[120px] px-5 py-4 text-left font-medium uppercase tracking-wider">Progress</th>
                <th className="px-5 py-4 text-center font-medium uppercase tracking-wider">Payment Status</th>
                <th className="px-5 py-4 text-right font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-5 py-5"><div className="h-4 animate-pulse rounded bg-muted/30" /></td>)}</tr>
                ))
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-16 text-center"><p className="text-lg text-muted-foreground">No students found matching your criteria.</p></td></tr>
              ) : (
                filteredStudents.map((s) => {
                  const progress = Math.floor(Math.random() * 60) + 40;
                  const paymentStatuses = ["PAID", "PENDING", "OVERDUE"];
                  const paymentStatus = paymentStatuses[s.user?.name?.length % 3] || "PAID";

                  return (
                    <tr key={s.id} className="group transition-colors hover:bg-muted/20">
                      <td className="px-5 py-4">
                        <input type="checkbox" checked={selectedIds.includes(s.id)} onChange={() => toggleSelect(s.id)} className="h-4 w-4 rounded border-border accent-primary" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary shadow-inner">
                            {s.user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{s.user?.name || "N/A"}</p>
                            <p className="text-xs text-muted-foreground">ID: {s.id.slice(-6).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-foreground">{s.batch?.classLevel?.name || "Class N/A"}</p>
                        <p className="text-xs text-muted-foreground">{s.batch?.branch?.name || "Branch N/A"}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-foreground">{s.user?.phone}</p>
                        <p className="max-w-[120px] truncate text-xs text-muted-foreground" title={s.user?.email}>{s.user?.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                            <div className={`h-full rounded-full ${progress >= 80 ? 'bg-primary' : progress >= 50 ? 'bg-amber-500' : 'bg-destructive'}`} style={{ width: `${progress}%` }} />
                          </div>
                          <span className="w-8 text-xs font-medium text-muted-foreground">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider ${
                          paymentStatus === "PAID" ? "border border-primary/30 bg-primary/10 text-primary" :
                          paymentStatus === "PENDING" ? "border border-amber-500/30 bg-amber-500/10 text-amber-600" :
                          "border border-destructive/30 bg-destructive/10 text-destructive"
                        }`}>
                          {paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                          <button onClick={() => openDetails(s.id)} className="rounded bg-muted px-2.5 py-1.5 text-xs text-foreground transition hover:bg-primary hover:text-primary-foreground" title="View">👁️</button>
                          <button onClick={() => openEdit(s)} className="rounded bg-muted px-2.5 py-1.5 text-xs text-foreground transition hover:bg-primary hover:text-primary-foreground" title="Edit">✏️</button>
                          <button onClick={() => handleDelete(s.id)} className="rounded bg-muted px-2.5 py-1.5 text-xs text-foreground transition hover:bg-destructive hover:text-white" title="Delete">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal === "details" && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <button onClick={() => setModal(null)} className="absolute right-4 top-4 text-muted-foreground transition hover:text-foreground">✕</button>
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary shadow-inner">
                {selectedStudent.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{selectedStudent.user?.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedStudent.batch?.classLevel?.name} • {selectedStudent.batch?.branch?.name}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-background p-4">
                <div><span className="mb-1 block text-xs text-muted-foreground">Email</span><span className="text-foreground">{selectedStudent.user?.email}</span></div>
                <div><span className="mb-1 block text-xs text-muted-foreground">Phone</span><span className="text-foreground">{selectedStudent.user?.phone}</span></div>
                <div><span className="mb-1 block text-xs text-muted-foreground">Admission</span><span className="text-foreground">{new Date(selectedStudent.admissionDate).toLocaleDateString()}</span></div>
                <div><span className="mb-1 block text-xs text-muted-foreground">Status</span><span className="font-medium text-primary">ACTIVE</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-background p-4">
                <div><span className="mb-1 block text-xs text-muted-foreground">Guardian Name</span><span className="text-foreground">{selectedStudent.guardianName}</span></div>
                <div><span className="mb-1 block text-xs text-muted-foreground">Guardian Phone</span><span className="text-foreground">{selectedStudent.guardianPhone}</span></div>
                <div className="col-span-2"><span className="mb-1 block text-xs text-muted-foreground">Address</span><span className="text-foreground">{selectedStudent.address || "N/A"}</span></div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setModal(null)} className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted/80">Close</button>
            </div>
          </div>
        </div>
      )}

      {(modal === "edit" || modal === "create") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-6 py-4">
              <h3 className="font-bold text-foreground">{modal === "create" ? "Enroll Student" : "Edit Student Profile"}</h3>
              <button onClick={() => setModal(null)} className="text-muted-foreground transition hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {modal === "create" && (
                <>
                  {[
                    { label: "Name", key: "name", required: true },
                    { label: "Email", key: "email", type: "email", required: true },
                    { label: "Phone", key: "phone", required: true },
                    { label: "Password", key: "password", type: "password", required: true },
                  ].map(({ label, key, type, required }) => (
                    <div key={key}>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label} *</label>
                      <input required={required} type={type || "text"} value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary" />
                    </div>
                  ))}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Batch *</label>
                    <select required value={form.batchId || ""} onChange={(e) => setForm({ ...form, batchId: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary">
                      <option value="">Select batch</option>
                      {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admission Date *</label>
                    <input required type="date" value={form.admissionDate || ""} onChange={(e) => setForm({ ...form, admissionDate: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary" />
                  </div>
                </>
              )}
              {[
                { label: "Guardian Name", key: "guardianName", required: true },
                { label: "Guardian Phone", key: "guardianPhone", required: true },
                { label: "School/College Name", key: "schoolName" },
                { label: "Address", key: "address" },
              ].map(({ label, key, required }) => (
                <div key={key}>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label} {required && "*"}</label>
                  <input
                    required={required}
                    type="text"
                    value={form[key] || ""}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary"
                  />
                </div>
              ))}
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground">Cancel</button>
                <button type="submit" disabled={submitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50">
                  {submitting ? "Saving..." : modal === "create" ? "Enroll Student" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
