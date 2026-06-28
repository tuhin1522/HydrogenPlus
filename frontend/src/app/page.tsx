"use client";

import Footer from "./components/shared/footer";
import Navbar from "./components/shared/navbar";

const highlights = [
  "Live classes for school and college prep",
  "Structured notes, quizzes, and revision plans",
  "Progress tracking for students and parents",
];

const programs = [
  { title: "Science Stream", description: "Physics, Chemistry, Biology, Math with expert mentors." },
  { title: "Commerce Track", description: "Accounting, Business studies, and exam-focused coaching." },
  { title: "English & Skills", description: "Communication, grammar, and confidence-building sessions." },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden transition-colors duration-300 bg-background text-foreground">
      <Navbar />

      <main id="home" className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="grid w-full gap-6 overflow-hidden rounded-[32px] border border-border bg-card/50 p-6 shadow-2xl lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center rounded-full border border-border bg-secondary/80 px-3 py-1 text-sm font-medium text-primary">
              Trusted coaching center platform
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl text-foreground">
              Learn smarter with a modern coaching experience.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 sm:text-lg text-muted-foreground">
              Support every learner with live sessions, exam readiness, and performance insights in a single elegant platform.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/signup" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                Create Account
              </a>
              <a href="/login" className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary">
                Sign In
              </a>
            </div>
          </div>

          <div className="rounded-[28px] border border-border p-5 sm:p-6 bg-card/90">
            <div className="rounded-[24px] border border-border p-4 bg-secondary">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">This month</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-background p-4">
                  <p className="text-3xl font-semibold text-foreground">1,240+</p>
                  <p className="mt-1 text-sm text-muted-foreground">Active learners</p>
                </div>
                <div className="rounded-2xl bg-background p-4">
                  <p className="text-3xl font-semibold text-foreground">96%</p>
                  <p className="mt-1 text-sm text-muted-foreground">Attendance rate</p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-border p-4 bg-background">
                <p className="text-sm text-muted-foreground">Average improvement</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[84%] rounded-full bg-primary" />
                </div>
                <p className="mt-2 text-sm font-semibold text-primary">+18% in monthly test scores</p>
              </div>
            </div>
          </div>
        </section>

        <section id="programs" className="grid w-full gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[28px] border border-border p-6 sm:p-7 bg-card">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Why students choose us</p>
            <h2 className="mt-3 text-2xl font-semibold text-foreground">Everything your coaching center needs in one place.</h2>
            <ul className="mt-5 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-7 text-muted-foreground">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {programs.map((program) => (
              <div key={program.title} className="rounded-[24px] border border-border p-5 transition hover:-translate-y-1 bg-secondary hover:border-primary">
                <h3 className="text-lg font-semibold text-foreground">{program.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{program.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="w-full rounded-[28px] border border-border p-6 sm:p-8 bg-card">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Ready to begin?</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">Join your next batch and grow with confidence.</h2>
            </div>
            <a href="mailto:admissions@hydrogenplus.com" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
              Book a Free Counseling Session
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
