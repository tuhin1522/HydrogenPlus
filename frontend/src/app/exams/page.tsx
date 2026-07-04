import Footer from "../components/shared/footer";
import Navbar from "../components/shared/navbar";
import { exams } from "../lib/site-data";

export default function ExamsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section className="rounded-[32px] border border-border bg-card/80 p-8 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Exams</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Stay updated on upcoming exams and results.</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            Track schedules, review result announcements, and prepare for the next milestone with a clear overview of every exam cycle.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Upcoming assessments</h2>
            <div className="mt-5 space-y-4">
              {exams.filter((exam) => exam.status === "Upcoming").map((exam) => (
                <div key={exam.title} className="rounded-2xl border border-border bg-secondary/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-foreground">{exam.title}</h3>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{exam.status}</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{exam.type} • {exam.branch}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Scheduled for {exam.date}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Recent results</h2>
            <div className="mt-5 space-y-4">
              {exams.filter((exam) => exam.status === "Result Published").map((exam) => (
                <div key={exam.title} className="rounded-2xl border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-foreground">{exam.title}</h3>
                    <span className="rounded-full border border-border px-3 py-1 text-sm font-medium text-muted-foreground">{exam.status}</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{exam.type} • {exam.branch}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{exam.resultSummary}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
