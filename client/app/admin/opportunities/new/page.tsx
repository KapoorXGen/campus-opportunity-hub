"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Send } from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

export default function NewOpportunityPage() {
  const router = useRouter();

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
    status: "draft",
  });

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const createOpportunity = async (
    status: "draft" | "published"
  ) => {
    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      await apiRequest("/opportunities/admin", {
        method: "POST",
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

          status,
        }),
      });

      router.push("/admin");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create opportunity"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    await createOpportunity(
      form.status as "draft" | "published"
    );
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-10">
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
            Create Opportunity
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Add a new opportunity for students.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">
              Basic Information
            </h2>

            <div className="mt-5 grid gap-5">
              <div>
                <label className="text-sm font-medium">
                  Title
                </label>

                <input
                  value={form.title}
                  onChange={(e) =>
                    updateField("title", e.target.value)
                  }
                  required
                  className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-violet-500"
                  placeholder="Frontend Developer Intern"
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
                  className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-violet-500"
                  placeholder="Company name"
                />
              </div>

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
                  className="mt-2 w-full resize-none rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-violet-500"
                  placeholder="Describe the opportunity..."
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">
                    Type
                  </label>

                  <select
                    value={form.type}
                    onChange={(e) =>
                      updateField("type", e.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-violet-500"
                  >
                    <option value="internship">
                      Internship
                    </option>
                    <option value="job">Job</option>
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
                    <option value="other">Other</option>
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
                    className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-violet-500"
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">Onsite</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
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
                    className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-violet-500"
                    placeholder="Bengaluru"
                  />
                </div>

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
                    className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-violet-500"
                    placeholder="B.Tech students"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Skills
                </label>

                <input
                  value={form.skills}
                  onChange={(e) =>
                    updateField("skills", e.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-violet-500"
                  placeholder="React, JavaScript, Node.js"
                />

                <p className="mt-2 text-xs text-muted-foreground">
                  Separate multiple skills using commas.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">
              Compensation & Application
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
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
                  className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-violet-500"
                  placeholder="₹15,000/month"
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
                  className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-violet-500"
                  placeholder="₹5 LPA"
                />
              </div>

              <div className="md:col-span-2">
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
                  className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-violet-500"
                  placeholder="https://example.com/apply"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">
              Dates
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
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
                  className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-violet-500"
                />
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
                  className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Deadline
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
                  className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">
              Publishing
            </h2>

            <div className="mt-5">
              <label className="text-sm font-medium">
                Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  updateField("status", e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-violet-500"
              >
                <option value="draft">Draft</option>
                <option value="published">
                  Published
                </option>
              </select>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() =>
                updateField("status", "draft")
              }
            >
              <Save className="h-4 w-4" />
              Save Draft
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => createOpportunity("published")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {saving ? "Publishing..." : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}