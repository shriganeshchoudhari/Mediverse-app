'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle2,
  Ear,
  Activity,
  FileText,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Stethoscope,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  computeAudiometryState,
  generateTympanogramCurve,
  AUDIOMETRY_PRESETS,
  AudiometryInputParams,
  AudiometryPresetId,
  AudiometryState,
  FREQUENCIES,
} from '@/.gemini/skills/AudiometryEngine';

const PRESET_KEYS: AudiometryPresetId[] = [
  'NORMAL_BILATERAL',
  'OTOSCLEROSIS_CARHART',
  'OTITIS_MEDIA_EFFUSION_GLUE_EAR',
  'TYMPANIC_MEMBRANE_PERFORATION',
  'PRESBYCUSIS_AGE_RELATED',
  'NOISE_INDUCED_HEARING_LOSS',
  'VESTIBULAR_SCHWANNOMA_RETROCOCHLEAR',
  'EUSTACHIAN_TUBE_DYSFUNCTION',
];

export default function AudiometrySimulator() {
  const [selectedPreset, setSelectedPreset] = useState<AudiometryPresetId>('NORMAL_BILATERAL');
  const [params, setParams] = useState<AudiometryInputParams>(
    () => AUDIOMETRY_PRESETS.NORMAL_BILATERAL.initialState
  );
  const [activeTab, setActiveTab] = useState<'audiogram' | 'tympanometry' | 'speechReflex' | 'clinical'>(
    'audiogram'
  );
  const [showSpeechBanana, setShowSpeechBanana] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioFreq, setAudioFreq] = useState<number>(1000);
  const [audioVolumeDb, setAudioVolumeDb] = useState<number>(40);
  const [selectedEar, setSelectedEar] = useState<'RIGHT' | 'LEFT'>('RIGHT');
  const [reportExported, setReportExported] = useState(false);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Computed state
  const state: AudiometryState = useMemo(() => {
    return computeAudiometryState(params);
  }, [params]);

  // Load Preset
  const handleSelectPreset = (presetId: AudiometryPresetId) => {
    setSelectedPreset(presetId);
    setParams(AUDIOMETRY_PRESETS[presetId].initialState);
  };

  // Reset
  const handleReset = () => {
    handleSelectPreset('NORMAL_BILATERAL');
  };

  // Play Pure Tone (Web Audio API)
  const togglePlayTone = () => {
    if (isPlayingAudio) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsPlayingAudio(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(audioFreq, ctx.currentTime);

      // Volume scaling from dB HL (approximating 0-1 gain with soft ceiling)
      const gainValue = Math.min(0.2, Math.pow(10, (audioVolumeDb - 60) / 40) * 0.05);
      gain.gain.setValueAtTime(gainValue, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      setIsPlayingAudio(true);

      // Auto stop after 2.5 seconds to avoid fatigue
      setTimeout(() => {
        if (audioCtxRef.current) {
          audioCtxRef.current.close();
          audioCtxRef.current = null;
        }
        setIsPlayingAudio(false);
      }, 2500);
    } catch {
      setIsPlayingAudio(false);
    }
  };

  // SVG Audiogram Coordinate Helpers
  // Frequencies mapped across 70px to 450px
  const freqToX = (f: number): number => {
    const logMin = Math.log10(125);
    const logMax = Math.log10(8000);
    const logVal = Math.log10(f);
    return 60 + ((logVal - logMin) / (logMax - logMin)) * 400;
  };

  // Decibels (-10 to 120) mapped to Y (40px to 360px)
  const dbToY = (db: number): number => {
    const clamped = Math.max(-10, Math.min(120, db));
    return 40 + ((clamped - -10) / (120 - -10)) * 320;
  };

  // Tympanogram Curve Generation
  const rightTympPoints = useMemo(() => generateTympanogramCurve(params.rightTymp), [params.rightTymp]);
  const leftTympPoints = useMemo(() => generateTympanogramCurve(params.leftTymp), [params.leftTymp]);

  // Tymp SVG coordinates: Pressure (-400 to +200) -> X (50 to 450), Compliance (0 to 2.5) -> Y (320 to 40)
  const tympPressureToX = (p: number): number => {
    return 50 + ((p - -400) / (200 - -400)) * 400;
  };
  const tympComplianceToY = (c: number): number => {
    const clamped = Math.max(0, Math.min(2.5, c));
    return 320 - (clamped / 2.5) * 280;
  };

  // Export report
  const handleExportReport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 p-6 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold tracking-widest uppercase mb-1">
              <Ear className="w-4 h-4" />
              Otolaryngology & Audiological Medicine Workstation
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Pure Tone Audiometry & Tympanometry Workstation
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Simulate octave pure tone air/bone conduction thresholds, calculate Pure Tone Averages (PTA4),
              classify Jerger middle ear compliance curves (Type A, As, Ad, B, C), and identify retrocochlear acoustic emergencies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={handleExportReport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-teal-500/20 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              {reportExported ? 'Report Generated!' : 'Export Clinical Report'}
            </button>
          </div>
        </div>

        {/* Clinical Diagnosis & Alarms Banner */}
        <div className="mt-4 p-3 bg-slate-900/90 rounded-xl border border-teal-500/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-teal-400">Diagnosis:</span>
            <span className="text-sm font-semibold text-white">{state.clinicalDiagnosis}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {state.activeAlarms.map((alarm) => {
              const isEmergency = alarm === 'SUDDEN_SNHL_EMERGENCY' || alarm === 'ASYMMETRIC_SNHL_RETROCOCHLEAR_ALERT';
              return (
                <span
                  key={alarm}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isEmergency
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-600 animate-pulse'
                      : alarm === 'OPTIMAL_HEARING'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-600'
                  }`}
                >
                  {isEmergency ? <AlertTriangle className="w-3 h-3 text-rose-400" /> : <CheckCircle2 className="w-3 h-3" />}
                  {alarm.replace(/_/g, ' ')}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Preset Selector Grid */}
      <div className="p-4 bg-slate-900/50 border-b border-slate-800">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          Clinical Audiology &amp; Otology Presets:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {PRESET_KEYS.map((key) => {
            const preset = AUDIOMETRY_PRESETS[key];
            const isSelected = selectedPreset === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectPreset(key)}
                className={`p-2.5 rounded-xl text-left border text-xs transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-teal-900/40 border-teal-500 text-teal-200 font-bold shadow-md shadow-teal-950'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold line-clamp-2">{preset.title}</div>
                <div className="text-[10px] text-slate-400 mt-1">{preset.initialState.presetId.replace(/_/g, ' ')}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-slate-800 bg-slate-900/80 px-6">
        <button
          onClick={() => setActiveTab('audiogram')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'audiogram'
              ? 'border-teal-400 text-teal-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          Pure Tone Audiogram (PTA)
        </button>
        <button
          onClick={() => setActiveTab('tympanometry')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'tympanometry'
              ? 'border-teal-400 text-teal-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Jerger Tympanometry &amp; Admittance
        </button>
        <button
          onClick={() => setActiveTab('speechReflex')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'speechReflex'
              ? 'border-teal-400 text-teal-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          Speech Audiometry &amp; Stapedial Reflexes
        </button>
        <button
          onClick={() => setActiveTab('clinical')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'clinical'
              ? 'border-teal-400 text-teal-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          Tuning Forks &amp; Otology Management
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="p-6">
        {activeTab === 'audiogram' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive SVG Audiogram */}
            <div className="lg:col-span-8 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
              <div className="flex flex-wrap items-center justify-between mb-4 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1 text-red-400">
                    <span className="w-3 h-3 rounded-full border-2 border-red-500 inline-block text-center text-[9px] leading-3">O</span>
                    Right Ear (Air: O, Bone: [)
                  </span>
                  <span className="flex items-center gap-1 text-blue-400">
                    <span className="text-xs font-bold">✕</span>
                    Left Ear (Air: ✕, Bone: ])
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-amber-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showSpeechBanana}
                      onChange={(e) => setShowSpeechBanana(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-400"
                    />
                    Speech Banana Overlay
                  </label>
                </div>
              </div>

              {/* Audiogram SVG Canvas */}
              <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-lg p-2 border border-slate-800 overflow-hidden flex items-center justify-center">
                <svg viewBox="0 0 500 390" className="w-full h-full select-none">
                  {/* Grid Lines - Frequency (Vertical) */}
                  {FREQUENCIES.map((f) => {
                    const x = freqToX(f);
                    return (
                      <g key={`freq-${f}`}>
                        <line x1={x} y1={dbToY(-10)} x2={x} y2={dbToY(120)} stroke="#334155" strokeWidth="1" strokeDasharray="2,2" />
                        <text x={x} y={dbToY(-10) - 8} fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
                          {f >= 1000 ? `${f / 1000}k` : f}
                        </text>
                      </g>
                    );
                  })}

                  {/* Grid Lines - Decibels (Horizontal) */}
                  {[-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120].map((db) => {
                    const y = dbToY(db);
                    const isNormalBoundary = db === 20;
                    return (
                      <g key={`db-${db}`}>
                        <line
                          x1={freqToX(125)}
                          y1={y}
                          x2={freqToX(8000)}
                          y2={y}
                          stroke={isNormalBoundary ? '#10b981' : '#1e293b'}
                          strokeWidth={isNormalBoundary ? '1.5' : '1'}
                          strokeDasharray={isNormalBoundary ? '4,2' : undefined}
                        />
                        <text x={freqToX(125) - 10} y={y + 3} fill={isNormalBoundary ? '#10b981' : '#64748b'} fontSize="10" textAnchor="end">
                          {db}
                        </text>
                      </g>
                    );
                  })}

                  {/* Axis Labels */}
                  <text x="250" y="20" fill="#cbd5e1" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Frequency (Hertz — Hz)
                  </text>
                  <text x="15" y="200" fill="#cbd5e1" fontSize="11" fontWeight="bold" textAnchor="middle" transform="rotate(-90 15 200)">
                    Hearing Level (dB HL)
                  </text>

                  {/* Normal Hearing Boundary Highlight (≤20 dB) */}
                  <rect
                    x={freqToX(125)}
                    y={dbToY(-10)}
                    width={freqToX(8000) - freqToX(125)}
                    height={dbToY(20) - dbToY(-10)}
                    fill="#10b981"
                    opacity="0.05"
                  />
                  <text x={freqToX(8000) - 5} y={dbToY(15)} fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="end" opacity="0.6">
                    Normal Threshold (≤20 dB)
                  </text>

                  {/* Speech Banana Shaded Region */}
                  {showSpeechBanana && (
                    <g opacity="0.8">
                      <path
                        d={`M ${freqToX(250)} ${dbToY(25)}
                            C ${freqToX(1000)} ${dbToY(20)}, ${freqToX(3000)} ${dbToY(25)}, ${freqToX(4000)} ${dbToY(35)}
                            C ${freqToX(4000)} ${dbToY(55)}, ${freqToX(2000)} ${dbToY(55)}, ${freqToX(500)} ${dbToY(50)}
                            Z`}
                        fill="#fbbf24"
                        opacity="0.15"
                        stroke="#f59e0b"
                        strokeWidth="1"
                        strokeDasharray="3,2"
                      />
                      <text x={freqToX(1000)} y={dbToY(35)} fill="#fde68a" fontSize="10" fontWeight="bold" textAnchor="middle">
                        Speech Banana (Conversational Phonemes)
                      </text>
                      <text x={freqToX(250)} y={dbToY(40)} fill="#f59e0b" fontSize="9" textAnchor="middle">m, j, u</text>
                      <text x={freqToX(1000)} y={dbToY(45)} fill="#f59e0b" fontSize="9" textAnchor="middle">a, o, d</text>
                      <text x={freqToX(2500)} y={dbToY(35)} fill="#f59e0b" fontSize="9" textAnchor="middle">k, t, ch</text>
                      <text x={freqToX(4000)} y={dbToY(42)} fill="#f59e0b" fontSize="9" textAnchor="middle">s, f, th</text>
                    </g>
                  )}

                  {/* Right Ear Air Conduction Trace (Red Solid Line & Circles) */}
                  <polyline
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                    points={FREQUENCIES.map((f) => `${freqToX(f)},${dbToY(params.rightEar.ac[f] ?? 10)}`).join(' ')}
                  />
                  {FREQUENCIES.map((f) => {
                    const x = freqToX(f);
                    const y = dbToY(params.rightEar.ac[f] ?? 10);
                    return (
                      <circle
                        key={`r-ac-${f}`}
                        cx={x}
                        cy={y}
                        r="5"
                        fill="#020617"
                        stroke="#ef4444"
                        strokeWidth="2.5"
                      />
                    );
                  })}

                  {/* Right Ear Bone Conduction (Red '[' Brackets placed slightly left) */}
                  {[250, 500, 1000, 2000, 4000].map((f) => {
                    const bcVal = params.rightEar.bc[f];
                    if (bcVal === undefined) return null;
                    const x = freqToX(f) - 9;
                    const y = dbToY(bcVal);
                    return (
                      <text key={`r-bc-${f}`} x={x} y={y + 4} fill="#ef4444" fontSize="14" fontWeight="black" textAnchor="middle">
                        [
                      </text>
                    );
                  })}

                  {/* Left Ear Air Conduction Trace (Blue Dashed Line & X Marks) */}
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="4,3"
                    points={FREQUENCIES.map((f) => `${freqToX(f)},${dbToY(params.leftEar.ac[f] ?? 10)}`).join(' ')}
                  />
                  {FREQUENCIES.map((f) => {
                    const x = freqToX(f);
                    const y = dbToY(params.leftEar.ac[f] ?? 10);
                    return (
                      <g key={`l-ac-${f}`}>
                        <line x1={x - 4} y1={y - 4} x2={x + 4} y2={y + 4} stroke="#3b82f6" strokeWidth="2.5" />
                        <line x1={x + 4} y1={y - 4} x2={x - 4} y2={y + 4} stroke="#3b82f6" strokeWidth="2.5" />
                      </g>
                    );
                  })}

                  {/* Left Ear Bone Conduction (Blue ']' Brackets placed slightly right) */}
                  {[250, 500, 1000, 2000, 4000].map((f) => {
                    const bcVal = params.leftEar.bc[f];
                    if (bcVal === undefined) return null;
                    const x = freqToX(f) + 9;
                    const y = dbToY(bcVal);
                    return (
                      <text key={`l-bc-${f}`} x={x} y={y + 4} fill="#3b82f6" fontSize="14" fontWeight="black" textAnchor="middle">
                        ]
                      </text>
                    );
                  })}
                </svg>
              </div>

              {/* Tone Synthesizer Controls */}
              <div className="mt-4 p-3 bg-slate-950/80 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlayTone}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      isPlayingAudio
                        ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                        : 'bg-teal-600 hover:bg-teal-500 text-white'
                    }`}
                  >
                    {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    {isPlayingAudio ? 'Stop Tone' : `Test Tone (${audioFreq} Hz @ ${audioVolumeDb} dB)`}
                  </button>

                  <select
                    value={audioFreq}
                    onChange={(e) => setAudioFreq(Number(e.target.value))}
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                  >
                    {FREQUENCIES.map((f) => (
                      <option key={f} value={f}>
                        {f} Hz
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Tone Intensity:</span>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={audioVolumeDb}
                    onChange={(e) => setAudioVolumeDb(Number(e.target.value))}
                    className="w-24 accent-teal-500 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-teal-400">{audioVolumeDb} dB HL</span>
                </div>
              </div>
            </div>

            {/* Right: Threshold Manipulator & Ear Quantitative Analysis */}
            <div className="lg:col-span-4 space-y-4">
              {/* Ear Toggle */}
              <div className="flex rounded-lg overflow-hidden border border-slate-800 bg-slate-900 p-1">
                <button
                  onClick={() => setSelectedEar('RIGHT')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded transition ${
                    selectedEar === 'RIGHT' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Right Ear (AD)
                </button>
                <button
                  onClick={() => setSelectedEar('LEFT')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded transition ${
                    selectedEar === 'LEFT' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Left Ear (AS)
                </button>
              </div>

              {/* Ear Metrics Card */}
              {selectedEar === 'RIGHT' ? (
                <div className="bg-slate-900/80 p-4 rounded-xl border border-red-900/40 space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-red-400">
                    <span>Right Ear Quantitative Analysis</span>
                    <span className="px-2 py-0.5 rounded bg-red-950 border border-red-800 text-[10px]">
                      {state.rightEarAnalysis.hearingLossGrade}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <div className="text-slate-400 text-[10px]">PTA4 (AC Avg)</div>
                      <div className="text-base font-black text-white">{state.rightEarAnalysis.pta4AcDb} dB HL</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <div className="text-slate-400 text-[10px]">PTA4 (BC Avg)</div>
                      <div className="text-base font-black text-white">{state.rightEarAnalysis.pta4BcDb} dB HL</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Max Air-Bone Gap</div>
                      <div className="text-base font-black text-amber-400">{state.rightEarAnalysis.maxAirBoneGapDb} dB</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Loss Classification</div>
                      <div className="text-xs font-bold text-teal-300">{state.rightEarAnalysis.hearingLossType}</div>
                    </div>
                  </div>

                  {/* Interactive Sliders for Right Ear */}
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <div className="text-[11px] font-bold text-slate-300">Adjust AC Thresholds (dB HL):</div>
                    {[500, 1000, 2000, 4000].map((f) => (
                      <div key={`slider-r-${f}`} className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 w-14">{f} Hz:</span>
                        <input
                          type="range"
                          min="0"
                          max="110"
                          step="5"
                          value={params.rightEar.ac[f] ?? 10}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setParams((prev) => ({
                              ...prev,
                              rightEar: {
                                ...prev.rightEar,
                                ac: { ...prev.rightEar.ac, [f]: val },
                              },
                            }));
                          }}
                          className="flex-1 mx-2 accent-red-500 cursor-pointer"
                        />
                        <span className="w-12 text-right font-mono text-red-400">{params.rightEar.ac[f] ?? 10} dB</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/80 p-4 rounded-xl border border-blue-900/40 space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-blue-400">
                    <span>Left Ear Quantitative Analysis</span>
                    <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-[10px]">
                      {state.leftEarAnalysis.hearingLossGrade}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <div className="text-slate-400 text-[10px]">PTA4 (AC Avg)</div>
                      <div className="text-base font-black text-white">{state.leftEarAnalysis.pta4AcDb} dB HL</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <div className="text-slate-400 text-[10px]">PTA4 (BC Avg)</div>
                      <div className="text-base font-black text-white">{state.leftEarAnalysis.pta4BcDb} dB HL</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Max Air-Bone Gap</div>
                      <div className="text-base font-black text-amber-400">{state.leftEarAnalysis.maxAirBoneGapDb} dB</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Loss Classification</div>
                      <div className="text-xs font-bold text-teal-300">{state.leftEarAnalysis.hearingLossType}</div>
                    </div>
                  </div>

                  {/* Interactive Sliders for Left Ear */}
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <div className="text-[11px] font-bold text-slate-300">Adjust AC Thresholds (dB HL):</div>
                    {[500, 1000, 2000, 4000].map((f) => (
                      <div key={`slider-l-${f}`} className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 w-14">{f} Hz:</span>
                        <input
                          type="range"
                          min="0"
                          max="110"
                          step="5"
                          value={params.leftEar.ac[f] ?? 10}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setParams((prev) => ({
                              ...prev,
                              leftEar: {
                                ...prev.leftEar,
                                ac: { ...prev.leftEar.ac, [f]: val },
                              },
                            }));
                          }}
                          className="flex-1 mx-2 accent-blue-500 cursor-pointer"
                        />
                        <span className="w-12 text-right font-mono text-blue-400">{params.leftEar.ac[f] ?? 10} dB</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interaural Asymmetry Card */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Interaural Asymmetry (PTA):</span>
                  <span className={`font-mono font-bold ${state.isAsymmetricSnHl ? 'text-rose-400 font-black' : 'text-slate-200'}`}>
                    {state.asymmetryDb} dB
                  </span>
                </div>
                {state.isAsymmetricSnHl && (
                  <div className="p-2 bg-rose-950/60 rounded border border-rose-800/80 text-[11px] text-rose-300">
                    <strong className="block mb-0.5">Asymmetric SNHL Detected (&gt;15 dB):</strong>
                    High suspicion for unilateral retrocochlear lesion (Vestibular Schwannoma). Gadolinium-enhanced MRI of IAC required.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tympanometry' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive Tympanogram Chart */}
            <div className="lg:col-span-8 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-400" />
                  Jerger Middle Ear Admittance Curves
                </h3>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-red-400 font-bold">─── Right Ear</span>
                  <span className="text-blue-400 font-bold">─── Left Ear</span>
                  <span className="text-emerald-400 font-bold">▢ Normal Jerger Box</span>
                </div>
              </div>

              {/* Tympanogram SVG Canvas */}
              <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-lg p-2 border border-slate-800 overflow-hidden">
                <svg viewBox="0 0 500 350" className="w-full h-full select-none">
                  {/* Grid Lines - Pressure (Vertical) */}
                  {[-400, -300, -200, -100, 0, 100, 200].map((p) => {
                    const x = tympPressureToX(p);
                    return (
                      <g key={`p-grid-${p}`}>
                        <line x1={x} y1={tympComplianceToY(0)} x2={x} y2={tympComplianceToY(2.5)} stroke="#1e293b" strokeWidth="1" />
                        <text x={x} y={tympComplianceToY(0) + 16} fill="#64748b" fontSize="10" textAnchor="middle">
                          {p}
                        </text>
                      </g>
                    );
                  })}

                  {/* Grid Lines - Compliance (Horizontal) */}
                  {[0.0, 0.5, 1.0, 1.5, 2.0, 2.5].map((c) => {
                    const y = tympComplianceToY(c);
                    return (
                      <g key={`c-grid-${c}`}>
                        <line x1={tympPressureToX(-400)} y1={y} x2={tympPressureToX(200)} y2={y} stroke="#1e293b" strokeWidth="1" />
                        <text x={tympPressureToX(-400) - 8} y={y + 4} fill="#64748b" fontSize="10" textAnchor="end">
                          {c.toFixed(1)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Normal Jerger Box (-100 to +50 daPa, 0.3 to 1.6 mL) */}
                  <rect
                    x={tympPressureToX(-100)}
                    y={tympComplianceToY(1.6)}
                    width={tympPressureToX(50) - tympPressureToX(-100)}
                    height={tympComplianceToY(0.3) - tympComplianceToY(1.6)}
                    fill="#10b981"
                    opacity="0.12"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="4,2"
                  />
                  <text
                    x={(tympPressureToX(-100) + tympPressureToX(50)) / 2}
                    y={tympComplianceToY(1.6) - 6}
                    fill="#10b981"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    Normal Box (Type A)
                  </text>

                  {/* Axis Labels */}
                  <text x="250" y="345" fill="#cbd5e1" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Middle Ear Air Pressure (daPa)
                  </text>
                  <text x="14" y="180" fill="#cbd5e1" fontSize="11" fontWeight="bold" textAnchor="middle" transform="rotate(-90 14 180)">
                    Static Compliance (mL)
                  </text>

                  {/* Right Ear Tympanogram Curve (Red) */}
                  <polyline
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    points={rightTympPoints.map((pt) => `${tympPressureToX(pt.pressureDaPa)},${tympComplianceToY(pt.complianceMl)}`).join(' ')}
                  />

                  {/* Left Ear Tympanogram Curve (Blue) */}
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeDasharray="4,2"
                    points={leftTympPoints.map((pt) => `${tympPressureToX(pt.pressureDaPa)},${tympComplianceToY(pt.complianceMl)}`).join(' ')}
                  />
                </svg>
              </div>

              {/* Tympanometry Educational Guide */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="font-bold text-teal-400">Type A / As / Ad</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Normal pressure. As (shallow &lt;0.3 mL) indicates stapes fixation (otosclerosis). Ad (&gt;1.6 mL) indicates ossicular disruption or monomeric TM.
                  </p>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="font-bold text-amber-400">Type B (Flat)</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    No compliance peak. Differentiated by Ear Canal Volume (ECV): Normal ECV = Glue ear (OME). High ECV (&gt;2.2 mL) = TM perforation or patent tube.
                  </p>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="font-bold text-sky-400">Type C (Negative)</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Peak shifted &lt; -100 daPa. Characteristic of Eustachian tube dysfunction, negative intratympanic pressure, and early/resolving otitis media.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Tympanometric Parameters & Classification */}
            <div className="lg:col-span-4 space-y-4">
              {/* Right Ear Tymp Card */}
              <div className="p-4 bg-slate-900/80 rounded-xl border border-red-900/40 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-red-400">
                  <span>Right Ear Tympanometry</span>
                  <span className="px-2 py-0.5 bg-red-950 border border-red-700 rounded text-[10px]">
                    {state.rightEarAnalysis.jergerType.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Ear Canal Vol (ECV)</div>
                    <div className="text-base font-bold text-white">{params.rightTymp.earCanalVolumeMl} mL</div>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Peak Compliance</div>
                    <div className="text-base font-bold text-white">{params.rightTymp.peakComplianceMl} mL</div>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Middle Ear Pressure</div>
                    <div className="text-base font-bold text-amber-400">{params.rightTymp.middleEarPressureDaPa} daPa</div>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Tymp Gradient Width</div>
                    <div className="text-base font-bold text-teal-300">{params.rightTymp.tympanometricWidthDaPa} daPa</div>
                  </div>
                </div>

                {/* Slider Controls for Right Tymp */}
                <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span>Middle Ear Pressure (daPa):</span>
                      <span className="font-mono text-red-400">{params.rightTymp.middleEarPressureDaPa}</span>
                    </div>
                    <input
                      type="range"
                      min="-350"
                      max="100"
                      step="10"
                      value={params.rightTymp.middleEarPressureDaPa}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setParams((prev) => ({
                          ...prev,
                          rightTymp: { ...prev.rightTymp, middleEarPressureDaPa: val },
                        }));
                      }}
                      className="w-full accent-red-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span>Peak Compliance (mL):</span>
                      <span className="font-mono text-red-400">{params.rightTymp.peakComplianceMl}</span>
                    </div>
                    <input
                      type="range"
                      min="0.02"
                      max="2.2"
                      step="0.05"
                      value={params.rightTymp.peakComplianceMl}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setParams((prev) => ({
                          ...prev,
                          rightTymp: { ...prev.rightTymp, peakComplianceMl: val },
                        }));
                      }}
                      className="w-full accent-red-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Left Ear Tymp Card */}
              <div className="p-4 bg-slate-900/80 rounded-xl border border-blue-900/40 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-blue-400">
                  <span>Left Ear Tympanometry</span>
                  <span className="px-2 py-0.5 bg-blue-950 border border-blue-700 rounded text-[10px]">
                    {state.leftEarAnalysis.jergerType.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Ear Canal Vol (ECV)</div>
                    <div className="text-base font-bold text-white">{params.leftTymp.earCanalVolumeMl} mL</div>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Peak Compliance</div>
                    <div className="text-base font-bold text-white">{params.leftTymp.peakComplianceMl} mL</div>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Middle Ear Pressure</div>
                    <div className="text-base font-bold text-amber-400">{params.leftTymp.middleEarPressureDaPa} daPa</div>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Tymp Gradient Width</div>
                    <div className="text-base font-bold text-teal-300">{params.leftTymp.tympanometricWidthDaPa} daPa</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'speechReflex' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Speech Audiometry Discrimination & Rollover */}
            <div className="lg:col-span-6 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-teal-400" />
                Speech Audiometry &amp; Rollover Index
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-lg border border-red-900/30 space-y-2">
                  <div className="text-xs font-bold text-red-400">Right Ear Speech Score</div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">SRT:</span>
                    <span className="font-mono text-white">{params.rightSpeech.speechRecognitionThresholdDb} dB HL</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">WRS (PB Max):</span>
                    <span className="font-mono text-emerald-400 font-bold">{params.rightSpeech.wordRecognitionScorePct}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Rollover Index:</span>
                    <span className="font-mono text-slate-300">{state.rightEarAnalysis.rolloverIndex}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-lg border border-blue-900/30 space-y-2">
                  <div className="text-xs font-bold text-blue-400">Left Ear Speech Score</div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">SRT:</span>
                    <span className="font-mono text-white">{params.leftSpeech.speechRecognitionThresholdDb} dB HL</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">WRS (PB Max):</span>
                    <span className="font-mono text-emerald-400 font-bold">{params.leftSpeech.wordRecognitionScorePct}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Rollover Index:</span>
                    <span className={`font-mono font-bold ${state.leftEarAnalysis.rolloverIndex > 0.45 ? 'text-rose-400' : 'text-slate-300'}`}>
                      {state.leftEarAnalysis.rolloverIndex}
                    </span>
                  </div>
                </div>
              </div>

              {state.leftEarAnalysis.rolloverIndex > 0.45 && (
                <div className="p-3 bg-rose-950/70 border border-rose-700/80 rounded-lg text-xs text-rose-300">
                  <strong className="block font-bold mb-1">Pathological Speech Discrimination Rollover:</strong>
                  Rollover Index &gt; 0.45 indicates retrocochlear pathology (neural auditory nerve compression / vestibular schwannoma).
                  Auditory nerve fibers cannot sustain high-rate synchronized discharge as intensity increases.
                </div>
              )}
            </div>

            {/* Stapedial Acoustic Reflex Matrix */}
            <div className="lg:col-span-6 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-400" />
                Stapedial Acoustic Reflex Arc Matrix
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2">Stimulus Frequency</th>
                      <th className="py-2 text-center text-red-400">Right Ipsi</th>
                      <th className="py-2 text-center text-red-400">Right Contra</th>
                      <th className="py-2 text-center text-blue-400">Left Ipsi</th>
                      <th className="py-2 text-center text-blue-400">Left Contra</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {[
                      { freq: '500 Hz', rIpsi: params.rightReflex.ipsi500, rContra: params.rightReflex.contra500, lIpsi: params.leftReflex.ipsi500, lContra: params.leftReflex.contra500 },
                      { freq: '1000 Hz', rIpsi: params.rightReflex.ipsi1000, rContra: params.rightReflex.contra1000, lIpsi: params.leftReflex.ipsi1000, lContra: params.leftReflex.contra1000 },
                      { freq: '2000 Hz', rIpsi: params.rightReflex.ipsi2000, rContra: params.rightReflex.contra2000, lIpsi: params.leftReflex.ipsi2000, lContra: params.leftReflex.contra2000 },
                      { freq: '4000 Hz', rIpsi: params.rightReflex.ipsi4000, rContra: params.rightReflex.contra4000, lIpsi: params.leftReflex.ipsi4000, lContra: params.leftReflex.contra4000 },
                    ].map((row) => (
                      <tr key={row.freq}>
                        <td className="py-2 font-sans text-slate-300">{row.freq}</td>
                        <td className="py-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${row.rIpsi ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                            {row.rIpsi ? 'PRESENT' : 'ABSENT'}
                          </span>
                        </td>
                        <td className="py-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${row.rContra ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                            {row.rContra ? 'PRESENT' : 'ABSENT'}
                          </span>
                        </td>
                        <td className="py-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${row.lIpsi ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                            {row.lIpsi ? 'PRESENT' : 'ABSENT'}
                          </span>
                        </td>
                        <td className="py-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${row.lContra ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                            {row.lContra ? 'PRESENT' : 'ABSENT'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Reflex Decay Alert */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Acoustic Reflex Decay Test (10s @ 10 dB SL):</span>
                <span className={`font-bold px-2 py-0.5 rounded ${params.leftReflex.reflexDecayPresent ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'}`}>
                  {params.leftReflex.reflexDecayPresent ? 'ABNORMAL DECAY (>50%)' : 'NORMAL (No Decay)'}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clinical' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Tuning Fork Correlation (Rinne & Weber) */}
            <div className="lg:col-span-5 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Ear className="w-4 h-4 text-teal-400" />
                512 Hz Tuning Fork Examination Correlation
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Rinne Test — Right Ear:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      state.tuningForkCorrelation.rinneRight === 'POSITIVE'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {state.tuningForkCorrelation.rinneRight} ({state.tuningForkCorrelation.rinneRight === 'POSITIVE' ? 'AC > BC' : 'BC > AC Conductive'})
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Rinne Test — Left Ear:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      state.tuningForkCorrelation.rinneLeft === 'POSITIVE'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {state.tuningForkCorrelation.rinneLeft} ({state.tuningForkCorrelation.rinneLeft === 'POSITIVE' ? 'AC > BC' : 'BC > AC Conductive'})
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Weber 512 Hz Lateralization:</span>
                  <span className="font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                    {state.tuningForkCorrelation.weberLateralization}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Weber lateralizes to the <strong className="text-slate-200">affected ear in conductive loss</strong> (due to occlusion effect removing environmental masking) and to the <strong className="text-slate-200">better cochlea in sensorineural loss</strong>.
                </p>
              </div>
            </div>

            {/* Otology Management & Clinical Pathway */}
            <div className="lg:col-span-7 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-400" />
                Evidence-Based Otology Management Pathway
              </h3>

              <div className="p-4 bg-slate-950 rounded-xl border border-teal-500/30 text-xs leading-relaxed space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block mb-1">
                    Definitive Diagnosis
                  </span>
                  <div className="text-sm font-bold text-white">{state.clinicalDiagnosis}</div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                    Actionable Otologic Plan
                  </span>
                  <p className="text-slate-300">{state.otologicRecommendation}</p>
                </div>
              </div>

              {/* Hearing Aid and Surgical Candidacy Table */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="font-bold text-slate-200 mb-1">Rehabilitative &amp; Surgical Guidance:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-teal-400 font-semibold block">Air-Conduction Hearing Aid:</span>
                    Candidate if PTA &gt; 25 dB with preserved word recognition (&gt;60%).
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-teal-400 font-semibold block">Bone-Anchored Hearing Aid (BAHA):</span>
                    Indicated for severe chronic conductive/mixed loss or canal atresia.
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-teal-400 font-semibold block">Cochlear Implant (CI):</span>
                    Indicated for severe-to-profound bilateral SNHL with WRS &lt; 50%.
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-teal-400 font-semibold block">Stapedotomy / Tympanoplasty:</span>
                    Surgical reconstructive options for conductive ossicular and TM deficits.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
