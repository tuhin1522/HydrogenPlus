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
  children,
  footerText,
  footerLinkText,
  footerHref,
}: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 text-foreground">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground">
            EP
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {subtitle}
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="rounded-[32px] border border-border bg-card px-6 py-10 shadow-2xl sm:px-12">
          {children}

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {footerText}{" "}
            <Link href={footerHref} className="font-semibold text-primary transition hover:opacity-80">
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
