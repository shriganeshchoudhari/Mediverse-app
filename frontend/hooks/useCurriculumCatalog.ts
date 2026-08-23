"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { curriculumApi, CatalogSubject } from "../lib/api/curriculum";
import { MEDICAL_CURRICULUM_SCAFFOLD } from "../lib/curriculum/medicalCurriculumScaffold";

interface UseCurriculumCatalogResult {
  subjects: CatalogSubject[];
  loading: boolean;
  error: string | null;
  /** Computed stats from the live catalog */
  totalSubjects: number;
  totalChapters: number;
  totalMinutes: number;
}

function getScaffoldFallback(): CatalogSubject[] {
  return MEDICAL_CURRICULUM_SCAFFOLD.map((s) => ({
    id: s.id,
    title: s.title,
    semester: s.phase === "PRE_CLINICAL" ? 1 : s.phase === "PARA_CLINICAL" ? 3 : 5,
    category: s.phase,
    chapters: s.units.flatMap((u) =>
      u.chapters.map((c) => ({
        id: c.id,
        title: c.title,
        estimatedMinutes: c.estimatedMinutes || 45,
        difficulty: "Intermediate" as const,
        section: u.title,
      }))
    ),
  }));
}

// Simple module-level cache so every component that mounts this hook in the
// same page session doesn't re-walk the whole curriculum tree from scratch.
let cachedSubjects: CatalogSubject[] | null = null;
let inFlight: Promise<CatalogSubject[]> | null = null;

export function useCurriculumCatalog(): UseCurriculumCatalogResult {
  const [subjects, setSubjects] = useState<CatalogSubject[]>(cachedSubjects ?? getScaffoldFallback());
  const [loading, setLoading] = useState(!cachedSubjects);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    if (cachedSubjects && cachedSubjects.length > 0) {
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
        if (result && result.length > 0) {
          cachedSubjects = result;
          if (!mounted.current) return;
          setSubjects(cachedSubjects);
          setError(null);
        } else {
          // Fallback if empty array returned
          const fallback = getScaffoldFallback();
          if (!mounted.current) return;
          setSubjects(fallback);
          setError(null);
        }
      })
      .catch((err) => {
        console.warn("Curriculum API unreachable, using authoritative scaffold fallback:", err);
        const fallback = getScaffoldFallback();
        if (!mounted.current) return;
        setSubjects(fallback);
        setError(null);
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
