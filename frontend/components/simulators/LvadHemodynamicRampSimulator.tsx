'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Activity,
  Heart,
  Cpu,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  RotateCcw,
  FileText,
  Sparkles,
  Stethoscope,
  Zap,
  Droplets,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Gauge,
  Compass,
  Pill,
  RefreshCw,
  Wind,
} from 'lucide-react';
import {
  LvadScenarioPresetId,
  LVAD_SCENARIOS,
  LvadPatientState,
  SeptalPosition,
  AorticValveState,
  LvadDebriefResult,
  initializeLvadPatientState,
  titratePumpSpeed,
  deliverFluidBolus,
  titrateInotropeOrVasodilator,
  administerAnticoagulation,
  advanceLvadTimeStep,
  evaluateLvadDebrief,
} from '../../.gemini/skills/LvadHemodynamicRampEngine';

export default function LvadHemodynamicRampSimulator() {
  const [selectedScenarioId, setSelectedScenarioId] =
    useState<LvadScenarioPresetId>('RAMP_PROTOCOL_SPEED_OPTIMIZATION');
  const [patientState, setPatientState] = useState<LvadPatientState>(() =>
    initializeLvadPatientState('RAMP_PROTOCOL_SPEED_OPTIMIZATION')
  );
  const [statusMessage, setStatusMessage] = useState<string>(
    'Patient with HeartMate 3 ready for RAMP study. Stepwise titrate pump speed, monitor LVEDD unloading, and observe aortic valve opening.'
  );
  const [showDebriefModal, setShowDebriefModal] = useState<boolean>(false);
  const [debriefResult, setDebriefResult] = useState<LvadDebriefResult | null>(null);

  const scenario = useMemo(
    () => LVAD_SCENARIOS[selectedScenarioId],
    [selectedScenarioId]
  );

  // Auto-advance simulation time
  useEffect(() => {
    const interval = setInterval(() => {
      setPatientState((prev) => advanceLvadTimeStep(prev, 10));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectScenario = useCallback((id: LvadScenarioPresetId) => {
    setSelectedScenarioId(id);
    const newState = initializeLvadPatientState(id);
    setPatientState(newState);
    setShowDebriefModal(false);
    setDebriefResult(null);
    setStatusMessage(`Loaded Scenario: ${LVAD_SCENARIOS[id].title}`);
  }, []);

  const handleReset = useCallback(() => {
    handleSelectScenario(selectedScenarioId);
  }, [handleSelectScenario, selectedScenarioId]);

  // Actions
  const handleSpeedChange = useCallback(
    (newSpeed: number) => {
      const { updatedState, message } = titratePumpSpeed(patientState, newSpeed);
      setPatientState(updatedState);
      setStatusMessage(message);
    },
    [patientState]
  );

  const handleStepSpeed = useCallback(
    (delta: number) => {
      handleSpeedChange(patientState.pump.speedRpm + delta);
    },
    [handleSpeedChange, patientState.pump.speedRpm]
  );

  const handleDeliverBolus = useCallback(
    (volumeMl: number) => {
      const { updatedState, message } = deliverFluidBolus(patientState, volumeMl);
      setPatientState(updatedState);
      setStatusMessage(message);
    },
    [patientState]
  );

  const handleTitrateInotrope = useCallback(
    (drug: 'MILRINONE' | 'DOBUTAMINE' | 'INO', dose: number) => {
      const { updatedState, message } = titrateInotropeOrVasodilator(
        patientState,
        drug,
        dose
      );
      setPatientState(updatedState);
      setStatusMessage(message);
    },
    [patientState]
  );

  const handleAdministerAnticoagulation = useCallback(() => {
    const { updatedState, message } = administerAnticoagulation(
      patientState,
      'HEPARIN_INFUSION'
    );
    setPatientState(updatedState);
    setStatusMessage(message);
  }, [patientState]);

  const handleOpenDebrief = useCallback(() => {
    const result = evaluateLvadDebrief(patientState);
    setDebriefResult(result);
    setShowDebriefModal(true);
  }, [patientState]);

  const isPowerSurge = patientState.pump.powerWatts >= 9.0;
  const isSuction = patientState.pump.suctionEventActive;
  const isLowFlow = patientState.pump.flowLpm < 2.5;
  const isRvFailure = patientState.hemodynamics.papiRatio < 1.85;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-rose-700/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/20 border border-rose-400/40 rounded-xl text-rose-400">
                <Cpu className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-200 via-sky-100 to-amber-200">
                  Left Ventricular Assist Device (LVAD / HM3) Speed Optimization & RAMP Workstation
                </h1>
                <p className="text-xs md:text-sm text-rose-300/80">
                  MagLev Rotary Continuous-Flow Kinetics, Echocardiographic RAMP Protocol, Apical Suction Recovery & RV Failure Hemodynamics
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Scenario Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="lvad-scenario-select" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Scenario:
              </label>
              <select
                id="lvad-scenario-select"
                value={selectedScenarioId}
                onChange={(e) => handleSelectScenario(e.target.value as LvadScenarioPresetId)}
                className="bg-slate-900/90 border border-rose-500/40 text-xs md:text-sm rounded-lg px-3 py-2 text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 max-w-xs truncate"
              >
                {Object.values(LVAD_SCENARIOS).map((sc) => (
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
              LVAD Debrief
            </button>
          </div>
        </div>

        {/* Patient Profile Chip */}
        <div className="mt-4 p-3 bg-rose-950/40 border border-rose-800/40 rounded-xl text-xs md:text-sm text-rose-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Profile:</span>
            <span>{scenario.patientProfile}</span>
          </div>
          <div className="text-[11px] text-amber-300 font-mono">
            Optimal Target: ~{scenario.targetOptimalSpeedRpm} rpm
          </div>
        </div>

        {/* Clinical Presentation */}
        <div className="mt-3 p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-slate-300 flex items-start gap-2">
          <Stethoscope className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>{scenario.clinicalPresentation}</div>
        </div>
      </div>

      {/* Real-time Status Message */}
      <div className="px-4 py-2.5 bg-slate-900/80 border border-rose-500/30 rounded-xl text-xs md:text-sm text-sky-200 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="font-semibold text-slate-400">Attending Feedback:</span>
        <span className="truncate">{statusMessage}</span>
      </div>

      {/* Main Grid: HM3 Controller, RAMP Echo, Suction, Hemolysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: HeartMate 3 Controller & Alarms (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* HeartMate 3 Controller Deck */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-rose-400 animate-pulse" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  HeartMate 3 Controller
                </h2>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50 text-[10px] font-bold">
                <RefreshCw className="w-3 h-3 animate-spin" />
                MagLev Active
              </div>
            </div>

            {/* Core 4 Parameters */}
            <div className="grid grid-cols-2 gap-3">
              {/* Pump Speed */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Speed</span>
                  <Gauge className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <div className="text-2xl font-black text-rose-300 mt-1 font-mono">
                  {patientState.pump.speedRpm}
                  <span className="text-xs font-normal text-slate-500 ml-1">rpm</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Range: 4800-6400</div>
              </div>

              {/* Pump Flow */}
              <div className={`bg-slate-950/70 border rounded-xl p-3 ${isLowFlow ? 'border-rose-600 bg-rose-950/20' : 'border-slate-800/80'}`}>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Estimated Flow</span>
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className={`text-2xl font-black mt-1 font-mono ${isLowFlow ? 'text-rose-400' : 'text-sky-300'}`}>
                  {patientState.pump.flowLpm.toFixed(1)}
                  <span className="text-xs font-normal text-slate-500 ml-1">L/min</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Normal: 4.0-6.0</div>
              </div>

              {/* Pump Power */}
              <div className={`bg-slate-950/70 border rounded-xl p-3 ${isPowerSurge ? 'border-rose-600 bg-rose-950/20' : 'border-slate-800/80'}`}>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Pump Power</span>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className={`text-2xl font-black mt-1 font-mono ${isPowerSurge ? 'text-rose-400' : 'text-amber-300'}`}>
                  {patientState.pump.powerWatts.toFixed(1)}
                  <span className="text-xs font-normal text-slate-500 ml-1">W</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">&gt; 9W = Thrombus/Drag</div>
              </div>

              {/* Pulsatility Index */}
              <div className={`bg-slate-950/70 border rounded-xl p-3 ${patientState.pump.pulsatilityIndex < 2.0 ? 'border-amber-500 bg-amber-950/20' : 'border-slate-800/80'}`}>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Pulsatility (PI)</span>
                  <Activity className="w-3.5 h-3.5 text-teal-400" />
                </div>
                <div className={`text-2xl font-black mt-1 font-mono ${patientState.pump.pulsatilityIndex < 2.0 ? 'text-amber-400' : 'text-teal-300'}`}>
                  {patientState.pump.pulsatilityIndex.toFixed(1)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">&lt; 2.0 = Hypovolemia</div>
              </div>
            </div>

            {/* Invasive Hemodynamics Readout */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Doppler MAP:</span>
                <span className="font-bold text-slate-200">{patientState.hemodynamics.mapMmHg} mmHg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">CVP:</span>
                <span className={`font-mono font-bold ${patientState.hemodynamics.cvpMmHg > 14 ? 'text-rose-400' : 'text-emerald-300'}`}>
                  {patientState.hemodynamics.cvpMmHg} mmHg
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">PAP (Systolic / Diastolic):</span>
                <span className="font-mono text-slate-200">
                  {patientState.hemodynamics.papSystolicMmHg} / {patientState.hemodynamics.papDiastolicMmHg} mmHg
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">PAPi Ratio:</span>
                <span className={`font-mono font-bold ${isRvFailure ? 'text-rose-400' : 'text-emerald-300'}`}>
                  {patientState.hemodynamics.papiRatio.toFixed(2)}
                  {isRvFailure && <span className="ml-1 text-[10px] text-rose-400">(RV Failure)</span>}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">TAPSE:</span>
                <span className="font-mono text-slate-200">{patientState.hemodynamics.tapseMm} mm</span>
              </div>
            </div>
          </div>

          {/* Clinical Alarms */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Active Alarms</h3>
            </div>
            {patientState.clinicalAlarms.length === 0 ? (
              <div className="text-xs text-slate-500 italic">No acute alarms active.</div>
            ) : (
              <div className="space-y-2">
                {patientState.clinicalAlarms.map((alarm, idx) => (
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

        {/* Right Column: RAMP Echo Console, Suction, Hemolysis (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Echocardiographic Surveillance & RAMP Protocol Console */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Echocardiographic Surveillance & RAMP Protocol
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStepSpeed(-100)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-bold text-slate-200 transition flex items-center gap-1"
                >
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                  -100 rpm
                </button>
                <button
                  onClick={() => handleStepSpeed(100)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-bold text-slate-200 transition flex items-center gap-1"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                  +100 rpm
                </button>
              </div>
            </div>

            {/* Echo Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* LVEDD */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <div className="text-slate-400">LV End-Diastolic Diam (LVEDD)</div>
                <div className="text-2xl font-black text-sky-300 font-mono">
                  {patientState.hemodynamics.lveddCm.toFixed(2)} cm
                </div>
                <div className="text-[10px] text-slate-500">Normal Unloaded: 4.5-5.5 cm</div>
              </div>

              {/* Septal Position */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <div className="text-slate-400">Septal Position</div>
                <div className="text-sm font-bold text-amber-300 mt-1">
                  {patientState.hemodynamics.septalPosition.replace(/_/g, ' ')}
                </div>
                <div className="text-[10px] text-slate-500">Target: Midline Neutral</div>
              </div>

              {/* Aortic Valve Opening */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <div className="text-slate-400">Aortic Valve Opening</div>
                <div
                  className={`text-xs font-black px-2 py-1 rounded border mt-1 inline-block ${
                    patientState.hemodynamics.aorticValveStatus === 'INTERMITTENT_OPENING_OPTIMAL'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                      : patientState.hemodynamics.aorticValveStatus === 'SEVERE_AORTIC_INSUFFICIENCY'
                      ? 'bg-rose-950 text-rose-300 border-rose-600'
                      : 'bg-slate-900 text-amber-300 border-amber-600'
                  }`}
                >
                  {patientState.hemodynamics.aorticValveStatus.replace(/_/g, ' ')}
                </div>
              </div>
            </div>

            {/* Speed Slider */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-sky-300">HeartMate 3 Speed Titration</span>
                <span className="font-mono text-sky-200 font-bold">
                  {patientState.pump.speedRpm} rpm
                </span>
              </div>
              <input
                type="range"
                min="4800"
                max="6400"
                step="100"
                value={patientState.pump.speedRpm}
                onChange={(e) => handleSpeedChange(parseInt(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500 flex justify-between">
                <span>4800 rpm</span>
                <span>Target: 5400-5600 rpm</span>
                <span>6400 rpm</span>
              </div>
            </div>

            {/* Serial RAMP Step History */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                RAMP Protocol Step Record
              </div>
              <div className="overflow-x-auto max-h-36 overflow-y-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-2">Speed</th>
                      <th className="p-2">LVEDD</th>
                      <th className="p-2">Flow</th>
                      <th className="p-2">Power</th>
                      <th className="p-2">PI</th>
                      <th className="p-2">AV Opening</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono">
                    {patientState.rampProtocolHistory.map((rec, i) => (
                      <tr key={i} className="hover:bg-slate-800/40">
                        <td className="p-2 font-bold text-rose-300">{rec.stepSpeedRpm} rpm</td>
                        <td className="p-2">{rec.lveddCm.toFixed(2)} cm</td>
                        <td className="p-2">{rec.flowLpm.toFixed(1)} L/m</td>
                        <td className="p-2">{rec.powerWatts.toFixed(1)} W</td>
                        <td className="p-2">{rec.pi.toFixed(1)}</td>
                        <td className="p-2 text-[11px] font-sans">
                          {rec.aorticValveStatus === 'INTERMITTENT_OPENING_OPTIMAL' ? 'Intermittent (Ideal)' : rec.aorticValveStatus.replace(/_/g, ' ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Suction & Acute Hemodynamic Management Bench */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Suction & Acute Hemodynamic Interventions
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Fluids Given: {patientState.administeredFluidMl} mL
              </span>
            </div>

            {/* Suction Alert */}
            {isSuction && (
              <div className="p-3 bg-rose-950/80 border border-rose-600 rounded-xl text-xs md:text-sm text-rose-200 flex items-start gap-2.5 font-semibold animate-pulse">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  APICAL SUCTION EVENT ACTIVE: Inflow cannula obstructed against collapsing LV wall!
                  Flow dropped to {patientState.pump.flowLpm} L/min with low PI {patientState.pump.pulsatilityIndex}. Deliver crystalloids and decrease speed!
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleDeliverBolus(500)}
                className="flex-1 min-w-[200px] py-2.5 px-4 bg-sky-600/80 hover:bg-sky-500 border border-sky-400/40 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition text-white"
              >
                <Droplets className="w-4 h-4 text-sky-200" />
                Deliver 500 mL IV Crystalloid Bolus
              </button>

              <button
                onClick={() => handleSpeedChange(Math.max(4800, patientState.pump.speedRpm - 400))}
                className="flex-1 min-w-[200px] py-2.5 px-4 bg-amber-600/80 hover:bg-amber-500 border border-amber-400/40 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition text-white"
              >
                <ArrowDownRight className="w-4 h-4 text-amber-200" />
                Emergency Speed Step-Down (-400 rpm)
              </button>
            </div>

            {/* Inotropes for RV Failure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => handleTitrateInotrope('INO', 20)}
                className="p-3 rounded-xl border border-teal-500/50 bg-teal-950/40 hover:bg-teal-900/60 text-xs font-bold text-teal-200 flex items-center justify-between transition shadow-md"
              >
                <div className="flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-teal-400" />
                  <span>Initiate Inhaled Nitric Oxide (iNO 20 ppm)</span>
                </div>
                {patientState.activeInotropes.inoPpm > 0 && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
              </button>

              <button
                onClick={() => handleTitrateInotrope('MILRINONE', 0.375)}
                className="p-3 rounded-xl border border-purple-500/50 bg-purple-950/40 hover:bg-purple-900/60 text-xs font-bold text-purple-200 flex items-center justify-between transition shadow-md"
              >
                <div className="flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-purple-400" />
                  <span>Titrate Milrinone (0.375 mcg/kg/min)</span>
                </div>
                {patientState.activeInotropes.milrinoneMcgKgMin > 0 && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
              </button>
            </div>
          </div>

          {/* Hemolysis & Pump Thrombosis Diagnostic Bench */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-rose-500" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Hemolysis & Pump Thrombosis Diagnostics
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Anticoagulation: {patientState.anticoagulationActive ? 'Active' : 'Subtherapeutic'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-slate-400">Serum LDH</div>
                <div className={`text-xl font-black font-mono mt-0.5 ${patientState.labs.serumLdhIuL > 1000 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {patientState.labs.serumLdhIuL} IU/L
                </div>
                <div className="text-[10px] text-slate-500">&gt; 1000 = Thrombosis/Hemolysis</div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-slate-400">Plasma Free Hb</div>
                <div className={`text-xl font-black font-mono mt-0.5 ${patientState.labs.plasmaFreeHbMgDl > 40 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {patientState.labs.plasmaFreeHbMgDl} mg/dL
                </div>
                <div className="text-[10px] text-slate-500">Normal &lt; 10 mg/dL</div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-slate-400">Urine Color</div>
                <div className="text-sm font-bold text-amber-300 mt-1 font-mono">
                  {patientState.labs.urineColor.replace(/_/g, ' ')}
                </div>
              </div>
            </div>

            {/* Anticoagulation Action */}
            <div className="pt-1">
              <button
                onClick={handleAdministerAnticoagulation}
                className="w-full py-2.5 px-4 bg-rose-600/80 hover:bg-rose-500 border border-rose-400/40 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition text-white"
              >
                <ShieldAlert className="w-4 h-4 text-rose-200" />
                Initiate Therapeutic IV Heparin Protocol
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
              <div className="flex items-center gap-2 text-rose-400">
                <FileText className="w-6 h-6" />
                <h3 className="text-lg font-bold text-slate-100">
                  LVAD & RAMP Protocol Clinical Debrief & Competency Report
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
                <div className="text-xs text-slate-400 uppercase tracking-wider">ISHLT Mechanical Support Grade</div>
                <div className="text-3xl font-black text-rose-300 mt-0.5 font-mono">
                  {debriefResult.letterGrade}
                </div>
              </div>
            </div>

            {/* Rubric Checklist */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Clinical Resuscitation Checkpoints
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.rampSpeedOptimized ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>RAMP Speed Optimized</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.suctionRelievedPromptly ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>Suction Relieved Promptly</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.rvFailureTreatedCorrectly ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>RV Failure Treated Correctly</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.thrombosisManaged ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>Thrombosis & Hemolysis Managed</span>
                </div>
              </div>
            </div>

            {/* Faculty Feedback */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Heart Failure & Mechanical Circulatory Support Insights
              </h4>
              <div className="space-y-2">
                {debriefResult.facultyFeedback.map((fb, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
                  >
                    <Sparkles className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{fb}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDebriefModal(false)}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs md:text-sm font-bold shadow-lg transition"
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
