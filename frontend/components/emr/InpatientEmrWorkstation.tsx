'use client';

import React, { useState, useMemo } from 'react';
import {
  InpatientRecord,
  INPATIENT_CENSUS,
  InpatientMedicationOrder,
  MarAdministrationRecord,
  IntakeRecord,
  OutputRecord,
  InpatientVitalsEntry,
  evaluateDrugAllergyRisk,
  evaluateDrugInteractions,
  evaluateRenalDoseAdjustment,
  calculateFluidBalance,
  verifyFiveRights,
  CdsAlertResult,
} from '../../.gemini/skills/HospitalEmrEngine';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  Barcode,
  Bed,
  Calendar,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Droplets,
  FileCheck,
  FileCode,
  FilePlus,
  FileSpreadsheet,
  FileText,
  FlaskConical,
  Heart,
  HeartPulse,
  Info,
  Layers,
  Microscope,
  Pill,
  PlusCircle,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
  Thermometer,
  User,
  Users,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import SoapNoteWriter from './SoapNoteWriter';

interface InpatientEmrWorkstationProps {
  initialPatientId?: string;
  onPatientChange?: (patientId: string) => void;
}

export default function InpatientEmrWorkstation({
  initialPatientId = 'pt-adhf-001',
  onPatientChange,
}: InpatientEmrWorkstationProps) {
  // Patient state
  const [patientId, setPatientId] = useState<string>(initialPatientId);
  const [patientsData, setPatientsData] = useState<Record<string, InpatientRecord>>(() => {
    const map: Record<string, InpatientRecord> = {};
    INPATIENT_CENSUS.forEach(p => {
      map[p.id] = JSON.parse(JSON.stringify(p));
    });
    return map;
  });

  const currentPatient = patientsData[patientId] || INPATIENT_CENSUS[0];

  // Active Tab: 7 core hospital EMR tabs
  const [activeTab, setActiveTab] = useState<
    'overview' | 'flowsheet' | 'io' | 'emar' | 'cpoe' | 'labs' | 'notes'
  >('overview');

  // eMAR Administration Modal State
  const [administeringOrder, setAdministeringOrder] = useState<InpatientMedicationOrder | null>(null);
  const [fiveRights, setFiveRights] = useState({
    rightPatient: false,
    rightDrug: false,
    rightDose: false,
    rightRoute: false,
    rightTime: false,
    dualNurseVerified: false,
  });
  const [witnessNurse, setWitnessNurse] = useState('');
  const [administeringNurse, setAdministeringNurse] = useState('Nurse Alex Kim, RN');
  const [adminNotes, setAdminNotes] = useState('');
  const [barcodeScanned, setBarcodeScanned] = useState(false);
  const [adminErrors, setAdminErrors] = useState<string[]>([]);
  const [adminSuccessToast, setAdminSuccessToast] = useState<string | null>(null);

  // CPOE Custom Order State
  const [orderDrugInput, setOrderDrugInput] = useState('');
  const [orderDoseInput, setOrderDoseInput] = useState('');
  const [orderRouteInput, setOrderRouteInput] = useState<'IV' | 'PO' | 'SC' | 'IM'>('IV');
  const [orderFreqInput, setOrderFreqInput] = useState<'Q24H' | 'Q12H' | 'Q8H' | 'Q6H' | 'PRN'>('Q12H');
  const [orderIndicationInput, setOrderIndicationInput] = useState('');
  const [activeCdsModal, setActiveCdsModal] = useState<CdsAlertResult | null>(null);
  const [pendingOrderToConfirm, setPendingOrderToConfirm] = useState<any | null>(null);

  // New Intake / Output Modal State
  const [showAddIoModal, setShowAddIoModal] = useState(false);
  const [ioType, setIoType] = useState<'INTAKE' | 'OUTPUT'>('INTAKE');
  const [ioDescription, setIoDescription] = useState('');
  const [ioVolume, setIoVolume] = useState('250');
  const [ioSource, setIoSource] = useState('IV_CRYSTALLOID');

  // New Vitals Modal State
  const [showAddVitalsModal, setShowAddVitalsModal] = useState(false);
  const [newHr, setNewHr] = useState(84);
  const [newSbp, setNewSbp] = useState(124);
  const [newDbp, setNewDbp] = useState(78);
  const [newRr, setNewRr] = useState(18);
  const [newTemp, setNewTemp] = useState(37.0);
  const [newSpo2, setNewSpo2] = useState(98);
  const [newPain, setNewPain] = useState(1);

  // Switch patient handler
  const handleSelectPatient = (id: string) => {
    setPatientId(id);
    if (onPatientChange) onPatientChange(id);
    setAdminSuccessToast(null);
    setActiveCdsModal(null);
  };

  // Fluid balance calculations
  const fluidBalance = useMemo(() => {
    return calculateFluidBalance(
      currentPatient.intakeRecords,
      currentPatient.outputRecords,
      currentPatient.weightKg
    );
  }, [currentPatient]);

  // Handle barcode simulation
  const handleSimulateBarcodeScan = () => {
    setBarcodeScanned(true);
    setFiveRights(prev => ({
      ...prev,
      rightPatient: true,
      rightDrug: true,
      rightDose: true,
      rightRoute: true,
      rightTime: true,
    }));
  };

  // Confirm Medication Administration
  const handleConfirmAdministration = () => {
    if (!administeringOrder) return;

    const verification = verifyFiveRights(fiveRights, administeringOrder.isHighAlert);
    if (!verification.isValid) {
      setAdminErrors(verification.errors);
      return;
    }

    // Update MAR record
    const updated = { ...currentPatient };
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Check if mar record exists or create new
    const existingIdx = updated.marRecords.findIndex(m => m.orderId === administeringOrder.id);
    if (existingIdx >= 0) {
      updated.marRecords[existingIdx].status = 'GIVEN';
      updated.marRecords[existingIdx].administeredAt = nowTime;
      updated.marRecords[existingIdx].administeredBy = administeringNurse;
      if (administeringOrder.isHighAlert) {
        updated.marRecords[existingIdx].witnessedBy = witnessNurse || 'Nurse Sarah Jenkins, RN';
      }
      updated.marRecords[existingIdx].notes = adminNotes;
    } else {
      updated.marRecords.push({
        orderId: administeringOrder.id,
        drugName: `${administeringOrder.drugName} ${administeringOrder.dose} ${administeringOrder.route}`,
        scheduledTime: nowTime,
        status: 'GIVEN',
        administeredAt: nowTime,
        administeredBy: administeringNurse,
        witnessedBy: administeringOrder.isHighAlert ? witnessNurse || 'Nurse Sarah Jenkins, RN' : undefined,
        notes: adminNotes,
      });
    }

    setPatientsData(prev => ({ ...prev, [patientId]: updated }));
    setAdminSuccessToast(`Administered ${administeringOrder.drugName} ${administeringOrder.dose} successfully.`);
    setAdministeringOrder(null);
    setFiveRights({
      rightPatient: false,
      rightDrug: false,
      rightDose: false,
      rightRoute: false,
      rightTime: false,
      dualNurseVerified: false,
    });
    setBarcodeScanned(false);
    setAdminErrors([]);
    setAdminNotes('');
  };

  // Pre-configured Order Set placement
  const handleApplyOrderSet = (orderSetName: 'ADHF' | 'SEPSIS' | 'POSTOP') => {
    const updated = { ...currentPatient };
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (orderSetName === 'ADHF') {
      const newOrders: InpatientMedicationOrder[] = [
        {
          id: `rx-adhf-${Date.now()}-1`,
          drugName: 'Furosemide',
          category: 'DIURETIC',
          dose: '80 mg',
          route: 'IV',
          frequency: 'Q12H',
          scheduleType: 'SCHEDULED',
          isHighAlert: false,
          requiresRenalAdjustment: true,
          indication: 'Decongestion natriuresis',
          orderedBy: 'Dr. Student (Order Set: ADHF Decongestion)',
          orderedAt: timestamp,
          status: 'ACTIVE',
        },
        {
          id: `rx-adhf-${Date.now()}-2`,
          drugName: 'Potassium Chloride (KCl)',
          category: 'ELECTROLYTE',
          dose: '20 mEq',
          route: 'PO',
          frequency: 'Q24H',
          scheduleType: 'SCHEDULED',
          isHighAlert: true,
          requiresRenalAdjustment: true,
          indication: 'Target K+ 4.0-4.5 mEq/L post diuresis',
          orderedBy: 'Dr. Student (Order Set: ADHF Decongestion)',
          orderedAt: timestamp,
          status: 'ACTIVE',
        },
      ];
      updated.medicationOrders = [...updated.medicationOrders, ...newOrders];
      setAdminSuccessToast('Applied ADHF Decongestion Order Set (IV Furosemide + Oral KCl + Telemetry)');
    } else if (orderSetName === 'SEPSIS') {
      const newOrders: InpatientMedicationOrder[] = [
        {
          id: `rx-sep-${Date.now()}-1`,
          drugName: 'Cefepime',
          category: 'ANTIBIOTIC',
          dose: '2 g',
          route: 'IV',
          frequency: 'Q12H',
          scheduleType: 'SCHEDULED',
          isHighAlert: false,
          requiresRenalAdjustment: true,
          indication: 'Empiric sepsis coverage (SEP-1 Hour-1 Bundle)',
          orderedBy: 'Dr. Student (Order Set: Sepsis Resuscitation)',
          orderedAt: timestamp,
          status: 'ACTIVE',
        },
        {
          id: `rx-sep-${Date.now()}-2`,
          drugName: 'Plasmalyte 1000 mL IV Infusion',
          category: 'OTHER',
          dose: '30 mL/kg rapid bolus',
          route: 'IV',
          frequency: 'ONCE_STAT',
          scheduleType: 'STAT',
          isHighAlert: false,
          requiresRenalAdjustment: false,
          indication: 'Initial crystalloid resuscitation for MAP < 65 or Lactate >= 4.0',
          orderedBy: 'Dr. Student (Order Set: Sepsis Resuscitation)',
          orderedAt: timestamp,
          status: 'ACTIVE',
        },
      ];
      updated.medicationOrders = [...updated.medicationOrders, ...newOrders];
      setAdminSuccessToast('Applied SEP-1 Sepsis Resuscitation Bundle Orders');
    } else if (orderSetName === 'POSTOP') {
      const newOrders: InpatientMedicationOrder[] = [
        {
          id: `rx-post-${Date.now()}-1`,
          drugName: 'Enoxaparin (Lovenox)',
          category: 'ANTICOAGULANT',
          dose: '40 mg',
          route: 'SC',
          frequency: 'Q24H',
          scheduleType: 'SCHEDULED',
          isHighAlert: true,
          requiresRenalAdjustment: true,
          indication: 'Postoperative VTE chemoprophylaxis (ERAS)',
          orderedBy: 'Dr. Student (Order Set: Post-Op Care)',
          orderedAt: timestamp,
          status: 'ACTIVE',
        },
        {
          id: `rx-post-${Date.now()}-2`,
          drugName: 'Acetaminophen',
          category: 'ANALGESIC',
          dose: '1000 mg',
          route: 'IV',
          frequency: 'Q6H',
          scheduleType: 'SCHEDULED',
          isHighAlert: false,
          requiresRenalAdjustment: false,
          indication: 'Multimodal non-opioid baseline analgesia',
          orderedBy: 'Dr. Student (Order Set: Post-Op Care)',
          orderedAt: timestamp,
          status: 'ACTIVE',
        },
      ];
      updated.medicationOrders = [...updated.medicationOrders, ...newOrders];
      setAdminSuccessToast('Applied Post-Op Surgical Care & VTE Prophylaxis Order Set');
    }

    setPatientsData(prev => ({ ...prev, [patientId]: updated }));
  };

  // Submit custom CPOE order with CDS checking
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderDrugInput.trim() || !orderDoseInput.trim()) return;

    // 1. Evaluate Drug Allergy
    const allergyAlert = evaluateDrugAllergyRisk(orderDrugInput, currentPatient.allergies);
    if (allergyAlert.hasAlert && allergyAlert.severity === 'HARD_STOP_CONTRAINDICATION') {
      setActiveCdsModal(allergyAlert);
      return;
    }

    // 2. Evaluate Drug Interactions
    const ddiAlert = evaluateDrugInteractions(orderDrugInput, currentPatient.medicationOrders);
    if (ddiAlert.hasAlert) {
      setActiveCdsModal(ddiAlert);
      setPendingOrderToConfirm({
        drugName: orderDrugInput,
        dose: orderDoseInput,
        route: orderRouteInput,
        frequency: orderFreqInput,
        indication: orderIndicationInput,
      });
      return;
    }

    // 3. Evaluate Renal Dose Adjustment
    const renalAlert = evaluateRenalDoseAdjustment(orderDrugInput, currentPatient.calculatedEgfr);
    if (renalAlert.requiresAdjustment) {
      setActiveCdsModal({
        hasAlert: true,
        severity: 'SOFT_STOP_WARNING',
        title: 'CDS: Renal Dose Adjustment Recommended',
        message: renalAlert.rationale,
        recommendation: renalAlert.recommendedDose ? `Suggested dose: ${renalAlert.recommendedDose}` : 'Review renal parameters.',
      });
      setPendingOrderToConfirm({
        drugName: orderDrugInput,
        dose: orderDoseInput,
        route: orderRouteInput,
        frequency: orderFreqInput,
        indication: orderIndicationInput,
      });
      return;
    }

    finalizeAddOrder({
      drugName: orderDrugInput,
      dose: orderDoseInput,
      route: orderRouteInput,
      frequency: orderFreqInput,
      indication: orderIndicationInput,
    });
  };

  const finalizeAddOrder = (orderData: any) => {
    const updated = { ...currentPatient };
    const isHighAlertDrug = /insulin|heparin|hydromorphone|morphine|fentanyl|digoxin|potassium|epinephrine|norepinephrine/i.test(
      orderData.drugName
    );

    const newOrder: InpatientMedicationOrder = {
      id: `rx-custom-${Date.now()}`,
      drugName: orderData.drugName,
      category: 'OTHER',
      dose: orderData.dose,
      route: orderData.route,
      frequency: orderData.frequency,
      scheduleType: orderData.frequency === 'PRN' ? 'PRN' : 'SCHEDULED',
      isHighAlert: isHighAlertDrug,
      requiresRenalAdjustment: false,
      indication: orderData.indication || 'Clinician order',
      orderedBy: 'Dr. Student, MD',
      orderedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'ACTIVE',
    };

    updated.medicationOrders = [newOrder, ...updated.medicationOrders];
    setPatientsData(prev => ({ ...prev, [patientId]: updated }));
    setAdminSuccessToast(`Order placed for ${orderData.drugName} ${orderData.dose}.`);
    setOrderDrugInput('');
    setOrderDoseInput('');
    setOrderIndicationInput('');
    setActiveCdsModal(null);
    setPendingOrderToConfirm(null);
  };

  // Add new Intake or Output
  const handleAddIoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vol = parseInt(ioVolume, 10);
    if (isNaN(vol) || vol <= 0) return;

    const updated = { ...currentPatient };
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (ioType === 'INTAKE') {
      const rec: IntakeRecord = {
        id: `in-${Date.now()}`,
        timestamp: nowTime,
        source: ioSource as any,
        description: ioDescription || 'Staff recorded intake',
        volumeMl: vol,
      };
      updated.intakeRecords = [...updated.intakeRecords, rec];
    } else {
      const rec: OutputRecord = {
        id: `out-${Date.now()}`,
        timestamp: nowTime,
        source: ioSource as any,
        description: ioDescription || 'Staff recorded output',
        volumeMl: vol,
      };
      updated.outputRecords = [...updated.outputRecords, rec];
    }

    setPatientsData(prev => ({ ...prev, [patientId]: updated }));
    setShowAddIoModal(false);
    setIoDescription('');
    setIoVolume('250');
  };

  // Add new vitals entry
  const handleAddVitalsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...currentPatient };
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newVitals: InpatientVitalsEntry = {
      timestamp: nowTime,
      hr: newHr,
      sbp: newSbp,
      dbp: newDbp,
      rr: newRr,
      tempC: newTemp,
      spo2: newSpo2,
      painScore: newPain,
      gcs: 15,
      fio2: 21,
      o2Device: 'Room Air',
    };

    updated.vitalsHistory = [...updated.vitalsHistory, newVitals];
    setPatientsData(prev => ({ ...prev, [patientId]: updated }));
    setShowAddVitalsModal(false);
    setAdminSuccessToast('Recorded bedside vitals entry.');
  };

  const latestVitals = currentPatient.vitalsHistory[currentPatient.vitalsHistory.length - 1];

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-none overflow-hidden">
      {/* ------------------------------------------------------------- */}
      {/* PATIENT DEMOGRAPHICS & BANNER BAR                             */}
      {/* ------------------------------------------------------------- */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 shadow-xl flex-shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-xl">
              {currentPatient.firstName[0]}
              {currentPatient.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {currentPatient.lastName}, {currentPatient.firstName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 border border-slate-700 text-slate-300">
                  {currentPatient.mrn}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-950/80 border border-indigo-500/50 text-indigo-300">
                  {currentPatient.gender} &bull; {currentPatient.age}yo
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    currentPatient.codeStatus === 'FULL_CODE'
                      ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                      : 'bg-rose-950/80 border-rose-500/60 text-rose-300'
                  }`}
                >
                  {currentPatient.codeStatus.replace('_', ' ')}
                </span>
                {currentPatient.isolation !== 'STANDARD' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/80 border border-amber-500/60 text-amber-300 animate-pulse">
                    {currentPatient.isolation} PRECAUTIONS
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 flex flex-wrap gap-4 mt-1">
                <span>
                  <strong className="text-slate-300">Unit:</strong> {currentPatient.unit} ({currentPatient.bed})
                </span>
                <span>
                  <strong className="text-slate-300">Attending:</strong> {currentPatient.attendingPhysician}
                </span>
                <span>
                  <strong className="text-slate-300">Admission:</strong> {currentPatient.admissionDate}
                </span>
                <span>
                  <strong className="text-slate-300">Weight:</strong> {currentPatient.weightKg} kg
                </span>
                <span>
                  <strong className="text-slate-300">eGFR:</strong>{' '}
                  <span className={currentPatient.calculatedEgfr < 60 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                    {currentPatient.calculatedEgfr} mL/min
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Patient Switcher Dropdown */}
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              Inpatient Census:
            </div>
            <select
              value={patientId}
              onChange={e => handleSelectPatient(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
            >
              {INPATIENT_CENSUS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.lastName}, {p.firstName} ({p.unit} - {p.bed})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Allergy Alert Strip */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto">
          <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex-shrink-0">Allergies:</span>
          {currentPatient.allergies.length > 0 ? (
            currentPatient.allergies.map((al, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/70 border border-rose-600/50 text-xs text-rose-200"
                title={al.manifestations}
              >
                <AlertOctagon className="w-3 h-3 text-rose-400" />
                <strong className="font-semibold">{al.allergen}</strong>
                <span className="text-rose-400 text-[11px]">({al.reactionType})</span>
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">No Known Drug Allergies (NKDA)</span>
          )}
        </div>
      </header>

      {/* Success Toast */}
      {adminSuccessToast && (
        <div className="bg-emerald-950 border-b border-emerald-500/50 px-6 py-2 flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{adminSuccessToast}</span>
          </div>
          <button onClick={() => setAdminSuccessToast(null)} className="hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7 CORE INPATIENT TABS NAVIGATION                              */}
      {/* ------------------------------------------------------------- */}
      <nav className="bg-slate-900 border-b border-slate-800 px-6 flex gap-1 overflow-x-auto flex-shrink-0">
        {[
          { id: 'overview', label: 'Summary / SBAR', icon: Layers },
          { id: 'flowsheet', label: 'Vitals & Flowsheet', icon: Activity },
          { id: 'io', label: 'Intake & Output (I&O)', icon: Droplets },
          { id: 'emar', label: 'eMAR Medication Admin', icon: Pill },
          { id: 'cpoe', label: 'CPOE & Order Sets', icon: FilePlus },
          { id: 'labs', label: 'Labs & Imaging', icon: FlaskConical },
          { id: 'notes', label: 'Clinical Documentation & SOAP', icon: FileText },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* TAB CONTENT AREA                                              */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
        {/* ============================================================= */}
        {/* TAB 1: SUMMARY / SBAR INPATIENT DASHBOARD                    */}
        {/* ============================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Active Best Practice Advisories (BPAs) */}
            {currentPatient.activeBpas.length > 0 && (
              <div className="space-y-3">
                {currentPatient.activeBpas.map(bpa => (
                  <div
                    key={bpa.id}
                    className="p-4 rounded-xl bg-gradient-to-r from-rose-950/50 via-slate-900 to-slate-900 border border-rose-500/50 flex items-start gap-4 shadow-lg"
                  >
                    <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 text-xs">
                      <div className="font-bold text-rose-300 text-sm">{bpa.title}</div>
                      <p className="text-slate-300 mt-1">{bpa.triggerDescription}</p>
                      <div className="mt-2 text-indigo-300 font-semibold bg-slate-950/60 p-2 rounded border border-indigo-500/30">
                        &bull; Recommended Action: {bpa.recommendedAction}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 italic">{bpa.rationale}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Vitals & SBAR 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">Heart Rate</div>
                <div className="text-2xl font-bold font-mono text-white mt-1 flex items-baseline gap-2">
                  {latestVitals.hr} <span className="text-xs text-slate-400">bpm</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Normal Sinus / Monitored</div>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">Blood Pressure</div>
                <div className="text-2xl font-bold font-mono text-white mt-1 flex items-baseline gap-2">
                  {latestVitals.sbp}/{latestVitals.dbp} <span className="text-xs text-slate-400">mmHg</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  MAP ~ {Math.round((latestVitals.sbp + 2 * latestVitals.dbp) / 3)} mmHg
                </div>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">Oxygen Saturation</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 flex items-baseline gap-2">
                  {latestVitals.spo2}% <span className="text-xs text-slate-400">on {latestVitals.o2Device}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">RR: {latestVitals.rr} breaths/min</div>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">Fluid Balance (Shift)</div>
                <div
                  className={`text-2xl font-bold font-mono mt-1 flex items-baseline gap-2 ${
                    fluidBalance.netBalanceMl < 0 ? 'text-cyan-400' : 'text-amber-400'
                  }`}
                >
                  {fluidBalance.netBalanceMl > 0 ? `+${fluidBalance.netBalanceMl}` : fluidBalance.netBalanceMl}{' '}
                  <span className="text-xs text-slate-400">mL</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Urine: {fluidBalance.urineMlPerKgPerHour} mL/kg/h
                </div>
              </div>
            </div>

            {/* Problem List & Plan Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Problems */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-indigo-400" />
                    Active Inpatient Problem List
                  </h3>
                  <span className="text-xs text-indigo-400 font-medium">ICD-10 Mapped</span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-3 rounded-lg bg-slate-950 border border-indigo-500/30">
                    <div className="text-xs font-bold text-indigo-300">#1 Primary Problem</div>
                    <div className="text-sm font-semibold text-white mt-0.5">{currentPatient.primaryDiagnosis}</div>
                  </div>
                  {currentPatient.secondaryDiagnoses.map((sec, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
                      <span className="text-slate-500 font-mono mr-2">#{idx + 2}</span>
                      {sec}
                    </div>
                  ))}
                </div>
              </div>

              {/* Inpatient Care Directives & Lines */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-emerald-400" />
                    Lines, Tubes, Drains & Directives
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="text-slate-400 font-medium">Code Status</div>
                    <div className="font-bold text-white mt-1">{currentPatient.codeStatus.replace('_', ' ')}</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="text-slate-400 font-medium">Diet & Nutrition</div>
                    <div className="font-bold text-white mt-1">
                      {currentPatient.id === 'pt-stroke-004' ? 'Strict NPO (Dysphagia fail)' : 'Cardiac / 2g Na restriction'}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="text-slate-400 font-medium">Invasive Access</div>
                    <div className="font-bold text-white mt-1">
                      {currentPatient.id === 'pt-sepsis-002' ? 'Right IJ Central Line 7Fr' : 'Left Forearm 18G PIV'}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="text-slate-400 font-medium">Drains / Catheters</div>
                    <div className="font-bold text-white mt-1">
                      {currentPatient.id === 'pt-postop-003'
                        ? 'JP Drain #1 RLQ to bulb suction'
                        : currentPatient.id === 'pt-sepsis-002'
                        ? 'Foley Catheter 16Fr with temp sensor'
                        : 'None (Urinal voiding)'}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    onClick={() => setActiveTab('cpoe')}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <FilePlus className="w-3.5 h-3.5" />
                    Place Inpatient Orders
                  </button>
                  <button
                    onClick={() => setActiveTab('emar')}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Pill className="w-3.5 h-3.5" />
                    Review eMAR
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 2: VITALS & FLOWSHEET                                    */}
        {/* ============================================================= */}
        {activeTab === 'flowsheet' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  Inpatient Vitals & Neurologic Flowsheet
                </h2>
                <p className="text-xs text-slate-400">Multi-column chronological nursing observations</p>
              </div>
              <button
                onClick={() => setShowAddVitalsModal(true)}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Record Bedside Vitals
              </button>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto shadow-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold">
                  <tr>
                    <th className="p-3.5">Time</th>
                    <th className="p-3.5">Heart Rate</th>
                    <th className="p-3.5">Blood Pressure</th>
                    <th className="p-3.5">MAP</th>
                    <th className="p-3.5">Resp Rate</th>
                    <th className="p-3.5">Temp</th>
                    <th className="p-3.5">SpO2</th>
                    <th className="p-3.5">O2 Device</th>
                    <th className="p-3.5">Pain (0-10)</th>
                    <th className="p-3.5">GCS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-slate-200">
                  {currentPatient.vitalsHistory.map((vt, idx) => {
                    const map = Math.round((vt.sbp + 2 * vt.dbp) / 3);
                    return (
                      <tr key={idx} className="hover:bg-slate-800/40 transition">
                        <td className="p-3.5 font-bold text-indigo-400 font-sans">{vt.timestamp}</td>
                        <td className="p-3.5">
                          <span className={vt.hr > 100 || vt.hr < 60 ? 'text-rose-400 font-bold' : ''}>
                            {vt.hr} bpm
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={vt.sbp < 90 || vt.sbp > 160 ? 'text-amber-400 font-bold' : ''}>
                            {vt.sbp}/{vt.dbp}
                          </span>
                        </td>
                        <td className="p-3.5">{map} mmHg</td>
                        <td className="p-3.5">
                          <span className={vt.rr > 22 || vt.rr < 10 ? 'text-rose-400 font-bold' : ''}>
                            {vt.rr} /min
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={vt.tempC >= 38.3 ? 'text-rose-400 font-bold' : ''}>
                            {vt.tempC.toFixed(1)} &deg;C
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={vt.spo2 < 92 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                            {vt.spo2}%
                          </span>
                        </td>
                        <td className="p-3.5 font-sans text-slate-400">{vt.o2Device || 'Room Air'}</td>
                        <td className="p-3.5 font-sans">
                          <span className={vt.painScore >= 5 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                            {vt.painScore}/10
                          </span>
                        </td>
                        <td className="p-3.5">{vt.gcs}/15</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 3: INTAKE & OUTPUT (I&O) BALANCING                       */}
        {/* ============================================================= */}
        {activeTab === 'io' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-cyan-400" />
                  Inpatient Fluid Balance & Renal Output (I&O)
                </h2>
                <p className="text-xs text-slate-400">Strict hourly and 24-hour cumulative fluid reconciliation</p>
              </div>
              <button
                onClick={() => setShowAddIoModal(true)}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Record Intake / Output
              </button>
            </div>

            {/* Fluid Balance Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">Cumulative Intake</div>
                <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
                  +{fluidBalance.totalIntakeMl} <span className="text-xs text-slate-400">mL</span>
                </div>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">Cumulative Output</div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                  -{fluidBalance.totalOutputMl} <span className="text-xs text-slate-400">mL</span>
                </div>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">Net Shift Balance</div>
                <div
                  className={`text-2xl font-bold font-mono mt-1 ${
                    fluidBalance.netBalanceMl < 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {fluidBalance.netBalanceMl > 0 ? `+${fluidBalance.netBalanceMl}` : fluidBalance.netBalanceMl}{' '}
                  <span className="text-xs text-slate-400">mL</span>
                </div>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">Urine Output Rate</div>
                <div
                  className={`text-2xl font-bold font-mono mt-1 ${
                    fluidBalance.hasOliguriaAlert ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {fluidBalance.urineMlPerKgPerHour} <span className="text-xs text-slate-400">mL/kg/h</span>
                </div>
                {fluidBalance.hasOliguriaAlert && (
                  <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block mt-0.5">
                    Oliguria Alarm (&lt; 0.5 mL/kg/h)
                  </span>
                )}
              </div>
            </div>

            {/* Split Tables: Intake vs Output */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Intake Records */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-3">
                <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Intake Records</span>
                  <span className="font-mono text-slate-300">{fluidBalance.totalIntakeMl} mL</span>
                </h3>
                <div className="divide-y divide-slate-800 text-xs">
                  {currentPatient.intakeRecords.map(item => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-200">{item.description}</div>
                        <div className="text-[11px] text-slate-400">{item.source.replace('_', ' ')} &bull; {item.timestamp}</div>
                      </div>
                      <div className="font-mono font-bold text-cyan-400">+{item.volumeMl} mL</div>
                    </div>
                  ))}
                  {currentPatient.intakeRecords.length === 0 && (
                    <div className="py-6 text-center text-slate-500 italic">No intake recorded this shift.</div>
                  )}
                </div>
              </div>

              {/* Output Records */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-3">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Output Records</span>
                  <span className="font-mono text-slate-300">{fluidBalance.totalOutputMl} mL</span>
                </h3>
                <div className="divide-y divide-slate-800 text-xs">
                  {currentPatient.outputRecords.map(item => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-200">{item.description}</div>
                        <div className="text-[11px] text-slate-400">{item.source.replace('_', ' ')} &bull; {item.timestamp}</div>
                      </div>
                      <div className="font-mono font-bold text-amber-400">-{item.volumeMl} mL</div>
                    </div>
                  ))}
                  {currentPatient.outputRecords.length === 0 && (
                    <div className="py-6 text-center text-slate-500 italic">No output recorded this shift.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 4: eMAR (MEDICATION ADMINISTRATION RECORD)               */}
        {/* ============================================================= */}
        {activeTab === 'emar' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Pill className="w-5 h-5 text-indigo-400" />
                  Electronic Medication Administration Record (eMAR)
                </h2>
                <p className="text-xs text-slate-400">
                  Scan patient wristband and verify 5-Rights prior to administration
                </p>
              </div>
            </div>

            {/* MAR Grouped Sections */}
            <div className="space-y-4">
              {currentPatient.medicationOrders.map(order => {
                const marEntry = currentPatient.marRecords.find(m => m.orderId === order.id);
                const isGiven = marEntry?.status === 'GIVEN';
                const isHeld = marEntry?.status === 'HELD';

                return (
                  <div
                    key={order.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isGiven
                        ? 'bg-slate-900/60 border-slate-800'
                        : isHeld
                        ? 'bg-slate-900/60 border-amber-500/40'
                        : 'bg-slate-900 border-indigo-500/40 shadow-lg'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-sm font-bold text-white">{order.drugName}</h3>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-slate-300">
                            {order.dose} &bull; {order.route} &bull; {order.frequency}
                          </span>
                          {order.isHighAlert && (
                            <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/60 text-[10px] font-bold text-rose-300 flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3" />
                              HIGH ALERT (Dual Sign-Off)
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">
                          <strong className="text-slate-300">Indication:</strong> {order.indication}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Ordered by {order.orderedBy} at {order.orderedAt}
                        </div>

                        {/* Administration Details if given */}
                        {isGiven && marEntry && (
                          <div className="mt-2 text-xs text-emerald-300 bg-emerald-950/40 px-3 py-1.5 rounded border border-emerald-500/30 inline-flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span>
                              Administered at {marEntry.administeredAt} by {marEntry.administeredBy}
                              {marEntry.witnessedBy && ` (Witness: ${marEntry.witnessedBy})`}
                            </span>
                          </div>
                        )}

                        {isHeld && marEntry && (
                          <div className="mt-2 text-xs text-amber-300 bg-amber-950/40 px-3 py-1.5 rounded border border-amber-500/30 inline-flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <span>Held: {marEntry.heldReason}</span>
                          </div>
                        )}
                      </div>

                      {/* Administer Action Button */}
                      <div>
                        {!isGiven ? (
                          <button
                            onClick={() => {
                              setAdministeringOrder(order);
                              setBarcodeScanned(false);
                              setAdminErrors([]);
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition"
                          >
                            <Barcode className="w-4 h-4" />
                            Scan &amp; Administer
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 5: CPOE & ORDER SETS                                     */}
        {/* ============================================================= */}
        {activeTab === 'cpoe' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FilePlus className="w-5 h-5 text-indigo-400" />
                Computerized Physician Order Entry (CPOE) &amp; Admission Order Sets
              </h2>
              <p className="text-xs text-slate-400">
                Order evidence-based admission bundles or individual medications with real-time Clinical Decision Support
              </p>
            </div>

            {/* Admission Order Sets Grid */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
              <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                Pre-Configured Evidence-Based Order Sets
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">ADHF Decongestion Bundle</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      IV Furosemide 80mg q12h, Oral KCl replacement, continuous telemetry, strict 1.5L fluid limit, daily weights.
                    </p>
                  </div>
                  <button
                    onClick={() => handleApplyOrderSet('ADHF')}
                    className="mt-4 w-full py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Apply ADHF Order Set
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">SEP-1 Sepsis Resuscitation Bundle</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Blood cultures x2, 30 mL/kg balanced crystalloids, broad spectrum IV Cefepime, repeat lactate in 2h, strict Foley output.
                    </p>
                  </div>
                  <button
                    onClick={() => handleApplyOrderSet('SEPSIS')}
                    className="mt-4 w-full py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Apply Sepsis Order Set
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">Post-Op Surgical ERAS Bundle</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Enoxaparin 40mg SC daily VTE prophylaxis, IV Acetaminophen 1g q6h, early mobilization, incentive spirometry q1h.
                    </p>
                  </div>
                  <button
                    onClick={() => handleApplyOrderSet('POSTOP')}
                    className="mt-4 w-full py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Apply Post-Op Order Set
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Medication / Order Form */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
              <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-4 h-4" />
                Custom Inpatient Medication Order
              </h3>
              <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Medication Name</label>
                  <input
                    type="text"
                    value={orderDrugInput}
                    onChange={e => setOrderDrugInput(e.target.value)}
                    placeholder="e.g. Lisinopril, Cefepime, Amiodarone"
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Dose</label>
                  <input
                    type="text"
                    value={orderDoseInput}
                    onChange={e => setOrderDoseInput(e.target.value)}
                    placeholder="e.g. 20 mg, 1 g, 40 mg"
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Route</label>
                  <select
                    value={orderRouteInput}
                    onChange={e => setOrderRouteInput(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="IV">IV (Intravenous)</option>
                    <option value="PO">PO (Oral)</option>
                    <option value="SC">SC (Subcutaneous)</option>
                    <option value="IM">IM (Intramuscular)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Frequency</label>
                  <select
                    value={orderFreqInput}
                    onChange={e => setOrderFreqInput(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Q24H">Q24H (Daily)</option>
                    <option value="Q12H">Q12H (Twice Daily)</option>
                    <option value="Q8H">Q8H (Every 8 hours)</option>
                    <option value="Q6H">Q6H (Every 6 hours)</option>
                    <option value="PRN">PRN (As Needed)</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="text-xs text-slate-400 block mb-1">Clinical Indication</label>
                  <input
                    type="text"
                    value={orderIndicationInput}
                    onChange={e => setOrderIndicationInput(e.target.value)}
                    placeholder="e.g. Acute exacerbation, analgesia, hypertension"
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition shadow"
                  >
                    <FilePlus className="w-4 h-4" />
                    Sign &amp; Submit Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 6: LABS & IMAGING                                        */}
        {/* ============================================================= */}
        {activeTab === 'labs' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-indigo-400" />
                Laboratory Diagnostics &amp; Radiology Studies
              </h2>
              <p className="text-xs text-slate-400">Cumulative panels with abnormal flag tracking and formal imaging impressions</p>
            </div>

            {/* Laboratory Results Table */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
              <div className="p-4 bg-slate-950/80 border-b border-slate-800 text-xs font-bold text-slate-300">
                Cumulative Inpatient Laboratory Panels
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/40 text-slate-400 border-b border-slate-800 font-semibold">
                  <tr>
                    <th className="p-3.5">Panel</th>
                    <th className="p-3.5">Test Name</th>
                    <th className="p-3.5">Result</th>
                    <th className="p-3.5">Reference Range</th>
                    <th className="p-3.5">Flag</th>
                    <th className="p-3.5">Collection Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {currentPatient.labResults.map(lab => (
                    <tr key={lab.id} className="hover:bg-slate-800/30 transition">
                      <td className="p-3.5 font-semibold text-slate-400">{lab.panel}</td>
                      <td className="p-3.5 font-medium text-white">{lab.testName}</td>
                      <td className="p-3.5 font-mono font-bold">
                        <span
                          className={
                            lab.flag === 'CRITICAL'
                              ? 'text-rose-400'
                              : lab.flag === 'HIGH' || lab.flag === 'LOW'
                              ? 'text-amber-400'
                              : 'text-slate-200'
                          }
                        >
                          {lab.value} {lab.unit}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500 font-mono">{lab.refRange}</td>
                      <td className="p-3.5">
                        {lab.flag && lab.flag !== 'NORMAL' ? (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              lab.flag === 'CRITICAL'
                                ? 'bg-rose-950 border border-rose-600 text-rose-300 animate-pulse'
                                : 'bg-amber-950 border border-amber-600 text-amber-300'
                            }`}
                          >
                            {lab.flag}
                          </span>
                        ) : (
                          <span className="text-slate-500 font-mono">Normal</span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-400 font-mono text-[11px]">{lab.collectedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Diagnostic Imaging Studies */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Microscope className="w-4 h-4" />
                Radiology Reports &amp; Diagnostic Imaging
              </h3>
              {currentPatient.imagingStudies.map(study => (
                <div key={study.id} className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-mono text-xs">
                          {study.modality}
                        </span>
                        {study.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">Indication: {study.indication}</p>
                    </div>
                    <div className="text-right text-[11px] text-slate-400">
                      <div>Performed: {study.performedAt}</div>
                      <div className="text-slate-500">{study.radiologist}</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <strong className="text-slate-400 block mb-0.5">Findings:</strong>
                      <p className="text-slate-300 leading-relaxed">{study.findings}</p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-lg border border-indigo-500/30">
                      <strong className="text-indigo-300 block mb-0.5">Impression:</strong>
                      <p className="text-white font-medium whitespace-pre-wrap leading-relaxed">{study.impression}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 7: CLINICAL NOTES & SOAP WRITER                          */}
        {/* ============================================================= */}
        {activeTab === 'notes' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Multidisciplinary Inpatient Documentation &amp; SOAP Note Writer
              </h2>
              <p className="text-xs text-slate-400">
                Review attending/nursing progress notes or draft new clinical encounters with automated grading
              </p>
            </div>

            {/* Historical Notes */}
            <div className="space-y-4">
              {currentPatient.clinicalNotes.map(note => (
                <div key={note.id} className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="font-bold text-white text-base">{note.title}</h3>
                      <div className="text-xs text-indigo-300 font-medium">{note.noteType.replace(/_/g, ' ')}</div>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      <div>By: {note.author} ({note.authorRole})</div>
                      <div className="text-[11px] text-slate-500">{note.createdAt}</div>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    {note.content.subjective && (
                      <div>
                        <strong className="text-indigo-400 block mb-1">Subjective (HPI):</strong>
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                          {note.content.subjective}
                        </p>
                      </div>
                    )}
                    {note.content.objective && (
                      <div>
                        <strong className="text-indigo-400 block mb-1">Objective (Vitals / Physical Exam / Labs):</strong>
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                          {note.content.objective}
                        </p>
                      </div>
                    )}
                    {note.content.assessment && (
                      <div>
                        <strong className="text-indigo-400 block mb-1">Assessment &amp; Differential:</strong>
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                          {note.content.assessment}
                        </p>
                      </div>
                    )}
                    {note.content.plan && (
                      <div>
                        <strong className="text-indigo-400 block mb-1">Plan &amp; Disposition:</strong>
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                          {note.content.plan}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Student SOAP Note Writer */}
            <div className="mt-8 pt-8 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                Draft New Student Daily Inpatient Progress Note
              </h3>
              <SoapNoteWriter
                patientId={currentPatient.id}
                onSave={() => {
                  setAdminSuccessToast('SOAP Note successfully saved and evaluated.');
                }}
              />
            </div>
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: eMAR ADMINISTRATION & 5-RIGHTS CHECKLIST             */}
      {/* ------------------------------------------------------------- */}
      {administeringOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Medication Administration Verification</h3>
              </div>
              <button onClick={() => setAdministeringOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1 text-xs">
              <div className="text-slate-400">Order:</div>
              <div className="font-bold text-white text-sm">{administeringOrder.drugName}</div>
              <div className="text-indigo-300 font-mono">
                {administeringOrder.dose} &bull; {administeringOrder.route} &bull; {administeringOrder.frequency}
              </div>
            </div>

            {/* Barcode Scan Simulation */}
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 flex items-center justify-between">
              <div className="text-xs">
                <div className="font-bold text-indigo-200">Point-of-Care Barcode Verification</div>
                <div className="text-[11px] text-indigo-400">Scan wristband &amp; unit-dose package</div>
              </div>
              <button
                onClick={handleSimulateBarcodeScan}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  barcodeScanned ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                <Barcode className="w-4 h-4" />
                {barcodeScanned ? 'Scanned OK' : 'Scan Barcode'}
              </button>
            </div>

            {/* 5-Rights Checklist */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                5 Rights of Medication Administration:
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { key: 'rightPatient', label: '1. Right Patient' },
                  { key: 'rightDrug', label: '2. Right Medication' },
                  { key: 'rightDose', label: '3. Right Dose' },
                  { key: 'rightRoute', label: '4. Right Route' },
                  { key: 'rightTime', label: '5. Right Time' },
                ].map(r => (
                  <label
                    key={r.key}
                    className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(fiveRights as any)[r.key]}
                      onChange={e =>
                        setFiveRights(prev => ({ ...prev, [r.key]: e.target.checked }))
                      }
                      className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-300">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dual Sign-Off for High Alert */}
            {administeringOrder.isHighAlert && (
              <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-2">
                <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Independent Dual Nurse Witness Verification Required
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fiveRights.dualNurseVerified}
                    onChange={e =>
                      setFiveRights(prev => ({ ...prev, dualNurseVerified: e.target.checked }))
                    }
                    className="rounded border-slate-700 text-rose-600 focus:ring-rose-500"
                  />
                  <span>I, second registered nurse, independently verified calculations and vial</span>
                </label>
                <input
                  type="text"
                  value={witnessNurse}
                  onChange={e => setWitnessNurse(e.target.value)}
                  placeholder="Co-signing RN Name (e.g. Nurse Elena Ramos, RN)"
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2 focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
            )}

            {/* Error Feedback */}
            {adminErrors.length > 0 && (
              <div className="p-3 bg-rose-950/60 border border-rose-600/60 rounded-xl space-y-1 text-xs text-rose-200">
                <div className="font-bold flex items-center gap-1">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                  Safety Verification Failed:
                </div>
                {adminErrors.map((err, i) => (
                  <div key={i}>&bull; {err}</div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setAdministeringOrder(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAdministration}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-lg transition"
              >
                Confirm Administration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: CLINICAL DECISION SUPPORT (CDS) INTERRUPTIVE ALERT   */}
      {/* ------------------------------------------------------------- */}
      {activeCdsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl ${
              activeCdsModal.severity === 'HARD_STOP_CONTRAINDICATION'
                ? 'bg-rose-950/90 border-rose-500'
                : 'bg-amber-950/90 border-amber-500'
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle
                className={`w-6 h-6 flex-shrink-0 ${
                  activeCdsModal.severity === 'HARD_STOP_CONTRAINDICATION'
                    ? 'text-rose-400'
                    : 'text-amber-400'
                }`}
              />
              <div>
                <h3 className="text-base font-bold text-white">{activeCdsModal.title}</h3>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">{activeCdsModal.message}</p>
              </div>
            </div>

            <div className="p-3 bg-black/40 rounded-xl border border-white/10 text-xs">
              <div className="font-semibold text-white">Recommended Action:</div>
              <div className="text-slate-300 mt-0.5">{activeCdsModal.recommendation}</div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {activeCdsModal.severity === 'HARD_STOP_CONTRAINDICATION' ? (
                <button
                  onClick={() => {
                    setActiveCdsModal(null);
                    setPendingOrderToConfirm(null);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs"
                >
                  Cancel Order (Hard Stop)
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setActiveCdsModal(null);
                      setPendingOrderToConfirm(null);
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                  >
                    Cancel Order
                  </button>
                  <button
                    onClick={() => {
                      if (pendingOrderToConfirm) {
                        finalizeAddOrder(pendingOrderToConfirm);
                      }
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold"
                  >
                    Override with Clinical Justification
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: ADD INTAKE / OUTPUT                                  */}
      {/* ------------------------------------------------------------- */}
      {showAddIoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Droplets className="w-5 h-5 text-cyan-400" />
                Record Inpatient Fluid Intake / Output
              </h3>
              <button onClick={() => setShowAddIoModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddIoSubmit} className="space-y-4 text-xs">
              <div className="flex gap-3">
                <label className="flex-1 text-center p-2.5 rounded-lg border cursor-pointer font-semibold transition bg-slate-950 border-slate-800 text-slate-300">
                  <input
                    type="radio"
                    name="ioType"
                    checked={ioType === 'INTAKE'}
                    onChange={() => {
                      setIoType('INTAKE');
                      setIoSource('IV_CRYSTALLOID');
                    }}
                    className="mr-2"
                  />
                  Intake (+)
                </label>
                <label className="flex-1 text-center p-2.5 rounded-lg border cursor-pointer font-semibold transition bg-slate-950 border-slate-800 text-slate-300">
                  <input
                    type="radio"
                    name="ioType"
                    checked={ioType === 'OUTPUT'}
                    onChange={() => {
                      setIoType('OUTPUT');
                      setIoSource('URINE_VOID');
                    }}
                    className="mr-2"
                  />
                  Output (-)
                </label>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Source / Route</label>
                <select
                  value={ioSource}
                  onChange={e => setIoSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2.5 outline-none"
                >
                  {ioType === 'INTAKE' ? (
                    <>
                      <option value="IV_CRYSTALLOID">IV Crystalloid (Saline / Plasmalyte)</option>
                      <option value="IV_MEDICATIONS">IV Medication Carrier</option>
                      <option value="ORAL_FLUIDS">Oral Fluid / Water</option>
                      <option value="ENTERAL_TUBE">Enteral Tube Feeding</option>
                      <option value="BLOOD_PRODUCTS">Blood Product (PRBC / FFP)</option>
                    </>
                  ) : (
                    <>
                      <option value="URINE_VOID">Spontaneous Urine Void</option>
                      <option value="URINE_FOLEY">Foley Catheter Urine</option>
                      <option value="SURGICAL_DRAIN">Jackson-Pratt (JP) Drain</option>
                      <option value="EMESIS">Emesis</option>
                      <option value="CHEST_TUBE">Chest Tube Pleural Fluid</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Volume (mL)</label>
                <input
                  type="number"
                  value={ioVolume}
                  onChange={e => setIoVolume(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2.5 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description / Notes</label>
                <input
                  type="text"
                  value={ioDescription}
                  onChange={e => setIoDescription(e.target.value)}
                  placeholder="e.g. Water cup with lunch, Clear yellow urine"
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2.5 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddIoModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 4: RECORD BEDSIDE VITALS                                */}
      {/* ------------------------------------------------------------- */}
      {showAddVitalsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                Record Bedside Vitals Entry
              </h3>
              <button onClick={() => setShowAddVitalsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddVitalsSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={newHr}
                    onChange={e => setNewHr(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2.5 outline-none font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Resp Rate (/min)</label>
                  <input
                    type="number"
                    value={newRr}
                    onChange={e => setNewRr(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2.5 outline-none font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={newSbp}
                    onChange={e => setNewSbp(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2.5 outline-none font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={newDbp}
                    onChange={e => setNewDbp(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2.5 outline-none font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Temp (&deg;C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newTemp}
                    onChange={e => setNewTemp(parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2.5 outline-none font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">SpO2 (%)</label>
                  <input
                    type="number"
                    value={newSpo2}
                    onChange={e => setNewSpo2(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2.5 outline-none font-mono"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-slate-400 block mb-1">Pain Score (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={newPain}
                    onChange={e => setNewPain(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2.5 outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVitalsModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold"
                >
                  Log Vitals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
