'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAlliedHealthCurriculum } from '../../../../hooks/useAlliedHealthCurriculum';
import { NCAHPCompetencyMap } from '../../../../components/allied/NCAHPCompetencyMap';
import { AlliedMajor, AlliedSubject, AlliedLesson } from '../../../../lib/curriculum/alliedHealthCurriculumScaffold';
import { Sparkles, ArrowLeft, ArrowRight, BookOpen, Award } from 'lucide-react';

function AlliedCurriculumContent() {
  const { majors, isLoading } = useAlliedHealthCurriculum();
  const searchParams = useSearchParams();
  const majorCodeParam = searchParams.get('major');
  
  const [activeTab, setActiveTab] = useState(majorCodeParam || 'BSCPERF');
  const [showCompetencyMap, setShowCompetencyMap] = useState(false);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-400">
        Loading Allied Health curriculum...
      </div>
    );
  }

  const activeMajor = majors.find((m: AlliedMajor) => m.code === activeTab) || majors[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Major Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {majors.map((m: AlliedMajor) => (
          <button 
            key={m.code}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === m.code 
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20' 
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
            onClick={() => setActiveTab(m.code)}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Competency Map Toggle */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">
            {activeMajor.name} ({activeMajor.code})
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {activeMajor.description}
          </p>
        </div>

        <button 
          onClick={() => setShowCompetencyMap(!showCompetencyMap)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition flex items-center gap-2"
        >
          <Award size={16} className="text-amber-400" />
          {showCompetencyMap ? 'Hide Competency Map' : 'View NCAHP Competencies'}
        </button>
      </div>

      {/* Collapsible Competency Map */}
      {showCompetencyMap && (
        <section className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="text-amber-400" /> National Commission for Allied and Healthcare Professions (NCAHP) Mapping
          </h3>
          <NCAHPCompetencyMap />
        </section>
      )}

      {/* Subjects & Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeMajor.subjects.map((subject: AlliedSubject) => (
          <div key={subject.id} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  Year {subject.year}
                </span>
                <h4 className="text-lg font-bold text-white mt-1">{subject.name}</h4>
              </div>
              <span className="text-xs text-slate-400">{subject.lessons.length} Chapters</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{subject.description}</p>
            
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen size={14} className="text-amber-400" /> Core Modules
              </h5>
              <div className="space-y-2">
                {subject.lessons.map((lesson: AlliedLesson, idx: number) => (
                  <div key={lesson.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-white block">
                        Chapter {idx + 1}: {lesson.title}
                      </span>
                      {lesson.description && (
                        <span className="text-slate-400 text-[11px] block mt-0.5">{lesson.description}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {lesson.hasSimulation && (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-1.5 py-0.5 rounded font-semibold">
                          Sim
                        </span>
                      )}
                      <Link
                        href={`/lessons/${lesson.id}`}
                        className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                      >
                        Study <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Simulator Shortcuts */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="text-amber-400" /> Allied Health Simulation Workstations
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/healthcare/allied/ecmo-circuit" className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition flex items-center gap-2 text-xs font-bold text-slate-200">
            <span>🫀</span> ECMO / CPB Circuit Lab
          </Link>
          <Link href="/healthcare/allied/radiology-slice" className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition flex items-center gap-2 text-xs font-bold text-slate-200">
            <span>☢️</span> CT / MRI 3D Slice Viewer
          </Link>
          <Link href="/healthcare/allied/dialysis-clearance" className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition flex items-center gap-2 text-xs font-bold text-slate-200">
            <span>🧪</span> Dialysis Kt/V Clearance
          </Link>
          <Link href="/healthcare/allied/ot-workflows" className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition flex items-center gap-2 text-xs font-bold text-slate-200">
            <span>🏥</span> OT Sterilization &amp; WHO
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AlliedCurriculumPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Banner */}
      <div className="border-b border-amber-950/80 bg-gradient-to-r from-slate-950 via-amber-950/40 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <nav className="text-xs text-slate-400 mb-3 flex items-center gap-2">
              <Link href="/healthcare" className="text-amber-400 hover:text-amber-300 transition">
                Healthcare Landscape
              </Link>
              <span>/</span>
              <Link href="/healthcare/allied" className="text-amber-400 hover:text-amber-300 transition">
                Allied Health
              </Link>
              <span>/</span>
              <span className="text-slate-300">Curriculum Explorer</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Allied Health Sciences Curriculum
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              NCAHP-recognized competency-based curriculums across Perfusion Technology, Medical Imaging, Dialysis Therapy, and Operation Theatre Technology.
            </p>
          </div>

          <Link
            href="/healthcare/allied"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Allied Health Portal
          </Link>
        </div>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading curriculum...</div>}>
        <AlliedCurriculumContent />
      </Suspense>
    </div>
  );
}
