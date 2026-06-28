"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAllClassLevels,
  createClassLevel,
  updateClassLevel,
  deleteClassLevel,
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getAllBatches,
  createBatch,
  updateBatch,
  deleteBatch,
  getAllBranches,
  getAllTeachers,
  getAllBatchSubjects,
  createBatchSubject,
  updateBatchSubject,
  deleteBatchSubject,
  getAllRoutines,
  createRoutine,
  deleteRoutine,
} from "@/app/modules/super-admin/services/super-admin.service";

type Tab = "classes" | "subjects" | "batches" | "batch-subjects" | "routines";

const DAYS = ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

export default function AcademicManagementPage() {
  const [activeTab, setActiveTab] = useState<Tab>("classes");
  const [data, setData] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [classLevels, setClassLevels] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [batchSubjects, setBatchSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<any>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadMeta = useCallback(async () => {
    const [bRes, lRes, tRes, batchRes, subRes, bsRes] = await Promise.allSettled([
      getAllBranches({ limit: 100 }),
      getAllClassLevels({ limit: 100 }),
      getAllTeachers({ limit: 100 }),
      getAllBatches({ limit: 100 }),
      getAllSubjects({ limit: 100 }),
      getAllBatchSubjects({ limit: 100 }),
    ]);
    if (bRes.status === "fulfilled") setBranches(bRes.value?.data || []);
    if (lRes.status === "fulfilled") setClassLevels(lRes.value?.data || []);
    if (tRes.status === "fulfilled") setTeachers(tRes.value?.data || []);
    if (batchRes.status === "fulfilled") setBatches(batchRes.value?.data || []);
    if (subRes.status === "fulfilled") setSubjects(subRes.value?.data || []);
    if (bsRes.status === "fulfilled") setBatchSubjects(bsRes.value?.data || []);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "classes") {
        const res = await getAllClassLevels({ limit: 100 });
        setData(res?.data || []);
      } else if (activeTab === "subjects") {
        const res = await getAllSubjects({ limit: 100 });
        setData(res?.data || []);
      } else if (activeTab === "batches") {
        const res = await getAllBatches({ limit: 100 });
        setData(res?.data || []);
      } else if (activeTab === "batch-subjects") {
        const res = await getAllBatchSubjects({ limit: 100 });
        setData(res?.data || []);
      } else if (activeTab === "routines") {
        const res = await getAllRoutines({ limit: 100 });
        setData(res?.data || []);
      }
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { loadMeta(); }, [loadMeta]);
  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setForm(activeTab === "routines" ? { dayOfWeek: "SATURDAY", room: "" } : {});
    setEditingId(null);
    setModal("create");
  };

  const openEdit = (item: any) => {
    setForm({ ...item });
    setEditingId(item.id);
    setModal("edit");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (activeTab === "classes") {
        if (modal === "edit") await updateClassLevel(editingId!, { name: form.name });
        else await createClassLevel({ name: form.name });
      } else if (activeTab === "subjects") {
        const payload = { name: form.name, code: form.code, classLevelId: form.classLevelId };
        if (modal === "edit") await updateSubject(editingId!, payload);
        else await createSubject(payload);
      } else if (activeTab === "batches") {
        const payload = { name: form.name, capacity: Number(form.capacity), status: form.status || "ACTIVE", branchId: form.branchId, classLevelId: form.classLevelId };
        if (modal === "edit") await updateBatch(editingId!, payload);
        else await createBatch(payload);
      } else if (activeTab === "batch-subjects") {
        const payload = { batchId: form.batchId, subjectId: form.subjectId, teacherId: form.teacherId };
        if (modal === "edit") await updateBatchSubject(editingId!, { teacherId: form.teacherId });
        else await createBatchSubject(payload);
      } else if (activeTab === "routines") {
        const start = new Date(`${new Date().toISOString().slice(0, 10)}T${form.startTime || "09:00"}:00`);
        const end = new Date(`${new Date().toISOString().slice(0, 10)}T${form.endTime || "10:00"}:00`);
        await createRoutine({
          branchId: form.branchId,
          batchId: form.batchId,
          batchSubjectId: form.batchSubjectId,
          room: form.room,
          dayOfWeek: form.dayOfWeek,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        });
      }
      showToast("Saved successfully!");
      setModal(null);
      loadData();
      loadMeta();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Operation failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      if (activeTab === "classes") await deleteClassLevel(id);
      else if (activeTab === "subjects") await deleteSubject(id);
      else if (activeTab === "batches") await deleteBatch(id);
      else if (activeTab === "batch-subjects") await deleteBatchSubject(id);
      else if (activeTab === "routines") await deleteRoutine(id);
      showToast("Deleted successfully.");
      loadData();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to delete", "error");
    }
  };

  const tabLabels: Record<Tab, string> = {
    classes: "Class Levels",
    subjects: "Subjects",
    batches: "Batches",
    "batch-subjects": "Batch Subjects",
    routines: "Routines",
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
          <h1 className="text-2xl font-bold text-[#F2F2F2]">Academic Management</h1>
          <p className="text-sm text-[#71717A] mt-1">Manage classes, subjects, batches, assignments, and routines</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-[#22C55E] text-[#052E16] text-sm font-bold rounded-lg hover:bg-[#16A34A] transition">
          + Create {tabLabels[activeTab]}
        </button>
      </div>

      <div className="flex border-b border-[#1C1917] overflow-x-auto">
        {(Object.keys(tabLabels) as Tab[]).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${activeTab === tab ? "border-[#22C55E] text-[#F2F2F2]" : "border-transparent text-[#71717A] hover:text-[#A1A1AA]"}`}>
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[#1C1917] bg-[#111010] overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-[#1C1917] text-[#71717A] text-xs">
              {activeTab === "classes" && <><th className="px-5 py-3 text-left font-medium uppercase">Name</th><th className="px-5 py-3 text-right font-medium uppercase">Actions</th></>}
              {activeTab === "subjects" && <><th className="px-5 py-3 text-left font-medium uppercase">Name</th><th className="px-5 py-3 text-left font-medium uppercase">Code</th><th className="px-5 py-3 text-left font-medium uppercase">Class</th><th className="px-5 py-3 text-right font-medium uppercase">Actions</th></>}
              {activeTab === "batches" && <><th className="px-5 py-3 text-left font-medium uppercase">Name</th><th className="px-5 py-3 text-left font-medium uppercase">Branch</th><th className="px-5 py-3 text-left font-medium uppercase">Capacity</th><th className="px-5 py-3 text-left font-medium uppercase">Status</th><th className="px-5 py-3 text-right font-medium uppercase">Actions</th></>}
              {activeTab === "batch-subjects" && <><th className="px-5 py-3 text-left font-medium uppercase">Batch</th><th className="px-5 py-3 text-left font-medium uppercase">Subject</th><th className="px-5 py-3 text-left font-medium uppercase">Teacher</th><th className="px-5 py-3 text-right font-medium uppercase">Actions</th></>}
              {activeTab === "routines" && <><th className="px-5 py-3 text-left font-medium uppercase">Day</th><th className="px-5 py-3 text-left font-medium uppercase">Room</th><th className="px-5 py-3 text-left font-medium uppercase">Batch</th><th className="px-5 py-3 text-right font-medium uppercase">Actions</th></>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1917]">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-4 bg-[#1C1917] rounded animate-pulse" /></td></tr>
              ))
            ) : data.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-16 text-center text-[#71717A]">No records found.</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-[#1C1917]/20">
                  {activeTab === "classes" && <><td className="px-5 py-4 font-medium text-[#F2F2F2]">{item.name}</td><td className="px-5 py-4 text-right"><ActionButtons onEdit={() => openEdit(item)} onDelete={() => handleDelete(item.id)} /></td></>}
                  {activeTab === "subjects" && <><td className="px-5 py-4 text-[#F2F2F2]">{item.name}</td><td className="px-5 py-4 text-[#A1A1AA]">{item.code || "—"}</td><td className="px-5 py-4 text-[#A1A1AA]">{item.classLevel?.name || "—"}</td><td className="px-5 py-4 text-right"><ActionButtons onEdit={() => openEdit(item)} onDelete={() => handleDelete(item.id)} /></td></>}
                  {activeTab === "batches" && <><td className="px-5 py-4 text-[#F2F2F2]">{item.name}</td><td className="px-5 py-4 text-[#A1A1AA]">{item.branch?.name || "—"}</td><td className="px-5 py-4 text-[#A1A1AA]">{item.capacity}</td><td className="px-5 py-4"><StatusBadge status={item.status} /></td><td className="px-5 py-4 text-right"><ActionButtons onEdit={() => openEdit(item)} onDelete={() => handleDelete(item.id)} /></td></>}
                  {activeTab === "batch-subjects" && <><td className="px-5 py-4 text-[#F2F2F2]">{item.batch?.name || "—"}</td><td className="px-5 py-4 text-[#A1A1AA]">{item.subject?.name || "—"}</td><td className="px-5 py-4 text-[#A1A1AA]">{item.teacher?.user?.name || "—"}</td><td className="px-5 py-4 text-right"><ActionButtons onEdit={() => openEdit(item)} onDelete={() => handleDelete(item.id)} /></td></>}
                  {activeTab === "routines" && <><td className="px-5 py-4 text-[#F2F2F2]">{item.dayOfWeek}</td><td className="px-5 py-4 text-[#A1A1AA]">{item.room}</td><td className="px-5 py-4 text-[#A1A1AA]">{item.batch?.name || "—"}</td><td className="px-5 py-4 text-right"><button onClick={() => handleDelete(item.id)} className="px-3 py-1 text-xs border border-[#27272A] text-[#A1A1AA] rounded-lg hover:text-[#EF4444]">Delete</button></td></>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111010] border border-[#1C1917] w-full max-w-md rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-[#1C1917] flex justify-between items-center sticky top-0 bg-[#111010]">
              <h3 className="font-bold text-[#F2F2F2]">{modal === "edit" ? "Edit" : "Create"} {tabLabels[activeTab]}</h3>
              <button onClick={() => setModal(null)} className="text-[#71717A]">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {activeTab === "classes" && (
                <Field label="Name" required value={form.name || ""} onChange={(v) => setForm({ ...form, name: v })} />
              )}
              {activeTab === "subjects" && (
                <>
                  <Field label="Name" required value={form.name || ""} onChange={(v) => setForm({ ...form, name: v })} />
                  <Field label="Code" value={form.code || ""} onChange={(v) => setForm({ ...form, code: v })} />
                  <SelectField label="Class Level" required value={form.classLevelId || ""} onChange={(v) => setForm({ ...form, classLevelId: v })} options={classLevels.map((l) => ({ value: l.id, label: l.name }))} />
                </>
              )}
              {activeTab === "batches" && (
                <>
                  <Field label="Name" required value={form.name || ""} onChange={(v) => setForm({ ...form, name: v })} />
                  <Field label="Capacity" required type="number" value={form.capacity || ""} onChange={(v) => setForm({ ...form, capacity: v })} />
                  <SelectField label="Branch" required value={form.branchId || ""} onChange={(v) => setForm({ ...form, branchId: v })} options={branches.map((b) => ({ value: b.id, label: b.name }))} />
                  <SelectField label="Class Level" required value={form.classLevelId || ""} onChange={(v) => setForm({ ...form, classLevelId: v })} options={classLevels.map((l) => ({ value: l.id, label: l.name }))} />
                  <SelectField label="Status" value={form.status || "ACTIVE"} onChange={(v) => setForm({ ...form, status: v })} options={[{ value: "ACTIVE", label: "ACTIVE" }, { value: "INACTIVE", label: "INACTIVE" }]} />
                </>
              )}
              {activeTab === "batch-subjects" && (
                <>
                  {modal === "create" && (
                    <>
                      <SelectField label="Batch" required value={form.batchId || ""} onChange={(v) => setForm({ ...form, batchId: v })} options={batches.map((b) => ({ value: b.id, label: b.name }))} />
                      <SelectField label="Subject" required value={form.subjectId || ""} onChange={(v) => setForm({ ...form, subjectId: v })} options={subjects.map((s) => ({ value: s.id, label: s.name }))} />
                    </>
                  )}
                  <SelectField label="Teacher" required value={form.teacherId || ""} onChange={(v) => setForm({ ...form, teacherId: v })} options={teachers.map((t) => ({ value: t.id, label: t.user?.name || t.id }))} />
                </>
              )}
              {activeTab === "routines" && (
                <>
                  <SelectField label="Branch" required value={form.branchId || ""} onChange={(v) => setForm({ ...form, branchId: v })} options={branches.map((b) => ({ value: b.id, label: b.name }))} />
                  <SelectField label="Batch" required value={form.batchId || ""} onChange={(v) => setForm({ ...form, batchId: v })} options={batches.map((b) => ({ value: b.id, label: b.name }))} />
                  <SelectField label="Batch Subject" required value={form.batchSubjectId || ""} onChange={(v) => setForm({ ...form, batchSubjectId: v })} options={batchSubjects.map((bs) => ({ value: bs.id, label: `${bs.batch?.name || "Batch"} - ${bs.subject?.name || "Subject"}` }))} />
                  <SelectField label="Day" required value={form.dayOfWeek || "SATURDAY"} onChange={(v) => setForm({ ...form, dayOfWeek: v })} options={DAYS.map((d) => ({ value: d, label: d }))} />
                  <Field label="Room" required value={form.room || ""} onChange={(v) => setForm({ ...form, room: v })} />
                  <Field label="Start Time" required type="time" value={form.startTime || "09:00"} onChange={(v) => setForm({ ...form, startTime: v })} />
                  <Field label="End Time" required type="time" value={form.endTime || "10:00"} onChange={(v) => setForm({ ...form, endTime: v })} />
                </>
              )}
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

function ActionButtons({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <>
      <button onClick={onEdit} className="px-3 py-1 text-xs border border-[#27272A] text-[#A1A1AA] rounded-lg hover:text-[#22C55E] mr-2">Edit</button>
      <button onClick={onDelete} className="px-3 py-1 text-xs border border-[#27272A] text-[#A1A1AA] rounded-lg hover:text-[#EF4444]">Delete</button>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status === "ACTIVE" ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#EF4444]/10 text-[#EF4444]"}`}>
      {status}
    </span>
  );
}

function Field({ label, value, onChange, required, type = "text" }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">{label}{required ? " *" : ""}</label>
      <input required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]" />
    </div>
  );
}

function SelectField({ label, value, onChange, options, required }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#71717A] uppercase mb-1.5">{label}{required ? " *" : ""}</label>
      <select required={required} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
        <option value="">Select...</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
