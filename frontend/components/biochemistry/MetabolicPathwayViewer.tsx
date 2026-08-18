"use client";

import React, { useState, useMemo } from "react";
import styles from "./MetabolicPathwayViewer.module.css";
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
} from "lucide-react";

export type MetabolicEngineMode = "carbohydrates" | "lipids" | "amino-acids";
export type MetabolicState = "well-fed" | "fasting" | "starvation";

export interface MetabolicNode {
  id: string;
  name: string;
  category: string;
  reaction: string;
  rateLimitingEnzyme: string;
  activators: string[];
  inhibitors: string[];
  clinicalDisease: string;
  inbornError?: string;
  drugTarget?: string;
  activeInState: MetabolicState[];
  highYieldPearl: string;
}

export const METABOLIC_NODES: Record<MetabolicEngineMode, MetabolicNode[]> = {
  carbohydrates: [
    {
      id: "glycolysis-pfk1",
      name: "1. Glycolysis (Rate-Limiting PFK-1)",
      category: "Carbohydrate Catabolism",
      reaction: "Fructose-6-Phosphate + ATP -> Fructose-1,6-Bisphosphate + ADP",
      rateLimitingEnzyme: "Phosphofructokinase-1 (PFK-1)",
      activators: ["AMP", "Fructose-2,6-bisphosphate (F-2,6-BP)"],
      inhibitors: ["ATP", "Citrate"],
      clinicalDisease: "Warburg Effect (aerobic glycolysis in rapidly proliferating neoplastic tumor cells).",
      inbornError: "Tarui Disease (GSD VII: muscle PFK-1 deficiency causing exertional myopathy).",
      activeInState: ["well-fed"],
      highYieldPearl: "Insulin dephosphorylates PFK-2 to produce F-2,6-BP, potently overriding ATP inhibition and driving glycolysis."
    },
    {
      id: "gluconeogenesis-fbpase1",
      name: "2. Gluconeogenesis (FBPase-1 & G6Pase)",
      category: "Carbohydrate Anabolism",
      reaction: "Fructose-1,6-BP -> F6P and G6P -> Free Blood Glucose",
      rateLimitingEnzyme: "Fructose-1,6-Bisphosphatase (FBPase-1)",
      activators: ["Citrate", "ATP"],
      inhibitors: ["AMP", "Fructose-2,6-bisphosphate"],
      clinicalDisease: "Von Gierke Disease (Type I GSD): Glucose-6-Phosphatase deficiency causing severe fasting hypoglycemia and lactic acidosis.",
      drugTarget: "Metformin inhibits hepatic gluconeogenesis via mitochondrial Complex I / AMPK activation.",
      activeInState: ["fasting", "starvation"],
      highYieldPearl: "Muscle lacks Glucose-6-Phosphatase, meaning muscle glycogen cannot contribute directly to blood glucose regulation."
    },
    {
      id: "pyruvate-dehydrogenase",
      name: "3. Pyruvate Dehydrogenase (PDH Complex)",
      category: "Aerobic Gateway",
      reaction: "Pyruvate + CoA + NAD+ -> Acetyl-CoA + CO2 + NADH",
      rateLimitingEnzyme: "PDH Complex (E1, E2, E3 + 5 Vitamin Cofactors)",
      activators: ["NAD+", "ADP", "Ca2+"],
      inhibitors: ["Acetyl-CoA", "NADH", "ATP", "Arsenic"],
      clinicalDisease: "Arsenic Poisoning: binds lipoic acid, producing garlic breath, rice-water diarrhea, and lactic acidosis.",
      inbornError: "PDH Deficiency (X-linked): lactic acidosis, microcephaly. Treated with ketogenic diet (Lysine and Leucine).",
      activeInState: ["well-fed"],
      highYieldPearl: "Requires 5 cofactors: Thiamine (B1), Lipoic acid, CoA (B5), FAD (B2), and NAD+ (B3)."
    },
    {
      id: "glycogen-phosphorylase",
      name: "4. Glycogenolysis (Myophosphorylase)",
      category: "Glycogen Storage",
      reaction: "Glycogen(n) + Pi -> Glucose-1-Phosphate + Glycogen(n-1)",
      rateLimitingEnzyme: "Glycogen Phosphorylase",
      activators: ["Epinephrine", "Glucagon", "AMP (in muscle)", "Ca2+ / Calmodulin"],
      inhibitors: ["Insulin", "ATP", "Glucose-6-Phosphate"],
      clinicalDisease: "McArdle Disease (Type V GSD): muscle phosphorylase deficiency causing exercise cramps, myoglobinuria, and second-wind effect.",
      inbornError: "Pompe Disease (Type II GSD): Lysosomal alpha-1,4-glucosidase defect with severe cardiomegaly.",
      activeInState: ["fasting", "starvation"],
      highYieldPearl: "Cori Disease (Type III) is caused by debranching enzyme deficiency, accumulating abnormal limit dextrins."
    },
    {
      id: "hmp-shunt-g6pd",
      name: "5. HMP Shunt (Pentose Phosphate Pathway)",
      category: "Reductive Biosynthesis & NADPH",
      reaction: "Glucose-6-Phosphate + 2 NADP+ -> Ribulose-5-P + 2 NADPH + CO2",
      rateLimitingEnzyme: "Glucose-6-Phosphate Dehydrogenase (G6PD)",
      activators: ["NADP+"],
      inhibitors: ["NADPH"],
      clinicalDisease: "G6PD Deficiency (X-linked): oxidative stress (sulfa drugs, fava beans, infection) triggers hemolysis.",
      inbornError: "Heinz bodies (denatured hemoglobin) and Bite cells (degmacytes) on peripheral blood smear.",
      activeInState: ["well-fed", "fasting", "starvation"],
      highYieldPearl: "NADPH is required to keep Glutathione in its reduced state (GSH) to detoxify free radicals in erythrocytes."
    }
  ],

  lipids: [
    {
      id: "chylomicron-cascade",
      name: "1. Exogenous Chylomicron Pathway",
      category: "Dietary Lipid Transport",
      reaction: "Dietary Triacylglycerols -> ApoB-48 Packaging -> LPL Cleavage -> Liver Remnant Uptake",
      rateLimitingEnzyme: "Lipoprotein Lipase (LPL)",
      activators: ["Apolipoprotein C-II (ApoC-II)", "Insulin"],
      inhibitors: ["ApoC-III"],
      clinicalDisease: "Type I Hyperchylomicronemia: LPL or ApoC-II deficiency causing recurrent acute pancreatitis and eruptive xanthomas (no CAD).",
      drugTarget: "Orlistat inhibits gastric/pancreatic lipases, blocking dietary fat absorption.",
      activeInState: ["well-fed"],
      highYieldPearl: "Chylomicrons carry dietary lipids; ApoB-48 is edited by intestine; ApoE mediates hepatic remnant uptake."
    },
    {
      id: "vldl-ldl-cascade",
      name: "2. Endogenous VLDL -> IDL -> LDL Cascade",
      category: "Hepatic Lipid Transport",
      reaction: "Hepatic Triglycerides (ApoB-100) -> VLDL -> LPL -> IDL -> Hepatic Lipase -> LDL",
      rateLimitingEnzyme: "Hepatic Lipase / LDL Receptor (LDL-R)",
      activators: ["ApoB-100 (binds LDL-R)"],
      inhibitors: ["PCSK9 (promotes LDL-R lysosomal degradation)"],
      clinicalDisease: "Familial Hypercholesterolemia (Type IIa): LDL-R mutation causing severe premature CAD and Achilles tendon xanthomas.",
      drugTarget: "Statins inhibit HMG-CoA Reductase; PCSK9 inhibitors (Evolocumab) upregulate surface LDL receptors.",
      activeInState: ["well-fed", "fasting"],
      highYieldPearl: "LDL contains only ApoB-100 and delivers 50% pure cholesterol to peripheral tissue membranes."
    },
    {
      id: "hdl-reverse-transport",
      name: "3. HDL Reverse Cholesterol Transport",
      category: "Atheroprotection",
      reaction: "Peripheral Free Cholesterol -> LCAT/PCAT Esterification -> CETP Transfer -> Hepatic SR-B1 Clearance",
      rateLimitingEnzyme: "LCAT (Lecithin-Cholesterol Acyltransferase)",
      activators: ["Apolipoprotein A-1 (ApoA-1)"],
      inhibitors: ["CETP deficiency (raises HDL)"],
      clinicalDisease: "Tangier Disease (ABCA1 transporter defect): absent HDL, orange tonsils, hepatosplenomegaly.",
      drugTarget: "Niacin increases HDL levels by inhibiting hepatic VLDL synthesis and reducing HDL catabolism.",
      activeInState: ["well-fed", "fasting", "starvation"],
      highYieldPearl: "HDL acts as a circulating reservoir for ApoC-II and ApoE, donating them to nascent chylomicrons and VLDL."
    },
    {
      id: "beta-oxidation-cpt1",
      name: "4. Fatty Acid Beta-Oxidation (Carnitine Shuttle)",
      category: "Mitochondrial Energy Yield",
      reaction: "Fatty Acyl-CoA + Carnitine -> Acylcarnitine (CPT-I) -> Matrix Beta-Oxidation -> Acetyl-CoA",
      rateLimitingEnzyme: "Carnitine Palmitoyltransferase-I (CPT-I)",
      activators: ["Glucagon", "Epinephrine"],
      inhibitors: ["Malonyl-CoA (inhibits CPT-I to prevent futile cycles)"],
      clinicalDisease: "MCAD Deficiency: Medium-chain acyl-CoA dehydrogenase defect causing fasting hypoketotic hypoglycemia and sudden death.",
      inbornError: "Systemic Primary Carnitine Deficiency (OCTN2 defect): weakness, hypotonia, cardiomyopathy, hypoketotic hypoglycemia.",
      activeInState: ["fasting", "starvation"],
      highYieldPearl: "Beta-oxidation yields Acetyl-CoA, NADH, and FADH2 to fuel gluconeogenesis and ketogenesis during prolonged starvation."
    }
  ],

  "amino-acids": [
    {
      id: "urea-cycle-cps1",
      name: "1. Urea Cycle (Rate-Limiting CPS-1)",
      category: "Nitrogen Detoxification",
      reaction: "NH4+ + HCO3- + 2 ATP -> Carbamoyl Phosphate -> Citrulline -> Argininosuccinate -> Arginine -> Urea",
      rateLimitingEnzyme: "Carbamoyl Phosphate Synthetase I (CPS-1)",
      activators: ["N-Acetylglutamate (NAG, stimulated by Arginine)"],
      inhibitors: ["Acidosis"],
      clinicalDisease: "Hyperammonemia: Asterixis (flapping tremor), cerebral edema, slurred speech, lethargy, and coma.",
      drugTarget: "Lactulose traps NH4+ in the colon; Sodium Phenylbutyrate/Benzoate act as nitrogen scavengers.",
      activeInState: ["well-fed", "fasting", "starvation"],
      highYieldPearl: "Ornithine Transcarbamylase (OTC) deficiency is X-linked, causing high orotic acid with hyperammonemia."
    },
    {
      id: "phenylketonuria-pah",
      name: "2. Phenylalanine -> Tyrosine (PKU Pathway)",
      category: "Aromatic Amino Acid Metabolism",
      reaction: "Phenylalanine + BH4 + O2 -> Tyrosine + BH2 + H2O",
      rateLimitingEnzyme: "Phenylalanine Hydroxylase (PAH)",
      activators: ["Tetrahydrobiopterin (BH4)"],
      inhibitors: ["Phenylalanine accumulation"],
      clinicalDisease: "Phenylketonuria (PKU): musty mousy odor, fair skin/blue eyes, intellectual disability, microcephaly.",
      inbornError: "Malignant PKU: Dihydrobiopterin reductase or BH4 deficiency (also impairs serotonin and dopamine synthesis).",
      activeInState: ["well-fed", "fasting"],
      highYieldPearl: "Tyrosine becomes an essential dietary amino acid in patients with PKU."
    },
    {
      id: "branched-chain-msud",
      name: "3. Branched-Chain Amino Acid Catabolism (MSUD)",
      category: "BCAA Oxidation",
      reaction: "Leucine, Isoleucine, Valine -> Alpha-Ketoacids -> BCKDH Decarboxylation -> Energy",
      rateLimitingEnzyme: "Branched-Chain Alpha-Ketoacid Dehydrogenase (BCKDH)",
      activators: ["Thiamine Pyrophosphate (TPP / Vitamin B1)"],
      inhibitors: ["ATP", "NADH"],
      clinicalDisease: "Maple Syrup Urine Disease (MSUD): sweet burnt sugar odor in urine/earwax, severe dystonia, encephalopathy.",
      inbornError: "Autosomal recessive block in BCAA degradation (Isoleucine, Leucine, Valine: 'I Love Vermont').",
      activeInState: ["well-fed", "fasting"],
      highYieldPearl: "Treatment requires dietary BCAA restriction and high-dose Thiamine (B1) supplementation."
    },
    {
      id: "homocystinuria-cbs",
      name: "4. Methionine -> Cysteine & Homocystinuria",
      category: "Sulfur Amino Acid Metabolism",
      reaction: "Homocysteine + Serine -> Cystathionine -> Cysteine (requires Vitamin B6 / PLP)",
      rateLimitingEnzyme: "Cystathionine Beta-Synthase (CBS)",
      activators: ["Pyridoxal Phosphate (Vitamin B6 / PLP)"],
      inhibitors: ["S-Adenosylmethionine"],
      clinicalDisease: "Homocystinuria: downward lens subluxation, Marfanoid habitus, osteoporosis, and severe premature DVT/Stroke.",
      inbornError: "Differentiated from Marfan syndrome (fibrillin-1 mutation): Homocystinuria has downward lens displacement and intellectual disability.",
      activeInState: ["well-fed", "fasting"],
      highYieldPearl: "Methionine Synthase converts Homocysteine back to Methionine using Vitamin B12 and N5-Methyl-THF."
    }
  ]
};

interface MetabolicPathwayViewerProps {
  initialMode?: MetabolicEngineMode;
  height?: string;
  onNodeSelect?: (node: MetabolicNode) => void;
}

export default function MetabolicPathwayViewer({
  initialMode = "carbohydrates",
  height = "560px",
  onNodeSelect,
}: MetabolicPathwayViewerProps) {
  const [activeMode, setActiveMode] = useState<MetabolicEngineMode>(initialMode);
  const [metabolicState, setMetabolicState] = useState<MetabolicState>("well-fed");
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [blockedNodeId, setBlockedNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return METABOLIC_NODES[activeMode] || METABOLIC_NODES.carbohydrates;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: MetabolicNode) => {
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

  const toggleBlockNode = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (blockedNodeId === nodeId) {
      setBlockedNodeId(null);
    } else {
      setBlockedNodeId(nodeId);
      setActiveNodeId(nodeId);
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
      {/* Top Header Controls */}
      <div className={styles.headerBar}>
        <div className={styles.titleArea}>
          <span className={styles.modeBadge}>
            <Sparkles size={14} /> BIOC-101
          </span>
          <span className={styles.titleText}>
            {activeMode === "carbohydrates" && "Carbohydrate Crossroads & Glycogen Storage"}
            {activeMode === "lipids" && "Lipoprotein Transport & Dyslipidemias"}
            {activeMode === "amino-acids" && "Urea Cycle & Amino Acid Inborn Errors"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Metabolic Quiz"}
          </button>

          <button
            className={styles.btn}
            onClick={() => setBlockedNodeId(null)}
            title="Reset All Enzyme Blocks"
          >
            <RefreshCw size={14} /> Reset Blocks
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

      {/* Main Interactive Pathway Workspace */}
      <div className={styles.mainLayout}>
        {/* Left Side: Pathway Graph & State Switcher */}
        <div className={styles.pathwayCanvas}>
          {/* Well-Fed vs Fasting vs Starvation State Switcher */}
          <div className={styles.stateSwitchBar}>
            <button
              onClick={() => setMetabolicState("well-fed")}
              className={`${styles.stateTab} ${metabolicState === "well-fed" ? styles.stateTabActive : ""}`}
            >
              🥗 Well-Fed State (High Insulin)
            </button>
            <button
              onClick={() => setMetabolicState("fasting")}
              className={`${styles.stateTab} ${metabolicState === "fasting" ? styles.stateTabActive : ""}`}
            >
              ⏰ Fasting State (High Glucagon)
            </button>
            <button
              onClick={() => setMetabolicState("starvation")}
              className={`${styles.stateTab} ${metabolicState === "starvation" ? styles.stateTabActive : ""}`}
            >
              🔥 Starvation (>3 Days)
            </button>
          </div>

          {/* Quiz Prompt Banner */}
          {isQuizMode && quizTargetNode && (
            <div className={styles.quizBanner}>
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Diagnostic Case Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify the Pathway/Enzyme: {quizTargetNode.clinicalDisease}
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

          {/* Metabolic Pathway Node Grid */}
          <div className={styles.pathwayGrid}>
            {currentNodes.map((node) => {
              const isSelected = activeNode.id === node.id;
              const isBlocked = blockedNodeId === node.id;
              const isActiveInState = node.activeInState.includes(metabolicState);

              return (
                <div
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  className={`${styles.nodeCard} ${isSelected ? styles.nodeActiveState : ""} ${
                    isBlocked ? styles.nodeBlocked : ""
                  }`}
                >
                  <div className={styles.nodeHeader}>
                    <span className={styles.enzymePill}>{node.category}</span>
                    <button
                      onClick={(e) => toggleBlockNode(e, node.id)}
                      className={`text-[10px] px-2 py-0.5 rounded font-bold transition ${
                        isBlocked
                          ? "bg-red-500 text-white"
                          : "bg-slate-800 text-slate-400 hover:text-red-400"
                      }`}
                      title="Simulate Inborn Error or Drug Block"
                    >
                      {isBlocked ? "⛔ Blocked" : "Simulate Block"}
                    </button>
                  </div>

                  <div>
                    <div className={styles.nodeTitle}>{node.name}</div>
                    <div className={styles.nodeSub}>{node.reaction}</div>
                  </div>

                  <div className="text-[11px] text-slate-300 font-medium bg-slate-950/60 p-2 rounded border border-slate-800">
                    <span className="text-emerald-400 font-bold">Enzyme:</span> {node.rateLimitingEnzyme}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>
                      State:{" "}
                      <span className={isActiveInState ? "text-emerald-400 font-bold" : "text-slate-500"}>
                        {isActiveInState ? "⚡ Highly Active" : "💤 Basal"}
                      </span>
                    </span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Molecular & Clinical Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Enzymatic & Clinical Inspector
            </span>
            {blockedNodeId === activeNode.id && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold flex items-center gap-1">
                <AlertTriangle size={12} /> Enzyme Block Active
              </span>
            )}
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🎯 Rate-Limiting Reaction</div>
            <div className="text-xs font-bold text-white">{activeNode.rateLimitingEnzyme}</div>
            <div className={styles.inspectorBody}>{activeNode.reaction}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>⚡ Allosteric Activators & Inhibitors</div>
            <div className="text-xs text-emerald-300">
              <strong>Activators:</strong> {activeNode.activators.join(", ") || "None"}
            </div>
            <div className="text-xs text-rose-300 mt-1">
              <strong>Inhibitors:</strong> {activeNode.inhibitors.join(", ") || "None"}
            </div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🏥 Inborn Error / Pathophysiology</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalDisease}</div>
            {activeNode.inbornError && (
              <div className="text-xs text-amber-300 mt-1 font-medium bg-amber-950/40 p-2 rounded border border-amber-800/40">
                <strong>Enzyme Defect:</strong> {activeNode.inbornError}
              </div>
            )}
          </div>

          {activeNode.drugTarget && (
            <div className={styles.inspectorCard}>
              <div className={styles.inspectorLabel}>💊 Pharmacology & Drug Target</div>
              <div className={styles.inspectorBody}>{activeNode.drugTarget}</div>
            </div>
          )}

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 USMLE / NMC High-Yield Pearl</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearl}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("carbohydrates")}
          className={`${styles.modeTab} ${activeMode === "carbohydrates" ? styles.modeTabActive : ""}`}
        >
          🍞 1. Carbohydrates & Glycogen
        </button>
        <button
          onClick={() => setActiveMode("lipids")}
          className={`${styles.modeTab} ${activeMode === "lipids" ? styles.modeTabActive : ""}`}
        >
          🥑 2. Lipids & Lipoproteins
        </button>
        <button
          onClick={() => setActiveMode("amino-acids")}
          className={`${styles.modeTab} ${activeMode === "amino-acids" ? styles.modeTabActive : ""}`}
        >
          🥩 3. Amino Acids & Urea Cycle
        </button>
      </div>
    </div>
  );
}
