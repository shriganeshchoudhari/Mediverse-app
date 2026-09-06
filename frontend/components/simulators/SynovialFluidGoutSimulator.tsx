'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Microscope,
  Eye,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  RotateCw,
  Sparkles,
  Pill,
  HelpCircle,
  FlaskConical,
  Flame,
  FileText,
} from 'lucide-react';
import {
  CrystalType,
  SynovialFluidClarity,
  categorizeSynovialFluid,
  evaluateCrystalMicroscopy,
  calculateAcrEularGoutScore,
  formulateGoutTherapyPlan,
  SynovialFluidAnalysisInput,
  AcrEularGoutCriteriaInput,
  PatientRenalComorbidity,
} from '../../.gemini/skills/SynovialFluidGoutEngine';

interface PresetCase {
  id: string;
  name: string;
  badge: string;
  summary: string;
  fluid: SynovialFluidAnalysisInput;
  angle: number;
  compensator: boolean;
  criteria: AcrEularGoutCriteriaInput;
  comorbidities: PatientRenalComorbidity;
}

const PRESET_CASES: PresetCase[] = [
  {
    id: 'acute-mtp1-gout',
    name: 'Acute First MTP Podagra (Classic Gout)',
    badge: 'Podagra Flare',
    summary:
      '54-year-old male with sudden nocturnal onset of excruciating pain and intense erythema of the 1st metatarsophalangeal joint after red wine and shellfish.',
    fluid: {
      volumeMl: 0.8,
      clarity: 'TRANSLUCENT_CLOUDY',
      color: 'Cloudy yellow',
      wbcCountPerMm3: 32000,
      neutrophilPercent: 82,
      rbcCountPerMm3: 1200,
      glucoseMgDl: 78,
      serumGlucoseMgDl: 102,
      viscosityStringCm: 1.5,
      gramStainPositive: false,
      bacterialCulturePositive: false,
      crystalIdentified: 'MONOSODIUM_URATE',
    },
    angle: 45, // Aligned parallel to slow axis -> Vivid Yellow
    compensator: true,
    criteria: {
      symptomPattern: 'FIRST_MTP_PODAGRA',
      characteristicEpisodesCount: 3,
      timeCourseTypical: true,
      clinicalTophusPresent: false,
      serumUrateMgDl: 9.4,
      msuCrystalInSynovialFluid: true,
      imagingUrateDeposition: true,
      imagingErosion: false,
    },
    comorbidities: {
      eGfrMlMin: 85,
      hasActivePepticUlcer: false,
      hasSevereHeartFailure: false,
      isTakingStrongCyp3a4OrPgpInhibitor: false,
      hlaB5801Positive: false,
    },
  },
  {
    id: 'cppd-pseudogout-knee',
    name: 'Acute Knee Chondrocalcinosis (Pseudogout / CPPD)',
    badge: 'CPPD Pseudogout',
    summary:
      '74-year-old female post-cholecystectomy presenting with acute warm effusion and severe restriction of the right knee. Plain radiographs reveal meniscal chondrocalcinosis.',
    fluid: {
      volumeMl: 28,
      clarity: 'TRANSLUCENT_CLOUDY',
      color: 'Straw cloudy',
      wbcCountPerMm3: 24000,
      neutrophilPercent: 74,
      rbcCountPerMm3: 2500,
      glucoseMgDl: 84,
      serumGlucoseMgDl: 98,
      viscosityStringCm: 2.0,
      gramStainPositive: false,
      bacterialCulturePositive: false,
      crystalIdentified: 'CALCIUM_PYROPHOSPHATE',
    },
    angle: 45, // Parallel -> Pale Blue
    compensator: true,
    criteria: {
      symptomPattern: 'OTHER_JOINT',
      characteristicEpisodesCount: 2,
      timeCourseTypical: true,
      clinicalTophusPresent: false,
      serumUrateMgDl: 5.2,
      msuCrystalInSynovialFluid: false,
      imagingUrateDeposition: false,
      imagingErosion: false,
    },
    comorbidities: {
      eGfrMlMin: 55,
      hasActivePepticUlcer: false,
      hasSevereHeartFailure: false,
      isTakingStrongCyp3a4OrPgpInhibitor: false,
      hlaB5801Positive: false,
    },
  },
  {
    id: 'septic-crystal-coexistence',
    name: 'Septic Knee Arthritis with Co-existent Crystal Debris',
    badge: 'CRITICAL EMERGENCY',
    summary:
      '68-year-old diabetic with rigors, high fever 39.2&deg;C, and massive tense knee effusion. Critical warning: crystals do not exclude bacterial joint sepsis.',
    fluid: {
      volumeMl: 45,
      clarity: 'OPAQUE_PURULENT',
      color: 'Frank purulent green-yellow',
      wbcCountPerMm3: 94000,
      neutrophilPercent: 96,
      rbcCountPerMm3: 8000,
      glucoseMgDl: 24,
      serumGlucoseMgDl: 140,
      viscosityStringCm: 0.5,
      gramStainPositive: true, // Gram positive cocci in clusters
      bacterialCulturePositive: true,
      crystalIdentified: 'MONOSODIUM_URATE',
    },
    angle: 135, // Perpendicular -> Blue
    compensator: true,
    criteria: {
      symptomPattern: 'OTHER_JOINT',
      characteristicEpisodesCount: 2,
      timeCourseTypical: false,
      clinicalTophusPresent: true,
      serumUrateMgDl: 8.2,
      msuCrystalInSynovialFluid: true,
      imagingUrateDeposition: true,
      imagingErosion: true,
    },
    comorbidities: {
      eGfrMlMin: 40,
      hasActivePepticUlcer: false,
      hasSevereHeartFailure: false,
      isTakingStrongCyp3a4OrPgpInhibitor: false,
      hlaB5801Positive: false,
    },
  },
  {
    id: 'gout-ckd-hla-b5801',
    name: 'Chronic Tophaceous Gout in CKD (HLA-B*5801 Carrier)',
    badge: 'Precision Pharmacogenomics',
    summary:
      '61-year-old male of Han Chinese ancestry with extensive olecranon and tophi, eGFR 22 mL/min, and positive HLA-B*5801 screening test.',
    fluid: {
      volumeMl: 2.0,
      clarity: 'TRANSLUCENT_CLOUDY',
      color: 'Chalky white suspension',
      wbcCountPerMm3: 18000,
      neutrophilPercent: 68,
      rbcCountPerMm3: 800,
      glucoseMgDl: 90,
      serumGlucoseMgDl: 104,
      viscosityStringCm: 1.2,
      gramStainPositive: false,
      bacterialCulturePositive: false,
      crystalIdentified: 'MONOSODIUM_URATE',
    },
    angle: 45,
    compensator: true,
    criteria: {
      symptomPattern: 'ANKLE_OR_MIDFOOT',
      characteristicEpisodesCount: 3,
      timeCourseTypical: true,
      clinicalTophusPresent: true,
      serumUrateMgDl: 10.8,
      msuCrystalInSynovialFluid: true,
      imagingUrateDeposition: true,
      imagingErosion: true,
    },
    comorbidities: {
      eGfrMlMin: 22,
      hasActivePepticUlcer: true,
      hasSevereHeartFailure: false,
      isTakingStrongCyp3a4OrPgpInhibitor: false,
      hlaB5801Positive: true,
    },
  },
];

export default function SynovialFluidGoutSimulator() {
  const [activePreset, setActivePreset] = useState<PresetCase>(PRESET_CASES[0]);

  // Arthrocentesis states
  const [fluidInput, setFluidInput] = useState<SynovialFluidAnalysisInput>(PRESET_CASES[0].fluid);

  // Microscopy states
  const [crystalAngle, setCrystalAngle] = useState<number>(PRESET_CASES[0].angle);
  const [compensatorIn, setCompensatorIn] = useState<boolean>(PRESET_CASES[0].compensator);
  const [selectedCrystal, setSelectedCrystal] = useState<CrystalType>(PRESET_CASES[0].fluid.crystalIdentified);

  // ACR/EULAR states
  const [criteria, setCriteria] = useState<AcrEularGoutCriteriaInput>(PRESET_CASES[0].criteria);

  // Comorbidities states
  const [comorbidities, setComorbidities] = useState<PatientRenalComorbidity>(PRESET_CASES[0].comorbidities);

  const applyPreset = (preset: PresetCase) => {
    setActivePreset(preset);
    setFluidInput(preset.fluid);
    setCrystalAngle(preset.angle);
    setCompensatorIn(preset.compensator);
    setSelectedCrystal(preset.fluid.crystalIdentified);
    setCriteria(preset.criteria);
    setComorbidities(preset.comorbidities);
  };

  // 1. Arthrocentesis outcome
  const arthrocentesisResult = useMemo(() => {
    return categorizeSynovialFluid(fluidInput);
  }, [fluidInput]);

  // 2. Optical CPLM phenotype
  const opticalResult = useMemo(() => {
    return evaluateCrystalMicroscopy(selectedCrystal, crystalAngle, compensatorIn);
  }, [selectedCrystal, crystalAngle, compensatorIn]);

  // 3. ACR/EULAR Gout Score
  const goutScoreResult = useMemo(() => {
    return calculateAcrEularGoutScore(criteria);
  }, [criteria]);

  // 4. Pharmacotherapy Regimen
  const therapyPlan = useMemo(() => {
    return formulateGoutTherapyPlan(criteria.serumUrateMgDl, criteria.clinicalTophusPresent, comorbidities);
  }, [criteria.serumUrateMgDl, criteria.clinicalTophusPresent, comorbidities]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
              <Link href="/simulators" className="hover:underline text-slate-400">
                Simulators
              </Link>
              <span>/</span>
              <span>Rheumatology, Immunology &amp; Clinical Pathology</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
              <Microscope className="w-8 h-8 text-rose-500" />
              Synovial Fluid Polarized Microscopy &amp; Gout Workstation
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Compensated Polarized Light Microscopy (CPLM 530 nm red plate), MSU vs CPPD birefringence kinetics,
              arthrocentesis sepsis triaging, 2015 ACR/EULAR criteria, and HLA-B*5801 precision pharmacotherapy.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              CPLM Optics Engine
            </span>
          </div>
        </div>

        {/* Case Presets Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_CASES.map((preset) => {
            const isSelected = activePreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={'text-left p-3 rounded-xl border transition-all ' + (isSelected
                  ? 'bg-rose-950/40 border-rose-500 shadow-md shadow-rose-950/30'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900')}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                    {preset.badge}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />}
                </div>
                <h3 className="text-xs font-bold text-white line-clamp-1">{preset.name}</h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-snug">
                  {preset.summary}
                </p>
              </button>
            );
          })}
        </div>

        {/* Critical Septic Alert Banner if present */}
        {arthrocentesisResult.isSepticSuspicionHigh && (
          <div className="bg-rose-950/80 border-2 border-rose-500 rounded-xl p-4 flex items-start gap-4 shadow-xl">
            <ShieldAlert className="w-7 h-7 text-rose-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-rose-200 uppercase tracking-wide flex items-center gap-2">
                CRITICAL WARNING: Septic Arthritis Alert &mdash; Do Not Mistake Crystals for Sterility
              </h2>
              <p className="text-xs text-rose-300 leading-relaxed">
                {arthrocentesisResult.clinicalInterpretation}
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                <span className="px-2 py-0.5 bg-rose-900/60 border border-rose-700 text-white rounded">
                  Synovial WBC: {fluidInput.wbcCountPerMm3.toLocaleString()} /mm&sup3; ({fluidInput.neutrophilPercent}% PMN)
                </span>
                <span className="px-2 py-0.5 bg-rose-900/60 border border-rose-700 text-white rounded">
                  Glucose Ratio: {arthrocentesisResult.glucoseRatio} (Threshold &lt; 0.5)
                </span>
                <span className="px-2 py-0.5 bg-rose-900/60 border border-rose-700 text-white rounded">
                  Action: Urgent Needle/Arthroscopic Lavage + Empirical IV Vancomycin/Ceftriaxone
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Main 3-Column Workstation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: CPLM Virtual Microscope (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Compensated Polarized Microscope
                </h2>
                <button
                  onClick={() => setCompensatorIn(!compensatorIn)}
                  className={'px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ' + (compensatorIn
                    ? 'bg-fuchsia-600/30 border-fuchsia-500 text-fuchsia-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400')}
                >
                  {compensatorIn ? 'Red Plate (530nm) IN' : 'Crossed Nicols Only'}
                </button>
              </div>

              {/* Simulated Microscope Ocular Viewport */}
              <div className="relative w-full aspect-square rounded-full border-4 border-slate-700 overflow-hidden shadow-2xl flex items-center justify-center transition-colors duration-500"
                style={{
                  backgroundColor: compensatorIn ? '#be185d' : '#030712',
                }}
              >
                {/* Slow Axis Reference Line (Gypsum Plate at 45 deg, SW to NE) */}
                {compensatorIn && (
                  <div
                    className="absolute w-full h-0.5 border-t border-dashed border-white/60 pointer-events-none"
                    style={{ transform: 'rotate(-45deg)' }}
                  >
                    <span className="absolute left-3 -top-4 text-[10px] font-mono text-white/90 bg-black/60 px-1 rounded">
                      Slow Axis (&gamma;) 45&deg;
                    </span>
                  </div>
                )}

                {/* Reticle / Crosshairs */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                  <div className="w-full h-[1px] bg-slate-400" />
                  <div className="h-full w-[1px] bg-slate-400 absolute" />
                </div>

                {/* Dynamic Crystal Rendering */}
                <div
                  className="transition-transform duration-200"
                  style={{ transform: `rotate(${crystalAngle}deg)` }}
                >
                  {selectedCrystal === 'MONOSODIUM_URATE' && (
                    <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-lg">
                      {/* Neutrophil Ghost Boundary */}
                      <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
                      {/* Acicular Needle Crystal */}
                      <polygon
                        points="20,100 100,94 180,100 100,106"
                        fill={opticalResult.observedColorAtAngle}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        filter="drop-shadow(0 0 8px rgba(255,255,255,0.4))"
                      />
                      {/* Additional parallel needle fragments */}
                      <polygon
                        points="50,85 110,81 160,85 110,89"
                        fill={opticalResult.observedColorAtAngle}
                        opacity="0.85"
                      />
                    </svg>
                  )}

                  {selectedCrystal === 'CALCIUM_PYROPHOSPHATE' && (
                    <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-lg">
                      {/* Rhomboid / Rectangular crystal with geometric blunt ends */}
                      <polygon
                        points="50,75 150,75 130,125 30,125"
                        fill={opticalResult.observedColorAtAngle}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        filter="drop-shadow(0 0 6px rgba(255,255,255,0.3))"
                      />
                      {/* Small rod companion */}
                      <rect
                        x="70"
                        y="135"
                        width="60"
                        height="18"
                        rx="2"
                        fill={opticalResult.observedColorAtAngle}
                        opacity="0.75"
                      />
                    </svg>
                  )}

                  {selectedCrystal === 'CHOLESTEROL' && (
                    <svg width="200" height="200" viewBox="0 0 200 200">
                      {/* Rectangular plate with notched corner */}
                      <polygon
                        points="40,50 160,50 160,130 140,150 40,150"
                        fill={opticalResult.observedColorAtAngle}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        opacity="0.7"
                      />
                    </svg>
                  )}

                  {selectedCrystal === 'BASIC_CALCIUM_PHOSPHATE' && (
                    <svg width="200" height="200" viewBox="0 0 200 200">
                      <circle cx="90" cy="95" r="14" fill="#f43f5e" opacity="0.6" />
                      <circle cx="110" cy="105" r="18" fill="#f43f5e" opacity="0.7" />
                      <circle cx="95" cy="115" r="10" fill="#f43f5e" opacity="0.5" />
                    </svg>
                  )}

                  {selectedCrystal === 'NONE' && (
                    <div className="text-center text-xs text-white/50 italic">
                      No crystalline array in field
                    </div>
                  )}
                </div>

                {/* Angular indicator overlay */}
                <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white font-mono">
                  Crystal Angle: {crystalAngle}&deg;
                </div>
              </div>

              {/* Rotation Angle Slider & Presets */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5 text-rose-400" /> Rotate Crystal Axis:
                  </span>
                  <span className="font-mono text-rose-300 font-bold">{crystalAngle}&deg;</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="180"
                  step="5"
                  value={crystalAngle}
                  onChange={(e) => setCrystalAngle(Number(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setCrystalAngle(45)}
                    className={'flex-1 py-1 px-2 text-[11px] rounded border font-semibold ' + (crystalAngle === 45
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white')}
                  >
                    Parallel (45&deg;)
                  </button>
                  <button
                    onClick={() => setCrystalAngle(135)}
                    className={'flex-1 py-1 px-2 text-[11px] rounded border font-semibold ' + (crystalAngle === 135
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white')}
                  >
                    Perpendicular (135&deg;)
                  </button>
                </div>
              </div>

              {/* Crystal Selector Buttons */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 font-medium uppercase">
                  Specimen Crystal Type:
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {[
                    { id: 'MONOSODIUM_URATE', label: 'MSU (Gout)' },
                    { id: 'CALCIUM_PYROPHOSPHATE', label: 'CPPD (Pseudogout)' },
                    { id: 'BASIC_CALCIUM_PHOSPHATE', label: 'BCP (Apatite)' },
                    { id: 'CHOLESTEROL', label: 'Cholesterol' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCrystal(c.id as CrystalType);
                        setFluidInput((prev) => ({ ...prev, crystalIdentified: c.id as CrystalType }));
                      }}
                      className={'py-1.5 px-2 rounded-lg border text-left font-semibold transition-all ' + (selectedCrystal === c.id
                        ? 'bg-rose-900/40 border-rose-500 text-rose-200'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white')}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optical Physics Explainer Box */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{opticalResult.crystalName}</span>
                  <span className={'px-2 py-0.5 rounded text-[10px] font-bold ' + (opticalResult.birefringenceType === 'STRONGLY_NEGATIVE'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : opticalResult.birefringenceType === 'WEAKLY_POSITIVE'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'bg-slate-800 text-slate-400')}>
                    {opticalResult.birefringenceType}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  <strong className="text-rose-300">Morphology:</strong> {opticalResult.morphology}
                </p>
                <div className="text-[11px] space-y-1 pt-1 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Parallel to Red Plate (&gamma;):</span>
                    <span className="font-bold text-amber-300">{opticalResult.colorParallelToSlowAxis}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Perpendicular to Red Plate:</span>
                    <span className="font-bold text-blue-400">{opticalResult.colorPerpendicularToSlowAxis}</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800 leading-snug">
                  {opticalResult.opticalMechanismExplanation}
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Arthrocentesis Laboratory Analytics (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
              <h2 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <FlaskConical className="w-4 h-4" /> Arthrocentesis Fluid Lab
              </h2>

              {/* Gross Appearance & Clarity */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">Gross Clarity / Appearance:</label>
                <select
                  value={fluidInput.clarity}
                  onChange={(e) =>
                    setFluidInput((prev) => ({
                      ...prev,
                      clarity: e.target.value as SynovialFluidClarity,
                    }))
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="CLEAR_TRANSPARENT">Clear &amp; Transparent (Normal)</option>
                  <option value="TRANSLUCENT_CLOUDY">Translucent / Cloudy (Inflammatory / Crystal)</option>
                  <option value="OPAQUE_PURULENT">Opaque Purulent Green-Yellow (Septic)</option>
                  <option value="BLOODY_HEMARTHROTIC">Bloody / Hemarthrotic (Trauma / Coagulopathy)</option>
                </select>
              </div>

              {/* WBC Count & PMN Sliders */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Synovial WBC Count:</span>
                    <span className="font-mono text-rose-400 font-bold">
                      {fluidInput.wbcCountPerMm3.toLocaleString()} /mm&sup3;
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="120000"
                    step="500"
                    value={fluidInput.wbcCountPerMm3}
                    onChange={(e) =>
                      setFluidInput((prev) => ({
                        ...prev,
                        wbcCountPerMm3: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>&lt;200 Normal</span>
                    <span>2k-50k Inflammatory</span>
                    <span>&gt;50k Septic</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Neutrophils (% PMN):</span>
                    <span className="font-mono text-rose-400 font-bold">{fluidInput.neutrophilPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="99"
                    step="1"
                    value={fluidInput.neutrophilPercent}
                    onChange={(e) =>
                      setFluidInput((prev) => ({
                        ...prev,
                        neutrophilPercent: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>&lt;25% Normal</span>
                    <span>&gt;50% Inflammatory</span>
                    <span>&gt;85% Sepsis Risk</span>
                  </div>
                </div>
              </div>

              {/* Glucose Metabolic Consumption */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Synovial Glucose (mg/dL):</label>
                  <input
                    type="number"
                    value={fluidInput.glucoseMgDl}
                    onChange={(e) =>
                      setFluidInput((prev) => ({
                        ...prev,
                        glucoseMgDl: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Serum Glucose (mg/dL):</label>
                  <input
                    type="number"
                    value={fluidInput.serumGlucoseMgDl}
                    onChange={(e) =>
                      setFluidInput((prev) => ({
                        ...prev,
                        serumGlucoseMgDl: Math.max(1, Number(e.target.value)),
                      }))
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              {/* Microbiology Toggles */}
              <div className="space-y-2 pt-1 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Gram Stain Result:</span>
                  <button
                    onClick={() =>
                      setFluidInput((prev) => ({
                        ...prev,
                        gramStainPositive: !prev.gramStainPositive,
                      }))
                    }
                    className={'px-3 py-1 rounded font-bold border ' + (fluidInput.gramStainPositive
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400')}
                  >
                    {fluidInput.gramStainPositive ? 'GRAM POSITIVE (+)' : 'Negative (No Org)'}
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Synovial Fluid Viscosity:</span>
                  <span className="font-mono text-slate-300">{fluidInput.viscosityStringCm} cm (String Test)</span>
                </div>
              </div>

              {/* Categorization Card */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Diagnostic Group:</span>
                  <span
                    className={'px-2.5 py-0.5 rounded text-xs font-bold ' + (arthrocentesisResult.category === 'SEPTIC_OR_EXTREME_INFLAMMATORY'
                      ? 'bg-rose-600/30 text-rose-300 border border-rose-500'
                      : arthrocentesisResult.category === 'INFLAMMATORY'
                      ? 'bg-amber-600/30 text-amber-300 border border-amber-500'
                      : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500')}
                  >
                    {arthrocentesisResult.category.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 flex justify-between">
                  <span>Glucose Ratio (Synovial/Serum):</span>
                  <span className={'font-bold font-mono ' + (arthrocentesisResult.glucoseRatio < 0.5 ? 'text-rose-400' : 'text-slate-200')}>
                    {arthrocentesisResult.glucoseRatio}
                  </span>
                </div>
                <div className="text-[11px] pt-1 border-t border-slate-800">
                  <span className="text-slate-400 block mb-1 font-semibold">Differential Diagnoses:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                    {arthrocentesisResult.differentialDiagnoses.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: 2015 ACR/EULAR Gout Classification Criteria (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4" /> 2015 ACR/EULAR Gout Score
                </h2>
                <span className={'px-2.5 py-0.5 rounded text-xs font-bold font-mono ' + (goutScoreResult.thresholdMet
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400')}>
                  {goutScoreResult.isSufficientCriterionMet
                    ? 'SUFFICIENT CRITERION'
                    : `Score: ${goutScoreResult.totalScore}/23`}
                </span>
              </div>

              {/* Sufficient Criterion Banner */}
              {criteria.msuCrystalInSynovialFluid === true && (
                <div className="bg-emerald-950/40 border border-emerald-500/60 rounded-lg p-2.5 text-xs text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    <strong>SUFFICIENT CRITERION MET:</strong> Demonstration of MSU crystals in symptomatic joint classifies as Gout regardless of points.
                  </span>
                </div>
              )}

              {/* Criteria Controls */}
              <div className="space-y-3 text-xs">
                {/* Joint Pattern */}
                <div>
                  <label className="text-slate-400 block mb-1">Involved Joint Pattern:</label>
                  <select
                    value={criteria.symptomPattern}
                    onChange={(e) =>
                      setCriteria((prev) => ({
                        ...prev,
                        symptomPattern: e.target.value as AcrEularGoutCriteriaInput['symptomPattern'],
                      }))
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-white"
                  >
                    <option value="FIRST_MTP_PODAGRA">1st MTP Podagra (3 points)</option>
                    <option value="ANKLE_OR_MIDFOOT">Ankle or Midfoot (2 points)</option>
                    <option value="OTHER_JOINT">Other Joint, e.g. Knee/Wrist (1 point)</option>
                  </select>
                </div>

                {/* Characteristics of Episode */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Episode Characteristics (Erythema, Tenderness, Walking Limit):</span>
                    <span className="font-bold text-rose-400">{criteria.characteristicEpisodesCount} features</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {[0, 1, 2, 3].map((num) => (
                      <button
                        key={num}
                        onClick={() => setCriteria((prev) => ({ ...prev, characteristicEpisodesCount: num }))}
                        className={'py-1 rounded border font-semibold ' + (criteria.characteristicEpisodesCount === num
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400')}
                      >
                        {num} ({num} pts)
                      </button>
                    ))}
                  </div>
                </div>

                {/* Serum Urate Slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Serum Urate Level:</span>
                    <span className="font-mono text-rose-400 font-bold">{criteria.serumUrateMgDl} mg/dL</span>
                  </div>
                  <input
                    type="range"
                    min="3.0"
                    max="14.0"
                    step="0.2"
                    value={criteria.serumUrateMgDl}
                    onChange={(e) =>
                      setCriteria((prev) => ({
                        ...prev,
                        serumUrateMgDl: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>&lt;4.0 (-4 pts)</span>
                    <span>6.0-7.9 (+2 pts)</span>
                    <span>&gt;10.0 (+4 pts)</span>
                  </div>
                </div>

                {/* Checkbox Options */}
                <div className="space-y-1.5 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={criteria.timeCourseTypical}
                      onChange={(e) => setCriteria((prev) => ({ ...prev, timeCourseTypical: e.target.checked }))}
                      className="accent-rose-500"
                    />
                    <span className="text-slate-300">Typical Time-Course (Peak &lt;24h, resolution &lt;14d) (+2 pts)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={criteria.clinicalTophusPresent}
                      onChange={(e) => setCriteria((prev) => ({ ...prev, clinicalTophusPresent: e.target.checked }))}
                      className="accent-rose-500"
                    />
                    <span className="text-slate-300">Clinical Tophus Present (Chalky nodule) (+4 pts)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={criteria.imagingUrateDeposition}
                      onChange={(e) => setCriteria((prev) => ({ ...prev, imagingUrateDeposition: e.target.checked }))}
                      className="accent-rose-500"
                    />
                    <span className="text-slate-300">Ultrasound Double Contour or DECT positive (+4 pts)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={criteria.imagingErosion}
                      onChange={(e) => setCriteria((prev) => ({ ...prev, imagingErosion: e.target.checked }))}
                      className="accent-rose-500"
                    />
                    <span className="text-slate-300">Radiographic Gout Erosion (Overhanging edges) (+4 pts)</span>
                  </label>
                </div>
              </div>

              {/* Score Interpretation */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Probability of Gout:</span>
                  <span className={'font-bold ' + (goutScoreResult.thresholdMet ? 'text-emerald-400' : 'text-slate-400')}>
                    {goutScoreResult.probabilityOfGout.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {goutScoreResult.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pharmacotherapy & Precision Management Section */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-rose-500" />
                Precision Gout Pharmacotherapy &amp; Prophylaxis Engine
              </h2>
              <p className="text-xs text-slate-400">
                Renal dose adaptation, HLA-B*5801 pharmacogenomics, acute flare management, and treat-to-target urate lowering therapy (ULT).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold rounded-lg">
                Target Urate: &lt; {therapyPlan.ultTargetSerumUrateMgDl} mg/dL
              </span>
            </div>
          </div>

          {/* Comorbidities Tuning Panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Patient eGFR:</span>
                <span className="font-mono text-rose-400 font-bold">{comorbidities.eGfrMlMin} mL/min</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="2"
                value={comorbidities.eGfrMlMin}
                onChange={(e) =>
                  setComorbidities((prev) => ({
                    ...prev,
                    eGfrMlMin: Number(e.target.value),
                  }))
                }
                className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>&lt;30 Severe CKD</span>
                <span>60 Normal</span>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={comorbidities.hasActivePepticUlcer}
                onChange={(e) => setComorbidities((prev) => ({ ...prev, hasActivePepticUlcer: e.target.checked }))}
                className="accent-rose-500"
              />
              <span className="text-slate-300">Active Peptic Ulcer Disease (PUD)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={comorbidities.isTakingStrongCyp3a4OrPgpInhibitor}
                onChange={(e) =>
                  setComorbidities((prev) => ({ ...prev, isTakingStrongCyp3a4OrPgpInhibitor: e.target.checked }))
                }
                className="accent-rose-500"
              />
              <span className="text-slate-300">Strong CYP3A4 / P-gp Inhibitor (Clarithromycin)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={comorbidities.hlaB5801Positive}
                onChange={(e) => setComorbidities((prev) => ({ ...prev, hlaB5801Positive: e.target.checked }))}
                className="accent-rose-500"
              />
              <span className="text-amber-300 font-bold">HLA-B*5801 Allele Positive</span>
            </label>
          </div>

          {/* Therapy Solution Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Acute Flare Therapy */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-rose-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" /> 1. Acute Flare Treatment
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {therapyPlan.acuteAgent.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-sm font-semibold text-white">{therapyPlan.acuteDosing}</p>
              {therapyPlan.acuteContraindications.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-amber-400">Contraindications Enforced:</span>
                  <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                    {therapyPlan.acuteContraindications.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Urate Lowering Therapy (ULT) */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-emerald-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> 2. Urate Lowering Therapy (ULT)
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {therapyPlan.ultDrug} ({therapyPlan.ultStartingDoseMg} mg/day)
                </span>
              </div>
              <p className="text-xs text-slate-300">
                <strong>Flare Prophylaxis:</strong> {therapyPlan.ultProphylaxisDose}
              </p>
              {therapyPlan.safetyAlerts.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Safety / Pharmacogenomic Alert:
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-rose-300 space-y-0.5">
                    {therapyPlan.safetyAlerts.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
