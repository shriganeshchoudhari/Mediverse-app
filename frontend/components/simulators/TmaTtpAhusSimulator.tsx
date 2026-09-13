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
  Microscope,
  Layers,
  ArrowRight,
  Flame,
  Pill,
  Clock,
  Skull,
  RefreshCw,
  XCircle
} from "lucide-react";
import {
  TmaPatientParams,
  TmaSubtype,
  PlasmicScoreBreakdown,
  DEFAULT_TMA_PATIENT,
  calculatePlasmicScore,
  simulateTmaSyndrome
} from "../../.gemini/skills/TmaTtpAhusEngine";

export default function TmaTtpAhusSimulator() {
  const [params, setParams] = useState<TmaPatientParams>(DEFAULT_TMA_PATIENT);
  const [activeTab, setActiveTab] = useState<"plasmic" | "smear_maha" | "ttp_therapy" | "ahus_stec">("plasmic");

  const output = useMemo(() => simulateTmaSyndrome(params), [params]);

  const updateParam = <K extends keyof TmaPatientParams>(
    key: K,
    value: TmaPatientParams[K]
  ) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // Case Vignettes / Presets
  const applyPreset = (
    presetKey:
      | "acute_immune_ttp"
      | "atypical_hus"
      | "pentad_myth_dyad"
      | "platelet_transfusion_hazard"
      | "stec_hus"
  ) => {
    switch (presetKey) {
      case "acute_immune_ttp":
        setParams({
          ...DEFAULT_TMA_PATIENT,
          plateletCountPerMicroliter: 14000,
          hemoglobinGPerDl: 7.8,
          schistocytePercentageOnSmear: 3.2,
          serumLdhUL: 1450,
          serumHaptoglobinGPerL: 0.05,
          serumCreatinineMgPerDl: 1.3,
          neurologicSymptomsPresent: true,
          feverPresent: false,
          cardiacTroponinElevated: true,
          adamts13ActivityPercent: 4.0,
          adamts13InhibitorBethesdaUnits: 2.4,
          stoolShigaToxinPositive: false,
          therapeuticPlasmaExchangeActive: false,
          caplacizumabAdministered: false,
          highDoseSteroidsActive: false,
          rituximabActive: false,
          eculizumabComplementInhibitorActive: false,
          plateletTransfusionAdministered: false
        });
        break;
      case "atypical_hus":
        setParams({
          ...DEFAULT_TMA_PATIENT,
          plateletCountPerMicroliter: 48000,
          hemoglobinGPerDl: 8.4,
          schistocytePercentageOnSmear: 2.4,
          serumLdhUL: 890,
          serumCreatinineMgPerDl: 5.2, // Severe AKI
          neurologicSymptomsPresent: false,
          feverPresent: false,
          adamts13ActivityPercent: 68.0, // Preserved > 10%
          adamts13InhibitorBethesdaUnits: 0.0,
          stoolShigaToxinPositive: false,
          therapeuticPlasmaExchangeActive: false,
          eculizumabComplementInhibitorActive: true,
          meningococcalProphylaxisCovered: true,
          plateletTransfusionAdministered: false
        });
        break;
      case "pentad_myth_dyad":
        setParams({
          ...DEFAULT_TMA_PATIENT,
          plateletCountPerMicroliter: 18000,
          schistocytePercentageOnSmear: 2.8,
          serumCreatinineMgPerDl: 1.0, // Normal renal
          neurologicSymptomsPresent: false, // Normal neuro
          feverPresent: false, // Afebrile
          urineProteinOrBloodPresent: false,
          adamts13ActivityPercent: 3.0,
          plateletTransfusionAdministered: false
        });
        break;
      case "platelet_transfusion_hazard":
        setParams({
          ...DEFAULT_TMA_PATIENT,
          plateletCountPerMicroliter: 12000,
          schistocytePercentageOnSmear: 3.8,
          adamts13ActivityPercent: 2.0,
          plateletTransfusionAdministered: true // Provokes acute thrombotic catastrophe!
        });
        break;
      case "stec_hus":
        setParams({
          ...DEFAULT_TMA_PATIENT,
          plateletCountPerMicroliter: 38000,
          hemoglobinGPerDl: 8.8,
          schistocytePercentageOnSmear: 2.0,
          serumCreatinineMgPerDl: 4.1,
          adamts13ActivityPercent: 82.0,
          adamts13InhibitorBethesdaUnits: 0.0,
          stoolShigaToxinPositive: true, // Positive Stx
          therapeuticPlasmaExchangeActive: false,
          plateletTransfusionAdministered: false
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
                <Microscope className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 bg-clip-text text-transparent">
                  Thrombotic Microangiopathies (TMA): TTP vs aHUS Workstation
                </h1>
                <p className="text-sm text-slate-400">
                  PLASMIC Score (0-7), ADAMTS13 Kinetics (&lt;10% vs &ge;10%), Alternative Complement Overactivation (aHUS), Platelet Transfusion Hazard ("Fuel to Fire"), and Emergent TPE / Caplacizumab / Eculizumab
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-rose-950/60 border border-rose-800/60 text-rose-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Track B38 (Route #239)
            </span>
            <span className="px-3 py-1 bg-amber-950/60 border border-amber-800/60 text-amber-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> PLASMIC Score (0-7)
            </span>
            <span className="px-3 py-1 bg-sky-950/60 border border-sky-800/60 text-sky-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5" /> ADAMTS13 &lt; 10%
            </span>
          </div>
        </div>

        {/* Case Presets Navigation */}
        <div className="mt-4 p-3 bg-slate-900/70 border border-slate-800/80 rounded-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-rose-400" /> Clinical Scenarios & High-Yield Vignettes:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            <button
              onClick={() => applyPreset("acute_immune_ttp")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                output.predictedTmaSubtype === "IMMUNE_TTP" && !params.plateletTransfusionAdministered && params.neurologicSymptomsPresent
                  ? "bg-rose-950/80 border-rose-500 text-rose-200 shadow-md shadow-rose-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>1. Acute Immune TTP (High Risk)</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-rose-900 text-rose-200 rounded">PLASMIC 7</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Plt 14k, 3.2% schistocytes, aphasia, troponin leak, ADAMTS13 4% + inhibitor.
              </p>
            </button>

            <button
              onClick={() => applyPreset("atypical_hus")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                output.predictedTmaSubtype === "ATYPICAL_HUS"
                  ? "bg-indigo-950/80 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>2. Atypical HUS (aHUS)</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-indigo-900 text-indigo-200 rounded">Anti-C5</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Severe AKI (Cr 5.2), ADAMTS13 preserved (68%), alternative pathway attack; Eculizumab.
              </p>
            </button>

            <button
              onClick={() => applyPreset("pentad_myth_dyad")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                output.predictedTmaSubtype === "IMMUNE_TTP" && !params.neurologicSymptomsPresent && !params.feverPresent
                  ? "bg-amber-950/80 border-amber-500 text-amber-200 shadow-md shadow-amber-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>3. The Pentad Myth (Dyad Only)</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-900 text-amber-200 rounded">Dyad Only</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Plt 18k + MAHA, but normal neuro/renal & afebrile. Waiting for full pentad is fatal.
              </p>
            </button>

            <button
              onClick={() => applyPreset("platelet_transfusion_hazard")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.plateletTransfusionAdministered
                  ? "bg-red-950/80 border-red-500 text-red-200 shadow-md shadow-red-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>4. Platelet "Fuel to Fire"</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-red-900 text-red-200 rounded">LETHAL</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Transfused platelets bind UL-vWF multimers, provoking acute thrombotic stroke.
              </p>
            </button>

            <button
              onClick={() => applyPreset("stec_hus")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                output.predictedTmaSubtype === "STEC_HUS"
                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>5. STEC-HUS (Shiga Toxin)</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-900 text-emerald-200 rounded">Stx+</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Bloody diarrhea prodrome, Stx+, acute oliguric renal injury, antibiotics contraindicated.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Hero 4-Panel Hemodynamic & Diagnostic Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Panel 1: PLASMIC Score & TTP Probability */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-amber-400" /> PLASMIC Prediction Score
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.plasmicScore.riskCategory === "HIGH_RISK"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                    : output.plasmicScore.riskCategory === "INTERMEDIATE_RISK"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-slate-700 text-slate-300"
                }`}
              >
                {output.plasmicScore.riskCategory.replace("_", " ")}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${output.plasmicScore.totalScore >= 6 ? "text-rose-400" : output.plasmicScore.totalScore === 5 ? "text-amber-400" : "text-slate-300"}`}>
                  {output.plasmicScore.totalScore} / 7
                </span>
                <span className="text-xs text-slate-400">Points (TTP Risk)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">ADAMTS13 &lt; 10% ODDS</span>
                  <span className={`font-bold text-sm ${output.plasmicScore.predictedTtpProbabilityPercent >= 80 ? "text-rose-400" : "text-slate-300"}`}>
                    {output.plasmicScore.predictedTtpProbabilityPercent}%
                  </span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">PENTAD CRITERIA</span>
                  <span className={`font-bold text-xs ${output.classicPentadPresent ? "text-rose-400" : "text-amber-400"}`}>
                    {output.pentadSymptomsCount} / 5 Present
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Clinical Rule:</span>
            <span className="font-semibold text-amber-400">Dyad Alone Mandates TPE</span>
          </div>
        </div>

        {/* Panel 2: Hematology & MAHA Smear */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Microscope className="w-4 h-4 text-rose-400" /> Hematology & MAHA
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.mahaConfirmed
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {output.mahaConfirmed ? "MAHA CONFIRMED" : "NO MAHA"}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${params.plateletCountPerMicroliter < 30000 ? "text-rose-400" : "text-sky-400"}`}>
                  {params.plateletCountPerMicroliter.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400">/µL (Platelets)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">SCHISTOCYTES</span>
                  <span className={`font-bold text-sm ${params.schistocytePercentageOnSmear >= 1.0 ? "text-rose-400" : "text-emerald-400"}`}>
                    {params.schistocytePercentageOnSmear}%
                  </span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">SERUM LDH</span>
                  <span className={`font-bold text-xs ${params.serumLdhUL > 500 ? "text-rose-400" : "text-slate-300"}`}>
                    {params.serumLdhUL} U/L
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Direct Antiglobulin (Coombs):</span>
            <span className={`font-semibold ${params.directAntiglobulinTestPositive ? "text-rose-400" : "text-emerald-400"}`}>
              {params.directAntiglobulinTestPositive ? "Positive (Evans / AIHA)" : "Negative (Typical TMA)"}
            </span>
          </div>
        </div>

        {/* Panel 3: ADAMTS13 & Complement Status */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-400" /> ADAMTS13 & Complement
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.predictedTmaSubtype === "IMMUNE_TTP"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    : output.predictedTmaSubtype === "ATYPICAL_HUS"
                    ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/40"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                }`}
              >
                {output.predictedTmaSubtype.replace("_", " ")}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${params.adamts13ActivityPercent < 10 ? "text-rose-400" : "text-emerald-400"}`}>
                  {params.adamts13ActivityPercent}%
                </span>
                <span className="text-xs text-slate-400">Activity (&lt; 10% = TTP)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">INHIBITOR TITER</span>
                  <span className={`font-bold text-sm ${params.adamts13InhibitorBethesdaUnits > 0.4 ? "text-rose-400" : "text-slate-400"}`}>
                    {params.adamts13InhibitorBethesdaUnits > 0 ? `${params.adamts13InhibitorBethesdaUnits} BU` : "None"}
                  </span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">C5b-9 ATTACK</span>
                  <span className={`font-bold text-xs ${output.predictedTmaSubtype === "ATYPICAL_HUS" ? "text-indigo-400 animate-pulse" : "text-slate-400"}`}>
                    {output.predictedTmaSubtype === "ATYPICAL_HUS" ? "Hyperactive" : "Normal"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Primary Driver:</span>
            <span className="font-semibold text-slate-300 truncate block text-[10px]">
              {output.predictedTmaSubtype === "IMMUNE_TTP" ? "UL-vWF Multimers / Autoantibody" : output.predictedTmaSubtype === "ATYPICAL_HUS" ? "Alternative Pathway / C5" : "Shiga Toxin / Gb3"}
            </span>
          </div>
        </div>

        {/* Panel 4: End-Organ Damage & Coagulation */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-cyan-400" /> Organ Injury & Coagulation
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.dicExcludedByCoagulation
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                }`}
              >
                {output.dicExcludedByCoagulation ? "DIC EXCLUDED" : "COAGULOPATHY"}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${params.serumCreatinineMgPerDl >= 2.0 ? "text-rose-400" : "text-cyan-400"}`}>
                  {params.serumCreatinineMgPerDl}
                </span>
                <span className="text-xs text-slate-400">mg/dL (Creatinine)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">PT / INR</span>
                  <span className="font-bold text-sm text-cyan-300">
                    {params.ptInr} (Normal)
                  </span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">TROPONIN LEAK</span>
                  <span className={`font-bold text-xs ${params.cardiacTroponinElevated ? "text-rose-400" : "text-emerald-400"}`}>
                    {params.cardiacTroponinElevated ? "Positive (MI Risk)" : "Negative"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>CNS Involvement:</span>
            <span className={`font-bold ${params.neurologicSymptomsPresent ? "text-rose-400" : "text-emerald-400"}`}>
              {params.neurologicSymptomsPresent ? "Active (Aphasia / Confusion)" : "Intact"}
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
                alert.includes("FUEL TO THE FIRE") || alert.includes("HIGH-RISK PLASMIC SCORE") || alert.includes("DEFINITIVE IMMUNE TTP")
                  ? "bg-rose-950/70 border-rose-600 text-rose-200 animate-pulse"
                  : alert.includes("PENTAD MYTH") || alert.includes("MENINGOCOCCAL")
                  ? "bg-amber-950/70 border-amber-600 text-amber-200"
                  : alert.includes("MAHA) CONFIRMED") || alert.includes("ATYPICAL HUS")
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
            onClick={() => setActiveTab("plasmic")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "plasmic"
                ? "border-rose-500 text-rose-400 bg-rose-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Gauge className="w-4 h-4" /> 1. PLASMIC Score & Dyad vs Pentad
          </button>
          <button
            onClick={() => setActiveTab("smear_maha")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "smear_maha"
                ? "border-rose-500 text-rose-400 bg-rose-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Microscope className="w-4 h-4" /> 2. Peripheral Smear & Hemolysis Profiling
          </button>
          <button
            onClick={() => setActiveTab("ttp_therapy")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "ttp_therapy"
                ? "border-rose-500 text-rose-400 bg-rose-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap className="w-4 h-4" /> 3. TTP Triple Therapy & Transfusion Hazard
          </button>
          <button
            onClick={() => setActiveTab("ahus_stec")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "ahus_stec"
                ? "border-rose-500 text-rose-400 bg-rose-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> 4. aHUS Complement Blockade & STEC-HUS
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="max-w-7xl mx-auto">
        {/* Tab 1: PLASMIC Score & Dyad vs Pentad */}
        {activeTab === "plasmic" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-amber-400" /> The 7 PLASMIC Predictors (ADAMTS13 &lt; 10% Likelihood)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {(
                    [
                      { key: "plateletLessThan30k", label: "Platelet Count < 30,000 /µL", active: output.plasmicScore.plateletLessThan30k },
                      { key: "hemolysisEvidence", label: "Hemolysis (Retic > 2.5%, Haptoglobin < 0.1, or Bili > 2)", active: output.plasmicScore.hemolysisEvidence },
                      { key: "noActiveCancer", label: "No Active Cancer History", active: output.plasmicScore.noActiveCancer },
                      { key: "noStemCellOrOrganTransplant", label: "No Solid Organ or Stem Cell Transplant", active: output.plasmicScore.noStemCellOrOrganTransplant },
                      { key: "mcvLessThan90", label: "Mean Corpuscular Volume (MCV) < 90 fL", active: output.plasmicScore.mcvLessThan90 },
                      { key: "inrLessThan1_5", label: "Coagulation Profile: INR < 1.5", active: output.plasmicScore.inrLessThan1_5 },
                      { key: "creatinineLessThan2_0", label: "Serum Creatinine < 2.0 mg/dL", active: output.plasmicScore.creatinineLessThan2_0 }
                    ] as const
                  ).map(item => (
                    <div
                      key={item.key}
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        item.active
                          ? "bg-amber-950/40 border-amber-500/60 text-amber-200"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      <span className="font-medium pr-2">{item.label}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.active ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-400"}`}>
                        {item.active ? "+1 PT" : "0 PT"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Score Summary Box */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-400 block">TOTAL PLASMIC SCORE:</span>
                    <span className="text-2xl font-black text-amber-300">{output.plasmicScore.totalScore} / 7 Points</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">STRATIFICATION:</span>
                    <span className={`text-sm font-bold ${output.plasmicScore.riskCategory === "HIGH_RISK" ? "text-rose-400" : "text-slate-300"}`}>
                      {output.plasmicScore.riskCategory.replace("_", " ")} ({output.plasmicScore.predictedTtpProbabilityPercent}% TTP Probability)
                    </span>
                  </div>
                  <div className="text-xs text-slate-300">
                    {output.plasmicScore.totalScore >= 6 ? (
                      <span className="text-rose-400 font-semibold">Immediate TPE + Caplacizumab indicated!</span>
                    ) : (
                      <span className="text-slate-400">Consider aHUS, STEC-HUS, or secondary TMA.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* The Pentad Myth vs Bedside Dyad Card */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-400" /> The Pentad Myth vs Bedside Dyad Rule
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Historically, medical students were taught the classic pentad: <strong>Thrombocytopenia, MAHA, Neurologic signs, Renal dysfunction, and Fever</strong>. In modern clinical practice, the complete pentad occurs in <strong>less than 10%</strong> of confirmed TTP cases. Waiting for all 5 signs results in massive, preventable mortality (&gt; 90%).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className={`p-2.5 rounded-lg border ${params.plateletCountPerMicroliter < 100000 ? "bg-rose-950/60 border-rose-500/60 text-rose-200" : "bg-slate-950 border-slate-800 text-slate-400"}`}>
                    <span className="font-bold block">1. Plt Drop</span>
                    <span className="text-[10px]">{params.plateletCountPerMicroliter.toLocaleString()}/µL</span>
                  </div>
                  <div className={`p-2.5 rounded-lg border ${output.mahaConfirmed ? "bg-rose-950/60 border-rose-500/60 text-rose-200" : "bg-slate-950 border-slate-800 text-slate-400"}`}>
                    <span className="font-bold block">2. MAHA</span>
                    <span className="text-[10px]">{params.schistocytePercentageOnSmear}% schisto</span>
                  </div>
                  <div className={`p-2.5 rounded-lg border ${params.neurologicSymptomsPresent ? "bg-rose-950/60 border-rose-500/60 text-rose-200" : "bg-slate-950 border-slate-800 text-slate-400"}`}>
                    <span className="font-bold block">3. Neuro</span>
                    <span className="text-[10px]">{params.neurologicSymptomsPresent ? "Aphasia/Conf" : "None"}</span>
                  </div>
                  <div className={`p-2.5 rounded-lg border ${params.serumCreatinineMgPerDl > 1.4 ? "bg-rose-950/60 border-rose-500/60 text-rose-200" : "bg-slate-950 border-slate-800 text-slate-400"}`}>
                    <span className="font-bold block">4. Renal</span>
                    <span className="text-[10px]">Cr {params.serumCreatinineMgPerDl}</span>
                  </div>
                  <div className={`p-2.5 rounded-lg border ${params.feverPresent ? "bg-rose-950/60 border-rose-500/60 text-rose-200" : "bg-slate-950 border-slate-800 text-slate-400"}`}>
                    <span className="font-bold block">5. Fever</span>
                    <span className="text-[10px]">{params.feverPresent ? "Febrile" : "Afebrile"}</span>
                  </div>
                </div>

                <div className="p-3 bg-rose-950/40 border border-rose-600/60 rounded-xl text-xs text-rose-200 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <div>
                    <strong>Emergency Medicine Practice Pearl:</strong> Unexplained <strong>Thrombocytopenia + MAHA (The Dyad)</strong> alone is sufficient to trigger immediate presumptive TPE and hematology transfer. Never delay for fever or severe renal failure.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Parameter Sliders */}
            <div className="space-y-6">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-sky-400" /> Bedside Toggles & Labs
                </h3>

                {/* Platelet Slider */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Platelet Count:</span>
                    <span className="font-mono font-bold text-rose-400">{params.plateletCountPerMicroliter.toLocaleString()} /µL</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="150000"
                    step="5000"
                    value={params.plateletCountPerMicroliter}
                    onChange={e => updateParam("plateletCountPerMicroliter", parseInt(e.target.value))}
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>5,000 (Severe)</span>
                    <span>30,000 (PLASMIC cutoff)</span>
                    <span>150,000 (Normal)</span>
                  </div>
                </div>

                {/* Creatinine Slider */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Serum Creatinine:</span>
                    <span className="font-mono font-bold text-cyan-300">{params.serumCreatinineMgPerDl} mg/dL</span>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="8.0"
                    step="0.2"
                    value={params.serumCreatinineMgPerDl}
                    onChange={e => updateParam("serumCreatinineMgPerDl", parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>1.0 (Typical TTP)</span>
                    <span>2.0 (PLASMIC cutoff)</span>
                    <span>6.0+ (Typical aHUS)</span>
                  </div>
                </div>

                {/* Clinical Feature Toggles */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-300 font-medium">Neurologic Symptoms (TIA / Aphasia / Confusion):</span>
                    <button
                      onClick={() => updateParam("neurologicSymptomsPresent", !params.neurologicSymptomsPresent)}
                      className={`px-3 py-1 rounded text-xs font-bold transition ${params.neurologicSymptomsPresent ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-400"}`}
                    >
                      {params.neurologicSymptomsPresent ? "Present" : "Absent"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-300 font-medium">Fever (&ge; 38.0°C):</span>
                    <button
                      onClick={() => updateParam("feverPresent", !params.feverPresent)}
                      className={`px-3 py-1 rounded text-xs font-bold transition ${params.feverPresent ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-400"}`}
                    >
                      {params.feverPresent ? "Febrile" : "Afebrile"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-300 font-medium">Active Malignancy History:</span>
                    <button
                      onClick={() => updateParam("historyOfActiveCancer", !params.historyOfActiveCancer)}
                      className={`px-3 py-1 rounded text-xs font-bold transition ${params.historyOfActiveCancer ? "bg-amber-600 text-white" : "bg-slate-800 text-slate-400"}`}
                    >
                      {params.historyOfActiveCancer ? "Yes (0 pt)" : "No (+1 pt)"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Peripheral Smear & Hemolysis Profiling */}
        {activeTab === "smear_maha" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Microscope className="w-5 h-5 text-rose-400" /> Peripheral Blood Film & Schistocyte Quantification
              </h3>

              {/* Schistocyte Percentage Slider */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Schistocyte (Fragmented RBC) Percentage:</span>
                  <span className="font-mono font-bold text-rose-400 text-base">{params.schistocytePercentageOnSmear}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="6.0"
                  step="0.1"
                  value={params.schistocytePercentageOnSmear}
                  onChange={e => updateParam("schistocytePercentageOnSmear", parseFloat(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>&lt; 0.2% (Normal baseline)</span>
                  <span>1.0% (MAHA threshold)</span>
                  <span>&gt; 2.5% (Severe microvascular shear)</span>
                </div>
              </div>

              {/* Morphology Descriptions */}
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <strong className="text-slate-100 block mb-1">Helmet Cells & Keratocytes:</strong>
                  Erythrocytes are forcibly propelled by arterial pressure across intraluminal microvascular platelet-vWF thrombi. Fibrin and vWF strands slice the red cell membrane, leaving irregular triangular fragments, helmet cells, and spherocytes.
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <strong className="text-slate-100 block mb-1">Polychromasia & Nucleated RBCs:</strong>
                  Severe intravascular hemolysis prompts vigorous bone marrow erythroid hyperplasia with release of immature polychromatophilic reticulocytes and circulating nucleated red cells.
                </div>
              </div>
            </div>

            {/* Hemolysis Biomarker Bench */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-amber-400" /> Intravascular Hemolysis Biomarker Panel
              </h3>

              <div className="space-y-3 text-xs">
                {/* LDH Slider */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Serum Lactate Dehydrogenase (LDH):</span>
                    <span className="font-mono font-bold text-amber-400">{params.serumLdhUL} U/L</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="3000"
                    step="50"
                    value={params.serumLdhUL}
                    onChange={e => updateParam("serumLdhUL", parseInt(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>140-280 (Normal)</span>
                    <span>1,000 (Substantial)</span>
                    <span>3,000 (Massive Lysis)</span>
                  </div>
                </div>

                {/* Haptoglobin & Coombs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">SERUM HAPTOGLOBIN</span>
                    <span className={`font-bold text-sm ${params.serumHaptoglobinGPerL < 0.1 ? "text-rose-400 font-mono" : "text-emerald-400"}`}>
                      {params.serumHaptoglobinGPerL < 0.1 ? "< 0.1 g/L (Undetectable)" : "0.85 g/L (Normal)"}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">Scavenged by free hemoglobin from lysis.</p>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">DIRECT COOMBS (DAT)</span>
                    <button
                      onClick={() => updateParam("directAntiglobulinTestPositive", !params.directAntiglobulinTestPositive)}
                      className={`mt-1 px-2.5 py-1 rounded text-xs font-bold transition w-full ${params.directAntiglobulinTestPositive ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-300"}`}
                    >
                      {params.directAntiglobulinTestPositive ? "Positive (Autoimmune)" : "Negative (Typical TMA)"}
                    </button>
                    <p className="text-[10px] text-slate-400 mt-1">Negative rules out autoimmune warm AIHA.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: TTP Triple Therapy & Transfusion Hazard */}
        {activeTab === "ttp_therapy" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Triple Therapy Bench */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Zap className="w-5 h-5 text-rose-400" /> TTP Triple Therapy Protocol (TPE + Caplacizumab + Steroids)
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                {/* TPE Toggle */}
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="font-bold text-slate-200 block">1. Therapeutic Plasma Exchange (TPE):</span>
                    <span className="text-[11px] text-slate-400">1.0 to 1.5 plasma volume daily with FFP</span>
                  </div>
                  <button
                    onClick={() => updateParam("therapeuticPlasmaExchangeActive", !params.therapeuticPlasmaExchangeActive)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      params.therapeuticPlasmaExchangeActive
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {params.therapeuticPlasmaExchangeActive ? "Active (Infusing FFP)" : "Inactive (Start TPE)"}
                  </button>
                </div>

                {/* Caplacizumab Toggle */}
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="font-bold text-slate-200 block">2. Caplacizumab (Anti-vWF A1 Nanobody):</span>
                    <span className="text-[11px] text-slate-400">10 mg IV bolus before TPE, then 10 mg SubQ daily</span>
                  </div>
                  <button
                    onClick={() => updateParam("caplacizumabAdministered", !params.caplacizumabAdministered)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      params.caplacizumabAdministered
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {params.caplacizumabAdministered ? "Administered (vWF Blocked)" : "Not Given"}
                  </button>
                </div>

                {/* High Dose Steroids Toggle */}
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="font-bold text-slate-200 block">3. Systemic Corticosteroids:</span>
                    <span className="text-[11px] text-slate-400">Methylprednisolone 1g IV daily x 3 days</span>
                  </div>
                  <button
                    onClick={() => updateParam("highDoseSteroidsActive", !params.highDoseSteroidsActive)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      params.highDoseSteroidsActive
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {params.highDoseSteroidsActive ? "Active (Immunosuppressed)" : "Not Given"}
                  </button>
                </div>

                {/* Rituximab Toggle */}
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="font-bold text-slate-200 block">4. Rituximab (Anti-CD20):</span>
                    <span className="text-[11px] text-slate-400">375 mg/m² weekly x 4 to deplete B-cell clones</span>
                  </div>
                  <button
                    onClick={() => updateParam("rituximabActive", !params.rituximabActive)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      params.rituximabActive
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {params.rituximabActive ? "Active (B-Cells Depleted)" : "Not Given"}
                  </button>
                </div>
              </div>
            </div>

            {/* Lethal Pitfall: Platelet Transfusion */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Skull className="w-5 h-5 text-red-500 animate-pulse" /> The Platelet Transfusion Pitfall ("Fuel to Fire")
              </h3>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  In severe thrombocytopenia (&lt; 20,000 /µL), clinicians often instinctively transfuse platelets to prevent bleeding. In TTP, patients <strong>rarely die from bleeding</strong>; they die from <strong>widespread microvascular thrombosis</strong>.
                </p>

                <div className="p-3 bg-red-950/40 border border-red-600/60 rounded-xl text-xs text-red-200 space-y-1.5">
                  <strong className="text-red-100 block">Pathophysiologic Mechanism:</strong>
                  Transfused platelets provide substrate ("fuel") for ultra-large von Willebrand factor multimers to aggregate into occlusive thrombi. Clinical trials and retrospective registries document abrupt neurological collapse, acute myocardial infarction, and sudden cardiac arrest within minutes to hours of transfusion.
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800 mt-2">
                  <div>
                    <span className="font-bold text-slate-200 block">Platelet Transfusion Order:</span>
                    <span className="text-[11px] text-slate-400">Contraindicated except in life-threatening bleeding</span>
                  </div>
                  <button
                    onClick={() => updateParam("plateletTransfusionAdministered", !params.plateletTransfusionAdministered)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      params.plateletTransfusionAdministered
                        ? "bg-red-600 text-white animate-pulse"
                        : "bg-slate-800 text-slate-300 hover:text-slate-100"
                    }`}
                  >
                    {params.plateletTransfusionAdministered ? "TRANSFUSED (PITFALL!)" : "Withheld (Safe)"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: aHUS Complement Blockade & STEC-HUS */}
        {activeTab === "ahus_stec" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* aHUS Section */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" /> Atypical HUS (aHUS): Complement C5 Blockade
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <strong className="text-slate-100 block mb-1">Alternative Pathway Genetic Mutations:</strong>
                  Loss-of-function mutations in Factor H (CFH), Factor I (CFI), or MCP (CD46), or gain-of-function in C3/Factor B cause uninhibited formation of the terminal complement membrane attack complex (C5b-9), directly lysing renal microvascular endothelium.
                </div>

                {/* Eculizumab Toggle */}
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="font-bold text-slate-200 block">Eculizumab / Ravulizumab (Anti-C5 mAb):</span>
                    <span className="text-[11px] text-slate-400">Blocks C5 cleavage into C5a and C5b</span>
                  </div>
                  <button
                    onClick={() => updateParam("eculizumabComplementInhibitorActive", !params.eculizumabComplementInhibitorActive)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      params.eculizumabComplementInhibitorActive
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {params.eculizumabComplementInhibitorActive ? "Infused (C5 Blocked)" : "Not Given"}
                  </button>
                </div>

                {/* Meningococcal Prophylaxis */}
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="font-bold text-slate-200 block">Meningococcal Prophylaxis:</span>
                    <span className="text-[11px] text-slate-400">Vaccination (ACWY + B) + Ciprofloxacin/Penicillin</span>
                  </div>
                  <button
                    onClick={() => updateParam("meningococcalProphylaxisCovered", !params.meningococcalProphylaxisCovered)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      params.meningococcalProphylaxisCovered
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-600 text-slate-950"
                    }`}
                  >
                    {params.meningococcalProphylaxisCovered ? "Covered (Safe)" : "Unprotected (High Risk)"}
                  </button>
                </div>
              </div>
            </div>

            {/* STEC-HUS Section */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-emerald-400" /> STEC-HUS (Shiga Toxin-Producing E. coli)
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <strong className="text-slate-100 block mb-1">Gb3 Receptor Pathology:</strong>
                  Shiga toxins (Stx-1, Stx-2) from enterohemorrhagic E. coli (O157:H7) enter circulation and bind globotriaosylceramide (Gb3) receptors on glomerular endothelial cells, triggering apoptosis and microvascular thrombosis.
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="font-bold text-slate-200 block">Stool Shiga Toxin (Stx) Test:</span>
                    <span className="text-[11px] text-slate-400">PCR / enzyme immunoassay for Stx1/Stx2</span>
                  </div>
                  <button
                    onClick={() => updateParam("stoolShigaToxinPositive", !params.stoolShigaToxinPositive)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      params.stoolShigaToxinPositive
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {params.stoolShigaToxinPositive ? "Positive (STEC Confirmed)" : "Negative"}
                  </button>
                </div>

                <div className="p-3 bg-amber-950/40 border border-amber-600/60 rounded-xl text-amber-200">
                  <strong className="block mb-1 font-bold">Critical Practice Alert (Antibiotic Avoidance):</strong>
                  Antibiotic therapy (fluoroquinolones, beta-lactams) in STEC enteritis causes bacterial lysis and triggers phage induction, massively surging Shiga toxin release and multiplying the risk of severe acute renal failure.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
