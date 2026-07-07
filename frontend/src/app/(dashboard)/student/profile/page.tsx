"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/app/modules/students/components/PageShell";
import { studentService } from "@/app/modules/students/services/student.service";
import { toast } from "sonner";
import { Users, BookOpen, Clock, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    guardianName: "",
    guardianPhone: "",
    schoolName: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchProfile = async () => {
    try {
      const data = await studentService.getMyProfile();
      if (data?.data) {
        setProfile(data.data);
        setFormData({
          guardianName: data.data.guardianName || "",
          guardianPhone: data.data.guardianPhone || "",
          schoolName: data.data.schoolName || "",
          address: data.data.address || "",
        });
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) fetchProfile();
    return () => { mounted = false; };
  }, []);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await studentService.updateMyProfile(formData);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      await fetchProfile(); // Reload the updated profile
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setPasswordSubmitting(true);
    try {
      await studentService.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
      setIsChangingPassword(false);
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      const responseData = error?.response?.data;
      if (responseData?.errors && responseData.errors.length > 0) {
        toast.error(responseData.errors[0].message);
      } else {
        toast.error(responseData?.message || "Failed to change password");
      }
    } finally {
      setPasswordSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageShell title="My Profile" description="Loading your profile data...">
        <div className="animate-pulse space-y-6">
          <div className="h-48 rounded-3xl bg-card/80 border border-border/70" />
          <div className="h-64 rounded-3xl bg-card/80 border border-border/70" />
        </div>
      </PageShell>
    );
  }

  if (!profile) {
    return (
      <PageShell title="My Profile" description="Could not load your profile data.">
        <div className="rounded-3xl border border-border/70 bg-card p-8 text-center text-muted-foreground">
          Profile data is currently unavailable.
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="My Profile"
      description="Manage your personal information, batch details, and security settings."
      badge="Personal"
    >
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Personal info</h2>
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="mt-1 font-medium text-foreground">{profile.user?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="mt-1 text-foreground">{profile.user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="mt-1 text-foreground">{profile.user?.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Guardian Info</p>
                <p className="mt-1 text-foreground">{profile.guardianName} ({profile.guardianPhone})</p>
              </div>
              {profile.schoolName && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">School</p>
                  <p className="mt-1 text-foreground">{profile.schoolName}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Edit profile
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Academic summary</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <div className="mb-2 text-primary"><Users size={20} /></div>
                <p className="text-sm font-medium text-muted-foreground">Class Level</p>
                <p className="mt-1 font-semibold text-foreground">{profile.batch?.classLevel?.name || "Unknown"}</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <div className="mb-2 text-secondary-foreground"><BookOpen size={20} /></div>
                <p className="text-sm font-medium text-muted-foreground">Assigned Batch</p>
                <p className="mt-1 font-semibold text-foreground">{profile.batch?.name || "Unknown"}</p>
              </div>
            </div>
            
            <div className="mt-6 border-t border-border/70 pt-5">
               <h3 className="text-md font-semibold text-foreground mb-3">Enrolled Subjects</h3>
               <div className="flex flex-wrap gap-2">
                 {profile.batch?.subjects?.map((bs: any) => (
                   <span key={bs.id} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                     {bs.subject?.name}
                   </span>
                 ))}
                 {(!profile.batch?.subjects || profile.batch.subjects.length === 0) && (
                   <p className="text-sm text-muted-foreground">No subjects found.</p>
                 )}
               </div>
            </div>
          </div>
          
          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-500" /> Security
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Keep your account secure.</p>
            
            <div 
              onClick={() => setIsChangingPassword(true)}
              className="mt-5 rounded-2xl border border-border/60 bg-background/70 p-4 cursor-pointer hover:bg-secondary transition"
            >
              <h3 className="font-medium text-foreground">Change password</h3>
              <p className="mt-1 text-sm text-muted-foreground">Update your password to a new one.</p>
              <button className="mt-3 rounded-xl border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted pointer-events-none">
                Update password
              </button>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Edit Profile</h3>
              <button onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Guardian Name</label>
                <input
                  type="text"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  className="w-full rounded-xl border border-border/70 bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-primary transition"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Guardian Phone</label>
                <input
                  type="text"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  className="w-full rounded-xl border border-border/70 bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-primary transition"
                  placeholder="e.g. +1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">School Name</label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full rounded-xl border border-border/70 bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-primary transition"
                  placeholder="e.g. Lincoln High School"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Address</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl border border-border/70 bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-primary transition resize-none"
                  placeholder="Full address details"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/70">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isChangingPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Change Password</h3>
              <button onClick={() => setIsChangingPassword(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Current Password</label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    className="w-full rounded-xl border border-border/70 bg-background px-4 py-2 pr-10 text-sm text-foreground outline-none focus:border-primary transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  >
                    {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full rounded-xl border border-border/70 bg-background px-4 py-2 pr-10 text-sm text-foreground outline-none focus:border-primary transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full rounded-xl border border-border/70 bg-background px-4 py-2 pr-10 text-sm text-foreground outline-none focus:border-primary transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/70">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {passwordSubmitting ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageShell>
  );
}
