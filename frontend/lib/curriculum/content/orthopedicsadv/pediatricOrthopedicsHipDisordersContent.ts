/**
 * Clinical Orthopedics Advanced: Pediatric Orthopedics & Hip Disorders
 * Authoritative pediatric orthopedic content derived from Tachdjian's (6th ed.), Lovell and Winter's.
 * Mapped to NMC CBME Competencies: OR5.1, OR5.2, PE19.1, SU43.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PEDIATRIC_ORTHOPEDICS_HIP_DISORDERS_MODULE: PhysiologyLessonModule = {
  id: "orthopedics-adv-pediatric-hip",
  unitCode: "OR5.1",
  title: "Pediatric Orthopedics: Developmental Dysplasia (DDH), SCFE & Legg-Calvé-Perthes Disease",
  competencies: ["OR5.1", "OR5.2", "PE19.1", "SU43.3"],
  estimatedMinutes: 150,
  organ3dTarget: "MUSCULOSKELETAL",
  markdownContent: `
# Pediatric Orthopedics: DDH, SCFE & Legg-Calvé-Perthes Disease

Pediatric hip disorders represent age-specific biomechanical and vascular pathologies requiring prompt radiographic diagnosis to prevent avascular necrosis and early degenerative arthritis.

---

## 1. Major Pediatric Hip Pathologies Comparative Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Disorder} & \\textbf{Typical Age \u0026 Demographics} & \\textbf{Clinical Presentation \u0026 Physical Signs} & \\textbf{Diagnostic Imaging} & \\textbf{Definitive Orthopedic Management} \\\\
\\hline
\\textbf{DDH} & \\mathbf{\\text{Neonates \u0026 Infants}} & \\mathbf{\\text{Ortolani (+ relocation),}} & \\mathbf{\\text{Dynamic Ultrasound}} & \\mathbf{\\text{Pavlik Harness (first-line)}} \\\\
(\\text{Dysplasia}) & (\\text{Female, breech, 1st-born}) & \\mathbf{\\text{Barlow (+ dislocation), Galeazzi}} & (\\text{if } < 6\\text{ months; X-ray if } \\ge 6\\text{m}) & (\\text{maintains hip flexion + abduction}) \\\\
\\textbf{LCPD} & \\mathbf{4 - 8\\text{ years}} & \\text{Insidious painless / mild limp,} & \\text{Pelvis AP \u0026 Frog-leg lateral:} & \\text{Observation / physical therapy;} \\\\
(\\text{Perthes}) & (\\text{Boys } 4:1\\text{ girls}) & \\text{loss of internal rotation \u0026 abduction} & \\mathbf{\\text{Crescent sign, femoral collapse}} & \\text{containment osteotomy if severe} \\\\
\\textbf{SCFE} & \\mathbf{11 - 14\\text{ years}} & \\mathbf{\\text{Dull groin / REFERRED KNEE PAIN,}} & \\mathbf{\\text{Frog-leg X-ray: Klein line fails}} & \\mathbf{\\text{EMERGENT In Situ Single Cannulated}} \\\\
(\\text{Slipped Epiphysis}) & (\\text{Obese adolescent boys}) & \\mathbf{\\text{obligatory external rotation on flexion}} & \\mathbf{\\text{to intersect femoral head}} & \\mathbf{\\text{Screw Fixation (NEVER reduce!)}} \\\\
\\textbf{Septic} & \\text{Any pediatric age} & \\text{Acute fever, refusal to bear weight,} & \\text{Kocher Criteria (Fever, non-weight} & \\mathbf{\\text{Emergent Arthrotomy \u0026 Drainage}} \\\\
\\textbf{Arthritis} & (\\text{neonates / toddlers}) & \\text{hip flexed/abducted/externally rotated} & \\text{bearing, ESR } >40\\text{, WBC } >12\\text{k)} & + \\text{ IV empiric antibiotics (Cefazolin)} \\\\
\\hline
\\end{array}$$

---

## 2. Radiographic Milestones & Surgical Rules

- **Developmental Dysplasia of the Hip (DDH)**:
  - **Ortolani Maneuver**: Abduction of flexed hip relocates a dislocated femoral head into the acetabulum (palpable "clunk").
  - **Barlow Maneuver**: Adduction of flexed hip with posterior pressure dislocates an unstable femoral head out of the acetabulum.
  - **Pavlik Harness**: Dynamic harness maintaining hip in $\mathbf{100^\circ - 110^\circ\\text{ of flexion and } 40^\circ - 60^\circ\\text{ of abduction}}$ for $6 - 12\\text{ weeks}$.
- **Slipped Capital Femoral Epiphysis (SCFE)**:
  - Displacement of the femoral neck anterosuperiorly relative to the femoral head epiphysis through the **hypertrophic zone of the physis**.
  - **Klein's Line**: A line drawn along the superior border of the femoral neck on AP/frog-leg radiograph normally intersects the lateral aspect of the femoral epiphysis. In SCFE, Klein's line **fails to intersect the epiphysis** (Trethowan sign).
  - **SURGICAL RULE**: **DO NOT attempt closed reduction** (reductions tear the retinacular vessels of the medial femoral circumflex artery, precipitating catastrophic avascular necrosis). Perform **in situ percutaneous single screw fixation**.
`,
  clinicalVignettes: [
    {
      scenario: "A 13-year-old obese African American boy (BMI 34 kg/m2) presents to the clinic with a 3-week history of worsening right thigh and medial knee pain and an antalgic limp. His mother states he has not had any trauma, fever, or rash. On physical examination, there is no swelling, erythema, or tenderness around the knee joint. Examination of the right hip reveals restricted internal rotation and abduction; when the right hip is passively flexed to 90 degrees, it automatically drifts into obligatory external rotation. An AP and frog-leg lateral pelvic radiograph demonstrates a line drawn along the superior femoral neck that fails to intersect the capital femoral epiphysis.",
      question: "What is the diagnosis, and what is the mandatory next step in orthopedic management?",
      options: [
        "Slipped Capital Femoral Epiphysis (SCFE); make the patient strictly non-weight bearing and proceed with emergent in situ single cannulated screw fixation",
        "Osgood-Schlatter Disease; provide a patellar knee strap and encourage resumption of sports",
        "Legg-Calvé-Perthes Disease; place the child in a Pavlik harness",
        "Transient Synovitis of the Hip; administer oral Ibuprofen and discharge home"
      ],
      correctAnswerIndex: 0,
      explanation: "This obese adolescent boy presents with the classic presentation of Slipped Capital Femoral Epiphysis (SCFE). Key points include: (1) Demographics & Symptoms: SCFE classically affects obese adolescent boys (ages 11-14). Over 25% of patients present exclusively with referred knee or distal thigh pain via the obturator nerve, leading to delayed diagnosis if the hip is not examined; (2) Physical Exam: Obligatory external rotation during passive hip flexion is pathognomonic; (3) Imaging: Frog-leg lateral radiograph confirms slippage where Klein's line fails to intersect the epiphysis; (4) Management: The patient must immediately be made non-weight-bearing with crutches/wheelchair to prevent complete displacement, followed by emergent in situ percutaneous single cannulated screw fixation. Forced closed reduction is contraindicated due to high risk of osteonecrosis."
    }
  ]
};
