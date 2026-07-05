"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { swalConfirm, swalError, swalSuccess } from "@/app/lib/swal";
import { branchAdminService } from "../../../modules/branch-admin/services/branch-admin.service";

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

interface Routine {
  id: string;
  branchId: string;
  batchId: string;
  room: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  batchSubjectId: string;
  branch?: { id: string; name: string };
  batch?: { id: string; name: string };
  batchSubject?: {
    id: string;
    subjectId: string;
    teacherId: string;
    subject?: { id: string; name: string };
    teacher?: { id: string; user?: { name: string } };
  };
}

interface Batch {
  id: string;
  name: string;
  branchId: string;
}

interface BatchSubject {
  id: string;
  batchId: string;
  subjectId: string;
  teacherId: string;
  subject?: { id: string; name: string };
  teacher?: { id: string; user?: { name: string } };
}

export default function BranchAdminRoutinePage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [batchSubjects, setBatchSubjects] = useState<BatchSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBatch, setFilterBatch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>({
    dayOfWeek: "SATURDAY",
    room: "",
    startTime: "09:00",
    endTime: "10:00",
    batchId: "",
    batchSubjectId: "",
  });
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
      const [rRes, bRes, bsRes] = await Promise.all([
        branchAdminService.getAllRoutines({ limit: 200 }),
        branchAdminService.getBatches(),
        branchAdminService.getBatchSubjects(),
      ]);
      setRoutines(rRes?.data || []);
      setBatches(bRes?.data || []);
      setBatchSubjects(bsRes?.data || []);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Conflict detection
  useEffect(() => {
    if (!form.dayOfWeek || !form.startTime || !form.batchSubjectId) {
      setConflicts([]);
      return;
    }
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
      const confirmed = await swalConfirm({
        title: "Conflicts detected",
        text: `${conflicts.length} conflict(s) detected. Add anyway?`,
      });
      if (!confirmed) return;
    }
    setSubmitting(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const branchId = batches.find((b) => b.id === form.batchId)?.branchId || "";

      await branchAdminService.createRoutine({
        branchId,
        batchId: form.batchId,
        batchSubjectId: form.batchSubjectId,
        room: form.room,
        dayOfWeek: form.dayOfWeek,
        startTime: new Date(`${today}T${form.startTime}:00`).toISOString(),
        endTime: new Date(`${today}T${form.endTime}:00`).toISOString(),
      });
      await swalSuccess({
        title: "Routine updated",
        text: "The class was added to the routine successfully.",
      });
      showToast("Class added to routine!");
      setModal(false);
      setConflicts([]);
      load();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to create";
      await swalError({ title: "Could not add class", text: message });
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await swalConfirm({
      title: "Remove this class?",
      text: "This will delete the class from the routine.",
    });
    if (!confirmed) return;
    try {
      await branchAdminService.deleteRoutine(id);
      await swalSuccess({
        title: "Class removed",
        text: "The class was removed from the routine.",
      });
      showToast("Removed.");
      load();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed";
      await swalError({ title: "Delete failed", text: message });
      showToast(message, "error");
    }
  };

  const filteredRoutines = routines.filter((r: any) => {
    if (filterBatch && r.batchId !== filterBatch) return false;
    return true;
  });

  const getSlots = (day: string, hour: string) => {
    const h = parseInt(hour);
    return filteredRoutines.filter(
      (r: any) => r.dayOfWeek === day && new Date(r.startTime).getHours() === h
    );
  };

  const filteredBatchSubjects = batchSubjects.filter(
    (bs: any) => !form.batchId || bs.batchId === form.batchId
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Weekly Class Routine</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Schedule classes with real-time teacher & room conflict detection.
          </p>
        </div>
        <button
          onClick={() => {
            setForm({
              dayOfWeek: "SATURDAY",
              room: "",
              startTime: "09:00",
              endTime: "10:00",
              batchId: "",
              batchSubjectId: "",
            });
            setConflicts([]);
            setModal(true);
          }}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
        >
          + Add Class
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Classes/Week", value: filteredRoutines.length, icon: "📅", color: "text-primary" },
          { label: "Rooms Used", value: new Set(filteredRoutines.map((r: any) => r.room)).size, icon: "🚪", color: "text-blue-600" },
          { label: "Batches", value: new Set(filteredRoutines.map((r: any) => r.batchId)).size, icon: "🎓", color: "text-violet-600" },
          { label: "Subjects", value: new Set(filteredRoutines.map((r: any) => r.batchSubject?.subjectId)).size, icon: "📚", color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Filter:</span>
        <select
          value={filterBatch}
          onChange={(e) => setFilterBatch(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
        >
          <option value="">All Batches</option>
          {batches.map((b: any) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
          {SLOT_COLORS.slice(0, 3).map((c, i) => (
            <span key={i} className={`inline-block h-3 w-3 rounded border ${c}`} />
          ))}
          <span>Color-coded by position</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        <div className="overflow-x-auto">
          <div style={{ minWidth: 900 }}>
            <div className="grid border-b border-border" style={{ gridTemplateColumns: "70px repeat(7, 1fr)" }}>
              <div className="border-r border-border bg-muted/20 px-2 py-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Time
              </div>
              {DAYS.map((day) => (
                <div
                  key={day}
                  className={`border-r border-border bg-muted/20 px-2 py-3 text-center text-xs font-bold uppercase tracking-wider last:border-r-0 ${
                    day === new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                >
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="grid border-b border-border" style={{ gridTemplateColumns: "70px repeat(7, 1fr)" }}>
                    <div className="border-r border-border bg-background px-2 py-3" />
                    {DAYS.map((d) => (
                      <div key={d} className="h-16 border-r border-border px-1 py-1 last:border-r-0">
                        <div className="h-10 animate-pulse rounded bg-muted/30" />
                      </div>
                    ))}
                  </div>
                ))
              : HOURS.map((hour) => (
                  <div key={hour} className="grid border-b border-border last:border-b-0" style={{ gridTemplateColumns: "70px repeat(7, 1fr)" }}>
                    <div className="flex items-start border-r border-border bg-background px-2 py-2 pt-2">
                      <span className="text-[10px] font-mono text-muted-foreground">{hour}</span>
                    </div>
                    {DAYS.map((day) => {
                      const slots = getSlots(day, hour);
                      const cellKey = `${day}-${hour}`;
                      return (
                        <div
                          key={day}
                          className={`min-h-[56px] border-r border-border px-1 py-1 last:border-r-0 transition-colors ${
                            dragOver === cellKey ? "bg-primary/5" : ""
                          }`}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(cellKey);
                          }}
                          onDragLeave={() => setDragOver(null)}
                          onDrop={() => setDragOver(null)}
                        >
                          {slots.map((slot: any, si: number) => (
                            <div
                              key={slot.id}
                              draggable
                              className={`mb-0.5 rounded border p-1.5 text-[10px] leading-tight cursor-grab active:cursor-grabbing group relative ${
                                SLOT_COLORS[si % SLOT_COLORS.length]
                              }`}
                            >
                              <p className="truncate font-bold">{slot.batchSubject?.subject?.name || "Class"}</p>
                              <p className="truncate opacity-70">{slot.batch?.name}</p>
                              <p className="opacity-60">🚪 {slot.room}</p>
                              <button
                                onClick={() => handleDelete(slot.id)}
                                className="absolute right-0.5 top-0.5 text-[10px] font-bold opacity-0 transition hover:text-destructive group-hover:opacity-100"
                              >
                                ✕
                              </button>
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

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-6 py-4">
              <h3 className="font-bold text-foreground">Schedule a Class</h3>
              <button onClick={() => setModal(false)} className="text-muted-foreground transition hover:text-foreground">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {conflicts.length > 0 && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 space-y-1">
                  {conflicts.map((c, i) => (
                    <p key={i} className="text-xs text-destructive">
                      {c}
                    </p>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Day *
                  </label>
                  <select
                    required
                    value={form.dayOfWeek}
                    onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Room *
                  </label>
                  <input
                    required
                    value={form.room}
                    onChange={(e) => setForm({ ...form, room: e.target.value })}
                    placeholder="e.g. Room 101"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Start *
                  </label>
                  <select
                    required
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    End *
                  </label>
                  <select
                    required
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
                  >
                    {HOURS.filter((h) => h > form.startTime).map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Batch *
                </label>
                <select
                  required
                  value={form.batchId}
                  onChange={(e) => setForm({ ...form, batchId: e.target.value, batchSubjectId: "" })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
                >
                  <option value="">Select Batch</option>
                  {batches.map((b: any) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Subject & Teacher *
                </label>
                <select
                  required
                  value={form.batchSubjectId}
                  onChange={(e) => setForm({ ...form, batchSubjectId: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
                >
                  <option value="">Select Subject</option>
                  {filteredBatchSubjects.map((bs: any) => (
                    <option key={bs.id} value={bs.id}>
                      {bs.subject?.name} — {bs.teacher?.user?.name || "No Teacher"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`rounded-lg px-4 py-2 text-sm font-bold transition disabled:opacity-50 ${
                    conflicts.length > 0
                      ? "bg-destructive text-white hover:bg-destructive/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
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
