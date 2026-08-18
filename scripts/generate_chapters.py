import os
import json

chapters = [
    {
        "id": "section4-hemodynamics",
        "title": "Hemodynamics",
        "topic": "Principles of Blood Flow and Pressure"
    },
    {
        "id": "section4-ecg",
        "title": "Electrocardiogram",
        "topic": "ECG leads, waves, and intervals"
    },
    {
        "id": "section4-cardiac-output",
        "title": "Cardiac Output",
        "topic": "Determinants of Cardiac Output"
    },
    {
        "id": "section4-bp-regulation",
        "title": "Blood Pressure Regulation",
        "topic": "Short-term and long-term regulation of BP"
    },
    {
        "id": "section4-coronary-circulation",
        "title": "Coronary Circulation",
        "topic": "Blood flow to the heart muscle"
    },
    {
        "id": "section5-gas-exchange",
        "title": "Gas Exchange",
        "topic": "Diffusion of gases across the respiratory membrane"
    },
    {
        "id": "section5-gas-transport",
        "title": "O2 and CO2 Transport",
        "topic": "Transport mechanisms of oxygen and carbon dioxide"
    },
    {
        "id": "section5-breathing-regulation",
        "title": "Regulation of Breathing",
        "topic": "Neural and chemical control of ventilation"
    },
    {
        "id": "section5-high-altitude",
        "title": "High Altitude Physiology",
        "topic": "Acclimatization and physiological changes at altitude"
    },
    {
        "id": "section5-pft",
        "title": "Pulmonary Function Tests",
        "topic": "Lung volumes, capacities, and spirometry"
    }
]

template = """# {title}

### 1. Introduction
This chapter covers the physiological principles of {topic}. It is essential for understanding how the body maintains balance and adapts to stress.

### 2. Daily Life Analogy
Think of this system like a city's water supply. The pump (heart) must generate enough pressure to overcome the resistance of the pipes (vessels) to deliver water (blood) to all houses (organs).

### 3. Basic Concept
The fundamental concept revolves around the interaction between flow, pressure, and resistance.

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
$ Flow = \\frac{{\\Delta P}}{{R}} $

### 14. Mnemonics
Remember ABC: Airway, Breathing, Circulation.

### 15. Viva Questions
1. What are the primary determinants of {topic}?
2. How does the body compensate for acute failure in this system?

### 16. MCQs
1. Which of the following best describes {topic}?
   - A) Constant variable
   - B) Dynamic equilibrium
   - C) Static state
   - D) Irreversible process
   *Answer: B*

### 17. Case-Based Learning
A 45-year-old patient presents with symptoms related to {topic} dysfunction. 

Based on the presentation, what is the most appropriate first step in management?
- Administer IV fluids immediately (Correct! Initial stabilization is crucial.)
- Prescribe antibiotics and discharge (Incorrect.)
- Wait for laboratory results (Incorrect.)

### 18. Flashcards
- **Front**: What is the primary function of this system?
- **Back**: To maintain homeostasis related to {topic}.
- **Front**: What is the key formula?
- **Back**: Flow = Pressure / Resistance

### 19. Revision Notes
- Key Point 1: Flow is directly proportional to pressure.
- Key Point 2: Resistance is inversely proportional to radius to the 4th power.

### 20. Practice Quiz
<quiz-placeholder />
"""

os.makedirs("f:/Physiology-app/docs/curriculum", exist_ok=True)

for chapter in chapters:
    filename = f"f:/Physiology-app/docs/curriculum/{chapter['id']}.md"
    content = template.format(title=chapter['title'], topic=chapter['topic'])
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Created {filename}")

# Also, update curriculum.ts to include these new chapters
ts_file = "f:/Physiology-app/frontend/config/curriculum.ts"

with open(ts_file, 'r', encoding='utf-8') as f:
    ts_content = f.read()

# We need to insert the chapters into their respective sections.
# For simplicity, we'll just log that it needs manual AST insertion or do a string replacement.
# Let's do a simple regex or string insertion.

import re

# Section 4
s4_insertion = """,
      { id: "hemodynamics", title: "Hemodynamics", duration: "45 mins", isCompleted: false, filePath: "section4-hemodynamics.md" },
      { id: "ecg", title: "Electrocardiogram", duration: "60 mins", isCompleted: false, filePath: "section4-ecg.md" },
      { id: "cardiac-output", title: "Cardiac Output", duration: "45 mins", isCompleted: false, filePath: "section4-cardiac-output.md" },
      { id: "bp-regulation", title: "Blood Pressure Regulation", duration: "50 mins", isCompleted: false, filePath: "section4-bp-regulation.md" },
      { id: "coronary-circulation", title: "Coronary Circulation", duration: "30 mins", isCompleted: false, filePath: "section4-coronary-circulation.md" }"""

ts_content = re.sub(r'({ id: "cardiac-cycle",.*?})', r'\1' + s4_insertion, ts_content)

# Section 5
s5_insertion = """,
      { id: "gas-exchange", title: "Gas Exchange", duration: "45 mins", isCompleted: false, filePath: "section5-gas-exchange.md" },
      { id: "gas-transport", title: "O2 and CO2 Transport", duration: "45 mins", isCompleted: false, filePath: "section5-gas-transport.md" },
      { id: "breathing-regulation", title: "Regulation of Breathing", duration: "40 mins", isCompleted: false, filePath: "section5-breathing-regulation.md" },
      { id: "high-altitude", title: "High Altitude Physiology", duration: "30 mins", isCompleted: false, filePath: "section5-high-altitude.md" },
      { id: "pft", title: "Pulmonary Function Tests", duration: "35 mins", isCompleted: false, filePath: "section5-pft.md" }"""

ts_content = re.sub(r'({ id: "respiratory-mechanics",.*?})', r'\1' + s5_insertion, ts_content)

with open(ts_file, 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Updated curriculum.ts")
