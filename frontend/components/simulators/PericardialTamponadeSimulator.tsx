'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Heart,
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
  ArrowDownRight,
  X,
  Gauge,
  Compass,
  Syringe,
  Wind,
  RefreshCw,
  Waves,
  Radio,
} from 'lucide-react';
import {
  TamponadeScenarioId,
  TAMPONADE_SCENARIOS,
  TamponadePatientState,
  TamponadeDebriefResult,
  initializeTamponadePatientState,
  deliverTemporizingBolus,
  performAgitatedSalineTest,
  positionPericardiocentesisNeedle,
  aspiratePericardialFluid,
  placePericardialDrain,
  togglePositivePressureVentilation,
  advanceTamponadeTimeStep,
  evaluateTamponadeDebrief,
} from '../../.gemini/skills/PericardialTamponadeEngine';

export default function PericardialTamponadeSimulator() {
  const [selectedScenarioId, setSelectedScenarioId] =
    useState<TamponadeScenarioId>('SUBACUTE_MALIGNANT_EFFUSION');
  const [patientState, setPatientState] = useState<TamponadePatientState>(() =>
    initializeTamponadePatientState('SUBACUTE_MALIGNANT_EFFUSION')
  );
  const [statusMessage, setStatusMessage] = useState<string>(
    'Patient presents with Beck\'s triad and severe pulsus paradoxus. Assess hemodynamics, consider volume loading, and prepare for ultrasound-guided pericardiocentesis.'
  );
  const [showDebriefModal, setShowDebriefModal] = useState<boolean>(false);
  const [debriefResult, setDebriefResult] = useState<TamponadeDebriefResult | null>(null);

  const scenario = useMemo(
    () => TAMPONADE_SCENARIOS[selectedScenarioId],
    [selectedScenarioId]
  );

  // Auto-advance simulation time
  useEffect(() => {
    const interval = setInterval(() => {
      setPatientState((prev) => advanceTamponadeTimeStep(prev, 10));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectScenario = useCallback((id: TamponadeScenarioId) => {
    setSelectedScenarioId(id);
    const newState = initializeTamponadePatientState(id);
    setPatientState(newState);
    setShowDebriefModal(false);
    setDebriefResult(null);
    setStatusMessage(`Loaded Scenario: ${TAMPONADE_SCENARIOS[id].title}`);
  }, []);

  const handleReset = useCallback(() => {
    handleSelectScenario(selectedScenarioId);
  }, [handleSelectScenario, selectedScenarioId]);

  // Actions
  const handleDeliverBolus = useCallback(
    (volumeMl: number) => {
      const { updatedState, message } = deliverTemporizingBolus(patientState, volumeMl);
      setPatientState(updatedState);
      setStatusMessage(message);
    },
    [patientState]
  );

  const handlePositionNeedle = useCallback(
    (approach: 'SUBXIPHOID' | 'APICAL') => {
      const { updatedState, message } = positionPericardiocentesisNeedle(
        patientState,
        approach
      );
      setPatientState(updatedState);
      setStatusMessage(message);
    },
    [patientState]
  );

  const handleAgitatedSalineTest = useCallback(() => {
    const { updatedState, message } = performAgitatedSalineTest(patientState);
    setPatientState(updatedState);
    setStatusMessage(message);
  }, [patientState]);

  const handleAspirateFluid = useCallback(
    (volumeMl: number) => {
      const { updatedState, message } = aspiratePericardialFluid(
        patientState,
        volumeMl
      );
      setPatientState(updatedState);
      setStatusMessage(message);
    },
    [patientState]
  );

  const handlePlaceDrain = useCallback(() => {
    const { updatedState, message } = placePericardialDrain(patientState);
    setPatientState(updatedState);
    setStatusMessage(message);
  }, [patientState]);

  const handleTogglePPV = useCallback(
    (enabled: boolean, peep: number = 5) => {
      const { updatedState, message } = togglePositivePressureVentilation(
        patientState,
        enabled,
        peep
      );
      setPatientState(updatedState);
      setStatusMessage(message);
    },
    [patientState]
  );

  const handleOpenDebrief = useCallback(() => {
    const result = evaluateTamponadeDebrief(patientState);
    setDebriefResult(result);
    setShowDebriefModal(true);
  }, [patientState]);

  const isTamponade = patientState.pericardial.intrapericardialPressureMmHg >= 10;
  const isPulsusSevere = patientState.hemodynamics.pulsusParadoxusMmHg >= 20;
  const isPea = patientState.interventions.isPeaArrest;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-rose-700/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/20 border border-rose-400/40 rounded-xl text-rose-400">
                <Heart className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-200 via-sky-100 to-amber-200">
                  Acute Cardiac Tamponade, Pulsus Paradoxus & Pericardiocentesis Workstation
                </h1>
                <p className="text-xs md:text-sm text-rose-300/80">
                  {"Pericardial Elastance Curve, Beck's Triad, Respiro-Phasic Inflow Doppler & Ultrasound-Guided Needle Decompression"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Scenario Selector */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="tamponade-scenario-select"
                className="text-xs font-semibold text-slate-300 uppercase tracking-wider"
              >
                Scenario:
              </label>
              <select
                id="tamponade-scenario-select"
                value={selectedScenarioId}
                onChange={(e) => handleSelectScenario(e.target.value as TamponadeScenarioId)}
                className="bg-slate-900/90 border border-rose-500/40 text-xs md:text-sm rounded-lg px-3 py-2 text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 max-w-xs truncate"
              >
                {Object.values(TAMPONADE_SCENARIOS).map((sc) => (
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
              Pericardial Debrief
            </button>
          </div>
        </div>

        {/* Patient Profile Chip */}
        <div className="mt-4 p-3 bg-rose-950/40 border border-rose-800/40 rounded-xl text-xs md:text-sm text-rose-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Patient Profile:</span>
            <span>{scenario.patientProfile}</span>
          </div>
          <div className="text-[11px] text-amber-300 font-mono">
            Fluid Type: {scenario.initialEffusion.fluidType.replace(/_/g, ' ')} ({scenario.initialEffusion.volumeMl} mL)
          </div>
        </div>

        {/* Clinical Presentation */}
        <div className="mt-3 p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-slate-300 flex items-start gap-2">
          <Stethoscope className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>{scenario.clinicalPresentation}</div>
        </div>
      </div>

      {/* Attending Feedback Status Bar */}
      <div className="px-4 py-2.5 bg-slate-900/80 border border-rose-500/30 rounded-xl text-xs md:text-sm text-sky-200 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="font-semibold text-slate-400">Cardiology Attending:</span>
        <span className="truncate">{statusMessage}</span>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Beck's Triad & Physical Exam Deck (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Beck's Triad Console */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-rose-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  {"Beck's Triad & Physical Signs"}
                </h2>
              </div>
              <div
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  isTamponade
                    ? 'bg-rose-950 text-rose-300 border-rose-700/60 animate-pulse'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                }`}
              >
                {isTamponade ? 'Tamponade Active' : 'Physiology Normal'}
              </div>
            </div>

            {/* Triad Sign 1: Arterial Blood Pressure & Hypotension */}
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>1. Arterial BP (Exp / Insp)</span>
                <Activity className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-2xl font-black text-rose-300 font-mono">
                {patientState.hemodynamics.sbpExpiratoryMmHg} / {patientState.hemodynamics.dbpMmHg}
                <span className="text-xs font-normal text-slate-500 ml-1">
                  (Insp SBP: {patientState.hemodynamics.sbpInspiratoryMmHg})
                </span>
              </div>
              <div className="text-[10px] text-slate-500 flex justify-between">
                <span>MAP: {patientState.hemodynamics.mapMmHg} mmHg</span>
                <span>HR: {patientState.hemodynamics.heartRateBpm} bpm</span>
              </div>
            </div>

            {/* Triad Sign 2: Elevated CVP & JVD */}
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>2. Jugular Venous Distension (CVP)</span>
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="text-2xl font-black text-sky-300 font-mono">
                {patientState.diastolic.cvpMmHg}
                <span className="text-xs font-normal text-slate-500 ml-1">mmHg</span>
              </div>
              <div className="text-[10px] text-amber-400/90 font-mono">
                {patientState.diastolic.isCvpYDescentBlunted
                  ? 'Blunted / Absent \'y\' Descent'
                  : 'Normal Biphasic \'x\' & \'y\' Descent'}
              </div>
            </div>

            {/* Triad Sign 3: Muffled Heart Sounds */}
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>3. Cardiac Auscultation</span>
                <Stethoscope className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-sm font-bold text-slate-200 mt-1">
                {isTamponade
                  ? 'Distant, Muffled Heart Sounds (Fluid Dampening)'
                  : 'Crisp S1 / S2, No Pericardial Friction Rub'}
              </div>
            </div>

            {/* Pulsus Paradoxus Meter */}
            <div className={`p-3.5 rounded-xl border ${isPulsusSevere ? 'bg-rose-950/50 border-rose-600' : 'bg-slate-950/70 border-slate-800'}`}>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="font-bold text-amber-300">Pulsus Paradoxus (ΔSBP Insp)</span>
                <span className="font-mono text-xs font-bold text-amber-400">
                  {patientState.hemodynamics.pulsusParadoxusMmHg} mmHg
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 mt-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    patientState.hemodynamics.pulsusParadoxusMmHg >= 20
                      ? 'bg-rose-500'
                      : patientState.hemodynamics.pulsusParadoxusMmHg >= 10
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                  style={{
                    width: `${Math.min(100, (patientState.hemodynamics.pulsusParadoxusMmHg / 30) * 100)}%`,
                  }}
                />
              </div>
              <div className="text-[10px] text-slate-500 flex justify-between mt-1">
                <span>0 mmHg (Normal)</span>
                <span>Threshold &gt; 10</span>
                <span>Severe &gt; 20</span>
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
              <div className="text-xs text-slate-500 italic">No acute alarms active.</div>
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

        {/* Right Column: Invasive Pressures, POCUS Doppler & Pericardiocentesis (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Diastolic Pressure Equalization Deck */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Invasive Diastolic Pressure Equalization (Swan-Ganz)
                </h2>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  patientState.diastolic.isDiastolicEqualizationPresent
                    ? 'bg-rose-950 text-rose-300 border-rose-600'
                    : 'bg-slate-950 text-slate-400 border-slate-700'
                }`}
              >
                {patientState.diastolic.isDiastolicEqualizationPresent
                  ? 'EQUALIZATION PRESENT (|CVP - PCWP| <= 4)'
                  : 'Chamber Pressures Differentiated'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-slate-400">RAP / CVP</div>
                <div className="text-xl font-black text-sky-300 font-mono mt-1">
                  {patientState.diastolic.cvpMmHg} mmHg
                </div>
                <div className="text-[10px] text-slate-500">Normal 2-8 mmHg</div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-slate-400">RVEDP</div>
                <div className="text-xl font-black text-sky-300 font-mono mt-1">
                  {patientState.diastolic.rvedpMmHg} mmHg
                </div>
                <div className="text-[10px] text-slate-500">Normal 2-8 mmHg</div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-slate-400">PAP Diastolic</div>
                <div className="text-xl font-black text-sky-300 font-mono mt-1">
                  {patientState.diastolic.papDiastolicMmHg} mmHg
                </div>
                <div className="text-[10px] text-slate-500">Sys: {patientState.diastolic.papSystolicMmHg}</div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-slate-400">PCWP</div>
                <div className="text-xl font-black text-sky-300 font-mono mt-1">
                  {patientState.diastolic.pcwpMmHg} mmHg
                </div>
                <div className="text-[10px] text-slate-500">Normal 8-12 mmHg</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <div>
                Cardiac Output: <span className="font-mono font-bold text-slate-200">{patientState.hemodynamics.cardiacOutputLpm} L/min</span>
              </div>
              <div>
                Cardiac Index: <span className="font-mono font-bold text-slate-200">{patientState.hemodynamics.cardiacIndexLpmM2} L/min/m²</span>
              </div>
              <div>
                Stroke Volume: <span className="font-mono font-bold text-slate-200">{patientState.hemodynamics.strokeVolumeMl} mL</span>
              </div>
              <div>
                Intrapericardial P: <span className="font-mono font-bold text-rose-400">{patientState.pericardial.intrapericardialPressureMmHg} mmHg</span>
              </div>
            </div>
          </div>

          {/* POCUS & Respiro-Phasic Doppler Suite */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Waves className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  POCUS & Respiro-Phasic Doppler Inflow Suite
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                IVC: {patientState.echo.ivcDiameterCm} cm ({patientState.echo.ivcCollapsibilityPct}% collapse)
              </span>
            </div>

            {/* Doppler Inflow Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Mitral Inflow */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-indigo-300">Mitral Inflow E Wave</span>
                  <span className={`font-mono font-bold ${patientState.echo.mitralRespiratoryVariationPct > 25 ? 'text-rose-400' : 'text-slate-300'}`}>
                    Δ {patientState.echo.mitralRespiratoryVariationPct}%
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Exp: {patientState.echo.mitralEExpCmS} cm/s</span>
                  <span>Insp: {patientState.echo.mitralEInspCmS} cm/s</span>
                </div>
                <div className="text-[10px] text-slate-500">Tamponade criteria: &gt; 25% drop on inspiration</div>
              </div>

              {/* Tricuspid Inflow */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-teal-300">Tricuspid Inflow E Wave</span>
                  <span className={`font-mono font-bold ${patientState.echo.tricuspidRespiratoryVariationPct > 40 ? 'text-rose-400' : 'text-slate-300'}`}>
                    Δ {patientState.echo.tricuspidRespiratoryVariationPct}%
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Exp: {patientState.echo.tricuspidEExpCmS} cm/s</span>
                  <span>Insp: {patientState.echo.tricuspidEInspCmS} cm/s</span>
                </div>
                <div className="text-[10px] text-slate-500">Tamponade criteria: &gt; 40% increase on inspiration</div>
              </div>
            </div>

            {/* Echo Chamber Collapse Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className={`p-2.5 rounded-lg border text-center font-bold ${patientState.echo.rvDiastolicCollapse ? 'bg-rose-950/60 border-rose-600 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                RV Diastolic Collapse
              </div>
              <div className={`p-2.5 rounded-lg border text-center font-bold ${patientState.echo.raSystolicCollapse ? 'bg-rose-950/60 border-rose-600 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                RA Systolic Inversion
              </div>
              <div className={`p-2.5 rounded-lg border text-center font-bold ${patientState.echo.swingingHeartSign ? 'bg-amber-950/60 border-amber-600 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                Swinging Heart Motion
              </div>
              <div className={`p-2.5 rounded-lg border text-center font-bold ${patientState.echo.electricalAlternans ? 'bg-amber-950/60 border-amber-600 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                Electrical Alternans
              </div>
            </div>
          </div>

          {/* Ultrasound-Guided Pericardiocentesis Procedural Bench */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Syringe className="w-5 h-5 text-rose-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Emergency Ultrasound-Guided Pericardiocentesis
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Aspirated: {patientState.effusion.aspiratedVolumeMl} mL / Remainder: {patientState.effusion.currentEffusionVolumeMl} mL
              </span>
            </div>

            {/* Approach & Safety Confirmation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handlePositionNeedle('SUBXIPHOID')}
                className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                  patientState.interventions.needleApproach === 'SUBXIPHOID'
                    ? 'bg-rose-600 text-white border-rose-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Compass className="w-4 h-4" />
                Subxiphoid Approach (45°)
              </button>

              <button
                onClick={() => handlePositionNeedle('APICAL')}
                className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                  patientState.interventions.needleApproach === 'APICAL'
                    ? 'bg-rose-600 text-white border-rose-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Compass className="w-4 h-4" />
                Apical Approach (5th ICS)
              </button>

              <button
                onClick={handleAgitatedSalineTest}
                className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                  patientState.interventions.agitatedSalineConfirmed
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-teal-950/60 text-teal-300 border-teal-600 hover:bg-teal-900/60'
                }`}
              >
                <Radio className="w-4 h-4" />
                Agitated Saline Bubble Test
              </button>
            </div>

            {/* Aspiration Syringe Buttons */}
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                onClick={() => handleAspirateFluid(20)}
                className="flex-1 min-w-[140px] py-2.5 px-3 bg-rose-600/80 hover:bg-rose-500 border border-rose-400/40 rounded-xl text-xs font-bold text-white shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Droplets className="w-4 h-4" />
                Aspirate 20 mL
              </button>
              <button
                onClick={() => handleAspirateFluid(50)}
                className="flex-1 min-w-[140px] py-2.5 px-3 bg-rose-600/80 hover:bg-rose-500 border border-rose-400/40 rounded-xl text-xs font-bold text-white shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Droplets className="w-4 h-4" />
                Aspirate 50 mL
              </button>
              <button
                onClick={() => handleAspirateFluid(100)}
                className="flex-1 min-w-[140px] py-2.5 px-3 bg-rose-600/80 hover:bg-rose-500 border border-rose-400/40 rounded-xl text-xs font-bold text-white shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Droplets className="w-4 h-4" />
                Aspirate 100 mL
              </button>
              <button
                onClick={handlePlaceDrain}
                disabled={patientState.effusion.drainPlaced}
                className="flex-1 min-w-[160px] py-2.5 px-3 bg-amber-600/80 hover:bg-amber-500 disabled:opacity-50 border border-amber-400/40 rounded-xl text-xs font-bold text-white shadow-md transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                {patientState.effusion.drainPlaced ? 'Drain In Place' : 'Place Pigtail Drain'}
              </button>
            </div>
          </div>

          {/* Resuscitation Pharmacotherapy & Airway Guardrails */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Resuscitation Pharmacotherapy & Airway Guardrails
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Fluids Given: {patientState.interventions.totalCrystalloidGivenMl} mL
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Temporizing Fluid Loading */}
              <button
                onClick={() => handleDeliverBolus(500)}
                className="p-3 bg-sky-600/80 hover:bg-sky-500 border border-sky-400/40 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-md transition"
              >
                <Droplets className="w-4 h-4" />
                Deliver 500 mL IV Crystalloid Bolus
              </button>

              {/* Positive Pressure Ventilation Caution */}
              <button
                onClick={() =>
                  handleTogglePPV(!patientState.interventions.positivePressureActive, 10)
                }
                className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                  patientState.interventions.positivePressureActive
                    ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Wind className="w-4 h-4" />
                {patientState.interventions.positivePressureActive
                  ? 'Disconnect PPV (Ventilator Trap Active!)'
                  : 'Toggle PPV & PEEP 10 cmH2O (Caution)'}
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
                  Cardiac Tamponade & Pericardiocentesis Clinical Debrief
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
                <div className="text-xs text-slate-400 uppercase tracking-wider">AHA / ASE Grade</div>
                <div className="text-3xl font-black text-rose-300 mt-0.5 font-mono">
                  {debriefResult.letterGrade}
                </div>
              </div>
            </div>

            {/* Rubric Checklist */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Procedural Resuscitation Checkpoints
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.beckTriadRecognized ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>Beck\'s Triad & Pulsus Recognized</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.temporizingBolusDelivered ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>Temporizing Fluid Bolus Delivered</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.pericardiocentesisSuccessful ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>Pericardiocentesis / Decompression</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.agitatedSalineVerified ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>Agitated Saline Verified</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <CheckCircle2
                    className={`w-4 h-4 ${debriefResult.avoidedVentilatorArrest ? 'text-emerald-400' : 'text-rose-500'}`}
                  />
                  <span>Avoided PPV Ventilator Trap</span>
                </div>
              </div>
            </div>

            {/* Faculty Feedback */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Critical Care Cardiology Insights
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
