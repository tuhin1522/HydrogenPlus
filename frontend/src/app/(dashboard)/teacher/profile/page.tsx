"use client";

import { useEffect, useState } from "react";
import { PageShell } from "../../../modules/teacher/components/PageShell";
import { EmptyState } from "../../../modules/teacher/components/EmptyState";
import { teacherService } from "../../../modules/teacher/services/teacher-service";
import { toast } from "sonner";
import { ContentSkeleton } from "../../../modules/teacher/components/ContentSkeleton";
import { Eye, EyeOff } from "lucide-react";


export default function TeacherProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    qualification: "",
    specialization: "",
    bio: "",
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
      const data = await teacherService.getMyProfile();
      setProfile(data?.data);
      setFormData({
        qualification: data?.data?.qualification || "",
        specialization: data?.data?.specialization || "",
        bio: data?.data?.bio || "",
      });
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchProfile();
    }
    return () => { mounted = false; };
  }, []);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await teacherService.updateMyProfile(formData);
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
      await teacherService.changePassword({
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
      <PageShell
        title="My Profile"
        description="Manage your teaching profile, qualifications, experience, and secure account details."
        badge="Profile"
      >
        <ContentSkeleton />
      </PageShell>
    );
  }

  if (!profile) {
    return (
      <PageShell
        title="My Profile"
        description="Manage your teaching profile, qualifications, experience, and secure account details."
        badge="Profile"
      >
        <EmptyState title="Profile not found" description="Unable to load your profile details." />
      </PageShell>
    );
  }

  const initials = profile.user?.name ? profile.user.name.substring(0, 2).toUpperCase() : "T";

  return (
    <PageShell
      title="My Profile"
      description="Manage your teaching profile, qualifications, experience, and secure account details."
      badge="Profile"
      actions={
        <button
          onClick={() => setIsEditing(true)}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
        >
          Edit profile
        </button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-semibold text-primary">{initials}</div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{profile.user?.name || "Teacher"}</h2>
              <p className="text-sm text-muted-foreground">{profile.specialization || "Teacher"} · {profile.user?.email}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">Qualification</p>
              <p className="mt-1 font-medium text-foreground">{profile.qualification || "Not specified"}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">Specialization</p>
              <p className="mt-1 font-medium text-foreground">{profile.specialization || "Not specified"}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="mt-1 font-medium text-foreground">{profile.user?.phone || "Not specified"}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">Bio</p>
              <p className="mt-1 font-medium text-foreground">{profile.bio || "No bio available."}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Security</h2>
          <p className="mt-1 text-sm text-muted-foreground">Update your password and keep the account secure.</p>
          <div className="mt-6 space-y-3">
            <div 
              onClick={() => setIsChangingPassword(true)}
              className="rounded-2xl border border-border/60 bg-background/70 p-4 cursor-pointer hover:bg-secondary transition"
            >
              <p className="text-sm font-medium text-foreground">Change password</p>
              <p className="mt-1 text-sm text-muted-foreground">Use a strong password with at least 8 characters.</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4 cursor-not-allowed opacity-70">
              <p className="text-sm font-medium text-foreground">Two-factor verification</p>
              <p className="mt-1 text-sm text-muted-foreground">Coming soon for additional protection.</p>
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
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Qualification</label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full rounded-xl border border-border/70 bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-primary transition"
                  placeholder="e.g. M.Sc in Physics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Specialization</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full rounded-xl border border-border/70 bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-primary transition"
                  placeholder="e.g. Advanced Mechanics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Bio</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full rounded-xl border border-border/70 bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-primary transition resize-none"
                  placeholder="Write a short bio about your teaching style..."
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
