import Link from "next/link";
import Footer from "../components/shared/footer";
import Navbar from "../components/shared/navbar";
import { branches } from "../lib/site-data";

export default function BranchesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section className="rounded-[32px] border border-border bg-card/80 p-8 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Our branches</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Find the right learning center for your goals.</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            Every branch is designed to provide structured classes, expert teachers, and a supportive environment for academic growth.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {branches.map((branch) => (
            <article key={branch.id} className="flex h-full flex-col rounded-[28px] border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{branch.city}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-foreground">{branch.name}</h2>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-primary">Open</span>
              </div>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">{branch.tagline}</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{branch.description}</p>

              <div className="mt-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">Popular batches</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {branch.batches.slice(0, 3).map((batch) => (
                    <li key={batch} className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                      <span>{batch}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/branches/${branch.slug}`} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                  View branch details
                </Link>
                <span className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
                  {branch.contact.hours}
                </span>
              </div>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
