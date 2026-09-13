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
  Droplets,
  Stethoscope,
  Pill,
  Filter,
  Dna
} from 'lucide-react';
import {
  PheoPatientParams,
  simulatePheochromocytoma,
  PHEOCYTOMA_PRESETS,
  AlphaBlockerChoice,
  BetaBlockerAdjunct,
  IntraoperativePhase,
  EmergencyVasodilator
} from '../../.gemini/skills/PheochromocytomaEngine';

export default function PheochromocytomaSimulator() {
  const [params, setParams] = useState<PheoPatientParams>(PHEOCYTOMA_PRESETS.roizenOptimizedPreop);
  const [activeTab, setActiveTab] = useState<'blockade' | 'biochemical' | 'intraop' | 'pearls'>('blockade');

  const result = useMemo(() => simulatePheochromocytoma(params), [params]);

  const loadPreset = (key: keyof typeof PHEOCYTOMA_PRESETS) => {
    setParams({ ...PHEOCYTOMA_PRESETS[key] });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                <Zap className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Pheochromocytoma & Paraganglioma (PPGL) Workstation
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  The Alpha-Blocker First Rule, Roizen Criteria, Intraop Storm vs Post-Ligation Collapse & Genetic Syndromes
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-amber-950/60 border border-amber-600/40 text-amber-300 rounded-full">
              Track B43 • Route #244
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-purple-950/60 border border-purple-600/40 text-purple-300 rounded-full">
              Endocrinology & Anesthesiology
            </span>
          </div>
        </div>

        {/* Presets */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 mr-2 flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-slate-400" /> Presets:
          </span>
          <button
            onClick={() => loadPreset('roizenOptimizedPreop')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-emerald-500 hover:bg-emerald-950/20 text-emerald-300 rounded-lg transition"
          >
            Roizen Optimized Preop
          </button>
          <button
            onClick={() => loadPreset('unopposedAlphaDisaster')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-red-500 hover:bg-red-950/30 text-red-400 rounded-lg transition"
          >
            The Unopposed Alpha Disaster (Trap)
          </button>
          <button
            onClick={() => loadPreset('intraoperativeStorm')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-amber-500 hover:bg-amber-950/20 text-amber-300 rounded-lg transition"
          >
            Intraoperative Storm (Tumor Handling)
          </button>
          <button
            onClick={() => loadPreset('postLigationCollapse')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-purple-500 hover:bg-purple-950/20 text-purple-300 rounded-lg transition"
          >
            Post-Ligation Collapse (Vasodilatory Shock)
          </button>
          <button
            onClick={() => loadPreset('sdhbMalignantParaganglioma')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-sky-500 hover:bg-sky-950/20 text-sky-300 rounded-lg transition"
          >
            SDHB Malignant Paraganglioma
          </button>
        </div>
      </div>

      {/* Hero 4-Panel Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Panel 1: Roizen Criteria & Status */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>ROIZEN PREOP CRITERIA</span>
              <Filter className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white tracking-wide">
              {result.roizenCriteriaMet ? 'ROIZEN CRITERIA MET' : 'CRITERIA UNMET'}
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
            <span className="text-slate-400">Alpha Blockade:</span>
            <span className="text-amber-300 font-medium">{params.daysOfAlphaBlockade} days ({params.alphaBlocker.replace(/_/g, ' ')})</span>
          </div>
        </div>

        {/* Panel 2: Vascular Tone & SVR */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>SYSTEMIC VASCULAR RESISTANCE</span>
              <Activity className="w-4 h-4 text-rose-400" />
            </div>
            <div className="flex items-baseline gap-3">
              <div>
                <span className="text-xs text-slate-400 block">SVR</span>
                <span className={`text-2xl font-bold ${
                  result.systemicVascularResistanceDyns > 1600 ? 'text-rose-400' :
                  result.systemicVascularResistanceDyns < 700 ? 'text-purple-400' : 'text-emerald-400'
                }`}>
                  {result.systemicVascularResistanceDyns} <span className="text-xs font-normal text-slate-400">dynes</span>
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                result.hasUnopposedAlphaDisaster
                  ? 'bg-rose-950/60 border border-rose-600/40 text-rose-300'
                  : 'bg-emerald-950/60 border border-emerald-600/40 text-emerald-300'
              }`}>
                {result.hasUnopposedAlphaDisaster ? 'Unopposed Alpha Crisis' : 'Alpha Tone Protected'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Pulse Pressure:</span>
            <span className="font-bold text-white">{result.pulsePressureMmHg} mmHg</span>
          </div>
        </div>

        {/* Panel 3: Hemodynamics & Phase */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>HEMODYNAMICS & PHASE</span>
              <Gauge className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Heart Rate</span>
                <span className={`text-2xl font-bold ${params.heartRateBpm > 100 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {params.heartRateBpm} <span className="text-xs font-normal text-slate-400">bpm</span>
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Blood Pressure</span>
                <span className={`text-2xl font-bold ${params.sbpMmHg >= 180 ? 'text-rose-400' : params.sbpMmHg < 90 ? 'text-purple-400' : 'text-emerald-400'}`}>
                  {params.sbpMmHg}/{params.dbpMmHg}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Current Phase:</span>
            <span className="font-bold text-white">{params.intraopPhase.replace(/_/g, ' ')}</span>
          </div>
        </div>

        {/* Panel 4: Complications & Safety */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>COMPLICATIONS & SAFETY</span>
              <TrendingDown className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Complication Risk</span>
                <span className={`text-2xl font-bold ${result.predictedInHospitalComplicationRatePercent >= 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {result.predictedInHospitalComplicationRatePercent}%
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">MAP</span>
                <span className={`text-2xl font-bold ${result.meanArterialPressureMmHg < 65 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {result.meanArterialPressureMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
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
            onClick={() => setActiveTab('blockade')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'blockade'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Preoperative Alpha &amp; Beta Blockade
          </button>
          <button
            onClick={() => setActiveTab('biochemical')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'biochemical'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Biochemical Profile &amp; Genetics
          </button>
          <button
            onClick={() => setActiveTab('intraop')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'intraop'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Intraoperative Biphasic Hemodynamics
          </button>
          <button
            onClick={() => setActiveTab('pearls')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'pearls'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Clinical Pearls &amp; Roizen Guidelines
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="max-w-7xl mx-auto">
        {/* Tab 1: Preoperative Alpha & Beta Blockade */}
        {activeTab === 'blockade' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Pharmacotherapy Controls */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-amber-400" /> Sequential Adrenergic Blockade
              </h2>

              {/* Alpha-Blocker Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  1st-Line: Alpha-Adrenergic Blockade (MANDATORY FIRST)
                </label>
                <select
                  value={params.alphaBlocker}
                  onChange={e => setParams({ ...params, alphaBlocker: e.target.value as AlphaBlockerChoice })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="NONE">None (Untreated)</option>
                  <option value="PHENOXYBENZAMINE">Phenoxybenzamine (Non-selective irreversible alpha-1/alpha-2 blocker)</option>
                  <option value="DOXAZOSIN">Doxazosin (Selective competitive alpha-1 blocker)</option>
                  <option value="BETA_BLOCKER_ALONE_HAZARD">Beta-Blocker Alone Hazard (LETHAL: Unopposed Alpha Crisis!)</option>
                </select>
              </div>

              {/* Days of Alpha-Blockade */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Duration of Preoperative Alpha-Blockade</span>
                  <span className={`font-bold ${params.daysOfAlphaBlockade >= 10 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {params.daysOfAlphaBlockade} days
                  </span>
                </div>
                <input aria-label="Duration of Preoperative Alpha-Blockade"
                  type="range"
                  min="0"
                  max="30"
                  value={params.daysOfAlphaBlockade}
                  onChange={e => setParams({ ...params, daysOfAlphaBlockade: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg"
                />
                <span className="text-[11px] text-slate-400">Target: &ge; 10-14 days prior to elective surgery</span>
              </div>

              {/* Beta-Blocker Adjunct */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  2nd-Line: Beta-Blocker Adjunct (ONLY AFTER Alpha-Blockade Established)
                </label>
                <select
                  value={params.betaBlocker}
                  onChange={e => setParams({ ...params, betaBlocker: e.target.value as BetaBlockerAdjunct })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="NONE">None</option>
                  <option value="METOPROLOL_ORAL">Metoprolol Oral (Cardioselective beta-1 blocker)</option>
                  <option value="PROPRANOLOL_ORAL">Propranolol Oral (Non-selective beta-blocker)</option>
                  <option value="ESMOLOL_IV_INFUSION">Esmolol IV Infusion (Ultra-short acting for intraop tachyarrhythmias)</option>
                </select>
              </div>

              {/* Unopposed Alpha Disaster Toggle */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.betaBlockerStartedBeforeAlpha}
                    onChange={e => setParams({ ...params, betaBlockerStartedBeforeAlpha: e.target.checked })}
                    className="accent-rose-500 mt-0.5 rounded"
                  />
                  <div>
                    <span className="font-semibold text-rose-300">Beta-Blocker started BEFORE Alpha-Blocker</span>
                    <p className="text-[11px] text-slate-400">
                      LETHAL PRACTICE PITFALL: Beta-blockade abolishes beta-2 vasodilatory tone while circulating catecholamines stimulate uninhibited alpha-1 receptors, causing extreme malignant hypertension!
                    </p>
                  </div>
                </label>
              </div>

              {/* Volume Expansion */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.highSaltDietAndHydrationGiven}
                    onChange={e => setParams({ ...params, highSaltDietAndHydrationGiven: e.target.checked })}
                    className="accent-emerald-500 mt-0.5 rounded"
                  />
                  <div>
                    <span className="font-semibold text-emerald-300">High-Salt Diet &amp; Preoperative Hydration</span>
                    <p className="text-[11px] text-slate-400">
                      High sodium (&gt; 5g/day) and liberal IV fluids in final 48-72h expand chronically contracted plasma volume.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Right: Blood Pressure & Roizen Criteria */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Gauge className="w-5 h-5 text-sky-400" /> Hemodynamic Targets (Roizen Criteria)
              </h2>

              {/* SBP & DBP */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Supine Systolic Blood Pressure (Target &lt; 130 mmHg)</span>
                  <span className={`font-bold ${params.sbpMmHg < 130 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {params.sbpMmHg} mmHg
                  </span>
                </div>
                <input aria-label="Supine Systolic Blood Pressure (Target &lt; 130 mmHg)"
                  type="range"
                  min="70"
                  max="300"
                  value={params.sbpMmHg}
                  onChange={e => setParams({ ...params, sbpMmHg: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Supine Diastolic Blood Pressure (Target &lt; 80 mmHg)</span>
                  <span className={`font-bold ${params.dbpMmHg < 80 ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {params.dbpMmHg} mmHg
                  </span>
                </div>
                <input aria-label="Supine Diastolic Blood Pressure (Target &lt; 80 mmHg)"
                  type="range"
                  min="40"
                  max="160"
                  value={params.dbpMmHg}
                  onChange={e => setParams({ ...params, dbpMmHg: Number(e.target.value) })}
                  className="w-full accent-slate-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Standing SBP Drop */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Standing Orthostatic SBP Drop (Target 10-20 mmHg drop, but SBP &gt; 90)</span>
                  <span className={`font-bold ${params.standingSbpDropMmHg >= 10 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {params.standingSbpDropMmHg} mmHg
                  </span>
                </div>
                <input aria-label="Standing Sbp Drop Mm Hg"
                  type="range"
                  min="0"
                  max="40"
                  value={params.standingSbpDropMmHg}
                  onChange={e => setParams({ ...params, standingSbpDropMmHg: Number(e.target.value) })}
                  className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Heart Rate */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Heart Rate</span>
                  <span className="font-bold text-slate-300">{params.heartRateBpm} bpm</span>
                </div>
                <input aria-label="Heart Rate"
                  type="range"
                  min="50"
                  max="180"
                  value={params.heartRateBpm}
                  onChange={e => setParams({ ...params, heartRateBpm: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Biochemical Profile & Genetics */}
        {activeTab === 'biochemical' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Metanephrines */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" /> Fractionated Metanephrines Profile
              </h2>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Plasma Free Normetanephrine (ULN &lt; 148 pg/mL)</span>
                  <span className={`font-bold ${params.plasmaFreeNormetanephrinePgMl > 400 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {params.plasmaFreeNormetanephrinePgMl} pg/mL
                  </span>
                </div>
                <input aria-label="Plasma Free Normetanephrine (ULN &lt; 148 pg/mL)"
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={params.plasmaFreeNormetanephrinePgMl}
                  onChange={e => setParams({ ...params, plasmaFreeNormetanephrinePgMl: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg"
                />
                <span className="text-[11px] text-slate-400">Norepinephrine metabolite: predominant in paragangliomas &amp; extra-adrenal tumors</span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Plasma Free Metanephrine (ULN &lt; 57 pg/mL)</span>
                  <span className={`font-bold ${params.plasmaFreeMetanephrinePgMl > 150 ? 'text-amber-400' : 'text-slate-300'}`}>
                    {params.plasmaFreeMetanephrinePgMl} pg/mL
                  </span>
                </div>
                <input aria-label="Plasma Free Metanephrine (ULN &lt; 57 pg/mL)"
                  type="range"
                  min="20"
                  max="3000"
                  step="20"
                  value={params.plasmaFreeMetanephrinePgMl}
                  onChange={e => setParams({ ...params, plasmaFreeMetanephrinePgMl: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg"
                />
                <span className="text-[11px] text-slate-400">Epinephrine metabolite: indicates adrenal medullary chromaffin origin (PNMT expression)</span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Tumor Diameter</span>
                  <span className="font-bold text-slate-300">{params.tumorDiameterCm.toFixed(1)} cm</span>
                </div>
                <input aria-label="Tumor Diameter"
                  type="range"
                  min="1.0"
                  max="15.0"
                  step="0.5"
                  value={params.tumorDiameterCm}
                  onChange={e => setParams({ ...params, tumorDiameterCm: Number(e.target.value) })}
                  className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg"
                />
                <span className="text-[11px] text-slate-400">Tumors &ge; 5.0-6.0 cm carry higher risk of malignancy and intraoperative storm</span>
              </div>
            </div>

            {/* Right: Genetic Syndromes */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Dna className="w-5 h-5 text-purple-400" /> Genetic Syndromes (40% Germline Mutated)
              </h2>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Hereditary Germline Mutation</label>
                <select
                  value={params.geneticSyndrome}
                  onChange={e => setParams({ ...params, geneticSyndrome: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="SPORADIC">Sporadic (No known familial mutation)</option>
                  <option value="MEN_2A">MEN 2A (RET proto-oncogene: Medullary Thyroid Ca, Pheo, Hyperparathyroidism)</option>
                  <option value="MEN_2B">MEN 2B (RET proto-oncogene: MTC, Pheo, Mucosal neuromas, Marfanoid)</option>
                  <option value="VHL">von Hippel-Lindau (VHL gene: Hemangioblastomas, clear cell RCC, Pheo)</option>
                  <option value="NF1">Neurofibromatosis type 1 (NF1: Cafe-au-lait, neurofibromas, Pheo)</option>
                  <option value="SDHB_SDHD">Succinate Dehydrogenase (SDHB/SDHD: Paraganglioma; SDHB high malignancy &gt;40%)</option>
                </select>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg text-xs leading-relaxed space-y-2 text-slate-300">
                <span className="font-bold text-purple-300 block">Endocrine Society Guidelines:</span>
                <p>
                  All patients diagnosed with pheochromocytoma or paraganglioma must be offered genetic counseling and testing regardless of age or family history. Over 40% of cases represent inherited syndromes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Intraoperative Biphasic Hemodynamics */}
        {activeTab === 'intraop' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Phase & Vasodilators */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-400" /> Intraoperative Biphasic Crisis
              </h2>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Current Surgical Phase</label>
                <select
                  value={params.intraopPhase}
                  onChange={e => setParams({ ...params, intraopPhase: e.target.value as IntraoperativePhase })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="PRE_INDUCTION_BASELINE">Pre-Induction Baseline (Optimized prep)</option>
                  <option value="TUMOR_MANIPULATION_STORM">Phase 1: Tumor Manipulation Storm (Surge in SBP &amp; SVR)</option>
                  <option value="POST_VEIN_LIGATION_COLLAPSE">Phase 2: Post-Vein Ligation Collapse (Vasodilatory Shock)</option>
                </select>
              </div>

              {/* Emergency Vasodilator */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Emergency Vasodilator (For Phase 1 Storm)
                </label>
                <select
                  value={params.emergencyVasodilator}
                  onChange={e => setParams({ ...params, emergencyVasodilator: e.target.value as EmergencyVasodilator })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="NONE">None</option>
                  <option value="PHENTOLAMINE_IV_BOLUS">Phentolamine IV Bolus (2.5 - 5 mg rapid competitive alpha blockade)</option>
                  <option value="NICARDIPINE_IV_INFUSION">Nicardipine IV Infusion (Titrated CCB)</option>
                  <option value="NITROPRUSSIDE_IV">Sodium Nitroprusside (Direct NO donor)</option>
                </select>
              </div>

              {/* Fluid Bolus Administered */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>IV Fluid Resuscitation Boluses (For Phase 2 Collapse)</span>
                  <span className="font-bold text-sky-400">{params.ivFluidBolusAdministeredMl} mL</span>
                </div>
                <input aria-label="IV Fluid Resuscitation Boluses (For Phase 2 Collapse)"
                  type="range"
                  min="0"
                  max="4000"
                  step="250"
                  value={params.ivFluidBolusAdministeredMl}
                  onChange={e => setParams({ ...params, ivFluidBolusAdministeredMl: Number(e.target.value) })}
                  className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg"
                />
                <span className="text-[11px] text-slate-400">Aggressive crystalloid / 5% albumin required to fill vasoplegic capacitance bed</span>
              </div>

              {/* Norepinephrine Infusion */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.norepinephrineInfusionActive}
                    onChange={e => setParams({ ...params, norepinephrineInfusionActive: e.target.checked })}
                    className="accent-purple-500 rounded"
                  />
                  <span>Norepinephrine / Vasopressin Infusion Active (Post-ligation tone rescue)</span>
                </label>
              </div>
            </div>

            {/* Right: Pathophysiologic Mechanisms */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-400" /> Biphasic Hemodynamic Mechanics
              </h2>

              <div className="p-4 bg-amber-950/30 border border-amber-600/40 rounded-lg text-xs leading-relaxed space-y-2 text-amber-200">
                <span className="font-bold text-amber-300 block">The Intraoperative Dilemma:</span>
                <p>
                  <strong>Phase 1 (Manipulation):</strong> Compressing the tumor abruptly spills stored catecholamines, generating blood pressures in excess of $220220-250 mmHg. Controlled with rapid IV Phentolamine or Nicardipine.
                </p>
                <p>
                  <strong>Phase 2 (Vein Ligation):</strong> Once the adrenal vein is ligated, circulating catecholamine levels plummet precipitously. Because adrenergic receptors are chronically down-regulated and intravascular volume is contracted, vascular tone evaporates, causing sudden, life-threatening hypotensive shock.
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

        {/* Tab 4: Clinical Pearls & Roizen Guidelines */}
        {activeTab === 'pearls' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Step-by-Step Action Plan */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Step-by-Step Management Protocol
              </h2>

              <div className="space-y-2.5">
                {result.stepByStepActionPlan.map((step, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: High-Stakes Pearls */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" /> High-Stakes Clinical Pearls
              </h2>

              <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                <div className="p-3 bg-rose-950/30 border border-rose-600/30 rounded-lg">
                  <span className="font-bold text-rose-300 block mb-1">
                    The &ldquo;A before B&rdquo; Rule
                  </span>
                  <p>
                    Never administer a beta-blocker without established alpha-blockade. Blocking vasodilatory &beta;₂ receptors leaves &alpha;₁ vasoconstriction entirely unopposed, triggering lethal hypertensive crisis and intracranial hemorrhage. Remember: &ldquo;A comes before B in the alphabet and in pheo!&rdquo;
                  </p>
                </div>

                <div className="p-3 bg-amber-950/30 border border-amber-600/30 rounded-lg">
                  <span className="font-bold text-amber-300 block mb-1">
                    The Roizen Preoperative Criteria
                  </span>
                  <p>
                    Introduced by Roizen in 1982: Blood pressure &lt; 130/80 mmHg supine, orthostasis present (standing SBP drop &gt; 10 mmHg but standing SBP &gt; 90 mmHg), no ST-T wave changes for 2 weeks, and fewer than 1 PVC every 5 minutes.
                  </p>
                </div>

                <div className="p-3 bg-purple-950/30 border border-purple-600/30 rounded-lg">
                  <span className="font-bold text-purple-300 block mb-1">
                    Postoperative Hypoglycemia Risk
                  </span>
                  <p>
                    Following tumor resection, high circulating catecholamine suppression of insulin secretion abruptly ends. Large surges in endogenous insulin combined with depleted glycogen stores can trigger profound, refractory hypoglycemia in the PACU. Monitor fingerstick glucose closely every 1-2 hours.
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
