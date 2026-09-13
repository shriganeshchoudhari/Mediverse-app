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
  Brain,
  Gauge,
  Info,
  ShieldAlert,
  Thermometer,
  Layers,
  ArrowRight,
  Flame,
  Pill
} from "lucide-react";
import {
  SciPatientParams,
  SpinalLesionLevel,
  AsiaImpairmentGrade,
  IncompleteCordSyndrome,
  VasopressorChoice,
  DEFAULT_SCI_PATIENT,
  simulateSpinalCordInjury
} from "../../.gemini/skills/SpinalCordInjuryEngine";

export default function SpinalCordInjurySimulator() {
  const [params, setParams] = useState<SciPatientParams>(DEFAULT_SCI_PATIENT);
  const [activeTab, setActiveTab] = useState<"hemodynamics" | "spinal_shock" | "autonomic_dysreflexia" | "asia_exam">("hemodynamics");

  const output = useMemo(() => simulateSpinalCordInjury(params), [params]);

  const updateParam = <K extends keyof SciPatientParams>(
    key: K,
    value: SciPatientParams[K]
  ) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // Case Vignettes / Presets
  const applyPreset = (
    presetKey:
      | "c5_acute_neurogenic_shock"
      | "phenylephrine_iatrogenic_hazard"
      | "norepi_map_augmented"
      | "autonomic_dysreflexia_emergency"
      | "central_cord_syndrome"
  ) => {
    switch (presetKey) {
      case "c5_acute_neurogenic_shock":
        setParams({
          ...DEFAULT_SCI_PATIENT,
          lesionLevel: "C4_C5_MID_CERVICAL",
          hoursPostInjury: 4,
          bulbocavernosusReflexPresent: false,
          sacralSensationS4S5Present: false,
          voluntaryAnalContractionPresent: false,
          motorScoreAverageBelowLesion: 0,
          sensoryScoreBelowLesion: 0,
          incompleteSyndrome: "NONE_COMPLETE_TRANSECTION",
          systolicBpMmHg: 78,
          diastolicBpMmHg: 45,
          heartRateBpm: 46,
          vasopressor: "NONE",
          vasopressorDoseMcgPerMin: 0,
          bladderDistensionFoleyKinked: false,
          fecalImpactionPresent: false,
          highDoseMethylprednisoloneAdministered: false
        });
        break;
      case "phenylephrine_iatrogenic_hazard":
        setParams({
          ...DEFAULT_SCI_PATIENT,
          lesionLevel: "C4_C5_MID_CERVICAL",
          hoursPostInjury: 6,
          bulbocavernosusReflexPresent: false,
          systolicBpMmHg: 82,
          diastolicBpMmHg: 48,
          heartRateBpm: 48,
          vasopressor: "PHENYLEPHRINE",
          vasopressorDoseMcgPerMin: 15,
          bladderDistensionFoleyKinked: false,
          fecalImpactionPresent: false,
          highDoseMethylprednisoloneAdministered: false
        });
        break;
      case "norepi_map_augmented":
        setParams({
          ...DEFAULT_SCI_PATIENT,
          lesionLevel: "C4_C5_MID_CERVICAL",
          hoursPostInjury: 12,
          bulbocavernosusReflexPresent: false,
          systolicBpMmHg: 80,
          diastolicBpMmHg: 48,
          heartRateBpm: 50,
          vasopressor: "NOREPINEPHRINE",
          vasopressorDoseMcgPerMin: 18,
          bladderDistensionFoleyKinked: false,
          fecalImpactionPresent: false,
          highDoseMethylprednisoloneAdministered: false
        });
        break;
      case "autonomic_dysreflexia_emergency":
        setParams({
          ...DEFAULT_SCI_PATIENT,
          lesionLevel: "T1_T4_UPPER_THORACIC",
          hoursPostInjury: 168,
          bulbocavernosusReflexPresent: true,
          systolicBpMmHg: 110,
          diastolicBpMmHg: 70,
          heartRateBpm: 68,
          vasopressor: "NONE",
          vasopressorDoseMcgPerMin: 0,
          bladderDistensionFoleyKinked: true,
          fecalImpactionPresent: false,
          highDoseMethylprednisoloneAdministered: false
        });
        break;
      case "central_cord_syndrome":
        setParams({
          ...DEFAULT_SCI_PATIENT,
          lesionLevel: "C6_C7_LOW_CERVICAL",
          hoursPostInjury: 24,
          bulbocavernosusReflexPresent: true,
          sacralSensationS4S5Present: true,
          voluntaryAnalContractionPresent: true,
          motorScoreAverageBelowLesion: 3.2,
          sensoryScoreBelowLesion: 1,
          incompleteSyndrome: "CENTRAL_CORD_SYNDROME",
          systolicBpMmHg: 115,
          diastolicBpMmHg: 72,
          heartRateBpm: 72,
          vasopressor: "NONE",
          vasopressorDoseMcgPerMin: 0,
          bladderDistensionFoleyKinked: false,
          fecalImpactionPresent: false,
          highDoseMethylprednisoloneAdministered: false
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
              <div className="p-2.5 bg-indigo-500/20 border border-indigo-500/40 rounded-xl text-indigo-400">
                <Brain className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-sky-300 to-rose-400 bg-clip-text text-transparent">
                  Acute Spinal Cord Injury & Neurogenic Shock Workstation
                </h1>
                <p className="text-sm text-slate-400">
                  AANS/CNS MAP Augmentation Protocol (85-90 mmHg), Neurogenic vs Spinal Shock, Bulbocavernosus Reflex (S2-S4), ASIA Impairment Scale, and Autonomic Dysreflexia Management
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Track B35 (Route #236)
            </span>
            <span className="px-3 py-1 bg-amber-950/60 border border-amber-800/60 text-amber-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> AANS/CNS MAP 85-90 Target
            </span>
            <span className="px-3 py-1 bg-rose-950/60 border border-rose-800/60 text-rose-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Bulbocavernosus (S2-S4)
            </span>
          </div>
        </div>

        {/* Case Presets Navigation */}
        <div className="mt-4 p-3 bg-slate-900/70 border border-slate-800/80 rounded-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-indigo-400" /> Clinical Vignettes & High-Yield Scenarios:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            <button
              onClick={() => applyPreset("c5_acute_neurogenic_shock")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.vasopressor === "NONE" && params.heartRateBpm === 46 && !params.bulbocavernosusReflexPresent
                  ? "bg-indigo-950/80 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>1. Acute C5 Neurogenic Shock</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-indigo-900/50 text-indigo-300 rounded">Classic</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                MAP 56, HR 46 (bradycardia dyad), absent BCR, flaccid paralysis, AIS A.
              </p>
            </button>

            <button
              onClick={() => applyPreset("phenylephrine_iatrogenic_hazard")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.vasopressor === "PHENYLEPHRINE"
                  ? "bg-rose-950/80 border-rose-500 text-rose-200 shadow-md shadow-rose-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>2. Phenylephrine Hazard</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-rose-900 text-rose-200 rounded">Pitfall</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Pure alpha-1 triggers reflex vagal bradycardia and asystolic arrest risk.
              </p>
            </button>

            <button
              onClick={() => applyPreset("norepi_map_augmented")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.vasopressor === "NOREPINEPHRINE" && output.targetMapMet
                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>3. MAP 85-90 Augmented</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-900 text-emerald-200 rounded">Guideline</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Norepinephrine titrated to MAP 86 mmHg; cord perfusion pressure restored.
              </p>
            </button>

            <button
              onClick={() => applyPreset("autonomic_dysreflexia_emergency")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.bladderDistensionFoleyKinked
                  ? "bg-amber-950/80 border-amber-500 text-amber-200 shadow-md shadow-amber-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>4. Autonomic Dysreflexia</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-900 text-amber-200 rounded">Crisis</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Kinked Foley triggers SBP &gt; 180, severe headache, flushing above T6.
              </p>
            </button>

            <button
              onClick={() => applyPreset("central_cord_syndrome")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.incompleteSyndrome === "CENTRAL_CORD_SYNDROME"
                  ? "bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>5. Central Cord Syndrome</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-cyan-900 text-cyan-200 rounded">Incomplete</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Hyperextension injury: upper &gt; lower limb weakness with sacral sparing.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Hero 4-Panel Hemodynamic & Neurologic Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Panel 1: Cord Perfusion & MAP */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-indigo-400" /> Spinal Perfusion
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.targetMapMet
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : output.meanArterialPressureMmHg < 85
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                }`}
              >
                {output.targetMapMet ? "TARGET MET (85-90)" : output.meanArterialPressureMmHg < 85 ? "ISCHEMIC THREAT" : "ELEVATED MAP"}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${output.targetMapMet ? "text-emerald-400" : output.meanArterialPressureMmHg < 85 ? "text-rose-400" : "text-amber-400"}`}>
                  {output.meanArterialPressureMmHg}
                </span>
                <span className="text-xs text-slate-400">mmHg (Systemic MAP)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">CORD PERFUSION (SCPP)</span>
                  <span className="font-bold text-sm text-cyan-300">
                    {output.spinalCordPerfusionPressureMmHg} mmHg
                  </span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">TARGET PROTOCOL</span>
                  <span className="font-bold text-sm text-indigo-300">
                    85-90 mmHg
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>AANS/CNS Duration:</span>
            <span className="font-semibold text-slate-300">7 Days (168h)</span>
          </div>
        </div>

        {/* Panel 2: Neurogenic Shock Status */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-400" /> Autonomic Shock
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.isNeurogenicShock
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                }`}
              >
                {output.isNeurogenicShock ? "NEUROGENIC SHOCK" : "NO NEUROGENIC SHOCK"}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${output.isNeurogenicShock ? "text-rose-400" : "text-emerald-400"}`}>
                  {params.heartRateBpm}
                </span>
                <span className="text-xs text-slate-400">BPM (Heart Rate)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">VASCULAR TONE</span>
                  <span className={`font-bold text-xs ${output.isNeurogenicShock ? "text-rose-300" : "text-slate-300"}`}>
                    {output.isNeurogenicShock ? "Vasodilated / Warm" : "Intact Sympathetics"}
                  </span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">BLOOD PRESSURE</span>
                  <span className="font-bold text-xs text-slate-200">
                    {params.systolicBpMmHg}/{params.diastolicBpMmHg} mmHg
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Cardioaccelerans (T1-T4):</span>
            <span className={`font-semibold ${["C1_C3_HIGH_CERVICAL", "C4_C5_MID_CERVICAL", "C6_C7_LOW_CERVICAL", "T1_T4_UPPER_THORACIC"].includes(params.lesionLevel) ? "text-rose-400" : "text-emerald-400"}`}>
              {["C1_C3_HIGH_CERVICAL", "C4_C5_MID_CERVICAL", "C6_C7_LOW_CERVICAL", "T1_T4_UPPER_THORACIC"].includes(params.lesionLevel) ? "Severed / Unopposed Vagal" : "Preserved Intact"}
            </span>
          </div>
        </div>

        {/* Panel 3: Spinal Shock & Bulbocavernosus Status */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> Spinal Shock
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.isSpinalShockActive
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/40"
                }`}
              >
                {output.isSpinalShockActive ? "SPINAL SHOCK ACTIVE" : "SPINAL SHOCK RESOLVED"}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-extrabold ${output.isSpinalShockActive ? "text-amber-400" : "text-indigo-400"}`}>
                  {output.isSpinalShockActive ? "Flaccid Areflexia" : "Spasticity / Reflexes"}
                </span>
              </div>
              <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80 mt-3 text-xs">
                <span className="text-slate-400 block text-[10px]">BULBOCAVERNOSUS REFLEX (S2-S4)</span>
                <span className={`font-bold text-sm ${params.bulbocavernosusReflexPresent ? "text-emerald-400" : "text-rose-400"}`}>
                  {params.bulbocavernosusReflexPresent ? "PRESENT (Positive)" : "ABSENT (Flaccid)"}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Reflex Arc Status:</span>
            <span className="font-semibold text-slate-300">
              {params.bulbocavernosusReflexPresent ? "Intact Sacral Arc" : "Concussed Areflexia"}
            </span>
          </div>
        </div>

        {/* Panel 4: ASIA Impairment Scale */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-cyan-400" /> ASIA Classification
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                AIS GRADE {output.asiaGrade}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-cyan-400">
                  Grade {output.asiaGrade}
                </span>
                <span className="text-xs text-slate-400">
                  {output.asiaGrade === "A" ? "Complete" : "Incomplete"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">S4-S5 SENSATION</span>
                  <span className={`font-bold text-xs ${params.sacralSensationS4S5Present ? "text-emerald-400" : "text-rose-400"}`}>
                    {params.sacralSensationS4S5Present ? "Preserved" : "Absent"}
                  </span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">VOLUNTARY ANAL (VAC)</span>
                  <span className={`font-bold text-xs ${params.voluntaryAnalContractionPresent ? "text-emerald-400" : "text-rose-400"}`}>
                    {params.voluntaryAnalContractionPresent ? "Preserved" : "Absent"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Sacral Sparing:</span>
            <span className={`font-bold ${params.sacralSensationS4S5Present || params.voluntaryAnalContractionPresent ? "text-emerald-400" : "text-rose-400"}`}>
              {params.sacralSensationS4S5Present || params.voluntaryAnalContractionPresent ? "YES (Incomplete)" : "NO (Complete)"}
            </span>
          </div>
        </div>
      </div>

      {/* Critical Clinical Alerts Strip */}
      {output.clinicalAlerts.length > 0 && (
        <div className="max-w-7xl mx-auto mb-6 space-y-2">
          {output.clinicalAlerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-start gap-3 text-xs font-medium ${
                alert.includes("PHENYLEPHRINE HAZARD") || alert.includes("AUTONOMIC DYSREFLEXIA")
                  ? "bg-rose-950/70 border-rose-600 text-rose-200 animate-pulse"
                  : alert.includes("NEUROGENIC SHOCK") || alert.includes("SUB-TARGET")
                  ? "bg-amber-950/70 border-amber-600 text-amber-200"
                  : alert.includes("OPTIMAL")
                  ? "bg-emerald-950/70 border-emerald-600 text-emerald-200"
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
            onClick={() => setActiveTab("hemodynamics")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "hemodynamics"
                ? "border-indigo-500 text-indigo-400 bg-indigo-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Gauge className="w-4 h-4" /> 1. Hemodynamics & MAP Augmentation Protocol
          </button>
          <button
            onClick={() => setActiveTab("spinal_shock")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "spinal_shock"
                ? "border-indigo-500 text-indigo-400 bg-indigo-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap className="w-4 h-4" /> 2. Neurogenic vs Spinal Shock & BCR
          </button>
          <button
            onClick={() => setActiveTab("autonomic_dysreflexia")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "autonomic_dysreflexia"
                ? "border-indigo-500 text-indigo-400 bg-indigo-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Flame className="w-4 h-4" /> 3. Autonomic Dysreflexia (AD) Crisis
          </button>
          <button
            onClick={() => setActiveTab("asia_exam")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "asia_exam"
                ? "border-indigo-500 text-indigo-400 bg-indigo-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Brain className="w-4 h-4" /> 4. ASIA Examination & Steroid Critiques
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="max-w-7xl mx-auto">
        {/* Tab 1: Hemodynamics & MAP Augmentation */}
        {activeTab === "hemodynamics" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Vasopressor & Fluid Titration */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-4">
                  <Pill className="w-5 h-5 text-indigo-400" /> Vasopressor Selection & Titration Bench
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Select Primary Vasopressor / Inotrope:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {(
                        [
                          { id: "NONE", label: "None (Off)", desc: "Fluid only" },
                          { id: "NOREPINEPHRINE", label: "Norepinephrine", desc: "First-Line (alpha1+beta1)" },
                          { id: "PHENYLEPHRINE", label: "Phenylephrine", desc: "PURE alpha1 (HAZARD)" },
                          { id: "EPINEPHRINE", label: "Epinephrine", desc: "Potent Inotrope" },
                          { id: "DOPAMINE", label: "Dopamine", desc: "Beta1 Chronotropic" }
                        ] as const
                      ).map(vaso => (
                        <button
                          key={vaso.id}
                          onClick={() => updateParam("vasopressor", vaso.id as VasopressorChoice)}
                          className={`p-2.5 rounded-xl border text-xs text-left transition ${
                            params.vasopressor === vaso.id
                              ? vaso.id === "PHENYLEPHRINE"
                                ? "bg-rose-950 border-rose-500 text-rose-200"
                                : "bg-indigo-950 border-indigo-500 text-indigo-200"
                              : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                          }`}
                        >
                          <div className="font-bold">{vaso.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{vaso.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vasopressor Dose Slider */}
                  {params.vasopressor !== "NONE" && (
                    <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Vasopressor Infusion Rate:</span>
                        <span className="font-mono font-bold text-indigo-300">
                          {params.vasopressorDoseMcgPerMin} mcg/min
                        </span>
                      </div>
                      <input aria-label="Vasopressor Infusion Rate"
                        type="range"
                        min="1"
                        max="30"
                        step="1"
                        value={params.vasopressorDoseMcgPerMin}
                        onChange={e => updateParam("vasopressorDoseMcgPerMin", parseInt(e.target.value))}
                        className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>1 mcg/min (Initiation)</span>
                        <span>15 mcg/min (Moderate)</span>
                        <span>30 mcg/min (Max titration)</span>
                      </div>
                    </div>
                  )}

                  {/* Phenylephrine Warning Banner */}
                  {output.vasopressorAssessment.reflexBradycardiaHazard && (
                    <div className="p-3 bg-rose-950/80 border border-rose-500/80 rounded-xl flex items-start gap-2.5 text-xs text-rose-200 animate-pulse">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">CRITICAL PHARMACOLOGIC PITFALL:</span>
                        Phenylephrine is a pure alpha-1 receptor agonist that lacks beta-1 cardiac inotropy/chronotropy. In cervical/high-thoracic SCI patients with loss of sympathetic cardiac accelerans fibers, peripheral vasoconstriction stimulates aortic and carotid baroreceptors, triggering unopposed vagal firing that precipitates profound reflex bradycardia and asystolic cardiac arrest. Discontinue Phenylephrine immediately and switch to balanced Norepinephrine.
                      </div>
                    </div>
                  )}

                  {/* Baseline Hemodynamics Sliders */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Systolic BP (mmHg)</label>
                      <input
                        type="number"
                        value={params.systolicBpMmHg}
                        onChange={e => updateParam("systolicBpMmHg", Math.max(50, Math.min(220, parseInt(e.target.value) || 0)))}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm font-mono text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Diastolic BP (mmHg)</label>
                      <input
                        type="number"
                        value={params.diastolicBpMmHg}
                        onChange={e => updateParam("diastolicBpMmHg", Math.max(30, Math.min(130, parseInt(e.target.value) || 0)))}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm font-mono text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Heart Rate (BPM)</label>
                      <input
                        type="number"
                        value={params.heartRateBpm}
                        onChange={e => updateParam("heartRateBpm", Math.max(25, Math.min(180, parseInt(e.target.value) || 0)))}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm font-mono text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Guidelines & Physiological Principles */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> AANS/CNS MAP Augmentation Protocol
                </h4>
                <div className="text-xs text-slate-300 space-y-2">
                  <p>
                    <strong>Guideline Target:</strong> Maintain Mean Arterial Pressure (MAP) between <strong>85 and 90 mmHg</strong> continuously for <strong>7 days (168 hours)</strong> following acute spinal cord injury.
                  </p>
                  <p>
                    <strong>Physiological Rationale:</strong> Traumatic SCI disrupts spinal cord vascular autoregulation. Cord perfusion becomes linearly dependent on systemic perfusion pressure:
                  </p>
                  <div className="p-2 bg-slate-950 rounded-lg font-mono text-[11px] text-cyan-300">
                    SCPP = MAP - CSFP (approx. 10-15 mmHg)
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Maintaining MAP &gt;= 85 mmHg prevents ischemic penumbral infarction of surviving axonal tracts, significantly improving 1-year functional motor outcomes.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-indigo-400" /> Actionable Interventions
                </h4>
                <div className="space-y-2">
                  {output.immediateInterventions.map((item, idx) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Neurogenic vs Spinal Shock & Bulbocavernosus Reflex */}
        {activeTab === "spinal_shock" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interactive BCR Exam Tool */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" /> Bulbocavernosus Reflex (S2-S4) Bedside Maneuver
              </h3>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <p className="text-xs text-slate-300">
                  The Bulbocavernosus Reflex (BCR) is a polysynaptic spinal cord reflex mediated through sacral segments <strong>S2, S3, and S4</strong> (pudendal nerve).
                </p>
                <div className="flex items-center justify-between p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Simulate Glans Penis Squeeze / Foley Catheter Tug:</span>
                    <span className="text-[11px] text-slate-400">Elicits anal sphincter contraction in intact sacral cord</span>
                  </div>
                  <button
                    onClick={() => updateParam("bulbocavernosusReflexPresent", !params.bulbocavernosusReflexPresent)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      params.bulbocavernosusReflexPresent
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                        : "bg-rose-600 hover:bg-rose-500 text-white"
                    }`}
                  >
                    {params.bulbocavernosusReflexPresent ? "BCR Present (Intact)" : "BCR Absent (Spinal Shock)"}
                  </button>
                </div>
              </div>

              {/* Status Box */}
              <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                params.bulbocavernosusReflexPresent
                  ? "bg-indigo-950/60 border-indigo-500/80 text-indigo-200"
                  : "bg-amber-950/60 border-amber-500/80 text-amber-200"
              }`}>
                <div className="font-bold flex items-center gap-2">
                  {params.bulbocavernosusReflexPresent ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
                  {params.bulbocavernosusReflexPresent ? "Spinal Shock Has Resolved" : "Spinal Shock is Active"}
                </div>
                <p>
                  {params.bulbocavernosusReflexPresent
                    ? "Return of the bulbocavernosus reflex signals that the physiological concussion/depression of distal spinal cord segments has subsided. Below-lesion reflexes will now emerge as hyperreflexia, spasticity, and pathological autonomic discharge (Autonomic Dysreflexia). Definitive ASIA neurological prognosis can now be accurately scored."
                    : "In the presence of spinal shock, total flaccid paralysis and areflexia exist below the injury level. An injury cannot be declared physiologically complete (AIS A) while the patient remains in spinal shock, as distal reflex arcs and viable axonal tracts may be temporarily silenced."}
                </p>
              </div>
            </div>

            {/* Pathophysiology Differential Matrix Table */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" /> Spinal Shock vs Neurogenic Shock Differential
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Feature</th>
                      <th className="p-2.5 text-rose-400">Neurogenic Shock</th>
                      <th className="p-2.5 text-amber-400">Spinal Shock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="p-2.5 font-bold">Domain</td>
                      <td className="p-2.5">Hemodynamic / Autonomic</td>
                      <td className="p-2.5">Neurological / Electrophysiologic</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Hallmark Triad</td>
                      <td className="p-2.5 text-rose-300">Hypotension + Bradycardia + Warm Skin</td>
                      <td className="p-2.5 text-amber-300">Flaccid Paralysis + Areflexia + Absent BCR</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Lesion Level</td>
                      <td className="p-2.5">T6 or above (loss of sympathetics)</td>
                      <td className="p-2.5">Any spinal level</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Duration</td>
                      <td className="p-2.5">Days to weeks (requires vasopressors)</td>
                      <td className="p-2.5">24-72 hours up to several weeks</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Resolution Marker</td>
                      <td className="p-2.5">Restoration of vascular tone</td>
                      <td className="p-2.5 text-emerald-400 font-semibold">Return of Bulbocavernosus Reflex</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Autonomic Dysreflexia (AD) Crisis */}
        {activeTab === "autonomic_dysreflexia" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Trigger Controls & Clinical Presentation */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500" /> Autonomic Dysreflexia (AD) Precipitating Triggers
              </h3>

              <div className="text-xs text-slate-400">
                Autonomic dysreflexia occurs in patients with spinal cord injury at or above <strong>T6</strong>, typically after spinal shock has resolved. Noxious visceral stimuli below the lesion trigger uninhibited sympathetic hyperactivity.
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">1. Bladder Distension / Kinked Foley (85% of cases):</span>
                    <span className="text-[11px] text-slate-400">Blocked urinary catheter or detrusor hyperreflexia</span>
                  </div>
                  <button
                    onClick={() => updateParam("bladderDistensionFoleyKinked", !params.bladderDistensionFoleyKinked)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      params.bladderDistensionFoleyKinked
                        ? "bg-rose-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {params.bladderDistensionFoleyKinked ? "Trigger Active" : "No Obstruction"}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">2. Fecal Impaction / Bowel Distension (10% of cases):</span>
                    <span className="text-[11px] text-slate-400">Rectal vault distension stimulating mesenteric afferents</span>
                  </div>
                  <button
                    onClick={() => updateParam("fecalImpactionPresent", !params.fecalImpactionPresent)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      params.fecalImpactionPresent
                        ? "bg-rose-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {params.fecalImpactionPresent ? "Impaction Present" : "Bowel Clear"}
                  </button>
                </div>
              </div>

              {/* Above vs Below Lesion Split View */}
              {output.autonomicDysreflexiaActive && (
                <div className="p-4 bg-rose-950/60 border border-rose-600 rounded-xl space-y-3">
                  <div className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" /> Pathognomonic Split Signs in AD
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-rose-900/40 rounded-lg border border-rose-700/60">
                      <span className="text-rose-300 font-bold block mb-1 text-[11px]">ABOVE LESION LEVEL (Parasympathetic / Vagal):</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-200 text-[11px]">
                        {output.adSymptomsAboveLesion.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                      <span className="text-cyan-300 font-bold block mb-1 text-[11px]">BELOW LESION LEVEL (Uninhibited Sympathetic):</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                        {output.adSymptomsBelowLesion.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Step-by-Step Emergency Management Protocol */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" /> Acute AD Emergency Step-by-Step Protocol
              </h3>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-2.5">
                  <span className="font-bold text-amber-400 shrink-0 text-sm">1.</span>
                  <div>
                    <strong className="text-slate-100 block">Sit Patient Upright (90 degrees):</strong>
                    Immediately elevate the head of the bed and lower legs over the edge to induce orthostatic pooling of blood in the splanchnic and lower extremity vascular bed, immediately lowering cerebral blood pressure.
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-2.5">
                  <span className="font-bold text-amber-400 shrink-0 text-sm">2.</span>
                  <div>
                    <strong className="text-slate-100 block">Loosen Constrictive Clothing:</strong>
                    Remove abdominal binders, compression stockings, tight belts, or footwear that may provide continuing tactile afferent stimulation.
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-2.5">
                  <span className="font-bold text-amber-400 shrink-0 text-sm">3.</span>
                  <div>
                    <strong className="text-slate-100 block">Check Urinary Drainage (STAT):</strong>
                    Assess Foley catheter for kinks, occlusion, or bag overfill. If blocked, gently irrigate with 30 mL sterile saline. If no flow, immediately replace the catheter using generous 2% lidocaine lubricant.
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-2.5">
                  <span className="font-bold text-amber-400 shrink-0 text-sm">4.</span>
                  <div>
                    <strong className="text-slate-100 block">Digital Rectal Evacuation:</strong>
                    If bladder is decompression confirmed but BP remains elevated, perform gentle digital rectal examination using copious 2% lidocaine jelly to avoid exacerbating reflex dysreflexia.
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-2.5">
                  <span className="font-bold text-amber-400 shrink-0 text-sm">5.</span>
                  <div>
                    <strong className="text-slate-100 block">Parenteral Antihypertensive Rescue:</strong>
                    If SBP &gt; 150 mmHg persists despite removing triggers: Apply Nitropaste (1 inch transdermal) or administer oral Nifedipine (immediate release 10 mg bite-and-swallow) or IV Nicardipine/Hydralazine.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: ASIA Examination & Steroid Critiques */}
        {activeTab === "asia_exam" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: ASIA Examination Scores */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" /> ASIA Impairment Scale (AIS) Exam Calculator
              </h3>

              <div className="space-y-4">
                {/* Lesion Level Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Neurological Lesion Level:</label>
                  <select
                    value={params.lesionLevel}
                    onChange={e => updateParam("lesionLevel", e.target.value as SpinalLesionLevel)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono"
                  >
                    <option value="C1_C3_HIGH_CERVICAL">C1-C3: High Cervical (Ventilator Dependent, Loss of Phrenic C3-C5)</option>
                    <option value="C4_C5_MID_CERVICAL">C4-C5: Mid Cervical (Partial Diaphragm, Quadriplegia)</option>
                    <option value="C6_C7_LOW_CERVICAL">C6-C7: Low Cervical (Wrist Extension / Triceps Partial)</option>
                    <option value="T1_T4_UPPER_THORACIC">T1-T4: Upper Thoracic (Paraplegia, Sympathetic Cardiac Loss)</option>
                    <option value="T6_MID_THORACIC">T6: Mid Thoracic (Watershed Level for Autonomic Dysreflexia)</option>
                    <option value="T10_T12_LOWER_THORACIC">T10-T12: Lower Thoracic (Cardiac Sympathetics Intact)</option>
                    <option value="L1_L2_LUMBAR">L1-L2: Lumbar / Conus Medullaris</option>
                    <option value="CAUDA_EQUINA_L3_S5">L3-S5: Cauda Equina (LMN Areflexia, Saddle Anesthesia)</option>
                  </select>
                </div>

                {/* Sacral Sparing S4-S5 Toggles */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">Sacral Sparing S4-S5 (Key Determinant of Incomplete SCI):</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateParam("sacralSensationS4S5Present", !params.sacralSensationS4S5Present)}
                      className={`p-2 rounded-lg text-xs font-semibold transition border ${
                        params.sacralSensationS4S5Present
                          ? "bg-emerald-950 border-emerald-500 text-emerald-300"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      S4-S5 Sensory: {params.sacralSensationS4S5Present ? "Preserved" : "Absent"}
                    </button>
                    <button
                      onClick={() => updateParam("voluntaryAnalContractionPresent", !params.voluntaryAnalContractionPresent)}
                      className={`p-2 rounded-lg text-xs font-semibold transition border ${
                        params.voluntaryAnalContractionPresent
                          ? "bg-emerald-950 border-emerald-500 text-emerald-300"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      Voluntary Anal: {params.voluntaryAnalContractionPresent ? "Preserved" : "Absent"}
                    </button>
                  </div>
                </div>

                {/* Motor Score Below Lesion Slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Average Motor Strength Below Lesion:</span>
                    <span className="font-bold text-cyan-300">Grade {params.motorScoreAverageBelowLesion}/5</span>
                  </div>
                  <input aria-label="Grade {params.motorScoreAverageBelowLesion}/5"
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={params.motorScoreAverageBelowLesion}
                    onChange={e => updateParam("motorScoreAverageBelowLesion", parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0 (Plegic)</span>
                    <span>&lt; 3 (Non-functional)</span>
                    <span>&gt;= 3 (Anti-gravity)</span>
                    <span>5 (Normal)</span>
                  </div>
                </div>

                {/* Incomplete Cord Syndrome Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Incomplete Syndrome Pattern:</label>
                  <select
                    value={params.incompleteSyndrome}
                    onChange={e => updateParam("incompleteSyndrome", e.target.value as IncompleteCordSyndrome)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono"
                  >
                    <option value="NONE_COMPLETE_TRANSECTION">Standard Transection</option>
                    <option value="CENTRAL_CORD_SYNDROME">Central Cord Syndrome (Upper &gt; Lower)</option>
                    <option value="ANTERIOR_CORD_SYNDROME">Anterior Cord Syndrome (Motor/Pain loss, Dorsal spared)</option>
                    <option value="BROWN_SEQUARD_SYNDROME">Brown-Séquard Syndrome (Hemicord)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right: NASCIS Methylprednisolone Controversy & AIS Output */}
            <div className="space-y-4">
              {/* AIS Score Summary Card */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Computed AIS Grade:</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    Grade {output.asiaGrade}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-200">
                  {output.asiaGradeDescription}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  <strong>Prognosis:</strong> {output.functionalPrognosis}
                </p>
              </div>

              {/* High-Dose Steroid Warning */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" /> High-Dose Methylprednisolone (NASCIS Protocol)
                  </h4>
                  <button
                    onClick={() => updateParam("highDoseMethylprednisoloneAdministered", !params.highDoseMethylprednisoloneAdministered)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      params.highDoseMethylprednisoloneAdministered
                        ? "bg-rose-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {params.highDoseMethylprednisoloneAdministered ? "Steroid Administered" : "No Steroids (Standard)"}
                  </button>
                </div>

                <div className="text-xs text-slate-300 space-y-2">
                  <p>
                    <strong>AANS/CNS & CNS Guidelines (Class III Evidence):</strong> Routine high-dose methylprednisolone (NASCIS II: 30 mg/kg IV bolus + 5.4 mg/kg/h for 24-48h) is <strong>NOT recommended</strong>.
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Large multicenter trials confirmed high-dose steroids fail to produce meaningful neurological or functional recovery, while significantly multiplying lethal complications:
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                    <div className={`p-2 rounded-lg border text-center ${params.highDoseMethylprednisoloneAdministered ? "bg-rose-950/80 border-rose-600 text-rose-300 font-bold" : "bg-slate-950 border-slate-800 text-slate-400"}`}>
                      Sepsis: {output.steroidAdverseOutcomes.sepsisRiskMultiplier}x
                    </div>
                    <div className={`p-2 rounded-lg border text-center ${params.highDoseMethylprednisoloneAdministered ? "bg-rose-950/80 border-rose-600 text-rose-300 font-bold" : "bg-slate-950 border-slate-800 text-slate-400"}`}>
                      Pneumonia: {output.steroidAdverseOutcomes.pneumoniaRiskMultiplier}x
                    </div>
                    <div className={`p-2 rounded-lg border text-center ${params.highDoseMethylprednisoloneAdministered ? "bg-rose-950/80 border-rose-600 text-rose-300 font-bold" : "bg-slate-950 border-slate-800 text-slate-400"}`}>
                      GI Bleed: {output.steroidAdverseOutcomes.giBleedRiskMultiplier}x
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
