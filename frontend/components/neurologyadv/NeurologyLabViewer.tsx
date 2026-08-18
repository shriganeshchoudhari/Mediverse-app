"use client";

import React, { useState, useMemo } from "react";
import styles from "./NeurologyLabViewer.module.css";
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

export type NeurologyLabMode = "stroke" | "hemorrhage" | "demyelinating" | "spinal";

export interface NeurologyLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  neuroanatomyProfile: string;
  pathophysiology: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const NEUROLOGY_LAB_NODES: Record<NeurologyLabMode, NeurologyLabNode[]> = {
  stroke: [
    {
      id: "neuro-str-mca-cortical",
      name: "MCA Cortical Syndromes (Broca vs Wernicke Aphasia & Neglect)",
      category: "Cerebral Ischemia",
      subType: "Main Stem / M1-M2 • Contralateral Face/Arm > Leg Hemiparesis • Broca vs Wernicke • Hemispatial Neglect",
      neuroanatomyProfile: "Lateral convexity of frontal, parietal, and temporal lobes; internal capsule lateral aspect.",
      pathophysiology: "Occlusion impairs primary motor/sensory cortex (face/arm representation) and language association areas.",
      clinicalHallmarks: "Contralateral hemiplegia (face/arm > leg), homonymous hemianopia, Broca (dominant motor non-fluent) vs Wernicke (dominant sensory fluent) aphasia; right parietal neglect.",
      highYieldPearls: "Dominant hemisphere MCA strokes cause Aphasia; non-dominant hemisphere (right) MCA strokes cause Hemispatial Neglect."
    },
    {
      id: "neuro-str-aca-leg",
      name: "ACA Paracentral Lobule (Contralateral Leg Weakness)",
      category: "Cerebral Ischemia",
      subType: "Anterior Cerebral Artery • Medial Frontal & Parietal Cortex • Leg > Arm Deficits • Urinary Incontinence",
      neuroanatomyProfile: "Medial surface of the cerebral cortex containing the lower extremity homunculus motor and sensory representations.",
      pathophysiology: "Infarction of the medial frontoparietal cortex and supplementary motor area impairs voluntary micturition and leg control.",
      clinicalHallmarks: "Contralateral leg weakness and sensory loss, urinary incontinence, transcortical motor aphasia, abulia/apathy, primitive grasp reflex.",
      highYieldPearls: "Leg and foot weakness greater than arm weakness with urinary incontinence = Anterior Cerebral Artery (ACA) infarction."
    },
    {
      id: "neuro-str-pca-macular",
      name: "PCA Calcarine Cortex (Hemianopia with Macular Sparing)",
      category: "Cerebral Ischemia",
      subType: "Posterior Cerebral Artery • Primary Visual Cortex (V1) • Macular Sparing (MCA Collaterals) • Alexia without Agraphia",
      neuroanatomyProfile: "Occipital lobe, calcarine sulcus, thalamus, and splenium of the corpus callosum.",
      pathophysiology: "Ischemia of the visual cortex causes contralateral homonymous hemianopia; dual MCA collateral supply preserves the central fovea.",
      clinicalHallmarks: "Contralateral homonymous hemianopia with MACULAR SPARING; Alexia without Agraphia (patient can write, but cannot read what they wrote).",
      highYieldPearls: "Macular Sparing in homonymous hemianopia indicates a PCA stroke (dual macular perfusion via MCA collaterals)."
    },
    {
      id: "neuro-str-wallenberg-pica",
      name: "Lateral Medullary Wallenberg (PICA Nucleus Ambiguus)",
      category: "Brainstem Stroke",
      subType: "PICA / Vertebral • Nucleus Ambiguus (CN IX, X) • Dysphagia • Horner • Ataxia • Crossed Sensory Loss • Motor Spared!",
      neuroanatomyProfile: "Dorsolateral medulla containing nucleus ambiguus, vestibular nuclei, spinal trigeminal nucleus, inferior cerebellar peduncle, and spinothalamic tract.",
      pathophysiology: "Infarction produces ipsilateral cranial nerve and cerebellar signs with contralateral body spinothalamic deficit.",
      clinicalHallmarks: "Dysphagia, hoarseness, absent gag reflex (nucleus ambiguus), ipsilateral Horner, ipsilateral ataxia, loss of facial pain/temp, contralateral body pain/temp loss; 5/5 motor strength.",
      highYieldPearls: "Wallenberg (PICA) features dysphagia and hoarseness (Nucleus Ambiguus), Horner syndrome, and crossed sensory loss with NORMAL motor power."
    }
  ],

  hemorrhage: [
    {
      id: "neuro-hem-edh-mma",
      name: "Epidural Hemorrhage EDH (Middle Meningeal Artery)",
      category: "Extra-Axial Bleed",
      subType: "Pterion Fracture • Middle Meningeal Artery (MMA) • Classic Lucid Interval • Biconvex Lenticular CT",
      neuroanatomyProfile: "Arterial bleed between the inner table of the skull and the periosteal layer of the dura mater.",
      pathophysiology: "High-pressure arterial bleeding strips dura from bone until arrested by cranial sutures, expanding rapidly into brain parenchyma.",
      clinicalHallmarks: "Trauma -> brief loss of consciousness -> lucid interval -> rapid coma with uncal herniation (ipsilateral blown pupil, contralateral hemiplegia).",
      highYieldPearls: "Biconvex (lens-shaped) hyperdensity on head CT that DOES NOT cross suture lines = Epidural Hematoma (MMA rupture)."
    },
    {
      id: "neuro-hem-sdh-bridging",
      name: "Subdural Hemorrhage SDH (Bridging Cortical Veins)",
      category: "Extra-Axial Bleed",
      subType: "Bridging Cortical Veins • Brain Atrophy in Elderly/Alcoholics • Crescent-Shaped CT • CAN Cross Suture Lines",
      neuroanatomyProfile: "Venous bleed in the potential space between the dura mater and arachnoid mater.",
      pathophysiology: "Brain parenchymal atrophy stretches bridging cortical veins; minor head trauma tears veins, producing slow, progressive accumulation.",
      clinicalHallmarks: "Gradual progressive headache, fluctuating confusion, focal deficits weeks after minor fall; crescent concave collection crossing sutures.",
      highYieldPearls: "Crescent-shaped (concave) collection on head CT that CAN cross suture lines = Subdural Hematoma (Bridging vein tear)."
    },
    {
      id: "neuro-hem-sah-aneurysm",
      name: "Subarachnoid Hemorrhage SAH (Berry Aneurysm & Nimodipine)",
      category: "Vascular Emergency",
      subType: "Saccular (Berry) Aneurysm (ACom) • 'Thunderclap' Headache • LP: Xanthochromia (>12h) • Nimodipine Vasospasm Prophylaxis",
      neuroanatomyProfile: "Bleeding into the CSF-filled subarachnoid space between arachnoid and pia mater.",
      pathophysiology: "Aneurysm rupture floods basal cisterns with arterial blood, raising intracranial pressure and causing chemical meningismus.",
      clinicalHallmarks: "'Worst headache of my life', neck stiffness, photophobia; non-contrast CT -> Lumbar Puncture (Xanthochromia); Nimodipine prevents vasospasm.",
      highYieldPearls: "Thunderclap headache + Xanthochromia on LP = SAH; prescribe oral Nimodipine to prevent delayed cerebral vasospasm (Days 3-14)."
    },
    {
      id: "neuro-hem-uncal-herniation",
      name: "Uncal Transtentorial Herniation (Blown Pupil & Kernohan)",
      category: "Mass Effect Emergency",
      subType: "Medial Temporal Uncus Herniation • CN III Compression (Blown Pupil) • Contralateral Hemiparesis • Kernohan Notch False Localizer",
      neuroanatomyProfile: "Medial temporal lobe uncus displaces inferomedially across the tentorium cerebelli notch.",
      pathophysiology: "Uncus compresses ipsilateral CN III parasympathetics (pupillomotor fibers) and the ipsilateral cerebral peduncle.",
      clinicalHallmarks: "Ipsilateral fixed dilated pupil (blown pupil), ptosis, down-and-out eye, contralateral hemiplegia; Kernohan notch causes ipsilateral hemiparesis.",
      highYieldPearls: "Ipsilateral blown, unreactive pupil indicates impending uncal herniation with compression of the outer parasympathetic fibers of CN III."
    }
  ],

  demyelinating: [
    {
      id: "neuro-dem-ms-ino",
      name: "Multiple Sclerosis MS (MLF Internuclear Ophthalmoplegia)",
      category: "CNS Demyelination",
      subType: "Oligodendrocyte Demyelination • Separated in Time & Space • MLF Lesion (INO) • CSF Oligoclonal IgG Bands",
      neuroanatomyProfile: "Autoimmune destruction of central myelin in periventricular white matter, optic nerves, brainstem, and spinal cord.",
      pathophysiology: "Demyelination of the Medial Longitudinal Fasciculus (MLF) uncouples CN VI abducens from CN III oculomotor nucleus.",
      clinicalHallmarks: "Optic neuritis (painful vision loss), INO (impaired ipsilateral adduction with abducting nystagmus), Lhermitte electric sign; IV Methylprednisolone.",
      highYieldPearls: "Bilateral Internuclear Ophthalmoplegia (INO) in a young woman is pathognomonic for Multiple Sclerosis (MLF demyelination)."
    },
    {
      id: "neuro-dem-gbs-albuminocytologic",
      name: "Guillain-Barré Syndrome GBS (Albuminocytologic Dissociation)",
      category: "PNS Demyelination",
      subType: "Campylobacter Mimicry • Ascending Flaccid Paralysis • Areflexia • CSF: High Protein with NORMAL WBC • IVIG/Plasma Exchange",
      neuroanatomyProfile: "Autoimmune attack on peripheral nerve myelin (Schwann cells) and nodes of Ranvier.",
      pathophysiology: "Cross-reacting anti-ganglioside antibodies induce complement-mediated demyelination of motor and sensory peripheral nerves.",
      clinicalHallmarks: "Symmetrical ascending weakness starting in legs, absent deep tendon reflexes, autonomic instability; monitor FVC/NIF; IVIG or Plasmapheresis.",
      highYieldPearls: "CSF showing elevated protein with normal cell count (Albuminocytologic Dissociation) = Guillain-Barré Syndrome (Steroids are contraindicated!)."
    },
    {
      id: "neuro-dem-mg-fatigable",
      name: "Myasthenia Gravis MG (Postsynaptic Anti-AChR & Thymoma)",
      category: "Neuromuscular Junction",
      subType: "Anti-AChR Antibodies • Postsynaptic Junction • Fatigable Weakness (Worsens with Use) • Thymoma (15%) • Pyridostigmine",
      neuroanatomyProfile: "Nicotinic acetylcholine receptors on the skeletal muscle motor endplate.",
      pathophysiology: "Antibodies block and internalize AChRs, reducing safety factor of neuromuscular transmission and causing rapid muscle fatigue.",
      clinicalHallmarks: "Fluctuating ptosis, diplopia, dysarthria, proximal weakness worsening at end of day or after exercise; Pyridostigmine; chest CT for thymoma.",
      highYieldPearls: "Myasthenia Gravis weakness WORSENS with repetitive muscle use; Lambert-Eaton weakness IMPROVES with repetitive muscle use."
    },
    {
      id: "neuro-dem-huntington-caudate",
      name: "Huntington Disease (Caudate Atrophy & CAG Repeat Chorea)",
      category: "Basal Ganglia Degeneration",
      subType: "CAG Trinucleotide Repeat on Chromosome 4 • Caudate Nucleus & Putamen Atrophy • Loss of GABAergic Neurons • Chorea",
      neuroanatomyProfile: "Striatum (caudate nucleus and putamen), with enlargement of frontal horns of lateral ventricles.",
      pathophysiology: "Mutant huntingtin protein causes transcriptional dysregulation and selective apoptosis of GABAergic medium spiny neurons.",
      clinicalHallmarks: "Choreiform involuntary jerking movements, dementia, depression, personality changes; autosomal dominant inheritance with anticipation.",
      highYieldPearls: "Huntington features Caudate atrophy with boxcar ventricles, CAG trinucleotide repeats, and severe loss of GABA in the striatum."
    }
  ],

  spinal: [
    {
      id: "neuro-spi-brown-sequard",
      name: "Brown-Séquard Hemicord (Ipsilateral Motor & Contralateral Pain)",
      category: "Spinal Cord Hemisection",
      subType: "Hemicord Transection • Ipsilateral UMN Weakness & Proprioception Loss • Contralateral Pain/Temp Loss 1-2 Levels Below",
      neuroanatomyProfile: "Lateral half of spinal cord involving corticospinal tract, dorsal column (gracile/cuneate), and spinothalamic tract.",
      pathophysiology: "Corticospinal and dorsal column fibers cross above the spinal cord (medulla), while spinothalamic fibers cross in the cord.",
      clinicalHallmarks: "Ipsilateral spastic paresis, ipsilateral loss of vibration/proprioception below lesion, and contralateral loss of pain/temperature.",
      highYieldPearls: "Brown-Séquard has IPSILATERAL motor weakness and proprioception loss with CONTRALATERAL pain and temperature loss."
    },
    {
      id: "neuro-spi-anterior-cord",
      name: "Anterior Spinal Artery Infarct (Dorsal Columns Preserved!)",
      category: "Vascular Cord Infarction",
      subType: "Anterior Spinal Artery (ASA) • Bilateral UMN Paralysis • Bilateral Loss of Pain/Temp • DORSAL COLUMNS COMPLETELY SPARED!",
      neuroanatomyProfile: "Anterior two-thirds of the spinal cord (corticospinal tracts, spinothalamic tracts, anterior horns).",
      pathophysiology: "ASA occlusion (e.g. aortic aneurysm repair or severe hypotension) leaves posterior spinal arteries intact.",
      clinicalHallmarks: "Sudden paraplegia, loss of pain and temperature sensation below lesion, bowel/bladder incontinence; vibration and proprioception 100% normal.",
      highYieldPearls: "Anterior cord syndrome features complete motor paralysis and loss of pain/temp, but vibration and proprioception are COMPLETELY SPARED."
    },
    {
      id: "neuro-spi-syringomyelia-cape",
      name: "Central Cord Syringomyelia (Bilateral Cape-Like Pain Loss)",
      category: "Central Cavitary Syrinx",
      subType: "Anterior White Commissure Compression • Chiari I Malformation • Bilateral 'Cape-Like' Pain/Temp Loss • Spares Dorsal Columns",
      neuroanatomyProfile: "Cervical spinal cord central canal syrinx disrupting decussating spinothalamic axons in the anterior white commissure.",
      pathophysiology: "Expanding cystic fluid cavitates the central cord, selectively severing crossing spinothalamic fibers for C4-T2 dermatomes.",
      clinicalHallmarks: "Loss of pain and temperature sensation across shoulders, upper chest, and arms in a 'cape' distribution; painless hand burns; Chiari I.",
      highYieldPearls: "Bilateral 'cape-like' loss of pain and temperature over the shoulders and arms with preserved light touch/proprioception = Syringomyelia."
    },
    {
      id: "neuro-spi-als-motor-neuron",
      name: "Amyotrophic Lateral Sclerosis ALS (Combined UMN & LMN)",
      category: "Motor Neuron Degeneration",
      subType: "Betz Cells + Anterior Horn Cells • Combined UMN (Hyperreflexia/Babinski) & LMN (Fasciculations/Atrophy) • Sensory 100% Spared • Riluzole",
      neuroanatomyProfile: "Corticospinal tracts (UMN) and spinal anterior horn motor neurons / brainstem motor nuclei (LMN).",
      pathophysiology: "Degenerative loss of upper and lower motor neurons with TDP-43 and SOD1 aggregates; sensory and autonomic pathways untouched.",
      clinicalHallmarks: "Asymmetric hand weakness, fasciculations, tongue atrophy, hyperreflexia, upgoing toes (Babinski), normal sensation, normal sphincters; Riluzole.",
      highYieldPearls: "ALS is the classic disease with COMBINED Upper (hyperreflexia, Babinski) and Lower (fasciculations, muscle atrophy) motor neuron signs."
    }
  ]
};

interface NeurologyLabViewerProps {
  initialMode?: NeurologyLabMode;
  height?: string;
  onNodeSelect?: (node: NeurologyLabNode) => void;
}

export default function NeurologyLabViewer({
  initialMode = "stroke",
  height = "560px",
  onNodeSelect,
}: NeurologyLabViewerProps) {
  const [activeMode, setActiveMode] = useState<NeurologyLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Stroke Territory State
  const [selectedStroke, setSelectedStroke] = useState<"mca" | "aca" | "pca" | "pica">("mca");

  // Spinal Cord Syndrome State
  const [selectedSpinal, setSelectedSpinal] = useState<"brown" | "asa" | "syrinx" | "als">("brown");

  const strokeDetails = useMemo(() => {
    if (selectedStroke === "mca") {
      return {
        title: "Middle Cerebral Artery (MCA) Main Stem",
        territory: "Contralateral Face/Arm > Leg Hemiplegia • Dominant Broca/Wernicke Aphasia • Non-Dominant Neglect",
        rx: "IV Thrombolysis (r-tPA / Tenecteplase <4.5h) + Endovascular Mechanical Thrombectomy (<24h)",
        pearl: "Dominant hemisphere MCA strokes produce Aphasia; right-sided MCA strokes produce Hemispatial Neglect."
      };
    } else if (selectedStroke === "aca") {
      return {
        title: "Anterior Cerebral Artery (ACA)",
        territory: "Medial Frontal Cortex • Contralateral Leg > Arm Weakness • Urinary Incontinence • Abulia",
        rx: "Emergency IV Thrombolysis / Thrombectomy; evaluation for cardioembolic source",
        pearl: "Leg and foot weakness greater than arm weakness with urinary incontinence indicates ACA stroke."
      };
    } else if (selectedStroke === "pca") {
      return {
        title: "Posterior Cerebral Artery (PCA)",
        territory: "Primary Visual Cortex • Contralateral Hemianopia with MACULAR SPARING • Alexia without Agraphia",
        rx: "Thrombolysis / Secondary prevention with Antiplatelets (Aspirin/Clopidogrel) and Statins",
        pearl: "Macular vision is spared because the central fovea has collateral dual blood supply from MCA."
      };
    } else {
      return {
        title: "Lateral Medullary (Wallenberg) PICA Stroke",
        territory: "Nucleus Ambiguus (CN IX, X) • Dysphagia, Hoarseness • Horner • Ataxia • Crossed Sensory • Motor Spared!",
        rx: "Airway protection and aspiration precautions for severe dysphagia; antiplatelet / anticoagulation",
        pearl: "Nucleus Ambiguus ischemia causes dysphagia and hoarseness; motor power is completely preserved."
      };
    }
  }, [selectedStroke]);

  const spinalDetails = useMemo(() => {
    if (selectedSpinal === "brown") {
      return {
        title: "Brown-Séquard Syndrome (Hemicord)",
        indices: "Ipsilateral Motor & Proprioception Loss • Contralateral Pain/Temp Loss 1-2 Levels Below",
        rx: "Surgical decompression for trauma / tumor; high-dose corticosteroids for acute spinal cord injury",
        pearl: "Corticospinal and dorsal column deficits are ipsilateral; spinothalamic loss is contralateral."
      };
    } else if (selectedSpinal === "asa") {
      return {
        title: "Anterior Spinal Artery (ASA) Infarct",
        indices: "Bilateral Flaccid -> Spastic Paralysis • Bilateral Pain/Temp Loss • DORSAL COLUMNS 100% INTACT",
        rx: "Maintain mean arterial pressure (MAP >85 mmHg), lumbar CSF drainage if post-aortic repair",
        pearl: "Vibration and joint position sense are completely spared because posterior columns receive separate perfusion."
      };
    } else if (selectedSpinal === "syrinx") {
      return {
        title: "Central Cord Syringomyelia (Chiari I)",
        indices: "Anterior White Commissure Syrinx • Bilateral 'Cape-Like' Pain/Temp Loss over Shoulders/Arms",
        rx: "Suboccipital craniectomy and posterior fossa decompression for underlying Chiari I malformation",
        pearl: "Bilateral loss of pain/temp over upper limbs with preserved light touch/proprioception = Syringomyelia."
      };
    } else {
      return {
        title: "Amyotrophic Lateral Sclerosis (ALS)",
        indices: "Combined UMN (Hyperreflexia, Babinski) & LMN (Fasciculations, Atrophy) • Sensation & Sphincters 100% Spared",
        rx: "Riluzole (glutamate release inhibitor; prolongs survival by months) + Edaravone + Non-invasive ventilation",
        pearl: "Coexistence of Upper (hyperreflexia) and Lower (fasciculations/atrophy) motor neuron signs confirms ALS."
      };
    }
  }, [selectedSpinal]);

  const currentNodes = useMemo(() => {
    return NEUROLOGY_LAB_NODES[activeMode] || NEUROLOGY_LAB_NODES.stroke;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: NeurologyLabNode) => {
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
            <Brain size={14} /> NEURO-301
          </span>
          <span className={styles.titleText}>
            {activeMode === "stroke" && "Acute Ischemic Stroke Syndromes, Aphasias & Brainstem Neuro-Localization"}
            {activeMode === "hemorrhage" && "Intracranial Hemorrhages: Epidural (MMA), Subdural & Subarachnoid (Berry)"}
            {activeMode === "demyelinating" && "Demyelinating (MS, GBS), Neuromuscular (MG, LEMS) & Movement Disorders"}
            {activeMode === "spinal" && "Spinal Cord Syndromes (Brown-Séquard, Anterior, Syringomyelia) & ALS"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Neurology Diagnostic Quiz"}
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
                  Neurology Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Neurological / Stroke Syndrome: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: Stroke Vascular Localization */}
          {activeMode === "stroke" && (
            <div className={styles.neuroCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Stroke Vascular Territory &amp; Localization Matrix
                </span>
                <span className="text-[11px] text-slate-400">MCA &bull; ACA &bull; PCA &bull; Wallenberg (PICA)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedStroke("mca")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedStroke === "mca"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🧠 MCA (Face/Arm &gt; Leg)
                </button>
                <button
                  onClick={() => setSelectedStroke("aca")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedStroke === "aca"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🚶 ACA (Leg &gt; Arm)
                </button>
                <button
                  onClick={() => setSelectedStroke("pca")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedStroke === "pca"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  👁️ PCA (Macular Sparing)
                </button>
                <button
                  onClick={() => setSelectedStroke("pica")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedStroke === "pica"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚡ Wallenberg (PICA)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-indigo-300">{strokeDetails.title}</div>
                <div className="text-emerald-400 font-bold mt-1">{strokeDetails.territory}</div>
                <div className="text-slate-300 mt-1"><strong className="text-indigo-400">Acute Revascularization:</strong> {strokeDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Localization Rule:</strong> {strokeDetails.pearl}</div>
              </div>
            </div>
          )}

          {/* Mode 2: Intracranial Bleeds */}
          {activeMode === "hemorrhage" && (
            <div className={styles.neuroCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={14} /> Intracranial Bleed Comparative Morphology
                </span>
                <span className="text-[11px] text-slate-400">Epidural (MMA) vs Subdural vs Subarachnoid (Berry)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Epidural vs Subdural Suture Line Rules</div>
                  <div className="text-slate-300 mt-1">Epidural Hematoma (MMA tear, pterion trauma, lucid interval) is biconvex/lenticular and DOES NOT cross cranial suture lines. Subdural Hematoma (bridging cortical veins, elderly brain atrophy) is crescent-shaped and CAN cross suture lines.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Subarachnoid Hemorrhage &amp; Nimodipine</div>
                  <div className="text-slate-300 mt-1">Berry aneurysm rupture -> 'thunderclap' worst headache of life. LP reveals Xanthochromia (&gt;12h). Prescribe oral Nimodipine (dihydropyridine CCB) to prevent delayed cerebral ischemia from vasospasm (Days 3-14).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Demyelinating & Movement */}
          {activeMode === "demyelinating" && (
            <div className={styles.neuroCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} /> Demyelinating, Neuromuscular &amp; Movement Matrix
                </span>
                <span className="text-[11px] text-slate-400">MS (INO) vs GBS vs MG (Fatigable) vs LEMS (Exercise)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Multiple Sclerosis vs Guillain-Barré</div>
                  <div className="text-slate-300 mt-1">MS features CNS oligodendrocyte demyelination, MLF Internuclear Ophthalmoplegia (INO), and CSF Oligoclonal IgG bands. GBS features PNS ascending flaccid paralysis with CSF Albuminocytologic Dissociation (high protein, normal WBC).</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-indigo-300 font-bold">Myasthenia Gravis vs Lambert-Eaton</div>
                  <div className="text-slate-300 mt-1">Myasthenia Gravis (postsynaptic anti-AChR) weakness WORSENS with repetitive muscle use (fatigable ptosis/diplopia). Lambert-Eaton (presynaptic anti-VGCC, SCLC) weakness IMPROVES with repetitive use (post-exercise facilitation).</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Spinal Cord & ALS */}
          {activeMode === "spinal" && (
            <div className={styles.neuroCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> Spinal Cord Syndromes &amp; Motor Neuron Degeneration
                </span>
                <span className="text-[11px] text-slate-400">Brown-Séquard &bull; ASA Infarct &bull; Syringomyelia &bull; ALS</span>
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
                  🩸 ASA Infarction
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
                  onClick={() => setSelectedSpinal("als")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedSpinal === "als"
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🧬 ALS (UMN + LMN)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-indigo-300">{spinalDetails.title}</div>
                <div className="text-emerald-400 font-bold mt-1">{spinalDetails.indices}</div>
                <div className="text-slate-300 mt-1"><strong className="text-indigo-400">Therapeutic Strategy:</strong> {spinalDetails.rx}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Diagnostic Rule:</strong> {spinalDetails.pearl}</div>
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
                    <span className="text-indigo-400 font-bold">Anatomy:</span> {node.neuroanatomyProfile}
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

        {/* Right Side: High-Yield Neurology Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Neurology Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧠 Neurological Entity / Syndrome</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Neuroanatomy &amp; Pathophysiology</div>
            <div className="text-xs text-indigo-300 font-semibold">{activeNode.neuroanatomyProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiology}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🩺 Clinical Hallmarks &amp; Diagnostics</div>
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
          onClick={() => setActiveMode("stroke")}
          className={`${styles.modeTab} ${activeMode === "stroke" ? styles.modeTabActive : ""}`}
        >
          🧠 1. Stroke Localization
        </button>
        <button
          onClick={() => setActiveMode("hemorrhage")}
          className={`${styles.modeTab} ${activeMode === "hemorrhage" ? styles.modeTabActive : ""}`}
        >
          🩸 2. Intracranial Bleeds
        </button>
        <button
          onClick={() => setActiveMode("demyelinating")}
          className={`${styles.modeTab} ${activeMode === "demyelinating" ? styles.modeTabActive : ""}`}
        >
          🛡️ 3. Demyelinating &amp; Movement
        </button>
        <button
          onClick={() => setActiveMode("spinal")}
          className={`${styles.modeTab} ${activeMode === "spinal" ? styles.modeTabActive : ""}`}
        >
          ⚡ 4. Spinal Cord &amp; ALS
        </button>
      </div>
    </div>
  );
}
