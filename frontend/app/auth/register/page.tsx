"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../config/AuthContext";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length > 5) strength++;
    if (pass.length > 7) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    return strength;
  };
  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to register account");
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
      setError(err.message || "Registration failed. Email might already be taken.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950 px-4 py-8">
      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-xl p-8 shadow-xl shadow-blue-950/20">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 items-center justify-center text-blue-400 shadow-inner mb-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mt-2">Create Account</h2>
          <p className="text-xs text-slate-400 mt-1">Join Mediverse for interactive medical curriculum and clinical simulation labs</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:border-blue-600 focus:outline-none transition"
                placeholder="John"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:border-blue-600 focus:outline-none transition"
                placeholder="Doe"
              />
            </div>
          </div>

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
              placeholder="john.doe@school.edu"
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
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 text-sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {password && (
              <div className="mt-2 flex gap-1 h-1.5">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`flex-1 rounded-full ${
                      level <= strength
                        ? strength <= 1 ? "bg-red-500" : strength === 2 ? "bg-amber-500" : strength === 3 ? "bg-blue-500" : "bg-emerald-500"
                        : "bg-slate-800"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:border-blue-600 focus:outline-none transition"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-md shadow-blue-900/30 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-400 hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
