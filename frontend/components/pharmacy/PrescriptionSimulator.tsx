'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  CLINICAL_CASES,
  CLINICAL_FORMULARY,
  ClinicalCase,
  FormularyDrug,
  PrescribedItem,
  LiveAlert,
  MillerEvaluation,
  evaluateLivePrescriptionSafety,
  gradePrescriptionSubmission
} from '@/lib/pharmacy/PrescriptionSimulatorData';
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Pill,
  FileText,
  User,
  Activity,
  Award,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  HelpCircle,
  Printer,
  Copy,
  Check,
  ChevronRight,
  Info,
  ShieldAlert,
  Flame,
  BookOpen,
  ArrowRight,
  Layers,
  Heart,
  Droplet,
  Wind
} from 'lucide-react';

export default function PrescriptionSimulator() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-ckd-t2d');
  const [activeTab, setActiveTab] = useState<'prescribe' | 'rx-pad' | 'evaluation'>('prescribe');
  const [activeCaseTab, setActiveCaseTab] = useState<'hpi' | 'labs' | 'objectives'>('hpi');

  // Active Case
  const currentCase = useMemo(() => {
    return CLINICAL_CASES.find(c => c.id === selectedCaseId) || CLINICAL_CASES[0];
  }, [selectedCaseId]);

  // Current Prescription in Builder
  const [prescription, setPrescription] = useState<PrescribedItem[]>([]);

  // Drug Form Inputs
  const [selectedDrugId, setSelectedDrugId] = useState<string>('empagliflozin');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [customDose, setCustomDose] = useState<number>(10);
  const [doseUnit, setDoseUnit] = useState<string>('mg');
  const [route, setRoute] = useState<string>('Oral');
  const [frequency, setFrequency] = useState<string>('OD');
  const [durationDays, setDurationDays] = useState<number>(90);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Submission / Evaluation State
  const [evaluationResult, setEvaluationResult] = useState<MillerEvaluation | null>(null);
  const [copiedRx, setCopiedRx] = useState<boolean>(false);
  const [showGoldStandardModal, setShowGoldStandardModal] = useState<boolean>(false);

  // Selected drug object
  const currentDrug = useMemo(() => {
    return CLINICAL_FORMULARY.find(d => d.id === selectedDrugId) || CLINICAL_FORMULARY[0];
  }, [selectedDrugId]);

  // Update form defaults when selected drug changes
  useEffect(() => {
    if (currentDrug) {
      setCustomDose(currentDrug.standardDose);
      setDoseUnit(currentDrug.doseUnit);
      setRoute(currentDrug.defaultRoute);
      setFrequency(currentDrug.defaultFrequency);
      setDurationDays(currentDrug.standardDurationDays);
      setSpecialInstructions(currentDrug.foodInstructions);
    }
  }, [selectedDrugId, currentDrug]);

  // Filtered drug options
  const filteredDrugs = useMemo(() => {
    return CLINICAL_FORMULARY.filter(d => {
      const matchCategory = selectedCategory === 'All' || d.category === selectedCategory;
      const matchSearch =
        d.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        d.genericName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        d.drugClass.toLowerCase().includes(searchFilter.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchFilter]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(CLINICAL_FORMULARY.map(d => d.category));
    return ['All', ...Array.from(set)];
  }, []);

  // Live Contraindication & Safety Sentinel Alerts
  const liveAlerts = useMemo(() => {
    return evaluateLivePrescriptionSafety(prescription, currentCase);
  }, [prescription, currentCase]);

  // Handle case change
  const handleCaseSelect = (caseId: string) => {
    setSelectedCaseId(caseId);
    setPrescription([]);
    setEvaluationResult(null);
    setActiveTab('prescribe');
    setActiveCaseTab('hpi');

    // Pick appropriate first drug default based on case
    const targetCase = CLINICAL_CASES.find(c => c.id === caseId);
    if (targetCase && targetCase.goldStandardPrescription.length > 0) {
      setSelectedDrugId(targetCase.goldStandardPrescription[0].drugId);
    }
  };

  // Add drug to prescription
  const handleAddDrugToRx = () => {
    if (!currentDrug) return;

    // Check if already in prescription
    const existingIndex = prescription.findIndex(p => p.drugId === currentDrug.id);

    const newItem: PrescribedItem = {
      id: `rx-item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      drugId: currentDrug.id,
      drugName: `${currentDrug.name} ${customDose} ${doseUnit}`,
      genericName: currentDrug.genericName,
      dose: customDose,
      doseUnit: doseUnit,
      route: route,
      frequency: frequency,
      durationDays: durationDays,
      specialInstructions: specialInstructions || currentDrug.foodInstructions
    };

    if (existingIndex >= 0) {
      // Replace existing item
      const updated = [...prescription];
      updated[existingIndex] = newItem;
      setPrescription(updated);
    } else {
      setPrescription(prev => [...prev, newItem]);
    }

    // Reset evaluation if modified
    if (evaluationResult) {
      setEvaluationResult(null);
    }
  };

  // Remove drug from prescription
  const handleRemoveDrug = (id: string) => {
    setPrescription(prev => prev.filter(item => item.id !== id));
    if (evaluationResult) {
      setEvaluationResult(null);
    }
  };

  // Load Model Prescription for active case
  const handleLoadGoldStandard = () => {
    setPrescription([...currentCase.goldStandardPrescription]);
    if (evaluationResult) {
      setEvaluationResult(null);
    }
  };

  // Clear prescription
  const handleClearRx = () => {
    setPrescription([]);
    setEvaluationResult(null);
  };

  // Grade & Submit Prescription
  const handleSubmitPrescription = () => {
    const result = gradePrescriptionSubmission(prescription, currentCase);
    setEvaluationResult(result);
    setActiveTab('evaluation');
  };

  // Copy Rx to Clipboard
  const handleCopyPrescriptionText = () => {
    const text = `
MEDIVERSE TEACHING HOSPITAL - DIGITAL PRESCRIPTION
==================================================
Case #${currentCase.caseNumber}: ${currentCase.title}
Patient: ${currentCase.patient.name}, ${currentCase.patient.age}y / ${currentCase.patient.gender} | UHID: ${currentCase.patient.uhid}
Diagnosis: ${currentCase.diagnosis}
Allergies: ${currentCase.patient.knownAllergies.length > 0 ? currentCase.patient.knownAllergies.map(a => `${a.allergen} (${a.severity})`).join(', ') : 'Nil Known Drug Allergies (NKDA)'}
eGFR: ${currentCase.patient.eGFR} mL/min/1.73m2 | Vitals: BP ${currentCase.patient.vitals.bp}, HR ${currentCase.patient.vitals.hr} bpm
--------------------------------------------------
Rx (Medications Prescribed):
${prescription.map((p, idx) => `${idx + 1}. ${p.drugName} (${p.genericName})
   Route: ${p.route} | Frequency: ${p.frequency} | Duration: ${p.durationDays} Days
   Instructions: ${p.specialInstructions}`).join('\n\n')}
--------------------------------------------------
Prescribed via Mediverse Prescribing Simulator | Digital Verification
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedRx(true);
    setTimeout(() => setCopiedRx(false), 3000);
  };

  const hasContraindications = liveAlerts.some(a => a.severity === 'contraindicated');
  const hasWarnings = liveAlerts.some(a => a.severity === 'major');

  return (
    <div className="w-full text-slate-100 bg-[#090d16] rounded-2xl border border-slate-800/80 shadow-2xl p-4 md:p-6 space-y-6">
      {/* Simulator Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Stethoscope className="w-3.5 h-3.5" />
              Clinical Pharmacotherapy Simulator
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Miller Level 1-4 Assessment
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
            Interactive Prescribing & Pharmacotherapy Simulator
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl">
            Evaluate organ-specific dosing, live contraindications, drug-allergy flags, and multi-system polypharmacy interactions across realistic clinical cases.
          </p>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleLoadGoldStandard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition"
            title="Load Guideline Benchmark Regimen for Learning"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Load Model Rx
          </button>
          <button
            onClick={handleClearRx}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Rx
          </button>
        </div>
      </div>

      {/* Case Selector Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          Select Patient Clinical Case:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CLINICAL_CASES.map((c) => {
            const isSelected = c.id === selectedCaseId;
            return (
              <button
                key={c.id}
                onClick={() => handleCaseSelect(c.id)}
                className={`text-left p-3 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-slate-800/90 to-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    Case {c.caseNumber}
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    c.difficulty === 'Expert'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                  }`}>
                    {c.difficulty}
                  </span>
                </div>
                <h2 className="text-xs font-bold text-slate-100 line-clamp-2 mb-1">
                  {c.title}
                </h2>
                <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1 pt-1.5 border-t border-slate-800/50">
                  <span className="text-cyan-400/90">{c.specialty}</span>
                  <span className="text-slate-500">eGFR: {c.patient.eGFR}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Patient Chart & Medical Profile Banner */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 md:p-5 space-y-4">
        {/* Patient Top Summary */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-100">{currentCase.patient.name}</h3>
                <span className="text-xs text-slate-400">
                  {currentCase.patient.age} yrs • {currentCase.patient.gender} • {currentCase.patient.weightKg} kg • {currentCase.patient.heightCm} cm (BMI {currentCase.patient.bmi})
                </span>
                <span className="text-[11px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                  {currentCase.patient.uhid}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                <span className="font-semibold text-slate-300">Diagnosis:</span> {currentCase.diagnosis}
              </p>
            </div>
          </div>

          {/* Vitals Strip */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:pb-0 text-xs">
            <div className="bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-700/80 shrink-0">
              <span className="text-[10px] text-slate-400 block">BP</span>
              <span className="font-bold text-slate-200">{currentCase.patient.vitals.bp}</span>
            </div>
            <div className="bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-700/80 shrink-0">
              <span className="text-[10px] text-slate-400 block">Heart Rate</span>
              <span className="font-bold text-slate-200">{currentCase.patient.vitals.hr} bpm</span>
            </div>
            <div className="bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-700/80 shrink-0">
              <span className="text-[10px] text-slate-400 block">SpO2</span>
              <span className="font-bold text-emerald-400">{currentCase.patient.vitals.spo2}</span>
            </div>
            <div className="bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-700/80 shrink-0">
              <span className="text-[10px] text-slate-400 block">eGFR / Clearance</span>
              <span className={`font-bold ${currentCase.patient.eGFR < 45 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {currentCase.patient.eGFR} mL/min
              </span>
            </div>
          </div>
        </div>

        {/* Known Allergies Callout */}
        {currentCase.patient.knownAllergies.length > 0 ? (
          <div className="bg-red-950/30 border border-red-500/40 rounded-lg p-3 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-red-300 block uppercase tracking-wide">
                DOCUMENTED CRITICAL ALLERGY ALERT:
              </span>
              {currentCase.patient.knownAllergies.map((all, i) => (
                <div key={i} className="text-red-200/90 mt-0.5">
                  <span className="font-semibold">{all.allergen}:</span> {all.reactionType} — <span className="underline font-bold text-red-300">{all.severity}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-2.5 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Allergy Status:</strong> Nil Known Drug Allergies (NKDA) documented.</span>
          </div>
        )}

        {/* Patient Tabs (HPI / Labs / Objectives) */}
        <div className="space-y-2">
          <div className="flex border-b border-slate-800 text-xs">
            <button
              onClick={() => setActiveCaseTab('hpi')}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeCaseTab === 'hpi'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Clinical History & Present Illness
            </button>
            <button
              onClick={() => setActiveCaseTab('labs')}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeCaseTab === 'labs'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Laboratory & Diagnostic Findings
            </button>
            <button
              onClick={() => setActiveCaseTab('objectives')}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeCaseTab === 'objectives'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Key Prescribing Objectives & Guidelines
            </button>
          </div>

          <div className="text-xs text-slate-300 pt-1">
            {activeCaseTab === 'hpi' && (
              <div className="space-y-2">
                <p><span className="font-semibold text-slate-200">Chief Complaint:</span> {currentCase.patient.chiefComplaint}</p>
                <p><span className="font-semibold text-slate-200">History of Present Illness:</span> {currentCase.patient.historyOfPresentIllness}</p>
                <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-slate-400">
                  <div>
                    <span className="font-semibold text-slate-300">Co-morbidities:</span> {currentCase.patient.coMorbidities.join(', ')}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-300">Current Medications:</span> {currentCase.patient.concurrentMedications.join('; ')}
                  </div>
                </div>
              </div>
            )}

            {activeCaseTab === 'labs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(currentCase.patient.labs).map(([key, val]) => (
                  <div key={key} className="bg-slate-850 p-2.5 rounded border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block">{key}</span>
                    <span className="font-semibold text-slate-200 text-xs">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {activeCaseTab === 'objectives' && (
              <div className="space-y-2">
                <div className="text-cyan-300 font-semibold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Clinical Guideline Benchmark: {currentCase.guidelineReference}
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                  {currentCase.keyLearningObjectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Interactive Work Area: Tabs for Builder, Rx Pad, and Evaluation */}
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 flex-wrap gap-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('prescribe')}
              className={`flex items-center gap-2 px-4 py-2.5 font-semibold text-xs md:text-sm rounded-t-lg transition ${
                activeTab === 'prescribe'
                  ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Pill className="w-4 h-4" />
              Prescription Builder ({prescription.length} Items)
            </button>
            <button
              onClick={() => setActiveTab('rx-pad')}
              className={`flex items-center gap-2 px-4 py-2.5 font-semibold text-xs md:text-sm rounded-t-lg transition ${
                activeTab === 'rx-pad'
                  ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              Digital Rx Pad Preview
            </button>
            {evaluationResult && (
              <button
                onClick={() => setActiveTab('evaluation')}
                className={`flex items-center gap-2 px-4 py-2.5 font-semibold text-xs md:text-sm rounded-t-lg transition ${
                  activeTab === 'evaluation'
                    ? 'bg-slate-800 text-purple-400 border-t-2 border-purple-400'
                    : 'text-slate-400 hover:text-purple-300'
                }`}
              >
                <Award className="w-4 h-4" />
                Evaluation & Miller Rubric ({evaluationResult.overallScore}%)
              </button>
            )}
          </div>

          <div className="py-1">
            <button
              onClick={handleSubmitPrescription}
              disabled={prescription.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold shadow-lg transition ${
                prescription.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : hasContraindications
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40 animate-pulse'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/50'
              }`}
            >
              <Award className="w-4 h-4" />
              Submit Prescription for Grading
            </button>
          </div>
        </div>

        {/* Live Safety Alerts Sentinel Banner */}
        {liveAlerts.length > 0 && (
          <div className="space-y-2">
            {liveAlerts.map(alert => (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition ${
                  alert.severity === 'contraindicated'
                    ? 'bg-red-950/40 border-red-500 text-red-200 ring-1 ring-red-500/50'
                    : alert.severity === 'major'
                    ? 'bg-amber-950/40 border-amber-500/80 text-amber-200'
                    : 'bg-sky-950/30 border-sky-500/50 text-sky-200'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {alert.severity === 'contraindicated' && <Flame className="w-5 h-5 text-red-400" />}
                  {alert.severity === 'major' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                  {alert.severity === 'moderate' && <Info className="w-5 h-5 text-sky-400" />}
                </div>
                <div className="text-xs space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-bold text-sm">{alert.title}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      alert.severity === 'contraindicated' ? 'bg-red-500 text-white' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {alert.type}
                    </span>
                  </div>
                  <p>{alert.message}</p>
                  <div className="text-[11px] opacity-90">
                    <span className="font-semibold">Mechanism:</span> {alert.mechanism}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-300">
                    💡 Guideline Action: {alert.recommendation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 1: PRESCRIPTION BUILDER */}
        {activeTab === 'prescribe' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Drug Formulation Form (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 md:p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-100 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-cyan-400" />
                    Clinical Drug Formulary & Dosing Form
                  </span>
                  <span className="text-xs text-slate-400 font-normal">
                    {filteredDrugs.length} agents available
                  </span>
                </h3>

                {/* Search & Category Filter */}
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Search formulary by name, class, or generic..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2.5 py-1 rounded-full whitespace-nowrap transition ${
                          selectedCategory === cat
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Drug Selection Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Select Drug:</label>
                  <select
                    value={selectedDrugId}
                    onChange={(e) => setSelectedDrugId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    {filteredDrugs.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.genericName}) — {d.category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Drug Info Pill Card */}
                {currentDrug && (
                  <div className="bg-slate-850 p-3 rounded-lg border border-slate-750 text-xs space-y-1.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-bold text-cyan-300">{currentDrug.genericName}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                        {currentDrug.drugClass}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      <span className="font-semibold text-slate-300">Formulation:</span> {currentDrug.formulation} • Brand Examples: {currentDrug.brandExamples.join(', ')}
                    </p>
                    {currentDrug.renalAdjustmentNotes && (
                      <p className="text-amber-300/90 text-[11px]">
                        <span className="font-semibold">Renal Dosing:</span> {currentDrug.renalAdjustmentNotes}
                      </p>
                    )}
                    {currentDrug.highRiskAlert && (
                      <p className="text-red-300/90 text-[11px]">
                        <span className="font-semibold">Clinical Note:</span> {currentDrug.highRiskAlert}
                      </p>
                    )}
                  </div>
                )}

                {/* Dosing Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Dose Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Dose ({doseUnit}):</span>
                      <span className="text-[10px] text-slate-400">Available: {currentDrug.availableDoses.join(', ')} {doseUnit}</span>
                    </label>
                    <div className="flex gap-1.5 flex-wrap">
                      {currentDrug.availableDoses.map((dVal) => (
                        <button
                          key={dVal}
                          type="button"
                          onClick={() => setCustomDose(dVal)}
                          className={`px-3 py-1 text-xs rounded font-medium border transition ${
                            customDose === dVal
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                          }`}
                        >
                          {dVal} {doseUnit}
                        </button>
                      ))}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="number"
                        step="any"
                        value={customDose}
                        onChange={(e) => setCustomDose(parseFloat(e.target.value) || 0)}
                        className="w-24 bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                      <select
                        value={doseUnit}
                        onChange={(e) => setDoseUnit(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300"
                      >
                        <option value="mg">mg</option>
                        <option value="mcg">mcg</option>
                        <option value="IU">IU</option>
                        <option value="puffs">puffs</option>
                        <option value="drops">drops</option>
                        <option value="ml">ml</option>
                      </select>
                    </div>
                  </div>

                  {/* Route Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Route of Administration:</label>
                    <select
                      value={route}
                      onChange={(e) => setRoute(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      {currentDrug.availableRoutes.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Frequency Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Frequency / Dosage Schedule:</label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      {currentDrug.availableFrequencies.map((f) => (
                        <option key={f} value={f}>
                          {f === 'OD' && 'OD - Once Daily (every 24 hrs)'}
                          {f === 'BD' && 'BD - Twice Daily (every 12 hrs)'}
                          {f === 'TDS' && 'TDS - Thrice Daily (every 8 hrs)'}
                          {f === 'QDS' && 'QDS - Four Times Daily (every 6 hrs)'}
                          {f === 'PRN' && 'PRN - As Needed'}
                          {f === 'STAT' && 'STAT - Immediately (Single dose)'}
                          {f === 'Once Weekly' && 'Once Weekly (Same day each week)'}
                          {f === 'Continuous Infusion' && 'Continuous Infusion'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Duration in Days */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Duration (Days):</span>
                      <span className="text-[10px] text-slate-400">Standard: {currentDrug.standardDurationDays} d</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={durationDays}
                        onChange={(e) => setDurationDays(parseInt(e.target.value) || 1)}
                        className="w-24 bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                      <div className="flex gap-1">
                        {[5, 7, 30, 90, 365].map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setDurationDays(d)}
                            className={`px-2 py-0.5 text-[10px] rounded border ${
                              durationDays === d
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            {d}d
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Administration & Patient Instructions:</span>
                    <span className="text-[10px] text-slate-400">Clear patient-facing instructions</span>
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Take with morning meals; rinse mouth after inhalation..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={handleAddDrugToRx}
                  className="w-full py-2.5 px-4 rounded-lg text-xs md:text-sm font-bold bg-cyan-600 hover:bg-cyan-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition"
                >
                  <Plus className="w-4 h-4" />
                  Add {currentDrug.name} to Prescription
                </button>
              </div>
            </div>

            {/* Right Column: Current Prescription List (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-slate-100">
                      Active Prescription Order
                    </h3>
                  </div>
                  <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    {prescription.length} Items Prescribed
                  </span>
                </div>

                {prescription.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-xl space-y-2">
                    <Pill className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">
                      Your prescription is currently empty.
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Select drugs from the formulary on the left and click &quot;Add Drug to Prescription&quot; or use &quot;Load Model Rx&quot;.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {prescription.map((item, index) => (
                      <div
                        key={item.id}
                        className="bg-slate-850 p-3 rounded-lg border border-slate-750 flex flex-col gap-1.5 hover:border-slate-600 transition"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-cyan-400 mr-1.5">#{index + 1}</span>
                            <span className="text-xs font-bold text-slate-100">{item.drugName}</span>
                            <span className="text-[11px] text-slate-400 block">({item.genericName})</span>
                          </div>
                          <button
                            onClick={() => handleRemoveDrug(item.id)}
                            className="text-slate-400 hover:text-red-400 p-1 transition"
                            title="Remove Drug"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 text-[11px] text-slate-300 bg-slate-900/60 p-1.5 rounded">
                          <span><strong>Route:</strong> {item.route}</span>
                          <span>•</span>
                          <span><strong>Freq:</strong> {item.frequency}</span>
                          <span>•</span>
                          <span><strong>Duration:</strong> {item.durationDays}d</span>
                        </div>

                        <p className="text-[11px] text-slate-400 italic">
                          &quot;{item.specialInstructions}&quot;
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {prescription.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setActiveTab('rx-pad')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                    >
                      View Digital Rx Pad <ChevronRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={handleSubmitPrescription}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition"
                    >
                      Submit for Grading
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DIGITAL RX PAD PREVIEW */}
        {activeTab === 'rx-pad' && (
          <div className="space-y-4">
            <div className="bg-white text-slate-900 rounded-xl p-6 md:p-8 max-w-3xl mx-auto shadow-2xl font-serif border border-slate-300 space-y-6">
              {/* Rx Pad Header */}
              <div className="border-b-2 border-slate-800 pb-4 text-center">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 uppercase">
                  Mediverse University Teaching Hospital
                </h2>
                <p className="text-xs text-slate-600 font-sans tracking-wide">
                  Department of Pharmacotherapy & Clinical Medicine • GMC / PCI Accredited
                </p>
                <div className="text-[11px] text-slate-500 font-sans mt-1">
                  Physician: <strong>Dr. Clinical Scholar, MBBS, PharmD, MD</strong> • Reg No: MED-2026-RX-0849
                </div>
              </div>

              {/* Patient Banner */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-sans bg-slate-100 p-3 rounded border border-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">PATIENT NAME</span>
                  <span className="font-bold text-slate-900">{currentCase.patient.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">AGE / GENDER</span>
                  <span className="font-bold text-slate-900">{currentCase.patient.age}y / {currentCase.patient.gender}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">UHID</span>
                  <span className="font-bold text-slate-900">{currentCase.patient.uhid}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">DATE</span>
                  <span className="font-bold text-slate-900">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block text-[10px]">DIAGNOSIS</span>
                  <span className="font-semibold text-slate-900">{currentCase.diagnosis}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block text-[10px]">DOCUMENTED ALLERGIES</span>
                  <span className="font-semibold text-red-600">
                    {currentCase.patient.knownAllergies.length > 0
                      ? currentCase.patient.knownAllergies.map(a => `${a.allergen} (${a.severity})`).join(', ')
                      : 'NKDA (Nil Known Drug Allergies)'}
                  </span>
                </div>
              </div>

              {/* Rx Symbol */}
              <div className="text-3xl font-bold text-sky-900 italic">
                ℞
              </div>

              {/* Prescribed Items Table */}
              {prescription.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-sans text-xs">
                  No drugs currently prescribed. Add items from the Prescription Builder tab.
                </div>
              ) : (
                <div className="space-y-4 font-sans text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-300 text-[11px] font-bold text-slate-700 uppercase">
                        <th className="py-2">#</th>
                        <th className="py-2">Medication & Formulation</th>
                        <th className="py-2">Route</th>
                        <th className="py-2">Frequency</th>
                        <th className="py-2">Duration</th>
                        <th className="py-2">Instructions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {prescription.map((item, idx) => (
                        <tr key={item.id} className="text-slate-800">
                          <td className="py-2.5 font-bold text-slate-500">{idx + 1}</td>
                          <td className="py-2.5">
                            <span className="font-bold text-slate-900 block">{item.drugName}</span>
                            <span className="text-[11px] text-slate-500 italic">({item.genericName})</span>
                          </td>
                          <td className="py-2.5 font-medium">{item.route}</td>
                          <td className="py-2.5 font-medium">{item.frequency}</td>
                          <td className="py-2.5 font-medium">{item.durationDays} Days</td>
                          <td className="py-2.5 text-slate-600 max-w-xs">{item.specialInstructions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Footer / Signature Seal */}
              <div className="border-t-2 border-slate-800 pt-6 flex items-end justify-between font-sans text-xs">
                <div>
                  <div className="text-[11px] text-slate-500">
                    Emergency Hotline: +91 1800-MED-SAFE • Valid for 30 Days
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Generated via Mediverse Clinical Prescribing System
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-32 h-10 border-b border-dashed border-slate-400 mx-auto flex items-center justify-center text-slate-400 font-serif italic">
                    Dr. Clinical Scholar
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 block mt-1">Prescriber Digital Signature</span>
                </div>
              </div>
            </div>

            {/* Action Bar for Rx Pad */}
            <div className="flex justify-center gap-3">
              <button
                onClick={handleCopyPrescriptionText}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                {copiedRx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedRx ? 'Copied to Clipboard!' : 'Copy Prescription Text'}
              </button>
              <button
                onClick={handleSubmitPrescription}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg"
              >
                <Award className="w-4 h-4" />
                Submit for Clinical Grading
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: EVALUATION & MILLER-LEVEL DEBRIEF */}
        {activeTab === 'evaluation' && evaluationResult && (
          <div className="space-y-6">
            {/* Top Score Banner */}
            <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl ${
              evaluationResult.passed
                ? 'bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 border-emerald-500/60 ring-1 ring-emerald-500/40'
                : 'bg-gradient-to-br from-slate-900 via-red-950/30 to-slate-900 border-red-500/60 ring-1 ring-red-500/40'
            }`}>
              <div className="flex items-center gap-5">
                {/* Grade Badge */}
                <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-bold shadow-2xl shrink-0 ${
                  evaluationResult.letterGrade === 'A+' || evaluationResult.letterGrade === 'A'
                    ? 'bg-emerald-500 text-slate-950'
                    : evaluationResult.letterGrade === 'B+' || evaluationResult.letterGrade === 'B'
                    ? 'bg-cyan-500 text-slate-950'
                    : evaluationResult.letterGrade === 'C'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-red-600 text-white'
                }`}>
                  <span className="text-3xl leading-none">{evaluationResult.letterGrade}</span>
                  <span className="text-[10px] uppercase tracking-wider mt-1">{evaluationResult.overallScore}%</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      evaluationResult.passed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}>
                      {evaluationResult.passed ? 'CLINICAL PASS - APPROVED' : 'NEEDS REVISION - SAFETY VIOLATIONS'}
                    </span>
                    <span className="text-xs text-slate-400">Case #{currentCase.caseNumber}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 mt-1">
                    {evaluationResult.passed
                      ? 'Guideline-Adherent & Safe Pharmacotherapy Regimen'
                      : 'Prescription Requires Immediate Safety / Dosing Corrections'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Assessed against {currentCase.guidelineReference}
                  </p>
                </div>
              </div>

              {/* 4 Score Pillar Sub-gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto">
                <div className="bg-slate-850 p-2.5 rounded-lg border border-slate-750 text-center">
                  <span className="text-[10px] text-slate-400 block">Efficacy</span>
                  <span className="text-sm font-bold text-emerald-400">{evaluationResult.scoreBreakdown.efficacyScore}/35</span>
                </div>
                <div className="bg-slate-850 p-2.5 rounded-lg border border-slate-750 text-center">
                  <span className="text-[10px] text-slate-400 block">Safety</span>
                  <span className={`text-sm font-bold ${evaluationResult.scoreBreakdown.safetyScore < 25 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {evaluationResult.scoreBreakdown.safetyScore}/35
                  </span>
                </div>
                <div className="bg-slate-850 p-2.5 rounded-lg border border-slate-750 text-center">
                  <span className="text-[10px] text-slate-400 block">Dosing</span>
                  <span className="text-sm font-bold text-cyan-400">{evaluationResult.scoreBreakdown.dosingAccuracyScore}/15</span>
                </div>
                <div className="bg-slate-850 p-2.5 rounded-lg border border-slate-750 text-center">
                  <span className="text-[10px] text-slate-400 block">Completeness</span>
                  <span className="text-sm font-bold text-purple-400">{evaluationResult.scoreBreakdown.prescriptionCompletenessScore}/15</span>
                </div>
              </div>
            </div>

            {/* Miller Pyramid Competencies Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                  Miller Pyramid Competency Evaluation
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Level 1: Knows */}
                <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                      Level 1: KNOWS (Pharmacology Knowledge)
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      {evaluationResult.millerCompetencies.knows.score}%
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200">
                    {evaluationResult.millerCompetencies.knows.summary}
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pl-1">
                    {evaluationResult.millerCompetencies.knows.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                {/* Level 2: Knows How */}
                <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                      Level 2: KNOWS HOW (Safety & Contraindications)
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      {evaluationResult.millerCompetencies.knowsHow.score}%
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200">
                    {evaluationResult.millerCompetencies.knowsHow.summary}
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pl-1">
                    {evaluationResult.millerCompetencies.knowsHow.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                {/* Level 3: Shows How */}
                <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">
                      Level 3: SHOWS HOW (Regimen Precision & Formulation)
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      {evaluationResult.millerCompetencies.showsHow.score}%
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200">
                    {evaluationResult.millerCompetencies.showsHow.summary}
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pl-1">
                    {evaluationResult.millerCompetencies.showsHow.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                {/* Level 4: Does */}
                <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                      Level 4: DOES (Clinical Practice Readiness)
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      {evaluationResult.millerCompetencies.does.score}%
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200">
                    {evaluationResult.millerCompetencies.does.summary}
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pl-1">
                    {evaluationResult.millerCompetencies.does.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Prescribed vs Gold Standard Comparison */}
            <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 md:p-5 space-y-4">
              <h4 className="text-sm font-bold text-slate-100 flex items-center justify-between">
                <span>Guideline Gold Standard vs. Prescribed Regimen</span>
                <span className="text-xs text-cyan-400 font-normal">{currentCase.guidelineReference}</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User's Prescription */}
                <div className="bg-slate-850 p-3.5 rounded-lg border border-slate-750 space-y-2">
                  <span className="text-xs font-bold text-slate-200 block border-b border-slate-700 pb-1.5">
                    Your Submitted Prescription ({prescription.length} items)
                  </span>
                  {prescription.length === 0 ? (
                    <p className="text-xs text-slate-500">No items submitted.</p>
                  ) : (
                    <div className="space-y-2 text-xs">
                      {prescription.map((p, idx) => (
                        <div key={p.id} className="bg-slate-900/70 p-2 rounded">
                          <span className="font-bold text-slate-100">{idx + 1}. {p.drugName}</span>
                          <span className="text-slate-400 block text-[11px]">
                            {p.route} • {p.frequency} • {p.durationDays}d
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Guideline Gold Standard */}
                <div className="bg-emerald-950/20 p-3.5 rounded-lg border border-emerald-500/30 space-y-2">
                  <span className="text-xs font-bold text-emerald-300 block border-b border-emerald-500/30 pb-1.5">
                    Guideline Recommended Standard ({currentCase.goldStandardPrescription.length} items)
                  </span>
                  <div className="space-y-2 text-xs">
                    {currentCase.goldStandardPrescription.map((g, idx) => (
                      <div key={g.id} className="bg-emerald-950/40 p-2 rounded border border-emerald-500/20">
                        <span className="font-bold text-emerald-200">{idx + 1}. {g.drugName}</span>
                        <span className="text-emerald-300/80 block text-[11px]">
                          {g.route} • {g.frequency} • {g.durationDays}d
                        </span>
                        <span className="text-[10px] text-emerald-400 italic block mt-0.5">
                          {g.specialInstructions}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Deep Clinical Debrief & Pathophysiology */}
            <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 md:p-5 space-y-3">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Comprehensive Pharmacological Debrief & Mechanism Analysis
              </h4>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="bg-slate-850 p-3 rounded-lg border border-slate-750">
                  <span className="font-bold text-cyan-300 block mb-1">Pathophysiology & Disease Mechanism:</span>
                  <p>{currentCase.clinicalDebrief.pathophysiology}</p>
                </div>

                <div className="bg-slate-850 p-3 rounded-lg border border-slate-750">
                  <span className="font-bold text-emerald-300 block mb-1">Pharmacotherapy Rationale:</span>
                  <p>{currentCase.clinicalDebrief.pharmacotherapyRationale}</p>
                </div>

                <div className="bg-slate-850 p-3 rounded-lg border border-slate-750">
                  <span className="font-bold text-red-300 block mb-1">Critical Safety Pitfalls & Contraindications:</span>
                  <p>{currentCase.clinicalDebrief.safetyPitfalls}</p>
                </div>

                <div className="bg-slate-850 p-3 rounded-lg border border-slate-750">
                  <span className="font-bold text-purple-300 block mb-1">Guideline Recommendations:</span>
                  <p>{currentCase.clinicalDebrief.guidelineRecommendations}</p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('prescribe')}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                ← Return to Prescription Editor
              </button>

              <button
                onClick={handleLoadGoldStandard}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-slate-950 transition"
              >
                <Sparkles className="w-4 h-4" />
                Load Model Regimen & Re-Evaluate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
