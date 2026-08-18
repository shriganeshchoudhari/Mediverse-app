"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalInt2LabViewer.module.css";
import {
  Stethoscope,
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
  Wind,
  Zap,
} from "lucide-react";

export type Int2LabMode = "vascular" | "fluids" | "csf" | "pocus";

export interface Int2LabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  proceduralProfile: string;
  proceduralMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const INT2_LAB_NODES: Record<Int2LabMode, Int2LabNode[]> = {
  vascular: [
    {
      id: "int2-va-internal-jugular-cvc",
      name: "Internal Jugular CVC Seldinger Cannulation (Ultrasound SCM Triangle & Venous Compressibility)",
      category: "Central Line",
      subType: "Apex SCM Triangle • Compressible IJV vs Pulsatile Carotid • Real-Time Needle-Tip Tracking • J-Tip Wire",
      proceduralProfile: "Primary ultrasound-guided central venous access route for hemodynamic monitoring and vasopressor infusions.",
      proceduralMechanism: "Real-time ultrasound guidance prevents arterial puncture; Seldinger wire allows tract dilation across skin/fascia.",
      clinicalHallmarks: "IJV collapses under gentle transducer downward pressure and expands during Valsalva maneuver; angle 45&deg; toward nipple.",
      highYieldPearls: "The Internal Jugular Vein is thin-walled and compressible under gentle probe pressure, distinguishing it from the carotid artery."
    },
    {
      id: "int2-va-subclavian-femoral-access",
      name: "Subclavian & Femoral Venous Access (Infraclavicular Vector & NAVEL Femoral Triangle Landmarks)",
      category: "Alternative CVC",
      subType: "Subclavian (Medial/Middle 1/3 Clavicle toward Suprasternal Notch) • Femoral (NAVEL: 1-2 cm Medial to Artery)",
      proceduralProfile: "Subclavian access for long-term comfort (pneumothorax risk) and femoral access for emergent resuscitation.",
      proceduralMechanism: "Infraclavicular puncture hits subclavian vein as it crosses 1st rib; femoral access follows NAVEL anatomy.",
      clinicalHallmarks: "Subclavian vein carries pneumothorax risk (~1-5%); femoral vein has the highest DVT and catheter infection rates.",
      highYieldPearls: "Femoral vein lies medial to the femoral arterial pulse (NAVEL: Nerve, Artery, Vein, Empty space, Lymphatics)."
    },
    {
      id: "int2-va-radial-arterial-line",
      name: "Ultrasound-Guided Radial Arterial Line (Modified Allen Collateral Flow & Continuous Beat-to-Beat A-Line)",
      category: "Arterial Cannulation",
      subType: "Modified Allen Test • High-Frequency Linear Probe • Real-Time Transduction • Continuous BP & ABGs",
      proceduralProfile: "Beat-to-beat hemodynamic monitoring and repeated arterial blood gas sampling in unstable shock.",
      proceduralMechanism: "Intra-arterial fluid-filled catheter transmits pulse wave to a piezoelectric transducer for continuous arterial pressure.",
      clinicalHallmarks: "Verify ulnar collateral flow via modified Allen test prior to puncture; real-time dynamic needle-tip ultrasound guidance.",
      highYieldPearls: "The Modified Allen Test evaluates collateral ulnar blood flow prior to radial artery cannulation."
    },
    {
      id: "int2-va-sterile-clabsi-prevention",
      name: "Sterile CLABSI Prevention & Guidewire Control (Full Drape, Chlorhexidine & Never Losing Guidewire Control)",
      category: "Safety Protocols",
      subType: "Chlorhexidine 2% Skin Prep • Full-Body Sterile Drape • Sterile Probe Sheath • ALWAYS HOLD GUIDEWIRE",
      proceduralProfile: "Rigorous infection control and safety standards preventing fatal line-associated bacteremia and wire embolization.",
      proceduralMechanism: "Maximal sterile barrier precautions eliminate cutaneous bacterial inoculation into the central circulation.",
      clinicalHallmarks: "NEVER let go of the guidewire at any stage during dilation or catheter advancement; maintain continuous tactile control.",
      highYieldPearls: "NEVER lose control of the guidewire during any step of central venous catheterization to prevent wire embolization."
    }
  ],

  fluids: [
    {
      id: "int2-fl-saag-calculation-portal-htn",
      name: "Serum-Ascites Albumin Gradient (SAAG) Math (&ge;1.1 g/dL Portal HTN vs <1.1 g/dL Peritoneal Carcinomatosis)",
      category: "Ascites SAAG",
      subType: "SAAG = Serum Albumin - Ascitic Albumin • &ge;1.1 g/dL (Portal HTN) vs <1.1 g/dL (Non-Portal HTN)",
      proceduralProfile: "Biochemical equation identifying the pathophysiological hydrostatic pressure mechanism of ascites.",
      proceduralMechanism: "Elevated sinusoidal hydrostatic pressure forces protein-poor fluid into the peritoneum, creating a wide gradient.",
      clinicalHallmarks: "SAAG &ge;1.1 g/dL: Cirrhosis, heart failure, Budd-Chiari. SAAG <1.1 g/dL: Peritoneal carcinomatosis, TB peritonitis, nephrotic.",
      highYieldPearls: "SAAG &ge;1.1 g/dL indicates Portal Hypertension (Cirrhosis, CHF); SAAG <1.1 g/dL indicates Non-Portal HTN (Malignancy, TB)."
    },
    {
      id: "int2-fl-sbp-diagnostic-criteria",
      name: "Spontaneous Bacterial Peritonitis (SBP) (Ascitic PMN &ge;250/&mu;L, Ceftriaxone & IV Albumin Infusions)",
      category: "Infectious Ascites",
      subType: "Ascitic Absolute PMN &ge; 250/&mu;L • Bacterial Translocation • IV Cefotaxime/Ceftriaxone • IV Albumin (1.5 & 1.0 g/kg)",
      proceduralProfile: "Life-threatening bacterial infection of ascitic fluid occurring in decompensated cirrhotic patients.",
      proceduralMechanism: "Enteric bacteria translocate across compromised mucosal barriers into complement-deficient ascitic fluid.",
      clinicalHallmarks: "Ascitic PMN &ge;250/&mu;L confirms SBP; immediately start IV Ceftriaxone + IV Albumin to prevent hepatorenal syndrome.",
      highYieldPearls: "Ascitic fluid neutrophil count (PMN) &ge;250/&mu;L confirms SBP &rarr; start IV 3rd-gen Cephalosporin PLUS IV Albumin."
    },
    {
      id: "int2-fl-thoracentesis-rib-vector",
      name: "Thoracentesis Intercostal Rib Vector (Superior Rib Margin Entry Avoiding Subcostal VAN Bundle)",
      category: "Pleural Aspiration",
      subType: "Over Superior Rib Border • 1-2 Spaces Below Fluid • Avoids Subcostal Vein, Artery, Nerve (VAN)",
      proceduralProfile: "Needle aspiration of pleural fluid for diagnostic staging and therapeutic lung re-expansion.",
      proceduralMechanism: "Ultrasound identifies dependent fluid; entering over the superior rib margin avoids intercostal artery laceration.",
      clinicalHallmarks: "Always insert needle over the SUPERIOR margin of the rib to avoid the subcostal neurovascular bundle in the groove above.",
      highYieldPearls: "Always insert thoracentesis needles over the SUPERIOR border of the rib to avoid the subcostal VAN bundle."
    },
    {
      id: "int2-fl-lights-criteria-pleural-exudate",
      name: "Light's Criteria for Pleural Exudates (Pleural/Serum Protein >0.5 & LDH >0.6 Transudate Differentiation)",
      category: "Pleural Fluid Analysis",
      subType: "Exudate if &ge;1: Pleural/Serum Protein >0.5, Pleural/Serum LDH >0.6, or Pleural LDH >2/3 Upper Normal",
      proceduralProfile: "Gold standard diagnostic framework separating inflammatory exudates from hydrostatic transudates.",
      proceduralMechanism: "Increased capillary permeability leaks protein and LDH into pleural space (exudate); intact membranes leak transudate.",
      clinicalHallmarks: "Transudates meet NONE of the 3 criteria (CHF, cirrhosis). Exudates meet &ge;1 (pneumonia, malignancy, TB, pulmonary embolism).",
      highYieldPearls: "Light's Criteria: Exudate if Pleural/Serum Protein >0.5, Pleural/Serum LDH >0.6, or Pleural LDH >2/3 upper normal limit."
    }
  ],

  csf: [
    {
      id: "int2-cs-spinal-anatomy-tuffiers-line",
      name: "Spinal Cord Anatomy & Tuffier's Line (Conus Medullaris L1-L2 & Safe L3-L4/L4-L5 Subarachnoid Space)",
      category: "Spinal Landmarks",
      subType: "Tuffier's Line (Highest Point of Iliac Crests = L4) • Conus Medullaris (L1-L2) • Safe Puncture L3-L4 or L4-L5",
      proceduralProfile: "Topographical landmarks ensuring safe access to the lumbar cistern without injuring the spinal cord.",
      proceduralMechanism: "The adult spinal cord ends at L1-L2; the subarachnoid space extends to S2, providing a safe cauda equina puncture zone.",
      clinicalHallmarks: "Palpate iliac crests to locate L4 spinous process; insert spinal needle in L3-L4 or L4-L5 interspinous space.",
      highYieldPearls: "Tuffier's line (connecting iliac crests) crosses the L4 spinous process; safe lumbar puncture is performed at L3-L4 or L4-L5."
    },
    {
      id: "int2-cs-ligamentous-trajectory-dural-pops",
      name: "Ligamentous Trajectory & Dural 'Pops' (Ligamentum Flavum 1st Pop & Dural/Arachnoid 2nd Pop)",
      category: "Needle Trajectory",
      subType: "Skin &rarr; SubQ &rarr; Supraspinous &rarr; Interspinous &rarr; Flavum (1st Pop) &rarr; Epidural &rarr; Dura (2nd Pop) &rarr; CSF",
      proceduralProfile: "Tactile resistance feedback during advancement of the 20G/22G Quincke or Whitacre spinal needle.",
      proceduralMechanism: "Dense fibroelastic ligamentum flavum produces the first give; tenting of the dura/arachnoid produces the second pop.",
      clinicalHallmarks: "First tactile pop: Ligamentum flavum. Second tactile pop: Dura mater / arachnoid entering subarachnoid space.",
      highYieldPearls: "Layers traversed during LP: Skin &rarr; SubQ &rarr; Supraspinous &rarr; Interspinous &rarr; Ligamentum flavum (1st pop) &rarr; Dura (2nd pop)."
    },
    {
      id: "int2-cs-bacterial-meningitis-csf-dynamics",
      name: "Acute Bacterial Meningitis CSF Dynamics (PMN Pleocytosis >1,000, Hyperproteinorachia & Hypoglycorrhachia)",
      category: "Bacterial CSF",
      subType: "Opening Pressure >25 cm H2O • PMNs 1,000-10,000+ • Protein >100-500 mg/dL • Glucose <40% Blood Glucose",
      proceduralProfile: "Severe purulent infection of the subarachnoid space requiring emergent antimicrobial therapy.",
      proceduralMechanism: "Massive neutrophilic chemotaxis, blood-brain barrier breakdown, and bacterial glucose consumption.",
      clinicalHallmarks: "Marked PMN pleocytosis, protein >100 mg/dL, glucose <40% (often <20); start IV Vancomycin + Ceftriaxone + Dexamethasone.",
      highYieldPearls: "Bacterial Meningitis CSF: Marked PMN pleocytosis (>1,000), elevated protein, low glucose (<40% of serum), high opening pressure."
    },
    {
      id: "int2-cs-viral-fungal-sah-profiles",
      name: "Viral, Fungal & SAH Xanthochromia Profiles (Lymphocytic Pleocytosis, TB Hypoglycorrhachia & Supernatant Xanthochromia)",
      category: "Differential CSF",
      subType: "Viral (Lymphocytes, Normal Glucose) • Fungal/TB (Lymphocytes, Low Glucose) • SAH (Xanthochromia, Non-Clearing RBCs)",
      proceduralProfile: "Differential CSF analysis separating viral aseptic meningitis, fungal/TB chronic meningitis, and aneurysm rupture.",
      proceduralMechanism: "Viral meningitis preserves glucose transport; RBC lysis in subarachnoid space forms yellow bilirubin (xanthochromia).",
      clinicalHallmarks: "Viral: Normal glucose with lymphocytes. TB/Fungal: Very low glucose with lymphocytes. SAH: Xanthochromia in centrifuged CSF.",
      highYieldPearls: "Viral meningitis CSF has NORMAL glucose; fungal/TB meningitis has LOW glucose; SAH displays yellow xanthochromia."
    }
  ],

  pocus: [
    {
      id: "int2-po-focus-cardiac-windows",
      name: "Focused Cardiac Ultrasound FoCUS Windows (PLAX Pericardial Effusion, PSAX D-Sign & Apical 4-Chamber)",
      category: "Cardiac FoCUS",
      subType: "PLAX (Pericardial Effusion vs Pleural) • PSAX (D-Sign RV Overload) • A4C (RV Dilation) • Subxiphoid (Tamponade)",
      proceduralProfile: "Targeted point-of-care echocardiography assessing pericardial effusion, LV contractility, and RV strain.",
      proceduralMechanism: "Pericardial fluid is seen posterior to LV and anterior to descending aorta; RV pressure overload flattens the septum.",
      clinicalHallmarks: "Pericardial effusion lies anterior to descending aorta on PLAX; RV strain in massive PE produces 'D-shaped' LV on PSAX.",
      highYieldPearls: "On PLAX, pericardial effusion tracks ANTERIOR to the descending aorta; pleural effusion tracks POSTERIOR to the descending aorta."
    },
    {
      id: "int2-po-ivc-respiratory-manometry",
      name: "Inferior Vena Cava (IVC) Respiratory Manometry (Diameter & Collapsibility Index for Central Venous Pressure)",
      category: "IVC Assessment",
      subType: "IVC <2.1 cm with >50% Collapse (CVP 0-5 mmHg) vs IVC >2.1 cm with <50% Collapse (CVP 10-20 mmHg)",
      proceduralProfile: "Non-invasive sonographic surrogate estimating right atrial pressure and volume responsiveness.",
      proceduralMechanism: "Negative intrathoracic pressure on inspiration augments venous return, causing IVC collapse in hypovolemia.",
      clinicalHallmarks: "Plethoric, non-collapsing IVC (>2.1 cm, <50% collapse) indicates volume overload or tamponade; collapsing IVC indicates hypovolemia.",
      highYieldPearls: "An IVC <2.1 cm with >50% respiratory collapse corresponds to normal/low CVP (0-5 mmHg); plethoric IVC indicates high CVP."
    },
    {
      id: "int2-po-lung-blue-protocol-artifacts",
      name: "Lung Ultrasound BLUE Protocol Artifacts (A-Line Aeration Reverberations & Vertical Laser B-Lines)",
      category: "Lung Ultrasound",
      subType: "A-Lines (Horizontal Reverberations, Normal Lung) • B-Lines (&ge;3 Vertical 'Rockets', Pulmonary Edema/ARDS)",
      proceduralProfile: "Standardized point-of-care lung ultrasound diagnosing acute respiratory failure within 3 minutes.",
      proceduralMechanism: "A-lines reflect air-pleural acoustic impedance; B-lines reflect fluid accumulation in interlobular septa and alveoli.",
      clinicalHallmarks: "A-profile: Normal aerated lung (or COPD/asthma if dyspneic). B-profile (&ge;3 B-lines per zone bilaterally): Pulmonary edema.",
      highYieldPearls: "A-lines are horizontal normal aeration artifacts; &ge;3 vertical B-lines ('lung rockets') indicate pulmonary edema."
    },
    {
      id: "int2-po-pneumothorax-sonographic-proof",
      name: "Pneumothorax Sonographic Proof (Loss of Dynamic Lung Sliding, Barcode Sign & Lung Point Specificity)",
      category: "Pneumothorax POCUS",
      subType: "Loss of Shimmering Lung Sliding • Absence of B-Lines • Barcode / Stratosphere Sign on M-Mode • Lung Point (100% Specific)",
      proceduralProfile: "Bedside ultrasound modality for immediate, highly sensitive diagnosis of occult and tension pneumothorax.",
      proceduralMechanism: "Intrapleural air separates parietal and visceral pleura, eliminating sliding and creating a static reverberation barcode.",
      clinicalHallmarks: "Normal lung shows 'seashore sign' on M-mode; pneumothorax shows 'barcode/stratosphere sign'; lung point confirms boundary.",
      highYieldPearls: "Pneumothorax shows loss of lung sliding and a 'barcode sign' on M-mode; the 'lung point' sign is 100% specific for pneumothorax."
    }
  ]
};

interface ClinicalInt2LabViewerProps {
  initialMode?: Int2LabMode;
  height?: string;
  onNodeSelect?: (node: Int2LabNode) => void;
}

export default function ClinicalInt2LabViewer({
  initialMode = "vascular",
  height = "560px",
  onNodeSelect,
}: ClinicalInt2LabViewerProps) {
  const [activeMode, setActiveMode] = useState<Int2LabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return INT2_LAB_NODES[activeMode] || INT2_LAB_NODES.vascular;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: Int2LabNode) => {
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
            <Stethoscope size={14} /> INT-502
          </span>
          <span className={styles.titleText}>
            {activeMode === "vascular" && "Vascular Access & Arterial Lines: Central Venous Lines (IJV Seldinger) & Radial A-Lines"}
            {activeMode === "fluids" && "Diagnostic Paracentesis & Thoracentesis: SAAG Calculation, SBP (PMN >=250) & Light's Criteria"}
            {activeMode === "csf" && "Lumbar Puncture & CSF Manometry: Tuffier's L4-L5 Line, Dural Pops & Differential Diagnostics"}
            {activeMode === "pocus" && "Point-of-Care Ultrasound (POCUS): Focused Cardiac Echo (PLAX/PSAX/IVC) & Lung BLUE Protocol"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Procedural Skills Quiz"}
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
                <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Procedural &amp; Ultrasound Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Procedural Protocol: {quizTargetNode.clinicalHallmarks}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-cyan-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-cyan-950 text-xs rounded border border-cyan-700 text-cyan-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: Vascular Access */}
          {activeMode === "vascular" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplet size={14} /> Central Venous Catheterization &amp; Radial Arterial Lines
                </span>
                <span className="text-[11px] text-slate-400">IJV Seldinger &bull; Compressibility &bull; NAVEL &bull; Modified Allen</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-cyan-300 font-bold">Internal Jugular &amp; Subclavian Access</div>
                  <div className="text-slate-300 mt-1">IJV is thin-walled and easily compressible under gentle probe pressure, lateral to the carotid. Subclavian access has pneumothorax risk (~1-5%). Femoral vein lies medial to artery (NAVEL). NEVER lose control of the guidewire.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-cyan-300 font-bold">Radial Arterial Line &amp; Allen Test</div>
                  <div className="text-slate-300 mt-1">Verify ulnar collateral flow via Modified Allen test. Real-time dynamic needle-tip tracking with high-frequency linear probe allows continuous beat-to-beat arterial blood pressure transduction.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Fluids & Light's Criteria */}
          {activeMode === "fluids" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TestTube size={14} /> Ascitic SAAG, SBP &amp; Pleural Light's Criteria
                </span>
                <span className="text-[11px] text-slate-400">SAAG &ge;1.1 Portal HTN &bull; PMN &ge;250/uL &bull; Superior Rib Margin &bull; Light's</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-cyan-300 font-bold">Ascitic SAAG &amp; SBP Diagnosis</div>
                  <div className="text-slate-300 mt-1">SAAG = Serum Albumin - Ascitic Albumin. SAAG &ge;1.1 indicates Portal HTN (cirrhosis, CHF); SAAG &lt;1.1 indicates Non-Portal (malignancy). SBP: Ascitic PMN &ge;250/&mu;L &rarr; start IV Ceftriaxone + IV Albumin.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-cyan-300 font-bold">Thoracentesis &amp; Light's Criteria</div>
                  <div className="text-slate-300 mt-1">Always insert thoracentesis needle OVER the superior rib margin (avoids subcostal VAN bundle). Light's Criteria: Exudate if Pleural/Serum Protein &gt;0.5, Pleural/Serum LDH &gt;0.6, or Pleural LDH &gt;2/3 upper normal limit.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Lumbar Puncture */}
          {activeMode === "csf" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain size={14} /> Spinal Anatomy, Dural Pops &amp; CSF Interpretation
                </span>
                <span className="text-[11px] text-slate-400">Tuffier's L4 &bull; Conus L1-L2 &bull; Flavum 1st Pop &bull; Bacterial vs Viral</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-cyan-300 font-bold">Anatomical Trajectory &amp; Pops</div>
                  <div className="text-slate-300 mt-1">Tuffier's line (iliac crests) crosses L4. Adult conus ends at L1-L2; perform LP safely at L3-L4 or L4-L5. Ligamentum flavum produces 1st pop; dura/arachnoid produces 2nd pop entering subarachnoid space.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-cyan-300 font-bold">Differential CSF Diagnostics</div>
                  <div className="text-slate-300 mt-1">Bacterial Meningitis: PMNs &gt;1,000, protein &gt;100-500, glucose &lt;40% blood glucose. Viral: Lymphocytes, NORMAL glucose. Fungal/TB: Lymphocytes, very low glucose. SAH: Xanthochromia (yellow supernatant).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: POCUS */}
          {activeMode === "pocus" && (
            <div className={styles.proceduralCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Radio size={14} /> Focused Cardiac Echo &amp; Lung BLUE Protocol
                </span>
                <span className="text-[11px] text-slate-400">PLAX / PSAX D-Sign &bull; IVC Collapsibility &bull; B-Lines &bull; Barcode Sign</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-cyan-300 font-bold">Focused Cardiac Ultrasound (FoCUS)</div>
                  <div className="text-slate-300 mt-1">PLAX: Pericardial fluid tracks anterior to descending aorta. PSAX: D-shaped LV indicates RV overload (PE). IVC &lt;2.1 cm with &gt;50% collapse indicates normal/low CVP (0-5 mmHg); plethoric IVC indicates elevated CVP.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-cyan-300 font-bold">Lung Ultrasound (BLUE Protocol)</div>
                  <div className="text-slate-300 mt-1">A-lines: Normal horizontal aeration reverberations. B-lines (&ge;3 vertical 'rockets'): Alveolar-interstitial pulmonary edema. Pneumothorax: Loss of lung sliding, barcode/stratosphere sign, and 100% specific lung point.</div>
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
                    <span className="text-cyan-400 font-bold">Procedure:</span> {node.proceduralProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect Procedural Protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Procedural & POCUS Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Procedural Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Procedural Protocol</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Anatomical &amp; Physical Mechanism</div>
            <div className="text-xs text-cyan-300 font-semibold">{activeNode.proceduralProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.proceduralMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Operations</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Procedural Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("vascular")}
          className={`${styles.modeTab} ${activeMode === "vascular" ? styles.modeTabActive : ""}`}
        >
          💉 1. Vascular &amp; A-Lines
        </button>
        <button
          onClick={() => setActiveMode("fluids")}
          className={`${styles.modeTab} ${activeMode === "fluids" ? styles.modeTabActive : ""}`}
        >
          🧪 2. Paracentesis &amp; Light's
        </button>
        <button
          onClick={() => setActiveMode("csf")}
          className={`${styles.modeTab} ${activeMode === "csf" ? styles.modeTabActive : ""}`}
        >
          🧠 3. Lumbar Puncture CSF
        </button>
        <button
          onClick={() => setActiveMode("pocus")}
          className={`${styles.modeTab} ${activeMode === "pocus" ? styles.modeTabActive : ""}`}
        >
          📡 4. POCUS (Echo &amp; Lung)
        </button>
      </div>
    </div>
  );
}
