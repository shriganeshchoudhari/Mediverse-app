"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { cmsApi, ContentReview, LessonDetail } from "../../../lib/api/cms";
import { ApiError } from "../../../lib/api/client";
import ContentBlockRenderer from "../../../components/lessons/ContentBlockRenderer";

const STATUS_BADGE_STYLES: Record<string, string> = {
  IN_REVIEW: "bg-amber-100 text-amber-800",
  DRAFT: "bg-slate-100 text-slate-700",
  REJECTED: "bg-red-100 text-red-800",
  PUBLISHED: "bg-green-100 text-green-800",
  APPROVED: "bg-green-100 text-green-800",
};

export default function LessonReviewPage() {
  const params = useParams<{ lessonId: string }>();
  const router = useRouter();
  const lessonId = params.lessonId;

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [history, setHistory] = useState<ContentReview[]>([]);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [lessonData, historyData] = await Promise.all([
        cmsApi.getLesson(lessonId),
        cmsApi.history(lessonId).catch(() => []),
      ]);
      setLesson(lessonData);
      setHistory(historyData);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load lesson.");
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDecision = async (decision: "approve" | "reject") => {
    if (decision === "reject" && !comments.trim()) {
      setError("Please add a comment explaining the rejection before rejecting.");
      return;
    }
    setSubmitting(decision);
    setError(null);
    try {
      if (decision === "approve") {
        await cmsApi.approve(lessonId, comments.trim() || undefined);
      } else {
        await cmsApi.reject(lessonId, comments.trim() || undefined);
      }
      router.push("/cms");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : `Failed to ${decision} lesson.`);
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !lesson) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
        <Link href="/cms" className="text-sm underline mt-2 inline-block">
          Back to queue
        </Link>
      </div>
    );
  }

  if (!lesson) return null;

  const canDecide = lesson.status === "IN_REVIEW";

  return (
    <div>
      <Link href="/cms" className="text-sm text-blue-600 hover:text-blue-800 mb-4 inline-block">
        &larr; Back to review queue
      </Link>

      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{lesson.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{lesson.breadcrumb}</p>
        </div>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            STATUS_BADGE_STYLES[lesson.status] || "bg-slate-100 text-slate-700"
          }`}
        >
          {lesson.status}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg my-4 text-sm">{error}</div>
      )}

      {/* Content preview */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 my-6">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Content preview ({lesson.contentBlocks.length} block{lesson.contentBlocks.length === 1 ? "" : "s"})
        </h3>
        {lesson.contentBlocks.length === 0 ? (
          <p className="text-sm text-slate-400 italic">This lesson has no content blocks yet.</p>
        ) : (
          <div className="space-y-6">
            {lesson.contentBlocks.map((block) => (
              <div key={block.id} className="border-b border-slate-100 dark:border-slate-700 pb-6 last:border-0 last:pb-0">
                <div className="text-xs font-mono text-slate-400 mb-2">{block.type}</div>
                <ContentBlockRenderer block={block} chapterId={lesson.id} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review decision panel */}
      {canDecide ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Review decision</h3>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Comments (required for rejection, optional for approval)"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 text-sm mb-4"
            rows={3}
          />
          <div className="flex gap-3">
            <button
              onClick={() => handleDecision("approve")}
              disabled={submitting !== null}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg"
            >
              {submitting === "approve" ? "Approving..." : "Approve & Publish"}
            </button>
            <button
              onClick={() => handleDecision("reject")}
              disabled={submitting !== null}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg"
            >
              {submitting === "reject" ? "Rejecting..." : "Reject"}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 text-sm text-slate-500">
          This lesson is not currently awaiting review (status: {lesson.status}).
        </div>
      )}

      {/* Review history */}
      {history.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Review history</h3>
          <ul className="space-y-3">
            {history.map((review) => (
              <li
                key={review.id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      STATUS_BADGE_STYLES[review.decision] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {review.decision}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(review.createdAt).toLocaleString()}
                  </span>
                </div>
                {review.comments && <p className="text-slate-600 dark:text-slate-300 mt-1">{review.comments}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
