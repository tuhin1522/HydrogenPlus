import Link from "next/link";

type FooterProps = {
  theme: "dark" | "light";
};

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

export default function Footer({ theme }: FooterProps) {
  const isDark = theme === "dark";
  const shell = isDark
    ? "border-[#1D3E3E] bg-[#081717] text-[#F3F7F6]"
    : "border-[#D7ECE4] bg-[#F8FFF9] text-[#081717]";
  const muted = isDark ? "text-[#A9B7B4]" : "text-[#4B5A58]";
  const accent = isDark ? "text-[#86F05C]" : "text-[#0E8B6E]";

  return (
    <footer className={`border-t ${shell}`}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.6fr_0.6fr] lg:px-8">
        <div>
          <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${accent}`}>
            EduBranch Pro
          </p>
          <h3 className="mt-3 text-2xl font-semibold">A modern coaching center for ambitious learners.</h3>
          <p className="mt-3 max-w-md text-sm leading-7 text-[#A9B7B4]">
            From live classes to structured practice and progress tracking, we make learning simpler, smarter, and more motivating.
          </p>
        </div>

        <div>
          <h4 className={`text-sm font-semibold uppercase tracking-[0.2em] ${accent}`}>Quick Links</h4>
          <ul className="mt-4 space-y-3">
            {quickLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-sm text-[#A9B7B4] transition hover:text-[#F3F7F6]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className={`text-sm font-semibold uppercase tracking-[0.2em] ${accent}`}>Support</h4>
          <ul className="mt-4 space-y-3">
            {supportLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-sm text-[#A9B7B4] transition hover:text-[#F3F7F6]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`border-t px-4 py-4 text-center text-sm ${muted} sm:px-6 lg:px-8`}>
        © 2026 EduBranch Pro. All rights reserved.
      </div>
    </footer>
  );
}
