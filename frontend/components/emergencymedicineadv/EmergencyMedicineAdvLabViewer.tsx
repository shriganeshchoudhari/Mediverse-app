"use client";

import React, { useState, useMemo } from "react";
import styles from "./EmergencyMedicineAdvLabViewer.module.css";
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

export type EmergencyLabMode = "acls" | "shock" | "toxicology" | "trauma";

export interface EmergencyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  pathophysiologyProfile: string;
  pathophysiology: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const EMERGENCY_LAB_NODES: Record<EmergencyLabMode, EmergencyLabNode[]> = {
  acls: [
    {
      id: "em-acls-vf-pvt",
      name: "Ventricular Fibrillation & Pulseless VT (Defibrillation & Amiodarone)",
      category: "Shockable Arrest",
      subType: "Shockable Rhythm • 120-200J Biphasic Defibrillation • Epinephrine 1mg • Amiodarone 300mg/150mg or Lidocaine",
      pathophysiologyProfile: "Chaotic ventricular depolarization without organized myocardial contraction producing zero cardiac output.",
      pathophysiology: "Immediate electrical unsynchronized shock depolarizes myocardium simultaneously, permitting SA node to resume pacemaker capture.",
      clinicalHallmarks: "Unresponsive, apnoeic, pulseless; ECG shows chaotic fibrillatory waves; Shock -> CPR 2 min -> Epi -> Shock -> Amiodarone.",
      highYieldPearls: "Deliver unsynchronized high-energy defibrillation immediately for VF/pVT; resume CPR immediately after shock without pausing for pulse check."
    },
    {
      id: "em-acls-asystole-pea",
      name: "Asystole & Pulseless Electrical Activity (Epinephrine & H's/T's)",
      category: "Non-Shockable Arrest",
      subType: "Non-Shockable Rhythm • NO DEFIBRILLATION! • Immediate Epinephrine 1mg IV • Aggressive Reversible Causes (5 H's & 5 T's)",
      pathophysiologyProfile: "Total absence of electrical activity (asystole) or electrical rhythm without mechanical contraction (PEA).",
      pathophysiology: "Defibrillation is ineffective and harmful in asystole/PEA; survival depends on rapid identification of reversible H's and T's.",
      clinicalHallmarks: "Flatline or organized ECG complex with absent central pulse; Epinephrine 1mg IV ASAP; search for hypoxia, hypovolemia, tension PTX, tamponade.",
      highYieldPearls: "NEVER defibrillate asystole or PEA; administer Epinephrine 1 mg IV immediately and systematically rule out the 5 H's and 5 T's."
    },
    {
      id: "em-acls-ttm-neuroprotection",
      name: "Post-Cardiac Arrest Targeted Temperature Management (TTM)",
      category: "Post-ROSC Care",
      subType: "ROSC Achieved • Targeted Temperature Management (32-36C for 24h) • MAP >= 65 mmHg • Avoid Hyperoxia • Emergent PCI",
      pathophysiologyProfile: "Post-cardiac arrest syndrome with global cerebral ischemia, reperfusion free-radical injury, and neuroinflammation.",
      pathophysiology: "Mild hypothermia reduces cerebral metabolic rate of oxygen consumption (CMRO2) by 6-8% per 1C drop, mitigating neuronal apoptosis.",
      clinicalHallmarks: "Comatose patient after ROSC; cooling catheter/pads maintain 32-36C for >=24h; maintain MAP >=65 mmHg, normocarbia (PaCO2 35-45).",
      highYieldPearls: "Targeted Temperature Management (32-36C for >=24 hours) improves neurological recovery in comatose patients after out-of-hospital cardiac arrest."
    }
  ],

  shock: [
    {
      id: "em-shk-septic-vasoplegia",
      name: "Distributive Septic Shock (Vasoplegia & 1-Hour Sepsis Bundle)",
      category: "Distributive Shock",
      subType: "Cytokine-Mediated Vasoplegia • Low SVR • High Early CO • 30 mL/kg Crystalloids • First-Line Norepinephrine",
      pathophysiologyProfile: "Proinflammatory cytokines (TNF-alpha, IL-1, NO) trigger widespread arteriolar and venous vasodilation.",
      pathophysiology: "Profound decrease in systemic vascular resistance leads to relative hypovolemia and impaired cellular oxygen utilization.",
      clinicalHallmarks: "Fever, tachycardia, warm flushed skin, bounding pulses, hypotension (MAP <65), lactate >2 mmol/L; 30 mL/kg Lactated Ringer's + Norepinephrine.",
      highYieldPearls: "Septic shock is characterized by LOW SVR with warm extremities; first-line resuscitation is 30 mL/kg crystalloids + Norepinephrine."
    },
    {
      id: "em-shk-cardiogenic-pump",
      name: "Cardiogenic Pump Failure Shock (Elevated PCWP & Low CO)",
      category: "Cardiogenic Shock",
      subType: "Myocardial Infarction (>40% LV Loss) • Elevated PCWP & CVP • Low Cardiac Index (<2.2) • Compensatory High SVR",
      pathophysiologyProfile: "Primary failure of ventricular pump function reducing forward stroke volume and cardiac index.",
      pathophysiology: "Retrograde hydrostatic congestion produces pulmonary edema and high PCWP, while compensatory vasoconstriction raises SVR.",
      clinicalHallmarks: "Hypotension, cold clammy extremities, bibasilar lung crackles, JVD, elevated troponin/ECG STEMI; Inotropes (Dobutamine) / IABP / Impella / PCI.",
      highYieldPearls: "Cardiogenic shock has LOW Cardiac Output with ELEVATED PCWP/CVP (distinguishes from hypovolemic shock where PCWP is low)."
    },
    {
      id: "em-shk-hypovolemic-hemorrhage",
      name: "Hypovolemic Hemorrhagic Shock (Decreased Preload & High SVR)",
      category: "Hypovolemic Shock",
      subType: "Acute Blood Loss / Dehydration • Low Preload (Low PCWP & CVP) • Low CO • Compensatory High SVR • 1:1:1 Transfusion",
      pathophysiologyProfile: "Critical reduction in circulating intravascular blood volume reducing venous return and end-diastolic filling.",
      pathophysiology: "Sympathetic baroreceptor activation releases catecholamines, driving intense peripheral vasoconstriction and tachycardia.",
      clinicalHallmarks: "Hypotension, tachycardia, flat neck veins, cool pale extremities, narrow pulse pressure; stop bleeding + 1:1:1 MTP blood products.",
      highYieldPearls: "Hypovolemic shock presents with LOW PCWP, LOW CVP, and HIGH SVR; manage with immediate source control and balanced 1:1:1 transfusion."
    },
    {
      id: "em-shk-obstructive-pe-tamponade",
      name: "Obstructive Shock (Extracardiac Vascular Compression)",
      category: "Obstructive Shock",
      subType: "Massive PE • Cardiac Tamponade • Tension PTX • High CVP • Low CO • High SVR • Urgent Mechanical Relief",
      pathophysiologyProfile: "Physical obstruction to great vessel blood flow or cardiac chamber filling.",
      pathophysiology: "Extracardiac compression elevates right atrial/venous pressure while preventing forward flow to left ventricle.",
      clinicalHallmarks: "Hypotension with distended neck veins (high CVP); Tamponade (Beck triad -> Pericardiocentesis); Tension PTX (Needle thoracostomy); PE (tPA).",
      highYieldPearls: "Obstructive shock features HIGH CVP with JVD but low forward cardiac output; treatment requires immediate mechanical decompression."
    }
  ],

  toxicology: [
    {
      id: "em-tox-anticholinergic-physostigmine",
      name: "Anticholinergic Toxidrome (Mydriasis, Anhidrosis & Physostigmine)",
      category: "Toxidrome Matrix",
      subType: "Atropine / Antihistamines / TCAs • Mydriasis • Dry Flushed Skin • Hyperthermia • Delirium • Physostigmine",
      pathophysiologyProfile: "Competitive blockade of muscarinic acetylcholine receptors across central and peripheral nervous systems.",
      pathophysiology: "Loss of parasympathetic tone causes tachycardia, anhidrosis (inability to sweat), pupillary dilation, and central anticholinergic delirium.",
      clinicalHallmarks: "'Blind as a bat, mad as a hatter, red as a beet, hot as a hare, dry as a bone, full as a flask'; Physostigmine (AChE inhibitor).",
      highYieldPearls: "Anticholinergic toxidrome has DRY skin (anhidrosis); Sympathomimetic toxidrome has SWEATY skin (diaphoresis)!"
    },
    {
      id: "em-tox-cholinergic-organophosphate",
      name: "Cholinergic Poisoning (Organophosphates SLUDGE & Atropine + 2-PAM)",
      category: "Toxidrome Matrix",
      subType: "Organophosphates / Nerve Agents • Irreversible AChE Inhibition • Pinpoint Miosis • Profuse SLUDGE • Atropine + Pralidoxime",
      pathophysiologyProfile: "Phosphorylation and inactivation of acetylcholinesterase, leading to massive synaptic acetylcholine accumulation.",
      pathophysiology: "Excessive stimulation of muscarinic and nicotinic receptors causes profuse secretions, bronchoconstriction, and flaccid muscle paralysis.",
      clinicalHallmarks: "SLUDGE (Salivation, Lacrimation, Urination, Defecation, GI cramping, Emesis) + Killer B's (Bradycardia, Bronchorrhea, Bronchospasm); Atropine + 2-PAM.",
      highYieldPearls: "Treat organophosphate poisoning with Atropine (reverses life-threatening bronchorrhea) AND Pralidoxime (2-PAM, reactivates AChE enzyme)."
    },
    {
      id: "em-tox-opioid-naloxone",
      name: "Opioid Respiratory Depression (Pinpoint Pupils & Naloxone)",
      category: "Toxidrome Matrix",
      subType: "Heroin / Fentanyl / Morphine • Mu-Opioid Receptor Agonism • Pinpoint Miosis • Bradypnea (RR <8) • Coma • Naloxone",
      pathophysiologyProfile: "Excessive activation of mu-opioid receptors in the brainstem medullary respiratory centers.",
      pathophysiology: "Blunts hypercapnic and hypoxic ventilatory drive, producing hypoventilation, respiratory acidosis, coma, and fatal hypoxia.",
      clinicalHallmarks: "Unresponsive patient, pinpoint miotic pupils, respiratory rate <8/min, cyanosis, track marks; IV/IN Naloxone titrated to restore spontaneous ventilation.",
      highYieldPearls: "The classic Opioid Triad is CNS Depression, Pinpoint Miosis, and Respiratory Depression; treat with titrated Naloxone."
    },
    {
      id: "em-tox-tca-bicarb",
      name: "Tricyclic Antidepressant Overdose (Wide QRS & Sodium Bicarbonate)",
      category: "Cardiotoxicity",
      subType: "Amitriptyline • Fast Cardiac Na+ Channel Blockade • Wide QRS (>100ms) • Terminal R in aVR • IV Sodium Bicarbonate",
      pathophysiologyProfile: "Inhibition of phase 0 rapid sodium influx in ventricular myocardial cells prolonging intraventricular conduction.",
      pathophysiology: "Widened QRS interval predisposes to monomorphic ventricular tachycardia, torsades de pointes, and refractory hypotension.",
      clinicalHallmarks: "Anticholinergic signs + QRS prolongation (>100ms risk of seizure, >160ms risk of arrhythmia) + R wave >3mm in aVR; IV NaHCO3.",
      highYieldPearls: "Administer IV Sodium Bicarbonate (NaHCO3) for TCA overdose with QRS >100 ms to overcome sodium channel blockade and alkalinize serum pH to 7.50-7.55."
    }
  ],

  trauma: [
    {
      id: "em-trm-tension-ptx",
      name: "Tension Pneumothorax (Needle Thoracostomy & Chest Tube)",
      category: "ATLS Life Threat",
      subType: "One-Way Air Valve • Contralateral Tracheal Shift • Absent Breath Sounds • Hypotension • Immediate 5th ICS Needle Thoracostomy",
      pathophysiologyProfile: "Parenchymal or chest wall laceration acting as a one-way flutter valve, accumulating intrapleural air under positive pressure.",
      pathophysiology: "High intrathoracic pressure collapses the ipsilateral lung, shifts the mediastinum, and kinks the IVC/SVC, causing obstructive shock.",
      clinicalHallmarks: "Severe dyspnea, hypotension, JVD, hyperresonance, absent unilateral breath sounds, contralateral tracheal deviation; DO NOT WAIT FOR CXR; Needle thoracostomy.",
      highYieldPearls: "Tension pneumothorax is a CLINICAL diagnosis; perform emergent needle decompression (5th ICS anterior axillary line) before obtaining chest X-ray!"
    },
    {
      id: "em-trm-cardiac-tamponade",
      name: "Acute Cardiac Tamponade (Beck Triad & Pericardiocentesis)",
      category: "ATLS Life Threat",
      subType: "Pericardial Hemorrhage • Beck Triad (Hypotension, JVD, Muffled Heart Sounds) • Pulsus Paradoxus • Pericardiocentesis",
      pathophysiologyProfile: "Rapid accumulation of blood in the non-compliant pericardial space compressing the cardiac chambers.",
      pathophysiology: "Equalization of diastolic pressures prevents ventricular filling, producing a severe drop in stroke volume and cardiac output.",
      clinicalHallmarks: "Hypotension, distended neck veins, muffled heart sounds (Beck Triad); Pulsus Paradoxus (>10 mmHg inspiratory SBP drop); Subxiphoid Pericardiocentesis.",
      highYieldPearls: "Beck's Triad (Hypotension + Distended Neck Veins + Muffled Heart Sounds) + Pulsus Paradoxus = Cardiac Tamponade; emergent Pericardiocentesis."
    },
    {
      id: "em-trm-efast-ultrasound",
      name: "eFAST Sonographic Trauma Protocol (Peritoneal & Barcode Sign)",
      category: "Point-of-Care Ultrasound",
      subType: "6 Bedside Windows • RUQ Morison Pouch • LUQ Splenorenal • Pelvis • Subxiphoid Pericardial • Thoracic Absent Lung Sliding",
      pathophysiologyProfile: "Rapid acoustic impedance differential between hyperechoic fascial planes and anechoic (black) free fluid (hemoperitoneum/hemothorax).",
      pathophysiology: "High-frequency linear probe identifies loss of pleural sliding and 'barcode / stratosphere sign' on M-mode, confirming pneumothorax.",
      clinicalHallmarks: "Hypotensive trauma patient; anechoic fluid stripe in Morison's pouch confirms hemoperitoneum -> emergent exploratory laparotomy.",
      highYieldPearls: "A positive eFAST in an unstable hypotensive blunt trauma patient is an immediate indication for emergency Exploratory Laparotomy."
    },
    {
      id: "em-trm-mtp-txa",
      name: "Damage Control Resuscitation (1:1:1 MTP & Tranexamic Acid)",
      category: "Damage Control Resuscitation",
      subType: "Massive Transfusion Protocol • 1:1:1 Ratio (PRBC : FFP : Platelets) • Lethal Triad Prevention • Tranexamic Acid (TXA <3h)",
      pathophysiologyProfile: "Trauma-induced coagulopathy exacerbated by hypothermia, metabolic acidosis, and crystalloid hemodilution.",
      pathophysiology: "Balanced plasma-to-RBC transfusion preserves fibrinogen and clotting factor concentrations while TXA inhibits hyperfibrinolysis.",
      clinicalHallmarks: "Exsanguinating trauma shock; activate MTP (1 PRBC : 1 FFP : 1 Platelets); administer TXA 1g IV over 10 min within 3 hours of injury.",
      highYieldPearls: "Prevent the Lethal Triad of Trauma (Hypothermia, Acidosis, Coagulopathy) using 1:1:1 blood product ratios and early Tranexamic Acid (TXA)."
    }
  ]
};

interface EmergencyMedicineAdvLabViewerProps {
  initialMode?: EmergencyLabMode;
  height?: string;
  onNodeSelect?: (node: EmergencyLabNode) => void;
}

export default function EmergencyMedicineAdvLabViewer({
  initialMode = "acls",
  height = "560px",
  onNodeSelect,
}: EmergencyMedicineAdvLabViewerProps) {
  const [activeMode, setActiveMode] = useState<EmergencyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Shock Profiler State
  const [selectedShock, setSelectedShock] = useState<"septic" | "cardiogenic" | "hypovolemic" | "obstructive">("septic");

  // Toxidrome Profiler State
  const [selectedTox, setSelectedTox] = useState<"anticholinergic" | "cholinergic" | "opioid" | "tca">("anticholinergic");

  const shockDetails = useMemo(() => {
    if (selectedShock === "septic") {
      return {
        title: "Distributive Septic Shock",
        indices: "Low SVR (Vasoplegia) • High Early CO • Low/Normal PCWP • Warm Flushed Extremities",
        rx: "30 mL/kg Lactated Ringer's within 3h + First-line Norepinephrine (target MAP >= 65 mmHg) + IV Antibiotics",
        pearl: "Low SVR with warm extremities distinguishes septic shock from cardiogenic and hypovolemic shock."
      };
    } else if (selectedShock === "cardiogenic") {
      return {
        title: "Cardiogenic Pump Failure Shock",
        indices: "Low CO (CI <2.2) • High PCWP (>18 mmHg) • High CVP • Compensatory High SVR • Cold Clammy Extremities",
        rx: "Inotropes (Dobutamine/Milrinone) + Diuresis if MAP stable; Vasopressors + IABP/Impella + Emergency PCI",
        pearl: "High PCWP with low Cardiac Output confirms cardiogenic pump failure with pulmonary venous congestion."
      };
    } else if (selectedShock === "hypovolemic") {
      return {
        title: "Hypovolemic Hemorrhagic Shock",
        indices: "Low Preload (Low PCWP & CVP) • Low CO • High SVR • Flat Neck Veins • Cool Extremities",
        rx: "Immediate surgical source control + Balanced 1:1:1 Massive Transfusion Protocol (PRBC : FFP : Platelets)",
        pearl: "Low PCWP, low CVP, and high SVR = Hypovolemic shock; resuscitated with blood products, not crystalloids."
      };
    } else {
      return {
        title: "Obstructive Shock (PE / Tamponade / Tension)",
        indices: "High CVP (Distended JVD) • Low CO • High SVR • Extracardiac Obstruction to Forward Flow",
        rx: "Tension PTX -> Needle thoracostomy; Tamponade -> Pericardiocentesis; Massive PE -> Thrombolysis / Thrombectomy",
        pearl: "Obstructive shock presents with high CVP (JVD) and hypotension; requires immediate mechanical decompression."
      };
    }
  }, [selectedShock]);

  const toxDetails = useMemo(() => {
    if (selectedTox === "anticholinergic") {
      return {
        title: "Anticholinergic Toxidrome (Atropine, TCAs)",
        indices: "Mydriasis • Hyperthermia • DRY Flushed Skin (Anhidrosis) • Tachycardia • Delirium",
        rx: "Physostigmine (acetylcholinesterase inhibitor); supportive cooling; Benzodiazepines for agitation",
        pearl: "Anticholinergic toxidrome has DRY skin (anhidrosis); Sympathomimetic toxicity has SWEATY skin (diaphoresis)."
      };
    } else if (selectedTox === "cholinergic") {
      return {
        title: "Cholinergic Toxicity (Organophosphates)",
        indices: "Pinpoint Miosis • Bradycardia • Profuse SLUDGE / DUMBELS Secretions (Bronchorrhea, Diaphoresis)",
        rx: "Immediate IV Atropine (titrate until pulmonary secretions dry) + Pralidoxime (2-PAM reactivates AChE)",
        pearl: "Atropine reverses lethal muscarinic bronchorrhea; Pralidoxime (2-PAM) reverses nicotinic muscle weakness."
      };
    } else if (selectedTox === "opioid") {
      return {
        title: "Opioid Overdose (Heroin, Fentanyl)",
        indices: "Pinpoint Miosis • Severe Bradypnea (RR <8/min) • Hypoventilation • Coma • Hypothermia",
        rx: "Intravenous / Intranasal Naloxone titrated to restore spontaneous adequate ventilation (target RR >12)",
        pearl: "The classic Opioid Triad is Pinpoint Miosis, Respiratory Depression, and CNS Coma; treat with Naloxone."
      };
    } else {
      return {
        title: "Tricyclic Antidepressant Overdose (TCA)",
        indices: "Anticholinergic Features • Cardiac Na+ Blockade • Wide QRS (>100/160ms) • Terminal R in aVR",
        rx: "Intravenous Sodium Bicarbonate (NaHCO3) boluses to overcome Na+ blockade and achieve serum pH 7.50-7.55",
        pearl: "IV Sodium Bicarbonate is the definitive antidote for TCA-induced QRS widening and ventricular arrhythmias."
      };
    }
  }, [selectedTox]);

  const currentNodes = useMemo(() => {
    return EMERGENCY_LAB_NODES[activeMode] || EMERGENCY_LAB_NODES.acls;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: EmergencyLabNode) => {
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
            <Flame size={14} /> EM-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "acls" && "Advanced Cardiac Life Support (ACLS): Shockable vs Non-Shockable Arrest & ROSC"}
            {activeMode === "shock" && "Shock Classification (Hypovolemic, Cardiogenic, Distributive, Obstructive) & Sepsis"}
            {activeMode === "toxicology" && "Emergency Toxicology: Clinical Toxidromes (Cholinergic, Anticholinergic, Opioid) & Antidotes"}
            {activeMode === "trauma" && "Acute Trauma Resuscitation (ATLS), eFAST Sonography & Massive Transfusion (1:1:1)"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Emergency Medicine Quiz"}
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
                  Emergency Resuscitation Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Emergency Protocol / Resuscitation Step: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: ACLS Algorithms */}
          {activeMode === "acls" && (
            <div className={styles.emCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> ACLS Pulseless Cardiac Arrest Algorithm
                </span>
                <span className="text-[11px] text-slate-400">VF / pVT (Defib) vs Asystole / PEA (Epinephrine + H's/T's)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">Shockable (VF / Pulseless VT)</div>
                  <div className="text-slate-300 mt-1">Immediate High-Energy Defibrillation (120-200 J biphasic) -&gt; Resume CPR 2 min -&gt; Epinephrine 1 mg IV every 3-5 min after Shock 2 -&gt; Amiodarone 300 mg bolus after Shock 3 (150 mg second dose).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">Non-Shockable (Asystole / PEA)</div>
                  <div className="text-slate-300 mt-1">NO DEFIBRILLATION! High-quality CPR -&gt; Epinephrine 1 mg IV ASAP, then every 3-5 min -&gt; Aggressively identify and treat reversible causes (The 5 H's: Hypovolemia, Hypoxia, Hydrogen ion, Hypo/Hyperkalemia, Hypothermia; The 5 T's: Tension PTX, Tamponade, Toxins, Thrombosis PE, Thrombosis ACS).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Shock Profiler */}
          {activeMode === "shock" && (
            <div className={styles.emCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={14} /> Hemodynamic Shock Profiles &amp; Sepsis Resuscitation
                </span>
                <span className="text-[11px] text-slate-400">Septic &bull; Cardiogenic &bull; Hypovolemic &bull; Obstructive</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedShock("septic")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedShock === "septic"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🔥 Septic (Vasoplegia)
                </button>
                <button
                  onClick={() => setSelectedShock("cardiogenic")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedShock === "cardiogenic"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💔 Cardiogenic (High PCWP)
                </button>
                <button
                  onClick={() => setSelectedShock("hypovolemic")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedShock === "hypovolemic"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🩸 Hypovolemic (Low Preload)
                </button>
                <button
                  onClick={() => setSelectedShock("obstructive")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedShock === "obstructive"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚠️ Obstructive (High CVP)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-red-300">{shockDetails.title}</div>
                <div className="text-rose-400 font-bold mt-1">{shockDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-red-400">Resuscitation Protocol:</strong> {shockDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Hemodynamic Pearl:</strong> {shockDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 3: Toxicology & Toxidromes */}
          {activeMode === "toxicology" && (
            <div className={styles.emCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Master Toxidrome Differential &amp; Antidotes
                </span>
                <span className="text-[11px] text-slate-400">Anticholinergic &bull; Cholinergic &bull; Opioid &bull; TCA</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedTox("anticholinergic")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTox === "anticholinergic"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🏜️ Anticholinergic (Dry)
                </button>
                <button
                  onClick={() => setSelectedTox("cholinergic")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTox === "cholinergic"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💦 Cholinergic (SLUDGE)
                </button>
                <button
                  onClick={() => setSelectedTox("opioid")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTox === "opioid"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💤 Opioid (Pinpoint)
                </button>
                <button
                  onClick={() => setSelectedTox("tca")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedTox === "tca"
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚡ TCA (Wide QRS)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-red-300">{toxDetails.title}</div>
                <div className="text-rose-400 font-bold mt-1">{toxDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-red-400">Antidote &amp; Management:</strong> {toxDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Diagnostic Rule:</strong> {toxDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 4: Trauma & eFAST */}
          {activeMode === "trauma" && (
            <div className={styles.emCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> Acute Trauma Resuscitation, eFAST &amp; Damage Control
                </span>
                <span className="text-[11px] text-slate-400">Tension PTX &bull; Tamponade &bull; eFAST 6-Views &bull; 1:1:1 MTP</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">Tension Pneumothorax Decompression</div>
                  <div className="text-slate-300 mt-1">Severe dyspnea, hypotension, JVD, hyperresonance, absent breath sounds, contralateral tracheal shift -&gt; Immediate large-bore Needle Thoracostomy in 5th ICS anterior axillary line (or 2nd ICS MCL) followed by chest tube.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-red-300 font-bold">eFAST &amp; Damage Control Resuscitation</div>
                  <div className="text-slate-300 mt-1">6 ultrasound windows (RUQ Morison, LUQ Splenorenal, Pelvis, Subxiphoid, Bilateral Pleural barcode sign for pneumothorax). Manage exsanguinating hemorrhage with balanced 1:1:1 blood products (PRBC:FFP:Plt) + Tranexamic Acid (TXA within 3h).</div>
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
                    <span className="text-red-400 font-bold">Pathophysiology:</span> {node.pathophysiologyProfile}
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

        {/* Right Side: High-Yield Emergency Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
              Emergency Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🚨 Resuscitation / Toxic Entity</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Hemodynamics &amp; Pathophysiology</div>
            <div className="text-xs text-red-300 font-semibold">{activeNode.pathophysiologyProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiology}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🩺 Clinical Hallmarks &amp; Diagnostics</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Resuscitation Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("acls")}
          className={`${styles.modeTab} ${activeMode === "acls" ? styles.modeTabActive : ""}`}
        >
          ⚡ 1. ACLS Protocols
        </button>
        <button
          onClick={() => setActiveMode("shock")}
          className={`${styles.modeTab} ${activeMode === "shock" ? styles.modeTabActive : ""}`}
        >
          🩸 2. Shock &amp; Sepsis
        </button>
        <button
          onClick={() => setActiveMode("toxicology")}
          className={`${styles.modeTab} ${activeMode === "toxicology" ? styles.modeTabActive : ""}`}
        >
          🧪 3. Toxicology
        </button>
        <button
          onClick={() => setActiveMode("trauma")}
          className={`${styles.modeTab} ${activeMode === "trauma" ? styles.modeTabActive : ""}`}
        >
          🚑 4. Trauma &amp; eFAST
        </button>
      </div>
    </div>
  );
}
