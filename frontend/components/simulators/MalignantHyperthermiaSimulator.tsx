"use client";

import React, { useState, useMemo } from "react";
import {
  Flame,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Thermometer,
  Syringe,
  Wind,
  Stethoscope,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  Zap,
  Info,
  Clock,
  Layers,
  Sparkles,
  Sliders,
  AlertOctagon,
  Heart,
  Droplets
} from "lucide-react";
import {
  MalignantHyperthermiaEngine,
  HypermetabolicDisorder,
  DantroleneFormulation,
  PatientVitals,
  NeuromuscularExam,
  LaboratoryProfile,
  CrisisInterventions
} from "../../.gemini/skills/MalignantHyperthermiaEngine";

export default function MalignantHyperthermiaSimulator() {
  const presets = useMemo(() => MalignantHyperthermiaEngine.getClinicalPresets(), []);

  // Current simulation state initialized to hyperacute MH
  const [selectedPreset, setSelectedPreset] = useState<string>("hyperacute_mh");
  const [vitals, setVitals] = useState<PatientVitals>(presets.hyperacute_mh.vitals);
  const [exam, setExam] = useState<NeuromuscularExam>(presets.hyperacute_mh.exam);
  const [labs, setLabs] = useState<LaboratoryProfile>(presets.hyperacute_mh.labs);
  const [triggers, setTriggers] = useState(presets.hyperacute_mh.triggers);
  const [onsetHours, setOnsetHours] = useState<number>(presets.hyperacute_mh.onsetHours);
  const [patientWeightKg, setPatientWeightKg] = useState<number>(presets.hyperacute_mh.weightKg);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"triage" | "dantrolene" | "mhaus" | "labs" | "guide">("triage");

  // Dantrolene & Interventions State
  const [dantroleneFormulation, setDantroleneFormulation] = useState<DantroleneFormulation>("RYANODEX");
  const [dantroleneDoseMgPerKg, setDantroleneDoseMgPerKg] = useState<number>(2.5);

  const [interventions, setInterventions] = useState<CrisisInterventions>({
    triggeringAnestheticsDiscontinued: false,
    charcoalFiltersApplied: false,
    fiO2Percent: 100,
    minuteVentilationMultiplier: 1.0,
    activeExternalCooling: false,
    coldIvSalineInfused: false,
    dantroleneAdministeredMgPerKg: 0,
    calciumChlorideGiven: false,
    insulinDextroseGiven: false,
    sodiumBicarbonateGiven: false,
    calciumChannelBlockerGiven: false,
    bromocriptineGiven: false,
    cyproheptadineGiven: false
  });

  // Preset Selection Handler
  const handleSelectPreset = (key: string) => {
    setSelectedPreset(key);
    const p = presets[key];
    setVitals(p.vitals);
    setExam(p.exam);
    setLabs(p.labs);
    setTriggers(p.triggers);
    setOnsetHours(p.onsetHours);
    setPatientWeightKg(p.weightKg);

    // Reset interventions
    setInterventions({
      triggeringAnestheticsDiscontinued: key === "nms_haloperidol" || key === "serotonin_syndrome_hunter",
      charcoalFiltersApplied: false,
      fiO2Percent: 100,
      minuteVentilationMultiplier: 1.0,
      activeExternalCooling: false,
      coldIvSalineInfused: false,
      dantroleneAdministeredMgPerKg: 0,
      calciumChlorideGiven: false,
      insulinDextroseGiven: false,
      sodiumBicarbonateGiven: false,
      calciumChannelBlockerGiven: false,
      bromocriptineGiven: key === "nms_haloperidol",
      cyproheptadineGiven: key === "serotonin_syndrome_hunter"
    });
  };

  // Differential Classification
  const diagnosticResult = useMemo(() => {
    return MalignantHyperthermiaEngine.classifyDisorder(
      exam,
      triggers,
      vitals.endTidalCo2Mmhg,
      onsetHours
    );
  }, [exam, triggers, vitals.endTidalCo2Mmhg, onsetHours]);

  // MHAUS Score
  const mhausScoreData = useMemo(() => {
    return MalignantHyperthermiaEngine.calculateMhausScore(
      exam.rigidityType,
      vitals.endTidalCo2Mmhg,
      vitals.coreTemperatureC,
      vitals.heartRateBpm,
      labs.creatineKinaseUPerL,
      labs.serumPotassiumMeqL,
      labs.arterialPh
    );
  }, [exam.rigidityType, vitals, labs]);

  // Dantrolene Reconstitution Calculation
  const dantroleneCalc = useMemo(() => {
    return MalignantHyperthermiaEngine.calculateDantroleneNeeds(
      dantroleneFormulation,
      patientWeightKg,
      dantroleneDoseMgPerKg
    );
  }, [dantroleneFormulation, patientWeightKg, dantroleneDoseMgPerKg]);

  // Dynamic Crisis Simulation Output
  const simResult = useMemo(() => {
    return MalignantHyperthermiaEngine.simulateCrisis(
      vitals,
      labs,
      interventions,
      patientWeightKg
    );
  }, [vitals, labs, interventions, patientWeightKg]);

  return (
    <div className="space-y-6">
      {/* Executive Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-rose-800/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-rose-500/20 text-rose-300 text-xs font-semibold rounded-full border border-rose-400/30 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                Track A69 &bull; Anesthesiology, Critical Care &amp; Toxicology
              </span>
              <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 text-xs font-mono rounded border border-amber-500/20">
                MHAUS &bull; Hunter Criteria Compliant
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Malignant Hyperthermia &amp; Hypermetabolic Crisis Workstation
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Biophysical simulation of ryanodine receptor (RYR1) calcium release kinetics, differential triage between MH, NMS, and Serotonin Syndrome,
              Ryanodex vs Traditional Dantrium reconstitution stoichiometry, and MHAUS emergency rescue protocols.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSelectPreset(selectedPreset)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 transition shadow"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Scenario
            </button>
          </div>
        </div>

        {/* Clinical Scenarios Toolbar */}
        <div className="mt-6 pt-4 border-t border-rose-900/40">
          <div className="text-xs font-semibold uppercase tracking-wider text-rose-300/80 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            Standard Hypermetabolic Crisis Scenarios
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              {
                id: "hyperacute_mh",
                title: "Hyperacute OR Malignant Hyperthermia",
                desc: "Sevoflurane + Succinylcholine, masseter spasm, EtCO2 82 mmHg, Ryanodex rescue",
                badge: "Malignant Hyperthermia",
                badgeColor: "bg-red-500/20 text-red-300 border-red-500/30"
              },
              {
                id: "nms_haloperidol",
                title: "Neuroleptic Malignant Syndrome",
                desc: "High-dose haloperidol day 4, lead-pipe rigidity, temp 40.2C, hyporeflexic",
                badge: "NMS (Dopamine Block)",
                badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30"
              },
              {
                id: "serotonin_syndrome_hunter",
                title: "Severe Serotonin Syndrome",
                desc: "SSRI + Tramadol + Linezolid, spontaneous clonus, hyperreflexia +4, hyperactive gut",
                badge: "Hunter Criteria Met",
                badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30"
              },
              {
                id: "refractory_mh_hyperkalemia",
                title: "Refractory MH & Extreme Hyperkalemia",
                desc: "Delayed diagnosis, temp 41.8C, K+ 8.1 mEq/L, CK 98,000 U/L, imminent VF arrest",
                badge: "Imminent Arrest",
                badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30"
              }
            ].map(preset => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`p-3 rounded-xl text-left border transition flex flex-col justify-between ${
                  selectedPreset === preset.id
                    ? "bg-rose-900/40 border-rose-400/80 shadow-lg shadow-rose-950/50"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-white">{preset.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${preset.badgeColor}`}>
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2">{preset.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Executive KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Primary Diagnosis */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Primary Diagnosis
            </span>
            <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-300 text-[10px] font-semibold rounded border border-rose-500/20">
              {diagnosticResult.confidence}% Conf.
            </span>
          </div>
          <div className="my-2">
            <div className="text-base font-bold text-white leading-tight">
              {diagnosticResult.disorder.replace(/_/g, " ")}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              MHAUS Score: <span className="font-mono font-bold text-rose-400">{mhausScoreData.score} pts</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5 truncate">
            {mhausScoreData.probabilityTier}
          </div>
        </div>

        {/* KPI 2: End-Tidal CO2 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Wind className="w-4 h-4 text-amber-400" />
              End-Tidal CO2 (EtCO2)
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                simResult.currentVitals.endTidalCo2Mmhg >= 55
                  ? "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}
            >
              {simResult.currentVitals.endTidalCo2Mmhg >= 55 ? "Early Hallmark" : "Normal"}
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-white font-mono flex items-baseline gap-1">
              {simResult.currentVitals.endTidalCo2Mmhg}
              <span className="text-xs font-normal text-slate-400">mmHg</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Refractory to minute ventilation
            </div>
          </div>
          <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5">
            MV: <span className="font-mono text-slate-300">{vitals.minuteVentilationLpm * interventions.minuteVentilationMultiplier} L/min</span> &bull; Baseline 35-45
          </div>
        </div>

        {/* KPI 3: Core Temperature */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Thermometer className="w-4 h-4 text-red-400" />
              Core Temperature
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                simResult.currentVitals.coreTemperatureC >= 41.0
                  ? "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse"
                  : simResult.currentVitals.coreTemperatureC >= 38.8
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}
            >
              {simResult.currentVitals.coreTemperatureC >= 41.0 ? "Critical" : simResult.currentVitals.coreTemperatureC >= 38.8 ? "Hyperthermic" : "Normothermic"}
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-white font-mono flex items-baseline gap-1">
              {simResult.currentVitals.coreTemperatureC}
              <span className="text-xs font-normal text-slate-400">&deg;C</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Active Cooling: <span className="font-semibold text-slate-200">{interventions.activeExternalCooling ? "Engaged" : "Inactive"}</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5">
            Stop cooling when core temp &lt; 38.5&deg;C to prevent overshoot
          </div>
        </div>

        {/* KPI 4: Serum Potassium */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Activity className="w-4 h-4 text-purple-400" />
              Serum Potassium (K+)
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                simResult.currentLabs.serumPotassiumMeqL >= 7.0
                  ? "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse"
                  : simResult.currentLabs.serumPotassiumMeqL >= 5.5
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}
            >
              {simResult.currentLabs.serumPotassiumMeqL >= 7.0 ? "Arrest Hazard" : "K+ Elevated"}
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-white font-mono flex items-baseline gap-1">
              {simResult.currentLabs.serumPotassiumMeqL}
              <span className="text-xs font-normal text-slate-400">mEq/L</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              pH: <span className="font-mono text-slate-200">{simResult.currentLabs.arterialPh}</span> &bull; CK: {labs.creatineKinaseUPerL.toLocaleString()} U/L
            </div>
          </div>
          <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5">
            CaCl2 Membrane Protection: {interventions.calciumChlorideGiven ? "Given" : "Required if K > 6.0"}
          </div>
        </div>

        {/* KPI 5: Dantrolene Plan */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Syringe className="w-4 h-4 text-emerald-400" />
              Dantrolene Plan
            </span>
            <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold rounded border border-indigo-400/30">
              {dantroleneCalc.formulation}
            </span>
          </div>
          <div className="my-2">
            <div className="text-lg font-bold text-white font-mono flex items-baseline gap-1">
              {dantroleneCalc.vialsRequired} {dantroleneCalc.vialsRequired === 1 ? "vial" : "vials"} ({dantroleneCalc.totalDoseMg} mg)
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Water: <span className="font-mono text-emerald-300 font-bold">{dantroleneCalc.sterileWaterVolumeMl} mL</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5">
            Prep time: &lt; {dantroleneCalc.reconstitutionTimeSeconds}s &bull; Dose: {dantroleneDoseMgPerKg} mg/kg
          </div>
        </div>
      </div>

      {/* Lethal Fatal Pitfalls Alert Banner */}
      {simResult.fatalPitfalls.length > 0 && (
        <div className="bg-red-950/60 border-2 border-red-500 rounded-xl p-4 space-y-2 animate-pulse">
          <div className="flex items-center gap-2 text-red-300 font-bold text-sm">
            <AlertOctagon className="w-5 h-5 text-red-400" />
            LETHAL MEDICAL PITFALL TRIGGERED
          </div>
          <div className="space-y-1">
            {simResult.fatalPitfalls.map((pitfall, idx) => (
              <div key={idx} className="text-xs text-red-200 font-semibold bg-red-900/40 p-2.5 rounded border border-red-700/60">
                {pitfall}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
        {[
          { id: "triage", label: "1. Crisis Triage & Hunter Matrix", icon: ShieldAlert },
          { id: "dantrolene", label: "2. Dantrolene Reconstitution Bench", icon: Syringe },
          { id: "mhaus", label: "3. MHAUS Emergency Rescue Suite", icon: Flame },
          { id: "labs", label: "4. Acid-Base & Rhabdomyolysis", icon: Droplets },
          { id: "guide", label: "5. Clinical Knowledge & Guidelines", icon: Info }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-slate-800/90 text-rose-300 border-t-2 border-rose-500 border-x border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Crisis Triage & Hunter Matrix */}
      {activeTab === "triage" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Triggers & Exam Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-rose-400" />
                Triggering Pharmacotherapy &amp; Exposure
              </h3>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setTriggers(prev => ({ ...prev, volatileAnesthetics: !prev.volatileAnesthetics }))}
                  className={`p-3 rounded-lg border text-left transition ${
                    triggers.volatileAnesthetics
                      ? "bg-rose-950/60 border-rose-500 text-rose-200"
                      : "bg-slate-800/40 border-slate-700 text-slate-400"
                  }`}
                >
                  <div className="text-xs font-bold">Volatile Anesthetics</div>
                  <div className="text-[10px] opacity-80">Sevoflurane, Desflurane</div>
                </button>

                <button
                  onClick={() => setTriggers(prev => ({ ...prev, succinylcholine: !prev.succinylcholine }))}
                  className={`p-3 rounded-lg border text-left transition ${
                    triggers.succinylcholine
                      ? "bg-rose-950/60 border-rose-500 text-rose-200"
                      : "bg-slate-800/40 border-slate-700 text-slate-400"
                  }`}
                >
                  <div className="text-xs font-bold">Succinylcholine</div>
                  <div className="text-[10px] opacity-80">Depolarizing NMB</div>
                </button>

                <button
                  onClick={() => setTriggers(prev => ({ ...prev, dopamineAntagonists: !prev.dopamineAntagonists }))}
                  className={`p-3 rounded-lg border text-left transition ${
                    triggers.dopamineAntagonists
                      ? "bg-purple-950/60 border-purple-500 text-purple-200"
                      : "bg-slate-800/40 border-slate-700 text-slate-400"
                  }`}
                >
                  <div className="text-xs font-bold">Dopamine Antagonists</div>
                  <div className="text-[10px] opacity-80">Haloperidol, Fluphenazine</div>
                </button>

                <button
                  onClick={() => setTriggers(prev => ({ ...prev, serotonergicAgents: !prev.serotonergicAgents }))}
                  className={`p-3 rounded-lg border text-left transition ${
                    triggers.serotonergicAgents
                      ? "bg-amber-950/60 border-amber-500 text-amber-200"
                      : "bg-slate-800/40 border-slate-700 text-slate-400"
                  }`}
                >
                  <div className="text-xs font-bold">Serotonergic Drugs</div>
                  <div className="text-[10px] opacity-80">SSRI, Tramadol, Linezolid</div>
                </button>
              </div>

              {/* Neuromuscular Exam Controls */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Neuromuscular Exam Hallmarks</h4>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Muscle Rigidity Type:</label>
                  <select
                    value={exam.rigidityType}
                    onChange={e => setExam(prev => ({ ...prev, rigidityType: e.target.value as any }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="NONE">None</option>
                    <option value="MASSETER_SPASM">Masseter Spasm (Jaws of Steel - MH)</option>
                    <option value="GENERALIZED_RIGIDITY">Generalized Rigidity (Severe MH)</option>
                    <option value="LEAD_PIPE">Lead-Pipe Plastic Rigidity (NMS)</option>
                    <option value="TREMOR_AND_CLONUS">Tremor &amp; Hypertonia (Serotonin Syndrome)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Deep Tendon Reflexes &amp; Clonus:</label>
                  <select
                    value={exam.reflexes}
                    onChange={e => setExam(prev => ({ ...prev, reflexes: e.target.value as any }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="NORMAL">Normal (+2)</option>
                    <option value="DIMINISHED">Diminished / Hyporeflexic (NMS)</option>
                    <option value="HYPERREFLEXIC_3_PLUS">Brisk Hyperreflexia (+3)</option>
                    <option value="CLONUS_SPONTANEOUS_4_PLUS">Spontaneous / Ocular Clonus (+4 - Hunter Criteria)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Autonomic Gut Motility:</label>
                  <select
                    value={exam.bowelSounds}
                    onChange={e => setExam(prev => ({ ...prev, bowelSounds: e.target.value as any }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="NORMAL">Normal Bowel Sounds</option>
                    <option value="ABSENT">Decreased / Absent (NMS / MH)</option>
                    <option value="HYPERACTIVE_DIARRHEA">Hyperactive Bowel Sounds &amp; Diarrhea (Serotonin Syndrome)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tri-Disorder Differential Matrix */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Tri-Disorder Differential Matrix (MH vs NMS vs Serotonin Syndrome)</span>
                <span className="text-xs font-mono text-rose-400 font-bold">
                  Calculated Match: {diagnosticResult.disorder.replace(/_/g, " ")}
                </span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-800/80 text-white uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-2.5">Feature</th>
                      <th className="p-2.5 text-rose-400">Malignant Hyperthermia</th>
                      <th className="p-2.5 text-purple-400">Neuroleptic Malignant</th>
                      <th className="p-2.5 text-amber-400">Serotonin Syndrome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-2.5 font-semibold text-white">Mechanism</td>
                      <td className="p-2.5">RYR1 Ca2+ channel mutation</td>
                      <td className="p-2.5">Central D2 receptor blockade</td>
                      <td className="p-2.5">5-HT1A / 5-HT2A stimulation</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-2.5 font-semibold text-white">Triggers</td>
                      <td className="p-2.5">Volatile gases, succinylcholine</td>
                      <td className="p-2.5">Antipsychotics, DA withdrawal</td>
                      <td className="p-2.5">SSRIs, SNRIs, MAOIs, tramadol</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-2.5 font-semibold text-white">Onset</td>
                      <td className="p-2.5 text-rose-300 font-bold">Minutes (Hyperacute)</td>
                      <td className="p-2.5 text-purple-300">Days (1-7 days)</td>
                      <td className="p-2.5 text-amber-300 font-bold">Hours (&lt; 12-24h)</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-2.5 font-semibold text-white">Rigidity</td>
                      <td className="p-2.5">Masseter spasm, generalized</td>
                      <td className="p-2.5 font-bold">Lead-pipe plastic rigidity</td>
                      <td className="p-2.5">Hypertonia (lower &gt; upper)</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-2.5 font-semibold text-white">Reflexes</td>
                      <td className="p-2.5">Normal / diminished</td>
                      <td className="p-2.5">Hyporeflexic / normal</td>
                      <td className="p-2.5 text-amber-300 font-bold">Clonus (ocular/ankle) +4</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-2.5 font-semibold text-white">Pupils &amp; GI</td>
                      <td className="p-2.5">Normal pupils, normal gut</td>
                      <td className="p-2.5">Normal pupils, decreased gut</td>
                      <td className="p-2.5 text-amber-300 font-bold">Mydriasis, hyperactive gut</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-2.5 font-semibold text-white">Primary Antidote</td>
                      <td className="p-2.5 text-emerald-400 font-bold">Dantrolene (2.5 mg/kg)</td>
                      <td className="p-2.5 text-purple-300 font-bold">Bromocriptine / Amantadine</td>
                      <td className="p-2.5 text-amber-300 font-bold">Cyproheptadine (12 mg)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Diagnostic Evidence List */}
              <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-1.5">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Diagnostic Evidence Checklist:
                </div>
                <div className="space-y-1">
                  {diagnosticResult.evidence.map((ev, idx) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-rose-400 font-bold">&bull;</span>
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Dantrolene Reconstitution Bench */}
      {activeTab === "dantrolene" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Formulation Comparison */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Syringe className="w-4 h-4 text-emerald-400" />
                Dantrolene Formulation Stoichiometry
              </h3>

              {/* Formulation Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDantroleneFormulation("RYANODEX")}
                  className={`p-4 rounded-xl border text-left transition ${
                    dantroleneFormulation === "RYANODEX"
                      ? "bg-emerald-950/50 border-emerald-500 text-white shadow-lg"
                      : "bg-slate-800/40 border-slate-700 text-slate-400"
                  }`}
                >
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Ryanodex (Nanocrystalline)
                  </div>
                  <div className="text-xs text-slate-200 mt-1 font-semibold">250 mg / vial &bull; 5 mL Water</div>
                  <div className="text-[11px] text-slate-400 mt-1">Reconstitutes in under 20 seconds. Single clinician administration.</div>
                </button>

                <button
                  onClick={() => setDantroleneFormulation("TRADITIONAL_DANTRIUM")}
                  className={`p-4 rounded-xl border text-left transition ${
                    dantroleneFormulation === "TRADITIONAL_DANTRIUM"
                      ? "bg-indigo-950/50 border-indigo-500 text-white shadow-lg"
                      : "bg-slate-800/40 border-slate-700 text-slate-400"
                  }`}
                >
                  <div className="text-xs font-bold text-indigo-400">Traditional Dantrium / Revonto</div>
                  <div className="text-xs text-slate-200 mt-1 font-semibold">20 mg / vial &bull; 60 mL Water</div>
                  <div className="text-[11px] text-slate-400 mt-1">Requires 10 to 40 vials and liters of sterile water. Heavy labor.</div>
                </button>
              </div>

              {/* Weight & Dose Sliders */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Patient Body Weight</span>
                    <span className="font-mono text-white font-bold">{patientWeightKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={140}
                    value={patientWeightKg}
                    onChange={e => setPatientWeightKg(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Target Dantrolene Dose</span>
                    <span className="font-mono text-emerald-300 font-bold">{dantroleneDoseMgPerKg} mg/kg</span>
                  </div>
                  <input
                    type="range"
                    min={1.0}
                    max={10.0}
                    step={0.5}
                    value={dantroleneDoseMgPerKg}
                    onChange={e => setDantroleneDoseMgPerKg(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>1.0 mg/kg (Maintenance)</span>
                    <span>2.5 mg/kg (Initial Bolus)</span>
                    <span>10.0 mg/kg (Max Ceiling)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Reconstitution Metrics Card */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Calculated Preparation &amp; Administration Bench</span>
                <span className="text-xs font-mono text-emerald-400">Total: {dantroleneCalc.totalDoseMg} mg</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/60 text-center">
                  <div className="text-xs text-slate-400">Vials to Reconstitute</div>
                  <div className="text-3xl font-bold font-mono text-white my-1">{dantroleneCalc.vialsRequired}</div>
                  <div className="text-[10px] text-slate-400">
                    {dantroleneFormulation === "RYANODEX" ? "250 mg vials" : "20 mg vials"}
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/60 text-center">
                  <div className="text-xs text-slate-400">Sterile Water Required</div>
                  <div className="text-3xl font-bold font-mono text-cyan-300 my-1">
                    {dantroleneCalc.sterileWaterVolumeMl} <span className="text-xs text-slate-400">mL</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {(dantroleneCalc.sterileWaterVolumeMl / 1000).toFixed(2)} Liters SWFI
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Estimated Time to Push:</span>
                  <span className="font-mono text-emerald-300 font-bold">&lt; {dantroleneCalc.reconstitutionTimeSeconds} seconds</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {dantroleneCalc.clinicalBurdenLabel}
                </p>
              </div>

              {/* Administer Dantrolene Button */}
              <button
                onClick={() => setInterventions(prev => ({
                  ...prev,
                  dantroleneAdministeredMgPerKg: dantroleneDoseMgPerKg
                }))}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow flex items-center justify-center gap-2"
              >
                <Syringe className="w-4 h-4" />
                Push Dantrolene {dantroleneDoseMgPerKg} mg/kg ({dantroleneCalc.totalDoseMg} mg) IV Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MHAUS Emergency Rescue Suite */}
      {activeTab === "mhaus" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Immediate Rescue Actions */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                MHAUS Life-Saving Action Checklist
              </h3>

              <div className="space-y-2">
                {simResult.checklist.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs flex items-center justify-between transition ${
                      item.done
                        ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                        : item.critical
                        ? "bg-red-950/30 border-red-500/40 text-red-200"
                        : "bg-slate-800/40 border-slate-700 text-slate-300"
                    }`}
                  >
                    <span className="flex items-center gap-2 font-medium">
                      {item.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                      {item.step}
                    </span>
                    <span className="text-[10px] font-mono uppercase opacity-75">
                      {item.done ? "Done" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Intervention Switches */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Direct Clinical Interventions Bench</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  simResult.status === "CONTROLLED"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : simResult.status === "IMMINENT_CARDIAC_ARREST"
                    ? "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}>
                  Status: {simResult.status.replace(/_/g, " ")}
                </span>
              </h3>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                {/* Switch 1: Stop Volatile */}
                <button
                  onClick={() => setInterventions(prev => ({
                    ...prev,
                    triggeringAnestheticsDiscontinued: !prev.triggeringAnestheticsDiscontinued
                  }))}
                  className={`p-3 rounded-lg border text-left transition ${
                    interventions.triggeringAnestheticsDiscontinued
                      ? "bg-emerald-950/40 border-emerald-500 text-emerald-300"
                      : "bg-red-950/40 border-red-500 text-red-300"
                  }`}
                >
                  <div className="font-bold">1. Stop Triggering Gases</div>
                  <div className="text-[10px] opacity-80">{interventions.triggeringAnestheticsDiscontinued ? "Discontinued & Vaporizer Off" : "Gases Still Flowing!"}</div>
                </button>

                {/* Switch 2: 100% O2 Hyperventilation */}
                <button
                  onClick={() => setInterventions(prev => ({
                    ...prev,
                    minuteVentilationMultiplier: prev.minuteVentilationMultiplier >= 2 ? 1.0 : 3.0
                  }))}
                  className={`p-3 rounded-lg border text-left transition ${
                    interventions.minuteVentilationMultiplier >= 2
                      ? "bg-emerald-950/40 border-emerald-500 text-emerald-300"
                      : "bg-slate-800/40 border-slate-700 text-slate-300"
                  }`}
                >
                  <div className="font-bold">2. Hyperventilate 100% O2</div>
                  <div className="text-[10px] opacity-80">{interventions.minuteVentilationMultiplier >= 2 ? "3x Minute Ventilation" : "Baseline MV"}</div>
                </button>

                {/* Switch 3: Active Cooling */}
                <button
                  onClick={() => setInterventions(prev => ({
                    ...prev,
                    activeExternalCooling: !prev.activeExternalCooling,
                    coldIvSalineInfused: !prev.coldIvSalineInfused
                  }))}
                  className={`p-3 rounded-lg border text-left transition ${
                    interventions.activeExternalCooling
                      ? "bg-cyan-950/40 border-cyan-500 text-cyan-300"
                      : "bg-slate-800/40 border-slate-700 text-slate-300"
                  }`}
                >
                  <div className="font-bold">3. Core Cooling Protocol</div>
                  <div className="text-[10px] opacity-80">{interventions.activeExternalCooling ? "Cold Saline & Ice Packs" : "No Cooling"}</div>
                </button>

                {/* Switch 4: Insulin / Dextrose */}
                <button
                  onClick={() => setInterventions(prev => ({
                    ...prev,
                    insulinDextroseGiven: !prev.insulinDextroseGiven
                  }))}
                  className={`p-3 rounded-lg border text-left transition ${
                    interventions.insulinDextroseGiven
                      ? "bg-purple-950/40 border-purple-500 text-purple-300"
                      : "bg-slate-800/40 border-slate-700 text-slate-300"
                  }`}
                >
                  <div className="font-bold">4. Insulin 10U + D50W</div>
                  <div className="text-[10px] opacity-80">{interventions.insulinDextroseGiven ? "Shifting K+ Intracellularly" : "Untreated Hyperkalemia"}</div>
                </button>

                {/* Switch 5: Calcium Chloride */}
                <button
                  onClick={() => setInterventions(prev => ({
                    ...prev,
                    calciumChlorideGiven: !prev.calciumChlorideGiven
                  }))}
                  className={`p-3 rounded-lg border text-left transition ${
                    interventions.calciumChlorideGiven
                      ? "bg-indigo-950/40 border-indigo-500 text-indigo-300"
                      : "bg-slate-800/40 border-slate-700 text-slate-300"
                  }`}
                >
                  <div className="font-bold">5. Calcium Chloride 1g</div>
                  <div className="text-[10px] opacity-80">{interventions.calciumChlorideGiven ? "Myocardial Membrane Protected" : "Vulnerable to VF"}</div>
                </button>

                {/* Switch 6: Lethal CCB Toggle */}
                <button
                  onClick={() => setInterventions(prev => ({
                    ...prev,
                    calciumChannelBlockerGiven: !prev.calciumChannelBlockerGiven
                  }))}
                  className={`p-3 rounded-lg border text-left transition ${
                    interventions.calciumChannelBlockerGiven
                      ? "bg-red-950 border-2 border-red-500 text-red-200 animate-pulse"
                      : "bg-slate-800/40 border-slate-700 text-slate-400"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1 text-red-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Lethal Trap: Give CCB
                  </div>
                  <div className="text-[10px] opacity-80">{interventions.calciumChannelBlockerGiven ? "Verapamil/Diltiazem Given!" : "Avoided (Safe)"}</div>
                </button>
              </div>

              {/* Action Recommendation Box */}
              <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-1.5">
                <div className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Recommended Next Clinical Actions:
                </div>
                {simResult.actions.map((act, idx) => (
                  <div key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                    <span className="text-rose-400 font-bold">&bull;</span>
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Acid-Base & Rhabdomyolysis */}
      {activeTab === "labs" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              Severe Mixed Acid-Base Kinetics
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Malignant Hyperthermia triggers profound mixed metabolic and respiratory acidosis. Massive ATP hydrolysis and glycogenolysis surge lactic acid,
              while skeletal muscle contracture overwhelms pulmonary ventilation with carbon dioxide.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <span className="text-slate-400">Arterial pH:</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">{simResult.currentLabs.arterialPh}</div>
                <span className="text-[10px] text-slate-500">Normal 7.35 - 7.45</span>
              </div>

              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <span className="text-slate-400">PaCO2:</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">{labs.paco2Mmhg} mmHg</div>
                <span className="text-[10px] text-slate-500">Normal 35 - 45</span>
              </div>

              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <span className="text-slate-400">Serum Bicarbonate:</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">{labs.serumBicarbonateMeqL} mEq/L</div>
                <span className="text-[10px] text-slate-500">Normal 22 - 26</span>
              </div>

              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <span className="text-slate-400">Lactate:</span>
                <div className="text-2xl font-bold font-mono text-red-300 mt-1">{labs.lactateMmolL} mmol/L</div>
                <span className="text-[10px] text-slate-500">Normal &lt; 2.0</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              Rhabdomyolysis &amp; Renal Protection
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unchecked calcium influx causes sarcolemmal rupture, spilling massive creatine kinase, myoglobin, and potassium into the bloodstream.
              Myoglobin precipitates in renal tubules, causing acute tubular necrosis.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 flex justify-between items-center">
                <span>Peak Creatine Kinase (CK):</span>
                <span className="font-mono font-bold text-red-400 text-lg">{labs.creatineKinaseUPerL.toLocaleString()} U/L</span>
              </div>

              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 flex justify-between items-center">
                <span>Myoglobinuria (Cola Urine):</span>
                <span className="font-bold text-amber-400">{labs.myoglobinuriaPresent ? "Positive (Gross)" : "Negative"}</span>
              </div>

              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 flex justify-between items-center">
                <span>Urine Output Target (&ge; 1-2 mL/kg/h):</span>
                <span className="font-mono font-bold text-cyan-300">{labs.urineOutputMlPerHr} mL/h ({labs.urineOutputMlPerHr >= patientWeightKg ? "Adequate" : "Oliguric"})</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Clinical Knowledge & Guidelines */}
      {activeTab === "guide" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Lethal Pitfalls &amp; Contraindications
            </h3>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/50">
                <strong className="text-red-300">Calcium Channel Blockers are Absolute Contraindication:</strong> Co-administering verapamil or diltiazem with Dantrolene causes profound myocardial depression, intractable hyperkalemia, and cardiovascular collapse.
              </li>
              <li className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/50">
                <strong className="text-amber-300">Do Not Wait for Fever to Treat:</strong> Hyperthermia is a late sign of Malignant Hyperthermia. The earliest and most sensitive sign is an unexplained surge in EtCO2 (&gt; 55 mmHg).
              </li>
              <li className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/50">
                <strong className="text-cyan-300">Recrudescence Risk (25%):</strong> Crisis can recur within 24-48 hours. Continue maintenance Dantrolene (1 mg/kg IV q4-6h) for at least 24-48 hours in the ICU.
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              MHAUS Resources &amp; Definitive Diagnostics
            </h3>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/50">
                <strong className="text-emerald-300">24/7 MHAUS Emergency Hotline:</strong> 1-800-MH-HYPER (1-800-644-9737) provides real-time anesthesiologist consultant guidance during active crises.
              </li>
              <li className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/50">
                <strong className="text-indigo-300">Caffeine-Halothane Contracture Test (CHCT):</strong> Gold standard muscle biopsy testing for MH susceptibility. Evaluates muscle fascicle contracture when exposed to halothane and caffeine.
              </li>
              <li className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/50">
                <strong className="text-purple-300">Genetic Sequencing:</strong> Identifies pathogenic mutations in the RYR1 or CACNA1S genes in 70-80% of susceptible families.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
