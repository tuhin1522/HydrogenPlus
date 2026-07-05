"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { swalConfirm, swalError, swalSuccess } from "@/app/lib/swal";
import { branchAdminService } from "../../../modules/branch-admin/services/branch-admin.service";

type Teacher = {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  user?: { name?: string; email?: string };
  qualification?: string;
  experience?: number;
  specialization?: string;
  bio?: string;
  batchSubjects?: { subject?: { name?: string }; batch?: { name?: string } }[];
};

function getName(t: Teacher) {
  if (t.user?.name) return t.user.name;
  return [t.firstName, t.lastName].filter(Boolean).join(" ") || "—";
}

const TABS = ["All Teachers", "Assign Subjects", "Performance"];

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("All Teachers");
  const [search, setSearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", branchId: "", qualification: "", experience: "", specialization: "", bio: "" });
  const [branches, setBranches] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [batchesList, setBatchesList] = useState<any[]>([]);

  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedTeacherProfile, setSelectedTeacherProfile] = useState<Teacher | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: "",
    qualification: "",
    experience: "",
    specialization: "",
    bio: "",
  });

  const loadTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await branchAdminService.getTeachers();
      setTeachers(res?.teachers || res?.data || []);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load teachers.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTeachers();
    void branchAdminService.getBranches().then((r) => {
      setBranches(r?.branches || r?.data || []);
    }).catch(() => {});
    void branchAdminService.getSubjects().then((r) => setSubjects(r?.subjects || r?.data || [])).catch(() => {});
    void branchAdminService.getBatches().then((r) => setBatchesList(r?.batches || r?.data || [])).catch(() => {});
  }, [loadTeachers]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    if (type === "error") toast.error(msg);
    else toast.success(msg);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const userRes = await branchAdminService.createUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: "TEACHER",
      });
      await branchAdminService.createTeacher({
        userId: userRes.data.id,
        branchId: form.branchId,
        qualification: form.qualification || null,
        experience: form.experience ? Number(form.experience) : null,
        specialization: form.specialization || null,
        bio: form.bio || null,
      });
      await swalSuccess({ title: "Teacher created", text: "The teacher account was created successfully." });
      showToast("Teacher created!");
      setAddModalOpen(false);
      setForm({ name: "", email: "", phone: "", password: "", branchId: "", qualification: "", experience: "", specialization: "", bio: "" });
      await loadTeachers();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to add teacher.";
      await swalError({ title: "Operation failed", text: message });
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await swalConfirm({ title: "Delete this teacher profile?", text: "This action cannot be undone." });
    if (!confirmed) return;
    try {
      await branchAdminService.deleteTeacher(id);
      await swalSuccess({ title: "Teacher deleted", text: "The teacher profile was removed successfully." });
      showToast("Teacher deleted.");
      await loadTeachers();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete.";
      await swalError({ title: "Delete failed", text: message });
      showToast(message, "error");
    }
  };

  const openTeacherProfile = (teacher: Teacher) => {
    setSelectedTeacherProfile(teacher);
    setProfileModalOpen(true);
  };

  const openTeacherEdit = (teacher: Teacher) => {
    setSelectedTeacherProfile(teacher);
    setEditForm({
      id: teacher.id,
      qualification: teacher.qualification || "",
      experience: teacher.experience?.toString() || "",
      specialization: teacher.specialization || "",
      bio: teacher.bio || "",
    });
    setProfileModalOpen(false);
    setEditModalOpen(true);
  };

  const handleUpdateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      const payload: Record<string, unknown> = {};

      if (editForm.qualification.trim()) {
        payload.qualification = editForm.qualification.trim();
      } else {
        payload.qualification = null;
      }

      if (editForm.experience.trim()) {
        payload.experience = Number(editForm.experience);
      } else {
        payload.experience = null;
      }

      if (editForm.specialization.trim()) {
        payload.specialization = editForm.specialization.trim();
      } else {
        payload.specialization = null;
      }

      if (editForm.bio.trim()) {
        payload.bio = editForm.bio.trim();
      } else {
        payload.bio = null;
      }

      await branchAdminService.updateTeacher(editForm.id, payload);
      await swalSuccess({ title: "Teacher updated", text: "The teacher profile was updated successfully." });
      showToast("Teacher profile updated!");
      setEditModalOpen(false);
      await loadTeachers();
    } catch (e: any) {
      const message = e?.response?.data?.message || "Failed to update teacher.";
      await swalError({ title: "Update failed", text: message });
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = teachers.filter((t) => {
    const name = getName(t).toLowerCase();
    const email = (t.user?.email || "").toLowerCase();
    return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
  });

  const getSubjects = (t: Teacher) => {
    const names = (t.batchSubjects || []).map((bs) => bs.subject?.name).filter(Boolean);
    return Array.from(new Set(names)) as string[];
  };

  const getBatches = (t: Teacher) => {
    const names = (t.batchSubjects || []).map((bs) => bs.batch?.name).filter(Boolean);
    return Array.from(new Set(names)) as string[];
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teachers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage teachers, subjects and performance</p>
        </div>
        <button onClick={() => setAddModalOpen(true)} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition">
          + Add Teacher
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition ${activeTab === tab ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {tab}
          </button>
        ))}
      </div>

      {error && <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm">{error}</div>}

      {activeTab === "All Teachers" && (
        <>
          <div className="bg-card border border-border rounded-xl p-4 flex gap-3">
            <input type="text" placeholder="Search teachers..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 max-w-sm bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
            <button onClick={loadTeachers} className="px-3 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-secondary transition">↻</button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((teacher) => {
                const name = getName(teacher);
                const subjects = getSubjects(teacher);
                const batches = getBatches(teacher);
                return (
                  <div key={teacher.id} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/40 transition">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{name}</h3>
                        <p className="text-xs text-muted-foreground truncate">{teacher.user?.email || teacher.phone || "—"}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      {subjects.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {subjects.map((s) => <span key={s} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{s}</span>)}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {batches.length > 0 ? `Batches: ${batches.join(", ")}` : "No batches assigned"}
                      </p>
                    </div>
                    <div className="mt-4 flex gap-2 pt-4 border-t border-border">
                      <button onClick={() => openTeacherProfile(teacher)} className="flex-1 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary transition">Profile</button>
                      <button onClick={() => openTeacherEdit(teacher)} className="flex-1 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary transition">Edit</button>
                      <button onClick={() => handleDelete(teacher.id)} className="flex-1 py-1.5 text-xs border border-destructive/30 rounded-lg text-destructive/70 hover:text-destructive hover:border-destructive transition">Remove</button>
                    </div>
                  </div>
                );
              })}
              {!loading && filtered.length === 0 && (
                <div className="col-span-3 py-16 text-center text-muted-foreground">No teachers found.</div>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === "Assign Subjects" && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <p className="text-sm text-muted-foreground">Assign subjects and batches to teachers from this panel.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-muted-foreground uppercase">Select Teacher</label>
              <select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                <option value="">Select teacher...</option>
                {teachers.map((t) => <option key={t.id} value={t.id}>{getName(t)}</option>)}
              </select>

              <label className="block text-xs font-semibold text-muted-foreground uppercase">Select Subject</label>
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                <option value="">Select subject...</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>

              <label className="block text-xs font-semibold text-muted-foreground uppercase">Select Batch</label>
              <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                <option value="">Select batch...</option>
                {batchesList.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>

              <button onClick={async () => {
                if (!selectedTeacher || !selectedSubject || !selectedBatch) {
                  await swalError({ title: "Missing selection", text: "Please select teacher, subject and batch." });
                  return;
                }
                try {
                  setSubmitting(true);
                  await branchAdminService.createBatchSubject({ teacherId: selectedTeacher, subjectId: selectedSubject, batchId: selectedBatch });
                  const subjectName = subjects.find((s) => s.id === selectedSubject)?.name || "Subject";
                  const batchName = batchesList.find((b) => b.id === selectedBatch)?.name || "Batch";
                  setTeachers((prev) => prev.map((teacher) => teacher.id === selectedTeacher
                    ? {
                        ...teacher,
                        batchSubjects: [
                          ...(teacher.batchSubjects || []),
                          { subject: { name: subjectName }, batch: { name: batchName } },
                        ],
                      }
                    : teacher));
                  await swalSuccess({ title: "Assigned", text: "Subject assigned to teacher successfully." });
                  showToast("Assignment saved");
                  setSelectedSubject("");
                  setSelectedBatch("");
                  setSelectedTeacher("");
                  await loadTeachers();
                } catch (err: unknown) {
                  const anyErr: any = err;
                  const message = anyErr?.response?.data?.message || (err instanceof Error ? err.message : "Failed to assign subject.");
                  await swalError({ title: "Assignment failed", text: message });
                  showToast(message, "error");
                } finally {
                  setSubmitting(false);
                }
              }} className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition">{submitting ? "Saving..." : "Save Assignment"}</button>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Current Assignments</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {teachers.flatMap((t) => getSubjects(t).map((sub) => (
                  <div key={`${t.id}-${sub}`} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">{getName(t)}</p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                  </div>
                )))}
                {teachers.every((t) => getSubjects(t).length === 0) && (
                  <p className="text-sm text-muted-foreground">No assignments yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Performance" && (
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />)
          ) : teachers.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">No teachers found.</p>
          ) : (
            teachers.map((teacher) => {
              const name = getName(teacher);
              const subjects = getSubjects(teacher);
              const batches = getBatches(teacher);
              return (
                <div key={teacher.id} className="bg-card border border-border rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{name}</p>
                      <p className="text-xs text-muted-foreground">{subjects.join(", ") || "No subjects assigned"}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-lg font-bold text-foreground">{batches.length}</p>
                      <p className="text-xs text-muted-foreground">Batches</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-lg font-bold text-foreground">{subjects.length}</p>
                      <p className="text-xs text-muted-foreground">Subjects</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {profileModalOpen && selectedTeacherProfile && (
        <Modal title="Teacher Details" onClose={() => setProfileModalOpen(false)}>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{getName(selectedTeacherProfile)}</h3>
              <p className="text-sm text-muted-foreground">{selectedTeacherProfile.user?.email || selectedTeacherProfile.phone || "—"}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Phone</p>
                <p className="text-foreground font-medium mt-0.5">{selectedTeacherProfile.phone || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Assignments</p>
                <p className="text-foreground font-medium mt-0.5">{getSubjects(selectedTeacherProfile).length}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Qualifications</p>
              <p className="text-foreground font-medium">{selectedTeacherProfile.qualification || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Experience</p>
              <p className="text-foreground font-medium">{selectedTeacherProfile.experience ? `${selectedTeacherProfile.experience} years` : "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Specialization</p>
              <p className="text-foreground font-medium">{selectedTeacherProfile.specialization || "—"}</p>
            </div>
            {selectedTeacherProfile.bio && (
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Bio</p>
                <p className="text-foreground text-sm">{selectedTeacherProfile.bio}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Subjects</p>
              <div className="flex flex-wrap gap-2">
                {getSubjects(selectedTeacherProfile).length > 0 ? getSubjects(selectedTeacherProfile).map((subject) => (
                  <span key={subject} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{subject}</span>
                )) : <span className="text-sm text-muted-foreground">No subjects assigned</span>}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Batches</p>
              <div className="flex flex-wrap gap-2">
                {getBatches(selectedTeacherProfile).length > 0 ? getBatches(selectedTeacherProfile).map((batch) => (
                  <span key={batch} className="bg-secondary text-foreground text-xs px-2 py-0.5 rounded-full">{batch}</span>
                )) : <span className="text-sm text-muted-foreground">No batches assigned</span>}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => openTeacherEdit(selectedTeacherProfile)} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition">
                Edit Profile
              </button>
            </div>
          </div>
        </Modal>
      )}

      {editModalOpen && selectedTeacherProfile && (
        <Modal title="Edit Teacher Profile" onClose={() => setEditModalOpen(false)}>
          <form className="space-y-4" onSubmit={handleUpdateTeacher}>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Qualification</label>
              <input
                type="text"
                value={editForm.qualification}
                onChange={(e) => setEditForm({ ...editForm, qualification: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Experience (Years)</label>
              <input
                type="number"
                value={editForm.experience}
                onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Specialization</label>
              <input
                type="text"
                value={editForm.specialization}
                onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Bio</label>
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50">
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Teacher Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-card">
              <h2 className="text-lg font-bold text-foreground">Create Teacher</h2>
              <button onClick={() => setAddModalOpen(false)} className="text-muted-foreground hover:text-foreground text-xl">✕</button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleCreate}>
              {[
                { label: "Full Name", key: "name", required: true },
                { label: "Email", key: "email", type: "email", required: true },
                { label: "Phone", key: "phone", required: true },
                { label: "Password", key: "password", type: "password", required: true },
              ].map(({ label, key, type, required }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{label} *</label>
                  <input required={required} type={type || "text"} value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Branch *</label>
                <select required value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                  <option value="">Select branch</option>
                  {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              {[
                { label: "Qualification", key: "qualification" },
                { label: "Experience", key: "experience", type: "number" },
                { label: "Specialization", key: "specialization" },
                { label: "Bio", key: "bio" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{label}</label>
                  <input type={type || "text"} value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
                </div>
              ))}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setAddModalOpen(false)} className="px-4 py-2 text-sm text-muted-foreground">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50">
                  {submitting ? "Creating..." : "Create Teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
