"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAllExams, // Assume these exist in your service, otherwise they'll be mocked
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

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [classLevels, setClassLevels] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: "", type: "MCQ", date: "", duration: 60, totalMarks: 100, classLevelId: "", subjectId: "" });
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [levelsRes, subjectsRes] = await Promise.all([
        getAllClassLevels({ limit: 100 }),
        getAllSubjects({ limit: 100 }),
      ]);
      setClassLevels(levelsRes?.data || []);
      setSubjects(subjectsRes?.data || []);
      // MOCK EXAM DATA
      setExams(MOCK_EXAMS);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Exam created successfully!");
    setModal(false);
    // Add to mock state
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
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this exam?")) return;
    setExams(exams.filter(e => e.id !== id));
    showToast("Exam deleted.");
  };

  const filteredExams = exams.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-6">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg border text-sm font-medium shadow-lg ${toast.type === "success" ? "bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]" : "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F2F2]">Exam Management</h1>
          <p className="text-sm text-[#71717A] mt-1">Create, monitor, and grade centralized examinations.</p>
        </div>
        <button onClick={() => setModal(true)} className="px-4 py-2 bg-[#22C55E] text-[#052E16] text-sm font-bold rounded-lg hover:bg-[#16A34A] transition">
          + Create Exam
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Exams", value: exams.length, color: "text-[#3B82F6]" },
          { label: "Upcoming", value: exams.filter(e => e.status === "UPCOMING").length, color: "text-[#F59E0B]" },
          { label: "Completed", value: exams.filter(e => e.status === "COMPLETED").length, color: "text-[#22C55E]" },
          { label: "Avg. Score", value: "78%", color: "text-[#8B5CF6]" },
        ].map((s, i) => (
          <div key={i} className="bg-[#111010] border border-[#1C1917] rounded-xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform duration-500" />
            <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-2">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-[#71717A]">🔍</span>
          <input type="text" placeholder="Search exams..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111010] border border-[#1C1917] rounded-lg pl-9 pr-4 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]" />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2.5 bg-[#111010] border border-[#1C1917] text-[#A1A1AA] text-sm font-medium rounded-lg hover:text-[#F2F2F2]">Question Bank</button>
          <button className="px-4 py-2.5 bg-[#111010] border border-[#1C1917] text-[#A1A1AA] text-sm font-medium rounded-lg hover:text-[#F2F2F2]">Results</button>
        </div>
      </div>

      <div className="rounded-xl border border-[#1C1917] bg-[#111010] overflow-hidden shadow-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1C1917] bg-[#080706]">
              <th className="px-5 py-4 text-left font-semibold text-[#71717A] uppercase text-xs">Exam Details</th>
              <th className="px-5 py-4 text-left font-semibold text-[#71717A] uppercase text-xs">Type & Duration</th>
              <th className="px-5 py-4 text-left font-semibold text-[#71717A] uppercase text-xs">Date</th>
              <th className="px-5 py-4 text-center font-semibold text-[#71717A] uppercase text-xs">Participants</th>
              <th className="px-5 py-4 text-center font-semibold text-[#71717A] uppercase text-xs">Status</th>
              <th className="px-5 py-4 text-right font-semibold text-[#71717A] uppercase text-xs">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1917]">
            {filteredExams.map((e) => (
              <tr key={e.id} className="hover:bg-[#1C1917]/30 transition group">
                <td className="px-5 py-4">
                  <p className="font-bold text-[#F2F2F2]">{e.title}</p>
                  <p className="text-xs text-[#71717A]">{e.classLevel?.name} • {e.subject?.name}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#1C1917] text-[#A1A1AA] mb-1">{e.type}</span>
                  <p className="text-xs text-[#71717A]">{e.duration} mins • {e.totalMarks} Marks</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-[#F2F2F2]">{new Date(e.date).toLocaleDateString()}</p>
                  <p className="text-xs text-[#71717A]">{new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </td>
                <td className="px-5 py-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-[#3B82F6]">{e.enrolled}</span>
                    {e.avgScore && <span className="text-[10px] text-[#22C55E]">Avg: {e.avgScore}/{e.totalMarks}</span>}
                  </div>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider
                    ${e.status === 'COMPLETED' ? 'bg-[#22C55E]/10 text-[#22C55E]' : e.status === 'UPCOMING' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'bg-[#71717A]/10 text-[#71717A]'}`}>
                    {e.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right space-x-1 opacity-0 group-hover:opacity-100 transition">
                  <button className="px-2.5 py-1.5 text-xs bg-[#1C1917] text-[#F2F2F2] rounded hover:bg-[#3B82F6] hover:text-white transition">Questions</button>
                  <button className="px-2.5 py-1.5 text-xs bg-[#1C1917] text-[#F2F2F2] rounded hover:bg-[#22C55E] hover:text-[#052E16] transition">✏️</button>
                  <button onClick={() => handleDelete(e.id)} className="px-2.5 py-1.5 text-xs bg-[#1C1917] text-[#F2F2F2] rounded hover:bg-[#EF4444] transition">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111010] border border-[#1C1917] w-full max-w-lg rounded-2xl shadow-2xl p-6">
            <h3 className="font-bold text-xl text-[#F2F2F2] mb-6">Create New Exam</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Exam Title *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Class Level *</label>
                  <select required value={form.classLevelId} onChange={(e) => setForm({ ...form, classLevelId: e.target.value })}
                    className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
                    <option value="">Select</option>
                    {classLevels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Subject *</label>
                  <select required value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                    className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
                    <option value="">Select</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Exam Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
                    <option value="MCQ">MCQ</option>
                    <option value="WRITTEN">WRITTEN</option>
                    <option value="PRACTICAL">PRACTICAL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Date & Time *</label>
                  <input required type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Duration (Mins)</label>
                  <input required type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
                    className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Total Marks</label>
                  <input required type="number" value={form.totalMarks} onChange={(e) => setForm({ ...form, totalMarks: parseInt(e.target.value) })}
                    className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm text-[#71717A] hover:text-[#F2F2F2]">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#22C55E] text-[#052E16] text-sm font-bold rounded-lg hover:bg-[#16A34A] transition">
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
