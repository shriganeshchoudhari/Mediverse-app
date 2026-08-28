"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../config/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "../../components/ToastContext";
import {
  User,
  Shield,
  Palette,
  HardDrive,
  CheckCircle2,
  Lock,
  Mail,
  UserCheck
} from "lucide-react";
import ThemeAccessibilityManager from "../../components/settings/ThemeAccessibilityManager";
import OfflineCacheManager from "../../components/offline/OfflineCacheManager";

type SettingsTab = "profile" | "security" | "appearance" | "offline";

export default function SettingsPage() {
  const { token, user, logout } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
    } else {
      // Fetch current profile
      fetch("/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setEmail(data.email || (user as any)?.email || "");
      })
      .catch(err => console.error(err));
    }
  }, [token, router, user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ firstName, lastName })
      });
      if (res.ok) {
        showToast("Profile updated successfully!", "success");
      } else {
        const errorData = await res.json();
        showToast(errorData.error || "Failed to update profile.", "error");
      }
    } catch (err) {
      showToast("An error occurred.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match.", "error");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/users/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      if (res.ok) {
        showToast("Password changed successfully!", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const errorData = await res.json();
        showToast(errorData.error || "Failed to change password.", "error");
      }
    } catch (err) {
      showToast("An error occurred.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">System Settings</h1>
          <p className="text-slate-400 text-sm">
            Manage account authentication, accessibility options, WCAG visual modes, and offline PWA storage.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2 mb-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 pb-3 pt-2 px-3.5 text-sm font-medium transition-all border-b-2 rounded-t-lg ${
              activeTab === "profile"
                ? "border-blue-500 text-white bg-slate-900/40"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20"
            }`}
          >
            <User className="w-4 h-4 text-blue-400" />
            <span>Profile Information</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 pb-3 pt-2 px-3.5 text-sm font-medium transition-all border-b-2 rounded-t-lg ${
              activeTab === "security"
                ? "border-blue-500 text-white bg-slate-900/40"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20"
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Security & Password</span>
          </button>

          <button
            onClick={() => setActiveTab("appearance")}
            className={`flex items-center gap-2 pb-3 pt-2 px-3.5 text-sm font-medium transition-all border-b-2 rounded-t-lg ${
              activeTab === "appearance"
                ? "border-blue-500 text-white bg-slate-900/40"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20"
            }`}
          >
            <Palette className="w-4 h-4 text-purple-400" />
            <span>Theme & Accessibility</span>
          </button>

          <button
            onClick={() => setActiveTab("offline")}
            className={`flex items-center gap-2 pb-3 pt-2 px-3.5 text-sm font-medium transition-all border-b-2 rounded-t-lg ${
              activeTab === "offline"
                ? "border-blue-500 text-white bg-slate-900/40"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20"
            }`}
          >
            <HardDrive className="w-4 h-4 text-amber-400" />
            <span>Offline & PWA Cache</span>
          </button>
        </div>

        {/* Tab 1: Profile Information */}
        {activeTab === "profile" && (
          <form onSubmit={handleProfileUpdate} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Update Profile</h2>
              </div>
              <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
                Physician / Medical Student Profile
              </span>
            </div>

            {email && (
              <div className="mb-6 bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">Account Email</div>
                  <div className="text-sm font-medium text-slate-200">{email}</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-6 rounded-xl transition disabled:opacity-50 shadow-lg"
            >
              {isLoading ? "Saving..." : "Save Profile Changes"}
            </button>
          </form>
        )}

        {/* Tab 2: Security & Password */}
        {activeTab === "security" && (
          <form onSubmit={handlePasswordUpdate} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-semibold text-white">Change Password</h2>
              </div>
              <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
                End-to-End Encrypted Auth
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-6 rounded-xl transition disabled:opacity-50 shadow-lg"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        {/* Tab 3: Theme & Accessibility Manager */}
        {activeTab === "appearance" && (
          <ThemeAccessibilityManager />
        )}

        {/* Tab 4: Offline & PWA Cache Manager */}
        {activeTab === "offline" && (
          <OfflineCacheManager />
        )}
      </div>
    </div>
  );
}
