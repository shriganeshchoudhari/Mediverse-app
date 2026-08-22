'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePublicHealthCurriculum } from '@/hooks/usePublicHealthCurriculum';
import { PublicHealthCompetencyMap } from '@/components/public-health/PublicHealthCompetencyMap';
import { MPHSubject } from '@/lib/curriculum/mphCurriculumScaffold';
import { Sparkles, ArrowLeft, ArrowRight, BookOpen, Award } from 'lucide-react';

export default function MPHPage() {
  const { curriculum, isLoading, isError } = usePublicHealthCurriculum('mph');
  const [activeYear, setActiveYear] = useState<1 | 2>(1);
  const [showCompetencyMap, setShowCompetencyMap] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-slate-400">Loading MPH curriculum...</p>
      </div>
    );
  }

  const mphCurriculum = (curriculum as MPHSubject[]) || [];
  const subjectsForYear = mphCurriculum.filter(subject => subject.year === activeYear);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Hero Header */}
      <div className="border-b border-indigo-950/80 bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <nav className="text-xs text-slate-400 mb-3 flex items-center gap-2">
              <Link href="/healthcare" className="text-indigo-400 hover:text-indigo-300 transition">
                Healthcare Landscape
              </Link>
              <span>/</span>
              <Link href="/healthcare/public-health" className="text-indigo-400 hover:text-indigo-300 transition">
                Public Health
              </Link>
              <span>/</span>
              <span className="text-slate-300">MPH Curriculum</span>
            </nav>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl sm:text-4xl">🌍</span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  UGC / NMC POSTGRADUATE
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                  2.0 YEARS
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Master of Public Health (MPH)
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              2-year postgraduate program covering mathematical epidemiology (SEIR outbreak modeling), biostatistics, Ayushman Bharat health systems, and global disaster management.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowCompetencyMap(!showCompetencyMap)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition flex items-center gap-2"
            >
              <Award size={16} className="text-indigo-400" />
              {showCompetencyMap ? 'Hide Competency Map' : 'View Public Health Competencies'}
            </button>
            <Link
              href="/healthcare/public-health"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 transition flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Public Health Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Simulator Shortcuts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2 text-xs font-bold text-slate-200">
            <span>📊</span> SEIR Outbreak Modeling
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2 text-xs font-bold text-slate-200">
            <span>🏥</span> Ayushman Bharat PM-JAY
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2 text-xs font-bold text-slate-200">
            <span>📈</span> Health Economics ICER
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2 text-xs font-bold text-slate-200">
            <span>🛏️</span> Hospital Capacity &amp; Erlang-C
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Collapsible Competency Map */}
        {showCompetencyMap && (
          <section className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="text-indigo-400" /> Public Health Competency-Based Framework
            </h2>
            <PublicHealthCompetencyMap />
          </section>
        )}

        {/* Year Tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {[1, 2].map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year as 1 | 2)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeYear === year
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Year {year} Postgraduate Modules
            </button>
          ))}
        </div>

        {/* Subjects & Chapters */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              Year {activeYear} Public Health Core Modules
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Epidemiology, biostatistics, health economics, and global policy modules.
            </p>
          </div>

          <div className="space-y-6">
            {subjectsForYear.map((subject) => (
              <div
                key={subject.id}
                className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {subject.code}
                      </span>
                      <span className="text-xs text-slate-400">
                        Year {subject.year} • Credit Hours: {subject.creditHours}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {subject.name}
                    </h3>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 font-semibold self-start sm:self-auto">
                    {subject.lessons.length} Core Chapters
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {subject.description}
                </p>

                {/* Numbered Chapters Grid */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <BookOpen size={14} className="text-indigo-400" /> Syllabus Chapters &amp; Field Modules
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {subject.lessons.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-indigo-500/50 transition-all flex flex-col justify-between group shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                              Chapter {idx + 1}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              [{lesson.competencyCode || 'PUB'}]
                            </span>
                          </div>

                          <h5 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
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
                              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded font-semibold">
                                Simulation
                              </span>
                            )}
                          </div>

                          <Link
                            href={`/lessons/${lesson.id}`}
                            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
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
      </div>
    </div>
  );
}
