"use client";

import React, { useState, useMemo } from "react";
import styles from "./TransfusionLabViewer.module.css";
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
} from "lucide-react";

export type TransfusionLabMode = "typing" | "components" | "reactions" | "rhogam";

export interface TransfusionLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  immunoMechanism: string;
  diagnosticCriteria: string;
  transfusionRule: string;
  highYieldPearl: string;
}

export const TRANSFUSION_NODES: Record<TransfusionLabMode, TransfusionLabNode[]> = {
  typing: [
    {
      id: "trans-abo-rh-typing-enzymes",
      name: "ABO/Rh Genetics & Carbohydrate Antigens",
      category: "Immunohematology",
      subType: "H-Gene (FUT1) • A-Gene (GalNAc) • B-Gene (Galactose) • RhD Polypeptide",
      immunoMechanism: "FUT1 fucosyltransferase attaches L-fucose to precursor chain creating H substance. A and B transferases add specific immunodominant sugars.",
      diagnosticCriteria: "Forward Typing (RBC antigens via Anti-A/Anti-B) must match Reverse Typing (Serum isohemagglutinins via A1/B cells).",
      transfusionRule: "Group O = Universal RBC Donor; Group AB = Universal Plasma Donor (contains no Anti-A or Anti-B antibodies).",
      highYieldPearl: "Group O individuals possess naturally occurring Anti-A, Anti-B, and cross-reacting Anti-A,B antibodies that are predominantly IgG, capable of crossing the placenta."
    },
    {
      id: "trans-bombay-phenotype-hh",
      name: "Bombay Phenotype (Oh / hh) & Anti-H",
      category: "Rare Blood Groups",
      subType: "Homozygous hh Mutation • Lack H, A, and B Antigens • Potent Complement-Fixing Anti-H",
      immunoMechanism: "Inability to synthesize FUT1 fucosyltransferase prevents H-antigen formation. Serum develops potent, wide-thermal-range Anti-H (IgM/IgG).",
      diagnosticCriteria: "Types as Group O on standard forward typing, but agglutinates Group O cells during reverse typing. Negative reaction with Ulex europaeus anti-H lectin.",
      transfusionRule: "CANNOT receive standard Group O blood! Must receive red blood cells ONLY from another Bombay Phenotype donor.",
      highYieldPearl: "Ulex europaeus lectin agglutinates true Group O red cells (rich in H substance) with a 4+ reaction, but yields a completely negative (0) reaction in Bombay phenotype red cells."
    }
  ],

  components: [
    {
      id: "trans-prbc-platelets-ffp-cryo",
      name: "Targeted Blood Component Dosing & Storage",
      category: "Component Therapy",
      subType: "PRBC (1 g/dL Hb) • Platelets (+30-50k) • FFP (All Factors) • Cryo (Fibrinogen >=150 mg)",
      immunoMechanism: "Separation into PRBCs (2-6°C), Platelets (20-24°C with agitation), FFP (<= -18°C), and Cryoprecipitate (cold-insoluble FFP fraction).",
      diagnosticCriteria: "PRBC threshold Hb <7.0 g/dL (<8.0 in ACS). Platelet threshold <10,000/uL prophylaxis or <50,000/uL in surgery. FFP for INR >1.5. Cryo for Fibrinogen <150 mg/dL.",
      transfusionRule: "1 unit PRBC increases adult Hb by 1.0 g/dL (Hct by 3%). 1 single-donor apheresis platelet pool increases count by 30,000 to 50,000/uL.",
      highYieldPearl: "Platelet concentrates are stored at room temperature (20-24°C) with continuous gentle agitation and have the highest risk of bacterial contamination (e.g. Staphylococcus, Serratia)."
    },
    {
      id: "trans-mtp-damage-control-resuscitation",
      name: "Massive Transfusion Protocol (1:1:1 Ratio)",
      category: "Trauma Resuscitation",
      subType: "1 PRBC : 1 FFP : 1 Platelets • Tranexamic Acid (TXA 1g) • Citrate Hypocalcemia Vigilance",
      immunoMechanism: "Reconstitutes whole blood in severe hemorrhagic shock, preventing the lethal triad of hypothermia, acidosis, and coagulopathy.",
      diagnosticCriteria: "Transfusion of >=10 units PRBCs in 24 hours or >=4 units in 1 hour with active exsanguination.",
      transfusionRule: "Deliver balanced 1:1:1 PRBC:FFP:Platelet units + TXA 1g IV within 3h of trauma. Infuse 10% Calcium Gluconate after every 4 units to treat citrate-induced hypocalcemia.",
      highYieldPearl: "Citrate in blood preservatives chelates serum ionized calcium, leading to acute hypocalcemia and QTc prolongation during rapid massive transfusions."
    }
  ],

  reactions: [
    {
      id: "trans-trali-vs-taco-differential",
      name: "TRALI (Non-Cardiogenic) vs TACO (Circulatory Overload)",
      category: "Adverse Transfusion Reactions",
      subType: "TRALI (Anti-HLA, Fever, Hypotension, PCWP <=18) • TACO (Volume Overload, HTN, BNP High, PCWP >18)",
      immunoMechanism: "TRALI: Donor anti-HLA/HNA antibodies activate recipient pulmonary capillary neutrophils. TACO: Hydrostatic volume overload in compromised cardiopulmonary reserve.",
      diagnosticCriteria: "TRALI: Fever, hypotension, normal BNP, PCWP <=18 mmHg, no response to diuretics. TACO: Hypertension, afebrile, JVD, elevated BNP, PCWP >18 mmHg, responds to Furosemide.",
      transfusionRule: "TRALI: Supportive lung-protective ventilation (avoid diuretics). TACO: Stop transfusion, sit upright, high-dose IV Furosemide (20-40 mg).",
      highYieldPearl: "TACO is marked by hypertension, jugular venous distension, elevated BNP, and prompt response to IV Furosemide, whereas TRALI presents with hypotension, fever, and non-cardiogenic pulmonary edema."
    },
    {
      id: "trans-ahtr-clerical-emergency",
      name: "Acute Hemolytic Transfusion Reaction (AHTR)",
      category: "Emergency Hemovigilance",
      subType: "ABO Incompatibility • IgM Complement Fixation • Flank Pain • Hemoglobinuria • DIC",
      immunoMechanism: "Recipient IgM isohemagglutinins bind donor RBCs, activating the classical complement pathway and membrane attack complex (C5b-9), causing massive intravascular hemolysis.",
      diagnosticCriteria: "Immediate fever, chills, flank/back pain, dark red urine (hemoglobinuria), hypotension, and laboratory evidence of intravascular hemolysis (positive DAT, low haptoglobin).",
      transfusionRule: "STOP TRANSFUSION IMMEDIATELY -> Clerical check -> Aggressive IV Normal Saline hydration to maintain urine output >=100-200 mL/hr to protect renal tubules.",
      highYieldPearl: "The most common root cause of fatal Acute Hemolytic Transfusion Reactions is clerical identification error (mislabeled specimen tube or bedside patient misidentification)."
    }
  ],

  rhogam: [
    {
      id: "trans-rh-alloimmunization-rhogam",
      name: "Rh(D) Alloimmunization & RhoGAM Immunoprophylaxis",
      category: "Maternal-Fetal Immunohematology",
      subType: "RhD-Negative Mother • RhD-Positive Fetus • 300 mcg RhoGAM at 28w & <=72h Postpartum",
      immunoMechanism: "Maternal exposure to fetal RhD+ erythrocytes stimulates IgG Anti-D synthesis, which crosses the placenta in subsequent pregnancies causing fetal hemolysis (Hydrops Fetalis).",
      diagnosticCriteria: "Indirect Antiglobulin Test (IAT) detects maternal Anti-D alloantibodies. Fetal middle cerebral artery (MCA) Doppler peak systolic velocity monitors fetal anemia.",
      transfusionRule: "Administer standard 300 mcg (1500 IU) Rho(D) Immune Globulin at 28 weeks and within 72 hours of delivery of an RhD+ infant.",
      highYieldPearl: "One standard 300 mcg vial of Rho(D) Immune Globulin neutralizes up to 30 mL of fetal whole blood (or 15 mL of packed red cells)."
    },
    {
      id: "trans-kleihauer-betke-apheresis",
      name: "Kleihauer-Betke Acid Elution & Therapeutic Apheresis",
      category: "Laboratory Immunohematology",
      subType: "Acid Elution (HbF Resistant) • FMH Calculation • TPE in TTP (ADAMTS13) & Myasthenia",
      immunoMechanism: "Acid elutes adult HbA leaving ghost cells while fetal HbF remains intact. TPE removes pathologic autoantibodies or paraproteins.",
      diagnosticCriteria: "FMH (mL) = (% Fetal Cells) x 5000 mL. Vials of RhoGAM = (FMH / 30 mL) + 1 safety vial. TPE is first-line in TTP (ADAMTS13 deficiency).",
      transfusionRule: "In TTP, perform daily Therapeutic Plasma Exchange (TPE) with FFP replacement; platelet transfusions are strictly contraindicated!",
      highYieldPearl: "In Thrombotic Thrombocytopenic Purpura (TTP), platelet transfusions are strictly contraindicated as they precipitate catastrophic diffuse microvascular thrombosis."
    }
  ]
};

interface TransfusionLabViewerProps {
  initialMode?: TransfusionLabMode;
  height?: string;
  onNodeSelect?: (node: TransfusionLabNode) => void;
}

export default function TransfusionLabViewer({
  initialMode = "typing",
  height = "560px",
  onNodeSelect,
}: TransfusionLabViewerProps) {
  const [activeMode, setActiveMode] = useState<TransfusionLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Blood Typing State
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<"A" | "B" | "AB" | "O" | "Bombay">("Bombay");

  // Kleihauer-Betke FMH State
  const [fetalCellPercent, setFetalCellPercent] = useState<number>(1.2);

  // Blood Group Details
  const bloodDetails = useMemo(() => {
    if (selectedBloodGroup === "A") {
      return {
        title: "Group A (A Antigen + H Substance)",
        antibodies: "Anti-B Isohemagglutinins (predominantly IgM)",
        ulexReactivity: "Positive (2+ to 3+)",
        transfusionCompatibility: "Can receive Group A and Group O PRBCs. Can donate PRBCs to Group A and AB.",
        color: "text-blue-400 font-bold"
      };
    } else if (selectedBloodGroup === "B") {
      return {
        title: "Group B (B Antigen + H Substance)",
        antibodies: "Anti-A Isohemagglutinins (predominantly IgM)",
        ulexReactivity: "Positive (2+ to 3+)",
        transfusionCompatibility: "Can receive Group B and Group O PRBCs. Can donate PRBCs to Group B and AB.",
        color: "text-emerald-400 font-bold"
      };
    } else if (selectedBloodGroup === "AB") {
      return {
        title: "Group AB (A & B Antigens + H Substance)",
        antibodies: "No ABO Isohemagglutinins in serum",
        ulexReactivity: "Weakly Positive (1+ to 2+)",
        transfusionCompatibility: "Universal Recipient of PRBCs (can receive A, B, AB, O). Universal Donor of Plasma (FFP).",
        color: "text-purple-400 font-bold"
      };
    } else if (selectedBloodGroup === "O") {
      return {
        title: "Group O (Unmodified H Substance Only)",
        antibodies: "Anti-A, Anti-B, and Anti-A,B Isohemagglutinins (predominantly IgG)",
        ulexReactivity: "Strongly Positive (4+)",
        transfusionCompatibility: "Universal Donor of PRBCs. Can receive PRBCs ONLY from Group O donors.",
        color: "text-amber-400 font-bold"
      };
    } else {
      return {
        title: "Bombay Phenotype (Oh / hh - No H, No A, No B Antigens)",
        antibodies: "Potent, complement-fixing Anti-A, Anti-B, AND Anti-H antibodies",
        ulexReactivity: "Completely Negative (0 Reaction with Ulex europaeus)",
        transfusionCompatibility: "FATAL IF TRANSFUSED WITH GROUP O! Must receive PRBCs ONLY from another Bombay Phenotype donor.",
        color: "text-rose-400 font-extrabold"
      };
    }
  }, [selectedBloodGroup]);

  // Kleihauer-Betke Calculations
  const fmhDetails = useMemo(() => {
    const fmhVolume = (fetalCellPercent / 100) * 5000;
    const baseVials = fmhVolume / 30;
    const recommendedVials = Math.ceil(baseVials) + 1; // +1 safety vial rule
    return {
      volume: fmhVolume.toFixed(1),
      vials: recommendedVials,
      dosageMcg: recommendedVials * 300
    };
  }, [fetalCellPercent]);

  const currentNodes = useMemo(() => {
    return TRANSFUSION_NODES[activeMode] || TRANSFUSION_NODES.typing;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: TransfusionLabNode) => {
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
            <Award size={14} /> TRANS-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "typing" && "ABO/Rh Blood Typing, Bombay Phenotype & Coombs Crossmatching"}
            {activeMode === "components" && "Targeted Component Dosing & Massive Transfusion (1:1:1 MTP)"}
            {activeMode === "reactions" && "Differential Diagnosis: TRALI vs TACO & Acute Hemolytic Reactions"}
            {activeMode === "rhogam" && "Rh Alloimmunization, Kleihauer-Betke Calculator & Apheresis"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Transfusion Quiz"}
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
                  Immunohematology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Clinical Scenario: {quizTargetNode.diagnosticCriteria}
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

          {/* Mode 1: ABO & Bombay Phenotype Selector */}
          {activeMode === "typing" && (
            <div className={styles.transSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplet size={14} /> ABO &amp; Rare Bombay Phenotype Compatibility
                </span>
                <span className="text-[11px] text-slate-400">Anti-H Lectin &bull; Isohemagglutinins</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <button
                  onClick={() => setSelectedBloodGroup("A")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedBloodGroup === "A"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Group A
                </button>
                <button
                  onClick={() => setSelectedBloodGroup("B")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedBloodGroup === "B"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Group B
                </button>
                <button
                  onClick={() => setSelectedBloodGroup("AB")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedBloodGroup === "AB"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Group AB
                </button>
                <button
                  onClick={() => setSelectedBloodGroup("O")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedBloodGroup === "O"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Group O
                </button>
                <button
                  onClick={() => setSelectedBloodGroup("Bombay")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedBloodGroup === "Bombay"
                      ? "bg-red-700 text-white border-red-400 shadow-md shadow-red-500/20"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Bombay (hh)
                </button>
              </div>

              <div className={styles.transResultsGrid}>
                <div className={styles.transResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Blood Group Phenotype</div>
                  <div className={`text-xs font-bold mt-1 ${bloodDetails.color}`}>{bloodDetails.title}</div>
                </div>
                <div className={styles.transResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Ulex Europaeus (Anti-H)</div>
                  <div className="text-xs font-bold text-amber-300 mt-1">{bloodDetails.ulexReactivity}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-300">
                <div><strong className="text-red-400">Circulating Serum Antibodies:</strong> {bloodDetails.antibodies}</div>
                <div className="mt-1"><strong className="text-red-400">Transfusion Safety Rule:</strong> {bloodDetails.transfusionCompatibility}</div>
              </div>
            </div>
          )}

          {/* Mode 2: Component Dosing & MTP */}
          {activeMode === "components" && (
            <div className={styles.transSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={14} /> Massive Transfusion Protocol (1:1:1 Balanced Ratio)
                </span>
                <span className="text-[11px] text-slate-400">PRBC : FFP : Platelets + TXA</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-center">
                  <div className="text-red-400 font-bold">1 Unit PRBC</div>
                  <div className="text-slate-300 mt-1">+1.0 g/dL Hb (+3% Hct). Stored 2–6&deg;C. Restrictive trigger &lt;7.0 g/dL.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-center">
                  <div className="text-red-400 font-bold">1 Unit FFP</div>
                  <div className="text-slate-300 mt-1">All clotting factors. Dosing 10–15 mL/kg for INR &gt;1.5 in active bleeding.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-center">
                  <div className="text-red-400 font-bold">1 Apheresis Platelet</div>
                  <div className="text-slate-300 mt-1">+30,000–50,000/&mu;L. Stored 20–24&deg;C with agitation. Trigger &lt;50k in trauma.</div>
                </div>
              </div>

              <div className="p-3 bg-red-950/40 rounded-lg border border-red-800/60 text-xs text-red-200">
                <strong>CRITICAL MTP SURVEILLANCE:</strong> Administer 10 mL 10% Calcium Gluconate IV every 4 units to treat citrate-induced hypocalcemia (prolonged QTc). Give Tranexamic Acid (TXA) 1g within 3 hours.
              </div>
            </div>
          )}

          {/* Mode 3: TRALI vs TACO */}
          {activeMode === "reactions" && (
            <div className={styles.transSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Differential Diagnostic Matrix: TRALI vs TACO
                </span>
                <span className="text-[11px] text-slate-400">PCWP &bull; BNP &bull; Diuretic Response</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">TRALI (Non-Cardiogenic Edema)</div>
                  <div className="text-slate-300 mt-1">Anti-HLA donor antibodies. <strong>Hypotension + Fever + Normal PCWP (&le;18 mmHg) + Normal BNP</strong>. Diuretics contraindicated!</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">TACO (Circulatory Volume Overload)</div>
                  <div className="text-slate-300 mt-1">Hydrostatic overload. <strong>Hypertension + Afebrile + Elevated PCWP (&gt;18 mmHg) + High BNP</strong>. Rapid response to IV Furosemide!</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Kleihauer-Betke Calculator */}
          {activeMode === "rhogam" && (
            <div className={styles.transSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp size={14} /> Kleihauer-Betke Acid Elution &amp; RhoGAM Calculator
                </span>
                <span className="text-[11px] text-slate-400">FMH = % Fetal Cells &times; 5000 mL</span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Fetal Red Blood Cells on Acid Elution:</span>
                  <span className="font-bold text-red-300">{fetalCellPercent.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={fetalCellPercent}
                  onChange={(e) => setFetalCellPercent(parseFloat(e.target.value))}
                  className="w-full accent-red-500"
                />
              </div>

              <div className={styles.transResultsGrid}>
                <div className={styles.transResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Feto-Maternal Bleed</div>
                  <div className="text-sm font-bold text-red-300 mt-1">{fmhDetails.volume} mL Whole Blood</div>
                </div>
                <div className={styles.transResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">RhoGAM 300 &mu;g Vials</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1">{fmhDetails.vials} Vials ({fmhDetails.dosageMcg} &mu;g)</div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                <strong>Standard Protocol:</strong> 1 vial (300 &mu;g) covers 30 mL fetal whole blood. Always add +1 safety vial when calculating dose following traumatic or operative deliveries.
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
                    <span className="text-red-400 font-bold">Transfusion Rule:</span> {node.transfusionRule}
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

        {/* Right Side: High-Yield Transfusion Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
              Transfusion Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🩸 Topic &amp; Focus</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Immunohematological Mechanism</div>
            <div className={styles.inspectorBody}>{activeNode.immunoMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Diagnostic Criteria &amp; Presentation</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Transfusion Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("typing")}
          className={`${styles.modeTab} ${activeMode === "typing" ? styles.modeTabActive : ""}`}
        >
          🩸 1. ABO &amp; Bombay Typing
        </button>
        <button
          onClick={() => setActiveMode("components")}
          className={`${styles.modeTab} ${activeMode === "components" ? styles.modeTabActive : ""}`}
        >
          📦 2. Components &amp; 1:1:1 MTP
        </button>
        <button
          onClick={() => setActiveMode("reactions")}
          className={`${styles.modeTab} ${activeMode === "reactions" ? styles.modeTabActive : ""}`}
        >
          🫁 3. TRALI vs TACO &amp; AHTR
        </button>
        <button
          onClick={() => setActiveMode("rhogam")}
          className={`${styles.modeTab} ${activeMode === "rhogam" ? styles.modeTabActive : ""}`}
        >
          🤰 4. Rh HDFN &amp; Kleihauer
        </button>
      </div>
    </div>
  );
}
