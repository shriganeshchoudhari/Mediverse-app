'use client';

/**
 * ClinicalCaseSolverStation.tsx
 * Multi-Domain Interactive Clinical Case Solver & Grand Rounds Station
 * Location: frontend/components/cases/ClinicalCaseSolverStation.tsx
 */

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  ENRICHED_CASE_PACKS,
  EnrichedClinicalCase,
} from '@/lib/curriculum/enrichedClinicalCasePacks';
import {
  Stethoscope,
  Activity,
  Heart,
  Droplets,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  FileText,
  Layers,
  ShieldCheck,
  HelpCircle,
  Volume2,
  VolumeX,
  Search,
  Filter,
  Microscope,
  Pill,
  Eye,
  BookOpen,
  Award,
  Check,
  Info,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export type EncounterStage =
  | 'TRIAGE'
  | 'WORKUP'
  | 'DIFFERENTIAL'
  | 'MANAGEMENT'
  | 'PEARLS';

const STAGES: { id: EncounterStage; label: string; step: number; icon: React.ReactNode }[] = [
  { id: 'TRIAGE', label: '1. Triage & Presentation', step: 1, icon: <Activity className="w-4 h-4" /> },
  { id: 'WORKUP', label: '2. Physical Exam & Labs', step: 2, icon: <Microscope className="w-4 h-4" /> },
  { id: 'DIFFERENTIAL', label: '3. Differential Ranking', step: 3, icon: <Layers className="w-4 h-4" /> },
  { id: 'MANAGEMENT', label: '4. Treatment Orders', step: 4, icon: <Pill className="w-4 h-4" /> },
  { id: 'PEARLS', label: '5. Grand Rounds Pearls', step: 5, icon: <Award className="w-4 h-4" /> },
];

const DOMAIN_FILTERS = [
  { id: 'ALL', label: 'All Domains' },
  { id: 'ALLOPATHIC_MBBS', label: '🩺 Allopathic (MBBS)' },
  { id: 'DENTAL_BDS', label: '🦷 Dental (BDS)' },
  { id: 'AYUSH_BAMS', label: '🌿 Ayurveda (BAMS)' },
  { id: 'PHARMACY_BPHARM', label: '💊 Pharmacy (BPharm/PharmD)' },
  { id: 'NURSING_BSC', label: '🏥 Nursing (BSc)' },
  { id: 'PHYSIOTHERAPY_BPT', label: '🦾 Physiotherapy (BPT)' },
  { id: 'VETERINARY_BVSC', label: '🐾 Veterinary (BVSc)' },
];

interface ClinicalCaseSolverStationProps {
  initialCaseId?: string;
  initialStage?: EncounterStage;
}

export default function ClinicalCaseSolverStation({
  initialCaseId = 'case-mbbs-01',
  initialStage = 'TRIAGE',
}: ClinicalCaseSolverStationProps) {
  const caseList = useMemo(() => Object.values(ENRICHED_CASE_PACKS), []);

  const [activeCaseId, setActiveCaseId] = useState<string>(() => {
    return ENRICHED_CASE_PACKS[initialCaseId] ? initialCaseId : 'case-mbbs-01';
  });

  const [activeStage, setActiveStage] = useState<EncounterStage>(initialStage);
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Encounter Interaction States
  const [revealedLabs, setRevealedLabs] = useState<Set<string>>(new Set());
  const [revealedImaging, setRevealedImaging] = useState<boolean>(false);
  const [selectedDifferentialIndex, setSelectedDifferentialIndex] = useState<number | null>(null);
  const [revealedDiagnosis, setRevealedDiagnosis] = useState<boolean>(false);
  const [checkedProtocols, setCheckedProtocols] = useState<Set<number>>(new Set());
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const resetEncounter = useCallback((targetStage: EncounterStage = 'TRIAGE') => {
    setRevealedLabs(new Set());
    setRevealedImaging(false);
    setSelectedDifferentialIndex(null);
    setRevealedDiagnosis(false);
    setCheckedProtocols(new Set());
    setActiveStage(targetStage);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const prevCaseIdRef = useRef<string>(initialCaseId);

  // Synchronize if initialCaseId prop changes
  useEffect(() => {
    if (initialCaseId && ENRICHED_CASE_PACKS[initialCaseId] && initialCaseId !== prevCaseIdRef.current) {
      prevCaseIdRef.current = initialCaseId;
      setActiveCaseId(initialCaseId);
      resetEncounter('TRIAGE');
    }
  }, [initialCaseId, resetEncounter]);

  const activeCase: EnrichedClinicalCase = useMemo(() => {
    return ENRICHED_CASE_PACKS[activeCaseId] || caseList[0];
  }, [activeCaseId, caseList]);

  // Filtered case selection
  const filteredCases = useMemo(() => {
    return caseList.filter((c) => {
      const matchesDomain =
        selectedDomainFilter === 'ALL' || c.domain === selectedDomainFilter;
      const matchesSearch =
        searchQuery === '' ||
        c.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.domainTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.definitiveDiagnosis.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDomain && matchesSearch;
    });
  }, [caseList, selectedDomainFilter, searchQuery]);

  const toggleSpeech = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `Patient presentation. ${activeCase.patientDemographics}. Chief Complaint: ${activeCase.chiefComplaint}. History of Present Illness: ${activeCase.historyOfPresentIllness}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [isSpeaking, activeCase]);

  // Order/reveal single lab
  const toggleLabReveal = (testName: string) => {
    setRevealedLabs((prev) => {
      const next = new Set(prev);
      if (next.has(testName)) next.delete(testName);
      else next.add(testName);
      return next;
    });
  };

  const revealAllLabs = () => {
    const allLabNames = activeCase.diagnosticWorkup.labInvestigations.map((l) => l.test);
    setRevealedLabs(new Set(allLabNames));
    setRevealedImaging(true);
  };

  const toggleProtocolChecked = (index: number) => {
    setCheckedProtocols((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  // Bridge to GlobalSocraticAssistant
  const openAiTutorWithContext = () => {
    const context = `[Clinical Case Context] Case: ${activeCase.domainTitle} - ${activeCase.id}.
Demographics: ${activeCase.patientDemographics}
Chief Complaint: ${activeCase.chiefComplaint}
Vitals: BP ${activeCase.vitals.bloodPressure}, HR ${activeCase.vitals.heartRate}, SpO2 ${activeCase.vitals.oxygenSaturation}, RR ${activeCase.vitals.respiratoryRate}, Temp ${activeCase.vitals.temperature}
Working Diagnoses Considered: ${activeCase.differentialDiagnosisRanked.map((d) => d.diagnosis).join(', ')}
Definitive Diagnosis: ${activeCase.definitiveDiagnosis}
Current Encounter Stage: ${activeStage}.`;

    window.dispatchEvent(
      new CustomEvent('mediverse:open-ai-with-context', {
        detail: { context },
      })
    );
  };

  // Vitals abnormality detectors
  const vitalsStatus = useMemo(() => {
    const v = activeCase.vitals;
    const isHypotensive =
      v.bloodPressure.includes('88') ||
      v.bloodPressure.includes('80') ||
      v.bloodPressure.includes('82') ||
      v.bloodPressure.includes('85') ||
      v.bloodPressure.includes('70');
    const isHypertensive =
      v.bloodPressure.includes('168') ||
      v.bloodPressure.includes('180') ||
      v.bloodPressure.includes('190') ||
      v.bloodPressure.includes('160');
    const isTachycardic =
      v.heartRate.includes('110') ||
      v.heartRate.includes('120') ||
      v.heartRate.includes('130') ||
      v.heartRate.includes('140') ||
      v.heartRate.includes('150') ||
      v.heartRate.includes('160');
    const isHypoxic =
      v.oxygenSaturation.includes('90') ||
      v.oxygenSaturation.includes('91') ||
      v.oxygenSaturation.includes('92') ||
      v.oxygenSaturation.includes('88') ||
      v.oxygenSaturation.includes('89');
    const isFebrile =
      v.temperature.includes('38') ||
      v.temperature.includes('39') ||
      v.temperature.includes('101') ||
      v.temperature.includes('102') ||
      v.temperature.includes('103');

    return { isHypotensive, isHypertensive, isTachycardic, isHypoxic, isFebrile };
  }, [activeCase.vitals]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Evidence-Based Clinical Encounters
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Council Standards: NMC • DCI • CCIM • PCI • INC
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Stethoscope className="w-7 h-7 text-blue-400" />
              Clinical Case Solver &amp; Grand Rounds
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Solve authentic patient vignettes across 7 healthcare domains. Work through bedside
              presentation, order lab panels, evaluate imaging, rank differential diagnoses, and
              execute protocolized management.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
            <button
              onClick={openAiTutorWithContext}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 bg-indigo-600/80 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition border border-indigo-500/40 shadow-sm"
              title="Discuss this patient encounter with Mediverse AI Tutor"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              Ask AI Socratic Tutor
            </button>
            <button
              onClick={() => resetEncounter()}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition border border-slate-700"
              title="Reset current case encounter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Case
            </button>
          </div>
        </div>
      </div>

      {/* Domain Filter Bar & Search */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Domain Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1 mr-1" />
          {DOMAIN_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedDomainFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedDomainFilter === f.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search symptoms, diagnosis, case..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Case Selector Carousel / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {filteredCases.map((c) => {
          const isSelected = c.id === activeCaseId;
          return (
            <button
              key={c.id}
              onClick={() => {
                setActiveCaseId(c.id);
                resetEncounter();
              }}
              className={`text-left p-3.5 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">
                    {c.domainTitle.split(' ')[0]}
                  </span>
                  {isSelected && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                  {c.chiefComplaint}
                </h4>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span className="truncate max-w-[120px]">{c.patientDemographics.split(',')[0]}</span>
                <span className="text-blue-400 font-semibold flex items-center gap-0.5">
                  Solve <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Patient Encounter Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Patient Status Bar */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-4 sm:px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
              {activeCase.domainTitle.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-400 tracking-wide uppercase">
                  {activeCase.domainTitle}
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs font-mono text-slate-400">{activeCase.id}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                {activeCase.patientDemographics}
              </h2>
            </div>
          </div>

          {/* Speech & Quick Vitals */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={toggleSpeech}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                isSpeaking
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border-slate-700'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              {isSpeaking ? 'Mute Case Audio' : 'Narrate Presentation'}
            </button>
          </div>
        </div>

        {/* Live Patient Bedside Monitor Strip */}
        <div className="bg-slate-950 border-b border-slate-800/80 p-3 sm:px-6 grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 text-xs font-mono">
          {/* BP */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2.5">
            <Activity
              className={`w-4 h-4 ${
                vitalsStatus.isHypotensive
                  ? 'text-rose-400 animate-pulse'
                  : vitalsStatus.isHypertensive
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Blood Pressure</div>
              <div className="font-bold text-white text-sm">
                {activeCase.vitals.bloodPressure}
                {vitalsStatus.isHypotensive && (
                  <span className="ml-1 text-[9px] text-rose-400 font-sans font-bold">LOW</span>
                )}
              </div>
            </div>
          </div>

          {/* HR */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2.5">
            <Heart
              className={`w-4 h-4 ${
                vitalsStatus.isTachycardic ? 'text-rose-400 animate-bounce' : 'text-emerald-400'
              }`}
            />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Heart Rate</div>
              <div className="font-bold text-white text-sm">
                {activeCase.vitals.heartRate}
                {vitalsStatus.isTachycardic && (
                  <span className="ml-1 text-[9px] text-rose-400 font-sans font-bold">TACHY</span>
                )}
              </div>
            </div>
          </div>

          {/* SpO2 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2.5">
            <Droplets
              className={`w-4 h-4 ${vitalsStatus.isHypoxic ? 'text-rose-400 animate-pulse' : 'text-blue-400'}`}
            />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">SpO2 Pulse Ox</div>
              <div className="font-bold text-white text-sm">
                {activeCase.vitals.oxygenSaturation}
                {vitalsStatus.isHypoxic && (
                  <span className="ml-1 text-[9px] text-rose-400 font-sans font-bold">HYPOXIC</span>
                )}
              </div>
            </div>
          </div>

          {/* RR */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-teal-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Resp Rate</div>
              <div className="font-bold text-white text-sm">{activeCase.vitals.respiratoryRate}</div>
            </div>
          </div>

          {/* Temp */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2.5 col-span-2 sm:col-span-1">
            <Thermometer
              className={`w-4 h-4 ${vitalsStatus.isFebrile ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`}
            />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Temperature</div>
              <div className="font-bold text-white text-sm">
                {activeCase.vitals.temperature}
                {vitalsStatus.isFebrile && (
                  <span className="ml-1 text-[9px] text-amber-400 font-sans font-bold">FEBRILE</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 5-Stage Stepper Navigation */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
          {STAGES.map((s) => {
            const isActive = activeStage === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStage(s.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {s.icon}
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Stage Content Panels */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* ============================================================ */}
          {/* STAGE 1: TRIAGE & PRESENTATION */}
          {/* ============================================================ */}
          {activeStage === 'TRIAGE' && (
            <div className="space-y-6 animate-fade-in">
              {/* Chief Complaint Banner */}
              <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border border-blue-800/40 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Primary Emergency Triage Complaint
                </div>
                <p className="text-xl sm:text-2xl font-black text-white leading-snug">
                  &ldquo;{activeCase.chiefComplaint}&rdquo;
                </p>
              </div>

              {/* History of Present Illness */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  History of Present Illness (HPI)
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  {activeCase.historyOfPresentIllness}
                </p>
              </div>

              {/* Patient Demographics & Risk Factors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/40 border border-slate-800/70 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Patient Profile &amp; Risk Substrate
                  </h4>
                  <p className="text-sm text-slate-200 font-mono">
                    {activeCase.patientDemographics}
                  </p>
                </div>
                <div className="bg-slate-950/40 border border-slate-800/70 rounded-xl p-4 flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Encounter Progress
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Step 1 of 5 Completed</span>
                    <button
                      onClick={() => setActiveStage('WORKUP')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition"
                    >
                      Proceed to Exam &amp; Labs <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STAGE 2: PHYSICAL EXAM & DIAGNOSTIC WORKUP */}
          {/* ============================================================ */}
          {activeStage === 'WORKUP' && (
            <div className="space-y-6 animate-fade-in">
              {/* Physical Examination Findings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-blue-400" />
                    Bedside Physical Examination Findings
                  </h3>
                  <span className="text-xs text-slate-400">
                    {activeCase.physicalExamination.length} Systems Inspected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeCase.physicalExamination.map((finding, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-mono shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans">{finding}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diagnostic Laboratory Investigations */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Microscope className="w-4 h-4 text-emerald-400" />
                    Laboratory Diagnostic Panel (Order to Reveal)
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={revealAllLabs}
                      className="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
                    >
                      Order All STAT Panels ({activeCase.diagnosticWorkup.labInvestigations.length})
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {activeCase.diagnosticWorkup.labInvestigations.map((lab) => {
                    const isRevealed = revealedLabs.has(lab.test);
                    return (
                      <div
                        key={lab.test}
                        onClick={() => toggleLabReveal(lab.test)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isRevealed
                            ? lab.isAbnormal
                              ? 'bg-rose-950/20 border-rose-800/60 shadow-sm'
                              : 'bg-slate-950/70 border-slate-800'
                            : 'bg-slate-950/40 border-dashed border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-bold text-slate-200">{lab.test}</span>
                          {isRevealed ? (
                            lab.isAbnormal ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                ABNORMAL
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                NORMAL
                              </span>
                            )
                          ) : (
                            <span className="text-[10px] text-blue-400 font-semibold flex items-center gap-1">
                              Order <ChevronRight className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                        {isRevealed ? (
                          <div className="mt-2 space-y-1 text-xs">
                            <div className="font-mono font-bold text-white text-sm">
                              {lab.result}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Ref: {lab.referenceRange}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 text-[11px] text-slate-500 italic">
                            Click to send order to laboratory...
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Diagnostic Imaging Results */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-400" />
                    Imaging &amp; Specialized Investigation Findings
                  </h3>
                  <button
                    onClick={() => setRevealedImaging((prev) => !prev)}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                  >
                    {revealedImaging ? 'Hide Findings' : 'Inspect Imaging'}
                  </button>
                </div>

                {revealedImaging ? (
                  <div className="bg-purple-950/20 border border-purple-800/40 rounded-2xl p-4 text-sm text-slate-200 leading-relaxed font-sans animate-fade-in">
                    <div className="flex items-center gap-2 text-xs font-mono text-purple-300 mb-2">
                      <ShieldAlert className="w-4 h-4" />
                      Attending Radiologist / Specialist Report
                    </div>
                    {activeCase.diagnosticWorkup.imagingResults}
                  </div>
                ) : (
                  <div
                    onClick={() => setRevealedImaging(true)}
                    className="p-5 rounded-2xl border border-dashed border-purple-800/40 bg-purple-950/10 hover:bg-purple-950/20 cursor-pointer flex items-center justify-center gap-2 text-xs text-purple-300 font-semibold transition"
                  >
                    <Eye className="w-4 h-4" /> Click to view radiological / specialized imaging reports
                  </div>
                )}
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setActiveStage('TRIAGE')}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition font-medium"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to Triage
                </button>
                <button
                  onClick={() => setActiveStage('DIFFERENTIAL')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Rank Differential Diagnoses <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STAGE 3: DIFFERENTIAL DIAGNOSIS RANKING */}
          {/* ============================================================ */}
          {activeStage === 'DIFFERENTIAL' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-sm font-bold text-white mb-1">
                  Differential Diagnosis Ranking Board
                </h3>
                <p className="text-xs text-slate-400">
                  Analyze supporting and refuting evidence from history, physical exam, and labs to
                  determine the primary definitive etiology.
                </p>
              </div>

              {/* Differential Candidates */}
              <div className="space-y-3">
                {activeCase.differentialDiagnosisRanked.map((diff, index) => {
                  const isSelected = selectedDifferentialIndex === index;
                  return (
                    <div
                      key={diff.rank}
                      className={`border rounded-2xl p-4 transition-all ${
                        isSelected
                          ? 'bg-blue-950/30 border-blue-500 shadow-md ring-1 ring-blue-500'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              diff.rank === 1
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            #{diff.rank}
                          </span>
                          <h4 className="text-sm font-bold text-white">{diff.diagnosis}</h4>
                        </div>
                        <button
                          onClick={() =>
                            setSelectedDifferentialIndex((prev) => (prev === index ? null : index))
                          }
                          className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          {isSelected ? 'Collapse Evidence' : 'Inspect Evidence'}
                        </button>
                      </div>

                      {/* Evidence Breakdown */}
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs animate-fade-in">
                          <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-3 space-y-1">
                            <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Supporting Evidence
                            </span>
                            <p className="text-slate-200 leading-relaxed font-sans">
                              {diff.supportingEvidence}
                            </p>
                          </div>
                          <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-3 space-y-1">
                            <span className="font-bold text-rose-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Refuting / Distinguishing Clues
                            </span>
                            <p className="text-slate-200 leading-relaxed font-sans">
                              {diff.refutingEvidence}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Reveal Definitive Diagnosis Box */}
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Definitive Diagnosis Assessment
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ready to lock in the final clinical diagnosis based on the workup?
                  </p>
                </div>
                <button
                  onClick={() => setRevealedDiagnosis((prev) => !prev)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    revealedDiagnosis
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {revealedDiagnosis ? 'Diagnosis Confirmed' : 'Reveal Final Diagnosis'}
                </button>
              </div>

              {revealedDiagnosis && (
                <div className="bg-emerald-950/30 border border-emerald-700/60 rounded-2xl p-5 space-y-2 animate-fade-in shadow-lg">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    Pathognomonic Primary Diagnosis Confirmed
                  </div>
                  <p className="text-lg font-black text-white">{activeCase.definitiveDiagnosis}</p>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setActiveStage('WORKUP')}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition font-medium"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to Workup
                </button>
                <button
                  onClick={() => setActiveStage('MANAGEMENT')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Execute Treatment Protocol <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STAGE 4: EVIDENCE-BASED MANAGEMENT PROTOCOL */}
          {/* ============================================================ */}
          {activeStage === 'MANAGEMENT' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Guideline-Directed Management Checklist
                  </h3>
                  <p className="text-xs text-slate-400">
                    Execute the evidence-based clinical steps according to statutory medical council
                    guidelines.
                  </p>
                </div>
                <div className="text-xs font-mono text-blue-400 font-bold bg-blue-950/40 border border-blue-800/40 px-3 py-1.5 rounded-lg">
                  {checkedProtocols.size} / {activeCase.managementProtocol.length} Orders Completed
                </div>
              </div>

              {/* Step-by-step protocol checklist */}
              <div className="space-y-2.5">
                {activeCase.managementProtocol.map((order, idx) => {
                  const isChecked = checkedProtocols.has(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleProtocolChecked(idx)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-800/60 text-slate-100 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isChecked
                            ? 'bg-emerald-500 text-slate-950'
                            : 'border border-slate-700 bg-slate-900'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div className="flex-1 text-xs leading-relaxed font-sans">
                        <span className="font-bold font-mono mr-2 text-blue-400">
                          Order {idx + 1}:
                        </span>
                        {order}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Completion Feedback */}
              {checkedProtocols.size === activeCase.managementProtocol.length && (
                <div className="bg-emerald-950/30 border border-emerald-700/60 rounded-2xl p-4 flex items-center gap-3 text-xs text-emerald-300 animate-fade-in font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  All guideline-directed clinical management orders have been successfully verified
                  and administered!
                </div>
              )}

              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setActiveStage('DIFFERENTIAL')}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition font-medium"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to Differentials
                </button>
                <button
                  onClick={() => setActiveStage('PEARLS')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Grand Rounds Pearls <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STAGE 5: GRAND ROUNDS REVIEW & HIGH-YIELD PEARLS */}
          {/* ============================================================ */}
          {activeStage === 'PEARLS' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-r from-indigo-950/30 via-purple-950/20 to-slate-900 border border-indigo-800/40 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                  <Award className="w-4 h-4" />
                  Statutory Board &amp; Licensure Exam Focus
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Grand Rounds Clinical Takeaways &amp; Pearls
                </h3>
                <p className="text-xs text-slate-400">
                  Critical medical knowledge points, contraindications, and high-yield examination
                  principles.
                </p>
              </div>

              {/* Pearls List */}
              <div className="space-y-3">
                {activeCase.clinicalPearls.map((pearl, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-start gap-3.5"
                  >
                    <div className="w-7 h-7 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      ★
                    </div>
                    <div className="text-xs text-slate-200 leading-relaxed font-sans">
                      <span className="font-bold text-indigo-300 block mb-0.5">
                        High-Yield Clinical Pearl #{idx + 1}
                      </span>
                      {pearl}
                    </div>
                  </div>
                ))}
              </div>

              {/* Case Completion Trophy Banner */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">
                    🏆
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Case Encounter Completed!</h4>
                    <p className="text-xs text-slate-400">
                      You have worked through the full presentation, diagnostics, and management.
                    </p>
                  </div>
                </div>

                <button
                  onClick={openAiTutorWithContext}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  Discuss Case with AI Socratic Tutor
                </button>
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setActiveStage('MANAGEMENT')}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition font-medium"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to Treatment Orders
                </button>

                {/* Next Case Button */}
                <button
                  onClick={() => {
                    const currentIndex = caseList.findIndex((c) => c.id === activeCaseId);
                    const nextIndex = (currentIndex + 1) % caseList.length;
                    setActiveCaseId(caseList[nextIndex].id);
                    resetEncounter();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Next Clinical Case <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
