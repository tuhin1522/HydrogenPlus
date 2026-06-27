import Link from "next/link";

export type AuthShellProps = {
  title: string;
  subtitle: string;
  badge?: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerHref: string;
};

export default function AuthShell({
  title,
  subtitle,
  badge = "Secure access",
  children,
  footerText,
  footerLinkText,
  footerHref,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[#081717] text-[#F3F7F6]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:gap-8 lg:px-8 lg:py-8">
        <section className="flex w-full flex-col justify-between rounded-[32px] border border-[#1D3E3E] bg-[linear-gradient(135deg,rgba(183,255,99,0.18),rgba(134,240,92,0.08),rgba(43,202,122,0.16))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:p-8 lg:w-[44%] lg:p-10">
          <div>
            <div className="inline-flex items-center rounded-full border border-[#1D3E3E] bg-[#0A2324]/80 px-3 py-1 text-sm font-medium text-[#86F05C]">
              {badge}
            </div>
            <h1 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl">
              Grow your learning community with confidence.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#A9B7B4]">
              Manage admissions, batches, teachers, exams, and student progress from a single, beautifully designed platform.
            </p>
          </div>

          <div className="mt-8 rounded-[28px] border border-[#1D3E3E] bg-[#0A2324]/90 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B7FF63] via-[#86F05C] to-[#0E8B6E] text-lg font-semibold text-[#081717]">
                EP
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#86F05C]">EduBranch Pro</p>
                <p className="text-sm text-[#A9B7B4]">Enterprise education management</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#1D3E3E] bg-[#081717] p-4">
                <p className="text-2xl font-semibold text-[#F3F7F6]">12K+</p>
                <p className="mt-1 text-sm text-[#A9B7B4]">Students onboarded</p>
              </div>
              <div className="rounded-2xl border border-[#1D3E3E] bg-[#081717] p-4">
                <p className="text-2xl font-semibold text-[#F3F7F6]">99.2%</p>
                <p className="mt-1 text-sm text-[#A9B7B4]">Platform uptime</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex w-full items-center lg:w-[56%]">
          <div className="w-full rounded-[32px] border border-[#1D3E3E] bg-[#0A2324] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.16)] sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#86F05C]">{title}</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{subtitle}</h2>
            </div>
            {children}
            <p className="mt-6 text-center text-sm text-[#A9B7B4]">
              {footerText}{" "}
              <Link href={footerHref} className="font-semibold text-[#86F05C] transition hover:text-[#B7FF63]">
                {footerLinkText}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
