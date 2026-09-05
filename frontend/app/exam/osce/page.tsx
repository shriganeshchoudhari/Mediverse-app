'use client';

/**
 * page.tsx - /exam/osce
 * Enterprise Multi-Station Timed Mock OSCE Examination Circuit & Clinical Skills Station Hub
 * Location: frontend/app/exam/osce/page.tsx
 */

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  OSCE_STATION_REGISTRY,
  OsceStation,
  OsceDomain,
} from '@/lib/exam/osceStationRegistry';
import {
  OsceStationAttempt,
  DeansAssessmentReport,
  generateDeansAssessmentReport,
} from '@/.gemini/skills/OsceCircuitEngine';
import OSCECircuitStation from '@/components/exam/OSCECircuitStation';
import {
  Stethoscope,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  Printer,
  Compass,
} from 'lucide-react';

const DOMAIN_TABS: { id: string; label: string }[] = [
  { id: 'ALL', label: 'All Domains' },
  { id: 'ALLOPATHIC_MBBS', label: '🩺 Allopathic (MBBS)' },
  { id: 'NURSING_BSC', label: '🏥 Nursing (BSc)' },
  { id: 'DENTAL_BDS', label: '🦷 Dental (BDS)' },
  { id: 'PHYSIOTHERAPY_BPT', label: '🦾 Physiotherapy (BPT)' },
  { id: 'AYUSH_BAMS', label: '🌿 Ayurveda (BAMS)' },
];

export default function OSCEPage() {
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [isCircuitActive, setIsCircuitActive] = useState<boolean>(false);
  const [currentStationIndex, setCurrentStationIndex] = useState<number>(0);
  const [activeSingleStation, setActiveSingleStation] = useState<OsceStation | null>(null);

  // Circuit attempts history
  const [circuitAttempts, setCircuitAttempts] = useState<OsceStationAttempt[]>([]);
  const [deansReport, setDeansReport] = useState<DeansAssessmentReport | null>(null);

  // Filtered stations list
  const filteredStations = useMemo(() => {
    if (selectedDomain === 'ALL') return OSCE_STATION_REGISTRY;
    return OSCE_STATION_REGISTRY.filter((s) => s.domain === selectedDomain);
  }, [selectedDomain]);

  // Circuit stations list (first 6 or filtered)
  const circuitStations = useMemo(() => {
    return OSCE_STATION_REGISTRY.slice(0, 6);
  }, []);

  // Launch full mock circuit
  const startCircuit = () => {
    setCircuitAttempts([]);
    setDeansReport(null);
    setCurrentStationIndex(0);
    setActiveSingleStation(null);
    setIsCircuitActive(true);
  };

  // Complete a station during circuit
  const handleStationCompleted = (attempt: OsceStationAttempt) => {
    setCircuitAttempts((prev) => {
      const next = [...prev, attempt];
      // If this was the last station in the circuit, generate Dean's Report
      if (isCircuitActive && currentStationIndex >= circuitStations.length - 1) {
        const report = generateDeansAssessmentReport(next);
        setDeansReport(report);
      }
      return next;
    });
  };

  // Advance to next station in circuit
  const handleNextStation = () => {
    if (currentStationIndex < circuitStations.length - 1) {
      setCurrentStationIndex((prev) => prev + 1);
    } else {
      // Circuit completed
      setIsCircuitActive(false);
    }
  };

  // Reset all
  const exitToStationList = () => {
    setIsCircuitActive(false);
    setActiveSingleStation(null);
    setDeansReport(null);
  };

  // Dean's Report View
  if (deansReport) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-3xl">
              {deansReport.overallPassed ? '🏆' : '📋'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Official Dean&apos;s OSCE Assessment &amp; Clinical Certification
            </h1>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Candidate ID: <span className="font-mono text-white font-bold">{deansReport.candidateId}</span> • Date:{' '}
              <span className="text-white">{deansReport.circuitDate}</span>
            </p>

            <div className="pt-2">
              <span
                className={`inline-block px-5 py-2 rounded-xl text-sm font-black uppercase tracking-wider border shadow-md ${
                  deansReport.overallPassed
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/10'
                }`}
              >
                {deansReport.overallPassed ? 'ACCREDITATION PASSED' : 'RE-EXAMINATION MANDATED'}
              </span>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 uppercase font-semibold">Cumulative Score</div>
              <div className="text-2xl font-black text-white font-mono mt-1">
                {deansReport.overallScorePercentage}%
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 uppercase font-semibold">Stations Cleared</div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                {deansReport.stationsPassed} / {deansReport.totalStations}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 uppercase font-semibold">Stations Deficit</div>
              <div className="text-2xl font-black text-rose-400 font-mono mt-1">
                {deansReport.stationsFailed}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 uppercase font-semibold">Safety Violations</div>
              <div
                className={`text-2xl font-black font-mono mt-1 ${
                  deansReport.criticalSafetyViolationsCount > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {deansReport.criticalSafetyViolationsCount}
              </div>
            </div>
          </div>

          {/* 5-Dimension Competency Rubric Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-400" />
              Statutory 5-Dimension Competency Assessment
            </h3>

            <div className="space-y-3">
              {(Object.keys(deansReport.dimensionBreakdown) as (keyof typeof deansReport.dimensionBreakdown)[]).map(
                (dim) => {
                  const d = deansReport.dimensionBreakdown[dim];
                  const label = dim.replace('_', ' ');
                  return (
                    <div key={dim} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-300 capitalize">{label.toLowerCase()}</span>
                        <span className="font-mono text-slate-400">
                          {d.percentage}% ({d.scored}/{d.total} marks)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            d.percentage >= 75
                              ? 'bg-emerald-500'
                              : d.percentage >= 60
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${d.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Strengths & Remediation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Demonstrated Strengths
              </h4>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {deansReport.keyStrengths.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-2">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Targeted Remediation Areas
              </h4>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {deansReport.areasForImprovement.map((area, i) => (
                  <li key={i}>{area}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={exitToStationList}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition border border-slate-700"
            >
              ← Back to Station Library
            </button>

            <button
              onClick={startCircuit}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Mock Circuit
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Circuit Station View
  if (isCircuitActive) {
    const currentStation = circuitStations[currentStationIndex];
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between pb-2 border-b border-slate-800">
          <button
            onClick={exitToStationList}
            className="text-xs text-slate-400 hover:text-white font-medium"
          >
            ✕ Abort Circuit
          </button>
          <div className="text-xs font-mono text-slate-300">
            Station {currentStationIndex + 1} of {circuitStations.length}
          </div>
        </div>

        <OSCECircuitStation
          station={currentStation}
          circuitMode={true}
          stationIndex={currentStationIndex + 1}
          totalCircuitStations={circuitStations.length}
          onCompleteStation={handleStationCompleted}
          onNextStation={handleNextStation}
        />
      </div>
    );
  }

  // Active Single Station Practice View
  if (activeSingleStation) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-4">
        <div className="max-w-6xl mx-auto pb-2 border-b border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setActiveSingleStation(null)}
            className="text-xs text-slate-400 hover:text-white font-medium flex items-center gap-1"
          >
            ← Back to OSCE Stations Library
          </button>
          <span className="text-xs text-slate-500 uppercase font-mono">Individual Practice Drill</span>
        </div>

        <OSCECircuitStation
          station={activeSingleStation}
          circuitMode={false}
          onCompleteStation={handleStationCompleted}
        />
      </div>
    );
  }

  // Main Station Directory & Circuit Hub View
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Hero Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Standardized Clinical Licensing Stations
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  NMC CBME • USMLE Step 2 CS • GMC PLAB 2
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <Stethoscope className="w-9 h-9 text-blue-400" />
                OSCE Clinical Examination Circuit
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Experience realistic, high-stakes clinical exams with simulated standardized actors,
                countdown interval timers with audio bell chimes, 5-dimension objective scoring rubrics,
                and instant Dean&apos;s Performance Certification.
              </p>
            </div>

            {/* Start Full Circuit CTA */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 shrink-0 w-full lg:w-80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase">Timed Mock Circuit</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/40">
                  6 Stations
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Rotate through 6 sequential stations with 1-min reading door notes, active encounter
                timers, and audio chimes.
              </p>
              <button
                onClick={startCircuit}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                Launch Full Timed Mock Circuit
              </button>
            </div>
          </div>
        </div>

        {/* Domain Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          {DOMAIN_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedDomain(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedDomain === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Station Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              Available OSCE Clinical Stations ({filteredStations.length})
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Individual Practice or Full Circuit Drill
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStations.map((st) => (
              <div
                key={st.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-blue-500/5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/40">
                      {st.stationType}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {st.timeLimitMinutes} min
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition leading-snug">
                    {st.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {st.candidateBrief}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{st.domainTitle}</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      Pass: {st.passingScorePct}%
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveSingleStation(st)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    Enter Practice Station
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
