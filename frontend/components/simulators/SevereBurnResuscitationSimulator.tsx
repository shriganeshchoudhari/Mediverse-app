'use client';

import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass,
  Droplets,
  Flame,
  Heart,
  Info,
  Layers,
  Scissors,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  TrendingDown,
  Wind,
  Zap,
} from 'lucide-react';
import {
  simulateBurnResuscitation,
  BURN_PRESETS,
  BurnPatientParams,
  BurnFormula,
  BurnInhalationStatus,
  CircumferentialBurnSite,
  ColloidRescueStrategy,
} from '../../.gemini/skills/SevereBurnResuscitationEngine';

export default function SevereBurnResuscitationSimulator() {
  const [params, setParams] = useState<BurnPatientParams>(BURN_PRESETS.optimalBrookeResuscitation);
  const [activeTab, setActiveTab] = useState<'formulas' | 'creep' | 'titration' | 'inhalation'>('formulas');

  const result = simulateBurnResuscitation(params);

  const loadPreset = (key: keyof typeof BURN_PRESETS) => {
    setParams({ ...BURN_PRESETS[key] });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                <Flame className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Severe Burn Resuscitation &amp; Fluid Creep Workstation
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Parkland vs Modified Brooke, Urine Output Titration (0.5 mL/kg/hr), Albumin Rescue, Inhalation Injury &amp; Escharotomy
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-amber-950/60 border border-amber-600/40 text-amber-300 rounded-full">
              Track B47 • Route #248
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-orange-950/60 border border-orange-600/40 text-orange-300 rounded-full">
              Burn Surgery &amp; Critical Care
            </span>
          </div>
        </div>

        {/* Presets Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 mr-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Presets:
          </span>
          <button
            onClick={() => loadPreset('optimalBrookeResuscitation')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-emerald-500 hover:bg-emerald-950/20 text-emerald-300 rounded-lg transition"
          >
            Optimal Modified Brooke
          </button>
          <button
            onClick={() => loadPreset('fluidCreepAbdominalCompartment')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-rose-500 hover:bg-rose-950/30 text-rose-400 rounded-lg transition"
          >
            Fluid Creep &amp; ACS (Trap)
          </button>
          <button
            onClick={() => loadPreset('inhalationAirwayEmergency')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-amber-500 hover:bg-amber-950/20 text-amber-300 rounded-lg transition"
          >
            Inhalation Airway Emergency
          </button>
          <button
            onClick={() => loadPreset('circumferentialTorsoConstriction')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-purple-500 hover:bg-purple-950/20 text-purple-300 rounded-lg transition"
          >
            Circumferential Torso Eschar
          </button>
          <button
            onClick={() => loadPreset('albuminColloidRescued')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 hover:border-cyan-500 hover:bg-cyan-950/20 text-cyan-300 rounded-lg transition"
          >
            Albumin Colloid Rescue
          </button>
        </div>
      </div>

      {/* Hero 4-Panel Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Panel 1: 24h Resuscitation Volume */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>24H RESUSCITATION VOLUME</span>
              <Droplets className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-cyan-400">
                {result.totalCalculated24hVolumeMl} <span className="text-xs font-normal text-slate-400">mL LR</span>
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-400 flex justify-between">
              <span>First 8h Rate:</span>
              <span className="font-bold text-white">{result.first8hTargetRateMlPerHour} mL/hr</span>
            </div>
            <div className="mt-1 text-xs text-slate-400 flex justify-between">
              <span>Next 16h Rate:</span>
              <span className="font-bold text-white">{result.next16hTargetRateMlPerHour} mL/hr</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Timing Start:</span>
            <span className="font-bold text-amber-400">From Burn Time (Not Arrival)</span>
          </div>
        </div>

        {/* Panel 2: Fluid Creep & ACS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>FLUID CREEP &amp; BLADDER PRESSURE</span>
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Creep Index</span>
                <span className={`text-2xl font-bold ${
                  result.fluidCreepHazardActive ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {result.fluidCreepVolumePerKg} <span className="text-xs font-normal text-slate-400">mL/kg</span>
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Bladder Pressure</span>
                <span className={`text-2xl font-bold ${params.intraAbdominalPressureMmHg >= 20 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {params.intraAbdominalPressureMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                result.abdominalCompartmentSyndromeRisk === 'FULL_ACS_LAPAROTOMY_MANDATED'
                  ? 'bg-rose-950/60 border border-rose-600/40 text-rose-300 animate-pulse'
                  : result.abdominalCompartmentSyndromeRisk === 'ELEVATED_BLADDER_PRESSURE'
                  ? 'bg-amber-950/60 border border-amber-600/40 text-amber-300'
                  : 'bg-emerald-950/60 border border-emerald-600/40 text-emerald-300'
              }`}>
                {result.abdominalCompartmentSyndromeRisk === 'FULL_ACS_LAPAROTOMY_MANDATED'
                  ? 'Abdominal Compartment Syndrome (ACS)'
                  : result.abdominalCompartmentSyndromeRisk === 'ELEVATED_BLADDER_PRESSURE'
                  ? 'Elevated Intra-abdominal Pressure'
                  : 'Normal Peritoneal Compliance'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Creep Threshold:</span>
            <span className="font-bold text-slate-300">&gt; 250 mL/kg (Critical Danger)</span>
          </div>
        </div>

        {/* Panel 3: Hourly Urine Output */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>HOURLY URINE OUTPUT</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Current Output</span>
                <span className={`text-2xl font-bold ${
                  result.resuscitationAdequacy === 'UNDER_RESUSCITATED_AKI' ? 'text-rose-400' :
                  result.resuscitationAdequacy === 'OVER_RESUSCITATED_FLUID_CREEP' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {params.hourlyUrineOutputMl} <span className="text-xs font-normal text-slate-400">mL/hr</span>
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Target (0.5 mL/kg/h)</span>
                <span className="text-xl font-bold text-white">
                  {Math.round(params.weightKg * 0.5)} <span className="text-xs font-normal text-slate-400">mL/hr</span>
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                result.resuscitationAdequacy === 'OPTIMAL_TARGET_PERFUSION'
                  ? 'bg-emerald-950/60 border border-emerald-600/40 text-emerald-300'
                  : result.resuscitationAdequacy === 'UNDER_RESUSCITATED_AKI'
                  ? 'bg-rose-950/60 border border-rose-600/40 text-rose-300'
                  : 'bg-amber-950/60 border border-amber-600/40 text-amber-300'
              }`}>
                {result.resuscitationAdequacy === 'OPTIMAL_TARGET_PERFUSION'
                  ? 'Optimal Renal End-Organ Perfusion'
                  : result.resuscitationAdequacy === 'UNDER_RESUSCITATED_AKI'
                  ? 'Oliguria / Under-Resuscitated (AKI Risk)'
                  : 'Over-Resuscitation (Driving Fluid Creep)'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Titration Rule:</span>
            <span className="font-bold text-white">&plusmn; 20-30% per hour</span>
          </div>
        </div>

        {/* Panel 4: Airway & Safety */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>AIRWAY &amp; SAFETY</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Inhalation Threat</span>
                <span className={`text-xl font-bold ${result.inhalationAirwayThreat ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                  {result.inhalationAirwayThreat ? 'AIRWAY EMERGENCY' : 'Clear / Low Risk'}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Safety Score</span>
                <span className={`text-2xl font-bold ${
                  result.safetyScore >= 80 ? 'text-emerald-400' :
                  result.safetyScore >= 50 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {result.safetyScore}/100
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Escharotomy Status:</span>
            <span className={`font-bold ${result.escharotomyMandated ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
              {result.escharotomyMandated ? 'MANDATED (Bedside)' : 'Not Required'}
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
            onClick={() => setActiveTab('formulas')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'formulas'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Burn Geometry &amp; Formulas
          </button>
          <button
            onClick={() => setActiveTab('creep')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'creep'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Fluid Creep &amp; Albumin Rescue
          </button>
          <button
            onClick={() => setActiveTab('titration')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'titration'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Urine Output Titration
          </button>
          <button
            onClick={() => setActiveTab('inhalation')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              activeTab === 'inhalation'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Inhalation &amp; Escharotomy
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="max-w-7xl mx-auto">
        {/* Tab 1: Burn Geometry & Formulas */}
        {activeTab === 'formulas' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" /> Patient Parameters &amp; Burn Size
              </h2>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Patient Weight (kg)</span>
                  <span className="font-bold text-white">{params.weightKg} kg</span>
                </div>
                <input aria-label="Patient Weight (kg)"
                  type="range"
                  min="40"
                  max="140"
                  step="1"
                  value={params.weightKg}
                  onChange={e => setParams({ ...params, weightKg: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Total Body Surface Area (TBSA % - 2nd/3rd degree only)</span>
                  <span className={`font-bold ${params.tbsaPercentage >= 40 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {params.tbsaPercentage}% TBSA
                  </span>
                </div>
                <input aria-label="Total Body Surface Area (TBSA % - 2nd/3rd degree only)"
                  type="range"
                  min="10"
                  max="90"
                  step="1"
                  value={params.tbsaPercentage}
                  onChange={e => setParams({ ...params, tbsaPercentage: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Resuscitation Formula</label>
                <select
                  value={params.selectedFormula}
                  onChange={e => setParams({ ...params, selectedFormula: e.target.value as BurnFormula })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="MODIFIED_BROOKE_2ML">Modified Brooke: 2 mL x kg x %TBSA (ABA Recommendation)</option>
                  <option value="PARKLAND_4ML">Parkland Formula: 4 mL x kg x %TBSA (Traditional)</option>
                  <option value="PEDIATRIC_3ML">Pediatric Consensus: 3 mL x kg x %TBSA (+ Maintenance D5 1/2NS)</option>
                  <option value="ELECTRICAL_MYOGLOBIN_4ML">Electrical Injury: 4 mL x kg x %TBSA (Higher UOP target)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Hours Elapsed Since Burn Injury (Clock starts at injury time)</span>
                  <span className="font-bold text-white">{params.hoursSinceBurnInjury} hrs</span>
                </div>
                <input aria-label="Hours Since Burn Injury"
                  type="range"
                  min="0"
                  max="24"
                  step="1"
                  value={params.hoursSinceBurnInjury}
                  onChange={e => setParams({ ...params, hoursSinceBurnInjury: Number(e.target.value) })}
                  className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>
            </div>

            {/* Right: Formula Comparison */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-400" /> The Shift to Modified Brooke
              </h2>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-2">
                <span className="font-bold text-amber-300 block text-sm">Why the American Burn Association Recommends 2 mL/kg/%:</span>
                <p className="text-slate-300">
                  The classic Parkland formula (4 mL/kg/%) frequently delivers excessive crystalloid, precipitating fluid creep, ocular compartment syndrome, and abdominal compartment syndrome (ACS).
                </p>
                <p className="text-slate-300">
                  The Modified Brooke formula (2 mL/kg/%) halves the initial calculated rate, allowing gradual titration upward only if urine output falls below 0.5 mL/kg/hr.
                </p>
              </div>

              <div className="p-4 bg-blue-950/20 border border-blue-600/30 rounded-lg text-xs space-y-2 text-blue-200">
                <span className="font-bold text-blue-400 block">The Clock Starts at Injury:</span>
                <p className="text-slate-300">
                  Fluid requirements are calculated from the moment the burn occurred, not from hospital arrival. If arrival is delayed by 3 hours, the entire first 8-hour volume must be given over the remaining 5 hours.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Fluid Creep & Albumin */}
        {activeTab === 'creep' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" /> Fluid Creep &amp; Colloid Parameters
              </h2>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Cumulative Crystalloid Infused (mL)</span>
                  <span className="font-bold text-cyan-400">{params.cumulativeCrystalloidInfusedMl} mL</span>
                </div>
                <input aria-label="Cumulative Crystalloid Infused (mL)"
                  type="range"
                  min="1000"
                  max="30000"
                  step="500"
                  value={params.cumulativeCrystalloidInfusedMl}
                  onChange={e => setParams({ ...params, cumulativeCrystalloidInfusedMl: Number(e.target.value) })}
                  className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Intra-abdominal Bladder Pressure (mmHg)</span>
                  <span className={`font-bold ${params.intraAbdominalPressureMmHg >= 20 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {params.intraAbdominalPressureMmHg} mmHg
                  </span>
                </div>
                <input aria-label="Intra-abdominal Bladder Pressure (mmHg)"
                  type="range"
                  min="5"
                  max="35"
                  step="1"
                  value={params.intraAbdominalPressureMmHg}
                  onChange={e => setParams({ ...params, intraAbdominalPressureMmHg: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Colloid Rescue Strategy</label>
                <select
                  value={params.colloidRescue}
                  onChange={e => setParams({ ...params, colloidRescue: e.target.value as ColloidRescueStrategy })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="NONE_CRYSTALLOID_ONLY">None / Crystalloid Only (High Fluid Creep Risk)</option>
                  <option value="EARLY_ALBUMIN_8_12H">5% Albumin at 8-12 Hours (Capillary Tightening Window)</option>
                  <option value="LATE_ALBUMIN_POST_24H">Albumin Post-24 Hours (Maintenance Phase)</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" /> Abdominal Compartment Syndrome (ACS)
              </h2>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-2">
                <span className="font-bold text-amber-300 block text-sm">Bladder Pressure &gt;= 20 mmHg + Organ Dysfunction:</span>
                <p className="text-slate-300">
                  Massive crystalloid infusion causes diffuse bowel and retroperitoneal edema. Elevated intra-abdominal pressure compresses the IVC (lowering venous return), impairs renal perfusion (causing paradoxical oliguria), and elevates diaphragms (causing high peak airway pressures).
                </p>
                <p className="text-slate-300">
                  <strong>Pitfall:</strong> Chasing the oliguria with more crystalloid exacerbates the ACS death spiral! Treatment: Paracentesis, nasogastric decompression, 5% albumin rescue, and decompressive laparotomy.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Titration */}
        {activeTab === 'titration' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" /> Urine Output &amp; Infusion Rate
              </h2>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Current Hourly Urine Output (mL/hr)</span>
                  <span className="font-bold text-emerald-400">{params.hourlyUrineOutputMl} mL/hr</span>
                </div>
                <input aria-label="Current Hourly Urine Output (mL/hr)"
                  type="range"
                  min="0"
                  max="160"
                  step="2"
                  value={params.hourlyUrineOutputMl}
                  onChange={e => setParams({ ...params, hourlyUrineOutputMl: Number(e.target.value) })}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Current IV Infusion Rate (mL/hr)</span>
                  <span className="font-bold text-white">{params.currentIvRateMlPerHour} mL/hr</span>
                </div>
                <input aria-label="Current IV Infusion Rate (mL/hr)"
                  type="range"
                  min="50"
                  max="2000"
                  step="25"
                  value={params.currentIvRateMlPerHour}
                  onChange={e => setParams({ ...params, currentIvRateMlPerHour: Number(e.target.value) })}
                  className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Hourly Titration Algorithm
              </h2>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-2">
                <span className="font-bold text-emerald-400 block text-sm">Target: Strict 0.5 mL/kg/hr ({Math.round(params.weightKg * 0.5)} mL/hr)</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>If Urine Output &lt; 0.5 mL/kg/hr:</strong> Increase IV fluid rate by 20-30%.</li>
                  <li><strong>If Urine Output 0.5 - 1.0 mL/kg/hr:</strong> Maintain current infusion rate.</li>
                  <li><strong>If Urine Output &gt; 1.0 mL/kg/hr:</strong> Decrease IV fluid rate by 20-30% to prevent fluid creep.</li>
                  <li><em>Electrical Burn Target:</em> 1.0 - 1.5 mL/kg/hr (75-100 mL/hr) until urine clears of myoglobin.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Inhalation & Escharotomy */}
        {activeTab === 'inhalation' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Wind className="w-5 h-5 text-rose-400" /> Airway &amp; Circumferential Eschar
              </h2>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Inhalation Injury Status</label>
                <select
                  value={params.inhalationInjury}
                  onChange={e => setParams({ ...params, inhalationInjury: e.target.value as BurnInhalationStatus })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="NONE">None / Clear Ambient Burn</option>
                  <option value="SUSPECTED_SMOKE_INHALATION">Suspected Smoke Inhalation (Enclosed space, soot, singed hairs)</option>
                  <option value="SEVERE_INHALATION_INJURY_AIRWAY_THREAT">Severe Inhalation Injury with Stridor / Edema (AIRWAY EMERGENCY)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Carboxyhemoglobin (COHb %)</span>
                  <span className={`font-bold ${params.coHbPercent > 15 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {params.coHbPercent}%
                  </span>
                </div>
                <input aria-label="Carboxyhemoglobin (COHb %)"
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={params.coHbPercent}
                  onChange={e => setParams({ ...params, coHbPercent: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Circumferential Full-Thickness Burn</label>
                <select
                  value={params.circumferentialBurn}
                  onChange={e => setParams({ ...params, circumferentialBurn: e.target.value as CircumferentialBurnSite })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="NONE">None</option>
                  <option value="CIRCUMFERENTIAL_TORSO">Circumferential Torso (Restrictive Ventilatory Failure)</option>
                  <option value="CIRCUMFERENTIAL_EXTREMITIES">Circumferential Extremities (Limb Compartment Syndrome)</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.escharotomyPerformed}
                    onChange={e => setParams({ ...params, escharotomyPerformed: e.target.checked })}
                    className="accent-emerald-500 rounded"
                  />
                  <span>Bedside Escharotomy Incisions Completed</span>
                </label>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Scissors className="w-5 h-5 text-rose-400" /> Escharotomy &amp; Airway Principles
              </h2>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-2">
                <span className="font-bold text-rose-400 block text-sm">Torso &amp; Limb Decompression:</span>
                <p className="text-slate-300">
                  Full-thickness burn tissue loses elasticity. As resuscitation fluid pours into interstitial spaces, tissue pressure rises under the leathery eschar.
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>Torso:</strong> Anterior axillary line incisions joined by a transverse epigastric incision relieve chest wall constriction, dropping peak airway pressures.</li>
                  <li><strong>Limbs:</strong> Mid-medial and mid-lateral incisions decompress deep neurovascular bundles, preventing ischemic foot drop and amputation.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
