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
} from "@/app/modules/super-admin/services/super-admin.service";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"edit" | "details" | "create" | null>(null);
  const [form, setForm] = useState<any>({});
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllStudents({ search, limit: 100 });
      setStudents(res?.data || []);
    } catch {
      showToast("Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    getAllBatches({ limit: 100 }).then((r) => setBatches(r?.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

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
          <p className="text-sm text-[#71717A] mt-1">View and manage enrolled students</p>
        </div>
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

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-[#71717A] text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search students by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111010] border border-[#1C1917] rounded-lg pl-9 pr-4 py-2 text-sm text-[#F2F2F2] placeholder-[#71717A] outline-none focus:border-[#22C55E] transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#1C1917] bg-[#111010] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1C1917] text-[#71717A] text-xs">
                <th className="px-5 py-3 text-left font-medium uppercase tracking-wider">Student Info</th>
                <th className="px-5 py-3 text-left font-medium uppercase tracking-wider">Guardian</th>
                <th className="px-5 py-3 text-left font-medium uppercase tracking-wider">School/College</th>
                <th className="px-5 py-3 text-left font-medium uppercase tracking-wider">Batch</th>
                <th className="px-5 py-3 text-right font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1917]">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-[#1C1917] rounded animate-pulse" /></td>)}</tr>
                ))
              ) : students.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-16 text-center"><p className="text-[#71717A]">No students found.</p></td></tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id} className="hover:bg-[#1C1917]/20 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#F2F2F2]">{s.user?.name || "N/A"}</p>
                      <p className="text-xs text-[#71717A]">{s.user?.email}</p>
                      <p className="text-xs text-[#71717A]">{s.user?.phone}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[#F2F2F2]">{s.guardianName}</p>
                      <p className="text-xs text-[#71717A]">{s.guardianPhone}</p>
                    </td>
                    <td className="px-5 py-4 text-[#A1A1AA]">{s.schoolName || "N/A"}</td>
                    <td className="px-5 py-4">
                      <p className="text-[#22C55E] font-medium">{s.batch?.name || "N/A"}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openDetails(s.id)} className="px-3 py-1 text-xs border border-[#27272A] text-[#A1A1AA] rounded-lg hover:border-[#3B82F6]/40 hover:text-[#3B82F6] transition">View</button>
                        <button onClick={() => openEdit(s)} className="px-3 py-1 text-xs border border-[#27272A] text-[#A1A1AA] rounded-lg hover:border-[#22C55E]/40 hover:text-[#22C55E] transition">Edit</button>
                        <button onClick={() => handleDelete(s.id)} className="px-3 py-1 text-xs border border-[#27272A] text-[#A1A1AA] rounded-lg hover:border-[#EF4444]/40 hover:text-[#EF4444] transition">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {modal === "details" && selectedStudent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111010] border border-[#1C1917] w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
            <button onClick={() => setModal(null)} className="absolute top-4 right-4 text-[#71717A] hover:text-[#F2F2F2] transition">✕</button>
            <h3 className="font-bold text-[#F2F2F2] mb-4 text-lg">Student Profile Details</h3>
            
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-[#0D0B0A] p-4 rounded-lg border border-[#1C1917]">
                <div><span className="text-[#71717A] block text-xs">Name</span><span className="text-[#F2F2F2]">{selectedStudent.user?.name}</span></div>
                <div><span className="text-[#71717A] block text-xs">Email</span><span className="text-[#F2F2F2]">{selectedStudent.user?.email}</span></div>
                <div><span className="text-[#71717A] block text-xs">Phone</span><span className="text-[#F2F2F2]">{selectedStudent.user?.phone}</span></div>
                <div><span className="text-[#71717A] block text-xs">Admission Date</span><span className="text-[#F2F2F2]">{new Date(selectedStudent.admissionDate).toLocaleDateString()}</span></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 bg-[#0D0B0A] p-4 rounded-lg border border-[#1C1917]">
                <div><span className="text-[#71717A] block text-xs">Guardian Name</span><span className="text-[#F2F2F2]">{selectedStudent.guardianName}</span></div>
                <div><span className="text-[#71717A] block text-xs">Guardian Phone</span><span className="text-[#F2F2F2]">{selectedStudent.guardianPhone}</span></div>
                <div className="col-span-2"><span className="text-[#71717A] block text-xs">Address</span><span className="text-[#F2F2F2]">{selectedStudent.address || "N/A"}</span></div>
              </div>

              <div className="bg-[#0D0B0A] p-4 rounded-lg border border-[#1C1917]">
                 <div><span className="text-[#71717A] block text-xs">Enrolled Batch</span><span className="text-[#22C55E] font-medium">{selectedStudent.batch?.name || "None"}</span></div>
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
