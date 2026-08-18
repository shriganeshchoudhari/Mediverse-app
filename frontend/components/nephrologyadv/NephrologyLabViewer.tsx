"use client";

import React, { useState, useMemo } from "react";
import styles from "./NephrologyLabViewer.module.css";
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

export type NephrologyLabMode = "glomerular" | "aki" | "rta" | "electrolytes";

export interface NephrologyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  histopathologyProfile: string;
  pathophysiology: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const NEPHROLOGY_LAB_NODES: Record<NephrologyLabMode, NephrologyLabNode[]> = {
  glomerular: [
    {
      id: "neph-glom-mcd",
      name: "Minimal Change Disease (Podocyte Foot Effacement)",
      category: "Nephrotic Syndrome",
      subType: "Pediatric Peak (2-6 yrs) • Normal LM • Podocyte Effacement on EM • Corticosteroid Responsive",
      histopathologyProfile: "Light microscopy and immunofluorescence are completely normal; electron microscopy reveals diffuse foot process effacement.",
      pathophysiology: "Cytokine-mediated disruption of glomerular polyanion charge barrier causes selective albuminuria.",
      clinicalHallmarks: "Sudden periorbital and pedal edema, severe hypoalbuminemia (<2.5 g/dL), heavy selective proteinuria; >90% respond to Prednisone.",
      highYieldPearls: "Most common nephrotic syndrome in children; does NOT progress to chronic kidney disease if steroid-responsive."
    },
    {
      id: "neph-glom-membranous",
      name: "Membranous Nephropathy (Anti-PLA2R & Spike-Dome)",
      category: "Nephrotic Syndrome",
      subType: "Anti-PLA2R Autoantibodies (80%) • 'Spike-and-Dome' on EM • High Renal Vein Thrombosis Risk",
      histopathologyProfile: "Diffuse capillary wall thickening; granular subepithelial IgG/C3 on IF; spike-and-dome projections on silver stain EM.",
      pathophysiology: "Subepithelial immune complex formation against M-type phospholipase A2 receptors on podocytes.",
      clinicalHallmarks: "Nephrotic syndrome in non-diabetic adults; carries the HIGHEST risk of renal vein thrombosis due to antithrombin III urinary loss.",
      highYieldPearls: "Spike-and-dome on EM + anti-PLA2R serology; rule out occult malignancy in elderly patients."
    },
    {
      id: "neph-glom-iga-berger",
      name: "IgA Nephropathy / Berger Disease (Synpharyngitic)",
      category: "Nephritic Syndrome",
      subType: "Gross Hematuria During URI (1-2 days) • Mesangial IgA Deposition • Normal Complement",
      histopathologyProfile: "Mesangial hypercellularity with prominent granular mesangial IgA and C3 deposition on immunofluorescence.",
      pathophysiology: "Galactose-deficient IgA1 polymerizes and forms immune complexes that deposit in the glomerular mesangium.",
      clinicalHallmarks: "Episodic gross hematuria concurrent with respiratory or GI infection ('synpharyngitic'); normal serum C3/C4.",
      highYieldPearls: "Contrasts with PSGN which occurs 1-3 weeks AFTER pharyngitis/impetigo and has DEPRESSED complement C3."
    },
    {
      id: "neph-glom-goodpasture",
      name: "Anti-GBM Disease / Goodpasture (Linear IF & Hemoptysis)",
      category: "Nephritic / RPGN",
      subType: "Linear IgG along GBM • Alpha-3 Chain Type IV Collagen • Hemoptysis + Rapidly Progressive GN",
      histopathologyProfile: "Bowman space crescent formation on LM; pathognomonic continuous LINEAR IgG and C3 deposition along the GBM on IF.",
      pathophysiology: "Autoantibodies directed against the non-collagenous domain of alpha-3 chain of Type IV collagen in GBM and alveolar membranes.",
      clinicalHallmarks: "Pulmonary alveolar hemorrhage (hemoptysis) combined with rapidly progressive crescentic glomerulonephritis; emergency plasmapheresis + cyclophosphamide.",
      highYieldPearls: "Linear IF = Goodpasture; Granular IF = Lupus/PSGN; Negative IF (Pauci-immune) = ANCA Vasculitis (GPA/MPA)."
    }
  ],

  aki: [
    {
      id: "neph-aki-prerenal",
      name: "Prerenal Azotemia (FeNa <1.0% & Hyaline Casts)",
      category: "Renal Hypoperfusion",
      subType: "BUN/Cr >20:1 • FeNa <1.0% • UNa <20 mEq/L • Urine Osm >500 • Hyaline Casts",
      histopathologyProfile: "Intact tubular histology; high tubular flow-dependent hyaline casts from Tamm-Horsfall mucoprotein condensation.",
      pathophysiology: "True volume depletion or effective arterial volume reduction triggers maximal tubular sodium/water reabsorption.",
      clinicalHallmarks: "Dehydration, hypotension, dry mucosa, NSAID or ACEi use; completely reverses with intravenous 0.9% crystalloid hydration.",
      highYieldPearls: "FeNa <1.0% and FeUrea <35% prove intact tubular reabsorptive capacity; reversible with volume repletion."
    },
    {
      id: "neph-aki-atn",
      name: "Acute Tubular Necrosis (FeNa >2.0% & Muddy Brown Casts)",
      category: "Intrinsic Renal Injury",
      subType: "BUN/Cr <15:1 • FeNa >2.0% • UNa >40 mEq/L • Urine Osm <350 • Muddy Brown Casts",
      histopathologyProfile: "Patchy necrosis of proximal tubular epithelial cells (S3 segment) with denudation of basement membrane and intratubular obstruction.",
      pathophysiology: "Prolonged renal ischemia or direct nephrotoxic exposure (aminoglycosides, radiocontrast, cisplatin, myoglobin) destroys tubular epithelium.",
      clinicalHallmarks: "Oliguric or non-oliguric acute renal failure; muddy brown granular casts on microscopy; supportive care and dialysis if indicated.",
      highYieldPearls: "Muddy brown granular casts + FeNa >2.0% are pathognomonic of ATN; urine is isosthenuric (<350 mOsm/kg)."
    },
    {
      id: "neph-aki-ain",
      name: "Acute Interstitial Nephritis (Drug Rash & WBC Casts)",
      category: "Tubulointerstitial Disease",
      subType: "Drug-Induced (NSAIDs/Penicillins/PPIs) • Fever • Maculopapular Rash • Eosinophils • WBC Casts",
      histopathologyProfile: "Prominent interstitial inflammatory infiltrate rich in T lymphocytes, plasma cells, and eosinophils with tubulitis.",
      pathophysiology: "Type IV hypersensitivity reaction against drug-hapten complex within the renal interstitium.",
      clinicalHallmarks: "Triad of fever, rash, and eosinophilia (seen in ~30%); sterile pyuria with WBC casts and eosinophiluria; stop causative medication.",
      highYieldPearls: "WBC casts without bacteria on Gram stain (sterile pyuria) + eosinophils indicate AIN; treat with drug cessation and steroids."
    },
    {
      id: "neph-aki-rhabdo",
      name: "Rhabdomyolysis Nephrotoxicity (Heme+ Dipstick No RBCs)",
      category: "Pigment Nephropathy",
      subType: "Crush Injury / Statins • Serum CK >10,000 • Heme+ Urine Dipstick with NO RBCs on Microscopy",
      histopathologyProfile: "Intratubular pigmented myoglobin casts obstructing distal nephrons with severe proximal tubular heme cytotoxicity.",
      pathophysiology: "Massive skeletal muscle necrosis releases free myoglobin, precipitating intratubular cast obstruction and renal vasoconstriction.",
      clinicalHallmarks: "Dark tea-colored urine, profound muscle pain, severe hyperkalemia, hyperphosphatemia, hypocalcemia; aggressive IV fluid hydration.",
      highYieldPearls: "Dipstick detects heme ring (cannot distinguish hemoglobin from myoglobin); absence of RBCs on microscopy proves myoglobinuria."
    }
  ],

  rta: [
    {
      id: "neph-rta-type1-distal",
      name: "Type 1 Distal RTA (Impaired H+ Secretion & Stones)",
      category: "Distal Acidification Defect",
      subType: "Urine pH >5.5 Always • Positive UAG (>0) • Hypokalemia • Nephrocalcinosis / CaPO4 Stones",
      histopathologyProfile: "Defective H+-ATPase or H+/K+-ATPase in alpha-intercalated cells of the cortical collecting duct.",
      pathophysiology: "Failure to excrete hydrogen ions prevents urinary acidification, causing systemic metabolic acidosis and hypocitraturia.",
      clinicalHallmarks: "Severe metabolic acidosis, hypokalemia, bilateral medullary nephrocalcinosis; associated with Sjögren syndrome and Amphotericin B.",
      highYieldPearls: "Urine pH is FIXED >5.5 even during severe systemic acidemia; Positive Urine Anion Gap (UNa + UK - UCl > 0)."
    },
    {
      id: "neph-rta-type2-proximal",
      name: "Type 2 Proximal RTA (Fanconi Bicarbonate Wasting)",
      category: "Proximal Reabsorption Defect",
      subType: "Impaired HCO3- Reabsorption in PCT • Hypokalemia • Fanconi Syndrome (Glucosuria/Phosphaturia)",
      histopathologyProfile: "Proximal convoluted tubule apical Na+/H+ exchanger (NHE3) or basolateral Na+/HCO3- cotransporter impairment.",
      pathophysiology: "Lowered renal threshold for bicarbonate reabsorption leads to massive early bicarbonaturia until steady-state low serum HCO3- is reached.",
      clinicalHallmarks: "Fanconi syndrome features: glucosuria with normal blood sugar, aminoaciduria, phosphaturic rickets/osteomalacia; Multiple Myeloma, Tenofovir.",
      highYieldPearls: "Urine pH can acidify (<5.5) once serum HCO3- falls below threshold; Negative Urine Anion Gap; NO nephrocalcinosis."
    },
    {
      id: "neph-rta-type4-hyperkalemic",
      name: "Type 4 Hyperkalemic RTA (Aldosterone Deficiency/Resistance)",
      category: "Aldosterone Axis Defect",
      subType: "HYPERKALEMIA • Urine pH <5.5 • Positive UAG • Diabetic Nephropathy / ACEi / Hyporeninemic",
      histopathologyProfile: "Impaired sodium reabsorption in principal cells diminishes the lumen-negative potential required for K+ and H+ secretion.",
      pathophysiology: "Hyporeninemic hypoaldosteronism or collecting duct aldosterone resistance suppresses renal potassium and proton excretion.",
      clinicalHallmarks: "Mild non-anion gap metabolic acidosis with prominent hyperkalemia in diabetic patients with moderate CKD; managed with dietary K+ restriction and Fludrocortisone.",
      highYieldPearls: "ONLY RTA with HYPERKALEMIA; Urine pH <5.5; most common RTA encountered in clinical medicine."
    },
    {
      id: "neph-rta-uag-classifier",
      name: "Urine Anion Gap Diagnostic Classifier (UAG = UNa + UK - UCl)",
      category: "Electrolyte Calculation",
      subType: "Positive UAG (>0) = Impaired NH4+ Excretion (RTA 1/4) • Negative UAG (<0) = Intact NH4+ (Diarrhea/RTA 2)",
      histopathologyProfile: "Surrogate biomarker for unmeasured urinary ammonium cation (NH4+) excretion.",
      pathophysiology: "NH4+ is excreted with chloride (Cl-); increased NH4+ excretion causes urinary Cl- to exceed Na+ + K+, creating a negative UAG.",
      clinicalHallmarks: "Used to differentiate GI bicarbonate loss (diarrhea: UAG negative) from renal tubular acidification failure (Type 1 RTA: UAG positive).",
      highYieldPearls: "Normal Anion Gap Acidosis with Positive UAG = Renal etiology (Type 1/4 RTA); Negative UAG = Extra-renal GI loss (Diarrhea)."
    }
  ],

  electrolytes: [
    {
      id: "neph-elec-siadh",
      name: "SIADH Euvolemic Hyponatremia (Concentrated Urine)",
      category: "Water Homeostasis",
      subType: "Euvolemia • Urine Osm >100 • UNa >40 mEq/L • Low Uric Acid • ODS Risk with Rapid Correction",
      histopathologyProfile: "Constitutive aquaporin-2 channel insertion into medullary collecting ducts driven by unsuppressed ADH (vasopressin).",
      pathophysiology: "Excessive free water retention expands extracellular volume without edema, promoting natriuresis and profound hyponatremia.",
      clinicalHallmarks: "Small cell lung cancer, stroke, head trauma, SSRIs; treated with fluid restriction and Vaptans; sodium rise MUST NOT exceed 8 mEq/L/24h.",
      highYieldPearls: "Euvolemic + Urine Osm >100 + UNa >40 = SIADH; Overcorrection causes irreversible Osmotic Demyelination Syndrome (locked-in state)."
    },
    {
      id: "neph-elec-hyperkalemia-sine",
      name: "Severe Hyperkalemia Sine-Wave (IV Calcium Rescue)",
      category: "Potassium Electrophysiology",
      subType: "K+ >7.5 mEq/L • Widened QRS • Sine-Wave Pattern • Step 1: IV Calcium Gluconate (Membrane Stabilization)",
      histopathologyProfile: "Partial depolarization of resting cardiac membrane potential inactivates fast voltage-gated Na+ channels, slowing conduction.",
      pathophysiology: "Elevated extracellular potassium alters the Nernst equilibrium, causing progressive ECG changes from peaked T waves to sine-wave arrest.",
      clinicalHallmarks: "Weakness, flaccid paralysis, life-threatening arrhythmias; Immediate IV Calcium Gluconate -> Insulin + D50 -> Hemodialysis.",
      highYieldPearls: "IV Calcium does NOT lower serum potassium; it immediately stabilizes myocardial membranes to prevent fatal ventricular fibrillation."
    },
    {
      id: "neph-elec-hypokalemia-uwave",
      name: "Hypokalemic Ventricular Ectopy (U Waves & Magnesium)",
      category: "Potassium Electrophysiology",
      subType: "K+ <3.0 mEq/L • Prominent U Waves • Flattened T Waves • Torsades Risk • Replete Magnesium First!",
      histopathologyProfile: "Hyperpolarization of myocardial cells delays phase 3 repolarization and prolongs the relative refractory period.",
      pathophysiology: "Loss of intracellular potassium triggers early afterdepolarizations, manifesting as prominent U waves and malignant ventricular arrhythmias.",
      clinicalHallmarks: "Muscle cramps, hyporeflexia, paralytic ileus, ventricular ectopy; treat with oral/IV KCl and ALWAYS replete co-existing hypomagnesemia.",
      highYieldPearls: "Hypomagnesemia inhibits Na+/K+-ATPase, causing refractory renal potassium wasting; potassium CANNOT be corrected without magnesium."
    },
    {
      id: "neph-elec-ods-pontine",
      name: "Osmotic Demyelination Syndrome (Central Pontine Myelinolysis)",
      category: "Neurological Complication",
      subType: "Overly Rapid Hyponatremia Correction (>8-10 mEq/L/24h) • Dysarthria • Quadriplegia • 'Locked-In'",
      histopathologyProfile: "Non-inflammatory loss of myelin in the basis pontis with preservation of neurons and axis cylinders.",
      pathophysiology: "Rapid rise in extracellular tonicity pulls water out of chronically adapted brain cells, leading to oligodendrocyte apoptosis.",
      clinicalHallmarks: "Biphasic illness: initial improvement followed 2-6 days later by spastic quadriplegia, pseudobulbar palsy, and locked-in syndrome.",
      highYieldPearls: "From Low to High, Your Pons Will Die (ODS); From High to Low, Your Brain Will Blow (Cerebral Edema)."
    }
  ]
};

interface NephrologyLabViewerProps {
  initialMode?: NephrologyLabMode;
  height?: string;
  onNodeSelect?: (node: NephrologyLabNode) => void;
}

export default function NephrologyLabViewer({
  initialMode = "glomerular",
  height = "560px",
  onNodeSelect,
}: NephrologyLabViewerProps) {
  const [activeMode, setActiveMode] = useState<NephrologyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Glomerular Selector State
  const [selectedGlom, setSelectedGlom] = useState<"mcd" | "membranous" | "iga" | "goodpasture">("mcd");

  // AKI Profiler State
  const [selectedAki, setSelectedAki] = useState<"prerenal" | "atn" | "ain" | "rhabdo">("prerenal");

  const glomDetails = useMemo(() => {
    if (selectedGlom === "mcd") {
      return {
        title: "Minimal Change Disease (Pediatric Nephrotic Syndrome)",
        profile: "Heavy Proteinuria (>3.5g) • Hypoalbuminemia • Normal LM • Podocyte Effacement on EM",
        rx: "First-line Corticosteroids (Prednisone) with >90% complete remission",
        pearl: "Most common pediatric nephrotic syndrome; no progression to ESRD if steroid-responsive."
      };
    } else if (selectedGlom === "membranous") {
      return {
        title: "Membranous Nephropathy (Anti-PLA2R & Spike-Dome)",
        profile: "Anti-PLA2R Antibodies (80%) • 'Spike-and-Dome' Subepithelial IgG • Thickened GBM",
        rx: "Highest risk of Renal Vein Thrombosis; screen for underlying solid tumors",
        pearl: "Subepithelial electron-dense deposits with intervening spike-like projections of GBM matrix."
      };
    } else if (selectedGlom === "iga") {
      return {
        title: "IgA Nephropathy / Berger Disease (Synpharyngitic Hematuria)",
        profile: "Episodic Gross Hematuria DURING URI (1-2 days) • Mesangial IgA Deposition • Normal Complement",
        rx: "ACE inhibitors/ARBs for proteinuria reduction; Corticosteroids for progressive disease",
        pearl: "Contrasts with PSGN which develops 1-3 weeks post-infection and has low serum C3."
      };
    } else {
      return {
        title: "Anti-GBM Disease / Goodpasture Syndrome",
        profile: "Linear IgG along GBM • Alpha-3 Chain Type IV Collagen • Hemoptysis + Rapidly Progressive GN",
        rx: "Emergency Plasmapheresis + Cyclophosphamide + High-dose Corticosteroids",
        pearl: "Linear IF = Goodpasture; Granular IF = Immune Complex; Negative IF = Pauci-immune ANCA."
      };
    }
  }, [selectedGlom]);

  const akiDetails = useMemo(() => {
    if (selectedAki === "prerenal") {
      return {
        title: "Prerenal Azotemia (Volume Depletion / Hypoperfusion)",
        indices: "BUN/Cr >20:1 • FeNa <1.0% • FeUrea <35% • UNa <20 mEq/L • Urine Osm >500 • Hyaline Casts",
        rx: "Intravenous 0.9% Normal Saline volume expansion; discontinue NSAIDs/ACE inhibitors",
        pearl: "FeNa <1.0% proves intact tubular reabsorption; reverses completely with volume resuscitation."
      };
    } else if (selectedAki === "atn") {
      return {
        title: "Acute Tubular Necrosis (Intrinsic Ischemic/Toxic Injury)",
        indices: "BUN/Cr <15:1 • FeNa >2.0% • UNa >40 mEq/L • Urine Osm <350 • Muddy Brown Granular Casts",
        rx: "Supportive management, avoidance of nephrotoxins, renal replacement therapy if needed",
        pearl: "Muddy brown casts + FeNa >2.0% are diagnostic of ATN; urine is isosthenuric (<350 mOsm/kg)."
      };
    } else if (selectedAki === "ain") {
      return {
        title: "Acute Interstitial Nephritis (Drug Hypersensitivity)",
        indices: "Drug exposure (NSAIDs, Penicillins, PPIs) • Triad of Fever, Rash, Eosinophilia • WBC Casts",
        rx: "Immediate cessation of offending agent +/- Oral Corticosteroid therapy",
        pearl: "WBC casts in the absence of urinary tract infection (sterile pyuria) strongly indicate AIN."
      };
    } else {
      return {
        title: "Rhabdomyolysis-Induced Pigment Nephropathy",
        indices: "Muscle trauma/statins • Serum CK >10,000 • Dipstick Heme+ with NO RBCs on Microscopy",
        rx: "Aggressive IV crystalloid volume resuscitation (target urine output 200-300 mL/h)",
        pearl: "Urine dipstick reacts with heme in myoglobin; microscopic absence of RBCs confirms myoglobinuria."
      };
    }
  }, [selectedAki]);

  const currentNodes = useMemo(() => {
    return NEPHROLOGY_LAB_NODES[activeMode] || NEPHROLOGY_LAB_NODES.glomerular;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: NephrologyLabNode) => {
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
            <TestTube size={14} /> NEPH-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "glomerular" && "Glomerulopathies: Nephritic vs Nephrotic Syndromes & Immunofluorescence"}
            {activeMode === "aki" && "Acute Kidney Injury & Urinalysis Casts Diagnostic Profiler"}
            {activeMode === "rta" && "Renal Tubular Acidoses (Types 1, 2, 4) & Urine Anion Gap"}
            {activeMode === "electrolytes" && "Sodium, Water Balance & Potassium Electrophysiology"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Nephrology Diagnostic Quiz"}
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
                <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  Nephrology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Renal Pathology: {quizTargetNode.clinicalHallmarks}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-indigo-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-indigo-950 text-xs rounded border border-indigo-700 text-indigo-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: Glomerulopathies Matrix */}
          {activeMode === "glomerular" && (
            <div className={styles.nephCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplet size={14} /> Glomerular Disease Diagnostic Suite
                </span>
                <span className="text-[11px] text-slate-400">Nephrotic vs Nephritic &bull; EM &bull; IF Patterns</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedGlom("mcd")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedGlom === "mcd"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  👶 Minimal Change
                </button>
                <button
                  onClick={() => setSelectedGlom("membranous")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedGlom === "membranous"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🛡️ Membranous (PLA2R)
                </button>
                <button
                  onClick={() => setSelectedGlom("iga")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedGlom === "iga"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🩸 IgA Nephropathy
                </button>
                <button
                  onClick={() => setSelectedGlom("goodpasture")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedGlom === "goodpasture"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚡ Goodpasture (Linear)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-indigo-300">{glomDetails.title}</div>
                <div className="text-emerald-400 font-bold mt-1">{glomDetails.profile}</div>
                <div className="text-slate-300 mt-1"><strong className="text-indigo-400">Clinical Action:</strong> {glomDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">High-Yield Pearl:</strong> {glomDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 2: AKI & Urinalysis */}
          {activeMode === "aki" && (
            <div className={styles.nephCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={14} /> AKI Profiler &amp; Urinalysis Casts Matrix
                </span>
                <span className="text-[11px] text-slate-400">FeNa &bull; FeUrea &bull; BUN/Cr &bull; Sediments</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedAki("prerenal")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAki === "prerenal"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💧 Prerenal (FeNa &lt;1%)
                </button>
                <button
                  onClick={() => setSelectedAki("atn")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAki === "atn"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🪵 Intrinsic ATN
                </button>
                <button
                  onClick={() => setSelectedAki("ain")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAki === "ain"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💊 Interstitial (AIN)
                </button>
                <button
                  onClick={() => setSelectedAki("rhabdo")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAki === "rhabdo"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🥩 Rhabdomyolysis
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-indigo-300">{akiDetails.title}</div>
                <div className="text-emerald-400 font-bold mt-1">{akiDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-indigo-400">Management:</strong> {akiDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Diagnostic Rule:</strong> {akiDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 3: Renal Tubular Acidoses */}
          {activeMode === "rta" && (
            <div className={styles.nephCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Renal Tubular Acidoses (RTA) Workstation
                </span>
                <span className="text-[11px] text-slate-400">Type 1 &bull; Type 2 &bull; Type 4 &bull; Urine Anion Gap</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Type 1 Distal RTA</div>
                  <div className="text-slate-300 mt-1">Urine pH &gt;5.5, Positive UAG, Hypokalemia, Bilateral Nephrocalcinosis &amp; CaPO4 stones. Alpha-intercalated H+ pump failure.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Type 2 Proximal RTA</div>
                  <div className="text-slate-300 mt-1">Impaired proximal HCO3- reabsorption, Negative UAG, Hypokalemia, Fanconi syndrome (glucosuria, phosphaturia, rickets).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Type 4 Hyperkalemic RTA</div>
                  <div className="text-slate-300 mt-1">ONLY RTA with HYPERKALEMIA. Urine pH &lt;5.5, Positive UAG. Hypoaldosteronism in diabetic nephropathy.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Sodium & Potassium Electrophysiology */}
          {activeMode === "electrolytes" && (
            <div className={styles.nephCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> Sodium, Water &amp; Potassium Electrophysiology
                </span>
                <span className="text-[11px] text-slate-400">SIADH &bull; ODS &bull; Hyperkalemia Sine-Wave &bull; Calcium Rescue</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">SIADH &amp; ODS Prevention</div>
                  <div className="text-slate-300 mt-1">Euvolemic hypotonic hyponatremia with concentrated urine (Osm &gt;100, UNa &gt;40). Sodium correction must NOT exceed 8 mEq/L/24h to avoid Osmotic Demyelination Syndrome (locked-in state).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Hyperkalemia Emergency Protocol</div>
                  <div className="text-slate-300 mt-1">1. IV Calcium Gluconate (immediate membrane stabilization); 2. Insulin + D50, Albuterol (intracellular shifting); 3. Diuretics / Hemodialysis (potassium elimination).</div>
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
                    <span className="text-indigo-400 font-bold">Histopathology:</span> {node.histopathologyProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect profile</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Nephrology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Nephrology Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧪 Renal Entity / Disorder</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Histopathology &amp; Pathophysiology</div>
            <div className="text-xs text-indigo-300 font-semibold">{activeNode.histopathologyProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiology}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🩺 Clinical Hallmarks &amp; Management</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Diagnostic Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("glomerular")}
          className={`${styles.modeTab} ${activeMode === "glomerular" ? styles.modeTabActive : ""}`}
        >
          🩸 1. Glomerulopathies
        </button>
        <button
          onClick={() => setActiveMode("aki")}
          className={`${styles.modeTab} ${activeMode === "aki" ? styles.modeTabActive : ""}`}
        >
          💧 2. AKI &amp; Urinalysis
        </button>
        <button
          onClick={() => setActiveMode("rta")}
          className={`${styles.modeTab} ${activeMode === "rta" ? styles.modeTabActive : ""}`}
        >
          🧪 3. Renal Tubular Acidoses
        </button>
        <button
          onClick={() => setActiveMode("electrolytes")}
          className={`${styles.modeTab} ${activeMode === "electrolytes" ? styles.modeTabActive : ""}`}
        >
          ⚡ 4. Na &amp; K Electrophysiology
        </button>
      </div>
    </div>
  );
}
