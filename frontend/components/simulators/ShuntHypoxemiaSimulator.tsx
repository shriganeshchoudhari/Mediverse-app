'use client';

import React, { useState, useMemo } from 'react';
import {
  Wind,
  Activity,
  Heart,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Info,
  Flame,
  Zap,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Gauge,
  Sliders,
  FileText,
  HelpCircle,
  BarChart2,
  ShieldAlert
} from 'lucide-react';
import {
  RespiratoryParameters,
  analyzeRespiratoryPhysiology,
  SHUNT_CLINICAL_PRESETS,
  predictPaO2OnHyperoxia,
  calculateOxygenContent
} from '../../.gemini/skills/ShuntHypoxemiaEngine';

export default function ShuntHypoxemiaSimulator() {
  // Active Preset or custom
  const [selectedPresetId, setSelectedPresetId] = useState<string>('severe-ards-refractory-shunt');

  // Parameters
  const [params, setParams] = useState<RespiratoryParameters>(
    SHUNT_CLINICAL_PRESETS[0].params
  );

  // Active Tab
  const [activeTab, setActiveTab] = useState<'mechanisms' | 'shunt' | 'do2' | 'ventilator' | 'evidence'>('mechanisms');

  // Simulated Hyperoxia FiO2 slider in Tab 2
  const [testFiO2, setTestFiO2] = useState<number>(1.0);

  // Calculate Comprehensive Analysis
  const analysis = useMemo(() => {
    return analyzeRespiratoryPhysiology(params);
  }, [params]);

  // Load Preset
  const handleSelectPreset = (presetId: string) => {
    const preset = SHUNT_CLINICAL_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSelectedPresetId(preset.id);
      setParams({ ...preset.params });
    }
  };

  // Update Parameter Helper
  const updateParam = <K extends keyof RespiratoryParameters>(key: K, value: RespiratoryParameters[K]) => {
    setSelectedPresetId('custom');
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  // Simulated hyperoxia response for the testFiO2 slider
  const simulatedHyperoxiaPaO2 = useMemo(() => {
    const pAtm = params.barometricPressure;
    const testPAO2 = (pAtm - 47) * testFiO2 - (params.paCO2 / 0.8);
    const testCcO2 = calculateOxygenContent(params.hemoglobin, 100, testPAO2);
    const qsQt = analysis.shuntFraction / 100;
    const cAVDiff = analysis.oxygenContent.cAVDifference;
    
    const contentDeficit = (qsQt * cAVDiff) / Math.max(0.05, 1 - qsQt);
    const targetCaO2 = testCcO2 - contentDeficit;
    const maxBound = 1.34 * params.hemoglobin;

    if (targetCaO2 > maxBound) {
      const dissolved = targetCaO2 - maxBound;
      return Math.min(650, Math.max(35, Math.round(dissolved / 0.0031)));
    } else {
      const satFrac = Math.max(0.4, Math.min(0.99, targetCaO2 / maxBound));
      const p50 = 26.8;
      return Math.min(160, Math.max(30, Math.round(p50 * Math.pow(satFrac / (1 - satFrac), 1 / 2.7))));
    }
  }, [analysis.shuntFraction, analysis.oxygenContent.cAVDifference, params.barometricPressure, params.hemoglobin, params.paCO2, testFiO2]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100 p-2 sm:p-4 md:p-6">
      {/* Header & Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 p-6 md:p-8 border border-sky-800/40 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Wind className="w-72 h-72 text-sky-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Pulmonology &amp; Critical Care
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Classic Berggren Shunt
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Grand Capstone &bull; Track A70
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              <Wind className="w-8 h-8 text-sky-400" />
              Hypoxemic &amp; Hypercapnic Respiratory Failure Workstation
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-3xl">
              Precision multi-compartment solver for the Alveolar Gas Equation (P<sub>A</sub>O<sub>2</sub>), 
              A-a oxygen gradient, 5 mechanisms of hypoxemia, classic Berggren intrapulmonary shunt fraction (Q<sub>s</sub>/Q<sub>t</sub>), 
              and systemic oxygen delivery vs consumption dynamics (DO<sub>2</sub>/VO<sub>2</sub>).
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="mt-6 pt-6 border-t border-sky-800/30">
          <div className="text-xs font-medium text-sky-300 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            SELECT CLINICAL SCENARIO BENCHMARK:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SHUNT_CLINICAL_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-sky-900/60 border-sky-400 text-white shadow-lg shadow-sky-950/50 ring-1 ring-sky-400/50'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-sky-300 truncate">{preset.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{preset.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5 Executive KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Primary Mechanism */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="text-xs font-medium text-slate-400 flex items-center justify-between mb-1">
            <span>Primary Mechanism</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-base font-bold text-white tracking-wide truncate">
            {analysis.primaryMechanism === 'RIGHT_TO_LEFT_SHUNT' && 'Right-to-Left Shunt'}
            {analysis.primaryMechanism === 'VQ_MISMATCH' && 'V/Q Mismatch'}
            {analysis.primaryMechanism === 'HYPOVENTILATION' && 'Alveolar Hypoventilation'}
            {analysis.primaryMechanism === 'LOW_FIO2_ALTITUDE' && 'Low Inspired PO2 (Altitude)'}
            {analysis.primaryMechanism === 'DIFFUSION_IMPAIRMENT' && 'Diffusion Impairment'}
            {analysis.primaryMechanism === 'NORMAL_OXYGENATION' && 'Normal Oxygenation'}
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                analysis.primaryMechanism === 'RIGHT_TO_LEFT_SHUNT'
                  ? 'bg-red-950/80 text-red-300 border border-red-800/50'
                  : analysis.primaryMechanism === 'HYPOVENTILATION'
                  ? 'bg-purple-950/80 text-purple-300 border border-purple-800/50'
                  : 'bg-sky-950/80 text-sky-300 border border-sky-800/50'
              }`}
            >
              {analysis.isRefractoryToOxygen ? 'Refractory to 100% O2' : 'Responsive to O2'}
            </span>
          </div>
        </div>

        {/* KPI 2: Shunt Fraction Qs/Qt */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="text-xs font-medium text-slate-400 flex items-center justify-between mb-1">
            <span>Shunt Fraction (Qs/Qt)</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-300 flex items-baseline gap-1">
            {analysis.shuntFraction}%
            <span className="text-xs font-normal text-slate-400">of CO</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Normal: &lt; 5% &bull; {analysis.shuntFraction >= 30 ? 'Extreme true shunt' : analysis.shuntFraction >= 20 ? 'Moderate shunt' : 'Mild / physiological'}
          </div>
        </div>

        {/* KPI 3: A-a Gradient */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="text-xs font-medium text-slate-400 flex items-center justify-between mb-1">
            <span>A-a Gradient</span>
            <Gauge className="w-4 h-4 text-indigo-400" />
          </div>
          <div className={`text-2xl font-black flex items-baseline gap-1 ${
            analysis.isAaElevated ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {analysis.aaGradient}
            <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Expected: &le; {analysis.expectedAaGradient} mmHg ({analysis.isAaElevated ? 'Widened / Abnormal' : 'Normal Gradient'})
          </div>
        </div>

        {/* KPI 4: P/F Ratio & Berlin ARDS */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="text-xs font-medium text-slate-400 flex items-center justify-between mb-1">
            <span>P/F Ratio (Berlin ARDS)</span>
            <FileText className="w-4 h-4 text-rose-400" />
          </div>
          <div className={`text-2xl font-black flex items-baseline gap-1 ${
            analysis.pfRatio <= 100 ? 'text-red-400' : analysis.pfRatio <= 200 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {analysis.pfRatio}
            <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <div className="mt-1 text-[11px] font-semibold text-slate-400">
            {analysis.ardsClassification === 'SEVERE' && <span className="text-red-400">Severe ARDS (P/F &le; 100)</span>}
            {analysis.ardsClassification === 'MODERATE' && <span className="text-amber-400">Moderate ARDS (101-200)</span>}
            {analysis.ardsClassification === 'MILD' && <span className="text-yellow-400">Mild ARDS (201-300)</span>}
            {analysis.ardsClassification === 'NONE' && <span className="text-emerald-400">Non-ARDS (P/F &gt; 300)</span>}
          </div>
        </div>

        {/* KPI 5: Global DO2 & OER */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="text-xs font-medium text-slate-400 flex items-center justify-between mb-1">
            <span>Oxygen Delivery (DO2)</span>
            <Heart className="w-4 h-4 text-pink-400" />
          </div>
          <div className={`text-2xl font-black flex items-baseline gap-1 ${
            analysis.isCriticalDO2 ? 'text-red-400 animate-pulse' : 'text-pink-300'
          }`}>
            {analysis.do2}
            <span className="text-xs font-normal text-slate-400">mL/min</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Extraction OER: <span className="font-semibold text-slate-200">{analysis.oer}%</span> (Normal: 20-30%)
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center border-b border-slate-800 gap-2 pb-1">
        <button
          onClick={() => setActiveTab('mechanisms')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
            activeTab === 'mechanisms'
              ? 'bg-slate-800 text-sky-400 border-b-2 border-sky-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          1. Five Mechanisms Differential
        </button>
        <button
          onClick={() => setActiveTab('shunt')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
            activeTab === 'shunt'
              ? 'bg-slate-800 text-sky-400 border-b-2 border-sky-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Activity className="w-4 h-4" />
          2. Berggren Shunt &amp; 100% O2 Bench
        </button>
        <button
          onClick={() => setActiveTab('do2')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
            activeTab === 'do2'
              ? 'bg-slate-800 text-sky-400 border-b-2 border-sky-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Heart className="w-4 h-4" />
          3. DO2 / VO2 Dysoxia Dynamics
        </button>
        <button
          onClick={() => setActiveTab('ventilator')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
            activeTab === 'ventilator'
              ? 'bg-slate-800 text-sky-400 border-b-2 border-sky-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Wind className="w-4 h-4" />
          4. ARDS Mechanics &amp; Dead Space
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
            activeTab === 'evidence'
              ? 'bg-slate-800 text-sky-400 border-b-2 border-sky-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <FileText className="w-4 h-4" />
          5. Clinical Protocols &amp; Evidence
        </button>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Parameters Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-400" />
                Physiologic Parameters
              </h2>
              <button
                onClick={() => handleSelectPreset('severe-ards-refractory-shunt')}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 transition"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Parameter Sliders */}
            <div className="space-y-4 text-xs">
              {/* FiO2 */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-300">Inspired Oxygen (FiO2)</span>
                  <span className="text-sky-300 font-mono font-bold">{(params.fiO2 * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.21"
                  max="1.0"
                  step="0.01"
                  value={params.fiO2}
                  onChange={(e) => updateParam('fiO2', parseFloat(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Room Air (21%)</span>
                  <span>100% O2</span>
                </div>
              </div>

              {/* PaO2 */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-300">Arterial PO2 (PaO2)</span>
                  <span className="text-sky-300 font-mono font-bold">{params.paO2} mmHg</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="550"
                  step="1"
                  value={params.paO2}
                  onChange={(e) => updateParam('paO2', parseInt(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>

              {/* PaCO2 */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-300">Arterial PCO2 (PaCO2)</span>
                  <span className="text-sky-300 font-mono font-bold">{params.paCO2} mmHg</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="110"
                  step="1"
                  value={params.paCO2}
                  onChange={(e) => updateParam('paCO2', parseInt(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Hypocapnia (15)</span>
                  <span>Normal (40)</span>
                  <span>Severe Hypercapnia (110)</span>
                </div>
              </div>

              {/* Hemoglobin */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-300">Hemoglobin (Hb)</span>
                  <span className="text-pink-300 font-mono font-bold">{params.hemoglobin} g/dL</span>
                </div>
                <input
                  type="range"
                  min="5.0"
                  max="22.0"
                  step="0.1"
                  value={params.hemoglobin}
                  onChange={(e) => updateParam('hemoglobin', parseFloat(e.target.value))}
                  className="w-full accent-pink-400 cursor-pointer"
                />
              </div>

              {/* SaO2 & SvO2 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-300">SaO2 %</span>
                    <span className="text-sky-300 font-mono">{params.saO2}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="1"
                    value={params.saO2}
                    onChange={(e) => updateParam('saO2', parseInt(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-300">SvO2 %</span>
                    <span className="text-indigo-300 font-mono">{params.svO2}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="85"
                    step="1"
                    value={params.svO2}
                    onChange={(e) => updateParam('svO2', parseInt(e.target.value))}
                    className="w-full accent-indigo-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Cardiac Output */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-300">Cardiac Output (CO)</span>
                  <span className="text-emerald-300 font-mono font-bold">{params.cardiacOutput} L/min</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="12.0"
                  step="0.1"
                  value={params.cardiacOutput}
                  onChange={(e) => updateParam('cardiacOutput', parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Barometric Pressure (Altitude) & Age */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-300">Patm (mmHg)</span>
                    <span className="text-amber-300 font-mono">{params.barometricPressure}</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="780"
                    step="10"
                    value={params.barometricPressure}
                    onChange={(e) => updateParam('barometricPressure', parseInt(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-300">Age (yrs)</span>
                    <span className="text-slate-300 font-mono">{params.age}</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="95"
                    step="1"
                    value={params.age}
                    onChange={(e) => updateParam('age', parseInt(e.target.value))}
                    className="w-full accent-slate-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Mixed Expired PeCO2 (Dead Space) */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-300">Mixed Expired PCO2 (PeCO2)</span>
                  <span className="text-slate-300 font-mono">{params.peCO2 ?? 24} mmHg</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={params.peCO2 ?? 24}
                  onChange={(e) => updateParam('peCO2', parseInt(e.target.value))}
                  className="w-full accent-slate-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500">Required for Bohr-Enghoff dead space calculation</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tab Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB 1: 5 MECHANISMS DIFFERENTIAL */}
          {activeTab === 'mechanisms' && (
            <div className="space-y-6">
              {/* Diagnostic Flow Card */}
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Hypoxemia Stepwise Diagnostic Algorithm
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="font-bold text-sky-300 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-[11px]">1</span>
                      Alveolar Gas Equation (PAO2)
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 font-mono text-[11px] text-slate-300 border border-slate-800">
                      P<sub>A</sub>O<sub>2</sub> = (P<sub>atm</sub> &minus; 47) &times; F<sub>i</sub>O<sub>2</sub> &minus; (P<sub>a</sub>CO<sub>2</sub> / 0.8)
                    </div>
                    <p className="text-slate-400">
                      Calculated P<sub>A</sub>O<sub>2</sub> = <span className="font-bold text-sky-300">{analysis.pAO2} mmHg</span> at barometric pressure {params.barometricPressure} mmHg.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="font-bold text-indigo-300 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[11px]">2</span>
                      A-a Gradient Assessment
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 font-mono text-[11px] text-slate-300 border border-slate-800">
                      A-a = P<sub>A</sub>O<sub>2</sub> &minus; P<sub>a</sub>O<sub>2</sub> = {analysis.pAO2} &minus; {params.paO2} = <span className="font-bold text-amber-300">{analysis.aaGradient} mmHg</span>
                    </div>
                    <p className="text-slate-400">
                      Expected normal for age {params.age}: <span className="font-bold text-slate-200">&le; {analysis.expectedAaGradient} mmHg</span> ({analysis.isAaElevated ? 'Abnormal Widened Gradient' : 'Normal Gradient'}).
                    </p>
                  </div>
                </div>

                {/* 5 Mechanisms Comparison Table */}
                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-300">
                        <th className="p-2.5">Mechanism</th>
                        <th className="p-2.5">A-a Gradient</th>
                        <th className="p-2.5">PaCO2</th>
                        <th className="p-2.5">Response to 100% O2</th>
                        <th className="p-2.5">Hallmark Etiologies</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-400">
                      <tr className={analysis.primaryMechanism === 'LOW_FIO2_ALTITUDE' ? 'bg-sky-950/40 text-sky-200 font-semibold' : ''}>
                        <td className="p-2.5 flex items-center gap-1.5">
                          {analysis.primaryMechanism === 'LOW_FIO2_ALTITUDE' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                          1. Low Inspired PO2
                        </td>
                        <td className="p-2.5 text-emerald-400">Normal</td>
                        <td className="p-2.5">Normal / Low</td>
                        <td className="p-2.5 text-emerald-400">Full correction</td>
                        <td className="p-2.5">High altitude, hypoxic gas delivery</td>
                      </tr>
                      <tr className={analysis.primaryMechanism === 'HYPOVENTILATION' ? 'bg-purple-950/40 text-purple-200 font-semibold' : ''}>
                        <td className="p-2.5 flex items-center gap-1.5">
                          {analysis.primaryMechanism === 'HYPOVENTILATION' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                          2. Hypoventilation
                        </td>
                        <td className="p-2.5 text-emerald-400">Normal</td>
                        <td className="p-2.5 text-red-400 font-bold">Elevated (&gt; 45)</td>
                        <td className="p-2.5 text-emerald-400">Full correction</td>
                        <td className="p-2.5">Opioid / sedative overdose, ALS, Myasthenia, Guillain-Barr&eacute;</td>
                      </tr>
                      <tr className={analysis.primaryMechanism === 'VQ_MISMATCH' ? 'bg-amber-950/40 text-amber-200 font-semibold' : ''}>
                        <td className="p-2.5 flex items-center gap-1.5">
                          {analysis.primaryMechanism === 'VQ_MISMATCH' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                          3. V/Q Mismatch
                        </td>
                        <td className="p-2.5 text-amber-400 font-bold">Elevated</td>
                        <td className="p-2.5">Variable</td>
                        <td className="p-2.5 text-emerald-400 font-semibold">Corrects (&gt; 400 mmHg)</td>
                        <td className="p-2.5">COPD, asthma bronchospasm, mild pulmonary edema, PE</td>
                      </tr>
                      <tr className={analysis.primaryMechanism === 'RIGHT_TO_LEFT_SHUNT' ? 'bg-red-950/40 text-red-200 font-semibold' : ''}>
                        <td className="p-2.5 flex items-center gap-1.5">
                          {analysis.primaryMechanism === 'RIGHT_TO_LEFT_SHUNT' && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                          4. Right-to-Left Shunt
                        </td>
                        <td className="p-2.5 text-red-400 font-bold">Markedly Elevated</td>
                        <td className="p-2.5">Normal / Low</td>
                        <td className="p-2.5 text-red-400 font-bold">REFRACTORY (&lt; 200 mmHg)</td>
                        <td className="p-2.5">Severe ARDS, dense consolidation, atelectasis, Eisenmenger</td>
                      </tr>
                      <tr className={analysis.primaryMechanism === 'DIFFUSION_IMPAIRMENT' ? 'bg-indigo-950/40 text-indigo-200 font-semibold' : ''}>
                        <td className="p-2.5 flex items-center gap-1.5">
                          {analysis.primaryMechanism === 'DIFFUSION_IMPAIRMENT' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                          5. Diffusion Defect
                        </td>
                        <td className="p-2.5 text-amber-400">Elevated</td>
                        <td className="p-2.5">Normal / Low</td>
                        <td className="p-2.5 text-emerald-400">Full correction</td>
                        <td className="p-2.5">Idiopathic pulmonary fibrosis, asbestosis, sarcoidosis</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Differential Verdict & Actionable Guidance */}
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Info className="w-4 h-4 text-sky-400" />
                  Clinical Diagnostic Analysis &amp; Protocol Directives
                </h4>
                <div className="space-y-2">
                  {analysis.differentialAnalysis.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                      &bull; {item}
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Priority Recommendations:</div>
                  {analysis.clinicalRecommendations.map((rec, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-xs text-emerald-200 leading-relaxed flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BERGGREN SHUNT & 100% O2 BENCH */}
          {activeTab === 'shunt' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-sky-400" />
                    Classic Berggren Shunt Equation (Qs/Qt)
                  </h3>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-sky-950 border border-sky-800 text-sky-300">
                    Qs/Qt = {analysis.shuntFraction}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                  <div className="text-slate-400">Formula: Q<sub>s</sub> / Q<sub>t</sub> = (C<sub>c&prime;</sub>O<sub>2</sub> &minus; C<sub>a</sub>O<sub>2</sub>) / (C<sub>c&prime;</sub>O<sub>2</sub> &minus; C<sub>v&macr;</sub>O<sub>2</sub>)</div>
                  <div className="pt-1 text-sky-300">
                    = ({analysis.oxygenContent.ccO2} &minus; {analysis.oxygenContent.caO2}) / ({analysis.oxygenContent.ccO2} &minus; {analysis.oxygenContent.cvO2}) = <span className="text-white font-bold">{analysis.shuntFraction}%</span>
                  </div>
                </div>

                {/* Oxygen Contents Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">C<sub>c&prime;</sub>O<sub>2</sub> (End-Capillary)</span>
                    <div className="text-lg font-bold text-sky-300">{analysis.oxygenContent.ccO2} <span className="text-xs font-normal">mL/dL</span></div>
                    <span className="text-[10px] text-slate-500">100% Sat + dissolved</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">C<sub>a</sub>O<sub>2</sub> (Arterial)</span>
                    <div className="text-lg font-bold text-white">{analysis.oxygenContent.caO2} <span className="text-xs font-normal">mL/dL</span></div>
                    <span className="text-[10px] text-slate-500">SaO2 {params.saO2}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">C<sub>v&macr;</sub>O<sub>2</sub> (Mixed Venous)</span>
                    <div className="text-lg font-bold text-indigo-300">{analysis.oxygenContent.cvO2} <span className="text-xs font-normal">mL/dL</span></div>
                    <span className="text-[10px] text-slate-500">SvO2 {params.svO2}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">C(a&minus;v)O<sub>2</sub> Difference</span>
                    <div className="text-lg font-bold text-pink-300">{analysis.oxygenContent.cAVDifference} <span className="text-xs font-normal">mL/dL</span></div>
                    <span className="text-[10px] text-slate-500">Normal 3.5 - 5.0</span>
                  </div>
                </div>
              </div>

              {/* 100% Oxygen Hyperoxia Simulation Bench */}
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    100% Oxygen (Hyperoxia Challenge) Simulator
                  </h4>
                  <span className={`text-xs px-2.5 py-1 rounded font-semibold ${
                    analysis.isRefractoryToOxygen
                      ? 'bg-red-950 text-red-300 border border-red-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {analysis.isRefractoryToOxygen ? 'REFRACTORY TRUE SHUNT' : 'RESPONSIVE (V/Q MISMATCH)'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  In pure V/Q mismatch, 100% O<sub>2</sub> completely flushes out alveolar nitrogen, dramatically elevating P<sub>a</sub>O<sub>2</sub> to &gt; 450&ndash;550 mmHg. 
                  In true anatomical or alveolar shunt (Q<sub>s</sub>/Q<sub>t</sub> &ge; 20%), deoxygenated blood bypasses ventilated alveoli, capping P<sub>a</sub>O<sub>2</sub> at subnormal levels.
                </p>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">Simulate Test Inspired Oxygen (FiO2)</span>
                    <span className="text-amber-300 font-mono font-bold">{(testFiO2 * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.21"
                    max="1.0"
                    step="0.01"
                    value={testFiO2}
                    onChange={(e) => setTestFiO2(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>21% (Room Air)</span>
                    <span>50%</span>
                    <span>100% Hyperoxia Challenge</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[11px] text-slate-400">Predicted PaO2 at {(testFiO2 * 100).toFixed(0)}% FiO2:</div>
                      <div className={`text-2xl font-bold mt-1 ${
                        simulatedHyperoxiaPaO2 < 150 ? 'text-red-400' : simulatedHyperoxiaPaO2 < 300 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {simulatedHyperoxiaPaO2} mmHg
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[11px] text-slate-400">Oxygen Challenge Interpretation:</div>
                      <div className="text-xs font-semibold text-slate-200 mt-1">
                        {simulatedHyperoxiaPaO2 < 100 && 'Severe shunt; virtually zero response to supplemental O2'}
                        {simulatedHyperoxiaPaO2 >= 100 && simulatedHyperoxiaPaO2 < 250 && 'Moderate shunt; blunted refractory response'}
                        {simulatedHyperoxiaPaO2 >= 250 && simulatedHyperoxiaPaO2 < 450 && 'Mild shunt or mixed V/Q mismatch'}
                        {simulatedHyperoxiaPaO2 >= 450 && 'Pure V/Q mismatch or normal lungs; robust PaO2 rise'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DO2 / VO2 DYSOXIA DYNAMICS */}
          {activeTab === 'do2' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-400" />
                    Oxygen Transport: DO2, VO2 &amp; Critical Dysoxia Threshold
                  </h3>
                  <span className={`text-xs px-2.5 py-1 rounded font-semibold ${
                    analysis.isCriticalDO2
                      ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {analysis.isCriticalDO2 ? 'SUPPLY-DEPENDENT DYSOXIA' : 'ADEQUATE DELIVERY RESERVE'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">Oxygen Delivery (DO2)</span>
                    <div className="text-2xl font-bold text-pink-300">{analysis.do2} <span className="text-xs font-normal">mL/min</span></div>
                    <span className="text-[10px] text-slate-500">Normal: 900 &minus; 1100 mL/min</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">Oxygen Consumption (VO2)</span>
                    <div className="text-2xl font-bold text-sky-300">{analysis.vo2} <span className="text-xs font-normal">mL/min</span></div>
                    <span className="text-[10px] text-slate-500">Normal: 200 &minus; 250 mL/min</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">Extraction Ratio (OER)</span>
                    <div className={`text-2xl font-bold ${analysis.oer > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {analysis.oer}%
                    </div>
                    <span className="text-[10px] text-slate-500">Normal: 20 &minus; 30%</span>
                  </div>
                </div>

                {/* Physiology Explanation */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-3">
                  <div className="font-semibold text-sky-300 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-sky-400" />
                    The DO2-VO2 Relationship &amp; Critical Threshold (DO2,crit):
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Under normal conditions, oxygen consumption (VO<sub>2</sub>) is <em>supply-independent</em>: tissues extract only as much oxygen as required. 
                    When DO<sub>2</sub> drops below critical levels (~330 mL/min), tissues exhaust their extraction reserve (OER &gt; 50&ndash;60%), 
                    and VO<sub>2</sub> becomes <em>supply-dependent</em>. Cellular hypoxia triggers anaerobic glycolysis, hyperlactatemia, and multi-organ failure.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="font-bold text-white">To Increase DO2:</span>
                      <ul className="text-slate-400 mt-1 list-disc list-inside space-y-0.5">
                        <li>Augment Cardiac Output (Inotropes, Volume)</li>
                        <li>Transfuse PRBCs (Hb target 7-9 g/dL)</li>
                        <li>Optimize SaO2 (PEEP, Recruitment)</li>
                      </ul>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="font-bold text-white">To Decrease VO2:</span>
                      <ul className="text-slate-400 mt-1 list-disc list-inside space-y-0.5">
                        <li>Sedation &amp; Analgesia</li>
                        <li>Mechanical Ventilation (relieve work of breathing)</li>
                        <li>Antipyretics / Targeted Temp Management</li>
                      </ul>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="font-bold text-white">Current Reserve:</span>
                      <div className="text-slate-300 mt-1">
                        Delivery Margin: <span className="font-bold text-emerald-400">{Math.max(0, analysis.do2 - 330)} mL/min</span> above critical collapse threshold.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ARDS MECHANICS & DEAD SPACE */}
          {activeTab === 'ventilator' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Wind className="w-5 h-5 text-sky-400" />
                    ARDS Berlin Phenotyping &amp; Ventilatory Dead Space (VD/VT)
                  </h3>
                  <span className="text-xs px-2.5 py-1 rounded font-mono bg-slate-800 text-slate-300">
                    P/F = {analysis.pfRatio} mmHg
                  </span>
                </div>

                {/* Berlin ARDS Criteria Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className={`p-3.5 rounded-xl border ${
                    analysis.ardsClassification === 'MILD'
                      ? 'bg-yellow-950/40 border-yellow-500/50 ring-1 ring-yellow-500'
                      : 'bg-slate-950 border-slate-800 opacity-60'
                  }`}>
                    <div className="font-bold text-yellow-300">Mild ARDS</div>
                    <div className="text-sm font-black text-white mt-1">200 &lt; P/F &le; 300</div>
                    <div className="text-[10px] text-slate-400 mt-1">PEEP &ge; 5 cmH2O</div>
                  </div>
                  <div className={`p-3.5 rounded-xl border ${
                    analysis.ardsClassification === 'MODERATE'
                      ? 'bg-amber-950/40 border-amber-500/50 ring-1 ring-amber-500'
                      : 'bg-slate-950 border-slate-800 opacity-60'
                  }`}>
                    <div className="font-bold text-amber-300">Moderate ARDS</div>
                    <div className="text-sm font-black text-white mt-1">100 &lt; P/F &le; 200</div>
                    <div className="text-[10px] text-slate-400 mt-1">PEEP &ge; 5 cmH2O &bull; Consider Prone if &lt; 150</div>
                  </div>
                  <div className={`p-3.5 rounded-xl border ${
                    analysis.ardsClassification === 'SEVERE'
                      ? 'bg-red-950/40 border-red-500/50 ring-1 ring-red-500'
                      : 'bg-slate-950 border-slate-800 opacity-60'
                  }`}>
                    <div className="font-bold text-red-300">Severe ARDS</div>
                    <div className="text-sm font-black text-white mt-1">P/F &le; 100</div>
                    <div className="text-[10px] text-slate-400 mt-1">Prone 16h/d &bull; Paralysis &bull; ECMO evaluation</div>
                  </div>
                </div>

                {/* Dead Space Bohr-Enghoff Section */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Bohr-Enghoff Dead Space Fraction (VD/VT):</span>
                    <span className="text-sm font-mono font-bold text-sky-400">
                      {analysis.vdVtFraction !== undefined ? `${(analysis.vdVtFraction * 100).toFixed(0)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Formula: V<sub>D</sub> / V<sub>T</sub> = (P<sub>a</sub>CO<sub>2</sub> &minus; P<sub>E</sub>CO<sub>2</sub>) / P<sub>a</sub>CO<sub>2</sub> = ({params.paCO2} &minus; {params.peCO2 ?? 24}) / {params.paCO2}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Normal V<sub>D</sub>/V<sub>T</sub> is 0.20&ndash;0.35. In severe ARDS, pulmonary microvascular thrombosis, or massive pulmonary embolism, 
                    dead space fraction often exceeds 0.55&ndash;0.65, independently predicting high mortality and hypercapnia refractory to ventilation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CLINICAL PROTOCOLS & EVIDENCE */}
          {activeTab === 'evidence' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sky-400" />
                  Evidence-Based Clinical Guidelines &amp; Benchmarks
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="font-bold text-sky-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                      ARDSNet Lung-Protective Mechanical Ventilation
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Target tidal volume 4&ndash;8 mL/kg Predicted Body Weight (PBW). Maintain Plateau Pressure P<sub>plat</sub> &lt; 30 cmH<sub>2</sub>O and Driving Pressure &Delta;P (P<sub>plat</sub> &minus; PEEP) &lt; 14 cmH<sub>2</sub>O to avoid ventilator-induced lung injury (VILI).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="font-bold text-indigo-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                      PROSEVA Trial: Prone Positioning in ARDS
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      In patients with severe ARDS and P/F &lt; 150 mmHg on FiO<sub>2</sub> &ge; 0.60 and PEEP &ge; 5 cmH<sub>2</sub>O, early prolonged prone positioning (&ge; 16 consecutive hours/day) produces a profound 16% absolute reduction in 28-day mortality by promoting dorsal alveolar recruitment and homogenizing transpulmonary pressure gradients.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="font-bold text-amber-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      Oxygen-Induced Hypercapnia &amp; The Haldane Effect in COPD
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Excessive FiO<sub>2</sub> in chronic hypercapnic patients induces acute CO<sub>2</sub> retention through three mechanisms: 
                      1) Release of hypoxic pulmonary vasoconstriction (diverting blood to poorly ventilated alveoli, worsening V/Q mismatch), 
                      2) The Haldane Effect (oxygenated hemoglobin has reduced affinity for CO<sub>2</sub>, releasing CO<sub>2</sub> into plasma), and 
                      3) Absorption atelectasis. Target SpO<sub>2</sub> 88&ndash;92% in this population.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="font-bold text-rose-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                      EOLIA / CESAR Criteria for Veno-Venous (VV) ECMO
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Consider VV ECMO referral for severe ARDS if P/F &lt; 80 mmHg for &gt; 6 hours, P/F &lt; 50 mmHg for &gt; 3 hours, or arterial pH &lt; 7.15 with PaCO<sub>2</sub> &ge; 60 mmHg for &gt; 6 hours despite lung-protective ventilation and prone positioning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}