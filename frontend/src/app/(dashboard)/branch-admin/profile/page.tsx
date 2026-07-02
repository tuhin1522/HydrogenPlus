"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", branch: "Dhaka Central Branch" });
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [saved, setSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setForm({ name: parsed.name || "", email: parsed.email || "", phone: parsed.phone || "", branch: "Dhaka Central Branch" });
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePwSave = (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPassword(false);
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 3000);
  };

  if (!user) return null;

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your branch admin account information</p>
      </div>

      {/* Avatar & Overview */}
      <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-5">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-2 border-primary/20">
          {(form.name || "B").charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{form.name || user.name}</h2>
          <p className="text-sm text-muted-foreground">{form.email || user.email}</p>
          <span className="mt-2 inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
            Branch Admin
          </span>
        </div>
      </div>

      {saved && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-sm text-green-500">
          ✓ Profile updated successfully!
        </div>
      )}

      {pwSaved && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-sm text-green-500">
          ✓ Password changed successfully!
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Personal Information</h3>
          <button
            onClick={() => setEditing(!editing)}
            className="text-sm text-primary hover:underline font-medium"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={!editing}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={!editing}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                disabled={!editing}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Branch</label>
              <input
                type="text"
                value={form.branch}
                disabled
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>
          {editing && (
            <div className="flex justify-end">
              <button type="submit" className="px-5 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90">
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Change Password</h3>
          <button
            onClick={() => setChangingPassword(!changingPassword)}
            className="text-sm text-primary hover:underline font-medium"
          >
            {changingPassword ? "Cancel" : "Change"}
          </button>
        </div>
        {changingPassword ? (
          <form onSubmit={handlePwSave} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Current Password *</label>
              <input
                required
                type="password"
                value={pwForm.current}
                onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">New Password *</label>
              <input
                required
                type="password"
                value={pwForm.newPw}
                onChange={(e) => setPwForm({ ...pwForm, newPw: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Confirm New Password *</label>
              <input
                required
                type="password"
                value={pwForm.confirm}
                onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-5 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90">
                Update Password
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <p className="text-sm text-muted-foreground">••••••••••••</p>
          </div>
        )}
      </div>
    </div>
  );
}
