'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BAMS_CURRICULUM, BAMS_METADATA } from '@/lib/curriculum/bamsCurriculumScaffold';
import CCIMCompetencyMap from '@/components/ayush/CCIMCompetencyMap';
import { Sparkles, ArrowLeft, ArrowRight, BookOpen, Layers, Award } from 'lucide-react';

export default function BAMSCurriculumPage() {
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const [showCompetencyMap, setShowCompetencyMap] = useState<boolean>(false);

  const currentYearData = BAMS_CURRICULUM.find((y) => y.year === selectedYear) || BAMS_CURRICULUM[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Hero Banner */}
      <div className="border-b border-amber-950/80 bg-gradient-to-r from-slate-950 via-amber-950/40 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <nav className="text-xs text-slate-400 mb-3 flex items-center gap-2">
              <Link href="/healthcare" className="text-amber-400 hover:text-amber-300 transition">
                Healthcare Landscape
              </Link>
              <span>/</span>
              <Link href="/healthcare/ayush" className="text-amber-400 hover:text-amber-300 transition">
                AYUSH Medicine
              </Link>
              <span>/</span>
              <span className="text-slate-300">BAMS Curriculum</span>
            </nav>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl sm:text-4xl">🌿</span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {BAMS_METADATA.regulatoryBody}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                  {BAMS_METADATA.totalYears}.5 YEARS
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              {BAMS_METADATA.programName} ({BAMS_METADATA.abbreviation})
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Comprehensive 5.5-year CCIM/NCISM curriculum covering foundational Ayurvedic philosophy, Dravyaguna herbology, 3D Marma point anatomy, and Panchakarma therapeutics.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowCompetencyMap(!showCompetencyMap)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition flex items-center gap-2"
            >
              <Award size={16} className="text-amber-400" />
              {showCompetencyMap ? 'Hide Competency Map' : 'View CCIM Competencies'}
            </button>
            <Link
              href="/healthcare/ayush"
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
            >
              <ArrowLeft size={16} /> AYUSH Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Simulator Shortcuts Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <Link
            href="/healthcare/ayush/marma-map"
            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition flex items-center gap-2 text-xs font-bold text-slate-200"
          >
            <span>📍</span> 107 Marma 3D Map
          </Link>
          <Link
            href="/healthcare/ayush/tridosha-ans"
            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition flex items-center gap-2 text-xs font-bold text-slate-200"
          >
            <span>⚡</span> Tridosha-ANS Lab
          </Link>
          <Link
            href="/healthcare/ayush/prakriti-assessment"
            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition flex items-center gap-2 text-xs font-bold text-slate-200"
          >
            <span>🧬</span> Prakriti Assessor
          </Link>
          <Link
            href="/healthcare/ayush/panchakarma-guide"
            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition flex items-center gap-2 text-xs font-bold text-slate-200"
          >
            <span>🏺</span> Panchakarma Stages
          </Link>
          <Link
            href="/healthcare/ayush/dravyaguna-explorer"
            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition flex items-center gap-2 text-xs font-bold text-slate-200"
          >
            <span>🌿</span> Dravyaguna Herbology
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Collapsible Competency Map */}
        {showCompetencyMap && (
          <section className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="text-amber-400" /> CCIM / NCISM Competency-Based Framework
            </h2>
            <CCIMCompetencyMap />
          </section>
        )}

        {/* Year Tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {BAMS_CURRICULUM.map((year) => (
            <button
              key={year.year}
              onClick={() => setSelectedYear(year.year)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedYear === year.year
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Year {year.year} (Sem {year.semesters.join(' & ')})
            </button>
          ))}
        </div>

        {/* Subjects & Numbered Chapters */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              {currentYearData.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Explore subject syllabi and launch interactive chapters and clinical labs.
            </p>
          </div>

          <div className="space-y-6">
            {currentYearData.subjects.map((subj) => (
              <div
                key={subj.id}
                className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {subj.code}
                      </span>
                      <span className="text-xs text-slate-400">
                        Semester {subj.semester} • Credits: {subj.creditHours}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {subj.name}{' '}
                      <span className="text-sm font-medium text-amber-400">
                        ({subj.sanskritName})
                      </span>
                    </h3>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 font-semibold self-start sm:self-auto">
                    {subj.lessons.length} Core Chapters
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {subj.description}
                </p>

                {/* Numbered Chapters Grid */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <BookOpen size={14} className="text-amber-400" /> Syllabus Chapters &amp; Learning Modules
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {subj.lessons.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                              Chapter {idx + 1}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              [{lesson.ccimCode}]
                            </span>
                          </div>

                          <h5 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                            {lesson.title}
                          </h5>

                          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                            {lesson.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
                          <div className="flex gap-1.5 text-[10px]">
                            {lesson.hasMarmaDiagram && (
                              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-semibold">
                                Marma
                              </span>
                            )}
                            {lesson.has3DContent && (
                              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-semibold">
                                3D
                              </span>
                            )}
                            {lesson.hasSimulation && (
                              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-semibold">
                                Sim
                              </span>
                            )}
                          </div>

                          <Link
                            href={
                              lesson.hasMarmaDiagram
                                ? '/healthcare/ayush/marma-map'
                                : `/lessons/${lesson.id}`
                            }
                            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
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
