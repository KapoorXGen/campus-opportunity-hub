"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  User,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

type Applicant = {
  userId: string;
  email: string;
  name: string;
  bio: string;
  college: string;
  degree: string;
  branch: string;
  currentYear: string;
  graduationYear: number | null;
  githubUrl: string;
  linkedinUrl: string;
  skills: string[];
  interests: string[];
  resumeFileName: string;
  resumeMimeType: string;
  hasResume: boolean;
};

type Opportunity = {
  _id: string;
  title: string;
  organization: string;
  type: string;
  location: string;
  workMode: string;
};

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
  createdAt: string;
  appliedAt?: string;
  notes?: string;
  applicant: Applicant;
  opportunityId: Opportunity;
};

type ApiResponse<T> = {
  success?: boolean;
  data?: T;
  message?: string;
};

const statusOptions = [
  "saved",
  "applied",
  "under_review",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
] as const;

function AdminApplicationsContent() {
  const searchParams = useSearchParams();

  const opportunityId =
    searchParams.get("opportunityId");

  const [applications, setApplications] = useState<
    Application[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState<
    string | null
  >(null);

  const [resumeLoadingId, setResumeLoadingId] =
    useState<string | null>(null);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Authentication required");
          return;
        }

        const response = (await apiRequest(
          "/applications/admin/all",
          {
            method: "GET",
            token,
          }
        )) as ApiResponse<Application[]>;

        const allApplications = response.data || [];

        const filteredApplications =
          opportunityId
            ? allApplications.filter(
                (application) =>
                  String(
                    application.opportunityId?._id
                  ) === String(opportunityId)
              )
            : allApplications;

        setApplications(filteredApplications);
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

    loadApplications();
  }, [opportunityId]);

  const updateStatus = async (
    applicationId: string,
    status: Application["status"]
  ) => {
    try {
      setUpdatingId(applicationId);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = (await apiRequest(
        `/applications/admin/${applicationId}`,
        {
          method: "PATCH",
          token,
          body: JSON.stringify({
            status,
          }),
        }
      )) as ApiResponse<Application>;

      const updatedApplication = response.data;

      if (!updatedApplication) {
        throw new Error(
          response.message ||
            "Failed to update application"
        );
      }

      setApplications((current) =>
        current.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                ...updatedApplication,
                applicant: application.applicant,
              }
            : application
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update application status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const viewResume = async (
    applicationId: string
  ) => {
    try {
      setResumeLoadingId(applicationId);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required");
        return;
      }

      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:5000/api";

      const response = await fetch(
        `${apiBaseUrl}/applications/admin/${applicationId}/resume`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        let message = "Failed to open resume";

        try {
          const data = (await response.json()) as {
            message?: string;
          };

          if (data.message) {
            message = data.message;
          }
        } catch {
          // Response was not JSON.
        }

        throw new Error(message);
      }

      const blob = await response.blob();

      const resumeUrl =
        window.URL.createObjectURL(blob);

      window.open(resumeUrl, "_blank");

      setTimeout(() => {
        window.URL.revokeObjectURL(resumeUrl);
      }, 60_000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to open resume"
      );
    } finally {
      setResumeLoadingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading applicants...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Dashboard
        </Link>

        <div className="mt-8">
          <p className="text-sm font-medium text-muted-foreground">
            Campus Opportunity Hub
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Applicants
          </h1>

          {applications.length > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              {applications[0]?.opportunityId?.title ||
                "Opportunity"}{" "}
              · {applications.length}{" "}
              {applications.length === 1
                ? "applicant"
                : "applicants"}
            </p>
          )}
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-border bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <User className="h-7 w-7 text-muted-foreground" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No applicants yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Students who apply to this opportunity
              will appear here with their profile
              information and resume.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {applications.map((application) => {
              const applicant =
                application.applicant;

              return (
                <article
                  key={application._id}
                  className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm"
                >
                  <div className="border-b border-border px-6 py-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <User className="h-6 w-6" />
                        </div>

                        <div>
                          <h2 className="text-lg font-semibold">
                            {applicant.name ||
                              "Unnamed Applicant"}
                          </h2>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5" />
                              {applicant.email}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label
                          htmlFor={`status-${application._id}`}
                          className="text-xs font-medium text-muted-foreground"
                        >
                          Status
                        </label>

                        <select
                          id={`status-${application._id}`}
                          value={application.status}
                          disabled={
                            updatingId ===
                            application._id
                          }
                          onChange={(event) =>
                            updateStatus(
                              application._id,
                              event.target
                                .value as Application["status"]
                            )
                          }
                          className="rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {statusOptions.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status
                                  .replace(
                                    "_",
                                    " "
                                  )
                                  .replace(
                                    /\b\w/g,
                                    (letter) =>
                                      letter.toUpperCase()
                                  )}
                              </option>
                            )
                          )}
                        </select>

                        {updatingId ===
                          application._id && (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 px-6 py-6 md:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-semibold">
                        Education
                      </h3>

                      <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {applicant.college && (
                          <p>
                            <span className="font-medium text-foreground">
                              College:
                            </span>{" "}
                            {applicant.college}
                          </p>
                        )}

                        {applicant.degree && (
                          <p>
                            <span className="font-medium text-foreground">
                              Degree:
                            </span>{" "}
                            {applicant.degree}
                          </p>
                        )}

                        {applicant.branch && (
                          <p>
                            <span className="font-medium text-foreground">
                              Branch:
                            </span>{" "}
                            {applicant.branch}
                          </p>
                        )}

                        {applicant.currentYear && (
                          <p>
                            <span className="font-medium text-foreground">
                              Current Year:
                            </span>{" "}
                            {applicant.currentYear}
                          </p>
                        )}

                        {applicant.graduationYear && (
                          <p>
                            <span className="font-medium text-foreground">
                              Graduation:
                            </span>{" "}
                            {applicant.graduationYear}
                          </p>
                        )}

                        {!applicant.college &&
                          !applicant.degree &&
                          !applicant.branch && (
                            <p>
                              Education details not
                              provided.
                            </p>
                          )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold">
                        Profile
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {applicant.bio ||
                          "No bio provided."}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold">
                        Skills
                      </h3>

                      {applicant.skills.length >
                      0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {applicant.skills.map(
                            (skill) => (
                              <span
                                key={skill}
                                className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="mt-3 text-sm text-muted-foreground">
                          No skills provided.
                        </p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold">
                        Interests
                      </h3>

                      {applicant.interests.length >
                      0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {applicant.interests.map(
                            (interest) => (
                              <span
                                key={interest}
                                className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-600"
                              >
                                {interest}
                              </span>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="mt-3 text-sm text-muted-foreground">
                          No interests provided.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-border bg-muted/20 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2">
                      {applicant.githubUrl && (
                        <a
                          href={applicant.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                        >
                          <span className="font-semibold">
                            GH
                          </span>
                          GitHub
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}

                      {applicant.linkedinUrl && (
                        <a
                          href={
                            applicant.linkedinUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                        >
                          <span className="font-semibold">
                            in
                          </span>
                          LinkedIn
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>

                    <div>
                      {applicant.hasResume ? (
                        <button
                          type="button"
                          onClick={() =>
                            viewResume(
                              application._id
                            )
                          }
                          disabled={
                            resumeLoadingId ===
                            application._id
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {resumeLoadingId ===
                          application._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}

                          {resumeLoadingId ===
                          application._id
                            ? "Opening..."
                            : "View Resume"}
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          No Resume
                        </span>
                      )}
                    </div>
                  </div>

                  {applicant.hasResume &&
                    applicant.resumeFileName && (
                      <div className="border-t border-border px-6 py-3 text-xs text-muted-foreground">
                        Resume:{" "}
                        <span className="font-medium text-foreground">
                          {applicant.resumeFileName}
                        </span>
                      </div>
                    )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function ApplicationsLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading applicants...
        </div>
      </div>
    </main>
  );
}

export default function AdminApplicationsPage() {
  return (
    <Suspense fallback={<ApplicationsLoading />}>
      <AdminApplicationsContent />
    </Suspense>
  );
}