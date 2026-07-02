"use client";

import { useState } from "react";

type ProfileUser = {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  branch?: string;
};

function readStoredUser(): ProfileUser | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem("user");
    if (!stored) return null;
    return JSON.parse(stored) as ProfileUser;
  } catch {
    return null;
  }
}

function getInitialForm(user: ProfileUser | null) {
  return {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "SUPER_ADMIN",
    branch: user?.branch || "Head Office",
  };
}

export default function SuperAdminProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(() => readStoredUser());
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [form, setForm] = useState(() => getInitialForm(readStoredUser()));
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [saved, setSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);

  const initials = (form.name || user?.name || "SA").trim().slice(0, 2).toUpperCase();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const nextUser = { ...user, ...form };
    setUser(nextUser);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("user", JSON.stringify(nextUser));
    }
    setEditing(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const handlePwSave = (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPassword(false);
    setPwSaved(true);
    window.setTimeout(() => setPwSaved(false), 2500);
  };

  if (!user) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          No profile data is available yet.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your super admin account details and security preferences.</p>
      </div>

      {saved && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          ✓ Profile updated successfully.
        </div>
      )}

      {pwSaved && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          ✓ Password changed successfully.
        </div>
      )}

      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-3xl font-bold text-primary">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{form.name || user.name}</h2>
            <p className="text-sm text-muted-foreground">{form.email || user.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {form.role || "SUPER_ADMIN"}
              </span>
              <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
                {form.branch || "Head Office"}
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setEditing((value) => !value)}
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary"
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-semibold text-foreground">Personal Information</h3>
        </div>
        <form onSubmit={handleSave} className="space-y-5 p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={!editing}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={!editing}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                disabled={!editing}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Role</label>
              <input
                type="text"
                value={form.role}
                disabled
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Primary Branch</label>
              <input
                type="text"
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                disabled={!editing}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>
          {editing && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-semibold text-foreground">Change Password</h3>
          <button
            type="button"
            onClick={() => setChangingPassword((value) => !value)}
            className="text-sm font-medium text-primary hover:underline"
          >
            {changingPassword ? "Cancel" : "Change"}
          </button>
        </div>
        {changingPassword ? (
          <form onSubmit={handlePwSave} className="space-y-4 p-6">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Current Password *</label>
              <input
                required
                type="password"
                value={pwForm.current}
                onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">New Password *</label>
              <input
                required
                type="password"
                value={pwForm.newPw}
                onChange={(e) => setPwForm({ ...pwForm, newPw: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Confirm New Password *</label>
              <input
                required
                type="password"
                value={pwForm.confirm}
                onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Update Password
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 text-sm text-muted-foreground">Use a strong password and keep your account secure.</div>
        )}
      </div>
    </div>
  );
}
