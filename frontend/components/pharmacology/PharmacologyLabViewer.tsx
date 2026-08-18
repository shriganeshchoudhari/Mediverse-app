"use client";

import React, { useState, useMemo } from "react";
import styles from "./PharmacologyLabViewer.module.css";
import {
  Activity,
  Flame,
  Zap,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Search,
  Pill,
  Calculator,
  Heart,
  TrendingUp,
} from "lucide-react";

export type PharmLabMode = "pkpd" | "autonomics" | "cardiorenal" | "antimicrobials";

export interface PharmLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  mechanismOfAction: string;
  clinicalIndications: string;
  adverseEffectsAndToxicity: string;
  highYieldPearl: string;
}

export const PHARM_NODES: Record<PharmLabMode, PharmLabNode[]> = {
  pkpd: [
    {
      id: "pk-loading-maintenance",
      name: "1. Loading Dose (LD) vs Maintenance Dose (MD)",
      category: "Pharmacokinetic Equations",
      subType: "Dose Optimization at Steady State",
      mechanismOfAction: "LD = (Target Cp * Vd) / F; MD = (Target Cp * CL * tau) / F.",
      clinicalIndications: "Immediate attainment of therapeutic plasma concentration in emergencies (LD for Digoxin, Phenytoin, Lidocaine, Vancomycin); continuous steady-state maintenance.",
      adverseEffectsAndToxicity: "Failure to adjust MD in renal/hepatic impairment causes toxic drug accumulation; LD is independent of clearance.",
      highYieldPearl: "Loading Dose depends ONLY on Volume of Distribution (Vd), NOT on Clearance. Maintenance Dose depends on Clearance (CL)."
    },
    {
      id: "elimination-kinetics",
      name: "2. Zero-Order vs First-Order Elimination",
      category: "Pharmacokinetic Kinetics",
      subType: "Metabolic Enzyme Saturation",
      mechanismOfAction: "First-Order: constant percentage eliminated per hour. Zero-Order: constant absolute amount eliminated per hour (PEA drugs).",
      clinicalIndications: "Therapeutic drug monitoring of Phenytoin, Ethanol, and Aspirin/Salicylates.",
      adverseEffectsAndToxicity: "In zero-order kinetics, small dose increases cause disproportionate, explosive toxic surges in plasma concentration.",
      highYieldPearl: "Zero-order elimination mnemonic: PEA (Phenytoin, Ethanol, Aspirin at toxic doses)."
    },
    {
      id: "antagonism-dynamics",
      name: "3. Competitive vs Non-Competitive Antagonists",
      category: "Pharmacodynamics & Receptor Curves",
      subType: "Dose-Response Curve Shifts",
      mechanismOfAction: "Competitive: shifts curve RIGHT (increases EC50 / decreases potency, Emax unchanged). Non-competitive: depresses curve DOWN (decreases Emax, EC50 unchanged).",
      clinicalIndications: "Receptor pharmacotherapy (e.g. Naloxone for opioids, Phentolamine for alpha-blockade).",
      adverseEffectsAndToxicity: "Irreversible antagonists (e.g. Phenoxybenzamine for pheochromocytoma) cannot be overcome by high agonist surges.",
      highYieldPearl: "Competitive antagonists can be completely overcome by adding more agonist; non-competitive antagonists cannot."
    }
  ],

  autonomics: [
    {
      id: "epinephrine-reversal",
      name: "1. Epinephrine & Dale's Epinephrine Reversal",
      category: "Adrenergic Hemodynamics",
      subType: "Alpha + Beta Agonism -> Alpha Blockade Unmasking",
      mechanismOfAction: "At high doses, Alpha-1 vasoconstriction increases MAP. With alpha-blocker pretreatment (Phentolamine), Beta-2 vasodilation proceeds unopposed, dropping MAP.",
      clinicalIndications: "Anaphylaxis, cardiac arrest, local anesthetic vasoconstrictor; pheochromocytoma diagnosis.",
      adverseEffectsAndToxicity: "Hypertensive crisis, arrhythmias; severe hypotension if alpha-agonist is given after alpha-blocker.",
      highYieldPearl: "Epinephrine reversal proves that Epinephrine possesses inherent vasodilating Beta-2 actions masked by stronger Alpha-1 vasoconstriction."
    },
    {
      id: "norepinephrine-reflex",
      name: "2. Norepinephrine & Reflex Bradycardia",
      category: "Sympathetic Vasopressor",
      subType: "Alpha-1 > Alpha-2 > Beta-1",
      mechanismOfAction: "Potent Alpha-1 vasoconstriction markedly increases SVR and MAP -> carotid sinus baroreceptor firing -> parasympathetic vagal reflex bradycardia.",
      clinicalIndications: "First-line vasopressor of choice for Septic Shock, cardiogenic shock, and severe vasodilatory hypotension.",
      adverseEffectsAndToxicity: "Peripheral tissue necrosis from extravasation (antidote: local Phentolamine infiltration), digital ischemia.",
      highYieldPearl: "Even though Norepinephrine has Beta-1 activity, its intense Alpha-1 vasoconstriction triggers baroreceptor reflex bradycardia."
    },
    {
      id: "isoproterenol-phenylephrine",
      name: "3. Isoproterenol (Beta) vs Phenylephrine (Alpha-1)",
      category: "Pure Receptor Agonists",
      subType: "Pure Beta-1/2 vs Pure Alpha-1",
      mechanismOfAction: "Isoproterenol: Beta-1 + Beta-2 -> tachycardia, marked drop in DBP and SVR. Phenylephrine: pure Alpha-1 -> intense SVR rise and reflex bradycardia.",
      clinicalIndications: "Phenylephrine: septic shock, nasal decongestion, pupillary dilation. Isoproterenol: AV block, torsades de pointes.",
      adverseEffectsAndToxicity: "Isoproterenol causes marked palpitations and hypotension; Phenylephrine causes severe reflex bradycardia and rebound congestion (rhinitis medicamentosa).",
      highYieldPearl: "Phenylephrine is a pure Alpha-1 agonist with zero Beta-1 activity, making it ideal when tachycardia must be avoided."
    },
    {
      id: "cholinergic-toxidrome",
      name: "4. Cholinergic Muscarinic & Organophosphates",
      category: "Parasympathetic Nervous System",
      subType: "Muscarinic Receptors (M1, M2, M3) & Acetylcholinesterase",
      mechanismOfAction: "M2 slows heart rate; M3 contracts bladder detrusor and causes miosis/bronchoconstriction. Organophosphates irreversibly inhibit AChE.",
      clinicalIndications: "Pilocarpine (glaucoma, dry mouth); Bethanechol (post-op urinary retention); Neostigmine/Pyridostigmine (Myasthenia Gravis).",
      adverseEffectsAndToxicity: "Organophosphate poisoning causes DUMBBELSS toxidrome. Killer 'B's: Bronchospasm, Bronchorrhea, and Bradycardia. Treat with Atropine + Pralidoxime.",
      highYieldPearl: "Atropine crosses the blood-brain barrier to reverse muscarinic symptoms; Pralidoxime regenerates cholinesterase at the nicotinic neuromuscular junction."
    }
  ],

  cardiorenal: [
    {
      id: "loop-diuretics",
      name: "1. Loop Diuretics (Furosemide, Bumetanide)",
      category: "Renal Pharmacology",
      subType: "Thick Ascending Limb (TAL) • NKCC2 Cotransporter Block",
      mechanismOfAction: "Inhibits Na+/K+/2Cl- cotransporter in TAL, abolishing the hypertonic medullary gradient and stimulating renal PGE2 synthesis.",
      clinicalIndications: "Acute pulmonary edema, congestive heart failure, cirrhotic ascites, acute hypercalcemia.",
      adverseEffectsAndToxicity: "OH DANG: Ototoxicity, Hypokalemic metabolic alkalosis, Dehydration, Allergy (sulfa), Nephritis, Gout (hyperuricemia).",
      highYieldPearl: "Ethacrynic acid is a non-sulfa loop diuretic suitable for patients with severe sulfonamide allergies."
    },
    {
      id: "thiazide-diuretics",
      name: "2. Thiazide Diuretics (Hydrochlorothiazide, Chlorthalidone)",
      category: "Renal Pharmacology",
      subType: "Distal Convoluted Tubule (DCT) • NCCT Cotransporter Block",
      mechanismOfAction: "Inhibits Na+/Cl- cotransporter in early DCT; enhances Ca2+ reabsorption via basolateral Na+/Ca2+ antiporter.",
      clinicalIndications: "First-line monotherapy for essential hypertension, recurrent calcium oxalate kidney stones (idiopathic hypercalciuria), nephrogenic DI.",
      adverseEffectsAndToxicity: "HyperGLUC: Hyperglycemia, Hyperlipidemia, Hyperuricemia, Hypercalcemia, Hypokalemic metabolic alkalosis.",
      highYieldPearl: "Thiazides decrease urinary calcium excretion, protecting against recurrent nephrolithiasis and osteoporosis."
    },
    {
      id: "acei-arbs",
      name: "3. ACE Inhibitors vs Angiotensin Receptor Blockers",
      category: "RAAS Antagonists",
      subType: "ACE Inhibition vs AT1 Receptor Blockade",
      mechanismOfAction: "ACE inhibitors prevent conversion of Ang I to Ang II and prevent Bradykinin breakdown. ARBs block AT1 receptors directly.",
      clinicalIndications: "Essential hypertension, Heart Failure with reduced Ejection Fraction (HFrEF - mortality reduction), Diabetic Nephropathy.",
      adverseEffectsAndToxicity: "ACE inhibitors cause dry cough and angioedema via elevated Bradykinin and substance P. Both cause hyperkalemia and are teratogens.",
      highYieldPearl: "In patients developing ACE-inhibitor-induced cough or angioedema, switch to an ARB (Losartan/Valsartan)."
    },
    {
      id: "antiarrhythmics-amiodarone",
      name: "4. Class III Antiarrhythmics (Amiodarone, Sotalol)",
      category: "Cardiovascular Electrophysiology",
      subType: "K+ Channel Blockade • Action Potential Prolongation",
      mechanismOfAction: "Blocks cardiac delayed rectifier K+ channels, prolonging Phase 3 repolarization, action potential duration, and effective refractory period.",
      clinicalIndications: "Ventricular tachycardia/fibrillation, atrial fibrillation rate and rhythm control.",
      adverseEffectsAndToxicity: "Pulmonary fibrosis, Hypo/Hyperthyroidism (40% iodine content), Corneal microdeposits, Hepatotoxicity, Blue-gray skin, QT prolongation.",
      highYieldPearl: "Check baseline chest X-ray, pulmonary function tests, thyroid panel (TSH), and LFTs prior to starting chronic Amiodarone."
    }
  ],

  antimicrobials: [
    {
      id: "aminoglycosides-tetracyclines",
      name: "1. 30S Ribosome Inhibitors (Aminoglycosides & Tetracyclines)",
      category: "Protein Synthesis Inhibitors",
      subType: "Buy AT 30 • Aminoglycosides (Bactericidal) & Tetracyclines",
      mechanismOfAction: "Aminoglycosides (Gentamicin/Amikacin) irreversibly bind 30S and block initiation. Tetracyclines (Doxycycline) block aminoacyl-tRNA binding.",
      clinicalIndications: "Severe Gram-negative aerobic rod infections (Gentamicin); Lyme disease, Rocky Mountain spotted fever, Chlamydia, MRSA (Doxycycline).",
      adverseEffectsAndToxicity: "Aminoglycosides cause Nephrotoxicity (ATN) and Ototoxicity. Tetracyclines cause tooth enamel discoloration and bone growth inhibition in kids.",
      highYieldPearl: "Aminoglycosides require oxygen for transport into bacteria and are completely ineffective against anaerobes."
    },
    {
      id: "vancomycin-cellwall",
      name: "2. Vancomycin & Glycopeptide Cell Wall Inhibitors",
      category: "Cell Wall Synthesis Inhibitors",
      subType: "D-Ala-D-Ala Precursor Terminus Blockade",
      mechanismOfAction: "Binds D-Ala-D-Ala terminus of cell wall precursors, preventing peptidoglycan transglycosylation.",
      clinicalIndications: "MRSA bacteremia, osteomyelitis, endocarditis; Oral Vancomycin for severe Clostridioides difficile colitis.",
      adverseEffectsAndToxicity: "Red Man Syndrome (histamine release from rapid infusion; prevent with slow infusion and antihistamines), Nephrotoxicity, Ototoxicity.",
      highYieldPearl: "Vancomycin resistance occurs via alteration of D-Ala-D-Ala to D-Ala-D-Lac (VRSA / VRE)."
    },
    {
      id: "fluoroquinolones",
      name: "3. Fluoroquinolones (Ciprofloxacin, Levofloxacin)",
      category: "DNA Topoisomerase Inhibitors",
      subType: "Bacterial DNA Gyrase (Topoisomerase II) & Topoisomerase IV",
      mechanismOfAction: "Inhibits DNA gyrase and topoisomerase IV, causing irreversible double-stranded DNA cleavage.",
      clinicalIndications: "Pseudomonas (Ciprofloxacin), Gram-negative UTIs, pyelonephritis, bacterial gastroenteritis, atypical pneumonia.",
      adverseEffectsAndToxicity: "Tendonitis and Achilles Tendon Rupture (especially in elderly and concurrent steroids), QT prolongation, cartilage toxicity in children.",
      highYieldPearl: "Avoid co-administration of fluoroquinolones with antacids or multivalent cations (Ca2+, Mg2+, Fe2+) due to chelation."
    }
  ]
};

interface PharmacologyLabViewerProps {
  initialMode?: PharmLabMode;
  height?: string;
  onNodeSelect?: (node: PharmLabNode) => void;
}

export default function PharmacologyLabViewer({
  initialMode = "pkpd",
  height = "560px",
  onNodeSelect,
}: PharmacologyLabViewerProps) {
  const [activeMode, setActiveMode] = useState<PharmLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // PK Interactive Sliders State
  const [targetCp, setTargetCp] = useState<number>(2.0); // mcg/mL
  const [vdPerKg, setVdPerKg] = useState<number>(0.6); // L/kg
  const [weightKg, setWeightKg] = useState<number>(70); // kg
  const [clearanceMlMin, setClearanceMlMin] = useState<number>(80); // mL/min
  const [bioavailabilityF, setBioavailabilityF] = useState<number>(0.8); // F
  const [dosingIntervalH, setDosingIntervalH] = useState<number>(8); // hours

  // PK Calculations
  const totalVd = useMemo(() => vdPerKg * weightKg, [vdPerKg, weightKg]);
  const clLitersPerHr = useMemo(() => (clearanceMlMin * 60) / 1000, [clearanceMlMin]);
  const ke = useMemo(() => (totalVd > 0 ? clLitersPerHr / totalVd : 0.1), [clLitersPerHr, totalVd]);
  const halfLifeHours = useMemo(() => {
    if (clLitersPerHr <= 0) return 0;
    return (0.693 * totalVd) / clLitersPerHr;
  }, [totalVd, clLitersPerHr]);
  const loadingDoseMg = useMemo(() => {
    if (bioavailabilityF <= 0) return 0;
    return (targetCp * totalVd) / bioavailabilityF;
  }, [targetCp, totalVd, bioavailabilityF]);
  const maintenanceDoseMg = useMemo(() => {
    if (bioavailabilityF <= 0) return 0;
    return (targetCp * clLitersPerHr * dosingIntervalH) / bioavailabilityF;
  }, [targetCp, clLitersPerHr, dosingIntervalH, bioavailabilityF]);

  // Generate SVG curve points for multi-dose PK accumulation over 48 hours
  const pkCurvePoints = useMemo(() => {
    const points: string[] = [];
    const width = 360;
    const height = 100;
    const totalHours = 48;
    const doseInterval = dosingIntervalH;
    const cPeak = targetCp * 1.5;

    for (let t = 0; t <= totalHours; t += 0.5) {
      // Multi-dose accumulation formula
      const nDoses = Math.floor(t / doseInterval) + 1;
      let conc = 0;
      for (let i = 0; i < nDoses; i++) {
        const timeSinceDose = t - i * doseInterval;
        if (timeSinceDose >= 0) {
          conc += targetCp * Math.exp(-ke * timeSinceDose);
        }
      }
      const x = (t / totalHours) * width;
      const normalizedConc = Math.min(conc / (cPeak * 2), 1.0);
      const y = height - normalizedConc * (height - 15) - 10;
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return points.join(" ");
  }, [dosingIntervalH, targetCp, ke]);

  const currentNodes = useMemo(() => {
    return PHARM_NODES[activeMode] || PHARM_NODES.pkpd;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: PharmLabNode) => {
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
            <Pill size={14} /> PHARM-201
          </span>
          <span className={styles.titleText}>
            {activeMode === "pkpd" && "Pharmacokinetics & Receptor Dynamics Simulator"}
            {activeMode === "autonomics" && "Autonomic Receptors, Cholinergics & Adrenergics"}
            {activeMode === "cardiorenal" && "Cardiovascular & Renal Pharmacology Engines"}
            {activeMode === "antimicrobials" && "Antimicrobial Targets & Iconic Toxicities"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Pharmacology Quiz"}
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
                  Clinical Pharmacology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Drug / Target: {quizTargetNode.clinicalIndications}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-emerald-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-slate-800 text-xs rounded border border-slate-700 text-slate-200"
              >
                Next
              </button>
            </div>
          )}

          {/* PK Interactive Simulation Sliders in PKPD mode */}
          {activeMode === "pkpd" && (
            <div className={styles.pkSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={14} /> Interactive Pharmacokinetics & Dosing Calculator
                </span>
                <span className="text-[11px] text-slate-400">Real-Time ADME Equations</span>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Target Cp:</span> <strong className="text-blue-400">{targetCp} mcg/mL</strong>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="10.0"
                    step="0.5"
                    value={targetCp}
                    onChange={(e) => setTargetCp(parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Vd (L/kg):</span> <strong className="text-blue-400">{vdPerKg} L/kg</strong>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="5.0"
                    step="0.1"
                    value={vdPerKg}
                    onChange={(e) => setVdPerKg(parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Clearance:</span> <strong className="text-blue-400">{clearanceMlMin} mL/min</strong>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="150"
                    step="5"
                    value={clearanceMlMin}
                    onChange={(e) => setClearanceMlMin(parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>

              {/* Real-time PK Outputs */}
              <div className={styles.pkResultsGrid}>
                <div className={styles.pkResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Total Vd</div>
                  <div className={styles.pkResultVal}>{totalVd.toFixed(1)} L</div>
                </div>
                <div className={styles.pkResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Half-Life (t1/2)</div>
                  <div className={styles.pkResultVal}>{halfLifeHours.toFixed(1)} hrs</div>
                </div>
                <div className={styles.pkResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Loading Dose</div>
                  <div className={styles.pkResultVal}>{loadingDoseMg.toFixed(0)} mg</div>
                </div>
                <div className={styles.pkResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Maint. Dose (q8h)</div>
                  <div className={styles.pkResultVal}>{maintenanceDoseMg.toFixed(0)} mg</div>
                </div>
              </div>

              {/* Dynamic SVG Concentration-Time Curve */}
              <div className="mt-2 p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
                  <span className="font-bold text-blue-400 flex items-center gap-1">
                    <TrendingUp size={12} /> Steady-State Multi-Dose Plasma Accumulation (0-48h)
                  </span>
                  <span>Target: {targetCp} mcg/mL • t1/2: {halfLifeHours.toFixed(1)}h</span>
                </div>
                <svg viewBox="0 0 360 100" className="w-full h-24 stroke-blue-400 fill-none">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="360" y2="20" stroke="rgba(239, 68, 68, 0.3)" strokeDasharray="4 4" />
                  <line x1="0" y1="75" x2="360" y2="75" stroke="rgba(34, 197, 94, 0.3)" strokeDasharray="4 4" />
                  {/* PK Curve */}
                  <polyline points={pkCurvePoints} stroke="#60a5fa" strokeWidth="2.5" />
                </svg>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>0 hrs (Dose 1)</span>
                  <span>16 hrs (Dose 3)</span>
                  <span>32 hrs (Steady State: 4-5 t1/2)</span>
                  <span>48 hrs</span>
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
                    <span className="text-blue-400 font-bold">Mechanism:</span> {node.mechanismOfAction}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect clinical pharmacology</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Clinical Pharmacology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Drug Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🎯 Drug / Class Identity</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Mechanism of Action</div>
            <div className={styles.inspectorBody}>{activeNode.mechanismOfAction}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🏥 Clinical Indications</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalIndications}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚠️ Adverse Effects & Toxicities</div>
            <div className={styles.inspectorBody}>{activeNode.adverseEffectsAndToxicity}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 USMLE / NMC High-Yield Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("pkpd")}
          className={`${styles.modeTab} ${activeMode === "pkpd" ? styles.modeTabActive : ""}`}
        >
          📈 1. PK/PD & Equations
        </button>
        <button
          onClick={() => setActiveMode("autonomics")}
          className={`${styles.modeTab} ${activeMode === "autonomics" ? styles.modeTabActive : ""}`}
        >
          ⚡ 2. Autonomic Receptors
        </button>
        <button
          onClick={() => setActiveMode("cardiorenal")}
          className={`${styles.modeTab} ${activeMode === "cardiorenal" ? styles.modeTabActive : ""}`}
        >
          🫀 3. Cardiorenal & Diuretics
        </button>
        <button
          onClick={() => setActiveMode("antimicrobials")}
          className={`${styles.modeTab} ${activeMode === "antimicrobials" ? styles.modeTabActive : ""}`}
        >
          💊 4. Antimicrobials & Targets
        </button>
      </div>
    </div>
  );
}
