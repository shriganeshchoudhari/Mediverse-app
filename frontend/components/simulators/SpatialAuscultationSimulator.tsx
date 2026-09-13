"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Stethoscope,
  Activity,
  Volume2,
  VolumeX,
  Play,
  Square,
  Compass,
  Sliders,
  Info,
  CheckCircle2,
  ShieldCheck,
  Zap,
  RotateCcw,
  BookOpen,
  Table,
  Wind,
  Heart
} from 'lucide-react';
import {
  AUSCULTATION_LANDMARKS,
  AUSCULTATION_PRESETS,
  AuscultationLandmark,
  AuscultationPreset,
  DynamicManeuver,
  calculateSpatialAttenuation,
  evaluateDynamicManeuver,
  synthesizePcgEcgWaveform
} from '../../.gemini/skills/SpatialAuscultationEngine';

export default function SpatialAuscultationSimulator() {
  const presets = AUSCULTATION_PRESETS;
  const [selectedPresetId, setSelectedPresetId] = useState<string>(presets[0].id);
  const currentPreset = useMemo(
    () => presets.find(p => p.id === selectedPresetId) || presets[0],
    [presets, selectedPresetId]
  );

  const [activeTab, setActiveTab] = useState<'stethoscope' | 'acoustic-notes' | 'maneuver-matrix'>('stethoscope');

  // Stethoscope location state (percentages of chest)
  const defaultLandmark = useMemo(
    () => AUSCULTATION_LANDMARKS.find(l => l.id === currentPreset.keyAuscultationSite) || AUSCULTATION_LANDMARKS[0],
    [currentPreset]
  );
  const [stethPos, setStethPos] = useState<{ x: number; y: number }>({
    x: defaultLandmark.x,
    y: defaultLandmark.y
  });
  const [activeLandmarkId, setActiveLandmarkId] = useState<string>(defaultLandmark.id);

  // Chestpiece state
  const [chestpiece, setChestpiece] = useState<'bell' | 'diaphragm'>(currentPreset.optimalChestpiece);
  // Dynamic maneuver state
  const [maneuver, setManeuver] = useState<DynamicManeuver>('normal');

  // Audio synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioTimerRef = useRef<any>(null);

  // Sync default landmark on preset change
  useEffect(() => {
    const l = AUSCULTATION_LANDMARKS.find(item => item.id === currentPreset.keyAuscultationSite) || AUSCULTATION_LANDMARKS[0];
    setStethPos({ x: l.x, y: l.y });
    setActiveLandmarkId(l.id);
    setChestpiece(currentPreset.optimalChestpiece);
    setManeuver('normal');
  }, [currentPreset]);

  // Calculate nearest landmark and spatial attenuation
  const { nearestLandmark, spatialAttenuation } = useMemo(() => {
    let nearest = AUSCULTATION_LANDMARKS[0];
    let maxAtt = 0;

    for (const lm of AUSCULTATION_LANDMARKS) {
      const att = calculateSpatialAttenuation({ x: lm.x, y: lm.y }, stethPos);
      if (att > maxAtt) {
        maxAtt = att;
        nearest = lm;
      }
    }

    return { nearestLandmark: nearest, spatialAttenuation: maxAtt };
  }, [stethPos]);

  // Maneuver effect calculation
  const maneuverEffect = useMemo(
    () => evaluateDynamicManeuver(maneuver, currentPreset.id),
    [maneuver, currentPreset.id]
  );

  // Synthesize dual PCG and ECG waveform
  const waveformData = useMemo(() => {
    return synthesizePcgEcgWaveform({
      hrBpm: currentPreset.heartRateBpm,
      pathologyId: currentPreset.id,
      chestpiece,
      maneuver,
      spatialAttenuation,
      samplePoints: 320
    });
  }, [currentPreset, chestpiece, maneuver, spatialAttenuation]);

  // Web Audio procedural sound generation
  useEffect(() => {
    if (!isPlayingAudio) {
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      return;
    }

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    audioContextRef.current = ctx;

    const cycleMs = (60 / currentPreset.heartRateBpm) * 1000;

    const playBeat = () => {
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
      const actx = audioContextRef.current;
      const now = actx.currentTime;
      const netVolume = volume * spatialAttenuation * maneuverEffect.amplitudeMultiplier;

      // S1 low thud (65 Hz)
      const osc1 = actx.createOscillator();
      const gain1 = actx.createGain();
      osc1.frequency.setValueAtTime(chestpiece === 'bell' ? 55 : 85, now);
      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.exponentialRampToValueAtTime(0.6 * netVolume, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc1.connect(gain1);
      gain1.connect(actx.destination);
      osc1.start(now);
      osc1.stop(now + 0.1);

      // S2 higher snap (110 Hz)
      const s2Delay = 0.32 * (cycleMs / 1000);
      const osc2 = actx.createOscillator();
      const gain2 = actx.createGain();
      osc2.frequency.setValueAtTime(chestpiece === 'bell' ? 80 : 125, now + s2Delay);
      gain2.gain.setValueAtTime(0.001, now + s2Delay);
      gain2.gain.exponentialRampToValueAtTime(0.7 * netVolume, now + s2Delay + 0.015);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + s2Delay + 0.08);
      osc2.connect(gain2);
      gain2.connect(actx.destination);
      osc2.start(now + s2Delay);
      osc2.stop(now + s2Delay + 0.09);

      // Murmur hiss/noise for murmurs
      if (currentPreset.id === 'aortic-stenosis' || currentPreset.id === 'mitral-regurgitation') {
        const oscMurmur = actx.createOscillator();
        const gainMurmur = actx.createGain();
        oscMurmur.type = 'triangle';
        oscMurmur.frequency.setValueAtTime(160, now + 0.08);
        gainMurmur.gain.setValueAtTime(0.001, now + 0.08);
        gainMurmur.gain.exponentialRampToValueAtTime(0.45 * netVolume, now + 0.18);
        gainMurmur.gain.exponentialRampToValueAtTime(0.001, now + s2Delay);
        oscMurmur.connect(gainMurmur);
        gainMurmur.connect(actx.destination);
        oscMurmur.start(now + 0.08);
        oscMurmur.stop(now + s2Delay);
      }
    };

    playBeat();
    audioTimerRef.current = setInterval(playBeat, cycleMs);

    return () => {
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, [isPlayingAudio, currentPreset, volume, spatialAttenuation, maneuverEffect, chestpiece]);

  const handleLandmarkClick = (landmark: AuscultationLandmark) => {
    setStethPos({ x: landmark.x, y: landmark.y });
    setActiveLandmarkId(landmark.id);
  };

  const handleChestMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setStethPos({ x, y });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                Track C3 &bull; Cardiology, Pulmonology &amp; Physical Diagnosis
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Synchronized PCG / Lead II ECG
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                AHA / ACC Auscultation Standards
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              3D Spatial Auscultation &amp; Directional Phonocardiogram Workstation
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              Precision physical examination simulator. Place the stethoscope bell or diaphragm across standard
              thoracic landmarks, analyze real-time spatial acoustic attenuation, evaluate dynamic maneuvers
              (Inspiration, Expiration, Valsalva, Handgrip), and listen to synchronized audio while observing
              dual-channel Phonocardiogram and Lead II ECG tracings.
            </p>
          </div>

          {/* Audio Controls */}
          <div className="flex items-center gap-3 w-full lg:w-auto bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <button
              onClick={() => setIsPlayingAudio(prev => !prev)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition shadow-md ${
                isPlayingAudio
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  Mute Audio
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Start Listening
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              {volume === 0 ? (
                <VolumeX className="w-4 h-4 text-slate-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              )}
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                className="w-20 accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
            </div>
          </div>
        </div>

        {/* Clinical Preset Switcher */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
            Select Auscultation Clinical Case:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {presets.map(p => {
              const isSelected = p.id === currentPreset.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPresetId(p.id)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500/70 shadow-md shadow-rose-900/20'
                      : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-900/70 text-rose-400">
                        {p.category.split(' ')[0]}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{p.vitals.hr} bpm</span>
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-1">{p.name}</div>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 line-clamp-1">{p.diagnosis}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab('stethoscope')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'stethoscope'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          Auscultation Mannequin &amp; Traces
        </button>

        <button
          onClick={() => setActiveTab('acoustic-notes')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'acoustic-notes'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Phonocardiogram Timing &amp; Radiation
        </button>

        <button
          onClick={() => setActiveTab('maneuver-matrix')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'maneuver-matrix'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Table className="w-4 h-4" />
          Dynamic Maneuver Matrix
        </button>
      </div>

      {/* Tab 1: Interactive Auscultation Workstation */}
      {activeTab === 'stethoscope' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Thoracic Mannequin & Stethoscope Positioning (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-rose-400" />
                Thoracic Auscultation Surface
              </h2>
              <span className="text-[11px] text-slate-400">Click to position stethoscope</span>
            </div>

            {/* Anatomical Thoracic Surface Map */}
            <div
              onClick={handleChestMapClick}
              className="relative aspect-[3/4] max-w-[340px] mx-auto bg-slate-950 rounded-2xl border border-slate-800/80 p-3 flex items-center justify-center cursor-crosshair overflow-hidden shadow-inner select-none"
            >
              {/* Silhouette Vector Chest */}
              <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 130">
                {/* Neck & Clavicles */}
                <path d="M 40,0 L 40,15 Q 20,20 10,32 Q 5,45 8,85 Q 12,125 50,128 Q 88,125 92,85 Q 95,45 90,32 Q 80,20 60,15 L 60,0 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                {/* Sternum */}
                <line x1="50" y1="22" x2="50" y2="70" stroke="#475569" strokeWidth="2" strokeDasharray="2 2" />
                {/* Rib contours */}
                <path d="M 48,32 Q 35,33 22,37" stroke="#334155" strokeWidth="0.8" fill="none" />
                <path d="M 52,32 Q 65,33 78,37" stroke="#334155" strokeWidth="0.8" fill="none" />
                <path d="M 48,42 Q 35,44 20,49" stroke="#334155" strokeWidth="0.8" fill="none" />
                <path d="M 52,42 Q 65,44 80,49" stroke="#334155" strokeWidth="0.8" fill="none" />
                <path d="M 48,55 Q 32,58 18,66" stroke="#334155" strokeWidth="0.8" fill="none" />
                <path d="M 52,55 Q 68,58 82,66" stroke="#334155" strokeWidth="0.8" fill="none" />
              </svg>

              {/* Anatomical Landmark Buttons */}
              {AUSCULTATION_LANDMARKS.map(lm => {
                const isOptimal = lm.id === currentPreset.keyAuscultationSite;
                return (
                  <button
                    key={lm.id}
                    onClick={e => {
                      e.stopPropagation();
                      handleLandmarkClick(lm);
                    }}
                    style={{ left: `${lm.x}%`, top: `${lm.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                        isOptimal
                          ? 'bg-rose-500 border-white shadow-lg shadow-rose-500/50 animate-pulse'
                          : 'bg-slate-800/80 border-slate-600 hover:border-cyan-400'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    {/* Tooltip on hover */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-white z-20 shadow-lg">
                      {lm.name}
                    </span>
                  </button>
                );
              })}

              {/* Stethoscope Head Position Marker */}
              <div
                style={{ left: `${stethPos.x}%`, top: `${stethPos.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 transition-all duration-150"
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full border-2 border-cyan-400 bg-cyan-500/20 shadow-xl shadow-cyan-500/40 animate-ping opacity-75" />
                  <div className="absolute w-8 h-8 rounded-full border-2 border-cyan-300 bg-slate-950/80 flex items-center justify-center">
                    <Stethoscope className="w-4 h-4 text-cyan-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Acoustic Quality Banner */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Target Landmark:</span>
                <span className="font-bold text-white">{nearestLandmark.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Acoustic Signal Strength:</span>
                <span className="font-mono font-bold text-cyan-400">
                  {Math.round(spatialAttenuation * 100)}%
                </span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                {nearestLandmark.anatomicalLocation}
              </div>
            </div>
          </div>

          {/* Controls Bench & Dual Oscilloscope (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Stethoscope Mode & Dynamic Maneuver Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              {/* Chestpiece Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  Chestpiece Acoustic Filter:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setChestpiece('diaphragm')}
                    className={`p-2 rounded-xl border text-xs font-semibold transition ${
                      chestpiece === 'diaphragm'
                        ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Diaphragm (High Pitch)
                  </button>
                  <button
                    onClick={() => setChestpiece('bell')}
                    className={`p-2 rounded-xl border text-xs font-semibold transition ${
                      chestpiece === 'bell'
                        ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Bell (Low Pitch)
                  </button>
                </div>
              </div>

              {/* Dynamic Maneuver Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-rose-400" />
                  Dynamic Auscultation Maneuver:
                </label>
                <select
                  value={maneuver}
                  onChange={e => setManeuver(e.target.value as DynamicManeuver)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="normal">Resting Tidal Respiration</option>
                  <option value="inspiration">Held Deep Inspiration (Carvallo Check)</option>
                  <option value="expiration">Held Deep Expiration (Leaning Forward)</option>
                  <option value="valsalva">Valsalva Strain (Reduced Preload)</option>
                  <option value="handgrip">Isometric Handgrip (Elevated Afterload)</option>
                </select>
              </div>
            </div>

            {/* Maneuver Impact Report */}
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Maneuver Hemodynamic Effect:</span>
                <span className="font-mono text-rose-400 font-bold">
                  {Math.round(maneuverEffect.amplitudeMultiplier * 100)}% Murmur Intensity
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {maneuverEffect.clinicalMechanism}
              </p>
            </div>

            {/* Synchronized Dual Oscilloscope (PCG + ECG) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
                <span className="font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Synchronized Dual Oscilloscope (PCG &amp; Lead II ECG)
                </span>
                <span className="font-mono text-slate-400">1 Full Cardiac Cycle ({Math.round((60/currentPreset.heartRateBpm)*1000)} ms)</span>
              </div>

              {/* PCG Top Oscilloscope */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-cyan-400 font-bold font-mono">PHONOCARDIOGRAM (PCG)</span>
                  <span className="text-slate-400">Acoustic Pressure Amplitude (&mu;bar)</span>
                </div>
                <div className="h-28 bg-slate-950 rounded-xl border border-slate-800 p-2 relative overflow-hidden flex items-center">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 320 100">
                    {/* Baseline center */}
                    <line x1="0" y1="50" x2="320" y2="50" stroke="#1e293b" strokeWidth="1" />
                    {/* PCG Polyline */}
                    <polyline
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      points={waveformData
                        .map((pt, i) => `${i},${Math.max(2, Math.min(98, 50 - pt.pcgAmplitude * 42))}`)
                        .join(' ')}
                    />
                  </svg>
                  {/* S1 and S2 annotations */}
                  <div className="absolute top-2 left-[8%] text-[9px] font-mono text-cyan-400 font-bold">S1</div>
                  <div className="absolute top-2 left-[42%] text-[9px] font-mono text-cyan-400 font-bold">S2</div>
                </div>
              </div>

              {/* ECG Bottom Oscilloscope */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-bold font-mono">LEAD II ECG</span>
                  <span className="text-slate-400">Electrical Depolarization (mV)</span>
                </div>
                <div className="h-24 bg-slate-950 rounded-xl border border-slate-800 p-2 relative overflow-hidden flex items-center">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 320 100">
                    <line x1="0" y1="70" x2="320" y2="70" stroke="#1e293b" strokeWidth="1" />
                    <polyline
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      points={waveformData
                        .map((pt, i) => `${i},${Math.max(2, Math.min(98, 70 - pt.ecgVoltageMv * 38))}`)
                        .join(' ')}
                    />
                  </svg>
                  <div className="absolute bottom-1 left-[8%] text-[9px] font-mono text-emerald-400 font-bold">QRS</div>
                  <div className="absolute bottom-1 left-[36%] text-[9px] font-mono text-emerald-400 font-bold">T</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Phonocardiogram Timing & Radiation */}
      {activeTab === 'acoustic-notes' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-bold text-white">Acoustic Physics &amp; Clinical Correlation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Auscultation Sound Profile:</div>
              <p className="text-sm text-slate-200 leading-relaxed">{currentPreset.murmurDescription}</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Transmission &amp; Radiation Pattern:</div>
              <p className="text-sm text-slate-200 leading-relaxed">{currentPreset.radiationPattern}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <div className="text-xs font-bold text-rose-300">Auscultation Diagnostic Pearls:</div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li><strong>S1 Closure Sound:</strong> Corresponds to peak of QRS complex on ECG (isovolumetric contraction onset). Best heard at mitral and tricuspid areas with diaphragm.</li>
              <li><strong>S2 Closure Sound:</strong> Marks end of mechanical systole and termination of T wave on ECG. Composed of aortic (A2) and pulmonic (P2) components. Physiologic splitting widens during inspiration.</li>
              <li><strong>S3 Gallop (Ventricular):</strong> Low-pitched vibration during rapid passive filling in early diastole (~150 ms post-S2). Hallmarked by bell chestpiece at apex with patient in left lateral decubitus.</li>
              <li><strong>S4 Gallop (Atrial):</strong> Late diastolic sound preceding S1, caused by active atrial contraction against a stiff, hypertrophied ventricle (e.g. chronic hypertension, aortic stenosis).</li>
              <li><strong>Bell vs Diaphragm:</strong> Bell with light pressure preserves low frequencies (S3, S4, MS rumble); Diaphragm with firm pressure filters out low frequencies, emphasizing high-pitched murmurs and S1/S2.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Dynamic Maneuver Matrix */}
      {activeTab === 'maneuver-matrix' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-bold text-white">Dynamic Auscultation Clinical Maneuvers Matrix</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Cardiac Lesion / Murmur</th>
                  <th className="py-3 px-4">Inspiration</th>
                  <th className="py-3 px-4">Expiration</th>
                  <th className="py-3 px-4">Valsalva (Strain)</th>
                  <th className="py-3 px-4">Handgrip (SVR &uarr;)</th>
                  <th className="py-3 px-4">Squatting (Preload &uarr;)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-bold text-white">Aortic Stenosis (AS)</td>
                  <td className="py-2.5 px-4 text-slate-400">&darr;</td>
                  <td className="py-2.5 px-4 text-emerald-400">&uarr;</td>
                  <td className="py-2.5 px-4 text-rose-400">&darr;&darr;</td>
                  <td className="py-2.5 px-4 text-slate-400">&darr;</td>
                  <td className="py-2.5 px-4 text-emerald-400">&uarr;</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-bold text-white">Mitral Regurgitation (MR)</td>
                  <td className="py-2.5 px-4 text-slate-400">&darr;</td>
                  <td className="py-2.5 px-4 text-emerald-400">&uarr;</td>
                  <td className="py-2.5 px-4 text-rose-400">&darr;</td>
                  <td className="py-2.5 px-4 text-emerald-400 font-bold">&uarr;&uarr;</td>
                  <td className="py-2.5 px-4 text-emerald-400">&uarr;</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-bold text-white">Aortic Regurgitation (AR)</td>
                  <td className="py-2.5 px-4 text-slate-400">&darr;</td>
                  <td className="py-2.5 px-4 text-emerald-400">&uarr;</td>
                  <td className="py-2.5 px-4 text-rose-400">&darr;</td>
                  <td className="py-2.5 px-4 text-emerald-400 font-bold">&uarr;&uarr;</td>
                  <td className="py-2.5 px-4 text-emerald-400">&uarr;</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-bold text-white">Hypertrophic CM (HOCM)</td>
                  <td className="py-2.5 px-4 text-slate-400">&darr;</td>
                  <td className="py-2.5 px-4 text-slate-400">&ndash;</td>
                  <td className="py-2.5 px-4 text-emerald-400 font-bold">&uarr;&uarr;</td>
                  <td className="py-2.5 px-4 text-rose-400 font-bold">&darr;&darr;</td>
                  <td className="py-2.5 px-4 text-rose-400 font-bold">&darr;&darr;</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-bold text-white">Tricuspid Regurgitation (TR)</td>
                  <td className="py-2.5 px-4 text-emerald-400 font-bold">&uarr;&uarr; (Carvallo)</td>
                  <td className="py-2.5 px-4 text-slate-400">&darr;</td>
                  <td className="py-2.5 px-4 text-rose-400">&darr;</td>
                  <td className="py-2.5 px-4 text-slate-400">&ndash;</td>
                  <td className="py-2.5 px-4 text-emerald-400">&uarr;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
