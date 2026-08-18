/**
 * Mental Status Examination (MSE), Major Depressive Disorder & SIGECAPS Learning Content
 * Authoritative medical content derived from Kaplan & Sadock, Stahl, DSM-5-TR, and USMLE Step 2 CK Psychiatry.
 * Mapped to NMC CBME Competencies: PS1.1, PS1.2, PS2.1, PS3.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const MENTAL_STATE_EXAM_AFFECTIVE_MODULE: PhysiologyLessonModule = {
  id: "psych-mse-affective",
  unitCode: "PS1.1",
  title: "Psychiatry: Mental Status Examination (MSE), Major Depressive Disorder (SIGECAPS) & Subtypes",
  competencies: ["PS1.1", "PS1.2", "PS2.1", "PS3.1"],
  estimatedMinutes: 145,
  organ3dTarget: "NEURAL",
  markdownContent: `
# Psychiatry: Mental Status Examination (MSE), Major Depressive Disorder (SIGECAPS) & Subtypes

The Mental Status Examination (MSE) is the psychiatric equivalent of the physical examination, providing an objective cross-sectional assessment of a patient\'s psychological functioning.

---

## 1. Components of the Mental Status Examination (MSE)

| MSE Domain | Key Clinical Features & Observations | Pathological Phenomena |
| :--- | :--- | :--- |
| **Appearance & Behavior** | Grooming, hygiene, attire, psychomotor agitation (pacing, hand-wringing) or retardation (slowed movements, poverty of movement), eye contact. | Catatonia (waxy flexibility, stupor, catalepsy); self-neglect in severe depression/schizophrenia. |
| **Speech** | Rate, volume, articulation, rhythm, latency. | • **Pressured Speech**: Rapid, loud, continuous, difficult to interrupt (Mania).<br>• **Poverty of Speech (Alogia)**: Monosyllabic, minimal output (Depression, Schizophrenia). |
| **Mood vs Affect** | • **Mood**: *Subjective*, sustained emotional state reported by the patient in their own words (e.g. "depressed", "anxious", "euphoric", "angry").<br>• **Affect**: *Objective*, observable outward manifestation of emotion assessed by the clinician. | • **Incongruent Affect**: Smiling while describing a tragic bereavement.<br>• **Blunted / Flat Affect**: Severe reduction in emotional expression.<br>• **Labile Affect**: Rapid, abrupt shifts from weeping to laughter. |
| **Thought Process (Form)** | The organization, continuity, and flow of ideas. | • **Circumstantiality**: Over-inclusion of trivial details, but **eventually reaches the original goal**.<br>• **Tangentiality**: Wanders off-topic and **never returns to the original point**.<br>• **Flight of Ideas**: Continuous flow of accelerated speech with rapid shifts from topic to topic based on tenuous associations or puns (Mania).<br>• **Loose Associations (Derailment)**: Breakdown in logical connections between sentences.<br>• **Word Salad (Schizophasia)**: Incomprehensible jumble of words. |
| **Thought Content** | What the patient is actually thinking about. | • **Delusion**: Fixed, false belief not amenable to reason or cultural norms.<br>• **Delusions of Reference**: Belief that random television broadcasts or headlines refer specifically to the patient.<br>• **Cotard Delusion**: Nihilistic belief that one is dead or putrefying.<br>• **Capgras Delusion**: Belief that a familiar loved one has been replaced by an identical imposter.<br>• **Suicidal / Homicidal Ideation**: Active intent and plan. |
| **Perception** | Sensory awareness of stimuli. | • **Hallucination**: Sensory perception in the absence of an external stimulus (**Auditory 2nd/3rd person** in Schizophrenia; **Visual** in Delirium/Lewy body; **Olfactory** in Temporal Lobe Epilepsy; **Hypnagogic** on falling asleep; **Hypnopompic** on waking).<br>• **Illusion**: Misinterpretation of an actual real external stimulus (e.g. shadow seen as an intruder). |
| **Insight & Judgment** | Awareness of illness (Grades 1-6) and capacity to make sound, realistic decisions. | Grade 1 (Complete denial of illness) $\\rightarrow$ Grade 6 (True emotional insight with willingness to adhere to therapy). |

---

## 2. Major Depressive Disorder (MDD): DSM-5-TR Diagnostic Criteria

$$\\text{Diagnostic Rule}: \\ge 5 \\text{ of 9 SIGECAPS symptoms present for } \\ge 2 \\text{ consecutive weeks}$$
*(Must include at least 1 cardinal symptom: **Depressed Mood** OR **Anhedonia**)*

| SIGECAPS Mnemonic | Diagnostic Criterion & Clinical Presentation |
| :--- | :--- |
| **S: Sleep Disturbance** | Insomnia (frequently **Early Morning Awakening / Terminal Insomnia**) OR Hypersomnia. |
| **I: Interest Loss (Anhedonia)** | Marked loss of pleasure or interest in all or almost all daily activities (**Cardinal Symptom**). |
| **G: Guilt / Worthlessness** | Excessive, irrational feelings of worthlessness or inappropriate guilt (e.g., believing a family misfortune is their fault). |
| **E: Energy Loss** | Pervasive fatigue, exhaustion, and lethargy nearly every day. |
| **C: Concentration Loss** | Decreased ability to think, make decisions, or maintain focus; memory complaints (**Pseudodementia**). |
| **A: Appetite / Weight Change** | Significant weight loss ($> 5\\%\\text{ in a month}$) and anorexia OR increased appetite and carbohydrate cravings. |
| **P: Psychomotor Changes** | Observable psychomotor retardation (slow speech and movement) OR psychomotor agitation (inability to sit still). |
| **S: Suicidal Ideation** | Recurrent thoughts of death, passive suicidal ideation, or specific suicide attempt/plan. |

---

## 3. Clinical Depressive Subtypes & Targeted Therapeutics

- **Atypical Depression**:
  - Hallmark: **Mood Reactivity** (mood brightens in response to positive potential events) PLUS $\ge 2$ features:
    1. **Leaden Paralysis** (heavy, lead-like feeling in arms/legs),
    2. **Hypersomnia** ($> 10\\text{ hours/day}$),
    3. **Hyperphagia / Weight Gain**,
    4. **Long-standing Interpersonal Rejection Sensitivity**.
  - 1st-Line Therapy: **SSRIs (Sertraline, Escitalopram)**; historically most responsive to **Monoamine Oxidase Inhibitors (MAOIs)**.
- **Melancholic Depression**:
  - Severe, non-reactive depression with profound anhedonia, early morning awakening, marked psychomotor retardation/agitation, anorexia/weight loss, and excessive guilt; highly responsive to **Electroconvulsive Therapy (ECT)** and SNRIs/TCAs.
- **Psychotic Depression**:
  - MDD accompanied by mood-congruent delusions (guilt, poverty, somatic decay); requires combination of **Antidepressant $+$ Atypical Antipsychotic** OR immediate **Electroconvulsive Therapy (ECT)** (gold standard in elderly / catatonic patients).
`,
  clinicalVignettes: [
    {
      scenario: "A 45-year-old male presents with a 6-week history of profound sadness, lack of interest in his hobbies, and fatigue. He wakes up at 3:30 AM every morning and is unable to fall back asleep. He has lost 6 kg without dieting and expresses intense, irrational guilt, believing that his company's recent quarterly loss was entirely his fault. When interviewed, he speaks with long latency and shows significant psychomotor retardation. He admits to thoughts that 'his family would be better off without him.' He has never had a period of elevated or irritable mood, and laboratory tests (including TSH and B12) are normal.",
      question: "Which of the following is the diagnosis, and which first-line pharmacotherapeutic class is indicated?",
      options: [
        "Major Depressive Disorder with Melancholic features; Selective Serotonin Reuptake Inhibitors (SSRIs)",
        "Bipolar II Disorder; Lithium Carbonate monotherapy",
        "Persistent Depressive Disorder (Dysthymia); Monoamine Oxidase Inhibitors (MAOIs)",
        "Adjustment Disorder with Depressed Mood; Benzodiazepine monotherapy"
      ],
      correctAnswerIndex: 0,
      explanation: "A patient presenting with >2 weeks of depressed mood, severe anhedonia, early morning awakening (terminal insomnia), anorexia with significant weight loss, inappropriate excessive guilt, psychomotor retardation, and suicidal ideation meets full DSM-5-TR criteria for Major Depressive Disorder (MDD) with melancholic features. First-line medical therapy consists of Selective Serotonin Reuptake Inhibitors (SSRIs like Sertraline or Escitalopram) combined with psychotherapy (CBT)."
    }
  ]
};
