"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "../../../modules/teacher/components/PageShell";
import { teacherService } from "../../../modules/teacher/services/teacher-service";
import { toast } from "sonner";
import { ContentSkeleton } from "../../../modules/teacher/components/ContentSkeleton";

function TeacherStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const searchParam = searchParams.get("search") || "";
  const [search, setSearch] = useState(searchParam);

  useEffect(() => {
    if (searchParam) {
      setSearch(searchParam);
    }
  }, [searchParam]);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        const data = await teacherService.getMyProfile();
        if (mounted && data?.data?.batchSubjects) {
          const uniqueStudentsMap = new Map();
          
          data.data.batchSubjects.forEach((bs: any) => {
            if (bs.batch && bs.batch.students) {
              bs.batch.students.forEach((student: any) => {
                if (!uniqueStudentsMap.has(student.id)) {
                  uniqueStudentsMap.set(student.id, {
                    ...student,
                    batchName: bs.batch.name,
                    classLevelName: bs.batch.classLevel?.name || "Unknown",
                  });
                }
              });
            }
          });
          
          setStudents(Array.from(uniqueStudentsMap.values()));
        }
      } catch (error) {
        if (mounted) toast.error("Failed to load students");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => { mounted = false; };
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      student.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      student.batchName?.toLowerCase().includes(search.toLowerCase()) ||
      student.classLevelName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageShell
      title="Students"
      description="Monitor student progress, attendance, and performance across your assigned batches."
      badge="Assigned"
      actions={<button className="rounded-xl border border-border/70 px-3 py-2 text-sm font-medium text-foreground">Export</button>}
    >
      <div className="rounded-3xl border border-border/70 bg-card p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Student roster</h2>
            <p className="text-sm text-muted-foreground">Only students from your assigned batches are visible here.</p>
          </div>
          <div className="flex gap-2">
            <input 
              className="w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm sm:w-56 outline-none focus:border-primary transition" 
              placeholder="Search students or batches" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="rounded-xl border border-border/70 px-3 py-2 text-sm font-medium text-foreground">Filter</button>
          </div>
        </div>
        
        {loading ? (
          <ContentSkeleton />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border/70">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted/60 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Class</th>
                  <th className="px-4 py-3 font-medium">Batch</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Guardian</th>
                  <th className="px-4 py-3 font-medium">Attendance</th>
                  <th className="px-4 py-3 font-medium">Marks</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium text-foreground">{student.user?.name || "Unknown"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{student.classLevelName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{student.batchName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{student.user?.phone || "N/A"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{student.guardianName || "N/A"}</td>
                      <td className="px-4 py-3 text-muted-foreground">TBD</td>
                      <td className="px-4 py-3 text-muted-foreground">TBD</td>
                      <td className="px-4 py-3 text-muted-foreground">Active</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageShell>
  );
}

export default function TeacherStudentsPageWrapper() {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <TeacherStudentsPage />
    </Suspense>
  );
}
