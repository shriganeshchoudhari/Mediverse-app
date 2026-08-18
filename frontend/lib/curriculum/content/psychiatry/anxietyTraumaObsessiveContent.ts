/**
 * Anxiety Disorders, Panic, Obsessive-Compulsive Disorder & PTSD Learning Content
 * Authoritative medical content derived from Kaplan & Sadock, Stahl, DSM-5-TR, and USMLE Step 2 CK Psychiatry.
 * Mapped to NMC CBME Competencies: PS8.1, PS8.2, PS9.1, PS10.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ANXIETY_TRAUMA_OBSESSIVE_MODULE: PhysiologyLessonModule = {
  id: "psych-anxiety-trauma-ocd",
  unitCode: "PS8.1",
  title: "Psychiatry: Anxiety Disorders (Panic, GAD), OCD (ERP) & PTSD (Prazosin)",
  competencies: ["PS8.1", "PS8.2", "PS9.1", "PS10.1"],
  estimatedMinutes: 140,
  organ3dTarget: "NEURAL",
  markdownContent: `
# Psychiatry: Anxiety Disorders (Panic, GAD), OCD (ERP) & PTSD (Prazosin)

Anxiety, obsessive-compulsive, and trauma-related disorders are characterized by hyperactive fear circuitry (amygdala) and maladaptive coping behaviors.

---

## 1. Anxiety Disorders: Panic Disorder & Generalized Anxiety Disorder (GAD)

| Feature / Criterion | Panic Disorder | Generalized Anxiety Disorder (GAD) |
| :--- | :--- | :--- |
| **Core Symptomatology** | Recurrent, unexpected **Panic Attacks** (abrupt surge of intense fear peaking within minutes: palpitations, diaphoresis, chest pain, choking sensation, fear of dying / "going crazy"). | Excessive, uncontrollable, persistent worry about multiple everyday domains (finances, health, family, work) for **$\\ge 6\\text{ months}$**. |
| **Associated Behavioral Changes** | $\\ge 1\\text{ month}$ of persistent worry about future attacks (**Anticipatory Anxiety**) or maladaptive avoidance behavior $\\pm$ **Agoraphobia** (fear of open spaces, crowds, public transport where escape might be difficult). | $\\ge 3$ of 6 somatic symptoms: Restlessness/feeling keyed up, easy fatigue, difficulty concentrating, irritability, **Muscle Tension**, and sleep disturbance. |
| **Acute Pharmacotherapy** | Short-acting **Benzodiazepines (Alprazolam, Lorazepam)** for rapid panic abortive therapy *(avoid long-term due to tolerance/dependence!)*. | Not typically recommended; short-term hydroxyzine or low-dose benzodiazepines only if crisis. |
| **Maintenance Therapy** | **1st-Line: SSRIs (Sertraline, Paroxetine, Escitalopram) / SNRIs (Venlafaxine)** combined with **Cognitive Behavioral Therapy (CBT)**. | **1st-Line: SSRIs / SNRIs** $+$ **Buspirone (5-HT1A receptor partial agonist)** $+$ CBT. |

---

## 2. Obsessive-Compulsive Disorder (OCD)

- **Pathophysiology**: Cortico-striato-thalamo-cortical (**CSTC**) hyperactive loop dysfunction.
- **DSM-5-TR Core Components**:
  1. **Obsessions**: Recurrent, persistent, intrusive, unwanted thoughts, urges, or images causing marked anxiety or distress (e.g. fear of contamination, doubts about locking doors, aggressive intrusive thoughts).
  2. **Compulsions**: Repetitive behaviors (e.g. handwashing, ordering, checking) or mental acts (e.g. praying, counting) that the individual feels driven to perform to neutralize the anxiety or prevent a dreaded event.
  - Egocentrism: Typically **Ego-Dystonic** (patient recognizes the thoughts/behaviors as excessive and irrational).
- **Guideline-Directed Management**:
  - **Psychotherapy**: **Exposure and Response Prevention (ERP) Cognitive Behavioral Therapy** (the gold standard non-pharmacological treatment).
  - **Pharmacotherapy**: **High-Dose SSRIs** (e.g. Fluoxetine $60-80\\text{ mg/day}$, Sertraline $200\\text{ mg/day}$) 1st-line.
  - **2nd-Line / Treatment-Refractory**: **Clomipramine (Tricyclic Antidepressant / Non-selective Serotonin Reuptake Inhibitor)** or augmentation with atypical antipsychotics (Aripiprazole, Risperidone).

---

## 3. Trauma-Related Disorders: Acute Stress Disorder (ASD) vs PTSD

$$\\text{Diagnostic Timing Threshold}: \\text{ASD } (3\\text{ days to } 1\\text{ month}) \\iff \\text{PTSD } (> 1\\text{ month})$$

- **Common Trigger**: Exposure to actual or threatened death, serious injury, or sexual violence (direct exposure, witnessing, or learning of severe trauma to a loved one).
- **Core Symptom Clusters (The 4 Pillars)**:
  1. **Intrusion Symptoms**: Distressing recurrent intrusive memories, nightmares, and **Dissociative Flashbacks** (feeling as if the event were recurring).
  2. **Avoidance Behaviors**: Persistent avoidance of trauma-related internal memories/feelings or external reminders (places, people, conversations).
  3. **Negative Alterations in Cognition & Mood**: Inability to remember key aspects of trauma (dissociative amnesia), persistent negative beliefs about oneself ("I am bad", "No one can be trusted"), emotional detachment / numbing, anhedonia.
  4. **Hyperarousal & Reactivity**: Irritability, hypervigilance, exaggerated startle response, reckless behavior, insomnia.
- **Targeted Evidence-Based Therapy**:
  - **Trauma-Focused Psychotherapy**: Prolonged Exposure Therapy, Cognitive Processing Therapy, and **Eye Movement Desensitization and Reprocessing (EMDR)**.
  - **Pharmacotherapy**:
    - **1st-Line Maintenance**: **SSRIs (Sertraline, Paroxetine) / SNRIs (Venlafaxine)**.
    - **Trauma-Related Nightmares & PTSD Insomnia**: **Prazosin (Central Alpha-1 Adrenergic Receptor Antagonist)** crosses the blood-brain barrier to reduce hyperadrenergic sleep disruption.
`,
  clinicalVignettes: [
    {
      scenario: "A 30-year-old female combat veteran presents with distressing nightmares and insomnia 3 months after returning from active military deployment. She reports intense emotional distress and palpitations whenever she hears loud fireworks or helicopter sounds, feeling as though she is back in the combat zone. She actively avoids driving near open fields or watching news broadcasts. She reports feeling 'completely numb and detached' from her family and checks the locks on her doors 10 times each night with an exaggerated startle response whenever her spouse enters the room.",
      question: "What is the diagnosis, and which specific medication is indicated to treat her severe recurrent combat-related nightmares?",
      options: [
        "Post-Traumatic Stress Disorder (PTSD); Prazosin (Alpha-1 adrenergic antagonist)",
        "Acute Stress Disorder (ASD); Alprazolam (Benzodiazepine)",
        "Obsessive-Compulsive Disorder (OCD); High-dose Clomipramine",
        "Panic Disorder with Agoraphobia; Propranolol"
      ],
      correctAnswerIndex: 0,
      explanation: "A patient experiencing intrusive nightmares/flashbacks, avoidance behaviors, negative alterations in mood/cognition, and hyperarousal lasting >1 month following severe combat trauma meets full criteria for Post-Traumatic Stress Disorder (PTSD). For severe trauma-related nightmares and sleep disruption, Prazosin (a centrally acting alpha-1 adrenergic receptor antagonist) is the guideline-recommended agent of choice to suppress excessive central noradrenergic arousal during REM sleep."
    }
  ]
};
