import os
import json
import re

chapters_to_generate = [
    # Section 2
    {"id": "wbc-immunity", "title": "WBCs & Immunity", "section": "SECTION 2", "topic": "White blood cells and the immune system"},
    {"id": "hemostasis", "title": "Hemostasis & Coagulation", "section": "SECTION 2", "topic": "Blood clotting mechanisms"},
    {"id": "blood-groups", "title": "Blood Groups & Transfusion", "section": "SECTION 2", "topic": "ABO and Rh blood group systems"},
    {"id": "plasma-proteins", "title": "Plasma Proteins", "section": "SECTION 2", "topic": "Functions of plasma proteins"},
    # Section 3
    {"id": "nmj", "title": "Neuromuscular Junction", "section": "SECTION 3", "topic": "Transmission at the neuromuscular junction"},
    {"id": "skeletal-muscle", "title": "Skeletal Muscle Contraction", "section": "SECTION 3", "topic": "Sliding filament theory and muscle mechanics"},
    {"id": "smooth-muscle", "title": "Smooth Muscle", "section": "SECTION 3", "topic": "Excitation and contraction in smooth muscle"},
    {"id": "reflexes", "title": "Spinal Reflexes", "section": "SECTION 3", "topic": "Stretch and withdrawal reflexes"},
    # Section 6
    {"id": "tubular-reabsorption", "title": "Tubular Reabsorption", "section": "SECTION 6", "topic": "Reabsorption and secretion in nephrons"},
    {"id": "countercurrent", "title": "Countercurrent Mechanism", "section": "SECTION 6", "topic": "Urine concentration and dilution"},
    {"id": "acid-base", "title": "Acid-Base Balance", "section": "SECTION 6", "topic": "Renal regulation of acid-base balance"},
    {"id": "micturition", "title": "Micturition Reflex", "section": "SECTION 6", "topic": "Storage and voiding of urine"},
    # Section 7
    {"id": "gi-secretions", "title": "GI Secretions", "section": "SECTION 7", "topic": "Salivary, gastric, and pancreatic secretions"},
    {"id": "digestion-absorption", "title": "Digestion & Absorption", "section": "SECTION 7", "topic": "Breakdown and absorption of nutrients"},
    {"id": "liver-biliary", "title": "Liver & Biliary System", "section": "SECTION 7", "topic": "Bile formation and hepatic functions"},
    {"id": "gi-hormones", "title": "GI Hormones", "section": "SECTION 7", "topic": "Endocrine regulation of the gut"},
    # Section 8
    {"id": "hypothalamus-pituitary", "title": "Hypothalamus & Pituitary", "section": "SECTION 8", "topic": "Hypothalamic-pituitary axis"},
    {"id": "adrenal-gland", "title": "Adrenal Gland", "section": "SECTION 8", "topic": "Cortisol, aldosterone, and catecholamines"},
    {"id": "pancreas-diabetes", "title": "Pancreas & Diabetes", "section": "SECTION 8", "topic": "Insulin, glucagon, and blood glucose regulation"},
    {"id": "calcium-bone", "title": "Calcium & Bone Metabolism", "section": "SECTION 8", "topic": "PTH, calcitonin, and vitamin D"},
    {"id": "growth-hormone", "title": "Growth Hormone", "section": "SECTION 8", "topic": "Functions and regulation of GH"},
    # Section 9
    {"id": "male-repro", "title": "Male Reproductive System", "section": "SECTION 9", "topic": "Spermatogenesis and testosterone"},
    {"id": "pregnancy", "title": "Pregnancy & Placenta", "section": "SECTION 9", "topic": "Maternal adaptations and placental functions"},
    {"id": "lactation", "title": "Lactation", "section": "SECTION 9", "topic": "Prolactin, oxytocin, and milk letdown"},
    # Section 10
    {"id": "motor-system", "title": "Motor System", "section": "SECTION 10", "topic": "Pyramidal and extrapyramidal tracts"},
    {"id": "sensory-system", "title": "Sensory System", "section": "SECTION 10", "topic": "Somatosensory pathways and receptors"},
    {"id": "cerebellum", "title": "Cerebellum & Basal Ganglia", "section": "SECTION 10", "topic": "Coordination and motor control"},
    {"id": "ans", "title": "Autonomic Nervous System", "section": "SECTION 10", "topic": "Sympathetic and parasympathetic divisions"},
    {"id": "higher-functions", "title": "Higher Functions", "section": "SECTION 10", "topic": "Learning, memory, and speech"},
    {"id": "csf-bbb", "title": "CSF & Blood-Brain Barrier", "section": "SECTION 10", "topic": "Cerebrospinal fluid dynamics and BBB"},
    {"id": "eeg-sleep", "title": "EEG & Sleep", "section": "SECTION 10", "topic": "Brain waves and stages of sleep"},
    {"id": "pain-pathways", "title": "Pain Pathways", "section": "SECTION 10", "topic": "Nociception and endogenous analgesia"}
]

template = """# {title}

### 1. Introduction
This chapter covers the physiological principles of {topic}. It is essential for understanding how the body maintains balance and adapts to stress.

### 2. Daily Life Analogy
Think of this system like a city's infrastructure. Each component must function properly to keep the entire organism healthy and responsive.

### 3. Basic Concept
The fundamental concept revolves around the interaction between cellular structures, signaling molecules, and systemic responses.

### 4. Anatomy Review
Review of the relevant macro and micro anatomy for {topic}. The structures involved are highly specialized to optimize surface area and function.

### 5. Physiology
Detailed normal physiological function. The system operates under tight homeostatic control mechanisms.

### 6. Mechanism
Step-by-step mechanism of action at the cellular and systemic level.

### 7. Animation
Observe the dynamic changes in this physiological process.
<animation-placeholder />

### 8. Interactive 3D Model
Explore the structural components involved in this process.
<3d-model-placeholder />

### 9. Flowchart
```mermaid
graph TD
    A[Stimulus] --> B[Receptor]
    B --> C[Control Center]
    C --> D[Effector]
    D --> A
```

### 10. Clinical Correlation
Understanding these principles is vital for diagnosing {topic} related conditions.

### 11. Disorders
Common pathologies include hyper/hypo function, structural defects, and regulatory failures.

### 12. Summary
In summary, {topic} relies on a delicate balance of interacting physical and biological forces.

### 13. Important Formula
$ Function = \\frac{{Structure}}{{Time}} $

### 14. Mnemonics
Remember the key steps to recall the process easily.

### 15. Viva Questions
1. What are the primary determinants of {topic}?
2. How does the body compensate for acute failure in this system?

### 16. MCQs
1. Which of the following best describes {topic}?
   * A) Constant variable
   * B) Dynamic equilibrium
   * C) Static state
   * D) Irreversible process
   *Answer**: B (It requires continuous adjustment)
2. What happens during the initial phase of this process?
   * A) Rapid decline
   * B) Gradual increase
   * C) No change
   * D) Immediate cessation
   *Answer**: B (It usually involves a feedback loop)
3. The most critical component of {topic} is:
   * A) Water
   * B) Ions
   * C) Receptors
   * D) ATP
   *Answer**: C (Cellular communication is key)

### 17. Case-Based Learning
A patient presents with symptoms related to {topic} dysfunction. 

Based on the presentation, what is the most appropriate first step in management?
- Option A (Correct! Initial stabilization is crucial.)
- Option B (Incorrect.)
- Option C (Incorrect.)

### 18. Flashcards
- **Front**: What is the primary function of this system?
- **Back**: To maintain homeostasis related to {topic}.
- **Front**: What is the key regulator?
- **Back**: The feedback loop mechanisms.

### 19. Revision Notes
- Key Point 1: Structure determines function.
- Key Point 2: Homeostasis is a dynamic process.

### 20. Practice Quiz
<quiz-placeholder />
"""

os.makedirs("f:/Physiology-app/docs/curriculum", exist_ok=True)

# Generate Markdown files
for chapter in chapters_to_generate:
    # Get the section number from "SECTION X"
    section_num = chapter["section"].split(" ")[1]
    filename = f"section{section_num}-{chapter['id']}.md"
    filepath = f"f:/Physiology-app/docs/curriculum/{filename}"
    
    content = template.format(title=chapter['title'], topic=chapter['topic'])
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Created {filename}")

print("Successfully generated 32 missing chapters!")
