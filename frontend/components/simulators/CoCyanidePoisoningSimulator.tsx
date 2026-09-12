'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Flame,
  Activity,
  Droplets,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  RotateCcw,
  FileText,
  Sparkles,
  Stethoscope,
  Zap,
  Wind,
  X,
  Gauge,
  Compass,
  Pill,
  RefreshCw,
  Clock,
  Radio,
} from 'lucide-react';
import {
  CoCyanideScenarioId,
  CO_CYANIDE_SCENARIOS,
  CoCyanidePatientState,
  CoCyanideDebriefResult,
  OxygenDeliveryMode,
  initializeCoCyanidePatientState,
  setOxygenDeliveryMode,
  administerHydroxocobalamin,
  administerSodiumThiosulfate,
  administerSodiumNitrite,
  initiateHyperbaricOxygen,
  advanceCoCyanideTime,
  evaluateCoCyanideDebrief,
  getCoHalfLifeMinutes,
} from '../../.gemini/skills/CoCyanidePoisoningEngine';

export default function CoCyanidePoisoningSimulator() {
  const [selectedScenarioId, setSelectedScenarioId] =
    useState<CoCyanideScenarioId>('ENCLOSED_STRUCTURE_FIRE_SMOKE');
  const [patientState, setPatientState] = useState<CoCyanidePatientState>(() =>
    initializeCoCyanidePatientState('ENCLOSED_STRUCTURE_FIRE_SMOKE')
  );
  const [statusMessage, setStatusMessage] = useState<string>(
    'Smoke inhalation victim in coma with suspected dual CO and cyanide toxicity. Prioritize high-flow 100% O2, assess co-oximetry and lactate, and prepare Cyanokit.'
  );
  const [showDebriefModal, setShowDebriefModal] = useState<boolean>(false);
  const [debriefResult, setDebriefResult] = useState<CoCyanideDebriefResult | null>(null);

  const scenario = useMemo(
    () => CO_CYANIDE_SCENARIOS[selectedScenarioId],
    [selectedScenarioId]
  );

  // Auto-advance simulation time
  useEffect(() => {
    const interval = setInterval(() => {
      setPatientState((prev) => advanceCoCyanideTime(prev, 5));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectScenario = useCallback((id: CoCyanideScenarioId) => {
    setSelectedScenarioId(id);
    const newState = initializeCoCyanidePatientState(id);
    setPatientState(newState);
    setShowDebriefModal(false);
    setDebriefResult(null);
    setStatusMessage(`Loaded Scenario: ${CO_CYANIDE_SCENARIOS[id].title}`);
  }, []);

  const handleReset = useCallback(() => {
    handleSelectScenario(selectedScenarioId);
  }, [handleSelectScenario, selectedScenarioId]);

  // Actions
  const handleOxygenChange = useCallback(
    (mode: OxygenDeliveryMode) => {
      const { updatedState, message } = setOxygenDeliveryMode(patientState, mode);
      setPatientState(updatedState);
      setStatusMessage(message);
    },
    [patientState]
  );

  const handleGiveHydroxocobalamin = useCallback(() => {
    const { updatedState, message } = administerHydroxocobalamin(patientState, 5.0);
    setPatientState(updatedState);
    setStatusMessage(message);
  }, [patientState]);

  const handleGiveThiosulfate = useCallback(() => {
    const { updatedState, message } = administerSodiumThiosulfate(patientState, 12.5);
    setPatientState(updatedState);
    setStatusMessage(message);
  }, [patientState]);

  const handleGiveNitrite = useCallback(() => {
    const { updatedState, message } = administerSodiumNitrite(patientState, 300);
    setPatientState(updatedState);
    setStatusMessage(message);
  }, [patientState]);

  const handleStartHBO2 = useCallback(() => {
    const { updatedState, message } = initiateHyperbaricOxygen(patientState);
    setPatientState(updatedState);
    setStatusMessage(message);
  }, [patientState]);

  const handleAdvanceTime = useCallback(
    (minutes: number) => {
      const advanced = advanceCoCyanideTime(patientState, minutes);
      setPatientState(advanced);
      setStatusMessage(`Advanced simulation by ${minutes} minutes of ongoing elimination.`);
    },
    [patientState]
  );

  const handleOpenDebrief = useCallback(() => {
    const result = evaluateCoCyanideDebrief(patientState);
    setDebriefResult(result);
    setShowDebriefModal(true);
  }, [patientState]);

  const currentHalfLife = getCoHalfLifeMinutes(patientState.oxygenMode);
  const isSevereCo = patientState.coOximetry.coHbPct >= 25;
  const isSevereLactate = patientState.labs.serumLactateMmolL >= 8.0;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border border-amber-700/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/20 border border-amber-400/40 rounded-xl text-amber-400">
                <Flame className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-rose-100 to-sky-200">
                  Smoke Inhalation Dual-Toxin: CO & Cyanide Poisoning Workstation
                </h1>
                <p className="text-xs md:text-sm text-amber-300/80">
                  {"Carboxyhemoglobin Kinetics, Pulse Oximetry Pitfall, Hydroxocobalamin Stoichiometry & Hyperbaric Oxygen (HBO2)"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Scenario Selector */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="co-scenario-select"
                className="text-xs font-semibold text-slate-300 uppercase tracking-wider"
              >
                Scenario:
              </label>
              <select
                id="co-scenario-select"
                value={selectedScenarioId}
                onChange={(e) => handleSelectScenario(e.target.value as CoCyanideScenarioId)}
                className="bg-slate-900/90 border border-amber-500/40 text-xs md:text-sm rounded-lg px-3 py-2 text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 max-w-xs truncate"
              >
                {Object.values(CO_CYANIDE_SCENARIOS).map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600/60 rounded-lg text-xs font-semibold transition"
              title="Reset Scenario"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
              Reset
            </button>

            {/* Debrief Button */}
            <button
              onClick={handleOpenDebrief}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/50 rounded-lg text-xs md:text-sm font-bold shadow-lg shadow-emerald-950/40 transition"
            >
              <FileText className="w-4 h-4" />
              Toxicology Debrief
            </button>
          </div>
        </div>

        {/* Patient Profile Chip */}
        <div className="mt-4 p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl text-xs md:text-sm text-amber-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Patient Profile:</span>
            <span>{scenario.patientProfile}</span>
          </div>
          <div className="text-[11px] text-sky-300 font-mono">
            Initial COHb: {scenario.initialCoHb}% | Cyanide: {scenario.initialCyanideUmolL} µmol/L | GCS: {scenario.initialGcs}
            {scenario.isPregnant && ' | PREGNANT (22 wks)'}
          </div>
        </div>

        {/* Clinical Presentation */}
        <div className="mt-3 p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-slate-300 flex items-start gap-2">
          <Stethoscope className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>{scenario.clinicalPresentation}</div>
        </div>
      </div>

      {/* Attending Feedback Banner */}
      <div className="px-4 py-2.5 bg-slate-900/80 border border-amber-500/30 rounded-xl text-xs md:text-sm text-sky-200 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="font-semibold text-slate-400">Toxicology Faculty:</span>
        <span className="truncate">{statusMessage}</span>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Co-Oximetry & Pulse Oximeter Pitfall (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Co-Oximetry Deck */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Arterial Co-Oximetry vs Pulse Oximeter
                </h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Multi-Wavelength Optical
              </span>
            </div>

            {/* Standard SpO2 Pitfall Alert */}
            <div className="p-3 bg-rose-950/40 border border-rose-600/60 rounded-xl space-y-1">
              <div className="flex justify-between items-center text-xs text-rose-300 font-semibold">
                <span>Standard Bedside SpO2 (2-Wavelength)</span>
                <span className="font-mono text-lg font-black text-rose-200">
                  {patientState.coOximetry.standardSpO2Pct}%
                </span>
              </div>
              <div className="text-[11px] text-rose-300/80">
                PITFALL: 2-wavelength sensor cannot distinguish OxyHb from COHb! Reads falsely reassuring ~98-100% despite fatal internal hypoxia.
              </div>
            </div>

            {/* True Co-Oximetry Fractions */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Carboxyhemoglobin */}
              <div className={`p-3.5 rounded-xl border ${isSevereCo ? 'bg-rose-950/60 border-rose-500' : 'bg-slate-950/70 border-slate-800'}`}>
                <div className="text-slate-400">Carboxyhemoglobin (COHb)</div>
                <div className="text-2xl font-black text-rose-300 font-mono mt-1">
                  {patientState.coOximetry.coHbPct.toFixed(1)}%
                </div>
                <div className="text-[10px] text-slate-500">Normal &lt; 2% (&lt; 5% smokers)</div>
              </div>

              {/* Methemoglobin */}
              <div className={`p-3.5 rounded-xl border ${patientState.coOximetry.metHbPct >= 10 ? 'bg-amber-950/60 border-amber-500' : 'bg-slate-950/70 border-slate-800'}`}>
                <div className="text-slate-400">Methemoglobin (MetHb)</div>
                <div className="text-2xl font-black text-amber-300 font-mono mt-1">
                  {patientState.coOximetry.metHbPct.toFixed(1)}%
                </div>
                <div className="text-[10px] text-slate-500">&gt; 15% = Chocolate Blood</div>
              </div>

              {/* True Oxyhemoglobin */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-slate-400">True Oxyhemoglobin</div>
                <div className="text-2xl font-black text-emerald-300 font-mono mt-1">
                  {patientState.coOximetry.oxyHbPct.toFixed(1)}%
                </div>
                <div className="text-[10px] text-slate-500">Functional Oxygen Delivery</div>
              </div>

              {/* Deoxyhemoglobin */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-slate-400">Deoxyhemoglobin</div>
                <div className="text-2xl font-black text-sky-300 font-mono mt-1">
                  {patientState.coOximetry.deoxyHbPct.toFixed(1)}%
                </div>
                <div className="text-[10px] text-slate-500">Unsaturated Reduced Hb</div>
              </div>
            </div>

            {/* Saturation Breakdown Bar */}
            <div className="space-y-1 pt-1 text-xs">
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>OxyHb: {patientState.coOximetry.oxyHbPct}%</span>
                <span>COHb: {patientState.coOximetry.coHbPct}%</span>
                <span>MetHb: {patientState.coOximetry.metHbPct}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden flex">
                <div
                  style={{ width: `${patientState.coOximetry.oxyHbPct}%` }}
                  className="bg-emerald-500 h-full"
                  title="Oxyhemoglobin"
                />
                <div
                  style={{ width: `${patientState.coOximetry.coHbPct}%` }}
                  className="bg-rose-500 h-full"
                  title="Carboxyhemoglobin"
                />
                <div
                  style={{ width: `${patientState.coOximetry.metHbPct}%` }}
                  className="bg-amber-500 h-full"
                  title="Methemoglobin"
                />
              </div>
            </div>
          </div>

          {/* Clinical Alarms Deck */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Active Alarms</h3>
            </div>
            {patientState.activeAlarms.length === 0 ? (
              <div className="text-xs text-slate-500 italic">No acute toxicological alarms active.</div>
            ) : (
              <div className="space-y-2">
                {patientState.activeAlarms.map((alarm, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-700/60 text-xs text-rose-200 font-medium flex items-start gap-2"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{alarm}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Mitochondrial Hypoxia, Oxygen Kinetics & Antidotes (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mitochondrial Complex IV & Histotoxic Hypoxia Deck */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Mitochondrial Complex IV & Histotoxic Hypoxia
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Urine: {patientState.labs.urineColor.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {/* Serum Lactate */}
              <div className={`p-3 rounded-xl border ${isSevereLactate ? 'bg-rose-950/60 border-rose-600' : 'bg-slate-950/70 border-slate-800'}`}>
                <div className="text-slate-400">Serum Lactate</div>
                <div className={`text-xl font-black font-mono mt-1 ${isSevereLactate ? 'text-rose-400' : 'text-slate-200'}`}>
                  {patientState.labs.serumLactateMmolL.toFixed(1)}
                  <span className="text-xs font-normal text-slate-500 ml-1">mmol/L</span>
                </div>
                <div className="text-[10px] text-slate-500">&gt;= 8.0 = Cyanide Marker</div>
              </div>

              {/* Cyanide Level */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-slate-400">Blood Cyanide</div>
                <div className="text-xl font-black text-amber-300 font-mono mt-1">
                  {patientState.labs.wholeBloodCyanideUmolL.toFixed(1)}
                  <span className="text-xs font-normal text-slate-500 ml-1">µmol/L</span>
                </div>
                <div className="text-[10px] text-slate-500">&gt; 40 = Toxic, &gt; 100 = Fatal</div>
              </div>

              {/* ScvO2 */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-slate-400">Central Venous ScvO2</div>
                <div className={`text-xl font-black font-mono mt-1 ${patientState.labs.scvO2Pct >= 85 ? 'text-rose-400' : 'text-sky-300'}`}>
                  {patientState.labs.scvO2Pct}%
                </div>
                <div className="text-[10px] text-slate-500">Histotoxic: &gt; 85% (Unconsumed O2)</div>
              </div>

              {/* Arterial pH */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-slate-400">Arterial pH</div>
                <div className={`text-xl font-black font-mono mt-1 ${patientState.labs.arterialPh < 7.20 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {patientState.labs.arterialPh.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-500">Base Deficit: -{patientState.labs.baseDeficitMeqL}</div>
              </div>
            </div>

            {/* Vitals Summary */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <div>
                BP: <span className="font-mono font-bold text-slate-200">{patientState.vitals.bpSystolicMmHg} / {patientState.vitals.bpDiastolicMmHg} mmHg</span>
              </div>
              <div>
                HR: <span className="font-mono font-bold text-slate-200">{patientState.vitals.heartRateBpm} bpm</span>
              </div>
              <div>
                GCS: <span className="font-mono font-bold text-slate-200">{patientState.vitals.gcsScore} / 15</span>
              </div>
              <div>
                Elapsed: <span className="font-mono font-bold text-amber-300">{patientState.elapsedMinutes} mins</span>
              </div>
            </div>
          </div>

          {/* Oxygen Therapy & Carboxyhemoglobin Kinetics */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-sky-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Oxygen Therapy & Half-Life Kinetics
                </h2>
              </div>
              <span className="text-xs text-amber-300 font-mono font-bold">
                t½ = {currentHalfLife} minutes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleOxygenChange('ROOM_AIR_21_PCT')}
                className={`p-3 rounded-xl border text-xs font-bold transition text-left space-y-1 ${
                  patientState.oxygenMode === 'ROOM_AIR_21_PCT'
                    ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <div className="font-black">Room Air (21% O2)</div>
                <div className="text-[10px] text-slate-400">t½ = 320 mins (5.3 hours)</div>
              </button>

              <button
                onClick={() => handleOxygenChange('NRB_100_PCT')}
                className={`p-3 rounded-xl border text-xs font-bold transition text-left space-y-1 ${
                  patientState.oxygenMode === 'NRB_100_PCT'
                    ? 'bg-sky-600 text-white border-sky-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <div className="font-black">100% O2 via NRB Mask</div>
                <div className="text-[10px] text-slate-400">t½ = 78 mins (1.3 hours)</div>
              </button>

              <button
                onClick={handleStartHBO2}
                className={`p-3 rounded-xl border text-xs font-bold transition text-left space-y-1 ${
                  patientState.oxygenMode === 'HYPERBARIC_OXYGEN_3_ATA'
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-teal-950/60 text-teal-300 border-teal-600 hover:bg-teal-900/60'
                }`}
              >
                <div className="font-black">Hyperbaric O2 (3.0 ATA)</div>
                <div className="text-[10px] text-slate-400">t½ = 23 mins (Rapid Decay)</div>
              </button>
            </div>

            {/* Time Fast-Forward Buttons */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400">Simulate Time:</span>
              <button
                onClick={() => handleAdvanceTime(15)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg font-mono font-bold text-slate-200 transition"
              >
                +15 min
              </button>
              <button
                onClick={() => handleAdvanceTime(30)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg font-mono font-bold text-slate-200 transition"
              >
                +30 min
              </button>
              <button
                onClick={() => handleAdvanceTime(60)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg font-mono font-bold text-slate-200 transition"
              >
                +60 min
              </button>
            </div>
          </div>

          {/* Antidote Pharmacotherapy Bench */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-rose-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Antidote Pharmacotherapy & Hazard Interlocks
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Cyanokit Given: {patientState.antidotes.hydroxocobalaminGivenGrams} g
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Hydroxocobalamin (Cyanokit) */}
              <button
                onClick={handleGiveHydroxocobalamin}
                className="p-3 bg-rose-600/80 hover:bg-rose-500 border border-rose-400/40 rounded-xl text-xs font-bold text-white shadow-md transition flex flex-col justify-between space-y-1"
              >
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-rose-200" />
                  <span>Hydroxocobalamin 5.0 g IV</span>
                </div>
                <div className="text-[10px] text-rose-200/80 font-normal">
                  First-line for CN in smoke. Forms Vitamin B12.
                </div>
              </button>

              {/* Sodium Thiosulfate */}
              <button
                onClick={handleGiveThiosulfate}
                className="p-3 bg-teal-600/80 hover:bg-teal-500 border border-teal-400/40 rounded-xl text-xs font-bold text-white shadow-md transition flex flex-col justify-between space-y-1"
              >
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-teal-200" />
                  <span>Sodium Thiosulfate 12.5 g IV</span>
                </div>
                <div className="text-[10px] text-teal-200/80 font-normal">
                  Sulfur donor for rhodanese enzyme.
                </div>
              </button>

              {/* Sodium Nitrite Warning */}
              <button
                onClick={handleGiveNitrite}
                className="p-3 bg-slate-800 hover:bg-rose-950 border border-amber-500/50 rounded-xl text-xs font-bold text-amber-300 transition flex flex-col justify-between space-y-1"
              >
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Sodium Nitrite 300 mg IV</span>
                </div>
                <div className="text-[10px] text-amber-400/80 font-normal">
                  Induces MetHb. DANGER in concurrent CO!
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Debrief Modal */}
      {showDebriefModal && debriefResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <FileText className="w-6 h-6" />
                <h3 className="text-lg font-bold text-slate-100">
                  Carbon Monoxide & Cyanide Toxicology Debrief
                </h3>
              </div>
              <button
                onClick={() => setShowDebriefModal(false)}
                className="text-slate-400 hover:text-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & Letter Grade */}
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Overall Competency Score</div>
                <div className="text-3xl font-black text-emerald-400 mt-0.5">
                  {debriefResult.scorePercentage}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 uppercase tracking-wider">ACMT / UHMS Grade</div>
                <div className="text-3xl font-black text-amber-300 mt-0.5 font-mono">
                  {debriefResult.letterGrade}
                </div>
              </div>
            </div>

            {/* Rubric Checklist */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Clinical Toxicology Resuscitation Checkpoints
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.highFlowO2InitiatedPromptly ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>100% O2 Escalation Initiated</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.coOximetryPrioritizedOverSpO2 ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>Co-Oximetry Prioritized</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.hydroxocobalaminAdministeredCorrectly ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>Cyanokit Administered for Lactate &gt;= 8</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.avoidedNitriteToxicityTrap ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>Avoided Sodium Nitrite MetHb Trap</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.hbo2ReferredAccurately ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>UHMS Hyperbaric Oxygen Indication</span>
                </div>
              </div>
            </div>

            {/* Faculty Feedback */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Medical Toxicology Faculty Insights
              </h4>
              <div className="space-y-2">
                {debriefResult.facultyFeedback.map((fb, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{fb}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDebriefModal(false)}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs md:text-sm font-bold shadow-lg transition"
              >
                Close Debrief
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
