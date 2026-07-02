import type { ReactNode } from "react";
import { PageShell } from "./PageShell";

interface ModulePageProps {
  title: string;
  description: string;
  badge?: string;
  highlight: string;
  items: string[];
  metrics?: Array<{ label: string; value: string }>;
  actions?: ReactNode;
  footer?: ReactNode;
}

export function ModulePage({
  title,
  description,
  badge,
  highlight,
  items,
  metrics,
  actions,
  footer,
}: ModulePageProps) {
  return (
    <PageShell title={title} description={description} badge={badge}>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm">
          <p className="text-sm font-medium text-primary">{highlight}</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {items.map((item) => (
              <li key={item} className="flex gap-3 rounded-2xl border border-border/70 bg-background/70 p-3">
                <span className="mt-0.5 text-primary">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          {metrics && metrics.length > 0 ? (
            <div className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-sm">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl bg-background/70 p-3">
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {actions ? <div className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-sm">{actions}</div> : null}
          {footer ? <div className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-sm">{footer}</div> : null}
        </div>
      </div>
    </PageShell>
  );
}
