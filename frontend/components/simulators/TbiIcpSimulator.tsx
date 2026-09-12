"use client";

import React, { useState, useMemo } from "react";
import {
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Gauge,
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
  Scissors
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area
} from "recharts";
import {
  TbiIcpMonroeKellieEngine,
  TbiSimulationState,
  TbiSimulationOutput,
  IntracranialCompartments
} from "../../.gemini/skills/TbiIcpMonroeKellieEngine";

export default function TbiIcpSimulator() {
  const presets = useMemo(() => TbiIcpMonroeKellieEngine.getClinicalPresets(), []);

  // Current simulation state initialized to epidural uncal preset
  const [state, setState] = useState<TbiSimulationState>(presets.epidural_uncal);
  const [selectedPreset, setSelectedPreset] = useState<string>("epidural_uncal");
  const [activeTab, setActiveTab] = useState<"triage" | "waveforms" | "osmotherapy" | "protocol" | "guide">("triage");

  // Hyperosmolar & Ventilation controls state
  const [selectedOsmoAgent, setSelectedOsmoAgent] = useState<"MANNITOL_20" | "HYPERTONIC_SALINE_3" | "HYPERTONIC_SALINE_23_4" | "NONE">("NONE");
  const [osmoDose, setOsmoDose] = useState<number>(0.5); // g/kg or 250 mL
  const [serumSodium, setSerumSodium] = useState<number>(140);
  const [paco2, setPaco2] = useState<number>(38);
  const [pao2, setPao2] = useState<number>(100);

  // Load preset handler
  const handleSelectPreset = (key: string) => {
    setSelectedPreset(key);
    const targetState = { ...presets[key] };
    setState(targetState);
    if (key === "epidural_uncal") {
      setSelectedOsmoAgent("HYPERTONIC_SALINE_23_4");
      setOsmoDose(30);
      setSerumSodium(142);
      setPaco2(36);
    } else if (key === "dai_plateau_waves") {
      setSelectedOsmoAgent("HYPERTONIC_SALINE_3");
      setOsmoDose(250);
      setSerumSodium(145);
      setPaco2(34);
    } else if (key === "contusion_dysautoregulation") {
      setSelectedOsmoAgent("MANNITOL_20");
      setOsmoDose(0.5);
      setSerumSodium(139);
      setPaco2(35);
    } else if (key === "refractory_rescueicp") {
      setSelectedOsmoAgent("HYPERTONIC_SALINE_3");
      setOsmoDose(500);
      setSerumSodium(152);
      setPaco2(32);
    }
  };

  // Run simulation engine
  const simOutput: TbiSimulationOutput = useMemo(() => {
    return TbiIcpMonroeKellieEngine.runSimulation(state);
  }, [state]);

  // Hyperosmolar calculations
  const osmoRegimen = useMemo(() => {
    return TbiIcpMonroeKellieEngine.calculateHyperosmolarTherapy(
      selectedOsmoAgent,
      osmoDose,
      state.patientWeightKg,
      serumSodium
    );
  }, [selectedOsmoAgent, osmoDose, state.patientWeightKg, serumSodium]);

  // Ventilation calculations
  const ventStatus = useMemo(() => {
    return TbiIcpMonroeKellieEngine.evaluateVentilation(paco2, pao2, simOutput.cppMmhg);
  }, [paco2, pao2, simOutput.cppMmhg]);

  // Generate Monroe-Kellie Volume-Pressure Curve Data
  const volumePressureCurveData = useMemo(() => {
    const data = [];
    const baseCompartments: IntracranialCompartments = {
      ...state.compartments,
      massLesionVolumeMl: 0,
      vasogenicEdemaMl: 0
    };

    const currentTotalAdded = state.compartments.massLesionVolumeMl + state.compartments.vasogenicEdemaMl;

    for (let addedVol = 0; addedVol <= 140; addedVol += 5) {
      const tempComp: IntracranialCompartments = {
        ...baseCompartments,
        massLesionVolumeMl: addedVol
      };
      const res = TbiIcpMonroeKellieEngine.calculateIcp(
        tempComp,
        state.evdClamped,
        state.evdDrainageRateMlHr,
        paco2,
        state.headOfBedAngleDeg,
        state.decompressiveCraniectomyDone
      );
      data.push({
        addedVolumeMl: addedVol,
        icp: res.icp,
        isCurrent: Math.abs(addedVol - currentTotalAdded) < 3
      });
    }
    return data;
  }, [state, paco2]);

  // Generate Lundberg Trend Data (30 minutes)
  const lundbergTrendData = useMemo(() => {
    const data = [];
    const baseIcp = simOutput.icpMmhg;
    const waveType = simOutput.lundbergWave;

    for (let t = 0; t <= 30; t += 1) {
      let val = baseIcp;
      if (waveType === "LUNDBERG_A_PLATEAU") {
        // Plateau wave surges between minute 8 and 22
        if (t >= 8 && t <= 22) {
          val = baseIcp + Math.sin(((t - 8) / 14) * Math.PI) * 35;
        } else {
          val = baseIcp + Math.sin(t * 0.8) * 3;
        }
      } else if (waveType === "LUNDBERG_B_RHYTHMIC") {
        // 0.5 - 2 waves per minute oscillations
        val = baseIcp + Math.sin(t * 1.5) * 8 + Math.cos(t * 0.5) * 3;
      } else {
        // Normal C waves: slight gentle ripple
        val = baseIcp + Math.sin(t * 2.2) * 2;
      }
      data.push({
        minute: t,
        icp: Math.max(3, Math.round(val * 10) / 10),
        threshold: 22
      });
    }
    return data;
  }, [simOutput.icpMmhg, simOutput.lundbergWave]);

  // Update compartment values
  const updateCompartment = (key: keyof IntracranialCompartments, value: number) => {
    setState(prev => ({
      ...prev,
      compartments: {
        ...prev.compartments,
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Executive Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full border border-indigo-400/30 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                Track A68 &bull; Neurocritical Care & Neurosurgery
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-mono rounded border border-emerald-500/20">
                BTF 4th Ed &bull; SIBICC Compliant
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Traumatic Brain Injury & ICP Dynamics Workstation
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Real-time biophysical simulation of the Monroe-Kellie volume-pressure doctrine, dynamic Lundberg A/B/C wave rhythms,
              Cerebral Perfusion Pressure (CPP) optimization, hyperosmolar therapy titration (Mannitol vs 23.4% Saline), and surgical decompressive craniectomy decision-making.
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
        <div className="mt-6 pt-4 border-t border-indigo-900/40">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-300/80 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Standard Clinical Scenarios & Pathology Archetypes
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              {
                id: "epidural_uncal",
                title: "Acute Epidural Hematoma",
                desc: "Uncal herniation, blown pupil, emergent 23.4% bullet + OR craniotomy",
                badge: "Uncal Herniation",
                badgeColor: "bg-red-500/20 text-red-300 border-red-500/30"
              },
              {
                id: "dai_plateau_waves",
                title: "Severe Diffuse Axonal Injury",
                desc: "High elastance, Lundberg A plateau surges to 65 mmHg, EVD open",
                badge: "Lundberg A Waves",
                badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30"
              },
              {
                id: "contusion_dysautoregulation",
                title: "Contusion & Dysautoregulation",
                desc: "Positive PRx (+0.52), pressure-passive bed, vasopressor edema surge",
                badge: "PRx Defect",
                badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30"
              },
              {
                id: "refractory_rescueicp",
                title: "Refractory Intracranial HTN",
                desc: "Exhausted medical tiers, RESCUEicp candidate for Hemicraniectomy",
                badge: "RESCUEicp Candidate",
                badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30"
              }
            ].map(preset => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`p-3 rounded-xl text-left border transition flex flex-col justify-between ${
                  selectedPreset === preset.id
                    ? "bg-indigo-900/40 border-indigo-400/80 shadow-lg shadow-indigo-950/50"
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
        {/* KPI 1: ICP & Compliance */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Gauge className="w-4 h-4 text-indigo-400" />
              Intracranial Pressure
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                simOutput.icpMmhg <= 15
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : simOutput.icpMmhg <= 22
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse"
              }`}
            >
              {simOutput.icpMmhg <= 22 ? "BTF Target OK" : "ICP Exceeded"}
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-white font-mono flex items-baseline gap-1">
              {simOutput.icpMmhg}
              <span className="text-xs font-normal text-slate-400">mmHg</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Compliance: <span className="font-semibold text-slate-200">{simOutput.complianceState.replace("_", " ")}</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5">
            Elastance: <span className="font-mono text-slate-300">{simOutput.elastanceCoefficient}</span> &bull; Ref &le; 22 mmHg
          </div>
        </div>

        {/* KPI 2: CPP Optimization */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Cerebral Perfusion
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                simOutput.targetCppAchieved
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : simOutput.ischemicThreatActive
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : "bg-purple-500/10 text-purple-400 border-purple-500/20"
              }`}
            >
              {simOutput.targetCppAchieved ? "60-70 Target" : simOutput.ischemicThreatActive ? "Ischemia" : "Hyperemia"}
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-white font-mono flex items-baseline gap-1">
              {simOutput.cppMmhg}
              <span className="text-xs font-normal text-slate-400">mmHg</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              MAP: <span className="font-mono text-slate-200">{state.meanArterialPressureMmhg}</span> mmHg &minus; ICP
            </div>
          </div>
          <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5">
            PRx Index: <span className="font-mono text-slate-300">+{state.prxAutoregulationIndex}</span> ({state.prxAutoregulationIndex > 0.25 ? "Defective" : "Intact"})
          </div>
        </div>

        {/* KPI 3: Waveform & Lundberg Rhythm */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Activity className="w-4 h-4 text-emerald-400" />
              Lundberg Rhythm
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                simOutput.lundbergWave === "LUNDBERG_A_PLATEAU"
                  ? "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse"
                  : simOutput.lundbergWave === "LUNDBERG_B_RHYTHMIC"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}
            >
              {simOutput.lundbergWave.replace(/_/g, " ")}
            </span>
          </div>
          <div className="my-2">
            <div className="text-lg font-bold text-white font-mono flex items-baseline gap-1">
              P2/P1: {simOutput.pulseWaveform.p2p1Ratio}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 truncate">
              {simOutput.pulseWaveform.morphologyLabel}
            </div>
          </div>
          <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5">
            P1: {simOutput.pulseWaveform.p1PercussionMmhg} &bull; P2: {simOutput.pulseWaveform.p2TidalMmhg} &bull; P3: {simOutput.pulseWaveform.p3DicroticMmhg}
          </div>
        </div>

        {/* KPI 4: Herniation Risk */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Herniation Risk
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                simOutput.herniationRisk === "NONE"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse"
              }`}
            >
              {simOutput.herniationIndexPct}% Risk
            </span>
          </div>
          <div className="my-2">
            <div className="text-base font-bold text-white truncate">
              {simOutput.herniationRisk.replace(/_/g, " ")}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Midline Shift: <span className="font-mono text-slate-200">{state.midlineShiftMm} mm</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5">
            Pupils: R {state.pupils.rightDiameterMm}mm ({state.pupils.rightReactivity[0]}) | L {state.pupils.leftDiameterMm}mm ({state.pupils.leftReactivity[0]})
          </div>
        </div>

        {/* KPI 5: BTF Tier */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Layers className="w-4 h-4 text-amber-400" />
              BTF Protocol Tier
            </span>
            <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold rounded border border-indigo-400/30">
              SIBICC
            </span>
          </div>
          <div className="my-2">
            <div className="text-base font-bold text-white">
              {simOutput.currentTier.replace(/_/g, " ")}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              EVD: <span className="font-semibold text-slate-200">{state.evdClamped ? "Clamped" : `Draining ${state.evdDrainageRateMlHr} mL/h`}</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5">
            Craniectomy: <span className="font-semibold text-slate-300">{state.decompressiveCraniectomyDone ? "Completed" : "Intact Vault"}</span>
          </div>
        </div>
      </div>

      {/* Critical Safety Banners */}
      {simOutput.safetyAlerts.length > 0 && (
        <div className="bg-red-950/40 border border-red-500/50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-red-300 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
            Critical Neurocritical Care Alerts
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {simOutput.safetyAlerts.map((alert, idx) => (
              <div key={idx} className="text-xs text-red-200/90 flex items-start gap-1.5 bg-red-900/20 p-2 rounded border border-red-800/40">
                <span className="text-red-400 font-bold">&bull;</span>
                <span>{alert}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
        {[
          { id: "triage", label: "1. Triage & Monroe-Kellie Vault", icon: Brain },
          { id: "waveforms", label: "2. Waveforms & Lundberg Monitor", icon: Activity },
          { id: "osmotherapy", label: "3. Hyperosmolar & Ventilation Bench", icon: Syringe },
          { id: "protocol", label: "4. BTF Tiered Escalation & Surgery", icon: Scissors },
          { id: "guide", label: "5. Clinical Knowledge & Pitfalls", icon: Info }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-slate-800/90 text-indigo-300 border-t-2 border-indigo-500 border-x border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Triage & Monroe-Kellie Compartments */}
      {activeTab === "triage" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Sliders & Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  Intracranial Volume Sliders
                </h3>
                <span className="text-[11px] text-slate-400">Total Vault: 1700 mL</span>
              </div>

              {/* Mass Lesion Volume */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Mass Lesion (Hematoma / Contusion)</span>
                  <span className="font-mono text-indigo-300 font-bold">{state.compartments.massLesionVolumeMl} mL</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={120}
                  step={5}
                  value={state.compartments.massLesionVolumeMl}
                  onChange={e => updateCompartment("massLesionVolumeMl", Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0 mL (None)</span>
                  <span>40 mL (Compensated)</span>
                  <span>120 mL (Massive)</span>
                </div>
              </div>

              {/* Vasogenic Edema */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Vasogenic & Cytotoxic Edema</span>
                  <span className="font-mono text-cyan-300 font-bold">{state.compartments.vasogenicEdemaMl} mL</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={80}
                  step={5}
                  value={state.compartments.vasogenicEdemaMl}
                  onChange={e => updateCompartment("vasogenicEdemaMl", Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0 mL</span>
                  <span>40 mL</span>
                  <span>80 mL</span>
                </div>
              </div>

              {/* Head of Bed Angle */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Head of Bed (HOB) Angle</span>
                  <span className="font-mono text-emerald-300 font-bold">{state.headOfBedAngleDeg}&deg;</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={5}
                  value={state.headOfBedAngleDeg}
                  onChange={e => setState(prev => ({ ...prev, headOfBedAngleDeg: Number(e.target.value) }))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0&deg; (Flat - Stasis)</span>
                  <span>30&deg; (Optimal)</span>
                  <span>60&deg;</span>
                </div>
              </div>

              {/* Hemodynamics: MAP & BP */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Mean Arterial Pressure (MAP)</span>
                  <span className="font-mono text-amber-300 font-bold">{state.meanArterialPressureMmhg} mmHg</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={130}
                  step={2}
                  value={state.meanArterialPressureMmhg}
                  onChange={e => {
                    const newMap = Number(e.target.value);
                    setState(prev => ({
                      ...prev,
                      meanArterialPressureMmhg: newMap,
                      systolicBpMmhg: Math.round(newMap * 1.3),
                      diastolicBpMmhg: Math.round(newMap * 0.8)
                    }));
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>50 mmHg (Hypotension)</span>
                  <span>85-95 mmHg (Optimal)</span>
                  <span>130 mmHg</span>
                </div>
              </div>

              {/* Midline Shift */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">CT Midline Shift</span>
                  <span className="font-mono text-rose-300 font-bold">{state.midlineShiftMm} mm</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={0.5}
                  value={state.midlineShiftMm}
                  onChange={e => setState(prev => ({ ...prev, midlineShiftMm: Number(e.target.value) }))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0 mm</span>
                  <span>5 mm (Surgical Threshold)</span>
                  <span>20 mm</span>
                </div>
              </div>

              {/* EVD Drainage Toggle & Rate */}
              <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">External Ventricular Drain (EVD)</span>
                  <button
                    onClick={() => setState(prev => ({ ...prev, evdClamped: !prev.evdClamped }))}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition ${
                      state.evdClamped
                        ? "bg-slate-700 text-slate-300 border-slate-600"
                        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    }`}
                  >
                    {state.evdClamped ? "Clamped" : "Open & Draining"}
                  </button>
                </div>
                {!state.evdClamped && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Drainage Rate:</span>
                      <span className="font-mono font-bold text-emerald-400">{state.evdDrainageRateMlHr} mL/h</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={25}
                      value={state.evdDrainageRateMlHr}
                      onChange={e => setState(prev => ({ ...prev, evdDrainageRateMlHr: Number(e.target.value) }))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Visual Monroe-Kellie Breakdown & Volume-Pressure Curve */}
          <div className="lg:col-span-7 space-y-4">
            {/* Monroe-Kellie Visual Bar */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Monroe-Kellie Spatial Vault Distribution</span>
                <span className="text-xs font-mono text-indigo-400">
                  Total: {1400 + 150 + 150 + state.compartments.massLesionVolumeMl + state.compartments.vasogenicEdemaMl} / 1700 mL
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                The rigid cranium has a fixed volume. An increase in mass lesion or brain edema must be compensated by an equal reduction in CSF and venous blood volume.
              </p>

              {/* Stacked bar representation */}
              <div className="h-7 w-full bg-slate-800 rounded-lg overflow-hidden flex shadow-inner border border-slate-700">
                <div style={{ width: "68%" }} className="bg-blue-600/80 flex items-center justify-center text-[10px] font-semibold text-white truncate px-1">
                  Brain (1400 mL)
                </div>
                <div style={{ width: "9%" }} className="bg-red-600/80 flex items-center justify-center text-[10px] font-semibold text-white truncate px-1">
                  Blood
                </div>
                <div style={{ width: "9%" }} className="bg-cyan-500/80 flex items-center justify-center text-[10px] font-semibold text-white truncate px-1">
                  CSF
                </div>
                {state.compartments.massLesionVolumeMl > 0 && (
                  <div
                    style={{ width: `${Math.min(10, (state.compartments.massLesionVolumeMl / 1700) * 100)}%` }}
                    className="bg-amber-500 flex items-center justify-center text-[10px] font-semibold text-slate-950 truncate px-1 animate-pulse"
                  >
                    Mass
                  </div>
                )}
                {state.compartments.vasogenicEdemaMl > 0 && (
                  <div
                    style={{ width: `${Math.min(8, (state.compartments.vasogenicEdemaMl / 1700) * 100)}%` }}
                    className="bg-purple-500 flex items-center justify-center text-[10px] font-semibold text-white truncate px-1"
                  >
                    Edema
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Brain 80%</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Blood 10%</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> CSF 10%</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Mass Lesion ({state.compartments.massLesionVolumeMl} mL)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Edema ({state.compartments.vasogenicEdemaMl} mL)</span>
              </div>
            </div>

            {/* Monroe-Kellie Volume-Pressure Curve Chart */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  Intracranial Volume-Pressure & Elastance Curve
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Current ICP: {simOutput.icpMmhg} mmHg</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={volumePressureCurveData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="icpGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="addedVolumeMl"
                      stroke="#94a3b8"
                      tick={{ fontSize: 11 }}
                      label={{ value: "Added Pathological Volume (mL)", position: "insideBottom", offset: -5, fill: "#94a3b8", fontSize: 11 }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      tick={{ fontSize: 11 }}
                      domain={[0, 80]}
                      label={{ value: "ICP (mmHg)", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                      formatter={(val: any) => [`${val} mmHg`, "ICP"]}
                      labelFormatter={(lbl: any) => `Added Volume: ${lbl} mL`}
                    />
                    <ReferenceLine y={22} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "BTF Threshold 22 mmHg", fill: "#f87171", fontSize: 10 }} />
                    <Area type="monotone" dataKey="icp" stroke="#818cf8" strokeWidth={2.5} fillOpacity={1} fill="url(#icpGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-lg text-xs text-slate-300 flex items-center justify-between border border-slate-700/60">
                <span>
                  <strong className="text-white">Active Curve Stage:</strong> {simOutput.complianceState.replace(/_/g, " ")}
                </span>
                <span className="font-mono text-indigo-300 font-bold">
                  Elastance dP/dV: {simOutput.elastanceCoefficient}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Waveforms & Lundberg Monitor */}
      {activeTab === "waveforms" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Pulse Waveform Anatomy */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Cardiac Pulse Wave Anatomy (P1, P2, P3)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Normal intracranial compliance features <strong>P1 &gt; P2 &gt; P3</strong>. As spatial buffer is exhausted and brain tissue elastance rises,
                the rebound tidal wave <strong>P2 surges above P1 (P2/P1 &ge; 1.0)</strong>, giving the waveform a pathological rounded dome appearance.
              </p>

              {/* Visual Pulse Components */}
              <div className="space-y-3">
                <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-emerald-400">P1 &bull; Percussion Wave</div>
                    <div className="text-[11px] text-slate-400">Arterial pulse transmitted through choroid plexus</div>
                  </div>
                  <div className="text-lg font-mono font-bold text-white">{simOutput.pulseWaveform.p1PercussionMmhg} mmHg</div>
                </div>

                <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-amber-400">P2 &bull; Tidal Wave</div>
                    <div className="text-[11px] text-slate-400">Brain tissue elastance rebound wave</div>
                  </div>
                  <div className="text-lg font-mono font-bold text-white">{simOutput.pulseWaveform.p2TidalMmhg} mmHg</div>
                </div>

                <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-cyan-400">P3 &bull; Dicrotic Wave</div>
                    <div className="text-[11px] text-slate-400">Venous reflection and aortic valve closure notch</div>
                  </div>
                  <div className="text-lg font-mono font-bold text-white">{simOutput.pulseWaveform.p3DicroticMmhg} mmHg</div>
                </div>
              </div>

              {/* P2/P1 Ratio Badge */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                simOutput.pulseWaveform.p2p1Ratio >= 1.0
                  ? "bg-red-500/10 border-red-500/30 text-red-300"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              }`}>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">P2 / P1 Compliance Ratio</div>
                  <div className="text-[11px] opacity-80">{simOutput.pulseWaveform.morphologyLabel}</div>
                </div>
                <div className="text-2xl font-bold font-mono">{simOutput.pulseWaveform.p2p1Ratio}</div>
              </div>
            </div>
          </div>

          {/* Right Column: 30-Minute Lundberg Trend Monitor */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  30-Minute Continuous Lundberg Trend Monitor
                </h3>
                <span className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                  simOutput.lundbergWave === "LUNDBERG_A_PLATEAU"
                    ? "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse"
                    : "bg-slate-800 text-slate-300 border-slate-700"
                }`}>
                  {simOutput.lundbergWave.replace(/_/g, " ")}
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lundbergTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="minute"
                      stroke="#94a3b8"
                      tick={{ fontSize: 11 }}
                      label={{ value: "Time (Minutes)", position: "insideBottom", offset: -5, fill: "#94a3b8", fontSize: 11 }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      tick={{ fontSize: 11 }}
                      domain={[0, 90]}
                      label={{ value: "ICP (mmHg)", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                      formatter={(val: any) => [`${val} mmHg`, "ICP"]}
                    />
                    <ReferenceLine y={22} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "BTF Threshold (22 mmHg)", fill: "#f87171", fontSize: 10 }} />
                    <Line
                      type="monotone"
                      dataKey="icp"
                      stroke={simOutput.lundbergWave === "LUNDBERG_A_PLATEAU" ? "#ef4444" : "#10b981"}
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Lundberg Clinical Significance Callout */}
              <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-1.5">
                <div className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Rhythm Pathophysiology:
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {simOutput.lundbergWave === "LUNDBERG_A_PLATEAU" && (
                    <span className="text-red-300">
                      <strong>Lundberg A (Plateau) Waves:</strong> Sustained steep elevations of ICP to 50-100 mmHg lasting 5-20 minutes.
                      Precipitated by cerebral vasodilation in response to reduced CPP in a brain with exhausted spatial buffer. This expands cerebral blood volume, triggering impending herniation.
                    </span>
                  )}
                  {simOutput.lundbergWave === "LUNDBERG_B_RHYTHMIC" && (
                    <span className="text-amber-300">
                      <strong>Lundberg B Waves:</strong> Rhythmic oscillations of 0.5-2 waves/min with amplitudes of 10-20 mmHg.
                      Signals diminishing intracranial compliance and respiratory/cheyne-stokes instability.
                    </span>
                  )}
                  {simOutput.lundbergWave === "NORMAL_C_WAVE" && (
                    <span className="text-emerald-300">
                      <strong>Lundberg C Waves:</strong> High frequency (4-8 waves/min) low-amplitude Traube-Hering-Mayer waves reflecting normal arterial blood pressure fluctuations.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Hyperosmolar & Ventilation Bench */}
      {activeTab === "osmotherapy" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Osmotherapy Titration */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Syringe className="w-4 h-4 text-indigo-400" />
                Hyperosmolar Therapy Titration
              </h3>

              {/* Agent Selector */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "MANNITOL_20", label: "Mannitol 20%", sub: "0.25-1.0 g/kg" },
                  { id: "HYPERTONIC_SALINE_3", label: "3% NaCl", sub: "250-500 mL" },
                  { id: "HYPERTONIC_SALINE_23_4", label: "23.4% NaCl", sub: "30 mL Bullet" }
                ].map(agent => (
                  <button
                    key={agent.id}
                    onClick={() => {
                      setSelectedOsmoAgent(agent.id as any);
                      if (agent.id === "MANNITOL_20") setOsmoDose(0.5);
                      if (agent.id === "HYPERTONIC_SALINE_3") setOsmoDose(250);
                      if (agent.id === "HYPERTONIC_SALINE_23_4") setOsmoDose(30);
                    }}
                    className={`p-3 rounded-lg border text-left transition ${
                      selectedOsmoAgent === agent.id
                        ? "bg-indigo-900/50 border-indigo-500 text-white shadow"
                        : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="font-semibold text-xs text-white">{agent.label}</div>
                    <div className="text-[10px] text-slate-400">{agent.sub}</div>
                  </button>
                ))}
              </div>

              {/* Dose Slider */}
              {selectedOsmoAgent === "MANNITOL_20" && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Mannitol Dose</span>
                    <span className="font-mono text-indigo-300 font-bold">{osmoDose} g/kg</span>
                  </div>
                  <input
                    type="range"
                    min={0.25}
                    max={1.0}
                    step={0.25}
                    value={osmoDose}
                    onChange={e => setOsmoDose(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>0.25 g/kg</span>
                    <span>0.5 g/kg</span>
                    <span>1.0 g/kg</span>
                  </div>
                </div>
              )}

              {selectedOsmoAgent === "HYPERTONIC_SALINE_3" && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">3% Hypertonic Saline Bolus Volume</span>
                    <span className="font-mono text-cyan-300 font-bold">{osmoDose} mL</span>
                  </div>
                  <input
                    type="range"
                    min={150}
                    max={500}
                    step={50}
                    value={osmoDose}
                    onChange={e => setOsmoDose(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>150 mL</span>
                    <span>250 mL (Standard)</span>
                    <span>500 mL</span>
                  </div>
                </div>
              )}

              {selectedOsmoAgent === "HYPERTONIC_SALINE_23_4" && (
                <div className="p-3 bg-red-950/30 border border-red-500/40 rounded-lg text-xs text-red-200">
                  <strong>Emergency 30 mL Salt Bullet:</strong> Administer 30 mL of 23.4% NaCl (120 mEq Na+) via central line over 10-15 minutes for impending uncal herniation.
                </div>
              )}

              {/* Lab Monitoring Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/60">
                  <div className="text-[11px] text-slate-400">Post-Dose Serum Na+</div>
                  <div className="text-xl font-bold font-mono text-white mt-0.5">
                    {osmoRegimen.serumSodiumMeqL} <span className="text-xs text-slate-400">mEq/L</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Target: 145 - 155 mEq/L</div>
                </div>

                <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/60">
                  <div className="text-[11px] text-slate-400">Osmolal Gap (Mannitol)</div>
                  <div className={`text-xl font-bold font-mono mt-0.5 ${osmoRegimen.osmolalGapExceeded ? "text-red-400" : "text-white"}`}>
                    {osmoRegimen.osmolalGap} <span className="text-xs text-slate-400">mOsm/kg</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Safety Limit: &lt; 20 mOsm/kg</div>
                </div>
              </div>

              {/* Safety Alerts */}
              {osmoRegimen.osmolalGapExceeded && (
                <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-lg text-xs text-red-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>OSMOLAL GAP CEILING BREACHED:</strong> Gap &ge; 20 mOsm/kg or serum osmolality &ge; 320 mOsm/kg.
                    Mannitol clearance is saturated; further administration induces acute tubular necrosis (ATN) and reverse osmotic cerebral edema. Switch to Hypertonic Saline.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Ventilation & PbtO2 */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wind className="w-4 h-4 text-cyan-400" />
                Ventilation & Cerebral Vasoreactivity Bench
              </h3>

              {/* PaCO2 Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Arterial PaCO2 (Target 35-40, Mild Hypocapnia 30-35)</span>
                  <span className={`font-mono font-bold ${paco2 < 30 ? "text-red-400" : "text-cyan-300"}`}>{paco2} mmHg</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={50}
                  step={1}
                  value={paco2}
                  onChange={e => setPaco2(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>20 mmHg (Severe Ischemia)</span>
                  <span>35-40 mmHg (Normocapnia)</span>
                  <span>50 mmHg (Vasodilation)</span>
                </div>
              </div>

              {/* Brain Tissue Oxygen (PbtO2) Display */}
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">Brain Tissue Oxygen Tension (PbtO2)</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    ventStatus.pbto2Mmhg >= 20
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse"
                  }`}>
                    {ventStatus.pbto2Mmhg >= 20 ? "Adequate Oxygenation" : "Cerebral Tissue Ischemia"}
                  </span>
                </div>
                <div className="text-3xl font-bold font-mono text-white flex items-baseline gap-1">
                  {ventStatus.pbto2Mmhg}
                  <span className="text-xs font-normal text-slate-400">mmHg (Normal: 20-35)</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Cerebral Arteriolar Vasoconstriction Index: <span className="font-mono text-cyan-300 font-semibold">{ventStatus.cerebralVasoconstrictionIndex}</span>
                </div>
              </div>

              {/* Hypocapnia Caution Alert */}
              {paco2 < 30 && (
                <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-lg text-xs text-red-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>DANGEROUS HYPOCAPNIA:</strong> PaCO2 &lt; 30 mmHg triggers profound arteriolar vasoconstriction.
                    While ICP falls temporarily, regional cerebral blood flow collapses, driving PbtO2 below the critical ischemic threshold (15 mmHg).
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BTF Tiered Escalation & Surgery */}
      {activeTab === "protocol" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tier 0 */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">TIER 0 &bull; Baseline</span>
                <span className="text-[10px] text-slate-500">Universal Care</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                <li>Head of bed elevated 30&deg; &amp; midline neck</li>
                <li>Normothermia (36.0 - 37.5&deg;C)</li>
                <li>Normoglycemia (140 - 180 mg/dL)</li>
                <li>PaCO2 35 - 40 mmHg &amp; PaO2 &ge; 80 mmHg</li>
                <li>Analgesia/sedation for ventilator synchrony</li>
              </ul>
            </div>

            {/* Tier 1 */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400">TIER 1 &bull; ICP &gt; 22 mmHg</span>
                <span className="text-[10px] text-slate-500">First-Line</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                <li>EVD CSF drainage (intermittent or continuous)</li>
                <li>Optimize sedation (Propofol / Dexmedetomidine)</li>
                <li>Repeat non-contrast Head CT for mass lesion</li>
                <li>Neuromuscular blockade test dose</li>
              </ul>
            </div>

            {/* Tier 2 */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">TIER 2 &bull; Refractory</span>
                <span className="text-[10px] text-slate-500">Second-Line</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                <li>Hyperosmolar therapy (Mannitol or 3% Saline)</li>
                <li>Mild hypocapnia (PaCO2 30 - 35 mmHg) with PbtO2</li>
                <li>Continuous neuromuscular blockade infusion</li>
                <li>Target CPP 60 - 70 mmHg via vasopressors</li>
              </ul>
            </div>

            {/* Tier 3 */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400">TIER 3 &bull; Rescue</span>
                <span className="text-[10px] text-slate-500">Third-Line</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                <li>Decompressive Craniectomy (Hemicraniectomy)</li>
                <li>Barbiturate Coma (Pentobarbital burst suppression)</li>
                <li>Moderate hypothermia (32.0 - 34.0&deg;C) rescue</li>
              </ul>
            </div>
          </div>

          {/* Decompressive Craniectomy Surgical Action Suite */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-rose-400" />
                  Surgical Decompressive Craniectomy Decision Suite (RESCUEicp Consensus)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Large frontotemporoparietal hemicraniectomy (&ge; 12 &times; 15 cm) with duraplasty converts the closed rigid vault into an open system.
                </p>
              </div>

              <button
                onClick={() => setState(prev => ({ ...prev, decompressiveCraniectomyDone: !prev.decompressiveCraniectomyDone }))}
                className={`px-4 py-2 text-xs font-bold rounded-lg border transition shadow flex items-center gap-1.5 ${
                  state.decompressiveCraniectomyDone
                    ? "bg-rose-600 text-white border-rose-500 hover:bg-rose-500"
                    : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                {state.decompressiveCraniectomyDone ? "Craniectomy Performed (Skull Unroofed)" : "Perform Decompressive Craniectomy"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-1.5">
                <div className="font-semibold text-indigo-300">RESCUEicp Trial Evidence (2016):</div>
                <p className="text-slate-300 leading-relaxed">
                  In patients with severe TBI and refractory ICP &gt; 25 mmHg, surgical decompressive craniectomy reduced 6-month mortality from 48.9% to 26.9%.
                  However, it increased rates of vegetative state (8.5% vs 2.1%) and lower severe disability (21.9% vs 14.4%).
                </p>
              </div>

              <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-1.5">
                <div className="font-semibold text-rose-300">DECRA Trial Evidence (2011):</div>
                <p className="text-slate-300 leading-relaxed">
                  Early bifrontal craniectomy for moderate diffuse ICP elevations &gt; 20 mmHg lowered ICP and ICU stay, but was associated with worse functional outcomes at 6 months.
                  Surgical decompression must be reserved for refractory intracranial hypertension.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Clinical Knowledge & Pitfalls */}
      {activeTab === "guide" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Critical Herniation Syndromes & Hallmarks
            </h3>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/50">
                <strong className="text-rose-300">Uncal (Transtentorial) Herniation:</strong> Medial temporal lobe herniates over tentorium.
                Compresses ipsilateral CN III (ipsilateral blown pupil) and cerebral peduncle (contralateral hemiparesis, or Kernohan notch false-localizing ipsilateral hemiparesis).
              </li>
              <li className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/50">
                <strong className="text-amber-300">Cushing Triad (Terminal Herniation):</strong> Severe hypertension, progressive bradycardia, and irregular bradypnea.
                Represents direct medullary compression and distortion of brainstem vasomotor centers; indicates imminent arrest.
              </li>
              <li className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/50">
                <strong className="text-cyan-300">Subfalcine (Cingulate) Herniation:</strong> Cingulate gyrus under falx cerebri. Compresses Anterior Cerebral Artery (ACA) branches, causing contralateral leg weakness.
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Lethal Pitfalls & Practice Guidelines
            </h3>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/50">
                <strong className="text-red-300">Avoid Excessive Vasopressors (CPP &gt; 70 mmHg):</strong> If pressure autoregulation is impaired (PRx &gt; 0.25),
                driving MAP higher does not improve perfusion but causes breakthrough capillary hyperperfusion, vasogenic edema, and ARDS.
              </li>
              <li className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/50">
                <strong className="text-amber-300">Never Hyperventilate Prophylactically:</strong> PaCO2 &lt; 30 mmHg causes severe cerebral arteriolar spasm and secondary cerebral ischemia.
                Hyperventilation is solely a temporary temporizing bridge during acute herniation.
              </li>
              <li className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/50">
                <strong className="text-indigo-300">Osmolal Gap Surveillance with Mannitol:</strong> Always measure serum osmolality and calculate osmolal gap.
                When gap &gt; 20 mOsm/kg or serum osm &gt; 320 mOsm/kg, hold mannitol to prevent acute kidney injury.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
