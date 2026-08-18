"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cmsApi, LessonQueueItem } from "../../lib/api/cms";
import { ApiError } from "../../lib/api/client";

const STATUS_TABS = [
  { value: "IN_REVIEW", label: "In Review" },
  { value: "DRAFT", label: "Drafts" },
  { value: "REJECTED", label: "Rejected" },
  { value: "PUBLISHED", label: "Published" },
];

const STATUS_BADGE_STYLES: Record<string, string> = {
  IN_REVIEW: "bg-amber-100 text-amber-800",
  DRAFT: "bg-slate-100 text-slate-700",
  REJECTED: "bg-red-100 text-red-800",
  PUBLISHED: "bg-green-100 text-green-800",
  APPROVED: "bg-green-100 text-green-800",
};

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CmsReviewQueuePage() {
  const [status, setStatus] = useState("IN_REVIEW");
  const [lessons, setLessons] = useState<LessonQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    cmsApi
      .listLessons(status)
      .then((data) => {
        if (!cancelled) setLessons(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Failed to load lessons.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [status]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Content Review Queue</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Review and publish lesson content submitted by authors.
        </p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              status === tab.value
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Lesson
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Curriculum path
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {lessons.map((lesson) => (
                <tr key={lesson.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                    {lesson.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{lesson.breadcrumb}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        STATUS_BADGE_STYLES[lesson.status] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {lesson.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {timeAgo(lesson.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link href={`/cms/${lesson.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      Review &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
              {lessons.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                    No lessons with status &ldquo;{status}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
