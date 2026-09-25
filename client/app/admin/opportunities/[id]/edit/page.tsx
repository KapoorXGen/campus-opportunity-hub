"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { apiRequest } from "@/lib/api";

type Opportunity = {
  _id: string;
  title: string;
  description: string;
  organization: string;
  type: string;
  location?: string;
  workMode: string;
  eligibility?: string;
  skills: string[];
  stipend?: string;
  salary?: string;
  applicationUrl: string;
  startDate?: string;
  endDate?: string;
  deadline?: string;
  status: string;
};

type OpportunityResponse = {
  success: boolean;
  data: Opportunity;
};

export default function EditOpportunityPage() {
  const params = useParams();
  const router = useRouter();

  const opportunityId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    organization: "",
    type: "internship",
    location: "",
    workMode: "remote",
    eligibility: "",
    skills: "",
    stipend: "",
    salary: "",
    applicationUrl: "",
    startDate: "",
    endDate: "",
    deadline: "",
    status: "published",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const user = storedUser ? JSON.parse(storedUser) : {};

      if (user.role !== "admin") {
        router.push("/dashboard");
        return;
      }
    } catch {
      router.push("/login");
      return;
    }

    const loadOpportunity = async () => {
      try {
        const response = await apiRequest<OpportunityResponse>(
          `/opportunities/${opportunityId}`
        );

        const opportunity = response.data;

        setForm({
          title: opportunity.title || "",
          description: opportunity.description || "",
          organization: opportunity.organization || "",
          type: opportunity.type || "internship",
          location: opportunity.location || "",
          workMode: opportunity.workMode || "remote",
          eligibility: opportunity.eligibility || "",
          skills: opportunity.skills?.join(", ") || "",
          stipend: opportunity.stipend || "",
          salary: opportunity.salary || "",
          applicationUrl: opportunity.applicationUrl || "",
          startDate: opportunity.startDate
            ? opportunity.startDate.slice(0, 10)
            : "",
          endDate: opportunity.endDate
            ? opportunity.endDate.slice(0, 10)
            : "",
          deadline: opportunity.deadline
            ? opportunity.deadline.slice(0, 10)
            : "",
          status: opportunity.status || "published",
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load opportunity"
        );
      } finally {
        setLoading(false);
      }
    };

    loadOpportunity();
  }, [opportunityId, router]);

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      await apiRequest(
        `/opportunities/admin/${opportunityId}`,
        {
          method: "PUT",
          token,
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            organization: form.organization,
            type: form.type,
            location: form.location,
            workMode: form.workMode,
            eligibility: form.eligibility,

            skills: form.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean),

            stipend: form.stipend,
            salary: form.salary,
            applicationUrl: form.applicationUrl,

            startDate: form.startDate || undefined,
            endDate: form.endDate || undefined,
            deadline: form.deadline || undefined,

            status: form.status,
          }),
        }
      );

      router.push("/admin");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update opportunity"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
          <p className="text-sm text-muted-foreground">
            Loading opportunity...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-10">

        {/* BACK */}

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Dashboard
        </Link>

        {/* HEADER */}

        <div className="mt-8">
          <p className="text-sm font-medium text-muted-foreground">
            Campus Opportunity Hub
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Edit Opportunity
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Update the opportunity details below.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-3xl border border-border bg-white p-6 shadow-sm md:p-8"
        >

          {/* BASIC DETAILS */}

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="text-sm font-medium">
                Opportunity Title
              </label>

              <input
                value={form.title}
                onChange={(e) =>
                  updateField("title", e.target.value)
                }
                required
                className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Organization
              </label>

              <input
                value={form.organization}
                onChange={(e) =>
                  updateField(
                    "organization",
                    e.target.value
                  )
                }
                required
                className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="text-sm font-medium">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(e) =>
                updateField(
                  "description",
                  e.target.value
                )
              }
              required
              rows={6}
              className="mt-2 w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* TYPE / WORK MODE / LOCATION */}

          <div className="grid gap-6 md:grid-cols-3">

            <div>
              <label className="text-sm font-medium">
                Type
              </label>

              <select
                value={form.type}
                onChange={(e) =>
                  updateField(
                    "type",
                    e.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="internship">
                  Internship
                </option>

                <option value="job">
                  Job
                </option>

                <option value="hackathon">
                  Hackathon
                </option>

                <option value="scholarship">
                  Scholarship
                </option>

                <option value="competition">
                  Competition
                </option>

                <option value="workshop">
                  Workshop
                </option>

                <option value="conference">
                  Conference
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">
                Work Mode
              </label>

              <select
                value={form.workMode}
                onChange={(e) =>
                  updateField(
                    "workMode",
                    e.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="remote">
                  Remote
                </option>

                <option value="hybrid">
                  Hybrid
                </option>

                <option value="onsite">
                  On-site
                </option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">
                Location
              </label>

              <input
                value={form.location}
                onChange={(e) =>
                  updateField(
                    "location",
                    e.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

          </div>

          {/* SKILLS */}

          <div>
            <label className="text-sm font-medium">
              Skills
            </label>

            <input
              value={form.skills}
              onChange={(e) =>
                updateField(
                  "skills",
                  e.target.value
                )
              }
              placeholder="React, JavaScript, TypeScript"
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-2 text-xs text-muted-foreground">
              Separate skills using commas.
            </p>
          </div>

          {/* ELIGIBILITY / APPLICATION URL */}

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="text-sm font-medium">
                Eligibility
              </label>

              <input
                value={form.eligibility}
                onChange={(e) =>
                  updateField(
                    "eligibility",
                    e.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Application URL
              </label>

              <input
                type="url"
                value={form.applicationUrl}
                onChange={(e) =>
                  updateField(
                    "applicationUrl",
                    e.target.value
                  )
                }
                required
                className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

          </div>

          {/* STIPEND / SALARY */}

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="text-sm font-medium">
                Stipend
              </label>

              <input
                value={form.stipend}
                onChange={(e) =>
                  updateField(
                    "stipend",
                    e.target.value
                  )
                }
                placeholder="₹15,000/month"
                className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Salary
              </label>

              <input
                value={form.salary}
                onChange={(e) =>
                  updateField(
                    "salary",
                    e.target.value
                  )
                }
                placeholder="₹6 LPA"
                className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

          </div>

          {/* DATES */}

          <div className="grid gap-6 md:grid-cols-3">

            <div>
              <label className="text-sm font-medium">
                Start Date
              </label>

              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  updateField(
                    "startDate",
                    e.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-muted-foreground">
                When the opportunity begins.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">
                End Date
              </label>

              <input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  updateField(
                    "endDate",
                    e.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-muted-foreground">
                When the opportunity ends.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">
                Application Deadline
              </label>

              <input
                type="date"
                value={form.deadline}
                onChange={(e) =>
                  updateField(
                    "deadline",
                    e.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-muted-foreground">
                Last date to apply.
              </p>
            </div>

          </div>

          {/* STATUS */}

          <div>
            <label className="text-sm font-medium">
              Status
            </label>

            <select
              value={form.status}
              onChange={(e) =>
                updateField(
                  "status",
                  e.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="published">
                Published
              </option>

              <option value="draft">
                Draft
              </option>

              <option value="expired">
                Expired
              </option>

              <option value="archived">
                Archived
              </option>
            </select>

            <p className="mt-2 text-xs text-muted-foreground">
              Draft opportunities are hidden from students.
            </p>
          </div>

          {/* ACTIONS */}

          <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">

            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-medium transition hover:bg-muted"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}