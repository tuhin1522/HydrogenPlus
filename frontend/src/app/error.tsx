"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground">
      <div className="max-w-md rounded-[28px] border border-border bg-card p-8 text-center shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Something went wrong</p>
        <h2 className="mt-3 text-2xl font-semibold text-foreground">We hit a snag while loading this page.</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Please refresh and try again. If the issue continues, contact support.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
