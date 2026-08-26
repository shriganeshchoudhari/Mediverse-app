"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../config/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to log in");
      }

      const data = await res.json();
      login(
        data.token,
        {
          userId: data.userId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
        },
        data.refreshToken
      );

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-xl p-8 shadow-xl shadow-blue-950/20">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 items-center justify-center text-blue-400 shadow-inner mb-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mt-2">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to your Mediverse Medical Education & Simulation account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:border-blue-600 focus:outline-none transition"
              placeholder="you@school.edu"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 pr-10 text-sm text-slate-200 focus:border-blue-600 focus:outline-none transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Keep me logged in</span>
            <Link
              href="/auth/forgot-password"
              className="text-blue-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-md shadow-blue-900/30 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-blue-400 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
