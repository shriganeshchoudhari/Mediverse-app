"use client";

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Activity,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Droplets,
  Heart,
  Wind,
  Sliders,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Table,
  BookOpen,
  Info,
  Scale
} from 'lucide-react';
import {
  News2Vitals,
  News2ScoreBreakdown,
  HourlyFlowsheetRow,
  PatientFlowsheetProfile,
  calculateNews2Score,
  calculateFluidBalanceSummary,
  generateSepsisProgressionCase
} from '../../.gemini/skills/BedsideFlowsheetNews2Engine';

export default function BedsideFlowsheetNews2Simulator() {
  const [patient, setPatient] = useState<PatientFlowsheetProfile>(generateSepsisProgressionCase());
  const [activeTab, setActiveTab] = useState<'cockpit' | 'flowsheet' | 'protocols'>('cockpit');

  // Interactive Live Bedside Vitals (initialized to latest hourly row)
  const latestRow = patient.hourlyData[patient.hourlyData.length - 1];
  const [currentVitals, setCurrentVitals] = useState<News2Vitals>(latestRow.vitals);

  // NEWS2 calculation for current bedside vitals
  const news2Breakdown = useMemo(
    () => calculateNews2Score(currentVitals),
    [currentVitals]
  );

  // Fluid balance summary
  const fluidSummary = useMemo(
    () => calculateFluidBalanceSummary(patient.hourlyData, patient.admissionWeightKg),
    [patient]
  );

  // Vitals change handler
  const updateVital = <K extends keyof News2Vitals>(key: K, value: News2Vitals[K]) => {
    setCurrentVitals(prev => ({ ...prev, [key]: value }));
  };

  // Helper for score pill color
  const getScoreBadgeColor = (score: number) => {
    if (score === 0) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (score === 1) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    if (score === 2) return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    return 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold animate-pulse';
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Track C7 &bull; Inpatient Nursing &amp; Critical Care Medicine
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                RCP NEWS2 Official Standard
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                24-Hour Intensive Care Grid
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Advanced Bedside Flowsheet, Fluid Balance &amp; Early Warning Deterioration (NEWS2) Engine
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              Clinical early warning and intensive care monitoring cockpit. Score National Early Warning Score 2
              (NEWS2) across Scale 1 and Scale 2 (COPD hypercapnic respiratory failure), monitor 24-hour hourly
              crystalloid/colloid input vs output balances, and compute percentage fluid overload (%FO).
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs">
            <div className="text-center px-2">
              <div className="text-slate-400 font-mono text-[10px] uppercase">Admission Weight</div>
              <div className="font-bold text-white text-sm">{patient.admissionWeightKg} kg</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-2">
              <div className="text-slate-400 font-mono text-[10px] uppercase">Current Weight</div>
              <div className="font-bold text-amber-400 text-sm">{patient.currentWeightKg} kg</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-2">
              <div className="text-slate-400 font-mono text-[10px] uppercase">Location</div>
              <div className="font-bold text-cyan-400 text-sm">Stepdown Unit</div>
            </div>
          </div>
        </div>

        {/* Patient Demographic Banner */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white text-sm">{patient.name}</span>
            <span className="font-mono text-slate-400">{patient.medicalRecordNumber}</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">{patient.diagnosis}</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            {patient.historySummary}
          </div>
        </div>
      </div>

      {/* Real-time KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className={`p-4 rounded-xl border text-center shadow ${
          news2Breakdown.riskLevel === 'HIGH'
            ? 'bg-rose-950/40 border-rose-500/80 shadow-rose-900/20'
            : news2Breakdown.riskLevel === 'MEDIUM'
            ? 'bg-amber-950/40 border-amber-500/80'
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="text-[10px] font-mono text-slate-400 uppercase">NEWS2 Score &amp; Tier</div>
          <div className={`text-2xl font-black font-mono mt-0.5 ${
            news2Breakdown.riskLevel === 'HIGH' ? 'text-rose-400 animate-pulse' : 'text-amber-400'
          }`}>
            {news2Breakdown.totalScore} &bull; {news2Breakdown.riskLevel}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center shadow">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Cumulative Net Fluid</div>
          <div className={`text-2xl font-bold font-mono mt-0.5 ${
            fluidSummary.net24hBalanceMl > 2000 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {fluidSummary.net24hBalanceMl > 0 ? `+${fluidSummary.net24hBalanceMl}` : fluidSummary.net24hBalanceMl} <span className="text-xs font-normal text-slate-400">mL</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center shadow">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Avg Urine Output</div>
          <div className={`text-2xl font-bold font-mono mt-0.5 ${
            fluidSummary.averageUrineOutputMlPerKgPerHour < 0.5 ? 'text-rose-400' : 'text-white'
          }`}>
            {fluidSummary.averageUrineOutputMlPerKgPerHour} <span className="text-xs font-normal text-slate-400">mL/kg/h</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center shadow">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Fluid Overload (%FO)</div>
          <div className={`text-2xl font-bold font-mono mt-0.5 ${
            fluidSummary.percentFluidOverload >= 10.0 ? 'text-rose-400' : 'text-cyan-400'
          }`}>
            {fluidSummary.percentFluidOverload}% <span className="text-xs font-normal text-slate-400">(&lt;10%)</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center shadow">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Observation Frequency</div>
          <div className="text-2xl font-bold font-mono text-indigo-300 mt-0.5">
            q{news2Breakdown.monitoringFrequencyHours}h
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab('cockpit')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'cockpit' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Activity className="w-4 h-4" />
          Live Bedside NEWS2 Cockpit &amp; RRT
        </button>

        <button
          onClick={() => setActiveTab('flowsheet')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'flowsheet' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Table className="w-4 h-4" />
          24-Hour Intensive Care Hourly Flowsheet
        </button>

        <button
          onClick={() => setActiveTab('protocols')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'protocols' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          NEWS2 Protocols &amp; Escalation Pathways
        </button>
      </div>

      {/* Tab 1: Cockpit */}
      {activeTab === 'cockpit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Live Bedside Vitals Tuner (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-white text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  Interactive Bedside Physiological Observation Tuner
                </span>
                <span className="text-xs font-mono text-cyan-400 font-bold">Live Scoring</span>
              </div>

              {/* Respiratory Rate */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Respiratory Rate (breaths/min):</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-white">{currentVitals.respiratoryRate} bpm</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${getScoreBadgeColor(news2Breakdown.respiratoryRateScore)}`}>
                      +{news2Breakdown.respiratoryRateScore} pts
                    </span>
                  </div>
                </div>
                <input aria-label="Respiratory Rate"
                  type="range"
                  min={6}
                  max={45}
                  value={currentVitals.respiratoryRate}
                  onChange={e => updateVital('respiratoryRate', parseInt(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-900 rounded"
                />
              </div>

              {/* SpO2 & Scale Selector */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-medium">Pulse Oximetry (SpO2):</span>
                    <select
                      value={currentVitals.spo2Scale}
                      onChange={e => updateVital('spo2Scale', parseInt(e.target.value) as 1 | 2)}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[10px] font-bold text-cyan-400"
                    >
                      <option value={1}>Scale 1 (Standard)</option>
                      <option value={2}>Scale 2 (Hypercapnic / COPD 88-92%)</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-white">{currentVitals.spo2Percent}%</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${getScoreBadgeColor(news2Breakdown.spo2Score)}`}>
                      +{news2Breakdown.spo2Score} pts
                    </span>
                  </div>
                </div>
                <input aria-label="Spo2 Percent"
                  type="range"
                  min={75}
                  max={100}
                  value={currentVitals.spo2Percent}
                  onChange={e => updateVital('spo2Percent', parseInt(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-900 rounded"
                />

                {/* Supplemental O2 Toggle */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">On Supplemental Oxygen (Nasal Cannula / Mask):</span>
                  <button
                    onClick={() => updateVital('onSupplementalOxygen', !currentVitals.onSupplementalOxygen)}
                    className={`px-3 py-1 rounded text-xs font-bold transition border ${
                      currentVitals.onSupplementalOxygen
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    {currentVitals.onSupplementalOxygen ? '+2 pts (On Oxygen)' : '0 pts (Room Air)'}
                  </button>
                </div>
              </div>

              {/* Systolic Blood Pressure */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Systolic Blood Pressure (mmHg):</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-white">{currentVitals.systolicBp} mmHg</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${getScoreBadgeColor(news2Breakdown.systolicBpScore)}`}>
                      +{news2Breakdown.systolicBpScore} pts
                    </span>
                  </div>
                </div>
                <input aria-label="Systolic Bp"
                  type="range"
                  min={60}
                  max={240}
                  value={currentVitals.systolicBp}
                  onChange={e => updateVital('systolicBp', parseInt(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-900 rounded"
                />
              </div>

              {/* Heart Rate */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Heart Rate (bpm):</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-white">{currentVitals.heartRate} bpm</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${getScoreBadgeColor(news2Breakdown.heartRateScore)}`}>
                      +{news2Breakdown.heartRateScore} pts
                    </span>
                  </div>
                </div>
                <input aria-label="Heart Rate"
                  type="range"
                  min={30}
                  max={180}
                  value={currentVitals.heartRate}
                  onChange={e => updateVital('heartRate', parseInt(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-900 rounded"
                />
              </div>

              {/* Temperature & ACVPU */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Temp (&deg;C):</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] border ${getScoreBadgeColor(news2Breakdown.temperatureScore)}`}>
                      +{news2Breakdown.temperatureScore}
                    </span>
                  </div>
                  <input
                    type="number"
                    step={0.1}
                    value={currentVitals.temperatureCelsius}
                    onChange={e => updateVital('temperatureCelsius', parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Consciousness (ACVPU):</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] border ${getScoreBadgeColor(news2Breakdown.consciousnessScore)}`}>
                      +{news2Breakdown.consciousnessScore}
                    </span>
                  </div>
                  <select
                    value={currentVitals.consciousness}
                    onChange={e => updateVital('consciousness', e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-bold"
                  >
                    <option value="A">Alert (A)</option>
                    <option value="C">New Confusion (C)</option>
                    <option value="V">Responds to Voice (V)</option>
                    <option value="P">Responds to Pain (P)</option>
                    <option value="U">Unresponsive (U)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: NEWS2 Decision Banner & Fluid Balance Overview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Clinical Escalation Response Banner */}
            <div
              className={`p-5 rounded-2xl border shadow-xl relative overflow-hidden backdrop-blur-md space-y-3 ${
                news2Breakdown.riskLevel === 'HIGH'
                  ? 'bg-rose-950/40 border-rose-500/80 shadow-rose-900/30'
                  : news2Breakdown.riskLevel === 'MEDIUM'
                  ? 'bg-amber-950/40 border-amber-500/80 shadow-amber-900/30'
                  : news2Breakdown.riskLevel === 'LOW_MEDIUM'
                  ? 'bg-orange-950/40 border-orange-500/80 shadow-orange-900/30'
                  : 'bg-emerald-950/40 border-emerald-500/80 shadow-emerald-900/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white text-base">
                  {news2Breakdown.riskLevel === 'HIGH' ? (
                    <ShieldAlert className="w-6 h-6 text-rose-400 animate-pulse" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-amber-400" />
                  )}
                  <span>NEWS2 Tier: {news2Breakdown.riskLevel} RISK</span>
                </div>
                <span className="text-2xl font-black font-mono text-white">{news2Breakdown.totalScore} pts</span>
              </div>

              <div className="text-xs text-slate-200 leading-relaxed font-semibold">
                {news2Breakdown.clinicalAction}
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Escalation Protocol:</div>
                <div className="text-[11px] text-slate-300 leading-relaxed">{news2Breakdown.recommendedEscalation}</div>
              </div>
            </div>

            {/* Fluid Intake vs Output Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  12-Hour Fluid Balance Breakdown
                </span>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">
                  {fluidSummary.fluidOverloadRisk} Risk
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">Total Intake:</span>
                  <div className="text-base font-bold font-mono text-cyan-400">+{fluidSummary.total24hIntakeMl} mL</div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">Total Output:</span>
                  <div className="text-base font-bold font-mono text-amber-400">-{fluidSummary.total24hOutputMl} mL</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div className="font-semibold text-rose-400">Fluid Overload &amp; Sepsis Guidance:</div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Cumulative positive fluid balance &gt; 10% of admission weight ({((patient.admissionWeightKg * 10) / 100).toFixed(1)} L)
                  is independently associated with prolonged mechanical ventilation, acute kidney injury progression, and mortality.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 24-Hour Intensive Care Hourly Flowsheet */}
      {activeTab === 'flowsheet' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Table className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold text-white">Intensive Care Hourly Flowsheet Matrix (08:00 &ndash; 19:00)</h2>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">12-Hour Timeline</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Hour</th>
                  <th className="py-2.5 px-3">RR</th>
                  <th className="py-2.5 px-3">SpO2</th>
                  <th className="py-2.5 px-3">BP</th>
                  <th className="py-2.5 px-3">HR</th>
                  <th className="py-2.5 px-3">AVPU</th>
                  <th className="py-2.5 px-3">Temp</th>
                  <th className="py-2.5 px-3 text-cyan-400 font-bold">NEWS2</th>
                  <th className="py-2.5 px-3">Intake</th>
                  <th className="py-2.5 px-3">Output</th>
                  <th className="py-2.5 px-3 text-amber-400">Net</th>
                  <th className="py-2.5 px-3 text-white font-bold">Cumul</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
                {patient.hourlyData.map(r => (
                  <tr key={r.hourString} className="hover:bg-slate-800/30">
                    <td className="py-2 px-3 font-bold text-white">{r.hourString}</td>
                    <td className={`py-2 px-3 ${r.vitals.respiratoryRate >= 25 ? 'text-rose-400 font-bold' : ''}`}>
                      {r.vitals.respiratoryRate}
                    </td>
                    <td className="py-2 px-3">{r.vitals.spo2Percent}% {r.vitals.onSupplementalOxygen ? '(O2)' : ''}</td>
                    <td className={`py-2 px-3 ${r.vitals.systolicBp <= 90 ? 'text-rose-400 font-bold' : ''}`}>
                      {r.vitals.systolicBp}
                    </td>
                    <td className={`py-2 px-3 ${r.vitals.heartRate >= 120 ? 'text-rose-400 font-bold' : ''}`}>
                      {r.vitals.heartRate}
                    </td>
                    <td className="py-2 px-3">{r.vitals.consciousness}</td>
                    <td className="py-2 px-3">{r.vitals.temperatureCelsius}&deg;C</td>
                    <td className={`py-2 px-3 font-bold ${r.news2Score >= 7 ? 'text-rose-400' : 'text-cyan-400'}`}>
                      {r.news2Score}
                    </td>
                    <td className="py-2 px-3 text-emerald-400">+{r.totalIntakeMl}</td>
                    <td className="py-2 px-3 text-amber-400">-{r.totalOutputMl}</td>
                    <td className="py-2 px-3 font-bold">{r.hourlyNetBalanceMl > 0 ? `+${r.hourlyNetBalanceMl}` : r.hourlyNetBalanceMl}</td>
                    <td className="py-2 px-3 font-bold text-white">+{r.cumulativeNetBalanceMl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Protocols */}
      {activeTab === 'protocols' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Royal College of Physicians (RCP) NEWS2 Trigger Tiers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">High Risk (NEWS2 &ge; 7):</div>
              <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4 leading-relaxed">
                <li>Emergency assessment by critical care team with advanced airway and hemodynamic capability.</li>
                <li>Transfer to High Dependency Unit (HDU) or Intensive Care Unit (ICU).</li>
                <li>Continuous physiological monitoring (arterial line, continuous pulse oximetry, hourly urine output).</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Scale 2 SpO2 (Hypercapnic Respiratory Failure):</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                In patients with chronic respiratory failure and documented hypercapnia (e.g. severe COPD), high supplemental
                oxygen reduces hypoxic ventilatory drive and promotes ventilation-perfusion mismatch via loss of hypoxic pulmonary
                vasoconstriction. Scale 2 targets 88-92% SpO2 and scores excessive oxygenation (&ge;97% on supplemental O2) as 3 points.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
