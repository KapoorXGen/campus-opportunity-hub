"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Sparkles,
} from "lucide-react";
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

type OpportunityResponse =
  | Opportunity
  | {
      opportunity: Opportunity;
    }
  | {
      data: Opportunity;
    }
  | {
      success: boolean;
      opportunity?: Opportunity;
      data?: Opportunity;
    };

export default function OpportunityDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [opportunity, setOpportunity] =
    useState<Opportunity | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);

  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadOpportunity = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiRequest<OpportunityResponse>(
          `/opportunities/${id}`
        );

        let result: Opportunity | null = null;

        if (
          typeof response === "object" &&
          response !== null &&
          "opportunity" in response &&
          response.opportunity
        ) {
          result = response.opportunity;
        } else if (
          typeof response === "object" &&
          response !== null &&
          "data" in response &&
          response.data
        ) {
          result = response.data;
        } else {
          result = response as Opportunity;
        }

        if (!result || !result._id) {
          throw new Error("Opportunity data could not be loaded");
        }

        setOpportunity(result);
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

    if (id) {
      loadOpportunity();
    }
  }, [id]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await apiRequest("/saved", {
        method: "POST",
        token,
        body: JSON.stringify({
          opportunityId: id,
        }),
      });

      setSaved(true);
      setMessage("Opportunity saved successfully.");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to save opportunity";

      if (
        errorMessage.toLowerCase().includes("already") ||
        errorMessage.toLowerCase().includes("saved")
      ) {
        setSaved(true);
        setMessage("This opportunity is already saved.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleApply = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setApplying(true);
      setError("");
      setMessage("");

      await apiRequest("/applications", {
        method: "POST",
        token,
        body: JSON.stringify({
          opportunityId: id,
        }),
      });

      setApplied(true);
      setMessage("Application submitted successfully.");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to submit application";

      if (
        errorMessage.toLowerCase().includes("already") ||
        errorMessage.toLowerCase().includes("applied")
      ) {
        setApplied(true);
        setMessage("You have already applied to this opportunity.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="h-6 w-28 animate-pulse rounded bg-muted" />

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="h-[500px] animate-pulse rounded-3xl bg-muted" />

            <div className="h-[360px] animate-pulse rounded-3xl bg-muted" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !opportunity) {
    return (
      <main className="min-h-screen bg-background">
        <nav className="border-b border-border bg-white/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
            <Link
              href="/opportunities"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              All Opportunities
            </Link>
          </div>
        </nav>

        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <BriefcaseBusiness className="h-7 w-7" />
            </div>

            <h1 className="mt-5 text-2xl font-semibold">
              Opportunity not found
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {error ||
                "This opportunity may have been removed or is no longer available."}
            </p>

            <Link
              href="/opportunities"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Browse Opportunities
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const deadline = opportunity.deadline
    ? new Date(opportunity.deadline).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not specified";

  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
          <Link
            href="/opportunities"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All Opportunities
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Success */}
        {message && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Main Content */}
          <section className="rounded-3xl border border-border bg-white p-7 shadow-sm md:p-9">
            {/* Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 via-violet-50 to-pink-50 text-violet-600">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>

            {/* Heading */}
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                  {opportunity.type}
                </span>

                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-600">
                  {opportunity.mode}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">
                {opportunity.title}
              </h1>

              <p className="mt-2 text-lg font-medium text-muted-foreground">
                {opportunity.organization}
              </p>
            </div>

            {/* Metadata */}
            <div className="mt-7 flex flex-wrap gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {opportunity.location}
              </span>

              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Deadline: {deadline}
              </span>
            </div>

            {/* Description */}
            <div className="mt-9 border-t border-border pt-8">
              <h2 className="text-lg font-semibold">
                About this opportunity
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {opportunity.description}
              </p>
            </div>

            {/* Skills */}
            {opportunity.skills &&
              opportunity.skills.length > 0 && (
                <div className="mt-9 border-t border-border pt-8">
                  <h2 className="text-lg font-semibold">
                    Skills
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {opportunity.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm text-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </section>

          {/* Sidebar */}
          <aside className="h-fit space-y-5 lg:sticky lg:top-6">
            {/* Actions */}
            <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <h2 className="font-semibold">
                Interested?
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Save this opportunity or apply directly when you're ready.
              </p>

              <div className="mt-6 space-y-3">
                {/* Apply */}
                <button
                  onClick={handleApply}
                  disabled={applying || applied}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle2 className="h-4 w-4" />

                  {applying
                    ? "Applying..."
                    : applied
                      ? "Applied"
                      : "Apply Now"}
                </button>

                {/* Save */}
                <button
                  onClick={handleSave}
                  disabled={saving || saved}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Bookmark className="h-4 w-4" />

                  {saving
                    ? "Saving..."
                    : saved
                      ? "Saved"
                      : "Save Opportunity"}
                </button>

                {/* External Application */}
                {opportunity.applicationUrl && (
                  <a
                    href={opportunity.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-medium transition hover:bg-muted"
                  >
                    <ExternalLink className="h-4 w-4" />
                    External Application
                  </a>
                )}
              </div>
            </div>

            {/* AI Fit */}
            <div className="relative overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-sm">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-400/10 blur-2xl" />

              <div className="relative">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-500" />

                  <h2 className="font-semibold">
                    Opportunity Fit
                  </h2>
                </div>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  AI-powered analysis will explain how this opportunity
                  matches your profile.
                </p>

                <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
                  Coming after the core platform is complete.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}