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
  Pill,
  Heart,
  Zap,
  Gauge,
  Sliders,
  Syringe,
  Layers,
  Flame,
  Scale,
  Stethoscope,
  Microscope,
  Info,
  Clock,
  Dna,
  ShieldCheck,
  AlertOctagon,
} from 'lucide-react';
import {
  computeHivAntiretroviralState,
  HIV_PRESETS,
  HivInputParams,
  HivPresetId,
  HivAntiretroviralState,
  ArtRegimenId,
} from '@/.gemini/skills/HivAntiretroviralEngine';

const PRESET_KEYS: HivPresetId[] = [
  'NEWLY_DIAGNOSED_ASYMPTOMATIC_CD4_HIGH',
  'ADVANCED_HIV_PCP_PROPHYLAXIS_CD4_150',
  'CRITICAL_CD4_UNDER_50_MULTI_OI_RISK',
  'CRYPTOCOCCAL_MENINGITIS_ART_TIMING_DILEMMA',
  'TB_HIV_COINFECTION_RIFAMYCIN_DRUG_INTERACTIONS',
  'HLA_B5701_POSITIVE_ABACAVIR_CONTRAINDICATION',
  'CHRONIC_HEPATITIS_B_HIV_COINFECTION',
  'VIROLOGIC_FAILURE_RESISTANCE_MUTATIONS',
];

const REGIMEN_OPTIONS: { id: ArtRegimenId; name: string; class: string; brand: string }[] = [
  { id: 'BIKTARVY_BIC_TAF_FTC', name: 'Bictegravir / Tenofovir Alafenamide / Emtricitabine', class: 'INSTI + 2 NRTIs', brand: 'Biktarvy' },
  { id: 'TRIUMEQ_DTG_ABC_3TC', name: 'Dolutegravir / Abacavir / Lamivudine', class: 'INSTI + 2 NRTIs', brand: 'Triumeq (HLA-B*5701 Req.)' },
  { id: 'DOVATO_DTG_3TC_2DRUG', name: 'Dolutegravir / Lamivudine', class: 'INSTI + 1 NRTI (2-Drug)', brand: 'Dovato' },
  { id: 'TIVICAY_DESCOVY_DTG_TAF_FTC', name: 'Dolutegravir + TAF / FTC', class: 'INSTI + 2 NRTIs', brand: 'Tivicay + Descovy' },
  { id: 'DARUNAVIR_RITONAVIR_DESCOVY', name: 'Darunavir / Ritonavir + TAF / FTC', class: 'Boosted PI + 2 NRTIs', brand: 'Prezista/r + Descovy' },
  { id: 'EFAVIRENZ_TRUVADA_EFV_TDF_FTC', name: 'Efavirenz / Tenofovir DF / Emtricitabine', class: 'NNRTI + 2 NRTIs', brand: 'Atripla / Truvada' },
];

export default function HivAntiretroviralSimulator() {
  const [selectedPreset, setSelectedPreset] = useState<HivPresetId>(
    'NEWLY_DIAGNOSED_ASYMPTOMATIC_CD4_HIGH'
  );
  const [params, setParams] = useState<HivInputParams>(
    () => HIV_PRESETS.NEWLY_DIAGNOSED_ASYMPTOMATIC_CD4_HIGH.initialState
  );
  const [activeTab, setActiveTab] = useState<
    'artSelection' | 'oiProphylaxis' | 'irisTiming' | 'viralKinetics'
  >('artSelection');
  const [reportExported, setReportExported] = useState(false);

  // Compute live HIV state
  const state: HivAntiretroviralState = useMemo(() => {
    return computeHivAntiretroviralState(params);
  }, [params]);

  // Load Preset
  const handleSelectPreset = (presetId: HivPresetId) => {
    setSelectedPreset(presetId);
    setParams(HIV_PRESETS[presetId].initialState);
  };

  // Reset
  const handleReset = () => {
    handleSelectPreset('NEWLY_DIAGNOSED_ASYMPTOMATIC_CD4_HIGH');
    setReportExported(false);
  };

  // Export Report
  const handleExportReport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  // Color helper for CD4
  const getCd4Color = (cd4: number) => {
    if (cd4 >= 500) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (cd4 >= 200) return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
    if (cd4 >= 50) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
                <Microscope className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300 bg-clip-text text-transparent">
                  HIV Antiretroviral Therapy (ART) &amp; CD4 OI Prophylaxis Workstation
                </h1>
                <p className="text-xs lg:text-sm text-slate-400 mt-1">
                  DHHS / WHO Guidelines &bull; CD4 Stratification &bull; Opportunistic Infection Prophylaxis &bull; HLA-B*5701 Pharmacogenomics &bull; IRIS Timing
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* CD4 Count Badge */}
            <div className={`px-4 py-2 rounded-xl border font-mono text-center ${getCd4Color(params.laboratory.cd4CountCellsPerUl)}`}>
              <div className="text-[10px] uppercase font-sans tracking-wider opacity-80">CD4 T-Cell Count</div>
              <div className="text-2xl font-bold flex items-center justify-center gap-1.5">
                <span>{params.laboratory.cd4CountCellsPerUl}</span>
                <span className="text-xs font-normal">/&mu;L ({params.laboratory.cd4Percentage}%)</span>
              </div>
            </div>

            {/* Viral Load Badge */}
            <div className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/80 font-mono text-center">
              <div className="text-[10px] uppercase font-sans tracking-wider text-slate-400">HIV RNA Viral Load</div>
              <div className="text-2xl font-bold text-amber-300">
                {params.laboratory.hivRnaViralLoadCopiesPerMl.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400">c/mL</span>
              </div>
            </div>

            {/* ART Safety Rating Badge */}
            <div className={`px-4 py-2 rounded-xl border font-mono text-center ${
              state.artSafety.isRegimenAppropriate
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}>
              <div className="text-[10px] uppercase font-sans tracking-wider opacity-80">Regimen Safety</div>
              <div className="text-lg font-bold">
                {state.artSafety.regimenSafetyRating.replace(/_/g, ' ')}
              </div>
            </div>

            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition shadow-sm"
              title="Export HIV Clinical Management Record"
            >
              <FileText className="w-4 h-4 text-purple-400" />
              <span>{reportExported ? 'Plan Logged!' : 'Export Record'}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition shadow-sm"
              title="Reset to Asymptomatic CD4 520 Baseline"
            >
              <RotateCcw className="w-4 h-4 text-sky-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 8 Clinical Presets Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Clinical Scenarios &amp; Pharmacotherapeutic Dilemmas
            </span>
            <span className="text-[11px] text-slate-500">8 Validated HIV Presets</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {PRESET_KEYS.map((key) => {
              const preset = HIV_PRESETS[key];
              const isSelected = selectedPreset === key;
              return (
                <button
                  key={key}
                  onClick={() => handleSelectPreset(key)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between h-20 ${
                    isSelected
                      ? 'bg-purple-950/60 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-medium leading-snug line-clamp-2">{preset.title.split('(')[0]}</div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {key === 'NEWLY_DIAGNOSED_ASYMPTOMATIC_CD4_HIGH'
                      ? 'Asymptomatic CD4 520'
                      : key === 'ADVANCED_HIV_PCP_PROPHYLAXIS_CD4_150'
                      ? 'PCP Prophylaxis'
                      : key === 'CRITICAL_CD4_UNDER_50_MULTI_OI_RISK'
                      ? 'CD4 < 50 Multi-OI'
                      : key === 'CRYPTOCOCCAL_MENINGITIS_ART_TIMING_DILEMMA'
                      ? 'Cryptococcal Defer'
                      : key === 'TB_HIV_COINFECTION_RIFAMYCIN_DRUG_INTERACTIONS'
                      ? 'TB / Rifampin'
                      : key === 'HLA_B5701_POSITIVE_ABACAVIR_CONTRAINDICATION'
                      ? 'HLA-B*5701 Pos'
                      : key === 'CHRONIC_HEPATITIS_B_HIV_COINFECTION'
                      ? 'HBV Co-Infection'
                      : 'M184V Resistance'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Alarms and Clinical Guidance Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Infectious &amp; Drug Safety Alerts
              </span>
              <span className="text-[11px] font-mono text-slate-500">{state.activeAlarms.length} Active</span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {state.activeAlarms.map((alarm, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-2 ${
                    alarm.includes('LETHAL') || alarm.includes('FATAL') || alarm.includes('RESISTANCE')
                      ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                      : alarm.includes('PROPHYLAXIS') || alarm.includes('INTERACTION') || alarm.includes('DISSEMINATED')
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

          <div className="md:col-span-8 bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-purple-400" />
                DHHS Clinical Guidance &amp; Treatment Plan
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                WHO Stage: {state.whoClinicalStage} &bull; CrCl: {params.laboratory.estimatedCrClMlMin} mL/min &bull; IRIS: {state.iris.irisRiskCategory}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{state.clinicalGuidance}</p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-400 border-t border-slate-800/60">
              <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                PCP Prophylaxis: <strong className={state.prophylaxis.pcpIndicated ? 'text-amber-300' : 'text-slate-300'}>
                  {state.prophylaxis.pcpIndicated ? 'Indicated (TMP-SMX)' : 'Not Required'}
                </strong>
              </span>
              <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                Toxoplasma: <strong className={state.prophylaxis.toxoIndicated ? 'text-rose-400' : 'text-slate-300'}>
                  {state.prophylaxis.toxoIndicated ? 'Indicated' : 'Not Required'}
                </strong>
              </span>
              <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                MAC: <strong className={state.prophylaxis.macIndicated ? 'text-amber-400' : 'text-slate-300'}>
                  {state.prophylaxis.macIndicated ? 'Consider Azithromycin' : 'Not Required'}
                </strong>
              </span>
              <span className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                Safe to Start ART: <strong className={state.iris.safeToStartArtNow ? 'text-emerald-400' : 'text-rose-400'}>
                  {state.iris.safeToStartArtNow ? 'Yes (Immediate)' : `NO (Defer ${state.iris.recommendedArtDelayWeeks}w)`}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-800 flex gap-2">
          <button
            onClick={() => setActiveTab('artSelection')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'artSelection'
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Pill className="w-4 h-4" />
            ART Regimen Selection &amp; Pharmacogenomics
          </button>
          <button
            onClick={() => setActiveTab('oiProphylaxis')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'oiProphylaxis'
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            CD4 Staging &amp; OI Prophylaxis Deck
          </button>
          <button
            onClick={() => setActiveTab('irisTiming')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'irisTiming'
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            IRIS Risk &amp; Acute Infection ART Timing
          </button>
          <button
            onClick={() => setActiveTab('viralKinetics')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'viralKinetics'
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Viral Suppression &amp; CD4 Rebound
          </button>
        </div>

        {/* TAB 1: ART Regimen Selection & Pharmacogenomics */}
        {activeTab === 'artSelection' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Regimen Selector List */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Pill className="w-4 h-4 text-purple-400" />
                  Antiretroviral Therapy (ART) Regimen Options
                </span>
                <span className="text-xs font-mono text-slate-400">DHHS First-Line</span>
              </div>

              <div className="space-y-2">
                {REGIMEN_OPTIONS.map((reg) => {
                  const isSelected = params.prescribedArtRegimen === reg.id;
                  return (
                    <button
                      key={reg.id}
                      onClick={() => setParams((prev) => ({ ...prev, prescribedArtRegimen: reg.id }))}
                      className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-purple-950/70 border-purple-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-200">{reg.brand}</div>
                        <div className="text-[11px] text-slate-400">{reg.name}</div>
                      </div>
                      <div className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
                        {reg.class}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Lab & Co-infection Toggles */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="text-xs font-medium text-slate-300">Co-Infections &amp; Pharmacogenomics Modifiers</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {/* HLA-B*5701 */}
                  <button
                    onClick={() =>
                      setParams((prev) => ({
                        ...prev,
                        laboratory: {
                          ...prev.laboratory,
                          hlaB5701Positive: !prev.laboratory.hlaB5701Positive,
                        },
                      }))
                    }
                    className={`p-2 rounded-lg border text-center transition ${
                      params.laboratory.hlaB5701Positive
                        ? 'bg-rose-950/70 border-rose-500 text-rose-200 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    HLA-B*5701: {params.laboratory.hlaB5701Positive ? 'POSITIVE' : 'Negative'}
                  </button>

                  {/* Hepatitis B */}
                  <button
                    onClick={() =>
                      setParams((prev) => ({
                        ...prev,
                        laboratory: {
                          ...prev.laboratory,
                          hepatitisBSurfaceAntigen: !prev.laboratory.hepatitisBSurfaceAntigen,
                        },
                      }))
                    }
                    className={`p-2 rounded-lg border text-center transition ${
                      params.laboratory.hepatitisBSurfaceAntigen
                        ? 'bg-rose-950/70 border-rose-500 text-rose-200 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    HBsAg: {params.laboratory.hepatitisBSurfaceAntigen ? 'POSITIVE' : 'Negative'}
                  </button>

                  {/* Rifampin TB Therapy */}
                  <button
                    onClick={() => setParams((prev) => ({ ...prev, isOnRifampinTbTherapy: !prev.isOnRifampinTbTherapy }))}
                    className={`p-2 rounded-lg border text-center transition ${
                      params.isOnRifampinTbTherapy
                        ? 'bg-amber-950/70 border-amber-500 text-amber-200 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    On Rifampin: {params.isOnRifampinTbTherapy ? 'YES' : 'No'}
                  </button>

                  {/* M184V Mutation */}
                  <button
                    onClick={() =>
                      setParams((prev) => ({
                        ...prev,
                        laboratory: {
                          ...prev.laboratory,
                          knownM184VMutation: !prev.laboratory.knownM184VMutation,
                        },
                      }))
                    }
                    className={`p-2 rounded-lg border text-center transition ${
                      params.laboratory.knownM184VMutation
                        ? 'bg-rose-950/70 border-rose-500 text-rose-200 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    M184V: {params.laboratory.knownM184VMutation ? 'DETECTED' : 'Wild-Type'}
                  </button>
                </div>
              </div>
            </div>

            {/* Regimen Safety Card */}
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <ShieldAlert className="w-4 h-4 text-purple-400" />
                  Prescribed Regimen Safety Assessment
                </span>
                <span className="text-xs font-mono text-slate-400">Pharmacotherapy Solver</span>
              </div>

              <div className={`p-4 rounded-xl border ${
                state.artSafety.isRegimenAppropriate
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
              } space-y-2`}>
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                  {state.artSafety.isRegimenAppropriate ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertOctagon className="w-4 h-4 text-rose-400" />
                  )}
                  {state.artSafety.regimenSafetyRating.replace(/_/g, ' ')}
                </div>
                {state.artSafety.contraindicationReason ? (
                  <p className="text-xs leading-relaxed">{state.artSafety.contraindicationReason}</p>
                ) : (
                  <p className="text-xs leading-relaxed">
                    This regimen meets DHHS and WHO criteria for first-line rapid initiation. High barrier to resistance with rapid viral suppression expected.
                  </p>
                )}
              </div>

              {/* Renal Safety Slider */}
              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Estimated Creatinine Clearance (Cockcroft-Gault)</span>
                  <span className={`font-mono font-bold ${params.laboratory.estimatedCrClMlMin < 30 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {params.laboratory.estimatedCrClMlMin} mL/min
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={params.laboratory.estimatedCrClMlMin}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      laboratory: {
                        ...prev.laboratory,
                        estimatedCrClMlMin: parseInt(e.target.value),
                      },
                    }))
                  }
                  className="w-full accent-purple-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>15 (Severe Renal / ESRD)</span>
                  <span>50 (TDF Cutoff)</span>
                  <span>120 (Normal GFR)</span>
                </div>
              </div>

              {/* Key Clinical Pearl Cards */}
              <div className="space-y-2 text-xs text-slate-400">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-slate-200">Abacavir (ABC) Rule:</strong> Never prescribe without documented negative HLA-B*5701 test. Hypersensitivity reaction presents with fever, rash, GI symptoms, and respiratory distress; re-challenge is fatal.
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-slate-200">HBV Dual Activity:</strong> In HIV-HBV co-infection, 2 agents active against HBV are mandatory (TAF/FTC or TDF/FTC). Discontinuing anti-HBV agents can trigger severe hepatitis flares and hepatic decompensation.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CD4 Staging & OI Prophylaxis Deck */}
        {activeTab === 'oiProphylaxis' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* CD4 Slider & Stratification Deck */}
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  CD4 T-Lymphocyte Stratification
                </span>
                <span className="text-xs font-mono text-slate-400">Immunodeficiency Depth</span>
              </div>

              {/* CD4 Count Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Absolute CD4 Count (/&mu;L)</span>
                  <span className={`font-mono font-bold ${getCd4Color(params.laboratory.cd4CountCellsPerUl)}`}>
                    {params.laboratory.cd4CountCellsPerUl} cells/&mu;L
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="1000"
                  step="5"
                  value={params.laboratory.cd4CountCellsPerUl}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      laboratory: {
                        ...prev.laboratory,
                        cd4CountCellsPerUl: parseInt(e.target.value),
                      },
                    }))
                  }
                  className="w-full accent-purple-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>5 (Profound)</span>
                  <span>50 (MAC)</span>
                  <span>100 (Toxo)</span>
                  <span>200 (PCP)</span>
                  <span>500 (Normal)</span>
                </div>
              </div>

              {/* Toxoplasma IgG Toggle */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Serum Toxoplasma IgG Serology</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { val: true, label: 'Toxoplasma IgG (+)' },
                    { val: false, label: 'Toxoplasma IgG (-)' },
                  ].map((item) => (
                    <button
                      key={String(item.val)}
                      onClick={() =>
                        setParams((prev) => ({
                          ...prev,
                          laboratory: {
                            ...prev.laboratory,
                            toxoplasmaIgGPositive: item.val,
                          },
                        }))
                      }
                      className={`p-2 rounded-lg border text-center transition ${
                        params.laboratory.toxoplasmaIgGPositive === item.val
                          ? 'bg-purple-950/70 border-purple-500 text-white font-medium'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* WHO Staging Box */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">WHO Clinical Stage:</span>
                  <span className="font-mono font-bold text-amber-300">Stage {state.whoClinicalStage}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">CDC Immunologic Category:</span>
                  <span className="font-mono text-purple-300">{state.cd4Stratification.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Severe Immunodeficiency:</span>
                  <span className={state.isSevereImmunodeficiency ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {state.isSevereImmunodeficiency ? 'YES (CD4 < 200)' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* OI Prophylaxis Action Cards */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Opportunistic Infection (OI) Prophylaxis Checklist
                </span>
                <span className="text-xs font-mono text-slate-400">CDC / NIH / IDSA</span>
              </div>

              {/* PCP Card */}
              <div className={`p-4 rounded-xl border ${
                state.prophylaxis.pcpIndicated
                  ? 'bg-rose-950/30 border-rose-800/60'
                  : 'bg-slate-950 border-slate-800'
              } space-y-1.5`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-200">Pneumocystis jirovecii Pneumonia (PCP / PJP)</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    state.prophylaxis.pcpIndicated ? 'bg-rose-900/60 border-rose-700 text-rose-200' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {state.prophylaxis.pcpIndicated ? 'INDICATED (CD4 < 200)' : 'NOT REQUIRED'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{state.prophylaxis.pcpAgent}</p>
                <div className="text-[11px] text-slate-500">Discontinuation criteria: CD4 &gt; 200 /&mu;L for &gt; 3 months on suppressive ART.</div>
              </div>

              {/* Toxoplasma Card */}
              <div className={`p-4 rounded-xl border ${
                state.prophylaxis.toxoIndicated
                  ? 'bg-rose-950/30 border-rose-800/60'
                  : 'bg-slate-950 border-slate-800'
              } space-y-1.5`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-200">Toxoplasma gondii Encephalitis</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    state.prophylaxis.toxoIndicated ? 'bg-rose-900/60 border-rose-700 text-rose-200' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {state.prophylaxis.toxoIndicated ? 'INDICATED (CD4 < 100 + IgG+)' : 'NOT REQUIRED'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{state.prophylaxis.toxoAgent}</p>
              </div>

              {/* Cryptococcal Antigen Card */}
              <div className={`p-4 rounded-xl border ${
                state.prophylaxis.crAgScreeningRecommended
                  ? 'bg-amber-950/30 border-amber-800/60'
                  : 'bg-slate-950 border-slate-800'
              } space-y-1.5`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-200">Serum Cryptococcal Antigen (CrAg) Screening</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    state.prophylaxis.crAgScreeningRecommended ? 'bg-amber-900/60 border-amber-700 text-amber-200' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {state.prophylaxis.crAgScreeningRecommended ? 'SCREEN RECOMMENDED (CD4 < 100)' : 'NOT REQUIRED'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Screen serum CrAg before initiating ART in CD4 &lt; 100. If positive, perform lumbar puncture to rule out meningitis. If asymptomatic and CSF negative, initiate pre-emptive Fluconazole.
                </p>
              </div>

              {/* MAC Card */}
              <div className={`p-4 rounded-xl border ${
                state.prophylaxis.macIndicated
                  ? 'bg-amber-950/30 border-amber-800/60'
                  : 'bg-slate-950 border-slate-800'
              } space-y-1.5`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-200">Mycobacterium avium Complex (MAC)</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    state.prophylaxis.macIndicated ? 'bg-amber-900/60 border-amber-700 text-amber-200' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {state.prophylaxis.macIndicated ? 'CD4 < 50 THRESHOLD' : 'NOT REQUIRED'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{state.prophylaxis.macAgent}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: IRIS Risk & Acute Infection ART Timing */}
        {activeTab === 'irisTiming' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Acute Infections Controls */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Clock className="w-4 h-4 text-rose-400" />
                  Acute Opportunistic Infection &amp; ART Timing
                </span>
                <span className="text-xs font-mono text-slate-400">IRIS Prevention</span>
              </div>

              {/* Cryptococcal Meningitis Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Active Cryptococcal Meningitis</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { val: true, label: 'Active Cryptococcal Meningitis' },
                    { val: false, label: 'No Cryptococcal Infection' },
                  ].map((item) => (
                    <button
                      key={String(item.val)}
                      onClick={() =>
                        setParams((prev) => ({
                          ...prev,
                          laboratory: {
                            ...prev.laboratory,
                            cryptococcalMeningitisActive: item.val,
                          },
                        }))
                      }
                      className={`p-2 rounded-lg border text-center transition ${
                        params.laboratory.cryptococcalMeningitisActive === item.val
                          ? 'bg-rose-950/70 border-rose-500 text-white font-medium'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weeks into Antifungal Therapy Slider */}
              {params.laboratory.cryptococcalMeningitisActive && (
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Weeks Since Antifungal Induction (Amphotericin B)</span>
                    <span className={`font-mono font-bold ${params.weeksSinceOiTreatmentStarted < 2 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {params.weeksSinceOiTreatmentStarted} weeks
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="1"
                    value={params.weeksSinceOiTreatmentStarted}
                    onChange={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        weeksSinceOiTreatmentStarted: parseInt(e.target.value),
                      }))
                    }
                    className="w-full accent-rose-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>0 (Induction Start)</span>
                    <span>2 weeks (Min Deferral)</span>
                    <span>4-6 weeks (Safe ART)</span>
                  </div>
                </div>
              )}

              {/* Tuberculosis Toggle */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="text-xs font-medium text-slate-300">Active Tuberculosis Infection</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { val: true, label: 'Active Pulmonary / Extrapulmonary TB' },
                    { val: false, label: 'No Active Tuberculosis' },
                  ].map((item) => (
                    <button
                      key={String(item.val)}
                      onClick={() =>
                        setParams((prev) => ({
                          ...prev,
                          laboratory: {
                            ...prev.laboratory,
                            tuberculosisActiveInfection: item.val,
                          },
                        }))
                      }
                      className={`p-2 rounded-lg border text-center transition ${
                        params.laboratory.tuberculosisActiveInfection === item.val
                          ? 'bg-amber-950/70 border-amber-500 text-white font-medium'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* IRIS Timing Guidance Card */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Immune Reconstitution (IRIS) Risk Protocol
                </span>
                <span className="text-xs font-mono text-slate-400">COAT &amp; SAPIT Trials</span>
              </div>

              <div className={`p-4 rounded-xl border ${
                state.iris.safeToStartArtNow
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
              } space-y-2`}>
                <div className="flex items-center justify-between font-bold text-xs uppercase tracking-wider">
                  <span>IRIS Risk Category: {state.iris.irisRiskCategory.replace(/_/g, ' ')}</span>
                  <span>{state.iris.safeToStartArtNow ? 'START ART NOW' : 'DEFER ART'}</span>
                </div>
                <p className="text-xs leading-relaxed">{state.iris.irisExplanation}</p>
              </div>

              <div className="space-y-2 text-xs text-slate-400">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-rose-300">Cryptococcal Meningitis COAT Trial:</strong> Starting ART &lt; 2 weeks increased mortality by 50% due to CNS inflammation and catastrophic intracranial pressure rises. Wait at least 2 to 6 weeks.
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-amber-300">Tuberculosis SAPIT Trial:</strong> In severe immunodeficiency (CD4 &lt; 50), early ART within 2 weeks of anti-TB therapy improves overall survival despite paradoxical TB-IRIS. Prophylactic Prednisone 40mg/day for 2 weeks followed by 20mg/day for 2 weeks reduces TB-IRIS incidence by 30%.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Viral Suppression & CD4 Rebound */}
        {activeTab === 'viralKinetics' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 6-Month Trajectory Table */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Projected 6-Month Virological &amp; Immunological Response
                </span>
                <span className="text-xs font-mono text-slate-400">DHHS Treatment Targets</span>
              </div>

              <div className="grid grid-cols-4 gap-3 text-center text-xs">
                {state.projectedTrajectory.map((pt) => (
                  <div key={pt.month} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-[11px] font-bold text-purple-400">Month {pt.month}</div>
                    <div className="space-y-1 font-mono">
                      <div className="text-slate-400 text-[10px]">CD4 Count</div>
                      <div className="text-emerald-400 font-bold text-base">{pt.expectedCd4}</div>
                    </div>
                    <div className="space-y-0.5 font-mono">
                      <div className="text-slate-400 text-[10px]">Viral Load</div>
                      <div className="text-amber-300 font-bold text-xs">
                        {pt.month === 6 ? '< 20 c/mL' : `${Math.round(Math.pow(10, pt.expectedViralLoadLog)).toLocaleString()}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* U=U Message */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-sky-950/40 to-slate-950 border border-emerald-800/40 space-y-2">
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Undetectable = Untransmittable (U=U) Principle
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  People living with HIV on suppressive ART with sustained undetectable viral loads (&lt; 200 copies/mL) have effectively <strong>zero risk</strong> of sexually transmitting HIV to HIV-negative partners (PARTNER 1 &amp; 2 studies, Opposites Attract).
                </p>
              </div>
            </div>

            {/* Monitoring Guidelines Card */}
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                  <Stethoscope className="w-4 h-4 text-purple-400" />
                  Follow-Up Monitoring Schedule
                </span>
                <span className="text-xs font-mono text-slate-400">Standard of Care</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-slate-200">Week 4:</strong> Check viral load (expect &gt; 1 to 2 log10 drop), basic metabolic panel (renal safety with TDF/TAF), and evaluate adherence and tolerability.
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-slate-200">Month 3:</strong> Repeat viral load (expect &lt; 50&ndash;200 copies/mL) and CD4 count.
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-slate-200">Month 6:</strong> Confirm viral load &lt; 20&ndash;50 copies/mL (virologic suppression). If CD4 &gt; 200 for &gt; 3 months, discontinue PCP prophylaxis.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
