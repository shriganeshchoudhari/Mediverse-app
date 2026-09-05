'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Activity,
  Heart,
  Droplets,
  Thermometer,
  ShieldAlert,
  AlertTriangle,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Sliders,
  Maximize2,
  CheckCircle2,
  X,
  Gauge,
  Wind,
  Stethoscope,
  Filter,
} from 'lucide-react';
import {
  IcuBed,
  TelemetryAlarm,
  IcuUnit,
  BedInterventionType,
  CardiacRhythmType,
  SEEDED_ICU_BEDS,
  evaluateBedAlarms,
  applyBedIntervention,
  calculateMap,
  generateEcgWaveform,
  generatePlethWaveform,
  generateArtLineWaveform,
} from '../../.gemini/skills/IcuTelemetryEngine';

export default function MultiBedIcuCentralStation() {
  // State
  const [beds, setBeds] = useState<IcuBed[]>(() =>
    SEEDED_ICU_BEDS.map((bed) => ({
      ...bed,
      activeAlarms: evaluateBedAlarms(bed),
      waveformSamples: {
        ecg: [...bed.waveformSamples.ecg],
        pleth: [...bed.waveformSamples.pleth],
        art: [...bed.waveformSamples.art],
      },
    }))
  );

  const [selectedUnit, setSelectedUnit] = useState<IcuUnit | 'ALL'>('ALL');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [masterSilenceSeconds, setMasterSilenceSeconds] = useState<number>(0);
  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(true);

  // Modals
  const [selectedBedForStrip, setSelectedBedForStrip] = useState<IcuBed | null>(null);
  const [selectedBedForLimits, setSelectedBedForLimits] = useState<IcuBed | null>(null);
  const [selectedBedForRx, setSelectedBedForRx] = useState<IcuBed | null>(null);
  const [lastInterventionMessage, setLastInterventionMessage] = useState<string | null>(null);

  // Caliper state in 6-second strip modal
  const [caliperStartMs, setCaliperStartMs] = useState<number>(120);
  const [caliperEndMs, setCaliperEndMs] = useState<number>(280);

  // Web Audio Context ref for synthesized telemetry beeps
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playAlarmTone = (frequency = 880, type: OscillatorType = 'sine') => {
    if (isAudioMuted || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current && AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current) {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.15);
      }
    } catch {
      // AudioContext unavailable or restricted
    }
  };

  // Waveform Sweep and Silence Timer Loop
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      setBeds((prevBeds) =>
        prevBeds.map((bed) => {
          // Circular rotation of waveform points for continuous oscilloscope sweep
          const ecgLen = bed.waveformSamples.ecg.length;
          const plethLen = bed.waveformSamples.pleth.length;
          const artLen = bed.waveformSamples.art.length;

          const ecgStep = 3;
          const nextEcg = [
            ...bed.waveformSamples.ecg.slice(ecgStep),
            ...bed.waveformSamples.ecg.slice(0, ecgStep),
          ];

          const plethStep = 2;
          const nextPleth = [
            ...bed.waveformSamples.pleth.slice(plethStep),
            ...bed.waveformSamples.pleth.slice(0, plethStep),
          ];

          const artStep = 2;
          const nextArt = [
            ...bed.waveformSamples.art.slice(artStep),
            ...bed.waveformSamples.art.slice(0, artStep),
          ];

          const updatedSilenceSec = Math.max(0, bed.silenceRemainingSeconds - 0.2);
          const isSilenced = updatedSilenceSec > 0 || masterSilenceSeconds > 0;

          return {
            ...bed,
            isSilenced,
            silenceRemainingSeconds: updatedSilenceSec,
            waveformSamples: {
              ecg: nextEcg.length === ecgLen ? nextEcg : bed.waveformSamples.ecg,
              pleth: nextPleth.length === plethLen ? nextPleth : bed.waveformSamples.pleth,
              art: nextArt.length === artLen ? nextArt : bed.waveformSamples.art,
            },
          };
        })
      );
    }, 200);

    return () => clearInterval(interval);
  }, [isSimulationRunning, masterSilenceSeconds]);

  // Master Silence Countdown Timer
  useEffect(() => {
    if (masterSilenceSeconds <= 0) return;
    const timer = setInterval(() => {
      setMasterSilenceSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [masterSilenceSeconds]);

  // Audio crisis alarm pulse
  useEffect(() => {
    if (isAudioMuted || masterSilenceSeconds > 0) return;

    const hasCrisisAlarm = beds.some(
      (b) => !b.isSilenced && b.activeAlarms.some((a) => a.level === 'CRISIS')
    );

    if (hasCrisisAlarm) {
      const alarmBeep = setInterval(() => {
        playAlarmTone(920, 'square');
      }, 1200);
      return () => clearInterval(alarmBeep);
    }
  }, [beds, isAudioMuted, masterSilenceSeconds]);

  // Derived filter & counters
  const filteredBeds = useMemo(() => {
    if (selectedUnit === 'ALL') return beds;
    return beds.filter((b) => b.unit === selectedUnit);
  }, [beds, selectedUnit]);

  const totalCrisisCount = useMemo(() => {
    return beds.reduce(
      (acc, b) => acc + b.activeAlarms.filter((a) => a.level === 'CRISIS').length,
      0
    );
  }, [beds]);

  const totalWarningCount = useMemo(() => {
    return beds.reduce(
      (acc, b) => acc + b.activeAlarms.filter((a) => a.level === 'WARNING').length,
      0
    );
  }, [beds]);

  // Bed Actions
  const handleSilenceBed = (bedId: string) => {
    setBeds((prev) =>
      prev.map((b) =>
        b.bedId === bedId
          ? { ...b, isSilenced: true, silenceRemainingSeconds: 120 }
          : b
      )
    );
  };

  const handleMasterSilence = () => {
    setMasterSilenceSeconds(120);
    setBeds((prev) =>
      prev.map((b) => ({ ...b, isSilenced: true, silenceRemainingSeconds: 120 }))
    );
  };

  const handleExecuteIntervention = (bedId: string, intervention: BedInterventionType) => {
    const targetBed = beds.find((b) => b.bedId === bedId);
    if (!targetBed) return;

    const { updatedBed, resultMessage } = applyBedIntervention(targetBed, intervention);
    setLastInterventionMessage(resultMessage);

    setBeds((prev) => prev.map((b) => (b.bedId === bedId ? updatedBed : b)));
    if (selectedBedForRx && selectedBedForRx.bedId === bedId) {
      setSelectedBedForRx(updatedBed);
    }
    if (selectedBedForStrip && selectedBedForStrip.bedId === bedId) {
      setSelectedBedForStrip(updatedBed);
    }
  };

  const handleSaveLimits = (
    bedId: string,
    newLimits: {
      hrHigh: number;
      hrLow: number;
      sbpHigh: number;
      sbpLow: number;
      spo2Low: number;
      rrHigh: number;
      rrLow: number;
    }
  ) => {
    setBeds((prev) =>
      prev.map((b) => {
        if (b.bedId !== bedId) return b;
        const updated: IcuBed = { ...b, alarmLimits: newLimits };
        updated.activeAlarms = evaluateBedAlarms(updated);
        return updated;
      })
    );
    setSelectedBedForLimits(null);
  };

  const handleResetAllBeds = () => {
    setBeds(
      SEEDED_ICU_BEDS.map((bed) => ({
        ...bed,
        activeAlarms: evaluateBedAlarms(bed),
        waveformSamples: {
          ecg: [...bed.waveformSamples.ecg],
          pleth: [...bed.waveformSamples.pleth],
          art: [...bed.waveformSamples.art],
        },
      }))
    );
    setLastInterventionMessage('All ICU telemetry beds reset to initial clinical baseline.');
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-6 space-y-6">
      {/* Central Command Header */}
      <header className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-950/60 border border-rose-600/40 rounded-xl relative">
            <Activity className="w-6 h-6 text-rose-400 animate-pulse" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-50">
                ICU Central Telemetry Station
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-indigo-950 text-indigo-400 border border-indigo-700/50 rounded-full">
                Level 1 Trauma ICU
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-400">
              Continuous multi-lead physiological sweeps, automated crisis thresholds & bedside therapeutics
            </p>
          </div>
        </div>

        {/* Global Controls & Alarm Metrics */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {/* Crisis Count */}
          <div
            data-testid="crisis-counter"
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition ${
              totalCrisisCount > 0
                ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>CRISIS: {totalCrisisCount}</span>
          </div>

          {/* Warning Count */}
          <div
            data-testid="warning-counter"
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition ${
              totalWarningCount > 0
                ? 'bg-amber-950/80 border-amber-600 text-amber-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>WARNING: {totalWarningCount}</span>
          </div>

          {/* Master Silence Button */}
          <button
            onClick={handleMasterSilence}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition ${
              masterSilenceSeconds > 0
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
          >
            {masterSilenceSeconds > 0 ? (
              <>
                <BellOff className="w-4 h-4 text-amber-400" />
                <span>Silenced ({masterSilenceSeconds}s)</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 text-slate-400" />
                <span>Silence All (120s)</span>
              </>
            )}
          </button>

          {/* Audio Alert Toggle */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`p-2 rounded-xl border transition ${
              isAudioMuted
                ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                : 'bg-indigo-900/60 border-indigo-600 text-indigo-300'
            }`}
            title={isAudioMuted ? 'Unmute Alarms' : 'Mute Alarms'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Pause / Resume */}
          <button
            onClick={() => setIsSimulationRunning(!isSimulationRunning)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
            title={isSimulationRunning ? 'Pause Waveform Sweeps' : 'Resume Waveform Sweeps'}
          >
            {isSimulationRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Reset Baseline */}
          <button
            onClick={handleResetAllBeds}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
            title="Reset All Beds to Baseline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Intervention Status Toast */}
      {lastInterventionMessage && (
        <div className="bg-emerald-950/80 border border-emerald-600/60 rounded-xl p-3 px-4 flex items-center justify-between text-xs md:text-sm text-emerald-200 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{lastInterventionMessage}</span>
          </div>
          <button
            onClick={() => setLastInterventionMessage(null)}
            className="text-emerald-400 hover:text-emerald-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Unit Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-slate-500 mr-1 flex-shrink-0" />
        {(['ALL', 'CCU', 'MICU', 'SICU', 'NEURO_ICU'] as const).map((unit) => (
          <button
            key={unit}
            onClick={() => setSelectedUnit(unit)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex-shrink-0 ${
              selectedUnit === unit
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            {unit === 'ALL' ? 'All Units (6 Beds)' : unit}
          </button>
        ))}
      </div>

      {/* Multi-Bed Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredBeds.map((bed) => {
          const crisisAlarm = bed.activeAlarms.find((a) => a.level === 'CRISIS');
          const warningAlarm = bed.activeAlarms.find((a) => a.level === 'WARNING');
          const hasAlarms = bed.activeAlarms.length > 0;

          return (
            <div
              key={bed.bedId}
              data-testid={`bed-card-${bed.bedId}`}
              className={`bg-slate-900 rounded-2xl border transition-all duration-200 shadow-2xl flex flex-col overflow-hidden ${
                crisisAlarm && !bed.isSilenced
                  ? 'border-rose-500 ring-2 ring-rose-500/50 shadow-rose-950/50'
                  : warningAlarm && !bed.isSilenced
                  ? 'border-amber-500 ring-1 ring-amber-500/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Bed Header */}
              <div className="p-3.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono font-bold text-sm px-2 py-0.5 rounded-md bg-slate-800 text-slate-100 border border-slate-700">
                    {bed.bedId}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 font-semibold border border-indigo-800/40">
                    {bed.unit}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-100 truncate">{bed.patientName}</h3>
                    <p className="text-[11px] text-slate-400 truncate">
                      {bed.age}y {bed.gender} • {bed.mrn} • {bed.diagnosis}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleSilenceBed(bed.bedId)}
                    className={`p-1.5 rounded-lg border text-xs transition ${
                      bed.isSilenced
                        ? 'bg-amber-950/80 border-amber-600 text-amber-300'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400'
                    }`}
                    title={
                      bed.isSilenced
                        ? `Silenced (${Math.round(bed.silenceRemainingSeconds)}s)`
                        : 'Silence Alarm (120s)'
                    }
                  >
                    {bed.isSilenced ? (
                      <BellOff className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Bell className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Active Alarm Banner */}
              {hasAlarms && (
                <div
                  className={`px-3 py-1.5 text-xs font-bold flex items-center justify-between ${
                    crisisAlarm && !bed.isSilenced
                      ? 'bg-rose-950 border-b border-rose-800 text-rose-200 animate-pulse'
                      : warningAlarm && !bed.isSilenced
                      ? 'bg-amber-950 border-b border-amber-800 text-amber-200'
                      : 'bg-slate-800 border-b border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {crisisAlarm ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    )}
                    <span className="truncate">
                      {(crisisAlarm || warningAlarm)?.title} (
                      {(crisisAlarm || warningAlarm)?.parameter}:{' '}
                      {(crisisAlarm || warningAlarm)?.currentValue})
                    </span>
                  </div>
                  {bed.isSilenced && (
                    <span className="text-[10px] text-amber-300 uppercase tracking-wider font-mono">
                      Silenced
                    </span>
                  )}
                </div>
              )}

              {/* Waveform Canvas & Parameter Tile Split View */}
              <div className="p-3 grid grid-cols-12 gap-3 flex-1">
                {/* Real-time Oscilloscope SVG Sweeps (Cols 8) */}
                <div className="col-span-8 bg-slate-950 rounded-xl p-2 border border-slate-800/80 flex flex-col justify-between space-y-2 relative overflow-hidden font-mono">
                  {/* Subtle Grid overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
                      backgroundSize: '16px 16px',
                    }}
                  />

                  {/* ECG Sweep (Lead II) */}
                  <div className="relative">
                    <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold mb-0.5">
                      <span>II (25mm/s)</span>
                      <span>{bed.rhythm.replace(/_/g, ' ')}</span>
                    </div>
                    <svg
                      className="w-full h-12 overflow-visible"
                      viewBox="0 0 120 40"
                      preserveAspectRatio="none"
                    >
                      <polyline
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                        points={bed.waveformSamples.ecg
                          .map((val, i) => {
                            // Scale val (-0.3 to 1.5) into 0-40 SVG Y coordinate
                            const y = 30 - val * 16;
                            return `${i},${Math.max(2, Math.min(38, y))}`;
                          })
                          .join(' ')}
                      />
                    </svg>
                  </div>

                  {/* Pleth Sweep (SpO2) */}
                  <div className="relative border-t border-slate-800/60 pt-1">
                    <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold mb-0.5">
                      <span>PLETH</span>
                      <span>SpO2 {bed.vitals.spO2}%</span>
                    </div>
                    <svg
                      className="w-full h-9 overflow-visible"
                      viewBox="0 0 120 30"
                      preserveAspectRatio="none"
                    >
                      <polyline
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        points={bed.waveformSamples.pleth
                          .map((val, i) => {
                            // Scale val (0 to 1.0) into 0-30 SVG Y coordinate
                            const y = 26 - val * 22;
                            return `${i},${Math.max(2, Math.min(28, y))}`;
                          })
                          .join(' ')}
                      />
                    </svg>
                  </div>

                  {/* Arterial Line Sweep (BP) */}
                  <div className="relative border-t border-slate-800/60 pt-1">
                    <div className="flex items-center justify-between text-[10px] text-rose-400 font-bold mb-0.5">
                      <span>ART LINE</span>
                      <span>
                        {bed.vitals.systolicBp}/{bed.vitals.diastolicBp} ({bed.vitals.meanArterialPressure})
                      </span>
                    </div>
                    <svg
                      className="w-full h-9 overflow-visible"
                      viewBox="0 0 120 30"
                      preserveAspectRatio="none"
                    >
                      <polyline
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        points={bed.waveformSamples.art
                          .map((val, i) => {
                            // Scale val (40-200 mmHg) into 0-30 SVG Y
                            const norm = (val - 40) / 160;
                            const y = 27 - norm * 24;
                            return `${i},${Math.max(2, Math.min(28, y))}`;
                          })
                          .join(' ')}
                      />
                    </svg>
                  </div>
                </div>

                {/* Digital Vitals Readouts (Cols 4) */}
                <div className="col-span-4 flex flex-col justify-between space-y-2">
                  {/* Heart Rate Tile */}
                  <div
                    className={`p-2 rounded-xl border flex flex-col justify-center ${
                      bed.vitals.heartRate > bed.alarmLimits.hrHigh ||
                      bed.vitals.heartRate < bed.alarmLimits.hrLow
                        ? 'bg-rose-950/60 border-rose-600/70 text-rose-300'
                        : 'bg-slate-950/80 border-slate-800 text-emerald-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-400" /> HR
                      </span>
                      <span>bpm</span>
                    </div>
                    <div className="text-2xl font-black font-mono leading-none tracking-tight mt-1">
                      {bed.vitals.heartRate}
                    </div>
                  </div>

                  {/* Blood Pressure Tile */}
                  <div
                    className={`p-2 rounded-xl border flex flex-col justify-center ${
                      bed.vitals.meanArterialPressure < 65 ||
                      bed.vitals.systolicBp > bed.alarmLimits.sbpHigh
                        ? 'bg-rose-950/60 border-rose-600/70 text-rose-300'
                        : 'bg-slate-950/80 border-slate-800 text-rose-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                      <span className="flex items-center gap-1">
                        <Gauge className="w-3 h-3 text-rose-400" /> NIBP/ART
                      </span>
                      <span>mmHg</span>
                    </div>
                    <div className="text-sm font-black font-mono leading-none mt-1">
                      {bed.vitals.systolicBp}/{bed.vitals.diastolicBp}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      MAP ({bed.vitals.meanArterialPressure})
                    </div>
                  </div>

                  {/* SpO2 Tile */}
                  <div
                    className={`p-2 rounded-xl border flex flex-col justify-center ${
                      bed.vitals.spO2 < bed.alarmLimits.spo2Low
                        ? 'bg-rose-950/60 border-rose-600/70 text-rose-300'
                        : 'bg-slate-950/80 border-slate-800 text-cyan-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-cyan-400" /> SpO2
                      </span>
                      <span>%</span>
                    </div>
                    <div className="text-xl font-black font-mono leading-none tracking-tight mt-1">
                      {bed.vitals.spO2}
                    </div>
                  </div>

                  {/* Respiratory Rate Tile */}
                  <div
                    className={`p-2 rounded-xl border flex flex-col justify-center ${
                      bed.vitals.respRate > bed.alarmLimits.rrHigh ||
                      bed.vitals.respRate < bed.alarmLimits.rrLow
                        ? 'bg-amber-950/60 border-amber-600/70 text-amber-300'
                        : 'bg-slate-950/80 border-slate-800 text-amber-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                      <span className="flex items-center gap-1">
                        <Wind className="w-3 h-3 text-amber-400" /> RR
                      </span>
                      <span>/min</span>
                    </div>
                    <div className="text-lg font-black font-mono leading-none tracking-tight mt-0.5">
                      {bed.vitals.respRate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bed Action Bar */}
              <div className="p-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => setSelectedBedForStrip(bed)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>6s Strip</span>
                </button>

                <button
                  onClick={() => setSelectedBedForLimits(bed)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Limits</span>
                </button>

                <button
                  onClick={() => setSelectedBedForRx(bed)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-rose-950/80 hover:bg-rose-900/80 border border-rose-700/60 text-rose-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Zap className="w-3.5 h-3.5 text-rose-400" />
                  <span>Bedside Rx</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 6-SECOND RHYTHM STRIP CALIPER MODAL */}
      {selectedBedForStrip && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-5 md:p-6 space-y-5 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-950/80 border border-indigo-700/50 rounded-xl">
                  <Activity className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-100">
                    6-Second Diagnostic Caliper Strip • {selectedBedForStrip.bedId} (
                    {selectedBedForStrip.patientName})
                  </h2>
                  <p className="text-xs text-slate-400">
                    Standard Lead II • 25 mm/s • 10 mm/mV • High-Resolution Caliper Measurement
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBedForStrip(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Diagnostic ECG Caliper Paper Surface */}
            <div className="p-4 rounded-xl bg-[#0f172a] border border-emerald-900/60 relative overflow-hidden font-mono">
              {/* Authentic 5mm Pink/Green Grid */}
              <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #059669 1px, transparent 1px), linear-gradient(to bottom, #059669 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none opacity-15"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                }}
              />

              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                  <span>Lead II (Diagnostic Continuous)</span>
                  <span>Rhythm: {selectedBedForStrip.rhythm.replace(/_/g, ' ')}</span>
                  <span>HR: {selectedBedForStrip.vitals.heartRate} bpm</span>
                </div>

                {/* Strip SVG */}
                <svg
                  className="w-full h-36 overflow-visible"
                  viewBox="0 0 480 80"
                  preserveAspectRatio="none"
                >
                  {/* Caliper Region Highlight */}
                  <rect
                    x={caliperStartMs}
                    y="0"
                    width={Math.max(5, caliperEndMs - caliperStartMs)}
                    height="80"
                    fill="#38bdf8"
                    opacity="0.15"
                  />
                  {/* Caliper Boundaries */}
                  <line
                    x1={caliperStartMs}
                    y1="0"
                    x2={caliperStartMs}
                    y2="80"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  <line
                    x1={caliperEndMs}
                    y1="0"
                    x2={caliperEndMs}
                    y2="80"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />

                  {/* ECG Curve duplicated over 4 cycles for 6-sec strip */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    points={[
                      ...selectedBedForStrip.waveformSamples.ecg,
                      ...selectedBedForStrip.waveformSamples.ecg,
                      ...selectedBedForStrip.waveformSamples.ecg,
                      ...selectedBedForStrip.waveformSamples.ecg,
                    ]
                      .slice(0, 480)
                      .map((val, i) => {
                        const y = 50 - val * 26;
                        return `${i},${Math.max(4, Math.min(76, y))}`;
                      })
                      .join(' ')}
                  />
                </svg>
              </div>
            </div>

            {/* Caliper Sliders & Telemetry Interval Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Electronic Caliper Controls
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Caliper Cursor A:</span>
                    <span className="font-mono text-cyan-400">{caliperStartMs} ms</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="400"
                    value={caliperStartMs}
                    onChange={(e) => setCaliperStartMs(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Caliper Cursor B:</span>
                    <span className="font-mono text-cyan-400">{caliperEndMs} ms</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="470"
                    value={caliperEndMs}
                    onChange={(e) => setCaliperEndMs(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </div>

              {/* Calculated Interval Diagnostic Panel */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Caliper Telemetry Measurements
                </h4>
                {(() => {
                  const measuredSpanMs = Math.abs(caliperEndMs - caliperStartMs);
                  const rrSeconds = 60 / selectedBedForStrip.vitals.heartRate;
                  const estimatedQtc = Math.round(measuredSpanMs / Math.sqrt(rrSeconds));

                  return (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span className="text-slate-400">Caliper Calibrated Width:</span>
                        <span className="font-mono font-bold text-cyan-300">{measuredSpanMs} ms</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span className="text-slate-400">Bazett QTc (if QT measured):</span>
                        <span
                          className={`font-mono font-bold ${
                            estimatedQtc > 480 ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {estimatedQtc} ms {estimatedQtc > 480 ? '(PROLONGED)' : '(NORMAL)'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span className="text-slate-400">RR Interval:</span>
                        <span className="font-mono font-bold text-slate-200">
                          {Math.round(rrSeconds * 1000)} ms
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 italic pt-1">
                        Align calipers over PR (norm 120-200ms), QRS (norm 80-120ms), or QT segment (norm &lt; 450ms).
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ALARM THRESHOLDS MODAL */}
      {selectedBedForLimits && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 md:p-6 space-y-5 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-slate-100">
                  Alarm Limits • {selectedBedForLimits.bedId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBedForLimits(null)}
                className="text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Threshold Inputs */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSaveLimits(selectedBedForLimits.bedId, {
                  hrHigh: Number(formData.get('hrHigh')),
                  hrLow: Number(formData.get('hrLow')),
                  sbpHigh: Number(formData.get('sbpHigh')),
                  sbpLow: Number(formData.get('sbpLow')),
                  spo2Low: Number(formData.get('spo2Low')),
                  rrHigh: Number(formData.get('rrHigh')),
                  rrLow: Number(formData.get('rrLow')),
                });
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">HR High (bpm)</label>
                  <input
                    name="hrHigh"
                    type="number"
                    defaultValue={selectedBedForLimits.alarmLimits.hrHigh}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">HR Low (bpm)</label>
                  <input
                    name="hrLow"
                    type="number"
                    defaultValue={selectedBedForLimits.alarmLimits.hrLow}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">SBP High (mmHg)</label>
                  <input
                    name="sbpHigh"
                    type="number"
                    defaultValue={selectedBedForLimits.alarmLimits.sbpHigh}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">SBP Low (mmHg)</label>
                  <input
                    name="sbpLow"
                    type="number"
                    defaultValue={selectedBedForLimits.alarmLimits.sbpLow}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">SpO2 Low (%)</label>
                  <input
                    name="spo2Low"
                    type="number"
                    defaultValue={selectedBedForLimits.alarmLimits.spo2Low}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">RR High (/min)</label>
                  <input
                    name="rrHigh"
                    type="number"
                    defaultValue={selectedBedForLimits.alarmLimits.rrHigh}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">RR Low (/min)</label>
                  <input
                    name="rrLow"
                    type="number"
                    defaultValue={selectedBedForLimits.alarmLimits.rrLow}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBedForLimits(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
                >
                  Save Limits
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BEDSIDE EMERGENCY INTERVENTIONS MODAL */}
      {selectedBedForRx && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 md:p-6 space-y-5 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-rose-400" />
                <div>
                  <h3 className="text-lg font-bold text-slate-100">
                    Bedside Emergency Rx • {selectedBedForRx.bedId}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedBedForRx.patientName} • {selectedBedForRx.diagnosis}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBedForRx(null)}
                className="text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Bed State Snippet */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-400">Rhythm: </span>
                <span className="text-rose-400 font-bold">{selectedBedForRx.rhythm}</span>
              </div>
              <div>
                <span className="text-slate-400">HR: </span>
                <span className="text-emerald-400 font-bold">
                  {selectedBedForRx.vitals.heartRate} bpm
                </span>
              </div>
              <div>
                <span className="text-slate-400">BP: </span>
                <span className="text-slate-200 font-bold">
                  {selectedBedForRx.vitals.systolicBp}/{selectedBedForRx.vitals.diastolicBp} (
                  {selectedBedForRx.vitals.meanArterialPressure})
                </span>
              </div>
              <div>
                <span className="text-slate-400">SpO2: </span>
                <span className="text-cyan-400 font-bold">{selectedBedForRx.vitals.spO2}%</span>
              </div>
            </div>

            {/* Action Cards */}
            <div className="space-y-2.5">
              {/* Defib 200J */}
              <button
                onClick={() => handleExecuteIntervention(selectedBedForRx.bedId, 'defibrillate_200j')}
                className="w-full text-left p-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 transition group flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-rose-950 border border-rose-700 text-rose-400 group-hover:scale-105 transition flex-shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-rose-200">
                    200J Biphasic Defibrillation / Synchronized Shock
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Deliver synchronized or asynchronous countershock for Ventricular Fibrillation or Pulseless VT.
                  </div>
                </div>
              </button>

              {/* Atropine 1mg */}
              <button
                onClick={() => handleExecuteIntervention(selectedBedForRx.bedId, 'atropine_1mg')}
                className="w-full text-left p-3 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/60 transition group flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-indigo-950 border border-indigo-700 text-indigo-400 group-hover:scale-105 transition flex-shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-indigo-200">
                    Atropine Sulfate 1 mg IV Push
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Vagolytic muscarinic antagonist for severe symptomatic bradycardia or 2nd/3rd degree AV block.
                  </div>
                </div>
              </button>

              {/* Norepinephrine Infusion */}
              <button
                onClick={() =>
                  handleExecuteIntervention(selectedBedForRx.bedId, 'norepinephrine_titrate')
                }
                className="w-full text-left p-3 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 transition group flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-amber-950 border border-amber-700 text-amber-400 group-hover:scale-105 transition flex-shrink-0">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-200">
                    Norepinephrine Infusion (Titrate +0.08 mcg/kg/min)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Alpha-1 vasoconstrictor to restore peripheral vascular resistance and maintain MAP &gt; 65 mmHg in septic/distributive shock.
                  </div>
                </div>
              </button>

              {/* Amiodarone 150mg */}
              <button
                onClick={() =>
                  handleExecuteIntervention(selectedBedForRx.bedId, 'amiodarone_150mg')
                }
                className="w-full text-left p-3 rounded-xl bg-violet-950/40 hover:bg-violet-900/60 border border-violet-800/60 transition group flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-violet-950 border border-violet-700 text-violet-400 group-hover:scale-105 transition flex-shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-violet-200">
                    Amiodarone 150 mg IV Bolus over 10 Minutes
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Class III potassium-channel blocker for sustained VTach or rapid refractory Atrial Fibrillation.
                  </div>
                </div>
              </button>

              {/* 1000mL Crystalloid */}
              <button
                onClick={() =>
                  handleExecuteIntervention(selectedBedForRx.bedId, 'crystalloid_bolus_1000ml')
                }
                className="w-full text-left p-3 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 border border-sky-800/60 transition group flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-sky-950 border border-sky-700 text-sky-400 group-hover:scale-105 transition flex-shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-sky-200">
                    1,000 mL Balanced Crystalloid (Plasma-Lyte) IV Bolus
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Preload resuscitation for hypovolemic or hemorrhagic hypotension with low CVP.
                  </div>
                </div>
              </button>

              {/* 100% FiO2 */}
              <button
                onClick={() =>
                  handleExecuteIntervention(selectedBedForRx.bedId, 'oxygen_titrate_100')
                }
                className="w-full text-left p-3 rounded-xl bg-teal-950/40 hover:bg-teal-900/60 border border-teal-800/60 transition group flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-teal-950 border border-teal-700 text-teal-400 group-hover:scale-105 transition flex-shrink-0">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-teal-200">
                    Titrate FiO2 to 100% + PEEP Optimization
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Emergency ventilatory rescue for acute hypoxemic desaturation in ARDS or aspiration.
                  </div>
                </div>
              </button>

              {/* CPR Chest Compressions */}
              <button
                onClick={() =>
                  handleExecuteIntervention(selectedBedForRx.bedId, 'cpr_chest_compressions')
                }
                className="w-full text-left p-3 rounded-xl bg-red-950/50 hover:bg-red-900/70 border border-red-800 transition group flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-red-950 border border-red-700 text-red-400 group-hover:scale-105 transition flex-shrink-0">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-red-200">
                    Initiate High-Quality CPR Chest Compressions
                  </div>
                  <div className="text-[11px] text-slate-400">
                    100-120 compressions/min, 5-6 cm depth, complete recoil for Asystole or PEA arrest.
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
