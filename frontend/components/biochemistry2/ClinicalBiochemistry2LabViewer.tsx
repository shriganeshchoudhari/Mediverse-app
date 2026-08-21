"use client";

import React, { useState, useMemo } from "react";
import styles from "./ClinicalBiochemistry2LabViewer.module.css";
import {
  Dna,
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
  HeartPulse,
  Radio,
  TestTube,
} from "lucide-react";

export type Biochemistry2LabMode = "repair" | "transcription" | "translation" | "molecular";

export interface Biochemistry2LabNode {
  id: string;
  name: string;
  category: string;
  subType: string;
  biocProfile: string;
  pathophysiologyMechanism: string;
  clinicalHallmarks: string;
  highYieldPearls: string;
}

export const BIOCHEMISTRY2_LAB_NODES: Record<Biochemistry2LabMode, Biochemistry2LabNode[]> = {
  repair: [
    {
      id: "bioc2-rep-xeroderma-ner-endonuclease",
      name: "Nucleotide Excision Repair NER (Endonuclease Excision of UV Dimers & Xeroderma Pigmentosum)",
      category: "DNA Repair",
      subType: "G1 Phase • Endonuclease Excision • UV Pyrimidine Dimers • Extreme Photosensitivity & Melanoma",
      biocProfile: "Repairs bulky helix-distorting DNA lesions caused by ultraviolet (UV-C) radiation.",
      pathophysiologyMechanism: "Deficiency of repair endonucleases prevents excision of thymine-thymine dimers, causing hypermutation.",
      clinicalHallmarks: "Extreme sunburn after minimal sun exposure, marked freckling, dry scaly poikiloderma, and >1000-fold increase in skin cancers.",
      highYieldPearls: "Xeroderma pigmentosum is an autosomal recessive defect in Nucleotide Excision Repair (NER) during G1 phase."
    },
    {
      id: "bioc2-rep-lynch-mmr-msh2-mlh1",
      name: "Mismatch Repair MMR (MSH2/MLH1 Microsatellite Instability & Lynch Syndrome)",
      category: "Replication Surveillance",
      subType: "S/G2 Phase • MSH2, MLH1, MSH6, PMS2 • Microsatellite Instability (MSI-H) • Hereditary Non-Polyposis Colon Ca",
      biocProfile: "Post-replicative surveillance system recognizing mismatched base pairs and insertion/deletion loops.",
      pathophysiologyMechanism: "Loss of MMR enzymes causes slippage during replication of tandem repetitive DNA tracks (microsatellite instability).",
      clinicalHallmarks: "Early right-sided colorectal cancer, endometrial cancer, ovarian cancer; autosomal dominant inheritance.",
      highYieldPearls: "Lynch syndrome (HNPCC) is caused by defective Mismatch Repair (MMR: MSH2, MLH1) with high microsatellite instability."
    },
    {
      id: "bioc2-rep-brca-hr-parp-synthetic",
      name: "Homologous Recombination HR (BRCA1/2 Double-Strand Repair & Olaparib Synthetic Lethality)",
      category: "Double-Strand Break",
      subType: "S/G2 Phase • Sister Chromatid Template • BRCA1/2 & RAD51 • Synthetic Lethality with PARP Inhibitors",
      biocProfile: "High-fidelity error-free repair pathway for double-strand DNA breaks requiring sister chromatid alignment.",
      pathophysiologyMechanism: "BRCA1/2 mutation halts homologous repair; combined pharmacological PARP inhibition causes synthetic lethal cancer death.",
      clinicalHallmarks: "Hereditary breast and ovarian cancer; exceptional tumor vulnerability to PARP inhibitors (Olaparib, Rucaparib).",
      highYieldPearls: "Homologous recombination (BRCA1/2) is error-free; PARP inhibitors exploit synthetic lethality in HR-deficient cancers."
    },
    {
      id: "bioc2-rep-ber-glycosylase-ap-endonuclease",
      name: "Base Excision Repair BER (DNA Glycosylase Deamination Removal & AP-Endonuclease)",
      category: "Base Cleavage",
      subType: "Throughout Cell Cycle • DNA Glycosylase -> AP-Endonuclease -> AP-Lyase -> Pol Beta -> DNA Ligase",
      biocProfile: "Repairs spontaneous non-bulky base damage such as cytosine deamination to uracil and base oxidation.",
      pathophysiologyMechanism: "Specific DNA glycosylases cleave the glycosidic bond, generating an AP (apurinic/apyrimidinic) site for incision.",
      clinicalHallmarks: "Protects against age-related spontaneous somatic base deamination and environmental oxidative DNA stress.",
      highYieldPearls: "Base Excision Repair order: DNA Glycosylase -> AP-Endonuclease (5') -> AP-Lyase (3') -> DNA Polymerase beta -> Ligase."
    }
  ],

  transcription: [
    {
      id: "bioc2-tx-rna-pol2-alpha-amanitin",
      name: "RNA Polymerase II & alpha-Amanitin (Death Cap Amanita Phalloides & Fulminant Hepatic Failure)",
      category: "RNA Polymerases",
      subType: "Nucleoplasm • mRNA, snRNA, miRNA Synthesis • Inhibited by alpha-Amanitin 10^-8 M • Severe Hepatotoxicity",
      biocProfile: "Catalyzes the synthesis of messenger RNAs, small nuclear RNAs, and microRNAs from protein-coding genes.",
      pathophysiologyMechanism: "Alpha-amanitin octapeptide locks RNA Polymerase II, completely shutting down mRNA transcription in hepatocytes.",
      clinicalHallmarks: "Severe gastrointestinal symptoms followed by false recovery, culminating in fulminant hepatic necrosis, jaundice, and coagulopathy.",
      highYieldPearls: "RNA Pol II is extremely sensitive to alpha-Amanitin (death cap mushroom); RNA Pol I synthesizes rRNA and is insensitive."
    },
    {
      id: "bioc2-tx-spliceosome-snrnp-sle",
      name: "Spliceosome snRNP Machinery (Intron Lariat Excision & Anti-Smith Autoantibodies in SLE)",
      category: "Post-Transcriptional Splicing",
      subType: "U1, U2, U4, U5, U6 snRNPs • GU 5' Donor & AG 3' Acceptor Sites • Anti-Smith (anti-Sm) Antibodies in SLE",
      biocProfile: "Macromolecular complex of small nuclear RNAs and core proteins catalyzing precise pre-mRNA intron removal.",
      pathophysiologyMechanism: "Forms lariat loop intermediate at branch-point adenine; alternative splicing yields diverse functional protein isoforms.",
      clinicalHallmarks: "Anti-Smith (anti-Sm) autoantibodies against snRNP core proteins are highly specific (>99%) for Systemic Lupus Erythematosus.",
      highYieldPearls: "Anti-Smith antibodies in SLE target snRNP core proteins in the spliceosome; Anti-U1 RNP is seen in Mixed Connective Tissue Disease."
    },
    {
      id: "bioc2-tx-histone-acetylation-euchromatin",
      name: "Histone Acetylation & Chromatin Opening (HAT Euchromatin Activation & Vorinostat HDAC Inhibition)",
      category: "Epigenetic Remodeling",
      subType: "HAT (Histone Acetyltransferase) • HDAC (Histone Deacetylase) • Vorinostat • Active Euchromatin vs Heterochromatin",
      biocProfile: "Enzymatic addition and removal of acetyl groups on basic lysine tails of core histone octamers.",
      pathophysiologyMechanism: "Acetylation neutralizes positive charges on lysine, releasing tightly coiled DNA into transcriptionally accessible euchromatin.",
      clinicalHallmarks: "HDAC inhibitors (Vorinostat, Romidepsin) reactivate epigenetically silenced tumor suppressor genes in CTCL.",
      highYieldPearls: "Histone Acetylation creates open transcriptionally active Euchromatin; DNA Methylation at CpG islands silences genes."
    },
    {
      id: "bioc2-tx-post-tx-cap-polyadenylation",
      name: "Post-Transcriptional mRNA Capping & Tailing (5' m7G Cap & 3' AAUAAA Polyadenylation Stability)",
      category: "mRNA Maturation",
      subType: "5' 7-Methylguanosine (m7G) Cap • 3' AAUAAA Signal • Poly(A) Polymerase (~200 As) • eIF4E Binding & Stability",
      biocProfile: "Co-transcriptional and post-transcriptional chemical modifications essential for eukaryotic mRNA translation and longevity.",
      pathophysiologyMechanism: "The 5' cap protects against 5' exonucleases and recruits eIF4E; poly(A) tail governs cytoplasmic half-life and nuclear export.",
      clinicalHallmarks: "Aberrant polyadenylation signals impair mRNA stability and cause hereditary thalassemias and metabolic deficiencies.",
      highYieldPearls: "5' Cap uses 7-methylguanosine (m7G); 3' Polyadenylation occurs downstream of the AAUAAA consensus sequence."
    }
  ],

  translation: [
    {
      id: "bioc2-tl-diphtheria-toxin-eef2",
      name: "Bacterial Elongation Inactivation (Diphtheria Toxin & Pseudomonas Exotoxin A eEF-2 ADP-Ribosylation)",
      category: "Translational Toxins",
      subType: "eEF-2 (Elongation Factor 2) • Diphthamide Residue • NAD+ Cofactor • Pseudomembranous Pharyngitis & Myocarditis",
      biocProfile: "Enzymatic ADP-ribosylation and irreversible blockade of ribosomal translocation during peptide chain elongation.",
      pathophysiologyMechanism: "Covalent addition of ADP-ribose to diphthamide on eEF-2 permanently arrests host ribosomal protein synthesis.",
      clinicalHallmarks: "Leathery gray pseudomembranous pharyngitis, 'bull neck' cervical adenopathy, lethal toxic myocarditis, and cranial neuropathies.",
      highYieldPearls: "Diphtheria toxin and Pseudomonas Exotoxin A halt protein synthesis by ADP-ribosylating Eukaryotic Elongation Factor 2 (eEF-2)."
    },
    {
      id: "bioc2-tl-ubiquitin-proteasome-bortezomib",
      name: "Ubiquitin-Proteasome Degradation Cascade (E3 Ligase Polyubiquitination & Bortezomib 26S Proteasome Inhibition)",
      category: "Proteolysis System",
      subType: "E1 Activating -> E2 Conjugating -> E3 Ligase -> Polyubiquitin K48 -> 26S Proteasome -> Bortezomib",
      biocProfile: "Principal ATP-dependent pathway for targeted degradation of damaged, misfolded, and regulatory cellular proteins.",
      pathophysiologyMechanism: "E3 ligases confer substrate specificity, linking ubiquitin chains to lysine-48; proteasome degradation clears toxic proteins.",
      clinicalHallmarks: "Proteasome inhibitors (Bortezomib, Carfilzomib) induce fatal proteotoxic stress and apoptosis in Multiple Myeloma plasma cells.",
      highYieldPearls: "The E3 ubiquitin ligase provides substrate specificity; Bortezomib inhibits the 26S proteasome to treat Multiple Myeloma."
    },
    {
      id: "bioc2-tl-genetic-code-degeneracy-wobble",
      name: "Genetic Code Wobble Degeneracy (Crick Wobble Hypothesis & Silent Synonymous Mutations)",
      category: "Codon Architecture",
      subType: "61 Sense Codons for 20 Amino Acids • 3' Codon / 5' Anticodon Wobble • AUG Start (Met) • UAA/UAG/UGA Stop",
      biocProfile: "Non-overlapping, commaless triplet codon system dictating polypeptide sequence from open reading frames.",
      pathophysiologyMechanism: "Degeneracy at the 3rd codon position allows non-standard base pairing (G-U, I-U/C/A), cushioning against point mutations.",
      clinicalHallmarks: "Third-base transition mutations are frequently silent; non-synonymous mutations cause single amino acid substitutions (HbS).",
      highYieldPearls: "The genetic code is degenerate (redundant); start codon is AUG (Methionine); stop codons are UAA, UAG, UGA."
    },
    {
      id: "bioc2-tl-prion-conformational-conversion",
      name: "Prion Protein Conformational Conversion (Alpha-Helical PrPC to Protease-Resistant Beta-Sheet PrPSc CJD)",
      category: "Protein Folding Disease",
      subType: "Normal PrPC (alpha-helix) -> PrPSc (beta-sheet rich) • Proteinase K Resistance • Creutzfeldt-Jakob Disease",
      biocProfile: "Template-directed conformational change of normal host prion protein into pathological insoluble oligomers.",
      pathophysiologyMechanism: "PrPSc acts as an infectious template, recruiting and refolding native PrPC into neurotoxic beta-sheet amyloid fibrils.",
      clinicalHallmarks: "Rapidly progressive dementia, startle-induced myoclonus, ataxia, 14-3-3 protein in CSF, periodic sharp wave complexes on EEG.",
      highYieldPearls: "Prion disease involves post-translational conversion of alpha-helical PrPC into protease-resistant beta-sheet PrPSc (CJD)."
    }
  ],

  molecular: [
    {
      id: "bioc2-mol-crispr-cas9-gene-editing",
      name: "CRISPR-Cas9 Targeted Genome Editing (sgRNA-Cas9 Endonuclease, PAM 5'-NGG-3' & Casgevy HbF Reactivation)",
      category: "Gene Editing",
      subType: "Cas9 Endonuclease • Single-Guide RNA (sgRNA) • 5'-NGG-3' PAM • NHEJ Knockout vs HDR Knock-in • Casgevy",
      biocProfile: "Precision RNA-guided bacterial endonuclease system adapted for targeted human genomic sequence modification.",
      pathophysiologyMechanism: "sgRNA directs Cas9 to introduce a double-strand break adjacent to PAM; NHEJ disrupts the BCL11A erythroid enhancer.",
      clinicalHallmarks: "Exagamglogene autotemcel (Casgevy) cures Sickle Cell Disease and beta-Thalassemia by elevating fetal hemoglobin (HbF).",
      highYieldPearls: "CRISPR-Cas9 requires a single-guide RNA and a 5'-NGG-3' PAM motif; Casgevy disrupts BCL11A to restore fetal hemoglobin."
    },
    {
      id: "bioc2-mol-snow-drop-blotting-matrix",
      name: "Molecular Blotting Matrix SNOW DROP (Southern DNA, Northern RNA & Western Protein Hybridizations)",
      category: "Blotting Diagnostics",
      subType: "SNOW DROP • Southern (DNA) • Northern (mRNA Expression) • Western (Protein / Antibodies) • Southwestern",
      biocProfile: "Electrophoretic separation and membrane hybridization techniques for macromolecular analyte detection.",
      pathophysiologyMechanism: "Uses labeled complementary oligonucleotides or specific antibodies to quantify nucleic acid or protein abundance.",
      clinicalHallmarks: "Southern blot detects restriction fragment length polymorphisms; Western blot confirms HIV/Lyme disease serologies.",
      highYieldPearls: "SNOW DROP: Southern = DNA, Northern = RNA, Western = Protein; Southwestern blot detects DNA-binding proteins."
    },
    {
      id: "bioc2-mol-pcr-kinetics-amplification",
      name: "Polymerase Chain Reaction PCR Amplification (Thermal Cycling Denaturation, Annealing & Taq Extension)",
      category: "Nucleic Acid Amplification",
      subType: "Denaturation 95°C • Annealing 55°C • Extension 72°C (Taq Polymerase) • Exponential 2^n Amplification",
      biocProfile: "Automated in vitro enzymatic method for exponential amplification of specific target DNA sequences.",
      pathophysiologyMechanism: "Repeated thermal cycling enables sequence-specific oligonucleotide primers to direct thermostable Taq DNA polymerase.",
      clinicalHallmarks: "RT-qPCR quantifies viral loads (HIV, HCV, SARS-CoV-2); multiplex PCR detects respiratory and gastrointestinal pathogens.",
      highYieldPearls: "PCR steps: Denaturation (95°C), Annealing (55°C), Extension (72°C); yields 2^n copies after n cycles."
    },
    {
      id: "bioc2-mol-sanger-vs-ngs-sequencing",
      name: "Sanger Dideoxy Chain Termination (ddNTP 3'-OH Lack & Next-Generation Massively Parallel Sequencing)",
      category: "DNA Sequencing",
      subType: "2',3'-Dideoxynucleotides (ddNTPs) Lacking 3'-OH • Chain Termination • Next-Generation Sequencing (NGS)",
      biocProfile: "Nucleotide sequencing technologies resolving exact base order across single genes or entire genomes.",
      pathophysiologyMechanism: "Incorporation of a fluorescent ddNTP lacks a 3'-OH group, terminating further phosphodiester bond formation.",
      clinicalHallmarks: "NGS enables comprehensive oncology panels, whole-exome sequencing for undiagnosed pediatric genetic disorders.",
      highYieldPearls: "Sanger sequencing uses chain-terminating ddNTPs lacking a 3'-OH group; NGS provides high-throughput massively parallel sequencing."
    }
  ]
};

interface ClinicalBiochemistry2LabViewerProps {
  initialMode?: Biochemistry2LabMode;
  height?: string;
  onNodeSelect?: (node: Biochemistry2LabNode) => void;
}

export default function ClinicalBiochemistry2LabViewer({
  initialMode = "repair",
  height = "560px",
  onNodeSelect,
}: ClinicalBiochemistry2LabViewerProps) {
  const [activeMode, setActiveMode] = useState<Biochemistry2LabMode>(initialMode);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [quizTargetNodeId, setQuizTargetNodeId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentNodes = useMemo(() => {
    return BIOCHEMISTRY2_LAB_NODES[activeMode] || BIOCHEMISTRY2_LAB_NODES.repair;
  }, [activeMode]);

  const activeNode = useMemo(() => {
    return currentNodes.find((n) => n.id === activeNodeId) || currentNodes[0];
  }, [currentNodes, activeNodeId]);

  const handleNodeClick = (node: Biochemistry2LabNode) => {
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
            <Dna size={14} /> BIOC-102
          </span>
          <span className={styles.titleText}>
            {activeMode === "repair" && "DNA Replication, Repair & Telomerase: NER (XP), BER, MMR (Lynch) & BRCA1/2 (HR)"}
            {activeMode === "transcription" && "Transcription & Splicing: RNA Pol I/II/III (alpha-Amanitin), HATs & snRNPs (SLE)"}
            {activeMode === "translation" && "Translation & Chaperones: Genetic Code, Diphtheria Toxin (eEF-2), Proteasome & Prions"}
            {activeMode === "molecular" && "Molecular Diagnostics & CRISPR: PCR Kinetics, Blotting (SNOW DROP) & CRISPR-Cas9 (PAM)"}
          </span>
        </div>

        <div className={styles.controlsBar}>
          <button
            className={`${styles.btn} ${styles.btnQuiz} ${isQuizMode ? styles.btnActive : ""}`}
            onClick={toggleQuizMode}
          >
            <HelpCircle size={15} /> {isQuizMode ? "Exit Challenge" : "Biochemistry Diagnostic Quiz"}
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
                  Biochemistry Challenge • Score: {quizScore.correct} / {quizScore.total}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Identify Molecular Entity / Pathway: {quizTargetNode.clinicalHallmarks}
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

          {/* Mode 1: DNA Repair Mechanisms */}
          {activeMode === "repair" && (
            <div className={styles.biocCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Dna size={14} /> DNA Repair Pathways &amp; Clinical Cancer Syndromes
                </span>
                <span className="text-[11px] text-slate-400">NER (XP) &bull; MMR (Lynch) &bull; HR (BRCA1/2) &bull; BER</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Nucleotide Excision Repair (NER) &amp; XP</div>
                  <div className="text-slate-300 mt-1">Endonucleases excise bulky UV-induced pyrimidine (thymine-thymine) dimers during G1 phase. Autosomal recessive defect causes Xeroderma Pigmentosum with severe photosensitivity, freckling, and high cutaneous melanoma/SCC risk.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Mismatch Repair (MMR) &amp; Lynch Syndrome</div>
                  <div className="text-slate-300 mt-1">MSH2, MLH1, MSH6, and PMS2 recognize post-replication mismatches in S/G2 phase. Mutation causes Lynch syndrome (HNPCC) characterized by high microsatellite instability (MSI-H) and right-sided colon / endometrial cancers.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Transcription, Epigenetics & Splicing */}
          {activeMode === "transcription" && (
            <div className={styles.biocCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={14} /> Transcription, Epigenetics &amp; Spliceosome Architecture
                </span>
                <span className="text-[11px] text-slate-400">RNA Pol II (alpha-Amanitin) &bull; snRNPs (SLE) &bull; HATs/HDACs</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">RNA Pol II &amp; alpha-Amanitin Toxicity</div>
                  <div className="text-slate-300 mt-1">RNA Pol II synthesizes mRNA and is selectively poisoned by alpha-Amanitin from the Death Cap mushroom (Amanita phalloides), halting hepatocyte transcription and triggering fulminant hepatic necrosis.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Spliceosome snRNPs &amp; Anti-Smith Antibodies</div>
                  <div className="text-slate-300 mt-1">snRNPs (U1, U2, U4, U5, U6) catalyze pre-mRNA intron excision via lariat loop intermediates. Anti-Smith (anti-Sm) autoantibodies targeting snRNP core proteins are highly specific (&gt;99%) for Systemic Lupus Erythematosus.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Translation, Genetic Code & Chaperones */}
          {activeMode === "translation" && (
            <div className={styles.biocCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> Translational Machinery, Toxins &amp; Proteolysis
                </span>
                <span className="text-[11px] text-slate-400">Diphtheria (eEF-2) &bull; Bortezomib (Proteasome) &bull; Prions (PrPSc)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Diphtheria &amp; Pseudomonas Toxins</div>
                  <div className="text-slate-300 mt-1">Diphtheria toxin and Pseudomonas Exotoxin A catalyze ADP-ribosylation and irreversible inactivation of Eukaryotic Elongation Factor 2 (eEF-2), completely arresting host ribosomal protein synthesis and causing tissue necrosis.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">Ubiquitin-Proteasome &amp; Bortezomib</div>
                  <div className="text-slate-300 mt-1">E1-&gt;E2-&gt;E3 cascade polyubiquitinates target proteins for 26S proteasomal degradation. Bortezomib pharmacologically inhibits the 26S proteasome, triggering proteotoxic stress and apoptosis in Multiple Myeloma plasma cells.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Molecular Diagnostics & CRISPR */}
          {activeMode === "molecular" && (
            <div className={styles.biocCard}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TestTube size={14} /> Molecular Diagnostics &amp; CRISPR-Cas9 Gene Editing
                </span>
                <span className="text-[11px] text-slate-400">CRISPR-Cas9 (PAM) &bull; SNOW DROP Blotting &bull; PCR &bull; Sanger ddNTP</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">CRISPR-Cas9 &amp; Casgevy Therapy</div>
                  <div className="text-slate-300 mt-1">Single-guide RNA directs Cas9 endonuclease to introduce double-strand breaks adjacent to the 5'-NGG-3' PAM sequence. NHEJ disruption of the BCL11A enhancer derepresses gamma-globin transcription, restoring fetal hemoglobin (HbF) in sickle cell.</div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="text-purple-300 font-bold">SNOW DROP Molecular Blotting Matrix</div>
                  <div className="text-slate-300 mt-1">Southern blot detects DNA; Northern blot detects RNA (gene expression); Western blot detects Protein (antibodies); Southwestern blot detects DNA-binding proteins (transcription factors).</div>
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
                    <span className="text-purple-400 font-bold">Bioc:</span> {node.biocProfile}
                  </div>

                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span>Inspect Molecular Mechanism</span>
                    <ArrowRight size={12} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-Yield Molecular Biochemistry Inspector */}
        <div className={styles.sidebarPanel}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Molecular Inspector
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
              {activeNode.category}
            </span>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🔬 Molecular Entity / Pathway</div>
            <div className="text-xs font-bold text-white">{activeNode.name}</div>
            <div className={styles.inspectorBody}>{activeNode.subType}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>🧬 Biochemical Profile &amp; Reaction</div>
            <div className="text-xs text-purple-300 font-semibold">{activeNode.biocProfile}</div>
            <div className={styles.inspectorBody}>{activeNode.pathophysiologyMechanism}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>📋 Clinical Hallmarks &amp; Diagnostics</div>
            <div className={styles.inspectorBody}>{activeNode.clinicalHallmarks}</div>
          </div>

          <div className={styles.inspectorCard}>
            <div className={styles.inspectorLabel}>💡 Gold Standard Molecular Pearls</div>
            <div className={styles.inspectorBody}>{activeNode.highYieldPearls}</div>
          </div>
        </div>
      </div>

      {/* Bottom Mode Switcher Tabs */}
      <div className={styles.modeSelectorGrid}>
        <button
          onClick={() => setActiveMode("repair")}
          className={`${styles.modeTab} ${activeMode === "repair" ? styles.modeTabActive : ""}`}
        >
          ⚡ 1. DNA Repair &amp; Telomerase
        </button>
        <button
          onClick={() => setActiveMode("transcription")}
          className={`${styles.modeTab} ${activeMode === "transcription" ? styles.modeTabActive : ""}`}
        >
          🔄 2. Transcription &amp; Splicing
        </button>
        <button
          onClick={() => setActiveMode("translation")}
          className={`${styles.modeTab} ${activeMode === "translation" ? styles.modeTabActive : ""}`}
        >
          ⚙️ 3. Translation &amp; Proteasome
        </button>
        <button
          onClick={() => setActiveMode("molecular")}
          className={`${styles.modeTab} ${activeMode === "molecular" ? styles.modeTabActive : ""}`}
        >
          🧪 4. Diagnostics &amp; CRISPR
        </button>
      </div>
    </div>
  );
}
