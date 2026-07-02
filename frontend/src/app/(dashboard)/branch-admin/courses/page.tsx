"use client";

import { useState } from "react";

type Course = {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  price: number;
  status: "PUBLISHED" | "DRAFT";
  studentsEnrolled: number;
  thumbnail: string;
};

const MOCK_COURSES: Course[] = [
  { id: "1", title: "SSC Math Complete", subject: "Mathematics", teacher: "Mr. Rafiqul", price: 1500, status: "PUBLISHED", studentsEnrolled: 234, thumbnail: "📐" },
  { id: "2", title: "SSC Physics Full Course", subject: "Physics", teacher: "Ms. Sabrina", price: 1200, status: "PUBLISHED", studentsEnrolled: 187, thumbnail: "⚡" },
  { id: "3", title: "HSC Chemistry Crash", subject: "Chemistry", teacher: "Ms. Sabrina", price: 800, status: "DRAFT", studentsEnrolled: 0, thumbnail: "🧪" },
];

export default function CoursesPage() {
  const [courses] = useState<Course[]>(MOCK_COURSES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [createModal, setCreateModal] = useState(false);

  const filtered = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? c.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Courses</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage branch courses</p>
        </div>
        <button
          onClick={() => setCreateModal(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition"
        >
          + Create Course
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        >
          <option value="">All Status</option>
          <option>PUBLISHED</option>
          <option>DRAFT</option>
        </select>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((course) => (
          <div key={course.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:border-primary/30 transition group">
            {/* Thumbnail */}
            <div className="h-36 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-6xl">
              {course.thumbnail}
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-foreground leading-snug">{course.title}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                    course.status === "PUBLISHED" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                  }`}
                >
                  {course.status}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>📚 {course.subject}</span>
                <span>👤 {course.teacher}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-foreground">৳{course.price}</p>
                  <p className="text-xs text-muted-foreground">{course.studentsEnrolled} enrolled</p>
                </div>
                <div className="flex gap-1.5">
                  <button className="px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary transition">
                    Edit
                  </button>
                  <button
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                      course.status === "DRAFT"
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border border-border text-muted-foreground hover:text-yellow-500 hover:border-yellow-500"
                    }`}
                  >
                    {course.status === "DRAFT" ? "Publish" : "Unpublish"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-3 py-20 text-center text-muted-foreground">
            No courses found.
          </div>
        )}
      </div>

      {/* Create Modal */}
      {createModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-card">
              <h2 className="text-lg font-bold text-foreground">Create New Course</h2>
              <button onClick={() => setCreateModal(false)} className="text-muted-foreground hover:text-foreground text-xl">✕</button>
            </div>
            <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setCreateModal(false); }}>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Course Title *</label>
                <input required type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Subject *</label>
                  <select required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                    <option value="">Select...</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Teacher *</label>
                  <select required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                    <option value="">Select...</option>
                    <option>Mr. Rafiqul Islam</option>
                    <option>Ms. Sabrina Khatun</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Description</label>
                <textarea rows={3} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Price (৳) *</label>
                  <input required type="number" min="0" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Status</label>
                  <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Thumbnail</label>
                <input type="file" accept="image/*" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setCreateModal(false)} className="px-4 py-2 text-sm text-muted-foreground">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90">Create Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
