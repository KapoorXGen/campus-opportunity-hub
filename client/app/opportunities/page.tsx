"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";

type Opportunity = {
  _id: string;
  title: string;
  organization: string;
  description: string;
  type: string;
  location: string;
  mode: string;
  skills: string[];
  deadline?: string;
};

type OpportunitiesResponse = {
  success: boolean;
  data: Opportunity[];
};

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        setLoading(true);

        const response = await apiRequest<OpportunitiesResponse>(
          "/opportunities"
        );

        setOpportunities(response.data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load opportunities."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOpportunities();
  }, []);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opportunity) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        opportunity.title.toLowerCase().includes(searchText) ||
        opportunity.organization.toLowerCase().includes(searchText) ||
        opportunity.description.toLowerCase().includes(searchText) ||
        opportunity.skills.some((skill) =>
          skill.toLowerCase().includes(searchText)
        );

      const matchesType =
        type === "all" ||
        opportunity.type.toLowerCase() === type.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [opportunities, search, type]);

  return (
    <main className="min-h-screen bg-[#f8f9ff] text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-slate-900"
          >
            campus<span className="gemini-text">.</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              Dashboard
            </Link>

            <Link
              href="/opportunities"
              className="text-sm font-medium text-violet-600"
            >
              Opportunities
            </Link>

            <Link
              href="/saved"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              Saved
            </Link>

            <Link
              href="/applications"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              Applications
            </Link>

            <Link
              href="/profile"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              Profile
            </Link>
          </nav>

          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500 text-sm font-semibold text-white shadow-sm"
          >
            U
          </Link>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-6 py-10">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/4 top-0 -z-0 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />

        <div className="pointer-events-none absolute right-0 top-64 -z-0 h-72 w-72 rounded-full bg-purple-200/20 blur-3xl" />

        {/* Header */}
        <section className="relative z-10 mb-8">
          <p className="mb-2 text-sm font-medium text-violet-600">
            Discover
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Opportunities for{" "}
            <span className="gemini-text">you</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Explore internships, hackathons, scholarships and other
            opportunities in one place.
          </p>
        </section>

        {/* Search + filters */}
        <section className="relative z-10 mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(80,70,180,0.06)]">
          <div className="flex flex-col gap-4 md:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>

              <input
                type="text"
                placeholder="Search opportunities, skills or organizations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>

            {/* Type */}
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 md:w-52"
            >
              <option value="all">All opportunities</option>
              <option value="internship">Internships</option>
              <option value="hackathon">Hackathons</option>
              <option value="scholarship">Scholarships</option>
              <option value="competition">Competitions</option>
              <option value="workshop">Workshops</option>
            </select>
          </div>
        </section>

        {/* Result count */}
        <div className="relative z-10 mb-5 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {loading
              ? "Finding opportunities..."
              : `${filteredOpportunities.length} ${
                  filteredOpportunities.length === 1
                    ? "opportunity"
                    : "opportunities"
                } found`}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="relative z-10 mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="relative z-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-100" />

                <div className="mt-6 h-5 w-3/4 rounded bg-slate-100" />

                <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />

                <div className="mt-6 h-16 rounded bg-slate-100" />

                <div className="mt-6 h-8 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {/* Opportunities */}
        {!loading && filteredOpportunities.length > 0 && (
          <section className="relative z-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredOpportunities.map((opportunity) => (
              <Link
                key={opportunity._id}
                href={`/opportunities/${opportunity._id}`}
                className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(80,70,180,0.05)] transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_18px_50px_rgba(80,70,180,0.10)]"
              >
                {/* Icon */}
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 text-violet-600">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                      />
                      <path d="M8 5V3h8v2" />
                      <path d="M3 10h18" />
                    </svg>
                  </div>

                  <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium capitalize text-violet-600">
                    {opportunity.type}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-6">
                  <h2 className="line-clamp-2 text-lg font-semibold text-slate-900 transition group-hover:text-violet-700">
                    {opportunity.title}
                  </h2>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {opportunity.organization}
                  </p>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                    {opportunity.description}
                  </p>
                </div>

                {/* Metadata */}
                <div className="mt-5 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Location</span>
                    <span>{opportunity.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Mode</span>
                    <span className="capitalize">{opportunity.mode}</span>
                  </div>
                </div>

                {/* Skills */}
                {opportunity.skills?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {opportunity.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}

                    {opportunity.skills.length > 3 && (
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-400">
                        +{opportunity.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Deadline */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Deadline
                    </p>

                    <p className="mt-1 text-xs font-medium text-slate-600">
                      {opportunity.deadline
                        ? new Date(opportunity.deadline).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>

                  <span className="text-sm font-medium text-violet-600 transition group-hover:translate-x-1">
                    View →
                  </span>
                </div>
              </Link>
            ))}
          </section>
        )}

        {/* Empty */}
        {!loading && filteredOpportunities.length === 0 && !error && (
          <section className="relative z-10 rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-[0_12px_40px_rgba(80,70,180,0.05)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              No opportunities found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try changing your search or selecting a different opportunity
              type.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setType("all");
              }}
              className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Clear filters
            </button>
          </section>
        )}
      </div>
    </main>
  );
}