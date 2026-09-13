'use client';

import React, { useState, useMemo } from 'react';
import {
  Wind,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Flame,
  Gauge,
  Clock,
  Heart,
  Droplets,
  ChevronRight,
  Sparkles,
  Info,
  TrendingUp,
  TrendingDown,
  Stethoscope,
  Maximize2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  calculateRoxIndex,
  calculateRoxHrIndex,
  classifyRoxFailureRisk,
  calculateHfncMechanics,
  evaluatePsiliRisk,
  analyzeRoxTrajectory,
  HFNC_SCENARIOS,
  RoxTimepoint,
} from '../../.gemini/skills/HfncRoxFailureEngine';

export default function HfncRoxFailureSimulator() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('covid_responder');
  const scenario = HFNC_SCENARIOS[selectedScenarioKey] || HFNC_SCENARIOS.covid_responder;

  // Simulator State
  const [flowRateLpm, setFlowRateLpm] = useState<number>(60);
  const [fio2Percent, setFio2Percent] = useState<number>(70);
  const [patientPifLpm, setPatientPifLpm] = useState<number>(75);
  const [mouthOpen, setMouthOpen] = useState<boolean>(false);
  const [temperatureC, setTemperatureC] = useState<number>(37);
  const [hoursOnHfnc, setHoursOnHfnc] = useState<number>(2);

  // Vitals State
  const [spo2, setSpo2] = useState<number>(93);
  const [respiratoryRate, setRespiratoryRate] = useState<number>(26);
  const [heartRate, setHeartRate] = useState<number>(98);
  const [tidalVolumeMlPerKg, setTidalVolumeMlPerKg] = useState<number>(8.0);
  const [accessoryMuscleUse, setAccessoryMuscleUse] = useState<'none' | 'mild' | 'moderate' | 'severe'>('moderate');

  // Scenario Loading Helper
  const handleLoadScenario = (key: string) => {
    setSelectedScenarioKey(key);
    const sc = HFNC_SCENARIOS[key];
    if (!sc) return;

    // Load initial scenario values
    setSpo2(sc.initialVitals.spo2);
    setFio2Percent(Math.round(sc.initialVitals.fio2 * 100));
    setRespiratoryRate(sc.initialVitals.rr);
    setHeartRate(sc.initialVitals.hr);
    setPatientPifLpm(sc.initialVitals.peakInspiratoryFlow);
    setAccessoryMuscleUse(sc.initialVitals.accessoryMuscleUse);
    setTidalVolumeMlPerKg(sc.initialVitals.tidalVolumePerKg);
    setHoursOnHfnc(sc.timepoints.length > 1 ? sc.timepoints[1].hour : 2);
    if (sc.timepoints.length > 1) {
      setFlowRateLpm(sc.timepoints[1].flowRateLpm);
    }
  };

  // 1. Calculations
  const fio2Fraction = useMemo(() => fio2Percent / 100, [fio2Percent]);
  const currentRox = useMemo(
    () => calculateRoxIndex(spo2, fio2Fraction, respiratoryRate),
    [spo2, fio2Fraction, respiratoryRate]
  );
  const currentRoxHr = useMemo(
    () => calculateRoxHrIndex(currentRox, heartRate),
    [currentRox, heartRate]
  );

  const roxClassification = useMemo(
    () => classifyRoxFailureRisk(currentRox, hoursOnHfnc, heartRate),
    [currentRox, hoursOnHfnc, heartRate]
  );

  const hfncMechanics = useMemo(
    () =>
      calculateHfncMechanics({
        flowRateLpm,
        setFio2: fio2Fraction,
        patientPeakInspiratoryFlowLpm: patientPifLpm,
        mouthOpen,
        temperatureC,
        patientWeightKg: scenario.patientWeightKg,
      }),
    [flowRateLpm, fio2Fraction, patientPifLpm, mouthOpen, temperatureC, scenario.patientWeightKg]
  );

  const psiliReport = useMemo(
    () =>
      evaluatePsiliRisk({
        respiratoryRate,
        tidalVolumeMlPerKgPbw: tidalVolumeMlPerKg,
        accessoryMuscleUse,
      }),
    [respiratoryRate, tidalVolumeMlPerKg, accessoryMuscleUse]
  );

  // Dynamic Trajectory Points: combines scenario points with currently adjusted point
  const trajectoryData = useMemo(() => {
    const points: RoxTimepoint[] = scenario.timepoints.map((tp) => ({ ...tp }));
    // If current hours matches an existing timepoint or is unique, show live
    const existingIndex = points.findIndex((p) => p.hour === hoursOnHfnc);
    const livePoint: RoxTimepoint = {
      hour: hoursOnHfnc,
      spo2,
      fio2: fio2Fraction,
      respiratoryRate,
      heartRate,
      flowRateLpm,
      roxIndex: currentRox,
    };

    if (existingIndex >= 0) {
      points[existingIndex] = livePoint;
    } else {
      points.push(livePoint);
      points.sort((a, b) => a.hour - b.hour);
    }

    return points;
  }, [scenario, hoursOnHfnc, spo2, fio2Fraction, respiratoryRate, heartRate, flowRateLpm, currentRox]);

  const trajectoryAnalysis = useMemo(
    () => analyzeRoxTrajectory(trajectoryData),
    [trajectoryData]
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/20">
                <Wind className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                  High-Flow Nasal Cannula (HFNC) &amp; ROX Trajectory Workstation
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Roca Criteria &amp; P-SILI
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Dead Space Washout, Entrainment Dilution, Generated PEEP, Dynamic ROX Index Trajectory &amp; Intubation Failure Prediction
                </p>
              </div>
            </div>
          </div>

          {/* Scenario Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Clinical Profile:</span>
            {Object.keys(HFNC_SCENARIOS).map((key) => {
              const sc = HFNC_SCENARIOS[key];
              const isActive = selectedScenarioKey === key;
              return (
                <button
                  key={key}
                  onClick={() => handleLoadScenario(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                    isActive
                      ? 'bg-cyan-600 border-cyan-500 text-white shadow-sm'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  {sc.name.split('(')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Patient Synopsis Banner */}
        <div className="mt-4 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-bold text-cyan-400">{scenario.name}</span>
            <p className="text-slate-300">{scenario.patientSummary}</p>
          </div>
          <div className="flex items-center gap-4 text-slate-400 shrink-0 font-mono text-[11px]">
            <span>Diagnosis: <strong className="text-slate-200">{scenario.primaryDiagnosis}</strong></span>
            <span>PBW: <strong className="text-slate-200">{scenario.patientWeightKg} kg</strong></span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: HFNC Device Bench & Patient Drive (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* HFNC Device Settings */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                HFNC Device Delivery Settings
              </h2>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded">
                Optiflow™ / AIRVO™
              </span>
            </div>

            {/* Flow Rate Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Cannula Flow Rate:</span>
                <span className="font-mono font-bold text-cyan-300">{flowRateLpm} L/min</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={flowRateLpm}
                onChange={(e) => setFlowRateLpm(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>10 L/min</span>
                <span>Titrate for WOB: 50-60 L/min</span>
                <span>80 L/min</span>
              </div>
            </div>

            {/* Set FiO2 Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Set Oxygen Fraction (FiO₂):</span>
                <span className="font-mono font-bold text-cyan-300">{fio2Percent}% ({fio2Fraction.toFixed(2)})</span>
              </div>
              <input
                type="range"
                min="21"
                max="100"
                step="1"
                value={fio2Percent}
                onChange={(e) => setFio2Percent(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>21% (Air)</span>
                <span>Weaning goal &le; 40%</span>
                <span>100% O₂</span>
              </div>
            </div>

            {/* Mouth Position & Temperature */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">Mouth Position</label>
                <button
                  onClick={() => setMouthOpen(!mouthOpen)}
                  className={`w-full py-2 px-2.5 rounded-lg text-xs font-semibold border transition ${
                    mouthOpen
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  {mouthOpen ? 'Mouth OPEN (-50% PEEP)' : 'Mouth CLOSED (Max PEEP)'}
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">Humidification Temp</label>
                <div className="flex rounded-lg overflow-hidden border border-slate-700">
                  {[31, 34, 37].map((temp) => (
                    <button
                      key={temp}
                      onClick={() => setTemperatureC(temp)}
                      className={`flex-1 py-1.5 text-xs font-bold transition ${
                        temperatureC === temp
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {temp}&deg;C
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Timepoint on HFNC */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Time Elapsed on HFNC:
                </span>
                <span className="font-mono font-bold text-cyan-300">{hoursOnHfnc} Hours</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[0, 2, 6, 12, 24].map((hr) => (
                  <button
                    key={hr}
                    onClick={() => setHoursOnHfnc(hr)}
                    className={`flex-1 py-1 text-xs font-semibold rounded border transition ${
                      hoursOnHfnc === hr
                        ? 'bg-cyan-600 border-cyan-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                    }`}
                  >
                    {hr}h
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400">
                Roca cut-offs update at 2h (&lt;2.85), 6h (&lt;3.47), and &ge;12h (&lt;3.85).
              </p>
            </div>
          </div>

          {/* Patient Physiology & Respiratory Drive */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Patient Respiratory Vitals &amp; Effort
            </h2>

            {/* SpO2 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Pulse Oximetry (SpO₂):</span>
                <span className={`font-mono font-bold ${spo2 < 90 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {spo2}%
                </span>
              </div>
              <input
                type="range"
                min="70"
                max="100"
                step="1"
                value={spo2}
                onChange={(e) => setSpo2(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Respiratory Rate */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Respiratory Rate (RR):</span>
                <span className={`font-mono font-bold ${respiratoryRate >= 30 ? 'text-rose-400' : 'text-cyan-300'}`}>
                  {respiratoryRate} bpm
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="50"
                step="1"
                value={respiratoryRate}
                onChange={(e) => setRespiratoryRate(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Heart Rate */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Heart Rate (HR):</span>
                <span className="font-mono font-bold text-amber-300">{heartRate} bpm</span>
              </div>
              <input
                type="range"
                min="50"
                max="160"
                step="2"
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Peak Inspiratory Flow (PIF) */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Peak Inspiratory Flow Demand (PIF):</span>
                <span className={`font-mono font-bold ${patientPifLpm > flowRateLpm ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {patientPifLpm} L/min
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="130"
                step="5"
                value={patientPifLpm}
                onChange={(e) => setPatientPifLpm(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="text-[10px] text-slate-400">
                {patientPifLpm > flowRateLpm ? (
                  <span className="text-amber-400 font-semibold">
                    &Delta; {patientPifLpm - flowRateLpm} L/min air entrained (dilutes delivered FiO₂)!
                  </span>
                ) : (
                  <span className="text-emerald-400">
                    Flow matches patient demand. No room air entrainment.
                  </span>
                )}
              </div>
            </div>

            {/* Tidal Volume per kg & Accessory Muscles */}
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">Tidal Vol (mL/kg PBW)</label>
                <select
                  value={tidalVolumeMlPerKg}
                  onChange={(e) => setTidalVolumeMlPerKg(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value={6.0}>6.0 mL/kg (Lung protective)</option>
                  <option value={7.5}>7.5 mL/kg (Mild elevation)</option>
                  <option value={9.0}>9.0 mL/kg (Excessive drive)</option>
                  <option value={11.0}>11.0 mL/kg (Severe P-SILI risk)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">Accessory Muscle Use</label>
                <select
                  value={accessoryMuscleUse}
                  onChange={(e) => setAccessoryMuscleUse(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="none">None</option>
                  <option value="mild">Mild (Intercostal)</option>
                  <option value="moderate">Moderate (Scalene/SCM)</option>
                  <option value="severe">Severe (Paradoxical)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: ROX Dashboard & Trajectory Recharts (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Real-Time ROX Index Hero Metric Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Real-Time Oxygenation Index
                </span>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  ROX Index at {hoursOnHfnc} Hours
                </h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  roxClassification.level === 'success'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : roxClassification.level === 'intermediate'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}
              >
                {roxClassification.level.toUpperCase().replace(/_/g, ' ')}
              </span>
            </div>

            {/* Big ROX Value Display */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Standard ROX</div>
                <div
                  className={`text-4xl font-black font-mono ${
                    currentRox >= 4.88
                      ? 'text-emerald-400'
                      : currentRox >= 3.85
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {currentRox.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  (SpO₂ {spo2}% / {fio2Fraction.toFixed(2)}) / {respiratoryRate} bpm
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">ROX-HR (Modified)</div>
                <div
                  className={`text-4xl font-black font-mono ${
                    currentRoxHr >= 6.8 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {currentRoxHr.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  (ROX / HR {heartRate}) &times; 100
                </div>
              </div>
            </div>

            {/* Threshold Reference Indicator */}
            <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/60 space-y-1.5 text-xs">
              <div className="flex justify-between font-medium">
                <span className="text-slate-300">{roxClassification.interpretation}</span>
                <span className="font-mono text-cyan-400">Cutoff: {roxClassification.thresholdUsed}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {roxClassification.actionRecommendation}
              </p>
            </div>
          </div>

          {/* Longitudinal ROX Trajectory Recharts */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Longitudinal ROX Index Trajectory
                </h3>
                <p className="text-[11px] text-slate-400">
                  Tracking ROC slope across 0h, 2h, 6h, 12h to detect early vs delayed failure
                </p>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                {trajectoryAnalysis.trajectoryTrend === 'improving' ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <TrendingUp className="w-3.5 h-3.5" /> +{trajectoryAnalysis.deltaRox}
                  </span>
                ) : trajectoryAnalysis.trajectoryTrend === 'deteriorating' ? (
                  <span className="flex items-center gap-1 text-rose-400 font-bold">
                    <TrendingDown className="w-3.5 h-3.5" /> {trajectoryAnalysis.deltaRox}
                  </span>
                ) : (
                  <span className="text-slate-400">Stable ({trajectoryAnalysis.deltaRox})</span>
                )}
              </div>
            </div>

            {/* Chart */}
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trajectoryData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis
                    dataKey="hour"
                    tickFormatter={(val) => `${val}h`}
                    stroke="#94a3b8"
                    fontSize={11}
                  />
                  <YAxis domain={[0, 20]} stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.5rem',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`ROX: ${Number(val).toFixed(2)}`, 'Index']}
                    labelFormatter={(label) => `Time on HFNC: ${label} Hours`}
                  />
                  {/* Safety Green Zone Threshold Line at 4.88 */}
                  <ReferenceLine
                    y={4.88}
                    stroke="#10b981"
                    strokeDasharray="4 4"
                    label={{ value: 'Success (4.88)', fill: '#10b981', fontSize: 10, position: 'right' }}
                  />
                  {/* Failure Red Zone Threshold Line at 3.85 */}
                  <ReferenceLine
                    y={3.85}
                    stroke="#f43f5e"
                    strokeDasharray="4 4"
                    label={{ value: 'Failure (<3.85)', fill: '#f43f5e', fontSize: 10, position: 'right' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="roxIndex"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={{ fill: '#06b6d4', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Trajectory Analysis Summary */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase font-bold text-slate-400">Trajectory Outcome</div>
                <div className="text-slate-200 font-medium">{trajectoryAnalysis.clinicalSummary}</div>
              </div>
              <div className="text-right shrink-0 pl-3">
                <div className="text-[10px] uppercase font-bold text-slate-400">Failure Prob</div>
                <div
                  className={`text-base font-black font-mono ${
                    trajectoryAnalysis.failureProbabilityPercent >= 70
                      ? 'text-rose-400'
                      : trajectoryAnalysis.failureProbabilityPercent >= 35
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {trajectoryAnalysis.failureProbabilityPercent}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: HFNC Biophysics & P-SILI Prevention (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Biophysical Aerodynamics & Washout */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-400" />
              Aerodynamics &amp; Washout
            </h3>

            <div className="space-y-3 text-xs">
              {/* Dead Space Washout */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400">Pharyngeal Dead Space Washout:</span>
                  <span className="font-mono font-bold text-cyan-400">
                    {hfncMechanics.deadSpaceWashoutPercent}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${hfncMechanics.deadSpaceWashoutPercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Purges expired CO₂ from ~150 mL upper airway, saving ~{hfncMechanics.effectiveMinuteVentilationReductionLpm} L/min minute ventilation.
                </p>
              </div>

              {/* Generated PEEP */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-slate-400 font-medium">Generated PEEP:</div>
                  <div className="text-[10px] text-slate-400">
                    {mouthOpen ? 'Mouth open (halved)' : 'Mouth closed'}
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-lg font-bold text-emerald-400">
                    +{hfncMechanics.generatedPeepCmH2o}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1">cmH₂O</span>
                </div>
              </div>

              {/* Actual Delivered FiO2 */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400">Delivered FiO₂:</span>
                  <span
                    className={`font-mono font-bold ${
                      hfncMechanics.fio2Diluted ? 'text-amber-400' : 'text-cyan-400'
                    }`}
                  >
                    {(hfncMechanics.actualDeliveredFio2 * 100).toFixed(0)}%
                  </span>
                </div>
                {hfncMechanics.fio2Diluted && (
                  <p className="text-[10px] text-amber-300 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                    Diluted from {fio2Percent}% due to {hfncMechanics.airEntrainedLpm} L/min air entrainment!
                  </p>
                )}
              </div>

              {/* Active Conditioning */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span>Conditioning:</span>
                </div>
                <span className="font-mono text-slate-200">
                  {hfncMechanics.absoluteHumidityMgL} mg/L H₂O ({temperatureC}&deg;C)
                </span>
              </div>
            </div>
          </div>

          {/* P-SILI Risk & Diaphragm Strain Evaluation */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              P-SILI &amp; Lung Strain Audit
            </h3>

            <div
              className={`p-3.5 rounded-xl border space-y-2 text-xs ${
                psiliReport.psiliRiskLevel === 'Low'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                  : psiliReport.psiliRiskLevel === 'Moderate'
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>P-SILI Risk: {psiliReport.psiliRiskLevel}</span>
                <span>Strain: {psiliReport.dynamicTranspulmonaryStrain}</span>
              </div>

              <div className="text-[11px] font-mono text-slate-300">
                Estimated &Delta;P_es: ~{psiliReport.estimatedDeltaPesCmH2o} cmH₂O
              </div>

              {psiliReport.pendelluftRisk && (
                <div className="p-1.5 rounded bg-rose-950/60 border border-rose-800 text-[10px] text-rose-200 font-semibold">
                  ⚠️ Pendelluft Hazard: Dependent gas shifts before inspiratory onset.
                </div>
              )}

              <p className="text-[11px] text-slate-300 leading-relaxed">
                {psiliReport.rationale}
              </p>
            </div>

            {/* Kang et al. Failure Delay Warning */}
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1 text-[11px] text-slate-400">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Kang et al. Clinical Pearl:
              </div>
              <p className="text-[10px] leading-relaxed">
                Delaying intubation beyond 12-24h in HFNC failure markedly increases ICU mortality compared to early intubation (&lt;48h). Do not persist with HFNC if ROX &lt; 3.85!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
