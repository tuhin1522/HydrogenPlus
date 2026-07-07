"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { swalConfirm, swalSuccess, swalError } from "@/app/lib/swal";
import { branchAdminService } from "../../../modules/branch-admin/services/branch-admin.service";

type Subject = {
  id: string;
  name: string;
  code: string;
  classLevelId: string;
  classLevel?: {
    name: string;
  };
  batchSubjects?: any[];
};

type ClassLevel = {
  id: string;
  name: string;
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classLevels, setClassLevels] = useState<ClassLevel[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    code: "",
    classLevelId: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [subjectsRes, classesRes] = await Promise.all([
        branchAdminService.getSubjects(),
        branchAdminService.getClassLevels(),
      ]);
      setSubjects(subjectsRes.data || []);
      setClassLevels(classesRes.data || []);
    } catch (err) {
      toast.error("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (subject: Subject) => {
    setFormData({
      id: subject.id,
      name: subject.name,
      code: subject.code || "",
      classLevelId: subject.classLevelId,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await swalConfirm({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
    });

    if (confirmed) {
      try {
        await branchAdminService.deleteSubject(id);
        await swalSuccess({ title: "Deleted!", text: "Subject has been deleted." });
        loadData();
      } catch (err: any) {
        swalError({ title: "Error", text: err.response?.data?.message || "Failed to delete" });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (formData.id) {
        await branchAdminService.updateSubject(formData.id, {
          name: formData.name,
          code: formData.code,
        });
        toast.success("Subject updated successfully");
      } else {
        await branchAdminService.createSubject({
          name: formData.name,
          code: formData.code,
          classLevelId: formData.classLevelId,
        });
        toast.success("Subject created successfully");
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      let errorMessage = err.response?.data?.message || "Operation failed";
      if (err.response?.data?.errorSources?.length > 0) {
        errorMessage = err.response.data.errorSources.map((e: any) => e.message).join(", ");
      }
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = subjects.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesClass = filterClass ? s.classLevelId === filterClass : true;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subjects</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage subjects and assign them to batches</p>
        </div>
        <button
          onClick={() => {
            setFormData({ id: "", name: "", code: "", classLevelId: "" });
            setModalOpen(true);
          }}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition flex items-center gap-2"
        >
          <span>+</span> Create Subject
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border">
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search subjects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
        <select 
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        >
          <option value="">All Classes</option>
          {classLevels.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Subject Name</th>
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium">Class</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No subjects found.
                  </td>
                </tr>
              ) : (
                filtered.map((subject) => (
                  <tr key={subject.id} className="hover:bg-muted/30 transition">
                    <td className="px-6 py-4 font-medium text-foreground">{subject.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{subject.code || "N/A"}</td>
                    <td className="px-6 py-4 text-muted-foreground">{subject.classLevel?.name || "N/A"}</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => handleEdit(subject)} className="text-primary hover:underline text-xs font-medium">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(subject.id)} className="text-destructive hover:underline text-xs font-medium">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
              <h2 className="text-lg font-bold text-foreground">{formData.id ? "Edit Subject" : "Create New Subject"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Subject Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Subject Code</label>
                <input type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Class *</label>
                <select required disabled={!!formData.id} value={formData.classLevelId} onChange={e => setFormData({ ...formData, classLevelId: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary disabled:opacity-50">
                  <option value="">Select Class...</option>
                  {classLevels.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {formData.id && (
                  <p className="text-xs text-muted-foreground mt-1">Class level cannot be changed after creation.</p>
                )}
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50">
                  {submitting ? "Saving..." : "Save Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
