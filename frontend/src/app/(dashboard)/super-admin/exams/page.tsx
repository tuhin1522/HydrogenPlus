"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { swalConfirm, swalError, swalSuccess } from "@/app/lib/swal";
import {
  getAllExams,
  createExam,
  deleteExam,
  getAllClassLevels,
  getAllSubjects,
} from "@/app/modules/super-admin/services/super-admin.service";

// Mocks for missing backend endpoints
const MOCK_EXAMS = [
  { id: "e1", title: "Mid Term - Physics", type: "WRITTEN", date: "2026-07-15T10:00:00Z", duration: 120, totalMarks: 100, status: "UPCOMING", classLevel: { name: "Class 9" }, subject: { name: "Physics" }, enrolled: 145 },
  { id: "e2", title: "Weekly MCQ - Chemistry", type: "MCQ", date: "2026-07-01T15:00:00Z", duration: 45, totalMarks: 50, status: "COMPLETED", classLevel: { name: "Class 10" }, subject: { name: "Chemistry" }, enrolled: 210, avgScore: 38 },
  { id: "e3", title: "Final - Higher Math", type: "PRACTICAL", date: "2026-08-20T09:00:00Z", duration: 180, totalMarks: 100, status: "DRAFT", classLevel: { name: "Class 11" }, subject: { name: "Higher Math" }, enrolled: 0 },
];

type ExamItem = {
  id: string;
  title: string;
  type: string;
  date: string;
  duration: number;
  totalMarks: number;
  status: string;
  classLevel?: { name?: string };
  subject?: { name?: string };
  enrolled: number;
  avgScore?: number;
};

type ClassLevelItem = { id: string; name: string };
type SubjectItem = { id: string; name: string };

export default function ExamsPage() {
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [classLevels, setClassLevels] = useState<ClassLevelItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: "", type: "MCQ", date: "", duration: 60, totalMarks: 100, classLevelId: "", subjectId: "" });

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    if (type === "error") {
      toast.error(msg);
    } else {
      toast.success(msg);
    }
  };

  const load = useCallback(async () => {
    try {
      const [examsRes, levelsRes, subjectsRes] = await Promise.all([
        getAllExams({ limit: 100 }),
        getAllClassLevels({ limit: 100 }),
        getAllSubjects({ limit: 100 }),
      ]);
      setClassLevels(levelsRes?.data || []);
      setSubjects(subjectsRes?.data || []);
      setExams(examsRes?.data?.length ? examsRes.data : MOCK_EXAMS);
    } catch {
      setExams(MOCK_EXAMS);
      showToast("Failed to load data", "error");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createExam({
        title: form.title,
        type: form.type,
        date: new Date(form.date).toISOString(),
        duration: form.duration,
        totalMarks: form.totalMarks,
        classLevelId: form.classLevelId,
        subjectId: form.subjectId,
      });
      await swalSuccess({ title: "Exam created", text: "The exam was created successfully." });
      showToast("Exam created successfully!");
      setModal(false);
      setExams([{
        id: Math.random().toString(),
        title: form.title,
        type: form.type,
        date: new Date(form.date).toISOString(),
        duration: form.duration,
        totalMarks: form.totalMarks,
        status: "UPCOMING",
        classLevel: classLevels.find(c => c.id === form.classLevelId) || { name: "Unknown" },
        subject: subjects.find(s => s.id === form.subjectId) || { name: "Unknown" },
        enrolled: 0
      }, ...exams]);
    } catch {
      await swalError({ title: "Could not create exam", text: "Please try again." });
      showToast("Could not create exam", "error");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await swalConfirm({ title: "Delete this exam?", text: "This action cannot be undone." });
    if (!confirmed) return;
    try {
      await deleteExam(id);
      setExams(exams.filter(e => e.id !== id));
      await swalSuccess({ title: "Exam deleted", text: "The exam was removed successfully." });
      showToast("Exam deleted.");
    } catch {
      await swalError({ title: "Delete failed", text: "Please try again." });
      showToast("Delete failed", "error");
    }
  };

  const filteredExams = exams.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Exam Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create, monitor, and grade centralized examinations.</p>
        </div>
        <button onClick={() => setModal(true)} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90">
          + Create Exam
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { label: "Total Exams", value: exams.length, color: "text-blue-600" },
          { label: "Upcoming", value: exams.filter(e => e.status === "UPCOMING").length, color: "text-amber-600" },
          { label: "Completed", value: exams.filter(e => e.status === "COMPLETED").length, color: "text-emerald-600" },
          { label: "Avg. Score", value: "78%", color: "text-violet-600" },
        ].map((s, i) => (
          <div key={i} className="group relative overflow-hidden rounded-xl border border-border bg-card p-5">
            <div className="absolute -mr-4 -mt-4 h-24 w-24 rounded-bl-full bg-gradient-to-br from-muted/20 to-transparent opacity-50 transition-transform duration-500 group-hover:scale-110" />
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">🔍</span>
          <input type="text" placeholder="Search exams..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary" />
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground">Question Bank</button>
          <button className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground">Results</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/20 text-xs text-muted-foreground">
              <th className="px-5 py-4 text-left font-semibold uppercase tracking-wider">Exam Details</th>
              <th className="px-5 py-4 text-left font-semibold uppercase tracking-wider">Type & Duration</th>
              <th className="px-5 py-4 text-left font-semibold uppercase tracking-wider">Date</th>
              <th className="px-5 py-4 text-center font-semibold uppercase tracking-wider">Participants</th>
              <th className="px-5 py-4 text-center font-semibold uppercase tracking-wider">Status</th>
              <th className="px-5 py-4 text-right font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredExams.map((e) => (
              <tr key={e.id} className="group transition hover:bg-muted/20">
                <td className="px-5 py-4">
                  <p className="font-bold text-foreground">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.classLevel?.name} • {e.subject?.name}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="mb-1 inline-block rounded bg-muted/40 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">{e.type}</span>
                  <p className="text-xs text-muted-foreground">{e.duration} mins • {e.totalMarks} Marks</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-foreground">{new Date(e.date).toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">{new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </td>
                <td className="px-5 py-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-blue-600">{e.enrolled}</span>
                    {e.avgScore && <span className="text-[10px] text-emerald-600">Avg: {e.avgScore}/{e.totalMarks}</span>}
                  </div>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider ${e.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600' : e.status === 'UPCOMING' ? 'bg-amber-500/10 text-amber-600' : 'bg-muted/50 text-muted-foreground'}`}>
                    {e.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right space-x-1 opacity-0 transition group-hover:opacity-100">
                  <button className="rounded bg-muted/40 px-2.5 py-1.5 text-xs text-foreground transition hover:bg-primary/10 hover:text-primary">Questions</button>
                  <button className="rounded bg-muted/40 px-2.5 py-1.5 text-xs text-foreground transition hover:bg-primary/10 hover:text-primary">✏️</button>
                  <button onClick={() => handleDelete(e.id)} className="rounded bg-muted/40 px-2.5 py-1.5 text-xs text-foreground transition hover:bg-destructive/10 hover:text-destructive">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h3 className="mb-6 text-xl font-bold text-foreground">Create New Exam</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Exam Title *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Class Level *</label>
                  <select required value={form.classLevelId} onChange={(e) => setForm({ ...form, classLevelId: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary">
                    <option value="">Select</option>
                    {classLevels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Subject *</label>
                  <select required value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary">
                    <option value="">Select</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Exam Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary">
                    <option value="MCQ">MCQ</option>
                    <option value="WRITTEN">WRITTEN</option>
                    <option value="PRACTICAL">PRACTICAL</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Date & Time *</label>
                  <input required type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Duration (Mins)</label>
                  <input required type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Total Marks</label>
                  <input required type="number" value={form.totalMarks} onChange={(e) => setForm({ ...form, totalMarks: parseInt(e.target.value) })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90">
                  Create Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
