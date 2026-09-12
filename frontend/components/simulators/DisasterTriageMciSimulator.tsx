"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldAlert,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  Heart,
  Wind,
  Flame,
  Clock,
  Award,
  RotateCcw,
  Truck,
  Building2,
  Stethoscope,
  ChevronRight,
  Filter,
  Droplet,
  Zap,
} from "lucide-react";
import {
  TriageCategory,
  InterventionType,
  MciVictim,
  MciScenario,
  HicsLogistics,
  MCI_SCENARIOS,
  INITIAL_HICS_RESOURCES,
  evaluateStartTriage,
  evaluateJumpStartTriage,
  applyLifesavingIntervention,
  computeMciPerformanceMetrics,
} from "../../.gemini/skills/DisasterTriageMciEngine";

export default function DisasterTriageMciSimulator() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const currentScenario: MciScenario = MCI_SCENARIOS[selectedScenarioIndex];

  // Working state of victims
  const [victims, setVictims] = useState<MciVictim[]>(() =>
    JSON.parse(JSON.stringify(currentScenario.victims))
  );
  const [selectedVictimId, setSelectedVictimId] = useState<string>(
    currentScenario.victims[0].id
  );
  const [hicsLogistics, setHicsLogistics] = useState<HicsLogistics>(
    JSON.parse(JSON.stringify(INITIAL_HICS_RESOURCES))
  );

  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [showDebriefModal, setShowDebriefModal] = useState<boolean>(false);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  const selectedVictim = useMemo(() => {
    return victims.find((v) => v.id === selectedVictimId) || victims[0];
  }, [victims, selectedVictimId]);

  // Census counts
  const census = useMemo(() => {
    let red = 0;
    let yellow = 0;
    let green = 0;
    let black = 0;
    let unassigned = 0;

    victims.forEach((v) => {
      if (!v.assignedTriageCategory) unassigned++;
      else if (v.assignedTriageCategory === "IMMEDIATE_RED") red++;
      else if (v.assignedTriageCategory === "DELAYED_YELLOW") yellow++;
      else if (v.assignedTriageCategory === "MINOR_GREEN") green++;
      else if (v.assignedTriageCategory === "EXPECTANT_BLACK") black++;
    });

    return { red, yellow, green, black, unassigned, total: victims.length };
  }, [victims]);

  // Overall performance metrics
  const metrics = useMemo(() => {
    return computeMciPerformanceMetrics(victims, hicsLogistics);
  }, [victims, hicsLogistics]);

  // Assign category to selected victim
  const handleAssignCategory = (category: TriageCategory) => {
    setVictims((prev) =>
      prev.map((v) =>
        v.id === selectedVictim.id ? { ...v, assignedTriageCategory: category } : v
      )
    );
    setLastActionMessage(
      `Assigned #${selectedVictim.tagNumber} (${selectedVictim.name}) to ${category.replace("_", " ")}.`
    );
  };

  // Apply lifesaving intervention
  const handleApplyIntervention = (intervention: InterventionType) => {
    const { updatedVictim, outcomeMessage } = applyLifesavingIntervention(
      selectedVictim,
      intervention
    );
    setVictims((prev) =>
      prev.map((v) => (v.id === selectedVictim.id ? updatedVictim : v))
    );
    setLastActionMessage(outcomeMessage);
  };

  // Reset current scenario
  const handleReset = () => {
    setVictims(JSON.parse(JSON.stringify(currentScenario.victims)));
    setSelectedVictimId(currentScenario.victims[0].id);
    setHicsLogistics(JSON.parse(JSON.stringify(INITIAL_HICS_RESOURCES)));
    setLastActionMessage(null);
    setShowDebriefModal(false);
  };

  // Filtered victims list
  const filteredVictims = useMemo(() => {
    if (filterCategory === "ALL") return victims;
    if (filterCategory === "UNASSIGNED")
      return victims.filter((v) => !v.assignedTriageCategory);
    return victims.filter((v) => v.assignedTriageCategory === filterCategory);
  }, [victims, filterCategory]);

  const getCategoryBadge = (cat?: TriageCategory) => {
    switch (cat) {
      case "IMMEDIATE_RED":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-600/30 text-red-300 border border-red-500/50 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            IMMEDIATE (RED)
          </span>
        );
      case "DELAYED_YELLOW":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/50 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            DELAYED (YELLOW)
          </span>
        );
      case "MINOR_GREEN":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            MINOR (GREEN)
          </span>
        );
      case "EXPECTANT_BLACK":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            EXPECTANT (BLACK)
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800/80 text-slate-400 border border-slate-700">
            UNASSIGNED
          </span>
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8 font-sans">
      {/* Top Incident Command Banner */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <ShieldAlert className="w-6 h-6" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Disaster Triage &amp; Mass Casualty Incident (MCI) Command Station
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            START &amp; JumpSTART Pediatric Algorithms &bull; Rapid Point-of-Injury Interventions &bull; HICS Surge Logistics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reset MCI
          </button>

          <button
            onClick={() => setShowDebriefModal(true)}
            className="px-3.5 py-1.5 rounded-lg border border-indigo-500/40 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Award className="w-4 h-4 text-indigo-400" />
            AAR Debrief ({metrics.accuracyScore}%)
          </button>
        </div>
      </header>

      {/* Incident Census & Hospital Surge Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="p-3 rounded-xl border border-red-500/30 bg-red-950/20 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-red-300 uppercase tracking-wider">Immediate (Red)</span>
          <div className="text-2xl font-bold text-red-400 mt-1">{census.red}</div>
          <span className="text-[10px] text-slate-400">Trauma Bay / OR Priority</span>
        </div>

        <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-950/20 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">Delayed (Yellow)</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">{census.yellow}</div>
          <span className="text-[10px] text-slate-400">Monitored / Stepdown Beds</span>
        </div>

        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">Minor (Green)</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{census.green}</div>
          <span className="text-[10px] text-slate-400">Walking Wounded / Fast Track</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Expectant (Black)</span>
          <div className="text-2xl font-bold text-slate-300 mt-1">{census.black}</div>
          <span className="text-[10px] text-slate-500">Morgue / Comfort Care</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">Untriaged Casualties</span>
          <div className="text-2xl font-bold text-sky-300 mt-1">{census.unassigned}</div>
          <span className="text-[10px] text-slate-400">{census.total} total on scene</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider">HICS Trauma Capacity</span>
          <div className="text-2xl font-bold text-violet-300 mt-1">
            {hicsLogistics.traumaBaysAvailable}/{hicsLogistics.traumaBaysTotal}
          </div>
          <span className="text-[10px] text-slate-400">{hicsLogistics.mtpBloodUnitsAvailable} MTP units ready</span>
        </div>
      </div>

      {/* Main 2-Column Interface: Casualty Manifest + Field METTAG Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (4 Cols): Casualty Manifest Roster */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold tracking-wide uppercase text-slate-200 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-sky-400" />
                Casualty Manifest
              </h2>
              <span className="text-xs text-slate-400">
                {victims.length - census.unassigned}/{victims.length} Triaged
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1 mt-3">
              {["ALL", "UNASSIGNED", "IMMEDIATE_RED", "DELAYED_YELLOW", "MINOR_GREEN", "EXPECTANT_BLACK"].map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterCategory(filter)}
                    className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                      filterCategory === filter
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {filter === "ALL"
                      ? "All"
                      : filter === "UNASSIGNED"
                      ? "Untriaged"
                      : filter.split("_")[0]}
                  </button>
                )
              )}
            </div>

            {/* Patient Cards List */}
            <div className="mt-3 space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredVictims.map((v) => {
                const isSelected = v.id === selectedVictim.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVictimId(v.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "bg-indigo-950/40 border-indigo-500 shadow-md"
                        : "bg-slate-950/50 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-slate-300">
                          #{v.tagNumber}
                        </span>
                        {v.name}
                        {v.isPediatric && (
                          <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-semibold">
                            PEDS ({v.age}y)
                          </span>
                        )}
                      </span>
                      {getCategoryBadge(v.assignedTriageCategory)}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {v.clinicalSummary}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (8 Cols): Field METTAG & Rapid Interventions Station */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Action Notification Banner */}
          {lastActionMessage && (
            <div className="p-3 rounded-lg border border-indigo-500/40 bg-indigo-950/30 text-xs text-indigo-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{lastActionMessage}</span>
            </div>
          )}

          {/* Active Patient METTAG Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">
                    Patient #{selectedVictim.tagNumber}: {selectedVictim.name}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ({selectedVictim.age}yo {selectedVictim.gender})
                  </span>
                  {selectedVictim.isPediatric ? (
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/40 text-[10px] font-bold">
                      JUMPSTART PEDIATRIC PROTOCOL
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-600/40 text-[10px] font-bold">
                      START ADULT PROTOCOL
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Mechanism: {selectedVictim.mechanism}
                </p>
              </div>

              <div>{getCategoryBadge(selectedVictim.assignedTriageCategory)}</div>
            </div>

            {/* Clinical Findings & RPM Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              {/* Ambulation */}
              <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60">
                <span className="text-[10px] uppercase font-mono text-slate-400">Step 1: Ambulation</span>
                <div className={`text-sm font-bold mt-1 ${selectedVictim.canAmbulate ? "text-emerald-400" : "text-rose-400"}`}>
                  {selectedVictim.canAmbulate ? "Walking Wounded" : "Non-Ambulatory"}
                </div>
              </div>

              {/* Respirations */}
              <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60">
                <span className="text-[10px] uppercase font-mono text-slate-400">Step 2: Respirations</span>
                <div className={`text-sm font-bold mt-1 ${!selectedVictim.isBreathing ? "text-rose-500" : selectedVictim.respiratoryRate > 30 ? "text-red-400" : "text-emerald-400"}`}>
                  {selectedVictim.isBreathing ? `${selectedVictim.respiratoryRate} /min` : "APNEIC"}
                </div>
              </div>

              {/* Perfusion */}
              <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60">
                <span className="text-[10px] uppercase font-mono text-slate-400">Step 3: Perfusion</span>
                <div className={`text-sm font-bold mt-1 ${selectedVictim.hasRadialPulse ? "text-emerald-400" : "text-rose-400"}`}>
                  {selectedVictim.hasRadialPulse ? `Radial Pulse (${selectedVictim.capillaryRefillSec}s CRT)` : "PULSELESS"}
                </div>
              </div>

              {/* Mental Status */}
              <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60">
                <span className="text-[10px] uppercase font-mono text-slate-400">Step 4: Mental Status</span>
                <div className={`text-sm font-bold mt-1 ${selectedVictim.mentalStatus === "ALERT_ORIENTED" ? "text-emerald-400" : "text-red-400"}`}>
                  {selectedVictim.mentalStatus.replace("_", " ")} ({selectedVictim.avpu})
                </div>
              </div>
            </div>

            {/* Trauma Details & Physical Findings */}
            <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/80 mb-4">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Bedside Assessment &amp; Injury Inspection:
              </span>
              <p className="text-xs text-slate-200 mt-1">{selectedVictim.clinicalSummary}</p>

              {/* Critical Threat Warnings */}
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedVictim.bleedingType === "ARTERIAL_EXSANGUINATING" && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-500 animate-pulse flex items-center gap-1">
                    <Droplet className="w-3 h-3 text-red-400" />
                    LIFE-THREATENING ARTERIAL BLEEDING
                  </span>
                )}
                {selectedVictim.tensionPneumothoraxPresent && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-500 animate-pulse flex items-center gap-1">
                    <Wind className="w-3 h-3 text-rose-400" />
                    TENSION PNEUMOTHORAX (OBSTRUCTIVE SHOCK)
                  </span>
                )}
                {selectedVictim.appliedInterventions.length > 0 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                    Interventions applied: {selectedVictim.appliedInterventions.join(", ")}
                  </span>
                )}
              </div>
            </div>

            {/* Rapid Point-of-Injury Lifesaving Interventions Deck */}
            <div className="border-t border-slate-800 pt-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Immediate Lifesaving Interventions:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleApplyIntervention("TOURNIQUET")}
                  className="p-2 rounded-lg bg-red-900/20 hover:bg-red-900/30 border border-red-700/40 text-red-300 text-xs font-medium transition flex items-center justify-center gap-1.5"
                >
                  <Droplet className="w-3.5 h-3.5" />
                  CAT Tourniquet
                </button>

                <button
                  onClick={() => handleApplyIntervention("NEEDLE_DECOMPRESSION")}
                  className="p-2 rounded-lg bg-cyan-900/20 hover:bg-cyan-900/30 border border-cyan-700/40 text-cyan-300 text-xs font-medium transition flex items-center justify-center gap-1.5"
                >
                  <Wind className="w-3.5 h-3.5" />
                  14G Needle Thoracostomy
                </button>

                <button
                  onClick={() => handleApplyIntervention("AIRWAY_REPOSITION")}
                  className="p-2 rounded-lg bg-indigo-900/20 hover:bg-indigo-900/30 border border-indigo-700/40 text-indigo-300 text-xs font-medium transition flex items-center justify-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5" />
                  Jaw Thrust / Reposition Airway
                </button>

                {selectedVictim.isPediatric && (
                  <button
                    onClick={() => handleApplyIntervention("PEDIATRIC_RESCUE_BREATHS")}
                    className="p-2 rounded-lg bg-amber-900/20 hover:bg-amber-900/30 border border-amber-700/40 text-amber-300 text-xs font-medium transition flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    5 Rescue Breaths (JumpSTART)
                  </button>
                )}

                <button
                  onClick={() => handleApplyIntervention("DUODOTE_AUTOINJECTOR")}
                  className="p-2 rounded-lg bg-purple-900/20 hover:bg-purple-900/30 border border-purple-700/40 text-purple-300 text-xs font-medium transition flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  DuoDote / Mark I Auto-Injector
                </button>

                <button
                  onClick={() => handleApplyIntervention("PRESSURE_DRESSING")}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition flex items-center justify-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Hemostatic Pressure Dressing
                </button>
              </div>
            </div>

            {/* Official Disaster Triage Tag Dispatch Buttons */}
            <div className="border-t border-slate-800 mt-4 pt-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Assign METTAG Disaster Triage Category:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => handleAssignCategory("IMMEDIATE_RED")}
                  className="py-3 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex flex-col items-center gap-1"
                >
                  <span>🔴 IMMEDIATE</span>
                  <span className="text-[10px] font-normal opacity-80">Priority 1 (Red)</span>
                </button>

                <button
                  onClick={() => handleAssignCategory("DELAYED_YELLOW")}
                  className="py-3 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex flex-col items-center gap-1"
                >
                  <span>🟡 DELAYED</span>
                  <span className="text-[10px] font-normal opacity-80">Priority 2 (Yellow)</span>
                </button>

                <button
                  onClick={() => handleAssignCategory("MINOR_GREEN")}
                  className="py-3 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex flex-col items-center gap-1"
                >
                  <span>🟢 MINOR</span>
                  <span className="text-[10px] font-normal opacity-80">Priority 3 (Green)</span>
                </button>

                <button
                  onClick={() => handleAssignCategory("EXPECTANT_BLACK")}
                  className="py-3 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider border border-slate-700 transition shadow-md flex flex-col items-center gap-1"
                >
                  <span>⚫ EXPECTANT</span>
                  <span className="text-[10px] font-normal opacity-80">Priority 0 (Black)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* After-Action Report (AAR) & Debrief Modal */}
      {showDebriefModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">
                  MCI Incident Command After-Action Report (AAR)
                </h3>
              </div>
              <button
                onClick={() => setShowDebriefModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Performance Summary Scores */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase">Triage Accuracy</span>
                <div className="text-2xl font-bold text-white mt-1">{metrics.accuracyScore}%</div>
                <span className="text-[10px] text-slate-500">
                  {metrics.correctCount}/{census.total} correct
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase">Under-Triage</span>
                <div className={`text-2xl font-bold mt-1 ${metrics.underTriageCount > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                  {metrics.underTriageCount}
                </div>
                <span className="text-[10px] text-slate-500">Target: &lt; 5%</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase">Over-Triage</span>
                <div className="text-2xl font-bold text-amber-400 mt-1">{metrics.overTriageCount}</div>
                <span className="text-[10px] text-slate-500">Target: &lt; 30%</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase">Preventable Mortality</span>
                <div className={`text-2xl font-bold mt-1 ${metrics.preventableDeaths > 0 ? "text-red-500" : "text-emerald-400"}`}>
                  {metrics.preventableDeaths}
                </div>
                <span className="text-[10px] text-slate-500">Target: 0 deaths</span>
              </div>
            </div>

            {/* Itemized Casualty Breakdown Table */}
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Itemized Casualty Triage Audit:
              </h4>
              <div className="max-h-60 overflow-y-auto border border-slate-800 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2">Tag</th>
                      <th className="p-2">Victim Name</th>
                      <th className="p-2">Your Tag</th>
                      <th className="p-2">Correct Tag</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {victims.map((v) => {
                      const isCorrect = v.assignedTriageCategory === v.correctTriageCategory;
                      return (
                        <tr key={v.id} className="hover:bg-slate-800/30">
                          <td className="p-2 font-bold">#{v.tagNumber}</td>
                          <td className="p-2 text-slate-200">{v.name}</td>
                          <td className="p-2 font-semibold">
                            {v.assignedTriageCategory
                              ? v.assignedTriageCategory.replace("_", " ")
                              : "NOT TAGGED"}
                          </td>
                          <td className="p-2 text-slate-300 font-semibold">
                            {v.correctTriageCategory.replace("_", " ")}
                          </td>
                          <td className="p-2">
                            {isCorrect ? (
                              <span className="text-emerald-400 font-bold">CORRECT ✓</span>
                            ) : (
                              <span className="text-rose-400 font-bold">MISMATCH ✗</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Debrief Feedback Commentary */}
            {metrics.feedback.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Clinical Triage Feedback:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {metrics.feedback.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowDebriefModal(false)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}