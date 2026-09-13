'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Heart,
  AlertTriangle,
  ShieldAlert,
  Droplets,
  Stethoscope,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingDown,
  Gauge,
  Zap,
  RotateCcw
} from 'lucide-react';
import {
  MassivePePatientParams,
  simulateMassivePulmonaryEmbolism,
  MASSIVE_PE_PRESETS,
  VasopressorChoice,
  InotropeChoice,
  InhaledVasodilatorChoice,
  ReperfusionStrategy
} from '../../.gemini/skills/MassivePulmonaryEmbolismEngine';

export default function MassivePulmonaryEmbolismSimulator() {
  const [params, setParams] = useState<MassivePePatientParams>(MASSIVE_PE_PRESETS.massiveShock);
  const [activeTab, setActiveTab] = useState<'hemodynamics' | 'fluids' | 'reperfusion' | 'pearls'>('hemodynamics');

  const result = useMemo(() => simulateMassivePulmonaryEmbolism(params), [params]);

  const loadPreset = (key: keyof typeof MASSIVE_PE_PRESETS) => {
    setParams({ ...MASSIVE_PE_PRESETS[key] });
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
                  Massive Pulmonary Embolism & RV Resuscitation Workstation
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  ESC / AHA High-Risk PE Guidelines, RV Death Spiral Biomechanics, Echo Markers, Fluid Guardrails & Reperfusion
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-rose-950/60 border border-rose-600/40 text-rose-300 rounded-full">
              Track B40 • Route #241
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-sky-950/60 border border-sky-600/40 text-sky-300 rounded-full">
              Critical Care & Cardiology
            </span>
          </div>
        </div>

        {/* Clinical Presets */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 mr-2 flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-slate-400" /> Presets:
          </span>
          <button
            onClick={() => loadPreset('massiveShock')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-rose-500 hover:bg-rose-950/20 text-slate-200 rounded-lg transition"
          >
            Massive Shock (High-Risk)
          </button>
          <button
            onClick={() => loadPreset('fluidOverloadDisaster')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-amber-500 hover:bg-amber-950/20 text-amber-300 rounded-lg transition"
          >
            Fluid Overload Disaster (Trap)
          </button>
          <button
            onClick={() => loadPreset('submassiveIntermediateHigh')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-sky-500 hover:bg-sky-950/20 text-sky-300 rounded-lg transition"
          >
            Submassive (Intermediate-High)
          </button>
          <button
            onClick={() => loadPreset('postOpHighBleedRisk')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-purple-500 hover:bg-purple-950/20 text-purple-300 rounded-lg transition"
          >
            Post-Op High Bleed Risk (CDT/Inari)
          </button>
          <button
            onClick={() => loadPreset('cardiacArrestPeaCrash')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-red-500 hover:bg-red-950/30 text-red-400 rounded-lg transition"
          >
            PEA Arrest Crash (50 mg Push)
          </button>
        </div>
      </div>

      {/* Hero 4-Panel Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Panel 1: ESC Risk Category */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>ESC / AHA RISK CATEGORY</span>
              <Activity className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl font-bold text-white tracking-wide">
              {result.riskCategory.replace(/_/g, ' ')}
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
            <span className="text-slate-400">Spiral Stage:</span>
            <span className="text-rose-300 font-medium">{result.rvDeathSpiralStage.replace(/_/g, ' ')}</span>
          </div>
        </div>

        {/* Panel 2: RV Biomechanical Strain */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>RV STRAIN BIOMECHANICS</span>
              <Heart className="w-4 h-4 text-sky-400" />
            </div>
            <div className="flex items-baseline gap-3">
              <div>
                <span className="text-xs text-slate-400 block">RV/LV Ratio</span>
                <span className={`text-2xl font-bold ${params.rvLvDiameterRatio >= 1.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {params.rvLvDiameterRatio.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">TAPSE</span>
                <span className={`text-2xl font-bold ${params.tapseMm < 16 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {params.tapseMm} <span className="text-xs font-normal text-slate-400">mm</span>
                </span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1 text-[11px]">
              {params.mcConnellSignPresent && (
                <span className="px-2 py-0.5 bg-rose-950/60 border border-rose-600/40 text-rose-300 rounded">
                  McConnell (+)
                </span>
              )}
              {params.sixtySixtySignPresent && (
                <span className="px-2 py-0.5 bg-amber-950/60 border border-amber-600/40 text-amber-300 rounded">
                  60/60 Sign (+)
                </span>
              )}
              {params.interventricularSeptalFlattening && (
                <span className="px-2 py-0.5 bg-purple-950/60 border border-purple-600/40 text-purple-300 rounded">
                  D-Shaped LV
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">RV Wall Stress Index:</span>
            <span className="font-bold text-white">{result.rvWallStressIndex}/100</span>
          </div>
        </div>

        {/* Panel 3: Hemodynamics & RCA Perfusion */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>HEMODYNAMICS & RCA PERFUSION</span>
              <Gauge className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">MAP</span>
                <span className={`text-2xl font-bold ${result.meanArterialPressureMmHg < 65 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {result.meanArterialPressureMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Shock Index</span>
                <span className={`text-2xl font-bold ${result.shockIndex >= 1.0 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {result.shockIndex}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">RCA Gradient</span>
                <span className={`text-2xl font-bold ${result.rightCoronaryPerfusionPressureMmHg < 30 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {result.rightCoronaryPerfusionPressureMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Effective Cardiac Index:</span>
            <span className={`font-bold ${result.effectiveCardiacIndexLpmPerM2 < 2.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {result.effectiveCardiacIndexLpmPerM2} L/min/m²
            </span>
          </div>
        </div>

        {/* Panel 4: Mortality & Bleeding Risk */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>PROGNOSIS & SAFETY</span>
              <TrendingDown className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">30-Day Mortality</span>
                <span className={`text-2xl font-bold ${result.estimated30DayMortalityPercent >= 25 ? 'text-rose-400' : 'text-amber-400'}`}>
                  {result.estimated30DayMortalityPercent}%
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Major Bleeding</span>
                <span className={`text-2xl font-bold ${result.majorBleedingRiskPercent >= 15 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {result.majorBleedingRiskPercent}%
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
            onClick={() => setActiveTab('hemodynamics')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'hemodynamics'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Hemodynamics & Echo Strain
          </button>
          <button
            onClick={() => setActiveTab('fluids')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'fluids'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Fluid & Vasopressor Guardrails
          </button>
          <button
            onClick={() => setActiveTab('reperfusion')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'reperfusion'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Reperfusion & Lytics Decision
          </button>
          <button
            onClick={() => setActiveTab('pearls')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'pearls'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Clinical Pearls & Guidelines
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="max-w-7xl mx-auto">
        {/* Tab 1: Hemodynamics & Echo */}
        {activeTab === 'hemodynamics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Hemodynamic Controls */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-400" /> Vital Signs & Systemic Perfusion
              </h2>

              {/* SBP & DBP */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Systolic Blood Pressure (SBP)</span>
                  <span className="font-bold text-rose-400">{params.sbpMmHg} mmHg</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="160"
                  value={params.sbpMmHg}
                  onChange={e => setParams({ ...params, sbpMmHg: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg"
                />
                <span className="text-[11px] text-slate-400">
                  Cutoff: SBP &lt; 90 mmHg or Shock Index &gt; 1.0 defines ESC High-Risk / Massive PE
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Diastolic Blood Pressure (DBP)</span>
                  <span className="font-bold text-slate-300">{params.dbpMmHg} mmHg</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={params.dbpMmHg}
                  onChange={e => setParams({ ...params, dbpMmHg: Number(e.target.value) })}
                  className="w-full accent-slate-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Heart Rate */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Heart Rate (HR)</span>
                  <span className="font-bold text-slate-300">{params.heartRateBpm} bpm</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="180"
                  value={params.heartRateBpm}
                  onChange={e => setParams({ ...params, heartRateBpm: Number(e.target.value) })}
                  className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Arterial pH & Lactate */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Arterial pH</span>
                    <span className={`font-bold ${params.arterialPh < 7.25 ? 'text-rose-400' : 'text-slate-300'}`}>
                      {params.arterialPh.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6.90"
                    max="7.45"
                    step="0.01"
                    value={params.arterialPh}
                    onChange={e => setParams({ ...params, arterialPh: Number(e.target.value) })}
                    className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Serum Lactate</span>
                    <span className={`font-bold ${params.serumLactateMmolL >= 4.0 ? 'text-rose-400' : 'text-slate-300'}`}>
                      {params.serumLactateMmolL.toFixed(1)} mmol/L
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="10.0"
                    step="0.1"
                    value={params.serumLactateMmolL}
                    onChange={e => setParams({ ...params, serumLactateMmolL: Number(e.target.value) })}
                    className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>

              {/* Biomarkers */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">Biomarkers of Myocardial Injury & Stress</span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={params.cardiacTroponinElevated}
                      onChange={e => setParams({ ...params, cardiacTroponinElevated: e.target.checked })}
                      className="accent-rose-500 rounded"
                    />
                    Elevated Cardiac Troponin (hs-cTnI / hs-cTnT)
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={params.bnpElevated}
                      onChange={e => setParams({ ...params, bnpElevated: e.target.checked })}
                      className="accent-sky-500 rounded"
                    />
                    Elevated BNP / NT-proBNP
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Echocardiographic Markers */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-sky-400" /> Bedside Echocardiographic Markers (POCUS)
              </h2>

              {/* RV/LV Ratio */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>RV / LV Basal End-Diastolic Diameter Ratio</span>
                  <span className={`font-bold ${params.rvLvDiameterRatio >= 1.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {params.rvLvDiameterRatio.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.8"
                  step="0.05"
                  value={params.rvLvDiameterRatio}
                  onChange={e => setParams({ ...params, rvLvDiameterRatio: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg"
                />
                <span className="text-[11px] text-slate-400">
                  Normal &lt; 0.9. Ratio ≥ 1.0 indicates severe RV chamber enlargement and wall tension.
                </span>
              </div>

              {/* TAPSE */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Tricuspid Annular Plane Systolic Excursion (TAPSE)</span>
                  <span className={`font-bold ${params.tapseMm < 16 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {params.tapseMm} mm
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="26"
                  value={params.tapseMm}
                  onChange={e => setParams({ ...params, tapseMm: Number(e.target.value) })}
                  className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg"
                />
                <span className="text-[11px] text-slate-400">
                  Normal 17-25 mm. TAPSE &lt; 16 mm signifies severe RV longitudinal systolic failure.
                </span>
              </div>

              {/* Qualitative Echo Signs */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-slate-300 block">Pathognomonic Echo Signs</span>

                <div className="space-y-2">
                  <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={params.mcConnellSignPresent}
                      onChange={e => setParams({ ...params, mcConnellSignPresent: e.target.checked })}
                      className="accent-rose-500 mt-0.5 rounded"
                    />
                    <div>
                      <span className="font-semibold text-rose-300">McConnell&apos;s Sign</span>
                      <p className="text-[11px] text-slate-400">
                        Hyperdynamic / preserved apical contractility with severe akinesis of the mid-RV free wall (94% specificity for acute PE).
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={params.sixtySixtySignPresent}
                      onChange={e => setParams({ ...params, sixtySixtySignPresent: e.target.checked })}
                      className="accent-amber-500 mt-0.5 rounded"
                    />
                    <div>
                      <span className="font-semibold text-amber-300">60/60 Sign</span>
                      <p className="text-[11px] text-slate-400">
                        Pulmonary acceleration time &lt; 60 ms AND peak TR systolic gradient &lt; 60 mmHg (distinguishes acute PE from chronic PH).
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={params.interventricularSeptalFlattening}
                      onChange={e => setParams({ ...params, interventricularSeptalFlattening: e.target.checked })}
                      className="accent-purple-500 mt-0.5 rounded"
                    />
                    <div>
                      <span className="font-semibold text-purple-300">D-Shaped Left Ventricle (Septal Flattening)</span>
                      <p className="text-[11px] text-slate-400">
                        Paradoxical leftward septal shift in both systole and diastole due to RV cavitary pressure exceeding LV pressure.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Fluid & Vasopressor Guardrails */}
        {activeTab === 'fluids' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Volume & Vasopressors */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Droplets className="w-5 h-5 text-sky-400" /> Resuscitative Volume & Pressor Management
              </h2>

              {/* IV Fluid Volume */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg">
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span className="font-semibold">Cumulative IV Fluid Administered</span>
                  <span className={`font-bold ${
                    params.ivFluidAdministeredMl <= 500 ? 'text-emerald-400' :
                    params.ivFluidAdministeredMl <= 1000 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {params.ivFluidAdministeredMl} mL
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="50"
                  value={params.ivFluidAdministeredMl}
                  onChange={e => setParams({ ...params, ivFluidAdministeredMl: Number(e.target.value) })}
                  className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg"
                />
                <div className="mt-2 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>0 - 500 mL: Recommended restrictive threshold (preserves RV geometry)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-400">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>&gt; 500 - 1000+ mL: RV OVERLOAD TRAP &mdash; overstretches RV, shifts septum, collapses LV preload</span>
                  </div>
                </div>
              </div>

              {/* Vasopressor Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Vasopressor Selection (Target MAP &gt; 65 mmHg)
                </label>
                <select
                  value={params.vasopressor}
                  onChange={e => setParams({ ...params, vasopressor: e.target.value as VasopressorChoice })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="NONE">None (Off pressors)</option>
                  <option value="NOREPINEPHRINE">Norepinephrine (1st-Line: Restores RCA Perfusion, minimal PVR effect)</option>
                  <option value="PHENYLEPHRINE_HAZARD">Phenylephrine (HAZARD: Pure alpha-1 spikes PVR, worsen RV afterload)</option>
                  <option value="EPINEPHRINE">Epinephrine (Potent Inotrope/Vasopressor for Refractory Shock/Crash)</option>
                  <option value="VASOPRESSIN_ADJUNCT">Vasopressin Adjunct (0.01-0.03 U/min: Systemic MAP + Pulmonary Vasodilation)</option>
                </select>
              </div>

              {/* Inotrope Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Inotrope Selection (RV Contractility Augmentation)
                </label>
                <select
                  value={params.inotrope}
                  onChange={e => setParams({ ...params, inotrope: e.target.value as InotropeChoice })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="NONE">None</option>
                  <option value="DOBUTAMINE">Dobutamine (2.5 - 5 mcg/kg/min: Inotropic support)</option>
                  <option value="MILRINONE_CAUTION">Milrinone (CAUTION: Inodilator &mdash; severe systemic hypotension risk)</option>
                </select>
              </div>

              {/* Inhaled Pulmonary Vasodilators */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Selective Pulmonary Vasodilator
                </label>
                <select
                  value={params.inhaledVasodilator}
                  onChange={e => setParams({ ...params, inhaledVasodilator: e.target.value as InhaledVasodilatorChoice })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="NONE">None</option>
                  <option value="INHALED_NITRIC_OXIDE_20PPM">Inhaled Nitric Oxide (iNO 20 ppm &mdash; unloads RV without systemic vasodilation)</option>
                  <option value="INHALED_EPOPROSTENOL">Inhaled Epoprostenol / Prostacyclin (PGI2 aerosol)</option>
                </select>
              </div>
            </div>

            {/* Right: Pathophysiologic Explanation */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-400" /> The Biophysical Paradox: RV Volume Loading
              </h2>

              <div className="p-4 bg-amber-950/30 border border-amber-600/40 rounded-lg text-xs text-amber-200 leading-relaxed space-y-2">
                <p className="font-bold text-amber-300">Why Fluids Kill the Failing Right Ventricle:</p>
                <p>
                  In septic or hemorrhagic shock, volume expansion increases cardiac output via Frank-Starling mechanics. In acute massive PE, however, the thin-walled RV is already maximally dilated and operating on the flat or descending limb of the Starling curve.
                </p>
                <p>
                  Further fluid administration produces:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li><strong className="text-rose-300">Sarcomere Overstretch:</strong> RV wall tension surges (Laplace&apos;s Law), increasing myocardial oxygen consumption ($MVO_2$).</li>
                  <li><strong className="text-rose-300">Ventricular Interdependence:</strong> The dilated RV pushes the interventricular septum into the LV cavity (D-shaped LV), restricting LV diastolic filling.</li>
                  <li><strong className="text-rose-300">Right Coronary Ischemia:</strong> Systemic MAP drops while RV cavitary pressure rises, obliterating the RCA perfusion gradient ($MAP - CVP$), causing RV subendocardial infarction and PEA arrest.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-2">
                <span className="font-bold text-slate-200">Active Physiologic Mechanisms in Current Simulation:</span>
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

        {/* Tab 3: Reperfusion & Lytics Decision */}
        {activeTab === 'reperfusion' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Modality Selection */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-rose-400" /> Revascularization & Reperfusion Strategy
              </h2>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 block">Select Reperfusion Modality</label>
                <select
                  value={params.reperfusion}
                  onChange={e => setParams({ ...params, reperfusion: e.target.value as ReperfusionStrategy })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="ANTICOAGULATION_ONLY">Anticoagulation Only (IV UFH bolus + infusion / LMWH)</option>
                  <option value="FULL_DOSE_SYSTEMIC_TPA_100MG">Full-Dose Systemic Thrombolysis (Alteplase 100 mg IV over 2 hours)</option>
                  <option value="CARDIAC_ARREST_PUSH_TPA_50MG">Cardiac Arrest / Crash Bolus (Alteplase 50 mg IV push over 2 min)</option>
                  <option value="CATHETER_DIRECTED_THROMBOLYSIS_EKOS">Catheter-Directed Thrombolysis (EKOS Ultrasound + low-dose tPA 1 mg/h)</option>
                  <option value="MECHANICAL_ASPIRATION_THROMBECTOMY">Mechanical Aspiration Thrombectomy (Inari FlowTriever / Penumbra)</option>
                  <option value="SURGICAL_PULMONARY_EMBOLECTOMY">Surgical Pulmonary Embolectomy (Sternotomy & Cardiopulmonary Bypass)</option>
                  <option value="VA_ECMO_BRIDGE">Veno-Arterial (VA) ECMO Bridge (Femoral-Femoral ECLS)</option>
                </select>
              </div>

              {/* Absolute Contraindications to Lytics */}
              <div className="pt-4 border-t border-slate-800 space-y-2.5">
                <span className="text-xs font-semibold text-rose-400 block flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Bleeding Risk & Thrombolysis Contraindications
                </span>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={params.priorHemorrhagicStroke}
                      onChange={e => setParams({ ...params, priorHemorrhagicStroke: e.target.checked })}
                      className="accent-rose-500 rounded"
                    />
                    Prior Intracranial Hemorrhage / Hemorrhagic Stroke (Absolute)
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={params.ischemicStrokeWithin3Months}
                      onChange={e => setParams({ ...params, ischemicStrokeWithin3Months: e.target.checked })}
                      className="accent-rose-500 rounded"
                    />
                    Ischemic Stroke within past 3 months (Absolute)
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={params.activeInternalBleeding}
                      onChange={e => setParams({ ...params, activeInternalBleeding: e.target.checked })}
                      className="accent-rose-500 rounded"
                    />
                    Active Internal Bleeding (GI, retroperitoneal) (Absolute)
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={params.recentMajorSurgeryOrTraumaWithin3Weeks}
                      onChange={e => setParams({ ...params, recentMajorSurgeryOrTraumaWithin3Weeks: e.target.checked })}
                      className="accent-rose-500 rounded"
                    />
                    Major Surgery, Trauma, or Head Injury within 3 weeks (Absolute/High-Risk)
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={params.intracranialNeoplasm}
                      onChange={e => setParams({ ...params, intracranialNeoplasm: e.target.checked })}
                      className="accent-rose-500 rounded"
                    />
                    Known Intracranial Neoplasm or Vascular Malformation (Absolute)
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Decision Matrix & Comparisons */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Gauge className="w-5 h-5 text-emerald-400" /> Reperfusion Decision Matrix
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800">
                  <thead className="bg-slate-950 text-slate-400">
                    <tr>
                      <th className="p-2 border-b border-slate-800">Modality</th>
                      <th className="p-2 border-b border-slate-800">Lysis Speed</th>
                      <th className="p-2 border-b border-slate-800">Bleeding Risk</th>
                      <th className="p-2 border-b border-slate-800">Ideal Indication</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr className={params.reperfusion === 'FULL_DOSE_SYSTEMIC_TPA_100MG' ? 'bg-rose-950/30' : ''}>
                      <td className="p-2 font-medium">Systemic tPA (100 mg)</td>
                      <td className="p-2 text-emerald-400 font-bold">Fast (1-2h)</td>
                      <td className="p-2 text-rose-400">High (~10%, ICH ~2%)</td>
                      <td className="p-2 text-slate-400">Massive PE with no bleeding contraindications</td>
                    </tr>
                    <tr className={params.reperfusion === 'CARDIAC_ARREST_PUSH_TPA_50MG' ? 'bg-rose-950/30' : ''}>
                      <td className="p-2 font-medium">Crash Bolus tPA (50 mg)</td>
                      <td className="p-2 text-emerald-400 font-bold">Immediate</td>
                      <td className="p-2 text-rose-400">High (~12%)</td>
                      <td className="p-2 text-slate-400">Active PEA arrest or imminent collapse</td>
                    </tr>
                    <tr className={params.reperfusion === 'CATHETER_DIRECTED_THROMBOLYSIS_EKOS' ? 'bg-sky-950/30' : ''}>
                      <td className="p-2 font-medium">Catheter Thrombolysis (EKOS)</td>
                      <td className="p-2 text-sky-400">Moderate (6-12h)</td>
                      <td className="p-2 text-emerald-400">Low (3-4%, ICH &lt;0.5%)</td>
                      <td className="p-2 text-slate-400">Submassive PE or Massive with relative lytic contraindications</td>
                    </tr>
                    <tr className={params.reperfusion === 'MECHANICAL_ASPIRATION_THROMBECTOMY' ? 'bg-purple-950/30' : ''}>
                      <td className="p-2 font-medium">Mechanical Aspiration (Inari)</td>
                      <td className="p-2 text-emerald-400 font-bold">Fast (in cath lab)</td>
                      <td className="p-2 text-emerald-400">Minimal (No lytics)</td>
                      <td className="p-2 text-slate-400">Absolute contraindications to lytics (post-op, recent bleed)</td>
                    </tr>
                    <tr className={params.reperfusion === 'SURGICAL_PULMONARY_EMBOLECTOMY' ? 'bg-amber-950/30' : ''}>
                      <td className="p-2 font-medium">Surgical Embolectomy</td>
                      <td className="p-2 text-emerald-400 font-bold">Definitive</td>
                      <td className="p-2 text-amber-400">Moderate-High</td>
                      <td className="p-2 text-slate-400">Clot-in-transit across PFO, failed lytics, or refractory shock</td>
                    </tr>
                    <tr className={params.reperfusion === 'VA_ECMO_BRIDGE' ? 'bg-blue-950/30' : ''}>
                      <td className="p-2 font-medium">VA-ECMO Bridge</td>
                      <td className="p-2 text-emerald-400 font-bold">Immediate RV Unload</td>
                      <td className="p-2 text-amber-400">Cannulation site risk</td>
                      <td className="p-2 text-slate-400">Refractory cardiogenic shock or bridging to OR</td>
                    </tr>
                  </tbody>
                </table>
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

            {/* Right: Pearls & Pitfalls */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" /> High-Stakes Clinical Pearls & Pitfalls
              </h2>

              <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                <div className="p-3 bg-rose-950/30 border border-rose-600/30 rounded-lg">
                  <span className="font-bold text-rose-300 block mb-1">
                    The Perils of Endotracheal Intubation in Massive PE
                  </span>
                  <p>
                    Intubation carries a 10-20% peri-intubation cardiac arrest rate in severe RV failure. Positive pressure ventilation drops venous return (RV preload), spikes pulmonary vascular resistance (RV afterload), and induction sedatives cause vasodilation. Delay intubation if possible; if mandatory, use awake fiberoptic or push-dose pressors and pre-load with norepinephrine.
                  </p>
                </div>

                <div className="p-3 bg-amber-950/30 border border-amber-600/30 rounded-lg">
                  <span className="font-bold text-amber-300 block mb-1">
                    The &ldquo;60/60 Sign&rdquo; vs Chronic Pulmonary Hypertension
                  </span>
                  <p>
                    An acute unconditioned right ventricle cannot generate a systolic pulmonary pressure &gt; 55-60 mmHg. If peak TR gradient exceeds 60-70 mmHg, the patient has underlying chronic pulmonary hypertension (such as CTEPH or Group 1 PAH), rather than solely acute de novo PE.
                  </p>
                </div>

                <div className="p-3 bg-sky-950/30 border border-sky-600/30 rounded-lg">
                  <span className="font-bold text-sky-300 block mb-1">
                    CPR Duration After Cardiac Arrest Push tPA
                  </span>
                  <p>
                    If 50 mg IV push Alteplase is administered during PEA cardiac arrest, standard 20-minute ACLS termination rules DO NOT apply. Continue high-quality CPR for at least 60-90 minutes to allow the fibrinolytic agent to circulate through the obstructed pulmonary vasculature and clear the clot.
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
