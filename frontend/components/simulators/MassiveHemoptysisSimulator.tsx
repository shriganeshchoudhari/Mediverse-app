"use client";

import React, { useState, useMemo } from "react";
import {
  Wind,
  Activity,
  AlertTriangle,
  Heart,
  ShieldCheck,
  Stethoscope,
  Scissors,
  Zap,
  CheckCircle2,
  AlertCircle,
  Droplets,
  Layers,
  ArrowRight,
  Radio,
  Eye,
  Info,
  Compass,
  FileText
} from "lucide-react";
import {
  MassiveHemoptysisPatientParams,
  BleedingEtiology,
  BleedingLocation,
  PatientPositioning,
  AirwayIsolationStrategy,
  BronchoscopicIntervention,
  InterventionalRadiologyBAEStage,
  DEFAULT_HEMOPTYSIS_PATIENT,
  simulateMassiveHemoptysis
} from "../../.gemini/skills/MassiveHemoptysisEngine";

export default function MassiveHemoptysisSimulator() {
  const [params, setParams] = useState<MassiveHemoptysisPatientParams>(DEFAULT_HEMOPTYSIS_PATIENT);
  const [activeTab, setActiveTab] = useState<"airway" | "bronchoscopy" | "interventional_bae" | "thoracotomy">("airway");

  const output = useMemo(() => simulateMassiveHemoptysis(params), [params]);

  const updateParam = <K extends keyof MassiveHemoptysisPatientParams>(
    key: K,
    value: MassiveHemoptysisPatientParams[K]
  ) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // Case Vignettes / Presets
  const applyPreset = (
    presetKey:
      | "cavitary_aspergilloma_supine"
      | "bronchiectasis_blocker_down"
      | "bad_lung_up_disaster"
      | "adamkiewicz_spinal_infarction"
      | "refractory_abscess_thoracotomy"
  ) => {
    switch (presetKey) {
      case "cavitary_aspergilloma_supine":
        setParams({
          ...DEFAULT_HEMOPTYSIS_PATIENT,
          etiology: "CAVITARY_TUBERCULOSIS_ASPERGILLOMA",
          bleedingLobe: "RIGHT_UPPER_LOBE",
          hemoptysisRateMlPerHour: 240,
          cumulativeBloodLossMl: 450,
          patientPosition: "SUPINE",
          airwayStrategy: "NONE_STANDARD_O2_MASK",
          bronchoscopyApplied: "NONE",
          interventionalRadiologyStage: "NONE",
          emergencyThoracotomyPerformed: false,
          systemicTranexamicAcidIvGiven: false
        });
        break;
      case "bronchiectasis_blocker_down":
        setParams({
          ...DEFAULT_HEMOPTYSIS_PATIENT,
          etiology: "BRONCHIECTASIS_CYSTIC_FIBROSIS",
          bleedingLobe: "RIGHT_LOWER_LOBE",
          hemoptysisRateMlPerHour: 180,
          cumulativeBloodLossMl: 300,
          patientPosition: "BLEEDING_LUNG_DEPENDENT_DOWN",
          airwayStrategy: "ENDOBRONCHIAL_BLOCKER_COAXIAL",
          bronchoscopyApplied: "TOPICAL_TRANEXAMIC_ACID_1000MG",
          interventionalRadiologyStage: "NONE",
          emergencyThoracotomyPerformed: false,
          systemicTranexamicAcidIvGiven: true
        });
        break;
      case "bad_lung_up_disaster":
        setParams({
          ...DEFAULT_HEMOPTYSIS_PATIENT,
          etiology: "CAVITARY_LUNG_NEOPLASM",
          bleedingLobe: "LEFT_UPPER_LOBE",
          hemoptysisRateMlPerHour: 280,
          cumulativeBloodLossMl: 600,
          patientPosition: "BLEEDING_LUNG_UP",
          airwayStrategy: "NONE_STANDARD_O2_MASK",
          bronchoscopyApplied: "NONE",
          interventionalRadiologyStage: "NONE",
          emergencyThoracotomyPerformed: false,
          systemicTranexamicAcidIvGiven: false
        });
        break;
      case "adamkiewicz_spinal_infarction":
        setParams({
          ...DEFAULT_HEMOPTYSIS_PATIENT,
          etiology: "BRONCHIECTASIS_CYSTIC_FIBROSIS",
          bleedingLobe: "LEFT_LOWER_LOBE",
          hemoptysisRateMlPerHour: 160,
          cumulativeBloodLossMl: 350,
          patientPosition: "BLEEDING_LUNG_DEPENDENT_DOWN",
          airwayStrategy: "LARGE_BORE_ETT_8_5",
          bronchoscopyApplied: "COLD_SALINE_LAVAGE_50ML",
          interventionalRadiologyStage: "UNSAFE_EMBOLIZATION_ADAMKIEWICZ_IDENTIFIED",
          emergencyThoracotomyPerformed: false,
          systemicTranexamicAcidIvGiven: true
        });
        break;
      case "refractory_abscess_thoracotomy":
        setParams({
          ...DEFAULT_HEMOPTYSIS_PATIENT,
          etiology: "NECROTIZING_PNEUMONIA_ABSCESS",
          bleedingLobe: "RIGHT_LOWER_LOBE",
          hemoptysisRateMlPerHour: 380,
          cumulativeBloodLossMl: 1250,
          patientPosition: "BLEEDING_LUNG_DEPENDENT_DOWN",
          airwayStrategy: "SELECTIVE_MAINSTEM_INTUBATION",
          bronchoscopyApplied: "RIGID_BRONCHOSCOPY_MASSIVE_SUCTION",
          interventionalRadiologyStage: "BRONCHIAL_ANGIOGRAM_DIAGNOSTIC",
          emergencyThoracotomyPerformed: false,
          systemicTranexamicAcidIvGiven: true
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
                <Wind className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-rose-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
                  Massive Hemoptysis & Endobronchial Isolation Workstation
                </h1>
                <p className="text-sm text-slate-400">
                  Asphyxiation Risk vs Exsanguination, "Bad Lung Down" Positioning, Bronchial Artery Embolization (BAE), and Artery of Adamkiewicz Spinal Safety
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-rose-950/60 border border-rose-800/60 text-rose-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Track B33 (Route #234)
            </span>
            <span className="px-3 py-1 bg-amber-950/60 border border-amber-800/60 text-amber-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> CHEST / ATS Guidelines
            </span>
            <span className="px-3 py-1 bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" /> Interventional BAE
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
              onClick={() => applyPreset("cavitary_aspergilloma_supine")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.etiology === "CAVITARY_TUBERCULOSIS_ASPERGILLOMA" && params.patientPosition === "SUPINE"
                  ? "bg-rose-950/80 border-rose-500 text-rose-200 shadow-md shadow-rose-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>1. TB Mycetoma Supine</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-rose-900/50 text-rose-300 rounded">Asphyxia</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Supine pooling over carina, dead space flooding, SpO2 78%, imminent drowning.
              </p>
            </button>

            <button
              onClick={() => applyPreset("bronchiectasis_blocker_down")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.airwayStrategy === "ENDOBRONCHIAL_BLOCKER_COAXIAL"
                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>2. CF Blocker & Down</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-900/50 text-emerald-300 rounded">Protected</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Bad lung down, Arndt blocker isolated, topical TXA instilled, good lung spared.
              </p>
            </button>

            <button
              onClick={() => applyPreset("bad_lung_up_disaster")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.patientPosition === "BLEEDING_LUNG_UP"
                  ? "bg-red-950/80 border-red-500 text-red-200 shadow-md shadow-red-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>3. "Bad Lung Up" Error</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-red-900/50 text-red-300 rounded">Lethal</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Disastrous gravitational spillover flooding healthy dependent lung; SpO2 &lt; 65%.
              </p>
            </button>

            <button
              onClick={() => applyPreset("adamkiewicz_spinal_infarction")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.interventionalRadiologyStage === "UNSAFE_EMBOLIZATION_ADAMKIEWICZ_IDENTIFIED"
                  ? "bg-amber-950/80 border-amber-500 text-amber-200 shadow-md shadow-amber-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>4. Adamkiewicz Hazard</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-900/50 text-amber-300 rounded">Paraplegia</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                PVA embolization of trunk with hairpin loop; anterior spinal artery infarction.
              </p>
            </button>

            <button
              onClick={() => applyPreset("refractory_abscess_thoracotomy")}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                params.etiology === "NECROTIZING_PNEUMONIA_ABSCESS" && !params.emergencyThoracotomyPerformed
                  ? "bg-purple-950/80 border-purple-500 text-purple-200 shadow-md shadow-purple-950/50"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>5. Refractory Thoracotomy</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-purple-900/50 text-purple-300 rounded">Surgical</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Necrotizing abscess 380 mL/h, loss &gt; 1200 mL, rigid bronchoscopy, OR resection.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Hero 4-Panel Hemodynamic & Gas Exchange Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Panel 1: Gas Exchange & Asphyxiation Status */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-cyan-400" /> Gas Exchange & Drive
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.asphyxiationSeverity === "ARREST_ASPHYXIAL"
                    ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                    : output.asphyxiationSeverity === "IMMINENT_ASPHYXIATION_DROWNING"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    : output.asphyxiationSeverity === "MODERATE_HYPOXIA"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                }`}
              >
                {output.asphyxiationSeverity}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${output.spO2Pct < 85 ? "text-rose-400" : output.spO2Pct < 92 ? "text-amber-300" : "text-emerald-400"}`}>
                  {output.spO2Pct}%
                </span>
                <span className="text-xs text-slate-400">SpO₂</span>
                <span className="ml-auto text-xs px-2 py-0.5 bg-slate-800 rounded text-slate-300">
                  PaO₂ {output.paO2MmHg} mmHg
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">PaCO₂ / VENTILATION</span>
                  <span className={`font-bold text-sm ${output.paCO2MmHg > 50 ? "text-rose-400" : "text-slate-200"}`}>
                    {output.paCO2MmHg} mmHg
                  </span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">PEAK AIRWAY PRESS</span>
                  <span className={`font-bold text-sm ${output.peakAirwayPressureCmH2O > 40 ? "text-rose-400" : "text-cyan-300"}`}>
                    {output.peakAirwayPressureCmH2O} cmH₂O
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Resp Rate: {output.respiratoryRateBpm} /min</span>
            <span className="font-semibold text-rose-400">Dead Space: 150 mL</span>
          </div>
        </div>

        {/* Panel 2: Anatomic Dead Space & Spillover Monitor */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-400" /> Airway Spillover
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.contralateralSpilloverPresent
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {output.contralateralSpilloverPresent ? "SPILLOVER ACTIVE" : "GOOD LUNG SPARED"}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Dead Space Flooding:</span>
                  <span className={`font-bold ${output.anatomicDeadSpaceFloodingPct > 50 ? "text-rose-400" : "text-emerald-400"}`}>
                    {output.anatomicDeadSpaceFloodingPct}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${output.anatomicDeadSpaceFloodingPct > 50 ? "bg-rose-500" : "bg-cyan-500"}`}
                    style={{ width: `${output.anatomicDeadSpaceFloodingPct}%` }}
                  />
                </div>
              </div>

              <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[10px]">AIRWAY PATENCY SCORE</span>
                <span className={`font-bold text-sm ${output.airwayPatencyScore < 40 ? "text-rose-400" : "text-emerald-400"}`}>
                  {output.airwayPatencyScore} / 100
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 line-clamp-1">
            Position: <span className="text-amber-300 font-semibold">{params.patientPosition}</span>
          </div>
        </div>

        {/* Panel 3: Hemodynamics & Perfusion */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" /> Circulatory Profile
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.meanArterialPressureMmHg < 65
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {output.meanArterialPressureMmHg < 65 ? "HYPOTENSION" : "COMPENSATED"}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Mean Arterial Pressure (MAP):</span>
                <span className="font-bold text-slate-200">{output.meanArterialPressureMmHg} mmHg</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Heart Rate:</span>
                <span className="font-bold text-amber-300">{output.heartRateBpm} bpm</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Cardiac Index:</span>
                <span className="font-bold text-cyan-300">{output.cardiacIndexLMinM2} L/min/m²</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Serum Hemoglobin:</span>
                <span className={`font-bold ${output.hemoglobinGDl < 8.0 ? "text-rose-400" : "text-slate-200"}`}>
                  {output.hemoglobinGDl} g/dL
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
            Arterial Lactate: <span className="font-bold text-amber-400">{output.arterialLactateMmolL} mmol/L</span>
          </div>
        </div>

        {/* Panel 4: Bleeding Rate & Hemostasis */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-red-500" /> Bleeding Kinetics
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  output.hemostasisAchieved
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                }`}
              >
                {output.hemostasisAchieved ? "HEMOSTASIS" : "ACTIVE BLEEDING"}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-slate-400 text-xs">Active Flow Rate:</span>
                <div className="text-2xl font-black text-rose-400">
                  {output.activeBleedingRateMlPerHour} <span className="text-xs font-normal text-slate-400">mL/h</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Cumulative Loss:</span>
                <span className="font-bold text-slate-200">{params.cumulativeBloodLossMl} mL</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Bleeding Origin:</span>
                <span className="font-bold text-cyan-300">{params.bleedingLobe}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
            Thoracotomy Indicated: <span className={`font-bold ${output.emergencyThoracotomyIndicated ? "text-rose-400" : "text-emerald-400"}`}>{output.emergencyThoracotomyIndicated ? "YES" : "NO"}</span>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex border-b border-slate-800 gap-2">
          <button
            onClick={() => setActiveTab("airway")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "airway"
                ? "border-cyan-500 text-cyan-400 bg-cyan-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Compass className="w-4 h-4" /> 1. Airway Isolation & Positioning
          </button>
          <button
            onClick={() => setActiveTab("bronchoscopy")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "bronchoscopy"
                ? "border-amber-500 text-amber-400 bg-amber-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-4 h-4" /> 2. Bronchoscopic Hemostasis
          </button>
          <button
            onClick={() => setActiveTab("interventional_bae")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "interventional_bae"
                ? "border-rose-500 text-rose-400 bg-rose-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Radio className="w-4 h-4" /> 3. Interventional Radiology (BAE) & Spinal Safety
          </button>
          <button
            onClick={() => setActiveTab("thoracotomy")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "thoracotomy"
                ? "border-purple-500 text-purple-400 bg-purple-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Scissors className="w-4 h-4" /> 4. Emergency Thoracotomy & Resection
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Tab 1: Airway Isolation & Positioning */}
        {activeTab === "airway" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-5">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" /> Patient Decubitus Positioning
              </h2>

              <div className="space-y-3">
                <label className="block text-xs text-slate-400">Positioning Strategy:</label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => updateParam("patientPosition", "BLEEDING_LUNG_DEPENDENT_DOWN")}
                    className={`p-3 rounded-xl border text-left transition ${
                      params.patientPosition === "BLEEDING_LUNG_DEPENDENT_DOWN"
                        ? "bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/40"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>"Bad Lung Down" (Lateral Decubitus Dependent)</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-900/40 text-emerald-300 rounded">CHEST Guideline</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Gravity confines aspirated blood to the affected hemithorax. Completely prevents contralateral carinal spillover and protects healthy lung.
                    </p>
                  </button>

                  <button
                    onClick={() => updateParam("patientPosition", "SUPINE")}
                    className={`p-3 rounded-xl border text-left transition ${
                      params.patientPosition === "SUPINE"
                        ? "bg-amber-950/60 border-amber-500 text-amber-200"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>Supine Position</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-amber-900/40 text-amber-300 rounded">Spillover Risk</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Blood pools over carina and spills into both mainstem bronchi, drowning the 150 mL dead space.
                    </p>
                  </button>

                  <button
                    onClick={() => updateParam("patientPosition", "BLEEDING_LUNG_UP")}
                    className={`p-3 rounded-xl border text-left transition ${
                      params.patientPosition === "BLEEDING_LUNG_UP"
                        ? "bg-red-950/80 border-red-500 text-red-200 shadow-md shadow-red-950/50 animate-pulse"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between text-red-300">
                      <span>"Bad Lung Up" (Lethal Error)</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-red-900 text-red-100 rounded">Fatal Hazard</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Blood pours directly downhill into the healthy dependent lung, flooding its alveolar surfaces and precipitating acute asphyxial arrest.
                    </p>
                  </button>
                </div>
              </div>

              {/* Bleeding Lobe Selector */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Anatomical Source of Bleeding:</label>
                <select
                  value={params.bleedingLobe}
                  onChange={e => updateParam("bleedingLobe", e.target.value as BleedingLocation)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="RIGHT_UPPER_LOBE">Right Upper Lobe (RUL)</option>
                  <option value="RIGHT_LOWER_LOBE">Right Lower Lobe (RLL)</option>
                  <option value="LEFT_UPPER_LOBE">Left Upper Lobe (LUL)</option>
                  <option value="LEFT_LOWER_LOBE">Left Lower Lobe (LLL)</option>
                </select>
              </div>
            </div>

            {/* Airway Strategy Selector */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Airway Isolation Technique
              </h3>

              <div className="space-y-2 text-xs">
                <button
                  onClick={() => updateParam("airwayStrategy", "LARGE_BORE_ETT_8_5")}
                  className={`w-full p-3 rounded-xl border text-left transition ${
                    params.airwayStrategy === "LARGE_BORE_ETT_8_5"
                      ? "bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/40"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>Large-Bore ETT (≥ 8.0 - 8.5 mm ID)</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-900 text-emerald-200 rounded">Recommended</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Accommodates therapeutic flexible bronchoscope (outer diameter 5.9-6.0 mm) with working suction channel while leaving adequate cross-sectional area for positive-pressure ventilation.
                  </p>
                </button>

                <button
                  onClick={() => updateParam("airwayStrategy", "ENDOBRONCHIAL_BLOCKER_COAXIAL")}
                  className={`w-full p-3 rounded-xl border text-left transition ${
                    params.airwayStrategy === "ENDOBRONCHIAL_BLOCKER_COAXIAL"
                      ? "bg-cyan-950/60 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-950/40"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>Coaxial Endobronchial Blocker (Arndt / Cohen)</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-cyan-900 text-cyan-200 rounded">Targeted Block</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Placed coaxially through large ETT under bronchoscopic guidance; balloon inflated in bleeding lobar/mainstem bronchus to tamponade blood without sacrificing entire lung.
                  </p>
                </button>

                <button
                  onClick={() => updateParam("airwayStrategy", "SELECTIVE_MAINSTEM_INTUBATION")}
                  className={`w-full p-3 rounded-xl border text-left transition ${
                    params.airwayStrategy === "SELECTIVE_MAINSTEM_INTUBATION"
                      ? "bg-purple-950/60 border-purple-500 text-purple-200"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <div className="font-bold">Selective Mainstem Intubation (Non-Bleeding Lung)</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Deliberately advancing single-lumen ETT into the healthy mainstem bronchus. Immediate bridge when endobronchial blockers or DLT are unavailable.
                  </p>
                </button>

                <button
                  onClick={() => updateParam("airwayStrategy", "STANDARD_ETT_7_0")}
                  className={`w-full p-3 rounded-xl border text-left transition ${
                    params.airwayStrategy === "STANDARD_ETT_7_0"
                      ? "bg-amber-950/60 border-amber-500 text-amber-200"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <div className="font-bold text-amber-300">Standard Small-Bore ETT (7.0 mm ID) - Pitfall</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Lumen too small: inserting a 6.0 mm therapeutic bronchoscope almost completely occludes tube, creating extreme airway pressures and auto-PEEP.
                  </p>
                </button>

                <button
                  onClick={() => updateParam("airwayStrategy", "NONE_STANDARD_O2_MASK")}
                  className={`w-full p-2.5 rounded-xl border text-left transition ${
                    params.airwayStrategy === "NONE_STANDARD_O2_MASK"
                      ? "bg-slate-800 border-slate-600 text-slate-200"
                      : "bg-slate-950/40 border-slate-800 text-slate-500 hover:bg-slate-800"
                  }`}
                >
                  No Invasive Airway (Non-Rebreather Mask Only)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Bronchoscopic Hemostasis */}
        {activeTab === "bronchoscopy" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" /> Endoscopic Hemostatic Interventions
              </h3>

              <div className="space-y-2 text-xs">
                <button
                  onClick={() => updateParam("bronchoscopyApplied", "TOPICAL_TRANEXAMIC_ACID_1000MG")}
                  className={`w-full p-3 rounded-xl border text-left transition ${
                    params.bronchoscopyApplied === "TOPICAL_TRANEXAMIC_ACID_1000MG"
                      ? "bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/50"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>Topical Tranexamic Acid (TXA 1000 mg in 20 mL)</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-900 text-emerald-200 rounded">High Efficacy</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Instilled directly into the bleeding segmental bronchus via bronchoscope suction channel. High local antifibrinolytic concentration stabilizes local clot without systemic hypercoagulability.
                  </p>
                </button>

                <button
                  onClick={() => updateParam("bronchoscopyApplied", "COLD_SALINE_LAVAGE_50ML")}
                  className={`w-full p-3 rounded-xl border text-left transition ${
                    params.bronchoscopyApplied === "COLD_SALINE_LAVAGE_50ML"
                      ? "bg-cyan-950/60 border-cyan-500 text-cyan-200"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>Ice-Cold Saline Lavage (50 mL Aliquots)</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-cyan-900 text-cyan-200 rounded">Vasoconstriction</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Instillation of 4°C sterile saline promotes localized mucosal vasoconstriction. Repeated in 50 mL aliquots up to 300-500 mL with active suction clearance.
                  </p>
                </button>

                <button
                  onClick={() => updateParam("bronchoscopyApplied", "TOPICAL_EPINEPHRINE_1_20000")}
                  className={`w-full p-3 rounded-xl border text-left transition ${
                    params.bronchoscopyApplied === "TOPICAL_EPINEPHRINE_1_20000"
                      ? "bg-amber-950/60 border-amber-500 text-amber-200"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>Topical Epinephrine (1:20,000 Dilution)</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-amber-900 text-amber-200 rounded">Alpha-1</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Potent arteriolar vasoconstriction. Monitor for systemic absorption, tachycardia, and hypertension.
                  </p>
                </button>

                <button
                  onClick={() => updateParam("bronchoscopyApplied", "BALLOON_TAMPONADE_ENDOBRONCHIAL")}
                  className={`w-full p-3 rounded-xl border text-left transition ${
                    params.bronchoscopyApplied === "BALLOON_TAMPONADE_ENDOBRONCHIAL"
                      ? "bg-purple-950/60 border-purple-500 text-purple-200"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>Endobronchial Balloon Tamponade (Fogarty Catheter)</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-purple-900 text-purple-200 rounded">Mechanical</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Balloon wedged into bleeding segmental bronchus and inflated with saline/air for 24-48 hours.
                  </p>
                </button>

                <button
                  onClick={() => updateParam("bronchoscopyApplied", "RIGID_BRONCHOSCOPY_MASSIVE_SUCTION")}
                  className={`w-full p-3 rounded-xl border text-left transition ${
                    params.bronchoscopyApplied === "RIGID_BRONCHOSCOPY_MASSIVE_SUCTION"
                      ? "bg-rose-950/60 border-rose-500 text-rose-200"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>Rigid Bronchoscopy (Operating Room)</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-rose-900 text-rose-200 rounded">Massive Suction</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Unrivaled wide-bore suction capacity for massive clot extraction; permits jet ventilation and optical grasping forceps.
                  </p>
                </button>
              </div>
            </div>

            {/* Suction & Endoscopic Clearance Evaluation */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> Endoscopic Suction & Working Channel Dynamics
              </h3>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Suction Channel Clearance:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      output.bronchoscopySuctionAdequacy === "SUPERIOR_RIGID_CLEARANCE"
                        ? "bg-purple-950 text-purple-300 border border-purple-800"
                        : output.bronchoscopySuctionAdequacy === "ADEQUATE_CLEARANCE"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        : output.bronchoscopySuctionAdequacy === "INADEQUATE_LUMEN_BLOCKED"
                        ? "bg-red-950 text-red-300 border border-red-800 animate-pulse"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {output.bronchoscopySuctionAdequacy}
                  </span>
                </div>

                <div className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                  <p>
                    <strong>Channel Caliber Rule:</strong> Standard diagnostic bronchoscopes have a 2.0-2.2 mm suction channel, which clots within seconds in massive hemoptysis. A therapeutic bronchoscope with ≥ 2.8 mm channel is mandatory.
                  </p>
                  <p>
                    <strong>Systemic Antifibrinolytic:</strong> IV Tranexamic Acid (1g IV over 10 min followed by 1g over 8h) stabilizes systemic fibrin networks.
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-slate-800 text-slate-300">
                  <input
                    type="checkbox"
                    checked={params.systemicTranexamicAcidIvGiven}
                    onChange={e => updateParam("systemicTranexamicAcidIvGiven", e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0"
                  />
                  <span className="font-semibold text-emerald-300">Administer IV Tranexamic Acid (1g IV)</span>
                </label>
              </div>

              {/* Endoscopic Viewport Simulation */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">BRONCHOSCOPIC VISUALIZATION</span>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
                  {output.hemostasisAchieved
                    ? "Clear tracheobronchial lumen. Clot organized and stationary in segmental bronchus without active pulsatile bleeding."
                    : output.contralateralSpilloverPresent
                    ? "Massive pool of dark red blood overflowing the carina and pouring into both left and right mainstem bronchi. Severe visual obscuration."
                    : `Active hemorrhage localized strictly to the ${params.bleedingLobe}. Main carina and contralateral bronchus clear of blood.`}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Interventional Radiology (BAE) & Spinal Safety */}
        {activeTab === "interventional_bae" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" /> Bronchial Artery Embolization (BAE) Console
              </h3>

              <div className="space-y-2 text-xs">
                <button
                  onClick={() => updateParam("interventionalRadiologyStage", "CTA_CHEST_VESSEL_MAPPING")}
                  className={`w-full p-3 rounded-xl border text-left transition ${
                    params.interventionalRadiologyStage === "CTA_CHEST_VESSEL_MAPPING"
                      ? "bg-cyan-950/60 border-cyan-500 text-cyan-200"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>1. CTA Chest Angiography & Vascular Mapping</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-cyan-900 text-cyan-200 rounded">Pre-IR Map</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Multi-detector CTA identifies hypertrophied bronchial arteries (&gt; 2.0 mm diameter) and systemic non-bronchial collateral vessels.
                  </p>
                </button>

                <button
                  onClick={() => updateParam("interventionalRadiologyStage", "BRONCHIAL_ANGIOGRAM_DIAGNOSTIC")}
                  className={`w-full p-3 rounded-xl border text-left transition ${
                    params.interventionalRadiologyStage === "BRONCHIAL_ANGIOGRAM_DIAGNOSTIC"
                      ? "bg-amber-950/60 border-amber-500 text-amber-200"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>2. Selective Diagnostic Angiography</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-amber-900 text-amber-200 rounded">Hairpin Screen</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Selective catheterization of bronchial artery. Mandatory fluoroscopic screening for the Artery of Adamkiewicz hairpin loop!
                  </p>
                </button>

                <button
                  onClick={() => updateParam("interventionalRadiologyStage", "MICROCATHER_DISTAL_SUBSELECTIVE_EMBOLIZATION")}
                  className={`w-full p-3 rounded-xl border text-left transition ${
                    params.interventionalRadiologyStage === "MICROCATHER_DISTAL_SUBSELECTIVE_EMBOLIZATION"
                      ? "bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/50"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>3. Subselective Microcatheter Embolization (Distal to Spinal Branch)</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-900 text-emerald-200 rounded">Gold Standard</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Coaxial microcatheter advanced past the takeoff of the anterior spinal artery collateral. Polyvinyl alcohol (PVA 355-500 µm) safely injected.
                  </p>
                </button>

                <button
                  onClick={() => updateParam("interventionalRadiologyStage", "UNSAFE_EMBOLIZATION_ADAMKIEWICZ_IDENTIFIED")}
                  className={`w-full p-3 rounded-xl border text-left transition ${
                    params.interventionalRadiologyStage === "UNSAFE_EMBOLIZATION_ADAMKIEWICZ_IDENTIFIED"
                      ? "bg-red-950/80 border-red-500 text-red-200 shadow-md shadow-red-950/50 animate-pulse"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <div className="font-bold flex items-center justify-between text-red-300">
                    <span>4. Unsafe Particulate Injection (Adamkiewicz Embolization)</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-red-900 text-red-100 rounded">Paraplegia</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Catastrophic pitfall: particles injected into main trunk despite visible spinal feeder, occluding anterior spinal artery!
                  </p>
                </button>
              </div>
            </div>

            {/* Artery of Adamkiewicz Spinal Safety Screen */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Artery of Adamkiewicz Spinal Cord Safety
              </h3>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Anterior Spinal Artery Feeder:</span>
                  <span className={`font-bold ${output.arteryOfAdamkiewiczRisk.spinalArteryVisualizedOnAngio ? "text-amber-400" : "text-slate-400"}`}>
                    {output.arteryOfAdamkiewiczRisk.spinalArteryVisualizedOnAngio ? "HAIRPIN LOOP IDENTIFIED" : "NOT ENGAGED"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Catheter Tip Position:</span>
                  <span className="font-bold text-cyan-300">
                    {output.arteryOfAdamkiewiczRisk.catheterPositionRelative}
                  </span>
                </div>

                {output.arteryOfAdamkiewiczRisk.spinalCordInfarctionOccurred ? (
                  <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-red-200 text-[11px] leading-relaxed">
                    <span className="font-bold block mb-1">CATASTROPHIC COMPLICATION:</span>
                    {output.arteryOfAdamkiewiczRisk.neurologicalDeficitSummary}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
                    <strong>Anatomical Anatomy Pearl:</strong> The Artery of Adamkiewicz (arteria radicularis magna) typically arises between T9 and T12 from an intercostal artery, but can arise as high as T5 and in ~5% of patients shares a common trunk with a bronchial artery. Particulate injection with particles &lt; 300 µm or non-target embolization produces anterior spinal cord infarction and permanent paraplegia.
                  </div>
                )}
              </div>

              {/* PVA Particle Sizing Rules */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="font-bold text-cyan-300">Embolic Agent Sizing Rules:</div>
                <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1">
                  <li><strong>Recommended:</strong> PVA particles 355-500 µm or calibrated microspheres (Embospheres 500-700 µm).</li>
                  <li><strong>Hazard:</strong> Particles &lt; 300 µm pass through bronchopulmonary shunts into pulmonary veins and systemic circulation, risking stroke, myocardial infarction, or tissue necrosis.</li>
                  <li><strong>Coils:</strong> Used only for pseudoaneurysms or main trunk occlusion after distal bed is embolized. Proximal coil occlusion alone prevents future transcatheter access during recurrence.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Emergency Thoracotomy */}
        {activeTab === "thoracotomy" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Scissors className="w-4 h-4 text-purple-400" /> Surgical Indications & Resection
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-200">Indications for Emergent Operating Room Resection:</div>
                  <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1">
                    <li>Massive hemoptysis refractory to or recurring despite bronchial artery embolization.</li>
                    <li>Aspergilloma / Mycetoma with cavitary bleeding (BAE has high late recurrence rate &gt; 50%).</li>
                    <li>Tracheobronchial rupture or traumatic vascular laceration.</li>
                    <li>Localized resectable bronchogenic carcinoma.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200">Emergency Thoracotomy Action:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${params.emergencyThoracotomyPerformed ? "bg-purple-950 text-purple-300" : "bg-slate-800 text-slate-400"}`}>
                      {params.emergencyThoracotomyPerformed ? "COMPLETED" : "NOT PERFORMED"}
                    </span>
                  </div>

                  <button
                    onClick={() => updateParam("emergencyThoracotomyPerformed", !params.emergencyThoracotomyPerformed)}
                    className={`w-full p-3 rounded-xl border font-bold text-xs transition ${
                      params.emergencyThoracotomyPerformed
                        ? "bg-purple-950/80 border-purple-500 text-purple-200 shadow-md shadow-purple-950/50"
                        : "bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200"
                    }`}
                  >
                    {params.emergencyThoracotomyPerformed ? "Undo Emergency Thoracotomy" : "Perform Emergency Thoracotomy & Lobectomy"}
                  </button>

                  <p className="text-[11px] text-slate-400">
                    Emergency surgical resection during active bleeding has an operative mortality of 20-40%. Pre-operative stabilization with endobronchial isolation and BAE dramatically lowers operative risk.
                  </p>
                </div>
              </div>
            </div>

            {/* Resuscitation & Blood Component Bench */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Droplets className="w-4 h-4 text-rose-400" /> Coagulopathy & Transfusion Bench
              </h3>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Coagulopathy (INR):</span>
                  <span className="font-bold text-amber-300">{params.coagulopathyPresentInr.toFixed(1)}</span>
                </div>
                <input aria-label="Coagulopathy (INR)"
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.1"
                  value={params.coagulopathyPresentInr}
                  onChange={e => updateParam("coagulopathyPresentInr", Number(e.target.value))}
                  className="w-full accent-amber-500"
                />

                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Platelet Count:</span>
                  <span className="font-bold text-cyan-300">{params.plateletCountK}k /µL</span>
                </div>
                <input aria-label="Platelet Count"
                  type="range"
                  min="20"
                  max="300"
                  step="10"
                  value={params.plateletCountK}
                  onChange={e => updateParam("plateletCountK", Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 text-[11px] leading-relaxed">
                <strong>Hemostatic Reversal Targets:</strong> In massive hemoptysis, reverse warfarin/DOACs immediately (4-factor Prothrombin Complex Concentrate PCC), maintain Platelets &gt; 50,000/µL, Fibrinogen &gt; 150-200 mg/dL, and correct hypocalcemia (ionized Ca &gt; 1.1 mmol/L).
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
