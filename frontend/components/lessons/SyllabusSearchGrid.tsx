"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "../../config/AuthContext";
import {
  getUnifiedDomainCatalog,
  DomainCatalog,
  UnifiedDomainStage,
  UnifiedDomainSubject,
  UnifiedDomainChapter
} from "../../lib/curriculum/unifiedDomainCatalog";
import styles from './SyllabusSearchGrid.module.css';

const DOMAIN_TABS = [
  { id: 'allopathic', label: '🩺 MBBS', portalUrl: '/healthcare/allopathic', simUrl: '/simulators/virtual-patient', simLabel: 'AI Patient Simulator' },
  { id: 'dental', label: '🦷 Dental', portalUrl: '/healthcare/dental', simUrl: '/healthcare/dental/nerve-block', simLabel: '3D Mandibular Lab' },
  { id: 'ayush', label: '🌿 AYUSH', portalUrl: '/healthcare/ayush', simUrl: '/healthcare/ayush/marma-map', simLabel: '3D 107 Marma Map' },
  { id: 'pharmacy', label: '💊 Pharmacy', portalUrl: '/healthcare/pharmacy', simUrl: '/healthcare/pharmacy/pk-simulator', simLabel: '2-Compartment PK Lab' },
  { id: 'nursing', label: '🏥 Nursing', portalUrl: '/healthcare/nursing', simUrl: '/healthcare/nursing/dosage-calc', simLabel: 'IV Titration & ACLS' },
  { id: 'physiotherapy', label: '🦵 Physio', portalUrl: '/healthcare/physiotherapy', simUrl: '/healthcare/physiotherapy/rom-simulator', simLabel: 'Goniometry & Gait Lab' },
  { id: 'allied', label: '🔬 Allied', portalUrl: '/healthcare/allied', simUrl: '/healthcare/allied/ecmo-circuit', simLabel: 'ECMO / CPB Circuit Lab' },
  { id: 'veterinary', label: '🐾 Vet', portalUrl: '/healthcare/veterinary', simUrl: '/healthcare/veterinary/ruminant-digestion', simLabel: 'Ruminant Fermentation' },
  { id: 'public-health', label: '🌍 Pub.Health', portalUrl: '/healthcare/public-health', simUrl: '/healthcare/public-health/epidemic-outbreak', simLabel: 'SEIR Epidemic Lab' },
];

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

  const [activeDomainTab, setActiveDomainTab] = useState<string>('allopathic');
  const [search, setSearch] = useState("");
  const [activeStageKey, setActiveStageKey] = useState<string>("");
  const [activeSubjectId, setActiveSubjectId] = useState<string>("");
  const [progressList, setProgressList] = useState<ProgressItem[]>([]);

  // Get domain catalog data dynamically
  const catalog: DomainCatalog = useMemo(() => {
    return getUnifiedDomainCatalog(activeDomainTab);
  }, [activeDomainTab]);

  // When domain tab changes, auto-select the first stage and first subject
  useEffect(() => {
    if (catalog.stages.length > 0) {
      const firstStage = catalog.stages[0];
      setActiveStageKey(firstStage.key);
      if (firstStage.subjects.length > 0) {
        setActiveSubjectId(firstStage.subjects[0].id);
      } else {
        setActiveSubjectId("");
      }
    }
  }, [catalog]);

  // When stage changes, auto-select the first subject in that stage
  const currentStage = useMemo(() => {
    return catalog.stages.find(s => s.key === activeStageKey) || catalog.stages[0];
  }, [catalog, activeStageKey]);

  useEffect(() => {
    if (currentStage && currentStage.subjects.length > 0) {
      const currentSubjectExists = currentStage.subjects.some(s => s.id === activeSubjectId);
      if (!currentSubjectExists) {
        setActiveSubjectId(currentStage.subjects[0].id);
      }
    }
  }, [currentStage, activeSubjectId]);

  // Fetch student progress
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

  // Filter subjects and chapters by search query
  const filteredSubjects = useMemo(() => {
    if (!currentStage) return [];
    if (!search.trim()) return currentStage.subjects;

    const query = search.toLowerCase();
    return currentStage.subjects
      .map(subj => {
        const matchingChapters = subj.chapters.filter(chap =>
          chap.title.toLowerCase().includes(query) ||
          (chap.competencyCode && chap.competencyCode.toLowerCase().includes(query)) ||
          chap.section.toLowerCase().includes(query)
        );
        return { ...subj, chapters: matchingChapters };
      })
      .filter(subj => subj.chapters.length > 0);
  }, [currentStage, search]);

  const currentSubject = useMemo(() => {
    return filteredSubjects.find(s => s.id === activeSubjectId) || filteredSubjects[0];
  }, [filteredSubjects, activeSubjectId]);

  const activeTabMeta = DOMAIN_TABS.find(t => t.id === activeDomainTab) || DOMAIN_TABS[0];

  return (
    <div className="space-y-8">
      {/* 9 Healthcare Domain Tabs */}
      <div className={styles.domainTabBar}>
        {DOMAIN_TABS.map(tab => (
          <button
            key={tab.id}
            className={`${styles.domainTab} ${activeDomainTab === tab.id ? styles.domainTabActive : ''}`}
            onClick={() => {
              setActiveDomainTab(tab.id);
              setSearch("");
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Domain Quick Launch Ribbon */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900/60 border border-blue-800/30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{catalog.icon}</span>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">{catalog.domainName}</h3>
            <p className="text-xs text-slate-400">
              {catalog.stages.length} Academic Stages • {catalog.stages.reduce((acc, st) => acc + st.subjects.length, 0)} Core Subjects • {catalog.stages.reduce((acc, st) => acc + st.subjects.reduce((a, s) => a + s.chapters.length, 0), 0)} Lessons
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href={activeTabMeta.simUrl}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <span>⚡</span> {activeTabMeta.simLabel}
          </Link>
          <Link
            href={activeTabMeta.portalUrl}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1"
          >
            Portal →
          </Link>
        </div>
      </div>

      {/* Stage / Professional Year Selector */}
      <div className="flex justify-center border-b border-slate-800 pb-4 overflow-x-auto">
        <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80 gap-1.5 min-w-max">
          {catalog.stages.map(st => (
            <button
              key={st.key}
              onClick={() => {
                setActiveStageKey(st.key);
                if (st.subjects.length > 0) {
                  setActiveSubjectId(st.subjects[0].id);
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeStageKey === st.key
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Filter & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex flex-wrap gap-2 items-center">
          {currentStage?.subjects.map((subj) => (
            <button
              key={subj.id}
              onClick={() => setActiveSubjectId(subj.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition border flex items-center gap-2 ${
                currentSubject?.id === subj.id
                  ? 'bg-blue-600/15 border-blue-500 text-blue-300 shadow-sm shadow-blue-600/20'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span>{subj.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
                {subj.chapters.length}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">🔍</span>
          <input
            type="text"
            placeholder={`Search ${catalog.domainName.split(' ')[0]} chapters...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-300 outline-none focus:border-blue-600 transition placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Chapters Grid */}
      {currentSubject ? (
        <section className="space-y-6">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-black text-white">{currentSubject.title}</h2>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
                {currentSubject.category} • {currentSubject.code} • {currentSubject.chapters.length} Lessons Available
              </p>
            </div>
            {currentSubject.description && (
              <p className="text-xs text-slate-400 max-w-md line-clamp-2">
                {currentSubject.description}
              </p>
            )}
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
                  className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-xl p-5 hover:border-blue-600/50 hover:bg-slate-900/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-950/20 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors leading-snug">
                        {chapter.title}
                      </h3>
                      <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${difficultyColors[chapter.difficulty]}`}>
                        {chapter.difficulty}
                      </span>
                    </div>

                    {chapter.competencyCode && (
                      <div className="mb-3 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] bg-slate-800 text-blue-400 px-2 py-0.5 rounded border border-blue-900/40 font-mono font-bold">
                          {chapter.competencyCode}
                        </span>
                        {chapter.has3D && (
                          <span className="text-[10px] bg-purple-950/60 text-purple-300 px-1.5 py-0.5 rounded border border-purple-800/40 font-semibold flex items-center gap-0.5">
                            🧊 3D
                          </span>
                        )}
                        {chapter.hasSimulation && (
                          <span className="text-[10px] bg-cyan-950/60 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800/40 font-semibold flex items-center gap-0.5">
                            ⚡ Sim
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800/60 mt-3">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        🕐 {chapter.estimatedMinutes} min
                      </span>
                      <span className="flex items-center gap-1 truncate max-w-[120px]" title={chapter.section}>
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
                    ) : (
                      <span className="text-[10px] text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                        Start →
                      </span>
                    )}
                  </div>

                  {/* Hover gradient indicator */}
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
