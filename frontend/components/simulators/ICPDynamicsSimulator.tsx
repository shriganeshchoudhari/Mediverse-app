'use client';

import React, { useState, useMemo } from 'react';
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
  Brain,
  Activity,
  Gauge,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Sliders,
  Eye,
  TrendingUp,
  Layers,
  Heart,
  Droplet,
  Zap,
} from 'lucide-react';
import {
  HerniationType,
  LundbergWaveType,
  TieredInterventions,
  ICPPatientParameters,
  calculateICPDynamics,
  generateICPPulseWaveform,
  generateMonroKellieCurve,
  generateLundbergTrend,
  ICP_PRESETS,
} from '@/.gemini/skills/ICPDynamicsEngine';

export default function ICPDynamicsSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('tbi-acute-subdural');

  // Patient Parameters
  const [massVolume, setMassVolume] = useState<number>(65);
  const [map, setMap] = useState<number>(95);
  const [paCO2, setPaCO2] = useState<number>(40);
  const [temperatureC, setTemperatureC] = useState<number>(37.2);
  const [isUnilateralTemporal, setIsUnilateralTemporal] = useState<boolean>(true);

  // Tiered Interventions
  const [headOfBed30, setHeadOfBed30] = useState<boolean>(true);
  const [sedation, setSedation] = useState<boolean>(true);
  const [evdActive, setEvdActive] = useState<boolean>(false);
  const [evdVolumeDrained, setEvdVolumeDrained] = useState<number>(0);
  const [mannitolActive, setMannitolActive] = useState<boolean>(false);
  const [hypertonicSalineActive, setHypertonicSalineActive] = useState<boolean>(false);
  const [hyperventPaCO2, setHyperventPaCO2] = useState<number>(40);
  const [paralyticActive, setParalyticActive] = useState<boolean>(false);
  const [hypothermiaActive, setHypothermiaActive] = useState<boolean>(false);
  const [barbiturateActive, setBarbiturateActive] = useState<boolean>(false);
  const [craniectomyActive, setCraniectomyActive] = useState<boolean>(false);

  // Active Visualization View
  const [activeView, setActiveView] = useState<'pulse' | 'monro-kellie' | 'lundberg'>('pulse');
  const [selectedLundbergWave, setSelectedLundbergWave] = useState<LundbergWaveType>('NONE');

  // Load Preset
  const loadPreset = (presetId: string) => {
    const preset = ICP_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);

    setMassVolume(preset.patientParams.massLesionVolumeMl);
    setMap(preset.patientParams.meanArterialPressureMmHg);
    setPaCO2(preset.patientParams.paCO2MmHg);
    setTemperatureC(preset.patientParams.temperatureC);
    setIsUnilateralTemporal(preset.patientParams.isUnilateralTemporalMass);

    setHeadOfBed30(preset.interventions.headOfBed30Deg);
    setSedation(preset.interventions.sedationAnalgesia);
    setEvdActive(preset.interventions.evdDrainageActive);
    setEvdVolumeDrained(preset.interventions.evdDrainedVolumeMl);
    setMannitolActive(preset.interventions.hyperosmolarMannitol);
    setHypertonicSalineActive(preset.interventions.hyperosmolarHypertonicSaline);
    setHyperventPaCO2(preset.interventions.hyperventilationPaCO2);
    setParalyticActive(preset.interventions.neuromuscularBlockade);
    setHypothermiaActive(preset.interventions.moderateHypothermia);
    setBarbiturateActive(preset.interventions.barbiturateComa);
    setCraniectomyActive(preset.interventions.decompressiveCraniectomy);

    if (presetId === 'lundberg-a-plateau') {
      setSelectedLundbergWave('LUNDBERG_A');
      setActiveView('lundberg');
    } else {
      setSelectedLundbergWave('NONE');
    }
  };

  // Active Parameters Object
  const currentParams: ICPPatientParameters = useMemo(() => ({
    massLesionVolumeMl: massVolume,
    meanArterialPressureMmHg: map,
    paCO2MmHg: paCO2,
    temperatureC,
    baselineICPMmHg: 10,
    isUnilateralTemporalMass: isUnilateralTemporal,
  }), [massVolume, map, paCO2, temperatureC, isUnilateralTemporal]);

  // Active Interventions Object
  const currentInterventions: TieredInterventions = useMemo(() => ({
    headOfBed30Deg: headOfBed30,
    sedationAnalgesia: sedation,
    evdDrainageActive: evdActive,
    evdDrainedVolumeMl: evdVolumeDrained,
    hyperosmolarMannitol: mannitolActive,
    hyperosmolarHypertonicSaline: hypertonicSalineActive,
    hyperventilationPaCO2: hyperventPaCO2,
    neuromuscularBlockade: paralyticActive,
    moderateHypothermia: hypothermiaActive,
    barbiturateComa: barbiturateActive,
    decompressiveCraniectomy: craniectomyActive,
  }), [
    headOfBed30,
    sedation,
    evdActive,
    evdVolumeDrained,
    mannitolActive,
    hypertonicSalineActive,
    hyperventPaCO2,
    paralyticActive,
    hypothermiaActive,
    barbiturateActive,
    craniectomyActive,
  ]);

  // Dynamic Engine Computation
  const icpResult = useMemo(() => {
    return calculateICPDynamics(currentParams, currentInterventions);
  }, [currentParams, currentInterventions]);

  // Waveform & Curves
  const pulseWaveData = useMemo(() => generateICPPulseWaveform(icpResult), [icpResult]);
  const monroKellieData = useMemo(() => generateMonroKellieCurve(currentParams, currentInterventions), [currentParams, currentInterventions]);
  const lundbergData = useMemo(() => generateLundbergTrend(currentParams, currentInterventions, selectedLundbergWave), [currentParams, currentInterventions, selectedLundbergWave]);

  // Socratic AI Tutor Bridge
  const handleAskAI = () => {
    const activePreset = ICP_PRESETS.find(p => p.id === selectedPresetId);
    const context = `Neurocritical Care & Intracranial Pressure (ICP / TBI) Workstation:
Patient Profile: ${activePreset?.patientProfile || 'Severe TBI Patient'}
Diagnosis: ${activePreset?.diagnosis || 'Traumatic Brain Injury with High ICP'}
Operating Vitals:
- ICP: ${icpResult.icpMmHg} mmHg (Alarm: ${icpResult.icpMmHg > 22 ? 'HIGH ICP' : 'NORMAL'})
- MAP: ${map} mmHg
- Cerebral Perfusion Pressure (CPP): ${icpResult.cppMmHg} mmHg (BTF Target 60 - 70 mmHg: ${icpResult.cppMmHg < 60 ? 'ISCHEMIA RISK' : 'Adequate'})
- Monro-Kellie Mass Volume: ${massVolume} mL
- Compliance Status: ${icpResult.complianceState}
- Waveform Morphology: ${icpResult.isP2Elevated ? 'P2 > P1 (Brain Compliance Failure)' : 'P1 > P2 (Normal Compliance)'}
- Neurological Assessment: GCS ${icpResult.glasgowComaScale}, Right Pupil: ${icpResult.pupilRightMm} mm (${icpResult.pupilRightReactive ? 'Reactive' : 'FIXED'}), Left Pupil: ${icpResult.pupilLeftMm} mm (${icpResult.pupilLeftReactive ? 'Reactive' : 'FIXED'})
- Herniation Status: ${icpResult.herniationType} (Cushing Triad: ${icpResult.isCushingTriadActive ? 'ACTIVE MEDULLARY COMPRESSION' : 'No'})
Active Tiered Interventions:
- Tier 0: Head of Bed 30°: ${headOfBed30}, Sedation: ${sedation}
- Tier 1: EVD Drainage: ${evdActive ? `${evdVolumeDrained} mL` : 'Inactive'}, Mannitol: ${mannitolActive}, 3% NaCl: ${hypertonicSalineActive}, PaCO2: ${hyperventPaCO2} mmHg
- Tier 2: Paralytic: ${paralyticActive}, Hypothermia: ${hypothermiaActive}
- Tier 3: Barbiturate Coma: ${barbiturateActive}, Decompressive Craniectomy: ${craniectomyActive}
Please explain the Monro-Kellie biophysics, cerebral autoregulation curve, and emergency escalation protocol for this clinical presentation.`;

    window.dispatchEvent(new CustomEvent('mediverse:open-ai-with-context', { detail: { context } }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Top Station Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-600/20 border border-purple-500/30 rounded-xl text-purple-400">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                Neurocritical Care &amp; Intracranial Pressure (ICP) Workstation
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/70 border border-purple-700/60 text-purple-300 font-medium">
                  BTF Guidelines
                </span>
              </h1>
              <p className="text-sm text-slate-400">
                Monro-Kellie volume-pressure elastance, P1-P3 pulse waveforms, Lundberg A/B/C waves &amp; tiered herniation management.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold text-sm ${
                icpResult.herniationType !== 'NONE' || icpResult.isCushingTriadActive
                  ? 'bg-rose-950/60 border-rose-600 text-rose-300 animate-pulse'
                  : icpResult.icpMmHg > 22 || icpResult.cppMmHg < 60
                  ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                  : 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
              }`}
            >
              {icpResult.isCushingTriadActive ? (
                <>
                  <AlertOctagon className="w-4 h-4" />
                  <span>CUSHING TRIAD (MEDULLARY COMPRESSION)</span>
                </>
              ) : icpResult.herniationType !== 'NONE' ? (
                <>
                  <AlertOctagon className="w-4 h-4" />
                  <span>{icpResult.herniationType} HERNIATION ACTIVE</span>
                </>
              ) : icpResult.icpMmHg > 22 ? (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>CRITICAL HIGH ICP (&gt;22)</span>
                </>
              ) : icpResult.cppMmHg < 60 ? (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>CEREBRAL ISCHEMIA (CPP &lt; 60)</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>INTRACRANIAL DYNAMICS STABLE</span>
                </>
              )}
            </div>

            <button
              onClick={handleAskAI}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 border border-purple-400/30 text-white text-sm font-semibold flex items-center gap-2 transition shadow-lg shadow-purple-600/20"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Consult Socratic AI</span>
            </button>
          </div>
        </div>

        {/* Clinical Presets Grid */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              High-Yield Neurocritical Presets
            </span>
            <button
              onClick={() => loadPreset('tbi-acute-subdural')}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {ICP_PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => loadPreset(p.id)}
                className={`text-left p-2.5 rounded-xl border text-xs transition ${
                  selectedPresetId === p.id
                    ? 'bg-purple-950/60 border-purple-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold truncate">{p.title.split('with')[0]}</div>
                <div className="text-[11px] text-slate-400 truncate">{p.id.split('-')[0].toUpperCase()}</div>
                <div className="mt-1 text-[10px] text-purple-400 font-mono truncate">{p.patientProfile.split('(')[0]}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Vitals & Pupillary Assessment HUD Banner */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* ICP */}
        <div
          className={`border p-3.5 rounded-xl text-center space-y-1 ${
            icpResult.icpMmHg > 22
              ? 'bg-rose-950/40 border-rose-600'
              : icpResult.icpMmHg > 15
              ? 'bg-amber-950/40 border-amber-600'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Intracranial Pressure (ICP)</span>
          <div
            className={`text-2xl font-mono font-black ${
              icpResult.icpMmHg > 22 ? 'text-rose-400 animate-pulse' : 'text-purple-400'
            }`}
          >
            {icpResult.icpMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Target &le; 20 - 22</span>
        </div>

        {/* MAP */}
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Mean Arterial (MAP)</span>
          <div className="text-2xl font-mono font-black text-sky-400">
            {map} <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Systemic Perfusion</span>
        </div>

        {/* CPP */}
        <div
          className={`border p-3.5 rounded-xl text-center space-y-1 ${
            icpResult.cppMmHg < 60
              ? 'bg-rose-950/40 border-rose-600'
              : icpResult.cppMmHg > 85
              ? 'bg-amber-950/40 border-amber-600'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Cerebral Perfusion (CPP)</span>
          <div
            className={`text-2xl font-mono font-black ${
              icpResult.cppMmHg < 60 ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {icpResult.cppMmHg} <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <span className="text-[10px] text-slate-500 block">BTF: 60 - 70 mmHg</span>
        </div>

        {/* Intracranial Compliance */}
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Compliance Status</span>
          <div
            className={`text-xs font-bold uppercase mt-1 ${
              icpResult.complianceState === 'DECOMPENSATED_CRITICAL'
                ? 'text-rose-400'
                : icpResult.complianceState === 'COMPENSATED_HIGH_ELASTANCE'
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {icpResult.complianceState.replace(/_/g, ' ')}
          </div>
          <span className="text-[10px] text-slate-500 block">
            {icpResult.isP2Elevated ? 'P2 > P1 (Stiff Brain)' : 'P1 > P2 (Compliant)'}
          </span>
        </div>

        {/* Pupillary Assessment */}
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
            <Eye className="w-3.5 h-3.5" /> Pupils (R / L)
          </span>
          <div className="flex items-center justify-center gap-4 py-0.5">
            {/* Right Pupil */}
            <div className="flex flex-col items-center">
              <div
                className="rounded-full bg-slate-950 border border-amber-400 flex items-center justify-center shadow"
                style={{
                  width: `${Math.max(14, icpResult.pupilRightMm * 3.5)}px`,
                  height: `${Math.max(14, icpResult.pupilRightMm * 3.5)}px`,
                }}
              >
                <div
                  className="rounded-full bg-amber-300"
                  style={{ width: `${icpResult.pupilRightMm * 2.2}px`, height: `${icpResult.pupilRightMm * 2.2}px` }}
                />
              </div>
              <span className="text-[9px] text-slate-400 mt-1">R: {icpResult.pupilRightMm}mm</span>
            </div>

            {/* Left Pupil */}
            <div className="flex flex-col items-center">
              <div
                className="rounded-full bg-slate-950 border border-amber-400 flex items-center justify-center shadow"
                style={{
                  width: `${Math.max(14, icpResult.pupilLeftMm * 3.5)}px`,
                  height: `${Math.max(14, icpResult.pupilLeftMm * 3.5)}px`,
                }}
              >
                <div
                  className="rounded-full bg-amber-300"
                  style={{ width: `${icpResult.pupilLeftMm * 2.2}px`, height: `${icpResult.pupilLeftMm * 2.2}px` }}
                />
              </div>
              <span className="text-[9px] text-slate-400 mt-1">L: {icpResult.pupilLeftMm}mm</span>
            </div>
          </div>
          <span className="text-[9px] text-slate-500 block">
            {icpResult.pupilRightReactive && icpResult.pupilLeftReactive ? 'Both Reactive' : 'Anisocoria / Fixed'}
          </span>
        </div>

        {/* Glasgow Coma Scale (GCS) */}
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Glasgow Coma Scale</span>
          <div className="text-2xl font-mono font-black text-amber-400">
            E+V+M = {icpResult.glasgowComaScale} <span className="text-xs font-normal text-slate-400">/ 15</span>
          </div>
          <span className="text-[10px] text-slate-500 block">
            {icpResult.glasgowComaScale <= 8 ? 'Severe TBI (Intubated)' : 'Moderate TBI'}
          </span>
        </div>
      </div>

      {/* Main Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Patient Controls & Tiered Interventions */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            Patient Hemodynamics &amp; Monro-Kellie Mass
          </h2>

          {/* Mass Lesion Volume Slider */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Intracranial Mass Lesion Volume</span>
              <span className="font-mono text-rose-400 font-bold">{massVolume} mL</span>
            </div>
            <input
              type="range"
              min={0}
              max={120}
              step={5}
              value={massVolume}
              onChange={e => setMassVolume(+e.target.value)}
              className="w-full accent-rose-500"
            />
            <span className="text-[10px] text-slate-500 block">
              Spatial buffering capacity ~55 mL before exponential compliance failure
            </span>
          </div>

          {/* MAP Slider */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Mean Arterial Pressure (MAP)</span>
              <span className="font-mono text-sky-400 font-bold">{map} mmHg</span>
            </div>
            <input
              type="range"
              min={50}
              max={160}
              step={5}
              value={map}
              onChange={e => setMap(+e.target.value)}
              className="w-full accent-sky-500"
            />
          </div>

          {/* PaCO2 Slider */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Arterial PaCO2</span>
              <span className="font-mono text-emerald-400 font-bold">{paCO2} mmHg</span>
            </div>
            <input
              type="range"
              min={24}
              max={55}
              step={1}
              value={paCO2}
              onChange={e => {
                setPaCO2(+e.target.value);
                setHyperventPaCO2(+e.target.value);
              }}
              className="w-full accent-emerald-500"
            />
            <span className="text-[10px] text-slate-500 block">
              Cerebrovascular tone: &plusmn;3% CBF per 1 mmHg PaCO2
            </span>
          </div>

          {/* Unilateral Temporal Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={isUnilateralTemporal}
                onChange={e => setIsUnilateralTemporal(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-purple-600"
              />
              <span className="text-slate-200 font-medium">
                Unilateral Temporal Mass (Uncal Herniation Risk)
              </span>
            </label>
          </div>

          {/* Brain Trauma Foundation (BTF) Tiered Protocol Box */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                BTF Tiered Interventions
              </span>
            </div>

            {/* Tier 0 */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Tier 0: Baseline Neuroprotection</span>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={headOfBed30}
                    onChange={e => setHeadOfBed30(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-purple-600"
                  />
                  <span className="text-[11px] text-slate-300">Head of Bed 30&deg;</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sedation}
                    onChange={e => setSedation(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-purple-600"
                  />
                  <span className="text-[11px] text-slate-300">Analgesia / Sedation</span>
                </label>
              </div>
            </div>

            {/* Tier 1 */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs">
              <span className="text-[10px] font-bold text-sky-400 uppercase block">Tier 1: Osmolar &amp; CSF Drainage</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setHypertonicSalineActive(!hypertonicSalineActive)}
                  className={`py-1 px-2 rounded text-[11px] font-semibold border text-left transition ${
                    hypertonicSalineActive
                      ? 'bg-sky-950 border-sky-500 text-sky-200'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  3% NaCl Bolus (250 mL)
                </button>
                <button
                  onClick={() => setMannitolActive(!mannitolActive)}
                  className={`py-1 px-2 rounded text-[11px] font-semibold border text-left transition ${
                    mannitolActive
                      ? 'bg-sky-950 border-sky-500 text-sky-200'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  Mannitol 20% (1 g/kg)
                </button>
              </div>

              {/* EVD Drainage */}
              <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={evdActive}
                    onChange={e => {
                      setEvdActive(e.target.checked);
                      if (e.target.checked && evdVolumeDrained === 0) setEvdVolumeDrained(12);
                    }}
                    className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-sky-600"
                  />
                  <span className="text-[11px] text-slate-200 font-semibold">EVD Vent Drainage</span>
                </label>
                {evdActive && (
                  <span className="text-[11px] font-mono text-sky-400">{evdVolumeDrained} mL drained</span>
                )}
              </div>
            </div>

            {/* Tier 2 & 3 */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs">
              <span className="text-[10px] font-bold text-rose-400 uppercase block">Tier 2 &amp; 3: Advanced Rescue</span>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paralyticActive}
                    onChange={e => setParalyticActive(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-rose-600"
                  />
                  <span className="text-[11px] text-slate-300">Neuromuscular Block</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={barbiturateActive}
                    onChange={e => setBarbiturateActive(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-rose-600"
                  />
                  <span className="text-[11px] text-slate-300">Barbiturate Coma</span>
                </label>
              </div>

              <div className="pt-1.5 border-t border-slate-800/80">
                <button
                  onClick={() => setCraniectomyActive(!craniectomyActive)}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold border transition ${
                    craniectomyActive
                      ? 'bg-rose-950 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {craniectomyActive ? 'Decompressive Craniectomy Active' : 'Perform Decompressive Craniectomy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center & Right Columns: Diagnostic Waveforms & Curves */}
        <div className="lg:col-span-2 space-y-6">
          {/* Waveform Selector Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveView('pulse')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                activeView === 'pulse'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/40'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>ICP Pulse Waveform (P1 / P2 / P3)</span>
            </button>
            <button
              onClick={() => setActiveView('monro-kellie')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                activeView === 'monro-kellie'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/40'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Monro-Kellie Elastance Curve</span>
            </button>
            <button
              onClick={() => setActiveView('lundberg')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                activeView === 'lundberg'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/40'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>30-Min Lundberg Wave Monitoring</span>
            </button>
          </div>

          {/* View 1: ICP Pulse Waveform */}
          {activeView === 'pulse' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" />
                    Micro-Scale ICP Pulse Waveform (Single Cardiac Cycle)
                  </h3>
                  <p className="text-xs text-slate-400">
                    P1 (Percussion) = {icpResult.p1Amplitude} mmHg | P2 (Tidal) = {icpResult.p2Amplitude} mmHg | P3 (Dicrotic) = {icpResult.p3Amplitude} mmHg
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    icpResult.isP2Elevated
                      ? 'bg-rose-950/60 border-rose-600 text-rose-300'
                      : 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                  }`}
                >
                  {icpResult.isP2Elevated ? 'P2 > P1 (Brain Compliance Failure)' : 'P1 > P2 (Normal Brain Compliance)'}
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pulseWaveData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="timeSec" stroke="#94a3b8" tick={{ fontSize: 12 }} label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                    <YAxis stroke="#94a3b8" domain={['auto', 'auto']} tick={{ fontSize: 12 }} label={{ value: 'Pressure (mmHg)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                      formatter={(val: any) => [`${val} mmHg`, 'ICP Pulse']}
                    />
                    <ReferenceLine y={20} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Pathological ICP (20 mmHg)', fill: '#f59e0b', fontSize: 10, position: 'right' }} />
                    <Line
                      type="monotone"
                      dataKey="pressureMmHg"
                      name="ICP Pulse Wave"
                      stroke={icpResult.isP2Elevated ? '#f43f5e' : '#a855f7'}
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 grid grid-cols-3 gap-4 text-center">
                <div>
                  <strong className="text-purple-300 block mb-0.5">P1: Percussion Wave</strong>
                  <span className="text-[11px] text-slate-400">Arterial pulse wave transmitted through choroid plexus into ventricles.</span>
                </div>
                <div>
                  <strong className="text-purple-300 block mb-0.5">P2: Tidal Wave</strong>
                  <span className="text-[11px] text-slate-400">Brain tissue elastance. P2 &gt; P1 confirms intracranial spatial buffer exhaustion.</span>
                </div>
                <div>
                  <strong className="text-purple-300 block mb-0.5">P3: Dicrotic Wave</strong>
                  <span className="text-[11px] text-slate-400">Aortic valve closure and venous pulse wave reflection.</span>
                </div>
              </div>
            </div>
          )}

          {/* View 2: Monro-Kellie Curve */}
          {activeView === 'monro-kellie' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    Monro-Kellie Volume-Pressure Elastance Curve
                  </h3>
                  <p className="text-xs text-slate-400">
                    Operating point: {massVolume} mL added volume &rarr; ICP {icpResult.icpMmHg} mmHg
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-purple-300 font-mono">
                  Compensatory Buffer: 55 mL
                </span>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monroKellieData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="volumeMl" stroke="#94a3b8" tick={{ fontSize: 12 }} label={{ value: 'Added Mass Volume (mL)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} label={{ value: 'ICP (mmHg)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                      formatter={(val: any) => [`${val} mmHg`, 'ICP']}
                    />
                    <ReferenceLine x={55} stroke="#38bdf8" strokeDasharray="3 3" label={{ value: 'Buffer Exhaustion (55 mL)', fill: '#38bdf8', fontSize: 10, position: 'top' }} />
                    <ReferenceLine y={22} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'Critical Threshold (22 mmHg)', fill: '#f43f5e', fontSize: 10, position: 'right' }} />
                    <Line
                      type="monotone"
                      dataKey="icpMmHg"
                      name="Monro-Kellie Curve"
                      stroke="#c084fc"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed">
                <strong>Monro-Kellie Doctrine:</strong> The rigid cranium has fixed internal volume (V_brain + V_blood + V_CSF = Constant). Volume expansion up to ~55 mL is initially buffered by CSF translocation into the thecal sac and venous blood displacement. Once this reserve is depleted, compliance collapses and ICP surges exponentially.
              </div>
            </div>
          )}

          {/* View 3: Lundberg Wave Monitoring */}
          {activeView === 'lundberg' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    30-Minute Continuous ICP &amp; CPP Monitoring
                  </h3>
                  <p className="text-xs text-slate-400">
                    Simulate Lundberg A (plateau), B (vascular oscillations), and C (Traube-Hering) wave patterns.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Waveform Type:</span>
                  <select
                    value={selectedLundbergWave}
                    onChange={e => setSelectedLundbergWave(e.target.value as any)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-200"
                  >
                    <option value="NONE">Baseline Continuous</option>
                    <option value="LUNDBERG_A">Lundberg A (Plateau Waves 60-80 mmHg)</option>
                    <option value="LUNDBERG_B">Lundberg B (Rhythmic 1-2/min)</option>
                    <option value="LUNDBERG_C">Lundberg C (Traube-Hering-Mayer)</option>
                  </select>
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lundbergData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="minute" stroke="#94a3b8" tick={{ fontSize: 12 }} label={{ value: 'Minutes of Monitoring', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                    <YAxis stroke="#94a3b8" domain={[0, 120]} tick={{ fontSize: 12 }} label={{ value: 'Pressure (mmHg)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                    />
                    <ReferenceLine y={60} stroke="#38bdf8" strokeDasharray="3 3" label={{ value: 'Target CPP (60 mmHg)', fill: '#38bdf8', fontSize: 10, position: 'right' }} />
                    <ReferenceLine y={22} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Critical ICP (22 mmHg)', fill: '#ef4444', fontSize: 10, position: 'right' }} />
                    <Line type="monotone" dataKey="icpMmHg" name="ICP (mmHg)" stroke="#f43f5e" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="cppMmHg" name="CPP (mmHg)" stroke="#38bdf8" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed">
                <strong>Lundberg A Waves (Plateau Waves):</strong> Steep, sudden increases in ICP to 50 - 100 mmHg lasting 5 to 20 minutes, followed by precipitous falls. They denote critical decompensation of intracranial compliance with cerebral ischemia and herald impending brain herniation.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
