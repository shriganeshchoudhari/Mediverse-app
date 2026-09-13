"use client";

import React, { useState, useMemo } from "react";
import {
  Heart,
  HeartPulse,
  Activity,
  AlertTriangle,
  ShieldCheck,
  Stethoscope,
  Scissors,
  CheckCircle2,
  AlertCircle,
  Droplets,
  Layers,
  ArrowRight,
  Eye,
  Info,
  Radio,
  RefreshCw,
  Gauge
} from "lucide-react";
import {
  PostOpTamponadePatientParams,
  CardiacSurgeryProcedure,
  TamponadeEtiology,
  ImagingModality,
  ResternotomyStage,
  DEFAULT_POST_OP_PATIENT,
  simulatePostOpTamponade
} from "../../.gemini/skills/PostOpTamponadeEngine";

export default function PostOpTamponadeSimulator() {
  const [params, setParams] = useState<PostOpTamponadePatientParams>(DEFAULT_POST_OP_PATIENT);
  const [activeTab, setActiveTab] = useState<"imaging" | "resternotomy" | "differential" | "icu_titration">("imaging");

  const output = useMemo(() => simulatePostOpTamponade(params), [params]);

  const updateParam = <K extends keyof PostOpTamponadePatientParams>(
    key: K,
    value: PostOpTamponadePatientParams[K]
  ) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // Case Presets
  const applyPreset = (
    presetKey:
      | "occult_la_hematoma_avr"
      | "clotted_drain_cabg_ra"
      | "restrictive_stiffness_mimic"
      | "post_cpb_vasoplegia"
      | "isolated_rv_failure"
  ) => {
    switch (presetKey) {
      case "occult_la_hematoma_avr":
        setParams({
          ...DEFAULT_POST_OP_PATIENT,
          procedure: "AVR_ASCENDING_AORTA",
          hoursPostOp: 4,
          chestTubeDrainageRateMlPerHour: 10,
          chestTubeClottedOrKinked: true,
          inotropicVasopressorScore: 22,
          mechanicalVentilationPeepCmH2O: 8,
          preExistingLvHypertrophyOrStiffness: true,
          selectedEtiology: "LOCALIZED_POSTERIOR_LA_HEMATOMA",
          imagingPerformed: "TEE_COMPREHENSIVE",
          resternotomyPerformed: "NONE",
          fluidBolusGivenMl: 250,
          drainMilkingOrStrippingAttempted: false
        });
        break;
      case "clotted_drain_cabg_ra":
        setParams({
          ...DEFAULT_POST_OP_PATIENT,
          procedure: "CABG_X3",
          hoursPostOp: 3,
          chestTubeDrainageRateMlPerHour: 5,
          chestTubeClottedOrKinked: true,
          inotropicVasopressorScore: 25,
          mechanicalVentilationPeepCmH2O: 10,
          preExistingLvHypertrophyOrStiffness: false,
          selectedEtiology: "LOCALIZED_POSTERIOR_RA_HEMATOMA",
          imagingPerformed: "TEE_COMPREHENSIVE",
          resternotomyPerformed: "NONE",
          fluidBolusGivenMl: 500,
          drainMilkingOrStrippingAttempted: true
        });
        break;
      case "restrictive_stiffness_mimic":
        setParams({
          ...DEFAULT_POST_OP_PATIENT,
          procedure: "MVR_REPAIR",
          hoursPostOp: 6,
          chestTubeDrainageRateMlPerHour: 60,
          chestTubeClottedOrKinked: false,
          inotropicVasopressorScore: 12,
          mechanicalVentilationPeepCmH2O: 6,
          preExistingLvHypertrophyOrStiffness: true,
          selectedEtiology: "RESTRICTIVE_VENTRICULAR_STIFFNESS",
          imagingPerformed: "TEE_COMPREHENSIVE",
          resternotomyPerformed: "NONE",
          fluidBolusGivenMl: 0,
          drainMilkingOrStrippingAttempted: false
        });
        break;
      case "post_cpb_vasoplegia":
        setParams({
          ...DEFAULT_POST_OP_PATIENT,
          procedure: "CABG_X3",
          hoursPostOp: 2,
          chestTubeDrainageRateMlPerHour: 75,
          chestTubeClottedOrKinked: false,
          inotropicVasopressorScore: 30,
          mechanicalVentilationPeepCmH2O: 5,
          preExistingLvHypertrophyOrStiffness: false,
          selectedEtiology: "POST_CPB_VASOPLEGIA",
          imagingPerformed: "TEE_COMPREHENSIVE",
          resternotomyPerformed: "NONE",
          fluidBolusGivenMl: 1000,
          drainMilkingOrStrippingAttempted: false
        });
        break;
      case "isolated_rv_failure":
        setParams({
          ...DEFAULT_POST_OP_PATIENT,
          procedure: "MVR_REPAIR",
          hoursPostOp: 5,
          chestTubeDrainageRateMlPerHour: 40,
          chestTubeClottedOrKinked: false,
          inotropicVasopressorScore: 20,
          mechanicalVentilationPeepCmH2O: 8,
          preExistingLvHypertrophyOrStiffness: false,
          selectedEtiology: "ISOLATED_RV_FAILURE",
          imagingPerformed: "TEE_COMPREHENSIVE",
          resternotomyPerformed: "NONE",
          fluidBolusGivenMl: 500,
          drainMilkingOrStrippingAttempted: false
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
              <div className="p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-400">
                <HeartPulse className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-rose-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
                  Post-Op Cardiac Tamponade vs Restrictive Physiology
                </h1>
                <p className="text-sm text-slate-400">
                  Transesophageal (TEE) vs Transthoracic (TTE) Echo, Localized Posterior Hematomas, Equalization of Diastolic Pressures, and Emergency CALS Resternotomy
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-rose-950/60 border border-rose-800/60 text-rose-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Track B32 (Route #233)
            </span>
            <span className="px-3 py-1 bg-amber-950/60 border border-amber-800/60 text-amber-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> STS / CALS Resternotomy
            </span>
            <span className="px-3 py-1 bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" /> TEE Gold Standard
            </span>
          </div>
        </div>

        {/* Case Presets Navigation */}
        <div className="mt-4 p-3 bg-slate-900/70 border border-slate-800/80 rounded-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-rose-400" /> Post-Cardiac Surgery ICU Case Scenarios:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            <button
              onClick={() => applyPreset("occult_la_hematoma_avr")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.selectedEtiology === "LOCALIZED_POSTERIOR_LA_HEMATOMA"
                  ? "bg-rose-950/80 border-rose-500 text-rose-200 shadow-md shadow-rose-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>1. Occult Posterior LA Clot</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-rose-900/50 text-rose-300 rounded">AVR</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Clotted drain, TTE false negative, blunted pulsus, TEE confirms LA compression.
              </p>
            </button>

            <button
              onClick={() => applyPreset("clotted_drain_cabg_ra")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.selectedEtiology === "LOCALIZED_POSTERIOR_RA_HEMATOMA"
                  ? "bg-amber-950/80 border-amber-500 text-amber-200 shadow-md shadow-amber-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>2. Clotted Drain & RA Clot</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-900/50 text-amber-300 rounded">CABG x3</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Sudden drop in bleeding, caval inflow block, loss of y descent, stripping hazard.
              </p>
            </button>

            <button
              onClick={() => applyPreset("restrictive_stiffness_mimic")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.selectedEtiology === "RESTRICTIVE_VENTRICULAR_STIFFNESS"
                  ? "bg-indigo-950/80 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>3. Restrictive Stiffness</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-indigo-900/50 text-indigo-300 rounded">MVR</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Dip and plateau square-root sign, prominent y descent, resternotomy futile.
              </p>
            </button>

            <button
              onClick={() => applyPreset("post_cpb_vasoplegia")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.selectedEtiology === "POST_CPB_VASOPLEGIA"
                  ? "bg-purple-950/80 border-purple-500 text-purple-200 shadow-md shadow-purple-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>4. Post-CPB Vasoplegia</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-purple-900/50 text-purple-300 rounded">SIRS</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Profound low SVR (480), high CI, low CVP, hyperdynamic empty TEE ventricles.
              </p>
            </button>

            <button
              onClick={() => applyPreset("isolated_rv_failure")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.selectedEtiology === "ISOLATED_RV_FAILURE"
                  ? "bg-teal-950/80 border-teal-500 text-teal-200 shadow-md shadow-teal-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>5. Acute Isolated RV Failure</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-teal-900/50 text-teal-300 rounded">Cor Pulm</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Wide CVP-PCWP gradient (12 mmHg), D-shaped LV on TEE, adverse fluid overload.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Hero 4-Panel Hemodynamic & Pressure Equalization Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Panel 1: Arterial Pressure & Cardiac Output */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-400" /> Perfusion & Shock
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.cardiacIndexLMinM2 < 1.8
                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                    : output.cardiacIndexLMinM2 < 2.2
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                }`}
              >
                {output.cardiacIndexLMinM2 < 1.8 ? "SEVERE LCOS" : output.cardiacIndexLMinM2 < 2.2 ? "MARGINAL" : "ADEQUATE"}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">
                  {output.systolicBpMmHg}/{output.diastolicBpMmHg}
                </span>
                <span className="text-xs text-slate-400">mmHg</span>
                <span className="ml-auto text-xs px-2 py-0.5 bg-slate-800 rounded text-slate-300">
                  MAP {output.meanArterialPressureMmHg}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">CARDIAC INDEX (CI)</span>
                  <span className={`font-bold text-sm ${output.cardiacIndexLMinM2 < 1.8 ? "text-rose-400" : "text-emerald-400"}`}>
                    {output.cardiacIndexLMinM2} L/min/m²
                  </span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">STROKE VOL INDEX</span>
                  <span className="font-bold text-sm text-cyan-300">
                    {output.strokeVolumeIndexMlM2} mL/m²
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>SVR: {output.systemicVascularResistanceDyns} dyn·s/cm⁵</span>
            <span>HR: {output.heartRateBpm} bpm</span>
          </div>
        </div>

        {/* Panel 2: Diastolic Pressure Equalization Benchmark */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-cyan-400" /> Diastolic Pressures
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.isEqualizedDiastolicPressures
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {output.isEqualizedDiastolicPressures ? "EQUALIZATION" : "GRADIENT PRESERVED"}
              </span>
            </div>
            <div className="mt-3">
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold">CVP</div>
                  <div className="text-xl font-bold text-amber-400">{output.centralVenousPressureCvpMmHg}</div>
                  <div className="text-[9px] text-slate-500">mmHg</div>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold">PAD</div>
                  <div className="text-xl font-bold text-cyan-400">{output.pulmonaryArteryDiastolicPadMmHg}</div>
                  <div className="text-[9px] text-slate-500">mmHg</div>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold">PCWP</div>
                  <div className="text-xl font-bold text-purple-400">{output.pulmonaryCapillaryWedgePressurePcwpMmHg}</div>
                  <div className="text-[9px] text-slate-500">mmHg</div>
                </div>
              </div>
              <div className="mt-2 text-center text-xs">
                <span className="text-slate-400">Pressure Gap |CVP - PCWP|: </span>
                <span className={`font-bold ${output.diastolicPressureEqualizationGapMmHg <= 4 ? "text-rose-400" : "text-emerald-400"}`}>
                  {output.diastolicPressureEqualizationGapMmHg} mmHg
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 line-clamp-1">
            {output.isEqualizedDiastolicPressures
              ? "Equalized filling pressures confirm ventricular chamber constraint."
              : "Significant gradient present between left and right filling pressures."}
          </div>
        </div>

        {/* Panel 3: Pulsus Paradoxus & CVP Waveform */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-amber-400" /> Pulsus & Waveforms
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.pulsusParadoxusBlunted
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {output.pulsusParadoxusBlunted ? "PULSUS BLUNTED" : "CLASSIC PULSUS"}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-extrabold text-amber-300">
                  {output.pulsusParadoxusMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
                </div>
                <div className="text-right text-[11px]">
                  <span className="text-slate-400 block">y DESCENT</span>
                  <span
                    className={`font-bold ${
                      output.cvpWaveformMorphology.yDescent === "BLUNTED_ABSENT"
                        ? "text-rose-400"
                        : output.cvpWaveformMorphology.yDescent === "PROMINENT_DEEP_DIP"
                        ? "text-indigo-400"
                        : "text-slate-300"
                    }`}
                  >
                    {output.cvpWaveformMorphology.yDescent}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-xs bg-slate-950/60 p-2 rounded-lg border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
                {output.cvpWaveformMorphology.description}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-amber-400 line-clamp-1">
            {output.pulsusParadoxusBlunted ? "Caution: Do not rely on pulsus paradoxus post-op!" : "Respirophasic arterial variation active."}
          </div>
        </div>

        {/* Panel 4: Chest Tube Drainage & Perfusion Status */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-rose-500" /> Drains & Tissue Oxygen
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  params.chestTubeClottedOrKinked
                    ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {params.chestTubeClottedOrKinked ? "DRAIN CLOTTED" : "PATENT"}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Chest Drain Flow:</span>
                <span className={`font-bold ${params.chestTubeDrainageRateMlPerHour < 20 ? "text-amber-400" : "text-slate-200"}`}>
                  {params.chestTubeDrainageRateMlPerHour} mL/h
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Arterial Lactate:</span>
                <span className={`font-bold ${output.arterialLactateMmolL >= 4.0 ? "text-rose-400" : output.arterialLactateMmolL >= 2.0 ? "text-amber-400" : "text-emerald-400"}`}>
                  {output.arterialLactateMmolL} mmol/L
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Mixed Venous SvO₂:</span>
                <span className={`font-bold ${output.mixedVenousOxygenSaturationPct < 55 ? "text-rose-400" : "text-cyan-300"}`}>
                  {output.mixedVenousOxygenSaturationPct}%
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Urine Output:</span>
                <span className={`font-bold ${output.urineOutputMlPerHour < 25 ? "text-rose-400" : "text-emerald-400"}`}>
                  {output.urineOutputMlPerHour} mL/h
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
            Resternotomy Urgency: <span className="font-bold text-rose-400">{output.resternotomyUrgency}</span>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex border-b border-slate-800 gap-2">
          <button
            onClick={() => setActiveTab("imaging")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "imaging"
                ? "border-cyan-500 text-cyan-400 bg-cyan-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Radio className="w-4 h-4" /> 1. Echocardiography: TTE vs TEE Console
          </button>
          <button
            onClick={() => setActiveTab("resternotomy")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "resternotomy"
                ? "border-rose-500 text-rose-400 bg-rose-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Scissors className="w-4 h-4" /> 2. Surgical Resternotomy & CALS Protocol
          </button>
          <button
            onClick={() => setActiveTab("differential")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "differential"
                ? "border-amber-500 text-amber-400 bg-amber-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-4 h-4" /> 3. 5-Phenotype Hemodynamic Matrix
          </button>
          <button
            onClick={() => setActiveTab("icu_titration")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "icu_titration"
                ? "border-purple-500 text-purple-400 bg-purple-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="w-4 h-4" /> 4. ICU Titration & Drain Safety
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Tab 1: Echocardiography TTE vs TEE */}
        {activeTab === "imaging" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Console Control */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-5">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" /> Echo Modality Selector
              </h2>
              <div className="space-y-3">
                <label className="block text-xs text-slate-400">Select Diagnostic Modality:</label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => updateParam("imagingPerformed", "TTE_BEDSIDE")}
                    className={`p-3 rounded-xl border text-left transition ${
                      params.imagingPerformed === "TTE_BEDSIDE"
                        ? "bg-cyan-950/60 border-cyan-500 text-cyan-200"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>Bedside Transthoracic Echo (TTE)</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-amber-900/40 text-amber-300 rounded">Pitfall Window</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Parasternal, apical, and subcostal views. Vulnerable to sternal wire shadows, dressings, and surgical emphysema.
                    </p>
                  </button>

                  <button
                    onClick={() => updateParam("imagingPerformed", "TEE_COMPREHENSIVE")}
                    className={`p-3 rounded-xl border text-left transition ${
                      params.imagingPerformed === "TEE_COMPREHENSIVE"
                        ? "bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/40"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>Comprehensive TEE (Gold Standard)</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-900/40 text-emerald-300 rounded">STS Guideline</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Midesophageal 4-chamber, bicaval, and deep transgastric views. Eliminates acoustic shadows, visualizes posterior hematomas.
                    </p>
                  </button>

                  <button
                    onClick={() => updateParam("imagingPerformed", "NONE")}
                    className={`p-2.5 rounded-xl border text-left transition text-xs ${
                      params.imagingPerformed === "NONE"
                        ? "bg-slate-800 border-slate-600 text-slate-200"
                        : "bg-slate-950/40 border-slate-800 text-slate-500 hover:bg-slate-800"
                    }`}
                  >
                    No Imaging Performed (Clinical Suspicion Only)
                  </button>
                </div>
              </div>

              {/* Pathology Configuration */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <label className="block text-xs font-semibold text-slate-300">Underlying Post-Op Etiology:</label>
                <select
                  value={params.selectedEtiology}
                  onChange={e => updateParam("selectedEtiology", e.target.value as TamponadeEtiology)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="LOCALIZED_POSTERIOR_LA_HEMATOMA">Localized Posterior Left Atrial (LA) Hematoma</option>
                  <option value="LOCALIZED_POSTERIOR_RA_HEMATOMA">Localized Posterior Right Atrial (RA) Hematoma</option>
                  <option value="CIRCUMFERENTIAL_HEMOPERICARDIUM">Circumferential Hemopericardium (Classic)</option>
                  <option value="RESTRICTIVE_VENTRICULAR_STIFFNESS">Restrictive Ventricular Stiffness (No Hematoma)</option>
                  <option value="POST_CPB_VASOPLEGIA">Post-CPB Vasoplegia Syndrome (Low SVR)</option>
                  <option value="ISOLATED_RV_FAILURE">Isolated Acute RV Failure (Wide CVP-PCWP)</option>
                </select>
              </div>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={params.preExistingLvHypertrophyOrStiffness}
                    onChange={e => updateParam("preExistingLvHypertrophyOrStiffness", e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-cyan-600 focus:ring-0"
                  />
                  <span>Pre-existing LVH / Post-CPB Myocardial Edema</span>
                </label>
              </div>
            </div>

            {/* Imaging Screen Display */}
            <div className="lg:col-span-2 p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    Echocardiographic Screen & Acoustic Window Analysis
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                      output.imagingFindings.diagnosticQuality === "EXCELLENT_ACOUSTIC_WINDOW"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : output.imagingFindings.diagnosticQuality === "POOR_ACOUSTIC_WINDOW"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    Quality: {output.imagingFindings.diagnosticQuality}
                  </span>
                </div>

                {/* Visual Echo Graphic Canvas / Simulated Viewport */}
                <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden min-h-[220px] flex flex-col justify-center items-center">
                  {output.imagingFindings.acousticShadowingPresent ? (
                    <div className="text-center p-6 space-y-3">
                      <div className="inline-block p-3 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-400">
                        <AlertTriangle className="w-8 h-8" />
                      </div>
                      <h3 className="text-sm font-bold text-amber-300">
                        ACOUSTIC SHADOWING OCCLUSION (TTE LIMITATION)
                      </h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Sternal closure wires, subcutaneous mediastinal air, and surgical dressings generate dense acoustic reflections. Posterior mediastinal and left atrial spaces cannot be visualized from the anterior chest wall.
                      </p>
                      <div className="text-[11px] text-rose-400 font-semibold">
                        False Negative Risk: High. Do not rule out tamponade on negative TTE.
                      </div>
                    </div>
                  ) : params.imagingPerformed === "TEE_COMPREHENSIVE" ? (
                    <div className="w-full space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span className="font-bold text-emerald-400">TEE Transducer Position: Mid-Esophageal & Deep Transgastric</span>
                        <span className="text-slate-400">Frequency: 7.0 MHz Multiplane</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-1.5">
                          <span className="text-[10px] text-slate-400 font-semibold block">PERICARDIAL VISUALIZATION</span>
                          <span className="text-xs font-bold text-slate-200">
                            Location: {output.imagingFindings.hematomaLocation}
                          </span>
                          <div className="text-xs text-cyan-300 font-bold">
                            Hematoma Size: {output.imagingFindings.hematomaSizeCm > 0 ? `${output.imagingFindings.hematomaSizeCm} cm organized thrombus` : "None detected"}
                          </div>
                        </div>

                        <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-1.5">
                          <span className="text-[10px] text-slate-400 font-semibold block">CHAMBER COLLAPSE DYNAMICS</span>
                          <div className="text-xs text-slate-300 space-y-1">
                            <div>RA Inversion: <span className="font-bold text-amber-400">{output.imagingFindings.chamberCollapse.rightAtrialInversionDiastolicPct}% of cardiac cycle</span></div>
                            <div>RV Diastolic Collapse: <span className="font-bold text-rose-400">{output.imagingFindings.chamberCollapse.rightVentricularDiastolicCollapse ? "YES (Tense Hemopericardium)" : "No"}</span></div>
                            <div>LA Collapse / PV Obstruction: <span className="font-bold text-rose-400">{output.imagingFindings.chamberCollapse.leftAtrialCollapse ? "YES (Severe Posterior Inflow Block)" : "No"}</span></div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80 text-xs text-slate-300">
                        <span className="font-bold text-cyan-400">Deep Transgastric View: </span>
                        {output.imagingFindings.teeDeepTransgastricViewResult}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 text-xs py-8">
                      No echocardiographic transducer active. Select Bedside TTE or Comprehensive TEE on the left.
                    </div>
                  )}
                </div>

                {/* Echo Summary Box */}
                <div className="mt-4 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/90 text-xs leading-relaxed">
                  <div className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-cyan-400" /> Formal Echocardiography Report:
                  </div>
                  <p className="text-slate-300">{output.imagingFindings.clinicalEchoSummary}</p>
                </div>
              </div>

              {/* Bottom STS Recommendation */}
              <div className="mt-4 p-3 bg-cyan-950/30 border border-cyan-800/50 rounded-xl flex items-center justify-between text-xs">
                <span className="text-cyan-300 font-semibold">
                  EACVI/STS Guideline Pearl:
                </span>
                <span className="text-slate-300">
                  TEE should be performed immediately in any post-cardiac surgery patient with unexplained shock or clotted drains.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Resternotomy & CALS Protocol */}
        {activeTab === "resternotomy" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-5">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Scissors className="w-4 h-4 text-rose-400" /> Resternotomy Escalation
              </h2>

              <div className="space-y-3">
                <label className="block text-xs text-slate-400">CALS Protocol Stage:</label>
                <div className="space-y-2">
                  <button
                    onClick={() => updateParam("resternotomyPerformed", "NONE")}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition ${
                      params.resternotomyPerformed === "NONE"
                        ? "bg-slate-800 border-slate-500 text-slate-200"
                        : "bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <div className="font-bold">Stage 0: Closed Sternum</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Sternotomy wires intact, tamponade unreleased</div>
                  </button>

                  <button
                    onClick={() => updateParam("resternotomyPerformed", "CALS_CHEST_CLIPS_REMOVED")}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition ${
                      params.resternotomyPerformed === "CALS_CHEST_CLIPS_REMOVED"
                        ? "bg-amber-950/60 border-amber-500 text-amber-200 shadow-md shadow-amber-950/40"
                        : "bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <div className="font-bold text-amber-300">Stage 1: CALS Bedside Wire Cut</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Sternal wire cutters used, skin opened, partial anterior relief</div>
                  </button>

                  <button
                    onClick={() => updateParam("resternotomyPerformed", "STERNAL_WIRES_CUT_RETRACTOR_PLACED")}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition ${
                      params.resternotomyPerformed === "STERNAL_WIRES_CUT_RETRACTOR_PLACED"
                        ? "bg-rose-950/70 border-rose-500 text-rose-200 shadow-md shadow-rose-950/50"
                        : "bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <div className="font-bold text-rose-300">Stage 2: Retractor Placed & Clot Evacuated</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Finochietto opened, organized hematoma cleared, chamber decompression</div>
                  </button>

                  <button
                    onClick={() => updateParam("resternotomyPerformed", "HEMOSTASIS_AND_STERNAL_CLOSURE")}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition ${
                      params.resternotomyPerformed === "HEMOSTASIS_AND_STERNAL_CLOSURE"
                        ? "bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/40"
                        : "bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <div className="font-bold text-emerald-300">Stage 3: Surgical Hemostasis & Delayed Closure</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Active bleeder secured, new drains placed, hemodynamics normalized</div>
                  </button>
                </div>
              </div>

              {/* Recovery Meter */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5 font-semibold text-slate-300">
                  <span>Hemodynamic Recovery Score:</span>
                  <span className={`font-bold ${output.hemodynamicRecoveryScore >= 90 ? "text-emerald-400" : "text-amber-400"}`}>
                    {output.hemodynamicRecoveryScore}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      output.hemodynamicRecoveryScore >= 90
                        ? "bg-emerald-500"
                        : output.hemodynamicRecoveryScore >= 50
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${output.hemodynamicRecoveryScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* CALS Protocol Steps & Guidelines */}
            <div className="lg:col-span-2 p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Cardiac Advanced Life Support (CALS) Resternotomy Algorithm
                </h3>
                <span className="text-xs px-2 py-0.5 bg-rose-950 border border-rose-800 text-rose-300 rounded font-semibold">
                  Standard 5-Minute Window
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px]">1</span>
                    Immediate Team Activation
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Announce "Code CALS / Emergency Resternotomy". Call cardiac surgeon, anesthesiologist, perfusionist, and scrub team. Set up sterile emergency resternotomy pack at the bedside.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px]">2</span>
                    Minimize External Compressions
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    In post-cardiac surgery arrest/tamponade, prolonged CPR risks disrupting cardiac sutures, grafts, or aortic cannulation sites. Resternotomy within 5 minutes is the definitive resuscitative action.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-rose-300 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center text-[10px]">3</span>
                    Wire Cutting & Finochietto Insertion
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Cut sternal wires, remove dressing and clips. Insert Finochietto retractor and spread carefully. Manually evacuate clot from posterior pericardium, transverse sinus, and behind atria.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">4</span>
                    Hemostasis & CPB Standby
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Inspect graft anastomoses (LIMA, SVG), aortic root, and atrial cannulation sites. If uncontrolled catastrophic bleeding occurs, proceed with emergent femoral or direct aortic/atrial cannulation for CPB.
                  </p>
                </div>
              </div>

              {/* Society of Thoracic Surgeons Alert Box */}
              <div className="p-4 bg-rose-950/30 border border-rose-800/50 rounded-xl text-xs space-y-2">
                <div className="font-bold text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> STS Resternotomy Thresholds:
                </div>
                <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px]">
                  <li>Chest tube drainage &gt; 400 mL in the 1st hour, &gt; 300 mL/h for 2 hours, or &gt; 200 mL/h for 3 hours.</li>
                  <li>Sudden cessation of high bleeding followed by LCOS or rising CVP (clotted drain tamponade).</li>
                  <li>Refractory shock or PEA arrest despite adequate filling pressures and inotropes.</li>
                  <li>Echocardiographic confirmation of localized chamber compression on TEE.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Differential Diagnosis Matrix */}
        {activeTab === "differential" && (
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  Post-Cardiac Surgery Shock: 5-Phenotype Hemodynamic Matrix
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Distinguish Tamponade from Restrictive Myocardial Edema, Vasoplegia, RV Failure, and Hypovolemia.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-amber-950 border border-amber-800 text-amber-300 rounded-lg font-bold">
                Active Diagnostic Match: {output.differentialDiagnosisMatrix.diagnosis} ({output.differentialDiagnosisMatrix.confidencePct}%)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-300">
                    <th className="p-3 font-semibold">Phenotype</th>
                    <th className="p-3 font-semibold">CVP / PCWP</th>
                    <th className="p-3 font-semibold">CVP Waveform</th>
                    <th className="p-3 font-semibold">Pulsus Paradoxus</th>
                    <th className="p-3 font-semibold">TEE Hallmark</th>
                    <th className="p-3 font-semibold">Primary Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr className={output.differentialDiagnosisMatrix.diagnosis === "POST_OP_TAMPONADE" ? "bg-rose-950/30" : ""}>
                    <td className="p-3 font-bold text-rose-400">Post-Op Tamponade</td>
                    <td className="p-3 text-slate-300">Equalized (CVP ≈ PAD ≈ PCWP)</td>
                    <td className="p-3 text-amber-300">Loss of y descent (preserved x)</td>
                    <td className="p-3 text-amber-300">BLUNTED (&lt; 10 mmHg) or absent</td>
                    <td className="p-3 text-cyan-300">Localized posterior RA/LA hematoma</td>
                    <td className="p-3 font-semibold text-rose-300">Emergency Resternotomy / Re-exploration</td>
                  </tr>

                  <tr className={output.differentialDiagnosisMatrix.diagnosis === "RESTRICTIVE_PHYSIOLOGY" ? "bg-indigo-950/30" : ""}>
                    <td className="p-3 font-bold text-indigo-400">Restrictive Physiology</td>
                    <td className="p-3 text-slate-300">Elevated (CVP &gt; 15, PCWP &gt; 18)</td>
                    <td className="p-3 text-indigo-300">Sharp y descent (Square root sign)</td>
                    <td className="p-3 text-slate-400">Absent / normal respirophasic</td>
                    <td className="p-3 text-cyan-300">No hematoma; low tissue e' &lt; 5 cm/s</td>
                    <td className="p-3 font-semibold text-indigo-300">Milrinone, diuresis, avoid resternotomy</td>
                  </tr>

                  <tr className={output.differentialDiagnosisMatrix.diagnosis === "VASOPLEGIA" ? "bg-purple-950/30" : ""}>
                    <td className="p-3 font-bold text-purple-400">Post-CPB Vasoplegia</td>
                    <td className="p-3 text-slate-300">Low / normal (CVP &lt; 8, PCWP &lt; 10)</td>
                    <td className="p-3 text-slate-400">Normal morphology, low mean</td>
                    <td className="p-3 text-slate-400">Absent</td>
                    <td className="p-3 text-cyan-300">Hyperdynamic LV (EF &gt; 70%), empty space</td>
                    <td className="p-3 font-semibold text-purple-300">Vasopressin, Norepi, Methylene Blue</td>
                  </tr>

                  <tr className={output.differentialDiagnosisMatrix.diagnosis === "ISOLATED_RV_FAILURE" ? "bg-teal-950/30" : ""}>
                    <td className="p-3 font-bold text-teal-400">Isolated RV Failure</td>
                    <td className="p-3 text-slate-300">Wide gradient (High CVP, Low PCWP)</td>
                    <td className="p-3 text-teal-300">Giant v waves (TR), steep y descent</td>
                    <td className="p-3 text-slate-400">Absent</td>
                    <td className="p-3 text-cyan-300">Severely dilated RV, D-shaped LV</td>
                    <td className="p-3 font-semibold text-teal-300">Inhaled prostacyclin/iNO, RV inotrope</td>
                  </tr>

                  <tr className={output.differentialDiagnosisMatrix.diagnosis === "HYPOVOLEMIA" ? "bg-slate-800/30" : ""}>
                    <td className="p-3 font-bold text-slate-300">Hypovolemia / Bleeding</td>
                    <td className="p-3 text-slate-300">Low (CVP &lt; 6, PCWP &lt; 8)</td>
                    <td className="p-3 text-slate-400">Flattened waveforms</td>
                    <td className="p-3 text-slate-400">Absent</td>
                    <td className="p-3 text-cyan-300">Kissing LV papillary muscles</td>
                    <td className="p-3 font-semibold text-slate-300">Fluid challenge, blood transfusion</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-xs text-slate-200">
                Key Distinguishing Features for Current Patient:
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                {output.differentialDiagnosisMatrix.keyDistinguishingFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-slate-800/80 text-xs text-amber-300">
                <span className="font-bold">Targeted Management: </span>
                {output.differentialDiagnosisMatrix.recommendedManagement}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: ICU Titration & Drain Safety Console */}
        {activeTab === "icu_titration" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-5">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" /> Hemodynamic & Drainage Controls
              </h2>

              {/* Chest Drain Controls */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300">Chest Drain Flow Rate:</span>
                  <span className="text-rose-400 font-bold">{params.chestTubeDrainageRateMlPerHour} mL/h</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="5"
                  value={params.chestTubeDrainageRateMlPerHour}
                  onChange={e => updateParam("chestTubeDrainageRateMlPerHour", Number(e.target.value))}
                  className="w-full accent-rose-500"
                />

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={params.chestTubeClottedOrKinked}
                      onChange={e => updateParam("chestTubeClottedOrKinked", e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-red-600 focus:ring-0"
                    />
                    <span className="font-semibold text-rose-300">Simulate Drain Clot / Occlusion</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={params.drainMilkingOrStrippingAttempted}
                      onChange={e => updateParam("drainMilkingOrStrippingAttempted", e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-amber-600 focus:ring-0"
                    />
                    <span className="text-amber-300">Attempt Drain Stripping</span>
                  </label>
                </div>
              </div>

              {/* Fluid Bolus */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300">IV Fluid Bolus (Crystalloid / Colloid):</span>
                  <span className="text-cyan-400 font-bold">{params.fluidBolusGivenMl} mL</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={params.fluidBolusGivenMl}
                  onChange={e => updateParam("fluidBolusGivenMl", Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <p className="text-[11px] text-slate-400">
                  Temporary preload bridge in tamponade; caution: exacerbates RV failure and septal bowing.
                </p>
              </div>

              {/* Vasoactive Inotropic Score */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300">Inotropic / Vasopressor Score (VIS):</span>
                  <span className="text-amber-400 font-bold">{params.inotropicVasopressorScore}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={params.inotropicVasopressorScore}
                  onChange={e => updateParam("inotropicVasopressorScore", Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <p className="text-[11px] text-slate-400">
                  Norepinephrine, Epinephrine, and Milrinone titration index. Escalating requirements signal unreleased tamponade.
                </p>
              </div>

              {/* Ventilator PEEP */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300">Mechanical Ventilator PEEP:</span>
                  <span className="text-purple-400 font-bold">{params.mechanicalVentilationPeepCmH2O} cmH₂O</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="15"
                  step="1"
                  value={params.mechanicalVentilationPeepCmH2O}
                  onChange={e => updateParam("mechanicalVentilationPeepCmH2O", Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>

            {/* ICU Safety Guidance & Drain Pitfalls */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Chest Tube Stripping & Mediastinal Management Hazards
              </h3>

              {output.chestDrainManagementSafetyAlert ? (
                <div className="p-4 bg-amber-950/40 border border-amber-800 rounded-xl text-xs text-amber-200 leading-relaxed">
                  <span className="font-bold block mb-1">HAZARDOUS STRIPPING WARNING:</span>
                  {output.chestDrainManagementSafetyAlert}
                </div>
              ) : (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
                  Chest tube stripping is currently disabled. In cardiac ICU practice, routine stripping is strongly discouraged due to high suction transients (-300 cmH₂O) that injure bypass grafts.
                </div>
              )}

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div className="font-bold text-cyan-300">Evidence-Based Mediastinal Drain Protocols:</div>
                <div className="space-y-2 text-slate-300 text-[11px] leading-relaxed">
                  <p>
                    <strong>1. Gentle Tapping / Milking Only:</strong> If tube clearance is attempted, use gentle squeeze-and-release without creating extreme suction transients.
                  </p>
                  <p>
                    <strong>2. Sudden Cessation Red Flag:</strong> If a patient with active bleeding suddenly drops from 150 mL/h to &lt; 20 mL/h, assume tube occlusion until proven otherwise.
                  </p>
                  <p>
                    <strong>3. Active Tube Clearance Systems:</strong> Magnetically-guided internal clearance wires reduce tamponade incidence compared to manual external manipulation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clinical Alerts Box */}
        {output.clinicalAlerts.length > 0 && (
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" /> Active Clinical Alerts & Practice Pitfalls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {output.clinicalAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    alert.level === "CRITICAL"
                      ? "bg-rose-950/40 border-rose-800/80 text-rose-200"
                      : alert.level === "WARNING"
                      ? "bg-amber-950/40 border-amber-800/80 text-amber-200"
                      : alert.level === "SUCCESS"
                      ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-200"
                      : "bg-slate-950 border-slate-800 text-slate-300"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    {alert.level === "CRITICAL" ? (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : alert.level === "WARNING" ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <span>{alert.message}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{alert.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
