"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { swalConfirm, swalError, swalSuccess } from "@/app/lib/swal";
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
} from "@/app/modules/super-admin/services/super-admin.service";

type Tab = "classes" | "subjects" | "batches" | "batch-subjects";

type AcademicRecord = {
  id: string;
  name?: string | null;
  code?: string | null;
  classLevel?: { name?: string | null } | null;
  branch?: { name?: string | null } | null;
  capacity?: number | null;
  status?: string | null;
  batch?: { name?: string | null } | null;
  subject?: { name?: string | null } | null;
  teacher?: { user?: { name?: string | null } | null } | null;
};

type BranchOption = { id: string; name?: string | null };

type ClassLevelOption = { id: string; name?: string | null };

type TeacherOption = { id: string; user?: { name?: string | null } | null };

type AcademicForm = Record<string, string>;

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function AcademicManagementPage() {
  const [activeTab, setActiveTab] = useState<Tab>("classes");
  const [data, setData] = useState<AcademicRecord[]>([]);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [classLevels, setClassLevels] = useState<ClassLevelOption[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [batches, setBatches] = useState<AcademicRecord[]>([]);
  const [subjects, setSubjects] = useState<AcademicRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<AcademicForm>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    if (type === "error") {
      toast.error(msg);
    } else {
      toast.success(msg);
    }
  };

  const loadMeta = useCallback(async () => {
    const [bRes, lRes, tRes, batchRes, subRes] = await Promise.allSettled([
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
      } 
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!isMounted) return;
      await loadMeta();
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, [loadMeta]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!isMounted) return;
      await loadData();
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, [loadData]);

  const openEdit = (item: AcademicRecord) => {
    const normalized = Object.fromEntries(
      Object.entries(item).map(([key, value]) => [key, value == null ? "" : String(value)])
    ) as AcademicForm;

    setForm(normalized);
    setEditingId(item.id);
    setModal("edit");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (activeTab === "classes") {
        if (modal === "edit") await updateClassLevel(editingId!, { name: String(form.name ?? "") });
        else await createClassLevel({ name: String(form.name ?? "") });
      } else if (activeTab === "subjects") {
        const payload = { name: String(form.name ?? ""), code: String(form.code ?? ""), classLevelId: String(form.classLevelId ?? "") };
        if (modal === "edit") await updateSubject(editingId!, payload);
        else await createSubject(payload);
      } else if (activeTab === "batches") {
        const payload = { name: String(form.name ?? ""), capacity: Number(form.capacity ?? 0), status: String(form.status ?? "ACTIVE"), branchId: String(form.branchId ?? ""), classLevelId: String(form.classLevelId ?? "") };
        if (modal === "edit") await updateBatch(editingId!, payload);
        else await createBatch(payload);
      } else if (activeTab === "batch-subjects") {
        const payload = { batchId: String(form.batchId ?? ""), subjectId: String(form.subjectId ?? ""), teacherId: String(form.teacherId ?? "") };
        if (modal === "edit") await updateBatchSubject(editingId!, { teacherId: String(form.teacherId ?? "") });
        else await createBatchSubject(payload);
      } 
      await swalSuccess({ title: "Saved successfully", text: "The changes were applied successfully." });
      showToast("Saved successfully!");
      setModal(null);
      void loadData();
      void loadMeta();
    } catch (err: unknown) {
      const message = (err as ApiError)?.response?.data?.message || "Operation failed";
      await swalError({ title: "Operation failed", text: message });
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await swalConfirm({ title: "Delete this item?", text: "This action cannot be undone." });
    if (!confirmed) return;
    try {
      if (activeTab === "classes") await deleteClassLevel(id);
      else if (activeTab === "subjects") await deleteSubject(id);
      else if (activeTab === "batches") await deleteBatch(id);
      else if (activeTab === "batch-subjects") await deleteBatchSubject(id);
      await swalSuccess({ title: "Deleted successfully", text: "The item was removed successfully." });
      showToast("Deleted successfully.");
      void loadData();
    } catch (err: unknown) {
      const message = (err as ApiError)?.response?.data?.message || "Failed to delete";
      await swalError({ title: "Delete failed", text: message });
      showToast(message, "error");
    }
  };

  const tabLabels: Record<Tab, string> = {
    classes: "Class Levels",
    subjects: "Subjects",
    batches: "Batches",
    "batch-subjects": "Batch Subjects",
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Academic Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage classes, subjects, batches, and assignments</p>
        </div>
        <button
          onClick={() => {
            setForm({});
            setModal("create");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90 transition"
        >
          <span>+</span>
          <span>Add New</span>
        </button>
      </div>

      <div className="flex border-b border-border overflow-x-auto">
        {(Object.keys(tabLabels) as Tab[]).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${activeTab === tab ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs">
              {activeTab === "classes" && <><th className="px-5 py-3 text-left font-medium uppercase">Name</th><th className="px-5 py-3 text-right font-medium uppercase">Actions</th></>}
              {activeTab === "subjects" && <><th className="px-5 py-3 text-left font-medium uppercase">Name</th><th className="px-5 py-3 text-left font-medium uppercase">Code</th><th className="px-5 py-3 text-left font-medium uppercase">Class</th><th className="px-5 py-3 text-right font-medium uppercase">Actions</th></>}
              {activeTab === "batches" && <><th className="px-5 py-3 text-left font-medium uppercase">Name</th><th className="px-5 py-3 text-left font-medium uppercase">Branch</th><th className="px-5 py-3 text-left font-medium uppercase">Capacity</th><th className="px-5 py-3 text-left font-medium uppercase">Status</th><th className="px-5 py-3 text-right font-medium uppercase">Actions</th></>}
              {activeTab === "batch-subjects" && <><th className="px-5 py-3 text-left font-medium uppercase">Batch</th><th className="px-5 py-3 text-left font-medium uppercase">Subject</th><th className="px-5 py-3 text-left font-medium uppercase">Teacher</th><th className="px-5 py-3 text-right font-medium uppercase">Actions</th></>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
              ))
            ) : data.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-16 text-center text-muted-foreground">No records found.</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50">
                  {activeTab === "classes" && <><td className="px-5 py-4 font-medium text-foreground">{item.name ?? "—"}</td><td className="px-5 py-4 text-right"><ActionButtons onEdit={() => openEdit(item)} onDelete={() => handleDelete(item.id)} /></td></>}
                  {activeTab === "subjects" && <><td className="px-5 py-4 text-foreground">{item.name ?? "—"}</td><td className="px-5 py-4 text-muted-foreground">{item.code || "—"}</td><td className="px-5 py-4 text-muted-foreground">{item.classLevel?.name || "—"}</td><td className="px-5 py-4 text-right"><ActionButtons onEdit={() => openEdit(item)} onDelete={() => handleDelete(item.id)} /></td></>}
                  {activeTab === "batches" && <><td className="px-5 py-4 text-foreground">{item.name ?? "—"}</td><td className="px-5 py-4 text-muted-foreground">{item.branch?.name || "—"}</td><td className="px-5 py-4 text-muted-foreground">{item.capacity ?? "—"}</td><td className="px-5 py-4"><StatusBadge status={item.status ?? "—"} /></td><td className="px-5 py-4 text-right"><ActionButtons onEdit={() => openEdit(item)} onDelete={() => handleDelete(item.id)} /></td></>}
                  {activeTab === "batch-subjects" && <><td className="px-5 py-4 text-foreground">{item.batch?.name || "—"}</td><td className="px-5 py-4 text-muted-foreground">{item.subject?.name || "—"}</td><td className="px-5 py-4 text-muted-foreground">{item.teacher?.user?.name || "—"}</td><td className="px-5 py-4 text-right"><ActionButtons onEdit={() => openEdit(item)} onDelete={() => handleDelete(item.id)} /></td></>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center sticky top-0 bg-card">
              <h3 className="font-bold text-foreground">{modal === "edit" ? "Edit" : "Create"} {tabLabels[activeTab]}</h3>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {activeTab === "classes" && (
                <Field label="Name" required value={form.name || ""} onChange={(v) => setForm({ ...form, name: v })} />
              )}
              {activeTab === "subjects" && (
                <>
                  <Field label="Name" required value={form.name || ""} onChange={(v) => setForm({ ...form, name: v })} />
                  <Field label="Code" value={form.code || ""} onChange={(v) => setForm({ ...form, code: v })} />
                  <SelectField label="Class Level" required value={form.classLevelId || ""} onChange={(v) => setForm({ ...form, classLevelId: v })} options={classLevels.map((l) => ({ value: l.id, label: l.name ?? "" }))} />
                </>
              )}
              {activeTab === "batches" && (
                <>
                  <Field label="Name" required value={form.name || ""} onChange={(v) => setForm({ ...form, name: v })} />
                  <Field label="Capacity" required type="number" value={form.capacity || ""} onChange={(v) => setForm({ ...form, capacity: v })} />
                  <SelectField label="Branch" required value={form.branchId || ""} onChange={(v) => setForm({ ...form, branchId: v })} options={branches.map((b) => ({ value: b.id, label: b.name ?? b.id }))} />
                  <SelectField label="Class Level" required value={form.classLevelId || ""} onChange={(v) => setForm({ ...form, classLevelId: v })} options={classLevels.map((l) => ({ value: l.id, label: l.name ?? l.id }))} />
                  <SelectField label="Status" value={form.status || "ACTIVE"} onChange={(v) => setForm({ ...form, status: v })} options={[{ value: "ACTIVE", label: "ACTIVE" }, { value: "INACTIVE", label: "INACTIVE" }]} />
                </>
              )}
              {activeTab === "batch-subjects" && (
                <>
                  {modal === "create" && (
                    <>
                      <SelectField label="Batch" required value={form.batchId || ""} onChange={(v) => setForm({ ...form, batchId: v })} options={batches.map((b) => ({ value: b.id, label: b.name ?? b.id }))} />
                      <SelectField label="Subject" required value={form.subjectId || ""} onChange={(v) => setForm({ ...form, subjectId: v })} options={subjects.map((s) => ({ value: s.id, label: s.name ?? s.id }))} />
                    </>
                  )}
                  <SelectField label="Teacher" required value={form.teacherId || ""} onChange={(v) => setForm({ ...form, teacherId: v })} options={teachers.map((t) => ({ value: t.id, label: t.user?.name ?? t.id }))} />
                </>
              )}
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg disabled:opacity-50 hover:bg-primary/90">
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
      <button onClick={onEdit} className="px-3 py-1 text-xs border border-border text-muted-foreground rounded-lg hover:text-primary mr-2">Edit</button>
      <button onClick={onDelete} className="px-3 py-1 text-xs border border-border text-muted-foreground rounded-lg hover:text-destructive">Delete</button>
    </>
  );
}

function StatusBadge({ status }: { status?: string }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status === "ACTIVE" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
      {status}
    </span>
  );
}

function Field({ label, value, onChange, required, type = "text" }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{label}{required ? " *" : ""}</label>
      <input required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
    </div>
  );
}

function SelectField({ label, value, onChange, options, required }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{label}{required ? " *" : ""}</label>
      <select required={required} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary">
        <option value="">Select...</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
