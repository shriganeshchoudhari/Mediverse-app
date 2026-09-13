"use client";

import React, { useState, useMemo } from 'react';
import {
  Dna,
  Pill,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  Info,
  Sliders,
  RotateCcw,
  Sparkles,
  BookOpen,
  Table,
  Zap,
  Activity,
  Heart,
  Scale
} from 'lucide-react';
import {
  CLINICAL_PGX_PRESETS,
  CYP2D6_ALLELES,
  CYP2C19_ALLELES,
  CYP2C9_ALLELES,
  DPYD_ALLELES,
  SLCO1B1_ALLELES,
  PatientPgxProfile,
  GeneDiplotype,
  MetabolizerStatus,
  translateCyp2d6Diplotype,
  translateCyp2c19Diplotype,
  translateDpydDiplotype,
  translateSlco1b1Diplotype,
  calculateIwpcWarfarinDose,
  evaluateCpicGuideline
} from '../../.gemini/skills/PharmacogenomicsCpicEngine';

export default function PharmacogenomicsCpicSimulator() {
  const presets = CLINICAL_PGX_PRESETS;
  const [selectedPresetId, setSelectedPresetId] = useState<string>(presets[0].id);

  // Active patient profile state initialized from preset
  const [activeProfile, setActiveProfile] = useState<PatientPgxProfile>(presets[0]);
  const [targetDrug, setTargetDrug] = useState<string>(presets[0].targetDrug);
  const [activeTab, setActiveTab] = useState<'station' | 'cpic-matrix' | 'mechanisms'>('station');

  // When preset changes
  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
    const p = presets.find(item => item.id === presetId);
    if (p) {
      setActiveProfile(JSON.parse(JSON.stringify(p)));
      setTargetDrug(p.targetDrug);
    }
  };

  // Gene allele mutation helpers
  const handleCyp2d6Change = (mat: string, pat: string) => {
    const updatedDip = translateCyp2d6Diplotype(mat, pat);
    setActiveProfile(prev => ({
      ...prev,
      diplotypes: { ...prev.diplotypes, CYP2D6: updatedDip }
    }));
  };

  const handleCyp2c19Change = (mat: string, pat: string) => {
    const updatedDip = translateCyp2c19Diplotype(mat, pat);
    setActiveProfile(prev => ({
      ...prev,
      diplotypes: { ...prev.diplotypes, CYP2C19: updatedDip }
    }));
  };

  const handleDpydChange = (mat: string, pat: string) => {
    const updatedDip = translateDpydDiplotype(mat, pat);
    setActiveProfile(prev => ({
      ...prev,
      diplotypes: { ...prev.diplotypes, DPYD: updatedDip }
    }));
  };

  const handleSlco1b1Change = (mat: string, pat: string) => {
    const updatedDip = translateSlco1b1Diplotype(mat, pat);
    setActiveProfile(prev => ({
      ...prev,
      diplotypes: { ...prev.diplotypes, SLCO1B1: updatedDip }
    }));
  };

  // Evaluate guideline recommendation
  const cpicRec = useMemo(
    () => evaluateCpicGuideline(targetDrug, activeProfile),
    [targetDrug, activeProfile]
  );

  // IWPC Warfarin calculation
  const iwpcDose = useMemo(
    () => calculateIwpcWarfarinDose(activeProfile),
    [activeProfile]
  );

  // Helper for phenotype badge color
  const getPhenotypeColor = (phenotype: MetabolizerStatus) => {
    switch (phenotype) {
      case 'PM':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'IM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'NM':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'RM':
      case 'UM':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5">
                <Dna className="w-3.5 h-3.5" />
                Track C4 &bull; Precision Medicine &amp; Clinical Pharmacogenomics
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                CPIC Level A/B Standards
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                IWPC Dosing Algorithm
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Clinical Pharmacogenomics (PGx) &amp; CPIC Precision Drug Dosing Station
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              Precision clinical pharmacology platform for star-allele Cytochrome P450, transporter, and HLA genotyping.
              Translate diplotypes into metabolic phenotypes (PM, IM, NM, RM, UM), calculate IWPC warfarin pharmacogenetic
              doses, prevent fatal prodrug toxicity (Codeine, 5-FU, Abacavir), and optimize antiplatelet therapy.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="text-center px-2">
              <div className="text-slate-400 font-mono text-[10px] uppercase">Actionability</div>
              <div className="font-bold text-emerald-400 text-sm">CPIC Level A</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-2">
              <div className="text-slate-400 font-mono text-[10px] uppercase">EHR CDS Rules</div>
              <div className="font-bold text-indigo-400 text-sm">Active &bull; Real-time</div>
            </div>
          </div>
        </div>

        {/* Clinical Preset Selection */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
            Select Clinical PGx Case Preset:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {presets.map(p => {
              const isSelected = p.id === selectedPresetId;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePresetSelect(p.id)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/70 shadow-md shadow-indigo-900/20'
                      : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-900/70 text-indigo-400">
                        {p.targetDrug.split(' ')[0]}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{p.age}yo {p.sex}</span>
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-1">{p.name.split(' - ')[0]}</div>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 line-clamp-1">{p.name.split(' - ')[1]}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab('station')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'station'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Sliders className="w-4 h-4" />
          PGx Precision Workstation &amp; CDS Alert
        </button>

        <button
          onClick={() => setActiveTab('cpic-matrix')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'cpic-matrix'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Table className="w-4 h-4" />
          CPIC Gene-Drug Guideline Matrix
        </button>

        <button
          onClick={() => setActiveTab('mechanisms')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'mechanisms'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Pharmacokinetic Mechanisms &amp; Bioactivation
        </button>
      </div>

      {/* Main Tab 1: Workstation */}
      {activeTab === 'station' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Patient Profile & Gene Panel Configuration (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Patient Demographics & Drug Selector */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-white text-sm flex items-center gap-2">
                  <Pill className="w-4 h-4 text-indigo-400" />
                  Target Pharmacotherapy &amp; Demographics
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {activeProfile.weightKg} kg &bull; {activeProfile.heightCm} cm
                </span>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1.5">Candidate Drug to Prescribe:</label>
                <select
                  value={targetDrug}
                  onChange={e => setTargetDrug(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Clopidogrel (Plavix)">Clopidogrel (Plavix) - Antiplatelet post-PCI</option>
                  <option value="Codeine">Codeine / Tramadol - Post-op Analgesia</option>
                  <option value="Warfarin (Coumadin)">Warfarin (Coumadin) - Anticoagulation</option>
                  <option value="5-Fluorouracil (5-FU)">5-Fluorouracil (5-FU) / Capecitabine - Chemotherapy</option>
                  <option value="Abacavir (Ziagen)">Abacavir (Ziagen / Triumeq) - HIV Antiretroviral</option>
                  <option value="Simvastatin (Zocor)">Simvastatin (Zocor) - Lipid Lowering</option>
                </select>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="font-semibold text-slate-200">Patient Case Summary:</div>
                <div className="text-[11px] text-slate-400 leading-relaxed">{activeProfile.clinicalContext}</div>
              </div>
            </div>

            {/* Gene Diplotype Configurator */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-white text-sm flex items-center gap-2">
                  <Dna className="w-4 h-4 text-cyan-400" />
                  Pharmacogenomics Star-Allele Panel
                </span>
                <span className="text-[11px] font-mono text-indigo-400 font-bold">Interactive Diplotypes</span>
              </div>

              {/* CYP2C19 */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">CYP2C19 (Clopidogrel, PPIs, SSRIs)</span>
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${getPhenotypeColor(activeProfile.diplotypes.CYP2C19?.phenotype || 'NM')}`}>
                    {activeProfile.diplotypes.CYP2C19?.phenotype || 'NM'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Maternal Allele:</label>
                    <select
                      value={activeProfile.diplotypes.CYP2C19?.maternalAllele || '*1'}
                      onChange={e => handleCyp2c19Change(e.target.value, activeProfile.diplotypes.CYP2C19?.paternalAllele || '*1')}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                    >
                      {Object.keys(CYP2C19_ALLELES).map(k => (
                        <option key={`c19-m-${k}`} value={k}>{k}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Paternal Allele:</label>
                    <select
                      value={activeProfile.diplotypes.CYP2C19?.paternalAllele || '*1'}
                      onChange={e => handleCyp2c19Change(activeProfile.diplotypes.CYP2C19?.maternalAllele || '*1', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                    >
                      {Object.keys(CYP2C19_ALLELES).map(k => (
                        <option key={`c19-p-${k}`} value={k}>{k}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400">
                  {activeProfile.diplotypes.CYP2C19?.phenotypeDescription}
                </div>
              </div>

              {/* CYP2D6 */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">CYP2D6 (Codeine, Tamoxifen, TCAs)</span>
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${getPhenotypeColor(activeProfile.diplotypes.CYP2D6?.phenotype || 'NM')}`}>
                    {activeProfile.diplotypes.CYP2D6?.phenotype || 'NM'} (AS {activeProfile.diplotypes.CYP2D6?.activityScore?.toFixed(2)})
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Maternal Allele:</label>
                    <select
                      value={activeProfile.diplotypes.CYP2D6?.maternalAllele || '*1'}
                      onChange={e => handleCyp2d6Change(e.target.value, activeProfile.diplotypes.CYP2D6?.paternalAllele || '*1')}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                    >
                      {Object.keys(CYP2D6_ALLELES).map(k => (
                        <option key={`c2d6-m-${k}`} value={k}>{k}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Paternal Allele:</label>
                    <select
                      value={activeProfile.diplotypes.CYP2D6?.paternalAllele || '*1'}
                      onChange={e => handleCyp2d6Change(activeProfile.diplotypes.CYP2D6?.maternalAllele || '*1', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                    >
                      {Object.keys(CYP2D6_ALLELES).map(k => (
                        <option key={`c2d6-p-${k}`} value={k}>{k}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400">
                  {activeProfile.diplotypes.CYP2D6?.phenotypeDescription}
                </div>
              </div>

              {/* DPYD */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">DPYD (5-FU, Capecitabine)</span>
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${getPhenotypeColor(activeProfile.diplotypes.DPYD?.phenotype || 'NM')}`}>
                    {activeProfile.diplotypes.DPYD?.phenotype || 'NM'} (AS {activeProfile.diplotypes.DPYD?.activityScore?.toFixed(1)})
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Maternal Allele:</label>
                    <select
                      value={activeProfile.diplotypes.DPYD?.maternalAllele || '*1'}
                      onChange={e => handleDpydChange(e.target.value, activeProfile.diplotypes.DPYD?.paternalAllele || '*1')}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                    >
                      {Object.keys(DPYD_ALLELES).map(k => (
                        <option key={`dpyd-m-${k}`} value={k}>{k}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Paternal Allele:</label>
                    <select
                      value={activeProfile.diplotypes.DPYD?.paternalAllele || '*1'}
                      onChange={e => handleDpydChange(activeProfile.diplotypes.DPYD?.maternalAllele || '*1', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                    >
                      {Object.keys(DPYD_ALLELES).map(k => (
                        <option key={`dpyd-p-${k}`} value={k}>{k}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400">
                  {activeProfile.diplotypes.DPYD?.phenotypeDescription}
                </div>
              </div>

              {/* VKORC1 & HLA Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 block">VKORC1 (-1639G&gt;A):</label>
                  <select
                    value={activeProfile.vkorc1Genotype}
                    onChange={e => setActiveProfile(prev => ({ ...prev, vkorc1Genotype: e.target.value as any }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                  >
                    <option value="G/G">G/G (Normal sensitivity)</option>
                    <option value="G/A">G/A (Intermediate sensitivity)</option>
                    <option value="A/A">A/A (High sensitivity)</option>
                  </select>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 block">HLA-B*57:01 (Abacavir):</label>
                  <button
                    onClick={() => setActiveProfile(prev => ({
                      ...prev,
                      hlaTyping: { ...prev.hlaTyping, hlaB5701: !prev.hlaTyping.hlaB5701 }
                    }))}
                    className={`w-full py-1 px-2 rounded text-xs font-bold transition border ${
                      activeProfile.hlaTyping.hlaB5701
                        ? 'bg-rose-600 border-rose-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    {activeProfile.hlaTyping.hlaB5701 ? 'POSITIVE (High HSR Risk)' : 'NEGATIVE (Safe)'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clinical Decision Support Alert & Computational Dosing (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* CDS Alert Banner */}
            <div
              className={`rounded-2xl p-6 border shadow-xl relative overflow-hidden backdrop-blur-md transition ${
                cpicRec.recommendationSummary.includes('CONTRAINDICATED') || cpicRec.recommendationSummary.includes('Avoid')
                  ? 'bg-rose-950/40 border-rose-500/80 shadow-rose-900/30'
                  : cpicRec.recommendationSummary.includes('Reduce') || cpicRec.recommendationSummary.includes('lower')
                  ? 'bg-amber-950/40 border-amber-500/80 shadow-amber-900/30'
                  : 'bg-emerald-950/40 border-emerald-500/80 shadow-emerald-900/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 mt-1">
                  {cpicRec.recommendationSummary.includes('CONTRAINDICATED') || cpicRec.recommendationSummary.includes('Avoid') ? (
                    <ShieldAlert className="w-7 h-7 text-rose-400 animate-pulse" />
                  ) : cpicRec.recommendationSummary.includes('Reduce') || cpicRec.recommendationSummary.includes('lower') ? (
                    <AlertTriangle className="w-7 h-7 text-amber-400" />
                  ) : (
                    <ShieldCheck className="w-7 h-7 text-emerald-400" />
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Clinical Decision Support &bull; {cpicRec.therapeuticArea}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-900 border border-slate-700 text-indigo-300">
                      CPIC Level {cpicRec.cpicLevel}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {cpicRec.drugName} &mdash; {cpicRec.implicatedGene}
                  </h3>

                  <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                    {cpicRec.recommendationSummary}
                  </p>
                </div>
              </div>

              {/* Specific Dosing Comparison */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-slate-800/80 text-xs">
                <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-medium">Standard Empiric Dosing:</span>
                  <div className="font-semibold text-slate-200">{cpicRec.standardDosing}</div>
                </div>
                <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-indigo-400 font-medium">PGx-Guided Adjusted Dosing:</span>
                  <div className="font-bold text-white">{cpicRec.adjustedDosing}</div>
                </div>
              </div>

              {/* Pathophysiologic Risk */}
              <div className="mt-3 p-3 bg-slate-900/70 rounded-xl border border-slate-800 text-xs space-y-1">
                <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Risk of Standard Unadjusted Therapy:
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {cpicRec.riskOfStandardTherapy}
                </p>
              </div>

              {/* Recommended Alternatives */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 flex-wrap text-xs">
                <span className="text-slate-400 font-medium">Recommended Safe Alternatives:</span>
                {cpicRec.alternativeMedications.map((alt, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-semibold text-[11px]"
                  >
                    {alt}
                  </span>
                ))}
              </div>
            </div>

            {/* Specialized Computational Section (IWPC Warfarin or Drug Kinetics) */}
            {targetDrug.includes('Warfarin') ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-bold text-white text-sm flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-400" />
                    IWPC Warfarin Pharmacogenetic Dosing Model
                  </span>
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    Target INR 2.0 &ndash; 3.0
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Predicted Daily Dose</div>
                    <div className="text-2xl font-bold font-mono text-white mt-1">
                      {iwpcDose.predictedDailyDoseMg} <span className="text-xs font-normal text-slate-400">mg/day</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Predicted Weekly Dose</div>
                    <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                      {iwpcDose.predictedWeeklyDoseMg} <span className="text-xs font-normal text-slate-400">mg/wk</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Dose Reduction vs Standard</div>
                    <div className={`text-2xl font-bold font-mono mt-1 ${iwpcDose.percentReductionFromStandard > 30 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {iwpcDose.percentReductionFromStandard > 0 ? `-${iwpcDose.percentReductionFromStandard}%` : 'Standard'}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="text-[11px] font-semibold text-slate-300">Model Covariates &amp; Pharmacogenetics:</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{iwpcDose.rationale}</p>
                </div>
              </div>
            ) : targetDrug.includes('Clopidogrel') ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-bold text-white text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    P2Y12 Platelet Inhibition &amp; Stent Thrombosis Model
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-bold">CYP2C19 Bioactivation</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Active Thiol Metabolite Exposure:</span>
                      <span className="font-mono text-cyan-400 font-bold">
                        {activeProfile.diplotypes.CYP2C19?.phenotype === 'PM'
                          ? '18% (Severely Low)'
                          : activeProfile.diplotypes.CYP2C19?.phenotype === 'IM'
                          ? '48% (Subtherapeutic)'
                          : '100% (Adequate)'}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          activeProfile.diplotypes.CYP2C19?.phenotype === 'PM'
                            ? 'w-[18%] bg-rose-500'
                            : activeProfile.diplotypes.CYP2C19?.phenotype === 'IM'
                            ? 'w-[48%] bg-amber-500'
                            : 'w-[100%] bg-emerald-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">On-Treatment Platelet Reactivity (VerifyNow PRU):</span>
                      <span className="font-mono text-rose-400 font-bold">
                        {activeProfile.diplotypes.CYP2C19?.phenotype === 'PM'
                          ? '285 PRU (High Reactivity &gt; 208)'
                          : activeProfile.diplotypes.CYP2C19?.phenotype === 'IM'
                          ? '220 PRU (Borderline High)'
                          : '145 PRU (Optimal Inhibition)'}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          activeProfile.diplotypes.CYP2C19?.phenotype === 'PM'
                            ? 'w-[90%] bg-rose-500'
                            : activeProfile.diplotypes.CYP2C19?.phenotype === 'IM'
                            ? 'w-[70%] bg-amber-500'
                            : 'w-[40%] bg-emerald-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                  <strong>Clinical Pearl:</strong> Clopidogrel is an inactive prodrug requiring a two-step hepatic oxidation. CYP2C19 loss-of-function (*2, *3) directly prevents formation of the active thiol metabolite that covalently inhibits the platelet P2Y12 ADP receptor.
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-bold text-white text-sm flex items-center gap-2">
                    <Info className="w-4 h-4 text-indigo-400" />
                    CPIC Implementation &amp; Regulatory Alert Guidance
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">FDA Black Box Concordance</span>
                </div>

                <div className="text-xs text-slate-300 space-y-2">
                  <p className="leading-relaxed">
                    {cpicRec.monitoringGuidance}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    CPIC guidelines are published in peer-reviewed literature and maintained in PharmGKB. Dosing recommendations are continuously updated with rigorous systematic evidence grading.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: CPIC Gene-Drug Guideline Matrix */}
      {activeTab === 'cpic-matrix' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">CPIC Level A Gene-Drug Clinical Guideline Matrix</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Drug</th>
                  <th className="py-3 px-4">Gene</th>
                  <th className="py-3 px-4">High-Risk Phenotype</th>
                  <th className="py-3 px-4">Adverse Outcome / Failure</th>
                  <th className="py-3 px-4">CPIC Actionable Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-bold text-white">Clopidogrel</td>
                  <td className="py-2.5 px-4 font-mono text-cyan-400">CYP2C19</td>
                  <td className="py-2.5 px-4 text-rose-400 font-semibold">PM / IM (*2, *3)</td>
                  <td className="py-2.5 px-4">Subtherapeutic platelet inhibition, in-stent thrombosis, death</td>
                  <td className="py-2.5 px-4 text-emerald-400">Switch to Ticagrelor or Prasugrel</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-bold text-white">Codeine / Tramadol</td>
                  <td className="py-2.5 px-4 font-mono text-cyan-400">CYP2D6</td>
                  <td className="py-2.5 px-4 text-purple-400 font-semibold">UM (duplications)</td>
                  <td className="py-2.5 px-4">Rapid morphine surge, fatal respiratory arrest, apnea</td>
                  <td className="py-2.5 px-4 text-rose-400">CONTRAINDICATED; avoid prodrug opioids</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-bold text-white">Warfarin</td>
                  <td className="py-2.5 px-4 font-mono text-cyan-400">CYP2C9 &amp; VKORC1</td>
                  <td className="py-2.5 px-4 text-amber-400 font-semibold">*3/*3 + A/A</td>
                  <td className="py-2.5 px-4">Extreme bleeding hazard, delayed clearance, intracranial hemorrhage</td>
                  <td className="py-2.5 px-4 text-emerald-400">IWPC algorithm guided micro-dosing (1-2 mg/d) or DOAC</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-bold text-white">5-Fluorouracil / Capecitabine</td>
                  <td className="py-2.5 px-4 font-mono text-cyan-400">DPYD</td>
                  <td className="py-2.5 px-4 text-rose-400 font-semibold">PM (AS 0 - 0.5)</td>
                  <td className="py-2.5 px-4">Catastrophic neutropenic sepsis, fatal mucositis, neurotoxicity</td>
                  <td className="py-2.5 px-4 text-rose-400">CONTRAINDICATED (or 50% reduction for IM)</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-bold text-white">Abacavir</td>
                  <td className="py-2.5 px-4 font-mono text-cyan-400">HLA-B*57:01</td>
                  <td className="py-2.5 px-4 text-rose-400 font-semibold">Positive allele</td>
                  <td className="py-2.5 px-4">Fatal multiorgan immunological hypersensitivity reaction</td>
                  <td className="py-2.5 px-4 text-rose-400">CONTRAINDICATED; switch to Tenofovir (TAF/TDF)</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-bold text-white">Simvastatin</td>
                  <td className="py-2.5 px-4 font-mono text-cyan-400">SLCO1B1</td>
                  <td className="py-2.5 px-4 text-amber-400 font-semibold">*5/*5 (Poor uptake)</td>
                  <td className="py-2.5 px-4">Statin plasma accumulation, severe myopathy, rhabdomyolysis</td>
                  <td className="py-2.5 px-4 text-emerald-400">Dose cap &le; 20 mg or switch to Rosuvastatin / Pravastatin</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Mechanisms */}
      {activeTab === 'mechanisms' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Pharmacogenomic Biochemical Mechanisms &amp; Pathways</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Phase I CYP450 Monooxygenases:</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cytochrome P450 enzymes (CYP2D6, CYP2C19, CYP2C9) mediate oxidative drug bioactivation or elimination. Unlike active drugs where poor metabolizers experience toxic accumulation, prodrugs (e.g. Clopidogrel, Codeine, Tamoxifen) require enzymatic bioactivation to generate the active therapeutic molecule. PM status causes profound lack of clinical efficacy.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">Dihydropyrimidine Dehydrogenase (DPYD):</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                DPD metabolizes &gt;80% of administered 5-fluorouracil into inactive dihydrofluorouracil (DHFU). Loss-of-function variants (such as the non-functional *2A splice mutation) cause severe prolonged exposure to cytotoxic fluorouridine nucleotides, provoking catastrophic mucosal destruction, severe enterocolitis, and bone marrow aplasia.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
