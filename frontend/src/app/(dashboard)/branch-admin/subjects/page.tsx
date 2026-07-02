"use client";

import { useState } from "react";

type Subject = {
  id: string;
  name: string;
  code: string;
  class: string;
  teachersCount: number;
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "1", name: "Mathematics", code: "MATH101", class: "Class 10", teachersCount: 3 },
    { id: "2", name: "Physics", code: "PHY101", class: "Class 10", teachersCount: 2 },
    { id: "3", name: "Chemistry", code: "CHEM101", class: "Class 10", teachersCount: 2 },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subjects</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage subjects and assign them to batches</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition flex items-center gap-2"
        >
          <span>+</span> Create Subject
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border">
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search subjects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
        <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
          <option value="">All Classes</option>
          <option value="Class 9">Class 9</option>
          <option value="Class 10">Class 10</option>
          <option value="Class 11">Class 11</option>
          <option value="Class 12">Class 12</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Subject Name</th>
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium">Class</th>
                <th className="px-6 py-4 font-medium">Assigned Teachers</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((subject) => (
                <tr key={subject.id} className="hover:bg-muted/30 transition">
                  <td className="px-6 py-4 font-medium text-foreground">{subject.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{subject.code}</td>
                  <td className="px-6 py-4 text-muted-foreground">{subject.class}</td>
                  <td className="px-6 py-4 text-muted-foreground">{subject.teachersCount}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-primary hover:underline text-xs font-medium">Assign</button>
                    <button className="text-primary hover:underline text-xs font-medium">Edit</button>
                    <button className="text-destructive hover:underline text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No subjects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {filtered.length} of {subjects.length} entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-border rounded hover:bg-muted transition">Prev</button>
            <button className="px-3 py-1 bg-primary text-primary-foreground rounded">1</button>
            <button className="px-3 py-1 border border-border rounded hover:bg-muted transition">Next</button>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
              <h2 className="text-lg font-bold text-foreground">Create New Subject</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setModalOpen(false); }}>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Subject Name *</label>
                <input required type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Subject Code *</label>
                <input required type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Class *</label>
                <select required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                  <option value="">Select Class...</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90">Save Subject</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
