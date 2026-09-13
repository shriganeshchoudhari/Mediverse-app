'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Activity,
  AlertTriangle,
  Users,
  ShieldCheck,
  BedDouble,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Sliders,
  Layers,
  HelpCircle,
  FileText
} from 'lucide-react';
import {
  CommandCenterState,
  UnitType,
  Bed,
  Patient,
  createInitialCommandCenterState,
  applySurgeAction,
  advanceSimulationStep,
  HOSPITAL_SCENARIOS
} from '../../.gemini/skills/HospitalCommandCenterEngine';

export default function HospitalCommandCenterSimulator() {
  const [state, setState] = useState<CommandCenterState>(createInitialCommandCenterState);
  const [activeTab, setActiveTab] = useState<'beds' | 'flow' | 'staffing' | 'hac' | 'surge'>('beds');
  const [selectedUnit, setSelectedUnit] = useState<UnitType | 'ALL'>('ALL');
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('');

  // Auto-play timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setState(prev => advanceSimulationStep(prev, 15));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleStep = () => {
    setState(prev => advanceSimulationStep(prev, 15));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSelectedScenarioId('');
    setState(createInitialCommandCenterState());
    setSelectedBed(null);
  };

  const handleScenarioChange = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    const scenario = HOSPITAL_SCENARIOS.find(s => s.id === scenarioId);
    if (scenario) {
      setIsPlaying(false);
      setState(scenario.preset());
      setSelectedBed(null);
    }
  };

  const selectedPatient = useMemo(() => {
    if (!selectedBed || !selectedBed.patientId) return null;
    return state.patients.find(p => p.id === selectedBed.patientId) || null;
  }, [selectedBed, state.patients]);

  const filteredBeds = useMemo(() => {
    if (selectedUnit === 'ALL') return state.beds;
    return state.beds.filter(b => b.unit === selectedUnit);
  }, [state.beds, selectedUnit]);

  // Surge level color config
  const surgeColors = {
    GREEN: 'bg-emerald-950/70 border-emerald-500/50 text-emerald-400',
    AMBER: 'bg-amber-950/70 border-amber-500/50 text-amber-400',
    ORANGE: 'bg-orange-950/70 border-orange-500/50 text-orange-400',
    RED: 'bg-rose-950/70 border-rose-500/50 text-rose-400'
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Command Center Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-xl">
              <Building2 className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-white tracking-wide">
                  {state.hospitalName}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${surgeColors[state.surgeLevel]}`}>
                  SURGE LEVEL {state.surgeLevel}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300 font-mono">
                  Day {Math.floor(state.timestampMinutes / 1440) + 1} &bull; {String(Math.floor((state.timestampMinutes % 1440) / 60)).padStart(2, '0')}:{String((state.timestampMinutes % 60)).padStart(2, '0')}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Hospital Command Center Omnisuite &bull; Inpatient Bed Management, Patient Flow, Staffing Safety & Quality Surveillance
              </p>
            </div>
          </div>

          {/* KPI Mini-Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Total Occupancy</span>
              <span className={`text-lg font-bold ${state.totalOccupancyPercent >= 90 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {state.totalOccupancyPercent}%
              </span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block">ED Boarding</span>
              <span className={`text-lg font-bold ${state.edBoardingPatients >= 8 ? 'text-amber-400' : 'text-indigo-300'}`}>
                {state.edBoardingPatients} pts
              </span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block">ED Wait Time</span>
              <span className="text-lg font-bold text-slate-200">
                {state.edWaitTimeMinutes}m
              </span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Bundle Adherence</span>
              <span className="text-lg font-bold text-cyan-400">
                {state.hac.bundleAdherencePercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Operational Controls & Scenario Selector */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause Sim' : 'Live Auto-Sim'}
            </button>
            <button
              onClick={handleStep}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            >
              <FastForward className="w-3.5 h-3.5" />
              +15m Step
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Master Scenario Presets */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-slate-400 font-medium">Scenario:</span>
            <select
              value={selectedScenarioId}
              onChange={(e) => handleScenarioChange(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Default Hospital Operations</option>
              {HOSPITAL_SCENARIOS.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('beds')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'beds'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <BedDouble className="w-4 h-4" />
          Hospital Ward Map & Bed Matrix
        </button>
        <button
          onClick={() => setActiveTab('flow')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'flow'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Patient Flow & Throughput Dynamics
        </button>
        <button
          onClick={() => setActiveTab('staffing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'staffing'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Staffing & Acuity Ratios
        </button>
        <button
          onClick={() => setActiveTab('hac')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'hac'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          HAC & Safety Surveillance
        </button>
        <button
          onClick={() => setActiveTab('surge')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'surge'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Surge Operations Console
        </button>
      </div>

      {/* Tab 1: Bed Matrix & Floorplan */}
      {activeTab === 'beds' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Unit Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-medium mr-2">Filter Unit:</span>
              {(['ALL', 'ED', 'ICU', 'STEPDOWN', 'SURGICAL', 'MEDICAL'] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setSelectedUnit(u)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    selectedUnit === u
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {u === 'ALL' ? 'All Units' : u}
                </button>
              ))}
            </div>

            {/* Bed Matrix Grid */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-200">
                  Bed Grid ({filteredBeds.length} Beds)
                </h3>
                {/* Legend */}
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Available
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Occupied
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Cleaning
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Dirty
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {filteredBeds.map(bed => {
                  const patient = state.patients.find(p => p.id === bed.patientId);
                  const isSelected = selectedBed?.id === bed.id;
                  const statusColors = {
                    AVAILABLE: 'border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400 text-emerald-300',
                    OCCUPIED: 'border-indigo-500/40 bg-indigo-950/20 hover:border-indigo-400 text-indigo-300',
                    CLEANING: 'border-amber-500/40 bg-amber-950/20 hover:border-amber-400 text-amber-300',
                    DIRTY: 'border-rose-500/40 bg-rose-950/20 hover:border-rose-400 text-rose-300'
                  };

                  return (
                    <button
                      key={bed.id}
                      onClick={() => setSelectedBed(bed)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition h-20 ${statusColors[bed.status]} ${
                        isSelected ? 'ring-2 ring-indigo-400 scale-[1.02]' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold font-mono">{bed.bedNumber}</span>
                        <span className="text-[10px] font-medium uppercase tracking-wider opacity-75">{bed.unit}</span>
                      </div>
                      <div className="truncate text-[11px] font-medium text-slate-300">
                        {patient ? patient.diagnosis : bed.status}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bed & Patient Detail Inspector Drawer */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Bed & Patient Inspector
            </h3>

            {selectedBed ? (
              <div className="space-y-4">
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white">{selectedBed.bedNumber}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                      {selectedBed.unit}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
                    <span>Status:</span>
                    <span className="font-semibold text-slate-200">{selectedBed.status}</span>
                  </div>
                  {selectedBed.cleaningMinutesRemaining !== undefined && (
                    <div className="text-xs text-amber-400 flex items-center justify-between">
                      <span>Cleaning Remaining:</span>
                      <span>{selectedBed.cleaningMinutesRemaining} mins</span>
                    </div>
                  )}
                </div>

                {selectedPatient ? (
                  <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Patient ID:</span>
                      <span className="text-xs font-mono font-bold text-slate-200">{selectedPatient.id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Demographics:</span>
                      <span className="text-xs text-slate-200">{selectedPatient.age}y / {selectedPatient.gender}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Acuity Level:</span>
                      <span className="text-xs font-bold text-rose-400">Acuity {selectedPatient.acuityLevel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Primary Diagnosis:</span>
                      <span className="text-xs font-semibold text-indigo-300 text-right max-w-[180px] truncate">
                        {selectedPatient.diagnosis}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">LOS in Unit:</span>
                      <span className="text-xs text-slate-200">{selectedPatient.hoursInUnit}h / Exp: {selectedPatient.expectedLOSHours}h</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Ventilator:</span>
                        <span className={selectedPatient.ventilated ? 'text-amber-400 font-semibold' : 'text-slate-500'}>
                          {selectedPatient.ventilated ? `Yes (${selectedPatient.ventilatorDays}d)` : 'None'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Foley Catheter:</span>
                        <span className={selectedPatient.foleyCatheter ? 'text-amber-400 font-semibold' : 'text-slate-500'}>
                          {selectedPatient.foleyCatheter ? `Yes (${selectedPatient.catheterDays}d)` : 'None'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Central Line:</span>
                        <span className={selectedPatient.centralLine ? 'text-amber-400 font-semibold' : 'text-slate-500'}>
                          {selectedPatient.centralLine ? `Yes (${selectedPatient.centralLineDays}d)` : 'None'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Braden Pressure Score:</span>
                        <span className={selectedPatient.bradenScore <= 12 ? 'text-rose-400 font-semibold' : 'text-emerald-400'}>
                          {selectedPatient.bradenScore} (Risk: {selectedPatient.bradenScore <= 12 ? 'High' : 'Low'})
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-950/40 rounded-xl border border-slate-800/60 text-center text-xs text-slate-500">
                    No patient currently placed in this bed.
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 bg-slate-950/40 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                Select any bed in the grid to inspect unit telemetry, clinical acuity, device days, and discharge barriers.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Flow & Throughput */}
      {activeTab === 'flow' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Emergency Department Boarding Queue
            </h3>
            <p className="text-xs text-slate-400">
              Patients admitted through the ED who have been waiting for inpatient bed placement &gt; 4 hours.
            </p>
            <div className="space-y-2">
              {Array.from({ length: state.edBoardingPatients }).map((_, idx) => (
                <div key={idx} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-200">ED Boarding #{idx + 1}</span>
                    <span className="text-slate-400 block">Requested Target: {idx % 2 === 0 ? 'Medical Floor' : 'ICU Step-Down'}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-semibold text-rose-400">{4 + idx * 2}h {15 * (idx + 1)}m</span>
                    <span className="text-[10px] text-slate-500 block">Boarding Time</span>
                  </div>
                </div>
              ))}
              {state.edBoardingPatients === 0 && (
                <div className="p-6 text-center text-xs text-emerald-400 font-medium">
                  Zero ED boarding patients. Fluid hospital throughput!
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Live Operational Activity Feed
            </h3>
            <div className="space-y-2">
              {state.activeIncidents.map((inc, i) => (
                <div key={i} className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs flex items-center gap-2 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Staffing Ratios */}
      {activeTab === 'staffing' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            Unit Staffing Levels & Nurse-to-Patient Ratios
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">Unit</th>
                  <th className="pb-3 font-semibold">Occupied Beds</th>
                  <th className="pb-3 font-semibold">Nurses on Duty</th>
                  <th className="pb-3 font-semibold">Current Ratio</th>
                  <th className="pb-3 font-semibold">Target Ratio</th>
                  <th className="pb-3 font-semibold">Staffing Safety</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {Object.values(state.units).map(u => (
                  <tr key={u.unit} className="hover:bg-slate-850/50">
                    <td className="py-3 font-medium text-slate-100">{u.name}</td>
                    <td className="py-3">{u.occupiedBeds} / {u.totalBeds}</td>
                    <td className="py-3">{u.assignedNurses} RNs</td>
                    <td className="py-3 font-mono">1:{(1 / Math.max(0.01, u.nursePatientRatio)).toFixed(1)}</td>
                    <td className="py-3 font-mono">1:{(1 / u.targetRatio).toFixed(1)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        u.staffingStatus === 'OPTIMAL'
                          ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-400'
                          : u.staffingStatus === 'ACCEPTABLE'
                          ? 'bg-amber-950 border border-amber-500/40 text-amber-400'
                          : 'bg-rose-950 border border-rose-500/40 text-rose-400'
                      }`}>
                        {u.staffingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: HAC & Safety */}
      {activeTab === 'hac' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">CAUTI Surveillance</h3>
            <div className="text-2xl font-bold text-amber-400">
              {state.hac.cautiRatePer1000Days}
              <span className="text-xs font-normal text-slate-400 ml-1">/ 1,000 days</span>
            </div>
            <p className="text-xs text-slate-400">Catheter-Associated Urinary Tract Infections. CDC benchmark &lt; 1.5.</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">CLABSI Surveillance</h3>
            <div className="text-2xl font-bold text-indigo-400">
              {state.hac.clabsiRatePer1000Days}
              <span className="text-xs font-normal text-slate-400 ml-1">/ 1,000 days</span>
            </div>
            <p className="text-xs text-slate-400">Central Line-Associated Bloodstream Infections. Target &lt; 1.0.</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">VAP Rate</h3>
            <div className="text-2xl font-bold text-rose-400">
              {state.hac.vapRatePer1000Days}
              <span className="text-xs font-normal text-slate-400 ml-1">/ 1,000 days</span>
            </div>
            <p className="text-xs text-slate-400">Ventilator-Associated Pneumonia surveillance per 1,000 ventilator days.</p>
          </div>
        </div>
      )}

      {/* Tab 5: Surge Mitigation Action Console */}
      {activeTab === 'surge' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Surge Capacity Mitigation Console</h3>
            <p className="text-xs text-slate-400 mt-1">
              Active interventions immediately adjust bed capacity, staffing float pools, and emergency transport routing.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                id: 'activateOverflowBeds',
                title: 'Activate Inpatient Surge Overflow Beds (+8 Beds)',
                desc: 'Opens 5 Medical and 3 Surgical surge beds in designated overflow wings.'
              },
              {
                id: 'mobilizeContingencyNurses',
                title: 'Mobilize Contingency / Agency Nursing Pool (+6 FTEs)',
                desc: 'Deploys on-call float nurses to alleviate critical staffing ratios across ED, ICU, and floors.'
              },
              {
                id: 'expediteDischargeLounge',
                title: 'Expedite Discharge Lounge & Rapid Transit',
                desc: 'Incentivizes early discharge before 11:00 AM, freeing inpatient beds for boarded ED patients.'
              },
              {
                id: 'ambulanceDivertED',
                title: 'Emergency Department Ambulance Diversion',
                desc: 'Requests regional dispatch to divert non-trauma inbound ambulances to neighboring facilities.'
              }
            ].map(act => {
              const key = act.id as keyof typeof state.actions;
              const isEnabled = state.actions[key];
              return (
                <div key={act.id} className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-200 block">{act.title}</span>
                    <span className="text-xs text-slate-400 block">{act.desc}</span>
                  </div>
                  <button
                    onClick={() => setState(prev => applySurgeAction(prev, key, !isEnabled))}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                      isEnabled
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {isEnabled ? 'Active' : 'Inactive'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
