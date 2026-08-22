'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useNursingCurriculum } from '@/hooks/useNursingCurriculum';
import { INCCompetencyMap } from '@/components/nursing/INCCompetencyMap';
import { Sparkles, ArrowLeft, ArrowRight, BookOpen, Award } from 'lucide-react';

export default function BScNursingPage() {
  const { curriculum, isLoading } = useNursingCurriculum();
  const [activeYear, setActiveYear] = useState<number>(1);
  const [showCompetencyMap, setShowCompetencyMap] = useState<boolean>(false);

  const currentYear = curriculum.find((y: any) => y.year === activeYear) || curriculum[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Hero Header */}
      <div className="border-b border-rose-950/80 bg-gradient-to-r from-slate-950 via-rose-950/40 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <nav className="text-xs text-slate-400 mb-3 flex items-center gap-2">
              <Link href="/healthcare" className="text-rose-400 hover:text-rose-300 transition">
                Healthcare Landscape
              </Link>
              <span>/</span>
              <Link href="/healthcare/nursing" className="text-rose-400 hover:text-rose-300 transition">
                Nursing Sciences
              </Link>
              <span>/</span>
              <span className="text-slate-300">B.Sc Nursing</span>
            </nav>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl sm:text-4xl">🏥</span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  INC RECOGNIZED
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                  4.0 YEARS
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Bachelor of Science in Nursing (B.Sc Nursing)
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              4-year Indian Nursing Council (INC) competency-based undergraduate program covering foundational nursing arts, pharmacology, medical-surgical nursing, critical care, and community health.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowCompetencyMap(!showCompetencyMap)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition flex items-center gap-2"
            >
              <Award size={16} className="text-rose-400" />
              {showCompetencyMap ? 'Hide Competency Map' : 'View INC Competencies'}
            </button>
            <Link
              href="/healthcare/nursing"
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-500/20 transition flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Nursing Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Simulator Shortcuts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/healthcare/nursing/iv-drip-rate"
            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 transition flex items-center gap-2 text-xs font-bold text-slate-200"
          >
            <span>💧</span> IV Drip Rate Calculator
          </Link>
          <Link
            href="/healthcare/nursing/news2-escalation"
            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 transition flex items-center gap-2 text-xs font-bold text-slate-200"
          >
            <span>🚨</span> NEWS2 Triage Escalation
          </Link>
          <Link
            href="/healthcare/nursing/braden-wound-care"
            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 transition flex items-center gap-2 text-xs font-bold text-slate-200"
          >
            <span>🩹</span> Braden Pressure Injury Sim
          </Link>
          <Link
            href="/healthcare/nursing/osce-skills"
            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 transition flex items-center gap-2 text-xs font-bold text-slate-200"
          >
            <span>🎯</span> Nursing OSCE Stations
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Collapsible Competency Map */}
        {showCompetencyMap && (
          <section className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="text-rose-400" /> INC Competency-Based Nursing Framework
            </h2>
            <INCCompetencyMap />
          </section>
        )}

        {/* Year Tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {[1, 2, 3, 4].map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeYear === year
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Year {year}
            </button>
          ))}
        </div>

        {/* Subjects & Chapters */}
        {currentYear && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-extrabold text-white">
                {currentYear.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {currentYear.description}
              </p>
            </div>

            <div className="space-y-6">
              {currentYear.subjects.map((subj: any) => (
                <div
                  key={subj.id}
                  className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          {subj.code}
                        </span>
                        <span className="text-xs text-slate-400">
                          Year {subj.year || activeYear}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        {subj.name}
                      </h3>
                    </div>

                    <span className="text-xs px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 font-semibold self-start sm:self-auto">
                      {subj.lessons.length} Core Chapters
                    </span>
                  </div>

                  {subj.description && (
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {subj.description}
                    </p>
                  )}

                  {/* Numbered Chapters Grid */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <BookOpen size={14} className="text-rose-400" /> Syllabus Chapters &amp; Clinical Modules
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {subj.lessons.map((lesson: any, idx: number) => (
                        <div
                          key={lesson.id}
                          className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-rose-500/50 transition-all flex flex-col justify-between group shadow-sm"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                                Chapter {idx + 1}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                [{lesson.incCode || 'INC'}]
                              </span>
                            </div>

                            <h5 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                              {lesson.title}
                            </h5>

                            {lesson.description && (
                              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                                {lesson.description}
                              </p>
                            )}
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
                            <div className="flex gap-1.5 text-[10px]">
                              {lesson.hasSimulation && (
                                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-semibold">
                                  Simulation
                                </span>
                              )}
                              {lesson.isHighTech && (
                                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded font-semibold">
                                  Lab
                                </span>
                              )}
                            </div>

                            <Link
                              href={`/lessons/${lesson.id}`}
                              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                            >
                              Study Chapter <ArrowRight size={12} />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
