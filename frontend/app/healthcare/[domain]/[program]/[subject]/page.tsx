"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Sparkles, ArrowLeft, Clock, Award, ArrowRight } from "lucide-react";
import { getUnifiedDomainCatalog, UnifiedDomainSubject } from "@/lib/curriculum/unifiedDomainCatalog";

export default function CanonicalSubjectViewerPage() {
  const params = useParams();
  const router = useRouter();

  const domain = (params.domain as string) || "allopathic";
  const program = (params.program as string) || "mbbs";
  const subjectId = (params.subject as string) || "";

  // Lookup domain catalog
  const domainInfo = getUnifiedDomainCatalog(domain);

  // Find subject across stages
  let foundSubject: UnifiedDomainSubject | null = null;
  let foundStage: any = null;

  for (const stage of domainInfo.stages) {
    for (const subj of stage.subjects) {
      if (subj.id.toLowerCase() === subjectId.toLowerCase() || subj.code.toLowerCase() === subjectId.toLowerCase()) {
        foundSubject = subj;
        foundStage = stage;
        break;
      }
    }
    if (foundSubject) break;
  }

  const subjectTitle = foundSubject ? foundSubject.title : subjectId.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const chapters = foundSubject ? foundSubject.chapters : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Banner */}
      <div className="border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <Link
            href={`/healthcare/${domain}/${program}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
          >
            <ArrowLeft size={14} /> Back to {domainInfo.domainName} ({program.toUpperCase()})
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles size={13} /> {foundStage ? foundStage.title : "Core Curriculum Subject"}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {subjectTitle}
              </h1>
              <p className="text-slate-400 text-sm max-w-2xl mt-1">
                Canonical competency-mapped curriculum modules and interactive clinical case studies for {domainInfo.domainName}.
              </p>
            </div>

            <div className="flex gap-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
                {chapters.length} Interactive Modules
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <BookOpen size={20} className="text-blue-400" /> Syllabus Chapters &amp; Competencies
        </h2>

        {chapters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapters.map((chap: any, idx: number) => (
              <Link
                key={chap.id || idx}
                href={`/healthcare/${domain}/${program}/${subjectId}/${chap.id}`}
                className="group p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition flex flex-col justify-between shadow-lg space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400 tracking-wider">
                      {chap.competencyCode || `MODULE ${idx + 1}`}
                    </span>
                    {chap.hasSim && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold">
                        3D / Sim
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition leading-snug">
                    {chap.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {chap.estimatedMinutes || 45} mins
                  </span>
                  <span className="inline-flex items-center gap-1 text-blue-400 font-semibold group-hover:translate-x-1 transition">
                    Study Lesson <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
            <p className="text-slate-400 text-sm">
              All chapters for this subject are available in the master syllabus.
            </p>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
            >
              Browse Syllabus Grid
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
