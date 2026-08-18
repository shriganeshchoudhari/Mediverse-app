import json
import re

curriculum_ts = """export interface Chapter {
  id: string;
  title: string;
  section: string;
  estimatedMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  filePath: string;
}

export interface Section {
  id: string;
  title: string;
  chapters: Chapter[];
}

export const curriculumCatalog: Section[] = [
  {
    id: "section-1",
    title: "Introduction to Physiology & Cell Physiology",
    chapters: [
      { id: "homeostasis", title: "Homeostasis", section: "SECTION 1", estimatedMinutes: 25, difficulty: "Beginner", filePath: "section1-homeostasis.md" },
      { id: "cell-membrane-transport", title: "Cell Membrane & Transport Mechanisms", section: "SECTION 1", estimatedMinutes: 35, difficulty: "Intermediate", filePath: "section1-cell-membrane-transport.md" }
    ]
  },
  {
    id: "section-2",
    title: "Blood & Immunology",
    chapters: [
      { id: "blood-composition", title: "Blood Composition & Erythrocytes", section: "SECTION 2", estimatedMinutes: 30, difficulty: "Beginner", filePath: "section2-blood-composition.md" },
      { id: "wbc-immunity", title: "WBCs & Immunity", section: "SECTION 2", estimatedMinutes: 45, difficulty: "Intermediate", filePath: "section2-wbc-immunity.md" },
      { id: "hemostasis", title: "Hemostasis & Coagulation", section: "SECTION 2", estimatedMinutes: 40, difficulty: "Advanced", filePath: "section2-hemostasis.md" },
      { id: "blood-groups", title: "Blood Groups & Transfusion", section: "SECTION 2", estimatedMinutes: 25, difficulty: "Intermediate", filePath: "section2-blood-groups.md" },
      { id: "plasma-proteins", title: "Plasma Proteins", section: "SECTION 2", estimatedMinutes: 20, difficulty: "Beginner", filePath: "section2-plasma-proteins.md" }
    ]
  },
  {
    id: "section-3",
    title: "Nerve & Muscle Physiology",
    chapters: [
      { id: "action-potential", title: "Membrane Potentials & Action Potentials", section: "SECTION 3", estimatedMinutes: 35, difficulty: "Intermediate", filePath: "section3-action-potential.md" },
      { id: "nmj", title: "Neuromuscular Junction", section: "SECTION 3", estimatedMinutes: 30, difficulty: "Intermediate", filePath: "section3-nmj.md" },
      { id: "skeletal-muscle", title: "Skeletal Muscle Contraction", section: "SECTION 3", estimatedMinutes: 40, difficulty: "Advanced", filePath: "section3-skeletal-muscle.md" },
      { id: "smooth-muscle", title: "Smooth Muscle", section: "SECTION 3", estimatedMinutes: 25, difficulty: "Beginner", filePath: "section3-smooth-muscle.md" },
      { id: "reflexes", title: "Spinal Reflexes", section: "SECTION 3", estimatedMinutes: 35, difficulty: "Intermediate", filePath: "section3-reflexes.md" }
    ]
  },
  {
    id: "section-4",
    title: "Cardiovascular System",
    chapters: [
      { id: "cardiac-cycle", title: "The Cardiac Cycle & Wiggers Diagram", section: "SECTION 4", estimatedMinutes: 40, difficulty: "Advanced", filePath: "section4-cardiac-cycle.md" },
      { id: "hemodynamics", title: "Hemodynamics", section: "SECTION 4", estimatedMinutes: 45, difficulty: "Advanced", filePath: "section4-hemodynamics.md" },
      { id: "ecg", title: "Electrocardiogram", section: "SECTION 4", estimatedMinutes: 60, difficulty: "Advanced", filePath: "section4-ecg.md" },
      { id: "cardiac-output", title: "Cardiac Output", section: "SECTION 4", estimatedMinutes: 45, difficulty: "Intermediate", filePath: "section4-cardiac-output.md" },
      { id: "bp-regulation", title: "Blood Pressure Regulation", section: "SECTION 4", estimatedMinutes: 50, difficulty: "Advanced", filePath: "section4-bp-regulation.md" },
      { id: "coronary-circulation", title: "Coronary Circulation", section: "SECTION 4", estimatedMinutes: 30, difficulty: "Intermediate", filePath: "section4-coronary-circulation.md" }
    ]
  },
  {
    id: "section-5",
    title: "Respiratory System",
    chapters: [
      { id: "respiratory-mechanics", title: "Mechanics of Ventilation & Spirometry", section: "SECTION 5", estimatedMinutes: 30, difficulty: "Intermediate", filePath: "section5-respiratory-mechanics.md" },
      { id: "gas-exchange", title: "Gas Exchange", section: "SECTION 5", estimatedMinutes: 45, difficulty: "Intermediate", filePath: "section5-gas-exchange.md" },
      { id: "gas-transport", title: "O2 and CO2 Transport", section: "SECTION 5", estimatedMinutes: 45, difficulty: "Intermediate", filePath: "section5-gas-transport.md" },
      { id: "breathing-regulation", title: "Regulation of Breathing", section: "SECTION 5", estimatedMinutes: 40, difficulty: "Advanced", filePath: "section5-breathing-regulation.md" },
      { id: "high-altitude", title: "High Altitude Physiology", section: "SECTION 5", estimatedMinutes: 30, difficulty: "Advanced", filePath: "section5-high-altitude.md" },
      { id: "pft", title: "Pulmonary Function Tests", section: "SECTION 5", estimatedMinutes: 35, difficulty: "Intermediate", filePath: "section5-pft.md" }
    ]
  },
  {
    id: "section-6",
    title: "Renal Physiology",
    chapters: [
      { id: "renal-filtration", title: "Glomerular Filtration Rate (GFR)", section: "SECTION 6", estimatedMinutes: 35, difficulty: "Advanced", filePath: "section6-renal-filtration.md" },
      { id: "tubular-reabsorption", title: "Tubular Reabsorption", section: "SECTION 6", estimatedMinutes: 50, difficulty: "Advanced", filePath: "section6-tubular-reabsorption.md" },
      { id: "countercurrent", title: "Countercurrent Mechanism", section: "SECTION 6", estimatedMinutes: 45, difficulty: "Advanced", filePath: "section6-countercurrent.md" },
      { id: "acid-base", title: "Acid-Base Balance", section: "SECTION 6", estimatedMinutes: 55, difficulty: "Advanced", filePath: "section6-acid-base.md" },
      { id: "micturition", title: "Micturition Reflex", section: "SECTION 6", estimatedMinutes: 20, difficulty: "Beginner", filePath: "section6-micturition.md" }
    ]
  },
  {
    id: "section-7",
    title: "Gastrointestinal Physiology",
    chapters: [
      { id: "gi-motility", title: "GI Motility & Enteric Nervous System", section: "SECTION 7", estimatedMinutes: 30, difficulty: "Intermediate", filePath: "section7-gi-motility.md" },
      { id: "gi-secretions", title: "GI Secretions", section: "SECTION 7", estimatedMinutes: 40, difficulty: "Intermediate", filePath: "section7-gi-secretions.md" },
      { id: "digestion-absorption", title: "Digestion & Absorption", section: "SECTION 7", estimatedMinutes: 35, difficulty: "Beginner", filePath: "section7-digestion-absorption.md" },
      { id: "liver-biliary", title: "Liver & Biliary System", section: "SECTION 7", estimatedMinutes: 30, difficulty: "Intermediate", filePath: "section7-liver-biliary.md" },
      { id: "gi-hormones", title: "GI Hormones", section: "SECTION 7", estimatedMinutes: 25, difficulty: "Advanced", filePath: "section7-gi-hormones.md" }
    ]
  },
  {
    id: "section-8",
    title: "Endocrinology",
    chapters: [
      { id: "endocrine-hormones", title: "Hormone Classes & Mechanisms", section: "SECTION 8", estimatedMinutes: 40, difficulty: "Intermediate", filePath: "section8-endocrine-hormones.md" },
      { id: "hypothalamus-pituitary", title: "Hypothalamus & Pituitary", section: "SECTION 8", estimatedMinutes: 45, difficulty: "Advanced", filePath: "section8-hypothalamus-pituitary.md" },
      { id: "adrenal-gland", title: "Adrenal Gland", section: "SECTION 8", estimatedMinutes: 50, difficulty: "Advanced", filePath: "section8-adrenal-gland.md" },
      { id: "pancreas-diabetes", title: "Pancreas & Diabetes", section: "SECTION 8", estimatedMinutes: 45, difficulty: "Intermediate", filePath: "section8-pancreas-diabetes.md" },
      { id: "calcium-bone", title: "Calcium & Bone Metabolism", section: "SECTION 8", estimatedMinutes: 35, difficulty: "Intermediate", filePath: "section8-calcium-bone.md" },
      { id: "growth-hormone", title: "Growth Hormone", section: "SECTION 8", estimatedMinutes: 30, difficulty: "Intermediate", filePath: "section8-growth-hormone.md" }
    ]
  },
  {
    id: "section-9",
    title: "Reproductive Physiology",
    chapters: [
      { id: "reproductive-cycles", title: "Female Menstrual Cycle", section: "SECTION 9", estimatedMinutes: 45, difficulty: "Advanced", filePath: "section9-reproductive-cycles.md" },
      { id: "male-repro", title: "Male Reproductive System", section: "SECTION 9", estimatedMinutes: 30, difficulty: "Intermediate", filePath: "section9-male-repro.md" },
      { id: "pregnancy", title: "Pregnancy & Placenta", section: "SECTION 9", estimatedMinutes: 35, difficulty: "Advanced", filePath: "section9-pregnancy.md" },
      { id: "lactation", title: "Lactation", section: "SECTION 9", estimatedMinutes: 20, difficulty: "Beginner", filePath: "section9-lactation.md" }
    ]
  },
  {
    id: "section-10",
    title: "Central Nervous System",
    chapters: [
      { id: "cns-synapse", title: "Synaptic Transmission & Neurotransmitters", section: "SECTION 10", estimatedMinutes: 40, difficulty: "Intermediate", filePath: "section10-cns-synapse.md" },
      { id: "motor-system", title: "Motor System", section: "SECTION 10", estimatedMinutes: 50, difficulty: "Advanced", filePath: "section10-motor-system.md" },
      { id: "sensory-system", title: "Sensory System", section: "SECTION 10", estimatedMinutes: 45, difficulty: "Intermediate", filePath: "section10-sensory-system.md" },
      { id: "cerebellum", title: "Cerebellum & Basal Ganglia", section: "SECTION 10", estimatedMinutes: 55, difficulty: "Advanced", filePath: "section10-cerebellum.md" },
      { id: "ans", title: "Autonomic Nervous System", section: "SECTION 10", estimatedMinutes: 40, difficulty: "Intermediate", filePath: "section10-ans.md" },
      { id: "higher-functions", title: "Higher Functions", section: "SECTION 10", estimatedMinutes: 35, difficulty: "Advanced", filePath: "section10-higher-functions.md" },
      { id: "csf-bbb", title: "CSF & Blood-Brain Barrier", section: "SECTION 10", estimatedMinutes: 25, difficulty: "Beginner", filePath: "section10-csf-bbb.md" },
      { id: "eeg-sleep", title: "EEG & Sleep", section: "SECTION 10", estimatedMinutes: 30, difficulty: "Intermediate", filePath: "section10-eeg-sleep.md" },
      { id: "pain-pathways", title: "Pain Pathways", section: "SECTION 10", estimatedMinutes: 45, difficulty: "Advanced", filePath: "section10-pain-pathways.md" }
    ]
  },
  {
    id: "section-11",
    title: "Special Senses",
    chapters: [
      { id: "special-senses-vision", title: "Vision & Phototransduction", section: "SECTION 11", estimatedMinutes: 45, difficulty: "Advanced", filePath: "section11-special-senses-vision.md" }
    ]
  },
  {
    id: "section-12",
    title: "Integrative Physiology",
    chapters: [
      { id: "integrated-exercise", title: "Physiology of Exercise", section: "SECTION 12", estimatedMinutes: 30, difficulty: "Intermediate", filePath: "section12-integrated-exercise.md" }
    ]
  }
];
"""

with open("f:/Physiology-app/frontend/config/curriculum.ts", "w", encoding="utf-8") as f:
    f.write(curriculum_ts)

print("Updated curriculum.ts with all 55 chapters!")
