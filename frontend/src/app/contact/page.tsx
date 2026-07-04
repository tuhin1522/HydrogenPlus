import Footer from "../components/shared/footer";
import Navbar from "../components/shared/navbar";

const contactPoints = [
  { label: "Admissions", value: "admissions@hydrogenplus.com" },
  { label: "General inquiries", value: "info@hydrogenplus.com" },
  { label: "Phone", value: "+880 1712 000 000" },
  { label: "Office hours", value: "Sunday to Thursday, 9:00 AM - 8:00 PM" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section className="rounded-[32px] border border-border bg-card/80 p-8 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Contact us</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Let’s help you choose the right branch and program.</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            Reach out for course guidance, branch visits, admissions, or any questions about your learning plan.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[28px] border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Contact details</h2>
            <div className="mt-5 space-y-3 text-sm text-muted-foreground">
              {contactPoints.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border bg-secondary/60 p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{item.label}</p>
                  <p className="mt-2">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Visit a branch</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              We welcome parents and students for branch visits and counseling sessions. You can also request a callback and our team will contact you shortly.
            </p>
            <a href="mailto:admissions@hydrogenplus.com" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
              Request a callback
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
