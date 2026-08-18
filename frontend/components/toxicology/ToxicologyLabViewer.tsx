"use client";

import React, { useState, useMemo } from "react";
import styles from "./ToxicologyLabViewer.module.css";
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

export type ToxicologyLabMode = "toxidromes" | "antidotes" | "heavymetals" | "alcohols";

export interface ToxicologyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  toxicMechanism: string;
  diagnosticCriteria: string;
  clinicalProtocol: string;
  highYieldPearl: string;
}

export const TOXICOLOGY_NODES: Record<ToxicologyLabMode, ToxicologyLabNode[]> = {
  toxidromes: [
    {
      id: "tox-cholinergic-organophosphate-atropine",
      name: "Cholinergic Toxidrome & Atropine Protocol",
      category: "Autonomic Toxidrome",
      subType: "DUMBELS / SLUDGE-M • Killer B's (Bronchorrhea, Bronchospasm, Bradycardia) • Atropine + 2-PAM",
      toxicMechanism: "Inhibition of acetylcholinesterase by organophosphates/carbamates causes massive acetylcholine accumulation at muscarinic and nicotinic synapses.",
      diagnosticCriteria: "Miosis, profuse diaphoresis, salivation, lacrimation, urination, diarrhea, vomiting, muscle fasciculations, and respiratory distress.",
      clinicalProtocol: "Immediate Atropine (2-5 mg IV, doubled q3-5min until pulmonary secretions dry) + Pralidoxime (2-PAM 1-2 g IV over 30 min) to reactivate AChE.",
      highYieldPearl: "The primary therapeutic endpoint for atropine in cholinergic poisoning is the complete drying of respiratory secretions ('clear chest'), NOT heart rate or pupil size."
    },
    {
      id: "tox-anticholinergic-vs-sympathomimetic",
      name: "Anticholinergic vs Sympathomimetic Toxidromes",
      category: "Hyperdynamic Toxidromes",
      subType: "Anticholinergic (Bone Dry Skin) vs Sympathomimetic (Profuse Diaphoresis) • Benzodiazepines",
      toxicMechanism: "Anticholinergics block muscarinic sweat glands; Sympathomimetics excessively stimulate alpha/beta adrenergic receptors with active diaphoresis.",
      diagnosticCriteria: "Both present with hyperthermia, tachycardia, hypertension, mydriasis, and delirium. Differentiating key: Dry skin/axillae (Anticholinergic) vs Wet diaphoretic skin (Sympathomimetic).",
      clinicalProtocol: "Sympathomimetic: High-dose IV Benzodiazepines (avoid pure beta-blockers). Anticholinergic: Cooling, supportive fluids, Physostigmine (if no wide QRS).",
      highYieldPearl: "Sweat gland examination differentiates the two: Anticholinergic toxicity presents with bone-dry skin, whereas Sympathomimetic toxicity presents with profuse diaphoresis."
    }
  ],

  antidotes: [
    {
      id: "tox-apap-nac-rumack-matthew",
      name: "Acetaminophen Overdose & Rumack-Matthew Nomogram",
      category: "Signature Drug Overdose",
      subType: "CYP2E1 NAPQI • Glutathione Depletion • 150 ug/mL at 4h Line • IV N-Acetylcysteine",
      toxicMechanism: "Excess APAP is oxidized by CYP2E1 into NAPQI, which depletes hepatic glutathione and causes centrilobular (Zone 3) hepatic necrosis.",
      diagnosticCriteria: "Rumack-Matthew Nomogram applies between 4 and 24 hours post-acute ingestion. Treatment line begins at 150 ug/mL (1000 umol/L) at 4 hours.",
      clinicalProtocol: "IV NAC (21-hour 3-bag protocol: 150 mg/kg over 1h, 50 mg/kg over 4h, 100 mg/kg over 16h). Most effective when initiated within 8 hours.",
      highYieldPearl: "N-acetylcysteine restores hepatic glutathione stores to detoxify toxic NAPQI; it is nearly 100% hepatoprotective when administered within 8 hours of ingestion."
    },
    {
      id: "tox-tca-nahco3-qrs-widening",
      name: "TCA Overdose & Sodium Bicarbonate QRS Narrowing",
      category: "Cardiotoxic Drug Overdose",
      subType: "Fast Na+ Channel Blockade • QRS >100 ms (Seizures) / >160 ms (Arrhythmias) • Terminal R in aVR",
      toxicMechanism: "Inhibition of myocardial fast inward sodium channels (INa) delays Phase 0 depolarization, widening QRS and predisposing to ventricular arrhythmias.",
      diagnosticCriteria: "ECG: QRS >100 ms (predicts seizures), QRS >160 ms (predicts VT/VF), and prominent terminal R wave >=3 mm in lead aVR.",
      clinicalProtocol: "Hypertonic Sodium Bicarbonate (1-2 mEq/kg IV boluses, repeated until QRS narrows <100 ms, targeting serum pH 7.50-7.55). Physostigmine strictly contraindicated.",
      highYieldPearl: "Intravenous hypertonic sodium bicarbonate provides an extracellular sodium load and induces serum alkalinization (pH 7.50-7.55) to overcome TCA sodium channel blockade."
    }
  ],

  heavymetals: [
    {
      id: "tox-lead-poisoning-succimer-edta",
      name: "Lead Poisoning & Succimer / EDTA Chelation",
      category: "Heavy Metal Toxicity",
      subType: "delta-ALAD & Ferrochelatase Inhibition • Basophilic Stippling • Burton Lines • DMSA / EDTA",
      toxicMechanism: "Lead inhibits delta-aminolevulinic acid dehydratase and ferrochelatase, disrupting heme synthesis and generating microcytic anemia.",
      diagnosticCriteria: "Basophilic stippling, blue Burton lines on gums, wrist/foot drop (radial/peroneal neuropathy), lead lines on long bone X-rays, encephalopathy (>70 ug/dL).",
      clinicalProtocol: "Blood lead 45-69 ug/dL: Oral Succimer (DMSA). Blood lead >=70 ug/dL or encephalopathy: IM BAL (Dimercaprol) followed 4 hours later by IV CaNa2-EDTA.",
      highYieldPearl: "In severe lead encephalopathy (lead >=70 ug/dL), always administer BAL (Dimercaprol) first before CaNa2-EDTA to prevent mobilizing lead into the central nervous system."
    },
    {
      id: "tox-iron-deferoxamine-vin-rose",
      name: "Iron Overdose & Deferoxamine Vin Rosé Urine",
      category: "Metallic Toxicity",
      subType: "Hemorrhagic Gastritis • Mitochondrial Uncoupling • Radio-Opaque Pills • Deferoxamine",
      toxicMechanism: "Direct corrosive mucosal injury and free radical lipid peroxidation cause cellular mitochondrial uncoupling, severe metabolic acidosis, and shock.",
      diagnosticCriteria: "Hemorrhagic vomiting, radio-opaque pills on abdominal X-ray, high anion gap metabolic acidosis, serum iron >500 mcg/dL.",
      clinicalProtocol: "Whole bowel irrigation with PEG; IV Deferoxamine (15 mg/kg/h) forming water-soluble ferrioxamine, creating pathognomonic 'vin rosé' (red-orange) urine.",
      highYieldPearl: "Intravenous Deferoxamine binds free ferric iron (Fe3+) to form the water-soluble complex ferrioxamine, which is excreted renally and turns urine a classic 'vin rosé' color."
    }
  ],

  alcohols: [
    {
      id: "tox-methanol-ethylene-glycol-fomepizole",
      name: "Toxic Alcohols (Methanol/Ethylene Glycol) & Fomepizole",
      category: "Toxic Alcohols & Antidotes",
      subType: "ADH Metabolism • Formic Acid (Methanol Blindness) • Oxalate Crystals (Ethylene Glycol AKI) • Fomepizole",
      toxicMechanism: "ADH oxidizes Methanol to Formic acid (optic papillitis & blindness) and Ethylene glycol to Glycolic/Oxalic acid (calcium oxalate AKI).",
      diagnosticCriteria: "High Osmolar Gap (>10 mOsm/kg) + High Anion Gap Metabolic Acidosis. Envelope-shaped calcium oxalate crystals in ethylene glycol; retinal edema in methanol.",
      clinicalProtocol: "Fomepizole (15 mg/kg IV loading) competitive ADH inhibitor; Cofactors: Leucovorin (methanol) or Pyridoxine/Thiamine (ethylene glycol); Emergent Hemodialysis.",
      highYieldPearl: "Fomepizole competitively inhibits alcohol dehydrogenase with 8000x greater affinity than ethanol, halting toxic metabolite generation in methanol and ethylene glycol poisoning."
    },
    {
      id: "tox-snakebite-asv-20wbct",
      name: "Snakebite Envenomation & Polyvalent ASV",
      category: "Toxin Envenomation",
      subType: "Neurotoxic (Cobra/Krait Ptosis) vs Vasculotoxic (Viper VICC) • 20WBCT • Polyvalent ASV",
      toxicMechanism: "Neurotoxins cause descending flaccid motor paralysis; Hemotoxins cause venom-induced consumptive coagulopathy (VICC) and tissue necrosis.",
      diagnosticCriteria: "Neurotoxic: Bilateral ptosis, diplopia, respiratory failure. Vasculotoxic: Severe swelling, blistering, non-clotting blood on 20-minute whole blood clotting test (20WBCT).",
      clinicalProtocol: "Polyvalent Snake Antivenom (ASV 10 vials IV); Neostigmine test (with atropine) for postsynaptic cobra neurotoxicity; Avoid tourniquets/incisions.",
      highYieldPearl: "The 20-minute whole blood clotting test (20WBCT) is the definitive bedside screening test for consumptive coagulopathy in vasculotoxic viper envenomation."
    }
  ]
};

interface ToxicologyLabViewerProps {
  initialMode?: ToxicologyLabMode;
  height?: string;
  onNodeSelect?: (node: ToxicologyLabNode) => void;
}

export default function ToxicologyLabViewer({
  initialMode = "toxidromes",
  height = "560px",
  onNodeSelect,
}: ToxicologyLabViewerProps) {
  const [activeMode, setActiveMode] = useState<ToxicologyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Toxidrome State
  const [selectedToxidrome, setSelectedToxidrome] = useState<"cholinergic" | "anticholinergic" | "sympathomimetic" | "opioid" | "sedative">("cholinergic");

  // Drug Antidote State
  const [selectedDrug, setSelectedDrug] = useState<"apap" | "salicylate" | "tca" | "digoxin">("apap");

  // Toxidrome Details
  const toxidromeDetails = useMemo(() => {
    if (selectedToxidrome === "cholinergic") {
      return {
        name: "Cholinergic Toxidrome (Organophosphates)",
        vitals: "Bradycardia, Hypotension, Tachypnea (Bronchorrhea), Hypothermia",
        pupils: "Pinpoint Miosis",
        skin: "Profuse Diaphoresis & Salivation",
        mnemonic: "DUMBELS / SLUDGE-M & Killer B's (Bronchorrhea, Bronchospasm, Bradycardia)",
        antidote: "Atropine (double dose q3-5m until clear chest) + Pralidoxime (2-PAM)",
        color: "text-emerald-400 font-bold"
      };
    } else if (selectedToxidrome === "anticholinergic") {
      return {
        name: "Anticholinergic Toxidrome (Atropine, TCAs)",
        vitals: "Tachycardia, Hypertension, Hyperthermia",
        pupils: "Dilated Mydriasis (Blind as a bat)",
        skin: "Bone Dry Skin & Axillae (Dry as a bone; Red as a beet)",
        mnemonic: "Blind as a bat, Mad as a hatter, Red as a beet, Hot as a hare, Dry as a bone",
        antidote: "Cooling, IV fluids, Physostigmine (only for pure anticholinergic without wide QRS)",
        color: "text-amber-400 font-bold"
      };
    } else if (selectedToxidrome === "sympathomimetic") {
      return {
        name: "Sympathomimetic Toxidrome (Cocaine, Meth)",
        vitals: "Severe Tachycardia, Severe Hypertension, Marked Hyperthermia",
        pupils: "Dilated Mydriasis",
        skin: "Profuse Diaphoresis (Wet skin vs Dry Anticholinergic!)",
        mnemonic: "Hyperadrenergic surge: Agitation, Psychosis, Tremors, Seizures, Sweating",
        antidote: "IV Benzodiazepines (Diazepam/Lorazepam) + Active cooling (AVOID pure beta-blockers!)",
        color: "text-rose-400 font-bold"
      };
    } else if (selectedToxidrome === "opioid") {
      return {
        name: "Opioid Toxidrome (Heroin, Fentanyl)",
        vitals: "Bradypnea (<8-10/min), Bradycardia, Hypotension, Hypothermia",
        pupils: "Pinpoint Miosis",
        skin: "Cool, normal or dry",
        mnemonic: "Triad: Respiratory Depression + Pinpoint Pupils + CNS Coma",
        antidote: "Naloxone (0.04 - 0.4 mg IV/IM/IN titrated to restore adequate minute ventilation)",
        color: "text-cyan-400 font-bold"
      };
    } else {
      return {
        name: "Sedative-Hypnotic Toxidrome (Benzos, Barbs)",
        vitals: "Mild Bradycardia, Mild Hypotension, Hypoventilation",
        pupils: "Normal to Mid-position",
        skin: "Normal",
        mnemonic: "CNS Depression, Lethargy, Slurred Speech, Ataxia, Stupor/Coma",
        antidote: "Airway protection & ventilation; Flumazenil (caution: risk of intractable seizures)",
        color: "text-indigo-400 font-bold"
      };
    }
  }, [selectedToxidrome]);

  const drugDetails = useMemo(() => {
    if (selectedDrug === "apap") {
      return {
        title: "Acetaminophen (Paracetamol, APAP)",
        mechanism: "CYP2E1 NAPQI metabolite depletes glutathione -> Centrilobular Hepatic Necrosis",
        diagnostics: "Rumack-Matthew Nomogram at 4h: Treatment line starts at 150 ug/mL (1000 umol/L)",
        antidote: "N-Acetylcysteine (NAC) IV 21h protocol (150 mg/kg -> 50 mg/kg -> 100 mg/kg) or oral 72h"
      };
    } else if (selectedDrug === "salicylate") {
      return {
        title: "Salicylates (Aspirin)",
        mechanism: "Respiratory center stimulation + Mitochondrial uncoupling -> Mixed Resp Alk + Met Acidosis",
        diagnostics: "Tinnitus, hyperthermia, tachypnea, high anion gap metabolic acidosis",
        antidote: "IV Sodium Bicarbonate (NaHCO3) urine alkalinization (pH 7.5-8.0) + Hemodialysis (>100 mg/dL)"
      };
    } else if (selectedDrug === "tca") {
      return {
        title: "Tricyclic Antidepressants (TCAs)",
        mechanism: "Fast inward sodium channel (INa) blockade -> Slow Phase 0 -> Wide QRS & Ventricular Arrhythmias",
        diagnostics: "ECG: QRS >100 ms (seizures), QRS >160 ms (arrhythmias), Terminal R in aVR >=3 mm",
        antidote: "Hypertonic Sodium Bicarbonate (1-2 mEq/kg IV bolus targeting serum pH 7.50-7.55)"
      };
    } else {
      return {
        title: "Digoxin (Cardiac Glycosides)",
        mechanism: "Na+/K+-ATPase inhibition -> Intracellular Ca2+ increase & Hyperkalemia",
        diagnostics: "Yellow-green halos (xanthopsia), bidirectional VT, junctional bradycardia, hyperkalemia",
        antidote: "Digoxin-Specific Fab Fragments (Digibind) for arrhythmias, K+ >5.0 mEq/L, or ingestion >10 mg"
      };
    }
  }, [selectedDrug]);

  const currentNodes = useMemo(() => {
    return TOXICOLOGY_NODES[activeMode] || TOXICOLOGY_NODES.toxidromes;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: ToxicologyLabNode) => {
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
            <Award size={14} /> TOX-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "toxidromes" && "5 Core Clinical Toxidromes & Poisoning Resuscitation"}
            {activeMode === "antidotes" && "Signature Overdoses & Antidotes (APAP, Salicylate, TCA & Digoxin)"}
            {activeMode === "heavymetals" && "Heavy Metal Chelation (Lead, Iron, Mercury) & Corrosive Ingestion"}
            {activeMode === "alcohols" && "Toxic Alcohols (Methanol/Ethylene Glycol) & Enhanced Elimination"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Toxicology Quiz"}
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
                  Clinical Toxicology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Toxin / Antidote: {quizTargetNode.diagnosticCriteria}
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

          {/* Mode 1: 5 Core Toxidromes Comparator */}
          {activeMode === "toxidromes" && (
            <div className={styles.toxSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> 5 Core Toxidrome Comparator
                </span>
                <span className="text-[11px] text-slate-400">Vitals &bull; Pupils &bull; Sweating &bull; Antidote</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <button
                  onClick={() => setSelectedToxidrome("cholinergic")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedToxidrome === "cholinergic"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Cholinergic
                </button>
                <button
                  onClick={() => setSelectedToxidrome("anticholinergic")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedToxidrome === "anticholinergic"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Anticholinergic
                </button>
                <button
                  onClick={() => setSelectedToxidrome("sympathomimetic")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedToxidrome === "sympathomimetic"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Sympathomimetic
                </button>
                <button
                  onClick={() => setSelectedToxidrome("opioid")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedToxidrome === "opioid"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Opioid
                </button>
                <button
                  onClick={() => setSelectedToxidrome("sedative")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedToxidrome === "sedative"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Sedative
                </button>
              </div>

              <div className={styles.toxResultsGrid}>
                <div className={styles.toxResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Vital Signs</div>
                  <div className="text-xs font-bold text-red-300 mt-1">{toxidromeDetails.vitals}</div>
                </div>
                <div className={styles.toxResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Pupil Response</div>
                  <div className="text-xs font-bold text-yellow-300 mt-1">{toxidromeDetails.pupils}</div>
                </div>
                <div className={styles.toxResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Skin / Sweating</div>
                  <div className="text-xs font-bold text-emerald-400 mt-1">{toxidromeDetails.skin}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-300">
                <div><strong className="text-red-400">Hallmark Signs:</strong> {toxidromeDetails.mnemonic}</div>
                <div className="mt-1"><strong className="text-emerald-400">Antidote Protocol:</strong> {toxidromeDetails.antidote}</div>
              </div>
            </div>
          )}

          {/* Mode 2: Signature Drug Overdoses */}
          {activeMode === "antidotes" && (
            <div className={styles.toxSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Pill size={14} /> Signature Drug Overdoses &amp; Antidotes
                </span>
                <span className="text-[11px] text-slate-400">APAP &bull; Salicylate &bull; TCA &bull; Digoxin</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedDrug("apap")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedDrug === "apap"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  APAP (NAC)
                </button>
                <button
                  onClick={() => setSelectedDrug("salicylate")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedDrug === "salicylate"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Aspirin (NaHCO3)
                </button>
                <button
                  onClick={() => setSelectedDrug("tca")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedDrug === "tca"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  TCA (NaHCO3 QRS)
                </button>
                <button
                  onClick={() => setSelectedDrug("digoxin")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedDrug === "digoxin"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  Digoxin (Digibind)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-red-300">{drugDetails.title}</div>
                <div className="text-slate-300 mt-1"><strong className="text-red-400">Pathophysiology:</strong> {drugDetails.mechanism}</div>
                <div className="text-slate-300 mt-1"><strong className="text-red-400">Diagnostics:</strong> {drugDetails.diagnostics}</div>
                <div className="text-emerald-300 font-bold mt-1.5"><strong className="text-emerald-400">Targeted Antidote Protocol:</strong> {drugDetails.antidote}</div>
              </div>
            </div>
          )}

          {/* Mode 3: Heavy Metals & Corrosives */}
          {activeMode === "heavymetals" && (
            <div className={styles.toxSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Heavy Metal Chelation &amp; Corrosives
                </span>
                <span className="text-[11px] text-slate-400">Lead &bull; Iron &bull; Mercury &bull; Endoscopy</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">Lead Chelation (Succimer / EDTA)</div>
                  <div className="text-slate-300 mt-1">Lead 45-69 ug/dL: Oral DMSA Succimer; Lead &ge;70 ug/dL: IM BAL followed by IV CaNa2-EDTA (BAL first to protect CNS!).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">Iron Overdose &amp; Deferoxamine</div>
                  <div className="text-slate-300 mt-1">Hemorrhagic gastritis and radio-opaque pills on X-ray. IV Deferoxamine forms ferrioxamine, creating 'vin rosé' urine.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Toxic Alcohols & Elimination */}
          {activeMode === "alcohols" && (
            <div className={styles.toxSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> Toxic Alcohols, Envenomation &amp; Dialysis
                </span>
                <span className="text-[11px] text-slate-400">Fomepizole &bull; ASV &bull; I-STUMBLE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">Methanol vs Ethylene Glycol</div>
                  <div className="text-slate-300 mt-1">High osmolar &amp; anion gap. Methanol causes optic blindness; Ethylene glycol causes calcium oxalate AKI. Treat with Fomepizole + Hemodialysis.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">Enhanced Elimination: I STUMBLE</div>
                  <div className="text-slate-300 mt-1">Hemodialysis for: Isopropanol, Salicylates, Theophylline, Uremia, Methanol, Barbiturates, Lithium, Ethylene glycol.</div>
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
                    <span className="text-red-400 font-bold">Protocol:</span> {node.clinicalProtocol}
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

        {/* Right Side: High-Yield Toxicology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
              Toxicology Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>☠️ Toxin &amp; Substance</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Toxicological Mechanism</div>
            <div className={styles.inspectorBody}>{activeNode.toxicMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Presentation &amp; Diagnostic Triad</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Antidote Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("toxidromes")}
          className={`${styles.modeTab} ${activeMode === "toxidromes" ? styles.modeTabActive : ""}`}
        >
          🚨 1. Toxidromes
        </button>
        <button
          onClick={() => setActiveMode("antidotes")}
          className={`${styles.modeTab} ${activeMode === "antidotes" ? styles.modeTabActive : ""}`}
        >
          💊 2. Drug Antidotes
        </button>
        <button
          onClick={() => setActiveMode("heavymetals")}
          className={`${styles.modeTab} ${activeMode === "heavymetals" ? styles.modeTabActive : ""}`}
        >
          🛡️ 3. Metals &amp; Corrosives
        </button>
        <button
          onClick={() => setActiveMode("alcohols")}
          className={`${styles.modeTab} ${activeMode === "alcohols" ? styles.modeTabActive : ""}`}
        >
          🍷 4. Alcohols &amp; Dialysis
        </button>
      </div>
    </div>
  );
}
