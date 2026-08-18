/**
 * OSCE Simulation Stations: Cardiovascular Precordial & Cranial Nerve Examinations
 * Authoritative medical content derived from Macleod's Clinical Examination, Talley & O'Connor, Bates, and USMLE Step 2 CS / Step 3 OSCE.
 * Mapped to NMC CBME Competencies: OS1.1, OS1.2, OS2.1, OS2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const OSCE_CARDIOVASCULAR_NEUROLOGICAL_STATIONS_MODULE: PhysiologyLessonModule = {
  id: "osce-cardiovascular-neurological-stations",
  unitCode: "OS1.1",
  title: "OSCE Station: Cardiovascular Precordial Auscultation & Cranial Nerves (II–XII) Systematic Exam",
  competencies: ["OS1.1", "OS1.2", "OS2.1", "OS2.2"],
  estimatedMinutes: 145,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# OSCE Station: Cardiovascular Precordial Auscultation & Cranial Nerves (II–XII) Systematic Exam

Mastery of structured clinical examination checklists with clear examiner rubrics is essential for objective clinical assessment and bedside diagnostic acumen.

---

## 1. OSCE Station 1: Cardiovascular Precordial Examination & Murmurs

### Candidate Instructions & Step-by-Step Checklist
- **Preparation & Introduction**:
  1. Introduce self, verify patient identity, explain procedure, and obtain verbal informed consent.
  2. Position patient supine at **$45^\\circ$ elevation** with chest fully exposed; maintain patient dignity.
  3. Perform hand hygiene.
- **Inspection**:
  - Inspect for surgical scars (median sternotomy, thoracotomy, pacemaker bulge).
  - Inspect for visible precordial pulsations, chest wall deformities (pectus excavatum/carinatum).
- **Palpation**:
  - **Apex Beat**: Palpate in the **5th intercostal space, left mid-clavicular line**. Describe location, character (tapping in MS, heaving in AS/LVH, dyskinetic in LV aneurysm).
  - **Parasternal Heave**: Palpate with heel of hand over left sternal edge (indicates Right Ventricular Hypertrophy).
  - **Thrills**: Palpate with palmar pads of fingers across all 4 valve areas (a thrill is a palpable murmur $\\ge$ Grade 4/6).
- **Auscultation & Dynamic Maneuvers**:
  - Auscultate systematic sequence with **Diaphragm (high-pitch)** and **Bell (low-pitch)**:
    1. **Aortic Area**: 2nd Right ICS parasternal $\\implies$ *Aortic Stenosis* (ejection systolic crescendo-decrescendo radiating to carotids).
    2. **Pulmonic Area**: 2nd Left ICS parasternal $\\implies$ *Pulmonary Stenosis / Regurgitation*.
    3. **Tricuspid Area**: 4th/5th Left ICS parasternal $\\implies$ *Tricuspid Regurgitation* (Carvallo sign: $\\uparrow$ with inspiration).
    4. **Mitral Area (Apex)**: 5th Left ICS mid-clavicular $\\implies$ *Mitral Regurgitation* (holosystolic radiating to left axilla) and *Mitral Stenosis* (low-pitched rumbling mid-diastolic murmur with opening snap, best heard in **left lateral decubitus position with bell** on expiration).
    5. **Erb\'s Point**: 3rd Left ICS parasternal $\\implies$ *Aortic Regurgitation* (early diastolic decrescendo murmur, best heard with **patient sitting forward in full expiration with diaphragm**).

$$\\begin{array}{lcccc}
\\hline
\\textbf{Murmur} & \\textbf{Phase} & \\textbf{Radiation} & \\textbf{Valsalva / Standing} & \\textbf{Squatting / Handgrip} \\\\
\\hline
\\text{Aortic Stenosis (AS)} & \\text{Systolic Cresc-Decresc} & \\text{Carotids} & \\downarrow & \\uparrow \\\\
\\text{Mitral Regurgitation (MR)} & \\text{Holosystolic} & \\text{Left Axilla} & \\downarrow & \\uparrow \\\\
\\textbf{Hypertrophic Cardiomyopathy (HCM)} & \\text{Systolic Ejection} & \\text{None} & \\mathbf{\\uparrow\\uparrow} & \\mathbf{\\downarrow\\downarrow} \\\\
\\textbf{Mitral Valve Prolapse (MVP)} & \\text{Mid-systolic Click} & \\text{None} & \\mathbf{\\text{Earlier click / Longer}} & \\mathbf{\\text{Later click / Shorter}} \\\\
\\hline
\\end{array}$$

---

## 2. OSCE Station 2: Systematic Cranial Nerve Examination (CN II–XII)

| Cranial Nerve | Anatomical Function | Bedside Physical Examination Maneuvers | Pathological Hallmarks & Lesion Localization |
| :--- | :--- | :--- | :--- |
| **CN II (Optic)** | Vision & Afferent Light Reflex. | 1. Visual Acuity (Snellen / Rosenbaum pocket chart).<br>2. Visual Fields (Confrontation test in 4 quadrants).<br>3. **Pupillary Light Reflex** (Direct and consensual response).<br>4. Fundoscopy (Optic disc margins, cupping, papilledema). | **Marcus Gunn Pupil (Relative Afferent Pupillary Defect [RAPD])**: Swinging flashlight test shows paradoxical dilation of affected pupil when light shines into it (optic neuritis). |
| **CN III, IV, VI** | Extraocular Movements. | 1. Trace **"H" pattern** in air $40\\text{ cm}$ from eyes.<br>2. Check for ptosis, nystagmus, diplopia, and strabismus.<br>3. Check convergence and accommodation. | • **CN III Palsy**: "Down and out" eye, severe ptosis, fixed dilated pupil (aneurysmal PCOM compression).<br>• **CN IV Palsy**: Vertical diplopia worse on downgaze and looking inward (compensatory head tilt to opposite shoulder).<br>• **CN VI Palsy**: Inability to abduct eye laterally (horizontal diplopia). |
| **CN V (Trigeminal)** | Facial Sensation & Muscles of Mastication. | 1. Sensory testing with cotton wisp ($V_1, V_2, V_3$).<br>2. **Corneal Reflex** (Afferent: $V_1$; Efferent: CN VII).<br>3. Palpate masseter and temporalis while clenching teeth; check jaw jerk reflex. | Jaw deviates **TOWARD** side of unilateral motor CN V lesion due to pterygoid weakness. |
| **CN VII (Facial)** | Muscles of Facial Expression. | 1. Raise eyebrows / wrinkle forehead.<br>2. Close eyes tightly against resistance.<br>3. Puff out cheeks, smile, show teeth. | **UMN vs LMN Facial Palsy**:<br>• **UMN (Stroke)**: Contralateral lower face weakness with **FOREHEAD SPARING** (bilateral cortical innervation).<br>• **LMN (Bell\'s Palsy)**: Ipsilateral **ENTIRE hemiface paralyzed**, including inability to wrinkle forehead and close eye. |
| **CN VIII (Vestibulocochlear)** | Hearing & Equilibrium. | 1. Whispered voice test ($60\\text{ cm}$).<br>2. **Rinne Test** ($512\\text{ Hz}$ tuning fork on mastoid $\\rightarrow$ in front of ear).<br>3. **Weber Test** (Tuning fork on vertex/forehead). | • **Conductive Loss**: Rinne negative ($BC > AC$) in affected ear; Weber lateralizes to **AFFECTED** ear.<br>• **Sensorineural Loss**: Rinne positive ($AC > BC$); Weber lateralizes to **HEALTHY** ear. |
| **CN IX & X** | Palatal Movement & Swallowing. | 1. Observe palate while saying "Ahhh".<br>2. Assess voice quality (hoarseness / bovine cough).<br>3. Gag reflex (Afferent: CN IX; Efferent: CN X). | In unilateral CN X lesion, the **Uvula deviates AWAY from the affected side** (pulled by intact contralateral levator veli palatini). |
| **CN XI (Accessory)** | SCM & Trapezius. | 1. Shrug shoulders against resistance (Trapezius).<br>2. Turn head against resistance (Sternocleidomastoid). | Turning head to the LEFT tests the **RIGHT SCM**! |
| **CN XII (Hypoglossal)** | Tongue Motility. | 1. Inspect tongue in floor of mouth for fasciculations/atrophy.<br>2. Protrude tongue straight out. | **Tongue deviates TOWARD the side of the lesion** (push of intact genioglossus). |
`,
  clinicalVignettes: [
    {
      scenario: "In an OSCE station, a 70-year-old male presents with exertional syncope and dyspnea. On precordial examination, you palpate a slow-rising carotid pulse (pulsus parvus et tardus) and a sustained heaving apex beat. Auscultation reveals a harsh, crescendo-decrescendo systolic murmur loudest at the 2nd right intercostal space that radiates bilaterally into the carotid arteries. S2 is soft and single.",
      question: "Which valvular lesion is present, and how will the intensity of this murmur change when the patient performs a Valsalva strain versus active squatting?",
      options: [
        "Aortic Stenosis; Murmur intensity DECREASES during Valsalva strain and INCREASES during active Squatting",
        "Aortic Stenosis; Murmur intensity INCREASES during Valsalva strain and DECREASES during Squatting",
        "Hypertrophic Cardiomyopathy; Murmur intensity increases with both maneuvers",
        "Mitral Regurgitation; Murmur radiates to the axilla and does not change with dynamic maneuvers"
      ],
      correctAnswerIndex: 0,
      explanation: "The clinical findings (pulsus parvus et tardus, heaving apex beat, and harsh systolic ejection murmur at the right 2nd ICS radiating to the carotids) are diagnostic of Severe Aortic Stenosis. Dynamic maneuvers that decrease venous return and left ventricular preload (such as the strain phase of Valsalva) decrease flow across the stenotic aortic valve, thereby DECREASING the intensity of the murmur. Conversely, maneuvers that increase preload and afterload (such as Squatting) increase transvalvular flow and INCREASE the murmur intensity (unlike Hypertrophic Cardiomyopathy, which behaves in the exact opposite manner)."
    }
  ]
};
