"use client";

import { useState } from "react";

type Exam = {
  id: string;
  title: string;
  subject: string;
  batch: string;
  scheduledAt: string;
  duration: number;
  totalMarks: number;
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
};

const MOCK_EXAMS: Exam[] = [
  { id: "1", title: "Mid-Term Math Exam", subject: "Mathematics", batch: "Morning A", scheduledAt: "2025-08-10 10:00", duration: 180, totalMarks: 100, status: "UPCOMING" },
  { id: "2", title: "Physics Unit Test", subject: "Physics", batch: "Evening B", scheduledAt: "2025-07-28 14:00", duration: 90, totalMarks: 50, status: "COMPLETED" },
  { id: "3", title: "Chemistry Final", subject: "Chemistry", batch: "Morning A", scheduledAt: "2025-09-15 09:00", duration: 180, totalMarks: 100, status: "UPCOMING" },
];

const STATUS_COLORS: Record<string, string> = {
  UPCOMING: "bg-blue-500/10 text-blue-500",
  COMPLETED: "bg-green-500/10 text-green-500",
  CANCELLED: "bg-red-500/10 text-red-500",
};

const TABS = ["Exam Schedule", "Question Bank", "Results"];

export default function ExamsPage() {
  const [exams] = useState<Exam[]>(MOCK_EXAMS);
  const [activeTab, setActiveTab] = useState("Exam Schedule");
  const [createModal, setCreateModal] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Exams</h1>
          <p className="text-sm text-muted-foreground mt-1">Schedule exams, manage questions and view results</p>
        </div>
        <button
          onClick={() => setCreateModal(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition"
        >
          + Create Exam
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition ${
              activeTab === tab
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Exam Schedule" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[700px]">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs border-b border-border">
                <tr>
                  <th className="px-5 py-3 font-medium">Exam Title</th>
                  <th className="px-5 py-3 font-medium">Subject</th>
                  <th className="px-5 py-3 font-medium">Batch</th>
                  <th className="px-5 py-3 font-medium">Scheduled</th>
                  <th className="px-5 py-3 font-medium">Duration</th>
                  <th className="px-5 py-3 font-medium">Marks</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {exams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-muted/30 transition">
                    <td className="px-5 py-4 font-medium text-foreground">{exam.title}</td>
                    <td className="px-5 py-4 text-muted-foreground">{exam.subject}</td>
                    <td className="px-5 py-4 text-muted-foreground">{exam.batch}</td>
                    <td className="px-5 py-4 text-muted-foreground text-xs">{exam.scheduledAt}</td>
                    <td className="px-5 py-4 text-muted-foreground">{exam.duration} min</td>
                    <td className="px-5 py-4 text-muted-foreground">{exam.totalMarks}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[exam.status]}`}>
                        {exam.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button className="text-xs text-primary hover:underline">View</button>
                      <button className="text-xs text-muted-foreground hover:text-destructive">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Question Bank" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Manage MCQ and written questions</p>
            <button className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary/90">+ Add Question</button>
          </div>
          <div className="space-y-3">
            {["What is the formula for kinetic energy?", "Solve: 2x + 5 = 15", "Explain Newton's 3rd law"].map((q, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-xs bg-muted text-muted-foreground rounded px-2 py-0.5 mt-0.5 shrink-0">MCQ</span>
                  <p className="text-sm text-foreground">{q}</p>
                </div>
                <div className="flex gap-2 shrink-0 ml-4">
                  <button className="text-xs text-primary hover:underline">Edit</button>
                  <button className="text-xs text-destructive hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Results" && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-4">Leaderboard — Physics Unit Test</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="border-b border-border text-muted-foreground text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { rank: 1, name: "Arif Hossain", score: 48, grade: "A+" },
                    { rank: 2, name: "Fatema Akter", score: 45, grade: "A" },
                    { rank: 3, name: "Tanvir Ahmed", score: 40, grade: "A" },
                  ].map((r) => (
                    <tr key={r.rank} className="hover:bg-muted/30 transition">
                      <td className="px-4 py-3">
                        <span className={`font-bold ${r.rank === 1 ? "text-yellow-500" : r.rank === 2 ? "text-slate-400" : "text-orange-500"}`}>
                          #{r.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.score}/50</td>
                      <td className="px-4 py-3">
                        <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full text-xs font-medium">{r.grade}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Exam Modal */}
      {createModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-card">
              <h2 className="text-lg font-bold text-foreground">Create Exam</h2>
              <button onClick={() => setCreateModal(false)} className="text-muted-foreground hover:text-foreground text-xl">✕</button>
            </div>
            <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setCreateModal(false); }}>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Exam Title *</label>
                <input required type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Subject *</label>
                  <select required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                    <option value="">Select...</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Batch *</label>
                  <select required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                    <option value="">Select...</option>
                    <option>Morning A</option>
                    <option>Evening B</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Date & Time *</label>
                  <input required type="datetime-local" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Duration (min) *</label>
                  <input required type="number" min="10" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Total Marks *</label>
                <input required type="number" min="1" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setCreateModal(false)} className="px-4 py-2 text-sm text-muted-foreground">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90">Create Exam</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
