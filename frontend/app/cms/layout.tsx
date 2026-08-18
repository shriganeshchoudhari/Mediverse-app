"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../config/AuthContext";

// Mirrors com.curiolearn.user.Roles.CONTENT_REVIEWERS / CONTENT_AUTHORS on the backend.
const CMS_ROLES = ["SUPER_ADMIN", "ADMIN", "FACULTY", "CONTENT_WRITER", "MEDICAL_REVIEWER", "EDITOR"];

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
      } else if (!CMS_ROLES.includes(user.role)) {
        router.push("/dashboard");
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, loading, router]);

  if (loading || !isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </div>
  );
}
