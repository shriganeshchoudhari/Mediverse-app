"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalPsychiatryAdvLabViewer.module.css";
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

export type PsychiatryLabMode = "emergencies" | "mood" | "psychosis" | "addiction";

export interface PsychiatryLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  psychProfile: string;
  pathophysiologyMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const PSYCHIATRY_LAB_NODES: Record<PsychiatryLabMode, PsychiatryLabNode[]> = {
  emergencies: [
    {
      id: "psy-em-nms-dantrolene",
      name: "Neuroleptic Malignant Syndrome NMS (Dopamine Blockade, Lead-Pipe Rigidity & Dantrolene)",
      category: "Dopaminergic Crisis",
      subType: "D2 Antagonists • Hyperthermia >40°C • 'Lead-Pipe' Rigidity • Massive CK >1,000-50,000 U/L",
      psychProfile: "Life-threatening idiosyncratic reaction to potent central dopamine D2 receptor blockade.",
      pathophysiologyMechanism: "Hypothalamic thermoregulatory failure and corpus striatal dopamine depletion cause severe skeletal muscle rigidity.",
      clinicalHallmarks: "Lead-pipe rigidity, autonomic instability (labile BP, tachycardia, diaphoresis), altered sensorium, massive CK rise; Dantrolene.",
      highYieldPearls: "NMS features hyporeflexia, lead-pipe rigidity, and massive CK elevation; treated with Dantrolene and Bromocriptine."
    },
    {
      id: "psy-em-serotonin-syndrome-hunter",
      name: "Serotonin Syndrome Hunter Criteria (5-HT2A Agonism, Ocular Clonus & Cyproheptadine)",
      category: "Serotonergic Storm",
      subType: "Pro-Serotonergic Drugs • Hyperreflexia 4+ • Ocular / Inducible Clonus • Cyproheptadine",
      psychProfile: "Potentially fatal hyper-serotonergic toxidrome caused by excess central and peripheral 5-HT receptor activation.",
      pathophysiologyMechanism: "Massive intrasynaptic accumulation of serotonin stimulating 5-HT1A and 5-HT2A postsynaptic receptors.",
      clinicalHallmarks: "Hyperreflexia, spontaneous/ocular clonus, tremor, diaphoresis, hyperactive bowel sounds; treated with Cyproheptadine + Benzodiazepines.",
      highYieldPearls: "Serotonin syndrome features hyperreflexia and clonus (ocular/inducible); treated with the 5-HT2A blocker Cyproheptadine."
    },
    {
      id: "psy-em-acute-dystonic-reaction",
      name: "Acute Dystonic Reaction (Basal Ganglia Cholinergic-Dopaminergic Imbalance & Benztropine)",
      category: "Extrapyramidal Crisis",
      subType: "High-Potency FGA (Haloperidol) • Hours to Days • Torticollis, Oculogyric Crisis • Benztropine",
      psychProfile: "Sudden, painful, sustained involuntary muscle contracture occurring rapidly following first-generation antipsychotic initiation.",
      pathophysiologyMechanism: "Acute D2 receptor antagonism precipitates unchecked striatal acetylcholine hyper-stimulation of motor pathways.",
      clinicalHallmarks: "Painful cervical torticollis, involuntary upward eye gaze deviation (oculogyric crisis), trismus, laryngospasm; IV/IM Diphenhydramine.",
      highYieldPearls: "Acute dystonic reactions are rapid painful muscle spasms treated urgently with IV/IM Benztropine or Diphenhydramine."
    },
    {
      id: "psy-em-tardive-dyskinesia-valbenazine",
      name: "Tardive Dyskinesia (D2 Up-Regulation & Valbenazine VMAT2 Inhibition)",
      category: "Chronic EPS",
      subType: "Chronic Antipsychotics (>6 Months) • Choreoathetoid Movements • Lip Smacking • VMAT2 Inhibitors",
      psychProfile: "Potentially irreversible hyperkinetic movement disorder resulting from long-term antipsychotic neuroleptic exposure.",
      pathophysiologyMechanism: "Chronic nigrostriatal D2 blockade causes compensatory D2 receptor supersensitivity and up-regulation.",
      clinicalHallmarks: "Involuntary rhythmic movements of tongue, face, and lips (lip smacking, tongue protrusion, grimacing); Valbenazine / Deutetrabenazine.",
      highYieldPearls: "Tardive dyskinesia features choreoathetoid oro-facial movements from D2 supersensitivity; treated with VMAT2 inhibitors."
    }
  ],

  mood: [
    {
      id: "psy-md-lithium-therapeutic-window",
      name: "Lithium Carbonate Narrow Index (Renal Elimination, Ebstein Anomaly & Hemodialysis >2.5 mEq/L)",
      category: "Mood Stabilizer",
      subType: "Therapeutic 0.6-1.2 mEq/L • Nephrogenic DI • Hypothyroidism • Teratogenic Ebstein Anomaly",
      psychProfile: "Gold standard mood stabilizer for acute bipolar mania and long-term suicide prevention.",
      pathophysiologyMechanism: "Inhibits inositol monophosphatase and glycogen synthase kinase-3 (GSK-3); eliminated 100% unchanged via kidneys.",
      clinicalHallmarks: "Narrow therapeutic index (0.6-1.2 mEq/L); toxicity (>1.5) causes coarse tremor, ataxia; hemodialysis for >2.5 with symptoms or >4.0.",
      highYieldPearls: "Lithium toxicity is triggered by NSAIDs/Thiazides and treated by hemodialysis (>2.5 mEq/L); causes fetal Ebstein anomaly."
    },
    {
      id: "psy-md-valproate-teratogenesis",
      name: "Divalproex Sodium Valproate (Neural Tube Defects Spina Bifida & Hepatic Necrosis)",
      category: "Anticonvulsant Stabilizer",
      subType: "Therapeutic 50-125 ug/mL • Neural Tube Defects (1-2%) • Fulminant Hepatotoxicity • Pancreatitis",
      psychProfile: "First-line mood stabilizer for acute mania and mixed bipolar episodes.",
      pathophysiologyMechanism: "Blocks voltage-gated sodium channels and augments brain GABA synthesis while inhibiting GABA degradation.",
      clinicalHallmarks: "Teratogenic neural tube defects (spina bifida / myelomeningocele), fulminant fatal hepatotoxicity, acute pancreatitis, thrombocytopenia.",
      highYieldPearls: "Valproate carries a 1-2% risk of fetal neural tube defects (spina bifida) and requires baseline and periodic LFT and CBC monitoring."
    },
    {
      id: "psy-md-lamotrigine-sjs-titration",
      name: "Lamotrigine Titration (Bipolar Depression & SJS/TEN Rash Surveillance)",
      category: "Bipolar Maintenance",
      subType: "Slow Titration • Bipolar Depression • Stevens-Johnson Syndrome (SJS) Risk • Low Teratogenicity",
      psychProfile: "First-line maintenance mood stabilizer specialized for the depressive pole of bipolar disorder.",
      pathophysiologyMechanism: "Inhibits voltage-sensitive sodium channels and suppresses presynaptic glutamate and aspartate release.",
      clinicalHallmarks: "Requires meticulous slow dose escalation; black box warning for life-threatening Stevens-Johnson Syndrome (SJS) and TEN skin rashes.",
      highYieldPearls: "Lamotrigine treats bipolar depression but requires slow titration due to the risk of life-threatening SJS/TEN rash."
    },
    {
      id: "psy-md-carbamazepine-autoinduction",
      name: "Carbamazepine Autoinduction (Aplastic Anemia, Hyponatremia SIADH & Neural Defects)",
      category: "CYP3A4 Inducer",
      subType: "Therapeutic 4-12 ug/mL • Potent CYP3A4 Autoinducer • Aplastic Anemia • SIADH Hyponatremia",
      psychProfile: "Anticonvulsant mood stabilizer used for acute mania refractory to Lithium and Valproate.",
      pathophysiologyMechanism: "Stabilizes inactivated sodium channels; induces its own hepatic metabolism (autoinduction) and increases CYP3A4 clearance.",
      clinicalHallmarks: "Aplastic anemia, agranulocytosis, SIADH (dilutional hyponatremia), CYP3A4 drug interactions, neural tube defects; HLA-B*1502 testing.",
      highYieldPearls: "Carbamazepine causes CYP3A4 autoinduction, aplastic anemia, and SIADH hyponatremia; requires CBC and sodium monitoring."
    }
  ],

  psychosis: [
    {
      id: "psy-ps-clozapine-rems-anc",
      name: "Clozapine REMS Agranulocytosis (ANC <500/uL Absolute Cutoff & G-CSF Filgrastim)",
      category: "Refractory Antipsychotic",
      subType: "Treatment-Resistant Schizophrenia • Suicidality Reduction • REMS ANC Monitoring • Myocarditis Risk",
      psychProfile: "Most effective atypical antipsychotic for treatment-resistant schizophrenia and reducing suicide risk.",
      pathophysiologyMechanism: "Weak D2 antagonism with high 5-HT2A, D4, and alpha-1 receptor blockade; zero extrapyramidal motor side effects.",
      clinicalHallmarks: "Mandatory REMS tracking: severe neutropenia (ANC <500/uL) requires permanent cessation; myocarditis, dose-dependent seizures.",
      highYieldPearls: "Clozapine is gold standard for refractory schizophrenia; stop permanently if ANC drops <500/uL (agranulocytosis)."
    },
    {
      id: "psy-ps-olanzapine-metabolic-syndrome",
      name: "Olanzapine Metabolic Syndrome (Insulin Resistance, Weight Gain & Lipid Decompensation)",
      category: "Metabolic Risk SGA",
      subType: "Potent 5-HT2C/H1 Blockade • Massive Weight Gain • Hypertriglyceridemia • Fasting Glucose Monitoring",
      psychProfile: "Highly efficacious second-generation antipsychotic with the highest risk of metabolic decompensation.",
      pathophysiologyMechanism: "Hypothalamic histamine H1 and serotonin 5-HT2C antagonism stimulates voracious hyperphagia and impairs peripheral insulin sensitivity.",
      clinicalHallmarks: "Rapid substantial weight gain, new-onset type 2 diabetes mellitus, diabetic ketoacidosis (DKA), severe hypertriglyceridemia.",
      highYieldPearls: "Olanzapine and Clozapine carry the highest risk of metabolic syndrome, extreme weight gain, and diabetic ketoacidosis."
    },
    {
      id: "psy-ps-risperidone-hyperprolactinemia",
      name: "Risperidone Hyperprolactinemia (Tuberoinfundibular D2 Blockade & Galactorrhea)",
      category: "Endocrine Disruption",
      subType: "Potent D2 Blockade • Tuberoinfundibular Pathway • Hyperprolactinemia • Galactorrhea & Amenorrhea",
      psychProfile: "Second-generation antipsychotic with the highest potency of D2 antagonism among atypical agents.",
      pathophysiologyMechanism: "Dopamine D2 blockade in the tuberoinfundibular pituitary pathway removes normal tonic prolactin inhibition (PIF).",
      clinicalHallmarks: "Symptomatic hyperprolactinemia: galactorrhea, amenorrhea, sexual dysfunction, gynecomastia in males, long-term osteopenia.",
      highYieldPearls: "Risperidone causes the highest elevation in serum prolactin among SGAs due to potent tuberoinfundibular D2 receptor blockade."
    },
    {
      id: "psy-ps-haloperidol-fga-cascade",
      name: "Haloperidol Extrapyramidal Cascade (Nigrostriatal D2 Blockade & Acute Dystonias)",
      category: "High-Potency FGA",
      subType: "High-Potency Typical FGA • Acute Dystonia (Hours) • Akathisia (Weeks) • Parkinsonism (Months)",
      psychProfile: "Potent first-generation butyrophenone antipsychotic used for acute psychiatric agitation and delirium.",
      pathophysiologyMechanism: "High-affinity competitive antagonism of striatal D2 receptors leads to sequential extrapyramidal motor syndromes.",
      clinicalHallmarks: "Acute dystonia (hours), akathisia (weeks - treated with Propranolol), parkinsonism (months - treated with Benztropine), tardive dyskinesia.",
      highYieldPearls: "Haloperidol carries very high EPS and NMS risk but minimal anticholinergic or metabolic side effects."
    }
  ],

  addiction: [
    {
      id: "psy-ad-delirium-tremens-ciwa",
      name: "Delirium Tremens Autonomic Storm (48-96h Glutamate Rebound, Fever & CIWA Benzodiazepines)",
      category: "Alcohol Emergency",
      subType: "Onset 48-96 Hours • Disorientation, Delirium • Severe Autonomic Hyperactivity • CIWA Benzodiazepines",
      psychProfile: "Life-threatening medical emergency caused by severe acute alcohol withdrawal in chronic dependent drinkers.",
      pathophysiologyMechanism: "Abrupt cessation of chronic ethanol agonist action on GABA-A and antagonist action on NMDA triggers massive glutamate rebound.",
      clinicalHallmarks: "Severe confusion, fluctuating vitals, fever, diaphoresis, visual/tactile hallucinations; ICU CIWA IV Diazepam/Lorazepam.",
      highYieldPearls: "Delirium Tremens occurs 48-96 hours after the last drink with severe autonomic instability; treated with IV Benzodiazepines."
    },
    {
      id: "psy-ad-wernicke-encephalopathy-thiamine",
      name: "Wernicke Encephalopathy Prevention (Mammillary Body Necrosis & Thiamine Before Dextrose)",
      category: "Nutritional Emergency",
      subType: "Vitamin B1 (Thiamine) Deficiency • Triad: Confusion, Ataxia, Nystagmus • THIAMINE BEFORE GLUCOSE",
      psychProfile: "Acute neuro-metabolic emergency resulting from severe thiamine deficiency in chronic alcohol dependence.",
      pathophysiologyMechanism: "Thiamine pyrophosphate depletion impairs pyruvate dehydrogenase; glucose infusion without thiamine triggers lactic acidosis and necrosis.",
      clinicalHallmarks: "Classic triad: confusion, gait ataxia, bilateral lateral rectus palsy / nystagmus; petechial hemorrhagic necrosis of mammillary bodies.",
      highYieldPearls: "Always give IV Thiamine BEFORE or WITH IV Dextrose in alcoholic patients to avoid precipitating fatal Wernicke encephalopathy."
    },
    {
      id: "psy-ad-naltrexone-craving-reduction",
      name: "Naltrexone Opioid Antagonism (Mu-Receptor Blocker & Alcohol Craving Reduction)",
      category: "Addiction Maintenance",
      subType: "Mu-Opioid Receptor Antagonist • Reduces Heavy Drinking Days • Blunts Dopamine Reward Pathways",
      psychProfile: "First-line evidence-based pharmacotherapy for maintaining abstinence and reducing relapse in Alcohol Use Disorder.",
      pathophysiologyMechanism: "Blocks endogenous endorphin binding to mu-opioid receptors in the ventral tegmental area (VTA), blunting dopamine release in nucleus accumbens.",
      clinicalHallmarks: "Significantly decreases alcohol cravings and binge drinking; strictly contraindicated in patients taking prescribed opioids or in acute hepatitis.",
      highYieldPearls: "Naltrexone is a mu-opioid antagonist that reduces alcohol craving; strictly contraindicated if the patient is taking opioids."
    },
    {
      id: "psy-ad-opioid-overdose-naloxone",
      name: "Opioid Overdose Naloxone Reversal (Respiratory Arrest & Buprenorphine Maintenance)",
      category: "Opioid Toxidrome",
      subType: "Triad: Miosis, Respiratory Depression, Coma • IV/IN Naloxone • Buprenorphine (COWS >12 Maintenance)",
      psychProfile: "Acute life-threatening respiratory arrest from synthetic or natural opioid mu-receptor agonism.",
      pathophysiologyMechanism: "Direct suppression of medullary respiratory drive centers mediated by mu-opioid receptor hyperpolarization.",
      clinicalHallmarks: "Pinpoint pupils (miosis), respiratory rate <8/min, cyanosis, coma; immediate IV/IN Naloxone; maintenance with Buprenorphine/Methadone.",
      highYieldPearls: "Opioid overdose triad: respiratory depression, pinpoint pupils, and coma; reversed immediately with IV/IN Naloxone."
    }
  ]
};

interface ClinicalPsychiatryAdvLabViewerProps {
  initialMode?: PsychiatryLabMode;
  height?: string;
  onNodeSelect?: (node: PsychiatryLabNode) => void;
}

export default function ClinicalPsychiatryAdvLabViewer({
  initialMode = "emergencies",
  height = "560px",
  onNodeSelect,
}: ClinicalPsychiatryAdvLabViewerProps) {
  const [activeMode, setActiveMode] = useState<PsychiatryLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Tox-Syndrome Selector State
  const [selectedTox, setSelectedTox] = useState<"nms" | "serotonin" | "anticholinergic" | "mh">("nms");

  // Lithium Level Simulator State
  const [lithiumLevel, setLithiumLevel] = useState<number>(0.9);

  const toxDetails = useMemo(() => {
    if (selectedTox === "nms") {
      return {
        title: "Neuroleptic Malignant Syndrome (NMS)",
        indices: "D2 Antagonists • Hyperthermia >40°C • 'Lead-Pipe' Rigidity • Massive CK >1,000-50,000 U/L",
        rx: "Stop Antipsychotic + ICU Cooling + Dantrolene (Ryanodine Blocker) + Bromocriptine / Amantadine",
        pearl: "NMS features hyporeflexia, lead-pipe rigidity, and massive CK elevation; treated with Dantrolene and Bromocriptine."
      };
    } else if (selectedTox === "serotonin") {
      return {
        title: "Serotonin Syndrome (Hunter Criteria)",
        indices: "5-HT Excess • Hyperreflexia 4+ • Ocular / Inducible Clonus • Diaphoresis & Tremor",
        rx: "Discontinue Serotonergic Agents + IV Benzodiazepines (Lorazepam) + Cyproheptadine (5-HT2A Antagonist)",
        pearl: "Serotonin syndrome features hyperreflexia and clonus (ocular/inducible); treated with Cyproheptadine."
      };
    } else if (selectedTox === "anticholinergic") {
      return {
        title: "Anticholinergic Toxicity",
        indices: "TCAs / Atropine / Scopolamine • Mydriasis, Anhidrosis, Dry Flushed Skin, Urinary Retention, Delirium",
        rx: "Discontinue Anticholinergic + Supportive Care + Physostigmine (Acetylcholinesterase Inhibitor)",
        pearl: "'Mad as a hatter, red as a beet, blind as a bat, hot as a hare, dry as a bone, bowel and bladder lose their tone.'"
      };
    } else {
      return {
        title: "Malignant Hyperthermia (MH)",
        indices: "Inhaled Anesthetics (Halothane, Sevoflurane) + Succinylcholine • Masseter Spasm • Massive Rigidity",
        rx: "Immediate IV Dantrolene (2.5 mg/kg IV push) + 100% Oxygen + Hyperventilation + Active Body Cooling",
        pearl: "Triggered by RYR1 ryanodine receptor mutations causing uncontrolled sarcoplasmic calcium release."
      };
    }
  }, [selectedTox]);

  const lithiumStatus = useMemo(() => {
    if (lithiumLevel < 0.6) {
      return {
        status: "Subtherapeutic (<0.6 mEq/L)",
        color: "text-blue-400",
        interpretation: "Below target range for bipolar mania and maintenance; risk of acute manic or depressive relapse.",
        action: "Titrate Lithium dose upward and recheck trough serum level in 5-7 days."
      };
    } else if (lithiumLevel <= 1.2) {
      return {
        status: "Therapeutic Window (0.6 - 1.2 mEq/L)",
        color: "text-emerald-400",
        interpretation: "Optimal therapeutic blood level for maintenance and acute mood stabilization with minimal neurotoxicity.",
        action: "Maintain current dosage; monitor renal function (BUN/Creatinine), eGFR, TSH, and electrolytes every 6-12 months."
      };
    } else if (lithiumLevel <= 2.5) {
      return {
        status: "Mild to Moderate Toxicity (1.5 - 2.5 mEq/L)",
        color: "text-amber-400",
        interpretation: "Elevated toxic blood level; causes coarse hand tremor, vomiting, diarrhea, hyperreflexia, ataxia, and slurred speech.",
        action: "Hold Lithium immediately; administer IV Isotonic Saline (0.9% NaCl) hydration to promote renal excretion; check drug interactions (NSAIDs/Thiazides)."
      };
    } else {
      return {
        status: "Severe Life-Threatening Toxicity (>2.5 mEq/L)",
        color: "text-rose-400",
        interpretation: "Critical toxic level (>2.5 mEq/L); causes seizures, clonic movements, coma, permanent cerebellar ataxia, and acute tubular necrosis.",
        action: "EMERGENT HEMODIALYSIS MANDATORY (for level >2.5 mEq/L with severe symptoms/renal failure or >4.0 mEq/L regardless of symptoms)."
      };
    }
  }, [lithiumLevel]);

  const currentNodes = useMemo(() => {
    return PSYCHIATRY_LAB_NODES[activeMode] || PSYCHIATRY_LAB_NODES.emergencies;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: PsychiatryLabNode) => {
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
            <Brain size={14} /> PSY-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "emergencies" && "Acute Psychiatric Emergencies: NMS (Dantrolene), Serotonin Syndrome & Acute EPS"}
            {activeMode === "mood" && "Mood Disorders & Psychopharmacology: Bipolar I/II, Lithium Narrow Window & Ebstein Anomaly"}
            {activeMode === "psychosis" && "Psychotic Disorders & Antipsychotics: Schizophrenia, Clozapine REMS & Metabolic Risk"}
            {activeMode === "addiction" && "Substance Use Disorders & Addiction Medicine: Delirium Tremens CIWA & Opioid Maintenance"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Psychiatry Diagnostic Quiz"}
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
                  Psychiatry Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Psychiatric Disorder / Psychopharmacology Entity: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: Acute Emergencies & Tox-Syndromes */}
          {activeMode === "emergencies" && (
            <div className={styles.psychCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Psychotropic Tox-Syndromes &amp; Hyperthermia Differential
                </span>
                <span className="text-[11px] text-slate-400">NMS &bull; Serotonin Syndrome &bull; Anticholinergic &bull; Malignant Hyperthermia</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedTox("nms")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTox === "nms"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚡ NMS (Lead-Pipe / CK)
                </button>
                <button
                  onClick={() => setSelectedTox("serotonin")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTox === "serotonin"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🔄 Serotonin (Clonus)
                </button>
                <button
                  onClick={() => setSelectedTox("anticholinergic")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTox === "anticholinergic"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🌵 Anticholinergic
                </button>
                <button
                  onClick={() => setSelectedTox("mh")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTox === "mh"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🔥 Malignant Hyperthermia
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-purple-300">{toxDetails.title}</div>
                <div className="text-purple-400 font-bold mt-1">{toxDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-purple-400">Action:</strong> {toxDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Psych Pearl:</strong> {toxDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 2: Mood Disorders & Lithium Teratology */}
          {activeMode === "mood" && (
            <div className={styles.psychCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={14} /> Lithium Therapeutic Window &amp; Dialysis Calculator
                </span>
                <span className="text-[11px] text-slate-400">Target 0.6 - 1.2 mEq/L &bull; Toxic &gt;1.5 &bull; Hemodialysis &gt;2.5</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Serum Lithium Concentration:</span>
                  <span className="font-bold text-purple-300">{lithiumLevel.toFixed(1)} mEq/L</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="5.0"
                  step="0.1"
                  value={lithiumLevel}
                  onChange={(e) => setLithiumLevel(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                  <div className={`text-sm font-bold ${lithiumStatus.color}`}>{lithiumStatus.status}</div>
                  <div className="text-slate-300 mt-1">{lithiumStatus.interpretation}</div>
                  <div className="text-purple-400 font-bold mt-1">Action: {lithiumStatus.action}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Psychotic Disorders & Antipsychotics */}
          {activeMode === "psychosis" && (
            <div className={styles.psychCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Clozapine REMS Absolute Neutrophil Count (ANC) Protocol
                </span>
                <span className="text-[11px] text-slate-400">ANC &lt;500/uL Absolute Stop &bull; G-CSF Filgrastim &bull; Myocarditis</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Clozapine Agranulocytosis Mandate</div>
                  <div className="text-slate-300 mt-1">Gold standard for treatment-resistant schizophrenia. Mandatory REMS ANC monitoring: Normal &ge; 1,500/&mu;L. If ANC drops &lt;500/&mu;L (severe neutropenia/agranulocytosis), Clozapine must be permanently discontinued, patient isolated, blood cultures drawn, and G-CSF (Filgrastim) administered.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Metabolic Syndrome (Olanzapine)</div>
                  <div className="text-slate-300 mt-1">Second-generation antipsychotics block 5-HT2C and H1 receptors, causing severe hyperphagia, massive weight gain, insulin resistance, and diabetic ketoacidosis (worst with Olanzapine and Clozapine; weight-neutral: Aripiprazole and Ziprasidone).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Substance Use Disorders & Addiction */}
          {activeMode === "addiction" && (
            <div className={styles.psychCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={14} /> Alcohol Withdrawal Timeline &amp; Opioid Agonist Protocols
                </span>
                <span className="text-[11px] text-slate-400">6h Tremors &bull; 12h Hallucinosis &bull; 24h Seizures &bull; 48-96h Delirium Tremens</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Delirium Tremens &amp; CIWA Protocol</div>
                  <div className="text-slate-300 mt-1">Occurs 48-96 hours after last drink due to profound GABA down-regulation and NMDA glutamate storm. Features delirium, fever, drenching sweats, and autonomic collapse. Managed with symptom-triggered IV Diazepam/Lorazepam and Thiamine before Glucose.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Relapse Prevention &amp; Opioids</div>
                  <div className="text-slate-300 mt-1">Naltrexone (mu-opioid antagonist) blunts dopamine reward to reduce alcohol cravings. Acamprosate modulates NMDA/GABA (safe in liver failure). Opioid overdose is reversed with Naloxone; maintenance uses Buprenorphine (partial agonist) or Methadone (full agonist).</div>
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
                    <span className="text-purple-400 font-bold">Psych:</span> {node.psychProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect Psych protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Clinical Psychiatry Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Psychiatry Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧠 Psychiatric Entity / Pathology</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Neurobiological Mechanism</div>
            <div className="text-xs text-purple-300 font-semibold">{activeNode.psychProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiologyMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Diagnostics</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Psych Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("emergencies")}
          className={`${styles.modeTab} ${activeMode === "emergencies" ? styles.modeTabActive : ""}`}
        >
          ⚡ 1. Tox-Syndromes (NMS/SS)
        </button>
        <button
          onClick={() => setActiveMode("mood")}
          className={`${styles.modeTab} ${activeMode === "mood" ? styles.modeTabActive : ""}`}
        >
          🔄 2. Mood &amp; Lithium Window
        </button>
        <button
          onClick={() => setActiveMode("psychosis")}
          className={`${styles.modeTab} ${activeMode === "psychosis" ? styles.modeTabActive : ""}`}
        >
          🧠 3. Clozapine REMS &amp; Psychosis
        </button>
        <button
          onClick={() => setActiveMode("addiction")}
          className={`${styles.modeTab} ${activeMode === "addiction" ? styles.modeTabActive : ""}`}
        >
          🔥 4. Substance Use &amp; CIWA
        </button>
      </div>
    </div>
  );
}
