"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

type AccountType = "student" | "organization";

type RegisterResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      role: "student" | "admin";
    };
  };
};

export default function RegisterPage() {
  const router = useRouter();

  const [accountType, setAccountType] =
    useState<AccountType>("student");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isOrganization =
    accountType === "organization";

  const handleAccountTypeChange = (
    type: AccountType
  ) => {
    setAccountType(type);
    setError("");
  };

  const handleRegister = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await apiRequest<RegisterResponse>(
          "/auth/register",
          {
            method: "POST",
            body: JSON.stringify({
              name,
              email,
              password,
              role: isOrganization
                ? "admin"
                : "student",
            }),
          }
        );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      if (response.data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f9ff] text-slate-900">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/4 -z-0 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="pointer-events-none absolute bottom-1/4 right-0 -z-0 h-52 w-52 rounded-full bg-purple-200/30 blur-3xl" />

        <Link
          href="/"
          className="relative z-10 mb-10 text-center text-xl font-semibold tracking-tight text-slate-900"
        >
          campus<span className="gemini-text">.</span>
        </Link>

        <div className="relative z-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(80,70,180,0.08)]">
          <div className="mb-7">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Choose how you want to use Campus.
            </p>
          </div>

          {/* Account type */}
          <div className="mb-7">
            <label className="mb-3 block text-sm font-medium text-slate-700">
              Account type
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  handleAccountTypeChange("student")
                }
                className={`rounded-2xl border p-4 text-left transition ${
                  accountType === "student"
                    ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="mb-2 text-lg">
                  🎓
                </div>

                <div className="text-sm font-semibold text-slate-900">
                  Student
                </div>

                <div className="mt-1 text-xs leading-5 text-slate-500">
                  Discover opportunities
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleAccountTypeChange(
                    "organization"
                  )
                }
                className={`rounded-2xl border p-4 text-left transition ${
                  accountType === "organization"
                    ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="mb-2 text-lg">
                  🏢
                </div>

                <div className="text-sm font-semibold text-slate-900">
                  Organization
                </div>

                <div className="mt-1 text-xs leading-5 text-slate-500">
                  Post and manage opportunities
                </div>
              </button>
            </div>
          </div>

          {/* Account description */}
          <div className="mb-6 rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-xs font-medium text-violet-600">
              {isOrganization
                ? "Organization account"
                : "Student account"}
            </div>

            <div className="mt-1 text-sm text-slate-600">
              {isOrganization
                ? "Manage opportunities and applications."
                : "Discover, save and apply to opportunities."}
            </div>
          </div>

          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                {isOrganization
                  ? "Organization name"
                  : "Full name"}
              </label>

              <input
                id="name"
                type="text"
                placeholder={
                  isOrganization
                    ? "Your organization name"
                    : "Your name"
                }
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="gemini-gradient w-full rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg shadow-violet-200 transition hover:scale-[1.01] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating account..."
                : isOrganization
                ? "Create organization account"
                : "Create student account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-violet-600 hover:text-violet-700"
            >
              Sign in
            </Link>
          </p>
        </div>

        <Link
          href="/"
          className="relative z-10 mt-8 text-center text-xs text-slate-400 transition hover:text-slate-600"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}