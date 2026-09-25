"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Edit,
  FileText,
  LogOut,
  Plus,
  ShieldAlert,
  Trash2,
  Users,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

type User = {
  role?: string;
};

type Opportunity = {
  _id: string;
  title: string;
  organization: string;
  type: string;
  workMode: string;
  location: string;
  deadline?: string;
  applicantCount?: number;
};

type AdminOpportunitiesResponse = {
  success: boolean;
  count: number;
  data: Opportunity[];
};

export default function AdminPage() {
  const [opportunities, setOpportunities] = useState<
    Opportunity[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const user: User = storedUser
        ? JSON.parse(storedUser)
        : {};

      if (user.role !== "admin") {
        setLoading(false);
        return;
      }

      setAuthorized(true);
    } catch {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    if (!authorized) return;

    const loadOpportunities = async () => {
      try {
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response =
          await apiRequest<AdminOpportunitiesResponse>(
            "/opportunities/admin",
            {
              token,
            }
          );

        setOpportunities(response.data || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load opportunities"
        );
      } finally {
        setLoading(false);
      }
    };

    loadOpportunities();
  }, [authorized]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this opportunity?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      await apiRequest(`/opportunities/admin/${id}`, {
        method: "DELETE",
        token,
      });

      setOpportunities((current) =>
        current.filter(
          (opportunity) => opportunity._id !== id
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete opportunity"
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">
          Checking admin access...
        </div>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <ShieldAlert className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-2xl font-semibold">
            Admin access required
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Your account does not have permission to access the
            admin dashboard.
          </p>

          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const totalOpportunities = opportunities.length;

  const internships = opportunities.filter(
    (opportunity) =>
      opportunity.type.toLowerCase() === "internship"
  ).length;

  const remote = opportunities.filter(
    (opportunity) =>
      opportunity.workMode.toLowerCase() === "remote"
  ).length;

  const totalApplicants = opportunities.reduce(
    (total, opportunity) =>
      total + (opportunity.applicantCount || 0),
    0
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Campus Opportunity Hub
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Manage your posted opportunities and applicants.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>

            <Link
              href="/admin/opportunities/new"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Opportunity
            </Link>
          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Statistics */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">
              Total Opportunities
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {totalOpportunities}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">
              Internships
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {internships}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">
              Remote
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {remote}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">
              Total Applicants
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {totalApplicants}
            </p>
          </div>
        </div>

        {/* Posted Opportunities */}

        <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
          <div className="border-b border-border px-6 py-5">
            <h2 className="font-semibold">
              Posted Opportunities
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Only opportunities created by your account are shown.
            </p>
          </div>

          {opportunities.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-medium">
                No opportunities yet
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Create your first opportunity to get started.
              </p>
            </div>
          ) : (
            <div>
              {opportunities.map((opportunity) => (
                <div
                  key={opportunity._id}
                  className="border-b border-border px-6 py-6 last:border-b-0"
                >
                  <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                    {/* Opportunity */}

                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-slate-900">
                        {opportunity.title}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {opportunity.organization}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                          {opportunity.type}
                        </span>

                        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-600">
                          {opportunity.workMode}
                        </span>

                        <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-600">
                          {opportunity.location}
                        </span>
                      </div>
                    </div>

                    {/* Right side */}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      {/* Applicant count */}

                      <div className="flex h-11 items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4">
                        <Users className="h-4 w-4 text-blue-600" />

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-blue-700">
                            Applicants
                          </span>

                          <span className="font-semibold text-slate-900">
                            {opportunity.applicantCount || 0}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/applications?opportunityId=${opportunity._id}`}
                          className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-50 px-4 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
                        >
                          <FileText className="h-4 w-4" />
                          Applicants
                        </Link>

                        <Link
                          href={`/admin/opportunities/${opportunity._id}/edit`}
                          className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(opportunity._id)
                          }
                          disabled={
                            deletingId === opportunity._id
                          }
                          className="inline-flex h-11 items-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />

                          {deletingId === opportunity._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}