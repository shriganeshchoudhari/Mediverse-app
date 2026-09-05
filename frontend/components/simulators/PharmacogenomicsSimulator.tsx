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
  Dna,
  Pill,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  RotateCcw,
  Sliders,
  TrendingUp,
  ShieldAlert,
  Info,
  ChevronRight,
  Activity,
  Award,
} from 'lucide-react';
import {
  MetabolizerPhenotype,
  CPIC_DRUG_RULES,
  PGX_PRESETS,
  CYP2C19_ALLELES,
  CYP2D6_ALLELES,
  TPMT_ALLELES,
  DPYD_ALLELES,
  callCYP2C19Phenotype,
  callCYP2D6Phenotype,
  callTPMTPhenotype,
  callDPYDPhenotype,
  calculateIWPCWarfarinDose,
  simulateWarfarinINRKinetics,
  evaluatePatientPGxCDS,
  WarfarinPatientParameters,
} from '@/.gemini/skills/PharmacogenomicsEngine';

export default function PharmacogenomicsSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('post-pci-clopidogrel');

  // Gene allele selections
  const [cyp2c19Maternal, setCyp2c19Maternal] = useState<string>('*2');
  const [cyp2c19Paternal, setCyp2c19Paternal] = useState<string>('*2');

  const [cyp2d6Maternal, setCyp2d6Maternal] = useState<string>('*1');
  const [cyp2d6Paternal, setCyp2d6Paternal] = useState<string>('*1');

  const [tpmtMaternal, setTpmtMaternal] = useState<string>('*1');
  const [tpmtPaternal, setTpmtPaternal] = useState<string>('*1');

  const [dpydMaternal, setDpydMaternal] = useState<string>('*1');
  const [dpydPaternal, setDpydPaternal] = useState<string>('*1');

  const [hlaB5701, setHlaB5701] = useState<boolean>(false);

  // Selected drug for CDS evaluation
  const [selectedDrug, setSelectedDrug] = useState<string>('Clopidogrel');

  // Warfarin parameters
  const [warfarinAge, setWarfarinAge] = useState<number>(65);
  const [warfarinHeightCm, setWarfarinHeightCm] = useState<number>(170);
  const [warfarinWeightKg, setWarfarinWeightKg] = useState<number>(72);
  const [warfarinCyp2c9, setWarfarinCyp2c9] = useState<WarfarinPatientParameters['cyp2c9Diplotype']>('*1/*1');
  const [warfarinVkorc1, setWarfarinVkorc1] = useState<WarfarinPatientParameters['vkorc1Genotype']>('G/G');
  const [amiodaroneCoPrescribed, setAmiodaroneCoPrescribed] = useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'cds' | 'warfarin'>('cds');

  // Load preset handler
  const loadPreset = (presetId: string) => {
    const preset = PGX_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);

    setCyp2c19Maternal(preset.patientGenes.CYP2C19?.maternal || '*1');
    setCyp2c19Paternal(preset.patientGenes.CYP2C19?.paternal || '*1');

    setCyp2d6Maternal(preset.patientGenes.CYP2D6?.maternal || '*1');
    setCyp2d6Paternal(preset.patientGenes.CYP2D6?.paternal || '*1');

    setTpmtMaternal(preset.patientGenes.TPMT?.maternal || '*1');
    setTpmtPaternal(preset.patientGenes.TPMT?.paternal || '*1');

    setDpydMaternal(preset.patientGenes.DPYD?.maternal || '*1');
    setDpydPaternal(preset.patientGenes.DPYD?.paternal || '*1');

    if (presetId === 'hiv-abacavir-hla') {
      setHlaB5701(true);
      setSelectedDrug('Abacavir');
    } else {
      setHlaB5701(false);
    }

    if (presetId === 'post-pci-clopidogrel') setSelectedDrug('Clopidogrel');
    if (presetId === 'pediatric-codeine-um') setSelectedDrug('Codeine / Tramadol');
    if (presetId === 'all-thiopurine-tpmt') setSelectedDrug('Azathioprine / 6-Mercaptopurine');
    if (presetId === 'colorectal-5fu-dpyd') setSelectedDrug('Fluorouracil (5-FU)');
    if (presetId === 'warfarin-high-sensitivity') {
      setSelectedDrug('Warfarin');
      setActiveTab('warfarin');
      setWarfarinCyp2c9('*2/*3');
      setWarfarinVkorc1('A/A');
      setWarfarinAge(72);
      setWarfarinHeightCm(165);
      setWarfarinWeightKg(65);
    }
  };

  // Phenotype calling
  const cyp2c19 = useMemo(() => callCYP2C19Phenotype(cyp2c19Maternal, cyp2c19Paternal), [cyp2c19Maternal, cyp2c19Paternal]);
  const cyp2d6 = useMemo(() => callCYP2D6Phenotype(cyp2d6Maternal, cyp2d6Paternal), [cyp2d6Maternal, cyp2d6Paternal]);
  const tpmt = useMemo(() => callTPMTPhenotype(tpmtMaternal, tpmtPaternal), [tpmtMaternal, tpmtPaternal]);
  const dpyd = useMemo(() => callDPYDPhenotype(dpydMaternal, dpydPaternal), [dpydMaternal, dpydPaternal]);

  // CDS Evaluation
  const cdsResult = useMemo(() => {
    return evaluatePatientPGxCDS(selectedDrug, {
      cyp2c19,
      cyp2d6,
      tpmt,
      dpyd,
      hlaB5701Positive: hlaB5701,
    });
  }, [selectedDrug, cyp2c19, cyp2d6, tpmt, dpyd, hlaB5701]);

  // Warfarin IWPC calculation
  const warfarinResult = useMemo(() => {
    return calculateIWPCWarfarinDose({
      age: warfarinAge,
      heightCm: warfarinHeightCm,
      weightKg: warfarinWeightKg,
      cyp2c9Diplotype: warfarinCyp2c9,
      vkorc1Genotype: warfarinVkorc1,
      amiodaroneCoPrescribed,
      targetINR: 2.5,
    });
  }, [warfarinAge, warfarinHeightCm, warfarinWeightKg, warfarinCyp2c9, warfarinVkorc1, amiodaroneCoPrescribed]);

  // 14-Day INR curve
  const inrKineticCurve = useMemo(() => {
    return simulateWarfarinINRKinetics(warfarinCyp2c9, warfarinVkorc1, warfarinResult.predictedDailyDoseMg);
  }, [warfarinCyp2c9, warfarinVkorc1, warfarinResult.predictedDailyDoseMg]);

  // Socratic AI context bridge
  const handleAskAI = () => {
    const activePreset = PGX_PRESETS.find(p => p.id === selectedPresetId);
    const context = `Clinical Pharmacogenomics (PGx) Workstation Case:
Patient: ${activePreset?.patientName || 'Custom PGx Patient Profile'}
Indication: ${activePreset?.clinicalIndication || 'Precision Therapeutics Consultation'}
Selected Drug: ${selectedDrug}
Gene Diplotypes:
- CYP2C19: ${cyp2c19.maternalAllele}/${cyp2c19.paternalAllele} (${cyp2c19.phenotype}, AS ${cyp2c19.activityScore})
- CYP2D6: ${cyp2d6.maternalAllele}/${cyp2d6.paternalAllele} (${cyp2d6.phenotype}, AS ${cyp2d6.activityScore})
- TPMT: ${tpmt.maternalAllele}/${tpmt.paternalAllele} (${tpmt.phenotype}, AS ${tpmt.activityScore})
- DPYD: ${dpyd.maternalAllele}/${dpyd.paternalAllele} (${dpyd.phenotype}, AS ${dpyd.activityScore})
- HLA-B*57:01: ${hlaB5701 ? 'POSITIVE (Contraindication)' : 'Negative'}
CDS Status: ${cdsResult.safetyStatus}
Alerts Triggered: ${cdsResult.alerts.map(a => `${a.drugName}: ${a.clinicalAlert}`).join(' | ') || 'None (Safe standard dosing)'}
Warfarin IWPC Predicted Dose: ${warfarinResult.predictedDailyDoseMg} mg/day (${warfarinResult.riskCategory})
Please explain the biochemical mechanism, metabolic pathway disruption, and CPIC Level 1A guidelines for this patient.`;

    window.dispatchEvent(new CustomEvent('mediverse:open-ai-with-context', { detail: { context } }));
  };

  const getPhenotypeColor = (phenotype: MetabolizerPhenotype) => {
    switch (phenotype) {
      case 'POOR_METABOLIZER':
        return 'text-rose-400 bg-rose-950/40 border-rose-800/60';
      case 'INTERMEDIATE_METABOLIZER':
        return 'text-amber-400 bg-amber-950/40 border-amber-800/60';
      case 'NORMAL_METABOLIZER':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60';
      case 'RAPID_METABOLIZER':
        return 'text-sky-400 bg-sky-950/40 border-sky-800/60';
      case 'ULTRARAPID_METABOLIZER':
        return 'text-purple-400 bg-purple-950/40 border-purple-800/60';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Top Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
                <Dna className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                  Clinical Pharmacogenomics (PGx) Workstation
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-950/70 border border-indigo-700/60 text-indigo-300 font-medium">
                    CPIC Level 1A
                  </span>
                </h1>
                <p className="text-sm text-slate-400">
                  Star allele diplotype translation, IWPC precision warfarin algorithm & clinical decision support (CDS) alerts.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold text-sm ${
                cdsResult.safetyStatus === 'CONTRAINDICATED'
                  ? 'bg-rose-950/60 border-rose-600 text-rose-300 animate-pulse'
                  : cdsResult.safetyStatus === 'ACTION_REQUIRED'
                  ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                  : 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
              }`}
            >
              {cdsResult.safetyStatus === 'CONTRAINDICATED' && <AlertOctagon className="w-4 h-4" />}
              {cdsResult.safetyStatus === 'ACTION_REQUIRED' && <AlertTriangle className="w-4 h-4" />}
              {cdsResult.safetyStatus === 'SAFE' && <CheckCircle2 className="w-4 h-4" />}
              <span>
                {cdsResult.safetyStatus === 'CONTRAINDICATED' && 'CONTRAINDICATED'}
                {cdsResult.safetyStatus === 'ACTION_REQUIRED' && 'ACTION REQUIRED'}
                {cdsResult.safetyStatus === 'SAFE' && 'STANDARD THERAPY SAFE'}
              </span>
            </div>

            <button
              onClick={handleAskAI}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/30 text-white text-sm font-semibold flex items-center gap-2 transition shadow-lg shadow-indigo-600/20"
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
              High-Yield Clinical Presets
            </span>
            <button
              onClick={() => loadPreset('post-pci-clopidogrel')}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {PGX_PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => loadPreset(p.id)}
                className={`text-left p-2.5 rounded-xl border text-xs transition ${
                  selectedPresetId === p.id
                    ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold truncate">{p.patientName.split('(')[0]}</div>
                <div className="text-[11px] text-slate-400 truncate">{p.category}</div>
                <div className="mt-1 text-[10px] text-indigo-400 font-mono truncate">{p.prescribedDrug.split(' ')[0]}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('cds')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
            activeTab === 'cds'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/40'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Clinical Decision Support (CDS) Rules</span>
        </button>
        <button
          onClick={() => setActiveTab('warfarin')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
            activeTab === 'warfarin'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/40'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>IWPC Warfarin Dosing & 14-Day INR Kinetics</span>
        </button>
      </div>

      {/* Patient Diplotype Configurator (Common across tabs) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Dna className="w-4 h-4 text-indigo-400" />
          Patient Genomic Profile & Diplotype Selector
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CYP2C19 */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">CYP2C19</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getPhenotypeColor(cyp2c19.phenotype)}`}>
                AS: {cyp2c19.activityScore} | {cyp2c19.phenotype.replace('_METABOLIZER', '')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Maternal</label>
                <select
                  value={cyp2c19Maternal}
                  onChange={e => setCyp2c19Maternal(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs"
                >
                  {Object.keys(CYP2C19_ALLELES).map(al => (
                    <option key={al} value={al}>{al}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Paternal</label>
                <select
                  value={cyp2c19Paternal}
                  onChange={e => setCyp2c19Paternal(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs"
                >
                  {Object.keys(CYP2C19_ALLELES).map(al => (
                    <option key={al} value={al}>{al}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 line-clamp-2">{cyp2c19.phenotypeDescription}</p>
          </div>

          {/* CYP2D6 */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">CYP2D6</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getPhenotypeColor(cyp2d6.phenotype)}`}>
                AS: {cyp2d6.activityScore} | {cyp2d6.phenotype.replace('_METABOLIZER', '')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Maternal</label>
                <select
                  value={cyp2d6Maternal}
                  onChange={e => setCyp2d6Maternal(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs"
                >
                  {Object.keys(CYP2D6_ALLELES).map(al => (
                    <option key={al} value={al}>{al}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Paternal</label>
                <select
                  value={cyp2d6Paternal}
                  onChange={e => setCyp2d6Paternal(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs"
                >
                  {Object.keys(CYP2D6_ALLELES).map(al => (
                    <option key={al} value={al}>{al}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 line-clamp-2">{cyp2d6.phenotypeDescription}</p>
          </div>

          {/* TPMT */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">TPMT</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getPhenotypeColor(tpmt.phenotype)}`}>
                AS: {tpmt.activityScore} | {tpmt.phenotype.replace('_METABOLIZER', '')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Maternal</label>
                <select
                  value={tpmtMaternal}
                  onChange={e => setTpmtMaternal(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs"
                >
                  {Object.keys(TPMT_ALLELES).map(al => (
                    <option key={al} value={al}>{al}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Paternal</label>
                <select
                  value={tpmtPaternal}
                  onChange={e => setTpmtPaternal(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs"
                >
                  {Object.keys(TPMT_ALLELES).map(al => (
                    <option key={al} value={al}>{al}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 line-clamp-2">{tpmt.phenotypeDescription}</p>
          </div>

          {/* DPYD */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">DPYD</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getPhenotypeColor(dpyd.phenotype)}`}>
                AS: {dpyd.activityScore} | {dpyd.phenotype.replace('_METABOLIZER', '')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Maternal</label>
                <select
                  value={dpydMaternal}
                  onChange={e => setDpydMaternal(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs"
                >
                  {Object.keys(DPYD_ALLELES).map(al => (
                    <option key={al} value={al}>{al}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Paternal</label>
                <select
                  value={dpydPaternal}
                  onChange={e => setDpydPaternal(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs"
                >
                  {Object.keys(DPYD_ALLELES).map(al => (
                    <option key={al} value={al}>{al}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 line-clamp-2">{dpyd.phenotypeDescription}</p>
          </div>
        </div>

        {/* HLA-B*57:01 Banner Toggle */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hlaB5701}
              onChange={e => setHlaB5701(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="font-semibold text-slate-200">
              HLA-B*57:01 Allele Present (Abacavir Severe Hypersensitivity Marker)
            </span>
          </label>
          <span className="text-[11px] text-slate-400">
            {hlaB5701 ? 'POSITIVE: Fatal multi-organ hypersensitivity risk' : 'NEGATIVE: Standard abacavir eligibility'}
          </span>
        </div>
      </div>

      {/* Tab 1: CDS Rules & Prescribing Alert Panel */}
      {activeTab === 'cds' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Drug Selector */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Pill className="w-4 h-4 text-indigo-400" />
              Candidate Drug Selector
            </h2>
            <div className="space-y-2">
              {[
                { name: 'Clopidogrel', category: 'Antiplatelet', gene: 'CYP2C19' },
                { name: 'Codeine / Tramadol', category: 'Opioid Analgesic', gene: 'CYP2D6' },
                { name: 'Azathioprine / 6-Mercaptopurine', category: 'Thiopurine', gene: 'TPMT' },
                { name: 'Fluorouracil (5-FU)', category: 'Chemotherapy', gene: 'DPYD' },
                { name: 'Tamoxifen', category: 'SERM', gene: 'CYP2D6' },
                { name: 'Simvastatin', category: 'Statin', gene: 'SLCO1B1' },
                { name: 'Abacavir', category: 'Antiretroviral', gene: 'HLA-B*57:01' },
              ].map(drug => (
                <button
                  key={drug.name}
                  onClick={() => setSelectedDrug(drug.name)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                    selectedDrug.includes(drug.name.split(' ')[0])
                      ? 'bg-indigo-950/70 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs text-white">{drug.name}</div>
                    <div className="text-[11px] text-slate-400">{drug.category}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono">
                    {drug.gene}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: CDS Alert & Prescribing Guidance */}
          <div className="lg:col-span-2 space-y-4">
            {cdsResult.alerts.length > 0 ? (
              cdsResult.alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`border rounded-2xl p-6 shadow-xl space-y-4 ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-rose-950/40 border-rose-600/70'
                      : 'bg-amber-950/40 border-amber-600/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl border ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-rose-600/20 border-rose-500 text-rose-300'
                            : 'bg-amber-600/20 border-amber-500 text-amber-300'
                        }`}
                      >
                        <AlertOctagon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white">{alert.drugName}</h3>
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              alert.recommendationLevel === 'CONTRAINDICATED'
                                ? 'bg-rose-900 text-rose-200 border border-rose-700'
                                : 'bg-amber-900 text-amber-200 border border-amber-700'
                            }`}
                          >
                            {alert.recommendationLevel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{alert.drugCategory} | Primary Gene: {alert.primaryGene}</p>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Alert Body */}
                  <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 mb-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Clinical Pharmacogenetic Alert
                    </h4>
                    <p className="text-xs text-slate-200 leading-relaxed">{alert.clinicalAlert}</p>
                  </div>

                  {/* Alternative Action */}
                  <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      CPIC Recommended Precision Alternative
                    </h4>
                    <p className="text-xs text-emerald-100 leading-relaxed">{alert.alternativeTherapy}</p>
                  </div>

                  {/* Evidence summary */}
                  <div className="text-[11px] text-slate-400 flex items-start gap-2 pt-1">
                    <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-500" />
                    <span>Evidence: {alert.evidenceSummary}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-emerald-950/20 border border-emerald-800/50 rounded-2xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-emerald-300">Standard Dosing Safe</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Patient genomic profile demonstrates normal catalytic activity for {selectedDrug}. Standard clinical protocol and dosing guidelines apply with routine monitoring.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Warfarin IWPC Calculator & 14-Day Kinetic Chart */}
      {activeTab === 'warfarin' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Warfarin Demographics & Genetics Inputs */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                IWPC Clinical Parameters
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Age</span>
                    <span className="font-mono text-indigo-400">{warfarinAge} years</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={95}
                    value={warfarinAge}
                    onChange={e => setWarfarinAge(+e.target.value)}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Height (cm)</label>
                    <input
                      type="number"
                      value={warfarinHeightCm}
                      onChange={e => setWarfarinHeightCm(+e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={warfarinWeightKg}
                      onChange={e => setWarfarinWeightKg(+e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">CYP2C9 Diplotype</label>
                  <select
                    value={warfarinCyp2c9}
                    onChange={e => setWarfarinCyp2c9(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200"
                  >
                    <option value="*1/*1">*1/*1 (Normal clearance)</option>
                    <option value="*1/*2">*1/*2 (25% reduced clearance)</option>
                    <option value="*1/*3">*1/*3 (50% reduced clearance)</option>
                    <option value="*2/*2">*2/*2 (Intermediate clearance)</option>
                    <option value="*2/*3">*2/*3 (65% reduced clearance)</option>
                    <option value="*3/*3">*3/*3 (85% reduced clearance - High risk)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">VKORC1 (-1639G&gt;A rs9923231)</label>
                  <select
                    value={warfarinVkorc1}
                    onChange={e => setWarfarinVkorc1(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200"
                  >
                    <option value="G/G">G/G (Wild-type normal target enzyme)</option>
                    <option value="A/G">A/G (Heterozygous sensitive)</option>
                    <option value="A/A">A/A (Homozygous sensitive - low target enzyme)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={amiodaroneCoPrescribed}
                      onChange={e => setAmiodaroneCoPrescribed(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-600"
                    />
                    <span className="text-slate-300 font-medium">Amiodarone Co-Prescription</span>
                  </label>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Potent CYP2C9 inhibitor; reduces warfarin requirement by ~30%
                  </span>
                </div>
              </div>
            </div>

            {/* IWPC Dose Output & Risk Card */}
            <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      IWPC Pharmacogenetic Model Output
                    </span>
                    <h3 className="text-xl font-bold text-white mt-0.5">
                      Predicted Maintenance Dose
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      warfarinResult.riskCategory === 'HIGH_SENSITIVITY'
                        ? 'bg-rose-950 border border-rose-700 text-rose-300'
                        : warfarinResult.riskCategory === 'MODERATE_SENSITIVITY'
                        ? 'bg-amber-950 border border-amber-700 text-amber-300'
                        : 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                    }`}
                  >
                    {warfarinResult.riskCategory.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 my-6">
                  <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl text-center">
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">Predicted Daily Dose</div>
                    <div className="text-3xl font-black text-indigo-400 mt-1 font-mono">
                      {warfarinResult.predictedDailyDoseMg} <span className="text-sm font-normal text-slate-400">mg/d</span>
                    </div>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl text-center">
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">Weekly Dose</div>
                    <div className="text-3xl font-black text-white mt-1 font-mono">
                      {warfarinResult.predictedWeeklyDoseMg} <span className="text-sm font-normal text-slate-400">mg/wk</span>
                    </div>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl text-center">
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">vs Empirical 5 mg</div>
                    <div
                      className={`text-3xl font-black mt-1 font-mono ${
                        warfarinResult.doseAdjustmentPercentage < 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {warfarinResult.doseAdjustmentPercentage > 0 ? `+${warfarinResult.doseAdjustmentPercentage}` : warfarinResult.doseAdjustmentPercentage}%
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-white block mb-1">Genetic Rationale:</span>
                  {warfarinResult.geneticExplanation}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Algorithm: International Warfarin Pharmacogenetics Consortium (IWPC, NEJM)</span>
                <span>Target Therapeutic INR: 2.0 - 3.0</span>
              </div>
            </div>
          </div>

          {/* 14-Day Kinetic INR Chart */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  14-Day INR Kinetic Curve: Empirical 5 mg vs PGx-Guided Dosing
                </h3>
                <p className="text-xs text-slate-400">
                  Simulates cumulative S-warfarin accumulation and target inhibition kinetics over 14 induction days.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-slate-300">Empirical (5 mg)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-slate-300">PGx-Guided ({warfarinResult.predictedDailyDoseMg} mg)</span>
                </div>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={inrKineticCurve} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 12 }} label={{ value: 'Day of Induction', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                  <YAxis stroke="#94a3b8" domain={[1.0, 'auto']} tick={{ fontSize: 12 }} label={{ value: 'INR', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                    formatter={(val: any) => [val, 'INR']}
                    labelFormatter={(day) => `Day ${day}`}
                  />
                  {/* Target Therapeutic INR Range */}
                  <ReferenceLine y={2.0} stroke="#38bdf8" strokeDasharray="4 4" label={{ value: 'INR 2.0 (Lower Target)', fill: '#38bdf8', fontSize: 10, position: 'right' }} />
                  <ReferenceLine y={3.0} stroke="#38bdf8" strokeDasharray="4 4" label={{ value: 'INR 3.0 (Upper Target)', fill: '#38bdf8', fontSize: 10, position: 'right' }} />
                  <ReferenceLine y={5.0} stroke="#ef4444" strokeDasharray="2 2" label={{ value: 'Critical Bleed Threshold (INR > 5)', fill: '#ef4444', fontSize: 10, position: 'right' }} />
                  <Line
                    type="monotone"
                    dataKey="inrStandardEmpirical"
                    name="Empirical 5 mg"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#f43f5e' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="inrPgxGuided"
                    name="PGx Guided"
                    stroke="#34d399"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#34d399' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
