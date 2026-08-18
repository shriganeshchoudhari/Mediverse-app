"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalBiochemistryLabViewer.module.css";
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
} from "lucide-react";

export type BiochemistryLabMode = "amino" | "gsd" | "lsd" | "porphyria";

export interface BiochemistryLabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  enzymeAndDefect: string;
  accumulatedSubstrates: string;
  clinicalHallmarks: string;
  treatmentAndPearls: string;
}

export const BIOCHEMISTRY_LAB_NODES: Record<BiochemistryLabMode, BiochemistryLabNode[]> = {
  amino: [
    {
      id: "bio-pku-pah-defect",
      name: "Phenylketonuria (PAH Defect & Mousy Odor)",
      category: "Aromatic Amino Acid",
      subType: "Phenylalanine Hydroxylase • BH4 Cofactor • Musty Odor • Tyrosine Essential • Sapropterin",
      enzymeAndDefect: "Phenylalanine Hydroxylase (PAH) or Tetrahydrobiopterin (BH4) cofactor deficiency.",
      accumulatedSubstrates: "Phenylalanine, Phenylpyruvate, Phenyllactate, Phenylacetate (mousy odor).",
      clinicalHallmarks: "Musty/mousy body odor, severe intellectual disability, microcephaly, hypopigmentation (fair skin/hair).",
      treatmentAndPearls: "Low-phenylalanine diet initiated <2 weeks of life; Tyrosine supplementation; avoid aspartame; Sapropterin (BH4)."
    },
    {
      id: "bio-homocystinuria-cbs-defect",
      name: "Homocystinuria (CBS Defect & Inferonasal Ectopia Lentis)",
      category: "Sulfur Amino Acid",
      subType: "Cystathionine beta-Synthase • Pyridoxine B6 • Downward-Inward Lens • Marfanoid • Stroke/DVT Risk",
      enzymeAndDefect: "Cystathionine beta-synthase (CBS) deficiency (requires Pyridoxine B6).",
      accumulatedSubstrates: "Homocysteine, Methionine in blood and urine; deficiency of Cysteine.",
      clinicalHallmarks: "Downward and inward lens dislocation (inferonasal ectopia lentis), marfanoid habitus, osteoporosis, massive thromboembolic DVT/stroke risk.",
      treatmentAndPearls: "High-dose Pyridoxine (Vitamin B6), Cysteine supplementation, low-methionine diet with Betaine."
    }
  ],

  gsd: [
    {
      id: "bio-gsd1-von-gierke",
      name: "Von Gierke Disease (Type I GSD & Lactic Acidosis)",
      category: "Hepatorenal GSD",
      subType: "Glucose-6-Phosphatase • Severe Fasting Hypoglycemia • Lactic Acidosis • Uric Acid • Cornstarch",
      enzymeAndDefect: "Glucose-6-Phosphatase deficiency in liver and kidneys.",
      accumulatedSubstrates: "Glucose-6-phosphate shunted to lactic acid, triglycerides, and uric acid; liver/renal glycogen.",
      clinicalHallmarks: "Doll-like cherubic face, massive hepatomegaly, severe fasting hypoglycemia, profound lactic acidosis, hyperuricemia (gout), hepatic adenomas.",
      treatmentAndPearls: "Frequent oral uncooked cornstarch; avoid pure fructose and galactose (worsens lactic acidosis!)."
    },
    {
      id: "bio-gsd5-mcardle-myophosphorylase",
      name: "McArdle Disease (Type V GSD & Flat Lactate Curve)",
      category: "Muscle GSD",
      subType: "Muscle Glycogen Phosphorylase • Muscle Cramps • Second-Wind Phenomenon • Myoglobinuria • Flat Lactate",
      enzymeAndDefect: "Skeletal Muscle Glycogen Phosphorylase (Myophosphorylase) deficiency.",
      accumulatedSubstrates: "Muscle glycogen trapped in myocytes during anaerobic exertion.",
      clinicalHallmarks: "Painful muscle cramps and fatigue during strenuous exercise, second-wind phenomenon, myoglobinuria (red-brown urine, AKI risk).",
      treatmentAndPearls: "Ischemic forearm test: failure of blood lactate to rise (flat curve) with rising ammonia. Ingest oral sucrose prior to exercise."
    }
  ],

  lsd: [
    {
      id: "bio-lsd-gaucher-disease",
      name: "Gaucher Disease (Glucocerebrosidase & Crinkled Tissue Cells)",
      category: "Sphingolipidosis",
      subType: "Glucocerebrosidase • Crinkled Tissue Macrophages • Hepatosplenomegaly • Erlenmeyer Flask Femur",
      enzymeAndDefect: "Glucocerebrosidase (Acid beta-Glucosidase) deficiency (Autosomal Recessive).",
      accumulatedSubstrates: "Glucocerebroside (Glucosylceramide) in reticuloendothelial macrophages.",
      clinicalHallmarks: "Most common LSD; massive hepatosplenomegaly, pancytopenia, bone crises, Erlenmeyer flask deformity of distal femur, avascular necrosis.",
      treatmentAndPearls: "Enzyme replacement therapy (Imiglucerase); histology reveals pathognomonic crinkled tissue paper / crumpled silk macrophages."
    },
    {
      id: "bio-lsd-taysachs-cherry-red",
      name: "Tay-Sachs Disease (Hexosaminidase A & Cherry-Red Spot)",
      category: "Gangliosidosis",
      subType: "Hexosaminidase A • GM2 Ganglioside • Cherry-Red Spot • NO Hepatosplenomegaly • Onion-Skin Lysosomes",
      enzymeAndDefect: "Hexosaminidase A deficiency (Autosomal Recessive).",
      accumulatedSubstrates: "GM2 Ganglioside in neuronal lysosomes.",
      clinicalHallmarks: "Cherry-Red Macular Spot on fundoscopy, neurodevelopmental regression, hyperacusis (startle reflex), ABSENCE of hepatosplenomegaly.",
      treatmentAndPearls: "Absence of hepatosplenomegaly distinguishes Tay-Sachs from Niemann-Pick disease (which has prominent hepatosplenomegaly)."
    }
  ],

  porphyria: [
    {
      id: "bio-porphyria-aip-hemin",
      name: "Acute Intermittent Porphyria (PBG Deaminase & 5Ps Hemin)",
      category: "Acute Hepatic Porphyria",
      subType: "PBG Deaminase • 5 Ps: Painful Abdomen, Polyneuropathy, Psychological, Port-Wine Urine, Precipitated • IV Hemin",
      enzymeAndDefect: "Porphobilinogen (PBG) Deaminase (HMB Synthase) deficiency.",
      accumulatedSubstrates: "Porphobilinogen (PBG) and delta-Aminolevulinic Acid (delta-ALA).",
      clinicalHallmarks: "5 Ps: Painful abdomen, Polyneuropathy, Psychological disturbances, Port-wine urine in light, Precipitated by CYP450 inducers/fasting; NO cutaneous photosensitivity.",
      treatmentAndPearls: "Intravenous Hemin (Panhematin) and high-dose Glucose infusion directly downregulate hepatic delta-ALA Synthase 1."
    },
    {
      id: "bio-porphyria-pct-wood-lamp",
      name: "Porphyria Cutanea Tarda (UROD & Coral-Red Wood's Lamp)",
      category: "Cutaneous Porphyria",
      subType: "Uroporphyrinogen Decarboxylase (UROD) • Blistering Photosensitivity • Tea Urine • Coral-Red Fluorescence • Hep C",
      enzymeAndDefect: "Uroporphyrinogen Decarboxylase (UROD) deficiency.",
      accumulatedSubstrates: "Uroporphyrin (Type I and III).",
      clinicalHallmarks: "Blistering photosensitivity with skin fragility on dorsal hands, facial hypertrichosis, tea-colored urine with coral-red fluorescence under Wood's lamp.",
      treatmentAndPearls: "Associated with Hepatitis C, alcohol, and iron overload; treatment is therapeutic phlebotomy and low-dose chloroquine."
    }
  ]
};

interface ClinicalBiochemistryLabViewerProps {
  initialMode?: BiochemistryLabMode;
  height?: string;
  onNodeSelect?: (node: BiochemistryLabNode) => void;
}

export default function ClinicalBiochemistryLabViewer({
  initialMode = "amino",
  height = "560px",
  onNodeSelect,
}: ClinicalBiochemistryLabViewerProps) {
  const [activeMode, setActiveMode] = useState<BiochemistryLabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Amino Acid Selector State
  const [selectedAmino, setSelectedAmino] = useState<"pku" | "msud" | "alkapton" | "homocyst">("pku");

  // GSD Selector State
  const [selectedGsd, setSelectedGsd] = useState<"vongierke" | "pompe" | "cori" | "mcardle">("vongierke");

  const aminoDetails = useMemo(() => {
    if (selectedAmino === "pku") {
      return {
        title: "Phenylketonuria (PAH Deficiency)",
        defect: "Phenylalanine Hydroxylase or BH4 cofactor defect",
        hallmarks: "Musty/mousy odor, intellectual disability, hypopigmentation (fair skin/hair), microcephaly",
        management: "Low-phenylalanine diet <2 weeks of life; Tyrosine supplementation; Sapropterin (BH4)"
      };
    } else if (selectedAmino === "msud") {
      return {
        title: "Maple Syrup Urine Disease (BCKAD Deficiency)",
        defect: "Branched-Chain alpha-Ketoacid Dehydrogenase (Thiamine B1 cofactor)",
        hallmarks: "Sweet burnt sugar / maple syrup urine odor, I/L/V accumulation, neonatal ketoacidosis, cerebral edema",
        management: "Restriction of branched-chain amino acids (Isoleucine, Leucine, Valine); high-dose Thiamine"
      };
    } else if (selectedAmino === "alkapton") {
      return {
        title: "Alkaptonuria / Ochronosis (Homogentisate Dioxygenase)",
        defect: "Homogentisate 1,2-Dioxygenase defect in tyrosine degradation",
        hallmarks: "Urine turns black on standing/air exposure, ochronosis (blue-black sclera/ears), severe ochronotic arthropathy",
        management: "Dietary protein restriction, Nitisinone (reduces HGA production), high-dose Vitamin C"
      };
    } else {
      return {
        title: "Homocystinuria (Cystathionine beta-Synthase)",
        defect: "Cystathionine beta-synthase (requires Pyridoxine B6 cofactor)",
        hallmarks: "Downward-inward (inferonasal) lens dislocation, marfanoid habitus, massive thromboembolic stroke/DVT risk",
        management: "High-dose Pyridoxine (B6), Cysteine supplementation, low-methionine diet with Betaine"
      };
    }
  }, [selectedAmino]);

  const gsdDetails = useMemo(() => {
    if (selectedGsd === "vongierke") {
      return {
        title: "Type I: Von Gierke Disease (Glucose-6-Phosphatase)",
        lactate: "PROFOUND LACTIC ACIDOSIS (High)",
        features: "Doll-like face, massive hepatomegaly, severe fasting hypoglycemia, hyperuricemia (gout), hepatic adenomas",
        rx: "Frequent oral uncooked cornstarch; avoid pure fructose and galactose"
      };
    } else if (selectedGsd === "pompe") {
      return {
        title: "Type II: Pompe Disease (Lysosomal Acid alpha-Glucosidase)",
        lactate: "Normal (Lysosomal Glycogenosis)",
        features: "'Pompe trashes the pump': Massive hypertrophic cardiomyopathy, severe generalized hypotonia (floppy infant)",
        rx: "Enzyme Replacement Therapy (Alglucosidase alfa)"
      };
    } else if (selectedGsd === "cori") {
      return {
        title: "Type III: Cori / Forbes Disease (Debranching Enzyme)",
        lactate: "NORMAL BLOOD LACTATE (Gluconeogenesis intact)",
        features: "Accumulation of limit dextrin-like abnormal glycogen, milder hypoglycemia, hepatomegaly",
        rx: "Frequent small meals with high protein content"
      };
    } else {
      return {
        title: "Type V: McArdle Disease (Muscle Glycogen Phosphorylase)",
        lactate: "FLAT LACTATE CURVE on ischemic exercise (Failure to rise)",
        features: "'McArdle = Muscle': Painful muscle cramps on exercise, second-wind phenomenon, myoglobinuria",
        rx: "Oral sucrose prior to exertion; avoid intense anaerobic exercise"
      };
    }
  }, [selectedGsd]);

  const currentNodes = useMemo(() => {
    return BIOCHEMISTRY_LAB_NODES[activeMode] || BIOCHEMISTRY_LAB_NODES.amino;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: BiochemistryLabNode) => {
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
            <Dna size={14} /> BIO-201
          </span>
          <span className={styles.titleText}>
            {activeMode === "amino" && "Inborn Errors of Amino Acid Metabolism (PKU, MSUD, Homocystinuria)"}
            {activeMode === "gsd" && "Glycogen Storage Diseases (Von Gierke, Pompe, Cori, McArdle)"}
            {activeMode === "lsd" && "Lysosomal Storage Disorders (Gaucher, Tay-Sachs, Niemann-Pick, Fabry)"}
            {activeMode === "porphyria" && "Porphyrias (AIP 5Ps Hemin vs PCT) & Urea Cycle Disorders"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Inborn Errors Quiz"}
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
                  Biochemistry Metabolic Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Disease: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: Amino Acid Metabolism Explorer */}
          {activeMode === "amino" && (
            <div className={styles.bioCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={14} /> Inborn Errors of Amino Acid Metabolism
                </span>
                <span className="text-[11px] text-slate-400">PKU &bull; MSUD &bull; Alkaptonuria &bull; Homocystinuria</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedAmino("pku")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAmino === "pku"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🧬 PKU (PAH Defect)
                </button>
                <button
                  onClick={() => setSelectedAmino("msud")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAmino === "msud"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🍁 MSUD (Burnt Sugar)
                </button>
                <button
                  onClick={() => setSelectedAmino("alkapton")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAmino === "alkapton"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🌑 Alkaptonuria (Black)
                </button>
                <button
                  onClick={() => setSelectedAmino("homocyst")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedAmino === "homocyst"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  👁️ Homocystinuria (Lens)
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-purple-300">{aminoDetails.title}</div>
                <div className="text-slate-300 mt-1"><strong className="text-purple-400">Enzymatic Defect:</strong> {aminoDetails.defect}</div>
                <div className="text-purple-200 mt-1"><strong className="text-purple-400">Hallmarks:</strong> {aminoDetails.hallmarks}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Management:</strong> {aminoDetails.management}</div>
              </div>
            </div>
          )}

          {/* Mode 2: GSD Comparator */}
          {activeMode === "gsd" && (
            <div className={styles.bioCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> Glycogen Storage Diseases (GSDs) Matrix
                </span>
                <span className="text-[11px] text-slate-400">Type I &bull; Type II &bull; Type III &bull; Type V</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setSelectedGsd("vongierke")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedGsd === "vongierke"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🍞 Type I: Von Gierke
                </button>
                <button
                  onClick={() => setSelectedGsd("pompe")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedGsd === "pompe"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  ❤️ Type II: Pompe
                </button>
                <button
                  onClick={() => setSelectedGsd("cori")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedGsd === "cori"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  🌿 Type III: Cori
                </button>
                <button
                  onClick={() => setSelectedGsd("mcardle")}
                  className={`p-2 rounded font-bold border transition ${
                    selectedGsd === "mcardle"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700"
                  }`}
                >
                  💪 Type V: McArdle
                </button>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                <div className="text-sm font-bold text-purple-300">{gsdDetails.title}</div>
                <div className="text-emerald-400 font-bold mt-1">Lactate Profile: {gsdDetails.lactate}</div>
                <div className="text-slate-300 mt-1"><strong className="text-purple-400">Clinical Features:</strong> {gsdDetails.features}</div>
                <div className="text-yellow-300 font-semibold mt-1"><strong className="text-yellow-400">Management:</strong> {gsdDetails.rx}</div>
              </div>
            </div>
          )}

          {/* Mode 3: LSD & Sphingolipidoses */}
          {activeMode === "lsd" && (
            <div className={styles.bioCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Lysosomal Storage Disorders &amp; Sphingolipidoses
                </span>
                <span className="text-[11px] text-slate-400">Gaucher &bull; Tay-Sachs &bull; Niemann-Pick &bull; Fabry</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Gaucher (Glucocerebrosidase)</div>
                  <div className="text-slate-300 mt-1">Crinkled tissue paper lipid-laden macrophages, massive hepatosplenomegaly, Erlenmeyer flask deformity of distal femur, bone crises.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Tay-Sachs vs Niemann-Pick</div>
                  <div className="text-slate-300 mt-1">Both exhibit Cherry-Red Macular Spot. Tay-Sachs has NO hepatosplenomegaly; Niemann-Pick has PROMINENT hepatosplenomegaly + foamy histiocytes.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Porphyrias & Urea Cycle */}
          {activeMode === "porphyria" && (
            <div className={styles.bioCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplet size={14} /> Porphyrias &amp; Urea Cycle Workstation
                </span>
                <span className="text-[11px] text-slate-400">AIP 5Ps &bull; PCT Coral-Red &bull; OTC Hyperammonemia</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Acute Intermittent Porphyria (AIP)</div>
                  <div className="text-slate-300 mt-1">5 Ps: Painful abdomen, Polyneuropathy, Psychological, Port-wine urine, Precipitated by CYP450 inducers. NO rash! Treat with IV Hemin + Glucose.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">OTC Deficiency vs Orotic Aciduria</div>
                  <div className="text-slate-300 mt-1">OTC: High ammonia + High orotic acid. Orotic Aciduria: Normal ammonia + High orotic acid + Megaloblastic anemia refractory to B12/folate.</div>
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
                    <span className="text-purple-400 font-bold">Defect:</span> {node.enzymeAndDefect}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect pathway</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Clinical Biochemistry Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Biochemistry Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Disease &amp; Genetic Entity</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Defective Enzyme &amp; Substrates</div>
            <div className="text-xs text-purple-300 font-semibold">{activeNode.enzymeAndDefect}</div>
            <div className={styles.inspectorBody}>{activeNode.accumulatedSubstrates}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🩺 Hallmark Clinical Pathology</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Treatment &amp; Gold Standard Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.treatmentAndPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("amino")}
          className={`${styles.modeTab} ${activeMode === "amino" ? styles.modeTabActive : ""}`}
        >
          🧬 1. Amino Acids
        </button>
        <button
          onClick={() => setActiveMode("gsd")}
          className={`${styles.modeTab} ${activeMode === "gsd" ? styles.modeTabActive : ""}`}
        >
          🍞 2. Glycogen Storage
        </button>
        <button
          onClick={() => setActiveMode("lsd")}
          className={`${styles.modeTab} ${activeMode === "lsd" ? styles.modeTabActive : ""}`}
        >
          🔬 3. Lysosomal Storage
        </button>
        <button
          onClick={() => setActiveMode("porphyria")}
          className={`${styles.modeTab} ${activeMode === "porphyria" ? styles.modeTabActive : ""}`}
        >
          🩸 4. Porphyrias &amp; Urea
        </button>
      </div>
    </div>
  );
}
