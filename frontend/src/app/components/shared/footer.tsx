import Link from "next/link";

const quickLinks = [
  { label: "About us", href: "#about" },
  { label: "Programs", href: "#programs" },
  { label: "Results", href: "#results" },
  { label: "Contact", href: "#contact" },
];

const supportLinks = [
  { label: "Admission Help", href: "#help" },
  { label: "FAQ", href: "#faq" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card text-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.6fr_0.6fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Hydrogen Plus
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-foreground">A modern coaching center for ambitious learners.</h3>
          <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
            From live classes to structured practice and progress tracking, we make learning simpler, smarter, and more motivating.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Quick Links</h4>
          <ul className="mt-4 space-y-3">
            {quickLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-sm text-muted-foreground transition hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Support</h4>
          <ul className="mt-4 space-y-3">
            {supportLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-sm text-muted-foreground transition hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-4 py-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
        © 2026 Hydrogen Plus Coaching Center. All rights reserved.
      </div>
    </footer>
  );
}
