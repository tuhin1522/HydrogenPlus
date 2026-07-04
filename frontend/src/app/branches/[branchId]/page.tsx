import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../components/shared/footer";
import Navbar from "../../components/shared/navbar";
import { branches } from "../../lib/site-data";

type BranchDetailPageProps = {
  params: Promise<{ branchId: string }>;
};

export default async function BranchDetailPage({ params }: BranchDetailPageProps) {
  const { branchId } = await params;
  const branch = branches.find((item) => item.slug === branchId);

  if (!branch) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section className="rounded-[32px] border border-border bg-card/80 p-8 shadow-xl">
          <Link href="/branches" className="text-sm font-semibold text-primary hover:underline">
            ← Back to all branches
          </Link>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.24em] text-primary">{branch.city}</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{branch.name}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{branch.description}</p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Branch overview</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-secondary/60 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Address</p>
                <p className="mt-2 text-sm text-muted-foreground">{branch.address}</p>
              </div>
              <div className="rounded-2xl border border-border bg-secondary/60 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Contact</p>
                <p className="mt-2 text-sm text-muted-foreground">{branch.contact.phone}</p>
                <p className="text-sm text-muted-foreground">{branch.contact.email}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold">Why students love this branch</h3>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {branch.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-[28px] border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Featured information</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-border p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Batches</p>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  {branch.batches.map((batch) => (
                    <li key={batch}>• {batch}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Classes available</p>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  {branch.classes.map((className) => (
                    <li key={className}>• {className}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Teachers</p>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  {branch.teachers.map((teacher) => (
                    <li key={teacher}>• {teacher}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
