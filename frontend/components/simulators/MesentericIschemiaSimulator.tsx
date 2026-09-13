"use client";

import React, { useState, useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  Stethoscope,
  Scissors,
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
  Scan,
  Clock
} from "lucide-react";
import {
  MesentericPatientParams,
  MesentericIschemiaSubtype,
  DiagnosticImagingModality,
  RevascularizationIntervention,
  DEFAULT_MESENTERIC_PATIENT,
  simulateMesentericIschemia
} from "../../.gemini/skills/MesentericIschemiaEngine";

export default function MesentericIschemiaSimulator() {
  const [params, setParams] = useState<MesentericPatientParams>(DEFAULT_MESENTERIC_PATIENT);
  const [activeTab, setActiveTab] = useState<"diagnostics" | "subtypes" | "revascularization" | "second_look">("diagnostics");

  const output = useMemo(() => simulateMesentericIschemia(params), [params]);

  const updateParam = <K extends keyof MesentericPatientParams>(
    key: K,
    value: MesentericPatientParams[K]
  ) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // Case Vignettes / Presets
  const applyPreset = (
    presetKey:
      | "hyperacute_sma_embolism"
      | "normal_lactate_trap"
      | "nomi_icu_shock"
      | "sma_thrombosis_intestinal_angina"
      | "second_look_salvage"
  ) => {
    switch (presetKey) {
      case "hyperacute_sma_embolism":
        setParams({
          ...DEFAULT_MESENTERIC_PATIENT,
          subtype: "SMA_EMBOLISM",
          hoursFromPainOnset: 3,
          historyOfAtrialFibrillation: true,
          priorIntestinalAnginaWeightLoss: false,
          highDoseAlphaVasopressorsActive: false,
          painSeverityScore10: 10,
          abdominalTendernessMildVsPeritonitis: "SOFT_MINIMAL_TENDERNESS",
          serumLactateMmolPerL: 1.4,
          whiteBloodCellCountK: 16.5,
          imagingOrdered: "BIPHASIC_CT_ANGIOGRAPHY_CTA",
          revascularization: "OPEN_SURGICAL_EMBOLECTOMY_PATCH",
          systemicHeparinBolusAndDrip: true,
          broadSpectrumAntibioticsCoveringEnterics: true,
          secondLookLaparotomyPlanned: true
        });
        break;
      case "normal_lactate_trap":
        setParams({
          ...DEFAULT_MESENTERIC_PATIENT,
          subtype: "SMA_EMBOLISM",
          hoursFromPainOnset: 4,
          historyOfAtrialFibrillation: true,
          painSeverityScore10: 9,
          abdominalTendernessMildVsPeritonitis: "SOFT_MINIMAL_TENDERNESS",
          serumLactateMmolPerL: 1.2, // Trapping the physician!
          whiteBloodCellCountK: 15.2,
          imagingOrdered: "NONE_CLINICAL_SUSPICION_ONLY",
          revascularization: "NONE_CONSERVATIVE",
          systemicHeparinBolusAndDrip: false,
          broadSpectrumAntibioticsCoveringEnterics: false,
          secondLookLaparotomyPlanned: false
        });
        break;
      case "nomi_icu_shock":
        setParams({
          ...DEFAULT_MESENTERIC_PATIENT,
          subtype: "NON_OCCLUSIVE_NOMI",
          hoursFromPainOnset: 8,
          historyOfAtrialFibrillation: false,
          highDoseAlphaVasopressorsActive: true, // High pressors triggering splanchnic spasm
          painSeverityScore10: 8,
          abdominalTendernessMildVsPeritonitis: "FOCAL_GUARDING",
          serumLactateMmolPerL: 3.4,
          whiteBloodCellCountK: 21.0,
          imagingOrdered: "BIPHASIC_CT_ANGIOGRAPHY_CTA",
          revascularization: "INTRA_ARTERIAL_PAPAVERINE_INFUSION",
          systemicHeparinBolusAndDrip: true,
          broadSpectrumAntibioticsCoveringEnterics: true,
          secondLookLaparotomyPlanned: true
        });
        break;
      case "sma_thrombosis_intestinal_angina":
        setParams({
          ...DEFAULT_MESENTERIC_PATIENT,
          subtype: "SMA_THROMBOSIS",
          hoursFromPainOnset: 10,
          historyOfAtrialFibrillation: false,
          priorIntestinalAnginaWeightLoss: true, // Sitophobia & postprandial pain
          painSeverityScore10: 9,
          abdominalTendernessMildVsPeritonitis: "FOCAL_GUARDING",
          serumLactateMmolPerL: 2.8,
          whiteBloodCellCountK: 18.4,
          imagingOrdered: "BIPHASIC_CT_ANGIOGRAPHY_CTA",
          revascularization: "MESENTERIC_BYPASS_GRAFT",
          systemicHeparinBolusAndDrip: true,
          broadSpectrumAntibioticsCoveringEnterics: true,
          secondLookLaparotomyPlanned: true
        });
        break;
      case "second_look_salvage":
        setParams({
          ...DEFAULT_MESENTERIC_PATIENT,
          subtype: "SMA_EMBOLISM",
          hoursFromPainOnset: 9,
          historyOfAtrialFibrillation: true,
          painSeverityScore10: 9,
          abdominalTendernessMildVsPeritonitis: "DIFFUSE_RIGIDITY_REBOUND",
          serumLactateMmolPerL: 3.9,
          whiteBloodCellCountK: 22.5,
          imagingOrdered: "BIPHASIC_CT_ANGIOGRAPHY_CTA",
          revascularization: "OPEN_SURGICAL_EMBOLECTOMY_PATCH",
          systemicHeparinBolusAndDrip: true,
          broadSpectrumAntibioticsCoveringEnterics: true,
          secondLookLaparotomyPlanned: true
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
              <div className="p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400">
                <Activity className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400 bg-clip-text text-transparent">
                  Acute Mesenteric Ischemia (AMI) & Revascularization Workstation
                </h1>
                <p className="text-sm text-slate-400">
                  SMA Embolism vs Thrombosis vs NOMI vs MVT, Biphasic CTA, Normal Lactate False-Negative Alert, Intra-Arterial Papaverine, and Second-Look Laparotomy
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-amber-950/60 border border-amber-800/60 text-amber-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Track B36 (Route #237)
            </span>
            <span className="px-3 py-1 bg-rose-950/60 border border-rose-800/60 text-rose-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Lactate Pitfall Alert
            </span>
            <span className="px-3 py-1 bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5" /> Second-Look Laparotomy
            </span>
          </div>
        </div>

        {/* Case Presets Navigation */}
        <div className="mt-4 p-3 bg-slate-900/70 border border-slate-800/80 rounded-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-amber-400" /> Clinical Scenarios & High-Yield Vignettes:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            <button
              onClick={() => applyPreset("hyperacute_sma_embolism")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.subtype === "SMA_EMBOLISM" && params.hoursFromPainOnset === 3
                  ? "bg-amber-950/80 border-amber-500 text-amber-200 shadow-md shadow-amber-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>1. SMA Embolism (Afib)</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-900/50 text-amber-300 rounded">Classic</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Hyperacute 10/10 pain out of proportion, soft abdomen, Afib history.
              </p>
            </button>

            <button
              onClick={() => applyPreset("normal_lactate_trap")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.serumLactateMmolPerL === 1.2 && params.revascularization === "NONE_CONSERVATIVE"
                  ? "bg-rose-950/80 border-rose-500 text-rose-200 shadow-md shadow-rose-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>2. Normal Lactate Trap</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-rose-900 text-rose-200 rounded">Pitfall</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Lactate 1.2 (normal) creates fatal false reassurance while bowel dies.
              </p>
            </button>

            <button
              onClick={() => applyPreset("nomi_icu_shock")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.subtype === "NON_OCCLUSIVE_NOMI"
                  ? "bg-purple-950/80 border-purple-500 text-purple-200 shadow-md shadow-purple-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>3. NOMI in ICU Shock</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-purple-900 text-purple-200 rounded">Vasospasm</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                High-dose pressors trigger splanchnic spasm; intra-arterial Papaverine indicated.
              </p>
            </button>

            <button
              onClick={() => applyPreset("sma_thrombosis_intestinal_angina")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.priorIntestinalAnginaWeightLoss
                  ? "bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>4. SMA Thrombosis</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-cyan-900 text-cyan-200 rounded">Ostial</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Prior food fear/weight loss, ostial atherosclerotic plaque rupture.
              </p>
            </button>

            <button
              onClick={() => applyPreset("second_look_salvage")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.abdominalTendernessMildVsPeritonitis === "DIFFUSE_RIGIDITY_REBOUND"
                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>5. Second-Look Salvage</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-900 text-emerald-200 rounded">Damage Ctrl</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Resect frankly necrotic bowel; preserve borderline loops for 24-48h re-look.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Hero 4-Panel Hemodynamic & Viability Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Panel 1: Bowel Viability Stage */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" /> Viability Stage
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.predictedViabilityStage === "STAGE_1_HYPEREMIC_MUCOSAL_ISCHEMIA"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : output.predictedViabilityStage === "STAGE_2_TRANSMURAL_PATCHY_ISCHEMIA"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                }`}
              >
                {output.predictedViabilityStage === "STAGE_1_HYPEREMIC_MUCOSAL_ISCHEMIA"
                  ? "STAGE 1 (REVERSIBLE)"
                  : output.predictedViabilityStage === "STAGE_2_TRANSMURAL_PATCHY_ISCHEMIA"
                  ? "STAGE 2 (BORDERLINE)"
                  : output.predictedViabilityStage === "STAGE_3_FRANK_GANGRENOUS_NECROSIS"
                  ? "STAGE 3 (GANGRENE)"
                  : "STAGE 4 (PERFORATED)"}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-extrabold ${
                  output.predictedViabilityStage === "STAGE_1_HYPEREMIC_MUCOSAL_ISCHEMIA"
                    ? "text-emerald-400"
                    : output.predictedViabilityStage === "STAGE_2_TRANSMURAL_PATCHY_ISCHEMIA"
                    ? "text-amber-400"
                    : "text-rose-400"
                }`}>
                  {output.predictedViabilityStage === "STAGE_1_HYPEREMIC_MUCOSAL_ISCHEMIA"
                    ? "Mucosal Threat"
                    : output.predictedViabilityStage === "STAGE_2_TRANSMURAL_PATCHY_ISCHEMIA"
                    ? "Patchy Duskiness"
                    : output.predictedViabilityStage === "STAGE_3_FRANK_GANGRENOUS_NECROSIS"
                    ? "Frank Gangrene"
                    : "Bowel Perforation"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">TIME FROM ONSET</span>
                  <span className="font-bold text-sm text-cyan-300">
                    {params.hoursFromPainOnset} Hours
                  </span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">SUBTYPE</span>
                  <span className="font-bold text-xs text-amber-300 truncate block">
                    {params.subtype.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Reversibility Window:</span>
            <span className={`font-semibold ${params.hoursFromPainOnset < 6 ? "text-emerald-400" : "text-rose-400"}`}>
              {params.hoursFromPainOnset < 6 ? "< 6h (Highly Reversible)" : "> 6h (Transmural Risk)"}
            </span>
          </div>
        </div>

        {/* Panel 2: Serum Lactate Benchmark */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-rose-400" /> Serum Lactate
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.isLactateMisleadinglyNormal
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                    : params.serumLactateMmolPerL > 2.0
                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                }`}
              >
                {output.isLactateMisleadinglyNormal ? "FALSE-NEGATIVE TRAP" : params.serumLactateMmolPerL > 2.0 ? "ELEVATED (NECROSIS)" : "NORMAL"}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${params.serumLactateMmolPerL > 2.0 ? "text-rose-400" : "text-emerald-400"}`}>
                  {params.serumLactateMmolPerL}
                </span>
                <span className="text-xs text-slate-400">mmol/L (Normal &le; 2.0)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">WHITE BLOOD CELLS</span>
                  <span className="font-bold text-sm text-cyan-300">
                    {params.whiteBloodCellCountK} k/uL
                  </span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">DIAGNOSTIC MEANING</span>
                  <span className={`font-bold text-[11px] ${output.isLactateMisleadinglyNormal ? "text-amber-300" : "text-slate-300"}`}>
                    {output.isLactateMisleadinglyNormal ? "Does NOT Rule Out" : "Established Necrosis"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Biomarker Status:</span>
            <span className="font-semibold text-slate-300">
              {output.isLactateMisleadinglyNormal ? "Pre-Necrosis (Lactate Insensitive)" : "Late Transmural Shock"}
            </span>
          </div>
        </div>

        {/* Panel 3: Small Bowel Length & Short Bowel Risk */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Scissors className="w-4 h-4 text-cyan-400" /> Bowel Preservation
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.shortBowelSyndromeRisk === "LOW"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : output.shortBowelSyndromeRisk === "MODERATE"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                }`}
              >
                {output.shortBowelSyndromeRisk === "LOW" ? "LOW SBS RISK" : output.shortBowelSyndromeRisk === "MODERATE" ? "MODERATE SBS RISK" : "CRITICAL SBS THREAT"}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${output.estimatedViableSmallBowelLengthCm >= 200 ? "text-emerald-400" : "text-rose-400"}`}>
                  {output.estimatedViableSmallBowelLengthCm}
                </span>
                <span className="text-xs text-slate-400">cm (Viable Small Bowel)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">SBS THRESHOLD</span>
                  <span className="font-bold text-xs text-rose-300">
                    &lt; 150-200 cm
                  </span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">TPN DEPENDENCE</span>
                  <span className={`font-bold text-xs ${output.shortBowelSyndromeRisk === "CRITICAL_EXTENSIVE_RESECTION" ? "text-rose-400 font-bold" : "text-slate-300"}`}>
                    {output.shortBowelSyndromeRisk === "CRITICAL_EXTENSIVE_RESECTION" ? "High Likelihood" : "Prevented"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Normal Baseline:</span>
            <span className="font-semibold text-slate-300">~400-600 cm</span>
          </div>
        </div>

        {/* Panel 4: Revascularization & Second-Look */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Surgical Strategy
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.vascularPatencyAchieved
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                }`}
              >
                {output.vascularPatencyAchieved ? "FLOW RESTORED" : "OCCLUDED / ISCHEMIC"}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-extrabold ${output.vascularPatencyAchieved ? "text-emerald-400" : "text-rose-400"}`}>
                  {output.vascularPatencyAchieved ? "Patency Restored" : "Intervention Needed"}
                </span>
              </div>
              <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80 mt-3 text-xs">
                <span className="text-slate-400 block text-[10px]">SECOND-LOOK LAPAROTOMY (24-48H)</span>
                <span className={`font-bold text-xs ${params.secondLookLaparotomyPlanned ? "text-emerald-400" : "text-rose-400"}`}>
                  {params.secondLookLaparotomyPlanned ? "SCHEDULED (Damage Control)" : "MANDATORY / NOT PLANNED"}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Heparin / Abx Coverage:</span>
            <span className={`font-bold ${params.systemicHeparinBolusAndDrip && params.broadSpectrumAntibioticsCoveringEnterics ? "text-emerald-400" : "text-amber-400"}`}>
              {params.systemicHeparinBolusAndDrip && params.broadSpectrumAntibioticsCoveringEnterics ? "Active Dual Cover" : "Incomplete Resuscitation"}
            </span>
          </div>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {output.clinicalAlerts.length > 0 && (
        <div className="max-w-7xl mx-auto mb-6 space-y-2">
          {output.clinicalAlerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-start gap-3 text-xs font-medium ${
                alert.includes("SERUM LACTATE PITFALL") || alert.includes("IMAGING HAZARD") || alert.includes("CRITICAL SHORT BOWEL")
                  ? "bg-rose-950/70 border-rose-600 text-rose-200 animate-pulse"
                  : alert.includes("CARDINAL DIAGNOSTIC CLUE") || alert.includes("CRITICAL SURGICAL DIRECTIVE")
                  ? "bg-amber-950/70 border-amber-600 text-amber-200"
                  : alert.includes("GOLD STANDARD") || alert.includes("SUCCESSFUL")
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

      {/* Main Interactive Tabs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex border-b border-slate-800 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab("diagnostics")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "diagnostics"
                ? "border-amber-500 text-amber-400 bg-amber-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Scan className="w-4 h-4" /> 1. Diagnostic Workup & The Lactate Trap
          </button>
          <button
            onClick={() => setActiveTab("subtypes")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "subtypes"
                ? "border-amber-500 text-amber-400 bg-amber-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-4 h-4" /> 2. 4-Subtype Differential Bench
          </button>
          <button
            onClick={() => setActiveTab("revascularization")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "revascularization"
                ? "border-amber-500 text-amber-400 bg-amber-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Pill className="w-4 h-4" /> 3. Revascularization & Papaverine
          </button>
          <button
            onClick={() => setActiveTab("second_look")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "second_look"
                ? "border-amber-500 text-amber-400 bg-amber-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Scissors className="w-4 h-4" /> 4. Damage Control & Second-Look
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="max-w-7xl mx-auto">
        {/* Tab 1: Diagnostic Workup & The Lactate Trap */}
        {activeTab === "diagnostics" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Imaging & Exam Controls */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                  <Scan className="w-5 h-5 text-amber-400" /> Diagnostic Modality Selection
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Select Urgent Diagnostic Investigation:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(
                      [
                        { id: "BIPHASIC_CT_ANGIOGRAPHY_CTA", title: "Biphasic CTA (No Oral Contrast)", desc: "GOLD STANDARD: Arterial & portal venous phases", badge: "Gold Standard", color: "emerald" },
                        { id: "CT_WITH_ORAL_CONTRAST", title: "CT Abdomen With Oral Contrast", desc: "HAZARD: Oral contrast obscures vessel & mucosa!", badge: "Pitfall", color: "rose" },
                        { id: "ABDOMINAL_PLAIN_XRAY", title: "Abdominal Plain Radiograph (KUB)", desc: "Insensitive early (<30%); only late perforation", badge: "Insensitive", color: "slate" },
                        { id: "ABDOMINAL_ULTRASOUND_DOPPLER", title: "Abdominal Ultrasound Doppler", desc: "Obscured by bowel gas; misses distal emboli", badge: "Limited", color: "slate" }
                      ] as const
                    ).map(item => (
                      <button
                        key={item.id}
                        onClick={() => updateParam("imagingOrdered", item.id as DiagnosticImagingModality)}
                        className={`p-3 rounded-xl border text-left text-xs transition ${
                          params.imagingOrdered === item.id
                            ? item.color === "emerald"
                              ? "bg-emerald-950 border-emerald-500 text-emerald-200"
                              : item.color === "rose"
                              ? "bg-rose-950 border-rose-500 text-rose-200"
                              : "bg-amber-950 border-amber-500 text-amber-200"
                            : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>{item.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">{item.badge}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Imaging Warning */}
                {output.diagnosticAccuracy.imagingWarning && (
                  <div className="p-3 bg-rose-950/80 border border-rose-600 rounded-xl text-xs text-rose-200 flex items-start gap-2.5 animate-pulse">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>{output.diagnosticAccuracy.imagingWarning}</div>
                  </div>
                )}

                {/* Exam & Biomarkers Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Reported Pain Severity:</span>
                      <span className="font-bold text-amber-300">{params.painSeverityScore10}/10 (Severe)</span>
                    </div>
                    <input aria-label="Reported Pain Severity"
                      type="range"
                      min="1"
                      max="10"
                      value={params.painSeverityScore10}
                      onChange={e => updateParam("painSeverityScore10", parseInt(e.target.value))}
                      className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Physical Examination State:</label>
                    <select
                      value={params.abdominalTendernessMildVsPeritonitis}
                      onChange={e => updateParam("abdominalTendernessMildVsPeritonitis", e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200"
                    >
                      <option value="SOFT_MINIMAL_TENDERNESS">Soft, Non-Distended (Pain Out of Proportion)</option>
                      <option value="FOCAL_GUARDING">Focal Guarding / Local Tenderness</option>
                      <option value="DIFFUSE_RIGIDITY_REBOUND">Diffuse Board-Like Rigidity & Rebound (Peritonitis)</option>
                    </select>
                  </div>
                </div>

                {/* Lactate Slider */}
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Serum Lactate Level:</span>
                    <span className={`font-mono font-bold ${params.serumLactateMmolPerL > 2.0 ? "text-rose-400" : "text-emerald-400"}`}>
                      {params.serumLactateMmolPerL} mmol/L
                    </span>
                  </div>
                  <input aria-label="Serum Lactate Level"
                    type="range"
                    min="0.5"
                    max="10.0"
                    step="0.1"
                    value={params.serumLactateMmolPerL}
                    onChange={e => updateParam("serumLactateMmolPerL", parseFloat(e.target.value))}
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0.5 mmol/L (Normal)</span>
                    <span>2.0 mmol/L (Upper Limit)</span>
                    <span>10.0 mmol/L (Severe Shock)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Educational & Evidence Card */}
            <div className="space-y-4">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" /> The Lethal "Normal Lactate" Trap
                </h4>
                <div className="text-xs text-slate-300 space-y-2">
                  <p>
                    <strong>Medical Myth:</strong> Many clinicians falsely assume that a normal serum lactate level rules out acute mesenteric ischemia.
                  </p>
                  <p>
                    <strong>Pathophysiologic Reality:</strong> The liver clears splanchnic lactate via the portal vein during early mucosal ischemia. Lactate only spills into systemic circulation after <strong>extensive full-thickness transmural bowel infarction</strong> has occurred.
                  </p>
                  <div className="p-2.5 bg-rose-950/60 border border-rose-800/80 rounded-xl text-[11px] text-rose-200">
                    Never delay Biphasic CTA in an elderly patient with sudden severe abdominal pain out of proportion to exam simply because lactate is normal!
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" /> Time-To-Irreversibility Timeline
                </h4>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-emerald-400 font-bold w-12">0-6h:</span>
                    <span>Mucosal ischemia; 100% reversible with revascularization.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-400 font-bold w-12">6-12h:</span>
                    <span>Mural edema, patchy submucosal hemorrhage; second-look mandated.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-rose-400 font-bold w-12">&gt; 12h:</span>
                    <span>Transmural gangrene, bacterial translocation, perforation & sepsis.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Subtypes Differential Bench */}
        {activeTab === "subtypes" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(
              [
                {
                  id: "SMA_EMBOLISM",
                  title: "1. SMA Embolism (40-50%)",
                  source: "Cardioembolic (Atrial Fibrillation / LV Thrombus)",
                  site: "3-8 cm distal to SMA origin (beyond middle colic)",
                  onset: "Hyperacute, sudden, catastrophic pain",
                  treatment: "Fogarty embolectomy or aspiration catheter"
                },
                {
                  id: "SMA_THROMBOSIS",
                  title: "2. SMA Thrombosis (20-30%)",
                  source: "Atherosclerotic plaque rupture (Intestinal Angina)",
                  site: "SMA ostium / origin off aorta",
                  onset: "Progressive, subacute over hours; food fear",
                  treatment: "Retrograde stenting (ROMS) or surgical bypass"
                },
                {
                  id: "NON_OCCLUSIVE_NOMI",
                  title: "3. NOMI (20%)",
                  source: "Splanchnic vasospasm in shock / high alpha-pressors",
                  site: "Diffuse diffuse mesenteric arcade narrowing",
                  onset: "Insidious in critically ill ICU patients",
                  treatment: "Continuous intra-arterial Papaverine (30-60 mg/h)"
                },
                {
                  id: "MESENTERIC_VENOUS_MVT",
                  title: "4. Venous Thrombosis (10%)",
                  source: "Hypercoagulable states, malignancy, portal HTN",
                  site: "Superior mesenteric vein & portal confluence",
                  onset: "Indolent over days; massive bowel wall edema",
                  treatment: "Systemic IV Heparin anticoagulation"
                }
              ] as const
            ).map(sub => (
              <button
                key={sub.id}
                onClick={() => updateParam("subtype", sub.id as MesentericIschemiaSubtype)}
                className={`p-4 rounded-2xl border text-left text-xs transition flex flex-col justify-between ${
                  params.subtype === sub.id
                    ? "bg-amber-950/80 border-amber-500 text-amber-200 shadow-xl"
                    : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-100 mb-2">{sub.title}</h4>
                  <div className="space-y-1.5 text-[11px] text-slate-400">
                    <p><strong>Etiology:</strong> {sub.source}</p>
                    <p><strong>Vascular Site:</strong> {sub.site}</p>
                    <p><strong>Clinical Onset:</strong> {sub.onset}</p>
                  </div>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-800/80 text-[11px] text-cyan-300 font-semibold">
                  Rx: {sub.treatment}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Tab 3: Revascularization & Papaverine */}
        {activeTab === "revascularization" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-amber-400" /> Revascularization & Interventional Strategy
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Select Definitive Revascularization Modality:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(
                      [
                        { id: "OPEN_SURGICAL_EMBOLECTOMY_PATCH", label: "Open Surgical Embolectomy & Patch", desc: "Transverse arteriotomy + Fogarty catheter balloon" },
                        { id: "ENDOVASCULAR_ASPIRATION_THROMBECTOMY", label: "Endovascular Aspiration Thrombectomy", desc: "Catheter-directed suction mechanical recanalization" },
                        { id: "INTRA_ARTERIAL_PAPAVERINE_INFUSION", label: "Intra-Arterial Papaverine Infusion", desc: "30-60 mg/h vasodilator (essential for NOMI / spasm)" },
                        { id: "MESENTERIC_BYPASS_GRAFT", label: "Mesenteric Bypass Graft (Aorto/Ilio-SMA)", desc: "Surgical bypass for ostial atherosclerotic plaque" },
                        { id: "SYSTEMIC_ANTICOAGULATION_HEPARIN", label: "Systemic Heparin Anticoagulation", desc: "First-line medical therapy for MVT" },
                        { id: "NONE_CONSERVATIVE", label: "None (Supportive Only)", desc: "No active revascularization" }
                      ] as const
                    ).map(item => (
                      <button
                        key={item.id}
                        onClick={() => updateParam("revascularization", item.id as RevascularizationIntervention)}
                        className={`p-3 rounded-xl border text-left text-xs transition ${
                          params.revascularization === item.id
                            ? "bg-amber-950 border-amber-500 text-amber-200"
                            : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <div className="font-bold">{item.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resuscitation Checklist */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-slate-300 block">Immediate Medical Resuscitation Bundle:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => updateParam("systemicHeparinBolusAndDrip", !params.systemicHeparinBolusAndDrip)}
                      className={`p-2.5 rounded-lg border text-xs font-semibold transition ${
                        params.systemicHeparinBolusAndDrip
                          ? "bg-emerald-950 border-emerald-500 text-emerald-200"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      IV Heparin Bolus & Infusion: {params.systemicHeparinBolusAndDrip ? "Active" : "Omitted"}
                    </button>
                    <button
                      onClick={() => updateParam("broadSpectrumAntibioticsCoveringEnterics", !params.broadSpectrumAntibioticsCoveringEnterics)}
                      className={`p-2.5 rounded-lg border text-xs font-semibold transition ${
                        params.broadSpectrumAntibioticsCoveringEnterics
                          ? "bg-emerald-950 border-emerald-500 text-emerald-200"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      Broad-Spectrum Enteric Abx: {params.broadSpectrumAntibioticsCoveringEnterics ? "Covered" : "Omitted"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Papaverine & Splanchnic Vasospasm Principles */}
            <div className="space-y-4">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-cyan-400" /> Papaverine Infusion Protocol
                </h4>
                <div className="text-xs text-slate-300 space-y-2">
                  <p>
                    <strong>Agent:</strong> Papaverine hydrochloride (phosphodiesterase inhibitor).
                  </p>
                  <p>
                    <strong>Dose & Delivery:</strong> Continuous intra-arterial catheter infusion at <strong>30 to 60 mg/hour</strong> directly into the SMA trunk.
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Indicated in all NOMI cases to reverse splanchnic vasoconstriction, and as post-procedural infusion in SMA embolism/thrombosis to counteract reflexive microvascular spasm.
                  </p>
                </div>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-400" /> Actionable Therapeutic Priorities
                </h4>
                {output.therapeuticPriorities.map((item, idx) => (
                  <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Damage Control & Second-Look */}
        {activeTab === "second_look" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Damage Control Laparotomy Rules */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Scissors className="w-5 h-5 text-cyan-400" /> Damage Control Resection Strategy
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <strong className="text-slate-100 block mb-1">Golden Rule of Initial Resection:</strong>
                  Resect <strong>ONLY frankly gangrenous, perforated, or irreversibly black/aperistaltic bowel</strong> during the initial exploratory laparotomy.
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <strong className="text-slate-100 block mb-1">Preserve Borderline / Duskier Segments:</strong>
                  Do NOT perform extensive preemptive resections on questionable loops. Leave them in continuity post-revascularization and apply temporary abdominal vacuum closure (AbThera / Bogota bag).
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="font-bold text-slate-200 block">Second-Look Laparotomy Scheduling:</span>
                    <span className="text-[11px] text-slate-400">Re-exploration within 24 to 48 hours</span>
                  </div>
                  <button
                    onClick={() => updateParam("secondLookLaparotomyPlanned", !params.secondLookLaparotomyPlanned)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                      params.secondLookLaparotomyPlanned
                        ? "bg-emerald-600 text-white"
                        : "bg-rose-600 text-white"
                    }`}
                  >
                    {params.secondLookLaparotomyPlanned ? "Second-Look Scheduled" : "Not Scheduled (Risk!)"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Short Bowel Syndrome Prevention Calculator */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Short Bowel Syndrome (SBS) Prevention
              </h3>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Remaining Viable Small Intestine:</span>
                  <span className={`font-extrabold text-sm ${output.estimatedViableSmallBowelLengthCm >= 200 ? "text-emerald-400" : "text-rose-400"}`}>
                    {output.estimatedViableSmallBowelLengthCm} cm
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 transition-all duration-500 ${
                      output.estimatedViableSmallBowelLengthCm >= 200
                        ? "bg-emerald-500"
                        : output.estimatedViableSmallBowelLengthCm >= 150
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${Math.min(100, (output.estimatedViableSmallBowelLengthCm / 500) * 100)}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-400 space-y-1">
                  <p>&bull; Normal adult small bowel length: ~400-600 cm.</p>
                  <p>&bull; Short Bowel Syndrome occurs when functional bowel is &lt; 150-200 cm.</p>
                  <p>&bull; Lifelong TPN dependence is universal when functional bowel is &lt; 100 cm.</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs text-emerald-200">
                <strong>The Value of Second-Look:</strong> Resuscitation and restored arterial pulsatility often reverse patchy ischemic duskiness in up to 30-50% of questioned bowel segments over 24-48 hours, saving patients from permanent TPN dependence.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
