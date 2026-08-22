import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMDAyurvedaSpecialtyById } from '@/lib/curriculum/mdAyurvedaCurriculumScaffold';
import { ArrowLeft, BookOpen, Sparkles, Layers, Award } from 'lucide-react';

export default function SpecialtyPage({ params }: { params: { specialty: string } }) {
  const specialtyData = getMDAyurvedaSpecialtyById(params.specialty);

  if (!specialtyData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Hero Header */}
      <div className="border-b border-amber-950/80 bg-gradient-to-r from-slate-950 via-amber-950/40 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <Link
              href="/healthcare/ayush/md-ayurveda"
              className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition mb-3"
            >
              <ArrowLeft size={14} /> Back to MD Ayurveda Specialties
            </Link>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} className="inline mr-1" /> Post Graduate Specialty
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                NCISM RECOGNIZED
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              {specialtyData.name}
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              {specialtyData.description}
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
              href="/healthcare/ayush"
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold shadow-lg shadow-amber-500/20 transition"
            >
              AYUSH Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Specialty Curriculum Subjects & Lessons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 space-y-8">
        {specialtyData.subjects.map((subject) => (
          <div key={subject.id} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  {subject.name} (Year {subject.year})
                </h2>
                <p className="text-xs text-amber-400 font-mono mt-1">
                  Code: {subject.code} | Credits: {subject.creditHours}
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 font-medium self-start sm:self-auto">
                Year {subject.year}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{subject.description}</p>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <BookOpen size={14} className="text-amber-400" /> Curriculum Lessons & Practical Modules
              </h3>

              <ul className="space-y-3">
                {subject.lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">{lesson.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{lesson.description}</p>
                    </div>

                    <div className="flex gap-2 text-xs flex-shrink-0">
                      {lesson.has3DContent && (
                        <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-semibold text-[11px]">
                          3D Model
                        </span>
                      )}
                      {lesson.hasSimulation && (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold text-[11px]">
                          Simulation
                        </span>
                      )}
                      {lesson.isResearchBased && (
                        <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-semibold text-[11px]">
                          Research
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
