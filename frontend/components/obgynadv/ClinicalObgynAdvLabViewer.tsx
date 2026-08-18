"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalObgynAdvLabViewer.module.css";
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

export type ObgynLabMode = "preeclampsia" | "pph" | "efm" | "gynOnc";

export interface ObgynLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  obstetricProfile: string;
  pathophysiologyMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const OBGYN_LAB_NODES: Record<ObgynLabMode, ObgynLabNode[]> = {
  preeclampsia: [
    {
      id: "obg-pre-severe-features",
      name: "Preeclampsia with Severe Features (Endothelial Dysfunction & Immediate MgSO4)",
      category: "Hypertensive Disorders",
      subType: "BP >=160/110 • Platelets <100k • AST/ALT >2x • Creatinine >1.1 • Visual Symptoms • Delivery >=34w",
      obstetricProfile: "Multisystem microvascular endothelial injury triggered by defective trophoblast spiral artery remodeling.",
      pathophysiologyMechanism: "Imbalance of angiogenic (VEGF/PlGF) and anti-angiogenic (sFlt-1/sEng) factors causing systemic vasospasm.",
      clinicalHallmarks: "Persistent severe frontal headache, scotomas, RUQ epigastric pain; IV Magnesium Sulfate for seizure prophylaxis.",
      highYieldPearls: "Preeclampsia with severe features mandates delivery at >=34 weeks; treat severe BP with IV Labetalol or Hydralazine."
    },
    {
      id: "obg-pre-hellp-syndrome",
      name: "HELLP Syndrome Microangiopathy (Schistocytes, Transaminitis & Thrombocytopenia)",
      category: "Microangiopathic Hemolysis",
      subType: "Hemolysis (LDH >600, Bilirubin >1.2, Schistocytes) + Elevated Liver Enzymes + Low Platelets (<100k)",
      obstetricProfile: "Severe variant of preeclampsia featuring microangiopathic hemolytic anemia and hepatic sinusoid fibrin deposition.",
      pathophysiologyMechanism: "Platelet consumption on damaged endothelial surfaces with intrahepatic microvascular thrombosis and distension.",
      clinicalHallmarks: "Fragmented red blood cells (schistocytes), high LDH, transaminitis, RUQ tenderness; immediate delivery regardless of GA.",
      highYieldPearls: "HELLP syndrome is an absolute indication for prompt maternal stabilization with MgSO4 followed by immediate delivery."
    },
    {
      id: "obg-pre-eclampsia-seizures",
      name: "Eclamptic Seizure Stabilization (Magnesium Sulfate Infusion & Calcium Gluconate)",
      category: "Obstetric Emergency",
      subType: "New Tonic-Clonic Seizures • MgSO4 (4-6 g Load + 1-2 g/h) • Antidote: Calcium Gluconate (1 g IV)",
      obstetricProfile: "Cerebral vasospasm, breakdown of blood-brain barrier autoregulation, and cytotoxic/vasogenic edema.",
      pathophysiologyMechanism: "Magnesium acts as an NMDA receptor blocker and cerebral vasodilator, raising the seizure threshold.",
      clinicalHallmarks: "Postictal confusion; monitor patellar DTRs, respiratory rate >=12, and urine output >=30 mL/h; emergent delivery.",
      highYieldPearls: "Magnesium Sulfate toxicity causes loss of DTRs (7-10 mEq/L) then respiratory arrest (12 mEq/L); antidote is Calcium Gluconate."
    },
    {
      id: "obg-pre-antihypertensive-crisis",
      name: "Acute Hypertensive Crisis Protocols (IV Labetalol, Hydralazine & Oral Nifedipine)",
      category: "Maternal Hemodynamics",
      subType: "Severe Range BP >=160/110 for >=15 min • Goal BP: 140-150 / 90-100 mmHg • Stroke Prevention",
      obstetricProfile: "Pharmacological blood pressure control to prevent catastrophic maternal intracranial hemorrhage and placental abruption.",
      pathophysiologyMechanism: "Rapid reduction of vascular resistance without causing maternal hypotension that could compromise fetal perfusion.",
      clinicalHallmarks: "IV Labetalol (20-40-80 mg, avoid in asthma/bradycardia), IV Hydralazine (5-10 mg), or Oral Nifedipine (10-20 mg).",
      highYieldPearls: "Lowering severe-range BP (>=160/110) within 30-60 minutes prevents maternal hemorrhagic stroke."
    }
  ],

  pph: [
    {
      id: "obg-pph-atony-tone",
      name: "Uterine Atony Pharmacotherapy (Oxytocin, Ergots, Prostaglandins & TXA)",
      category: "PPH: Tone (70%)",
      subType: "Boggy Uterus • Cumulative Blood Loss >=1,000 mL • Oxytocin 1st-Line • Bimanual Uterine Compression",
      obstetricProfile: "Failure of the interlacing myometrial fibers to contract and mechanically occlude spiral arteries after placental delivery.",
      pathophysiologyMechanism: "Risk factors: prolonged labor, chorioamnionitis, multiparity, uterine overdistension (polyhydramnios, macrosomia).",
      clinicalHallmarks: "Enlarged, soft, boggy uterus with heavy continuous vaginal bleeding; stepwise escalation of uterotonic agents.",
      highYieldPearls: "Uterine atony accounts for ~70% of all PPH; initial management is immediate bimanual massage and IV Oxytocin."
    },
    {
      id: "obg-pph-methergine-htn",
      name: "Methylergonovine Vasoconstriction Caution (Contraindicated in Hypertension & Preeclampsia)",
      category: "Uterotonic Safety",
      subType: "Methylergonovine (Methergine 0.2 mg IM) • Ergot Alpha-Adrenergic Agonist • STRICTLY AVOID IN HYPERTENSION",
      obstetricProfile: "Potent smooth muscle uterotonic that induces sustained, tetanic myometrial contractions and generalized vasoconstriction.",
      pathophysiologyMechanism: "Stimulates alpha-adrenergic and serotonergic receptors in vascular smooth muscle, causing profound blood pressure spikes.",
      clinicalHallmarks: "Must check maternal blood pressure before administration; administration in preeclampsia can trigger intracranial stroke.",
      highYieldPearls: "Methylergonovine (Methergine) is strictly contraindicated in patients with gestational hypertension or preeclampsia."
    },
    {
      id: "obg-pph-hemabate-asthma",
      name: "Carboprost Tromethamine Bronchospasm (Contraindicated in Asthma & Reactive Airway)",
      category: "Uterotonic Safety",
      subType: "Carboprost (Hemabate 250 mcg IM) • Prostaglandin F2-alpha Analog • STRICTLY AVOID IN ASTHMA",
      obstetricProfile: "Potent prostanoid receptor agonist causing intense myometrial contraction and strong bronchial smooth muscle constriction.",
      pathophysiologyMechanism: "PGF2-alpha stimulates bronchial FP receptors, precipitating severe bronchospasm, hypoxia, and respiratory failure.",
      clinicalHallmarks: "Side effects include severe explosive watery diarrhea, shivering, and pyrexia; strictly avoided in reactive airway disease.",
      highYieldPearls: "Carboprost Tromethamine (Hemabate - PGF2a) is strictly contraindicated in patients with active or past history of asthma."
    },
    {
      id: "obg-pph-bakri-b-lynch",
      name: "Bakri Balloon & B-Lynch Compression (Intrauterine Tamponade & Compressive Sutures)",
      category: "Mechanical Hemostasis",
      subType: "Bakri Balloon (300-500 mL Saline) • B-Lynch Compression Suture • Uterine Artery Ligation • Hysterectomy",
      obstetricProfile: "Non-pharmacological mechanical compression of the placental bed to arrest refractory postpartum hemorrhage.",
      pathophysiologyMechanism: "Creates inward radial hydrostatic pressure against the bleeding endomyometrial vascular network.",
      clinicalHallmarks: "Positive 'tamponade test' with Bakri balloon arrests bleeding; B-Lynch suture compresses anterior/posterior uterine walls.",
      highYieldPearls: "The Bakri intrauterine tamponade balloon is filled with 300-500 mL saline to treat refractory atonic PPH."
    }
  ],

  efm: [
    {
      id: "obg-efm-cat1-normal",
      name: "NICHD Category I Reassuring Tracing (Normal Acid-Base & Moderate Variability)",
      category: "EFM Classification",
      subType: "Baseline 110-160 bpm • Moderate Variability (6-25 bpm) • No Late/Variable Decelerations • Reassuring",
      obstetricProfile: "Physiological electrocardiological tracing indicating adequate fetal cerebral and myocardial oxygenation.",
      pathophysiologyMechanism: "Intact autonomic balance between sympathetic cardioaccelerator and parasympathetic vagal cardioregulatory centers.",
      clinicalHallmarks: "Strongly predictive of normal umbilical cord pH (>=7.20) and absence of intrapartum metabolic acidemia.",
      highYieldPearls: "NICHD Category I tracings require no specific intervention and predict normal fetal acid-base status."
    },
    {
      id: "obg-efm-variable-cord",
      name: "Variable Decelerations (Cord Compression & Position Repositioning)",
      category: "FHR Decelerations",
      subType: "Abrupt FHR Drop (<30s to nadir) • Depth >=15 bpm for >=15s • Umbilical Cord Compression • VEAL CHOP",
      obstetricProfile: "Transient mechanical occlusion of the umbilical vein and arteries during contractions or fetal movement.",
      pathophysiologyMechanism: "Umbilical artery occlusion increases fetal systemic resistance, triggering baroreceptor-mediated vagal bradycardia.",
      clinicalHallmarks: "V-shaped waveforms with rapid drop and recovery; first-line management is maternal position change (lateral/knee-chest).",
      highYieldPearls: "Variable decelerations are caused by umbilical cord compression; first-line management is maternal repositioning."
    },
    {
      id: "obg-efm-late-placenta",
      name: "Late Decelerations (Uteroplacental Hypoperfusion & Resuscitation)",
      category: "FHR Decelerations",
      subType: "Gradual FHR Drop (>=30s) • Nadir Occurs AFTER Contraction Peak • Uteroplacental Insufficiency",
      obstetricProfile: "Transient drop in intervillous space perfusion causing fetal arterial hypoxemia during peak uterine contractions.",
      pathophysiologyMechanism: "Fetal chemoreceptor stimulation in response to transient hypoxia triggers vagal reflex deceleration.",
      clinicalHallmarks: "When recurrent with absent variability, indicates fetal metabolic acidemia; stop oxytocin, give IV fluids and oxygen.",
      highYieldPearls: "Late decelerations are caused by uteroplacental insufficiency; intrauterine resuscitation is mandatory."
    },
    {
      id: "obg-efm-sinusoidal-anemia",
      name: "Sinusoidal FHR Undulation (Severe Fetal Anemia & Immediate Cesarean)",
      category: "NICHD Category III",
      subType: "Smooth Sine Wave Baseline (3-5 cycles/min, 5-15 bpm amplitude) • Severe Fetal Anemia / Acidemia",
      obstetricProfile: "Severe hemodynamic decompensation characterized by loss of autonomic central nervous system vascular control.",
      pathophysiologyMechanism: "Profound fetal tissue hypoxia due to severe anemia (feto-maternal hemorrhage, Rh isoimmunization, vasa previa).",
      clinicalHallmarks: "Undulating smooth sinusoidal waveform lasting >=20 minutes; mandates emergency operative delivery (Cesarean section).",
      highYieldPearls: "A true sinusoidal fetal heart rate pattern is pathognomonic for severe fetal anemia or severe acidemia."
    }
  ],

  gynOnc: [
    {
      id: "obg-onc-cervical-hpv",
      name: "Cervical Squamous Carcinoma (HPV 16/18 Oncoproteins E6/E7 & Chemoradiation)",
      category: "Cervical Malignancy",
      subType: "HPV 16/18 • E6 Degrades p53 • E7 Inactivates Rb • Radical Hysterectomy vs Cisplatin Chemoradiation",
      obstetricProfile: "Malignant transformation of the cervical transformation zone epithelium driven by high-risk oncogenic HPV.",
      pathophysiologyMechanism: "Integration of viral DNA leads to continuous overexpression of E6 (p53 degradation) and E7 (pRb inhibition).",
      clinicalHallmarks: "Postcoital spotting, exophytic cervical lesion; early stages treated surgically; advanced stages receive Cisplatin + RT.",
      highYieldPearls: "HPV 16/18 oncoproteins E6 and E7 inactivate p53 and pRb respectively; locally advanced cancer is treated with chemoradiation."
    },
    {
      id: "obg-onc-endometrial-lynch",
      name: "Endometrial Adenocarcinoma (Unopposed Estrogen, Lynch Syndrome & Staging)",
      category: "Uterine Malignancy",
      subType: "Postmenopausal Bleeding (PMB) • Unopposed Estrogen / PTEN • Lynch Syndrome (MLH1/MSH2) • TAH-BSO",
      obstetricProfile: "Adenocarcinoma arising from the endometrial glandular lining, commonly associated with hyperestrogenism.",
      pathophysiologyMechanism: "Unopposed estrogen drives endometrial hyperplasia progressing to endometrioid adenocarcinoma (Type I).",
      clinicalHallmarks: "Any postmenopausal bleeding requires transvaginal ultrasound (stripe >4 mm) and Pipelle biopsy; treated with TAH-BSO.",
      highYieldPearls: "Postmenopausal bleeding requires endometrial sampling; Lynch syndrome increases lifetime risk of endometrial cancer to ~40-60%."
    },
    {
      id: "obg-onc-ovarian-hgsc-brca",
      name: "Ovarian High-Grade Serous HGSC (Fallopian Fimbriae, BRCA Mutations & Cytoreduction)",
      category: "Ovarian Malignancy",
      subType: "BRCA1/2 Mutations • Fallopian Tube STIC Precursor • CA-125 • Cytoreductive Debulking + Carboplatin",
      obstetricProfile: "Aggressive pelvic epithelial carcinoma originating from the fimbriated ends of the fallopian tubes.",
      pathophysiologyMechanism: "Loss of homologous recombination DNA repair in BRCA1/2-mutated cells with pervasive TP53 mutations.",
      clinicalHallmarks: "Vague bloating, early satiety, pelvic mass with ascites; primary cytoreductive debulking (<1 cm residual) is critical.",
      highYieldPearls: "High-grade serous ovarian cancer originates in fallopian tube fimbriae and is associated with BRCA mutations and CA-125."
    },
    {
      id: "obg-onc-parp-olaparib",
      name: "PARP Inhibitor Targeted Therapy (Olaparib Homologous Recombination Synthetic Lethality)",
      category: "Targeted Oncology",
      subType: "Olaparib / Niraparib • Poly(ADP-Ribose) Polymerase Blockade • Synthetic Lethality in BRCA-Deficient Tumors",
      obstetricProfile: "Precision targeted oncology exploiting DNA damage repair deficiencies in homologous recombination-deficient tumors.",
      pathophysiologyMechanism: "PARP inhibition prevents single-strand break repair; in BRCA-deficient cells, double-strand breaks accumulate, causing cell death.",
      clinicalHallmarks: "Maintenance therapy in platinum-sensitive advanced ovarian cancer with germline or somatic BRCA1/2 mutations.",
      highYieldPearls: "PARP inhibitors (Olaparib) induce synthetic lethality in BRCA-mutated tumors with homologous recombination deficiency."
    }
  ]
};

interface ClinicalObgynAdvLabViewerProps {
  initialMode?: ObgynLabMode;
  height?: string;
  onNodeSelect?: (node: ObgynLabNode) => void;
}

export default function ClinicalObgynAdvLabViewer({
  initialMode = "preeclampsia",
  height = "560px",
  onNodeSelect,
}: ClinicalObgynAdvLabViewerProps) {
  const [activeMode, setActiveMode] = useState<ObgynLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // PPH Profiler State
  const [selectedPph, setSelectedPph] = useState<"tone" | "trauma" | "tissue" | "thrombin">("tone");

  // EFM Profiler State
  const [selectedEfm, setSelectedEfm] = useState<"cat1" | "var" | "late" | "sinus">("late");

  const pphDetails = useMemo(() => {
    if (selectedPph === "tone") {
      return {
        title: "PPH Etiology 1: Uterine Atony (70% of Cases)",
        indices: "Soft, Boggy Uterus • Cumulative Blood Loss >=1,000 mL • Oxytocin First-Line",
        rx: "Bimanual Uterine Massage + IV Oxytocin -> Methergine (avoid in HTN) -> Carboprost (avoid in asthma) -> Misoprostol + TXA",
        pearl: "Uterine atony is the most common cause of PPH (~70%); check maternal BP before Methergine and asthma before Carboprost."
      };
    } else if (selectedPph === "trauma") {
      return {
        title: "PPH Etiology 2: Obstetric Trauma (20% of Cases)",
        indices: "Firm, Well-Contracted Uterus • Continuous Bright Red Vaginal Bleeding • Lacerations / Rupture",
        rx: "Surgical exposure in stirrups with good lighting; systematic layered repair of cervical and vaginal lacerations",
        pearl: "A firm, contracted uterus with brisk ongoing bleeding indicates genital tract trauma until proven otherwise."
      };
    } else if (selectedPph === "tissue") {
      return {
        title: "PPH Etiology 3: Retained Placental Tissue (10% of Cases)",
        indices: "Missing Placental Cotyledons • Placenta Accreta Spectrum • Persistent Vaginal Bleeding",
        rx: "Manual uterine exploration under anesthesia; ultrasound-guided curettage; prepare for cesarean hysterectomy in accreta",
        pearl: "Placenta accreta spectrum requires multidisciplinary planning and often peripartum hysterectomy."
      };
    } else {
      return {
        title: "PPH Etiology 4: Coagulopathy / Thrombin (1% of Cases)",
        indices: "DIC • Amniotic Fluid Embolism • Severe HELLP • Oozing from IV Puncture Sites",
        rx: "Activate Massive Transfusion Protocol (1:1:1 PRBC:FFP:Platelets); IV Tranexamic Acid (1 g); Cryoprecipitate for fibrinogen",
        pearl: "Maintain fibrinogen >200 mg/dL during severe obstetric hemorrhage using cryoprecipitate."
      };
    }
  }, [selectedPph]);

  const efmDetails = useMemo(() => {
    if (selectedEfm === "cat1") {
      return {
        title: "NICHD Category I: Normal Reassuring Tracing",
        indices: "Baseline 110-160 bpm • Moderate Variability (6-25 bpm) • Absent Late/Variable Decelerations",
        rx: "Continue routine intrapartum monitoring; strongly predictive of normal umbilical cord pH (>=7.20)",
        pearl: "Category I tracings rule out intrapartum fetal metabolic acidemia at the time of observation."
      };
    } else if (selectedEfm === "var") {
      return {
        title: "Variable Decelerations: Umbilical Cord Compression",
        indices: "Abrupt FHR Drop (<30s to nadir) • Depth >=15 bpm for >=15s • Baroreceptor Vagal Reflex",
        rx: "Maternal position change to left or right lateral position; maternal oxygen; consider amnioinfusion for recurrent decels",
        pearl: "Variable decelerations are caused by cord compression; maternal repositioning is the initial intervention."
      };
    } else if (selectedEfm === "late") {
      return {
        title: "Late Decelerations: Uteroplacental Insufficiency",
        indices: "Gradual FHR Drop (>=30s) • Nadir Occurs AFTER Contraction Peak • Fetal Hypoxia Chemoreceptors",
        rx: "Intrauterine Resuscitation: Discontinue Oxytocin, administer 1 L IV fluid bolus, 10 L O2 by mask, maternal left lateral position",
        pearl: "Recurrent late decelerations with absent baseline variability define Category III and mandate emergency delivery."
      };
    } else {
      return {
        title: "Sinusoidal Fetal Heart Rate Pattern (Severe Fetal Anemia)",
        indices: "Smooth Sine Wave Baseline (3-5 cycles/min, 5-15 bpm amplitude) • Severe Acidemia / Fetal Anemia",
        rx: "Immediate preparation for Emergency Cesarean Delivery and neonatal resuscitation with O-negative blood",
        pearl: "A true sinusoidal pattern is pathognomonic for severe fetal anemia (feto-maternal hemorrhage, Rh isoimmunization)."
      };
    }
  }, [selectedEfm]);

  const currentNodes = useMemo(() => {
    return OBGYN_LAB_NODES[activeMode] || OBGYN_LAB_NODES.preeclampsia;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: ObgynLabNode) => {
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
            <HeartPulse size={14} /> OBG-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "preeclampsia" && "Hypertensive Disorders of Pregnancy: Preeclampsia, HELLP & Magnesium Protocols"}
            {activeMode === "pph" && "Postpartum Hemorrhage (PPH): The 4 'T's & Uterotonic Stepwise Escalation"}
            {activeMode === "efm" && "Electronic Fetal Monitoring (EFM): NICHD Categories I-III & Deceleration Triage"}
            {activeMode === "gynOnc" && "Gynecologic Oncology: Cervical (HPV), Endometrial (Lynch) & Ovarian (BRCA) Malignancies"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Obgyn Diagnostic Quiz"}
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
                <div className="text-xs font-bold text-fuchsia-300 uppercase tracking-wider">
                  Obstetrics &amp; Gynecology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Clinical Entity / Protocol: {quizTargetNode.clinicalHallmarks}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-fuchsia-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-fuchsia-950 text-xs rounded border border-fuchsia-700 text-fuchsia-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: Preeclampsia & Eclampsia */}
          {activeMode === "preeclampsia" && (
            <div className={styles.obgCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Preeclampsia, HELLP &amp; Eclampsia Protocols
                </span>
                <span className="text-[11px] text-slate-400">Severe Features &bull; HELLP &bull; Magnesium Sulfate (4-6g load) &bull; Antidote</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-fuchsia-300 font-bold">Magnesium Sulfate (MgSO4) Protocols</div>
                  <div className="text-slate-300 mt-1">Loading dose 4-6 g IV over 15-20 min followed by 1-2 g/h continuous IV infusion. Monitor deep tendon reflexes, respiratory rate (&ge;12/min), and hourly urine output (&ge;30 mL/h). Calcium Gluconate (1 g IV of 10% solution over 3-5 min) is the immediate antidote for magnesium toxicity (loss of DTRs, respiratory arrest).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-fuchsia-300 font-bold">HELLP Syndrome &amp; Antihypertensive Therapy</div>
                  <div className="text-slate-300 mt-1">HELLP (Hemolysis with schistocytes/LDH &gt;600, Elevated Liver enzymes AST/ALT &gt;2x, Low Platelets &lt;100k) mandates delivery regardless of gestational age. Acute severe hypertension (BP &ge;160/110) is managed with IV Labetalol (20-80 mg), IV Hydralazine (5-10 mg), or Oral Nifedipine (10-20 mg).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Postpartum Hemorrhage */}
          {activeMode === "pph" && (
            <div className={styles.obgCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplet size={14} /> Postpartum Hemorrhage: The 4 'T's &amp; Uterotonic Escalation
                </span>
                <span className="text-[11px] text-slate-400">Tone (70%) &bull; Trauma (20%) &bull; Tissue (10%) &bull; Thrombin (1%)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedPph("tone")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedPph === "tone"
                      ? "bg-fuchsia-600 text-white border-fuchsia-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💧 1. Tone (Atony 70%)
                </button>
                <button
                  onClick={() => setSelectedPph("trauma")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedPph === "trauma"
                      ? "bg-fuchsia-600 text-white border-fuchsia-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ✂️ 2. Trauma (20%)
                </button>
                <button
                  onClick={() => setSelectedPph("tissue")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedPph === "tissue"
                      ? "bg-fuchsia-600 text-white border-fuchsia-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🧱 3. Tissue (10%)
                </button>
                <button
                  onClick={() => setSelectedPph("thrombin")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedPph === "thrombin"
                      ? "bg-fuchsia-600 text-white border-fuchsia-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🩸 4. Thrombin (1%)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-fuchsia-300">{pphDetails.title}</div>
                <div className="text-pink-400 font-bold mt-1">{pphDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-fuchsia-400">Management:</strong> {pphDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Safety Rule:</strong> {pphDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 3: Electronic Fetal Monitoring */}
          {activeMode === "efm" && (
            <div className={styles.obgCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp size={14} /> Electronic Fetal Monitoring (EFM) &amp; Deceleration Analysis
                </span>
                <span className="text-[11px] text-slate-400">Category I &bull; Variable (Cord) &bull; Late (Placenta) &bull; Sinusoidal</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedEfm("cat1")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedEfm === "cat1"
                      ? "bg-fuchsia-600 text-white border-fuchsia-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🟢 Category I (Normal)
                </button>
                <button
                  onClick={() => setSelectedEfm("var")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedEfm === "var"
                      ? "bg-fuchsia-600 text-white border-fuchsia-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  📉 Variable (Cord)
                </button>
                <button
                  onClick={() => setSelectedEfm("late")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedEfm === "late"
                      ? "bg-fuchsia-600 text-white border-fuchsia-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚠️ Late (Placenta)
                </button>
                <button
                  onClick={() => setSelectedEfm("sinus")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedEfm === "sinus"
                      ? "bg-fuchsia-600 text-white border-fuchsia-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🚨 Sinusoidal (Anemia)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-fuchsia-300">{efmDetails.title}</div>
                <div className="text-pink-400 font-bold mt-1">{efmDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-fuchsia-400">Action:</strong> {efmDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">EFM Pearl:</strong> {efmDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 4: Gynecologic Oncology */}
          {activeMode === "gynOnc" && (
            <div className={styles.obgCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Gynecologic Oncology: Cervical, Endometrial &amp; Ovarian Malignancies
                </span>
                <span className="text-[11px] text-slate-400">Cervical (HPV 16/18) &bull; Endometrial (Lynch) &bull; Ovarian (BRCA/CA-125)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-fuchsia-300 font-bold">Cervical &amp; Endometrial Carcinoma</div>
                  <div className="text-slate-300 mt-1">Cervical cancer is driven by HPV 16/18 oncoproteins E6 (p53 inactivation) and E7 (pRb inactivation); locally advanced disease receives definitive Cisplatin chemoradiation. Endometrial cancer presents with postmenopausal bleeding (endometrial stripe &gt;4 mm on US) requiring Pipelle biopsy; associated with Lynch syndrome and obesity.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-fuchsia-300 font-bold">Ovarian Cancer Cytoreduction &amp; PARP Inhibitors</div>
                  <div className="text-slate-300 mt-1">High-grade serous ovarian cancer arises from fallopian tube fimbriae (BRCA1/2 mutations and CA-125 elevation). Management requires maximal cytoreductive debulking surgery (optimal &lt;1 cm residual) followed by Carboplatin + Paclitaxel, with PARP inhibitors (Olaparib) providing synthetic lethality in BRCA-mutated tumors.</div>
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
                    <span className="text-fuchsia-400 font-bold">Obgyn:</span> {node.obstetricProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect obstetric protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Clinical Obgyn Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider">
              Obgyn Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🤰 Clinical Entity / Syndrome</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Pathophysiology &amp; Biomarkers</div>
            <div className="text-xs text-fuchsia-300 font-semibold">{activeNode.obstetricProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiologyMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Diagnostics</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Obgyn Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("preeclampsia")}
          className={`${styles.modeTab} ${activeMode === "preeclampsia" ? styles.modeTabActive : ""}`}
        >
          ⚡ 1. Preeclampsia &amp; MgSO4
        </button>
        <button
          onClick={() => setActiveMode("pph")}
          className={`${styles.modeTab} ${activeMode === "pph" ? styles.modeTabActive : ""}`}
        >
          🩸 2. PPH &amp; Uterotonics
        </button>
        <button
          onClick={() => setActiveMode("efm")}
          className={`${styles.modeTab} ${activeMode === "efm" ? styles.modeTabActive : ""}`}
        >
          📉 3. EFM &amp; Decelerations
        </button>
        <button
          onClick={() => setActiveMode("gynOnc")}
          className={`${styles.modeTab} ${activeMode === "gynOnc" ? styles.modeTabActive : ""}`}
        >
          🛡️ 4. Gynecologic Oncology
        </button>
      </div>
    </div>
  );
}
