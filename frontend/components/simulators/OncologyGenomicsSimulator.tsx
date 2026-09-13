'use client';

import React, { useState, useMemo } from 'react';
import {
  Dna,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Layers,
  TrendingUp,
  FlaskConical,
  Award,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sliders,
} from 'lucide-react';
import {
  SomaticVariant,
  TumorImmunogenomics,
  OncologyPatientCase,
  ONCOLOGY_CASES,
  calculateVaf,
  assessClonality,
  evaluateImmunogenomics,
  simulateClonalEvolution,
} from '../../.gemini/skills/OncologyGenomicsEngine';

export default function OncologyGenomicsSimulator() {
  // Case selection
  const [selectedCaseId, setSelectedCaseId] = useState<string>(ONCOLOGY_CASES[0].id);
  const currentCase = useMemo(() => {
    return ONCOLOGY_CASES.find((c) => c.id === selectedCaseId) || ONCOLOGY_CASES[0];
  }, [selectedCaseId]);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'variants' | 'evolution' | 'immunogenomics' | 'mtb' | 'guidelines'>('variants');

  // Interactive tumor cellularity / purity slider
  const [tumorPurity, setTumorPurity] = useState<number>(currentCase.tumorCellularityPercent);

  // Selected variant for deep dive modal / panel
  const [selectedVariantId, setSelectedVariantId] = useState<string>(currentCase.variants[0]?.id || '');
  const selectedVariant = useMemo(() => {
    return currentCase.variants.find((v) => v.id === selectedVariantId) || currentCase.variants[0];
  }, [currentCase, selectedVariantId]);

  // Clonal evolution simulator parameters
  const [therapyChoice, setTherapyChoice] = useState<'1st-Gen TKI (Erlotinib)' | '3rd-Gen TKI (Osimertinib)' | 'Targeted + Monoclonal (Amivantamab + Lazertinib)' | 'Untreated'>('3rd-Gen TKI (Osimertinib)');
  const [evolutionMonths, setEvolutionMonths] = useState<number>(18);

  // Dynamic clonal evolution data
  const clonalData = useMemo(() => {
    const driver = currentCase.variants.find((v) => v.clinicalImpact === 'Activating Driver')?.vafPercent || 30.0;
    const resistant = currentCase.variants.find((v) => v.clinicalImpact === 'Secondary Resistance')?.vafPercent || 2.0;
    return simulateClonalEvolution(tumorPurity, driver, resistant, evolutionMonths, therapyChoice);
  }, [tumorPurity, currentCase, evolutionMonths, therapyChoice]);

  // When changing case
  const handleCaseChange = (id: string) => {
    setSelectedCaseId(id);
    const newCase = ONCOLOGY_CASES.find((c) => c.id === id);
    if (newCase) {
      setTumorPurity(newCase.tumorCellularityPercent);
      setSelectedVariantId(newCase.variants[0]?.id || '');
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Track C9 • Molecular Oncology &amp; Precision Genomics
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Dna className="w-3 h-3" /> Somatic NGS Engine Active
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Clinical Genomics, Somatic Oncology NGS &amp; Precision Targeted Therapy Workstation
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
              Analyze next-generation sequencing (NGS) gene panels, deconvolve Variant Allele Fractions (VAF %), 
              apply AMP/ASCO/CAP 4-tier actionability, and model targeted TKI clonal resistance dynamics.
            </p>
          </div>

          {/* Patient Case Preset Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label htmlFor="case-select" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Clinical Case:
            </label>
            <select
              id="case-select"
              aria-label="Select Clinical Oncology Case"
              value={selectedCaseId}
              onChange={(e) => handleCaseChange(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              {ONCOLOGY_CASES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.patientName} — {c.tumorType}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Demographic & Pathological Banner */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 block font-medium">Histology &amp; Markers</span>
            <span className="text-slate-200 font-semibold">{currentCase.histology}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 block font-medium">Stage &amp; Extent</span>
            <span className="text-rose-400 font-semibold">{currentCase.stage}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 block font-medium">Smoking History</span>
            <span className="text-slate-300 font-semibold">{currentCase.smokingStatus}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 block font-medium">Biopsy Specimen</span>
            <span className="text-indigo-400 font-semibold">{currentCase.biopsySite}</span>
          </div>
        </div>
      </div>

      {/* KPI Bar: Tumor Cellularity, Dominant Driver, TMB, MSI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Tumor Cellularity (Purity) Control */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
              <span>Tumor Cellularity (Purity)</span>
              <span className="text-indigo-400 font-bold text-sm">{tumorPurity}%</span>
            </div>
            <input
              type="range"
              aria-label="Tumor Cellularity Slider"
              min={20}
              max={95}
              step={5}
              value={tumorPurity}
              onChange={(e) => setTumorPurity(parseInt(e.target.value))}
              className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer my-2"
            />
          </div>
          <span className="text-[11px] text-slate-500 pt-1 border-t border-slate-800/60 block">
            Expected Clonal VAF: ~{(tumorPurity / 2).toFixed(1)}%
          </span>
        </div>

        {/* Primary Oncogenic Driver */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">Primary Driver Mutation</span>
            <span className="text-lg font-black text-rose-400">
              {currentCase.variants[0]?.gene} {currentCase.variants[0]?.hgvsProtein}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
            <span>VAF: <strong className="text-white">{currentCase.variants[0]?.vafPercent}%</strong></span>
            <span className="mx-1">•</span>
            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">
              {currentCase.variants[0]?.ampTier.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* TMB & MSI Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">Immunogenomic Status</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">TMB: {currentCase.immunogenomics.tmbMutMb} mut/Mb</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                currentCase.immunogenomics.tmbMutMb >= 10
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {currentCase.immunogenomics.tmbMutMb >= 10 ? 'TMB-H' : 'TMB-L'}
              </span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 block">
            {currentCase.immunogenomics.msiStatus}
          </span>
        </div>

        {/* PD-L1 TPS Expression */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">PD-L1 Expression (TPS)</span>
            <span className="text-2xl font-black text-indigo-400">
              {currentCase.immunogenomics.pdl1TpsPercent}%
            </span>
          </div>
          <span className="text-[11px] text-slate-500 pt-2 border-t border-slate-800/60 block">
            Category: {currentCase.immunogenomics.pdl1Category}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 space-x-2">
        <button
          onClick={() => setActiveTab('variants')}
          className={`pb-3 px-4 text-xs font-semibold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'variants'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Dna className="w-4 h-4" /> Somatic NGS Gene Panel
        </button>
        <button
          onClick={() => setActiveTab('evolution')}
          className={`pb-3 px-4 text-xs font-semibold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'evolution'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Clonal Resistance Evolution
        </button>
        <button
          onClick={() => setActiveTab('immunogenomics')}
          className={`pb-3 px-4 text-xs font-semibold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'immunogenomics'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Immunogenomics &amp; Checkpoint Blockade
        </button>
        <button
          onClick={() => setActiveTab('mtb')}
          className={`pb-3 px-4 text-xs font-semibold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'mtb'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" /> Molecular Tumor Board (MTB) Matches
        </button>
        <button
          onClick={() => setActiveTab('guidelines')}
          className={`pb-3 px-4 text-xs font-semibold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'guidelines'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Info className="w-4 h-4" /> AMP/ASCO/CAP Guidelines
        </button>
      </div>

      {/* TAB 1: Somatic NGS Gene Panel */}
      {activeTab === 'variants' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Targeted Next-Generation Sequencing Panel Results</h3>
                <p className="text-xs text-slate-400">
                  Comprehensive hybrid-capture genomic profiling (500-gene panel, average coverage depth 1,500×).
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {currentCase.variants.length} Genomic Alterations Identified
              </span>
            </div>

            {/* Variants Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/40">
                    <th className="p-3">Gene</th>
                    <th className="p-3">Alteration (HGVS)</th>
                    <th className="p-3">Exon</th>
                    <th className="p-3">Depth (Total / Alt)</th>
                    <th className="p-3">VAF (%)</th>
                    <th className="p-3">Clonality</th>
                    <th className="p-3">AMP Tier</th>
                    <th className="p-3">Clinical Impact</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {currentCase.variants.map((v) => {
                    const clonality = assessClonality(v.vafPercent, tumorPurity);
                    return (
                      <tr
                        key={v.id}
                        className={`hover:bg-slate-800/40 transition cursor-pointer ${
                          selectedVariantId === v.id ? 'bg-indigo-950/30' : ''
                        }`}
                        onClick={() => setSelectedVariantId(v.id)}
                      >
                        <td className="p-3 font-bold text-white">{v.gene}</td>
                        <td className="p-3 font-mono text-indigo-300">
                          {v.hgvsProtein}
                          <span className="block text-[10px] text-slate-500 font-normal">{v.hgvsCoding}</span>
                        </td>
                        <td className="p-3 text-slate-300">{v.exon}</td>
                        <td className="p-3 text-slate-300 font-mono">
                          {v.readDepth}× <span className="text-slate-500">({v.altDepth} alt)</span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white w-10">{v.vafPercent}%</span>
                            <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  v.vafPercent >= 20 ? 'bg-rose-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${Math.min(v.vafPercent * 2, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          {clonality.isSubclonal ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              Subclonal ({(clonality.clonalFraction * 100).toFixed(0)}%)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                              Clonal (Truncal)
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                            {v.ampTier.split(' ')[0]} ({v.evidenceLevel})
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`text-[11px] font-medium ${
                            v.clinicalImpact === 'Activating Driver'
                              ? 'text-rose-400 font-bold'
                              : v.clinicalImpact === 'Secondary Resistance'
                              ? 'text-amber-400 font-bold'
                              : 'text-slate-300'
                          }`}>
                            {v.clinicalImpact}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVariantId(v.id);
                              setActiveTab('mtb');
                            }}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition"
                          >
                            View MTB
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Variant Detail Inspector */}
          {selectedVariant && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Dna className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Variant Inspector: {selectedVariant.gene} {selectedVariant.hgvsProtein}
                    </h4>
                    <span className="text-xs text-slate-400">Transcript: {selectedVariant.transcript}</span>
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-300 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                  {selectedVariant.ampTier}
                </span>
              </div>

              {selectedVariant.resistanceMechanism && (
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold mb-0.5">Known Resistance Mechanism:</strong>
                    {selectedVariant.resistanceMechanism}
                  </div>
                </div>
              )}

              {/* Matched Therapies Carousel */}
              <div>
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Matched Targeted Therapies ({selectedVariant.targetedTherapies.length})
                </h5>
                {selectedVariant.targetedTherapies.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedVariant.targetedTherapies.map((tx, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{tx.drugName}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {tx.recommendation}
                          </span>
                        </div>
                        <span className="text-slate-400 block">{tx.drugClass}</span>
                        <p className="text-slate-400 text-[11px] leading-relaxed pt-1 border-t border-slate-900">
                          {tx.clinicalNotes}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No directly targeted FDA-approved therapies for this alteration in this disease indication. Standard of care chemo-immunotherapy or clinical trials recommended.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Clonal Resistance Evolution */}
      {activeTab === 'evolution' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Clonal Architecture &amp; Acquired Resistance Simulation</h3>
              <p className="text-xs text-slate-400">
                Model therapeutic selective pressure: sensitive driver clone reduction vs subclonal emergence of gatekeeper resistant mutations over time.
              </p>
            </div>

            {/* Therapy Choice Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Therapeutic Regimen:</span>
              <select
                aria-label="Select Targeted Regimen"
                value={therapyChoice}
                onChange={(e) => setTherapyChoice(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
              >
                <option value="1st-Gen TKI (Erlotinib)">1st-Gen TKI (Erlotinib)</option>
                <option value="3rd-Gen TKI (Osimertinib)">3rd-Gen TKI (Osimertinib)</option>
                <option value="Targeted + Monoclonal (Amivantamab + Lazertinib)">
                  Bispecific mAb + TKI (Amivantamab + Lazertinib)
                </option>
                <option value="Untreated">Untreated Natural History</option>
              </select>
            </div>
          </div>

          {/* Timeline Slider */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Duration of Targeted Therapy</span>
              <span className="font-bold text-indigo-400">{evolutionMonths} Months</span>
            </div>
            <input
              type="range"
              aria-label="Therapy Duration Slider"
              min={6}
              max={24}
              step={2}
              value={evolutionMonths}
              onChange={(e) => setEvolutionMonths(parseInt(e.target.value))}
              className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Clonal Kinetics Visualization (SVG Graph) */}
          <div className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
            <div className="flex items-center justify-center gap-6 text-xs mb-2">
              <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                Sensitive Driver Clone VAF (EGFR L858R)
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                Resistant Subclone VAF (T790M / C797S)
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <span className="w-3 h-3 rounded-full bg-cyan-500" />
                Tumor Volume (cm³)
              </span>
            </div>

            <svg viewBox="0 0 600 240" className="w-full max-w-2xl h-auto select-none">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="40" y2="200" stroke="#334155" strokeWidth="1.5" />
              <line x1="40" y1="200" x2="560" y2="200" stroke="#334155" strokeWidth="1.5" />

              {/* Y Ticks */}
              {[0, 10, 20, 30, 40, 50].map((yVal) => {
                const y = 200 - (yVal / 50) * 180;
                return (
                  <g key={yVal}>
                    <line x1="35" y1={y} x2="40" y2={y} stroke="#64748b" />
                    <text x="30" y={y + 3} fill="#64748b" fontSize="8" textAnchor="end">
                      {yVal}%
                    </text>
                  </g>
                );
              })}

              {/* X Axis Months */}
              {clonalData.months.map((m, i) => {
                const x = 40 + (i / (clonalData.months.length - 1)) * 520;
                return (
                  <g key={m}>
                    <line x1={x} y1="200" x2={x} y2="205" stroke="#64748b" />
                    <text x={x} y="216" fill="#64748b" fontSize="8" textAnchor="middle">
                      {m}m
                    </text>
                  </g>
                );
              })}

              {/* Driver Clone Line (Rose) */}
              <polyline
                fill="none"
                stroke="#f43f5e"
                strokeWidth="3"
                points={clonalData.months
                  .map((m, i) => {
                    const x = 40 + (i / (clonalData.months.length - 1)) * 520;
                    const y = 200 - (clonalData.driverClonePct[i] / 50) * 180;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />

              {/* Resistant Subclone Line (Amber) */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                points={clonalData.months
                  .map((m, i) => {
                    const x = 40 + (i / (clonalData.months.length - 1)) * 520;
                    const y = 200 - (clonalData.resistantClonePct[i] / 50) * 180;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />

              {/* Tumor Volume Proxy Line (Cyan dashed) */}
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeDasharray="4 3"
                points={clonalData.months
                  .map((m, i) => {
                    const x = 40 + (i / (clonalData.months.length - 1)) * 520;
                    const y = 200 - (clonalData.totalTumorVolumeCm3[i] / 30) * 180;
                    return `${x},${Math.max(y, 20)}`;
                  })
                  .join(' ')}
              />
            </svg>
          </div>

          {/* Clonal Kinetics Clinical Commentary */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-white block mb-1">Clonal Evolution Commentary:</strong>
            {therapyChoice === '1st-Gen TKI (Erlotinib)' ? (
              <span>
                Under 1st-generation TKI pressure, the sensitizing L858R clone undergoes dramatic initial regression. However, the pre-existing
                rare subclone harboring the steric gatekeeper <strong>T790M</strong> mutation gains a competitive evolutionary advantage.
                By month 10-12, the T790M clone becomes dominant, causing radiologic progression and acquired drug resistance.
              </span>
            ) : therapyChoice === '3rd-Gen TKI (Osimertinib)' ? (
              <span>
                3rd-generation Osimertinib irreversibly inhibits both L858R and T790M gatekeeper clones, driving deep and prolonged responses.
                Resistance typically emerges later (months 14-18) via tertiary <strong>C797S</strong> mutations (which prevent covalent bond formation)
                or bypass pathway activation (MET amplification, HER2 amplification, or small cell transformation).
              </span>
            ) : therapyChoice === 'Targeted + Monoclonal (Amivantamab + Lazertinib)' ? (
              <span>
                MARIPOSA regimen: Combining the EGFR-MET bispecific antibody <strong>Amivantamab</strong> with the 3rd-generation TKI <strong>Lazertinib</strong>
                dual-targets receptor degradation, immune effector cell recruitment, and enzymatic kinase inhibition, simultaneously suppressing both
                on-target tertiary mutations and MET-driven bypass resistance.
              </span>
            ) : (
              <span>
                Without targeted pressure, polyclonal tumor expansion proceeds unimpeded with increasing tumor mutational burden and genomic instability.
              </span>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Immunogenomics & Checkpoint Blockade */}
      {activeTab === 'immunogenomics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white">Tumor Immunogenomics &amp; Biomarker Triad</h3>
            <p className="text-xs text-slate-400">
              Integrative decision support across Tumor Mutational Burden (TMB), Microsatellite Instability (MSI/dMMR), and PD-L1 expression.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* TMB Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <span className="font-bold text-indigo-400 text-sm block">1. Tumor Mutational Burden</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{currentCase.immunogenomics.tmbMutMb}</span>
                <span className="text-slate-400">mutations / Mb</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                currentCase.immunogenomics.tmbMutMb >= 10
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {currentCase.immunogenomics.tmbStatus}
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                FDA agnostic approval threshold: TMB &gt;= 10 mut/Mb (KEYNOTE-158). Generates abundant neoantigens recognizable by CD8+ cytotoxic T-lymphocytes.
              </p>
            </div>

            {/* MSI Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <span className="font-bold text-indigo-400 text-sm block">2. Microsatellite Instability</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-white">{currentCase.immunogenomics.msiStatus}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                currentCase.immunogenomics.msiStatus.includes('High')
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {currentCase.immunogenomics.msiStatus.includes('High') ? 'dMMR / Deficient Mismatch' : 'pMMR / Proficient Mismatch'}
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Loss of DNA mismatch repair proteins (MLH1, MSH2, MSH6, PMS2) yields hypermutable microsatellites and hypersensitivity to anti-PD-1 monotherapy.
              </p>
            </div>

            {/* PD-L1 Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <span className="font-bold text-indigo-400 text-sm block">3. PD-L1 Immunohistochemistry</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{currentCase.immunogenomics.pdl1TpsPercent}%</span>
                <span className="text-slate-400">TPS</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                currentCase.immunogenomics.pdl1TpsPercent >= 50
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : currentCase.immunogenomics.pdl1TpsPercent >= 1
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {currentCase.immunogenomics.pdl1Category}
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Tumor Proportion Score (22C3 / 28-8 pharmDx). Expression &gt;= 50% qualifies for frontline single-agent Pembrolizumab in metastatic NSCLC (KEYNOTE-024).
              </p>
            </div>
          </div>

          {/* Integrated Recommendation Banner */}
          <div className={`p-4 rounded-xl border ${
            currentCase.immunogenomics.immunotherapyResponse === 'Highly Favorable'
              ? 'bg-emerald-950/40 border-emerald-500/40'
              : currentCase.immunogenomics.immunotherapyResponse === 'Intermediate'
              ? 'bg-amber-950/40 border-amber-500/40'
              : 'bg-rose-950/40 border-rose-500/40'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                {currentCase.immunogenomics.immunotherapyResponse === 'Highly Favorable' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
                Immunotherapy Likelihood: {currentCase.immunogenomics.immunotherapyResponse}
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentCase.immunogenomics.immunotherapyRationale}
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: Molecular Tumor Board Matches */}
      {activeTab === 'mtb' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Molecular Tumor Board (MTB) Precision Action Plan</h3>
              <p className="text-xs text-slate-400">
                Evidence-based matchmaking aligning genomic variants with NCCN guidelines, FDA companion diagnostics, and clinical trial cohorts.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {currentCase.variants.map((v) => (
              <div key={v.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-white">{v.gene} {v.hgvsProtein}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      {v.ampTier}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    VAF: <strong className="text-white">{v.vafPercent}%</strong> ({v.altDepth}/{v.readDepth} reads)
                  </span>
                </div>

                {v.targetedTherapies.length > 0 ? (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Targeted Therapy Matches:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {v.targetedTherapies.map((tx, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{tx.drugName}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {tx.recommendation}
                            </span>
                          </div>
                          <span className="text-slate-400 text-[11px] block mt-0.5">{tx.drugClass}</span>
                          <p className="text-slate-300 text-[11px] mt-1.5 leading-relaxed">
                            {tx.clinicalNotes}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Non-targetable tumor suppressor mutation ({v.clinicalImpact}). Prognostic indicator; no direct small molecule inhibitor available.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AMP/ASCO/CAP Guidelines */}
      {activeTab === 'guidelines' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
          <h3 className="text-base font-bold text-white">AMP/ASCO/CAP Somatic Variant Classification Standards</h3>
          <p className="text-slate-400">
            Joint consensus standards for the interpretation and reporting of sequence variants in cancer (Li MM et al., J Mol Diagn 2017).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 space-y-2">
              <h4 className="text-sm font-bold text-rose-400">Tier I: Strong Clinical Significance</h4>
              <p className="text-slate-300 leading-relaxed">
                Biomarkers with therapeutic, prognostic, or diagnostic value approved by regulatory agencies (FDA) or included in professional guidelines (NCCN, ASCO).
                <br /><br />
                <strong>Level A:</strong> FDA-approved companion diagnostic or professional guideline recommendation in the specific tumor type (e.g. EGFR L858R in lung).
                <br />
                <strong>Level B:</strong> Well-powered studies with consensus from multiple clinical trials.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
              <h4 className="text-sm font-bold text-amber-400">Tier II: Potential Clinical Significance</h4>
              <p className="text-slate-300 leading-relaxed">
                Biomarkers with potential clinical significance in off-label indications or clinical trials.
                <br /><br />
                <strong>Level C:</strong> FDA-approved in a different tumor type, or active clinical trial inclusion criteria.
                <br />
                <strong>Level D:</strong> Preclinical evidence (in vitro / in vivo) or multiple small case series.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-slate-300">Tier III: Unknown Clinical Significance (VUS)</h4>
              <p className="text-slate-400 leading-relaxed">
                Variants in cancer genes with unknown functional impact or conflicting data. Not actionable for clinical decision-making. Re-evaluation in 6-12 months recommended.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-slate-300">Tier IV: Benign / Likely Benign</h4>
              <p className="text-slate-400 leading-relaxed">
                Observed at significant allele frequency (&gt; 1%) in population databases (gnomAD) or validated as non-pathogenic polymorphisms. Generally omitted from clinical reports.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
