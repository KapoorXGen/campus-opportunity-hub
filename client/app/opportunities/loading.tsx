export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f8f9ff] text-slate-900">
      {/* Navigation skeleton */}
      <header className="border-b border-slate-200/80 bg-white/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="h-6 w-28 animate-pulse rounded bg-slate-100" />

          <div className="hidden items-center gap-7 md:flex">
            <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-14 animate-pulse rounded bg-slate-100" />
          </div>

          <div className="h-9 w-9 animate-pulse rounded-full bg-slate-100" />
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-6 py-10">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/4 top-0 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />

        <div className="pointer-events-none absolute right-0 top-64 h-72 w-72 rounded-full bg-purple-200/20 blur-3xl" />

        {/* Header */}
        <section className="relative z-10 mb-8">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />

          <div className="mt-4 h-10 w-80 max-w-full animate-pulse rounded-xl bg-slate-100" />

          <div className="mt-4 h-5 w-[520px] max-w-full animate-pulse rounded bg-slate-100" />
        </section>

        {/* Search skeleton */}
        <section className="relative z-10 mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(80,70,180,0.05)]">
          <div className="h-12 w-full animate-pulse rounded-xl bg-slate-100" />
        </section>

        {/* Cards */}
        <section className="relative z-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(80,70,180,0.05)]"
            >
              <div className="flex items-start justify-between">
                <div className="h-11 w-11 animate-pulse rounded-2xl bg-slate-100" />

                <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
              </div>

              <div className="mt-6 h-5 w-3/4 animate-pulse rounded bg-slate-100" />

              <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-slate-100" />

              <div className="mt-5 space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-slate-100" />
              </div>

              <div className="mt-5 flex gap-2">
                <div className="h-7 w-16 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-7 w-20 animate-pulse rounded-lg bg-slate-100" />
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />

                <div className="mt-2 h-4 w-24 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}