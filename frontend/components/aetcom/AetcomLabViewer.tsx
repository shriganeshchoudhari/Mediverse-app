"use client";

import React, { useState, useMemo } from "react";
import styles from "./AetcomLabViewer.module.css";
import {
  Activity,
  Heart,
  Shield,
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
  Scale,
  MessageSquare,
  FileText,
  UserCheck,
  PhoneCall,
  Volume2,
} from "lucide-react";

export type AetcomLabMode = "fourPrinciples" | "spikes" | "confidentiality" | "endOfLife";

export interface AetcomLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  clinicalProtocol: string;
  diagnosticCriteria: string;
  emergencyAction: string;
  highYieldPearl: string;
}

export const AETCOM_NODES: Record<AetcomLabMode, AetcomLabNode[]> = {
  fourPrinciples: [
    {
      id: "bioethics-autonomy-consent-curb",
      name: "1. Autonomy, Informed Consent & Decision-Making Capacity (CURB)",
      category: "Cardinal Bioethics",
      subType: "Autonomy • Informed Refusal • CURB Capacity Checklist • Living Will",
      clinicalProtocol: "Honor patient self-determination. Assess CURB capacity: Communicate choice, Understand facts, Reason options, Believe/Appreciate consequences.",
      diagnosticCriteria: "A competent adult has the absolute right to refuse any medical treatment (even life-saving blood in adult Jehovah's Witnesses).",
      emergencyAction: "When incapacitated with no advance directive: Follow Healthcare Proxy Substituted Judgment -> Statutory Next of Kin (Spouse -> Children -> Parents).",
      highYieldPearl: "Capacity is a clinical, decision-specific determination made by any licensed physician; Competence is a legal determination made exclusively by a judge."
    },
    {
      id: "beneficence-nonmaleficence-justice",
      name: "2. Beneficence, Non-Maleficence & Distributive Justice",
      category: "Ethical Principles",
      subType: "Primum Non Nocere • Best Interest Standard • Distributive Justice • Triage",
      clinicalProtocol: "Balance therapeutic benefit against harm. Distributive justice mandates fair, non-discriminatory allocation of scarce medical resources.",
      diagnosticCriteria: "Beneficence: Active duty to promote health. Non-maleficence: Obligation not to inflict harm. Justice: Organ allocation based on medical urgency, not wealth.",
      emergencyAction: "In mass casualty or pandemic triage, allocate resources based on objective physiological survival benefit rather than first-come-first-served.",
      highYieldPearl: "Beneficence does not justify paternalism; a physician cannot override a competent patient's informed refusal under the pretext of doing good."
    }
  ],

  spikes: [
    {
      id: "spikes-six-step-protocol",
      name: "1. The SPIKES 6-Step Protocol for Delivering Bad News",
      category: "Clinical Communication",
      subType: "Setting • Perception • Invitation • Knowledge (Warning Shot) • Empathy (NURSE) • Strategy",
      clinicalProtocol: "Step 1: Setting (privacy, seated). Step 2: Perception (ask what they know). Step 3: Invitation (ask how much detail). Step 4: Knowledge (warning shot + plain language). Step 5: Empathy. Step 6: Strategy & Teach-Back.",
      diagnosticCriteria: "Warning shot: 'Unfortunately, I have some difficult news to share...' followed by pauses and small digestible chunks without jargon.",
      emergencyAction: "Always address emotional reactions (tears/anger) with empathetic statements before attempting to explain treatment roadmaps.",
      highYieldPearl: "Always fire a warning shot before disclosing severe bad news, and use plain language rather than medical jargon to ensure full patient comprehension."
    },
    {
      id: "nurse-empathy-family-collusion",
      name: "2. The NURSE Empathy Framework & Family Non-Disclosure",
      category: "Empathy & Difficult Scenarios",
      subType: "Name • Understand • Respect • Support • Explore • Managing Collusion",
      clinicalProtocol: "N: Name emotion. U: Understand/validate. R: Respect strength. S: Support. E: Explore fears. In family collusion: Explore fears, then ask patient directly in private.",
      diagnosticCriteria: "When family demands 'Do not tell the patient', acknowledge their protective intention, then ask the patient how they prefer to receive medical information.",
      emergencyAction: "If the patient requests full disclosure, provide it with compassion. If the patient requests non-disclosure, honor their autonomy.",
      highYieldPearl: "Never agree to a family's blanket demand to withhold a fatal diagnosis without first determining the patient's own preference for receiving information."
    }
  ],

  confidentiality: [
    {
      id: "confidentiality-tarasoff-exceptions",
      name: "1. Confidentiality Boundaries & Tarasoff Duty to Warn / Protect",
      category: "Medical Confidentiality",
      subType: "Doctor-Patient Privilege • Tarasoff Ruling • Mandatory Abuse Reporting",
      clinicalProtocol: "Maintain absolute confidentiality EXCEPT: 1. Tarasoff (imminent credible threat to identifiable victim), 2. Child/Elder abuse, 3. Notifiable infectious diseases.",
      diagnosticCriteria: "Tarasoff criteria: Patient communicates explicit, serious intent and means to kill/harm an identifiable individual.",
      emergencyAction: "Immediate Tarasoff breach: 1. Notify law enforcement, 2. Warn the intended victim directly, 3. Initiate emergency psychiatric hold.",
      highYieldPearl: "Under the Tarasoff ruling, the duty to protect an identifiable third party from imminent, serious physical violence supersedes doctor-patient confidentiality."
    },
    {
      id: "medical-malpractice-four-ds",
      name: "2. Medical Negligence (The 4 Ds) & Res Ipsa Loquitur",
      category: "Medico-Legal Principles",
      subType: "Duty • Dereliction (Breach) • Direct Causation • Damages • Res Ipsa Loquitur",
      clinicalProtocol: "Establish civil liability: 1. Duty of care (relationship), 2. Dereliction (breach of standard), 3. Direct causation (proximate cause), 4. Damages (actual harm).",
      diagnosticCriteria: "Res Ipsa Loquitur ('The thing speaks for itself'): Exclusive control by physician + obvious negligence (retained surgical sponge / wrong-site surgery).",
      emergencyAction: "In medical error: Disclose error promptly to patient/family, express regret/apology, explain corrective actions, and document objectively in chart.",
      highYieldPearl: "In Res Ipsa Loquitur, negligence is so self-evident (such as a retained surgical sponge) that the legal burden of proof shifts to the physician to prove lack of negligence."
    }
  ],

  endOfLife: [
    {
      id: "doctrine-double-effect-palliative",
      name: "1. The Doctrine of Double Effect & Palliative Opioids",
      category: "End-of-Life Bioethics",
      subType: "Double Effect • DNR / AND • Palliative Sedation • Withholding vs Withdrawing",
      clinicalProtocol: "High-dose opioids for intractable pain/dyspnea in terminal illness are ethically justified even if life is foreseeably shortened, provided intent is purely pain relief.",
      diagnosticCriteria: "4 Criteria: Act is good (pain relief); Direct intent is purely analgesia; Bad effect is not the means; Grave proportionality exists.",
      emergencyAction: "Titrate morphine to pain and respiratory distress score. DNR applies strictly to CPR (chest compressions/defibrillation), NOT comfort care/antibiotics.",
      highYieldPearl: "The Doctrine of Double Effect permits administering escalating opioid doses for severe pain even if it risks respiratory depression, provided the sole intent is symptom relief."
    },
    {
      id: "brain-death-apnea-testing",
      name: "2. Brain Death Criteria, Apnea Testing & Organ Donation",
      category: "Neurological Determination of Death",
      subType: "Coma • Absent Brainstem Reflexes • Apnea Test (PaCO2 >=60 mmHg) • Deceased Donation",
      clinicalProtocol: "Prerequisites: Irreversible cause, temp >36C, SBP >=100, no sedatives/NMBAs. Test all reflexes (pupillary, corneal, doll's eyes, cold calorics, gag, cough).",
      diagnosticCriteria: "Positive Apnea Test: No respiratory effort for 8–10 min AND Arterial PaCO2 >= 60 mmHg (or >= 20 mmHg increase above baseline).",
      emergencyAction: "Once brain death is declared, the patient is legally dead. Maintain organ donor hemodynamics and contact Organ Procurement Organization (OPO).",
      highYieldPearl: "Brain death is the complete, irreversible cessation of all brain and brainstem function; declaring brain death requires coma, absent brainstem reflexes, and a positive apnea test."
    }
  ]
};

interface AetcomLabViewerProps {
  initialMode?: AetcomLabMode;
  height?: string;
  onNodeSelect?: (node: AetcomLabNode) => void;
}

export default function AetcomLabViewer({
  initialMode = "fourPrinciples",
  height = "560px",
  onNodeSelect,
}: AetcomLabViewerProps) {
  const [activeMode, setActiveMode] = useState<AetcomLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // CURB Capacity Evaluator State
  const [curbC, setCurbC] = useState<boolean>(true); // Communicate
  const [curbU, setCurbU] = useState<boolean>(true); // Understand
  const [curbR, setCurbR] = useState<boolean>(true); // Reason
  const [curbB, setCurbB] = useState<boolean>(true); // Believe/Appreciate

  // SPIKES Protocol Step Selector
  const [spikesStep, setSpikesStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(4);

  // Brain Death Apnea State
  const [paco2Level, setPaco2Level] = useState<number>(64); // mmHg
  const [respiratoryEffort, setRespiratoryEffort] = useState<boolean>(false);

  // Capacity Calculation
  const capacityStatus = useMemo(() => {
    const hasCapacity = curbC && curbU && curbR && curbB;
    return {
      hasCapacity,
      statusText: hasCapacity ? "PATIENT HAS DECISION-MAKING CAPACITY" : "CAPACITY IMPAIRED / LACKING",
      color: hasCapacity ? "text-emerald-400 font-extrabold" : "text-rose-400 font-extrabold",
      guidance: hasCapacity
        ? "Patient's autonomous choices (including informed refusal) must be honored."
        : "Invoke Advance Directives / Healthcare Proxy / Statutory Next of Kin."
    };
  }, [curbC, curbU, curbR, curbB]);

  // Brain Death Apnea Calculation
  const apneaStatus = useMemo(() => {
    if (!respiratoryEffort && paco2Level >= 60) {
      return {
        result: "POSITIVE APNEA TEST (Supports Brain Death)",
        color: "text-rose-400 font-extrabold",
        details: "No spontaneous respiration observed with PaCO2 >= 60 mmHg (and pH < 7.28)."
      };
    } else if (respiratoryEffort) {
      return {
        result: "NEGATIVE APNEA TEST (Spontaneous Breathing Present)",
        color: "text-emerald-400 font-bold",
        details: "Respiratory drive intact. Patient does NOT meet brain death criteria."
      };
    }
    return {
      result: "INCONCLUSIVE APNEA TEST (PaCO2 < 60 mmHg)",
      color: "text-amber-300 font-bold",
      details: "Continue passive oxygenation until PaCO2 reaches >= 60 mmHg or obtain ABG."
    };
  }, [paco2Level, respiratoryEffort]);

  const currentNodes = useMemo(() => {
    return AETCOM_NODES[activeMode] || AETCOM_NODES.fourPrinciples;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: AetcomLabNode) => {
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
            <Scale size={14} /> AETCOM-001
          </span>
          <span className={styles.titleText}>
            {activeMode === "fourPrinciples" && "The 4 Principles of Bioethics & Decision-Making Capacity (CURB)"}
            {activeMode === "spikes" && "The SPIKES Protocol for Delivering Bad News & NURSE Empathy Framework"}
            {activeMode === "confidentiality" && "Medical Confidentiality, Tarasoff Warning & The 4 Ds of Malpractice"}
            {activeMode === "endOfLife" && "End-of-Life Ethics, Doctrine of Double Effect & Brain Death Determination"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Ethics Quiz"}
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
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Medical Ethics Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Bioethical Protocol: {quizTargetNode.diagnosticCriteria}
                </div>
                {quizFeedback && (
                  <div className="text-xs text-amber-300 font-medium mt-1">{quizFeedback}</div>
                )}
              </div>
              <button
                onClick={nextQuizQuestion}
                className="px-3 py-1 bg-amber-950 text-xs rounded border border-amber-700 text-amber-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Mode 1: Four Principles & CURB Capacity Evaluator */}
          {activeMode === "fourPrinciples" && (
            <div className={styles.aetcomSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck size={14} /> Decision-Making Capacity Checklist (CURB Criteria)
                </span>
                <span className="text-[11px] text-slate-400">Clinical Capacity Determination</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setCurbC(!curbC)}
                  className={`p-2 rounded font-bold border transition ${
                    curbC
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  [C] Communicate Choice
                </button>
                <button
                  onClick={() => setCurbU(!curbU)}
                  className={`p-2 rounded font-bold border transition ${
                    curbU
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  [U] Understand Facts
                </button>
                <button
                  onClick={() => setCurbR(!curbR)}
                  className={`p-2 rounded font-bold border transition ${
                    curbR
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  [R] Reason Logically
                </button>
                <button
                  onClick={() => setCurbB(!curbB)}
                  className={`p-2 rounded font-bold border transition ${
                    curbB
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  [B] Believe / Appreciate
                </button>
              </div>

              <div className={styles.aetcomResultsGrid}>
                <div className={styles.aetcomResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Capacity Evaluation</div>
                  <div className={`text-xs font-bold mt-1 ${capacityStatus.color}`}>{capacityStatus.statusText}</div>
                </div>
                <div className={styles.aetcomResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Ethical Action</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{capacityStatus.guidance}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: SPIKES Protocol Simulator */}
          {activeMode === "spikes" && (
            <div className={styles.aetcomSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare size={14} /> The SPIKES 6-Step Protocol Simulator
                </span>
                <span className="text-[11px] text-slate-400">Stepwise Communication Engine</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-xs">
                {[
                  { step: 1, label: "S: Setting" },
                  { step: 2, label: "P: Perception" },
                  { step: 3, label: "I: Invitation" },
                  { step: 4, label: "K: Knowledge" },
                  { step: 5, label: "E: Empathy" },
                  { step: 6, label: "S: Strategy" },
                ].map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setSpikesStep(s.step as any)}
                    className={`p-2 rounded font-bold border text-center transition ${
                      spikesStep === s.step
                        ? "bg-amber-600 text-white border-amber-400"
                        : "bg-slate-900 text-slate-300 border-slate-700"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                {spikesStep === 1 && (
                  <div>
                    <div className="text-amber-300 font-bold">Step 1: Setting &amp; Setup</div>
                    <div className="text-slate-300 mt-1">Ensure private room, sit at eye level, silence pagers, and ask if the patient wants supportive family present.</div>
                  </div>
                )}
                {spikesStep === 2 && (
                  <div>
                    <div className="text-amber-300 font-bold">Step 2: Perception ("Ask Before You Tell")</div>
                    <div className="text-slate-300 mt-1">"What is your understanding of why we performed the biopsy and CT scan?"</div>
                  </div>
                )}
                {spikesStep === 3 && (
                  <div>
                    <div className="text-amber-300 font-bold">Step 3: Invitation ("Ask How Much They Want to Know")</div>
                    <div className="text-slate-300 mt-1">"Would you like me to go over all the specific details today, or would you prefer a general summary?"</div>
                  </div>
                )}
                {spikesStep === 4 && (
                  <div>
                    <div className="text-amber-300 font-bold">Step 4: Knowledge ("Fire a Warning Shot")</div>
                    <div className="text-slate-300 mt-1">"Unfortunately, I have some difficult news to share..." (use plain language, avoid medical jargon).</div>
                  </div>
                )}
                {spikesStep === 5 && (
                  <div>
                    <div className="text-amber-300 font-bold">Step 5: Empathy &amp; Emotion (NURSE Framework)</div>
                    <div className="text-slate-300 mt-1">Name emotion, understand/validate, respect strength, offer support, and explore fears before discussing medical plans.</div>
                  </div>
                )}
                {spikesStep === 6 && (
                  <div>
                    <div className="text-amber-300 font-bold">Step 6: Strategy &amp; Summary (Teach-Back)</div>
                    <div className="text-slate-300 mt-1">Outline stepwise treatment plan, check comprehension via teach-back, provide contact info, and set follow-up.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode 3: Confidentiality & Tarasoff */}
          {activeMode === "confidentiality" && (
            <div className={styles.aetcomSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Confidentiality Exceptions &amp; Malpractice 4 Ds
                </span>
                <span className="text-[11px] text-slate-400">Legal Boundaries of Privilege</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-amber-300 font-bold">The Tarasoff Ruling (Duty to Protect)</div>
                  <div className="text-slate-300 mt-1">Mandatory breach when an explicit, credible, imminent threat is made against an identifiable victim.</div>
                  <div className="text-rose-400 font-bold mt-1">Action: Notify law enforcement + Warn victim directly + Emergency psychiatric hold.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-amber-300 font-bold">The 4 Ds of Medical Malpractice</div>
                  <div className="text-slate-300 mt-1">1. Duty of Care &bull; 2. Dereliction (Breach) &bull; 3. Direct Causation &bull; 4. Damages.</div>
                  <div className="text-sky-300 font-bold mt-1">Res Ipsa Loquitur: Obvious negligence (retained surgical sponge).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: End-of-Life & Brain Death Apnea */}
          {activeMode === "endOfLife" && (
            <div className={styles.aetcomSliderCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart size={14} /> Brain Death Apnea Testing &amp; Double Effect Engine
                </span>
                <div className="flex gap-1 text-[11px]">
                  <button
                    onClick={() => setRespiratoryEffort(!respiratoryEffort)}
                    className={`px-2 py-0.5 rounded font-bold border transition ${
                      respiratoryEffort
                        ? "bg-emerald-600 text-white border-emerald-400"
                        : "bg-slate-900 text-slate-300 border-slate-700"
                    }`}
                  >
                    {respiratoryEffort ? "Breathing Present" : "No Respiratory Effort"}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Arterial PaCO2 during Apnea Test:</span>{" "}
                  <strong className="text-amber-400">{paco2Level} mmHg (Target: &ge; 60 mmHg)</strong>
                </div>
                <input
                  type="range"
                  min="35"
                  max="80"
                  step="1"
                  value={paco2Level}
                  onChange={(e) => setPaco2Level(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className={styles.aetcomResultsGrid}>
                <div className={styles.aetcomResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Apnea Test Interpretation</div>
                  <div className={`text-xs font-bold mt-1 ${apneaStatus.color}`}>{apneaStatus.result}</div>
                </div>
                <div className={styles.aetcomResultBox}>
                  <div className="text-[11px] text-slate-400 font-semibold">Clinical Significance</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{apneaStatus.details}</div>
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
                    <span className="text-amber-400 font-bold">Protocol:</span> {node.clinicalProtocol}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect ethics protocol</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield AETCOM Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              AETCOM Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🎯 Bioethical Principle / Framework</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Legal &amp; Ethical Standard</div>
            <div className={styles.inspectorBody}>{activeNode.diagnosticCriteria}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🛠️ Clinical &amp; Communication Action</div>
            <div className={styles.inspectorBody}>{activeNode.emergencyAction}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Beauchamp &amp; GMC Gold Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("fourPrinciples")}
          className={`${styles.modeTab} ${activeMode === "fourPrinciples" ? styles.modeTabActive : ""}`}
        >
          ⚖️ 1. 4 Principles &amp; Capacity
        </button>
        <button
          onClick={() => setActiveMode("spikes")}
          className={`${styles.modeTab} ${activeMode === "spikes" ? styles.modeTabActive : ""}`}
        >
          💬 2. SPIKES &amp; NURSE Empathy
        </button>
        <button
          onClick={() => setActiveMode("confidentiality")}
          className={`${styles.modeTab} ${activeMode === "confidentiality" ? styles.modeTabActive : ""}`}
        >
          🛡️ 3. Tarasoff &amp; Malpractice
        </button>
        <button
          onClick={() => setActiveMode("endOfLife")}
          className={`${styles.modeTab} ${activeMode === "endOfLife" ? styles.modeTabActive : ""}`}
        >
          🕊️ 4. End-of-Life &amp; Brain Death
        </button>
      </div>
    </div>
  );
}
