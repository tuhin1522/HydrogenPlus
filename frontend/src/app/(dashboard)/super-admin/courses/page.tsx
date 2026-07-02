"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { swalConfirm, swalError, swalSuccess } from "@/app/lib/swal";
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllClassLevels,
  getAllSubjects,
  getAllTeachers,
  CreateCoursePayload,
} from "@/app/modules/super-admin/services/super-admin.service";

const EMPTY: CreateCoursePayload = { title: "", description: "", classLevelId: "", subjectId: "", teacherId: "", price: 0, status: "DRAFT" };

const COURSE_COLORS = [
  "from-[#22C55E]/20 to-[#16A34A]/5 border-[#22C55E]/20",
  "from-[#3B82F6]/20 to-[#2563EB]/5 border-[#3B82F6]/20",
  "from-[#8B5CF6]/20 to-[#7C3AED]/5 border-[#8B5CF6]/20",
  "from-[#F59E0B]/20 to-[#D97706]/5 border-[#F59E0B]/20",
  "from-[#EF4444]/20 to-[#DC2626]/5 border-[#EF4444]/20",
  "from-[#06B6D4]/20 to-[#0891B2]/5 border-[#06B6D4]/20",
];

const MOCK_ENROLLMENTS = [24, 18, 32, 12, 45, 28, 15, 38, 22, 9, 41, 17];

const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
  PUBLISHED: { bg: "bg-[#22C55E]/10", text: "text-[#22C55E]", border: "border-[#22C55E]/30" },
  DRAFT: { bg: "bg-[#F59E0B]/10", text: "text-[#F59E0B]", border: "border-[#F59E0B]/30" },
  ARCHIVED: { bg: "bg-[#71717A]/10", text: "text-[#71717A]", border: "border-[#71717A]/30" },
};

type CourseItem = {
  id: string;
  title: string;
  description?: string | null;
  classLevelId: string;
  subjectId: string;
  teacherId: string;
  price: number;
  status?: CreateCoursePayload["status"];
  classLevel?: { name?: string };
  subject?: { name?: string };
  teacher?: { user?: { name?: string } };
};

type ClassLevelItem = { id: string; name: string };
type SubjectItem = { id: string; name: string; classLevelId?: string };
type TeacherItem = { id: string; user?: { name?: string } };

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [classLevels, setClassLevels] = useState<ClassLevelItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<CreateCoursePayload>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
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
      const [coursesRes, levelsRes, subjectsRes, teachersRes] = await Promise.all([
        getAllCourses({ search, limit: 100 }),
        getAllClassLevels({ limit: 100 }),
        getAllSubjects({ limit: 100 }),
        getAllTeachers({ limit: 100 }),
      ]);
      setCourses(coursesRes?.data || []);
      setClassLevels(levelsRes?.data || []);
      setSubjects(subjectsRes?.data || []);
      setTeachers(teachersRes?.data || []);
    } catch {
      showToast("Failed to load courses", "error");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const filteredSubjects = subjects.filter(s => !form.classLevelId || s.classLevelId === form.classLevelId);

  const filteredCourses = courses.filter(c => {
    if (filterStatus && c.status !== filterStatus) return false;
    if (filterClass && c.classLevelId !== filterClass) return false;
    return true;
  });

  const openCreate = () => { setForm(EMPTY); setEditingId(null); setModal("create"); };
  const openEdit = (course: CourseItem) => {
    setForm({ title: course.title, description: course.description || "", classLevelId: course.classLevelId, subjectId: course.subjectId, teacherId: course.teacherId, price: course.price, status: course.status });
    setEditingId(course.id);
    setModal("edit");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (modal === "edit" && editingId) {
        await updateCourse(editingId, payload);
        await swalSuccess({ title: "Course updated", text: "The course details were updated successfully." });
        showToast("Course updated!");
      } else {
        await createCourse(payload);
        await swalSuccess({ title: "Course created", text: "The course was created successfully." });
        showToast("Course created!");
      }
      setModal(null);
      load();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Operation failed";
      await swalError({ title: "Operation failed", text: message });
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await swalConfirm({ title: "Delete this course?", text: "This action cannot be undone." });
    if (!confirmed) return;
    try {
      await deleteCourse(id);
      await swalSuccess({ title: "Course deleted", text: "The course was removed successfully." });
      showToast("Course deleted.");
      load();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete";
      await swalError({ title: "Delete failed", text: message });
      showToast(message, "error");
    }
  };

  const handleArchive = async (id: string) => {
    const confirmed = await swalConfirm({ title: "Archive this course?", text: "You can restore it later if needed." });
    if (!confirmed) return;
    try {
      await updateCourse(id, { status: "ARCHIVED" });
      await swalSuccess({ title: "Course archived", text: "The course is now archived." });
      showToast("Course archived.");
      load();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to archive";
      await swalError({ title: "Archive failed", text: message });
      showToast(message, "error");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Course Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage, publish, and track all LMS courses.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
            <button onClick={() => setViewMode("grid")} className={`rounded px-3 py-1.5 text-xs font-medium transition ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              ⊞ Grid
            </button>
            <button onClick={() => setViewMode("table")} className={`rounded px-3 py-1.5 text-xs font-medium transition ${viewMode === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              ☰ Table
            </button>
          </div>
          <button onClick={openCreate} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90">
            + Create Course
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total Courses", value: courses.length, icon: "🎯", color: "text-emerald-600" },
          { label: "Published", value: courses.filter(c => c.status === "PUBLISHED").length, icon: "✅", color: "text-blue-600" },
          { label: "Drafts", value: courses.filter(c => c.status === "DRAFT").length, icon: "📝", color: "text-amber-600" },
          { label: "Archived", value: courses.filter(c => c.status === "ARCHIVED").length, icon: "📦", color: "text-muted-foreground" },
        ].map(s => (
          <div key={s.label} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4">
        <div className="relative min-w-[200px] flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">🔍</span>
          <input type="text" placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary" />
        </div>
        <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary">
          <option value="">All Classes</option>
          {classLevels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary">
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* ===== GRID VIEW ===== */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-border bg-card">
                <div className="h-32 rounded-t-xl bg-muted/40" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-muted/40" />
                  <div className="h-3 w-1/2 rounded bg-muted/40" />
                  <div className="h-3 w-2/3 rounded bg-muted/40" />
                </div>
              </div>
            ))
          ) : filteredCourses.length === 0 ? (
            <div className="col-span-3 flex flex-col items-center py-20">
              <p className="text-5xl mb-4">🎯</p>
              <p className="text-lg text-muted-foreground">No courses found.</p>
            </div>
          ) : (
            filteredCourses.map((c, i) => {
              const enrollments = MOCK_ENROLLMENTS[i % MOCK_ENROLLMENTS.length];
              const colorScheme = COURSE_COLORS[i % COURSE_COLORS.length];
              const statusKey = c.status ?? "DRAFT";
              const sc = statusConfig[statusKey] || statusConfig.DRAFT;
              
              return (
                <div key={c.id} className={`group overflow-hidden rounded-xl border bg-gradient-to-br ${colorScheme} transition-all duration-300 hover:shadow-xl`}>
                  {/* Thumbnail */}
                  <div className="relative flex h-28 items-center justify-center bg-background/30 text-5xl">
                    <span>📖</span>
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${sc.bg} ${sc.text} border ${sc.border}`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-background/50 px-2.5 py-1 backdrop-blur-sm">
                      <span className="text-[10px] font-medium text-white/80">👥 {enrollments} enrolled</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <h3 className="mb-1 text-base font-bold leading-tight text-foreground line-clamp-2">{c.title}</h3>
                    {c.description && <p className="mb-3 text-xs text-muted-foreground line-clamp-2">{c.description}</p>}

                    <div className="mb-4 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Class</span>
                        <span className="font-medium text-foreground">{c.classLevel?.name || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subject</span>
                        <span className="text-foreground">{c.subject?.name || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Teacher</span>
                        <span className="text-foreground">{c.teacher?.user?.name || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-bold text-emerald-600">৳{c.price}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="flex-1 rounded-lg border border-border/60 bg-background/60 px-2 py-1.5 text-xs text-foreground transition hover:bg-emerald-500/20 hover:text-emerald-600">
                        ✏️ Edit
                      </button>
                      <button onClick={() => showToast(`Analytics for "${c.title}" coming soon!`)} className="flex-1 rounded-lg border border-border/60 bg-background/60 px-2 py-1.5 text-xs text-foreground transition hover:bg-blue-500/20 hover:text-blue-600">
                        📈 Stats
                      </button>
                      {c.status !== "ARCHIVED" && (
                        <button onClick={() => handleArchive(c.id)} className="rounded-lg border border-border/60 bg-background/60 px-2.5 py-1.5 text-xs text-foreground transition hover:bg-muted/20 hover:text-muted-foreground" title="Archive">
                          📦
                        </button>
                      )}
                      <button onClick={() => handleDelete(c.id)} className="rounded-lg border border-border/60 bg-background/60 px-2.5 py-1.5 text-xs text-foreground transition hover:bg-destructive/20 hover:text-destructive" title="Delete">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ===== TABLE VIEW ===== */}
      {viewMode === "table" && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-xs text-muted-foreground">
                  <th className="px-5 py-4 text-left font-medium uppercase tracking-wider">Course</th>
                  <th className="px-5 py-4 text-left font-medium uppercase tracking-wider">Class</th>
                  <th className="px-5 py-4 text-left font-medium uppercase tracking-wider">Subject</th>
                  <th className="px-5 py-4 text-left font-medium uppercase tracking-wider">Teacher</th>
                  <th className="px-5 py-4 text-center font-medium uppercase tracking-wider">Enrollments</th>
                  <th className="px-5 py-4 text-center font-medium uppercase tracking-wider">Price</th>
                  <th className="px-5 py-4 text-center font-medium uppercase tracking-wider">Status</th>
                  <th className="px-5 py-4 text-right font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 8 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 animate-pulse rounded bg-muted/40" /></td>)}</tr>
                  ))
                ) : filteredCourses.length === 0 ? (
                  <tr><td colSpan={8} className="px-5 py-16 text-center text-muted-foreground">No courses found.</td></tr>
                ) : (
                  filteredCourses.map((c, i) => {
                    const enrollments = MOCK_ENROLLMENTS[i % MOCK_ENROLLMENTS.length];
                    const statusKey = c.status ?? "DRAFT";
                    const sc = statusConfig[statusKey] || statusConfig.DRAFT;
                    return (
                      <tr key={c.id} className="group transition-colors hover:bg-muted/20">
                        <td className="px-5 py-4">
                          <p className="font-bold text-foreground">{c.title}</p>
                          {c.description && <p className="max-w-[180px] truncate text-xs text-muted-foreground">{c.description}</p>}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">{c.classLevel?.name || "—"}</td>
                        <td className="px-5 py-4 text-muted-foreground">{c.subject?.name || "—"}</td>
                        <td className="px-5 py-4 text-muted-foreground">{c.teacher?.user?.name || "—"}</td>
                        <td className="px-5 py-4 text-center">
                          <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-600">
                            👥 {enrollments}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center font-mono font-bold text-emerald-600">৳{c.price}</td>
                        <td className="px-5 py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${sc.bg} ${sc.text} border ${sc.border}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(c)} className="rounded bg-muted/40 px-2.5 py-1.5 text-xs text-foreground transition hover:bg-primary/10 hover:text-primary" title="Edit">✏️</button>
                            {c.status !== "ARCHIVED" && (
                              <button onClick={() => handleArchive(c.id)} className="rounded bg-muted/40 px-2.5 py-1.5 text-xs text-foreground transition hover:bg-muted/60" title="Archive">📦</button>
                            )}
                            <button onClick={() => handleDelete(c.id)} className="rounded bg-muted/40 px-2.5 py-1.5 text-xs text-foreground transition hover:bg-destructive/10 hover:text-destructive" title="Delete">🗑️</button>
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
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-6 py-4">
              <h3 className="font-bold text-foreground">{modal === "edit" ? "Edit Course" : "Create Course"}</h3>
              <button onClick={() => setModal(null)} className="text-muted-foreground transition hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Title *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Description</label>
                <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Class Level *</label>
                <select required value={form.classLevelId} onChange={(e) => setForm({ ...form, classLevelId: e.target.value, subjectId: "" })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary">
                  <option value="">Select class level</option>
                  {classLevels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Subject *</label>
                <select required value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary">
                  <option value="">Select subject</option>
                  {filteredSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Teacher *</label>
                <select required value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary">
                  <option value="">Select teacher</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.user?.name || t.id}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Price (৳) *</label>
                  <input required type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Status</label>
                  <select value={form.status || "DRAFT"} onChange={(e) => setForm({ ...form, status: e.target.value as CreateCoursePayload["status"] })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary">
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground">Cancel</button>
                <button type="submit" disabled={submitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50">
                  {submitting ? "Saving..." : "Save Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
