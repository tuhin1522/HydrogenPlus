export function ContentSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="animate-pulse rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="mt-4 h-8 w-20 rounded bg-muted" />
          <div className="mt-3 h-3 w-32 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
