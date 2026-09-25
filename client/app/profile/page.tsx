"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Save,
  Upload,
  UserRound,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

type Profile = {
  name?: string;
  email?: string;
  college?: string;
  degree?: string;
  branch?: string;
  currentYear?: string;
  skills?: string[];
  interests?: string[];
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  resumeFileName?: string;
  resumeMimeType?: string;
};

type ProfileResponse = {
  success: boolean;
  data?: Profile;
  message?: string;
};

type ResumeUploadResponse = {
  success: boolean;
  message?: string;
  data?: {
    resumeFileName?: string;
    resumeMimeType?: string;
    hasResume?: boolean;
  };
};

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] =
    useState(false);

  const [saved, setSaved] = useState(false);
  const [resumeUploaded, setResumeUploaded] =
    useState(false);

  const [error, setError] = useState("");
  const [resumeError, setResumeError] = useState("");

  const [resumeFileName, setResumeFileName] =
    useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    college: "",
    degree: "",
    branch: "",
    currentYear: "",
    skills: "",
    interests: "",
    bio: "",
    githubUrl: "",
    linkedinUrl: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await apiRequest<ProfileResponse>(
            "/profile/me",
            {
              token,
            }
          );

        const profile = response.data;

        if (profile) {
          setForm({
            name: profile.name || "",
            email: profile.email || "",
            college: profile.college || "",
            degree: profile.degree || "",
            branch: profile.branch || "",
            currentYear: profile.currentYear || "",
            skills: profile.skills?.join(", ") || "",
            interests:
              profile.interests?.join(", ") || "",
            bio: profile.bio || "",
            githubUrl: profile.githubUrl || "",
            linkedinUrl:
              profile.linkedinUrl || "",
          });

          setResumeFileName(
            profile.resumeFileName || ""
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));

    setSaved(false);
    setError("");
  };

  const handleResumeUpload = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setResumeError("");
    setResumeUploaded(false);

    if (file.type !== "application/pdf") {
      setResumeError(
        "Only PDF resume files are allowed."
      );

      e.target.value = "";
      return;
    }

    if (file.size > MAX_RESUME_SIZE) {
      setResumeError(
        "Resume must be smaller than 5 MB."
      );

      e.target.value = "";
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setUploadingResume(true);

      const formData = new FormData();
      formData.append("resume", file);

      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:5000/api";

      const response = await fetch(
        `${apiBaseUrl}/profile/me/resume`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data =
        (await response.json()) as ResumeUploadResponse;

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to upload resume"
        );
      }

      setResumeFileName(
        data.data?.resumeFileName ||
          file.name
      );

      setResumeUploaded(true);
    } catch (err) {
      setResumeError(
        err instanceof Error
          ? err.message
          : "Failed to upload resume"
      );
    } finally {
      setUploadingResume(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setSaving(true);
      setSaved(false);
      setError("");

      await apiRequest("/profile/me", {
        method: "PATCH",
        token,
        body: JSON.stringify({
          name: form.name,
          college: form.college,
          degree: form.degree,
          branch: form.branch,

          // Backend field is currentYear, not year.
          currentYear: form.currentYear,

          skills: form.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),

          interests: form.interests
            .split(",")
            .map((interest) => interest.trim())
            .filter(Boolean),

          bio: form.bio,
          githubUrl: form.githubUrl,
          linkedinUrl: form.linkedinUrl,
        }),
      });

      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);

          localStorage.setItem(
            "user",
            JSON.stringify({
              ...user,
              name: form.name,
            })
          );
        } catch {
          // Ignore invalid localStorage data.
        }
      }

      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />

          <div className="mt-8 h-[650px] animate-pulse rounded-3xl bg-muted" />
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
            href="/dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white transition hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Your account
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Profile
            </h1>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          {/* Profile Summary */}

          <aside className="h-fit rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500 text-2xl font-semibold text-white shadow-sm">
                {form.name
                  ? form.name
                      .charAt(0)
                      .toUpperCase()
                  : "U"}
              </div>

              <h2 className="mt-4 font-semibold">
                {form.name || "Your Name"}
              </h2>

              <p className="mt-1 break-all text-xs text-muted-foreground">
                {form.email}
              </p>

              <div className="mt-5 w-full rounded-xl bg-muted/50 px-4 py-3 text-left">
                <p className="text-xs font-medium text-muted-foreground">
                  Profile purpose
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Your profile helps Campus
                  Opportunity Hub understand
                  which opportunities are
                  relevant to you.
                </p>
              </div>
            </div>
          </aside>

          {/* Form */}

          <section className="rounded-3xl border border-border bg-white p-6 shadow-sm md:p-8">
            <div className="mb-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <UserRound className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Personal information
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Keep your profile updated.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Name + Email */}

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Full Name
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email
                  </label>

                  <input
                    value={form.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground outline-none"
                    placeholder="Your email"
                  />
                </div>
              </div>

              {/* College + Degree */}

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    College / University
                  </label>

                  <input
                    name="college"
                    value={form.college}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder="Your university"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Degree
                  </label>

                  <input
                    name="degree"
                    value={form.degree}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder="B.Tech"
                  />
                </div>
              </div>

              {/* Branch + Current Year */}

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Branch
                  </label>

                  <input
                    name="branch"
                    value={form.branch}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder="AI & ML"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Current Year
                  </label>

                  <select
                    name="currentYear"
                    value={form.currentYear}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    <option value="">
                      Select year
                    </option>

                    <option value="1st Year">
                      1st Year
                    </option>

                    <option value="2nd Year">
                      2nd Year
                    </option>

                    <option value="3rd Year">
                      3rd Year
                    </option>

                    <option value="4th Year">
                      4th Year
                    </option>
                  </select>
                </div>
              </div>

              {/* Skills */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Skills
                </label>

                <input
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="React, JavaScript, MongoDB, Python"
                />

                <p className="mt-2 text-xs text-muted-foreground">
                  Separate skills using commas.
                </p>
              </div>

              {/* Interests */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Interests
                </label>

                <input
                  name="interests"
                  value={form.interests}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="AI, Full Stack Development, Startups"
                />

                <p className="mt-2 text-xs text-muted-foreground">
                  Separate interests using commas.
                </p>
              </div>

              {/* Bio */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Short Bio
                </label>

                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={5}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Tell us briefly about what you're learning and what opportunities you're looking for."
                />
              </div>

              {/* GitHub + LinkedIn */}

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    GitHub URL
                  </label>

                  <input
                    name="githubUrl"
                    type="url"
                    value={form.githubUrl}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder="https://github.com/username"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    LinkedIn URL
                  </label>

                  <input
                    name="linkedinUrl"
                    type="url"
                    value={form.linkedinUrl}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              {/* Resume */}

              <div className="rounded-2xl border border-border bg-muted/20 p-5">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Resume
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Upload your resume as a PDF.
                      Maximum size is 5 MB.
                    </p>
                  </div>
                </div>

                {resumeFileName && (
                  <div className="mb-4 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                    <FileText className="h-5 w-5 shrink-0 text-green-600" />

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-green-700">
                        Current resume
                      </p>

                      <p className="truncate text-sm text-green-800">
                        {resumeFileName}
                      </p>
                    </div>

                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                  </div>
                )}

                <label
                  htmlFor="resume"
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-medium shadow-sm transition hover:bg-muted ${
                    uploadingResume
                      ? "pointer-events-none opacity-60"
                      : ""
                  }`}
                >
                  <Upload className="h-4 w-4" />

                  {uploadingResume
                    ? "Uploading..."
                    : resumeFileName
                    ? "Replace Resume"
                    : "Upload Resume"}

                  <input
                    id="resume"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleResumeUpload}
                    disabled={uploadingResume}
                    className="hidden"
                  />
                </label>

                {resumeUploaded && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    <CheckCircle2 className="h-4 w-4" />

                    Resume uploaded successfully.
                  </div>
                )}

                {resumeError && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {resumeError}
                  </div>
                )}
              </div>

              {/* Error */}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Success */}

              {saved && (
                <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  <CheckCircle2 className="h-4 w-4" />

                  Profile updated successfully.
                </div>
              )}

              {/* Submit */}

              <div className="flex justify-end border-t border-border pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />

                  {saving
                    ? "Saving..."
                    : "Save Profile"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}