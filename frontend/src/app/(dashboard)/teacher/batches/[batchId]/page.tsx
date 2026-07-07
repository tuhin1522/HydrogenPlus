"use client";

import { useEffect, useState, use } from "react";
import { PageShell } from "../../../../modules/teacher/components/PageShell";
import { teacherService } from "../../../../modules/teacher/services/teacher-service";
import { toast } from "sonner";
import { ContentSkeleton } from "../../../../modules/teacher/components/ContentSkeleton";
import Link from "next/link";
import { ArrowLeft, Users, BookOpen, Clock } from "lucide-react";

export default function BatchDetailsPage({ params }: { params: Promise<{ batchId: string }> }) {
  const { batchId } = use(params);
  const [batchData, setBatchData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchBatchDetails = async () => {
      try {
        const data = await teacherService.getMyProfile();
        if (mounted && data?.data?.batchSubjects) {
          // Find the specific batch
          const batchSubjects = data.data.batchSubjects.filter(
            (bs: any) => bs.batchId === batchId
          );

          if (batchSubjects.length > 0) {
            const batch = batchSubjects[0].batch;
            const assignedSubjects = batchSubjects.map((bs: any) => bs.subject?.name).filter(Boolean);

            setBatchData({
              ...batch,
              assignedSubjects,
            });
          } else {
            toast.error("Batch not found or not assigned to you.");
          }
        }
      } catch (error) {
        if (mounted) toast.error("Failed to load batch details");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchBatchDetails();
    return () => { mounted = false; };
  }, [batchId]);

  if (loading) {
    return (
      <PageShell title="Batch Details" description="Loading batch information...">
        <ContentSkeleton />
      </PageShell>
    );
  }

  if (!batchData) {
    return (
      <PageShell title="Batch Details" description="View detailed information about your batch.">
        <div className="rounded-3xl border border-border/70 bg-card p-8 text-center shadow-sm">
          <p className="text-muted-foreground mb-4">Batch not found or you don't have access to it.</p>
          <Link href="/teacher/batches" className="text-primary hover:underline">
            &larr; Back to Batches
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={batchData.name}
      description={`Class: ${batchData.classLevel?.name || "Unknown"} | Capacity: ${batchData.capacity}`}
      badge={batchData.status || "ACTIVE"}
    >
      <div className="mb-6">
        <Link href="/teacher/batches" className="text-sm font-medium text-muted-foreground hover:text-primary transition flex items-center gap-2 w-fit">
          <ArrowLeft size={16} /> Back to Batches
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Enrolled Students</p>
            <h3 className="text-2xl font-bold text-foreground">{batchData.students?.length || 0}</h3>
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">My Subjects</p>
            <h3 className="text-2xl font-bold text-foreground">{batchData.assignedSubjects?.length || 0}</h3>
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-medium text-muted-foreground mb-2">Subjects List</p>
          <div className="flex flex-wrap gap-2">
            {batchData.assignedSubjects?.map((subjectName: string) => (
              <span key={subjectName} className="rounded-full bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground">
                {subjectName}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border/70 bg-card shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-border/70">
          <h2 className="text-lg font-semibold text-foreground">Student Roster</h2>
          <p className="text-sm text-muted-foreground">All students currently enrolled in this batch.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/60 text-left text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium">Guardian</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {batchData.students && batchData.students.length > 0 ? (
                batchData.students.map((student: any) => (
                  <tr key={student.id} className="hover:bg-muted/30 transition">
                    <td className="px-6 py-4 font-medium text-foreground">{student.user?.name || "Unknown"}</td>
                    <td className="px-6 py-4 text-muted-foreground">{student.user?.email || "N/A"}</td>
                    <td className="px-6 py-4 text-muted-foreground">{student.user?.phone || "N/A"}</td>
                    <td className="px-6 py-4 text-muted-foreground">{student.guardianName || "N/A"}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-sm font-medium text-primary hover:underline">View</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No students currently enrolled in this batch.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
