"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalSurgeryAdvLabViewer.module.css";
import {
  Activity,
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
  Scissors,
  Zap,
  Award,
  Flame,
  Dna,
  HeartPulse,
  Radio,
  TestTube,
} from "lucide-react";

export type SurgeryLabMode = "acuteAbdomen" | "lapBiliary" | "giBleed" | "surgicalOncology";

export interface SurgeryLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  surgicalProfile: string;
  operativeMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const SURGERY_LAB_NODES: Record<SurgeryLabMode, SurgeryLabNode[]> = {
  acuteAbdomen: [
    {
      id: "surg-sbo-adhesions",
      name: "Adhesive Small Bowel Obstruction (SBO Transition Point & Decompression)",
      category: "Bowel Obstruction",
      subType: "Postoperative Adhesions (>60%) • Dilated Loops >3 cm • Air-Fluid Levels • Transition Point on CT",
      surgicalProfile: "Mechanical extrinsic compression of small intestine causing proximal luminal dilatation and hyperperistalsis.",
      operativeMechanism: "Post-surgical fibrous bands tether bowel loops; unremitting distension leads to third-spacing and dehydration.",
      clinicalHallmarks: "Colicky abdominal pain, bilious emesis, obstipation; trial of NG tube suction and IV hydration if no strangulation.",
      highYieldPearls: "Over 60% of SBOs are due to postoperative adhesions; CT with IV/oral contrast confirms transition point."
    },
    {
      id: "surg-sbo-strangulation",
      name: "Closed-Loop Strangulation Ischemia (Peritonitis, Elevated Lactate & Laparotomy)",
      category: "Surgical Emergency",
      subType: "Fever + Tachycardia + Localized Peritonitis + Leukocytosis + Hyperlactatemia • Mandatory Emergency Laparotomy",
      surgicalProfile: "Arterial and venous vascular compromise to an obstructed closed loop of bowel leading to transmural infarction.",
      operativeMechanism: "Twisting or tight hernia ring occludes mesenteric venous outflow then arterial inflow; rapid bacterial translocation.",
      clinicalHallmarks: "Severe constant pain out of proportion, rebound tenderness, high fever, WBC >15,000, metabolic acidosis with lactate >2.5.",
      highYieldPearls: "Signs of strangulation (fever, peritonitis, tachycardia, leukocytosis, elevated lactate) mandate immediate laparotomy."
    },
    {
      id: "surg-sigmoid-volvulus",
      name: "Sigmoid Volvulus Derotation ('Coffee Bean' Loop & Elective Resection)",
      category: "Colonic Obstruction",
      subType: "Inverted U-Shaped Loop ('Coffee Bean' Sign) • Elderly / Institutionalized • Rigid Sigmoidoscopy Decompression",
      surgicalProfile: "Torsion of redundant, elongated sigmoid colon around its narrow mesenteric pedicle.",
      operativeMechanism: "Closed-loop obstruction with massive colonic distension; high risk of gangrene if untreated.",
      clinicalHallmarks: "Gradual massive abdominal distension, tympany; initial management is sigmoidoscopic derotation + elective sigmoidectomy.",
      highYieldPearls: "Sigmoid volvulus classic 'coffee bean' sign on AXR; decompress with sigmoidoscopy, then resect semi-electively."
    },
    {
      id: "surg-ogilvie-neostigmine",
      name: "Acute Colonic Pseudo-Obstruction (Ogilvie Syndrome Cecal Dilatation & Neostigmine)",
      category: "Functional Obstruction",
      subType: "Massive Cecal Dilatation (>10-12 cm) • No Mechanical Block • IV Neostigmine (2 mg) / Colonoscopy",
      surgicalProfile: "Severe autonomic dysregulation and sympathetic overactivity suppressing colonic peristalsis in hospitalized patients.",
      operativeMechanism: "Non-obstructive massive dilatation of the cecum and ascending colon; perforation risk spikes when cecal diameter >12 cm.",
      clinicalHallmarks: "Painless abdominal distension in post-op/ICU patients; IV Neostigmine stimulates muscarinic receptors causing rapid motility.",
      highYieldPearls: "In Ogilvie syndrome with cecal diameter >10-12 cm, IV Neostigmine (with atropine at bedside) produces prompt evacuation."
    }
  ],

  lapBiliary: [
    {
      id: "surg-cvs-three-criteria",
      name: "Strasberg Critical View of Safety (Three Mandatory Dissection Criteria)",
      category: "Surgical Safety",
      subType: "Hepatocystic Triangle Cleared • Lower 1/3 GB Detached from Liver Bed • Only 2 Structures Entering GB",
      surgicalProfile: "The gold-standard anatomical target to eliminate iatrogenic common bile duct misidentification injuries.",
      operativeMechanism: "Requires complete clearing of fat and fibrous tissue from Calot's triangle and exposure of the cystic plate.",
      clinicalHallmarks: "DO NOT clip or transect any tubular structure until all 3 CVS criteria are 100% achieved and verified by surgical pause.",
      highYieldPearls: "The Critical View of Safety requires: (1) Clear Calot's, (2) Detach lower 1/3 GB, (3) See only 2 structures entering GB."
    },
    {
      id: "surg-calot-dissection",
      name: "Hepatocystic Calot Triangle Clearance (Cystic Artery & Duct Isolation)",
      category: "Biliary Anatomy",
      subType: "Calot's Triangle: Cystic Duct + Common Hepatic Duct + Liver Inferior Margin • Cystic Artery Bounded Inside",
      surgicalProfile: "Meticulous blunt and electrocautery dissection isolating the cystic duct and cystic artery independently.",
      operativeMechanism: "Prevents confusing the common bile duct or aberrant right hepatic artery with the cystic duct.",
      clinicalHallmarks: "Dissection must stay close to the gallbladder infundibulum to avoid traction injury on the main biliary tree.",
      highYieldPearls: "Traction on the infundibulum must be anterolateral to open the hepatocystic triangle and prevent tenting of the CBD."
    },
    {
      id: "surg-strasberg-type-e",
      name: "Strasberg Type E Major BDI (Common Bile Duct Transection & Roux-en-Y)",
      category: "Biliary Complication",
      subType: "Complete Circumferential Transection of Main Duct (E1-E5) • Obstructive Jaundice • Roux-en-Y Hepaticojejunostomy",
      surgicalProfile: "Catastrophic misidentification where the common bile duct is mistaken for the cystic duct, clipped, and transected.",
      operativeMechanism: "Total interruption of biliary drainage causing acute jaundice, biloma, cholangitis, and secondary biliary cirrhosis.",
      clinicalHallmarks: "Postoperative progressive jaundice, elevated alkaline phosphatase/bilirubin; definitive repair is Roux-en-Y Hepaticojejunostomy.",
      highYieldPearls: "Major bile duct transections (Strasberg E) require tension-free, well-vascularized Roux-en-Y Hepaticojejunostomy."
    },
    {
      id: "surg-tokyo-cholecystitis",
      name: "Tokyo Guidelines Acute Cholecystitis (Early Lap Cholecystectomy within 72 Hours)",
      category: "Biliary Infection",
      subType: "Grade I (Mild) / Grade II (Moderate) / Grade III (Organ Dysfunction) • Early Lap Chole <=72h vs PTGBD",
      surgicalProfile: "Calculous cystic duct impaction causing chemical and bacterial gallbladder wall inflammation and edema.",
      operativeMechanism: "Bacterial superinfection by E. coli/Klebsiella; progression to gangrenous or emphysematous cholecystitis.",
      clinicalHallmarks: "Positive sonographic Murphy sign, gallbladder wall thickening >4mm, pericholecystic fluid; early surgery is DOC.",
      highYieldPearls: "Early laparoscopic cholecystectomy within 72 hours of symptom onset reduces hospital stay and conversion to open."
    }
  ],

  giBleed: [
    {
      id: "surg-forrest-ia-spurting",
      name: "Forrest Class Ia Active Spurting Bleed (Dual Hemostasis: Epinephrine & Thermal Clips)",
      category: "Peptic Bleeding",
      subType: "Active Arterial Jet Hemorrhage • >90% Rebleeding Risk • Epinephrine Injection + Hemoclips / Thermal Coagulation",
      surgicalProfile: "Arterial peptic ulcer erosion into a major submucosal artery (e.g., gastroduodenal artery in posterior duodenal bulb).",
      operativeMechanism: "High-pressure arterial jet prevents platelet plug stabilization; massive upper GI hematemesis and hemorrhagic shock.",
      clinicalHallmarks: "Active pulsatile spurting on endoscopy; requires dual endoscopic modality (epinephrine + mechanical clip) + IV PPI infusion.",
      highYieldPearls: "Forrest Ia lesions have >90% rebleeding risk; mandatory dual endoscopic hemostasis + high-dose IV PPI infusion (80 mg + 8 mg/h)."
    },
    {
      id: "surg-forrest-iia-vessel",
      name: "Forrest Class IIa Non-Bleeding Visible Vessel (High Rebleeding Risk & Endoscopic Therapy)",
      category: "Peptic Bleeding",
      subType: "Raised Pigmented Protuberance in Ulcer Base • ~40-50% Rebleeding Risk • Endoscopic Dual Therapy Indicated",
      surgicalProfile: "Pseudoaneurysmal plug or exposed arterial stump projecting from the ulcer crater floor.",
      operativeMechanism: "Vessel wall remains fragile and exposed to acid-peptic digestion; clot lysis triggers catastrophic secondary hemorrhage.",
      clinicalHallmarks: "Visible pigmented or translucent vessel mound; dual endoscopic therapy significantly lowers recurrence and mortality.",
      highYieldPearls: "Forrest IIa (visible vessel) carries ~50% rebleeding risk; endoscopic dual therapy is mandatory before discharge."
    },
    {
      id: "surg-peptic-perforation-pneumo",
      name: "Peptic Ulcer Perforation Pneumoperitoneum (Subdiaphragmatic Free Air & Board-Like Rigidity)",
      category: "Peritoneal Emergency",
      subType: "Sudden Epigastric Agony • Board-Like Involuntary Rigidity • Subdiaphragmatic Free Crescent Air on Upright CXR",
      surgicalProfile: "Transmural acid-peptic necrosis of the anterior duodenal wall releasing gastric juices into the peritoneal cavity.",
      operativeMechanism: "Severe chemical peritonitis rapidly transitioning to bacterial peritonitis and septic shock within 6-12 hours.",
      clinicalHallmarks: "Patient lies motionless; loss of hepatic dullness; upright chest X-ray confirms bilateral subdiaphragmatic pneumoperitoneum.",
      highYieldPearls: "Sudden epigastric pain + board-like abdominal rigidity + free air under diaphragm = perforated peptic ulcer."
    },
    {
      id: "surg-graham-patch-repair",
      name: "Graham Patch Omentopexy Repair (Vascularized Omental Pedicle Peritoneal Washout)",
      category: "Operative Repair",
      subType: "Cellan-Jones / Graham Patch • 3-4 Full-Thickness Sutures • Copious Warm Saline Peritoneal Lavage",
      surgicalProfile: "Gold standard emergency surgical source control for perforated anterior peptic ulcers.",
      operativeMechanism: "A pedicled plug of well-vascularized greater omentum is tied over the perforation to promote biological seal and healing.",
      clinicalHallmarks: "Executed via laparoscopy or exploratory laparotomy; combined with massive peritoneal lavage and subhepatic drainage.",
      highYieldPearls: "Graham patch omentopexy places a viable omental pedicle over the perforation secured with full-thickness sutures."
    }
  ],

  surgicalOncology: [
    {
      id: "surg-breast-slnb-mapping",
      name: "Breast Sentinel Lymph Node Biopsy (Dual Tracer Tc-99m & Isosulfan Blue Mapping)",
      category: "Breast Oncology",
      subType: "Dual Mapping: Technetium-99m Colloids + Isosulfan Blue • Axillary Node Staging • Negative Margins ('No Ink on Tumor')",
      surgicalProfile: "Targeted biopsy of the first lymph node(s) receiving lymphatic drainage from a primary breast malignancy.",
      operativeMechanism: "Accurately stages the axilla in clinically node-negative (cN0) early breast cancer, avoiding morbid axillary dissection.",
      clinicalHallmarks: "Hot (gamma probe) and/or blue nodes are excised; histopathology assesses macrometastases vs micrometastases.",
      highYieldPearls: "SLNB is standard of care for cN0 breast cancer; surgical margins for invasive carcinoma require 'no ink on tumor'."
    },
    {
      id: "surg-tme-rectal-plane",
      name: "Total Mesorectal Excision (TME Embryologic Plane & CRM >1mm)",
      category: "Colorectal Oncology",
      subType: "Sharp Dissection in 'Holy Plane' • Intact Mesorectal Envelope • Circumferential Resection Margin >1 mm",
      surgicalProfile: "En bloc resection of the rectum and surrounding fatty mesorectum contained within the intact visceral mesorectal fascia.",
      operativeMechanism: "Removes all regional lymphatic drainage and occult tumor deposits; prevents circumferential margin involvement.",
      clinicalHallmarks: "Executed in Low Anterior Resection (LAR) or APR; reduces local pelvic recurrence from >30% to <5%.",
      highYieldPearls: "Total Mesorectal Excision (TME) requires sharp dissection along Heald's 'holy plane' with CRM >1 mm."
    },
    {
      id: "surg-colon-lymphadenectomy",
      name: "Colon Cancer Lymphadenectomy (Minimum 12 Nodes Harvest & High Ligation)",
      category: "Colorectal Oncology",
      subType: "High Vascular Ligation of Mesenteric Vessels • >=5 cm Bowel Margins • Minimum 12 Lymph Nodes Harvest",
      surgicalProfile: "Anatomic segmental colectomy along embryologic vascular boundaries for curative-intent colon adenocarcinoma resection.",
      operativeMechanism: "Ligation of mesenteric vessels at their origins captures the complete regional lymphatic basin.",
      clinicalHallmarks: "Pathological examination of at least 12 lymph nodes is mandatory to reliably exclude stage III nodal disease.",
      highYieldPearls: "Adequate oncologic staging of colon cancer strictly requires the microscopic evaluation of >=12 lymph nodes."
    },
    {
      id: "surg-melanoma-breslow-margins",
      name: "Cutaneous Melanoma Breslow Clearance (Depth-Directed Wide Local Excision Margins)",
      category: "Cutaneous Oncology",
      subType: "In Situ (0.5 cm) • <1 mm (1 cm) • 1-2 mm (1-2 cm) • >2 mm (2 cm + SLNB) • Excision Down to Fascia",
      surgicalProfile: "Depth-directed surgical margin resection determined by histologic Breslow tumor thickness on diagnostic biopsy.",
      operativeMechanism: "Wide circumferential excision clears occult microscopic radial dermal lymphatic tumor satellites.",
      clinicalHallmarks: "SLNB is indicated for Breslow thickness >=0.8 mm or thinner lesions with ulceration; margins extend to deep muscular fascia.",
      highYieldPearls: "Melanoma surgical margins: In situ = 0.5 cm; <1 mm = 1.0 cm; 1.01-2 mm = 1-2 cm; >2 mm = 2.0 cm + SLNB."
    }
  ]
};

interface ClinicalSurgeryAdvLabViewerProps {
  initialMode?: SurgeryLabMode;
  height?: string;
  onNodeSelect?: (node: SurgeryLabNode) => void;
}

export default function ClinicalSurgeryAdvLabViewer({
  initialMode = "acuteAbdomen",
  height = "560px",
  onNodeSelect,
}: ClinicalSurgeryAdvLabViewerProps) {
  const [activeMode, setActiveMode] = useState<SurgeryLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Biliary CVS Profiler State
  const [selectedCvs, setSelectedCvs] = useState<"c1" | "c2" | "c3" | "bdi">("c3");

  // Forrest GI Bleed Profiler State
  const [selectedForrest, setSelectedForrest] = useState<"ia" | "iia" | "iic" | "perf">("ia");

  const cvsDetails = useMemo(() => {
    if (selectedCvs === "c1") {
      return {
        title: "CVS Criterion 1: Clear Hepatocystic (Calot's) Triangle",
        indices: "Hepatocystic Triangle Cleared of All Fat & Fibrous Tissue • Cystic Duct & Artery Isolated",
        rx: "Blunt/electrocautery dissection staying close to the gallbladder infundibulum; visualize liver bed",
        pearl: "Never apply clips while Calot's triangle is obscured by inflammatory fat or dense adhesions."
      };
    } else if (selectedCvs === "c2") {
      return {
        title: "CVS Criterion 2: Detach Lower 1/3 of Gallbladder off Liver Bed",
        indices: "Expose Lower 1/3 of Cystic Plate • Liver Surface Directly Visible Behind Gallbladder Base",
        rx: "Dissect the infundibulum off the cystic plate to guarantee that no posterior structures enter the GB",
        pearl: "Exposing the cystic plate prevents mistaking a low-lying right hepatic duct for the cystic duct."
      };
    } else if (selectedCvs === "c3") {
      return {
        title: "CVS Criterion 3: Two and Only Two Structures Entering the Gallbladder",
        indices: "Cystic Duct & Cystic Artery • Conclusive Verification • Critical Pause Before Clipping",
        rx: "Only when TWO and ONLY TWO structures are seen entering the GB can clips be applied safely",
        pearl: "If CVS cannot be achieved 100%, execute bailout strategy: subtotal cholecystectomy or open conversion."
      };
    } else {
      return {
        title: "Iatrogenic Bile Duct Injury (Strasberg Type E Transection)",
        indices: "Misidentified Common Bile Duct Clipped and Transected • Progressive Jaundice & Biloma",
        rx: "Immediate cessation of laparoscopy; transfer to HPB center for Roux-en-Y Hepaticojejunostomy",
        pearl: "The classic mechanism of Type E injury is mistaking the main common bile duct for the cystic duct."
      };
    }
  }, [selectedCvs]);

  const forrestDetails = useMemo(() => {
    if (selectedForrest === "ia") {
      return {
        title: "Forrest Class Ia: Active Arterial Spurting Hemorrhage",
        indices: "Pulsatile Jet Bleed • >90% Rebleeding Risk • Mandatory Dual Endoscopic Therapy",
        rx: "Epinephrine injection (1:10,000) + Hemoclips / Thermal Coagulation + IV PPI Infusion (80 mg + 8 mg/h)",
        pearl: "Dual endoscopic hemostasis dramatically reduces rebleeding and emergency surgical intervention."
      };
    } else if (selectedForrest === "iia") {
      return {
        title: "Forrest Class IIa: Non-Bleeding Visible Vessel",
        indices: "Exposed Arterial Stump Mound • ~40-50% Rebleeding Risk • Endoscopic Dual Therapy",
        rx: "Targeted endoscopic hemoclip placement or thermal bipolar coagulation + 72h IV PPI infusion",
        pearl: "Visible vessels in ulcer craters require active endoscopic therapy to prevent massive rebleeding."
      };
    } else if (selectedForrest === "iic") {
      return {
        title: "Forrest Class IIc / III: Flat Spot or Clean Base",
        indices: "Pigmented Hematin Spot or Fibrinous Base • <5-10% Rebleeding Risk • No Endoscopic Therapy",
        rx: "Oral Proton Pump Inhibitor therapy; early hospital discharge and outpatient follow-up",
        pearl: "Clean-based ulcers have <5% rebleeding risk and do not require endoscopic hemostatic therapy."
      };
    } else {
      return {
        title: "Peptic Ulcer Perforation & Pneumoperitoneum",
        indices: "Sudden Epigastric Agony • Board-Like Rigidity • Bilateral Subdiaphragmatic Free Air on CXR",
        rx: "Emergency exploratory laparotomy/laparoscopy + Graham Patch Omentopexy + Copious Lavage",
        pearl: "Graham patch omentopexy places a viable vascularized omental pedicle over the perforation."
      };
    }
  }, [selectedForrest]);

  const currentNodes = useMemo(() => {
    return SURGERY_LAB_NODES[activeMode] || SURGERY_LAB_NODES.acuteAbdomen;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: SurgeryLabNode) => {
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
            <Scissors size={14} /> SUR-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "acuteAbdomen" && "Acute Abdomen & SBO: Mechanical Obstruction, Strangulation & Ogilvie Syndrome"}
            {activeMode === "lapBiliary" && "Laparoscopic Biliary Surgery: The Critical View of Safety (CVS) & BDI Prevention"}
            {activeMode === "giBleed" && "Upper GI Hemorrhage (Forrest Classification) & Peptic Perforation Graham Patch"}
            {activeMode === "surgicalOncology" && "Surgical Oncology: Sentinel Node Biopsy, Total Mesorectal Excision & Melanoma"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Surgery Diagnostic Quiz"}
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
                <div className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                  Surgery Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Operative Pathology / Procedure: {quizTargetNode.clinicalHallmarks}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-rose-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-rose-950 text-xs rounded border border-rose-700 text-rose-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: Acute Abdomen & Bowel Obstruction */}
          {activeMode === "acuteAbdomen" && (
            <div className={styles.surgCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Acute Abdomen &amp; Bowel Obstruction Triage Workstation
                </span>
                <span className="text-[11px] text-slate-400">Adhesive SBO &bull; Strangulation Ischemia &bull; Sigmoid Volvulus &bull; Ogilvie</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Uncomplicated SBO vs Closed-Loop Strangulation</div>
                  <div className="text-slate-300 mt-1">Uncomplicated SBO (adhesions &gt;60%) responds to NG decompression and IV hydration. The onset of cardinal strangulation signs (persistent tachycardia, fever, localized rebound tenderness, leukocytosis &gt;15,000, and elevated serum lactate) mandates immediate emergency exploratory laparotomy.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Sigmoid Volvulus &amp; Ogilvie Syndrome</div>
                  <div className="text-slate-300 mt-1">Sigmoid volvulus shows the classic 'coffee bean' inverted-U sign; decompress with rigid sigmoidoscopy followed by elective sigmoidectomy. Ogilvie syndrome (acute colonic pseudo-obstruction with cecal diameter &gt;10-12 cm) is treated with IV Neostigmine (2 mg over 3-5 min) or colonoscopy.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Laparoscopic Biliary & CVS */}
          {activeMode === "lapBiliary" && (
            <div className={styles.surgCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Strasberg Critical View of Safety (CVS) &amp; BDI Prevention
                </span>
                <span className="text-[11px] text-slate-400">Clear Calot's &bull; Detach Lower 1/3 GB &bull; See 2 Structures Only</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedCvs("c1")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedCvs === "c1"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🔍 1. Clear Calot's
                </button>
                <button
                  onClick={() => setSelectedCvs("c2")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedCvs === "c2"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🏔️ 2. Detach 1/3 GB
                </button>
                <button
                  onClick={() => setSelectedCvs("c3")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedCvs === "c3"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🛡️ 3. Two Structures
                </button>
                <button
                  onClick={() => setSelectedCvs("bdi")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedCvs === "bdi"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚠️ Strasberg Type E BDI
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-rose-300">{cvsDetails.title}</div>
                <div className="text-pink-400 font-bold mt-1">{cvsDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-rose-400">Surgical Mandate:</strong> {cvsDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">SAGES Safety Pearl:</strong> {cvsDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 3: GI Hemorrhage & Ulcer Perforation */}
          {activeMode === "giBleed" && (
            <div className={styles.surgCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={14} /> Forrest Classification of Peptic Bleeding &amp; Ulcer Perforation
                </span>
                <span className="text-[11px] text-slate-400">Forrest Ia-III &bull; Dual Endotherapy &bull; Graham Patch Omentopexy</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedForrest("ia")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedForrest === "ia"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🩸 Forrest Ia (Spurting)
                </button>
                <button
                  onClick={() => setSelectedForrest("iia")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedForrest === "iia"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🔘 Forrest IIa (Vessel)
                </button>
                <button
                  onClick={() => setSelectedForrest("iic")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedForrest === "iic"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚪ Forrest IIc/III (Clean)
                </button>
                <button
                  onClick={() => setSelectedForrest("perf")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedForrest === "perf"
                      ? "bg-rose-600 text-white border-rose-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💨 Free Perforation
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-rose-300">{forrestDetails.title}</div>
                <div className="text-pink-400 font-bold mt-1">{forrestDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-rose-400">Management:</strong> {forrestDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Surgical Rule:</strong> {forrestDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 4: Surgical Oncology & Staging */}
          {activeMode === "surgicalOncology" && (
            <div className={styles.surgCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Scissors size={14} /> Surgical Oncology: Lymphatic Mapping &amp; Oncologic Margins
                </span>
                <span className="text-[11px] text-slate-400">Breast SLNB &bull; Rectal TME &bull; Colon &ge;12 Nodes &bull; Melanoma Breslow</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Total Mesorectal Excision (TME) &amp; Colon Staging</div>
                  <div className="text-slate-300 mt-1">TME for rectal cancer requires sharp dissection in the embryologic 'holy plane' to maintain an intact mesorectal fascia and negative circumferential resection margin (CRM &gt;1 mm), reducing local recurrence from &gt;30% to &lt;5%. Colon cancer resection mandates a minimum harvest of 12 lymph nodes.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-rose-300 font-bold">Breast SLNB &amp; Cutaneous Melanoma Margins</div>
                  <div className="text-slate-300 mt-1">Breast cancer SLNB utilizes dual mapping (Tc-99m sulfur colloid + isosulfan blue); margins for invasive carcinoma require 'no ink on tumor'. Melanoma margins: in situ = 0.5 cm, &lt;1 mm = 1.0 cm, 1.01-2 mm = 1-2 cm, &gt;2 mm = 2.0 cm with mandatory SLNB.</div>
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
                    <span className="text-rose-400 font-bold">Surgery:</span> {node.surgicalProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect operative protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Clinical Surgery Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Surgery Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔪 Surgical Entity / Operation</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Operative Anatomy &amp; Pathology</div>
            <div className="text-xs text-rose-300 font-semibold">{activeNode.surgicalProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.operativeMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Diagnostics</div>
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
          onClick={() => setActiveMode("acuteAbdomen")}
          className={`${styles.modeTab} ${activeMode === "acuteAbdomen" ? styles.modeTabActive : ""}`}
        >
          🩺 1. Acute Abdomen &amp; SBO
        </button>
        <button
          onClick={() => setActiveMode("lapBiliary")}
          className={`${styles.modeTab} ${activeMode === "lapBiliary" ? styles.modeTabActive : ""}`}
        >
          🔍 2. Lap Biliary &amp; CVS
        </button>
        <button
          onClick={() => setActiveMode("giBleed")}
          className={`${styles.modeTab} ${activeMode === "giBleed" ? styles.modeTabActive : ""}`}
        >
          🩸 3. GI Bleed &amp; Ulcer Perf
        </button>
        <button
          onClick={() => setActiveMode("surgicalOncology")}
          className={`${styles.modeTab} ${activeMode === "surgicalOncology" ? styles.modeTabActive : ""}`}
        >
          ✂️ 4. Surgical Oncology &amp; TME
        </button>
      </div>
    </div>
  );
}
