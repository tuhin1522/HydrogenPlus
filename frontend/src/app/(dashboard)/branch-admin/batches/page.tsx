"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { swalConfirm, swalSuccess, swalError } from "@/app/lib/swal";
import { branchAdminService } from "../../../modules/branch-admin/services/branch-admin.service";

type Batch = {
  id: string;
  name: string;
  classLevelId: string;
  capacity: number;
  isActive: boolean;
  branchId: string;
  classLevel?: {
    name: string;
  };
  _count?: {
    students: number;
  };
};

type ClassLevel = {
  id: string;
  name: string;
};

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [classLevels, setClassLevels] = useState<ClassLevel[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [defaultBranchId, setDefaultBranchId] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    classLevelId: "",
    capacity: 30,
    isActive: true,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [batchesRes, classesRes, branchesRes] = await Promise.all([
        branchAdminService.getBatches(),
        branchAdminService.getClassLevels(),
        branchAdminService.getBranches(),
      ]);
      setBatches(batchesRes.data || []);
      setClassLevels(classesRes.data || []);
      if (branchesRes.data && branchesRes.data.length > 0) {
        setDefaultBranchId(branchesRes.data[0].id);
      }
    } catch (err) {
      toast.error("Failed to load batches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (batch: Batch) => {
    setFormData({
      id: batch.id,
      name: batch.name,
      classLevelId: batch.classLevelId,
      capacity: batch.capacity,
      isActive: batch.isActive ?? true,
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
        await branchAdminService.deleteBatch(id);
        await swalSuccess({ title: "Deleted!", text: "Batch has been deleted." });
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
        await branchAdminService.updateBatch(formData.id, {
          name: formData.name,
          classLevelId: formData.classLevelId,
          capacity: Number(formData.capacity),
          status: formData.isActive ? "ACTIVE" : "INACTIVE",
        });
        toast.success("Batch updated successfully");
      } else {
        await branchAdminService.createBatch({
          name: formData.name,
          branchId: defaultBranchId,
          classLevelId: formData.classLevelId,
          capacity: Number(formData.capacity),
          status: formData.isActive ? "ACTIVE" : "INACTIVE",
        });
        toast.success("Batch created successfully");
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

  const filtered = batches.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Batches</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage class batches and their capacities</p>
        </div>
        <button
          onClick={() => {
            setFormData({ id: "", name: "", classLevelId: "", capacity: 30, isActive: true });
            setModalOpen(true);
          }}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition flex items-center gap-2"
        >
          <span>+</span> Create Batch
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border">
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search batches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Batch Name</th>
                <th className="px-6 py-4 font-medium">Class</th>
                <th className="px-6 py-4 font-medium">Capacity</th>
                <th className="px-6 py-4 font-medium">Enrolled</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No batches found.
                  </td>
                </tr>
              ) : (
                filtered.map((batch) => (
                  <tr key={batch.id} className="hover:bg-muted/30 transition">
                    <td className="px-6 py-4 font-medium text-foreground">{batch.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{batch.classLevel?.name || "N/A"}</td>
                    <td className="px-6 py-4 text-muted-foreground">{batch.capacity}</td>
                    <td className="px-6 py-4 text-muted-foreground">{batch._count?.students || 0}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          batch.isActive !== false
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {batch.isActive !== false ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => handleEdit(batch)} className="text-primary hover:underline text-xs font-medium">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(batch.id)} className="text-destructive hover:underline text-xs font-medium">
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
              <h2 className="text-lg font-bold text-foreground">{formData.id ? "Edit Batch" : "Create New Batch"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Batch Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Class *</label>
                <select required value={formData.classLevelId} onChange={e => setFormData({ ...formData, classLevelId: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                  <option value="">Select Class...</option>
                  {classLevels.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Capacity *</label>
                <input required type="number" min="1" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Status</label>
                <select value={formData.isActive ? "ACTIVE" : "INACTIVE"} onChange={e => setFormData({ ...formData, isActive: e.target.value === "ACTIVE" })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50">
                  {submitting ? "Saving..." : "Save Batch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
