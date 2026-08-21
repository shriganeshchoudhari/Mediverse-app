"use client";

import React from "react";
import Link from "next/link";
import { useCurriculumCatalog } from "../hooks/useCurriculumCatalog";
import SyllabusSearchGrid from "../components/lessons/SyllabusSearchGrid";
import HealthcareLandscapeExplorer from "../components/HealthcareLandscapeExplorer";

export default function HomePage() {
  const { totalSubjects, totalChapters, totalMinutes, loading } = useCurriculumCatalog();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <header className="relative border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">
          <div className="flex flex-col items-center text-center">
            
            {/* Semantic Category Label (Clean, no pulsing dots) */}
            <div className="text-blue-400 text-xs font-bold tracking-wider uppercase mb-3">
              Interactive 3D Medical Physiology &amp; Clinical Simulation Platform
            </div>

            {/* High-Contrast Crisp Headline (No gradient keywords) */}
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
              Mediverse Platform
            </h1>

            <p className="text-slate-300 text-base md:text-lg max-w-2xl leading-relaxed mb-8">
              Master the complete medical curriculum across undergraduate CBME and postgraduate residency tracks with real-time 3D organ dissection, mathematical simulation solvers, clinical board examinations, and Socratic AI tutoring.
            </p>

            {/* Key Curriculum Metrics Bar */}
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-blue-400 font-extrabold text-base">{loading ? "—" : totalSubjects}</span>
                <span className="text-slate-400 font-medium">Core Subjects</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-blue-400 font-extrabold text-base">{loading ? "—" : totalChapters}</span>
                <span className="text-slate-400 font-medium">Clinical Chapters</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-blue-400 font-extrabold text-base">{loading ? "—" : `${Math.round(totalMinutes / 60)}h+`}</span>
                <span className="text-slate-400 font-medium">Interactive Learning</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-blue-400 font-extrabold text-base">8</span>
                <span className="text-slate-400 font-medium">Physiology Solvers</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Quick-Launch Feature Hub */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: 3D Multi-Organ Anatomy */}
          <Link
            href="/dissection"
            className="group block p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 transition duration-200"
          >
            <div className="text-2xl mb-3">🫀</div>
            <h2 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors mb-1">
              3D Anatomy &amp; Dissection
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore 6 multi-organ systems with clipping plane cross-sections and clinical landmark pins.
            </p>
          </Link>

          {/* Card 2: Virtual Simulation Labs */}
          <Link
            href="/simulators"
            className="group block p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 transition duration-200"
          >
            <div className="text-2xl mb-3">⚡</div>
            <h2 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors mb-1">
              Physiology Solvers
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cardiac Suga-Sagawa PV loops, Davenport acid-base nomograms, and Starling renal clearance.
            </p>
          </Link>

          {/* Card 3: Clinical Mock Exam */}
          <Link
            href="/exam"
            className="group block p-5 rounded-2xl bg-slate-900 border border-blue-500/30 bg-blue-950/20 hover:border-blue-500/60 transition duration-200"
          >
            <div className="text-2xl mb-3">🩺</div>
            <h2 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors mb-1">
              Clinical Board Exams
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Timed USMLE Step 1 &amp; NMC CBME clinical vignettes with instant radar mastery analytics.
            </p>
          </Link>

          {/* Card 4: 19-Subject Scaffold */}
          <Link
            href="/subjects"
            className="group block p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 transition duration-200"
          >
            <div className="text-2xl mb-3">📚</div>
            <h2 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors mb-1">
              Curriculum Scaffold
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              All 19 MBBS disciplines + 12 Postgraduate Residency packs with vertical integration maps.
            </p>
          </Link>
        </div>
      </section>

      {/* Healthcare Education Landscape (9 Domains) */}
      <section className="max-w-6xl mx-auto px-6 py-4">
        <HealthcareLandscapeExplorer showTierFilter={true} compact={false} />
      </section>

      {/* Curriculum Explorer Grid */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        <SyllabusSearchGrid />
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-800/80 mt-12 bg-slate-950">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <p className="text-xs text-slate-500">
            Based on NMC CBME 2024 Curriculum &amp; USMLE Guidelines • Built with Next.js, Spring Boot &amp; Three.js
          </p>
        </div>
      </footer>
    </div>
  );
}
