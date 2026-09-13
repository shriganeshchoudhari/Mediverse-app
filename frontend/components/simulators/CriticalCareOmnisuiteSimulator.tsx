'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Activity,
  Heart,
  Wind,
  Droplets,
  RotateCcw,
  CheckCircle2,
  Syringe,
  Layers,
  ArrowUpRight,
  Sparkles,
  Search,
  FileText,
  Clock,
  Eye,
  Brain,
  Gauge,
  Sliders,
  Cpu,
} from 'lucide-react';
import {
  simulateCriticalCareOmnisuite,
  OmnisuitePatientParams,
  OmnisuiteScenario,
  EclsConfiguration,
  VasopressorStrategy,
  MechanicalVentilationMode,
} from '../../.gemini/skills/CriticalCareOmnisuiteEngine';

export default function CriticalCareOmnisuiteSimulator() {
  // Simulator State
  const [scenario, setScenario] = useState<OmnisuiteScenario>('CARDIOGENIC_SHOCK_HARLEQUIN_ECMO');
  const [eclsConfig, setEclsConfig] = useState<EclsConfiguration>('VA_ECMO_PERIPHERAL');
  const [ecmoFlowLpm, setEcmoFlowLpm] = useState<number>(4.5);
  const [impellaPLevel, setImpellaPLevel] = useState<number>(0);
  const [vasopressor, setVasopressor] = useState<VasopressorStrategy>('NOREPINEPHRINE_MONOTHERAPY');
  const [norepinephrineDoseMcgKgMin, setNorepinephrineDoseMcgKgMin] = useState<number>(0.2);
  const [ventilationMode, setVentilationMode] = useState<MechanicalVentilationMode>('LUNG_PROTECTIVE_LOW_VT');
  const [peepCmH2O, setPeepCmH2O] = useState<number>(10);
  const [fio2Percent, setFio2Percent] = useState<number>(60);
  const [tidalVolumeMlPerKgPbw, setTidalVolumeMlPerKgPbw] = useState<number>(6);
  const [cumulativeFluidBalanceLiters, setCumulativeFluidBalanceLiters] = useState<number>(4);
  const [hyperosmolarTherapyActive, setHyperosmolarTherapyActive] = useState<boolean>(false);
  const [evdOpenDrain, setEvdOpenDrain] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'cockpit' | 'hemodynamics' | 'neuro' | 'pulmonary' | 'acs'>('cockpit');

  const params: OmnisuitePatientParams = useMemo(
    () => ({
      scenario,
      eclsConfig,
      ecmoFlowLpm,
      impellaPLevel,
      vasopressor,
      norepinephrineDoseMcgKgMin,
      ventilationMode,
      peepCmH2O,
      fio2Percent,
      tidalVolumeMlPerKgPbw,
      cumulativeFluidBalanceLiters,
      hyperosmolarTherapyActive,
      evdOpenDrain,
      patientWeightKg: 70,
    }),
    [
      scenario,
      eclsConfig,
      ecmoFlowLpm,
      impellaPLevel,
      vasopressor,
      norepinephrineDoseMcgKgMin,
      ventilationMode,
      peepCmH2O,
      fio2Percent,
      tidalVolumeMlPerKgPbw,
      cumulativeFluidBalanceLiters,
      hyperosmolarTherapyActive,
      evdOpenDrain,
    ]
  );

  const result = useMemo(() => simulateCriticalCareOmnisuite(params), [params]);

  // Presets Handlers
  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'harlequin_va':
        setScenario('CARDIOGENIC_SHOCK_HARLEQUIN_ECMO');
        setEclsConfig('VA_ECMO_PERIPHERAL');
        setEcmoFlowLpm(4.5);
        setImpellaPLevel(0);
        setVasopressor('NOREPINEPHRINE_MONOTHERAPY');
        setNorepinephrineDoseMcgKgMin(0.2);
        setVentilationMode('LUNG_PROTECTIVE_LOW_VT');
        setPeepCmH2O(10);
        setCumulativeFluidBalanceLiters(3);
        setHyperosmolarTherapyActive(false);
        setEvdOpenDrain(false);
        break;

      case 'ecpella_rescue':
        setScenario('CARDIOGENIC_SHOCK_HARLEQUIN_ECMO');
        setEclsConfig('ECPELLA_VA_ECMO_PLUS_IMPELLA');
        setEcmoFlowLpm(4.0);
        setImpellaPLevel(8);
        setVasopressor('DOBUTAMINE_INOTROPIC_SUPPORT');
        setNorepinephrineDoseMcgKgMin(0.1);
        setVentilationMode('ULTRA_PROTECTIVE_REST_LUNG_ECMO');
        setPeepCmH2O(10);
        setCumulativeFluidBalanceLiters(2);
        setHyperosmolarTherapyActive(false);
        setEvdOpenDrain(false);
        break;

      case 'tbi_crisis':
        setScenario('POLYTRAUMA_TBI_MONRO_KELLIE');
        setEclsConfig('NONE');
        setEcmoFlowLpm(0);
        setImpellaPLevel(0);
        setVasopressor('NOREPINEPHRINE_MONOTHERAPY');
        setNorepinephrineDoseMcgKgMin(0.5);
        setVentilationMode('LUNG_PROTECTIVE_LOW_VT');
        setPeepCmH2O(5);
        setCumulativeFluidBalanceLiters(1);
        setHyperosmolarTherapyActive(true);
        setEvdOpenDrain(true);
        break;

      case 'sepsis_acs':
        setScenario('SEPTIC_SHOCK_ARDS_FLUID_CREEP_ACS');
        setEclsConfig('VV_ECMO_LUNG_SUPPORT');
        setEcmoFlowLpm(4.5);
        setImpellaPLevel(0);
        setVasopressor('NOREPINEPHRINE_PLUS_VASOPRESSIN');
        setNorepinephrineDoseMcgKgMin(0.4);
        setVentilationMode('ULTRA_PROTECTIVE_REST_LUNG_ECMO');
        setPeepCmH2O(14);
        setCumulativeFluidBalanceLiters(14);
        setHyperosmolarTherapyActive(false);
        setEvdOpenDrain(false);
        break;

      case 'pe_rv_collapse':
        setScenario('MASSIVE_PE_RV_FAILURE');
        setEclsConfig('VA_ECMO_PERIPHERAL');
        setEcmoFlowLpm(4.0);
        setImpellaPLevel(0);
        setVasopressor('EPINEPHRINE_INOTROPIC_RESCUE');
        setNorepinephrineDoseMcgKgMin(0.1);
        setVentilationMode('LUNG_PROTECTIVE_LOW_VT');
        setPeepCmH2O(8);
        setCumulativeFluidBalanceLiters(2);
        setHyperosmolarTherapyActive(false);
        setEvdOpenDrain(false);
        break;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100 p-2 sm:p-4">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-gradient-to-br from-indigo-500/10 via-cyan-500/10 to-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-400 shadow-inner">
                <Cpu className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-400">
                  Track B Grand Capstone Omnisuite
                </span>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Critical Care &amp; Extracorporeal Resuscitation
                </h1>
              </div>
            </div>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl">
              Master clinical cockpit unifying Swan-Ganz thermodilution, mechanical circulatory support (VA/VV/VAV ECMO, ECPELLA), neurocritical Monro-Kellie dynamics, ARDS driving pressure mechanics, and abdominal compartment resuscitation.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyPreset('harlequin_va')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-950/50 hover:bg-rose-900/70 text-rose-300 border border-rose-600/50 transition"
            >
              Harlequin ECMO
            </button>
            <button
              onClick={() => applyPreset('ecpella_rescue')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-950/50 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-600/50 transition"
            >
              ECPELLA Rescue
            </button>
            <button
              onClick={() => applyPreset('tbi_crisis')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-950/50 hover:bg-purple-900/70 text-purple-300 border border-purple-600/50 transition"
            >
              TBI Monro-Kellie
            </button>
            <button
              onClick={() => applyPreset('sepsis_acs')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-950/50 hover:bg-amber-900/70 text-amber-300 border border-amber-600/50 transition"
            >
              Sepsis Fluid Creep ACS
            </button>
            <button
              onClick={() => applyPreset('pe_rv_collapse')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-950/50 hover:bg-sky-900/70 text-sky-300 border border-sky-600/50 transition"
            >
              Massive PE Shock
            </button>
          </div>
        </div>
      </div>

      {/* Hero 4-Panel Multi-Organ Cockpit Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Panel 1: Cardiovascular & Swan-Ganz */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400" /> Hemodynamics &amp; Swan-Ganz
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-bold ${
                result.leftVentricularAfterloadStress === 'SEVERE_DISTENSION_PULMONARY_FLOODING'
                  ? 'bg-red-950 text-red-300 border border-red-500 animate-pulse'
                  : result.leftVentricularAfterloadStress === 'MODERATE_STRESS'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500'
              }`}
            >
              {result.leftVentricularAfterloadStress === 'SEVERE_DISTENSION_PULMONARY_FLOODING'
                ? 'LV Distension'
                : result.leftVentricularAfterloadStress === 'MODERATE_STRESS'
                ? 'Moderate Stress'
                : 'LV Unloaded'}
            </span>
          </div>

          <div className="my-3 grid grid-cols-2 gap-2 text-center">
            <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800/60">
              <div className="text-xs text-slate-400">BP / MAP</div>
              <div className="text-base font-bold text-white font-mono">
                {result.systolicBp}/{result.diastolicBp} <span className="text-xs text-slate-400">({result.meanArterialPressure})</span>
              </div>
            </div>
            <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800/60">
              <div className="text-xs text-slate-400">CI / Total CO</div>
              <div className="text-base font-bold font-mono text-cyan-400">
                {result.cardiacIndex} <span className="text-xs text-slate-400">L/min/m²</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 text-[11px] text-slate-400">
            <div>PCWP: <span className="text-slate-200 font-mono">{result.pulmonaryCapillaryWedgePressureMmHg} mmHg</span></div>
            <div>SVR: <span className="text-slate-200 font-mono">{result.systemicVascularResistance} dyn</span></div>
          </div>
        </div>

        {/* Panel 2: ECLS & Harlequin Dual Circulation */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> ECLS &amp; Harlequin
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-bold ${
                result.harlequinNorthSouthSyndromePresent
                  ? 'bg-red-950 text-red-300 border border-red-500 animate-pulse'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500'
              }`}
            >
              {result.harlequinNorthSouthSyndromePresent ? 'Harlequin Active' : 'Normal ECLS'}
            </span>
          </div>

          <div className="my-3 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Right Radial (Brain):</span>
              <span
                className={`font-mono font-bold ${
                  result.rightRadialPreDuctalSpO2Percent < 85 ? 'text-red-400 animate-pulse' : 'text-emerald-400'
                }`}
              >
                {result.rightRadialPreDuctalSpO2Percent}% SpO₂
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Femoral (Lower Body):</span>
              <span className="font-mono font-bold text-cyan-300">
                {result.femoralPostDuctalSpO2Percent}% SpO₂
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-800/60 text-[11px]">
              <span className="text-slate-400">Weaning Score:</span>
              <span className="font-mono font-bold text-amber-300">
                {result.eclsWeaningReadinessScore}%
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
            <span>Circuit:</span>
            <span className="text-slate-200 font-medium">{eclsConfig.replaceAll('_', ' ')}</span>
          </div>
        </div>

        {/* Panel 3: Neurocritical Monro-Kellie */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-purple-400" /> Neuro Monro-Kellie
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-bold ${
                result.brainHerniationRisk === 'IMMINENT_UNCAL_HERNIATION'
                  ? 'bg-red-950 text-red-300 border border-red-500 animate-pulse'
                  : result.brainHerniationRisk === 'ELEVATED_ICP'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500'
              }`}
            >
              {result.brainHerniationRisk.replaceAll('_', ' ')}
            </span>
          </div>

          <div className="my-3 grid grid-cols-2 gap-2 text-center">
            <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800/60">
              <div className="text-xs text-slate-400">ICP</div>
              <div
                className={`text-base font-bold font-mono ${
                  result.intracranialPressureMmHg >= 20 ? 'text-red-400' : 'text-slate-200'
                }`}
              >
                {result.intracranialPressureMmHg} <span className="text-xs text-slate-400">mmHg</span>
              </div>
            </div>
            <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800/60">
              <div className="text-xs text-slate-400">CPP (MAP - ICP)</div>
              <div
                className={`text-base font-bold font-mono ${
                  result.cerebralPerfusionPressureMmHg < 60 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {result.cerebralPerfusionPressureMmHg} <span className="text-xs text-slate-400">mmHg</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
            <span>Hyperosmolar / EVD:</span>
            <span className="text-slate-200 font-medium">
              {hyperosmolarTherapyActive ? 'Active' : 'Off'} | {evdOpenDrain ? 'EVD Open' : 'Closed'}
            </span>
          </div>
        </div>

        {/* Panel 4: Respiratory Mechanics & ACS */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-sky-400" /> ARDS &amp; Abdomen
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-bold ${
                result.ventilatorInducedLungInjuryRisk === 'CRITICAL_VILI_HAZARD' || result.abdominalCompartmentSyndrome
                  ? 'bg-red-950 text-red-300 border border-red-500 animate-pulse'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500'
              }`}
            >
              {result.abdominalCompartmentSyndrome
                ? 'ACS Present'
                : result.ventilatorInducedLungInjuryRisk === 'CRITICAL_VILI_HAZARD'
                ? 'VILI Hazard'
                : 'Lung Safe'}
            </span>
          </div>

          <div className="my-3 space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Driving Pressure (&Delta;P):</span>
              <span
                className={`font-mono font-bold ${
                  result.drivingPressureCmH2O > 14 ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {result.drivingPressureCmH2O} cmH₂O
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Intra-Abdominal Press (IAP):</span>
              <span
                className={`font-mono font-bold ${
                  result.intraAbdominalPressureMmHg >= 20 ? 'text-red-400' : 'text-slate-200'
                }`}
              >
                {result.intraAbdominalPressureMmHg} mmHg
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Urine Output:</span>
              <span className="font-mono font-bold text-amber-300">
                {result.urineOutputMlPerHour} mL/hr
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
            <span>Whole-Body Score:</span>
            <span className="text-emerald-400 font-bold font-mono">
              {result.wholeBodyResuscitationScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* Multi-Organ Alerts Banner */}
      {result.multiOrganCriticalAlerts.length > 0 && (
        <div className="space-y-2">
          {result.multiOrganCriticalAlerts.map((alert, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-start gap-3 backdrop-blur-sm"
            >
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>{alert}</div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2 sm:gap-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('cockpit')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 ${
            activeTab === 'cockpit'
              ? 'bg-slate-800 text-indigo-400 border-t-2 border-indigo-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Sliders className="w-4 h-4" /> Multi-Organ Cockpit
        </button>
        <button
          onClick={() => setActiveTab('hemodynamics')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 ${
            activeTab === 'hemodynamics'
              ? 'bg-slate-800 text-indigo-400 border-t-2 border-indigo-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Activity className="w-4 h-4" /> ECLS &amp; ECPELLA Mechanics
        </button>
        <button
          onClick={() => setActiveTab('neuro')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 ${
            activeTab === 'neuro'
              ? 'bg-slate-800 text-indigo-400 border-t-2 border-indigo-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Brain className="w-4 h-4" /> Monro-Kellie &amp; CPP
        </button>
        <button
          onClick={() => setActiveTab('pulmonary')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 ${
            activeTab === 'pulmonary'
              ? 'bg-slate-800 text-indigo-400 border-t-2 border-indigo-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Wind className="w-4 h-4" /> ARDS Driving Pressure
        </button>
        <button
          onClick={() => setActiveTab('acs')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 ${
            activeTab === 'acs'
              ? 'bg-slate-800 text-indigo-400 border-t-2 border-indigo-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-4 h-4" /> Fluid Creep &amp; ACS
        </button>
      </div>

      {/* Sub-Tab 1: Multi-Organ Cockpit Controls */}
      {activeTab === 'cockpit' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: ECLS & Circulatory Support */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Extracorporeal &amp; Device Deck
            </h2>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Clinical Scenario</label>
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value as OmnisuiteScenario)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="CARDIOGENIC_SHOCK_HARLEQUIN_ECMO">Cardiogenic Shock &amp; Harlequin ECMO</option>
                <option value="POLYTRAUMA_TBI_MONRO_KELLIE">Polytrauma TBI with Monro-Kellie Crisis</option>
                <option value="SEPTIC_SHOCK_ARDS_FLUID_CREEP_ACS">Septic Shock, Severe ARDS &amp; Fluid Creep ACS</option>
                <option value="MASSIVE_PE_RV_FAILURE">Massive Pulmonary Embolism with RV Failure</option>
                <option value="TOTAL_SPINAL_HEMOLYTIC_CRISIS">Total Spinal with Hemolytic Transfusion Crisis</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">ECLS Cannulation Mode</label>
              <select
                value={eclsConfig}
                onChange={(e) => setEclsConfig(e.target.value as EclsConfiguration)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="NONE">None (Conventional Support)</option>
                <option value="VA_ECMO_PERIPHERAL">Peripheral VA-ECMO (Femoral A/V)</option>
                <option value="VV_ECMO_LUNG_SUPPORT">VV-ECMO (Respiratory Support Only)</option>
                <option value="VAV_HYBRID_HARLEQUIN_RESCUE">VAV Hybrid (Harlequin Rescue - RIJ + Femoral)</option>
                <option value="ECPELLA_VA_ECMO_PLUS_IMPELLA">ECPELLA (VA-ECMO + Impella Unloading)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">ECMO Blood Flow Rate:</span>
                <span className="text-cyan-400 font-mono">{ecmoFlowLpm} L/min</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="6.0"
                step="0.5"
                value={ecmoFlowLpm}
                onChange={(e) => setEcmoFlowLpm(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Impella Microaxial Level:</span>
                <span className="text-emerald-400 font-mono">P{impellaPLevel}</span>
              </div>
              <input
                type="range"
                min="0"
                max="9"
                step="1"
                value={impellaPLevel}
                onChange={(e) => setImpellaPLevel(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <span className="text-[11px] text-slate-500">P8 = ~3.0 L/min active LV cavity venting.</span>
            </div>
          </div>

          {/* Column 2: Vasopressor & Neuro / Pulmonary Interventions */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Syringe className="w-4 h-4 text-rose-400" /> Vasoactive &amp; Organ Support
            </h2>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Vasopressor / Inotrope Strategy</label>
              <select
                value={vasopressor}
                onChange={(e) => setVasopressor(e.target.value as VasopressorStrategy)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="NONE">None</option>
                <option value="NOREPINEPHRINE_MONOTHERAPY">Norepinephrine Monotherapy</option>
                <option value="NOREPINEPHRINE_PLUS_VASOPRESSIN">Norepinephrine + Vasopressin (0.03 U/min)</option>
                <option value="EPINEPHRINE_INOTROPIC_RESCUE">Epinephrine Rescue (Inotrope + Vasoconstrictor)</option>
                <option value="DOBUTAMINE_INOTROPIC_SUPPORT">Dobutamine Inotropic Support (Inodilator)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Norepinephrine Dose:</span>
                <span className="text-rose-400 font-mono">{norepinephrineDoseMcgKgMin} mcg/kg/min</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={norepinephrineDoseMcgKgMin}
                onChange={(e) => setNorepinephrineDoseMcgKgMin(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Mechanical Ventilation Mode</label>
              <select
                value={ventilationMode}
                onChange={(e) => setVentilationMode(e.target.value as MechanicalVentilationMode)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="SPONTANEOUS_BREATHING">Spontaneous Breathing (Unprotective)</option>
                <option value="LUNG_PROTECTIVE_LOW_VT">Lung Protective Low-Vt (6 mL/kg PBW)</option>
                <option value="HIGH_PEEP_PRONE_VENTILATION">High PEEP + Prone Position</option>
                <option value="ULTRA_PROTECTIVE_REST_LUNG_ECMO">Ultra-Protective Rest-Lung ECMO (3-4 mL/kg)</option>
              </select>
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hyperosmolarTherapyActive}
                  onChange={(e) => setHyperosmolarTherapyActive(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-indigo-500 focus:ring-0"
                />
                <span>3% Hypertonic Saline Bolus (250 mL for ICP)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={evdOpenDrain}
                  onChange={(e) => setEvdOpenDrain(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-indigo-500 focus:ring-0"
                />
                <span>External Ventricular Drain (EVD) Open to 10 cmH₂O</span>
              </label>
            </div>
          </div>

          {/* Column 3: Fluid Balance & Prioritized Actions */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Resuscitation Roadmap
              </h2>

              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Cumulative Fluid Balance:</span>
                  <span
                    className={`font-mono font-bold ${
                      cumulativeFluidBalanceLiters > 8 ? 'text-red-400' : 'text-slate-200'
                    }`}
                  >
                    +{cumulativeFluidBalanceLiters} Liters
                  </span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="18"
                  step="1"
                  value={cumulativeFluidBalanceLiters}
                  onChange={(e) => setCumulativeFluidBalanceLiters(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <span className="text-[11px] text-slate-500">Overload &gt; 8L drives severe abdominal compartment syndrome.</span>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300">Prioritized Interventions:</div>
                {result.omnisuitePrioritizedActions.length === 0 ? (
                  <div className="text-xs text-slate-500 italic">Multi-organ state stabilized.</div>
                ) : (
                  result.omnisuitePrioritizedActions.map((act, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200 flex items-start gap-2"
                    >
                      <ArrowUpRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>{act}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => applyPreset('harlequin_va')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Omnisuite
            </button>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: ECLS & ECPELLA Mechanics */}
      {activeTab === 'hemodynamics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4" /> The Harlequin Dual-Circulation Syndrome
            </h3>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                In peripheral Venoarterial (VA) ECMO, retrograde blood flows up the descending aorta toward the aortic arch. Meanwhile, recovering native left ventricular output ejects poorly oxygenated blood from damaged, edematous lungs into the ascending aorta.
              </p>
              <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-700/50 text-red-200 space-y-1">
                <div className="font-bold text-red-300">The Mixing Zone Phenomenon:</div>
                <div>
                  The point where retrograde hyperoxic ECMO blood collides with antegrade hypoxic native LV ejection is the &ldquo;mixing zone.&rdquo; If the native LV improves while the lungs are still injured, the mixing zone is pushed distally toward the diaphragm.
                </div>
                <div className="mt-1">
                  Consequently, the innominate artery (supplying the brain and right arm) receives purely deoxygenated blood, causing <strong className="text-white">severe cerebral and coronary hypoxia</strong> despite 100% SpO₂ on a femoral or left-sided monitor!
                </div>
              </div>
              <p>
                <strong className="text-emerald-400 font-bold">VAV Hybrid Upgrade:</strong> Adding an extra arterial re-infusion cannula to the Right Internal Jugular vein delivers oxygenated ECMO blood directly to the right ventricle and pulmonary circulation, pre-oxygenating the blood before it reaches the LV!
              </p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-4 h-4" /> ECPELLA: Active LV Venting in Peripheral VA-ECMO
            </h3>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                Peripheral VA-ECMO dramatically raises left ventricular afterload. In a failing heart with poor contractility, the LV cannot overcome this retrograde aortic pressure:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-400">
                <li>The aortic valve remains permanently closed throughout the cardiac cycle.</li>
                <li>Blood stagnates in the LV cavity, risking intracardiac thrombus formation.</li>
                <li>LV end-diastolic pressure and PCWP skyrocket (&gt; 25–30 mmHg), causing massive hydrostatic pulmonary alveolar flooding.</li>
              </ul>
              <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-700/50 text-emerald-200 space-y-1">
                <div className="font-bold text-emerald-300">The ECPELLA Solution:</div>
                <div>
                  Deploying an Impella microaxial pump across the aortic valve aspirates blood directly from the left ventricle and pumps it into the ascending aorta at 2.5–4.0 L/min, immediately reducing wall stress and PCWP while maintaining systemic perfusion.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Monro-Kellie & CPP */}
      {activeTab === 'neuro' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <Brain className="w-4 h-4" /> The Monro-Kellie Doctrine &amp; Spatial Compliance
            </h3>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                The rigid cranial vault contains three non-compressible volume components: <strong className="text-white">Brain Parenchyma (80%), Blood (10%), and CSF (10%)</strong>.
              </p>
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-purple-400">Volume-Pressure Exhaustion:</div>
                <div>
                  When a mass lesion or cerebral edema develops, intracranial compliance is initially preserved by displacing venous blood and CSF into the spinal canal.
                </div>
                <div>
                  Once spatial compensation is exhausted, the volume-pressure curve turns steeply upward: tiny additions of volume produce massive exponential surges in ICP (&gt; 25–30 mmHg), precipitating transtentorial uncal herniation and brainstem compression.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <Gauge className="w-4 h-4" /> Cerebral Perfusion Pressure (CPP = MAP - ICP)
            </h3>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                Target CPP in severe traumatic brain injury is <strong className="text-white">60–70 mmHg</strong> (Brain Trauma Foundation guidelines).
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-1 text-slate-400">
                <li><strong className="text-slate-200">Tier 1:</strong> Head elevation 30&deg;, neutral neck, analgesia/sedation, normothermia.</li>
                <li><strong className="text-slate-200">Tier 2:</strong> 3% Hypertonic Saline (250 mL bolus) or 20% Mannitol (1 g/kg), open EVD CSF drainage to 10 cmH₂O, mild hypocapnia (PaCO₂ 32–35 mmHg).</li>
                <li><strong className="text-slate-200">Tier 3:</strong> High-dose pentobarbital coma, targeted temperature management (33–35&deg;C), emergent decompressive craniectomy.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: ARDS Driving Pressure */}
      {activeTab === 'pulmonary' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
          <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
            <Wind className="w-4 h-4" /> ARDS Mechanics &amp; Driving Pressure (&Delta;P = Pplat - PEEP)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-sky-400">The Driving Pressure Concept</div>
              <div className="text-slate-300 leading-relaxed">
                Amato et al. (NEJM 2015) demonstrated that driving pressure (&Delta;P = Pplat - PEEP) is the single ventilatory variable most strongly correlated with mortality in ARDS. Target &Delta;P &le; 14 cmH₂O.
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-amber-400">The &ldquo;Baby Lung&rdquo; Architecture</div>
              <div className="text-slate-300 leading-relaxed">
                In severe ARDS, the ventilated lung is not &ldquo;stiff,&rdquo; but small. Delivering conventional 10 mL/kg tidal volumes to this small aerated fraction creates massive strain and volutrauma.
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-emerald-400">Ultra-Protective Rest-Lung ECMO</div>
              <div className="text-slate-300 leading-relaxed">
                When &Delta;P exceeds 15 cmH₂O despite low tidal volumes, initiating VV-ECMO allows reduction of tidal volume to 3–4 mL/kg and respiratory rate to 10 bpm, placing the injured lungs at near-complete rest.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 5: Fluid Creep & ACS */}
      {activeTab === 'acs' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" /> Fluid Creep &amp; Abdominal Compartment Syndrome (WSACS Criteria)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-amber-300">Intra-Abdominal Hypertension (IAH) Staging:</div>
              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-300">
                <li>Grade I: IAP 12–15 mmHg</li>
                <li>Grade II: IAP 16–20 mmHg</li>
                <li>Grade III: IAP 21–25 mmHg</li>
                <li>Grade IV: IAP &gt; 25 mmHg</li>
              </ul>
              <div className="text-slate-400 mt-2">
                <strong className="text-white">Definition of ACS:</strong> Sustained IAP &ge; 20 mmHg associated with new organ dysfunction or failure (oliguria, decreased lung compliance, hypotension).
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-rose-300">Multi-Organ Consequences:</div>
              <div className="text-slate-300 leading-relaxed">
                Elevated IAP compresses the inferior vena cava and renal veins, causing anuria and plummeting venous return. It pushes the diaphragm cephalad, raising intrathoracic pressure, driving pressures, and ICP!
              </div>
              <div className="text-emerald-300 font-bold mt-2">
                Definitive Management: Emergent surgical decompressive laparostomy.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
