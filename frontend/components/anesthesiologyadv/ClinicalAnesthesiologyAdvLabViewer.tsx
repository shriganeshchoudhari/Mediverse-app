"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalAnesthesiologyAdvLabViewer.module.css";
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

export type AnesthesiologyLabMode = "airway" | "toxicity" | "hyperthermia" | "neuromuscular";

export interface AnesthesiologyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  anesProfile: string;
  pathophysiologyMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const ANESTHESIOLOGY_LAB_NODES: Record<AnesthesiologyLabMode, AnesthesiologyLabNode[]> = {
  airway: [
    {
      id: "anes-airway-cico-fona-cricothyroidotomy",
      name: "ASA Difficult Airway & CICO Emergency (Cannot Intubate Cannot Oxygenate & Scalpel-Bougie-Tube FONA)",
      category: "Airway Emergency",
      subType: "Failed 3 Intubations • Failed SAD/LMA • Failed BVM • Hypoxemia / Asystole • Front-of-Neck Access",
      anesProfile: "Catastrophic cannot-intubate, cannot-oxygenate crisis mandating immediate surgical Front-of-Neck Access.",
      pathophysiologyMechanism: "Complete upper airway obstruction or distorted pharyngeal anatomy preventing supraglottic or translaryngeal ventilation.",
      clinicalHallmarks: "Rapid oxygen desaturation (SpO2 <80%), bradycardia, cyanosis; immediate Scalpel-Bougie-Tube Cricothyroidotomy.",
      highYieldPearls: "CICO emergency mandates immediate Scalpel-Bougie-Tube Cricothyroidotomy: transverse membrane incision, bougie, size 6.0 cuffed tube."
    },
    {
      id: "anes-airway-mallampati-lemon-rules",
      name: "Mallampati & LEMON Assessment (Oropharyngeal Architecture & Incisor 3-3-2 Rule)",
      category: "Preoperative Staging",
      subType: "Mallampati I-IV • Incisor Distance >=3 Fingers • Hyoid-Mental >=3 • Thyroid-Mouth >=2 • Neck Mobility",
      anesProfile: "Comprehensive clinical airway risk stratification identifying anatomical impediments prior to induction.",
      pathophysiologyMechanism: "Retrognathia, high arched palate, large tongue base, or cervical spine rigidity restrict the line of direct glottic sight.",
      clinicalHallmarks: "Class III (soft palate/base of uvula) and Class IV (hard palate only) predict difficult laryngoscopy; prepare video scope.",
      highYieldPearls: "Mallampati Class IV visualizes hard palate only; evaluated alongside the LEMON 3-3-2 rule for difficult intubation risk."
    },
    {
      id: "anes-airway-videolaryngoscopy-bougie",
      name: "Video Laryngoscopy & Hyperangulation (GlideScope Indirect Visualization & Tracheal Bougie)",
      category: "Indirect Intubation",
      subType: "Hyperangulated Blade (GlideScope / C-MAC) • Cormack-Lehane Grade 3/4 • Gum-Elastic Bougie",
      anesProfile: "Indirect optical imaging tool that overcomes anterior larynx and limited cervical extension without alignment.",
      pathophysiologyMechanism: "High-resolution camera at blade tip provides a panoramic view of glottic inlet independent of the oral-pharyngeal-laryngeal line.",
      clinicalHallmarks: "Used as Plan A in anticipated difficult airways or rescue after failed direct laryngoscopy; combine with coudé-tip bougie.",
      highYieldPearls: "Video laryngoscopy improves Cormack-Lehane Grade 3/4 views; a rigid stylet or bougie is mandatory to guide the tube around the curve."
    },
    {
      id: "anes-airway-awake-fiberoptic-afoi",
      name: "Awake Fiberoptic Bronchoscopy (Spontaneous Ventilation Airway Management)",
      category: "Advanced Endoscopy",
      subType: "Known Difficult Airway • Cervical Spine Instability • Ludwig Angina • Topical Lidocaine + Sedation",
      anesProfile: "Gold standard elective technique for patients with anticipated impossible direct laryngoscopy or neck mobility loss.",
      pathophysiologyMechanism: "Maintains spontaneous respiratory drive and patent pharyngeal tone while the bronchoscope directly navigates into the trachea.",
      clinicalHallmarks: "Requires thorough airway topicalization (4% lidocaine nebulization/blocks) and light sedation (Dexmedetomidine / Remifentanil).",
      highYieldPearls: "Awake fiberoptic intubation (AFOI) is the safest approach for severe micrognathia, Ludwig angina, or unstable cervical spine."
    }
  ],

  toxicity: [
    {
      id: "anes-tox-last-bupivacaine-arrest",
      name: "Bupivacaine Nav1.5 Cardiotoxicity (Refractory Ventricular Fibrillation & Asystolic Collapse)",
      category: "Local Anesthetic Toxicity",
      subType: "Lipophilic Amide • 'Fast In, Slow Out' Nav1.5 • Wide QRS • Ventricular Tachycardia / PEA",
      anesProfile: "Severe cardiotoxicity resulting from accidental intravascular injection of potent lipophilic local anesthetics.",
      pathophysiologyMechanism: "High-affinity binding to cardiac voltage-gated Nav1.5 sodium channels with prolonged dissociation and mitochondrial uncoupling.",
      clinicalHallmarks: "Initial metallic taste, tinnitus, and seizures rapidly progressing to wide-complex VT, heart block, and asystole.",
      highYieldPearls: "Bupivacaine is the most cardiotoxic local anesthetic (low CC/CNS ratio); causes refractory ventricular arrhythmias."
    },
    {
      id: "anes-tox-lipid-rescue-protocol",
      name: "20% Lipid Emulsion Rescue Protocol (Intralipid 1.5 mL/kg Bolus & 0.25 mL/kg/min Infusion)",
      category: "Pharmacological Antidote",
      subType: "Lipid Sink Extraction • Myocardial Beta-Oxidation • Bolus 1.5 mL/kg • Infusion 0.25 mL/kg/min",
      anesProfile: "First-line life-saving antidote that extracts lipophilic local anesthetics from tissue and restores cardiac ATP synthesis.",
      pathophysiologyMechanism: "Creates an intravascular lipid phase that captures bupivacaine, overrides carnitine transport block, and provides inotropic drive.",
      clinicalHallmarks: "Administer 1.5 mL/kg IV bolus over 2-3 min, then 0.25 mL/kg/min infusion; repeat bolus and increase to 0.5 mL/kg/min if unstable.",
      highYieldPearls: "LAST antidote: 20% Lipid Emulsion 1.5 mL/kg bolus + 0.25 mL/kg/min infusion; max cumulative dose 10-12 mL/kg over 30 min."
    },
    {
      id: "anes-tox-asra-acls-modifications",
      name: "ASRA Resuscitation Modifications (AVOID Vasopressin, Beta-Blockers & Lidocaine Antiarrhythmics)",
      category: "ACLS Adaptation",
      subType: "Low-Dose Epinephrine (<=1 mcg/kg) • AVOID Vasopressin / Beta-Blockers / Calcium-Blockers / Lidocaine",
      anesProfile: "Specific deviations from standard cardiac arrest algorithms to avoid fatal exacerbation of local anesthetic toxicity.",
      pathophysiologyMechanism: "Standard ACLS epinephrine doses and vasopressin severely impair myocardial perfusion and exacerbate arrhythmias in LAST.",
      clinicalHallmarks: "Reduce epinephrine boluses to <=1 mcg/kg aliquots; strictly avoid lidocaine, procainamide, beta-blockers, and calcium blockers.",
      highYieldPearls: "In LAST resuscitation: AVOID vasopressin, beta-blockers, and lidocaine; use reduced epinephrine doses (<=1 mcg/kg)."
    },
    {
      id: "anes-tox-benzocaine-methemoglobinemia",
      name: "Benzocaine Methemoglobinemia (Acquired MetHb Cyanosis & Methylene Blue Antidote)",
      category: "Oxidative Hematotoxicity",
      subType: "Topical Benzocaine Spray • Fe2+ Oxidized to Fe3+ • Chocolate Brown Blood • Methylene Blue 1-2 mg/kg",
      anesProfile: "Toxic oxidation of ferrous hemoglobin into ferric methemoglobin following mucosal endoscopy spray.",
      pathophysiologyMechanism: "Benzocaine metabolically oxidizes heme iron to Fe3+, preventing oxygen binding and shifting the O2 curve left (hypoxia).",
      clinicalHallmarks: "Refractory cyanosis with SpO2 fixed at ~85% unresponsive to 100% O2, chocolate-brown arterial blood; Methylene Blue 1-2 mg/kg.",
      highYieldPearls: "Benzocaine mucosal spray causes methemoglobinemia (fixed SpO2 85%, dark blood); treated with IV Methylene Blue 1-2 mg/kg."
    }
  ],

  hyperthermia: [
    {
      id: "anes-hyp-malignant-hyperthermia-ryr1",
      name: "Malignant Hyperthermia RYR1 Crisis (End-Tidal CO2 Surge, Masseter Spasm & IV Dantrolene 2.5 mg/kg)",
      category: "Hypermetabolic Emergency",
      subType: "RYR1 Mutation • Volatile Anesthetics + Succinylcholine • EtCO2 Surge • Dantrolene 2.5 mg/kg Push",
      anesProfile: "Autosomal dominant skeletal muscle pharmacogenetic disorder triggered by volatile agents or succinylcholine.",
      pathophysiologyMechanism: "Uncontrolled calcium release from the sarcoplasmic reticulum triggers sustained muscle contraction and extreme hypermetabolism.",
      clinicalHallmarks: "Earliest sign: rapid rise in EtCO2 refractory to hyperventilation, tachycardia, masseter spasm, hyperthermia, high CK; Dantrolene.",
      highYieldPearls: "Earliest sign of MH is rapid unexplained rise in EtCO2; treated with immediate volatile cessation + IV Dantrolene 2.5 mg/kg."
    },
    {
      id: "anes-hyp-propofol-infusion-syndrome-pris",
      name: "Propofol Infusion Syndrome PRIS (High-Dose Metabolic Acidosis, Rhabdomyolysis & Shock)",
      category: "Intravenous Toxicity",
      subType: "Dose >4-5 mg/kg/h for >48h • Refractory Metabolic Acidosis • Hyperkalemia • Cardiogenic Shock",
      anesProfile: "Fatal toxic syndrome resulting from prolonged high-dose propofol infusions in intensive care units.",
      pathophysiologyMechanism: "Inhibition of mitochondrial electron transport chain (complex I/IV) and impairment of cellular fatty acid oxidation.",
      clinicalHallmarks: "Severe lactic acidosis, rhabdomyolysis, green urine, hepatomegaly, hypertriglyceridemia, and refractory cardiogenic shock.",
      highYieldPearls: "PRIS occurs with propofol >4-5 mg/kg/h for >48h; features refractory metabolic acidosis, rhabdomyolysis, and cardiogenic shock."
    },
    {
      id: "anes-hyp-etomidate-adrenal-suppression",
      name: "Etomidate Adrenal Suppression (11-Beta-Hydroxylase Inhibition & Hemodynamic Stability)",
      category: "Induction Pharmacology",
      subType: "Hemodynamically Neutral • Inhibits 11-beta-hydroxylase • Suppresses Cortisol Synthesis • Myoclonus",
      anesProfile: "Cardiostable GABA-A agonist widely used for emergency induction in shock and severe cardiovascular compromise.",
      pathophysiologyMechanism: "Selectively and reversibly inhibits adrenal 11-beta-hydroxylase, blocking conversion of 11-deoxycortisol to cortisol.",
      clinicalHallmarks: "Preserves blood pressure and systemic vascular resistance; single induction dose causes transient 24h adrenocortical suppression.",
      highYieldPearls: "Etomidate provides excellent hemodynamic stability but causes transient adrenal suppression via 11-beta-hydroxylase inhibition."
    },
    {
      id: "anes-hyp-ketamine-dissociative-nmda",
      name: "Ketamine Dissociative Anesthesia (NMDA Antagonism, Sympathomimetic Tone & Bronchodilation)",
      category: "Dissociative Anesthetic",
      subType: "NMDA Antagonist • Preserves Airway Reflexes • Increases HR/BP/CO • Potent Bronchodilator",
      anesProfile: "Unique anesthetic that produces profound analgesia, amnesia, and catalepsy while preserving spontaneous ventilation.",
      pathophysiologyMechanism: "Non-competitive antagonism of NMDA glutamate receptors in the thalamocortical and limbic systems.",
      clinicalHallmarks: "Increases heart rate and BP via endogenous catecholamine release; excellent for septic shock and severe bronchospasm.",
      highYieldPearls: "Ketamine preserves airway reflexes, causes bronchodilation, and supports hemodynamics; can cause emergence delirium."
    }
  ],

  neuromuscular: [
    {
      id: "anes-nm-sugammadex-cyclodextrin-reversal",
      name: "Sugammadex Cyclodextrin Ring (1:1 Stoichiometric Encapsulation of Rocuronium at 2/4/16 mg/kg)",
      category: "Selective Relaxant Binding",
      subType: "Modified gamma-Cyclodextrin • 1:1 Complex with Rocuronium • Reverses TOF 0/4 • Doses: 2 / 4 / 16 mg/kg",
      anesProfile: "Selective relaxant-binding agent that encapsulates aminosteroid neuromuscular blocking agents in plasma.",
      pathophysiologyMechanism: "Forms tight 1:1 hydrophobic ring complex with rocuronium, lowering free plasma drug and pulling it off NMJ receptors.",
      clinicalHallmarks: "Reverses moderate block at 2 mg/kg, deep block (PTC 1-2) at 4 mg/kg, and immediate post-RSI rocuronium at 16 mg/kg.",
      highYieldPearls: "Sugammadex encapsulates Rocuronium (2 mg/kg for TOF >=2, 4 mg/kg for deep block, 16 mg/kg for immediate rescue reversal)."
    },
    {
      id: "anes-nm-train-of-four-quantitative-tof",
      name: "Train-of-Four TOF Quantitative Monitoring (Target Ratio >= 0.90 to Prevent Postoperative Curarization)",
      category: "Neuromuscular Monitoring",
      subType: "4 Twitches at 2 Hz • T4/T1 Ratio >= 0.90 • Adductor Pollicis / Ulnar Nerve • Acceleromyography",
      anesProfile: "Objective quantitative neuromuscular monitoring essential to verify complete recovery before extubation.",
      pathophysiologyMechanism: "Electrical stimulation of motor nerve assesses competitive receptor occupancy and fading of acetylcholine release.",
      clinicalHallmarks: "A TOF ratio >= 0.90 (90%) is required before tracheal extubation to avoid postoperative upper airway collapse and hypoxemia.",
      highYieldPearls: "Safe extubation requires a quantitative Train-of-Four (TOF) ratio >= 0.90 (90%) to eliminate residual paralysis."
    },
    {
      id: "anes-nm-succinylcholine-hyperkalemia-phase",
      name: "Succinylcholine Depolarizing Block (Phase I/II Blockade, Hyperkalemic Spike & Pseudocholinesterase)",
      category: "Depolarizing NMBA",
      subType: "Rapid Onset 30-60s • Plasma Butyrylcholinesterase • K+ Rises by 0.5 mEq/L • Low Dibucaine Number",
      anesProfile: "Ultra-rapid-onset depolarizing muscle relaxant ideal for rapid sequence induction (RSI).",
      pathophysiologyMechanism: "Persistent depolarization of the motor endplate causing initial fasciculations followed by flaccid muscular paralysis.",
      clinicalHallmarks: "Produces fatal hyperkalemia in denervated muscle, burns >24-48h, and muscular dystrophy; atypical enzyme gives low Dibucaine <20.",
      highYieldPearls: "Succinylcholine raises serum potassium by 0.5 mEq/L (fatal in burns/denervation); atypical pseudocholinesterase causes prolonged apnea."
    },
    {
      id: "anes-nm-cisatracurium-hofmann-elimination",
      name: "Cisatracurium Hofmann Elimination (Organ-Independent Degradation in Hepatic/Renal Failure)",
      category: "Benzylisoquinolinium NMBA",
      subType: "Non-Depolarizing • Spontaneous Hofmann Elimination + Ester Hydrolysis • Zero Histamine • Hepatorenal Safe",
      anesProfile: "Intermediate-acting non-depolarizing muscle relaxant that undergoes spontaneous organ-independent degradation.",
      pathophysiologyMechanism: "Non-enzymatic chemical breakdown (Hofmann elimination) at physiologic temperature and pH into laudanosine.",
      clinicalHallmarks: "Drug of choice in patients with end-stage renal disease (ESRD) or severe hepatic failure; does not trigger histamine release.",
      highYieldPearls: "Cisatracurium undergoes organ-independent Hofmann elimination; safest muscle relaxant in severe renal or hepatic failure."
    }
  ]
};

interface ClinicalAnesthesiologyAdvLabViewerProps {
  initialMode?: AnesthesiologyLabMode;
  height?: string;
  onNodeSelect?: (node: AnesthesiologyLabNode) => void;
}

export default function ClinicalAnesthesiologyAdvLabViewer({
  initialMode = "airway",
  height = "560px",
  onNodeSelect,
}: ClinicalAnesthesiologyAdvLabViewerProps) {
  const [activeMode, setActiveMode] = useState<AnesthesiologyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // LAST Lipid Rescue Calculator State
  const [patientWeightKg, setPatientWeightKg] = useState<number>(70);

  const lipidCalculations = useMemo(() => {
    const bolusVolume = Math.round(patientWeightKg * 1.5);
    const infusionRateMin = (patientWeightKg * 0.25).toFixed(1);
    const infusionRateHour = (patientWeightKg * 0.25 * 60).toFixed(0);
    const maxCumulativeDose = Math.round(patientWeightKg * 12);

    return {
      bolusVolume,
      infusionRateMin,
      infusionRateHour,
      maxCumulativeDose
    };
  }, [patientWeightKg]);

  // TOF & Sugammadex Calculator State
  const [tofTwitches, setTofTwitches] = useState<number>(0);
  const [ptcCount, setPtcCount] = useState<number>(2);

  const sugammadexDosing = useMemo(() => {
    if (tofTwitches === 0 && ptcCount === 0) {
      return {
        depth: "Profound Blockade (TOF 0/4, PTC 0)",
        sugammadexDose: "16 mg/kg IV (Immediate emergency rescue reversal 3 min post-RSI rocuronium)",
        neostigmine: "STRONGLY CONTRAINDICATED (ceiling effect / ineffective)",
        weightDose70kg: "1,120 mg IV push"
      };
    } else if (tofTwitches === 0 && ptcCount >= 1) {
      return {
        depth: "Deep Neuromuscular Blockade (TOF 0/4, PTC >= 1-2)",
        sugammadexDose: "4 mg/kg IV push",
        neostigmine: "STRONGLY CONTRAINDICATED (cannot reverse deep block)",
        weightDose70kg: "280 mg IV push"
      };
    } else if (tofTwitches >= 1 && tofTwitches <= 3) {
      return {
        depth: "Moderate Blockade (TOF 1-3 / 4 twitches)",
        sugammadexDose: "2 mg/kg IV push",
        neostigmine: "Can use Neostigmine 0.05 mg/kg + Glycopyrrolate",
        weightDose70kg: "140 mg IV push"
      };
    } else {
      return {
        depth: "Shallow Blockade / Spontaneous Recovery (TOF 4/4 with fade)",
        sugammadexDose: "2 mg/kg IV push",
        neostigmine: "Neostigmine 0.03 - 0.05 mg/kg + Glycopyrrolate",
        weightDose70kg: "140 mg IV push"
      };
    }
  }, [tofTwitches, ptcCount]);

  const currentNodes = useMemo(() => {
    return ANESTHESIOLOGY_LAB_NODES[activeMode] || ANESTHESIOLOGY_LAB_NODES.airway;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: AnesthesiologyLabNode) => {
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
            <ShieldAlert size={14} /> ANE-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "airway" && "Difficult Airway Algorithms: LEMON Score, Mallampati I-IV & FONA Cricothyroidotomy"}
            {activeMode === "toxicity" && "Local Anesthetic Systemic Toxicity (LAST): Bupivacaine & 20% Lipid Emulsion Rescue"}
            {activeMode === "hyperthermia" && "Anesthetic Pharmacology: Propofol (PRIS), Etomidate, Ketamine & Malignant Hyperthermia"}
            {activeMode === "neuromuscular" && "Neuromuscular Blockade: Train-of-Four (TOF >=0.90) & Sugammadex Cyclodextrin Reversal"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Anesthesia Diagnostic Quiz"}
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
                  Anesthesiology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Anesthetic Entity / Protocol: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: Difficult Airway & FONA Protocol */}
          {activeMode === "airway" && (
            <div className={styles.anesCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Scissors size={14} /> CICO Scalpel-Bougie-Tube Cricothyroidotomy Protocol
                </span>
                <span className="text-[11px] text-slate-400">Front-of-Neck Access (FONA) Life-Saving Technique</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Step 1: Identify &amp; Transverse Incision</div>
                  <div className="text-slate-300 mt-1">Palpate thyroid cartilage and cricoid ring to locate the cricothyroid membrane. Make a horizontal (transverse) stab incision with a #10 scalpel blade through skin and membrane. Rotate scalpel 90 degrees to open lumen.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Step 2: Bougie &amp; Cuffed Tube Railroad</div>
                  <div className="text-slate-300 mt-1">Insert coud&eacute; tip of a gum-elastic bougie into trachea until hold-up is felt (10-15 cm). Railroad a size 6.0 mm cuffed endotracheal tube over bougie, inflate cuff, and confirm ventilation with end-tidal CO2 waveform.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: LAST 20% Lipid Emulsion Calculator */}
          {activeMode === "toxicity" && (
            <div className={styles.anesCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={14} /> ASRA 20% Lipid Emulsion (Intralipid) Dosing Calculator
                </span>
                <span className="text-[11px] text-slate-400">Patient Weight: {patientWeightKg} kg</span>
              </div>

              <div className="space-y-3">
                <input
                  type="range"
                  min="40"
                  max="120"
                  step="1"
                  value={patientWeightKg}
                  onChange={(e) => setPatientWeightKg(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-indigo-950/60 rounded border border-indigo-800">
                    <div className="text-indigo-300 font-bold">Initial IV Bolus (1.5 mL/kg)</div>
                    <div className="text-base font-extrabold text-white mt-1">{lipidCalculations.bolusVolume} mL</div>
                    <div className="text-[10px] text-slate-400">Administer over 2-3 minutes</div>
                  </div>

                  <div className="p-2.5 bg-indigo-950/60 rounded border border-indigo-800">
                    <div className="text-indigo-300 font-bold">Continuous IV Infusion</div>
                    <div className="text-base font-extrabold text-white mt-1">{lipidCalculations.infusionRateMin} mL/min</div>
                    <div className="text-[10px] text-slate-400">({lipidCalculations.infusionRateHour} mL/hr at 0.25 mL/kg/min)</div>
                  </div>

                  <div className="p-2.5 bg-indigo-950/60 rounded border border-indigo-800">
                    <div className="text-indigo-300 font-bold">30-Min Cumulative Limit</div>
                    <div className="text-base font-extrabold text-white mt-1">{lipidCalculations.maxCumulativeDose} mL</div>
                    <div className="text-[10px] text-slate-400">Max limit: 12 mL/kg total</div>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800 text-xs text-slate-300">
                  <strong className="text-amber-300">ACLS Rules in LAST:</strong> AVOID Vasopressin, Beta-Blockers, Calcium Channel Blockers, and Lidocaine. Reduce Epinephrine boluses to &le; 1 mcg/kg aliquots.
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Malignant Hyperthermia & General Anesthetics */}
          {activeMode === "hyperthermia" && (
            <div className={styles.anesCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={14} /> Malignant Hyperthermia (RYR1) vs PRIS &amp; Etomidate Profile
                </span>
                <span className="text-[11px] text-slate-400">EtCO2 Surge &bull; Dantrolene 2.5 mg/kg &bull; Adrenal 11-beta-hydroxylase</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Malignant Hyperthermia (MH) Protocol</div>
                  <div className="text-slate-300 mt-1">RYR1 gene mutation exposed to volatile anesthetics + succinylcholine. Uncontrolled calcium efflux causing rapid unexplained rise in EtCO2, masseter spasm, severe acidosis, hyperkalemia, and late hyperthermia. Turn off volatiles and administer IV Dantrolene 2.5 mg/kg push.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">PRIS &amp; Etomidate Adrenal Suppression</div>
                  <div className="text-slate-300 mt-1">Propofol Infusion Syndrome (PRIS) occurs with &gt;4-5 mg/kg/h for &gt;48h (metabolic acidosis, rhabdomyolysis, shock). Etomidate provides remarkable cardiovascular stability but causes transient adrenal suppression by inhibiting 11-beta-hydroxylase.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Train-of-Four & Sugammadex Reversal */}
          {activeMode === "neuromuscular" && (
            <div className={styles.anesCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={14} /> Train-of-Four (TOF) &amp; Sugammadex Reversal Calculator
                </span>
                <span className="text-[11px] text-slate-400">Target TOF Ratio &ge; 0.90 for Safe Extubation</span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    onClick={() => { setTofTwitches(0); setPtcCount(0); }}
                    className={`p-1.5 rounded font-semibold border transition ${
                      tofTwitches === 0 && ptcCount === 0 ? "bg-indigo-950 border-indigo-500 text-indigo-200" : "bg-slate-900 border-slate-700 text-slate-400"
                    }`}
                  >
                    TOF 0/4 (PTC 0)
                  </button>
                  <button
                    onClick={() => { setTofTwitches(0); setPtcCount(2); }}
                    className={`p-1.5 rounded font-semibold border transition ${
                      tofTwitches === 0 && ptcCount >= 1 ? "bg-indigo-950 border-indigo-500 text-indigo-200" : "bg-slate-900 border-slate-700 text-slate-400"
                    }`}
                  >
                    TOF 0/4 (PTC 1-2)
                  </button>
                  <button
                    onClick={() => { setTofTwitches(2); setPtcCount(0); }}
                    className={`p-1.5 rounded font-semibold border transition ${
                      tofTwitches >= 1 && tofTwitches <= 3 ? "bg-indigo-950 border-indigo-500 text-indigo-200" : "bg-slate-900 border-slate-700 text-slate-400"
                    }`}
                  >
                    TOF 1-3 / 4
                  </button>
                  <button
                    onClick={() => { setTofTwitches(4); setPtcCount(0); }}
                    className={`p-1.5 rounded font-semibold border transition ${
                      tofTwitches === 4 ? "bg-indigo-950 border-indigo-500 text-indigo-200" : "bg-slate-900 border-slate-700 text-slate-400"
                    }`}
                  >
                    TOF 4/4 (Fade)
                  </button>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                  <div className="text-sm font-bold text-indigo-300">{sugammadexDosing.depth}</div>
                  <div className="text-indigo-400 font-bold mt-1">Sugammadex Dose: {sugammadexDosing.sugammadexDose}</div>
                  <div className="text-amber-300 font-semibold mt-1">Neostigmine Suitability: {sugammadexDosing.neostigmine}</div>
                  <div className="text-slate-300 mt-1"><strong className="text-indigo-400">70 kg Dose:</strong> {sugammadexDosing.weightDose70kg}</div>
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
                    <span className="text-indigo-400 font-bold">Anes:</span> {node.anesProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect Anes protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Clinical Anesthesiology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Anesthesiology Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Anesthetic Entity / Protocol</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Pharmacodynamics &amp; Mechanism</div>
            <div className="text-xs text-indigo-300 font-semibold">{activeNode.anesProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiologyMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Diagnostics</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Anesthesia Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("airway")}
          className={`${styles.modeTab} ${activeMode === "airway" ? styles.modeTabActive : ""}`}
        >
          ⚡ 1. Airway &amp; FONA
        </button>
        <button
          onClick={() => setActiveMode("toxicity")}
          className={`${styles.modeTab} ${activeMode === "toxicity" ? styles.modeTabActive : ""}`}
        >
          🔄 2. LAST &amp; Lipid Rescue
        </button>
        <button
          onClick={() => setActiveMode("hyperthermia")}
          className={`${styles.modeTab} ${activeMode === "hyperthermia" ? styles.modeTabActive : ""}`}
        >
          🔥 3. Malignant Hyperthermia
        </button>
        <button
          onClick={() => setActiveMode("neuromuscular")}
          className={`${styles.modeTab} ${activeMode === "neuromuscular" ? styles.modeTabActive : ""}`}
        >
          🛡️ 4. TOF &amp; Sugammadex
        </button>
      </div>
    </div>
  );
}
