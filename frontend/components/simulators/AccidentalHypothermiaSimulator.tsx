"use client";

import React, { useState, useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  Stethoscope,
  Zap,
  CheckCircle2,
  AlertCircle,
  Droplets,
  Heart,
  Gauge,
  Info,
  ShieldAlert,
  Thermometer,
  Layers,
  ArrowRight,
  Flame,
  Pill,
  Clock
} from "lucide-react";
import {
  HypothermiaPatientParams,
  SwissHypothermiaStage,
  CardiacRhythmHypothermia,
  RewarmingMethod,
  DEFAULT_HYPOTHERMIA_PATIENT,
  simulateAccidentalHypothermia
} from "../../.gemini/skills/AccidentalHypothermiaEngine";

export default function AccidentalHypothermiaSimulator() {
  const [params, setParams] = useState<HypothermiaPatientParams>(DEFAULT_HYPOTHERMIA_PATIENT);
  const [activeTab, setActiveTab] = useState<"staging" | "afterdrop" | "acls_osborn" | "ecls_hope">("staging");

  const output = useMemo(() => simulateAccidentalHypothermia(params), [params]);

  const updateParam = <K extends keyof HypothermiaPatientParams>(
    key: K,
    value: HypothermiaPatientParams[K]
  ) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // Case Vignettes / Presets
  const applyPreset = (
    presetKey:
      | "stage_3_severe_osborn"
      | "afterdrop_extremity_pitfall"
      | "hypothermic_arrest_ecmo"
      | "rewarming_shock_cold_diuresis"
      | "irreversible_death_hyperkalemia"
  ) => {
    switch (presetKey) {
      case "stage_3_severe_osborn":
        setParams({
          ...DEFAULT_HYPOTHERMIA_PATIENT,
          coreTemperatureCelsius: 26.5,
          initialExposureCause: "COLD_AIR_EXPOSURE",
          shiveringPresent: false,
          mentalStatus: "UNCONSCIOUS_COMATOSE",
          cardiacRhythm: "SINUS_BRADYCARDIA_WITH_OSBORN_J_WAVES",
          heartRateBpm: 34,
          systolicBpMmHg: 75,
          diastolicBpMmHg: 42,
          serumPotassiumMmolPerL: 4.6,
          rewarmingTechnique: "ACTIVE_INTERNAL_CORE_FLUIDS",
          warmIvFluidsAdministeredMl: 1000,
          aclsEpinephrineGivenBelow30C: false,
          defibrillationAttemptsCount: 0
        });
        break;
      case "afterdrop_extremity_pitfall":
        setParams({
          ...DEFAULT_HYPOTHERMIA_PATIENT,
          coreTemperatureCelsius: 27.0,
          shiveringPresent: false,
          cardiacRhythm: "VENTRICULAR_FIBRILLATION_FINE",
          heartRateBpm: 0,
          rewarmingTechnique: "ACTIVE_EXTERNAL_EXTREMITIES_TRAP", // Triggers severe afterdrop!
          warmIvFluidsAdministeredMl: 500,
          aclsEpinephrineGivenBelow30C: false,
          defibrillationAttemptsCount: 1
        });
        break;
      case "hypothermic_arrest_ecmo":
        setParams({
          ...DEFAULT_HYPOTHERMIA_PATIENT,
          coreTemperatureCelsius: 21.0,
          shiveringPresent: false,
          mentalStatus: "UNCONSCIOUS_COMATOSE",
          cardiacRhythm: "ASYSTOLE",
          heartRateBpm: 0,
          systolicBpMmHg: 0,
          diastolicBpMmHg: 0,
          serumPotassiumMmolPerL: 5.2,
          cprDurationMinutes: 45,
          rewarmingTechnique: "EXTRACORPOREAL_ECLS_VA_ECMO",
          warmIvFluidsAdministeredMl: 1500,
          aclsEpinephrineGivenBelow30C: false,
          defibrillationAttemptsCount: 2
        });
        break;
      case "rewarming_shock_cold_diuresis":
        setParams({
          ...DEFAULT_HYPOTHERMIA_PATIENT,
          coreTemperatureCelsius: 31.0,
          shiveringPresent: false,
          cardiacRhythm: "SINUS_BRADYCARDIA_WITH_OSBORN_J_WAVES",
          heartRateBpm: 48,
          systolicBpMmHg: 68, // Shock!
          diastolicBpMmHg: 38,
          rewarmingTechnique: "ACTIVE_EXTERNAL_TRUNK_BAIR",
          warmIvFluidsAdministeredMl: 200, // Insufficient fluid replacement for cold diuresis
          aclsEpinephrineGivenBelow30C: false,
          defibrillationAttemptsCount: 0
        });
        break;
      case "irreversible_death_hyperkalemia":
        setParams({
          ...DEFAULT_HYPOTHERMIA_PATIENT,
          coreTemperatureCelsius: 22.0,
          cardiacRhythm: "ASYSTOLE",
          serumPotassiumMmolPerL: 14.5, // Extreme hyperkalemia > 12 indicates irreversible cell lysis
          rewarmingTechnique: "PASSIVE_EXTERNAL_ONLY",
          warmIvFluidsAdministeredMl: 0,
          aclsEpinephrineGivenBelow30C: false,
          defibrillationAttemptsCount: 0
        });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-500/20 border border-sky-500/40 rounded-xl text-sky-400">
                <Thermometer className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-sky-400 via-indigo-300 to-rose-400 bg-clip-text text-transparent">
                  Severe Accidental Hypothermia & ECLS Rewarming Workstation
                </h1>
                <p className="text-sm text-slate-400">
                  Swiss Clinical Staging (HT I-IV), "Not Dead Until Warm and Dead" (32-35°C), Afterdrop Biophysics, Osborn (J) Waves, Modified ACLS, and Extracorporeal VA-ECMO
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-sky-950/60 border border-sky-800/60 text-sky-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Track B37 (Route #238)
            </span>
            <span className="px-3 py-1 bg-amber-950/60 border border-amber-800/60 text-amber-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Swiss Staging (HT I-IV)
            </span>
            <span className="px-3 py-1 bg-rose-950/60 border border-rose-800/60 text-rose-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" /> Warm & Dead Rule (32-35°C)
            </span>
          </div>
        </div>

        {/* Case Presets Navigation */}
        <div className="mt-4 p-3 bg-slate-900/70 border border-slate-800/80 rounded-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-sky-400" /> Clinical Scenarios & High-Yield Vignettes:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            <button
              onClick={() => applyPreset("stage_3_severe_osborn")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.coreTemperatureCelsius === 26.5 && !output.afterdropActive
                  ? "bg-sky-950/80 border-sky-500 text-sky-200 shadow-md shadow-sky-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>1. Stage III Severe (26.5°C)</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-sky-900/50 text-sky-300 rounded">Severe</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Unconscious, HR 34, Osborn J waves, extreme irritability, gentle handling.
              </p>
            </button>

            <button
              onClick={() => applyPreset("afterdrop_extremity_pitfall")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.rewarmingTechnique === "ACTIVE_EXTERNAL_EXTREMITIES_TRAP"
                  ? "bg-rose-950/80 border-rose-500 text-rose-200 shadow-md shadow-rose-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>2. The Afterdrop Pitfall</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-rose-900 text-rose-200 rounded">Pitfall</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Heating arms/legs shunts cold blood to heart; core drops 1.6°C into VF.
              </p>
            </button>

            <button
              onClick={() => applyPreset("hypothermic_arrest_ecmo")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.rewarmingTechnique === "EXTRACORPOREAL_ECLS_VA_ECMO"
                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>3. Arrest & ECLS Rewarming</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-900 text-emerald-200 rounded">VA-ECMO</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                21°C arrest, CPR active, rapid 8°C/h ECLS rewarming, HOPE survival 80%.
              </p>
            </button>

            <button
              onClick={() => applyPreset("rewarming_shock_cold_diuresis")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                output.rewarmingShockDetected
                  ? "bg-amber-950/80 border-amber-500 text-amber-200 shadow-md shadow-amber-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>4. Rewarming Shock</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-900 text-amber-200 rounded">Collapse</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Cold diuresis hypovolemia + vasodilation drops BP to 68; warm IV fluids needed.
              </p>
            </button>

            <button
              onClick={() => applyPreset("irreversible_death_hyperkalemia")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.serumPotassiumMmolPerL > 12.0
                  ? "bg-red-950/80 border-red-500 text-red-200 shadow-md shadow-red-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>5. Irreversible Death (K&gt;12)</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-red-900 text-red-200 rounded">Stage V</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                K 14.5 mmol/L proves cellular lysis; HOPE 0%, termination warranted.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Hero 4-Panel Hemodynamic & Thermal Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Panel 1: Core Temperature & Swiss Stage */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-sky-400" /> Core Temperature
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.swissStage === "STAGE_I_MILD"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : output.swissStage === "STAGE_II_MODERATE"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : output.swissStage === "STAGE_III_SEVERE"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                    : "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                }`}
              >
                {output.swissStage.replace("STAGE_", "").replace("_", " ")}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${params.coreTemperatureCelsius < 28 ? "text-rose-400" : params.coreTemperatureCelsius < 32 ? "text-amber-400" : "text-sky-400"}`}>
                  {params.coreTemperatureCelsius}°C
                </span>
                <span className="text-xs text-slate-400">({((params.coreTemperatureCelsius * 9) / 5 + 32).toFixed(1)}°F)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">CEREBRAL METABOLISM</span>
                  <span className="font-bold text-sm text-cyan-300">
                    {(output.cerebralMetabolicRateFraction * 100).toFixed(0)}% CMRO2
                  </span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">WARM & DEAD RULE</span>
                  <span className={`font-bold text-xs ${output.warmAndDeadDictumMet ? "text-emerald-400" : "text-rose-400"}`}>
                    {output.warmAndDeadDictumMet ? "MET (>= 32°C)" : "RESUSCITATE (<32°C)"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Shivering Reflex:</span>
            <span className={`font-semibold ${params.shiveringPresent ? "text-emerald-400" : "text-slate-400"}`}>
              {params.shiveringPresent ? "Active (Stage I)" : "Ceased (< 30-32°C)"}
            </span>
          </div>
        </div>

        {/* Panel 2: Cardiac Rhythm & Osborn Waves */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-400" /> Cardiac Rhythm
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  params.cardiacRhythm === "ASYSTOLE" || params.cardiacRhythm === "VENTRICULAR_FIBRILLATION_FINE"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                }`}
              >
                {params.cardiacRhythm === "ASYSTOLE" ? "CARDIAC ARREST" : params.cardiacRhythm === "VENTRICULAR_FIBRILLATION_FINE" ? "VF ARREST" : "PERFUSING RHYTHM"}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${params.heartRateBpm === 0 ? "text-rose-400" : "text-sky-400"}`}>
                  {params.heartRateBpm}
                </span>
                <span className="text-xs text-slate-400">BPM (Heart Rate)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">OSBORN (J) WAVE</span>
                  <span className={`font-bold text-sm ${output.osbornJWaveProminenceMm > 0 ? "text-amber-300" : "text-slate-400"}`}>
                    {output.osbornJWaveProminenceMm > 0 ? `${output.osbornJWaveProminenceMm} mm` : "None"}
                  </span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">MYOCARDIAL STABILITY</span>
                  <span className={`font-bold text-xs ${params.coreTemperatureCelsius < 28 ? "text-rose-400" : "text-slate-300"}`}>
                    {params.coreTemperatureCelsius < 28 ? "EXTREME VF RISK" : "Stable"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Handling Protocol:</span>
            <span className="font-semibold text-amber-400">Gentle Movement Only</span>
          </div>
        </div>

        {/* Panel 3: Rewarming Kinetics & Afterdrop */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" /> Rewarming Kinetics
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.afterdropActive
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                }`}
              >
                {output.afterdropActive ? "AFTERDROP ACTIVE" : "REWARMING ACTIVE"}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${output.effectiveRewarmingRateDegreesPerHour < 0 ? "text-rose-400" : "text-emerald-400"}`}>
                  {output.effectiveRewarmingRateDegreesPerHour > 0 ? `+${output.effectiveRewarmingRateDegreesPerHour}` : output.effectiveRewarmingRateDegreesPerHour}
                </span>
                <span className="text-xs text-slate-400">°C / hour</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">AFTERDROP DEFICIT</span>
                  <span className={`font-bold text-xs ${output.afterdropActive ? "text-rose-400 font-bold" : "text-emerald-400"}`}>
                    {output.afterdropActive ? `-${output.afterdropCoreTempFallDegrees}°C` : "0.0°C (Safe)"}
                  </span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">REWARMING SHOCK</span>
                  <span className={`font-bold text-xs ${output.rewarmingShockDetected ? "text-rose-400" : "text-emerald-400"}`}>
                    {output.rewarmingShockDetected ? "SHOCK DETECTED" : "Perfusion Stable"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Method:</span>
            <span className="font-semibold text-slate-300 truncate block text-[10px]">
              {params.rewarmingTechnique.replace("ACTIVE_", "").replace("PASSIVE_", "")}
            </span>
          </div>
        </div>

        {/* Panel 4: HOPE Survival & Potassium */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> HOPE Survival Score
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.isPotassiumLethalThresholdMet
                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                    : output.hopeScoreSurvivalProbabilityPercent >= 50
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                }`}
              >
                {output.isPotassiumLethalThresholdMet ? "IRREVERSIBLE DEATH" : `${output.hopeScoreSurvivalProbabilityPercent}% SURVIVAL`}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${output.isPotassiumLethalThresholdMet ? "text-red-400" : "text-cyan-400"}`}>
                  {output.hopeScoreSurvivalProbabilityPercent}%
                </span>
                <span className="text-xs text-slate-400">ECLS Recovery Odds</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">SERUM POTASSIUM</span>
                  <span className={`font-bold text-sm ${params.serumPotassiumMmolPerL > 12.0 ? "text-rose-400" : "text-cyan-300"}`}>
                    {params.serumPotassiumMmolPerL} mmol/L
                  </span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">LETHAL CUTOFF</span>
                  <span className="font-bold text-xs text-rose-300">
                    &gt; 12.0 mmol/L
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Cell Lysis Status:</span>
            <span className={`font-bold ${output.isPotassiumLethalThresholdMet ? "text-rose-400" : "text-emerald-400"}`}>
              {output.isPotassiumLethalThresholdMet ? "Cellular Lysis (Death)" : "Viable Cell Membranes"}
            </span>
          </div>
        </div>
      </div>

      {/* Clinical Alerts Strip */}
      {output.clinicalAlerts.length > 0 && (
        <div className="max-w-7xl mx-auto mb-6 space-y-2">
          {output.clinicalAlerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-start gap-3 text-xs font-medium ${
                alert.includes("AFTERDROP") || alert.includes("ACLS PITFALL") || alert.includes("LETHAL POTASSIUM")
                  ? "bg-rose-950/70 border-rose-600 text-rose-200 animate-pulse"
                  : alert.includes("REWARMING SHOCK") || alert.includes("DEFIBRILLATION LIMIT")
                  ? "bg-amber-950/70 border-amber-600 text-amber-200"
                  : alert.includes("PATHOGNOMONIC") || alert.includes("ECLS / VA-ECMO")
                  ? "bg-sky-950/70 border-sky-600 text-sky-200"
                  : "bg-indigo-950/70 border-indigo-600 text-indigo-200"
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{alert}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main Interactive Tab Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex border-b border-slate-800 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab("staging")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "staging"
                ? "border-sky-500 text-sky-400 bg-sky-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Thermometer className="w-4 h-4" /> 1. Swiss Staging & "Warm and Dead" Protocol
          </button>
          <button
            onClick={() => setActiveTab("afterdrop")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "afterdrop"
                ? "border-sky-500 text-sky-400 bg-sky-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Flame className="w-4 h-4" /> 2. Biophysics of Afterdrop & Rewarming Shock
          </button>
          <button
            onClick={() => setActiveTab("acls_osborn")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "acls_osborn"
                ? "border-sky-500 text-sky-400 bg-sky-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap className="w-4 h-4" /> 3. Modified ACLS & Osborn (J) Waves
          </button>
          <button
            onClick={() => setActiveTab("ecls_hope")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "ecls_hope"
                ? "border-sky-500 text-sky-400 bg-sky-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> 4. ECLS / VA-ECMO & HOPE Score
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="max-w-7xl mx-auto">
        {/* Tab 1: Swiss Staging & Warm and Dead */}
        {activeTab === "staging" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-sky-400" /> Core Temperature & Clinical Status
                </h3>

                {/* Temperature Slider */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Esophageal / Tympanic Core Temperature:</span>
                    <span className="font-mono font-bold text-sky-300 text-base">
                      {params.coreTemperatureCelsius}°C ({((params.coreTemperatureCelsius * 9) / 5 + 32).toFixed(1)}°F)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="18.0"
                    max="37.0"
                    step="0.5"
                    value={params.coreTemperatureCelsius}
                    onChange={e => updateParam("coreTemperatureCelsius", parseFloat(e.target.value))}
                    className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>&lt; 24°C (Stage IV Arrest)</span>
                    <span>24-28°C (Stage III Severe)</span>
                    <span>28-32°C (Stage II Moderate)</span>
                    <span>32-35°C (Stage I Mild)</span>
                  </div>
                </div>

                {/* Swiss Stage Card */}
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <span className="font-bold text-slate-300 uppercase tracking-wider block text-[10px]">Swiss Clinical Staging Definition:</span>
                  <div className="text-sm font-bold text-sky-300">{output.swissStageLabel}</div>
                </div>

                {/* Potassium & Shivering Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Serum Potassium:</span>
                      <span className={`font-mono font-bold ${params.serumPotassiumMmolPerL > 12.0 ? "text-rose-400" : "text-slate-200"}`}>
                        {params.serumPotassiumMmolPerL} mmol/L
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2.5"
                      max="18.0"
                      step="0.5"
                      value={params.serumPotassiumMmolPerL}
                      onChange={e => updateParam("serumPotassiumMmolPerL", parseFloat(e.target.value))}
                      className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">Death cutoff &gt; 12.0 mmol/L (&gt; 8 in avalanche)</span>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Cardiac Rhythm:</label>
                    <select
                      value={params.cardiacRhythm}
                      onChange={e => updateParam("cardiacRhythm", e.target.value as CardiacRhythmHypothermia)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono"
                    >
                      <option value="SINUS_BRADYCARDIA_WITH_OSBORN_J_WAVES">Sinus Bradycardia + Osborn J Waves</option>
                      <option value="SLOW_ATRIAL_FIBRILLATION">Slow Atrial Fibrillation</option>
                      <option value="VENTRICULAR_FIBRILLATION_FINE">Fine Ventricular Fibrillation</option>
                      <option value="ASYSTOLE">Asystole (Cardiac Arrest)</option>
                      <option value="NORMAL_SINUS_RHYTHM">Normal Sinus Rhythm</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: "Warm and Dead" Rule */}
            <div className="space-y-4">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-500" /> "No One is Dead Until Warm and Dead"
                </h4>
                <div className="text-xs text-slate-300 space-y-2">
                  <p>
                    <strong>Cerebral Cryoprotection:</strong> For every 1°C drop in core temperature, cerebral metabolic rate of oxygen (CMRO2) decreases by <strong>6% to 7%</strong>.
                  </p>
                  <p>
                    At 20°C, the brain consumes only ~25% of baseline oxygen, allowing prolonged tolerance to complete circulatory arrest without ischemic necrosis.
                  </p>
                  <div className="p-2.5 bg-rose-950/60 border border-rose-800 rounded-xl text-[11px] text-rose-200">
                    Resuscitation must not be abandoned until the patient has been active core-rewarmed to at least <strong>32°C to 35°C</strong> without return of spontaneous circulation, unless lethal hyperkalemia (K &gt; 12 mmol/L) is proven.
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-sky-400" /> Actionable Resuscitation Directives
                </h4>
                {output.therapeuticDirectives.map((d, idx) => (
                  <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Afterdrop & Rewarming Shock */}
        {activeTab === "afterdrop" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rewarming Method Selector */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" /> Rewarming Method & Afterdrop Mechanics
              </h3>

              <div className="space-y-2">
                {(
                  [
                    { id: "ACTIVE_INTERNAL_CORE_FLUIDS", label: "Active Internal Core Rewarming", desc: "Warm humidified O2 + 42°C IV crystalloids (2-3.5°C/h)", safe: true },
                    { id: "ACTIVE_EXTERNAL_TRUNK_BAIR", label: "Active External TRUNK Forced-Air (Bair)", desc: "Trunk/torso warming only; limbs left cool (1.5-2.5°C/h)", safe: true },
                    { id: "ACTIVE_EXTERNAL_EXTREMITIES_TRAP", label: "Active External EXTREMITIES Warming", desc: "HAZARD: Actively warming arms/legs triggers lethal AFTERDROP!", safe: false },
                    { id: "EXTRACORPOREAL_ECLS_VA_ECMO", label: "Extracorporeal Life Support (VA-ECMO)", desc: "Gold standard for Stage IV arrest; 6-10°C/h core flow", safe: true },
                    { id: "CLOSED_CAVITY_LAVAGE", label: "Closed Thoracic / Peritoneal Lavage", desc: "Two chest tubes warm saline continuous lavage (3-5°C/h)", safe: true },
                    { id: "PASSIVE_EXTERNAL_ONLY", label: "Passive External (Blankets & Room)", desc: "Relies on shivering endogenesis; slow (0.5-1°C/h)", safe: true }
                  ] as const
                ).map(item => (
                  <button
                    key={item.id}
                    onClick={() => updateParam("rewarmingTechnique", item.id as RewarmingMethod)}
                    className={`p-3 rounded-xl border text-left text-xs w-full transition ${
                      params.rewarmingTechnique === item.id
                        ? item.safe
                          ? "bg-sky-950 border-sky-500 text-sky-200"
                          : "bg-rose-950 border-rose-500 text-rose-200"
                        : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{item.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.safe ? "bg-sky-900/50 text-sky-300" : "bg-rose-900 text-rose-200"}`}>
                        {item.safe ? "Approved" : "LETHAL PITFALL"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Biophysics Explanation Card */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-rose-400" /> Rewarming Shock & Cold Diuresis
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <strong className="text-slate-100 block mb-1">Cold Diuresis Mechanism:</strong>
                  Peripheral vasoconstriction shunts blood centrally, which the atria interpret as hypervolemia. Atrial natriuretic peptide (ANP) surges and ADH is inhibited, causing severe "cold diuresis" and profound volume depletion.
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <strong className="text-slate-100 block mb-1">Rewarming Shock Phenomenon:</strong>
                  As external rewarming dilates peripheral capillary beds, vascular capacitance multiplies. Without proactive warmed IV volume resuscitation, acute vasodilatory shock and cardiovascular collapse occur.
                </div>

                {/* IV Fluids Administered Slider */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Warmed (40-42°C) IV Crystalloids:</span>
                    <span className="font-mono font-bold text-cyan-300">{params.warmIvFluidsAdministeredMl} mL</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4000"
                    step="250"
                    value={params.warmIvFluidsAdministeredMl}
                    onChange={e => updateParam("warmIvFluidsAdministeredMl", parseInt(e.target.value))}
                    className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0 mL (Severe Shock Risk)</span>
                    <span>1500 mL (Resuscitated)</span>
                    <span>4000 mL (Fluid Loaded)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Modified ACLS & Osborn Waves */}
        {activeTab === "acls_osborn" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Modified ACLS Protocol Bench */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" /> Modified ACLS Guidelines in Hypothermia
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="font-bold text-slate-200 block">Epinephrine Administered Below 30°C:</span>
                    <span className="text-[11px] text-slate-400">Contraindicated due to drug accumulation</span>
                  </div>
                  <button
                    onClick={() => updateParam("aclsEpinephrineGivenBelow30C", !params.aclsEpinephrineGivenBelow30C)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      params.aclsEpinephrineGivenBelow30C
                        ? "bg-rose-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {params.aclsEpinephrineGivenBelow30C ? "Given (PITFALL)" : "Withheld (Safe)"}
                  </button>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <strong className="text-slate-100 block">AHA/ERC Hypothermia ACLS Rules:</strong>
                  <p>&bull; <strong>Core Temp &lt; 30°C:</strong> Withhold all IV epinephrine and antiarrhythmics. Maximum 3 defibrillation shocks for VF; defer further shocks until temp &ge; 30°C.</p>
                  <p>&bull; <strong>Core Temp 30-35°C:</strong> Double the interval between epinephrine doses (give every 6-10 min instead of standard 3-5 min).</p>
                  <p>&bull; <strong>Core Temp &ge; 35°C:</strong> Standard ACLS dosing intervals resume.</p>
                </div>
              </div>
            </div>

            {/* Osborn (J) Wave Analysis */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-400" /> Osborn (J) Wave Morphology
              </h3>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Deflection Amplitude:</span>
                  <span className="font-mono font-bold text-amber-300 text-sm">
                    {output.osbornJWaveProminenceMm} mm
                  </span>
                </div>
                <p className="text-slate-300">
                  The Osborn (J) wave is a distinctive positive notch occurring at the junction between the QRS complex and the ST segment. Its amplitude correlates directly with the depth of hypothermia.
                </p>
                <div className="p-2.5 bg-slate-900 rounded-lg text-[11px] text-slate-400">
                  Etiology: Caused by a disproportionate repolarization delay in epicardial vs endocardial myocardium, creating a transmural voltage gradient. Disappears completely upon rewarming to &gt; 32-35°C.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: ECLS / VA-ECMO & HOPE Score */}
        {activeTab === "ecls_hope" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" /> Extracorporeal VA-ECMO Rewarming
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <strong className="text-slate-100 block mb-1">Femoro-Femoral VA-ECMO Cannulation:</strong>
                  Extracorporeal circuit provides full 4-5 L/min systemic perfusion, taking over for the fibrillating/asystolic heart while heating blood via a dedicated heat exchanger.
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <strong className="text-slate-100 block mb-1">Target Rewarming Velocity:</strong>
                  Maintain rewarming rate between <strong>6°C and 10°C per hour</strong>. Avoid hyperthermia (&gt; 37°C) post-resuscitation to prevent secondary reperfusion hyperthermic brain injury.
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-emerald-400" /> HOPE Survival Calculator
              </h3>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Predicted Intact Neurological Survival:</span>
                  <span className={`font-extrabold text-base ${output.hopeScoreSurvivalProbabilityPercent >= 50 ? "text-emerald-400" : "text-rose-400"}`}>
                    {output.hopeScoreSurvivalProbabilityPercent}%
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 transition-all duration-500 ${
                      output.hopeScoreSurvivalProbabilityPercent >= 50
                        ? "bg-emerald-500"
                        : output.hopeScoreSurvivalProbabilityPercent >= 25
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${output.hopeScoreSurvivalProbabilityPercent}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-400 space-y-1">
                  <p>&bull; HOPE Score validated for hypothermic arrest undergoing ECLS rewarming.</p>
                  <p>&bull; Serum Potassium is the single strongest negative prognosticator.</p>
                  <p>&bull; Patients with CPR &gt; 3-4 hours have walked out of the hospital neurologically intact when rewarmed on VA-ECMO.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
