"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { curriculumApi, CatalogSubject } from "../lib/api/curriculum";

interface UseCurriculumCatalogResult {
  subjects: CatalogSubject[];
  loading: boolean;
  error: string | null;
  /** Computed stats from the live catalog */
  totalSubjects: number;
  totalChapters: number;
  totalMinutes: number;
}

// Simple module-level cache so every component that mounts this hook in the
// same page session doesn't re-walk the whole curriculum tree from scratch.
let cachedSubjects: CatalogSubject[] | null = null;
let inFlight: Promise<CatalogSubject[]> | null = null;

/**
 * Single source of truth for "what's in the syllabus" on the client.
 *
 * The database (via CurriculumController) is the **only** data source.
 * There is no static/offline fallback — the app is inherently
 * server-dependent (auth, progress, quiz all require the backend).
 * If the backend is unreachable, an error state is returned so the
 * UI can show a retry prompt.
 */
export function useCurriculumCatalog(): UseCurriculumCatalogResult {
  const [subjects, setSubjects] = useState<CatalogSubject[]>(cachedSubjects ?? []);
  const [loading, setLoading] = useState(!cachedSubjects);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    if (cachedSubjects) {
      setSubjects(cachedSubjects);
      setLoading(false);
      return () => {
        mounted.current = false;
      };
    }

    if (!inFlight) {
      inFlight = curriculumApi.getFullCatalog();
    }

    inFlight
      .then((result) => {
        cachedSubjects = result;
        if (!mounted.current) return;
        setSubjects(cachedSubjects);
        setError(null);
      })
      .catch((err) => {
        console.error("Curriculum API unreachable:", err);
        if (!mounted.current) return;
        setSubjects([]);
        setError("Could not load curriculum. Please check your connection and try again.");
      })
      .finally(() => {
        inFlight = null;
        if (mounted.current) setLoading(false);
      });

    return () => {
      mounted.current = false;
    };
  }, []);

  const totalSubjects = subjects.length;
  const totalChapters = useMemo(
    () => subjects.reduce((sum, s) => sum + s.chapters.length, 0),
    [subjects]
  );
  const totalMinutes = useMemo(
    () =>
      subjects.reduce(
        (sum, s) => sum + s.chapters.reduce((cSum, c) => cSum + c.estimatedMinutes, 0),
        0
      ),
    [subjects]
  );

  return { subjects, loading, error, totalSubjects, totalChapters, totalMinutes };
}
