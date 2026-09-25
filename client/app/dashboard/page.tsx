"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  GraduationCap,
  LogOut,
  Search,
  UserRound,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

type Opportunity = {
  _id: string;
  title: string;
  organization: string;
  type: string;
  workMode: string;
  location?: string;
  skills: string[];
  deadline?: string;
  status?: string;
};

type SavedOpportunity = {
  _id: string;
  opportunityId: Opportunity | string | null;
};

type Application = {
  _id: string;
  opportunityId: Opportunity | string | null;
  status: string;
  appliedAt?: string;
};

type StudentProfile = {
  name: string;
  email?: string;
  bio?: string;
  college?: string;
  degree?: string;
  branch?: string;
  currentYear?: string;
  graduationYear?: number;
  githubUrl?: string;
  linkedinUrl?: string;
  skills: string[];
  interests: string[];
};

type OpportunitiesResponse = {
  success: boolean;
  count: number;
  data: Opportunity[];
};

type SavedResponse = {
  success: boolean;
  count: number;
  data: SavedOpportunity[];
};

type ApplicationsResponse = {
  success: boolean;
  count: number;
  data: Application[];
};

type ProfileResponse = {
  success: boolean;
  data: StudentProfile;
};

export default function DashboardPage() {
  const [opportunities, setOpportunities] = useState<
    Opportunity[]
  >([]);

  const [savedCount, setSavedCount] = useState(0);

  const [applications, setApplications] = useState<
    Application[]
  >([]);

  const [profile, setProfile] =
    useState<StudentProfile | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/login";
          return;
        }

        const [
          opportunitiesResponse,
          savedResponse,
          applicationsResponse,
          profileResponse,
        ] = await Promise.all([
          apiRequest<OpportunitiesResponse>(
            "/opportunities",
            {
              token,
            }
          ),

          apiRequest<SavedResponse>(
            "/saved",
            {
              token,
            }
          ),

          apiRequest<ApplicationsResponse>(
            "/applications",
            {
              token,
            }
          ),

          apiRequest<ProfileResponse>(
            "/profile",
            {
              token,
            }
          ),
        ]);

        setOpportunities(
          opportunitiesResponse.data || []
        );

        setSavedCount(
          savedResponse.count ||
            savedResponse.data?.length ||
            0
        );

        setApplications(
          applicationsResponse.data || []
        );

        setProfile(
          profileResponse.data || null
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  const profileCompletion = useMemo(() => {
    if (!profile) {
      return 0;
    }

    const fields = [
      Boolean(profile.name?.trim()),
      Boolean(profile.college?.trim()),
      Boolean(profile.degree?.trim()),
      Boolean(profile.branch?.trim()),
      Boolean(profile.currentYear?.trim()),
      Boolean(profile.skills?.length),
      Boolean(profile.interests?.length),
      Boolean(profile.bio?.trim()),
    ];

    const completedFields =
      fields.filter(Boolean).length;

    return Math.round(
      (completedFields / fields.length) * 100
    );
  }, [profile]);

  const recentOpportunities =
    opportunities.slice(0, 4);

  const applicationStatusCount =
    applications.filter(
      (application) =>
        application.status === "applied"
    ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
          <div className="text-sm text-muted-foreground">
            Loading your dashboard...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* HEADER */}

      <header className="border-b border-border bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight"
          >
            Campus Opportunity Hub
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/opportunities"
              className="hidden items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground sm:flex"
            >
              <Search className="h-4 w-4" />
              Opportunities
            </Link>

            <Link
              href="/profile"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 text-white"
            >
              <UserRound className="h-5 w-5" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 sm:px-4"
            >
              <LogOut className="h-4 w-4" />

              <span className="hidden sm:inline">
                Logout
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* WELCOME */}

        <section>
          <p className="text-sm font-medium text-muted-foreground">
            Student Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Welcome back
            {profile?.name
              ? `, ${profile.name.split(" ")[0]}`
              : ""}
            .
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Discover opportunities that match your
            interests, keep track of applications, and
            build your profile.
          </p>
        </section>

        {/* QUICK STATS */}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Opportunities
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  {opportunities.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Saved
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  {savedCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Bookmark className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Applications
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  {applications.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                <GraduationCap className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Applied
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  {applicationStatusCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* RECENT OPPORTUNITIES */}

          <section className="rounded-3xl border border-border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h2 className="font-semibold">
                  Recent Opportunities
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Latest opportunities available to you.
                </p>
              </div>

              <Link
                href="/opportunities"
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-700"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {recentOpportunities.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>

                <p className="mt-4 font-medium">
                  No opportunities available
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Check back later for new opportunities.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentOpportunities.map(
                  (opportunity) => (
                    <Link
                      key={opportunity._id}
                      href={`/opportunities/${opportunity._id}`}
                      className="block px-6 py-5 transition hover:bg-muted/30"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold">
                            {opportunity.title}
                          </h3>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {opportunity.organization}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                              {opportunity.type}
                            </span>

                            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-600">
                              {opportunity.workMode}
                            </span>

                            {opportunity.location && (
                              <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-600">
                                {opportunity.location}
                              </span>
                            )}
                          </div>
                        </div>

                        <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted-foreground sm:block" />
                      </div>
                    </Link>
                  )
                )}
              </div>
            )}
          </section>

          {/* SIDEBAR */}

          <div className="space-y-6">
            {/* PROFILE */}

            <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold">
                    Profile
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Keep your profile complete.
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <UserRound className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Completion
                  </span>

                  <span className="font-semibold">
                    {profileCompletion}%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 transition-all"
                    style={{
                      width: `${profileCompletion}%`,
                    }}
                  />
                </div>
              </div>

              <Link
                href="/profile"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold transition hover:bg-muted"
              >
                Update Profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>

            {/* APPLICATIONS */}

            <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold">
                    My Applications
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Track your application activity.
                  </p>
                </div>

                <Clock3 className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="mt-6">
                <p className="text-3xl font-semibold">
                  {applications.length}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  total applications
                </p>
              </div>

              <Link
                href="/applications"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                View Applications
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>

            {/* SAVED */}

            <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold">
                    Saved Opportunities
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Opportunities you want to revisit.
                  </p>
                </div>

                <Bookmark className="h-5 w-5 text-muted-foreground" />
              </div>

              <p className="mt-5 text-3xl font-semibold">
                {savedCount}
              </p>

              <Link
                href="/saved"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                View Saved
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}