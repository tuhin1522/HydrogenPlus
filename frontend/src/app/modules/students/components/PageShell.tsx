import Link from "next/link";
import type { ReactNode } from "react";

interface PageShellProps {
  title: string;
  description: string;
  badge?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function PageShell({ title, description, badge, actions, children }: PageShellProps) {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/student" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
              Student dashboard
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-medium text-foreground">{title}</span>
            {badge ? (
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {badge}
              </span>
            ) : null}
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>

      {children}
    </div>
  );
}
