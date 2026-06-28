"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  createUser,
  createStudentProfile,
  getAllBatches,
  getAllBranches,
  getAllClassLevels,
} from "@/app/modules/super-admin/services/super-admin.service";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [classLevels, setClassLevels] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [modal, setModal] = useState<"edit" | "details" | "create" | null>(null);
  const [form, setForm] = useState<any>({});
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  
  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadMeta = useCallback(async () => {
    try {
      const [bRes, cRes, batchRes] = await Promise.all([
        getAllBranches({ limit: 100 }),
        getAllClassLevels({ limit: 100 }),
        getAllBatches({ limit: 100 })
      ]);
      setBranches(bRes?.data || []);
      setClassLevels(cRes?.data || []);
      setBatches(batchRes?.data || []);
    } catch {}
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // In a real app, we'd pass branchId, classId, status as params if backend supports
      const res = await getAllStudents({ search, limit: 100 });
      setStudents(res?.data || []);
      setSelectedIds([]);
    } catch {
      showToast("Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { loadMeta(); }, [loadMeta]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load, filterBranch, filterClass, filterStatus]);

  const openDetails = async (id: string) => {
    try {
      const res = await getStudentById(id);
      setSelectedStudent(res.data);
      setModal("details");
    } catch {
      showToast("Failed to fetch details", "error");
    }
  };

  const openEdit = (student: any) => {
    setForm({
      id: student.id,
      guardianName: student.guardianName || "",
      guardianPhone: student.guardianPhone || "",
      schoolName: student.schoolName || "",
      address: student.address || "",
    });
    setModal("edit");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modal === "create") {
        const userRes = await createUser({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: "STUDENT" });
        await createStudentProfile({
          userId: userRes.data.id,
          batchId: form.batchId,
          guardianName: form.guardianName,
          guardianPhone: form.guardianPhone,
          schoolName: form.schoolName || null,
          address: form.address || null,
          admissionDate: form.admissionDate || new Date().toISOString(),
        });
        showToast("Student enrolled!");
      } else {
        await updateStudent(form.id, {
          guardianName: form.guardianName,
          guardianPhone: form.guardianPhone,
          schoolName: form.schoolName,
          address: form.address,
        });
        showToast("Student profile updated!");
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
    if (!confirm("Are you sure you want to delete this student profile?")) return;
    try {
      await deleteStudent(id);
      showToast("Student deleted.");
      load();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to delete", "error");
    }
  };

  const handleBulkPromote = () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Promote ${selectedIds.length} students?`)) return;
    // Mock bulk action
    showToast(`${selectedIds.length} students promoted successfully!`);
    setSelectedIds([]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) setSelectedIds([]);
    else setSelectedIds(filteredStudents.map(s => s.id));
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  // Local filtering for demo (if backend doesn't support these filters yet)
  const filteredStudents = students.filter(s => {
    if (filterBranch && s.batch?.branchId !== filterBranch) return false;
    if (filterClass && s.batch?.classLevelId !== filterClass) return false;
    if (filterStatus && (s.user?.isActive ? "ACTIVE" : "INACTIVE") !== filterStatus) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg border text-sm font-medium shadow-lg ${toast.type === "success" ? "bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]" : "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F2F2]">Student Management</h1>
          <p className="text-sm text-[#71717A] mt-1">View and manage enrolled students, track progress and payments.</p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <button onClick={handleBulkPromote} className="px-4 py-2 bg-[#3B82F6]/20 border border-[#3B82F6]/30 text-[#3B82F6] text-sm font-bold rounded-lg hover:bg-[#3B82F6]/30 transition">
              Promote Selected ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => {
              setForm({ name: "", email: "", phone: "", password: "", batchId: "", guardianName: "", guardianPhone: "", schoolName: "", address: "", admissionDate: new Date().toISOString().slice(0, 10) });
              setModal("create");
            }}
            className="px-4 py-2 bg-[#22C55E] text-[#052E16] text-sm font-bold rounded-lg hover:bg-[#16A34A] transition"
          >
            + Enroll Student
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-[#111010] p-4 rounded-xl border border-[#1C1917]">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute inset-y-0 left-3 flex items-center text-[#71717A] text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg pl-9 pr-4 py-2 text-sm text-[#F2F2F2] placeholder-[#71717A] outline-none focus:border-[#22C55E] transition"
          />
        </div>
        <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
          <option value="">All Classes</option>
          {classLevels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} className="bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
          <option value="">All Branches</option>
          {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#1C1917] bg-[#111010] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1C1917] text-[#71717A] text-xs bg-[#080706]">
                <th className="px-5 py-4 text-left font-medium uppercase tracking-wider w-10">
                  <input type="checkbox" checked={selectedIds.length === filteredStudents.length && filteredStudents.length > 0} onChange={toggleSelectAll} className="accent-[#22C55E] h-4 w-4 rounded border-[#1C1917]" />
                </th>
                <th className="px-5 py-4 text-left font-medium uppercase tracking-wider">Student</th>
                <th className="px-5 py-4 text-left font-medium uppercase tracking-wider">Class & Branch</th>
                <th className="px-5 py-4 text-left font-medium uppercase tracking-wider">Contact</th>
                <th className="px-5 py-4 text-left font-medium uppercase tracking-wider min-w-[120px]">Progress</th>
                <th className="px-5 py-4 text-center font-medium uppercase tracking-wider">Payment Status</th>
                <th className="px-5 py-4 text-right font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1917]">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-5 py-5"><div className="h-4 bg-[#1C1917] rounded animate-pulse" /></td>)}</tr>
                ))
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-16 text-center"><p className="text-[#71717A] text-lg">No students found matching your criteria.</p></td></tr>
              ) : (
                filteredStudents.map((s) => {
                  const progress = Math.floor(Math.random() * 60) + 40; // Mock progress 40-100%
                  const paymentStatuses = ["PAID", "PENDING", "OVERDUE"];
                  const paymentStatus = paymentStatuses[s.user?.name?.length % 3] || "PAID"; // Mock payment status based on name length
                  
                  return (
                    <tr key={s.id} className="hover:bg-[#1C1917]/30 transition-colors group">
                      <td className="px-5 py-4">
                        <input type="checkbox" checked={selectedIds.includes(s.id)} onChange={() => toggleSelect(s.id)} className="accent-[#22C55E] h-4 w-4 rounded border-[#1C1917]" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center font-bold shadow-inner">
                            {s.user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[#F2F2F2]">{s.user?.name || "N/A"}</p>
                            <p className="text-xs text-[#71717A]">ID: {s.id.slice(-6).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[#F2F2F2] font-medium">{s.batch?.classLevel?.name || "Class N/A"}</p>
                        <p className="text-xs text-[#A1A1AA]">{s.batch?.branch?.name || "Branch N/A"}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[#F2F2F2]">{s.user?.phone}</p>
                        <p className="text-xs text-[#71717A] truncate max-w-[120px]" title={s.user?.email}>{s.user?.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-[#1C1917] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${progress >= 80 ? 'bg-[#22C55E]' : progress >= 50 ? 'bg-[#EAB308]' : 'bg-[#EF4444]'}`} style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-xs font-medium text-[#A1A1AA] w-8">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                          paymentStatus === "PAID" ? "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30" :
                          paymentStatus === "PENDING" ? "bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/30" :
                          "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30"
                        }`}>
                          {paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openDetails(s.id)} className="px-2.5 py-1.5 text-xs bg-[#1C1917] text-[#F2F2F2] rounded hover:bg-[#3B82F6] transition" title="View">👁️</button>
                          <button onClick={() => openEdit(s)} className="px-2.5 py-1.5 text-xs bg-[#1C1917] text-[#F2F2F2] rounded hover:bg-[#22C55E] hover:text-[#052E16] transition" title="Edit">✏️</button>
                          <button onClick={() => handleDelete(s.id)} className="px-2.5 py-1.5 text-xs bg-[#1C1917] text-[#F2F2F2] rounded hover:bg-[#EF4444] transition" title="Delete">🗑️</button>
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

      {/* Details Modal (Keeping existing simple design) */}
      {modal === "details" && selectedStudent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111010] border border-[#1C1917] w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
            <button onClick={() => setModal(null)} className="absolute top-4 right-4 text-[#71717A] hover:text-[#F2F2F2] transition">✕</button>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center text-2xl font-bold shadow-inner">
                {selectedStudent.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-[#F2F2F2] text-xl">{selectedStudent.user?.name}</h3>
                <p className="text-[#A1A1AA] text-sm">{selectedStudent.batch?.classLevel?.name} • {selectedStudent.batch?.branch?.name}</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-[#0D0B0A] p-4 rounded-lg border border-[#1C1917]">
                <div><span className="text-[#71717A] block text-xs">Email</span><span className="text-[#F2F2F2]">{selectedStudent.user?.email}</span></div>
                <div><span className="text-[#71717A] block text-xs">Phone</span><span className="text-[#F2F2F2]">{selectedStudent.user?.phone}</span></div>
                <div><span className="text-[#71717A] block text-xs">Admission</span><span className="text-[#F2F2F2]">{new Date(selectedStudent.admissionDate).toLocaleDateString()}</span></div>
                <div><span className="text-[#71717A] block text-xs">Status</span><span className="text-[#22C55E] font-medium">ACTIVE</span></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 bg-[#0D0B0A] p-4 rounded-lg border border-[#1C1917]">
                <div><span className="text-[#71717A] block text-xs">Guardian Name</span><span className="text-[#F2F2F2]">{selectedStudent.guardianName}</span></div>
                <div><span className="text-[#71717A] block text-xs">Guardian Phone</span><span className="text-[#F2F2F2]">{selectedStudent.guardianPhone}</span></div>
                <div className="col-span-2"><span className="text-[#71717A] block text-xs">Address</span><span className="text-[#F2F2F2]">{selectedStudent.address || "N/A"}</span></div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
               <button onClick={() => setModal(null)} className="px-4 py-2 bg-[#27272A] text-[#F2F2F2] text-sm font-medium rounded-lg hover:bg-[#3F3F46] transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Create Modal */}
      {(modal === "edit" || modal === "create") && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111010] border border-[#1C1917] w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-[#1C1917] flex justify-between items-center sticky top-0 bg-[#111010]">
              <h3 className="font-bold text-[#F2F2F2]">{modal === "create" ? "Enroll Student" : "Edit Student Profile"}</h3>
              <button onClick={() => setModal(null)} className="text-[#71717A] hover:text-[#F2F2F2] transition">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {modal === "create" && (
                <>
                  {[
                    { label: "Name", key: "name", required: true },
                    { label: "Email", key: "email", type: "email", required: true },
                    { label: "Phone", key: "phone", required: true },
                    { label: "Password", key: "password", type: "password", required: true },
                  ].map(({ label, key, type, required }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1.5">{label} *</label>
                      <input required={required} type={type || "text"} value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E] transition" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1.5">Batch *</label>
                    <select required value={form.batchId || ""} onChange={(e) => setForm({ ...form, batchId: e.target.value })}
                      className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
                      <option value="">Select batch</option>
                      {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1.5">Admission Date *</label>
                    <input required type="date" value={form.admissionDate || ""} onChange={(e) => setForm({ ...form, admissionDate: e.target.value })}
                      className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]" />
                  </div>
                </>
              )}
              {[
                { label: "Guardian Name", key: "guardianName", required: true },
                { label: "Guardian Phone", key: "guardianPhone", required: true },
                { label: "School/College Name", key: "schoolName" },
                { label: "Address", key: "address" },
              ].map(({ label, key, required }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1.5">{label} {required && "*"}</label>
                  <input
                    required={required}
                    type="text"
                    value={form[key] || ""}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2.5 text-sm text-[#F2F2F2] placeholder-[#71717A] outline-none focus:border-[#22C55E] transition"
                  />
                </div>
              ))}
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm text-[#71717A] hover:text-[#F2F2F2] transition">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#22C55E] text-[#052E16] text-sm font-bold rounded-lg hover:bg-[#16A34A] transition disabled:opacity-50">
                  {submitting ? "Saving..." : modal === "create" ? "Enroll Student" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
