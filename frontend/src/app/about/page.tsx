import Footer from "../components/shared/footer";
import Navbar from "../components/shared/navbar";

const values = [
  "Student-first teaching methods",
  "Transparent communication with parents",
  "Focused preparation for exams and admissions",
  "Modern learning systems and regular progress tracking",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section className="rounded-[32px] border border-border bg-card/80 p-8 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">About us</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">We make coaching organized, motivating, and measurable.</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            Hydrogen Plus is a multi-branch coaching platform created to help students grow through consistent lessons, expert guidance, and clear academic support.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[28px] border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Our mission</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              We believe education becomes powerful when learning is structured, feedback is timely, and every student feels supported. Our team blends experienced mentors, modern systems, and a culture of consistency to create real results.
            </p>
          </div>

          <div className="rounded-[28px] border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">What makes us different</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {values.map((value) => (
                <li key={value} className="flex items-start gap-2">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-primary" />
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
