'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Droplets,
  AlertTriangle,
  ShieldAlert,
  Stethoscope,
  Info,
  CheckCircle2,
  XCircle,
  TrendingDown,
  Gauge,
  Zap,
  RotateCcw,
  Pill,
  Heart,
  Filter
} from 'lucide-react';
import {
  HepatorenalPatientParams,
  simulateHepatorenalSyndrome,
  HEPATORENAL_PRESETS,
  VasoactiveTherapyChoice
} from '../../.gemini/skills/HepatorenalSyndromeEngine';

export default function HepatorenalSyndromeSimulator() {
  const [params, setParams] = useState<HepatorenalPatientParams>(HEPATORENAL_PRESETS.classicHrsAki);
  const [activeTab, setActiveTab] = useState<'staging' | 'biomarkers' | 'vasoactive' | 'pearls'>('staging');

  const result = useMemo(() => simulateHepatorenalSyndrome(params), [params]);

  const loadPreset = (key: keyof typeof HEPATORENAL_PRESETS) => {
    setParams({ ...HEPATORENAL_PRESETS[key] });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                <Droplets className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Hepatorenal Syndrome (HRS-AKI), SBP & Terlipressin Workstation
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  ICA-AKI Criteria, 48h Albumin Challenge, Splanchnic Vasodilation, Terlipressin vs Pressors, LVP/PPCD & SBP Sort Protocol
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-amber-950/60 border border-amber-600/40 text-amber-300 rounded-full">
              Track B41 • Route #242
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-sky-950/60 border border-sky-600/40 text-sky-300 rounded-full">
              Hepatology & Nephrology
            </span>
          </div>
        </div>

        {/* Clinical Presets */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 mr-2 flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-slate-400" /> Presets:
          </span>
          <button
            onClick={() => loadPreset('classicHrsAki')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-amber-500 hover:bg-amber-950/20 text-slate-200 rounded-lg transition"
          >
            Classic HRS-AKI (Stage 2)
          </button>
          <button
            onClick={() => loadPreset('sbpTriggeredHrs')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-rose-500 hover:bg-rose-950/20 text-rose-300 rounded-lg transition"
          >
            SBP-Triggered HRS (Stage 3)
          </button>
          <button
            onClick={() => loadPreset('terlipressinRespiratoryHazardPreset')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-red-500 hover:bg-red-950/20 text-red-300 rounded-lg transition"
          >
            Terlipressin Respiratory Hazard (Trap)
          </button>
          <button
            onClick={() => loadPreset('postParacentesisCirculatoryDysfunction')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-purple-500 hover:bg-purple-950/20 text-purple-300 rounded-lg transition"
          >
            Post-Paracentesis PPCD (Albumin Deficit)
          </button>
          <button
            onClick={() => loadPreset('acuteTubularNecrosisMismatch')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-sky-500 hover:bg-sky-950/20 text-sky-300 rounded-lg transition"
          >
            ATN Mismatch (Structural Injury)
          </button>
        </div>
      </div>

      {/* Hero 4-Panel Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Panel 1: ICA-AKI Stage & Phenotype */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>ICA-AKI STAGE & PHENOTYPE</span>
              <Filter className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white tracking-wide">
              {result.icaAkiStage.replace(/_/g, ' ')}
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 border border-slate-700 text-slate-200">
              <span className={`w-2 h-2 rounded-full ${
                result.clinicalStatusBadge.color === 'rose' ? 'bg-rose-500 animate-ping' :
                result.clinicalStatusBadge.color === 'red' ? 'bg-red-500' :
                result.clinicalStatusBadge.color === 'amber' ? 'bg-amber-400' : 'bg-emerald-400'
              }`} />
              {result.clinicalStatusBadge.label}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Renal Phenotype:</span>
            <span className="text-amber-300 font-medium">{result.renalInjuryPhenotype.replace(/_/g, ' ')}</span>
          </div>
        </div>

        {/* Panel 2: MELD & Prognostic Scores */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>MELD-Na & TRANSPLANT TRIAGE</span>
              <Activity className="w-4 h-4 text-sky-400" />
            </div>
            <div className="flex items-baseline gap-4">
              <div>
                <span className="text-xs text-slate-400 block">MELD-Na</span>
                <span className={`text-2xl font-bold ${result.meldNaScore >= 30 ? 'text-rose-400' : 'text-amber-400'}`}>
                  {result.meldNaScore}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">MELD 3.0</span>
                <span className="text-2xl font-bold text-slate-200">
                  {result.meld3Score}
                </span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1 text-[11px]">
              {result.simultaneousLiverKidneyTransplantEligible ? (
                <span className="px-2 py-0.5 bg-purple-950/60 border border-purple-600/40 text-purple-300 rounded font-semibold">
                  SLKT Eligible (UNOS)
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 rounded">
                  Isolated Liver Candidate
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Current Serum Cr:</span>
            <span className="font-bold text-white">{params.currentSerumCreatinineMgDl} mg/dL</span>
          </div>
        </div>

        {/* Panel 3: Hemodynamics & Perfusion */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>HEMODYNAMICS & PERFUSION</span>
              <Heart className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">MAP</span>
                <span className={`text-2xl font-bold ${result.meanArterialPressureMmHg < 65 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {result.meanArterialPressureMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Room Air SpO₂</span>
                <span className={`text-2xl font-bold ${params.spO2PercentRoomAir < 90 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {params.spO2PercentRoomAir}%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">SBP Status:</span>
            <span className={`font-bold ${result.hasSbp ? 'text-rose-400' : 'text-emerald-400'}`}>
              {result.hasSbp ? 'Active SBP (PMN ≥ 250)' : 'Negative SBP'}
            </span>
          </div>
        </div>

        {/* Panel 4: Reversal & Mortality */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>OUTCOMES & REVERSAL</span>
              <TrendingDown className="w-4 h-4 text-rose-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Reversal Probability</span>
                <span className={`text-2xl font-bold ${result.predictedAkiReversalProbabilityPercent >= 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {result.predictedAkiReversalProbabilityPercent}%
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">30-Day Mortality</span>
                <span className={`text-2xl font-bold ${result.predicted30DayMortalityPercent >= 40 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {result.predicted30DayMortalityPercent}%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Safety Score:</span>
            <span className={`font-bold ${
              result.resuscitationSafetyScore >= 80 ? 'text-emerald-400' :
              result.resuscitationSafetyScore >= 50 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {result.resuscitationSafetyScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {result.criticalAlerts.length > 0 && (
        <div className="max-w-7xl mx-auto mb-8 space-y-2">
          {result.criticalAlerts.map((alert, idx) => (
            <div
              key={idx}
              className="p-4 bg-rose-950/80 border border-rose-600/60 rounded-xl flex items-start gap-3 text-rose-200 shadow-lg shadow-rose-950/20"
            >
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5 animate-bounce" />
              <div className="text-sm leading-relaxed">{alert}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex border-b border-slate-800 space-x-2">
          <button
            onClick={() => setActiveTab('staging')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'staging'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Liver Severity & ICA-AKI Staging
          </button>
          <button
            onClick={() => setActiveTab('biomarkers')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'biomarkers'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Diagnostic Workup & HRS vs ATN
          </button>
          <button
            onClick={() => setActiveTab('vasoactive')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'vasoactive'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Vasoactives, Terlipressin & SBP
          </button>
          <button
            onClick={() => setActiveTab('pearls')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'pearls'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Clinical Pearls & Guidelines
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="max-w-7xl mx-auto">
        {/* Tab 1: Liver Severity & ICA-AKI */}
        {activeTab === 'staging' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Creatinine & Vitals */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-amber-400" /> Renal Parameters & Vital Signs
              </h2>

              {/* Baseline and Current Creatinine */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Baseline Serum Cr</span>
                    <span className="font-bold text-slate-300">{params.baselineSerumCreatinineMgDl.toFixed(1)} mg/dL</span>
                  </div>
                  <input aria-label="Baseline Serum Cr"
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={params.baselineSerumCreatinineMgDl}
                    onChange={e => setParams({ ...params, baselineSerumCreatinineMgDl: Number(e.target.value) })}
                    className="w-full accent-slate-500 h-2 bg-slate-800 rounded-lg"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Current Serum Cr</span>
                    <span className="font-bold text-amber-400">{params.currentSerumCreatinineMgDl.toFixed(1)} mg/dL</span>
                  </div>
                  <input aria-label="Current Serum Cr"
                    type="range"
                    min="0.6"
                    max="6.0"
                    step="0.1"
                    value={params.currentSerumCreatinineMgDl}
                    onChange={e => setParams({ ...params, currentSerumCreatinineMgDl: Number(e.target.value) })}
                    className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>

              {/* Blood Pressure & Heart Rate */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Systolic Blood Pressure (SBP)</span>
                  <span className="font-bold text-slate-300">{params.sbpMmHg} mmHg</span>
                </div>
                <input aria-label="Systolic Blood Pressure (SBP)"
                  type="range"
                  min="70"
                  max="130"
                  value={params.sbpMmHg}
                  onChange={e => setParams({ ...params, sbpMmHg: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Diastolic Blood Pressure (DBP)</span>
                  <span className="font-bold text-slate-300">{params.dbpMmHg} mmHg</span>
                </div>
                <input aria-label="Diastolic Blood Pressure (DBP)"
                  type="range"
                  min="40"
                  max="80"
                  value={params.dbpMmHg}
                  onChange={e => setParams({ ...params, dbpMmHg: Number(e.target.value) })}
                  className="w-full accent-slate-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Room Air SpO2 & Pulmonary Edema */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg space-y-3">
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span className="font-semibold text-rose-300">Room Air SpO₂ (CONFIRM Trial Safety)</span>
                  <span className={`font-bold ${params.spO2PercentRoomAir < 90 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {params.spO2PercentRoomAir}%
                  </span>
                </div>
                <input aria-label="Room Air SpO₂ (CONFIRM Trial Safety)"
                  type="range"
                  min="82"
                  max="100"
                  value={params.spO2PercentRoomAir}
                  onChange={e => setParams({ ...params, spO2PercentRoomAir: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg"
                />
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={params.hasOvertPulmonaryEdema}
                    onChange={e => setParams({ ...params, hasOvertPulmonaryEdema: e.target.checked })}
                    className="accent-rose-500 rounded"
                  />
                  <span>Overt Pulmonary Edema / Respiratory Distress (Black Box Warning)</span>
                </label>
              </div>
            </div>

            {/* Right: Liver & Coagulation Metrics */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-400" /> Hepatic Synthetic Function & MELD Inputs
              </h2>

              {/* Bilirubin & INR */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Total Bilirubin</span>
                    <span className="font-bold text-amber-400">{params.totalBilirubinMgDl.toFixed(1)} mg/dL</span>
                  </div>
                  <input aria-label="Total Bilirubin"
                    type="range"
                    min="1.0"
                    max="35.0"
                    step="0.5"
                    value={params.totalBilirubinMgDl}
                    onChange={e => setParams({ ...params, totalBilirubinMgDl: Number(e.target.value) })}
                    className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>INR</span>
                    <span className="font-bold text-rose-400">{params.inr.toFixed(1)}</span>
                  </div>
                  <input aria-label="INR"
                    type="range"
                    min="1.0"
                    max="4.5"
                    step="0.1"
                    value={params.inr}
                    onChange={e => setParams({ ...params, inr: Number(e.target.value) })}
                    className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>

              {/* Serum Sodium & Albumin */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Serum Sodium</span>
                    <span className={`font-bold ${params.serumSodiumMeqL < 130 ? 'text-amber-400' : 'text-slate-300'}`}>
                      {params.serumSodiumMeqL} mEq/L
                    </span>
                  </div>
                  <input aria-label="Serum Sodium"
                    type="range"
                    min="118"
                    max="142"
                    value={params.serumSodiumMeqL}
                    onChange={e => setParams({ ...params, serumSodiumMeqL: Number(e.target.value) })}
                    className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Serum Albumin</span>
                    <span className="font-bold text-slate-300">{params.serumAlbuminGDl.toFixed(1)} g/dL</span>
                  </div>
                  <input aria-label="Serum Albumin"
                    type="range"
                    min="1.5"
                    max="4.5"
                    step="0.1"
                    value={params.serumAlbuminGDl}
                    onChange={e => setParams({ ...params, serumAlbuminGDl: Number(e.target.value) })}
                    className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>

              {/* Clinical Cirrhosis & Ascites */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">Clinical Prerequisites</span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={params.hasCirrhosis}
                      onChange={e => setParams({ ...params, hasCirrhosis: e.target.checked })}
                      className="accent-amber-500 rounded"
                    />
                    Cirrhosis Diagnosed
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={params.hasAscites}
                      onChange={e => setParams({ ...params, hasAscites: e.target.checked })}
                      className="accent-sky-500 rounded"
                    />
                    Ascites Present
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Diagnostic Workup & HRS vs ATN */}
        {activeTab === 'biomarkers' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: 48h Albumin Challenge & Diuretic Protocol */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Droplets className="w-5 h-5 text-amber-400" /> 48-Hour Diagnostic Albumin Challenge
              </h2>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg space-y-3 text-xs">
                <span className="font-semibold text-slate-200 block">
                  Mandatory 48-Hour Prerequisite Protocol (ICA Guidelines)
                </span>
                
                <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.diureticsWithdrawn48h}
                    onChange={e => setParams({ ...params, diureticsWithdrawn48h: e.target.checked })}
                    className="accent-amber-500 mt-0.5 rounded"
                  />
                  <div>
                    <span className="font-semibold text-amber-300">Complete Diuretic Withdrawal ≥ 48h</span>
                    <p className="text-[11px] text-slate-400">
                      Discontinue all loop diuretics (furosemide) and mineralocorticoid receptor antagonists (spironolactone).
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.albuminChallenge1gPerKgGiven48h}
                    onChange={e => setParams({ ...params, albuminChallenge1gPerKgGiven48h: e.target.checked })}
                    className="accent-sky-500 mt-0.5 rounded"
                  />
                  <div>
                    <span className="font-semibold text-sky-300">IV Albumin 1 g/kg/day × 2 Consecutive Days</span>
                    <p className="text-[11px] text-slate-400">
                      Administer 20% or 25% IV albumin (maximum 100 g/day) to restore effective circulating arterial volume.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.creatinineImprovedWithAlbumin}
                    onChange={e => setParams({ ...params, creatinineImprovedWithAlbumin: e.target.checked })}
                    className="accent-emerald-500 mt-0.5 rounded"
                  />
                  <div>
                    <span className="font-semibold text-emerald-300">Serum Creatinine Improved / Normalized</span>
                    <p className="text-[11px] text-slate-400">
                      If SCr drops &lt; 1.5 mg/dL or returns to baseline, diagnosis is Prerenal Volume Responsive AKI (NOT HRS).
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Right: Biomarkers of HRS vs ATN */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-sky-400" /> Urine Chemistry & Structural Damage Markers
              </h2>

              {/* Urine Sodium & FeNa */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Urine Sodium (UNa)</span>
                    <span className={`font-bold ${params.urineSodiumMeqL < 15 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {params.urineSodiumMeqL} mEq/L
                    </span>
                  </div>
                  <input aria-label="Urine Sodium (UNa)"
                    type="range"
                    min="4"
                    max="80"
                    value={params.urineSodiumMeqL}
                    onChange={e => setParams({ ...params, urineSodiumMeqL: Number(e.target.value) })}
                    className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg"
                  />
                  <span className="text-[11px] text-slate-400">&lt; 15 = HRS; &gt; 40 = ATN</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>FeNa (%)</span>
                    <span className={`font-bold ${params.fractionalExcretionSodiumPercent < 0.5 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {params.fractionalExcretionSodiumPercent.toFixed(2)}%
                    </span>
                  </div>
                  <input aria-label="FeNa (%)"
                    type="range"
                    min="0.1"
                    max="3.5"
                    step="0.05"
                    value={params.fractionalExcretionSodiumPercent}
                    onChange={e => setParams({ ...params, fractionalExcretionSodiumPercent: Number(e.target.value) })}
                    className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg"
                  />
                  <span className="text-[11px] text-slate-400">&lt; 0.5% = HRS; &gt; 1.5% = ATN</span>
                </div>
              </div>

              {/* FeUrea & Urinary NGAL */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>FeUrea (%)</span>
                    <span className="font-bold text-slate-300">{params.fractionalExcretionUreaPercent}%</span>
                  </div>
                  <input aria-label="FeUrea (%)"
                    type="range"
                    min="15"
                    max="65"
                    value={params.fractionalExcretionUreaPercent}
                    onChange={e => setParams({ ...params, fractionalExcretionUreaPercent: Number(e.target.value) })}
                    className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg"
                  />
                  <span className="text-[11px] text-slate-400">&lt; 35% = HRS (valid on diuretics)</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Urinary NGAL</span>
                    <span className={`font-bold ${params.urinaryNgalNgMl > 220 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {params.urinaryNgalNgMl} ng/mL
                    </span>
                  </div>
                  <input aria-label="Urinary NGAL"
                    type="range"
                    min="20"
                    max="800"
                    step="10"
                    value={params.urinaryNgalNgMl}
                    onChange={e => setParams({ ...params, urinaryNgalNgMl: Number(e.target.value) })}
                    className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg"
                  />
                  <span className="text-[11px] text-slate-400">&lt; 220 = HRS; &gt; 220-400 = ATN</span>
                </div>
              </div>

              {/* Urine Sediment */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <label className="flex items-start gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.urineSedimentActiveOrMuddyCasts}
                    onChange={e => setParams({ ...params, urineSedimentActiveOrMuddyCasts: e.target.checked })}
                    className="accent-rose-500 mt-0.5 rounded"
                  />
                  <div>
                    <span className="font-semibold text-rose-300">Active Urine Sediment / Muddy Brown Granular Casts</span>
                    <p className="text-[11px] text-slate-400">
                      Hallmark of acute tubular necrosis (ATN). In pure HRS-AKI, sediment is typically bland with occasional hyaline casts.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Vasoactive Therapies & SBP */}
        {activeTab === 'vasoactive' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Vasoactive Pharmacotherapy */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-amber-400" /> Splanchnic Vasoconstrictor Pharmacotherapy
              </h2>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Select Vasoactive Regimen
                </label>
                <select
                  value={params.vasoactiveTherapy}
                  onChange={e => setParams({ ...params, vasoactiveTherapy: e.target.value as VasoactiveTherapyChoice })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="NONE">None (Untreated)</option>
                  <option value="TERLIPRESSIN_PLUS_ALBUMIN">Terlipressin + IV Albumin (Gold Standard V1a Agonist: 0.85-1.7 mg q6h)</option>
                  <option value="NOREPINEPHRINE_PLUS_ALBUMIN">Norepinephrine + IV Albumin (ICU Infusion titrated to MAP target)</option>
                  <option value="MIDODRINE_OCTREOTIDE_ALBUMIN">Midodrine + Octreotide + Albumin (Oral historical regimen &mdash; inferior)</option>
                  <option value="DIURETICS_ACTIVE_HAZARD">Active Diuretics (LETHAL PITFALL: Exacerbates hypoperfusion!)</option>
                </select>
              </div>

              {/* Paracentesis & PPCD */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg space-y-3">
                <span className="text-xs font-semibold text-slate-200 block">
                  Large-Volume Paracentesis (LVP) & PPCD Prevention
                </span>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Ascites Removed (Liters)</span>
                    <span className="font-bold text-amber-400">{params.largeVolumeParacentesisLiters} L</span>
                  </div>
                  <input aria-label="Ascites Removed (Liters)"
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={params.largeVolumeParacentesisLiters}
                    onChange={e => setParams({ ...params, largeVolumeParacentesisLiters: Number(e.target.value) })}
                    className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg"
                  />
                  <span className="text-[11px] text-slate-400">Paracentesis &gt; 5L mandates IV Albumin (8g per Liter removed &gt; 5L)</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Post-LVP Albumin Administered</span>
                    <span className="font-bold text-sky-400">{params.paracentesisAlbuminGivenGrams} g</span>
                  </div>
                  <input aria-label="Post-LVP Albumin Administered"
                    type="range"
                    min="0"
                    max="120"
                    step="4"
                    value={params.paracentesisAlbuminGivenGrams}
                    onChange={e => setParams({ ...params, paracentesisAlbuminGivenGrams: Number(e.target.value) })}
                    className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg"
                  />
                  {result.hasPpcdRisk && (
                    <div className="mt-1 text-[11px]">
                      {result.paracentesisAlbuminDeficitGrams > 0 ? (
                        <span className="text-rose-400 font-semibold">
                          Deficit: {result.paracentesisAlbuminDeficitGrams}g albumin required to prevent PPCD!
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-semibold">
                          Optimal PPCD prophylaxis achieved.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: SBP & The Sort Protocol */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" /> Spontaneous Bacterial Peritonitis (SBP)
              </h2>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Ascitic Fluid PMN Count</span>
                  <span className={`font-bold ${params.asciticFluidPmnCountPerMm3 >= 250 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {params.asciticFluidPmnCountPerMm3} /mm³
                  </span>
                </div>
                <input aria-label="Ascitic Fluid PMN Count"
                  type="range"
                  min="10"
                  max="2000"
                  step="20"
                  value={params.asciticFluidPmnCountPerMm3}
                  onChange={e => setParams({ ...params, asciticFluidPmnCountPerMm3: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg"
                />
                <span className="text-[11px] text-slate-400">PMN count ≥ 250/mm³ defines spontaneous bacterial peritonitis.</span>
              </div>

              {/* Sort Protocol */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.sbpSortAlbuminProtocolGiven}
                    onChange={e => setParams({ ...params, sbpSortAlbuminProtocolGiven: e.target.checked })}
                    className="accent-emerald-500 mt-0.5 rounded"
                  />
                  <div>
                    <span className="font-semibold text-emerald-300">The Sort Albumin Protocol Administered</span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      IV Albumin 1.5 g/kg at diagnosis (within 6h) followed by 1.0 g/kg on Day 3 + IV Ceftriaxone 2g daily.
                      Sort et al. (NEJM 1999) proved this protocol drops renal impairment from 33% to 10% and mortality from 29% to 10%.
                    </p>
                  </div>
                </label>
              </div>

              <div className="p-4 bg-amber-950/30 border border-amber-600/30 rounded-lg text-xs space-y-2 text-amber-200">
                <span className="font-bold text-amber-300">Active Physiologic Mechanisms:</span>
                {result.physiologicMechanisms.map((mech, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{mech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Clinical Pearls & Guidelines */}
        {activeTab === 'pearls' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Step-by-Step Action Plan */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Step-by-Step Resuscitation Protocol
              </h2>

              <div className="space-y-2.5">
                {result.stepByStepActionPlan.map((step, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: High Stakes Pearls & Guidelines */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-400" /> High-Stakes Pearls & Clinical Trial Guardrails
              </h2>

              <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                <div className="p-3 bg-rose-950/30 border border-rose-600/30 rounded-lg">
                  <span className="font-bold text-rose-300 block mb-1">
                    CONFIRM Trial Black Box Warning: Terlipressin Hypoxemic Failure
                  </span>
                  <p>
                    Terlipressin (FDA approved 2022) reverses HRS-AKI significantly more effectively than placebo, but carries a 14% rate of serious adverse events involving respiratory failure (pulmonary edema/fluid overload). Continuous pulse oximetry is mandatory. Terlipressin is strictly contraindicated if baseline room air SpO₂ &lt; 90%.
                  </p>
                </div>

                <div className="p-3 bg-amber-950/30 border border-amber-600/30 rounded-lg">
                  <span className="font-bold text-amber-300 block mb-1">
                    The Splanchnic Vasodilation Theory of HRS
                  </span>
                  <p>
                    Severe portal hypertension generates endothelial shear stress, releasing vast amounts of nitric oxide (NO) into the mesenteric circulation. The resulting splanchnic arterial vasodilation creates severe &ldquo;effective arterial hypovolemia&rdquo;. Massive baroreceptor-mediated activation of RAAS and the sympathetic nervous system causes profound, unremitting renal cortical vasoconstriction.
                  </p>
                </div>

                <div className="p-3 bg-purple-950/30 border border-purple-600/30 rounded-lg">
                  <span className="font-bold text-purple-300 block mb-1">
                    Simultaneous Liver-Kidney Transplantation (SLKT) Triage
                  </span>
                  <p>
                    Under UNOS/OPTN medical consensus criteria, patients with sustained Stage 3 AKI requiring dialysis for ≥ 4 weeks, or persistent eGFR ≤ 25 mL/min for ≥ 6 weeks, qualify for dual listing for Simultaneous Liver-Kidney Transplantation (SLKT) to prevent catastrophic post-transplant ESRD.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
