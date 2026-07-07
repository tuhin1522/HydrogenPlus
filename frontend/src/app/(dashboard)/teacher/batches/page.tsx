"use client";

import { useEffect, useState } from "react";
import { PageShell } from "../../../modules/teacher/components/PageShell";
import { teacherService } from "../../../modules/teacher/services/teacher-service";
import { toast } from "sonner";
import { ContentSkeleton } from "../../../modules/teacher/components/ContentSkeleton";
import Link from "next/link";

export default function TeacherBatchesPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const data = await teacherService.getMyProfile();
        if (mounted && data?.data?.batchSubjects) {
          // Extract unique batches from batchSubjects
          const uniqueBatchesMap = new Map();
          data.data.batchSubjects.forEach((bs: any) => {
            if (bs.batch && !uniqueBatchesMap.has(bs.batch.id)) {
              uniqueBatchesMap.set(bs.batch.id, {
                ...bs.batch,
                assignedSubjects: [],
              });
            }
            if (bs.batch && bs.subject) {
              const batchEntry = uniqueBatchesMap.get(bs.batch.id);
              if (!batchEntry.assignedSubjects.includes(bs.subject.name)) {
                batchEntry.assignedSubjects.push(bs.subject.name);
              }
            }
          });
          setBatches(Array.from(uniqueBatchesMap.values()));
        }
      } catch (error) {
        if (mounted) toast.error("Failed to load batches");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => { mounted = false; };
  }, []);

  return (
    <PageShell
      title="My Batches"
      description="Keep an eye on your assigned batches, student counts, and teaching load."
      badge="Groups"
    >
      {loading ? (
        <ContentSkeleton />
      ) : batches.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {batches.map((batch) => (
            <div key={batch.id} className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{batch.name}</h2>
                  <p className="text-sm text-muted-foreground">{batch.classLevel?.name || "Unknown Class"}</p>
                </div>
                <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {batch.students?.length || 0} learners
                </span>
              </div>
              <div className="mt-4 space-y-2 flex-grow">
                <p className="text-sm text-muted-foreground">Assigned subjects</p>
                <div className="flex flex-wrap gap-2">
                  {batch.assignedSubjects?.map((subjectName: string) => (
                    <span key={subjectName} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                      {subjectName}
                    </span>
                  ))}
                </div>
              </div>
              <Link 
                href={`/teacher/batches/${batch.id}`}
                className="mt-5 flex w-full justify-center rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
              >
                Open batch details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-border/70 bg-card p-8 text-center shadow-sm">
          <p className="text-muted-foreground">No batches assigned yet.</p>
        </div>
      )}
    </PageShell>
  );
}
