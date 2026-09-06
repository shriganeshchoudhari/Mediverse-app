'use client';

import React, { useState, useMemo } from 'react';
import {
  Skull,
  Pill,
  AlertTriangle,
  CheckCircle2,
  Activity,
  FileText,
  RotateCcw,
  Sparkles,
  Stethoscope,
  Heart,
  Thermometer,
  Layers,
  ShieldAlert,
  ArrowRight,
  Droplets,
  Flame,
  Eye,
} from 'lucide-react';
import {
  computeToxicologyState,
  evaluateRumackMatthew,
  calculateOsmolarAndAnionGap,
  TOXICOLOGY_PRESETS,
  ToxicologyInputParams,
  ToxicologyPresetId,
  ToxicologyState,
  ToxidromeType,
  PupilSize,
  SkinSweatState,
  ReflexState,
} from '@/.gemini/skills/ToxicologyAntidoteEngine';

const PRESET_KEYS: ToxicologyPresetId[] = [
  'ACETAMINOPHEN_OVERDOSE_RUMACK',
  'ORGANOPHOSPHATE_CHOLINERGIC_CRISIS',
  'ANTICHOLINERGIC_DELIRIUM_DIPHENHYDRAMINE',
  'FENTANYL_OPIOID_RESPIRATORY_DEPRESSION',
  'ACUTE_SALICYLATE_ASPIRIN_TOXICITY',
  'ETHYLENE_GLYCOL_TOXIC_ALCOHOL',
  'SEROTONIN_SYNDROME_POLYPHARMACY',
  'CALCIUM_CHANNEL_BLOCKER_SHOCK',
];

export default function ToxicologyAntidoteSimulator() {
  const [selectedPreset, setSelectedPreset] = useState<ToxicologyPresetId>(
    'ACETAMINOPHEN_OVERDOSE_RUMACK'
  );
  const [params, setParams] = useState<ToxicologyInputParams>(
    () => TOXICOLOGY_PRESETS.ACETAMINOPHEN_OVERDOSE_RUMACK.initialState
  );
  const [activeTab, setActiveTab] = useState<'toxidrome' | 'rumack' | 'alcoholsSalicylates' | 'antidotes'>(
    'toxidrome'
  );
  const [reportExported, setReportExported] = useState(false);

  // Computed state
  const state: ToxicologyState = useMemo(() => {
    return computeToxicologyState(params);
  }, [params]);

  // Load Preset
  const handleSelectPreset = (presetId: ToxicologyPresetId) => {
    setSelectedPreset(presetId);
    setParams(TOXICOLOGY_PRESETS[presetId].initialState);
  };

  // Reset
  const handleReset = () => {
    handleSelectPreset('ACETAMINOPHEN_OVERDOSE_RUMACK');
    setReportExported(false);
  };

  // Export Report
  const handleExportReport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  // Administer Specific Antidotes
  const handleAdministerNac = () => {
    setParams((prev) => ({
      ...prev,
      antidoteAdministered: { ...prev.antidoteAdministered, nacGiven: true },
    }));
  };

  const handleAdministerNaloxone = () => {
    setParams((prev) => ({
      ...prev,
      antidoteAdministered: { ...prev.antidoteAdministered, naloxoneMg: 0.4 },
      vitals: {
        ...prev.vitals,
        respiratoryRate: Math.max(14, prev.vitals.respiratoryRate + 10),
        oxygenSaturationPct: Math.max(96, prev.vitals.oxygenSaturationPct + 15),
        gcsScore: Math.max(12, prev.vitals.gcsScore + 8),
      },
    }));
  };

  const handleAdministerAtropine = () => {
    setParams((prev) => ({
      ...prev,
      antidoteAdministered: { ...prev.antidoteAdministered, atropineMg: prev.antidoteAdministered.atropineMg + 2, pralidoximeG: 2 },
      vitals: {
        ...prev.vitals,
        heartRateBpm: Math.min(90, prev.vitals.heartRateBpm + 35),
        oxygenSaturationPct: Math.min(98, prev.vitals.oxygenSaturationPct + 10),
      },
      exam: {
        ...prev.exam,
        salivationLacrimation: false,
      },
    }));
  };

  const handleAdministerBicarbonate = () => {
    setParams((prev) => ({
      ...prev,
      antidoteAdministered: { ...prev.antidoteAdministered, sodiumBicarbonateMeq: 150 },
      labs: { ...prev.labs, urinePh: 7.8, arterialPh: 7.50 },
    }));
  };

  // Rumack Nomogram Coordinate Helpers
  // X: Hours 4 to 24 -> X 50 to 450
  const rumackHoursToX = (h: number): number => {
    const clamped = Math.max(4, Math.min(24, h));
    return 50 + ((clamped - 4) / (24 - 4)) * 400;
  };
  // Y: APAP 0 to 300 ug/mL -> Y 320 to 30
  const rumackLevelToY = (lvl: number): number => {
    const clamped = Math.max(0, Math.min(300, lvl));
    return 320 - (clamped / 300) * 290;
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 p-6 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold tracking-widest uppercase mb-1">
              <Skull className="w-4 h-4" />
              Medical Toxicology &amp; Resuscitation Workstation
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Clinical Toxicology, Toxidromes &amp; Antidote Precision Solver
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Identify multi-system toxidromes, solve the Rumack-Matthew APAP nomogram, compute toxic alcohol osmolar gaps,
              titrate Naloxone &amp; Atropine, and manage refractory cardiotoxic shock with High-Dose Insulin (HIET).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={handleExportReport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-rose-500/20 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              {reportExported ? 'Report Generated!' : 'Export Tox Consultation'}
            </button>
          </div>
        </div>

        {/* Toxidrome & Alarms Banner */}
        <div className="mt-4 p-3 bg-slate-900/90 rounded-xl border border-rose-500/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-bold tracking-wider text-rose-400">Primary Toxidrome:</span>
            <span className="text-sm font-bold text-white px-2.5 py-0.5 rounded bg-rose-950 border border-rose-700">
              {state.primaryToxidrome.replace(/_/g, ' ')} ({state.toxidromeConfidencePct}% Match)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {state.activeAlarms.map((alarm) => {
              const isLifeThreat =
                alarm === 'APAP_HEPATOTOXIC_TREATMENT_LINE_EXCEEDED' ||
                alarm === 'CHOLINERGIC_KILLER_BS_BRONCHORRHEA' ||
                alarm === 'OPIOID_RESPIRATORY_ARREST' ||
                alarm === 'CCB_CARDIOGENIC_VASOPLEGIC_SHOCK';
              return (
                <span
                  key={alarm}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isLifeThreat
                      ? 'bg-rose-950/90 text-rose-300 border border-rose-600 animate-pulse'
                      : alarm === 'OPTIMAL_STABLE'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-600'
                  }`}
                >
                  {isLifeThreat ? <AlertTriangle className="w-3 h-3 text-rose-400" /> : <CheckCircle2 className="w-3 h-3" />}
                  {alarm.replace(/_/g, ' ')}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Preset Selector Grid */}
      <div className="p-4 bg-slate-900/50 border-b border-slate-800">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          Clinical Toxicology Presets &amp; Overdose Scenarios:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {PRESET_KEYS.map((key) => {
            const preset = TOXICOLOGY_PRESETS[key];
            const isSelected = selectedPreset === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectPreset(key)}
                className={`p-2.5 rounded-xl text-left border text-xs transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-rose-950/60 border-rose-500 text-rose-200 font-bold shadow-md shadow-rose-950'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold line-clamp-2">{preset.title}</div>
                <div className="text-[10px] text-slate-400 mt-1">{preset.initialState.presetId.replace(/_/g, ' ')}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 bg-slate-900/80 px-6">
        <button
          onClick={() => setActiveTab('toxidrome')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'toxidrome'
              ? 'border-rose-400 text-rose-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          Toxidrome Physical Exam Matrix
        </button>
        <button
          onClick={() => setActiveTab('rumack')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'rumack'
              ? 'border-rose-400 text-rose-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Rumack-Matthew APAP Nomogram &amp; NAC
        </button>
        <button
          onClick={() => setActiveTab('alcoholsSalicylates')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'alcoholsSalicylates'
              ? 'border-rose-400 text-rose-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Droplets className="w-4 h-4" />
          Toxic Alcohols &amp; Salicylate Alkalinization
        </button>
        <button
          onClick={() => setActiveTab('antidotes')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'antidotes'
              ? 'border-rose-400 text-rose-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Pill className="w-4 h-4" />
          Antidote Dosing &amp; Critical Care Protocols
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="p-6">
        {activeTab === 'toxidrome' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Vitals & Toxidrome Physical Exam Dashboard */}
            <div className="lg:col-span-6 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                Physical Exam &amp; Vital Signs Matrix
              </h3>

              {/* Vitals Grid */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Heart Rate</span>
                  <span className={`text-base font-bold font-mono ${params.vitals.heartRateBpm > 100 ? 'text-rose-400' : params.vitals.heartRateBpm < 60 ? 'text-cyan-400' : 'text-white'}`}>
                    {params.vitals.heartRateBpm} bpm
                  </span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Blood Pressure</span>
                  <span className={`text-base font-bold font-mono ${params.vitals.systolicBp < 90 ? 'text-rose-400' : 'text-white'}`}>
                    {params.vitals.systolicBp}/{params.vitals.diastolicBp}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Respiratory Rate</span>
                  <span className={`text-base font-bold font-mono ${params.vitals.respiratoryRate < 10 ? 'text-rose-400 font-black animate-pulse' : 'text-white'}`}>
                    {params.vitals.respiratoryRate} /min
                  </span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Temperature</span>
                  <span className={`text-base font-bold font-mono ${params.vitals.temperatureCelsius >= 38.5 ? 'text-amber-400' : 'text-white'}`}>
                    {params.vitals.temperatureCelsius}°C
                  </span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Oxygen Saturation</span>
                  <span className={`text-base font-bold font-mono ${params.vitals.oxygenSaturationPct < 92 ? 'text-rose-400' : 'text-teal-300'}`}>
                    {params.vitals.oxygenSaturationPct}%
                  </span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">GCS Score</span>
                  <span className={`text-base font-bold font-mono ${params.vitals.gcsScore <= 8 ? 'text-rose-400' : 'text-white'}`}>
                    {params.vitals.gcsScore} / 15
                  </span>
                </div>
              </div>

              {/* Physical Exam Signs Card */}
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Pupils:</span>
                  <span className="font-bold text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                    {params.exam.pupils}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Skin / Diaphoresis:</span>
                  <span className="font-bold text-amber-300 px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                    {params.exam.skin.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Bowel Sounds:</span>
                  <span className="font-bold text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                    {params.exam.bowelSounds.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Neuromuscular Exam:</span>
                  <span className={`font-bold px-2 py-0.5 rounded bg-slate-900 border ${params.exam.neuromuscular === 'HYPERREFLEXIC_CLONUS' ? 'text-rose-400 border-rose-800' : 'text-white border-slate-700'}`}>
                    {params.exam.neuromuscular.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Urinary Retention:</span>
                  <span className={`font-bold px-2 py-0.5 rounded ${params.exam.urinaryRetention ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'text-slate-400'}`}>
                    {params.exam.urinaryRetention ? 'PRESENT (Palpable Globe)' : 'ABSENT'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Salivation &amp; Lacrimation:</span>
                  <span className={`font-bold px-2 py-0.5 rounded ${params.exam.salivationLacrimation ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'text-slate-400'}`}>
                    {params.exam.salivationLacrimation ? 'PROFUSE (Killer B\'s)' : 'NORMAL'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Comparative Toxidromes Reference Guide */}
            <div className="lg:col-span-6 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-400" />
                Differential Toxidromes Comparison
              </h3>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-amber-400">Anticholinergic</strong>
                    <span className="text-[10px] text-slate-400">&ldquo;Dry as a bone, mad as a hatter, red as a beet&rdquo;</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Mydriasis, tachycardia, hyperthermia, <strong className="text-amber-300">BONE DRY skin</strong>, absent bowel sounds, urinary retention, delirium. Antidote: Physostigmine.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-sky-400">Cholinergic (SLUDGEM)</strong>
                    <span className="text-[10px] text-slate-400">&ldquo;Drowning in secretions&rdquo;</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Pinpoint miosis, profuse diaphoresis, <strong className="text-sky-300">copious bronchorrhea</strong>, bradycardia, diarrhea, emesis. Antidotes: Atropine + Pralidoxime (2-PAM).
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-rose-400">Opioid Overdose</strong>
                    <span className="text-[10px] text-slate-400">Classic Triad</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Coma/CNS depression, <strong className="text-rose-300">Pinpoint pupils (miosis)</strong>, and <strong className="text-rose-300">Respiratory depression (RR &lt; 10)</strong>. Antidote: Titrated Naloxone.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-purple-400">Sympathomimetic vs Serotonin Syndrome</strong>
                    <span className="text-[10px] text-slate-400">Hunter Criteria</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Both feature tachycardia, mydriasis, diaphoresis. Serotonin syndrome is distinguished by <strong className="text-purple-300">spontaneous/ocular clonus and hyperreflexia</strong>. Antidote: Cyproheptadine + Benzodiazepines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rumack' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive SVG Rumack-Matthew Nomogram */}
            <div className="lg:col-span-7 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-rose-400" />
                  Rumack-Matthew Acetaminophen Nomogram
                </h3>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-rose-400 font-bold">── 150 Treatment Line</span>
                  <span className="text-amber-400 font-bold">-- 100 High-Risk Line</span>
                </div>
              </div>

              {/* Nomogram SVG Canvas */}
              <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-lg p-2 border border-slate-800 overflow-hidden">
                <svg viewBox="0 0 480 340" className="w-full h-full select-none">
                  {/* Grid Lines - Hours (4 to 24) */}
                  {[4, 8, 12, 16, 20, 24].map((h) => {
                    const x = rumackHoursToX(h);
                    return (
                      <g key={`h-${h}`}>
                        <line x1={x} y1={rumackLevelToY(0)} x2={x} y2={rumackLevelToY(300)} stroke="#1e293b" strokeWidth="1" />
                        <text x={x} y={rumackLevelToY(0) + 16} fill="#64748b" fontSize="10" textAnchor="middle">
                          {h}h
                        </text>
                      </g>
                    );
                  })}

                  {/* Grid Lines - Concentration (0 to 300 ug/mL) */}
                  {[0, 50, 100, 150, 200, 250, 300].map((lvl) => {
                    const y = rumackLevelToY(lvl);
                    return (
                      <g key={`lvl-${lvl}`}>
                        <line x1={rumackHoursToX(4)} y1={y} x2={rumackHoursToX(24)} y2={y} stroke="#1e293b" strokeWidth="1" />
                        <text x={rumackHoursToX(4) - 8} y={y + 4} fill="#64748b" fontSize="10" textAnchor="end">
                          {lvl}
                        </text>
                      </g>
                    );
                  })}

                  {/* Axis Labels */}
                  <text x="250" y="335" fill="#cbd5e1" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Hours Post-Ingestion (4 to 24 hours)
                  </text>
                  <text x="14" y="170" fill="#cbd5e1" fontSize="11" fontWeight="bold" textAnchor="middle" transform="rotate(-90 14 170)">
                    Serum APAP (&mu;g/mL)
                  </text>

                  {/* 150 Treatment Line (Red exponential curve: 150 at 4h, 75 at 8h, 37.5 at 12h, etc.) */}
                  <path
                    d={`M ${rumackHoursToX(4)} ${rumackLevelToY(150)}
                        Q ${rumackHoursToX(10)} ${rumackLevelToY(55)}, ${rumackHoursToX(24)} ${rumackLevelToY(4.7)}`}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                  />

                  {/* 100 High-Risk Line (Amber dashed curve: 100 at 4h) */}
                  <path
                    d={`M ${rumackHoursToX(4)} ${rumackLevelToY(100)}
                        Q ${rumackHoursToX(10)} ${rumackLevelToY(36)}, ${rumackHoursToX(24)} ${rumackLevelToY(3.1)}`}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="4,2"
                  />

                  {/* Patient Datapoint */}
                  {params.labs.hoursPostIngestion >= 4 && (
                    <g>
                      <circle
                        cx={rumackHoursToX(params.labs.hoursPostIngestion)}
                        cy={rumackLevelToY(params.labs.apapUgMl)}
                        r="7"
                        fill={state.rumackResult.isAboveTreatmentLine ? '#ef4444' : '#10b981'}
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                      <text
                        x={rumackHoursToX(params.labs.hoursPostIngestion) + 12}
                        y={rumackLevelToY(params.labs.apapUgMl) - 8}
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {params.labs.apapUgMl} &mu;g/mL @ {params.labs.hoursPostIngestion}h
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Sliders for APAP and Time */}
              <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Serum APAP Level:</span>
                    <span className="font-mono text-rose-400">{params.labs.apapUgMl} &mu;g/mL</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    step="5"
                    value={params.labs.apapUgMl}
                    onChange={(e) => setParams((p) => ({ ...p, labs: { ...p.labs, apapUgMl: Number(e.target.value) } }))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Time Since Ingestion:</span>
                    <span className="font-mono text-sky-400">{params.labs.hoursPostIngestion} hours</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="24"
                    step="1"
                    value={params.labs.hoursPostIngestion}
                    onChange={(e) => setParams((p) => ({ ...p, labs: { ...p.labs, hoursPostIngestion: Number(e.target.value) } }))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Right: 21-Hour IV NAC Dosing Protocol */}
            <div className="lg:col-span-5 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Pill className="w-4 h-4 text-rose-400" />
                  N-Acetylcysteine (NAC) Protocol
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  state.rumackResult.isAboveTreatmentLine
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {state.rumackResult.isAboveTreatmentLine ? 'NAC MANDATORY' : 'BELOW 150 LINE'}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2">
                <div className="font-bold text-teal-300 mb-1">Standard 21-Hour 3-Bag IV Regimen:</div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <strong className="text-rose-400 block">Bag 1 (Loading):</strong>
                  150 mg/kg in 200 mL D5W over 1 hour.
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <strong className="text-amber-400 block">Bag 2 (Second):</strong>
                  50 mg/kg in 500 mL D5W over 4 hours.
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <strong className="text-sky-400 block">Bag 3 (Maintenance):</strong>
                  100 mg/kg in 1000 mL D5W over 16 hours.
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                <strong className="text-amber-400 block mb-1">King&apos;s College Liver Transplant Criteria:</strong>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Arterial pH &lt; 7.30 after resuscitation OR all three: INR &gt; 6.5, Creatinine &gt; 3.4 mg/dL, and Grade III/IV hepatic encephalopathy.
                </p>
              </div>

              <button
                onClick={handleAdministerNac}
                disabled={params.antidoteAdministered.nacGiven}
                className={`w-full py-2 rounded-lg text-xs font-bold transition shadow-lg ${
                  params.antidoteAdministered.nacGiven
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 cursor-not-allowed'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                }`}
              >
                {params.antidoteAdministered.nacGiven ? '✓ IV NAC Infusion Active' : 'Start IV N-Acetylcysteine Infusion'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'alcoholsSalicylates' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Toxic Alcohols & Osmolar Gap Solver */}
            <div className="lg:col-span-6 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-sky-400" />
                  Toxic Alcohols &amp; Osmolar Gap Solver
                </h3>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  state.osmolarGapResult.isHighOsmolarGap
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {state.osmolarGapResult.isHighOsmolarGap ? 'HIGH OSMOLAR GAP' : 'NORMAL GAP'}
                </span>
              </div>

              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Measured Serum Osmolality:</span>
                  <span className="font-mono text-white">{params.labs.measuredOsmolalityMOsmKg} mOsm/kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Calculated Osmolality (2Na + Gluc/18 + BUN/2.8):</span>
                  <span className="font-mono text-slate-300">{state.osmolarGapResult.calculatedOsmolality} mOsm/kg</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800 font-bold">
                  <span className="text-slate-200">Osmolar Gap:</span>
                  <span className={`font-mono ${state.osmolarGapResult.osmolarGap > 15 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {state.osmolarGapResult.osmolarGap} mOsm/kg (Normal &lt; 10–15)
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800 font-bold">
                  <span className="text-slate-200">Serum Anion Gap:</span>
                  <span className={`font-mono ${state.osmolarGapResult.isHagma ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {state.osmolarGapResult.anionGap} mEq/L (Normal 8–12)
                  </span>
                </div>
              </div>

              {params.labs.calciumOxalateCrystalsPresent && (
                <div className="p-3 bg-amber-950/70 border border-amber-800 rounded-lg text-xs text-amber-300 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span><strong>Microscopic Urinalysis:</strong> Calcium oxalate monohydrate needle/envelope crystals present, confirming Ethylene Glycol ingestion.</span>
                </div>
              )}
            </div>

            {/* Right: Salicylates & Urinary Alkalinization */}
            <div className="lg:col-span-6 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-amber-400" />
                  Salicylate (Aspirin) Alkalinization
                </h3>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  state.salicylateDialysisIndicated
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {state.salicylateDialysisIndicated ? 'HEMODIALYSIS REQUIRED' : 'ALKALINIZATION'}
                </span>
              </div>

              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Serum Salicylate Concentration:</span>
                  <span className="font-mono text-amber-400 font-bold">{params.labs.salicylateMgDl} mg/dL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Urine pH:</span>
                  <span className={`font-mono font-bold ${params.labs.urinePh >= 7.5 ? 'text-teal-400' : 'text-rose-400'}`}>
                    {params.labs.urinePh} (Target: 7.5 to 8.0)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Arterial pH:</span>
                  <span className="font-mono text-white">{params.labs.arterialPh} (Target: 7.50 to 7.55)</span>
                </div>
              </div>

              <button
                onClick={handleAdministerBicarbonate}
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-amber-600/20"
              >
                Infuse Sodium Bicarbonate (150 mEq D5W)
              </button>
            </div>
          </div>
        )}

        {activeTab === 'antidotes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Quick Antidote Administration Deck */}
            <div className="lg:col-span-6 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Pill className="w-4 h-4 text-rose-400" />
                Emergency Antidote Administration Deck
              </h3>

              {/* Naloxone */}
              <div className="p-3 bg-slate-950 rounded-xl border border-rose-900/40 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-rose-400">Naloxone (Narcan) Titration</div>
                  <p className="text-[11px] text-slate-400">Start 0.04-0.4 mg IV. Target RR 12-16, not full arousal.</p>
                </div>
                <button
                  onClick={handleAdministerNaloxone}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold whitespace-nowrap transition"
                >
                  Give Naloxone 0.4mg
                </button>
              </div>

              {/* Atropine + 2-PAM */}
              <div className="p-3 bg-slate-950 rounded-xl border border-sky-900/40 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-sky-400">Atropine 2-5mg IV + Pralidoxime 2g</div>
                  <p className="text-[11px] text-slate-400">Titrate to dry bronchorrhea. Reactivates aged AChE.</p>
                </div>
                <button
                  onClick={handleAdministerAtropine}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold whitespace-nowrap transition"
                >
                  Give Atropine 2mg
                </button>
              </div>

              {/* High-Dose Insulin (HIET) */}
              <div className="p-3 bg-slate-950 rounded-xl border border-amber-900/40 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-amber-400">High-Dose Insulin Euglycemia (HIET)</div>
                  <p className="text-[11px] text-slate-400">1 unit/kg bolus + 1-10 u/kg/hr infusion with D10W/D50W.</p>
                </div>
                <span className="text-xs font-bold text-amber-300 px-2 py-1 bg-slate-900 rounded border border-slate-700">
                  Standby
                </span>
              </div>
            </div>

            {/* Right: Critical Care Tox Guidance */}
            <div className="lg:col-span-6 bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Evidence-Based Toxicology Guidance
              </h3>

              <div className="p-4 bg-slate-950 rounded-xl border border-rose-500/30 text-xs leading-relaxed space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                    Definitive Antidote Protocol
                  </span>
                  <p className="text-slate-200">{state.antidoteProtocolSummary}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                    ICU Surveillance &amp; Triage
                  </span>
                  <p className="text-slate-300">{state.criticalCareGuidance}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
