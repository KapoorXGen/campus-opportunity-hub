"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type Application = {
  _id: string;
  status:
  | "saved"
  | "applied"
  | "under_review"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";
  appliedAt?: string;
  notes?: string;
  opportunityId?: {
    _id?: string;
    title?: string;
    organization?: string;
    type?: string;
    location?: string;
    workMode?: string;
    deadline?: string;
  };
};

const formatStatus = (status: string) =>
  status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getStatusClasses = (status: Application["status"]) => {
  switch (status) {
    case "offer":
      return "bg-green-50 text-green-700 border-green-200";

    case "interview":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "under_review":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";

    case "withdrawn":
      return "bg-gray-100 text-gray-600 border-gray-200";

    default:
      return "bg-orange-50 text-orange-700 border-orange-200";
  }
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await apiRequest<{
        success: boolean;
        count: number;
        data: Application[];
      }>("/applications", {
        token,
      });

      setApplications(response.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f9fc] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            ← Dashboard
          </Link>

          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-pink-500">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M8 13h8" />
                <path d="M8 17h5" />
              </svg>
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                My Applications
              </h1>

              <p className="mt-1 text-gray-500">
                Track the opportunities you've applied to.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Loading your applications...
            </p>
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-pink-500">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M8 13h8" />
                <path d="M8 17h5" />
              </svg>
            </div>

            <h2 className="mt-6 text-xl font-bold text-gray-900">
              No applications yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              When you apply to an opportunity, you'll be able to track its
              status here.
            </p>

            <Link
              href="/opportunities"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Find Opportunities →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application._id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-bold text-gray-900">
                        {application.opportunityId?.title ||
                          "Unknown opportunity"}
                      </h2>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          application.status
                        )}`}
                      >
                        {formatStatus(application.status)}
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-medium text-gray-600">
                      {application.opportunityId?.organization ||
                        "Unknown organization"}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
                      {application.opportunityId?.type && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 capitalize">
                          {application.opportunityId.type}
                        </span>
                      )}

                      {application.opportunityId?.workMode && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 capitalize">
                          {application.opportunityId.workMode}
                        </span>
                      )}

                      {application.opportunityId?.location && (
                        <span className="rounded-full bg-gray-100 px-3 py-1">
                          {application.opportunityId.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      {formatStatus(application.status)}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                      {application.appliedAt
                        ? new Date(
                          application.appliedAt
                        ).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>

                {application.notes && (
                  <div className="mt-5 rounded-xl bg-gray-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Notes
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {application.notes}
                    </p>
                  </div>
                )}

                {application.opportunityId?._id && (
                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <Link
                      href={`/opportunities/${application.opportunityId._id}`}
                      className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                    >
                      View opportunity →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}