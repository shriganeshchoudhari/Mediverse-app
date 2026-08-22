import React from 'react';
import Link from 'next/link';
import { MD_AYURVEDA_CURRICULUM } from '@/lib/curriculum/mdAyurvedaCurriculumScaffold';
import { Sparkles, ArrowLeft, ArrowRight, BookOpen, Award } from 'lucide-react';

export default function MDAyurvedaPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Banner */}
      <div className="border-b border-amber-950/80 bg-gradient-to-r from-slate-950 via-amber-950/40 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <Link
              href="/healthcare/ayush"
              className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition mb-3"
            >
              <ArrowLeft size={14} /> Back to AYUSH Medicine
            </Link>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} className="inline mr-1" /> Postgraduate Medical Specialties
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                NCISM APPROVED
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              MD / MS Ayurveda Postgraduate Specialties
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              3-year NCISM-recognized postgraduate clinical and paraclinical specialties covering Kayachikitsa, Shalya Tantra, Panchakarma, Dravyaguna, and Kaumarbhritya with integrated AIAPGET preparation.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/healthcare/ayush/bams"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition"
            >
              BAMS Undergrad
            </Link>
            <Link
              href="/exam"
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold shadow-lg shadow-amber-500/20 transition"
            >
              Take AYUSH Exam
            </Link>
          </div>
        </div>
      </div>

      {/* Grid of MD Specialties */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MD_AYURVEDA_CURRICULUM.map((specialty) => (
            <Link
              href={`/healthcare/ayush/md-ayurveda/${specialty.id}`}
              key={specialty.id}
              className="group p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 hover:bg-slate-850/80 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {specialty.aiapgetMdsCode}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {specialty.duration}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  {specialty.name}
                </h2>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {specialty.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {specialty.subjects.length} Subjects
                </span>
                <span className="font-bold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  View Curriculum <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
