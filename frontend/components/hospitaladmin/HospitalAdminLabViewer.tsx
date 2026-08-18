"use client";

import React, { useState, useMemo } from "react";
import styles from "./HospitalAdminLabViewer.module.css";
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
  Trash2,
  Building2,
  ClipboardCheck,
  FileCheck2,
  HeartPulse,
} from "lucide-react";

export type HospitalAdminLabMode = "bmwm" | "hic" | "quality" | "safety";

export interface HospitalAdminLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  regulatoryStandard: string;
  implementationProtocol: string;
  qualityMetric: string;
  highYieldPearl: string;
}

export const HOSPITAL_ADMIN_NODES: Record<HospitalAdminLabMode, HospitalAdminLabNode[]> = {
  bmwm: [
    {
      id: "ha-bmwm-yellow-incineration",
      name: "Yellow Bag: Anatomical, Cytotoxic & Chemical Waste",
      category: "BMWM Rules 2016",
      subType: "Human Tissues • Placenta • Expired Drugs • Soiled Dressings • Incineration (>1050°C)",
      regulatoryStandard: "Non-chlorinated yellow plastic bags for anatomical/pathological waste, soiled dressings, and discarded cytotoxic pharmaceuticals.",
      implementationProtocol: "High-temperature Incineration with double combustion chambers (Primary >800°C, Secondary >1050°C) or Plasma Pyrolysis. Deep burial restricted to remote areas.",
      qualityMetric: "100% segregation compliance at point of generation; storage time strictly under 48 hours with Barcode GPS tracking.",
      highYieldPearl: "Yellow bags must be strictly non-chlorinated to eliminate dioxin and furan emission during high-temperature incineration."
    },
    {
      id: "ha-bmwm-red-recyclable-plastics",
      name: "Red Bag: Contaminated Recyclable Plastics",
      category: "BMWM Rules 2016",
      subType: "Flexible Plastics • IV Tubings • Catheters • Urine Bags • Gloves • Autoclaving & Shredding",
      regulatoryStandard: "Non-chlorinated red plastic bags for contaminated flexible plastic items without sharps.",
      implementationProtocol: "Autoclaving (121°C at 15 psi for 30 min) or Microwaving/Hydroclaving followed by mandatory mechanical shredding/mutilation and plastic recycling.",
      qualityMetric: "Zero sharps contamination in red bags; automated plastic recycling traceability.",
      highYieldPearl: "Plastic IV bottles, tubing sets, and catheters go into Red bags for autoclaving and shredding; they must never be incinerated."
    }
  ],

  hic: [
    {
      id: "ha-hic-clabsi-bundle-maximal-barrier",
      name: "Central Line Bundle (CLABSI) & Maximal Barriers",
      category: "Infection Control Bundle",
      subType: "Maximal Sterile Barriers • >0.5% Chlorhexidine Alcohol • Subclavian Site • Daily Audit",
      regulatoryStandard: "CDC & WHO Guidelines for the Prevention of Intravascular Catheter-Related Bloodstream Infections.",
      implementationProtocol: "Maximal sterile barrier precautions (cap, mask, gown, sterile gloves, full body drape); >0.5% chlorhexidine alcohol air-dried for 2 min; Subclavian vein preferred.",
      qualityMetric: "CLABSI Rate target: <1.0 per 1,000 central line-days; 100% daily line necessity audit.",
      highYieldPearl: "The subclavian vein is the preferred insertion site for lowest infection risk; the femoral vein is strictly avoided in adults due to high thrombosis and infection rates."
    },
    {
      id: "ha-hic-vap-bundle-head-elevation",
      name: "Ventilator Bundle (VAP) & Head Elevation",
      category: "Infection Control Bundle",
      subType: "Head of Bed 30°-45° • Daily Sedation Vacation • CASS Subglottic Suction • Oral Chlorhexidine",
      regulatoryStandard: "Evidence-based Ventilator-Associated Pneumonia Prevention Bundle for mechanically ventilated patients.",
      implementationProtocol: "Maintain head of bed elevated at 30°-45° 24/7; daily spontaneous breathing trials / sedation interruption; subglottic secretion drainage with CASS ETT.",
      qualityMetric: "VAP Rate target: <2.0 per 1,000 ventilator-days; reduction in mean duration of mechanical ventilation.",
      highYieldPearl: "Maintaining the head of bed at 30°-45° prevents passive gastroesophageal reflux and microaspiration of contaminated gastric secretions."
    }
  ],

  quality: [
    {
      id: "ha-quality-donabedian-triad",
      name: "Donabedian Quality Triad (Structure, Process, Outcome)",
      category: "Quality Framework",
      subType: "Structure (Facilities/Staffing) • Process (Guidelines/Checklists) • Outcome (Mortality/HAIs)",
      regulatoryStandard: "Avedis Donabedian Conceptual Model for Healthcare Quality Assessment and Continuous Improvement.",
      implementationProtocol: "Structure: 1:1 ICU nurse-to-patient ratio; Process: Door-to-balloon time <90 min for STEMI; Outcome: 30-day all-cause mortality and HAI reduction.",
      qualityMetric: "NABH 5th Edition Key Performance Indicators (KPIs) tracked across clinical and administrative domains.",
      highYieldPearl: "The Donabedian framework establishes that robust Structure promotes effective clinical Process, which directly yields optimal patient Outcomes."
    },
    {
      id: "ha-quality-hospital-bed-metrics",
      name: "Hospital Bed Metrics (BOR, ALOS, BTI & NDR)",
      category: "Hospital Analytics",
      subType: "Bed Occupancy (75-85%) • ALOS (4-5.5d) • Bed Turnover Interval (1-2d) • Net Death Rate (<2%)",
      regulatoryStandard: "Standard Hospital Utilization and Performance Metrics for Capacity Planning and Quality Auditing.",
      implementationProtocol: "BOR = (Occupied Bed-Days / Available Bed-Days) * 100%; ALOS = Total Inpatient Days / Discharges+Deaths; BTI = Vacant Bed-Days / Discharges.",
      qualityMetric: "Optimal target: BOR 75-85% (avoids bed crunches and infection outbreaks); ALOS 4-5.5 days for acute tertiary care.",
      highYieldPearl: "A Bed Occupancy Rate (BOR) exceeding 90% significantly increases healthcare-associated infection transmission and compromises emergency surge capacity."
    }
  ],

  safety: [
    {
      id: "ha-safety-ipsg-goals-1-to-6",
      name: "International Patient Safety Goals (IPSG 1 to 6)",
      category: "Patient Safety Standard",
      subType: "2 Patient Identifiers • Read-Back Verbal Orders • High-Alert LASA • Safe Surgery • Fall Prevention",
      regulatoryStandard: "Joint Commission International (JCI) and WHO World Alliance for Patient Safety Core Goals.",
      implementationProtocol: "IPSG 1: 2 identifiers (Name + UHID, never room/bed #); IPSG 2: Write down, read back, confirm; IPSG 3: Concentrated electrolytes removed from wards; IPSG 4: WHO checklist.",
      qualityMetric: "Zero wrong-site surgeries; 100% compliance with critical panic lab value read-back within 30 minutes.",
      highYieldPearl: "Never use room number or bed number as a patient identifier; always verify at least two independent identifiers (Full Name and UHID/DOB)."
    },
    {
      id: "ha-safety-ishikawa-fishbone-rca",
      name: "Ishikawa (Fishbone) Root Cause Analysis & 6Ms",
      category: "Risk Management & RCA",
      subType: "Sentinel Events • 6Ms (Man, Machine, Material, Method, Measurement, Milieu) • 5-Whys Analysis",
      regulatoryStandard: "NABH / JCI Retrospective Root Cause Analysis Protocol for Sentinel Events and Near Misses.",
      implementationProtocol: "Map contributing factors across 6Ms: Manpower (Staffing), Machine (Equipment), Material (Supplies), Method (SOPs), Measurement (Dosing), Milieu (Environment).",
      qualityMetric: "100% completion of RCA within 30 days of any sentinel event, leading to actionable systemic corrective action plans (CAPA).",
      highYieldPearl: "Root cause analysis shifts the paradigm from individual human blame to uncovering systemic latent organizational failures in the workflow."
    }
  ]
};

interface HospitalAdminLabViewerProps {
  initialMode?: HospitalAdminLabMode;
  height?: string;
  onNodeSelect?: (node: HospitalAdminLabNode) => void;
}

export default function HospitalAdminLabViewer({
  initialMode = "bmwm",
  height = "560px",
  onNodeSelect,
}: HospitalAdminLabViewerProps) {
  const [activeMode, setActiveMode] = useState<HospitalAdminLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // BMWM Category Selector
  const [selectedBmwCategory, setSelectedBmwCategory] = useState<"yellow" | "red" | "white" | "blue">("yellow");

  // Care Bundle Selector
  const [selectedBundle, setSelectedBundle] = useState<"cauti" | "clabsi" | "vap" | "ssi">("clabsi");

  // BMWM Details
  const bmwmDetails = useMemo(() => {
    if (selectedBmwCategory === "yellow") {
      return {
        title: "Yellow Bag (Non-Chlorinated)",
        items: "Human anatomical waste, placenta, biopsy tissues, soiled dressings, plaster casts, expired drugs, blood bags",
        treatment: "High-temperature Incineration (>1050°C in secondary chamber) or Plasma Pyrolysis / Deep burial",
        rule: "Non-chlorinated bags required to prevent carcinogenic dioxin and furan emission during combustion."
      };
    } else if (selectedBmwCategory === "red") {
      return {
        title: "Red Bag (Non-Chlorinated Recyclable Plastics)",
        items: "Flexible plastics: IV tubing, IV plastic bottles, Foley catheters, urine bags, disposable gloves, syringes without needles",
        treatment: "Autoclaving (121°C, 15 psi) or Microwaving followed by mechanical Shredding & Recycling",
        rule: "Strictly recyclable plastics only; sharps must never enter red bags."
      };
    } else if (selectedBmwCategory === "white") {
      return {
        title: "White Translucent Container (Puncture-Proof & Tamper-Proof)",
        items: "Sharps: Disposable needles, fixed-needle syringes, scalpels, surgical blades, contaminated metal wires",
        treatment: "Autoclaving or Dry Heat Sterilization followed by Shredding / Mutilation & Encapsulation",
        rule: "Never bend, break, or manually recap needles; use needle burners or drop directly into container."
      };
    } else {
      return {
        title: "Blue Box / Cardboard Box with Blue Marking (Puncture-Resistant)",
        items: "Glassware & Implants: Medicine glass vials, broken ampoules, glass IV bottles, orthopedic metallic plates/screws",
        treatment: "Disinfection with 1-2% Sodium Hypochlorite or Autoclaving then Glass/Metal Recycling",
        rule: "Puncture-resistant container with blue color marking to prevent glass puncture lacerations."
      };
    }
  }, [selectedBmwCategory]);

  const bundleDetails = useMemo(() => {
    if (selectedBundle === "clabsi") {
      return {
        title: "Central Line-Associated Bloodstream Infection (CLABSI) Bundle",
        elements: "Maximal sterile barrier precautions (cap, mask, sterile gown, gloves, full body drape); >0.5% Chlorhexidine in 70% alcohol skin prep; Subclavian vein preferred (avoid femoral); Daily line necessity review.",
        target: "CLABSI Rate <1.0 per 1,000 central line-days"
      };
    } else if (selectedBundle === "vap") {
      return {
        title: "Ventilator-Associated Pneumonia (VAP) Bundle",
        elements: "Head of bed elevated at 30°-45°; Daily sedation vacation & readiness to extubate; Subglottic secretion drainage (CASS ETT); Oral hygiene with 0.12% Chlorhexidine; DVT and peptic ulcer prophylaxis.",
        target: "VAP Rate <2.0 per 1,000 ventilator-days"
      };
    } else if (selectedBundle === "cauti") {
      return {
        title: "Catheter-Associated Urinary Tract Infection (CAUTI) Bundle",
        elements: "Strict aseptic insertion; Closed drainage system maintained continuously; Drainage bag kept below bladder level; Avoid dependent loops; Daily review of catheter necessity & prompt removal.",
        target: "CAUTI Rate <1.5 per 1,000 catheter-days"
      };
    } else {
      return {
        title: "Surgical Site Infection (SSI) Prevention Bundle",
        elements: "Preoperative antiseptic bath; Hair clipping only (razors strictly prohibited); Prophylactic antibiotics given within 60 min before skin incision; Maintenance of intraoperative normothermia (>=36°C) and euglycemia (<180 mg/dL).",
        target: "Zero preventable surgical site infections across Clean and Clean-Contaminated wounds"
      };
    }
  }, [selectedBundle]);

  const currentNodes = useMemo(() => {
    return HOSPITAL_ADMIN_NODES[activeMode] || HOSPITAL_ADMIN_NODES.bmwm;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: HospitalAdminLabNode) => {
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
            <Building2 size={14} /> HADM-401
          </span>
          <span className={styles.titleText}>
            {activeMode === "bmwm" && "Biomedical Waste Management (BMWM Rules 2016) & Segregation Matrix"}
            {activeMode === "hic" && "Hospital Infection Control (HIC), Care Bundles & WHO 5 Moments"}
            {activeMode === "quality" && "Healthcare Quality Frameworks, NABH/JCI & Hospital Bed Metrics"}
            {activeMode === "safety" && "Patient Safety (IPSG 1-6), WHO Surgical Checklist & Root Cause Analysis"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Hospital Admin Quiz"}
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
                <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                  Healthcare Quality Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Administrative Protocol: {quizTargetNode.implementationProtocol}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-blue-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-blue-950 text-xs rounded border border-blue-700 text-blue-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: BMWM Color-Coded Segregation */}
          {activeMode === "bmwm" && (
            <div className={styles.adminCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Trash2 size={14} /> BMWM Rules 2016 Color-Coded Segregation Matrix
                </span>
                <span className="text-[11px] text-slate-400">Yellow &bull; Red &bull; White &bull; Blue</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedBmwCategory("yellow")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedBmwCategory === "yellow"
                      ? "bg-amber-500 text-slate-950 border-amber-300"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🟡 Yellow Bag
                </button>
                <button
                  onClick={() => setSelectedBmwCategory("red")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedBmwCategory === "red"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🔴 Red Bag
                </button>
                <button
                  onClick={() => setSelectedBmwCategory("white")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedBmwCategory === "white"
                      ? "bg-slate-200 text-slate-950 border-white"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚪ White Container
                </button>
                <button
                  onClick={() => setSelectedBmwCategory("blue")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedBmwCategory === "blue"
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🔵 Blue Box
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-blue-300">{bmwmDetails.title}</div>
                <div className="text-slate-300 mt-1"><strong className="text-blue-400">Waste Items:</strong> {bmwmDetails.items}</div>
                <div className="text-slate-300 mt-1"><strong className="text-emerald-400">Treatment &amp; Disposal:</strong> {bmwmDetails.treatment}</div>
                <div className="text-amber-300 font-semibold mt-1.5"><strong className="text-amber-400">Mandatory Rule:</strong> {bmwmDetails.rule}</div>
              </div>
            </div>
          )}

          {/* Mode 2: Hospital Infection Control Bundles */}
          {activeMode === "hic" && (
            <div className={styles.adminCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Evidence-Based Infection Control Care Bundles
                </span>
                <span className="text-[11px] text-slate-400">CLABSI &bull; VAP &bull; CAUTI &bull; SSI</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedBundle("clabsi")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedBundle === "clabsi"
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  CLABSI Bundle
                </button>
                <button
                  onClick={() => setSelectedBundle("vap")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedBundle === "vap"
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  VAP Bundle
                </button>
                <button
                  onClick={() => setSelectedBundle("cauti")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedBundle === "cauti"
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  CAUTI Bundle
                </button>
                <button
                  onClick={() => setSelectedBundle("ssi")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedBundle === "ssi"
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  SSI Bundle
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-blue-300">{bundleDetails.title}</div>
                <div className="text-slate-300 mt-1"><strong className="text-blue-400">Bundle Elements:</strong> {bundleDetails.elements}</div>
                <div className="text-emerald-300 font-bold mt-1.5"><strong className="text-emerald-400">Benchmark Target:</strong> {bundleDetails.target}</div>
              </div>
            </div>
          )}

          {/* Mode 3: Healthcare Quality & Bed Metrics */}
          {activeMode === "quality" && (
            <div className={styles.adminCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={14} /> Hospital Bed Metrics &amp; Quality Triad
                </span>
                <span className="text-[11px] text-slate-400">BOR &bull; ALOS &bull; BTI &bull; NDR</span>
              </div>

              <div className={styles.resultsGrid}>
                <div className={styles.resultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Bed Occupancy (BOR)</div>
                  <div className={styles.resultVal}>75 - 85%</div>
                </div>
                <div className={styles.resultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Average Stay (ALOS)</div>
                  <div className={styles.resultVal}>4.0 - 5.5 d</div>
                </div>
                <div className={styles.resultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Turnover (BTI)</div>
                  <div className={styles.resultVal}>1.0 - 2.0 d</div>
                </div>
                <div className={styles.resultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Net Death Rate</div>
                  <div className={styles.resultVal}>&lt; 2.0%</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-300">
                <div><strong className="text-blue-400">Donabedian Triad:</strong> Structure (Facilities, ICU staffing) &rarr; Process (Guidelines, Time to PCI) &rarr; Outcome (Mortality, HAIs, Satisfaction).</div>
              </div>
            </div>
          )}

          {/* Mode 4: Patient Safety & Root Cause Analysis */}
          {activeMode === "safety" && (
            <div className={styles.adminCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardCheck size={14} /> IPSG Goals &amp; Ishikawa Fishbone (6Ms)
                </span>
                <span className="text-[11px] text-slate-400">IPSG 1-6 &bull; WHO Surgical Checklist &bull; 6Ms</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-blue-300 font-bold">WHO Surgical Safety Checklist</div>
                  <div className="text-slate-300 mt-1">Sign In (before induction) &rarr; Time Out (before skin incision briefing) &rarr; Sign Out (before leaving OT debriefing).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-blue-300 font-bold">Ishikawa Fishbone Root Cause (6Ms)</div>
                  <div className="text-slate-300 mt-1">Manpower, Machine, Material, Method, Measurement, Milieu to discover latent organizational failures.</div>
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
                    <span className="text-blue-400 font-bold">Protocol:</span> {node.implementationProtocol}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Hospital Admin Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Administration Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Policy &amp; Standard</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🏛️ Regulatory Standard</div>
            <div className={styles.inspectorBody}>{activeNode.regulatoryStandard}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚙️ Implementation Protocol</div>
            <div className={styles.inspectorBody}>{activeNode.implementationProtocol}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Quality Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("bmwm")}
          className={`${styles.modeTab} ${activeMode === "bmwm" ? styles.modeTabActive : ""}`}
        >
          🗑️ 1. BMWM Rules 2016
        </button>
        <button
          onClick={() => setActiveMode("hic")}
          className={`${styles.modeTab} ${activeMode === "hic" ? styles.modeTabActive : ""}`}
        >
          🛡️ 2. Infection Bundles
        </button>
        <button
          onClick={() => setActiveMode("quality")}
          className={`${styles.modeTab} ${activeMode === "quality" ? styles.modeTabActive : ""}`}
        >
          📊 3. Quality &amp; Metrics
        </button>
        <button
          onClick={() => setActiveMode("safety")}
          className={`${styles.modeTab} ${activeMode === "safety" ? styles.modeTabActive : ""}`}
        >
          🩺 4. Patient Safety &amp; RCA
        </button>
      </div>
    </div>
  );
}
