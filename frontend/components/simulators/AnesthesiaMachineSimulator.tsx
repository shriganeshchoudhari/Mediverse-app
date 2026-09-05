'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import {
  Activity,
  Wind,
  Gauge,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Droplets,
  Heart,
  Thermometer,
  Zap,
  Layers,
  Power,
  Volume2,
} from 'lucide-react';
import {
  VOLATILE_AGENTS,
  ANESTHESIA_PRESETS,
  VolatileAgentId,
  CircuitMode,
  GasMixerSettings,
  VaporizerSettings,
  CircuitMechanics,
  PatientState,
  computeHypoxicGuard,
  calculateAgeAdjustedMAC,
  calculateCircuitTimeConstant,
  calculateRebreathingFraction,
  calculateFAFIRatio,
  calculateDantroleneProtocol,
  simulateAnesthesiaStep,
} from '@/.gemini/skills/AnesthesiaMachineEngine';

export default function AnesthesiaMachineSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('routine-low-flow');
  const [elapsedMinutes, setElapsedMinutes] = useState<number>(5.0);

  // Gas Mixer State
  const [o2Flow, setO2Flow] = useState<number>(0.4);
  const [n2oFlow, setN2oFlow] = useState<number>(0.0);
  const [airFlow, setAirFlow] = useState<number>(0.4);

  // Vaporizer State
  const [selectedAgent, setSelectedAgent] = useState<VolatileAgentId>('sevoflurane');
  const [vaporizerDial, setVaporizerDial] = useState<number>(2.2);

  // Circuit Mechanics State
  const [circuitMode, setCircuitMode] = useState<CircuitMode>('ventilator');
  const [aplPressure, setAplPressure] = useState<number>(0);
  const [absorberExhaustion, setAbsorberExhaustion] = useState<number>(12);
  const [unidirectionalValveOk, setUnidirectionalValveOk] = useState<boolean>(true);
  const [yPieceConnected, setYPieceConnected] = useState<boolean>(true);
  const [pipelinePressurePsi, setPipelinePressurePsi] = useState<number>(52);
  const [cylinderOpen, setCylinderOpen] = useState<boolean>(false);

  // Patient Modifiers State
  const [patientAge, setPatientAge] = useState<number>(42);
  const [patientWeight, setPatientWeight] = useState<number>(70);
  const [dantroleneGivenMg, setDantroleneGivenMg] = useState<number>(0);
  const [mhActive, setMhActive] = useState<boolean>(false);

  const activePreset = useMemo(
    () => ANESTHESIA_PRESETS.find(p => p.id === selectedPresetId) || ANESTHESIA_PRESETS[0],
    [selectedPresetId]
  );

  // Load preset on change
  useEffect(() => {
    setO2Flow(activePreset.initialMixer.o2);
    setN2oFlow(activePreset.initialMixer.n2o);
    setAirFlow(activePreset.initialMixer.air);

    setSelectedAgent(activePreset.initialVaporizer.agent);
    setVaporizerDial(activePreset.initialVaporizer.dial);

    setCircuitMode(activePreset.initialCircuit.mode || 'ventilator');
    setAplPressure(activePreset.initialCircuit.aplValvePressureCmH2O || 0);
    setAbsorberExhaustion(activePreset.initialCircuit.absorberExhaustionPercent || 10);
    setUnidirectionalValveOk(
      activePreset.initialCircuit.unidirectionalValveIntact !== undefined
        ? activePreset.initialCircuit.unidirectionalValveIntact
        : true
    );
    setYPieceConnected(
      activePreset.initialCircuit.yPieceConnected !== undefined
        ? activePreset.initialCircuit.yPieceConnected
        : true
    );
    setPipelinePressurePsi(activePreset.initialCircuit.pipelineO2PressurePsi || 50);
    setCylinderOpen(activePreset.initialCircuit.cylinderO2Open || false);

    setPatientAge(activePreset.patientModifiers.age || 40);
    setPatientWeight(activePreset.patientModifiers.weightKg || 70);
    setDantroleneGivenMg(activePreset.patientModifiers.dantroleneAdministeredMg || 0);
    setMhActive(activePreset.patientModifiers.malignantHyperthermiaActive || false);
    setElapsedMinutes(5.0);
  }, [activePreset]);

  // Compute mixer with hypoxic guard
  const mixerSettings: GasMixerSettings = useMemo(() => {
    return computeHypoxicGuard(o2Flow, n2oFlow, airFlow);
  }, [o2Flow, n2oFlow, airFlow]);

  const vaporizerSettings: VaporizerSettings = useMemo(() => ({
    agent: selectedAgent,
    dialPercent: vaporizerDial,
    reservoirLevelPercent: 85,
    heatedTec6Active: selectedAgent === 'desflurane',
  }), [selectedAgent, vaporizerDial]);

  const circuitMechanics: CircuitMechanics = useMemo(() => ({
    circuitVolumeL: 5.0,
    aplValvePressureCmH2O: aplPressure,
    mode: circuitMode,
    rebreathingFraction: 0.8,
    circuitTimeConstantMin: 5.0 / Math.max(0.2, mixerSettings.totalFgfLMin),
    absorberExhaustionPercent: absorberExhaustion,
    indicatorColor: absorberExhaustion > 50 ? 'VIOLET' : 'WHITE',
    unidirectionalValveIntact: unidirectionalValveOk,
    yPieceConnected,
    pipelineO2PressurePsi: pipelinePressurePsi,
    cylinderO2Open: cylinderOpen,
  }), [
    aplPressure,
    circuitMode,
    mixerSettings.totalFgfLMin,
    absorberExhaustion,
    unidirectionalValveOk,
    yPieceConnected,
    pipelinePressurePsi,
    cylinderOpen,
  ]);

  const initialPatientState: PatientState = useMemo(() => ({
    age: patientAge,
    weightKg: patientWeight,
    minuteVentilationLMin: 5.2,
    cardiacOutputLMin: 5.0,
    inspiredVolatilePercent: 2.0,
    endTidalVolatilePercent: 1.6,
    faFiRatio: 0.8,
    ageAdjustedMacAgent: calculateAgeAdjustedMAC(selectedAgent, patientAge),
    n2oContributionMac: 0,
    totalMac: 1.0,
    depthState: 'SURGICAL_ANESTHESIA',
    etco2MmHg: activePreset.patientModifiers.etco2MmHg || 38,
    fico2MmHg: 0,
    spo2Percent: 99,
    heartRateBpm: activePreset.patientModifiers.heartRateBpm || 72,
    systolicBpMmHg: activePreset.patientModifiers.systolicBpMmHg || 118,
    temperatureC: activePreset.patientModifiers.temperatureC || 36.8,
    malignantHyperthermiaActive: mhActive,
    dantroleneAdministeredMg: dantroleneGivenMg,
  }), [
    patientAge,
    patientWeight,
    selectedAgent,
    activePreset.patientModifiers,
    mhActive,
    dantroleneGivenMg,
  ]);

  // Master step computation
  const { patient, circuit, alerts } = useMemo(() => {
    return simulateAnesthesiaStep(
      selectedPresetId,
      mixerSettings,
      vaporizerSettings,
      circuitMechanics,
      initialPatientState,
      elapsedMinutes
    );
  }, [
    selectedPresetId,
    mixerSettings,
    vaporizerSettings,
    circuitMechanics,
    initialPatientState,
    elapsedMinutes,
  ]);

  // Generate synthetic Capnogram waveform (4 breaths, 0 to 16 seconds)
  const capnogramData = useMemo(() => {
    const points = [];
    const etco2 = patient.etco2MmHg;
    const fico2 = patient.fico2MmHg;
    const breathDuration = 4.0; // 15 breaths/min

    for (let t = 0; t <= 16; t += 0.2) {
      const cycleTime = t % breathDuration;
      let co2 = fico2;

      if (!circuit.yPieceConnected || etco2 === 0) {
        co2 = 0;
      } else if (cycleTime < 0.8) {
        // Phase I: Inspiratory baseline (should be 0 or fico2 if rebreathing)
        co2 = fico2;
      } else if (cycleTime < 1.4) {
        // Phase II: Expiratory upstroke
        const progress = (cycleTime - 0.8) / 0.6;
        co2 = fico2 + (etco2 * 0.85 - fico2) * Math.sin(progress * (Math.PI / 2));
      } else if (cycleTime < 2.8) {
        // Phase III: Alveolar plateau (slight upward slope)
        const progress = (cycleTime - 1.4) / 1.4;
        co2 = etco2 * 0.85 + (etco2 * 0.15) * progress;
      } else {
        // Phase IV: Inspiratory downstroke
        const progress = (cycleTime - 2.8) / 1.2;
        co2 = etco2 * (1 - Math.sin(progress * (Math.PI / 2)));
        if (co2 < fico2) co2 = fico2;
      }

      points.push({
        timeSeconds: +t.toFixed(1),
        co2MmHg: +co2.toFixed(1),
      });
    }
    return points;
  }, [patient.etco2MmHg, patient.fico2MmHg, circuit.yPieceConnected]);

  // Generate FA/FI Wash-In curve across 30 minutes
  const fafiCurveData = useMemo(() => {
    const points = [];
    for (let m = 0; m <= 30; m += 2) {
      const des = calculateFAFIRatio('desflurane', mixerSettings.totalFgfLMin, m, patient.cardiacOutputLMin);
      const sevo = calculateFAFIRatio('sevoflurane', mixerSettings.totalFgfLMin, m, patient.cardiacOutputLMin);
      const iso = calculateFAFIRatio('isoflurane', mixerSettings.totalFgfLMin, m, patient.cardiacOutputLMin);
      points.push({
        minute: m,
        desflurane: des,
        sevoflurane: sevo,
        isoflurane: iso,
      });
    }
    return points;
  }, [mixerSettings.totalFgfLMin, patient.cardiacOutputLMin]);

  // Dantrolene protocol calculation
  const dantroleneInfo = useMemo(() => {
    return calculateDantroleneProtocol(patient.weightKg);
  }, [patient.weightKg]);

  // Socratic AI context bridge
  const handleAskAI = () => {
    const context = `Anesthesia Delivery Workstation & Volatile Vaporizer Consultation:
Active Preset: ${activePreset.name} (${activePreset.subtitle})
Volatile Agent: ${selectedAgent.toUpperCase()} (Dial: ${vaporizerDial}%, FA: ${patient.endTidalVolatilePercent}%, FI: ${patient.inspiredVolatilePercent}%)
Total MAC: ${patient.totalMac} (Depth: ${patient.depthState})
Fresh Gas Flow: ${mixerSettings.totalFgfLMin} L/min (O2: ${mixerSettings.o2FlowLMin} L, N2O: ${mixerSettings.n2oFlowLMin} L, Air: ${mixerSettings.airFlowLMin} L, Delivered FiO2: ${mixerSettings.deliveredFiO2Percent}%)
Circuit Mechanics:
- Mode: ${circuitMode.toUpperCase()}
- Rebreathing Fraction: ${(circuit.rebreathingFraction * 100).toFixed(0)}% (Time Constant tau: ${circuit.circuitTimeConstantMin.toFixed(1)} min)
- CO2 Absorber Exhaustion: ${circuit.absorberExhaustionPercent}% (${circuit.indicatorColor})
- Unidirectional Valve: ${circuit.unidirectionalValveIntact ? 'Normal' : 'INCOMPETENT / REBREATHING'}
- Y-Piece: ${circuit.yPieceConnected ? 'Connected' : 'DISCONNECTED / APNEA'}
- Pipeline O2 Pressure: ${circuit.pipelineO2PressurePsi} psi (E-Cylinder Backup: ${circuit.cylinderO2Open ? 'OPEN' : 'CLOSED'})
Patient Vitals:
- ETCO2: ${patient.etco2MmHg} mmHg | FiCO2: ${patient.fico2MmHg} mmHg
- SpO2: ${patient.spo2Percent}% | HR: ${patient.heartRateBpm} bpm | BP: ${patient.systolicBpMmHg}/75 mmHg
- Temperature: ${patient.temperatureC}°C | MH Active: ${patient.malignantHyperthermiaActive} (Dantrolene given: ${patient.dantroleneAdministeredMg} mg)
Active Alerts: ${alerts.map(a => a.message).join('; ') || 'None'}
Please explain the anesthetic circuit physics, gas wash-in dynamics, and emergency intervention algorithms.`;

    window.dispatchEvent(
      new CustomEvent('mediverse:open-ai-with-context', { detail: { context } })
    );
  };

  // Quick emergency actions
  const handleEmergencyFlush100O2 = () => {
    setO2Flow(10.0);
    setN2oFlow(0.0);
    setAirFlow(0.0);
    setVaporizerDial(0.0);
    setSelectedAgent('none');
  };

  const handleAdministerDantrolene = () => {
    setDantroleneGivenMg(prev => prev + dantroleneInfo.initialDoseMg);
  };

  const handleReplaceCanister = () => {
    setAbsorberExhaustion(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-6 flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-950/80 border border-amber-800/80 rounded-xl text-amber-400">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Anesthesia Delivery &amp; Vaporizer Workstation
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-900/60 border border-amber-700/60 text-amber-300 font-medium">
                Circle System &amp; Low Flow
              </span>
            </h1>
            <p className="text-sm text-slate-400">
              Fresh gas mixing, Link-25 hypoxic guard, age-adjusted MAC, circuit wash-in time constants, and crisis algorithms.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick 100% O2 Flush Button */}
          <button
            onClick={handleEmergencyFlush100O2}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-md shadow-emerald-950/40 flex items-center gap-1.5 transition"
          >
            <Wind className="w-4 h-4" />
            100% O₂ Flush (10 L/m)
          </button>

          <button
            onClick={handleAskAI}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-lg shadow-indigo-900/30 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Ask Socratic AI
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
          Select Clinical Anesthesia Scenario:
        </span>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {ANESTHESIA_PRESETS.map(preset => {
            const isSelected = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500 ring-1 ring-amber-500 shadow-md shadow-amber-950/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {preset.category}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <div className="font-semibold text-xs text-slate-100 line-clamp-1">{preset.name}</div>
                <div className="text-[11px] text-slate-400 line-clamp-1">{preset.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Alarm Annunciator Bar */}
      {alerts.length > 0 && (
        <div className="flex flex-col gap-2">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold ${
                alert.severity === 'CRITICAL'
                  ? 'bg-rose-950/90 border-rose-800 text-rose-200 animate-pulse'
                  : alert.severity === 'WARNING'
                  ? 'bg-amber-950/80 border-amber-800 text-amber-200'
                  : 'bg-cyan-950/80 border-cyan-800 text-cyan-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{alert.message}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/40 border border-white/10 uppercase">
                {alert.severity}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Primary HUD Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total MAC & Depth */}
        <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            Total MAC
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              patient.depthState === 'SURGICAL_ANESTHESIA'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : patient.depthState === 'SEDATED'
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}>
              {patient.depthState.replace('_', ' ')}
            </span>
          </div>
          <div className="text-xl font-bold text-white mt-1">
            {patient.totalMac} <span className="text-xs font-normal text-slate-400">MAC</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Target: 0.8 - 1.3 MAC
          </div>
        </div>

        {/* End-Tidal Volatile (FA) */}
        <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            Alveolar (FA)
            <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800 px-1.5 py-0.5 rounded">
              FA/FI: {patient.faFiRatio}
            </span>
          </div>
          <div className="text-xl font-bold text-amber-300 mt-1">
            {patient.endTidalVolatilePercent}% <span className="text-xs font-normal text-slate-400">ET</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Delivered FI: {patient.inspiredVolatilePercent}%
          </div>
        </div>

        {/* Delivered FiO2 & FGF */}
        <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            Delivered FiO₂
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              mixerSettings.deliveredFiO2Percent >= 25
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}>
              {mixerSettings.hypoxicGuardActive ? 'Guarded' : 'Safe'}
            </span>
          </div>
          <div className="text-xl font-bold text-white mt-1">
            {mixerSettings.deliveredFiO2Percent}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            FGF: {mixerSettings.totalFgfLMin} L/min (Reb: {(circuit.rebreathingFraction * 100).toFixed(0)}%)
          </div>
        </div>

        {/* Capnometry (ETCO2 & FiCO2) */}
        <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            Capnometry
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              patient.fico2MmHg > 2
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              FiCO₂: {patient.fico2MmHg}
            </span>
          </div>
          <div className={`text-xl font-bold mt-1 ${patient.etco2MmHg > 50 ? 'text-rose-400' : 'text-white'}`}>
            {patient.etco2MmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {patient.fico2MmHg > 2 ? 'Rebreathing Detected!' : 'Normal Alveolar CO₂'}
          </div>
        </div>

        {/* Circuit Time Constant (tau) */}
        <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            Wash-In (τ)
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-1.5 py-0.5 rounded">
              V/FGF
            </span>
          </div>
          <div className="text-xl font-bold text-white mt-1">
            {circuit.circuitTimeConstantMin} <span className="text-xs font-normal text-slate-400">min</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            95% Equil: {(circuit.circuitTimeConstantMin * 3).toFixed(1)} min
          </div>
        </div>

        {/* Patient Vitals */}
        <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            Patient Vitals
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              patient.temperatureC > 38.5
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : 'bg-slate-800 text-slate-300'
            }`}>
              {patient.temperatureC}°C
            </span>
          </div>
          <div className="text-xl font-bold text-white mt-1">
            {patient.heartRateBpm} <span className="text-xs font-normal text-slate-400">bpm</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            BP: {patient.systolicBpMmHg}/75 | SpO₂: {patient.spo2Percent}%
          </div>
        </div>
      </div>

      {/* Main Console Layout: Controls (Left) & Real-time Waveforms (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Machine Controls & Hardware Knobs (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Fresh Gas Flowmeter Panel */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                <Gauge className="w-4 h-4 text-cyan-400" />
                Gas Flowmeters (Link-25 Hypoxic Guard)
              </h2>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                Total FGF: {mixerSettings.totalFgfLMin} L/min
              </span>
            </div>

            {/* O2 Flow Knob */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Oxygen (O₂):
                </span>
                <span className="font-mono text-white">{mixerSettings.o2FlowLMin} L/min</span>
              </div>
              <input
                type="range"
                min={0.2}
                max={10.0}
                step={0.1}
                value={o2Flow}
                onChange={e => setO2Flow(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* N2O Flow Knob */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-blue-400 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Nitrous Oxide (N₂O):
                </span>
                <span className="font-mono text-white">{mixerSettings.n2oFlowLMin} L/min</span>
              </div>
              <input
                type="range"
                min={0.0}
                max={10.0}
                step={0.1}
                value={n2oFlow}
                onChange={e => setN2oFlow(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Air Flow Knob */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-amber-400 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medical Air:
                </span>
                <span className="font-mono text-white">{mixerSettings.airFlowLMin} L/min</span>
              </div>
              <input
                type="range"
                min={0.0}
                max={10.0}
                step={0.1}
                value={airFlow}
                onChange={e => setAirFlow(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          {/* Volatile Vaporizer Console */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                <Droplets className="w-4 h-4 text-amber-400" />
                Vaporizer Interlock &amp; Dial
              </h2>
              <span className="text-[10px] font-semibold text-slate-400">
                Age 40 MAC: {VOLATILE_AGENTS[selectedAgent].mac40Percent}%
              </span>
            </div>

            {/* Agent Select Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {(['sevoflurane', 'desflurane', 'isoflurane', 'none'] as VolatileAgentId[]).map(agentId => {
                const agent = VOLATILE_AGENTS[agentId];
                const isSelected = selectedAgent === agentId;
                return (
                  <button
                    key={agentId}
                    onClick={() => {
                      setSelectedAgent(agentId);
                      if (agentId === 'none') setVaporizerDial(0);
                      else if (agentId === 'desflurane') setVaporizerDial(6.0);
                      else if (agentId === 'sevoflurane') setVaporizerDial(2.2);
                      else if (agentId === 'isoflurane') setVaporizerDial(1.2);
                    }}
                    className={`p-2 rounded-lg border text-center transition flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'bg-slate-800 border-amber-400 ring-1 ring-amber-400 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: agent.colorHex }}
                    />
                    <span className="text-[11px] font-bold line-clamp-1">{agent.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Vaporizer Dial Knob */}
            {selectedAgent !== 'none' && (
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">
                    Vaporizer Dial Setting:
                  </span>
                  <span className="font-mono font-bold text-amber-300">{vaporizerDial}%</span>
                </div>
                <input
                  type="range"
                  min={0.0}
                  max={selectedAgent === 'desflurane' ? 18.0 : selectedAgent === 'sevoflurane' ? 8.0 : 5.0}
                  step={0.1}
                  value={vaporizerDial}
                  onChange={e => setVaporizerDial(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                {selectedAgent === 'desflurane' && (
                  <div className="p-2 rounded bg-blue-950/60 border border-blue-800/80 text-[11px] text-blue-300 flex items-center justify-between">
                    <span>Tec 6 Heated Vaporizer:</span>
                    <strong className="font-mono">39°C (2.0 atm / 1500 mmHg)</strong>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Circle System Hardware & Absorber Panel */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-indigo-400" />
                Circle System &amp; CO₂ Absorber
              </h2>
              <button
                onClick={handleReplaceCanister}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              >
                Replace Canister
              </button>
            </div>

            {/* Canister Exhaustion Meter */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">
                  Soda-Lime Canister Exhaustion:
                </span>
                <span className={`font-mono font-bold ${circuit.absorberExhaustionPercent > 50 ? 'text-purple-400' : 'text-slate-200'}`}>
                  {circuit.absorberExhaustionPercent}% ({circuit.indicatorColor} indicator)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700 flex">
                <div
                  className={`h-full transition-all duration-300 ${
                    circuit.absorberExhaustionPercent > 50 ? 'bg-purple-600' : 'bg-slate-200'
                  }`}
                  style={{ width: `${circuit.absorberExhaustionPercent}%` }}
                />
              </div>
            </div>

            {/* Hardware Toggles */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <button
                onClick={() => setYPieceConnected(!yPieceConnected)}
                className={`p-2 rounded-lg border text-center transition ${
                  yPieceConnected
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    : 'bg-rose-950 border-rose-700 text-rose-200 animate-pulse font-bold'
                }`}
              >
                Y-Piece: {yPieceConnected ? 'Connected' : 'DISCONNECTED!'}
              </button>

              <button
                onClick={() => setUnidirectionalValveOk(!unidirectionalValveOk)}
                className={`p-2 rounded-lg border text-center transition ${
                  unidirectionalValveOk
                    ? 'bg-slate-800 border-slate-700 text-slate-200'
                    : 'bg-amber-950 border-amber-700 text-amber-200 font-bold'
                }`}
              >
                Exp Valve: {unidirectionalValveOk ? 'Competent' : 'INCOMPETENT!'}
              </button>

              <button
                onClick={() => setCylinderOpen(!cylinderOpen)}
                className={`p-2 rounded-lg border text-center transition ${
                  cylinderOpen
                    ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300 font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                Backup O₂ Cylinder: {cylinderOpen ? 'OPEN (Active)' : 'CLOSED'}
              </button>

              <button
                onClick={() => setCircuitMode(circuitMode === 'ventilator' ? 'bag_manual' : 'ventilator')}
                className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-center transition hover:border-slate-600"
              >
                Mode: {circuitMode === 'ventilator' ? 'Ventilator' : 'Manual / Bag'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Waveforms & Clinical Curves (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Real-time Capnogram Waveform */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Real-Time Capnogram Waveform (ETCO₂ &amp; FiCO₂)
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-emerald-400">ETCO₂: {patient.etco2MmHg}</span>
                <span className="text-slate-500">|</span>
                <span className={patient.fico2MmHg > 2 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                  FiCO₂: {patient.fico2MmHg}
                </span>
              </div>
            </div>

            <div className="w-full h-44 bg-slate-950/90 rounded-xl p-2 border border-slate-800/80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={capnogramData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="timeSeconds" stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={t => `${t}s`} />
                  <YAxis stroke="#10b981" tick={{ fontSize: 10 }} domain={[0, 90]} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={40} stroke="#475569" strokeDasharray="3 3" label={{ value: '40 mmHg', fill: '#64748b', fontSize: 9 }} />
                  <Line type="monotone" dataKey="co2MmHg" name="PCO₂ (mmHg)" stroke="#10b981" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 px-1">
              <span>Phase I: Inspiratory Baseline</span>
              <span>Phase II: Expiratory Upstroke</span>
              <span>Phase III: Alveolar Plateau</span>
              <span>Phase IV: Rapid Inspiration</span>
            </div>
          </div>

          {/* Alveolar FA/FI Wash-In Uptake Kinetics Curve */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                Alveolar-to-Inspired Ratio (FA/FI) Wash-In Kinetics
              </h2>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-blue-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Desflurane (0.42)
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Sevoflurane (0.65)
                </span>
                <span className="flex items-center gap-1 text-purple-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-purple-500" /> Isoflurane (1.40)
                </span>
              </div>
            </div>

            <div className="w-full h-44 bg-slate-950/90 rounded-xl p-2 border border-slate-800/80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fafiCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="minute" stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={m => `${m}m`} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 1.0]} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={1.0} stroke="#475569" strokeDasharray="2 2" />
                  <Line type="monotone" dataKey="desflurane" name="Desflurane" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="sevoflurane" name="Sevoflurane" stroke="#eab308" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="isoflurane" name="Isoflurane" stroke="#a855f7" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed px-1">
              <strong>Solubility Inverse Law:</strong> Lower blood:gas solubility coefficient yields faster rise in FA/FI towards 1.0. Desflurane (0.42) achieves rapid equilibrium, while Isoflurane (1.40) is delayed by ongoing pulmonary capillary uptake into venous circulation.
            </p>
          </div>

          {/* Malignant Hyperthermia Protocol Box (if active) */}
          {patient.malignantHyperthermiaActive && (
            <div className="p-4 bg-rose-950/80 border border-rose-700 rounded-2xl flex flex-col gap-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  MALIGNANT HYPERTHERMIA CRISIS MANAGEMENT
                </div>
                <span className="text-[11px] bg-rose-900/80 border border-rose-600 px-2 py-0.5 rounded font-mono text-white">
                  Dantrolene given: {patient.dantroleneAdministeredMg} mg
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 bg-black/40 rounded border border-rose-900/60">
                  <span className="text-slate-400 block">Initial Dose (2.5 mg/kg):</span>
                  <strong className="text-white text-sm">{dantroleneInfo.initialDoseMg} mg</strong>
                </div>
                <div className="p-2 bg-black/40 rounded border border-rose-900/60">
                  <span className="text-slate-400 block">Vials (20 mg/vial):</span>
                  <strong className="text-white text-sm">{dantroleneInfo.initialVialsCount} vials</strong>
                </div>
                <div className="p-2 bg-black/40 rounded border border-rose-900/60">
                  <span className="text-slate-400 block">Sterile Water (60 mL/vial):</span>
                  <strong className="text-white text-sm">{dantroleneInfo.reconstitutionWaterMl} mL</strong>
                </div>
                <div className="p-2 bg-black/40 rounded border border-rose-900/60">
                  <span className="text-slate-400 block">Max Repeat Dose (10 mg/kg):</span>
                  <strong className="text-white text-sm">{dantroleneInfo.maxDoseMg} mg</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAdministerDantrolene}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
                >
                  <Droplets className="w-4 h-4" />
                  Administer Dantrolene 2.5 mg/kg IV Push
                </button>
                <button
                  onClick={handleEmergencyFlush100O2}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition"
                >
                  Turn Off Volatile &amp; Flush 10 L/m
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Custom Tooltip for Recharts
 */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="p-2.5 bg-slate-900/95 border border-slate-700 rounded-lg shadow-xl text-[11px] flex flex-col gap-1">
      <div className="text-slate-400 font-semibold border-b border-slate-800 pb-1">
        X: {label}
      </div>
      {payload.map((p: any, idx: number) => (
        <div key={idx} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            {p.name}:
          </span>
          <span className="font-bold text-slate-100">{p.value}</span>
        </div>
      ))}
    </div>
  );
}
