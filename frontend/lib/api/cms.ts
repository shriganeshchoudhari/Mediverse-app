/**
 * Typed wrapper around the backend's CMS content-review workflow API
 * (CmsReviewController: /api/v1/cms/lessons/...).
 *
 * Drives the DRAFT -> IN_REVIEW -> (APPROVED -> PUBLISHED | REJECTED)
 * workflow. All endpoints require an authenticated user with one of the
 * CMS roles (see backend com.curiolearn.user.Roles) — the apiClient
 * automatically attaches the bearer token from localStorage.
 */

import { apiClient } from "./client";
import type { ContentBlockDto } from "./curriculum";

export interface LessonQueueItem {
  id: string;
  title: string;
  status: string;
  version: number;
  createdAt: string;
  conceptId: string;
  breadcrumb: string;
}

export interface LessonDetail {
  id: string;
  title: string;
  status: string;
  version: number;
  createdAt: string;
  breadcrumb: string;
  contentBlocks: ContentBlockDto[];
}

export interface ContentReview {
  id: string;
  decision: "APPROVED" | "REJECTED";
  comments?: string;
  lessonVersionReviewed: number;
  createdAt: string;
  reviewer?: { firstName?: string; lastName?: string; email?: string };
}

export const cmsApi = {
  /** Lessons currently in a given workflow state. Defaults to the review queue. */
  listLessons: (status: string = "IN_REVIEW") =>
    apiClient.get<LessonQueueItem[]>(`/cms/lessons?status=${encodeURIComponent(status)}`),

  getLesson: (lessonId: string) => apiClient.get<LessonDetail>(`/cms/lessons/${lessonId}`),

  submitForReview: (lessonId: string) =>
    apiClient.post<LessonDetail>(`/cms/lessons/${lessonId}/submit-for-review`),

  approve: (lessonId: string, comments?: string) =>
    apiClient.post<LessonDetail>(`/cms/lessons/${lessonId}/approve`, { comments }),

  reject: (lessonId: string, comments?: string) =>
    apiClient.post<LessonDetail>(`/cms/lessons/${lessonId}/reject`, { comments }),

  history: (lessonId: string) =>
    apiClient.get<ContentReview[]>(`/cms/lessons/${lessonId}/history`),
};
