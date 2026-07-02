"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    branchName: "Dhaka Central Branch",
    address: "123 Education Road, Dhaka",
    phone: "+880 2 555 0100",
    email: "dhaka.central@hydrogenplus.com",
    timezone: "Asia/Dhaka",
    currency: "BDT",
    feeReminderDays: "3",
    enableNotifications: true,
    enableEmailAlerts: false,
    sessionStart: "08:00",
    sessionEnd: "20:00",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure branch preferences and system settings</p>
      </div>

      {saved && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-sm text-green-500">
          ✓ Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Branch Information */}
        <section className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Branch Information</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Basic details about your branch</p>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Branch Name</label>
              <input
                type="text"
                value={settings.branchName}
                onChange={(e) => setSettings({ ...settings, branchName: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Contact Phone</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Contact Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>
        </section>

        {/* Regional */}
        <section className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Regional Settings</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              >
                <option value="Asia/Dhaka">Asia/Dhaka (UTC+6)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              >
                <option value="BDT">BDT — Bangladeshi Taka</option>
                <option value="INR">INR — Indian Rupee</option>
                <option value="USD">USD — US Dollar</option>
              </select>
            </div>
          </div>
        </section>

        {/* Session Hours */}
        <section className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Session Hours</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Define the operational hours for class scheduling</p>
          </div>
          <div className="p-6 grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Opening Time</label>
              <input
                type="time"
                value={settings.sessionStart}
                onChange={(e) => setSettings({ ...settings, sessionStart: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Closing Time</label>
              <input
                type="time"
                value={settings.sessionEnd}
                onChange={(e) => setSettings({ ...settings, sessionEnd: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Notifications</h3>
          </div>
          <div className="p-6 space-y-4">
            <ToggleSetting
              label="In-app Notifications"
              description="Show bell notifications inside the dashboard"
              checked={settings.enableNotifications}
              onChange={(v) => setSettings({ ...settings, enableNotifications: v })}
            />
            <ToggleSetting
              label="Email Alerts"
              description="Receive email alerts for important events"
              checked={settings.enableEmailAlerts}
              onChange={(v) => setSettings({ ...settings, enableEmailAlerts: v })}
            />
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Fee Reminder (Days Before Due)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.feeReminderDays}
                onChange={(e) => setSettings({ ...settings, feeReminderDays: e.target.value })}
                className="w-32 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90 transition">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

function ToggleSetting({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none ${checked ? "bg-primary" : "bg-muted"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}
