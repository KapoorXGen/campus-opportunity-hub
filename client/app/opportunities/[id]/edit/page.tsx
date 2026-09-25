"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
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
  deadline: string;
  applicationUrl?: string;
};

export default function EditOpportunityPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    organization: "",
    description: "",
    type: "Internship",
    location: "",
    mode: "Remote",
    skills: "",
    deadline: "",
    applicationUrl: "",
  });

  useEffect(() => {
    const loadOpportunity = async () => {
      try {
        const data = await apiRequest<{ opportunity: Opportunity }>(
          `/opportunities/${id}`
        );

        const opportunity = data.opportunity;

        setForm({
          title: opportunity.title || "",
          organization: opportunity.organization || "",
          description: opportunity.description || "",
          type: opportunity.type || "Internship",
          location: opportunity.location || "",
          mode: opportunity.mode || "Remote",
          skills: opportunity.skills?.join(", ") || "",
          deadline: opportunity.deadline
            ? opportunity.deadline.slice(0, 10)
            : "",
          applicationUrl: opportunity.applicationUrl || "",
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
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      await apiRequest(`/opportunities/${id}`, {
        method: "PUT",
        token,
        body: JSON.stringify({
          title: form.title,
          organization: form.organization,
          description: form.description,
          type: form.type,
          location: form.location,
          mode: form.mode,
          skills: form.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
          deadline: form.deadline,
          applicationUrl: form.applicationUrl || undefined,
        }),
      });

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
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />
          <div className="mt-8 h-[600px] animate-pulse rounded-3xl bg-muted" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/admin"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white transition hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Admin / Opportunities
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Edit Opportunity
            </h1>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title + Organization */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Opportunity Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Frontend Developer Intern"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Organization
                </label>

                <input
                  name="organization"
                  value={form.organization}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Google"
                />
              </div>
            </div>

            {/* Type + Mode + Location */}
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Type
                </label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                >
                  <option value="Internship">Internship</option>
                  <option value="Job">Job</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Scholarship">Scholarship</option>
                  <option value="Competition">Competition</option>
                  <option value="Fellowship">Fellowship</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Mode
                </label>

                <select
                  name="mode"
                  value={form.mode}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                >
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Location
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Bengaluru, India"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={7}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="Describe the opportunity..."
              />
            </div>

            {/* Skills */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Required Skills
              </label>

              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="React, JavaScript, TypeScript, MongoDB"
              />

              <p className="mt-2 text-xs text-muted-foreground">
                Separate skills using commas.
              </p>
            </div>

            {/* Deadline + Application URL */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Application Deadline
                </label>

                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Application URL
                </label>

                <input
                  type="url"
                  name="applicationUrl"
                  value={form.applicationUrl}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="https://example.com/apply"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
              <Link
                href="/admin"
                className="flex items-center justify-center rounded-xl border border-border bg-white px-5 py-3 text-sm font-medium transition hover:bg-muted"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />

                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}