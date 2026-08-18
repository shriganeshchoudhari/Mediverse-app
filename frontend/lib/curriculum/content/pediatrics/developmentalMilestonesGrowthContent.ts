/**
 * Developmental Milestones, Growth Velocity & Pediatric Anthropometry Learning Content
 * Authoritative medical content derived from Nelson Pediatrics, Ghai Pediatrics, CDC/AAP Milestones, and USMLE Step 2 CK Pediatrics.
 * Mapped to NMC CBME Competencies: PE1.1, PE1.2, PE1.3, PE2.1, PE2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const DEVELOPMENTAL_MILESTONES_GROWTH_MODULE: PhysiologyLessonModule = {
  id: "ped-milestones-growth",
  unitCode: "PE1.1",
  title: "Pediatrics: Developmental Milestones (Gross/Fine Motor, Language, Social) & Growth Velocity",
  competencies: ["PE1.1", "PE1.2", "PE1.3", "PE2.1", "PE2.2"],
  estimatedMinutes: 140,
  organ3dTarget: "GENERAL",
  markdownContent: `
# Pediatrics: Developmental Milestones (Gross/Fine Motor, Language, Social) & Growth Velocity

Child development proceeds in a cephalocaudal and proximodistal sequence across 4 interconnected functional domains: Gross Motor, Fine Motor/Adaptive, Language, and Social/Emotional.

---

## 1. Developmental Milestones Matrix by Chronological Age

| Age | Gross Motor Domain | Fine Motor / Adaptive Domain | Language & Hearing Domain | Social & Emotional Domain |
| :--- | :--- | :--- | :--- | :--- |
| **2 Months** | Lifts head $45^\\circ$ prone; head lag decreases | Hands unfisted $50\\%$ of time; follows past midline | Coos, vocalizes musical vowel sounds | **Social Smile** (responds to face/voice) |
| **4 Months** | **No head lag** when pulled to sit; rolls prone to supine | Reaches for objects with both hands (bidextrous); hands to mouth | Laughs aloud, squeals | Enjoys social interaction |
| **6 Months** | **Sits with support (tripod)**; rolls supine to prone | Transfers objects from hand to hand; **Palmar grasp** | Monosyllabic babbling (*"ba"*, *"da"*, *"ma"*) | Recognizes familiar faces; stranger awareness |
| **9 Months** | **Sits unsupported**; crawls / creeps; pulls to stand | **Immature / Crude Pincer Grasp** (pads of fingers) | Bisyllabic babbling (*"mama"*, *"dada"* non-specific) | **Stranger Anxiety**; waves bye-bye; peek-a-boo |
| **12 Months** | **Walks with one hand held / first independent steps** | **Fine / Neat Pincer Grasp** (tips of thumb & index); releases into cup | **First true word with meaning** (*"Mama"* specific); follows 1-step command | Claps hands (pat-a-cake); imitates actions |
| **15 Months** | Walks well independently; creeps up stairs | Tower of 2 cubes; scribbles spontaneously | Vocabulary of 4–6 words | Uses spoon with spilling; indicates wants |
| **18 Months** | Runs stiffly; walks up stairs with hand held | Tower of 3–4 cubes; turns 2–3 book pages at a time | Vocabulary of 10–25 words; names 1 body part | Uses spoon and cup well; removes shoes/socks |
| **2 Years** | **Walks up/down stairs 2 feet per step**; kicks a ball | **Tower of 6 cubes**; copies vertical line ($|$) | **2-word phrases** (*"want milk"*); $50\\%$ understood by strangers | **Parallel Play**; verbalizes toilet needs |
| **3 Years** | **Rides a tricycle**; walks upstairs alternating feet | **Tower of 9–10 cubes**; **copies a circle ($\\bigcirc$)**; snips with scissors | **3-word sentences**; uses pronouns (*"I"*, *"you"*); $75\\%$ understood | **Group / Cooperative Play**; shares toys; puts on shoes |
| **4 Years** | **Hops on one foot**; walks downstairs alternating feet | **Copies a cross ($+$) and square ($\\square$)**; uses safety scissors | **4-word complex sentences**; tells stories; $100\\%$ understood | Role play; imaginary friends; dresses independently |
| **5 Years** | Skips alternating feet; catches a bounced ball | **Copies a triangle ($\\triangle$)**; ties shoelaces; draws 6-part person | Fluent conversation; knows colors, numbers, alphabet | Follows rules in games; comforts others in distress |

---

## 2. Geometric Shape Copying Age Progression (High-Yield USMLE / NMC)

$$\\text{Vertical Line } (|) \\rightarrow 2\\text{ Years} \\quad | \\quad \\text{Circle } (\\bigcirc) \\rightarrow 3\\text{ Years} \\quad | \\quad \\text{Cross } (+) \\text{ and Square } (\\square) \\rightarrow 4\\text{ Years} \\quad | \\quad \\text{Triangle } (\\triangle) \\rightarrow 5\\text{ Years}$$

$$\\text{Cube Tower Rule}: \\text{Number of Cubes} = \\text{Age in Years} \\times 3 \\quad (\\text{e.g. 2 years } = 6\\text{ cubes; } 3\\text{ years } = 9\\text{ cubes})$$

---

## 3. Pediatric Anthropometry & Growth Rules of Thumb

1. **Body Weight**:
   - Initial physiological weight loss: Up to $10\\%$ of birth weight lost in first 3–5 days (regained by day 10–14).
   - **Doubles** birth weight by **$5\\text{ months}$**.
   - **Triples** birth weight by **$1\\text{ year}$** ($10\\text{ kg}$).
   - **Quadruples** birth weight by **$2\\text{ years}$** ($12\\text{ kg}$).
   - Formula for age 1–6 years: $\\text{Weight (kg)} = (\\text{Age in years} \\times 2) + 8$.
2. **Body Height / Length**:
   - Average birth length: **$50\\text{ cm}$**.
   - Reaches **$75\\text{ cm}$** at **$1\\text{ year}$** ($25\\text{ cm}$ growth in year 1).
   - **Doubles** birth length (**$100\\text{ cm}$**) at **$4\\text{ years}$**.
   - **Triples** birth length (**$150\\text{ cm}$**) at **$12\\text{ years}$**.
3. **Head Circumference (HC)**:
   - Average birth HC: **$35\\text{ cm}$** (larger than chest circumference at birth).
   - Reaches **$45\\text{ cm}$** at **$1\\text{ year}$** ($12\\text{ cm}$ increase in year 1).
   - Chest circumference equals Head circumference at **$1\\text{ year}$** of age.
4. **Fontanelle Closure**:
   - **Posterior Fontanelle**: Closes by **$2\\text{ to } 3\\text{ months}$**.
   - **Anterior Fontanelle**: Closes by **$9\\text{ to } 18\\text{ months}$** (average 14 months). Delayed closure in Rickets, Hypothyroidism, Hydrocephalus, Trisomy 21.
`,
  clinicalVignettes: [
    {
      scenario: "A mother brings her 3-year-old son to the pediatric clinic for a well-child checkup. On developmental evaluation, the child rides a tricycle smoothly, walks upstairs with alternating feet, and stacks a tower of 9 wooden blocks. When given a sheet of paper and a crayon, he easily copies a drawn circle. He speaks in 3-word sentences and asks to play with other children in the waiting room.",
      question: "Which of the following drawing milestones is this child expected to master next at approximately 4 years of age?",
      options: [
        "Copying a Cross (+) and Square",
        "Copying a Triangle",
        "Copying a Diamond",
        "Copying a Vertical line only"
      ],
      correctAnswerIndex: 0,
      explanation: "Developmental progression of shape copying follows a strict chronological order: Vertical line at 2 years -> Circle at 3 years -> Cross (+) and Square at 4 years -> Triangle at 5 years -> Diamond at 6-7 years. Since the 3-year-old child can currently copy a circle, the next expected fine motor drawing milestone at 4 years of age is copying a cross (+) and a square."
    }
  ]
};
