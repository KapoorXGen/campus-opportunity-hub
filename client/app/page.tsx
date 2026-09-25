import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8f9ff] text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-slate-900"
          >
            campus<span className="gemini-text">.</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link
              href="/opportunities"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              Explore
            </Link>

            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Get started
            </Link>
          </nav>

          <Link
            href="/register"
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white md:hidden"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background glows */}
        <div className="pointer-events-none absolute left-1/4 top-10 -z-0 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="pointer-events-none absolute right-1/4 top-20 -z-0 h-96 w-96 rounded-full bg-purple-200/25 blur-3xl" />

        <div className="pointer-events-none absolute right-0 top-72 -z-0 h-72 w-72 rounded-full bg-pink-200/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 pb-20 pt-24 text-center md:pb-28 md:pt-32">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2 text-xs font-medium text-violet-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-500 to-pink-500" />

            Opportunities, without the noise
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-semibold tracking-[-0.03em] text-slate-900 md:text-6xl md:leading-[1.08]">
            Find opportunities that{" "}
            <span className="gemini-text">
              fit where you are.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-500 md:text-lg">
            Campus brings internships, hackathons, scholarships and other
            student opportunities into one focused space — so you spend less
            time searching and more time doing.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/opportunities"
              className="gemini-gradient w-full rounded-xl px-6 py-3.5 text-sm font-medium text-white shadow-xl shadow-violet-200 transition hover:scale-[1.01] hover:opacity-90 sm:w-auto"
            >
              Explore opportunities
            </Link>

            <Link
              href="/register"
              className="w-full rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto"
            >
              Create your profile
            </Link>
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="gemini-glow overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-2 shadow-[0_30px_100px_rgba(80,70,180,0.10)]">
            <div className="rounded-[1.6rem] border border-slate-100 bg-[#f8f9ff] p-5 md:p-7">
              {/* Fake browser header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                </div>

                <div className="hidden h-8 w-1/3 rounded-lg bg-white shadow-sm md:block" />

                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500" />
              </div>

              <div className="grid gap-5 md:grid-cols-[220px_1fr]">
                {/* Sidebar */}
                <div className="hidden rounded-2xl border border-slate-200 bg-white p-4 md:block">
                  <div className="h-7 w-24 rounded bg-slate-100" />

                  <div className="mt-7 space-y-3">
                    <div className="rounded-xl bg-violet-50 px-3 py-2">
                      <div className="h-3 w-20 rounded bg-violet-200" />
                    </div>

                    <div className="px-3 py-2">
                      <div className="h-3 w-24 rounded bg-slate-100" />
                    </div>

                    <div className="px-3 py-2">
                      <div className="h-3 w-16 rounded bg-slate-100" />
                    </div>

                    <div className="px-3 py-2">
                      <div className="h-3 w-20 rounded bg-slate-100" />
                    </div>
                  </div>
                </div>

                {/* Dashboard Preview */}
                <div className="relative min-h-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {/* Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-[#fafaff] to-violet-50/40" />

                  {/* Center Content */}
                  <div className="relative flex min-h-[360px] flex-col items-center justify-center px-8 text-center">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500 text-xl font-bold text-white shadow-lg shadow-violet-200">
                      c.
                    </div>

                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-500">
                      Campus Opportunity Hub
                    </p>

                    <h3 className="mt-3 max-w-md text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                      Everything you need,
                      <br />
                      <span className="gemini-text">
                        in one place.
                      </span>
                    </h3>

                    <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
                      Discover internships, hackathons, scholarships and
                      opportunities built around you.
                    </p>

                    <Link
                      href="/opportunities"
                      className="gemini-gradient mt-7 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:scale-[1.02] hover:opacity-90"
                    >
                      Explore opportunities
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  {/* Floating Opportunities Card */}
                  <div className="absolute left-6 top-6 hidden rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:block">
                    <p className="text-[10px] text-slate-400">
                      Opportunities
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      24+
                    </p>
                  </div>

                  {/* Floating Applications Card */}
                  <div className="absolute bottom-6 right-6 hidden rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:block">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />

                      <p className="text-xs font-medium text-slate-700">
                        Applications organized
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="border-y border-slate-200/70 bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-violet-600">
              Built differently
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Stop searching everywhere.
              <br />
              Start finding what matters.
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-500 md:text-base">
              Students shouldn't have to remember which website, WhatsApp
              group or LinkedIn post contained an opportunity they wanted.
              Campus gives those opportunities a focused home.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-[#fafaff] p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                01
              </div>

              <h3 className="mt-6 text-lg font-semibold text-slate-900">
                Discover
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Explore opportunities across internships, hackathons,
                scholarships and more.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-[#fafaff] p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                02
              </div>

              <h3 className="mt-6 text-lg font-semibold text-slate-900">
                Organize
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Save interesting opportunities and keep your applications
                organized in one place.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-[#fafaff] p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                03
              </div>

              <h3 className="mt-6 text-lg font-semibold text-slate-900">
                Understand
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Build a profile that can eventually help explain which
                opportunities fit your current skills and interests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8 text-center md:p-14">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-medium text-violet-600">
              Your next opportunity could be closer than you think.
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Start exploring.
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500 md:text-base">
              Create your profile, discover opportunities and keep everything
              in one place.
            </p>

            <Link
              href="/register"
              className="gemini-gradient mt-7 inline-flex rounded-xl px-6 py-3.5 text-sm font-medium text-white shadow-xl shadow-violet-200 transition hover:scale-[1.01] hover:opacity-90"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-400 md:flex-row">
          <p>
            © {new Date().getFullYear()} Campus Opportunity Hub
          </p>

          <div className="flex gap-5">
            <Link
              href="/opportunities"
              className="transition hover:text-slate-700"
            >
              Opportunities
            </Link>

            <Link
              href="/login"
              className="transition hover:text-slate-700"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="transition hover:text-slate-700"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}