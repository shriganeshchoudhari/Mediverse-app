"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../config/AuthContext";
import { useCurriculumCatalog } from "../../hooks/useCurriculumCatalog";
import { CatalogSubject } from "../../lib/api/curriculum";

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-500/10 text-green-400 border-green-500/30",
  Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Advanced: "bg-red-500/10 text-red-400 border-red-500/30",
};

interface ProgressItem {
  lessonId: string;
  completionPercentage: number;
  completed: boolean;
}

export default function SyllabusSearchGrid() {
  const { token, loading: authLoading } = useAuth();
  const { subjects, loading: catalogLoading, error: catalogError } = useCurriculumCatalog();

  const [search, setSearch] = useState("");
  const [activeYear, setActiveYear] = useState<string>("1st Professional");
  const [activeSubjectId, setActiveSubjectId] = useState<string>("");
  const [activeSemester, setActiveSemester] = useState<number | "All">("All");
  const [progressList, setProgressList] = useState<ProgressItem[]>([]);

  // Map Professional Years to NMC Semesters
  const yearSemesters: Record<string, number[]> = {
    "1st Professional": [1, 2],
    "2nd Professional": [3, 4],
    "3rd Professional I": [5, 6],
    "Final Professional II": [7, 8, 9],
    "Internship (CRMI)": [10]
  };

  // Fetch progress data
  useEffect(() => {
    if (authLoading) return;
    if (token) {
      fetch("http://localhost:8085/api/v1/progress", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setProgressList(data))
        .catch(() => {});
    }
  }, [token, authLoading]);

  // Auto-select first subject when catalog loads or year/semester changes
  useEffect(() => {
    if (subjects.length === 0) return;
    const yearSemList = yearSemesters[activeYear];
    const matchingSubj = subjects.find(s => {
      const matchesYear = yearSemList.includes(s.semester);
      const matchesSem = activeSemester === "All" || s.semester === activeSemester;
      return matchesYear && matchesSem;
    });
    if (matchingSubj && matchingSubj.id !== activeSubjectId) {
      setActiveSubjectId(matchingSubj.id);
    }
  }, [subjects, activeYear, activeSemester]);

  // Filter subjects based on active year, active semester, and search criteria
  const filteredSubjects = subjects
    .filter(subj => {
      const allowedSemesters = yearSemesters[activeYear];
      const matchesYear = allowedSemesters.includes(subj.semester);
      const matchesSemester = activeSemester === "All" || subj.semester === activeSemester;
      return matchesYear && matchesSemester;
    })
    .map(subj => {
      const filteredChapters = subj.chapters.filter(chap =>
        chap.title.toLowerCase().includes(search.toLowerCase())
      );
      return { ...subj, chapters: filteredChapters };
    })
    .filter(subj => subj.chapters.length > 0);

  const currentSubject = filteredSubjects.find(s => s.id === activeSubjectId) || filteredSubjects[0];

  if (catalogLoading || authLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-slate-400 font-semibold animate-pulse uppercase tracking-widest text-xs">
          Loading Curriculum...
        </div>
      </div>
    );
  }

  if (catalogError) {
    return (
      <div className="bg-slate-900 border border-red-900/50 rounded-2xl p-12 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <p className="text-red-400 text-sm font-medium">{catalogError}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Year Selection Selector */}
      <div className="flex justify-center border-b border-slate-800 pb-4">
        <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80 gap-1">
          {[
            { key: "1st Professional", label: "1st Professional (Sem 1-2)" },
            { key: "2nd Professional", label: "2nd Professional (Sem 3-4)" },
            { key: "3rd Professional I", label: "3rd Professional I (Sem 5-6)" },
            { key: "Final Professional II", label: "Final Professional II (Sem 7-9)" },
            { key: "Internship (CRMI)", label: "Internship (CRMI)" }
          ].map(yr => (
            <button
              key={yr.key}
              onClick={() => {
                setActiveYear(yr.key);
                setActiveSemester("All");
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeYear === yr.key
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {yr.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subject and Semester Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex flex-wrap gap-2">
          {/* Semester Selector */}
          <div className="flex items-center gap-2 mr-4 border-r border-slate-800 pr-4">
            <span className="text-xs font-bold text-slate-500 uppercase">Sem:</span>
            <select
              value={activeSemester}
              onChange={e => {
                const val = e.target.value;
                setActiveSemester(val === "All" ? "All" : Number(val));
              }}
              className="bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-white p-2 outline-none focus:border-blue-600"
            >
              <option value="All">All Semesters</option>
              {yearSemesters[activeYear].map(semNum => (
                <option key={semNum} value={semNum}>Semester {semNum}</option>
              ))}
            </select>
          </div>

          {/* Subject Tabs */}
          {subjects
            .filter(subj => {
              const matchesYear = yearSemesters[activeYear].includes(subj.semester);
              const matchesSem = activeSemester === "All" || subj.semester === activeSemester;
              return matchesYear && matchesSem;
            })
            .map((subj, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSubjectId(subj.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                  activeSubjectId === subj.id
                    ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-800'
                }`}
              >
                {subj.title}
              </button>
            ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">🔍</span>
          <input
            type="text"
            placeholder="Search syllabus chapters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-300 outline-none focus:border-blue-600 transition"
          />
        </div>
      </div>

      {/* Chapters Grid */}
      {currentSubject ? (
        <section className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-black text-white">{currentSubject.title} Chapters</h2>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
              Semester {currentSubject.semester} • {currentSubject.category} • {currentSubject.chapters.length} Chapters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSubject.chapters.map((chapter) => {
              const progress = progressList.find(p => p.lessonId === chapter.id);
              const isCompleted = progress?.completed ?? false;
              const percentage = progress?.completionPercentage ?? 0;

              return (
                <Link
                  key={chapter.id}
                  href={`/lessons/${chapter.id}`}
                  className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-xl p-5 hover:border-blue-600/50 hover:bg-slate-900/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-950/20"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors leading-snug">
                      {chapter.title}
                    </h3>
                    <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${difficultyColors[chapter.difficulty]}`}>
                      {chapter.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        🕐 {chapter.estimatedMinutes} min
                      </span>
                      <span className="flex items-center gap-1">
                        📝 {chapter.section}
                      </span>
                    </div>

                    {isCompleted ? (
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                        Done
                      </span>
                    ) : percentage > 0 ? (
                      <span className="text-[9px] text-blue-400 font-bold">
                        {percentage}%
                      </span>
                    ) : null}
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 italic text-sm">
          No matching subjects or chapters found for your filters.
        </div>
      )}
    </div>
  );
}
