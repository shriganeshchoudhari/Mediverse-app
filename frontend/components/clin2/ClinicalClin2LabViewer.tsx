"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalClin2LabViewer.module.css";
import {
  Scissors,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Search,
  Droplet,
  Calculator,
  TrendingUp,
  Gauge,
  Thermometer,
  Shield,
  Crosshair,
  Pill,
  Brain,
  Zap,
  Award,
  Flame,
  Dna,
  HeartPulse,
  Radio,
  TestTube,
  UserCheck,
  Users,
  Activity,
  ClipboardList,
} from "lucide-react";

export type Clin2LabMode = "preop" | "fever" | "drains" | "wounds";

export interface Clin2LabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  surgicalProfile: string;
  proceduralMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const CLIN2_LAB_NODES: Record<Clin2LabMode, Clin2LabNode[]> = {
  preop: [
    {
      id: "clin2-po-rcri-cardiac-risk-mace",
      name: "RCRI Major Adverse Cardiac Event Risk (6 Independent Predictors & Class I-IV MACE Rates)",
      category: "Cardiac Risk Index",
      subType: "High-Risk Surgery • CAD • CHF • Stroke/TIA • Insulin-Dependent Diabetes • Cr > 2.0 mg/dL",
      surgicalProfile: "Validated clinical risk stratification tool predicting major perioperative cardiac events.",
      proceduralMechanism: "Quantifies cumulative risk of perioperative MI, cardiac arrest, or death based on 6 independent clinical predictors.",
      clinicalHallmarks: "Class I (0 pts, 0.4% MACE) to Class IV (&ge;3 pts, >11% MACE); guides necessity of selective cardiology workup.",
      highYieldPearls: "RCRI uses 6 variables: High-risk surgery, ischemic heart disease, CHF, stroke/TIA, insulin diabetes, and Cr >2.0 mg/dL."
    },
    {
      id: "clin2-po-asa-physical-status-classification",
      name: "ASA Physical Status Classification (ASA I Healthy to ASA VI Organ Donor & Emergency Modifiers)",
      category: "Anesthesia Fitness",
      subType: "ASA I (Normal) • ASA II (Mild) • ASA III (Severe) • ASA IV (Threat to Life) • ASA V (Moribund) • ASA E",
      surgicalProfile: "Universal anesthesia physical status scale assessing patient systemic health prior to operative interventions.",
      proceduralMechanism: "Standardizes patient physiological baseline to assist anesthesiologists in operative risk planning.",
      clinicalHallmarks: "ASA III indicates severe disease with functional limitation (e.g. COPD, stable angina, poorly controlled diabetes).",
      highYieldPearls: "The 'E' modifier is appended to any ASA class for emergency surgeries where delay would significantly compromise life."
    },
    {
      id: "clin2-po-functional-capacity-mets",
      name: "Functional Capacity METs Assessment (&ge;4 METs Cardiopulmonary Reserve & Exercise Thresholds)",
      category: "Metabolic Reserve",
      subType: "&ge;4 METs (Climbing 2 Flights / Uphill Walk) vs <4 METs (Sedentary / Severe Dyspnea on Flat Ground)",
      surgicalProfile: "Clinical quantification of functional exercise capacity to determine if preoperative cardiac stress testing is needed.",
      proceduralMechanism: "Adequate functional reserve (&ge;4 METs) correlates with low perioperative cardiac complication rates.",
      clinicalHallmarks: "Patients with &ge;4 METs functional capacity can safely proceed to elective surgery without routine cardiac stress tests.",
      highYieldPearls: "Functional capacity &ge;4 METs (climbing 2 flights of stairs) permits surgery without invasive cardiac stress testing."
    },
    {
      id: "clin2-po-perioperative-medication-adjustments",
      name: "Perioperative Medication Adjustments (ACEI Vasoplegia Prevention & SGLT2i Euglycemic DKA Holds)",
      category: "Pharmacotherapy",
      subType: "Continue Beta-Blockers/Statins • Hold Morning ACEI/ARBs • Hold SGLT2i 3-4 Days Prior • Warfarin/DOACs",
      surgicalProfile: "Disciplined perioperative medication guidelines avoiding fatal intraoperative hypotension and metabolic crises.",
      proceduralMechanism: "Holding ACEIs prevents refractory vasoplegia under anesthesia; holding SGLT2 inhibitors prevents euglycemic DKA.",
      clinicalHallmarks: "Continue chronic beta-blockers; hold ACEIs on morning of surgery; hold SGLT2 inhibitors 3-4 days before surgery.",
      highYieldPearls: "HOLD ACE inhibitors on the morning of surgery (prevents vasoplegia); HOLD SGLT2 inhibitors 3-4 days prior (prevents euDKA)."
    }
  ],

  fever: [
    {
      id: "clin2-fv-pod1-wind-atelectasis",
      name: "POD 1-2 Wind Atelectasis (Alveolar Collapse, Incisional Splinting & Incentive Spirometry)",
      category: "POD 1-2 Fever",
      subType: "Alveolar Collapse • Incisional Pain Splinting • Diaphragmatic Hypoventilation • Incentive Spirometry",
      surgicalProfile: "Most common cause of early postoperative fever on Postoperative Days 1 and 2.",
      proceduralMechanism: "Incisional pain and anesthetic residual cause shallow breathing and mucus plugging, triggering alveolar atelectasis.",
      clinicalHallmarks: "Low-grade fever (38.0-38.5&deg;C), mild tachypnea, scattered fine crackles; managed with incentive spirometry and ambulation.",
      highYieldPearls: "POD 1-2 fever is 'Wind' (Atelectasis); manage with multimodal pain control, incentive spirometry, and early ambulation."
    },
    {
      id: "clin2-fv-pod3-water-catheter-uti",
      name: "POD 3 Water Catheter UTI (Ascending Coliform Bacteriuria & Prompt Foley Removal)",
      category: "POD 3 Fever",
      subType: "Indwelling Foley Catheter • Coliform Colonization (E. coli, Klebsiella) • Urinalysis & Catheter Removal",
      surgicalProfile: "Classic cause of postoperative fever occurring around Postoperative Day 3.",
      proceduralMechanism: "Prolonged indwelling urinary catheterization creates a biofilm conduit for ascending urinary tract infection.",
      clinicalHallmarks: "Fever, suprapubic tenderness, cloudy/malodorous urine; managed by prompt Foley removal and targeted antibiotics.",
      highYieldPearls: "POD 3 fever is 'Water' (UTI); best prevented by removing indwelling urinary catheters within 24-48 hours of surgery."
    },
    {
      id: "clin2-fv-pod5-wound-surgical-site-infection",
      name: "POD 5 Wound Surgical Site Infection (Incisional Abscess Opening, Debridement & Packing)",
      category: "POD 5 Fever",
      subType: "Superficial / Deep Incisional SSI • S. aureus & Enteric Flora • Staple Removal & Open Drainage",
      surgicalProfile: "Bacterial infection of the surgical incision classically presenting on Postoperative Day 5.",
      proceduralMechanism: "Bacterial inoculation into surgical dead space leads to localized cellulitis, necrosis, and abscess collection.",
      clinicalHallmarks: "Erythema, induration, localized warmth, and purulent discharge; mandatory management is OPENING THE INCISION and draining.",
      highYieldPearls: "POD 5 fever is 'Wound' (SSI); definitive surgical treatment is removing staples, opening the wound, and draining purulence."
    },
    {
      id: "clin2-fv-pod7-walking-dvt-pe-intraop-mh",
      name: "POD 7-10 Walking DVT/PE & Intraop MH (Virchow Triad Thromboembolism & Dantrolene Hyperthermia)",
      category: "POD 7-10 & Intraop",
      subType: "DVT / PE (POD 7-10) • Malignant Hyperthermia (Intraoperative RYR1 Triggered) • IV Dantrolene 2.5 mg/kg",
      surgicalProfile: "Venous thromboembolism on POD 7-10 and hyperacute life-threatening intraoperative malignant hyperthermia.",
      proceduralMechanism: "Virchow triad triggers DVT/PE; volatile anesthetics/succinylcholine trigger massive sarcoplasmic calcium release in MH.",
      clinicalHallmarks: "DVT/PE: Unilateral leg edema, acute pleuritic chest pain, hypoxia. MH: Rising EtCO2, masseter spasm, extreme fever (>41&deg;C).",
      highYieldPearls: "POD 7-10 fever is 'Walking' (DVT/PE). Intraoperative fever with rigidity and high EtCO2 is MH &rarr; IV Dantrolene."
    }
  ],

  drains: [
    {
      id: "clin2-dr-closed-suction-jp-blake-drains",
      name: "Closed-Suction JP & Blake Drains (Negative Pressure Bulb Evacuation & <30 mL/24h Removal)",
      category: "Closed Suction",
      subType: "Jackson-Pratt (JP) • Blake Silicon Drain • Compressed Grenade Vacuum • Removal <30 mL/24h",
      surgicalProfile: "Active closed-suction surgical drainage systems preventing seroma, hematoma, and dead-space fluid collection.",
      proceduralMechanism: "Manual compression of the silicone bulb generates continuous gentle negative suction to evacuate surgical dead space.",
      clinicalHallmarks: "Track daily 24h volume and character; removed when serosanguinous output drops to <30 mL/24 hours.",
      highYieldPearls: "Jackson-Pratt (JP) drains use closed bulb negative pressure; criteria for removal is typically <30 mL/24h clear output."
    },
    {
      id: "clin2-dr-pathological-drain-output-qualities",
      name: "Pathological Drain Output Qualities (Surgical Hemorrhage, Biliary Fistulas & Chylous Leaks)",
      category: "Drain Output Analysis",
      subType: "Frank Blood (>100 mL/hr) • Bright Green Bile • Milky Chyle (Triglycerides >110 mg/dL) • Amylase",
      surgicalProfile: "Qualitative biochemical analysis of surgical drain fluid signaling occult anastomotic or vascular disasters.",
      proceduralMechanism: "Drain output reflects internal organ integrity: biliary disruption leaks bile; lymphatic injury leaks triglyceride-rich chyle.",
      clinicalHallmarks: "Blood >100 mL/hr = active hemorrhage; bile = biliary leak; milky fluid with triglycerides >110 mg/dL = chylous leak.",
      highYieldPearls: "Drain fluid with triglycerides >110 mg/dL confirms chylous leak; drain amylase confirms pancreatic fistula."
    },
    {
      id: "clin2-dr-3chamber-chest-tube-drainage",
      name: "3-Chamber Chest Drainage Physics (Collection, 2 cm H2O Water Seal Valve & -20 cm Suction)",
      category: "Pleural Drainage",
      subType: "Chamber 1: Fluid Collection • Chamber 2: 2 cm H2O Water Seal Valve • Chamber 3: -20 cm H2O Suction Column",
      surgicalProfile: "Standard 3-chamber thoracic drainage unit restoring negative intrapleural pressure following thoracotomy.",
      proceduralMechanism: "Water seal prevents atmospheric air from entering the chest; suction chamber regulates negative pressure independently of wall suction.",
      clinicalHallmarks: "Tidaling (fluid rises with inspiration, falls with expiration in spontaneous breathing); massive hemothorax = >1,500 mL initial.",
      highYieldPearls: "The water seal chamber acts as a 2 cm H2O one-way valve; fluid normally oscillates (tidaling) with respiration."
    },
    {
      id: "clin2-dr-air-leak-dynamics-tidaling",
      name: "Air Leak Dynamics & Tidaling (Alveolar-Pleural Fistulas & Dangerous Chest Tube Clamping)",
      category: "Thoracic Complications",
      subType: "Water Seal Continuous Bubbling • Alveolar-Pleural Air Leak • Bronchopleural Fistula • NO CLAMPING",
      surgicalProfile: "Diagnostic interpretation of bubbling in the water seal chamber during thoracic convalescence.",
      proceduralMechanism: "Air escaping from damaged lung parenchyma passes through the pleural tube, producing visible bubbling in the water seal.",
      clinicalHallmarks: "Continuous bubbling = parenchymal air leak. NEVER clamp a bubbling chest tube, as this causes lethal Tension Pneumothorax.",
      highYieldPearls: "Continuous bubbling in the water seal indicates an air leak; NEVER clamp a bubbling chest tube (causes Tension Pneumothorax)."
    }
  ],

  wounds: [
    {
      id: "clin2-wd-expanding-neck-hematoma-airway",
      name: "Expanding Neck Hematoma Airway Emergency (Immediate Bedside Wound Opening & Clot Evacuation)",
      category: "Airway Emergency",
      subType: "Post-Thyroidectomy / Carotid Endarterectomy • Rapidly Enlarging Neck Mass • Stridor • Bedside Evacuation",
      surgicalProfile: "Hyperacute life-threatening surgical emergency following anterior neck surgery causing airway obstruction.",
      proceduralMechanism: "Arterial or venous bleeding beneath the deep cervical fascia rapidly compresses the trachea, causing fatal asphyxia.",
      clinicalHallmarks: "Stridor, respiratory distress, tense neck swelling. Protocol: IMMEDIATELY OPEN THE WOUND AT THE BEDSIDE to relieve compression.",
      highYieldPearls: "An expanding neck hematoma post-thyroidectomy is an AIRWAY EMERGENCY &rarr; immediately open the wound at the bedside."
    },
    {
      id: "clin2-wd-postoperative-seroma-accumulation",
      name: "Postoperative Seroma Accumulation (Subcutaneous Lymphatic/Fat Fluid & Compression Therapy)",
      category: "Dead-Space Fluid",
      subType: "Subcutaneous Dead Space • Liquefied Adipose / Lymphatic Fluid • Mastectomy & Groin Dissections",
      surgicalProfile: "Benign collection of serous lymphatic and liquefied adipose fluid in surgical dead space.",
      proceduralMechanism: "Extensive soft tissue mobilization severs small lymphatic channels and disrupts capillary permeability.",
      clinicalHallmarks: "Fluctuant, non-tender, non-erythematous swelling; manage with compression dressings or sterile needle aspiration if tense.",
      highYieldPearls: "Seromas are sterile collections of liquefied fat and lymph; managed with compression dressings or sterile aspiration."
    },
    {
      id: "clin2-wd-fascial-dehiscence-breakdown",
      name: "Fascial Dehiscence Breakdown (Salmon-Pink Serosanguinous Dressing Soaking on POD 5-8)",
      category: "Wound Breakdown",
      subType: "Fascial Suture Line Failure • Salmon-Pink Fluid Gush • POD 5-8 Timing • Abdominal Binder & OR Repair",
      surgicalProfile: "Separation of the deep musculoaponeurotic fascial layers following abdominal surgery.",
      proceduralMechanism: "Failure of surgical suture holding capacity or patient tissue integrity under increased intra-abdominal pressure.",
      clinicalHallmarks: "Pathognomonic sign: Sudden gush of clear, salmon-pink serosanguinous peritoneal fluid soaking abdominal dressings.",
      highYieldPearls: "A sudden gush of salmon-pink serosanguinous fluid from an abdominal wound on POD 5-8 is pathognomonic for Fascial Dehiscence."
    },
    {
      id: "clin2-wd-abdominal-visceral-evisceration",
      name: "Abdominal Visceral Evisceration Emergency (Sterile Saline-Soaked Gauze Coverage & Urgent OR Laparotomy)",
      category: "Surgical Emergency",
      subType: "Extrusion of Bowel Loops • Complete Fascial & Skin Breakdown • Moist Saline Gauze • Immediate OR Return",
      surgicalProfile: "Surgical catastrophe where abdominal viscera protrude through a dehisced surgical incision.",
      proceduralMechanism: "Full-thickness fascial and skin disruption allows loops of small intestine to spill onto the anterior abdominal wall.",
      clinicalHallmarks: "Cover immediately with STERILE SALINE-SOAKED GAUZE; keep NPO; DO NOT attempt bedside reduction; transport to OR.",
      highYieldPearls: "For abdominal evisceration: Cover exposed bowel with STERILE SALINE-SOAKED GAUZE, keep NPO, and rush to OR."
    }
  ]
};

interface ClinicalClin2LabViewerProps {
  initialMode?: Clin2LabMode;
  height?: string;
  onNodeSelect?: (node: Clin2LabNode) => void;
}

export default function ClinicalClin2LabViewer({
  initialMode = "preop",
  height = "560px",
  onNodeSelect,
}: ClinicalClin2LabViewerProps) {
  const [activeMode, setActiveMode] = useState<Clin2LabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return CLIN2_LAB_NODES[activeMode] || CLIN2_LAB_NODES.preop;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: Clin2LabNode) => {
    if (isQuizMode && quizTargetNodeId) {
      if (node.id === quizTargetNodeId) {
        setQuizScore((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }));
        setQuizFeedback(`Correct! You identified ${node.name}.`);
        setTimeout(() => nextQuizQuestion(), 1500);
      } else {
        setQuizScore((prev) => ({ correct: prev.correct, total: prev.total + 1 }));
        setQuizFeedback(`Incorrect. Find ${currentNodes.find((n) => n.id === quizTargetNodeId)?.name}.`);
      }
    } else {
      setActiveNodeId(node.id);
      if (onNodeSelect) {
        onNodeSelect(node);
      }
    }
  };

  const startQuiz = () => {
    setIsQuizMode(true);
    const randomNode = currentNodes[Math.floor(Math.random() * currentNodes.length)];
    setQuizTargetNodeId(randomNode.id);
    setQuizFeedback(null);
  };

  const nextQuizQuestion = () => {
    const randomNode = currentNodes[Math.floor(Math.random() * currentNodes.length)];
    setQuizTargetNodeId(randomNode.id);
    setQuizFeedback(null);
  };

  const toggleQuizMode = () => {
    if (!isQuizMode) {
      startQuiz();
    } else {
      setIsQuizMode(false);
      setQuizTargetNodeId(null);
      setQuizFeedback(null);
    }
  };

  const quizTargetNode = useMemo(() => {
    return currentNodes.find((n) => n.id === quizTargetNodeId) || null;
  }, [currentNodes, quizTargetNodeId]);

  return (
    <div
      className={styles.container}
      style={{ height: isFullscreen ? "100vh" : "auto" }}
    >
      {/* Top Header Bar */}
      <div className={styles.headerBar}>
        <div className={styles.titleArea}>
          <span className={styles.modeBadge}>
            <Scissors size={14} /> CLIN-302
          </span>
          <span className={styles.titleText}>
            {activeMode === "preop" && "Preoperative Risk Stratification: RCRI Lee Criteria, ASA Physical Status & METs"}
            {activeMode === "fever" && "Postoperative Fever Differential: The 5 Ws (Wind, Water, Wound, Walking, Wonder) & MH"}
            {activeMode === "drains" && "Surgical Drains & Chest Tube Physics: Closed Suction (JP) & 3-Chamber Water Seal"}
            {activeMode === "wounds" && "Acute Wound Complications: Neck Hematoma, Seroma, Fascial Dehiscence & Evisceration"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Surgery Postings Quiz"}
          </button>

          <button
            className={styles.btn}
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className={styles.mainLayout}>
        {/* Left Side: Interactive Lab Workspaces */}
        <div className={styles.labCanvas}>
          {/* Quiz Prompt Banner */}
          {isQuizMode && quizTargetNode && (
            <div className={styles.quizBanner}>
              <div>
                <div className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  Surgical Care Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Perioperative Principle: {quizTargetNode.clinicalHallmarks}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-purple-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-purple-950 text-xs rounded border border-purple-700 text-purple-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: Preoperative Risk */}
          {activeMode === "preop" && (
            <div className={styles.surgCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse size={14} /> Perioperative Cardiac Risk &amp; Medication Management
                </span>
                <span className="text-[11px] text-slate-400">RCRI Lee Criteria &bull; ASA I-VI &bull; &ge;4 METs &bull; SGLT2i euDKA</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Revised Cardiac Risk Index (RCRI)</div>
                  <div className="text-slate-300 mt-1">6 predictors: High-risk surgery, ischemic heart disease, congestive heart failure, stroke/TIA, insulin diabetes, creatinine &gt;2.0 mg/dL. Functional capacity &ge;4 METs permits surgery without stress testing.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Perioperative Medication Rules</div>
                  <div className="text-slate-300 mt-1">Continue beta-blockers/statins; HOLD ACE inhibitors on morning of surgery (prevents vasoplegic hypotension); HOLD SGLT2 inhibitors 3-4 days prior (prevents euglycemic DKA); hold DOACs 48-72h.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Postoperative Fever */}
          {activeMode === "fever" && (
            <div className={styles.surgCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Thermometer size={14} /> The Chronological 5 Ws of Postoperative Fever
                </span>
                <span className="text-[11px] text-slate-400">Wind &bull; Water &bull; Wound &bull; Walking &bull; Wonder Drugs &bull; MH</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Postoperative Fever Timeline</div>
                  <div className="text-slate-300 mt-1">POD 1-2: Wind (Atelectasis &rarr; incentive spirometry). POD 3: Water (UTI &rarr; pull Foley). POD 5: Wound (Surgical site infection &rarr; open incision and drain). POD 7-10: Walking (DVT/PE &rarr; anticoagulation).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Malignant Hyperthermia (Intraoperative)</div>
                  <div className="text-slate-300 mt-1">Triggered by volatile anesthetics/succinylcholine (RYR1 mutation). Sudden rise in EtCO2, masseter spasm, extreme fever. Stop triggers, hyperventilate with 100% O2, give IV Dantrolene 2.5 mg/kg.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Surgical Drains & Chest Tubes */}
          {activeMode === "drains" && (
            <div className={styles.surgCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplet size={14} /> Closed-Suction Drains &amp; 3-Chamber Chest Physics
                </span>
                <span className="text-[11px] text-slate-400">JP Bulbs &bull; Output &lt;30 mL/24h &bull; Water Seal &bull; Air Leak</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Closed-Suction JP &amp; Blake Drains</div>
                  <div className="text-slate-300 mt-1">Compressed silicone bulbs exert negative suction to evacuate dead space. Remove when serosanguinous output drops to &lt;30 mL/24h. Fluid with triglycerides &gt;110 mg/dL confirms chylous leak.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">3-Chamber Chest Tube System</div>
                  <div className="text-slate-300 mt-1">Water seal acts as 2 cm H2O one-way valve with respiratory tidaling. Continuous bubbling indicates an active air leak (alveolar-pleural fistula); NEVER clamp a bubbling chest tube.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Acute Wound Complications */}
          {activeMode === "wounds" && (
            <div className={styles.surgCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Neck Hematoma, Fascial Dehiscence &amp; Evisceration
                </span>
                <span className="text-[11px] text-slate-400">Expanding Hematoma &bull; Seroma &bull; Salmon-Pink Fluid &bull; Evisceration</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Expanding Neck Hematoma &amp; Fascial Dehiscence</div>
                  <div className="text-slate-300 mt-1">Post-thyroidectomy expanding neck hematoma: AIRWAY EMERGENCY &rarr; immediately open wound at bedside. Fascial dehiscence: Sudden gush of salmon-pink serosanguinous fluid on POD 5-8.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Abdominal Visceral Evisceration Emergency</div>
                  <div className="text-slate-300 mt-1">Extrusion of bowel loops through incision: Immediately cover with STERILE SALINE-SOAKED GAUZE, place in low Fowler with knees flexed, keep NPO, give IV fluids, and transfer to OR for emergent laparotomy.</div>
                </div>
              </div>
            </div>
          )}

          {/* Node Selection Grid */}
          <div className={styles.nodeGrid}>
            {currentNodes.map((node) => {
              const isSelected = activeNode.id === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  className={`${styles.nodeCard} ${isSelected ? styles.nodeCardSelected : ""}`}
                >
                  <div className={styles.nodeHeader}>
                    <span className={styles.categoryBadge}>{node.category}</span>
                  </div>

                  <div>
                    <div className={styles.nodeTitle}>{node.name}</div>
                    <div className={styles.nodeSub}>{node.subType}</div>
                  </div>

                  <div className="text-[11px] text-slate-300 font-medium bg-slate-950/60 p-2 rounded border border-slate-800">
                    <span className="text-purple-400 font-bold">Surgical:</span> {node.surgicalProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect Surgical Protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Clinical Postings II Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Surgery Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Surgical Protocol / Entity</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Surgical Pathophysiology</div>
            <div className="text-xs text-purple-300 font-semibold">{activeNode.surgicalProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.proceduralMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Operations</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Surgical Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("preop")}
          className={`${styles.modeTab} ${activeMode === "preop" ? styles.modeTabActive : ""}`}
        >
          🏥 1. Preoperative Risk
        </button>
        <button
          onClick={() => setActiveMode("fever")}
          className={`${styles.modeTab} ${activeMode === "fever" ? styles.modeTabActive : ""}`}
        >
          🌡️ 2. Postoperative Fever (5 Ws)
        </button>
        <button
          onClick={() => setActiveMode("drains")}
          className={`${styles.modeTab} ${activeMode === "drains" ? styles.modeTabActive : ""}`}
        >
          💧 3. Drains &amp; Chest Tubes
        </button>
        <button
          onClick={() => setActiveMode("wounds")}
          className={`${styles.modeTab} ${activeMode === "wounds" ? styles.modeTabActive : ""}`}
        >
          ⚠️ 4. Wound Emergencies
        </button>
      </div>
    </div>
  );
}
