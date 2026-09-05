'use client';

import React, { useState, useMemo } from 'react';
import {
  DrugRecord,
  CLINICAL_FORMULARY,
  evaluatePrescriptionSafety,
  SafetyCheckResult,
  AllergyProfile,
  PatientSafetyContext,
} from '@/.gemini/skills/DrugInteractionEngine';
import {
  FilePlus,
  TestTube,
  Image as ImageIcon,
  Pill,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  XCircle,
  Check,
  Activity,
  HeartPulse,
  ClipboardList,
  Baby,
  FileSignature,
  Flame,
  Zap,
  Stethoscope,
  ShieldAlert,
  RotateCcw,
} from 'lucide-react';

export interface LabOrder {
  id: string;
  name: string;
  category: 'HEMATOLOGY' | 'CHEMISTRY' | 'CARDIAC' | 'MICROBIOLOGY';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED';
  result?: string;
  isPanicValue?: boolean;
}

export interface ImagingOrder {
  id: string;
  modality: 'CXR' | 'CT' | 'MRI' | 'ECG' | 'ECHO';
  title: string;
  indication: string;
  status: 'PENDING' | 'COMPLETED';
  radiologistReport?: string;
}

export interface ActivePrescription {
  id: string;
  drug: DrugRecord;
  dose: string;
  route: string;
  frequency: string;
  orderedAt: string;
  overrideReason?: string;
  overrideClinician?: string;
}

export interface CpoeOrderSystemProps {
  patientName?: string;
  systolicBp?: number;
  heartRate?: number;
  eGfr?: number;
  knownAllergies?: AllergyProfile[];
  initialIsPregnant?: boolean;
  initialPatientQtcMs?: number;
  initialWeightKg?: number;
  onOrderPlaced?: (type: 'LAB' | 'IMAGING' | 'MEDICATION', details: any) => void;
}

const OVERRIDE_RATIONALE_PRESETS = [
  'Specialist Attending / Cardiology Consult Approved',
  'Continuous ICU Telemetry & Cardiac Rhythm Monitoring Active',
  'Clinical Benefit Outweighs Risk; Daily Electrolyte/Serum TDM Ordered',
  'Alternative Antimicrobial/Cardiovascular Regimens Contraindicated',
  'Renal Dose Adjusted for Measured Creatinine Clearance',
  'Urgent Resuscitation Measure; Close Attending Supervision',
];

export default function CpoeOrderSystem({
  patientName = 'Ramesh Sundaram (MRN: MED-99201)',
  systolicBp = 88,
  heartRate = 104,
  eGfr = 28,
  knownAllergies = [{ allergen: 'Penicillin', reactionType: 'ANAPHYLAXIS', severity: 'SEVERE' }],
  initialIsPregnant = false,
  initialPatientQtcMs = 430,
  initialWeightKg = 72,
  onOrderPlaced,
}: CpoeOrderSystemProps) {
  const [activeTab, setActiveTab] = useState<'MEDS' | 'LABS' | 'IMAGING' | 'PROTOCOLS'>('MEDS');

  // Interactive Patient Safety Context
  const [patientSbp, setPatientSbp] = useState(systolicBp);
  const [patientHr, setPatientHr] = useState(heartRate);
  const [patientEgfr, setPatientEgfr] = useState(eGfr);
  const [isPregnant, setIsPregnant] = useState(initialIsPregnant);
  const [patientQtcMs, setPatientQtcMs] = useState(initialPatientQtcMs);
  const [patientWeightKg, setPatientWeightKg] = useState(initialWeightKg);
  const [patientAllergies, setPatientAllergies] = useState<AllergyProfile[]>(knownAllergies);

  // Placed Orders
  const [placedLabOrders, setPlacedLabOrders] = useState<LabOrder[]>([
    {
      id: 'LAB-1',
      name: 'High-Sensitivity Cardiac Troponin I (hs-cTnI)',
      category: 'CARDIAC',
      status: 'COMPLETED',
      result: '1,480 ng/L [Ref: < 14 ng/L] — CRITICAL HIGH',
      isPanicValue: true,
    },
    {
      id: 'LAB-2',
      name: 'Complete Blood Count (CBC) with Differential',
      category: 'HEMATOLOGY',
      status: 'COMPLETED',
      result: 'Hb: 14.2 g/dL, WBC: 11,800/uL, Platelets: 240,000/uL',
    },
  ]);

  const [placedImagingOrders, setPlacedImagingOrders] = useState<ImagingOrder[]>([
    {
      id: 'RAD-1',
      modality: 'ECG',
      title: 'Stat 12-Lead Electrocardiogram',
      indication: 'Crushing retrosternal chest pain radiating to jaw',
      status: 'COMPLETED',
      radiologistReport:
        'Sinus tachycardia at 104 bpm. Marked 4 mm ST-segment elevation in leads V1-V4 with reciprocal depressions in III and aVF. Diagnostic of Acute Anterior STEMI (Proximal LAD occlusion).',
    },
  ]);

  const [activeMeds, setActiveMeds] = useState<ActivePrescription[]>([
    {
      id: 'MED-1',
      drug: CLINICAL_FORMULARY.find((d) => d.id === 'aspirin')!,
      dose: '300 mg chewable',
      route: 'PO',
      frequency: 'STAT once',
      orderedAt: '08:15',
    },
  ]);

  // Medication Entry State
  const [selectedDrugId, setSelectedDrugId] = useState(CLINICAL_FORMULARY[0].id);
  const [selectedRoute, setSelectedRoute] = useState('PO');
  const [selectedDose, setSelectedDose] = useState('');
  const [safetyEvaluation, setSafetyEvaluation] = useState<SafetyCheckResult | null>(null);

  // Override & Fatal Modals State
  const [overrideModalData, setOverrideModalData] = useState<{
    drug: DrugRecord;
    dose: string;
    route: string;
    alerts: SafetyCheckResult['alerts'];
  } | null>(null);
  const [overrideRationaleChoice, setOverrideRationaleChoice] = useState(OVERRIDE_RATIONALE_PRESETS[0]);
  const [overrideFreeText, setOverrideFreeText] = useState('');
  const [overrideClinicianName, setOverrideClinicianName] = useState('Dr. Ramesh Sundaram, MD (Critical Care / Cardiology)');
  const [overrideConsentAcknowledged, setOverrideConsentAcknowledged] = useState(false);

  const [fatalInterceptData, setFatalInterceptData] = useState<{
    drug: DrugRecord;
    alerts: SafetyCheckResult['alerts'];
  } | null>(null);

  // Protocols State
  const [sepsisBundleApplied, setSepsisBundleApplied] = useState(false);
  const [stemiBundleApplied, setStemiBundleApplied] = useState(false);
  const [peBundleApplied, setPeBundleApplied] = useState(false);

  // Wells PE Calculator State
  const [wellsCriteria, setWellsCriteria] = useState<{
    dvtSigns: boolean;
    peMostLikely: boolean;
    tachycardia: boolean;
    immobilization: boolean;
    priorDvtPe: boolean;
    hemoptysis: boolean;
    malignancy: boolean;
  }>({
    dvtSigns: true,
    peMostLikely: true,
    tachycardia: true,
    immobilization: false,
    priorDvtPe: false,
    hemoptysis: false,
    malignancy: false,
  });

  const selectedDrug = useMemo(() => {
    return CLINICAL_FORMULARY.find((d) => d.id === selectedDrugId) || CLINICAL_FORMULARY[0];
  }, [selectedDrugId]);

  // Wells Score Calculation
  const wellsScore = useMemo(() => {
    let score = 0;
    if (wellsCriteria.dvtSigns) score += 3.0;
    if (wellsCriteria.peMostLikely) score += 3.0;
    if (wellsCriteria.tachycardia) score += 1.5;
    if (wellsCriteria.immobilization) score += 1.5;
    if (wellsCriteria.priorDvtPe) score += 1.5;
    if (wellsCriteria.hemoptysis) score += 1.0;
    if (wellsCriteria.malignancy) score += 1.0;
    return score;
  }, [wellsCriteria]);

  const wellsRiskTier = useMemo(() => {
    if (wellsScore < 2) return { label: 'Low Probability (<10%)', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800', recommendation: 'Apply PERC Rule or obtain High-Sensitivity D-dimer. If negative, PE is reliably ruled out.' };
    if (wellsScore <= 6) return { label: 'Moderate Probability (~30%)', color: 'text-amber-400 bg-amber-950/60 border-amber-800', recommendation: 'Obtain STAT D-dimer. If D-dimer > 500 ng/mL, proceed immediately to CT Pulmonary Angiogram (CTPA).' };
    return { label: 'High Probability (>65%)', color: 'text-rose-400 bg-rose-950/60 border-rose-800 animate-pulse', recommendation: 'Proceed directly to STAT CTPA without awaiting D-dimer. Initiate immediate empiric parenteral anticoagulation.' };
  }, [wellsScore]);

  // Core Safety Evaluation Wrapper
  const runSafetyEvaluation = (drug: DrugRecord) => {
    const activeDrugRecords = activeMeds.map((m) => m.drug);
    const context: PatientSafetyContext = {
      systolicBp: patientSbp,
      heartRate: patientHr,
      eGfr: patientEgfr,
      patientQtcMs,
      isPregnant,
      weightKg: patientWeightKg,
    };
    return evaluatePrescriptionSafety(
      drug,
      activeDrugRecords,
      patientAllergies,
      { systolicBp: patientSbp, heartRate: patientHr },
      patientEgfr,
      context
    );
  };

  const handleEvaluateSafety = (drug: DrugRecord) => {
    const result = runSafetyEvaluation(drug);
    setSafetyEvaluation(result);
  };

  const commitPrescription = (
    drug: DrugRecord,
    dose: string,
    route: string,
    overrideReason?: string,
    overrideClinician?: string
  ) => {
    const newPrescription: ActivePrescription = {
      id: `MED-${Date.now().toString().slice(-4)}`,
      drug,
      dose,
      route,
      frequency: 'STAT / ONCE',
      orderedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      overrideReason,
      overrideClinician,
    };

    setActiveMeds((prev) => [...prev, newPrescription]);
    setSafetyEvaluation(null);

    if (onOrderPlaced) {
      onOrderPlaced('MEDICATION', newPrescription);
    }
  };

  const handlePlaceMedicationOrder = () => {
    const result = runSafetyEvaluation(selectedDrug);
    setSafetyEvaluation(result);

    if (result.highestSeverity === 'FATAL_CONTRAINDICATION') {
      setFatalInterceptData({
        drug: selectedDrug,
        alerts: result.alerts.filter((a) => a.severity === 'FATAL_CONTRAINDICATION'),
      });
      return;
    }

    if (result.highestSeverity === 'MAJOR_WARNING') {
      setOverrideModalData({
        drug: selectedDrug,
        dose: selectedDose || selectedDrug.standardDose,
        route: selectedRoute,
        alerts: result.alerts.filter((a) => a.severity === 'MAJOR_WARNING'),
      });
      return;
    }

    commitPrescription(selectedDrug, selectedDose || selectedDrug.standardDose, selectedRoute);
  };

  const handleConfirmOverride = () => {
    if (!overrideModalData || !overrideConsentAcknowledged) return;
    const finalReason = overrideFreeText
      ? `${overrideRationaleChoice} — Note: ${overrideFreeText}`
      : overrideRationaleChoice;

    commitPrescription(
      overrideModalData.drug,
      overrideModalData.dose,
      overrideModalData.route,
      finalReason,
      overrideClinicianName
    );

    setOverrideModalData(null);
    setOverrideConsentAcknowledged(false);
    setOverrideFreeText('');
  };

  const handleAddLab = (name: string, category: LabOrder['category'], resultText: string, isPanic = false) => {
    const newLab: LabOrder = {
      id: `LAB-${Date.now().toString().slice(-4)}`,
      name,
      category,
      status: 'COMPLETED',
      result: resultText,
      isPanicValue: isPanic,
    };
    setPlacedLabOrders((prev) => [...prev, newLab]);
    if (onOrderPlaced) onOrderPlaced('LAB', newLab);
  };

  const handleAddImaging = (modality: ImagingOrder['modality'], title: string, report: string) => {
    const newImg: ImagingOrder = {
      id: `RAD-${Date.now().toString().slice(-4)}`,
      modality,
      title,
      indication: 'Acute clinical protocol pathway',
      status: 'COMPLETED',
      radiologistReport: report,
    };
    setPlacedImagingOrders((prev) => [...prev, newImg]);
    if (onOrderPlaced) onOrderPlaced('IMAGING', newImg);
  };

  // Protocols Deploy Handlers
  const handleDeploySepsisBundle = () => {
    // 1. Labs: Blood cultures x2, STAT Lactate
    handleAddLab('Blood Cultures x 2 sets (Aerobic & Anaerobic)', 'MICROBIOLOGY', 'Pending incubation: 2 of 2 bottles drawn prior to antibiotics');
    handleAddLab('STAT Venous Blood Lactate', 'CHEMISTRY', '4.2 mmol/L [Ref: 0.5-2.0] — CRITICAL HIGH', true);

    // 2. Meds: Pip-Tazo, Vancomycin, Crystalloids, Norepinephrine
    const piptazo = CLINICAL_FORMULARY.find((d) => d.id === 'piperacillin-tazobactam');
    const vanc = CLINICAL_FORMULARY.find((d) => d.id === 'vancomycin');
    const norepi = CLINICAL_FORMULARY.find((d) => d.id === 'norepinephrine');

    if (piptazo) commitPrescription(piptazo, piptazo.standardDose, 'IV', 'Sepsis 1-Hour Care Bundle', 'SSC Clinical Protocol');
    if (vanc) commitPrescription(vanc, vanc.standardDose, 'IV', 'Sepsis 1-Hour Care Bundle (AUC TDM)', 'SSC Clinical Protocol');
    if (norepi) commitPrescription(norepi, norepi.standardDose, 'IV', 'Sepsis 1-Hour Care Bundle (MAP >= 65)', 'SSC Clinical Protocol');

    setSepsisBundleApplied(true);
  };

  const handleDeployStemiBundle = () => {
    // 1. Imaging & Labs
    handleAddImaging('ECG', 'STAT 12-Lead Electrocardiogram', 'Sinus rhythm with marked 4mm ST elevations V1-V4. Reciprocal depressions in III, aVF. Hyperacute Anterior STEMI.');
    handleAddLab('High-Sensitivity Cardiac Troponin I (hs-cTnI)', 'CARDIAC', '2,150 ng/L [Ref: < 14 ng/L] — CRITICAL HIGH', true);

    // 2. Meds: DAPT (Aspirin + Ticagrelor) + Atorvastatin 80mg + Enoxaparin
    const aspirin = CLINICAL_FORMULARY.find((d) => d.id === 'aspirin');
    const ticagrelor = CLINICAL_FORMULARY.find((d) => d.id === 'ticagrelor');
    const atorvastatin = CLINICAL_FORMULARY.find((d) => d.id === 'atorvastatin');
    const enoxaparin = CLINICAL_FORMULARY.find((d) => d.id === 'enoxaparin');

    if (aspirin) commitPrescription(aspirin, '300 mg chewable', 'PO', 'AHA/ACC STEMI Pathway DAPT', 'STEMI Protocol');
    if (ticagrelor) commitPrescription(ticagrelor, '180 mg loading dose', 'PO', 'AHA/ACC STEMI Pathway DAPT', 'STEMI Protocol');
    if (atorvastatin && !isPregnant) {
      commitPrescription(atorvastatin, '80 mg STAT', 'PO', 'AHA/ACC STEMI High-Intensity Statin', 'STEMI Protocol');
    }
    if (enoxaparin) commitPrescription(enoxaparin, '1 mg/kg SC STAT', 'SC', 'AHA/ACC STEMI Anticoagulation', 'STEMI Protocol');

    setStemiBundleApplied(true);
  };

  const handleDeployPeBundle = () => {
    // 1. Lab & Imaging
    handleAddLab('STAT Quantitative D-Dimer', 'HEMATOLOGY', '2,890 ng/mL FEU [Ref: < 500 ng/mL] — MARKEDLY ELEVATED', true);
    handleAddImaging('CT', 'STAT CT Pulmonary Angiography (CTPA)', 'Contrast-enhanced chest CT shows occlusive saddle embolus at bifurcation of main pulmonary artery extending into right and left main pulmonary arteries. Severe RV strain.');

    // 2. Therapeutic Anticoagulation
    const enoxaparin = CLINICAL_FORMULARY.find((d) => d.id === 'enoxaparin');
    if (enoxaparin) {
      commitPrescription(enoxaparin, `${patientWeightKg} mg SC q12h (1 mg/kg)`, 'SC', 'Wells High-Risk PE Anticoagulation', 'PE Clinical Protocol');
    }

    setPeBundleApplied(true);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5 text-slate-100">
      {/* CPOE Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-400">
            <FilePlus size={22} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <span>Hospital CPOE & Clinical Decision Support</span>
              <span className="text-[11px] font-mono font-normal bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded-full">
                CDS Pharmacovigilance Active
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Evidence-based computerized physician order entry with real-time DDI, QTc prolongation, CYP450, and teratogenicity screening.
            </p>
          </div>
        </div>

        {/* Patient Name Banner */}
        <div className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          Patient: <strong className="text-white">{patientName}</strong>
        </div>
      </div>

      {/* Interactive Patient Safety Profile Bar */}
      <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <HeartPulse size={14} className="text-rose-400" /> Patient CDS Safety Profile & Vitals Matrix
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Live dynamic parameter tuning</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs font-mono">
          {/* SBP */}
          <div className={`p-2 rounded-lg border flex flex-col justify-between ${
            patientSbp < 90 ? 'bg-rose-950/40 border-rose-800 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <span className="text-[10px] text-slate-400">Systolic BP</span>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">{patientSbp} mmHg</span>
              <button
                onClick={() => setPatientSbp((v) => (v === 88 ? 124 : 88))}
                className="text-[10px] underline text-indigo-400 hover:text-indigo-300"
              >
                {patientSbp < 90 ? 'Normotensive' : 'Hypotensive'}
              </button>
            </div>
          </div>

          {/* Heart Rate */}
          <div className={`p-2 rounded-lg border flex flex-col justify-between ${
            patientHr > 100 ? 'bg-amber-950/40 border-amber-800 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <span className="text-[10px] text-slate-400">Heart Rate</span>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">{patientHr} bpm</span>
              <button
                onClick={() => setPatientHr((v) => (v === 104 ? 72 : 104))}
                className="text-[10px] underline text-indigo-400 hover:text-indigo-300"
              >
                {patientHr > 100 ? 'Normal' : 'Tachycardic'}
              </button>
            </div>
          </div>

          {/* eGFR */}
          <div className={`p-2 rounded-lg border flex flex-col justify-between ${
            patientEgfr < 30 ? 'bg-amber-950/40 border-amber-800 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <span className="text-[10px] text-slate-400">eGFR (CKD Stage)</span>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">{patientEgfr} mL/min</span>
              <button
                onClick={() => setPatientEgfr((v) => (v === 28 ? 95 : 28))}
                className="text-[10px] underline text-indigo-400 hover:text-indigo-300"
              >
                {patientEgfr < 30 ? 'Restore 95' : 'CKD-4 (28)'}
              </button>
            </div>
          </div>

          {/* QTc Interval */}
          <div className={`p-2 rounded-lg border flex flex-col justify-between ${
            patientQtcMs >= 500
              ? 'bg-rose-950/50 border-rose-800 text-rose-300 animate-pulse'
              : patientQtcMs >= 460
              ? 'bg-amber-950/40 border-amber-800 text-amber-300'
              : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
          }`}>
            <span className="text-[10px] text-slate-400">Baseline QTc</span>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">{patientQtcMs} ms</span>
              <button
                onClick={() => setPatientQtcMs((v) => (v >= 500 ? 430 : v >= 460 ? 515 : 475))}
                className="text-[10px] underline text-indigo-400 hover:text-indigo-300"
              >
                Toggle
              </button>
            </div>
          </div>

          {/* Pregnancy Toggle */}
          <div className={`p-2 rounded-lg border flex flex-col justify-between ${
            isPregnant ? 'bg-pink-950/50 border-pink-700 text-pink-300' : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Baby size={12} /> Pregnancy
            </span>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs">{isPregnant ? 'YES (3rd Tri)' : 'NO'}</span>
              <button
                onClick={() => setIsPregnant((v) => !v)}
                className="text-[10px] underline text-indigo-400 hover:text-indigo-300"
              >
                {isPregnant ? 'Clear' : 'Set Active'}
              </button>
            </div>
          </div>

          {/* Allergies Pill */}
          <div className="p-2 rounded-lg border bg-slate-900 border-slate-800 text-slate-300 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Documented Allergies</span>
            <div className="flex flex-wrap gap-1">
              {patientAllergies.map((a, i) => (
                <span key={i} className="text-[10px] bg-rose-950 border border-rose-800 text-rose-300 px-1 py-0.5 rounded">
                  {a.allergen}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-950 border border-slate-800 p-1.5 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('MEDS')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
            activeTab === 'MEDS' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Pill size={14} /> Medication eMAR & Safety ({activeMeds.length})
        </button>
        <button
          onClick={() => setActiveTab('LABS')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
            activeTab === 'LABS' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TestTube size={14} /> Diagnostic Labs ({placedLabOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('IMAGING')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
            activeTab === 'IMAGING' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon size={14} /> Radiology & Imaging ({placedImagingOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('PROTOCOLS')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
            activeTab === 'PROTOCOLS' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ClipboardList size={14} /> Clinical Protocols & Bundles
        </button>
      </div>

      {/* 1. MEDICATION eMAR TAB */}
      {activeTab === 'MEDS' && (
        <div className="space-y-5">
          {/* Order Placement Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Sparkles size={13} /> Order Inpatient Pharmacotherapy
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* Formulary Select */}
              <div>
                <label htmlFor="med-form-select" className="text-slate-400 font-mono text-[11px] block mb-1">Medication Form & Class</label>
                <select
                  id="med-form-select"
                  value={selectedDrugId}
                  onChange={(e) => {
                    setSelectedDrugId(e.target.value);
                    const d = CLINICAL_FORMULARY.find((item) => item.id === e.target.value);
                    if (d) handleEvaluateSafety(d);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 p-2.5 rounded-lg outline-none focus:border-indigo-500 font-medium"
                >
                  {CLINICAL_FORMULARY.map((drug) => (
                    <option key={drug.id} value={drug.id}>
                      {drug.name} ({drug.genericName}) — {drug.drugClass}
                    </option>
                  ))}
                </select>
              </div>

              {/* Route */}
              <div>
                <label htmlFor="med-route-select" className="text-slate-400 font-mono text-[11px] block mb-1">Route</label>
                <select
                  id="med-route-select"
                  value={selectedRoute}
                  onChange={(e) => setSelectedRoute(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 p-2.5 rounded-lg outline-none focus:border-indigo-500 font-medium"
                >
                  {selectedDrug.routes.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Standard Dose */}
              <div>
                <label htmlFor="med-dose-input" className="text-slate-400 font-mono text-[11px] block mb-1">Dose Specification</label>
                <input
                  id="med-dose-input"
                  type="text"
                  value={selectedDose || selectedDrug.standardDose}
                  onChange={(e) => setSelectedDose(e.target.value)}
                  placeholder={selectedDrug.standardDose}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 p-2.5 rounded-lg outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            {/* Drug CDS Metadata Chips */}
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              {selectedDrug.pregnancyCategory && (
                <span className={`px-2 py-0.5 rounded border ${
                  selectedDrug.pregnancyCategory === 'X'
                    ? 'bg-rose-950/80 border-rose-700 text-rose-300 font-bold'
                    : selectedDrug.pregnancyCategory === 'D'
                    ? 'bg-amber-950/80 border-amber-700 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}>
                  FDA Preg Cat: {selectedDrug.pregnancyCategory}
                </span>
              )}
              {selectedDrug.qtcRisk && selectedDrug.qtcRisk !== 'NONE' && (
                <span className={`px-2 py-0.5 rounded border ${
                  selectedDrug.qtcRisk === 'HIGH'
                    ? 'bg-rose-950/80 border-rose-700 text-rose-300 font-bold'
                    : 'bg-amber-950/80 border-amber-700 text-amber-300'
                }`}>
                  QTc Risk: {selectedDrug.qtcRisk}
                </span>
              )}
              {selectedDrug.cypSubstrates && selectedDrug.cypSubstrates.length > 0 && (
                <span className="bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded">
                  Substrate: {selectedDrug.cypSubstrates.join(', ')}
                </span>
              )}
              {selectedDrug.cypInhibitors && selectedDrug.cypInhibitors.length > 0 && (
                <span className="bg-slate-800 border border-slate-700 text-indigo-300 px-2 py-0.5 rounded">
                  Inhibitor: {selectedDrug.cypInhibitors.join(', ')}
                </span>
              )}
              {selectedDrug.isSulfaContaining && (
                <span className="bg-amber-950 border border-amber-700 text-amber-300 px-2 py-0.5 rounded">
                  Sulfonamide Derivative
                </span>
              )}
            </div>

            {/* Live Safety Check Bar */}
            {safetyEvaluation && (
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
                  safetyEvaluation.highestSeverity === 'FATAL_CONTRAINDICATION'
                    ? 'bg-rose-950/80 border-rose-600 text-rose-200'
                    : safetyEvaluation.highestSeverity === 'MAJOR_WARNING'
                    ? 'bg-amber-950/80 border-amber-600 text-amber-200'
                    : 'bg-emerald-950/60 border-emerald-600 text-emerald-200'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {safetyEvaluation.highestSeverity === 'FATAL_CONTRAINDICATION' ? (
                      <>
                        <AlertTriangle size={16} className="text-rose-400" />
                        <span>CRITICAL SAFETY RED FLAG — DO NOT ADMINISTER</span>
                      </>
                    ) : safetyEvaluation.highestSeverity === 'MAJOR_WARNING' ? (
                      <>
                        <AlertTriangle size={16} className="text-amber-400" />
                        <span>CLINICAL OVERRIDE REQUIRED FOR TRANSMISSION</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} className="text-emerald-400" />
                        <span>Pharmacology Safety Screening Cleared</span>
                      </>
                    )}
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                    Severity: {safetyEvaluation.highestSeverity}
                  </span>
                </div>

                {safetyEvaluation.alerts.map((alt, idx) => (
                  <div key={idx} className="border-t border-slate-800/80 pt-1.5 space-y-0.5 font-mono text-[11px]">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="text-rose-400">[{alt.ruleId}]</span> {alt.title}
                    </div>
                    <div>{alt.description}</div>
                    <div className="text-amber-300">Action: {alt.recommendation}</div>
                  </div>
                ))}

                {safetyEvaluation.renalAlert?.required && (
                  <div className="border-t border-slate-800/80 pt-1.5 font-mono text-[11px] text-amber-300">
                    <strong>Renal Adjustment Note:</strong> {safetyEvaluation.renalAlert.recommendation}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleEvaluateSafety(selectedDrug)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5"
              >
                <ShieldCheck size={14} /> Run Safety Screening
              </button>
              <button
                onClick={handlePlaceMedicationOrder}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow flex items-center gap-1.5"
              >
                <FileSignature size={14} /> Sign & Transmit Prescription
              </button>
            </div>
          </div>

          {/* Active Medication Administration Record (eMAR) List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity size={13} className="text-indigo-400" /> Active Inpatient eMAR Flowsheet
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">{activeMeds.length} Active Infusions / Doses</span>
            </div>

            <div className="divide-y divide-slate-800 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden text-xs">
              {activeMeds.map((med) => (
                <div key={med.id} className="p-3.5 space-y-1.5 hover:bg-slate-900/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{med.drug.name}</span>
                      <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                        {med.route}
                      </span>
                      {med.drug.pregnancyCategory && (
                        <span className="text-[10px] font-mono bg-slate-900 border border-slate-700 text-slate-400 px-1 py-0.2 rounded">
                          Cat {med.drug.pregnancyCategory}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={12} /> Active Infusion / Administered
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono flex flex-wrap items-center gap-3">
                    <span>Dose: {med.dose}</span>
                    <span>•</span>
                    <span>Schedule: {med.frequency}</span>
                    <span>•</span>
                    <span>Ordered: {med.orderedAt}</span>
                  </div>

                  {med.overrideReason && (
                    <div className="bg-amber-950/40 border border-amber-800/50 rounded-lg p-2 text-[11px] font-mono text-amber-300 mt-1">
                      <div className="font-bold flex items-center gap-1">
                        <AlertTriangle size={12} /> Clinician Override Authorized:
                      </div>
                      <div>{med.overrideReason}</div>
                      {med.overrideClinician && (
                        <div className="text-slate-400 text-[10px] mt-0.5">Signed by: {med.overrideClinician}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. DIAGNOSTIC LABS TAB */}
      {activeTab === 'LABS' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              {
                name: 'Basic Metabolic Panel (BMP)',
                cat: 'CHEMISTRY' as const,
                res: 'Na: 138 mEq/L, K: 4.8 mEq/L, Creatinine: 2.1 mg/dL, BUN: 34 mg/dL',
              },
              {
                name: 'Arterial Blood Gas (ABG)',
                cat: 'CHEMISTRY' as const,
                res: 'pH: 7.34, PaCO2: 36 mmHg, PaO2: 72 mmHg, HCO3: 19 mEq/L, Lactate: 2.8 mmol/L (Mild lactic acidosis)',
                panic: true,
              },
              {
                name: 'Coagulation Panel (PT/INR, aPTT)',
                cat: 'HEMATOLOGY' as const,
                res: 'PT: 12.1s, INR: 1.05, aPTT: 28s (Within normal limits)',
              },
              {
                name: 'STAT Serum Lactate',
                cat: 'CHEMISTRY' as const,
                res: 'Lactate: 4.1 mmol/L [Ref: 0.5-2.0] — CRITICAL HIGH',
                panic: true,
              },
              {
                name: 'Blood Cultures x 2 Sets',
                cat: 'MICROBIOLOGY' as const,
                res: 'Gram-positive cocci in clusters (Staphylococcus sp.) isolated from 2/2 bottles',
                panic: true,
              },
            ].map((preset, i) => (
              <button
                key={i}
                onClick={() => handleAddLab(preset.name, preset.cat, preset.res, preset.panic)}
                className="text-xs bg-slate-950 border border-slate-800 hover:border-indigo-500 text-slate-300 px-3 py-1.5 rounded-lg font-mono transition-all"
              >
                + Order {preset.name}
              </button>
            ))}
          </div>

          {/* Labs Flowsheet */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800 text-xs">
            {placedLabOrders.map((lab) => (
              <div key={lab.id} className="p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{lab.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {lab.category}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      lab.isPanicValue
                        ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {lab.status}
                  </span>
                </div>
                <div
                  className={`font-mono text-xs ${
                    lab.isPanicValue ? 'text-rose-400 font-bold' : 'text-slate-300'
                  }`}
                >
                  {lab.result}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. RADIOLOGY & IMAGING TAB */}
      {activeTab === 'IMAGING' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              {
                mod: 'CXR' as const,
                title: 'Portable Chest Radiography (AP)',
                rep: 'Clear lung fields without focal consolidation or pneumothorax. Cardiothoracic ratio borderline enlarged. Mediastinum normal contour.',
              },
              {
                mod: 'ECHO' as const,
                title: 'Bedside Transthoracic Echocardiogram (TTE)',
                rep: 'Akinesis of anterior wall and cardiac apex. Left ventricular ejection fraction (LVEF) ~35%. No significant valvular stenosis.',
              },
              {
                mod: 'CT' as const,
                title: 'STAT CT Pulmonary Angiography (CTPA)',
                rep: 'Contrast-enhanced chest CT shows occlusive saddle embolus at bifurcation of main pulmonary artery extending into right and left main pulmonary arteries. Severe RV strain.',
              },
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleAddImaging(preset.mod, preset.title, preset.rep)}
                className="text-xs bg-slate-950 border border-slate-800 hover:border-indigo-500 text-slate-300 px-3 py-1.5 rounded-lg font-mono transition-all"
              >
                + Order {preset.title}
              </button>
            ))}
          </div>

          {/* Radiology Results */}
          <div className="space-y-3">
            {placedImagingOrders.map((img) => (
              <div key={img.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">
                    [{img.modality}] {img.title}
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full">
                    {img.status}
                  </span>
                </div>
                <p className="text-slate-300 font-mono text-[11px] leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <strong className="text-indigo-400">Radiologist Impression: </strong>
                  {img.radiologistReport}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. EVIDENCE-BASED CLINICAL PROTOCOLS TAB */}
      {activeTab === 'PROTOCOLS' && (
        <div className="space-y-6">
          {/* Sepsis 1-Hour Care Bundle */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-950 border border-rose-800 text-rose-400">
                  <Flame size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Surviving Sepsis Campaign 1-Hour Care Bundle (SSC 2021)</h4>
                  <p className="text-[11px] text-slate-400">Target execution time: &le; 60 minutes from sepsis recognition.</p>
                </div>
              </div>
              <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
                sepsisBundleApplied ? 'bg-emerald-950 border-emerald-700 text-emerald-300' : 'bg-rose-950 border-rose-700 text-rose-300'
              }`}>
                {sepsisBundleApplied ? '✓ 5 / 5 Interventions Active' : 'Pending Deployment'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-2">
                <CheckCircle2 size={14} className={sepsisBundleApplied ? 'text-emerald-400' : 'text-slate-500'} />
                <div>
                  <strong className="text-slate-200">1. Measure Blood Lactate Level</strong>
                  <div className="text-[11px] text-slate-400">STAT venous lactate. Re-measure within 2-4 hours if &gt; 2 mmol/L.</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-2">
                <CheckCircle2 size={14} className={sepsisBundleApplied ? 'text-emerald-400' : 'text-slate-500'} />
                <div>
                  <strong className="text-slate-200">2. Blood Cultures x 2 Sets</strong>
                  <div className="text-[11px] text-slate-400">Obtain peripheral blood cultures prior to initiation of antimicrobials.</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-2">
                <CheckCircle2 size={14} className={sepsisBundleApplied ? 'text-emerald-400' : 'text-slate-500'} />
                <div>
                  <strong className="text-slate-200">3. Broad-Spectrum IV Antibiotics</strong>
                  <div className="text-[11px] text-slate-400">Piperacillin-Tazobactam 4.5g IV + Vancomycin 1.5g IV.</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-2">
                <CheckCircle2 size={14} className={sepsisBundleApplied ? 'text-emerald-400' : 'text-slate-500'} />
                <div>
                  <strong className="text-slate-200">4. 30 mL/kg Balanced Crystalloid Bolus</strong>
                  <div className="text-[11px] text-slate-400">Rapid IV crystalloid resuscitation for hypotension (MAP &lt; 65) or lactate &ge; 4.</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-2 md:col-span-2">
                <CheckCircle2 size={14} className={sepsisBundleApplied ? 'text-emerald-400' : 'text-slate-500'} />
                <div>
                  <strong className="text-slate-200">5. Vasopressors (Norepinephrine Titration)</strong>
                  <div className="text-[11px] text-slate-400">Apply vasopressors if hypotensive during/after fluid resuscitation to maintain MAP &ge; 65 mmHg.</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleDeploySepsisBundle}
                disabled={sepsisBundleApplied}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  sepsisBundleApplied
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg'
                }`}
              >
                <Flame size={14} />
                {sepsisBundleApplied ? 'Sepsis Bundle Orders Dispatched' : 'Deploy Full Sepsis 1-Hour Care Bundle'}
              </button>
            </div>
          </div>

          {/* AHA/ACC STEMI & ACS Pathway */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-950 border border-red-800 text-red-400">
                  <Zap size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">AHA/ACC STEMI & Acute Coronary Syndrome Clinical Pathway</h4>
                  <p className="text-[11px] text-slate-400">Door-to-Balloon target: &lt; 90 minutes. Emergent reperfusion protocol.</p>
                </div>
              </div>
              <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
                stemiBundleApplied ? 'bg-emerald-950 border-emerald-700 text-emerald-300' : 'bg-red-950 border-red-700 text-red-300'
              }`}>
                {stemiBundleApplied ? '✓ STEMI Reperfusion Active' : 'Pending Cath Lab Order'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="font-bold text-slate-200">STAT 12-Lead ECG</div>
                <div className="text-[11px] text-slate-400">Acquire within 10 min of arrival.</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="font-bold text-slate-200">DAPT Antiplatelet Loading</div>
                <div className="text-[11px] text-slate-400">Aspirin 300mg + Ticagrelor 180mg STAT.</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="font-bold text-slate-200">High-Intensity Statin</div>
                <div className="text-[11px] text-slate-400">Atorvastatin 80mg PO STAT.</div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleDeployStemiBundle}
                disabled={stemiBundleApplied}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  stemiBundleApplied
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-lg'
                }`}
              >
                <Zap size={14} />
                {stemiBundleApplied ? 'STEMI Pathway Orders Dispatched' : 'Deploy Acute STEMI Care Bundle'}
              </button>
            </div>
          </div>

          {/* Pulmonary Embolism (PE) Clinical Pathway & Wells Score */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
                  <Stethoscope size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Pulmonary Embolism (PE) Wells Score & Diagnostic Pathway</h4>
                  <p className="text-[11px] text-slate-400">Validated clinical prediction rule for suspected acute PE.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-lg border ${wellsRiskTier.color}`}>
                  Wells Score: {wellsScore.toFixed(1)} — {wellsRiskTier.label}
                </span>
              </div>
            </div>

            {/* Wells Criteria Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              {[
                { key: 'dvtSigns', label: 'Clinical signs/symptoms of DVT (+3.0)', pts: 3.0 },
                { key: 'peMostLikely', label: 'PE is #1 or equally likely diagnosis (+3.0)', pts: 3.0 },
                { key: 'tachycardia', label: 'Heart rate > 100 beats/min (+1.5)', pts: 1.5 },
                { key: 'immobilization', label: 'Immobilization / Surgery past 4 wks (+1.5)', pts: 1.5 },
                { key: 'priorDvtPe', label: 'Previous documented DVT or PE (+1.5)', pts: 1.5 },
                { key: 'hemoptysis', label: 'Hemoptysis present (+1.0)', pts: 1.0 },
                { key: 'malignancy', label: 'Active cancer (treated within 6 mo) (+1.0)', pts: 1.0 },
              ].map((item) => (
                <label
                  key={item.key}
                  className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                    (wellsCriteria as any)[item.key]
                      ? 'bg-cyan-950/40 border-cyan-700 text-cyan-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-medium text-[11px]">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={(wellsCriteria as any)[item.key]}
                    onChange={(e) =>
                      setWellsCriteria((prev) => ({
                        ...prev,
                        [item.key]: e.target.checked,
                      }))
                    }
                    className="rounded accent-cyan-500 w-4 h-4 ml-2"
                  />
                </label>
              ))}
            </div>

            {/* Clinical Recommendation Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono space-y-1">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Info size={13} /> Clinical Decision Guidance:
              </div>
              <div className="text-slate-300">{wellsRiskTier.recommendation}</div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleDeployPeBundle}
                disabled={peBundleApplied}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  peBundleApplied
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg'
                }`}
              >
                <Stethoscope size={14} />
                {peBundleApplied ? 'PE Pathway Orders Dispatched' : 'Deploy PE Diagnostic & Therapeutic Bundle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 1: CLINICAL OVERRIDE MODAL (MAJOR_WARNING) ================= */}
      {overrideModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-amber-500/60 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-slate-100 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-start gap-3 pb-3 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-amber-950 border border-amber-600 text-amber-400">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-base text-amber-300">
                  CLINICAL OVERRIDE REQUIRED — MAJOR PHARMACOVIGILANCE INTERCEPT
                </h3>
                <p className="text-xs text-slate-400">
                  Automated CDS detected clinically significant pharmacodynamic or metabolic conflicts.
                </p>
              </div>
            </div>

            {/* Targeted Drug Info */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono space-y-1">
              <div>
                <strong>Prescription: </strong>
                <span className="text-white">{overrideModalData.drug.name} ({overrideModalData.drug.genericName})</span>
              </div>
              <div>
                <strong>Ordered Dose & Route: </strong>
                <span className="text-slate-300">{overrideModalData.dose} via {overrideModalData.route}</span>
              </div>
            </div>

            {/* List of Warning Alerts */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {overrideModalData.alerts.map((alt, i) => (
                <div key={i} className="bg-amber-950/40 border border-amber-800/60 rounded-lg p-3 text-xs font-mono space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle size={13} /> {alt.title}
                  </div>
                  <div className="text-slate-300">{alt.description}</div>
                  <div className="text-amber-200/90 font-semibold">CDS Action: {alt.recommendation}</div>
                </div>
              ))}
            </div>

            {/* Override Justification Form */}
            <div className="space-y-3 bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs">
              <label className="block text-slate-300 font-mono font-bold">
                Select Standard Clinical Justification Rationale:
              </label>
              <select
                value={overrideRationaleChoice}
                onChange={(e) => setOverrideRationaleChoice(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2.5 rounded-lg outline-none focus:border-amber-500 font-medium"
              >
                {OVERRIDE_RATIONALE_PRESETS.map((p, i) => (
                  <option key={i} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <div>
                <label className="block text-slate-400 font-mono text-[11px] mb-1">
                  Additional Clinical Attending Notes (Optional):
                </label>
                <textarea
                  value={overrideFreeText}
                  onChange={(e) => setOverrideFreeText(e.target.value)}
                  placeholder="Specify clinical rationale, therapeutic drug monitoring orders, or specialist consult details..."
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2.5 rounded-lg outline-none focus:border-amber-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[11px] mb-1">
                  Ordering Clinician Digital Signature:
                </label>
                <input
                  type="text"
                  value={overrideClinicianName}
                  onChange={(e) => setOverrideClinicianName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-amber-300 p-2.5 rounded-lg outline-none focus:border-amber-500 font-mono font-bold"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={overrideConsentAcknowledged}
                  onChange={(e) => setOverrideConsentAcknowledged(e.target.checked)}
                  className="rounded accent-amber-500 w-4 h-4"
                />
                <span className="text-slate-300 font-mono text-[11px]">
                  I certify that I have reviewed the pharmacological risks and assume clinical responsibility for this override.
                </span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setOverrideModalData(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
              >
                Cancel / Withhold Order
              </button>
              <button
                onClick={handleConfirmOverride}
                disabled={!overrideConsentAcknowledged}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow ${
                  overrideConsentAcknowledged
                    ? 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-black cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <FileSignature size={14} /> Authorize Override & Sign Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: FATAL INTERCEPT MODAL (HARD BLOCK) ================= */}
      {fatalInterceptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border-2 border-rose-600 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 text-slate-100 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-start gap-3 pb-3 border-b border-slate-800">
              <div className="p-3 rounded-xl bg-rose-950 border border-rose-600 text-rose-400 animate-pulse">
                <ShieldAlert size={28} />
              </div>
              <div>
                <h3 className="font-bold text-base text-rose-400 uppercase tracking-wide">
                  CRITICAL SAFETY INTERCEPT — ORDER TRANSMISSION HARD BLOCKED
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Absolute contraindication detected. Under hospital clinical policy, this order cannot be signed.
                </p>
              </div>
            </div>

            {/* Targeted Drug Info */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono">
              <strong>Target Medication: </strong>
              <span className="text-rose-300 font-bold">{fatalInterceptData.drug.name} ({fatalInterceptData.drug.genericName})</span>
            </div>

            {/* Fatal Alerts Details */}
            <div className="space-y-2">
              {fatalInterceptData.alerts.map((alt, i) => (
                <div key={i} className="bg-rose-950/60 border border-rose-700 rounded-xl p-3 text-xs font-mono space-y-1">
                  <div className="font-bold text-rose-200 flex items-center gap-1.5">
                    <XCircle size={14} className="text-rose-400" /> [{alt.ruleId}] {alt.title}
                  </div>
                  <div className="text-slate-300 leading-relaxed">{alt.description}</div>
                  <div className="text-rose-300 font-bold">Mandatory Protocol: {alt.recommendation}</div>
                </div>
              ))}
            </div>

            {/* Hard Block Guidance */}
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs font-mono text-slate-400">
              <strong>Clinical Action Required: </strong>
              Please cancel this order and consult Clinical Pharmacology or select a non-contraindicated agent from the hospital formulary.
            </div>

            {/* Dismiss Button */}
            <div className="flex justify-end pt-1">
              <button
                onClick={() => setFatalInterceptData(null)}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition shadow"
              >
                Acknowledge & Close Intercept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
