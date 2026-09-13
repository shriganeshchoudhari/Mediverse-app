'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Activity,
  Heart,
  Wind,
  Layers,
  Sparkles,
  ArrowUpRight,
  RotateCcw,
  CheckCircle2,
  Syringe,
  Bed,
  Mic,
  Eye,
  Info,
  ChevronRight,
} from 'lucide-react';
import {
  simulateHighSpinalHemodynamics,
  HighSpinalParams,
  SpinalBlockLevel,
  BromageScore,
  PressorChoice,
  VagolyticAgent,
  PatientPositioning,
  AirwayIntervention,
} from '../../.gemini/skills/HighSpinalEngine';

export default function HighSpinalSimulator() {
  // Simulator State
  const [blockLevel, setBlockLevel] = useState<SpinalBlockLevel>('T4_NIPPLE_CARDIAC_SYMPATHECTOMY');
  const [bromageScore, setBromageScore] = useState<BromageScore>(3);
  const [minutesSinceInjection, setMinutesSinceInjection] = useState<number>(12);
  const [localAnestheticType, setLocalAnestheticType] = useState<
    'HYPERBARIC_BUPIVACAINE' | 'ISOBARIC_BUPIVACAINE' | 'ROPIVACAINE'
  >('HYPERBARIC_BUPIVACAINE');
  const [ivFluidInfusedMl, setIvFluidInfusedMl] = useState<number>(300);
  const [pressorAdministered, setPressorAdministered] = useState<PressorChoice>('NONE');
  const [vagolyticAdministered, setVagolyticAdministered] = useState<VagolyticAgent>('NONE');
  const [positioning, setPositioning] = useState<PatientPositioning>('SUPINE_FLAT');
  const [airwayManagement, setAirwayManagement] = useState<AirwayIntervention>('NONE_ROOM_AIR');
  const [activeTab, setActiveTab] = useState<'cockpit' | 'anatomy' | 'pressor' | 'protocol'>('cockpit');

  // Compute Simulation Result
  const params: HighSpinalParams = useMemo(
    () => ({
      blockLevel,
      bromageScore,
      minutesSinceInjection,
      localAnestheticType,
      ivFluidInfusedMl,
      pressorAdministered,
      vagolyticAdministered,
      positioning,
      airwayManagement,
      weightKg: 70,
      baselineHeartRate: 75,
      baselineMap: 90,
    }),
    [
      blockLevel,
      bromageScore,
      minutesSinceInjection,
      localAnestheticType,
      ivFluidInfusedMl,
      pressorAdministered,
      vagolyticAdministered,
      positioning,
      airwayManagement,
    ]
  );

  const result = useMemo(() => simulateHighSpinalHemodynamics(params), [params]);

  // Preset Handlers
  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'normal_t10':
        setBlockLevel('T10_UMBILICUS');
        setBromageScore(3);
        setMinutesSinceInjection(15);
        setLocalAnestheticType('HYPERBARIC_BUPIVACAINE');
        setIvFluidInfusedMl(1000);
        setPressorAdministered('NONE');
        setVagolyticAdministered('NONE');
        setPositioning('HEAD_NEUTRAL_LEGS_ELEVATED');
        setAirwayManagement('NONE_ROOM_AIR');
        break;
      case 't4_whisper':
        setBlockLevel('T4_NIPPLE_CARDIAC_SYMPATHECTOMY');
        setBromageScore(3);
        setMinutesSinceInjection(10);
        setLocalAnestheticType('HYPERBARIC_BUPIVACAINE');
        setIvFluidInfusedMl(300);
        setPressorAdministered('NONE');
        setVagolyticAdministered('NONE');
        setPositioning('SUPINE_FLAT');
        setAirwayManagement('HIGH_FLOW_OXYGEN_MASK');
        break;
      case 'bjr_crash':
        setBlockLevel('T4_NIPPLE_CARDIAC_SYMPATHECTOMY');
        setBromageScore(3);
        setMinutesSinceInjection(12);
        setLocalAnestheticType('HYPERBARIC_BUPIVACAINE');
        setIvFluidInfusedMl(100);
        setPressorAdministered('NONE');
        setVagolyticAdministered('NONE');
        setPositioning('REVERSE_TRENDELENBURG');
        setAirwayManagement('HIGH_FLOW_OXYGEN_MASK');
        break;
      case 'phenylephrine_trap':
        setBlockLevel('T4_NIPPLE_CARDIAC_SYMPATHECTOMY');
        setBromageScore(3);
        setMinutesSinceInjection(10);
        setLocalAnestheticType('HYPERBARIC_BUPIVACAINE');
        setIvFluidInfusedMl(200);
        setPressorAdministered('PHENYLEPHRINE_BOLUS');
        setVagolyticAdministered('NONE');
        setPositioning('SUPINE_FLAT');
        setAirwayManagement('NONE_ROOM_AIR');
        break;
      case 'total_spinal_rescue':
        setBlockLevel('TOTAL_SPINAL_BRAINSTEM_APNEA');
        setBromageScore(3);
        setMinutesSinceInjection(20);
        setLocalAnestheticType('HYPERBARIC_BUPIVACAINE');
        setIvFluidInfusedMl(1500);
        setPressorAdministered('EPINEPHRINE_LOW_DOSE');
        setVagolyticAdministered('ATROPINE_0_5_1MG');
        setPositioning('HEAD_NEUTRAL_LEGS_ELEVATED');
        setAirwayManagement('ENDOTRACHEAL_INTUBATION_VENTILATED');
        break;
    }
  };

  const getDermatomeLabel = (lvl: SpinalBlockLevel) => {
    switch (lvl) {
      case 'L5_S1':
        return 'L5-S1 (Saddle Block / Foot)';
      case 'T10_UMBILICUS':
        return 'T10 (Umbilicus - Standard Lower Abdomen)';
      case 'T6_XIPHOID':
        return 'T6 (Xiphoid - Upper Abdomen / Splanchnic)';
      case 'T4_NIPPLE_CARDIAC_SYMPATHECTOMY':
        return 'T4 (Nipple Line - T1-T4 Cardioaccelerators Blocked)';
      case 'C7_CERVICAL_HAND_WEAKNESS':
        return 'C7 (Cervical Cord - Hand Weakness / Intercostals Out)';
      case 'C3_PHRENIC_DIAPHRAGM_ARREST':
        return 'C3 (High Cervical - Phrenic Diaphragmatic Arrest)';
      case 'TOTAL_SPINAL_BRAINSTEM_APNEA':
        return 'Total Spinal (Brainstem Cisterns / Apnea / Coma)';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100 p-2 sm:p-4">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 shadow-inner">
                <Layers className="w-6 h-6 animate-pulse" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                High Spinal & Total Spinal Workstation
              </h1>
            </div>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl">
              Precision biophysical simulator for cephalad local anesthetic spread, sympathetic cardioaccelerator denervation (T1–T4), the Bezold-Jarisch reflex asystolic collapse, the Phenylephrine pressor trap, and emergent airway intubation.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyPreset('normal_t10')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              Normal T10
            </button>
            <button
              onClick={() => applyPreset('t4_whisper')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-600/40 transition"
            >
              T4 Early Whisper
            </button>
            <button
              onClick={() => applyPreset('bjr_crash')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-600/40 transition"
            >
              BJR Asystolic Shock
            </button>
            <button
              onClick={() => applyPreset('phenylephrine_trap')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-600/40 transition"
            >
              Phenylephrine Trap
            </button>
            <button
              onClick={() => applyPreset('total_spinal_rescue')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-600/40 transition"
            >
              Total Spinal Rescue
            </button>
          </div>
        </div>
      </div>

      {/* Hero 4-Panel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Panel 1: Dermatomal Block Height */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" /> Sensory Level
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                result.trendelenburgCephaladSpreadHazard
                  ? 'bg-red-950 text-red-400 border border-red-600'
                  : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              }`}
            >
              {blockLevel.split('_')[0]}
            </span>
          </div>

          <div className="my-3 space-y-2">
            <div className="text-lg font-bold text-white tracking-wide">
              {getDermatomeLabel(blockLevel)}
            </div>
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Motor Bromage:</span>
              <span className="font-semibold text-slate-200">Scale {bromageScore}/3 (Paralysis)</span>
            </div>
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Sympathetic Block:</span>
              <span className="font-semibold text-amber-300">2-4 Levels Higher</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            Local Anesthetic: <span className="text-slate-200 font-medium">{localAnestheticType.replace('_', ' ')}</span> ({minutesSinceInjection}m post-inj)
          </div>
        </div>

        {/* Panel 2: Hemodynamics & BJR Radar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400" /> Vitals & BJR Radar
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-bold ${
                result.bezoldJarischRisk === 'CRITICAL_ASYSTOLIC_ARREST'
                  ? 'bg-red-950 text-red-300 border border-red-500 animate-pulse'
                  : result.bezoldJarischRisk === 'MODERATE'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500'
              }`}
            >
              BJR: {result.bezoldJarischRisk.replaceAll('_', ' ')}
            </span>
          </div>

          <div className="my-3 grid grid-cols-2 gap-2 text-center">
            <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800/60">
              <div className="text-xs text-slate-400">BP / MAP</div>
              <div className="text-base font-bold text-white font-mono">
                {result.systolicBp}/{result.diastolicBp} <span className="text-xs text-slate-400">({result.meanArterialPressure})</span>
              </div>
            </div>
            <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800/60">
              <div className="text-xs text-slate-400">Heart Rate</div>
              <div
                className={`text-base font-bold font-mono ${
                  result.heartRate < 50 ? 'text-red-400 animate-pulse' : 'text-emerald-400'
                }`}
              >
                {result.heartRate} <span className="text-xs text-slate-400">bpm</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 text-[11px] text-slate-400">
            <div>CVP: <span className="text-slate-200 font-mono">{result.centralVenousPressureMmHg} mmHg</span></div>
            <div>CO: <span className="text-slate-200 font-mono">{result.cardiacOutputLpm} L/min</span></div>
          </div>
        </div>

        {/* Panel 3: Respiratory & Vocalization */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-sky-400" /> Airway & Speech
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-bold ${
                result.vocalizationStatus === 'APHONIC_SILENT'
                  ? 'bg-red-950 text-red-300 border border-red-500'
                  : result.vocalizationStatus === 'DIFFICULT_WHISPER'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500'
              }`}
            >
              {result.vocalizationStatus.replace('_', ' ')}
            </span>
          </div>

          <div className="my-3 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Phrenic Diaphragm:</span>
              <span
                className={`font-mono font-bold ${
                  result.phrenicNerveDiaphragmExcursionPercent < 30
                    ? 'text-red-400'
                    : result.phrenicNerveDiaphragmExcursionPercent < 80
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {result.phrenicNerveDiaphragmExcursionPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  result.phrenicNerveDiaphragmExcursionPercent < 30
                    ? 'bg-red-500'
                    : result.phrenicNerveDiaphragmExcursionPercent < 80
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${result.phrenicNerveDiaphragmExcursionPercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-slate-400">SpO₂:</span>
              <span
                className={`font-mono font-bold ${
                  result.spO2Percent < 90 ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {result.spO2Percent}%
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
            <span>Airway Support:</span>
            <span className="text-slate-200 font-medium">
              {airwayManagement === 'NONE_ROOM_AIR'
                ? 'Room Air'
                : airwayManagement === 'HIGH_FLOW_OXYGEN_MASK'
                ? 'O2 Mask'
                : airwayManagement === 'BAG_VALVE_MASK_ASSISTED'
                ? 'BVM Assisted'
                : 'ETT Ventilated'}
            </span>
          </div>
        </div>

        {/* Panel 4: Safety Score & Neuro Status */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-purple-400" /> Neuro & Safety
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded font-mono font-bold ${
                result.safetyScore >= 80
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                  : result.safetyScore >= 50
                  ? 'bg-amber-950 text-amber-300 border border-amber-500'
                  : 'bg-red-950 text-red-300 border border-red-500 animate-pulse'
              }`}
            >
              Safety: {result.safetyScore}/100
            </span>
          </div>

          <div className="my-3 space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Consciousness:</span>
              <span className="font-semibold text-slate-200">
                {result.consciousnessLevel.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Pupillary State:</span>
              <span className="font-semibold text-purple-300">
                {result.pupilState.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Positioning:</span>
              <span className="font-medium text-slate-300">
                {positioning === 'HEAD_NEUTRAL_LEGS_ELEVATED' ? 'Neutral + Legs Up' : positioning.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Critical Flags:</span>
            <span className="text-amber-400 font-bold">{result.warnings.length} Active</span>
          </div>
        </div>
      </div>

      {/* Warnings Banner */}
      {result.warnings.length > 0 && (
        <div className="space-y-2">
          {result.warnings.map((warn, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-start gap-3 backdrop-blur-sm"
            >
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>{warn}</div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2 sm:gap-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('cockpit')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 ${
            activeTab === 'cockpit'
              ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Activity className="w-4 h-4" /> Resuscitation Deck
        </button>
        <button
          onClick={() => setActiveTab('anatomy')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 ${
            activeTab === 'anatomy'
              ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-4 h-4" /> Neuraxial Dermatome Mapping
        </button>
        <button
          onClick={() => setActiveTab('pressor')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 ${
            activeTab === 'pressor'
              ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Syringe className="w-4 h-4" /> The Pressor Paradox & BJR
        </button>
        <button
          onClick={() => setActiveTab('protocol')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 ${
            activeTab === 'protocol'
              ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> ASRA / SOAP Emergency Protocol
        </button>
      </div>

      {/* Sub-Tab 1: Interactive Resuscitation Deck */}
      {activeTab === 'cockpit' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column 1: Block Parameters */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" /> Neuraxial Parameters
            </h2>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Dermatomal Sensory Block Level</label>
              <select
                value={blockLevel}
                onChange={(e) => setBlockLevel(e.target.value as SpinalBlockLevel)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:ring-1 focus:ring-cyan-500"
              >
                <option value="L5_S1">L5-S1 (Low Lumbar Saddle Block)</option>
                <option value="T10_UMBILICUS">T10 (Umbilicus - Lower Abdomen/Hip)</option>
                <option value="T6_XIPHOID">T6 (Xiphoid - Upper Abdomen/Splanchnic)</option>
                <option value="T4_NIPPLE_CARDIAC_SYMPATHECTOMY">T4 (Nipple Line - T1-T4 Cardioaccelerators Blocked)</option>
                <option value="C7_CERVICAL_HAND_WEAKNESS">C7 (Cervical Cord - Hand Weakness / Intercostals Paralyzed)</option>
                <option value="C3_PHRENIC_DIAPHRAGM_ARREST">C3 (High Cervical - Phrenic Diaphragm Arrest C3-C5)</option>
                <option value="TOTAL_SPINAL_BRAINSTEM_APNEA">Total Spinal (Brainstem Spread / Fixed Dilated Pupils)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Elapsed Time Post-Injection: <span className="text-cyan-400 font-mono">{minutesSinceInjection} mins</span>
              </label>
              <input
                type="range"
                min="2"
                max="60"
                step="1"
                value={minutesSinceInjection}
                onChange={(e) => setMinutesSinceInjection(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Local Anesthetic Baricity</label>
              <select
                value={localAnestheticType}
                onChange={(e) =>
                  setLocalAnestheticType(
                    e.target.value as 'HYPERBARIC_BUPIVACAINE' | 'ISOBARIC_BUPIVACAINE' | 'ROPIVACAINE'
                  )
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="HYPERBARIC_BUPIVACAINE">Hyperbaric 0.75% Bupivacaine (Heavy with Dextrose)</option>
                <option value="ISOBARIC_BUPIVACAINE">Isobaric 0.5% Bupivacaine (Plain)</option>
                <option value="ROPIVACAINE">0.5% Ropivacaine</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Patient Table Positioning</label>
              <select
                value={positioning}
                onChange={(e) => setPositioning(e.target.value as PatientPositioning)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="SUPINE_FLAT">Supine Flat</option>
                <option value="HEAD_NEUTRAL_LEGS_ELEVATED">Head Neutral + Legs Elevated (Autotransfusion)</option>
                <option value="STEEP_TRENDELENBURG">Steep Trendelenburg (Head Down &gt; 15°)</option>
                <option value="REVERSE_TRENDELENBURG">Reverse Trendelenburg (Head Up)</option>
              </select>
            </div>
          </div>

          {/* Controls Column 2: Hemodynamic Interventions */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Syringe className="w-4 h-4 text-rose-400" /> Hemodynamic Deck
            </h2>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">IV Crystalloid Infused:</span>
                <span className="text-cyan-400 font-mono">{ivFluidInfusedMl} mL</span>
              </div>
              <input
                type="range"
                min="0"
                max="2500"
                step="100"
                value={ivFluidInfusedMl}
                onChange={(e) => setIvFluidInfusedMl(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <span className="text-[11px] text-slate-500">Target 1000–1500 mL co-hydration to maintain preload.</span>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Vasoactive Pressor Selection</label>
              <select
                value={pressorAdministered}
                onChange={(e) => setPressorAdministered(e.target.value as PressorChoice)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="NONE">None</option>
                <option value="EPINEPHRINE_LOW_DOSE">Epinephrine 10-20 mcg IV (1st-line for T4/BJR arrest)</option>
                <option value="EPHEDRINE_BOLUS">Ephedrine 5-10 mg IV (Mixed α/β agent)</option>
                <option value="NOREPINEPHRINE_INFUSION">Norepinephrine Infusion (α1 + modest β1)</option>
                <option value="PHENYLEPHRINE_BOLUS">Phenylephrine 100 mcg IV (Pure α1 Vasoconstrictor)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Anticholinergic / Vagolytic Rescue</label>
              <select
                value={vagolyticAdministered}
                onChange={(e) => setVagolyticAdministered(e.target.value as VagolyticAgent)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="NONE">None</option>
                <option value="ATROPINE_0_5_1MG">Atropine 0.5–1.0 mg IV (Centrally Acting Vagolytic)</option>
                <option value="GLYCOPYRROLATE_0_2_0_4MG">Glycopyrrolate 0.2–0.4 mg IV (Peripheral)</option>
              </select>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300">Physiologic Pearl:</div>
              <div>
                Sympathetic block is 2–4 dermatomes higher than sensory block. A sensory block at T4 implies complete sympathetic denervation of the heart (T1–T4 cardioaccelerators), leaving the heart entirely under parasympathetic vagal control!
              </div>
            </div>
          </div>

          {/* Controls Column 3: Airway & Resuscitation Recommendations */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Wind className="w-4 h-4 text-sky-400" /> Airway Interventions
              </h2>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Ventilatory Support Level</label>
                <select
                  value={airwayManagement}
                  onChange={(e) => setAirwayManagement(e.target.value as AirwayIntervention)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                >
                  <option value="NONE_ROOM_AIR">Room Air (Spontaneous)</option>
                  <option value="HIGH_FLOW_OXYGEN_MASK">100% Non-Rebreather Oxygen Mask</option>
                  <option value="BAG_VALVE_MASK_ASSISTED">Bag-Valve-Mask (BVM) Positive Pressure</option>
                  <option value="ENDOTRACHEAL_INTUBATION_VENTILATED">Endotracheal Intubation & Mechanical Ventilation</option>
                </select>
              </div>

              <div className="mt-4 space-y-2">
                <div className="text-xs font-semibold text-slate-300">Active Recommendations:</div>
                {result.clinicalRecommendations.length === 0 ? (
                  <div className="text-xs text-slate-500 italic">No acute rescue interventions indicated.</div>
                ) : (
                  result.clinicalRecommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-200 flex items-start gap-2"
                    >
                      <ArrowUpRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>{rec}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => applyPreset('normal_t10')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset to Baseline
            </button>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Neuraxial Dermatome Mapping */}
      {activeTab === 'anatomy' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4" /> Dermatomal Block Progression Ladder
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="font-bold text-red-400 flex items-center justify-between">
                  <span>Brainstem Cisterns / 4th Ventricle</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 border border-red-800">Total Spinal</span>
                </div>
                <div className="text-slate-400 mt-1">
                  Local anesthetic reaches the brainstem, causing immediate loss of consciousness, bilateral fixed dilated pupils (mydriasis), and central respiratory arrest.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="font-bold text-amber-400 flex items-center justify-between">
                  <span>C3–C5 (Phrenic Nerve Innervation)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 border border-amber-800">Diaphragm Arrest</span>
                </div>
                <div className="text-slate-400 mt-1">
                  &ldquo;C3, 4, 5 keeps the diaphragm alive.&rdquo; Paralysis of phrenic roots eliminates diaphragmatic excursion. Vocal cord tone is lost; the patient cannot generate air pressure to phonate (aphonia).
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="font-bold text-sky-400 flex items-center justify-between">
                  <span>C7–T1 (Brachial Plexus & Hands)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 border border-sky-800">Hand Tingling / Grip Loss</span>
                </div>
                <div className="text-slate-400 mt-1">
                  Numbness or weakness in the little and ring fingers (C8-T1) indicates cephalad ascent into the cervical spinal cord. Intercostal muscle paralysis is complete.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="font-bold text-rose-400 flex items-center justify-between">
                  <span>T1–T4 (Cardiac Accelerator Fibers)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 border border-rose-800">Cardioaccelerator Block</span>
                </div>
                <div className="text-slate-400 mt-1">
                  Sensory block at T4 (nipples) causes sympathetic block up to T1. Loss of cardiac accelerator fibers triggers profound unopposed parasympathetic vagal bradycardia and decreased contractility.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="font-bold text-emerald-400 flex items-center justify-between">
                  <span>T10 (Umbilicus)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">Standard Target</span>
                </div>
                <div className="text-slate-400 mt-1">
                  Adequate for Cesarean delivery, hip fracture, and lower extremity procedures. Cardioaccelerators and diaphragm are preserved.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Bed className="w-4 h-4" /> Baricity & The Trendelenburg Gravity Trap
            </h3>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">Hyperbaric Local Anesthetics:</strong> Heavy bupivacaine (formulated with dextrose) has a specific gravity higher than CSF ($&gt; 1.0069$). During the first 15–20 minutes prior to tissue fixation, the drug flows downhill with gravity.
              </p>
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-700/50 text-red-200">
                <strong className="text-red-300">The Steep Trendelenburg Fallacy:</strong> Inexperienced clinicians encountering sudden hypotension after spinal induction often tilt the operating table into steep Trendelenburg to &ldquo;restore cerebral blood flow.&rdquo; With hyperbaric drug, this accelerates rapid cephalad migration directly into the cervical cord and brainstem!
              </div>
              <p>
                <strong className="text-white">Correct Positioning:</strong> Maintain the head and neck in neutral or slightly elevated position (flexing the neck keeps the drug in the thoracic kyphosis), while elevating the patient&rsquo;s lower extremities (&ldquo;leg wrap&rdquo; or manual elevation) to mobilize 300–500 mL of autotransfused blood without encouraging cephalad spinal spread.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: The Pressor Paradox & Bezold-Jarisch Reflex */}
      {activeTab === 'pressor' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-4 h-4" /> The Bezold-Jarisch Reflex (BJR) in Spinal Anesthesia
            </h3>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                The Bezold-Jarisch reflex is an inhibitory cardiovascular reflex characterized by the lethal triad of <strong className="text-white">profound bradycardia, vasodilation, and severe hypotension</strong>, often culminating in instantaneous asystolic arrest.
              </p>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-amber-400">Trigger Mechanism:</div>
                <div>
                  1. Splanchnic venodilation causes profound venous pooling, plummeting right ventricular preload and left ventricular end-diastolic volume (empty LV chamber).
                </div>
                <div>
                  2. The underfilled LV vigorously contracts against empty space, stimulating unmyelinated mechanoreceptors (C-fibers) in the posterior LV myocardium.
                </div>
                <div>
                  3. Paradoxically, the brainstem interprets this hypercontraction as volume overload, triggering massive central vagal efferent discharge resulting in <strong className="text-rose-400">instant asystolic cardiac arrest!</strong>
                </div>
              </div>
              <p>
                <strong className="text-white">Prevention:</strong> Pre-emptive volume loading (1000 mL crystalloid) and early restoration of venous tone and heart rate before the chamber empties.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <Syringe className="w-4 h-4" /> The Phenylephrine Pressor Trap
            </h3>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                Phenylephrine is a pure selective alpha-1 adrenergic receptor agonist. While effective for simple arteriolar vasodilation, its use in high spinal anesthesia carries a deadly hazard:
              </p>
              <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-700/50 text-red-200 space-y-1">
                <div className="font-bold text-red-300">Why Phenylephrine Can Cause Asystole:</div>
                <div>
                  In a high spinal (&ge; T4), sympathetic cardiac accelerators are blocked. Administering a large bolus of pure alpha-1 agonist dramatically raises systemic vascular resistance (afterload).
                </div>
                <div className="mt-1">
                  Carotid sinus baroreceptors detect the blood pressure spike and send parasympathetic signals to slow the heart. Because sympathetic counter-regulation is blocked, this induces <strong className="text-white">severe reflex bradycardia</strong>. Coupled with high afterload against an underfilled, denervated ventricle, cardiac output drops to zero!
                </div>
              </div>
              <p>
                <strong className="text-emerald-400 font-bold">First-Line Choice:</strong> Ephedrine (mixed alpha/beta) or low-dose Epinephrine (10–20 mcg IV boluses). Epinephrine directly restores cardiac inotropy, chronotropy (beta-1), and venous tone (alpha-1), bypassing the blocked sympathetics.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: ASRA / SOAP Emergency Protocol */}
      {activeTab === 'protocol' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Total Spinal Emergency Management Algorithm
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-cyan-400">Step 1: Declare & Call</div>
              <div className="text-slate-300">
                Call for emergency anesthesia help. Declare &ldquo;High Spinal / Total Spinal.&rdquo; Assign resuscitation roles.
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-sky-400">Step 2: 100% O₂ & Airway</div>
              <div className="text-slate-300">
                Apply 100% O₂ via BVM immediately. If aphonic or phrenic block present, perform rapid sequence endotracheal intubation.
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-rose-400">Step 3: Epinephrine Early</div>
              <div className="text-slate-300">
                Administer Epinephrine 10–20 mcg IV q1-2min (or 1 mg if arrest). Add Atropine 0.5–1.0 mg IV if HR &lt; 50 bpm.
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-amber-400">Step 4: Preload Recruitment</div>
              <div className="text-slate-300">
                Wide-open crystalloid bolus (1000–2000 mL). Keep head neutral and elevate legs to recruit splanchnic/venous reservoir.
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-emerald-400">Step 5: Sedation / Reassurance</div>
              <div className="text-slate-300">
                Once hemodynamic stability and airway are secured, administer IV midazolam/propofol to prevent intraoperative awareness until block recedes (1.5–3 hrs).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
