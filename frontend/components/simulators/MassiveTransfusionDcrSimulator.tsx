'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Flame,
  Activity,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Thermometer,
  Sparkles,
  HeartPulse,
  Syringe,
  Timer,
  Layers,
} from 'lucide-react';
import {
  calculateAbcScore,
  evaluateLethalTriad,
  evaluateDcrResuscitation,
  PatientTraumaVitals,
  ResuscitationFluidAdministered,
  ViscoelasticParameters,
} from '../../.gemini/skills/MassiveTransfusionDcrEngine';

interface PresetCase {
  id: string;
  name: string;
  badge: string;
  summary: string;
  vitals: PatientTraumaVitals;
  fluids: ResuscitationFluidAdministered;
  visco: ViscoelasticParameters;
}

const PRESET_CASES: PresetCase[] = [
  {
    id: 'penetrating-torso-gsw',
    name: 'Penetrating Abdominal GSW (Grade IV Liver Laceration)',
    badge: 'Penetrating Torso',
    summary:
      '26-year-old male with multiple close-range gunshot wounds to the RUQ and epigastrium. FAST ultrasound shows massive hemoperitoneum. Classic candidate for permissive hypotension.',
    vitals: {
      systolicBpMmHg: 82,
      diastolicBpMmHg: 44,
      heartRateBpm: 128,
      temperatureCelsius: 34.2,
      arterialPh: 7.18,
      baseDeficitMeqL: 10,
      hemoglobinGDl: 7.2,
      plateletCountPerUl: 88000,
      serumFibrinogenMgDl: 120,
      ionizedCalciumMmolL: 0.98,
      isPenetratingTrauma: true,
      isPositiveFastUltrasound: true,
      hasTraumaticBrainInjury: false,
    },
    fluids: {
      prbcUnits: 6,
      ffpUnits: 6,
      plateletPheresisUnits: 1,
      cryoprecipitateDoses: 1,
      crystalloidNormalSalineLiters: 0.5,
      txaGivenWithin3Hours: true,
      calciumChlorideGramsGiven: 1.0,
    },
    visco: {
      rTimeMinutes: 11.2,
      alphaAngleDegrees: 54,
      maximumAmplitudeMm: 50,
      ly30Percent: 4.8,
    },
  },
  {
    id: 'polytrauma-tbi-contraindicated',
    name: 'High-Speed MVC with Severe TBI & Pelvic Disruption',
    badge: 'TBI Permissive Warning',
    summary:
      '38-year-old female driver with open book pelvic fracture and acute subdural hematoma. Critical alert: Permissive hypotension is strictly contraindicated in TBI!',
    vitals: {
      systolicBpMmHg: 84,
      diastolicBpMmHg: 48,
      heartRateBpm: 122,
      temperatureCelsius: 35.1,
      arterialPh: 7.24,
      baseDeficitMeqL: 7,
      hemoglobinGDl: 8.4,
      plateletCountPerUl: 110000,
      serumFibrinogenMgDl: 165,
      ionizedCalciumMmolL: 1.05,
      isPenetratingTrauma: false,
      isPositiveFastUltrasound: true,
      hasTraumaticBrainInjury: true,
    },
    fluids: {
      prbcUnits: 4,
      ffpUnits: 4,
      plateletPheresisUnits: 0.5,
      cryoprecipitateDoses: 0,
      crystalloidNormalSalineLiters: 1.0,
      txaGivenWithin3Hours: true,
      calciumChlorideGramsGiven: 1.0,
    },
    visco: {
      rTimeMinutes: 8.5,
      alphaAngleDegrees: 62,
      maximumAmplitudeMm: 58,
      ly30Percent: 1.4,
    },
  },
  {
    id: 'crystalloid-dilution-tic',
    name: 'Prolonged Transport with 4L Cold Saline Dilution',
    badge: 'Iatrogenic Dilution',
    summary:
      '49-year-old rollover driver received 4 Liters of room-temperature 0.9% Normal Saline en route. Profound dilutional coagulopathy and hypothermia.',
    vitals: {
      systolicBpMmHg: 76,
      diastolicBpMmHg: 38,
      heartRateBpm: 136,
      temperatureCelsius: 32.8,
      arterialPh: 7.08,
      baseDeficitMeqL: 14,
      hemoglobinGDl: 5.6,
      plateletCountPerUl: 45000,
      serumFibrinogenMgDl: 70,
      ionizedCalciumMmolL: 0.85,
      isPenetratingTrauma: false,
      isPositiveFastUltrasound: true,
      hasTraumaticBrainInjury: false,
    },
    fluids: {
      prbcUnits: 8,
      ffpUnits: 2,
      plateletPheresisUnits: 0,
      cryoprecipitateDoses: 0,
      crystalloidNormalSalineLiters: 4.0,
      txaGivenWithin3Hours: false,
      calciumChlorideGramsGiven: 0,
    },
    visco: {
      rTimeMinutes: 16.5,
      alphaAngleDegrees: 38,
      maximumAmplitudeMm: 36,
      ly30Percent: 12.5,
    },
  },
  {
    id: 'controlled-balanced-dcr',
    name: 'Optimized 1:1:1 Resuscitation with Rapid Infuser',
    badge: 'Optimal Control',
    summary:
      'Hemostatic control underway in trauma bay. Balanced 1:1:1 Cooler 1 and 2 transfused via Belmont rapid infuser with fluid warmer and serial TEG guidance.',
    vitals: {
      systolicBpMmHg: 88,
      diastolicBpMmHg: 54,
      heartRateBpm: 98,
      temperatureCelsius: 36.2,
      arterialPh: 7.32,
      baseDeficitMeqL: 4,
      hemoglobinGDl: 9.6,
      plateletCountPerUl: 125000,
      serumFibrinogenMgDl: 210,
      ionizedCalciumMmolL: 1.18,
      isPenetratingTrauma: true,
      isPositiveFastUltrasound: true,
      hasTraumaticBrainInjury: false,
    },
    fluids: {
      prbcUnits: 6,
      ffpUnits: 6,
      plateletPheresisUnits: 1,
      cryoprecipitateDoses: 1,
      crystalloidNormalSalineLiters: 0.5,
      txaGivenWithin3Hours: true,
      calciumChlorideGramsGiven: 2.0,
    },
    visco: {
      rTimeMinutes: 6.8,
      alphaAngleDegrees: 66,
      maximumAmplitudeMm: 63,
      ly30Percent: 1.1,
    },
  },
];

export default function MassiveTransfusionDcrSimulator() {
  const [activePreset, setActivePreset] = useState<PresetCase>(PRESET_CASES[0]);

  const [vitals, setVitals] = useState<PatientTraumaVitals>(PRESET_CASES[0].vitals);
  const [fluids, setFluids] = useState<ResuscitationFluidAdministered>(PRESET_CASES[0].fluids);
  const [visco, setVisco] = useState<ViscoelasticParameters>(PRESET_CASES[0].visco);

  const applyPreset = (preset: PresetCase) => {
    setActivePreset(preset);
    setVitals(preset.vitals);
    setFluids(preset.fluids);
    setVisco(preset.visco);
  };

  // 1. ABC Score & Shock Index
  const abcResult = useMemo(() => calculateAbcScore(vitals), [vitals]);

  // 2. Lethal Triad
  const lethalTriadResult = useMemo(() => evaluateLethalTriad(vitals), [vitals]);

  // 3. DCR Quality Evaluation
  const dcrResult = useMemo(
    () => evaluateDcrResuscitation(vitals, fluids, visco),
    [vitals, fluids, visco]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 uppercase tracking-wider mb-1">
              <Link href="/simulators" className="hover:underline text-slate-400">
                Simulators
              </Link>
              <span>/</span>
              <span>Trauma Surgery &amp; Critical Care Resuscitation</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
              <Flame className="w-8 h-8 text-rose-500 animate-pulse" />
              Massive Transfusion Protocol (MTP) &amp; Damage Control Resuscitation
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Real-time Lethal Triad biophysics, ABC Score activation, balanced 1:1:1 blood product ratios,
              permissive hypotension defense, TEG/ROTEM hemostatic targeting, and citrate toxicity surveillance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              DCR Hemostatic Engine
            </span>
          </div>
        </div>

        {/* Case Presets Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_CASES.map((preset) => {
            const isSelected = activePreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={'text-left p-3 rounded-xl border transition-all ' + (isSelected
                  ? 'bg-rose-950/40 border-rose-500 shadow-md shadow-rose-950/30'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900')}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                    {preset.badge}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />}
                </div>
                <h3 className="text-xs font-bold text-white line-clamp-1">{preset.name}</h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-snug">
                  {preset.summary}
                </p>
              </button>
            );
          })}
        </div>

        {/* MTP Trigger Alert Banner if ABC >= 2 */}
        {abcResult.mtpActivationRecommended && (
          <div className="bg-rose-950/80 border-2 border-rose-500 rounded-xl p-4 flex items-start gap-4 shadow-xl">
            <ShieldAlert className="w-7 h-7 text-rose-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-rose-200 uppercase tracking-wide flex items-center gap-2">
                CRITICAL ALERT: Massive Transfusion Protocol (MTP) Triggered (ABC Score: {abcResult.score}/4, SI: {abcResult.shockIndex})
              </h2>
              <p className="text-xs text-rose-300 leading-relaxed">
                Patient has high risk of requiring &ge; 10 units pRBC in 24 hours. Immediately notify Blood Bank for MTP Cooler 1 (6 pRBC : 6 FFP : 1 Apheresis Platelet), initiate Belmont/Level 1 rapid blood warmer, and prepare IV Tranexamic Acid (TXA).
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                <span className="px-2 py-0.5 bg-rose-900/60 border border-rose-700 text-white rounded">
                  {abcResult.shockIndexInterpretation}
                </span>
                <span className="px-2 py-0.5 bg-rose-900/60 border border-rose-700 text-white rounded">
                  Permissive Target: {vitals.hasTraumaticBrainInjury ? 'SBP >= 100-110 (TBI!)' : 'SBP 80-90 mmHg'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3-Column Workstation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: Patient Trauma Vitals & Lethal Triad (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                  <HeartPulse className="w-4 h-4" /> Trauma Vitals &amp; Shock Index
                </h2>
                <span className="text-xs font-mono font-bold text-rose-400">
                  SI: {abcResult.shockIndex}
                </span>
              </div>

              {/* Vitals Controls */}
              <div className="space-y-3 text-xs">
                {/* SBP Slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Systolic BP:</span>
                    <span className="font-mono text-rose-400 font-bold">{vitals.systolicBpMmHg} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="140"
                    step="2"
                    value={vitals.systolicBpMmHg}
                    onChange={(e) => setVitals((prev) => ({ ...prev, systolicBpMmHg: Number(e.target.value) }))}
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>&lt;75 Danger</span>
                    <span>80-90 Permissive</span>
                    <span>&gt;100 Clot Disruption</span>
                  </div>
                </div>

                {/* Heart Rate Slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Heart Rate:</span>
                    <span className="font-mono text-rose-400 font-bold">{vitals.heartRateBpm} bpm</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="160"
                    step="2"
                    value={vitals.heartRateBpm}
                    onChange={(e) => setVitals((prev) => ({ ...prev, heartRateBpm: Number(e.target.value) }))}
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Core Temperature */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-cyan-400" /> Core Temperature:
                    </span>
                    <span className={'font-mono font-bold ' + (vitals.temperatureCelsius < 35 ? 'text-cyan-400' : 'text-slate-200')}>
                      {vitals.temperatureCelsius.toFixed(1)} &deg;C
                    </span>
                  </div>
                  <input
                    type="range"
                    min="31.0"
                    max="37.5"
                    step="0.1"
                    value={vitals.temperatureCelsius}
                    onChange={(e) => setVitals((prev) => ({ ...prev, temperatureCelsius: Number(e.target.value) }))}
                    className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Arterial pH */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Arterial pH / Base Deficit:</span>
                    <span className={'font-mono font-bold ' + (vitals.arterialPh < 7.20 ? 'text-amber-400' : 'text-slate-200')}>
                      pH {vitals.arterialPh.toFixed(2)} (BD -{vitals.baseDeficitMeqL})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6.90"
                    max="7.45"
                    step="0.02"
                    value={vitals.arterialPh}
                    onChange={(e) => setVitals((prev) => ({ ...prev, arterialPh: Number(e.target.value) }))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Serum Fibrinogen */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Serum Fibrinogen:</span>
                    <span className={'font-mono font-bold ' + (vitals.serumFibrinogenMgDl < 150 ? 'text-rose-400' : 'text-slate-200')}>
                      {vitals.serumFibrinogenMgDl} mg/dL
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="350"
                    step="10"
                    value={vitals.serumFibrinogenMgDl}
                    onChange={(e) => setVitals((prev) => ({ ...prev, serumFibrinogenMgDl: Number(e.target.value) }))}
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Target &gt; 150-200 mg/dL</span>
                  </div>
                </div>

                {/* TBI Toggle */}
                <div className="pt-2 border-t border-slate-800">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={vitals.hasTraumaticBrainInjury}
                      onChange={(e) => setVitals((prev) => ({ ...prev, hasTraumaticBrainInjury: e.target.checked }))}
                      className="accent-rose-500"
                    />
                    <span className="text-rose-300 font-bold">Severe Traumatic Brain Injury (TBI) Present</span>
                  </label>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    If checked, Permissive Hypotension is CONTRAINDICATED (maintain SBP &ge; 100-110).
                  </p>
                </div>
              </div>

              {/* Lethal Triad Score Card */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 uppercase">Lethal Triad Status:</span>
                  <span className={'px-2 py-0.5 rounded text-xs font-bold ' + (lethalTriadResult.lethalTriadScore >= 2
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                    : 'bg-slate-800 text-slate-300')}>
                    {lethalTriadResult.lethalTriadScore} / 3 Components
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                  <div className={'p-1.5 rounded border ' + (vitals.temperatureCelsius < 35 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400')}>
                    Hypothermia
                  </div>
                  <div className={'p-1.5 rounded border ' + (vitals.arterialPh < 7.20 ? 'bg-amber-950/60 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400')}>
                    Acidosis
                  </div>
                  <div className={'p-1.5 rounded border ' + (vitals.serumFibrinogenMgDl < 150 ? 'bg-rose-950/60 border-rose-500 text-rose-200' : 'bg-slate-900 border-slate-800 text-slate-400')}>
                    Coagulopathy
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Predicted Trauma Mortality:</span>
                  <span className="font-bold text-rose-400 font-mono text-sm">
                    {lethalTriadResult.predictedMortalityPercent}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Blood Bank MTP Coolers & DCR Infusion (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                  <Droplets className="w-4 h-4" /> MTP Cooler &amp; Product Infusion
                </h2>
                <span className={'px-2 py-0.5 rounded text-xs font-bold font-mono ' + (dcrResult.isBalancedRatioAchieved
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40')}>
                  Ratio {dcrResult.ratioPrcbFfpPlt}
                </span>
              </div>

              {/* Product Quantities */}
              <div className="space-y-3 text-xs">
                {/* pRBC units */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Packed Red Blood Cells (pRBC):</span>
                    <span className="font-mono text-rose-400 font-bold">{fluids.prbcUnits} Units</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="18"
                    step="1"
                    value={fluids.prbcUnits}
                    onChange={(e) => setFluids((prev) => ({ ...prev, prbcUnits: Number(e.target.value) }))}
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* FFP units */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Fresh Frozen Plasma (FFP):</span>
                    <span className="font-mono text-amber-400 font-bold">{fluids.ffpUnits} Units</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="18"
                    step="1"
                    value={fluids.ffpUnits}
                    onChange={(e) => setFluids((prev) => ({ ...prev, ffpUnits: Number(e.target.value) }))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Platelets */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Apheresis Platelets (1 = ~6 pooled):</span>
                    <span className="font-mono text-emerald-400 font-bold">{fluids.plateletPheresisUnits} Pack</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.5"
                    value={fluids.plateletPheresisUnits}
                    onChange={(e) => setFluids((prev) => ({ ...prev, plateletPheresisUnits: Number(e.target.value) }))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Normal Saline Crystalloid */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">0.9% Normal Saline Crystalloid:</span>
                    <span className={'font-mono font-bold ' + (fluids.crystalloidNormalSalineLiters > 1.5 ? 'text-rose-400' : 'text-slate-200')}>
                      {fluids.crystalloidNormalSalineLiters.toFixed(1)} Liters
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5.0"
                    step="0.5"
                    value={fluids.crystalloidNormalSalineLiters}
                    onChange={(e) =>
                      setFluids((prev) => ({
                        ...prev,
                        crystalloidNormalSalineLiters: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Restrict &lt; 1.0 - 1.5 L (Avoid dilutional coagulopathy)</span>
                  </div>
                </div>

                {/* Adjuncts: TXA & Calcium */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fluids.txaGivenWithin3Hours}
                      onChange={(e) => setFluids((prev) => ({ ...prev, txaGivenWithin3Hours: e.target.checked }))}
                      className="accent-rose-500"
                    />
                    <span className="text-slate-200 font-semibold">Tranexamic Acid (TXA 1g IV) &lt; 3 Hours</span>
                  </label>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">10% Calcium Chloride IV:</span>
                    <div className="flex items-center gap-2">
                      {[0, 1, 2, 3].map((g) => (
                        <button
                          key={g}
                          onClick={() => setFluids((prev) => ({ ...prev, calciumChlorideGramsGiven: g }))}
                          className={'px-2 py-0.5 rounded border font-semibold ' + (fluids.calciumChlorideGramsGiven === g
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                            : 'bg-slate-800 border-slate-700 text-slate-400')}
                        >
                          {g}g
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ratio & Permissive Hypotension Status Card */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Permissive Hypotension:</span>
                  <span className={'px-2 py-0.5 rounded text-[11px] font-bold ' + (dcrResult.permissiveHypotensionAdherence === 'OPTIMAL'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30')}>
                    {dcrResult.permissiveHypotensionAdherence.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Ionized Calcium / Citrate:</span>
                  <span className={'font-bold ' + (dcrResult.calciumCitrateAdequacy === 'ADEQUATE' ? 'text-emerald-400' : 'text-rose-400 animate-pulse')}>
                    {dcrResult.calciumCitrateAdequacy.replace(/_/g, ' ')}
                  </span>
                </div>

                {dcrResult.clinicalRecommendations.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Resuscitation Alerts:
                    </span>
                    <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                      {dcrResult.clinicalRecommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Column 3: Viscoelastic (TEG / ROTEM) Clot Kinetics (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Viscoelastic (TEG) Clot Tracing
                </h2>
                <span className="text-xs font-mono text-slate-400">Goal-Directed</span>
              </div>

              {/* Simulated TEG Curve Canvas */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-2 relative h-48 flex items-center justify-center overflow-hidden">
                <svg width="280" height="160" viewBox="0 0 280 160" className="w-full h-full">
                  {/* Baseline center line */}
                  <line x1="10" y1="80" x2="270" y2="80" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Reaction time marker R */}
                  <line x1={Math.min(100, 20 + visco.rTimeMinutes * 5)} y1="30" x2={Math.min(100, 20 + visco.rTimeMinutes * 5)} y2="130" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" />
                  <text x={Math.min(90, 20 + visco.rTimeMinutes * 5)} y="25" fill="#f43f5e" fontSize="9" fontFamily="monospace">
                    R ({visco.rTimeMinutes}m)
                  </text>

                  {/* Upper & Lower Envelope of TEG Curve */}
                  {(() => {
                    const rOffset = Math.min(100, 20 + visco.rTimeMinutes * 5);
                    const maHalf = Math.min(65, (visco.maximumAmplitudeMm / 70) * 55);
                    const lyDrop = (visco.ly30Percent / 15) * (maHalf * 0.7);

                    const topPath = `M 10 80 L ${rOffset} 80 Q ${rOffset + 35} ${80 - maHalf} 180 ${80 - maHalf} Q 230 ${80 - maHalf + lyDrop} 270 80`;
                    const bottomPath = `M 10 80 L ${rOffset} 80 Q ${rOffset + 35} ${80 + maHalf} 180 ${80 + maHalf} Q 230 ${80 + maHalf - lyDrop} 270 80`;

                    return (
                      <g>
                        <path d={`${topPath} L 270 80 ${bottomPath} Z`} fill="rgba(244, 63, 94, 0.15)" />
                        <path d={topPath} fill="none" stroke="#f43f5e" strokeWidth="2.5" />
                        <path d={bottomPath} fill="none" stroke="#f43f5e" strokeWidth="2.5" />
                      </g>
                    );
                  })()}
                </svg>

                {/* In-chart metrics overlay */}
                <div className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-400">
                  MA: {visco.maximumAmplitudeMm}mm | LY30: {visco.ly30Percent}%
                </div>
              </div>

              {/* Viscoelastic Sliders */}
              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">R-Time (Factor activity):</span>
                    <span className="font-mono text-rose-400 font-bold">{visco.rTimeMinutes} min</span>
                  </div>
                  <input
                    type="range"
                    min="3.0"
                    max="20.0"
                    step="0.5"
                    value={visco.rTimeMinutes}
                    onChange={(e) => setVisco((prev) => ({ ...prev, rTimeMinutes: Number(e.target.value) }))}
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Normal: 5-10 min</span>
                    <span>&gt;10min: Give FFP / 4F-PCC</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Alpha Angle (Fibrinogen):</span>
                    <span className="font-mono text-rose-400 font-bold">{visco.alphaAngleDegrees}&deg;</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="78"
                    step="1"
                    value={visco.alphaAngleDegrees}
                    onChange={(e) => setVisco((prev) => ({ ...prev, alphaAngleDegrees: Number(e.target.value) }))}
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Normal: 53-72&deg;</span>
                    <span>&lt;60&deg;: Give Cryoprecipitate</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Maximum Amplitude (Platelets):</span>
                    <span className="font-mono text-rose-400 font-bold">{visco.maximumAmplitudeMm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="75"
                    step="1"
                    value={visco.maximumAmplitudeMm}
                    onChange={(e) => setVisco((prev) => ({ ...prev, maximumAmplitudeMm: Number(e.target.value) }))}
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Normal: 50-70 mm</span>
                    <span>&lt;55mm: Transfuse Platelets</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">LY30 (Fibrinolysis):</span>
                    <span className="font-mono text-rose-400 font-bold">{visco.ly30Percent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.5"
                    value={visco.ly30Percent}
                    onChange={(e) => setVisco((prev) => ({ ...prev, ly30Percent: Number(e.target.value) }))}
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Normal: 0-3%</span>
                    <span>&gt;3%: Hyperfibrinolysis (TXA)</span>
                  </div>
                </div>
              </div>

              {/* Viscoelastic Guidance Box */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1.5 text-xs">
                <span className="text-[11px] font-bold text-rose-400 uppercase block">
                  Viscoelastic Goal-Directed Rx:
                </span>
                {dcrResult.viscoelasticTherapyGuidance.length > 0 ? (
                  <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
                    {dcrResult.viscoelasticTherapyGuidance.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-emerald-400 font-semibold">
                    Clot initiation, kinetics, strength, and stability are within physiologic limits.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
