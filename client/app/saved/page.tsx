"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  BookmarkX,
  BriefcaseBusiness,
  MapPin,
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
  deadline: string;
};

type SavedItem = {
  _id: string;
  opportunity?: Opportunity;
  createdAt?: string;
};

type SavedResponse = {
  success: boolean;
  count: number;
  data: SavedItem[];
};

export default function SavedPage() {
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadSaved = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await apiRequest<SavedResponse>("/saved", {
        token,
      });

      setSaved(response.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load saved opportunities"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleUnsave = async (
    e: React.MouseEvent,
    opportunityId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setRemovingId(opportunityId);
      setError("");

      await apiRequest(`/saved/${opportunityId}`, {
        method: "DELETE",
        token,
      });

      setSaved((current) =>
        current.filter(
          (item) => item.opportunity?._id !== opportunityId
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to remove saved opportunity"
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center px-6 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Bookmark className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Saved Opportunities
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Opportunities you've saved for later.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-3xl bg-muted"
              />
            ))}
          </div>
        ) : saved.length === 0 ? (
          /* Empty State */
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <Bookmark className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Nothing saved yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              When you find an opportunity you're interested in,
              save it here so you can come back to it later.
            </p>

            <Link
              href="/opportunities"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <BriefcaseBusiness className="h-4 w-4" />
              Explore Opportunities
            </Link>
          </div>
        ) : (
          /* Saved Opportunities */
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {saved.map((item) => {
              const opportunity = item.opportunity;

              if (!opportunity) {
                return null;
              }

              return (
                <div
                  key={item._id}
                  className="group rounded-3xl border border-border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Top */}
                  <div className="flex items-start justify-between gap-4">
                    <Link
                      href={`/opportunities/${opportunity._id}`}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-violet-50 text-violet-600"
                    >
                      <BriefcaseBusiness className="h-5 w-5" />
                    </Link>

                    {/* Unsave */}
                    <button
                      onClick={(e) =>
                        handleUnsave(e, opportunity._id)
                      }
                      disabled={
                        removingId === opportunity._id
                      }
                      title="Remove from saved"
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <BookmarkX className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Title */}
                  <Link
                    href={`/opportunities/${opportunity._id}`}
                  >
                    <h2 className="mt-5 line-clamp-2 font-semibold leading-6 transition group-hover:text-primary">
                      {opportunity.title}
                    </h2>

                    <p className="mt-1 text-sm font-medium text-muted-foreground">
                      {opportunity.organization}
                    </p>

                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {opportunity.description}
                    </p>
                  </Link>

                  {/* Tags */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                      {opportunity.type}
                    </span>

                    <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-600">
                      {opportunity.mode}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {opportunity.location}
                  </div>

                  {/* Footer */}
                  <div className="mt-5 border-t border-border pt-4">
                    <Link
                      href={`/opportunities/${opportunity._id}`}
                      className="text-sm font-medium text-primary"
                    >
                      View opportunity →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}