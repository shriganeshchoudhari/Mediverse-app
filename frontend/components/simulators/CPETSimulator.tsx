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
  Heart,
  Wind,
  Gauge,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  Info,
  ChevronRight,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import {
  CPET_PRESETS,
  generateSyntheticCPETData,
  CPETDataPoint,
  CPETSummary,
  CPETPreset,
  PatientDemographics,
} from '@/.gemini/skills/CPETMetabolicErgometryEngine';

export default function CPETSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('healthy-active');
  const [showThresholdLines, setShowThresholdLines] = useState<boolean>(true);
  const [expandedPanelIndex, setExpandedPanelIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeIndex, setCurrentTimeIndex] = useState<number>(0);
  const [customParamsOpen, setCustomParamsOpen] = useState<boolean>(false);

  // Custom patient parameters
  const [customAge, setCustomAge] = useState<number>(38);
  const [customWeight, setCustomWeight] = useState<number>(75);
  const [customHeight, setCustomHeight] = useState<number>(178);
  const [customFev1, setCustomFev1] = useState<number>(4.2);
  const [customRampRate, setCustomRampRate] = useState<number>(20);

  const activePreset = useMemo(
    () => CPET_PRESETS.find(p => p.id === selectedPresetId) || CPET_PRESETS[0],
    [selectedPresetId]
  );

  // Update sliders when preset changes
  useEffect(() => {
    setCustomAge(activePreset.patient.age);
    setCustomWeight(activePreset.patient.weightKg);
    setCustomHeight(activePreset.patient.heightCm);
    setCustomFev1(activePreset.patient.fev1L);
    setCustomRampRate(activePreset.rampRateWattsMin);
    setCurrentTimeIndex(0);
    setIsPlaying(false);
  }, [activePreset]);

  // Generate CPET data & summary
  const { data, summary } = useMemo(() => {
    const customDemographics: Partial<PatientDemographics> = {
      age: customAge,
      weightKg: customWeight,
      heightCm: customHeight,
      fev1L: customFev1,
    };
    return generateSyntheticCPETData(selectedPresetId, customDemographics, customRampRate);
  }, [selectedPresetId, customAge, customWeight, customHeight, customFev1, customRampRate]);

  // Clamp time index
  useEffect(() => {
    if (currentTimeIndex >= data.length) {
      setCurrentTimeIndex(Math.max(0, data.length - 1));
    }
  }, [data.length, currentTimeIndex]);

  // Play animation loop
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentTimeIndex(prev => {
        if (prev >= data.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 250);
    return () => clearInterval(timer);
  }, [isPlaying, data.length]);

  const currentPoint = data[currentTimeIndex] || data[0] || {} as CPETDataPoint;

  // Filter monotonic ramp data for X-Y plots (V-slope and Hey plot)
  const rampData = useMemo(() => {
    return data.filter(d => d.phase === 'RAMP' || d.phase === 'PEAK' || d.phase === 'UNLOADED');
  }, [data]);

  // Dispatch AI context
  const handleAskAI = () => {
    const context = `Cardiopulmonary Exercise Testing (CPET) Assessment:
Preset: ${activePreset.name} (${activePreset.subtitle})
Diagnosis / Limitation: ${summary.limitationType} ${summary.weberClass ? `(${summary.weberClass})` : ''}
Key Parameters:
- VO2 Peak: ${summary.vo2PeakMlKgMin} mL/kg/min (${summary.vo2PeakPercentPred}% predicted)
- Anaerobic Threshold (AT): ${summary.vo2AtMlKgMin} mL/kg/min (${summary.vo2AtPercentVo2Peak}% of peak VO2) at minute ${summary.atTimeMinutes.toFixed(1)}
- Peak RER: ${summary.rerPeak} (Maximal effort criteria >= 1.10: ${summary.rerPeak >= 1.10 ? 'MET' : 'SUBMAXIMAL'})
- Breathing Reserve: ${summary.breathingReservePercent}% (Normal >= 15-20%, MVV: ${summary.mvvLMin} L/min, Peak VE: ${summary.peakVeLMin} L/min)
- VE/VCO2 Slope: ${summary.veVco2Slope} (Cutoff > 34 indicates heart failure / pulmonary vascular dead space)
- Oxygen Pulse: Peak ${summary.peakO2PulseMlBeat} mL/beat (${summary.o2PulseMorphology})
- SpO2 Nadir: ${summary.lowestSpo2Percent}%
- Heart Rate Reserve: ${summary.hrReserveBpm} bpm (Peak HR: ${summary.peakHrBpm} / Pred Max: ${summary.predictedMaxHrBpm} bpm)
Explanation: ${summary.limitationExplanation}
Please explain the underlying pathophysiology, differential diagnosis, and management recommendations.`;

    window.dispatchEvent(
      new CustomEvent('mediverse:open-ai-with-context', { detail: { context } })
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-6 flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-950/80 border border-cyan-800/80 rounded-xl text-cyan-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Cardiopulmonary Exercise Testing (CPET)
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-900/60 border border-cyan-700/60 text-cyan-300 font-medium">
                  Wasserman 9-Panel
                </span>
              </h1>
              <p className="text-sm text-slate-400">
                Gold standard integrated metabolic, circulatory, ventilatory, and gas exchange ergometry.
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowThresholdLines(!showThresholdLines)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition flex items-center gap-1.5 ${
              showThresholdLines
                ? 'bg-cyan-950/70 border-cyan-700 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            {showThresholdLines ? 'Hide Thresholds (AT/RCP)' : 'Show Thresholds (AT/RCP)'}
          </button>

          <button
            onClick={() => setCustomParamsOpen(!customParamsOpen)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition flex items-center gap-1.5 ${
              customParamsOpen
                ? 'bg-indigo-950/80 border-indigo-700 text-indigo-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Adjust Patient
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
          Select Clinical Pathology Preset:
        </span>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {CPET_PRESETS.map(preset => {
            const isSelected = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500 shadow-md shadow-cyan-950/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {preset.category}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <div className="font-semibold text-xs text-slate-100 line-clamp-1">{preset.name}</div>
                <div className="text-[11px] text-slate-400 line-clamp-1">{preset.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expandable Custom Patient Drawer */}
      {customParamsOpen && (
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs animate-in fade-in duration-200">
          <div>
            <label className="text-slate-400 font-medium">Age: {customAge} yrs</label>
            <input
              type="range"
              min={18}
              max={85}
              value={customAge}
              onChange={e => setCustomAge(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 mt-2"
            />
          </div>
          <div>
            <label className="text-slate-400 font-medium">Weight: {customWeight} kg</label>
            <input
              type="range"
              min={45}
              max={130}
              value={customWeight}
              onChange={e => setCustomWeight(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 mt-2"
            />
          </div>
          <div>
            <label className="text-slate-400 font-medium">Height: {customHeight} cm</label>
            <input
              type="range"
              min={140}
              max={205}
              value={customHeight}
              onChange={e => setCustomHeight(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 mt-2"
            />
          </div>
          <div>
            <label className="text-slate-400 font-medium">FEV1: {customFev1.toFixed(2)} L (MVV: {(customFev1 * 40).toFixed(0)} L/m)</label>
            <input
              type="range"
              min={1.0}
              max={6.0}
              step={0.1}
              value={customFev1}
              onChange={e => setCustomFev1(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 mt-2"
            />
          </div>
          <div>
            <label className="text-slate-400 font-medium">Ramp Rate: {customRampRate} W/min</label>
            <input
              type="range"
              min={5}
              max={35}
              step={5}
              value={customRampRate}
              onChange={e => setCustomRampRate(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 mt-2"
            />
          </div>
        </div>
      )}

      {/* Key Diagnostic HUD Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* VO2 Peak */}
        <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            VO₂ Peak
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              summary.vo2PeakPercentPred >= 85
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}>
              {summary.vo2PeakPercentPred}% pred
            </span>
          </div>
          <div className="text-xl font-bold text-white mt-1">
            {summary.vo2PeakMlKgMin} <span className="text-xs font-normal text-slate-400">mL/kg/min</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Pred: {summary.vo2PredictedMlKgMin} mL/kg/min
          </div>
        </div>

        {/* Anaerobic Threshold (AT / VT1) */}
        <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            Anaerobic Thresh (AT)
            <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800 px-1.5 py-0.5 rounded">
              {summary.vo2AtPercentVo2Peak}% peak
            </span>
          </div>
          <div className="text-xl font-bold text-amber-300 mt-1">
            {summary.vo2AtMlKgMin} <span className="text-xs font-normal text-slate-400">mL/kg/min</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Min {summary.atTimeMinutes.toFixed(1)} (V-Slope breakpoint)
          </div>
        </div>

        {/* Breathing Reserve (BR) */}
        <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            Breathing Reserve
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              summary.breathingReservePercent >= 15
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}>
              {summary.breathingReservePercent < 15 ? 'Exhausted' : 'Preserved'}
            </span>
          </div>
          <div className={`text-xl font-bold mt-1 ${summary.breathingReservePercent < 15 ? 'text-rose-400' : 'text-white'}`}>
            {summary.breathingReservePercent}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            VE: {summary.peakVeLMin} / MVV: {summary.mvvLMin} L/m
          </div>
        </div>

        {/* VE / VCO2 Slope */}
        <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            V̇E / V̇CO₂ Slope
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              summary.veVco2Slope <= 30
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : summary.veVco2Slope <= 34
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}>
              {summary.veVco2Slope > 34 ? 'Prognostic High' : 'Normal'}
            </span>
          </div>
          <div className={`text-xl font-bold mt-1 ${summary.veVco2Slope > 34 ? 'text-rose-400' : 'text-white'}`}>
            {summary.veVco2Slope}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Threshold: &gt; 34 in Heart Failure
          </div>
        </div>

        {/* Peak RER (Effort) */}
        <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            Peak RER (Effort)
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              summary.rerPeak >= 1.10
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}>
              {summary.rerPeak >= 1.10 ? 'Maximal' : 'Submaximal'}
            </span>
          </div>
          <div className="text-xl font-bold text-white mt-1">
            {summary.rerPeak}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Target: ≥ 1.10 (ATS Criteria)
          </div>
        </div>

        {/* Oxygen Pulse */}
        <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            O₂ Pulse (SV)
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              summary.o2PulseMorphology === 'NORMAL_RISE'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}>
              {summary.o2PulseMorphology === 'NORMAL_RISE' ? 'Normal' : 'Plateau'}
            </span>
          </div>
          <div className="text-xl font-bold text-white mt-1">
            {summary.peakO2PulseMlBeat} <span className="text-xs font-normal text-slate-400">mL/beat</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {summary.peakO2PulsePercentPred}% pred ({summary.o2PulseMorphology.replace('_', ' ')})
          </div>
        </div>
      </div>

      {/* Interactive Timeline & Scrubber Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition flex items-center gap-1 text-xs"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Play Ramp'}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentTimeIndex(0);
            }}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Reset to rest"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Timeline Slider */}
        <div className="flex-1 w-full flex flex-col gap-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>
              Phase:{' '}
              <strong className="text-cyan-400 font-semibold">
                {currentPoint.phase || 'REST'}
              </strong>
            </span>
            <span>
              Elapsed:{' '}
              <strong className="text-white">
                {currentPoint.timeMinutes?.toFixed(2) || '0.00'} min
              </strong>{' '}
              ({currentPoint.workRateWatts || 0} W)
            </span>
            <span>
              HR: <strong className="text-emerald-400">{currentPoint.hrBpm || 0} bpm</strong> | SpO₂:{' '}
              <strong className="text-cyan-400">{currentPoint.spo2Percent || 98}%</strong>
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={data.length - 1}
            value={currentTimeIndex}
            onChange={e => {
              setIsPlaying(false);
              setCurrentTimeIndex(Number(e.target.value));
            }}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>

      {/* Wasserman 9-Panel Diagnostic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* PANEL 1: VE vs Time & Work Rate */}
        <PanelCard
          title="Panel 1: Ventilatory Demand (V̇E vs Time)"
          badge="Ventilation"
          onExpand={() => setExpandedPanelIndex(1)}
        >
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timeMinutes" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="ve" stroke="#06b6d4" tick={{ fontSize: 10 }} domain={[0, 'auto']} />
              <YAxis yAxisId="wr" orientation="right" stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              {showThresholdLines && (
                <>
                  <ReferenceLine x={summary.atTimeMinutes} stroke="#f59e0b" strokeDasharray="4 2" label={{ value: 'AT', fill: '#f59e0b', fontSize: 10 }} />
                  <ReferenceLine x={summary.rcpTimeMinutes} stroke="#ec4899" strokeDasharray="4 2" label={{ value: 'RCP', fill: '#ec4899', fontSize: 10 }} />
                </>
              )}
              <Line yAxisId="ve" type="monotone" dataKey="veLMin" name="V̇E (L/min)" stroke="#06b6d4" strokeWidth={2} dot={false} />
              <Line yAxisId="wr" type="monotone" dataKey="workRateWatts" name="Work (Watts)" stroke="#475569" strokeDasharray="3 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </PanelCard>

        {/* PANEL 2: HR & O2 Pulse vs Time */}
        <PanelCard
          title="Panel 2: HR & O₂ Pulse (V̇O₂/HR vs Time)"
          badge="Hemodynamics"
          onExpand={() => setExpandedPanelIndex(2)}
        >
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timeMinutes" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="hr" stroke="#ef4444" tick={{ fontSize: 10 }} domain={[40, 200]} />
              <YAxis yAxisId="o2p" orientation="right" stroke="#3b82f6" tick={{ fontSize: 10 }} domain={[0, 30]} />
              <Tooltip content={<CustomTooltip />} />
              {showThresholdLines && (
                <ReferenceLine x={summary.atTimeMinutes} stroke="#f59e0b" strokeDasharray="4 2" />
              )}
              <Line yAxisId="hr" type="monotone" dataKey="hrBpm" name="HR (bpm)" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line yAxisId="o2p" type="monotone" dataKey="o2PulseMlBeat" name="O₂ Pulse (mL/b)" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </PanelCard>

        {/* PANEL 3: VO2 & VCO2 vs Time */}
        <PanelCard
          title="Panel 3: V̇O₂ & V̇CO₂ vs Time"
          badge="Aerobic Gas Exchange"
          onExpand={() => setExpandedPanelIndex(3)}
        >
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timeMinutes" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              {showThresholdLines && (
                <>
                  <ReferenceLine x={summary.atTimeMinutes} stroke="#f59e0b" strokeDasharray="4 2" label={{ value: 'AT', fill: '#f59e0b', fontSize: 10 }} />
                  <ReferenceLine x={summary.rcpTimeMinutes} stroke="#ec4899" strokeDasharray="4 2" label={{ value: 'RCP', fill: '#ec4899', fontSize: 10 }} />
                </>
              )}
              <Line type="monotone" dataKey="vo2MlMin" name="V̇O₂ (mL/min)" stroke="#10b981" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="vco2MlMin" name="V̇CO₂ (mL/min)" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </PanelCard>

        {/* PANEL 4: VE vs VCO2 (Ventilatory Efficiency Slope) */}
        <PanelCard
          title="Panel 4: V̇E vs V̇CO₂ (Efficiency Slope)"
          badge={`Slope: ${summary.veVco2Slope}`}
          onExpand={() => setExpandedPanelIndex(4)}
        >
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={rampData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="vco2MlMin" stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={v => (v/1000).toFixed(1)} />
              <YAxis stroke="#06b6d4" tick={{ fontSize: 10 }} domain={[0, 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="veLMin" name="V̇E (L/min)" stroke="#06b6d4" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </PanelCard>

        {/* PANEL 5: VE/VO2 & VE/VCO2 vs Time */}
        <PanelCard
          title="Panel 5: Equivalents (V̇E/V̇O₂ & V̇E/V̇CO₂)"
          badge="Dual Nadir"
          onExpand={() => setExpandedPanelIndex(5)}
        >
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timeMinutes" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[15, 60]} />
              <Tooltip content={<CustomTooltip />} />
              {showThresholdLines && (
                <>
                  <ReferenceLine x={summary.atTimeMinutes} stroke="#f59e0b" strokeDasharray="4 2" label={{ value: 'AT (Nadir 1)', fill: '#f59e0b', fontSize: 9 }} />
                  <ReferenceLine x={summary.rcpTimeMinutes} stroke="#ec4899" strokeDasharray="4 2" label={{ value: 'RCP (Nadir 2)', fill: '#ec4899', fontSize: 9 }} />
                </>
              )}
              <Line type="monotone" dataKey="veVo2" name="V̇E / V̇O₂" stroke="#06b6d4" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="veVco2" name="V̇E / V̇CO₂" stroke="#ec4899" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </PanelCard>

        {/* PANEL 6: End-Tidal PETO2 & PETCO2 */}
        <PanelCard
          title="Panel 6: End-Tidal Tensions (PETO₂ / PETCO₂)"
          badge="Alveolar Gas"
          onExpand={() => setExpandedPanelIndex(6)}
        >
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timeMinutes" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[20, 130]} />
              <Tooltip content={<CustomTooltip />} />
              {showThresholdLines && (
                <ReferenceLine x={summary.rcpTimeMinutes} stroke="#ec4899" strokeDasharray="4 2" label={{ value: 'Hyperventilation', fill: '#ec4899', fontSize: 9 }} />
              )}
              <Line type="monotone" dataKey="peto2MmHg" name="PETO₂ (mmHg)" stroke="#38bdf8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="petco2MmHg" name="PETCO₂ (mmHg)" stroke="#a855f7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </PanelCard>

        {/* PANEL 7: V-Slope Plot (VCO2 vs VO2) */}
        <PanelCard
          title="Panel 7: Beaver V-Slope (V̇CO₂ vs V̇O₂)"
          badge="AT Inflection"
          onExpand={() => setExpandedPanelIndex(7)}
        >
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={rampData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="vo2MlMin" stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={v => (v/1000).toFixed(1)} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="vco2MlMin" name="V̇CO₂ (mL/min)" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </PanelCard>

        {/* PANEL 8: RER vs Time */}
        <PanelCard
          title="Panel 8: Respiratory Exchange Ratio (RER)"
          badge="Effort Verification"
          onExpand={() => setExpandedPanelIndex(8)}
        >
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timeMinutes" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0.6, 1.4]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={1.0} stroke="#475569" strokeDasharray="3 3" label={{ value: '1.0', fill: '#64748b', fontSize: 10 }} />
              <ReferenceLine y={1.10} stroke="#ef4444" strokeDasharray="4 2" label={{ value: '1.10 (Maximal Effort)', fill: '#ef4444', fontSize: 10 }} />
              <Line type="monotone" dataKey="rer" name="RER" stroke="#f43f5e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </PanelCard>

        {/* PANEL 9: Hey Plot (VT vs VE) */}
        <PanelCard
          title="Panel 9: Hey Plot (Tidal Volume vs V̇E)"
          badge="Mechanics"
          onExpand={() => setExpandedPanelIndex(9)}
        >
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={rampData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="veLMin" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 4]} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="vtL" name="VT (Liters)" stroke="#14b8a6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </PanelCard>
      </div>

      {/* Diagnostic Limitation Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-xl border mt-0.5 ${
            summary.limitationType === 'NORMAL'
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
              : summary.limitationType === 'SUBMAXIMAL_EFFORT'
              ? 'bg-amber-950/80 border-amber-800 text-amber-400'
              : 'bg-rose-950/80 border-rose-800 text-rose-400'
          }`}>
            {summary.limitationType === 'NORMAL' ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Primary Physiological Limitation:
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                summary.limitationType === 'NORMAL'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : summary.limitationType === 'SUBMAXIMAL_EFFORT'
                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                  : 'bg-rose-950 text-rose-300 border-rose-800'
              }`}>
                {summary.limitationType.replace('_', ' ')}
                {summary.weberClass ? ` (${summary.weberClass.replace('_', ' ')})` : ''}
              </span>
            </div>
            <p className="text-sm text-slate-200 mt-1 leading-relaxed max-w-4xl">
              {summary.limitationExplanation}
            </p>
            <div className="text-xs text-slate-400 mt-2 font-medium">
              <strong className="text-slate-300">Clinical Pearl:</strong> {activePreset.clinicalTakeaway}
            </div>
          </div>
        </div>

        <button
          onClick={handleAskAI}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-900/30 transition shrink-0 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Clinical AI Review
        </button>
      </div>

      {/* Expanded Modal for Single Panel Focus */}
      {expandedPanelIndex !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Wasserman Panel {expandedPanelIndex} In-Depth Analysis
                </h2>
                <p className="text-xs text-slate-400">
                  Detailed physiological correlation for {activePreset.name}
                </p>
              </div>
              <button
                onClick={() => setExpandedPanelIndex(null)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80">
              <PanelDetailDescription panelIndex={expandedPanelIndex} summary={summary} />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setExpandedPanelIndex(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Reusable Panel Card Wrapper
 */
function PanelCard({
  title,
  badge,
  onExpand,
  children,
}: {
  title: string;
  badge: string;
  onExpand: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl p-3 flex flex-col justify-between hover:border-slate-700 transition">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-bold text-slate-200 truncate pr-2" title={title}>
          {title}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {badge}
          </span>
          <button
            onClick={onExpand}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition"
            title="Expand panel"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}

/**
 * Custom Recharts Tooltip
 */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="p-2.5 bg-slate-900/95 border border-slate-700 rounded-lg shadow-xl text-[11px] flex flex-col gap-1">
      <div className="text-slate-400 font-semibold border-b border-slate-800 pb-1">
        Time: {Number(label).toFixed(2)} min
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

/**
 * Educational text for each expanded Wasserman panel
 */
function PanelDetailDescription({
  panelIndex,
  summary,
}: {
  panelIndex: number;
  summary: CPETSummary;
}) {
  switch (panelIndex) {
    case 1:
      return (
        <div className="text-xs text-slate-300 space-y-2">
          <p>
            <strong>Panel 1 (V̇E vs Time & Work Rate):</strong> Displays minute ventilation demand relative to exercise workload.
            Normally, V̇E rises linearly with work rate below the anaerobic threshold, accelerating after AT due to metabolic acidosis buffering.
          </p>
          <p className="text-slate-400">
            Current Patient Peak V̇E is <strong>{summary.peakVeLMin} L/min</strong> against an estimated Maximum Voluntary Ventilation (MVV) of <strong>{summary.mvvLMin} L/min</strong>.
            Breathing Reserve is <strong>{summary.breathingReservePercent}%</strong>.
          </p>
        </div>
      );
    case 2:
      return (
        <div className="text-xs text-slate-300 space-y-2">
          <p>
            <strong>Panel 2 (Heart Rate & Oxygen Pulse):</strong> Reflects cardiac stroke volume kinetics according to the Fick equation:
            <br />
            <code>V̇O₂ / HR = Stroke Volume × C(a - v̄)O₂</code>.
          </p>
          <p className="text-slate-400">
            A normal O₂ pulse curve rises hyperbolically to reach a healthy plateau.
            Current morphology: <strong>{summary.o2PulseMorphology}</strong>. Peak O₂ pulse is <strong>{summary.peakO2PulseMlBeat} mL/beat</strong> ({summary.peakO2PulsePercentPred}% predicted).
            Premature plateau or downward deflection strongly indicates exercise-induced myocardial ischemia or severe left ventricular systolic reserve exhaustion.
          </p>
        </div>
      );
    case 3:
      return (
        <div className="text-xs text-slate-300 space-y-2">
          <p>
            <strong>Panel 3 (V̇O₂ & V̇CO₂ vs Time):</strong> Evaluates whole-body aerobic capacity and lactate buffering.
            Normal baseline aerobic capacity (1 MET) is ~3.5 mL/kg/min.
          </p>
          <p className="text-slate-400">
            Peak V̇O₂ reached is <strong>{summary.vo2PeakMlKgMin} mL/kg/min</strong> ({summary.vo2PeakPercentPred}% predicted).
            Anaerobic threshold occurs at minute <strong>{summary.atTimeMinutes.toFixed(1)}</strong> ({summary.vo2AtMlKgMin} mL/kg/min, {summary.vo2AtPercentVo2Peak}% of peak V̇O₂).
          </p>
        </div>
      );
    case 4:
      return (
        <div className="text-xs text-slate-300 space-y-2">
          <p>
            <strong>Panel 4 (V̇E vs V̇CO₂ - Ventilatory Efficiency Slope):</strong> Quantifies the ventilatory requirement to eliminate carbon dioxide.
            It is determined by physiological dead space (VD/VT) and arterial PCO₂ set-point:
            <br />
            <code>V̇E = [863 × V̇CO₂] / [PaCO₂ × (1 - VD/VT)]</code>.
          </p>
          <p className="text-slate-400">
            Current slope: <strong>{summary.veVco2Slope}</strong>.
            Slopes &gt; 34 indicate severe ventilation-perfusion mismatch characteristic of pulmonary arterial hypertension, chronic thromboembolic disease, or advanced heart failure (Weber Class C/D).
          </p>
        </div>
      );
    case 5:
      return (
        <div className="text-xs text-slate-300 space-y-2">
          <p>
            <strong>Panel 5 (Ventilatory Equivalents - V̇E/V̇O₂ & V̇E/V̇CO₂):</strong> Provides the dual-nadir method for identifying both ventilatory thresholds.
          </p>
          <ul className="list-disc pl-4 text-slate-400 space-y-1">
            <li><strong>Anaerobic Threshold (AT / VT1):</strong> The nadir of V̇E/V̇O₂ without a concomitant rise in V̇E/V̇CO₂. Occurred at minute {summary.atTimeMinutes.toFixed(1)}.</li>
            <li><strong>Respiratory Compensation Point (RCP / VT2):</strong> The nadir of V̇E/V̇CO₂ preceding its steep secondary hyperventilatory climb. Occurred at minute {summary.rcpTimeMinutes.toFixed(1)}.</li>
          </ul>
        </div>
      );
    case 6:
      return (
        <div className="text-xs text-slate-300 space-y-2">
          <p>
            <strong>Panel 6 (End-Tidal Gas Tensions - PETO₂ & PETCO₂):</strong> End-tidal gas partial pressures reflect alveolar gas composition.
          </p>
          <p className="text-slate-400">
            At AT, PETCO₂ reaches its peak (here <strong>{summary.petco2AtMmHg} mmHg</strong>).
            Post-RCP, hyperventilation drives a sharp decrease in PETCO₂ down to <strong>{summary.petco2PeakMmHg} mmHg</strong> and an increase in PETO₂.
            Depressed PETCO₂ throughout exercise (&lt; 30 mmHg) signifies high alveolar dead space typical of pulmonary vascular disease.
          </p>
        </div>
      );
    case 7:
      return (
        <div className="text-xs text-slate-300 space-y-2">
          <p>
            <strong>Panel 7 (Beaver V-Slope - V̇CO₂ vs V̇O₂):</strong> The gold-standard method for determining the anaerobic threshold.
          </p>
          <p className="text-slate-400">
            Below AT, the slope is ~0.95-1.0. When lactic acidosis develops, bicarbonate buffering generates non-metabolic CO₂:
            <br />
            <code>H⁺ + HCO₃⁻ ⇄ H₂CO₃ ⇄ H₂O + CO₂</code>.
            This creates a distinct upward slope inflection (slope shifts to &gt; 1.15).
          </p>
        </div>
      );
    case 8:
      return (
        <div className="text-xs text-slate-300 space-y-2">
          <p>
            <strong>Panel 8 (Respiratory Exchange Ratio - RER):</strong> RER = V̇CO₂ / V̇O₂.
          </p>
          <p className="text-slate-400">
            At rest, RER reflects substrate oxidation (0.70 for pure fat, 1.0 for pure carbohydrate).
            At peak exercise, vigorous lactic acidosis and hyperventilation drive RER above 1.10.
            Current Peak RER: <strong>{summary.rerPeak}</strong>.
            An RER &lt; 1.05 invalidates peak V̇O₂ as a true maximal physiological limit (submaximal effort).
          </p>
        </div>
      );
    case 9:
      return (
        <div className="text-xs text-slate-300 space-y-2">
          <p>
            <strong>Panel 9 (Hey Plot - Tidal Volume vs V̇E):</strong> Assesses ventilatory pattern mechanics.
          </p>
          <p className="text-slate-400">
            Normal subjects initially increase minute ventilation by deepening tidal volume (VT) up to 55-60% of vital capacity, then increasing respiratory frequency.
            In severe COPD or restrictive lung disease, VT plateaus very early due to dynamic hyperinflation or stiff chest walls, forcing shallow tachypneic breathing.
          </p>
        </div>
      );
    default:
      return null;
  }
}
