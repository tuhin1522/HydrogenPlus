"use client";

import { useState } from "react";

export default function RoutinePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Weekly Routine</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage weekly class timetable and rooms</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition flex items-center gap-2"
        >
          <span>🗓️</span> Create Schedule
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border">
        <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary w-full max-w-xs">
          <option value="">Select Batch...</option>
          <option value="Morning Batch A">Morning Batch A</option>
          <option value="Evening Batch B">Evening Batch B</option>
        </select>
        <button className="px-4 py-2 bg-secondary text-foreground text-sm font-medium rounded-lg hover:bg-muted transition">
          Download PDF
        </button>
      </div>

      {/* Routine Grid */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid border-b border-border" style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}>
              <div className="px-2 py-3 bg-muted/50 border-r border-border text-xs font-semibold text-muted-foreground uppercase text-center">Time</div>
              {DAYS.map(day => (
                <div key={day} className="px-2 py-3 bg-muted/50 border-r border-border last:border-r-0 text-xs font-semibold text-foreground uppercase text-center truncate">
                  {day}
                </div>
              ))}
            </div>

            {/* Time Slots */}
            {HOURS.map((hour) => (
              <div key={hour} className="grid border-b border-border last:border-b-0" style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}>
                <div className="px-2 py-4 bg-muted/20 border-r border-border text-xs text-muted-foreground flex items-center justify-center">
                  {hour}
                </div>
                {DAYS.map(day => (
                  <div key={`${day}-${hour}`} className="p-2 border-r border-border last:border-r-0 min-h-[80px] group relative hover:bg-muted/10 transition-colors">
                    {/* Placeholder for random schedule item */}
                    {Math.random() > 0.8 && (
                      <div className="bg-primary/10 border border-primary/20 rounded p-2 h-full">
                        <p className="text-[10px] font-bold text-primary truncate">Math (Batch A)</p>
                        <p className="text-[10px] text-muted-foreground truncate">Room 101 • Mr. John</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
              <h2 className="text-lg font-bold text-foreground">Schedule a Class</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setModalOpen(false); }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Batch *</label>
                  <select required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                    <option value="">Select...</option>
                    <option value="A">Batch A</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Subject *</label>
                  <select required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                    <option value="">Select...</option>
                    <option value="M">Mathematics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Teacher *</label>
                  <select required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                    <option value="">Select...</option>
                    <option value="1">Mr. Smith</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Room *</label>
                  <input required type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Day *</label>
                  <select required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Start *</label>
                  <input required type="time" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">End *</label>
                  <input required type="time" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90">Save Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
