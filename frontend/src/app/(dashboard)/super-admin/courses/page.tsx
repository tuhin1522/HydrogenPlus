"use client";

import { useEffect, useState, useCallback } from "react";
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

const EMPTY: CreateCoursePayload = {
  title: "",
  description: "",
  classLevelId: "",
  subjectId: "",
  teacherId: "",
  price: 0,
  status: "DRAFT",
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [classLevels, setClassLevels] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<CreateCoursePayload>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
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

  const filteredSubjects = subjects.filter(
    (s) => !form.classLevelId || s.classLevelId === form.classLevelId
  );

  const openCreate = () => {
    setForm(EMPTY);
    setEditingId(null);
    setModal("create");
  };

  const openEdit = (course: any) => {
    setForm({
      title: course.title,
      description: course.description || "",
      classLevelId: course.classLevelId,
      subjectId: course.subjectId,
      teacherId: course.teacherId,
      price: course.price,
      status: course.status,
    });
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
        showToast("Course updated!");
      } else {
        await createCourse(payload);
        showToast("Course created!");
      }
      setModal(null);
      load();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Operation failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    try {
      await deleteCourse(id);
      showToast("Course deleted.");
      load();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to delete", "error");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg border text-sm font-medium shadow-lg ${toast.type === "success" ? "bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]" : "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F2F2]">Course Management</h1>
          <p className="text-sm text-[#71717A] mt-1">Manage platform courses and pricing</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-[#22C55E] text-[#052E16] text-sm font-bold rounded-lg hover:bg-[#16A34A] transition">
          + Create Course
        </button>
      </div>

      <div className="relative max-w-sm">
        <span className="absolute inset-y-0 left-3 flex items-center text-[#71717A] text-sm">🔍</span>
        <input type="text" placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111010] border border-[#1C1917] rounded-lg pl-9 pr-4 py-2 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]" />
      </div>

      <div className="rounded-xl border border-[#1C1917] bg-[#111010] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1C1917] text-[#71717A] text-xs">
              <th className="px-5 py-3 text-left font-medium uppercase">Title</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Class</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Subject</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Price</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Status</th>
              <th className="px-5 py-3 text-right font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1917]">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-[#1C1917] rounded animate-pulse" /></td>)}</tr>
              ))
            ) : courses.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-16 text-center text-[#71717A]">No courses found.</td></tr>
            ) : (
              courses.map((c) => (
                <tr key={c.id} className="hover:bg-[#1C1917]/20">
                  <td className="px-5 py-4 font-medium text-[#F2F2F2]">{c.title}</td>
                  <td className="px-5 py-4 text-[#A1A1AA]">{c.classLevel?.name || "—"}</td>
                  <td className="px-5 py-4 text-[#A1A1AA]">{c.subject?.name || "—"}</td>
                  <td className="px-5 py-4 text-[#22C55E]">৳{c.price}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === "PUBLISHED" ? "bg-[#22C55E]/10 text-[#22C55E]" : c.status === "ARCHIVED" ? "bg-[#71717A]/10 text-[#71717A]" : "bg-[#F59E0B]/10 text-[#F59E0B]"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => openEdit(c)} className="px-3 py-1 text-xs border border-[#27272A] text-[#A1A1AA] rounded-lg hover:border-[#22C55E]/40 hover:text-[#22C55E] mr-2">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="px-3 py-1 text-xs border border-[#27272A] text-[#A1A1AA] rounded-lg hover:border-[#EF4444]/40 hover:text-[#EF4444]">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111010] border border-[#1C1917] w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-[#1C1917] flex justify-between items-center sticky top-0 bg-[#111010]">
              <h3 className="font-bold text-[#F2F2F2]">{modal === "edit" ? "Edit Course" : "Create Course"}</h3>
              <button onClick={() => setModal(null)} className="text-[#71717A] hover:text-[#F2F2F2]">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Title *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Description</label>
                <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Class Level *</label>
                <select required value={form.classLevelId} onChange={(e) => setForm({ ...form, classLevelId: e.target.value, subjectId: "" })}
                  className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
                  <option value="">Select class level</option>
                  {classLevels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Subject *</label>
                <select required value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                  className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
                  <option value="">Select subject</option>
                  {filteredSubjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Teacher *</label>
                <select required value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                  className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
                  <option value="">Select teacher</option>
                  {teachers.map((t) => <option key={t.id} value={t.id}>{t.user?.name || t.id}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Price *</label>
                  <input required type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Status</label>
                  <select value={form.status || "DRAFT"} onChange={(e) => setForm({ ...form, status: e.target.value as CreateCoursePayload["status"] })}
                    className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm text-[#71717A]">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#22C55E] text-[#052E16] text-sm font-bold rounded-lg disabled:opacity-50">
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
