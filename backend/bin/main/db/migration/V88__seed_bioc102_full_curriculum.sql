-- V88: Seed Medical Biochemistry II & Molecular Genetics (BIOC-102) Full Curriculum

-- Ensure Subject: BIOC-102 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('e3f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7a8b', 'c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f', 'BIOC-102', 'Medical Biochemistry II & Molecular Genetics', 'PRE_CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: DNA Replication, Repair Pathways & Telomerase Dynamics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa520001-0000-0000-0000-000000000001', 'e3f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7a8b', 'DNA Replication, Repair Pathways & Telomerase Dynamics', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa520002-0000-0000-0000-000000000001', 'fa520001-0000-0000-0000-000000000001', 'Nucleotide Excision Repair (NER) & Xeroderma Pigmentosum Endonucleases', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa520003-0000-0000-0000-000000000001', 'fa520002-0000-0000-0000-000000000001', 'Mismatch Repair (MMR) MSH2/MLH1 & Lynch Syndrome Microsatellite Instability', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa520004-0000-0000-0000-000000000001', 'fa520003-0000-0000-0000-000000000001', 'Homologous Recombination BRCA1/2, PARP Inhibitors & Telomerase TERT Overhangs', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa520005-0000-0000-0000-000000000001', 'fa520004-0000-0000-0000-000000000001', 'Pyrimidine Dimer Excision Endonucleases, Post-Replication Slippage Correctors, Synthetic Lethality, and TTAGGG Telomeric Additions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa520006-0000-0000-0000-000000000001', 'fa520005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### DNA Replication & Repair Pathways\n\nNucleotide Excision Repair (NER): Endonucleases excise UV-induced thymine dimers in G1 phase; defect causes Xeroderma Pigmentosum. Mismatch Repair (MMR): MSH2/MLH1 repair mismatches in S/G2 phase; defect causes Lynch syndrome (HNPCC) with microsatellite instability (MSI-H). Homologous Recombination (HR): BRCA1/2 repair double-strand breaks error-free using sister chromatids; targeted with PARP inhibitors (Olaparib) via synthetic lethality. Telomerase: TERT adds TTAGGG repeats to chromosome ends in stem/cancer cells."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Transcription, Epigenetic Regulation & RNA Splicing
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa520001-0000-0000-0000-000000000002', 'e3f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7a8b', 'Transcription, Epigenetic Regulation & RNA Splicing', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa520002-0000-0000-0000-000000000002', 'fa520001-0000-0000-0000-000000000002', 'RNA Polymerases (I/II/III) & alpha-Amanitin Death Cap Hepatotoxicity', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa520003-0000-0000-0000-000000000002', 'fa520002-0000-0000-0000-000000000002', 'Spliceosome snRNPs & Anti-Smith Autoantibodies in Systemic Lupus Erythematosus', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa520004-0000-0000-0000-000000000002', 'fa520003-0000-0000-0000-000000000002', 'Histone Acetylation (HAT/HDAC), 5-Methylcytosine Methylation & mRNA Capping/Tailing', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa520005-0000-0000-0000-000000000002', 'fa520004-0000-0000-0000-000000000002', 'Mesencephalic Mushroom Toxins, Small Nuclear Ribonucleoprotein Intron Lariats, Euchromatin Decondensations, and 7-Methylguanosine Caps', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa520006-0000-0000-0000-000000000002', 'fa520005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Transcription & Splicing\n\nRNA Polymerase II: Synthesizes mRNA and is selectively poisoned by alpha-Amanitin from Amanita phalloides death cap mushrooms, causing fulminant hepatic failure. Spliceosome: snRNPs (U1-U6) excise pre-mRNA introns; Anti-Smith (anti-Sm) autoantibodies against snRNP core proteins are highly specific (>99%) for SLE. Epigenetics: Histone Acetyltransferases (HATs) relax chromatin into Euchromatin; Vorinostat inhibits HDACs. 5'' Cap (m7G) and 3'' poly(A) tail (AAUAAA) stabilize mature mRNA."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Translation, Genetic Code, Protein Folding & Chaperones
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa520001-0000-0000-0000-000000000003', 'e3f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7a8b', 'Translation, Genetic Code, Protein Folding & Chaperones', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa520002-0000-0000-0000-000000000003', 'fa520001-0000-0000-0000-000000000003', 'Genetic Code Degeneracy, Wobble Hypothesis & AUG Start/Stop Codons', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa520003-0000-0000-0000-000000000003', 'fa520002-0000-0000-0000-000000000003', 'Bacterial Toxins: Diphtheria Toxin & Pseudomonas Exotoxin A eEF-2 ADP-Ribosylation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa520004-0000-0000-0000-000000000003', 'fa520003-0000-0000-0000-000000000003', 'Molecular Chaperones (HSP70/90), Ubiquitin-Proteasome System & Prion PrPSc Pathology', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa520005-0000-0000-0000-000000000003', 'fa520004-0000-0000-0000-000000000003', 'Synonymous Third-Base Tolerances, Diphthamide Modifications, Proteasomal Degradation Cascades, and Beta-Sheet Fibrillogeneses', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa520006-0000-0000-0000-000000000003', 'fa520005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Translation & Chaperones\n\nGenetic Code: Degenerate/redundant with wobble base pairing; AUG start codon (Methionine); UAA/UAG/UGA stop codons. Toxins: Diphtheria toxin and Pseudomonas Exotoxin A ADP-ribosylate and inactivate Eukaryotic Elongation Factor 2 (eEF-2), halting protein synthesis. Proteasome: E1->E2->E3 polyubiquitinates lysine-48 for 26S proteasome degradation; inhibited by Bortezomib in multiple myeloma. Prions: Alpha-helical PrPC converts into insoluble, protease-resistant beta-sheet PrPSc (CJD)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Molecular Diagnostics, Recombinant DNA & CRISPR Gene Editing
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa520001-0000-0000-0000-000000000004', 'e3f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7a8b', 'Molecular Diagnostics, Recombinant DNA & CRISPR Gene Editing', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa520002-0000-0000-0000-000000000004', 'fa520001-0000-0000-0000-000000000004', 'Polymerase Chain Reaction (PCR) Kinetics & Quantitative RT-qPCR', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa520003-0000-0000-0000-000000000004', 'fa520002-0000-0000-0000-000000000004', 'Blotting Techniques (SNOW DROP: Southern DNA, Northern RNA, Western Protein)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa520004-0000-0000-0000-000000000004', 'fa520003-0000-0000-0000-000000000004', 'Sanger Dideoxy Sequencing, Next-Generation Sequencing & CRISPR-Cas9 (PAM)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa520005-0000-0000-0000-000000000004', 'fa520004-0000-0000-0000-000000000004', 'Thermal Cycling Exponential Gains, Nitrocellulose Hybridizations, Chain-Terminating ddNTPs, and Guide-RNA Protospacer Targetings', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa520006-0000-0000-0000-000000000004', 'fa520005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Molecular Diagnostics & CRISPR\n\nPCR: Denaturation (95°C), Annealing (55°C), Extension (72°C Taq); yields 2^n copies. Blotting (SNOW DROP): Southern = DNA, Northern = RNA, Western = Protein, Southwestern = DNA-binding proteins. Sanger Sequencing: Uses chain-terminating ddNTPs lacking 3''-OH. CRISPR-Cas9: sgRNA directs Cas9 endonuclease to introduce double-strand breaks adjacent to 5''-NGG-3'' PAM; Casgevy disrupts BCL11A enhancer to elevate fetal hemoglobin (HbF) in sickle cell disease."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
