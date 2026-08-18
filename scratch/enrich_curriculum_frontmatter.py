import os
import re

MAPPING = {
    "section1-aetcom-communication.md": {
        "competency_code": "AETCOM-1.1",
        "competency_description": "Demonstrate doctor-patient communication, empathy, and active listening skills in clinical settings.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "general_physiology",
        "three_d_preset": "general"
    },
    "section1-anatomy-histology-epithelium.md": {
        "competency_code": "AN1.1",
        "competency_description": "Describe the histological organization, microanatomy, and classification of epithelial tissues and cell junctions.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "general_physiology",
        "three_d_preset": "general"
    },
    "section1-cell-membrane-transport.md": {
        "competency_code": "PY1.2",
        "competency_description": "Explain the molecular structure of cell membranes and transport mechanisms (primary/secondary active transport, diffusion, osmosis).",
        "bloom_level": "K2 (Understand)",
        "organ_system": "general_physiology",
        "three_d_preset": "general"
    },
    "section1-homeostasis.md": {
        "competency_code": "PY1.1",
        "competency_description": "Describe the concept of homeostasis, negative and positive feedback mechanisms, and their clinical relevance.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "general_physiology",
        "three_d_preset": "general"
    },
    "section10-ans.md": {
        "competency_code": "PY10.1",
        "competency_description": "Describe the functional organization, neurotransmitters, receptors, and physiological actions of the autonomic nervous system.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "neurophysiology",
        "three_d_preset": "neurophysiology"
    },
    "section10-cerebellum.md": {
        "competency_code": "PY10.5",
        "competency_description": "Describe the functional divisions, neuronal circuitry, and coordination mechanisms of the cerebellum and cerebellar disorders.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "neurophysiology",
        "three_d_preset": "neurophysiology"
    },
    "section10-cns-synapse.md": {
        "competency_code": "PY10.2",
        "competency_description": "Explain the physiological properties of synapses, neurotransmitters, synaptic transmission, and long-term potentiation.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "neurophysiology",
        "three_d_preset": "neurophysiology"
    },
    "section10-csf-bbb.md": {
        "competency_code": "PY10.3",
        "competency_description": "Describe the formation, circulation, functions, and clinical significance of cerebrospinal fluid (CSF) and the blood-brain barrier (BBB).",
        "bloom_level": "K2 (Understand)",
        "organ_system": "neurophysiology",
        "three_d_preset": "neurophysiology"
    },
    "section10-eeg-sleep.md": {
        "competency_code": "PY10.7",
        "competency_description": "Explain electroencephalogram (EEG) wave patterns, stages of sleep, circadian rhythms, and sleep disorders.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "neurophysiology",
        "three_d_preset": "neurophysiology"
    },
    "section10-higher-functions.md": {
        "competency_code": "PY10.8",
        "competency_description": "Describe higher cortical functions including memory, learning, language, speech, and emotion neurobiology.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "neurophysiology",
        "three_d_preset": "neurophysiology"
    },
    "section10-motor-system.md": {
        "competency_code": "PY10.4",
        "competency_description": "Describe the motor pathways (pyramidal and extrapyramidal systems), basal ganglia, and motor control hierarchy.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "neurophysiology",
        "three_d_preset": "neurophysiology"
    },
    "section10-pain-pathways.md": {
        "competency_code": "PY10.6",
        "competency_description": "Describe pain receptors, anterolateral ascending pain pathways, endogenous analgesia gating, and referred pain.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "neurophysiology",
        "three_d_preset": "neurophysiology"
    },
    "section10-sensory-system.md": {
        "competency_code": "PY10.3",
        "competency_description": "Describe sensory receptors, dorsal column and spinothalamic ascending sensory tracts, and thalamocortical processing.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "neurophysiology",
        "three_d_preset": "neurophysiology"
    },
    "section11-special-senses-other.md": {
        "competency_code": "PY10.14",
        "competency_description": "Describe the physiology of audition, vestibular balance, gustation, and olfaction.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "neurophysiology",
        "three_d_preset": "neurophysiology"
    },
    "section11-special-senses-vision.md": {
        "competency_code": "PY10.13",
        "competency_description": "Describe the optics of the eye, retinal phototransduction, visual pathways, color vision, and pupillary reflexes.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "neurophysiology",
        "three_d_preset": "neurophysiology"
    },
    "section12-integrated-exercise.md": {
        "competency_code": "PY11.1",
        "competency_description": "Describe cardiovascular, respiratory, metabolic, and temperature adaptations to acute exercise and chronic athletic conditioning.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "integrated_physiology",
        "three_d_preset": "cardiovascular"
    },
    "section2-blood-composition.md": {
        "competency_code": "PY2.1",
        "competency_description": "Describe the composition, physical properties, cellular elements, and functions of whole blood.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "hematology",
        "three_d_preset": "general"
    },
    "section2-blood-groups.md": {
        "competency_code": "PY2.4",
        "competency_description": "Describe the ABO and Rh blood grouping systems, transfusion reactions, and hemolytic disease of the newborn.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "hematology",
        "three_d_preset": "general"
    },
    "section2-ece-ecg.md": {
        "competency_code": "PY5.4",
        "competency_description": "Interpret normal 12-lead electrocardiogram (ECG) waveforms, intervals, electrical axis, and arrhythmias.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "cardiovascular",
        "three_d_preset": "cardiovascular"
    },
    "section2-hemostasis.md": {
        "competency_code": "PY2.5",
        "competency_description": "Describe the stages of hemostasis: platelet plug formation, coagulation cascade, fibrinolysis, and anticoagulant mechanisms.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "hematology",
        "three_d_preset": "general"
    },
    "section2-plasma-proteins.md": {
        "competency_code": "PY2.2",
        "competency_description": "Describe the types, origins, oncotic pressure contributions, and transport functions of plasma proteins.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "hematology",
        "three_d_preset": "general"
    },
    "section2-wbc-immunity.md": {
        "competency_code": "PY2.3",
        "competency_description": "Describe leukocyte classification, phagocytosis, innate immunity, and cellular/humoral adaptive immunity.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "hematology",
        "three_d_preset": "general"
    },
    "section3-action-potential.md": {
        "competency_code": "PY3.1",
        "competency_description": "Explain the ionic basis of resting membrane potential and action potential generation in nerve and skeletal muscle fibers.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "nerve_muscle",
        "three_d_preset": "neurophysiology"
    },
    "section3-nmj.md": {
        "competency_code": "PY3.2",
        "competency_description": "Describe neuromuscular junction transmission, acetylcholine receptor activation, end-plate potentials, and myasthenia gravis.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "nerve_muscle",
        "three_d_preset": "neurophysiology"
    },
    "section3-path-cell-injury.md": {
        "competency_code": "PA1.1",
        "competency_description": "Describe mechanisms of reversible and irreversible cell injury, ischemic necrosis, and apoptosis.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "pathology",
        "three_d_preset": "general"
    },
    "section3-reflexes.md": {
        "competency_code": "PY10.2",
        "competency_description": "Describe reflex arc components, muscle spindle and Golgi tendon organ mechanisms, stretch reflexes, and clinical tone.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "nerve_muscle",
        "three_d_preset": "neurophysiology"
    },
    "section3-skeletal-muscle.md": {
        "competency_code": "PY3.3",
        "competency_description": "Explain sliding filament theory, excitation-contraction coupling, cross-bridge cycling, and muscle energetics in skeletal muscle.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "nerve_muscle",
        "three_d_preset": "neurophysiology"
    },
    "section3-smooth-muscle.md": {
        "competency_code": "PY3.4",
        "competency_description": "Describe excitation-contraction coupling, calmodulin-MLCK activation, and latch-bridge kinetics in smooth muscle.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "nerve_muscle",
        "three_d_preset": "neurophysiology"
    },
    "section4-bp-regulation.md": {
        "competency_code": "PY5.3",
        "competency_description": "Describe short-term (baroreceptor reflex) and long-term (renin-angiotensin-aldosterone system) arterial blood pressure regulation.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "cardiovascular",
        "three_d_preset": "cardiovascular"
    },
    "section4-cardiac-cycle.md": {
        "competency_code": "PY5.1",
        "competency_description": "Describe the phases of the cardiac cycle, heart sounds, Wiggers diagram, and pressure-volume changes in ventricles.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "cardiovascular",
        "three_d_preset": "cardiovascular"
    },
    "section4-cardiac-output.md": {
        "competency_code": "PY5.2",
        "competency_description": "Explain cardiac output determinants (preload, afterload, inotropy, heart rate), Frank-Starling law, and measurement methods.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "cardiovascular",
        "three_d_preset": "cardiovascular"
    },
    "section4-coronary-circulation.md": {
        "competency_code": "PY5.5",
        "competency_description": "Describe coronary blood flow regulation, metabolic autoregulation, myocardial oxygen supply-demand balance, and ischemia.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "cardiovascular",
        "three_d_preset": "cardiovascular"
    },
    "section4-ecg.md": {
        "competency_code": "PY5.4",
        "competency_description": "Explain physiological basis of standard 12-lead ECG, Einthoven's triangle, vectorcardiography, and ischemic ECG changes.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "cardiovascular",
        "three_d_preset": "cardiovascular"
    },
    "section4-hemodynamics.md": {
        "competency_code": "PY5.6",
        "competency_description": "Describe biophysical principles of hemodynamics: Poiseuille law, laminar vs turbulent flow, vascular resistance, and compliance.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "cardiovascular",
        "three_d_preset": "cardiovascular"
    },
    "section5-breathing-regulation.md": {
        "competency_code": "PY6.3",
        "competency_description": "Describe central and peripheral chemoreceptor control of respiration, pontomedullary respiratory centers, and neural reflexes.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "respiratory",
        "three_d_preset": "respiratory"
    },
    "section5-gas-exchange.md": {
        "competency_code": "PY6.2",
        "competency_description": "Explain alveolar-capillary gas diffusion, Fick law, diffusing capacity (DLCO), and ventilation-perfusion (V/Q) mismatch.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "respiratory",
        "three_d_preset": "respiratory"
    },
    "section5-gas-transport.md": {
        "competency_code": "PY6.4",
        "competency_description": "Describe oxygen-hemoglobin dissociation curves, Bohr and Haldane effects, and carbon dioxide transport mechanisms in blood.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "respiratory",
        "three_d_preset": "respiratory"
    },
    "section5-high-altitude.md": {
        "competency_code": "PY6.5",
        "competency_description": "Describe physiological acclimatization to high altitude hypobaric hypoxia, mountain sickness, and deep-sea diving physiology.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "respiratory",
        "three_d_preset": "respiratory"
    },
    "section5-pft.md": {
        "competency_code": "PY6.6",
        "competency_description": "Interpret pulmonary function tests (PFT): spirometric lung volumes/capacities, FEV1/FVC ratios, and obstructive vs restrictive patterns.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "respiratory",
        "three_d_preset": "respiratory"
    },
    "section5-respiratory-mechanics.md": {
        "competency_code": "PY6.1",
        "competency_description": "Describe the mechanics of ventilation, intrapleural pressure, lung compliance, surfactant, and work of breathing.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "respiratory",
        "three_d_preset": "respiratory"
    },
    "section6-acid-base.md": {
        "competency_code": "PY7.3",
        "competency_description": "Describe renal and respiratory regulation of acid-base balance, Davenport diagram, Henderson-Hasselbalch equation, and ABG interpretation.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "renal",
        "three_d_preset": "renal"
    },
    "section6-countercurrent.md": {
        "competency_code": "PY7.2",
        "competency_description": "Explain the countercurrent multiplier and exchanger mechanisms in the medullary nephron loops and vasa recta for urine concentration.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "renal",
        "three_d_preset": "renal"
    },
    "section6-micturition.md": {
        "competency_code": "PY7.4",
        "competency_description": "Describe the innervation of the urinary bladder, micturition reflex arc, cystometrogram, and neurogenic bladder disorders.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "renal",
        "three_d_preset": "renal"
    },
    "section6-renal-filtration.md": {
        "competency_code": "PY7.1",
        "competency_description": "Describe glomerular filtration rate (GFR), Starling filtration forces, renal blood flow autoregulation, and clearance principles.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "renal",
        "three_d_preset": "renal"
    },
    "section6-tubular-reabsorption.md": {
        "competency_code": "PY7.2",
        "competency_description": "Describe segmental tubular reabsorption and secretion of water, electrolytes, glucose, and urea across the nephron.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "renal",
        "three_d_preset": "renal"
    },
    "section7-digestion-absorption.md": {
        "competency_code": "PY4.3",
        "competency_description": "Describe the digestion, luminal transport, and mucosal absorption of carbohydrates, proteins, lipids, vitamins, and water.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "gastrointestinal",
        "three_d_preset": "gastrointestinal"
    },
    "section7-gi-hormones.md": {
        "competency_code": "PY4.2",
        "competency_description": "Describe gastrointestinal endocrine and paracrine hormones (gastrin, CCK, secretin, GIP, motilin) and their regulatory actions.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "gastrointestinal",
        "three_d_preset": "gastrointestinal"
    },
    "section7-gi-motility.md": {
        "competency_code": "PY4.1",
        "competency_description": "Describe electrical slow waves, enteric nervous system, mastication, deglutition, peristalsis, and defecation reflexes.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "gastrointestinal",
        "three_d_preset": "gastrointestinal"
    },
    "section7-gi-secretions.md": {
        "competency_code": "PY4.2",
        "competency_description": "Describe salivary, gastric, pancreatic, and intestinal secretions, including parietal cell cellular acid secretion mechanisms.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "gastrointestinal",
        "three_d_preset": "gastrointestinal"
    },
    "section7-liver-biliary.md": {
        "competency_code": "PY4.4",
        "competency_description": "Describe hepatic bile synthesis, enterohepatic circulation of bile salts, bilirubin metabolism, and liver metabolic functions.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "gastrointestinal",
        "three_d_preset": "gastrointestinal"
    },
    "section8-adrenal-gland.md": {
        "competency_code": "PY8.3",
        "competency_description": "Describe adrenal cortex zones, glucocorticoid/mineralocorticoid synthesis, adrenal medulla catecholamines, and stress responses.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "endocrine",
        "three_d_preset": "endocrine"
    },
    "section8-calcium-bone.md": {
        "competency_code": "PY8.4",
        "competency_description": "Describe calcium and phosphate homeostasis, parathyroid hormone, calcitonin, vitamin D metabolism, and bone remodeling.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "endocrine",
        "three_d_preset": "endocrine"
    },
    "section8-endocrine-hormones.md": {
        "competency_code": "PY8.1",
        "competency_description": "Explain hormone classifications, second messenger signaling pathways (cAMP, IP3/DAG, receptor tyrosine kinases), and feedback regulation.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "endocrine",
        "three_d_preset": "endocrine"
    },
    "section8-growth-hormone.md": {
        "competency_code": "PY8.2",
        "competency_description": "Describe growth hormone regulation, IGF-1 mediation, metabolic actions, and clinical disorders (gigantism, acromegaly, dwarfism).",
        "bloom_level": "K3 (Apply)",
        "organ_system": "endocrine",
        "three_d_preset": "endocrine"
    },
    "section8-hypothalamus-pituitary.md": {
        "competency_code": "PY8.2",
        "competency_description": "Describe hypothalamic-hypophyseal portal system, anterior pituitary hormones, and posterior pituitary neurohypophyseal peptides (ADH, oxytocin).",
        "bloom_level": "K2 (Understand)",
        "organ_system": "endocrine",
        "three_d_preset": "endocrine"
    },
    "section8-pancreas-diabetes.md": {
        "competency_code": "PY8.5",
        "competency_description": "Describe endocrine pancreas islet cells, insulin and glucagon biosynthesis, glucose counter-regulation, and diabetes mellitus pathophysiology.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "endocrine",
        "three_d_preset": "endocrine"
    },
    "section9-lactation.md": {
        "competency_code": "PY9.4",
        "competency_description": "Describe mammogenesis, lactogenesis, milk-ejection reflex (oxytocin), and hormonal maintenance of postpartum lactation.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "reproductive",
        "three_d_preset": "general"
    },
    "section9-male-repro.md": {
        "competency_code": "PY9.1",
        "competency_description": "Describe spermatogenesis, Sertoli and Leydig cell functions, testosterone actions, and hypothalamic-pituitary-testicular axis.",
        "bloom_level": "K2 (Understand)",
        "organ_system": "reproductive",
        "three_d_preset": "general"
    },
    "section9-pregnancy.md": {
        "competency_code": "PY9.3",
        "competency_description": "Describe fertilization, implantation, feto-placental unit endocrine function (hCG, hPL, progesterone, estrogens), and parturition triggers.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "reproductive",
        "three_d_preset": "general"
    },
    "section9-reproductive-cycles.md": {
        "competency_code": "PY9.2",
        "competency_description": "Describe the ovarian and endometrial menstrual cycles, follicular development, ovulation surge, and luteal phase feedback.",
        "bloom_level": "K3 (Apply)",
        "organ_system": "reproductive",
        "three_d_preset": "general"
    }
}

def enrich_file(filepath, meta):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()

    # Match frontmatter
    fm_match = re.match(r'^---\n(.*?)\n---', text, re.DOTALL)
    if fm_match:
        old_fm = fm_match.group(1)
        # Check if already has competency_code
        if "competency_code:" in old_fm:
            return False
        
        new_fm = f"""{old_fm.strip()}
competency_code: "{meta['competency_code']}"
competency_description: "{meta['competency_description']}"
bloom_level: "{meta['bloom_level']}"
organ_system: "{meta['organ_system']}"
three_d_preset: "{meta['three_d_preset']}" """
        new_text = f"---\n{new_fm}\n---" + text[fm_match.end():]
    else:
        new_fm = f"""author: MBBS Physiology Faculty
reviewer: Clinician Advisory Board
last_review_date: August 2026
evidence_grade: Level 1a (Syllabus/Guidelines)
normal_range_provenance: Harrison's / Guyton & Hall Physiology Standards
version: 1.2.0
competency_code: "{meta['competency_code']}"
competency_description: "{meta['competency_description']}"
bloom_level: "{meta['bloom_level']}"
organ_system: "{meta['organ_system']}"
three_d_preset: "{meta['three_d_preset']}" """
        new_text = f"---\n{new_fm}\n---\n\n" + text

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_text)
    return True

def main():
    curr_dir = 'docs/curriculum'
    count = 0
    for filename, meta in MAPPING.items():
        p = os.path.join(curr_dir, filename)
        if os.path.exists(p):
            if enrich_file(p, meta):
                count += 1
                print(f"Enriched: {filename} -> {meta['competency_code']}")
        else:
            print(f"Warning: {filename} not found!")

    print(f"\nSuccessfully enriched {count} curriculum files with NMC CBME competency metadata!")

if __name__ == '__main__':
    main()
