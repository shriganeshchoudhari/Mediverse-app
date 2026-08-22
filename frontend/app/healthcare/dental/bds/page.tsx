'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BDS_CURRICULUM, BDS_METADATA } from '@/lib/curriculum/bdsCurriculumScaffold';
import DCICompetencyMap from '@/components/dental/DCICompetencyMap';
import { Sparkles, ArrowLeft, ArrowRight, BookOpen, Award } from 'lucide-react';

export default function BDSCurriculumPage() {
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const [showCompetencyMap, setShowCompetencyMap] = useState<boolean>(false);

  const currentYearData = BDS_CURRICULUM.find((y) => y.year === selectedYear) || BDS_CURRICULUM[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Hero Banner */}
      <div className="border-b border-emerald-950/80 bg-gradient-to-r from-slate-950 via-emerald-950/40 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <nav className="text-xs text-slate-400 mb-3 flex items-center gap-2">
              <Link href="/healthcare" className="text-emerald-400 hover:text-emerald-300 transition">
                Healthcare Landscape
              </Link>
              <span>/</span>
              <Link href="/healthcare/dental" className="text-emerald-400 hover:text-emerald-300 transition">
                Dental Sciences
              </Link>
              <span>/</span>
              <span className="text-slate-300">BDS Curriculum</span>
            </nav>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl sm:text-4xl">🦷</span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {BDS_METADATA.regulatoryBody}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                  {BDS_METADATA.totalYears} YEARS
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              {BDS_METADATA.programName} ({BDS_METADATA.abbreviation})
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              5-year DCI-recognized Bachelor of Dental Surgery curriculum covering basic oral biology, maxillofacial anatomy, nerve block anesthesia, and clinical operative dentistry.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowCompetencyMap(!showCompetencyMap)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition flex items-center gap-2"
            >
              <Award size={16} className="text-emerald-400" />
              {showCompetencyMap ? 'Hide Competency Map' : 'View DCI Competencies'}
            </button>
            <Link
              href="/healthcare/dental"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Dental Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Simulators Shortcuts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/healthcare/dental/tooth-morphology"
            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition flex items-center gap-2 text-xs font-bold text-slate-200"
          >
            <span>🦷</span> Tooth Morphology 3D
          </Link>
          <Link
            href="/healthcare/dental/nerve-block"
            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition flex items-center gap-2 text-xs font-bold text-slate-200"
          >
            <span>💉</span> Nerve Block Simulator
          </Link>
          <Link
            href="/healthcare/dental/tmj"
            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition flex items-center gap-2 text-xs font-bold text-slate-200"
          >
            <span>🦴</span> TMJ Biomechanics
          </Link>
          <Link
            href="/healthcare/dental/cephalometric"
            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition flex items-center gap-2 text-xs font-bold text-slate-200"
          >
            <span>📐</span> Cephalometric Tracer
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Collapsible Competency Map */}
        {showCompetencyMap && (
          <section className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="text-emerald-400" /> DCI Competency-Based Dental Framework
            </h2>
            <DCICompetencyMap />
          </section>
        )}

        {/* Year Tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {BDS_CURRICULUM.map((year) => (
            <button
              key={year.year}
              onClick={() => setSelectedYear(year.year)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedYear === year.year
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Year {year.year} (Sem {year.semesters.join(' & ')})
            </button>
          ))}
        </div>

        {/* Subjects & Chapters */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              {currentYearData.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              DCI-accredited subjects and interactive curriculum chapters with 3D models.
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
                      <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {subj.code}
                      </span>
                      <span className="text-xs text-slate-400">
                        Semester {subj.semester} • Credits: {subj.creditHours}
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

                <p className="text-xs text-slate-300 leading-relaxed">
                  {subj.description}
                </p>

                {/* Numbered Chapters Grid */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <BookOpen size={14} className="text-emerald-400" /> Syllabus Chapters &amp; Learning Modules
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {subj.lessons.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-emerald-500/50 transition-all flex flex-col justify-between group shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              Chapter {idx + 1}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              [{lesson.dciCode}]
                            </span>
                          </div>

                          <h5 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {lesson.title}
                          </h5>

                          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                            {lesson.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
                          <div className="flex gap-1.5 text-[10px]">
                            {lesson.has3DContent && (
                              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-semibold">
                                3D Model
                              </span>
                            )}
                            {lesson.hasSimulation && (
                              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-semibold">
                                Simulation
                              </span>
                            )}
                          </div>

                          <Link
                            href={
                              lesson.has3DContent
                                ? '/healthcare/dental/tooth-morphology'
                                : lesson.hasSimulation
                                ? '/healthcare/dental/nerve-block'
                                : `/lessons/${lesson.id}`
                            }
                            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
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
