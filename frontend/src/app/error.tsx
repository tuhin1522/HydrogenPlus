"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#081717] px-6 py-16 text-[#F3F7F6]">
      <div className="max-w-md rounded-[28px] border border-[#1D3E3E] bg-[#0A2324] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.16)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#86F05C]">Something went wrong</p>
        <h2 className="mt-3 text-2xl font-semibold">We hit a snag while loading this page.</h2>
        <p className="mt-3 text-sm leading-7 text-[#A9B7B4]">
          Please refresh and try again. If the issue continues, contact support.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-full bg-[#86F05C] px-5 py-3 text-sm font-semibold text-[#081717] transition hover:bg-[#B7FF63]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
