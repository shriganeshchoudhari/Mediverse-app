import React from 'react';
import Link from 'next/link';
import { getDomainById, type HealthcareDomain } from '@/lib/curriculum/healthcareLandscapeScaffold';
import { Sparkles, ArrowRight, ArrowLeft, BookOpen, Layers, CheckCircle2, Award } from 'lucide-react';

interface DomainPageLayoutProps {
  domainId: string;
  curriculumCta?: { label: string; href: string };
}

export function DomainPageLayout({ domainId, curriculumCta }: DomainPageLayoutProps) {
  const domain = getDomainById(domainId);

  if (!domain) {
    return (
      <main className="max-w-3xl mx-auto my-16 px-6 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Domain Not Found</h1>
        <Link href="/healthcare" className="text-blue-400 hover:text-blue-300 flex items-center justify-center gap-2">
          <ArrowLeft size={16} /> Back to Healthcare Landscape
        </Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Banner */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900/80 to-slate-950 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <nav className="text-xs text-slate-400 mb-3 flex items-center gap-2">
              <Link href="/healthcare" className="text-indigo-400 hover:text-indigo-300 transition">
                Healthcare Landscape
              </Link>
              <span>/</span>
              <span className="text-slate-300">{domain.shortName}</span>
            </nav>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl sm:text-4xl">{domain.icon}</span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Tier {domain.tier}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {domain.lessonCount}+ lessons • {domain.programs.length} degree tracks
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              {domain.name}
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              {domain.longDescription}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            {curriculumCta && (
              <Link
                href={curriculumCta.href}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-95 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 transition flex items-center gap-2"
              >
                {curriculumCta.label}
              </Link>
            )}
            <Link
              href="/healthcare"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-sm font-semibold transition flex items-center gap-2"
            >
              <ArrowLeft size={16} /> All Domains
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 space-y-10">
        {/* Platform Features Grid */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-400" /> Platform Features & Simulation Labs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {domain.keyHighlights.map((h, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-300 flex items-center gap-3 shadow-md hover:border-slate-700 transition"
              >
                <span className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  ✦
                </span>
                <span className="font-medium text-xs sm:text-sm text-slate-200">{h}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Degree & Professional Programs */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-400" /> Academic & Professional Programs
            </h2>
            <span className="text-xs text-slate-400 font-medium">Click any live track to launch curriculum</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {domain.programs.map((prog) => {
              const cardBody = (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <strong className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {prog.name}
                      </strong>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                          prog.available
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {prog.available ? 'LIVE' : 'COMING SOON'}
                      </span>
                      <span className="text-xs font-semibold text-indigo-400">
                        {prog.fullName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                      {prog.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <div className="text-right text-xs text-slate-400 space-y-0.5">
                      <div><strong className="text-slate-300">Duration:</strong> {prog.duration}</div>
                      <div><strong className="text-slate-300">Regulator:</strong> {prog.regulatoryBody}</div>
                    </div>

                    {prog.available && (
                      <span className="px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition flex items-center gap-1.5 group-hover:translate-x-1 duration-200">
                        Explore Curriculum <ArrowRight size={14} />
                      </span>
                    )}
                  </div>
                </div>
              );

              if (prog.available) {
                return (
                  <Link
                    key={prog.id}
                    href={prog.routePath}
                    className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-850/90 transition-all duration-200 shadow-xl flex items-center cursor-pointer"
                  >
                    {cardBody}
                  </Link>
                );
              }

              return (
                <div
                  key={prog.id}
                  className="p-5 rounded-2xl bg-slate-900/50 border border-slate-850 opacity-70 flex items-center cursor-not-allowed"
                >
                  {cardBody}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
