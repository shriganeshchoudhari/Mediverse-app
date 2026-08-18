"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalNeuroanatomyLabViewer.module.css";
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
  Eye,
} from "lucide-react";

export type NeuroanatomyLabMode = "brainstem" | "spinal" | "cortical" | "cn_nmj";

export interface NeuroanatomyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  vesselOrTract: string;
  lesionStructures: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const NEUROANATOMY_LAB_NODES: Record<NeuroanatomyLabMode, NeuroanatomyLabNode[]> = {
  brainstem: [
    {
      id: "neuro-wallenberg-pica",
      name: "Lateral Medullary (Wallenberg) Syndrome (PICA)",
      category: "Dorsolateral Medulla",
      subType: "PICA Occlusion • Nucleus Ambiguus • Crossed Sensory Loss • Horner • Ataxia • Spared Motor",
      vesselOrTract: "Posterior Inferior Cerebellar Artery (PICA) or Vertebral Artery.",
      lesionStructures: "Nucleus ambiguus (CN IX, X, XI), Vestibular nuclei, Spinal trigeminal tract, Spinothalamic tract, Descending sympathetics, ICP.",
      clinicalHallmarks: "Dysphagia, hoarseness, loss of gag reflex, vertigo/nystagmus, ipsilateral facial pain/temp loss + contralateral body pain/temp loss, ipsilateral Horner syndrome, ataxia.",
      highYieldPearls: "Corticospinal motor strength and dorsal column proprioception/vibration are completely SPARED (no extremity paralysis!)."
    },
    {
      id: "neuro-dejerine-asa",
      name: "Medial Medullary (Dejerine) Syndrome (ASA)",
      category: "Paramedian Medulla",
      subType: "Anterior Spinal Artery • Corticospinal Tract • Medial Lemniscus • CN XII Hypoglossal",
      vesselOrTract: "Anterior Spinal Artery (ASA) or paramedian vertebral branches.",
      lesionStructures: "Corticospinal tract (pyramid), Medial lemniscus, Hypoglossal nerve / nucleus (CN XII).",
      clinicalHallmarks: "Contralateral spastic hemiparesis, contralateral loss of vibration and proprioception, ipsilateral flaccid tongue paralysis (deviates TOWARD lesion).",
      highYieldPearls: "Tongue deviates toward the side of the lesion due to unopposed action of the normal contralateral genioglossus muscle."
    },
    {
      id: "neuro-weber-midbrain",
      name: "Weber Ventral Midbrain Syndrome (PCA)",
      category: "Ventral Midbrain",
      subType: "PCA Paramedian • CN III Oculomotor • Cerebral Peduncle • Down-and-Out Eye • Spastic Hemiparesis",
      vesselOrTract: "Posterior Cerebral Artery (PCA) penetrating branches.",
      lesionStructures: "Oculomotor nerve (CN III) fascicles and Cerebral Peduncle (Corticospinal and Corticobulbar tracts).",
      clinicalHallmarks: "Ipsilateral CN III palsy (down-and-out eye, complete ptosis, fixed dilated pupil) + contralateral spastic hemiparesis and hyperreflexia.",
      highYieldPearls: "Distinguished from Claude (CN III + ataxia/red nucleus) and Benedikt (CN III + hemiparesis + choreoathetosis/tremor)."
    }
  ],

  spinal: [
    {
      id: "neuro-brown-sequard",
      name: "Brown-Séquard Hemicord Syndrome",
      category: "Spinal Cord Hemicord",
      subType: "Hemicordectomy • Ipsilateral Motor & DCML • Contralateral Spinothalamic • Dissociated Loss",
      vesselOrTract: "Spinal cord hemicord transection (e.g. penetrating trauma, lateral disc herniation, tumor).",
      lesionStructures: "Ipsilateral lateral corticospinal tract, ipsilateral dorsal columns (DCML), crossed lateral spinothalamic tract.",
      clinicalHallmarks: "Ipsilateral spastic paresis below lesion, ipsilateral loss of vibration/proprioception below lesion, contralateral loss of pain/temperature 1-2 levels below lesion.",
      highYieldPearls: "Spinothalamic fibers decussate 1-2 segments above their entry point in the anterior white commissure, producing the contralateral sensory deficit."
    },
    {
      id: "neuro-asa-cord-infarct",
      name: "Anterior Spinal Artery Infarction (Preserved Dorsal Columns)",
      category: "Vascular Myelopathy",
      subType: "ASA Occlusion • Bilateral Motor & Spinothalamic • SPARED Dorsal Columns • Bowel/Bladder",
      vesselOrTract: "Anterior Spinal Artery (ASA) occlusion (e.g. aortic aneurysm repair, hypotension).",
      lesionStructures: "Anterior 2/3 of spinal cord: bilateral corticospinal tracts, spinothalamic tracts, descending autonomic pathways.",
      clinicalHallmarks: "Bilateral spastic paraplegia/quadriplegia below lesion, bilateral loss of pain and temperature below lesion, autonomic bladder/bowel incontinence.",
      highYieldPearls: "POSTERIOR DORSAL COLUMNS ARE PRESERVED! Vibration, fine touch, and joint position sense remain completely intact."
    },
    {
      id: "neuro-syringomyelia-cape",
      name: "Syringomyelia (Cape-like Sensory Loss)",
      category: "Central Cord Syrinx",
      subType: "Chiari I • Anterior White Commissure • Bilateral Cape-like Pain/Temp Loss • Spared DCML",
      vesselOrTract: "Expanding fluid-filled cavitation (syrinx) in the central canal of cervical spinal cord.",
      lesionStructures: "Anterior White Commissure decussating spinothalamic fibers (cervical cord levels).",
      clinicalHallmarks: "Bilateral 'cape-like' loss of pain and temperature sensation across the shoulders, arms, and upper chest; painless hand burns; spared light touch/proprioception.",
      highYieldPearls: "Strongly associated with Chiari type I malformation (downward herniation of cerebellar tonsils >5 mm through foramen magnum)."
    }
  ],

  cortical: [
    {
      id: "neuro-broca-aphasia",
      name: "Broca Expressive Aphasia (Left Inferior Frontal)",
      category: "Motor Aphasia",
      subType: "Brodmann 44/45 • Non-Fluent Telegraphic • Intact Comprehension • Impaired Repetition",
      vesselOrTract: "Left Middle Cerebral Artery (MCA) superior division.",
      lesionStructures: "Left Inferior Frontal Gyrus (pars opercularis and triangularis; Brodmann areas 44/45).",
      clinicalHallmarks: "Non-fluent, effortful telegraphic speech ('broken speech'), intact comprehension, IMPAIRED repetition, right facial/arm weakness; patient is frustrated and aware.",
      highYieldPearls: "Repetition is impaired because output requires transmission through damaged Broca area; in Transcortical Motor aphasia, repetition is preserved."
    },
    {
      id: "neuro-wernicke-aphasia",
      name: "Wernicke Receptive Aphasia (Left Superior Temporal)",
      category: "Sensory Aphasia",
      subType: "Brodmann 22 • Fluent Word Salad • Impaired Comprehension • Impaired Repetition • Right Upper Quad",
      vesselOrTract: "Left Middle Cerebral Artery (MCA) inferior division.",
      lesionStructures: "Left Superior Temporal Gyrus (posterior part; Brodmann area 22).",
      clinicalHallmarks: "Fluent speech with normal cadence but devoid of meaning ('word salad', neologisms), SEVERELY IMPAIRED comprehension, IMPAIRED repetition, patient unaware of deficit (anosognosia).",
      highYieldPearls: "Often accompanied by a contralateral right superior homonymous quadrantanopia ('pie in the sky') due to Meyer loop involvement."
    },
    {
      id: "neuro-gerstmann-syndrome",
      name: "Gerstmann Syndrome (Dominant Angular Gyrus 4 Signs)",
      category: "Parietal Lobule",
      subType: "Left Angular Gyrus • Agraphia • Acalculia • Finger Agnosia • Left-Right Disorientation",
      vesselOrTract: "Left Middle Cerebral Artery (MCA) posterior / inferior parietal branches.",
      lesionStructures: "Dominant (left) Angular Gyrus and Inferior Parietal Lobule (Brodmann area 39).",
      clinicalHallmarks: "The 4 Cardinal Signs: 1. Agraphia (inability to write), 2. Acalculia (math impairment), 3. Finger Agnosia (cannot distinguish fingers), 4. Left-Right Disorientation.",
      highYieldPearls: "Classic localizer for dominant parietal lobe pathology without primary motor weakness or blindness."
    }
  ],

  cn_nmj: [
    {
      id: "neuro-ino-mlf",
      name: "Internuclear Ophthalmoplegia (MLF Demyelination & MS)",
      category: "Brainstem Oculomotor",
      subType: "Medial Longitudinal Fasciculus • Adduction Failure • Horizontal Nystagmus • Intact Convergence",
      vesselOrTract: "Medial Longitudinal Fasciculus (MLF) bridging CN VI (pons) and CN III (midbrain).",
      lesionStructures: "MLF pathway coordinating conjugate horizontal lateral eye movements.",
      clinicalHallmarks: "On attempted conjugate lateral gaze, the ipsilateral eye fails to adduct while the contralateral abducting eye displays horizontal nystagmus; convergence remains intact.",
      highYieldPearls: "Bilateral INO in a young patient is pathognomonic of Multiple Sclerosis; unilateral INO in elderly reflects a brainstem lacunar stroke."
    },
    {
      id: "neuro-myasthenia-gravis",
      name: "Myasthenia Gravis vs Lambert-Eaton (NMJ)",
      category: "Neuromuscular Junction",
      subType: "Post-synaptic anti-AChR • Fatiguable Ptosis/Diplopia • Worsens with Use • Thymoma • Pyridostigmine",
      vesselOrTract: "Neuromuscular junction cholinergic synapse.",
      lesionStructures: "Post-synaptic nicotinic Acetylcholine Receptors (anti-AChR autoantibodies).",
      clinicalHallmarks: "Fatiguable ptosis, diplopia, proximal muscle weakness that WORSENS with repetitive use/end of day, normal DTRs, positive Ice Pack test, associated with Thymoma.",
      highYieldPearls: "Contrasts with Lambert-Eaton (anti-VGCC) where proximal weakness IMPROVES with repetitive exercise and is associated with Small Cell Lung Cancer."
    }
  ]
};

interface ClinicalNeuroanatomyLabViewerProps {
  initialMode?: NeuroanatomyLabMode;
  height?: string;
  onNodeSelect?: (node: NeuroanatomyLabNode) => void;
}

export default function ClinicalNeuroanatomyLabViewer({
  initialMode = "brainstem",
  height = "560px",
  onNodeSelect,
}: ClinicalNeuroanatomyLabViewerProps) {
  const [activeMode, setActiveMode] = useState<NeuroanatomyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Brainstem Stroke Selector State
  const [selectedStroke, setSelectedStroke] = useState<"wallenberg" | "dejerine" | "weber" | "aica">("wallenberg");

  // Spinal Syndrome Selector State
  const [selectedSpinal, setSelectedSpinal] = useState<"brown" | "asa" | "syrinx" | "scd">("brown");

  const strokeDetails = useMemo(() => {
    if (selectedStroke === "wallenberg") {
      return {
        title: "Lateral Medullary (Wallenberg) Syndrome (PICA)",
        vessel: "Posterior Inferior Cerebellar Artery (PICA)",
        hallmarks: "Nucleus ambiguus (dysphagia/hoarseness), crossed sensory loss (ipsilateral face + contralateral body), Horner, ataxia",
        spared: "Motor strength and dorsal column proprioception/vibration are completely SPARED!"
      };
    } else if (selectedStroke === "dejerine") {
      return {
        title: "Medial Medullary (Dejerine) Syndrome (ASA)",
        vessel: "Anterior Spinal Artery (ASA) paramedian branches",
        hallmarks: "Corticospinal hemiparesis, medial lemniscus proprioception loss, ipsilateral tongue deviation TOWARD lesion",
        spared: "Spinothalamic tract (pain/temp) and cranial nerves IX, X, XI are spared."
      };
    } else if (selectedStroke === "weber") {
      return {
        title: "Weber Ventral Midbrain Syndrome (PCA)",
        vessel: "Posterior Cerebral Artery (PCA) paramedian perforators",
        hallmarks: "Ipsilateral CN III palsy (down-and-out eye, ptosis, mydriasis) + contralateral spastic hemiparesis",
        spared: "Sensory tracts and cerebellar coordination are preserved."
      };
    } else {
      return {
        title: "Lateral Pontine Syndrome (AICA)",
        vessel: "Anterior Inferior Cerebellar Artery (AICA)",
        hallmarks: "'Facial droop = AICA': Ipsilateral LMN facial palsy (CN VII), CN VIII deafness/vertigo, crossed sensory loss, Horner",
        spared: "Contralateral motor corticospinal tract is spared."
      };
    }
  }, [selectedStroke]);

  const spinalDetails = useMemo(() => {
    if (selectedSpinal === "brown") {
      return {
        title: "Brown-Séquard Syndrome (Spinal Hemicord Lesion)",
        motor: "Ipsilateral Spastic Paresis below lesion (corticospinal)",
        sensory: "Ipsilateral loss of vibration/proprioception; Contralateral loss of pain/temp 1-2 levels below",
        pearl: "Dissociated sensory loss (contralateral pain/temp vs ipsilateral proprioception)."
      };
    } else if (selectedSpinal === "asa") {
      return {
        title: "Anterior Spinal Artery (ASA) Infarction",
        motor: "Bilateral Spastic Paraplegia / Quadriplegia below lesion",
        sensory: "Bilateral loss of pain and temperature below lesion; Autonomic sphincter loss",
        pearl: "DORSAL COLUMNS PRESERVED! Vibration and joint position sense remain intact."
      };
    } else if (selectedSpinal === "syrinx") {
      return {
        title: "Syringomyelia / Central Cord Syndrome (Chiari I)",
        motor: "Upper extremity weakness > lower extremity weakness",
        sensory: "Bilateral 'cape-like' suspended loss of pain and temperature over shoulders and arms",
        pearl: "Damage to decussating fibers in Anterior White Commissure with spared touch/vibration."
      };
    } else {
      return {
        title: "Subacute Combined Degeneration (Vitamin B12 Deficiency)",
        motor: "Bilateral spasticity, hyperreflexia, positive Babinski (corticospinal)",
        sensory: "Bilateral sensory ataxia, positive Romberg, loss of vibration/proprioception (dorsal columns)",
        pearl: "Elevated methylmalonic acid; neuropathy may precede hematological megaloblastic anemia!"
      };
    }
  }, [selectedSpinal]);

  const currentNodes = useMemo(() => {
    return NEUROANATOMY_LAB_NODES[activeMode] || NEUROANATOMY_LAB_NODES.brainstem;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: NeuroanatomyLabNode) => {
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
            <Brain size={14} /> NEURO-201
          </span>
          <span className={styles.titleText}>
            {activeMode === "brainstem" && "Brainstem Stroke Syndromes (Wallenberg PICA, Dejerine ASA, Weber)"}
            {activeMode === "spinal" && "Spinal Cord Syndromes (Brown-Séquard, ASA Infarct, Syringomyelia, SCD)"}
            {activeMode === "cortical" && "Higher Cortical Syndromes (Broca, Wernicke, Conduction, Gerstmann)"}
            {activeMode === "cn_nmj" && "Cranial Nerve Localizers, MLF Internuclear Ophthalmoplegia & NMJ"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Neuro Localizer Quiz"}
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
                  Neuroanatomy Localization Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Syndrome: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: Brainstem Stroke Explorer */}
          {activeMode === "brainstem" && (
            <div className={styles.neuroCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse size={14} /> Brainstem Vascular Stroke Syndromes
                </span>
                <span className="text-[11px] text-slate-400">Wallenberg &bull; Dejerine &bull; Weber &bull; AICA</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedStroke("wallenberg")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedStroke === "wallenberg"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚡ Wallenberg (PICA)
                </button>
                <button
                  onClick={() => setSelectedStroke("dejerine")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedStroke === "dejerine"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  👅 Dejerine (ASA)
                </button>
                <button
                  onClick={() => setSelectedStroke("weber")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedStroke === "weber"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  👁️ Weber (Midbrain)
                </button>
                <button
                  onClick={() => setSelectedStroke("aica")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedStroke === "aica"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  👤 AICA (Facial Droop)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-indigo-300">{strokeDetails.title}</div>
                <div className="text-slate-300 mt-1"><strong className="text-indigo-400">Occluded Artery:</strong> {strokeDetails.vessel}</div>
                <div className="text-indigo-200 mt-1"><strong className="text-indigo-400">Hallmarks:</strong> {strokeDetails.hallmarks}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Spared Systems:</strong> {strokeDetails.spared}</div>
              </div>
            </div>
          )}

          {/* Mode 2: Spinal Cord Syndromes */}
          {activeMode === "spinal" && (
            <div className={styles.neuroCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Spinal Cord Syndromes &amp; Tract Somatotopy
                </span>
                <span className="text-[11px] text-slate-400">Brown-Séquard &bull; ASA Infarct &bull; Syrinx &bull; SCD</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedSpinal("brown")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedSpinal === "brown"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚔️ Brown-Séquard
                </button>
                <button
                  onClick={() => setSelectedSpinal("asa")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedSpinal === "asa"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🩸 ASA (Spared DCML)
                </button>
                <button
                  onClick={() => setSelectedSpinal("syrinx")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedSpinal === "syrinx"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🧥 Syringomyelia (Cape)
                </button>
                <button
                  onClick={() => setSelectedSpinal("scd")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedSpinal === "scd"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💊 SCD (B12 Ataxia)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-indigo-300">{spinalDetails.title}</div>
                <div className="text-slate-300 mt-1"><strong className="text-indigo-400">Motor Pathology:</strong> {spinalDetails.motor}</div>
                <div className="text-indigo-200 mt-1"><strong className="text-indigo-400">Sensory Pathology:</strong> {spinalDetails.sensory}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Diagnostic Pearl:</strong> {spinalDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 3: Higher Cortical & Aphasias */}
          {activeMode === "cortical" && (
            <div className={styles.neuroCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain size={14} /> Higher Cortical Syndromes &amp; Aphasias
                </span>
                <span className="text-[11px] text-slate-400">Broca &bull; Wernicke &bull; Conduction &bull; Gerstmann</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Broca vs Wernicke Aphasia</div>
                  <div className="text-slate-300 mt-1">Broca (motor, non-fluent, intact comprehension, impaired repetition); Wernicke (sensory, fluent word salad, impaired comprehension, impaired repetition).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Gerstmann Syndrome (Dominant Angular Gyrus)</div>
                  <div className="text-slate-300 mt-1">The 4 Cardinal Signs: 1. Agraphia, 2. Acalculia, 3. Finger Agnosia, 4. Left-Right Disorientation.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Cranial Nerves & NMJ */}
          {activeMode === "cn_nmj" && (
            <div className={styles.neuroCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye size={14} /> Cranial Nerves, MLF &amp; Neuromuscular Junction
                </span>
                <span className="text-[11px] text-slate-400">MLF INO &bull; Cavernous Sinus &bull; MG vs LEMS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Internuclear Ophthalmoplegia (MLF)</div>
                  <div className="text-slate-300 mt-1">On horizontal gaze, ipsilateral eye fails to adduct; contralateral abducting eye has nystagmus. Intact convergence. Hallmark of MS.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Myasthenia Gravis vs Lambert-Eaton</div>
                  <div className="text-slate-300 mt-1">MG (anti-AChR post-synaptic, fatiguable weakness WORSENS with use, thymoma); LEMS (anti-VGCC pre-synaptic, weakness IMPROVES with use, SCLC).</div>
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
                    <span className="text-indigo-400 font-bold">Localization:</span> {node.vesselOrTract}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect tracts</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Clinical Neuroanatomy Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Neuro Localizer
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧠 Syndrome &amp; Lesion Site</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Damaged Neural Pathways</div>
            <div className="text-xs text-indigo-300 font-semibold">{activeNode.vesselOrTract}</div>
            <div className={styles.inspectorBody}>{activeNode.lesionStructures}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🩺 Hallmark Clinical Neurological Signs</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Localization Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("brainstem")}
          className={`${styles.modeTab} ${activeMode === "brainstem" ? styles.modeTabActive : ""}`}
        >
          ⚡ 1. Brainstem Strokes
        </button>
        <button
          onClick={() => setActiveMode("spinal")}
          className={`${styles.modeTab} ${activeMode === "spinal" ? styles.modeTabActive : ""}`}
        >
          🦴 2. Spinal Cord
        </button>
        <button
          onClick={() => setActiveMode("cortical")}
          className={`${styles.modeTab} ${activeMode === "cortical" ? styles.modeTabActive : ""}`}
        >
          🧠 3. Cortical &amp; Aphasias
        </button>
        <button
          onClick={() => setActiveMode("cn_nmj")}
          className={`${styles.modeTab} ${activeMode === "cn_nmj" ? styles.modeTabActive : ""}`}
        >
          👁️ 4. Cranial &amp; NMJ
        </button>
      </div>
    </div>
  );
}
