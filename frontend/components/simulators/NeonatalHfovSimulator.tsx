'use client';

import React, { useState, useMemo } from 'react';
import {
  Baby,
  Wind,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Zap,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  Droplets,
  HelpCircle,
} from 'lucide-react';
import {
  NeonatalDemographics,
  HfovSettings,
  SurfactantState,
  LungBiomechanics,
  evaluateNeonatalHfov,
  calculateLaplacePressure,
  NEONATAL_HFOV_PRESETS,
} from '../../.gemini/skills/NeonatalHfovVentilationEngine';

export default function NeonatalHfovSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('EXTREME_PRETERM_RDS_ACUTE');

  const [demographics, setDemographics] = useState<NeonatalDemographics>(
    NEONATAL_HFOV_PRESETS[0].demographics
  );

  const [hfov, setHfov] = useState<HfovSettings>(
    NEONATAL_HFOV_PRESETS[0].hfov
  );

  const [surfactant, setSurfactant] = useState<SurfactantState>(
    NEONATAL_HFOV_PRESETS[0].surfactant
  );

  const [biomechanics, setBiomechanics] = useState<LungBiomechanics>(
    NEONATAL_HFOV_PRESETS[0].biomechanics
  );

  const [activeTab, setActiveTab] = useState<'controls' | 'surfactant' | 'open_lung' | 'physics'>('controls');

  // Master Evaluation
  const evaluation = useMemo(() => {
    return evaluateNeonatalHfov(demographics, hfov, surfactant, biomechanics);
  }, [demographics, hfov, surfactant, biomechanics]);

  // Alveolar radius slider state for Laplace solver
  const [alveolarRadiusMicrons, setAlveolarRadiusMicrons] = useState<number>(50);

  const laplacePressure = useMemo(() => {
    return calculateLaplacePressure(surfactant.alveolarSurfaceTensionMnm, alveolarRadiusMicrons);
  }, [surfactant.alveolarSurfaceTensionMnm, alveolarRadiusMicrons]);

  // Preset Handler
  const handleSelectPreset = (presetId: string) => {
    const preset = NEONATAL_HFOV_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    setDemographics({ ...preset.demographics });
    setHfov({ ...preset.hfov });
    setSurfactant({ ...preset.surfactant });
    setBiomechanics({ ...preset.biomechanics });
  };

  // Administer Rescue Surfactant
  const handleAdministerSurfactant = () => {
    setSurfactant({
      administered: true,
      preparation: 'PORACTANT_ALFA_CUROSURF',
      doseMgPerKg: 200,
      deliveryMethod: 'LISA_MIST',
      hoursSinceDose: 0.2,
      alveolarSurfaceTensionMnm: 8,
    });
    setBiomechanics((prev) => ({
      ...prev,
      respiratoryComplianceMlCmH2O: parseFloat((prev.respiratoryComplianceMlCmH2O * 1.5).toFixed(2)),
      alveolarRecruitmentPct: Math.min(95, prev.alveolarRecruitmentPct + 35),
    }));
    alert(
      'SURFACTANT ADMINISTERED: Poractant alfa 200 mg/kg via LISA. Alveolar surface tension reduced to 8 mN/m! Dynamic compliance surge occurring — monitor for rapid hypocapnia.'
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                Neonatology &amp; NICU
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/30">
                High-Frequency Oscillatory Ventilation (HFOV)
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mt-2 text-white">
              Neonatal HFOV &amp; Surfactant Kinematics Workstation
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Sub-dead-space oscillatory gas transport (Taylor dispersion, Pendelluft), Open-Lung hysteresis recruitment, and exogenous surfactant kinetics (LISA / MIST).
            </p>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="preset-select" className="text-xs text-slate-400 font-medium whitespace-nowrap">
              Clinical Preset:
            </label>
            <select
              id="preset-select"
              aria-label="Clinical Preset"
              value={selectedPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              {NEONATAL_HFOV_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Oscillatory Waveform Animation & Chest Wiggle Monitor */}
        <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping inline-block" />
                HFOV OSCILLATOR (Hz: {hfov.frequencyHz} &bull; mPaw: {hfov.meanAirwayPressureCmH2O} &bull; &Delta;P: {hfov.amplitudeDeltaPCmH2O})
              </div>
              <span className="text-xs text-slate-400">
                Cycles/min: {hfov.frequencyHz * 60} &bull; Bias Flow: {hfov.flowRateLMin} L/min
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300">
                <Wind className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: `${1 / hfov.frequencyHz}s` }} />
                <span>Chest Wiggle: {evaluation.deliveredHfovTidalVolumeMlPerKg > 1.5 ? 'Good (to Umbilicus)' : 'Dampened'}</span>
              </div>
            </div>
          </div>

          {/* SVG Piston Oscillator Visualization */}
          <div className="w-full h-28 bg-slate-950 rounded-lg border border-slate-800/80 relative flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 1000 120" preserveAspectRatio="none">
              {/* Central Mean Airway Pressure Baseline */}
              <line
                x1="0"
                y1={120 - (hfov.meanAirwayPressureCmH2O * 4)}
                x2="1000"
                y2={120 - (hfov.meanAirwayPressureCmH2O * 4)}
                stroke="#0284c7"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* High Frequency Sine Wave Oscillations */}
              <path
                d={Array.from({ length: 40 })
                  .map((_, i) => {
                    const xStart = i * 25;
                    const yMid = 120 - (hfov.meanAirwayPressureCmH2O * 4);
                    const amp = (hfov.amplitudeDeltaPCmH2O * 0.7);
                    return `
                      M ${xStart},${yMid}
                      Q ${xStart + 6.25},${yMid - amp} ${xStart + 12.5},${yMid}
                      Q ${xStart + 18.75},${yMid + amp} ${xStart + 25},${yMid}
                    `;
                  })
                  .join(' ')}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute left-2 top-2 text-[10px] font-mono text-cyan-500">
              Mean Airway Pressure (mPaw): {hfov.meanAirwayPressureCmH2O} cmH2O
            </div>
            <div className="absolute right-2 top-2 text-[10px] font-mono text-purple-400">
              Active Inspiration &amp; Active Expiration
            </div>
          </div>
        </div>

        {/* Scoreboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {/* Blood Gas Predictor */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Predicted Arterial Blood Gas
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-black text-white">
                pH {evaluation.predictedPh}
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                PaCO2: {evaluation.predictedPaCO2MmHg}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              PaO2: {evaluation.predictedPaO2MmHg} mmHg &bull; SpO2: {evaluation.predictedSpO2Pct}%
            </div>
          </div>

          {/* Tidal Volume Delivery */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              HFOV Tidal Volume (V_thf)
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-black text-cyan-400 font-mono">
                {evaluation.deliveredHfovTidalVolumeMl} mL
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ({evaluation.deliveredHfovTidalVolumeMlPerKg} mL/kg)
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Sub-dead-space volume &lt; anatomical Vd
            </div>
          </div>

          {/* Diffusion Coefficient (DCO2) */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              CO2 Diffusion Coefficient (DCO2)
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-black text-purple-400 font-mono">
                {evaluation.diffusionCoefficientDco2}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                mL&sup2;/s (f &times; Vt&sup2;)
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Gas transport efficiency metric
            </div>
          </div>

          {/* Oxygenation Index (OI) */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Oxygenation Index (OI)
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-black text-white font-mono">
                {evaluation.oxygenationIndexOi}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  evaluation.oiSeverity === 'CRITICAL_ECMO_TRIGGER'
                    ? 'bg-rose-500/30 text-rose-300 border border-rose-500'
                    : evaluation.oiSeverity === 'SEVERE'
                    ? 'bg-rose-500/20 text-rose-400'
                    : evaluation.oiSeverity === 'MODERATE'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                {evaluation.oiSeverity.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {evaluation.oxygenationIndexOi >= 25 ? 'Inhaled Nitric Oxide candidate' : 'Standard lung protective'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <main className="max-w-7xl mx-auto">
        <div className="flex border-b border-slate-800 mb-6 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('controls')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'controls'
                ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-4 h-4" />
            1. HFOV Ventilator Controls &amp; ABG
          </button>
          <button
            onClick={() => setActiveTab('surfactant')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'surfactant'
                ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplets className="w-4 h-4" />
            2. Surfactant Therapy &amp; Laplace (LISA)
          </button>
          <button
            onClick={() => setActiveTab('open_lung')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'open_lung'
                ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            3. Open-Lung Hysteresis Strategy
          </button>
          <button
            onClick={() => setActiveTab('physics')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'physics'
                ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            4. Gas Transport Physics (Pendelluft)
          </button>
        </div>

        {/* TAB 1: CONTROLS & ABG */}
        {activeTab === 'controls' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <Wind className="w-4 h-4 text-cyan-400" />
                Primary Oscillator Settings &amp; Patient Demographics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Mean Airway Pressure */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Mean Airway Pressure (mPaw)</span>
                    <span className="font-mono font-bold text-cyan-400">{hfov.meanAirwayPressureCmH2O} cmH2O</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="26"
                    step="1"
                    value={hfov.meanAirwayPressureCmH2O}
                    onChange={(e) =>
                      setHfov({ ...hfov, meanAirwayPressureCmH2O: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-cyan-500"
                  />
                  <span className="text-[10px] text-slate-400">Controls lung recruitment and PaO2</span>
                </div>

                {/* Amplitude (Delta P) */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Oscillatory Amplitude (&Delta;P / Power)</span>
                    <span className="font-mono font-bold text-purple-400">{hfov.amplitudeDeltaPCmH2O} cmH2O</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="1"
                    value={hfov.amplitudeDeltaPCmH2O}
                    onChange={(e) =>
                      setHfov({ ...hfov, amplitudeDeltaPCmH2O: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-purple-500"
                  />
                  <span className="text-[10px] text-slate-400">Drives piston stroke and tidal volume</span>
                </div>

                {/* Frequency (Hz) */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Frequency (Hz &bull; cycles/sec)</span>
                    <span className="font-mono font-bold text-cyan-400">{hfov.frequencyHz} Hz ({hfov.frequencyHz * 60} bpm)</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="15"
                    step="1"
                    value={hfov.frequencyHz}
                    onChange={(e) =>
                      setHfov({ ...hfov, frequencyHz: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-cyan-500"
                  />
                  <span className="text-[10px] text-amber-300 font-medium">
                    Counter-intuitive: LOWER frequency = HIGHER tidal volume &amp; LOWER PaCO2!
                  </span>
                </div>

                {/* FiO2 */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Fraction of Inspired Oxygen (FiO2)</span>
                    <span className="font-mono font-bold text-slate-200">{hfov.fio2Pct}%</span>
                  </div>
                  <input
                    type="range"
                    min="21"
                    max="100"
                    step="1"
                    value={hfov.fio2Pct}
                    onChange={(e) => setHfov({ ...hfov, fio2Pct: parseInt(e.target.value, 10) })}
                    className="w-full accent-cyan-500"
                  />
                  <span className="text-[10px] text-slate-400">Target SpO2 90 &ndash; 95% in preterms</span>
                </div>
              </div>

              {/* Counter-Intuitive Guidance Banner */}
              <div className="p-3 bg-purple-950/40 border border-purple-500/40 rounded-xl text-xs text-purple-200">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-purple-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  HFOV Golden Rule: Ventilation vs Conventional
                </div>
                <p className="text-[11px] text-purple-300/90 leading-relaxed">
                  {evaluation.frequencyAdjustmentGuidance}
                </p>
              </div>
            </div>

            {/* ABG Guidance Card */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  mPaw &amp; Oxygenation Guidance
                </h3>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <p className="text-[11px] text-slate-400">
                    {evaluation.mPawOptimizationGuidance}
                  </p>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-cyan-400">Infant Profile</div>
                  <div className="text-[11px] text-slate-400">
                    Gestational Age: {demographics.gestationalAgeWeeks} wks &bull; Weight: {demographics.birthWeightGrams} g
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Primary Diagnosis: <strong className="text-slate-200">{demographics.diagnosis}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SURFACTANT & LAPLACE */}
        {activeTab === 'surfactant' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-200">
                    Exogenous Surfactant Kinematics &amp; Laplace&apos;s Law
                  </h2>
                  <p className="text-xs text-slate-400">
                    Surfactant replaces deficient DPPC, reducing surface tension (&gamma;) and stabilizing alveoli at end-expiration.
                  </p>
                </div>

                <button
                  onClick={handleAdministerSurfactant}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                >
                  <Droplets className="w-3.5 h-3.5" />
                  Administer LISA Surfactant
                </button>
              </div>

              {/* Laplace Law Interactive Simulator */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-300 uppercase">
                    Laplace Alveolar Collapsing Pressure Solver
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    P = 2&gamma; / r = {laplacePressure} cmH2O
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Surface Tension (&gamma;)</span>
                      <span className="font-mono font-bold text-slate-200">{surfactant.alveolarSurfaceTensionMnm} mN/m</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="70"
                      step="1"
                      value={surfactant.alveolarSurfaceTensionMnm}
                      onChange={(e) =>
                        setSurfactant({
                          ...surfactant,
                          alveolarSurfaceTensionMnm: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full accent-cyan-500"
                    />
                    <span className="text-[10px] text-slate-400">Normal with surfactant &lt; 10 mN/m; Water = 70</span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Alveolar Radius (r)</span>
                      <span className="font-mono font-bold text-slate-200">{alveolarRadiusMicrons} &mu;m</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="120"
                      step="5"
                      value={alveolarRadiusMicrons}
                      onChange={(e) => setAlveolarRadiusMicrons(parseInt(e.target.value, 10))}
                      className="w-full accent-cyan-500"
                    />
                    <span className="text-[10px] text-slate-400">Small preterm alveoli collapse easily</span>
                  </div>
                </div>
              </div>

              {/* Delivery Methods Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <strong className="text-cyan-400 block mb-1">LISA / MIST</strong>
                  <p className="text-[11px] text-slate-400">
                    Thin angiocatheter placed through vocal cords under direct laryngoscopy while infant maintains spontaneous breathing on CPAP. Minimizes ventilator-induced lung injury (VILI).
                  </p>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <strong className="text-purple-400 block mb-1">InSurE</strong>
                  <p className="text-[11px] text-slate-400">
                    Intubate &ndash; Surfactant &ndash; Extubate. Brief ETT placement for bolus administration, followed by rapid extubation to CPAP within 60 minutes.
                  </p>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <strong className="text-amber-400 block mb-1">Poractant Alfa Dose</strong>
                  <p className="text-[11px] text-slate-400">
                    Initial dose 200 mg/kg (2.5 mL/kg) provides faster weaning of oxygen and lower mortality compared to 100 mg/kg dose in severe RDS.
                  </p>
                </div>
              </div>
            </div>

            {/* Surfactant Status */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Surfactant Kinetics Status
                </h3>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {evaluation.surfactantEffectSummary}
                  </p>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <div className="font-bold text-cyan-400 mb-1">Compliance Surge Warning</div>
                  <p className="text-[11px] text-slate-400">
                    Following surfactant, dynamic lung compliance can double within 15&ndash;30 minutes. If amplitude (&Delta;P) is not promptly weaned, delivered tidal volume will surge, causing acute hypocapnia, pneumothorax, and intraventricular hemorrhage (IVH).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OPEN-LUNG HYSTERESIS STRATEGY */}
        {activeTab === 'open_lung' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-200">
                    Open-Lung Strategy &amp; Deflation Limb Optimization
                  </h2>
                  <p className="text-xs text-slate-400">
                    Alveolar recruitment displays pressure-volume hysteresis. Setting mPaw on the deflation limb provides maximum alveolar surface area with minimum airway pressure.
                  </p>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  Deflation Limb Target
                </span>
              </div>

              {/* Stepwise Recruitment Controller */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase">
                  Stepwise Recruitment Protocol
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setHfov((prev) => ({
                        ...prev,
                        meanAirwayPressureCmH2O: Math.min(26, prev.meanAirwayPressureCmH2O + 2),
                      }));
                      setBiomechanics((prev) => ({
                        ...prev,
                        alveolarRecruitmentPct: Math.min(98, prev.alveolarRecruitmentPct + 12),
                      }));
                    }}
                    className="py-2 px-3 bg-cyan-600/80 hover:bg-cyan-600 text-white text-xs font-bold rounded-lg transition"
                  >
                    Step Up mPaw (+2 cmH2O)
                  </button>

                  <button
                    onClick={() => {
                      setHfov((prev) => ({
                        ...prev,
                        meanAirwayPressureCmH2O: Math.max(8, prev.meanAirwayPressureCmH2O - 1),
                      }));
                    }}
                    className="py-2 px-3 bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition"
                  >
                    Step Down mPaw (-1 cmH2O)
                  </button>

                  <button
                    onClick={() => {
                      setHfov((prev) => ({
                        ...prev,
                        meanAirwayPressureCmH2O: 12,
                        fio2Pct: 25,
                      }));
                      setBiomechanics((prev) => ({
                        ...prev,
                        isOpenLungOptimized: true,
                        alveolarRecruitmentPct: 92,
                      }));
                      alert('Optimal mPaw set at Pclose + 2 cmH2O (12 cmH2O). FiO2 successfully weaned to 25%!');
                    }}
                    className="py-2 px-3 bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition"
                  >
                    Set Optimal (Pclose + 2)
                  </button>
                </div>
              </div>

              {/* Protocol Walkthrough */}
              <div className="space-y-2 pt-2">
                {[
                  {
                    step: 'Phase 1: Incremental Recruitment (Inflation Limb)',
                    desc: 'Increase mPaw by 1 - 2 cmH2O every 2 to 3 minutes while monitoring SpO2. Continue until FiO2 requirements fall below 0.30 (Alveolar Opening Pressure).',
                  },
                  {
                    step: 'Phase 2: Decremental Titration (Deflation Limb)',
                    desc: 'Decrease mPaw by 1 cmH2O every 2 to 3 minutes until SpO2 drops or FiO2 requirement rises. This identifies Alveolar Closing Pressure (P_close).',
                  },
                  {
                    step: 'Phase 3: Re-Recruitment & Optimal mPaw Lock',
                    desc: 'Re-open lung by returning to opening pressure for 1 minute, then set target mPaw at P_close + 2 cmH2O on the deflation limb.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                    <div className="font-bold text-cyan-400 mb-0.5">{item.step}</div>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lung Recruitment Card */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Alveolar Surface Area Status
                </h3>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-slate-400">Alveolar Recruitment</span>
                    <span className="font-mono font-bold text-cyan-400">
                      {biomechanics.alveolarRecruitmentPct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full transition-all duration-300"
                      style={{ width: `${biomechanics.alveolarRecruitmentPct}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <div className="font-bold text-emerald-400 mb-1">Chest X-Ray Rib Counting</div>
                  <p className="text-[11px] text-slate-400">
                    Optimal FRC on HFOV corresponds to 8 to 9 posterior ribs visible above the diaphragm on inspiratory chest radiograph. &lt; 8 ribs indicates atelectasis; &gt; 9.5 ribs indicates lung overdistension and air leak risk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GAS TRANSPORT PHYSICS */}
        {activeTab === 'physics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
              <div>
                <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Non-Bulk Flow Gas Transport Mechanisms in HFOV
                </h2>
                <p className="text-xs text-slate-400">
                  Because tidal volume on HFOV is smaller than anatomical dead space, standard bulk convective flow fails to explain gas exchange. Five synergistic physical mechanisms govern ventilation:
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  {
                    title: '1. Taylor Dispersion (Longitudinal Shear Mixing)',
                    desc: 'Laminar parabolic flow produces a velocity gradient between the high-velocity center and slow-velocity airway walls. Radial molecular diffusion across these streamlines greatly enhances axial dispersion of CO2.',
                  },
                  {
                    title: '2. Pendelluft (Inter-Alveolar Collateral Flow)',
                    desc: 'Adjacent alveolar units possess different time constants (resistance × compliance). During high-frequency oscillation, gas sloshes asynchronously between fast and slow lung units before exiting, facilitating regional gas mixing.',
                  },
                  {
                    title: '3. Asymmetric Velocity Profiles',
                    desc: 'Inspiration produces a sharp, bullet-shaped central core profile, while active expiration produces a blunt, flat annulus along the airway perimeter. Net inspiratory gas flows forward centrally, while expired gas exits peripherally.',
                  },
                  {
                    title: '4. Direct Alveolar Bulk Convection',
                    desc: 'In proximal subpleural alveoli close to the central conducting airways, small tidal volumes directly ventilate alveolar units through bulk flow.',
                  },
                  {
                    title: '5. Molecular Diffusion at the Acinus',
                    desc: 'At the alveolar-capillary junction where cross-sectional area expands exponentially, air velocity slows to zero and molecular diffusion alone transports O2 and CO2 across the blood-gas barrier.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                    <div className="font-bold text-cyan-300 mb-1">{item.title}</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Transport Summary */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  DCO2 Mathematical Derivation
                </h3>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300 space-y-1">
                  <div>V_A = f &times; V_t (Conventional)</div>
                  <div className="text-purple-300 font-bold">DCO2 = f &times; (V_thf)&sup2; (HFOV)</div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  In conventional ventilation, minute ventilation is linear with tidal volume. In HFOV, carbon dioxide clearance is proportional to the <strong>square</strong> of the oscillatory tidal volume. Thus, changes in amplitude (&Delta;P) have a dramatically greater impact on PaCO2 than changes in frequency.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Clinical Alerts Box */}
        {evaluation.alerts.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-amber-950/30 border border-amber-500/40">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase mb-2">
              <AlertTriangle className="w-4 h-4" />
              Active Neonatal Respiratory Alerts
            </div>
            <ul className="space-y-1 text-xs text-amber-200">
              {evaluation.alerts.map((alert, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px]">
                  <span>&bull;</span>
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
