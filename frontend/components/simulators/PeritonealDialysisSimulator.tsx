'use client';

import React, { useState, useMemo } from 'react';
import {
  evaluatePeritonealDialysis,
  PD_CLINICAL_PRESETS,
  PatientDemographics,
  PetSamplingData,
  PdPrescription,
  ResidualRenalFunction,
  PeritonitisEvaluation,
  PetTransportCategory,
  UffClassification,
  PdModality,
} from '../../.gemini/skills/PeritonealDialysisEngine';
import {
  Activity,
  Droplets,
  Filter,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Gauge,
  Sliders,
  Scale,
  Stethoscope,
  Info,
  Layers,
  Thermometer,
  Pill,
  RefreshCw,
  Zap,
} from 'lucide-react';

export default function PeritonealDialysisSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('NORMAL_HIGH_AVERAGE_CAPD');
  const [activeTab, setActiveTab] = useState<'pet' | 'three_pore' | 'adequacy' | 'peritonitis'>('pet');

  // Patient Demographics
  const [age, setAge] = useState<number>(54);
  const [sex, setSex] = useState<'MALE' | 'FEMALE'>('MALE');
  const [heightCm, setHeightCm] = useState<number>(172);
  const [weightKg, setWeightKg] = useState<number>(74);
  const [isDiabetic, setIsDiabetic] = useState<boolean>(true);
  const [isAnuric, setIsAnuric] = useState<boolean>(false);

  // PET Sampling State
  const [infusionVolumeMl, setInfusionVolumeMl] = useState<number>(2000);
  const [dextroseConcentrationPct, setDextroseConcentrationPct] = useState<number>(2.25);
  const [serumCr, setSerumCr] = useState<number>(8.5);
  const [serumGlu, setSerumGlu] = useState<number>(130);
  const [serumBun, setSerumBun] = useState<number>(52);
  const [serumNa, setSerumNa] = useState<number>(138);

  const [d0Glu, setD0Glu] = useState<number>(2150);
  const [d2Glu, setD2Glu] = useState<number>(1100);
  const [d2Cr, setD2Cr] = useState<number>(4.4);
  const [d4Glu, setD4Glu] = useState<number>(750);
  const [d4Cr, setD4Cr] = useState<number>(6.1);
  const [d60Na, setD60Na] = useState<number>(131);
  const [effluentDrainMl, setEffluentDrainMl] = useState<number>(2320);
  const [assayMethod, setAssayMethod] = useState<'JAFFE_CORRECTED' | 'ENZYMATIC_DIRECT'>('JAFFE_CORRECTED');

  // Prescription State
  const [modality, setModality] = useState<PdModality>('CAPD');
  const [dailyDialysateVolL, setDailyDialysateVolL] = useState<number>(8.0);
  const [dailyEffluentDrainL, setDailyEffluentDrainL] = useState<number>(9.1);
  const [dialysateUreaNitrogen, setDialysateUreaNitrogen] = useState<number>(42);

  // Residual Renal State
  const [dailyUrineVolL, setDailyUrineVolL] = useState<number>(0.6);
  const [urineUreaNitrogen, setUrineUreaNitrogen] = useState<number>(280);
  const [urineCreatinine, setUrineCreatinine] = useState<number>(55);

  // Peritonitis State
  const [hasAbdominalPain, setHasAbdominalPain] = useState<boolean>(false);
  const [isEffluentCloudy, setIsEffluentCloudy] = useState<boolean>(false);
  const [effluentWbc, setEffluentWbc] = useState<number>(12);
  const [pmnPercent, setPmnPercent] = useState<number>(15);
  const [dwellDurationHours, setDwellDurationHours] = useState<number>(4);
  const [cultureResult, setCultureResult] = useState<
    'NO_GROWTH' | 'GRAM_POSITIVE_COCCI' | 'GRAM_NEGATIVE_BACILLI' | 'POLYMICROBIAL' | 'FUNGAL'
  >('NO_GROWTH');

  // Apply Preset
  const handleSelectPreset = (presetId: string) => {
    const preset = PD_CLINICAL_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setSelectedPresetId(preset.id);
    setAge(preset.patient.ageYears);
    setSex(preset.patient.sex);
    setHeightCm(preset.patient.heightCm);
    setWeightKg(preset.patient.weightKg);
    setIsDiabetic(preset.patient.isDiabetic);
    setIsAnuric(preset.patient.isAnuric);

    setInfusionVolumeMl(preset.pet.infusionVolumeMl);
    setDextroseConcentrationPct(preset.pet.dextroseConcentrationPct);
    setSerumCr(preset.pet.serumCreatinineMgDl);
    setSerumGlu(preset.pet.serumGlucoseMgDl);
    setSerumBun(preset.pet.serumBunMgDl);
    setSerumNa(preset.pet.serumSodiumMmolL);

    setD0Glu(preset.pet.dialysate0hGlucoseMgDl);
    setD2Glu(preset.pet.dialysate2hGlucoseMgDl);
    setD2Cr(preset.pet.dialysate2hCreatinineMgDl);
    setD4Glu(preset.pet.dialysate4hGlucoseMgDl);
    setD4Cr(preset.pet.dialysate4hCreatinineMgDl);
    setD60Na(preset.pet.dialysate60minSodiumMmolL);
    setEffluentDrainMl(preset.pet.effluentDrainVolumeMl);
    setAssayMethod(preset.pet.assayMethod);

    setModality(preset.rx.modality);
    setDailyDialysateVolL(preset.rx.totalDialysateVolumeLPerDay);
    setDailyEffluentDrainL(preset.rx.totalEffluentDrainLPerDay);
    setDialysateUreaNitrogen(preset.rx.dialysateUreaNitrogenMgDl);

    if (preset.renal) {
      setDailyUrineVolL(preset.renal.dailyUrineVolumeL);
      setUrineUreaNitrogen(preset.renal.urineUreaNitrogenMgDl);
      setUrineCreatinine(preset.renal.urineCreatinineMgDl);
    } else {
      setDailyUrineVolL(0);
      setUrineUreaNitrogen(0);
      setUrineCreatinine(0);
    }

    if (preset.peritonitis) {
      setHasAbdominalPain(preset.peritonitis.hasAbdominalPain);
      setIsEffluentCloudy(preset.peritonitis.isEffluentCloudy);
      setEffluentWbc(preset.peritonitis.effluentWbcPerMicroL);
      setPmnPercent(preset.peritonitis.neutrophilPercent);
      setDwellDurationHours(preset.peritonitis.dwellDurationHours);
      setCultureResult(preset.peritonitis.cultureGramStain || 'NO_GROWTH');
    } else {
      setHasAbdominalPain(false);
      setIsEffluentCloudy(false);
      setEffluentWbc(15);
      setPmnPercent(10);
      setDwellDurationHours(4);
      setCultureResult('NO_GROWTH');
    }
  };

  // Run Master Evaluation Engine
  const evaluation = useMemo(() => {
    const patient: PatientDemographics = {
      ageYears: age,
      sex,
      heightCm,
      weightKg,
      isDiabetic,
      isAnuric,
    };

    const pet: PetSamplingData = {
      infusionVolumeMl,
      dextroseConcentrationPct,
      serumCreatinineMgDl: serumCr,
      serumGlucoseMgDl: serumGlu,
      serumBunMgDl: serumBun,
      serumSodiumMmolL: serumNa,
      dialysate0hGlucoseMgDl: d0Glu,
      dialysate2hGlucoseMgDl: d2Glu,
      dialysate2hCreatinineMgDl: d2Cr,
      dialysate4hGlucoseMgDl: d4Glu,
      dialysate4hCreatinineMgDl: d4Cr,
      dialysate60minSodiumMmolL: d60Na,
      effluentDrainVolumeMl: effluentDrainMl,
      assayMethod,
    };

    const rx: PdPrescription = {
      modality,
      dayExchanges: [],
      totalDialysateVolumeLPerDay: dailyDialysateVolL,
      totalEffluentDrainLPerDay: dailyEffluentDrainL,
      dialysateUreaNitrogenMgDl: dialysateUreaNitrogen,
    };

    const renal: ResidualRenalFunction = {
      dailyUrineVolumeL: dailyUrineVolL,
      urineUreaNitrogenMgDl: urineUreaNitrogen,
      urineCreatinineMgDl: urineCreatinine,
    };

    const peritonitis: PeritonitisEvaluation = {
      hasAbdominalPain,
      isEffluentCloudy,
      effluentWbcPerMicroL: effluentWbc,
      neutrophilPercent: pmnPercent,
      dwellDurationHours,
      cultureGramStain: cultureResult,
    };

    return evaluatePeritonealDialysis(patient, pet, rx, renal, peritonitis);
  }, [
    age,
    sex,
    heightCm,
    weightKg,
    isDiabetic,
    isAnuric,
    infusionVolumeMl,
    dextroseConcentrationPct,
    serumCr,
    serumGlu,
    serumBun,
    serumNa,
    d0Glu,
    d2Glu,
    d2Cr,
    d4Glu,
    d4Cr,
    d60Na,
    effluentDrainMl,
    assayMethod,
    modality,
    dailyDialysateVolL,
    dailyEffluentDrainL,
    dialysateUreaNitrogen,
    dailyUrineVolL,
    urineUreaNitrogen,
    urineCreatinine,
    hasAbdominalPain,
    isEffluentCloudy,
    effluentWbc,
    pmnPercent,
    dwellDurationHours,
    cultureResult,
  ]);

  // Color mappings
  const getTransportBadge = (cat: PetTransportCategory) => {
    switch (cat) {
      case 'HIGH_TRANSPORTER':
        return { bg: 'bg-rose-500/20 text-rose-400 border-rose-500/40', label: 'High (Fast) Transporter (D/P \u2265 0.82)' };
      case 'HIGH_AVERAGE_TRANSPORTER':
        return { bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40', label: 'High-Average Transporter (0.65 - 0.81)' };
      case 'LOW_AVERAGE_TRANSPORTER':
        return { bg: 'bg-blue-500/20 text-blue-400 border-blue-500/40', label: 'Low-Average Transporter (0.50 - 0.64)' };
      case 'LOW_TRANSPORTER':
        return { bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', label: 'Low (Slow) Transporter (D/P < 0.50)' };
    }
  };

  const getUffBadge = (uff: UffClassification) => {
    switch (uff) {
      case 'NO_UFF':
        return { bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', label: 'Normal Membrane Ultrafiltration' };
      case 'TYPE_I_HYPERPERMEABILITY':
        return { bg: 'bg-rose-500/20 text-rose-400 border-rose-500/40', label: 'Type I UFF: Fast Solute / Hyperpermeability' };
      case 'TYPE_II_AQUAPORIN_DEFECT':
        return { bg: 'bg-purple-500/20 text-purple-400 border-purple-500/40', label: 'Type II UFF: Aquaporin-1 Water Channel Defect' };
      case 'TYPE_III_MEMBRANE_SCLEROSIS':
        return { bg: 'bg-red-700/30 text-red-300 border-red-500/60', label: 'Type III UFF: Peritoneal Sclerosis / EPS Precursor' };
      case 'TYPE_IV_HIGH_LYMPHATIC_ABSORPTION':
        return { bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40', label: 'Type IV UFF: High Lymphatic Absorption' };
      default:
        return { bg: 'bg-slate-700 text-slate-300 border-slate-600', label: 'Mechanical / Non-membrane Failure' };
    }
  };

  const transportBadge = getTransportBadge(evaluation.petTransportCategory);
  const uffBadge = getUffBadge(evaluation.uffClassification);

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-xl p-4 md:p-6 border border-slate-800 shadow-2xl">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-sky-500/10 text-sky-400 border border-sky-500/30">
              Nephrology Workstation
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              ISPD 2022 &amp; Three-Pore Model
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Droplets className="w-6 h-6 text-sky-400" />
            Peritoneal Dialysis (PD), Adequacy &amp; PET Membrane Workstation
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Model Twardowski 4-hour Peritoneal Equilibration Test (PET) curves, Watson total body water, Three-Pore
            aquaporin sodium sieving, total weekly Kt/V adequacy, and 2022 ISPD peritonitis protocols.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <label htmlFor="preset-select" className="text-xs font-semibold text-slate-400 whitespace-nowrap">Clinical Preset:</label>
          <select
            id="preset-select"
            aria-label="Clinical Preset"
            value={selectedPresetId}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="w-full lg:w-72 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          >
            {PD_CLINICAL_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clinical Alerts Banner */}
      {evaluation.clinicalAlerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {evaluation.clinicalAlerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border flex items-start gap-3 text-sm ${
                alert.includes('EMERGENCY') || alert.includes('Absolute')
                  ? 'bg-rose-950/40 border-rose-600/60 text-rose-300'
                  : alert.includes('Peritonitis')
                  ? 'bg-amber-950/40 border-amber-600/60 text-amber-300'
                  : 'bg-sky-950/40 border-sky-600/60 text-sky-300'
              }`}
            >
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{alert}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top Clinical Scoreboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* PET Transport Category Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-sky-400" />
            4h D/P Creatinine
          </div>
          <div className="text-2xl font-black text-white">
            {evaluation.dpCreatinine4h.toFixed(2)}
          </div>
          <div className="mt-1">
            <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded border ${transportBadge.bg}`}>
              {evaluation.petTransportCategory.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            4h D/D0 Glucose: <span className="text-slate-200 font-mono font-semibold">{evaluation.dd0Glucose4h.toFixed(2)}</span>
          </div>
        </div>

        {/* Sodium Sieving & Net UF Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-cyan-400" />
            4h Net Ultrafiltration
          </div>
          <div className={`text-2xl font-black ${evaluation.netUltrafiltration4hMl >= 400 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {evaluation.netUltrafiltration4hMl > 0 ? `+${evaluation.netUltrafiltration4hMl}` : evaluation.netUltrafiltration4hMl} mL
          </div>
          <div className="mt-1">
            <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded border ${uffBadge.bg}`}>
              {evaluation.hasUltrafiltrationFailure ? uffBadge.label : 'Intact UF'}
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Sodium Dip: <span className={`font-mono font-semibold ${evaluation.hasIntactAquaporins ? 'text-cyan-300' : 'text-rose-400'}`}>
              {evaluation.sodiumDipMmolL.toFixed(1)} mmol/L {evaluation.hasIntactAquaporins ? '(\u2265 5)' : '(< 5, AQP1 Defect)'}
            </span>
          </div>
        </div>

        {/* Weekly Total Kt/V Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-indigo-400" />
            Total Weekly Kt/V
          </div>
          <div className={`text-2xl font-black ${evaluation.totalWeeklyKtV >= 1.70 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {evaluation.totalWeeklyKtV.toFixed(2)}
          </div>
          <div className="mt-1">
            <span
              className={`inline-block px-2 py-0.5 text-xs font-medium rounded border ${
                evaluation.adequacyStatus === 'OPTIMAL'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
            >
              {evaluation.adequacyStatus} (Target \u2265 1.70)
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-2 flex justify-between">
            <span>Peritoneal: <span className="text-slate-200 font-mono">{evaluation.weeklyPeritonealKtV.toFixed(2)}</span></span>
            <span>Renal: <span className="text-slate-200 font-mono">{evaluation.weeklyRenalKtV.toFixed(2)}</span></span>
          </div>
        </div>

        {/* ISPD Peritonitis Status Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            ISPD 2022 Peritonitis
          </div>
          <div className="text-2xl font-black">
            {evaluation.peritonitisSeverity === 'CONFIRMED_PERITONITIS' ? (
              <span className="text-rose-400">POSITIVE</span>
            ) : evaluation.peritonitisSeverity === 'SUSPECTED_INDETERMINATE' ? (
              <span className="text-amber-400">SUSPECTED</span>
            ) : (
              <span className="text-emerald-400">NEGATIVE</span>
            )}
          </div>
          <div className="mt-1">
            <span
              className={`inline-block px-2 py-0.5 text-xs font-medium rounded border ${
                evaluation.peritonitisCriteriaMet
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {evaluation.peritonitisCriteriaCount}/3 ISPD Criteria
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Effluent: <span className="text-slate-200 font-mono">{effluentWbc} WBC/&mu;L ({pmnPercent}% PMN)</span>
          </div>
        </div>
      </div>

      {/* Modality Recommendation Box */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-purple-950/40 border border-sky-800/40 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-sky-400 shrink-0" />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">Clinical Prescription Recommendation:</span>
              <h3 className="text-base font-bold text-white">
                {evaluation.recommendedModality === 'APD_CCPD' ? 'Automated Peritoneal Dialysis (APD / CCPD)' : 'Continuous Ambulatory Peritoneal Dialysis (CAPD)'}
              </h3>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/40">
            {evaluation.petTransportCategory.replace(/_/g, ' ')}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
          {evaluation.modalityRationale}
        </p>
      </div>

      {/* Interactive Tabs */}
      <div className="flex border-b border-slate-800 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('pet')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'pet'
              ? 'border-sky-500 text-sky-400 bg-sky-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          1. PET &amp; Transport Dynamics
        </button>
        <button
          onClick={() => setActiveTab('three_pore')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'three_pore'
              ? 'border-sky-500 text-sky-400 bg-sky-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          2. Three-Pore Model &amp; UFF
        </button>
        <button
          onClick={() => setActiveTab('adequacy')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'adequacy'
              ? 'border-sky-500 text-sky-400 bg-sky-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-4 h-4" />
          3. Weekly Kt/V &amp; Adequacy
        </button>
        <button
          onClick={() => setActiveTab('peritonitis')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'peritonitis'
              ? 'border-sky-500 text-sky-400 bg-sky-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          4. ISPD Peritonitis Protocol
        </button>
      </div>

      {/* Tab 1: PET & Transport Dynamics */}
      {activeTab === 'pet' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-400" />
                PET Dextrose &amp; Serum Chemistry
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Dextrose Concentration</label>
                  <select
                    value={dextroseConcentrationPct}
                    onChange={(e) => setDextroseConcentrationPct(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200"
                  >
                    <option value={1.5}>1.5% Dextrose</option>
                    <option value={2.25}>2.25% Dextrose (Standard PET)</option>
                    <option value={3.86}>3.86% Dextrose (European)</option>
                    <option value={4.25}>4.25% Dextrose (Modified)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Infusion Volume (mL)</label>
                  <input
                    type="number"
                    value={infusionVolumeMl}
                    onChange={(e) => setInfusionVolumeMl(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Assay Method</label>
                  <select
                    value={assayMethod}
                    onChange={(e) => setAssayMethod(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 text-xs"
                  >
                    <option value="JAFFE_CORRECTED">Jaffe (Corrected)</option>
                    <option value="ENZYMATIC_DIRECT">Enzymatic (Direct)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Serum Creatinine (mg/dL)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={serumCr}
                    onChange={(e) => setSerumCr(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Serum Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={serumGlu}
                    onChange={(e) => setSerumGlu(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Serum BUN (mg/dL)</label>
                  <input
                    type="number"
                    value={serumBun}
                    onChange={(e) => setSerumBun(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Timed Dialysate Sampling */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Timed Dialysate Effluent Samples
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">0-Hour Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={d0Glu}
                    onChange={(e) => setD0Glu(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">2-Hour Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={d2Glu}
                    onChange={(e) => setD2Glu(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">2-Hour Creatinine (mg/dL)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={d2Cr}
                    onChange={(e) => setD2Cr(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">4-Hour Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={d4Glu}
                    onChange={(e) => setD4Glu(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">4-Hour Creatinine (mg/dL)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={d4Cr}
                    onChange={(e) => setD4Cr(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">4-Hour Drain Volume (mL)</label>
                  <input
                    type="number"
                    value={effluentDrainMl}
                    onChange={(e) => setEffluentDrainMl(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PET Visualisation & Classification Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-semibold text-white mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-sky-400" />
                  PET Curves: D/P Creatinine &amp; D/D0 Glucose
                </span>
                <span className="text-xs font-mono text-slate-400">Twardowski 4-Hour Standard</span>
              </h4>

              {/* SVG PET Curve Simulation */}
              <div className="w-full bg-slate-950 rounded-lg p-3 border border-slate-800">
                <svg viewBox="0 0 400 180" className="w-full h-44">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="40" y2="150" stroke="#334155" strokeWidth="1" />
                  <line x1="40" y1="150" x2="380" y2="150" stroke="#334155" strokeWidth="1" />
                  <line x1="210" y1="20" x2="210" y2="150" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="380" y1="20" x2="380" y2="150" stroke="#1e293b" strokeDasharray="3 3" />

                  {/* Y-axis ticks */}
                  <text x="32" y="25" fill="#64748b" fontSize="9" textAnchor="end">1.0</text>
                  <text x="32" y="85" fill="#64748b" fontSize="9" textAnchor="end">0.5</text>
                  <text x="32" y="153" fill="#64748b" fontSize="9" textAnchor="end">0.0</text>

                  {/* X-axis labels */}
                  <text x="40" y="165" fill="#94a3b8" fontSize="10" textAnchor="middle">0h</text>
                  <text x="210" y="165" fill="#94a3b8" fontSize="10" textAnchor="middle">2h</text>
                  <text x="380" y="165" fill="#94a3b8" fontSize="10" textAnchor="middle">4h</text>

                  {/* High Transporter Boundary (0.82) */}
                  <line x1="40" y1="43" x2="380" y2="43" stroke="#f43f5e" strokeWidth="0.75" strokeDasharray="4 2" />
                  <text x="375" y="40" fill="#f43f5e" fontSize="8" textAnchor="end">High &ge; 0.82</text>

                  {/* Low Transporter Boundary (0.50) */}
                  <line x1="40" y1="85" x2="380" y2="85" stroke="#10b981" strokeWidth="0.75" strokeDasharray="4 2" />
                  <text x="375" y="82" fill="#10b981" fontSize="8" textAnchor="end">Low &le; 0.50</text>

                  {/* Creatinine D/P Curve (Rising) */}
                  {/* (0h -> 0.05, 2h -> dpCreatinine2h, 4h -> dpCreatinine4h) */}
                  {(() => {
                    const y0 = 150 - 0.05 * 130;
                    const y2 = 150 - Math.min(1.1, evaluation.dpCreatinine2h) * 130;
                    const y4 = 150 - Math.min(1.1, evaluation.dpCreatinine4h) * 130;
                    return (
                      <g>
                        <path
                          d={`M 40 ${y0} Q 125 ${(y0 + y2) / 2} 210 ${y2} T 380 ${y4}`}
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2.5"
                        />
                        <circle cx="210" cy={y2} r="4" fill="#38bdf8" />
                        <circle cx="380" cy={y4} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                        <text x="385" y={y4 + 4} fill="#38bdf8" fontSize="10" fontWeight="bold">
                          D/P Cr: {evaluation.dpCreatinine4h.toFixed(2)}
                        </text>
                      </g>
                    );
                  })()}

                  {/* Glucose D/D0 Curve (Falling) */}
                  {(() => {
                    const y0 = 150 - 1.0 * 130;
                    const y2 = 150 - Math.max(0.05, evaluation.dd0Glucose2h) * 130;
                    const y4 = 150 - Math.max(0.05, evaluation.dd0Glucose4h) * 130;
                    return (
                      <g>
                        <path
                          d={`M 40 ${y0} Q 125 ${(y0 + y2) / 2} 210 ${y2} T 380 ${y4}`}
                          fill="none"
                          stroke="#fbbf24"
                          strokeWidth="2"
                          strokeDasharray="5 3"
                        />
                        <circle cx="210" cy={y2} r="3" fill="#fbbf24" />
                        <circle cx="380" cy={y4} r="4" fill="#fbbf24" />
                        <text x="385" y={y4 + 14} fill="#fbbf24" fontSize="9" fontWeight="medium">
                          D/D0: {evaluation.dd0Glucose4h.toFixed(2)}
                        </text>
                      </g>
                    );
                  })()}
                </svg>

                <div className="flex items-center justify-between text-xs text-slate-400 px-2 mt-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-sky-400 inline-block"></span>
                    <span>D/P Creatinine (Clearance)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-amber-400 inline-block border-b border-dashed border-amber-400"></span>
                    <span>D/D0 Glucose (Osmotic Reserve)</span>
                  </div>
                </div>
              </div>

              {/* Category Breakdown Table */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className={`p-2.5 rounded-lg border ${evaluation.petTransportCategory === 'HIGH_TRANSPORTER' ? 'bg-rose-950/40 border-rose-500' : 'bg-slate-950/40 border-slate-800'}`}>
                  <div className="font-semibold text-rose-400">High Transporter (&ge; 0.82)</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Rapid solute clearance; early loss of ultrafiltration. Best on APD.</div>
                </div>
                <div className={`p-2.5 rounded-lg border ${evaluation.petTransportCategory === 'HIGH_AVERAGE_TRANSPORTER' ? 'bg-amber-950/40 border-amber-500' : 'bg-slate-950/40 border-slate-800'}`}>
                  <div className="font-semibold text-amber-400">High-Average (0.65 - 0.81)</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Most common phenotype. Suitable for CAPD or APD.</div>
                </div>
                <div className={`p-2.5 rounded-lg border ${evaluation.petTransportCategory === 'LOW_AVERAGE_TRANSPORTER' ? 'bg-blue-950/40 border-blue-500' : 'bg-slate-950/40 border-slate-800'}`}>
                  <div className="font-semibold text-blue-400">Low-Average (0.50 - 0.64)</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Good ultrafiltration; requires prolonged contact time (CAPD).</div>
                </div>
                <div className={`p-2.5 rounded-lg border ${evaluation.petTransportCategory === 'LOW_TRANSPORTER' ? 'bg-emerald-950/40 border-emerald-500' : 'bg-slate-950/40 border-slate-800'}`}>
                  <div className="font-semibold text-emerald-400">Low Transporter (&lt; 0.50)</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Superb ultrafiltration, slow solute clearance. High volume CAPD.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Three-Pore Model & UFF */}
      {activeTab === 'three_pore' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Three-Pore Membrane Model Biophysics
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                The Rippe Three-Pore Model characterizes peritoneal transport across three distinct anatomical pore
                pathways:
              </p>

              <div className="space-y-3 text-xs">
                {/* Aquaporin 1 */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5" />
                      1. Ultra-Small Pores (Aquaporin-1)
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Radius ~0.4 nm</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Exclusive water-only channel. Responsible for ~40-50% of initial transcellular ultrafiltration in
                    response to crystalloid osmotic gradient. Causes &ldquo;Sodium Sieving&rdquo; (dilution of dialysate sodium in the first 60-120 minutes).
                  </p>
                </div>

                {/* Small Pores */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5" />
                      2. Small Pores (Inter-endothelial Clefts)
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Radius ~4.0 - 5.0 nm</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Transports &gt;90% of small solutes (urea, creatinine, sodium, glucose). Responsible for small-pore
                    hydraulic flow and colloid osmosis driven by Icodextrin.
                  </p>
                </div>

                {/* Large Pores */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-rose-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      3. Large Pores (Venular Gaps)
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Radius ~20 - 40 nm</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Account for macromolecule leakage (albumin, IgG). Represents &lt;0.01% of total pore count but
                    accounts for peritoneal protein loss of 5-15 g/day.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-sky-400" />
                Sodium Sieving &amp; Ultrafiltration Failure (UFF) Evaluation
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div>
                  <label className="text-slate-400 block mb-1">Serum Sodium (mmol/L)</label>
                  <input
                    type="number"
                    value={serumNa}
                    onChange={(e) => setSerumNa(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">60-Min Dialysate Sodium (mmol/L)</label>
                  <input
                    type="number"
                    value={d60Na}
                    onChange={(e) => setD60Na(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
              </div>

              {/* Sodium Sieving Diagnostic Box */}
              <div className={`p-3.5 rounded-lg border mb-4 ${evaluation.hasIntactAquaporins ? 'bg-cyan-950/40 border-cyan-500/50' : 'bg-rose-950/40 border-rose-500/50'}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Sodium Sieving Dip (&Delta;Na)
                  </span>
                  <span className={`text-sm font-mono font-black ${evaluation.hasIntactAquaporins ? 'text-cyan-400' : 'text-rose-400'}`}>
                    {evaluation.sodiumDipMmolL.toFixed(1)} mmol/L
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {evaluation.hasIntactAquaporins
                    ? 'Normal sieving (\u2265 5 mmol/L). Confirms functional transcellular Aquaporin-1 water channels.'
                    : 'Blunted sodium sieving (< 5 mmol/L). Selective aquaporin-1 defect leading to impaired crystalloid ultrafiltration (Type II UFF).'}
                </p>
              </div>

              {/* UFF Classification Table */}
              <div className="space-y-2 text-xs">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  UFF Etiology Breakdown
                </div>
                <div className={`p-2.5 rounded border text-[11px] ${evaluation.uffClassification === 'TYPE_I_HYPERPERMEABILITY' ? 'bg-rose-900/30 border-rose-500 text-rose-200' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  <strong>Type I (Hyperpermeability):</strong> Fast solute transport (D/P Cr &ge; 0.82) causing premature glucose loss. Solution: APD short dwells + Day Icodextrin.
                </div>
                <div className={`p-2.5 rounded border text-[11px] ${evaluation.uffClassification === 'TYPE_II_AQUAPORIN_DEFECT' ? 'bg-purple-900/30 border-purple-500 text-purple-200' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  <strong>Type II (Aquaporin Defect):</strong> Loss of water channels; &Delta;Na &lt; 5 mmol/L. Dextrose UF fails; Icodextrin colloid UF often preserved.
                </div>
                <div className={`p-2.5 rounded border text-[11px] ${evaluation.uffClassification === 'TYPE_III_MEMBRANE_SCLEROSIS' ? 'bg-red-900/30 border-red-500 text-red-200' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  <strong>Type III (Sclerosis / EPS Precursor):</strong> Decreased vascular surface area &amp; fibrosis. Low transport (D/P Cr &lt; 0.50). Urgent conversion to hemodialysis.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Weekly Kt/V & Adequacy */}
      {activeTab === 'adequacy' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            {/* Anthropometry & Watson TBW */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-400" />
                Anthropometry &amp; Watson Total Body Water (V)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Age (years)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Sex</label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-400">Watson TBW Volume (V): </span>
                  <span className="font-mono font-bold text-indigo-400">{evaluation.watsonTbwLiters.toFixed(1)} L</span>
                </div>
                <div>
                  <span className="text-slate-400">Body Surface Area (BSA): </span>
                  <span className="font-mono font-bold text-slate-200">{evaluation.bsaM2.toFixed(2)} m&sup2;</span>
                </div>
              </div>
            </div>

            {/* Dialysate Prescription Volumes */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-400" />
                24-Hour PD Dialysate Collection
              </h4>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Dialysate Volume (L/day)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={dailyDialysateVolL}
                    onChange={(e) => setDailyDialysateVolL(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Effluent Drain (L/day)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={dailyEffluentDrainL}
                    onChange={(e) => setDailyEffluentDrainL(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Dialysate Urea (mg/dL)</label>
                  <input
                    type="number"
                    value={dialysateUreaNitrogen}
                    onChange={(e) => setDialysateUreaNitrogen(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            {/* Residual Renal Function */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  Residual Kidney Function (RKF)
                </h4>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnuric}
                    onChange={(e) => setIsAnuric(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-sky-500"
                  />
                  <span>Anuric Patient (0 urine)</span>
                </label>
              </div>

              {!isAnuric ? (
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Urine Output (L/day)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={dailyUrineVolL}
                      onChange={(e) => setDailyUrineVolL(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Urine Urea (mg/dL)</label>
                    <input
                      type="number"
                      value={urineUreaNitrogen}
                      onChange={(e) => setUrineUreaNitrogen(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Urine Cr (mg/dL)</label>
                    <input
                      type="number"
                      value={urineCreatinine}
                      onChange={(e) => setUrineCreatinine(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400">
                  Patient is clinically anuric. All solute and fluid clearance is 100% dependent on peritoneal membrane.
                </div>
              )}
            </div>

            {/* Total Clearance Breakdown */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-indigo-400" />
                  Weekly Adequacy Targets
                </span>
                <span className="text-xs font-mono text-slate-400">KDOQI / ISPD Target &ge; 1.70</span>
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Peritoneal Weekly Kt/V:</span>
                  <span className="font-mono font-bold text-sky-400">{evaluation.weeklyPeritonealKtV.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Residual Renal Weekly Kt/V:</span>
                  <span className="font-mono font-bold text-emerald-400">{evaluation.weeklyRenalKtV.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded bg-indigo-950/40 border border-indigo-500/40">
                  <span className="text-white font-semibold">Total Weekly Kt/V:</span>
                  <span className={`font-mono text-base font-black ${evaluation.totalWeeklyKtV >= 1.7 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {evaluation.totalWeeklyKtV.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Weekly CrCl (L/wk/1.73m&sup2;):</span>
                  <span className="font-mono font-bold text-slate-200">
                    {evaluation.weeklyCreatinineClearanceLPerWeekPer173.toFixed(1)} L (Target &ge; 45-60)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: ISPD Peritonitis Protocol */}
      {activeTab === 'peritonitis' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                ISPD 2022 Diagnostic Triad (2 of 3 Required)
              </h4>

              <div className="space-y-3 text-xs">
                {/* Criterion 1 */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-semibold text-white mb-2">
                    Criterion 1: Clinical Signs &amp; Symptoms
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={hasAbdominalPain}
                        onChange={(e) => setHasAbdominalPain(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-rose-500"
                      />
                      <span>Abdominal Pain / Rebound</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={isEffluentCloudy}
                        onChange={(e) => setIsEffluentCloudy(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-rose-500"
                      />
                      <span>Cloudy Dialysate Effluent</span>
                    </label>
                  </div>
                </div>

                {/* Criterion 2 */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-semibold text-white mb-2">
                    Criterion 2: Effluent Dialysate Cell Count (&gt;100/&mu;L, &ge;50% PMN)
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Effluent WBC (/&mu;L)</label>
                      <input
                        type="number"
                        value={effluentWbc}
                        onChange={(e) => setEffluentWbc(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Polymorphonuclear PMN (%)</label>
                      <input
                        type="number"
                        value={pmnPercent}
                        onChange={(e) => setPmnPercent(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Criterion 3 */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-semibold text-white mb-2">
                    Criterion 3: Gram Stain &amp; Microbiological Culture
                  </div>
                  <select
                    value={cultureResult}
                    onChange={(e) => setCultureResult(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200"
                  >
                    <option value="NO_GROWTH">No Growth / Pending</option>
                    <option value="GRAM_POSITIVE_COCCI">Gram-Positive Cocci (S. aureus, CoNS)</option>
                    <option value="GRAM_NEGATIVE_BACILLI">Gram-Negative Bacilli (E. coli, Pseudomonas)</option>
                    <option value="POLYMICROBIAL">Polymicrobial / Enteric Organisms</option>
                    <option value="FUNGAL">Fungal (Candida spp.) - EMERGENCY</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-400" />
                ISPD 2022 Intraperitoneal (IP) Regimen Recommendations
              </h4>

              {evaluation.peritonitisCriteriaMet ? (
                <div className="space-y-3">
                  <div className="p-3 bg-rose-950/30 border border-rose-600/50 rounded-lg text-xs text-rose-300">
                    <strong>CONFIRMED PERITONITIS:</strong> {evaluation.peritonitisCriteriaCount} of 3 diagnostic
                    criteria satisfied. Empiric Intraperitoneal antibiotics must be administered without waiting for
                    final culture results.
                  </div>

                  <div className="space-y-2 text-xs">
                    {evaluation.recommendedAntibiotics.map((abx, i) => (
                      <div key={i} className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-start gap-2 text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{abx}</span>
                      </div>
                    ))}
                  </div>

                  {evaluation.catheterRemovalIndicated && (
                    <div className="p-3 bg-red-950/60 border border-red-500 rounded-lg text-xs text-red-200 font-semibold">
                      CRITICAL: {evaluation.catheterRemovalReason}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400 leading-relaxed">
                  Peritonitis criteria not met ({evaluation.peritonitisCriteriaCount}/3 criteria). Standard prophylactic
                  catheter hygiene is maintained. If cloudy bag or localized pain develops, repeat effluent cell count
                  after a minimum of 2 hours dwell time.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
