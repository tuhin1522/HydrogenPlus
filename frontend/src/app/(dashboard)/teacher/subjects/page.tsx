"use client";

import { useEffect, useState } from "react";
import { PageShell } from "../../../modules/teacher/components/PageShell";
import { teacherService } from "../../../modules/teacher/services/teacher-service";
import { toast } from "sonner";
import { ContentSkeleton } from "../../../modules/teacher/components/ContentSkeleton";

export default function TeacherSubjectsPage() {
  const [batchSubjects, setBatchSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchSubjects = async () => {
      try {
        const data = await teacherService.getMyProfile();
        if (mounted) {
          setBatchSubjects(data?.data?.batchSubjects || []);
          setLoading(false);
        }
      } catch (error) {
        if (mounted) {
          toast.error("Failed to load assigned subjects");
          setLoading(false);
        }
      }
    };
    fetchSubjects();
    return () => { mounted = false; };
  }, []);

  const filteredSubjects = batchSubjects.filter((bs: any) => {
    const subjectName = bs.subject?.name || "";
    const batchName = bs.batch?.name || "";
    const lowerSearch = search.toLowerCase();
    return subjectName.toLowerCase().includes(lowerSearch) || 
           batchName.toLowerCase().includes(lowerSearch);
  });

  return (
    <PageShell
      title="My Subjects"
      description="View the subjects assigned to you and their learner counts."
      badge="Assigned"
      actions={<button className="rounded-xl border border-border/70 px-3 py-2 text-sm font-medium text-foreground">Filter</button>}
    >
      <div className="rounded-3xl border border-border/70 bg-card p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Assigned subjects</h2>
            <p className="text-sm text-muted-foreground">Search, filter, and keep track of your teaching load.</p>
          </div>
          <input
            className="w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm sm:w-64 outline-none focus:border-primary transition"
            placeholder="Search subjects or batches"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <ContentSkeleton />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/70">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted/60 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Subject</th>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Batch</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {filteredSubjects.length > 0 ? (
                  filteredSubjects.map((bs, index) => (
                    <tr key={`${bs.batchId}-${bs.subjectId}-${index}`} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium text-foreground">{bs.subject?.name || "Unknown"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{bs.subject?.code || "N/A"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{bs.batch?.name || "Unknown Batch"}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      No subjects found.
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
