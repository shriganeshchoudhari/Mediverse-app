'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Heart,
  AlertTriangle,
  ShieldAlert,
  Zap,
  Info,
  CheckCircle2,
  XCircle,
  TrendingDown,
  Gauge,
  Scissors,
  Stethoscope,
  Filter
} from 'lucide-react';
import {
  AorticDissectionPatientParams,
  simulateAorticDissection,
  AORTIC_DISSECTION_PRESETS,
  StanfordClassification,
  AasPathologySubtype,
  BetaBlockerRegimen,
  VasodilatorRegimen,
  SurgicalInterventionChoice
} from '../../.gemini/skills/AorticDissectionEngine';

export default function AorticDissectionSimulator() {
  const [params, setParams] = useState<AorticDissectionPatientParams>(AORTIC_DISSECTION_PRESETS.stanfordTypeASurgicalEmergency);
  const [activeTab, setActiveTab] = useState<'anatomy' | 'antiImpulse' | 'malperfusion' | 'surgery'>('antiImpulse');

  const result = useMemo(() => simulateAorticDissection(params), [params]);

  const loadPreset = (key: keyof typeof AORTIC_DISSECTION_PRESETS) => {
    setParams({ ...AORTIC_DISSECTION_PRESETS[key] });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
                <Heart className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Acute Aortic Syndromes & Aortic Dissection Workstation
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Stanford Type A vs B, Anti-Impulse Therapy (dP/dt Control), Malperfusion Syndromes, Tamponade Dilemma & TEVAR
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-rose-950/60 border border-rose-600/40 text-rose-300 rounded-full">
              Track B42 • Route #243
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-indigo-950/60 border border-indigo-600/40 text-indigo-300 rounded-full">
              Vascular Surgery & Cardiology
            </span>
          </div>
        </div>

        {/* Presets */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 mr-2 flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-slate-400" /> Presets:
          </span>
          <button
            onClick={() => loadPreset('stanfordTypeASurgicalEmergency')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-rose-500 hover:bg-rose-950/20 text-rose-300 rounded-lg transition"
          >
            Stanford Type A (Surgical Emergency)
          </button>
          <button
            onClick={() => loadPreset('vasodilatorCatastropheDisaster')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-red-500 hover:bg-red-950/30 text-red-400 rounded-lg transition"
          >
            The Vasodilator Catastrophe (Trap)
          </button>
          <button
            onClick={() => loadPreset('complicatedTypeBMalperfusion')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-purple-500 hover:bg-purple-950/20 text-purple-300 rounded-lg transition"
          >
            Complicated Type B (TEVAR Indicated)
          </button>
          <button
            onClick={() => loadPreset('uncomplicatedTypeBMedical')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-emerald-500 hover:bg-emerald-950/20 text-emerald-300 rounded-lg transition"
          >
            Uncomplicated Type B (Medical Target Met)
          </button>
          <button
            onClick={() => loadPreset('tamponadePericardiocentesisBlowout')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-amber-500 hover:bg-amber-950/20 text-amber-300 rounded-lg transition"
          >
            Tamponade Pericardiocentesis Blowout (Hazard)
          </button>
        </div>
      </div>

      {/* Hero 4-Panel Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Panel 1: Stanford Classification */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>STANFORD CLASSIFICATION</span>
              <Filter className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl font-bold text-white tracking-wide">
              {params.stanfordClass.replace(/_/g, ' ')}
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
            <span className="text-slate-400">AAS Subtype:</span>
            <span className="text-rose-300 font-medium">{params.aasSubtype.replace(/_/g, ' ')}</span>
          </div>
        </div>

        {/* Panel 2: Anti-Impulse Target & dP/dt */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>ANTI-IMPULSE METRICS (dP/dt)</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-3">
              <div>
                <span className="text-xs text-slate-400 block">Estimated dP/dt</span>
                <span className={`text-2xl font-bold ${result.estimatedDpDtMmHgPerSec > 1200 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {result.estimatedDpDtMmHgPerSec} <span className="text-xs font-normal text-slate-400">mmHg/s</span>
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                result.isAntiImpulseTargetAchieved
                  ? 'bg-emerald-950/60 border border-emerald-600/40 text-emerald-300'
                  : 'bg-rose-950/60 border border-rose-600/40 text-rose-300'
              }`}>
                {result.isAntiImpulseTargetAchieved ? 'Target Met (HR ≤ 60 & SBP 100-120)' : 'Anti-Impulse Target Unmet'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Aortic Shear Stress:</span>
            <span className="font-bold text-white">{result.aorticWallShearStressIndex}/100</span>
          </div>
        </div>

        {/* Panel 3: Hemodynamics & Perfusion */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>HEMODYNAMICS & PRESSURE</span>
              <Gauge className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Heart Rate</span>
                <span className={`text-2xl font-bold ${params.heartRateBpm <= 60 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {params.heartRateBpm} <span className="text-xs font-normal text-slate-400">bpm</span>
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Blood Pressure</span>
                <span className={`text-2xl font-bold ${params.sbpMmHg <= 120 && params.sbpMmHg >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {params.sbpMmHg}/{params.dbpMmHg}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Mean Arterial Pressure:</span>
            <span className="font-bold text-white">{result.meanArterialPressureMmHg} mmHg</span>
          </div>
        </div>

        {/* Panel 4: Mortality & Malperfusion */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>MORTALITY & MALPERFUSION</span>
              <TrendingDown className="w-4 h-4 text-rose-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">In-Hospital Mortality</span>
                <span className={`text-2xl font-bold ${result.inHospitalMortalityRiskPercent >= 30 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {result.inHospitalMortalityRiskPercent}%
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Malperfusion Organs</span>
                <span className={`text-2xl font-bold ${result.malperfusionOrgansCount > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {result.malperfusionOrgansCount}
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
            onClick={() => setActiveTab('antiImpulse')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'antiImpulse'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Anti-Impulse Therapy (dP/dt)
          </button>
          <button
            onClick={() => setActiveTab('anatomy')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'anatomy'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Classification & Anatomy
          </button>
          <button
            onClick={() => setActiveTab('malperfusion')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'malperfusion'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Branch Malperfusion Syndromes
          </button>
          <button
            onClick={() => setActiveTab('surgery')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'surgery'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Surgical Repair & TEVAR
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="max-w-7xl mx-auto">
        {/* Tab 1: Anti-Impulse Therapy */}
        {activeTab === 'antiImpulse' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Anti-Impulse Controls */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" /> Pharmacologic Anti-Impulse Titration
              </h2>

              {/* Heart Rate */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Heart Rate (HR) &mdash; Target &lt; 60 bpm</span>
                  <span className={`font-bold ${params.heartRateBpm <= 60 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {params.heartRateBpm} bpm
                  </span>
                </div>
                <input aria-label="Heart Rate (HR) &mdash; Target &lt; 60 bpm"
                  type="range"
                  min="45"
                  max="140"
                  value={params.heartRateBpm}
                  onChange={e => setParams({ ...params, heartRateBpm: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              {/* SBP & DBP */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Systolic Blood Pressure (SBP) &mdash; Target 100-120 mmHg</span>
                  <span className={`font-bold ${params.sbpMmHg >= 100 && params.sbpMmHg <= 120 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {params.sbpMmHg} mmHg
                  </span>
                </div>
                <input aria-label="Systolic Blood Pressure (SBP) &mdash; Target 100-120 mmHg"
                  type="range"
                  min="80"
                  max="240"
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
                  max="130"
                  value={params.dbpMmHg}
                  onChange={e => setParams({ ...params, dbpMmHg: Number(e.target.value) })}
                  className="w-full accent-slate-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Beta-Blocker Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  1st-Line: IV Beta-Blockade (HR Target &lt; 60 bpm)
                </label>
                <select
                  value={params.betaBlocker}
                  onChange={e => setParams({ ...params, betaBlocker: e.target.value as BetaBlockerRegimen })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="NONE">None</option>
                  <option value="ESMOLOL_INFUSION">Esmolol Infusion (Ultra-short acting, titratable &mdash; 50-300 mcg/kg/min)</option>
                  <option value="LABETALOL_IV">Labetalol IV (Combined alpha-1 and beta-blocker &mdash; 10-20 mg bolus q10m)</option>
                  <option value="DILTIAZEM_IV_ALTERNATIVE">Diltiazem IV (Non-DHP CCB alternative if beta-blockers contraindicated)</option>
                </select>
              </div>

              {/* Vasodilator Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  2nd-Line: Arterial Vasodilator (SBP Target 100-120 mmHg)
                </label>
                <select
                  value={params.vasodilator}
                  onChange={e => setParams({ ...params, vasodilator: e.target.value as VasodilatorRegimen })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="NONE">None</option>
                  <option value="NICARDIPINE_IV">Nicardipine IV Infusion (5 - 15 mg/h)</option>
                  <option value="CLEVIDIPINE_IV">Clevidipine IV Infusion (1 - 32 mg/h)</option>
                  <option value="NITROPRUSSIDE_IV">Sodium Nitroprusside (0.5 - 10 mcg/kg/min)</option>
                  <option value="HYDRALAZINE_HAZARD">Hydralazine (HAZARD: Unpredictable reflex tachycardia spikes dP/dt!)</option>
                </select>
              </div>

              {/* Vasodilator Catastrophe Trap Toggle */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.vasodilatorStartedBeforeBetaBlocker}
                    onChange={e => setParams({ ...params, vasodilatorStartedBeforeBetaBlocker: e.target.checked })}
                    className="accent-rose-500 mt-0.5 rounded"
                  />
                  <div>
                    <span className="font-semibold text-rose-300">Vasodilator started BEFORE Beta-Blocker</span>
                    <p className="text-[11px] text-slate-400">
                      THE VASODILATOR CATASTROPHE: Peripheral vasodilation unmasked by beta-blockade unleashes reflex sympathetic tachycardia, dramatically spiking dP/dt and tearing the aortic wall!
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Right: Biophysics of dP/dt Shearing */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-400" /> Biophysical Mechanics of Aortic Shearing Stress
              </h2>

              <div className="p-4 bg-amber-950/30 border border-amber-600/40 rounded-lg text-xs text-amber-200 leading-relaxed space-y-2">
                <p className="font-bold text-amber-300">Why Blood Pressure Reduction Alone Is Insufficient:</p>
                <p>
                  The mechanical tearing force propagating an aortic dissection flap is the rate of ventricular pressure rise (&Delta;P/&Delta;t or $dP/dt$). Blood pressure represents static wall stress, whereas $dP/dt$ represents the velocity of pulsatile kinetic energy hitting the intimal flap.
                </p>
                <p>
                  Administering a vasodilator (such as Nicardipine or Nitroprusside) prior to beta-blockade causes peripheral vascular resistance to drop. The baroreceptor reflex immediately fires sympathetic impulses, causing reflex tachycardia and hypercontractility, boosting dP/dt to &gt; 2,000 mmHg/s.
                </p>
                <p className="font-bold text-rose-300">
                  Golden Rule: Slow the heart first (HR &lt; 60 bpm), THEN bring down the pressure (SBP 100-120 mmHg).
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-2">
                <span className="font-bold text-slate-200">Active Physiologic Mechanisms:</span>
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

        {/* Tab 2: Classification & Anatomy */}
        {activeTab === 'anatomy' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Classification & Diameter */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-rose-400" /> Anatomical Classification & Aortic Caliber
              </h2>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Stanford Classification
                </label>
                <select
                  value={params.stanfordClass}
                  onChange={e => setParams({ ...params, stanfordClass: e.target.value as StanfordClassification })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="STANFORD_TYPE_A">Stanford Type A (Involves Ascending Aorta &mdash; Emergent Surgery)</option>
                  <option value="STANFORD_TYPE_B_UNCOMPLICATED">Stanford Type B Uncomplicated (Descending Aorta &mdash; Medical)</option>
                  <option value="STANFORD_TYPE_B_COMPLICATED">Stanford Type B Complicated (Malperfusion / Refractory &mdash; TEVAR)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Acute Aortic Syndrome (AAS) Subtype
                </label>
                <select
                  value={params.aasSubtype}
                  onChange={e => setParams({ ...params, aasSubtype: e.target.value as AasPathologySubtype })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="CLASSIC_AORTIC_DISSECTION">Classic Aortic Dissection (Intimal flap with dual-lumen flow)</option>
                  <option value="INTRAMURAL_HEMATOMA_IMH">Intramural Hematoma (IMH &mdash; Non-flow aortic wall hemorrhage)</option>
                  <option value="PENETRATING_AORTIC_ULCER_PAU">Penetrating Aortic Ulcer (PAU &mdash; Ulcer eroding through elastic lamina)</option>
                </select>
              </div>

              {/* Maximum Aortic Diameter */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Maximum Aortic Diameter</span>
                  <span className={`font-bold ${params.maximumAorticDiameterMm >= 55 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {params.maximumAorticDiameterMm} mm
                  </span>
                </div>
                <input aria-label="Maximum Aortic Diameter"
                  type="range"
                  min="35"
                  max="80"
                  value={params.maximumAorticDiameterMm}
                  onChange={e => setParams({ ...params, maximumAorticDiameterMm: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg"
                />
                <span className="text-[11px] text-slate-400">Cutoff: &ge; 55 mm is a high-risk indicator for spontaneous rupture</span>
              </div>

              {/* False Lumen Patency */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">False Lumen Status</label>
                <select
                  value={params.falseLumenPatency}
                  onChange={e => setParams({ ...params, falseLumenPatency: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="PATENT">Patent False Lumen (Continuous flow &amp; pressurization)</option>
                  <option value="PARTIALLY_THROMBOSED">Partially Thrombosed (Highest long-term mortality risk)</option>
                  <option value="COMPLETELY_THROMBOSED">Completely Thrombosed (Best prognosis)</option>
                </select>
              </div>
            </div>

            {/* Right: Valvular & Pericardial Extension */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400" /> Valvular &amp; Pericardial Extension
              </h2>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Retrograde Aortic Regurgitation (AR)
                </label>
                <select
                  value={params.retrogradeAorticRegurgitation}
                  onChange={e => setParams({ ...params, retrogradeAorticRegurgitation: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="NONE">None</option>
                  <option value="MILD">Mild Aortic Regurgitation</option>
                  <option value="SEVERE">Severe Aortic Regurgitation (Cardiogenic shock / wide pulse pressure)</option>
                </select>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg space-y-3">
                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.hemopericardiumTamponadePresent}
                    onChange={e => setParams({ ...params, hemopericardiumTamponadePresent: e.target.checked })}
                    className="accent-rose-500 mt-0.5 rounded"
                  />
                  <div>
                    <span className="font-semibold text-rose-300">Hemopericardium &amp; Cardiac Tamponade</span>
                    <p className="text-[11px] text-slate-400">
                      Retrograde dissection extending through aortic root into pericardium. Causes Beck&apos;s triad and PEA arrest.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Branch Malperfusion Syndromes */}
        {activeTab === 'malperfusion' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Malperfusion Checklist */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" /> End-Organ Malperfusion Syndromes (30% Incidence)
              </h2>

              <div className="space-y-3">
                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.coronaryMalperfusionRcaStemi}
                    onChange={e => setParams({ ...params, coronaryMalperfusionRcaStemi: e.target.checked })}
                    className="accent-rose-500 mt-0.5 rounded"
                  />
                  <div>
                    <span className="font-semibold text-rose-300">Coronary Malperfusion (Inferior STEMI Mimic)</span>
                    <p className="text-[11px] text-slate-400">
                      RCA ostial shearing by intimal flap. Giving lytics or heparin for STEMI causes fatal hemopericardium!
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.cerebralMalperfusionStroke}
                    onChange={e => setParams({ ...params, cerebralMalperfusionStroke: e.target.checked })}
                    className="accent-rose-500 mt-0.5 rounded"
                  />
                  <div>
                    <span className="font-semibold text-rose-300">Cerebral Malperfusion (Stroke / Syncope)</span>
                    <p className="text-[11px] text-slate-400">
                      Innominate or common carotid artery dissection. Syncope is a hallmark of Type A extension.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.mesentericMalperfusionIschemia}
                    onChange={e => setParams({ ...params, mesentericMalperfusionIschemia: e.target.checked })}
                    className="accent-rose-500 mt-0.5 rounded"
                  />
                  <div>
                    <span className="font-semibold text-rose-300">Mesenteric Malperfusion (Gut Necrosis)</span>
                    <p className="text-[11px] text-slate-400">
                      Celiac or SMA compromise. Abdominal pain out of proportion and rising lactate (&gt; 70% mortality).
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.renalMalperfusionAki}
                    onChange={e => setParams({ ...params, renalMalperfusionAki: e.target.checked })}
                    className="accent-rose-500 mt-0.5 rounded"
                  />
                  <div>
                    <span className="font-semibold text-rose-300">Renal Malperfusion (Goldblatt AKI)</span>
                    <p className="text-[11px] text-slate-400">
                      Renal artery dynamic or static obstruction triggering massive renin release and refractory hypertension.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.spinalCordMalperfusionParaplegia}
                    onChange={e => setParams({ ...params, spinalCordMalperfusionParaplegia: e.target.checked })}
                    className="accent-rose-500 mt-0.5 rounded"
                  />
                  <div>
                    <span className="font-semibold text-rose-300">Spinal Cord Malperfusion (Adamkiewicz Paraplegia)</span>
                    <p className="text-[11px] text-slate-400">
                      Intercostal/lumbar artery shearing resulting in anterior spinal cord syndrome (flaccid paraplegia).
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.lowerExtremityLimbPulseDeficit}
                    onChange={e => setParams({ ...params, lowerExtremityLimbPulseDeficit: e.target.checked })}
                    className="accent-rose-500 mt-0.5 rounded"
                  />
                  <div>
                    <span className="font-semibold text-rose-300">Lower Extremity Pulse Deficit (Acute Limb Ischemia)</span>
                    <p className="text-[11px] text-slate-400">
                      Iliac artery true lumen compression causing cold, pale, paresthetic, pulseless lower extremity.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Right: Dynamic vs Static Obstruction */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-sky-400" /> Dynamic vs. Static Obstruction
              </h2>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg text-xs leading-relaxed space-y-3">
                <div>
                  <span className="font-bold text-sky-300 block mb-1">Dynamic Obstruction:</span>
                  <p className="text-slate-300">
                    The intimal flap remains mobile and prolapses across the branch vessel orifice during systole like a flutter valve. Resolves when the true lumen is depressurized and re-expanded via central repair or TEVAR.
                  </p>
                </div>
                <div>
                  <span className="font-bold text-amber-300 block mb-1">Static Obstruction:</span>
                  <p className="text-slate-300">
                    The dissection tear physically extends into the branch vessel itself, or thrombus in the false lumen obliterates the branch lumen. Requires dedicated branch vessel stenting or surgical bypass.
                  </p>
                </div>
              </div>

              {/* Serum Lactate Slider */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Serum Lactate (Mesenteric / Organ Ischemia)</span>
                  <span className={`font-bold ${params.serumLactateMmolL >= 3.0 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {params.serumLactateMmolL.toFixed(1)} mmol/L
                  </span>
                </div>
                <input aria-label="Serum Lactate (Mesenteric / Organ Ischemia)"
                  type="range"
                  min="0.5"
                  max="10.0"
                  step="0.1"
                  value={params.serumLactateMmolL}
                  onChange={e => setParams({ ...params, serumLactateMmolL: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Surgical Repair & TEVAR */}
        {activeTab === 'surgery' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Surgical Strategy */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Scissors className="w-5 h-5 text-rose-400" /> Surgical &amp; Endovascular Interventions
              </h2>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Select Intervention
                </label>
                <select
                  value={params.surgicalIntervention}
                  onChange={e => setParams({ ...params, surgicalIntervention: e.target.value as SurgicalInterventionChoice })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="MEDICAL_MANAGEMENT_ONLY">Medical Anti-Impulse Management Only</option>
                  <option value="EMERGENT_OPEN_ARCH_REPAIR">Emergent Open Arch Repair (Median sternotomy, CPB, Hemiarch / FET)</option>
                  <option value="TEVAR_ENDOVASCULAR_STENT">TEVAR (Thoracic Endovascular Aortic Repair &mdash; Stent Graft)</option>
                  <option value="PERICARDIOCENTESIS_COMPLETE_HAZARD">Complete Pericardiocentesis (LETHAL HAZARD: Blowout rupture!)</option>
                  <option value="CONTROLLED_MICRO_PERICARDIOCENTESIS">Controlled Micro-Pericardiocentesis (10-20 mL rescue in arrest only)</option>
                </select>
              </div>

              {/* Pericardiocentesis Dilemma Card */}
              <div className="p-4 bg-rose-950/30 border border-rose-600/30 rounded-lg text-xs leading-relaxed space-y-2 text-rose-200">
                <span className="font-bold text-rose-300 block">The Pericardiocentesis Dilemma in Type A Dissection:</span>
                <p>
                  Routine pericardiocentesis is <strong>strictly contraindicated</strong> in acute Type A dissection with hemopericardium. Evacuating pericardial blood suddenly relieves intrapericardial counter-pressure, unleashing a massive rebound surge in systemic blood pressure and transaortic gradient. This blows out the false lumen tear into instant fatal exsanguination.
                </p>
                <p>
                  <strong>Only Exception:</strong> In refractory PEA arrest, aspirate a tiny volume (10-20 mL) just enough to restore cardiac output while rushing directly to the operating room.
                </p>
              </div>
            </div>

            {/* Right: Step-by-Step Action Plan */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Step-by-Step Emergency Action Plan
              </h2>

              <div className="space-y-2.5">
                {result.stepByStepActionPlan.map((step, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
