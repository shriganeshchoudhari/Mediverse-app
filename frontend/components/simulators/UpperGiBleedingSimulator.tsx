'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  HeartPulse,
  Flame,
  ShieldAlert,
  Pill,
  Droplets,
  Layers,
} from 'lucide-react';
import {
  calculateGlasgowBlatchfordScore,
  calculateRockallScore,
  analyzeForrestClassification,
  simulateUpperGiBleedingState,
  BleedEtiology,
  ForrestClass,
  PatientVitalsLabs,
  EndoscopicFindings,
  PharmacotherapyRegimen,
  EndoscopicIntervention,
} from '../../.gemini/skills/UpperGiBleedingEngine';

interface PresetCase {
  id: string;
  name: string;
  description: string;
  patient: PatientVitalsLabs;
  endoscopy: EndoscopicFindings;
}

const PRESET_CASES: PresetCase[] = [
  {
    id: 'spurting-duodenal-ulcer',
    name: 'Bleeding Duodenal Ulcer (Forrest Ia)',
    description: '58yo male with recurrent NSAID use presenting with coffee-ground emesis, melena, tachycardia, and active arterial spurting ulcer.',
    patient: {
      ageYears: 58,
      systolicBpMmHg: 92,
      heartRateBpm: 114,
      bloodUreaNitrogenMgDl: 32.0,
      hemoglobinGDl: 7.8,
      sex: 'MALE',
      presentationMelena: true,
      presentationSyncope: false,
      hasHepaticDisease: false,
      hasCardiacFailure: false,
      hasRenalFailure: false,
      hasMalignancy: false,
    },
    endoscopy: {
      etiology: 'PEPTIC_ULCER_DUODENAL',
      forrestClass: 'Ia',
      stigmataOfRecentHemorrhage: true,
      ulcerSizeMm: 16,
    },
  },
  {
    id: 'ruptured-esophageal-varices',
    name: 'Cirrhotic Bleeding Esophageal Varices',
    description: '62yo female with Child-Pugh B cirrhosis presenting with torrential hematemesis, hemodynamic instability, and large bleeding varices.',
    patient: {
      ageYears: 62,
      systolicBpMmHg: 84,
      heartRateBpm: 122,
      bloodUreaNitrogenMgDl: 42.0,
      hemoglobinGDl: 6.9,
      sex: 'FEMALE',
      presentationMelena: true,
      presentationSyncope: true,
      hasHepaticDisease: true,
      hasCardiacFailure: false,
      hasRenalFailure: false,
      hasMalignancy: false,
    },
    endoscopy: {
      etiology: 'ESOPHAGEAL_VARICES',
      forrestClass: 'NOT_APPLICABLE',
      varicealGrade: 'GRADE_III',
      varicealRedColorSigns: true,
      stigmataOfRecentHemorrhage: true,
    },
  },
  {
    id: 'clean-gastric-ulcer-low-risk',
    name: 'Clean Base Gastric Ulcer (Forrest III)',
    description: '35yo female with mild epigastric pain and dark stool. Stable vitals, normal BUN, eligible for outpatient management consideration.',
    patient: {
      ageYears: 35,
      systolicBpMmHg: 124,
      heartRateBpm: 70,
      bloodUreaNitrogenMgDl: 12.0,
      hemoglobinGDl: 13.2,
      sex: 'FEMALE',
      presentationMelena: true,
      presentationSyncope: false,
      hasHepaticDisease: false,
      hasCardiacFailure: false,
      hasRenalFailure: false,
      hasMalignancy: false,
    },
    endoscopy: {
      etiology: 'PEPTIC_ULCER_GASTRIC',
      forrestClass: 'III',
      stigmataOfRecentHemorrhage: false,
      ulcerSizeMm: 8,
    },
  },
];

export default function UpperGiBleedingSimulator() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(PRESET_CASES[0].id);

  const [ageYears, setAgeYears] = useState<number>(PRESET_CASES[0].patient.ageYears);
  const [systolicBp, setSystolicBp] = useState<number>(PRESET_CASES[0].patient.systolicBpMmHg);
  const [heartRate, setHeartRate] = useState<number>(PRESET_CASES[0].patient.heartRateBpm);
  const [bun, setBun] = useState<number>(PRESET_CASES[0].patient.bloodUreaNitrogenMgDl);
  const [hemoglobin, setHemoglobin] = useState<number>(PRESET_CASES[0].patient.hemoglobinGDl);
  const [sex, setSex] = useState<'MALE' | 'FEMALE'>(PRESET_CASES[0].patient.sex);
  const [melena, setMelena] = useState<boolean>(PRESET_CASES[0].patient.presentationMelena);
  const [syncope, setSyncope] = useState<boolean>(PRESET_CASES[0].patient.presentationSyncope);
  const [cirrhosis, setCirrhosis] = useState<boolean>(PRESET_CASES[0].patient.hasHepaticDisease);
  const [heartFailure, setHeartFailure] = useState<boolean>(PRESET_CASES[0].patient.hasCardiacFailure);
  const [renalFailure, setRenalFailure] = useState<boolean>(PRESET_CASES[0].patient.hasRenalFailure);
  const [malignancy, setMalignancy] = useState<boolean>(PRESET_CASES[0].patient.hasMalignancy);

  const [etiology, setEtiology] = useState<BleedEtiology>(PRESET_CASES[0].endoscopy.etiology);
  const [forrestClass, setForrestClass] = useState<ForrestClass>(PRESET_CASES[0].endoscopy.forrestClass);
  const [varicealGrade, setVaricealGrade] = useState<'GRADE_I' | 'GRADE_II' | 'GRADE_III'>('GRADE_III');
  const [varicealRedColorSigns, setVaricealRedColorSigns] = useState<boolean>(true);

  const [ivPpi, setIvPpi] = useState<PharmacotherapyRegimen['ivPpiType']>('PANTOPRAZOLE_80MG_BOLUS_8MG_HR');
  const [vasoactiveAgent, setVasoactiveAgent] = useState<PharmacotherapyRegimen['vasoactiveAgent']>('NONE');
  const [antibiotic, setAntibiotic] = useState<PharmacotherapyRegimen['prophylacticAntibiotic']>('NONE');
  const [prokinetic, setProkinetic] = useState<PharmacotherapyRegimen['prokineticPreEndoscopy']>('NONE');

  const [primaryModality, setPrimaryModality] = useState<EndoscopicIntervention['primaryModality']>('DUAL_THERAPY_EPI_PLUS_HEMOCLIP');
  const [salvageTamponade, setSalvageTamponade] = useState<boolean>(false);
  const [gastricBalloonVolume, setGastricBalloonVolume] = useState<number>(250);
  const [esophagealBalloonPressure, setEsophagealBalloonPressure] = useState<number>(35);
  const [tipsPerformed, setTipsPerformed] = useState<boolean>(false);

  // Preset Switcher
const handleLoadCase = (caseId: string) => {
  const c = PRESET_CASES.find((p) => p.id === caseId);
  if (!c) return;
  setSelectedCaseId(c.id);
  setAgeYears(c.patient.ageYears);
  setSystolicBp(c.patient.systolicBpMmHg);
  setHeartRate(c.patient.heartRateBpm);
  setBun(c.patient.bloodUreaNitrogenMgDl);
  setHemoglobin(c.patient.hemoglobinGDl);
  setSex(c.patient.sex);
  setMelena(c.patient.presentationMelena);
  setSyncope(c.patient.presentationSyncope);
  setCirrhosis(c.patient.hasHepaticDisease);
  setHeartFailure(c.patient.hasCardiacFailure);
  setRenalFailure(c.patient.hasRenalFailure);
  setMalignancy(c.patient.hasMalignancy);

  setEtiology(c.endoscopy.etiology);
  setForrestClass(c.endoscopy.forrestClass);
  if (c.endoscopy.varicealGrade) setVaricealGrade(c.endoscopy.varicealGrade);
  setVaricealRedColorSigns(c.endoscopy.varicealRedColorSigns ?? false);

  if (c.endoscopy.etiology === 'ESOPHAGEAL_VARICES') {
    setVasoactiveAgent('OCTREOTIDE_50MCG_BOLUS_50MCG_HR');
    setAntibiotic('CEFTRIAXONE_1G_IV_DAILY');
    setIvPpi('NONE');
    setPrimaryModality('BAND_LIGATION_EVL');
  } else {
    setVasoactiveAgent('NONE');
    setAntibiotic('NONE');
    setIvPpi('PANTOPRAZOLE_80MG_BOLUS_8MG_HR');
    setPrimaryModality('DUAL_THERAPY_EPI_PLUS_HEMOCLIP');
  }
  setSalvageTamponade(false);
  setTipsPerformed(false);
};

const currentPatient: PatientVitalsLabs = useMemo(() => ({
  ageYears,
  systolicBpMmHg: systolicBp,
  heartRateBpm: heartRate,
  bloodUreaNitrogenMgDl: bun,
  hemoglobinGDl: hemoglobin,
  sex,
  presentationMelena: melena,
  presentationSyncope: syncope,
  hasHepaticDisease: cirrhosis,
  hasCardiacFailure: heartFailure,
  hasRenalFailure: renalFailure,
  hasMalignancy: malignancy,
}), [ageYears, systolicBp, heartRate, bun, hemoglobin, sex, melena, syncope, cirrhosis, heartFailure, renalFailure, malignancy]);

const currentEndoscopy: EndoscopicFindings = useMemo(() => ({
  etiology,
  forrestClass,
  varicealGrade,
  varicealRedColorSigns,
  stigmataOfRecentHemorrhage: forrestClass !== 'III' && forrestClass !== 'IIc',
}), [etiology, forrestClass, varicealGrade, varicealRedColorSigns]);

const currentPharma: PharmacotherapyRegimen = useMemo(() => ({
  ivPpiType: ivPpi,
  vasoactiveAgent,
  prophylacticAntibiotic: antibiotic,
  prokineticPreEndoscopy: prokinetic,
  tranexamicAcidGiven: false,
}), [ivPpi, vasoactiveAgent, antibiotic, prokinetic]);

const currentIntervention: EndoscopicIntervention = useMemo(() => ({
  primaryModality,
  salvageTamponadeApplied: salvageTamponade,
  gastricBalloonVolumeMl: gastricBalloonVolume,
  esophagealBalloonPressureMmHg: esophagealBalloonPressure,
  tipsEvaluatedOrPerformed: tipsPerformed,
}), [primaryModality, salvageTamponade, gastricBalloonVolume, esophagealBalloonPressure, tipsPerformed]);

const gbsResult = useMemo(() => calculateGlasgowBlatchfordScore(currentPatient), [currentPatient]);
const rockallResult = useMemo(() => calculateRockallScore(currentPatient, currentEndoscopy), [currentPatient, currentEndoscopy]);
const forrestAnalysis = useMemo(() => analyzeForrestClassification(forrestClass), [forrestClass]);
const simState = useMemo(() => simulateUpperGiBleedingState(currentPatient, currentEndoscopy, currentPharma, currentIntervention, 4), [currentPatient, currentEndoscopy, currentPharma, currentIntervention]);

return (
  <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8 font-sans">
    <div className="max-w-7xl mx-auto mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
              <Flame className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                Acute Upper GI Bleeding, Rockall & Hemostasis Workstation
              </h1>
              <p className="text-sm text-slate-400">
                GBS triage, Full Rockall scoring, Forrest ulcer classification, vasoactive infusion & balloon tamponade.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Preset:</span>
          <select
            value={selectedCaseId}
            onChange={(e) => handleLoadCase(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-rose-300 rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            {PRESET_CASES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Triage & Clinical Parameters (4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <h2 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4" /> 1. Initial Presentation & Labs
          </h2>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400">Age: {ageYears} yr</label>
                <input
                  type="range"
                  min="18"
                  max="95"
                  value={ageYears}
                  onChange={(e) => setAgeYears(Number(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded"
                />
              </div>
              <div>
                <label className="text-slate-400">Sex</label>
                <div className="flex gap-1 mt-1">
                  <button
                    onClick={() => setSex('MALE')}
                    className={'flex-1 py-1 rounded text-center font-medium ' + (sex === 'MALE' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400')}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => setSex('FEMALE')}
                    className={'flex-1 py-1 rounded text-center font-medium ' + (sex === 'FEMALE' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400')}
                  >
                    Female
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400">Systolic BP: {systolicBp} mmHg</label>
                <input
                  type="range"
                  min="50"
                  max="170"
                  value={systolicBp}
                  onChange={(e) => setSystolicBp(Number(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded"
                />
              </div>
              <div>
                <label className="text-slate-400">Heart Rate: {heartRate} bpm</label>
                <input
                  type="range"
                  min="45"
                  max="160"
                  value={heartRate}
                  onChange={(e) => setHeartRate(Number(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400">BUN: {bun} mg/dL</label>
                <input
                  type="range"
                  min="5"
                  max="90"
                  step="1"
                  value={bun}
                  onChange={(e) => setBun(Number(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded"
                />
              </div>
              <div>
                <label className="text-slate-400">Hemoglobin: {hemoglobin} g/dL</label>
                <input
                  type="range"
                  min="4.0"
                  max="17.0"
                  step="0.1"
                  value={hemoglobin}
                  onChange={(e) => setHemoglobin(Number(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={melena}
                  onChange={(e) => setMelena(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-rose-500"
                />
                Melena stool
              </label>
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={syncope}
                  onChange={(e) => setSyncope(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-rose-500"
                />
                Syncope / Collapse
              </label>
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cirrhosis}
                  onChange={(e) => setCirrhosis(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-rose-500"
                />
                Cirrhosis / Liver Dz
              </label>
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={heartFailure}
                  onChange={(e) => setHeartFailure(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-rose-500"
                />
                Heart Failure
              </label>
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={renalFailure}
                  onChange={(e) => setRenalFailure(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-rose-500"
                />
                Renal Failure
              </label>
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={malignancy}
                  onChange={(e) => setMalignancy(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-rose-500"
                />
                Malignancy
              </label>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <h2 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4" /> 2. Endoscopic Inspection
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Etiology Identification</label>
              <select
                value={etiology}
                onChange={(e) => setEtiology(e.target.value as BleedEtiology)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
              >
                <option value="PEPTIC_ULCER_DUODENAL">Peptic Ulcer - Duodenal Bulb</option>
                <option value="PEPTIC_ULCER_GASTRIC">Peptic Ulcer - Gastric Antrum/Body</option>
                <option value="ESOPHAGEAL_VARICES">Esophageal Varices</option>
                <option value="GASTRIC_VARICES_GOV2">Gastric Varices (GOV2 / IGV1)</option>
                <option value="MALLORY_WEISS_TEAR">Mallory-Weiss Tear</option>
                <option value="DIEULAFOY_LESION">Dieulafoy Vascular Malformation</option>
                <option value="GASTRIC_ANTRAL_VASCULAR_ECTASIA">GAVE (Watermelon Stomach)</option>
              </select>
            </div>

            {etiology.startsWith('PEPTIC_ULCER') && (
              <div>
                <label className="text-slate-400 block mb-1">Forrest Classification (Peptic Ulcer)</label>
                <select
                  value={forrestClass}
                  onChange={(e) => setForrestClass(e.target.value as ForrestClass)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                >
                  <option value="Ia">Forrest Ia: Active Spurting Hemorrhage</option>
                  <option value="Ib">Forrest Ib: Active Oozing Hemorrhage</option>
                  <option value="IIa">Forrest IIa: Non-Bleeding Visible Vessel</option>
                  <option value="IIb">Forrest IIb: Adherent Clot</option>
                  <option value="IIc">Forrest IIc: Flat Hematin / Pigmented Spot</option>
                  <option value="III">Forrest III: Clean Base Ulcer</option>
                </select>
              </div>
            )}

            {etiology.includes('VARICES') && (
              <div className="space-y-2 pt-1 border-t border-slate-800">
                <div>
                  <label className="text-slate-400 block mb-1">Variceal Size Grade</label>
                  <select
                    value={varicealGrade}
                    onChange={(e) => setVaricealGrade(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                  >
                    <option value="GRADE_I">Grade I: Small, straight veins</option>
                    <option value="GRADE_II">Grade II: Medium, tortuous occupying &lt; 1/3 lumen</option>
                    <option value="GRADE_III">Grade III: Large, nodular occupying &gt; 1/3 lumen</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={varicealRedColorSigns}
                    onChange={(e) => setVaricealRedColorSigns(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-rose-500"
                  />
                  Red Wale markings / Cherry-red spots
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center Column: Risk Scores & Forrest Analysis (4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Glasgow-Blatchford Score
            </h2>
            <span className={'px-2 py-0.5 rounded text-xs font-bold ' + (
              gbsResult.riskCategory === 'VERY_LOW_RISK'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : gbsResult.riskCategory === 'INTERMEDIATE_RISK'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            )}>
              Score: {gbsResult.score} / 23
            </span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">Outpatient Discharge Eligible:</span>
              <span className={'font-semibold ' + (gbsResult.outpatientEligible ? 'text-emerald-400' : 'text-rose-400')}>
                {gbsResult.outpatientEligible ? 'YES (GBS <= 1)' : 'NO (Admission Required)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
              {gbsResult.recommendation}
            </p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <HeartPulse className="w-4 h-4" /> Full Rockall Score
            </h2>
            <span className={'px-2 py-0.5 rounded text-xs font-bold ' + (
              rockallResult.riskTier === 'LOW_RISK'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : rockallResult.riskTier === 'MODERATE_RISK'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            )}>
              Post-EGD: {rockallResult.postEndoscopyScore} (Pre: {rockallResult.preEndoscopyScore})
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg text-center">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Predicted Rebleed</div>
              <div className="text-lg font-bold text-rose-400">{rockallResult.predictedRebleedRiskPercent}%</div>
            </div>
            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg text-center">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Predicted Mortality</div>
              <div className="text-lg font-bold text-rose-400">{rockallResult.predictedMortalityPercent}%</div>
            </div>
          </div>
        </div>

        {etiology.startsWith('PEPTIC_ULCER') && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Droplets className="w-4 h-4" /> Forrest Ulcer Analysis
            </h2>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs space-y-2">
              <div className="font-semibold text-amber-300">{forrestAnalysis.stigmataName}</div>
              <div className="flex justify-between text-slate-300">
                <span>Natural Rebleed Risk:</span>
                <span className="font-bold text-rose-400">{forrestAnalysis.rebleedRiskWithoutTherapyPercent}%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Endoscopic Therapy Mandated:</span>
                <span className={'font-semibold ' + (forrestAnalysis.endoscopicTherapyMandated ? 'text-rose-400' : 'text-emerald-400')}>
                  {forrestAnalysis.endoscopicTherapyMandated ? 'YES (Dual Therapy)' : 'NO (Medical Rx)'}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>High-Dose IV PPI Bolus/Infusion:</span>
                <span className={'font-semibold ' + (forrestAnalysis.highDoseIvPpiIndicated ? 'text-rose-400' : 'text-slate-400')}>
                  {forrestAnalysis.highDoseIvPpiIndicated ? 'YES (80mg + 8mg/h)' : 'NO (Oral BID)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">
                {forrestAnalysis.rationale}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Interventions & Hemostasis Simulation (4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <h2 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2 mb-3">
            <Pill className="w-4 h-4" /> 3. Medical & Endoscopic Therapy
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">IV Proton Pump Inhibitor</label>
              <select
                value={ivPpi}
                onChange={(e) => setIvPpi(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
              >
                <option value="PANTOPRAZOLE_80MG_BOLUS_8MG_HR">Pantoprazole 80mg bolus + 8mg/h continuous (pH &gt; 6.0)</option>
                <option value="INTERMITTENT_40MG_BID">Pantoprazole 40mg IV BID (Intermittent)</option>
                <option value="NONE">None</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Vasoactive Portal Splanchnic Agent</label>
              <select
                value={vasoactiveAgent}
                onChange={(e) => setVasoactiveAgent(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
              >
                <option value="OCTREOTIDE_50MCG_BOLUS_50MCG_HR">Octreotide 50mcg bolus + 50mcg/h IV</option>
                <option value="TERLIPRESSIN_2MG_Q4H">Terlipressin 2mg IV q4h (Baveno VII standard)</option>
                <option value="SOMATOSTATIN_250MCG_HR">Somatostatin 250mcg/h IV</option>
                <option value="NONE">None</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Prophylactic Antibiotic (Cirrhosis SBP)</label>
              <select
                value={antibiotic}
                onChange={(e) => setAntibiotic(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
              >
                <option value="CEFTRIAXONE_1G_IV_DAILY">Ceftriaxone 1g IV daily (7 days)</option>
                <option value="CIPROFLOXACIN_IV">Ciprofloxacin 400mg IV q12h</option>
                <option value="NONE">None</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Primary Endoscopic Modality</label>
              <select
                value={primaryModality}
                onChange={(e) => setPrimaryModality(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
              >
                <option value="DUAL_THERAPY_EPI_PLUS_HEMOCLIP">Dual Therapy: Epi + Through-the-scope Clip</option>
                <option value="DUAL_THERAPY_EPI_PLUS_THERMAL">Dual Therapy: Epi + Thermal Bipolar Coagulation</option>
                <option value="BAND_LIGATION_EVL">Variceal Band Ligation (EVL)</option>
                <option value="CYANOACRYLATE_GLUE">Cyanoacrylate / Lipiodol Glue Injection</option>
                <option value="OVER_THE_SCOPE_CLIP_OTSC">Over-The-Scope Clip (OTSC / Bear Claw)</option>
                <option value="HEMOSTATIC_POWDER_TC325">TC-325 Hemostatic Powder Spray</option>
                <option value="NONE">No Endoscopic Therapy</option>
              </select>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="flex items-center gap-2 text-rose-300 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={salvageTamponade}
                  onChange={(e) => setSalvageTamponade(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-rose-500"
                />
                Deploy Salvage Sengstaken-Blakemore Tube
              </label>

              {salvageTamponade && (
                <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-lg space-y-2 text-[11px]">
                  <div>
                    <label className="text-slate-300">Gastric Balloon Vol: {gastricBalloonVolume} mL (Target 250-300)</label>
                    <input
                      type="range"
                      min="100"
                      max="400"
                      value={gastricBalloonVolume}
                      onChange={(e) => setGastricBalloonVolume(Number(e.target.value))}
                      className="w-full accent-rose-500 h-1 bg-slate-800 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300">Esophageal Balloon: {esophagealBalloonPressure} mmHg (Safe 30-45)</label>
                    <input
                      type="range"
                      min="15"
                      max="65"
                      value={esophagealBalloonPressure}
                      onChange={(e) => setEsophagealBalloonPressure(Number(e.target.value))}
                      className="w-full accent-rose-500 h-1 bg-slate-800 rounded"
                    />
                  </div>
                </div>
              )}

              <label className="flex items-center gap-2 text-cyan-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={tipsPerformed}
                  onChange={(e) => setTipsPerformed(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500"
                />
                Preemptive TIPS Evaluated / Performed (&lt; 72h)
              </label>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <h2 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2 mb-3">
            <Droplets className="w-4 h-4" /> 4. Hemostasis Scoreboard
          </h2>

          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="p-2 bg-slate-950/70 border border-slate-800 rounded">
              <div className="text-[10px] text-slate-400">Bleed Rate</div>
              <div className={'text-base font-bold ' + (simState.activeBleedingRateMlMin === 0 ? 'text-emerald-400' : 'text-rose-400')}>
                {simState.activeBleedingRateMlMin} mL/min
              </div>
            </div>

            <div className="p-2 bg-slate-950/70 border border-slate-800 rounded">
              <div className="text-[10px] text-slate-400">Post-Tx Hemoglobin</div>
              <div className="text-base font-bold text-slate-200">
                {simState.currentHemoglobin} g/dL
              </div>
            </div>

            <div className="p-2 bg-slate-950/70 border border-slate-800 rounded">
              <div className="text-[10px] text-slate-400">72h Rebleed Risk</div>
              <div className="text-base font-bold text-amber-400">
                {simState.rebleedingRiskAt72HoursPercent}%
              </div>
            </div>

            <div className="p-2 bg-slate-950/70 border border-slate-800 rounded">
              <div className="text-[10px] text-slate-400">PRBC Transfusion Need</div>
              <div className="text-base font-bold text-rose-400">
                {simState.transfusionRequirementUnitsPrbc} Units
              </div>
            </div>
          </div>

          {simState.tamponadeComplicationDetected && simState.tamponadeComplicationDetected !== 'NONE' && (
            <div className="p-2.5 bg-rose-950/80 border border-rose-500 rounded-lg text-rose-200 text-xs font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              BALLOON COMPLICATION: {simState.tamponadeComplicationDetected}
            </div>
          )}

          <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1 text-[11px] text-slate-300 max-h-36 overflow-y-auto">
            {simState.clinicalSummary.map((msg, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="text-rose-400">•</span>
                <span>{msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
