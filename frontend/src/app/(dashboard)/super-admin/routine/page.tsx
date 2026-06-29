"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { swalConfirm, swalError, swalSuccess } from "@/app/lib/swal";
import {
  getAllBatchSubjects,
  getAllBranches,
  getAllBatches,
  getAllTeachers,
  getAllRoutines,
  createRoutine,
  deleteRoutine,
} from "@/app/modules/super-admin/services/super-admin.service";

const DAYS = ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
const HOURS = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
const SLOT_COLORS = [
  "bg-[#22C55E]/15 border-[#22C55E]/30 text-[#22C55E]",
  "bg-[#3B82F6]/15 border-[#3B82F6]/30 text-[#3B82F6]",
  "bg-[#8B5CF6]/15 border-[#8B5CF6]/30 text-[#8B5CF6]",
  "bg-[#F59E0B]/15 border-[#F59E0B]/30 text-[#F59E0B]",
  "bg-[#EC4899]/15 border-[#EC4899]/30 text-[#EC4899]",
  "bg-[#06B6D4]/15 border-[#06B6D4]/30 text-[#06B6D4]",
];

export default function RoutinePage() {
  const [routines, setRoutines] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [batchSubjects, setBatchSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBranch, setFilterBranch] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>({ dayOfWeek: "SATURDAY", room: "", startTime: "09:00", endTime: "10:00", branchId: "", batchId: "", batchSubjectId: "" });
  const [submitting, setSubmitting] = useState(false);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState<string | null>(null);

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
      const [rRes, bRes, batchRes, bsRes] = await Promise.all([
        getAllRoutines({ limit: 200 }),
        getAllBranches({ limit: 100 }),
        getAllBatches({ limit: 100 }),
        getAllBatchSubjects({ limit: 500 }),
      ]);
      setRoutines(rRes?.data || []);
      setBranches(bRes?.data || []);
      setBatches(batchRes?.data || []);
      setBatchSubjects(bsRes?.data || []);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!form.dayOfWeek || !form.startTime || !form.batchSubjectId) { setConflicts([]); return; }
    const detected: string[] = [];
    const selectedBS = batchSubjects.find((bs: any) => bs.id === form.batchSubjectId);
    const nStart = parseInt(form.startTime.split(":")[0]) * 60 + parseInt(form.startTime.split(":")[1]);
    const nEnd = parseInt(form.endTime.split(":")[0]) * 60 + parseInt(form.endTime.split(":")[1]);

    routines.forEach((r: any) => {
      if (r.dayOfWeek !== form.dayOfWeek) return;
      const rStart = new Date(r.startTime).getHours() * 60 + new Date(r.startTime).getMinutes();
      const rEnd = new Date(r.endTime).getHours() * 60 + new Date(r.endTime).getMinutes();
      if (!(nStart < rEnd && nEnd > rStart)) return;
      if (selectedBS && r.batchSubject?.teacherId === selectedBS.teacherId)
        detected.push(`⚠️ Teacher conflict: ${r.batchSubject?.teacher?.user?.name || "Teacher"} is already scheduled.`);
      if (form.room && r.room === form.room)
        detected.push(`⚠️ Room conflict: Room "${form.room}" is already booked.`);
    });
    setConflicts(detected.filter((value, index, self) => self.indexOf(value) === index));
  }, [form, routines, batchSubjects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (conflicts.length > 0) {
      const confirmed = await swalConfirm({ title: "Conflicts detected", text: `${conflicts.length} conflict(s) detected. Add anyway?` });
      if (!confirmed) return;
    }
    setSubmitting(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      await createRoutine({
        branchId: form.branchId, batchId: form.batchId, batchSubjectId: form.batchSubjectId,
        room: form.room, dayOfWeek: form.dayOfWeek,
        startTime: new Date(`${today}T${form.startTime}:00`).toISOString(),
        endTime: new Date(`${today}T${form.endTime}:00`).toISOString(),
      });
      await swalSuccess({ title: "Routine updated", text: "The class was added to the routine successfully." });
      showToast("Class added to routine!");
      setModal(false); setConflicts([]); load();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to create";
      await swalError({ title: "Could not add class", text: message });
      showToast(message, "error");
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await swalConfirm({ title: "Remove this class?", text: "This will delete the class from the routine." });
    if (!confirmed) return;
    try { await deleteRoutine(id); await swalSuccess({ title: "Class removed", text: "The class was removed from the routine." }); showToast("Removed."); load(); }
    catch (err: any) { const message = err?.response?.data?.message || "Failed"; await swalError({ title: "Delete failed", text: message }); showToast(message, "error"); }
  };

  const filteredRoutines = routines.filter((r: any) => {
    if (filterBranch && r.branchId !== filterBranch) return false;
    if (filterBatch && r.batchId !== filterBatch) return false;
    return true;
  });

  const getSlots = (day: string, hour: string) => {
    const h = parseInt(hour);
    return filteredRoutines.filter((r: any) => r.dayOfWeek === day && new Date(r.startTime).getHours() === h);
  };

  const filteredBatchSubjects = batchSubjects.filter((bs: any) => !form.batchId || bs.batchId === form.batchId);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F2F2]">Weekly Class Routine</h1>
          <p className="text-sm text-[#71717A] mt-1">Schedule classes with real-time teacher & room conflict detection.</p>
        </div>
        <button onClick={() => { setForm({ dayOfWeek: "SATURDAY", room: "", startTime: "09:00", endTime: "10:00", branchId: "", batchId: "", batchSubjectId: "" }); setConflicts([]); setModal(true); }}
          className="px-4 py-2 bg-[#22C55E] text-[#052E16] text-sm font-bold rounded-lg hover:bg-[#16A34A] transition">
          + Add Class
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Classes/Week", value: filteredRoutines.length, icon: "📅", color: "text-[#22C55E]" },
          { label: "Rooms Used", value: new Set(filteredRoutines.map((r: any) => r.room)).size, icon: "🚪", color: "text-[#3B82F6]" },
          { label: "Batches", value: new Set(filteredRoutines.map((r: any) => r.batchId)).size, icon: "🎓", color: "text-[#8B5CF6]" },
          { label: "Subjects", value: new Set(filteredRoutines.map((r: any) => r.batchSubject?.subjectId)).size, icon: "📚", color: "text-[#F59E0B]" },
        ].map(s => (
          <div key={s.label} className="bg-[#111010] border border-[#1C1917] rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-[#71717A]">{s.label}</p></div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-[#111010] p-4 rounded-xl border border-[#1C1917] flex-wrap">
        <span className="text-xs font-semibold text-[#71717A] uppercase">Filter:</span>
        <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} className="bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
          <option value="">All Branches</option>
          {branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={filterBatch} onChange={(e) => setFilterBatch(e.target.value)} className="bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
          <option value="">All Batches</option>
          {batches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-3 text-xs text-[#71717A]">
          {SLOT_COLORS.slice(0, 3).map((c, i) => <span key={i} className={`w-3 h-3 rounded border inline-block ${c}`} />)}
          <span>Color-coded by position</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl border border-[#1C1917] bg-[#111010] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <div style={{ minWidth: 900 }}>
            <div className="grid border-b border-[#1C1917]" style={{ gridTemplateColumns: "70px repeat(7, 1fr)" }}>
              <div className="px-2 py-3 text-[10px] font-semibold text-[#71717A] uppercase border-r border-[#1C1917] bg-[#080706]">Time</div>
              {DAYS.map(day => (
                <div key={day} className={`px-2 py-3 text-center text-xs font-bold uppercase tracking-wider border-r border-[#1C1917] last:border-r-0 bg-[#080706] ${day === new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase() ? "text-[#22C55E]" : "text-[#F2F2F2]"}`}>
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>
            {loading ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid border-b border-[#1C1917]" style={{ gridTemplateColumns: "70px repeat(7, 1fr)" }}>
                <div className="px-2 py-3 border-r border-[#1C1917] bg-[#0D0B0A]" />
                {DAYS.map(d => <div key={d} className="px-1 py-1 border-r border-[#1C1917] last:border-r-0 h-16"><div className="h-10 bg-[#1C1917] rounded animate-pulse" /></div>)}
              </div>
            )) : HOURS.map(hour => (
              <div key={hour} className="grid border-b border-[#1C1917] last:border-b-0" style={{ gridTemplateColumns: "70px repeat(7, 1fr)" }}>
                <div className="px-2 py-2 border-r border-[#1C1917] bg-[#0D0B0A] flex items-start pt-2">
                  <span className="text-[10px] font-mono text-[#71717A]">{hour}</span>
                </div>
                {DAYS.map(day => {
                  const slots = getSlots(day, hour);
                  const cellKey = `${day}-${hour}`;
                  return (
                    <div key={day}
                      className={`px-1 py-1 border-r border-[#1C1917] last:border-r-0 min-h-[56px] transition-colors ${dragOver === cellKey ? "bg-[#22C55E]/5" : ""}`}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(cellKey); }}
                      onDragLeave={() => setDragOver(null)}
                      onDrop={() => setDragOver(null)}
                    >
                      {slots.map((slot: any, si: number) => (
                        <div key={slot.id} draggable
                          className={`mb-0.5 p-1.5 rounded border text-[10px] leading-tight cursor-grab active:cursor-grabbing group relative ${SLOT_COLORS[si % SLOT_COLORS.length]}`}>
                          <p className="font-bold truncate">{slot.batchSubject?.subject?.name || "Class"}</p>
                          <p className="opacity-70 truncate">{slot.batch?.name}</p>
                          <p className="opacity-60">🚪 {slot.room}</p>
                          <button onClick={() => handleDelete(slot.id)} className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 text-[10px] hover:text-[#EF4444] transition font-bold">✕</button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111010] border border-[#1C1917] w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-[#1C1917] flex justify-between items-center sticky top-0 bg-[#111010]">
              <h3 className="font-bold text-[#F2F2F2]">Schedule a Class</h3>
              <button onClick={() => setModal(false)} className="text-[#71717A] hover:text-[#F2F2F2]">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {conflicts.length > 0 && (
                <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg p-3 space-y-1">
                  {conflicts.map((c, i) => <p key={i} className="text-xs text-[#EF4444]">{c}</p>)}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Day *</label>
                  <select required value={form.dayOfWeek} onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
                    className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Room *</label>
                  <input required value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="e.g. Room 101"
                    className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] placeholder-[#71717A] outline-none focus:border-[#22C55E]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Start *</label>
                  <select required value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
                    {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">End *</label>
                  <select required value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
                    {HOURS.filter(h => h > form.startTime).map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Branch *</label>
                <select required value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value, batchId: "", batchSubjectId: "" })}
                  className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
                  <option value="">Select Branch</option>
                  {branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Batch *</label>
                <select required value={form.batchId} onChange={(e) => setForm({ ...form, batchId: e.target.value, batchSubjectId: "" })}
                  className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
                  <option value="">Select Batch</option>
                  {batches.filter((b: any) => !form.branchId || b.branchId === form.branchId).map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">Subject & Teacher *</label>
                <select required value={form.batchSubjectId} onChange={(e) => setForm({ ...form, batchSubjectId: e.target.value })}
                  className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
                  <option value="">Select Subject</option>
                  {filteredBatchSubjects.map((bs: any) => (
                    <option key={bs.id} value={bs.id}>{bs.subject?.name} — {bs.teacher?.user?.name || "No Teacher"}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm text-[#71717A] hover:text-[#F2F2F2]">Cancel</button>
                <button type="submit" disabled={submitting}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition disabled:opacity-50 ${conflicts.length > 0 ? "bg-[#EF4444] text-white hover:bg-[#DC2626]" : "bg-[#22C55E] text-[#052E16] hover:bg-[#16A34A]"}`}>
                  {submitting ? "Adding..." : conflicts.length > 0 ? "Add with Conflicts" : "Add Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
