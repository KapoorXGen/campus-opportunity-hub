"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      role: string;
    };
  };
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response =
        await apiRequest<LoginResponse>("/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
        });

      const token = response.data.token;
      const user = response.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      const role = user.role?.toLowerCase();

      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login failed. Please check your credentials."
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

        {/* Logo */}
        <Link
          href="/"
          className="relative z-10 mb-10 text-center text-xl font-semibold tracking-tight text-slate-900"
        >
          campus<span className="gemini-text">.</span>
        </Link>

        {/* Login Card */}
        <div className="relative z-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(80,70,180,0.08)]">
          <div className="mb-8">
            <div className="mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
              Welcome back
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Sign in to your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Continue discovering opportunities built around
              you.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            {/* Email */}
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
                autoComplete="email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs font-medium text-violet-600 transition hover:text-violet-700"
                >
                  Forgot password?
                </button>
              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="gemini-gradient w-full rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg shadow-violet-200 transition hover:scale-[1.01] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Signing in..."
                : "Sign in"}
            </button>
          </form>
        </div>

        {/* Register */}
        <p className="relative z-10 mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-violet-600 transition hover:text-violet-700"
          >
            Create one
          </Link>
        </p>

        {/* Back */}
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