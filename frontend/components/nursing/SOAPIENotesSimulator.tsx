'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  BookOpen,
  Eye,
  Award,
  Stethoscope,
  Heart,
  Thermometer,
  Activity,
  User,
  ShieldAlert,
  Flame,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import styles from './SOAPIENotesSimulator.module.css';

export interface SOAPIEEntry {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  intervention: string;
  evaluation: string;
}

export interface RubricCriterion {
  id: string;
  section: 'S' | 'O' | 'A' | 'P' | 'I' | 'E';
  description: string;
  keywords: string[];
  isCritical: boolean;
  points: number;
}

export interface ClinicalScenario {
  id: string;
  title: string;
  subtitle: string;
  acuity: 'Moderate' | 'High' | 'Critical';
  patient: {
    name: string;
    ageGender: string;
    mrn: string;
    bed: string;
    consultant: string;
    admissionDx: string;
    allergies: string;
    codeStatus: string;
  };
  vitals: {
    bp: string;
    hr: string;
    rr: string;
    spo2: string;
    temp: string;
    pain: string;
    gcs?: string;
    news2?: number;
  };
  clinicalBrief: string;
  phraseBank: {
    s: string[];
    o: string[];
    a: string[];
    p: string[];
    i: string[];
    e: string[];
  };
  rubric: RubricCriterion[];
  exemplar: SOAPIEEntry;
}

const SCENARIOS: ClinicalScenario[] = [
  {
    id: 'lap-chole-atelectasis',
    title: 'Scenario 1: Post-op Day 1 Lap Cholecystectomy (Atelectasis & Hypoxemia)',
    subtitle: 'Post-op hypoxemia (SpO2 89% on Room Air) with shallow splinted respirations and basal crackles.',
    acuity: 'Moderate',
    patient: {
      name: 'Evelyn Vance',
      ageGender: '54y / Female',
      mrn: 'MRN-7840192',
      bed: 'Surg Ward 314-B',
      consultant: 'Dr. A. Mehta (General Surgery)',
      admissionDx: 'POD 1 Laparoscopic Cholecystectomy for symptomatic cholelithiasis',
      allergies: 'Penicillin (Anaphylaxis)',
      codeStatus: 'Full Code'
    },
    vitals: {
      bp: '132/84 mmHg',
      hr: '98 bpm (Sinus)',
      rr: '26/min (Shallow/Splinting)',
      spo2: '89% (Room Air)',
      temp: '37.8 °C',
      pain: '6/10 (Subcostal Incision)'
    },
    clinicalBrief:
      'POD 1 following laparoscopic cholecystectomy. Patient is reluctant to breathe deeply due to right subcostal incisional pain (6/10). SpO2 has dropped to 89% on room air with shallow respirations (RR 26). Auscultation reveals bilateral basilar inspiratory crackles and diminished breath sounds at bases. Surgical dressings are dry and intact. No calf swelling or signs of DVT.',
    phraseBank: {
      s: [
        'States: "Hurts when I try to take a deep breath"',
        'Pain 6/10 sharp at right upper quadrant / subcostal incision',
        'Reports feeling lightheaded and short of breath',
        'Denies nausea or chest pain'
      ],
      o: [
        'SpO2 89% on room air, RR 26/min shallow',
        'BP 132/84, HR 98 bpm regular, Temp 37.8°C',
        'Decreased breath sounds & fine inspiratory crackles at bilateral lung bases',
        'Surgical dressings dry and intact x4 laparoscopic ports',
        'Abdomen soft with expected mild RUQ tenderness; active bowel sounds'
      ],
      a: [
        'Impaired Gas Exchange r/t alveolar hypoventilation & atelectasis aeb SpO2 89% and basal crackles',
        'Acute Pain r/t surgical incision aeb pain score 6/10 and respiratory splinting',
        'Risk for Postoperative Pulmonary Complications (PPC)'
      ],
      p: [
        'Place patient in High-Fowler position (60-75°)',
        'Administer supplemental O2 via nasal cannula @ 2 L/min to target SpO2 >94%',
        'Guide incentive spirometry (10 breaths/hr) with pillow splinting',
        'Notify Surgical Registrar via SBAR communication',
        'Reassess respiratory status and SpO2 in 20-30 minutes'
      ],
      i: [
        'Elevated head of bed to High-Fowler position (75°)',
        'Applied nasal cannula O2 @ 2 L/min; SpO2 monitored continuously',
        'Coached incentive spirometry technique: achieved 1000 mL with pillow splinting over RUQ incision',
        'Verified patent 20G IV in left forearm without erythema or phlebitis',
        'Called Dr. Mehta (SBAR given); reviewed PRN analgesia orders'
      ],
      e: [
        'SpO2 improved from 89% to 96% on 2 L/min nasal cannula',
        'RR slowed from 26/min to 18/min; ease of breathing reported',
        'Pain decreased from 6/10 to 3/10 with splinting technique and repositioning',
        'Patient demonstrates independent incentive spirometer use'
      ]
    },
    rubric: [
      {
        id: 's-pain-score',
        section: 'S',
        description: 'Documented pain score (0-10) and specific location/characteristics',
        keywords: ['pain', '6/10', '6', 'incision', 'subcostal', 'ruq', 'sharp'],
        isCritical: true,
        points: 15
      },
      {
        id: 's-patient-quote',
        section: 'S',
        description: 'Recorded patient symptom quote or direct complaint of shortness of breath / lightheadedness',
        keywords: ['breathe', 'breath', 'hurts', 'shortness', 'dizzy', 'lightheaded', 'quotes', 'states'],
        isCritical: false,
        points: 10
      },
      {
        id: 'o-vitals-spo2',
        section: 'O',
        description: 'Documented initial SpO2 (89%), room air status, and respiratory rate (26)',
        keywords: ['89%', '89', 'room air', '26', 'rr 26', 'spo2'],
        isCritical: true,
        points: 20
      },
      {
        id: 'o-exam-crackles',
        section: 'O',
        description: 'Recorded respiratory physical exam (basal crackles / diminished breath sounds)',
        keywords: ['crackles', 'crepitations', 'diminished', 'breath sounds', 'bases', 'shallow', 'splinting'],
        isCritical: false,
        points: 15
      },
      {
        id: 'a-nanda-gas-exchange',
        section: 'A',
        description: 'Formulated NANDA nursing diagnosis for Impaired Gas Exchange / Atelectasis & Acute Pain',
        keywords: ['impaired gas exchange', 'atelectasis', 'gas exchange', 'ineffective breathing', 'acute pain', 'hypoventilation'],
        isCritical: true,
        points: 20
      },
      {
        id: 'p-position-sbar',
        section: 'P',
        description: 'Planned High-Fowler positioning, oxygen therapy, incentive spirometry, and SBAR escalation',
        keywords: ['fowler', 'high-fowler', 'oxygen', 'o2', 'nasal cannula', 'incentive spirom', 'sbar', 'notify', 'mehta', 'dr'],
        isCritical: true,
        points: 20
      },
      {
        id: 'i-interventions-delivered',
        section: 'I',
        description: 'Documented specific interventions delivered (e.g., 2 L/min NC, splinting, IV check)',
        keywords: ['fowler', '2 l/min', '2l', 'nasal cannula', 'spirometry', 'splint', 'iv', 'sbar', 'called'],
        isCritical: true,
        points: 25
      },
      {
        id: 'e-reassessment-data',
        section: 'E',
        description: 'Documented post-intervention evaluation with updated SpO2 (96%), RR (18), and pain reduction',
        keywords: ['96%', '96', '18', 'rr 18', 'improved', '3/10', '3', 'eased', 'tolerated'],
        isCritical: true,
        points: 25
      }
    ],
    exemplar: {
      subjective:
        'Patient reports: "It hurts when I try to take a deep breath, and I feel a little dizzy and short of breath." Rates right subcostal surgical pain at 6/10 sharp pain on inspiration. Denies nausea, vomiting, or chest pain.',
      objective:
        'Vitals: BP 132/84 mmHg, HR 98 bpm regular, RR 26/min (shallow with visible respiratory splinting), SpO2 89% on Room Air, Temp 37.8°C. Chest auscultation reveals fine inspiratory crackles and diminished breath sounds at bilateral lung bases. Surgical dressings dry, clean, and intact across 4 laparoscopic port sites. Abdomen soft with localized RUQ tenderness. Peripheral IV 20G left forearm patent, no erythema.',
      assessment:
        '1. Impaired Gas Exchange related to alveolar hypoventilation secondary to incisional pain and respiratory splinting as evidenced by SpO2 89% on room air, RR 26/min, and bilateral basal crackles (early post-op atelectasis).\n2. Acute Pain related to surgical trauma as evidenced by patient report of 6/10 pain on inspiration.',
      plan:
        '1. Position patient in High-Fowler position (75°).\n2. Apply supplemental oxygen via nasal cannula at 2 L/min to maintain SpO2 ≥94%.\n3. Instruct and assist with incentive spirometry (10 breaths/hr) and pillow splinting during deep breathing/coughing.\n4. Communicate deterioration to surgical registrar Dr. Mehta via SBAR.\n5. Re-evaluate SpO2, respiratory effort, and pain within 30 minutes.',
      intervention:
        '08:15 - Repositioned patient to High-Fowler position (75°).\n08:17 - Placed supplemental O2 at 2 L/min via nasal cannula.\n08:20 - Demonstrated pillow splinting over RUQ incision and guided through 10 repetitions of incentive spirometry (patient achieved 1,000 mL volume mark).\n08:25 - Phoned Dr. Mehta (SBAR briefing provided); doctor acknowledged plan.\n08:28 - Inspected and flushed 20G left forearm IV cannula (patent, no redness/swelling).',
      evaluation:
        '08:45 - Reassessment: SpO2 improved to 96% on 2 L/min nasal cannula. RR decreased to 18/min with regular, relaxed respiratory excursion. Patient reports pain reduced to 3/10 following pillow splinting technique and states: "My breathing feels much lighter now." Bilateral breath sounds are clearer with resolving basilar crackles.'
    }
  },
  {
    id: 'sepsis-escalation',
    title: 'Scenario 2: Sepsis Escalation & Deterioration (NEWS2 Score = 8)',
    subtitle: 'Severe pyelonephritis deterioration: Hypotension (88/50), Tachycardia (122), Febrile (39.1°C), Altered mentation.',
    acuity: 'Critical',
    patient: {
      name: 'Arthur Pendelton',
      ageGender: '72y / Male',
      mrn: 'MRN-4491028',
      bed: 'Medical Stepdown - Bed 12',
      consultant: 'Dr. R. Davis (Internal Medicine)',
      admissionDx: 'Complicated Pyelonephritis / Urosepsis',
      allergies: 'Sulfa Drugs (Rash)',
      codeStatus: 'Full Code / CPR'
    },
    vitals: {
      bp: '88/50 mmHg (MAP 63)',
      hr: '122 bpm (Sinus Tachycardia)',
      rr: '28/min',
      spo2: '93% (Room Air)',
      temp: '39.1 °C (Rigors)',
      pain: '7/10 (Flank / Lower Back)',
      gcs: '14 (Confused to year)',
      news2: 8
    },
    clinicalBrief:
      '72M admitted 6 hours ago with acute pyelonephritis. Sudden acute clinical deterioration: patient shivering uncontrollably with severe rigors, flushed skin, and new disorientation (GCS 14, confused to time/year). NEWS2 score calculated at 8 (High Risk tier). BP dropped to 88/50 mmHg with HR 122 bpm, RR 28, Temp 39.1°C. Indwelling Foley catheter shows cloudy amber urine with sediment; urine output past 2 hours was 25 mL total. Urgent Medical Emergency Team (MET) escalation required under Sepsis Six protocol.',
    phraseBank: {
      s: [
        'Patient shivering uncontrollably, stating: "I feel freezing and dizzy"',
        'Reports throbbing 7/10 bilateral flank pain',
        'Confused: states year is "1985" (baseline oriented x3)',
        'Denies nausea or acute chest pain'
      ],
      o: [
        'NEWS2 score = 8 (High Clinical Risk: BP 88/50, HR 122, RR 28, Temp 39.1°C, GCS 14)',
        'MAP 63 mmHg, Capillary refill delayed @ 3.5 seconds; flushed warm peripheries',
        'Foley catheter: cloudy, concentrated urine with purulent sediment; 25 mL over last 2 hrs (<0.5 mL/kg/hr)',
        'Positive bilateral costovertebral angle (CVA) tenderness to gentle palpation',
        'Lactate 3.2 mmol/L, WBC 18.4 x10^9/L on STAT laboratory return'
      ],
      a: [
        'Ineffective Peripheral Tissue Perfusion r/t systemic inflammatory vasodilation and septic shock aeb MAP <65 (88/50) and oliguria',
        'Hyperthermia r/t severe urogenital infection aeb Temp 39.1°C, rigors, and tachycardia',
        'Acute Confusion r/t cerebral hypoperfusion and toxic-metabolic encephalopathy secondary to sepsis'
      ],
      p: [
        'Immediate MET (Medical Emergency Team) / Code Sepsis activation via urgent SBAR',
        'Initiate Sepsis Six pathway within 1 hour: high-flow O2, blood cultures x2, IV broad-spectrum antibiotics, IV fluid resuscitation (30 mL/kg), lactate measurement, hourly urometer',
        'Target MAP ≥65 mmHg and urine output ≥0.5 mL/kg/hr',
        'Establish 2 large-bore peripheral IV lines (18G)',
        'Prepare patient for urgent transfer to High Dependency / Intensive Care Unit'
      ],
      i: [
        'Activated Medical Emergency Team (MET) call; delivered standardized SBAR to Dr. Davis and ICU Registrar',
        'Inserted second 18G peripheral IV cannula in right antecubital fossa',
        'Initiated IV 0.9% Normal Saline 1,000 mL bolus under pressure infuser over 30 min',
        'Drew 2 sets of peripheral blood cultures (aerobic + anaerobic) from separate venipuncture sites and STAT venous lactate',
        'Administered IV Piperacillin-Tazobactam (Zosyn) 4.5 g in 100 mL NS after blood culture collection',
        'Administered IV Paracetamol 1,000 mg for pyrexia (39.1°C)',
        'Applied O2 via simple face mask @ 4 L/min; connected hourly urometer for strict fluid balance'
      ],
      e: [
        '45 min post-intervention: BP improved to 104/64 mmHg (MAP 77 mmHg)',
        'HR decreased from 122 bpm to 96 bpm; RR slowed to 20/min',
        'Temp decreased to 38.0°C; rigors and shivering subsided',
        'Urine output 45 mL over first post-fluid hour; GCS improved to 15 (alert and oriented x3)',
        'MET registrar arrived; handover completed for HDU bed transfer'
      ]
    },
    rubric: [
      {
        id: 's-confusion-rigors',
        section: 'S',
        description: 'Documented rigors, flank pain (7/10), and acute mental status / confusion',
        keywords: ['rigors', 'shivering', 'freezing', 'pain', '7/10', 'flank', 'confused', 'disoriented', 'year'],
        isCritical: true,
        points: 15
      },
      {
        id: 'o-news2-vitals',
        section: 'O',
        description: 'Documented complete vital signs, hypotension (88/50), tachycardia (122), fever (39.1), and NEWS2 = 8',
        keywords: ['88/50', '88', '122', '39.1', '28', 'news2', 'news', '8', 'map', 'oliguria', 'gcs 14', 'lactate'],
        isCritical: true,
        points: 25
      },
      {
        id: 'a-sepsis-perfusion',
        section: 'A',
        description: 'NANDA nursing diagnosis for Sepsis / Ineffective Tissue Perfusion & Hyperthermia',
        keywords: ['sepsis', 'tissue perfusion', 'ineffective tissue perfusion', 'hyperthermia', 'infection', 'shock'],
        isCritical: true,
        points: 20
      },
      {
        id: 'p-sepsis-six-met',
        section: 'P',
        description: 'Planned MET escalation, Sepsis Six protocol (blood cultures, IV fluids, IV antibiotics, lactate, urometer)',
        keywords: ['met', 'emergency', 'sbar', 'sepsis 6', 'sepsis six', 'blood culture', 'antibiotic', 'fluid', 'bolus', 'urometer', 'icu'],
        isCritical: true,
        points: 25
      },
      {
        id: 'i-exact-treatments',
        section: 'I',
        description: 'Documented specific interventions delivered (IV bolus, blood cultures before antibiotics, Piperacillin/Tazobactam, antipyretic, O2)',
        keywords: ['bolus', 'saline', '1000', 'blood culture', 'piperacillin', 'tazobactam', 'zosyn', 'paracetamol', 'met', 'urometer', '18g'],
        isCritical: true,
        points: 25
      },
      {
        id: 'e-resuscitation-response',
        section: 'E',
        description: 'Documented post-resuscitation evaluation (BP 104/64, HR 96, Temp 38.0°C, urine output, GCS 15, HDU transfer)',
        keywords: ['104/64', '104', '96', '38.0', '38', '45 ml', 'urine', 'gcs 15', 'alert', 'hdu', 'improved', 'stabilized'],
        isCritical: true,
        points: 20
      }
    ],
    exemplar: {
      subjective:
        'Patient is shivering vigorously with severe rigors. States: "I am freezing cold and everything is spinning." Unable to state current year (thinks it is 1985). Complains of throbbing 7/10 bilateral flank pain. Denies chest pain or shortness of breath prior to shivering onset.',
      objective:
        'NEWS2 Score = 8 (High Risk Alert).\nVitals: BP 88/50 mmHg (MAP 63 mmHg), HR 122 bpm sinus tachycardia, RR 28/min, SpO2 93% on room air, Temp 39.1°C (tympanic). Neurological: GCS 14 (E4 V4 M6 - disoriented to time). Skin: Flushed, warm trunk, peripheral capillary refill 3.5 seconds. Abdomen: Severe bilateral CVA flank tenderness. Renal: Indwelling urinary catheter drained 25 mL cloudy foul-smelling amber urine with thick sediment over the past 2 hours (<0.35 mL/kg/hr). STAT labs: Serum lactate 3.2 mmol/L, WBC 18.4 x10^9/L.',
      assessment:
        '1. Ineffective Peripheral Tissue Perfusion related to systemic vasodilation and septic shock secondary to acute complicated urosepsis as evidenced by hypotension (BP 88/50), tachycardia (HR 122), oliguria, and elevated serum lactate (3.2 mmol/L).\n2. Hyperthermia related to active systemic bacterial infection as evidenced by Temp 39.1°C and violent rigors.\n3. Acute Confusion related to cerebral hypoperfusion and sepsis-associated encephalopathy as evidenced by GCS 14 (temporal disorientation).',
      plan:
        '1. Trigger immediate Medical Emergency Team (MET) / Sepsis Emergency Call.\n2. Initiate Sepsis Six bundle immediately: obtain 2 sets of blood cultures prior to antibiotic administration, draw STAT venous lactate, administer 30 mL/kg IV crystalloid fluid resuscitation, infuse broad-spectrum IV Piperacillin-Tazobactam within 60 minutes, deliver supplemental oxygen for SpO2 ≥95%, and attach hourly urometer.\n3. Continuous invasive-level non-invasive monitoring (NIBP q15min, continuous pulse oximetry and cardiac telemetry).\n4. Handover to MET registrar Dr. Davis for urgent Intensive Care / HDU bed escalation.',
      intervention:
        '14:05 - Activated Medical Emergency Team (MET) via Code Sepsis emergency button; delivered SBAR handover to MET registrar Dr. Davis.\n14:07 - Placed second large-bore 18G IV cannula in right antecubital fossa.\n14:10 - Connected 1,000 mL 0.9% Normal Saline bolus via pressure infuser over 30 minutes.\n14:12 - Collected 2 sets of peripheral blood cultures (aerobic and anaerobic) from separate aseptic venipunctures; sent STAT venous blood gas for lactate.\n14:15 - Administered IV Piperacillin-Tazobactam 4.5 g in 100 mL NS over 30 min (post blood culture collection).\n14:18 - Administered IV Paracetamol 1 g for fever 39.1°C.\n14:20 - Applied oxygen via simple face mask @ 4 L/min (SpO2 rose to 97%). Attached closed urometer system for hourly urine output tracking.',
      evaluation:
        '14:50 - Reassessment 45 min post-intervention: BP improved to 104/64 mmHg (MAP 77 mmHg). HR decreased from 122 to 96 bpm. RR slowed to 20/min. SpO2 97% on 4 L/min O2. Temp reduced to 38.0°C; rigors ceased. Urine output recorded at 45 mL in first hour. Neurological: GCS 15 (alert and fully oriented to person, place, and time). MET team on bedside; patient accepted and safely transferred to High Dependency Unit (HDU Bed 3).'
    }
  },
  {
    id: 'acute-lvf-pulmonary-edema',
    title: 'Scenario 3: Acute Left Ventricular Failure & Flash Pulmonary Edema',
    subtitle: 'Acute cardiogenic pulmonary edema: Orthopnea, SpO2 84%, pink frothy sputum, bilateral crackles.',
    acuity: 'Critical',
    patient: {
      name: 'Margaret Thorne',
      ageGender: '68y / Female',
      mrn: 'MRN-5921834',
      bed: 'Coronary Care Unit - Bed 04',
      consultant: 'Dr. C. Sterling (Cardiology)',
      admissionDx: 'Acute Decompensated Heart Failure (Ischemic Cardiomyopathy, LVEF 30%)',
      allergies: 'No Known Drug Allergies (NKDA)',
      codeStatus: 'Full Code'
    },
    vitals: {
      bp: '184/105 mmHg',
      hr: '118 bpm (Irregular - AF with RVR)',
      rr: '32/min (Labored, Accessory Muscle Use)',
      spo2: '84% (Room Air)',
      temp: '36.8 °C',
      pain: '4/10 (Chest Tightness / Suffocation)'
    },
    clinicalBrief:
      '68F with severe ischemic cardiomyopathy (LVEF 30%) suddenly developed extreme respiratory distress at 03:00 AM. Patient is sitting bolt upright, unable to speak full sentences ("I feel like I am drowning..."), coughing copious pink frothy sputum. SpO2 is 84% on room air with tachypnea (RR 32). Auscultation demonstrates widespread coarse wet crackles / bubbling crepitations throughout bilateral middle and lower lung zones. Jugular venous pressure (JVP) is elevated +6 cm, and telemetry shows Atrial Fibrillation with Rapid Ventricular Response (118 bpm). Severe systemic hypertension (BP 184/105 mmHg). Emergency IV loop diuretics and high-flow oxygen needed immediately.',
    phraseBank: {
      s: [
        'Gasping: "Can\'t breathe... feel like I\'m drowning in my chest"',
        'Unable to complete 2-word phrases; profound air hunger',
        'Complains of 4/10 heavy chest tightness',
        'Reports sudden onset waking from sleep (paroxysmal nocturnal dyspnea)'
      ],
      o: [
        'Orthopneic, sitting bolt upright at 90° with tripod positioning',
        'SpO2 84% on room air, RR 32/min with intercostal retractions and nasal flaring',
        'BP 184/105 mmHg, HR 118 bpm irregular (Telemetry: Atrial Fibrillation with RVR)',
        'Coughing copious pink frothy serosanguinous sputum',
        'Auscultation: Widespread bilateral coarse wet bubbling crackles/crepitations extending to bilateral mid-zones',
        'JVP elevated at +6 cm above sternal angle; bilateral 2+ pitting pedal edema'
      ],
      a: [
        'Impaired Gas Exchange r/t alveolar-capillary fluid transudation secondary to acute left ventricular failure aeb SpO2 84% and pink frothy sputum',
        'Excess Fluid Volume & Decreased Cardiac Output r/t acute left ventricular decompensation and severe afterload aeb BP 184/105, JVP +6cm, and bilateral pulmonary crackles',
        'Acute Anxiety & Air Hunger r/t life-threatening hypoxemia'
      ],
      p: [
        'Position patient bolt upright (90°) with legs dependent over bed side to reduce venous return',
        'Deliver High-Flow Oxygen via Non-Rebreather Mask @ 15 L/min (target SpO2 ≥95%) or prepare CPAP/NIV',
        'Immediate Cardiology Registrar / Code Blue emergency call via structured SBAR',
        'Administer prescribed emergency IV Loop Diuretics (IV Furosemide 80 mg slow bolus)',
        'Administer Sublingual Nitroglycerin / GTN spray 400 mcg if SBP >100 mmHg to reduce afterload',
        'Insert Foley catheter for strict continuous hourly diuresis measurement; continuous 12-lead ECG monitoring'
      ],
      i: [
        'Positioned patient upright at 90° with legs dangling over edge of bed',
        'Applied High-Flow O2 @ 15 L/min via Non-Rebreather mask with reservoir bag fully primed',
        'Delivered emergency SBAR to On-call Cardiology Registrar Dr. Sterling; code team alerted',
        'Administered IV Furosemide (Lasix) 80 mg slow intravenous push over 5 minutes via dedicated IV line',
        'Administered Sublingual Glyceryl Trinitrate (GTN) 400 mcg spray x2 doses 5 min apart',
        'Inserted indwelling Foley catheter to gravity bag; attached continuous NIBP cycling every 5 minutes',
        'Prepped CPAP circuit at 8 cmH2O PEEP / FiO2 60% on standby'
      ],
      e: [
        '30 min post-IV Furosemide: Rapid diuresis of 650 mL clear yellow urine documented',
        'SpO2 increased dramatically from 84% to 95% on 15 L/min Non-Rebreather mask',
        'RR slowed from 32/min to 22/min; accessory muscle use ceased',
        'BP decreased from 184/105 to 142/86 mmHg (MAP 105 mmHg); HR slowed to 88 bpm',
        'Pink frothy sputum resolved; lung bases demonstrate significantly reduced crackles',
        'Patient speaks in full sentences and states: "The drowning feeling is gone, I can breathe now."'
      ]
    },
    rubric: [
      {
        id: 's-air-hunger-sputum',
        section: 'S',
        description: 'Documented severe air hunger quote, pink frothy sputum, orthopnea, and chest tightness',
        keywords: ['drowning', 'breathe', 'breath', 'pink', 'frothy', 'sputum', 'tightness', '4/10', 'air hunger', 'orthopnea'],
        isCritical: true,
        points: 15
      },
      {
        id: 'o-vitals-crepitations',
        section: 'O',
        description: 'Documented initial vitals (SpO2 84%, BP 184/105, HR 118 AF, RR 32) and widespread bilateral crackles/JVP',
        keywords: ['84%', '84', '184/105', '184', '118', '32', 'crackles', 'crepitations', 'jvp', 'edema', 'af', 'afib'],
        isCritical: true,
        points: 25
      },
      {
        id: 'a-nanda-lvf-gas-exchange',
        section: 'A',
        description: 'NANDA nursing diagnosis for Impaired Gas Exchange / Decreased Cardiac Output / Excess Fluid Volume',
        keywords: ['gas exchange', 'fluid volume', 'cardiac output', 'pulmonary edema', 'heart failure', 'lvf'],
        isCritical: true,
        points: 20
      },
      {
        id: 'p-position-nrb-diuretics',
        section: 'P',
        description: 'Planned 90° upright positioning, 15L Non-Rebreather O2/CPAP, SBAR escalation, IV Furosemide, and GTN afterload reduction',
        keywords: ['upright', '90', 'non-rebreather', 'nrb', '15 l/min', '15l', 'cpap', 'furosemide', 'lasix', 'gtn', 'nitroglycerin', 'sbar'],
        isCritical: true,
        points: 25
      },
      {
        id: 'i-executed-therapies',
        section: 'I',
        description: 'Documented execution of upright positioning, 15L NRB O2, IV Furosemide 80mg slow IVP, GTN spray, Foley catheter',
        keywords: ['upright', '90', 'non-rebreather', '15', 'furosemide', '80', 'gtn', 'nitroglycerin', 'foley', 'catheter', 'sbar'],
        isCritical: true,
        points: 25
      },
      {
        id: 'e-diuresis-resolution',
        section: 'E',
        description: 'Documented evaluation: Diuresis volume (650 mL), SpO2 improvement (95%), RR reduction (22), BP reduction (142/86)',
        keywords: ['650', 'urine', 'diuresis', '95%', '95', '22', '142/86', '142', 'frothy', 'resolved', 'improved', 'breathe'],
        isCritical: true,
        points: 20
      }
    ],
    exemplar: {
      subjective:
        'Patient is in acute respiratory distress, gasping: "I can\'t... breathe... feel like I\'m drowning inside." Unable to speak full sentences. Complains of heavy 4/10 retrosternal tightness and sudden waking with suffocating sensation (PND). Coughing frequent mouthfuls of pink, frothy, serosanguinous sputum.',
      objective:
        'Patient sitting bolt upright at 90° in tripod position. Severe diaphoresis and peripheral cyanosis.\nVitals: BP 184/105 mmHg, HR 118 bpm irregularly irregular (Telemetry: Atrial Fibrillation with Rapid Ventricular Response), RR 32/min (labored with sternocleidomastoid accessory muscle use and marked intercostal retractions), SpO2 84% on Room Air, Temp 36.8°C.\nRespiratory exam: Diffuse bilateral coarse bubbling inspiratory and expiratory crepitations / wet crackles extending bilaterally from bases up to the mid-thoracic zones.\nCardiovascular: JVP elevated +6 cm with positive hepatojugular reflux. Bilateral 2+ pitting pedal edema extending to mid-shins.',
      assessment:
        '1. Impaired Gas Exchange related to alveolar-capillary membrane fluid flooding secondary to acute left ventricular decompensation and flash cardiogenic pulmonary edema as evidenced by SpO2 84% on room air, RR 32/min, coughing pink frothy sputum, and extensive bilateral crackles.\n2. Excess Fluid Volume & Decreased Cardiac Output related to acute heart failure and excessive systemic vascular resistance as evidenced by severe hypertension (BP 184/105), JVP +6 cm, and peripheral edema.\n3. Acute Air Hunger & Anxiety related to severe life-threatening hypoxemia.',
      plan:
        '1. Maintain patient in rigid upright 90° High-Fowler position with dependent lower limbs to decrease preload.\n2. Deliver High-Flow Oxygen via Non-Rebreather Mask at 15 L/min (target SpO2 ≥95%) and place CPAP circuit on immediate standby.\n3. Contact on-call Cardiologist Dr. Sterling via emergency SBAR call.\n4. Administer emergency IV Furosemide 80 mg slow bolus and Sublingual GTN spray 400 mcg to unload pulmonary vasculature.\n5. Place indwelling urinary catheter to monitor hourly diuresis.\n6. Continuous 5-minute NIBP cycling and continuous telemetry.',
      intervention:
        '03:05 - Positioned patient bolt upright at 90° with dependent lower extremities.\n03:07 - Applied High-Flow O2 @ 15 L/min via Non-Rebreather mask (reservoir bag fully pre-inflated).\n03:09 - Contacted Dr. Sterling (Cardiology) via emergency SBAR; treatment orders verified.\n03:12 - Administered IV Furosemide (Lasix) 80 mg slow IV push over 5 minutes via 18G cannula.\n03:14 - Administered Sublingual Glyceryl Trinitrate (GTN) 400 mcg (1 spray) sublingually; repeated second spray at 03:19 after verifying SBP >140 mmHg.\n03:22 - Inserted 14Fr Foley catheter under aseptic technique; attached closed drainage bag.\n03:25 - Connected continuous cardiac monitor and 5-minute automatic NIBP cycling.',
      evaluation:
        '03:50 - Reassessment 35 minutes post-intervention:\n• Massive diuresis of 650 mL clear yellow urine drained in Foley catheter within 35 minutes.\n• SpO2 elevated from 84% to 95% on 15 L/min Non-Rebreather mask.\n• RR reduced from 32/min to 22/min; accessory muscle usage and tachypnea resolved.\n• BP decreased from 184/105 to 142/86 mmHg (MAP 105 mmHg); HR slowed to 88 bpm.\n• Coughing and production of pink frothy sputum completely resolved; auscultation reveals markedly reduced crackles confined to basal rim.\n• Patient is relaxed, speaking in complete sentences, and states: "The drowning feeling is gone. Thank you, I can breathe now."'
    }
  }
];

export default function SOAPIENotesSimulator() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('lap-chole-atelectasis');
  const [mode, setMode] = useState<'practice' | 'exam'>('practice');
  const [showExemplar, setShowExemplar] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // User input state
  const [notes, setNotes] = useState<Record<string, SOAPIEEntry>>({
    'lap-chole-atelectasis': { subjective: '', objective: '', assessment: '', plan: '', intervention: '', evaluation: '' },
    'sepsis-escalation': { subjective: '', objective: '', assessment: '', plan: '', intervention: '', evaluation: '' },
    'acute-lvf-pulmonary-edema': { subjective: '', objective: '', assessment: '', plan: '', intervention: '', evaluation: '' }
  });

  const currentScenario = useMemo(() => {
    return SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];
  }, [selectedScenarioId]);

  const currentNote = notes[selectedScenarioId] || {
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    intervention: '',
    evaluation: ''
  };

  const handleInputChange = (field: keyof SOAPIEEntry, value: string) => {
    setNotes((prev) => ({
      ...prev,
      [selectedScenarioId]: {
        ...prev[selectedScenarioId],
        [field]: value
      }
    }));
  };

  const handleQuickInsert = (field: keyof SOAPIEEntry, text: string) => {
    const existing = currentNote[field];
    const updated = existing ? `${existing}\n• ${text}` : `• ${text}`;
    handleInputChange(field, updated);
  };

  const handleApplyTemplate = () => {
    setNotes((prev) => ({
      ...prev,
      [selectedScenarioId]: {
        subjective: `Patient states: "..."\nPain scale (0-10): /10\nAssociated symptoms: `,
        objective: `Vital Signs: BP: mmHg, HR: bpm, RR: /min, SpO2: %, Temp: °C\nPhysical Findings: \nWounds / Lines: `,
        assessment: `1. [NANDA Nursing Diagnosis] related to ... as evidenced by ...\n2. Clinical acuity: `,
        plan: `1. Positioning & Airway/Breathing: \n2. Escalation via SBAR to: \n3. Specific diagnostic & therapeutic goals: \n4. Monitoring intervals: `,
        intervention: `• Time [HH:MM]: Administered/Performed ...\n• Positioned patient to ...\n• Checked IV line patency\n• Escalated to physician via SBAR`,
        evaluation: `• Post-intervention vitals: BP: , HR: , RR: , SpO2: \n• Pain reassessment: reduced to /10\n• Patient subjective feedback: "..."\n• Transfer/Handover status: `
      }
    }));
  };

  const handleReset = () => {
    setNotes((prev) => ({
      ...prev,
      [selectedScenarioId]: {
        subjective: '',
        objective: '',
        assessment: '',
        plan: '',
        intervention: '',
        evaluation: ''
      }
    }));
    setShowExemplar(false);
  };

  const handleLoadExemplar = () => {
    setNotes((prev) => ({
      ...prev,
      [selectedScenarioId]: { ...currentScenario.exemplar }
    }));
  };

  // Automated Real-time Scoring Engine
  const evaluationResult = useMemo(() => {
    const textMap = {
      S: currentNote.subjective.toLowerCase(),
      O: currentNote.objective.toLowerCase(),
      A: currentNote.assessment.toLowerCase(),
      P: currentNote.plan.toLowerCase(),
      I: currentNote.intervention.toLowerCase(),
      E: currentNote.evaluation.toLowerCase()
    };

    let totalEarnedPoints = 0;
    let totalPossiblePoints = 0;

    const sectionScores: Record<'S' | 'O' | 'A' | 'P' | 'I' | 'E', { earned: number; total: number; percent: number }> = {
      S: { earned: 0, total: 0, percent: 0 },
      O: { earned: 0, total: 0, percent: 0 },
      A: { earned: 0, total: 0, percent: 0 },
      P: { earned: 0, total: 0, percent: 0 },
      I: { earned: 0, total: 0, percent: 0 },
      E: { earned: 0, total: 0, percent: 0 }
    };

    const criteriaEvaluation: Array<{
      criterion: RubricCriterion;
      passed: boolean;
      matchedKeywords: string[];
    }> = [];

    const criticalOmissions: string[] = [];

    currentScenario.rubric.forEach((crit) => {
      const sectionText = textMap[crit.section];
      totalPossiblePoints += crit.points;
      sectionScores[crit.section].total += crit.points;

      // Check for matched keywords
      const matched = crit.keywords.filter((kw) => sectionText.includes(kw.toLowerCase()));
      const isPassed = matched.length >= Math.min(2, crit.keywords.length);

      if (isPassed) {
        totalEarnedPoints += crit.points;
        sectionScores[crit.section].earned += crit.points;
      } else {
        if (crit.isCritical && sectionText.length > 5) {
          criticalOmissions.push(`[${crit.section}] Missing critical documentation: ${crit.description}`);
        }
      }

      criteriaEvaluation.push({
        criterion: crit,
        passed: isPassed,
        matchedKeywords: matched
      });
    });

    // Calculate percentages
    Object.keys(sectionScores).forEach((secKey) => {
      const sec = secKey as 'S' | 'O' | 'A' | 'P' | 'I' | 'E';
      if (sectionScores[sec].total > 0) {
        sectionScores[sec].percent = Math.round((sectionScores[sec].earned / sectionScores[sec].total) * 100);
      }
    });

    const overallPercent = totalPossiblePoints > 0 ? Math.round((totalEarnedPoints / totalPossiblePoints) * 100) : 0;

    let letterGrade = 'Needs Work';
    let gradeFeedback = 'Documentation is incomplete. Ensure all clinical parameters, NANDA diagnoses, and re-evaluations are recorded.';
    if (overallPercent >= 90) {
      letterGrade = 'Grade: A+ (Exemplary)';
      gradeFeedback = 'Flawless clinical documentation adhering to Indian Nursing Council (INC) & international EHR standards.';
    } else if (overallPercent >= 75) {
      letterGrade = 'Grade: A (Proficient)';
      gradeFeedback = 'Strong nursing chart note with comprehensive clinical assessment and safety monitoring.';
    } else if (overallPercent >= 55) {
      letterGrade = 'Grade: B (Competent)';
      gradeFeedback = 'Acceptable documentation, but several key objective findings or post-intervention evaluations are missing.';
    } else if (overallPercent >= 30) {
      letterGrade = 'Grade: C (Marginal)';
      gradeFeedback = 'Significant gaps in clinical rationale, SBAR communication, or post-intervention vitals.';
    }

    return {
      overallPercent,
      letterGrade,
      gradeFeedback,
      sectionScores,
      criteriaEvaluation,
      criticalOmissions
    };
  }, [currentNote, currentScenario]);

  const handleCopyNote = () => {
    const formatted = `=== HOSPITAL ELECTRONIC HEALTH RECORD (EHR) NURSING NOTE ===
PATIENT: ${currentScenario.patient.name} | ${currentScenario.patient.ageGender} | MRN: ${currentScenario.patient.mrn}
BED: ${currentScenario.patient.bed} | CONSULTANT: ${currentScenario.patient.consultant}
ADMISSION DX: ${currentScenario.patient.admissionDx}
ALLERGIES: ${currentScenario.patient.allergies} | CODE STATUS: ${currentScenario.patient.codeStatus}
TIMESTAMP: ${new Date().toLocaleDateString('en-GB')} 08:30 IST

[S] SUBJECTIVE:
${currentNote.subjective || '(No entry recorded)'}

[O] OBJECTIVE:
${currentNote.objective || '(No entry recorded)'}

[A] ASSESSMENT:
${currentNote.assessment || '(No entry recorded)'}

[P] PLAN:
${currentNote.plan || '(No entry recorded)'}

[I] INTERVENTIONS:
${currentNote.intervention || '(No entry recorded)'}

[E] EVALUATION:
${currentNote.evaluation || '(No entry recorded)'}

AUTHENTICATED BY: Staff Nurse, RN, B.Sc Nursing (Registered Nurse License: RN-MH-90214)
EHR NOTE ID: SOAPIE-${Date.now().toString(36).toUpperCase()}`;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.badgeRow}>
            <span className={styles.nursingBadge}>
              <Stethoscope size={13} />
              Clinical Nursing Station
            </span>
            <span className={styles.incBadge}>INC Competency: Professional Documentation</span>
          </div>
          <h2 className={styles.title}>
            SOAPIE <span className={styles.titleHighlight}>Nursing Documentation</span> Simulator
          </h2>
          <p className={styles.subtitle}>
            Master accredited clinical progress notes (Subjective, Objective, Assessment, Plan, Interventions, Evaluation) with real-time scoring rubrics and critical omission detection.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className={styles.modeToggleGroup}>
          <button
            className={`${styles.modeBtn} ${mode === 'practice' ? styles.modeBtnActive : ''}`}
            onClick={() => setMode('practice')}
          >
            <BookOpen size={15} />
            Guided Practice
          </button>
          <button
            className={`${styles.modeBtn} ${mode === 'exam' ? styles.modeBtnActive : ''}`}
            onClick={() => setMode('exam')}
          >
            <Award size={15} />
            Exam / Timed Mode
          </button>
        </div>
      </header>

      {/* Scenario Selector */}
      <div className={styles.scenarioSelector}>
        {SCENARIOS.map((scen, idx) => {
          const isActive = scen.id === selectedScenarioId;
          const acuityClass =
            scen.acuity === 'Critical'
              ? styles.acuityCritical
              : scen.acuity === 'High'
              ? styles.acuityHigh
              : styles.acuityMod;

          return (
            <button
              key={scen.id}
              className={`${styles.scenarioCard} ${isActive ? styles.scenarioCardActive : ''}`}
              onClick={() => setSelectedScenarioId(scen.id)}
            >
              <div className={styles.scenarioHeader}>
                <span className={styles.scenarioNumber}>Shift Scenario {idx + 1}</span>
                <span className={`${styles.scenarioAcuity} ${acuityClass}`}>{scen.acuity} Acuity</span>
              </div>
              <h4 className={styles.scenarioTitle}>{scen.title.split(':')[1] || scen.title}</h4>
              <p className={styles.scenarioBrief}>{scen.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* Patient EHR Banner */}
      <div className={styles.ehrBanner}>
        <div className={styles.ehrHeader}>
          <div className={styles.ehrPatientMain}>
            <span className={styles.patientName}>{currentScenario.patient.name}</span>
            <span className={styles.patientDemographics}>{currentScenario.patient.ageGender}</span>
            <span className={styles.patientDemographics}>{currentScenario.patient.bed}</span>
            <span className={styles.tagMrn}>{currentScenario.patient.mrn}</span>
          </div>

          <div className={styles.ehrTags}>
            <span className={styles.tagAllergies}>Allergies: {currentScenario.patient.allergies}</span>
            <span className={styles.tagCodeStatus}>Code: {currentScenario.patient.codeStatus}</span>
          </div>
        </div>

        {/* Live Vitals Snapshot */}
        <div className={styles.ehrVitalsGrid}>
          <div className={styles.vitalCard}>
            <span className={styles.vitalLabel}>
              <Heart size={13} color="#f43f5e" /> Blood Pressure
            </span>
            <span className={`${styles.vitalValue} ${currentScenario.vitals.bp.includes('88') ? styles.vitalCritical : ''}`}>
              {currentScenario.vitals.bp}
            </span>
            <span className={styles.vitalSub}>NIBP Left Arm</span>
          </div>

          <div className={styles.vitalCard}>
            <span className={styles.vitalLabel}>
              <Activity size={13} color="#38bdf8" /> Heart Rate
            </span>
            <span className={`${styles.vitalValue} ${currentScenario.vitals.hr.includes('122') || currentScenario.vitals.hr.includes('118') ? styles.vitalAbnormal : ''}`}>
              {currentScenario.vitals.hr}
            </span>
            <span className={styles.vitalSub}>Continuous Telemetry</span>
          </div>

          <div className={styles.vitalCard}>
            <span className={styles.vitalLabel}>
              <Activity size={13} color="#a855f7" /> Respiratory Rate
            </span>
            <span className={`${styles.vitalValue} ${parseInt(currentScenario.vitals.rr) >= 24 ? styles.vitalAbnormal : ''}`}>
              {currentScenario.vitals.rr}
            </span>
            <span className={styles.vitalSub}>Thoracic excursion</span>
          </div>

          <div className={styles.vitalCard}>
            <span className={styles.vitalLabel}>
              <Activity size={13} color="#06b6d4" /> Oxygen Saturation
            </span>
            <span className={`${styles.vitalValue} ${parseInt(currentScenario.vitals.spo2) < 92 ? styles.vitalCritical : styles.vitalAbnormal}`}>
              {currentScenario.vitals.spo2}
            </span>
            <span className={styles.vitalSub}>Pulse Oximetry</span>
          </div>

          <div className={styles.vitalCard}>
            <span className={styles.vitalLabel}>
              <Thermometer size={13} color="#f59e0b" /> Temperature
            </span>
            <span className={`${styles.vitalValue} ${parseFloat(currentScenario.vitals.temp) >= 38.5 ? styles.vitalAbnormal : ''}`}>
              {currentScenario.vitals.temp}
            </span>
            <span className={styles.vitalSub}>Tympanic</span>
          </div>

          <div className={styles.vitalCard}>
            <span className={styles.vitalLabel}>
              <Flame size={13} color="#ef4444" /> Pain Score
            </span>
            <span className={styles.vitalValue}>{currentScenario.vitals.pain}</span>
            <span className={styles.vitalSub}>NRS Scale (0-10)</span>
          </div>
        </div>

        {/* Clinical Handover Summary */}
        <div className={styles.briefingBox}>
          <strong>Shift Handover Briefing:</strong> {currentScenario.clinicalBrief}
        </div>
      </div>

      {/* Main Workbench Layout */}
      <div className={styles.workbenchLayout}>
        {/* Left Column: SOAPIE Editor */}
        <div className={styles.editorCard}>
          <div className={styles.editorHeader}>
            <h3 className={styles.editorTitle}>
              <FileText size={18} color="#38bdf8" />
              Clinical SOAPIE Chart Note
            </h3>

            <div className={styles.editorActionBtns}>
              {mode === 'practice' && (
                <>
                  <button className={styles.templateBtn} onClick={handleApplyTemplate} title="Insert structured SOAPIE headers">
                    <Sparkles size={14} />
                    Insert Template
                  </button>
                  <button className={styles.secondaryBtn} onClick={handleLoadExemplar} title="Fill with Gold Standard exemplar for review">
                    <Eye size={14} />
                    Load Model Note
                  </button>
                </>
              )}
              <button className={styles.secondaryBtn} onClick={handleReset} title="Clear all text fields">
                <RotateCcw size={14} />
                Clear
              </button>
              <button className={styles.secondaryBtn} onClick={handleCopyNote} title="Copy formatted EHR note to clipboard">
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                {copied ? 'Copied EHR Note!' : 'Copy Note'}
              </button>
            </div>
          </div>

          {/* SOAPIE Sections */}
          <div className={styles.sectionGroup}>
            {/* Subjective (S) */}
            <div className={styles.soapieSection}>
              <div className={styles.sectionHeaderRow}>
                <div className={styles.sectionLabelBadge}>
                  <span className={`${styles.letterBadge} ${styles.badgeS}`}>S</span>
                  <span className={styles.sectionName}>Subjective (Patient Voice & Symptoms)</span>
                </div>
                <span
                  className={`${styles.sectionScoreBadge} ${
                    evaluationResult.sectionScores.S.percent >= 80
                      ? styles.scoreFull
                      : evaluationResult.sectionScores.S.percent > 0
                      ? styles.scorePartial
                      : styles.scoreEmpty
                  }`}
                >
                  Score: {evaluationResult.sectionScores.S.percent}%
                </span>
              </div>
              {mode === 'practice' && (
                <p className={styles.sectionHint}>
                  Record patient direct quotes, pain scale (0-10), onset, location, and symptoms in the patient&apos;s own words.
                </p>
              )}
              <textarea
                className={styles.sectionTextarea}
                placeholder='e.g., Patient states: "It hurts when I breathe in, feels like a 6/10 sharp pain..."'
                value={currentNote.subjective}
                onChange={(e) => handleInputChange('subjective', e.target.value)}
                rows={3}
              />
              {mode === 'practice' && (
                <div className={styles.phraseBank}>
                  {currentScenario.phraseBank.s.map((phrase, i) => (
                    <button key={i} className={styles.phraseChip} onClick={() => handleQuickInsert('subjective', phrase)}>
                      + {phrase}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Objective (O) */}
            <div className={styles.soapieSection}>
              <div className={styles.sectionHeaderRow}>
                <div className={styles.sectionLabelBadge}>
                  <span className={`${styles.letterBadge} ${styles.badgeO}`}>O</span>
                  <span className={styles.sectionName}>Objective (Vitals, Physical Exam & Telemetry)</span>
                </div>
                <span
                  className={`${styles.sectionScoreBadge} ${
                    evaluationResult.sectionScores.O.percent >= 80
                      ? styles.scoreFull
                      : evaluationResult.sectionScores.O.percent > 0
                      ? styles.scorePartial
                      : styles.scoreEmpty
                  }`}
                >
                  Score: {evaluationResult.sectionScores.O.percent}%
                </span>
              </div>
              {mode === 'practice' && (
                <p className={styles.sectionHint}>
                  Include full vital signs (BP, HR, RR, SpO2 with O2 device, Temp), physical inspection, auscultation, telemetry, and line checks.
                </p>
              )}
              <textarea
                className={styles.sectionTextarea}
                placeholder="e.g., Vitals: BP 132/84, HR 98, RR 26 shallow, SpO2 89% on Room Air, Temp 37.8°C. Fine basal crackles auscultated bilaterally..."
                value={currentNote.objective}
                onChange={(e) => handleInputChange('objective', e.target.value)}
                rows={4}
              />
              {mode === 'practice' && (
                <div className={styles.phraseBank}>
                  {currentScenario.phraseBank.o.map((phrase, i) => (
                    <button key={i} className={styles.phraseChip} onClick={() => handleQuickInsert('objective', phrase)}>
                      + {phrase}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Assessment (A) */}
            <div className={styles.soapieSection}>
              <div className={styles.sectionHeaderRow}>
                <div className={styles.sectionLabelBadge}>
                  <span className={`${styles.letterBadge} ${styles.badgeA}`}>A</span>
                  <span className={styles.sectionName}>Assessment (NANDA Nursing Diagnosis & Interpretation)</span>
                </div>
                <span
                  className={`${styles.sectionScoreBadge} ${
                    evaluationResult.sectionScores.A.percent >= 80
                      ? styles.scoreFull
                      : evaluationResult.sectionScores.A.percent > 0
                      ? styles.scorePartial
                      : styles.scoreEmpty
                  }`}
                >
                  Score: {evaluationResult.sectionScores.A.percent}%
                </span>
              </div>
              {mode === 'practice' && (
                <p className={styles.sectionHint}>
                  Format NANDA diagnosis: [Nursing Diagnosis] related to [Etiology] as evidenced by [Signs & Symptoms]. Include NEWS2/acuity interpretation.
                </p>
              )}
              <textarea
                className={styles.sectionTextarea}
                placeholder="e.g., Impaired Gas Exchange related to alveolar hypoventilation as evidenced by SpO2 89% and basal crackles. Acute Pain related to surgical incision..."
                value={currentNote.assessment}
                onChange={(e) => handleInputChange('assessment', e.target.value)}
                rows={3}
              />
              {mode === 'practice' && (
                <div className={styles.phraseBank}>
                  {currentScenario.phraseBank.a.map((phrase, i) => (
                    <button key={i} className={styles.phraseChip} onClick={() => handleQuickInsert('assessment', phrase)}>
                      + {phrase}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Plan (P) */}
            <div className={styles.soapieSection}>
              <div className={styles.sectionHeaderRow}>
                <div className={styles.sectionLabelBadge}>
                  <span className={`${styles.letterBadge} ${styles.badgeP}`}>P</span>
                  <span className={styles.sectionName}>Plan (Immediate Nursing Goals & SBAR Escalation)</span>
                </div>
                <span
                  className={`${styles.sectionScoreBadge} ${
                    evaluationResult.sectionScores.P.percent >= 80
                      ? styles.scoreFull
                      : evaluationResult.sectionScores.P.percent > 0
                      ? styles.scorePartial
                      : styles.scoreEmpty
                  }`}
                >
                  Score: {evaluationResult.sectionScores.P.percent}%
                </span>
              </div>
              {mode === 'practice' && (
                <p className={styles.sectionHint}>
                  State immediate goals (target SpO2 &gt;94%), positioning, clinician SBAR handover plan, and safety monitoring intervals.
                </p>
              )}
              <textarea
                className={styles.sectionTextarea}
                placeholder="e.g., 1. Elevate head of bed to High-Fowler (75°). 2. Initiate 2 L/min O2 via nasal cannula. 3. SBAR call to Dr. Mehta..."
                value={currentNote.plan}
                onChange={(e) => handleInputChange('plan', e.target.value)}
                rows={3}
              />
              {mode === 'practice' && (
                <div className={styles.phraseBank}>
                  {currentScenario.phraseBank.p.map((phrase, i) => (
                    <button key={i} className={styles.phraseChip} onClick={() => handleQuickInsert('plan', phrase)}>
                      + {phrase}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Interventions (I) */}
            <div className={styles.soapieSection}>
              <div className={styles.sectionHeaderRow}>
                <div className={styles.sectionLabelBadge}>
                  <span className={`${styles.letterBadge} ${styles.badgeI}`}>I</span>
                  <span className={styles.sectionName}>Interventions (Delivered Nursing Actions & Meds)</span>
                </div>
                <span
                  className={`${styles.sectionScoreBadge} ${
                    evaluationResult.sectionScores.I.percent >= 80
                      ? styles.scoreFull
                      : evaluationResult.sectionScores.I.percent > 0
                      ? styles.scorePartial
                      : styles.scoreEmpty
                  }`}
                >
                  Score: {evaluationResult.sectionScores.I.percent}%
                </span>
              </div>
              {mode === 'practice' && (
                <p className={styles.sectionHint}>
                  Detail exact treatments executed: medication doses, route, rate, oxygen device/flow, positioning, line checks, and SBAR communication completed.
                </p>
              )}
              <textarea
                className={styles.sectionTextarea}
                placeholder="e.g., 08:15 - Repositioned to High-Fowler. 08:17 - Applied 2 L/min O2 via NC. 08:20 - Guided incentive spirometry x10 breaths with pillow splinting..."
                value={currentNote.intervention}
                onChange={(e) => handleInputChange('intervention', e.target.value)}
                rows={3}
              />
              {mode === 'practice' && (
                <div className={styles.phraseBank}>
                  {currentScenario.phraseBank.i.map((phrase, i) => (
                    <button key={i} className={styles.phraseChip} onClick={() => handleQuickInsert('intervention', phrase)}>
                      + {phrase}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Evaluation (E) */}
            <div className={styles.soapieSection}>
              <div className={styles.sectionHeaderRow}>
                <div className={styles.sectionLabelBadge}>
                  <span className={`${styles.letterBadge} ${styles.badgeE}`}>E</span>
                  <span className={styles.sectionName}>Evaluation (Post-Intervention Patient Response)</span>
                </div>
                <span
                  className={`${styles.sectionScoreBadge} ${
                    evaluationResult.sectionScores.E.percent >= 80
                      ? styles.scoreFull
                      : evaluationResult.sectionScores.E.percent > 0
                      ? styles.scorePartial
                      : styles.scoreEmpty
                  }`}
                >
                  Score: {evaluationResult.sectionScores.E.percent}%
                </span>
              </div>
              {mode === 'practice' && (
                <p className={styles.sectionHint}>
                  Document post-intervention re-evaluation metrics (e.g. SpO2 improved to 96%, RR 18, pain reduced from 6/10 to 3/10, patient response quote).
                </p>
              )}
              <textarea
                className={styles.sectionTextarea}
                placeholder='e.g., 08:45 - SpO2 increased to 96% on 2 L/min NC. RR slowed to 18/min. Pain reduced to 3/10 with splinting. Patient states: "Breathing feels easier..."'
                value={currentNote.evaluation}
                onChange={(e) => handleInputChange('evaluation', e.target.value)}
                rows={3}
              />
              {mode === 'practice' && (
                <div className={styles.phraseBank}>
                  {currentScenario.phraseBank.e.map((phrase, i) => (
                    <button key={i} className={styles.phraseChip} onClick={() => handleQuickInsert('evaluation', phrase)}>
                      + {phrase}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Scorecard & Rubric Analysis */}
        <div className={styles.analyticsCol}>
          {/* Total Score Dial */}
          <div className={styles.scoreCard}>
            <div className={styles.scoreHeader}>
              <h3>Documentation Competency Score</h3>
              <span className={styles.incBadge}>INC Rubric Evaluator</span>
            </div>

            <div className={styles.totalScoreDial}>
              <div
                className={`${styles.scoreCircle} ${
                  evaluationResult.overallPercent >= 80
                    ? styles.scoreCircleHigh
                    : evaluationResult.overallPercent >= 50
                    ? styles.scoreCircleMed
                    : styles.scoreCircleLow
                }`}
              >
                <span className={styles.scoreValue}>{evaluationResult.overallPercent}%</span>
                <span className={styles.scoreTotalLabel}>Rubric</span>
              </div>

              <div className={styles.gradeDetails}>
                <span className={styles.gradeText}>{evaluationResult.letterGrade}</span>
                <span className={styles.gradeFeedback}>{evaluationResult.gradeFeedback}</span>
              </div>
            </div>

            {/* Section Breakdown Bars */}
            <div className={styles.sectionScoresList}>
              {(['S', 'O', 'A', 'P', 'I', 'E'] as const).map((secKey) => {
                const sec = evaluationResult.sectionScores[secKey];
                const labelMap = {
                  S: 'Subjective (S)',
                  O: 'Objective (O)',
                  A: 'Assessment (A)',
                  P: 'Plan (P)',
                  I: 'Intervention (I)',
                  E: 'Evaluation (E)'
                };
                const fillClass =
                  sec.percent >= 80
                    ? styles.progressFull
                    : sec.percent >= 40
                    ? styles.progressPartial
                    : styles.progressEmpty;

                return (
                  <div key={secKey} className={styles.scoreRow}>
                    <div className={styles.scoreRowHeader}>
                      <span className={styles.scoreRowName}>{labelMap[secKey]}</span>
                      <span className={styles.scoreRowPercent}>{sec.percent}%</span>
                    </div>
                    <div className={styles.progressBarBg}>
                      <div className={`${styles.progressBarFill} ${fillClass}`} style={{ width: `${sec.percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Critical Omissions Alert Card */}
          {evaluationResult.criticalOmissions.length > 0 && (
            <div className={styles.omissionsCard}>
              <h4 className={styles.omissionsTitle}>
                <AlertTriangle size={16} />
                Critical Clinical Omissions Detected ({evaluationResult.criticalOmissions.length})
              </h4>
              <ul className={styles.omissionsList}>
                {evaluationResult.criticalOmissions.map((omission, i) => (
                  <li key={i}>{omission}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Rubric Criteria Checklist */}
          <div className={styles.rubricCard}>
            <h4 className={styles.rubricTitle}>
              <ShieldAlert size={16} color="#38bdf8" />
              Standard Clinical Documentation Rubric
            </h4>

            <div className={styles.rubricList}>
              {evaluationResult.criteriaEvaluation.map(({ criterion, passed }, idx) => (
                <div key={idx} className={styles.rubricItem}>
                  {passed ? (
                    <CheckCircle2 size={16} className={styles.rubricIconPassed} />
                  ) : (
                    <XCircle size={16} className={styles.rubricIconFailed} />
                  )}
                  <div className={styles.rubricText}>
                    <span className={styles.rubricSectionTag}>[{criterion.section}]</span>
                    {criterion.description}
                    {criterion.isCritical && (
                      <span style={{ color: '#f87171', fontWeight: 600, marginLeft: '6px' }}>(Critical)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exemplar Toggle Button */}
          <button
            className={styles.secondaryBtn}
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            onClick={() => setShowExemplar(!showExemplar)}
          >
            <BookOpen size={16} />
            {showExemplar ? 'Hide Gold Standard Exemplar Note' : 'View Gold Standard Exemplar Note'}
          </button>
        </div>
      </div>

      {/* Model Exemplar Drawer / Card */}
      {showExemplar && (
        <div className={styles.exemplarCard}>
          <div className={styles.exemplarHeader}>
            <h3 className={styles.exemplarTitle}>
              <Sparkles size={18} />
              Gold Standard Exemplar Note — {currentScenario.title}
            </h3>
            <span className={styles.incBadge}>EHR Accredited Model Note</span>
          </div>

          <div className={styles.exemplarContent}>
            <div className={styles.exemplarBlock}>
              <strong>[S] Subjective:</strong>
              {currentScenario.exemplar.subjective}
            </div>

            <div className={styles.exemplarBlock}>
              <strong>[O] Objective:</strong>
              <div style={{ whiteSpace: 'pre-line' }}>{currentScenario.exemplar.objective}</div>
            </div>

            <div className={styles.exemplarBlock}>
              <strong>[A] Assessment:</strong>
              <div style={{ whiteSpace: 'pre-line' }}>{currentScenario.exemplar.assessment}</div>
            </div>

            <div className={styles.exemplarBlock}>
              <strong>[P] Plan:</strong>
              <div style={{ whiteSpace: 'pre-line' }}>{currentScenario.exemplar.plan}</div>
            </div>

            <div className={styles.exemplarBlock}>
              <strong>[I] Interventions:</strong>
              <div style={{ whiteSpace: 'pre-line' }}>{currentScenario.exemplar.intervention}</div>
            </div>

            <div className={styles.exemplarBlock}>
              <strong>[E] Evaluation:</strong>
              <div style={{ whiteSpace: 'pre-line' }}>{currentScenario.exemplar.evaluation}</div>
            </div>
          </div>

          <div className={styles.signatureBlock}>
            <span>
              <strong>Documented By:</strong> Staff Nurse, RN, B.Sc Nursing | Registration: RN-MH-90214
            </span>
            <span>
              <strong>Timestamp:</strong> Verified Bedside Entry (Electronic Signature Attached)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
