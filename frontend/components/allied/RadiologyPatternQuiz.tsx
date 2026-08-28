'use client';

import React, { useState, useMemo } from 'react';
import {
  Eye,
  EyeOff,
  Layers,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Compass,
  FileText,
  Flame,
  ArrowRight,
  Info,
  Check,
  ZoomIn
} from 'lucide-react';
import styles from './RadiologyPatternQuiz.module.css';

export interface LandmarkOverlay {
  id: string;
  name: string;
  color: string;
  description: string;
}

export interface QuizQuestion {
  id: string;
  stepTitle: string;
  prompt: string;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  explanation: string;
  clinicalPearl: string;
}

export interface RadiologyCase {
  id: string;
  caseNumber: number;
  category: 'Thoracic' | 'Neuro' | 'Abdominal';
  title: string;
  modality: string;
  patientHistory: string;
  vitals: string;
  normalDescription: string;
  pathologyDescription: string;
  landmarks: LandmarkOverlay[];
  questions: QuizQuestion[];
}

const CASES: RadiologyCase[] = [
  {
    id: 'case-1-tension-pneumo',
    caseNumber: 1,
    category: 'Thoracic',
    title: 'Right-sided Tension Pneumothorax',
    modality: 'Erect PA Chest Radiograph',
    patientHistory:
      '24-year-old unrestrained driver involved in high-speed MVC. Presents with severe right pleuritic chest pain, profound dyspnea, cyanosis, and absent breath sounds over the right hemithorax. Trachea deviated to the left.',
    vitals: 'BP 78/44 mmHg (Hypotensive Shock), HR 138 bpm, RR 36/min, SpO2 82% on room air.',
    normalDescription:
      'Normal PA Chest X-ray: Symmetric bronchovascular markings extending to peripheral lung fields; trachea midline; cardiothoracic ratio <0.5; sharp costophrenic angles.',
    pathologyDescription:
      'Right Tension Pneumothorax: Complete absence of bronchovascular markings in right hemithorax with collapsed right lung edge (visceral pleural line), contralateral mediastinal/tracheal shift to left, and depressed right hemidiaphragm.',
    landmarks: [
      {
        id: 'pleural-line',
        name: 'Visceral Pleural Line & Avascular Zone',
        color: '#38bdf8',
        description: 'Retracted visceral pleura with complete radiolucent avascular zone laterally.'
      },
      {
        id: 'mediastinal-shift',
        name: 'Contralateral Mediastinal Shift',
        color: '#ef4444',
        description: 'Trachea and cardiac silhouette displaced markedly to the left side.'
      },
      {
        id: 'depressed-diaphragm',
        name: 'Depressed Right Hemidiaphragm',
        color: '#fbbf24',
        description: 'Right diaphragmatic dome flattened and pushed inferiorly under tension.'
      }
    ],
    questions: [
      {
        id: 'c1-q1',
        stepTitle: 'Step 1: Radiological Sign Identification',
        prompt: 'Which combination of radiological signs on this chest radiograph confirms a TENSION pneumothorax rather than a simple spontaneous pneumothorax?',
        options: [
          { id: 'a', text: 'Bilateral apical blebs and horizontal fissure elevation', isCorrect: false },
          { id: 'b', text: 'Absent right peripheral lung markings with contralateral mediastinal shift and depressed right hemidiaphragm', isCorrect: true },
          { id: 'c', text: 'Dense lobar consolidation with positive air bronchograms', isCorrect: false },
          { id: 'd', text: 'Cardiomegaly with bilateral bat-wing perihilar alveolar haziness', isCorrect: false }
        ],
        explanation:
          'Tension pneumothorax is diagnosed radiologically by the presence of a one-way valve effect causing progressive intrapleural gas accumulation, marked collapse of the ipsilateral lung, contralateral tracheal and mediastinal shift, and flattening/inversion of the ipsilateral hemidiaphragm.',
        clinicalPearl:
          'Clinical Emergency Pearl: Tension pneumothorax is a CLINICAL diagnosis. Never delay emergency needle decompression (2nd ICS midclavicular line or 5th ICS anterior axillary line) to obtain imaging if the patient is in hemodynamic collapse!'
      },
      {
        id: 'c1-q2',
        stepTitle: 'Step 2: Emergency Management',
        prompt: 'What is the immediate first-line lifesaving intervention indicated for this patient?',
        options: [
          { id: 'a', text: 'Order high-resolution CT thorax with IV contrast', isCorrect: false },
          { id: 'b', text: 'Immediate emergent needle thoracostomy / decompression followed by intercostal chest drain (ICD)', isCorrect: true },
          { id: 'c', text: 'Administer IV broad-spectrum antibiotics and nebulized bronchodilators', isCorrect: false },
          { id: 'd', text: 'Perform diagnostic thoracentesis with a 22G spinal needle', isCorrect: false }
        ],
        explanation:
          'Immediate decompression relieves intrathoracic tension, preventing obstructive shock and cardiovascular collapse caused by inferior vena cava compression.',
        clinicalPearl:
          'Follow up immediate needle thoracostomy with formal tube thoracostomy (28-32 Fr chest tube) connected to an underwater seal drainage system.'
      }
    ]
  },
  {
    id: 'case-2-lobar-consolidation',
    caseNumber: 2,
    category: 'Thoracic',
    title: 'Left Lower Lobe Lobar Consolidation',
    modality: 'PA Chest Radiograph',
    patientHistory:
      '62-year-old female with 4-day history of high fever (39.2°C), productive cough with rust-colored sputum, and left pleuritic chest pain. Auscultation reveals bronchial breathing and dullness to percussion at the left lung base.',
    vitals: 'BP 118/76 mmHg, HR 102 bpm, RR 26/min, SpO2 91% on room air, Temp 39.2°C.',
    normalDescription:
      'Normal PA Chest X-ray: Clear bilateral lung bases; crisp left and right diaphragmatic domes; sharp left heart border and clear retrocardiac window.',
    pathologyDescription:
      'Left Lower Lobe Pneumonia: Dense alveolar opacification in the left lower zone with branching air bronchograms. Positive Silhouette Sign obliterating the left hemidiaphragm, while the left cardiac margin remains distinct.',
    landmarks: [
      {
        id: 'air-bronchograms',
        name: 'Air Bronchogram Sign',
        color: '#38bdf8',
        description: 'Branching lucent tubular air-filled bronchi outlined against dense consolidated alveoli.'
      },
      {
        id: 'diaphragm-silhouette',
        name: 'Silhouette Sign (Left Diaphragm)',
        color: '#fbbf24',
        description: 'Loss of normal sharp left diaphragmatic contour due to adjacent dense consolidation.'
      },
      {
        id: 'preserved-heart-border',
        name: 'Preserved Left Heart Border',
        color: '#10b981',
        description: 'Left heart border remains crisp, distinguishing lower lobe from lingular consolidation.'
      }
    ],
    questions: [
      {
        id: 'c2-q1',
        stepTitle: 'Step 1: Anatomical Localization',
        prompt: 'Why does the left heart border remain crisp and visible despite extensive dense consolidation in the left lower zone?',
        options: [
          { id: 'a', text: 'The consolidation is located anteriorly in the left lingular segments', isCorrect: false },
          { id: 'b', text: 'The consolidation is in the posterior Left Lower Lobe, which does not anatomically contact the anterior left cardiac border', isCorrect: true },
          { id: 'c', text: 'Pericardial calcification prevents silhouette sign formation', isCorrect: false },
          { id: 'd', text: 'The opacification is strictly an extrapleural hematoma', isCorrect: false }
        ],
        explanation:
          'The Silhouette Sign occurs when two structures of the same radiographic density touch anatomically. The left heart border contacts the anterior Lingula (Left Upper Lobe). Because this consolidation is posterior in the Left Lower Lobe (LLL), the anterior lingula remains aerated, preserving the crisp cardiac silhouette while obscuring the posterior left hemidiaphragm.',
        clinicalPearl:
          'Felson Silhouette Sign Pearl: Obscured right heart border = Right Middle Lobe; Obscured left heart border = Lingula; Obscured hemidiaphragm = Lower Lobe.'
      },
      {
        id: 'c2-q2',
        stepTitle: 'Step 2: Etiology & Treatment',
        prompt: 'Rust-colored sputum with lobar consolidation and air bronchograms is classical for which pathogen and initial empiric therapy?',
        options: [
          { id: 'a', text: 'Streptococcus pneumoniae — Empiric Beta-lactam (e.g. Amoxicillin-Clavulanate or Ceftriaxone) + Macrolide', isCorrect: true },
          { id: 'b', text: 'Mycoplasma pneumoniae — Oral Fluconazole', isCorrect: false },
          { id: 'c', text: 'Pseudomonas aeruginosa — Oral Trimethoprim-Sulfamethoxazole alone', isCorrect: false },
          { id: 'd', text: 'Pneumocystis jirovecii — Inhaled corticosteroid', isCorrect: false }
        ],
        explanation:
          'Streptococcus pneumoniae (Pneumococcus) produces typical acute lobar alveolar consolidation with rusty sputum. Guideline CAP therapy includes a beta-lactam combined with a macrolide or respiratory fluoroquinolone.',
        clinicalPearl:
          'Air bronchograms indicate alveolar filling process (fluid/pus/blood) with patent conducting airways, ruling out an obstructing central bronchogenic tumor.'
      }
    ]
  },
  {
    id: 'case-3-extradural-hemorrhage',
    caseNumber: 3,
    category: 'Neuro',
    title: 'Acute Extradural (Epidural) Hemorrhage',
    modality: 'Axial Non-Contrast Head CT (Brain Window)',
    patientHistory:
      '19-year-old cyclist struck by a vehicle without a helmet. Initial brief loss of consciousness followed by a 2-hour "lucid interval" with headache. Now presenting with sudden rapid deterioration, GCS drop from 15 to 8, and right-sided pupillary dilation.',
    vitals: 'BP 168/92 mmHg (Cushing response), HR 52 bpm (Bradycardia), GCS 8 (E2 V2 M4), Right pupil 6mm unreactive.',
    normalDescription:
      'Normal Non-contrast Brain CT: Symmetrical cerebral hemispheres; normal basal cisterns; patent lateral ventricles without midline shift; intact calvarium.',
    pathologyDescription:
      'Acute Epidural Hematoma (EDH): Biconvex / lentiform hyperdense extra-axial lesion (60-80 HU) along the inner table of the right temporoparietal bone. Limited by cranial sutures. Associated with ipsilateral lateral ventricle compression and midline shift.',
    landmarks: [
      {
        id: 'lentiform-shape',
        name: 'Biconvex / Lentiform Hyperdensity',
        color: '#ef4444',
        description: 'Classic lens-shaped extra-axial collection between the dura mater and inner skull table.'
      },
      {
        id: 'suture-limits',
        name: 'Suture Line Constraints',
        color: '#fbbf24',
        description: 'Does not cross coronal or lambdoid cranial sutures due to tight dural adhesion.'
      },
      {
        id: 'midline-shift-edh',
        name: 'Mass Effect & Midline Shift',
        color: '#a855f7',
        description: 'Effacement of the right lateral ventricle with subfalcine herniation to the left.'
      }
    ],
    questions: [
      {
        id: 'c3-q1',
        stepTitle: 'Step 1: Morphological Differentiation',
        prompt: 'Why does an acute Epidural Hematoma (EDH) form a biconvex (lens-shaped) lesion, whereas a Subdural Hematoma (SDH) forms a crescentic shape?',
        options: [
          { id: 'a', text: 'EDH is venous blood that flows freely along the arachnoid membrane', isCorrect: false },
          { id: 'b', text: 'EDH is located between the skull and tightly adherent periosteal dura, limited by cranial suture lines where dura anchors to bone', isCorrect: true },
          { id: 'c', text: 'SDH is restricted by the tentorium cerebelli', isCorrect: false },
          { id: 'd', text: 'EDH only occurs in the subarachnoid space', isCorrect: false }
        ],
        explanation:
          'Because the outer periosteal dura is firmly anchored at cranial sutures, arterial bleeding under pressure (usually Middle Meningeal Artery) peels the dura off the skull between sutures, forming a characteristic biconvex/lentiform mass that cannot cross suture lines.',
        clinicalPearl:
          'Neurosurgery Rule: EDH = Lentiform / Biconvex (does NOT cross sutures, can cross dural attachments). SDH = Crescentic / Concave (CAN cross sutures, limited by dural folds like falx/tentorium).'
      },
      {
        id: 'c3-q2',
        stepTitle: 'Step 2: Vascular Origin & Emergency Intervention',
        prompt: 'Which vascular structure is most commonly lacerated in this injury, and what is the definitive emergency treatment?',
        options: [
          { id: 'a', text: 'Bridging cortical veins — Conservative observation in ward', isCorrect: false },
          { id: 'b', text: 'Middle Meningeal Artery (at the Pterion) — Emergent neurosurgical craniotomy / burr hole clot evacuation', isCorrect: true },
          { id: 'c', text: 'Internal Carotid Artery aneurysm — Lumbar puncture', isCorrect: false },
          { id: 'd', text: 'Superior Sagittal Sinus — IV Heparin anticoagulation', isCorrect: false }
        ],
        explanation:
          'The Middle Meningeal Artery runs beneath the pterion (thinnest part of lateral skull). Fractures here lacerate the artery, causing rapid arterial expansion. Emergency craniotomy with clot evacuation and vessel coagulation is curative.',
        clinicalPearl:
          'The classic triad of "Lucid Interval + Ipsilateral Dilated Pupil + Contralateral Hemiparesis" signals impending uncal transtentorial herniation requiring immediate neurosurgical evacuation.'
      }
    ]
  },
  {
    id: 'case-4-acute-appendicitis',
    caseNumber: 4,
    category: 'Abdominal',
    title: 'Acute Appendicitis on Contrast CT',
    modality: 'Axial Contrast-Enhanced CT Abdomen & Pelvis',
    patientHistory:
      '28-year-old male with 24 hours of periumbilical pain that migrated to the right lower quadrant (McBurney point). Reports anorexia, nausea, and low-grade fever. Rebound tenderness and Rovsing sign are positive.',
    vitals: 'BP 124/78 mmHg, HR 96 bpm, Temp 38.1°C, WBC 15.8 x 10^9/L with 88% neutrophils.',
    normalDescription:
      'Normal CT Abdomen: Vermiform appendix caliber <6 mm with thin enhancing wall; surrounding retrocecal and mesenteric fat clean and homogeneous without inflammatory stranding.',
    pathologyDescription:
      'Acute Appendicitis: Dilated blind-ending tubular structure in the right iliac fossa measuring 9.2 mm outer diameter with circumferential mural thickening, hyperdense calcified appendicolith (fecalith) at the base, and periappendiceal mesenteric fat stranding.',
    landmarks: [
      {
        id: 'dilated-appendix',
        name: 'Dilated Appendix Caliber (>6 mm)',
        color: '#ef4444',
        description: 'Outer diameter measures 9.2 mm with thickened hyperenhancing wall (Target sign).'
      },
      {
        id: 'appendicolith',
        name: 'Calcified Appendicolith (Fecalith)',
        color: '#fbbf24',
        description: 'Hyperdense radio-opaque calcification obstructing the proximal appendiceal lumen.'
      },
      {
        id: 'fat-stranding',
        name: 'Periappendiceal Fat Stranding',
        color: '#38bdf8',
        description: 'Hazy increased attenuation/wisps in adjacent retrocecal and mesenteric adipose tissue.'
      }
    ],
    questions: [
      {
        id: 'c4-q1',
        stepTitle: 'Step 1: CT Diagnostic Criteria',
        prompt: 'Which threshold diameter and key secondary inflammatory signs establish the diagnosis of acute appendicitis on CT?',
        options: [
          { id: 'a', text: 'Appendix outer diameter >6 mm with mural thickening and periappendiceal fat stranding', isCorrect: true },
          { id: 'b', text: 'Appendix diameter >2 mm with complete luminal air distension', isCorrect: false },
          { id: 'c', text: 'Diffuse pancolitis with lead-pipe colon appearance', isCorrect: false },
          { id: 'd', text: 'Presence of pneumobilia with gallstone ileus', isCorrect: false }
        ],
        explanation:
          'CT criteria for acute appendicitis include: outer diameter >6 mm, wall thickness >2 mm, mural hyperenhancement, periappendiceal fat stranding, cecal apex thickening, and identification of an appendicolith.',
        clinicalPearl:
          'The presence of an appendicolith is associated with higher risk of early appendiceal gangrene and perforation.'
      },
      {
        id: 'c4-q2',
        stepTitle: 'Step 2: Clinical Management',
        prompt: 'What is the standard definitive management plan for this patient?',
        options: [
          { id: 'a', text: 'NPO, IV fluid resuscitation, broad-spectrum IV antibiotics, and urgent laparoscopic appendectomy', isCorrect: true },
          { id: 'b', text: 'Discharge on oral analgesics with outpatient colonoscopy in 6 weeks', isCorrect: false },
          { id: 'c', text: 'Barium enema under fluoroscopy to decompress lumen', isCorrect: false },
          { id: 'd', text: 'Urgent therapeutic ERCP with biliary sphincterotomy', isCorrect: false }
        ],
        explanation:
          'Standard of care is intravenous hydration, pre-operative IV antibiotics targeting enteric gram-negative bacilli and anaerobes, and urgent laparoscopic or open appendectomy.',
        clinicalPearl:
          'Alvarado score >=7 or CT-confirmed acute appendicitis with appendicolith requires prompt surgical excision before luminal necrosis leads to perforation and peritonitis.'
      }
    ]
  },
  {
    id: 'case-5-pneumoperitoneum',
    caseNumber: 5,
    category: 'Abdominal',
    title: 'Pneumoperitoneum / Perforated Peptic Ulcer',
    modality: 'Erect PA Chest Radiograph & Upper Abdomen',
    patientHistory:
      '52-year-old male with chronic high-dose NSAID use for osteoarthritis presents with sudden-onset excruciating epigastric "tearing" pain that rapidly spread across the entire abdomen. On examination: board-like involuntary abdominal rigidity and silent abdomen.',
    vitals: 'BP 102/60 mmHg, HR 114 bpm, RR 28/min shallow, Temp 37.9°C, Severe generalized peritonitis.',
    normalDescription:
      'Normal Erect CXR: Right hemidiaphragmatic dome directly abuts the homogeneous liver parenchymal shadow without intervening gas crescent; left gastric bubble is normal.',
    pathologyDescription:
      'Pneumoperitoneum: Distinct crescent-shaped radiolucency (subdiaphragmatic free air) beneath the right hemidiaphragm separating the liver dome from the diaphragm. Secondary Rigler double-wall sign on upper abdominal bowel loops.',
    landmarks: [
      {
        id: 'free-air-crescent',
        name: 'Subdiaphragmatic Free Air Crescent',
        color: '#ef4444',
        description: 'Radiolucent crescent of gas beneath the right hemidiaphragmatic dome.'
      },
      {
        id: 'liver-margin',
        name: 'Depressed Superior Liver Margin',
        color: '#fbbf24',
        description: 'Superior contour of the liver clearly visualized due to free peritoneal gas contrast.'
      },
      {
        id: 'rigler-sign',
        name: 'Rigler Sign (Double Wall Sign)',
        color: '#38bdf8',
        description: 'Bowel wall outlined by air on both its luminal (inside) and peritoneal (outside) surfaces.'
      }
    ],
    questions: [
      {
        id: 'c5-q1',
        stepTitle: 'Step 1: Radiological Sign Interpretation',
        prompt: 'Why is an ERECT Chest Radiograph preferred over a supine abdominal X-ray for detecting suspected pneumoperitoneum?',
        options: [
          { id: 'a', text: 'Erect positioning allows as little as 1-2 mL of free intraperitoneal gas to rise and collect beneath the right hemidiaphragm', isCorrect: true },
          { id: 'b', text: 'Erect CXR uses less radiation than an abdominal film', isCorrect: false },
          { id: 'c', text: 'Supine abdominal films cannot visualize the pelvic bones', isCorrect: false },
          { id: 'd', text: 'Free gas only rises on the left side near the spleen', isCorrect: false }
        ],
        explanation:
          'Free intraperitoneal air is buoyant and rises to the highest anatomical point in the upright patient—beneath the right hemidiaphragm, where the uniform solid density of the liver provides exceptional contrast for spotting even subtle sickles of air.',
        clinicalPearl:
          'Differential Diagnosis Pearl: Beware of Chilaiditi sign (colonic interposition between liver and diaphragm, identified by colonic haustra) and subdiaphragmatic fat stripes which can mimic free air.'
      },
      {
        id: 'c5-q2',
        stepTitle: 'Step 2: Emergency Surgical Escalation',
        prompt: 'What is the immediate emergency management for perforated peptic ulcer with generalized peritonitis?',
        options: [
          { id: 'a', text: 'Immediate NPO, NG tube decompression, IV PPI, broad-spectrum IV antibiotics, and urgent exploratory laparotomy / laparoscopic Graham patch repair', isCorrect: true },
          { id: 'b', text: 'Immediate upper GI endoscopy with hot snare cautery', isCorrect: false },
          { id: 'c', text: 'Discharge with oral antacids and follow-up H. pylori breath test', isCorrect: false },
          { id: 'd', text: 'High-volume oral barium swallow to localize the leak', isCorrect: false }
        ],
        explanation:
          'Perforated viscus with pneumoperitoneum and peritonitis is a surgical emergency. Immediate gastric decompression with an NG tube, IV fluid resuscitation, IV pantoprazole, broad-spectrum antibiotics, and emergency surgical repair (omental Graham patch) are vital to prevent fatal septic shock.',
        clinicalPearl:
          'Barium contrast is strictly CONTRAINDICATED in suspected perforation because barium in the peritoneal cavity produces severe, often fatal chemical peritonitis and granulomatous adhesions!'
      }
    ]
  }
];

export default function RadiologyPatternQuiz() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-1-tension-pneumo');
  const [viewMode, setViewMode] = useState<'pathology' | 'normal'>('pathology');
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);
  const [invertFilter, setInvertFilter] = useState<boolean>(false);

  // Quiz state: { [caseId]: { [questionIndex]: selectedOptionId } }
  const [answers, setAnswers] = useState<Record<string, Record<number, string>>>({});
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [completedCases, setCompletedCases] = useState<string[]>([]);

  const currentCase = useMemo(() => {
    return CASES.find((c) => c.id === selectedCaseId) || CASES[0];
  }, [selectedCaseId]);

  const currentCaseAnswers = answers[selectedCaseId] || {};
  const currentQuestion = currentCase.questions[activeQuestionIdx] || currentCase.questions[0];
  const selectedOptionId = currentCaseAnswers[activeQuestionIdx];

  const isCurrentQuestionAnswered = Boolean(selectedOptionId);
  const isSelectedOptionCorrect = useMemo(() => {
    if (!selectedOptionId) return false;
    const opt = currentQuestion.options.find((o) => o.id === selectedOptionId);
    return opt ? opt.isCorrect : false;
  }, [selectedOptionId, currentQuestion]);

  const handleSelectCase = (cId: string) => {
    setSelectedCaseId(cId);
    setActiveQuestionIdx(0);
    setViewMode('pathology');
  };

  const handleSelectOption = (optionId: string) => {
    if (selectedOptionId) return; // already answered
    setAnswers((prev) => ({
      ...prev,
      [selectedCaseId]: {
        ...(prev[selectedCaseId] || {}),
        [activeQuestionIdx]: optionId
      }
    }));
  };

  const handleNextQuestion = () => {
    if (activeQuestionIdx < currentCase.questions.length - 1) {
      setActiveQuestionIdx((prev) => prev + 1);
    } else {
      // Completed case
      if (!completedCases.includes(selectedCaseId)) {
        setCompletedCases((prev) => [...prev, selectedCaseId]);
      }
    }
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setCompletedCases([]);
    setActiveQuestionIdx(0);
  };

  // SVG Renderer for each case (Normal vs Pathological)
  const renderRadiologyScan = () => {
    const isNormal = viewMode === 'normal';

    switch (currentCase.id) {
      case 'case-1-tension-pneumo':
        return (
          <svg viewBox="0 0 400 400" className={styles.radiologySvg}>
            {/* Thorax Silhouette background */}
            <rect width="400" height="400" fill="#05070d" />
            <path d="M 60 50 Q 200 20 340 50 L 370 360 Q 200 390 30 360 Z" fill="#0a0f1d" stroke="#334155" strokeWidth="2" />

            {/* Spine and Mediastinum */}
            <rect x="195" y="30" width="10" height="340" fill="#2d3748" opacity="0.8" />
            {/* Clavicles and Ribs */}
            <path d="M 80 70 Q 140 85 195 85 M 320 70 Q 260 85 205 85" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
            <path d="M 80 120 Q 140 140 195 140 M 320 120 Q 260 140 205 140" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
            <path d="M 70 170 Q 140 195 195 195 M 330 170 Q 260 195 205 195" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
            <path d="M 65 220 Q 140 250 195 250 M 335 220 Q 260 250 205 250" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
            <path d="M 60 280 Q 140 310 195 310 M 340 280 Q 260 310 205 310" stroke="#334155" strokeWidth="4" strokeLinecap="round" />

            {isNormal ? (
              <>
                {/* Normal Left & Right Lungs with vascular markings */}
                {/* Right Lung Normal */}
                <path d="M 190 70 Q 120 75 90 140 Q 75 220 85 300 Q 140 300 185 280 Z" fill="#141f33" opacity="0.9" />
                <path d="M 140 120 Q 110 170 100 230 M 140 160 Q 120 210 115 260 M 150 180 Q 170 230 160 270" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 2" />
                {/* Normal Diaphragm Right */}
                <path d="M 75 310 Q 140 290 190 315" stroke="#94a3b8" strokeWidth="3" fill="none" />

                {/* Normal Trachea central */}
                <rect x="196" y="35" width="8" height="60" fill="#05070d" stroke="#64748b" strokeWidth="1" />

                {/* Normal Heart Centered / Slight Left */}
                <path d="M 195 190 Q 250 210 260 290 Q 195 310 160 290 Z" fill="#2d3748" stroke="#475569" strokeWidth="2" />
                {/* Left Lung Normal */}
                <path d="M 210 70 Q 280 75 310 140 Q 325 220 315 300 Q 260 300 215 280 Z" fill="#141f33" opacity="0.9" />
                <path d="M 260 120 Q 290 170 300 230 M 260 160 Q 280 210 285 260 M 250 180 Q 230 230 240 270" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 2" />
                {/* Normal Diaphragm Left */}
                <path d="M 325 310 Q 260 295 210 320" stroke="#94a3b8" strokeWidth="3" fill="none" />
              </>
            ) : (
              <>
                {/* Pathological: Right Tension Pneumothorax */}
                {/* Completely radiolucent (jet black) right hemithorax avascular zone */}
                <path d="M 190 60 Q 110 70 80 140 Q 65 240 75 345 Q 150 355 185 330 Z" fill="#000000" stroke="#0ea5e9" strokeWidth={showLandmarks ? '1.5' : '0'} />

                {/* Collapsed right lung visceral pleural line */}
                <path d="M 188 130 Q 150 160 145 230 Q 155 280 185 290 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth={showLandmarks ? '3' : '1.5'} strokeDasharray={showLandmarks ? '4 2' : 'none'} />

                {/* Trachea shifted to Left */}
                <path d="M 198 35 Q 205 65 220 95" stroke="#ef4444" strokeWidth={showLandmarks ? '3' : '1.5'} fill="none" />

                {/* Heart & Mediastinum shifted markedly into left hemithorax */}
                <path d="M 215 170 Q 285 190 300 285 Q 230 310 190 285 Z" fill="#2d3748" stroke="#ef4444" strokeWidth={showLandmarks ? '2.5' : '1.5'} />

                {/* Depressed/Flattened Right Hemidiaphragm */}
                <path d="M 65 350 Q 130 352 185 340" stroke={showLandmarks ? '#fbbf24' : '#94a3b8'} strokeWidth={showLandmarks ? '4' : '2'} fill="none" />

                {/* Compressed Left Lung */}
                <path d="M 225 70 Q 290 80 315 140 Q 330 220 315 290 Q 280 290 230 270 Z" fill="#141f33" opacity="0.85" />
                <path d="M 270 130 Q 295 180 305 240 M 265 170 Q 280 215 285 260" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 2" />
                {/* Normal Left Hemidiaphragm */}
                <path d="M 325 300 Q 275 285 225 305" stroke="#94a3b8" strokeWidth="2.5" fill="none" />

                {/* Landmark overlays and arrows */}
                {showLandmarks && (
                  <>
                    {/* Shift Arrow */}
                    <path d="M 160 230 L 225 230 M 215 222 L 225 230 L 215 238" stroke="#ef4444" strokeWidth="3" fill="none" />
                    <text x="140" y="215" fill="#ef4444" fontSize="11" fontWeight="bold">Mediastinal Shift</text>

                    {/* Pleural edge label */}
                    <text x="90" y="150" fill="#38bdf8" fontSize="11" fontWeight="bold">Pleural Line</text>
                    <line x1="125" y1="155" x2="148" y2="185" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />

                    {/* Deep sulcus / diaphragm label */}
                    <text x="75" y="375" fill="#fbbf24" fontSize="11" fontWeight="bold">Depressed Diaphragm</text>
                  </>
                )}
              </>
            )}

            {/* Lead marker */}
            <text x="360" y="45" fill="#94a3b8" fontSize="16" fontWeight="bold" fontFamily="sans-serif">R</text>
          </svg>
        );

      case 'case-2-lobar-consolidation':
        return (
          <svg viewBox="0 0 400 400" className={styles.radiologySvg}>
            <rect width="400" height="400" fill="#05070d" />
            <path d="M 60 50 Q 200 20 340 50 L 370 360 Q 200 390 30 360 Z" fill="#0a0f1d" stroke="#334155" strokeWidth="2" />
            <rect x="195" y="30" width="10" height="340" fill="#2d3748" opacity="0.8" />

            {/* Ribs & Clavicles */}
            <path d="M 80 70 Q 140 85 195 85 M 320 70 Q 260 85 205 85" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
            <path d="M 80 120 Q 140 140 195 140 M 320 120 Q 260 140 205 140" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
            <path d="M 70 170 Q 140 195 195 195 M 330 170 Q 260 195 205 195" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
            <path d="M 65 220 Q 140 250 195 250 M 335 220 Q 260 250 205 250" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
            <path d="M 60 280 Q 140 310 195 310 M 340 280 Q 260 310 205 310" stroke="#334155" strokeWidth="4" strokeLinecap="round" />

            {/* Right Lung (Clear) */}
            <path d="M 190 70 Q 120 75 90 140 Q 75 220 85 300 Q 140 300 185 280 Z" fill="#141f33" opacity="0.9" />
            <path d="M 140 120 Q 110 170 100 230 M 140 160 Q 120 210 115 260" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 2" />
            <path d="M 75 310 Q 140 290 190 315" stroke="#94a3b8" strokeWidth="3" fill="none" />

            {/* Heart */}
            <path d="M 195 190 Q 250 210 255 285 Q 195 305 165 285 Z" fill="#2d3748" stroke={showLandmarks && !isNormal ? '#10b981' : '#475569'} strokeWidth={showLandmarks && !isNormal ? '2.5' : '2'} />

            {isNormal ? (
              <>
                {/* Normal Left Lung */}
                <path d="M 210 70 Q 280 75 310 140 Q 325 220 315 300 Q 260 300 215 280 Z" fill="#141f33" opacity="0.9" />
                <path d="M 260 120 Q 290 170 300 230 M 260 160 Q 280 210 285 260" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 2" />
                <path d="M 325 310 Q 260 295 210 320" stroke="#94a3b8" strokeWidth="3" fill="none" />
              </>
            ) : (
              <>
                {/* Upper Left Lung (Aerated) */}
                <path d="M 210 70 Q 280 75 310 140 Q 315 180 300 210 Q 250 200 215 190 Z" fill="#141f33" opacity="0.9" />

                {/* Dense Lobar Consolidation in Left Lower Lobe */}
                <path d="M 220 200 Q 270 200 320 220 Q 330 280 315 320 Q 250 330 200 310 Q 210 250 220 200 Z" fill="#e2e8f0" opacity="0.85" />

                {/* Air Bronchograms (Dark branching lucencies inside consolidation) */}
                <path d="M 240 210 L 255 245 M 255 245 L 245 285 M 255 245 L 280 270 M 280 270 L 295 300 M 280 270 L 270 305" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

                {/* Obscured Left Hemidiaphragm (Silhouette Sign) */}
                <path d="M 325 310 Q 260 295 210 320" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.3" />

                {showLandmarks && (
                  <>
                    <text x="240" y="185" fill="#38bdf8" fontSize="11" fontWeight="bold">Air Bronchograms</text>
                    <line x1="270" y1="190" x2="265" y2="235" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />

                    <text x="120" y="270" fill="#10b981" fontSize="11" fontWeight="bold">Sharp Heart Border</text>
                    <line x1="180" y1="270" x2="225" y2="265" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" />

                    <text x="235" y="350" fill="#fbbf24" fontSize="11" fontWeight="bold">Obscured Diaphragm</text>
                  </>
                )}
              </>
            )}

            <text x="360" y="45" fill="#94a3b8" fontSize="16" fontWeight="bold">R</text>
          </svg>
        );

      case 'case-3-extradural-hemorrhage':
        return (
          <svg viewBox="0 0 400 400" className={styles.radiologySvg}>
            {/* CT Background */}
            <rect width="400" height="400" fill="#000000" />
            <circle cx="200" cy="200" r="185" fill="#080c14" stroke="#1e293b" strokeWidth="2" />

            {/* Skull Cranial Vault (High HU = White) */}
            <ellipse cx="200" cy="200" rx="145" ry="165" fill="none" stroke="#f8fafc" strokeWidth="10" />

            {/* Brain Parenchyma (Soft tissue gray ~35 HU) */}
            <ellipse cx="200" cy="200" rx="138" ry="158" fill="#334155" />

            {/* Falx Cerebri (Midline) */}
            <line x1="200" y1="45" x2="200" y2="355" stroke="#64748b" strokeWidth="2" strokeDasharray="4 2" />

            {isNormal ? (
              <>
                {/* Symmetrical Lateral Ventricles */}
                {/* Right Ventricle */}
                <path d="M 185 150 Q 170 190 175 230 Q 190 200 185 150 Z" fill="#0f172a" />
                {/* Left Ventricle */}
                <path d="M 215 150 Q 230 190 225 230 Q 210 200 215 150 Z" fill="#0f172a" />
                {/* 3rd Ventricle */}
                <rect x="198" y="195" width="4" height="25" fill="#0f172a" />
              </>
            ) : (
              <>
                {/* Pathological: Biconvex Lentiform Hyperdense EDH on Right Skull */}
                <path d="M 68 140 Q 115 200 70 260 Q 55 200 68 140 Z" fill="#ffffff" stroke={showLandmarks ? '#ef4444' : '#ffffff'} strokeWidth={showLandmarks ? '3' : '1'} />

                {/* Suture Lines Markers (Coronal and Lambdoid) */}
                <line x1="68" y1="140" x2="55" y2="135" stroke="#fbbf24" strokeWidth="4" />
                <line x1="70" y1="260" x2="57" y2="265" stroke="#fbbf24" strokeWidth="4" />

                {/* Compressed / Effaced Right Ventricle */}
                <path d="M 175 165 Q 165 190 170 215 Q 178 195 175 165 Z" fill="#0f172a" opacity="0.6" />

                {/* Shifted & Dilated Left Ventricle */}
                <path d="M 225 145 Q 248 190 240 235 Q 220 200 225 145 Z" fill="#0f172a" />

                {/* Shifted Midline Falx */}
                <path d="M 200 60 Q 225 200 200 340" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="3 2" fill="none" />

                {showLandmarks && (
                  <>
                    <text x="85" y="125" fill="#ef4444" fontSize="11" fontWeight="bold">Lentiform Hematoma (EDH)</text>
                    <line x1="110" y1="130" x2="90" y2="180" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />

                    <text x="85" y="285" fill="#fbbf24" fontSize="11" fontWeight="bold">Suture Boundary</text>

                    {/* Midline shift arrow */}
                    <path d="M 185 200 L 220 200 M 212 194 L 220 200 L 212 206" stroke="#a855f7" strokeWidth="2.5" fill="none" />
                    <text x="175" y="185" fill="#a855f7" fontSize="10" fontWeight="bold">Midline Shift</text>
                  </>
                )}
              </>
            )}

            <text x="40" y="55" fill="#38bdf8" fontSize="12" fontFamily="monospace">R (Right)</text>
            <text x="320" y="55" fill="#38bdf8" fontSize="12" fontFamily="monospace">L (Left)</text>
          </svg>
        );

      case 'case-4-acute-appendicitis':
        return (
          <svg viewBox="0 0 400 400" className={styles.radiologySvg}>
            {/* CT Abdomen Body Contour */}
            <rect width="400" height="400" fill="#000000" />
            <path d="M 60 140 Q 200 60 340 140 Q 370 240 330 330 Q 200 380 70 330 Q 30 240 60 140 Z" fill="#1e293b" stroke="#64748b" strokeWidth="4" />

            {/* Vertebral Body & Aorta (Posterior) */}
            <rect x="185" y="270" width="30" height="28" rx="4" fill="#f8fafc" />
            <circle cx="170" cy="275" r="10" fill="#f43f5e" /> {/* Aorta (contrast enhanced) */}
            <circle cx="230" cy="275" r="11" fill="#0284c7" /> {/* IVC */}

            {/* Liver (Right Upper Abdomen) */}
            <path d="M 75 150 Q 150 140 170 190 Q 150 250 75 230 Z" fill="#475569" />

            {/* Cecum (Right Iliac Fossa) */}
            <ellipse cx="110" cy="260" rx="35" ry="30" fill="#334155" stroke="#94a3b8" strokeWidth="2" />

            {isNormal ? (
              <>
                {/* Normal thin appendix (<6mm) */}
                <path d="M 125 280 Q 140 300 135 320" stroke="#94a3b8" strokeWidth="3" fill="none" strokeLinecap="round" />
                {/* Clean retrocecal fat */}
                <circle cx="140" cy="295" r="22" fill="#0f172a" opacity="0.8" />
              </>
            ) : (
              <>
                {/* Periappendiceal Mesenteric Fat Stranding (Hazy Wisps) */}
                <path d="M 120 270 Q 165 260 175 315 Q 140 350 115 320 Z" fill="#475569" opacity="0.75" />
                <path d="M 130 280 Q 155 285 160 310 M 140 300 Q 165 310 150 330" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />

                {/* Dilated Appendix (>6 mm) with Target Sign / Thickened Enhancing Wall */}
                <path d="M 130 275 Q 160 295 150 335" stroke="#ef4444" strokeWidth="10" fill="none" strokeLinecap="round" />
                <path d="M 130 275 Q 160 295 150 335" stroke="#0f172a" strokeWidth="4" fill="none" strokeLinecap="round" />

                {/* Calcified Appendicolith (Fecalith) at Base */}
                <circle cx="132" cy="280" r="5.5" fill="#ffffff" stroke="#fbbf24" strokeWidth="2" />

                {showLandmarks && (
                  <>
                    <text x="175" y="275" fill="#fbbf24" fontSize="11" fontWeight="bold">Appendicolith</text>
                    <line x1="170" y1="275" x2="140" y2="280" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="2 2" />

                    <text x="170" y="340" fill="#ef4444" fontSize="11" fontWeight="bold">Dilated Appendix (9.2mm)</text>
                    <line x1="165" y1="335" x2="155" y2="315" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />

                    <text x="65" y="355" fill="#38bdf8" fontSize="11" fontWeight="bold">Fat Stranding</text>
                  </>
                )}
              </>
            )}

            <text x="40" y="65" fill="#38bdf8" fontSize="12" fontFamily="monospace">R (Right)</text>
            <text x="320" y="65" fill="#38bdf8" fontSize="12" fontFamily="monospace">L (Left)</text>
          </svg>
        );

      case 'case-5-pneumoperitoneum':
        return (
          <svg viewBox="0 0 400 400" className={styles.radiologySvg}>
            {/* Erect CXR / Abdomen */}
            <rect width="400" height="400" fill="#05070d" />
            <path d="M 50 40 Q 200 20 350 40 L 370 360 Q 200 390 30 360 Z" fill="#0a0f1d" stroke="#334155" strokeWidth="2" />

            {/* Lower Ribs */}
            <path d="M 60 80 Q 140 100 195 100 M 340 80 Q 260 100 205 100" stroke="#475569" strokeWidth="4" />
            <path d="M 55 130 Q 140 150 195 150 M 345 130 Q 260 150 205 150" stroke="#334155" strokeWidth="4" />

            {/* Heart Silhouette (Lower part) */}
            <path d="M 170 80 Q 240 100 240 170 Q 180 180 150 160 Z" fill="#2d3748" />

            {/* Left Diaphragm with Gastric Bubble */}
            <path d="M 340 180 Q 270 160 215 185" stroke="#94a3b8" strokeWidth="3" fill="none" />
            <circle cx="270" cy="205" r="22" fill="#000000" stroke="#64748b" strokeWidth="1.5" />
            <text x="250" y="210" fill="#64748b" fontSize="9">Gastric Bubble</text>

            {isNormal ? (
              <>
                {/* Normal: Liver directly against Right Diaphragm */}
                <path d="M 65 175 Q 140 155 195 180" stroke="#94a3b8" strokeWidth="3" fill="none" />
                <path d="M 65 178 Q 140 158 195 183 L 195 320 Q 120 320 65 290 Z" fill="#334155" />
                <text x="100" y="240" fill="#94a3b8" fontSize="13" fontWeight="bold">Liver</text>
              </>
            ) : (
              <>
                {/* Pathological: Free Subdiaphragmatic Air Crescent */}
                {/* Right Diaphragm Dome */}
                <path d="M 65 170 Q 140 150 195 175" stroke="#94a3b8" strokeWidth="3" fill="none" />

                {/* Subdiaphragmatic Air Crescent (Sickle of Jet Black) */}
                <path d="M 68 174 Q 140 154 192 178 Q 140 170 68 174 Z" fill="#000000" stroke={showLandmarks ? '#ef4444' : '#000000'} strokeWidth={showLandmarks ? '2' : '0'} />

                {/* Depressed Superior Liver Margin */}
                <path d="M 68 185 Q 140 168 192 188 L 192 320 Q 120 320 68 290 Z" fill="#334155" stroke={showLandmarks ? '#fbbf24' : '#475569'} strokeWidth={showLandmarks ? '2' : '1'} />
                <text x="105" y="250" fill="#94a3b8" fontSize="13" fontWeight="bold">Liver</text>

                {/* Rigler Double Wall Sign on Bowel Loop */}
                <ellipse cx="230" cy="290" rx="35" ry="25" fill="#0f172a" stroke="#38bdf8" strokeWidth={showLandmarks ? '3' : '1.5'} />
                <ellipse cx="230" cy="290" rx="28" ry="18" fill="#000000" />

                {showLandmarks && (
                  <>
                    <text x="75" y="135" fill="#ef4444" fontSize="11" fontWeight="bold">Subdiaphragmatic Free Air</text>
                    <line x1="130" y1="140" x2="135" y2="160" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />

                    <text x="55" y="325" fill="#fbbf24" fontSize="11" fontWeight="bold">Liver Dome Margin</text>

                    <text x="210" y="340" fill="#38bdf8" fontSize="11" fontWeight="bold">Rigler Double-Wall Sign</text>
                  </>
                )}
              </>
            )}

            <text x="360" y="45" fill="#94a3b8" fontSize="16" fontWeight="bold">R</text>
          </svg>
        );

      default:
        return null;
    }
  };

  const totalScore = useMemo(() => {
    let score = 0;
    CASES.forEach((c) => {
      const cAns = answers[c.id] || {};
      c.questions.forEach((q, idx) => {
        const selId = cAns[idx];
        if (selId) {
          const opt = q.options.find((o) => o.id === selId);
          if (opt && opt.isCorrect) score += 10;
        }
      });
    });
    return score;
  }, [answers]);

  const maxScore = CASES.reduce((acc, c) => acc + c.questions.length * 10, 0);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.badgeRow}>
            <span className={styles.radBadge}>
              <Layers size={13} />
              Radiology & Diagnostic Imaging Station
            </span>
            <span className={styles.alliedBadge}>High-Yield Pattern Recognition</span>
          </div>
          <h2 className={styles.title}>
            Radiology <span className={styles.titleHighlight}>Pattern Recognition</span> Station
          </h2>
          <p className={styles.subtitle}>
            Interactive case-based radiology challenge: master pathognomonic radiological signs, comparative normal scans, landmark annotations, and emergency diagnostic decision-making.
          </p>
        </div>

        {/* Live Score Tracker */}
        <div className={styles.statsPill}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Station Score</span>
            <span className={styles.statValue}>{totalScore} / {maxScore}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Completed</span>
            <span className={`${styles.statValue} ${styles.statValueOrange}`}>
              {completedCases.length} / {CASES.length}
            </span>
          </div>
        </div>
      </header>

      {/* Case Selector Tabs */}
      <div className={styles.caseTabsContainer}>
        {CASES.map((c) => {
          const isActive = c.id === selectedCaseId;
          const isDone = completedCases.includes(c.id);
          const catClass =
            c.category === 'Thoracic'
              ? styles.catThorax
              : c.category === 'Neuro'
              ? styles.catNeuro
              : styles.catAbdomen;

          return (
            <button
              key={c.id}
              className={`${styles.caseTab} ${isActive ? styles.caseTabActive : ''}`}
              onClick={() => handleSelectCase(c.id)}
            >
              <div className={styles.caseTabTop}>
                <span className={styles.caseTag}>Case {c.caseNumber}</span>
                <span className={`${styles.caseCategoryTag} ${catClass}`}>{c.category}</span>
              </div>
              <span className={styles.caseTabName}>{c.title}</span>
              <span className={`${styles.caseTabStatus} ${isDone ? styles.caseDone : ''}`}>
                {isDone ? <CheckCircle2 size={12} /> : <Compass size={12} />}
                {isDone ? 'Case Mastered' : 'Pending Review'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left Viewer + Right Quiz */}
      <div className={styles.mainLayout}>
        {/* Left Column: Interactive DICOM / Scan Viewer */}
        <div className={styles.viewerCard}>
          <div className={styles.viewerHeader}>
            <h3 className={styles.viewerTitle}>
              <FileText size={16} color="#fb923c" />
              {currentCase.title}
            </h3>
            <span className={styles.modalityBadge}>{currentCase.modality}</span>
          </div>

          {/* Interactive Viewer Toolbar */}
          <div className={styles.toolbarRow}>
            <div className={styles.toggleGroup}>
              {/* Normal vs Pathological Toggle */}
              <button
                className={`${styles.toolBtn} ${viewMode === 'pathology' ? styles.toolBtnActive : ''}`}
                onClick={() => setViewMode('pathology')}
              >
                <Flame size={13} />
                Pathological Scan
              </button>
              <button
                className={`${styles.toolBtn} ${viewMode === 'normal' ? styles.toolBtnActiveBlue : ''}`}
                onClick={() => setViewMode('normal')}
              >
                <CheckCircle2 size={13} />
                Normal Reference
              </button>
            </div>

            <div className={styles.toggleGroup}>
              {/* Landmark Annotations Toggle */}
              <button
                className={`${styles.toolBtn} ${showLandmarks ? styles.toolBtnActive : ''}`}
                onClick={() => setShowLandmarks(!showLandmarks)}
                disabled={viewMode === 'normal'}
                title="Toggle visual landmark pointers"
              >
                <Sparkles size={13} />
                {showLandmarks ? 'Landmarks ON' : 'Landmarks OFF'}
              </button>

              {/* Invert Filter */}
              <button
                className={`${styles.toolBtn} ${invertFilter ? styles.toolBtnActive : ''}`}
                onClick={() => setInvertFilter(!invertFilter)}
                title="Invert grayscale polarity"
              >
                <Sliders size={13} />
                Invert
              </button>
            </div>
          </div>

          {/* Scan Display Canvas */}
          <div className={`${styles.canvasWrapper} ${invertFilter ? styles.canvasInverted : ''}`}>
            {renderRadiologyScan()}

            {/* Corner DICOM Patient HUD */}
            <div className={styles.dicomOverlayTopLeft}>
              <div>MEDIVERSE PACS v4.2</div>
              <div>STATION: CASE #{currentCase.caseNumber}</div>
              <div>MOD: {currentCase.modality.split(' ')[0]}</div>
            </div>

            <div className={styles.dicomOverlayTopRight}>
              <div>VIEW: {viewMode.toUpperCase()}</div>
              <div>FOV: 350 mm</div>
              <div>KV: 120 | mA: 250</div>
            </div>

            <div className={styles.dicomOverlayBottomLeft}>
              <div>ZOOM: 1.0x</div>
            </div>

            <div className={styles.dicomOverlayBottomRight}>
              <div>ANNOTATION: {showLandmarks && viewMode === 'pathology' ? 'ACTIVE' : 'OFF'}</div>
            </div>
          </div>

          {/* Landmark Annotations Legend */}
          {showLandmarks && viewMode === 'pathology' && (
            <div className={styles.landmarkLegend}>
              <div className={styles.landmarkLegendTitle}>
                <Info size={13} /> Key Pathological Landmarks
              </div>
              <div className={styles.landmarkItemsGrid}>
                {currentCase.landmarks.map((lm) => (
                  <div key={lm.id} className={styles.landmarkChip}>
                    <span className={styles.legendDot} style={{ background: lm.color }} />
                    <strong>{lm.name}:</strong> {lm.description}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Vignette */}
          <div className={styles.vignetteCard}>
            <h4 className={styles.vignetteTitle}>
              <Flame size={14} /> Clinical Presentation
            </h4>
            <p className={styles.vignetteText}>{currentCase.patientHistory}</p>
            <p className={styles.vignetteText} style={{ marginTop: '6px', color: '#93c5fd' }}>
              <strong>Vitals:</strong> {currentCase.vitals}
            </p>
          </div>
        </div>

        {/* Right Column: Multi-tiered Diagnostic Quiz */}
        <div className={styles.quizCard}>
          <div className={styles.quizHeader}>
            <h3 className={styles.quizTitle}>
              <Award size={18} color="#fb923c" />
              Diagnostic Pattern Recognition
            </h3>

            {/* Step Progress Tracker */}
            <div className={styles.stepTracker}>
              {currentCase.questions.map((_, qIdx) => {
                const isAnswered = Boolean(currentCaseAnswers[qIdx]);
                const isActive = qIdx === activeQuestionIdx;
                return (
                  <span
                    key={qIdx}
                    className={`${styles.stepDot} ${
                      isActive ? styles.stepDotActive : isAnswered ? styles.stepDotDone : ''
                    }`}
                  >
                    {qIdx + 1}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Question Block */}
          <div className={styles.questionBlock}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fb923c', textTransform: 'uppercase' }}>
              {currentQuestion.stepTitle}
            </span>
            <h4 className={styles.questionPrompt}>{currentQuestion.prompt}</h4>

            {/* Option Buttons */}
            <div className={styles.optionsList}>
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let optionStyle = styles.optionBtn;

                if (isCurrentQuestionAnswered) {
                  if (opt.isCorrect) {
                    optionStyle = `${styles.optionBtn} ${styles.optionCorrect}`;
                  } else if (isSelected && !opt.isCorrect) {
                    optionStyle = `${styles.optionBtn} ${styles.optionIncorrect}`;
                  }
                } else if (isSelected) {
                  optionStyle = `${styles.optionBtn} ${styles.optionSelected}`;
                }

                return (
                  <button
                    key={opt.id}
                    className={optionStyle}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={isCurrentQuestionAnswered}
                  >
                    <span>{opt.text}</span>
                    {isCurrentQuestionAnswered && opt.isCorrect && <CheckCircle2 size={16} color="#10b981" />}
                    {isCurrentQuestionAnswered && isSelected && !opt.isCorrect && (
                      <XCircle size={16} color="#ef4444" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Immediate Rationale & Clinical Pearls Card */}
          {isCurrentQuestionAnswered && (
            <div className={styles.rationaleCard}>
              <div className={styles.rationaleHeader}>
                {isSelectedOptionCorrect ? (
                  <CheckCircle2 size={18} color="#10b981" />
                ) : (
                  <AlertTriangle size={18} color="#ef4444" />
                )}
                <span>
                  {isSelectedOptionCorrect ? 'Correct Diagnosis!' : 'Incorrect Identification'} — Rationale & Analysis
                </span>
              </div>

              <p className={styles.rationaleBody}>{currentQuestion.explanation}</p>

              <div className={styles.pearlBox}>
                <strong>Clinical Pearl:</strong> {currentQuestion.clinicalPearl}
              </div>

              {/* Navigation Button */}
              <div className={styles.navButtonsRow}>
                {activeQuestionIdx < currentCase.questions.length - 1 ? (
                  <button className={styles.nextBtn} onClick={handleNextQuestion}>
                    Proceed to Next Step <ArrowRight size={15} />
                  </button>
                ) : (
                  <div className={styles.reviewCompletedCard} style={{ width: '100%' }}>
                    <span className={styles.completedTitle}>Case {currentCase.caseNumber} Completed!</span>
                    <p className={styles.completedDesc}>
                      You have analyzed all radiological signs and emergency management protocols for {currentCase.title}.
                    </p>
                    {currentCase.caseNumber < CASES.length ? (
                      <button
                        className={styles.nextBtn}
                        onClick={() => handleSelectCase(CASES[currentCase.caseNumber].id)}
                      >
                        Advance to Case {currentCase.caseNumber + 1} <ArrowRight size={15} />
                      </button>
                    ) : (
                      <button className={styles.nextBtn} onClick={handleResetQuiz}>
                        <RotateCcw size={15} /> Reset All Cases & Retry
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
