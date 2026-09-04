'use client';

import React, { useState } from 'react';
import {
  DrugRecord,
  CLINICAL_FORMULARY,
  evaluatePrescriptionSafety,
  SafetyCheckResult,
  AllergyProfile,
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
} from 'lucide-react';

interface LabOrder {
  id: string;
  name: string;
  category: 'HEMATOLOGY' | 'CHEMISTRY' | 'CARDIAC' | 'MICROBIOLOGY';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED';
  result?: string;
  isPanicValue?: boolean;
}

interface ImagingOrder {
  id: string;
  modality: 'CXR' | 'CT' | 'MRI' | 'ECG' | 'ECHO';
  title: string;
  indication: string;
  status: 'PENDING' | 'COMPLETED';
  radiologistReport?: string;
}

interface ActivePrescription {
  id: string;
  drug: DrugRecord;
  dose: string;
  route: string;
  frequency: string;
  orderedAt: string;
}

interface CpoeOrderSystemProps {
  patientName?: string;
  systolicBp?: number;
  heartRate?: number;
  eGfr?: number;
  knownAllergies?: AllergyProfile[];
  onOrderPlaced?: (type: 'LAB' | 'IMAGING' | 'MEDICATION', details: any) => void;
}

export default function CpoeOrderSystem({
  patientName = 'Ramesh Sundaram (MRN: MED-99201)',
  systolicBp = 88,
  heartRate = 104,
  eGfr = 28,
  knownAllergies = [{ allergen: 'Penicillin', reactionType: 'ANAPHYLAXIS', severity: 'SEVERE' }],
  onOrderPlaced,
}: CpoeOrderSystemProps) {
  const [activeTab, setActiveTab] = useState<'LABS' | 'IMAGING' | 'MEDS'>('MEDS');

  // Lab Orders State
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

  // Imaging Orders State
  const [placedImagingOrders, setPlacedImagingOrders] = useState<ImagingOrder[]>([
    {
      id: 'RAD-1',
      modality: 'ECG',
      title: 'Stat 12-Lead Electrocardiogram',
      indication: 'Crushing retrosternal chest pain radiating to jaw',
      status: 'COMPLETED',
      radiologistReport: 'Sinus tachycardia at 104 bpm. Marked 4 mm ST-segment elevation in leads V1-V4 with reciprocal depressions in III and aVF. Diagnostic of Acute Anterior STEMI (Proximal LAD occlusion).',
    },
  ]);

  // Active Prescriptions State
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

  // New Prescription Form
  const [selectedDrugId, setSelectedDrugId] = useState(CLINICAL_FORMULARY[0].id);
  const [selectedRoute, setSelectedRoute] = useState('PO');
  const [selectedDose, setSelectedDose] = useState('');
  const [safetyEvaluation, setSafetyEvaluation] = useState<SafetyCheckResult | null>(null);

  const selectedDrug = CLINICAL_FORMULARY.find((d) => d.id === selectedDrugId) || CLINICAL_FORMULARY[0];

  const handleEvaluateSafety = (drug: DrugRecord) => {
    const activeDrugRecords = activeMeds.map((m) => m.drug);
    const result = evaluatePrescriptionSafety(
      drug,
      activeDrugRecords,
      knownAllergies,
      { systolicBp, heartRate },
      eGfr
    );
    setSafetyEvaluation(result);
  };

  const handlePlaceMedicationOrder = () => {
    const activeDrugRecords = activeMeds.map((m) => m.drug);
    const result = evaluatePrescriptionSafety(
      selectedDrug,
      activeDrugRecords,
      knownAllergies,
      { systolicBp, heartRate },
      eGfr
    );

    if (result.highestSeverity === 'FATAL_CONTRAINDICATION') {
      setSafetyEvaluation(result);
      return; // Block execution on fatal contraindication
    }

    const newPrescription: ActivePrescription = {
      id: `MED-${Date.now().toString().slice(-4)}`,
      drug: selectedDrug,
      dose: selectedDose || selectedDrug.standardDose,
      route: selectedRoute,
      frequency: 'STAT / ONCE',
      orderedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setActiveMeds([...activeMeds, newPrescription]);
    setSafetyEvaluation(null);

    if (onOrderPlaced) {
      onOrderPlaced('MEDICATION', newPrescription);
    }
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
    setPlacedLabOrders([...placedLabOrders, newLab]);
    if (onOrderPlaced) onOrderPlaced('LAB', newLab);
  };

  const handleAddImaging = (modality: ImagingOrder['modality'], title: string, report: string) => {
    const newImg: ImagingOrder = {
      id: `RAD-${Date.now().toString().slice(-4)}`,
      modality,
      title,
      indication: 'Acute cardiopulmonary evaluation',
      status: 'COMPLETED',
      radiologistReport: report,
    };
    setPlacedImagingOrders([...placedImagingOrders, newImg]);
    if (onOrderPlaced) onOrderPlaced('IMAGING', newImg);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5 text-slate-100">
      {/* CPOE Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-400">
            <FilePlus size={22} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Hospital CPOE & eMAR Order Entry</h3>
            <p className="text-xs text-slate-400">
              Computerized physician order entry with live pharmacovigilance and allergy screening.
            </p>
          </div>
        </div>

        {/* Patient Safety Flags */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="bg-rose-950/70 border border-rose-800/60 px-2.5 py-1 rounded-lg text-rose-300 flex items-center gap-1.5">
            <AlertTriangle size={13} />
            <span>Allergy: {knownAllergies.map((a) => a.allergen).join(', ')}</span>
          </div>
          <div className="bg-amber-950/70 border border-amber-800/60 px-2.5 py-1 rounded-lg text-amber-300">
            eGFR: {eGfr} mL/min (CKD-4)
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-1 rounded-xl w-fit text-xs font-semibold">
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
      </div>

      {/* 1. MEDICATION eMAR TAB */}
      {activeTab === 'MEDS' && (
        <div className="space-y-5">
          {/* Order Placement Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Sparkles size={13} /> Order New Inpatient Medication
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* Formulary Select */}
              <div>
                <label className="text-slate-400 font-mono text-[11px] block mb-1">Medication Form</label>
                <select
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
                <label className="text-slate-400 font-mono text-[11px] block mb-1">Route</label>
                <select
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

              {/* Standard Dose & Verification */}
              <div>
                <label className="text-slate-400 font-mono text-[11px] block mb-1">Dose Specification</label>
                <input
                  type="text"
                  value={selectedDose || selectedDrug.standardDose}
                  onChange={(e) => setSelectedDose(e.target.value)}
                  placeholder={selectedDrug.standardDose}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 p-2.5 rounded-lg outline-none focus:border-indigo-500 font-mono"
                />
              </div>
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
                <div className="font-bold flex items-center gap-2">
                  {safetyEvaluation.highestSeverity === 'FATAL_CONTRAINDICATION' ? (
                    <>
                      <AlertTriangle size={16} className="text-rose-400" />
                      <span>CRITICAL SAFETY RED FLAG — DO NOT ADMINISTER</span>
                    </>
                  ) : safetyEvaluation.highestSeverity === 'MAJOR_WARNING' ? (
                    <>
                      <AlertTriangle size={16} className="text-amber-400" />
                      <span>CLINICAL WARNING — CAUTION REQUIRED</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} className="text-emerald-400" />
                      <span>Pharmacology Safety Screening Cleared</span>
                    </>
                  )}
                </div>

                {safetyEvaluation.alerts.map((alt, idx) => (
                  <div key={idx} className="border-t border-slate-800/80 pt-1.5 space-y-0.5 font-mono text-[11px]">
                    <div className="font-bold">{alt.title}</div>
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

            {/* Submit Prescription Button */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleEvaluateSafety(selectedDrug)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono font-semibold transition-all"
              >
                Run Safety Screening
              </button>
              <button
                onClick={handlePlaceMedicationOrder}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow"
              >
                Sign & Transmit Prescription
              </button>
            </div>
          </div>

          {/* Active Medication Administration Record (eMAR) List */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Active Inpatient eMAR Flowsheet
            </h4>
            <div className="divide-y divide-slate-800 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden text-xs">
              {activeMeds.map((med) => (
                <div key={med.id} className="p-3.5 flex items-center justify-between hover:bg-slate-900/40">
                  <div className="space-y-0.5">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{med.drug.name}</span>
                      <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                        {med.route}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {med.dose} | {med.frequency} | Ordered: {med.orderedAt}
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={12} /> Active In Infusion
                  </span>
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
                name: 'Coagulation Panel (PT/INR, PTT)',
                cat: 'HEMATOLOGY' as const,
                res: 'PT: 12.1s, INR: 1.05, aPTT: 28s (Within normal limits)',
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
                  <span className="font-bold text-white">{lab.name}</span>
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
                rep: 'Akinesis of the anterior wall and cardiac apex. Left ventricular ejection fraction (LVEF) approximately 35%. No significant valvular stenosis.',
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
    </div>
  );
}
