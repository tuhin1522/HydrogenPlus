"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { swalConfirm, swalError, swalSuccess } from "@/app/lib/swal";
import {
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  createUser,
  createTeacher,
  getAllBranches,
  getAllBatchSubjects,
} from "@/app/modules/super-admin/services/super-admin.service";

const RATINGS = ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐", "⭐"];

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [batchSubjects, setBatchSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [modal, setModal] = useState<"edit" | "details" | "create" | null>(null);
  const [form, setForm] = useState<any>({});
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
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
      const [tRes, bRes, bsRes] = await Promise.all([
        getAllTeachers({ search, limit: 100 }),
        getAllBranches({ limit: 100 }),
        getAllBatchSubjects({ limit: 500 }),
      ]);
      setTeachers(tRes?.data || []);
      setBranches(bRes?.data || []);
      setBatchSubjects(bsRes?.data || []);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const openDetails = async (id: string) => {
    try {
      const res = await getTeacherById(id);
      setSelectedTeacher(res.data);
      setModal("details");
    } catch {
      showToast("Failed to fetch details", "error");
    }
  };

  const openEdit = (teacher: any) => {
    setForm({
      id: teacher.id,
      branchId: teacher.branchId || "",
      qualification: teacher.qualification || "",
      experience: teacher.experience || "",
      specialization: teacher.specialization || "",
      bio: teacher.bio || "",
    });
    setModal("edit");
  };

  const openCreate = () => {
    setForm({ name: "", email: "", phone: "", password: "", branchId: "", qualification: "", experience: "", specialization: "", bio: "" });
    setModal("create");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modal === "create") {
        const userRes = await createUser({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: "TEACHER" });
        await createTeacher({
          userId: userRes.data.id,
          branchId: form.branchId,
          qualification: form.qualification || null,
          experience: form.experience ? Number(form.experience) : null,
          specialization: form.specialization || null,
          bio: form.bio || null,
        });
        await swalSuccess({ title: "Teacher created", text: "The teacher account was created successfully." });
        showToast("Teacher created!");
      } else {
        await updateTeacher(form.id, {
          branchId: form.branchId,
          qualification: form.qualification || null,
          experience: form.experience ? Number(form.experience) : null,
          specialization: form.specialization || null,
          bio: form.bio || null,
        });
        await swalSuccess({ title: "Teacher updated", text: "The teacher profile was updated successfully." });
        showToast("Teacher profile updated!");
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
    const confirmed = await swalConfirm({ title: "Delete this teacher profile?", text: "This action cannot be undone." });
    if (!confirmed) return;
    try {
      await deleteTeacher(id);
      await swalSuccess({ title: "Teacher deleted", text: "The teacher profile was removed successfully." });
      showToast("Teacher deleted.");
      load();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to delete";
      await swalError({ title: "Delete failed", text: message });
      showToast(message, "error");
    }
  };

  const handleDeactivate = async (teacher: any) => {
    const confirmed = await swalConfirm({ title: "Deactivate teacher?", text: `${teacher.user?.name || "This teacher"} will be marked inactive.` });
    if (!confirmed) return;
    await swalSuccess({ title: "Teacher deactivated", text: `${teacher.user?.name || "Teacher"} was marked inactive.` });
    showToast(`${teacher.user?.name} has been deactivated (mock action).`, "success");
  };

  // Count classes assigned per teacher
  const getClassesAssigned = (teacherId: string) =>
    batchSubjects.filter(bs => bs.teacherId === teacherId).length;

  // Get subject names for a teacher
  const getSubjectNames = (teacherId: string) => {
    const subjects = batchSubjects
      .filter(bs => bs.teacherId === teacherId)
      .map(bs => bs.subject?.name)
      .filter(Boolean);
    return subjects.filter((value, index, self) => self.indexOf(value) === index);
  };

  const filteredTeachers = teachers.filter(t => {
    if (filterBranch && t.branchId !== filterBranch) return false;
    if (filterStatus && (t.user?.isActive ? "ACTIVE" : "INACTIVE") !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teacher Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage teaching staff, subjects, and course assignments.</p>
        </div>
        <button onClick={openCreate} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90">
          + Add Teacher
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total Teachers", value: teachers.length, icon: "👩‍🏫", color: "text-primary" },
          { label: "Active", value: teachers.filter(t => t.user?.isActive !== false).length, icon: "✅", color: "text-blue-600" },
          { label: "Branches Covered", value: branches.length, icon: "🏢", color: "text-violet-600" },
          { label: "Subjects Assigned", value: new Set(batchSubjects.map(bs => bs.subjectId)).size, icon: "📚", color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <p className="mb-1 text-2xl">{s.icon}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4">
        <div className="relative min-w-[200px] flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary"
          />
        </div>
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
                <th className="px-5 py-4 text-left font-medium uppercase tracking-wider">Teacher</th>
                <th className="px-5 py-4 text-left font-medium uppercase tracking-wider">Subjects</th>
                <th className="px-5 py-4 text-left font-medium uppercase tracking-wider">Branch</th>
                <th className="px-5 py-4 text-center font-medium uppercase tracking-wider">Classes Assigned</th>
                <th className="px-5 py-4 text-center font-medium uppercase tracking-wider">Rating</th>
                <th className="px-5 py-4 text-center font-medium uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 text-right font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-5 py-5"><div className="h-4 animate-pulse rounded bg-muted/30" /></td>)}</tr>
                ))
              ) : filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <p className="mb-3 text-4xl">👩‍🏫</p>
                    <p className="text-muted-foreground">No teachers found.</p>
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((t) => {
                  const subjects = getSubjectNames(t.id);
                  const classesCount = getClassesAssigned(t.id);
                  const rating = RATINGS[t.user?.name?.length % 5] || "⭐⭐⭐⭐";
                  const isActive = t.user?.isActive !== false;

                  return (
                    <tr key={t.id} className="group transition-colors hover:bg-muted/20">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-sm font-bold text-violet-600 shadow-inner">
                            {t.user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{t.user?.name || "N/A"}</p>
                            <p className="text-xs text-muted-foreground">{t.user?.email}</p>
                            {t.qualification && <p className="text-xs text-muted-foreground">{t.qualification}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {subjects.length > 0 ? subjects.slice(0, 2).map(s => (
                            <span key={s} className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                              {s}
                            </span>
                          )) : <span className="text-xs text-muted-foreground">—</span>}
                          {subjects.length > 2 && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">+{subjects.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-foreground">{t.branch?.name || "—"}</p>
                        {t.experience != null && <p className="text-xs text-muted-foreground">{t.experience} yrs exp</p>}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm font-bold text-blue-600">
                          {classesCount}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-sm" title={`${5 - RATINGS.indexOf(rating)} stars`}>{rating}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider ${isActive ? "border border-primary/30 bg-primary/10 text-primary" : "border border-destructive/30 bg-destructive/10 text-destructive"}`}>
                          {isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                          <button onClick={() => openDetails(t.id)} className="rounded bg-muted px-2.5 py-1.5 text-xs text-foreground transition hover:bg-primary hover:text-primary-foreground" title="View">👁️</button>
                          <button onClick={() => openEdit(t)} className="rounded bg-muted px-2.5 py-1.5 text-xs text-foreground transition hover:bg-primary hover:text-primary-foreground" title="Edit">✏️</button>
                          <button onClick={() => handleDeactivate(t)} className="rounded bg-muted px-2.5 py-1.5 text-xs text-foreground transition hover:bg-amber-500 hover:text-white" title="Deactivate">🔒</button>
                          <button onClick={() => handleDelete(t.id)} className="rounded bg-muted px-2.5 py-1.5 text-xs text-foreground transition hover:bg-destructive hover:text-white" title="Delete">🗑️</button>
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

      {modal === "details" && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <button onClick={() => setModal(null)} className="absolute right-4 top-4 text-muted-foreground transition hover:text-foreground">✕</button>
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 text-2xl font-bold text-violet-600">
                {selectedTeacher.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{selectedTeacher.user?.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedTeacher.branch?.name}</p>
                {selectedTeacher.specialization && <p className="mt-0.5 text-xs text-violet-600">{selectedTeacher.specialization}</p>}
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-background p-4">
                <div><span className="mb-1 block text-xs text-muted-foreground">Email</span><span className="text-foreground">{selectedTeacher.user?.email}</span></div>
                <div><span className="mb-1 block text-xs text-muted-foreground">Phone</span><span className="text-foreground">{selectedTeacher.user?.phone}</span></div>
                <div><span className="mb-1 block text-xs text-muted-foreground">Qualification</span><span className="text-foreground">{selectedTeacher.qualification || "N/A"}</span></div>
                <div><span className="mb-1 block text-xs text-muted-foreground">Experience</span><span className="text-foreground">{selectedTeacher.experience != null ? `${selectedTeacher.experience} years` : "N/A"}</span></div>
              </div>
              {selectedTeacher.bio && (
                <div className="rounded-lg border border-border bg-background p-4">
                  <span className="mb-1 block text-xs text-muted-foreground">Bio</span>
                  <p className="text-foreground">{selectedTeacher.bio}</p>
                </div>
              )}
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
              <h3 className="font-bold text-foreground">{modal === "create" ? "Add Teacher" : "Edit Teacher Profile"}</h3>
              <button onClick={() => setModal(null)} className="text-muted-foreground transition hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {modal === "create" && (
                <>
                  {[
                    { label: "Full Name", key: "name", required: true },
                    { label: "Email", key: "email", type: "email", required: true },
                    { label: "Phone", key: "phone", required: true },
                    { label: "Password", key: "password", type: "password", required: true },
                  ].map(({ label, key, type, required }) => (
                    <div key={key}>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label} {required && "*"}</label>
                      <input required={required} type={type || "text"} value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary" />
                    </div>
                  ))}
                </>
              )}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Branch *</label>
                <select required value={form.branchId || ""} onChange={(e) => setForm({ ...form, branchId: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary">
                  <option value="">Select branch</option>
                  {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              {[
                { label: "Qualification", key: "qualification" },
                { label: "Experience (years)", key: "experience", type: "number" },
                { label: "Specialization", key: "specialization" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
                  <input type={type || "text"} value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary" />
                </div>
              ))}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bio</label>
                <textarea value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary" rows={3} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground">Cancel</button>
                <button type="submit" disabled={submitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50">
                  {submitting ? "Saving..." : modal === "create" ? "Create Teacher" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
