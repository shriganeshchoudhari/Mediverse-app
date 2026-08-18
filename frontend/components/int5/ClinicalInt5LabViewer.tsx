"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalInt5LabViewer.module.css";
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
  Flame,
  Calculator,
  TrendingUp,
  Gauge,
  Thermometer,
  Shield,
  Crosshair,
  Pill,
  Brain,
  Award,
  Dna,
  HeartPulse,
  Radio,
  TestTube,
  UserCheck,
  Users,
  Activity,
  ClipboardList,
  Wind,
  Zap,
} from "lucide-react";

export type Int5LabMode = "abdomen" | "burns" | "compartment" | "necrotizing";

export interface Int5LabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  proceduralProfile: string;
  proceduralMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const INT5_LAB_NODES: Record<Int5LabMode, Int5LabNode[]> = {
  abdomen: [
    {
      id: "int5-ab-alvarado-appendicitis-score",
      name: "Alvarado Appendicitis Decision Framework (MANTRELS Scoring & Score &ge;7 Surgical Indication)",
      category: "Acute Appendicitis",
      subType: "MANTRELS: RLQ Tenderness (2) + Leukocytosis (2) + Others (1 each) &bull; Score &ge;7 &rarr; Urgent OR Surgery",
      proceduralProfile: "Clinical scoring system predicting the likelihood of acute luminal appendiceal inflammation.",
      proceduralMechanism: "Fecalith obstruction causes luminal distension, mucosal ischemia, bacterial invasion, and perforation.",
      clinicalHallmarks: "Migration of pain to RLQ, anorexia, vomiting, McBurney tenderness (2), rebound, fever, leukocytosis (2), left shift.",
      highYieldPearls: "Alvarado score &ge;7 strongly predicts acute appendicitis and justifies urgent laparoscopic appendectomy."
    },
    {
      id: "int5-ab-tokyo-guidelines-cholecystitis",
      name: "Tokyo Guidelines for Acute Cholecystitis (Local/Systemic Criteria & Early Laparoscopic Cholecystectomy &le;72h)",
      category: "Acute Cholecystitis",
      subType: "Murphy's Sign + Fever/WBC + Gallbladder Wall &ge;4 mm &bull; Early Lap Chole &le;72h of Symptom Onset",
      proceduralProfile: "Systematic international criteria for diagnosing and grading acute calculus gallbladder inflammation.",
      proceduralMechanism: "Cystic duct gallstone impaction increases intraluminal pressure, compromising cystic artery perfusion.",
      clinicalHallmarks: "Positive Murphy sign + leukocytosis/CRP + ultrasound showing wall thickening &ge;4 mm, pericholecystic fluid.",
      highYieldPearls: "Tokyo Guidelines mandate early laparoscopic cholecystectomy within 72 hours of symptom onset for acute cholecystitis."
    },
    {
      id: "int5-ab-sbo-strangulation-red-flags",
      name: "Small Bowel Obstruction & Strangulation Red Flags (Adhesive SBO, Mesenteric Whirl Sign & Closed-Loop Laparotomy)",
      category: "Bowel Obstruction",
      subType: "Adhesions (60-70%) &bull; Whirl Sign &bull; Bowel Wall >3 mm &bull; Pneumatosis Intestinalis &bull; Emergent Laparotomy",
      proceduralProfile: "Emergency triage differentiating uncomplicated adhesive obstruction from strangulated closed-loop ischemia.",
      proceduralMechanism: "Closed-loop obstruction creates simultaneous afferent/efferent limb occlusion with rapid venous infarction.",
      clinicalHallmarks: "Continuous severe pain, mesenteric swirl on CT, bowel wall thickening >3 mm, pneumatosis; emergent laparotomy.",
      highYieldPearls: "Closed-loop SBO with mesenteric whirl sign or pneumatosis intestinalis requires emergent exploratory laparotomy."
    },
    {
      id: "int5-ab-peritonitis-perforated-viscus",
      name: "Peritonitis & Perforated Viscus Resuscitation (Rigid Abdomen, Subdiaphragmatic Free Air & Emergent OR)",
      category: "Perforated Viscus",
      subType: "Involuntary Guarding &bull; Board-like Rigidity &bull; Pneumoperitoneum under Diaphragm &bull; Emergent Laparotomy",
      proceduralProfile: "Critical triage of generalized peritonitis secondary to gastroduodenal ulcer or colonic perforation.",
      proceduralMechanism: "Extravasation of gastrointestinal succus and enteric bacteria triggers chemical and bacterial peritonitis.",
      clinicalHallmarks: "Board-like rigid abdomen, absent bowel sounds, subdiaphragmatic crescentic free air on erect chest X-ray.",
      highYieldPearls: "Subdiaphragmatic free air with generalized peritonitis mandates immediate fluid resuscitation and emergent laparotomy."
    }
  ],

  burns: [
    {
      id: "int5-bu-rule-of-nines-tbsa-calculator",
      name: "Wallace Rule of Nines %TBSA Burn Surface Calculator (Anatomical Grid & First-Degree Superficial Exclusion)",
      category: "Rule of Nines",
      subType: "Head (9%) &bull; Ant Torso (18%) &bull; Post Torso (18%) &bull; Each Arm (9%) &bull; Each Leg (18%) &bull; 1st-Degree Excluded",
      proceduralProfile: "Standardized rapid anatomical estimation of partial- and full-thickness burn extent in adult patients.",
      proceduralMechanism: "Extensive skin thermal injury causes microvascular hyperpermeability and massive systemic fluid shifts.",
      clinicalHallmarks: "Calculate only partial-thickness (blisters) and full-thickness burns; strictly exclude 1st-degree erythema.",
      highYieldPearls: "Wallace Rule of Nines: Head 9%, Torso 36%, Arms 18%, Legs 36%, Perineum 1%; 1st-degree erythema is EXCLUDED."
    },
    {
      id: "int5-bu-parkland-fluid-formula",
      name: "The Parkland Fluid Resuscitation Formula (4 mL &times; kg &times; %TBSA with 50% Infused in First 8 Hours)",
      category: "Parkland Formula",
      subType: "4 mL &times; Body Weight (kg) &times; %TBSA (Lactated Ringer's) &bull; 50% First 8h FROM INJURY TIME &bull; 50% Next 16h",
      proceduralProfile: "Gold-standard crystalloid resuscitation calculating 24-hour Lactated Ringer's volume for major burns.",
      proceduralMechanism: "Replenishes severe plasma volume loss, restores microvascular perfusion, and prevents burn shock.",
      clinicalHallmarks: "Infuse 50% of calculated volume in the first 8 hours starting from the time of burn injury, not hospital arrival.",
      highYieldPearls: "Parkland Formula: 4 mL x kg x %TBSA; 50% given in first 8 hours from time of injury, remainder over next 16 hours."
    },
    {
      id: "int5-bu-urine-output-titration-goals",
      name: "Hourly Urine Output Titration Benchmarks (Target 0.5-1.0 mL/kg/hr in Adults & Pediatric Fluid Adjustments)",
      category: "Urine Output Goals",
      subType: "Adults: 0.5-1.0 mL/kg/hr &bull; Pediatrics: 1.0-2.0 mL/kg/hr &bull; Electrical Burns: 1.5-2.0 mL/kg/hr (Myoglobinuria)",
      proceduralProfile: "Primary physiological end-point used to titrate hourly crystalloid infusion up or down by 10-20%.",
      proceduralMechanism: "Urine output reflects adequate renal cortical perfusion and effective circulating blood volume.",
      clinicalHallmarks: "Titrate IV Lactated Ringer's to maintain urine output at 0.5-1.0 mL/kg/hr in adults (1.5-2.0 in electrical burns).",
      highYieldPearls: "Target urine output in adult thermal burns is 0.5-1.0 mL/kg/hr (1.5-2.0 mL/kg/hr for electrical burns with myoglobinuria)."
    },
    {
      id: "int5-bu-burn-shock-fluid-creep",
      name: "Burn Shock Prevention & Fluid Creep Avoidance (Abdominal Compartment Prevention & Inhalation Injury)",
      category: "Resuscitation Safety",
      subType: "Fluid Creep Warning (>250 mL/kg in 24h) &bull; Abdominal Compartment Syndrome &bull; Bronchoscopy for Inhalation",
      proceduralProfile: "Monitoring for iatrogenic over-resuscitation and airway compromise in severe thermal trauma.",
      proceduralMechanism: "Excessive crystalloid infusion causes diffuse tissue edema, elevating intracompartmental pressures.",
      clinicalHallmarks: "Monitor bladder pressures if fluids exceed 250 mL/kg/24h; intubate early for stridor, carbonaceous sputum.",
      highYieldPearls: "Fluid creep (>250 mL/kg/24h) leads to abdominal compartment syndrome; titrate fluids strictly to urine output."
    }
  ],

  compartment: [
    {
      id: "int5-co-clinical-6-ps-detection",
      name: "Clinical Detection of the 6 Ps (Pain on Passive Stretch & Compartment Tenseness)",
      category: "The 6 Ps of ACS",
      subType: "1. Pain Out of Proportion &bull; 2. Pain on Passive Stretch (Most Reliable) &bull; Pulselessness is LATE",
      proceduralProfile: "Early bedside physical examination protocol detecting acute osteofascial compartment ischemia.",
      proceduralMechanism: "Muscle swelling within unyielding fascial envelopes compresses capillary beds, causing ischemic pain.",
      clinicalHallmarks: "Excruciating pain with passive toe/ankle dorsiflexion and tense, woody calf compartments; pulses remain intact.",
      highYieldPearls: "Pain out of proportion and pain on passive stretch are the earliest, most sensitive signs; pulses are intact early."
    },
    {
      id: "int5-co-stryker-manometry-delta-p",
      name: "Stryker Intracompartmental Manometry (Delta Pressure DBP - Pcomp &le; 30 mmHg Tissue Ischemia)",
      category: "Delta Pressure",
      subType: "Absolute Pcomp >30 mmHg OR Delta P (DBP - Pcomp) &le; 30 mmHg &bull; Direct Manometry Needle",
      proceduralProfile: "Objective pressure measurement confirming compartment syndrome in obtunded or equivocal patients.",
      proceduralMechanism: "When tissue pressure approaches diastolic pressure (&Delta;P &le; 30 mmHg), capillary perfusion pressure ceases.",
      clinicalHallmarks: "Measure all 4 lower leg compartments; Delta P &le; 30 mmHg confirms tissue ischemia mandating emergent surgery.",
      highYieldPearls: "Delta Pressure = Diastolic BP - Compartment Pressure; &Delta;P &le; 30 mmHg is the diagnostic threshold for emergent fasciotomy."
    },
    {
      id: "int5-co-lower-leg-two-incision-fasciotomy",
      name: "Lower Leg Two-Incision Four-Compartment Fasciotomy (Anterolateral & Posteromedial Decompressive Releases)",
      category: "Emergency Fasciotomy",
      subType: "Anterolateral (Anterior + Lateral) &bull; Posteromedial (Superficial + Deep Posterior) &bull; Retract Saphenous",
      proceduralProfile: "Emergency open surgical decompression of all four osteofascial compartments of the lower extremity.",
      proceduralMechanism: "Longitudinal fascial incisions immediately release elevated intracompartmental pressures, restoring perfusion.",
      clinicalHallmarks: "Perform anterolateral incision (release anterior/lateral) and posteromedial incision (release superficial/deep posterior).",
      highYieldPearls: "Complete lower leg fasciotomy requires two incisions releasing ALL four compartments (anterior, lateral, superficial, deep posterior)."
    },
    {
      id: "int5-co-forearm-thigh-decompressive-releases",
      name: "Forearm & Thigh Decompressive Fasciotomy (Volar Extensile & Lateral Thigh Fascial Releases)",
      category: "Upper Extremity Releases",
      subType: "Volar Extensile (Henry Approach) &bull; Carpal Tunnel Release &bull; Lateral Long Thigh Fascia Lata Release",
      proceduralProfile: "Surgical decompression protocols for forearm compartment syndrome (Volkmann ischemic contracture prevention).",
      proceduralMechanism: "Decompresses superficial and deep flexor compartments of the forearm and median nerve in carpal tunnel.",
      clinicalHallmarks: "Volar curvilinear incision extending across wrist into palm to release carpal tunnel; add dorsal incision if needed.",
      highYieldPearls: "Forearm fasciotomy requires a volar extensile approach with routine carpal tunnel decompression to protect the median nerve."
    }
  ],

  necrotizing: [
    {
      id: "int5-ne-lrinec-score-calculator",
      name: "LRINEC Score Calculator for Necrotizing Fasciitis (CRP, WBC, Hemoglobin, Sodium & Creatinine Cutoffs)",
      category: "LRINEC Scoring",
      subType: "CRP &ge;150 (4) + WBC >25k (2) + Hb <11 (2) + Na <135 (2) + Cr >1.6 (2) + Glucose >180 (1) &bull; Score &ge;6",
      proceduralProfile: "Laboratory risk stratification tool distinguishing necrotizing fasciitis from non-necrotizing soft tissue infections.",
      proceduralMechanism: "Massive fascial necrosis and systemic cytokine storms produce profound inflammation, leukocytosis, and hyponatremia.",
      clinicalHallmarks: "LRINEC score &ge;6 indicates high risk of necrotizing fasciitis (&ge;8 has >90% positive predictive value).",
      highYieldPearls: "LRINEC Score &ge;6 strongly suggests Necrotizing Soft Tissue Infection; score &ge;8 has >90% positive predictive value."
    },
    {
      id: "int5-ne-emergency-radical-or-debridement",
      name: "Emergency Radical OR Surgical Debridement (Necrotic Fascial Resection & Finger Sweep Test)",
      category: "OR Debridement",
      subType: "Immediate OR Transfer &bull; Dishwater Fluid &bull; Lack of Fascial Resistance ('Finger Test') &bull; Resect to Bleeding Tissue",
      proceduralProfile: "The definitive life-saving surgical intervention for fulminant necrotizing soft tissue infections.",
      proceduralMechanism: "Radical excision of all necrotic, non-bleeding fascia and subcutaneous tissue halts progressive tissue destruction.",
      clinicalHallmarks: "Take patient immediately to the operating room; positive finger sweep test (lack of resistance) confirms diagnosis.",
      highYieldPearls: "Immediate radical surgical debridement in the operating room is the single most important determinant of survival in necrotizing fasciitis."
    },
    {
      id: "int5-ne-clindamycin-toxin-shutdown",
      name: "Antitoxin Clindamycin & Triple Antibiotic Therapy (50S Ribosomal Toxin Shutdown & Broad-Spectrum Coverage)",
      category: "Antitoxin Therapy",
      subType: "Vancomycin (MRSA) + Pip-Tazo (Gram-Neg/Anaerobes) + Clindamycin 900 mg q8h (Toxin Shutdown)",
      proceduralProfile: "Empiric antimicrobial triad neutralizing bacterial pathogens and shutting down exotoxin synthesis.",
      proceduralMechanism: "Clindamycin binds the 50S ribosomal subunit, shutting down streptococcal pyrogenic exotoxin (SpeA/B/C) production.",
      clinicalHallmarks: "Initiate IV Vancomycin + Piperacillin-Tazobactam + IV Clindamycin 900 mg q8h immediately upon suspicion.",
      highYieldPearls: "Clindamycin (900 mg IV q8h) is essential in necrotizing fasciitis to shut down bacterial protein synthesis and toxin production."
    },
    {
      id: "int5-ne-fourniers-gangrene-perineal-sepsis",
      name: "Fournier's Gangrene Perineal Debridement (Perineal Sepsis, Urological Consultation & Fecal Diversion)",
      category: "Fournier's Gangrene",
      subType: "Type I Polymicrobial NSTI &bull; Scrotal, Perineal & Perianal Fascia &bull; Urgent Radical OR Debridement",
      proceduralProfile: "Life-threatening necrotizing fasciitis of the perineum, scrotum, and perianal regions.",
      proceduralMechanism: "Synergistic aerobic and anaerobic bacterial flora spread along Colles', Dartos', and Scarpa's fascia.",
      clinicalHallmarks: "Scrotal/perineal swelling, crepitus, foul-smelling discharge; urgent debridement with urological consultation.",
      highYieldPearls: "Fournier's gangrene is a urological/surgical emergency requiring immediate radical perineal and scrotal debridement."
    }
  ]
};

interface ClinicalInt5LabViewerProps {
  initialMode?: Int5LabMode;
  height?: string;
  onNodeSelect?: (node: Int5LabNode) => void;
}

export default function ClinicalInt5LabViewer({
  initialMode = "abdomen",
  height = "560px",
  onNodeSelect,
}: ClinicalInt5LabViewerProps) {
  const [activeMode, setActiveMode] = useState<Int5LabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return INT5_LAB_NODES[activeMode] || INT5_LAB_NODES.abdomen;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: Int5LabNode) => {
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
            <Scissors size={14} /> INT-505
          </span>
          <span className={styles.titleText}>
            {activeMode === "abdomen" && "Acute Abdomen Triage: Alvarado Score (Appendicitis) & Tokyo Guidelines (Cholecystitis)"}
            {activeMode === "burns" && "Thermal Burns: Rule of Nines (%TBSA), Parkland Formula & Urine Output Titration"}
            {activeMode === "compartment" && "Acute Compartment Syndrome: The 6 Ps, Stryker Manometry & Emergent Fasciotomy"}
            {activeMode === "necrotizing" && "Necrotizing Soft Tissue Infections: LRINEC Score (>=6) & Clindamycin Toxin Shutdown"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Trauma & Surgery Quiz"}
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
                <div className="text-xs font-bold text-red-300 uppercase tracking-wider">
                  Surgical &amp; Trauma Call Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Surgical Protocol: {quizTargetNode.clinicalHallmarks}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-red-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-red-950 text-xs rounded border border-red-700 text-red-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: Acute Abdomen */}
          {activeMode === "abdomen" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Scissors size={14} /> Acute Abdomen Surgical Triage Protocols
                </span>
                <span className="text-[11px] text-slate-400">Alvarado &ge;7 &bull; Tokyo TG18 &le;72h &bull; SBO Whirl Sign &bull; Free Air</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">Alvarado Appendicitis Scoring</div>
                  <div className="text-slate-300 mt-1">MANTRELS score: RLQ tenderness (2) + Leukocytosis (2) + Migration, Anorexia, Nausea, Rebound, Fever, Left shift (1 each). Total &ge;7 indicates high probability requiring urgent surgery.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">Tokyo Guidelines &amp; SBO Strangulation</div>
                  <div className="text-slate-300 mt-1">Acute cholecystitis (Murphy sign + fever/WBC + gallbladder wall &ge;4 mm) mandates early lap chole &le;72h. Closed-loop SBO with mesenteric whirl or pneumatosis requires emergent laparotomy.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Burns */}
          {activeMode === "burns" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={14} /> Thermal Burns &amp; Parkland Resuscitation
                </span>
                <span className="text-[11px] text-slate-400">Rule of Nines &bull; 4 mL &times; kg &times; %TBSA &bull; 50% in First 8h &bull; UO 0.5-1.0 mL/kg/hr</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">Wallace Rule of Nines &amp; Parkland Formula</div>
                  <div className="text-slate-300 mt-1">Head 9%, Torso 36%, Arms 18%, Legs 36%, Perineum 1% (exclude 1st-degree). Total LR volume = 4 mL &times; kg &times; %TBSA. Give 50% in first 8 hours from burn time, remainder over next 16 hours.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">Hourly Urine Output Titration</div>
                  <div className="text-slate-300 mt-1">Titrate crystalloid infusion hourly to achieve target urine output: 0.5-1.0 mL/kg/hr in adults, 1.0-2.0 mL/kg/hr in children, and 1.5-2.0 mL/kg/hr in electrical burns with myoglobinuria.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Compartment Syndrome */}
          {activeMode === "compartment" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Acute Extremity Compartment Syndrome
                </span>
                <span className="text-[11px] text-slate-400">The 6 Ps &bull; Pain on Passive Stretch &bull; &Delta;P &le;30 mmHg &bull; Two-Incision 4-Compartment</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">The 6 Ps &amp; Stryker Manometry</div>
                  <div className="text-slate-300 mt-1">Pain out of proportion and pain with passive muscular stretch are earliest and most sensitive. Distal pulses are intact early! Delta pressure (&Delta;P = DBP - Pcomp) &le;30 mmHg confirms tissue ischemia.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">Two-Incision Four-Compartment Fasciotomy</div>
                  <div className="text-slate-300 mt-1">Lower leg requires anterolateral incision (decompressing anterior and lateral compartments) and posteromedial incision (decompressing superficial and deep posterior compartments).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Necrotizing Fasciitis */}
          {activeMode === "necrotizing" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Necrotizing Soft Tissue Infections &amp; Sepsis
                </span>
                <span className="text-[11px] text-slate-400">LRINEC &ge;6 &bull; Finger Sweep Test &bull; Radical OR Debridement &bull; Clindamycin Toxin Shutdown</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">LRINEC Scoring System</div>
                  <div className="text-slate-300 mt-1">CRP &ge;150 (4) + WBC >25k (2) + Hb &lt;11 (2) + Na &lt;135 (2) + Cr >1.6 (2) + Glucose >180 (1). Score &ge;6 indicates high suspicion of necrotizing fasciitis (&ge;8 has &gt;90% PPV).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">Emergency OR Debridement &amp; Clindamycin</div>
                  <div className="text-slate-300 mt-1">Immediate radical surgical debridement in the OR is the primary survival determinant. Initiate IV Vancomycin + Piperacillin-Tazobactam + IV Clindamycin 900 mg q8h for toxin shutdown.</div>
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
                    <span className="text-red-400 font-bold">Protocol:</span> {node.proceduralProfile}
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

        {/* Right Side: High-Yield Consult Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
              Trauma Call Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Surgical Protocol</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Surgical Pathophysiology</div>
            <div className="text-xs text-red-300 font-semibold">{activeNode.proceduralProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.proceduralMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Actions</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Trauma Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("abdomen")}
          className={`${styles.modeTab} ${activeMode === "abdomen" ? styles.modeTabActive : ""}`}
        >
          🔪 1. Acute Abdomen
        </button>
        <button
          onClick={() => setActiveMode("burns")}
          className={`${styles.modeTab} ${activeMode === "burns" ? styles.modeTabActive : ""}`}
        >
          🔥 2. Burns &amp; Parkland
        </button>
        <button
          onClick={() => setActiveMode("compartment")}
          className={`${styles.modeTab} ${activeMode === "compartment" ? styles.modeTabActive : ""}`}
        >
          🩺 3. Compartment &amp; OR
        </button>
        <button
          onClick={() => setActiveMode("necrotizing")}
          className={`${styles.modeTab} ${activeMode === "necrotizing" ? styles.modeTabActive : ""}`}
        >
          ⚠️ 4. Necrotizing Sepsis
        </button>
      </div>
    </div>
  );
}
