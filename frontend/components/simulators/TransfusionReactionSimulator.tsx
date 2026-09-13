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
  FlaskConical,
} from 'lucide-react';
import {
  simulateTransfusionReaction,
  TransfusionParams,
  TransfusionReactionType,
  BloodProductType,
  TransfusionAction,
} from '../../.gemini/skills/TransfusionReactionEngine';

export default function TransfusionReactionSimulator() {
  // Simulator State
  const [reactionType, setReactionType] = useState<TransfusionReactionType>('ACUTE_HEMOLYTIC_ABO');
  const [bloodProduct, setBloodProduct] = useState<BloodProductType>('PRBC_PACKED_RED_CELLS');
  const [volumeInfusedMl, setVolumeInfusedMl] = useState<number>(120);
  const [infusionRateMlPerHour, setInfusionRateMlPerHour] = useState<number>(200);
  const [patientAction, setPatientAction] = useState<TransfusionAction>('STOP_TRANSFUSION_DISCONNECT_TUBING');
  const [furosemideDoseMg, setFurosemideDoseMg] = useState<number>(0);
  const [ivSalineBolusMl, setIvSalineBolusMl] = useState<number>(1000);
  const [sodiumBicarbAdministered, setSodiumBicarbAdministered] = useState<boolean>(true);
  const [epinephrineAdministered, setEpinephrineAdministered] = useState<boolean>(false);
  const [preExistingCardiacFailure, setPreExistingCardiacFailure] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'cockpit' | 'ahtr' | 'trali_taco' | 'algorithm'>('cockpit');

  const params: TransfusionParams = useMemo(
    () => ({
      reactionType,
      bloodProduct,
      volumeInfusedMl,
      infusionRateMlPerHour,
      patientAction,
      furosemideDoseMg,
      ivSalineBolusMl,
      sodiumBicarbAdministered,
      epinephrineAdministered,
      preExistingCardiacFailure,
      patientWeightKg: 70,
    }),
    [
      reactionType,
      bloodProduct,
      volumeInfusedMl,
      infusionRateMlPerHour,
      patientAction,
      furosemideDoseMg,
      ivSalineBolusMl,
      sodiumBicarbAdministered,
      epinephrineAdministered,
      preExistingCardiacFailure,
    ]
  );

  const result = useMemo(() => simulateTransfusionReaction(params), [params]);

  // Preset Handlers
  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'ahtr_classic':
        setReactionType('ACUTE_HEMOLYTIC_ABO');
        setBloodProduct('PRBC_PACKED_RED_CELLS');
        setVolumeInfusedMl(150);
        setInfusionRateMlPerHour(200);
        setPatientAction('STOP_TRANSFUSION_DISCONNECT_TUBING');
        setFurosemideDoseMg(0);
        setIvSalineBolusMl(1500);
        setSodiumBicarbAdministered(true);
        setEpinephrineAdministered(false);
        setPreExistingCardiacFailure(false);
        break;
      case 'trali_classic':
        setReactionType('TRALI_IMMUNE_LUNG_INJURY');
        setBloodProduct('FFP_FRESH_FROZEN_PLASMA');
        setVolumeInfusedMl(250);
        setInfusionRateMlPerHour(300);
        setPatientAction('STOP_TRANSFUSION_DISCONNECT_TUBING');
        setFurosemideDoseMg(0); // Zero diuretics!
        setIvSalineBolusMl(250);
        setSodiumBicarbAdministered(false);
        setEpinephrineAdministered(false);
        setPreExistingCardiacFailure(false);
        break;
      case 'taco_classic':
        setReactionType('TACO_CIRCULATORY_OVERLOAD');
        setBloodProduct('PRBC_PACKED_RED_CELLS');
        setVolumeInfusedMl(350);
        setInfusionRateMlPerHour(350);
        setPatientAction('STOP_TRANSFUSION_DISCONNECT_TUBING');
        setFurosemideDoseMg(40); // Emergent loop diuretic!
        setIvSalineBolusMl(0);
        setSodiumBicarbAdministered(false);
        setEpinephrineAdministered(false);
        setPreExistingCardiacFailure(true);
        break;
      case 'trali_diuretic_trap':
        setReactionType('TRALI_IMMUNE_LUNG_INJURY');
        setBloodProduct('FFP_FRESH_FROZEN_PLASMA');
        setVolumeInfusedMl(200);
        setInfusionRateMlPerHour(250);
        setPatientAction('STOP_TRANSFUSION_DISCONNECT_TUBING');
        setFurosemideDoseMg(60); // Hazardous diuresis in TRALI!
        setIvSalineBolusMl(0);
        setSodiumBicarbAdministered(false);
        setEpinephrineAdministered(false);
        setPreExistingCardiacFailure(false);
        break;
      case 'anaphylaxis_iga':
        setReactionType('ANAPHYLAXIS_IGA_DEFICIENCY');
        setBloodProduct('PRBC_PACKED_RED_CELLS');
        setVolumeInfusedMl(30);
        setInfusionRateMlPerHour(100);
        setPatientAction('STOP_TRANSFUSION_DISCONNECT_TUBING');
        setFurosemideDoseMg(0);
        setIvSalineBolusMl(500);
        setSodiumBicarbAdministered(false);
        setEpinephrineAdministered(true);
        setPreExistingCardiacFailure(false);
        break;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100 p-2 sm:p-4">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/30 text-rose-400 shadow-inner">
                <Droplets className="w-6 h-6 animate-pulse" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                AHTR &amp; TRALI vs TACO Workstation
              </h1>
            </div>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl">
              Precision immunohematology &amp; critical care simulator: Model acute hemolytic reactions (ABO incompatibility, DAT, haptoglobin, Coca-Cola urine, pigment nephropathy) and master the lifesaving TRALI vs TACO differential matrix.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyPreset('ahtr_classic')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-950/50 hover:bg-rose-900/70 text-rose-300 border border-rose-600/50 transition"
            >
              AHTR Classic
            </button>
            <button
              onClick={() => applyPreset('trali_classic')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-950/50 hover:bg-sky-900/70 text-sky-300 border border-sky-600/50 transition"
            >
              TRALI Permeability
            </button>
            <button
              onClick={() => applyPreset('taco_classic')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-950/50 hover:bg-purple-900/70 text-purple-300 border border-purple-600/50 transition"
            >
              TACO Overload
            </button>
            <button
              onClick={() => applyPreset('trali_diuretic_trap')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-950/50 hover:bg-amber-900/70 text-amber-300 border border-amber-600/50 transition"
            >
              TRALI Diuretic Trap
            </button>
            <button
              onClick={() => applyPreset('anaphylaxis_iga')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-950/50 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-600/50 transition"
            >
              IgA Anaphylaxis
            </button>
          </div>
        </div>
      </div>

      {/* Hero 4-Panel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Panel 1: Reaction Phenotype */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-rose-400" /> Reaction Phenotype
            </span>
            <span className="text-xs px-2 py-0.5 rounded font-bold bg-slate-800 text-slate-200 border border-slate-700">
              {result.temperatureCelsius}&deg;C
            </span>
          </div>

          <div className="my-3 space-y-2">
            <div className="text-base font-bold text-white tracking-wide">
              {reactionType.replaceAll('_', ' ')}
            </div>
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Product:</span>
              <span className="font-semibold text-slate-200">{bloodProduct.replace('_', ' ')}</span>
            </div>
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Volume Infused:</span>
              <span className="font-semibold text-rose-400 font-mono">{volumeInfusedMl} mL</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
            <span>Action:</span>
            <span
              className={`font-semibold ${
                patientAction === 'CONTINUE_TRANSFUSION'
                  ? 'text-red-400'
                  : patientAction === 'STOP_AND_FLUSH_TUBING_HAZARD'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {patientAction === 'STOP_TRANSFUSION_DISCONNECT_TUBING'
                ? 'Stopped & Detached'
                : patientAction === 'STOP_AND_FLUSH_TUBING_HAZARD'
                ? 'Flushed (Hazard!)'
                : 'Continued (Critical!)'}
            </span>
          </div>
        </div>

        {/* Panel 2: Hemodynamics & Pressures */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400" /> Hemodynamics &amp; BNP
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-bold font-mono ${
                result.pulmonaryCapillaryWedgePressureMmHg > 18
                  ? 'bg-purple-950 text-purple-300 border border-purple-500'
                  : 'bg-sky-950 text-sky-300 border border-sky-500'
              }`}
            >
              PCWP: {result.pulmonaryCapillaryWedgePressureMmHg} mmHg
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
              <div className="text-xs text-slate-400">BNP Level</div>
              <div
                className={`text-base font-bold font-mono ${
                  result.bnpPgPerMl > 400 ? 'text-purple-400' : 'text-slate-200'
                }`}
              >
                {result.bnpPgPerMl} <span className="text-xs text-slate-400">pg/mL</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 text-[11px] text-slate-400">
            <div>HR: <span className="text-slate-200 font-mono">{result.heartRate} bpm</span></div>
            <div>CVP: <span className="text-slate-200 font-mono">{result.centralVenousPressureMmHg} mmHg</span></div>
          </div>
        </div>

        {/* Panel 3: Pulmonary & TRALI/TACO Ratio */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-sky-400" /> Respiratory &amp; Protein
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-bold ${
                result.edemaFluidPlasmaProteinRatio > 0.65
                  ? 'bg-sky-950 text-sky-300 border border-sky-500'
                  : 'bg-purple-950 text-purple-300 border border-purple-500'
              }`}
            >
              Protein: {result.edemaFluidPlasmaProteinRatio}
            </span>
          </div>

          <div className="my-3 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">SpO₂ / P/F Ratio:</span>
              <span className="font-mono font-bold text-white">
                {result.spO2Percent}% <span className="text-slate-400">({result.paO2FiO2Ratio})</span>
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  result.spO2Percent < 88 ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${result.spO2Percent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-300 flex justify-between">
              <span>Infiltrates:</span>
              <span className="font-semibold text-slate-200">
                {result.lungInfiltrates === 'CLEAR'
                  ? 'Clear Lungs'
                  : result.lungInfiltrates === 'BILATERAL_EXUDATIVE_PERMEABILITY'
                  ? 'Exudative / ARDS'
                  : 'Hydrostatic / Kerley B'}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
            <span>Diuretic Status:</span>
            <span
              className={`font-semibold ${
                result.diureticResponse === 'LETHAL_TRALI_HYPOVOLEMIC_CRASH'
                  ? 'text-red-400 animate-pulse'
                  : result.diureticResponse === 'APPROPRIATE_TACO_RELIEF'
                  ? 'text-emerald-400'
                  : 'text-slate-400'
              }`}
            >
              {result.diureticResponse === 'LETHAL_TRALI_HYPOVOLEMIC_CRASH'
                ? 'TRALI Crash Trap'
                : result.diureticResponse === 'APPROPRIATE_TACO_RELIEF'
                ? 'Effective Relief'
                : 'No Diuresis'}
            </span>
          </div>
        </div>

        {/* Panel 4: Immunohematology & Kidneys */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-emerald-400" /> Lysis &amp; Nephroprotection
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded font-mono font-bold ${
                result.immediateSafetyScore >= 80
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                  : result.immediateSafetyScore >= 50
                  ? 'bg-amber-950 text-amber-300 border border-amber-500'
                  : 'bg-red-950 text-red-300 border border-red-500 animate-pulse'
              }`}
            >
              Safety: {result.immediateSafetyScore}/100
            </span>
          </div>

          <div className="my-3 space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Direct Coombs (DAT):</span>
              <span
                className={`font-mono font-bold ${
                  result.directAntiglobulinTest === 'POSITIVE_IGG_C3D'
                    ? 'text-red-400'
                    : 'text-emerald-400'
                }`}
              >
                {result.directAntiglobulinTest.replaceAll('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Serum Haptoglobin:</span>
              <span
                className={`font-mono font-bold ${
                  result.serumHaptoglobinMgPerDl < 10 ? 'text-red-400' : 'text-slate-200'
                }`}
              >
                {result.serumHaptoglobinMgPerDl} mg/dL
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Urine Output / Color:</span>
              <span className="font-mono font-bold text-amber-300">
                {result.urineOutputMlPerHour} mL/h ({result.urineColor.replaceAll('_', ' ')})
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
            <span>Potassium / DIC:</span>
            <span className="text-slate-200 font-mono">
              K+ {result.potassiumMeqPerL} mEq/L | DIC {result.dicScore}/8
            </span>
          </div>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {result.criticalAlerts.length > 0 && (
        <div className="space-y-2">
          {result.criticalAlerts.map((alert, idx) => (
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
              ? 'bg-slate-800 text-rose-400 border-t-2 border-rose-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Activity className="w-4 h-4" /> Resuscitation Deck
        </button>
        <button
          onClick={() => setActiveTab('ahtr')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 ${
            activeTab === 'ahtr'
              ? 'bg-slate-800 text-rose-400 border-t-2 border-rose-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <FlaskConical className="w-4 h-4" /> AHTR &amp; Pigment Nephropathy
        </button>
        <button
          onClick={() => setActiveTab('trali_taco')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 ${
            activeTab === 'trali_taco'
              ? 'bg-slate-800 text-rose-400 border-t-2 border-rose-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Wind className="w-4 h-4" /> TRALI vs TACO Differential
        </button>
        <button
          onClick={() => setActiveTab('algorithm')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition flex items-center gap-2 ${
            activeTab === 'algorithm'
              ? 'bg-slate-800 text-rose-400 border-t-2 border-rose-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> AABB Bedside Algorithm
        </button>
      </div>

      {/* Sub-Tab 1: Interactive Resuscitation Deck */}
      {activeTab === 'cockpit' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Reaction & Transfusion Configuration */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Droplets className="w-4 h-4 text-rose-400" /> Reaction Parameters
            </h2>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Transfusion Reaction Phenotype</label>
              <select
                value={reactionType}
                onChange={(e) => setReactionType(e.target.value as TransfusionReactionType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="ACUTE_HEMOLYTIC_ABO">Acute Hemolytic (ABO Incompatibility)</option>
                <option value="TRALI_IMMUNE_LUNG_INJURY">TRALI (Immune Neutrophil Permeability Edema)</option>
                <option value="TACO_CIRCULATORY_OVERLOAD">TACO (Hydrostatic Volume Overload)</option>
                <option value="FEBRILE_NON_HEMOLYTIC_FNHTR">FNHTR (Febrile Non-Hemolytic Reaction)</option>
                <option value="ANAPHYLAXIS_IGA_DEFICIENCY">Severe Anaphylaxis (Anti-IgA Antibodies)</option>
                <option value="TRANSFUSION_SEPSIS_BACTERIAL">Transfusion-Transmitted Bacterial Sepsis</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Blood Product Type</label>
              <select
                value={bloodProduct}
                onChange={(e) => setBloodProduct(e.target.value as BloodProductType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="PRBC_PACKED_RED_CELLS">Packed Red Blood Cells (PRBC)</option>
                <option value="FFP_FRESH_FROZEN_PLASMA">Fresh Frozen Plasma (FFP - Highest TRALI risk)</option>
                <option value="PLATELETS_APHERESIS">Apheresis Platelets (Highest Sepsis risk)</option>
                <option value="CRYOPRECIPITATE">Cryoprecipitate</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Volume Infused Before Discovery:</span>
                <span className="text-rose-400 font-mono">{volumeInfusedMl} mL</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={volumeInfusedMl}
                onChange={(e) => setVolumeInfusedMl(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Immediate Bedside Nursing Action</label>
              <select
                value={patientAction}
                onChange={(e) => setPatientAction(e.target.value as TransfusionAction)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="STOP_TRANSFUSION_DISCONNECT_TUBING">STOP &amp; Disconnect Tubing at Hub (Correct)</option>
                <option value="STOP_AND_FLUSH_TUBING_HAZARD">Stop &amp; Flush Line with Normal Saline (Lethal Bolus!)</option>
                <option value="CONTINUE_TRANSFUSION">Continue Transfusion at Slower Rate (Disaster)</option>
              </select>
            </div>
          </div>

          {/* Column 2: Resuscitation & Interventions */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Syringe className="w-4 h-4 text-sky-400" /> Resuscitation Deck
            </h2>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">IV Saline Bolus (Hydration):</span>
                <span className="text-cyan-400 font-mono">{ivSalineBolusMl} mL</span>
              </div>
              <input
                type="range"
                min="0"
                max="3000"
                step="250"
                value={ivSalineBolusMl}
                onChange={(e) => setIvSalineBolusMl(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <span className="text-[11px] text-slate-500">Goal UOP &gt; 1.0–2.0 mL/kg/hr for pigment nephropathy.</span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">IV Furosemide (Loop Diuretic):</span>
                <span className="text-purple-400 font-mono">{furosemideDoseMg} mg</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="20"
                value={furosemideDoseMg}
                onChange={(e) => setFurosemideDoseMg(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
              <span className="text-[11px] text-slate-500">Indicated for TACO; CONTRAINDICATED in TRALI!</span>
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sodiumBicarbAdministered}
                  onChange={(e) => setSodiumBicarbAdministered(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-rose-500 focus:ring-0"
                />
                <span>IV Sodium Bicarbonate (Urine pH &gt; 7.0 Alkalinization)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={epinephrineAdministered}
                  onChange={(e) => setEpinephrineAdministered(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-rose-500 focus:ring-0"
                />
                <span>IM Epinephrine 0.3–0.5 mg (Anaphylaxis Rescue)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preExistingCardiacFailure}
                  onChange={(e) => setPreExistingCardiacFailure(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-rose-500 focus:ring-0"
                />
                <span>History of Congestive Heart Failure / Reduced EF (&lt; 35%)</span>
              </label>
            </div>
          </div>

          {/* Column 3: Recommendations & Protocol */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Evidence-Based Actions
              </h2>

              <div className="space-y-2">
                {result.clinicalRecommendations.length === 0 ? (
                  <div className="text-xs text-slate-500 italic">No acute recommendations.</div>
                ) : (
                  result.clinicalRecommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-xs text-rose-200 flex items-start gap-2"
                    >
                      <ArrowUpRight className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>{rec}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => applyPreset('ahtr_classic')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Simulator
            </button>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: AHTR & Intravascular Hemolysis Pathway */}
      {activeTab === 'ahtr' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <FlaskConical className="w-4 h-4" /> ABO Incompatibility &amp; Intravascular Lysis Cascade
            </h3>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">Pathogenesis:</strong> Acute Hemolytic Transfusion Reaction (AHTR) occurs almost exclusively due to clerical/identification errors where ABO-incompatible red cells are transfused (e.g., Group A blood transfused to a Group O recipient).
              </p>
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-rose-400">Classical Complement Fixation:</div>
                <div>
                  Recipient pre-formed IgM isohemagglutinins bind donor red cell antigens &rarr; activate C1q &rarr; assembly of the C5b-9 Membrane Attack Complex (MAC) &rarr; immediate, violent intravascular hemolysis within minutes.
                </div>
              </div>
              <p>
                <strong className="text-white">Laboratory Signatures:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-400">
                <li><strong className="text-slate-200">Direct Antiglobulin Test (DAT):</strong> Strongly positive for anti-IgG and/or anti-C3d.</li>
                <li><strong className="text-slate-200">Serum Haptoglobin:</strong> Rapidly exhausted (&lt; 10 mg/dL) as it binds free hemoglobin dimers.</li>
                <li><strong className="text-slate-200">Free Plasma Hemoglobin:</strong> Surges (&gt; 50 mg/dL), rendering plasma pink or dark burgundy.</li>
                <li><strong className="text-slate-200">Hemoglobinuria:</strong> Free dimers filter through the glomerulus, producing pathognomonic dark red / Coca-Cola urine.</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <Droplets className="w-4 h-4" /> Pigment Nephropathy &amp; Forced Alkaline Diuresis
            </h3>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">Renal Toxicity Mechanism:</strong> Free hemoglobin tetramers dissociate into alpha-beta dimers (32 kDa), which freely pass the glomerular barrier. In the proximal tubule, megalin/cubilin-mediated endocytosis becomes saturated.
              </p>
              <div className="p-3.5 rounded-lg bg-amber-950/40 border border-amber-700/50 text-amber-200 space-y-1">
                <div className="font-bold text-amber-300">Intratubular Cast Precipitation:</div>
                <div>
                  In acidic tubular fluid (pH &lt; 5.6), free hemoglobin dissociates into globin and ferrihemate (hematin), which precipitates with Tamm-Horsfall mucoprotein, forming obstructing casts in distal tubules and collecting ducts &rarr; Acute Tubular Necrosis (ATN) and anuria.
                </div>
              </div>
              <p>
                <strong className="text-emerald-400 font-bold">Renal Protective Protocol:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-400">
                <li><strong className="text-slate-200">Aggressive Hydration:</strong> IV Normal Saline boluses to maintain urine output &ge; 1.0–2.0 mL/kg/hr to flush tubular casts.</li>
                <li><strong className="text-slate-200">Urinary Alkalinization:</strong> IV Sodium Bicarbonate infusion to keep urine pH &gt; 7.0, which prevents ferrihemate precipitation.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: TRALI vs TACO Differential */}
      {activeTab === 'trali_taco' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
          <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
            <Wind className="w-4 h-4" /> TRALI vs TACO Master Diagnostic Matrix (NHLBI / ISBT Consensus)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-950 text-slate-300">
                  <th className="p-3 font-semibold">Clinical Feature</th>
                  <th className="p-3 font-semibold text-sky-400">TRALI (Lung Injury)</th>
                  <th className="p-3 font-semibold text-purple-400">TACO (Circulatory Overload)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-medium text-white">Primary Mechanism</td>
                  <td className="p-3 text-sky-300">Immune: Anti-HLA / HNA antibodies activate neutrophils &rarr; capillary leak</td>
                  <td className="p-3 text-purple-300">Hydrostatic: Excessive fluid volume / rate exceeding LV cardiac capacity</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-medium text-white">PCWP / Left Atrial Pressure</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">&le; 18 mmHg (Normal / Low)</td>
                  <td className="p-3 font-mono font-bold text-red-400">&gt; 18 mmHg (Elevated)</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-medium text-white">Blood Pressure</td>
                  <td className="p-3">Hypotension (transient vasodilatory shock)</td>
                  <td className="p-3">Hypertension (often SBP &gt; 160–180 mmHg)</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-medium text-white">Body Temperature</td>
                  <td className="p-3">Fever common (&ge; 38.0&deg;C)</td>
                  <td className="p-3">Afebrile (typically normal)</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-medium text-white">BNP / NT-proBNP Ratio</td>
                  <td className="p-3">&lt; 1.5&times; pre-transfusion baseline</td>
                  <td className="p-3 font-bold text-purple-300">&gt; 1.5&times; surge (&gt; 400 pg/mL BNP / &gt; 1200 NT-proBNP)</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-medium text-white">Edema Fluid/Plasma Protein</td>
                  <td className="p-3 font-mono text-sky-400">&gt; 0.65 (High protein exudate)</td>
                  <td className="p-3 font-mono text-purple-400">&lt; 0.50 (Low protein transudate)</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-medium text-white">Diuretic Response</td>
                  <td className="p-3 font-bold text-rose-400">CONTRAINDICATED! Causes hypovolemic shock</td>
                  <td className="p-3 font-bold text-emerald-400">RAPID CLINICAL IMPROVEMENT (Furosemide 40-80 mg)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: AABB Bedside Algorithm */}
      {activeTab === 'algorithm' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
          <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> AABB Standard Operating Procedure for Acute Transfusion Reactions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-rose-400 flex items-center gap-2">
                <span>1. STOP Infusion &amp; Disconnect</span>
              </div>
              <div className="text-slate-300 leading-relaxed">
                Immediately stop the blood transfusion. Disconnect the blood administration tubing directly at the IV catheter hub. <strong className="text-red-300">DO NOT FLUSH the tubing</strong>, which would inject the remaining 30–50 mL of incompatible blood!
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-cyan-400 flex items-center gap-2">
                <span>2. Maintain Access &amp; Clerical Check</span>
              </div>
              <div className="text-slate-300 leading-relaxed">
                Attach a new IV infusion set with 0.9% Normal Saline to keep the vein open. Immediately re-check all patient identification bands, blood unit labels, crossmatch tags, and hospital charts for clerical discrepancy.
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-emerald-400 flex items-center gap-2">
                <span>3. Lab Workup &amp; Blood Bank Notice</span>
              </div>
              <div className="text-slate-300 leading-relaxed">
                Immediately send post-reaction blood samples (pink/lavender EDTA tube for DAT, repeat ABO/Rh type, antibody screen) and post-reaction urine (for free hemoglobin) along with the blood unit and attached tubing to the Blood Bank.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
