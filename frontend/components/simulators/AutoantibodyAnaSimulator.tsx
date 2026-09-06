'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  RotateCcw,
  FileText,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Info,
  Microscope,
  Eye,
  Layers,
  Heart,
  Zap,
  Sliders,
  Dna,
  Skull,
  FlaskConical,
} from 'lucide-react';
import {
  computeAutoantibodyState,
  AUTOANTIBODY_PRESETS,
  AutoantibodyInputParams,
  AutoantibodyPresetId,
  AutoantibodyDiagnosticState,
  IcapPatternCode,
  AnaTiter,
} from '@/.gemini/skills/AutoantibodyAnaEngine';

const PRESET_KEYS: AutoantibodyPresetId[] = [
  'SYSTEMIC_LUPUS_ERYTHEMATOSUS_LUPUS_NEPHRITIS',
  'DIFFUSE_SYSTEMIC_SCLEROSIS_SCL70',
  'CREST_LIMITED_SCLERODERMA_CENTROMERE',
  'PRIMARY_SJOGREN_SYNDROME_RO_LA',
  'MIXED_CONNECTIVE_TISSUE_DISEASE_RNP',
  'DRUG_INDUCED_LUPUS_HYDRALAZINE_PROCAINAMIDE',
  'GRANULOMATOSIS_WITH_POLYANGIITIS_CANCA_PR3',
  'HEALTHY_CONTROL_DFS70_ISOLATED',
];

const TITER_LEVELS: AnaTiter[] = [
  'NEGATIVE',
  '1:40',
  '1:80',
  '1:160',
  '1:320',
  '1:640',
  '1:1280',
  '1:2560',
];

export default function AutoantibodyAnaSimulator() {
  const [selectedPreset, setSelectedPreset] = useState<AutoantibodyPresetId>(
    'SYSTEMIC_LUPUS_ERYTHEMATOSUS_LUPUS_NEPHRITIS'
  );
  const [params, setParams] = useState<AutoantibodyInputParams>(
    () => AUTOANTIBODY_PRESETS.SYSTEMIC_LUPUS_ERYTHEMATOSUS_LUPUS_NEPHRITIS.initialState
  );
  const [activeTab, setActiveTab] = useState<
    'ifaMicroscopy' | 'enaMultiplex' | 'criteriaScorer' | 'clinicalAlgorithms'
  >('ifaMicroscopy');
  const [reportExported, setReportExported] = useState(false);

  // Compute live diagnostic state
  const state: AutoantibodyDiagnosticState = useMemo(() => {
    return computeAutoantibodyState(params);
  }, [params]);

  // Load Preset
  const handleSelectPreset = (presetId: AutoantibodyPresetId) => {
    setSelectedPreset(presetId);
    setParams(AUTOANTIBODY_PRESETS[presetId].initialState);
  };

  // Reset
  const handleReset = () => {
    handleSelectPreset('SYSTEMIC_LUPUS_ERYTHEMATOSUS_LUPUS_NEPHRITIS');
    setReportExported(false);
  };

  // Export Serology Report
  const handleExportReport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <Microscope className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                  Autoantibody Profiling, ICAP HEp-2 IFA &amp; ACR/EULAR Workstation
                </h1>
                <p className="text-xs lg:text-sm text-slate-400 mt-1">
                  ICAP Patterns (AC-1 to AC-29) &bull; ENA Multiplex Panel &bull; ANCA c/p-ANCA &bull; ACR/EULAR SLE &amp; SSc Scorers
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/80 font-mono text-center">
              <div className="text-[10px] uppercase font-sans tracking-wider text-slate-400">Autoimmune Probability</div>
              <div className="text-2xl font-bold text-emerald-300">
                {state.postTestAutoimmuneProbabilityPct}%
              </div>
            </div>

            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition shadow-sm"
              title="Export Serological Consultation Report"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>{reportExported ? 'Report Logged!' : 'Export Serology'}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition shadow-sm"
              title="Reset to Active SLE Baseline"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 8 Preset Buttons Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Clinical Immunology &amp; Rheumatology Presets
            </span>
            <span className="text-[11px] text-slate-500">8 Validated Autoantibody Phenotypes</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {PRESET_KEYS.map((key) => {
              const preset = AUTOANTIBODY_PRESETS[key];
              const isSelected = selectedPreset === key;
              return (
                <button
                  key={key}
                  onClick={() => handleSelectPreset(key)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between h-20 ${
                    isSelected
                      ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-medium leading-snug line-clamp-2">{preset.title.split('(')[0]}</div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {key === 'SYSTEMIC_LUPUS_ERYTHEMATOSUS_LUPUS_NEPHRITIS'
                      ? 'Lupus Nephritis'
                      : key === 'DIFFUSE_SYSTEMIC_SCLEROSIS_SCL70'
                      ? 'Diffuse SSc (Scl-70)'
                      : key === 'CREST_LIMITED_SCLERODERMA_CENTROMERE'
                      ? 'CREST Centromere'
                      : key === 'PRIMARY_SJOGREN_SYNDROME_RO_LA'
                      ? 'Sjögren (Ro/La)'
                      : key === 'MIXED_CONNECTIVE_TISSUE_DISEASE_RNP'
                      ? 'MCTD (U1-RNP)'
                      : key === 'DRUG_INDUCED_LUPUS_HYDRALAZINE_PROCAINAMIDE'
                      ? 'Drug-Induced DILE'
                      : key === 'GRANULOMATOSIS_WITH_POLYANGIITIS_CANCA_PR3'
                      ? 'GPA (c-ANCA)'
                      : 'Benign DFS70'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Diagnosis & Alarms Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-400" />
                Primary Serological Diagnosis
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                ANA: {params.anaTiter} &bull; {params.primaryIcapPattern.replace(/_/g, ' ')}
              </span>
            </div>
            <div className={`text-lg font-bold ${state.diseasePhenotypeColor}`}>
              {state.primarySuspectedDiagnosis}
            </div>
            <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-800">
              {state.clinicalRecommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400">&bull;</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                High-Risk Clinical Alerts
              </span>
              <span className="text-[11px] font-mono text-slate-500">{state.activeAlarms.length} Active</span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {state.activeAlarms.map((alarm, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-2 ${
                    alarm.includes('RISK') || alarm.includes('CRITICAL') || alarm.includes('VASCULITIS')
                      ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                      : alarm.includes('ALERT') || alarm.includes('SURVEILLANCE')
                      ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                      : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{alarm.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-800 flex gap-2">
          <button
            onClick={() => setActiveTab('ifaMicroscopy')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'ifaMicroscopy'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            HEp-2 IFA Microscopy Simulator
          </button>
          <button
            onClick={() => setActiveTab('enaMultiplex')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'enaMultiplex'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            ENA &amp; Serological Biomarker Deck
          </button>
          <button
            onClick={() => setActiveTab('criteriaScorer')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'criteriaScorer'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            ACR/EULAR Criteria Scorers
          </button>
          <button
            onClick={() => setActiveTab('clinicalAlgorithms')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'clinicalAlgorithms'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dna className="w-4 h-4" />
            Diagnostic Guidelines &amp; Biopsy
          </button>
        </div>

        {/* TAB 1: HEp-2 IFA Microscopy Simulator */}
        {activeTab === 'ifaMicroscopy' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls */}
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  HEp-2 IFA Controls &amp; Dilution
                </span>
                <span className="text-xs font-mono text-emerald-400">ICAP AC-1 to AC-29</span>
              </div>

              {/* Titer Selector */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">End-Point ANA Dilution Titer</span>
                  <span className="font-mono text-emerald-400 font-bold">{params.anaTiter}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {TITER_LEVELS.map((titer) => (
                    <button
                      key={titer}
                      onClick={() => setParams((prev) => ({ ...prev, anaTiter: titer }))}
                      className={`py-1.5 px-2 rounded-lg text-xs font-mono text-center transition border ${
                        params.anaTiter === titer
                          ? 'bg-emerald-600 border-emerald-400 text-white font-bold'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {titer}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-slate-400">
                  ACR/EULAR entry threshold: &ge; 1:80 dilution on HEp-2 substrate.
                </div>
              </div>

              {/* ICAP Pattern Selector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">ICAP IFA Nuclear / ANCA Pattern</label>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  {(
                    [
                      { id: 'AC-1_HOMOGENEOUS', label: 'AC-1 Homogeneous (dsDNA, Histone, Nucleosome)' },
                      { id: 'AC-4_FINE_SPECKLED', label: 'AC-4 Fine Speckled (Ro/SSA, La/SSB)' },
                      { id: 'AC-5_COARSE_SPECKLED', label: 'AC-5 Coarse Speckled (Sm, U1-RNP)' },
                      { id: 'AC-3_CENTROMERE', label: 'AC-3 Centromere (CENP-B, CREST SSc)' },
                      { id: 'AC-8_NUCLEOLAR_HOMOGENEOUS', label: 'AC-8 Nucleolar (Scl-70, Fibrillarin)' },
                      { id: 'AC-2_DENSE_FINE_SPECKLED', label: 'AC-2 Dense Fine Speckled (DFS70 - Benign)' },
                      { id: 'ANCA_CANCA_PR3', label: 'c-ANCA (Cytoplasmic Anti-PR3 - GPA)' },
                      { id: 'ANCA_PANCA_MPO', label: 'p-ANCA (Perinuclear Anti-MPO - MPA)' },
                    ] as { id: IcapPatternCode; label: string }[]
                  ).map((pat) => (
                    <button
                      key={pat.id}
                      onClick={() => setParams((prev) => ({ ...prev, primaryIcapPattern: pat.id }))}
                      className={`p-2 rounded-lg text-left text-xs transition border flex items-center justify-between ${
                        params.primaryIcapPattern === pat.id
                          ? 'bg-emerald-950/70 border-emerald-500 text-white font-medium'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{pat.label}</span>
                      {params.primaryIcapPattern === pat.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fluorescence Intensity Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Fluorescence Brightness (1+ to 4+)</span>
                  <span className="font-mono text-emerald-400 font-bold">{params.fluorescenceIntensity}+</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={params.fluorescenceIntensity}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      fluorescenceIntensity: parseInt(e.target.value),
                    }))
                  }
                  className="w-full accent-emerald-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Right HEp-2 Fluorescence Microscopic Field Viewport */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">
                    HEp-2 Substrate Indirect Immunofluorescence (IFA 400&times;)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Interphase resting nuclei and condensed metaphase mitotic chromosomal plates
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-[11px] font-mono text-emerald-300">
                  FITC Green 520nm
                </div>
              </div>

              {/* Simulated Fluorescence Microscope Circle */}
              <div className="relative w-full h-80 bg-black rounded-2xl border-4 border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
                {/* Microscopic circular field */}
                <svg viewBox="0 0 500 320" className="w-full h-full">
                  <defs>
                    <radialGradient id="microscopeGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#042f2e" stopOpacity="0.4" />
                      <stop offset="85%" stopColor="#020617" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="1" />
                    </radialGradient>

                    <filter id="fluoGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Dark ocular background */}
                  <rect width="500" height="320" fill="url(#microscopeGlow)" />

                  {/* Cells in Interphase & Mitosis */}
                  {/* CELL 1: Main Interphase Cell (Center Left) */}
                  <g transform="translate(140, 150)">
                    {/* Cell membrane outline */}
                    <ellipse cx="0" cy="0" rx="75" ry="65" fill="#064e3b" fillOpacity="0.15" stroke="#047857" strokeWidth="0.8" strokeDasharray="3 3" />
                    {/* Nucleus */}
                    <ellipse cx="0" cy="0" rx="48" ry="42" fill="#022c22" stroke="#059669" strokeWidth="1" />

                    {/* Fluorescence pattern rendering based on selected pattern */}
                    {params.primaryIcapPattern === 'AC-1_HOMOGENEOUS' && (
                      <ellipse cx="0" cy="0" rx="46" ry="40" fill="#22c55e" fillOpacity={params.fluorescenceIntensity * 0.22} filter="url(#fluoGlow)" />
                    )}

                    {params.primaryIcapPattern === 'AC-4_FINE_SPECKLED' && (
                      <g>
                        {Array.from({ length: 45 }).map((_, i) => {
                          const angle = (i * 137.5 * Math.PI) / 180;
                          const r = Math.sqrt(i) * 6;
                          return (
                            <circle
                              key={i}
                              cx={Math.cos(angle) * r}
                              cy={Math.sin(angle) * r * 0.85}
                              r={1.4}
                              fill="#4ade80"
                              opacity={params.fluorescenceIntensity * 0.25}
                              filter="url(#fluoGlow)"
                            />
                          );
                        })}
                      </g>
                    )}

                    {params.primaryIcapPattern === 'AC-5_COARSE_SPECKLED' && (
                      <g>
                        {Array.from({ length: 22 }).map((_, i) => {
                          const angle = (i * 140 * Math.PI) / 180;
                          const r = Math.sqrt(i) * 8.5;
                          return (
                            <circle
                              key={i}
                              cx={Math.cos(angle) * r}
                              cy={Math.sin(angle) * r * 0.8}
                              r={3.2}
                              fill="#22c55e"
                              opacity={params.fluorescenceIntensity * 0.24}
                              filter="url(#fluoGlow)"
                            />
                          );
                        })}
                      </g>
                    )}

                    {params.primaryIcapPattern === 'AC-3_CENTROMERE' && (
                      <g>
                        {Array.from({ length: 35 }).map((_, i) => {
                          const angle = (i * 125 * Math.PI) / 180;
                          const r = 5 + (i % 6) * 6.5;
                          return (
                            <circle
                              key={i}
                              cx={Math.cos(angle) * r}
                              cy={Math.sin(angle) * r * 0.8}
                              r={2.2}
                              fill="#86efac"
                              stroke="#ffffff"
                              strokeWidth="0.5"
                              filter="url(#fluoGlow)"
                            />
                          );
                        })}
                      </g>
                    )}

                    {params.primaryIcapPattern === 'AC-8_NUCLEOLAR_HOMOGENEOUS' && (
                      <g>
                        {/* 3 Nucleoli ovals inside nucleus */}
                        <ellipse cx="-16" cy="-10" rx="11" ry="8" fill="#4ade80" filter="url(#fluoGlow)" />
                        <ellipse cx="14" cy="-12" rx="9" ry="7" fill="#4ade80" filter="url(#fluoGlow)" />
                        <ellipse cx="2" cy="15" rx="12" ry="9" fill="#4ade80" filter="url(#fluoGlow)" />
                      </g>
                    )}

                    {params.primaryIcapPattern === 'AC-2_DENSE_FINE_SPECKLED' && (
                      <g>
                        {Array.from({ length: 70 }).map((_, i) => {
                          const angle = (i * 133 * Math.PI) / 180;
                          const r = Math.sqrt(i) * 4.8;
                          return (
                            <circle
                              key={i}
                              cx={Math.cos(angle) * r}
                              cy={Math.sin(angle) * r * 0.85}
                              r={i % 3 === 0 ? 1.8 : 1.1}
                              fill="#22c55e"
                              opacity={params.fluorescenceIntensity * 0.23}
                            />
                          );
                        })}
                      </g>
                    )}

                    {params.primaryIcapPattern === 'ANCA_CANCA_PR3' && (
                      <g>
                        {/* Granular cytoplasm with lobulated negative nucleus */}
                        <ellipse cx="0" cy="0" rx="72" ry="62" fill="#22c55e" fillOpacity="0.4" filter="url(#fluoGlow)" />
                        {/* 3 nuclear lobes spared (dark) */}
                        <ellipse cx="-20" cy="-5" rx="16" ry="14" fill="#020617" />
                        <ellipse cx="18" cy="-10" rx="15" ry="12" fill="#020617" />
                        <ellipse cx="2" cy="18" rx="16" ry="14" fill="#020617" />
                      </g>
                    )}

                    {params.primaryIcapPattern === 'ANCA_PANCA_MPO' && (
                      <g>
                        {/* Perinuclear rim around dark multi-lobed nucleus */}
                        <ellipse cx="-20" cy="-5" rx="18" ry="16" fill="none" stroke="#22c55e" strokeWidth="4" filter="url(#fluoGlow)" />
                        <ellipse cx="18" cy="-10" rx="17" ry="14" fill="none" stroke="#22c55e" strokeWidth="4" filter="url(#fluoGlow)" />
                        <ellipse cx="2" cy="18" rx="18" ry="16" fill="none" stroke="#22c55e" strokeWidth="4" filter="url(#fluoGlow)" />
                      </g>
                    )}
                  </g>

                  {/* CELL 2: Metaphase Mitotic Cell (Center Right) - CRITICAL FOR ICAP RULES */}
                  <g transform="translate(360, 150)">
                    <ellipse cx="0" cy="0" rx="65" ry="60" fill="#064e3b" fillOpacity="0.1" stroke="#047857" strokeWidth="0.8" strokeDasharray="3 3" />
                    <text x="0" y="-45" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">
                      Mitotic Cell (Metaphase)
                    </text>

                    {/* Condensed Metaphase Chromosome Plate */}
                    {params.primaryIcapPattern === 'AC-1_HOMOGENEOUS' && (
                      <g>
                        {/* Chromosome plate glows bright green in AC-1! */}
                        <ellipse cx="0" cy="0" rx="36" ry="12" fill="#22c55e" filter="url(#fluoGlow)" />
                        <text x="0" y="26" fill="#86efac" fontSize="9" textAnchor="middle" fontFamily="sans-serif">
                          Chromosome Plate: Positive (+)
                        </text>
                      </g>
                    )}

                    {params.primaryIcapPattern === 'AC-4_FINE_SPECKLED' && (
                      <g>
                        {/* Chromosome plate is NEGATIVE (dark) in AC-4! */}
                        <ellipse cx="0" cy="0" rx="36" ry="12" fill="#020617" stroke="#059669" strokeWidth="1" />
                        <text x="0" y="26" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="sans-serif">
                          Chromosome Plate: Negative (-)
                        </text>
                      </g>
                    )}

                    {params.primaryIcapPattern === 'AC-3_CENTROMERE' && (
                      <g>
                        {/* Centromeres align on the equator like beads on a string */}
                        {[-30, -22, -14, -6, 2, 10, 18, 26, 34].map((x, i) => (
                          <circle key={i} cx={x} cy={i % 2 === 0 ? -2 : 2} r="2.2" fill="#86efac" stroke="#ffffff" strokeWidth="0.5" filter="url(#fluoGlow)" />
                        ))}
                        <text x="0" y="26" fill="#86efac" fontSize="9" textAnchor="middle" fontFamily="sans-serif">
                          Split Equator Alignment
                        </text>
                      </g>
                    )}

                    {params.primaryIcapPattern !== 'AC-1_HOMOGENEOUS' &&
                      params.primaryIcapPattern !== 'AC-4_FINE_SPECKLED' &&
                      params.primaryIcapPattern !== 'AC-3_CENTROMERE' && (
                        <g>
                          <ellipse cx="0" cy="0" rx="34" ry="10" fill="#042f2e" stroke="#059669" strokeWidth="0.8" />
                          <text x="0" y="26" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="sans-serif">
                            Mitotic Plate Analysis
                          </text>
                        </g>
                      )}
                  </g>
                </svg>
              </div>

              {/* Morphology Details Card */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  ICAP Standardized Morphology &bull; {params.primaryIcapPattern}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {state.ifaMorphologyDescription}
                </p>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <strong>Mitotic Plate Rule:</strong> In true AC-1 Homogeneous ANA (anti-dsDNA/histone), condensed chromosomal plates in dividing cells are intensely stained. In AC-4 Fine Speckled (anti-SSA/SSB), chromosomal plates are non-reactive (dark).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Specific ENA & Serology Multiplex Deck */}
        {activeTab === 'enaMultiplex' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ENA Multiplex Panel */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Dna className="w-4 h-4 text-emerald-400" />
                  Extractable Nuclear Antigens (ENA) Panel
                </span>
                <span className="text-xs font-mono text-slate-400">Multiplex Bead Immunoassay</span>
              </div>

              {/* Anti-dsDNA Slider */}
              <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Anti-dsDNA (Farr / ELISA)</span>
                  <span className={`font-mono font-bold ${params.ena.antiDsDnaIuMl >= 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {params.ena.antiDsDnaIuMl} IU/mL ({params.ena.antiDsDnaIuMl >= 20 ? 'Positive' : 'Normal'})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="5"
                  value={params.ena.antiDsDnaIuMl}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      ena: { ...prev.ena, antiDsDnaIuMl: parseInt(e.target.value) },
                    }))
                  }
                  className="w-full accent-rose-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="text-[10px] text-slate-500">Normal: &lt; 10 IU/mL. Titers correlate directly with active lupus nephritis flares.</div>
              </div>

              {/* Anti-U1-RNP Slider */}
              <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Anti-U1-RNP Antibody</span>
                  <span className={`font-mono font-bold ${params.ena.antiU1RnpUml >= 20 ? 'text-indigo-400' : 'text-emerald-400'}`}>
                    {params.ena.antiU1RnpUml} U/mL ({params.ena.antiU1RnpUml >= 20 ? 'Positive' : 'Normal'})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  value={params.ena.antiU1RnpUml}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      ena: { ...prev.ena, antiU1RnpUml: parseInt(e.target.value) },
                    }))
                  }
                  className="w-full accent-indigo-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="text-[10px] text-slate-500">High titer (&gt; 40 U/mL) is an obligatory hallmark for Mixed Connective Tissue Disease (MCTD).</div>
              </div>

              {/* Specific ENA Toggle Buttons Grid */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Specific Antibody Toggles</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'antiSmPositive', label: 'Anti-Sm (Smith)', disease: 'SLE Pathognomonic' },
                    { key: 'antiRo60Positive', label: 'Anti-Ro60 / SSA', disease: 'Sjögren / SLE / Heart Block' },
                    { key: 'antiLaSsbPositive', label: 'Anti-La / SSB', disease: 'Sjögren Syndrome' },
                    { key: 'antiScl70Positive', label: 'Anti-Scl-70 (Topo I)', disease: 'Diffuse SSc / ILD' },
                    { key: 'antiRnaPolymeraseIiiPositive', label: 'Anti-RNA Pol III', disease: 'Scleroderma Renal Crisis' },
                    { key: 'antiCentromereBPositive', label: 'Anti-Centromere B', disease: 'CREST Limited SSc' },
                    { key: 'antiHistonePositive', label: 'Anti-Histone', disease: 'Drug-Induced Lupus' },
                    { key: 'antiDfs70Positive', label: 'Anti-DFS70', disease: 'Excludes SARD if isolated' },
                  ].map((item) => {
                    const isChecked = (params.ena as any)[item.key];
                    return (
                      <button
                        key={item.key}
                        onClick={() =>
                          setParams((prev) => ({
                            ...prev,
                            ena: { ...prev.ena, [item.key]: !isChecked },
                          }))
                        }
                        className={`p-2.5 rounded-lg border text-left transition ${
                          isChecked
                            ? 'bg-emerald-950/70 border-emerald-500 text-white font-medium'
                            : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{item.label}</span>
                          <span className="text-[10px] uppercase font-mono">
                            {isChecked ? 'POS' : 'NEG'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">{item.disease}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ANCA & Complement Panel */}
            <div className="lg:col-span-6 space-y-4">
              {/* ANCA Section */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                    <Skull className="w-4 h-4 text-rose-400" />
                    ANCA Vasculitis Serology (PR3 vs MPO)
                  </span>
                  <span className="text-xs font-mono text-slate-400">Normal &lt; 5 U/mL</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">c-ANCA / Anti-Proteinase-3 (Anti-PR3)</span>
                    <span className={`font-mono font-bold ${params.ena.antiPr3AncaUml >= 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {params.ena.antiPr3AncaUml} U/mL
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={params.ena.antiPr3AncaUml}
                    onChange={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        ena: { ...prev.ena, antiPr3AncaUml: parseInt(e.target.value) },
                      }))
                    }
                    className="w-full accent-rose-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <div className="text-[10px] text-slate-400">
                    Strongly associates with Granulomatosis with Polyangiitis (GPA / Wegener&apos;s) with cavitary pulmonary nodules.
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">p-ANCA / Anti-Myeloperoxidase (Anti-MPO)</span>
                    <span className={`font-mono font-bold ${params.ena.antiMpoAncaUml >= 5 ? 'text-purple-400' : 'text-emerald-400'}`}>
                      {params.ena.antiMpoAncaUml} U/mL
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={params.ena.antiMpoAncaUml}
                    onChange={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        ena: { ...prev.ena, antiMpoAncaUml: parseInt(e.target.value) },
                      }))
                    }
                    className="w-full accent-purple-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <div className="text-[10px] text-slate-400">
                    Associates with Microscopic Polyangiitis (MPA) and Eosinophilic GPA (Churg-Strauss).
                  </div>
                </div>
              </div>

              {/* Complement C3 / C4 Hypocomplementemia */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                    <FlaskConical className="w-4 h-4 text-cyan-400" />
                    Serum Complement System Consumption
                  </span>
                  <span className="text-xs font-mono text-cyan-400">Classical Pathway</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Complement C3</span>
                      <span className={`font-mono font-bold ${params.ena.complementC3MgDl < 90 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {params.ena.complementC3MgDl} mg/dL
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="200"
                      value={params.ena.complementC3MgDl}
                      onChange={(e) =>
                        setParams((prev) => ({
                          ...prev,
                          ena: { ...prev.ena, complementC3MgDl: parseInt(e.target.value) },
                        }))
                      }
                      className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                    />
                    <div className="text-[10px] text-slate-500">Normal: 90 - 180 mg/dL</div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Complement C4</span>
                      <span className={`font-mono font-bold ${params.ena.complementC4MgDl < 10 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {params.ena.complementC4MgDl} mg/dL
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="60"
                      value={params.ena.complementC4MgDl}
                      onChange={(e) =>
                        setParams((prev) => ({
                          ...prev,
                          ena: { ...prev.ena, complementC4MgDl: parseInt(e.target.value) },
                        }))
                      }
                      className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                    />
                    <div className="text-[10px] text-slate-500">Normal: 10 - 40 mg/dL</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                  {params.ena.complementC3MgDl < 90 && params.ena.complementC4MgDl < 10 ? (
                    <span className="text-rose-400 font-medium">
                      Severe hypocomplementemia: Active classical pathway immune complex consumption (Lupus Nephritis Class III/IV or Cryoglobulinemia).
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      Normal complement levels: Classical pathway not actively consumed. Supports non-renal SLE flare or Drug-Induced Lupus.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ACR/EULAR Criteria Scorers */}
        {activeTab === 'criteriaScorer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 2019 EULAR/ACR SLE Scorer */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">
                    2019 EULAR/ACR Criteria for SLE
                  </h3>
                  <p className="text-xs text-slate-400">Required Entry: ANA &ge; 1:80 &bull; Classification: &ge; 10 points</p>
                </div>
                <div className={`px-3 py-1.5 rounded-xl border font-mono font-bold text-sm ${
                  state.eularSleClassified
                    ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  {state.eularAcrSle2019Score} Pts ({state.eularSleClassified ? 'Classified' : 'Not Met'})
                </div>
              </div>

              {/* Checklist for SLE criteria */}
              <div className="space-y-2 text-xs">
                <div className="text-slate-400 font-semibold uppercase text-[10px]">Clinical &amp; Laboratory Domains</div>
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-300">Malar Butterfly Rash (6 pts)</span>
                    <input
                      type="checkbox"
                      checked={params.clinicalFindings.malarRash}
                      onChange={(e) =>
                        setParams((prev) => ({
                          ...prev,
                          clinicalFindings: { ...prev.clinicalFindings, malarRash: e.target.checked },
                        }))
                      }
                      className="accent-emerald-500 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-300">Inflammatory Synovitis &ge; 2 Joints (6 pts)</span>
                    <input
                      type="checkbox"
                      checked={params.clinicalFindings.synovitisJointCount >= 2}
                      onChange={(e) =>
                        setParams((prev) => ({
                          ...prev,
                          clinicalFindings: { ...prev.clinicalFindings, synovitisJointCount: e.target.checked ? 6 : 0 },
                        }))
                      }
                      className="accent-emerald-500 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-300">Pleural / Pericardial Effusion (5 pts)</span>
                    <input
                      type="checkbox"
                      checked={params.clinicalFindings.serositisPleuropericarditis}
                      onChange={(e) =>
                        setParams((prev) => ({
                          ...prev,
                          clinicalFindings: { ...prev.clinicalFindings, serositisPleuropericarditis: e.target.checked },
                        }))
                      }
                      className="accent-emerald-500 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-300">Proteinuria &ge; 0.5 g/24h (4 pts)</span>
                    <input
                      type="checkbox"
                      checked={params.clinicalFindings.proteinuriaGrams24h >= 0.5}
                      onChange={(e) =>
                        setParams((prev) => ({
                          ...prev,
                          clinicalFindings: { ...prev.clinicalFindings, proteinuriaGrams24h: e.target.checked ? 2.5 : 0.1 },
                        }))
                      }
                      className="accent-emerald-500 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex justify-between">
                    <span>Immunologic: Anti-dsDNA ({params.ena.antiDsDnaIuMl >= 20 ? '+6 pts' : '0'}) &bull; Anti-Sm ({params.ena.antiSmPositive ? '+6 pts' : '0'}) &bull; Low C3/C4 ({params.ena.complementC3MgDl < 90 && params.ena.complementC4MgDl < 10 ? '+4 pts' : '0'})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SSc & Sjögren Criteria */}
            <div className="lg:col-span-6 space-y-4">
              {/* 2013 ACR/EULAR Systemic Sclerosis (SSc) */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">2013 ACR/EULAR Systemic Sclerosis</h3>
                    <p className="text-xs text-slate-400">Classification threshold: &ge; 9 points</p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl border font-mono font-bold text-sm ${
                    state.eularSScClassified
                      ? 'bg-orange-950/60 border-orange-500 text-orange-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {state.acrEularSSc2013Score} Pts ({state.eularSScClassified ? 'Classified' : 'Not Met'})
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-300">Sclerodactyly of Fingers (4 pts)</span>
                    <input
                      type="checkbox"
                      checked={params.clinicalFindings.sclerodactyly}
                      onChange={(e) =>
                        setParams((prev) => ({
                          ...prev,
                          clinicalFindings: { ...prev.clinicalFindings, sclerodactyly: e.target.checked },
                        }))
                      }
                      className="accent-orange-500 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-300">Raynaud Phenomenon (3 pts)</span>
                    <input
                      type="checkbox"
                      checked={params.clinicalFindings.raynaudPhenomenon}
                      onChange={(e) =>
                        setParams((prev) => ({
                          ...prev,
                          clinicalFindings: { ...prev.clinicalFindings, raynaudPhenomenon: e.target.checked },
                        }))
                      }
                      className="accent-orange-500 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex justify-between">
                    <span>SSc Autoantibodies (Centromere, Scl-70, or RNA Pol III):</span>
                    <span className="font-mono text-orange-400 font-bold">
                      {params.ena.antiCentromereBPositive || params.ena.antiScl70Positive || params.ena.antiRnaPolymeraseIiiPositive
                        ? '+3 pts'
                        : '0 pts'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2016 ACR/EULAR Primary Sjögren */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">2016 ACR/EULAR Primary Sjögren</h3>
                    <p className="text-xs text-slate-400">Classification threshold: &ge; 4 points</p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl border font-mono font-bold text-sm ${
                    state.sjogrenClassified
                      ? 'bg-teal-950/60 border-teal-500 text-teal-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {state.sjogrenAcrEular2016Score} Pts ({state.sjogrenClassified ? 'Classified' : 'Not Met'})
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex justify-between">
                    <span>Anti-SSA/Ro60 Positive:</span>
                    <span className="font-mono text-teal-400 font-bold">{params.ena.antiRo60Positive ? '+3 pts' : '0 pts'}</span>
                  </div>

                  <label className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-300">Sicca Symptoms (Ocular &amp; Oral Dryness: +1 pt)</span>
                    <input
                      type="checkbox"
                      checked={params.clinicalFindings.siccaOcularOral}
                      onChange={(e) =>
                        setParams((prev) => ({
                          ...prev,
                          clinicalFindings: { ...prev.clinicalFindings, siccaOcularOral: e.target.checked },
                        }))
                      }
                      className="accent-teal-500 w-4 h-4 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Diagnostic Guidelines & Biopsy */}
        {activeTab === 'clinicalAlgorithms' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Choosing Wisely & DFS70 Protocol */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Choosing Wisely &bull; ACR ANA Ordering Principles
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Do not test for ANA sub-serologies (such as anti-ENA, anti-dsDNA) without a prior positive ANA or without a high pre-test probability of systemic autoimmune disease. Up to 13% of healthy individuals possess a positive ANA at 1:80.
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-emerald-400">
                  Isolated Anti-DFS70 Reassurance Protocol
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Anti-DFS70 (Dense Fine Speckled 70 / LEDGF) is the most frequent ANA pattern in healthy people (~10%). When present in isolation without other ENA antibodies, it strongly excludes Systemic Autoimmune Rheumatic Diseases (SARD).
                </p>
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300">
                  <strong>Clinical Action:</strong> Reassure the patient, discharge from rheumatology clinic, and avoid immunosuppressive toxicity.
                </div>
              </div>
            </div>

            {/* Right: Lupus Nephritis Biopsy & Neonatal Heart Block */}
            <div className="lg:col-span-6 space-y-4">
              {/* Lupus Nephritis ISN/RPS Protocol */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-rose-300">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Lupus Nephritis Biopsy Thresholds (KDIGO / ACR)
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Absolute Biopsy Trigger:</strong> Persistent proteinuria &ge; 0.5 g/24h or active urinary sediment (RBC casts) in an SLE patient.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Class III/IV Proliferative:</strong> Requires aggressive induction with Mycophenolate Mofetil (MMF) or Low-Dose IV Cyclophosphamide (Euro-Lupus) + pulse methylprednisolone.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Neonatal Lupus */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-teal-300">
                  <Heart className="w-4 h-4 text-teal-400" />
                  Maternal Anti-Ro/SSA Congenital Heart Block Surveillance
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Maternal IgG anti-Ro/SSA antibodies cross the placenta at ~16 weeks gestation, binding fetal cardiac conduction tissue and triggering irreversible complete atrioventricular (AV) heart block. Serial weekly fetal echocardiography is recommended between gestational weeks 16 and 26.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
