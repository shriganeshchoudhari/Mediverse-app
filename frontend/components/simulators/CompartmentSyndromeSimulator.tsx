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
  Layers,
  ArrowRight,
  Eye,
  Info,
  Gauge,
  Heart,
  Thermometer,
  Zap
} from "lucide-react";
import {
  CompartmentSyndromePatientParams,
  AnatomicalRegion,
  TraumaEtiology,
  SurgicalIntervention,
  DEFAULT_COMPARTMENT_PATIENT,
  simulateCompartmentSyndrome
} from "../../.gemini/skills/CompartmentSyndromeEngine";

export default function CompartmentSyndromeSimulator() {
  const [params, setParams] = useState<CompartmentSyndromePatientParams>(DEFAULT_COMPARTMENT_PATIENT);
  const [activeTab, setActiveTab] = useState<"transduction" | "fasciotomy" | "rhabdomyolysis" | "exam">("transduction");

  const output = useMemo(() => simulateCompartmentSyndrome(params), [params]);

  const updateParam = <K extends keyof CompartmentSyndromePatientParams>(
    key: K,
    value: CompartmentSyndromePatientParams[K]
  ) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const updatePressure = (
    compartment: "anteriorMmHg" | "lateralMmHg" | "superficialPosteriorMmHg" | "deepPosteriorMmHg",
    value: number
  ) => {
    setParams(prev => ({
      ...prev,
      measuredCompartmentPressures: {
        ...prev.measuredCompartmentPressures,
        [compartment]: value
      }
    }));
  };

  // Case Vignettes / Presets
  const applyPreset = (
    presetKey:
      | "tibia_fracture_classic"
      | "hypotensive_shock_delta_p"
      | "incomplete_fasciotomy_volkmann"
      | "crush_injury_rhabdo"
      | "circumferential_burn_escharotomy"
  ) => {
    switch (presetKey) {
      case "tibia_fracture_classic":
        setParams({
          ...DEFAULT_COMPARTMENT_PATIENT,
          region: "LOWER_LEG_TIBIA_FIBULA",
          etiology: "CLOSED_TIBIAL_SHAFT_FRACTURE",
          systolicBpMmHg: 115,
          diastolicBpMmHg: 70,
          hoursSinceInjury: 4,
          externalCastPresent: true,
          castBivalvedToSkin: false,
          measuredCompartmentPressures: {
            anteriorMmHg: 45,
            lateralMmHg: 38,
            superficialPosteriorMmHg: 30,
            deepPosteriorMmHg: 40
          },
          surgicalProcedure: "NONE_CONSERVATIVE",
          urineAlkalinizationActive: false,
          ivFluidRateMlPerHour: 150
        });
        break;
      case "hypotensive_shock_delta_p":
        setParams({
          ...DEFAULT_COMPARTMENT_PATIENT,
          region: "LOWER_LEG_TIBIA_FIBULA",
          etiology: "CLOSED_TIBIAL_SHAFT_FRACTURE",
          systolicBpMmHg: 80,
          diastolicBpMmHg: 48,
          hoursSinceInjury: 3,
          externalCastPresent: false,
          castBivalvedToSkin: false,
          measuredCompartmentPressures: {
            anteriorMmHg: 26, // Absolute < 30 mmHg!
            lateralMmHg: 22,
            superficialPosteriorMmHg: 20,
            deepPosteriorMmHg: 25
          },
          surgicalProcedure: "NONE_CONSERVATIVE",
          urineAlkalinizationActive: false,
          ivFluidRateMlPerHour: 250
        });
        break;
      case "incomplete_fasciotomy_volkmann":
        setParams({
          ...DEFAULT_COMPARTMENT_PATIENT,
          region: "LOWER_LEG_TIBIA_FIBULA",
          etiology: "CLOSED_TIBIAL_SHAFT_FRACTURE",
          systolicBpMmHg: 120,
          diastolicBpMmHg: 75,
          hoursSinceInjury: 6,
          externalCastPresent: false,
          castBivalvedToSkin: false,
          measuredCompartmentPressures: {
            anteriorMmHg: 44,
            lateralMmHg: 36,
            superficialPosteriorMmHg: 32,
            deepPosteriorMmHg: 42
          },
          surgicalProcedure: "SINGLE_INCISION_INCOMPLETE_FASCIOTOMY",
          urineAlkalinizationActive: false,
          ivFluidRateMlPerHour: 150
        });
        break;
      case "crush_injury_rhabdo":
        setParams({
          ...DEFAULT_COMPARTMENT_PATIENT,
          region: "LOWER_LEG_TIBIA_FIBULA",
          etiology: "CRUSH_INJURY_PROLONGED_COMPRESSION",
          systolicBpMmHg: 105,
          diastolicBpMmHg: 62,
          hoursSinceInjury: 8,
          externalCastPresent: false,
          castBivalvedToSkin: false,
          measuredCompartmentPressures: {
            anteriorMmHg: 52,
            lateralMmHg: 46,
            superficialPosteriorMmHg: 40,
            deepPosteriorMmHg: 48
          },
          surgicalProcedure: "NONE_CONSERVATIVE",
          urineAlkalinizationActive: false,
          ivFluidRateMlPerHour: 100
        });
        break;
      case "circumferential_burn_escharotomy":
        setParams({
          ...DEFAULT_COMPARTMENT_PATIENT,
          region: "CIRCUMFERENTIAL_TORSO_LIMB_BURN",
          etiology: "FULL_THICKNESS_CIRCUMFERENTIAL_BURN",
          systolicBpMmHg: 110,
          diastolicBpMmHg: 68,
          hoursSinceInjury: 5,
          externalCastPresent: false,
          castBivalvedToSkin: false,
          measuredCompartmentPressures: {
            anteriorMmHg: 48,
            lateralMmHg: 44,
            superficialPosteriorMmHg: 38,
            deepPosteriorMmHg: 42
          },
          surgicalProcedure: "EMERGENCY_ESCHAROTOMY_MIDAXIAL",
          urineAlkalinizationActive: true,
          ivFluidRateMlPerHour: 300
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
                <Activity className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-rose-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
                  Acute Compartment Syndrome & Fasciotomy Workstation
                </h1>
                <p className="text-sm text-slate-400">
                  Intracompartmental Pressure Transduction, McQueen Delta Pressure (ΔP ≤ 30 mmHg), Two-Incision Four-Compartment Decompression, and Crush Syndrome Nephroprotection
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-rose-950/60 border border-rose-800/60 text-rose-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Track B34 (Route #235)
            </span>
            <span className="px-3 py-1 bg-amber-950/60 border border-amber-800/60 text-amber-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> McQueen ΔP Criteria
            </span>
            <span className="px-3 py-1 bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5" /> 4-Compartment Fasciotomy
            </span>
          </div>
        </div>

        {/* Case Presets Navigation */}
        <div className="mt-4 p-3 bg-slate-900/70 border border-slate-800/80 rounded-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-rose-400" /> Clinical Scenarios & Practice Vignettes:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            <button
              onClick={() => applyPreset("tibia_fracture_classic")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.etiology === "CLOSED_TIBIAL_SHAFT_FRACTURE" && params.systolicBpMmHg === 115
                  ? "bg-rose-950/80 border-rose-500 text-rose-200 shadow-md shadow-rose-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>1. Tibial Fracture ACS</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-rose-900/50 text-rose-300 rounded">Classic</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Anterior ICP 45, pain on stretch, cast in place, ΔP 25 mmHg, urgent fasciotomy.
              </p>
            </button>

            <button
              onClick={() => applyPreset("hypotensive_shock_delta_p")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.diastolicBpMmHg === 48
                  ? "bg-amber-950/80 border-amber-500 text-amber-200 shadow-md shadow-amber-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>2. Shock & Delta P ≤ 30</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-900/50 text-amber-300 rounded">Occult</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                DBP 48, ICP 26 (absolute &lt; 30), ΔP 22 mmHg confirms ACS in trauma shock.
              </p>
            </button>

            <button
              onClick={() => applyPreset("incomplete_fasciotomy_volkmann")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.surgicalProcedure === "SINGLE_INCISION_INCOMPLETE_FASCIOTOMY"
                  ? "bg-red-950/80 border-red-500 text-red-200 shadow-md shadow-red-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>3. Incomplete Fasciotomy</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-red-900 text-red-200 rounded">Pitfall</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Single incision misses deep posterior; unreleased flexors risk Volkmann claw contracture.
              </p>
            </button>

            <button
              onClick={() => applyPreset("crush_injury_rhabdo")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.etiology === "CRUSH_INJURY_PROLONGED_COMPRESSION"
                  ? "bg-purple-950/80 border-purple-500 text-purple-200 shadow-md shadow-purple-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>4. Crush & Rhabdomyolysis</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-purple-900 text-purple-200 rounded">Crush Syn</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                CK &gt; 30,000 U/L, port-wine urine, myoglobinuria, sodium bicarb alkalinization required.
              </p>
            </button>

            <button
              onClick={() => applyPreset("circumferential_burn_escharotomy")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.etiology === "FULL_THICKNESS_CIRCUMFERENTIAL_BURN"
                  ? "bg-orange-950/80 border-orange-500 text-orange-200 shadow-md shadow-orange-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>5. Burn Escharotomy</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-orange-900 text-orange-200 rounded">Eschar</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Full-thickness leather eschar creates tourniquet; mid-axial escharotomy restores perfusion.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Hero 4-Panel Hemodynamic & Pressure Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Panel 1: Pressure & Perfusion Benchmark */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-cyan-400" /> Compartment Pressure
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.fasciotomyIndicated
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                    : output.highestIntracompartmentalPressureMmHg >= 30
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                }`}
              >
                {output.fasciotomyIndicated ? "FASCIOTOMY INDICATED" : output.highestIntracompartmentalPressureMmHg >= 30 ? "CRITICAL PRESSURE" : "NORMAL PERFUSION"}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${output.highestIntracompartmentalPressureMmHg >= 30 ? "text-rose-400" : "text-emerald-400"}`}>
                  {output.highestIntracompartmentalPressureMmHg}
                </span>
                <span className="text-xs text-slate-400">mmHg (Peak ICP)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">DELTA PRESSURE (ΔP)</span>
                  <span className={`font-bold text-sm ${output.deltaPressureMmHg <= 30 ? "text-rose-400" : "text-emerald-400"}`}>
                    {output.deltaPressureMmHg} mmHg
                  </span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">DIASTOLIC BP</span>
                  <span className="font-bold text-sm text-cyan-300">
                    {params.diastolicBpMmHg} mmHg
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>McQueen ΔP ≤ 30 mmHg:</span>
            <span className={`font-bold ${output.deltaPressureDiagnosticForAcs ? "text-rose-400" : "text-emerald-400"}`}>
              {output.deltaPressureDiagnosticForAcs ? "DIAGNOSTIC (POSITIVE)" : "NEGATIVE"}
            </span>
          </div>
        </div>

        {/* Panel 2: Lower Leg 4-Compartment Breakdown */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" /> 4-Compartment Breakdown
              </span>
              <span className="text-[10px] text-slate-400">Normal: 0-8 mmHg</span>
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-xs">
              {output.compartmentBreakdown.map((comp, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg border ${
                    comp.pressureMmHg >= 30
                      ? "bg-rose-950/40 border-rose-800 text-rose-200"
                      : comp.decompressed
                      ? "bg-emerald-950/40 border-emerald-800 text-emerald-200"
                      : "bg-slate-950/60 border-slate-800 text-slate-300"
                  }`}
                >
                  <div className="text-[10px] font-bold truncate">
                    {comp.compartmentName.replace("_", " ")}
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-base font-bold">{comp.pressureMmHg}</span>
                    <span className="text-[9px] opacity-70">mmHg</span>
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5 truncate">
                    {comp.decompressed ? "Decompressed" : comp.ischemiaSeverity}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 line-clamp-1">
            Deep Posterior: <span className={output.incompleteDecompressionPitfall ? "text-rose-400 font-bold" : "text-slate-300"}>{output.incompleteDecompressionPitfall ? "UNRELEASED PITFALL" : "Monitored"}</span>
          </div>
        </div>

        {/* Panel 3: The 6 P's Clinical Signs */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-400" /> The "6 P's" Signs
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.clinicalExam.painOnPassiveStretch
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {output.clinicalExam.painOnPassiveStretch ? "STRETCH PAIN +" : "STRETCH PAIN -"}
              </span>
            </div>
            <div className="mt-2.5 space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">1. Pain Out of Proportion:</span>
                <span className={`font-bold ${output.clinicalExam.painOutOfProportion ? "text-rose-400" : "text-slate-300"}`}>
                  {output.clinicalExam.painOutOfProportion ? "YES (Opioid Refractory)" : "No"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">2. Pain on Passive Stretch:</span>
                <span className={`font-bold ${output.clinicalExam.painOnPassiveStretch ? "text-rose-400 font-black" : "text-slate-300"}`}>
                  {output.clinicalExam.painOnPassiveStretch ? "POSITIVE (Earliest Sign)" : "Negative"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">3. Pressure / Woodiness:</span>
                <span className={`font-bold ${output.clinicalExam.tenseWoodiness ? "text-amber-400" : "text-slate-300"}`}>
                  {output.clinicalExam.tenseWoodiness ? "TENSE WOODINESS" : "Soft"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">4. Paresthesias:</span>
                <span className={`font-bold ${output.clinicalExam.paresthesias ? "text-amber-300" : "text-slate-300"}`}>
                  {output.clinicalExam.paresthesias ? "YES (Web Space / Sole)" : "No"}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Distal Pulses Palpable:</span>
            <span className="font-bold text-emerald-400">{output.clinicalExam.palpableDistalPulses ? "YES (Palpable)" : "ABSENT (Late)"}</span>
          </div>
        </div>

        {/* Panel 4: Rhabdomyolysis & Renal Kinetics */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-purple-400" /> Rhabdo & Renal Kinetics
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.acuteKidneyInjuryRisk === "HIGH_CRUSH_SYNDROME_RISK" || output.acuteKidneyInjuryRisk === "ESTABLISHED_ATN"
                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {output.acuteKidneyInjuryRisk}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Serum Creatine Kinase (CK):</span>
                <span className={`font-bold ${output.serumCreatineKinaseUL >= 10000 ? "text-rose-400" : "text-slate-200"}`}>
                  {output.serumCreatineKinaseUL} U/L
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Urine Appearance:</span>
                <span className={`font-bold ${output.urineColorAppearance === "DARK_RED_PORT_WINE" ? "text-rose-400" : output.urineColorAppearance === "TEA_COLORED_BROWN" ? "text-amber-400" : "text-emerald-400"}`}>
                  {output.urineColorAppearance.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Urine pH:</span>
                <span className={`font-bold ${output.urinePh >= 6.5 ? "text-emerald-400" : "text-amber-400"}`}>
                  {output.urinePh} {output.urinePh >= 6.5 ? "(Alkalinized)" : "(Acidic)"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Serum Potassium (K⁺):</span>
                <span className={`font-bold ${output.serumPotassiumMeqL >= 5.5 ? "text-rose-400" : "text-cyan-300"}`}>
                  {output.serumPotassiumMeqL} mEq/L
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
            Limb Salvage Score: <span className="font-bold text-emerald-400">{output.limbSalvageSuccessScore}%</span>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex border-b border-slate-800 gap-2">
          <button
            onClick={() => setActiveTab("transduction")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "transduction"
                ? "border-cyan-500 text-cyan-400 bg-cyan-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Gauge className="w-4 h-4" /> 1. Stryker Needle Transduction & Pressures
          </button>
          <button
            onClick={() => setActiveTab("fasciotomy")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "fasciotomy"
                ? "border-rose-500 text-rose-400 bg-rose-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Scissors className="w-4 h-4" /> 2. Two-Incision Four-Compartment Fasciotomy
          </button>
          <button
            onClick={() => setActiveTab("rhabdomyolysis")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "rhabdomyolysis"
                ? "border-purple-500 text-purple-400 bg-purple-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Droplets className="w-4 h-4" /> 3. Rhabdomyolysis & Crush Nephroprotection
          </button>
          <button
            onClick={() => setActiveTab("exam")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "exam"
                ? "border-emerald-500 text-emerald-400 bg-emerald-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-4 h-4" /> 4. The 6 P's & Physical Exam Bench
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Tab 1: Stryker Needle Transduction */}
        {activeTab === "transduction" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-5">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" /> Intracompartmental Pressure Manometry
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-300">Anterior Compartment:</span>
                    <span className={`font-bold ${params.measuredCompartmentPressures.anteriorMmHg >= 30 ? "text-rose-400" : "text-slate-200"}`}>
                      {params.measuredCompartmentPressures.anteriorMmHg} mmHg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="1"
                    value={params.measuredCompartmentPressures.anteriorMmHg}
                    onChange={e => updatePressure("anteriorMmHg", Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                  <span className="text-[10px] text-slate-400 block">Deep Peroneal Nerve • 1st Web Space Sensation</span>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-300">Lateral Compartment:</span>
                    <span className={`font-bold ${params.measuredCompartmentPressures.lateralMmHg >= 30 ? "text-rose-400" : "text-slate-200"}`}>
                      {params.measuredCompartmentPressures.lateralMmHg} mmHg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="1"
                    value={params.measuredCompartmentPressures.lateralMmHg}
                    onChange={e => updatePressure("lateralMmHg", Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <span className="text-[10px] text-slate-400 block">Superficial Peroneal Nerve • Foot Eversion</span>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-300">Superficial Posterior Compartment:</span>
                    <span className={`font-bold ${params.measuredCompartmentPressures.superficialPosteriorMmHg >= 30 ? "text-rose-400" : "text-slate-200"}`}>
                      {params.measuredCompartmentPressures.superficialPosteriorMmHg} mmHg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="1"
                    value={params.measuredCompartmentPressures.superficialPosteriorMmHg}
                    onChange={e => updatePressure("superficialPosteriorMmHg", Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <span className="text-[10px] text-slate-400 block">Gastrocnemius / Soleus • Sural Nerve</span>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-300">Deep Posterior Compartment:</span>
                    <span className={`font-bold ${params.measuredCompartmentPressures.deepPosteriorMmHg >= 30 ? "text-rose-400" : "text-slate-200"}`}>
                      {params.measuredCompartmentPressures.deepPosteriorMmHg} mmHg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="1"
                    value={params.measuredCompartmentPressures.deepPosteriorMmHg}
                    onChange={e => updatePressure("deepPosteriorMmHg", Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                  <span className="text-[10px] text-slate-400 block">Tibialis Posterior / FDL / FHL • Tibial Nerve (Sole of Foot)</span>
                </div>
              </div>

              {/* Cast Toggle */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-amber-300">External Cast & Dressing Interventions:</div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={params.externalCastPresent}
                      onChange={e => updateParam("externalCastPresent", e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-0"
                    />
                    <span>Circumferential Cast / Splint in Place</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={params.castBivalvedToSkin}
                      onChange={e => updateParam("castBivalvedToSkin", e.target.checked)}
                      disabled={!params.externalCastPresent}
                      className="rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0"
                    />
                    <span className={params.externalCastPresent ? "text-emerald-300 font-semibold" : "text-slate-500"}>
                      Bivalve Cast & Padding to Skin
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* McQueen Criteria & Perfusion Calculation Screen */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> McQueen Delta Pressure (ΔP) Criteria
              </h3>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
                  <div className="font-bold text-cyan-300 mb-1">Perfusion Pressure Formula:</div>
                  <p className="font-mono text-xs text-amber-300">
                    ΔP = Diastolic Blood Pressure ({params.diastolicBpMmHg} mmHg) - Peak ICP ({output.highestIntracompartmentalPressureMmHg} mmHg) = {output.deltaPressureMmHg} mmHg
                  </p>
                  <p className="mt-1 text-slate-400">
                    Diagnostic Rule: If <strong>ΔP ≤ 30 mmHg</strong>, capillary perfusion is arrested regardless of absolute pressure. In hypotensive patients, a pressure of 25 mmHg can cause necrosis if DBP is 45 mmHg (ΔP = 20 mmHg)!
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">ABSOLUTE PRESSURE THRESHOLD</span>
                    <span className={`font-bold text-sm ${output.absolutePressureDiagnosticForAcs ? "text-rose-400" : "text-emerald-400"}`}>
                      {output.absolutePressureDiagnosticForAcs ? "≥ 30 mmHg (DIAGNOSTIC)" : "< 30 mmHg"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">DELTA PRESSURE THRESHOLD</span>
                    <span className={`font-bold text-sm ${output.deltaPressureDiagnosticForAcs ? "text-rose-400" : "text-emerald-400"}`}>
                      {output.deltaPressureDiagnosticForAcs ? "ΔP ≤ 30 mmHg (DIAGNOSTIC)" : "ΔP > 30 mmHg"}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Diastolic BP Slider (Trauma Shock Model):</span>
                    <span className="font-bold text-cyan-300">{params.diastolicBpMmHg} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    step="1"
                    value={params.diastolicBpMmHg}
                    onChange={e => updateParam("diastolicBpMmHg", Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Two-Incision Four-Compartment Fasciotomy */}
        {activeTab === "fasciotomy" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Scissors className="w-4 h-4 text-rose-400" /> Surgical Technique Selector
              </h3>

              <div className="space-y-2 text-xs">
                <button
                  onClick={() => updateParam("surgicalProcedure", "TWO_INCISION_FOUR_COMPARTMENT_FASCIOTOMY")}
                  className={`w-full p-3.5 rounded-xl border text-left transition ${
                    params.surgicalProcedure === "TWO_INCISION_FOUR_COMPARTMENT_FASCIOTOMY"
                      ? "bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/50"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>Two-Incision Four-Compartment Fasciotomy</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-900 text-emerald-200 rounded">Gold Standard</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Anterolateral incision releases Anterior & Lateral compartments. Posteromedial incision releases Superficial & Deep Posterior compartments (releasing tibialis posterior fascia).
                  </p>
                </button>

                <button
                  onClick={() => updateParam("surgicalProcedure", "SINGLE_INCISION_INCOMPLETE_FASCIOTOMY")}
                  className={`w-full p-3.5 rounded-xl border text-left transition ${
                    params.surgicalProcedure === "SINGLE_INCISION_INCOMPLETE_FASCIOTOMY"
                      ? "bg-red-950/80 border-red-500 text-red-200 shadow-md shadow-red-950/50 animate-pulse"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between text-red-300">
                    <span>Single-Incision Fasciotomy (Incomplete Pitfall)</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-red-900 text-red-100 rounded">Volkmann Risk</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    High failure rate: releases anterior, lateral, and superficial posterior, but fails to reach or unroof the Deep Posterior compartment.
                  </p>
                </button>

                <button
                  onClick={() => updateParam("surgicalProcedure", "EMERGENCY_ESCHAROTOMY_MIDAXIAL")}
                  className={`w-full p-3.5 rounded-xl border text-left transition ${
                    params.surgicalProcedure === "EMERGENCY_ESCHAROTOMY_MIDAXIAL"
                      ? "bg-amber-950/60 border-amber-500 text-amber-200"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>Emergency Mid-Axial Escharotomy (Burn)</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-amber-900 text-amber-200 rounded">Burn Eschar</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Full-thickness incision through burned dermis into subcutaneous fat along medial/lateral mid-axial lines.
                  </p>
                </button>

                <button
                  onClick={() => updateParam("surgicalProcedure", "NONE_CONSERVATIVE")}
                  className={`w-full p-3 rounded-xl border text-left transition ${
                    params.surgicalProcedure === "NONE_CONSERVATIVE"
                      ? "bg-slate-800 border-slate-600 text-slate-200"
                      : "bg-slate-950/40 border-slate-800 text-slate-500 hover:bg-slate-800"
                  }`}
                >
                  No Surgical Intervention (Observation / Non-Decompressed)
                </button>
              </div>
            </div>

            {/* Surgical Pitfall & Volkmann Contracture Screen */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Incomplete Decompression Pitfall
              </h3>

              {output.incompleteDecompressionPitfall ? (
                <div className="p-4 bg-red-950/60 border border-red-800 rounded-xl space-y-2 text-xs text-red-200 leading-relaxed">
                  <div className="font-bold text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    DEEP POSTERIOR COMPARTMENT MISSED
                  </div>
                  <p>
                    The Deep Posterior compartment contains the Tibialis Posterior, Flexor Hallucis Longus, Flexor Digitorum Longus, and the Tibial Nerve. Because it lies beneath the soleus fascia on the posterior tibia, it cannot be safely or completely released from an anterolateral incision alone!
                  </p>
                  <div className="p-2.5 bg-black/40 rounded border border-red-900/60 font-semibold text-rose-300">
                    Volkmann Ischemic Contracture: Irreversible claw toe deformity, equinovarus foot, and permanent plantar numbness.
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300 leading-relaxed">
                  <div className="font-bold text-cyan-300">Two-Incision Anatomic Pearls:</div>
                  <p>
                    <strong>1. Anterolateral Incision:</strong> Placed 2 cm anterior to the fibula. Identify the intermuscular septum. Make a longitudinal transverse incision anteriorly into the Anterior compartment (avoiding the superficial peroneal nerve) and posteriorly into the Lateral compartment.
                  </p>
                  <p>
                    <strong>2. Posteromedial Incision:</strong> Placed 2 cm posterior to the posterior border of the tibia (safeguarding the greater saphenous vein/nerve). Incise deep fascia over gastrocnemius-soleus, then detach the soleus bridge from the tibia to widely enter the Deep Posterior compartment.
                  </p>
                </div>
              )}

              {/* Time Window Clock */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-300">Duration of Ischemia:</span>
                  <span className={`font-bold ${params.hoursSinceInjury >= 6 ? "text-rose-400" : "text-amber-300"}`}>
                    {params.hoursSinceInjury} Hours Post-Injury
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="16"
                  step="1"
                  value={params.hoursSinceInjury}
                  onChange={e => updateParam("hoursSinceInjury", Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Reversible (&lt; 4h)</span>
                  <span>Threatened (4-6h)</span>
                  <span>Irreversible Necrosis (&gt; 6-8h)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Rhabdomyolysis & Crush Syndrome */}
        {activeTab === "rhabdomyolysis" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Droplets className="w-4 h-4 text-purple-400" /> Fluid Resuscitation & Urine Alkalinization
              </h3>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-300">IV Hydration Fluid Rate:</span>
                  <span className="text-cyan-400 font-bold">{params.ivFluidRateMlPerHour} mL/h</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="25"
                  value={params.ivFluidRateMlPerHour}
                  onChange={e => updateParam("ivFluidRateMlPerHour", Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <p className="text-[11px] text-slate-400">
                  Target urine output for rhabdomyolysis is 200-300 mL/h (or 2-3 mL/kg/h) to flush myoglobin casts from renal tubules.
                </p>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={params.urineAlkalinizationActive}
                      onChange={e => updateParam("urineAlkalinizationActive", e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span className="font-bold text-purple-300">Administer IV Sodium Bicarbonate Alkalinization</span>
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Alkalinizes urine (target pH ≥ 6.5). Prevents dissociation of myoglobin into ferrihemate and blocks cast precipitation with Tamm-Horsfall proteins.
                  </p>
                </div>
              </div>
            </div>

            {/* Crush Injury Pathophysiology */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> Crush Syndrome / Rhabdo Pathophysiology
              </h3>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5 text-xs text-slate-300 text-[11px] leading-relaxed">
                <div className="font-bold text-amber-300">Myoglobin Ferrihemate Mechanism:</div>
                <p>
                  1. Myocytes deprived of perfusion deplete ATP, allowing unchecked calcium influx and activation of intracellular proteases, producing extensive myolysis.
                </p>
                <p>
                  2. Lysis releases large quantities of myoglobin, potassium (hyperkalemia cardiac arrest risk), and creatine kinase (CK &gt; 10,000-50,000 U/L).
                </p>
                <p>
                  3. In acidic urine (pH &lt; 5.6), myoglobin precipitates into toxic ferrihemate, causing renal vasoconstriction and direct proximal tubular injury.
                </p>
                <p>
                  4. Sodium Bicarbonate infusion neutralizes tubular acidity, preventing ferrihemate crystallization and converting heme pigments into non-toxic soluble forms.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: The 6 P's & Exam Bench */}
        {activeTab === "exam" && (
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" /> The "6 P's" Comprehensive Bedside Examination
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-bold text-rose-300 flex items-center justify-between">
                  <span>1. Pain Out of Proportion</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-rose-950 text-rose-400 rounded">Earliest Symptom</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Severe crescendo pain escalating despite high-dose opioids. Hallmark of muscular ischemia.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-bold text-rose-300 flex items-center justify-between">
                  <span>2. Pain on Passive Stretch</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-rose-950 text-rose-400 rounded">Most Sensitive Sign</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Passive toe flexion stretches anterior compartment; passive dorsiflexion stretches posterior compartment.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-bold text-amber-300 flex items-center justify-between">
                  <span>3. Pressure / Woodiness</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-950 text-amber-400 rounded">Objective Sign</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Tense, woody palpation of the compartment. Indication for objective Stryker needle transduction.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-bold text-amber-300 flex items-center justify-between">
                  <span>4. Paresthesias</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-950 text-amber-400 rounded">Nerve Ischemia</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Sensory nerves are highly vulnerable to ischemia within 30-120 minutes. 1st web space (deep peroneal) and sole (tibial).
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-bold text-purple-300 flex items-center justify-between">
                  <span>5. Paresis / Motor Loss</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-purple-950 text-purple-400 rounded">Late / Severe</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Foot drop, weak great toe extension. Indicates established ischemic nerve and muscle damage.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-bold text-red-300 flex items-center justify-between">
                  <span>6. Pulselessness / Pallor</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-red-950 text-red-200 rounded">Grave Sign</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Extremely late sign. Distal pulses are usually preserved because systolic pressure exceeds compartment pressure. Waiting for pulselessness leads to amputation.
                </p>
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
